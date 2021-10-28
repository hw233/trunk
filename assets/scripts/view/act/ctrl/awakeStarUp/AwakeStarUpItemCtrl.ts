import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import SdkTool from '../../../../sdk/SdkTool';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Store_awake_giftCfg } from '../../../../a/config';
import { StoreEventId } from '../../../store/enum/StoreEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-03 11:26:42 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/awakeStarUp/AwakeStarUpItemCtrl")
export default class AwakeStarUpItemCtrl extends cc.Component {
  @property([cc.Node])
  giftItems: cc.Node[] = [];

  @property(cc.Node)
  getBtn: cc.Node = null;

  @property(cc.Label)
  dayLab: cc.Label = null;

  @property(cc.Node)
  mask: cc.Node = null;

  idx: number; // 0-免费 1-7  day1-day7
  giftCfg: Store_awake_giftCfg;
  updateView(info: icmsg.ActivityAwakeGift, idx: number) {
    this.idx = idx;
    //礼包内容
    let heroInfo = HeroUtils.getHeroInfoByHeroId(ModelManager.get(ActivityModel).awakeHeroId);
    let giftId;
    if (idx == 0) {
      if (info.awardList[idx]) {
        giftId = info.awardList[idx];
      }
      else {
        giftId = ConfigManager.getItemByField(Store_awake_giftCfg, 'star_total', info.totalStar, { hero_id: heroInfo.typeId }).id;
      }
    }
    else {
      if (info.isCharge) {
        giftId = info.awardList[1];
      }
      else {
        giftId = ConfigManager.getItemByField(Store_awake_giftCfg, 'star_total', info.totalStar, { hero_id: heroInfo.typeId }).id;
      }
    }
    this.giftCfg = ConfigManager.getItemById(Store_awake_giftCfg, giftId);
    let rewards = idx == 0 ? this.giftCfg.free_rewards : this.giftCfg[`RMB_rewards${idx}`];
    this.giftItems.forEach((n, idx) => {
      let r = rewards[idx];
      n.active = !!r;
      if (n.active) {
        let ctrl = n.getComponent(UiSlotItem);
        ctrl.updateItemInfo(r[0], r[1]);
        ctrl.itemInfo = {
          series: null,
          itemId: r[0],
          itemNum: r[1],
          type: BagUtils.getItemTypeById(r[0]),
          extInfo: null
        };
      }
    });
    let layout = cc.find('content/layout', this.node).getComponent(cc.Layout);
    layout.enabled = true;
    layout.updateLayout();
    if (rewards.length == 3 || rewards.length == 1) {
      layout.enabled = false;
      this.giftItems[rewards.length - 1].x = 0;
    }
    this._updateState();
    //置灰
    if (idx > info.nowDay && idx > 1) {
      GlobalUtil.setAllNodeGray(this.node.getChildByName('content'), 1);
      this.getBtn.getComponent(cc.Button).interactable = false;
    }
    else {
      GlobalUtil.setAllNodeGray(this.node.getChildByName('content'), 0);
    }
  }

  _updateState() {
    let info = ModelManager.get(ActivityModel).awakeStarUpGiftMap[this.giftCfg.star_total];
    let btnLab = this.getBtn.getChildByName('lab').getComponent(cc.Label);
    this.dayLab.node.active = this.idx !== 0;
    this.dayLab.string = `第${this.idx}天`;
    let isGet = info.awardList[this.idx] > 0;
    this.getBtn.active = true;
    this.getBtn.getComponent(cc.Button).interactable = true;
    if (isGet) {
      this.getBtn.active = false;
      this.mask.active = true;
    }
    else {
      this.mask.active = false;
      this.getBtn.active = true;
      btnLab.string = this.idx == 1 ? `${StringUtils.format(gdk.i18n.t('i18n:ACT_STORE_TIP1'), SdkTool.tool.getRealRMBCost(this.giftCfg.RMB_cost))}` : '领取';
      this.getBtn.getComponent(cc.Button).interactable = true;
    }
  }

  onGetBtnClick() {
    let info = ModelManager.get(ActivityModel).awakeStarUpGiftMap[this.giftCfg.star_total];
    let heroInfo = HeroUtils.getHeroInfoByHeroId(ModelManager.get(ActivityModel).awakeHeroId);
    if (heroInfo.star < info.totalStar) {
      gdk.gui.showMessage(`英雄星级未达到${info.totalStar}星`);
      return;
    }
    if (this.idx == 1) {
      let req = new icmsg.PayOrderReq();
      req.paymentId = this.giftCfg.id;
      gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, (data) => {
        if ((<icmsg.PaySuccRsp>data.data).paymentId > 1600000) {
          GlobalUtil.openRewadrView((<icmsg.PaySuccRsp>data.data).list);
          this._updateState();
          gdk.e.targetOff(this);
        }
      }, this);
      NetManager.send(req, null, this);
      return;
    }
    if (this.idx !== 0 && !info.isCharge) {
      gdk.gui.showMessage('礼包尚未购买');
      return;
    }
    let req = new icmsg.ActivityAwakeGiftGainReq();
    req.totalStar = info.totalStar;
    req.day = this.idx;
    NetManager.send(req, (resp: icmsg.ActivityAwakeGiftGainRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      GlobalUtil.openRewadrView(resp.goodsInfo);
      this._updateState();
    }, this);
  }
}
