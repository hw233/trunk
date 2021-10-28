import BagUtils from '../../../../common/utils/BagUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';


/** 
 * @Description: 武魂试炼物品展示 
 * @Author: yaozu.hu
 * @Date: 2020-08-04 11:27:26
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-09-17 17:27:15
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/eternalCopy/EternalCopyRewardItemCtrl")
export default class EternalCopyRewardItemCtrl extends gdk.ItemRenderer {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    updateView() {
        if (!this.data) return;
        let id = this.data[0]
        let num = this.data[1]
        this.slot.starNum = 0;
        this.slot.updateItemInfo(id, num)
        let item: BagItem = {
            series: id,
            itemId: id,
            itemNum: 1,
            type: BagUtils.getItemTypeById(id),
            extInfo: null
        }
        this.slot.itemInfo = item
    }
}
