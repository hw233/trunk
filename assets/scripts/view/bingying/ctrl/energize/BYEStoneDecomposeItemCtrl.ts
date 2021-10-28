import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ResetEnergStoneInfo } from './BYEStoneDecomposePanelCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-14 15:40:12 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/energize/BYEStoneDecomposeItemCtrl")
export default class BYEStoneDecomposeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    mask: cc.Node = null

    info: ResetEnergStoneInfo
    /* 更新格子数据*/
    updateView() {
        this.info = this.data
        let ctrl = this.slot.getComponent(UiSlotItem)
        ctrl.updateItemInfo(this.info.energStoneInfo.itemId)
        this.mask.active = this.info.selected
    }
}