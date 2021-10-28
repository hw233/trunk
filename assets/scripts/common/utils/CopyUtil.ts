import {
    Copycup_prizeCfg,
    Copysurvival_strongCfg,
    Copyultimate_stageCfg, Copy_ruin_rewardCfg,
    Copy_stageCfg, Eternal_stageCfg,
    GuildbossCfg
} from '../../a/config';
import FriendModel, { FriendType } from '../../view/friend/model/FriendModel';
import InstanceModel from '../../view/instance/model/InstanceModel';
import TrialInfo from '../../view/instance/trial/model/TrialInfo';
import ConfigManager from '../managers/ConfigManager';
import ModelManager from '../managers/ModelManager';
import CopyModel, { CopyType } from '../models/CopyModel';
import RoleModel from '../models/RoleModel';
import { Copysurvival_stageCfg } from './../../a/config';
import GlobalUtil from './GlobalUtil';
import JumpUtils from './JumpUtils';
import RedPointUtils from './RedPointUtils';

/**
 * @Description: 副本工具Util
 * @Author: jijing.liu
 * @Date: 2019-05-29 10:02:55
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-02 12:18:48
 */

export default class CopyUtil {

    /**获取最新可进行的关卡id */
    static getLatelyEnterableStage(): number {
        let model = ModelManager.get(CopyModel);
        let stageId = model.latelyStageId;
        while (stageId) {
            if (this.isStageEnterable(stageId)) {
                break;
            }
            let cfg = ConfigManager.getItemById(Copy_stageCfg, stageId);
            stageId = cfg ? cfg.pre_condition : 0;
        }
        return stageId;
    }

    /**更新已过关关卡 */
    static stageComplete(stageId: number) {
        let model: CopyModel = ModelManager.get(CopyModel);
        let latelyStageId = model.latelyStageId;
        if (latelyStageId == stageId) {
            let cfgs = ConfigManager.getItems(Copy_stageCfg, { copy_id: 1 });
            cfgs.some(element => {
                if (element.pre_condition == stageId) {
                    model.latelyStageId = element.id;
                    return true;
                }
                return false;
            });
            // 更新当前挂机场景
            let cfg = ConfigManager.getItemById(Copy_stageCfg, latelyStageId);
            if (model.hangStageId == 0 || model.hangStageId == cfg.pre_condition) {
                model.hangStageId = cfg.id;
                //NetManager.send(new DungeonHangChooseReq({ stageId: cfg.id }));
            }
        }
        model.passStages[stageId] = true;
    }

    /** 关卡是否已解锁（前置关卡过关） */
    static isStageUnlock(stageId: number): boolean {
        let cfg = ConfigManager.getItemById(Copy_stageCfg, stageId);
        if (!cfg) return false;
        return cfg.pre_condition == 0 || this.isStagePassed(cfg.pre_condition);
    }

    /**关卡是否可进入（前置关卡过关，等级到达要求） */
    static isStageEnterable(stageId: number): boolean {
        let cfg = ConfigManager.getItemById(Copy_stageCfg, stageId);
        if (!cfg) return false;
        return CopyUtil.isStageUnlock(stageId) && (ModelManager.get(RoleModel).level >= cfg.player_lv);
    }

    /** 关卡是否已通过 */
    static isStagePassed(stageId: number): boolean {
        let model = ModelManager.get(CopyModel);
        return !!model.passStages[stageId];
    }

    /**判断是否可以自动进入关卡 */
    static isStageAutoEnterable(stageId: number): boolean {
        let cfg = ConfigManager.getItemById(Copy_stageCfg, stageId);
        if (!cfg) return false;
        return CopyUtil.isStageEnterable(stageId) && cfg.hangup_type == 0;
    }

    /**设置主线为当前关卡的下一关卡 */
    static toNextStage(stageId: number): boolean {
        let cfg = ConfigManager.getItemByField(Copy_stageCfg, 'pre_condition', stageId);
        if (cfg) {
            if (cfg.copy_id == CopyType.Trial) {
                if (ModelManager.get(RoleModel).level < cfg.player_lv) {
                    gdk.gui.showMessage('等级不够，无法进入下一关');
                    return false;
                }
                return true;
            }
            if (!this.isStageEnterable(cfg.id)) {
                if (cfg.player_lv >= 999) {//未开启的关卡
                    gdk.gui.showMessage('正在努力寻找敌人踪迹……');
                } else {
                    gdk.gui.showMessage('等级不够，无法进入下一关');
                }
                return false;
            }
            return true;
        } else {
            let temCfg = ConfigManager.getItemById(Copy_stageCfg, stageId);
            if (temCfg && temCfg.copy_id == 7) {
                return true;
            }
        }
        return false;
    }

    static getChapterId(stageId: number): number {
        return Math.floor((stageId % 10000) / 100);
    }

    static getSectionId(stageId: number): number {
        return stageId % 100;
    }

    //判断是否为没开启的新章节
    static isNewChapter(stageId: number): boolean {
        let sid = this.getSectionId(stageId);
        if (sid == 1 && this.isStageEnterable(stageId)) {
            return GlobalUtil.getCookie('openNewChapter') != this.getChapterId(stageId);
        }
        return false;
    }


    //判断当前精英副本是否通过
    static isEliteStagePassed(stageId: number) {
        let model = ModelManager.get(CopyModel);
        let chapterId = this.getChapterId(stageId)
        let passId = model.eliteStageData[chapterId - 1] ? model.eliteStageData[chapterId - 1] : 0;
        return stageId <= passId;
    }

    //判断当前的精英副本章节是否开启
    static isOpenEliteStageChapter(ChapterId: number, curIndex: number = 0): boolean {
        let res = false
        if (ChapterId == 0) return false;
        let model = ModelManager.get(CopyModel);
        let tem = curIndex == 0 ? model.eliteNovice : model.eliteChallenge;
        let data = []
        tem.sort((a: icmsg.DungeonElitesStage, b: icmsg.DungeonElitesStage) => {
            return a.stageId - b.stageId
        })
        tem.forEach(stageData => {
            let temChap = this.getChapterId(stageData.stageId)
            if (ChapterId == temChap) {
                data.push(stageData);
            }
        })
        if (data.length > 0) {
            res = true;
        } else {
            let copy_id = curIndex == 0 ? 12 : 13;
            let datas = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                if (item.copy_id == copy_id && this.getChapterId(item.id) == ChapterId) {
                    return true;
                }
                return false;
            });
            if (datas.length > 0) {
                let cfg = ConfigManager.getItemById(Copy_stageCfg, datas[0].main_condition);
                if (cfg.copy_id != 1) {
                    CC_DEBUG && cc.log('精英副本前置关卡有问题，精英副本ID：' + datas[0].id + '----前置id：' + datas[0].pre_condition)
                }
                if (this.isStagePassed(datas[0].main_condition)) {
                    //res = true;
                    let stageId = datas[0].pre_condition
                    if (cc.js.isNumber(stageId)) {
                        tem.forEach(stageData => {
                            if (stageData.stageId == stageId) {
                                res = true;
                            }
                        })
                    } else {
                        res = true;
                    }
                }
            }
        }
        return res;
    }

    //获取当前章节奖杯副本的获得的奖杯数和总奖杯数
    static getEliteStageCurChaterData(ChapterId: number, curIndex: number = 0): number[] {
        let data: number[] = []
        let model = ModelManager.get(CopyModel);
        let cfgs = curIndex == 0 ? model.eliteNoviceCfgs : model.eliteChallengeCfgs;
        let curNum = 0;
        let allNum = 0;
        cfgs.forEach(cfg => {
            if (cfg.prize == ChapterId) {
                allNum += 3;
            }
        })
        if (curIndex == 0) {
            model.eliteNovice.forEach(data => {
                let temChap = this.getChapterId(data.stageId)
                if (temChap == ChapterId) {
                    curNum += data.cups
                }
            })
        } else {
            model.eliteChallenge.forEach(data => {
                let temChap = this.getChapterId(data.stageId)
                if (temChap == ChapterId) {
                    curNum += data.cups
                }
            })
        }

        data.push(curNum);
        data.push(allNum);
        return data;
    }

    /**
     * 判断当前新手模式是否全部通关并且已经全部领取了奖杯奖励
     */
    static getEliteStageCurCupReward(): boolean {
        if (JumpUtils.ifSysOpen(RedPointUtils.get_copy_open_lv(12), false)) {

            let prizeList = []
            let model = ModelManager.get(CopyModel);
            let cfgs = model.eliteNoviceCfgs;

            for (let i = 0; i < cfgs.length; i++) {
                if (prizeList.indexOf(cfgs[i].prize) == -1) {
                    prizeList.push(cfgs[i].prize)
                }
            }
            for (let i = 0; i < prizeList.length; i++) {
                if (CopyUtil.isOpenEliteStageChapter(prizeList[i], 0)) {
                    let nums = CopyUtil.getEliteStageCurChaterData(prizeList[i], 0)
                    let temCfgs = ConfigManager.getItems(Copycup_prizeCfg, { 'copy_id': 12, 'chapter': prizeList[i] })
                    let bit: number[] = model.eliteNoviceBits
                    for (let j = 0; j < temCfgs.length; j++) {
                        let cfg = temCfgs[j];
                        let lock = (j + 1) * 3 > nums[0];
                        let over = false;
                        let old = bit[Math.floor((cfg.id - 1) / 8)];
                        if ((old & 1 << (cfg.id - 1) % 8) >= 1) over = true;
                        if (lock) {
                            return false;
                        } else if (!lock && !over) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
            return true;

        }
        return false
    }

    /**
    * 获取奖杯副本已经通关关卡获得的奖杯数
    */
    static getEliteStageCupNum(stageId: number, type: number) {
        let data = [];
        let model = ModelManager.get(CopyModel);
        let tem = type == 0 ? model.eliteNovice : model.eliteChallenge;
        let cup = 0;
        tem.forEach(stageData => {
            //let temChap = this.getChapterId(stageData.stageId)
            if (stageId == stageData.stageId) {
                cup = stageData.cups;
            }
        })
        return cup
    }


    /**
     * 返回触发 开启精英关卡的 普通关卡id
     */
    static getEliteStagePreChapters(): number[] {
        let cfgs = ModelManager.get(CopyModel).eliteStageCfgs;
        let chapters: number[] = [];
        cfgs.forEach(cfg => {
            if (CopyUtil.getSectionId(cfg.id) == 1) {
                chapters.push(cfg.pre_condition);
            }
        });
        return chapters;
    }

    /**是否已领取通关奖励 */
    static isGetElitePassReward(prizeId): boolean {
        let model = ModelManager.get(CopyModel);
        let str = model.eliteRewardState.toString(2)
        let ids = str.split("").reverse()
        return !ids[prizeId - 1] || (ids[prizeId - 1] && ids[prizeId - 1] == "0")
    }

    /**通过id获得关卡静态配置 */
    static getStageConfig(id: number): Copy_stageCfg {
        let ret: any;
        if (id > 5000000) {
            //copyultimate 表中定义的副本
            ret = ConfigManager.getItemById(Copyultimate_stageCfg, id);
        } else if (id > 4000000) {
            // guildboss表中定义的副本
            ret = ConfigManager.getItemById(GuildbossCfg, id);
        } else if (id > 3000000) {
            // eternal表中定义的副本
            ret = ConfigManager.getItemById(Eternal_stageCfg, id);
        }
        //  else if (id > 2000000) {
        //     // activitycave表中定义的副本
        //     ret = ConfigManager.getItemById(Activitycave_stageCfg, id);
        // }
        else if (id > 1000000) {
            // copysurival 表中定义的副本
            ret = ConfigManager.getItemById(Copysurvival_stageCfg, id);
        } else {
            // copy表中定义的副本
            ret = ConfigManager.getItemById(Copy_stageCfg, id);
        }
        return ret;
    }

    /**通过位置获得生存副本英雄的装备列表 */
    static getSurvivalHeroEquipsBy(): icmsg.SurvivalEquipInfo[] {
        let model = ModelManager.get(CopyModel);
        let equips: icmsg.SurvivalEquipInfo[] = model.survivalStateMsg.equips;
        return equips || [];
    }

    /**生存副本可购买装备升级 */
    static isCanUpgradeSurvivalEquip() {
        let model = ModelManager.get(CopyModel);
        return model.survivalStateMsg && !model.survivalStateMsg.lastBuy;
    }

    /**生存副本当前刷新装备花费 */
    static getSurvivalHeroEquipChange(): number {
        let count = this.getSurvivalHeroEquipCount();
        let cfg = ConfigManager.getItemById(Copysurvival_strongCfg, count + 1);
        if (cfg) {
            return cfg.change;
        }
        return Number.MAX_SAFE_INTEGER;
    }

    /**生存副本获取所有或指定英雄的强化次数 */
    static getSurvivalHeroEquipCount(): number {
        let count = 0;
        let model = ModelManager.get(CopyModel);
        model.survivalStateMsg.equips.forEach(e => count += e.equipLv);
        return count;
    }

    /**生存副本购买的装备技能id的等级 */
    static getSurvivalHeroEquipLv(equipId: number): number {
        let equips = this.getSurvivalHeroEquipsBy();
        for (let i = 0, n = equips.length; i < n; i++) {
            if (equips[i].equipId == equipId) {
                return equips[i].equipLv;
            }
        }
        return 0;
    }

    /**生存副本最高通过记录stageId */
    static getSurvivalLastStageId(): number {
        let model = ModelManager.get(CopyModel);
        if (model.survivalStateMsg) {
            return model.survivalStateMsg.stageId;
        }
        return 0;
    }

    /**根据章节id获取同进度的好友列表 */
    static getFriendListByChapter(chapter: number) {
        let list: FriendType[] = [];
        let friendInfos = ModelManager.get(FriendModel).friendInfos;
        friendInfos.forEach(info => {
            if (info.mainLine) {
                if (CopyUtil.getChapterId(info.mainLine) == chapter) {
                    list.push(info);
                }
            }
        });
        return list;
    }

    /**
     * 是否通过某个副本
     * @param id 
     */
    static isFbPassedById(id: number) {
        let cfg = this.getStageConfig(id);
        let b: boolean = false;
        if (cfg.copy_id == CopyType.MAIN) {
            b = this.isStagePassed(id);
        } else if (cfg.copy_id == CopyType.Rune) {
            let model = ModelManager.get(InstanceModel);
            b = model.runeInfo && model.runeInfo.maxStageId >= id;
        } else if (cfg.copy_id == CopyType.Trial) {
            let model = ModelManager.get(TrialInfo);
            b = model.lastStageId >= id;
        }
        return b;
    }

    //--------------------末日废墟--------------------
    static getEndRuinCopyChapterStages(chapter: number): Copy_stageCfg[] {
        let res = []
        let model = ModelManager.get(CopyModel);
        let allStages = model.endRuinCfgs;
        allStages.forEach(cfg => {
            if (cfg.prize == chapter) {
                res.push(cfg);
            }
        })
        return res;
    }

    //获取末日废墟关卡状态 0 未开启 1 已经通关 2 可挑战 ， 星星个数
    static getEndRuinStageState(stageId: number): number[] {
        let model = ModelManager.get(CopyModel);
        let res = [0, 0];
        if (stageId <= model.endRuinStateData.maxStageId) {
            res[0] = 1
            if (model.endRuinStageData['' + stageId]) {
                let tem = model.endRuinStageData['' + stageId];
                let star = 0;
                for (let i = 0; i <= 2; i++) {
                    if ((tem & 1 << i) >= 1) {
                        star += 1;
                    }
                }
                res[1] = star
            }
        } else if (stageId == model.endRuinStateData.maxStageId + 1) {
            res = [2, 0];
        } else if (model.endRuinStateData.maxStageId == 0 && stageId == model.endRuinCfgs[0].id) {
            res = [2, 0];
        }
        return res;
    }

    //获取末日废墟章节总星星数
    static getEndRuinChapterAllStarNum(chapterId: number): number[] {
        let res: number[] = [0, 0];
        let cfgs = this.getEndRuinCopyChapterStages(chapterId);
        res[1] = cfgs.length * 3;
        cfgs.forEach(cfg => {
            let nums = this.getEndRuinStageState(cfg.id);
            if (nums[0] == 1) {
                res[0] += nums[1];
            }
        })
        return res;
    }
    //获取末日废墟章节总星星数
    static getEndRuinAllStarNum(): number {
        let res: number = 0;

        return res;
    }
    //获取末日废墟章节星星数奖励领取状态
    static getEndRuinChapterStarRewardState(chapterId: number, starNum: number): boolean {
        let res = false;
        let cfg = ConfigManager.getItemByField(Copy_ruin_rewardCfg, 'chapter', chapterId, { star: starNum });
        if (cfg) {
            let model = ModelManager.get(CopyModel);
            model.endRuinStateData.chapterReward.forEach(data => {
                if (data.chapter == chapterId) {
                    let reward = data.reward;
                    let old = reward[Math.floor((cfg.star - 1) / 8)];
                    if (((old & 1 << (cfg.star - 1) % 8) >= 1)) {
                        res = true;
                    }
                }
            })
        }
        return res
    }

    static getEndRuinChapterPlayerInfo(chapterId: number): icmsg.RuinChapter {
        let model = ModelManager.get(CopyModel);
        let res = null;
        model.endRuinStateData.chapters.forEach(data => {
            if (data.chapter == chapterId) {
                res = data;
            }
        })
        return res;
    }
    //判断是否是章节守护者
    static getIsEndRuinChapterPlayer(): boolean {
        let model = ModelManager.get(CopyModel);
        let roleMode = ModelManager.get(RoleModel);
        let res = false;
        model.endRuinStateData.chapters.forEach(data => {
            if (data.player.id == roleMode.id) {
                res = true;;
            }
        })
        return res;
    }

}