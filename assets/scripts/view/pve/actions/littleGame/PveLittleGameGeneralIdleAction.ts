import { PveFightAnmNames } from "../../const/PveAnimationNames";
import PveLittleGameGeneralCtrl from "../../ctrl/littleGame/PveLittleGameGeneralCtrl";
import PveLittleGameModel from "../../model/PveLittleGameModel";

@gdk.fsm.action("PveLittleGameGeneralIdleAction", "Pve/LittleGame")
export default class PveLittleGameGeneralIdleAction extends gdk.fsm.FsmStateAction {

    ctrl: PveLittleGameGeneralCtrl;
    sceneModel: PveLittleGameModel;

    onEnter() {
        this.ctrl = this.node.getComponent(PveLittleGameGeneralCtrl);
        this.sceneModel = this.ctrl.sceneModel;
        this.ctrl.setAnimation(PveFightAnmNames.IDLE, {
            mode: 'set',
            loop: true,
        });
    }

    onExit() {
        this.ctrl = null;
        this.sceneModel = null;
    }
}
