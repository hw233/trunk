import PveCalledCtrl from '../ctrl/fight/PveCalledCtrl';
import PveHeroCtrl from '../ctrl/fight/PveHeroCtrl';
import PveSceneModel from '../model/PveSceneModel';
import PveSoldierCtrl from '../ctrl/fight/PveSoldierCtrl';
import { PveFightType } from '../core/PveFightModel';
import { PveHurtType } from '../ctrl/base/PveHurtEffect';
/**
 * Pve战斗信息记录
 * @Author: sthoo.huang
 * @Date: 2019-07-31 14:12:34
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-02 11:12:24
 */

class HurtInfo {
    time: number;   // 时间
    type: 'buff' | 'skill';
    id: number;   // BUFF或技能ID
    attacker_id: number;    // 施法者类型ID
    target_id: number;  // 目标类型ID
    hp: number;
}

/**
 * 角色详细的伤害信息统计
 */
export class HurtInfoStatistics {
    fightId: number;                    //fightId
    baseId: number;                     //角色的baseID

    OutputAllDamage: number = 0;        //角色的总输出
    OutputSkillDamage: number = 0;      //技能伤害输出
    OutputSkillDamageNum: number = 0;   //技能伤害次数
    OutputNormalDamage: number = 0;     //普攻伤害输出
    OutputNormalDamageNum: number = 0;  //普攻伤害次数
    OutputBuffDamage: number = 0;       //buff伤害输出
    OutputBuffDamageNum: number = 0;    //buff伤害次数

    SufferAllDamage: number = 0;        //角色的总承受伤害
    SufferSkillDamage: number = 0;      //承受的技能伤害
    SufferSkillDamageNum: number = 0;   //承受的技能伤害次数
    SufferNormalDamage: number = 0;     //承受的普攻伤害
    SufferNormalDamageNum: number = 0;  //承受的普攻伤害次数
    SufferBuffDamage: number = 0;       //承受的buff伤害
    SufferBuffDamageNum: number = 0;    //承受的buff伤害次数

    OutputRecoverAllHp: number = 0;     //回血输出
    SufferRecoverAllHp: number = 0;     //承受的回血

    deadTime: number = -1;              //死亡时间，10000以内为卡牌
    fightTime: number = 0;              //战斗时长（守卫和召唤物）
    owner_id: number = 0;               //士兵、召唤物的拥有者
    TypeDamageList: {} = {};            //伤害类型分开记录
}

export default class PveBattleInfoUtil {

    infos: HurtInfo[] = [];
    BattleInfo: { [fight_id: number]: HurtInfoStatistics } = {};
    HeroList: number[] = [];
    SoldierList: number[] = [];
    EnemyList: number[] = [];
    GenralList: number[] = [];
    CallList: number[] = [];
    BossNum: number = 0;

    sceneModel: PveSceneModel;
    /**
     * 清除伤害信息列表
     */
    clearAll() {
        this.infos.length = 0;
        this.BattleInfo = {};
        this.HeroList.length = 0;
        this.SoldierList.length = 0;
        this.EnemyList.length = 0;
        this.GenralList.length = 0;
        this.CallList.length = 0;
        this.BossNum = 0;
        this.sceneModel = null;
    }

    /**
     * 添加战斗信息
     * @param id 
     * @param type 
     * @param attacker_fightId 
     * @param attacker_baseId 
     * @param attacker_type 
     * @param target_fightId 
     * @param target_baseId 
     * @param target_type 
     * @param hp 
     * @param deadTime 
     */
    addBattleInfo(
        id: number,
        type: PveHurtType,
        damage_type: number,
        attacker_fightId: number,
        attacker_baseId: number,
        attacker_type: PveFightType,
        target_fightId: number,
        target_baseId: number,
        target_type: PveFightType,
        hp: number,
        deadTime: number = -1,
    ) {
        let attacker = this.BattleInfo[attacker_fightId];
        let target = this.BattleInfo[target_fightId];
        if (attacker == null) {
            attacker = new HurtInfoStatistics();
            attacker.fightId = attacker_fightId;
            attacker.baseId = attacker_baseId;
            this.BattleInfo[attacker_fightId] = attacker;
        }
        if (target == null) {
            target = new HurtInfoStatistics();
            target.fightId = target_fightId;
            target.baseId = target_baseId;
            this.BattleInfo[target_fightId] = target;
        }
        this.addBattleType(target_fightId, target_type);
        // 3是buff
        if (type == PveHurtType.BUFF) {
            this.addBattleType(attacker_fightId, attacker_type);
            if (hp > 0) {
                attacker.OutputRecoverAllHp += hp;
                target.SufferRecoverAllHp += hp;
            } else {
                let number = Math.abs(hp);
                attacker.OutputAllDamage += number;
                attacker.OutputBuffDamage += number;
                attacker.OutputBuffDamageNum += 1;
                target.SufferAllDamage += number;
                target.SufferBuffDamage += number;
                target.SufferBuffDamageNum += 1;
                if (!attacker.TypeDamageList[damage_type]) {
                    attacker.TypeDamageList[damage_type] = number
                } else {
                    attacker.TypeDamageList[damage_type] += number
                }
            }
        } else {
            this.addBattleType(attacker_fightId, attacker_type);
            let number = Math.abs(hp);
            switch (type) {
                case PveHurtType.SKILL:
                    attacker.OutputAllDamage += number;
                    attacker.OutputSkillDamage += number;
                    attacker.OutputSkillDamageNum += 1;
                    target.SufferAllDamage += number;
                    target.SufferSkillDamage += number;
                    target.SufferSkillDamageNum += 1;
                    break;

                case PveHurtType.RECOVER:
                    attacker.OutputRecoverAllHp += number;
                    target.SufferRecoverAllHp += number;
                    break;

                case PveHurtType.CRIT:
                case PveHurtType.NORMAL:
                    attacker.OutputAllDamage += number;
                    attacker.OutputNormalDamage += number;
                    attacker.OutputNormalDamageNum += 1;
                    target.SufferAllDamage += number;
                    target.SufferNormalDamage += number;
                    target.SufferNormalDamageNum += 1;
                    break;
            }
            if (type != PveHurtType.RECOVER) {
                if (!attacker.TypeDamageList[damage_type]) {
                    attacker.TypeDamageList[damage_type] = number
                } else {
                    attacker.TypeDamageList[damage_type] += number
                }
            }
        }
        target.deadTime = deadTime;

        // 设置守卫和召唤物时长
        if (this.sceneModel) {
            if (attacker_type == PveFightType.Call) {
                let call = this.sceneModel.getFightBy(attacker_fightId) as PveCalledCtrl;
                if (call) {
                    attacker.fightTime = call.fightTime;
                    attacker.owner_id = call.model.owner_id;
                }
            } else if (attacker_type == PveFightType.Soldier) {
                let soldier = this.sceneModel.getFightBy(attacker_fightId) as PveSoldierCtrl;
                if (soldier) {
                    attacker.fightTime = soldier.fightTime;
                    attacker.owner_id = soldier.model.hero.model.fightId;
                }
            } else if (attacker_type == PveFightType.Hero) {
                let hero = this.sceneModel.getFightBy(attacker_fightId) as PveHeroCtrl;
                if (hero) {
                    attacker.fightTime = hero.fightTime;
                }
            }
            if (target_type == PveFightType.Call) {
                let call = this.sceneModel.getFightBy(target_fightId) as PveCalledCtrl;
                if (call) {
                    target.fightTime = call.fightTime;
                    target.owner_id = call.model.owner_id;
                }
            } else if (target_type == PveFightType.Soldier) {
                let soldier = this.sceneModel.getFightBy(target_fightId) as PveSoldierCtrl;
                if (soldier) {
                    target.fightTime = soldier.fightTime;
                    target.owner_id = soldier.model.hero.model.fightId;
                }
            } else if (target_type == PveFightType.Hero) {
                let hero = this.sceneModel.getFightBy(target_fightId) as PveHeroCtrl;
                if (hero) {
                    target.fightTime = hero.fightTime;
                }
            }
        }
    }

    /**
     * 伤害角色类型分类
     * @param id 
     * @param type 
     */
    addBattleType(id: number, type: PveFightType) {
        switch (type) {
            case PveFightType.Genral:
                if (this.GenralList.indexOf(id) < 0) {
                    this.GenralList.push(id)
                }
                break;
            case PveFightType.Hero:
                if (this.HeroList.indexOf(id) < 0) {
                    this.HeroList.push(id)
                }
                break;
            case PveFightType.Soldier:
                if (this.SoldierList.indexOf(id) < 0) {
                    this.SoldierList.push(id)
                }
                break;
            case PveFightType.Enemy:
                if (this.EnemyList.indexOf(id) < 0) {
                    this.EnemyList.push(id)
                }
                break;
            case PveFightType.Call:
                if (this.CallList.indexOf(id) < 0) {
                    this.CallList.push(id);
                }
        }
    }

    getCallData(): HurtInfoStatistics[] {
        let list: any = {};
        let listIds: HurtInfoStatistics[] = []
        this.CallList.forEach(id => {
            if (list[this.BattleInfo[id].baseId] == null) {
                let temData = new HurtInfoStatistics();
                Object['assign'](temData, this.BattleInfo[id]);
                list[this.BattleInfo[id].baseId] = temData;
            } else {
                list[this.BattleInfo[id].baseId].OutputAllDamage += this.BattleInfo[id].OutputAllDamage;
                list[this.BattleInfo[id].baseId].OutputSkillDamage += this.BattleInfo[id].OutputSkillDamage;
                list[this.BattleInfo[id].baseId].OutputNormalDamage += this.BattleInfo[id].OutputNormalDamage;
                list[this.BattleInfo[id].baseId].OutputBuffDamage += this.BattleInfo[id].OutputBuffDamage;
                list[this.BattleInfo[id].baseId].SufferAllDamage += this.BattleInfo[id].SufferAllDamage;
                list[this.BattleInfo[id].baseId].SufferSkillDamage += this.BattleInfo[id].SufferSkillDamage;
                list[this.BattleInfo[id].baseId].SufferNormalDamage += this.BattleInfo[id].SufferNormalDamage;
                list[this.BattleInfo[id].baseId].SufferBuffDamage += this.BattleInfo[id].SufferBuffDamage;
                list[this.BattleInfo[id].baseId].OutputRecoverAllHp += this.BattleInfo[id].OutputRecoverAllHp;
                list[this.BattleInfo[id].baseId].SufferRecoverAllHp += this.BattleInfo[id].SufferRecoverAllHp;
                list[this.BattleInfo[id].baseId].fightTime += this.BattleInfo[id].fightTime;
            }
        });

        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                listIds.push(list[key]);
            }
        }

        return listIds;
    }

    //获取英雄召唤物的伤害统计记录
    getHeroCallDamage(heroId: number): HurtInfoStatistics[] {
        let listIds: HurtInfoStatistics[] = []
        this.CallList.forEach(id => {
            let temData = new HurtInfoStatistics();
            Object['assign'](temData, this.BattleInfo[id]);
            if (temData.owner_id == heroId) {
                listIds.push(temData);
            }
        });
        return listIds;
    }

    //获取英雄士兵的伤害统计记录
    getHeroSoldierDamage(heroId: number): HurtInfoStatistics[] {
        let listIds: HurtInfoStatistics[] = []
        this.SoldierList.forEach(id => {
            let temData = new HurtInfoStatistics();
            Object['assign'](temData, this.BattleInfo[id]);
            if (temData.owner_id == heroId) {
                listIds.push(temData);
            }
        });
        return listIds;
    }

    //获取英雄的伤害统计记录
    getHeroDamage(heroId: number): HurtInfoStatistics {
        let listId: HurtInfoStatistics = null;
        this.HeroList.forEach(id => {
            let temData = new HurtInfoStatistics();
            Object['assign'](temData, this.BattleInfo[id]);
            if (temData.fightId == heroId) {
                listId = temData;
            }
        });
        return listId;
    }
}