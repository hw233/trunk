import ActUtil from '../../act/util/ActUtil';
import AdventureModel from '../model/AdventureModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import ModelManager from '../../../common/managers/ModelManager';
import {
  Adventure_globalCfg,
  Adventure_heroCfg,
  Adventure_hireCfg,
  Adventure_themeheroCfg,
  AdventureCfg,
  SkillCfg
  } from '../../../a/config';
import { BagItem, BagType } from '../../../common/models/BagModel';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-11 10:36:07 
  */
export default class AdventureUtils {

  static get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

  /**
   * 获取通行证奖励是否领取
   * @param id 
   * @param type 
   */
  static getPassPortRewardState(id: number, type: number) {
    let model = ModelManager.get(AdventureModel);
    let idx = (id - 1) % 100;
    let reward = type == 1 ? model.passPortFreeReward : model.passPortChargeReward;
    let old = reward[Math.floor(idx / 8)];
    if ((old & 1 << idx % 8) >= 1) return true;
    else return false
  }


  /**
 * 创建英雄BagItem数据
 * @param hero 
 */
  static createHeroBagItem(advHero: icmsg.AdventureHero): BagItem {
    let item = this.createHeroBagItemBy(advHero);
    let extInfo = item.extInfo as icmsg.HeroInfo;
    //extInfo.power = 0;
    extInfo.heroId = advHero.heroId % 300000;
    item.series = 900000 + advHero.heroId;
    return item;
  }

  static createHeroBagItemBy(advHero: icmsg.AdventureHero): BagItem {
    let extInfo = new icmsg.HeroInfo();
    let temCfg = ConfigManager.getItem(Adventure_hireCfg, { 'group': advHero.group, hero: advHero.typeId })
    extInfo.heroId = advHero.heroId
    extInfo.typeId = temCfg.hero;
    extInfo.careerId = temCfg.career_id;
    extInfo.soldierId = temCfg.soldier_id;
    extInfo.star = this.getHeroStar(this.adventureModel.avgLevel)//temCfg.hero_star;
    extInfo.level = this.adventureModel.avgLevel;
    extInfo.power = this.getHeroPower(temCfg)
    extInfo.slots = []
    // extInfo.mastery = [];
    //extInfo.careers = [new HeroCareer({ careerId: brief.careerId, careerLv: brief.careerLv })];
    //extInfo.extra = null;
    extInfo.status = 0;
    return {
      series: advHero.heroId + 900000,
      itemId: temCfg.hero,
      itemNum: 1,
      type: BagType.HERO,
      extInfo: extInfo,
    };
  }

  //获取助战英雄数据
  static createHeroFightHero(advHero: icmsg.AdventureHero): icmsg.FightHero {
    let hero = new icmsg.FightHero();
    let heroCfg = ConfigManager.getItem(Adventure_hireCfg, { 'group': advHero.group, hero: advHero.typeId });
    hero.heroId = advHero.heroId;
    hero.heroLv = this.adventureModel.avgLevel
    hero.careerId = heroCfg.career_id;
    hero.careerLv = 1;
    hero.attr = new icmsg.FightAttr();
    let num = ConfigManager.getItemById(Adventure_globalCfg, "average_coefficient").value[0]
    hero.attr.atk = Math.floor(heroCfg.hero_atk * this.adventureModel.avgPower * num)
    hero.attr.hp = Math.floor(heroCfg.hero_hp * this.adventureModel.avgPower * num)
    hero.attr.maxHp = Math.floor(heroCfg.hero_hp * this.adventureModel.avgPower * num)
    hero.attr.def = Math.floor(heroCfg.hero_def * this.adventureModel.avgPower * num)
    hero.attr.hit = Math.floor(heroCfg.hero_hit * this.adventureModel.avgPower * num)
    hero.attr.dodge = Math.floor(heroCfg.hero_dodge * this.adventureModel.avgPower * num)
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

  static getHeroPower(hireCfg: Adventure_hireCfg) {
    let num = ConfigManager.getItemById(Adventure_globalCfg, "average_coefficient").value[0]
    let heroObj = {
      "atk": Math.floor(hireCfg.hero_atk * this.adventureModel.avgPower * num),
      "hp": Math.floor(hireCfg.hero_hp * this.adventureModel.avgPower * num),
      "def": Math.floor(hireCfg.hero_def * this.adventureModel.avgPower * num),
      "hit": Math.floor(hireCfg.hero_hit * this.adventureModel.avgPower * num),
      "dodge": Math.floor(hireCfg.hero_dodge * this.adventureModel.avgPower * num),
    }
    return GlobalUtil.getPowerValue(heroObj)
  }

  static getHireHero(series): icmsg.AdventureHero {
    let model = ModelManager.get(AdventureModel);
    let heros = model.giveHeros
    for (let i = 0; i < heros.length; i++) {
      if (heros[i].heroId + 900000 == series) {
        return heros[i]
      }
    }
    return null
  }


  //当前层数是否打通
  static isLayerPass() {
    let isPass = false
    let actCfg = ActUtil.getCfgByActId(this.adventureModel.actId);
    if (actCfg) {
      let advCfgs = ConfigManager.getItems(AdventureCfg, { difficulty: this.adventureModel.difficulty, layer_id: this.adventureModel.layerId, type: actCfg.reward_type })
      if (this.adventureModel.plateIndex == advCfgs.length - 1 && this.adventureModel.plateFinish) {
        isPass = true
      }
    }
    return isPass
  }

  static isNextDifficulOpen() {
    let isOpen = false
    let actCfg = ActUtil.getCfgByActId(this.adventureModel.actId);
    if (actCfg) {
      let cfg = ConfigManager.getItemByField(Adventure_themeheroCfg, 'type', actCfg.reward_type, { difficulty: this.adventureModel.difficulty + 1 });
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


  static getNextDifficulOpenInfo() {
    let time = 0
    let actCfg = ActUtil.getCfgByActId(this.adventureModel.actId);
    if (actCfg) {
      let cfg = ConfigManager.getItemByField(Adventure_themeheroCfg, 'type', actCfg.reward_type, { difficulty: this.adventureModel.difficulty + 1 });
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

  static getHeroStar(level) {
    let cfgs = ConfigManager.getItems(Adventure_heroCfg)
    for (let i = 0; i < cfgs.length; i++) {
      if (level >= cfgs[i].level[0] && level <= cfgs[i].level[1]) {
        return cfgs[i].id
      }
    }
    return 5
  }


  /**活动类型 */
  static get actRewardType() {
    let actCfg = ActUtil.getCfgByActId(this.adventureModel.actId);
    if (actCfg) {
      return actCfg.reward_type
    }
    return 1
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
