import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveSceneState from '../../enum/PveSceneState';

/**
 * PVE场景错误动作
 * @Author: sthoo.huang
 * @Date: 2020-07-28 11:10:30
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-07-28 11:11:33
 */
@gdk.fsm.action("PveSceneErrorAction", "Pve/Scene")
export default class PveSceneErrorAction extends PveSceneBaseAction {

    onEnter() {
        super.onEnter();
        this.model.state = PveSceneState.Ready;
        this.finish();
    }
}