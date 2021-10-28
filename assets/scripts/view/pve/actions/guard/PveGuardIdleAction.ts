import MathUtil from '../../../../common/utils/MathUtil';
import PveFightIdleAction from '../base/PveFightIdleAction';
import PveGuardCtrl from '../../ctrl/fight/PveGuardCtrl';
import PveGuardModel from '../../model/PveGuardModel';
import PveSceneState from '../../enum/PveSceneState';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveSoldierDir } from '../../const/PveDir';

/**
 * Pve守卫待机动作
 * @Author: sthoo.huang
 * @Date: 2019-05-16 16:29:06
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-30 14:36:13
 */
const abs = Math.abs;
const ceil = Math.ceil;

@gdk.fsm.action("PveGuardIdleAction", "Pve/Guard")
export class PveGuardIdleAction extends PveFightIdleAction {

    model: PveGuardModel;
    ctrl: PveGuardCtrl;
    animation: string;
    standTime: number;  // 站立冷却，如果不能攻击超过此时间才会返回起点

    onEnter() {
        super.onEnter();
        this.standTime = 3;
        this.setAnimation(PveFightAnmNames.IDLE);
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (this.sceneModel.state != PveSceneState.Fight) return;
        // 攻速为0则不攻击
        let model = this.model;
        let scale: number = this.model.speedScale;
        if (scale <= 0) {
            return;
        }
        // 站立计算
        let target = model.targetId > 0 ? this.sceneModel.getFightBy(model.targetId) : null;
        if (!target) {
            // 没有目标，则站立
            this.standTime -= dt * scale;
            if (this.standTime > 0) {
                // 站立没有超时, 则原地待命
                this.setAnimation(PveFightAnmNames.IDLE);
                return;
            }
        } else {
            // 还原冷却
            this.standTime = 3;
        }
        // 计算方向
        let to = target ? target.getPos() : this.ctrl.getOrignalPos();
        this.ctrl.setDir(to);
        // 计算速度
        let from: cc.Vec2 = this.node.getPos();
        let dis: number = MathUtil.distance(from, to);
        if (!target || dis > model.atkDis) {
            // 没有目标或者在攻击距离之外
            if (dis > 0 && (!target || dis > model.atkDis)) {
                let tm: number = dt * model.speed * scale;
                let dx: number = (to.x - from.x) / dis * tm;
                let dy: number = (to.y - from.y) / dis * tm;
                if (abs(to.x - this.node.x) > ceil(abs(dx)) ||
                    abs(to.y - this.node.y) > ceil(abs(dy))) {
                    // 前进一步
                    this.ctrl.setPos(
                        this.node.x + dx,
                        this.node.y + dy,
                    );
                    this.setAnimation(PveFightAnmNames.WALK);
                } else {
                    // 到达目标
                    this.ctrl.setPos(to.x, to.y);
                    this.setAnimation(PveFightAnmNames.IDLE);
                }
            }
        } else {
            // 在攻击距离之内
            this.setAnimation(PveFightAnmNames.IDLE);
        }
    }

    setAnimation(v: PveFightAnmNames) {
        if (this.model.dir == PveSoldierDir.None) this.model.dir = PveSoldierDir.DOWN_LEFT
        let anm: string = StringUtils.format("{0}_{1}", v, this.model.dir);
        if (anm == this.animation) return;
        this.animation = anm;
        this.ctrl.setAnimation(v, { mode: 'set' });
    }

    onExit() {
        this.ctrl.removePrePos();
        this.animation = null;
        super.onExit();
    }
}