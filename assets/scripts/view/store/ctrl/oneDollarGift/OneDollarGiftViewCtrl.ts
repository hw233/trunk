import ActivityModel from '../../../act/model/ActivityModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import { Gift_powerCfg, Store_miscCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { StoreEventId } from '../../enum/StoreEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-02 14:33:17 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/oneDollarGift/OneDollarGiftViewCtrl")
export default class OneDollarGiftViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Label)
    fightNumLabel: cc.Label = null;

    @property(cc.Label)
    rewardNumLabel: cc.Label = null;

    @property(cc.ScrollView)
    taskScrollView: cc.ScrollView = null;

    @property(cc.Node)
    taskContent: cc.Node = null;

    @property(cc.ScrollView)
    progressScrollView: cc.ScrollView = null;

    @property(cc.Node)
    progressContent: cc.Node = null;

    @property(cc.Prefab)
    taskItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    priceNode: cc.Node = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    list: ListView = null;
    cfgs: Gift_powerCfg[] = [];
    onEnable() {
        let price = ConfigManager.getItemById(Store_miscCfg, 700002).RMB_cost;
        cc.find('bg/moneyNode/money', this.node).getComponent(cc.Label).string = price + '';
        cc.find('priceNode/buyBtn/label', this.node).getComponent(cc.Label).string = price + '元购买';
        this.cfgs = ConfigManager.getItems(Gift_powerCfg);
        let totalNum: number = 0;
        this.cfgs.forEach(cfg => {
            let rewards = cfg.reward;
            for (let i = 0; i < rewards.length; i++) {
                // if (rewards[i][0] == 140001) 
                totalNum += rewards[i][1];
            }
        });
        this.rewardNumLabel.string = totalNum + '';
        let roleModel = ModelManager.get(RoleModel);
        GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', this.head), GlobalUtil.getHeadIconById(roleModel.head));
        GlobalUtil.setSpriteIcon(this.node, cc.find('iconBg', this.head), GlobalUtil.getHeadFrameById(roleModel.frame));
        this.fightNumLabel.string = roleModel.power + '';
        this.priceNode.active = !this.storeModel.isBuyOneDollarGift;
        this._initList();
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
        NetManager.on(icmsg.StoreMiscGiftPowerAwardRsp.MsgType, this._onStoreMiscGiftPowerAwardRsp, this);

        // this.node.setScale(.7);
        // this.node.runAction(cc.sequence(
        //     cc.scaleTo(.2, 1.05, 1.05),
        //     cc.scaleTo(.15, 1, 1)
        // ));
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        this.list && this.list.destroy();
        this.list = null;
        this.cfgs = [];
        this.node.stopAllActions();
    }

    _initList() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.taskScrollView,
            mask: this.taskScrollView.node,
            content: this.taskContent,
            item_tpl: this.taskItemPrefab,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })

        this.list.clear_items();
        this.list.set_data(this.cfgs);
        gdk.Timer.callLater(this, () => {
            let bg = this.progressContent.getChildByName('progressBg');
            bg.height = this.taskContent.height - 66;
            this._updateProgress();
            for (let i = 0; i < this.cfgs.length; i++) {
                let power = ModelManager.get(RoleModel).power;
                if (!StoreUtils.getOneDollarGiftRewardState(this.cfgs[i].index) && power >= this.cfgs[i].power) {
                    this.list.scroll_to(i);
                    this.onTaskScroll();
                    return;
                }
                if (power < this.cfgs[i].power) {
                    this.list.scroll_to(Math.max(0, i - 3));
                    this.onTaskScroll();
                    return;
                }
            }
            this.list.scroll_to(Math.max(0, this.cfgs.length - 1));
            this.onTaskScroll();
        })
        gdk.Timer.frameOnce(2, this, this.onTaskScroll);
    }

    onTaskScroll() {
        // this.progressScrollView.scrollToOffset(this.taskScrollView.getScrollOffset());
        this.progressContent.y = this.taskContent.y - 6;
    }

    _updateProgress() {
        let bg = this.progressContent.getChildByName('progressBg');
        let bar = bg.getChildByName('progressbar');
        bar.height = 0;
        let cfgs = this.cfgs;
        let dl = this.taskContent.height / cfgs.length - 61;
        let power = ModelManager.get(RoleModel).power;
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].power <= power) {
                bar.height += (i == 0 ? dl : dl + 61);
            }
            else {

                let prePower = cfgs[i - 1] ? cfgs[i - 1].power : 0;
                let targetpower = cfgs[i].power;
                let ddl = (i == 0 ? dl : dl + 61) / (targetpower - prePower);
                bar.height += (ddl * (power - prePower));
                return;
            }
        }
        bar.height = Math.min(bar.height, this.taskContent.height - 66);
    }

    onBuyBtnClick() {
        if ((JumpUtils.ifSysOpen(1801) && !this.storeModel.firstPayTime) || ModelManager.get(ActivityModel).historyPaySum <= 0) {
            GlobalUtil.openAskPanel({
                descText: gdk.i18n.t('i18n:ONE_DOLLAR_GIFT_TIP4'),
                sureText: gdk.i18n.t('i18n:ONE_DOLLAR_GIFT_TIP5'),
                sureCb: () => {
                    gdk.panel.hide(PanelId.TradingPort);
                    if (JumpUtils.ifSysOpen(1801)) {
                        gdk.panel.open(PanelId.FirstPayGift);
                    } else {
                        JumpUtils.openRechargetLBPanel([2]);
                    }
                }
            })
            return;
        }
        if (this.storeModel.isBuyOneDollarGift) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ONE_DOLLAR_GIFT_TIP6'));
            return;
        }
        gdk.panel.open(PanelId.BuyOneDollarGift);
    }

    _onPaySucc(data: gdk.Event) {
        if (data.data.paymentId == 700002) {
            // gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP6'));
            this.priceNode.active = false;
        }
    }

    _onStoreMiscGiftPowerAwardRsp(resp: icmsg.StoreMiscGiftPowerAwardRsp) {
        if (!this.node.active) return;
        // if (StoreUtils.isAllRewardRecivedInOneDollarGiftView()) this.node.active = false;
    }
}
