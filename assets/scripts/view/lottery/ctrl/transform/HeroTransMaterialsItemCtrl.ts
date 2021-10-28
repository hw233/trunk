import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, HeroCfg } from '../../../../a/config';
import { LotteryEventId } from '../../enum/LotteryEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-22 11:16:06 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/transform/HeroTransMaterialsItemCtrl')
export default class HeroTransMaterialsItemCtrl extends UiListItem {
  @property(cc.Node)
  slot: cc.Node = null;

  @property(cc.Node)
  selectFlag: cc.Node = null;

  @property(cc.Node)
  lockNode: cc.Node = null;

  info: icmsg.HeroInfo;
  select: boolean;
  onDisable() {
    gdk.e.targetOff(this);
  }

  updateView() {
    [this.info, this.select] = [this.data.info, this.data.select];
    let cfg = <HeroCfg>BagUtils.getConfigById(this.info.typeId);
    let ctrl = this.slot.getComponent(UiSlotItem);
    ctrl.group = cfg.group[0];
    ctrl.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.info.careerId).career_type;
    ctrl.starNum = this.info.star;
    ctrl.updateItemInfo(this.info.typeId, 1);
    this.selectFlag.active = this.select;
    this.lockNode.active = HeroUtils.heroLockCheck(this.info, false);
    let b = HeroUtils.heroLockCheck(this.info, false);
    this.lockNode.active = b;
    let isSatisfyType = true;
    let selectMaterialsIds = this.list['selectIds'] || [];
    if (selectMaterialsIds && selectMaterialsIds.length > 0) {
      let typeId = HeroUtils.getHeroInfoByHeroId(selectMaterialsIds[0]).typeId;
      if (typeId !== this.info.typeId) {
        isSatisfyType = false;
      }
    }
    GlobalUtil.setAllNodeGray(this.slot, b || !isSatisfyType ? 1 : 0);
    gdk.e.on(LotteryEventId.HERO_TRANS_MATERIAL_PRE_SELECT, this._onPreSelect, this);
  }

  check() {
    this.data.select = !this.data.select;
    this.select = this.data.select;
    this.selectFlag.active = this.select;
  }

  _onPreSelect() {
    let isSatisfyType = true;
    let selectMaterialsIds = this.list['selectIds'] || [];
    if (selectMaterialsIds && selectMaterialsIds.length > 0) {
      let typeId = HeroUtils.getHeroInfoByHeroId(selectMaterialsIds[0]).typeId;
      if (typeId !== this.info.typeId) {
        isSatisfyType = false;
      }
    }
    GlobalUtil.setAllNodeGray(this.slot, this.lockNode.active || !isSatisfyType ? 1 : 0);
  }
}
