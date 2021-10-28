import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from './GlobalUtil';
import ModelManager from '../managers/ModelManager';
import RoleModel from '../models/RoleModel';
import ServerModel from '../models/ServerModel';
import StoreModel from '../../view/store/model/StoreModel';
import {
    Gift_powerCfg,
    Store_awakeCfg,
    Store_pushCfg,
    Unique_globalCfg
    } from '../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-05-12 17:40:07 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



export default class StoreUtils {

    /**
     * 根据事件触发次数返回满足开启条件的定向推送礼包cfgs
     * @param e 
     */
    public static getStorePushCfgByEvent(e: icmsg.StorePushEvent) {
        let cfgs = ConfigManager.getItems(Store_pushCfg);
        let c: Store_pushCfg[] = [];
        let allOpenConds = [];
        cfgs.forEach(cfg => {
            for (let i = 0; i < cfg.open_conds.length; i++) {
                if (cfg.open_conds[i][0] == e.event) {
                    allOpenConds.push(cfg.open_conds[i][1]);
                    if (cfg.open_conds[i][1] <= e.num) {
                        c.push(cfg);
                    }
                }
            }
        });

        if (allOpenConds.indexOf(e.num) != -1) return c;
        else return [];
    }

    /**
     * 获取当前因为事件e触发的 定向推送礼包cfg
     * @param e 触发事件
     */
    public static getStorePushCfgTriggerByEvent(e: icmsg.StorePushEvent) {
        let cfgs = this.getStorePushCfgByEvent(e);
        let model = ModelManager.get(StoreModel);
        let ids = [];
        model.pushGiftList.forEach(item => {
            ids.push(item.id);
        });
        for (let i = 0; i < cfgs.length; i++) {
            if (ids.indexOf(cfgs[i].gift_id) != -1) continue;
            if (e.event == cfgs[i].close_cond[0] && e.num <= cfgs[i].close_cond[1]) {
                return cfgs[i];
            }
        }
        return null
    }

    /**
     * 缓存中读取有效礼包cfg
     */
    public static getVailedPushGiftCfgByLocal() {
        let l = GlobalUtil.getLocal(`gift_start_time`);
        let model = ModelManager.get(StoreModel);
        let serverTime = ModelManager.get(ServerModel).serverTime;
        let startTime = l ? l.startTime : serverTime;
        let cfg;
        if (l) {
            cfg = ConfigManager.getItemByField(Store_pushCfg, 'gift_id', l.id);
        }
        else {
            let e = model.storePushEvents;
            if (e && e.length > 0) {
                cfg = this.getStorePushCfgTriggerByEvent(e[0]);
            }
            else {
                return null;
            }
        }
        let ids = [];
        model.pushGiftList.forEach(item => {
            ids.push(item.id);
        });

        if (cfg && (serverTime - parseInt(startTime)) / 1000 < cfg.duration && ids.indexOf(cfg.gift_id) == -1) {
            GlobalUtil.setLocal(`gift_start_time`, { id: cfg.gift_id, startTime: startTime });
            return cfg;
        }
        else {
            return null;
        }
    }

    // /**
    //  * 更新通行证奖励领取位图
    //  * @param id 
    //  * @param type 1-免费 2-购买通行证后解锁的奖励
    //  */
    // static updatePassPortReward(id: number, type: number) {
    //     let model = ModelManager.get(StoreModel);
    //     let idx = id % 10000;
    //     let reward = type == 1 ? model.passPortFreeReward : model.passPortChargeReward;
    //     let old = reward[Math.floor(idx / 8)];
    //     old |= 1 << idx;
    //     if (!reward[Math.floor(idx / 8)]) {
    //         while (reward.length < Math.floor(idx / 8)) {
    //             reward.push(0);
    //         }
    //         reward.push(old);
    //     }
    //     else reward[Math.floor(idx / 8)] = old;
    // }

    /**
     * 获取通行证奖励是否领取
     * @param id 
     * @param type 
     */
    static getPassPortRewardState(id: number, type: number) {
        let model = ModelManager.get(StoreModel);
        let idx = id % 100;
        let reward = type == 1 ? model.passPortFreeReward : model.passPortChargeReward;
        let old = reward[Math.floor(idx / 8)];
        if ((old & 1 << idx % 8) >= 1) return true;
        else return false
    }

    /**
     * 获取成长基金奖励是否领取
     * @param id 
     */
    static getGrowthFundsRewardState(id: number) {
        let model = ModelManager.get(StoreModel);
        let idx = id;
        let reward = model.growthFundsReward;
        let old = reward[Math.floor(idx / 8)];
        if ((old & 1 << idx % 8) >= 1) return true;
        else return false;
    }

    /**
     * 获取试练塔基金奖励是否领取
     * @param id 
     */
    static getTowerFundsRewardState(id: number) {
        let model = ModelManager.get(StoreModel);
        let idx = id;
        let reward = model.towerFundsReward;
        let old = reward[Math.floor(idx / 8)];
        if ((old & 1 << idx % 8) >= 1) return true;
        else return false;
    }

    /**
     * 获取一元战力礼包奖励是否领取
     */
    static getOneDollarGiftRewardState(idx: number) {
        let model = ModelManager.get(StoreModel);
        if (!model.isBuyOneDollarGift) return false;
        return (model.oneDollarGiftReward & 1 << idx) > 1;
    }

    /**
     * 一元礼包奖励是否已全部领取
     */
    static isAllRewardRecivedInOneDollarGiftView(): boolean {
        let model = ModelManager.get(StoreModel);
        if (!model.isBuyOneDollarGift) return false;
        let cfgs = ConfigManager.getItems(Gift_powerCfg);
        for (let i = 0; i < cfgs.length; i++) {
            if (!this.getOneDollarGiftRewardState(cfgs[i].index)) return false;
        }
        return true;
    }

    /**更新七日狂欢商店商品购买次数 */
    static updateSevenStoreInfo(id: number) {
        let model = ModelManager.get(StoreModel);
        if (!model.sevenStoreInfo) model.sevenStoreInfo = {};
        if (!model.sevenStoreInfo[id]) model.sevenStoreInfo[id] = 0;
        model.sevenStoreInfo[id] += 1;
    }

    /**获取商城礼包购买记录 */
    static getStoreGiftBuyInfo(id: number): icmsg.StoreBuyInfo {
        let list = ModelManager.get(StoreModel).giftBuyList;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == id) return list[i];
        }
        return null;
    }

    /**
     * 获取特惠周卡奖励是否领取
     * @param id 
     * @param type 
     */
    static getWeeklyRewardState(id: number, type: number) {
        let model = ModelManager.get(StoreModel);
        let idx = (id % 7 || 7) - 1;
        let reward = type == 1 ? model.weeklyPassPortReward1 : model.weeklyPassPortReward2;
        if ((reward & 1 << idx % 8) >= 1) return true;
        else return false
    }

    /**
     * 英雄礼包详情 0-未激活或已过期 1-可购买 2-全部购买或已过期
     * @param hero 
     * @param awakwLv 
     * @returns 
     */
    static getHeroAwakeGiftState(hero, awakwLv?) {
        let cfgs = ConfigManager.getItems(Store_awakeCfg, (cfg: Store_awakeCfg) => {
            if (cfg.hero == hero && (!awakwLv || cfg.awake_lv == awakwLv)) {
                return true;
            }
        });
        let info = ModelManager.get(StoreModel).heroAwakeGiftMap[hero];
        if (!info) return 0;
        let time = GlobalUtil.getServerTime();
        for (let i = 0; i < cfgs.length; i++) {
            let d = info[cfgs[i].gift_id];
            if (d && d.count < cfgs[i].buy_limit && d.outTime * 1000 > time) {
                return 1;
            }
        }
        return 2;
    }

    static uniqueStoreOpenState() {
        let rM = ModelManager.get(RoleModel);
        let v = ConfigManager.getItemByField(Unique_globalCfg, 'key', 'uniquestore_unlock').value;
        if (rM.maxHeroStar < v[0] && rM.level < v[1]) {
            return false;
        }
        return true;
    }
}
