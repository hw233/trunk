
import { PveFightAnmNames } from "../../const/PveAnimationNames";
import PveLittleGameEnemyCtrl from "../../ctrl/littleGame/PveLittleGameEnemyCtrl";
import PveLittleGameModel from "../../model/PveLittleGameModel";

@gdk.fsm.action("PveLittleGameEnemyIdleAction", "Pve/LittleGame")
export default class PveLittleGameEnemyIdleAction extends gdk.fsm.FsmStateAction {

    ctrl: PveLittleGameEnemyCtrl;
    sceneModel: PveLittleGameModel;

    onEnter() {
        this.ctrl = this.node.getComponent(PveLittleGameEnemyCtrl);
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
