import PveFightBaseAction from '../base/PveFightBaseAction';
/**
 * 怪物自定义状态
 * @Author: sthoo.huang
 * @Date: 2020-06-01 15:21:05
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-01 20:06:52
 */

@gdk.fsm.action("PveFightCustomAction", "Pve/Base")
export default class PveFightCustomAction extends PveFightBaseAction {

    onEnter() {
        super.onEnter();
        this.model.customState = true;
    }

    onExit() {
        this.model.customState = false;
        super.onExit();
    }

    // onDestroy() {
    // }
    // update(dt: number) {
    // }
}