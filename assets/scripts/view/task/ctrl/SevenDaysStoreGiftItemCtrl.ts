import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import NetManager from '../../../common/managers/NetManager';
import StoreUtils from '../../../common/utils/StoreUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Store_7dayCfg, Store_giftCfg } from '../../../a/config';
import { TaskEventId } from '../enum/TaskEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-25 14:25:04 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/SevenDaysStoreGiftItem")
export default class SevenDaysStoreGiftItem extends cc.Component {
    @property(cc.Label)
    costNum: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    slotBg: cc.Node = null;

    @property(cc.Node)
    leftTimeNode: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    discountNode: cc.Node = null;

    cfg: Store_giftCfg;

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        this._leftTime = Math.max(0, v);
        this.leftTimeNode.getChildByName('time').getComponent(cc.Label).string = TimerUtils.format3(Math.floor(this._leftTime / 1000));
        if (this._leftTime <= 0) {
            //TODO refresh
            gdk.e.emit(TaskEventId.SEVENDAYS_STORE_SELL_OUT);
        }
    }

    dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime || this.leftTime <= 0) return;
        if (this.dtime >= 1) {
            this._updateTime();
            this.dtime = 0;
        }
        else {
            this.dtime += dt;
        }
    }

    _updateTime() {
        if (this.cfg.timerule == 1) {
            let endArr = this.cfg.restricted[3];
            let time = GlobalUtil.getServerOpenTime() * 1000;
            let endTime;
            if (this.cfg.restricted[0] == 3) {
                endTime = time + (endArr[2] * 24 * 60 * 60 + endArr[3] * 60 * 60 + endArr[4] * 60) * 1000;
            }
            else if (this.cfg.restricted[0] == 1) {
                // endTime = new Date(endArr[0] + '/' + endArr[1] + '/' + endArr[2] + ' ' + endArr[3] + ':' + endArr[4] + ':0').getTime();
                endTime = TimerUtils.transformDate(endArr);
            }
            let now = GlobalUtil.getServerTime();
            this.leftTime = endTime - now;
        }
    }

    onEnable() {
        NetManager.on(icmsg.PaySuccRsp.MsgType, this._onPaySuccRsp, this);
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    updateView(cfg: Store_giftCfg) {
        this.cfg = cfg;
        this.costNum.string = '￥' + cfg.RMB_cost;
        let items: number[][] = [];
        for (let i = 0; i < 6; i++) {
            let item = cfg[`item_${i + 1}`];
            if (item && item.length >= 2) {
                items.push(item);
            }
        }

        this.content.removeAllChildren();
        items.forEach(item => {
            let slot = cc.instantiate(this.slotPrefab);
            slot.parent = this.content;
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(item[0], item[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: item[0],
                itemNum: item[1],
                type: BagUtils.getItemTypeById(item[0]),
                extInfo: null,
            }
        });

        this.content.getComponent(cc.Layout).updateLayout();
        this.scrollView.scrollToTopLeft();
        this.scrollView.horizontal = items.length >= 5;
        this.slotBg.width = Math.min(this.content.width * .75 + 20, 387);

        let tempCfg = ConfigManager.getItemById(Store_7dayCfg, this.cfg.gift_id);
        if (tempCfg && tempCfg.discount) {
            this.discountNode.active = true;
            cc.find('layout/label', this.discountNode).getComponent(cc.Label).string = tempCfg.discount.toString().replace('.', '/');
        }
        else {
            this.discountNode.active = false;
        }
        this._updateTime();
    }

    onBuyBtnClick() {
        let buyInfo = StoreUtils.getStoreGiftBuyInfo(this.cfg.gift_id);
        let buyNum = buyInfo ? buyInfo.count : 0;
        let limitNum = this.cfg.times_limit;
        if (limitNum - buyNum > 0) {
            let msg = new icmsg.PayOrderReq();
            msg.paymentId = this.cfg.gift_id;
            NetManager.send(msg);
        } else {
            gdk.gui.showMessage(gdk.i18n.t('i18n:RECHARGE_TIP4'));
            return;
        }
    }

    _onPaySuccRsp(resp: icmsg.PaySuccRsp) {
        if (this.cfg && resp.paymentId == this.cfg.gift_id) {
            //弹出 充值成功 的提示
            // gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP6'))
            // this._updateStoreScroll()
            GlobalUtil.openRewadrView(resp.list)
            gdk.e.emit(TaskEventId.SEVENDAYS_STORE_SELL_OUT);
        }
    }
}
