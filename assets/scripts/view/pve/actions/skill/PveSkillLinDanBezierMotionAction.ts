import MathUtil from '../../../../common/utils/MathUtil';
import PveSkillLinearMotionAction from './PveSkillLinearMotionAction';

/**
 * Pve技能曲线轨迹效果动作(林丹普攻)
 * @Author: yaozu.hu
 * @Date: 2019-05-05 16:35:44
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-03-31 10:20:15
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSkillLinDanBezierMotionAction", "Pve/Skill")
export default class PveSkillLinDanBezierMotionAction extends PveSkillLinearMotionAction {

    @property({ tooltip: "中间控制点参数,两点距离的1/n" })
    param1: number = 3;

    @property({ tooltip: "抛物线轨迹左右的顺序,1为先左后右，-1为先右后左" })
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
        let data = this.getData(index, spine);
        //data.to = this.getToPos(index, dt);
        let move_delay: number = 0;
        let config = this.model.config;
        if (config.move_delay instanceof Array) {
            // 配置不同的值
            move_delay = config.move_delay[index] || 0;
        } else if (cc.js.isNumber(config.move_delay)) {
            // 配置值为数字
            move_delay = config.move_delay;
        }
        data.to = this.getToPos(index, dt + move_delay);

        let temNum = this.param2;
        if (index % 2 == 0) {
            temNum = -temNum;
        }
        let temp = to.sub(from).normalize()
        let temp1 = cc.v2(temp.x, temp.y).rotate(Math.PI / 2)//temp.rotate(Math.PI / 2)
        let temp2 = cc.v2(from.x + (to.x - from.x) / 2, from.y + (to.y - from.y) / 2)
        let temp3 = temp2.add(temp1.mul(dis / this.param1 * temNum))
        let pts: cc.Vec2[] = [
            temp3,
            temp3,
            to,
        ];
        data.action = cc.speed(
            cc.sequence(
                cc.delayTime(move_delay),
                cc.fadeIn(0),
                cc.spawn(
                    cc.bezierTo(dt, pts).easing(this.easeFun),
                    cc.callFunc(this.setRotation, this, data),
                    cc.callFunc(this.checkTargetDie, this, data),
                ),
                cc.callFunc(this.onArrivalHandle, this, data),
            ),
            this.ctrl.sceneModel.timeScale,
        );
        spine.node.opacity = 0;
        spine.node.setPosition(data.from);
        return data.action;
    }

}