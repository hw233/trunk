import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import ServerModel from '../../../common/models/ServerModel';
import StoreModel from '../../store/model/StoreModel';
import StringUtils from '../../../common/utils/StringUtils';
import TaskUtil from '../util/TaskUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { HeroCfg } from '../../../../boot/configs/bconfig';
import { Store_pushCfg } from '../../../a/config';
import { StoreEventId } from '../../store/enum/StoreEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/MainLineGiftViewCtrl")
export default class MainLineGiftViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

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

    onEnable() {
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)
        this.updateView()
    }

    onDisable() {
        this._showPushGift()
        gdk.e.targetOff(this)
        this.clear();
    }

    _showPushGift() {
        let heroInfo = ModelManager.get(HeroModel).curHeroInfo
        if (!heroInfo) return
        if (!gdk.panel.isOpenOrOpening(PanelId.RoleView2)) return
        let cfg = ConfigManager.getItemByField(Store_pushCfg, "event_type", 1, { open_conds: heroInfo.star })
        if (cfg) {
            if (heroInfo.star >= 5) {
                let star = heroInfo.star
                let info: AskInfoType = {
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    sureCb: () => {
                        PanelId.AskPanel.isTouchMaskClose = true
                        gdk.panel.setArgs(PanelId.StarPushGiftView, star)
                        gdk.panel.open(PanelId.StarPushGiftView)
                    },
                    oneBtn: true,
                    sureText: gdk.i18n.t("i18n:HERO_TIP50"),
                    descText: `${heroInfo.star}${gdk.i18n.t("i18n:HERO_TIP51")}`,
                    thisArg: this,
                    closeBtnCb: () => {
                        PanelId.AskPanel.isTouchMaskClose = true
                        let msg = new icmsg.StorePushListReq()
                        NetManager.send(msg)
                        HeroUtils.showHeroCommment()
                    },
                }
                PanelId.AskPanel.isTouchMaskClose = false
                GlobalUtil.openAskPanel(info)
            }
        }
    }


    //充值成功
    _updatePaySucc(e: gdk.Event) {
        GlobalUtil.openRewadrView(e.data.list)
        gdk.panel.hide(PanelId.MainLineGiftView)
    }

    clear() {
        this.content.removeAllChildren();
        this.giftId = null;
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
        let datas = this.storeModel.starGiftDatas
        let giftData: icmsg.StorePushGift = null
        let giftCfg: Store_pushCfg = null
        datas.forEach(element => {
            let cfg = ConfigManager.getItemByField(Store_pushCfg, "gift_id", element.giftId)
            if (cfg && cfg.event_type == 8) {
                giftCfg = cfg
                giftData = element
            }
        });
        if (!giftData) {
            this.close()
            return
        }

        let heroCfg = ConfigManager.getItemById(HeroCfg, giftCfg.themehero)
        let url = StringUtils.format("spine/hero/{0}/1/{0}", heroCfg.skin);
        GlobalUtil.setSpineData(this.node, this.heroSpine, url, true, "stand", true, false);

        this.giftId = giftCfg.gift_id;
        this.descLabel.string = giftCfg.desc;
        this.priceLabel.string = '.' + giftCfg.rmb;
        this.discountLabel.string = `${giftCfg.value}/`
        this.time = giftCfg.duration - (Math.floor(ModelManager.get(ServerModel).serverTime / 1000) - giftData.startTime)
        let gifts = giftCfg.items;
        this.content.removeAllChildren();
        if (gifts.length > 5) this.scrollView.horizontal = true;
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
        });
        this.content.getComponent(cc.Layout).updateLayout();
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
            this.close();
        }
    }
}
