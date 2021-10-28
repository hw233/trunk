import ConfigManager from '../../../common/managers/ConfigManager';
import FightingMath from '../../../common/utils/FightingMath';
import { PveBSEventArgs, PveBSScopeType } from '../utils/PveBSExprUtils';
import { Skill_buffCfg } from '../../../a/config';
/** 
 * Pve场景Buff数据模型
 * @Author: sthoo.huang  
 * @Date: 2019-04-20 18:30:15 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-21 21:48:27
 */
export interface PveBuffArgs {
    rate?: number;  // 产生这个BUFF的概率，undefine则100%添加
    times?: number; // 效果次数加成
    interval?: number;   // 生效间隔加成
    pubNumber?: number;
}

// 带有此方法的BUFF需每次计算
const REAL_COMPUTE_FUNC_DIC: { [key: string]: boolean } = {
    'get_target_num': true,
    'get_target_type': true,
    'get_buff_num': true,
    'get_buff_allTarget': true,
    'get_buffType_num': true,
    'get_buffStack_target': true,
    'get_target_haveBuff': true,
    'get_monster_type': true,
    'get_targets_by': true,
    'get_target_bloodPro': true,
    'get_killedEnemy_num': true,
    'get_targetBy_baseId': true,
    'get_AllTargetBy_baseId': true,
    'get_AllTargetBy_baseId_haveBuff': true,
    'get_target_OffBattleTime': true,
    'get_target_haveSkill': true,
    'get_target_SkillLv': true,
    'get_target_AllEnemy': true,
    'get_targets_road_min': true,
    'get_target_buffStacking': true,
    'get_monster_isBoss': true,
    'getTargetBuffShieldNum': true,
    'get_target_reduceBlood': true,
    'rate': true,
    'and': true,
    'or': true,
    'not': true,
};

export interface PveBuffEvents {
    onbegin?: PveBSEventArgs;   // BUFF开始时
    onend?: PveBSEventArgs;     // BUFF结束时
    onadd?: PveBSEventArgs;     //添加BUFF时
    onkill?: PveBSEventArgs;    // BUFF或技能杀死目标时
    onhurt?: PveBSEventArgs;    // BUFF或技能目标受到伤害时
    onatk?: PveBSEventArgs;     // 施法者发起攻击时（使用技能）
    ondead?: PveBSEventArgs;    // BUFF拥有者死亡时
    onselect?: PveBSEventArgs;  //锁定敌人开始攻击前
    onchange?: PveBSEventArgs;  //切换敌人时触发
    ondodge?: PveBSEventArgs;   //闪避攻击时
    onrestore?: PveBSEventArgs; //回血事件
}

export default class PveBuffModel {

    config: Skill_buffCfg;  // 静态配置
    attacker_id: number;    // 施法者fight_id
    attacker_prop: any; // 施法者的一份属性拷贝，防止施法者死亡后
    remain: number; // 剩余时间
    max_remain: number;
    times: number;  // 生效次数
    max_times: number;   // 最大生效次数，初始次数
    interval: number;   // 生效间隔
    first: boolean = true;  // 是否为首次执行
    refresh: boolean = false;   // 移除时是否需要立即刷新BUFF属性
    refreshEffect: boolean = false; //移除时是否刷新特效或图标列表
    stacking: number = 1;   // 叠加层数
    addTime: number;    // 添加时的帧ID
    lastTime: number;    // 最后叠加或修改的帧ID
    args: PveBuffArgs;   // 扩展参数
    events: PveBuffEvents;   // 事件对象值
    prop: PveBSScopeType;  // 最后一次的计算结果
    propFrameId: number; // 最后一次计算结果的帧ID
    pubNumber: number;      //通用数值

    /** BUFF ID */
    _id: number;
    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this.config = ConfigManager.getItemById(Skill_buffCfg, v);
        if (CC_DEBUG && !this.config) {
            cc.error(`找不到BUFF (id: ${v}) 的配置`);
            return;
        }
        this.stacking = 1;
        this.times = this.config.times;
        this.interval = 0;
        // 外部修改效果次数
        if (this.args && cc.js.isNumber(this.args.times)) {
            this.times += this.args.times;
        }
        // 外部修改效果次数
        if (this.args && cc.js.isNumber(this.args.pubNumber)) {
            this.pubNumber = this.args.pubNumber;
        }
        // 效果次数为0，则代表次数永久有效
        if (this.times == 0) {
            this.times = Number.MAX_VALUE;
        }
        this.max_times = this.times;
        this.events = FightingMath.getConfigExprEvents(this.config.effect_expr);
    }

    get active() {
        if (!this.config) return;
        if (!this.isPropType) {
            return this.remain > 0 &&
                this.times > 0 &&
                this.interval <= 0;
        }
        return this.remain > 0;
    }

    get remove() {
        if (!this.config) return;
        if (!this.isPropType) {
            // 时间已到或次数用完了
            return this.remain <= 0 || this.times <= 0;
        }
        return this.remain <= 0;
    }

    // 是否为属性BUFF类型
    get isPropType(): boolean {
        if (!this.config) return;
        let v = this.config.effect_type;
        return v == 11 || v == 10 || v == 1;
    }

    // 返回表达式所有属性名
    get propNames(): { [name: string]: boolean } {
        if (!this.config) return;
        return this.config['__attr__'];
    }

    // 表达式是否会计算指定属性
    hasProp(names?: string | string[]): boolean {
        if (!this.config) return false;
        let name = '__is_attr_type__';
        let config = this.config;
        if (config[name] === void 0) {
            config[name] = false;
            // 根据表达式推算，是否有属性需计算
            if (config.effect_type > 0 && config.effect_expr) {
                // 效果类型为1的默认修改为11
                (config.effect_type == 1) && (config.effect_type = 11);
                let parser = FightingMath.getConfigExprParser(config.effect_expr, config);
                if (!parser) {
                    return false;
                }
                let mtype = gdk.math['type'];
                let attr = {};
                parser.filter((node: any) => {
                    if (mtype.isAssignmentNode(node)) {
                        // 赋值表达式
                        let n1: string = node.name;
                        if (n1.indexOf('TEMP') == 0) {
                            return;
                        }
                        attr[n1] = true;
                        if (!config[name]) {
                            config[name] = true;
                            config['__attr__'] = attr;
                        }
                    } else if (config.effect_type == 11) {
                        if (mtype.isFunctionNode(node)) {
                            // 函数调用
                            if (REAL_COMPUTE_FUNC_DIC[node.name]) {
                                config.effect_type = 1;
                            }
                        } else if (mtype.isConditionalNode(node)) {
                            // 条件表达式，?:
                            config.effect_type = 1;
                        } else if (mtype.isOperatorNode(node)) {
                            // 运算表达式，比较之类
                            config.effect_type = 1;
                        }
                    }
                });
            }
        }
        if (config[name]) {
            // 判断数组中是否有某项属性包含在表达式中
            if (names instanceof Array) {
                for (let i = 0, n = names.length; i < n; i++) {
                    if (!!config['__attr__'][names[i]]) {
                        // 只要有一个满足条件，则返回true
                        return true;
                    }
                }
                return false;
            } else if (names === void 0) {
                // 是否包含属性计算
                return true;
            }
            // 判断单个属性是否包含在表达式中
            return !!config['__attr__'][names];
        }
        return false;
    }

    // 是否需要重新计算BUFF属性
    hasChanged(frameId: number) {
        if (this.prop) {
            if (frameId == this.propFrameId) return false;
            let v = this.config.effect_type;
            if (v == 10 || v == 11) {
                // 10, 11类型的BUFF只计算一次
                return false;
            }
        }
        return true;
    }

    updateScript(dt: number) {
        this.remain -= dt;
        this.interval -= dt;
    }

    // 运行一次
    run() {
        if (!this.config) return;
        if (!this.isPropType) {
            // 减少次数，并重置间隔时间
            this.interval = this.config.interval;
            // 外部修改BUFF间隔
            if (this.args && cc.js.isNumber(this.args.interval)) {
                this.interval += this.args.interval;
            }
            this.times--;
        }
    }

    unuse() {
        this._id = 0;
        this.config = null;
        this.attacker_id = 0;
        this.attacker_prop = null;
        this.times = 0;
        this.interval = 0;
        this.remain = 0;
        this.first = true;
        this.refresh = false;
        this.refreshEffect = false;
        this.stacking = 1;
        this.events = null;
        this.prop = null;
        this.propFrameId = 0;
    }
}