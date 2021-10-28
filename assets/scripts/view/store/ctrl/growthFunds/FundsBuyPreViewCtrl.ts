import ActUtil from '../../../act/util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../model/StoreModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import TradingPortViewCtrl from '../tradingPort/TradingPortViewCtrl';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
    GlobalCfg,
    Pass_daily_rewardsCfg,
    Pass_fundCfg,
    Store_miscCfg,
    Store_monthcardCfg
    } from '../../../../a/config';
import { StoreEventId } from '../../enum/StoreEventId';


/**
* @Author: luoyong
* @Description:
* @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-25 14:31:20
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/growthFunds/FundsBuyPreViewCtrl")
export default class FundsBuyPreViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    tlab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView1: cc.ScrollView = null;

    @property(cc.Node)
    content1: cc.Node = null;

    @property(cc.ScrollView)
    scrollView2: cc.ScrollView = null;

    @property(cc.Node)
    content2: cc.Node = null;

    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    _rewardCfgs: Pass_daily_rewardsCfg[];
    reward: number[][] = [];
    _canGetIndex = 0

    _fundsId: number = 0
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onEnable() {
        this._fundsId = this.args[0];
        let fund_cfg = ConfigManager.getItemById(Pass_fundCfg, this._fundsId)
        this.tlab.string = `${fund_cfg.name}`
        let period = ConfigManager.getItemByField(GlobalCfg, 'key', 'pass_cycle').value[0];
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000);
        let startTime = ActUtil.getActStartTime(120) / 1000;
        let curPeriod = Math.floor((serverTime - startTime) / (period * 24 * 60 * 60)) + 1;
        let rewards = ConfigManager.getItems(Pass_daily_rewardsCfg, { group: fund_cfg.daily_rewards, cycle: curPeriod })
        if (!rewards || rewards.length <= 0) {
            let cfgs = ConfigManager.getItems(Pass_daily_rewardsCfg, { group: fund_cfg.daily_rewards });
            rewards = ConfigManager.getItems(Pass_daily_rewardsCfg, { group: fund_cfg.daily_rewards, cycle: cfgs[cfgs.length - 1].cycle });
        }
        this._rewardCfgs = rewards

        let misc_cfg = ConfigManager.getItemById(Store_miscCfg, this._fundsId)
        this.buyBtn.node.getChildByName('label').getComponent(cc.Label).string = `${StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), misc_cfg.RMB_cost)}${gdk.i18n.t('i18n:FUNDS_TIP1')}`;

        let info = fund_cfg.daily_rewards == 1 ? this.storeModel.goodFundsInfo : this.storeModel.betterFundsInfo
        this._canGetIndex = 0
        if (info) {
            if (info.startTime > 0) {
                startTime = info.startTime
            }
            let startZero = TimerUtils.getZerohour(startTime + (curPeriod - 1) * (period * 24 * 60 * 60))
            let rewardZero = TimerUtils.getZerohour(serverTime)

            if ((info.startTime + period * 86400) <= rewardZero) {
                startZero = TimerUtils.getZerohour(ActUtil.getActStartTime(120) / 1000 + (curPeriod - 1) * (period * 24 * 60 * 60))
            }

            for (let i = 0; i < rewards.length; i++) {
                if (rewardZero < (startZero + (rewards[i].day) * 24 * 60 * 60)) {
                    this._canGetIndex = i + 1
                    break
                }
            }
        }
        this.updateScrollView();
    }

    onDisable() {
    }

    updateScrollView() {
        this.content1.removeAllChildren();
        this.content2.removeAllChildren();
        let reward1 = this._composeReward(this._rewardCfgs.length);
        let reward2 = this._composeReward(this._canGetIndex);
        reward1.forEach(reward => {
            let id = reward[0];
            let num = reward[1];
            let slot1 = this.createSlot(id, num);
            slot1.parent = this.content1;
        });
        reward2.forEach(reward => {
            let id = reward[0];
            let num = reward[1];
            let slot1 = this.createSlot(id, num);
            slot1.parent = this.content2;
        });
        this.content1.getComponent(cc.Layout).updateLayout();
        this.content2.getComponent(cc.Layout).updateLayout();
        if (reward1.length <= 4) this.scrollView1.node.width = this.content1.width;
        else this.scrollView1.node.width = 500;
        if (reward2.length <= 4) this.scrollView2.node.width = this.content2.width;
        else this.scrollView2.node.width = 500;
        this.scrollView1.scrollToTopLeft(0);
        this.scrollView2.scrollToTopLeft(0);
    }

    createSlot(id: number, num: number): cc.Node {
        let slot = cc.instantiate(this.slotPrefab);
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(id, num);
        ctrl.itemInfo = {
            series: 0,
            itemId: id,
            itemNum: num,
            type: BagUtils.getItemTypeById(id),
            extInfo: null
        };
        return slot;
    }

    /**
     * 合并奖励
     * @param rewards 
     */
    _composeReward(idx: number): number[][] {
        let fund_cfg = ConfigManager.getItemById(Pass_fundCfg, this._fundsId)
        let r = {};
        let finalReward: number[][] = [];
        for (let i = 0; i < idx; i++) {
            let rewards = this._rewardCfgs[i].rewards;
            rewards.forEach(reward => {
                let id = reward[0];
                let num = reward[1];
                if (!r[id]) r[id] = 0;
                r[id] += num;
            });
        }

        //购买的奖励一起加进去
        if (!r[fund_cfg.reward[0]]) r[fund_cfg.reward[0]] = 0;
        r[fund_cfg.reward[0]] += fund_cfg.reward[1];

        for (let key in r) {
            finalReward.push([parseInt(key), r[key]]);
        }

        finalReward.sort((a, b) => {
            let typeA = BagUtils.getConfigById(a[0]).defaultColor;
            let typeB = BagUtils.getConfigById(b[0]).defaultColor;
            if (typeA == typeB) {
                return b[0] - a[0];
            }
            else {
                return typeB - typeA;
            }
        });
        return finalReward;
    }

    onBuyBtnClick() {
        let fund_cfg = ConfigManager.getItemById(Pass_fundCfg, this._fundsId)
        let monthCardCfg = ConfigManager.getItemById(Store_monthcardCfg, fund_cfg.limit)
        let cardData = this.storeModel.getMonthCardInfo(fund_cfg.limit);
        let nowTime = GlobalUtil.getServerTime() / 1000;
        if (cardData && cardData.time - nowTime > 0) {
            let msg = new icmsg.PayOrderReq()
            msg.paymentId = this._fundsId
            NetManager.send(msg, () => {
                gdk.panel.hide(PanelId.FundsBuyPreView)
                gdk.e.once(StoreEventId.UPDATE_PAY_SUCC, () => {
                    let msg = new icmsg.PassFundListReq()
                    NetManager.send(msg)
                });
            })
        } else {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t('i18n:TIP_TITLE'),
                descText: StringUtils.format(gdk.i18n.t('i18n:FUNDS_TIP2'), monthCardCfg.desc, monthCardCfg.desc, monthCardCfg.vip_1[1]),
                sureText: gdk.i18n.t('i18n:FUNDS_TIP3'),
                sureCb: () => {
                    gdk.panel.hide(PanelId.FundsBuyPreView)
                    gdk.panel.setArgs(PanelId.MonthCard, [1])
                    gdk.panel.open(PanelId.TradingPort, (node) => {
                        let ctrl = node.getComponent(TradingPortViewCtrl)
                        ctrl.selectPanel(12)
                    });
                }
            });
        }
    }
}
