import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MineModel from '../../model/MineModel';
import MinePassPortRewardItemCtrl from './MinePassPortRewardItemCtrl';
import MineUtil from '../../util/MineUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StoreModel from '../../../store/model/StoreModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { Activitycave_privilegeCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { StoreEventId } from '../../../store/enum/StoreEventId';

/**
 * 矿洞大作战通行证Item
 * @Author: yaozu.hu
 * @Date: 2020-08-10 11:02:45
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-22 11:21:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MinePassPortViewCtrl")
export default class MinePassPortViewCtrl extends gdk.BasePanel {

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

    list: ListView = null;
    cfgs: Activitycave_privilegeCfg[] = [];

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        v = Math.max(0, v);
        this._leftTime = v;
        this.resetTimeLabel.string = gdk.i18n.t("i18n:MINECOPY_TIME_TIP1") + TimerUtils.format3(v);
        if (v == 0) {
            //TODO
            ModelManager.get(StoreModel).isBuyPassPort = false;
            ModelManager.get(StoreModel).passPortFreeReward = [];
            ModelManager.get(StoreModel).passPortChargeReward = [];
            ModelManager.get(RoleModel).pass = 0;
            gdk.e.emit(StoreEventId.UPDATE_PASS_PORT);
            gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP7"));
            this.close();
        }
    }
    model: MineModel;
    dtime: number = 0;
    endTime: number = 0;
    update(dt: number) {
        if (this.progressContent.y == 0) this.onTaskScroll();
        if (!this.leftTime || this.leftTime <= 0) return;
        if (this.dtime >= 1) {
            let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
            this.dtime = 0;
        }
        else {
            this.dtime += dt;
        }
    }

    onEnable() {
        this.model = ModelManager.get(MineModel);
        let msg = new icmsg.ActivityCavePassListReq()
        NetManager.send(msg, (rsp: icmsg.ActivityCavePassListRsp) => {
            this.model.passBoight = rsp.bought;
            this.model.passReward1 = rsp.rewarded1;
            this.model.passReward2 = rsp.rewarded2;
            this.cfgs = ConfigManager.getItems(Activitycave_privilegeCfg);
            this._initList();
            this.expLabel.string = `${BagUtils.getItemNumById(this.cfgs[0].exp[0])}`;
            let b = rsp.bought
            GlobalUtil.setSpriteIcon(this.node, this.buyBtn.node, `view/store/textrue/passPort/${b ? 'txz_goumaitongxingzheng02' : 'txz_goumaitongxingzheng'}`);
            this.buyBtn.interactable = !b;
            let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            this.endTime = ActUtil.getActEndTime(14) / 1000;
            this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
        })
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_PASS_REWARD, this._onPassAwardRsp, this);
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
                let pass = BagUtils.getItemNumById(this.cfgs[0].exp[0]);//ModelManager.get(RoleModel).pass;
                if (this.cfgs[i].exp[1] <= pass) {
                    if (!MineUtil.getMinePassRewardState(1, this.cfgs[i].id)) {
                        this.list.scroll_to(Math.max(0, i - 1));
                        this.onTaskScroll();
                        return;
                    }
                    if (this.model.passBoight && !MineUtil.getMinePassRewardState(2, this.cfgs[i].id)) {
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
        let pass = BagUtils.getItemNumById(this.cfgs[0].exp[0]);
        for (let i = 0; i < this.cfgs.length; i++) {
            if (this.cfgs[i].exp[1] <= pass) {
                bar.height += (i == 0 ? 20 : dl);
            }
            else {
                let preScroe = this.cfgs[i - 1] ? this.cfgs[i - 1].exp[1] : 0;
                let targetScroe = this.cfgs[i].exp[1];
                let ddl = dl / (targetScroe - preScroe);
                bar.height += (ddl * (pass - preScroe));
                return;
            }
        }
        bar.height = Math.min(bg.height, dl * pass);
    }

    _updateSpecialItem() {
        // let cfgs: Activitycave_privilegeCfg[] = this.cfgs.filter(cfg => {
        //     return cfg.resident == 1;
        // })

        for (let i = 0; i < this.cfgs.length; i++) {
            if (i != this.cfgs.length - 1 && MineUtil.getMinePassRewardState(1, this.cfgs[i].id) && MineUtil.getMinePassRewardState(2, this.cfgs[i].id)) continue;
            else {
                let ctrl = this.specialItem.getChildByName('MinePassPortRewardItem').getComponent(MinePassPortRewardItemCtrl);
                ctrl.data = this.cfgs[i];
                ctrl.updateView();
                break;
            }
        }
    }

    onBuyBtnClick() {
        if (this.model.passBoight) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP8"));
        }
        else {
            gdk.panel.setArgs(PanelId.MinePassPortBuyView, this.cfgs);
            gdk.panel.open(PanelId.MinePassPortBuyView);
        }
    }

    _onPaySucc(data: gdk.Event) {
        if (data.data.paymentId == 700005) {
            // gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP9"));
            GlobalUtil.setSpriteIcon(this.node, this.buyBtn.node, `view/store/textrue/passPort/txz_goumaitongxingzheng02`);
            this.buyBtn.interactable = false;
            this.list.clear_items();
            this.cfgs && this.list.set_data(this.cfgs);
            gdk.Timer.callLater(this, () => {
                let msg = new icmsg.ActivityCavePassListReq()
                NetManager.send(msg, (rsp: icmsg.ActivityCavePassListRsp) => {
                    this.model.passBoight = rsp.bought;
                    this.model.passReward1 = rsp.rewarded1;
                    this.model.passReward2 = rsp.rewarded2;
                    let bg = this.progressContent.getChildByName('progressBg');
                    bg.height = this.rewardContent.height - 100;
                    this._updateProgress();
                    this._updateSpecialItem();
                })
            })
        }
    }

    _onPassAwardRsp(e) {
        // let cfg = ConfigManager.getItem(PassCfg, (cfg: PassCfg) => {
        //     if (cfg.taskid == resp.id && cfg.cycle == this.cfgs[0].cycle) {
        //         return true;
        //     }
        // });
        // if (cfg.resident == 1) 
        this._updateSpecialItem();
    }
}
