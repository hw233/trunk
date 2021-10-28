import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import ServerModel from '../../../common/models/ServerModel';
import StoreModel from '../model/StoreModel';
import StoreUtils from '../../../common/utils/StoreUtils';
import TaskUtil from '../../task/util/TaskUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/PushGiftViewCtrl")
export default class PushGiftViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    discountLabel: cc.Label = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Prefab)
    giftItem: cc.Prefab = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    giftId: number;
    startTime: number;

    onEnable() {
        let l = GlobalUtil.getLocal(`gift_start_time`);
        this.startTime = l ? l.startTime : ModelManager.get(ServerModel).serverTime;
        this.updateView();
    }

    onDisable() {
        this.clear();
    }

    clear() {
        this.content.removeAllChildren();
        this.giftId = null;
        this.startTime = 0;
    }

    _dtime = 0;
    update(dt: number) {
        if (!this.time || this.time <= 0) return;
        if (this._dtime > 1) {
            this._dtime = 0;
            this.time -= 1;
        }
        else {
            this._dtime += dt;
        }
    }

    updateView() {
        let cfg = this.storeModel.curPushGift;
        if (!cfg) cfg = StoreUtils.getVailedPushGiftCfgByLocal();
        this.giftId = cfg.gift_id;
        this.descLabel.string = cfg.desc;
        this.discountLabel.string = cfg.discount.replace('%', '/');
        this.priceLabel.string = '.' + cfg.rmb;
        this.time = cfg.duration - (ModelManager.get(ServerModel).serverTime - this.startTime) / 1000;
        let gifts = cfg.items;
        this.content.removeAllChildren();
        if (gifts.length > 4) this.scrollView.horizontal = true;
        else this.scrollView.horizontal = false;
        gifts.forEach(gift => {
            let item = cc.instantiate(this.giftItem);
            this.content.addChild(item);
            let ctrl = item.getComponent(UiSlotItem);
            ctrl.isEffect = true;
            ctrl.updateItemInfo(gift[0], gift[1]);
            ctrl.itemInfo = {
                itemId: gift[0],
                series: 0,
                type: BagUtils.getItemTypeById(gift[0]),
                itemNum: gift[1],
                extInfo: null,
            };
            gift[2] && ctrl.updateQuality(gift[2]);
        });
        this.content.getComponent(cc.Layout).updateLayout();
    }

    @gdk.binding('storeModel.curPushGift')
    _updateView() {
        if (!this.storeModel.curPushGift) this.close();
    }

    onClickBuyBtn() {
        let req: icmsg.PayOrderReq = new icmsg.PayOrderReq();
        req.paymentId = this.giftId;
        NetManager.send(req);
    }

    _time: number;
    get time(): number { return this._time; }
    set time(v: number) {
        v = Math.floor(v);
        this._time = v;
        this.timeLabel.string = TaskUtil.getOnlineRewardTimeStr(v) + gdk.i18n.t('i18n:STORE_TIP6');
        if (v <= 0) {
            ModelManager.get(StoreModel).curPushGift = null;
            this.close();
        }
    }
}
