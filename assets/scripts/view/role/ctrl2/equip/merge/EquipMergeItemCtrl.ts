import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { Item_equipCfg } from '../../../../../a/config';
/** 
 * @Description: 装备选择面板子项
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-02 15:08:34
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/equip/merge/EquipMergeItemCtrl")
export default class EquipMergeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null

    @property(cc.Node)
    select: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    _item: Item_equipCfg

    updateView() {
        this._item = this.data
        this.redPoint.active = false
        if (this._item) {
            this.slotItem.updateItemInfo(this._item.id)
            this.slotItem.updateStar(this._item.star)

            let needEquip = ConfigManager.getItemByField(Item_equipCfg, "target_equip", this._item.id)
            let cost = Math.floor(BagUtils.getItemNumById(needEquip.id) / needEquip.material_number) * needEquip.consumption[1]
            this.redPoint.active = BagUtils.getItemNumById(needEquip.id) >= needEquip.material_number && GlobalUtil.getMoneyNum(needEquip.consumption[0]) >= cost

        } else {
            this.slotItem.updateItemInfo(0)
        }
    }


    _itemSelect() {
        if (this._item) {
            this.select.active = this.ifSelect
        }
    }
}