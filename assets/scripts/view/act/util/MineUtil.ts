import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import MineModel, { MineTansuoData } from '../model/MineModel';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import {
    Activitycave_exchangeCfg,
    Activitycave_giftCfg,
    Activitycave_privilegeCfg,
    Activitycave_stageCfg,
    Activitycave_tansuoCfg
    } from '../../../a/config';

/** 
 * @Description: 矿洞副本处理工具
 * @Author: yaozu.hu  
 * @Date: 2019-03-27 16:57:13 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-08-27 13:46:18
 */
export default class MineUtil {

    //判断当前章节的探索状态
    static getCurPrizeTansuoState(prizeId: number): MineTansuoData {
        let model = ModelManager.get(MineModel);
        let state = false;
        let startTime = 0;
        let team = model.curCaveSstate.team
        if (team && team.length > 0) {
            for (let i = 0; i < team.length; i++) {
                if (team[i].chapterId == prizeId) {
                    state = true;
                    startTime = team[i].startTime;
                }
            }
        }

        let res: MineTansuoData = {
            tansuoState: state,
            startTime: startTime
        }
        return res;
    }

    //获取当前的章节数
    static getCurStagePrizeClearance(): number {
        let model = ModelManager.get(MineModel);
        let curStageId = model.curCaveSstate.stageId
        if (curStageId <= 0) {
            return 1;
        } else {
            let curCfg = ConfigManager.getItemById(Activitycave_stageCfg, curStageId);
            let cfgs = ConfigManager.getItems(Activitycave_stageCfg, (item: Activitycave_stageCfg) => {
                if (item.prize == curCfg.prize) {
                    return true;
                }
                return false;
            })
            if (cfgs[cfgs.length - 1].id == curStageId) {
                return curCfg.prize + 1;
            } else {
                return curCfg.prize;
            }
        }
    }

    //判断派系消耗的天赋点数
    static getCurGiftTotalNum(page: number): number {
        let res = 0;
        let model = ModelManager.get(MineModel);
        let curGifts = model.curCaveSstate.gift
        curGifts.forEach(gift => {
            let pageNum = Math.floor(gift.giftId / 1000)
            if (pageNum == page) {
                let cfg = ConfigManager.getItemByField(Activitycave_giftCfg, 'gift', gift.giftId);
                res += cfg.cost * gift.level;
            }
        })
        return res;
    }

    //获取当前天赋的等级
    static getCurGiftItemLockState(id: number): number {
        let lv = -1;
        let model = ModelManager.get(MineModel);
        let curGifts = model.curCaveSstate.gift
        if (curGifts.length > 0) {
            model.curCaveSstate.gift.forEach(gift => {
                if (gift.giftId == id) {
                    lv = gift.level;
                }
            })
        }
        if (lv < 0) {
            let cfg = ConfigManager.getItemByField(Activitycave_giftCfg, 'gift', id);
            let totalNum = this.getCurGiftTotalNum(cfg.page);
            if (cfg.pre_gift.length == 0 && cfg.total_gift == 0) {
                lv = 0;
            } else {
                let isOk = true;
                if (cfg.total_gift <= totalNum) {
                    cfg.pre_gift.forEach(element => {
                        let have = false;
                        curGifts.forEach(gift => {
                            if (gift.giftId == element[0] && element[1] <= gift.level) {
                                have = true;
                            }
                        })
                        if (!have && isOk) isOk = false;
                    });
                } else {
                    isOk = false;
                }
                if (isOk) lv = 0;
            }
        }
        return lv;
    }

    //获取当前剩余的天赋点数
    static getCurGiftNum(): number {
        let num = 0;
        let model = ModelManager.get(MineModel);
        let cfgs = ConfigManager.getItems(Activitycave_stageCfg, (item: Activitycave_stageCfg) => {
            if (item.id <= model.curCaveSstate.stageId) {
                return true;
            }
            return false;
        })
        cfgs.forEach(cfg => {
            num += cfg.gift
        })
        model.curCaveSstate.gift.forEach(date => {
            let cfg = ConfigManager.getItemByField(Activitycave_giftCfg, 'gift', date.giftId);
            num -= cfg.cost * date.level;
        })
        num = Math.max(0, num)
        return num;
    }

    //获取物品兑换的次数
    static getExChangeItemTimes(exChangeId: number): number {
        let res = 0
        let model = ModelManager.get(MineModel);
        model.curCaveSstate.exchange.forEach(data => {
            if (data.exchangeId == exChangeId) {
                res = data.times;
            }
        })
        return res
    }

    //获取探索已经上阵的英雄ID
    static getTansuoUpHeroIdList(): number[] {
        let res = []
        let model = ModelManager.get(MineModel);
        if (model.curCaveSstate.team.length > 0) {
            model.curCaveSstate.team.forEach(teamData => {
                if (teamData.heroIds.length > 0) {
                    res = res.concat(teamData.heroIds);
                }
            })
        }
        return res;
    }

    //获取通行证奖励是否领取
    static getMinePassRewardState(type: number, id: number) {
        let model = ModelManager.get(MineModel);

        let reward = type == 1 ? model.passReward1 : model.passReward2;
        let old = reward[Math.floor((id - 1) / 8)];
        if ((old & 1 << (id - 1) % 8) >= 1) return true;
        else return false
    }

    static getMineRedPoint(): boolean {
        let res = false;

        return res;
    }

    //判断当前是否有可以探索的章节或者可领取奖励的探索章节
    static getHaveTansuoState(): boolean {
        let res = false;
        let model = ModelManager.get(MineModel);
        //判断是否有可以领取奖励的章节
        if (model.curCaveSstate.team.length > 0) {
            let have = false;
            model.curCaveSstate.team.forEach(data => {
                if (data.chapterId > 0) {
                    let cfg = ConfigManager.getItemById(Activitycave_tansuoCfg, data.chapterId);
                    let endTime = data.startTime + cfg.cost * 60;
                    let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
                    if (nowTime >= endTime) {
                        have = true;
                    }
                }
            })
            if (have) res = true;
        }
        //判断是否有可以探索的章节
        if (!res) {
            let curStageId = model.curCaveSstate.stageId
            let nextCfg = ConfigManager.getItem(Activitycave_stageCfg, (item: Activitycave_stageCfg) => {
                if (item.id > curStageId) {
                    return true;
                }
                return false;
            })
            if (!nextCfg) {
                nextCfg = ConfigManager.getItemById(Activitycave_stageCfg, curStageId)
            }
            let prize = nextCfg.prize;
            let num = model.curCaveSstate.buyTeam;
            if (nextCfg) {
                num += nextCfg.team;
            }
            let curNum = model.curCaveSstate.team.length;
            if (num > curNum && (prize - 1) > curNum) {
                res = true;
            }
        }
        return res;
    }

    //判断是否有通行证奖励可以领取
    static getHavePassReward(): boolean {
        let res = false;
        let model = ModelManager.get(MineModel);
        let sorce = ModelManager.get(RoleModel).acpe;
        let cfgs = ConfigManager.getItems(Activitycave_privilegeCfg);
        for (let i = 0; i < cfgs.length - 1; i++) {
            let cfg = cfgs[i]
            let tem1 = this.getMinePassRewardState(1, cfg.id);
            let tem2 = model.passBoight ? this.getMinePassRewardState(2, cfg.id) : true;
            if (sorce >= cfg.exp[1] && (!tem1 || !tem2)) {
                res = true;
                break;
            }
        }
        return res;
    }

    //判断是否有可兑换的物品
    static getHaveExChangeItem(): boolean {
        let res = false;
        let model = ModelManager.get(MineModel);
        if (model.exChangeOpen) return false;
        let stageId = model.curCaveSstate.stageId;
        if (stageId > 0) {
            let cfg = ConfigManager.getItemById(Activitycave_stageCfg, stageId);
            if (cfg) {
                let exCfgs: Activitycave_exchangeCfg[] = [];
                for (let i = 1; i <= cfg.page; i++) {
                    let cfgs = ConfigManager.getItemsByField(Activitycave_exchangeCfg, 'page', i);
                    exCfgs = exCfgs.concat(cfgs);
                }

                for (let j = 0; j < exCfgs.length; j++) {
                    let canExChange = true;
                    for (let i = 1; i <= 3; i++) {
                        if (exCfgs[j]['item' + i].length > 0) {

                            let itemId = exCfgs[j]['item' + i][0]
                            let itemNum = exCfgs[j]['item' + i][1]

                            let curNum = BagUtils.getItemNumById(itemId);
                            if (curNum < itemNum) {
                                canExChange = false;
                            }
                        }
                    }
                    //判断是否达到上限
                    let times = MineUtil.getExChangeItemTimes(exCfgs[j].id);
                    if (times >= exCfgs[j].times) {
                        canExChange = false;
                    }
                    if (canExChange) {
                        res = true;
                        break;
                    }
                }

            }
        }
        return res;
    }
}
