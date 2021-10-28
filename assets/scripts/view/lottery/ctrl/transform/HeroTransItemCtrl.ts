import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, HeroCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-22 14:21:22 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/transform/HeroTransItemCtrl')
export default class HeroTransItemCtrl extends UiListItem {
  @property(cc.Node)
  slot: cc.Node = null;

  @property(cc.Label)
  lvLab: cc.Label = null;

  @property(cc.Node)
  selectNode: cc.Node = null;

  @property(cc.Node)
  lockNode: cc.Node = null;

  info: icmsg.HeroInfo;
  select: boolean;
  updateView() {
    [this.info, this.select] = [this.data.info, this.data.select];
    let cfg = <HeroCfg>BagUtils.getConfigById(this.info.typeId);
    let ctrl = this.slot.getComponent(UiSlotItem);
    ctrl.group = cfg.group[0];
    ctrl.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.info.careerId).career_type;
    ctrl.starNum = this.info.star;
    ctrl.updateItemInfo(this.info.typeId, 1);
    this.lvLab.string = this.info.level + '';
    this.selectNode.active = this.select;
    let b = HeroUtils.heroLockCheck(this.info, false);
    this.lockNode.active = b;
    GlobalUtil.setAllNodeGray(this.slot, b ? 1 : 0);
  }

  check() {
    this.data.select = !this.data.select;
    this.select = this.data.select;
    this.selectNode.active = this.select;
  }
}
