import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import ErrorManager from '../ErrorManager';
import ExpeditionModel from '../../../view/guild/ctrl/expedition/ExpeditionModel';
import ExpeditionUtils from '../../../view/guild/ctrl/expedition/ExpeditionUtils';
import FootHoldModel from '../../../view/guild/ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../utils/GlobalUtil';
import GuildModel, { GuildDetail, GuildMemberLocal, GuildTitle } from '../../../view/guild/model/GuildModel';
import GuildUtils from '../../../view/guild/utils/GuildUtils';
import JumpUtils from '../../utils/JumpUtils';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../models/RoleModel';
import SiegeModel from '../../../view/guild/ctrl/siege/SiegeModel';
import StringUtils from '../../utils/StringUtils';
import {
    Expedition_missionCfg,
    GuildbossCfg,
    MonsterCfg,
    Pve_bornCfg,
    Pve_mainCfg
    } from '../../../a/config';
import { GuildEventId } from '../../../view/guild/enum/GuildEventId';
import { RedPointEvent } from '../../utils/RedPointUtils';
/*
 *公会相关
 * @Author: luoyong 
 * @Date: 2020-02-13 14:07:47 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-07-03 09:37:04
 */


export default class GuildController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return [

            [GuildEventId.REQ_GUILD_DETAIL, this.reqGuildDetail],
            [GuildEventId.REQ_GUILD_CHECK, this.reqGuildCheck],
            [GuildEventId.REQ_GUILD_KICK, this.reqGuildKick],
            [GuildEventId.REQ_GUILD_SET_TITLE, this.reqGuildSetTitle],
            [GuildEventId.REQ_GUILD_SIGN_INFO, this.reqGuildSignInfo],
            [GuildEventId.REQ_GUILD_STHWAR_DETAIL, this.reqGuildSthwarDetail],
        ]
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.GuildDetailRsp.MsgType, this._onGuildDetailRsp],
            [icmsg.GuildCampRsp.MsgType, this._onGuildCampRsp],
            [icmsg.GuildCheckRsp.MsgType, this._onGuildCheckRsp],
            [icmsg.GuildKickRsp.MsgType, this._onGuildKickRsp],
            [icmsg.GuildSetTitleRsp.MsgType, this._onGuildSetTitleRsp],
            [icmsg.GuildSignInfoRsp.MsgType, this._onGuildSignInfoRsp],
            [icmsg.GuildSthWarDetailRsp.MsgType, this._onGuildSthWarDetailRsp],
            [icmsg.GuildUpdateRsp.MsgType, this._onGuildUpdateRsp],
            [icmsg.GuildBossStateRsp.MsgType, this._onGuildBossStateRsp],
            [icmsg.GuildBossNoticeRsp.MsgType, this._onGuildBossNoticeRsp],
            [icmsg.GuildBossRankRsp.MsgType, this._onGuildBossRankRsp],
            [icmsg.GuildBossOpenRsp.MsgType, this._onGuildBossOpenRsp],
            [icmsg.GuildInviteInfoRsp.MsgType, this._onGuildInviteInfoRsp],
            [icmsg.GuildJoinRsp.MsgType, this._onGuildJoinRsp],
            [icmsg.GuildInviteRsp.MsgType, this._onGuildInviteRsp],
            [icmsg.FootholdGuideQueryRsp.MsgType, this._onFootholdGuideQueryRsp, this],
            [icmsg.GuildRequestsRsp.MsgType, this._onGuildRequestsRsp, this],
            [icmsg.GuildReqNoticeRsp.MsgType, this._onGuildReqNoticeRsp, this],
            [icmsg.GuildEnvelopeListRsp.MsgType, this._onGuildEnvelopeListRsp, this],
            [icmsg.GuildEnvelopeChangeRsp.MsgType, this._onGuildEnvelopeChangeRsp, this],
            [icmsg.WorldEnvelopeRankRsp.MsgType, this._onGuildEnvelopeRankRsp, this],
            [icmsg.GuildEnvelopeSendRsp.MsgType, this._onGuildEnvelopeSendRsp, this],
            [icmsg.SiegeStateRsp.MsgType, this._onSiegeStateRsp, this],
            [icmsg.SiegeBloodRsp.MsgType, this._onSiegeBloodRsp, this],
            [icmsg.WorldEnvelopeIdRsp.MsgType, this._onWorldEnvelopeIdRsp, this],
            [icmsg.WorldEnvelopeGetRsp.MsgType, this._onWroldlopeGetRsp, this],
            [icmsg.GuildGatherStateRsp.MsgType, this._onGuildGatherStateRsp, this],
            [icmsg.GuildGatherEndRsp.MsgType, this._onGuildGatherEndRsp, this],

            [icmsg.ExpeditionBroadcastRsp.MsgType, this._onExpeditionBroadcastRsp, this],
            [icmsg.ExpeditionMapClearRsp.MsgType, this._onExpeditionMapClearRsp, this],
            [icmsg.ExpeditionMissionStateRsp.MsgType, this._onExpeditionMissionStateRsp, this],
            [icmsg.ExpeditionMissionUpdateRsp.MsgType, this._onExpeditionMissionUpdateRsp, this],
            [icmsg.ExpeditionMissionRewardRsp.MsgType, this._onExpeditionMissionRewardRsp, this],
            [icmsg.ExpeditionArmyStateRsp.MsgType, this._onExpeditionArmyStateRsp, this],
            [icmsg.ExpeditionArmyStrengthenRsp.MsgType, this._onExpeditionArmyStrengthenRsp, this],
            [icmsg.ExpeditionHeroListRsp.MsgType, this._onExpeditionHeroListRsp, this],
            [icmsg.ExpeditionHeroChangeRsp.MsgType, this._onExpeditionHeroChangeRsp, this],
        ];
    }

    model: GuildModel = null
    roleModel: RoleModel = null
    footHold: FootHoldModel = null
    siegeModel: SiegeModel = null

    onStart() {
        this.model = ModelManager.get(GuildModel)
        this.roleModel = ModelManager.get(RoleModel)
        this.footHold = ModelManager.get(FootHoldModel)
        this.siegeModel = ModelManager.get(SiegeModel)
    }

    onEnd() {
        this.model = null
        this.roleModel = null
        this.footHold = null
    }


    reqGuildDetail(e: gdk.Event) {
        let guildId = e.data
        let msg = new icmsg.GuildDetailReq()
        msg.guildId = guildId
        NetManager.send(msg)
    }

    reqGuildCheck(e: gdk.Event) {
        let msg = new icmsg.GuildCheckReq()
        msg.playerId = e.data.playerId
        msg.ok = e.data.ok
        NetManager.send(msg, () => {
            let msg = new icmsg.GuildRequestsReq()
            NetManager.send(msg)
        })
    }

    reqGuildQuit() {
        let msg = new icmsg.GuildQuitReq()
        NetManager.send(msg)
    }

    reqGuildKick(e: gdk.Event) {
        let msg = new icmsg.GuildKickReq()
        msg.playerId = e.data.playerId
        let name = e.data.name
        NetManager.send(msg, (data: icmsg.GuildKickRsp) => {
            let list = this.model.guildDetail.members
            let index = -1
            for (let i = 0; i < list.length; i++) {
                if (list[i].id.toLocaleString() == msg.playerId.toLocaleString()) {
                    index = i
                    break
                }
            }
            if (index >= 0) {
                this.model.guildDetail.members.splice(index, 1)
                this.model.guildDetail.info.num = this.model.guildDetail.info.num - 1
                gdk.e.emit(GuildEventId.REMOVE_GUILD_MEMBER, index)
                gdk.gui.showMessage(`${name}已驱逐出会`)
            }
        })
    }

    reqGuildSetTitle(e: gdk.Event) {
        let msg = new icmsg.GuildSetTitleReq()
        msg.playerId = e.data.playerId
        msg.title = e.data.title
        NetManager.send(msg)
    }

    reqGuildSignInfo(e: gdk.Event) {
        let msg = new icmsg.GuildSignInfoReq()
        NetManager.send(msg)
    }

    reqGuildSignBox(e: gdk.Event) {
        let msg = new icmsg.GuildSignBoxReq()
        msg.index = e.data
        NetManager.send(msg)
    }

    reqGuildSthwarDetail(e: gdk.Event) {
        let msg = new icmsg.GuildSthWarDetailReq()
        NetManager.send(msg)
    }

    _onGuildDetailRsp(data: icmsg.GuildDetailRsp) {
        let members = data.members
        let newMembers: GuildMemberLocal[] = []
        for (let i = 0; i < members.length; i++) {
            let guildMemberLocal: GuildMemberLocal = {
                id: members[i].id,
                name: members[i].name,
                head: members[i].head,
                frame: members[i].frame,
                level: members[i].level,
                fightNum: members[i].footholdNum,
                signFlag: Boolean(members[i].signFlag & 1),
                bossNum: members[i].bossNum,
                position: members[i].title,
                logoutTime: members[i].logoutTime,
                vipLv: GlobalUtil.getVipLv(members[i].vipExp),
                power: members[i].power,
                title: members[i].title0,
            }
            //更新自己的职位信息
            if (members[i].id == this.roleModel.id) {
                this.roleModel.guildTitle = members[i].title
            }
            newMembers.push(guildMemberLocal)
        }

        let detail: GuildDetail = {
            info: data.info,
            exp: data.exp,
            autoJoin: data.autoJoin,
            minLevel: data.minLevel,
            notice: data.notice,
            presidents: data.presidents,
            members: newMembers,
            recruitNum: data.recruitNum,
        }
        this.model.signNum = data.signNum
        this.model.guildDetail = detail
    }

    _onGuildCampRsp(data: icmsg.GuildCampRsp) {
        this.model.guildCamp = data.camp
        this.model.mapId = data.camp.sthWar.mapId
    }

    _onGuildCheckRsp(data: icmsg.GuildCheckRsp) {
        let list = this.model.applyList
        let newList = []
        for (let i = 0; i < list.length; i++) {
            if (data.playerId != 0 && data.playerId.toLocaleString() != list[i].id.toLocaleString()) {
                newList.push(list[i])
            }
        }
        this.model.applyList = newList

        //同意后请求公会详情
        if (data.ok) {
            let msg = new icmsg.GuildDetailReq()
            msg.guildId = this.model.guildDetail.info.id
            NetManager.send(msg)

            let siegeMsg = new icmsg.SiegeStateReq()
            NetManager.send(siegeMsg)
        }
    }

    _onGuildKickRsp(data: icmsg.GuildKickRsp) {
        if (data.playerId == 0) {
            //被踢
            this._clearGuildData()
            gdk.panel.hide(PanelId.GuildDetail)
            gdk.panel.hide(PanelId.GuildMain)
        }
    }

    _onGuildSetTitleRsp(data: icmsg.GuildSetTitleRsp) {
        GuildUtils.updateGuildPresident(data.playerId, data.title)
        if (data.title == GuildTitle.President) {
            gdk.e.emit(GuildEventId.REFRESH_GUILD_PRESIDENT)
        }
    }

    _onGuildSignInfoRsp(data: icmsg.GuildSignInfoRsp) {
        this.model.signFlag = data.flag
        this.model.signNum = data.total
        this.model.sthWarOpen = data.sthWarStarted
        this.model.sthWarTime = data.sthWarFnumber

        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    _onGuildSthWarDetailRsp(data: icmsg.GuildSthWarDetailRsp) {
        this.model.chance = data.chance
        this.model.mapId = data.mapId
        this.model.points = data.points
    }

    /**id为0被踢出公会 */
    _onGuildUpdateRsp(data: icmsg.GuildUpdateRsp) {
        if (data.guildId == 0) {
            this.roleModel.guildId = 0
            this.roleModel.guildTitle = 0
            this.roleModel.guildName = ""
            this._clearGuildData()
        } else {
            this.roleModel.guildId = data.guildId
        }
        gdk.e.emit(GuildEventId.UPDATE_GUILD_SIGN_INFO)
    }

    _clearGuildData() {
        this.roleModel.guildId = 0
        this.model.guildList = []
        this.model.guildCamp = null
        this.model.applyList = []
        this.model.guildDetail = null

        this.footHold.curMapData = null
        this.footHold.guildMapData = null
        this.footHold.globalMapData = null
    }

    /**
     * 公会boss信息
     * @param resp 
     */
    _onGuildBossStateRsp(resp: icmsg.GuildBossStateRsp) {
        let m = this.model;
        [m.gbOpenTime, m.gbBossType, m.gbBossLv, m.gbDamage, m.gbRewardFlag, m.gbRankTop3, m.gbEnterTime, m.gbPoint, m.gbMaxHurt]
            = [resp.openTime, resp.bossType, resp.bossLevel, resp.bossBlood, resp.rewardFlag, resp.top3, resp.enter, resp.bossPoint, resp.maxBlood];
        let gbCfg = ConfigManager.getItemByField(GuildbossCfg, 'type', m.gbBossType, { level: m.gbBossLv });
        let pveMainCfg = ConfigManager.getItemById(Pve_mainCfg, gbCfg.born);
        let born = pveMainCfg.monster_born_cfg[0];
        if (cc.js.isString(born)) {
            // 字符串格式，范围配置模式
            let a = born.split('-');
            let b = parseInt(a[0]);
            let e = a[1] ? parseInt(a[1]) : b;
            for (let id = b; id <= e; id++) {
                let monsterCfg = ConfigManager.getItemById(MonsterCfg, ConfigManager.getItemById(Pve_bornCfg, id).enemy_id);
                if (monsterCfg.color == 12) {
                    m.gbBossId = monsterCfg.id;
                    break;
                }
            }
        } else {
            m.gbBossId = ConfigManager.getItemById(Pve_bornCfg, pveMainCfg.monster_born_cfg[0]).enemy_id;
        }
        if (m.gbOpenTime > 0) {
            let req = new icmsg.GuildBossRankReq();
            NetManager.send(req);
        }
        gdk.e.emit(GuildEventId.UPDATE_GUILD_BOSS_OPEN);
    }

    /**
     * 公会伤害数据更新
     * @param resp 
     */
    _onGuildBossNoticeRsp(resp: icmsg.GuildBossNoticeRsp) {
        this.model.gbRankTop3 = resp.top3;
        this.model.gbDamage = resp.bossBlood;
        let req = new icmsg.GuildBossRankReq();
        NetManager.send(req);
        gdk.e.emit(GuildEventId.UPDATE_GUILD_BOSS_HP_CHANGE);
    }

    /**
     * 公会boss 排行榜
     * @param resp 
     */
    _onGuildBossRankRsp(resp: icmsg.GuildBossRankRsp) {
        this.model.gbRankInfo = resp.rank;
        gdk.e.emit(GuildEventId.UPDATE_GUILD_BOSS_DAMAGE_RANK_INFO);
    }

    /**
     * 公会boss 活动开启
     * @param resp 
     */
    _onGuildBossOpenRsp(resp: icmsg.GuildBossOpenRsp) {
        this.model.gbOpenTime = resp.openTime;
        this.model.gbPoint = resp.bossPoint;
        if (this.model.gbOpenTime > 0) {
            let req = new icmsg.GuildBossRankReq();
            NetManager.send(req);
        }
        gdk.e.emit(GuildEventId.UPDATE_GUILD_BOSS_OPEN);
    }

    /**
     * 公会 邀请列表
     * @param resp 
     */
    _onGuildInviteInfoRsp(resp: icmsg.GuildInviteInfoRsp) {
        this.model.guildInvitationList = resp.list;
        // gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    _onGuildJoinRsp(resp: icmsg.GuildJoinRsp) {
        //正常加入
        let data = resp;
        let roleModel = ModelManager.get(RoleModel);
        if (data.error == -1) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP48"))
        } else if (data.error == 0) {
            if (data.guildId && data.camp) {
                [PanelId.Friend, PanelId.Chat, PanelId.GuildInviteListView].forEach(panelId => {
                    if (gdk.panel.isOpenOrOpening(panelId)) {
                        gdk.panel.hide(panelId);
                    }
                })
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP49"), data.camp.guild.name))//`成功加入${data.camp.guild.name}公会`
                roleModel.guildId = data.guildId
                roleModel.guildName = data.camp.guild.name
                this.model.guildInvitationList = [];
                gdk.panel.open(PanelId.GuildMain)

                //req
                let reqList = [
                    icmsg.FootholdRedPointsReq,
                    icmsg.GuildBossStateReq,
                    icmsg.FootholdRoleInfoReq,
                    icmsg.SiegeStateReq,
                    icmsg.MergeCarnivalStateReq,
                ]
                reqList.forEach(element => {
                    let clz = element;
                    if (clz) {
                        NetManager.send(new clz());
                    }
                })
            }
        } else {
            gdk.gui.showMessage(ErrorManager.get(data.error, [data.minLv]))
        }
    }

    _onGuildInviteRsp(resp: icmsg.GuildInviteRsp) {
        if (resp.isInvite) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP50"));
        }
    }

    _onFootholdGuideQueryRsp(data: icmsg.FootholdGuideQueryRsp) {
        let list = data.guildList
        list.forEach(element => {
            this.footHold.teachTaskEventDatas[element.eventId] = element.number
        });
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    _onGuildRequestsRsp(data: icmsg.GuildRequestsRsp) {
        this.model.applyList = data.list
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    _onGuildReqNoticeRsp() {
        let msg = new icmsg.GuildRequestsReq()
        NetManager.send(msg)
    }

    /**红包列表 */
    _onGuildEnvelopeListRsp(resp: icmsg.GuildEnvelopeListRsp) {
        if (resp.my) {
            this.model.myEnvelopeList = resp.list;
        }
        else {
            this.model.grabEnvelopeList = resp.list;
        }
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        gdk.e.emit(GuildEventId.GUILD_RED_ENVELOPE_UPDATE);
    }

    /**红包变动推送 */
    _onGuildEnvelopeChangeRsp(resp: icmsg.GuildEnvelopeChangeRsp) {
        let list = resp.my ? this.model.myEnvelopeList : this.model.grabEnvelopeList;
        let ids = [];
        list.forEach(l => {
            if (ids.indexOf(l.id) == -1) {
                ids.push(l.id);
            }
        });

        let isAdd = false;
        for (let i = 0; i < resp.list.length; i++) {
            let info = resp.list[i];
            let idx = ids.indexOf(info.id);
            if (idx == -1) {
                isAdd = true;
                if (resp.my) {
                    this.model.myEnvelopeList = [info, ...this.model.myEnvelopeList];
                }
                else {
                    this.model.grabEnvelopeList = [info, ...this.model.grabEnvelopeList];
                }
            }
            else {
                if (resp.my) {
                    this.model.myEnvelopeList[idx] = info;
                }
                else {
                    this.model.grabEnvelopeList[idx] = info;
                }
            }
        }
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        gdk.e.emit(GuildEventId.GUILD_RED_ENVELOPE_UPDATE);
        isAdd && gdk.e.emit(GuildEventId.UPDATE_ENVELOPE_LIST, resp.my);
    }

    /**红包排行榜 */
    async _onGuildEnvelopeRankRsp(resp: icmsg.WorldEnvelopeRankRsp) {
        if (resp.type == 1) {
            this.model.envelopeRankList = resp.rank;
            for (let i = 0; i < resp.rank.length; i++) {
                if (resp.rank[i].role.id == this.roleModel.id) {
                    this.model.myEnvelopeRankInfo = {
                        idx: i,
                        info: resp.rank[i]
                    }
                    return;
                }
            }
            //自己没有数据
            let brief = new icmsg.RoleBrief();
            brief.id = this.roleModel.id;
            brief.name = this.roleModel.name;
            brief.level = this.roleModel.level;
            let info = new icmsg.WorldEnvelopeRank();
            info.role = brief;
            info.name = this.roleModel.guildName;
            info.num = 0;
            info.value = 0;
            this.model.myEnvelopeRankInfo = {
                idx: 999,
                info: info
            };
        }
        else {
            this.model.envGuildRankList = resp.rank;
            for (let i = 0; i < resp.rank.length; i++) {
                if (resp.rank[i].guild.id == this.roleModel.guildId) {
                    this.model.myEnvGuildRankInfo = {
                        idx: i,
                        info: resp.rank[i]
                    }
                    return;
                }
            }
            // //自己公会没有数据
            // let brief = new icmsg.GuildBrief();
            // let guildInfo = await GuildUtils.getGuildInfo().catch((e) => { info = null });
            // if (!guildInfo) brief = null;
            // else {
            //     brief.id = guildInfo.id;
            //     brief.name = guildInfo.name;
            //     brief.level = guildInfo.level;
            //     brief.icon = guildInfo.icon;
            //     brief.frame = guildInfo.frame;
            //     brief.bottom = guildInfo.bottom;
            // }
            // let info = new icmsg.WorldEnvelopeRank();
            // info.guild = brief;
            // info.name = guildInfo ? guildInfo.president : '';
            // info.num = 0;
            // info.value = 0;
            // this.model.myEnvGuildRankInfo = {
            //     idx: 999,
            //     info: info
            // };
        }
    }

    _onGuildEnvelopeSendRsp(resp: icmsg.GuildEnvelopeSendRsp) {
        this.model.myEnvelopeList = resp.list;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        gdk.e.emit(GuildEventId.GUILD_RED_ENVELOPE_UPDATE);
    }

    _onSiegeStateRsp(data: icmsg.SiegeStateRsp) {
        this.siegeModel.weekGroup = data.weekGroup//本周累计挑战波数
        this.siegeModel.todayMaxGroup = data.todayMaxGroup// 今日挑战波数
        this.siegeModel.weekBlood = data.weekBlood
        this.siegeModel.todayBlood = data.todayBlood// 城门受到伤害
        this.siegeModel.enterTimes = data.enterTimes// 挑战次数
        this.siegeModel.buyTimes = data.buyTimes// 购买次数
        this.siegeModel.serverNum = data.serverNum// 跨服组中游戏服数量
        this.siegeModel.worldLevelIndex = data.worldLevelIndex// 跨服组内世界平均等级
        this.siegeModel.isActivityOpen = data.isActivityOpen
        // for (let i = 0; i < data.storeTimes.length; i++) {
        //     this.siegeModel.storeTimes[data.storeTimes[i].index] = data.storeTimes[i]
        // }
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    _onSiegeBloodRsp(data: icmsg.SiegeBloodRsp) {
        this.siegeModel.weekBlood = data.weekBlood
        this.siegeModel.todayBlood = data.todayBlood
    }

    _onWorldEnvelopeIdRsp(resp: icmsg.WorldEnvelopeIdRsp) {
        if (resp.maxGotId !== -1) this.model.worldEnvMaxGotId = resp.maxGotId;
        this.model.worldEnvMaxId = resp.maxEnvId;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        gdk.e.emit(GuildEventId.GUILD_RED_ENVELOPE_UPDATE);
    }

    _onWroldlopeGetRsp(resp: icmsg.WorldEnvelopeGetRsp) {
        this.model.worldEnvMaxGotId = resp.maxGotId;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        gdk.e.emit(GuildEventId.GUILD_RED_ENVELOPE_UPDATE);
    }

    /*末日集结数据*/
    _onGuildGatherStateRsp(data: icmsg.GuildGatherStateRsp) {
        this.model.playerPower = data.power
        this.model.totalPower = data.totalPower
        this.model.numberCount = data.numberCount
        this.model.heroOn = data.heroOn
        this.model.hasReward = data.reward
        this.model.getRewarded = data.rewarded
        this.model.powerWorldLv = data.worldLevel || 1
        this.model.powerStar = data.star
        this.model.confirm = data.confirm
    }

    /**集结结束 */
    _onGuildGatherEndRsp(data: icmsg.GuildGatherEndRsp) {
        if (data.rewards.length > 0) {
            let msg = new icmsg.GuildGatherStateReq()
            NetManager.send(msg)
        }
    }

    /**远征 据点数据更新 */
    _onExpeditionBroadcastRsp(data: icmsg.ExpeditionBroadcastRsp) {
        ExpeditionUtils.updatePointInfo(data.point)
    }

    /**通关大地图更新 */
    _onExpeditionMapClearRsp(data: icmsg.ExpeditionMapClearRsp) {
        ExpeditionUtils.updateMap(data.mapId)
    }

    /**远征 部队任务信息 */
    _onExpeditionMissionStateRsp(resp: icmsg.ExpeditionMissionStateRsp) {
        let m = ModelManager.get(ExpeditionModel);
        m.armyExp = resp.armyExp;
        //task
        let datas = {};
        for (let i = 0; i < resp.progress.length; i++) {
            const element = resp.progress[i];
            if (!datas[element.type]) {
                datas[element.type] = {};
            }
            datas[element.type][element.arg] = element;
        }
        m.armyTaskData = datas;
        //rewards
        m.armyTaskRewardsIds = {};
        let idStr = resp.rewarded.toString(2);
        let ids = idStr.split("");
        ids = ids.reverse();
        for (let i = 0; i < ids.length; i++) {
            if (ids[i] == '1') {
                m.armyTaskRewardsIds[i] = 1;
            }
        }
        gdk.e.emit(GuildEventId.EXPEDITION_TASK_UPDATE);
    }

    /**远征 部队任务进度更新 */
    _onExpeditionMissionUpdateRsp(data: icmsg.ExpeditionMissionUpdateRsp) {
        let m = ModelManager.get(ExpeditionModel);
        if (!m.armyTaskData[data.progress.type]) {
            m.armyTaskData[data.progress.type] = {};
        }
        m.armyTaskData[data.progress.type][data.progress.arg] = data.progress;
        gdk.e.emit(GuildEventId.EXPEDITION_TASK_UPDATE);
    }

    /**远征 部队任务领奖 */
    _onExpeditionMissionRewardRsp(data: icmsg.ExpeditionMissionRewardRsp) {
        let m = ModelManager.get(ExpeditionModel);
        m.armyExp = data.armyExp;
        let cfg = ConfigManager.getItemByField(Expedition_missionCfg, 'mission_id', data.missionId, { type: m.activityType });
        m.armyTaskRewardsIds[cfg.id] = 1;
        gdk.e.emit(GuildEventId.EXPEDITION_TASK_UPDATE);
    }

    /**远征 部队状态 */
    _onExpeditionArmyStateRsp(resp: icmsg.ExpeditionArmyStateRsp) {
        let m = ModelManager.get(ExpeditionModel);
        m.armyStrengthenStateMap = {};
        m.armyStrengthenStateMap[1] = resp.levels1.length <= 0 ? [0, 0, 0, 0, 0, 0] : resp.levels1;
        m.armyStrengthenStateMap[2] = resp.levels2.length <= 0 ? [0, 0, 0, 0, 0, 0] : resp.levels2;
        m.armyStrengthenStateMap[3] = resp.levels3.length <= 0 ? [0, 0, 0, 0, 0, 0] : resp.levels3;
    }

    /**远征 部队强化 */
    _onExpeditionArmyStrengthenRsp(resp: icmsg.ExpeditionArmyStrengthenRsp) {
        let m = ModelManager.get(ExpeditionModel);
        m.armyStrengthenStateMap[resp.professionalType][resp.buffType - 1] = resp.level;
        this._updatePower();
    }

    /**远征 查看英雄 */
    _onExpeditionHeroListRsp(resp: icmsg.ExpeditionHeroListRsp) {
        let m = ModelManager.get(ExpeditionModel);
        m.expeditionHeros = resp.list;
        m.energyBought = resp.energyBought;
        //async 传染
        let cb = async () => {
            m.expedtitionAllPower = await ExpeditionUtils.getAllPower();
        }
        cb();
    }

    /**远征 更换英雄*/
    _onExpeditionHeroChangeRsp(resp: icmsg.ExpeditionHeroChangeRsp) {
        ExpeditionUtils.updateExpeditionHero(resp.hero);
        this._updatePower();
    }

    async _updatePower() {
        let m = ModelManager.get(ExpeditionModel);
        let oldPower = m.expedtitionAllPower;
        m.expedtitionAllPower = await ExpeditionUtils.getAllPower();
        if (oldPower < m.expedtitionAllPower) {
            if (gdk.panel.isOpenOrOpening(PanelId.ExpeditionPowerTip)) {
                gdk.panel.hide(PanelId.ExpeditionPowerTip);
            }
            gdk.DelayCall.addCall(() => {
                JumpUtils.openPanel({
                    panelId: PanelId.ExpeditionPowerTip,
                    panelArgs: {
                        args: [oldPower, m.expedtitionAllPower],
                        parent: gdk.gui.layers.messageLayer
                    }
                })
            }, this, 0.5);
        }
    }

}