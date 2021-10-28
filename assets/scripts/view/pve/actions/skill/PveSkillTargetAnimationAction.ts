import FightingMath from '../../../../common/utils/FightingMath';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import {
    getPveFightAnmEventValue,
    getPveFightAnmNameValue,
    PveFightAnmEventEnum,
    PveFightAnmEvents,
    PveFightAnmNameEnum,
    PveFightAnmNames,
    PveSkillEvents
} from '../../const/PveAnimationNames';
import { PveSkillType, PveTargetType } from '../../const/PveSkill';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { PveFightType } from '../../core/PveFightModel';
import PveContinueSkillTipEffectCtrl from '../../ctrl/base/PveContinueSkillTipEffectCtrl';
import PveSkillNameEffect from '../../ctrl/base/PveSkillNameEffect';
import PveBaseFightCtrl from '../../ctrl/fight/PveBaseFightCtrl';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveHeroModel from '../../model/PveHeroModel';
import { onSpineEvent, PveSkillListener } from '../../model/PveSkillModel';
import PveFightUtil from '../../utils/PveFightUtil';
import PvePool from '../../utils/PvePool';
import PveSkillBaseAction from '../base/PveSkillBaseAction';

/**
 * Pve技能设置目标动画
 * @Author: sthoo.huang
 * @Date: 2019-05-06 19:59:57
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-31 13:52:43
 */
const { ccclass, property, menu } = cc._decorator;

@gdk.fsm.action("PveSkillTargetAnimationAction", "Pve/Skill")
export default class PveSkillTargetAnimationAction extends PveSkillBaseAction {

    @property({ type: cc.Enum(PveTargetType), tooltip: "目标类型" })
    targetType: PveTargetType = PveTargetType.AttackerCenter;

    @property({ type: cc.Enum(PveFightAnmNameEnum), tooltip: "动画名称" })
    animation: PveFightAnmNameEnum = PveFightAnmNameEnum.ATTACK;

    @property(cc.Boolean)
    loop: boolean = false;

    @property({ type: cc.Enum(PveFightAnmEventEnum), tooltip: "发起攻击事件名称" })
    attackEventName: PveFightAnmEventEnum = PveFightAnmEventEnum.ATTACK;

    @property({ type: [cc.Enum(PveSkillEvents)], tooltip: "判断技能完成的事件类型，收到任一事件则判断结束" })
    completeEvents: PveSkillEvents[] = [PveSkillEvents.Start];

    targets: PveFightCtrl[] = [];
    continueTips: cc.Node;

    onEnter() {
        super.onEnter();
        let sm = this.ctrl.sceneModel;
        if (!sm.isDemo && this.model.continueTime > 0) {
            this.model.attacker.setAnimation(this.model.config.pre_animation, { mode: 'set', loop: true });
            gdk.NodeTool.onHide(this.model.attacker.node).once(this.stop, this);
            this.model.attacker.onDie.once(this.stop, this);

            // 播放施法进度条
            this.continueTips = PvePool.get(sm.ctrl.continueSkillTips);
            let tips = this.continueTips.getComponent(PveContinueSkillTipEffectCtrl);
            tips.continueTime = this.model.continueTime;
            tips.sceneModel = sm;
            this.continueTips.zIndex = 100;
            this.continueTips.parent = sm.ctrl.hurt;
            gdk.NodeTool.show(this.continueTips);
            let r = this.model.attacker.getRect();
            let pos = this.model.attacker.getPos()
            if (r) {
                let add = 50;
                this.continueTips.setPosition(
                    pos.x,
                    pos.y + Math.ceil(r.y + r.height + add),
                );
            }

            // 地点预警
            if (cc.js.isNumber(this.model.config.time_show) && this.model.config.time_show > 0) {
                PveFightUtil.createTrap(
                    sm,
                    this.model.config.time_show,
                    this.model.config.time,
                    this.model.targetPos,
                    this.model.attacker,
                );
            }


            return;
        } else {
            this.enterAtk()
        }
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        // 更新施法进度条
        if (this.continueTips) {
            let tips = this.continueTips.getComponent(PveContinueSkillTipEffectCtrl);
            if (tips && tips.enabledInHierarchy) {
                tips.updateScript(dt);
            }
        }
        // 持续时间
        if (this.model.continueTime > 0) {
            this.model.continueTime -= dt;
            if (this.model.continueTime <= 0) {
                //this.fsm.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
                if (this.model.attacker.node) {
                    gdk.NodeTool.onHide(this.model.attacker.node).off(this.stop, this);
                }
                if (this.model.attacker.onDie) {
                    this.model.attacker.onDie.off(this.stop, this);
                }
                // 隐藏施法进度条
                if (this.continueTips) {
                    gdk.NodeTool.hide(this.continueTips, false, () => {
                        PvePool.put(this.continueTips);
                    });
                }
                this.continueTips = null;
                //显示技能名称
                if (this.model.config.show_name == 1) {
                    let sm = this.ctrl.sceneModel;
                    let node: cc.Node = PvePool.get(sm.ctrl.skillNameEffect);
                    let ctrl = node.getComponent(PveSkillNameEffect);
                    let hero = this.model.attacker as PveBaseFightCtrl;
                    ctrl.sceneModel = sm;
                    ctrl.target = hero;
                    ctrl.value = this.model.config.name;
                    sm.ctrl.hurt.addChild(node);
                }
                this.enterAtk();
            }
        }
    }

    enterAtk() {
        // 设置动画名称，如果外部配置中有配，则使用外部配置中的值，否则使用默认值
        let model = this.model;
        let config = model.config;
        let animation: any = config.animation;
        let sm = this.ctrl.sceneModel;
        let resId = gdk.Tool.getResIdByNode(sm.ctrl.node);
        if (typeof animation === 'object') {
            // 配置中动作为数组，则随机挑一个动作
            animation = animation[FightingMath.rnd(0, animation.length - 1)];
        }
        if (!animation || animation == '') {
            animation = getPveFightAnmNameValue(this.animation);
        }
        //检测技能是否需要加速
        if (cc.js.isNumber(model.config.speed)) {
            let spines = this.model.attacker.spines;
            for (let i = 0, n = spines.length; i < n; i++) {
                let spine = spines[i];
                let scale = spine.timeScale
                spine.timeScale = scale * (1 + model.config.speed / 100);
            }
        }
        // 设置目标动作
        this.targets.length = 0;
        if (this.targetType == PveTargetType.TargetCenter ||
            this.targetType == PveTargetType.TargetStand) {
            // 查找目标
            model.selectedTargets.forEach(id => {
                this.targets.push(sm.getFightBy(id))
            });
        } else {
            this.targets.push(model.attacker);
            // 英雄普攻时
            let m = model.attacker.model;
            if (m && m.type == PveFightType.Hero && PveSkillType.isNormal(config.type)) {
                let am = m as PveHeroModel;
                // 播放机枪、狙击和炮兵的攻击动作
                // if (am.soldierType != 4) {
                for (let i = 0; i < am.soldiers.length; i++) {
                    let t = am.soldiers[i];
                    t.setDir(model.targetPos);
                    t.setAnimation(
                        PveFightAnmNames.ATTACK,
                        {
                            onEvent: (eventName: string) => {
                                // 播放施法音效
                                if (eventName == PveFightAnmEvents.ATTACK) {
                                    let skills = t.model.skills;
                                    for (let j = 0, m = skills.length; j < m; j++) {
                                        let s = skills[j];
                                        if (PveSkillType.isNormal(s.type)) {
                                            if (s.config.atk_sound && GlobalUtil.isSoundOn) {
                                                gdk.sound.play(resId, s.config.atk_sound);
                                            }
                                            break;
                                        }
                                    }
                                }
                                // spine事件
                                onSpineEvent(eventName, model, t);
                            },
                            mode: 'set',
                            loop: false,
                            after: {
                                mode: 'set',
                                loop: true,
                                name: PveFightAnmNames.IDLE,
                            },
                        },
                    );
                }
                // }
            }
        }
        // 设置技能完成监听
        let option = model.option;
        if (option && typeof option.onComplete === 'function') {
            // 设置动画及动画事件监听
            let targets: PveFightCtrl[] = this.targets;
            let lid: number = -1;
            if (targets) {
                for (let i = 0, n = targets.length; i < n; i++) {
                    let target = targets[i];
                    if (!target || !target.isAlive) continue;
                    // 仅设置动作
                    if (lid != -1) {
                        target.setAnimation(animation, { mode: 'set', loop: this.loop });
                    } else {
                        // 创建监听器并添加监听
                        let listener = PveSkillListener.create(
                            this.ctrl,
                            this.completeEvents,
                            option.onComplete,
                            option.thisArg
                        );
                        listener.eventName = getPveFightAnmEventValue(this.attackEventName);
                        lid = listener.id;
                        // 设置目标动作并监听事件
                        target.setAnimation(animation, {
                            onComplete: () => {
                                let listener = PveSkillListener.getBy(lid);
                                if (listener && listener.events) {
                                    listener.onComplete(PveSkillEvents.TargetComplete);
                                }
                                target.model.speedScaleDirty = true;
                            },
                            onEvent: (eventName: string) => {
                                let listener = PveSkillListener.getBy(lid);
                                if (listener && listener.events) {
                                    if (eventName == listener.eventName) {
                                        // 攻击回调，击中音效
                                        if (config.hit_sound && GlobalUtil.isSoundOn) {
                                            gdk.sound.play(resId, config.hit_sound);
                                        }
                                        this.finish();
                                    }
                                    listener.onEvent(eventName);
                                }
                            },
                            eventName: listener.eventName,
                            thisArg: this,
                            mode: 'set',
                            loop: this.loop,
                            timeOut: 5 * Math.max(1.0, sm.timeScale),
                            after: {
                                mode: 'set',
                                loop: true,
                                name: PveFightAnmNames.IDLE,
                            },
                        });
                        // 目标死亡则停止技能
                        gdk.NodeTool.onHide(target.node).once(this.stop, this);
                        target.onDie.once(this.stop, this);
                    }
                }
            }
            // 没有任何有效目标
            if (lid == -1) {
                this.stop();
            }
        } else {
            // 直接继续攻击特效
            this.finish();
        }
    }

    // 终止技能
    stop() {
        this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
    }

    onExit() {
        // 移除目标事件监听
        for (let i = 0, n = this.targets.length; i < n; i++) {
            let target = this.targets[i];
            if (target) {
                if (target.node) {
                    gdk.NodeTool.onHide(target.node).off(this.stop, this);
                }
                if (target.onDie) {
                    target.onDie.off(this.stop, this);
                }
            }
        };
        this.targets.length = 0;

        //技能被打断
        if (this.model.continueTime > 0) {
            let option = this.model.option;
            if (option) {
                option.onComplete && option.onComplete.call(option.thisArg)
            }
        }
        //回收进度条
        if (this.continueTips) {
            gdk.NodeTool.hide(this.continueTips, false, () => {
                PvePool.put(this.continueTips);
            });
            this.continueTips = null;
        }
        super.onExit();
    }
}