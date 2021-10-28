import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import PveBaseSkillCtrl from '../ctrl/skill/PveBaseSkillCtrl';
import PveHeroCtrl from '../ctrl/fight/PveHeroCtrl';
import PvePool from '../utils/PvePool';
import PveTool from '../utils/PveTool';
import { PveFightAnmEvents, PveSkillEvents } from '../const/PveAnimationNames';
import { PveFightCtrl } from '../core/PveFightCtrl';
import { PveFightType } from '../core/PveFightModel';
import { Skill_effect_typeCfg, SkillCfg } from '../../../a/config';

/**
 * PVE-英雄技能数据模型类
 * @Author: sthoo.huang
 * @Date: 2019-03-18 20:39:42
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-30 20:57:50
 */
interface PveSkillOption {
    onComplete?: Function;
    thisArg?: any;
}

// 侦听器自增ID
let ListenerId: number = 1;
let ListenerDic: { [id: number]: PveSkillListener } = cc.js.createMap(true);

// Spine事件处理
export function onSpineEvent(
    eventName: string,
    model: PveSkillModel,
    attacker: PveFightCtrl,
    target_id?: number,
    pos?: cc.Vec2
) {
    if (!eventName) return;
    if (!attacker || !attacker.isAlive) return;
    switch (eventName) {
        case PveFightAnmEvents.QUAKE:
            // 产生屏幕震动效果, 小震
            attacker.sceneModel.ctrl.quake(3, 15);
            break;

        case PveFightAnmEvents.QUAKE_STRONG:
            // 大震
            attacker.sceneModel.ctrl.quake(10, 15);
            break;

        case PveFightAnmEvents.REPEL:
            // 击退
            let target = attacker.sceneModel.getFightBy(target_id);
            if (target && cc.isValid(target.node)) {
                target.repel(attacker);
            }
            break;

        case PveFightAnmEvents.JUMP:
            // 跳跃，施法者跳至目标坐标位置
            if (!model) return;
            switch (attacker.model.type) {
                case PveFightType.Hero:
                    // 英雄
                    let hero = attacker as PveHeroCtrl;
                    // let p = pos || PveTool.getPveSkillPosBy(model, model.effectType.to_pos_type, 0);
                    // p = hero.node.parent.convertToWorldSpaceAR(p);
                    // p = hero.spine.node.parent.convertToNodeSpaceAR(p);
                    // hero.spine.node.setPosition(p);
                    hero.node.setPosition(model.targetPos);
                    break;

                case PveFightType.Genral:
                    // 指挥官
                    attacker.node.setPosition(model.targetPos);
                    break;

                case PveFightType.Call:
                    // 召唤物
                    let sceneModel = attacker.sceneModel;
                    let sceneCtrl = sceneModel.ctrl;
                    let p3 = pos || PveTool.getPveSkillPosBy(model, model.effectType.to_pos_type, 0);
                    let skin = 'E_tongyongpugong';
                    PveTool.createSpine(
                        sceneCtrl.spineNodePrefab,
                        sceneCtrl.effect,
                        `spine/skill/${skin}/${skin}`,
                        `atk_hit8`,
                        false,
                        Math.max(1, sceneModel.timeScale),
                        (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => {
                            if (!cc.isValid(spine.node)) return;
                            // 清理并回收spine节点
                            PveTool.clearSpine(spine);
                            PvePool.put(spine.node);
                        },
                        null,
                        p3,
                        true,
                        true,
                    );
                    attacker.node.setPosition(p3);
                    break;

                default:
                    // 其它
                    let p2 = pos || PveTool.getPveSkillPosBy(model, model.effectType.to_pos_type, 0);
                    attacker.node.setPosition(p2);
                    break;
            }
            break;

        default:
            // 默认
            let names: string[] = eventName.split('#');
            if (names.length > 1) {
                switch (names[0]) {
                    case PveFightAnmEvents.RANGE_BEGIN:
                        // 显示伤害范围圈效果
                        let sd: sp.SkeletonData;
                        if (attacker.model.type == PveFightType.Trap) {
                            attacker.spines.some(s => {
                                if (!s || !s.skeletonData) return false;
                                sd = s.skeletonData;
                                return true;
                            });
                            if (!pos) {
                                pos = attacker.getPos();
                            }
                        } else if (!model) {
                            return;
                        } else {
                            model.ctrl.spines.some(s => {
                                if (!s || !s.skeletonData) return false;
                                sd = s.skeletonData;
                                return true;
                            });
                        }

                        // model.ctrl.spines.some(s => {
                        //     if (!s || !s.skeletonData) return false;
                        //     sd = s.skeletonData;
                        //     return true;
                        // });
                        if (sd && names[1] && PveTool.hasSpineAnimation(sd, names[1])) {
                            let sm = attacker.sceneModel;
                            let n = PvePool.get(sm.ctrl.spineNodePrefab);
                            let s = n.getComponent(sp.Skeleton);
                            s.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
                            s.enableBatch = false;
                            s.skeletonData = sd;
                            s.paused = false;
                            s.node.active = true;
                            s.loop = names[2] == 'loop';
                            s.animation = names[1];
                            s.timeScale = Math.max(1, sm.timeScale);
                            // 播放完成后移除自身
                            s.setCompleteListener(() => {
                                PveTool.clearSpine(s);
                                PvePool.put(n);
                            });
                            // 设置坐标
                            if (!pos) {
                                pos = PveTool.getPveSkillPosBy(model, model.effectType.to_pos_type, 0);
                            }
                            n.setPosition(pos);
                            n.parent = sm.ctrl.floor;
                        }
                        break;

                    case PveFightAnmEvents.SOUND:
                        // 播放音效
                        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(attacker.node), names[1]);
                        break;
                }
            }
            break;
    }
}

export class PveSkillListener {
    id: number; // 唯一标识
    model: PveSkillModel;   // 技能数据模型
    attacker: PveFightCtrl;     // 施法者
    trigger: gdk.EventTrigger;  // 事件触发器
    events: PveSkillEvents[];   // 完成事件列表
    eventName: string;  // 攻击事件名称
    thisArg: any;   // this对象
    callback: Function; // 完成回调

    onComplete(t: PveSkillEvents) {
        if (!this.events || this.events.indexOf(t) < 0) return;
        let callback = this.callback;
        let thisArg = this.thisArg;
        this.clear(true); // 清除
        callback && callback.call(thisArg);
    }

    onEvent(eventName: string) {
        if (!this.model) return;
        if (!this.model.ctrl) return;
        onSpineEvent(eventName, this.model, this.attacker);
    }

    // 施法者死亡
    onDead() {
        if (!this.attacker) return;
        this.clear(true);
    }

    /**
     * 清除监听器
     * @param b
     */
    clear(b: boolean = false) {
        if (!ListenerDic[this.id]) return;
        delete ListenerDic[this.id];
        if (b) {
            // 从列表中移除
            let a = this.attacker.model.listeners;
            let i = a.indexOf(this.id);
            if (i >= 0) {
                let length = a.length;
                a[i] = a[length - 1];
                a.length = length - 1;
            }
        }
        if (this.attacker.onDie) {
            this.attacker.onDie.off(this.onDead, this);
        }
        this.trigger.off(this.onComplete, this);
        this.events = null;
        this.trigger = null;
        this.callback = null;
        this.thisArg = null;
        this.model = null;
        this.attacker = null;
        PvePool.put(this);
    }

    /**
     * 创建完成监听对象
     * @param model
     * @param trigger 
     * @param events 
     * @param cb 
     * @param thisArg 
     */
    static create(ctrl: PveBaseSkillCtrl, events: PveSkillEvents[], cb: Function, thisArg?: any) {
        let t: PveSkillListener = PvePool.get(PveSkillListener);
        let m: PveSkillModel = ctrl.model;
        t.id = ListenerId++;
        t.model = m;
        t.attacker = m.attacker;
        t.trigger = ctrl.event;
        t.events = events;
        t.callback = cb;
        t.thisArg = thisArg;
        t.trigger.on(t.onComplete, t);
        t.model.attacker.onDie.once(t.onDead, t);
        t.model.attacker.model.listeners.push(t.id);
        ListenerDic[t.id] = t;
        return t;
    }

    static getBy(id: number) {
        return ListenerDic[id];
    }

    static clearBy(id: number, b: boolean = false) {
        let t = ListenerDic[id];
        if (t) {
            t.clear(b);
        }
    }
}

export default class PveSkillModel {

    ctrl: PveBaseSkillCtrl;
    attacker: PveFightCtrl;  // 攻击者
    targetPos: cc.Vec2;    // 目标坐标
    targetRect: cc.Rect;    // 目标范围框
    continueTime: number;   // 技能持续时间（秒）
    selectedTargets: number[] = [];   // 选中的目标对象fightId列表
    damagedList: number[] = []; // 已产生过效果的目标对象fightId列表
    multiple: boolean = false;  // 多重特效
    option: PveSkillOption = {}; // 施法选项
    animationCount: number = 0;  // 动画播放完成次数
    damageCount: number = 0; // 产生伤害次数
    waitingCount: number = 0;    // 等待完成的动画数量
    graphicNode: cc.Node = null;    // 测试伤害范围圈node
    effectType: Skill_effect_typeCfg;   // 技能类型配置
    targetFirstPos: cc.Vec2;    // 目标坐标
    crits: number[] = [];   // 对应各战斗单元类型的暴击
    evalExprCount: number = -1;   // evalSkillExprOne调用计数器

    /** 技能ID */
    get id() {
        return this._config && this._config.skill_id;
    }

    // 静态配置表
    _config: SkillCfg = null;
    get config(): SkillCfg {
        return this._config;
    }

    set config(v: SkillCfg) {
        this._config = v;
        if (!v) return;
        if (typeof v.time === 'string') {
            this.continueTime = 0;
        } else {
            this.continueTime = v.time;
        }
        this.effectType = ConfigManager.getItemById(Skill_effect_typeCfg, v.effect_type);
    }

    get attacker_id() {
        if (this.attacker && this.attacker.isAlive) {
            return this.attacker.model.fightId;
        }
        return 0;
    }

    get attacker_prop() {
        if (this.attacker && this.attacker.isAlive) {
            return this.attacker.model.prop;
        }
        return null;
    }

    /**
     * 目标的有效性验证，目标对象全都死亡则返回false
     */
    get validate() {
        let n = this.selectedTargets.length;
        if (n > 0) {
            let m = this.ctrl.sceneModel;
            for (let i = 0; i < n; i++) {
                let target = m.getFightBy(this.selectedTargets[i]);
                if (target && target.isAlive) {
                    return true;
                }
            }
            //如果是范围伤害技能或者召唤技能可以在目标位置释放
            if (this.targetPos && (this.config.target_num > 1 || this.config.call_id > 0)) {
                return true;
            }
        }
        return false;
    }

    // 获得特殊属性
    getProp(name: string, add: boolean = true) {
        let val: number = this._config[name] || 0;
        let attacker = this.attacker;
        if (attacker && attacker.isAlive) {
            let m = attacker.model;
            if (add) {
                // 相加模式
                val += m.getProp(name);
                val += m.getProp(name + '_' + this.id);
            } else {
                // 替换模式，只针对特定id
                let prop = m.getProp(name + '_' + this.id);
                if (prop > 0) {
                    val = prop;
                }
            }
        }
        return val;
    }

    // 多段伤害
    get dmgMul(): number {
        return this.getProp('dmg_mul');
    }

    // 伤害范围
    get dmgRange(): number {
        return this.getProp('dmg_range');
    }

    // 目标数量
    get targetNum(): number {
        return this.getProp('target_num');
    }

    /**
     * 添加目标
     */
    addTarget(v: PveFightCtrl) {
        if (!v || !v.isAlive) return;
        let fightId = v.model.fightId;
        if (this.selectedTargets.indexOf(fightId) < 0) {
            this.selectedTargets.push(fightId);
            if (this.targetPos == null &&
                this.selectedTargets.length == 1) {
                // 设置默认坐标
                this.targetPos = v.getPos().clone();
                this.targetRect = v.getRect();
            }
        }
    }

    unuse() {
        this.option = {};
        this.config = null;
        this.effectType = null;
        this.ctrl = null;
        this.attacker = null;
        this.targetPos = null;
        this.targetRect = null;
        this.continueTime = 0;
        this.selectedTargets.length = 0;
        this.damagedList.length = 0;
        this.multiple = false;
        this.animationCount = 0;
        this.damageCount = 0;
        this.waitingCount = 0;
        this.targetFirstPos = null;
        this.crits.length = 0;
        this.evalExprCount = -1;
    }
}