import { PveFightAnmNames } from "../../const/PveAnimationNames";
import PveLittleGameEnemyCtrl from "../../ctrl/littleGame/PveLittleGameEnemyCtrl";
import PveFsmEventId from "../../enum/PveFsmEventId";
import PveLittleGameModel from "../../model/PveLittleGameModel";

@gdk.fsm.action("PveLittleGameEnemyAtkAction", "Pve/LittleGame")
export default class PveLittleGameEnemyAtkAction extends gdk.fsm.FsmStateAction {

    ctrl: PveLittleGameEnemyCtrl;
    sceneModel: PveLittleGameModel;

    onEnter() {

        this.ctrl = this.node.getComponent(PveLittleGameEnemyCtrl);
        this.sceneModel = this.ctrl.sceneModel;
        //this.ctrl.setDir(this.sceneModel.curEnemy.node.getPos());
        let animStr = PveFightAnmNames.ATTACK;
        this.ctrl.setAnimation(animStr, { mode: 'set', loop: false, onComplete: this.onFinish, thisArg: this });

    }

    onExit() {
        this.ctrl = null;
        this.sceneModel = null;
    }

    onFinish() {
        // this.sceneModel.generalMoveState = false;
        // this.sceneModel.curEnemy = null;
        //指挥官死亡
        this.sceneModel.generals[0].fsm.sendEvent(PveFsmEventId.PVE_LITTLEGAME_GENERAL_DIE)
        this.finish()
    }
}
