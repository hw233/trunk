import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import TaskUtil from '../../task/util/TaskUtil';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-29 15:00:45 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/Kffl2BtnCtrl")
export default class Kffl2BtnCtrl extends cc.Component {

    onLoad() {
        // gdk.e.on(ActivityEventId.KFFL_CLOSE, this._onKfflClose, this);
        NetManager.on(icmsg.MissionWelfare2AwardRsp.MsgType, this._onMissionWelfare2AwardRsp, this);
        NetManager.on(icmsg.MissionWelfareAwardRsp.MsgType, this._onMissionWelfareAwardRsp, this);
    }

    onEnable() {
        this.node.active = TaskUtil.isAllRecivedInWelfareView() && !TaskUtil.isAllRecivedInWelfare2View();
    }

    onDisable() {
    }

    onDestroy() {
        NetManager.targetOff(this);
    }

    onClick() {
        if (TaskUtil.isAllRecivedInWelfare2View()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:KFCB_TIP5"));
            this.node.active = false;
        }
        else {
            gdk.panel.open(PanelId.KfflAct2View);
        }
    }

    _onMissionWelfareAwardRsp(resp: icmsg.MissionWelfareAwardRsp) {
        if (TaskUtil.isAllRecivedInWelfareView()) {
            this.node.active = true;
        }
    }

    _onMissionWelfare2AwardRsp(resp: icmsg.MissionWelfare2AwardRsp) {
        if (TaskUtil.isAllRecivedInWelfare2View()) {
            if (gdk.panel.isOpenOrOpening(PanelId.KfflAct2View)) {
                gdk.panel.hide(PanelId.KfflAct2View);
            }
            this.node.active = false;
        }
    }
}
