import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { ResetUniqueEquipInfo } from './UniqueEquipDecomposePanelCtrl';

/**
 * @Description: 专属武器
 * @Author: luoyong
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-07 14:36:37
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/uniqueEquip/UniqueEquipDecomposeItemCtrl")
export default class UniqueEquipDecomposeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    mask: cc.Node = null

    info: ResetUniqueEquipInfo
    /* 更新格子数据*/
    updateView() {
        this.info = this.data
        let ctrl = this.slot.getComponent(UiSlotItem)
        ctrl.updateItemInfo(this.info.equipInfo.itemId)
        ctrl.updateStar(this.info.equipInfo.star)
        ctrl.starNum = this.info.equipInfo.star
        this.mask.active = this.info.selected
    }
}