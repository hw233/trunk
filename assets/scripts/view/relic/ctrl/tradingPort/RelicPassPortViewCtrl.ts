import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RelicModel from '../../model/RelicModel';
import RelicPassPortRewardItemCtrl from './RelicPassPortRewardItemCtrl';
import RelicUtils from '../../utils/RelicUtils';
import RoleModel from '../../../../common/models/RoleModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import { GlobalCfg, Relic_passCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RelicEventId } from '../../enum/RelicEventId';
import { RoleEventId } from '../../../role/enum/RoleEventId';
import { StoreEventId } from '../../../store/enum/StoreEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/tradingPort/RelicPassPortViewCtrl")
export default class RelicPassPortViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    rewardScrollView: cc.ScrollView = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.ScrollView)
    progressScrollView: cc.ScrollView = null;

    @property(cc.Node)
    progressContent: cc.Node = null;

    @property(cc.Node)
    specialItem: cc.Node = null;

    @property(cc.Prefab)
    rewardItemPrefab: cc.Prefab = null;

    get relicModel(): RelicModel { return ModelManager.get(RelicModel); }

    list: ListView = null;
    cfgs: Relic_passCfg[] = [];


    onEnable() {
        this._initTime();
        this._initList();
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
        NetManager.on(icmsg.PassAwardRsp.MsgType, this._onPassAwardRsp, this);
        gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateScore, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
    }

    update(dt: number) {
        if (this.progressContent.y == 0) this.onTaskScroll();
    }

    _updateScore(e) {
        let { index, value, oldv, } = e.data;
        if (index !== 28 || value == oldv) return;
        this.list.clear_items();
        this.cfgs && this.list.set_data(this.cfgs);
        gdk.Timer.callLater(this, () => {
            let bg = this.progressContent.getChildByName('progressBg');
            bg.height = this.rewardContent.height - 100;
            this._updateProgress();
            this._updateSpecialItem();
        })
    }

    _initTime() {
        let period = ConfigManager.getItemByField(GlobalCfg, 'key', 'pass_cycle').value[0];
        let serverTime = GlobalUtil.getServerTime();
        let startTime;
        let curPeriod;
        if (this.relicModel.passPortsETime && this.relicModel.passPortsETime.startTime > 0) {
            startTime = this.relicModel.passPortsETime.startTime * 1000;
            curPeriod = this.relicModel.passPortsETime.cycle;
        } else {
            startTime = ActUtil.getActStartTime(85);
            curPeriod = Math.floor((serverTime - startTime) / (period * 24 * 60 * 60 * 1000)) + 1;
        }
        this.cfgs = ConfigManager.getItemsByField(Relic_passCfg, 'cycle', curPeriod);
        if (!this.cfgs || this.cfgs.length <= 0) {
            let cfgs = ConfigManager.getItems(Relic_passCfg);
            this.cfgs = ConfigManager.getItemsByField(Relic_passCfg, 'cycle', cfgs[cfgs.length - 1].cycle);
        }
        let model = ModelManager.get(RelicModel);
        if (model.lastPeriod && model.lastPeriod != curPeriod) {
            model.isBuyPassPort = false;
            model.passPortFreeReward = [];
            model.passPortChargeReward = [];
            model.passPortsETime = null;
            ModelManager.get(RoleModel).relic = 0;
            gdk.e.emit(RelicEventId.UPDATE_RELIC_PASS_PORT);
        }
        model.lastPeriod = curPeriod;
    }



    _initList() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.list = new ListView({
            scrollview: this.rewardScrollView,
            mask: this.rewardScrollView.node,
            content: this.rewardContent,
            item_tpl: this.rewardItemPrefab,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })

        this.list.clear_items();
        this.cfgs && this.list.set_data(this.cfgs);
        gdk.Timer.callLater(this, () => {
            if (!this.list || !cc.isValid(this.node)) return;
            let bg = this.progressContent.getChildByName('progressBg');
            bg.height = this.rewardContent.height - 100;
            this._updateProgress();
            this._updateSpecialItem();
            for (let i = 0; i < this.cfgs.length; i++) {
                let pass = ModelManager.get(RoleModel).relic;
                if (this.cfgs[i].point[1] <= pass) {
                    if (!RelicUtils.getPassPortRewardState(this.cfgs[i].taskid, 1)) {
                        this.list.scroll_to(Math.max(0, i - 1));
                        this.onTaskScroll();
                        return;
                    }
                    if (ModelManager.get(RelicModel).isBuyPassPort && !RelicUtils.getPassPortRewardState(this.cfgs[i].taskid, 2)) {
                        this.list.scroll_to(Math.max(0, i - 1));
                        this.onTaskScroll();
                        return;
                    }
                }
                else {
                    this.list.scroll_to(Math.max(0, i - 1));
                    this.onTaskScroll();
                    return;
                }
            }
        })
    }

    onTaskScroll() {
        this.progressContent.y = this.rewardContent.y - 50;
    }

    _updateProgress() {
        let bg = this.progressContent.getChildByName('progressBg');
        let bar = bg.getChildByName('progressbar');
        bar.height = 0;
        // let dl = bg.height / this.cfgs.length;
        let dl = 126 + 5;
        let pass = ModelManager.get(RoleModel).relic;
        for (let i = 0; i < this.cfgs.length; i++) {
            if (this.cfgs[i].point[1] <= pass) {
                bar.height += (i == 0 ? 20 : dl);
            }
            else {
                let preScroe = this.cfgs[i - 1] ? this.cfgs[i - 1].point[1] : 0;
                let targetScroe = this.cfgs[i].point[1]
                let ddl = dl / (targetScroe - preScroe);
                bar.height += (ddl * (pass - preScroe));
                return;
            }
        }
        bar.height = Math.min(bg.height, dl * ModelManager.get(RoleModel).relic);
    }

    _updateSpecialItem() {
        let cfgs: Relic_passCfg[] = this.cfgs.filter(cfg => {
            return cfg.resident == 1;
        })

        for (let i = 0; i < cfgs.length; i++) {
            if (i != cfgs.length - 1 && StoreUtils.getPassPortRewardState(cfgs[i].taskid, 1) && StoreUtils.getPassPortRewardState(cfgs[0].taskid, 2)) continue;
            else {
                let ctrl = this.specialItem.getChildByName('PassPortRewardItem').getComponent(RelicPassPortRewardItemCtrl);
                ctrl.data = cfgs[i];
                ctrl.updateView();
                break;
            }
        }
    }

    // showHeroTip() {
    //     let heroCfg = ConfigManager.getItemById(HeroCfg, 300016);
    //     gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
    //         let comp = node.getComponent(HeroDetailViewCtrl)
    //         comp.initHeroInfo(heroCfg)
    //     })
    // }

    onBuyBtnClick() {
        if (ModelManager.get(RelicModel).isBuyPassPort) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ADVENTURE_TIP37'));
        }
        else {
            gdk.panel.setArgs(PanelId.RelicPassPortBuyView, this.cfgs);
            gdk.panel.open(PanelId.RelicPassPortBuyView);
        }
    }

    _onPaySucc(data: gdk.Event) {
        if (data.data.paymentId == 700009) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ADVENTURE_TIP38'));
            this.list.clear_items();
            this.cfgs && this.list.set_data(this.cfgs);
            gdk.Timer.callLater(this, () => {
                let bg = this.progressContent.getChildByName('progressBg');
                bg.height = this.rewardContent.height - 100;
                this._updateProgress();
                this._updateSpecialItem();
            })
        }
    }

    _onPassAwardRsp(resp: icmsg.PassAwardRsp) {
        let cfg = ConfigManager.getItem(Relic_passCfg, (cfg: Relic_passCfg) => {
            if (cfg.taskid == resp.id && cfg.cycle == this.cfgs[0].cycle) {
                return true;
            }
        });
        if (cfg.resident == 1) this._updateSpecialItem();
    }
}