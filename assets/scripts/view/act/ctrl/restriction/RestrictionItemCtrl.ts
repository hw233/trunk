import BagUtils from '../../../../common/utils/BagUtils';
import CombineModel from '../../../combine/model/CombineModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import SdkTool from '../../../../sdk/SdkTool';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_rechargeCfg } from '../../../../a/config';
import { CombineEventId } from '../../../combine/enum/CombineEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-21 10:34:47 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/restriction/RestrictionItemCtrl")
export default class RestrictionItemCtrl extends UiListItem {
  @property(cc.Label)
  targetLabel: cc.Label = null;

  @property(cc.RichText)
  leftLab: cc.RichText = null;

  @property(cc.Node)
  getBtn: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  slotPrefab: cc.Prefab = null;

  @property(cc.Node)
  soldOut: cc.Node = null;

  @property(cc.Node)
  bought: cc.Node = null;

  get combineModel(): CombineModel { return ModelManager.get(CombineModel); }
  cfg: Activity_rechargeCfg;
  onDisable() {
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  updateView() {
    this.cfg = this.data;
    this.targetLabel.string = StringUtils.format(gdk.i18n.t('i18n:ACT_STORE_TIP1'), SdkTool.tool.getRealRMBCost(this.cfg.money));
    this.content.removeAllChildren();
    this.cfg.rewards.forEach(reward => {
      if (reward && reward.length >= 2) {
        let slot = cc.instantiate(this.slotPrefab);
        slot.parent = this.content;
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(reward[0], reward[1]);
        ctrl.itemInfo = {
          series: null,
          itemId: reward[0],
          itemNum: reward[1],
          type: BagUtils.getItemTypeById(reward[0]),
          extInfo: null,
        };
      }
    });
    this.content.getComponent(cc.Layout).updateLayout();
    this.scrollView.scrollToTopLeft();
    this.scrollView.enabled = this.cfg.rewards.length > 5;
    this._updateState();
    gdk.e.on(CombineEventId.RESTRICTION_INFO_UPDATE, (e: gdk.Event) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      if (!e.data || !e.data.money || e.data.money == this.cfg.money) {
        this._updateState();
      }
    }, this);
  }

  _updateState() {
    this.soldOut.active = false;
    this.bought.active = false;
    this.getBtn.active = false;
    this.leftLab.node.active = false;
    let info = this.combineModel.restrictionStoreInfo[this.cfg.money];
    if (info && info.bought) {
      this.bought.active = true;
      return;
    }
    if (info && info.left <= 0) {
      this.soldOut.active = true;
      return;
    }

    if (this.combineModel.restrictionRecharge >= this.cfg.money) {
      this.getBtn.active = true;
      this.getBtn.getComponent(cc.Button).interactable = true;
      cc.find('layout/icon', this.getBtn).active = true;
      cc.find('layout/label', this.getBtn).getComponent(cc.Label).string = `${this.cfg.cost[1]}${gdk.i18n.t('i18n:RESTRICTION_TIPS1')}`;
      this.leftLab.node.active = true;
      this.leftLab.string = StringUtils.format(gdk.i18n.t('i18n:RESTRICTION_TIPS2'), info ? info.left : this.cfg.limit);
    }
    else if (this.combineModel.restrictionRecharge < this.cfg.money) {
      this.getBtn.active = true;
      this.getBtn.getComponent(cc.Button).interactable = false;
      cc.find('layout/icon', this.getBtn).active = false;
      cc.find('layout/label', this.getBtn).getComponent(cc.Label).string = gdk.i18n.t('i18n:MAP_TIP1');
      this.leftLab.node.active = true;
      this.leftLab.string = StringUtils.format(gdk.i18n.t('i18n:RESTRICTION_TIPS2'), info ? info.left : this.cfg.limit);
    }
  }

  onGetBtnClick() {
    if (!GlobalUtil.checkMoneyEnough(this.cfg.cost[1], this.cfg.cost[0], null, [PanelId.CombineMainView], null, () => {
      gdk.panel.hide(PanelId.CombineMainView);
      gdk.panel.setArgs(PanelId.CombineMainView, 2);
    })) {
      return;
    }
    let req = new icmsg.MergeCarnivalStoreBuyReq();
    req.money = this.cfg.money;
    NetManager.send(req, (resp: icmsg.MergeCarnivalStoreBuyRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      GlobalUtil.openRewadrView(resp.list);
    }, this);
  }
}
