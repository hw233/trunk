import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { UniqueEquipInfo } from './UniqueEquipListCtrl';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/uniqueEquip/UniqueEquipMaterialsItemCtrl")
export default class UniqueEquipMaterialsItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    _itemInfo: UniqueEquipInfo

    updateView() {
        this._itemInfo = this.data

        let extInfo = this._itemInfo.bagItem.extInfo as icmsg.UniqueEquip
        this.slotItem.updateItemInfo(this._itemInfo.bagItem.itemId)
        if (extInfo) {
            this.slotItem.updateStar(extInfo.star)
        } else {
            this.slotItem.updateStar(0)
        }
        this.selectNode.active = this._itemInfo.selected
    }
}