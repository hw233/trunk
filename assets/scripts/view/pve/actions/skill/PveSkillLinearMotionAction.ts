import ConfigManager from '../../../../common/managers/ConfigManager';
import FightingMath from '../../../../common/utils/FightingMath';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MathUtil from '../../../../common/utils/MathUtil';
import PveFightUtil from '../../utils/PveFightUtil';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PvePool from '../../utils/PvePool';
import PveSkillBaseAction from '../base/PveSkillBaseAction';
import PveSkillModel, { onSpineEvent } from '../../model/PveSkillModel';
import PveTool from '../../utils/PveTool';
import {
    getPveFightAnmEventValue,
    getPveSkillAnmNameValue,
    PveFightAnmEventEnum,
    PveFightAnmEvents,
    PveSkillAnmNameEnum,
    PveSkillEvents
    } from '../../const/PveAnimationNames';
import { PveCalledAIType } from '../../const/PveCalled';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { PveSkillType, PveTargetType } from '../../const/PveSkill';
import { Skill_target_typeCfg, Skill_trapCfg, SkillCfg } from '../../../../a/config';
/**
 * Pve技能直线移动动作
 * @Author: sthoo.huang
 * @Date: 2019-04-30 17:18:43
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-06-10 10:38:17
 */
const { property } = cc._decorator;
const abs = Math.abs;
const ceil = Math.ceil;

interface ActionDataType {
    index: number;
    spine: sp.Skeleton;
    from: cc.Vec2;
    to: cc.Vec2;
    action: cc.Action;
    delay: number;
};

@gdk.fsm.action("PveSkillLinearMotionAction", "Pve/Skill")
export default class PveSkillLinearMotionAction extends PveSkillBaseAction {

    @property({ type: cc.Enum(PveSkillAnmNameEnum), tooltip: "运动轨迹动画名称" })
    moveAnimation: PveSkillAnmNameEnum = PveSkillAnmNameEnum.MOVE;

    @property({ type: cc.Enum(PveSkillAnmNameEnum), tooltip: "爆炸效果动画名称" })
    bombAnimation: PveSkillAnmNameEnum = PveSkillAnmNameEnum.HIT;

    @property({ type: gdk.EaseType, tooltip: "缓动函数" })
    ease: gdk.EaseType = gdk.EaseType.easeLinear;

    @property({ tooltip: "缓动参数" })
    easeParam: number = 3.0;

    @property({ type: cc.Enum(PveFightAnmEventEnum), tooltip: "计算伤害事件名称" })
    hurtEventName: PveFightAnmEventEnum = PveFightAnmEventEnum.ATTACK;

    @property({ tooltip: "当施法者死亡后结束技能" })
    hideOnAttackerDie: boolean = true;

    from: PveTargetType;    // 运动起点类型
    to: PveTargetType;  // 运动终点类型
    syncRotation: boolean;   // 同步旋转角度
    storeTargetPos: boolean;    // 是否存储目标坐标
    actions: cc.Action[] = [];
    updateDatas: ActionDataType[] = [];

    onEnter() {
        super.onEnter();

        // 从外部配置计算属性
        let et = this.model.effectType;
        this.from = et.from_pos_type;
        this.to = et.to_pos_type;
        this.syncRotation = et.sync_rotation;
        this.storeTargetPos = et.store_pos;

        // 施法者死亡则销毁，光环技能一定会在施法者死亡后消失
        if (this.hideOnAttackerDie) {
            let attacker: PveFightCtrl = this.model.attacker;
            if (!attacker || !attacker.isAlive) {
                // 施法者已死
                this.onAttackerDie();
                return;
            }
            attacker.onDie.once(this.onAttackerDie, this);
        }
        if (this.spines.length > 0) {
            // 广播事件
            this.ctrl.event.emit(PveSkillEvents.Start);
            // 设置弹道动作
            let config = this.model.config;
            if (config.move_animation == '') {
                // 优先使用配置文件中配置的动作名
                config.move_animation = getPveSkillAnmNameValue(this.moveAnimation);
            }
            let animation = config.move_animation;
            let speed = this.timeScale;
            this.spineRunAction(animation, speed)
        } else {
            // 没有目标，则直接销毁
            this.finish();
        }
    }

    spineRunAction(animation: string, speed: number) {
        let et = this.model.effectType;
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            if (!spine || this.actions.some(a => a.getTarget() == spine.node)) {
                // spine为null，或已添加了动作
                continue;
            }
            spine.paused = false;
            spine.node.active = true;
            // action
            let action = this.getAction(i, spine);
            let streak = spine.node.getComponentInChildren(cc.MotionStreak);
            if (action) {
                this.setAnimation(spine, animation, true, speed);
                spine.node.runAction(action);
                if (action['setSpeed']) {
                    action['setSpeed'](speed);
                }
                this.actions.push(action);
                // 拖尾效果
                let args = et.motion_streak_args;
                if (typeof args === 'object') {
                    let resId = gdk.Tool.getResIdByNode(this.node);
                    let texture = gdk.rm.getResByUrl(args[0], cc.Texture2D, resId);
                    if (!texture) {
                        // 资源需要外部加载
                        gdk.rm.loadRes(resId, args[0], cc.Texture2D, (res: cc.Texture2D) => {
                            if (!cc.isValid(this.node)) return;
                            streak.texture = res;
                        });
                    } else {
                        streak.texture = texture;
                    }
                    streak.minSeg = args[2] / speed;
                    streak.stroke = args[3];
                    if (cc.js.isString(args[4])) {
                        streak.color = cc.color(args[4]);
                    } else {
                        streak.color = cc.Color.WHITE;
                    }
                    streak.fadeTime = args[1] / speed;
                    streak.node.active = true;
                    streak.enabled = true;
                } else {
                    streak.enabled = false;
                    streak.node.active = false;
                }
            } else {
                // 无需动作，则直接调用
                streak.enabled = false;
                streak.node.active = false;
                this.onArrivalHandle(spine.node, this.getData(i, spine));
            }
        }
    }

    get timeScale() {
        let speed = 1.0;
        let model = this.model;
        let attacker = model.attacker;
        if (attacker && attacker.isAlive) {
            let m = attacker.model;
            if (m && m.ready) {
                // 攻速只针对普攻有效(403普攻不受攻速影响)
                if (PveSkillType.isNormal(model.config.type) && model.config.type != 403) {
                    speed = m.atkSpeed;
                }
                speed = Math.max(1, speed * m.speedScale);
            }
        }
        return this.ctrl.sceneModel.timeScale * speed;
    }

    get easeFun() {
        let ease = gdk.EaseType[this.ease];
        let fun = cc[ease];
        if (fun == null) {
            fun = cc[gdk.EaseType[gdk.EaseType.easeLinear]];
        }
        return fun.call(this, this.easeParam);
    }

    get speed() {
        return this.model.config.speed;
    }

    getFromPos(index?: number) {
        return PveTool.getPveSkillPosBy(this.model, this.from, index, 0);
    }

    getToPos(index?: number, dt: number = 0) {
        return PveTool.getPveSkillPosBy(this.model, this.to, index, dt);
    }

    getData(index: number, spine: sp.Skeleton) {
        let data: ActionDataType = {
            index: index,
            spine: spine,
            from: this.getFromPos(index),
            to: this.getToPos(index),
            action: null,
            delay: 0,
        };
        return data;
    }

    getAction(index: number, spine: sp.Skeleton): cc.Action {
        let data = this.getData(index, spine);
        let config = this.model.config;
        let move_delay: number = 0;
        if (config.move_delay instanceof Array) {
            // 配置不同的值
            move_delay = config.move_delay[index] || 0;
        } else if (cc.js.isNumber(config.move_delay)) {
            // 配置值为数字
            move_delay = config.move_delay;
        }
        // 动作
        data.action = cc.callFunc(this._spineActionFunc, this, data);
        data.delay = move_delay;
        spine.node.opacity = move_delay > 0 ? 0 : 255;
        spine.node.setPosition(data.from);
        return data.action;
    }

    // spine动作回调函数
    _spineActionFunc(node: cc.Node, data: ActionDataType) {
        if (!this.active) return;
        let idx = this.actions.indexOf(data.action);
        if (idx >= 0) {
            this.actions.splice(idx, 1);
        }
        delete data.action;
        // 添加到updateScript更新回调列表
        if (this.updateDatas.indexOf(data) == -1) {
            this.updateDatas.push(data);
        }
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let a = this.updateDatas;
        let n = a.length;
        if (n > 0) {
            let len = dt * this.speed;
            for (let i = 0; i < n; i++) {
                // 单个spine的位置更新update方法
                let data = a[i];
                let spine = data.spine;
                let node = spine.node;
                // 延时处理
                if (data.delay > 0) {
                    data.delay -= dt;
                    if (data.delay > 0) {
                        continue;
                    }
                    node.opacity = 255;
                }
                // 检查目标是否死亡
                this.checkTargetDie(node, data);
                // 当前动作无效，则直接退出
                if (!this.active) return;
                // 更新目标坐标
                data.to = this.getToPos(data.index);
                if (this.syncRotation) {
                    this.setRotation(node, data);
                    if (-270 < data.spine.node.angle && data.spine.node.angle < -90) {
                        data.spine.node.scaleY = -1
                    } else {
                        data.spine.node.scaleY = 1
                    }
                }
                let from = node.getPos();
                let dis: number = MathUtil.distance(from, data.to);
                let dx: number = (data.to.x - from.x) / dis * len;
                let dy: number = (data.to.y - from.y) / dis * len;
                if (abs(data.to.x - from.x) > ceil(abs(dx)) ||
                    abs(data.to.y - from.y) > ceil(abs(dy))) {
                    // 大于一步时
                    node.setPosition(node.x + dx, node.y + dy);
                    continue;
                }
                // 到达目标
                a[i] = null;
                data.spine.node.scaleY = 1;
                node.setPosition(data.to);
                this.onArrivalHandle(node, data);
                // 当前动作无效，则直接退出
                if (!this.active) return;
            }
            // 从列表中移除null项
            for (let i = n - 1; i >= 0; i--) {
                if (!a[i]) a.splice(i, 1);
            }
        }
    }

    // 设置spine的动作，检查动作是否存在
    setAnimation(spine: sp.Skeleton, animation: string, loop: boolean, speed: number): boolean {
        if (PveTool.hasSpineAnimation(spine, animation)) {
            spine.loop = loop;
            spine.animation = animation;
            spine.timeScale = speed;
            return true;
        }
        // 找不到指定的动画名
        if (CC_DEBUG && spine.skeletonData) {
            cc.error(`缺少动作：${animation} , 文件名：${spine.skeletonData.name}, 技能ID：${this.model.id}`);
        }
        return false;
    }

    // 检测目标死亡
    checkTargetDie(node: cc.Node, data: ActionDataType) {
        let model = this.model;
        if (model == null ||
            model.config.target_num > 1 ||
            model.config.move_delay instanceof Array ||
            model.config.move_delay > 0) {
            // 非单个目标技能，或者为单目标多特效延迟模式
            return;
        }
        let index = data.index
        if (!model.effectType.search_after_dmg) {
            index = 0;
        }
        let target = this.ctrl.sceneModel.getFightBy(model.selectedTargets[index])
        if (!target || !target.isAlive) {
            this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
        }
    }

    // 计算节点的旋转角度
    setRotation(node: cc.Node, data: ActionDataType, ishit?: boolean) {
        let sync = (ishit === void 0) ? this.syncRotation : ishit;
        if (sync) {
            let from = node.getPos();
            if (MathUtil.distance(from, data.to) < 3) {
                from = data.from;
            }
            let angle = Math.atan2(from.y - data.to.y, from.x - data.to.x);
            let degree = angle * 180 / Math.PI;
            //node.angle = -(degree <= 0 ? -degree : 360 - degree);
            data.spine.node.angle = -(degree <= 0 ? -degree : 360 - degree);

        } else {
            // 还原角度
            node.angle = 0;
        }
    }

    // 节点到达事件
    onArrivalHandle(node: cc.Node, data: ActionDataType) {
        if (!this.active) return;
        if (!this.model) return;
        if (!this.ctrl) return;

        // 公用变量
        let model = this.model;
        let sceneModel = this.ctrl.sceneModel;
        let spine = data.spine;

        // 停止节点上的动作
        if (data.action) {
            spine.node.stopAction(data.action);
            let idx = this.actions.indexOf(data.action);
            if (idx >= 0) {
                this.actions.splice(idx, 1);
            }
            data.action = null;
        }

        // 保存目标坐标
        if (this.storeTargetPos) {
            model.targetPos = spine.node.getPosition();
        }

        // 对多个目标产生效果，并且只有一个特效，例如炮击效果
        if (!model.multiple) {
            let n = model.selectedTargets.length;
            if (model.targetNum > n) {
                let arr: PveFightCtrl[] = [];
                for (let i = 0; i < n; i++) {
                    let t = sceneModel.getFightBy(model.selectedTargets[i]);
                    if (t && t.isAlive) {
                        arr.push(t);
                    }
                }
                arr = PveTool.searchMoreTarget({
                    fight: model.attacker,
                    targetType: model.config.target_type,
                    pos: model.targetPos,
                    range: model.dmgRange,
                    num: model.targetNum,
                    targets: arr,
                });
                model.selectedTargets.length = 0;
                if (arr && arr.length) {
                    arr.forEach(t => model.selectedTargets.push(t.model.fightId));
                }
            }
        }

        // 广播hit事件
        this.ctrl.event.emit(PveSkillEvents.Hit);

        // // 击中音效
        // model.config.hit_sound &&
        //     GlobalUtil.isSoundOn &&
        //     gdk.sound.play(
        //         gdk.Tool.getResIdByNode(sceneModel.ctrl.node),
        //         model.config.hit_sound,
        //     );

        // 产生伤害由动画的伤害事件触发
        let index: number = data.index;
        // if (model.config.hit_animation == '') {
        //     // 优先使用配置文件中配置的动作名
        //     model.config.hit_animation = getPveSkillAnmNameValue(this.bombAnimation);
        // }
        //let animation: string = model.config.hit_animation;

        //支持配置多个动画随机选择
        let animation: any = model.config.hit_animation;
        if (typeof animation === 'object') {
            // 配置中动作为数组，则随机挑一个动作
            animation = animation[FightingMath.rnd(0, animation.length - 1)];
        }

        if (!animation || animation == '') {
            animation = getPveSkillAnmNameValue(this.bombAnimation);
        }
        //隐藏拖尾效果
        let et = this.model.effectType;
        if (typeof et.motion_bezier_args === 'object') {
            let streak = spine.node.getComponentInChildren(cc.MotionStreak);
            streak.enabled = false;
            streak.node.active = false;
        }

        let hen: PveFightAnmEvents = getPveFightAnmEventValue(this.hurtEventName);
        let loop = (model.dmgMul > 1 && !model.multiple);//model.continueTime > 0 || (model.dmgMul > 1 && !model.multiple);
        // 设置动画效果
        if (PveTool.hasSpineAnimation(spine, animation)) {

            // 链接效果时需要设置方向和终点坐标
            if (model.config.effect_type == 10 || model.config.effect_type == 22) {
                let spines: sp.Skeleton[] = this.spines;
                for (let i = 0, n = spines.length; i < n; i++) {
                    let spine = spines[i];
                    if (!spine) continue;
                    if (spine.isAnimationCached()) {
                        spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
                    }
                    // 角度
                    let temPos = spine.node.getPos();
                    let to: cc.Vec2 = model.attacker.getPos();
                    let angle: number = Math.atan2(temPos.y - to.y, temPos.x - to.x);
                    let degree: number = angle * 180 / Math.PI;
                    spine.node.angle = -(degree <= 0 ? -degree : 360 - degree);
                    // 坐标
                    let tem = spine.findBone('objective');
                    let root = spine.findBone('root');
                    if (tem && root) {
                        let localTo: cc.Vec2 = sceneModel.ctrl.thing.convertToWorldSpaceAR(to)//model.attacker.node.parent.convertToWorldSpaceAR(to);
                        localTo = spine.node.convertToNodeSpaceAR(localTo);
                        tem.x = localTo.x / root.scaleX;
                        tem.y = localTo.y / root.scaleY;
                    }
                }
            } else {
                // 旋转角度
                this.setRotation(spine.node, data, model.effectType.hit_rotation);
            }

            if (hen == PveFightAnmEvents.NONE) {
                // 直接产生伤害
                this.onDamage(spine, index);
            } else {
                // 不存在指定的事件名称，提示错误并直接产生伤害
                if (!PveTool.hasSpineEvent(spine, animation, hen)) {
                    CC_DEBUG && cc.error(`缺少事件：${hen} , 文件名：${spine.skeletonData.name}, 动作名：${animation}`);
                    this.onDamage(spine, index);
                }
            }
            // 监听事件
            spine.setEventListener((entry: any, event: any) => {
                let eventName: string = event.data.name;
                if (eventName == hen && hen != PveFightAnmEvents.NONE) {
                    // 攻击事件
                    this.onDamage(spine, index);
                }
                if (model && model.ctrl) {
                    onSpineEvent(
                        eventName,
                        model,
                        model.attacker,
                        model.selectedTargets[index] || model.selectedTargets[0],
                        spine.node.getPosition(),
                    );
                }
            });
            // 监听播放完成事件
            model.waitingCount++;
            spine.setCompleteListener(() => {
                model.waitingCount--;
                model.animationCount++;
                this.onComplete(model, spine);
            });

            //判断是否有受击特效修正字段
            let num: any = cc.js.isNumber(this.model.config.size_correction) ? this.model.config.size_correction : 0;
            if (num != 0) {
                spine.node.scale = 1 + num;
            }
            // 设置spine动作
            this.setAnimation(spine, animation, loop, this.timeScale);
        } else {
            // 设置动作失败，则直接产生伤害，并完成播放
            model.animationCount++;

            this.onDamage(spine, index);
            this.onComplete(model, spine);
        }
    }

    // 动画完成回调
    onComplete(model: PveSkillModel, spine: sp.Skeleton) {
        if (!model.ctrl) return;
        // 多特效技能，则无需对单个特效侦听多次完成事件
        let spines = model.ctrl.spines;
        let length = spines.length;
        if (length > 1) {
            spine.setCompleteListener(null);
        }
        spine.node.scale = 1;
        // 重新选择目标技能，则清除当前spine动画
        if (model.effectType.search_after_dmg) {
            PveTool.clearSpine(spine);
            PvePool.put(spine.node);
            let index = spines.indexOf(spine);
            if (index >= 0) {
                spines[index] = null;
            }
            spine = null;
        }
        // 非循环特效则隐藏
        if (spine && cc.isValid(spine.node)) {
            spine.node.active = spine.loop;
        }
        // 多段伤害，并且伤害次数已达上限
        if (model.damageCount >= model.dmgMul) {
            if (spine) {
                spine.setStartListener(null);
                spine.setEventListener(null);
            }
            if (model.animationCount >= length) {
                spine && spine.setCompleteListener(null);
                this.finish();
            }
        } else {
            // 多段伤害，并且伤害次数非最后一次
            if (model.damageCount < model.dmgMul && !model.multiple) {
                if (model.effectType.search_after_dmg) {
                    // 重新选择目标
                    this.broadcastEvent(PveFsmEventId.PVE_SKILL_RESEARCH);
                } else if (model.effectType.to_follow_pos) {
                    // 目标是否已全部死亡
                    let sceneModel = model.ctrl.sceneModel;
                    let b = model.selectedTargets.some(id => {
                        let t = sceneModel.getFightBy(id);
                        return t && t.isAlive;
                    });
                    if (!b) {
                        this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
                    }
                } else {
                    this.sendEvent(PveFsmEventId.PVE_SKILL_DAMAGED);
                }
            }
            // 等待计数
            if (spine && length <= 1 && this.model) {
                model.waitingCount++;
            }
        }
    }

    // 产生伤害回调
    onDamage(spine: sp.Skeleton, index: number) {
        if (!this.model) return;
        if (!this.ctrl) return;
        if (!cc.isValid(this.node)) return;
        let model = this.model;
        let ctrl = this.ctrl;
        // 伤害音效
        model.config.dmg_sound &&
            GlobalUtil.isSoundOn &&
            gdk.sound.play(
                gdk.Tool.getResIdByNode(ctrl.sceneModel.ctrl.node),
                model.config.dmg_sound,
            );
        // 伤害计算
        PveTool.evalSkillExpr(model, index);
        if (!model.attacker) return;
        if (!model.attacker.isAlive) return;
        ctrl.event.emit(PveSkillEvents.Hurt);
        model.damageCount++;
        // 生成召唤物
        this._callSomething(index);
        // 产生BUFF效果
        this._addBuffs();
    }

    // 生成召唤物
    _callSomething(index: number) {
        let model: PveSkillModel = this.model;
        let config: SkillCfg = model.config;
        let call_id: any = config.call_id;
        if (cc.js.isNumber(call_id) && call_id > 0) {
            let num: number = config.call_num;
            if (cc.js.isNumber(num) && num > 0) {
                let attacker = model.attacker;
                let am = attacker.model;
                let c = PveTool.getSkillCallConfig(call_id, am.prop.level);
                if (c) {
                    let sceneModel = model.ctrl.sceneModel;
                    let pos = this.getToPos(index);
                    switch (c.ai) {
                        case PveCalledAIType.OPPONENT_CALLED:
                        case PveCalledAIType.OPPONENT_CALLED_NOEFFECT:
                            // 竞技模式在对手场景添加召唤物，使用不同的PveSceneModel实现
                            let arenaSyncData = sceneModel.arenaSyncData;
                            sceneModel = sceneModel.isMirror ? arenaSyncData.mainModel : arenaSyncData.mirrorModel

                        case PveCalledAIType.CALLED:
                            // 召唤物
                            let removeCall = am.getProp('removeCall');
                            if (removeCall == null || removeCall == true) {
                                if (PveTool.hasCalled(sceneModel, am, call_id)) {
                                    sceneModel.removeCall(am.ctrl, call_id)
                                }
                            }
                            for (let i = 0; i < num; i++) {
                                PveFightUtil.createCaller(
                                    sceneModel,
                                    c.monster,
                                    config.call_time,
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
                                am.ctrl,
                                num,
                                c.monster,
                                pos,
                                null,
                                null,
                                null,
                                null,
                                null,
                                cc.js.isNumber(model.config.dmg_range) ? model.config.dmg_range : 0,
                            );
                            break;

                        case PveCalledAIType.TRAP:
                            let temPos: cc.Vec2 = pos;
                            //激光技能的陷阱位置修改
                            if (config.effect_type == 8) {
                                let from = this.getFromPos(index);
                                let to = pos;
                                // 计算角度
                                let angle: number = Math.atan2(to.y - from.y, to.x - from.x);
                                let cfg = ConfigManager.getItemById(Skill_trapCfg, c.monster);

                                if (cfg && cfg.range_type == 2) {
                                    //计算新坐标 r 就是两者的距离
                                    temPos = cc.v2(
                                        from.x + cfg.range[0] / 2 * Math.cos(angle),
                                        from.y + cfg.range[0] / 2 * Math.sin(angle)
                                    );
                                }
                            }
                            // 陷阱
                            for (let i = 0; i < num; i++) {
                                PveFightUtil.createTrap(
                                    sceneModel,
                                    c.monster,
                                    config.call_time,
                                    temPos,
                                    attacker,
                                );
                            }
                            //特定英雄使用特定技能作用怪物数量检测
                            if (attacker && attacker.sceneModel.gateconditionUtil && attacker.sceneModel.gateconditionUtil.heroUseSkillOnMonsterNumLimit.length > 0) {
                                attacker.sceneModel.gateconditionUtil.heroUseSkillOnMonsterNumLimit.forEach(index => {
                                    let data = attacker.sceneModel.gateconditionUtil.DataList[index];
                                    if (attacker.model.config.id == data.cfg.data1 && model.id == data.cfg.data2) {
                                        data.curData += num;
                                        data.state = data.curData >= data.cfg.data3;
                                    }
                                })
                            }
                            break;

                        case PveCalledAIType.GATE:
                            // 传送阵
                            for (let i = 0; i < num; i++) {
                                PveFightUtil.createGate(
                                    sceneModel,
                                    'dynamic_' + c.monster,
                                    c.monster,
                                    config.call_time,
                                    pos,
                                    attacker,
                                    c.args,
                                );
                            }
                            break;
                    }
                }
            }
        }
    }

    // 非伤害对象类型相同的BUFF效果
    _addBuffs() {
        let model: PveSkillModel = this.model;
        let config: SkillCfg = model.config;
        let buff_target_type: any = config.buff_target_type;
        if (cc.js.isNumber(buff_target_type) &&
            buff_target_type != config.target_type) {
            // 如果有特别的附加状态目标规则，则添加BUFF
            let a = model.attacker;
            let s = this.ctrl.sceneModel;
            let c = ConfigManager.getItemById(Skill_target_typeCfg, config.buff_target_type);
            let r = config.buff_range;
            let p = a.getPos();
            let all = s.fightSelector.getAllFights(a, c, s, null, p, r);
            if (all && all.length > 0) {
                // 查找所有可攻击的目标
                let buff_num: any = config.buff_num;
                all = s.fightSelector.circleSelect(all, p, c.priority_type, r, buff_num);
                if (all && all.length > 0) {
                    let attacker_id = a.model.fightId;
                    let attacker_prop = a.model.prop;
                    for (let i = 0, n = all.length; i < n; i++) {
                        PveTool.addBuffsTo(
                            attacker_id,
                            attacker_prop,
                            all[i],
                            config.buff_id,
                            config.buff_time,
                            config['buff_args'],
                        );
                    }
                }
            }
        }
    }

    // 放法者死亡了，则清除此技能
    onAttackerDie() {
        let speed: number = this.timeScale;
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            if (spine && spine.timeScale <= 0) {
                spine.timeScale = speed;
            }
        }
        this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
    }

    @gdk.binding('ctrl.sceneModel.timeScale')
    _setTimeScale() {
        if (!this.model) return;
        if (!cc.isValid(this.model.ctrl, true)) return;
        let speed: number = this.timeScale;
        for (let i = 0, n = this.actions.length; i < n; i++) {
            let action = this.actions[i];
            if (action['setSpeed']) {
                action['setSpeed'](speed);
            }
        }
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            if (!spine) continue;
            spine.timeScale = speed;
        }
    }

    onExit() {
        // 移除施法者死亡事件监听器
        let attacker = this.model.attacker;
        if (attacker && attacker.onDie) {
            attacker.onDie.off(this.onAttackerDie, this);
        }
        // 移除动作
        let hashTargets = cc.director.getActionManager()['_hashTargets'];
        for (let i = 0, n = this.actions.length; i < n; i++) {
            let action = this.actions[i];
            let isActioning = action != null && action.isDone() == false;
            if (isActioning) {
                let node = action.getOriginalTarget();
                if (!!node &&
                    !!hashTargets[node['_id']]
                ) {
                    node.stopAction(action);
                }
            }
        }
        this.actions.length = 0;
        this.updateDatas.length = 0;
        super.onExit();
    }
}