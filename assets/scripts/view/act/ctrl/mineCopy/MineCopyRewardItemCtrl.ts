import BagUtils from '../../../../common/utils/BagUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';


/** 
 * @Description: 新 生存训练 物品展示 
 * @Author: yaozu.hu
 * @Date: 2020-08-04 11:27:26
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-08-04 11:48:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MinCopyRewardItemCtrl")
export default class MinCopyRewardItemCtrl extends gdk.ItemRenderer {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    updateView() {
        if (!this.data) return;
        let id = this.data[0]
        // let state = this.data[1]
        // let sort = this.data[2]
        this.slot.updateItemInfo(id)
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
