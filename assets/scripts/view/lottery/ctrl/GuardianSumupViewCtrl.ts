import JumpUtils from '../../../common/utils/JumpUtils';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { LotteryEventId } from '../enum/LotteryEventId';


/**
 * 守护者综合界面
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-29 19:43:48
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-14 15:27:01
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/GuardianSumupViewCtrl")
export default class GuardianSumupViewCtrl extends gdk.BasePanel {

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

    panelIndex: number = -1;    // 当前打开的界面索引

    onEnable() {
        let arg = this.args;
        let idx;
        if (arg) {
            if (arg instanceof Array) idx = arg[0];
            else idx = arg;
        }
        if (!idx) idx = 0;


        this.selectPanel(idx);
    }

    onDisable() {
        //NetManager.targetOff(this);
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
        if (data == 0) {
            if (!JumpUtils.ifSysOpen(2897, true)) {
                this.uiTabMenu.showSelect(data);
                return;
            }
        } else if (data == 1) {
            if (!JumpUtils.ifSysOpen(2904, true)) {
                this.uiTabMenu.showSelect(data);
                return;
            }
        }
        let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
        if (panelId) gdk.panel.hide(panelId);
        this.panelIndex = data;

        gdk.panel.open(this._panelNames[data], null, null, {
            parent: this.panelParent
        });

        gdk.e.emit(LotteryEventId.HERO_RESET_TYPE_CHANGE, [1, data])
    }
}
