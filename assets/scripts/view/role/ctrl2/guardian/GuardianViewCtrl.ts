import GuardianModel from '../../model/GuardianModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointCtrl from '../../../../common/widgets/RedPointCtrl';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';



/** 
 * @Description: 英雄守护者界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-18 19:53:34
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianViewCtrl")
export default class GuardianViewCtrl extends gdk.BasePanel {

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

    onEnable() {
        this.scheduleOnce(this.checkArgs, 0);
    }
    onDisable() {
        gdk.Timer.clearAll(this);
        this.unschedule(this.checkArgs);
        // 关闭打开或打开中的子界面
        for (let i = 0, n = this._panelNames.length; i < n; i++) {
            let panelId = gdk.PanelId.getValue(this._panelNames[i]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
        this._onPanelShow = null;

        let guardianModel = ModelManager.get(GuardianModel)
        guardianModel.curHeroId = 0
        guardianModel.curGuardianId = 0
    }

    /**
     * 打开角色面板,额外参数可带一个次级面板数据,
     * 0:图鉴 1:召唤 2:装备 3:升级 
     */
    _onPanelShow: (node?: cc.Node) => void;   // 当子界面打开时回调
    checkArgs() {
        let args = gdk.panel.getArgs(PanelId.GuardianView)
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
            idx = 1;
            if (ModelManager.get(GuardianModel).guardianItems.length > 0) {
                idx = 3
            }
        }
        this.tabMenu.setSelectIdx(idx, true);
    }
    selectFunc(e: any, utype: any) {
        if (!e) return;
        utype = utype ? parseInt(utype) : 0;
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
