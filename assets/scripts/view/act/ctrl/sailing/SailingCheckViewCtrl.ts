import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import PanelId from '../../../../configs/ids/PanelId';
import SailingActivityMainViewCtrl from './SailingActivityMainViewCtrl';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ItemCfg, Sailing_globalCfg, Sailing_mapCfg } from '../../../../a/config';
import { SailingEventId } from './SailingEventId';
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-05 17:26:56
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/sailing/SailingCheckViewCtrl")
export default class SailingCheckViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.RichText)
    tipLab: cc.RichText = null;

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    _cfg: Sailing_mapCfg

    onEnable() {
        let args = this.args[0]
        this._cfg = args

        let itemId = ConfigManager.getItemById(Sailing_globalCfg, "sailing_item").value[0]
        this.slotItem.updateItemInfo(itemId)
        this.slotItem.itemInfo = {
            series: 0,
            itemId: itemId,
            itemNum: 1,
            type: BagUtils.getItemTypeById(itemId),
            extInfo: null
        };
        if (BagUtils.getItemNumById(itemId) >= this._cfg.consumption) {
            this.tipLab.string = `探索该岛屿需要消耗燃料：<color=#ffffff>${this._cfg.consumption}</c>`
        } else {
            this.tipLab.string = `探索该岛屿需要消耗燃料：<color=#ff0000>${this._cfg.consumption}</c>`
        }

        this.content.removeAllChildren();
        this._cfg.reward.forEach(item => {
            let id = item[0];
            let num = item[1];
            let slot = this.createSlot(id, num);
            this.content.addChild(slot)
        });
    }

    createSlot(id: number, num: number): cc.Node {
        let slot = cc.instantiate(this.slotPrefab);
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(id, num);
        ctrl.itemInfo = {
            series: 0,
            itemId: id,
            itemNum: num,
            type: BagUtils.getItemTypeById(id),
            extInfo: null
        };
        return slot;
    }

    onGetFunc() {
        let panel = gdk.panel.get(PanelId.SailingActivityMainView)
        if (panel) {
            gdk.panel.hide(PanelId.SailingCheckView)
            let ctrl = panel.getComponent(SailingActivityMainViewCtrl)
            ctrl.selectPageById(0)
        }
    }

    onSailFunc() {
        let itemId = ConfigManager.getItemById(Sailing_globalCfg, "sailing_item").value[0]
        let cfg = ConfigManager.getItemById(ItemCfg, itemId)
        if (BagUtils.getItemNumById(itemId) < this._cfg.consumption) {
            gdk.gui.showMessage(`${cfg.name}不足，通过黄金寻宝船可获得更多燃料`)
            return
        }
        gdk.panel.hide(PanelId.SailingCheckView)
        gdk.e.emit(SailingEventId.SAILING_BOAT_MOVE, this._cfg.plate)

    }
}