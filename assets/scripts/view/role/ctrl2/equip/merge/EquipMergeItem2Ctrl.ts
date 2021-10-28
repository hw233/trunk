import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagType } from '../../../../../common/models/BagModel';
import { Item_equipCfg } from '../../../../../a/config';
import { mergeResultItem } from './EquipMergeCheckPanelCtrl';
/** 
 * @Description: 装备选择面板子项
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-08-31 17:39:30
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/equip/merge/EquipMergeItem2Ctrl")
export default class EquipMergeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null

    _info: mergeResultItem = null

    updateView() {
        this._info = this.data
        if (this._info) {
            this.slotItem.updateItemInfo(this._info.cfg.id, this._info.num)
            this.slotItem.updateStar(this._info.cfg.star)

            this.slotItem.itemInfo = {
                series: this.slotItem.itemId,
                itemId: this.slotItem.itemId,
                itemNum: 1,
                type: BagType.EQUIP,
                extInfo: null,
            }
        } else {
            this.slotItem.updateItemInfo(0)
        }
    }
}   