import ActivityModel from '../../view/act/model/ActivityModel';
import ActUtil from '../../view/act/util/ActUtil';
import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from './GlobalUtil';
import JumpUtils from './JumpUtils';
import ModelManager from '../managers/ModelManager';
import SailingModel from '../../view/act/model/SailingModel';
import ServerModel from '../../common/models/ServerModel';
import StoreModel from '../../view/store/model/StoreModel';
import TaskModel from '../../view/task/model/TaskModel';
import TaskUtil from '../../view/task/util/TaskUtil';
import TimerUtils from './TimerUtils';
import {
    Activity_collect_heroCfg,
    Activity_continuousCfg,
    Activity_land_giftsCfg,
    Activity_star_giftsCfg,
    Activity_upgradeCfg,
    Combo_lineCfg,
    ComboCfg,
    Common_carouselCfg,
    Costume_missionCfg,
    MainInterface_mainCfg,
    MainInterface_sortCfg,
    Platform_activityCfg,
    Store_pushCfg,
    SystemCfg,
    Talent_alchemyCfg,
    Talent_arenaCfg,
    Talent_quick_combatCfg,
    Talent_treasureCfg,
    Twist_eggCfg
    } from '../../a/config';
import { subActType } from '../../view/act/ctrl/wonderfulActivity/SubActivityViewCtrl';

/** 
  * @Description: 活动工具ui
  * @Author: weiliang.huang  
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-04 14:47:16
 * @Last Modified time: 2021-10-14 19:03:20
*/


export default class ActivityUtils {
    static get actModel(): ActivityModel { return ModelManager.get(ActivityModel); };

    static costumeCustomTaskMap: { [theme: number]: Costume_missionCfg[] } = {};


    /**
     * 远航寻宝累计充值任务奖励是否领取
     * @param id 
     */
    static getSailingRewardState(id: number) {
        let model = ModelManager.get(SailingModel);
        let idx = id;
        let old = model.sailingInfo.chargeRewarded;//model.lcdlRewards[Math.floor(idx / 8)] | 0;
        if ((old & 1 << idx) >= 1) return true;
        else return false
    }

    /**
     * 更新累计充值活动奖励领取位图
     * @param id 
     */
    static updateLcdlReward(id: number) {
        let model = ModelManager.get(ActivityModel);
        let idx = id;
        let old = model.lcdlRewards[Math.floor(idx / 8)] | 0;
        old |= 1 << idx % 8;
        if (!model.lcdlRewards[Math.floor(idx / 8)]) {
            while (model.lcdlRewards.length < Math.floor(idx / 8)) {
                model.lcdlRewards.push(0);
            }
            model.lcdlRewards.push(old);
        }
        else model.lcdlRewards[Math.floor(idx / 8)] = old;
    }

    /**
     * 累计充值任务奖励是否领取
     * @param id 
     */
    static getLcdlRewardState(id: number) {
        let model = ModelManager.get(ActivityModel);
        let idx = id;
        let old = model.lcdlRewards[Math.floor(idx / 8)] | 0;
        if ((old & 1 << idx % 8) >= 1) return true;
        else return false
    }

    /**
     * 更新累计充值活动奖励领取位图
     * @param id 
     */
    static updateNewLcdlReward(id: number) {
        let model = ModelManager.get(ActivityModel);
        let idx = id;
        let old = model.newLcdlRewards[Math.floor(idx / 8)] | 0;
        old |= 1 << idx % 8;
        if (!model.newLcdlRewards[Math.floor(idx / 8)]) {
            while (model.newLcdlRewards.length < Math.floor(idx / 8)) {
                model.newLcdlRewards.push(0);
            }
            model.newLcdlRewards.push(old);
        }
        else model.newLcdlRewards[Math.floor(idx / 8)] = old;
    }

    /**
     * 累计充值任务奖励是否领取
     * @param id 
     */
    static getNewLcdlRewardState(id: number) {
        let model = ModelManager.get(ActivityModel);
        let idx = id;
        let old = model.newLcdlRewards[Math.floor(idx / 8)] | 0;
        if ((old & 1 << idx % 8) >= 1) return true;
        else return false
    }

    /**
     * 更新累计登陆活动奖励领取位图
     * @param id 
     */
    static updateTotalLoginReward(id: number) {
        let model = ModelManager.get(ActivityModel);
        let idx = id;
        let old = model.totalLoginRewards[Math.floor(idx / 8)] | 0;
        old |= 1 << idx % 8;
        if (!model.totalLoginRewards[Math.floor(idx / 8)]) {
            while (model.totalLoginRewards.length < Math.floor(idx / 8)) {
                model.totalLoginRewards.push(0);
            }
            model.totalLoginRewards.push(old);
        }
        else model.totalLoginRewards[Math.floor(idx / 8)] = old;
    }

    /**
     * 累计登陆任务奖励是否领取
     * @param id 
     */
    static getTotalLoginRewardState(id: number) {
        let model = ModelManager.get(ActivityModel);
        let idx = id;
        let old = model.totalLoginRewards[Math.floor(idx / 8)] | 0;
        if ((old & 1 << idx % 8) >= 1) return true;
        else return false
    }

    // /**
    //  * 幸运翻牌--更新累计翻牌次数奖励领取位图
    //  * @param id 
    //  */
    // static updateFlipCardTotalFlipReward(id: number) {
    //     let model = ModelManager.get(ActivityModel);
    //     let idx = id - 1;
    //     let old = model.flipCardTotalReward[Math.floor(idx / 8)] | 0;
    //     old |= 1 << idx % 8;
    //     if (!model.flipCardTotalReward[Math.floor(idx / 8)]) {
    //         while (model.flipCardTotalReward.length < Math.floor(idx / 8)) {
    //             model.flipCardTotalReward.push(0);
    //         }
    //         model.flipCardTotalReward.push(old);
    //     }
    //     else model.flipCardTotalReward[Math.floor(idx / 8)] = old;
    // }

    // /**
    //  * 幸运翻牌--累计翻牌次数的奖励是否领取
    //  * @param id 
    //  */
    // static getFlipCardTotalFlipRewardState(id: number) {
    //     let model = ModelManager.get(ActivityModel);
    //     let idx = id - 1;
    //     let old = model.flipCardTotalReward[Math.floor(idx / 8)] | 0;
    //     if ((old & 1 << idx % 8) >= 1) return true;
    //     else return false
    // }

    //**扭蛋已扭次数 */
    static getUseTwistEggTime() {
        let actCfg = ActUtil.getCfgByActId(92);
        if (!actCfg) return 0;
        let rewarded = ModelManager.get(ActivityModel).luckyTwistEggRewarded
        let ids = rewarded.toString(2).split("").reverse()
        let count = 0
        for (let i = 0; i < ids.length; i++) {
            if (ids[i] == "1") {
                count++
            }
        }
        return count
    }

    /**扭蛋-返回剩余奖励 */
    static getLeftTwistEggRewardCfg() {
        let actCfg = ActUtil.getCfgByActId(92);
        if (!actCfg) return null;
        let rewardCfgs = ConfigManager.getItemsByField(Twist_eggCfg, "type", ModelManager.get(ActivityModel).luckyTwistEggSubType)//actCfg.reward_type
        // GlobalUtil.sortArray(rewardCfgs, (a, b) => {
        //     return b.index - a.index
        // })
        let rewarded = ModelManager.get(ActivityModel).luckyTwistEggRewarded
        let ids = rewarded.toString(2).split("").reverse()
        let rewardIds = []
        for (let i = 0; i < ids.length; i++) {
            if (ids[i] == "1") {
                rewardIds.push(i + 1)
            }
        }
        let cfgs: Twist_eggCfg[] = [];
        for (let i = 0; i < rewardCfgs.length; i++) {
            if (rewardIds.indexOf(rewardCfgs[i].number) == -1) {
                cfgs.push(rewardCfgs[i])
            }
        }
        return cfgs;
    }

    // /**扭蛋-奖励是否已抽走(活动期间) */
    static getTwistEggRewardState(id: number) {
        let actCfg = ActUtil.getCfgByActId(92);
        if (!actCfg) return false;
        let cfgs = this.getLeftTwistEggRewardCfg()
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].number == id) {
                return false
            }
        }
        return true
    }

    /**扭蛋推送礼包剩余个数 */
    static getTwistEggPushGiftNum() {
        let actCfg = ActUtil.getCfgByActId(92);
        if (!actCfg) return false;
        let rewardCfgs = ConfigManager.getItems(Twist_eggCfg, (cfg: Twist_eggCfg) => {
            if (cfg.type == ModelManager.get(ActivityModel).luckyTwistEggSubType && this.getTwistEggPushGiftId(cfg) > 0) {//actCfg.reward_type
                return true;
            }
        })
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let giftDatas = ModelManager.get(StoreModel).starGiftDatas
        let leftNum = 0
        for (let i = 0; i < rewardCfgs.length; i++) {
            let giftCfg = ConfigManager.getItemByField(Store_pushCfg, "open_conds", this.getTwistEggPushGiftId(rewardCfgs[i]), { event_type: 2 })
            for (let j = 0; j < giftDatas.length; j++) {
                if (giftCfg && giftDatas[j].giftId == giftCfg.gift_id && giftDatas[j].remainNum > 0 && (giftDatas[j].startTime + giftCfg.duration > curTime)) {
                    leftNum++
                }
            }
        }
        return leftNum
    }

    /**扭蛋推送礼包id 大于0为有礼包  */
    static getTwistEggPushGiftId(cfg: Twist_eggCfg) {
        if (cfg && cfg.gifts && cfg.gifts > 0) {
            return cfg.gifts
        }

        if (cfg && cfg.wish && cfg.wish.length > 0) {
            for (let i = 0; i < cfg.wish.length; i++) {
                let index = ModelManager.get(ActivityModel).luckyTwistEggWished[cfg.number - 1]
                if (index == i + 1 && cfg.wish[i][2] && cfg.wish[i][2] > 0) {//第三位表示礼包id
                    return cfg.wish[i][2]
                }
            }
        }
        return 0
    }

    /**
     * 精彩活动-子活动任务完成状态 0-未完成 1-可领奖 2-已领奖
     * @param taskId 
     */
    static getExcitingActTaskState(taskId: number) {
        let type = Math.floor(taskId / 10000);
        let info = ModelManager.get(ActivityModel).excitingActInfo[type] || {};
        if (Object.keys(info).length <= 0) {
            return 0;
        }
        let cfg;
        switch (type) {
            case subActType.alchemy:
                cfg = ConfigManager.getItemById(Talent_alchemyCfg, taskId);
                break;
            case subActType.arena:
                cfg = ConfigManager.getItemById(Talent_arenaCfg, taskId);
                break;
            case subActType.collectHero:
                cfg = ConfigManager.getItemById(Activity_collect_heroCfg, taskId);
                break;
            case subActType.continuous:
                cfg = ConfigManager.getItemById(Activity_continuousCfg, taskId);
                break;
            case subActType.quickCombat:
                cfg = ConfigManager.getItemById(Talent_quick_combatCfg, taskId);
                break;
            case subActType.treasure:
                cfg = ConfigManager.getItemById(Talent_treasureCfg, taskId);
                break;
            case subActType.upgrade:
                cfg = ConfigManager.getItemById(Activity_upgradeCfg, taskId);
                break;
            case subActType.starGift:
                cfg = ConfigManager.getItemById(Activity_star_giftsCfg, taskId);
                break;
            default:
                break;
        }

        let rounds = cfg['rounds'] || 0;
        let args = cfg.args || 0;
        if (info[rounds]
            && info[rounds][cfg.target]
            && info[rounds][cfg.target][args]
            && info[rounds][cfg.target][args] >= cfg.number) {
            if (ModelManager.get(ActivityModel).excitingRewards[cfg.taskid]) {
                return 2;
            }
            else {
                return 1;
            }
        }
        else {
            return 0;
        }
    }

    /**
     * 返回幸运连连看连线奖励状态 0-不可领取 1-可领取 2-已领取
     * @param id 
     */
    static getLinkGameLineRewardState(id: number) {
        let m = ModelManager.get(ActivityModel);
        let lineCfg = ConfigManager.getItemById(Combo_lineCfg, id);
        if (m.linkRewardMap[id] == 1) return 2;
        else {
            for (let i = 0; i < lineCfg.card_id.length; i++) {
                let taskId = ConfigManager.getItem(ComboCfg, (cfg: ComboCfg) => {
                    if (cfg.reward_type == lineCfg.reward_type &&
                        cfg.rounds == lineCfg.rounds &&
                        cfg.card_id == lineCfg.card_id[i]) {
                        return true;
                    }
                }).task_id;
                if (!TaskUtil.getTaskAwardState(taskId)) {
                    return 0;
                }
            }
            return 1;
        }
    }

    static getLinkGameGiftDatas() {
        let datas: icmsg.StorePushGift[] = [];
        let cfgs: Store_pushCfg[] = [];
        ModelManager.get(StoreModel).starGiftDatas.forEach(d => {
            let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
            if (cfg && cfg.event_type == 3 && d.remainNum > 0 && d.startTime + cfg.duration > GlobalUtil.getServerTime() / 1000) {
                cfgs.push(cfg);
                datas.push(d);
            }
        });
        return datas;
    }

    static getCaveGiftDatas() {
        let datas: icmsg.StorePushGift[] = [];
        let cfgs: Store_pushCfg[] = [];
        ModelManager.get(StoreModel).starGiftDatas.forEach(d => {
            let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
            if (cfg && cfg.event_type == 4 && d.remainNum > 0 && d.startTime + cfg.duration > GlobalUtil.getServerTime() / 1000) {
                cfgs.push(cfg);
                datas.push(d);
            }
        });
        return datas;
    }

    static getAssembledGiftDatas() {
        let datas: icmsg.StorePushGift[] = [];
        let cfgs: Store_pushCfg[] = [];
        ModelManager.get(StoreModel).starGiftDatas.forEach(d => {
            let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
            if (cfg && cfg.event_type == 7 && d.remainNum > 0 && d.startTime + cfg.duration > GlobalUtil.getServerTime() / 1000) {
                cfgs.push(cfg);
                datas.push(d);
            }
        });
        return datas;
    }

    static getCaveGiftDatasById(giftId: number) {
        let datas: icmsg.StorePushGift;
        let cfgs: Store_pushCfg[] = [];
        ModelManager.get(StoreModel).starGiftDatas.forEach(d => {
            if (d.giftId == giftId) {
                let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
                if (cfg && cfg.event_type == 4 && d.remainNum > 0 && d.startTime + cfg.duration > GlobalUtil.getServerTime() / 1000) {
                    cfgs.push(cfg);
                    datas = d;
                }
            }
        });
        return datas;
    }

    /**
     * 矿洞礼包详情
     * @param giftId 
     * @returns 0-不存在 1-已购买 2-可购买 3-过期
     */
    static getCaveGiftStateById(giftId: number) {
        let data: icmsg.StorePushGift;
        ModelManager.get(StoreModel).starGiftDatas.forEach(d => {
            if (d.giftId == giftId) {
                let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
                if (cfg && cfg.event_type == 4) {
                    data = d;
                }
            }
        });
        if (!data) return 0;
        let cfg = ConfigManager.getItemById(Store_pushCfg, data.giftId);
        if (data.startTime + cfg.duration <= GlobalUtil.getServerTime() / 1000) return 3;
        if (data.remainNum <= 0) return 1;
        return 2;
    }


    /**神装定制礼包数据 */
    static getCostumeCustomGiftDatas() {
        let datas: icmsg.StorePushGift[] = [];
        let cfgs: Store_pushCfg[] = [];
        ModelManager.get(StoreModel).starGiftDatas.forEach(d => {
            let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
            if (cfg && cfg.event_type == 6 && d.remainNum > 0 && d.startTime + cfg.duration > GlobalUtil.getServerTime() / 1000) {
                cfgs.push(cfg);
                datas.push(d);
            }
        });
        return datas;
    }

    /**根据礼包id获取神装定制礼包数据 */
    static getCostumeCustomGiftDatasById(giftId: number) {
        let datas: icmsg.StorePushGift;
        let cfgs: Store_pushCfg[] = [];
        ModelManager.get(StoreModel).starGiftDatas.forEach(d => {
            if (d.giftId == giftId) {
                let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
                if (cfg && cfg.event_type == 6 && d.remainNum > 0 && d.startTime + cfg.duration > GlobalUtil.getServerTime() / 1000) {
                    cfgs.push(cfg);
                    datas = d;
                }
            }
        });
        return datas;
    }

    /**
     * 矿洞礼包详情
     * @param giftId 
     * @returns 0-不存在 1-已购买 2-可购买 3-过期
     */
    static getCostumeCustomGiftStateById(giftId: number) {
        let data: icmsg.StorePushGift;
        ModelManager.get(StoreModel).starGiftDatas.forEach(d => {
            if (d.giftId == giftId) {
                let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
                if (cfg && cfg.event_type == 6) {
                    data = d;
                }
            }
        });
        if (!data) return 0;
        let cfg = ConfigManager.getItemById(Store_pushCfg, data.giftId);
        if (data.startTime + cfg.duration <= GlobalUtil.getServerTime() / 1000) return 3;
        if (data.remainNum <= 0) return 1;
        return 2;
    }

    /**
     * 专属英雄升星奖励是否全部领取
     * @returns 
     */
    static getAwakeStarUpFinish() {
        let info = ModelManager.get(ActivityModel).awakeStarUpGiftMap;
        if (!info) return false;
        for (let key in info) {
            if (!info[key] || info[key].awardList.indexOf(0) !== -1) {
                return false;
            }
        }
        return true;
    }

    /**开服登陆8天好礼 奖励是否领取完 */
    static getKfLoginRewardsFinish() {
        let m = ModelManager.get(ActivityModel);
        let cfgs = ConfigManager.getItems(Activity_land_giftsCfg);
        if (m.kfLoginDays && m.kfLoginDays >= cfgs[cfgs.length - 1].cycle) {
            if (m.kfLoginDaysReward.toString(2) == '1'.repeat(cfgs.length)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取平台配置
     * @param type 
     */
    static getPlatformConfigs(type?: number) {
        let sdk = iclib.SdkTool.tool;
        let pid = sdk.config.platform_id;
        let cid = sdk.userData['channelId'] || sdk.channelId;
        let cfgs = ConfigManager.getItems(Platform_activityCfg, c => {
            if (c.platform_id == pid && (type === void 0 || c.type == type)) {
                if (c.channel_id instanceof Array) {
                    return c.channel_id.indexOf(cid) >= 0;
                }
                else if (cc.js.isNumber(c.channel_id)) {
                    return c.channel_id == cid;
                }
                return true;
            }
            return false;
        });
        return cfgs;
    }
    static getPlatformConfig(type?: number) {
        return this.getPlatformConfigs(type)[0];
    }

    /**
     * 获得平台任务状态，1已领取,2待领取,0没完成
     * @param c 
     * @returns 
     */
    static getPlatformTaskStatue(c: Platform_activityCfg) {
        let model = ModelManager.get(ActivityModel);
        let status = c.args > 0 ? 0 : 2;
        model.platformTask.some(t => {
            if (t.missionId == c.id) {
                if (t.rewarded) {
                    // 奖励已经领取
                    status = 1;
                } else if (c.type == 5 && t.number >= 1) {
                    // 专属豪礼，只要number大于1就表示已经完成
                    status = 2;
                } else if (c.type == 9 && t.number >= 1) {
                    // 成长大礼，成长豪礼，只要number大于1就表示已经完成
                    status = 2;
                } else if (c.type == 10 && t.number >= 1) {
                    // 充值返利，只要number大于1就表示已经完成
                    status = 2;
                } else if (t.number >= c.args) {
                    // 已经完成，但没有领取奖励
                    status = 2;
                }
                return true;
            }
            return false;
        });
        return status;
    }

    //----------定制神装 task-----------//
    static initCostumeCustomTask() {
        this.costumeCustomTaskMap = {};
        let rewardType = ActUtil.getActRewardType(116);
        if (!rewardType) return;
        let cfgs = ConfigManager.getItemsByField(Costume_missionCfg, 'reward_type', rewardType);
        if (!cfgs || cfgs.length == 0) {
            let c = ConfigManager.getItems(Costume_missionCfg);
            cfgs = ConfigManager.getItemsByField(Costume_missionCfg, 'reward_type', c[c.length - 1].reward_type);
        }
        cfgs.forEach(c => {
            if (!this.costumeCustomTaskMap[c.theme]) this.costumeCustomTaskMap[c.theme] = [];
            this.costumeCustomTaskMap[c.theme].push(c);
        });
    }

    /**获取当前定制神装任务 */
    static getCurCostumeCustomTask(): Costume_missionCfg[] {
        if (Object.keys(this.costumeCustomTaskMap).length <= 0) {
            this.initCostumeCustomTask();
        }
        let rewardIds = ModelManager.get(TaskModel).rewardIds;
        let allCfgs = this.costumeCustomTaskMap;
        let curTask = [];
        for (let key in allCfgs) {
            let themeCfgs = allCfgs[key];
            if (themeCfgs.length == 1) { curTask.push(themeCfgs[0]); }
            else if (themeCfgs.length > 1) {
                for (let i = themeCfgs.length - 1; i >= 0; i--) {
                    let preCfg = ConfigManager.getItemById(Costume_missionCfg, themeCfgs[i].prev);
                    if (rewardIds[themeCfgs[i].task_id] == 1 || (preCfg && rewardIds[preCfg.task_id] == 1) || !preCfg) {
                        curTask.push(themeCfgs[i]);
                        break;
                    }
                }
            }
        }
        return curTask;
    }

    static checkActIsNew(c: MainInterface_mainCfg | MainInterface_sortCfg) {
        if (cc.js.isNumber(c.systemid) && JumpUtils.ifSysOpen(c.systemid)) {
            let sysCfg = ConfigManager.getItemById(SystemCfg, c.systemid);
            let localInfo = GlobalUtil.getLocal(`storage_${c.systemid}`, true) || null;
            let actCfgZeroT = sysCfg.activity ? TimerUtils.getZerohour(ActUtil.getActStartTime(sysCfg.activity) / 1000) : 0;
            //从未开启过
            if (!localInfo) {
                let obj = { showNewFlag: true, actCfgZeroT: actCfgZeroT };
                GlobalUtil.setLocal(`storage_${c.systemid}`, obj, true);
                return true;
            }
            //开启新的周期
            if (localInfo.actCfgZeroT !== actCfgZeroT) {
                let obj = { showNewFlag: true, actCfgZeroT: actCfgZeroT };
                GlobalUtil.setLocal(`storage_${c.systemid}`, obj, true);
                return true;
            }
            //当前周期 未点击活动图标过
            if (localInfo.showNewFlag) {
                return true;
            }
        }
        return false;
    }

    //判断活动海报是否打开
    static checkOpenPosterView() {
        let cfgs = ConfigManager.getItems(Common_carouselCfg);
        for (let i = 0, n = cfgs.length; i < n; i++) {
            let cfg = cfgs[i]
            if (JumpUtils.ifSysOpen(cfg.system) && cfg.show) {
                return true;
            }
        }
        return false;
    }

    /**判断超值购奖励是否全部领取 */
    static checkSuperValueVaild() {
        let info = this.actModel.superValueInfo;
        let num = 0;
        for (let key in info) {
            if (info[key] && info[key].isGain) {
                num += 1;
            }
        }
        return num >= 6;
    }
}