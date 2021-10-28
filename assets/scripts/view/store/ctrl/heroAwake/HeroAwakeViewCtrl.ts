import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import SdkTool from '../../../../sdk/SdkTool';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Store_awakeCfg } from '../../../../a/config';
import { StoreEventId } from '../../enum/StoreEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-11 13:40:40 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/heroAwake/HeroAwakeViewCtrl")
export default class HeroAwakeViewCtrl extends gdk.BasePanel {
    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property([cc.Node])
    giftItems: cc.Node[] = [];

    @property([cc.Node])
    crossLines: cc.Node[] = [];

    @property(cc.Node)
    tabs: cc.Node = null;

    @property(cc.Node)
    tabBtn: cc.Node = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    typeId: number;
    curSelectLv: number;
    onEnable() {
        let arg = this.args;
        this.typeId = arg[0][0];
        if (arg[0][1]) {
            this.curSelectLv = arg[0][1];
        }
        this._refresh();
        let url = StringUtils.format("spine/hero/{0}/1/{0}", HeroUtils.getHeroSkin(this.typeId, 11));
        GlobalUtil.setSpineData(this.node, this.heroSpine, url, false, 'stand', true);
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
        NetManager.on(icmsg.HeroAwakeGiftUpdateRsp.MsgType, this._onHeroAwakeGiftUpdateRsp, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        this.unscheduleAllCallbacks();
    }

    _onPaySucc(e: gdk.Event) {
        let data = <icmsg.PaySuccRsp>e.data;
        let cfg = ConfigManager.getItemById(Store_awakeCfg, data.paymentId);
        if (cfg) {
            GlobalUtil.openRewadrView(data.list);
        }
    }

    _onHeroAwakeGiftUpdateRsp(resp: icmsg.HeroAwakeGiftUpdateRsp) {
        let cfg = ConfigManager.getItemById(Store_awakeCfg, resp.list[0].id);
        if (cfg.hero == this.typeId) {
            this._updateView();
        }
    }

    _refresh() {
        this._updateBtns();
        this._updateView();
        this._updateTime();
        this.schedule(this._updateTime, 1);
    }

    _updateBtns() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;

        let cfgs: Store_awakeCfg[] = ConfigManager.getItems(Store_awakeCfg, (cfg: Store_awakeCfg) => {
            if (cfg.hero == this.typeId && StoreUtils.getHeroAwakeGiftState(this.typeId, cfg.awake_lv) == 1) {
                return true;
            }
        });

        if (this.curSelectLv && StoreUtils.getHeroAwakeGiftState(this.typeId, this.curSelectLv) !== 1) {
            this.curSelectLv = -1;
        }

        //get cfgs
        this.tabs.removeAllChildren();
        cfgs = cfgs.reverse();
        cfgs.forEach((c, idx) => {
            let n = cc.find('btn' + c.awake_lv, this.tabs);
            let state = StoreUtils.getHeroAwakeGiftState(this.typeId, c.awake_lv);
            if (!n && state == 1) {
                n = cc.instantiate(this.tabBtn);
                n.name = 'btn' + c.awake_lv;
                n.parent = this.tabs;
                n.active = true;
                let desc = n.getChildByName('label').getComponent(cc.Label);
                desc.string = c.tag_name;
                if ((this.curSelectLv == -1 || !this.curSelectLv)) {
                    this.curSelectLv = c.awake_lv;
                }
                let select = c.awake_lv == this.curSelectLv;
                if (select) {
                    this.curSelectLv = c.awake_lv;
                    n.targetOff(this);
                }
                else {
                    n.on('click', () => {
                        this.curSelectLv = c.awake_lv;
                        this._refresh();
                    }, this);
                }
                GlobalUtil.setSpriteIcon(
                    this.node,
                    cc.find('bg', n),
                    `common/texture/act/jxlb_yeqian0${select ? 2 : 1}`
                );
                desc.node.color = cc.color().fromHEX(`${select ? '#fff9df' : '#b5834f'}`);
                desc.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(`${select ? '#ff7a19' : '#502114'}`);
            }
        });
    }

    _updateView() {
        // let data;
        let cfgs = ConfigManager.getItems(Store_awakeCfg, (cfg: Store_awakeCfg) => {
            if (cfg.hero == this.typeId && cfg.awake_lv == this.curSelectLv) {
                return true;
            }
        });
        this.giftItems.forEach((n, idx) => {
            let c = cfgs[idx];
            n.active = !!c;
            if (n.active) {
                let oldPrice = cc.find('oldPrice', n);
                let buyBtn = cc.find('buyBtn', n);
                let limitLab = cc.find('limitLab', n).getComponent(cc.Label);
                let soldOut = cc.find('soldOut', n);
                let slotContent = cc.find('layout', n);
                let info = this.storeModel.heroAwakeGiftMap[c.hero][c.gift_id];
                oldPrice.getChildByName('lab').getComponent(cc.Label).string = '价值:' + c.value;
                buyBtn.getChildByName('lab').getComponent(cc.Label).string = StringUtils.format(gdk.i18n.t('i18n:ACT_STORE_TIP1'), SdkTool.tool.getRealRMBCost(c.rmb))
                limitLab.string = `限购:${c.buy_limit - info.count}/${c.buy_limit}`;
                soldOut.active = info.count >= c.buy_limit;//todo
                oldPrice.active = !soldOut.active;
                buyBtn.active = !soldOut.active;
                limitLab.node.active = !soldOut.active;
                let id = c.gift_id;
                buyBtn.targetOff(this);
                buyBtn.on('click', () => {
                    let req = new icmsg.PayOrderReq();
                    req.paymentId = id;
                    NetManager.send(req);
                }, this);
                let layout = slotContent.getComponent(cc.Layout);
                layout.enabled = true;
                slotContent.children.forEach((s, idx) => {
                    let r = c.items[idx];
                    s.active = !!r;
                    if (s.active) {
                        let ctrl = s.getComponent(UiSlotItem);
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
                layout.updateLayout();
                if (c.items.length == 3) {
                    layout.enabled = false;
                    slotContent.children[2].x = 0;
                }
            }
        });
        this.crossLines[0].active = cfgs.length >= 2;
        this.crossLines[1].active = cfgs.length >= 3;
    }

    _updateTime() {
        let info = this.storeModel.heroAwakeGiftMap[this.typeId];
        if (!info) return;
        let keys = Object.keys(info);
        let outTime = info[keys[0]].outTime * 1000;
        let now = GlobalUtil.getServerTime();
        let leftTime = Math.max(0, outTime - now);
        if (leftTime <= 0) {
            gdk.gui.showMessage('礼包已过期');
            this.close();
        }
        else {
            this.timeLab.string = `剩余时间:${TimerUtils.format2(leftTime / 1000)}`
        }
    }
}
