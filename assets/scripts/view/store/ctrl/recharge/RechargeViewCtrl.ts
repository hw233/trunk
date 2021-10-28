import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { Store_giftCfg } from '../../../../a/config';
import { StoreEventId } from '../../enum/StoreEventId';

/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-22 11:22:14
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeViewCtrl")
export default class RechargeViewCtrl extends gdk.BasePanel {

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

    _defaultIndex = 3

    panelIndex: number = -1;    // 当前打开的界面索引
    onEnable() {
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
        let arg = this.args;
        let idx;
        if (arg) {
            if (arg instanceof Array) idx = arg[0];
            else idx = arg;
        }
        if (!idx && idx != 0) idx = this._defaultIndex;
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
        let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
        if (panelId) gdk.panel.hide(panelId);
        this.panelIndex = data;
        // let scrollView = this.uiTabMenu.node.parent.getComponent(cc.ScrollView);
        // if (this.panelIndex >= 4) {
        //     scrollView.scrollToLeft();
        // }
        // else if (this.panelIndex <= 0) {
        //     scrollView.scrollToRight();
        // }
        gdk.panel.open(this._panelNames[data], null, null, {
            parent: this.panelParent
        });
    }

    _onPaySucc(e: gdk.Event) {
        GlobalUtil.openRewadrView(e.data.list)
        let cfg = ConfigManager.getItemById(Store_giftCfg, e.data.paymentId);
        if (cfg && cfg.RMB_cost == 0) {
            return;
        }
        // else {
        //     gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP6'));
        // }
    }
}
