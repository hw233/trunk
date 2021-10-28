import BagUtils from '../../../../common/utils/BagUtils';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { FhTeacheGuideType } from './teaching/FootHoldTeachingCtrl';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-19 17:51:10
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHGiveupViewCtrl")
export default class FHGiveupViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    slotItem: cc.Prefab = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        let info = this.footHoldModel.pointDetailInfo
        let fhPointInfo: FhPointInfo = this.footHoldModel.warPoints[`${info.pos.x}-${info.pos.y}`]
        let items = fhPointInfo.output
        for (let i = 0; i < items.length; i++) {
            let item = cc.instantiate(this.slotItem)
            this.content.addChild(item)
            let ctrl = item.getComponent(UiSlotItem)
            ctrl.itemInfo = {
                series: items[i].typeId,
                itemId: items[i].typeId,
                itemNum: 1,
                type: BagUtils.getItemTypeById(items[i].typeId),
                extInfo: null
            }
            ctrl.updateItemInfo(items[i].typeId, items[i].num)
        }
    }

    giveupFunc() {
        let msg = new icmsg.FootholdGiveUpReq()
        msg.warId = this.footHoldModel.curMapData.warId
        msg.pos = this.footHoldModel.pointDetailInfo.pos
        NetManager.send(msg, (data: icmsg.FootholdGiveUpRsp) => {
            FootHoldUtils.commitFhGuide(FhTeacheGuideType.event_7)
            GlobalUtil.openRewadrView(FootHoldUtils.getResultReward(data.exp, data.list))
            FootHoldUtils.clearPointOutput(msg.pos.x, msg.pos.y)
            this.close()
            gdk.panel.hide(PanelId.FHBattleArrayView)
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP4"))
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
        }, this)
    }
}