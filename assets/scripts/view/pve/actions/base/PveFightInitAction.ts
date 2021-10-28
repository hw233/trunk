import {
    Adventure_globalCfg,
    Energystation_advancedCfg,
    Expedition_buffCfg,
    Expedition_strengthenCfg,
    General_weapon_progressCfg, GuardianCfg, Guardian_copy_skillCfg, HeroCfg,
    Pieces_fetterCfg,
    VaultCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { CopyType } from '../../../../common/models/CopyModel';
import GeneralModel from '../../../../common/models/GeneralModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import HeroUtils from '../../../../common/utils/HeroUtils';
import AdventureModel from '../../../adventure/model/AdventureModel';
import EnergyModel from '../../../energy/model/EnergyModel';
import ExpeditionModel from '../../../guild/ctrl/expedition/ExpeditionModel';
import ExpeditionUtils from '../../../guild/ctrl/expedition/ExpeditionUtils';
import SiegeModel from '../../../guild/ctrl/siege/SiegeModel';
import PiecesUtils from '../../../pieces/utils/PiecesUtils';
import VaultModel from '../../../vault/model/VaultModel';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveSkillType } from '../../const/PveSkill';
import { PveFightType } from '../../core/PveFightModel';
import PveSceneState from '../../enum/PveSceneState';
import PveHeroModel from '../../model/PveHeroModel';
import PveSkillModel from '../../model/PveSkillModel';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';
import PveFightBaseAction from './PveFightBaseAction';

/**
 * Pve战斗对象初始化动作基类
 * @Author: sthoo.huang
 * @Date: 2019-04-12 11:54:11
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-24 10:01:09
 */

@gdk.fsm.action("PveFightInitAction", "Pve/Base")
export default class PveFightInitAction extends PveFightBaseAction {

    onEnter() {
        super.onEnter();
        this.ctrl.setAnimation(PveFightAnmNames.IDLE, {
            mode: 'set',
            loop: true,
        });
        // 额外的初始方法
        this.onEnterEx();
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (this.sceneModel.state !== PveSceneState.Fight) return;
        if (this.sceneModel.isDemo != true) {

            // 副本加技能检测-----------elite-------------------
            let addSkill = this.sceneModel.eliteStageUtil.addSkillIdData[this.model.type];
            if (addSkill) {
                if (this.model.type != PveFightType.Genral || this.model.ctrl.node.name != 'general_1') {
                    if (this.model.type == PveFightType.Hero) {

                        if (typeof addSkill === 'object') {
                            let tem = addSkill[0];
                            let soldier = (this.model as PveHeroModel).soldierType;
                            if (addSkill[soldier]) {
                                tem = tem.concat(addSkill[soldier])
                            }
                            for (let i = 0; i < tem.length; i++) {
                                // let temSKillLv: SkillIdLv = { skillId: tem[i], skillLv: 1 }
                                this.model.addSkill(tem[i], 1, true);
                            }
                        } else {
                            // let temSKillLv: SkillIdLv = { skillId: addSkill, skillLv: 1 }
                            // ids.push(temSKillLv)
                            this.model.addSkill(addSkill, 1, true);
                        }
                    } else if (cc.js.isNumber(addSkill)) {
                        // let temSKillLv: SkillIdLv = { skillId: addSkill, skillLv: 1 }
                        // ids.push(temSKillLv)
                        this.model.addSkill(addSkill, 1, true);
                    } else if (typeof addSkill === 'object') {
                        for (let i = 0; i < addSkill.length; i++) {
                            // let temSKillLv: SkillIdLv = { skillId: addSkill[i], skillLv: 1 }
                            // ids.push(temSKillLv)
                            this.model.addSkill(addSkill[i], 1, true);
                        }
                    }
                }

            }

            // 检测指定英雄技能
            let heroIDs = this.sceneModel.eliteStageUtil.addHeroIdData;
            if (heroIDs.length > 0 && this.model.type == PveFightType.Hero) {
                for (let i = 0; i < heroIDs.length; i++) {
                    if (heroIDs[i].indexOf(this.model.config.id) >= 0) {
                        let addskills = this.sceneModel.eliteStageUtil.addHeroSkillData[i];
                        if (cc.js.isNumber(addskills)) {
                            this.model.addSkill(addskills, 1, true);
                        } else {
                            for (let j = 0; j < addskills.length; j++) {
                                // let temSKillLv: SkillIdLv = { skillId: addskills[i], skillLv: 1 }
                                // ids.push(temSKillLv)
                                this.model.addSkill(addskills[j], 1, true);
                            }
                        }
                    }
                }
            }

            // 阵营技能
            let group = this.sceneModel.eliteStageUtil.upHerosAddSkills;
            if (group.length > 0 && this.model.type == PveFightType.Hero && this.sceneModel.stageConfig.copy_id != CopyType.RookieCup) {
                for (let i = 0; i < group.length; i++) {
                    // let temSKillLv: SkillIdLv = { skillId: group[i], skillLv: 1 }
                    // ids.push(temSKillLv)
                    this.model.addSkill(group[i], 1, true);
                }
            }

            //能量站增加光环
            if (this.model.type == PveFightType.Hero) {
                let energyInfo = ModelManager.get(EnergyModel).energyStationInfo;
                for (let key in energyInfo) {
                    let advanceId = energyInfo[key].advanceId;
                    let cfg = ConfigManager.getItemById(Energystation_advancedCfg, advanceId);
                    if (cfg) {
                        let skillId = cfg.camp;
                        let idx = cfg.index - 1;
                        while (!skillId && idx >= 0) {
                            let c = ConfigManager.getItemByField(Energystation_advancedCfg, 'index', idx);
                            skillId = c.camp;
                            if (!skillId) {
                                idx -= 1;
                            }
                        }
                        if (skillId) {
                            this.model.addSkill(skillId, 1, true);
                        }
                    }
                }
            }

            // 矿洞大作战天赋技能
            let mineData = this.sceneModel.eliteStageUtil.addMineSkillData;
            if (mineData.length > 0 && this.model.type == PveFightType.Hero) {
                let soldier = (this.model as PveHeroModel).soldierType;
                let addSkills: any[] = mineData[soldier];
                if (addSkills) {
                    // ids = ids.concat(); // 复制一份防止修改了原数据
                    addSkills.forEach((s: any) => {
                        // ids.push(skill);
                        this.model.addSkill(s.skillId, s.skillLv, true);
                    });
                }
            }

            // 对应塔位英雄加技能
            if (this.sceneModel.eliteStageUtil.addTowerIndexData.length > 0 && this.model.type == PveFightType.Hero) {
                let ctrl = (this.model as PveHeroModel).ctrl;
                let tower = this.sceneModel.eliteStageUtil.addTowerIndexData;
                if (tower.indexOf(ctrl.tower.id) >= 0) {
                    let tem = this.sceneModel.eliteStageUtil.addTowerSkillData;
                    for (let i = 0; i < tem.length; i++) {
                        // let temSKillLv: SkillIdLv = { skillId: tem[i], skillLv: 1 }
                        this.model.addSkill(tem[i], 1, true);
                    }
                }
            }

            // 对应塔位特定英雄加技能
            if (this.sceneModel.eliteStageUtil.addTowerHeroData.length > 0 && this.model.type == PveFightType.Hero) {
                let ctrl = (this.model as PveHeroModel).ctrl;
                let tower = this.sceneModel.eliteStageUtil.addTowerIndexData;
                for (let i = 0; i < tower.length; i++) {
                    let temData = tower[i];
                    if (ctrl.tower.id == temData[0] && this.model.config.id == temData[1]) {
                        let tem = this.sceneModel.eliteStageUtil.addTowerHeroSkillData[i];
                        for (let i = 0; i < tem.length; i++) {
                            // let temSKillLv: SkillIdLv = { skillId: tem[i], skillLv: 1 }
                            this.model.addSkill(tem[i], 1, true);
                        }
                    }
                }
            }

            //据点战buff处理
            if (this.sceneModel.stageConfig.copy_id == CopyType.NONE && this.sceneModel.arenaSyncData.fightType == 'FOOTHOLD') {
                this.sceneModel.eliteStageUtil.setFhPvpSkill(this.sceneModel.isMirror, false)
                let addskills = this.sceneModel.eliteStageUtil.fhPvpSkill
                if (addskills.length > 0 && this.model.type == PveFightType.Hero) {
                    for (let i = 0; i < addskills.length; i++) {
                        this.model.addSkill(addskills[i], 1, true);
                    }
                }
            }

            //据点集结战buff处理
            if (this.sceneModel.stageConfig.copy_id == CopyType.NONE && this.sceneModel.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
                this.sceneModel.eliteStageUtil.setFhPvpSkill(this.sceneModel.isMirror, true)
                let addskills = this.sceneModel.eliteStageUtil.fhPvpSkill
                if (addskills.length > 0 && this.model.type == PveFightType.Hero) {
                    for (let i = 0; i < addskills.length; i++) {
                        this.model.addSkill(addskills[i], 1, true);
                    }
                }
            }

            //殿堂指挥官加成
            if (this.model.type == PveFightType.Hero && this.sceneModel.stageConfig.copy_id == CopyType.NONE && !this.sceneModel.isMirror && this.sceneModel.arenaSyncData.fightType == 'VAULT') {
                let vaultModel = ModelManager.get(VaultModel)
                let cfg = ConfigManager.getItemById(VaultCfg, vaultModel.curPos + 1)
                let heroCfg: HeroCfg = this.model.config
                if (cfg.buff_group.indexOf(heroCfg.group[0]) >= 0) {
                    this.model.addSkill(cfg.buff_skill, 1, true);
                }
            }

            //神器精炼激活的技能
            if (this.model.type == PveFightType.Hero && ModelManager.get(GeneralModel).weaponRefineLv > 0) {
                let cfgs = ConfigManager.getItems(General_weapon_progressCfg, (cfg: General_weapon_progressCfg) => {
                    if (cfg.skill && cfg.skill.length > 0 && cfg.lv <= ModelManager.get(GeneralModel).weaponRefineLv) {
                        return true;
                    }
                });
                for (let i = 0; i < cfgs.length; i++) {
                    let skillIds = cfgs[i].skill;
                    skillIds.forEach(skill => {
                        this.model.addSkill(skill, 1, true);
                    })
                }
            }

            //丧尸攻城
            if (this.sceneModel.stageConfig.copy_id == CopyType.Siege) {
                let addskills = this.sceneModel.eliteStageUtil.addSiegeSkill
                if (addskills.length > 0 && this.model.type == PveFightType.Hero) {
                    let curSiegeCfg = ModelManager.get(SiegeModel).curSiegeCfg
                    let heroCfg: HeroCfg = this.model.config
                    if (curSiegeCfg && curSiegeCfg.camp_type.length > 0 && curSiegeCfg.camp_type.indexOf(heroCfg.group[0]) != -1) {
                        for (let i = 0; i < addskills.length; i++) {
                            this.model.addSkill(addskills[i], 1, true);
                        }
                    }
                }
            }

            //奇遇探险处理
            if (this.sceneModel.stageConfig.copy_id == CopyType.Adventure) {
                let advSkills = this.sceneModel.eliteStageUtil.addAdventureSkill[this.model.type]
                if (advSkills) {
                    if (this.model.type != PveFightType.Genral || this.model.ctrl.node.name != 'general_1') {
                        if (this.model.type == PveFightType.Hero) {
                            if (typeof advSkills === 'object') {
                                let tem = advSkills[0];
                                let soldier = (this.model as PveHeroModel).soldierType;
                                if (advSkills[soldier]) {
                                    tem = tem.concat(advSkills[soldier])
                                }
                                for (let i = 0; i < tem.length; i++) {
                                    this._checkAdventureSkill(tem[i])
                                }
                            } else {
                                this._checkAdventureSkill(advSkills)
                            }
                        } else if (cc.js.isNumber(advSkills)) {
                            this._checkAdventureSkill(advSkills)
                        } else if (typeof advSkills === 'object') {
                            for (let i = 0; i < advSkills.length; i++) {
                                this._checkAdventureSkill(advSkills[i])
                            }
                        }
                    }
                }
                // 检测指定英雄技能
                let heroIDs = this.sceneModel.eliteStageUtil.addAventureHeroIdData;
                if (heroIDs.length > 0 && this.model.type == PveFightType.Hero) {
                    for (let i = 0; i < heroIDs.length; i++) {
                        let temIds = heroIDs[i]
                        let index = temIds.indexOf(this.model.config.id)
                        if (index >= 0) {
                            let addskill = this.sceneModel.eliteStageUtil.addAventureHeroSkillData[i];
                            if (addskill) {
                                //this.model.addSkill(addskill, 1, true);
                                if (cc.js.isNumber(addskill)) {
                                    this._checkAdventureSkill(addskill)
                                } else if (typeof addskill === 'object') {
                                    for (let i = 0; i < addskill.length; i++) {
                                        this._checkAdventureSkill(addskill[i])
                                    }
                                }
                            }
                        }
                    }

                }

                //守护者技能
                if (this.sceneModel.stageConfig.copy_id == CopyType.Guardian && this.model.type == PveFightType.Hero) {
                    let info: icmsg.HeroInfo = <icmsg.HeroInfo>((<PveHeroModel>this.model).item.extInfo);
                    if (info.guardian) {
                        let c = ConfigManager.getItemById(GuardianCfg, info.guardian.id);
                        if (c) {
                            let cfg = ConfigManager.getItemById(Guardian_copy_skillCfg, c.color);
                            cfg && this.model.addSkill(cfg.skill, 1, true);
                        }
                    }
                }
            }

            //新奇遇探险处理
            if (this.sceneModel.stageConfig.copy_id == CopyType.NewAdventure) {
                let advSkills = this.sceneModel.eliteStageUtil.addAdventure2Skill[this.model.type]
                if (advSkills) {
                    if (this.model.type != PveFightType.Genral || this.model.ctrl.node.name != 'general_1') {
                        if (this.model.type == PveFightType.Hero) {
                            if (typeof advSkills === 'object') {
                                let tem = advSkills[0];
                                let soldier = (this.model as PveHeroModel).soldierType;
                                if (advSkills[soldier]) {
                                    tem = tem.concat(advSkills[soldier])
                                }
                                for (let i = 0; i < tem.length; i++) {
                                    this._checkAdventureSkill(tem[i])
                                }
                            } else {
                                this._checkAdventureSkill(advSkills)
                            }
                        } else if (cc.js.isNumber(advSkills)) {
                            this._checkAdventureSkill(advSkills)
                        } else if (typeof advSkills === 'object') {
                            for (let i = 0; i < advSkills.length; i++) {
                                this._checkAdventureSkill(advSkills[i])
                            }
                        }
                    }
                }
                // 检测指定英雄技能
                let heroIDs = this.sceneModel.eliteStageUtil.addAdventure2HeroIdData;
                if (heroIDs.length > 0 && this.model.type == PveFightType.Hero) {
                    for (let i = 0; i < heroIDs.length; i++) {
                        let temIds = heroIDs[i];
                        let index = temIds.indexOf(this.model.config.id)
                        if (index >= 0) {
                            let addskill = this.sceneModel.eliteStageUtil.addAdventure2HeroSkillData[i];
                            if (addskill) {
                                //this.model.addSkill(addskill, 1, true);
                                if (cc.js.isNumber(addskill)) {
                                    this._checkAdventureSkill(addskill)
                                } else if (typeof addskill === 'object') {
                                    for (let i = 0; i < addskill.length; i++) {
                                        this._checkAdventureSkill(addskill[i])
                                    }
                                }
                            }

                        }
                    }
                }

                //守护者技能
                if (this.sceneModel.stageConfig.copy_id == CopyType.Guardian && this.model.type == PveFightType.Hero) {
                    let info: icmsg.HeroInfo = <icmsg.HeroInfo>((<PveHeroModel>this.model).item.extInfo);
                    if (info.guardian) {
                        let c = ConfigManager.getItemById(GuardianCfg, info.guardian.id);
                        if (c) {
                            let cfg = ConfigManager.getItemById(Guardian_copy_skillCfg, c.color);
                            cfg && this.model.addSkill(cfg.skill, 1, true);
                        }
                    }
                }
            }

            //自走棋羁绊
            if (this.model.type == PveFightType.Genral && this.sceneModel.arenaSyncData && this.sceneModel.arenaSyncData.fightType == 'PIECES_CHESS') {
                let fetterIds = [];
                if (this.sceneModel.isMirror) {
                    fetterIds = PiecesUtils.getEnemyAllActiveFetterIds(this.sceneModel.towers);
                }
                else {
                    fetterIds = PiecesUtils.getALLActiveFetterIds();
                }
                if (fetterIds && fetterIds.length > 0) {
                    fetterIds.forEach(f => {
                        let c = ConfigManager.getItemById(Pieces_fetterCfg, f);
                        if (c) {
                            this.model.addSkill(c.skill_id, 1, true);
                        }
                    })
                }
            }

            //团队远征
            if (this.sceneModel.stageConfig.copy_id == CopyType.Expedition && this.model.type == PveFightType.Hero) {
                let m = ModelManager.get(ExpeditionModel);
                let heroDetails = HeroUtils.getHeroDetailById((<PveHeroModel>this.model).heroId);
                //部队强化加成
                let careerType = (<PveHeroModel>this.model).soldierType; // 1机枪 3炮兵 4守卫
                let expeCareer = [1, 1, 2, 3][careerType - 1]; //远征玩法 职业类型 1,2,3 
                let attrLvInfo = m.armyStrengthenStateMap[expeCareer];
                let attrKeys = ['atk', 'def', 'hp', 'dmg_add', 'dmg_res', 'attribute'];
                attrKeys.forEach((key, idx) => {
                    let lv = attrLvInfo[idx];
                    let c = ConfigManager.getItem(Expedition_strengthenCfg, (cfg: Expedition_strengthenCfg) => {
                        if (cfg.professional_type == expeCareer && cfg.type == idx + 1 && cfg.level == lv) {
                            return true;
                        }
                    });
                    if (c && c[key] > 0) {
                        let v = c[key] / 10000;
                        switch (key) {
                            case 'atk':
                            case 'def':
                            case 'hp':
                                this.model._basePropTarget[key] += Math.ceil(heroDetails.attr[`${key}W`] * v);
                                if (key == 'hp') {
                                    this.model.hpMax = this.model.getProp('hp');
                                    this.model.hp = this.model.hpMax;
                                }
                                break;
                            case 'dmg_add':
                            case 'dmg_res':
                                this.model._basePropTarget[key] += v;
                                break;
                            case 'attribute':
                                let extraAttrs = ['cold_res', 'elec_res', 'fire_res', 'punc_res', 'radi_res', 'atk_res',
                                    'dmg_cold', 'dmg_elec', 'dmg_fire', 'dmg_punc', 'dmg_radi', 'atk_dmg'];
                                extraAttrs.forEach(a => {
                                    this.model._basePropTarget[a] += v;
                                });
                                break;
                            default:
                                break;
                        }
                    }
                });
                //部队特权   
                let armyLv = m.armyLv;
                this.model._basePropTarget.atk += ExpeditionUtils.getPrivilegeNum(armyLv, 1);
                this.model._basePropTarget.def += ExpeditionUtils.getPrivilegeNum(armyLv, 2);
                this.model._basePropTarget.hp += ExpeditionUtils.getPrivilegeNum(armyLv, 3);
                this.model.hpMax = this.model.getProp('hp');
                this.model.hp = this.model.hpMax;
                //部队总强化触发技能加成
                for (let i = 0; i < 3; i++) {
                    let totalLv = ExpeditionUtils.getTotalStrengthenLvByCareer(i + 1);
                    let buffCfg = ConfigManager.getItemByField(Expedition_buffCfg, 'professional_type', i + 1, { strengthen_level: totalLv });
                    if (buffCfg && buffCfg.buff_id) {
                        this.model.addSkill(buffCfg.buff_id, 1, true);
                    }
                }
                // 上阵英雄战力/关卡推荐战力  属性加成
                let ration = ExpeditionUtils.getRatioByPower(this.sceneModel.totalPower, this.sceneModel.stageConfig.id);
                this.model._basePropTarget.atk += Math.ceil(heroDetails.attr.atkW * (ration / 10000));
                this.model._basePropTarget.def += Math.ceil(heroDetails.attr.defW * (ration / 10000));
                this.model._basePropTarget.hp += Math.ceil(heroDetails.attr.hpW * (ration / 10000));
                this.model.hpMax = this.model.getProp('hp');
                this.model.hp = this.model.hpMax;
            }

            //皇家竞技场怪物随机技能处理
            if (this.sceneModel.stageConfig.copy_id == CopyType.NONE && (this.sceneModel.arenaSyncData.fightType == 'ROYAL' || this.sceneModel.arenaSyncData.fightType == 'ROYAL_TEST')) {
                // this.sceneModel.eliteStageUtil.setFhPvpSkill(this.sceneModel.isMirror, false)
                // let addskills = this.sceneModel.eliteStageUtil.fhPvpSkill
                let rmodel = ModelManager.get(RoyalModel)
                if (rmodel.addSkillId && this.model.type == PveFightType.Enemy) {
                    this.model.addSkill(rmodel.addSkillId, 1, true);
                }
            }
            //指挥官 好友助力加成
            if (!this.sceneModel.isMirror && this.model.type == PveFightType.Genral && this.model.ctrl.node.name != 'general_1') {
                //获取好友助力的加成技能
                let cfgs = ActivityUtils.getPlatformConfigs(102);
                let skillId = 0;
                cfgs.forEach(cfg => {
                    let status = ActivityUtils.getPlatformTaskStatue(cfg);
                    if (status > 0) {
                        skillId = cfg.reward[0][0]
                    }
                })
                if (skillId > 0) {
                    this.model.addSkill(skillId, 1, true);
                }
            }

            // 增加光环
            let skills = this.model.skills;
            for (let i = 0, n = skills.length; i < n; i++) {
                let s = skills[i];
                if (PveSkillType.isHalo(s.type)) {
                    // 技能类型为光环技能，则主动使用
                    let model: PveSkillModel = PvePool.get(PveSkillModel);
                    model.config = s.prop;
                    model.attacker = this.ctrl;
                    if (s.prop.target_type != 18 && s.prop.target_type != 9998 && cc.js.isNumber(s.prop.dmg_range) && s.prop.dmg_range > 0) {
                        // 设置默认坐标
                        model.targetPos = this.ctrl.getPos().clone();
                        model.targetRect = this.ctrl.getRect();
                    } else {
                        model.addTarget(this.ctrl);
                    }
                    PveTool.useSkill(model, this.ctrl.sceneModel);
                }
            }
        }


        this.model.startPos = this.model.ctrl.getPos().clone();
        this.finish();
    }

    /**奇景探险特殊词条处理 */
    _checkAdventureSkill(skillId) {
        let entry1 = ConfigManager.getItemById(Adventure_globalCfg, "entry1").value//仅在第三层中,所有英雄增加攻防
        let entry1Id = entry1.length > 0 ? entry1[0] : 0
        let entry2 = ConfigManager.getItemById(Adventure_globalCfg, "entry2").value//每战斗一场，伤害提升
        let entry2Id = entry2.length > 0 ? entry2[0] : 0
        let entry3 = ConfigManager.getItemById(Adventure_globalCfg, "entry3").value//每战斗一场，免伤提升
        let entry3Id = entry3.length > 0 ? entry3[0] : 0
        let entry4 = ConfigManager.getItemById(Adventure_globalCfg, "entry4").value//每隔多少场战斗触发 配置
        let entry4Id = entry4.length > 0 ? entry4[0] : 0
        let entry4_times = ConfigManager.getItemById(Adventure_globalCfg, "entry4_times").value[0]//每隔多少场战斗触发 配置
        let advModel = ModelManager.get(AdventureModel)
        let skillDic = {}
        if (skillId == entry2Id || skillId == entry3Id) {
            this.model.addSkill(skillId, advModel.fightTimes + 1, true);
        } else if (skillId == entry1Id) {
            if (advModel.layerId == 3) {
                this.model.addSkill(skillId, 1, true);
            }
        } else if (skillId == entry4Id) {
            if (advModel.fightTimes % entry4_times == 0) {
                this.model.addSkill(skillId, 1, true);
            }
        } else {
            if (skillDic[skillId]) {
                skillDic[skillId] += 1
            } else {
                skillDic[skillId] = 1
            }
            this.model.addSkill(skillId, skillDic[skillId], true);
        }
    }

    // 如果需要扩展onEnter，则扩展此方法
    onEnterEx() {

    }
}