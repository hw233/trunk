import BagUtils from '../../../common/utils/BagUtils';
import CopyModel from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import StoreUtils from '../../../common/utils/StoreUtils';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Store_7dayCfg } from '../../../a/config';
import { StoreEventId } from '../../store/enum/StoreEventId';
import { TaskEventId } from '../enum/TaskEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-15 15:37:09 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/SevenDaysStoreItemCtrl")
export default class SevenDaysStoreItemCtrl extends UiListItem {

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  conten: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.Label)
  leftTimeLabel: cc.Label = null;

  @property(cc.Node)
  costNode: cc.Node = null;

  @property(cc.Button)
  buyBtn: cc.Button = null;

  @property(cc.Label)
  buyLimitsLabel: cc.Label = null;

  @property(cc.Node)
  sellOutNode: cc.Node = null;

  @property(cc.Node)
  discountNode: cc.Node = null;

  cfg: Store_7dayCfg;

  onEnable() {
    gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)
  }

  onDisable() {
    gdk.e.targetOff(this);
  }

  updateView() {
    let items: number[][] = [];
    this.cfg = this.data;
    if (this.cfg.item && this.cfg.item.length >= 1) {
      let b: boolean = true;
      this._updateType(false);
      items.push(this.cfg.item);
      this.costNode.active = true;
      this.costNode.getChildByName('numLabel').getComponent(cc.Label).string = this.cfg.money_cost[1] + '';
      GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(this.cfg.money_cost[0]));

      let storeInfo = ModelManager.get(StoreModel).sevenStoreInfo[this.cfg.id];
      let boughtTime = storeInfo | 0;
      this.leftTimeLabel.string = `${Math.max(0, this.cfg.times_limit - boughtTime)}/${this.cfg.times_limit}`;
      if (this.cfg.discount) {
        this.discountNode.active = true;
        cc.find('layout/label', this.discountNode).getComponent(cc.Label).string = this.cfg.discount.toString().replace('.', '/');
      }
      else {
        this.discountNode.active = false;
      }
      if (boughtTime >= this.cfg.times_limit) {
        this.buyBtn.node.active = false;
        this.buyLimitsLabel.node.active = false;
        this.sellOutNode.active = true;
        this.costNode.active = false;
        b = false;
      }
      if (b) {
        this.sellOutNode.active = false;
        this.buyBtn.node.active = false;
        this.buyLimitsLabel.node.active = true;
        this.costNode.active = false;
        let curDay = Math.floor((GlobalUtil.getServerTime() - GlobalUtil.getServerOpenTime() * 1000) / (86400 * 1000)) + 1;
        if (this.cfg.day > curDay) {
          let str = [
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM1'),
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM2'),
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM3'),
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM4'),
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM5'),
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM6'),
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM7'),
          ]
          this.buyLimitsLabel.string = StringUtils.format(gdk.i18n.t('i18n:TASK_TIP6'), str[this.cfg.day - 1]);
        }
        else if (this.cfg.level && this.cfg.level >= 0 && ModelManager.get(RoleModel).level < this.cfg.level) {
          this.buyLimitsLabel.string = StringUtils.format(gdk.i18n.t('i18n:TASK_TIP7'), this.cfg.level);
        }
        else if (this.cfg.fbId && this.cfg.fbId >= 110101 && ModelManager.get(CopyModel).lastCompleteStageId < this.cfg.fbId) {
          this.buyLimitsLabel.string = StringUtils.format(gdk.i18n.t('i18n:TASK_TIP8'), CopyUtil.getChapterId(this.cfg.fbId), CopyUtil.getSectionId(this.cfg.fbId));
        }
        else {
          let lab = this.buyBtn.node.getChildByName("label").getComponent(cc.Label)
          this.buyBtn.enabled = true
          this.buyBtn.node.active = true;
          GlobalUtil.setAllNodeGray(this.buyBtn.node, 0)
          this.costNode.active = true;
          this.buyLimitsLabel.node.active = false;

          if (this.cfg.VIP_commit && this.cfg.VIP_commit > 0) {
            lab.string = StringUtils.format(gdk.i18n.t('i18n:TASK_TIP9'), this.cfg.VIP_commit)
          } else {
            lab.string = gdk.i18n.t('i18n:ONE_DOLLAR_GIFT_TIP2')
          }
          if (ModelManager.get(RoleModel).vipLv < this.cfg.VIP_commit) {
            this.buyBtn.enabled = false
            GlobalUtil.setAllNodeGray(this.buyBtn.node, 1)
          }
        }
      }
    }
    // else {
    //   //礼包商店
    //   this._updateType(true);
    //   let giftBuyInfo: StoreBuyInfo = StoreUtils.getStoreGiftBuyInfo(this.cfg.id);
    //   let giftCfg = ConfigManager.getItemById(Store_giftCfg, this.cfg.id);
    //   for (let i = 0; i < 6; i++) {
    //     let giftItem = giftCfg[`item_${i + 1}`];
    //     if (giftItem && giftItem.length >= 2) {
    //       items.push(giftItem);
    //     }
    //   }
    //   this.costNode.active = true;
    //   this.costNode.getChildByName('numLabel').getComponent(cc.Label).string = `￥${giftCfg.RMB_cost}`;

    //   if (giftBuyInfo && giftBuyInfo.count >= giftCfg.times_limit) {
    //     this.sellOutNode.active = true;
    //     this.costNode.active = false;
    //     this.buyBtn.node.active = false;
    //   }
    //   else {
    //     this.sellOutNode.active = false;
    //     this.buyBtn.node.active = true;
    //   }
    // }

    //更新道具
    this.conten.removeAllChildren();
    for (let i = 0; i < items.length; i++) {
      let slot = cc.instantiate(this.itemPrefab);
      slot.parent = this.conten;
      let ctrl = slot.getComponent(UiSlotItem);
      ctrl.updateItemInfo(items[i][0], items[i][1]);
      ctrl.itemInfo = {
        series: null,
        itemId: items[i][0],
        itemNum: items[i][1],
        type: BagUtils.getItemTypeById(items[i][0]),
        extInfo: null,
      };
    }

    this.scrollView.scrollToLeft();
    if (items.length >= 3) {
      this.scrollView.enabled = true;
    }
    else {
      this.scrollView.enabled = false;
    }
  }

  _updateType(isGiftStore: boolean) {
    this.node.getChildByName('label').active = !isGiftStore;
    this.leftTimeLabel.node.active = !isGiftStore;
    this.buyLimitsLabel.node.active = !isGiftStore;
    this.costNode.getChildByName('icon').active = !isGiftStore;
  }

  //充值成功
  _updatePaySucc(e: gdk.Event) {
    if (e.data.paymentId == this.cfg.id) {
      //弹出 充值成功 的提示
      // gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP6'))
      // this._updateStoreScroll()
      GlobalUtil.openRewadrView(e.data.list)
      gdk.e.emit(TaskEventId.SEVENDAYS_STORE_SELL_OUT);
    }
  }

  // _onPaySuccRsp(resp: PaySuccRsp) {
  //   if (this.cfg.id == resp.paymentId) {
  //     gdk.e.emit(TaskEventId.SEVENDAYS_STORE_SELL_OUT);
  //   }
  // }

  onBuyBtnClick() {
    if (this.cfg.item && this.cfg.item.length >= 1) {
      let req = new icmsg.Store7daysBuyReq();
      req.id = this.cfg.id;
      let timesLimit = this.cfg.times_limit;
      NetManager.send(req, (resp: icmsg.Store7daysBuyRsp) => {
        GlobalUtil.openRewadrView(resp.list);
        StoreUtils.updateSevenStoreInfo(resp.id);
        let boughtTime = ModelManager.get(StoreModel).sevenStoreInfo[resp.id];
        this.leftTimeLabel.string = `${Math.max(0, timesLimit - boughtTime)}/${timesLimit}`;
        if (boughtTime == timesLimit) {
          gdk.e.emit(TaskEventId.SEVENDAYS_STORE_SELL_OUT);
        }
      });
    }
    // else {
    //   let giftBuyInfo: StoreBuyInfo = StoreUtils.getStoreGiftBuyInfo(this.cfg.id);
    //   let giftCfg = ConfigManager.getItemById(Store_giftCfg, this.cfg.id);
    //   let buyNum = giftBuyInfo ? giftBuyInfo.count : 0;
    //   let limitNum = giftCfg.times_limit;
    //   if (limitNum - buyNum > 0) {
    //     let msg = new PayOrderReq();
    //     msg.paymentId = giftCfg.gift_id;
    //     NetManager.send(msg);
    //   } else {
    //     gdk.gui.showMessage("该商品已售罄");
    //     return;
    //   }
    // }
  }
}
