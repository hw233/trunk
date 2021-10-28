import PveLittleGameViewCtrl from "../../ctrl/PveLittleGameViewCtrl";
import PveLittleGameModel from "../../model/PveLittleGameModel";

@gdk.fsm.action("PveLittleGameDisableAction", "Pve/LittleGame")
export default class PveLittleGameDisableAction extends gdk.fsm.FsmStateAction {

    model: PveLittleGameModel;
    ctrl: PveLittleGameViewCtrl;

    onEnter() {
        this.ctrl = this.node.getComponent(PveLittleGameViewCtrl);
        this.model = this.ctrl.model;
        this.model.generalHp = this.model.enterGeneralHp;
        // 移除所有节点
        let props: string[] = [
            'towers',           // 英雄塔座列表
            'enemies',            // 英雄列表
            'generals',         // 指挥官列表
        ];
        props.forEach(prop => {
            let arr: any[] = this.model[prop].concat();
            arr.forEach(ctrl => {
                if (ctrl.hide) {
                    ctrl.hide(false);
                } else {
                    gdk.NodeTool.hide(ctrl.node, false);
                }
            });
        });
        // 移除所有子节点
        this.ctrl.map.destroyAllChildren();
        this.ctrl.floor.destroyAllChildren();
        this.ctrl.thing.destroyAllChildren();
        this.ctrl.effect.destroyAllChildren();
        this.ctrl.hurt.destroyAllChildren();
        this.ctrl.buffTip.destroyAllChildren();
        // 回收资源
        let resId = this.ctrl.resId;
        if (resId != 0) {
            gdk.rm.releaseResByPanel(resId);
            gdk.rm.loadResByPanel(resId);
        }

        this.finish();
    }

    onExit() {

        this.ctrl = null;
        this.model = null;
    }
}
