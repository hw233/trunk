import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagType } from '../../../../common/models/BagModel';
import { ResetRuneInfo } from './RuneDecomposePanelCtrl';
import { RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-10 14:20:56 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/RuneDecomposeItemCtrl")
export default class RuneDecomposeItemCtrl extends UiListItem {

  @property(UiSlotItem)
  slot: UiSlotItem = null

  @property(cc.Node)
  mask: cc.Node = null

  info: ResetRuneInfo
  /* 更新格子数据*/
  updateView() {
    this.info = this.data
    let ctrl = this.slot.getComponent(UiSlotItem)
    ctrl.updateItemInfo(this.info.runeInfo.id)
    this.node.getChildByName('lvLab').getComponent(cc.Label).string = '.' + ConfigManager.getItemById(RuneCfg, parseInt(this.info.runeInfo.id.toString().slice(0, 6))).level;
    this.mask.active = this.info.selected
  }

  _itemLongPress() {
    GlobalUtil.openItemTips({
      series: null,
      itemId: this.info.runeInfo.id,
      itemNum: 1,
      type: BagType.RUNE,
      extInfo: null
    })
  }
}