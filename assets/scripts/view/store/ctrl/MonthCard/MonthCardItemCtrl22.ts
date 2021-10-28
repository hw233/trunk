import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../model/StoreModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { MCRewardInfo } from '../MonthCardCtrl';
import { Store_monthcardCfg } from '../../../../a/config';
import { StoreEventId } from '../../enum/StoreEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/MonthCard/MonthCardItemCtrl22")
export default class MonthCardItemCtrl22 extends cc.Component {

    @property(cc.Node)
    buyNode: cc.Node = null;

    @property(cc.Node)
    unBuyNode: cc.Node = null;

    @property(cc.Label)
    totalLab: cc.Label = null;

    @property(cc.Label)
    rechargeLab: cc.Label = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

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
    btnMore: cc.Node = null;

    data: icmsg.MonthCardInfo;
    cfg: Store_monthcardCfg;
    _info: icmsg.MonthCardDungeon
    _leftDay: number = 0

    list: ListView = null

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onEnable() {
        gdk.e.on(StoreEventId.UPDATE_MONTHCARD_RECEIVE, this._updateDatas, this)
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    updateView() {
        this.data = this.storeModel.getMonthCardInfo(500002);
        let nowTime = GlobalUtil.getServerTime() / 1000;
        if (this.data && this.data.time - nowTime > 0) {
            this.unBuyNode.active = false
            this.buyNode.active = true
            let time = this.data.time - nowTime;
            this._leftDay = Math.ceil(time / 86400);//剩余多少天
            this.timeLab.string = `${this._leftDay}${gdk.i18n.t('i18n:MONTH_CARD_TIP1')}`
            this.redPoint.active = !this.data.isRewarded
            this.getBtn.active = !this.data.isRewarded;
            this.getTipsBtn.active = this.data.isRewarded;
            this.btnMore.active = false
            if (this.data.isRewarded) {
                let goodFundsInfo = this.storeModel.goodFundsInfo
                if (!(goodFundsInfo && goodFundsInfo.startTime > 0)) {
                    this.getTipsBtn.active = false
                    this.btnMore.active = true
                }

                let betterFundsInfo = this.storeModel.betterFundsInfo
                if (!(betterFundsInfo && betterFundsInfo.startTime > 0)) {
                    this.getTipsBtn.active = false
                    this.btnMore.active = true
                }
            }

        } else {
            this.unBuyNode.active = true
            this.buyNode.active = false
            this.totalLab.string = `${this.cfg.top_up}`.replace('.', '/')
            if (this.data) {
                this.proBar.progress = this.data.paySum / this.cfg.top_up
                this.rechargeLab.string = `${this.data.paySum}/${this.cfg.top_up}`
            } else {
                this.proBar.progress = 0
                this.rechargeLab.string = `${0}/${this.cfg.top_up}`
            }
        }
        this._updateDatas(true)
    }

    _updateDatas(isReset: boolean = false) {
        this.data = this.storeModel.getMonthCardInfo(500002);
        this._initListView()
        let total = this.cfg.day
        let rewards = []

        let index = 0

        for (let i = 0; i < total; i++) {
            let info: MCRewardInfo = {
                type: 1, //类型 1，钻石 2 扫荡券
                cardInfo: this.data,
                itemId: this.cfg.vip_1[0],
                num: this.cfg.vip_1[1],
                index: i,
            }
            if (this._leftDay > 0 && this.data) {
                if (i == this.cfg.day - this._leftDay) {
                    index = i
                }
            }
            rewards.push(info)
        }
        if (this.data) {
            this.getBtn.active = !this.data.isRewarded;
            this.getTipsBtn.active = this.data.isRewarded;
        }
        this.list.set_data(rewards, isReset)
        this.list.scroll_to(index)
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


    buyFunc() {
        JumpUtils.openPanel({
            panelId: PanelId.Recharge,
            panelArgs: { args: [12] },
            currId: PanelId.TradingPort,
            callback: () => {
                gdk.panel.setArgs(PanelId.MonthCard, [1])
            }
        });
    }

    getFunc() {
        let msg = new icmsg.MonthCardDayRewardReq();
        msg.id = this.cfg.id;
        NetManager.send(msg)
    }

    tomorrowGetBtnFunc() {
        gdk.gui.showMessage(gdk.i18n.t('i18n:MONTH_CARD_TIP2'));
        // if (gdk.panel.isOpenOrOpening(PanelId.MonthCard)) {
        //     gdk.panel.hide(PanelId.MonthCard);
        // }
    }

    getMoreFunc() {
        gdk.panel.open(PanelId.MonthCardTipPanel)
    }
}