import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import PanelId from '../../../../configs/ids/PanelId';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { RuneCfg } from '../../../../a/config';
import { RuneMixMaterialType } from './RuneMixMaterialsSelectViewCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-02 10:32:58 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneMixMaterialsItemCtrl")
export default class RuneMixMaterialsItemCtrl extends UiListItem {
  @property(cc.Node)
  slot: cc.Node = null;

  @property(cc.Label)
  lv: cc.Label = null;

  @property(cc.Node)
  checkFlag: cc.Node = null;

  @property(cc.Node)
  getMoreNode: cc.Node = null;

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.Node)
  useNode: cc.Node = null;

  runeId: string;
  selected: boolean;
  info: RuneMixMaterialType;
  updateView() {
    [this.runeId, this.selected, this.info] = [this.data.runeId, this.data.selected, this.data.materialType];
    if (!this.runeId) {
      this.getMoreNode.active = true;
      this.checkFlag.active = false;
      this.nameLab.node.active = false;
    }
    else {
      let idStrs = this.runeId.split('_');
      let id = parseInt(idStrs[0].slice(0, 6));
      let cfg = ConfigManager.getItemById(RuneCfg, id);
      this.getMoreNode.active = false;
      this.slot.getComponent(UiSlotItem).updateItemInfo(id);
      this.lv.string = '.' + cfg.level + '';
      this.nameLab.node.active = true;
      this.nameLab.string = cfg.name;
      let colorInfo = BagUtils.getColorInfo(cfg.color);
      this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
      this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
      this.checkFlag.active = this.selected;
      this.useNode.active = false;
      if (idStrs[1].length >= 6) {
        let heroTypeId = parseInt(idStrs[1].slice(0, 6));
        this.useNode.active = true;
        GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.useNode), GlobalUtil.getIconById(heroTypeId));
      }
    }
  }

  check() {
    if (this.runeId) {
      this.data.selected = !this.data.selected;
      this.selected = !this.selected;
      this.checkFlag.active = this.selected;

    }
  }

  onClick() {
    if (!this.runeId) {
      // gdk.gui.showMessage('获取更多符文');
      // GlobalUtil.openGainWayTips(601101);
      if (gdk.panel.isOpenOrOpening(PanelId.RuneMaterialsSelectView)) {
        gdk.panel.hide(PanelId.RuneMaterialsSelectView);
      }
      JumpUtils.openView(716);
    }
  }
}
