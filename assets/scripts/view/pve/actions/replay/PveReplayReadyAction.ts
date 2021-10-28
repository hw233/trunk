import PveSceneReadyAction from '../scene/PveSceneReadyAction';

/**
 * PVE场景准备场景动作动作
 * @Author: sthoo.huang
 * @Date: 2020-04-16 21:44:41
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-04-16 21:44:41
 */
@gdk.fsm.action("PveReplayReadyAction", "Pve/Replay")
export default class PveReplayReadyAction extends PveSceneReadyAction {

    _finish() {
        this.finish();
    }
}