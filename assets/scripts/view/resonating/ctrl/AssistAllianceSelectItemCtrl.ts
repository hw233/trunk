import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, HeroCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-06 13:43:34 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/resonating/AssistAllianceSelectItemCtrl")
export default class AssistAllianceSelectItemCtrl extends UiListItem {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  select: cc.Node = null;

  info: icmsg.HeroInfo;
  isSelect: boolean;
  curSelectId: number = 0;
  updateView() {
    [this.info, this.isSelect, this.curSelectId] = [this.data.heroInfo, this.data.select, this.data.curSelectId];
    let cfg = <HeroCfg>BagUtils.getConfigById(this.info.typeId);
    this.slot.group = cfg.group[0];
    this.slot.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.info.careerId).career_type;
    this.slot.starNum = this.info.star;
    this.slot.updateItemInfo(this.info.typeId);
    this.slot.node.getChildByName('lv').active = true;
    this.slot.node.getChildByName('lv').getComponent(cc.Label).string = `.${this.info.level}`;
    this.select.active = this.isSelect;
    let b = HeroUtils.heroLockCheck(this.info, false, [1, 2, 3, 4, 5, 6, 7, 8]) && this.curSelectId !== this.info.heroId;
    GlobalUtil.setAllNodeGray(this.node, b ? 1 : 0);
  }
}
