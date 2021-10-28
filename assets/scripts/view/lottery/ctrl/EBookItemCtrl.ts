import BagUtils from '../../../common/utils/BagUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';
import { Item_equipCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-04 10:00:07 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/EquipBookItemCtrl')
export default class EquipBookItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    mask: cc.Node = null;

    updateView() {
        let cfg: Item_equipCfg = this.data;
        this.slot.updateItemInfo(cfg.id, 1);
        let items = BagUtils.getItemsByType(BagType.EQUIP, { id: cfg.id });
        this.slot.noBtn = true;
        this.slot.itemInfo = {
            series: null,
            itemId: cfg.id,
            itemNum: 1,
            type: BagUtils.getItemTypeById(cfg.id),
            extInfo: null,
        }
        if (items && items.length >= 1) {
            // this.slot.itemInfo = items[0];
            this.mask.active = false;
        }
        else {
            this.mask.active = true;
        }
    }
}
