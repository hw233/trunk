import HeroModel from '../../../../common/models/HeroModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RedPointCtrl from '../../../../common/widgets/RedPointCtrl';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';


/**
 * 英雄详情界面
 * @Author: sthoo.huang
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-25 17:29:34
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/EquipViewCtrl2")
export default class EquipViewCtrl2 extends gdk.BasePanel {

    @property(UiTabMenuCtrl)
    tabMenu: UiTabMenuCtrl = null;

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
    get model() {
        return ModelManager.get(HeroModel);
    }

    onEnable() {
        // this._initPanels()
        this.scheduleOnce(this.checkArgs, 0);
    }

    onDisable() {
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
        // 保存当前的panelIndex
        let config = this.config;
        if (config.hideMode == gdk.HideMode.DISABLE ||
            config.tempHidemode == gdk.HideMode.DISABLE) {
            // 隐藏模式为disable时，则保存当前子界面的打开索引参数
            gdk.panel.setArgs(this.resId, this.panelIndex);
        }
        // 关闭打开或打开中的子界面
        for (let i = 0, n = this._panelNames.length; i < n; i++) {
            let panelId = gdk.PanelId.getValue(this._panelNames[i]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
        this._onPanelShow = null;
    }


    _initPanels() {
        let showPanels = [`EquipMergePanel`, `RuneMainPanel`, `CostumeStrengthenPanel`, `HeroComposeView`]
        let btns = [``, ``, ``, ``]
        this._panelNames = showPanels
        this.tabMenu.itemNames = btns
    }

    /**
     * 打开角色面板,额外参数可带一个次级面板数据,
     * 0:强化界面 1:突破界面 2:镶嵌界面 3:附魔界面 4:融合界面 5.符文合成
     */
    _onPanelShow: (node?: cc.Node) => void;   // 当子界面打开时回调
    checkArgs() {
        let args = this.args;
        let idx = 0;
        if (args && args.length > 0) {
            // 有外部参数
            if (args[0] instanceof Array) {
                args = args[0];
            }
            // 更新当前选中的下层子界面索引
            idx = args[0];
        } else {
            // 没有参数时
            idx = 0;
        }
        this.tabMenu.setSelectIdx(idx, true);
    }

    /**面板选择显示 */
    selectFunc(e: any, utype: any) {
        if (!e) return;
        utype = utype ? parseInt(utype) : 0;
        utype < 0 && (utype = 0);
        utype > 4 && (utype = 4);

        if (utype > 0) {
            if (utype == 1) {
                if (!JumpUtils.ifSysOpen(2855, true)) {
                    this.tabMenu.showSelect(0);
                    return;
                }
            }

            if (utype == 2) {
                if (!JumpUtils.ifSysOpen(2865, true)) {
                    let index = this.panelIndex
                    if (index < 0) {
                        index = 0
                    }
                    this.tabMenu.showSelect(index);
                    return;
                }
            }

            if (utype == 3) {
                if (!JumpUtils.ifSysOpen(2897, true)) {
                    let index = this.panelIndex
                    if (index < 0) {
                        index = 0
                    }
                    this.tabMenu.showSelect(index);
                    return;
                }
            }
        }

        if (this.panelIndex > -1) {
            let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
            this.panelIndex = -1;
        }
        // 打开新的子界面
        let panelId = gdk.PanelId.getValue(this._panelNames[utype]);
        if (panelId) {
            gdk.panel.open(
                panelId,
                this._onPanelShow,
                this,
                {
                    parent: this.panelParent
                },
            );
        }
        this.panelIndex = utype;
        this._updateSelectBtns();
    }

    /**更新按钮红点状态 */
    _updateSelectBtns() {
        gdk.Timer.once(100, this, this._updateSelectBtnsLater);
    }
    _updateSelectBtnsLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabledInHierarchy) return;
        let toggleItems = this.tabMenu.node.children;
        for (let i = 0, n = toggleItems.length; i < n; i++) {
            let toggle = toggleItems[i];
            let ctrl = toggle.getComponent(RedPointCtrl);
            if (ctrl) {
                ctrl.isShow = this.toggleRedPointHandle(i);
            }
        }
    }

    // tab按钮的额外红点逻辑
    toggleRedPointHandle(index: string | number) {
        let panelId = gdk.PanelId.getValue(this._panelNames[index]);
        if (panelId) {
            return !gdk.panel.isOpenOrOpening(panelId);
        }
        return false;
    }
}
