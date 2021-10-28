import BagUtils from '../../../../common/utils/BagUtils';
import EquipUtils from '../../../../common/utils/EquipUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { UniqueCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-14 14:01:05 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-13 14:28:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/UniqueBookItemCtrl')
export default class UniqueBookItemCtrl extends cc.Component {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.Node)
  mask: cc.Node = null;

  @property(cc.Node)
  userNode: cc.Node = null;

  updateView(c: UniqueCfg) {
    this.slot.updateItemInfo(c.id);
    let extInfo = new icmsg.UniqueEquip();
    extInfo.id = -1
    extInfo.itemId = c.id
    extInfo.star = c.star_max
    this.slot.itemInfo = {
      series: null,
      itemId: c.id,
      itemNum: 1,
      type: BagUtils.getItemTypeById(c.id),
      extInfo: extInfo
    }
    this.nameLab.string = c.name;
    let has = EquipUtils.hasUniqueEquipByItemId(c.id);
    this.mask.active = !has;
    this.userNode.active = has && c.color >= 5 || (c.color >= 5 && c.hero_id > 0);
    if (this.userNode.active) {
      GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.userNode), GlobalUtil.getIconById(c.hero_id));
    }
  }
}
