import ChatUtils from '../../chat/utils/ChatUtils';
import FriendModel from '../model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeadItemCtrl from './HeadItemCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import UiScrollView from '../../../common/widgets/UiScrollView';
import { ChatEvent } from '../../chat/enum/ChatEvent';
import { FriendEventId } from '../enum/FriendEventId';
import { LinkStr } from '../../chat/model/ChatModel';

/** 
 * @Description: 反馈界面控制器
 * @Author: luoyong
 * @Date: 2019-07-16 15:04:39
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 11:45:41
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/GMChatCtrl")
export default class GMChatCtrl extends cc.Component {
    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.ScrollView)
    ChatScroll: cc.ScrollView = null;   // 聊天scroll

    @property(cc.Node)
    chatContent: cc.Node = null // 聊天content

    @property(cc.Node)
    bottomTip: cc.Node = null

    @property(cc.Node)
    GMHead: cc.Node = null

    scrollViewCom: UiScrollView = null
    linkTab: LinkStr[] = [] // 超链接信息表
    /**是否处于控件最底层 */
    isBottomed: boolean = true
    headItem: HeadItemCtrl;

    get model(): FriendModel { return ModelManager.get(FriendModel); }

    onLoad() {
        this.scrollViewCom = this.ChatScroll.node.getComponent(UiScrollView);
        this.scrollViewCom.init();
    }

    start() {
        this._inteGMHead()
    }

    onDestroy() {
        this.unscheduleAllCallbacks()
    }

    onEnable() {
        NetManager.send(new icmsg.FeedbackInfoReq());
        gdk.e.on(ChatEvent.INPUT_TEXT_INFO, this._addText, this)
        gdk.e.on(FriendEventId.UPDATE_FEEDBACK_LIST, this._updateChatPanel, this)

    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    _inteGMHead() {
        this.headItem = this.GMHead.getComponent(HeadItemCtrl);
        // this.headItem.nameLab.string = "天字号客服";
        GlobalUtil.setSpriteIcon(this.node, this.headItem.icon, GlobalUtil.getHeadIconById(0));
        // GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadFrameById(0));

    }


    /**刷新聊天界面 */
    _updateChatPanel() {
        this.scrollViewCom.clear_items()
        this._updateFeedBackList();
        this.scheduleOnce(() => {
            this.scrollToBottom()
        })

        RedPointUtils.save_state('gm_feedback', false)
    }

    /**
     * ScrollView置底
     * 只有玩家在非拖动状态,并且处于最底部,才会置底
     */
    scrollToBottom(e: cc.Event.EventTouch = null) {
        if (e) {
            this.isBottomed = true
            this.scrollViewCom.scroll_to_end();
            return
        }
        let listHeight = this.chatContent.height
        let scrollHeight = this.ChatScroll.node.height
        if (listHeight > scrollHeight && !this.ChatScroll.isScrolling() && this.isBottomed) {
            this.scrollViewCom.scroll_to_end();
            this.isBottomed = true
        }
    }

    _updateFeedBackList() {
        let list = this.model.feedBackList;
        this.scrollViewCom.set_data(list);
    }

    /**显示表情选择面板 */
    showFaceView() {
        gdk.panel.open('Face', (node: cc.Node) => {
            node.setPosition(cc.v2(20, -300))
        })
    }

    /**插入文字 */
    _addText(e) {
        let str = e.data
        let addStr = str
        let regex = /<.+?\/?>/g
        // 如果这个长度大于0 ,则证明是超链接文本
        const matchArr = str.match(regex);
        let linkTab = this.linkTab
        if (matchArr && matchArr.length > 0) {
            if (linkTab.length >= 3) {
                gdk.gui.showMessage("分享道具已满")
                return
            }
            for (let index = 0; index < matchArr.length; index++) {
                const ele = matchArr[index];
                addStr = addStr.replace(ele, "")
            }
            linkTab.push([addStr, str])
        }

        let text = this.InputBox.string
        if (text.length >= 50) {
            return
        }
        this.InputBox.string = text + addStr
        // this.textLabel.node.active = false
    }

    /**发送聊天信息
   * 并把聊天信息记录到相应的私聊表中
   */
    sendFunc() {

        let text = ChatUtils.filter(this.InputBox.string)
        if (text == "") {
            gdk.GUIManager.showMessage("输入框为空")
            return
        }
        this.InputBox.string = ""
        let msg = new icmsg.FeedbackByRoleReq();
        msg.content = text;
        NetManager.send(msg);

        let info = new icmsg.FeedbackReply()
        info.type = 1;
        info.time = Math.floor(Date.now() / 1000);
        info.content = text;

        let list = this.model.feedBackList;
        list.push(info)
        this._updateChatPanel();
    }
}
