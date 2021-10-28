import {
    MonsterCfg,
    Pve_demo2Cfg, SkillCfg, Skill_buffCfg,
    Skill_target_typeCfg
} from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import FightingMath from '../../../common/utils/FightingMath';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import MathUtil from '../../../common/utils/MathUtil';
import StringUtils from '../../../common/utils/StringUtils';
import { PveCalledAIType } from '../const/PveCalled';
import { PveEnemyDir } from '../const/PveDir';
import { PveSkillType } from '../const/PveSkill';
import { PveFightCtrl } from '../core/PveFightCtrl';
import PveFightModel, { PveFightType } from '../core/PveFightModel';
import { PveHurtType } from '../ctrl/base/PveHurtEffect';
import PveBaseBuffCtrl from '../ctrl/buff/PveBaseBuffCtrl';
import PveCalledCtrl from '../ctrl/fight/PveCalledCtrl';
import PveEnemyCtrl from '../ctrl/fight/PveEnemyCtrl';
import PveHeroCtrl from '../ctrl/fight/PveHeroCtrl';
import PveSoldierCtrl from '../ctrl/fight/PveSoldierCtrl';
import PveTrapCtrl from '../ctrl/fight/PveTrapCtrl';
import PveBaseHaloCtrl from '../ctrl/halo/PveBaseHaloCtrl';
import PveEventId from '../enum/PveEventId';
import PveFsmEventId from '../enum/PveFsmEventId';
import PveBuffModel, { PveBuffArgs } from '../model/PveBuffModel';
import PveCalledModel from '../model/PveCalledModel';
import PveEnemyModel from '../model/PveEnemyModel';
import PveHaloModel from '../model/PveHaloModel';
import PveHeroModel from '../model/PveHeroModel';
import PveSceneModel from '../model/PveSceneModel';
import PveSkillModel from '../model/PveSkillModel';
import PveSoldierModel from '../model/PveSoldierModel';
import { PveFightAnmNames } from './../const/PveAnimationNames';
import PveFightUtil from './PveFightUtil';
import PvePool from './PvePool';
import PveRoadUtil from './PveRoadUtil';
import PveTool from './PveTool';

/**
 * Pve技能和BUFF表达式通用工具类（不包含强化技能）
 * @Author: sthoo.huang
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-02 11:14:36
 * @Last Modified time: 2021-09-09 19:38:01
 */
export interface PveBSScopeType {
    // 通用
    hp?: number;    // 伤害血量
    a?: any;    // 施法者属性
    t?: any;    // 目标属性
    am?: PveFightModel; // 施法者运行时数据模型
    tm?: PveFightModel; // 目标运行时数据模型
    m?: PveFightModel;  // 与tm相等，为了兼容旧配置

    // 针对BUFF
    b?: Skill_buffCfg;  // BUFF静态配置
    bm?: PveBuffModel;  // BUFF运行时数据模型
    stacking?: number;  // 叠加数，只读

    // 针对技能
    s?: SkillCfg;   // 技能属性，如果有强化则为强化后的属性
    sm?: PveSkillModel; // 技能运行时数据模型
    hs?: SkillCfg;   // 英雄普攻技能属性，如果有强化则为强化后的属性

    // 针对强化技能
    e?: SkillCfg,   // 强化技能静态配置

    // 事件
    onbegin?: PveBSEventArgs;   // BUFF开始时
    onend?: PveBSEventArgs;     // BUFF结束时
    onadd?: PveBSEventArgs;     // 添加BUFF时
    oncall?: PveBSEventArgs;    // 召唤宠物事件，只对英雄有效
    onrelive?: PveBSEventArgs;  // 死亡复活事件，只对英雄有效
    onkill?: PveBSEventArgs;    // BUFF或技能杀死目标时
    onhurt?: PveBSEventArgs;    // BUFF或技能目标受到伤害时
    onatk?: PveBSEventArgs;     // 施法者发起攻击时（使用技能）
    ondead?: PveBSEventArgs;    // BUFF拥有者死亡时
    onselect?: PveBSEventArgs;  // 锁定敌人开始攻击前
    onchange?: PveBSEventArgs;  // 切换敌人时触发
    ondodge?: PveBSEventArgs;   // 闪避攻击时
    onrestore?: PveBSEventArgs; // 回血事件
    onDieAnim?: PveBSEventArgs; // 死亡动作结束时触发
    onbuffAtk?: PveBSEventArgs; // buff伤害触发(buff拥有者)
    // 临时记录用的变量
    _target_map?: { [fightId: number]: boolean }; // 执行过set_target_hurt的目标
}

export interface PveBSEventArgs {
    buff?: {    // 添加BUFF
        id: number | number[],  // buff表中定义的ID
        time: number,   // BUFF持续时间
        target: 0 | 1, // 目标，0:目标，1:施法者
        rate?: number;  // 产生这个BUFF的概率，undefine则100%添加
        args?: PveBuffArgs  // BUFF扩展参数
    },
    trap?: {    // 召唤陷阱
        id: number,     // trap表中定义的ID
        time: number,   // 陷阱持续时间
        rate?: number,  // 产生这个陷阱的概率，undefine则为100%添加
    },
    skill?: {   // 技能
        id: number, // skill表中定义的ID
        lv: number, // 技能等级
        target: 0 | 1 | 2,    // 目标，0:目标，1：施法者，2：由技能配置决定 
        rate?: number,  // 使用这个技能的概率，undefine则为100%使用成功
    },
    summon?: {  // 召唤召唤物
        id?: number, // monster表定义的ID，如果不填则默认为目标id
        num: number,    // 数量
        time: number,   // 时间
        target: 0 | 1 | 2,    // 目标，0:目标，1：施法者
        rate?: number,  // 召唤这个召唤物的概率，undefine则为100%召唤成功
    },
    monster?: { // 召唤怪物
        id?: number,  // monster表定义的ID，如果不填则默认为目标id
        num: number, // 数量
        target: 0 | 1 | 2,    // 目标，0:目标，1：施法者，对应的目标必需为怪物
        time?: number,   // 时间
        rate?: number,  // 召唤这个召唤物的概率，undefine则为100%召唤成功
    }
    expr?: string,  // 计算表达式

    deletebuff?: { //删除buff
        buff_id?: number,
        type?: number,  //根据类型删除buff
        dmg_type?: number, //伤害类型删除buff
    }
}

export default class PveBSExprUtils {

    constructor() {
        // 当前方法绑定this
        let thiz = this;
        for (let name in thiz) {
            let prop = thiz[name];
            if (typeof prop === 'function') {
                thiz[name] = prop.bind(thiz);
            }
        }
    }

    attacker: PveFightCtrl;  // 施法者
    target: PveFightCtrl; // 目标
    scope: PveBSScopeType; // 环境变量

    get sceneModel(): PveSceneModel {
        if (this.attacker) {
            return this.attacker.sceneModel;
        } else if (this.target) {
            return this.target.sceneModel;
        }
        return null;
    }

    /**
     * 获得场景中指定目标类型的数量
     * @param target_type 
     */
    get_target_num(target_type: number): number {
        let m = this.sceneModel;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
        let a = m.fightSelector.getAllFights(this.target, c, m);
        return a ? a.length : 0;
    }

    /**
     * 获取场景中指定目标类型的Ctrl
     * @param target_type 
     */
    get_target_type(target_type: number, target: number = 0, pos?: cc.Vec2, range?: number): PveFightCtrl[] {
        let m = this.sceneModel;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
        let temCtrl = target == 0 ? this.target : this.attacker
        let temPos = pos == null ? temCtrl.getPos() : pos;
        let temRange = range == null ? 1500 : range;
        let a = m.fightSelector.getAllFights(temCtrl, c, m, null, temPos, temRange);
        return a;
    }
    /**
     * 获取场景中指定数量的指定目标类型的Ctrl
     * @param target_type 
     */
    get_target_type_num(target_type: number, target: number = 0, num: number, pos?: cc.Vec2, range?: number): PveFightCtrl[] {
        let m = this.sceneModel;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
        let temCtrl = target == 0 ? this.target : this.attacker
        let temPos = pos == null ? temCtrl.getPos() : pos;
        let temRange = range == null ? 1500 : range;
        let a = m.fightSelector.getAllFights(temCtrl, c, m, null, temPos, temRange);
        a = m.fightSelector.circleSelect(a, temPos, c.priority_type, 1500, num, true);
        if (a.length > num) {
            a.length = num;
        }
        return a;
    }
    /**
     * 获取场景中指定目标类型的Ctrl
     * @param target_type 
     */
    get_target_type_fightId(target_type: number, targetId: number = 0, pos?: cc.Vec2, range?: number, num?: number): PveFightCtrl[] {
        let m = this.sceneModel;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
        //let temCtrl = target == 0 ? this.target : this.attacker
        let temCtrl = m.getFightBy(targetId);
        if (!temCtrl) return [];
        let temPos = pos == null ? temCtrl.getPos() : pos;
        let temRange = range == null ? 1500 : range;
        let a = m.fightSelector.getAllFights(temCtrl, c, m, null, temPos, temRange);
        if (num && a.length > num) {
            a.length = num;
        }
        return a;
    }

    /**
     * 获取竞技场对面位置英雄范围内指定目标类型的Ctrl
     * @param target_type 
     */
    get_opponent_call_target(target: number, num: number, pos?: cc.Vec2, range?: number): PveFightCtrl[] {
        let a = [];
        let m = this.sceneModel;
        let searchId = target;
        let temCtrl = m.getFightBy(target);
        if (!temCtrl || !temCtrl.model) return [];
        if (temCtrl.model.type != PveFightType.Call) {
            return a;
        }
        let callModel = temCtrl.model as PveCalledModel;
        if (callModel.owner) {
            let towerId = (callModel.owner as PveHeroCtrl).tower.id;
            if (m.towers[towerId - 1].hero) {
                a.push(m.towers[towerId - 1].hero)
                searchId = m.towers[towerId - 1].hero.model.fightId;
            }
        } else {
            let temOwer = m.arenaSyncData.mainModel.getFightBy(callModel.owner_id);
            if (temOwer) {
                let towerId = (temOwer as PveHeroCtrl).tower.id;
                if (m.towers[towerId - 1].hero) {
                    if (m.towers[towerId - 1].hero.isAlive) {
                        a.push(m.towers[towerId - 1].hero)
                    }
                    searchId = m.towers[towerId - 1].hero.model.fightId;
                }
            }
        }
        if (a.length < num) {
            let tem = this.get_target_type_fightId(69, searchId)
            if (tem.length > num - a.length) {
                tem.length = num - a.length;
            }
            a = a.concat(tem);
        }
        return a;
    }

    /**
     * 获取技能指定目标类型的坐标
     * @param model 
     * @param target_type 
     * @returns 
     */
    get_skill_pos_by(model: PveSkillModel, target_type: number) {
        return PveTool.getPveSkillPosBy(model, target_type, 0);
    }

    /**
     * 获得场景中指定目标类型目标中buff_id的数量
     * @param target_type 
     * @param buff_id 
     */
    get_buff_num(target_type: number, buff_id: number): number {
        let m = this.sceneModel;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
        let a = m.fightSelector.getAllFights(this.is_skill() ? this.attacker : this.target, c, m);
        let n = 0;
        a && a.forEach(f => {
            f.model.buffs.some(b => {
                if (b.id == buff_id) {
                    n++;
                    return true;
                }
                return false;
            });
        });
        return n;
    }

    //获取场景中有指定buff的所有战斗单位
    get_buff_allTarget(buff_id: number): PveFightCtrl[] {
        let m = this.sceneModel;
        let all = m.getAllFight();
        let res: PveFightCtrl[] = []
        for (const key in all) {
            all[key].model.buffs.some(b => {
                if (b.id == buff_id) {
                    res.push(all[key]);
                    return true;
                }
                return false;
            });
        }
        return res;
    }

    //获取场景中有指定层数buff的战斗单位
    get_buffStack_target(buff_id: number, stack: number): PveFightCtrl {
        let res: PveFightCtrl = null;
        let m = this.sceneModel;
        let all = m.getAllFight();
        for (const key in all) {
            all[key].model.buffs.some(b => {
                if (b.id == buff_id && b.stacking == stack) {
                    res = all[key];
                    return true;
                }
                return false;
            });
            if (res) {
                return res;
            }
        }
        return null;
    }


    //记录击杀的怪物类型,并且返回类型数量
    saveKillMonsterIds(attack_id: number, monster_id: number): number {
        let res = 0;
        let m = this.sceneModel;
        let target = m.getFightBy(attack_id);
        if (target.model.type != PveFightType.Hero) {
            return res;
        }
        let hero = target as PveHeroCtrl;
        if (hero.killMonsterIds.indexOf(monster_id) < 0) {
            hero.killMonsterIds.push(monster_id);
        }
        res = hero.killMonsterIds.length
        return res;
    }

    /**
     * 删除指定目标的指定buff层数
     * @param targets 
     * @param buffId 
     * @param type 
     */
    remove_targets_buff_id(targets: PveFightCtrl[], buffId: number, num: number) {
        if (!targets || targets.length == 0) {
            return
        }
        //let m = this.sceneModel;
        targets.forEach(target => {
            if (target && target.isAlive) {
                let buf: PveBaseBuffCtrl = target.buff;
                if (buf && buf.enabled) {
                    buf.removeBuffStacking(buffId, num)
                }
            }
        })
        //let target = m.getFightBy(targetId);
    }
    /**
     * 删除单个目标指定buff层数
     * @param targetId 
     * @param buffId 
     * @param num 
     */
    remove_target_buff_Stack(targetId: number, buffId: number, num: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(targetId);
        if (target && target.isAlive) {
            let buf: PveBaseBuffCtrl = target.buff;
            if (buf && buf.enabled) {
                buf.removeBuffStacking(buffId, num)
            }
        }
    }

    /**
     * 创建怪物（在目标位置，继承目标路径）
     * @param id monster表定义的ID
     * @param num 数量
     * @param target 目标，0:目标，1：施法者
     * @param time 怪物存在时间
     * @param rate 
     */
    add_monster_by(id: number, num: number, target: 0 | 1 | 2, time?: number, rate?: number, radius?: number) {
        let b: boolean = true;
        if (cc.js.isNumber(rate) && rate < 1) {
            b = FightingMath.rate(rate);
        }
        if (b) {
            let t = target == 0 ? this.target : this.attacker;
            let p = target == 2 ? this.target.getPos() : t.getPos();
            PveFightUtil.createEnemyBy(
                t,
                num,
                id,
                p,
                null,
                null,
                null,
                time,
                null,
                radius,
            );
        }
    }

    /**
     * 设置怪物血量(怪物的基础id)
     * @param id 
     * @param buffid 
     * @param hp 
     */
    set_monster_hp(id: number, buffid: number, hp: number) {
        let enemys = this.get_AllTargetBy_baseId(id);
        if (enemys.length > 0) {
            for (let i = 0; i < enemys.length; i++) {
                let enemy = enemys[i];
                if (!enemy.isAlive) continue;
                let have = false;
                if (buffid > 0) {
                    enemy.model.buffs.some(b => {
                        if (b.id == buffid) {
                            have = true;
                            return
                        }
                    });
                }
                if (!have) {
                    if (buffid > 0) {
                        this.add_buff_by(enemy, enemy, buffid, 999);
                    }
                    enemy.model.hp = hp;
                }
            }
        }
    }

    /**
     * 设置目标的血量（仅限怪物）
     * @param targetId 
     * @param hp 
     */
    set_target_MonsterHp(targetId: number, hp: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(targetId);
        if (target && target.isAlive) {
            if (target.model.type != PveFightType.Enemy) {
                return
            }
            target.model.hp = target.model.hpMax * hp;
        }
    }

    /**
     * 设置目标的血量（仅限怪物）
     * @param targetId 
     * @param hp 
     */
    set_target_MonsterOwnerHp(targetId: number, hp: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(targetId);
        if (target && target.isAlive) {
            if (target.model.type != PveFightType.Enemy) {
                return
            }
            target.model.hp = hp;
        }
    }



    /**
     * 获取所有目标中特定属性的最大(最小)值
     * @param targets 
     * @param propName 
     * @param minOrMax 1:最大值 0：最小值
     */
    get_targets_minOrMax_Prop(targets: PveFightCtrl[], propName: string, minOrMax: number): number {
        let res = -1;
        targets.forEach(ctrl => {
            let tem = ctrl.model.getProp(propName)
            if (minOrMax == 1) {

                if (tem > res) {
                    res = tem;
                }
            } else {
                if (res == -1 || tem < res) {
                    res = tem;
                }
            }
        })
        return res;
    }

    //设置怪物属性
    set_target_MonsterConfig(targetId: number, con: string | string[], value: number | object) {
        let m = this.sceneModel;
        let target = m.getFightBy(targetId);
        if (target && target.isAlive) {
            let temModel: PveEnemyModel | PveCalledModel = target.model as PveEnemyModel | PveCalledModel;
            if (temModel.type != PveFightType.Enemy && temModel.type != PveFightType.Call) {
                return;
            }
            // 生成属性列表
            let names: string[];
            let prop: any = value;
            if (con instanceof Array) {
                names = con;
            } else if (cc.js.isString(con)) {
                names = [con as string];
            }
            let len = names.length;
            // 所有属性都设置为同一个值
            if (cc.js.isNumber(value)) {
                prop = {};
                for (let i = 0; i < len; i++) {
                    prop[names[i]] = value;
                }
            }
            // 生成临时属性
            let temConfig = {};
            let change = null;
            for (let i = 0; i < len; i++) {
                let name = names[i];
                let val = prop[name];
                temConfig[name] = val;
                if (name == 'hp') {
                    change = temModel.config.hp != val ? val : change;
                }
            }
            // 设置属性到目标
            temModel.setConfig(temConfig);
            if (change !== null) {
                temModel.hpMax = change;
                temModel.hp = change;
            }
        }
    }

    /**
     * 设置一类怪物的基础属性
     * @param targets 
     * @param con 
     * @param value 
     */
    set_allTarget_MonsterConfig(targets: PveFightCtrl[], con: string | string[], value: number | object) {
        if (targets.length == 0) return;
        targets.forEach(target => {
            if (target && target.isAlive) {
                if (target.model.type != PveFightType.Enemy) {
                    return;
                }
                this.set_target_MonsterConfig(target.model.fightId, con, value);
            }
        });
    }

    /**
     * 获取buff_dmgtype类型的buff的num数量
     * @param target_id     //目标ID
     * @param buff_type     //buff dmgType类型
     */
    get_buffDmgType_num(target_id: number, buff_type: number): number {
        let number = 0
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        if (target && target.isAlive) {
            target.model.buffs.forEach(b => {
                if (b.config.dmg_type == buff_type) {
                    number++;
                }
            });
        }
        return number;
    }

    /**
     * 获取buff type类型的buff数量
     * @param target_id     //目标ID
     * @param buff_type     //buff type类型
     */
    get_buffType_num(target_id: number, buff_type: number): number {
        let number = 0
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        if (target && target.isAlive) {
            target.model.buffs.forEach(b => {
                if (b.config.type == buff_type) {
                    number++;
                }
            });
        }
        return number;
    }

    /**
     * 获得自己指定buff_id的BUFF
     * @param buff_id 
     */
    get_buff_by(buff_id: number, target: number = 0): PveBuffModel {
        let r: PveBuffModel = null;
        let tem = target == 0 ? this.target : this.attacker;
        if (tem) {
            tem.model.buffs.some(b => {
                if (b.id == buff_id) {
                    r = b;
                    return r;
                }
            });
        }
        return r;
    }


    /**
     * 重置目标身上某类型buff的时间
     * @param target_id 目标fightId
     * @param buff_type buff类型
     */
    reset_target_buffType_time(target_id: number, buff_type: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        if (target && target.isAlive) {
            target.model.buffs.forEach(b => {
                if (b.config.type == buff_type) {
                    b.remain = b.max_remain;
                    b.times = b.max_times;
                }
            });
        }
    }

    /**
     * 判断目标身上是否有检测的buff
     * @param buff_id buffId
     * @param target 0检测拥有者 1检测施法者
     */
    get_target_haveBuff(buff_id: number | string, target: number = 0): boolean {

        if (cc.js.isNumber(buff_id)) {
            if (this.get_buff_by(Number(buff_id), target) != null) {
                return true;
            }
        } else {
            let Str: string[] = buff_id.toString().split(',');
            if (Str.length > 0) {
                for (let i = 0; i < Str.length; i++) {
                    let id = Number(Str[i]);
                    if (this.get_buff_by(id, target) != null) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 检测怪物是否是特定的类型
     * @param targetId 
     * @param monsterType 
     * @param orand 
     */
    get_monster_type(targetId: number, monsterType: number | string): boolean {
        let istype = false;
        let m = this.sceneModel;
        let target = m.getFightBy(targetId);
        if (target && target.isAlive) {
            if (target.model.type != PveFightType.Enemy) {
                return istype;
            }
            let monsterCfg: MonsterCfg = target.model.config as MonsterCfg;
            if (cc.js.isNumber(monsterType)) {
                let type: any = monsterCfg.type;
                if (cc.js.isString(type)) {
                    istype = false;
                } else if (type instanceof Array) {
                    type.some(typeId => {
                        if (typeId == monsterType) {
                            istype = true;
                        }
                    });
                }

            } else {
                let Str: string[] = monsterType.toString().split(',');
                Str.forEach(srcType => {
                    let type: any = monsterCfg.type;
                    if (cc.js.isString(type)) {
                        istype = false;
                    } else if (type instanceof Array) {
                        type.some(typeId => {
                            if (typeId == Number(srcType)) {
                                istype = true;
                            }
                        });
                    }
                });
            }
            return istype;
        }
    }
    /**
     * 给指定目标添加指定层数的buff
     * @param fight_id 
     * @param buff_id 
     * @param time 
     * @param num 
     * @param args 
     */
    add_stacking_buff(
        attacker_id: number,
        target_id: number,
        buff_id: number | number[],
        time: number | number[],
        num: number,
        args?: PveBuffArgs
    ) {
        let attacker = this.sceneModel.getFightBy(attacker_id);
        if (!attacker) return;
        if (!attacker.isAlive) return;
        for (let i = 0; i < num; i++) {
            this.add_buff_by(attacker, target_id, buff_id, time, args);
        }
    }

    /**
     * 给fight_id添加buff
     * @param fight_id 
     * @param buff_id 
     * @param time 
     */
    add_buff(fight_id: number, buff_id: number | number[], time: number | number[], args?: PveBuffArgs) {
        let m = this.sceneModel;
        let target = m.getFightBy(fight_id);
        if (target && target.isAlive) {
            let am = this.is_skill() ? this.attacker.model : this.target.model;
            PveTool.addBuffsTo(
                am.fightId,
                am.prop,
                target,
                buff_id,
                time,
                args,
            );
        }
    }


    /**
     * 给多个战斗单位添加buff
     * @param attacker_id 
     * @param targets 
     * @param buff_id 
     * @param time 
     * @param args 
     */
    add_buff_by_targets(
        attacker_id: number,
        targets: PveFightCtrl[],
        buff_id: number | number[],
        time: number | number[],
        args?: PveBuffArgs
    ) {
        if (!buff_id) return;
        if (!targets || targets.length == 0) {
            return;
        }
        let attacker = this.sceneModel.getFightBy(attacker_id);
        if (!attacker) return;
        if (!attacker.isAlive) return;
        targets.forEach(target => this.add_buff_by(attacker, target, buff_id, time, args));
    }

    /**
     * 为target_id添加BUFF，施法者为attacker_id
     * @param attacker_id 
     * @param target_id 
     * @param buff_id 
     * @param time 
     * @param args 
     */
    add_buff_by(
        attacker_id: number | PveFightCtrl,
        target_id: number | PveFightCtrl,
        buff_id: number | number[],
        time: number | number[],
        args?: PveBuffArgs
    ) {
        if (!buff_id) return;
        let m = this.sceneModel;
        let target: PveFightCtrl;
        if (cc.js.isNumber(target_id)) {
            target = m.getFightBy(target_id as number);
        } else {
            target = target_id as PveFightCtrl;
        }
        if (target && target.isAlive) {
            let attacker: PveFightCtrl;
            if (cc.js.isNumber(attacker_id)) {
                attacker = m.getFightBy(attacker_id as number);
            } else {
                attacker = attacker_id as PveFightCtrl;
            }
            if (!attacker) return;
            if (!attacker.isAlive) return;
            let am = attacker.model;
            PveTool.addBuffsTo(
                am.fightId,
                am.prop,
                target,
                buff_id,
                time,
                args,
            );
        }
    }


    /**
     * 清空目标对象指定技能的CD，如果不指定技能则清空所有CD
     * @param fight_id 
     * @param skill_id 
     */
    clear_skill_cd(fight_id: number, skill_id?: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(fight_id);
        if (target && target.isAlive) {
            target.model.resetCD(skill_id);
        }
    }
    /**
     * 减少目标技能的CD
     * @param fight_id 
     * @param skill_id 
     * @param cd 
     */
    reduce_skill_cd(fight_id: number, skill_id: number, cd: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(fight_id);
        if (target && target.isAlive) {
            target.model.reduceCd(cd, skill_id);
        }
    }
    /**
     * 设置目标的特定技能的cd为特定值 size:0 小于等于 1 大于等于
     * @param fight_id 
     * @param skill_id 
     * @param cd 
     */
    set_target_skill_cd(fight_id: number, skill_id: number, cd: number, size: number = 0) {
        let m = this.sceneModel;
        let target = m.getFightBy(fight_id);
        if (target && target.isAlive) {
            target.model.resetSkillCd(skill_id, cd, size);
        }
    }
    /**
     * 设置目标的特定技能的cd为特定值
     * @param fight_id 
     * @param skill_id 
     * @param cd 
     */
    set_target_skill_inde_cd(fight_id: number, skill_id: number, cd: number, size: number = 0) {
        let m = this.sceneModel;
        let target = m.getFightBy(fight_id);
        if (target && target.isAlive) {
            target.model.resetSkillIndeCd(skill_id, cd, size);
        }
    }

    /**
     * 获得场景中符合目标类型并且有buff_id的目标
     * @param target_type 
     * @param buff_id 
     */
    get_target_by(target_type: number, buff_id: number): PveFightCtrl {
        let m = this.sceneModel;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
        let a = m.fightSelector.getAllFights(this.is_skill() ? this.attacker : this.target, c, m);
        let r: PveFightCtrl = null;
        a && a.some(f => {
            if (f.model.buffs.some(b => { return b.id == buff_id; })) {
                r = f;
                return true;
            }
        });
        return r;
    }

    /**
     * 对场景中指定目标使用事件参数指定动作
     * @param target_type 
     * @param buff_id 
     * @param attacker_id 
     * @param args 
     */
    set_target_by(target_type: number, buff_id: number, attacker_id: number, args: PveBSEventArgs) {
        let m = this.sceneModel;
        let attacker = m.getFightBy(attacker_id);
        if (!attacker) return;
        if (!attacker.isAlive) return;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
        let a = m.fightSelector.getAllFights(attacker, c, m);
        a && a.forEach(t => {
            if (t.isAlive && t.model.buffs.some(b => { return b.id == buff_id; })) {
                PveTool.evalBuffEvent(args, attacker_id, attacker.model.prop, attacker, t);
            }
        });
    }

    /**
     * 对指定目标使用多个事件参数指定动作
     * @param attacker_id 
     * @param target_id 
     * @param args 
     */
    set_target_args(attacker_id: number, target_id: number, args: PveBSEventArgs[]) {
        let m = this.sceneModel;
        let attacker = m.getFightBy(attacker_id);
        if (!attacker) return;
        if (!attacker.isAlive) return;
        let target = m.getFightBy(target_id);
        if (!target) return;
        if (!target.isAlive) return;
        args.forEach(a => {
            PveTool.evalBuffEvent(a, attacker_id, attacker.model.prop, attacker, target);
        })
    }
    /**
     * 设置目标伤害值（为负则为恢复生命值）
     * @param target
     * @param hurt
     */
    set_target_hurt(
        attacker: PveFightCtrl,
        target: PveFightCtrl,
        hurt: number,
        type: number = PveHurtType.SKILL,
        ignore_onhurt?: boolean,
        dmg_type: number = 0
    ) {
        if (!target || !target.isAlive) return;
        if (!attacker || !attacker.isAlive) return;
        hurt = -hurt;
        let tm = target.model;
        let am = attacker.model;
        if (hurt != 0) {
            // 创建环境变量
            let scope: PveBSScopeType = {
                ...this.scope,
                a: am.prop,
                am: am,
                t: tm.prop,
                tm: tm,
                hp: -hurt,
            };
            // 产生伤害事件
            if (scope.hp < 0) {
                let onhurt = scope.t ? scope.t.onhurt : null;
                if (onhurt != null || typeof onhurt === 'object') {
                    // 目标BUFF属性中有受伤害事件
                    let b: boolean = !ignore_onhurt && scope.t.onhutrEvent !== false;
                    let target_id = tm.fightId;
                    if (!scope._target_map) {
                        // 首个被设置伤害的目标
                        scope._target_map = {};
                        scope._target_map[target_id] = true;
                        if (this.scope) {
                            this.scope._target_map = scope._target_map;
                        }
                    } else if (scope._target_map[target_id]) {
                        // 已经对此目标执行过set_target_hurt了，则忽略
                        b = false;
                    } else {
                        // 此对象还没被执行过，则保存至执行列表，避免下次再被执行
                        scope._target_map[target_id] = true;
                    }
                    b && PveTool.evalBuffEvent(
                        onhurt,
                        scope.am.fightId,
                        scope.a,
                        attacker,
                        target,
                        scope,
                    );
                    scope.hp = Math.ceil(scope.hp)
                }
                // 目标死亡事件
                if (tm.hp + tm.shield + scope.hp <= 0) {
                    // 施法者杀死目标事件
                    let onkill = scope.a ? scope.a.onkill : null;
                    if (onkill != null && typeof onkill === 'object') {
                        PveTool.evalBuffEvent(
                            onkill,
                            scope.am.fightId,
                            scope.a,
                            attacker,
                            target,
                            scope,
                        );
                    }
                    // 目标死亡事件
                    let ondead = scope.t ? scope.t.ondead : null;
                    if (ondead != null && typeof ondead === 'object') {
                        PveTool.evalBuffEvent(
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
            } else if (scope.hp > 0) {
                // 目标有回血害事件
                let onrestore = scope.tm ? scope.tm.prop.onrestore : null;
                if (onrestore != null && typeof onrestore === 'object') {
                    PveTool.evalBuffEvent(
                        onrestore,
                        scope.am.fightId,
                        scope.a,
                        attacker,
                        target,
                        scope,
                    );
                }
            }
            // 计算最终血量
            let result = PveTool.pveGetRealHurt(tm, scope.hp);
            let hp = result.hp + result.shield;
            if (hp != 0) {
                // 显示日志
                window['TD_TEST'] && cc.log(
                    '设置伤害:', hp,
                    // ', 施法者:', model.attacker,
                    // ', 目标:', model.selectedTargets,
                    ', 目标baseId:', tm.config.id,
                    ', 目标fightId:', tm.fightId,
                );
                // 添加战斗信息
                if (attacker.sceneModel.battleInfoUtil) {
                    attacker.sceneModel.battleInfoUtil.addBattleInfo(
                        tm.id,
                        type,
                        dmg_type,
                        am.fightId,
                        am.id,
                        am.type,
                        tm.fightId,
                        tm.id,
                        tm.type,
                        hp,
                    );
                }

                //特定英雄攻击范围内外的伤害统计
                if (scope.hp < 0 && this.sceneModel.gateconditionUtil && this.sceneModel.gateconditionUtil.HeroAttackDisDamage.length > 0) {
                    this.sceneModel.gateconditionUtil.HeroAttackDisDamage.forEach(index => {
                        let data = this.sceneModel.gateconditionUtil.DataList[index];
                        if (am.type == PveFightType.Hero && tm.type == PveFightType.Enemy) {
                            if (am.config.id == data.cfg.data1) {
                                let dis = MathUtil.distance(am.ctrl.getPos(), tm.ctrl.getPos());
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
                // 显示飘血数字
                target.showHurt(hp, hp > 0 ? PveHurtType.RECOVER : type, 1, dmg_type);
                // 目标减血
                //result.shield && (tm.shield += result.shield);
                result.shield && tm.refreshShied(result.shield); //刷新护盾值
                result.hp && (tm.hp += result.hp);
            }
        }
    }

    /**
     * 获得场景中符合目标类型并且有buff_id的所有目标
     * @param target_type 
     * @param buff_id 
     */
    get_targets_by(target_type: number, buff_id: number, id: number): PveFightCtrl[] {
        if (!this.target || !this.target.model) {
            return [];
        }
        let m = this.sceneModel;
        let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
        let tem: PveFightCtrl = this.target
        if (this.target.model.type == PveFightType.Soldier) {
            tem = (this.target as PveSoldierCtrl).model.hero
        }
        let a = m.fightSelector.getAllFights(tem, c, m);
        let r: PveFightCtrl[] = [];
        a && a.forEach(f => {
            if (f.model.buffs.some(b => { return b.id == buff_id; }) && f.model.fightId != id) {
                r.push(f);
            }
        });
        return r;
    }

    /**
     * 设置多个目标伤害值（为负则为恢复生命值）
     * @param targets 
     * @param hp 
     * @param type 
     */
    set_targets_hurt(
        attacker: PveFightCtrl,
        targets: PveFightCtrl[],
        hp: number,
        type: number = PveHurtType.SKILL,
        ignore_onhurt?: boolean,
        dmg_type: number = 0
    ) {
        if (targets.length > 0) {
            targets.forEach(f => {
                this.set_target_hurt(attacker, f, hp, type, ignore_onhurt, dmg_type);
            });
        }
    }

    /**
     * 设置单个目标百分比伤害值（hp为正则为恢复生命值）
     * @param attacker 
     * @param targets 
     * @param hp 
     * @param type 
     */
    set_target_percentageHurt(attacker: PveFightCtrl, target: PveFightCtrl, hp: number, type: number = PveHurtType.SKILL, ignore_onhurt?: boolean, dmg_type: number = 0) {
        if (!(!target || !target.isAlive)) {
            this.set_target_hurt(attacker, target, target.model.hpMax * hp, type, ignore_onhurt, dmg_type)
        }
    }
    /**
     * 设置多个目标百分比伤害值（hp为正则为恢复生命值）
     * @param attacker 
     * @param targets 
     * @param hp 
     * @param type 
     */
    set_targets_percentageHurt(attacker: PveFightCtrl, targets: PveFightCtrl[], hp: number, type: number = PveHurtType.SKILL, ignore_onhurt?: boolean, dmg_type: number = 0) {
        if (targets && targets.length > 0) {
            targets.forEach(f => {
                this.set_target_percentageHurt(attacker, f, hp, type, ignore_onhurt, dmg_type)
            })
        }
    }

    /**
     * 转换目标为施法者的召唤物
     * @param attacker_id
     * @param time 
     * @param rate
     * @param args
     */
    trans_to_caller(attacker_id: number, time: number, rate?: number, args?: PveBSEventArgs) {
        let b: boolean = true;
        if (cc.js.isNumber(rate)) {
            b = FightingMath.rate(rate);
        }
        if (b) {
            let m = this.sceneModel;
            let attacker = m.getFightBy(attacker_id);
            let target = this.target;
            if (attacker && target && target.isAlive) {
                // 创建召唤物
                PveFightUtil.createCaller(
                    m,
                    this.target.model.id,
                    time,
                    {
                        call_id: this.target.model.id,
                        owner: attacker,
                        pos: target.getPos(),
                        hp: target.model.hp,
                        config: target.model.baseProp,
                        args: args,
                    }
                );
                // 当前目标直接死亡
                target.model.hp = 0;
            }
        }
    }

    /**
     * 克隆目标为施法者的召唤物
     * @param time 
     * @param rate 
     * @param args 
     */
    clone_to_caller(time: number, rate?: number, args?: PveBSEventArgs) {
        let b: boolean = true;
        if (cc.js.isNumber(rate)) {
            b = FightingMath.rate(rate);
        }
        if (b) {
            let attacker = null;
            let model = this.target.model;
            let id = -1;
            let canCall = true;
            switch (model.type) {
                case PveFightType.Call:
                    id = model.id;
                    attacker = (model as PveCalledModel).owner;
                    break;

                case PveFightType.Soldier:
                    let tem = model as PveSoldierModel
                    if (tem.cloneCaller) {
                        canCall = false
                    } else {
                        tem.cloneCaller = true;
                    }
                    attacker = tem.hero;
                    break;
            }
            let target = this.target;
            if (canCall && attacker && target && target.isAlive) {
                // 创建召唤物，并使用目标对象属性
                PveFightUtil.createCaller(
                    target.sceneModel,
                    id,
                    time,
                    {
                        call_id: id,
                        owner: attacker,
                        pos: target.getPos(),
                        config: Object['assign']({}, target.model.baseProp),
                        args: args,
                    }
                );
            }
        }
    }

    clone_target_to_caller(attacker_id: number, target_id: number, time: number, rate?: number, args?: PveBSEventArgs) {
        let b: boolean = true;
        if (cc.js.isNumber(rate)) {
            b = FightingMath.rate(rate);
        }
        if (b) {
            let m = this.sceneModel;
            let attacker = m.getFightBy(attacker_id);
            let target = m.getFightBy(target_id);
            if (!attacker || !attacker.isAlive) return;
            if (!target || !target.isAlive) return;
            let id = -1;
            // 创建召唤物，并使用目标对象属性
            PveFightUtil.createCaller(
                m,
                id,
                time,
                {
                    call_id: id,
                    owner: attacker,
                    pos: target.getPos(),
                    config: Object['assign']({}, target.model.baseProp),
                    args: args,
                }
            );
        }
    }

    //克隆目标为召唤物,并且修改属性
    clone_targetPro_to_caller(attacker_id: number, target_id: number, time: number, rate?: number, args?: PveBSEventArgs, changePro?: any) {
        let b: boolean = true;
        if (cc.js.isNumber(rate)) {
            b = FightingMath.rate(rate);
        }
        if (b) {
            let m = this.sceneModel;
            let attacker = m.getFightBy(attacker_id);
            let target = m.getFightBy(target_id);
            if (!attacker || !attacker.isAlive) return;
            if (!target || !target.isAlive) return;
            let id = -1;

            let temPro = Object['assign']({}, target.model.baseProp);
            if (changePro) {
                temPro = Object['assign'](temPro, changePro)
            }
            // 创建召唤物，并使用目标对象属性
            PveFightUtil.createCaller(
                m,
                id,
                time,
                {
                    call_id: id,
                    owner: attacker,
                    pos: target.getPos(),
                    config: temPro,
                    args: args,
                }
            );
        }
    }

    /**
     * 创建陷阱接口
     * @param attacker_id 陷阱施法者id
     * @param trap_id 陷阱id
     * @param time 陷阱时间
     * @param num 陷阱个数
     * @param target_id 陷阱位置目标(施法者ID或者目标ID)
     * @param rate 创建陷阱的概率
     */
    add_trap_by(attacker_id: number, trap_id: number, time: number, num: number, target_id: number, rate?: number, trapPosX?: number | cc.Vec2, trapPosY?: number, range?: number) {
        let b: boolean = true;
        if (cc.js.isNumber(rate)) {
            b = FightingMath.rate(rate);
        }
        if (b) {
            let m = this.sceneModel;
            let attacker = m.getFightBy(attacker_id);
            let pos: cc.Vec2
            if (attacker && attacker.isAlive) {
                if (trapPosX instanceof cc.Vec2) {
                    pos = trapPosX;
                }
                else if (cc.js.isNumber(trapPosX) && cc.js.isNumber(trapPosY)) {
                    let tem = m.ctrl.content;
                    pos = cc.v2(trapPosX / 720 * tem.width, trapPosY / 1280 * tem.height)
                } else {
                    if (target_id === attacker_id) {
                        pos = attacker.getPos()
                    } else {
                        let target = m.getFightBy(target_id);
                        if (target && target.isAlive) {
                            pos = target.getPos()
                        }
                    }
                }
                if (pos) {
                    for (let i = 0; i < num; i++) {
                        PveFightUtil.createTrap(
                            m,
                            trap_id,
                            time,
                            pos,
                            attacker,
                            range
                        );
                    }
                }
            }
        }
    }

    /**
     * 判断是否为技能
     * @param id
     */
    is_skill(id?: number): boolean {
        let s = this.scope;
        if (typeof s.s === 'object') {
            if (id) {
                return s.s.skill_id == id;
            }
            return true;
        }
        return false;
    }

    /**
     * 判断是否为普攻技能
     */
    is_normSkill(): boolean {
        let s = this.scope;
        if (typeof s.s === 'object') {
            return PveSkillType.isNormal(s.s.type)//s.s.dmg_type == 0;
        }
        //if (PveSkillType.isHalo(s.type))
        return false;
    }

    /**
     * 判断是否为BUFF
     * @param id 
     */
    is_buff(id?: number): boolean {
        let s = this.scope;
        if (typeof s.b === 'object') {
            if (id) {
                return s.b.id == id;
            }
            return true;
        }
        return false;
    }

    /**
     * 伤害类型判断
     * @param v
     */
    is_dmg_type(v?: number): boolean {
        if (v === void 0) return true;
        let s = this.scope;
        if (typeof s.s === 'object') {
            return s.s.dmg_type == v;
        } else if (typeof s.b === 'object') {
            return s.b.dmg_type == v;
        }
        return false;
    }

    /**
     * 目标伤害类型判断
     * @param v 伤害类型
     * @param baseId 目标的baseID
     */
    is_target_dmg_type(v: number, baseId: number): boolean {
        if (v === void 0) return true;
        let s = this.scope;
        if (typeof s.s === 'object') {
            if (s.am && s.am.config.id == baseId) {
                return s.s.dmg_type == v;
            }
        } else if (typeof s.b === 'object') {
            if (s.am && s.am.config.id == baseId) {
                return s.b.dmg_type == v;
            }
        }
        return false;
    }
    /**
     * 判断是否是伤害类型的，并且返回来源是技能还是buff 
     * 0:不是该伤害类型 1:是该伤害类型，并且来自技能 2:是该伤害类型，并且来自buff
     * @param v 伤害类型
     */
    is_dmg_type_skillOrBuff(v?: number): number {
        let a = 0
        if (v === void 0) return a;
        let s = this.scope;
        if (typeof s.s === 'object') {
            if (s.s.dmg_type == v) {
                a = 1
            }
        } else if (typeof s.b === 'object') {
            if (s.b.dmg_type == v) {
                a = 2
            }
        }
        return a;
    }

    /**
     * 检测目标的血量百分比是否小于num
     * @param target_id 
     * @param num 
     */
    get_target_bloodPro(target_id: number, num: number): boolean {
        let result = false;
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        let pos: cc.Vec2
        if (target && target.isAlive) {
            let temNum = target.model.hp / target.model.hpMax;
            if (temNum <= num) {
                result = true;
            }
        }
        return result;
    }
    /**
     * 设置目标动作并改变fsm状态至自定义状态，当前只针对怪物有效(对怪物、英雄、士兵、守卫、召唤物都有效)
     * @param finish 
     * @param animation 
     */
    set_target_animation(finish: boolean, animation?: string) {
        if (!this.target || !this.target.isAlive) {
            return;
        }
        let model = this.target.model;
        if (finish) {
            // 结束自定义状态
            if (animation && model.customState) {
                // 只有当前在自定义状态时还原动作才有效
                this.target.setAnimation(animation, { mode: 'set', loop: true });
            }
            this.target.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_END_CUSTOM);
        } else {
            // 进入自定义状态
            if (model.type == PveFightType.Enemy) {
                model.targetId = -1;
            }
            // 改变动作
            if (animation) {
                this.target.setAnimation(animation, { mode: 'set', loop: true });
            }
            this.target.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_BEGIN_CUSTOM);
        }
    }


    /**
     * 设置怪物的朝向
     * @param dir -1朝左 1朝右
     */
    set_target_dir(dir: number) {
        if (!this.target) return;
        if (!this.target.isAlive) return;
        if (this.target.model.type == PveFightType.Enemy) {
            let monster = this.target.model as PveEnemyModel
            if (dir < 0) {
                monster.dir = PveEnemyDir.DOWN_LEFT
            } else {
                monster.dir = PveEnemyDir.DOWN_RIGHT
            }
        }
    }

    /**
     * 获取杀死的怪物个数
     */
    get_killedEnemy_num(): number {
        let m = this.sceneModel;
        return m.killedEnemy;
    }

    /**
     * 通过baseId获取战斗单位数据
     * @param baseId 
     */
    get_targetBy_baseId(baseId: number): PveFightCtrl {
        let m = this.sceneModel;
        return m.getFightBybaseId(baseId);
    }

    /**
     * 通过baseId获取所有战斗单位数据
     * @param baseId 
     */
    get_AllTargetBy_baseId(baseId: number): PveFightCtrl[] {
        let m = this.sceneModel;
        return m.getAllFightBybaseId(baseId);
    }

    /**
     * 通过baseId获取所有战斗单位数量
     * @param baseId 
     */
    get_AllTargetNumberBy_baseId(baseId: number): number {
        let m = this.sceneModel;
        return m.getFightNumByBaseId(baseId);
    }

    /**
     * 判断场上的英雄是否有死亡状态死亡
     */
    checkHerosIsDeadState(): boolean {
        let m = this.sceneModel;
        let r = false;
        m.heros.some(h => {
            if (!h.isAlive) {
                r = true;
                return true;
            }
            return false;
        });
        return r;
    }
    /**
     * 通过color获取所有怪物数据
     * @param color 
     */
    get_AllEnemy_byColor(color: number): PveFightCtrl[] {
        let res: PveFightCtrl[] = []
        let m = this.sceneModel;
        m.enemies.forEach(enemy => {
            if (enemy.model.config.color == color) {
                res.push(enemy);
            }
        })
        m.specialEnemies.forEach(enemy => {
            if (enemy.model.config.color == color) {
                res.push(enemy);
            }
        })
        return res;
    }

    /**
     * 获取目标ID身上有（或者没有）特定buff的所有单位
     * @param baseId 
     * @param buffId 
     * @param have 
     */
    get_AllTargetBy_baseId_haveBuff(baseId: number, buffId: number, have: boolean = true): PveFightCtrl[] {
        let res: PveFightCtrl[] = []
        let tem = this.get_AllTargetBy_baseId(baseId)
        tem.forEach(ctrl => {
            let haveBuff = false;
            ctrl.model.buffs.some(b => {
                if (buffId == b.id) {
                    haveBuff = true;
                    return true;
                }
                return false;
            });
            if ((have && haveBuff) || (!have && !haveBuff)) {
                res.push(ctrl);
            }
        })
        return res;
    }

    /**
     * 获取目标的脱战时长(暂时只对英雄有效)
     * @param target_id 
     */
    get_target_OffBattleTime(target_id: number): number {
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        if (target && target.isAlive && target.model.type == PveFightType.Hero) {
            let tem = target as PveHeroCtrl;
            return Math.floor(tem.OffBattleTime);
        }
        return 0;
    }

    /**
     * 设置目标进入战斗状态(暂时只对英雄有效)
     * @param target_id 
     */
    set_target_onBattleState(target_id: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        if (target && target.isAlive && target.model.type == PveFightType.Hero) {
            let tem = target as PveHeroCtrl;
            tem.resetOffBattleState();
        }
    }


    remove_buff_id(targetId: number, buffId: number, type: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(targetId);
        if (target && target.isAlive) {
            let buf: PveBaseBuffCtrl = target.buff;
            if (buf && buf.enabled) {
                let str: 'first' | 'all' = 'all'
                if (type == 1) {
                    str = 'first'
                }
                buf.removeBuf(buffId, str)
            }
        }
    }

    /**
     * 删除目标身上多个buff
     * @param targetId 
     * @param buffId 
     * @param type 
     */
    remove_target_buffs(targetId: number, buffId: any, type: number) {
        if (cc.js.isNumber(buffId)) {
            this.remove_buff_id(targetId, buffId, type)
        } else if (cc.js.isString(buffId)) {
            let str: string[] = buffId.toString().split(',');
            str.forEach(idStr => {
                let id = Number(idStr);
                this.remove_buff_id(targetId, id, type)
            })
        }
    }

    //删除多个单位身上的buff
    remove_targets_buff(targetIds: PveFightCtrl[], buff_ids: number | string, type: number = 0) {
        if (targetIds && targetIds.length > 0) {
            targetIds.forEach(target => {
                if (target && target.isAlive) {
                    let buf: PveBaseBuffCtrl = target.buff;
                    if (buf && buf.enabled) {
                        if (cc.js.isNumber(buff_ids)) {
                            let str: 'first' | 'all' = 'all'
                            if (type == 1) {
                                str = 'first'
                            }
                            buf.removeBuf(Number(buff_ids), str)
                        } else {
                            let str: string[] = buff_ids.toString().split(',');
                            str.forEach(idStr => {
                                let id = Number(idStr);
                                let typeStr: 'first' | 'all' = 'all'
                                if (type == 1) {
                                    typeStr = 'first'
                                }
                                buf.removeBuf(id, typeStr)
                            })
                        }

                    }
                }
            })
        }
    }

    /**
     * 给目标添加光环
     * @param targetId 
     * @param haloId 
     * @param time 
     */
    add_halo_by(targetId: number, haloId: number, time?: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(targetId);
        if (target && target.isAlive) {
            let m: PveHaloModel = PvePool.get(PveHaloModel);
            m.id = haloId;
            if (time) {
                m.remain = time;
            }
            target.addHalo(m);
        }
    }

    /**
     * 给目标添加光环
     * @param targetId 
     * @param haloId 
     * @param time 
     */
    get_halo_by(targetId: number, haloId: number): PveHaloModel {
        let m = this.sceneModel;
        let r: PveHaloModel = null;
        let target = m.getFightBy(targetId);
        if (target && target.isAlive) {
            let halos = this.target.model.halos;
            halos.some(h => {
                if (h.id == haloId) {
                    r = h;
                    return true;
                }
                return false;
            })
        }
        return r
    }

    /**
     * 删除目标身上的光环
     * @param targetId 
     * @param haloIds 
     */
    remove_target_halos(targetId: number, haloIds: any) {
        let m = this.sceneModel;
        let target = m.getFightBy(targetId);
        if (target && target.isAlive) {
            let ids = []
            if (cc.js.isNumber(haloIds)) {
                ids.push(haloIds)
            } else if (cc.js.isString(haloIds)) {
                let str: string[] = haloIds.toString().split(',');
                str.forEach(idStr => {
                    let id = Number(idStr);
                    ids.push(id);
                })
            }
            let halo: PveBaseHaloCtrl = target.halo;
            if (halo) {
                ids.forEach(haloId => {
                    halo.removeHalo(haloId)
                })
            }
        }
    }

    /**
     * 特定骨骼上显示buff层数
     * @param buffId //buffID
     * @param max    //最大的显示层数
     * @param isRemove //buff清除时还原
     * @param curNum //直接设置层数
     */
    set_bone_slotShow(buffId: number, max: number, target: number = 0, isRemove = false, curNum?: number | number[]) {
        let num: number | number[] = 0;
        if (curNum) {
            num = curNum;
        } else {
            let buff = this.get_buff_by(buffId, target);
            if (!isRemove && buff) {
                num = buff.stacking;
            }
        }
        let temCtrl = target == 0 ? this.target : this.attacker;
        if (temCtrl && temCtrl.isAlive && temCtrl.model.type == PveFightType.Hero) {
            let spine = temCtrl.spines[0];
            let skeletonData = spine['_N$skeletonData'];
            if (skeletonData && skeletonData['_skeletonJson']) {
                // 设置spine缓存模式
                if (!cc.sys.isNative && (num instanceof Array || num > 0) && spine.isAnimationCached()) {
                    spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
                    // 设置动作混合解决动作切换时顿的问题
                    let idle = temCtrl.getAnimation(PveFightAnmNames.IDLE);
                    for (let k in skeletonData['_skeletonJson'].animations) {
                        // 普攻或技能动作
                        if (k.startsWith('atk') || k.startsWith('skill')) {
                            spine.setMix(idle, k, 0.16);
                            spine.setMix(k, idle, 0.16);
                        }
                    }
                }
                // 遍历设置slot透明值
                let slots: any[] = skeletonData['_skeletonJson'].slots;
                slots && slots.forEach(slot => {
                    let bone = slot.bone as string;
                    if (bone.startsWith('bone_buff_')) {
                        let s = spine.findSlot(slot.name);
                        if (s) {
                            let i = parseInt(bone.substr(10));
                            let a = 0;
                            if (cc.js.isNumber(num) && i == num) {
                                a = 1;
                            } else if (num instanceof Array && num.indexOf(i) > -1) {
                                a = 1;
                            }
                            s.color.a = a;
                        }
                    }
                });
            }
            // for (let i = 1; i <= max; i++) {
            //     let s = spine.findSlot('bone_buff_' + i);
            //     if (!s) break;
            //     let a = 0;
            //     if (cc.js.isNumber(num) && i == num) {
            //         a = 1;
            //     } else if (num instanceof Array && num.indexOf(i) > -1) {
            //         a = 1;
            //     }
            //     s.color.a = a;
            // }
        }
    }

    /**
     * 检测目标是否拥有某个技能
     * @param target_id 
     * @param skillId 
     */
    get_target_haveSkill(target_id: number, skillId: number): boolean {
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        let res = false
        if (target && target.isAlive) {
            let skillIds = (target.model as PveHeroModel).skillIds
            skillIds.some(data => {
                if (data.skillId == skillId) {
                    res = true;
                    return true;
                }
                return false;
            })
        }
        return res;
    }

    /**
     * 检测目标指定技能的等级(没有指定技能时返回0)
     * @param target_id 
     * @param skillId 
     */
    get_target_SkillLv(target_id: number, skillId: number): number {
        let lv = 0;
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        if (target && target.isAlive) {
            let skillIds = (target.model as PveHeroModel).skillIds
            skillIds.some(data => {
                if (data.skillId == skillId) {
                    lv = data.skillLv;
                    return true;
                }
                return false;
            })
        }
        return lv;
    }

    //怪物传送回之前走过的路径的一半
    changeEnemyPos(target_id: number, isFirst: number = 0) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        //击退免疫
        if (target.model.getProp('invisible_repel')) {
            return;
        }
        // 寻找离施法者最近的点做为路径起点
        if (target.model.type === PveFightType.Enemy) {
            let m: PveEnemyModel = target.model as PveEnemyModel;
            let r = sceneModel.tiled.roads[m.roadIndex];
            let p = target.getPos();
            let c = Number.MAX_VALUE;
            let b = 0;
            for (let i = 0, n = r.length; i < n; i++) {
                let d = MathUtil.distance(p, r[i]);
                if (d < c) {
                    c = d;
                    b = i;
                }
            }
            let num = 0.5
            if (isFirst > 0) {
                let tem = 0.5;
                let add = 0;
                for (let i = 0; i < isFirst; i++) {
                    tem = tem * 0.5;
                    add += tem;
                }
                num += add;
            }
            num = Math.min(1, num);
            // 传送回之前走过的路径的一半
            m.road = r.slice(Math.floor(b * num));
            m.targetPos = null;
            target.node.setPosition(m.road[0])
        }
    }

    /**
     * 将范围内的目标拖拽到指定目标位置
     * @param target_id 
     * @param range 
     * @param target_type 
     * @param time 
     */
    dragEnemyToTarget(target_id: number, range: number, target_type: number, time: number) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {

            //击退免疫
            if (target.model.getProp('invisible_repel')) {
                return;
            }
            //let targets = PveFightSelector.getAllFights()
            //{
            //     fight: this.ctrl,
            //     targetType: model.currSkill.targetType,
            //     pos: this.ctrl.getPos(),
            //     range: model.atkDis,
            // }
            //let m = this.sceneModel;
            let c = ConfigManager.getItemById(Skill_target_typeCfg, target_type);
            // 如果当前目标符合要求，则优先使用当前的目标
            let pos: cc.Vec2 = target.getPos();
            // 寻找一个新的目标
            let all = sceneModel.fightSelector.getAllFights(target, c, sceneModel, null, pos, range);
            if (all && all.length > 0) {
                let priority_type = PveTool.getPriorityType(c, null);
                all = sceneModel.fightSelector.circleSelect(all, pos, priority_type, range, 999, true);
            }
            if (all && all.length > 0) {
                //进行拖拽
                all.forEach(enemy => {
                    let m: PveEnemyModel = enemy.model as PveEnemyModel;
                    let action = cc.speed(
                        cc.sequence(
                            cc.moveTo(time, pos),
                            cc.callFunc((node: cc.Node, ctrl: PveFightCtrl) => {
                                let r = sceneModel.tiled.roads[m.roadIndex];
                                let p = ctrl.getPos();
                                let c = Number.MAX_VALUE;
                                let b = 0;
                                for (let i = 0, n = r.length; i < n; i++) {
                                    let d = MathUtil.distance(p, r[i]);
                                    if (d < c) {
                                        c = d;
                                        b = i;
                                    }
                                }
                                // 传送回之前走过的路径的一半
                                m.road = r.slice(b);
                                m.targetPos = null;
                                m.speedScale = 1;
                            }, this, enemy),
                        ),
                        sceneModel.timeScale
                    );
                    m.speedScale = 0;
                    enemy.node.runAction(action);
                })
            }
        }
    }


    /**
     * demo场景英雄移动
     * @param target_id 目标id
     * @param index 目的位置下标
     * @param time  移动的时间
     */

    demo_Hero_moveTo(target_id: number, index: number, time: number) {
        let sceneModel = this.sceneModel;
        if (!sceneModel.isDemo) return;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {
            //this.stopTargetCurSkill(target_id);
            target.setAnimation('walk', { mode: 'set', loop: true });
            target.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_BEGIN_CUSTOM);
            let h: PveHeroModel = target.model as PveHeroModel;
            let temCfg = ConfigManager.getItemByField(Pve_demo2Cfg, 'hero_id', h.config.id);
            h.demoRoadIndex = temCfg.towers_group.length < 6 ? 0 : index + 1;
            let temPos = temCfg.towers_group[index]
            let pos = cc.v2(temPos[0], temPos[1]);
            let action = cc.speed(
                cc.sequence(
                    cc.moveTo(time, pos),
                    cc.callFunc((node: cc.Node, ctrl: PveFightCtrl) => {
                        ctrl.setAnimation('stand', { mode: 'set', loop: true });
                        ctrl.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_END_CUSTOM);
                    }, this, target),
                ),
                sceneModel.timeScale
            );
            target.node.runAction(action);
        }
    }


    /**
     * 转移对象身上的buff到另外一个对象身上，保留buff所有的状态包括（剩余的持续时间，叠加数）
     * @param source_id 
     * @param target_type 
     * @param buff_id 
     * @param buff_type 
     * @param num 
     */
    trans_buffs(source_id: number, target_type: number, buff_id: number) {
        let model = this.sceneModel;
        let source = model.getFightBy(source_id);
        if (!source || !source.isAlive) return;
        let buffM: PveBuffModel = null;;
        // 过滤符合条件的项
        source.model.buffs.some(b => {
            if (buff_id != b.id) return false;
            buffM = b;
            return true;
        });
        let targets = this.get_target_type(target_type, 0);
        if (targets && targets.length > 0) {
            for (let i = 0; i < targets.length; i++) {
                let target = targets[i];
                let haveBuff = false;
                target.model.buffs.some(b => {
                    if (buff_id == b.id) {
                        haveBuff = true;
                        return true;
                    }
                    return false;
                });
                if (!haveBuff) {
                    target.addBuff(buffM);
                    break;
                }
            }
        }
    }

    /**
     * 转移怪物至对方阵营
     * @param target_id 
     */
    monster_trans_opponent(target_id: number) {
        let sceneModel = this.sceneModel;
        let arenaData = sceneModel.arenaSyncData;
        let target = sceneModel.getFightBy(target_id);
        if (target && arenaData && target.isAlive && target.model.type == PveFightType.Enemy) {
            let monster = target as PveEnemyCtrl;
            let model = monster.model;
            // 计算杀敌数
            if (model.config.type != 4) {
                sceneModel.killedEnemy++;
                // 保存击杀各类怪物数量
                let dic = sceneModel.killedEnemyDic;
                let id = model.id;
                if (!dic[id]) {
                    dic[id] = 0;
                }
                dic[id]++;
            }
            model.currSkill = null;
            model.targetId = -1;
            sceneModel.removeFight(monster);
            // 添加至对手的场景中
            let sm = monster.sceneModel = sceneModel.isMirror ? arenaData.mainModel : arenaData.mirrorModel;
            sm.createdEnemy += 1
            sm.addFight(monster);
            // 设置新的路线
            let roadIndex = model.roadIndex;
            let road = sm.tiled.roads[roadIndex];
            let len = sceneModel.tiled.getRoadLen(roadIndex);
            road = PveRoadUtil.getRoadBy(road, 1.0 - PveRoadUtil.getDistance(model.road) / len, len);
            model.targetPos = null;
            model.road = road;
            model.roadIndex = roadIndex;
            monster.node.setPosition(road[0]);
        }
    }

    /**
     * 怪物传送到特定位置一段时间，时间结束之后返回之前的位置
     * @param target_id 
     * @param posStr 
     * @param dir 传送之后的朝向 
     * @param time 
     * @param animation 
     */
    monster_transPos_idle(target_id: number, posStr: string, dir: number, time: number, animation?: string) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive && target.model.type == PveFightType.Enemy) {
            let monster = target as PveEnemyCtrl;
            let str: string[] = posStr.split(',')
            let targetPos = cc.v2(Number(str[0]), Number(str[1]))
            let pos = target.getPos();
            monster.model.trans_AfterPos = targetPos
            monster.model.trans_BeforePos = pos;
            monster.model.transTime = time;

            gdk.Timer.once(100, this, () => {
                monster.node.setPosition(targetPos);
                //monster.node.scaleX = Math.abs(monster.node.scaleX) * dir
                if (dir < 0) {
                    monster.model.dir = PveEnemyDir.DOWN_LEFT
                } else {
                    monster.model.dir = PveEnemyDir.DOWN_RIGHT
                }
                if (animation) {
                    monster.setAnimation(animation, { mode: 'set', loop: true });
                }
            })
            //monster.node.setPosition(targetPos);
            monster.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_BEGIN_CUSTOM);
        }
    }

    // 修改怪物的皮肤，一个怪物一局只能修改一次
    monster_changeSkin(target_id: number, skinStr: string) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive && target.model.type == PveFightType.Enemy) {
            let monster = target as PveEnemyCtrl;
            if (!monster.model.changeSkin) {
                let spine = monster.spines[0];
                monster.model.changeSkin = skinStr;
                monster.node.scaleX = monster.node.scaleY = monster.model.config.size;
                monster.restColor();
                GlobalUtil.setSpineData(
                    monster.node,
                    spine,
                    StringUtils.format("spine/monster/{0}/{0}", skinStr),
                );
            }
        }
    }

    // 修改目标的皮肤
    target_changeSkin(target_id: number, skinStr?: string) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {
            let model = target.model as PveEnemyModel;
            if (model.type != PveFightType.Enemy && model.type != PveFightType.Soldier) {
                // 只对怪物、士兵有效
                return;
            }
            let url = PveTool.getSkinUrl(skinStr || model.skin);
            target.spines.forEach(spine => {
                // spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
                GlobalUtil.setSpineData(target.node, spine, url, false, target.getAnimation(PveFightAnmNames.IDLE));
            });
            if (!model.customState && model.type == PveFightType.Enemy) {
                target.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_REPEL);
            }
        }
    }

    //获取场景中所有守卫的个数
    get_guard_num() {
        let num = 0;
        let sceneModel = this.sceneModel;
        sceneModel.soldiers.forEach(ctrl => {
            if (ctrl.model.config.type == 4) {
                num += 1;
            }
        })
        return num;
    }
    //获取场景中所有守卫英雄的个数
    get_guardHero_num() {
        let num = 0;
        let sceneModel = this.sceneModel;
        sceneModel.heros.forEach(ctrl => {
            if (ctrl.model.soldierType == 4) {
                num += 1;
            }
        })
        return num;
    }


    /**获取以目标单位当前敌人的所有单位 */
    get_target_AllEnemy(targetId: number): PveFightCtrl[] {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(targetId);
        let res: PveFightCtrl[] = [];
        if (target && target.isAlive) {
            let arr = [sceneModel.enemies, sceneModel.specialEnemies, sceneModel.calleds];
            // 查询列表中满足要求的数量
            for (let j = 0; j < arr.length; j++) {
                let a: PveFightCtrl[] = arr[j];
                for (let i = 0, n = a.length; i < n; i++) {
                    let t = a[i];
                    if (t && t.isAlive) {
                        if (t.model.camp != target.model.camp &&
                            t.model.targetId == targetId) {
                            res.push(t);
                        }
                    }
                }
            }
        }
        return res;
    }

    /**
     * 判断目标是不是我的拦截单位
     */
    is_target_Intercept(attackId: number, targetId: number): boolean {
        let res = false;
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(targetId);
        if (target && target.isAlive && attackId != targetId) {
            res = target.model.targetId == attackId;
        }
        return res;
    }

    /**
     * 判断目标是不是守卫拦截的单位
     */
    is_Soldier_Intercept(targetId: number): boolean {
        let res = false;
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(targetId);
        if (target && target.isAlive) {
            if (target.model.targetId > 0) {
                let tem = sceneModel.getFightBy(targetId);
                if (tem && tem.isAlive && tem.model.type == PveFightType.Soldier) {
                    res = true;
                }
            }
        }
        return res;
    }

    /**设置目标身上的buff层数 */
    set_target_buff_stacking(attackId: number, targetId: number, buffID: number, buffTime: number, stack: number) {
        if (stack == 0) {
            this.remove_buff_id(targetId, buffID, 0)
            return;
        }
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(targetId);
        if (target && target.isAlive) {
            let haveBuff = false;
            target.model.buffs.some(b => {
                if (b.id == buffID) {
                    stack = Math.min(stack, b.config.stacking_fold)
                    b.stacking = stack
                    haveBuff = true;
                }
            });
            if (!haveBuff) {
                this.add_stacking_buff(attackId, targetId, buffID, buffTime, stack);
            }

        }
    }
    /**设置多个目标身上的buff层数 */
    set_targets_buff_stacking(attackId: number, targets: PveFightCtrl[], buffID: number, buffTime: number, stack: number) {
        if (!targets || targets.length == 0) {
            return;
        }
        targets.forEach(target => {
            this.set_target_buff_stacking(attackId, target.model.fightId, buffID, buffTime, stack);
        })
    }

    /**
     * 当自己的位置比目标位置更接近终点，设置目标位置为自己的位置
     * @param attackId 
     * @param target_id 
     */
    set_target_road(attackId: number, target_id: number, trapId?: number) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        let attack = sceneModel.getFightBy(attackId);
        // 寻找离施法者最近的点做为路径起点
        if (target.model.type === PveFightType.Enemy && attack.model.type === PveFightType.Enemy) {
            let tm: PveEnemyModel = target.model as PveEnemyModel;
            let am: PveEnemyModel = attack.model as PveEnemyModel;
            let r = sceneModel.tiled.roads[tm.roadIndex];
            let p1 = target.getPos();
            let p2 = attack.getPos();
            let change = false;
            if (am.road.length < tm.road.length) {
                change = true;
            } else if (am.road.length == tm.road.length) {
                if (am.targetPos) {
                    let d1 = MathUtil.distance(p1, am.targetPos);
                    let d2 = MathUtil.distance(p2, am.targetPos);
                    if (d2 < d1) {
                        change = true;
                    }
                } else {
                    let d1 = MathUtil.distance(p1, am.road[0]);
                    let d2 = MathUtil.distance(p2, am.road[0]);
                    if (d2 < d1) {
                        change = true;
                    }
                }
            }
            if (change) {
                tm.road = am.road.concat();
                tm.targetPos = am.targetPos;
                target.node.setPosition(p2)
                //设置陷阱位置
                if (trapId) {
                    let trap = sceneModel.getTrapBybaseId(trapId);
                    if (!trap) {
                        this.add_trap_by(target_id, trapId, 999, 1, attackId);
                    } else {
                        trap.node.setPosition(p2)
                    }
                }
            }
            // let c1 = Number.MAX_VALUE;
            // let b1 = 0;
            // let c2 = Number.MAX_VALUE;
            // let b2 = 0;
            // for (let i = 0, n = r.length; i < n; i++) {
            //     let d = MathUtil.distance(p1, r[i]);
            //     if (d < c1) {
            //         c1 = d;
            //         b1 = i;
            //     }
            // }
            // for (let i = 0, n = r.length; i < n; i++) {
            //     let d = MathUtil.distance(p2, r[i]);
            //     if (d < c2) {
            //         c2 = d;
            //         b2 = i;
            //     }
            // }
            // if (b2 > b1) {
            //     // 传送到更远的怪物的地点
            //     tm.road = r.slice(b2);
            //     tm.targetPos = null;
            //     target.node.setPosition(p2)
            // }
        }
    }

    /**
     * 删除陷阱
     * @param trapId 
     */
    remove_trapByBaseId(trapId: number) {
        let sceneModel = this.sceneModel;
        let trap = sceneModel.getTrapBybaseId(trapId);
        if (trap) {
            (trap as PveTrapCtrl).model.time = 0;
        }
    }

    /**
     * 获取所有单位中离终点最近的单位(相同路径的怪物)
     */
    get_targets_road_min(targets: PveFightCtrl[]): number {
        let fightId = 0;
        let temCtrl: PveEnemyCtrl = null;
        if (targets.length > 0) {
            let sceneModel = this.sceneModel;
            for (let i = 0; i < targets.length; i++) {
                if (temCtrl == null) {
                    temCtrl = targets[i] as PveEnemyCtrl;
                    continue;
                } else {
                    let r = sceneModel.tiled.roads[temCtrl.model.roadIndex];
                    let p1 = temCtrl.getPos();
                    let p2 = targets[i].getPos();
                    let am = targets[i].model as PveEnemyModel
                    let tm = temCtrl.model
                    let change = false;
                    if (am.road.length < tm.road.length) {
                        change = true;
                    } else if (am.road.length == tm.road.length) {
                        if (am.targetPos) {
                            let d1 = MathUtil.distance(p1, am.targetPos);
                            let d2 = MathUtil.distance(p2, am.targetPos);
                            if (d2 < d1) {
                                change = true;
                            }
                        } else {
                            let d1 = MathUtil.distance(p1, am.road[0]);
                            let d2 = MathUtil.distance(p2, am.road[0]);
                            if (d2 < d1) {
                                change = true;
                            }
                        }
                    }
                    if (change) {
                        temCtrl = targets[i] as PveEnemyCtrl
                    }
                    // let c1 = Number.MAX_VALUE;
                    // let b1 = 0;
                    // let c2 = Number.MAX_VALUE;
                    // let b2 = 0;
                    // for (let i = 0, n = r.length; i < n; i++) {
                    //     let d = MathUtil.distance(p1, r[i]);
                    //     if (d < c1) {
                    //         c1 = d;
                    //         b1 = i;
                    //     }
                    // }
                    // for (let i = 0, n = r.length; i < n; i++) {
                    //     let d = MathUtil.distance(p2, r[i]);
                    //     if (d < c2) {
                    //         c2 = d;
                    //         b2 = i;
                    //     }
                    // }
                    // //获得更远的单位
                    // if (b2 > b1 || (b2 == b1 && c2 < c1)) {
                    //     temCtrl = targets[i] as PveEnemyCtrl
                    // }
                }
            }
        }
        if (temCtrl != null) {
            fightId = temCtrl.model.fightId;
        }
        return fightId;
    }


    //获取目标身上特定buff的层数
    get_target_buffStacking(target_id: number, buffId: number): number {
        let num = 0;
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {
            target.model.buffs.some(b => {
                if (b.id == buffId) {
                    num = b.stacking;
                    return true;
                }
            });
        }
        return num;
    }

    /**
     * 创建召唤物
     * @param attacker_id 施法者ID
     * @param target_id 目标ID
     * @param call_id 召唤物ID
     * @param call_num 召唤物数量
     * @param call_time 召唤物时间
     */
    CreateCall(attacker_id: number, target_id: number, call_id: number, call_num: number, call_time: number, removeCall: boolean = false) {

        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        let attacker = sceneModel.getFightBy(attacker_id);
        if (!target || !target.isAlive) return;
        if (!attacker || !attacker.isAlive) return;
        let c = PveTool.getSkillCallConfig(call_id, attacker.model.prop.level);
        let pos = target.getPos();//this.getToPos(index);
        let num = call_num;
        switch (c.ai) {
            case PveCalledAIType.OPPONENT_CALLED:
            case PveCalledAIType.OPPONENT_CALLED_NOEFFECT:
                // 竞技模式在对手场景添加召唤物，使用不同的PveSceneModel实现
                let arenaSyncData = sceneModel.arenaSyncData;
                sceneModel = sceneModel.isMirror ? arenaSyncData.mainModel : arenaSyncData.mirrorModel

            case PveCalledAIType.CALLED:
                // 召唤物
                if (removeCall && PveTool.hasCalled(sceneModel, attacker.model, call_id)) {
                    sceneModel.removeCall(attacker, call_id);
                }
                for (let i = 0; i < num; i++) {
                    PveFightUtil.createCaller(
                        sceneModel,
                        c.monster,
                        call_time,
                        {
                            ai: c.ai,
                            call_id: call_id,
                            owner: attacker,
                            pos: pos,
                            index: i,
                            total: num
                        },
                    );
                }
                break;

            case PveCalledAIType.MONSTER:
                // 怪物
                PveFightUtil.createEnemyBy(
                    attacker,
                    num,
                    c.monster,
                    pos,
                );
                break;

            case PveCalledAIType.TRAP:
                // 陷阱
                for (let i = 0; i < num; i++) {
                    PveFightUtil.createTrap(
                        sceneModel,
                        c.monster,
                        call_time,
                        pos,
                        attacker,
                    );
                }
                break;

            case PveCalledAIType.GATE:
                // 传送阵
                for (let i = 0; i < num; i++) {
                    PveFightUtil.createGate(
                        sceneModel,
                        'dynamic_' + c.monster,
                        c.monster,
                        call_time,
                        pos,
                        attacker,
                        c.args,
                    );
                }
                break;
        }
    }

    /**
     * 目标是否存在指定召唤物
     * @param attacker_id 
     * @param call_id 
     */
    hasCaller(attacker_id: number, call_id: number): boolean {
        let sceneModel = this.sceneModel;
        let attacker = sceneModel.getFightBy(attacker_id);
        if (!attacker || !attacker.isAlive) return;
        return PveTool.hasCalled(sceneModel, attacker.model, call_id);
    }

    /**
     * 移除目标指定召唤物
     * @param attacker_id 
     * @param call_id 
     */
    removeCaller(attacker_id: number, call_id: number) {
        let sceneModel = this.sceneModel;
        let attacker = sceneModel.getFightBy(attacker_id);
        if (!attacker || !attacker.isAlive) return;
        sceneModel.removeCall(attacker, call_id);
    }

    //判断目标是否是boss
    get_monster_isBoss(target_id: number): boolean {
        let type = false;
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        // 寻找离施法者最近的点做为路径起点
        if (target.model.type === PveFightType.Enemy) {
            let tm: PveEnemyModel = target.model as PveEnemyModel;
            if (tm.config.color == 12) {
                type = true;
            }
        }
        return type;
    }

    //投掷硬币
    throwCoin(target_id: number, times: number, mark_buffId: number, add_buffId: number) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (!target || !target.isAlive) return;
        let result = false;
        for (let i = 0; i < times - 2; i++) {
            let tem = MathUtil.rate(0.5);
            if (tem) {
                result = true;
                PveTool.addBuffsTo(
                    target_id,
                    target.model.prop,
                    target,
                    mark_buffId,
                    999,
                    null,
                );
                //cc.log(i + 1 + '-----------------------投掷硬币为正面')
            }
        }
        if (result) {
            PveTool.addBuffsTo(
                target_id,
                target.model.prop,
                target,
                add_buffId,
                999,
                null,
            );
            //cc.log('-----------------------添加大成功buff----------')
        }
    }




    /**
     * 击退目标一段距离
     * @param attacker_id 
     * @param target_id 
     * @param dis 
     * @param time 
     */
    repelTargetByDistance(attacker_id: number, target_id: number, dis: number, time: number) {
        let sceneModel = this.sceneModel;
        // let attacker = sceneModel.getFightBy(attacker_id);
        // if (!attacker || !attacker.isAlive) return;
        let target = sceneModel.getFightBy(target_id);
        if (!target || !target.isAlive) return;

        //击退免疫
        if (target.model.getProp('invisible_repel')) {
            return;
        }

        if (target.model.type != PveFightType.Enemy) {
            return;
        }
        let m: PveEnemyModel = target.model as PveEnemyModel;
        let r = sceneModel.tiled.roads[m.roadIndex];
        let p = target.getPos();
        let c = Number.MAX_VALUE;
        let b = 0;
        for (let i = 0, n = r.length; i < n; i++) {
            let d = MathUtil.distance(p, r[i]);
            if (d < c) {
                c = d;
                b = i;
            }
        }
        let temPos = r[b];
        if (b > 0) {
            //let temPos = r[b];
            let temDis = dis;
            for (let i = b - 1; i >= 0; i--) {
                let dis = MathUtil.distance(temPos, r[i])
                if (dis < temDis) {
                    temPos = r[i];
                    temDis -= dis;
                } else {
                    let tem = cc.v2(r[i].x - temPos.x, r[i].y - temPos.y).normalize().mulSelf(temDis);
                    temPos = cc.v2(temPos.x + tem.x, temPos.y + tem.y);
                    break;
                }
            }
        }
        let pos = temPos;
        //target.model.prop.speed = 0;
        let action = cc.speed(
            cc.sequence(
                cc.moveTo(time, pos),
                cc.callFunc((node: cc.Node, ctrl: PveFightCtrl) => {
                    let m: PveEnemyModel = ctrl.model as PveEnemyModel;
                    let r = sceneModel.tiled.roads[m.roadIndex];
                    let p = ctrl.getPos();
                    let c = Number.MAX_VALUE;
                    let b = 0;
                    for (let i = 0, n = r.length; i < n; i++) {
                        let d = MathUtil.distance(p, r[i]);
                        if (d < c) {
                            c = d;
                            b = i;
                        }
                    }
                    m.road = r.slice(b);
                    m.targetPos = null;
                    m.speedScale = 1;
                    //m.prop.speed = m.config.speed
                }, this, target),
            ),
            sceneModel.timeScale
        );
        target.model.speedScale = 0;
        target.node.runAction(action);

    }

    /**
     * 清除目标身上一个类型的buff
     * @param target_id 
     * @param type 
     * @param rate 
     */
    removeTargetBuffByType(target_id: number, type: number, num: number = 1) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (!target || !target.isAlive) return;
        let r: PveBuffModel[] = [];
        target.model.buffs.forEach(b => {
            if (b.config.type == type) {
                r.push(b)
            }
        });
        for (let i = 0; i < num; i++) {
            if (r.length != 0) {
                let tem = FightingMath.rnd(0, r.length - 1)
                tem = Math.min(tem, r.length - 1)
                this.remove_buff_id(target_id, r[tem].id, 0)
                r.splice(tem, 1);
            } else {
                break;
            }
        }

    }

    /**
     * 清除所有(或随机一个)该目标类型身上一个类型的buff
     * @param target_type 
     * @param target_id 
     * @param type 
     * @param rate 
     */
    removeTargetTypeBuffByType(target_type: number, type: number, buff_id: number, buff_time: number, rate: boolean = true) {
        let targets = this.get_target_type(target_type, 0);
        let tem = [];
        targets.forEach(t => {
            if (!rate) {
                this.removeTargetBuffByType(t.model.fightId, type)
                this.add_buff(t.model.fightId, buff_id, buff_time)
            } else {
                let num = this.get_buffType_num(t.model.fightId, type)
                if (num > 0) {
                    tem.push(t);
                }
            }
        })
        if (rate) {
            if (tem.length > 0) {
                let temNum = FightingMath.rnd(0, tem.length - 1)
                temNum = Math.min(temNum, tem.length - 1)
                this.removeTargetBuffByType(tem[temNum].model.fightId, type)
                this.add_buff(tem[temNum].model.fightId, buff_id, buff_time)
            }
            else if (targets.length > 0) {
                let temNum = FightingMath.rnd(0, targets.length - 1)
                temNum = Math.min(temNum, targets.length - 1)
                this.add_buff(targets[temNum].model.fightId, buff_id, buff_time)
            }
        }
    }

    /**
     * 获取目标buff护盾当前的护盾值
     * @param target_id 
     * @param buff_id 
     */
    getTargetBuffShieldNum(target_id: number, buff_id: number): number {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (!target || !target.isAlive) return;
        let value = 0;
        let buffShield = target.model.buffShield;
        if (buffShield.length > 0) {
            for (let i = 0; i < buffShield.length; i++) {
                if (buffShield[i].buffId == buff_id) {
                    value = buffShield[i].shiedNum;
                    break;
                }
            }
        }
        return value;
    }

    /**
     * 打断目标当前处于施法状态的技能
     * @param target_id 
     */
    stopTargetCurSkill(target_id: number) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (!target || !target.isAlive) return;
        if (target.model.getProp('stopCurSkillMark') == true) {
            return;
        }
        sceneModel.skills.forEach(skill => {
            if (skill.model.attacker_id == target_id) {
                //skill.fsm.activeState
                if (skill.fsm.activeStateName == 'ATK_Animation') {
                    skill.fsm.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
                }
            }
        })
    }

    /**
     * 血量小于一定百分比则返回一次true
     * @param target_id 目标id
     * @param blood     血量百分比
     * @param buff_id   标记buff id
     */
    get_target_reduceBlood(target_id: number, blood: number, buff_id: number): boolean {
        let result = false;
        let stack = this.get_target_buffStacking(target_id, buff_id);
        let target = this.sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {
            let tm = target.model;
            let bloodNum = Math.floor(tm.hpMax * blood / 100);
            let reduceNum = Math.floor((tm.hpMax - tm.hp) / bloodNum);
            if (reduceNum > stack) {
                this.add_buff_by(target_id, target_id, buff_id, 9999);
                result = true;
            }
        }
        return result;
    }

    /**
     * 血量小于一定百分比则返回一次true(会根据血量损失的层数设置buff层数)
     * @param target_id 目标id
     * @param blood     血量百分比
     * @param buff_id   标记buff id
     */
    get_target_reduceBlood2(target_id: number, blood: number, buff_id: number): boolean {
        let result = false;
        let stack = this.get_target_buffStacking(target_id, buff_id);
        let target = this.sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {
            let tm = target.model;
            let bloodNum = Math.floor(tm.hpMax * blood / 100);
            let reduceNum = Math.floor((tm.hpMax - tm.hp) / bloodNum);
            if (reduceNum != stack) {
                //this.add_buff_by(target, target, buff_id, 999);
                this.set_target_buff_stacking(target_id, target_id, buff_id, 9999, reduceNum)
                result = true;
            }
        }
        return result;
    }


    /**
     * 创建一个弹道特效
     * @param start_id 
     * @param end_id 
     * @param skin 
     * @param animationName 
     * @param speed 
     */
    create_moveSpine_toTarget(start_id: number, end_id: number, skin: string, animationName: string, speed: number, buff_id?: number, buff_time?: number) {
        let m = this.sceneModel;
        let start = m.getFightBy(start_id);
        let end = m.getFightBy(end_id);
        if (!start && !start.isAlive) return;
        if (!end && !end.isAlive) return;
        let url = `spine/skill/${skin}/${skin}`;
        //let res = gdk.rm.getResByUrl(url as string, sp.SkeletonData);

        let resId = gdk.Tool.getResIdByNode(m.ctrl.effect);
        let res: sp.SkeletonData = gdk.rm.getResByUrl(url, sp.SkeletonData, resId);
        if (!res) {
            gdk.rm.loadRes(resId, url, sp.SkeletonData, (tem: sp.SkeletonData) => {
                res = tem
            })
        }
        let n: cc.Node = PvePool.get(m.ctrl.spineNodePrefab);
        let streak = n.getComponentInChildren(cc.MotionStreak);
        streak.node.active = false;
        let s = n.getComponent(sp.Skeleton);
        n.zIndex = 0;
        n.parent = m.ctrl.effect;
        n.setPosition(start.getPos());
        s.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
        s.enableBatch = true;
        s.skeletonData = res;
        s.paused = false;
        s.node.active = true;
        s.loop = true;
        s.animation = animationName;
        s.timeScale = Math.max(1, m.timeScale);

        let dt = MathUtil.distance(start.getPos(), end.getPos()) / speed;
        let endPos = end.getPos(dt)
        let action = cc.speed(
            cc.sequence(
                cc.fadeIn(0),
                cc.spawn(
                    cc.moveTo(dt, endPos),
                    cc.callFunc((node: cc.Node, end: cc.Vec2) => {
                        let from = node.getPos();
                        let angle = Math.atan2(from.y - end.y, from.x - end.x);
                        let degree = angle * 180 / Math.PI;
                        n.angle = -(degree <= 0 ? -degree : 360 - degree);
                    }, n, endPos),
                ),
                cc.callFunc((node: cc.Node, spine: sp.Skeleton) => {
                    PveTool.clearSpine(spine);
                    PvePool.put(node);
                    if (buff_id) {
                        this.add_buff_by(start_id, end_id, buff_id, buff_time);
                    }
                }, n, s)
            ),
            m.timeScale
        );
        n.runAction(action);
    }

    //在目标位置创建一个特效
    create_Spine_toTarget(target_id: number, type: number, skin: string, animationName: string, time: number) {
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        if (!target && !target.isAlive) return;
        let url = `spine/skill/${skin}/${skin}`;
        let resId = gdk.Tool.getResIdByNode(m.ctrl.effect);
        let res: sp.SkeletonData = gdk.rm.getResByUrl(url, sp.SkeletonData, resId);
        if (!res) {
            gdk.rm.loadRes(resId, url, sp.SkeletonData, (tem: sp.SkeletonData) => {
                res = tem
            })
        }
        let n: cc.Node = PvePool.get(m.ctrl.spineNodePrefab);
        let streak = n.getComponentInChildren(cc.MotionStreak);
        streak.node.active = false;
        let s = n.getComponent(sp.Skeleton);
        n.zIndex = 0;
        n.parent = m.ctrl.effect;
        let pos = target.getPos()
        switch (type) {
            case 1:
                //脚底
                //pos = target.getPos()
                break;
            case 2:
                //中心
                pos = PveTool.getCenterPos(target.getPos(), target.getRect());
                break;
            case 3:
                //头顶
                let r = target.getRect()
                pos = cc.v2(Math.ceil(pos.x), Math.ceil(pos.y + r.height + r.y))
                break;
        }
        n.setPosition(pos);
        s.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
        s.enableBatch = true;
        s.skeletonData = res;
        s.paused = false;
        s.node.active = true;
        s.loop = true;
        s.animation = animationName;
        s.timeScale = Math.max(1, m.timeScale);
        let action = cc.speed(
            cc.sequence(
                cc.fadeIn(0),
                cc.delayTime(time),
                cc.callFunc((node: cc.Node, spine: sp.Skeleton) => {
                    PveTool.clearSpine(spine);
                    PvePool.put(node);
                }, n, s)
            ),
            m.timeScale
        );
        n.runAction(action);
    }


    /**
     * 获取对象的所有召唤物
     * @param sceneModel 
     * @param model 
     */
    getCallList(target_id: number): PveCalledCtrl[] {
        let list: PveCalledCtrl[] = []
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {
            let n: number = sceneModel.calleds.length;
            let o: number = target.model.fightId;
            for (let i = 0; i < n; i++) {
                // 查询场景中召唤物的owner是否为model.ctrl
                let m = sceneModel.calleds[i].model;
                if (m.owner_id === o) {
                    list.push(sceneModel.calleds[i])
                }
            }
        }
        return list;
    }

    //目标是否是守卫或者召唤物
    isGuardOrCall(target_id: number): boolean {
        let res = false;
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {
            let tm = target.model;
            if (tm.type == PveFightType.Hero) {
                let hero = tm as PveHeroModel;
                res = hero.soldierType == 4
            } else {
                if (tm.config.type == 4 || tm.type == PveFightType.Call) {
                    let temp = tm.config.hate_num;
                    if (cc.js.isNumber(temp) && temp > 0) {
                        res = true;
                    }
                }
            }
        }
        return res;
    }

    //是否是守卫英雄
    isGuard(target_id: number): boolean {
        let res = false;
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {
            let tm = target.model;
            if (tm.type == PveFightType.Hero) {
                let hero = tm as PveHeroModel;
                res = hero.soldierType == 4
            }
        }
        return res;
    }

    _distance(a: cc.Vec2, b: cc.Vec2) {
        let xx: number = a.x - b.x;
        let yy: number = a.y - b.y;
        return xx * xx + yy * yy;
    }

    //怪物死亡
    monster_die(target_id: number) {
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(target_id);
        if (target && target.isAlive) {
            target.model.hp = 0;
        }
    }
    // 跳过守卫方法
    JumpGuard(targetId: number, monsterId: number, anim1: string, anim2: string, skillId?: number, time?: number) {
        let sceneModel = this.sceneModel;
        let attack = sceneModel.getFightBy(targetId) as PveCalledCtrl | PveHeroCtrl;
        let target = sceneModel.getFightBy(monsterId) as PveEnemyCtrl;
        if (!target || !target.isAlive) return;
        if (!attack || !attack.isAlive) return;
        // 坐标
        let range = 0;
        let temPos: cc.Vec2;
        if (attack instanceof PveCalledCtrl) {
            // 召唤物
            range = attack.model.ownerRange + 50;
            range = range * range;
            temPos = attack.model.ownerPos;
        } else {
            // 守卫英雄
            range = attack.model.range + 50;
            range = range * range;
            temPos = attack.getPos();
        }
        // 找出不在英雄攻击范围内的点
        let temRoads = sceneModel.tiled.roads[target.model.roadIndex];
        let len = temRoads ? temRoads.length : 0;
        if (len < 1) {
            // 数据异常，跳过守卫失败
            return;
        }
        let pos = temRoads[len - 1];
        for (let i = len - 2; i >= 0; i--) {
            let dis = this._distance(temPos, temRoads[i]);
            if (dis <= range) {
                break;
            }
            pos = temRoads[i];
        }
        if (!pos) {
            // 找不到合适的目的坐标，跳过守卫失败
            return;
        }
        target.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_BEGIN_CUSTOM);
        let n = target.node;
        target.setAnimation(anim1, {
            mode: 'set', loop: false, onComplete: () => {
                target.setAnimation(anim2, { mode: 'set', loop: false });

                let action = cc.speed(
                    cc.sequence(
                        cc.fadeIn(0),
                        cc.spawn(
                            cc.moveTo(1.5, pos),
                            cc.callFunc((node: cc.Node, end: cc.Vec2) => {
                                let from = node.getPos();
                                let angle = Math.atan2(from.y - end.y, from.x - end.x);
                                let degree = angle * 180 / Math.PI;
                                n.angle = -(degree <= 0 ? -degree : 360 - degree);
                            }, n, pos),
                        ),
                        cc.callFunc(() => {
                            // 激活技能
                            if (skillId) {
                                let cd = time ? time : 0
                                target.model.resetSkillIndeCd(skillId, cd, 0);
                            }
                            target.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_END_CUSTOM);
                            target.model.road = PveRoadUtil.getShortestRoadBy(target.getPos(), temRoads);
                            target.model.targetPos = null;
                            target.node.angle = 0;
                            // 透明度变0
                            target.node.opacity = 0;
                        }),
                    ),
                    sceneModel.timeScale
                );
                target.node.runAction(action);
            }
        });
    }

    /**
     * 禁止指挥官技能一段时间
     * @param time 时间(单位毫秒)
     */
    stopGeneralSkill(time: number, fightId: number = 0) {

        gdk.e.emit(PveEventId.PVE_STOP_GENERAL_SKILL, [true, time, fightId])
        // gdk.Timer.once(time, this, () => {
        //     gdk.e.emit(PveEventId.PVE_STOP_GENERAL_SKILL, [false])
        // })
    }

    /**
     * 获取场景中目标士兵类型的英雄
     */
    getSceneSolarTypeHero(type: number): PveFightCtrl[] {
        let res: PveFightCtrl[] = []
        let sceneModel = this.sceneModel;
        let n: number = sceneModel.heros.length;
        for (let i = 0; i < n; i++) {
            // 查询场景中召唤物的owner是否为model.ctrl
            let m = sceneModel.heros[i].model;
            if (m.soldierType == type) {
                res.push(sceneModel.heros[i])
            }
        }
        return res;
    }

    //获取目标距离比例
    getTargetDistance(attack_id: number, target_id: number, maxRange: number, arg: number): number {
        let res = 0;
        let sceneModel = this.sceneModel;
        let attack = sceneModel.getFightBy(attack_id)
        let target = sceneModel.getFightBy(target_id)
        if (!target || !target.isAlive) return res;
        if (!attack || !attack.isAlive) return res;

        let dis = this._distance(attack.getPos(), target.getPos());
        res = Math.min(1, dis / (maxRange * maxRange)) * arg;
        return res;
    }

    //获取离终点最近的英雄
    getEndPosHero(): PveFightCtrl {
        let res: PveFightCtrl = null
        let sceneModel = this.sceneModel;
        let n: number = sceneModel.heros.length;
        let minDis = 0;
        let pro = sceneModel.proteges[0];
        if (!pro) return res;
        for (let i = 0; i < n; i++) {
            // 查询场景中召唤物的owner是否为model.ctrl
            let hero = sceneModel.heros[i];
            let dis = this._distance(hero.getPos(), pro.node.getPos())
            if (minDis == 0 || dis < minDis) {
                minDis = dis;
                res = hero
            }
        }
        return res;
    }

    /**
     * 指挥官神器技能减CD
     * @param cd 
     */
    GeneralWeaponReduceCd(cd: number) {
        gdk.e.emit(PveEventId.PVE_REDUCE_GENERALWEAPON_SKILLCD, cd)
    }

    /**切换目标怪物的行动路线 */
    changeMonsterRode(target_id: number, rodeIndex) {
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        if (!target && !target.isAlive) return;
        let enemyModel: PveEnemyModel = target.model as PveEnemyModel;
        let r = m.tiled.roads[rodeIndex];
        let roles: cc.Vec2[] = [];
        let p = target.getPos();
        let c = Number.MAX_VALUE;
        let b = 0;
        for (let i = 0, n = r.length; i < n; i++) {
            let d = MathUtil.distance(p, r[i]);
            if (d < c) {
                c = d;
                b = i;
            }
        }
        roles = r.slice(0, b);
        roles.reverse();
        enemyModel.road = roles
        enemyModel.roadIndex = rodeIndex;
        enemyModel.targetPos = enemyModel.road.shift();
    }


    /**
     * 获取增加的属性
     * @param target_id 
     * @param name 属性名称
     * @param type 0 低于 2 高于
     * @param addNum 0.1 百分比 
     * @returns 
     */
    get_targets_addAtk(target_id: number, targets: PveFightCtrl[], name: string, type: number, addNum: number): number {
        let add = 0;
        let m = this.sceneModel;
        let target = m.getFightBy(target_id);
        if (!target && !target.isAlive) return;
        if (targets.length > 0) {
            targets.forEach(ctrl => {
                if (type == 0) {
                    if (ctrl.model.prop[name] <= target.model.prop[name]) {
                        add += ctrl.model.prop.atk * addNum
                    }
                } else {
                    if (ctrl.model.prop[name] >= target.model.prop[name]) {
                        add += ctrl.model.prop.atk * addNum
                    }
                }
            })
        }
        return Math.floor(add);
    }

    /**
     * 神器技能龙卷风效果
     * @param start_id 
     * @param end_id 
     * @param skin 
     * @param animationName 
     * @param speed 
     */
    create_WeaponSkill_moveSpine(
        attack_id: number,
        start_id: number,
        skin: string,
        animationName: string,
        trap_id: number,
        speed: number,
        buff_id: number,
        checkNum: number,
        end_trap_id?: number,
        end_trap_time?: number,
    ) {
        let m = this.sceneModel;
        let start = m.getFightBy(start_id);
        let attack = m.getFightBy(attack_id);
        if (!start && !start.isAlive) return;
        if (!attack && !attack.isAlive) return;
        let url = `spine/skill/${skin}/${skin}`;
        //let res = gdk.rm.getResByUrl(url as string, sp.SkeletonData);



        // let resId = gdk.Tool.getResIdByNode(m.ctrl.effect);
        // let res: sp.SkeletonData = gdk.rm.getResByUrl(url, sp.SkeletonData, resId);
        // if (!res) {
        //     gdk.rm.loadRes(resId, url, sp.SkeletonData, (tem: sp.SkeletonData) => {
        //         res = tem
        //         s.skeletonData = res;
        //         s.animation = animationName;
        //     })
        // }

        let n: cc.Node = PvePool.get(m.ctrl.spineNodePrefab);
        let streak = n.getComponentInChildren(cc.MotionStreak);
        streak.node.active = false;
        let s = n.getComponent(sp.Skeleton);
        GlobalUtil.setSpineData(m.ctrl.effect, s, url, true, animationName, true)
        n.zIndex = 0;
        n.parent = m.ctrl.effect;
        n.setPosition(start.getPos());
        // s.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
        // s.enableBatch = false;
        // s.skeletonData = res;
        // s.paused = false;
        s.node.active = true;
        s.node.opacity = 255;
        s.node.scale = 1;
        // s.loop = true;
        // s.animation = animationName;
        s.timeScale = Math.max(1, m.timeScale);

        let roles: cc.Vec2[] = []

        let enemyModel: PveEnemyModel = start.model as PveEnemyModel;
        let r = m.tiled.roads[enemyModel.roadIndex];
        let p = start.getPos();
        let c = Number.MAX_VALUE;
        let b = 0;
        for (let i = 0, n = r.length; i < n; i++) {
            let d = MathUtil.distance(p, r[i]);
            if (d < c) {
                c = d;
                b = i;
            }
        }
        roles = r.slice(0, b);
        roles.reverse();

        let temStartPos: cc.Vec2 = start.getPos();
        // let dt = MathUtil.distance(start.getPos(), end.getPos()) / speed;
        // let endPos = end.getPos(dt)
        let temactions: cc.FiniteTimeAction[] = []
        for (let i = 0; i < roles.length; i++) {
            let temCall = cc.callFunc((node: cc.Node, attack: any) => {
                //thisArg.add_trap_by(attack_id, trap_id, 1, 1, attack_id, 1, end.x, end.y);
                PveFightUtil.createTrap(
                    m,
                    trap_id,
                    1,
                    node.getPos(),
                    attack,
                );
            }, n, attack)
            temactions.push(temCall);
            let endPos = roles[i]
            let dt = MathUtil.distance(temStartPos, endPos) / (speed * m.timeScale);
            let tem = cc.spawn(
                cc.moveTo(dt, roles[i]),
                // cc.callFunc((node: cc.Node, end: cc.Vec2) => {
                //     let from = node.getPos();
                //     let angle = Math.atan2(from.y - end.y, from.x - end.x);
                //     let degree = angle * 180 / Math.PI;
                //     n.angle = -(degree <= 0 ? -degree : 360 - degree);
                // }, n, endPos),
                cc.callFunc((node: cc.Node, m: PveSceneModel) => {
                    //let temNum = thisArg.get_buff_allTarget(buff_id).length;
                    let res = 0
                    if (attack.model.type == PveFightType.Genral) {
                        let all = m.generals;
                        for (const key in all) {
                            all[key].model.buffs.some(b => {
                                if (b.id == buff_id) {
                                    res += b.stacking;
                                    return true;
                                }
                                return false;
                            });
                        }
                    } else if (attack.model.type == PveFightType.Hero) {
                        attack.model.buffs.some(b => {
                            if (b.id == buff_id) {
                                res += b.stacking;
                                return true;
                            }
                            return false;
                        });
                    }

                    if (res >= checkNum) {
                        n.stopAllActions();
                        // 结束时召唤陷阱
                        if (cc.js.isNumber(end_trap_id) && end_trap_id > 0 && cc.js.isNumber(end_trap_time) && end_trap_time > 0) {
                            PveFightUtil.createTrap(
                                m,
                                end_trap_id,
                                end_trap_time,
                                node.getPos(),
                                attack,
                            );
                        }
                        // 销毁节点
                        let spine: sp.Skeleton = node.getComponent(sp.Skeleton);
                        PveTool.clearSpine(spine);
                        PvePool.put(node);
                    }
                }, n, m),
            )
            temactions.push(tem);
            temStartPos = roles[i];
        }
        let action = cc.speed(
            cc.sequence(
                cc.fadeIn(0),
                ...temactions,
                cc.callFunc((node: cc.Node, m: PveSceneModel) => {
                    // 结束时召唤陷阱
                    if (cc.js.isNumber(end_trap_id) && end_trap_id > 0 && cc.js.isNumber(end_trap_time) && end_trap_time > 0) {
                        PveFightUtil.createTrap(
                            m,
                            end_trap_id,
                            end_trap_time,
                            node.getPos(),
                            attack,
                        );
                    }
                    // 销毁节点
                    let spine: sp.Skeleton = node.getComponent(sp.Skeleton);
                    PveTool.clearSpine(spine);
                    PvePool.put(node);
                }, n, m)
            ),
            m.timeScale
        );
        n.runAction(action);
    }

    /**
     * 执行表达式
     * @param attacker
     * @param target
     * @param key 
     * @param scope 
     * @param config
     */
    static eval(
        attacker: PveFightCtrl,
        target: PveFightCtrl,
        key: string,
        scope: PveBSScopeType,
        config?: any
    ) {
        if (!key || key == '') return;
        let expr = FightingMath.getConfigExprEval(key, config);
        if (!expr) {
            return;
        }
        // 注入通用方法
        let thiz = PvePool.get(PveBSExprUtils) as PveBSExprUtils;
        let ret: any;
        // 设置参数
        thiz.attacker = attacker;
        thiz.target = target;
        thiz.scope = scope;
        // 使用mathjs方式执行
        if (expr instanceof Function) {
            let __proto__ = scope['__proto__'];
            scope['__proto__'] = thiz;
            // 计算表达式
            ret = expr(scope || {}, {}, null);
            // 删除通用属性
            Object.keys(this).forEach(n => {
                delete scope[n];
            });
            scope['__proto__'] = __proto__;
            // 删除临时的中间变量
            for (let i = 1; ; i++) {
                let n = 'TEMP' + i;
                if (n in scope) {
                    delete scope[n];
                } else {
                    break;
                }
            }
        } else {
            // 使用jit优化方式计算表达式
            ret = expr.eval(thiz, scope || {});
        }
        // 清除参数
        thiz.attacker = null;
        thiz.target = null;
        thiz.scope = null;
        PvePool.put(thiz);
        // 返回结果
        return ret;
    }
}