import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';


/** 
 * @Description: 兵营-兵团融甲选择界面item
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-15 19:51:45
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmyResolveMaterialsItemCtrl")
export default class BYarmyResolveMaterialsItemCtrl extends UiListItem {

    @property(cc.Node)
    selectFlag: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    itemId: number;
    select: boolean;

    updateView() {
        [this.itemId, this.select] = [this.data.itemId, this.data.select];
        this.slot.updateItemInfo(this.itemId, 1);
        this.selectFlag.active = this.select;
    }

    check() {
        this.data.select = !this.data.select;
        this.select = this.data.select;
        this.selectFlag.active = this.select;
    }
}
