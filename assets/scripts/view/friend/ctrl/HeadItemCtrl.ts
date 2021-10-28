import ChatModel, { PrivatePlayer } from '../../chat/model/ChatModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import UiListItem from '../../../common/widgets/UiListItem';
import { ChatEvent } from '../../chat/enum/ChatEvent';
/** 
  * @Description: 好友私聊界面,头像item
  * @Author: weiliang.huang  
  * @Date: 2019-05-21 19:29:39 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 11:46:06
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/HeadItemCtrl")
export default class HeadItemCtrl extends UiListItem {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Sprite)
    frame: cc.Sprite = null

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Label)
    lvLabel: cc.Label = null

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.RichText)
    chatLabel: cc.RichText = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    unRedNode: cc.Node = null;

    // @property(cc.Label)
    // nameLab: cc.Label = null

    onEnable() {
        gdk.e.on(ChatEvent.ADD_PRIVATE_CHAT, this._onAddPrivateChat, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    updateView() {
        let info: PrivatePlayer = this.data
        let mess = ModelManager.get(ChatModel).privateMessages[info.id.toLocaleString()] || [];
        let unRedMsg = ModelManager.get(ChatModel).unRedMessages[info.id.toLocaleString()] || 0;
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(info.head));
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(info.frame));
        this.lvLabel.string = info.level.toString();
        this.nameLabel.string = info.name;
        this.unRedNode.active = unRedMsg > 0;
        this.unRedNode.getChildByName('num').getComponent(cc.Label).string = unRedMsg + '';
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/friend/texture/friend/${unRedMsg > 0 ? 'bg_haoyouliebiaoliandi' : 'bg_haoyouliebiaoandi'}`);
        if (!mess || mess.length <= 0) {
            this.chatLabel.string = '';
            this.timeLabel.string = '';
        }
        else {
            let lastMsg: icmsg.ChatSendRsp = mess[mess.length - 1];
            let str = lastMsg.content.replace(/#[0-9][0-9]*#/g, '[动画表情]');
            let limtLen = 15;
            if (lastMsg.content.indexOf("joinGuildClick") != -1) {
                this.chatLabel.string = lastMsg.content
            } else {
                this.chatLabel.string = str.length > limtLen ? str.substring(0, limtLen) + '...' : str;
            }
            let date = new Date(lastMsg.chatTime);
            this.timeLabel.string = `${GlobalUtil.padLeft(date.getHours(), 2)}:${GlobalUtil.padLeft(date.getMinutes(), 2)}`;
        }
        this.chatLabel.handleTouchEvent = false
    }

    _onAddPrivateChat(e: gdk.Event) {
        let data: icmsg.ChatSendRsp = e.data;
        if (data && data.playerId == this.data.id) {
            let unRedMsg = ModelManager.get(ChatModel).unRedMessages[data.playerId.toLocaleString()] || 0;
            this.unRedNode.active = unRedMsg > 0;
            this.unRedNode.getChildByName('num').getComponent(cc.Label).string = unRedMsg + '';
            GlobalUtil.setSpriteIcon(this.node, this.bg, `view/friend/texture/friend/${unRedMsg > 0 ? 'bg_haoyouliebiaoliandi' : 'bg_haoyouliebiaoandi'}`);
        }
    }

    _itemSelect() {
        // GlobalUtil.setSpriteIcon(this.node, this.bg, `view/friend/texture/friend/${this.ifSelect ? 'bg_haoyouliebiaoliandi' : 'bg_haoyouliebiaoandi'}`)
    }
}
