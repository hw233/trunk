import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import WeeklyPassPortRewardItemCtrl from './WeeklyPassPortRewardItemCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Pass_weeklyCfg } from '../../../../a/config';
import { StoreEventId } from '../../enum/StoreEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-31 10:23:20 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/weeklyPassPort/WeeklyPassPortViewCtrl")
export default class WeeklyPassPortViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    buyBtn: cc.Node = null;

    @property(cc.Label)
    signDaysLab: cc.Label = null;

    @property(cc.Label)
    resetTimeLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    specialItem: cc.Node = null;

    @property(cc.Prefab)
    rewardItemPrefab: cc.Prefab = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    actId: number = 87;
    curCycle: number;
    list: ListView;
    cfgs: Pass_weeklyCfg[] = [];
    onEnable() {
        this._updateView();
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
        NetManager.on(icmsg.PassWeeklyAwardRsp.MsgType, this._onPassWeeklyAwardRsp, this);
        gdk.e.on(StoreEventId.UPDATE_WEEKLY_PASS_PORT, () => {
            this._updateView();
        }, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    _updateView() {
        let b = ModelManager.get(StoreModel).isBuyWeeklyPassPort;
        GlobalUtil.setSpriteIcon(this.node, this.buyBtn, `view/store/textrue/weeklyPassPort/${b ? 'thzk_yigoumai' : 'thzk_goumaizhouka'}`);
        this.buyBtn.getComponent(cc.Button).interactable = !b;
        this._updateLeftTime();
        this.schedule(this._updateLeftTime, 1);
        this._updateList();
    }

    onBuyBtnClick() {
        if (ModelManager.get(StoreModel).isBuyWeeklyPassPort) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ADVENTURE_TIP37'));
        }
        else {
            gdk.panel.setArgs(PanelId.BuyWeeklyPassPort, this.cfgs);
            gdk.panel.open(PanelId.BuyWeeklyPassPort);
        }
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.rewardItemPrefab,
                cb_host: this,
                async: true,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initList();
        let cfgs = ConfigManager.getItems(Pass_weeklyCfg);
        let cycle = Math.min(cfgs[cfgs.length - 1].cycle, this.curCycle);
        this.cfgs = ConfigManager.getItemsByField(Pass_weeklyCfg, 'cycle', cycle);
        this.list.clear_items();
        this.list.set_data(this.cfgs);
        this._updateSpecialItem();
    }

    _updateSpecialItem() {
        let c = ConfigManager.getItems(Pass_weeklyCfg);
        let cycle = Math.min(c[c.length - 1].cycle, this.curCycle);
        let cfgs: Pass_weeklyCfg[] = this.cfgs.filter(cfg => {
            return cfg.resident == 1 && cfg.cycle == cycle;
        })

        for (let i = 0; i < cfgs.length; i++) {
            if (i != cfgs.length - 1 && StoreUtils.getWeeklyRewardState(cfgs[i].id, 1) && StoreUtils.getWeeklyRewardState(cfgs[0].id, 2)) continue;
            else {
                let ctrl = this.specialItem.getChildByName('WeeklyPassPortRewardItem').getComponent(WeeklyPassPortRewardItemCtrl);
                ctrl.data = cfgs[i];
                ctrl.updateView();
                break;
            }
        }
    }

    _updateLeftTime() {
        let sT;
        let now = GlobalUtil.getServerTime();
        if (this.storeModel.weeklyPassPortsETime && this.storeModel.weeklyPassPortsETime.startTime > 0) {
            sT = this.storeModel.weeklyPassPortsETime.startTime * 1000;
            this.curCycle = this.storeModel.weeklyPassPortsETime.cycle;
            this.resetTimeLab.string = `${gdk.i18n.t('i18n:ADVENTURE_TIP35')}${TimerUtils.format6(Math.max(0, this.storeModel.weeklyPassPortsETime.endTime * 1000 - now) / 1000)}`;
        } else {
            sT = ActUtil.getActStartTime(this.actId);
            this.curCycle = Math.floor((now - sT) / 604800000) + 1;
            this.resetTimeLab.string = `${gdk.i18n.t('i18n:ADVENTURE_TIP35')}${TimerUtils.format6(Math.max(0, sT + 604800000 * this.curCycle - now) / 1000)}`;
        }
        this.storeModel.weeklyCurSignDay = (Math.floor((now - sT) / 86400000) + 1) % 7 || 7;
        this.signDaysLab.string = `${this.storeModel.weeklyCurSignDay}${gdk.i18n.t('i18n:MONTH_CARD_TIP1')}`;
        if (this.storeModel.lastWeeklyCycle && this.storeModel.lastWeeklyCycle !== this.curCycle) {
            this.unscheduleAllCallbacks();
            this.resetTimeLab.string = gdk.i18n.t('i18n:WEEKLY_PASSPORT_TIP3');
        }
        this.storeModel.lastWeeklyCycle = this.curCycle;
    }

    _onPaySucc(data: gdk.Event) {
        if (data.data.paymentId == 700010) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP6'));
            GlobalUtil.setSpriteIcon(this.node, this.buyBtn, `view/store/textrue/weeklyPassPort/thzk_yigoumai`);
            this.buyBtn.getComponent(cc.Button).interactable = false;
            this._updateList();
        }
    }

    _onPassWeeklyAwardRsp(resp: icmsg.PassWeeklyAwardRsp) {
        let c = ConfigManager.getItems(Pass_weeklyCfg);
        let cycle = Math.min(c[c.length - 1].cycle, this.curCycle);
        let cfg = ConfigManager.getItem(Pass_weeklyCfg, (cfg: Pass_weeklyCfg) => {
            if (cfg.id % 7 == resp.day % 7 && cfg.cycle == cycle) {
                return true;
            }
        });
        if (cfg.resident == 1) this._updateSpecialItem();
    }
}
