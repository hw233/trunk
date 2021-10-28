import ChatEventCtrl from './ChatEventCtrl';
import ChatUtils from '../utils/ChatUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import StringUtils from '../../../common/utils/StringUtils';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { ChatChannel } from '../enum/ChatChannel';
/** 
 * 聊天List子项控制器
 * @Author: luoyong 
 * @Description: 
 * @Date: 2019-03-21 18:03:49 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-01 17:56:17
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/chat/MiniChatItemCtrl")
export default class MiniChatItemCtrl extends cc.Component {

    @property(cc.Node)
    chatNode: cc.Node = null

    @property(cc.Node)
    sysNode: cc.Node = null

    @property(cc.Node)
    channelIcon: cc.Node = null

    @property(cc.Node)
    nameBg: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.RichText)
    content: cc.RichText = null

    @property(cc.Label)
    tempLab: cc.Label = null

    @property(cc.RichText)
    sysContent: cc.RichText = null

    _chatRsp: icmsg.ChatSendRsp

    _richTextYOff = 7
    _maxHeight = 84

    onLoad() {

    }

    start() {
        if (!this.content.getComponent(ChatEventCtrl)) {
            this.content.addComponent(ChatEventCtrl)
        }
    }

    updateView(data) {
        this._chatRsp = data
        if (this._chatRsp.channel == ChatChannel.SYS || (this._chatRsp.playerId == 0 && this._chatRsp.playerName == "")) {
            this.chatNode.active = false
            this.sysNode.active = true
            if (this._chatRsp.channel == ChatChannel.GUILD) {
                let icon = cc.find("icon", this.sysNode)
                GlobalUtil.setSpriteIcon(this.node, icon, `view/chat/texture/bg_liaotiangonhuixiao`)
            } else if (this._chatRsp.channel == ChatChannel.CROSSACT) {
                let icon = cc.find("icon", this.sysNode)
                GlobalUtil.setSpriteIcon(this.node, icon, `view/chat/texture/bg_liaotiakuafuxiao`)
            }
            this.sysContent.string = ChatUtils.parseText(this._chatRsp)//StringUtils.setRichtOutLine(, "#33190A", 2)
            let h1 = this.sysContent.node.getContentSize().height + this._richTextYOff
            this.node.height = Math.max(h1, this._maxHeight)
            this.sysContent.handleTouchEvent = false
        } else {
            this.chatNode.active = true
            this.sysNode.active = false

            let path = ''
            if (this._chatRsp.channel == ChatChannel.SYS) {
                path = `view/chat/texture/bg_liaotianxitonxiao`
            } else if (this._chatRsp.channel == ChatChannel.WORLD) {
                path = `view/chat/texture/bg_shijiexiao`
            } else if (this._chatRsp.channel == ChatChannel.GUILD) {
                path = `view/chat/texture/bg_liaotiangonhuixiao`
            } else if (this._chatRsp.channel == ChatChannel.CROSSACT) {
                path = `view/chat/texture/bg_liaotiakuafuxiao`
            }
            GlobalUtil.setSpriteIcon(this.node, this.channelIcon, path)

            this.nameLab.string = this._chatRsp.playerName
            this.nameLab['_forceUpdateRenderData'](true)
            let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
            vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._chatRsp.playerVipExp))
            let nameWidth = this.channelIcon.width + this.nameLab.node.getContentSize().width + 10
            this.vipFlag.x = nameWidth
            let nullWidth = 0
            if (this.vipFlag.active) {
                nullWidth = this.nameLab.node.getContentSize().width + 10 + this.vipFlag.width
            } else {
                nullWidth = this.nameLab.node.getContentSize().width + 10
            }
            this.tempLab.string = ''
            this.tempLab.node.width = 0
            while (this.tempLab.node.width < nullWidth) {
                this.tempLab.string += " "
                this.tempLab['_forceUpdateRenderData'](true)
            }
            this.content.string = ''
            this.content.string = this.tempLab.string + ChatUtils.parseText(this._chatRsp)//StringUtils.setRichtOutLine(, "#33190A", 2)
            this.node.height = this.content.node.getContentSize().height + this._richTextYOff
            this.content.handleTouchEvent = false
        }
    }

}