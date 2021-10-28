import BagUtils from '../../../common/utils/BagUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../common/models/BagModel';

/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-11-30 21:01:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/survival/InstanceSurvivalRewardItemCtrl")
export default class InstanceSurvivalRewardItemCtrl extends gdk.ItemRenderer {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    state1: cc.Node = null;

    updateView() {
        if (!this.data) return;
        let id = this.data[0]
        let num = this.data[1]
        let state = this.data[2]

        this.slot.updateItemInfo(id, num)
        let item: BagItem = {
            series: id,
            itemId: id,
            itemNum: 1,
            type: BagUtils.getItemTypeById(id),
            extInfo: null
        }
        this.slot.itemInfo = item
        this.state1.active = state == 1

    }
}
