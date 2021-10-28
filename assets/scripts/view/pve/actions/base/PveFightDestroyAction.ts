import PveFightBaseAction from './PveFightBaseAction';
import PveSceneState from '../../enum/PveSceneState';

/**
 * PVE战斗对象销毁动作
 * @Author: sthoo.huang
 * @Date: 2019-06-06 11:55:41
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-09 15:12:21
 */

@gdk.fsm.action("PveFightDestroyAction", "Pve/Base")
export default class PveFightDestroyAction extends PveFightBaseAction {

    onEnter() {
        super.onEnter();
        this.ctrl.hide(this.sceneModel.state == PveSceneState.Fight);
        this.finish();
    }
}