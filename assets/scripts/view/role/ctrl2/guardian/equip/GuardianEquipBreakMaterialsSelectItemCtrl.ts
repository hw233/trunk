import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { GuardianItemInfo } from '../GuardianListCtrl';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipBreakMaterialsSelectItemCtrl")
export default class GuardianEquipBreakMaterialsSelectItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    _itemInfo: GuardianItemInfo

    updateView() {
        this._itemInfo = this.data

        let extInfo = this._itemInfo.bagItem.extInfo as icmsg.Guardian
        this.slotItem.updateItemInfo(this._itemInfo.bagItem.itemId)
        if (extInfo) {
            this.lvLab.string = '.' + extInfo.level
            this.slotItem.updateStar(extInfo.star)
        }
        this.selectNode.active = this._itemInfo.selected
    }
}