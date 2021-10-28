import MathUtil from '../../../../common/utils/MathUtil';
import PveEnemyCtrl from '../../ctrl/fight/PveEnemyCtrl';
import PveEnemyModel from '../../model/PveEnemyModel';
import PveFightModel, { PveFightType } from '../../core/PveFightModel';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveRoadUtil from '../../utils/PveRoadUtil';
import PveSkillBaseAction from '../base/PveSkillBaseAction';
import { PveActionTag } from '../../const/PveActionTag';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { PveSkillType } from '../../const/PveSkill';

/**
 * Pve技能拉近目标动作
 * @Author: sthoo.huang
 * @Date: 2019-06-24 10:36:08
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-05-12 16:50:49
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSkillDragTargetAction", "Pve/Skill")
export default class PveSkillDragTargetAction extends PveSkillBaseAction {

    @property({ type: gdk.EaseType, tooltip: "缓动函数" })
    ease: gdk.EaseType = gdk.EaseType.easeLinear;

    @property({ tooltip: "缓动参数" })
    easeParam: number = 3.0;

    actions: cc.Action[] = [];

    onEnter() {
        super.onEnter();
        let speed: number = this.timeScale;
        let targets = this.model.selectedTargets;
        for (let i = 0, n = targets.length; i < n; i++) {
            let target = this.ctrl.sceneModel.getFightBy(targets[i]);
            if (target && target.isAlive) {
                let action: cc.Action = this.getAction(target);
                if (action) {
                    target.node.runAction(action);
                    action['setSpeed'](speed);
                    this.actions.push(action);
                }
            }
        }
        // 没有目标对象，则技能直接结束
        if (this.actions.length == 0) {
            this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
        }
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

    get timeScale() {
        let speed: number = 1;
        if (this.model.attacker) {
            let model: PveFightModel = this.model.attacker.model;
            if (model && model.ready) {
                // 攻速只针对普攻有效(403普攻不受攻速影响)
                if (PveSkillType.isNormal(this.model.config.type) && this.model.config.type != 403) {
                    speed += model.atkSpeed;
                }
                speed *= model.speedScale;
            }
        }
        return this.ctrl.sceneModel.timeScale * speed;
    }

    getAction(target: PveFightCtrl): cc.Action {
        let from: cc.Vec2 = target.getPos();
        let to: cc.Vec2 = this.model.attacker.getPos();
        let dis: number = Math.max(0, MathUtil.distance(from, to) - 50);
        // 计算角度
        let angle: number = Math.atan2(to.y - from.y, to.x - from.x);
        //计算新坐标 r 就是两者的距离
        let pos: cc.Vec2 = cc.v2(
            from.x + dis * Math.cos(angle),
            from.y + dis * Math.sin(angle)
        );
        let dt: number = dis / this.speed;
        let action: cc.Action = target.node.getActionByTag(PveActionTag.DRAG);
        if (action && !action.isDone()) {
            // 正在被其他动作拖拽，则直接执行完成函数
            let a: any = action['_innerAction']._actions[1];
            a.setTarget(target.node);
            a.execute();
        }
        action = cc.speed(
            cc.sequence(
                cc.moveTo(dt, pos).easing(this.easeFun),
                cc.callFunc(this.onArrivalHandle, this, target),
            ),
            this.ctrl.sceneModel.timeScale
        );
        action.setTag(PveActionTag.DRAG);
        return action;
    }

    onArrivalHandle(node: cc.Node, target: PveFightCtrl) {
        let action = node.getActionByTag(PveActionTag.DRAG);
        let index = this.actions.indexOf(action);
        if (index >= 0) {
            this.actions.splice(index, 1);
        }
        node.stopAction(action);
        // 寻找离施法者最近的点做为路径起点
        if (target.model.type === PveFightType.Enemy) {
            let t: PveEnemyCtrl = target as PveEnemyCtrl;
            let m: PveEnemyModel = t.model as PveEnemyModel;
            m.road = PveRoadUtil.getShortestRoadBy(t.getPos(), t.sceneModel.tiled.roads[m.roadIndex]);
            m.targetPos = null;
        }
        // 所有动作已完成
        if (this.actions.length < 1) {
            this.finish();
        }
    }

    @gdk.binding('ctrl.sceneModel.timeScale')
    _setTimeScale() {
        if (!this.model) return;
        if (!cc.isValid(this.model.ctrl, true)) return;
        let speed: number = this.timeScale;
        for (let i = 0, n = this.actions.length; i < n; i++) {
            let action = this.actions[i];
            action['setSpeed'](speed);
        }
    }

    onExit() {
        // 移除目标的拖拽动作
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
        super.onExit();
    }
}