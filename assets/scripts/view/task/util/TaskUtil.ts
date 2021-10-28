import ArenaModel from '../../../common/models/ArenaModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import ServerModel from '../../../common/models/ServerModel';
import TaskModel from '../model/TaskModel';
import {
    Carnival_dailyCfg,
    Carnival_ultimateCfg,
    Cave_taskCfg,
    Combine_dailyCfg,
    Combine_ultimateCfg,
    ComboCfg,
    Costume_missionCfg,
    DiaryCfg,
    Foothold_dailytaskCfg,
    Foothold_ranktaskCfg,
    General_weapon_missionCfg,
    GlobalCfg,
    Mission_7activityCfg,
    Mission_7scoreCfg,
    Mission_achievementCfg,
    Mission_cardsCfg,
    Mission_dailyCfg,
    Mission_growCfg,
    Mission_guildCfg,
    Mission_main_lineCfg,
    Mission_onlineCfg,
    Mission_weeklyCfg,
    Mission_welfare2Cfg,
    Mission_welfareCfg,
    Relic_taskCfg,
    Score_missionCfg,
    ScoreCfg
    } from '../../../a/config';
import { MissionType } from '../ctrl/TaskViewCtrl';

/**
 * @Description: 任务工具
 * @Author: weiliang.huang
 * @Date: 2019-03-25 20:41:11
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-06 09:51:14
 */

export default class TaskUtil {

    static AchieveConfig = null
    static MainLineConfig = null
    static GradingConfig = null
    static FootholdRankTaskConfig = null
    static CombineUltimateCfg = null

    /**初始化成就任务表
     * 根据subject字段分别存储
     */
    static initTaskConfig() {
        if (this.AchieveConfig) {
            return
        }
        let config = {}
        let items = ConfigManager.getItems(Mission_achievementCfg)
        for (let index = 0; index < items.length; index++) {
            let cfg = items[index];
            let subject = cfg.subject
            if (!subject) {
                continue
            }
            if (!config[subject]) {
                config[subject] = []
            }
            let arr: Mission_achievementCfg[] = config[subject]
            let len = arr.length
            if (len == 0) {
                arr.push(cfg)
            } else {
                for (let index = 0; index < len; index++) {
                    let ele = arr[index];
                    if (cfg.id < ele.id) {
                        arr.splice(index, 0, cfg)
                        break
                    }
                    if (index == len - 1) {
                        arr.push(cfg)
                        break
                    }
                }
            }
        }
        this.AchieveConfig = config
    }


    static initMainLineConfig() {
        if (this.MainLineConfig) {
            return
        }
        let config = {}
        let items = ConfigManager.getItems(Mission_main_lineCfg)
        for (let index = 0; index < items.length; index++) {
            let cfg = items[index];
            let subject = cfg.subject
            if (!subject) {
                continue
            }
            if (!config[subject]) {
                config[subject] = []
            }
            let arr: Mission_main_lineCfg[] = config[subject]
            let len = arr.length
            if (len == 0) {
                arr.push(cfg)
            } else {
                for (let index = 0; index < len; index++) {
                    let ele = arr[index];
                    if (cfg.id < ele.id) {
                        arr.splice(index, 0, cfg)
                        break
                    }
                    if (index == len - 1) {
                        arr.push(cfg)
                        break
                    }
                }
            }
        }
        this.MainLineConfig = config
    }


    static initGradingConfig() {
        if (this.GradingConfig) {
            return
        }
        let config = {}
        let items = ConfigManager.getItems(Score_missionCfg)
        for (let index = 0; index < items.length; index++) {
            let cfg = items[index];
            let subject = cfg.node
            if (!config[subject]) {
                config[subject] = []
            }

            if (!config[subject][cfg.type]) {
                config[subject][cfg.type] = []
            }

            let arr: Score_missionCfg[] = config[subject][cfg.type]
            let len = arr.length
            if (len == 0) {
                arr.push(cfg)
            } else {
                for (let index = 0; index < len; index++) {
                    let ele = arr[index];
                    if (cfg.id < ele.id) {
                        arr.splice(index, 0, cfg)
                        break
                    }
                    if (index == len - 1) {
                        arr.push(cfg)
                        break
                    }
                }
            }
        }
        this.GradingConfig = config
    }

    /**据点争夺战 军衔常规任务 */
    static initFootholdRankTaskConfig() {
        if (this.FootholdRankTaskConfig) {
            return
        }
        let config = {}
        let items = ConfigManager.getItems(Foothold_ranktaskCfg)
        for (let index = 0; index < items.length; index++) {
            let cfg = items[index];
            let subject = cfg.theme
            if (!config[subject]) {
                config[subject] = []
            }
            let arr: Foothold_ranktaskCfg[] = config[subject]
            let len = arr.length
            if (len == 0) {
                arr.push(cfg)
            } else {
                for (let index = 0; index < len; index++) {
                    let ele = arr[index];
                    if (cfg.id < ele.id) {
                        arr.splice(index, 0, cfg)
                        break
                    }
                    if (index == len - 1) {
                        arr.push(cfg)
                        break
                    }
                }
            }
        }
        this.FootholdRankTaskConfig = config
    }

    /**合服狂欢 任务配置 */
    static initCombineUltimateConfig() {
        if (this.CombineUltimateCfg) {
            return
        }
        let config = {}
        let combineCount = ModelManager.get(RoleModel).serverMegCount
        let items = ConfigManager.getItems(Combine_ultimateCfg, { type: combineCount })
        if (items.length == 0) {
            items = ConfigManager.getItems(Combine_ultimateCfg, { type: 1 })
        }
        for (let index = 0; index < items.length; index++) {
            let cfg = items[index];
            let subject = cfg.theme
            if (!config[subject]) {
                config[subject] = []
            }
            let arr: Combine_ultimateCfg[] = config[subject]
            let len = arr.length
            if (len == 0) {
                arr.push(cfg)
            } else {
                for (let index = 0; index < len; index++) {
                    let ele = arr[index];
                    if (cfg.id < ele.id) {
                        arr.splice(index, 0, cfg)
                        break
                    }
                    if (index == len - 1) {
                        arr.push(cfg)
                        break
                    }
                }
            }
        }
        this.CombineUltimateCfg = config
    }


    /**根据获取任务列表
     * @param utype
     * 
     * 0:日常 1:周常 2:主线 3:成就 4:7天任务
     */
    static getTaskList(utype): any[] {
        this.initTaskConfig()
        this.initMainLineConfig()
        let model = ModelManager.get(TaskModel);
        let roleModel = ModelManager.get(RoleModel);
        let list = []
        let rewards = model.rewardIds
        if (utype == 0) {
            let tempList = ConfigManager.getItems(Mission_dailyCfg)
            tempList.forEach(element => {
                list.push(element)
                // if (parseInt(element.level) <= roleModel.level) {
                //     list.push(element)
                // }
            });
        } else if (utype == 1) {
            let tempList = ConfigManager.getItems(Mission_weeklyCfg)
            tempList.forEach(element => {
                list.push(element)
                // if (parseInt(element.level) <= roleModel.level) {
                //     list.push(element)
                // }
            });
        } else if (utype == 2) {
            for (const key in this.MainLineConfig) {
                const cfgs: Mission_main_lineCfg[] = this.MainLineConfig[key];
                let len = cfgs.length
                for (let index = 0; index < len; index++) {
                    const element = cfgs[index];
                    // 是否已完成
                    let state = this.getTaskState(element.id)
                    let geted = rewards[element.id] || 0
                    // 若没完成 或者没领奖,或者已经是最后一项,则添加进表中
                    if (index == len - 1 || !state || geted == 0) {
                        list.push(element)
                        break
                    }
                }
            }
        } else if (utype == 3) {
            for (const key in this.AchieveConfig) {
                const cfgs: Mission_achievementCfg[] = this.AchieveConfig[key];
                let len = cfgs.length
                for (let index = 0; index < len; index++) {
                    const element = cfgs[index];
                    // 是否已完成
                    let state = this.getTaskState(element.id)
                    let geted = rewards[element.id] || 0
                    // 若没完成 或者没领奖,或者已经是最后一项,则添加进表中
                    if (index == len - 1 || !state || geted == 0) {
                        list.push(element)
                        break
                    }
                }
            }
        } else if (utype == 4) {
            let tempList = ConfigManager.getItems(Mission_7activityCfg)
            let cfg = ConfigManager.getItemById(GlobalCfg, "7d_activity_args").value;
            if (roleModel.level >= cfg[1]) {
                let sec = Math.floor(GlobalUtil.getServerTime() / 1000);
                let overSec = sec - GlobalUtil.getServerOpenTime();
                let startDays = Math.ceil(overSec / 86400);
                for (let index = 0; index < tempList.length; index++) {
                    if (tempList[index].day <= startDays) {
                        list.push(tempList[index]);
                    }
                }
            }
        }
        return list
    }

    /**判断某个任务是否已完成 */
    static getTaskState(id: number, sheetType?: TaskSheetType) {
        let model = ModelManager.get(TaskModel)
        let dailyDatas = model.dailyDatas
        let achieveDatas = model.achieveDatas
        let weeklyDatas = model.weeklyDatas
        let mainLineDatas = model.mainLineDatas
        let sevenDaysDatas = model.sevenDaysDatas
        let flipCardsDatas = model.flipCardsTaskDatas
        let gradingDatas = model.gradingDatas
        let diaryDatas = model.diaryDatas
        let footholdDailyDatas = model.footholdDailyDatas
        let footholdRankDatas = model.footholdRankDatas
        // let relicDatas = model.relicDatas
        let relicDailyDatas = model.relicDailyDatas
        let relicWeeklyDatas = model.relicWeeklyDatas
        let combineDailyDatas = model.combineDailyDatas
        let combineUltimateDatas = model.combineUltimateDatas
        let linkGameDatas = model.linkGameDatas
        let caveDatas = model.caveDatas
        let costumeCustomDatas = model.costumeCustomDatas

        let type = Math.floor(id / 10000)
        let state = false

        if (type == 1) {
            if (!TaskUtil.getDailyTaskIsOpen(id)) {
                return false
            }
            //日常
            let cfg = ConfigManager.getItemById(Mission_dailyCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!dailyDatas[cfg.target] && dailyDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = dailyDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        } else if (type == 2) {
            if (!TaskUtil.getAchieveTaskIsOpen(id)) {
                return false
            }
            //成就
            let cfg = ConfigManager.getItemById(Mission_achievementCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args
            if (!!achieveDatas[cfg.target]) {
                if (args && typeof (args) == "object") {
                    // args为数组时,遍历查找是否满足开启条件
                    for (let index = 0; index < args.length; index++) {
                        const arg = args[index];
                        let item: icmsg.MissionProgress = achieveDatas[cfg.target][arg]
                        if (!item || item.num < cfg.number) {
                            break
                        }
                        if (item && item.num >= cfg.number) {
                            return true
                        }
                    }
                } else {
                    if (!args) { args = 0 }
                    let item: icmsg.MissionProgress = achieveDatas[cfg.target][args]
                    if (item && item.num >= cfg.number) {
                        return true
                    }
                }
            }
        } else if (type == 3) {
            if (!TaskUtil.getMainLineTaskIsOpen(id)) {
                return false
            }
            //主线
            let cfg = ConfigManager.getItemById(Mission_main_lineCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args: any = cfg.args
            if (!!mainLineDatas[cfg.target]) {
                if (args && typeof (args) == "object") {
                    // args为数组时,遍历查找是否满足开启条件
                    for (let index = 0; index < args.length; index++) {
                        const arg = args[index];
                        let item: icmsg.MissionProgress = mainLineDatas[cfg.target][arg]
                        if (!item || item.num < cfg.number) {
                            break
                        }
                        if (item && item.num >= cfg.number) {
                            return true
                        }
                    }
                } else {
                    if (!args) { args = 0 }
                    let item: icmsg.MissionProgress = mainLineDatas[cfg.target][args]
                    if (item && item.num >= cfg.number) {
                        return true
                    }
                }
            }
        }
        else if (type == 4) {
            //七日狂欢
            let cfg = ConfigManager.getItemById(Mission_7activityCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!sevenDaysDatas[cfg.target] && sevenDaysDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = sevenDaysDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == 5) {
            if (!TaskUtil.getWeeklyTaskIsOpen(id)) {
                return false
            }
            //周常
            let cfg = ConfigManager.getItemById(Mission_weeklyCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!weeklyDatas[cfg.target] && weeklyDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = weeklyDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == 8) {
            //幸运翻牌
            let cfg = ConfigManager.getItemById(Mission_cardsCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!flipCardsDatas[cfg.target] && flipCardsDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = flipCardsDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == 9) {
            //评分系统
            let cfg = ConfigManager.getItemByField(Score_missionCfg, "id", id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!gradingDatas[cfg.target] && gradingDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = gradingDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == 10) {
            //冒险日记
            let cfg = ConfigManager.getItemById(DiaryCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!diaryDatas[cfg.target] && diaryDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = diaryDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == 11) {
            //跨服任务(每日任务)
            let cfg = ConfigManager.getItemById(DiaryCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!diaryDatas[cfg.target] && diaryDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = diaryDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == 12) {
            //跨服任务(终极任务)
            let cfg = ConfigManager.getItemById(DiaryCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!diaryDatas[cfg.target] && diaryDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = diaryDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == 13) {
            let cfg = ConfigManager.getItemById(Foothold_dailytaskCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!footholdDailyDatas[cfg.target] && footholdDailyDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = footholdDailyDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == 14) {
            let cfg = ConfigManager.getItemById(Foothold_ranktaskCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!footholdRankDatas[cfg.target] && footholdRankDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = footholdRankDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == 15) {
            let cfg = ConfigManager.getItemById(Relic_taskCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (cfg.type == 1) {
                if (!!relicDailyDatas[cfg.target] && relicDailyDatas[cfg.target][args]) {
                    let item: icmsg.MissionProgress = relicDailyDatas[cfg.target][args]
                    if (item && item.num >= cfg.number) {
                        return true
                    }
                }
            } else if (cfg.type == 2) {
                if (!!relicWeeklyDatas[cfg.target] && relicWeeklyDatas[cfg.target][args]) {
                    let item: icmsg.MissionProgress = relicWeeklyDatas[cfg.target][args]
                    if (item && item.num >= cfg.number) {
                        return true
                    }
                }
            }
        }

        else if (type == MissionType.combineDaily) {
            let cfg = ConfigManager.getItemById(Combine_dailyCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!combineDailyDatas[cfg.target] && combineDailyDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = combineDailyDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == MissionType.combineUltimate) {
            let cfg = ConfigManager.getItemById(Combine_ultimateCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!combineUltimateDatas[cfg.target] && combineUltimateDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = combineUltimateDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == MissionType.linkGame) {
            let cfg = ConfigManager.getItemById(ComboCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!linkGameDatas[cfg.target] && linkGameDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = linkGameDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == MissionType.cave) {
            let cfg = ConfigManager.getItemById(Cave_taskCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!caveDatas[cfg.target] && caveDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = caveDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }
        else if (type == MissionType.costumeCustom) {
            let cfg = ConfigManager.getItemById(Costume_missionCfg, id)
            if (cfg.target == 0) {
                return true;
            }
            let args = cfg.args || 0
            if (!args) { args = 0 }
            if (!!costumeCustomDatas[cfg.target] && costumeCustomDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = costumeCustomDatas[cfg.target][args]
                if (item && item.num >= cfg.number) {
                    return true
                }
            }
        }

        if (sheetType) {
            // if (sheetType == TaskSheetType.main) {
            //     let cfg = ConfigManager.getItemById(Mission_main_lineCfg, id);
            //     if (ModelManager.get(CopyModel).lastCompleteStageId >= cfg.args) return true;
            // }
            // else 
            if (sheetType == TaskSheetType.grow) {
                // 生存秘籍单独处理, 因为配置表的id字段未按照前四张表的形式统一定义
                let model = TaskModel.get()
                let growDatas = model.GrowDatas
                let args = 0;
                let cfg = ConfigManager.getItemByField(Mission_growCfg, 'id', id);
                if (cc.js.isNumber(cfg.args) && cfg.args > 0) {
                    args = cfg.args
                }
                if (growDatas[cfg.target] && growDatas[cfg.target][args]) {
                    if (growDatas[cfg.target][args].num >= cfg.number) {
                        state = true;
                    }
                }
            }
            else if (sheetType == TaskSheetType.welfare) {
                //开服福利120抽
                let cfg = ConfigManager.getItemById(Mission_welfareCfg, id);
                if (ModelManager.get(CopyModel).lastCompleteStageId >= cfg.args) state = true;
            }
        }
        return state
    }

    static getGuildTaskState(id: number) {
        let model = ModelManager.get(TaskModel)
        let guildDatas = model.guildDatas
        let cfg = ConfigManager.getItemById(Mission_guildCfg, id)
        if (cfg.target == 0) {
            return true;
        }

        if (cfg.hidden) {
            return false
        }

        let args = cfg.args
        if (!args) { args = 0 }
        if (!!guildDatas[cfg.target] && guildDatas[cfg.target][args]) {
            let item: icmsg.MissionProgress = guildDatas[cfg.target][args]
            if (item && item.num >= cfg.number) {
                return true
            }
        }
        return false
    }

    static getGuildTaskFinishNum(id) {
        let model = ModelManager.get(TaskModel)
        let cfg = ConfigManager.getItemById(Mission_guildCfg, id)
        let guildDatas = model.guildDatas
        let maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
        let args = cfg.args
        let finishNum = 0
        if (cfg.target == 108) {
            maxNum = cfg.args * 10000;
            finishNum = ModelManager.get(RoleModel).power;
        } else {
            if (!args) { args = 0 }
            if (!!guildDatas[cfg.target] && guildDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = guildDatas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        }
        if (cfg.target == 119) {
            //充值类任务,多语言需转换货币单位
            finishNum = SdkTool.tool.getRealRMBCost(finishNum);
            maxNum = SdkTool.tool.getRealRMBCost(maxNum);
        }
        return [finishNum, maxNum]
    }

    /**
     * 获取日常任务是否开启
     * @param id 
     */
    static getDailyTaskIsOpen(id: number): boolean {
        let type = Math.floor(id / 10000);
        if (type != 1) return true; // 非日常任务
        let cfg = ConfigManager.getItemById(Mission_dailyCfg, id);
        let level = parseInt(cfg.level);
        let fbId = cfg.fbId;
        let roleMode = ModelManager.get(RoleModel);
        let copyMode = ModelManager.get(CopyModel);
        let b = true;
        if (level) {
            b = roleMode.level >= level;
        }
        if (fbId) {
            b = b && copyMode.lastCompleteStageId >= fbId;
        }
        return b;
    }


    /**
    * 获取周常任务是否开启
    * @param id 
    */
    static getWeeklyTaskIsOpen(id: number): boolean {
        let type = Math.floor(id / 50000);
        if (type != 1) return true; // 非日常任务
        let cfg = ConfigManager.getItemById(Mission_weeklyCfg, id);
        let level = parseInt(cfg.level);
        let fbId = cfg.fbId;
        let roleMode = ModelManager.get(RoleModel);
        let copyMode = ModelManager.get(CopyModel);
        let b = true;
        if (level) {
            b = roleMode.level >= level;
        }
        if (fbId) {
            b = b && copyMode.lastCompleteStageId >= fbId;
        }
        return b;
    }

    /**
   * 获取成就任务是否开启
   * @param id 
   */
    static getAchieveTaskIsOpen(id: number): boolean {
        let type = Math.floor(id / 20000);
        if (type != 1) return true; // 
        let cfg = ConfigManager.getItemById(Mission_achievementCfg, id);
        let fbId = cfg.fbId;
        let roleMode = ModelManager.get(RoleModel);
        let copyMode = ModelManager.get(CopyModel);
        let b = true;
        let level = parseInt(cfg.level);
        if (level) {
            b = roleMode.level >= level;
        }
        if (fbId) {
            b = b && copyMode.lastCompleteStageId >= fbId;
        }
        return b;
    }

    /**
    * 获取主线任务是否开启
    * @param id 
    */
    static getMainLineTaskIsOpen(id: number): boolean {
        let type = Math.floor(id / 30000);
        if (type != 1) return true;
        let cfg = ConfigManager.getItemById(Mission_main_lineCfg, id);
        let fbId = cfg.fbId;
        let copyMode = ModelManager.get(CopyModel);
        let b = true;
        if (fbId) {
            b = copyMode.lastCompleteStageId >= fbId;
        }
        return b;
    }

    /**
    * 获取合服狂欢日常任务是否开启
    * @param id 
    */
    static getCombineDailyTaskIsOpen(id: number): boolean {
        let type = Math.floor(id / 170000);
        if (type != 1) return true;
        let cfg = ConfigManager.getItemById(Combine_dailyCfg, id);
        let fbId = cfg.fbId || 0;
        let roleMode = ModelManager.get(RoleModel);
        let copyMode = ModelManager.get(CopyModel);
        let b = true;
        let level = cfg.level;
        if (level) {
            b = roleMode.level >= level;
        }
        if (fbId) {
            b = b && copyMode.lastCompleteStageId >= fbId;
        }
        return b;
    }

    /**
        * 获取合服狂欢常规任务是否开启
        * @param id 
        */
    static getCombineUltimateTaskIsOpen(id: number): boolean {
        let type = Math.floor(id / 180000);
        if (type != 1) return true;
        let cfg = ConfigManager.getItemById(Combine_ultimateCfg, id);
        let fbId = cfg.fbId || 0;
        let roleMode = ModelManager.get(RoleModel);
        let copyMode = ModelManager.get(CopyModel);
        let b = true;
        let level = cfg.level || 0;
        if (level) {
            b = roleMode.level >= level;
        }
        if (fbId) {
            b = b && copyMode.lastCompleteStageId >= fbId;
        }
        return b;
    }


    /**获取任务完成进度 */
    static getTaskFinishNum(id: number): number[] {
        let model = ModelManager.get(TaskModel)
        let dailyDatas = model.dailyDatas
        let achieveDatas = model.achieveDatas
        let weeklyDatas = model.weeklyDatas
        let mainLineDatas = model.mainLineDatas
        let sevenDaysDatas = model.sevenDaysDatas
        let gradingDatas = model.gradingDatas
        let diaryDatas = model.diaryDatas
        let carnivalDailyData = model.carnivalDailyData
        let carnivalUltimateData = model.carnivalUltimateData
        let footholdDailyDatas = model.footholdDailyDatas
        let footholdRankDatas = model.footholdRankDatas
        let relicDailyDatas = model.relicDailyDatas
        let relicWeeklyDatas = model.relicWeeklyDatas
        let combineDailyDatas = model.combineDailyDatas
        let combineUltimateDatas = model.combineUltimateDatas
        let linkGameDatas = model.linkGameDatas
        let caveDatas = model.caveDatas
        let costumeCustomDatas = model.costumeCustomDatas
        let finishNum = 0
        let maxNum = 0
        let target;
        let type = Math.floor(id / 10000)
        if (type == 1) {
            // 日常任务类型
            let cfg = ConfigManager.getItemById(Mission_dailyCfg, id)
            target = cfg.target;
            if (cfg.target == 108) {
                maxNum = cfg.args * 10000;
                finishNum = ModelManager.get(RoleModel).power;
            }
            else {
                maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
                let args = cfg.args
                if (!args) { args = 0 }
                if (!!dailyDatas[cfg.target] && dailyDatas[cfg.target][args]) {
                    let item: icmsg.MissionProgress = dailyDatas[cfg.target][args]
                    if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                        finishNum = item.num >= cfg.number ? 1 : 0;
                    }
                    else {
                        finishNum = item.num
                    }
                }
            }
        } else if (type == 2) {
            //成就
            let cfg = ConfigManager.getItemById(Mission_achievementCfg, id)
            target = cfg.target;
            // 默认情况下,以number为目标进度值
            maxNum = cfg.number ? ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number) : 1
            let args = cfg.args
            if (cfg.target == 603) {
                // 竞技场排名特殊处理,目标进度值为目标排名
                // 当前进度值要读取玩家的竞技场排名
                maxNum = cfg.args[0]
                let roleModel = ModelManager.get(RoleModel)
                let model = ModelManager.get(ArenaModel);
                let list = model.list
                for (let i = 0; i < list.length; i++) {
                    if (list[i].brief.id.toLocaleString() == roleModel.id.toLocaleString()) {
                        finishNum = i + 1
                        break
                    }
                }
            } else if (cfg.target == 108) {
                maxNum = cfg.args * 10000;
                finishNum = ModelManager.get(RoleModel).power;
            } else {
                if (args && typeof (args) == "object") {
                    if (args.length > 1) {
                        // args大于1时,目标数量以args长度为准
                        maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : args.length
                    }
                    if (achieveDatas[cfg.target]) {
                        // args为数组时,遍历查找是否满足开启条件----------(args为数组时,只会有1个元素)
                        const arg = args[0];
                        let item: icmsg.MissionProgress = achieveDatas[cfg.target][arg]
                        if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                            finishNum = item.num >= cfg.number ? 1 : 0;
                        }
                        else {
                            finishNum = item.num
                        }
                    }
                } else {
                    if (!args) { args = 0 }
                    if (achieveDatas[cfg.target]) {
                        let item: icmsg.MissionProgress = achieveDatas[cfg.target][args]
                        if (item) {
                            if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                                finishNum = item.num >= cfg.number ? 1 : 0;
                            }
                            else {
                                finishNum = item.num
                            }
                        }
                    }
                }
            }
        } else if (type == 3) {
            //主线
            let cfg = ConfigManager.getItemById(Mission_main_lineCfg, id)
            target = cfg.target;
            // 默认情况下,以number为目标进度值
            maxNum = cfg.number ? ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number) : 1
            let args: any = cfg.args
            if (cfg.target == 603) {
                // 竞技场排名特殊处理,目标进度值为目标排名
                // 当前进度值要读取玩家的竞技场排名
                maxNum = Number(cfg.args[0])
                let roleModel = ModelManager.get(RoleModel)
                let model = ModelManager.get(ArenaModel);
                let list = model.list
                for (let i = 0; i < list.length; i++) {
                    if (list[i].brief.id.toLocaleString() == roleModel.id.toLocaleString()) {
                        finishNum = i + 1
                        break
                    }
                }
            } else if (cfg.target == 108) {
                maxNum = Number(cfg.args) * 10000;
                finishNum = ModelManager.get(RoleModel).power;
            } else {
                if (args && typeof (args) == "object") {
                    if (args.length > 1) {
                        // args大于1时,目标数量以args长度为准
                        maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : args.length
                    }
                    if (mainLineDatas[cfg.target]) {
                        // args为数组时,遍历查找是否满足开启条件----------(args为数组时,只会有1个元素)
                        const arg = args[0];
                        let item: icmsg.MissionProgress = mainLineDatas[cfg.target][arg]
                        if (item) {
                            if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                                finishNum = item.num >= cfg.number ? 1 : 0;
                            }
                            else {
                                finishNum = item.num
                            }
                        }
                    }
                } else {
                    if (!args) { args = 0 }
                    if (mainLineDatas[cfg.target]) {
                        let item: icmsg.MissionProgress = mainLineDatas[cfg.target][args]
                        if (item) {
                            if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                                finishNum = item.num >= cfg.number ? 1 : 0;
                            }
                            else {
                                finishNum = item.num
                            }
                        }
                    }
                }
            }
        } else if (type == 4) {
            // 七日
            let cfg = ConfigManager.getItemById(Mission_7activityCfg, id)
            target = cfg.target;
            if (cfg.target == 108) {
                maxNum = cfg.args * 10000;
                finishNum = ModelManager.get(RoleModel).power;
            }
            else {
                maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
                let args = cfg.args
                if (!args) { args = 0 }
                if (!!sevenDaysDatas[cfg.target] && sevenDaysDatas[cfg.target][args]) {
                    let item: icmsg.MissionProgress = sevenDaysDatas[cfg.target][args]
                    if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                        finishNum = item.num >= cfg.number ? 1 : 0;
                    }
                    else {
                        finishNum = item.num
                    }
                }
            }
        }
        else if (type == 5) {
            // 周常
            let cfg = ConfigManager.getItemById(Mission_weeklyCfg, id)
            target = cfg.target;
            if (cfg.target == 108) {
                maxNum = cfg.args * 10000;
                finishNum = ModelManager.get(RoleModel).power;
            }
            else {
                maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
                let args = cfg.args
                if (!args) { args = 0 }
                if (!!weeklyDatas[cfg.target] && weeklyDatas[cfg.target][args]) {
                    let item: icmsg.MissionProgress = weeklyDatas[cfg.target][args]
                    if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                        finishNum = item.num >= cfg.number ? 1 : 0;
                    }
                    else {
                        finishNum = item.num
                    }
                }
            }
        } else if (type == 9) {
            let cfg = ConfigManager.getItemByField(Score_missionCfg, "id", id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!gradingDatas[cfg.target] && gradingDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = gradingDatas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        } else if (type == 10) {
            // 冒险日记
            let cfg = ConfigManager.getItemById(DiaryCfg, id)
            target = cfg.target;
            if (cfg.target == 108) {
                maxNum = cfg.args * 10000;
                finishNum = ModelManager.get(RoleModel).power;
            }
            else {
                maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
                let args = cfg.args
                if (!args) { args = 0 }
                if (!!diaryDatas[cfg.target] && diaryDatas[cfg.target][args]) {
                    let item: icmsg.MissionProgress = diaryDatas[cfg.target][args]
                    if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                        finishNum = item.num >= cfg.number ? 1 : 0;
                    }
                    else {
                        finishNum = item.num
                    }
                }
            }
        }
        else if (type == 11) {
            // 跨服狂欢
            let cfg = ConfigManager.getItemById(Carnival_dailyCfg, id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!carnivalDailyData[cfg.target] && carnivalDailyData[cfg.target][args]) {
                let item: icmsg.MissionProgress = carnivalDailyData[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        }
        else if (type == 12) {
            // 冒险日记
            let cfg = ConfigManager.getItemById(Carnival_ultimateCfg, id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!carnivalUltimateData[cfg.target] && carnivalUltimateData[cfg.target][args]) {
                let item: icmsg.MissionProgress = carnivalUltimateData[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        }
        else if (type == 13) {
            //  据点战 军衔日常任务
            let cfg = ConfigManager.getItemById(Foothold_dailytaskCfg, id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args: any = cfg.args
            if (!args) { args = 0 }
            if (!!footholdDailyDatas[cfg.target] && footholdDailyDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = footholdDailyDatas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        }
        else if (type == 14) {
            //  据点战 军衔常规任务
            let cfg = ConfigManager.getItemById(Foothold_ranktaskCfg, id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!footholdRankDatas[cfg.target] && footholdRankDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = footholdRankDatas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        } else if (type == 15 || type == 16) {
            let cfg = ConfigManager.getItemById(Relic_taskCfg, id)
            target = cfg.target;
            maxNum = cfg.number
            let args: any = cfg.args
            if (!args) { args = 0 }
            if (cfg.type == 1) {
                if (!!relicDailyDatas[cfg.target] && relicDailyDatas[cfg.target][args]) {
                    let item: icmsg.MissionProgress = relicDailyDatas[cfg.target][args]
                    if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                        finishNum = item.num >= cfg.number ? 1 : 0;
                    }
                    else {
                        finishNum = item.num
                    }
                }
            } else if (cfg.type == 2) {
                if (!!relicWeeklyDatas[cfg.target] && relicWeeklyDatas[cfg.target][args]) {
                    let item: icmsg.MissionProgress = relicWeeklyDatas[cfg.target][args]
                    if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                        finishNum = item.num >= cfg.number ? 1 : 0;
                    }
                    else {
                        finishNum = item.num
                    }
                }
            }
        } else if (type == MissionType.combineDaily) {
            //  合服狂欢 日常任务
            let cfg = ConfigManager.getItemById(Combine_dailyCfg, id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args: any = cfg.args
            if (!args) { args = 0 }
            if (!!combineDailyDatas[cfg.target] && combineDailyDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = combineDailyDatas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        }
        else if (type == MissionType.combineUltimate) {
            //  合服狂欢 常规任务
            let cfg = ConfigManager.getItemById(Combine_ultimateCfg, id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : (cfg.number ? cfg.number : cfg.args)
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!combineUltimateDatas[cfg.target] && combineUltimateDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = combineUltimateDatas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        }
        else if (type == MissionType.linkGame) {
            //  幸运连连看
            let cfg = ConfigManager.getItemById(ComboCfg, id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!linkGameDatas[cfg.target] && linkGameDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = linkGameDatas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        }
        else if (type == MissionType.cave) {
            //  矿洞大冒险
            let cfg = ConfigManager.getItemById(Cave_taskCfg, id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!caveDatas[cfg.target] && caveDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = caveDatas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        } else if (type == MissionType.costumeCustom) {
            //  神装定制
            let cfg = ConfigManager.getItemById(Costume_missionCfg, id)
            target = cfg.target;
            maxNum = [202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1 ? 1 : cfg.number
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!costumeCustomDatas[cfg.target] && costumeCustomDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = costumeCustomDatas[cfg.target][args]
                if ([202, 204, 205, 212, 214, 218].indexOf(cfg.target) != -1) {
                    finishNum = item.num >= cfg.number ? 1 : 0;
                }
                else {
                    finishNum = item.num
                }
            }
        }

        if (finishNum > maxNum) {
            finishNum = maxNum
        }

        if (target && target == 119) {
            //充值类任务,多语言需转换货币单位
            finishNum = SdkTool.tool.getRealRMBCost(finishNum);
            maxNum = SdkTool.tool.getRealRMBCost(maxNum);
        }
        return [finishNum, maxNum]
    }

    /**日常总活跃度 */
    static getDailyTotalActive(): number {
        let model = ModelManager.get(TaskModel)
        let dailyDatas = model.dailyDatas
        let cfgs = ConfigManager.getItems(Mission_dailyCfg)
        let value = 0
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i]
            if (cfg.target == 0) {
                continue
            }
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!dailyDatas[cfg.target] && dailyDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = dailyDatas[cfg.target][args]
                let state = model.rewardIds[cfg.id] || 0
                if (item && item.num >= cfg.number && state == 1) {
                    value += cfg.active
                }
            }
        }
        return value
    }


    /**周常总活跃度 */
    static getWeeklyTotalActive(): number {
        let model = ModelManager.get(TaskModel)
        let weeklyDatas = model.weeklyDatas
        let cfgs = ConfigManager.getItems(Mission_weeklyCfg)
        let value = 0
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i]
            if (cfg.target == 0) {
                continue
            }
            let args = cfg.args
            if (!args) { args = 0 }
            if (!!weeklyDatas[cfg.target] && weeklyDatas[cfg.target][args]) {
                let item: icmsg.MissionProgress = weeklyDatas[cfg.target][args]
                let state = model.rewardIds[cfg.id] || 0
                if (item && item.num >= cfg.number && state == 1) {
                    value += cfg.active
                }
            }
        }
        return value
    }

    static checkMissionState(idStr) {

    }

    /**获取某个任务是否已领奖 */
    static getTaskAwardState(id: number) {
        let model = ModelManager.get(TaskModel)
        let state = model.rewardIds[id] || 0
        return state == 1
    }

    /** 更新成就进度并判断是否有新成就
     * @param data 新进度
     */
    static updateAchieve(data: icmsg.MissionProgress) {
        this.initTaskConfig()
        let model = TaskModel.get()
        let target = data.type
        let achieveDatas = model.achieveDatas
        if (!achieveDatas[data.type]) {
            achieveDatas[data.type] = {}
        }
        let unDoneIds = []
        // 先把类型target相同,并且未完成的id记录下来
        for (const key in this.AchieveConfig) {
            const cfgs: Mission_achievementCfg[] = this.AchieveConfig[key];
            if (cfgs[0].target == target) {
                for (let index = 0; index < cfgs.length; index++) {
                    const cfg = cfgs[index];
                    // 是否已完成
                    let state = this.getTaskState(cfg.id)
                    // 未完成的才加入判断
                    if (!state) {
                        unDoneIds.push(cfg.id)
                    }
                }
            }
        }
        achieveDatas[data.type][data.arg] = data
        // 进度更新后,在把新完成的id记录下来
        for (let index = 0; index < unDoneIds.length; index++) {
            const id = unDoneIds[index];
            let state = this.getTaskState(id)
            if (state) {
                model.newAchieves.push(id)
            }
        }
        if (model.newAchieves.length > 0) {
            JumpUtils.updateAchieveTip();
        }
    }

    /**
     * 获取角色创建天数 
     */
    static getCrateRoleDays(): number {
        let day = 0;
        let createTime = ModelManager.get(RoleModel).createTime;
        let zeroTime = new Date(parseInt(createTime) * 1000).setHours(0, 0, 0, 0);
        let serverTime = ModelManager.get(ServerModel).serverTime;

        let d = 24 * 60 * 60 * 1000;
        day = Math.floor(serverTime / d - zeroTime / d);
        return day + 1;
    }

    /**
     * 获取单个在线奖励的领取状态
     * 0：不可领取 1：可领取 2：已领取
     */
    static getOnlineRewardItemSstate(id: number, time: number): number {
        let cfg = ConfigManager.getItemById(Mission_onlineCfg, id);
        if (cfg.days < TaskUtil.getCrateRoleDays()) return 2;
        if (cfg.days > TaskUtil.getCrateRoleDays()) return 0;
        let state = 0;
        let model = ModelManager.get(TaskModel)
        if (!model.onlineInfo) {
            // CC_DEBUG && cc.log('在线奖励信息为空，请向服务器获取')
            return state;
        }
        let servermodel = ModelManager.get(ServerModel)
        let serverTime = Math.floor(servermodel.serverTime / 1000)
        let num = serverTime - model.onlineInfo.startTime;
        if (num >= time) {
            state = 1;
            let can = (model.onlineInfo.awardBits & 1 << id - 1) > 0;
            if (can) {
                state = 2;
            }
        }

        return state;
    }

    /**
     * 获取当前在线奖励的状态
     * 0：倒计时 1：可领取 2：已结完成（隐藏按钮）
     */
    static getOnlineReward(): number {
        let state = 0;
        let model = ModelManager.get(TaskModel)
        if (!model.onlineInfo) {
            // CC_DEBUG && cc.log('在线奖励信息为空，请向服务器获取')
            return state;
        }
        let servermodel = ModelManager.get(ServerModel)
        let serverTime = Math.floor(servermodel.serverTime / 1000)
        let num = serverTime - model.onlineInfo.startTime;
        let cfgs = ConfigManager.getItemsByField(Mission_onlineCfg, 'days', this.getCrateRoleDays());
        if (!cfgs) return 2; //超出活动在线奖励的天数

        let time = 0;
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            time += cfg.time;
            if (time <= num) {
                let reward = (model.onlineInfo.awardBits & 1 << cfg.id - 1) > 0;
                if (!reward) {
                    state = 1;
                    return state;
                }
            } else {
                return state;
            }
        }

        if (time <= num && state == 0) {
            state = 2;
        }
        return state;
    }

    /**
     * 获取在线奖励当前倒计时的时间
     */
    static getOnlineRewardTime(): number {
        let time = 0;
        let model = ModelManager.get(TaskModel)
        if (!model.onlineInfo) {
            // CC_DEBUG && cc.log('在线奖励信息为空，请向服务器获取')
            return 6000;
        }
        let cfgs = ConfigManager.getItemsByField(Mission_onlineCfg, 'days', this.getCrateRoleDays());
        if (!cfgs) return time; //超出活动在线奖励的天数

        let servermodel = ModelManager.get(ServerModel)
        let serverTime = Math.floor(servermodel.serverTime / 1000)
        let num = serverTime - model.onlineInfo.startTime;
        let allReward = false;
        cfgs.some(cfg => {
            time += cfg.time;
            if (time > num) {
                allReward = true;
                time = time - num;
                return time;
            }
        })
        //在线时间大于任务总时间时返回0
        if (!allReward && num > time) {
            time = 0;
        }
        return time;
    }

    /**
     * 获取在线奖励当前倒计时的奖励
     */
    static getOnLineCountRewardCfg(): Mission_onlineCfg {
        let model = ModelManager.get(TaskModel)
        if (!model.onlineInfo) {
            // CC_DEBUG && cc.log('在线奖励信息为空，请向服务器获取')
            return;
        }
        let servermodel = ModelManager.get(ServerModel)
        let serverTime = Math.floor(servermodel.serverTime / 1000)
        let num = serverTime - model.onlineInfo.startTime;
        let cfgs = ConfigManager.getItemsByField(Mission_onlineCfg, 'days', this.getCrateRoleDays());
        if (!cfgs) return null; //超出活动在线奖励的天数
        let curCfg = null;
        let times: number[] = [num];
        let time = 0;
        cfgs.forEach(cfg => {
            time += cfg.time;
            times.push(time);
        });
        times.sort((a, b) => {
            return a - b;
        });
        let idx = times.lastIndexOf(num);
        if (idx < cfgs.length && idx != -1) {
            curCfg = cfgs[idx];
        }
        return curCfg;
    }

    /**
     * 获取在线奖励当前显示的奖励
     */
    static getOnlineRewardCfg(): Mission_onlineCfg {
        let time = 0;
        let model = ModelManager.get(TaskModel)
        if (!model.onlineInfo) {
            // CC_DEBUG && cc.log('在线奖励信息为空，请向服务器获取')
            return;
        }
        let servermodel = ModelManager.get(ServerModel)
        let serverTime = Math.floor(servermodel.serverTime / 1000)
        let num = serverTime - model.onlineInfo.startTime;
        let cfgs = ConfigManager.getItemsByField(Mission_onlineCfg, 'days', this.getCrateRoleDays());
        if (!cfgs) return null; //超出活动在线奖励的天数
        let curCfg = null;

        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i]
            time += cfg.time;

            if (time <= num) {
                let can = (model.onlineInfo.awardBits & 1 << cfg.id - 1) > 0;
                if (!can) {
                    curCfg = cfg;
                    break;
                }
            } else if (time > num) {
                curCfg = cfg;
                break;
            }
        }

        return curCfg;
    }

    /**
     * 在线奖励剩余时间转化为字符串
     * @param sec 
     */
    static getOnlineRewardTimeStr(sec: number): string {
        let h = Math.floor(sec / 3600);
        let m = Math.floor((sec - h * 3600) / 60);
        let s = (sec - h * 3600 - m * 60);
        let str = (h < 10 ? `0${h}` : `${h}`) + ':' + (m < 10 ? `0${m}` : `${m}`) + ':' + (s < 10 ? `0${s}` : `${s}`);
        return str;
    }


    //成长任务表
    static GrowConfig = null

    /**初始化成长任务表
     * 根据subject字段分别存储
     */
    static initGrowTaskConfig() {
        if (this.GrowConfig) {
            return
        }
        let config = {}
        let items = ConfigManager.getItems(Mission_growCfg)
        for (let index = 0; index < items.length; index++) {
            let cfg = items[index];
            let chapter = cfg.chapter
            if (!config[chapter]) {
                config[chapter] = []
            }
            let arr: Mission_growCfg[] = config[chapter]
            let len = arr.length
            if (len == 0) {
                arr.push(cfg)
            } else {
                for (let index = 0; index < len; index++) {
                    let ele = arr[index];
                    if (cfg.id < ele.id) {
                        arr.splice(index, 0, cfg)
                        break
                    }
                    if (index == len - 1) {
                        arr.push(cfg)
                        break
                    }
                }
            }
        }
        this.GrowConfig = config
    }

    /** 更新成就进度并判断是否有新成就
     * @param data 新进度
     */
    static updateGrow(data: icmsg.MissionProgress) {
        this.initGrowTaskConfig()
        let model = TaskModel.get()
        let target = data.type
        let growDatas = model.GrowDatas
        if (!growDatas[data.type]) {
            growDatas[data.type] = {}
        }
        // let unDoneIds = []
        // // 先把类型target相同,并且未完成的id记录下来
        // for (const key in this.GrowConfig) {
        //     const cfgs: Mission_growCfg[] = this.GrowConfig[key];
        //     if (cfgs[0].target == target) {
        //         for (let index = 0; index < cfgs.length; index++) {
        //             const cfg = cfgs[index];
        //             // 是否已完成
        //             let state = this.getTaskState(cfg.id)
        //             // 未完成的才加入判断
        //             if (!state) {
        //                 unDoneIds.push(cfg.id)
        //             }
        //         }
        //     }
        // }
        growDatas[data.type][data.arg] = data

    }

    /**
     * 获取单个成长任务的领取状态
     * 0：不可领取 1：可领取 2：已领取
     */
    static getGrowTaskItemState(cfg: Mission_growCfg, pos: number): number {
        let state = 0;
        let model = TaskModel.get()
        let growDatas = model.GrowDatas
        let args = 0;
        if (cc.js.isNumber(cfg.args) && cfg.args > 0) {
            args = cfg.args
        }

        let can = (model.GrowBits & 1 << pos) > 0;
        if (can) {
            state = 2;
        } else {
            if (growDatas[cfg.target] && growDatas[cfg.target][args]) {
                if (growDatas[cfg.target][args].num >= cfg.number) {
                    state = 1;
                    if (can) {
                        state = 2;
                    }
                }
            }
        }
        // if (growDatas[cfg.target] && growDatas[cfg.target][args]) {
        //     let can = (model.GrowBits & 1 << pos) > 0;
        //     if (can) {
        //         state = 2;
        //     } else {
        //         if (growDatas[cfg.target][args].num >= cfg.number) {
        //             state = 1;
        //             if (can) {
        //                 state = 2;
        //             }
        //         }
        //     }
        // }
        return state;
    }

    /** 更新神器任务
     * @param data 新进度
     */
    static updateWeapon(data: icmsg.MissionProgress) {
        let model = TaskModel.get()
        let weaponDatas = model.weaponDatas
        if (!weaponDatas[data.type]) {
            weaponDatas[data.type] = {}
        }
        weaponDatas[data.type][data.arg] = data
    }

    /**
     * 获取单个神器任务的领取状态
     * 0：不可领取 1：可领取 2：已领取
     */
    static getWeaponTaskItemState(cfg: General_weapon_missionCfg, pos: number): number {
        let state = 0;
        let model = TaskModel.get()
        let weaponDatas = model.weaponDatas
        let args = 0;
        if (cc.js.isNumber(cfg.args) && cfg.args > 0) {
            args = cfg.args
        }
        let can = (model.weaponBits & 1 << pos) > 0;
        if (can) {
            state = 2;
        } else {
            if (weaponDatas[cfg.target] && weaponDatas[cfg.target][args]) {
                if (weaponDatas[cfg.target][args].num >= cfg.number) {
                    state = 1;
                    if (can) {
                        state = 2;
                    }
                }
            }
        }
        return state;
    }

    /**
     * 根据表类型And任务类型 获取对应任务列表
     * @param sheetType 1-日常 2-成就 3-通关奖励 4-7日活动 5-7日活动目标奖励 6-生存秘籍
     * @param taskType 
     */
    static getTaskProgressCfg(sheetType: TaskSheetType, taskType: number): any[] {
        let cfgType;
        switch (sheetType) {
            case 1:
                cfgType = Mission_dailyCfg;
                break;
            case 2:
                cfgType = Mission_achievementCfg;
                break;
            case 3:
                cfgType = Mission_main_lineCfg;
                break;
            case 4:
                cfgType = Mission_7activityCfg;
                break;
            case 5:
                cfgType = Mission_7scoreCfg;
                break;
            case 6:
                cfgType = Mission_growCfg;
                break;
            case 7:
                cfgType = Mission_welfareCfg;
            default:
                break;
        }
        let cfgs = null;
        if (cfgType) {
            cfgs = ConfigManager.getItemsByField(cfgType, 'target', taskType);
        }
        return cfgs;
    }

    /**
     * 获取任务进度 某任务是否已读 
     * @param sheetType 1-日常 2-成就 3-通关奖励 4-7日活动 5-7日活动目标奖励 6-生存秘籍
     * @param taskType 
     * @param taskId 
     */
    static getPveTaskProgressIsReadById(sheetType: TaskSheetType, taskType: number, taskId: number) {
        let model = ModelManager.get(RoleModel);
        let cookie = model.cookie;
        let obj = {};
        if (cookie) obj = JSON.parse(cookie);
        if (obj
            && obj["taskProgressReadStatus"]
            && obj["taskProgressReadStatus"][sheetType]
            && obj["taskProgressReadStatus"][sheetType][taskType] >= taskId) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 存储任务已读状态  【【前置条件 任务已完成】】
     * @param sheetType 1-日常 2-成就 3-通关奖励 4-7日活动 5-7日活动目标奖励 6-生存秘籍
     * @param taskType 
     * @param taskId 
     */
    static setPveTaskProgressReadStatus(sheetType: TaskSheetType, taskType: number, taskId: number) {
        let finish = false;
        finish = this.getTaskState(taskId, sheetType);
        if (!finish) return;
        let model = ModelManager.get(RoleModel);
        let cookie = model.cookie;
        let obj = {};
        if (cookie) obj = JSON.parse(cookie);
        if (obj
            && obj["taskProgressReadStatus"]
            && obj["taskProgressReadStatus"][sheetType]
            && obj["taskProgressReadStatus"][sheetType][taskType] == taskId) return;
        else {
            if (!obj["taskProgressReadStatus"]) obj["taskProgressReadStatus"] = {};
            if (!obj["taskProgressReadStatus"][sheetType]) obj["taskProgressReadStatus"][sheetType] = {};
            obj["taskProgressReadStatus"][sheetType][taskType] = taskId;
            model.cookie = JSON.stringify(obj);
            let req = new icmsg.RoleCookieSetReq();
            req.cookie = model.cookie;
            NetManager.send(req);
        }
    }

    /**
     * 返回已派遣的英雄列表
     */
    static getTavernUpHeroIdList() {
        let heroInfos = ModelManager.get(HeroModel).heroInfos;
        let list: number[] = [];
        heroInfos.forEach(info => {
            let status = (<icmsg.HeroInfo>info.extInfo).status;
            if ((status & 1 << 1) >= 1) {
                list.push((<icmsg.HeroInfo>info.extInfo).heroId);
            }
        })
        return list;
    }

    /**
     * 酒馆-更新英雄派遣状态
     * @param heroId 
     * @param status 0-未派遣 1-派遣中
     */
    static updatTavernHeroSendState(heroId: number, status: number) {
        let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
        if (!heroInfo) return;
        if (status == 0) {
            if ((heroInfo.status << 1) > 0) {
                heroInfo.status ^= 1 << 1;
            }
        }
        else if (status == 1) {
            heroInfo.status |= 1 << 1;
        }
    }

    /**
     * 更新开服福利120抽奖励领取位图
     * @param id 
     */
    static updateWelfareReward(id: number) {
        let model = ModelManager.get(TaskModel);
        let idx = id % 10000;
        let old = model.welfareReward[Math.floor(idx / 8)] | 0;
        old |= 1 << idx % 8;
        if (!model.welfareReward[Math.floor(idx / 8)]) {
            while (model.welfareReward.length < Math.floor(idx / 8)) {
                model.welfareReward.push(0);
            }
            model.welfareReward.push(old);
        }
        else model.welfareReward[Math.floor(idx / 8)] = old;
    }

    /**
     * 获取开服福利任务奖励是否领取
     * @param id 
     */
    static getWelfareTaskState(id: number) {
        let model = ModelManager.get(TaskModel);
        let idx = id % 10000;
        let old = model.welfareReward[Math.floor(idx / 8)] | 0;
        if ((old & 1 << idx % 8) >= 1) return true;
        else return false
    }

    /**
     * 开服福利奖励是否全部领取
     */
    static isAllRecivedInWelfareView(): boolean {
        let cfgs = ConfigManager.getItems(Mission_welfareCfg);
        for (let i = 0; i < cfgs.length; i++) {
            if (!this.getWelfareTaskState(cfgs[i].id)) return false;
        }
        return true;
    }

    /**
     * 更新开服福利二期奖励领取位图
     * @param id 
     */
    static updateWelfare2Reward(id: number) {
        let model = ModelManager.get(TaskModel);
        let idx = id % 1000;
        let old = model.welfareReward2[Math.floor(idx / 8)] | 0;
        old |= 1 << idx % 8;
        if (!model.welfareReward2[Math.floor(idx / 8)]) {
            while (model.welfareReward2.length < Math.floor(idx / 8)) {
                model.welfareReward2.push(0);
            }
            model.welfareReward2.push(old);
        }
        else model.welfareReward2[Math.floor(idx / 8)] = old;
    }

    /**
     * 获取开服福利二期任务奖励是否领取
     * @param id 
     */
    static getWelfare2TaskState(id: number) {
        let model = ModelManager.get(TaskModel);
        let idx = id % 1000;
        let old = model.welfareReward2[Math.floor(idx / 8)] | 0;
        if ((old & 1 << idx % 8) >= 1) return true;
        else return false
    }

    /**
     * 开服福利二期奖励是否全部领取
     */
    static isAllRecivedInWelfare2View(): boolean {
        let cfgs = ConfigManager.getItems(Mission_welfare2Cfg);
        for (let i = 0; i < cfgs.length; i++) {
            if (!this.getWelfare2TaskState(cfgs[i].id)) return false;
        }
        return true;
    }


    static getGradingTaskList() {
        this.initGradingConfig()
        let model = ModelManager.get(TaskModel);
        let list = []
        let rewards = model.rewardIds
        if (model.grading.boxOpened == 0) {
            model.grading.boxOpened = 1
        }
        let curNode = model.grading.boxOpened
        let cfgs = ConfigManager.getItems(ScoreCfg)
        if (curNode > cfgs.length) {
            curNode = cfgs.length
        }
        let curCfgs = this.GradingConfig[curNode]
        for (const key in curCfgs) {
            const cfgs: Score_missionCfg[] = curCfgs[key];
            let len = cfgs.length
            for (let index = 0; index < len; index++) {
                const element = cfgs[index];
                if (element) {
                    // 是否已完成
                    let state = this.getTaskState(element.id)
                    let geted = rewards[element.id] || 0
                    // 若没完成 或者没领奖,或者已经是最后一项,则添加进表中
                    if (index == len - 1 || !state || geted == 0) {
                        list.push(element)
                        break
                    }
                }
            }
        }

        //类型为0的加在最后
        let commoneCfgs = this.GradingConfig[0]
        for (const key in commoneCfgs) {
            const cfgs: Score_missionCfg[] = commoneCfgs[key];
            let len = cfgs.length
            for (let index = 0; index < len; index++) {
                const element = cfgs[index];
                if (element) {
                    // 是否已完成
                    let state = this.getTaskState(element.id)
                    let geted = rewards[element.id] || 0
                    // 若没完成 或者没领奖,或者已经是最后一项,则添加进表中
                    if (index == len - 1 || !state || geted == 0) {
                        list.push(element)
                        break
                    }
                }
            }
        }

        return list
    }

    /**
 * 获取评分系统任务是否开启
 * @param id 
 */
    static getGradingTaskIsOpen(id: number): boolean {
        let cfg = ConfigManager.getItemByField(Score_missionCfg, "id", id);
        let fbId = cfg.fbId;
        let roleMode = ModelManager.get(RoleModel);
        let copyMode = ModelManager.get(CopyModel);
        let b = true;
        let level = cfg.level;
        if (level) {
            b = roleMode.level >= level;
        }
        if (fbId) {
            b = b && copyMode.lastCompleteStageId >= fbId;
        }
        return b;
    }



    static getFootholdRankTaskList() {
        this.initFootholdRankTaskConfig()
        let rewards = ModelManager.get(TaskModel).rewardIds
        let list = []
        for (const key in this.FootholdRankTaskConfig) {
            const cfgs: Foothold_ranktaskCfg[] = this.FootholdRankTaskConfig[key];
            let len = cfgs.length
            for (let index = 0; index < len; index++) {
                const element = cfgs[index];
                // 是否已完成
                let state = this.getTaskState(element.id)
                let geted = rewards[element.id] || 0
                // 若没完成 或者没领奖,或者已经是最后一项,则添加进表中
                if (index == len - 1 || !state || geted == 0) {
                    list.push(element)
                    break
                }
            }
        }
        return list
    }

    static getCombineUltimateTaskList() {
        this.initCombineUltimateConfig()
        let rewards = ModelManager.get(TaskModel).rewardIds
        let list = []
        for (const key in this.CombineUltimateCfg) {
            const cfgs: Combine_ultimateCfg[] = this.CombineUltimateCfg[key];
            let len = cfgs.length
            for (let index = 0; index < len; index++) {
                const element = cfgs[index];
                // 是否已完成
                let state = this.getTaskState(element.id)
                let geted = rewards[element.id] || 0
                // 若没完成 或者没领奖,或者已经是最后一项,则添加进表中
                if (index == len - 1 || !state || geted == 0) {
                    list.push(element)
                    break
                }
            }
        }
        return list
    }

}

/**配置表类型 */
export enum TaskSheetType {
    daily = 1,      //日常
    achievement,    //成就
    main,           //通关奖励
    seven_activity, //7日活动
    seven_score,    //7日活动目标奖励
    grow,           //生存秘籍
    welfare,        //开服福利
}
