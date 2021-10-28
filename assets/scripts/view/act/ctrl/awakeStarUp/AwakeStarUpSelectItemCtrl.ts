import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, HeroCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-03 11:26:14 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/awakeStarUp/AwakeStarUpSelectItemCtrl")
export default class AwakeStarUpSelectItemCtrl extends UiListItem {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  select: cc.Node = null;

  info: icmsg.HeroInfo;
  isSelect: boolean;
  updateView() {
    [this.info, this.isSelect] = [this.data.heroInfo, this.data.select];
    let cfg = <HeroCfg>BagUtils.getConfigById(this.info.typeId);
    this.slot.group = cfg.group[0];
    this.slot.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.info.careerId).career_type;
    this.slot.starNum = this.info.star;
    this.slot.updateItemInfo(this.info.typeId);
    this.slot.node.getChildByName('lv').active = true;
    this.slot.node.getChildByName('lv').getComponent(cc.Label).string = `.${this.info.level}`;
    this.select.active = this.isSelect;
  }
}
