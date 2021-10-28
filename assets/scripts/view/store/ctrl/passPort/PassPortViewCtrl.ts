import ActUtil from '../../../act/util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../../lottery/ctrl/HeroDetailViewCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PassPortRewardItemCtrl from './PassPortRewardItemCtrl';
import RoleModel from '../../../../common/models/RoleModel';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { GlobalCfg, HeroCfg, PassCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../../role/enum/RoleEventId';
import { StoreEventId } from '../../enum/StoreEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-30 15:05:11 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/passPort/PassPortViewCtrl")
export default class PassPortViewCtrl extends gdk.BasePanel {

    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.Button)
    getExpBtn: cc.Button = null;

    @property(cc.Label)
    expLabel: cc.Label = null;

    @property(cc.Label)
    resetTimeLabel: cc.Label = null;

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

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    list: ListView = null;
    cfgs: PassCfg[] = [];

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        v = Math.max(0, v);
        this._leftTime = v;
        this.resetTimeLabel.string = gdk.i18n.t('i18n:ADVENTURE_TIP35') + TimerUtils.format3(v);
        if (v == 0) {
            //TODO
            this.storeModel.isBuyPassPort = false;
            this.storeModel.passPortFreeReward = [];
            this.storeModel.passPortChargeReward = [];
            this.storeModel.passPortsETime = null;
            ModelManager.get(RoleModel).pass = 0;
            gdk.e.emit(StoreEventId.UPDATE_PASS_PORT);
            gdk.gui.showMessage(gdk.i18n.t('i18n:MINECOPY_PASSPORT_TIP7'));
            this.close();
        }
    }

    dtime: number = 0;
    update(dt: number) {
        if (this.progressContent.y == 0) this.onTaskScroll();
        if (!this.leftTime || this.leftTime <= 0) return;
        if (this.dtime >= 1) {
            let period = ConfigManager.getItemByField(GlobalCfg, 'key', 'pass_cycle').value[0];
            let serverTime = GlobalUtil.getServerTime();
            let startTime;
            let curPeriod;
            if (this.storeModel.passPortsETime && this.storeModel.passPortsETime.startTime > 0) {
                startTime = this.storeModel.passPortsETime.startTime * 1000;
                curPeriod = this.storeModel.passPortsETime.cycle;
                this.leftTime = Math.floor((this.storeModel.passPortsETime.endTime * 1000 - serverTime) / 1000);
            } else {
                startTime = ActUtil.getActStartTime(31);
                curPeriod = Math.floor((serverTime - startTime) / (period * 24 * 60 * 60 * 1000)) + 1;
                this.leftTime = Math.floor((startTime + curPeriod * period * 24 * 60 * 60 * 1000 - serverTime) / 1000);;
            }
            this.dtime = 0;
        }
        else {
            this.dtime += dt;
        }
    }

    onEnable() {
        this._initTime();
        this._initList();
        this.expLabel.string = `${BagUtils.getItemNumById(12)}`;
        let b = this.storeModel.isBuyPassPort;
        GlobalUtil.setSpriteIcon(this.node, this.buyBtn.node, `view/store/textrue/passPort/${b ? 'txz_goumaitongxingzheng02' : 'txz_goumaitongxingzheng'}`);
        this.buyBtn.interactable = !b;
        this.buyBtn.node.getChildByName('spine').active = !b;
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

    _updateScore(e) {
        let { index, value, oldv, } = e.data;
        if (index !== 12 || value == oldv) return;
        this.expLabel.string = `${BagUtils.getItemNumById(12)}`;
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
        if (this.storeModel.passPortsETime && this.storeModel.passPortsETime.startTime > 0) {
            startTime = this.storeModel.passPortsETime.startTime * 1000;
            curPeriod = this.storeModel.passPortsETime.cycle;
            this.leftTime = Math.floor((this.storeModel.passPortsETime.endTime * 1000 - serverTime) / 1000);
        } else {
            startTime = ActUtil.getActStartTime(31);
            curPeriod = Math.floor((serverTime - startTime) / (period * 24 * 60 * 60 * 1000)) + 1;
            this.leftTime = Math.floor((startTime + curPeriod * period * 24 * 60 * 60 * 1000 - serverTime) / 1000);
        }
        this.cfgs = ConfigManager.getItemsByField(PassCfg, 'cycle', curPeriod);
        if (!this.cfgs || this.cfgs.length <= 0) {
            let cfgs = ConfigManager.getItems(PassCfg);
            this.cfgs = ConfigManager.getItemsByField(PassCfg, 'cycle', cfgs[cfgs.length - 1].cycle);
        }
        let model = this.storeModel;
        if (model.lastPeriod && model.lastPeriod != curPeriod) {
            model.isBuyPassPort = false;
            model.passPortFreeReward = [];
            model.passPortChargeReward = [];
            this.storeModel.passPortsETime = null;
            ModelManager.get(RoleModel).pass = 0;
            gdk.e.emit(StoreEventId.UPDATE_PASS_PORT);
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
                let pass = ModelManager.get(RoleModel).pass;
                if (this.cfgs[i].score <= pass) {
                    if (!StoreUtils.getPassPortRewardState(this.cfgs[i].taskid, 1)) {
                        this.list.scroll_to(Math.max(0, i - 1));
                        this.onTaskScroll();
                        return;
                    }
                    if (this.storeModel.isBuyPassPort && !StoreUtils.getPassPortRewardState(this.cfgs[i].taskid, 2)) {
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
        let pass = ModelManager.get(RoleModel).pass;
        for (let i = 0; i < this.cfgs.length; i++) {
            if (this.cfgs[i].score <= pass) {
                bar.height += (i == 0 ? 20 : dl);
            }
            else {
                let preScroe = this.cfgs[i - 1] ? this.cfgs[i - 1].score : 0;
                let targetScroe = this.cfgs[i].score;
                let ddl = dl / (targetScroe - preScroe);
                bar.height += (ddl * (pass - preScroe));
                return;
            }
        }
        bar.height = Math.min(bg.height, dl * ModelManager.get(RoleModel).pass);
    }

    _updateSpecialItem() {
        let cfgs: PassCfg[] = this.cfgs.filter(cfg => {
            return cfg.resident == 1;
        })

        for (let i = 0; i < cfgs.length; i++) {
            if (i != cfgs.length - 1 && StoreUtils.getPassPortRewardState(cfgs[i].taskid, 1) && StoreUtils.getPassPortRewardState(cfgs[0].taskid, 2)) continue;
            else {
                let ctrl = this.specialItem.getChildByName('PassPortRewardItem').getComponent(PassPortRewardItemCtrl);
                ctrl.data = cfgs[i];
                ctrl.updateView();
                break;
            }
        }
    }

    showHeroTip() {
        let heroCfg = ConfigManager.getItemById(HeroCfg, 300016);
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(heroCfg)
        })
    }

    onBuyBtnClick() {
        if (this.storeModel.isBuyPassPort) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ADVENTURE_TIP37'));
        }
        else {
            gdk.panel.setArgs(PanelId.BuyPassPort, this.cfgs);
            gdk.panel.open(PanelId.BuyPassPort);
        }
    }

    _onPaySucc(data: gdk.Event) {
        if (data.data.paymentId == 700001) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ADVENTURE_TIP38'));
            GlobalUtil.setSpriteIcon(this.node, this.buyBtn.node, `view/store/textrue/passPort/txz_goumaitongxingzheng02`);
            this.buyBtn.interactable = false;
            this.buyBtn.node.getChildByName('spine').active = false;
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
        let cfg = ConfigManager.getItem(PassCfg, (cfg: PassCfg) => {
            if (cfg.taskid == resp.id && cfg.cycle == this.cfgs[0].cycle) {
                return true;
            }
        });
        if (cfg.resident == 1) this._updateSpecialItem();
    }
}
