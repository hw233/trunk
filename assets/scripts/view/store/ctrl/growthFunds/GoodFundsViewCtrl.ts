import {
    GlobalCfg,
    Pass_daily_rewardsCfg,
    Pass_fundCfg,
    Store_miscCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import PanelId from '../../../../configs/ids/PanelId';
import ActUtil from '../../../act/util/ActUtil';
import StoreModel from '../../model/StoreModel';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-30 19:13:42
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/growthFunds/GoodFundsViewCtrl")
export default class GoodFundsViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    buyNode: cc.Node = null;

    @property(cc.Node)
    unBuyNode: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    costLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.Node)
    getTipsBtn: cc.Node = null;

    @property(cc.Node)
    btnPre: cc.Node = null;

    @property(cc.ScrollView)
    scrollView2: cc.ScrollView = null;

    @property(cc.Node)
    content2: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    TipSp: cc.Sprite = null;

    _fundsId = 700006

    list: ListView = null

    _rewardCfgs: Pass_daily_rewardsCfg[];
    reward: number[][] = [];
    _canGetIndex = 0
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onEnable() {
        this._updateViewInfo()
    }

    onDisable() {
        this.unschedule(this._updateEndTime)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            column: 5,
            gap_x: 0,
            gap_y: 0,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    @gdk.binding('storeModel.goodFundsInfo')
    _refreshViewInfo() {
        this._updateViewInfo(false)
    }


    _updateViewInfo(isReset: boolean = true) {
        this._initListView()

        let misc_cfg = ConfigManager.getItemById(Store_miscCfg, this._fundsId)
        this.costLab.string = `${StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), misc_cfg.RMB_cost)}${gdk.i18n.t('i18n:FUNDS_TIP1')}`
        let fund_cfg = ConfigManager.getItemById(Pass_fundCfg, this._fundsId)

        let period = ConfigManager.getItemByField(GlobalCfg, 'key', 'pass_cycle').value[0];
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000);
        let startTime = ActUtil.getActStartTime(120) / 1000;
        let curPeriod = Math.floor((serverTime - startTime) / (period * 24 * 60 * 60)) + 1;
        let rewards = ConfigManager.getItems(Pass_daily_rewardsCfg, { group: fund_cfg.daily_rewards, cycle: curPeriod })
        if (!rewards || rewards.length <= 0) {
            let cfgs = ConfigManager.getItems(Pass_daily_rewardsCfg, { group: fund_cfg.daily_rewards });
            rewards = ConfigManager.getItems(Pass_daily_rewardsCfg, { group: fund_cfg.daily_rewards, cycle: cfgs[cfgs.length - 1].cycle });
        }

        this._rewardCfgs = rewards;
        this._canGetIndex = 0;
        let info = this.storeModel.goodFundsInfo
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
        //let info = this.storeModel.goodFundsInfo
        let datas = []

        for (let i = 0; i < rewards.length; i++) {
            datas.push({ cfg: rewards[i], info: info })
        }
        this.list.set_data(datas, isReset)


        let selectIndex = 0
        if (info && info.startTime > 0) {
            let startZero = TimerUtils.getZerohour(info.startTime)
            let rewardZero = TimerUtils.getZerohour(info.rewardTime)
            for (let i = 0; i < rewards.length; i++) {
                if (rewardZero < (startZero + (rewards[i].day - 1) * 24 * 60 * 60)) {
                    selectIndex = i
                    break
                }
            }
        }
        this.list.scroll_to(selectIndex)
        let endTime = startTime + curPeriod * (period * 24 * 60 * 60)
        //this.btnPre.active = true
        if (info && info.startTime > 0 && endTime - serverTime > 0) {
            let startZero = TimerUtils.getZerohour(info.startTime)
            let rewardZero = TimerUtils.getZerohour(info.rewardTime)
            if ((startZero + 30 * 86400) < serverTime) {
                this.buyNode.active = false
                this.unBuyNode.active = true
                this.updateScrollView()
            } else {
                //this.btnPre.active = false
                this.buyNode.active = true
                this.unBuyNode.active = false
                if (Math.floor(GlobalUtil.getServerTime() / 1000) > info.rewardTime) {
                    let isReward = TimerUtils.isCurDay(info.rewardTime)
                    this.getBtn.active = !isReward;
                    this.getTipsBtn.active = isReward;
                } else {
                    this.getBtn.active = false;
                    this.getTipsBtn.active = true;
                }
                this.updateScrollView(1)
            }
        } else {
            this.buyNode.active = false
            this.unBuyNode.active = true
            this.updateScrollView()
        }
        this._updateEndTime()
        this.schedule(this._updateEndTime, 1)


    }

    updateScrollView(state: number = 0) {
        let path = state == 1 ? 'view/store/textrue/growthFunds/jj_leijikehuode' : 'view/store/textrue/growthFunds/jj_xianzaigoumai';
        GlobalUtil.setSpriteIcon(this.node, this.TipSp, path);

        this.content2.removeAllChildren();
        let tem = state == 1 ? this._rewardCfgs.length : this._canGetIndex
        let reward2 = this._composeReward(tem);

        reward2.forEach(reward => {
            let id = reward[0];
            let num = reward[1];
            let slot1 = this.createSlot(id, num);
            slot1.parent = this.content2;
        });
        this.content2.getComponent(cc.Layout).updateLayout();
        if (reward2.length <= 5) this.scrollView2.node.width = this.content2.width;
        else this.scrollView2.node.width = 600;
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

    _updateEndTime() {
        let period = ConfigManager.getItemByField(GlobalCfg, 'key', 'pass_cycle').value[0];
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000);
        let startTime = ActUtil.getActStartTime(120) / 1000;
        let curPeriod = Math.floor((serverTime - startTime) / (period * 24 * 60 * 60)) + 1;
        let endTime = startTime + curPeriod * (period * 24 * 60 * 60)
        if (endTime - serverTime > 0) {
            this.timeLab.string = `${TimerUtils.format1(Math.floor(endTime - serverTime))}`
        } else {
            this.unschedule(this._updateEndTime)
            let msg = new icmsg.PassFundListReq()
            NetManager.send(msg)
        }
    }

    getFunc() {
        let msg = new icmsg.PassFundFetchReq();
        msg.index = 1
        NetManager.send(msg, (data: icmsg.PassFundFetchRsp) => {
            GlobalUtil.openRewadrView(data.list)
            this.storeModel.goodFundsInfo = data.fund
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        })
    }

    buyFunc() {
        this.openBuyPreView()
    }

    openBuyPreView() {
        gdk.panel.setArgs(PanelId.FundsBuyPreView, this._fundsId)
        gdk.panel.open(PanelId.FundsBuyPreView)
    }

}