import ActivityModel from '../../view/act/model/ActivityModel';
import ActivityUtils from './ActivityUtils';
import BagUtils from './BagUtils';
import BYModel from '../../view/bingying/model/BYModel';
import ConfigManager from '../managers/ConfigManager';
import ErrorManager from '../managers/ErrorManager';
import GlobalUtil from './GlobalUtil';
import HeroModel, { hero_lock_model } from '../models/HeroModel';
import MercenaryModel from '../../view/mercenary/model/MercenaryModel';
import ModelManager from '../managers/ModelManager';
import NetManager from '../managers/NetManager';
import PanelId from '../../configs/ids/PanelId';
import ResonatingModel from '../../view/resonating/model/ResonatingModel';
import ResonatingUtils from '../../view/resonating/utils/ResonatingUtils';
import RoleModel from '../models/RoleModel';
import ServerModel from '../models/ServerModel';
import StringUtils from './StringUtils';
import { BagItem, BagType } from '../models/BagModel';
import { ChatChannel } from '../../view/chat/enum/ChatChannel';
import {
    Comments_globalCfg,
    Copy_assistCfg,
    Copycup_heroCfg,
    GeneralCfg,
    Hero_awakeCfg,
    Hero_careerCfg,
    Hero_growCfg,
    Hero_starCfg,
    Hero_undersand_levelCfg,
    HeroCfg,
    Pve_demo2Cfg,
    SkillCfg
    } from '../../a/config';
import { HBAttrBase } from '../../view/lottery/ctrl/HeroDetailViewCtrl';
import { LotteryEventId } from '../../view/lottery/enum/LotteryEventId';
import { RoleEventId } from '../../view/role/enum/RoleEventId';


/**成长等级对应的阶级文字 */
export const StageText = [
    { color: "#ffffff", text: "S" },
    { color: "#ffffff", text: "A" },
    { color: "#ffffff", text: "B" },
    { color: "#ffffff", text: "C" },
    { color: "#ffffff", text: "D" },
]

/**英雄的成长等级key值
 * ps:勿修改顺序
 */
export const StageKeys = [
    "grow_hp",  // 生命
    "atk_speed",// 出手顺序
    "grow_atk", // 攻击
    "grow_def", // 防御
    "grow_hit", // 命中
    "grow_dodge",//闪避
]

export type UnlockSkillType = {
    skillId: number,
    skillLv?: number,
    careerId?: number,
    unlockLv?: number,
}
/**
 * @Description: 装备工具类
 * @Author: weiliang.huang
 * @Date: 2019-04-10 10:17:20
 * @Last Modified by: weiliang.huang
 * @Last Modified time: 2019-04-12 11:44:47
 */
export default class HeroUtils {

    static get model(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    static get roleModel(): RoleModel {
        return ModelManager.get(RoleModel)
    }

    static get serverModel(): ServerModel { return ModelManager.get(ServerModel); }

    static maxHeroMastery: any = {} // 英雄最大专精等级

    static maxMasteryLv: any = {}    // 专精最大等级

    /**获取装备数据 */
    static getHeroItems(): Array<BagItem> {
        return this.model.heroInfos
    }

    /**获得英雄背包数据 */
    static getHeroItemById(id: number): BagItem {
        let list = this.model.heroInfos
        for (let i = 0; i < list.length; i++) {
            let item: BagItem = list[i]
            if (item.itemId == id) {
                return item
            }
        }
    }
    /**获得英雄背包数据 */
    static getHeroItemByHeroId(id: number): BagItem {
        // let list = this.model.heroInfos
        // for (let i = 0; i < list.length; i++) {
        //     let item: BagItem = list[i]
        //     if (list[i].series == id) {
        //         return item;
        //     }
        // }
        return this.getHeroInfoBySeries(id);
    }

    /**获得英雄的信息 */
    static getHeroInfoById(id: number): icmsg.HeroInfo {
        let list = this.model.heroInfos
        let info = null
        for (let i = 0; i < list.length; i++) {
            if (list[i].itemId == id) {
                info = list[i].extInfo
                break
            }
        }
        return info
    }


    /**设置英雄公会据点战状态 */
    static setHeroInfoSthFighted(id: number, v: boolean) {
        // let list = this.model.heroInfos
        // let info: icmsg.HeroInfo = null
        // for (let i = 0; i < list.length; i++) {
        //     if (list[i].series == id) {
        //         info = <icmsg.HeroInfo>list[i].extInfo
        //         info.sthFighted = v
        //         break
        //     }
        // }
        let item = this.getHeroInfoBySeries(id);
        if (item) {
            let info = item.extInfo as icmsg.HeroInfo;
            info.sthFighted = v;
        }
    }

    /**获得英雄的信息 */
    static getHeroInfoByHeroId(id: number): icmsg.HeroInfo {
        // let list = this.model.heroInfos
        // let info = null
        // for (let i = 0; i < list.length; i++) {
        //     if (list[i].series == id) {
        //         info = list[i].extInfo
        //         break
        //     }
        // }
        // return info
        let item = this.getHeroInfoBySeries(id);
        if (item) {
            return item.extInfo as icmsg.HeroInfo;
        }
        return null;
    }

    /**获得英雄当前的职业信息*/
    static getHeroCareerById(id: number) {
        let list = this.model.heroInfos
        let item: BagItem;
        for (let i = 0; i < list.length; i++) {
            if (list[i].itemId == id) {
                item = list[i];
                break;
            }
        }
        if (!item) {
            return;
        }
        let extInfo: icmsg.HeroInfo = item.extInfo as icmsg.HeroInfo;
        let careerId = extInfo.careerId;
        return careerId
    }

    /**获取英雄属性数据
     * @param series 英雄识别id
     */
    static getHeroAttrById(series: number): icmsg.HeroAttr {
        let heroAttrs = this.model.heroAttrs
        return heroAttrs[series]
    }

    /**获取英雄详细数据
     * @param series 英雄识别id
     */
    static getHeroDetailById(series: number): icmsg.HeroDetail {
        let heroDeatils = this.model.heroDeatils
        return heroDeatils[series]
    }

    /**根据识别id获取英雄背包数据
     * @param series 英雄识别id
     */
    static getHeroInfoBySeries(series: number): BagItem {
        let idItems = HeroUtils.model.idItems
        return idItems[series]
    }

    /**判断英雄是否拥有某个技能 */
    static heroHasSkill(heroId: number, skillId: number): boolean {
        let flag = false
        let detail = HeroUtils.getHeroDetailById(heroId)
        if (detail) {
            let skills = detail.skills
            for (let index = 0; index < skills.length; index++) {
                if (skills[index] == skillId) {
                    flag = true
                    break
                }
            }
        }
        return flag
    }

    /**
     * 更新某个道具
     * @param id 英雄id
     * @param extInfo 额外信息
     * @param refresh 是否刷新排序并派发事件
     */
    static updateHeroInfo(id: number, extInfo: icmsg.HeroInfo, refresh: boolean = true) {
        let idItems = this.model.idItems
        let heroInfos = this.model.heroInfos
        if (!idItems[id]) {
            let item: BagItem = {
                series: id,
                itemNum: 1,
                itemId: extInfo.typeId,
                type: BagType.HERO,
                extInfo: extInfo
            }
            heroInfos.push(item)
            let herosByLv = this.model.heroNumByLv
            if (!(extInfo.level in herosByLv)) {
                herosByLv[extInfo.level] = 0;
            }
            herosByLv[extInfo.level]++;
            idItems[id] = item
            if (refresh) {
                GlobalUtil.sortArray(heroInfos, this.sortFunc)
                gdk.e.emit(RoleEventId.UPDATE_HERO_LIST)
            }
        } else {
            idItems[id].extInfo = extInfo
            if (refresh) {
                gdk.e.emit(RoleEventId.UPDATE_ONE_HERO, idItems[id])
            }
        }
        // // 更新职业等级信息
        // let careers = extInfo.careers
        // for (let index = 0; index < careers.length; index++) {
        //     const element = careers[index];
        //     this.updateHeroJobLv(id, element.careerId, element.careerLv)
        // }
    }


    /**同步更新英雄守护者信息 */
    static updateHeroGuardian(heroId, guardian: icmsg.Guardian) {
        let heroInfo = this.getHeroInfoByHeroId(heroId)
        if (heroInfo) {
            heroInfo.guardian = guardian
            this.updateHeroInfo(heroId, heroInfo)
        }
    }

    /**物品排序方法 */
    static sortFunc(a: BagItem, b: BagItem) {
        return a.series - b.series
    }

    /**
     * 删除某个英雄
     * @param id 英雄id
     * @param type 物品类型
     * @param refresh 是否派发事件
     */
    static removeHeroById(id: number, refresh: boolean = true) {
        let idItems = this.model.idItems
        let heroInfos = this.model.heroInfos
        if (!idItems || !idItems[id]) {
            return
        }
        delete idItems[id]
        for (let index = 0; index < heroInfos.length; index++) {
            const element = heroInfos[index];
            if (element.series == id) {
                heroInfos.splice(index, 1)
                break
            }
        }
        if (refresh) {
            gdk.e.emit(RoleEventId.REMOVE_ONE_HERO, id)
        }
    }

    /**更新英雄详细信息 */
    static updateHeroAttr(series: number, attr: icmsg.HeroAttr) {
        let heroAttrs = this.model.heroAttrs
        let heroDeatils = this.model.heroDeatils
        heroAttrs[series] = attr
        if (heroDeatils[series]) {
            let data: icmsg.HeroDetail = heroDeatils[series]
            data.attr = attr
        }
    }

    /**
     * 根据成长等级获取阶级信息
     * @param lv
     */
    static getGrowInfoById(name: string, id: number): Hero_growCfg {
        let attr = {
            "grow_hp": 'hp_w',
            "atk_speed": 'atk_speed',
            "grow_atk": 'atk_w',
            "grow_def": 'def_w',
            "grow_hit": 'hit_w',
            "grow_dodge": 'dodge_w'
        }
        let cfgs: Hero_growCfg[] = ConfigManager.getItems(Hero_growCfg, (cfg: Hero_growCfg) => {
            if (cfg.name == attr[name] && cfg.grow <= id) return true;
        })
        cfgs.sort((a, b) => { return b.grow_lv - a.grow_lv; });
        return cfgs[0];
    }

    /**英雄更新职业等级信息 */
    static updateHeroJobLv(heroId: number, jobId: number, level: number) {
        let careers = this.model.heroCareers
        if (!careers[heroId]) {
            careers[heroId] = {}
        }
        careers[heroId][jobId] = level
    }

    /**获取英雄职业等级 */
    static getHeroJobLv(heroId: number, jobId: number) {
        let careers = this.model.heroCareers
        if (careers[heroId] && careers[heroId][jobId] != void 0) {
            return careers[heroId][jobId]
        }
        return -1
    }

    /**把职业表转换, 方便读取 */
    static initJobRelatedInfo() {
        if (this.model.relatedInfos) {
            return
        }
        // let careerMaxLv = this.model.careerMaxLv
        // let cfgs = ConfigManager.getItems(Hero_careerCfg)
        // let used = {}
        // let backTab = {}    // 去重记录所有id的后置职业
        // for (let index = 0; index < cfgs.length; index++) {
        //     const data = cfgs[index];
        //     let id = data.career_id
        //     if (id) {
        //         if (!backTab[id]) {
        //             backTab[id] = []
        //         }
        //         if (!used[id]) {
        //             used[id] = 1
        //             // 长度为0时,直接插入
        //             if (backTab[id].length == 0) {
        //                 backTab[id].push(id)
        //             } else {
        //                 // 大于0时,保证id小的在前面
        //                 let len = backTab[preId].length
        //                 for (let index = 0; index < len; index++) {
        //                     const ele = backTab[preId][index];
        //                     if (ele > id || index == len - 1) {
        //                         backTab[preId].splice(index, 0, id)
        //                         break
        //                     }
        //                 }
        //             }
        //             this.model.careerPreIds[id] = preId
        //         }
        //     }
        //     // 遍历职业表的同时,把每个职业的最大等级记录下来
        //     let maxLv = careerMaxLv[id] || 0
        //     careerMaxLv[id] = Math.max(data.career_lv, maxLv)
        // }
        this.model.relatedInfos = [] //backTab
    }

    /**获取某个职业id的最大等级 */
    static getJobMaxLv(id: number) {
        return this.model.careerMaxLv[id]
    }

    /**获取id的前置职业 */
    static getJobPreId(id: number) {
        return this.model.careerPreIds[id] || 0
    }

    /**获取某个职业id的后置职业 */
    static getJobBackId(id: number) {
        let data = this.model.relatedInfos[id]
        return data ? data : []
    }


    /**初始化职业表，方便读取 */
    static initHeroCareerInfo() {
        if (this.model.careerInfos) {
            return
        }
        let cfgs = ConfigManager.getItems(Hero_careerCfg)
        let infos = {}
        let used = {}
        for (let index = 0; index < cfgs.length; index++) {
            const cfg = cfgs[index];
            if (!infos[cfg.hero_id]) {
                infos[cfg.hero_id] = []
            }
            if (!used[cfg.career_id]) {
                infos[cfg.hero_id].push(cfg.career_id)
                used[cfg.career_id] = 1
            }
        }
        this.model.careerInfos = infos
    }

    /**获取整个职业线的技能 */
    /**
     * 获取整个职业线的技能
     * @param careerId: 职业Id
     * @param skillType 0:塔防技能 1:卡牌技能
     */
    // static getCareerLineSkills(careerId: number, skillType: number): UnlockSkillType[] {
    //     let skills = [];
    //     ConfigManager.getItems(Hero_careerCfg, function (cfg: Hero_careerCfg) {
    //         if (cfg.ul_skill.length > 0) {
    //             if (cfg.career_pre == careerId) {
    //                 careerId = cfg.career_id;
    //             }
    //             if (cfg.career_id == careerId) {
    //                 for (let skillId of cfg.ul_skill) {
    //                     if ((skillType == 0 && skillId < 300000) || (skillType == 1 && skillId >= 300000)) {
    //                         let info: UnlockSkillType = {
    //                             skillId: skillId,
    //                             careerId: cfg.career_id,
    //                             unlockLv: cfg.career_lv
    //                         }
    //                         skills.push(info);
    //                     }
    //                 }
    //             }
    //         }
    //         return false;
    //     })
    //     return skills;
    // }
    static getCareerLineSkills(careerId: number, skillType: number): UnlockSkillType[] {
        let cfgs: Hero_careerCfg[] = [];
        ConfigManager.getItems(Hero_careerCfg, function (cfg: Hero_careerCfg) {
            if (cfg.career_id == careerId) {
                if (cfg.ul_skill.length > 0) {
                    cfgs.push(cfg);
                }
            }
            return false;
        })
        let line = -1;
        for (let index = 0; index < cfgs.length; index++) {
            const cfg = cfgs[index];
            if (cfg.career_id == careerId) {
                line = cfg.line;
                break;
            }
        }
        let skills = [];
        let temSkillIds = [];
        if (line >= 0) {
            for (let index = 0; index < cfgs.length; index++) {
                const cfg = cfgs[index];
                if ((line <= 1 && cfg.line <= 1) || (line > 1 && cfg.line == line)) {
                    for (let skillId of cfg.ul_skill) {
                        if ((skillType == 0 && skillId < 300000) || (skillType == 1 && skillId >= 300000)) {
                            if (temSkillIds.indexOf(skillId) >= 0) {
                                continue;
                            }
                            temSkillIds.push(skillId);
                            let info: UnlockSkillType = {
                                skillId: skillId,
                                careerId: cfg.career_id,
                                unlockLv: cfg.career_lv
                            }
                            skills.push(info);
                        }
                    }
                }
            }
        }
        return skills;
    }

    /**
     * 获取英雄某个职业解锁的技能id
     * @param heroId 英雄唯一id
     * @param cId 职业id
     * @param type 获取类型 0:目前已解锁的 1:职业链所有技能
     */
    static getJobUnlockSkils(heroId: number, cId: number, type: number = 0) {
        this.initJobRelatedInfo()
        let preId = HeroUtils.getJobPreId(cId)
        let lv = 99
        if (type == 0) {
            lv = this.getHeroJobLv(heroId, cId)
        }
        let skillIds = this._getCareerSkillIds(cId, lv)
        while (preId) {
            if (type == 0) {
                lv = this.getHeroJobLv(heroId, preId)
            }
            let res = this._getCareerSkillIds(preId, lv)
            skillIds = [...skillIds, ...res]
            preId = HeroUtils.getJobPreId(preId)
        }
        if (type != 0) {
            let backIds = HeroUtils.getJobBackId(cId)
            // 除了初始ID,其余的后置职业ID均只有一个
            // 初始id取技能时,也默认按第一个后置id取
            while (backIds.length > 0) {
                let backId = backIds[0]
                let backLv = 99
                if (type == 0) {
                    backLv = this.getHeroJobLv(heroId, backId)
                }
                let res = this._getCareerSkillIds(backId, backLv)
                skillIds = [...skillIds, ...res]
                backIds = HeroUtils.getJobBackId(backId)
            }
        }
        return skillIds
    }

    /**
     * 获取某个职业ID的技能
     * @param careerId
     * @param level
     */
    static _getCareerSkillIds(careerId: number, level: number = 99): UnlockSkillType[] {
        let skills = []
        let cfgs = ConfigManager.getItemsByField(Hero_careerCfg, "career_id", careerId)
        for (let index = 0; index < cfgs.length; index++) {
            const cfg = cfgs[index];
            if (cfg.ul_skill && cfg.career_lv <= level) {
                cfg.ul_skill.forEach(element => {
                    let info: UnlockSkillType = {
                        skillId: element,
                        careerId: careerId,
                        unlockLv: cfg.career_lv
                    }
                    skills.push(info)
                });

            }
        }
        return skills
    }

    /**根据英雄id获取所有职业id
     */
    static getHeroAllCareersById(id) {
        let heroCfg = ConfigManager.getItemById(HeroCfg, id)
        let careerCfgs = ConfigManager.getItemsByField(Hero_careerCfg, 'hero_id', heroCfg.id);
        let allIds = [heroCfg.career_id]
        careerCfgs.forEach(c => {
            if (allIds.indexOf(c.career_id) == -1) {
                allIds.push(c.career_id);
            }
        })
        return allIds
    }

    /**获取某个英雄的士兵id总汇
     * @param itemId 英雄配表id
     */
    static getHeroSoldiers(itemId: number): number[] {
        let list = []
        let cfg = ConfigManager.getItemById(HeroCfg, itemId)
        list = cfg.soldier_id
        return list
    }

    static setSpineData(node: cc.Node, spine: sp.Skeleton, skin: string, release: boolean = true, isFadeIn: boolean = true) {
        let url: string = skin ? StringUtils.format("spine/hero/{0}/1/{0}", skin) : null;
        GlobalUtil.setSpineData(node, spine, url, release, 'stand', true, isFadeIn);
    }

    static setFightSpineData(node: cc.Node, spine: sp.Skeleton, skin: string, release: boolean = true, isFadeIn: boolean = true) {
        let url: string = skin ? StringUtils.format("spine/hero/{0}/0.5/{0}", skin) : skin;
        GlobalUtil.setSpineData(node, spine, url, release, 'stand', true, isFadeIn);
    }

    /**小于300000万为塔防技能 大于的为卡牌技能 */
    static isCardSkill(id) {
        // return id > 300000;
        return false;
    }


    /**
     * 英雄 个数 达到指定等级
     * @param lv 等级
     * @param num 数量
     */
    static checkHeroCountLv(lv: number, num: number) {
        let items: BagItem[] = this.model.heroInfos;
        let count = 0
        for (let i = 0; i < items.length; i++) {
            let extInfo = items[i].extInfo as icmsg.HeroInfo
            if (extInfo.level >= lv) {
                count++
            }
        }
        return count >= num
    }

    /**
     * 英雄 进阶达到指定 数量
     * @param lv 等级
     * @param num 数量
     */
    static checkHeroCountCareerUp(num: number) {
        let items: BagItem[] = this.model.heroInfos;
        let count = 0
        for (let i = 0; i < items.length; i++) {
            let extInfo = items[i].extInfo as icmsg.HeroInfo
            let carerrs = this.model.heroCareers[items[i].series]
            let heroCfg = ConfigManager.getItemById(HeroCfg, extInfo.typeId)
            if (carerrs && carerrs[heroCfg.career_id] > 0) {
                count++
            }
        }
        return count >= num
    }

    /**获得英雄职业精通的累加战力 */
    static getHeroJobAbilityPower(heroInfo: icmsg.HeroInfo) {
        // let heroDetail = HeroUtils.getHeroDetailById(heroInfo.heroId)
        // let carerrs = heroDetail.careers
        let power = 0
        // for (let i = 0; i < carerrs.length; i++) {
        //     let maxLv = HeroUtils.getJobMaxLv(carerrs[i].careerId)
        //     if (carerrs[i].careerLv >= maxLv) {
        //         let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", carerrs[i].careerId, { career_lv: maxLv })
        //         let obj = {
        //             ul_hp_w: careerCfg.ul_hp_w,
        //             ul_crit_w: careerCfg.ul_crit_w,
        //             ul_atk_w: careerCfg.ul_atk_w,
        //             ul_def_w: careerCfg.ul_def_w,
        //             ul_hit_w: careerCfg.ul_hit_w,
        //             ul_dodge_w: careerCfg.ul_dodge_w
        //         }
        //         power += GlobalUtil.getPowerValue(obj)
        //     }
        // }
        return power
    }

    /**
     * 获取拥有士兵的英雄最大的等级
     * @param soldier_id
     */
    static getHeroSoldierMaxLevel(soldier_id: number): number {
        let level = 0;
        // let items: BagItem[] = this.model.heroInfos;
        // for (let i = 0; i < items.length; i++) {
        //     let extInfo = items[i].extInfo as HeroInfo
        //     let heroDetail = this.getHeroDetailById(extInfo.heroId);
        //     if (heroDetail && heroDetail.soldierIds) {
        //         heroDetail.soldierIds.some(id => {
        //             if (id == soldier_id && extInfo.level > level) {
        //                 level = extInfo.level
        //             }
        //         })
        //     }
        // }
        return level;
    }

    /**获得英雄职业技能的累加战力 */
    static getHeroJobSkillPower(cfg: Hero_careerCfg, heroInfo: icmsg.HeroInfo) {
        let power = 0
        // let heroDetail = HeroUtils.getHeroDetailById(heroInfo.heroId)
        // let carerrs = heroDetail.careers
        // for (let i = 0; i < carerrs.length; i++) {
        //     let cLv = carerrs[i].careerLv
        //     if (carerrs[i].careerId == cfg.career_id) {
        //         cLv = cfg.career_lv
        //     }
        //     for (let lv = 0; lv <= cLv; lv++) {
        //         let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", carerrs[i].careerId, { career_lv: lv })
        //         if ((careerCfg.line == 0 || careerCfg.line == cfg.line)) {
        //             //cc.log("careerCfg===" + careerCfg.career_id + ",line==" + careerCfg.line + ",,,,lv==" + careerCfg.career_lv)
        //             let skills = careerCfg.ul_skill
        //             for (let j = 0; j < skills.length; j++) {
        //                 let skillCfg = GlobalUtil.getSkillCfg(skills[j])
        //                 if (skillCfg) {
        //                     power += parseInt(skillCfg.power ? skillCfg.power : 0)
        //                 }
        //             }
        //         }
        //     }
        // }
        return power
    }

    /**英雄碎片是否符合要求，碎片对应的英雄必须满星 */
    static isHeroClipMaxStar(itemId) {
        // let list = this.model.heroInfos;
        // for (let i = 0; i < list.length; i++) {
        //     let id = list[i].itemId
        //     let cfg = ConfigManager.getItemById(HeroCfg, id)
        //     if (cfg && cfg.chip_id == itemId) {
        //         let colorCfg = ConfigManager.getItemById(Hero_colorCfg, cfg.color)
        //         let info = <HeroInfo>list[i].extInfo
        //         if (info.star == colorCfg.star) {
        //             return true
        //         }
        //     }
        // }
        return false
    }

    /**英雄已激活的士兵信息更新 增加*/
    static addHeroActiveSoldiers(heroId, soldierIds) {
        let data = this.model.activeHeroSoldierIds// 格式 heroId-[id,id,....]
        let ids = data[heroId] || []
        for (let i = 0; i < soldierIds.length; i++) {
            if (ids.indexOf(soldierIds[i]) == -1) {
                ids.push(soldierIds[i])
            }
        }
        this.model.activeHeroSoldierIds[heroId] = ids
        this.model.activeHeroSoldierIds = data;
        gdk.e.emit(RoleEventId.UPDATE_HERO_LIST)
    }

    /**英雄已激活的士兵信息更新  删除*/
    static deleteHeroActiveSoldier(heroId, soldierId) {
        let data = this.model.activeHeroSoldierIds// 格式 heroId-[id,id,....]
        let ids = data[heroId];
        if (ids) {
            let i = ids.indexOf(soldierId);
            if (i != -1) {
                ids.splice(i, 1)
                this.model.activeHeroSoldierIds = data;
            }
        }
        gdk.e.emit(RoleEventId.UPDATE_HERO_LIST)
    }

    /**英雄已激活的技能信息更新 增加*/
    static addHeroActiveSkills(heroId, skillIds) {
        let data = this.model.activeHeroSkillIds;// 格式 heroId-[id,id,....]
        let ids = data[heroId] || [];
        for (let i = 0; i < skillIds.length; i++) {
            let skillId = skillIds[i];
            if (ids.indexOf(skillId) == -1) {
                ids.push(skillId);
            }
        }
        this.model.activeHeroSkillIds[heroId] = ids;
        this.model.activeHeroSkillIds = data;
    }

    /**英雄已激活的技能信息更新  删除*/
    static deleteHeroActiveSkill(heroId, skillId) {
        let data = this.model.activeHeroSkillIds// 格式 heroId-[id,id,....]
        let ids = data[heroId];
        if (ids) {
            let i = ids.indexOf(skillId);
            if (i != -1) {
                ids.splice(i, 1);
                this.model.activeHeroSkillIds = data;
            }
        }
    }

    /**英雄已精通职业更新 增加*/
    static addHeroMasterCareer(heroId, careerId) {
        let data = this.model.masterHeroCareerIds;// 格式 heroId-[id,id,....]
        let ids = data[heroId] || [];
        if (ids.indexOf(careerId) == -1) {
            ids.push(careerId);
        }
        this.model.masterHeroCareerIds[heroId] = ids;
        this.model.masterHeroCareerIds = data;
    }

    /**英雄已激活的技能信息更新  删除*/
    static deleteHeroMasterCareer(heroId, careerId) {
        let data = this.model.masterHeroCareerIds// 格式 heroId-[id,id,....]
        let ids = data[heroId];
        if (ids) {
            let i = ids.indexOf(careerId);
            if (i != -1) {
                ids.splice(i, 1);
                this.model.masterHeroCareerIds = data;
            }
        }
    }

    /**获得指定英雄的语言 路径 string */
    static getHeroSpeech(id) {
        let cfg = ConfigManager.getItemById(HeroCfg, id)
        if (cfg && cfg.speech) {
            return `hero/${cfg.speech}`
        }
        return ""
    }

    /**英雄合成界面， 获取指定ID英雄的红点开关 */
    static getHeroComposeRedPointFlag(id: number) {
        let heroComposeRedPointFlag = this.model.heroComposeRedPointFlag;
        if (heroComposeRedPointFlag[id]) return heroComposeRedPointFlag[id];
        else return 0;
    }

    /**
     * 监测英雄是否解锁碎片合成公式
     * @param id 
     */
    static checkHeroComposeIsActive(id: number): boolean {
        let heroInfo = HeroUtils.getHeroInfoById(id);
        if (!heroInfo) return false;
        let status = HeroUtils.getHeroComposeStatusById(id);
        if (status && status.charAt(0) == '1') return true;
        else return false;
    }

    /**
     * 获取指定英雄的碎片合成状态
     * @param id 
     */
    static getHeroComposeStatusById(id: number): string {
        let heroComposeStatus = this.model.heroComposeStatus;
        if (!heroComposeStatus) heroComposeStatus = {};
        if (heroComposeStatus[id]) return heroComposeStatus[id];
        else return '00000000';
    }

    /**
     * 更新指定英雄碎片合成状态
     * @param id
     * @param status 2进制
     */
    static updateHeroComposeStatus(id: number, status: number) {
        let heroComposeStatus = this.model.heroComposeStatus;
        if (!heroComposeStatus) this.model.heroComposeStatus = {};
        let str = status.toString(2);
        while (str.length < 8) {
            str = '0' + str;
        }
        if (!this.model.heroComposeStatus[id]) this.model.heroComposeStatus[id] = '00000000';
        let changeIdx: number = -1; //改变位置,每次只会改变一个位置的状态
        for (let i = 0; i < 8; i++) {
            if (str.charAt(i) != this.model.heroComposeStatus[id].charAt(i)) changeIdx = i;
        }
        this.model.heroComposeStatus[id] = str;
        gdk.e.emit(LotteryEventId.UPDATE_COMPOSE_STATUS, [id, str, changeIdx]);
    }

    /**
     * 获得指定英雄的合成公式 {id,chipsNeed}[]
     * @param id targetHeroId
     */
    static getHeroSynthesisInfo(id) {
        // let composeCfg = ConfigManager.getItemByField(Hero_composeCfg, 'parent_id', id);
        // let tempChilds = [composeCfg.child1, composeCfg.child2, composeCfg.child3];
        let childs: { id: number, chipsNeed: number }[] = [];
        // tempChilds.forEach((child) => {
        //     if (child && child.length == 2) {
        //         childs.push({
        //             id: child[0],
        //             chipsNeed: child[1]
        //         })
        //     }
        // })
        return childs;
    }

    // static getIsHeroSynthseisActive(id): boolean {
    //     let flag = false;
    //     let childs = HeroUtils.getHeroSynthesisInfo(id);
    //     let condition: string = '0';
    //     childs.forEach((child) => {
    //         condition += '11';
    //     });
    // }

    /**
     * 获得英雄战斗属性
     * @param heroIds 
     * @param isTower 
     * @param cb 
     */
    static getFightHeroInfo(
        heroIds: number[] | number,
        isTower: boolean,
        cb?: (arr: (icmsg.FightHero | icmsg.FightGeneral)[]) => any,
    ) {
        let model = this.model;
        let ret: (icmsg.FightHero | icmsg.FightGeneral)[] = [];
        let req: number[] = [];
        let general = heroIds === null;
        if (!general) {
            // 英雄
            let ids = heroIds instanceof Array ? heroIds : [heroIds];
            let dic = isTower ? model.fightHeroIdxTower : model.fightHeroIdx;
            for (let i = ids.length - 1; i >= 0; i--) {
                let heroId = ids[i];
                if (heroId <= 0) continue;
                if (dic[heroId]) {
                    // 缓存数据
                    ret.push(dic[heroId]);
                } else {
                    // 待请求英雄
                    req.push(heroId);
                }
            }
            (req.length == 0) && (req = null);
        }
        if (req != null) {
            // 有英雄数据需要请求
            let smsg = new icmsg.FightQueryReq();
            smsg.isTower = isTower;
            smsg.general = general;
            smsg.heroIds = req;
            NetManager.send(smsg, (rmsg: icmsg.FightQueryRsp) => {
                if (!rmsg.heroList) {
                    cc.error('查询英雄属性出现异常');
                    return;
                }
                if (general) {
                    // 指挥官
                    ret.push(rmsg.general);
                } else {
                    // 英雄
                    let dic = isTower ? model.fightHeroIdxTower : model.fightHeroIdx;
                    for (let i = rmsg.heroList.length - 1; i >= 0; i--) {
                        let obj = rmsg.heroList[i];
                        dic[obj.heroId] = obj;
                        ret.push(obj);
                    }
                }
                // 回调
                cb && cb(ret);
            }, this);
        } else {
            // 回调
            cb && cb(ret);
        }
    }

    /**
     * 创建指挥官战斗数据
     * @param level 等级
     */
    static createFightGeneralData(level: number): icmsg.FightGeneral {
        let data = new icmsg.FightGeneral()
        let cfg = ConfigManager.getItemByField(GeneralCfg, 'lv', level)
        data.atk = cfg.atk_w;
        data.energyCharge = cfg.energy_charge;
        data.weaponId = 1000;
        data.level = level;
        let skill1 = new icmsg.FightSkill()
        skill1.skillId = 50;
        skill1.skillLv = 1;
        data.skills.push(skill1);
        let skill2 = new icmsg.FightSkill()
        skill2.skillId = 50;
        skill2.skillLv = 1;
        data.skills.push(skill2);
        return data;
    }

    /**创建一刀999的指挥官 */
    static creatdGodGeneralData(): icmsg.FightGeneral {
        let data = new icmsg.FightGeneral()
        data.atk = 999999;
        data.energyCharge = 1;
        data.weaponId = 1000;
        data.level = 50;
        let skill1 = new icmsg.FightSkill()
        skill1.skillId = 50;
        skill1.skillLv = 1;
        data.skills.push(skill1);
        let skill2 = new icmsg.FightSkill()
        skill2.skillId = 50;
        skill2.skillLv = 1;
        data.skills.push(skill2);
        return data;
    }

    /**
     * 清除英雄战斗属性
     * @param heroId 
     */
    static removeFightHeroInfo(heroId: number) {
        let model = this.model;
        delete model.fightHeroIdxTower[heroId];
        delete model.fightHeroIdx[heroId];
        gdk.e.emit(RoleEventId.REMOVE_HERO_FIGHT_INFO, heroId);
    }

    // 清除
    static clear() {
        NetManager.targetOff(this);
    }

    /**
     * 根据阵营获取英雄列表
     * @param group  0-all
     */
    static getHerosByGroup(group: number, targetHeroInfos?: icmsg.HeroInfo[]): icmsg.HeroInfo[] {
        let list = [];
        let heroInfos: icmsg.HeroInfo[] = [];
        if (targetHeroInfos) heroInfos = targetHeroInfos;
        else {
            this.model.heroInfos.forEach(info => {
                heroInfos.push(<icmsg.HeroInfo>info.extInfo);
            })
        }
        heroInfos.forEach(info => {
            let cfg = ConfigManager.getItemById(HeroCfg, info.typeId);
            if (cfg.group.indexOf(group) != -1 || group == 0) {
                list.push(info);
            }
        });
        return list;
    }


    /**
     * 根据品质获取该品质及以上的英雄列表
     * @param quality 
     */
    static getHerosByQuality(quality: number, targetHeroInfos?: icmsg.HeroInfo[]): icmsg.HeroInfo[] {
        let list = [];
        let heroInfos: icmsg.HeroInfo[] = [];
        if (targetHeroInfos) heroInfos = targetHeroInfos;
        else {
            this.model.heroInfos.forEach(info => {
                heroInfos.push(<icmsg.HeroInfo>info.extInfo);
            })
        }
        heroInfos.forEach(info => {
            let cfg = ConfigManager.getItemById(HeroCfg, info.typeId);
            if (info.color >= quality) {
                list.push(info);
            }
        });
        return list;
    }

    /**
     * 根据星级获取该品质及以上的英雄列表
     * @param star 
     */
    static getHerosByStar(star: number, targetHeroInfos?: icmsg.HeroInfo[]): icmsg.HeroInfo[] {
        let list = [];
        let heroInfos: icmsg.HeroInfo[] = [];
        if (targetHeroInfos) heroInfos = targetHeroInfos;
        else {
            this.model.heroInfos.forEach(info => {
                heroInfos.push(<icmsg.HeroInfo>info.extInfo);
            })
        }
        heroInfos.forEach(info => {
            if (info.star >= star) {
                list.push(info);
            }
        });
        return list;
    }

    /**
     * 创建助战英雄BagItem数据
     * @param info 
     * @param cfg 
     */
    static createAssistHeroBagItem(info: icmsg.FightHero, cfg: Copy_assistCfg) {
        let item = this.createHeroBagItemBy(info);
        let extInfo = item.extInfo as icmsg.HeroInfo;
        item.series = 1000000 + info.heroId % 300000;
        extInfo.power = 0;
        if (cfg) {
            extInfo.star = cfg.hero_star;
        }
        return item;
    }

    /**
     * 创建雇佣的英雄BagItem数据
     * @param hero 
     */
    static createMercenaryHeroBagItem(hero: icmsg.MercenaryBorrowedHero): BagItem {
        let item = this.createHeroBagItemBy(hero.brief);
        let extInfo = item.extInfo as icmsg.HeroInfo;
        item.series = 600000 + hero.index;
        extInfo.power = hero.power;
        return item;
    }

    /**
     * 创建英雄BagItem数据
     * @param brief 
     */
    static createHeroBagItemBy(brief: icmsg.HeroBrief | icmsg.FightHero): BagItem {
        let extInfo = new icmsg.HeroInfo();
        if (brief instanceof icmsg.HeroBrief) {
            extInfo.heroId = brief.typeId % 300000;
            extInfo.typeId = brief.typeId;
            extInfo.careerId = brief.careerId;
            extInfo.power = brief.power;
            extInfo.soldierId = brief.soldierId;
            extInfo.star = brief.star;
            extInfo.level = brief.level;
        } else {
            extInfo.heroId = brief.heroType % 300000;
            extInfo.typeId = brief.heroType;
            extInfo.careerId = brief.careerId;
            extInfo.power = brief.heroPower;
            extInfo.soldierId = brief.soldier.soldierId;
            extInfo.star = brief.heroStar;
            extInfo.level = brief.heroLv;
        }
        extInfo.slots = [];
        // extInfo.mastery = [];
        // extInfo.careers = [new HeroCareer({ careerId: brief.careerId, careerLv: brief.careerLv })];
        //extInfo.extra = null;
        extInfo.status = 0;
        return {
            series: extInfo.typeId,
            itemId: extInfo.typeId,
            itemNum: 1,
            type: BagType.HERO,
            extInfo: extInfo,
        };
    }

    /**
     * 创建新奖杯模式的英雄BagItem数据
     * @param hero 
     */
    static createCopyCupHeroBagItem(heroId: number): BagItem {
        let item = this.createCopyCupHeroBagItemBy(heroId);
        let extInfo = item.extInfo as icmsg.HeroInfo;
        //extInfo.power = 0;
        extInfo.heroId = extInfo.heroId % 300000;
        item.series = 800000 + extInfo.heroId;
        return item;
    }

    static createCopyCupHeroBagItemBy(heroId: number): BagItem {
        let extInfo = new icmsg.HeroInfo();
        let temCfg = ConfigManager.getItem(Copycup_heroCfg, { 'id': heroId })
        extInfo.heroId = temCfg.hero_id % 300000;
        extInfo.typeId = temCfg.hero_id;
        extInfo.careerId = temCfg.career_id;
        extInfo.soldierId = temCfg.soldier_id;
        extInfo.star = temCfg.hero_star;
        extInfo.level = temCfg.hero_level;
        extInfo.slots = []
        // extInfo.mastery = [];
        //extInfo.careers = [new HeroCareer({ careerId: brief.careerId, careerLv: brief.careerLv })];
        //extInfo.extra = null;
        extInfo.status = 0;
        return {
            series: temCfg.hero_id % 300000,
            itemId: temCfg.hero_id,
            itemNum: 1,
            type: BagType.HERO,
            extInfo: extInfo,
        };
    }

    //获取新奖杯模式，助战英雄数据
    static createCopyCupHeroFightHero(cupHeroId: number): icmsg.FightHero {
        let hero = new icmsg.FightHero();
        let heroCfg = ConfigManager.getItemById(Copycup_heroCfg, cupHeroId);
        hero.heroId = heroCfg.hero_id % 300000;
        hero.heroLv = heroCfg.hero_level//50;
        hero.careerId = heroCfg.career_id;
        hero.careerLv = 1;
        hero.attr = new icmsg.FightAttr();
        hero.attr.atk = heroCfg.hero_atk;
        hero.attr.hp = heroCfg.hero_hp;
        //hero.attr.maxHp = heroCfg.hero_hp;
        hero.attr.def = heroCfg.hero_def;
        hero.attr.hit = heroCfg.hero_hit;
        hero.attr.dodge = heroCfg.hero_dodge;
        hero.attr.crit = 0
        hero.attr.hurt = 0
        hero.attr.atkSpeed = 0
        hero.attr.defPeneFix = 0
        hero.attr.critRes = 0
        hero.attr.hurtRes = 0
        hero.attr.puncRes = 0
        hero.attr.radiRes = 0
        hero.attr.elecRes = 0
        hero.attr.fireRes = 0
        hero.attr.coldRes = 0
        hero.attr.critV = 0
        hero.attr.critVRes = 0
        hero.attr.atkRes = 0
        hero.attr.dmgPunc = 0
        hero.attr.dmgRadi = 0
        hero.attr.dmgElec = 0
        hero.attr.dmgFire = 0
        hero.attr.dmgCold = 0
        hero.attr.atkDmg = 0
        hero.attr.atkSpeedR = 0
        hero.attr.atkOrder = 0
        hero.attr.dmgAdd = 0
        hero.attr.dmgRes = 0
        hero.attr.powerDmg = 0
        hero.skills = [];
        let index = 0;
        heroCfg.hero_skills.forEach(skillId => {
            if (index == 0) {
                let cfgs = ConfigManager.getItems(SkillCfg, { 'skill_id': skillId });
                if (cfgs.length > 0) {
                    let skillData = new icmsg.FightSkill();
                    skillData.skillId = skillId;
                    skillData.skillLv = cfgs[cfgs.length - 1].level;
                    hero.skills.push(skillData)
                }
            } else {
                let skillData = new icmsg.FightSkill();
                skillData.skillId = skillId;
                skillData.skillLv = 1;
                hero.skills.push(skillData)
            }
            index++;
        })

        hero.soldier = new icmsg.FightSoldier();
        hero.soldier.soldierId = heroCfg.soldier_id;
        hero.soldier.atk = heroCfg.soldier_atk;
        hero.soldier.hp = heroCfg.soldier_hp;
        hero.soldier.def = heroCfg.soldier_def;
        hero.soldier.hit = heroCfg.soldier_hit;
        hero.soldier.dodge = heroCfg.soldier_dodge;
        // hero.soldier.level = 1;
        // hero.soldier.crit = 0
        hero.soldier.atkSpeed = 0
        hero.soldier.dmgAdd = 0
        hero.soldier.dmgRes = 0
        // hero.soldier.critV = 0
        // hero.soldier.critVRes = 0
        // hero.soldier.atkSpeedR = 0
        hero.soldier.skills = []
        heroCfg.soldier_skills.forEach(skillId => {
            let skillData = new icmsg.FightSkill();
            skillData.skillId = skillId;
            skillData.skillLv = 1;
            hero.soldier.skills.push(skillData)
        })

        return hero;
    }

    static createDemoHeroBagItemBy(heroId: number): BagItem {
        let extInfo = new icmsg.HeroInfo();
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroId);
        let temCfg = ConfigManager.getItemByField(Pve_demo2Cfg, 'hero_id', heroId)
        extInfo.heroId = temCfg.hero_id % 300000;
        extInfo.typeId = temCfg.hero_id;
        extInfo.careerId = heroCfg.career_id;
        extInfo.soldierId = -1//temCfg.soldier_id;
        extInfo.star = heroCfg.star_min;
        extInfo.level = 1//heroCfg.hero_level;
        extInfo.slots = []
        // extInfo.mastery = [];
        //extInfo.careers = [new HeroCareer({ careerId: brief.careerId, careerLv: brief.careerLv })];
        //extInfo.extra = null;
        extInfo.status = 0;
        return {
            series: 800000 + temCfg.hero_id % 300000,
            itemId: temCfg.hero_id,
            itemNum: 1,
            type: BagType.HERO,
            extInfo: extInfo,
        };
    }
    //获取Demo模式，英雄数据
    static createDemoHeroFightHero(heroId: number): icmsg.FightHero {
        let hero = new icmsg.FightHero();
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroId);
        let temCfg = ConfigManager.getItemByField(Pve_demo2Cfg, 'hero_id', heroId)
        hero.heroId = temCfg.hero_id % 300000;
        hero.heroLv = 1;
        hero.careerId = heroCfg.career_id;
        hero.careerLv = 1;
        hero.attr = new icmsg.FightAttr();
        hero.attr.atk = heroCfg.atk_w;
        hero.attr.hp = heroCfg.hp_w;
        //hero.attr.maxHp = heroCfg.hp_w;
        hero.attr.def = heroCfg.def_w;
        hero.attr.hit = heroCfg.hit_w;
        hero.attr.dodge = heroCfg.dodge_w;
        hero.attr.crit = 0
        hero.attr.hurt = 0
        hero.attr.atkSpeed = 0
        hero.attr.defPeneFix = 0
        hero.attr.critRes = 0
        hero.attr.hurtRes = 0
        hero.attr.puncRes = 0
        hero.attr.radiRes = 0
        hero.attr.elecRes = 0
        hero.attr.fireRes = 0
        hero.attr.coldRes = 0
        hero.attr.critV = 0
        hero.attr.critVRes = 0
        hero.attr.atkRes = 0
        hero.attr.dmgPunc = 0
        hero.attr.dmgRadi = 0
        hero.attr.dmgElec = 0
        hero.attr.dmgFire = 0
        hero.attr.dmgCold = 0
        hero.attr.atkDmg = 0
        hero.attr.atkSpeedR = 0
        hero.attr.atkOrder = 0
        hero.attr.dmgAdd = 0
        hero.attr.dmgRes = 0
        hero.attr.powerDmg = 0
        hero.skills = [];
        let index = 0;
        temCfg.hero_skills.forEach(skillId => {
            if (index == 0) {
                let cfgs = ConfigManager.getItems(SkillCfg, { 'skill_id': skillId });
                if (cfgs.length > 0) {
                    let skillData = new icmsg.FightSkill();
                    skillData.skillId = skillId;
                    skillData.skillLv = cfgs[cfgs.length - 1].level;
                    hero.skills.push(skillData)
                }
            } else {
                let skillData = new icmsg.FightSkill();
                skillData.skillId = skillId;
                skillData.skillLv = 1;
                hero.skills.push(skillData)
            }
            index++;
        })

        hero.soldier = new icmsg.FightSoldier();
        hero.soldier.soldierId = 0;
        hero.soldier.atk = 0;
        hero.soldier.hp = 0;
        hero.soldier.def = 0;
        hero.soldier.hit = 0;
        hero.soldier.dodge = 0;
        hero.soldier.atkSpeed = 0
        hero.soldier.dmgAdd = 0
        hero.soldier.dmgRes = 0
        hero.soldier.skills = []
        // heroCfg.soldier_skills.forEach(skillId => {
        //     let skillData = new icmsg.FightSkill();
        //     skillData.skillId = skillId;
        //     skillData.skillLv = 1;
        //     hero.soldier.skills.push(skillData)
        // })

        return hero;
    }

    //获取Demo模式，英雄数据
    static createTestHeroFightHero(heroId: number, careerId: number, star: number, heroLv: number): icmsg.FightHero {
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroId);
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, "star", star)
        let careerLv = starCfg.career_lv;
        let careerCfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: careerLv })
        let curLv = heroLv;
        let attName = ["hp_w", "atk_w", "def_w", "hit_w", "dodge_w"]
        let growName = ["grow_hp", "grow_atk", "grow_def", "grow_hit", "grow_dodge"]
        let hbAttrBase: HBAttrBase = {
            hp_w: 0,
            atk_w: 0,
            def_w: 0,
            hit_w: 0,
            dodge_w: 0
        }
        let grow = starCfg.add_grow;
        for (let index = 0; index < attName.length; index++) {
            let baseV = heroCfg[attName[index]]
            hbAttrBase[attName[index]] += baseV * starCfg.add + ((curLv - 1) * careerCfg[growName[index]] + careerCfg[attName[index]]) * grow //升级升星属性

        }
        //this.fightLab.string = `${GlobalUtil.getPowerValue(hbAttrBase)}`

        let hero = new icmsg.FightHero();
        //let temCfg = ConfigManager.getItemByField(Pve_demo2Cfg, 'hero_id', heroId)
        hero.heroId = heroCfg.id % 300000;
        hero.heroType = heroCfg.id
        hero.heroLv = heroLv;
        hero.careerId = heroCfg.career_id;
        hero.careerLv = careerLv;
        hero.heroStar = star
        hero.heroPower = GlobalUtil.getPowerValue(hbAttrBase);
        hero.attr = new icmsg.FightAttr();
        hero.attr.atk = Math.floor(hbAttrBase.atk_w);
        hero.attr.hp = Math.floor(hbAttrBase.hp_w);
        //hero.attr.maxHp = heroCfg.hp_w;
        hero.attr.def = Math.floor(hbAttrBase.def_w);
        hero.attr.hit = Math.floor(hbAttrBase.hit_w);
        hero.attr.dodge = Math.floor(hbAttrBase.dodge_w);
        hero.attr.crit = 0
        hero.attr.hurt = 0
        hero.attr.atkSpeed = 0
        hero.attr.defPeneFix = 0
        hero.attr.critRes = 0
        hero.attr.hurtRes = 0
        hero.attr.puncRes = 0
        hero.attr.radiRes = 0
        hero.attr.elecRes = 0
        hero.attr.fireRes = 0
        hero.attr.coldRes = 0
        hero.attr.critV = 0
        hero.attr.critVRes = 0
        hero.attr.atkRes = 0
        hero.attr.dmgPunc = 0
        hero.attr.dmgRadi = 0
        hero.attr.dmgElec = 0
        hero.attr.dmgFire = 0
        hero.attr.dmgCold = 0
        hero.attr.atkDmg = 0
        hero.attr.atkSpeedR = 0
        hero.attr.atkOrder = 0
        hero.attr.dmgAdd = 0
        hero.attr.dmgRes = 0
        hero.attr.powerDmg = 0
        hero.skills = [];
        //天赋技能
        let giftLv = heroCfg.group[0] == 6 ? 1 : starCfg.gift_lv;
        let skillData = new icmsg.FightSkill();
        skillData.skillId = heroCfg.gift_tower_id
        skillData.skillLv = giftLv
        hero.skills.push(skillData)
        //解锁的技能
        let temSkill = this._getCareerSkillIds(careerId, careerLv)
        temSkill.forEach(skill => {
            let skillData = new icmsg.FightSkill();
            skillData.skillId = skill.skillId
            skillData.skillLv = skill.skillLv ? skill.skillLv : 1
            hero.skills.push(skillData)
        })

        hero.soldier = new icmsg.FightSoldier();
        hero.soldier.soldierId = careerCfg.career_type * 100 + 1;
        hero.soldier.atk = 0;
        hero.soldier.hp = 0;
        hero.soldier.def = 0;
        hero.soldier.hit = 0;
        hero.soldier.dodge = 0;
        hero.soldier.atkSpeed = 0
        hero.soldier.dmgAdd = 0
        hero.soldier.dmgRes = 0
        hero.soldier.skills = []
        // heroCfg.soldier_skills.forEach(skillId => {
        //     let skillData = new icmsg.FightSkill();
        //     skillData.skillId = skillId;
        //     skillData.skillLv = 1;
        //     hero.soldier.skills.push(skillData)
        // })

        return hero;
    }

    static getGoldHeroList() {
        let infos = this.model.heroInfos;
        let list: icmsg.HeroInfo[] = [];
        infos.forEach(info => {
            let heroInfo: icmsg.HeroInfo = <icmsg.HeroInfo>info.extInfo;
            if (heroInfo.color >= 4) list.push(heroInfo);
        });
        return list;
    }

    /**获取英雄列表最高的英雄等级 */
    static getMaxLevelHero() {
        let infos = this.model.heroInfos;
        let maxLv: number = 0;
        infos.forEach(info => {
            let heroInfo: icmsg.HeroInfo = <icmsg.HeroInfo>info.extInfo;
            if (heroInfo.level >= maxLv) maxLv = heroInfo.level;
        });
        return maxLv;
    }

    /**
     * 根据typeId获取英雄信息列表
     * @param id 
     */
    static getHeroListByTypeId(id: number): icmsg.HeroInfo[] {
        let info = this.model.heroInfos;
        let list: icmsg.HeroInfo[] = [];
        info.forEach(i => {
            if (i.itemId == id) list.push(<icmsg.HeroInfo>i.extInfo);
        })
        return list;
    }

    /**
     * 英雄id获取升星进度 [hasNum,needNum]
     * @param heroId 
     */
    static getProgressOfUpStar(typeId: number, curStar: number) {
        let replaceItemMaps = this.model.replaceItemIdMaps;
        //获取可用的替换材料id
        let getReplaceItems = (groups, star, maps = replaceItemMaps): number[] => {
            let itemIds: number[] = [];
            groups.forEach(group => {
                let ids = maps[group][star];
                if (ids && ids.length > 0) {
                    ids.forEach(id => {
                        let num = BagUtils.getItemNumById(id) || 0;
                        for (let i = 0; i < num; i++) {
                            let customId = parseInt(`${id}${i}`); // id+idx 同一道具保证id的唯一性  前6位固定为id
                            if (itemIds.indexOf(customId) == -1) {
                                itemIds.push(customId);
                            }
                        }
                    });
                }
            });
            return itemIds;
        };
        let mercenaryList = []
        let mercenaryModel = ModelManager.get(MercenaryModel)
        let m_list = mercenaryModel.lentHeroList
        for (let i = 0; i < m_list.length; i++) {
            mercenaryList.push(m_list[i].heroId)
        }

        // let crystalModel = ModelManager.get(ResonatingModel);
        // let upFightList = [...this.model.curUpHeroList(0)];
        let cfg = ConfigManager.getItemById(Hero_starCfg, curStar);
        let needNum: number = 0;
        let hasNum: number = 0;
        let recordHeroList: number[] = [];
        for (let i = 0; i < 4; i++) {
            let cost = cfg[`cost_${i}`];
            if (!cost && i == 0) {
                cost = [3, curStar, 1]; //模拟本体卡
            }
            if (cost && cost.length >= 3) {
                needNum += cost[2];
                let len: number = 0;
                if (cost[0] == 1 || cost[0] == 3) {
                    let b = gdk.panel.isOpenOrOpening(PanelId.Role2) || gdk.panel.isOpenOrOpening(PanelId.RoleView2) || gdk.panel.isOpenOrOpening(PanelId.StarUpdateView);
                    if (cost[0] == 3 && b && this.model.curHeroInfo && this.model.curHeroInfo.typeId == typeId && this.model.curHeroInfo.star == cost[1]) {
                        recordHeroList.push(this.model.curHeroInfo.heroId);
                        len += 1;
                    }
                    else {
                        let heroList = this.getHeroListByTypeId(typeId);
                        heroList.sort((a, b) => { return b.level - a.level; });
                        heroList.forEach(l => {
                            if (len < cost[2] && recordHeroList.indexOf(l.heroId) == -1) {
                                if (cost[0] == 3 ||
                                    (cost[0] == 1
                                        && !HeroUtils.heroLockCheck(l, false)
                                        && ConfigManager.getItemById(HeroCfg, l.typeId).group[0] !== 6)) {
                                    if (l.star == cost[1]) {
                                        recordHeroList.push(l.heroId);
                                        len += 1;
                                    }
                                }
                            }
                        });
                    }
                    //替代材料
                    // if (cost[0] == 1 && len < cost[2]) {
                    //     let groups: number[] = [ConfigManager.getItemById(HeroCfg, typeId).group[0]];
                    //     let replaceItems = getReplaceItems(groups, cost[1]);
                    //     replaceItems.forEach(id => {
                    //         if (len < cost[2] && recordHeroList.indexOf(id) == -1) {
                    //             recordHeroList.push(id);
                    //             len += 1;
                    //         }
                    //     })
                    // }
                }
                else if (cost[0] == 2) {
                    let heroList = this.getHerosByGroup(ConfigManager.getItemById(HeroCfg, typeId).group[0]);
                    heroList.forEach(l => {
                        if (len < cost[2]
                            && recordHeroList.indexOf(l.heroId) == -1
                            && !HeroUtils.heroLockCheck(l, false)
                            && ConfigManager.getItemById(HeroCfg, l.typeId).group[0] !== 6) {
                            if (l.star == cost[1]) {
                                recordHeroList.push(l.heroId);
                                len += 1;
                            }
                        }
                    });

                    //替代材料
                    if (len < cost[2]) {
                        let groups: number[] = [ConfigManager.getItemById(HeroCfg, typeId).group[0]];
                        let replaceItems = getReplaceItems(groups, cost[1]);
                        replaceItems.forEach(id => {
                            if (len < cost[2] && recordHeroList.indexOf(id) == -1) {
                                recordHeroList.push(id);
                                len += 1;
                            }
                        })
                    }
                }
                else {
                    let heroList = this.getHerosByGroup(0);
                    heroList.forEach(l => {
                        if (len < cost[2]
                            && recordHeroList.indexOf(l.heroId) == -1
                            && !HeroUtils.heroLockCheck(l, false)
                            && ConfigManager.getItemById(HeroCfg, l.typeId).group[0] !== 6) {
                            if (l.star == cost[1]) {
                                recordHeroList.push(l.heroId);
                                len += 1;
                            }
                        }
                    });
                    //替代材料
                    if (len < cost[2]) {
                        let groups: number[] = [1, 2, 3, 4, 5];
                        let replaceItems = getReplaceItems(groups, cost[1]);
                        replaceItems.forEach(id => {
                            if (len < cost[2] && recordHeroList.indexOf(id) == -1) {
                                recordHeroList.push(id);
                                len += 1;
                            }
                        })
                    }
                }
                hasNum += len;
            }
        }

        if (cfg.cost_4 && cfg.cost_4.length > 0) {
            cfg.cost_4.forEach(item => {
                needNum += 1;
                if (BagUtils.getItemNumById(item[0]) >= item[1]) {
                    hasNum += 1;
                }
            });
        }
        return [hasNum, needNum];
    }



    static getPowerByStarAndCareer(typeId, careerId, star) {
        let heroCfg = ConfigManager.getItemById(HeroCfg, typeId);
        let careerLv = ConfigManager.getItemById(Hero_starCfg, star).career_lv;
        let careerCfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: careerLv })
        let maxLv = careerCfg.hero_lv;
        let attName = ["hp_w", "atk_w", "def_w", "hit_w", "dodge_w"]
        let growName = ["grow_hp", "grow_atk", "grow_def", "grow_hit", "grow_dodge"]
        let hbAttrBase: HBAttrBase = {
            hp_w: 0,
            atk_w: 0,
            def_w: 0,
            hit_w: 0,
            dodge_w: 0
        }
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, "star", star)
        let grow = heroCfg.group[0] == 6 ? starCfg.add_grow_mystery : starCfg.add_grow;
        for (let index = 0; index < attName.length; index++) {
            let baseV = heroCfg[attName[index]]
            hbAttrBase[attName[index]] += baseV * starCfg.add + (maxLv - 1) * careerCfg[growName[index]] * grow //升级升星属性
            hbAttrBase[attName[index]] += careerCfg[attName[index]]//职业最后一阶属性

        }
        return GlobalUtil.getPowerValue(hbAttrBase);
    }

    /**
     * 升星限制
     * @param star 
     * @param showTips 
     */
    static upStarLimit(star: number, showTips: boolean = true): boolean {
        let cfg = ConfigManager.getItemById(Hero_starCfg, star);
        if (!cfg) return true;
        let limit = cfg.star_limit;
        if (!limit || limit.length <= 0) {
            return false;
        }
        let num = 0;
        let resonatingModel = ModelManager.get(ResonatingModel)
        let list = resonatingModel.Upper;//this.model.curUpHeroList(0);
        list.forEach(heroId => {
            let info = HeroUtils.getHeroInfoByHeroId(heroId);
            if (info && info.level >= limit[0]) {
                num += 1;
            }
        });
        if (num >= limit[1]) {
            return false;
        }
        else {
            if (showTips) {
                gdk.gui.showMessage(`支援中心-助力水晶列表需达到${limit[1]}名${limit[0]}级以上的英雄`);
            }
            return true;
        }
    }

    /**英雄分享 */
    static shareHero(heroInfo: icmsg.HeroInfo, channelType: number = ChatChannel.WORLD) {
        let callFunc = () => {
            NetManager.off(icmsg.ChatSendRsp.MsgType, callFunc, this)
            this.model.commentZhuanLastTime = this.serverModel.serverTime
            gdk.gui.showMessage("分享成功")
        }
        ErrorManager.on(302, () => {
            NetManager.off(icmsg.ChatSendRsp.MsgType, callFunc, this)
        }, this)
        NetManager.on(icmsg.ChatSendRsp.MsgType, callFunc, this)

        let msg = new icmsg.ShareImageReq()
        msg.heroId = heroInfo.heroId
        NetManager.send(msg, (rsp: icmsg.ShareImageRsp) => {
            let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId)
            let starCfg = ConfigManager.getItemById(Hero_starCfg, heroInfo.star)
            let msg2 = new icmsg.ChatSendReq()
            msg2.channel = channelType //1:系统 2:世界 3:公会 4:私聊
            msg2.content = `大家看我这个<color=${GlobalUtil.getHeroNameColor(starCfg.color)}><outline color=${GlobalUtil.getHeroNameColor(starCfg.color, true)} width=${2}><on click='shareHeroClick' param='${rsp.shareId}'>【${heroCfg.name}】</on></outline></color>如何?点击英雄名查看英雄信息`
            msg2.targetId = 0;
            NetManager.send(msg2);
        })
    }

    /**展示玩家评论 */
    static showHeroCommment() {
        let trigger_guide1 = ConfigManager.getItemById(Comments_globalCfg, "trigger_guide1").value
        let trigger_guide2 = ConfigManager.getItemById(Comments_globalCfg, "trigger_guide2").value
        let num1 = GlobalUtil.getCookie("trigger_guide1") || 0
        if (num1 < trigger_guide1[1]) {
            if (this.model.curHeroInfo && trigger_guide1[0] == this.model.curHeroInfo.star) {
                num1 += 1
                GlobalUtil.setCookie("trigger_guide1", num1)
                this.model.commentUpStarShow = true
                gdk.panel.setArgs(PanelId.SubHeroCommentPanel, this.model.curHeroInfo.typeId, this.model.curHeroInfo.star)
                gdk.panel.open(PanelId.SubHeroCommentPanel)
            }
        }
        let num2 = GlobalUtil.getCookie("trigger_guide2") || 0
        if (num2 < trigger_guide2[1]) {
            if (this.model.curHeroInfo && trigger_guide2[0] == this.model.curHeroInfo.star) {
                num2 += 1
                GlobalUtil.setCookie("trigger_guide2", num2)
                this.model.commentUpStarShow = true
                gdk.panel.setArgs(PanelId.SubHeroCommentPanel, this.model.curHeroInfo.typeId, this.model.curHeroInfo.star)
                gdk.panel.open(PanelId.SubHeroCommentPanel)
            }
        }
    }

    /**
     * 查询英雄是否被占用
     * @param heroInfo 
     * @param showTips 
     * @param lockModel hero_lock_model
     */
    static heroLockCheck(heroInfo: icmsg.HeroInfo, showTips: boolean = false, lockModel: hero_lock_model[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]): boolean {
        for (let i = 0; i < lockModel.length; i++) {
            let m = lockModel[i];
            // if ([0, 1, 2, 3, 4, 5].indexOf(m) !== -1) {
            if (m >= 0 && m <= 5) {
                let model = ModelManager.get(HeroModel);
                let upList = model.curUpHeroList(m);
                if (upList.indexOf(heroInfo.heroId) != -1) {
                    if (showTips) {
                        let str = [
                            gdk.i18n.t("i18n:HERO_TIP43"),
                            gdk.i18n.t("i18n:HERO_TIP44"),
                            gdk.i18n.t("i18n:HERO_TIP57"),
                            gdk.i18n.t("i18n:HERO_TIP58"),
                            gdk.i18n.t("i18n:HERO_TIP59"),
                            gdk.i18n.t("i18n:HERO_TIP60"),
                        ]
                        GlobalUtil.showMessageAndSound(`${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP19"), str[m])}`)
                    }
                    return true;
                }
            }
            else if (m == 6) {
                let resonatingModel = ModelManager.get(ResonatingModel);
                if (resonatingModel.getHeroInUpList(heroInfo.heroId)) {
                    showTips && GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP55"))
                    return true;
                }
            }
            else if (m == 7) {
                if (ResonatingUtils.isHeroInAssistAllianceList(heroInfo.heroId)) {
                    showTips && GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP56"))
                    return true;
                }
            }
            else if (m == 8) {
                let mercenaryModel = ModelManager.get(MercenaryModel);
                let m_list = mercenaryModel.lentHeroList
                for (let i = 0; i < m_list.length; i++) {
                    if (m_list[i].heroId == heroInfo.heroId) {
                        showTips && GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:LOTTERY_TIP20"))
                        return true;
                    }
                }
            }
            else if (m == 9) {
                if (heroInfo.switchFlag) {
                    showTips && GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:LOTTERY_TIP21"))
                    return true;
                }
            }
            else if (m == 10) {
                let id = ModelManager.get(ActivityModel).awakeHeroId;
                if (id == heroInfo.heroId && !ActivityUtils.getAwakeStarUpFinish()) {
                    showTips && GlobalUtil.showMessageAndSound('该英雄已参与专属英雄升星活动');
                    return true;
                }
            } else if (m == 11) {
                let model = ModelManager.get(HeroModel);
                if (model.PvpArenaHonorUpHeroList.indexOf(heroInfo.heroId) != -1) {
                    showTips && GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP63"))
                    return true;
                }
            } else if (m == 12) {
                let model = ModelManager.get(BYModel);
                if (model.techResearchHeroList.indexOf(heroInfo.heroId) !== -1) {
                    showTips && GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP64"));
                    return true;
                }
            } else if (m == 13) {
                let c = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
                if (c.group[0] == 6 && heroInfo.mysticLink > 0) {
                    showTips && GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP82"));
                    return true;
                }
            } else if (m == 14) {
                let model = ModelManager.get(HeroModel);
                let upList = model.curUpHeroList(7);
                if (upList.indexOf(heroInfo.heroId) !== -1) {
                    if (showTips) {
                        GlobalUtil.showMessageAndSound(`${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP19"), gdk.i18n.t('i18n:HERO_TIP84'))}`)
                    }
                    return true;
                }
            } else if (m == 15) {
                let model = ModelManager.get(HeroModel);
                let upList = model.curUpHeroList(8);
                if (upList.indexOf(heroInfo.heroId) !== -1) {
                    if (showTips) {
                        GlobalUtil.showMessageAndSound(`${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP19"), gdk.i18n.t('i18n:HERO_TIP85'))}`)
                    }
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 返回英雄被占用的 模块Id
     * @param heroId 
     * @param excludeModel 
     */
    static getLockModelByHeroId(heroId: number, excludeModel: hero_lock_model[] = []): hero_lock_model[] {
        let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
        let curLockModel: hero_lock_model[] = [];
        if (!heroInfo) return curLockModel;
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
        //0-5
        let heroModel = ModelManager.get(HeroModel);
        for (let i = 0; i < 6; i++) {
            let upList = heroModel.curUpHeroList(i);
            if (upList.indexOf(heroInfo.heroId) != -1) {
                if (excludeModel.indexOf(i) == -1) {
                    curLockModel.push(i);
                }
            }
        }
        //6
        let resonatingModel = ModelManager.get(ResonatingModel);
        if (resonatingModel.getHeroInUpList(heroInfo.heroId)) {
            if (excludeModel.indexOf(6) == -1) {
                curLockModel.push(6);
            }
        }
        //7
        if (ResonatingUtils.isHeroInAssistAllianceList(heroInfo.heroId)) {
            if (excludeModel.indexOf(7) == -1) {
                curLockModel.push(7);
            }
        }
        //8
        let mercenaryModel = ModelManager.get(MercenaryModel);
        let m_list = mercenaryModel.lentHeroList
        for (let i = 0; i < m_list.length; i++) {
            if (m_list[i].heroId == heroInfo.heroId) {
                if (excludeModel.indexOf(8) == -1) {
                    curLockModel.push(8);
                }
            }
        }
        //9
        if (heroInfo.switchFlag) {
            if (excludeModel.indexOf(9) == -1) {
                curLockModel.push(9);
            }
        }
        //10
        let id = ModelManager.get(ActivityModel).awakeHeroId;
        if (id == heroInfo.heroId && !ActivityUtils.getAwakeStarUpFinish()) {
            if (excludeModel.indexOf(10) == -1) {
                curLockModel.push(10);
            }
        }
        //11
        if (heroModel.PvpArenaHonorUpHeroList.indexOf(heroInfo.heroId) != -1) {
            if (excludeModel.indexOf(11) == -1) {
                curLockModel.push(11);
            }
        }
        //12
        let byModel = ModelManager.get(BYModel);
        if (byModel.techResearchHeroList.indexOf(heroInfo.heroId) !== -1) {
            if (excludeModel.indexOf(12) == -1) {
                curLockModel.push(12);
            }
        }
        //13
        if (heroCfg.group[0] == 6 && heroInfo.mysticLink > 0) {
            if (excludeModel.indexOf(13) == -1) {
                curLockModel.push(13);
            }
        }
        //14
        let upList14 = heroModel.curUpHeroList(7);
        if (upList14.indexOf(heroInfo.heroId) != -1) {
            if (excludeModel.indexOf(14) == -1) {
                curLockModel.push(14);
            }
        }
        //15
        let upList15 = heroModel.curUpHeroList(8);
        if (upList15.indexOf(heroInfo.heroId) != -1) {
            if (excludeModel.indexOf(15) == -1) {
                curLockModel.push(15);
            }
        }
        return curLockModel;
    }

    /**英雄觉醒道具消耗 是否满足 */
    static getProgressOfAwake(typeId: number, curStar: number, awakeLv: number) {

        let awakeCfg = ConfigManager.getItemByField(Hero_awakeCfg, "hero_id", typeId, { star: curStar, awake_lv: awakeLv })
        if (!awakeCfg) {
            return [0, 0]
        }

        let replaceItemMaps = this.model.replaceItemIdMaps;
        //获取可用的替换材料id
        let getReplaceItems = (groups, star, maps = replaceItemMaps): number[] => {
            let itemIds: number[] = [];
            groups.forEach(group => {
                let ids = maps[group][star];
                if (ids && ids.length > 0) {
                    ids.forEach(id => {
                        let num = BagUtils.getItemNumById(id) || 0;
                        for (let i = 0; i < num; i++) {
                            let customId = parseInt(`${id}${i}`); // id+idx 同一道具保证id的唯一性  前6位固定为id
                            if (itemIds.indexOf(customId) == -1) {
                                itemIds.push(customId);
                            }
                        }
                    });
                }
            });
            return itemIds;
        };
        let needNum: number = 0;
        let hasNum: number = 0;
        let recordHeroList: number[] = [];
        for (let i = 0; i < 2; i++) {
            let cost = awakeCfg[`awake_item${i + 1}`];
            if (!cost && i == 0) {
                cost = [3, curStar, 1]; //模拟本体卡
            }
            if (cost && cost.length >= 3) {
                needNum += cost[2];
                let len: number = 0;
                if (cost[0] == 1 || cost[0] == 3) {
                    let b = gdk.panel.isOpenOrOpening(PanelId.Role2) || gdk.panel.isOpenOrOpening(PanelId.RoleView2) || gdk.panel.isOpenOrOpening(PanelId.SubHeroAwakePanel);
                    if (cost[0] == 3 && b && this.model.curHeroInfo && this.model.curHeroInfo.typeId == typeId && this.model.curHeroInfo.star == cost[1]) {
                        recordHeroList.push(this.model.curHeroInfo.heroId);
                        len += 1;
                    }
                    else {
                        let heroList = this.getHeroListByTypeId(typeId);
                        heroList.sort((a, b) => { return b.level - a.level; });
                        heroList.forEach(l => {
                            if (len < cost[2] && recordHeroList.indexOf(l.heroId) == -1) {
                                if (cost[0] == 3 ||
                                    cost[0] == 1 && !HeroUtils.heroLockCheck(l, false)) {
                                    if (l.star == cost[1]) {
                                        recordHeroList.push(l.heroId);
                                        len += 1;
                                    }
                                }
                            }
                        });
                    }
                }
                else if (cost[0] == 2) {
                    let heroList = this.getHerosByGroup(ConfigManager.getItemById(HeroCfg, typeId).group[0]);
                    heroList.forEach(l => {
                        if (len < cost[2]
                            && recordHeroList.indexOf(l.heroId) == -1
                            && !HeroUtils.heroLockCheck(l, false)) {
                            if (l.star == cost[1]) {
                                recordHeroList.push(l.heroId);
                                len += 1;
                            }
                        }
                    });

                    //替代材料
                    if (len < cost[2]) {
                        let groups: number[] = [ConfigManager.getItemById(HeroCfg, typeId).group[0]];
                        let replaceItems = getReplaceItems(groups, cost[1]);
                        replaceItems.forEach(id => {
                            if (len < cost[2] && recordHeroList.indexOf(id) == -1) {
                                recordHeroList.push(id);
                                len += 1;
                            }
                        })
                    }
                }
                else {
                    let heroList = this.getHerosByGroup(0);
                    heroList.forEach(l => {
                        if (len < cost[2]
                            && recordHeroList.indexOf(l.heroId) == -1
                            && !HeroUtils.heroLockCheck(l, false)) {
                            if (l.star == cost[1]) {
                                recordHeroList.push(l.heroId);
                                len += 1;
                            }
                        }
                    });
                    //替代材料
                    if (len < cost[2]) {
                        let groups: number[] = [1, 2, 3, 4, 5];
                        let replaceItems = getReplaceItems(groups, cost[1]);
                        replaceItems.forEach(id => {
                            if (len < cost[2] && recordHeroList.indexOf(id) == -1) {
                                recordHeroList.push(id);
                                len += 1;
                            }
                        })
                    }
                }
                hasNum += len;
            }
        }

        if (awakeCfg.awake_item3 && awakeCfg.awake_item3.length > 0) {
            let costItem = awakeCfg.awake_item3
            needNum += 1;
            if (BagUtils.getItemNumById(costItem[0]) >= costItem[1]) {
                hasNum += 1;
            }
        }
        return [hasNum, needNum];
    }


    /**获得英雄的最新模型 */
    static getHeroSkin(typeId, starNum: number = 0, mysticSkillLv: number = 0) {
        let heroCfg = ConfigManager.getItemById(HeroCfg, typeId)
        if (starNum >= heroCfg.star_max) {
            let awakeCfg = ConfigManager.getItemByField(Hero_awakeCfg, "hero_id", typeId, { star: heroCfg.star_max })
            if (awakeCfg) {
                return awakeCfg.ul_skin
            }
        }
        if (mysticSkillLv >= 16) {
            return `${heroCfg.skin}_jx`;
        }
        return heroCfg.skin
    }

    /**获得英雄的最新头像 */
    static getHeroHeadIcon(typeId, starNum: number = 0, isSmall: boolean = true) {
        let str = isSmall ? "_s" : ""
        let heroCfg = ConfigManager.getItemById(HeroCfg, typeId)
        if (starNum >= heroCfg.star_max) {
            let awakeCfg = ConfigManager.getItemByField(Hero_awakeCfg, "hero_id", typeId, { star: heroCfg.star_max })
            if (awakeCfg && awakeCfg.icon) {
                return `icon/hero/${awakeCfg.icon}${str}`
            }
        }
        return `icon/hero/${heroCfg.icon}${str}`
    }

    static getHeroAwakeLvs(typeId: number) {
        let lvs = [];
        let infos = this.model.heroInfos;
        infos.forEach(l => {
            if (l.itemId == typeId) {
                let s = this.model.heroAwakeStates[(<icmsg.HeroInfo>l.extInfo).heroId];
                if (s && s.awakeLv >= 0) {
                    if (lvs.indexOf(s.awakeLv) == -1) {
                        lvs.push(s.awakeLv);
                    }
                }
            }
        });
        return lvs;
    }

    static getMaxStarHeroInfo(): icmsg.HeroInfo {
        let upList = ModelManager.get(HeroModel).curUpHeroList(0);
        let maxHeroInfo: icmsg.HeroInfo;
        for (let i = 0; i < upList.length; i++) {
            let info = HeroUtils.getHeroInfoByHeroId(upList[i]);
            if (info && (!maxHeroInfo || maxHeroInfo.star < info.star)) {
                maxHeroInfo = info;
            }
        }
        return maxHeroInfo;
    }

    /**根据领悟等级 返回神秘者背景光效动作名 */
    static getMysticBgActName(lv: number) {
        let str = '';
        let cfgs = ConfigManager.getItems(Hero_undersand_levelCfg);
        for (let i = cfgs.length - 1; i >= 0; i--) {
            if (cfgs[i].undersand_level <= lv && cfgs[i].effect_res) {
                str = cfgs[i].effect_res;
                break;
            }
        }
        return str;
    }

    /**
     * 根据战斗下发技能数据 计算神秘者领悟等级
     * @param info icmsg.FightHero
     * @returns 
     */
    static getMysticSkillTotalLvByFightHero(info: icmsg.FightHero) {
        let cfg = ConfigManager.getItemById(HeroCfg, info.heroType);
        if (cfg.group[0] !== 6) return 0;
        let skillIds = [];
        let cfgs = ConfigManager.getItemsByField(Hero_careerCfg, 'career_id', info.careerId);
        cfgs.forEach(c => {
            c.ul_skill.forEach(id => {
                let items = ConfigManager.getItemsByField(SkillCfg, 'skill_id', id);
                if (items && items.length == 5 && skillIds.indexOf(id) == -1) {
                    skillIds.push(id);
                }
            });
        })

        let totalLv = 0;
        let ids = [];
        info.skills.forEach(skill => {
            if (skillIds.indexOf(skill.skillId) !== -1) {
                totalLv += skill.skillLv;
                ids.push(skill.skillId);
            }
        });
        return totalLv;
    }
}
