import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import ServerModel from '../../../common/models/ServerModel';
import StoreModel from '../model/StoreModel';
import TaskUtil from '../../task/util/TaskUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Store_giftCfg, Store_giftrewardCfg } from '../../../a/config';
import { StoreEventId } from '../enum/StoreEventId';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/LimitGiftViewCtrl")
export default class LimitGiftViewCtrl extends gdk.BasePanel {
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

    _timeLimitGift: icmsg.TimeLimitGift = null

    onEnable() {

        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)

        let args = this.args
        let id = args[0]
        let gifts = this.storeModel.limitGiftDatas
        for (let i = 0; i < gifts.length; i++) {
            if (id == gifts[i].id) {
                this._timeLimitGift = gifts[i]
            }
        }
        if (!this._timeLimitGift) {
            return
        }

        this.updateView();
    }

    onDisable() {
        gdk.e.targetOff(this)
        this.clear();
    }

    clear() {
        this.content.removeAllChildren();
        this.giftId = null;
        this.startTime = 0;
    }

    //充值成功
    _updatePaySucc(e: gdk.Event) {
        GlobalUtil.openRewadrView(e.data.list)
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
        let cfg = ConfigManager.getItemById(Store_giftCfg, this._timeLimitGift.giftId)
        this.giftId = cfg.gift_id;

        this.priceLabel.string = '.' + cfg.RMB_cost;
        this.time = this._timeLimitGift.endTime - Math.floor(ModelManager.get(ServerModel).serverTime / 1000);
        let rewardCfg = ConfigManager.getItemByField(Store_giftrewardCfg, "gift_id", this._timeLimitGift.giftId)
        this.descLabel.string = rewardCfg.desc;
        this.discountLabel.string = `${rewardCfg.bargain}/`;
        this.content.removeAllChildren();
        if (rewardCfg.items.length > 4) this.scrollView.horizontal = true;
        else this.scrollView.horizontal = false;
        rewardCfg.items.forEach(gift => {
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


    onClickBuyBtn() {
        let req: icmsg.PayOrderReq = new icmsg.PayOrderReq();
        req.paymentId = this.giftId;
        NetManager.send(req, () => {
            this._clearMiniTimeGiftData()
            this.close()
        });
    }

    _time: number;
    get time(): number { return this._time; }
    set time(v: number) {
        v = Math.floor(v);
        this._time = v;
        this.timeLabel.string = TaskUtil.getOnlineRewardTimeStr(v) + gdk.i18n.t('i18n:STORE_TIP6');
        if (v <= 0) {
            this._clearGiftData()
            this.close();
        }
    }

    _clearGiftData() {
        let iconIds = this.storeModel.limitGiftShowIds
        for (let i = 0; i < iconIds.length; i++) {
            if (this._timeLimitGift.id == iconIds[i]) {
                iconIds.splice(i, 1)
                this.storeModel.limitGiftShowIds = iconIds
                break
            }
        }

        let gifts = this.storeModel.limitGiftDatas
        for (let i = 0; i < gifts.length; i++) {
            if (this._timeLimitGift.id == gifts[i].id) {
                gifts.splice(i, 1)
                this.storeModel.limitGiftDatas = gifts
                break
            }
        }
    }


    _clearMiniTimeGiftData() {
        let gifts = this.storeModel.limitGiftDatas
        for (let i = 0; i < gifts.length; i++) {
            if (this._timeLimitGift.giftId == gifts[i].giftId) {
                gifts.splice(i, 1)
                this.storeModel.limitGiftDatas = gifts
                break
            }
        }
    }
}
