import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import LuckyTwistMainCtrl from './LuckyTwistMainCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import ServerModel from '../../../../common/models/ServerModel';
import StoreModel from '../../../store/model/StoreModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ListView } from '../../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
import { Store_pushCfg, Twist_eggCfg } from '../../../../a/config';
import { StoreEventId } from '../../../store/enum/StoreEventId';

/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-09 16:34:39
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/luckyTwist/LuckyTwistGiftCtrl")
export default class LuckyTwistGiftCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    giftItem: cc.Prefab = null

    @property(cc.Button)
    typeBtns: cc.Button[] = []

    @property(cc.Label)
    timeLab: cc.Label = null

    @property(cc.Label)
    priceLabel: cc.Label = null;

    @property(cc.Node)
    buyBtn: cc.Node = null

    @property(cc.Node)
    sellout: cc.Node = null

    @property(cc.Label)
    desc: cc.Label = null

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel) }
    _btnTypes = []
    _curSelect: number = 0
    _curStorePushCfg: Store_pushCfg

    _iconRes = {
        9: "nd_tedeng",
        1: "nd_yideng",
        2: "nd_erdeng",
        3: "nd_sandeng",
    }

    onEnable() {
        let arg = this.args[0]
        if (arg) {
            this.isShowCloseBtn = true
        }
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)

        ModelManager.get(ActivityModel).firstInluckyTwistGift = false
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    onDisable() {
        gdk.e.targetOff(this)
        this._clearTimer()

        PanelId.LuckyTwistGiftPanel.isMask = false
        PanelId.LuckyTwistGiftPanel.isTouchMaskClose = false
        PanelId.LuckyTwistGiftPanel.maskAlpha = 0
    }

    //充值成功
    _updatePaySucc(e: gdk.Event) {
        GlobalUtil.openRewadrView(e.data.list)
        this.updateListView()

        if (this._btnTypes.length == 0) {
            if (ActivityUtils.getUseTwistEggTime() >= 10) {
                gdk.panel.hide(PanelId.LuckyTwistMain)
            } else {
                if (this.isShowCloseBtn) {
                    gdk.panel.hide(PanelId.LuckyTwistGiftPanel)
                }
                let view = gdk.panel.get(PanelId.LuckyTwistMain)
                if (view) {
                    let ctrl = view.getComponent(LuckyTwistMainCtrl)
                    ctrl.checkArgs()
                }
            }
        }
    }

    @gdk.binding("storeModel.starGiftDatas")
    updateListView() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabledInHierarchy) return;

        let curTime = Math.floor(this.serverModel.serverTime / 1000)
        this._btnTypes = []
        this.storeModel.starGiftDatas.forEach(element => {
            let cfg = ConfigManager.getItemById(Store_pushCfg, element.giftId)
            //扭蛋礼包
            if (cfg && cfg.event_type == 2 && (element.startTime + cfg.duration > curTime) && element.remainNum > 0) {
                this._btnTypes.push(cfg.open_conds)
            }
        });

        GlobalUtil.sortArray(this._btnTypes, (a, b) => {
            return a - b
        })

        for (let i = 0; i < this.typeBtns.length; i++) {
            this.typeBtns[i].node.active = false
        }

        for (let i = 0; i < this._btnTypes.length; i++) {
            let btn = this.typeBtns[i].node
            btn.active = true
            let commonIcon = btn.getChildByName("common").getChildByName("New Sprite")
            let selectIcon = btn.getChildByName("select").getChildByName("New Sprite")
            let eggCfg = ConfigManager.getItemByField(Twist_eggCfg, "gifts", this._btnTypes[i])
            if (eggCfg) {
                GlobalUtil.setSpriteIcon(btn, commonIcon, `view/act/texture/twistedEgg/${this._iconRes[eggCfg.reward_type]}01`)
                GlobalUtil.setSpriteIcon(btn, selectIcon, `view/act/texture/twistedEgg/${this._iconRes[eggCfg.reward_type]}`)
            }
        }
        if (this.isShowCloseBtn) {
            //this._curSelect = this._btnTypes.length - 1
            let view = gdk.panel.get(PanelId.LuckyTwistMain)
            if (view) {
                let ctrl = view.getComponent(LuckyTwistMainCtrl)
                ctrl.checkArgs()
            }
        }
        this.typeBtnSelect(null, this._curSelect)
    }

    typeBtnSelect(e, utype) {
        utype = parseInt(utype)
        for (let idx = 0; idx < this.typeBtns.length; idx++) {
            const element = this.typeBtns[idx];
            if (element.node.active) {
                element.interactable = idx != utype
                let select = element.node.getChildByName("select");
                select.active = idx == utype
                let common = element.node.getChildByName("common");
                common.active = idx != utype
            }
        }

        let giftType = this._btnTypes[utype]
        if (!giftType) {
            return
        }

        this._curStorePushCfg = ConfigManager.getItemByField(Store_pushCfg, "open_conds", giftType, { event_type: 2 })
        this.desc.string = this._curStorePushCfg.desc
        this.priceLabel.string = '.' + this._curStorePushCfg.rmb;
        this.content.removeAllChildren();
        if (this._curStorePushCfg.items.length > 4) this.scrollView.horizontal = true;
        else this.scrollView.horizontal = false;
        this._curStorePushCfg.items.forEach(gift => {
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
        this._createRfreshTime()

        let giftDatas = ModelManager.get(StoreModel).starGiftDatas
        for (let i = 0; i < giftDatas.length; i++) {
            if (giftDatas[i].giftId == this._curStorePushCfg.gift_id) {
                if (giftDatas[i].remainNum > 0) {
                    this.buyBtn.active = true
                    this.sellout.active = false
                } else {
                    this.buyBtn.active = false
                    this.sellout.active = true
                }
                break
            }
        }


    }

    _createRfreshTime() {
        this._updateTimeText()
        this._clearTimer()
        this.schedule(this._updateTimeText, 1)
    }

    _updateTimeText() {
        let gifts = this.storeModel.starGiftDatas
        let item: icmsg.StorePushGift = null
        for (let i = 0; i < gifts.length; i++) {
            if (gifts[i].giftId == this._curStorePushCfg.gift_id) {
                item = gifts[i]
                break
            }
        }
        if (!item) {
            this.timeLab.string = gdk.i18n.t('i18n:KFCB_TIP3')
            this._clearTimer()
        } else {
            let endTime = item.startTime + this._curStorePushCfg.duration
            let curTime = Math.floor(this.serverModel.serverTime / 1000)
            if (endTime - curTime > 0) {
                this.timeLab.string = `${TimerUtils.format2(endTime - curTime)}后礼包消失`
            } else {
                this.timeLab.string = gdk.i18n.t('i18n:KFCB_TIP3')
                this._clearTimer()
            }
        }
    }

    _clearTimer() {
        this.unschedule(this._updateTimeText)
    }

    buyFunc() {
        let msg = new icmsg.PayOrderReq()
        msg.paymentId = this._curStorePushCfg.gift_id
        NetManager.send(msg)
    }

}