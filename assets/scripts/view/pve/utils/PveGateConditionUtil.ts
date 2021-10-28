import {
    Copy_gateConditionCfg,
    Copy_stageCfg, HeroCfg, Hero_careerCfg
} from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import HeroModel from '../../../common/models/HeroModel';
import BagUtils from '../../../common/utils/BagUtils';
import HeroUtils from '../../../common/utils/HeroUtils';
import PveSceneCtrl from '../ctrl/PveSceneCtrl';
import PveEventId from '../enum/PveEventId';

/** 
 * Pve实战演练关卡通关条件控制器
 * @Author: yaozu.hu
 * @Date: 2019-09-26 17:21:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-10 14:28:10
 */

class GataConditionData {
    cfg: Copy_gateConditionCfg;
    curData: number;
    limitData: number;
    // state: boolean;
    // start: boolean;//激活条件（创建怪物）

    _start: boolean;//激活条件（创建怪物）
    get start(): boolean { return this._start; }
    set start(v: boolean) {
        this._start = v;
        gdk.e.emit(PveEventId.PVE_GATE_CONDITION_UPDATE);
    }

    _state: boolean;
    get state(): boolean { return this._state; }
    set state(v: boolean) {
        this._state = v;
        gdk.e.emit(PveEventId.PVE_GATE_CONDITION_UPDATE);
    }
}

export class PveGateConditionUtil {

    DataList: GataConditionData[] = []

    //1.怪物越过塔位限制
    monsterTowerLimit = [];
    //2.怪物击杀时间限制
    monsterKillTimeLimit = [];
    //3.怪物使用技能次数限制
    monsterUseSkillLimit = [];
    //4.指挥官血量限制
    GeneralHpLimit = [];
    //5.某个英雄死亡次数限制
    oneHeroDieNumLimit = [];
    //6.某类英雄死亡次数限制
    typeHeroDieNumLimit = [];
    //7.所有英雄死亡次数限制
    allHeroDieNumLimit = [];
    //8.战斗时间限制
    fightTimeLimmit = [];
    //9.怪物波次出现时间限制
    monsterWaveTimeLimit = [];

    //同阵营英雄个数限制
    groupHeroNumLimit = [];
    //通职业英雄个数限制
    carrerHeroNumLimit = [];

    //特定英雄造成的特定类型伤害量
    heroTypeDamageLimit = [];
    //特定英雄击杀特定怪物
    heroKillMonsterLimit = [];
    //特定英雄和指定英雄通关副本
    upHeroLimit = [];
    //特定英雄拦截怪物数量
    heroHateMonsterNumLimit = []
    //特定英雄使用特定技能作用多少个怪物
    heroUseSkillOnMonsterNumLimit = [];

    //直线拉回类型技能拉回多少怪物
    heroUseSkillDragTargetNumLimit = [];

    //特定英雄指定范围内外的伤害量
    HeroAttackDisDamage = [];

    // 设置副本条件数据
    setCurStageData(cfg: Copy_stageCfg) {
        this.clearData();
        let gateconditionList: number[] = cfg.gateconditionList || [];
        if (gateconditionList instanceof Array && gateconditionList.length > 0) {
            gateconditionList.forEach(id => {
                let temCfg = ConfigManager.getItemById(Copy_gateConditionCfg, id);
                if (temCfg) {
                    let data = new GataConditionData()
                    data.cfg = temCfg;
                    data.curData = 0;
                    data.limitData = 0;
                    data.state = false;
                    data.start = false;
                    this.DataList.push(data);
                    let index = this.DataList.indexOf(data);
                    switch (temCfg.type) {
                        case 1:
                            switch (temCfg.subType) {
                                case 1:
                                    this.monsterTowerLimit.push(index)
                                    break;
                                case 2:
                                    this.monsterKillTimeLimit.push(index)
                                    break;
                                case 3:
                                    data.state = true;
                                    this.monsterUseSkillLimit.push(index);
                                    break;
                            }
                            break;
                        case 2:
                            this.GeneralHpLimit.push(index);
                            break;
                        case 3:
                            data.start = true;
                            data.state = true;
                            switch (temCfg.subType) {
                                case 1:
                                    this.oneHeroDieNumLimit.push(index)
                                    break;
                                case 2:
                                    if (cc.js.isNumber(temCfg.data1)) {
                                        this.typeHeroDieNumLimit.push(index)
                                    } else {
                                        this.allHeroDieNumLimit.push(index)
                                    }
                                    this.monsterKillTimeLimit.push(index)
                                    break;
                            }
                            break;
                        case 4:
                            if (temCfg.subType == 0) {
                                data.start = true;
                                this.fightTimeLimmit.push(index);
                                data.limitData = temCfg.data1
                            } else {
                                this.monsterWaveTimeLimit.push(index);
                            }
                            break;
                        case 5:
                            this.groupHeroNumLimit.push(index);
                            break;
                        case 6:
                            this.carrerHeroNumLimit.push(index);
                            break;
                        case 7:
                            data.start = true;
                            //data.state = true;
                            switch (temCfg.subType) {
                                case 1:
                                    this.heroTypeDamageLimit.push(index)
                                    data.limitData = temCfg.data2
                                    break;
                                case 2:
                                    this.heroKillMonsterLimit.push(index)
                                    data.limitData = 1
                                    break;
                                case 3:
                                    this.upHeroLimit.push(index)
                                    data.limitData = temCfg.data2.length
                                    break;
                                case 4:
                                    this.heroHateMonsterNumLimit.push(index)
                                    data.limitData = temCfg.data2
                                    break;
                                case 5:
                                    this.heroUseSkillOnMonsterNumLimit.push(index)
                                    data.limitData = temCfg.data3
                                    break
                                case 6:
                                    this.heroUseSkillDragTargetNumLimit.push(index)
                                    data.limitData = temCfg.data3
                                    break
                                case 7:
                                    this.HeroAttackDisDamage.push(index)
                                    data.limitData = temCfg.data2
                                    break
                            }
                            break;
                    }
                }
            })
        }
    }

    // 清空数据
    clearData() {
        this.DataList = []
        this.monsterTowerLimit = []
        this.monsterKillTimeLimit = []
        this.monsterUseSkillLimit = []
        this.GeneralHpLimit = []
        this.oneHeroDieNumLimit = []
        this.typeHeroDieNumLimit = []
        this.allHeroDieNumLimit = []
        this.fightTimeLimmit = []
        this.monsterWaveTimeLimit = []
        this.heroHateMonsterNumLimit = []
        this.heroTypeDamageLimit = []
        this.heroKillMonsterLimit = []
        this.upHeroLimit = []
        this.heroUseSkillOnMonsterNumLimit = []
        this.heroUseSkillDragTargetNumLimit = []
    }

    //获取通关条件完成的奖杯数
    getGateConditionCupNum(): number {

        let allNum = this.DataList.length;
        let curNum = 0;
        let cupNum = 0;
        this.DataList.forEach(data => {
            if (data.start && data.state) {
                curNum += 1;
            }
        })
        switch (allNum) {
            case 3:
                cupNum = curNum;
                break;
            case 4:
                if (curNum > 0 && curNum <= 2) {
                    cupNum = 1;
                } else if (curNum > 2) {
                    cupNum = curNum - 1;
                }
                else {
                    cupNum = curNum;
                }
                break;
            case 5:
                if (curNum > 0 && curNum <= 2) {
                    cupNum = 1;
                } else if (curNum > 2 && curNum <= 4) {
                    cupNum = 2;
                } else if (curNum > 4) {
                    cupNum = 3;
                }
                else {
                    cupNum = curNum;
                }
                break
        }


        return cupNum;
    }

    /**
     * 判断通关条件 各个阵营英雄数量和各个职业英雄数量
     */
    updateGateConditions() {
        let view = gdk.gui.getCurrentView();
        let sceneModel = view.getComponent(PveSceneCtrl).model;
        //判断通关条件 各个阵营英雄数量和各个职业英雄数量
        if (sceneModel && sceneModel.gateconditionUtil && sceneModel.gateconditionUtil.DataList.length > 0) {
            let groupData = {};
            let soldierData = {};
            let maxGroup = 0;
            let heroList = ModelManager.get(HeroModel).curUpHeroList(0)

            heroList.forEach(heroId => {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
                if (heroInfo) {
                    let temCfg = <HeroCfg>BagUtils.getConfigById(heroInfo.typeId);
                    if (!groupData[temCfg.group[0] + '']) {
                        groupData[temCfg.group[0] + ''] = 1;
                    } else {
                        groupData[temCfg.group[0] + ''] += 1;
                        if (groupData[temCfg.group[0] + ''] > maxGroup) {
                            maxGroup = groupData[temCfg.group[0] + '']
                        }
                    }
                }
            })
            heroList.forEach(heroId => {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
                if (heroInfo) {
                    let soldierType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroInfo.careerId).career_type;
                    if (!soldierData[soldierType + '']) {
                        soldierData[soldierType + ''] = 1;
                    } else {
                        soldierData[soldierType + ''] += 1;
                    }
                }
            })

            if (sceneModel.gateconditionUtil.groupHeroNumLimit.length > 0) {
                sceneModel.gateconditionUtil.groupHeroNumLimit.forEach(index => {
                    let data = sceneModel.gateconditionUtil.DataList[index];
                    if (data.cfg.data1 == 0) {
                        data.state = maxGroup >= data.cfg.data2;
                        data.start = true;
                    } else {
                        data.state = groupData[data.cfg.data1 + ''] >= data.cfg.data2;
                        data.start = true;
                    }
                })
            }
            if (sceneModel.gateconditionUtil.carrerHeroNumLimit.length > 0) {
                sceneModel.gateconditionUtil.carrerHeroNumLimit.forEach(index => {
                    let data = sceneModel.gateconditionUtil.DataList[index];
                    data.state = soldierData[data.cfg.data1 + ''] >= data.cfg.data2;
                    data.start = true;
                })
            }

            //指定英雄觉醒玩法上阵指定英雄限制
            if (sceneModel.gateconditionUtil.upHeroLimit.length > 0) {
                sceneModel.gateconditionUtil.upHeroLimit.forEach(index => {
                    let data = sceneModel.gateconditionUtil.DataList[index];
                    if (data.cfg.data2.length > 0) {
                        data.cfg.data2.forEach(heroId => {
                            let num = sceneModel.getFightNumByBaseId(heroId);
                            if (num > 0) {
                                data.curData += 1;
                            }
                        })
                    }
                    data.state = data.curData >= data.limitData;
                    data.start = true;
                })
            }
        }
    }
}


