import ConfigManager from '../../../../common/managers/ConfigManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Hero_careerCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-16 13:39:53 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-16 20:04:42
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/GeneConHeroSelectItemCtrl")
export default class GeneConHeroSelectItemCtrl extends UiListItem {
  @property(cc.Node)
  slot: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  updateView() {
    let heroInfo: icmsg.HeroInfo = this.data;
    let ctrl = this.slot.getComponent(UiSlotItem);
    ctrl.updateItemInfo(heroInfo.typeId);
    ctrl.updateStar(heroInfo.star);
    ctrl.updateCareer(ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroInfo.careerId).career_type);
    ctrl.lvLab.active = true;
    ctrl.lvLab.getComponent(cc.Label).string = `.${heroInfo.level}`;
    this.mask.active = this.list['select'] == heroInfo.heroId;
  }
}
