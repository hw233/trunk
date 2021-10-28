import ErrorUtils from '../../../common/utils/ErrorUtils';
import FightingMath from '../../../common/utils/FightingMath';
import PveBSExprUtils, { PveBSScopeType } from '../utils/PveBSExprUtils';
import PveBuffModel from './PveBuffModel';
import PveFightModel, { PveCampType, PveFightType } from '../core/PveFightModel';
import PveHaloModel from './PveHaloModel';
import PveTool from '../utils/PveTool';
import StringUtils from '../../../common/utils/StringUtils';
import { CopyType } from './../../../common/models/CopyModel';
import { PveFightCtrl } from '../core/PveFightCtrl';
import { PveSkillListener } from './PveSkillModel';
import { PveSkillType } from '../const/PveSkill';
import { SkillCfg } from '../../../a/config';

/**
 * Pve场景战斗单元基础数据模型
 * @Author: sthoo.huang
 * @Date: 2019-05-14 14:44:55
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-19 11:21:13
 */

export class PveFightSkill {

    id: number;     // 技能ID
    lv: number;     // 技能等级
    cd: number;     // 冷却
    init_cd: number;
    cd_type: number; // 冷却方式
    ext: PveFightSkill[];   // 强化技能列表
    model: PveFightModel;   // 所有对象的数据模型
    config: SkillCfg;   // 技能配置表


    // 技能类型
    get type() {
        return this.baseProp.type;
    }

    // 目标类型
    get targetType() {
        return this.prop.target_type;
    }

    // 范围
    get range() {
        let r = this.prop.range;
        let prop = this.model.getProp('range_' + this.id);
        if (prop > 0) {
            r += prop;
        }
        if (r < 1 || cc.js.isString(r)) {
            return 0;
        }
        return r;
    }

    // 原始属性
    get baseProp(): SkillCfg {
        if (!this.config) {
            this.config = PveTool.getSkillCfg(this.id, this.lv);
            if (this.config) {
                this.cd_type = this.config.cd_type;
            }
        }
        return this.config;
    }

    // 加成后的属性
    _tempProp: any;
    get prop(): SkillCfg {
        if (this._tempProp) return this._tempProp;
        let baseProp = this.baseProp;
        if (this.ext && this.ext.length > 0) {
            let extProp: any = {};
            for (let i = 0, n = this.ext.length; i < n; i++) {
                let s = this.ext[i];
                let p = s.baseProp;
                switch (s.type) {
                    case 301:
                        // 计算技能表达式，合并计算结果至扩展属性
                        let key: string = p.hurt_expr;
                        if (key && key != '') {
                            // 构建环境变量
                            let sc: PveBSScopeType = {
                                am: this.model,
                                s: baseProp,
                                e: p,
                            };
                            try {
                                PveBSExprUtils.eval(null, null, key, sc);
                            } catch (error) {
                                ErrorUtils.post(`强化技能( id: ${s.id}, lv: ${s.lv} )伤害表达式( ${p.hurt_expr} )配置错误, ${error}`);
                                return;
                            }
                            // 删除不需要的属性
                            delete sc['s'];
                            delete sc['e'];
                            // 合并到临时属性中
                            for (let pn in sc) {
                                extProp[pn] = PveTool.getMergeProp(pn, sc[pn], extProp);
                            }
                        }
                        break;

                    case 302:
                        // 替换原技能所有基础属性（保留技能ID和名称不变），并清除此技能之前301强化的所有属性
                        cc.js.clear(extProp);
                        baseProp = Object['assign'](new SkillCfg(), p);
                        baseProp.skill_id = this.config.skill_id;
                        baseProp.name = this.config.name;
                        baseProp.type = this.config.type;
                        if (!cc.js.isNumber(p.dmg_type) || p.dmg_type > 5) {
                            // 伤害类型大于5时，则只用作UI显示，则不更新当前伤害类型
                            baseProp.dmg_type = this.config.dmg_type;
                        }
                        this.config = baseProp;
                        break;

                    case 303:
                        // 增加原技能表达式公式，复制一份以免修改静态配置文件
                        baseProp = Object['assign'](new SkillCfg(), baseProp);
                        baseProp.hurt_expr += StringUtils.endsWith(baseProp.hurt_expr, ';') ? '' : ';';
                        baseProp.hurt_expr += p.hurt_expr;
                        this.config = baseProp;
                        break;

                    case 304:
                        // 只替换表达式
                        baseProp = Object['assign'](new SkillCfg(), baseProp);
                        baseProp.hurt_expr = p.hurt_expr;
                        this.config = baseProp;
                        break;
                }
            };
            // 复制基础属性
            this._tempProp = Object['assign'](new SkillCfg(), baseProp);
            // 增强属性与初始属性合并
            for (let pn in extProp) {
                this._tempProp[pn] = PveTool.getMergeProp(pn, extProp[pn], this._tempProp);
            }
        } else {
            // 没有增强，则直接等同于基础属性
            this._tempProp = baseProp;
        }
        return this._tempProp;
    }
}

export interface SkillIdLv {
    skillId: number;    // 技能ID
    skillLv: number;    // 技能等级
}

class SkillCdItem {
    cd: number; // 当前技能CD
    skills: { [id: number]: PveFightSkill } = cc.js.createMap(true);

    inde_cd: number;
    // 基准技能
    _first: PveFightSkill;
    get first() {
        if (!this._first) {
            for (let id in this.skills) {
                let s = this.skills[id];
                if (s.cd_type == s.id) {
                    this._first = s;
                    break;
                }
                // 容错，当所有技能中不存在skill_id和cd_type一致的技能时
                if (s.cd > 0) {
                    this._first = s;
                }
            }
        }
        return this._first;
    }

    update(dt: number, model: PveBaseFightModel) {

        let tm = dt;
        if (this.inde_cd <= 0) {
            tm = dt * model.speedScale;
        }

        if (this.inde_cd > 0) {
            this.inde_cd -= tm;
        }

        if (this.cd > 0) {
            //(403普攻不受攻速影响)
            if (PveSkillType.isNormal(this.first.type) && this.first.type != 403) {
                // 攻速只针对普攻有效
                this.cd -= tm * model.atkSpeed;
            } else {
                this.cd -= tm;
            }
            for (let id in this.skills) {
                let s = this.skills[id];
                s.cd = this.cd;
            }
        }

    }

    reset() {

        this.cd = this.first.prop.cd;
        //判断是否是主动技能前拥有者有延长技能冷却时间的字段
        if (PveSkillType.isAutoTDSkill(this.first.type) && this.first.model.getProp('add_autoSkill_cd')) {
            let num = 1 + this.first.model.getProp('add_autoSkill_cd')
            this.cd = Math.floor(this.cd * num);
        }

        for (let id in this.skills) {
            let s = this.skills[id];
            s.cd = this.cd;
        }
    }

    reduce(cd?: number) {
        if (cd === void 0) {
            this.cd = 0
        } else {
            this.cd -= cd;
        }
        for (let id in this.skills) {
            let s = this.skills[id];
            s.cd = this.cd;
        }
    }

    // 设置技能cd为特定的值
    resetCDTime(cd: number) {
        this.cd = cd;
        for (let id in this.skills) {
            let s = this.skills[id];
            s.cd = this.cd;
        }
    }
    // 设置技能inde_cd为特定的值
    resetIndeCDTime(cd: number) {
        this.inde_cd = cd;
        // for (let id in this.skills) {
        //     let s = this.skills[id];
        //     s.cd = this.cd;
        // }
    }
}

let _FID: number = 0;
function getFightId(): number {
    if (_FID == Number.MAX_VALUE) {
        _FID = 0;
    }
    return ++_FID;
};

export interface ShiedBuffData {
    buffId: number;    // buff ID
    shiedNum: number;    // 护盾数值
}

export class PveBaseFightModel implements PveFightModel {

    loaded: boolean;
    ctrl: PveFightCtrl;
    camp: PveCampType;  // 阵营
    type: PveFightType; // 类型
    dir: number;    // 方向
    animation: string;  // 当前动作
    config: any;    // 静态配置
    hp: number; // 当前生命值
    hpMax: number;  // 生命值上限
    shield: number;  // 护盾
    buffShield: ShiedBuffData[] = [];  // buff护盾
    speedScale: number = 1.0;   // 速度缩放比例，例如加速号角
    speedScaleDirty: boolean = false;    // 速度缩放是否有修改
    nodeScale: number = 0;  // 节点缩放附加值
    currSkill: PveFightSkill;    // 当前使用的技能
    targetId: number;   // 攻击目标id
    attackable: boolean;
    buffs: PveBuffModel[] = [];
    halos: PveHaloModel[] = [];
    skillCds: { [cd_type: number]: SkillCdItem }; // 技能CD
    lastDamageType: number = 0;  // 最后的伤害类型（被攻击）
    double_hit: number;  // 连击次数，攻击同一个目标的计数
    countinue_hit: number;   // 连续攻击次数
    listeners: number[] = []; // 技能监听器
    customState: boolean = false;   // 是否在自定义状态
    startPos: cc.Vec2;
    lastLogicalTime: number = -1;

    init() {
        this.currSkill = null;
        this.targetId = -1;
        this.speedScale = 1.0;
        this.double_hit = 0;
        this.countinue_hit = 0;
        this.nodeScale = 0;
        this.skillCds = null;
        this._ready = false;
        this._skills = null;
        this._skillIdx = null;
        this._skillValues = null;
        this.startPos = null;
        this.listeners.forEach(lid => {
            PveSkillListener.clearBy(lid);
        });
        this.listeners.length = 0;
        this.shield = 0;
        this.buffShield = [];
        this.lastLogicalTime = -1;
    }

    /** 战斗对象ID，每场个战斗对象独立 */
    _fightId: number = -1;
    get fightId() {
        if (this._fightId < 0) {
            this._fightId = getFightId();
        }
        return this._fightId;
    }

    /** 数据完整状态 */
    _ready: boolean;
    get ready() {
        return this._ready;
    }

    set ready(v: boolean) {
        this._ready = v;
        if (v) {
            this.hpMax = Math.max(1, this.getProp('hp'));
        }
    }

    get id() {
        return 0;
    }

    get skin() {
        return this.getProp('skin') as string;
    }

    get size() {
        let scale: number = 1;
        if (cc.js.isNumber(this.config.size)) {
            scale = this.config.size;
            scale = Math.max(0.1, scale);
        }
        return scale;
    }

    /** 基础属性 */
    _baseProp: any;
    _basePropTarget: any;
    get baseProp() {
        if (!this._baseProp) {
            this._basePropTarget = Object['assign']({}, this.config);
            this._baseProp = PveTool.getProxyObj(this._basePropTarget);
        }
        return this._baseProp;
    }

    /** 属性 */
    _tempProp: any;
    _tempPropFrameId: number = 0;
    get prop() {
        let ctrl = this.ctrl;
        let sceneModel = ctrl ? ctrl.sceneModel : null;
        if (sceneModel) {
            let frameId: number = sceneModel.frameId;
            if (this._tempProp &&
                this._tempPropFrameId === frameId) {
                // 同一帧取对象属性不重复计算
                return this._tempProp;
            } else if (this.buffs.length) {
                // 重新计算属性值
                let buf = this.ctrl.buff;
                if (buf && buf.enabled) {
                    if (buf.isApplying) {
                        // 新的BUFF属性正在计算中时，则继续使用当前属性
                        return this._tempProp || this.baseProp;
                    }
                    this._tempPropFrameId = frameId;
                    this._tempProp = PveTool.getProxyObj(this._basePropTarget, buf.prop);
                    this.hpMax = Math.max(1, this._tempProp.hp);
                    return this._tempProp;
                }
            } else {
                this._tempProp = null;
            }
        }
        return this.baseProp;
    }

    /**移除临时属性 */
    removeTempProp() {
        //this._tempProp = null;
        this._tempPropFrameId = 0;
    }

    /**从当前技能列表中获得skillId技能实例 */
    getSkill(skillId: number): PveFightSkill {
        if (this._skillIdx) {
            return this._skillIdx[skillId];
        }
        return null;
    }

    /**添加技能 */
    addSkill(skillId: number, skillLv: number, resort?: boolean): PveFightSkill {
        // 忽略卡牌技能
        // if (skillId > 300000) {
        //     return;
        // }
        // 初始化技能数据
        let a = this._skills;
        if (!a) {
            a = this.skills;
        }
        let i = this._skillIdx;
        // 创建或更新技能
        let c = i[skillId];
        if (!c) {
            c = new PveFightSkill();
            c.model = this;
            c.id = skillId;
            c.lv = skillLv;
            if (!c.baseProp) {
                // 找不到技能配置，则忽略此技能
                return;
            }
            if (PveSkillType.isPvP(c.type) && this.ctrl.sceneModel.stageConfig.copy_id != CopyType.NONE) {
                // 竞技专用技能，如果非竞技模式，则忽略此技能
                return;
            }
            c.cd = 0;
            c.init_cd = c.baseProp['init_cd'];
            a.push(c);
            i[skillId] = c;

            //强化技能处理
            if (PveSkillType.isExt(c.type)) {
                let es = c.baseProp.exskill_id;
                if (!cc.js.isString(es)) {
                    for (let j = 0, n = a.length; j < n; j++) {
                        let s2 = a[j];
                        if ((cc.js.isNumber(es) && es == s2.id) ||
                            (typeof es === 'object' && es.indexOf(s2.id) >= 0)) {
                            // 支持number || number[]
                            s2.ext = s2.ext || [];
                            let have = false
                            s2.ext.forEach(skill => {
                                if (skill.id == c.id) {
                                    have = true;
                                }
                            })
                            if (!have) {
                                s2.ext.push(c);
                            }
                        }
                    }
                }

            }
        } else {
            // 更新技能等级
            c.lv = skillLv;
            if (!c.baseProp) {
                // 找不到技能配置，则忽略此技能
                return;
            }
        }
        // 技能CD项
        let item = this.skillCds[c.cd_type];
        if (!item) {
            item = new SkillCdItem();
            item.cd = c.cd;
            item.inde_cd = c.init_cd;
            this.skillCds[c.cd_type] = item;
            this._skillValues.push(item);
        }
        item.skills[skillId] = c;
        // 重新排序
        resort && a.sort((s1, s2) => {
            let p1: any = s1.baseProp.priority || 0;
            let p2: any = s2.baseProp.priority || 0;
            return p1 - p2;
        });
        // 返回技能
        return c;
    }

    /**
     * 技能id、lv列表
     */
    get skillIds(): SkillIdLv[] {
        return null;
    }

    /**
     * 技能结构列表
     */
    _skills: PveFightSkill[];
    _skillIdx: { [skill_id: number]: PveFightSkill };
    _skillValues: SkillCdItem[];
    get skills(): PveFightSkill[] {
        if (!this._skills) {
            this._skills = [];
            this._skillIdx = cc.js.createMap(true);

            let a = this._skills;
            let ids = this.skillIds;

            // 技能CD数据
            if (!this.skillCds) {
                this.skillCds = cc.js.createMap(true);
                this._skillValues = [];
            }
            // 技能列表
            for (let i = 0, n = ids.length; i < n; i++) {
                let s = ids[i];
                this.addSkill(s.skillId, s.skillLv);
            }
            // 排序
            a.sort((s1, s2) => {
                let p1: any = s1.baseProp.priority || 0;
                let p2: any = s2.baseProp.priority || 0;
                return p1 - p2;
            });
            // 技能增强列表
            for (let i = 0, n = a.length; i < n; i++) {
                let s1 = a[i];
                if (PveSkillType.isExt(s1.type)) {
                    let es = s1.baseProp.exskill_id;
                    if (cc.js.isString(es)) continue;
                    for (let j = 0; j < n; j++) {
                        let s2 = a[j];
                        if ((cc.js.isNumber(es) && es == s2.id) ||
                            (typeof es === 'object' && es.indexOf(s2.id) >= 0)) {
                            // 支持number || number[]
                            s2.ext = s2.ext || [];
                            let have = false
                            s2.ext.forEach(skill => {
                                if (skill.id == s1.id) {
                                    have = true;
                                }
                            })
                            if (!have) {
                                s2.ext.push(s1);
                            }
                        }
                    }
                    // 从技能列表中移除强化技能
                    a.splice(i, 1);
                    n--;
                    i--;
                }
            }
            // 初始化技能CD
            for (let k in this.skillCds) {
                let item = this.skillCds[k];
                let first = item.first;
                item.cd = first.cd;
                item.inde_cd = first.init_cd;
            }
        }
        return this._skills;
    }

    // 快速获得属性（增加BUFF依赖判断）
    getProp(name: string) {
        let n = this.buffs.length;
        if (n > 0) {
            for (let i = 0; i < n; i++) {
                let buf = this.buffs[i];
                if (buf.hasProp(name)) {
                    return this.prop[name];
                }
            }
        }
        return this.baseProp[name];
        // return this.prop[name];
    }

    get range(): number {
        return this.getProp('range');
    }

    // 攻速（比率）
    get atkSpeed() {
        let atk_speed = this.getProp('atk_speed_r');
        if (atk_speed < 0) {
            return Math.max(0.0, 1.0 + atk_speed / 10000);
        } else if (atk_speed > 0) {
            return 1.0 + atk_speed / 10000;
        }
        return 1.0;
    }

    // 移动速度（比率）
    get walkSpeed() {
        let speed = this.getProp('speed');
        if (speed > 0) {
            return speed / 42;
        }
        return 1.0;
    }

    // 移动速度（百分比率）
    get walkSpeedR() {
        let speed_r = this.getProp('speed_r');
        if (speed_r != 0) {
            if (speed_r <= -100) {
                return 0.0;
            }
            let e = this.getProp('speed_r_ex');
            if (e != 0 && ((e < 0 && speed_r < 0) || (e > 0 && speed_r > 0))) {
                speed_r += e;
            }
            return 1.0 + speed_r / 100;
        }
        return 1.0;
    }

    // 移动速度 (数值) (speed*speed_r)
    get speed(): number {
        let v = this.getProp('speed');
        if (v > 0) {
            return v * this.walkSpeedR;
        }
        return 0;
    }

    /**
     * 更新CD
     * @param dt 
     */
    updateCD(dt: number) {
        let a = this._skillValues;
        let n = a ? a.length : 0;
        if (n > 0) {
            let tm = dt// * this.speedScale;
            if (tm > 0) {
                for (let i = 0; i < n; i++) {
                    let item = a[i];
                    if (item.cd > 0 || item.inde_cd > 0) {
                        item.update(tm, this);
                    }
                }
            }
        }
    }

    /**
     * 重置CD
     * @param s 
     */
    resetCD(skill_id?: number) {
        // 清空所有技能CD
        if (skill_id === void 0) {
            if (!this._skillValues) return;
            for (let i = 0, n = this._skillValues.length; i < n; i++) {
                let item = this._skillValues[i];
                if (item.cd > 0) {
                    item.reset();
                }
            }
        } else if (this.skillCds && this._skillIdx[skill_id]) {
            // 清空指定技能的CD
            let item = this.skillCds[this._skillIdx[skill_id].cd_type];
            if (item.cd > 0) {
                item.reset();
            }
        }
    }

    /**
     * 设置特定技能的cd时长
     * @param skill 
     * @param cd 
     */
    resetSkillCd(skill: number, cd: number, size?: number) {
        if (this.skillCds && this._skillIdx[skill]) {
            // 清空指定技能的CD
            let item = this.skillCds[this._skillIdx[skill].cd_type];
            if (item) {
                if (size) {
                    if (size == 0 && item.cd > cd) {
                        item.resetCDTime(cd);
                    } else if (size == 1) {
                        item.resetCDTime(cd);
                    }
                } else {
                    item.resetCDTime(cd);
                }
            }
        }
    }
    /**
     * 设置特定技能的inde_cd时长
     * @param skill 
     * @param cd 
     */
    resetSkillIndeCd(skill: number, cd: number, size?: number) {
        if (this.skillCds && this._skillIdx[skill]) {
            // 清空指定技能的CD
            let item = this.skillCds[this._skillIdx[skill].cd_type];
            if (item) {
                if (size) {
                    if (size == 0 && item.inde_cd > cd) {
                        item.resetIndeCDTime(cd);
                    } else if (size == 1) {
                        item.resetIndeCDTime(cd);
                    }
                } else {
                    item.resetIndeCDTime(cd);
                }
            }
        }
    }

    /**
     * 减少技能的cd
     * @param cd 
     */
    reduceCd(cd?: number, skill_id?: number) {
        // if (!this._skillValues) return;
        // for (let i = 0, n = this._skillValues.length; i < n; i++) {
        //     let item = this._skillValues[i];
        //     if (item.cd > 0) {
        //         item.reduce(cd);
        //     }
        // }
        let a: number[];
        if (skill_id === void 0) {
            // 所有技能
            let skillIds = this.skillIds;
            a = Object.keys(skillIds).map(e => parseInt(e));
        } else if (skill_id > 0) {
            // 指定的技能
            a = [skill_id];
        } else {
            // 随机一个技能
            let skillIds = this.skillIds;
            a = [skillIds[FightingMath.rnd(0, skillIds.length - 1)].skillId];
        }
        a.forEach(id => {
            let s = this._skillIdx[id];
            if (s) {
                // 减少指定技能的CD
                let item = this.skillCds[s.cd_type];
                if (item.cd > 0) {
                    item.reduce(cd);
                }
            }
        });
    }

    /**
     * 获取技能是否可用
     * @param id 
     */
    canUse(s: PveFightSkill) {
        let item = this.skillCds[s.cd_type];
        if (item.cd <= 0 && item.inde_cd <= 0) {
            // 如果技能是概率性施放的话，则计算概率
            let prop = s.prop;
            let rate: any = prop.weight + s.model.getProp('weight_' + s.id);;
            if (cc.js.isNumber(rate) && !FightingMath.rate(rate)) {
                return false;
            }
            // // 如果场景中已经存在技能的召唤物，则不能执行此技能
            // let call_id: any = prop.call_id;
            // if (cc.js.isNumber(call_id) && call_id > 0) {
            //     if (PveTool.hasCalled(this.ctrl.sceneModel, this)) {
            //         return false;
            //     }
            // }
            return true;
        }
        return false;
    }

    /**
     * 使用当前选中的技能
     * @return skill
     */
    useSkill(s?: PveFightSkill) {
        (s === void 0) && (s = this.currSkill);
        if (s) {
            this.skillCds[s.cd_type].reset();
            this.currSkill = null;
        }
        return s;
    }
    /**
     * 获取当前buff护盾数值
     */
    getBuffShiedValue(): number {
        let value = 0;
        this.buffShield.forEach(data => {
            value += data.shiedNum;
        })
        return value;
    }

    /**
     * 刷新护盾量
     * @param value 
     */
    refreshShied(value: number): void {
        if (value >= 0) {
            this.shield += value;
        } else {
            let num = value;
            let deleteBuff = [];
            this.buffShield.forEach(data => {
                let tem = num + data.shiedNum;
                if (tem < 0) {
                    data.shiedNum = 0;
                    deleteBuff.push(data.buffId);
                } else {
                    data.shiedNum = tem;
                }
                num = tem;
            })
            if (num < 0) {
                this.shield += num;
                this.shield = Math.max(0, this.shield);
            }
            //清除护盾为0的buff
            if (deleteBuff.length > 0) {
                deleteBuff.forEach(buffId => {
                    let tem = this.ctrl.buff.findBuf(buffId);
                    if (tem) {
                        tem.remain = 0;
                    }
                })
            }
        }

        this.ctrl.refreshShiedShow();
    }

    unuse() {
        this.loaded = false;
        this.ctrl = null;
        this.config = null;
        this.currSkill = null;
        this.targetId = -1;
        this.speedScale = 1.0;
        this.lastDamageType = 0;
        this.double_hit = 0;
        this.countinue_hit = 0;
        this.buffs.length = 0;
        this.halos.length = 0;
        this.skillCds = null;
        this._ready = false;
        this._skills = null;
        this._skillIdx = null;
        this._skillValues = null;
        this._baseProp = null;
        this._basePropTarget = null;
        this._tempProp = null;
        this._tempPropFrameId = 0;
        this._fightId = -1;
        this.listeners.forEach(lid => {
            PveSkillListener.clearBy(lid);
        });
        this.listeners.length = 0;
        this.shield = 0;
        this.buffShield.length = 0;
        this.customState = false;
    }
}