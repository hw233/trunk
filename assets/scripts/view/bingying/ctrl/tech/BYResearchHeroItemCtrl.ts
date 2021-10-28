import BYModel from '../../model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Hero_careerCfg } from '../../../../a/config';
import { HeroCfg } from '../../../../../boot/configs/bconfig';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-14 17:43:15 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/tech/BYResearchHeroItemCtrl")
export default class BYResearchHeroItemCtrl extends UiListItem {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  mask: cc.Node = null;

  updateView() {
    let info: icmsg.HeroInfo = this.data;
    this.slot.starNum = info.star;
    this.slot.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', info.careerId).career_type;
    this.slot.group = ConfigManager.getItemById(HeroCfg, info.typeId).group[0];
    this.slot.updateItemInfo(info.typeId);
    let i = ModelManager.get(BYModel).techResearchMap[this.slot.career];
    this.mask.active = i && i.heroId == info.heroId;
  }
}
