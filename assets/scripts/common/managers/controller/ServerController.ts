import BagUtils from '../../utils/BagUtils';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ChatModel from '../../../view/chat/model/ChatModel';
import ConfigManager from '../ConfigManager';
import ErrorManager from '../ErrorManager';
import FootHoldUtils from '../../../view/guild/ctrl/footHold/FootHoldUtils';
import FriendModel from '../../../view/friend/model/FriendModel';
import GlobalUtil from '../../utils/GlobalUtil';
import GuideUtil from '../../utils/GuideUtil';
import LoginFsmEventId from '../../../scenes/main/enum/LoginFsmEventId';
import LoginModel from '../../models/LoginModel';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import RoleModel from '../../models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import ServerModel from '../../models/ServerModel';
import StoreModel from '../../../view/store/model/StoreModel';
import { ActivityEventId } from '../../../view/act/enum/ActivityEventId';
import { ChatChannel } from '../../../view/chat/enum/ChatChannel';
import { ChatEvent } from '../../../view/chat/enum/ChatEvent';
import { TvCfg } from '../../../a/config';

/**
 * 服务器数据管理，例如：服务器列表，服务器时间等
 * @Author: sthoo.huang
 * @Date: 2019-04-08 16:35:36
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-14 13:49:13
 */

// 判断是否为同一天
function isSameDayUnix(a: number, b: number): boolean {
    return new Date(a).toDateString() === new Date(b).toDateString();
};

export default class ServerController extends BaseController {
    gdkEvents: GdkEventArray[];
    netEvents: NetEventArray[] = [
        [icmsg.RoleLoginRsp.MsgType, this.onLoginRspHandle],
        [icmsg.SystemHeartbeatRsp.MsgType, this.onHeartbeatRspHandle],
        [icmsg.SystemNewdayRsp.MsgType, this.onNewdayRsp],
        [icmsg.SystemBroadcastRsp.MsgType, this._onSystemBroadcastRsp],
    ];

    model: ServerModel;
    fsm: gdk.fsm.Fsm;
    autoReconnect: boolean;

    onStart(): void {
        this.model = ModelManager.get(ServerModel);
        this.fsm = gdk.fsm.Fsm.main;
        this.autoReconnect = false;
        // 网络连接事件
        let conn = NetManager.conn;
        conn.onClose.on(this.onConnectFailHandle, this);
        conn.onOpen.on(this.onConnectSuccHandle, this);
        // 在别处登录错误处理
        ErrorManager.on(201, () => {
            this.autoReconnect = false;
            gdk.gui.showAlert(ErrorManager.get(201), () => {
                SdkTool.tool.logout();
            }, this, [gdk.i18n.t('i18n:RELOGIN')]);
        }, this);
    }

    onEnd(): void {
        let conn = NetManager.conn;
        if (conn) {
            conn.onClose.off(this.onConnectFailHandle, this);
            conn.onOpen.off(this.onConnectSuccHandle, this);
        }
        ErrorManager.targetOff(this);
        gdk.Timer.clearAll(this);
        this.model = null;
        this.fsm = null;
    }

    onConnectSuccHandle() {
        CC_DEBUG && cc.log("连接服务器成功！");
    }

    onConnectFailHandle() {
        if (!this.autoReconnect) {
            // 断线无需自动重连
            return;
        }
        let model = ModelManager.get(LoginModel);
        if (model.token) {
            // 断线重连
            CC_DEBUG && cc.log("连接服务器失败或断开！");
        }
        this.fsm.sendEvent(LoginFsmEventId.CONN_BREAK);
    }

    onLoginRspHandle() {
        // 主动发送心跳包以获取服务器时间
        NetManager.send(new icmsg.SystemHeartbeatReq());
        this.autoReconnect = true;
    }

    private _openDaysGuideActived: number = -1;
    onHeartbeatRspHandle(rmsg: icmsg.SystemHeartbeatRsp) {
        let o = this.model._serverTime;
        let n = rmsg.serverTime * 1000;
        if (o && o > 0 && !isSameDayUnix(o, n)) {
            // 如果不是同一天
            this.onNewdayRsp();
        }
        this.model.serverTime = n;
        // 开服天数引导激活
        let days = GlobalUtil.getCurDays();
        if (this._openDaysGuideActived !== days && ModelManager.get(RoleModel).initlized) {
            this._openDaysGuideActived = days;
            GuideUtil.activeGuide(`opendays#${days}`);
        }
    }

    // 跨天处理函数
    onNewdayRsp() {
        gdk.Timer.once(5000, this, this._onNewdayRspLater);
    }

    // 跨天后刷新请求
    _onNewdayRspLater() {
        CC_DEBUG && cc.log("跨天请求刷新数据");
        // 清除好友相关的数据
        let friendModel = ModelManager.get(FriendModel);
        friendModel.friendShipGetList = [];
        friendModel.friendShipSendList = [];
        friendModel.addFrienList = [];
        friendModel.requestFriendList = [];
        ModelManager.get(StoreModel).siegeItems = null
        // 数据刷新请求
        let reqList: { new() }[] = [
            icmsg.HeroListReq,//英雄列表信息
            icmsg.GuildSignInfoReq,
            icmsg.MasteryStageIdListReq,
            icmsg.DungeonListReq,
            icmsg.MissionListReq,
            icmsg.SignInfoReq,
            icmsg.MonthCardListReq,
            icmsg.StoreBlackMarketListReq,
            icmsg.StoreGiftListReq,
            icmsg.StoreListReq,
            icmsg.FriendListReq,
            // icmsg.MasteryTeamListReq,
            icmsg.ArenaInfoReq,//竞技场
            icmsg.ActivityRankingInfoReq,//开服冲榜活动
            icmsg.DungeonElitesReq,//精英副本数据
            icmsg.JusticeStateReq,//正义的反击副本数据
            icmsg.MercenaryBorrowedReq,
            icmsg.MercenaryListReq,
            icmsg.MissionWelfare2ListReq,
            icmsg.ActivityTopUpListReq,
            icmsg.ActivityCumloginListReq,
            icmsg.FootholdRoleInfoReq,
            icmsg.DoomsDayListReq,
            icmsg.DungeonRuneInfoReq,
            icmsg.DungeonHeroSweepTimesReq,
            icmsg.MonthCardQuickCombatInfoReq,
            icmsg.TavernInfoReq,
            icmsg.SurvivalStateReq,
            icmsg.MartialSoulStateReq,
            icmsg.ExcitingActivityStateReq,
            icmsg.PayDailyFirstInfoReq,
            icmsg.StoreRuneListReq,
            icmsg.FlipCardInfoReq,
            icmsg.DrawEggInfoReq,
            icmsg.AdventurePassListReq,
            icmsg.LuckyDrawSummonStateReq,
            icmsg.PassFundListReq,
            icmsg.RuinStateReq,
            icmsg.ActivityLandGiftInfoReq,
            icmsg.ActivityNewTopUpListReq,
            icmsg.StoreSiegeListReq,
            icmsg.CrossTreasureStateReq,
            icmsg.GuardianCopyStateReq,
            icmsg.PassWeeklyListReq,
            icmsg.GuardianTowerStateReq,
            icmsg.MergeCarnivalStoreReq,
            icmsg.MissionComboInfoReq,
            icmsg.ActivityCaveAdventureInfoReq,
            icmsg.WorldEnvelopeIdReq,
            icmsg.Adventure2PassListReq,
            icmsg.Adventure2StateReq,
            icmsg.ActivityAwakeGiftInfoReq,
            icmsg.EnergizeStateReq,
            icmsg.ActivityAssembledInfoReq,
            icmsg.ActivityDiscountStateReq,
            icmsg.PayFirstListReq,
            icmsg.ChampionRedPointsReq,
            icmsg.ActivitySailingInfoReq,
            icmsg.ActivityHotelStateReq,
            icmsg.DungeonUltimateStateReq,
            icmsg.ActivitySuperValueInfoReq,
        ];
        let length = reqList.length;
        for (let i = 0; i < length; i++) {
            let clz = reqList[i];
            if (clz) {
                NetManager.send(new clz());
            }
        }
        // 1.周一，刷新据点战数据 2.跨天刷新公会boss信息
        if (ModelManager.get(RoleModel).guildId > 0) {
            if (new Date(this.model.serverTime).getDay() == 1) {
                FootHoldUtils.clearData()
                gdk.Timer.once(1000, this, () => {
                    let smsg = new icmsg.FootholdRedPointsReq();
                    NetManager.send(smsg);
                });
            }
            let reqList = [
                icmsg.GuildBossStateReq,
                icmsg.SiegeStateReq,
                icmsg.FootholdAllianceReq,
                icmsg.GuildGatherStateReq
            ]
            reqList.forEach(element => {
                let clz = element;
                if (clz) {
                    NetManager.send(new clz());
                }
            })
        }
        // 跨天事件
        gdk.Timer.once(5000, this, () => {
            gdk.e.emit(ActivityEventId.UPDATE_NEW_DAY);
        });
    }

    /**系统广播 */
    _onSystemBroadcastRsp(data: icmsg.SystemBroadcastRsp) {
        let tvCfg = ConfigManager.getItemByField(TvCfg, "tv_id", data.tplId)
        if (!tvCfg) return
        let content = tvCfg.desc
        for (let i = 0; i < data.args.length; i++) {
            content = content.replace("{%s}", data.args[i])
        }

        for (let i = 0; i < data.data.length; i++) {
            content = content.replace("%e", `${data.data[i].toString('binary')}`)
        }
        // content = content.replace("%e", `${data.data.toString('binary')}`)

        let str = ''

        for (let j = 0; j < data.items.length; j++) {
            let itemCfg = BagUtils.getConfigById(data.items[j].typeId)
            if (j == data.items.length - 1) {
                str += `<color=${BagUtils.getColorInfo(itemCfg["color"]).color}>${itemCfg.name}</c><color=#00ff00>x${data.items[j].num}</c>`
            } else {
                str += `<color=${BagUtils.getColorInfo(itemCfg["color"]).color}> ${itemCfg.name} </c><color=#00ff00>x${data.items[j].num}</c>, `
            }
        }
        content = content.replace("{%i}", str)

        let chatModel = ModelManager.get(ChatModel)
        let model = ModelManager.get(ServerModel)

        for (let j = 0; j < tvCfg.channels.length; j++) {
            let info = new icmsg.ChatSendRsp()
            info.playerId = 0
            info.playerLv = 0
            info.playerName = ""
            info.playerHead = 0
            info.chatTime = model.serverTime
            info.playerFrame = 0
            info.content = content
            info.channel = tvCfg.channels[j]
            if (info.channel == ChatChannel.GUILD) {
                chatModel.GuildMessages.push(info)
                chatModel.AllMessages.push(info)
                gdk.e.emit(ChatEvent.ADD_CHAT_INFO, info)
            } else if (info.channel == ChatChannel.SYS) {
                chatModel.SysMessages.push(info)
                chatModel.AllMessages.push(info)
                if (tvCfg.show_type == 1) {
                    chatModel.noticeList.push(info.content)
                }
                else {
                    chatModel.lowEffectNoticeList.push(info.content)
                }
                gdk.e.emit(ChatEvent.ADD_SYSTEM_NOTICE)
                gdk.e.emit(ChatEvent.ADD_CHAT_INFO, info)
            } else if (info.channel == ChatChannel.CROSSACT) {
                chatModel.CrossactMessages.push(info)
                chatModel.AllMessages.push(info)
                if (tvCfg.show_type == 1) {
                    chatModel.noticeList.push(info.content)
                }
                else {
                    chatModel.lowEffectNoticeList.push(info.content)
                }
                gdk.e.emit(ChatEvent.ADD_SYSTEM_NOTICE)
                gdk.e.emit(ChatEvent.ADD_CHAT_INFO, info)
            }
        }
    }
}