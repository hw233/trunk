import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ChatModel from '../../../view/chat/model/ChatModel';
import ConfigManager from '../ConfigManager';
import FootHoldModel, { FhMapType, FhPointInfo } from '../../../view/guild/ctrl/footHold/FootHoldModel';
import FootHoldUtils from '../../../view/guild/ctrl/footHold/FootHoldUtils';
import GlobalUtil from '../../utils/GlobalUtil';
import GuideUtil from '../../utils/GuideUtil';
import JumpUtils from '../../utils/JumpUtils';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../models/RoleModel';
import ServerModel from '../../models/ServerModel';
import TimerUtils from '../../utils/TimerUtils';
import { ChatChannel } from '../../../view/chat/enum/ChatChannel';
import { ChatEvent } from '../../../view/chat/enum/ChatEvent';
import { Foothold_globalCfg, Foothold_pointCfg, TvCfg } from '../../../a/config';
import { FootHoldEventId } from '../../../view/guild/enum/FootHoldEventId';
import { kill } from 'process';
import { RedPointEvent } from '../../utils/RedPointUtils';

export default class FootHoldController extends BaseController {

    get gdkEvents(): GdkEventArray[] {
        return [
        ]
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.FootholdRedPointsRsp.MsgType, this._onFootholdRedPointsRsp],
            [icmsg.FootholdRoleInfoRsp.MsgType, this._onFootholdRoleInfoRsp],
            [icmsg.FootholdGuildJoinRsp.MsgType, this._onFootholdGuildJoinRsp],
            [icmsg.FootholdPlayerJoinRsp.MsgType, this._onFootholdPlayerJoinRsp],
            [icmsg.FootholdFightBroadcastRsp.MsgType, this._onFootholdFightBroadcastRsp],
            //[icmsg.FootholdFightBroadcastRsp.MsgType, this._onFootholdFightBroadcastRsp],
            [icmsg.FootholdTop6GuildRsp.MsgType, this._onFootholdTop6GuildRsp],
            [icmsg.FootholdBossKilledRsp.MsgType, this._onFootholdBossKilledRsp],
            [icmsg.GuildDropStoredRsp.MsgType, this._onGuildDropStoredRsp],
            [icmsg.GuildDropStateRsp.MsgType, this._onGuildDropStateRsp],
            [icmsg.FootholdAllianceRsp.MsgType, this._onFootholdAllianceRsp],
            [icmsg.FootholdAtkFlagGetRsp.MsgType, this._onFootholdAtkFlagGetRsp],
            [icmsg.FootholdGuardInvitersRsp.MsgType, this._onFootholdGuardInvitersRsp],
            [icmsg.FootholdGatherInvitersRsp.MsgType, this._onFootholdGatherInvitersRsp],
            [icmsg.FootholdBaseLevelRsp.MsgType, this._onFoothildBaseLevelRsp],
            [icmsg.FootholdFreeEnergyRsp.MsgType, this._onFootholdFreeEnergyRsp],
            [icmsg.FootholdCoopInviteNoticeRsp.MsgType, this._onFootholdCoopInviteNoticeRsp],
            [icmsg.FootholdCoopGuildListRsp.MsgType, this._onFootholdCoopGuildListRsp],
            [icmsg.FootholdCoopApplyNoticeRsp.MsgType, this._onFootholdCoopApplyNoticeRsp],
            [icmsg.FootholdGatherPointsRsp.MsgType, this._onFootholdGatherPointsRsp],



        ];
    }

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onStart() {
        this._updateTime()
        gdk.Timer.loop(1000, this, this._updateTime)
    }

    onEnd() {
        gdk.Timer.clear(this, this._updateTime)
    }

    _updateTime() {
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let endTime = this.footHoldModel.recoverTime || 0
        if (endTime == 0) {
            return
        }
        let leftTime = endTime - curTime
        if (leftTime <= 0) {
            if (this.roleModel.guildId > 0) {
                let msg = new icmsg.FootholdRoleInfoReq()
                NetManager.send(msg)
            }
        }
    }

    /**初始化请求红点 地图信息*/
    _onFootholdRedPointsRsp(data: icmsg.FootholdRedPointsRsp) {
        let footHoldModel = this.footHoldModel;
        for (let i = 0; i < data.list.length; i++) {
            let mapId = data.list[i].mapId
            let cfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", mapId, { world_level: footHoldModel.worldLevelIndex })
            if (!cfg) {
                //CC_DEBUG && cc.error(`表 Foothold_pointCfg 缺少配置, map_id: ${mapId}, world_level: ${footHoldModel.worldLevelIndex}`);
                continue;
            }
            if (cfg.map_type == FhMapType.Base) {
                if (!footHoldModel.guildMapData) {
                    this._creatGuildMapData(data.list[i].warId, mapId, cfg.map_type, data.list[i])
                } else {
                    if (!data.broadcast) {
                        this._creatGuildMapData(data.list[i].warId, mapId, cfg.map_type, data.list[i])
                    }
                }
            } else {
                if (!footHoldModel.globalMapData) {
                    this._createGlobalMapData(data.list[i].warId, mapId, cfg.map_type, data.list[i])
                } else {
                    if (!data.broadcast) {
                        this._createGlobalMapData(data.list[i].warId, mapId, cfg.map_type, data.list[i])
                    }
                }
            }
        }

        if (data.list.length == 1) {
            FootHoldUtils.setGuessMode(true)
        }

        if (this.footHoldModel.globalMapData && this.footHoldModel.globalMapData.mapType == 4) {
            let guardReq = new icmsg.FootholdGuardInvitersReq()
            guardReq.type = 1
            NetManager.send(guardReq)

            let gatherReq = new icmsg.FootholdGatherInvitersReq()
            gatherReq.type = 1
            NetManager.send(gatherReq)
        }

        gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
    }

    _creatGuildMapData(warId, mapId, mapType, redPoint) {
        this.footHoldModel.guildMapData = {
            warId: warId,
            mapId: mapId,
            mapType: mapType,
            redPoint: redPoint,
            rndSeed: 0,
        }
    }

    _createGlobalMapData(warId, mapId, mapType, redPoint) {
        this.footHoldModel.globalMapData = {
            warId: warId,
            mapId: mapId,
            mapType: mapType,
            redPoint: redPoint,
            rndSeed: 0,
        }
    }

    /**世界等级 能量信息 */
    _onFootholdRoleInfoRsp(data: icmsg.FootholdRoleInfoRsp) {
        this.footHoldModel.energy = data.energy
        this.footHoldModel.recoverTime = data.recoverTime
        this.footHoldModel.worldLevel = data.worldLevel
        this.footHoldModel.worldLevelIndex = data.worldLevelIdx
        this.footHoldModel.engergyBought = data.energyBought
        this.footHoldModel.rewardedBaseLevel = data.rewardedBaseLevel
        this.footHoldModel.activityType = data.activityType
        this.footHoldModel.activityIndex = data.activityIndex
        this.footHoldModel.warStartTime = data.startTime
        this.footHoldModel.warEndTime = data.endTime
        this.footHoldModel.guessRewarded = data.guessRewarded
        this.footHoldModel.guessRedPoints = data.guessRedPoints
        this.footHoldModel.guessOpened = data.guessOpened
        this.footHoldModel.militaryExp = data.missionExp
        this.footHoldModel.freeEnergy = data.freeEnergy

        this.footHoldModel.coopGuildId = data.coopGuildId
        this.footHoldModel.coopInviteNum = data.coopInviteNum
        this.footHoldModel.coopApplyNum = data.coopApplyNum
        this.footHoldModel.coopStartTime = data.coopStartTime

        if (this.roleModel.guildId > 0 && !data.guessOpened) {
            FootHoldUtils.setGuessMode(false)
        }

        gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)

        //竞猜相关
        if (data.guessOpened && this.roleModel.guildId > 0) {
            let curRound = FootHoldUtils.getCurGuessRound()
            if (curRound > 0) {
                let msg = new icmsg.FootholdGuessQueryReq()
                msg.day = curRound
                NetManager.send(msg, (data: icmsg.FootholdGuessQueryRsp) => {
                    this.footHoldModel.guessType = data.guessType
                    this.footHoldModel.guessVotedId = data.votedId
                    this.footHoldModel.guessVotedPoints = data.votedPoints
                    this.footHoldModel.guessWinnerId = data.winnerId
                    this.footHoldModel.guessGuilds = data.guilds
                    gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
                }, this)
            }
        }

        //协战相关  每天首次登陆弹出日报
        if (this.roleModel.guildId > 0) {
            let time = GlobalUtil.getLocal("fHCooperation#notice")
            if (!time || (time && !TimerUtils.isCurDay(time))) {
                let msg = new icmsg.FootholdCoopGuildListReq()
                NetManager.send(msg, (data: icmsg.FootholdCoopGuildListRsp) => {
                    this.footHoldModel.cooperGuildList = data.guildList
                    let g_open = ConfigManager.getItemByField(Foothold_globalCfg, "key", "open").value[5]
                    if (data.guildList.length > 1 && this.footHoldModel.activityIndex >= g_open) {
                        gdk.Timer.once(3000, this, () => {
                            if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel) || GuideUtil.isGuiding) {
                                return;
                            }
                            JumpUtils.openPanelAfter(PanelId.FHCooperationNotice, [
                                PanelId.FirstPayGift,
                                PanelId.MainLevelUpTip,
                                PanelId.FunctionOpen,
                                PanelId.Sign,
                                PanelId.AskPanel,
                            ], null, () => {
                                GlobalUtil.setLocal("fHCooperation#notice", Math.floor(GlobalUtil.getServerTime() / 1000))
                            })
                        })
                    }
                })
            }
        }
    }

    /**广播 据点战公会加入 */
    _onFootholdGuildJoinRsp(data: icmsg.FootholdGuildJoinRsp) {
        this.footHoldModel.fhGuilds.push(data.guild)
    }

    /**广播 据点战玩家加入 */
    _onFootholdPlayerJoinRsp(data: icmsg.FootholdPlayerJoinRsp) {
        this.footHoldModel.fhPlayers.push(data.player)
    }

    /**据点战--战斗广播*/
    _onFootholdFightBroadcastRsp(data: icmsg.FootholdFightBroadcastRsp) {
        let info = FootHoldUtils.findFootHold(data.point.pos.x, data.point.pos.y)
        if (info) {
            FootHoldUtils.updateFootHold(data.point)
        } else {
            this.footHoldModel.fhPoints.push(data.point)
        }
        gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
    }


    /**最前通关的公会  只需请求一次，后面的数据更新会广播 */
    _onFootholdTop6GuildRsp(data: icmsg.FootholdTop6GuildRsp) {
        if (data.broadcast) {
            this.footHoldModel.topGuildList.push(data.list[0])
            this.footHoldModel.topGuildList = this.footHoldModel.topGuildList

            let tvCfg = ConfigManager.getItemByField(TvCfg, "tv_id", 4)
            let content = tvCfg.desc.replace("{guild}", data.list[0].name)
            content = content.replace("{num}", `${data.remain}`)

            let chatModel = ModelManager.get(ChatModel)
            let model = ModelManager.get(ServerModel)

            for (let j = 0; j < tvCfg.channels.length; j++) {
                let info = new icmsg.ChatSendRsp()
                info.playerId = 0
                info.playerLv = tvCfg.tv_id
                info.playerName = ""
                info.playerHead = 0
                info.chatTime = model.serverTime
                info.playerFrame = 0
                info.content = content
                if (tvCfg.channels[j] == ChatChannel.GUILD) {
                    info.channel = tvCfg.channels[j]
                    chatModel.GuildMessages.push(info)
                    chatModel.AllMessages.push(info)
                    gdk.e.emit(ChatEvent.ADD_CHAT_INFO, info)
                } else if (tvCfg.channels[j] == ChatChannel.SYS) {
                    info.channel = tvCfg.channels[j]
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
                }
            }

        } else {
            this.footHoldModel.topGuildList = data.list
        }
    }

    /**红点广播 */
    _onFootholdBossKilledRsp(data: icmsg.FootholdBossKilledRsp) {
        if (this.footHoldModel.curMapData.warId == data.warId) {
            this.footHoldModel.curMapData.redPoint.points.push(data.pos)
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
        }
    }

    /*预览 据点战奖励领取*/
    _onGuildDropStoredRsp(data: icmsg.GuildDropStoredRsp) {
        this.footHoldModel.fhDropReward = data.list
        gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_DROP_REWARD)
    }

    _onGuildDropStateRsp(data: icmsg.GuildDropStateRsp) {
        this.footHoldModel.fhDropGoods = data.goodsList
        this.footHoldModel.fhDropRecord = data.recordList
        gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_SEND_REWARD)
    }

    //据点战联盟信息
    _onFootholdAllianceRsp(data: icmsg.FootholdAllianceRsp) {
        if (data.alliance1.indexOf(this.footHoldModel.roleTempGuildId) != -1) {
            this.footHoldModel.myAlliance = data.alliance1
        } else if (data.alliance2.indexOf(this.footHoldModel.roleTempGuildId) != -1) {
            this.footHoldModel.myAlliance = data.alliance2
        } else if (data.alliance3.indexOf(this.footHoldModel.roleTempGuildId) != -1) {
            this.footHoldModel.myAlliance = data.alliance3
        }
        this.footHoldModel.maxAlliance = data.alliance1
        if (data.alliance2.length > this.footHoldModel.maxAlliance.length) {
            this.footHoldModel.maxAlliance = data.alliance2
        }
        if (data.alliance3.length > this.footHoldModel.maxAlliance.length) {
            this.footHoldModel.maxAlliance = data.alliance3
        }
        let allianceNum = 0
        if (data.alliance1.length > 0) {
            allianceNum++
        }
        if (data.alliance2.length > 0) {
            allianceNum++
        }
        if (data.alliance3.length > 0) {
            allianceNum++
        }
        this.footHoldModel.allianceNum = allianceNum
    }

    //据点标记信息
    _onFootholdAtkFlagGetRsp(data: icmsg.FootholdAtkFlagGetRsp) {
        for (let i = 0; i < data.flags.length; i++) {
            this.footHoldModel.markFlagPoints[`${data.flags[i].pos.x}-${data.flags[i].pos.y}`] = data.flags[i]
        }
    }

    /**驻守邀请信息 */
    _onFootholdGuardInvitersRsp(data: icmsg.FootholdGuardInvitersRsp) {
        if (data.num >= 0) {
            this.footHoldModel.myGuardInviteNum = data.num
        } else {
            //data.num = -1 收到主动推送
            if (this.footHoldModel.myGuardPlayerIds.indexOf(data.list[0].brief.id) == -1) {
                let num = this.footHoldModel.myGuardInviteNum + 1
                this.footHoldModel.myGuardPlayerIds.push(data.list[0].brief.id)
                this.footHoldModel.myGuardInviteNum = num
            }
        }
    }

    /**集结邀请信息 */
    _onFootholdGatherInvitersRsp(data: icmsg.FootholdGatherInvitersRsp) {
        if (data.num >= 0) {
            this.footHoldModel.myGatherInviteNum = data.num
        } else {
            //data.num = -1 收到主动推送
            if (this.footHoldModel.myGatherPlayerIds.indexOf(data.list[0].brief.id) == -1) {
                let num = this.footHoldModel.myGatherInviteNum + 1
                this.footHoldModel.myGatherPlayerIds.push(data.list[0].brief.id)
                this.footHoldModel.myGatherInviteNum = num
            }
        }
    }

    /**基地等级 */
    _onFoothildBaseLevelRsp(resp: icmsg.FootholdBaseLevelRsp) {
        FootHoldUtils.updateGuildInfo(resp);
        if (resp.guildId == this.footHoldModel.roleTempGuildId) {
            this.footHoldModel.baseLevel = resp.level;
            this.footHoldModel.baseLvExp = resp.exp;
        }
    }

    /**据点战--免费体力领取 */
    _onFootholdFreeEnergyRsp(resp: icmsg.FootholdFreeEnergyRsp) {
        this.footHoldModel.freeEnergy = resp.freeEnergy;
        this.footHoldModel.energy = resp.energy;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    /**协战邀请通知 */
    _onFootholdCoopInviteNoticeRsp(data: icmsg.FootholdCoopInviteNoticeRsp) {
        this.footHoldModel.cooperationInviteNum = data.number
    }

    /**参与据点战的公会信息 */
    _onFootholdCoopGuildListRsp(data: icmsg.FootholdCoopGuildListRsp) {
        this.footHoldModel.cooperGuildList = data.guildList
    }

    /**协战申请 红点 */
    _onFootholdCoopApplyNoticeRsp(data: icmsg.FootholdCoopApplyNoticeRsp) {
        this.footHoldModel.coopApplyNum = data.number
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    /**集结点数据更新 */
    _onFootholdGatherPointsRsp(data: icmsg.FootholdGatherPointsRsp) {
        if (data.num == -1) {
            for (let i = 0; i < data.list.length; i++) {
                //集结点更新
                if (data.list[i].pointType == 1) {
                    let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${data.list[i].pos.x}-${data.list[i].pos.y}`]
                    if (pointInfo && pointInfo.fhPoint && (pointInfo.fhPoint.status & 8) && pointInfo.fhPoint.gather) {
                        pointInfo.fhPoint.gather.teamNum = data.list[i].teamNum
                    }
                }
            }
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
        }
    }
}