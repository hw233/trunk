import GlobalUtil from "../../../../common/utils/GlobalUtil";
import JumpUtils from "../../../../common/utils/JumpUtils";
import { AskInfoType } from "../../../../common/widgets/AskPanel";
import { PveFightAnmNames } from "../../const/PveAnimationNames";
import PveLittleGameGeneralCtrl from "../../ctrl/littleGame/PveLittleGameGeneralCtrl";
import PveFsmEventId from "../../enum/PveFsmEventId";
import PveLittleGameModel from "../../model/PveLittleGameModel";


@gdk.fsm.action("PveLittleGameGeneralDieAction", "Pve/LittleGame")
export default class PveLittleGameGeneralDieAction extends gdk.fsm.FsmStateAction {

    ctrl: PveLittleGameGeneralCtrl;
    sceneModel: PveLittleGameModel;

    onEnter() {

        this.ctrl = this.node.getComponent(PveLittleGameGeneralCtrl);
        this.sceneModel = this.ctrl.sceneModel;
        this.ctrl.setDir(this.sceneModel.curEnemy.node.getPos());
        let animStr = PveFightAnmNames.DIE;
        this.ctrl.setAnimation(animStr, { mode: 'set', loop: false, onComplete: this.onFinish, thisArg: this });

    }

    onExit() {
        this.ctrl = null;
        this.sceneModel = null;
    }

    onFinish() {

        let info: AskInfoType = {
            title: gdk.i18n.t("i18n:TIP_TITLE"),
            sureCb: () => {
                this.sceneModel.ctrl.close()
            },
            oneBtn: true,
            thisArg: this,
            sureText: "退出",
            descText: "挑战失败",
            closeBtnCb: () => {
                if (JumpUtils.ifSysOpen(1301)) {
                    this.sceneModel.id = this.sceneModel.id
                    this.sceneModel.generalHp = this.sceneModel.enterGeneralHp;
                    this.sceneModel.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_LITTLEGAME_SCENE_RESTART)
                } else {
                    this.sceneModel.ctrl.close()
                }

            },
        }
        GlobalUtil.openAskPanel(info);


        // let info: AskInfoType = {
        //     title: gdk.i18n.t("i18n:TIP_TITLE"),
        //     sureText: "重新开始",
        //     sureCb: () => {
        // this.sceneModel.id = this.sceneModel.id
        // this.sceneModel.generalHp = this.sceneModel.enterGeneralHp;
        // this.sceneModel.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_LITTLEGAME_SCENE_RESTART)
        //         //this.finish()
        //     },
        //     closeText: "退出",
        //     closeCb: () => {
        //         this.sceneModel.ctrl.close()
        //         //this.finish()
        //     },
        //     closeBtnCb: () => {
        //         this.sceneModel.ctrl.close()
        //         //this.finish()
        //     },
        //     descText: "当前关卡已通关",
        //     thisArg: this,
        //     isShowTip: false,
        // }
        // GlobalUtil.openAskPanel(info);

    }
}
