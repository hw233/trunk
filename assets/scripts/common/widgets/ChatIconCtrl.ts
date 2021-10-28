import ChatModel from '../../view/chat/model/ChatModel';
import ChatUtils from '../../view/chat/utils/ChatUtils';
import ModelManager from '../managers/ModelManager';
import { ChatChannel } from '../../view/chat/enum/ChatChannel';
import { ChatEvent } from '../../view/chat/enum/ChatEvent';

/**
 * 聊天快捷打开图标
 * @Author: sthoo.huang
 * @Date: 2019-11-28 20:13:52
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 13:13:19
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/ChatIconCtrl")
export default class ChatIconCtrl extends cc.Component {
    @property(cc.Node)
    chatMask: cc.Node = null;

    @property(cc.RichText)
    chatText: cc.RichText = null;

    @property(cc.RichText)
    chatText2: cc.RichText = null;

    onEnable() {
        gdk.NodeTool.hide(this.chatMask, false);
        gdk.e.on(ChatEvent.ADD_CHAT_INFO, this._addMainChat, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    _addMainChat() {
        let chatInfos = ModelManager.get(ChatModel).AllMessages;
        if (chatInfos.length == 0) {
            this._hideChat();
            return;
        }
        gdk.NodeTool.show(this.chatMask);
        if (chatInfos.length == 1) {
            this.chatText.string = this._getShowText(chatInfos[chatInfos.length - 1]);
        }

        if (chatInfos.length > 1) {
            this.chatText.string = this._getShowText(chatInfos[chatInfos.length - 2]);
            this.chatText2.string = this._getShowText(chatInfos[chatInfos.length - 1]);
        }
        this._layoutBg(chatInfos.length);
        gdk.Timer.once(60000, this, this._hideChat);
    }

    _layoutBg(len: number) {
        let width;
        let height;
        let showMaxLen = 425;
        if (len == 1) {
            height = 40;
            width = this.chatText.node.width + 20;
        }
        else if (len > 1) {
            height = 80;
            width = Math.max(this.chatText.node.width, this.chatText2.node.width) + 20;
        }
        width = width > showMaxLen ? showMaxLen : width;
        this.chatMask.getChildByName('bg').height = height;
        this.chatMask.getChildByName('bg').width = width;
        this.chatMask.getChildByName('chatMask').width = width - 20;
    }

    _hideChat() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        gdk.Timer.clear(this, this._hideChat);
        gdk.NodeTool.hide(this.chatMask);
    }

    _getShowText(chatInfo: icmsg.ChatSendRsp) {
        let text = ""
        if (chatInfo.channel == ChatChannel.SYS) {
            text = `<color=#F54922>【系统】</c>`
            text += ChatUtils.convertSceneColor(ChatUtils.parseText(chatInfo));
        } else if (chatInfo.channel == ChatChannel.WORLD) {
            text = `<color=#66D6EE>【世界】</c>`
            text += `<u>${chatInfo.playerName}</u>: `
                + ChatUtils.convertSceneColor(ChatUtils.parseText(chatInfo))
        } else if (chatInfo.channel == ChatChannel.GUILD) {
            text = `<color=#E4A137>【公会】</c>`
            text += `<u>${chatInfo.playerName}</u>: `
                + ChatUtils.convertSceneColor(ChatUtils.parseText(chatInfo))
        }
        return text;
    }
}