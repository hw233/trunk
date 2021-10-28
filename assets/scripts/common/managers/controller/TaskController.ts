import ActivityModel from '../../../view/act/model/ActivityModel';
import ActUtil from '../../../view/act/util/ActUtil';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import CarnivalUtil from '../../../view/act/util/CarnivalUtil';
import ConfigManager from '../ConfigManager';
import FootHoldModel from '../../../view/guild/ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../utils/GlobalUtil';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../models/RoleModel';
import StoreModel from '../../../view/store/model/StoreModel';
import TaskModel from '../../../view/task/model/TaskModel';
import TaskUtil from '../../../view/task/util/TaskUtil';
import { ActivityEventId } from '../../../view/act/enum/ActivityEventId';
import {
    Cave_taskCfg,
    Diary_rewardCfg,
    DiaryCfg,
    Foothold_dailytaskCfg,
    Foothold_ranktaskCfg,
    Foothold_titleCfg,
    General_weapon_missionCfg,
    GlobalCfg,
    Mission_achievementCfg,
    Mission_dailyCfg,
    Mission_growCfg,
    Mission_guildCfg,
    Mission_main_lineCfg,
    Mission_onlineCfg,
    Mission_weeklyCfg,
    Mission_welfare2Cfg,
    Mission_welfareCfg,
    Relic_taskCfg,
    Score_missionCfg
    } from '../../../a/config';
import { MissionType } from '../../../view/task/ctrl/TaskViewCtrl';
import { RedPointEvent } from '../../utils/RedPointUtils';
import { TaskEventId } from '../../../view/task/enum/TaskEventId';

/**
 * @Description: 任务通信器
 * @Author: weiliang.huang
 * @Date: 2019-05-27 17:35:38
 * @Last Modified by: weiliang.huang
 * @Last Modified time: 2019-06-13 18:00:17
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-13 16:39:19
 */


export default class TaskController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.MissionListRsp.MsgType, this._onMissionListRsp],
            [icmsg.MissionUpdateRsp.MsgType, this._onMissionUpdateRsp],
            [icmsg.MissionRewardRsp.MsgType, this._onMissionRewardRsp],
            // [icmsg.Mission7daysScoreAwardRsp.MsgType, this._onMission7daysScoreAwardRsp],
            [icmsg.MissionOnlineInfoRsp.MsgType, this._onOnlineInfoRsp],
            [icmsg.MissionOnlineAwardRsp.MsgType, this._onOnlineRewardRsp],

            [icmsg.MissionGrowListRsp.MsgType, this._onGrowListRsp],
            [icmsg.MissionGrowUpdateRsp.MsgType, this._updateGrowListRsp],
            [icmsg.MissionGrowTaskAwardRsp.MsgType, this._onGrowTaskRewardRsp],
            [icmsg.MissionGrowChapterAwardRsp.MsgType, this._onGrowChapterRewardRsp],

            [icmsg.MissionWeaponListRsp.MsgType, this._onWeaponListRsp],
            [icmsg.MissionWeaponUpdateRsp.MsgType, this._updateWeaponListRsp],
            [icmsg.MissionWeaponTaskAwardRsp.MsgType, this._onWeaponTaskRewardRsp],
            // [icmsg.MissionWeaponChapterAwardRsp.MsgType, this._onWeaponChapterRewardRsp],

            [icmsg.TavernInfoRsp.MsgType, this._onTavernInfoRsp],
            [icmsg.TavernTaskRefreshRsp.MsgType, this._onTavernTaskRefreshRsp],
            [icmsg.MissionWelfareListRsp.MsgType, this._onMiisionWelfareListRsp],
            [icmsg.MissionWelfareAwardRsp.MsgType, this._onMissionWelfareWardRsp],
            [icmsg.MissionWelfare2ListRsp.MsgType, this._onMissionWelfare2ListRsp],
            [icmsg.MissionWelfare2AwardRsp.MsgType, this._onMissionWelfare2AwardRsp],
            [icmsg.GuildMissionListRsp.MsgType, this._onGuildMissionListRsp],
            [icmsg.GuildMissionUpdateRsp.MsgType, this._onGuildMissionUpdateRsp],
            [icmsg.MissionDailyRoundIdRsp.MsgType, this._onMissionDailyRoundIdRsp],

            [icmsg.MissionAdventureDiaryRewardInfoRsp.MsgType, this._onMissionDiaryRewardInfoRsp],
            [icmsg.MissionAdventureDiaryRewardRsp.MsgType, this._onMissionDiaryRewardRsp],

            [icmsg.MissionComboInfoRsp.MsgType, this._onMissionComboInfoRsp],

            [icmsg.PlatformMissionListRsp.MsgType, this._onPlatformMissionListRsp],
            [icmsg.PlatformMissionTriggerRsp.MsgType, this._onPlatformMissionTriggerRsp],
            [icmsg.PlatformMissionRewardRsp.MsgType, this._onPlatformMissionRewardRsp],
        ];
    }

    model: TaskModel = null
    footholdModel: FootHoldModel = null

    onStart() {
        this.model = ModelManager.get(TaskModel)
        this.footholdModel = ModelManager.get(FootHoldModel)
    }

    onEnd() {
        this.model = null
    }

    /**
     * 任务完成度更新
     */
    _onMissionListRsp(data: icmsg.MissionListRsp) {
        let dailyDatas = {}
        let achieveDatas = {}
        let weeklyDatas = {}
        let mainLineDatas = {}
        let sevenDaysDatas = {}
        let flipCardDatas = {}
        let gradingDatas = {}
        let diaryDatas = {}
        let rewardIds = {}
        let carnivalDailyData = {}
        let carnivalUltimateData = {}
        let footholdDailyDatas = {}
        let footholdRankDatas = {}
        let relicDailyDatas = {}
        let relicWeeklyDatas = {}
        let combineDailyDatas = {}
        let combineUltimateDatas = {}
        let linkGameDatas = {}
        let caveDatas = {}
        let costumeCustomDatas = {}

        let daily = data.daily
        //日常
        if (daily) {
            for (let index = 0; index < daily.progressList.length; index++) {
                const element: icmsg.MissionProgress = daily.progressList[index];
                if (!dailyDatas[element.type]) {
                    dailyDatas[element.type] = {}
                }
                dailyDatas[element.type][element.arg] = element
            }
            this.model.daily = daily
            let rewards: number[] = daily.missionRewarded
            // rewardIds = this._checkRewards(rewards, rewardIds, 10000)
            rewardIds = this._finalCheckRewards(daily.missionIntRewarded, rewardIds);
        }
        //成就
        let achievement = data.achievement
        if (achievement) {
            for (let index = 0; index < achievement.progressList.length; index++) {
                const element: icmsg.MissionProgress = achievement.progressList[index];
                if (!achieveDatas[element.type]) {
                    achieveDatas[element.type] = {}
                }
                achieveDatas[element.type][element.arg] = element
            }
            this.model.achievement = achievement
            let rewards: number[] = achievement.missionRewarded
            // rewardIds = this._checkRewards(rewards, rewardIds, 20000)
            //特殊处理成就
            rewardIds = this._checkAchievementRewards(rewards, rewardIds, 20000)
        }

        //周常
        let weekly = data.weekly
        if (weekly) {
            for (let index = 0; index < weekly.progressList.length; index++) {
                const element: icmsg.MissionProgress = weekly.progressList[index];
                if (!weeklyDatas[element.type]) {
                    weeklyDatas[element.type] = {}
                }
                weeklyDatas[element.type][element.arg] = element
            }
            this.model.weekly = weekly
            let rewards: number[] = weekly.missionRewarded
            rewardIds = this._checkRewards(rewards, rewardIds, 50000)
        }

        //主线
        let mainLine = data.mainline
        if (mainLine) {
            for (let index = 0; index < mainLine.progressList.length; index++) {
                const element: icmsg.MissionProgress = mainLine.progressList[index];
                if (!mainLineDatas[element.type]) {
                    mainLineDatas[element.type] = {}
                }
                mainLineDatas[element.type][element.arg] = element
            }
            this.model.mainLine = mainLine
            let rewards: number[] = mainLine.missionRewarded
            rewardIds = this._checkRewards(rewards, rewardIds, 30000)
        }

        //七日狂欢
        let sevenDays = data.sevenDays
        if (sevenDays) {
            for (let index = 0; index < sevenDays.progressList.length; index++) {
                const element: icmsg.MissionProgress = sevenDays.progressList[index];
                if (!sevenDaysDatas[element.type]) {
                    sevenDaysDatas[element.type] = {}
                }
                sevenDaysDatas[element.type][element.arg] = element
            }
            this.model.sevenDays = sevenDays
            let rewards: number[] = sevenDays.missionRewarded
            rewardIds = this._checkRewards(rewards, rewardIds, 41000)
        }

        //幸运翻牌
        let flipCards = data.flipCards
        if (flipCards) {
            for (let index = 0; index < flipCards.progressList.length; index++) {
                const element: icmsg.MissionProgress = flipCards.progressList[index];
                if (!flipCardDatas[element.type]) {
                    flipCardDatas[element.type] = {}
                }
                flipCardDatas[element.type][element.arg] = element
            }
            this.model.flipCardsTask = flipCards
            let rewards: number[] = flipCards.missionRewarded
            rewardIds = this._checkRewards(rewards, rewardIds, 80000)
        }

        //评分系统
        let grading = data.grading
        if (grading) {
            for (let index = 0; index < grading.progressList.length; index++) {
                const element: icmsg.MissionProgress = grading.progressList[index];
                if (!gradingDatas[element.type]) {
                    gradingDatas[element.type] = {}
                }
                gradingDatas[element.type][element.arg] = element
            }
            this.model.grading = grading
            let rewards: number[] = grading.missionRewarded
            rewardIds = this._checkGradingRewards(rewards, rewardIds)
        }

        //冒险日记
        let diary = data.adventureDiary;
        if (diary) {
            this.model.diaryLvRewards = diary.boxOpened;
            for (let index = 0; index < diary.progressList.length; index++) {
                const element: icmsg.MissionProgress = diary.progressList[index];
                if (!diaryDatas[element.type]) {
                    diaryDatas[element.type] = {}
                }
                diaryDatas[element.type][element.arg] = element
            }
            this.model.diary = diary
            let rewards: number[] = diary.missionRewarded
            rewardIds = this._checkDiaryRewards(rewards, rewardIds)
        }

        // let carnivalDailyData = {}
        // let carnivalUltimateData = {}

        //跨服任务(每日任务)
        let carnivalDaily = data.carnivalDaily;
        if (carnivalDaily) {
            for (let index = 0; index < carnivalDaily.progressList.length; index++) {
                const element: icmsg.MissionProgress = carnivalDaily.progressList[index];
                if (!carnivalDailyData[element.type]) {
                    carnivalDailyData[element.type] = {}
                }
                carnivalDailyData[element.type][element.arg] = element
            }
            this.model.carnivalDaily = carnivalDaily
            //任务奖励记录
            let rewards: number[] = carnivalDaily.missionRewarded
            rewardIds = this._checkCarnivalDailyRewards(rewards, rewardIds)
        }

        //跨服任务(终极任务)
        let carnivalUltimate = data.carnivalUltimate;
        if (carnivalUltimate) {
            this.model.carnivalScoreRewards = carnivalUltimate.boxOpened;
            for (let index = 0; index < carnivalUltimate.progressList.length; index++) {
                const element: icmsg.MissionProgress = carnivalUltimate.progressList[index];
                if (!carnivalUltimateData[element.type]) {
                    carnivalUltimateData[element.type] = {}
                }
                carnivalUltimateData[element.type][element.arg] = element
            }
            this.model.carnivalUltimate = carnivalUltimate
            //任务奖励记录
            let rewards: number[] = carnivalUltimate.missionRewarded
            rewardIds = this._checkCarnivalUltimateRewards(rewards, rewardIds)
        }


        //据点争夺战 军衔每日任务
        let footholdDaily = data.footholdDaily
        if (footholdDaily) {
            for (let index = 0; index < footholdDaily.progressList.length; index++) {
                const element: icmsg.MissionProgress = footholdDaily.progressList[index];
                if (!footholdDailyDatas[element.type]) {
                    footholdDailyDatas[element.type] = {}
                }
                footholdDailyDatas[element.type][element.arg] = element
            }
            this.model.footholdDaily = footholdDaily
            let rewards: number[] = footholdDaily.missionRewarded
            rewardIds = this._checkFootholdDailyRewards(rewards, rewardIds)
        }

        //据点争夺战 军衔常规任务
        let footholdRank = data.footholdRank
        if (footholdRank) {
            for (let index = 0; index < footholdRank.progressList.length; index++) {
                const element: icmsg.MissionProgress = footholdRank.progressList[index];
                if (!footholdRankDatas[element.type]) {
                    footholdRankDatas[element.type] = {}
                }
                footholdRankDatas[element.type][element.arg] = element
            }
            this.model.footholdRank = footholdRank
            let rewards: number[] = footholdRank.missionRewarded
            rewardIds = this._checkFootholdRankRewards(rewards, rewardIds)
        }

        let relicDaily = data.relicDaily
        if (relicDaily) {
            for (let index = 0; index < relicDaily.progressList.length; index++) {
                const element: icmsg.MissionProgress = relicDaily.progressList[index];
                if (!relicDailyDatas[element.type]) {
                    relicDailyDatas[element.type] = {}
                }
                relicDailyDatas[element.type][element.arg] = element
            }
            this.model.relicDaily = relicDaily
            let rewards: number[] = relicDaily.missionIntRewarded
            rewardIds = this._finalCheckRewards(rewards, rewardIds)
        }

        let relicWeekly = data.relicWeekly
        if (relicWeekly) {
            for (let index = 0; index < relicWeekly.progressList.length; index++) {
                const element: icmsg.MissionProgress = relicWeekly.progressList[index];
                if (!relicWeeklyDatas[element.type]) {
                    relicWeeklyDatas[element.type] = {}
                }
                relicWeeklyDatas[element.type][element.arg] = element
            }
            this.model.relicWeekly = relicWeekly
            let rewards: number[] = relicWeekly.missionIntRewarded
            rewardIds = this._finalCheckRewards(rewards, rewardIds)
        }


        //合服狂欢 每日任务
        let combineDaily = data.mergeCarnivalDaily
        if (combineDaily) {
            for (let index = 0; index < combineDaily.progressList.length; index++) {
                const element: icmsg.MissionProgress = combineDaily.progressList[index];
                if (!combineDailyDatas[element.type]) {
                    combineDailyDatas[element.type] = {}
                }
                combineDailyDatas[element.type][element.arg] = element
            }
            this.model.combineDaily = combineDaily
            let rewards: number[] = combineDaily.missionIntRewarded
            rewardIds = this._finalCheckRewards(rewards, rewardIds)
        }

        //合服狂欢 常规任务
        let combineUltimate = data.mergeCarnivalUltimate
        if (combineUltimate) {
            for (let index = 0; index < combineUltimate.progressList.length; index++) {
                const element: icmsg.MissionProgress = combineUltimate.progressList[index];
                if (!combineUltimateDatas[element.type]) {
                    combineUltimateDatas[element.type] = {}
                }
                combineUltimateDatas[element.type][element.arg] = element
            }
            this.model.combineUltimate = combineUltimate
            let rewards: number[] = combineUltimate.missionIntRewarded
            rewardIds = this._finalCheckRewards(rewards, rewardIds)
        }

        let linkGame = data.combo
        if (linkGame) {
            for (let index = 0; index < linkGame.progressList.length; index++) {
                const element: icmsg.MissionProgress = linkGame.progressList[index];
                if (!linkGameDatas[element.type]) {
                    linkGameDatas[element.type] = {}
                }
                linkGameDatas[element.type][element.arg] = element
            }
            this.model.linkGame = linkGame
            let rewards: number[] = linkGame.missionIntRewarded
            rewardIds = this._finalCheckRewards(rewards, rewardIds)
        }

        let cave = data.caveAdventure
        if (cave) {
            for (let index = 0; index < cave.progressList.length; index++) {
                const element: icmsg.MissionProgress = cave.progressList[index];
                if (!caveDatas[element.type]) {
                    caveDatas[element.type] = {}
                }
                caveDatas[element.type][element.arg] = element
            }
            this.model.cave = cave
            let rewards: number[] = cave.missionIntRewarded
            rewardIds = this._finalCheckRewards(rewards, rewardIds)
        }

        let costumeCustom = data.costumeCustom
        if (costumeCustom) {
            for (let index = 0; index < costumeCustom.progressList.length; index++) {
                const element: icmsg.MissionProgress = costumeCustom.progressList[index];
                if (!costumeCustomDatas[element.type]) {
                    costumeCustomDatas[element.type] = {}
                }
                costumeCustomDatas[element.type][element.arg] = element
            }
            this.model.cave = costumeCustom
            let rewards: number[] = costumeCustom.missionIntRewarded
            rewardIds = this._finalCheckRewards(rewards, rewardIds)
        }


        // for (let index = 0; index < data.rewarded.length; index++) {
        //     const id = data.rewarded[index];
        //     rewardIds[id] = 1
        // }
        this.model.dailyDatas = dailyDatas
        this.model.achieveDatas = achieveDatas
        this.model.weeklyDatas = weeklyDatas
        this.model.mainLineDatas = mainLineDatas
        this.model.sevenDaysDatas = sevenDaysDatas
        this.model.flipCardsTaskDatas = flipCardDatas
        this.model.gradingDatas = gradingDatas
        this.model.diaryDatas = diaryDatas
        this.model.carnivalDailyData = carnivalDailyData
        this.model.carnivalUltimateData = carnivalUltimateData;
        this.model.footholdDailyDatas = footholdDailyDatas
        this.model.footholdRankDatas = footholdRankDatas
        this.model.relicDailyDatas = relicDailyDatas
        this.model.relicWeeklyDatas = relicWeeklyDatas
        this.model.combineDailyDatas = combineDailyDatas
        this.model.combineUltimateDatas = combineUltimateDatas
        this.model.linkGameDatas = linkGameDatas
        this.model.caveDatas = caveDatas
        this.model.costumeCustomDatas = costumeCustomDatas

        this.model.rewardIds = rewardIds

        // if (data.sevenDays) {
        //     let sevenDays = ModelManager.get(SevenDaysInfo);
        //     sevenDays.rewarded = this._checkSevenDayRewards(data.sevenDays.rewarded);
        //     sevenDays.progress = data.sevenDays.missions;
        //     sevenDays.score = data.sevenDays.score;
        //     sevenDays.scoreAwardBits = data.sevenDays.scoreAwardBits;
        //     sevenDays.startTime = data.sevenDays.startTime;
        // }

        gdk.e.emit(TaskEventId.UPDATE_TASK_AWARD_STATE)
    }

    _finalCheckRewards(intReward: number[], rewardIds) {
        let idsArray = [];
        for (let i = 0; i < intReward.length; i += 2) {
            idsArray.push([intReward[i], intReward[i + 1]]);
        }
        idsArray.forEach(ids => {
            let minId = ids[0];
            let maxId = ids[1];
            while (minId <= maxId) {
                rewardIds[minId] = 1;
                minId += 1;
            }
        });
        return rewardIds;
    }

    _checkAchievementRewards(rewards: number[], rewardIds, typeNum) {
        for (let i = 0; i < rewards.length; i++) {
            let index = rewards[i];
            for (let j = 0; j < index; j++) {
                rewardIds[typeNum + (j + 1) + (i + 1) * 100] = 1
            }
        }
        return rewardIds
    }

    _checkRewards(rewards: number[], rewardIds, typeNum) {
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    rewardIds[typeNum + (j + 1) + i * 8] = 1
                }
            }
        }
        return rewardIds
    }

    _checkDiaryRewards(rewards: number[], rewardIds) {
        let cfg = ActUtil.getCfgByActId(59);
        if (!cfg) return rewardIds;
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    let index = j + 1 + i * 8;
                    let cfg = ConfigManager.getItemByField(DiaryCfg, 'index', index);
                    if (cfg) {
                        let taskId = cfg.taskid;
                        rewardIds[taskId] = 1
                    }
                }
            }
        }
        return rewardIds
    }

    _checkCarnivalDailyRewards(rewards: number[], rewardIds) {
        let cfg = ActUtil.getCfgByActId(64);
        if (!cfg) return rewardIds;
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    let index = j + 1 + i * 8;
                    let cfg = CarnivalUtil.getDailyConfigByIndex(index);
                    if (cfg) {
                        let taskId = cfg.id;
                        rewardIds[taskId] = 1
                    }
                }
            }
        }
        return rewardIds
    }
    _checkCarnivalUltimateRewards(rewards: number[], rewardIds) {
        let cfg = ActUtil.getCfgByActId(66);
        if (!cfg) return rewardIds;
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    let index = j + 1 + i * 8;
                    let cfg = CarnivalUtil.getUltimateConfigByIndex(index);
                    if (cfg) {
                        let taskId = cfg.id;
                        rewardIds[taskId] = 1
                    }
                }
            }
        }
        return rewardIds
    }

    _checkGradingRewards(rewards: number[], rewardIds) {
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    let targetCfg = ConfigManager.getItemByField(Score_missionCfg, "index", j + i * 8)
                    if (targetCfg) {
                        rewardIds[targetCfg.id] = 1
                    }
                }
            }
        }
        return rewardIds
    }

    _checkFootholdDailyRewards(rewards: number[], rewardIds) {
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    let index = j + 1 + i * 8;
                    let cfg = ConfigManager.getItemByField(Foothold_dailytaskCfg, 'index', index);
                    if (cfg) {
                        rewardIds[cfg.id] = 1
                    }
                }
            }
        }
        return rewardIds
    }

    _checkFootholdRankRewards(rewards: number[], rewardIds) {
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    let index = j + 1 + i * 8;
                    let cfg = ConfigManager.getItemByField(Foothold_ranktaskCfg, 'index', index);
                    if (cfg) {
                        rewardIds[cfg.id] = 1
                    }
                }
            }
        }
        return rewardIds
    }

    _checkRelicRewards(rewards: number[], rewardIds) {
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    let index = j + 1 + i * 8;
                    let cfg = ConfigManager.getItemByField(Relic_taskCfg, 'id', 150000 + index);
                    if (cfg) {
                        rewardIds[cfg.id] = 1
                    }
                }
            }
        }
        return rewardIds
    }


    // _checkSevenDayRewards(rewards: number[]) {
    //     let rewardIds = []
    //     for (let i = 0; i < rewards.length; i++) {
    //         let idStr = rewards[i].toString(2)
    //         let ids = idStr.split("")
    //         ids = ids.reverse()
    //         for (let j = 0; j < ids.length; j++) {
    //             if (ids[j] == "1") {
    //                 let cfg = ConfigManager.getItemByField(Mission_7activityCfg, "index", j + 1 + i * 8)
    //                 if (cfg) {
    //                     rewardIds.push(cfg.id)
    //                     this.model.rewardIds[cfg.id] = 1
    //                 }
    //             }
    //         }
    //     }
    //     return rewardIds
    // }

    /**更新任务进度
     * 1日常，2周常，3成就，4主线，5七天, 7翻牌
    */
    _onMissionUpdateRsp(data: icmsg.MissionUpdateRsp) {
        let dailyDatas = this.model.dailyDatas
        if (data.upType == 1) {
            let daily = data.progress
            const element = daily;
            if (!dailyDatas[element.type]) {
                dailyDatas[element.type] = {}
            }
            // 日常和成就都一样,部分类型任务是有具体目标要求的
            // arg为0时就是只追求number的进度
            // 不为0的,就是有具体目标时,具体目标对应的完成情况
            dailyDatas[element.type][element.arg] = element
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 2) {
            let weeklyDatas = this.model.weeklyDatas
            let weekly = data.progress
            const element = weekly;
            if (!weeklyDatas[element.type]) {
                weeklyDatas[element.type] = {}
            }
            weeklyDatas[element.type][element.arg] = element
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 3) {
            let achievement = data.progress
            const element = achievement;
            TaskUtil.updateAchieve(element)
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 4) {
            let mainLineDatas = this.model.mainLineDatas
            let mainLine = data.progress
            const element = mainLine;
            if (!mainLineDatas[element.type]) {
                mainLineDatas[element.type] = {}
            }
            mainLineDatas[element.type][element.arg] = element
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 5) {
            // ModelManager.get(SevenDaysInfo).progress = [data.progress];
            let sevenDaysDatas = this.model.sevenDaysDatas
            let sevenDays = data.progress
            const element = sevenDays;
            if (!sevenDaysDatas[element.type]) {
                sevenDaysDatas[element.type] = {}
            }
            sevenDaysDatas[element.type][element.arg] = element
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
            gdk.e.emit(TaskEventId.UPDATE_TASK_SEVEN_DAYS_SCORE_AWARD_STATE)
        } else if (data.upType == 7) {
            let flipCardsTaskDatas = this.model.flipCardsTaskDatas;
            let flipCardsTask = data.progress;
            const element = flipCardsTask;
            if (!flipCardsTaskDatas[element.type]) {
                flipCardsTaskDatas[element.type] = {};
            }
            flipCardsTaskDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        } else if (data.upType == 8) {
            let gradingDatas = this.model.gradingDatas;
            let gradingTask = data.progress;
            const element = gradingTask;
            if (!gradingDatas[element.type]) {
                gradingDatas[element.type] = {};
            }
            gradingDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 10) {
            let diaryDtas = this.model.diaryDatas;
            let diaryTask = data.progress;
            const element = diaryTask;
            if (!diaryDtas[element.type]) {
                diaryDtas[element.type] = {};
            }
            diaryDtas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        }
        else if (data.upType == 11) {
            let carnivalDailyData = this.model.carnivalDailyData;
            let carnivalDaily = data.progress;
            const element = carnivalDaily;
            if (!carnivalDailyData[element.type]) {
                carnivalDailyData[element.type] = {};
            }
            carnivalDailyData[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        }
        else if (data.upType == 12) {
            let carnivalUltimateData = this.model.carnivalUltimateData;
            let carnivalUltimate = data.progress;
            const element = carnivalUltimate;
            if (!carnivalUltimateData[element.type]) {
                carnivalUltimateData[element.type] = {};
            }
            carnivalUltimateData[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 13) {
            let footholdDailyDatas = this.model.footholdDailyDatas;
            let task = data.progress;
            const element = task;
            if (!footholdDailyDatas[element.type]) {
                footholdDailyDatas[element.type] = {};
            }
            footholdDailyDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 14) {
            let footholdRankDatas = this.model.footholdRankDatas;
            let task = data.progress;
            const element = task;
            if (!footholdRankDatas[element.type]) {
                footholdRankDatas[element.type] = {};
            }
            footholdRankDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 15) {
            let relicDailyDatas = this.model.relicDailyDatas;
            let task = data.progress;
            const element = task;
            if (!relicDailyDatas[element.type]) {
                relicDailyDatas[element.type] = {};
            }
            relicDailyDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 16) {
            let relicWeeklyDatas = this.model.relicWeeklyDatas;
            let task = data.progress;
            const element = task;
            if (!relicWeeklyDatas[element.type]) {
                relicWeeklyDatas[element.type] = {};
            }
            relicWeeklyDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 17) {
            let combineDailyDatas = this.model.combineDailyDatas;
            let task = data.progress;
            const element = task;
            if (!combineDailyDatas[element.type]) {
                combineDailyDatas[element.type] = {};
            }
            combineDailyDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 18) {
            let combineUltimateDatas = this.model.combineUltimateDatas;
            let task = data.progress;
            const element = task;
            if (!combineUltimateDatas[element.type]) {
                combineUltimateDatas[element.type] = {};
            }
            combineUltimateDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 19) {
            let linkGameDatas = this.model.linkGameDatas;
            let task = data.progress;
            const element = task;
            if (!linkGameDatas[element.type]) {
                linkGameDatas[element.type] = {};
            }
            linkGameDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 20) {
            let caveDatas = this.model.caveDatas;
            let task = data.progress;
            const element = task;
            if (!caveDatas[element.type]) {
                caveDatas[element.type] = {};
            }
            caveDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        } else if (data.upType == 21) {
            let costumeCustomDatas = this.model.costumeCustomDatas;
            let task = data.progress;
            const element = task;
            if (!costumeCustomDatas[element.type]) {
                costumeCustomDatas[element.type] = {};
            }
            costumeCustomDatas[element.type][element.arg] = element;
            gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        }
    }

    /**领奖返回信息 */
    _onMissionRewardRsp(data: icmsg.MissionRewardRsp) {
        //任务奖励
        if (data.kind == 1) {
            this.model.rewardIds[data.id] = 1
            let cfg = null;
            if (data.type == MissionType.mainLine) {
                //cfg = ConfigManager.getItemById(Mission_mainCfg, data.id);//主线任务
                cfg = ConfigManager.getItemById(Mission_main_lineCfg, data.id);//主线任务
            } else if (data.type == MissionType.daily) {
                cfg = ConfigManager.getItemById(Mission_dailyCfg, data.id);//日常任务
            } else if (data.type == MissionType.achieve) {
                cfg = ConfigManager.getItemById(Mission_achievementCfg, data.id);//成就任务
            } else if (data.type == MissionType.weekly) {
                cfg = ConfigManager.getItemById(Mission_weeklyCfg, data.id);//周常
            } else if (data.type == MissionType.sevenDay) {
                // ModelManager.get(SevenDaysInfo).rewarded = [data.id];//7天任务
                // ModelManager.get(SevenDaysInfo).score += 1;//完成任务，点击领取，增加分数
                // cfg = ConfigManager.getItemById(Mission_7activityCfg, data.id);//7天任务
            }
            let awards: icmsg.GoodsInfo[] = []
            for (let index = 0; index < 3; index++) {
                const key = `reward${index + 1}`;
                if (cfg && cfg[key]) {
                    let award = new icmsg.GoodsInfo()
                    award.typeId = cfg[key][0]
                    award.num = cfg[key][1]
                    awards.push(award)
                }
            }

            if (data.type == MissionType.mainLine && cfg.show_target == 1) {

            } else {
                GlobalUtil.openRewadrView(awards)
                if (data.type == MissionType.mainLine) {
                    let missionId = ConfigManager.getItemById(GlobalCfg, "mission_id").value[0]
                    let isShow = (cfg as Mission_main_lineCfg).id == missionId
                    if (isShow) {
                        gdk.e.on("popup#Reward#close", this._hideRewardFunc, this);
                    }
                }
            }

            if (data.type == MissionType.carnivalDaily || data.type == MissionType.carnivalUltimate
                || data.type == MissionType.relicDaily || data.type == MissionType.relicWeekly) {
                GlobalUtil.openRewadrView(data.list)
            }

            if (data.type == MissionType.footholdDaily) {
                let cfg = ConfigManager.getItemById(Foothold_dailytaskCfg, data.id)
                let preLv = this.footholdModel.militaryRankLv
                this.footholdModel.militaryExp = this.footholdModel.militaryExp + cfg.exp
                let curLv = this.footholdModel.militaryRankLv
                if (curLv > preLv) {
                    gdk.panel.open(PanelId.MilitaryRankUpgrade)
                }
                let cfgs = ConfigManager.getItems(Foothold_titleCfg)
                if (curLv >= cfgs.length - 1) {
                    if (data.list.length > 0) {
                        GlobalUtil.openRewadrView(data.list)
                    }
                }
            }
            if (data.type == MissionType.footholdRank) {
                let cfg = ConfigManager.getItemById(Foothold_ranktaskCfg, data.id)
                let preLv = this.footholdModel.militaryRankLv
                this.footholdModel.militaryExp = this.footholdModel.militaryExp + cfg.exp
                let curLv = this.footholdModel.militaryRankLv
                if (curLv > preLv) {
                    gdk.panel.open(PanelId.MilitaryRankUpgrade)
                }
                let cfgs = ConfigManager.getItems(Foothold_titleCfg)
                if (curLv >= cfgs.length - 1) {
                    if (data.list.length > 0) {
                        GlobalUtil.openRewadrView(data.list)
                    }
                }
            }
            if (data.type == MissionType.cave) {
                let cfg = ConfigManager.getItemById(Cave_taskCfg, data.id);
                if (cfg.key > 0) {
                    ModelManager.get(ActivityModel).caveKeys += cfg.key;
                }
                if (cfg.explore > 0) {
                    ModelManager.get(ActivityModel).caveExplore += cfg.explore;
                }
                gdk.e.emit(ActivityEventId.ACTIVITY_CAVE_INFO_UPDATE);
            }
        } else {
            //积分奖励
            if (data.type == MissionType.daily) {
                this.model.daily.boxOpened += Math.pow(2, data.id)
            } else if (data.type == MissionType.weekly) {
                this.model.weekly.boxOpened += Math.pow(2, data.id)
            } else if (data.type == MissionType.grading) {
                this.model.grading.boxOpened += 1
            } else if (data.type == MissionType.diary) {
                //todo 
                let level = ConfigManager.getItemById(Diary_rewardCfg, data.id).level;
                this.model.diaryLvRewards |= 1 << level;
            } else if (data.type == MissionType.carnivalUltimate) {
                //todo 
                //let level = ConfigManager.getItemById(Diary_rewardCfg, data.id).level;
                this.model.carnivalScoreRewards |= 1 << data.id;
            } else if (data.type == MissionType.linkGame) {
                ModelManager.get(ActivityModel).linkRewardMap[data.id] = 1;
            }
            GlobalUtil.openRewadrView(data.list)
        }
        gdk.e.emit(TaskEventId.UPDATE_TASK_AWARD_STATE, data.id)
    }

    _hideRewardFunc() {
        let msg = new icmsg.StorePushListReq()
        NetManager.send(msg, (data: icmsg.StorePushListRsp) => {
            ModelManager.get(StoreModel).starGiftDatas = data.list
            gdk.panel.open(PanelId.MainLineGiftView)
        })
        gdk.e.off("popup#Reward#close", this._hideRewardFunc, this);
    }

    /**领奖返回信息 */
    _onMission7daysScoreAwardRsp(data: icmsg.Mission7daysScoreAwardRsp) {
        // this.model.sevenDayRewardIndex = data.index
        // ModelManager.get(SevenDaysInfo).scoreAwardBits |= 1 << data.index;//该index已经领奖了，更新奖励数据bits
        // GlobalUtil.openRewadrView(data.list);
    }

    /**
     * 在线奖励信息返回
     */
    _onOnlineInfoRsp(data: icmsg.MissionOnlineInfoRsp) {
        this.model.onlineInfo = data;
        gdk.e.emit(TaskEventId.UPDATE_ONLINE_INFO)
    }

    /**
     * 领取在线奖励返回
     * @param data 
     */
    _onOnlineRewardRsp(data: icmsg.MissionOnlineAwardRsp) {
        let awards: icmsg.GoodsInfo[] = [];

        for (let index = 0; index < data.list.length; index++) {
            let award = new icmsg.GoodsInfo();
            award.typeId = data.list[index].typeId;
            award.num = data.list[index].num;
            awards.push(award);
        }
        //已经领奖了，更新奖励数据bits
        if (data.id == 0) {
            let time = 0
            let cfgs: Mission_onlineCfg[] = ConfigManager.getItems(Mission_onlineCfg);
            let day = 1;
            for (let i = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i];
                if (day != cfg.days) {
                    time = 0;
                    day = cfg.days;
                }
                else {
                    time += cfg.time;
                }
                let state = TaskUtil.getOnlineRewardItemSstate(cfg.id, time);
                if (state == 1) {
                    this.model.onlineInfo.awardBits |= 1 << cfg.id - 1;
                }
            }
            NetManager.send(new icmsg.MissionOnlineInfoReq());
        } else {
            this.model.onlineInfo.awardBits |= 1 << data.id - 1;
        }

        if (awards.length > 0) {
            GlobalUtil.openRewadrView(awards);
        }
        gdk.e.emit(TaskEventId.UPDATE_ONLINE_INFO)
    }

    /**
     * 成长任务列表返回
     * @param data 
     */
    _onGrowListRsp(data: icmsg.MissionGrowListRsp) {
        //GrowDatas
        //let GrowDatas = {}
        //let tem = data.progresses;
        for (let index = 0; index < data.progresses.length; index++) {
            const element = data.progresses[index];
            TaskUtil.updateGrow(element)
            //gdk.e.emit(TaskEventId.UPDATE_ONE_TASK, element)
        }
        this.model.GrowBits = data.awardBits;
        this.model.GrowChapter = data.chapter;
        gdk.e.emit(TaskEventId.UPDATE_TASK_GROW_INFO);
    }

    /**
     * 成长任务进度更新
     * @param data 
     */
    _updateGrowListRsp(data: icmsg.MissionGrowUpdateRsp) {
        TaskUtil.updateGrow(data.progress)
        gdk.e.emit(TaskEventId.UPDATE_TASK_GROW_INFO);
    }

    /**
     * 获取成长任务章节奖励返回
     * @param data 
     */
    _onGrowChapterRewardRsp(data: icmsg.MissionGrowChapterAwardRsp) {
        this.model.GrowChapter += 1;
        this.model.GrowBits = 0;
        let awards: icmsg.GoodsInfo[] = [];
        for (let index = 0; index < data.list.length; index++) {
            let award = new icmsg.GoodsInfo();
            award.typeId = data.list[index].typeId;
            award.num = data.list[index].num;
            awards.push(award);
        }
        if (awards.length > 0) {
            GlobalUtil.openRewadrView(awards);
        } else {
            // //物品奖励为0 是技能升级 弹出窗口
            // gdk.panel.setArgs(PanelId.GrowGetSkill, this.model.GrowChapter - 1)
            // gdk.panel.open(PanelId.GrowGetSkill)

            //被动技能飞向指挥官   主动技能飞向对应的图标


        }
        gdk.e.emit(TaskEventId.UPDATE_TASK_GROW_INFO);
    }

    /**
     * 获取成长任务子任务奖励返回
     * @param data 
     */
    _onGrowTaskRewardRsp(data: icmsg.MissionGrowTaskAwardRsp) {

        let awards: icmsg.GoodsInfo[] = [];
        for (let index = 0; index < data.list.length; index++) {
            let award = new icmsg.GoodsInfo();
            award.typeId = data.list[index].typeId;
            award.num = data.list[index].num;
            awards.push(award);
        }
        //获取当前任务在章节中的位置
        let cfgs: Mission_growCfg[] = ConfigManager.getItems(Mission_growCfg, { chapter: this.model.GrowChapter });
        if (cfgs.length == 0) {
            return;
        }
        let pos: number = 0;
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].id == data.id) {
                pos = i;
                break;
            }
        }
        this.model.GrowBits |= 1 << pos;
        // if (awards.length > 0) {
        //     //GlobalUtil.openRewadrView(awards);
        //     let item = ConfigManager.getItemById(ItemCfg, awards[0].typeId)
        //     if (item) {
        //         let str = "获得物品：" + item.name + 'x' + awards[0].num
        //         gdk.gui.showMessage(str);
        //     }
        // }
        gdk.e.emit(TaskEventId.UPDATE_TASK_GROW_INFO, data);
    }

    /**
     * 神器任务列表返回
     * @param data 
     */
    _onWeaponListRsp(data: icmsg.MissionWeaponListRsp) {
        for (let index = 0; index < data.progress.length; index++) {
            const element = data.progress[index];
            TaskUtil.updateWeapon(element)
        }
        this.model.weaponBits = data.awardBits;
        this.model.weaponChapter = data.chapter;
        gdk.e.emit(TaskEventId.UPDATE_TASK_WEAPON_INFO);
    }

    /**
     * 神器任务进度更新
     * @param data 
     */
    _updateWeaponListRsp(data: icmsg.MissionWeaponUpdateRsp) {
        TaskUtil.updateWeapon(data.progress)
        gdk.e.emit(TaskEventId.UPDATE_TASK_WEAPON_INFO);
    }

    // /**
    //  * 获取神器任务章节奖励返回
    //  * @param data 
    //  */
    // _onWeaponChapterRewardRsp(data: MissionWeaponChapterAwardRsp) {
    //     this.model.weaponChapter += 1;
    //     this.model.weaponBits = 0;
    //     gdk.e.emit(TaskEventId.UPDATE_TASK_WEAPON_INFO);
    // }

    /**
     * 获取神器任务子任务奖励返回
     * @param data 
     */
    _onWeaponTaskRewardRsp(data: icmsg.MissionWeaponTaskAwardRsp) {
        //获取当前任务在章节中的位置
        let cfgs: General_weapon_missionCfg[] = ConfigManager.getItems(General_weapon_missionCfg, { chapter: this.model.weaponChapter });
        if (cfgs.length == 0) {
            return;
        }
        let pos: number = -1;
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].id == data.id) {
                pos = i;
                break;
            }
        }
        if (pos >= 0) {
            this.model.weaponBits |= 1 << pos;
            gdk.e.emit(TaskEventId.UPDATE_TASK_WEAPON_INFO, data);
        }
    }

    /**
     * 酒馆信息返回
     * @param resp 
     */
    _onTavernInfoRsp(resp: icmsg.TavernInfoRsp) {
        this.model.tavernDoingTaskList = resp.doingTasks;
        this.model.tavernTodoTaskList = resp.todoTasks;
        this.model.tavernRefreshTimes = resp.refreshTimes;
        this.model.tavernExtraFlag = resp.extraFlag;
        this.model.tavernExtraTask1 = resp.extraTask1 || null;
        this.model.tavernExtraTask2 = resp.extraTask2 || null;
        gdk.e.emit(TaskEventId.UPDATE_TAVERN_TASK);
    }

    /**
     * 酒馆任务刷新返回
     * @param resp 
     */
    _onTavernTaskRefreshRsp(resp: icmsg.TavernTaskRefreshRsp) {
        this.model.tavernTodoTaskList = resp.todoTasks;
        gdk.e.emit(TaskEventId.UPDATE_TAVERN_TASK);
    }

    /**
     * 开服福利任务120抽 奖励位图数组返回
     * @param resp 
     */
    _onMiisionWelfareListRsp(resp: icmsg.MissionWelfareListRsp) {
        this.model.welfareReward = resp.rewarded;
        let cfgs = ConfigManager.getItems(Mission_welfareCfg);
        cfgs.forEach(cfg => {
            if (TaskUtil.getWelfareTaskState(cfg.id)) this.model.rewardIds[cfg.id] = 1;
        });
    }

    /**
     * 开服福利任务120抽 奖励领取返回
     * @param resp 
     */
    _onMissionWelfareWardRsp(resp: icmsg.MissionWelfareAwardRsp) {
        this.model.rewardIds[resp.id] = 1;
        TaskUtil.updateWelfareReward(resp.id);
    }

    /**
     * 开服福利任务二期 奖励位图数组返回
     * @param resp 
     */
    _onMissionWelfare2ListRsp(resp: icmsg.MissionWelfare2ListRsp) {
        ModelManager.get(RoleModel).loginDays = resp.loginDays;
        ModelManager.get(StoreModel).isBuyWelfare2 = resp.bought;
        this.model.welfareReward2 = resp.rewarded;
        let cfgs = ConfigManager.getItems(Mission_welfare2Cfg);
        cfgs.forEach(cfg => {
            if (TaskUtil.getWelfare2TaskState(cfg.id)) this.model.rewardIds[cfg.id] = 1;
        });
    }

    /**
     * 开服福利任务二期 奖励领取返回
     * @param resp 
     */
    _onMissionWelfare2AwardRsp(resp: icmsg.MissionWelfare2AwardRsp) {
        this.model.rewardIds[resp.id] = 1;
        TaskUtil.updateWelfare2Reward(resp.id);
    }

    /**公会任务列表信息*/
    _onGuildMissionListRsp(data: icmsg.GuildMissionListRsp) {
        let guildDatas = {}
        for (let index = 0; index < data.progressList.length; index++) {
            const element: icmsg.MissionProgress = data.progressList[index];
            if (!guildDatas[element.type]) {
                guildDatas[element.type] = {}
            }
            guildDatas[element.type][element.arg] = element
        }
        this.model.guildDatas = guildDatas
        let cfgs = ConfigManager.getItems(Mission_guildCfg)
        for (let n = 0; n < data.missionRewarded.length; n++) {
            for (let i = 0; i < cfgs.length; i++) {
                if (Math.pow(2, cfgs[i].id - 1) & data.missionRewarded[n]) {
                    this.model.guildRewardIds[cfgs[i].id] = 1
                }
            }
        }
        gdk.e.emit(TaskEventId.UPDATE_GUILD_TASK)
    }

    /**公会任务更新 */
    _onGuildMissionUpdateRsp(data: icmsg.GuildMissionUpdateRsp) {
        let guildDatas = this.model.guildDatas
        const element = data.progress;
        if (!guildDatas[element.type]) {
            guildDatas[element.type] = {}
        }
        // 日常和成就都一样,部分类型任务是有具体目标要求的
        // arg为0时就是只追求number的进度
        // 不为0的,就是有具体目标时,具体目标对应的完成情况
        guildDatas[element.type][element.arg] = element
        gdk.e.emit(TaskEventId.UPDATE_GUILD_TASK)
    }

    _onMissionDailyRoundIdRsp(data: icmsg.MissionDailyRoundIdRsp) {
        this.model.dailyRoundId = data.roundId
    }

    /**冒险日记额外奖励信息 */
    _onMissionDiaryRewardInfoRsp(resp: icmsg.MissionAdventureDiaryRewardInfoRsp) {
        this.model.diaryExtraRewards = resp.boxOpened;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**冒险日记额外奖励领取返回 */
    _onMissionDiaryRewardRsp(resp: icmsg.MissionAdventureDiaryRewardRsp) {
        this.model.diaryExtraRewards = resp.boxOpened;
    }

    /**幸运连连看 */
    _onMissionComboInfoRsp(resp: icmsg.MissionComboInfoRsp) {
        let m = ModelManager.get(ActivityModel);
        m.linkGameRound = resp.round;
        m.linkRewardMap = this._finalCheckRewards(resp.gainLine, m.linkRewardMap);
    }

    /**平台任务 */
    _onPlatformMissionListRsp(resp: icmsg.PlatformMissionListRsp) {
        let m = ModelManager.get(ActivityModel);
        m.platformTask = resp.list;
        m.platformIconUpdateWatch = !m.platformIconUpdateWatch;
        // // 非小程序时自动触发的任务
        // if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        //     m.platformTask.forEach(t => {
        //         let cfg = ConfigManager.getItemById(Platform_activityCfg, t.missionId);
        //         if (cfg && cfg.type == 1 && !t.rewarded && !t.number) {
        //             let req = new icmsg.PlatformMissionTriggerReq();
        //             req.missionType = cfg.type;
        //             NetManager.send(req);
        //         }
        //     });
        // }
    }
    _onPlatformMissionTriggerRsp(resp: icmsg.PlatformMissionTriggerRsp) {
        let m = ModelManager.get(ActivityModel);
        for (let i = 0, n = resp.missions.length; i < n; i++) {
            let mission = resp.missions[i];
            let b = m.platformTask.some((task, idx) => {
                if (task.missionId == mission.missionId) {
                    m.platformTask[idx] = mission;
                    return true;
                }
                return false;
            });
            if (!b) {
                m.platformTask.push(mission);
            }
        }
        m.platformIconUpdateWatch = !m.platformIconUpdateWatch;
    }
    _onPlatformMissionRewardRsp(resp: icmsg.PlatformMissionRewardRsp) {
        let m = ModelManager.get(ActivityModel);
        let b = m.platformTask.some((task, idx) => {
            if (task.missionId == resp.mission.missionId) {
                m.platformTask[idx] = resp.mission;
                return true;
            }
            return false;
        });
        if (!b) {
            m.platformTask.push(resp.mission);
        }
        GlobalUtil.openRewadrView(resp.rewards);
        m.platformIconUpdateWatch = !m.platformIconUpdateWatch;
    }
}