import PveSceneCtrl from '../../ctrl/PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';

/**
 * Pve场景基础动作
 * @Author: sthoo.huang
 * @Date: 2019-05-21 12:01:07
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-05-21 14:08:05
 */
@gdk.fsm.action("PveSceneBaseAction", "Pve/Base")
export default class PveSceneBaseAction extends gdk.fsm.FsmStateAction {

    model: PveSceneModel;
    ctrl: PveSceneCtrl;

    onEnter() {
        this.ctrl = this.node.getComponent(PveSceneCtrl);
        this.model = this.ctrl.model;
    }

    onExit() {
        this.ctrl = null;
        this.model = null;
    }
}