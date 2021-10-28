import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { EnergyStoneInfo } from '../../model/BYModel';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-16 13:49:17 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/tech/BYTechStoneSelectItemCtrl")
export default class BYTechStoneSelectItemCtrl extends UiListItem {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  flag: cc.Node = null;

  updateView() {
    let info: EnergyStoneInfo = this.data;
    this.slot.updateItemInfo(parseInt(info.itemId.toString().slice(0, 7)));
    this.flag.active = info.slot >= 0;
  }
}
