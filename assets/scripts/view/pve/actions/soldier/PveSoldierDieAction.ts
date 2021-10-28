import PveFightBaseAction from '../base/PveFightBaseAction';
import PveSoldierCtrl from '../../ctrl/fight/PveSoldierCtrl';
import PveSoldierModel from '../../model/PveSoldierModel';
/**
 * Pve小兵死亡动作
 * @Author: sthoo.huang
 * @Date: 2020-10-27 20:03:50
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-30 10:23:49
 */

@gdk.fsm.action("PveSoldierDieAction", "Pve/Soldier")
export default class PveSoldierDieAction extends PveFightBaseAction {

    model: PveSoldierModel;
    ctrl: PveSoldierCtrl;

    onEnter() {
        super.onEnter();
        let model = this.model;
        let ctrl = this.ctrl;
        // ctrl.setAnimation(PveFightAnmNames.DIE, { mode: 'set', loop: false });
        // 隐藏 spine
        ctrl.spines.forEach(n => n.node.active = false);
        model.removeTempProp();
        model.targetId = -1;
        model.double_hit = 0;
        // 清除所有BUFF
        if (ctrl.buff) {
            ctrl.buff.clearAll();
        }
        // 清除所有光环
        if (ctrl.halo) {
            ctrl.halo.clearAll();
        }
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (this.model.hp > 0) {
            this.finish();
        }
    }

    onExit() {
        this.ctrl.spines.forEach(n => n.node.active = true);
        super.onExit();
    }
}