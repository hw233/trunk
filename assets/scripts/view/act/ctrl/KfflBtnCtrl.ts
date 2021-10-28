import ActUtil from '../util/ActUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import TaskUtil from '../../task/util/TaskUtil';
import { ActivityEventId } from '../enum/ActivityEventId';
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
@menu("qszc/view/act/KfflBtnCtrl")
export default class KfflBtnCtrl extends cc.Component {

    onLoad() {
        gdk.e.on(ActivityEventId.KFFL_CLOSE, this._onKfflClose, this);
        NetManager.on(icmsg.MissionWelfareAwardRsp.MsgType, this._onMissionWelfareAwardRsp, this);
    }

    onEnable() {
        this.node.active = JumpUtils.ifSysOpen(2805) && !TaskUtil.isAllRecivedInWelfareView();
    }

    onDisable() {
    }

    onDestroy() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    onClick() {
        if (!ActUtil.ifActOpen(6)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1"));
            this.node.active = false;
        }
        else {
            JumpUtils.openView(2805);
        }
    }

    _onKfflClose() {
        if (!ActUtil.ifActOpen(6)) {
            this.node.active = false;
        }
    }

    _onMissionWelfareAwardRsp(resp: icmsg.MissionWelfareAwardRsp) {
        if (TaskUtil.isAllRecivedInWelfareView()) {
            if (gdk.panel.isOpenOrOpening(PanelId.KfflActView)) {
                gdk.panel.hide(PanelId.KfflActView);
            }
            this.node.active = false;
            if (!gdk.panel.isOpenOrOpening(PanelId.KfflAct2View)) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:KFFL_TIP3"));
                gdk.Timer.once(1000, this, () => {
                    gdk.panel.open(PanelId.KfflAct2View);
                })
            }
        }
    }
}
