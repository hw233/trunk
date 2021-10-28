import { Pieces_heroCfg, Skill_target_typeCfg, SoldierCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import FightingMath from '../../../common/utils/FightingMath';
import MathUtil from '../../../common/utils/MathUtil';
import Quadtree from '../../../common/utils/Quadtree';
import { PveFightCtrl } from '../core/PveFightCtrl';
import { PveCampType, PveFightType } from '../core/PveFightModel';
import { PveBaseFightModel } from '../model/PveBaseFightModel';
import PveCalledModel from '../model/PveCalledModel';
import PveEnemyModel from '../model/PveEnemyModel';
import PveHeroModel from '../model/PveHeroModel';
import PveSceneModel from '../model/PveSceneModel';
import PveSoldierModel from '../model/PveSoldierModel';

/** 
 * Pve战斗单元选择器
 * @Author: sthoo.huang  
 * @Date: 2019-05-14 11:59:58 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 20:17:17
 */

/**
 * 英雄类型条件定义
 * 0	无效
 * 1	男性英雄
 * 2	女性英雄
 * 3	不限
 * 4	无性别
 * 5    枪兵英雄
 * 6    炮兵英雄
 * 7    守卫英雄
 * 8    非守卫
 * 9    非满血守卫英雄
 * 10   非满血枪兵英雄
 * 11   非满血炮兵英雄
 * 12   非满血英雄
 * 士兵类型为默认士兵类型（1,3,4）+4 
 * 非满血英雄士兵类型为默认士兵类型（1,3,4）+8 (9 满血状态 10 非满血状态)
 */
const HeroCondition: { [type: number]: number[] } = {
    0: [],
    1: [1, 5, 7, 8, 9, 10],
    2: [2, 5, 7, 8, 9, 10],
    3: [1, 2, 4, 5, 7, 8, 9, 10],
    4: [4, 5, 7, 8, 9, 10],
    5: [1, 2, 4, 5, 9, 10],
    6: [1, 2, 4, 7, 9, 10],
    7: [1, 2, 4, 8, 9, 10],
    8: [1, 2, 4, 5, 7, 9, 10],
    9: [1, 2, 4, 8, 10],
    10: [1, 2, 4, 5, 10],
    11: [1, 2, 4, 7, 10],
    12: [1, 2, 4, 5, 7, 8, 10],
};

/**
 * 小兵类型条件定义
 * 0	无效
 * 1	机枪
 * 2	狙击
 * 3	炮兵
 * 4	守卫
 * 5	不限
 * 6	机枪和狙击
 */
const SoldierCondition: { [type: number]: number[] } = {
    0: [],
    1: [1],
    2: [2],
    3: [3],
    4: [4],
    5: [1, 2, 3, 4],
    6: [1, 2],
    7: [1, 2, 3],
    8: [4],
};

export default class PveFightSelector {

    _tree: Quadtree;

    /**
     * 初始化四叉树
     * @param width 
     * @param height 
     */
    initlize(width: number, height: number) {
        this._tree = new Quadtree({
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
    }

    /**
     * 清除四叉树
     */
    clear() {
        if (!this._tree) return;
        this._tree.clear();
    }

    /**
     * 往四叉树中插入战斗单元实例
     * @param target 
     */
    insertFight(target: PveFightCtrl) {
        let p = target.getPos();
        let n = target['_$N_quad_tree_node'];
        if (!n) {
            target['_$N_quad_tree_node'] = n = {
                width: 1,
                height: 1,
                data: target,
            };
        }
        n.x = p.x;
        n.y = p.y;
        this._tree.insert(n);
    }

    /**
     * 是否只是选择自己为目标
     * @param target_type 
     */
    isOnlySelf(target_type: number): boolean {
        let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
        if (!c) return false;
        if (c.target != 3) return false;
        if (c.general != 0) return false;
        if (c.hero != 0) return false;
        if (c.group != 0) return false;
        if (c.soldier != 0) return false;
        if (c.call != 0) return false;
        if (c.monster != 0) return false;
        return true;
    }

    /**
     * 测试目标是否符合目标类型规则
     * @param self 
     * @param target 
     * @param config 
     */
    validateFight(self: PveFightCtrl, target: PveFightCtrl, config: Skill_target_typeCfg): boolean {
        if (!config) {
            cc.error('配置 Skill.target_type 表中缺少配置，或 target_type 字段为空');
            return;
        }
        if (config.target == 3) {
            // 只对自己有效
            return self === target;
        } else {
            if (!target || !target.isAlive) {
                // 目标不符合要求或已死亡
                return false;
            }
            let sm = self.model;
            let tm = target.model;
            if (config.target == 1 &&
                tm.camp != sm.camp) {
                // 我方
                return false;
            } else if (config.target == 2 &&
                tm.camp == sm.camp) {
                // 敌方
                return false;
            } else if (config.target == 5 && (tm.fightId == sm.fightId ||
                tm.camp != sm.camp)) {
                //排除自己
                return false;
            } else if (config.target == 6 && tm.fightId == sm.fightId) {
                //排除自己
                return false;
            }
            if (config.group > 0) {
                // 阵营
                if (config.group >= 100) {
                    let groups: any = null;
                    if (tm.type == PveFightType.Hero) {
                        // 英雄羁绊
                        let temCfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', tm.config.id);
                        if (temCfg) {
                            groups = temCfg.fetter;
                        }
                    }
                    // 阵营判断
                    if (groups != null) {
                        if (cc.js.isNumber(groups) || cc.js.isString(groups)) {
                            if (groups != config.group) {
                                return false;
                            }
                        } else if (groups.indexOf(config.group) < 0) {
                            return false;
                        }

                    } else {
                        return false;
                    }
                } else {
                    let groups: any = null;
                    if (tm.type == PveFightType.Soldier) {
                        // 小兵
                        let hero = (tm as PveSoldierModel).hero;
                        if (hero && hero.isAlive) {
                            groups = hero.model.config.group;
                        }
                    } else if (tm.type == PveFightType.Call) {
                        // 召唤物
                        let owner = (tm as PveCalledModel).owner;
                        if (owner &&
                            owner.isAlive &&
                            owner.model.type == PveFightType.Hero) {
                            // 所属对象为英雄
                            groups = owner.model.config.group;
                        }
                    } else if (tm.type == PveFightType.Hero) {
                        // 英雄
                        groups = tm.config.group;
                    }
                    // 阵营判断
                    if (groups != null) {
                        if (config.group == 6) {
                            let tem = [1, 2];
                            if (cc.js.isNumber(groups) || cc.js.isString(groups)) {
                                if (tem.indexOf(groups) < 0) {
                                    return false;
                                }
                            } else if (tem.indexOf(groups[0]) < 0) {
                                return false;
                            }
                        } else {
                            if (cc.js.isNumber(groups) || cc.js.isString(groups)) {
                                if (groups != config.group) {
                                    return false;
                                }
                            } else if (groups.indexOf(config.group) < 0) {
                                return false;
                            }
                        }

                    } else {
                        return false;
                    }
                }

            }
            // 根据对象不同的类型进行判断
            switch (tm.type) {
                case PveFightType.Soldier:
                    let sc: number[] = SoldierCondition[config.soldier];
                    if (sc) {
                        let c: SoldierCfg = ConfigManager.getItemById(SoldierCfg, tm.id);
                        if (sc.indexOf(c.type) < 0) {
                            // 小兵具体的类型不符
                            return false;
                        }
                        if (config.soldier == 8 && tm.hp >= tm.hpMax) {
                            return false;
                        }
                    }
                    break;

                case PveFightType.Hero:
                    let hc: number[] = HeroCondition[config.hero];
                    if (hc) {
                        if (hc.indexOf(tm.config.sex) < 0) {
                            // 英雄的性别不符
                            return false;
                        }
                        let tem = tm as PveHeroModel
                        if (hc.indexOf(tem.soldierType + 4) < 0) {
                            // 英雄的类型不符
                            return false;
                        }
                        let hpState = tem.hp == tem.hpMax ? 9 : 10;
                        if (hc.indexOf(hpState) < 0) {
                            // 英雄性别相符
                            return false;
                        }

                    }
                    break;

                case PveFightType.Enemy:
                    // 怪物
                    if (config.monster == 0) {
                        return false;
                    } else if (config.monster != 1) {
                        // 怪物类型与指定类型相同（13:小怪，12:BOSS 11:精英怪）
                        if (config.monster == 21) {
                            return tm.config.color != 12;
                        }
                        return config.monster == tm.config.color;
                    }
                    //demo处理(英雄只攻击所在线路的怪物)
                    if (sm.ctrl.sceneModel.isDemo && sm.type == PveFightType.Hero) {
                        let hm = sm as PveHeroModel
                        let enemy = tm as PveEnemyModel;
                        if (hm.demoRoadIndex > 0 && enemy.roadIndex != hm.demoRoadIndex) {
                            return false;
                        }
                    }
                    break;

                case PveFightType.Genral:
                    // 指挥官
                    if (config.general == 0 || tm.ctrl.node.name == 'general_1') {
                        return false;
                    }
                    break;

                case PveFightType.Call:
                    // 召唤物
                    if (config.call == 0) {
                        return false;
                    }
                    break;
            }
            if (tm.type == PveFightType.Enemy && (tm as PveEnemyModel).brithTime > 0) {
                // 怪物出生无敌阶段
                return false;
            }
            if (!(sm.camp == PveCampType.Neutral || tm.camp == PveCampType.Neutral) &&
                !(tm.camp == sm.camp) &&
                !!tm.getProp('invisible_enemy')) {
                // 非中立敌对目标为隐身状态，无法被选择
                return false;
            }
            if (!(sm.type == PveFightType.Genral) &&
                !!tm.getProp('invisible_noGeneral')) {
                // 对非指挥官隐身，无法被选择
                return false;
            }
            if (sm instanceof PveHeroModel &&
                sm.camp != PveCampType.Neutral &&
                sm.camp != tm.camp) {
                // 非中立敌对英雄
                let soldierType = sm.soldierType;
                if (soldierType != 4 && !!tm.getProp('invisible_noGuard')) {
                    // 对非守卫英雄隐身，无法被选择
                    return false;
                }
                if (soldierType != 1 && !!tm.getProp('invisible_noQiang')) {
                    // 对非枪兵英雄隐身，无法被选择
                    return false;
                }
                if (soldierType != 3 && !!tm.getProp('invisible_noPao')) {
                    // 对非炮兵英雄隐身，无法被选择
                    return false;
                }
                if (soldierType == tm.getProp('invisible_type')) {
                    // 对指定类型英雄隐身，无法被选择
                    return false;
                }
                if (!!tm.getProp('invisible_' + sm.config.id)) {
                    // 对指定英雄隐身，无法被选择
                    return false;
                }
            }
            if (!!tm.getProp('invisible')) {
                // 目标为隐身状态，无法被选择
                return false;
            }
            return true;
        }
    }

    /**
     * 获取所有符合要求的战斗对象列表
     * @param self
     * @param config 
     * @param sceneModel 
     * @param exclude
     * @param pos
     * @param range
     */
    getAllFights(self: PveFightCtrl,
        config: Skill_target_typeCfg,
        sceneModel: PveSceneModel,
        exclude?: PveFightCtrl[],
        pos?: cc.Vec2,
        range?: number
    ): PveFightCtrl[] {
        if (!config) {
            cc.error('配置 Skill.target_type 表中缺少配置，或 target_type 字段为空');
            return;
        }
        let ret: PveFightCtrl[] = [];
        // 为排除项创建索引 [uuid] = true
        let excludeIdx: any;
        if (exclude) {
            excludeIdx = {};
            for (let i = 0, n = exclude.length; i < n; i++) {
                let item = exclude[i];
                excludeIdx[item.uuid] = true;
            }
        }
        // 只对自己有效时
        if (config.target == 3) {
            let target: PveFightCtrl = null;
            if (config.hero == 0 &&
                config.group == 0 &&
                config.general == 0 &&
                config.soldier == 0 &&
                config.monster == 0 &&
                config.call == 0) {
                // 所有其他条件都无效时，则直接对自己生效
                target = self;
            } else {
                // 指定英雄性别
                if (config.hero != 0) {
                    let hc: number[] = HeroCondition[config.hero];
                    switch (self.model.type) {
                        case PveFightType.Hero:
                            let tem = self.model as PveHeroModel;
                            let hpState = tem.hp == tem.hpMax ? 9 : 10;
                            if (hc.indexOf(self.model.config.sex) >= 0 && hc.indexOf(tem.soldierType + 4) >= 0 && hc.indexOf(hpState) >= 0) {
                                // 英雄性别相符
                                target = self;
                            }

                            break;

                        case PveFightType.Soldier:
                            // 小兵
                            let sm = self.model as PveSoldierModel;
                            if (sm.hero &&
                                sm.hero.isAlive &&
                                hc.indexOf(sm.hero.model.config.sex) >= 0) {
                                // 英雄性别相符，且不在排除对象之内
                                if (!excludeIdx || !excludeIdx[sm.hero.uuid]) {
                                    ret.push(sm.hero);
                                }
                            }
                            break;

                        case PveFightType.Call:
                            // 召唤物
                            let cm = self.model as PveCalledModel;
                            if (cm.owner &&
                                cm.owner.isAlive &&
                                cm.owner.model.type == PveFightType.Hero &&
                                hc.indexOf(cm.owner.model.config.sex) >= 0) {
                                // 所属对象为英雄，且性别相符，且不在排除对象之内
                                if (!excludeIdx || !excludeIdx[cm.owner.uuid]) {
                                    ret.push(cm.owner);
                                }
                            }
                            break;
                    }
                }
                // 指定了小兵的类型
                if (config.soldier != 0) {
                    if (self.model.type == PveFightType.Hero) {
                        // 当前类型为英雄时，则添加自己的小兵
                        let m: PveHeroModel = self.model as PveHeroModel;
                        if (m) {
                            for (let i = 0, n = m.soldiers.length; i < n; i++) {
                                let soldier = m.soldiers[i];
                                if (!soldier || !soldier.isAlive) continue;
                                let c: SoldierCfg = ConfigManager.getItemById(SoldierCfg, soldier.model.id);
                                if (c) {
                                    let sc: number[] = SoldierCondition[config.soldier];
                                    if (sc.indexOf(c.type) >= 0) {
                                        // 小兵类型相符
                                        if (!excludeIdx || !excludeIdx[soldier.uuid]) {
                                            if (config.soldier == 8 && soldier.model.hp >= soldier.model.hpMax) {
                                                continue;
                                            }
                                            // 不在排除对象之内
                                            ret.push(soldier);
                                        }
                                    }
                                }
                            }
                        }
                    } else if (self.model.type == PveFightType.Soldier) {
                        // 当自己类型为小兵时，则为小兵自己
                        let m: PveSoldierModel = self.model as PveSoldierModel;
                        let c: SoldierCfg = ConfigManager.getItemById(SoldierCfg, m.id);
                        if (c) {
                            let sc: number[] = SoldierCondition[config.soldier];
                            if (sc.indexOf(c.type) >= 0) {
                                // 小兵类型相符
                                target = self;
                                //守卫血量判断
                                if (config.soldier == 8 && self.model.hp >= self.model.hpMax) {
                                    target = null;
                                }
                            }
                        }
                    } else if (self.model.type == PveFightType.Call) {
                        let cm = self.model as PveCalledModel;
                        let m: PveHeroModel = cm.owner.model as PveHeroModel;
                        if (m) {
                            for (let i = 0, n = m.soldiers.length; i < n; i++) {
                                let soldier = m.soldiers[i];
                                if (!soldier || !soldier.isAlive) continue;
                                let c: SoldierCfg = ConfigManager.getItemById(SoldierCfg, soldier.model.id);
                                if (c) {
                                    let sc: number[] = SoldierCondition[config.soldier];
                                    if (sc.indexOf(c.type) >= 0) {
                                        // 小兵类型相符
                                        if (!excludeIdx || !excludeIdx[soldier.uuid]) {
                                            if (config.soldier == 8 && soldier.model.hp >= soldier.model.hpMax) {
                                                continue;
                                            }
                                            // 不在排除对象之内
                                            ret.push(soldier);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                // 指定的阵营类型
                if (config.group != 0) {
                    let heroes = sceneModel.heros;
                    target = self;
                    if (config.group == 10) {
                        // 任意阵营
                        for (let i = 0, n = heroes.length; i < n; i++) {
                            let hero = heroes[i];
                            if (hero.uuid == self.uuid) continue;
                            if (!excludeIdx || !excludeIdx[hero.uuid]) {
                                // 不在排除对象之内
                                ret.push(hero);
                            }
                        }
                    } else {
                        for (let i = 0, n = heroes.length; i < n; i++) {
                            let hero = heroes[i];
                            if (hero.uuid == self.uuid) continue;
                            if (config.group == 6) {
                                let tem = [1, 2];
                                if (hero.model.config.group instanceof Array &&
                                    tem.indexOf(hero.model.config.group[0]) >= 0) {
                                    // 英雄属于指定阵营
                                    if (!excludeIdx || !excludeIdx[hero.uuid]) {
                                        // 不在排除对象之内
                                        ret.push(hero);
                                    }
                                }
                            } else {
                                if (hero.model.config.group instanceof Array &&
                                    hero.model.config.group.indexOf(config.group) >= 0) {
                                    // 英雄属于指定阵营
                                    if (!excludeIdx || !excludeIdx[hero.uuid]) {
                                        // 不在排除对象之内
                                        ret.push(hero);
                                    }
                                }
                            }

                        }
                    }
                }

                // 指定了怪物类型
                if (config.monster != 0) {
                    // 当自己为怪物时
                    if (self.model.type == PveFightType.Enemy) {
                        target = self;
                    }
                }
                // 指定了守卫类型
                if (config.general != 0) {
                    // 当自己为指挥官时
                    if (self.model.type == PveFightType.Genral) {
                        target = self;
                    }
                }
                // 指定了召唤类型
                if (config.call != 0) {
                    // 自己为召唤物时
                    if (self.model.type == PveFightType.Call) {
                        let cm = self.model as PveCalledModel;
                        target = self;
                        // 查找所有召唤物
                        for (let i = 0, n = sceneModel.calleds.length; i < n; i++) {
                            let call = sceneModel.calleds[i];
                            if (!call || !call.isAlive) continue;
                            if (call === self) continue;
                            if (call.model.owner_id === cm.owner_id) {
                                // 属于自己主人的召唤物，且不在排除对象之内
                                if (!excludeIdx || !excludeIdx[call.uuid]) {
                                    ret.push(call);
                                }
                            }
                        }
                    }
                    // 查找所有召唤物
                    let owner_id = self.model.fightId;
                    for (let i = 0, n = sceneModel.calleds.length; i < n; i++) {
                        let call = sceneModel.calleds[i];
                        if (!call || !call.isAlive) continue;
                        if (call === self) continue;
                        if (call.model.owner_id === owner_id) {
                            // 属于自己的召唤物，且不在排除对象之内
                            if (!excludeIdx || !excludeIdx[call.uuid]) {
                                ret.push(call);
                            }
                        }
                    }
                }
            }
            // 目标有效验证
            if (target && target.isAlive) {
                if (!excludeIdx || !excludeIdx[target.uuid]) {
                    // 不在排除对象之内
                    if (!pos || MathUtil.intersect(target.getPrePos(), target.getPos(), pos, range)) {
                        // 在指定范围之内
                        ret.push(target);
                    }
                }
            }
        } else {
            // 有效目标类型
            let includeTypes: { [type: number]: boolean } = {};
            (config.hero != 0) && (includeTypes[PveFightType.Hero] = true);  // 英雄
            (config.soldier != 0) && (includeTypes[PveFightType.Soldier] = true); // 小兵
            (config.monster != 0) && (includeTypes[PveFightType.Enemy] = true);  // 怪物
            (config.call != 0) && (includeTypes[PveFightType.Call] = true); // 召唤物
            (config.general != 0) && (includeTypes[PveFightType.Genral] = true); // 指挥官
            let validate = this.validateFight;
            let istree = !!pos;
            let objects = istree ? this._tree.retrieve({
                x: pos.x - range,
                y: pos.y - range,
                width: range * 2,
                height: range * 2
            }) : sceneModel.getAllFightArr();
            for (let i = 0, n = objects.length; i < n; i++) {
                let e: PveFightCtrl;
                if (istree) {
                    // 从四叉树中获取对象
                    e = objects[i]['data'];
                } else {
                    // 遍历所有战斗对象时
                    e = <any>objects[i];
                }
                let m = e.model;
                if (!m) continue;   // 无效的目标
                if (includeTypes[m.type] !== true) continue;    // 不符合有效目标类型
                if (excludeIdx && excludeIdx[e.uuid]) continue;  // 排除的目标
                if (pos && !MathUtil.intersect(e.getPrePos(), e.getPos(), pos, range)) continue;   // 不在攻击距离内
                if (validate(self, e, config)) { // 不符合其他条件
                    ret.push(e);
                }
            }
            // 有效目标类型索引
            // let typeIdx = {
            //     'heros': config.hero != 0,   // 英雄
            //     'soldiers': config.soldier != 0, // 小兵
            //     'enemies': config.monster != 0,  // 怪物
            //     'specialEnemies': config.monster != 0,  // 怪物
            //     'calleds': config.call != 0, // 召唤物
            //     'generals': config.general != 0, // 指挥官
            // };
            // 符合条件的则放入结果数组
            // for (let key in typeIdx) {
            //     if (!typeIdx[key]) continue;
            //     let a: PveFightCtrl[] = sceneModel[key];
            //     for (let i = 0, n = a.length; i < n; i++) {
            //         let item = a[i];
            //         if (pos && dis(item.getPos(), pos) > range) continue;
            //         if (excludeIdx && excludeIdx[item.uuid]) continue;
            //         if (validate(self, item, config)) {
            //             ret.push(item);
            //         }
            //     }
            // }
        }
        return ret;
    }

    /**
     * 圆形区域选择器
     * @param all 供选择的对象列表
     * @param pos 圆心坐标
     * @param priority_type 优先方式 
     * @param range 半径
     * @param num 数量
     * @param forceSort 强制按优先级排序
     */
    circleSelect(
        all: PveFightCtrl[],
        pos: cc.Vec2,
        priority_type: number,
        range: number,
        num: number,
        forceSort?: boolean,
    ): PveFightCtrl[] {
        let func = function (t: PveFightCtrl) {
            let radius = t.model.getProp('radius') || 0;
            let b = MathUtil.intersect(t.getPrePos(), t.getPos(), pos, radius + range);
            if (b) {
                return MathUtil.distance(pos, t.getPos());
            }
            return null;
        }
        return this._select(all, func, priority_type, num, forceSort);
    }

    /**
     * 矩形区域选择器
     * @param all 目标列表
     * @param self
     * @param config 
     * @param pos 
     * @param priority_type 
     * @param num 
     * @param forceSort 强制按优先级排序
     */
    boxSelect(all: PveFightCtrl[],
        self: PveFightCtrl,
        config: Skill_target_typeCfg,
        pos: cc.Vec2,
        priority_type: number,
        num: number,
        forceSort?: boolean,
    ): PveFightCtrl[] {
        // 定义测试函数
        let validate = this.validateFight;
        let func = function (t: PveFightCtrl) {
            if (validate(self, t, config)) {
                return MathUtil.distance(pos, t.getPos());
            }
            return null;
        }
        return this._select(all, func, priority_type, num, forceSort);
    }

    /**
     * 筛选
     * @param all 源列表
     * @param func 条件函数，符合条件则返回与源坐标的距离，否则返回null
     * @param priority_type 优先类型
     * @param num 数量
     * @param forceSort 强制按优先级排序
     */
    _select(
        all: PveFightCtrl[],
        func: Function,
        priority_type: number,
        num: number,
        forceSort?: boolean,
    ): PveFightCtrl[] {
        if (!all) return null;
        let n = all.length;
        if (n == 0) return null;
        if (cc.js.isString(num) || num <= 0 || isNaN(num)) num = 1;
        let arr: any[] = [];
        for (let i = 0; i < n; i++) {
            let item = all[i];
            let dis = func(item);
            if (dis != null) {
                // 距离符合要求
                let o: any = {
                    range: Math.ceil(dis),
                    target: item
                };
                switch (priority_type) {
                    case 4:
                    case 6:
                        // 血量
                        o.hp = item.model.hp;
                        break;

                    case 3:
                        // 终点距离，只对怪物有效
                        if (item.model.type == PveFightType.Enemy) {
                            o.road = (item.model as PveEnemyModel).roadLength;
                        }
                        break;
                }
                arr.push(o);
            }
        }
        // 筛选
        if (forceSort || arr.length >= num) {
            switch (priority_type) {
                case 1:
                    // 随机取
                    FightingMath.shuffle(arr);
                    break;

                case 2:
                    // 距离，由近及远
                    arr.sort(this._rangeSort);
                    break;

                case 5:
                    // 距离，由远及近
                    arr.sort(this._rangeSort2);

                case 3:
                    // 终点距离，由近及远
                    arr.sort(this._roadSort);
                    break;

                case 4:
                    // 血量，少的优先
                    arr.sort(this._hpSort);
                    break;

                case 6:
                    // 血量，多的优先
                    arr.sort(this._hpSort2);
                    break;
            }
            //判断特定仇恨值
            arr.sort(this._selecrHate);

            // 去除多余的目标数量
            if (arr.length > num) {
                arr.length = num;
            }
        }
        // 还原数组为 PveFightCtrl[] 类型
        for (let i = arr.length - 1; i >= 0; i--) {
            arr[i] = arr[i].target;
        }
        return arr;
    }

    _selecrHate(a: any, b: any) {
        let hate1 = (a.target.model as PveBaseFightModel).getProp('hate_select');
        let hate2 = (b.target.model as PveBaseFightModel).getProp('hate_select');
        return hate2 - hate1;
    }

    _rangeSort(a: any, b: any) {
        return a.range - b.range;
    }

    _rangeSort2(a: any, b: any) {
        return b.range - a.range;
    }

    _roadSort(a: any, b: any) {
        return a.road - b.road;
    }

    _hpSort(a: any, b: any) {
        return a.hp - b.hp;
    }

    _hpSort2(a: any, b: any) {
        return b.hp - a.hp;
    }
}
