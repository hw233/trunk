import ChatEventCtrl from '../../chat/ctrl/ChatEventCtrl';
import ChatUtils from '../../chat/utils/ChatUtils';
import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';

/** 
 * 聊天List子项控制器
 * @Author: luoyong  
 * @Description: 
 * @Date:2019-07-16 15:38:09
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 11:45:54
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/GMChatItemCtrl")
export default class GMChatItemCtrl extends cc.Component {

    @property(cc.RichText)
    chatText: cc.RichText = null;

    @property(cc.Node)
    TextBg: cc.Node = null

    @property(cc.Node)
    item1: cc.Node = null

    @property(cc.Node)
    item2: cc.Node = null

    @property(cc.Sprite)
    icon1: cc.Sprite = null

    @property(cc.Sprite)
    icon2: cc.Sprite = null

    @property(cc.Label)
    timeLab: cc.Label = null

    @property(cc.Label)
    nameLab: cc.Label = null

    data: icmsg.FeedbackReply = null

    get model(): RoleModel { return ModelManager.get(RoleModel); }
    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }

    start() {
        this.chatText.addComponent(ChatEventCtrl)
    }

    updateView(data) {
        this.data = data
        this.chatText.string = ChatUtils.parseGMText(this.data.content);
        let textHeight = this.chatText.node.height
        let bgHeight = Math.max(textHeight + 50, 82)
        this.TextBg.height = bgHeight
        this.node.height = bgHeight + 25
        let sendId = this.data.type;
        let myId = 1;
        this.item1.active = sendId != myId
        this.item2.active = sendId == myId
        let nameStr = ""
        if (sendId == myId) {
            nameStr = "我"
            this.nameLab.node.color = cc.color("#348705")
            this.TextBg.scaleX = -1
            this.TextBg.x = 10
            // 更新自己头像
        } else {
            this.TextBg.scaleX = 1
            nameStr = "天字号客服"
            this.nameLab.node.color = cc.color("#58AEFF")
            this.TextBg.x = -5
            // 更新对方头像
        }
        this.nameLab.string = nameStr

        let date = new Date(this.data.time * 1000)
        this.timeLab.string = `${GlobalUtil.padLeft(date.getHours(), 2)}:${GlobalUtil.padLeft(date.getMinutes(), 2)}`
    }
}
