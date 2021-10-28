import PveLittleGameEnemyCtrl from "../../ctrl/littleGame/PveLittleGameEnemyCtrl";
import PveLittleGameModel from "../../model/PveLittleGameModel";

@gdk.fsm.action("PveLittleGameEnemyMoveAction", "Pve/LittleGame")
export default class PveLittleGameEnemyMoveAction extends gdk.fsm.FsmStateAction {

    ctrl: PveLittleGameEnemyCtrl;
    sceneModel: PveLittleGameModel;

    onEnter() {

        this.ctrl = this.node.getComponent(PveLittleGameEnemyCtrl);
        this.sceneModel = this.ctrl.sceneModel;
        //this.ctrl.setDir(this.sceneModel.curEnemy.node.getPos());
        // let animStr = PveFightAnmNames.ATTACK;
        // this.ctrl.setAnimation(animStr, { mode: 'set', loop: false, onComplete: this.onFinish, thisArg: this });
        this.ctrl.hpLb.string = ''
        let generalPos = this.sceneModel.generals[0].node.getPos()
        generalPos.y += 30
        let action: cc.Action = cc.speed(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(0.5, generalPos),
                    cc.scaleTo(0.5, 0.2),
                ),
                cc.callFunc(this.onFinish, this),
            ),
            1,
        )
        this.ctrl.node.runAction(action);


    }

    onExit() {
        this.ctrl = null;
        this.sceneModel = null;
    }

    onFinish() {
        // this.sceneModel.generalMoveState = false;
        // this.sceneModel.curEnemy = null;
        //指挥官死亡
        //this.sceneModel.generals[0].fsm.sendEvent(PveFsmEventId.PVE_LITTLEGAME_GENERAL_DIE)
        //修改指挥官武器图片
        this.sceneModel.generalHp += this.ctrl.cfg.blood;
        this.ctrl.towerNode.active = false;
        this.ctrl.hide(true);

        this.finish()
    }
}
