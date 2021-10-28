import AdventureModel from '../../adventure/model/AdventureModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyUtil from '../../../common/utils/CopyUtil';
import FootHoldModel, { FhPointInfo } from '../../guild/ctrl/footHold/FootHoldModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import MilitaryRankUtils from '../../guild/ctrl/militaryRank/MilitaryRankUtils';
import MineModel from '../../act/model/MineModel';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../../adventure2/model/NewAdventureModel';
import NewAdventureUtils from '../../adventure2/utils/NewAdventureUtils';
import PveSceneModel from '../model/PveSceneModel';
import RoleModel from '../../../common/models/RoleModel';
import SiegeModel from '../../guild/ctrl/siege/SiegeModel';
import {
    Activitycave_giftCfg,
    Activitycave_stageCfg,
    Adventure_entryCfg,
    Adventure2_randomCfg,
    Adventure2_themeheroCfg,
    Copy_hardcoreCfg,
    Copy_towerhaloCfg,
    Copyultimate_stageCfg,
    Foothold_ascensionCfg,
    Foothold_baseCfg,
    Foothold_towerCfg
    } from '../../../a/config';
import { Copysurvival_stageCfg } from './../../../a/config';
import { CopyType } from './../../../common/models/CopyModel';
import { MRPrivilegeType } from '../../guild/ctrl/militaryRank/MilitaryRankViewCtrl';
import { PveFightType } from '../core/PveFightModel';
import { SkillIdLv } from '../model/PveBaseFightModel';

/** 
 * Pve精英关卡条件控制器
 * @Author: yaozu.hu
 * @Date: 2019-09-26 17:21:51
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-26 21:55:55
 */
export default class PveEliteStageUtil {

    maxUpHeroNum: number = 0;
    maxUpHeroNum_Woker: number = 0;
    careerLimit: any = [];
    soldierTypeLimit: number[] = [];
    addSkillIdData: any = {};
    general: boolean = true;

    addHeroIdData: any[] = [];
    addHeroSkillData: any[] = [];
    stopGeneral: number[] = [];
    //
    addMineSkillData: any[] = [];
    //上阵英雄阵营加成技能
    upHerosAddSkills: number[] = []
    groupMaxtype: number = 0;
    groupMaxNum: number = 0;
    //塔位技能
    addTowerIndexData: number[] = []
    addTowerSkillData: number[] = []
    //塔位特定英雄技能
    addTowerHeroData: number[][] = []
    addTowerHeroSkillData: number[][] = []
    //据点战词条加成
    fhPvpSkill: number[] = []

    //奇遇探险词条加成
    addAdventureSkill: any = {}
    addAventureHeroIdData: any[] = []
    addAventureHeroSkillData: any[] = []

    //新奇遇探险词条加成
    addAdventure2Skill: any = {}
    addAdventure2HeroIdData: any[] = []
    addAdventure2HeroSkillData: any[] = []

    //丧尸攻城词条
    addSiegeSkill: number[] = []

    //固定塔位英雄大小
    towerScaleIndexData: number[] = []
    towerScaleNumData: number[] = []
    towerShowSoldierTypeFlag: boolean = true;

    // 设置副本条件数据
    setCurStageData(sceneModel: PveSceneModel) {
        let cfg = sceneModel.stageConfig;
        this.clearData();
        // 生存副本默认最大上阵英雄数
        if (cfg.copy_id == CopyType.Survival) {
            let stageCfg: Copysurvival_stageCfg = CopyUtil.getStageConfig(CopyUtil.getSurvivalLastStageId() || cfg.id) as any;
            this.maxUpHeroNum = stageCfg.num + stageCfg.num_worker;;
            this.maxUpHeroNum_Woker = stageCfg.num_worker;
        }
        if (cfg.copy_id == CopyType.Mine) {
            let stageCfg: Activitycave_stageCfg = CopyUtil.getStageConfig(cfg.id) as any;
            this.maxUpHeroNum = stageCfg.num;
            this.maxUpHeroNum_Woker = stageCfg.num_worker;
        }

        if (cfg.copy_id == CopyType.Ultimate) {
            let stageCfg: Copyultimate_stageCfg = CopyUtil.getStageConfig(cfg.id) as any;
            this.maxUpHeroNum = stageCfg.num;
        }

        let hardcoreList: number[] = cfg.hardcoreList || [];
        if (cfg.copy_id == CopyType.FootHold) {
            let footHoldModel = ModelManager.get(FootHoldModel)
            let roleModel = ModelManager.get(RoleModel)
            let fhPointInfo: FhPointInfo = footHoldModel.warPoints[`${footHoldModel.pointDetailInfo.pos.x}-${footHoldModel.pointDetailInfo.pos.y}`]

            let cords = []
            if (fhPointInfo && fhPointInfo.addState.length > 0) {
                cords = fhPointInfo.addState
                for (let i = 0; i < cords.length; i++) {
                    let towerIndex = fhPointInfo.effectTowers[i]
                    let towerCfg = ConfigManager.getItemByField(Foothold_towerCfg, "tower_id", towerIndex)
                    if (cords[i] == 1) {
                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[0][0])
                    } else if (cords[i] == 2) {
                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[1][0])
                    } else if (cords[i] == 3) {
                        let points = footHoldModel.radioTypePoints[`${towerIndex}`] || []
                        for (let i = 0; i < points.length; i++) {
                            let info: FhPointInfo = points[i]
                            if (info.fhPoint && info.bonusType == 0 && info.fhPoint.guildId > 0 && info.fhPoint.guildId != roleModel.guildId && info.bonusId == towerIndex) {
                                hardcoreList = hardcoreList.concat(towerCfg.buff_effect[2][0])
                            }
                        }
                    }
                }
            }

            //军衔相关词条
            let coreList = MilitaryRankUtils.getPrivilegeHardCore(MRPrivilegeType.p7, footHoldModel.militaryRankLv)
            hardcoreList = hardcoreList.concat(coreList)
        }
        if (hardcoreList instanceof Array && hardcoreList.length > 0) {
            this.setHardcoreData(hardcoreList)
        };
        this.setUpHerosAddSkills(sceneModel);
    }

    setHardcoreData(hardcoreList: number[]) {
        hardcoreList.forEach(id => {
            let temCfg = ConfigManager.getItemById(Copy_hardcoreCfg, id);
            if (temCfg) {
                switch (temCfg.type) {
                    case 1:
                        // 最大上阵英雄
                        this.maxUpHeroNum = temCfg.data || 0
                        break;
                    case 10:
                        // 英雄职业限制
                        this.careerLimit = temCfg.data || [];
                        break;
                    case 20:
                        // 塔位英雄类型限制
                        this.soldierTypeLimit = temCfg.data || [];
                        break;
                    case 21:
                        // 塔位英雄类型限制，并不显示塔位英雄推荐标识
                        this.soldierTypeLimit = temCfg.data || [];
                        this.towerShowSoldierTypeFlag = false;
                        break;
                    case 4:
                        // 指定英雄
                        let index = this.addHeroIdData.indexOf(temCfg.target)
                        if (index < 0) {
                            this.addHeroIdData.push(temCfg.target);
                            this.addHeroSkillData.push(temCfg.data);
                        } else {
                            this.addHeroSkillData[index] = this.addHeroSkillData[index].concat(temCfg.data);
                        }
                        break;
                    case 2:
                        // 技能
                        let type: PveFightType = temCfg.target;
                        if (!this.addSkillIdData[type]) {
                            this.addSkillIdData[type] = type == PveFightType.Hero ? { 0: [] } : [];
                        }
                        if (type == PveFightType.Hero) {
                            let tem = this.addSkillIdData[type];
                            if (typeof temCfg.data === 'object') {
                                if (tem[temCfg.data[0]]) {
                                    tem[temCfg.data[0]] = tem[temCfg.data[0]].concat(temCfg.data[1]);
                                } else {
                                    tem[temCfg.data[0]] = [temCfg.data[1]];
                                }
                            } else {
                                tem[0] = tem[0].concat(temCfg.data);
                            }
                        } else {
                            this.addSkillIdData[type] = this.addSkillIdData[type].concat(temCfg.data);
                        }
                        break;
                    case 3:
                        // 指挥官
                        this.general = false;
                        break;
                    case 5:
                        // 禁用指挥官指定技能
                        this.stopGeneral = temCfg.data || [];
                        break;
                    case 6:
                        this.addTowerIndexData = temCfg.target;
                        this.addTowerSkillData = temCfg.data;
                        break;
                    case 7:
                        temCfg.target.foreach(data => {
                            this.addTowerHeroData.push(data)
                        })
                        temCfg.data.foreach(data => {
                            this.addTowerHeroSkillData.push(data)
                        })
                        break;
                    case 8:
                        this.towerScaleIndexData = temCfg.target;
                        this.towerScaleNumData = temCfg.data;
                        break;

                }
            }
        });
    }

    setUpHerosAddSkills(sceneModel: PveSceneModel) {
        if (!JumpUtils.ifSysOpen(2853)) {
            return
        }
        let a: { [group: number]: number } = {};
        let addCfgs: Copy_towerhaloCfg[] = [];
        sceneModel.towers.forEach(t => {
            if (t && t.hero) {
                let cfg = t.hero.model.config;
                if (cfg) {
                    if (!a[cfg.group[0]]) {
                        a[cfg.group[0]] = 1;
                    } else {
                        a[cfg.group[0]] += 1;
                    }
                }
            }
        });

        let addNum = 0;
        let maxNum = 0;
        let big4Type: number[] = [];
        this.groupMaxNum = 0;
        this.groupMaxtype = 0;
        for (let i = 1; i <= 6; i++) {
            if (a[i] == null && i < 6) continue;
            if (i == 1 || i == 2) {
                addNum += a[i];
            } else {
                if (a[i] > maxNum) {
                    maxNum = a[i];

                }
            }
            if (a[i] > this.groupMaxNum) {
                this.groupMaxNum = a[i];
                this.groupMaxtype = i;
            } else if (a[i] == this.groupMaxNum && ((this.groupMaxtype == 1 || this.groupMaxtype == 2) && i > 2)) {
                this.groupMaxtype = i;
            }
            if (a[i] >= 4) {
                big4Type.push(i);
            } else if (i == 6 && a[i] > 0) {
                big4Type.push(i);
            }
            if (i == 6 && (maxNum + addNum >= 2)) {
                let temNum = Math.min(6, maxNum + addNum);
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.only == 1 && cfg.num == temNum) {
                        return true;
                    }
                    return false;
                })
                if (cfg) {
                    addCfgs.push(cfg);
                }
            }
        }

        if (a[6] && a[6] >= 1) {
            this.groupMaxtype = 6;
        }

        if (big4Type.length > 0) {
            big4Type.forEach(type => {
                let temNum = Math.min(6, a[type]);
                if (type == 6) {
                    let cfgs = ConfigManager.getItems(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                        if (cfg.group.indexOf(type) >= 0 && temNum >= cfg.num) {
                            return true
                        }
                        return false;
                    })
                    if (cfgs.length > 0) {
                        addCfgs = addCfgs.concat(cfgs)
                    }
                } else {
                    let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                        if (cfg.group.indexOf(type) >= 0 && temNum == cfg.num) {
                            return true
                        }
                        return false;
                    })
                    if (cfg) {
                        addCfgs.push(cfg);
                    }
                }

            })
        }
        if (addCfgs.length > 0) {
            addCfgs.forEach(cfg => {
                this.upHerosAddSkills.push(cfg.skill);
            })
        }
    }

    //矿洞大作战天赋技能处理
    setMineGiftSkill() {
        let model = ModelManager.get(MineModel)
        if (model.curCaveSstate.gift.length > 0) {
            model.curCaveSstate.gift.forEach(data => {
                let level = data.level
                let giftCfg = ConfigManager.getItemByField(Activitycave_giftCfg, 'gift', data.giftId);
                let hardcoreCfg = ConfigManager.getItemById(Copy_hardcoreCfg, giftCfg.skill[0]);
                if (hardcoreCfg) {
                    let data = hardcoreCfg.data
                    if (this.addMineSkillData[data[0]]) {
                        let skillData: SkillIdLv = { skillId: data[1], skillLv: level }
                        this.addMineSkillData[data[0]] = this.addMineSkillData[data[0]].concat(skillData)
                    } else {
                        let skillData: SkillIdLv = { skillId: data[1], skillLv: level }
                        this.addMineSkillData[data[0]] = [skillData]
                    }
                }
            })
        }
    }



    /**据点战 pvp 作战技能词条 
     * isMirror true 防守方 false 自己
    */
    setFhPvpSkill(isMirror: boolean = false, isGather: boolean = false) {
        let hardcoreList: number[] = [];
        let footHoldModel = ModelManager.get(FootHoldModel)
        let roleModel = ModelManager.get(RoleModel)
        let curPointInfo: FhPointInfo = footHoldModel.warPoints[`${footHoldModel.pointDetailInfo.pos.x}-${footHoldModel.pointDetailInfo.pos.y}`]
        let cords = []
        if (curPointInfo && curPointInfo.effectTowers.length > 0) {
            cords = curPointInfo.effectTowers
            for (let i = 0; i < cords.length; i++) {
                let towerIndex = cords[i]
                let towerCfg = ConfigManager.getItemByField(Foothold_towerCfg, "tower_id", towerIndex)
                let type = footHoldModel.radioTowerData[towerIndex - 1]
                let points = footHoldModel.radioTypePoints[`${towerIndex}`]
                for (let i = 0; i < points.length; i++) {
                    let towerInfo: FhPointInfo = points[i]
                    if (towerInfo.fhPoint && towerInfo.bonusType == 0 && towerInfo.fhPoint.guildId > 0 && towerInfo.bonusId == towerIndex) {
                        //塔属于自己的
                        if (towerInfo.fhPoint.guildId == roleModel.guildId) {
                            if (curPointInfo.fhPoint.guildId == roleModel.guildId) {
                                if (isMirror == false) {
                                    if (type == 1) {
                                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[0][0])
                                    } else if (type == 2) {
                                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[1][0])
                                    }
                                }
                            } else {
                                if (isMirror) {
                                    if (type == 3) {
                                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[2][0])
                                    }
                                } else {
                                    if (type == 1) {
                                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[0][0])
                                    } else if (type == 2) {
                                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[1][0])
                                    }
                                }
                            }
                            //}
                        } else {
                            //塔不属于自己的
                            if (curPointInfo.fhPoint.guildId != roleModel.guildId) {
                                if (isMirror) {
                                    if (type == 1) {
                                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[0][0])
                                    } else if (type == 2) {
                                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[1][0])
                                    }
                                } else {
                                    if (type == 3) {
                                        hardcoreList = hardcoreList.concat(towerCfg.buff_effect[2][0])
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }

        //是否集结战斗
        if (isGather) {
            if (isMirror) {
                let opponents = footHoldModel.gatherOpponents
                if (opponents.length > 1) {
                    let cfg = ConfigManager.getItemById(Foothold_ascensionCfg, opponents.length - 1)
                    if (cfg) {
                        hardcoreList = hardcoreList.concat(cfg.ascension)
                    }
                }
            } else {
                let teamMates = footHoldModel.gatherTeamMates
                if (teamMates.length > 1) {
                    let cfg = ConfigManager.getItemById(Foothold_ascensionCfg, teamMates.length - 1)
                    if (cfg) {
                        hardcoreList = hardcoreList.concat(cfg.ascension)
                    }
                }
            }
        } else {
            //基地等级词条
            let baseLvCfg = ConfigManager.getItemById(Foothold_baseCfg, footHoldModel.baseLevel);
            //军衔相关词条
            if (isMirror) {
                //防守方 
                let defMRlv = MilitaryRankUtils.getMilitaryRankLvByExp(footHoldModel.pointDetailInfo.titleExp)
                let coreList = MilitaryRankUtils.getPrivilegeHardCore(MRPrivilegeType.p1, defMRlv)
                hardcoreList = hardcoreList.concat(coreList)

                baseLvCfg && (hardcoreList = hardcoreList.concat(baseLvCfg.privilege1));
            } else {
                //进攻方 自己
                let coreList = MilitaryRankUtils.getPrivilegeHardCore(MRPrivilegeType.p0, footHoldModel.militaryRankLv)
                hardcoreList = hardcoreList.concat(coreList)

                let pveCoreList = MilitaryRankUtils.getPrivilegeHardCore(MRPrivilegeType.p7, footHoldModel.militaryRankLv)
                hardcoreList = hardcoreList.concat(pveCoreList)

                baseLvCfg && (hardcoreList = hardcoreList.concat([...baseLvCfg.privilege0, ...baseLvCfg.privilege7]));
            }
        }

        if (hardcoreList instanceof Array && hardcoreList.length > 0) {
            hardcoreList.forEach(id => {
                let hardcoreCfg = ConfigManager.getItemById(Copy_hardcoreCfg, id);
                if (hardcoreCfg) {
                    this.fhPvpSkill.push(hardcoreCfg.data)
                }
            })
        }
    }


    /**探险副本词条加成 */
    setAdventureAddSkill() {
        let hardcoreList: number[] = [];
        let advModel = ModelManager.get(AdventureModel)
        let entryList = advModel.entryList
        for (let i = 0; i < entryList.length; i++) {
            let e_cfg = ConfigManager.getItemByField(Adventure_entryCfg, "group", entryList[i].group, { hardcore_id: entryList[i].id })
            if (!e_cfg) {
                e_cfg = ConfigManager.getItemByField(Adventure_entryCfg, "hardcore_id", entryList[i].id)
            }
            hardcoreList.push(e_cfg.hardcore_id)
        }
        if (hardcoreList instanceof Array && hardcoreList.length > 0) {
            hardcoreList.forEach(id => {
                let hardcoreCfg = ConfigManager.getItemById(Copy_hardcoreCfg, id);
                if (hardcoreCfg) {
                    switch (hardcoreCfg.type) {
                        case 2://技能
                            let type: PveFightType = hardcoreCfg.target;
                            if (!this.addAdventureSkill[type]) {
                                this.addAdventureSkill[type] = type == PveFightType.Hero ? { 0: [] } : [];
                            }
                            if (type == PveFightType.Hero) {
                                let tem = this.addAdventureSkill[type];
                                if (typeof hardcoreCfg.data === 'object') {
                                    if (tem[hardcoreCfg.data[0]]) {
                                        tem[hardcoreCfg.data[0]] = tem[hardcoreCfg.data[0]].concat(hardcoreCfg.data[1]);
                                    } else {
                                        tem[hardcoreCfg.data[0]] = [hardcoreCfg.data[1]];
                                    }
                                } else {
                                    tem[0] = tem[0].concat(hardcoreCfg.data);
                                }
                            } else {
                                this.addAdventureSkill[type] = this.addAdventureSkill[type].concat(hardcoreCfg.data);
                            }
                            break
                        case 4://指定英雄
                            // let index = this.addAventureHeroIdData.indexOf(hardcoreCfg.target[0])
                            // if (index < 0) {
                            //     this.addAventureHeroIdData.push(hardcoreCfg.target[0]);
                            //     this.addAventureHeroSkillData[0] = hardcoreCfg.data;
                            // } else {
                            //     this.addAventureHeroSkillData[index] = hardcoreCfg.data;
                            // }
                            let index = this.addAventureHeroIdData.indexOf(hardcoreCfg.target)
                            if (index < 0) {
                                this.addAventureHeroIdData.push(hardcoreCfg.target);
                                this.addAventureHeroSkillData.push(hardcoreCfg.data);
                            } else {
                                this.addAventureHeroSkillData[index] = this.addAventureHeroSkillData[index].concat(hardcoreCfg.data);
                            }
                            break
                    }

                }
            })
        }
    }

    /**探险副本词条加成 */
    setAdventure2AddSkill() {
        //let hardcoreList: number[] = [];
        let advModel = ModelManager.get(NewAdventureModel)
        let hardcoreList = advModel.copyType == 0 ? advModel.normal_entryList : advModel.endless_entryList;
        // for (let i = 0; i < entryList.length; i++) {
        //     let e_cfg = ConfigManager.getItemByField(Adventure2_entryCfg, "group", entryList[i].group, { hardcore_id: entryList[i].id })
        //     if (!e_cfg) {
        //         e_cfg = ConfigManager.getItemByField(Adventure2_entryCfg, "hardcore_id", entryList[i].id)
        //     }
        //     hardcoreList.push(e_cfg.hardcore_id)
        // }
        //指定英雄加成
        let difficulty = advModel.copyType == 0 ? advModel.difficulty : 4
        let themeheroCfg = ConfigManager.getItemByField(Adventure2_themeheroCfg, "type", NewAdventureUtils.actRewardType, { difficulty: difficulty })
        hardcoreList = hardcoreList.concat(themeheroCfg.hardcoreList)
        let randomId = advModel.copyType == 0 ? advModel.normal_randomIds : advModel.endless_randomIds;
        if (hardcoreList instanceof Array && hardcoreList.length > 0) {
            hardcoreList.forEach(id => {
                let hardcoreCfg = ConfigManager.getItemById(Copy_hardcoreCfg, id);
                if (hardcoreCfg) {
                    switch (hardcoreCfg.type) {
                        case 2://技能
                            let type: PveFightType = hardcoreCfg.target;
                            if (!this.addAdventure2Skill[type]) {
                                this.addAdventure2Skill[type] = type == PveFightType.Hero ? { 0: [] } : [];
                            }
                            if (type == PveFightType.Hero) {
                                let tem = this.addAdventure2Skill[type];
                                if (typeof hardcoreCfg.data === 'object') {
                                    if (tem[hardcoreCfg.data[0]]) {
                                        tem[hardcoreCfg.data[0]] = tem[hardcoreCfg.data[0]].concat(hardcoreCfg.data[1]);
                                    } else {
                                        tem[hardcoreCfg.data[0]] = [hardcoreCfg.data[1]];
                                    }
                                } else {
                                    tem[0] = tem[0].concat(hardcoreCfg.data);
                                }
                            } else {
                                this.addAdventure2Skill[type] = this.addAdventure2Skill[type].concat(hardcoreCfg.data);
                            }
                            break
                        case 4://指定英雄
                            // let index = this.addAdventure2HeroIdData.indexOf(hardcoreCfg.target[0])
                            // if (index < 0) {
                            //     this.addAdventure2HeroIdData.push(hardcoreCfg.target[0]);
                            //     this.addAdventure2HeroSkillData[0] = hardcoreCfg.data;
                            // } else {
                            //     this.addAdventure2HeroSkillData[index] = hardcoreCfg.data;
                            // }

                            let index = this.addAdventure2HeroIdData.indexOf(hardcoreCfg.target)
                            if (index < 0) {
                                this.addAdventure2HeroIdData.push(hardcoreCfg.target);
                                this.addAdventure2HeroSkillData.push(hardcoreCfg.data);
                            } else {
                                this.addAdventure2HeroSkillData[index] = this.addAdventure2HeroSkillData[index].concat(hardcoreCfg.data);
                            }

                            break
                    }

                }
            })
        }
        //添加随机事件
        if (randomId.length > 0) {
            let tem = this.addAdventure2Skill[PveFightType.Hero];
            if (!tem) {
                tem = this.addAdventure2Skill[PveFightType.Hero] = { 0: [] }
            }
            randomId.forEach(id => {
                let randomCfg = ConfigManager.getItemById(Adventure2_randomCfg, id)
                tem[0] = tem[0].concat(randomCfg.skill);
            })
        }
    }

    setSiegeSkill() {
        let siegeModel = ModelManager.get(SiegeModel)
        let hardcoreList = siegeModel.curSiegeCfg.bonus
        if (hardcoreList instanceof Array && hardcoreList.length > 0) {
            hardcoreList.forEach(id => {
                let hardcoreCfg = ConfigManager.getItemById(Copy_hardcoreCfg, id);
                if (hardcoreCfg) {
                    this.addSiegeSkill.push(hardcoreCfg.data)
                }
            })
        }
    }


    //设置护使秘境特定技能
    setGuardianTowerSkill(isMirror: boolean = false, hardcoreList: number[]) {
        //处理敌方和我方的技能
        let temAddHardcore: number[] = [];
        hardcoreList.forEach(id => {
            let hardcoreCfg = ConfigManager.getItemById(Copy_hardcoreCfg, id);
            if (hardcoreCfg) {
                if (cc.js.isNumber(hardcoreCfg.camp) && hardcoreCfg.camp == 1) {
                    if (!isMirror) {
                        temAddHardcore.push(id);
                    }
                } else if (cc.js.isNumber(hardcoreCfg.camp) && hardcoreCfg.camp == 2) {
                    if (isMirror) {
                        temAddHardcore.push(id);
                    }
                } else {
                    temAddHardcore.push(id);
                }
            }
        })
        this.setHardcoreData(temAddHardcore);
    }

    /**
     * 获得指定塔位索引的优先推荐英雄小兵类型，返回0则表示不做推荐
     * @param index 
     */
    getTowerSoldierType(index: number) {
        if (!this.soldierTypeLimit || this.soldierTypeLimit[index - 1] === void 0) {
            return 0;
        }
        return this.soldierTypeLimit[index - 1];
    }

    // 清空数据
    clearData() {
        this.maxUpHeroNum = 0;
        this.maxUpHeroNum_Woker = 0;
        this.careerLimit = [];
        this.soldierTypeLimit = [];
        this.addSkillIdData = {};
        this.general = true;
        this.addHeroIdData = [];
        this.addHeroSkillData = [];
        this.addMineSkillData = [];
        this.upHerosAddSkills = [];
        this.addTowerIndexData = [];
        this.addTowerSkillData = [];
        this.fhPvpSkill = [];
        this.addAdventureSkill = []
        this.addSiegeSkill = []
        this.towerScaleIndexData = [];
        this.towerScaleNumData = [];
        this.towerShowSoldierTypeFlag = true;
        this.groupMaxNum = 0;
        this.groupMaxtype = 0;
    }

}
