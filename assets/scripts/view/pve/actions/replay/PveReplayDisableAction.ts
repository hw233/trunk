import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveTool from '../../utils/PveTool';

/**
 * PVE场景移除所有单位动作
 * @Author: sthoo.huang
 * @Date: 2020-04-16 21:53:04
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-04-16 21:53:04
 */

@gdk.fsm.action("PveReplayDisableAction", "Pve/Replay")
export default class PveReplayDisableAction extends PveSceneBaseAction {

    onEnter() {
        super.onEnter();
        PveTool.removeSceneNodes(this.ctrl);
        this.finish();
    }
}