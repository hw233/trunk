import ChatModel from '../../view/chat/model/ChatModel';
import ChatUtils from '../../view/chat/utils/ChatUtils';
import ConfigManager from '../managers/ConfigManager';
import ErrorManager from '../managers/ErrorManager';
import FriendModel from '../../view/friend/model/FriendModel';
import FriendViewCtrl from '../../view/friend/ctrl/FriendViewCtrl';
import GlobalUtil from '../utils/GlobalUtil';
import GuildUtils from '../../view/guild/utils/GuildUtils';
import HeroModel from '../models/HeroModel';
import HeroUtils from '../utils/HeroUtils';
import JumpUtils from '../utils/JumpUtils';
import ModelManager from '../managers/ModelManager';
import NetManager from '../managers/NetManager';
import PanelId from '../../configs/ids/PanelId';
import PrivateChatCtrl from '../../view/friend/ctrl/PrivateChatCtrl';
import RoleModel from '../models/RoleModel';
import ServerModel from '../models/ServerModel';
import { ChatChannel } from '../../view/chat/enum/ChatChannel';
import { ChatEvent } from '../../view/chat/enum/ChatEvent';
import { Comments_globalCfg, SystemCfg } from '../../a/config';
import { CommentType } from '../../view/role/ctrl2/main/comment/HeroCommentPanelCtrl';
import { GuildEventId } from '../../view/guild/enum/GuildEventId';
import { GuildTitle } from '../../view/guild/model/GuildModel';
import { RoleEventId } from '../../view/role/enum/RoleEventId';

const { ccclass, property, menu } = cc._decorator;

export enum BtnMenuType {
    PRIVATE = 0,//私聊
    DETAIL = 1,//查看详情
    ADD_FRIEND = 2,//添加好友
    DELETE_FRIEND = 3,//删除好友
    ADD_BLACK = 4,//屏蔽
    OUT_BLACK = 5,//取消屏蔽
    KICK = 6,//驱逐出会
    SET_VICEPRESIDENT = 7,//任命副会长
    REMOVE_VICEPRESIDENT = 8,//解除副会长
    GIVE_PRESIDENT = 9,//移交会长
    SEND_JOIN_GUILD = 10,//邀请入会
    REPORT_CHAT = 11,//聊天举报
    CHAT_WORLD_SEND = 12,//世界频道聊天发送
    CHAT_GUILD_SEND = 13,//公会频道聊天发送
    SET_TEAMLEADER = 14,//设置战斗队长
    REMOVE_TEAMLEADER = 15,//接触战斗队长
}

const BTN_TEXTS = [
    "私聊",
    "查看详情",
    "添加好友",
    "删除好友",
    "屏蔽",
    "取消屏蔽",
    "驱逐出会",
    "任命副会长",
    "解除副会长",
    "移交会长",
    "公会邀请",
    "举报",
    "世界频道",
    "公会频道",
    "任命战斗队长",
    "解除战斗队长"
]
const BTN_HANDLES = [
    "privateChat",
    "detailFunc",
    "addFriendFunc",
    "deleteFriendFunc",
    "addBlackFunc",
    "outBlackFunc",
    "quitGuildFunc",
    "setFuPresidentFunc",
    "removeFuPresidentFunc",
    "givePresidentFunc",
    "guildInviteFunc",
    "reportChatFunc",
    "chatWorldSendFunc",
    "chatGuildSendFunc",
    "setTeamLeaderFunc",
    "removeTeamLeaderFunc",
]

export type BtnTypePlayer = {
    id: number, // 玩家id
    headId?: number,    // 头像id
    headBgId?: number,   // 头像框id
    name?: string, // 玩家名字
    level?: number,    // 玩家等级
    chatContent?: string, // 聊天内容
    extInfo?: any, //可拓展参数
}

@ccclass
@menu("qszc/common/widgets/BtnMenuCtrl")
export default class BtnMenuCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    btn: cc.Node = null

    target: cc.Node = null

    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel) }
    get chatModel(): ChatModel { return ModelManager.get(ChatModel) }
    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel); }

    start() {

    }

    /**
     * 显示菜单栏
     * @param target 目标按钮,需要根据node位置动态更改菜单栏位置
     * @param btns 按钮类型组合
     * @param info 按钮透传信息
     */
    showBtns(target: cc.Node = null, btns: BtnMenuType[], info: BtnTypePlayer) {
        if (btns.length == 0) {
            this.close()
            return
        }
        this.bg.active = false
        btns.sort((a, b) => {
            let nameA = BTN_TEXTS[a];
            let nameB = BTN_TEXTS[b];
            if (nameA.length === nameB.length) {
                return a - b;
            }
            else {
                return nameB.length - nameA.length;
            }
        });
        this.target = target
        let len = btns.length
        for (let index = 0; index < len - 1; index++) {
            let btn = cc.instantiate(this.btn)
            btn.parent = this.bg
        }
        for (let index = 0; index < len; index++) {
            const type = btns[index];
            let btn = this.bg.children[index]
            let lab = btn.getChildByName("Label").getComponent(cc.Label)
            lab.string = BTN_TEXTS[type]
            btn.on(cc.Node.EventType.MOUSE_ENTER, () => {
                lab.node.color = new cc.Color().fromHEX('#FFFAD5');
            }, this);
            btn.on(cc.Node.EventType.MOUSE_LEAVE, () => {
                lab.node.color = new cc.Color().fromHEX('#D7B493');
            }, this);
            btn.once('click', () => {
                let handler = BTN_HANDLES[type]
                this[handler].call(this, info)
                this.close()
                btn.targetOff(this);
            }, this)
            // let handler: cc.Component.EventHandler = new cc.Component.EventHandler();
            // handler.target = this.node;
            // handler.component = "BtnMenuCtrl";
            // handler.handler = BTN_HANDLES[type];
            // handler.customEventData = info;
            // btn.getComponent(cc.Button).clickEvents.push(handler)
        }
        this._updatePos()
    }

    _updatePos() {
        if (!this.target) {
            this.bg.setPosition(cc.v2(0, 0))
            return
        }
        let len = this.bg.childrenCount
        let bWidth = this.bg.width
        // 背景实际高度
        let bHeight = len * this.btn.height + 2 * (len - 1) + 20

        // 算出target在node节点下的坐标
        let wPos = this.target.parent.convertToWorldSpaceAR(this.target.position)
        let inPos = this.node.convertToNodeSpaceAR(wPos)
        // 目标节点中心点横坐标
        let midX = inPos.x
        let anchorX = this.target.anchorX
        if (anchorX != 0.5) {
            let tarW = this.target.width
            midX = midX + tarW * (0.5 - anchorX)
        }

        // 先靠右放,如果靠右放超出屏幕,再放左边
        let rx = midX + bWidth / 2
        if (rx + bWidth / 2 >= 360) {
            rx = midX - bWidth / 2
        }
        let ry = inPos.y
        if (ry - bHeight <= -640) {
            ry = -640 + bHeight
        }
        this.bg.active = true
        this.bg.setPosition(cc.v2(rx, ry))
    }

    /**私聊 */
    privateChat(info: BtnTypePlayer) {
        if (!JumpUtils.ifSysOpen(2300, true)) return;
        ChatUtils.addChatPlayer(info.id, info.name, info.headId, info.headBgId, info.level)
        let win = gdk.panel.get(PanelId.Friend)
        if (win) {
            let comp = win.getComponent(FriendViewCtrl)
            comp.selectPanel(null, 3)
            comp.chatPanel && comp.chatPanel.getComponent(PrivateChatCtrl).selectChat();
        } else {
            this.friendModel.panelIndex = 3
            gdk.panel.open(PanelId.Friend, (node) => {
                let comp = node.getComponent(FriendViewCtrl)
                comp.selectPanel(null, 3)
                comp.chatPanel && comp.chatPanel.getComponent(PrivateChatCtrl).selectChat();
            })
        }
        gdk.panel.hide(PanelId.Chat)
    }

    /**详情 */
    detailFunc(info: BtnTypePlayer) {
        // let id: number = info.id
        // let msg = new RoleImageReq()
        // msg.playerId = id
        // NetManager.send(msg)
        gdk.panel.setArgs(PanelId.MainSet, info.id)
        gdk.panel.open(PanelId.MainSet)
    }

    /**添加好友 */
    addFriendFunc(info: BtnTypePlayer) {
        if (!JumpUtils.ifSysOpen(2300, true)) return;
        let id: number = info.id
        let msg = new icmsg.FriendRequestReq()
        msg.playerId = id
        NetManager.send(msg)
    }

    /**删除好友 */
    deleteFriendFunc(info: BtnTypePlayer) {
        GlobalUtil.openAskPanel({
            title: "删除好友",
            descText: `是否删除好友:${info.name}`,
            sureText: "删除",
            sureCb: () => {
                let msg = new icmsg.FriendDeleteReq()
                msg.playerIds = [info.id]
                NetManager.send(msg)
            }
        })
    }

    /**屏蔽函数 */
    addBlackFunc(info: BtnTypePlayer) {
        let blackList = this.friendModel.backList
        if (blackList.length >= this.friendModel.maxBlackList) {
            gdk.gui.showMessage("屏蔽列表已满")
            return
        }
        GlobalUtil.openAskPanel({
            title: "屏蔽玩家",
            descText: `是否蔽玩家:${info.name}？\n屏蔽之后将无法收到该玩家信息`,
            sureText: "屏蔽",
            sureCb: () => {
                let msg = new icmsg.FriendBlacklistInReq()
                msg.playerId = info.id
                NetManager.send(msg, () => {
                    gdk.gui.showMessage("屏蔽成功")
                })
            }
        })
    }

    /**取消屏蔽 */
    outBlackFunc(info: BtnTypePlayer) {
        let msg = new icmsg.FriendBlacklistOutReq()
        msg.playerId = info.id
        NetManager.send(msg)
    }

    /**驱逐出会 */
    quitGuildFunc(info: BtnTypePlayer) {
        gdk.e.emit(GuildEventId.REQ_GUILD_KICK, { playerId: info.id, name: info.name })
    }

    /**任命副会长 */
    setFuPresidentFunc(info: BtnTypePlayer) {
        gdk.e.emit(GuildEventId.REQ_GUILD_SET_TITLE, { playerId: info.id, title: GuildTitle.VicePresident })
    }

    /**解除副会长 */
    removeFuPresidentFunc(info: BtnTypePlayer) {
        gdk.e.emit(GuildEventId.REQ_GUILD_SET_TITLE, { playerId: info.id, title: GuildTitle.Normal })
    }

    /**任命战斗队长 */
    setTeamLeaderFunc(info: BtnTypePlayer) {
        gdk.e.emit(GuildEventId.REQ_GUILD_SET_TITLE, { playerId: info.id, title: GuildTitle.TeamLeader })
    }

    /**解除战斗队长 */
    removeTeamLeaderFunc(info: BtnTypePlayer) {
        gdk.e.emit(GuildEventId.REQ_GUILD_SET_TITLE, { playerId: info.id, title: GuildTitle.Normal })
    }

    /**移交会长 */
    givePresidentFunc(info: BtnTypePlayer) {
        GlobalUtil.openAskPanel({
            title: "移交会长",
            descText: `是否确定将会长移交给<color=#00ff00>【${info.name}】</color>`,
            sureCb: () => {
                GuildUtils.updateGuildPresident(this.roleModel.id, GuildTitle.Normal)
                this.roleModel.guildTitle = GuildTitle.Normal
                gdk.e.emit(GuildEventId.REQ_GUILD_SET_TITLE, { playerId: info.id, title: GuildTitle.President })
            }
        })
    }

    /**邀请入会 */
    sendJoinGuildFunc(info: BtnTypePlayer) {
        if (this.roleModel.guildId == 0) {
            return
        }

        let msg = new icmsg.ChatSendReq()
        msg.channel = ChatChannel.PRIVATE //1:系统 2:世界 3:公会 4:私聊
        msg.content = `<on click='joinGuildClick' param='${this.roleModel.guildId}'>[${this.roleModel.guildName}公会邀请]</on>`
        // msg.equips = [];
        msg.targetId = info.id;
        NetManager.send(msg);

        let rsp = new icmsg.ChatSendRsp()
        rsp.playerId = this.roleModel.id
        rsp.playerLv = this.roleModel.level
        rsp.playerName = this.roleModel.name
        rsp.playerHead = this.roleModel.head
        rsp.channel = ChatChannel.PRIVATE
        rsp.chatTime = GlobalUtil.getServerTime()
        rsp.playerFrame = this.roleModel.frame
        // rsp.equips = []
        rsp.content = `[${this.roleModel.guildName}公会邀请]`

        let curId = info.id.toLocaleString()
        let privateMessages = this.chatModel.privateMessages
        if (!privateMessages[curId]) {
            privateMessages[curId] = []
        }
        privateMessages[curId].push(rsp)
        gdk.e.emit(ChatEvent.ADD_SEND_GUILD_CHAT, rsp)

        let player = ChatUtils.addChatPlayer(info.id, info.name, info.headId, info.headBgId, info.level)
        gdk.e.emit(ChatEvent.ADD_NEW_PRIVATE_CHAT, player)
    }

    reportChatFunc(info: BtnTypePlayer) {
        let req = new icmsg.ChatSendReq();
        req.channel = ChatChannel.REPORT;
        req.content = info.chatContent;
        // req.equips = [];
        req.targetId = info.id;
        NetManager.send(req);
        gdk.gui.showMessage('举报成功');
    }

    chatWorldSendFunc(info: BtnTypePlayer) {
        let time = (this.serverModel.serverTime - this.heroModel.commentZhuanLastTime) / 1000;
        let checkTime = ConfigManager.getItemById(Comments_globalCfg, "share_interval").value[0]
        if (Math.ceil(checkTime - time) > 0) {
            gdk.GUIManager.showMessage(`休息一下，${Math.ceil(checkTime - time)}秒后再尝试分享`)
            return
        }
        // 1是分享英雄
        if (info.level == 1) {
            HeroUtils.shareHero(info.extInfo, ChatChannel.WORLD)
            return
        }
        this._commentZhuanFunc(info, ChatChannel.WORLD)
    }

    chatGuildSendFunc(info: BtnTypePlayer) {
        let time = (this.serverModel.serverTime - this.heroModel.commentZhuanLastTime) / 1000;
        let checkTime = ConfigManager.getItemById(Comments_globalCfg, "share_interval").value[0]
        if (Math.ceil(checkTime - time) > 0) {
            gdk.GUIManager.showMessage(`休息一下，${Math.ceil(checkTime - time)}秒后再尝试分享`)
            return
        }
        // 1是分享英雄
        if (info.level == 1) {
            HeroUtils.shareHero(info.extInfo, ChatChannel.GUILD)
            return
        }
        this._commentZhuanFunc(info, ChatChannel.GUILD)
    }

    guildInviteFunc(info: BtnTypePlayer) {
        let systemCfg = ConfigManager.getItemById(SystemCfg, 2400)
        if (info.level && info.level < systemCfg.openLv) {
            gdk.gui.showMessage(`对方未开启公会系统`)
            return
        }
        let req = new icmsg.GuildInviteReq();
        req.playerId = info.id;
        NetManager.send(req);
    }

    _commentZhuanFunc(info: BtnTypePlayer, channelType) {
        let callFunc = () => {
            this.heroModel.commentZhuanLastTime = this.serverModel.serverTime
            gdk.gui.showMessage("快转成功")
            NetManager.targetOff(this)
            let msg2 = new icmsg.UpdateCommentReq()
            msg2.id = info.id
            msg2.updateType = CommentType.Zhuan
            NetManager.send(msg2, () => {
                for (let key in this.heroModel.commentAllList) {
                    let datas: icmsg.Comment[] = this.heroModel.commentAllList[key]
                    for (let i = 0; i < datas.length; i++) {
                        if (datas[i].id == info.id) {
                            datas[i].repostNum += 1
                            gdk.e.emit(RoleEventId.COMMENT_REFRESH_DATA)
                            break
                        }
                    }
                }
            })
        }
        ErrorManager.on(302, () => {
            NetManager.targetOff(this)
        }, this)
        NetManager.on(icmsg.ChatSendRsp.MsgType, callFunc, this)

        let msg = new icmsg.ChatSendReq();
        msg.channel = channelType;
        msg.targetId = 0
        msg.content = info.chatContent;
        NetManager.send(msg)
    }
}
