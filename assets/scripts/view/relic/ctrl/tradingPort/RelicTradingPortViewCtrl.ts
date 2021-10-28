import ActUtil from '../../../act/util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointCtrl from '../../../../common/widgets/RedPointCtrl';
import RelicModel from '../../model/RelicModel';
import RoleModel from '../../../../common/models/RoleModel';
import TaskUtil from '../../../task/util/TaskUtil';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { GlobalCfg, Relic_passCfg } from '../../../../a/config';
import { RelicEventId } from '../../enum/RelicEventId';
import { RoleEventId } from '../../../role/enum/RoleEventId';
import { StoreEventId } from '../../../store/enum/StoreEventId';

const { ccclass, property, menu } = cc._decorator;

const viewList: any = [
    { panelId: PanelId.RelicPassPortView, sysId: 0, rpIds: [20115], btnRes: "yzzz_yijizhizheng", sortId: 1 },
    { panelId: PanelId.RelicTaskView, sysId: 0, rpIds: [20116, 20117], btnRes: "yzzz_yijirenwu", sortId: 2 },
]

@ccclass
@menu("qszc/view/relic/tradingPort/RelicTradingPortViewCtrl")
export default class RelicTradingPortViewCtrl extends gdk.BasePanel {

    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.Label)
    expLabel: cc.Label = null;

    @property(cc.Label)
    resetTimeLabel: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(UiTabMenuCtrl)
    tabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    panelIndex: number = 0;    // 当前打开的界面索引

    onEnable() {

        let b = ModelManager.get(RelicModel).isBuyPassPort;
        GlobalUtil.setSpriteIcon(this.node, this.buyBtn.node, `view/relic/texture/tradingPort/${b ? 'txz_goumaitongxingzheng02' : 'txz_goumaitongxingzheng'}`);
        this.buyBtn.interactable = !b;
        this.buyBtn.node.getChildByName('spine').active = !b;
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
        gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateRelicScore, this);

        this._updateRelicScore()
        this._preloadPanel()
        this._initMenu()
        this._initLeftTime()
        this.tabMenu.node.children.forEach((btn, idx) => {
            if (viewList[idx]) {
                btn.active = JumpUtils.ifSysOpen(viewList[idx].sysId);
            }
        });
        let arg = this.args;
        let idx, sortId;
        if (arg) {
            if (arg instanceof Array) sortId = arg[0];
            else sortId = arg;
        }
        if (sortId && sortId > 0) {
            idx = this._getIdxBySortId(sortId);
        }
        else {
            idx = 0;
        }
        while (!JumpUtils.ifSysOpen(viewList[idx].sysId)) {
            idx += 1;
        }

        this._selectPanel(idx);
    }

    onDisable() {
        gdk.e.targetOff(this);
        // this.panelParent.removeAllChildren();
        // 关闭打开或打开中的子界面
        for (let i = 0, n = viewList.length; i < n; i++) {
            let panelId = viewList[i].panelId
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
    }

    // 跳转隐藏参数
    get hideArgs() {
        let r: gdk.PanelHideArg = {
            id: this.resId,
            args: viewList[this.panelIndex].sortId,
        };
        return r;
    }

    _preloadPanel() {
        viewList.forEach(obj => {
            let panelId: gdk.PanelValue = obj.panelId;
            panelId && gdk.panel.preload(panelId);
        });
    }

    _initMenu() {
        let l = 0;
        this.tabMenu.itemNames = viewList
        this.tabMenu.node.children.forEach((btn, idx) => {
            let obj = viewList[idx];
            if (obj) {
                let sysId = obj.sysId
                let rpIds = obj.rpIds
                if (JumpUtils.ifSysOpen(sysId)) {
                    l += 1;
                    let url = `view/relic/texture/tradingPort/${obj.btnRes}`;
                    GlobalUtil.setSpriteIcon(this.node, cc.find('select/icon', btn), url);
                    GlobalUtil.setSpriteIcon(this.node, cc.find('normal/icon', btn), url + '01');
                    let rpCtrl = btn.getComponent(RedPointCtrl)
                    rpCtrl.orIds = []
                    rpCtrl.enabled = false
                    if (rpIds.length > 0) {
                        rpCtrl.enabled = true
                        rpCtrl.orIds = rpIds
                    }
                } else {
                    btn.active = false
                }
            } else {
                btn && btn.removeFromParent();
            }
        });
        // this.scrollView.scrollToRight();
        this.scrollView.horizontal = l > 5;
    }

    selectPanel(sortId: number) {
        let idx = this._getIdxBySortId(sortId);
        if (!JumpUtils.ifSysOpen(viewList[idx].sysId)) {
            idx = 0;
        }
        while (!JumpUtils.ifSysOpen(viewList[idx].sysId)) {
            idx += 1;
        }
        this._selectPanel(idx);
    }

    _selectPanel(idx: number) {
        if (idx > this.tabMenu.itemNames.length - 1) idx = 0;
        idx = Math.max(0, idx);
        this.tabMenu.setSelectIdx(idx, true);
    }

    onTabMenuSelect(e, data) {
        if (!e) return;
        let panelId = viewList[this.panelIndex].panelId
        if (panelId) gdk.panel.hide(panelId);
        this.panelIndex = data;
        if (this.panelIndex >= 5) this.scrollView.scrollToLeft();
        if (this.panelIndex == 0) this.scrollView.scrollToRight();
        gdk.panel.open(viewList[this.panelIndex].panelId, null, null, {
            parent: this.panelParent
        });
    }

    _getIdxBySortId(id: number) {
        for (let i = 0; i < viewList.length; i++) {
            if (viewList[i].sortId == id) {
                return i;
            }
        }
    }

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        v = Math.max(0, v);
        this._leftTime = v;
        this.resetTimeLabel.string = gdk.i18n.t('i18n:ADVENTURE_TIP35') + TimerUtils.format3(v);
        if (v == 0) {
            //TODO
            ModelManager.get(RelicModel).isBuyPassPort = false;
            ModelManager.get(RelicModel).passPortFreeReward = [];
            ModelManager.get(RelicModel).passPortChargeReward = [];
            ModelManager.get(RoleModel).relic = 0;
            gdk.e.emit(RelicEventId.UPDATE_RELIC_PASS_PORT);
            gdk.gui.showMessage(gdk.i18n.t('i18n:MINECOPY_PASSPORT_TIP7'));
            this.close();
        }
    }

    dtime: number = 0;
    update(dt: number) {
        // if (this.progressContent.y == 0) this.onTaskScroll();
        if (!this.leftTime || this.leftTime <= 0) return;
        if (this.dtime >= 1) {
            this._initLeftTime()
            this.dtime = 0;
        }
        else {
            this.dtime += dt;
        }
    }

    _initLeftTime() {
        let period = ConfigManager.getItemByField(GlobalCfg, 'key', 'pass_cycle').value[0];
        let serverTime = GlobalUtil.getServerTime();
        let startTime = ActUtil.getActStartTime(85);
        let curPeriod = Math.floor((serverTime - startTime) / (period * 24 * 60 * 60 * 1000)) + 1;
        this.leftTime = this.leftTime = Math.floor((startTime + curPeriod * period * 24 * 60 * 60 * 1000 - serverTime) / 1000);;
    }

    _onPaySucc(data: gdk.Event) {
        if (data.data.paymentId == 700009) {
            GlobalUtil.setSpriteIcon(this.node, this.buyBtn.node, `view/relic/texture/tradingPort/txz_goumaitongxingzheng02`);
            this.buyBtn.interactable = false;
            this.buyBtn.node.getChildByName('spine').active = false;
        }
    }

    onBuyBtnClick() {
        if (ModelManager.get(RelicModel).isBuyPassPort) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ADVENTURE_TIP37'));
        }
        else {
            let period = ConfigManager.getItemByField(GlobalCfg, 'key', 'pass_cycle').value[0];
            let serverTime = GlobalUtil.getServerTime();
            let startTime = ActUtil.getActStartTime(85);
            let curPeriod = Math.floor((serverTime - startTime) / (period * 24 * 60 * 60 * 1000)) + 1;
            this.leftTime = Math.floor((startTime + curPeriod * period * 24 * 60 * 60 * 1000 - serverTime) / 1000);
            let cfgs = ConfigManager.getItemsByField(Relic_passCfg, 'cycle', curPeriod);
            if (!cfgs || cfgs.length <= 0) {
                let newCfgs = ConfigManager.getItems(Relic_passCfg);
                cfgs = ConfigManager.getItemsByField(Relic_passCfg, 'cycle', newCfgs[newCfgs.length - 1].cycle);
            }
            gdk.panel.setArgs(PanelId.RelicPassPortBuyView, cfgs);
            gdk.panel.open(PanelId.RelicPassPortBuyView);
        }
    }


    _updateRelicScore() {
        this.expLabel.string = `${ModelManager.get(RoleModel).relic}`;
    }

}