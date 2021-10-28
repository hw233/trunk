import ActUtil from '../../../view/act/util/ActUtil';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import CopyUtil from '../../utils/CopyUtil';
import DoomsDayModel from '../../../view/instance/model/DoomsDayModel';
import GlobalUtil from '../../utils/GlobalUtil';
import InstanceModel, { InstanceData } from '../../../view/instance/model/InstanceModel';
import InstanceNetModel from '../../models/InstanceNetModel';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import RedPointUtils from '../../utils/RedPointUtils';
import TrialInfo from '../../../view/instance/trial/model/TrialInfo';
import { Copy_stageCfg, CopyCfg, SystemCfg } from '../../../a/config';
import { CopyType } from './../../models/CopyModel';
import { GetCopyIDIDBySubType, GetInstanceIndexByID, GetInstanceTypeByID } from '../../../view/instance/utils/InstanceUtil';
import { GlobalCfg } from './../../../a/config';
import { InstanceEventId, InstanceID } from '../../../view/instance/enum/InstanceEnumDef';


/**
 * 副本信息控制器
 * @Author: jijing.liu
 * @Date: 2019-04-08 10:19:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-26 21:55:10
 */

export default class InstanceController extends BaseController {

    // REQ_BOSS_SUMMON = "REQ_BOSS_SUMMON", // boss召唤
    // RSP_BOSS_SUMMON = "RSP_BOSS_SUMMON",

    // REQ_BOSS_HERO = "REQ_BOSS_HERO", // 英雄上阵
    // RSP_BOSS_HERO = "RSP_BOSS_HERO",

    // REQ_BOSS_FIGHT = "REQ_BOSS_FIGHT",   // 请求点杀
    // RSP_BOSS_FIGHT = "RSP_BOSS_FIGHT",   // 返回点杀

    // REQ_BOSS_HERO_FIGHT = "REQ_BOSS_HERO_FIGHT",   // 请求上阵英雄攻击
    // RSP_BOSS_HERO_FIGHT = "RSP_BOSS_HERO_FIGHT",   // 返回上阵英雄攻击


    get gdkEvents(): GdkEventArray[] {
        return [
            [InstanceEventId.REQ_INST_LIST, this._onInstanceListReq],
        ];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.DungeonListRsp.MsgType, this._onInstanceListRsp],
            [icmsg.DungeonEnterRsp.MsgType, this._onInstanceEnterRsp],
            [icmsg.DungeonExitRsp.MsgType, this._onInstanceExitRsp],
            [icmsg.DungeonRaidsRsp.MsgType, this._onInstanceRaidsRsp],
            [icmsg.DungeonHangStatusRsp.MsgType, this._onInstanceHangInfoRsp],
            [icmsg.DungeonHangRewardRsp.MsgType, this._onInstanceHangRewardRsp],
            [icmsg.DungeonBossClickRsp.MsgType, this._onInstanceBossFightRsp],
            [icmsg.DungeonBossFightRsp.MsgType, this._onInstanceBossHeroFightRsp],
            [icmsg.DungeonBossBattleRsp.MsgType, this._onInstanceBossHeroRsp],
            //[icmsg.DungeonBossSummonRsp.MsgType, this._onInstanceBossSummonRsp],
            //[icmsg.DungeonTrialResetRsp.MsgType, this._onDungeonTrialResetRsp],
            [icmsg.JusticeStateRsp.MsgType, this._onInstanceBossStateRsp],
            [icmsg.JusticeClickRsp.MsgType, this._onInstanceBossClickRsp],
            [icmsg.JusticeSummonRsp.MsgType, this._onInstanceBossSummonRsp],
            [icmsg.JusticeBossResetRsp.MsgType, this._onInstanceResetBossRsp],
            [icmsg.DoomsDayListRsp.MsgType, this._onDoomsDayListRsp],
            [icmsg.DungeonHeroSweepTimesRsp.MsgType, this._onHeroSweepTimesListRsp],
            [icmsg.DungeonRuneInfoRsp.MsgType, this._onRuneInfoRsp],
            [icmsg.DungeonOrdealInfoRsp.MsgType, this._onOrdealInfoRsp],
            [icmsg.DungeonOrdealRewardUpdateRsp.MsgType, this._onDungeonOrdealRewardUpdateRsp]
        ];
    }


    private model: InstanceModel = null;

    onStart() {
        this.model = ModelManager.get(InstanceModel);
    }

    onEnd() {
        this.model = null;
    }

    _onInstanceListReq(e: gdk.Event) {
        this.model.isInstDataCplt = false
        NetManager.send(new icmsg.DungeonListReq())
    }

    //获取副本数据成功
    _onInstanceListRsp(msg: icmsg.DungeonListRsp) {
        this.model.instanceNetData = msg.list;
        this.model.dungeonBoss = msg.boss;
        // 保存一份数据到公用数据模型
        let temp = ModelManager.get(InstanceNetModel);
        temp.instanceBoss = msg.boss;
        temp.instanceList = msg.list;
        temp.instanceList.forEach(e => {
            let stageId = e.stageId;
            if (stageId <= 0) {
                let cfg = ConfigManager.getItemByField(Copy_stageCfg, "copy_id", e.dungeonId, null)
                if (cfg) {
                    stageId = cfg.id
                }
            }
            if (stageId > 0) {
                // 请求副本挂机相关信息，红点提示处理
                let smsg = new icmsg.DungeonHangStatusReq();
                smsg.stageId = stageId
                NetManager.send(smsg);
            }
        });
        if (!this.model.configLoaded) {
            this._initInstanceCfg();
            this.model.configLoaded = true;
        }
        this._updateInstanceServerData();
        gdk.e.emit(InstanceEventId.RSP_INST_LIST);
    }

    //初始化化副本信息，用作红点处理
    _initInstanceCfg() {
        let showCopyIds = ConfigManager.getItemById(GlobalCfg, 'instance_list_copy_ids').value;
        let ids: { [copy_id: number]: boolean } = {};
        let arr: InstanceData[] = [];
        let instances: CopyCfg[] = ConfigManager.getItems(CopyCfg);
        let instanceInfos = this.model.instanceInfos;
        let stageDatas = this.model.stageDatas;
        for (let index = 0, length = instances.length; index < length; index++) {
            let cfg: CopyCfg = instances[index];
            const element: InstanceData = {
                data: cfg,
                type: GetInstanceTypeByID(cfg.copy_id),
                index: GetInstanceIndexByID(cfg.copy_id),
                serverData: null,
            }
            if (instanceInfos[cfg.copy_id] == null) {
                instanceInfos[cfg.copy_id] = [element];
            } else {
                instanceInfos[cfg.copy_id].push(element);
            }
            // 主线副本 专精副本 经验药副本 金币副本剔除 BOSS点杀
            if (ids[cfg.copy_id] == void 0 && showCopyIds.indexOf(cfg.copy_id) >= 0) {
                ids[cfg.copy_id] = true;
                if (cfg.copy_id == 12) {
                    let add = CopyUtil.getEliteStageCurCupReward();
                    if (!add) arr.push(element);
                } else if (cfg.copy_id == 27) {
                    if (ActUtil.ifActOpen(130)) {
                        arr.push(element);
                    }
                } else {
                    arr.push(element);
                }
            }
            // 按开放等级排序
            GlobalUtil.sortArray(arr, (a: InstanceData, b: InstanceData) => {
                let sysIdA = RedPointUtils.get_copy_open_lv(a.data.copy_id);
                let cfgA = ConfigManager.getItemById(SystemCfg, sysIdA);
                let sysIdB = RedPointUtils.get_copy_open_lv(b.data.copy_id);
                let cfgB = ConfigManager.getItemById(SystemCfg, sysIdB);
                return cfgA.openLv - cfgB.openLv;
            });
            this.model.instanceListItemData = arr;

            var stages: Copy_stageCfg[] = ConfigManager.getItems(Copy_stageCfg);
            stages.forEach(element => {
                let id = GetCopyIDIDBySubType(element.subtype);
                if (stageDatas[id] == null) {
                    stageDatas[id] = [element];
                } else {
                    //this.model.stageDatas[id].push(element);
                    if (stageDatas[id].indexOf(element) < 0) {
                        stageDatas[id].push(element);
                    }
                }
            });
        }

        // 排序
        let cfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'instance_list_copy_ids');
        GlobalUtil.sortArray(this.model.instanceListItemData, (a, b) => {
            let idxA = cfg.value.indexOf(a.data.copy_id);
            let idxB = cfg.value.indexOf(b.data.copy_id);
            return idxA - idxB;
            // let systemCfgA = ConfigManager.getItemById(SystemCfg, GetInstanceSystemIdByID(a.data.copy_id))
            // let systemCfgB = ConfigManager.getItemById(SystemCfg, GetInstanceSystemIdByID(b.data.copy_id))
            // if (systemCfgA && systemCfgB && systemCfgA.fbId && systemCfgB.fbId) {
            //     return systemCfgA.fbId - systemCfgB.fbId
            // }
            // return b.index - a.index;
        })
    }

    _updateInstanceServerData() {
        this.model.isInstDataCplt = true;
        this.model.instanceListItemData.forEach(data => {
            data.serverData = null;
            this.model.instanceNetData.some(element => {
                if (data.data.copy_id == element.dungeonId) {
                    data.serverData = element;
                    return true;
                }
                return false;
            });
        });
        // 触发绑定更新
        this.model.instanceListItemData = this.model.instanceListItemData;
    }

    // 返回进入关卡id，进入战斗模块的对应关卡
    _onInstanceEnterRsp(msg: icmsg.DungeonEnterRsp) {
        let id: number = msg.stageId;
        gdk.e.emit(InstanceEventId.RSP_INST_ENTER, id);
    }

    //返回退出关卡
    _onInstanceExitRsp(msg: icmsg.DungeonExitRsp) {
        gdk.e.emit(InstanceEventId.RSP_INST_EXIT, { id: msg.stageId, rewards: msg.rewards });
        let cfg = ConfigManager.getItemById(Copy_stageCfg, msg.stageId);
        if (cfg && cfg.copy_id == CopyType.Trial) {
            let trial = ModelManager.get(TrialInfo);
            if (msg.stageId > trial.lastStageId && msg.rewards.length > 0) {
                trial.lastStageId = msg.stageId;
                trial.runAction = true;
            }
        }
    }

    _onInstanceRaidsRsp(msg: icmsg.DungeonRaidsRsp) {
        gdk.e.emit(InstanceEventId.RSP_INST_RAIDS, { id: msg.stageId, rewards: msg.rewards });
    }

    _onInstanceHangRewardRsp(msg: icmsg.DungeonHangRewardRsp) {
        gdk.e.emit(InstanceEventId.RSP_HANG_REWARD, msg);
        // gdk.e.emit(InstanceEventId.RSP_HANG_REWARD, {
        //     id: msg.stageId,
        //     startTime: msg.startTime,
        //     exploreTime: msg.exploreTime,
        //     goodsList: msg.goodsList,
        //     dungeonId: msg.dungeonId
        // });
    }

    _onInstanceHangInfoRsp(msg: icmsg.DungeonHangStatusRsp) {
        //存一份数据对应的副本挂机奖励信息
        //let cfg: Copy_stageCfg = ConfigManager.getItem(Copy_stageCfg, { id: msg.stageId });

        if (msg.goodsList && msg.goodsList.length > 0) {
            this.model.instanceHangReward[msg.dungeonId] = msg.goodsList;
        }
        if (msg.dungeonId != InstanceID.MAIN_INST) {
            gdk.e.emit(InstanceEventId.RSP_HANG_INFO, {
                id: msg.stageId,
                startTime: msg.startTime,
                exploreTime: msg.exploreTime,
                goodsList: msg.goodsList
            });
        }
    }

    _onInstanceBossFightRsp(msg: icmsg.DungeonBossClickRsp) {
        gdk.e.emit(InstanceEventId.RSP_BOSS_FIGHT, {
            stageId: msg.stageId,
            bossHp: msg.bossHp,
            dropList: msg.dropList,
            isCrit: msg.isCrit
        });
    }

    _onInstanceBossHeroFightRsp(msg: icmsg.DungeonBossFightRsp) {
        gdk.e.emit(InstanceEventId.RSP_BOSS_HERO_FIGHT, { bossInfo: msg.bossInfo, dropList: msg.dropList });
    }

    _onInstanceBossHeroRsp(msg: icmsg.DungeonBossBattleRsp) {
        gdk.e.emit(InstanceEventId.RSP_BOSS_HERO, { bossInfo: msg.bossInfo });
    }

    //召唤boss
    _onInstanceBossSummonRsp(msg: icmsg.JusticeSummonRsp) {
        gdk.e.emit(InstanceEventId.RSP_BOSS_JUSTICE_SUMMON, { bossData: msg });
    }

    //边框升级
    // _onInstanceFrameLvupRsp(msg: JusticeFrameLvupRsp) {
    //     gdk.e.emit(InstanceEventId.RSP_BOSS_JUSTICE_FRAMEUPLV, { frameData: msg });
    // }
    //重置boss数据
    _onInstanceResetBossRsp(msg: icmsg.JusticeBossResetRsp) {
        gdk.e.emit(InstanceEventId.RSP_BOSS_JUSTICE_RESETBOSS, { resetData: msg })
    }

    //英雄副本状态
    _onInstanceBossStateRsp(msg: icmsg.JusticeStateRsp) {
        gdk.e.emit(InstanceEventId.RSP_BOSS_JUSTICE_STATE, { bossInfo: msg })
        this.model.dunGeonBossJusticeState = msg;
    }
    //英雄副本点击boss
    _onInstanceBossClickRsp(msg: icmsg.JusticeClickRsp) {
        gdk.e.emit(InstanceEventId.RSP_BOSS_PLAYER_CLICK, { clickData: msg })
    }

    // _onDungeonTrialResetRsp(msg: DungeonTrialResetRsp) {
    //     let trial = ModelManager.get(TrialInfo);
    //     trial.lastStageId = 0;
    //     trial.bestStageId = msg.bestStageId;
    //     trial.resetTime = msg.resetTime;
    // }

    //末日考验数据
    _onDoomsDayListRsp(msg: icmsg.DoomsDayListRsp) {
        let doomsDayModel = ModelManager.get(DoomsDayModel);
        doomsDayModel.doomsDayInfos = msg.list;
        gdk.e.emit(InstanceEventId.RSP_DOOMSDAY_INFO_REFRESH);
    }
    //末日考验数据
    _onHeroSweepTimesListRsp(msg: icmsg.DungeonHeroSweepTimesRsp) {
        // let doomsDayModel = ModelManager.get(DoomsDayModel);
        // doomsDayModel.doomsDayInfos = msg.list;
        // gdk.e.emit(InstanceEventId.RSP_DOOMSDAY_INFO_REFRESH);
        this.model.heroCopyPassStageIDs = msg.maxStage;
        this.model.heroCopySweepTimes = msg.heroSweep;
    }

    _onRuneInfoRsp(msg: icmsg.DungeonRuneInfoRsp) {
        this.model.runeInfo = msg;
    }

    //英雄试炼信息
    _onOrdealInfoRsp(msg: icmsg.DungeonOrdealInfoRsp) {
        this.model.heroTrialInfo = msg;
    }
    //更新奖励剩余信息
    _onDungeonOrdealRewardUpdateRsp(msg: icmsg.DungeonOrdealRewardUpdateRsp) {
        this.model.heroTrialInfo.rewardTimes = msg.reward;
    }
}