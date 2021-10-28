import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../model/PeakModel';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/** 
 * @Description: 巅峰之战入口
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-09 17:21:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakIconCtrl")
export default class PeakIconCtrl extends cc.Component {

    @property(cc.Node)
    bgNode: cc.Node = null;

    // @property(cc.Node)
    // redNode: cc.Node = null;

    show: boolean = true;
    get peakModel() { return ModelManager.get(PeakModel); }
    onEnable() {
        this.refreshActivityData()
    }

    updateTime = 1;
    update(dt: number) {
        if (!this.show) {
            this.updateTime -= dt;
            if (this.updateTime <= 0) {
                this.refreshActivityData()
            }
        }
    }
    refreshActivityData() {
        if (!JumpUtils.ifSysOpen(2884)) {
            this.bgNode.active = false;
            this.show = false;
            this.updateTime = 1;
            // this.redNode.active = false;
            this.node.width = 0;
            this.node.height = 0;
        } else {
            this.node.width = 110;
            this.node.height = 110;
            this.show = true;
            this.updateTime = 0;
            this.bgNode.active = true;
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 30);
            let msg = new icmsg.PeakStateReq()
            NetManager.send(msg, (rsp: icmsg.PeakStateRsp) => {
                this.peakModel.peakStateInfo = rsp;
                gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
                // this.redNode.active = RedPointUtils.is_peak_show_redPoint();
            }, this);
        }
    }

    /*---------------巅峰之战图标 -----------------------*/
    onPeakBtnClick() {
        gdk.panel.open(PanelId.PeakView);
    }

}
