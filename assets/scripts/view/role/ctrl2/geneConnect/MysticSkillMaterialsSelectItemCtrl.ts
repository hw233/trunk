import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Hero_careerCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-17 14:18:35 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-17 20:36:08
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/MysticSkillMaterialsSelectItemCtrl")
export default class MysticSkillMaterialsSelectItemCtrl extends UiListItem {
  @property(cc.Node)
  state1: cc.Node = null;

  @property(cc.Node)
  state2: cc.Node = null;

  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  lock: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  updateView() {
    let type = this.data.type;
    let id = this.data.id;
    let typeId = parseInt(id.toString().slice(0, 6));
    this.state1.active = false;
    this.state2.active = true;
    this.lock.active = false;
    GlobalUtil.setAllNodeGray(this.node, 0);
    if (type == 1) {
      let heroInfo = HeroUtils.getHeroInfoByHeroId(id);
      this.slot.starNum = heroInfo.star;
      this.slot.lv = heroInfo.level;
      this.slot.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroInfo.careerId).career_type;
      this.slot.updateItemInfo(heroInfo.typeId);
      let b = HeroUtils.heroLockCheck(heroInfo, false);
      GlobalUtil.setAllNodeGray(this.node, b ? 1 : 0);
      this.lock.active = b;
    }
    else {
      this.slot.starNum = null;
      this.slot.lv = null;
      this.slot.career = null;
      this.slot.updateItemInfo(typeId);
    }
    this.mask.active = this.list['select'] == id;
  }
}
