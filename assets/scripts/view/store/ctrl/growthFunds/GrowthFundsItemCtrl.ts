import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { GrowthfundCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-21 20:11:50 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/growthFunds/GrowtFundsItemCtrl")
export default class GrowtFundsItemCtrl extends UiListItem {
  @property(cc.Button)
  getBtn: cc.Button = null;

  @property(cc.Node)
  mask: cc.Node = null;

  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Label)
  targetLvLabel: cc.Label = null;

  @property(cc.Node)
  tipsNode: cc.Node = null;

  cfg: GrowthfundCfg;
  updateView() {
    this.cfg = this.data;
    this.targetLvLabel.string = this.cfg.level + '';
    let itemId = this.cfg.reward[0][0];
    let itemNum = this.cfg.reward[0][1]
    this.slot.updateItemInfo(itemId, itemNum);
    this.slot.itemInfo = {
      series: null,
      itemId: itemId,
      itemNum: itemNum,
      type: BagUtils.getItemTypeById(itemId),
      extInfo: null,
    };

    let preCfg = ConfigManager.getItemById(GrowthfundCfg, this.cfg.id - 1);
    let curLv = ModelManager.get(RoleModel).level;
    this.tipsNode.active = false;
    if (curLv < this.cfg.level) {
      if (!preCfg || preCfg.level <= curLv) {
        this.tipsNode.active = true;
        this.tipsNode.getChildByName('leftNum').getComponent(cc.Label).string = `${this.cfg.level - curLv}级`;
      }
    }

    //TODO
    if (ModelManager.get(RoleModel).level < this.cfg.level) {
      this.mask.active = false;
      this.getBtn.node.active = true;
      this.getBtn.interactable = false;
    }
    else {
      if (StoreUtils.getGrowthFundsRewardState(this.cfg.id)) {
        this.mask.active = true;
        this.getBtn.node.active = false;
      }
      else {
        this.mask.active = false;
        this.getBtn.node.active = true;
        this.getBtn.interactable = true;
      }
    }
  }

  onGetBtnClick() {
    if (!ModelManager.get(StoreModel).isBuyGrowFunds) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP5'));
      return;
    }
    if (ModelManager.get(RoleModel).level >= this.cfg.level && !StoreUtils.getGrowthFundsRewardState(this.cfg.id)) {
      let req = new icmsg.GrowthfundAwardReq();
      req.id = this.cfg.id;
      NetManager.send(req, (resp: icmsg.GrowthfundAwardRsp) => {
        GlobalUtil.openRewadrView(resp.list);
        this.mask.active = true;
        this.getBtn.node.active = false;
      })
    }
  }
}
