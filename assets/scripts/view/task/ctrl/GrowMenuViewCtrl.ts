import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-19 10:57:31 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/GrowMenuViewCtrl")
export default class GrowMenuViewCtrl extends gdk.BasePanel {
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

        // this.uiTabMenu.node.children[1].active = JumpUtils.ifSysOpen(2814);
        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }

    onDisable() {
        // this.panelParent.removeAllChildren();
        // 关闭打开或打开中的子界面
        for (let i = 0, n = this._panelNames.length; i < n; i++) {
            let panelId = gdk.PanelId.getValue(this._panelNames[i]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
        this.node.stopAllActions();
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
        gdk.panel.open(this._panelNames[data], null, null, {
            parent: this.panelParent
        });
    }
}

