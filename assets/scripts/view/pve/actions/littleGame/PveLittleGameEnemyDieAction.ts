import { Little_gameCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import { AskInfoType } from "../../../../common/widgets/AskPanel";
import { PveFightAnmNames } from "../../const/PveAnimationNames";
import PveLittleGameEnemyCtrl from "../../ctrl/littleGame/PveLittleGameEnemyCtrl";
import PveFsmEventId from "../../enum/PveFsmEventId";
import PveLittleGameModel from "../../model/PveLittleGameModel";

@gdk.fsm.action("PveLittleGameEnemyDieAction", "Pve/LittleGame")
export default class PveLittleGameEnemyDieAction extends gdk.fsm.FsmStateAction {

    ctrl: PveLittleGameEnemyCtrl;
    sceneModel: PveLittleGameModel;

    onEnter() {

        this.ctrl = this.node.getComponent(PveLittleGameEnemyCtrl);
        this.sceneModel = this.ctrl.sceneModel;
        //this.ctrl.setDir(this.sceneModel.curEnemy.node.getPos());
        let animStr = PveFightAnmNames.DIE;
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
        //this.sceneModel.generals[0].fsm.sendEvent(PveFsmEventId.PVE_LITTLEGAME_GENERAL_DIE)
        this.sceneModel.generalHp += this.ctrl.cfg.blood;
        if (cc.js.isNumber(this.ctrl.cfg.end) && this.ctrl.cfg.end == 1) {
            //弹出胜利弹窗
            let cfg = ConfigManager.getItemByField(Little_gameCfg, 'type', this.sceneModel.id + 1);
            if (!cfg) {
                let info: AskInfoType = {
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    sureCb: () => {
                        this.sceneModel.ctrl.close()
                    },
                    oneBtn: true,
                    thisArg: this,
                    sureText: "退出",
                    descText: "已通关全部关卡",
                    closeBtnCb: () => {
                        this.sceneModel.ctrl.close()
                    },
                }
                GlobalUtil.openAskPanel(info);

            } else {
                let info: AskInfoType = {
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    sureText: "进入下一关",
                    sureCb: () => {
                        this.sceneModel.id = this.sceneModel.id + 1
                        this.sceneModel.enterGeneralHp = this.sceneModel.generalHp;
                        this.sceneModel.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_LITTLEGAME_SCENE_RESTART)
                        //this.ctrl.hide(true);
                        //this.finish()
                    },
                    closeText: "退出",
                    closeCb: () => {
                        this.sceneModel.ctrl.close()
                        //this.ctrl.hide(true);
                        //this.finish()
                    },
                    closeBtnCb: () => {
                        this.sceneModel.ctrl.close()
                        //this.ctrl.hide(true);
                        //this.finish()
                    },
                    descText: "当前关卡已通关",
                    thisArg: this,
                    isShowTip: false,
                }
                GlobalUtil.openAskPanel(info);
            }
        } else {
            this.ctrl.towerNode.active = false;
            this.ctrl.hide(true);

        }

    }
}
