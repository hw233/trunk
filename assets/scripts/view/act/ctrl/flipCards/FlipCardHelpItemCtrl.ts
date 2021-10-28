import BagUtils from '../../../../common/utils/BagUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-22 20:04:27 
  */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/flipCards/FlipCardHelpItemCtrl")
export default class FlipCardHelpItemCtrl extends UiListItem {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Label)
  numLab: cc.Label = null;

  updateView() {
    let [cfg, num, totalNum] = [this.data.cfg, this.data.num, this.data.totalNum];
    this.slot.updateItemInfo(cfg.award[0], cfg.award[1]);
    this.slot.itemInfo = {
      series: null,
      itemId: cfg.award[0],
      itemNum: cfg.award[1],
      type: BagUtils.getItemTypeById(cfg.award[0]),
      extInfo: null
    };
    this.numLab.string = `${num}/${totalNum}`;
  }
}
