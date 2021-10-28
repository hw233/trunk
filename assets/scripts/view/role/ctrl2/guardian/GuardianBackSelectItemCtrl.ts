import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianUtils from './GuardianUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-29 11:02:32 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianBackSelectItemCtrl")
export default class GuardianBackSelectItemCtrl extends UiListItem {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  lock: cc.Node = null;

  @property(cc.Node)
  heroNode: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  updateView() {
    let id = this.data.id;
    let heroInfo = GuardianUtils.getGuardianHeroInfo(id);
    let guardianInfo = <icmsg.Guardian>GuardianUtils.getGuardianData(id).extInfo;
    this.heroNode.active = false
    if (heroInfo && heroInfo.heroId > 0) {
      this.heroNode.active = true;
      GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), GlobalUtil.getIconById(heroInfo.typeId));
    }
    this.slot.starNum = guardianInfo.star;
    this.slot.updateItemInfo(guardianInfo.type, 1);
    this.slot.updateStar(guardianInfo.star);
    this.slot.lvLab.active = true;
    this.slot.lvLab.getComponent(cc.Label).string = '.' + guardianInfo.level;
    this.lock.active = !!heroInfo;
    GlobalUtil.setAllNodeGray(this.node, !!heroInfo ? 1 : 0);
    this.mask.active = id == this.list['curSelect'];
  }
}
