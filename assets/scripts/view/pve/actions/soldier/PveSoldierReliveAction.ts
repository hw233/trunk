import PveFightBaseAction from '../base/PveFightBaseAction';
import PveSoldierModel from '../../model/PveSoldierModel';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
/**
 * Pve小兵复活动作
 * @Author: sthoo.huang
 * @Date: 2020-10-27 20:05:20
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-27 20:05:20
 */

@gdk.fsm.action("PveSoldierReliveAction", "Pve/Soldier")
export default class PveSoldierReliveAction extends PveFightBaseAction {

    model: PveSoldierModel;
    time: number;

    onEnter() {
        super.onEnter();
        this.model.ready = true;
        this.model.hp = this.model.hpMax;
        this.ctrl.setAnimation(PveFightAnmNames.IDLE);
        // 延迟0.2秒，等待光环效果
        this.time = 0.2;
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        this.time -= dt;
        if (this.time <= 0) {
            this.finish();
        }
    }
}