
import MathUtil from "../../../../common/utils/MathUtil";
import { PveFightAnmNames } from "../../const/PveAnimationNames";
import PveLittleGameGeneralCtrl from "../../ctrl/littleGame/PveLittleGameGeneralCtrl";
import PveFsmEventId from "../../enum/PveFsmEventId";
import PveLittleGameModel from "../../model/PveLittleGameModel";

const abs = Math.abs;
const ceil = Math.ceil;

@gdk.fsm.action("PveLittleGameGeneralWalkAction", "Pve/LittleGame")
export default class PveLittleGameGeneralWalkAction extends gdk.fsm.FsmStateAction {

    ctrl: PveLittleGameGeneralCtrl;
    sceneModel: PveLittleGameModel;
    status: number;

    onEnter() {
        this.ctrl = this.node.getComponent(PveLittleGameGeneralCtrl);
        this.sceneModel = this.ctrl.sceneModel;
        this.sceneModel.generalMoveState = true;
        let animStr = PveFightAnmNames.WALK;
        this.ctrl.setAnimation(animStr, { mode: 'set', loop: true });
        this.status = 0;
        this.ctrl.targetIndex = 0;
        this.ctrl.targetPos = null;

    }


    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (this.status > 0) {
            // 已经改变状态
            return;
        }
        let model = this.sceneModel;

        if (model.generalTargetPosIndex == 0) {
            // 到达被保护对象
            this.finish();
            return;
        }

        let speed = this.ctrl.speed
        if (!this.active) {
            // 当前动作已经无效
            return;
        }
        let node = this.node;
        let ctrl = this.ctrl;
        if (ctrl.curPosIndex == model.generalTargetPosIndex) {
            //抵达终点
            ctrl.fsm.sendEvent(PveFsmEventId.PVE_LITTLEGAME_GENERAL_ATK);
            return;

        }
        if (speed > 0 && node) {
            // 更新目标坐标并设置方向
            if (!ctrl.targetPos && ctrl.curPosIndex != model.generalTargetPosIndex) {
                let temIndex = ctrl.curPosIndex < model.generalTargetPosIndex ? ctrl.curPosIndex + 1 : ctrl.curPosIndex - 1
                ctrl.targetPos = ctrl.road[temIndex];
                ctrl.targetIndex = temIndex;
                ctrl.setDir(ctrl.targetPos);
            }
            let to: cc.Vec2 = ctrl.targetPos
            if (to == null) {
                //ctrl.setDir(model.targetPos);
                return;
            }
            // 设置动作为行走
            let animStr = PveFightAnmNames.WALK;
            ctrl.setAnimation(animStr, { mode: 'set' });
            // 移动位置
            let len: number = dt * speed;
            let from: cc.Vec2 = node.getPos();
            let dis: number = MathUtil.distance(from, to);
            let dx: number = (to.x - from.x) / dis * len;
            let dy: number = (to.y - from.y) / dis * len;
            if (abs(to.x - from.x) > ceil(abs(dx)) ||
                abs(to.y - from.y) > ceil(abs(dy))) {
                // 设置单步坐标
                ctrl.setPos(
                    node.x + dx,
                    node.y + dy,
                );
            } else {
                // 到达目标
                ctrl.setPos(to.x, to.y);
                ctrl.curPosIndex = ctrl.targetIndex;
                ctrl.targetIndex = 0;
                ctrl.targetPos = null;

            }
        }

    }


    onExit() {
        this.sceneModel.generalMoveState = false;
        this.status = 0;
        this.ctrl = null;
        this.sceneModel = null;
    }

}
