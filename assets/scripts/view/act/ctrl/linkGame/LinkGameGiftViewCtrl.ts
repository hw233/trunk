import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StoreModel from '../../../store/model/StoreModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { Store_pushCfg } from '../../../../a/config';
import { StoreEventId } from '../../../store/enum/StoreEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-26 10:26:39 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/linkGame/LinkGameGiftViewCtrl")
export default class LinkGameGiftViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Label)
    priceLab: cc.Label = null;

    @property(cc.Label)
    discountLab: cc.Label = null;

    @property(cc.Node)
    tabs: cc.Node = null;

    @property(cc.Node)
    tabBtn: cc.Node = null;

    @property(cc.Node)
    closeBtn: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    curCfg: Store_pushCfg;
    curData: icmsg.StorePushGift;
    curSelectIdx: number;
    showCloseBtn: boolean = false;
    onEnable() {
        let arg = this.args[0];
        if (arg) {
            this.tabs.active = false;
            [this.curCfg, this.curData] = arg;
            this._updateView();
            this.showCloseBtn = true;
            gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
        }
        else {
            ModelManager.get(ActivityModel).firstInLinkGiftView = false;
            gdk.e.emit(ActivityEventId.ACTIVITY_LINK_GAME_INFO_UPDATE);
            this.showCloseBtn = false;
            this.tabs.active = true;
            this.curSelectIdx = 0;
            this._refresh();
        }
        this.closeBtn.active = this.showCloseBtn;
        this.spine.setCompleteListener(() => {
            this.spine.setCompleteListener(null);
            this.spine.setAnimation(0, 'stand', true);
        });
        this.spine.setAnimation(0, 'idle', true);
    }

    onDisable() {
        this.unscheduleAllCallbacks();
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    onBuyBtnClick() {
        if (!this.curCfg) return;
        let req = new icmsg.PayOrderReq();
        req.paymentId = this.curCfg.gift_id;
        NetManager.send(req);
    }

    _onPaySucc(e: gdk.Event) {
        let data = <icmsg.PaySuccRsp>e.data;
        let cfg = ConfigManager.getItemById(Store_pushCfg, data.paymentId);
        if (cfg && cfg.event_type == 3 && this.showCloseBtn) {
            this.close();
        }
    }

    _refresh() {
        if (this.showCloseBtn) return;
        this._updateBtns();
        this._updateView();
    }

    @gdk.binding('storeModel.starGiftDatas')
    _updateBtns() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (this.showCloseBtn) return;

        let datas: icmsg.StorePushGift[] = [];
        let cfgs: Store_pushCfg[] = [];
        this.storeModel.starGiftDatas.forEach(d => {
            let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
            if (cfg && cfg.event_type == 3 && d.remainNum > 0 && d.startTime + cfg.duration > GlobalUtil.getServerTime() / 1000) {
                cfgs.push(cfg);
                datas.push(d);
            }
        });

        this.tabs.children.forEach((n, idx) => {
            if (idx >= cfgs.length) {
                n.removeFromParent();
            }
        });
        cfgs.forEach((c, idx) => {
            let n = cc.find('btn' + idx, this.tabs);
            if (!n) {
                n = cc.instantiate(this.tabBtn);
                n.name = 'btn' + idx;
                n.parent = this.tabs;
                n.active = true;
            }
            let desc = n.getChildByName('label').getComponent(cc.Label);
            desc.string = c.name;
            let select = idx === this.curSelectIdx;
            if (select) {
                this.curCfg = c;
                this.curData = datas[idx];
                n.targetOff(this);
            }
            else {
                n.on('click', () => {
                    this.curSelectIdx = idx;
                    this.curCfg = c;
                    this.curData = datas[idx];
                    this._refresh();
                }, this);
            }
            GlobalUtil.setSpriteIcon(
                this.node,
                cc.find('bg', n),
                `view/store/textrue/firstPay/tab/sc_leijianniu0${select ? 2 : 1}`
            );
            desc.node.color = cc.color().fromHEX(`${select ? '#fff9df' : '#b5834f'}`);
            desc.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(`${select ? '#ff7a19' : '#502114'}`);
        });
    }

    _updateView() {
        this.priceLab.string = `.${this.curCfg.rmb}`;
        this.content.removeAllChildren();
        this.curCfg.items.forEach(i => {
            let slot = cc.instantiate(this.slotPrefab);
            slot.parent = this.content;
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(i[0], i[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: i[0],
                itemNum: i[1],
                type: BagUtils.getItemTypeById(i[0]),
                extInfo: null
            };
        });
        this.discountLab.string = `${this.curCfg.value}/`;
        this._updateTime();
        this.schedule(this._updateTime, 1);
    }

    _updateTime() {
        if (!this.curCfg || !this.curData) {
            this.unscheduleAllCallbacks();
            return;
        }
        let leftTime = Math.max(0, (this.curData.startTime + this.curCfg.duration) * 1000 - GlobalUtil.getServerTime());
        if (leftTime <= 0) {
            this._refresh();
            this.unscheduleAllCallbacks();
        }
        else {
            this.timeLab.string = TimerUtils.format2(leftTime / 1000) + gdk.i18n.t('i18n:LINK_GAME_TIPS1');
        }
    }
}
