import ChatModel, { LinkStr, PrivatePlayer } from '../../chat/model/ChatModel';
import ChatUtils from '../../chat/utils/ChatUtils';
import MaskWordUtils from '../../../common/utils/MaskWordUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import UiScrollView from '../../../common/widgets/UiScrollView';
import { ChatChannel } from '../../chat/enum/ChatChannel';
import { ChatEvent } from '../../chat/enum/ChatEvent';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
 * @Description: 私聊界面控制器
 * @Author: weiliang.huang  
 * @Date: 2019-05-21 19:29:58 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-31 16:22:24
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/PrivateChatCtrl")
export default class PrivateChatCtrl extends cc.Component {

    @property(cc.Label)
    titleLab: cc.Label = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;   // 头像scroll

    @property(cc.Node)
    content: cc.Node = null     // 头像content

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.ScrollView)
    ChatScroll: cc.ScrollView = null;   // 聊天scroll

    @property(cc.Node)
    chatContent: cc.Node = null // 聊天content

    @property(cc.Node)
    chatListSwitchNode: cc.Node = null; //聊天列表切换按钮

    // @property(cc.Node)
    // bottomTip: cc.Node = null

    @property(cc.Prefab)
    headItem: cc.Prefab = null

    @property(cc.Node)
    noChatTips: cc.Node = null //

    @property(cc.Label)
    titleLabel: cc.Label = null;

    /**是否处于控件最底层 */
    isBottomed: boolean = true
    list: ListView = null;  // 头像列表scroll list
    headList: Array<icmsg.ChatSendRsp> = []
    curChannel: number = -1
    scrollViewCom: UiScrollView = null
    targetInfo: PrivatePlayer = null
    curSelect: number = 0;
    linkTab: LinkStr[] = [] // 超链接信息表

    get chatModel(): ChatModel { return ModelManager.get(ChatModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get serModel(): ServerModel { return ModelManager.get(ServerModel); }

    onLoad() {
        this.scrollViewCom = this.ChatScroll.node.getComponent(UiScrollView);
        this.ChatScroll.node.on('scrolling', this.scorllEvents, this);
        this.scrollViewCom.init();
    }

    onDestroy() {
        this.unscheduleAllCallbacks()
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
    }

    onEnable() {
        gdk.e.on(ChatEvent.INPUT_TEXT_INFO, this._addText, this)
        gdk.e.on(ChatEvent.ADD_PRIVATE_CHAT, this._addPrivateChat, this)
        gdk.e.on(ChatEvent.ADD_NEW_PRIVATE_CHAT, this._addNewHead, this)
        gdk.e.on(ChatEvent.ADD_SEND_GUILD_CHAT, this._addSendGuildChat, this)
        // this.bottomTip.active = false
        this._showChatList(true);
        this._updateHeadScroll()
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.headItem,
            cb_host: this,
            async: true,
            gap_y: 15,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._onHeadClick, this)
    }

    _onHeadClick(data: PrivatePlayer, index) {
        this.curSelect = index;
        this.targetInfo = data;
        this.linkTab = [];
        this.InputBox.string = "";
        this.chatModel.unRedMessages[this.targetInfo.id.toLocaleString()] = 0;
        this._showChatList(false);
        this._updateChatPanel();
    }

    /**更新头像列表 */
    _updateHeadScroll() {
        this._initListView()
        let recent = this.chatModel.recentPlayers
        let infos = [...recent]
        this.titleLab.string = `${gdk.i18n.t("i18n:FRIEND_TIP14")}:${infos.length}/50`
        this.list.clear_items();
        this.list.set_data(infos)
        this.noChatTips.active = infos.length == 0;
    }

    /**收到私聊信息 */
    _addPrivateChat(e: gdk.Event) {
        if (!this.node.active || !this.targetInfo) {
            return
        }
        let data: icmsg.ChatSendRsp = e.data
        if (data.playerLv > 0 && data.playerLv != this.targetInfo.level) {
            this.targetInfo.level = data.playerLv;
        }
        if (data.playerId.toLocaleString() != this.targetInfo.id.toLocaleString()) {
            if (data.playerId.toLocaleString() != this.roleModel.id.toLocaleString()) {
                this._updateUnRedMsgNum();
            }
            return
        }
        this.ChatScroll.node.active && (this.chatModel.unRedMessages[this.targetInfo.id.toLocaleString()] = 0);
        this._updateChatPanel(false)
    }

    _addSendGuildChat(e: gdk.Event) {
        if (!this.node.active || !this.targetInfo) {
            return
        }
        this.ChatScroll.node.active && (this.chatModel.unRedMessages[this.targetInfo.id.toLocaleString()] = 0);
        let mess = this.chatModel.privateMessages[this.targetInfo.id.toLocaleString()] || []
        if (mess.length > 0) {
            this.scrollViewCom.append_data([mess[mess.length - 1]])
        }
    }

    /**添加新的聊天对象 */
    _addNewHead(e: gdk.Event) {
        if (!this.node.active) {
            return
        }
        let recent = this.chatModel.recentPlayers
        let player: PrivatePlayer = e.data
        this.list.insert_data(0, player)
        this.titleLab.string = `${gdk.i18n.t("i18n:FRIEND_TIP14")}:${recent.length}/50`
        if (recent.length == 1) {
            this.scheduleOnce(() => {
                this.list.select_item(0)
            })
        }
        this.noChatTips.active = recent.length == 0;
    }

    /**刷新聊天界面 */
    _updateChatPanel(clear: boolean = true) {
        let curId = this.targetInfo.id.toLocaleString()
        let mess = this.chatModel.privateMessages[curId] || []
        if (clear) {
            this.scrollViewCom.clear_items()
            this.scrollViewCom.set_data(mess)
        }
        else {
            this.scrollViewCom.append_data([mess[mess.length - 1]]);
        }
        this.scheduleOnce(() => {
            this.scrollToBottom()
        })
        // 清除红点标记
        RedPointUtils.save_state('chat_private', false)
    }

    _showChatList(b: boolean) {
        this.scrollView.node.active = b;
        this.ChatScroll.node.active = !b;
        this.node.getChildByName('InputPanel').active = !b;
        b && this._updateHeadScroll();
        this.titleLabel.string = b ? gdk.i18n.t("i18n:FRIEND_TIP19") : `${this.targetInfo.name}`;
        !b && this._updateUnRedMsgNum();
    }

    _updateUnRedMsgNum() {
        let unRedMsgs = this.chatModel.unRedMessages;
        let num = 0;
        for (let key in unRedMsgs) {
            num += unRedMsgs[key];
        }
        this.chatListSwitchNode.getChildByName('unRedNode').active = num > 0;
        cc.find('unRedNode/numLabel', this.chatListSwitchNode).getComponent(cc.Label).string = num + '';
    }

    /**滑动条拖动监测
     * 不是在最底部时,不自动置底
     */
    scorllEvents(scroll: cc.ScrollView) {
        let offset = scroll.getScrollOffset()
        // let listHeight = this.chatContent.height
        // let scrollHeight = this.ChatScroll.node.height
        if (offset >= scroll.getMaxScrollOffset()) {
            this.isBottomed = true
        } else {
            this.isBottomed = false
        }

        // if (listHeight > scrollHeight && !this.isBottomed) {
        //     this.bottomTip.active = true
        // } else {
        //     this.bottomTip.active = false
        // }
    }

    /**
     * ScrollView置底
     * 只有玩家在非拖动状态,并且处于最底部,才会置底
     */
    scrollToBottom(e: cc.Event.EventTouch = null) {
        if (e) {
            // this.bottomTip.active = false
            this.isBottomed = true
            this.scrollViewCom.scroll_to_end();
            return
        }
        let listHeight = this.chatContent.height
        let scrollHeight = this.ChatScroll.node.height
        if (listHeight > scrollHeight && !this.ChatScroll.isScrolling() && this.isBottomed) {
            this.scrollViewCom.scroll_to_end();
            // this.bottomTip.active = false
            this.isBottomed = true
        }
    }

    /**发送聊天信息
     * 并把聊天信息记录到相应的私聊表中
     */
    sendFunc() {
        if (!this.targetInfo) {
            gdk.GUIManager.showMessage(gdk.i18n.t("i18n:FRIEND_TIP20"))
            return
        }

        let text = ChatUtils.filter(this.InputBox.string)
        if (text == "") {
            gdk.GUIManager.showMessage(gdk.i18n.t("i18n:CHAT_TIP7"))
            return
        }

        this.InputBox.string = ""
        // 先把满足条件的文本转换为#<index>的格式
        // 因为有可能出现超文本相同的情况,因此要先转换一遍格式
        for (let index = 0; index < this.linkTab.length; index++) {
            const element = this.linkTab[index];
            if (text.indexOf(element[0]) >= 0) {
                text = text.replace(element[0], `#<${index}>`)
            }
        }

        let equips = []
        for (let index = 0; index < this.linkTab.length; index++) {
            const element = this.linkTab[index];
            let linkStr = element[1]
            // 装备点击要特殊处理
            // 找出param参数,把唯一id改成@equip+对应的装备下标
            if (linkStr.indexOf("equipClick") >= 0) {
                let id = linkStr.replace(/.*param='{(.+)}'.*/, "$1")
                if (id) {
                    linkStr = linkStr.replace(/{.*}/, `{@equip${equips.length}}`)
                    equips.push(parseInt(id))
                }
            }
            text = text.replace(`#<${index}>`, linkStr)
        }
        this.linkTab = []

        let msg = new icmsg.ChatSendReq();
        msg.channel = ChatChannel.PRIVATE;
        msg.content = MaskWordUtils.filter(text);
        // msg.equips = [];
        msg.targetId = this.targetInfo.id
        NetManager.send(msg)

        let info = new icmsg.ChatSendRsp()
        let roleModel = this.roleModel
        info.playerId = roleModel.id
        info.playerName = roleModel.name
        info.playerHead = roleModel.head
        info.channel = ChatChannel.PRIVATE
        info.chatTime = this.serModel.serverTime
        info.playerFrame = roleModel.frame
        info.playerLv = roleModel.level
        // info.equips = []
        info.content = text
        let curId = this.targetInfo.id.toLocaleString()
        let privateMessages = this.chatModel.privateMessages
        if (!privateMessages[curId]) {
            privateMessages[curId] = []
        }
        privateMessages[curId].push(info)
        this._updateChatPanel(false)
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
                gdk.gui.showMessage(gdk.i18n.t("i18n:CHAT_TIP9"))
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

    selectChat(idx: number = 0) {
        if (this.list && this.list.items.length >= idx + 1) {
            this.list.select_item(idx);
        }
    }

    onTextChanged() {
        this.onEditEnded();
    }

    checkValidLen(txt) {
        let code;
        let len = txt.length;
        let byteLen = len;
        for (let i = 0; i < len; i++) {
            code = txt.charCodeAt(i);
            if (code > 255) { byteLen++; }
            if (byteLen > 60) {
                return i + 1;
            }
        }
        return len;
    }

    /**判断超链接文本是否还存在 */
    onEditEnded() {
        let idx = 0
        let str = this.InputBox.string
        while (idx < this.linkTab.length) {
            let ele = this.linkTab[idx]
            if (str.indexOf(ele[0]) < 0) {
                this.linkTab.splice(idx, 1)
            } else {
                // 这里替换掉是避免单个文本多次匹配超链接
                str = str.replace(ele[0], "")
                idx++
            }
        }
        // this.chatInputText = this.InputBox.string
        // console.log(str, this.model.linkTab)
        if (str) {
            // let len = this.checkValidLen(str);
            if (50 < str.length) {
                str = str.substring(0, 50);
                gdk.gui.showMessage(gdk.i18n.t("i18n:CHAT_TIP10"));
                this.InputBox.string = str;
            }
        }
    }

    /**
     * 切换聊天列表
     */
    onChatListSwitchBtnClick() {
        this._showChatList(true);
    }
}
