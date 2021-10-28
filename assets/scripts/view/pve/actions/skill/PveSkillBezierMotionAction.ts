import MathUtil from '../../../../common/utils/MathUtil';
import PveSkillLinearMotionAction from './PveSkillLinearMotionAction';

/**
 * Pve技能曲线轨迹效果动作
 * @Author: sthoo.huang
 * @Date: 2019-05-05 16:35:44
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-03-31 10:20:12
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSkillBezierMotionAction", "Pve/Skill")
export default class PveSkillBezierMotionAction extends PveSkillLinearMotionAction {

    @property({ tooltip: "中间控制点参数1" })
    param1: number = 4.0;

    @property({ tooltip: "中间控制点参数2" })
    param2: number = 1.0;

    @property({ tooltip: "最大飞行时间" })
    maxTime: number = 0.5;

    getAction(index: number, spine: sp.Skeleton): cc.Action {
        // 使用外部参数
        let args = this.model.effectType.motion_bezier_args;
        if (typeof args === 'object') {
            this.ease = args[0];
            this.easeParam = args[1];
            this.maxTime = args[2];
            this.param1 = args[3];
            this.param2 = args[4];
        }
        let from: cc.Vec2 = this.getFromPos(index);
        let to: cc.Vec2 = this.getToPos(index);
        let dis: number = MathUtil.distance(from, to);
        let dt: number = Math.min(this.maxTime, dis / this.speed);
        // 计算三个控制点
        let width = to.x - from.x;
        let pts: cc.Vec2[] = [
            cc.v2(
                width * (1 - this.param1 / 10),
                dis * (1 - this.param1 / 10),
            ),
            cc.v2(
                width * (1 - this.param2 / 10),
                dis * (1 - this.param2 / 10),
            ),
            cc.v2(width, to.y - from.y),
        ];
        let data = this.getData(index, spine);
        data.to = this.getToPos(index, dt);
        data.action = cc.speed(
            cc.sequence(
                cc.spawn(
                    cc.bezierBy(dt, pts).easing(this.easeFun),
                    cc.callFunc(this.setRotation, this, data),
                    cc.callFunc(this.checkTargetDie, this, data),
                ),
                cc.callFunc(this.onArrivalHandle, this, data),
            ),
            this.ctrl.sceneModel.timeScale,
        );
        spine.node.setPosition(data.from);
        return data.action;
    }
}