import JumpUtils from "../../../common/utils/JumpUtils";
import UiTabMenuCtrl from "../../../common/widgets/UiTabMenuCtrl";
import { LotteryEventId } from "../enum/LotteryEventId";



/**
 * 英雄综合界面
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-29 19:43:48
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-14 15:27:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroSumupViewCtrl")
export default class HeroSumupViewCtrl extends gdk.BasePanel {

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

        //英雄回退特殊处理
        if (JumpUtils.ifSysOpen(2918)) {
            this.uiTabMenu.node.children[3].active = true;
        } else {
            this.uiTabMenu.node.children[3].active = false;
        }
        //英雄回退特殊处理
        if (JumpUtils.ifSysOpen(2943)) {
            this.uiTabMenu.node.children[4].active = true;
        } else {
            this.uiTabMenu.node.children[4].active = false;
        }

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
        if (data == 2) {
            if (!JumpUtils.ifSysOpen(2864, true)) {
                this.uiTabMenu.showSelect(this.panelIndex);
                return;
            }
        } else if (data == 3) {
            if (!JumpUtils.ifSysOpen(2918, true)) {
                this.uiTabMenu.showSelect(this.panelIndex);
                return;
            }
        }
        let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
        if (panelId) gdk.panel.hide(panelId);
        this.panelIndex = data;

        gdk.panel.open(this._panelNames[data], null, null, {
            parent: this.panelParent
        });
        gdk.e.emit(LotteryEventId.HERO_RESET_TYPE_CHANGE, [4, data])
    }
}
