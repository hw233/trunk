import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RechargeViewCtrl from './RechargeViewCtrl';
import RoleModel from '../../../../common/models/RoleModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { VipCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-11-27 17:17:39
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/VipUpTipPanelCtrl")
export default class VipUpTipPanelCtrl extends gdk.BasePanel {

    @property(cc.Label)
    vipLab: cc.Label = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    get roleModel() { return ModelManager.get(RoleModel); }

    onEnable() {
        this.vipLab.string = `VIP${this.roleModel.vipLv}`
        let vipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv)
        this.content.removeAllChildren()
        for (let j = 0; j < vipCfg.rewards.length; j++) {
            let solt = cc.instantiate(this.rewardItem)
            let ctrl = solt.getComponent(UiSlotItem)
            ctrl.updateItemInfo(vipCfg.rewards[j][0], vipCfg.rewards[j][1])
            ctrl.itemInfo = {
                series: 0,
                itemId: vipCfg.rewards[j][0],
                itemNum: 1,
                type: BagUtils.getItemTypeById(vipCfg.rewards[j][0]),
                extInfo: null
            }
            solt.parent = this.content
        }
    }

    openVipFunc() {
        gdk.panel.hide(PanelId.VipUpTipPanel)
        let node = gdk.panel.get(PanelId.RechargVIP)
        if (!node) {
            gdk.panel.open(PanelId.Recharge, (node) => {
                let ctrl = node.getComponent(RechargeViewCtrl)
                ctrl.selectPanel(2)
            })
        }
    }
}