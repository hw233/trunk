import MathUtil from '../../../../common/utils/MathUtil';
import PveEnemyCtrl from '../../ctrl/fight/PveEnemyCtrl';
import PveEnemyModel from '../../model/PveEnemyModel';
import PvePool from '../../utils/PvePool';
import PveRoadUtil from '../../utils/PveRoadUtil';
import PveSkillLinearMotionAction from './PveSkillLinearMotionAction';
import { PveActionTag } from '../../const/PveActionTag';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { PveFightType } from '../../core/PveFightModel';

/**
 * Pve技能直线弹道拖拽目标动作
 * @Author: yaozu.hu
 * @Date: 2019-08-20 10:48:12
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-10 14:31:21
 */
const { property } = cc._decorator;
const cos = Math.cos;
const min = Math.min;

@gdk.fsm.action("PveSkillLinkDragTargetAction", "Pve/Skill")
export default class PveSkillLinkDragTargetAction extends PveSkillLinearMotionAction {

    targetActions: cc.Action[] = [];
    gouziNodes: cc.Node[] = [];

    update(dt: number) {
        if (this.gouziNodes.length == 0) return;
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            let tem = spine.findBone('objective') //gouzi objective
            let root = spine.findBone('root')
            if (tem && root) {
                let to: cc.Vec2 = this.node.convertToWorldSpaceAR(this.gouziNodes[i].getPos());
                let localTo: cc.Vec2 = spine.node.convertToNodeSpaceAR(to);
                tem.x = localTo.x / root.scaleX;
                tem.y = localTo.y / root.scaleY;
            }
        }
    }

    spineRunAction(animation: string, speed: number) {
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            spine.paused = false;
            spine.node.active = true;
            this.setAnimation(spine, animation, true, speed);
            // action
            let action: cc.Action = this.getAction(i, spine);
            if (action) {
                //let tem = spine.findBone('gouzi')
                if (this.gouziNodes[i] == null) {
                    this.gouziNodes[i] = PvePool.get(cc.Node);
                    this.gouziNodes[i].setPosition(spine.node.getPos());
                }
                this.gouziNodes[i].runAction(action);
                //spine.node.runAction(action);
                action['setSpeed'](speed);
                this.actions.push(action);
            } else {
                // 无需动作，则直接调用
                this.onArrivalHandle(spine.node, this.getData(i, spine));
            }
        }
    }

    getAction(index: number, spine: sp.Skeleton): cc.Action {
        spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
        let from: cc.Vec2 = this.getFromPos(index);
        let to: cc.Vec2 = this.getToPos(index);
        let dis: number = MathUtil.distance(from, to);
        let dt: number = dis / this.speed;
        let node: cc.Node = spine.node;
        let data = this.getData(index, spine);
        data.from = from;
        data.to = this.getToPos(index, dt);
        data.action = cc.speed(
            cc.sequence(
                cc.spawn(
                    cc.callFunc(this.setRotation, this, data),
                    cc.moveTo(dt, data.to).easing(this.easeFun),
                ),
                cc.callFunc(this.startDragAction, this),
                cc.spawn(
                    cc.moveTo(dt, data.from).easing(this.easeFun),
                    cc.callFunc(this.setRotation, this, data),
                ),
                cc.callFunc(this.onArrivalHandle, this, data)
            ),
            this.ctrl.sceneModel.timeScale
        );
        node.setPosition(data.from);
        return data.action;
    }

    startDragAction(node: cc.Node) {
        if (!this.ctrl || !this.model) return;
        let speed: number = this.ctrl.sceneModel.timeScale;
        let targets = this.model.selectedTargets;
        this.model.targetPos = this.getFromPos(0);
        let num = 0;
        for (let i = 0, n = targets.length; i < n; i++) {
            let target = this.ctrl.sceneModel.getFightBy(targets[i]);
            if (target && target.isAlive) {
                // 判断目标是否屏蔽拖拽效果
                if (target.model.prop.invisible_drag &&
                    cc.js.isString(target.model.prop.invisible_drag) &&
                    parseInt(target.model.prop.invisible_drag) == this.model.config.skill_id) {
                    continue;
                }
                let action: cc.Action = this.getDragAction(target);
                if (action) {
                    target.node.runAction(action);
                    action['setSpeed'](speed);
                    this.targetActions.push(action);
                }
                num += 1;
            }
        }
        //直线拉回类型技能拉回多少怪物数量检测
        if (this.model.attacker && this.model.attacker.sceneModel.gateconditionUtil && this.model.attacker.sceneModel.gateconditionUtil.heroUseSkillDragTargetNumLimit.length > 0) {
            this.model.attacker.sceneModel.gateconditionUtil.heroUseSkillDragTargetNumLimit.forEach(index => {
                let data = this.model.attacker.sceneModel.gateconditionUtil.DataList[index];
                if (this.model.attacker.model.config.id == data.cfg.data1 && this.model.id == data.cfg.data2) {
                    data.curData += num;
                    data.state = data.curData >= data.cfg.data3;
                }
            })
        }
    }

    getDragAction(target: PveFightCtrl) {
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
                cc.callFunc(this.onArrivalHandleTaraet, this, target),
            ),
            this.ctrl.sceneModel.timeScale
        );
        action.setTag(PveActionTag.DRAG);
        return action;
    }

    onArrivalHandleTaraet(node: cc.Node, target: PveFightCtrl) {
        let action = node.getActionByTag(PveActionTag.DRAG);
        let index = this.targetActions.indexOf(action);
        if (index >= 0) {
            this.targetActions.splice(index, 1);
        }
        node.stopAction(action);
        // 寻找离施法者最近的点做为路径起点
        if (target.model.type === PveFightType.Enemy) {
            let t: PveEnemyCtrl = target as PveEnemyCtrl;
            let m: PveEnemyModel = t.model as PveEnemyModel;
            m.road = PveRoadUtil.getShortestRoadBy(t.getPos(), t.sceneModel.tiled.roads[m.roadIndex]);
            m.targetPos = null;
        }
    }

    @gdk.binding('ctrl.sceneModel.timeScale')
    _setTimeScale() {
        if (!this.model) return;
        if (!cc.isValid(this.model.ctrl, true)) return;
        let speed: number = this.timeScale;
        for (let i = 0, n = this.targetActions.length; i < n; i++) {
            let action = this.targetActions[i];
            action['setSpeed'](speed);
        }
        super._setTimeScale();
    }

    onExit() {
        // 移除目标的拖拽动作
        let hashTargets = cc.director.getActionManager()['_hashTargets'];
        for (let i = 0, n = this.targetActions.length; i < n; i++) {
            let action = this.targetActions[i];
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
        // 回收钩子节点
        for (let i = 0, n = this.gouziNodes.length; i < n; i++) {
            let node = this.gouziNodes[i];
            node.stopAllActions();
            PvePool.put(node);
        }
        this.gouziNodes.length = 0;
        super.onExit();
    }
}
