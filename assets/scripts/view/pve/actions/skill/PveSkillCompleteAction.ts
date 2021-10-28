import PveSkillBaseAction from '../base/PveSkillBaseAction';
import { PveSkillEvents } from '../../const/PveAnimationNames';

/**
 * PVE技能完成动作
 * @Author: sthoo.huang
 * @Date: 2019-04-30 13:58:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-03 10:20:07
 */

@gdk.fsm.action("PveSkillCompleteAction", "Pve/Skill")
export default class PveSkillCompleteAction extends PveSkillBaseAction {

    onEnter() {
        super.onEnter();
        if (this.model.waitingCount > 0) {
            // 有动画还没播放完，则等待动画播放完成再结束
            gdk.Timer.loop(1 / 12, this, this._update);
        } else {
            this.finish();
        }
    }

    onExit() {
        // 清除计时器
        gdk.Timer.clear(this, this._update);
        // 移除spine事件监听器
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            if (spine) {
                // spine.node.stopAllActions();
                spine.setCompleteListener(null);
                spine.setEventListener(null);
                spine.setStartListener(null);
            }
        }
        this.ctrl.event && this.ctrl.event.emit(PveSkillEvents.Complete);
        super.onExit();
    }

    _update() {
        if (this.model.waitingCount > 0) return;
        this.finish();
    }

}