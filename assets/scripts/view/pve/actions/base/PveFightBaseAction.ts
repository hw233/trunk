import PveBaseFightCtrl from '../../ctrl/fight/PveBaseFightCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import { PveBaseFightModel } from '../../model/PveBaseFightModel';

/**
 * Pve战斗单元动作基类
 * @Author: sthoo.huang
 * @Date: 2019-05-21 10:30:39
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-05-21 10:32:28
 */

@gdk.fsm.action("PveFightBaseAction", "Pve/Base")
export default class PveFightBaseAction extends gdk.fsm.FsmStateAction {

    ctrl: PveBaseFightCtrl;
    model: PveBaseFightModel;
    sceneModel: PveSceneModel;

    onEnter() {
        this.ctrl = this.node.getComponent(PveBaseFightCtrl);
        this.model = this.ctrl.model;
        this.sceneModel = this.ctrl.sceneModel;
    }

    onExit() {
        this.ctrl = null;
        this.model = null;
        this.sceneModel = null;
    }

}