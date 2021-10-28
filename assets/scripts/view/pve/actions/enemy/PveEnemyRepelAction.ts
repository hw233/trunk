import PveFightBaseAction from '../base/PveFightBaseAction';
/**
 * 怪物被击退动作
 * @Author: sthoo.huang
 * @Date: 2020-06-01 15:36:34
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-01 15:36:34
 */

@gdk.fsm.action("PveEnemyRepelAction", "Pve/Enemy")
export default class PveEnemyRepelAction extends PveFightBaseAction {

    // 击退多长时间返回至正常状态
    wait: number = 1.0;

    onEnter() {
        super.onEnter();
        this.wait = 1.0;
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        this.wait -= dt;
        if (this.wait <= 0) {
            this.finish();
        }
    }

    // onExit() {
    // }
    // onDestroy() {
    // }
    // update(dt: number) {
    // }
}