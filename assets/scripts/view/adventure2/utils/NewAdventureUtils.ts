import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../model/NewAdventureModel';
import {
    Adventure2_adventureCfg,
    Adventure2_globalCfg,
    Adventure2_heroCfg,
    Adventure2_hireCfg,
    Adventure2_themeheroCfg,
    SkillCfg
    } from '../../../a/config';
import { BagItem, BagType } from '../../../common/models/BagModel';

export default class NewAdventureUtils {

    static get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    /**活动类型 */
    static get actRewardType() {
        let actType = ActUtil.getActRewardType(this.adventureModel.actId);
        return actType
    }


    /**通关的难度 */
    static passDifficulty(): number[] {
        let tem = [];
        for (let i = 1; i <= 3; i++) {
            if (i < this.adventureModel.difficulty) {
                tem.push(i)
            } else if (i == this.adventureModel.difficulty) {
                if (this.isLayerPass(i, 1)) {
                    tem.push(i)
                }
            }
        }
        return tem
    }

    /**
   * 获取通行证奖励是否领取
   * @param id 
   * @param type 
   */
    static getPassPortRewardState(id: number, type: number) {
        let model = this.adventureModel//ModelManager.get(AdventureModel);
        let idx = (id - 1) % 100;
        let reward = type == 1 ? model.passPortFreeReward : model.passPortChargeReward;
        let old = reward[Math.floor(idx / 8)];
        if ((old & 1 << idx % 8) >= 1) return true;
        else return false
    }

    static getNextDifficulOpenInfo() {
        let time = 0
        let actCfg = ActUtil.getCfgByActId(this.adventureModel.actId);
        if (actCfg) {
            let cfg = ConfigManager.getItemByField(Adventure2_themeheroCfg, 'type', actCfg.reward_type, { difficulty: this.adventureModel.difficulty + 1 });
            let curTime = GlobalUtil.getServerTime();
            let startTime = ActUtil.getActStartTime(this.adventureModel.actId);
            let time = cfg.unlocktime;
            let unLockTime = startTime + (time[2] * 24 * 60 * 60 + time[3] * 60 * 60 + time[4] * 60) * 1000;
            if (unLockTime > curTime) {
                return { time: unLockTime - curTime, name: cfg.difficulty_name }
            }
        }
        return { time: time, name: "" }
    }
    /**
* 创建英雄BagItem数据
* @param hero 
*/
    static createHeroBagItem(advHero: icmsg.Adventure2Hero): BagItem {
        let item = this.createHeroBagItemBy(advHero);
        //let extInfo = item.extInfo as icmsg.HeroInfo;
        //extInfo.power = 0;
        // extInfo.heroId = advHero.heroId % 300000;
        // item.series = 900000 + advHero.heroId;
        return item;
    }

    static createHeroBagItemBy(advHero: icmsg.Adventure2Hero): BagItem {
        let extInfo = new icmsg.HeroInfo();
        //let temCfg = ConfigManager.getItem(Adventure2_hireCfg, { 'group': advHero.group, hero: advHero.typeId })
        extInfo.heroId = advHero.heroId
        extInfo.typeId = advHero.typeId//temCfg.hero;
        extInfo.careerId = advHero.careerId//temCfg.career_id;
        extInfo.soldierId = advHero.soldierId//temCfg.soldier_id;
        extInfo.star = advHero.star//this.getHeroStar(this.adventureModel.avgLevel)//temCfg.hero_star;
        extInfo.level = advHero.level//this.adventureModel.avgLevel;
        extInfo.power = advHero.power//this.getHeroPower(temCfg)
        extInfo.slots = []
        // extInfo.mastery = [];
        //extInfo.careers = [new HeroCareer({ careerId: brief.careerId, careerLv: brief.careerLv })];
        //extInfo.extra = null;
        extInfo.status = 0;
        return {
            series: advHero.heroId,//+ 900000,
            itemId: advHero.typeId,//temCfg.hero,
            itemNum: 1,
            type: BagType.HERO,
            extInfo: extInfo,
        };
    }
    //获取助战英雄数据
    static createHeroFightHero(advHero: icmsg.Adventure2Hero): icmsg.FightHero {
        let hero = new icmsg.FightHero();
        let heroCfg = ConfigManager.getItem(Adventure2_hireCfg, { 'group': advHero.group, hero: advHero.typeId });
        hero.heroId = advHero.heroId;
        hero.heroLv = this.adventureModel.avgLevel
        hero.careerId = heroCfg.career_id;
        hero.careerLv = 1;
        hero.attr = new icmsg.FightAttr();
        let num = ConfigManager.getItemById(Adventure2_globalCfg, "average_coefficient").value[0]
        hero.attr.atk = Math.floor(heroCfg.hero_atk * this.adventureModel.avgPower * num / 1000000)
        hero.attr.hp = Math.floor(heroCfg.hero_hp * this.adventureModel.avgPower * num / 1000000)
        hero.attr.maxHp = Math.floor(heroCfg.hero_hp * this.adventureModel.avgPower * num / 1000000)
        hero.attr.def = Math.floor(heroCfg.hero_def * this.adventureModel.avgPower * num / 1000000)
        hero.attr.hit = Math.floor(heroCfg.hero_hit * this.adventureModel.avgPower * num / 1000000)
        hero.attr.dodge = Math.floor(heroCfg.hero_dodge * this.adventureModel.avgPower * num / 1000000)
        hero.heroPower = this.getHeroPower(heroCfg)
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
        hero.soldier.atk = 0//heroCfg.soldier_atk;
        hero.soldier.hp = 0//heroCfg.soldier_hp;
        hero.soldier.def = 0//heroCfg.soldier_def;
        hero.soldier.hit = 0//heroCfg.soldier_hit;
        hero.soldier.dodge = 0//heroCfg.soldier_dodge;
        //hero.soldier.level = 1;
        // hero.soldier.crit = 0
        hero.soldier.atkSpeed = 0
        hero.soldier.dmgAdd = 0
        hero.soldier.dmgRes = 0
        // hero.soldier.critV = 0
        // hero.soldier.critVRes = 0
        // hero.soldier.atkSpeedR = 0
        hero.soldier.skills = []
        // heroCfg.soldier_skills.forEach(skillId => {
        //   let skillData = new FightSkill();
        //   skillData.skillId = skillId;
        //   skillData.skillLv = 1;
        //   hero.soldier.skills.push(skillData)
        // })

        return hero;
    }

    static getHeroPower(hireCfg: Adventure2_hireCfg) {
        let num = ConfigManager.getItemById(Adventure2_globalCfg, "average_coefficient").value[0]
        let heroObj = {
            "atk": Math.floor(hireCfg.hero_atk * this.adventureModel.avgPower * num / 1000000),
            "hp": Math.floor(hireCfg.hero_hp * this.adventureModel.avgPower * num / 1000000),
            "def": Math.floor(hireCfg.hero_def * this.adventureModel.avgPower * num / 1000000),
            "hit": Math.floor(hireCfg.hero_hit * this.adventureModel.avgPower * num / 1000000),
            "dodge": Math.floor(hireCfg.hero_dodge * this.adventureModel.avgPower * num / 1000000),
        }
        return GlobalUtil.getPowerValue(heroObj)
    }

    static getHeroStar(level) {
        let cfgs = ConfigManager.getItems(Adventure2_heroCfg)
        for (let i = 0; i < cfgs.length; i++) {
            if (level >= cfgs[i].level[0] && level <= cfgs[i].level[1]) {
                return cfgs[i].id
            }
        }
        return 5
    }

    static getHireHero(series): icmsg.Adventure2Hero {
        let model = this.adventureModel;
        let heros = model.normal_giveHeros
        for (let i = 0; i < heros.length; i++) {
            //if (heros[i].heroId + 900000 == series) {
            if (heros[i].heroId == series) {
                return heros[i]
            }
        }
        return null
    }

    //判断当前类型的
    static isLayerPass(difficulty: number = 1, layerId: number = 1) {
        let isPass = false
        let actCfg = ActUtil.getCfgByActId(this.adventureModel.actId);
        if (actCfg) {
            //let difficulty = difficulty//type == 1 ? this.adventureModel.difficulty : 4;
            let advCfgs = ConfigManager.getItems(Adventure2_adventureCfg, { difficulty: difficulty, layer_id: layerId })
            let plateIndex = difficulty < 4 ? this.adventureModel.normal_plateIndex : this.adventureModel.endless_plateIndex
            let plateFinish = difficulty < 4 ? this.adventureModel.normal_plateFinish : this.adventureModel.endless_plateFinish
            if (difficulty < 4) {
                if (difficulty < this.adventureModel.difficulty || (difficulty == this.adventureModel.difficulty && plateIndex == advCfgs.length - 1 && plateFinish)) {
                    isPass = true
                }
            } else {
                if (plateIndex == advCfgs.length - 2 && plateFinish) {
                    isPass = true
                }
            }
        }
        return isPass
    }

    static isNextDifficulOpen(difficulty: number) {
        let isOpen = false
        let actCfg = ActUtil.getCfgByActId(this.adventureModel.actId);
        if (actCfg) {
            let cfg = ConfigManager.getItemByField(Adventure2_themeheroCfg, 'type', actCfg.reward_type, { difficulty: difficulty });
            let curTime = GlobalUtil.getServerTime();
            let startTime = ActUtil.getActStartTime(this.adventureModel.actId);
            let time = cfg.unlocktime;
            let unLockTime = startTime + (time[2] * 24 * 60 * 60 + time[3] * 60 * 60 + time[4] * 60) * 1000;
            if (curTime >= unLockTime) {
                return true
            }
            return isOpen
        }
    }

    /**
   * 210013引导点击奇趣娃娃机
   * 210017点击娃娃机 免费抓按钮
   * 210015点击奇趣商店
   * 210016点击奇趣商店 里的积分
   *  */
    static setGuideStep(guideId) {
        //引导点击奇趣娃娃机
        let hasGuideIds: number[] = GlobalUtil.getLocal(this.adventureModel.localStr) || []
        let isGuide = false
        if (hasGuideIds.indexOf(guideId) != -1) {
            isGuide = true
        }
        if (!isGuide) {
            hasGuideIds.push(guideId)
            GlobalUtil.setLocal(this.adventureModel.localStr, hasGuideIds)
            GuideUtil.setGuideId(guideId)
        }
    }
}


