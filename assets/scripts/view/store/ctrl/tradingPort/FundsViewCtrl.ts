import { GrowthfundCfg, Growthfund_towerfundCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import StoreUtils from '../../../../common/utils/StoreUtils';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import TrialInfo from '../../../instance/trial/model/TrialInfo';
import { StoreEventId } from '../../enum/StoreEventId';
import StoreModel from '../../model/StoreModel';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-14 20:46:51
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/tradingPort/FundsViewCtrl")
export default class FundsViewCtrl extends gdk.BasePanel {

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property({ type: cc.String })
    _panelNames: string[] = [];

    @property({ type: gdk.PanelId, tooltip: "子界面，如果没可选值，请先配置gdk.PanelId" })
    get panels() {
        let ret = [];
        for (let i = 0; i < this._panelNames.length; i++) {
            ret[i] = gdk.PanelId[this._panelNames[i]] || 0;
        }
        return ret;
    }
    set panels(value) {
        this._panelNames = [];
        for (let i = 0; i < value.length; i++) {
            this._panelNames[i] = gdk.PanelId[value[i]];
        }
    }

    systemIds: number[] = [2958, 2808];
    panelIndex: number = -1;    // 当前打开的界面索引
    onEnable() {

        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);

        this.uiTabMenu.node.children.forEach((btn, idx) => {
            if (this.systemIds[idx]) {
                btn.active = JumpUtils.ifSysOpen(this.systemIds[idx]);
            }
        });
        let arg = this.args;
        let idx;
        if (arg) {
            if (arg instanceof Array) idx = arg[0];
            else idx = arg;
        }
        if (!idx) idx = 0;
        if (this.systemIds[idx] && !JumpUtils.ifSysOpen(this.systemIds[idx])) {
            idx += 1;
        }
        //试练塔基金领完消失
        let cfgs2 = ConfigManager.getItems(Growthfund_towerfundCfg);
        let rewardNum2 = 0
        for (let i = 0; i < cfgs2.length; i++) {
            if (ModelManager.get(TrialInfo).lastStageId >= cfgs2[i].layer && StoreUtils.getTowerFundsRewardState(cfgs2[i].id)) {
                rewardNum2++
            }
        }
        if (rewardNum2 == cfgs2.length) {
            this.uiTabMenu.node.children[0].active = false
            if (idx == 0) {
                idx = 1
            }
        }
        //成长基金领完消失
        let cfgs = ConfigManager.getItems(GrowthfundCfg);
        let rewardNum = 0
        for (let i = 0; i < cfgs.length; i++) {
            if (ModelManager.get(RoleModel).level >= cfgs[i].level && StoreUtils.getGrowthFundsRewardState(cfgs[i].id)) {
                rewardNum++
            }
        }
        if (rewardNum == cfgs.length) {
            this.uiTabMenu.node.children[1].active = false
            if (idx == 1) {
                idx = 2
            }
        }

        this.selectPanel(idx);
    }


    onDisable() {

        gdk.e.targetOff(this);
        // this.panelParent.removeAllChildren();
        // 关闭打开或打开中的子界面
        for (let i = 0, n = this._panelNames.length; i < n; i++) {
            let panelId = gdk.PanelId.getValue(this._panelNames[i]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
    }

    selectPanel(idx: number) {
        if (idx > this.uiTabMenu.itemNames.length - 1) idx = 0;
        idx = Math.max(0, idx);
        this.uiTabMenu.setSelectIdx(idx, true);
    }

    onTabMenuSelect(e, data) {
        if (!e) return;
        if (data == 1) ModelManager.get(StoreModel).isShowGrowFundsTips = false;
        if (data == 0) ModelManager.get(StoreModel).isShowTowerFundsTips = false;
        let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
        if (panelId) gdk.panel.hide(panelId);
        this.panelIndex = data;
        gdk.panel.open(this._panelNames[data], null, null, {
            parent: this.panelParent
        });
    }

    _onPaySucc(e: gdk.Event) {
        if (e.data.paymentId == 700006 || e.data.paymentId == 700007) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP6'));
            GlobalUtil.openRewadrView(e.data.list)
        }
    }
}
