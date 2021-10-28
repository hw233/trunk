import GlobalUtil from "../../../../common/utils/GlobalUtil";
import { PveFightAnmNames } from "../../const/PveAnimationNames";
import PveLittleGameGeneralCtrl from "../../ctrl/littleGame/PveLittleGameGeneralCtrl";
import PveFsmEventId from "../../enum/PveFsmEventId";
import PveLittleGameModel from "../../model/PveLittleGameModel";




@gdk.fsm.action("PveLittleGameGeneralAtkAction", "Pve/LittleGame")
export default class PveLittleGameGeneralAtkAction extends gdk.fsm.FsmStateAction {

    ctrl: PveLittleGameGeneralCtrl;
    sceneModel: PveLittleGameModel;

    onEnter() {

        this.ctrl = this.node.getComponent(PveLittleGameGeneralCtrl);
        this.sceneModel = this.ctrl.sceneModel;
        this.ctrl.setDir(this.sceneModel.curEnemy.node.getPos());
        let animStr = PveFightAnmNames.ATTACK;
        if (this.sceneModel.curEnemy.type == 2) {
            this.ctrl.setAnimation(animStr, { mode: 'set', loop: false, onComplete: this.onFinish, thisArg: this });
            gdk.Timer.once(300, this, () => {
                GlobalUtil.isSoundOn && gdk.sound.play(
                    gdk.Tool.getResIdByNode(this.ctrl.node),
                    'zhanmusibangde_atk_move',
                );
            })
        } else {
            this.onFinish()
        }


    }

    onExit() {
        gdk.Timer.clearAll(this);
        this.ctrl = null;
        this.sceneModel = null;
    }

    onFinish() {
        // this.sceneModel.generalMoveState = false;
        // this.sceneModel.curEnemy = null;

        //打开失败界面
        this.sceneModel.curEnemy.fsm.sendEvent(PveFsmEventId.PVE_LITTLEGAME_ENEMY_CHECK)
        this.finish()
    }
}
