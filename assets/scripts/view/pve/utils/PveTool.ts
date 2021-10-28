import {
    Copy_towerlistCfg, SkillCfg, Skill_buffCfg,
    Skill_effect_typeCfg,
    Skill_haloCfg,
    Skill_target_typeCfg
} from '../../../a/config';
import { IPool } from '../../../common/core/BaseInterface';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import CopyModel, { CopyType } from '../../../common/models/CopyModel';
import ShaderHelper, { ShaderProperty } from '../../../common/shader/ShaderHelper';
import ErrorUtils from '../../../common/utils/ErrorUtils';
import FightingMath from '../../../common/utils/FightingMath';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import MathUtil from '../../../common/utils/MathUtil';
import StringUtils from '../../../common/utils/StringUtils';
import PanelId from '../../../configs/ids/PanelId';
import PveRes from '../const/PveRes';
import { PveSkillType, PveTargetType } from '../const/PveSkill';
import { PveFightCtrl } from '../core/PveFightCtrl';
import PveFightModel, { PveCampType, PveFightType } from '../core/PveFightModel';
import { PveBuffTipType } from '../ctrl/base/PveBuffTipEffect';
import { PveHurtType } from '../ctrl/base/PveHurtEffect';
import PveSkillNameEffect from '../ctrl/base/PveSkillNameEffect';
import PveBaseFightCtrl from '../ctrl/fight/PveBaseFightCtrl';
import PveCalledCtrl from '../ctrl/fight/PveCalledCtrl';
import PveSceneCtrl from '../ctrl/PveSceneCtrl';
import PveBaseSkillCtrl from '../ctrl/skill/PveBaseSkillCtrl';
import PveFsmEventId from '../enum/PveFsmEventId';
import PveSceneState from '../enum/PveSceneState';
import { PveBaseFightModel, SkillIdLv } from '../model/PveBaseFightModel';
import PveBuffModel, { PveBuffArgs } from '../model/PveBuffModel';
import PveHaloModel from '../model/PveHaloModel';
import PveSceneModel from '../model/PveSceneModel';
import PveSkillModel from '../model/PveSkillModel';
import PveSoldierModel from '../model/PveSoldierModel';
import { Skill_callCfg } from './../../../a/config';
import PveBSExprUtils, { PveBSEventArgs, PveBSScopeType } from './PveBSExprUtils';
import PveFightUtil from './PveFightUtil';
import PvePool from './PvePool';

/**
 * Pve场景工具类 
 * @Author: sthoo.huang
 * @Date: 2019-04-19 16:13:10
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-25 16:26:02
 */
let Proxy: any = window['Proxy'];

interface SearchTargetOption {
    fight: PveFightCtrl;    // 施法者
    targetType: number; // 目标类型
    pos: cc.Vec2;   // 中心坐标
    range: number;  // 范围
    num?: number;    // 目标数量
    targets?: PveFightCtrl[];   // 已有目标
    excludes?: PveFightCtrl[];  // 排除目标
    priority?: boolean; // 是否使用 priority_type2
}

class PveTool {

    /**
     * 为战斗单元选择目标
     * @param opt 
     */
    searchTarget(opt: SearchTargetOption) {
        let m = opt.fight.sceneModel;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, opt.targetType);
        // 如果当前目标符合要求，则优先使用当前的目标
        // let target = m.getFightBy(opt.fight.model.targetId);
        // if (target &&
        //     target.isAlive &&
        //     MathUtil.distance(opt.pos, target.getPos()) <= opt.range &&
        //     m.fightSelector.validateFight(opt.fight, target, c)) {
        //     return target;
        // }
        // 寻找一个新的目标
        let all = m.fightSelector.getAllFights(opt.fight, c, opt.fight.sceneModel, null, opt.pos, opt.range);
        if (all && all.length > 0) {
            let priority_type = this.getPriorityType(c, opt.priority);
            all = m.fightSelector.circleSelect(all, opt.pos, priority_type, opt.range, 1, true);
            if (all && all.length > 0) {
                return all[0];
            }
        }
        return null;
    }

    /**
     * 寻找更多的目标
     * @param pos 
     * @param range 
     * @param num 
     * @param arr 
     */
    searchMoreTarget(opt: SearchTargetOption): PveFightCtrl[] {
        let arr = opt.targets || [];
        // 移除空值或死亡对象
        for (let i = arr.length - 1; i >= 0; i--) {
            if (!arr[i] || !arr[i].isAlive) {
                arr.splice(i, 1);
            }
        }
        // 符合要求，不需要再寻找目标
        if (arr.length >= opt.num) {
            return arr;
        }
        // 排除列表
        if (opt.excludes && opt.excludes.length > 0) {
            if (arr.length > 0) opt.excludes.push(...arr);
        } else if (arr.length > 0) {
            opt.excludes = arr;
        }
        // 查找符合要求的对象
        let m = opt.fight.sceneModel;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, opt.targetType);
        let all = m.fightSelector.getAllFights(opt.fight, c, m, opt.excludes, opt.pos, opt.range);
        if (all && all.length > 0) {
            let priority_type = this.getPriorityType(c, opt.priority);
            all = m.fightSelector.circleSelect(all, opt.pos, priority_type, opt.range, opt.num - arr.length, true);
            if (all && all.length) {
                arr.push(...all);
            }
        }
        return arr;
    }

    getPriorityType(c: Skill_target_typeCfg, priority: boolean): number {
        if (priority &&
            cc.js.isNumber(c.priority_type2) &&
            c.priority_type2 > 0) {
            // 使用额外的优先方式定义
            return c.priority_type2;
        }
        return c.priority_type;
    }

    /**
     * 使用技能
     * @param model 
     * @param sceneModel 
     */
    useSkill(model: PveSkillModel, sceneModel: PveSceneModel): PveBaseSkillCtrl {
        // 显示主动技能的名称
        if (model.config.show_name == 1 && model.continueTime <= 0) {
            let node: cc.Node = PvePool.get(sceneModel.ctrl.skillNameEffect);
            let ctrl = node.getComponent(PveSkillNameEffect);
            let hero = model.attacker as PveBaseFightCtrl;
            ctrl.sceneModel = sceneModel;
            ctrl.target = hero;
            ctrl.value = model.config.name;
            sceneModel.ctrl.hurt.addChild(node);
        }
        // 目标无效，直接回调完成函数
        if (!model.targetPos && !model.validate) {
            let o = model.option;
            o && o.onComplete && o.onComplete.call(o.thisArg);
            return;
        }
        // 创建技能实例
        let prefab: cc.Prefab = sceneModel.ctrl.skillPrefabs[model.effectType.index];
        let node: cc.Node = PvePool.get(prefab);
        let ctrl = node.getComponent(PveBaseSkillCtrl);
        node.x = node.y = 0;
        model.ctrl = ctrl;
        ctrl.model = model;
        ctrl.sceneModel = sceneModel;
        sceneModel.ctrl.effect.addChild(node);
        sceneModel.skills.push(ctrl);
        if (CC_DEBUG && sceneModel.skills.length > 300) {
            cc.warn(`技能实例数超过${sceneModel.skills.length}，检查确认是否存在泄漏`);
        }
        return ctrl;
    }

    /**
     * 计算技能效果
     * @param model 
     * @param index 目标索引，如果小于0则对所的目标产生效果
     */
    evalSkillExpr(model: PveSkillModel, index: number) {
        // 攻击者已死亡，则不会产生伤害
        let attacker = model.attacker;
        if (!attacker || !attacker.isAlive) {
            return;
        }
        let targets: number[];
        let seleted = model.selectedTargets;
        let n = seleted.length;
        if (model.multiple && n > 1) {
            // 对单个目标产生效果
            targets = [index];
        } else if (n > 0) {
            // 对每个目标进行计算
            targets = [];
            for (let i = 0; i < n; i++) {
                targets.push(i);
            }
        } else {
            // 没有目标
            return;
        }
        let l = targets.length;
        if (l > 0) {
            let m = attacker.sceneModel;
            // 通用环境变量
            let scope: PveBSScopeType = {
                sm: model,
            };
            for (let i = 0; i < l; i++) {
                let idx = targets[i];
                let target = m.getFightBy(seleted[idx]);
                if (!target || !target.isAlive) return;
                this._evalSkillExprOne(model, target, scope, m.isDemo);
                if (!target.isAlive) {
                    seleted[idx] = -1;
                }
            }
        }


    }

    /**
     * 对一个目标计算技能效果
     * @param model 
     * @param target 
     * @param expr 
     * @param scope 
     */
    _evalSkillExprOne(model: PveSkillModel, target: PveFightCtrl, scope: PveBSScopeType, isDemo: boolean) {

        // 保存目标fightId至列表
        let fightId = target.model.fightId;
        let index = model.damagedList.indexOf(fightId);
        if (index >= 0) {
            model.damagedList.splice(index, 1);
        }
        model.damagedList.push(fightId);
        model.evalExprCount++;

        // 计算伤害表达式，及产生技能效果
        let totalHp: number = 0; // 总伤害
        let hasCrit: boolean = false; // 是否有暴击
        // 施法者列表
        let attackers: PveFightCtrl[] = [model.attacker];
        while (attackers.length) {
            let attacker = attackers.shift();
            let am = attacker.model;
            // 技能数据
            let config = model.config;
            if (model.attacker.model.type == PveFightType.Hero && am.type == PveFightType.Soldier) {// && am.config.type != 4
                // 机枪、狙击和炮兵使用自己的技能
                let am = attacker.model as PveSoldierModel;
                let skills = am.skills;
                for (let j = 0, m = skills.length; j < m; j++) {
                    let skill = skills[j];
                    if (PveSkillType.isNormal(skill.type)) {
                        config = skill.config;
                        break;
                    }
                }
                // 保存一个英雄的技能属性
                scope.hs = model.config;
            }

            // 没有技能
            if (!config) {
                CC_DEBUG && cc.error('没有主动技能，不能发起攻击');
                continue;
            }

            // 环境变量
            scope.am = am;
            scope.s = config;
            scope.a = am.prop;
            // 施法者是否已经死亡
            if (!attacker.isAlive) break;
            scope.tm = target.model;
            scope.t = scope.tm.prop;
            scope._target_map = null;
            //添加暴击默认值
            scope['CRIT'] = 0;
            // 生成光环
            let halo_id: any = config.halo_id;
            if (cc.js.isNumber(halo_id) && halo_id > 0) {
                // 验证halo的有效性
                let haloCfg = ConfigManager.getItemById(Skill_haloCfg, halo_id);
                if (haloCfg) {
                    if (target.sceneModel.fightSelector.isOnlySelf(haloCfg.target_type)) {
                        // 只对自己生效的光环，则转换为永久BUFF
                        let buff_time = 9999;
                        if (cc.js.isNumber(config.halo_time) && config.halo_time > 0) {
                            buff_time = config.halo_time;
                        }
                        this.addBuffsTo(
                            scope.am.fightId,
                            scope.a,
                            target,
                            haloCfg.buff_id,
                            buff_time,
                        );
                    } else {
                        // 正常的光环
                        let m: PveHaloModel = PvePool.get(PveHaloModel);
                        m.id = halo_id;
                        let t: any = config.halo_time;
                        if (cc.js.isNumber(t) && t > 0) {
                            m.remain = t;
                        }
                        target.addHalo(m);
                    }
                } else {
                    CC_DEBUG && cc.error(`找不到光环配置, skill_id: ${config.id}, halo_id: ${halo_id}`);
                }
            }

            // 技能产生BUFF效果，要求目标规则与技能一致（不单独配置）
            if (!cc.js.isString(config.buff_id) &&
                (cc.js.isString(config.buff_target_type) || config.buff_target_type == config.target_type)) {
                // 验证buff的有效性
                this.addBuffsTo(
                    scope.am.fightId,
                    scope.a,
                    target,
                    config.buff_id,
                    config.buff_time,
                    config['buff_args']
                );
            }

            // 计算表达式
            if (config.hurt_expr) {
                let keys = Object.keys(scope);
                if (isDemo) {
                    // 挂机战斗不计算表达式，敌方阵营减1/3血量，我方阵营免伤
                    if (scope.tm.camp == PveCampType.Enemy) {
                        //scope.hp = -1 * Math.ceil(scope.t.hp / 3);
                        PveBSExprUtils.eval(attacker, target, config.hurt_expr, scope);
                    } else {
                        if (StringUtils.startsWith(config.hurt_expr, 'demo_Hero_moveTo')) {
                            PveBSExprUtils.eval(attacker, target, config.hurt_expr, scope);
                        }
                        scope.hp = 0;
                    }
                } else {
                    // 普攻的暴击属性提取
                    if (PveSkillType.isNormal(model.config.type)) {
                        // 只对普通攻击计算暴击值
                        if (scope.sm.crits[scope.am.type] === void 0 || scope.s.target_num == 1) {
                            // 还没有暴击值
                            // const key = 'CRIT=rate((30000+a.crit)/(30000+t.crit_res)-1+(a.crit_v-t.crit_v_res)/10000,1+a.hurt/100,0)';
                            // PveBSExprUtils.eval(attacker, target, key, scope);
                            // scope.sm.crits[scope.am.type] = scope['CRIT'];
                            scope.sm.crits[scope.am.type] = MathUtil.rate((30000 + scope.a.crit) / (30000 + scope.t.crit_res) - 1 + (scope.a.crit_v - scope.t.crit_v_res) / 10000) ? 1 + Math.max(scope.a.hurt - scope.t.hurt_res, 0.1) / 100 : 0;
                        }
                        // 则使用已有暴击值
                        scope['CRIT'] = scope.sm.crits[scope.am.type];
                    }
                    // 计算伤害表达式
                    try {
                        PveBSExprUtils.eval(attacker, target, config.hurt_expr, scope);
                        // 目标异常死亡
                        if (!target.isAlive) continue;
                    } catch (error) {
                        ErrorUtils.post(`技能( id: ${config.skill_id}, lv: ${config.level} )伤害表达式( ${config.hurt_expr} )配置错误, ${error}`);
                        continue;
                    }
                }
                // 伤害相关
                if (cc.js.isNumber(scope.hp)) {
                    // 闪避事件
                    if (scope['HIT'] == 0) {
                        let ondodge = scope.tm.prop.ondodge
                        if (ondodge != null && typeof ondodge === 'object') {
                            // 验证ondodge事件对象有效
                            this.evalBuffEvent(
                                ondodge,
                                scope.am.fightId,
                                scope.a,
                                attacker,
                                target,
                                scope,
                            );
                        }
                        let isEnemy = attacker.model.type == PveFightType.Enemy ? true : false;
                        target.showBuffTip("buff_shanbi", PveBuffTipType.BUFF, isEnemy);
                    }

                    // 产生伤害事件
                    if (scope.hp < 0) {
                        // 伤害事件
                        let onhurt = scope.tm.prop.onhurt;
                        if (onhurt != null && typeof onhurt === 'object') {
                            this.evalBuffEvent(
                                onhurt,
                                scope.am.fightId,
                                scope.a,
                                attacker,
                                target,
                                scope,
                            );
                            // 目标异常死亡
                            if (!target.isAlive) continue
                        }
                    } else if (scope.hp > 0) {
                        // 目标有回血害事件
                        let onrestore = scope.tm ? scope.tm.prop.onrestore : null;
                        if (onrestore != null && typeof onrestore === 'object') {
                            this.evalBuffEvent(
                                onrestore,
                                scope.am.fightId,
                                scope.a,
                                attacker,
                                target,
                                scope,
                            );
                        }
                        if (scope.a && scope.a.add_restoreDmg > 0) {
                            // let tem = attacker.model.getProp('add_restoreDmg');
                            scope.hp = Math.floor(scope.hp * (1 + scope.a.add_restoreDmg));
                        }
                    }

                    // 攻击事件
                    let onatk = scope.a ? scope.a.onatk : null;
                    if (onatk != null && typeof onatk === 'object' && scope.am.camp != scope.tm.camp) {
                        this.evalBuffEvent(
                            onatk,
                            scope.am.fightId,
                            scope.a,
                            attacker,
                            target,
                            scope,
                        );
                    }

                    scope.hp = Math.ceil(scope.hp);
                    // 目标死亡事件
                    let temShied = scope.tm.shield + scope.tm.getBuffShiedValue();
                    if (scope.tm.hp + temShied + scope.hp <= 0) {
                        // 技能表达式中的杀死目标事件
                        if (scope.onkill != null && typeof scope.onkill === 'object') {
                            this.evalBuffEvent(
                                scope.onkill,
                                scope.am.fightId,
                                scope.a,
                                attacker,
                                target,
                                scope,
                            );
                            delete scope.onkill;
                        }

                        // BUFF中的杀死目标事件
                        let onkill = scope.a ? scope.a.onkill : null;
                        if (onkill != null && typeof onkill === 'object') {
                            // 验证onatk事件对象有效
                            this.evalBuffEvent(
                                onkill,
                                scope.am.fightId,
                                scope.a,
                                attacker,
                                target,
                                scope,
                            );
                            delete scope.a.onkill;
                        }

                        // 目标死亡事件
                        let ondead = scope.t ? scope.t.ondead : null;
                        if (ondead != null && typeof ondead === 'object') {
                            this.evalBuffEvent(
                                ondead,
                                scope.am.fightId,
                                scope.a,
                                attacker,
                                target,
                                scope,
                            );
                        }
                        //指定英雄击杀指定怪物
                        if (attacker.sceneModel.gateconditionUtil && attacker.sceneModel.gateconditionUtil.heroKillMonsterLimit.length > 0) {
                            attacker.sceneModel.gateconditionUtil.heroKillMonsterLimit.forEach(index => {
                                let data = attacker.sceneModel.gateconditionUtil.DataList[index]
                                if ((attacker.model.config.id == data.cfg.data1 && target.model.config.id == data.cfg.data2 && data.cfg.data3 == "")) {
                                    data.state = true;
                                    data.curData = 1;
                                }
                            })
                        }
                    }

                    // 计算最终血量
                    let result = this.pveGetRealHurt(scope.tm, scope.hp);

                    // 添加战斗信息
                    if (attacker.sceneModel.battleInfoUtil) {
                        let hp = result.hp + result.shield;
                        let type = PveHurtType.SKILL;
                        if (hp > 0) {
                            // 回血
                            type = PveHurtType.RECOVER;
                        } else if (PveSkillType.isNormal(model.config.type)) {
                            // 普攻
                            type = PveHurtType.NORMAL;
                        }
                        if ('CRIT' in scope) {
                            if (scope['CRIT'] > 0) {
                                type = PveHurtType.CRIT;
                            }
                        }
                        let damageType = cc.js.isNumber(model.config.dmg_type) ? model.config.dmg_type : 0;
                        attacker.sceneModel.battleInfoUtil.addBattleInfo(
                            model.id,
                            type,
                            damageType,
                            scope.am.fightId,
                            scope.am.id,
                            scope.am.type,
                            scope.tm.fightId,
                            scope.tm.id,
                            scope.tm.type,
                            hp,
                        );

                        //特定英雄攻击范围内外的伤害统计
                        if (scope.hp < 0 && attacker.sceneModel.gateconditionUtil && attacker.sceneModel.gateconditionUtil.HeroAttackDisDamage.length > 0) {
                            attacker.sceneModel.gateconditionUtil.HeroAttackDisDamage.forEach(index => {
                                let data = attacker.sceneModel.gateconditionUtil.DataList[index];
                                if (am.type == PveFightType.Hero && scope.tm.type == PveFightType.Enemy) {
                                    if (am.config.id == data.cfg.data1) {
                                        let dis = MathUtil.distance(am.ctrl.getPos(), scope.tm.ctrl.getPos());
                                        if (data.cfg.data3 == 1) {
                                            if (dis <= am.range) {
                                                data.curData += Math.abs(scope.hp)
                                            }
                                        } else if (data.cfg.data3 == 2) {
                                            if (dis > am.range) {
                                                data.curData += Math.abs(scope.hp)
                                            }
                                        }
                                        data.state = data.curData >= data.cfg.data2;
                                    }
                                }
                            })
                        }
                    }

                    // 输出调试信息
                    window['TD_TEST'] && cc.log(
                        '结果:', result.hp + result.shield,
                        // ', 施法者:', attacker,
                        // ', 目标:', model.selectedTargets,
                        ', 技能ID:', config.skill_id,
                        ', 等级:', config.level,
                        ', 表达式:', config.hurt_expr,
                    );

                    // 统计总伤害
                    totalHp += result.hp + result.shield;
                    delete scope.hp;

                    // 目标减血
                    target.onAttacked(attacker, model);
                    //result.shield && (target.model.shield += result.shield);
                    result.shield && target.model.refreshShied(result.shield); //刷新护盾值
                    result.hp && (target.model.hp += result.hp);

                    // 暴击标志
                    (!hasCrit) && (hasCrit = 'CRIT' in scope && scope['CRIT'] > 0);
                }
                // 清除计算时留下的变量
                Object.keys(scope).forEach(key => {
                    if (keys.indexOf(key) >= 0) return;
                    delete scope[key];
                });
            } else {
                // 攻击目标事件
                let onatk = scope.a ? scope.a.onatk : null;
                if (onatk != null && typeof onatk === 'object' && scope.am.camp != scope.tm.camp) {
                    scope.hp = 0;
                    this.evalBuffEvent(
                        onatk,
                        scope.am.fightId,
                        scope.a,
                        model.attacker,
                        target,
                        scope,
                    );
                }
            }

            // // 动态添加攻击者
            // if (attacker.isAlive && am.type == PveFightType.Hero && PveSkillType.isNormal(model.config.type)) {
            //     let hm = am as PveHeroModel;
            //     // 机枪、狙击和炮兵参于攻击目标所有对象
            //     // if (hm.soldierType != 4) {
            //     attackers.push(...hm.soldiers);
            //     // }
            // }

            // 计算连击,攻击次数
            let tem = am as PveBaseFightModel
            if (tem.targetId == fightId || (tem.type == PveFightType.Soldier)) {// && tem.config.type != 4
                tem.double_hit++;
            }
            tem.countinue_hit++;
        }

        // 施法者死亡
        let attacker = model.attacker;
        if (!attacker || !attacker.isAlive) return;

        // 显示飘血数字
        if (totalHp != 0) {
            let type = PveHurtType.SKILL;
            if (hasCrit) {
                // 有暴击时优先显示暴击
                type = PveHurtType.CRIT
            } else {
                // 普通效果
                if (totalHp > 0) {
                    // 回血
                    type = PveHurtType.RECOVER;
                } else if (PveSkillType.isNormal(model.config.type)) {
                    // 普攻
                    type = PveHurtType.NORMAL;
                }
            }
            target.showHurt(totalHp, type, attacker.getPos().x > target.getPos().x ? -1 : 1, cc.js.isString(model.config.dmg_type) ? 0 : model.config.dmg_type);
        }
    }

    /**
     * 获取真实的伤害值和护盾值，返回值：{ hp:生命正为加负为减，shield:护盾正为加负为减 }
     * @param target 
     * @param hurt 负为伤害，正为回血
     */
    pveGetRealHurt(target: PveFightModel, hurt: number): {
        hp: number,
        shield: number
    } {
        let hp = 0;
        let shield = 0;
        if (hurt < 0) {
            // 伤害
            let temShied = target.shield + target.getBuffShiedValue();
            hp = temShied + hurt;
            if (hp >= 0) {
                // 护盾可以完全抵消
                shield = hurt;
                hp = 0;
            } else {
                // 护盾只能抵消一部分伤害
                shield = -temShied;
                hp = Math.max(target.hp + hp, 0) - target.hp;
            }
        } else if (hurt > 0) {
            // 回血
            if (target.getProp('hpToShied')) {
                if (target.hp + hurt > target.hpMax) {
                    let temAdd = target.hp + hurt - target.hpMax;
                    let max = target.getProp('hpToShied');
                    shield = Math.min(max, temAdd / target.hpMax) * target.hpMax;
                    hp = target.hpMax - target.hp
                } else {
                    hp = hurt;
                }
            } else {
                hp = Math.min(target.hp + hurt, target.hpMax) - target.hp;
            }
        }
        return { hp: Math.floor(hp), shield: Math.floor(shield) };
    }
    /**
     * 添加BUFF列表（多个BUFF效果）
     * @param attacker_id
     * @param attacker_prop 
     * @param target 
     * @param buff_ids 
     * @param buff_time 
     * @param args
     */
    addBuffsTo(
        attacker_id: number,
        attacker_prop: any,
        target: PveFightCtrl,
        buff_ids: number | number[],
        buff_time: number | number[],
        args?: PveBuffArgs
    ) {
        if (cc.js.isString(buff_ids)) return;
        // 单个BUFF
        let buff_id: any = buff_ids as any;
        if (cc.js.isNumber(buff_id)) {
            let time = Number.MAX_VALUE;
            if (buff_time instanceof Array) {
                if (buff_time.length > 0 && buff_time[0] > 0) {
                    time = buff_time[0];
                }
            } else if (buff_time > 0) {
                time = buff_time as number;
            }
            this.addBuffTo(attacker_id, attacker_prop, target, buff_id, time, args);
        } else {
            let a: number[] = buff_id;
            if (!a && !a.length) return;
            for (let i = 0, n = a.length; i < n; i++) {
                let time = Number.MAX_VALUE;
                if (buff_time instanceof Array) {
                    if (buff_time.length > i && buff_time[i] > 0) {
                        time = buff_time[i];
                    }
                } else if (buff_time > 0) {
                    time = buff_time as number;
                }
                this.addBuffTo(attacker_id, attacker_prop, target, a[i], time, args);
            }
        }
    }

    /**
     * 为目标添加一个BUFF效果
     * @param attacker_id
     * @param attacker_prop 
     * @param target 
     * @param sceneModel 
     * @param buff_id 
     * @param buff_time 
     * @param args
     */
    addBuffTo(
        attacker_id: number,
        attacker_prop: any,
        target: PveFightCtrl,
        buff_id: number,
        buff_time: number,
        args?: PveBuffArgs
    ) {
        if (!buff_id) return;
        if (!target || !target.isAlive) return;
        let b: boolean = true//!target.sceneModel.isDemo;
        if (b && args && cc.js.isNumber(args.rate)) {
            b = FightingMath.rate(args.rate);
        }
        if (b) {
            let m: PveBuffModel = PvePool.get(PveBuffModel);
            m.args = args;
            m.id = buff_id;
            m.remain = buff_time;
            m.max_remain = buff_time;
            m.attacker_id = attacker_id;
            m.attacker_prop = attacker_prop; // this.getProxyObj(Object['assign']({}, attacker_prop));
            // BUFF添加至目标
            target.addBuff(m);
        }
    }

    /**
     * Buff和Skill事件扩展
     * @param args 
     * @param attacker_id 
     * @param attacker_prop 
     * @param attacker
     * @param target 
     * @param scope 
     */
    evalBuffEvent(
        args: PveBSEventArgs | PveBSEventArgs[],
        attacker_id: number,
        attacker_prop: any,
        attacker: PveFightCtrl,
        target?: PveFightCtrl,
        scope?: PveBSScopeType,
    ) {
        (target === void 0) && (target = attacker);
        let arr: PveBSEventArgs[];
        if (args instanceof Array) {
            arr = args;
        } else {
            arr = [args];
        }
        arr.forEach(item => {
            // 召唤新的BUFF
            if (item.buff) {
                let b: boolean = true;
                if (cc.js.isNumber(item.buff.rate)) {
                    b = FightingMath.rate(item.buff.rate);
                }
                if (b) {
                    target = item.buff.target == 1 ? attacker : target;
                    target && target.isAlive && this.addBuffsTo(
                        attacker_id,
                        attacker_prop,
                        target,
                        item.buff.id,
                        item.buff.time,
                        item.buff.args
                    );
                }
            }
            // 召唤陷阱
            if (item.trap) {
                let b: boolean = true;
                if (cc.js.isNumber(item.trap.rate)) {
                    b = FightingMath.rate(item.trap.rate);
                }
                if (b) {
                    PveFightUtil.createTrap(
                        target.sceneModel,
                        item.trap.id,
                        item.trap.time,
                        target.getPos(),
                        attacker,
                    );
                }
            }
            // 使用技能（施法者存在并且没有死亡）
            if (item.skill && attacker && attacker.isAlive) {
                let b: boolean = true;
                if (cc.js.isNumber(item.skill.rate)) {
                    b = FightingMath.rate(item.skill.rate);
                }
                if (b) {
                    let model = PvePool.get(PveSkillModel);
                    model.config = ConfigManager.getItemByField(SkillCfg, 'skill_id', item.skill.id, { level: item.skill.lv });
                    model.attacker = attacker;
                    switch (item.skill.target) {
                        case 0:
                            // 目标为自己（施法者）
                            model.addTarget(attacker);
                            break;

                        case 1:
                            // 目标为当前目标
                            model.addTarget(target);
                            break;

                        default:
                            // 不添加默认目标，由技能配置的目标类型决定
                            let temTarget: PveFightCtrl = this.searchTarget({
                                fight: attacker,
                                targetType: model.config.target_type,
                                pos: attacker.getPos(),
                                range: model.config.range,
                            });
                            if (temTarget) {
                                model.addTarget(temTarget);
                            }
                            break;
                    }
                    this.useSkill(model, attacker.sceneModel);
                }
            }
            // 召唤召唤物
            if (item.summon) {
                let b: boolean = true;
                if (cc.js.isNumber(item.summon.rate)) {
                    b = FightingMath.rate(item.summon.rate);
                }
                if (b) {
                    let owner = item.summon.target == 0 ? attacker : target;
                    let sm = owner.sceneModel;
                    let id = cc.js.isNumber(item.summon.id) ? item.summon.id : target.model.id;
                    for (let i = 0; i < item.summon.num; i++) {
                        PveFightUtil.createCaller(
                            sm,
                            id,
                            item.summon.time,
                            {
                                call_id: -1,
                                owner: owner,
                                pos: target.getPos(),
                                index: i,
                                total: item.summon.num,
                            },
                        );
                    }
                }
            }
            // 召唤怪物
            if (item.monster) {
                let b: boolean = true;
                if (cc.js.isNumber(item.monster.rate) && item.monster.rate < 1) {
                    b = FightingMath.rate(item.monster.rate);
                }
                if (b) {
                    let t = item.monster.target == 0 ? attacker : target;
                    let id = cc.js.isNumber(item.monster.id) ? item.monster.id : t.model.id;
                    PveFightUtil.createEnemyBy(
                        t,
                        item.monster.num,
                        id,
                        t.getPos(),
                        null,
                        null,
                        null,
                        item.monster.time,
                    );
                }
            }
            // 计算表达式
            if (item.expr) {
                try {
                    PveBSExprUtils.eval(attacker, target, item.expr, scope);
                } catch (error) {
                    ErrorUtils.post(`事件表达式( ${item.expr} )配置错误, ${error}`);
                }
            }
            //删除buff
            if (item.deletebuff) {
                if (item.deletebuff.type) {
                    let buffs = target.model.buffs;
                    for (let i = buffs.length - 1; i >= 0; i--) {
                        if (buffs[i].config.type == item.deletebuff.type) {
                            buffs.splice(i, 1);
                        }
                    }
                }
                if (item.deletebuff.dmg_type) {
                    let buffs = target.model.buffs;
                    for (let i = buffs.length - 1; i >= 0; i--) {
                        if (buffs[i].config.dmg_type == item.deletebuff.dmg_type) {
                            buffs.splice(i, 1);
                        }
                    }
                }
                if (item.deletebuff.buff_id) {
                    let buffs = target.model.buffs;
                    for (let i = buffs.length - 1; i >= 0; i--) {
                        if (buffs[i].config.id == item.deletebuff.buff_id) {
                            buffs.splice(i, 1);
                        }
                    }
                }
            }
        });
    }

    /**
     * 清理spine实例便于复用
     * @param spine 
     */
    clearSpine(spine: sp.Skeleton) {
        spine.setStartListener(null);
        spine.setCompleteListener(null);
        spine.setEventListener(null);
        if (cc.isValid(spine.skeletonData)) {
            if (spine.isAnimationCached()) {
                spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
            }
            spine.clearTracks();
        }
        spine.timeScale = 1.0;
        spine.skeletonData = null;
        spine.enableBatch = false;
        if (spine.isAnimationCached()) {
            spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
        }
        // 还原spine值
        spine['_accTime'] = 0;
        spine['_playCount'] = 0;
        spine['_playTimes'] = 0;
        spine['_animationQueue'].length = 0;
        spine['_curFrame'] = null;
        spine['_frameCache'] = null;
        spine['_endEntry']['animation']['name'] = '';
        spine['_startEntry']['animation']['name'] = '';
        // 还原node
        spine.node.angle = 0;
        spine.node.scaleX = 1;
        spine.node.scaleY = 1;
        spine.node.zIndex = 0;
        spine.node.stopAllActions();
        // 清除材质
        // spine['_material']._texture = null;
        // spine['_material']._hash = '';
        spine['_animationName'] = null;
        spine['_listener'] = null;
        spine['_rootBone'] = null;
        spine['_skeleton'] = null;
        spine['_skeletonCache'] = null;
        // spine['_material'] = null;
        // spine['_materials'].length = 0;
        // spine['_materialCache'] && cc.js.clear(spine['_materialCache']);
        // cc.js.clear(spine['_material']._texIds);
        // cc.js.clear(spine['_material']._effect._properties);
        // cc.js.clear(spine['_materialCache']);
        delete spine['_state'];
        delete spine['_clipper'];
        // 禁用拖尾组件
        let streak = spine.node.getComponentInChildren(cc.MotionStreak);
        if (streak) {
            streak.texture = null;
            streak.node.active = false;
        }
        // 禁用Shader组件
        this.setSpineShader(spine);
    }

    createSpine(
        prefab: cc.Prefab,
        parent: cc.Node,
        url: string | sp.SkeletonData,
        animation: string = 'default',
        loop: boolean = false,
        timeScale: number = 1.0,
        callback?: (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => void,
        check?: () => boolean,
        pos?: cc.Vec2,
        cache?: boolean,
        enableBatch?: boolean,
        zIndex?: number,
        pool: IPool = PvePool,
        timeout: number = 6,
        release?: boolean,
    ) {
        let resId = gdk.Tool.getResIdByNode(parent);
        // 加载成功函数
        let loaded = (res: sp.SkeletonData) => {
            if (!cc.isValid(parent)) return;
            if (!parent.activeInHierarchy) return;
            if (!animation) {
                // 不指定动作名时，从所有动作中随机一个动作
                let arr = this.getSpineAnimations(res);
                animation = arr[FightingMath.rnd(0, arr.length - 1)];
            } else if (animation == 'default') {
                // 使用默认的第一个动作
                let arr = this.getSpineAnimations(res);
                animation = arr[0];
            }
            if (!animation || !this.hasSpineAnimation(res, animation)) {
                // 动作不存在，则直接退出
                return;
            }
            if (typeof check === 'function' && !check()) return;
            let n: cc.Node = pool.get(prefab);
            let s: sp.Skeleton = n.getComponent(sp.Skeleton);
            s.setAnimationCacheMode(cache ? sp.Skeleton.AnimationCacheMode.SHARED_CACHE : sp.Skeleton.AnimationCacheMode.REALTIME);
            s.enableBatch = !!enableBatch;
            s.skeletonData = res;
            s.paused = false;
            s.node.active = true;
            s.loop = loop;
            s.animation = animation;
            s.timeScale = timeScale;
            // 播放完成后回调
            if (typeof callback === 'function') {
                let complete = () => {
                    s.setCompleteListener(null);
                    gdk.DelayCall.cancel(complete, this);
                    // 回调函数
                    let func = callback;
                    if (func) {
                        callback = null;
                        func(s, resId, res);
                    }
                    // 回收资源
                    if (release) {
                        gdk.rm.releaseRes(resId, res, sp.SkeletonData);
                    }
                };
                s.setCompleteListener(complete);
                gdk.DelayCall.addCall(complete, this, timeout / timeScale);
            }
            // 设置坐标
            n.zIndex = zIndex || 0;
            if (!pos) {
                pos = cc.v2(0, 0);
            }
            n.setPosition(pos);
            n.parent = parent;
        };
        if (cc.js.isString(url)) {
            // 参数为资源地址时加载资源
            let res = gdk.rm.getResByUrl(url as string, sp.SkeletonData, resId);
            if (res) {
                loaded(res);
            } else {
                gdk.rm.loadRes(resId, url as string, sp.SkeletonData, loaded);
            }
        } else if (url) {
            // 传入的参数直接为资源实例，则直接回调加载完成函数
            loaded(url as sp.SkeletonData);
        }
    }

    // 设置spine动画shader
    setSpineShader(spine: sp.Skeleton, program?: string, props?: ShaderProperty[]) {
        let c = spine.node.getComponent(ShaderHelper);
        let b = !!program;
        if (!c && b) {
            c = spine.node.addComponent(ShaderHelper);
        }
        if (c) {
            c.enabled = b;
            spine.enableBatch = spine.isAnimationCached() ? !b : b;
            program && (c.program = program);
            props && (c.props = props);
            !b && c._disableShader();
        }
    }

    /**
     * 获取一个代理对象，当对象中无指定属性时返回default值
     * @param base 基础属性
     * @param prop 增加属性
     * @param merge 属性合并函数
     * @param def 默认值
     */
    getProxyObj(
        base: Object,
        prop?: Object,
        merge?: (key: string, val: any, base: any) => any,
        def: number = 0
    ) {
        (merge === void 0) && (merge = this.getMergeProp);
        let cache: Object;
        let proxy = new Proxy(base, {
            get: (base: any, key: string) => {
                if (prop) {
                    if (prop.hasOwnProperty(key)) {
                        // 属性中包含此字段
                        if (!cache) cache = {};
                        if (!cache.hasOwnProperty(key)) {
                            cache[key] = merge(key, prop[key], base);
                        }
                        return cache[key];
                    } else if (base.hasOwnProperty(key)) {
                        // 只在基础属性中包含此字段
                        return base[key];
                    }
                    // 默认值
                    return def;
                }
                return base.hasOwnProperty(key) ? base[key] : def;
            },
            set: (base: any, key: string, value: any) => {
                // prop为动态属性, base为基础属性，不能修改基础属性
                if (!prop) prop = {};
                if (cache) delete cache[key];
                prop[key] = value;
                return true;
            }
        });
        return proxy;
    }

    /**
     * 计算合并后的属性值
     * @param name 属性名
     * @param v 新值
     * @param o 原始对象
     */
    getMergeProp(name: string, v: any, o: any) {
        if (StringUtils.endsWith(name, '_id') ||
            StringUtils.endsWith(name, '_type')) {
            // 属性名为_id或_type结尾，则直接使用新值替换
            return v;
        } else if (cc.js.isNumber(v) &&
            name in o &&
            cc.js.isNumber(o[name])) {
            // 原始属性中包含name属性，并且为数值，并且新值也为数值，则相加
            return v + o[name];
        } else if (StringUtils.startsWith(name, 'on') &&
            typeof v === 'object' &&
            name in o &&
            typeof o[name] === 'object') {
            // 事件值对象，如果有多个事件对象则转换为数组形式
            if (o[name] instanceof Array) {
                return [...o[name], v];
            } else {
                return [o[name], v];
            }
        }
        // 默认使用新值替换
        return v;
    }

    /**
     * spine动画中是否存在指定的事件名
     * @param spine 
     * @param animation 
     * @param event 
     */
    hasSpineEvent(spine: sp.Skeleton | sp.SkeletonData, animation: string, event: string): boolean {
        if (!this.hasSpineAnimation(spine, animation)) return false;
        if (!spine) return false;
        let skeletonData: sp.SkeletonData;
        if (spine instanceof sp.Skeleton) {
            skeletonData = spine['_N$skeletonData'];
        } else {
            skeletonData = spine;
        }
        if (!skeletonData) return false;
        if (!skeletonData['_skeletonJson']) return false;
        let events: any = skeletonData['_skeletonJson'].animations[animation].events;
        let exist: boolean = false;
        if (typeof events === 'object') {
            for (let i = 0, n = events.length; i < n; i++) {
                if (events[i].name == event) {
                    exist = true;
                    break;
                }
            }
        }
        return exist;
    }

    /**
     * spine中是否存在指定动作名的动画
     * @param spine 
     * @param animation 
     */
    hasSpineAnimation(spine: sp.Skeleton | sp.SkeletonData, animation: string): boolean {
        if (!spine) return false;
        let skeletonData: sp.SkeletonData;
        if (spine instanceof sp.Skeleton) {
            skeletonData = spine['_N$skeletonData'];
        } else {
            skeletonData = spine;
        }
        if (!skeletonData) return false;
        if (!skeletonData['_skeletonJson']) return false;
        if (!skeletonData['_skeletonJson'].animations[animation]) return false;
        return true;
    }

    /**
     * 获得spine的所有动作列表
     * @param spine 
     */
    getSpineAnimations(spine: sp.Skeleton | sp.SkeletonData): string[] {
        if (!spine) return;
        let skeletonData: sp.SkeletonData;
        if (spine instanceof sp.Skeleton) {
            skeletonData = spine['_N$skeletonData'];
        } else {
            skeletonData = spine;
        }
        if (!skeletonData) return;
        if (!skeletonData['_skeletonJson']) return;
        return Object.keys(skeletonData['_skeletonJson'].animations);
    }

    /**
     * 对象是否存在召唤物
     * @param sceneModel 
     * @param model 
     * @param call_id 
     */
    hasCalled(sceneModel: PveSceneModel, model: PveFightModel, call_id: number): boolean {
        let n: number = sceneModel.calleds.length;
        let o: number = model.fightId;
        for (let i = 0; i < n; i++) {
            // 查询场景中召唤物的owner是否为model.ctrl
            let m = sceneModel.calleds[i].model;
            if (m.call_id == call_id) {
                if (m.owner_id === o) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取对象的所有召唤物
     * @param sceneModel 
     * @param model 
     */
    getCallList(sceneModel: PveSceneModel, model: PveFightModel): PveCalledCtrl[] {
        let list: PveCalledCtrl[] = []
        let n: number = sceneModel.calleds.length;
        let o: number = model.fightId;
        for (let i = 0; i < n; i++) {
            // 查询场景中召唤物的owner是否为model.ctrl
            let m = sceneModel.calleds[i].model;
            if (m.owner_id === o && m.config.icon != '') {
                list.push(sceneModel.calleds[i])
            }
        }
        return list;
    }

    // /**
    //  * 调整血条位置
    //  * @param hp 
    //  * @param r 
    //  */
    // updateHpBarPos(hp: PveHpBarCtrl, r: cc.Rect) {
    //     if (!r) return;
    //     if (!hp) return;
    //     if (!cc.isValid(hp.node)) return;
    //     if (!hp.node.active) return;
    //     hp.node.y = Math.ceil(r.y + r.height + hp.bg.height + 20);
    // }

    /**
     * 移除场景所有单位
     * @param model
     * @param releaseRes
     */
    removeSceneNodes(ctrl: PveSceneCtrl, releaseRes: boolean = true) {
        let model = ctrl.model;
        // 清除地图
        // let ctrl = model.ctrl;
        // let tmx: cc.TiledMap = ctrl.tiled.getComponent(cc.TiledMap);
        // ctrl.tiled.destroyAllChildren();
        // if (tmx) {
        //     ctrl.tiled.removeComponent(tmx);
        //     tmx.destroy();
        // }
        // let sprite = ctrl.map.getComponent(cc.Sprite);
        // if (sprite) {
        //     sprite.spriteFrame = null;
        // }
        model.fightSelector.clear();
        GlobalUtil.setSpriteIcon(ctrl.node, ctrl.map, null);
        if (ctrl.gameTime) {
            ctrl.gameTime.string = '00/00'
        }
        if (ctrl.royalGameTime) {
            ctrl.royalGameTime.string = '00/00'
        }
        if (ctrl.enemyIndicatro) {
            gdk.NodeTool.hide(ctrl.enemyIndicatro, false);
            gdk.Timer.clearAll(ctrl.enemyIndicatro);
        }
        ctrl.setScrollViewEnabled(false);
        // 移除所有节点
        let props: string[] = [
            'proteges',         // 被保护对象
            'towers',           // 英雄塔座列表
            'heros',            // 英雄列表
            'generals',         // 指挥官列表
            'soldiers',         // 小兵和守卫列表
            'spawns',           // 出生点列表
            'enemies',          // 怪物列表
            'specialEnemies',   // 不计数怪物列表
            'calleds',          // 召唤物列表
            'skills',           // 技能列表
            'traps',            // 陷阱列表
            'gates',            // 传送门列表
        ];
        props.forEach(prop => {
            let arr: any[] = model[prop].concat();
            arr.forEach(ctrl => {
                if (ctrl.hide) {
                    ctrl.hide(false);
                } else {
                    gdk.NodeTool.hide(ctrl.node, false);
                }
            });
        });
        // 清除英雄属性
        cc.js.clear(model.heroMap);
        // // 销毁英雄选择和详情界面
        // let panels = [PanelId.PveSceneHeroDetailPanel, PanelId.PveSceneHeroSelectPanel];
        // panels.forEach(o => {
        //     let prefab: cc.Prefab = gdk.rm.getResByUrl(o.prefab, cc.Prefab);
        //     if (prefab) {
        //         gdk.pool.clear(prefab.name);
        //     }
        // });
        // 移除所有子节点
        ctrl.map.destroyAllChildren();
        ctrl.floor.destroyAllChildren();
        ctrl.thing.destroyAllChildren();
        ctrl.effect.destroyAllChildren();
        ctrl.hurt.destroyAllChildren();
        ctrl.buffTip.destroyAllChildren();
        // 回收资源（非依赖资源，英雄、小兵、怪物、技能特效等）
        if (releaseRes) {
            let resId = ctrl.resId;
            if (resId != 0) {
                gdk.rm.releaseResByPanel(resId);
                gdk.rm.loadResByPanel(resId);
            }
        }
        // 隐藏固定BOSS血条
        gdk.panel.hide(PanelId.PveBossHpBar);
    }

    /**
     * 获取偏移坐标
     * @param p 
     * @param r 
     */
    getCenterPos(p: cc.Vec2, r: cc.Rect) {
        if (!p) {
            p = cc.Vec2.ZERO;
        }
        if (!r) {
            return p.clone();
        }
        return cc.v2(Math.ceil(p.x), Math.ceil(p.y + (r.height + r.y) / 2));
    }

    /**
     * 预加载战斗对象资源
     * @param skin 
     * @param skills 
     * @param rdic 
     */
    preloadFightRes(
        resId: string,
        skin: string,
        skills: SkillIdLv[],
        rdic: { [key: string]: boolean } = {},
    ) {
        // 模型spine
        let k = skin;
        let t: new () => {};
        if (!rdic[k] && cc.js.isString(k) && k.length) {
            rdic[k] = true;
            t = sp.SkeletonData;
            gdk.rm.addResInBackground([k], t, resId);
            // gdk.rm.loadRes(resId, k, t);
        }
        // 技能相关资源
        for (let i = 0, n = skills ? skills.length : 0; i < n; i++) {
            let item = skills[i];
            let skill = ConfigManager.getItemByField(SkillCfg, 'skill_id', item.skillId, { level: item.skillLv });
            if (!skill) continue;
            if (!PveSkillType.isExt(skill.type)) {
                // 技能spine
                k = skill.effect_res;
                if (cc.js.isString(k) && k.length) {
                    k = StringUtils.format(PveRes.PVE_SKILL_RES, k);
                    if (!rdic[k]) {
                        rdic[k] = true;
                        t = sp.SkeletonData;
                        gdk.rm.addResInBackground([k], t, resId);
                        // gdk.rm.loadRes(resId, k, t);
                    }
                }
                // 音效资源
                if (GlobalUtil.isSoundOn) {
                    t = cc.AudioClip;
                    [
                        skill.atk_sound,
                        skill.hit_sound,
                        skill.dmg_sound,
                    ].forEach(k => {
                        if (cc.js.isString(k) && k.length) {
                            k = `${gdk.sound.prefix}${k}`;
                            if (!rdic[k]) {
                                rdic[k] = true;
                                gdk.rm.addResInBackground([k], t, resId);
                                // gdk.rm.loadRes(resId, k, t);
                            }
                        }
                    });
                }
                // 加载拖尾贴图
                let et = ConfigManager.getItemById(Skill_effect_typeCfg, skill.effect_type);
                let args = et ? et.motion_streak_args : null;
                if (args && typeof args === 'object') {
                    k = args[0];
                    if (!rdic[k] && cc.js.isString(k) && k.length) {
                        rdic[k] = true;
                        t = cc.Texture2D;
                        if (!gdk.rm.getResByUrl(k, t)) {
                            gdk.rm.addResInBackground([k], t, resId);
                            // gdk.rm.loadRes(resId, k, t);
                        }
                    }
                }
            }
            // BUFF资源
            if (skill.buff_id) {
                let buffs: number[] = cc.js.isNumber(skill.buff_id) ? [skill.buff_id] : skill.buff_id;
                buffs.forEach(buff_id => {
                    k = ConfigManager.getItemById(Skill_buffCfg, buff_id).skin;
                    if (cc.js.isString(k) && k.length) {
                        k = StringUtils.format(PveRes.PVE_BUFF_RES, k);
                        if (!rdic[k]) {
                            rdic[k] = true;
                            t = sp.SkeletonData;
                            gdk.rm.addResInBackground([k], t, resId);
                            // gdk.rm.loadRes(resId, k, t);
                        }
                    }
                });
            }
            // 光环资源
            if (skill.halo_id) {
                let haloCfg = ConfigManager.getItemById(Skill_haloCfg, skill.halo_id);
                if (haloCfg) {
                    k = haloCfg.skin;
                    if (cc.js.isString(k) && k.length) {
                        k = StringUtils.format(PveRes.PVE_BUFF_RES, k);
                        if (!rdic[k]) {
                            rdic[k] = true;
                            t = sp.SkeletonData;
                            gdk.rm.addResInBackground([k], t, resId);
                            // gdk.rm.loadRes(resId, k, t);
                        }
                    }
                } else {
                    CC_DEBUG && cc.error(`找不到光环配置, skill_id: ${skill.id}, halo_id: ${skill.halo_id}`);
                }
            }
        }
    }

    // 更新FSM组件中的updateScript循环
    execFsmUpdateScript(fsm: gdk.fsm.Fsm, dt: number) {
        let state = fsm['_activeState'];
        if (state) {
            let actions = state._activeActions;
            if (actions) {
                let n = actions.length;
                for (let i = 0; i < n; i++) {
                    let a = actions[i];
                    if (a && a.active && a['updateScript']) {
                        a['updateScript'](dt);
                    }
                }
            }
        }
    }

    /**
     * 通过配置的skin字段获得完整的skin地址
     * @param skin 
     */
    getSkinUrl(skin: string) {
        let res: string;
        if (StringUtils.startsWith(skin, 'M_')) {
            // 怪物
            res = PveRes.PVE_MONSTER_RES;
        } else if (StringUtils.startsWith(skin, 'H_')) {
            // 英雄
            res = PveRes.PVE_HERO_RES;
        } else if (StringUtils.startsWith(skin, 'S_')) {
            // 小兵
            res = PveRes.PVE_SOLDIER_RES;
        } else {
            // 其他
            res = PveRes.PVE_SKILL_RES;
        }
        return StringUtils.format(res, skin);
    }

    /**
     * 取得call_id与lv对应的配置项
     * @param call_id 
     * @param lv 
     */
    getSkillCallConfig(call_id: number, lv: number) {
        let a = ConfigManager.getItemsByField(Skill_callCfg, 'call_id', call_id);
        for (let i = a.length - 1; i >= 0; i--) {
            let c = a[i];
            if (c.caller_lv <= lv) {
                return c;
            }
        }
        return null;
    }

    /**
     * 获取指定ID和LV的技能配置
     * @param id 
     * @param lv 
     */
    getSkillCfg(id: number, lv: number) {
        let config: SkillCfg;
        let a = ConfigManager.getItemsByField(SkillCfg, 'skill_id', id);
        for (let i = a.length - 1; i >= 0; i--) {
            let c = a[i];
            if (c.level <= lv) {
                config = c;
                break;
            }
        }
        // let config = ConfigManager.getItemByField(SkillCfg, 'skill_id', id, { level: lv });
        if (!config) {
            CC_DEBUG && cc.error(`找不到技能 (id: ${id}, lv: ${lv}) 的配置`);
            return;
        }
        // 默认cd
        if (cc.js.isString(config.cd)) {
            config.cd = 0;
            config['init_cd'] = 0;
        } else if (!('init_cd' in config)) {
            // 防止重复初始化
            if (config.cd instanceof Array) {
                config['init_cd'] = config.cd[0];
                config.cd = config.cd[1];
            } else {
                config['init_cd'] = 0;
            }
        }
        // 默认cd_type值为skill_id
        if (cc.js.isString(config.cd_type)) {
            config.cd_type = config.skill_id;
        }
        // 默认dmg_range
        if (cc.js.isString(config.dmg_range)) {
            config.dmg_range = 0;
        }
        // 默认target_num
        if (cc.js.isString(config.target_num)) {
            config.target_num = 1;
        }
        // 默认dmg_mul
        if (cc.js.isString(config.dmg_mul)) {
            config.dmg_mul = 1;
        }
        // 默认pre_cd
        if (cc.js.isString(config.pre_cd)) {
            config.pre_cd = 0;
        }
        return config;
    }

    /**
     * 延迟分帧调用循环函数
     */
    private _callLaterQueue: {
        caller: any,
        method: Function,
        args: any[],
    }[] = [];
    private _callLaterLoop() {
        let arr = this._callLaterQueue;
        if (arr.length == 0) {
            gdk.Timer.clear(this, this._callLaterLoop);
            return;
        }
        let start = Date.now();
        let index = 0;
        let lasting = 0;
        while (index < arr.length) {
            const e = arr[index];
            arr[index] = null;
            if (e) {
                if (e.args) {
                    e.method.apply(e.caller, e.args);
                } else {
                    e.method.call(e.caller);
                }
            }
            // 达到执行数量上限
            index++;
            if (index > 10) {
                break;
            }
            // 达到执行时间上限
            lasting = Date.now() - start;
            if (lasting > 10) {
                break;
            }
        }
        // 清除已经执行的对象
        if (index >= arr.length) {
            arr.length = 0;
        } else {
            arr.splice(0, index);
        }
    }

    /**
     * 优化的callLater函数，自动分散到不同的帧执行，针对对执行时机不敏感的回调使用
     * @param caller 
     * @param method 
     * @param args 
     */
    callLater(caller: any, method: Function, args?: any[]) {
        const a = this._callLaterQueue;
        for (let i = a.length - 1; i >= 0; i--) {
            const e = a[i];
            if (e && e.caller === caller && e.method === method) {
                // 已经存在相同的回调项，则更新参数后直接返回
                e.args = args;
                return;
            }
        }
        a.push({
            caller: caller,
            method: method,
            args: args,
        });
        if (a.length === 1) {
            gdk.Timer.frameLoop(1, this, this._callLaterLoop);
        }
    }

    /**
     * 获得技能使用的坐标
     * @param m 
     * @param type 
     * @param index 
     * @param dt 
     */
    getPveSkillPosBy(m: PveSkillModel, type: PveTargetType, index: number, dt: number = 0) {
        let p: cc.Vec2;
        switch (type) {
            case PveTargetType.AttackerStand:
            case PveTargetType.AttackerCenter:
                p = m.attacker.getPos();
                if (type == PveTargetType.AttackerCenter) {
                    p = this.getCenterPos(p, m.attacker.getRect());
                }
                break;
            case PveTargetType.AttackerStartPos:
                p = (m.attacker.model as PveBaseFightModel).startPos;
                break;
            case PveTargetType.TargetStand:
            case PveTargetType.TargetCenter:
                let t = m.ctrl.sceneModel.getFightBy(m.selectedTargets[index] || m.selectedTargets[0]);
                if (!t || !t.isAlive) {
                    p = m.targetPos;
                    if (type == PveTargetType.TargetCenter) {
                        p = this.getCenterPos(p, m.targetRect);
                    }
                } else {
                    p = m.targetPos = t.getPos(dt).clone();
                    if (type == PveTargetType.TargetCenter) {
                        p = this.getCenterPos(p, t.getRect());
                    }
                }
                break;

            case PveTargetType.TargetStartPos:
                let t1 = m.ctrl.sceneModel.getFightBy(m.selectedTargets[index] || m.selectedTargets[0]);
                if (!t1 || !t1.isAlive) {
                    p = m.targetPos;
                } else {
                    p = m.targetPos = (t1.model as PveBaseFightModel).startPos;
                }
                break;
            case PveTargetType.FixedPos:
                p = cc.v2(360, 98)
                break
            case PveTargetType.PvpFixedPos:
                if (m.ctrl.sceneModel.isMirror) {
                    // 镜像战斗的坐标
                    p = cc.v2(180, 860);
                } else {
                    // 主战斗的坐标
                    p = cc.v2(540, 430);
                }
                break;
            case PveTargetType.PvpOpponentBorn:
                let sm = m.ctrl.sceneModel;
                if (sm.isMirror) {
                    // 镜像战斗的坐标
                    p = sm.arenaSyncData.mainModel.spawns[0].node.getPos();
                    p = cc.v2(p.x, p.y - 100);
                } else {
                    // 主战斗的坐标
                    p = sm.arenaSyncData.mirrorModel.spawns[0].node.getPos();
                    p = cc.v2(p.x, p.y + 100);
                }
                break;
            case PveTargetType.PvpSelfBorn:
                let sm1 = m.ctrl.sceneModel;
                if (sm1.isMirror) {
                    // 镜像战斗的坐标
                    p = sm1.arenaSyncData.mirrorModel.spawns[0].node.getPos();
                    p = cc.v2(p.x, p.y + 100);
                } else {
                    // 主战斗的坐标
                    p = sm1.arenaSyncData.mainModel.spawns[0].node.getPos();
                    p = cc.v2(p.x, p.y - 100);
                }
                break;
            case PveTargetType.weaponLeftPos:
                p = cc.v2(0, 640);
                break
            case PveTargetType.weaponRightPos:
                p = cc.v2(800, 640);
                break
            case PveTargetType.sceneCenterPos:
                //屏幕中心点
                let n = m.ctrl.sceneModel.ctrl.content;
                p = cc.v2(n.width / 2, n.height / 2);
                break
            case PveTargetType.TargetFirstPos:
                if (!m.targetFirstPos) {
                    let t = m.ctrl.sceneModel.getFightBy(m.selectedTargets[index] || m.selectedTargets[0]);
                    m.targetFirstPos = t.getPos(dt).clone();
                }
                p = m.targetFirstPos;
                break;

            case PveTargetType.TargetNearstRoadPos:
                //离目标最近的路线上的坐标点
                p = m.targetPos;
                if (p && m.ctrl) {
                    let minPos = p;
                    let dis = Number.MAX_VALUE;
                    let roads = m.ctrl.sceneModel.tiled.roads;
                    for (let key in roads) {
                        let r = roads[key];
                        for (let i = 0, n = r.length; i < n; i++) {
                            let t = MathUtil.distance(p, r[i])
                            if (dis > t) {
                                dis = t;
                                minPos = r[i];
                            }
                        }
                    }
                    p = cc.v2(minPos.x, minPos.y);
                }
                break;

            default:
                if (!m.effectType.store_pos && m.targetRect) {
                    p = this.getCenterPos(m.targetPos, m.targetRect);
                } else {
                    p = m.targetPos;
                }
                break;
        }
        return p;
    }

    /**
     * 获取model对应副本的最大上阵英雄数量
     * @param model 
     */
    getMaxHeroNum(model: PveSceneModel) {
        let num = model.towers.length;

        // 赏金模式
        if (model.isBounty) {
            return model.bountyMission.heroList.length;
        }

        // 生存训练困难模式
        if (model.stageConfig.copy_id == CopyType.Survival && model.stageConfig.subtype == 1) {
            return model.eliteStageUtil.maxUpHeroNum;
        }

        if (model.stageConfig.copy_id == CopyType.Ultimate) {
            let tems = ConfigManager.getItems(Copy_towerlistCfg)
            return tems[tems.length - 1].num
        }

        // 精英副本判断是否达到最大上阵数量 
        if (model.eliteStageUtil.maxUpHeroNum > 0) {
            num = Math.min(num, model.eliteStageUtil.maxUpHeroNum);
        }
        // 配置中限制的通过哪个主线开启几个英雄位置
        let copyModel = ModelManager.get(CopyModel);
        let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
            if (item.general_lv <= copyModel.lastCompleteStageId) {
                return true;
            }
            return false;
        });
        let copyCfg = tems[tems.length - 1];
        // 返回各数量限制中的最小值
        return Math.min(num, copyCfg ? copyCfg.num : 1);
    }

    /**
     * 游戏结束
     * @param model 
     */
    gameOver(model: PveSceneModel, isWin: boolean) {
        // 镜像战斗胜，则主战斗失败
        if (model.isMirror) {
            let m = model.arenaSyncData.mainModel;
            if (m.state == PveSceneState.Fight) {
                // 状态不对则不重复执行
                m.state = PveSceneState.Exiting;
                gdk.Timer.callLater(this, () => {
                    m.ctrl.fsm.sendEvent(isWin ? PveFsmEventId.PVE_SCENE_OVER : PveFsmEventId.PVE_SCENE_WIN);
                });
            }
        } else if (model.state == PveSceneState.Fight) {
            // 游戏结束
            model.state = PveSceneState.Exiting;
            gdk.Timer.callLater(this, () => {
                model.ctrl.fsm.sendEvent(isWin ? PveFsmEventId.PVE_SCENE_WIN : PveFsmEventId.PVE_SCENE_OVER);
            });
        }
        // 竞技模式，则暂停镜像战斗
        if (model.arenaSyncData) {
            model.arenaSyncData.mirrorModel.state = PveSceneState.Pause;
        }
    }
}

export default gdk.Tool.getSingleton(PveTool);