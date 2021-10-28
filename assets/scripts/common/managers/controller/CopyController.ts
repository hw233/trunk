import ActivityModel from '../../../view/act/model/ActivityModel';
import ArenaTeamViewModel from '../../../view/arenaTeam/model/ArenaTeamViewModel';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import CopyModel, { CopyEventId } from '../../models/CopyModel';
import CopyUtil from '../../utils/CopyUtil';
import InstanceModel from '../../../view/instance/model/InstanceModel';
import InstanceSurvivalHireLogItemCtrl from '../../../view/instance/ctrl/survival/InstanceSurvivalHireLogItemCtrl';
import MainLineModel from '../../../view/instance/model/MainLineModel';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import TrialInfo from '../../../view/instance/trial/model/TrialInfo';
import { ArenaTeamEvent } from '../../../view/arenaTeam/enum/ArenaTeamEvent';
import { Copy_stageCfg, Copysurvival_stageCfg } from '../../../a/config';
import { CopyType } from './../../models/CopyModel';
import { RedPointEvent } from '../../utils/RedPointUtils';

/**
 * 副本相关数据管理器
 * @Author: sthoo.huang
 * @Date: 2019-04-24 20:58:33
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-30 15:15:23
 */

export default class CopyController extends BaseController {

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.DungeonListRsp.MsgType, (msg: icmsg.DungeonListRsp) => {
                this._copyList(msg);
            }],
            [icmsg.DungeonChapterListRsp.MsgType, (msg: icmsg.DungeonChapterListRsp) => {
                this.model.chapterList = msg.list;
                this._mainLineInfo();
                gdk.e.emit(CopyEventId.RSP_COPY_MAIN_CHAPTER_LIST);
            }],
            [icmsg.DungeonExitRsp.MsgType, (msg: icmsg.DungeonExitRsp) => {
                // 更新副本列表和精英副本状态
                NetManager.send(new icmsg.DungeonListReq());
                NetManager.send(new icmsg.DungeonElitesReq());
            }],
            [icmsg.DungeonRaidsRsp.MsgType, (msg: icmsg.DungeonRaidsRsp) => {
                gdk.e.emit(CopyEventId.RSP_COPY_MAIN_RAIDS, { id: msg.stageId, rewards: msg.rewards });
            }],
            [icmsg.DungeonHangStatusRsp.MsgType, (msg: icmsg.DungeonHangStatusRsp) => {
                // 仅对主线挂机进行处理，因为其他副本挂机也会发送处理
                if (msg.stageId == -1) {
                    this.model.hangStateMsg = msg;
                    gdk.e.emit(CopyEventId.RSP_COPY_MAIN_HANG, msg);
                } else {
                    let cfg = ConfigManager.getItemById(Copy_stageCfg, msg.stageId);
                    if (cfg && cfg.copy_id == 1) {
                        this.model.hangStateMsg = msg;
                        this.model.hangStageId = msg.stageId
                        gdk.e.emit(CopyEventId.RSP_COPY_MAIN_HANG, msg);
                    }
                }
            }],
            [icmsg.DungeonHangRewardRsp.MsgType, (msg: icmsg.DungeonHangRewardRsp) => {
                this.model.hangRewardMsg = msg;
                if (msg.dungeonId == 1 && this.model.hangStateMsg) {
                    this.model.hangStateMsg.goodsList.length = 0;
                    this.model.hangStateMsg.startTime = msg.startTime;
                    this.model.hangStateMsg.exploreTime = msg.exploreTime;
                }
                gdk.e.emit(CopyEventId.RSP_COPY_MAIN_HANG_REWARD, msg);
            }],



            [icmsg.DungeonElitesRsp.MsgType, (msg: icmsg.DungeonElitesRsp) => {
                this.model.eliteStageData = []//msg.list;
                this.model.eliteRewardState = 0//msg.bits;
                this.model.eliteNovice = msg.noviceStage;
                this.model.eliteNoviceBits = msg.noviceBits
                this.model.eliteChallenge = msg.challengeStage;
                this.model.eliteChallengeBits = msg.challengeBits;

                let add = CopyUtil.getEliteStageCurCupReward()
                if (add) {
                    let instanceModel = ModelManager.get(InstanceModel);
                    for (let i = instanceModel.instanceListItemData.length - 1; i >= 0; i--) {
                        let tem = instanceModel.instanceListItemData[i]
                        if (tem.data.copy_id == 12) {
                            instanceModel.instanceListItemData.splice(i, 1);
                        }
                    }
                }
            }],

            [icmsg.SurvivalStateRsp.MsgType, (msg: icmsg.SurvivalStateRsp) => {
                this.model.survivalStateMsg = msg;
            }],
            // [SurvivalHeroOnRsp.MsgType, (msg: SurvivalHeroOnRsp) => {
            //     this.model.survivalStateMsg.heroes = msg.heroes;
            // }],
            [icmsg.SurvivalExitRsp.MsgType, (msg: icmsg.SurvivalExitRsp) => {
                if (msg.clear) {
                    // 设置当前副本为下一关卡
                    let stateMsg = this.model.survivalStateMsg;
                    let cfg = ConfigManager.getItemById(Copysurvival_stageCfg, msg.stageId);
                    if (cfg) {
                        cfg = ConfigManager.getItem(Copysurvival_stageCfg, { subtype: cfg.subtype, sort: cfg.sort + 1 });
                        stateMsg.stageId = cfg ? cfg.id : 0;
                    } else {
                        stateMsg.stageId = 0;
                    }
                    if (stateMsg.stageId == 0) {
                        this.model.survivalIsOver = true;
                        if (stateMsg.subType == 1) {
                            stateMsg.diffTimes += 1;
                        } else {
                            stateMsg.passTimes += 1;
                        }
                    }
                }
                NetManager.send(new icmsg.DungeonListReq());
            }],
            [icmsg.SurvivalEquipBuyRsp.MsgType, (msg: icmsg.SurvivalEquipBuyRsp) => {
                let stateMsg = this.model.survivalStateMsg;
                let equips = stateMsg.equips;
                stateMsg.lastBuy = true;
                for (let i = equips.length - 1; i >= 0; i--) {
                    let e = equips[i];
                    if (e.equipId == msg.equipInfo.equipId) {
                        // 替换
                        equips[i] = msg.equipInfo;
                        return;
                    }
                }
                // 增加
                equips.push(msg.equipInfo);
            }],
            [icmsg.MartialSoulStateRsp.MsgType, (msg: icmsg.MartialSoulStateRsp) => {
                this.model.eternalCopyStageIds = msg.stageIds;
            }],

            [icmsg.BountyCompleteRsp.MsgType, (msg: icmsg.BountyCompleteRsp) => {
                // 更新副本列表和精英副本状态
                NetManager.send(new icmsg.DungeonListReq());
                NetManager.send(new icmsg.DungeonElitesReq());
            }],
            [icmsg.RuinStateRsp.MsgType, (msg: icmsg.RuinStateRsp) => {
                this.model.endRuinStateData = msg;
                msg.stages.forEach(data => {
                    this.model.endRuinStageData['' + data.stageId] = data.star;
                })
            }],
            //末日废墟 玩家占领信息改变消息
            [icmsg.RuinChapterChallengeRsp.MsgType, (msg: icmsg.RuinChapterChallengeRsp) => {
                let have = false;
                this.model.endRuinStateData.chapters.forEach(data => {
                    if (data.chapter == msg.chapter) {
                        have = true;
                        data.player = msg.player;
                        data.challenger = msg.challenger;
                    }
                })
                if (!have) {
                    let data = new icmsg.RuinChapterChallengeRsp()
                    data.chapter = msg.chapter;
                    data.player = msg.player;
                    data.challenger = msg.challenger;
                    this.model.endRuinStateData.chapters.push(data);
                }
                gdk.e.emit(CopyEventId.UPDATE_COPY_ENDRUIN_PLAYER, msg);
            }],
            //组队竞技场组队信息改变
            [icmsg.ArenaTeamRedPointsRsp.MsgType, (msg: icmsg.ArenaTeamRedPointsRsp) => {
                if (msg.type == 1) {
                    let temModel = ModelManager.get(ArenaTeamViewModel)
                    temModel.inviterRed = true;
                }
                gdk.e.emit(ArenaTeamEvent.RSP_ARENATEAM_REDPOINT, msg);
            }],

            // [icmsg.GuardianCopyOpenRsp.MsgType, this._onGuardianCopyOpenRsp],
            [icmsg.GuardianCopyStateRsp.MsgType, this._onGuardianCopyStateRsp],
            [icmsg.GuardianCopyRaidRsp.MsgType, this._onGuardianCopyRaidRsp],
            [icmsg.GuardianCopyExitRsp.MsgType, this._onGuardianCopyExitRsp],
            [icmsg.DungeonUltimateStateRsp.MsgType, this._onDungeonUltimateStateRsp],
            [icmsg.SurvivalMerRewardsPreviewRsp.MsgType, this._onSurvivalMerRewardsPreviewRsp],
        ];
    }

    model: CopyModel = null;
    viewModel: MainLineModel = null;

    onStart(): void {
        this.model = ModelManager.get(CopyModel);
        this.viewModel = ModelManager.get(MainLineModel);
    }

    onEnd(): void {

    }

    _copyList(msg: icmsg.DungeonListRsp) {
        this.model.copyList = [];
        msg.list.forEach(element => {
            if (element.dungeonId == CopyType.MAIN) {
                // 主线副本
                this.model.copyList.push(element);
            }
            else if (element.dungeonId == CopyType.Trial) {
                // 未日考验
                let trial = ModelManager.get(TrialInfo);
                trial.lastStageId = element.stageId;
                trial.resetTime = element.hangupTime;
                trial.bestStageId = element.num;
                trial.rewardBit = element.rewardFlag;
                trial.buyNum = element.buyRaids;
                trial.raidsNum = element.raids;
            } else if (element.dungeonId == CopyType.Mystery) {
                let model = ModelManager.get(ActivityModel);
                model.mysterypassStageId = element.stageId;
            }
        });
        // if (msg.trialBox.length > 0) {
        //     let trial = ModelManager.get(TrialInfo);
        //     trial.rewardBit = msg.trialBox
        // }

        let cfgs = this.model.mainStageCfgs;
        this.model.latelyStageId = cfgs[0].id;
        if (this.model.copyList.length > 0) { // 主线有关卡已过关
            // 主线只有一个子类型
            this.model.hangStageId = this.model.copyList[0].hangupId;
            let id = this.model.copyList[0].stageId;
            if (id != this.model.lastCompleteStageId) {
                this.model.lastCompleteStageId = id;
            }
            if (id == 0) {
                this.model.latelyStageId = cfgs[0].id
            } else {
                for (let i = 0, len = cfgs.length; i < len; i++) {
                    let cfg = cfgs[i];
                    this.model.passStages[cfg.id] = true;
                    if (cfg.id == id) {
                        this.model.latelyStageId = (i == len - 1) ? id : cfgs[i + 1].id;
                        break;
                    }
                }
            }
        } else {
            this.model.lastCompleteStageId = 0;
        }
        gdk.e.emit(CopyEventId.RSP_COPY_LIST);
    }

    _mainLineInfo() {
        this.viewModel.ownAreaCupNumber = {};
        this.model.chapterList.forEach(element => {
            let cupGetNum: number = 0;
            // 区域已领取的宝箱
            this.viewModel.receiveAreaCupReward[element.chapterId] = element.boxes;
            let stageIndex: number = 0;
            // 奖励id对应的关卡
            let cfgs: Copy_stageCfg[] = ConfigManager.getItems(Copy_stageCfg, { prize: element.chapterId });
            // 每个关卡的奖杯信息
            element.cups.forEach(c => {
                if (cfgs.length > stageIndex) {
                    this.viewModel.stageCupInfo[cfgs[stageIndex].id] = c;
                    stageIndex++;
                    cupGetNum += this.viewModel.getCupCount(c);
                } else {
                    console.log("#stageIndex==" + stageIndex)
                }
            })

            for (let i = 0; i < cfgs.length; i++) {
                this.viewModel.stageCupsNum[cfgs[i].id] = 0;
                for (let index = 1; index < 4; index++) {
                    if (cfgs[i]['cuptask_' + index] != "") {
                        this.viewModel.stageCupsNum[cfgs[i].id]++;
                    }
                }
            }

            // 区域已经获得奖杯数
            this.viewModel.ownAreaCupNumber[element.chapterId] = cupGetNum;
            // 触发binding事件
            this.viewModel.ownAreaCupNumber = this.viewModel.ownAreaCupNumber;
            this.viewModel.stageCupInfo = this.viewModel.stageCupInfo;
        });
    }

    // /**守护者副本开启推送 */
    // _onGuardianCopyOpenRsp(resp: icmsg.GuardianCopyOpenRsp) {
    //     this.model.guardianOpen = resp.open;
    // }

    /**守护者副本信息 */
    _onGuardianCopyStateRsp(resp: icmsg.GuardianCopyStateRsp) {
        this.model.guardianOpen = resp.open;
        this.model.guardianMaxStageId = resp.maxStageId;
        this.model.guardianRaidNum = resp.raidNum;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**守护者副本扫荡 */
    _onGuardianCopyRaidRsp(resp: icmsg.GuardianCopyRaidRsp) {
        this.model.guardianRaidNum = resp.raidNum;
    }

    /**守护者副本首通 */
    _onGuardianCopyExitRsp(resp: icmsg.GuardianCopyExitRsp) {
        if (resp.rewards.length > 0 && resp.stageId > this.model.guardianMaxStageId) {
            this.model.guardianMaxStageId = resp.stageId;
        }
    }

    /**终极试炼状态 */
    _onDungeonUltimateStateRsp(data: icmsg.DungeonUltimateStateRsp) {
        this.model.ultimateMaxStageId = data.maxStageId
        this.model.ultimateEnterNum = data.enterNum
        this.model.ultimateLeftNum = data.leftNum
        this.model.ultimatIsClear = data.clear
    }

    /**雇佣奖励 */
    _onSurvivalMerRewardsPreviewRsp(data: icmsg.SurvivalMerRewardsPreviewRsp) {
        this.model.survivalStateMsg.merRewards = data.rewards
        this.model.survivalStateMsg = this.model.survivalStateMsg
        gdk.e.emit(CopyEventId.RSP_COPY_LIST)
    }
}
