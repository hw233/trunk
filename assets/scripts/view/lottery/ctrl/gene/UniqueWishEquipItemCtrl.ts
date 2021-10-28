import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { UniqueCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-10-18 10:42:24 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-19 14:36:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/UniqueWishListViewCtrl')
export default class UniqueWishEquipItemCtrl extends UiListItem {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  userNode: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  cfg: UniqueCfg;
  updateView() {
    this.cfg = this.data;
    this.slot.updateItemInfo(this.cfg.id);
    this.userNode.active = this.cfg.hero_id > 0;
    if (this.cfg.hero_id > 0) {
      GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.userNode), GlobalUtil.getIconById(this.cfg.hero_id));
    }
    this.mask.active = this.list['wishIds'].indexOf(this.cfg.id) > -1;
  }
}
