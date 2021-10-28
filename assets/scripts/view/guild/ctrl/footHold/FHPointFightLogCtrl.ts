import FHPointFightLogItemCtrl from './FHPointFightLogItemCtrl';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-03 14:13:42
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHPointFightLogCtrl")
export default class FHPointFightLogCtrl extends gdk.BasePanel {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        this._req()
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    _req() {
        let msg = new icmsg.FootholdFightRecordsReq();
        let pos = new icmsg.FootholdPos()
        pos.x = this.footHoldModel.pointDetailInfo.pos.x
        pos.y = this.footHoldModel.pointDetailInfo.pos.y
        msg.pos = pos
        msg.ownerId = (this.footHoldModel.warPoints[`${pos.x}-${pos.y}`] as FhPointInfo).fhPoint.playerId
        NetManager.send(msg, (data: icmsg.FootholdFightRecordsRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateView(data);
        }, this);
    }

    _updateView(data: icmsg.FootholdFightRecordsRsp) {
        this.content.removeAllChildren();
        data.list.forEach(l => {
            let item = cc.instantiate(this.itemPrefab);
            let ctrl = item.getComponent(FHPointFightLogItemCtrl);
            item.parent = this.content;
            ctrl.init(l);
        });
    }
}