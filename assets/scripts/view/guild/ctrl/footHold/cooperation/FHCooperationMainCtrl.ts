import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel from '../FootHoldModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RedPointCtrl from '../../../../../common/widgets/RedPointCtrl';
import ServerModel from '../../../../../common/models/ServerModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import TimerUtils from '../../../../../common/utils/TimerUtils';
import UiTabMenuCtrl from '../../../../../common/widgets/UiTabMenuCtrl';
import { Foothold_globalCfg } from '../../../../../a/config';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-17 16:25:46
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationMainCtrl")
export default class FHCooperationMainCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLab: cc.Label = null;

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

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        this.scheduleOnce(this.checkArgs, 0);
        this._createEndTime()
    }
    onDisable() {
        gdk.Timer.clearAll(this);
        this.unschedule(this.checkArgs);
        this._clearEndTime()
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

    /**
     * 打开角色面板,额外参数可带一个次级面板数据,
     */
    _onPanelShow: (node?: cc.Node) => void;   // 当子界面打开时回调
    checkArgs() {
        let args = gdk.panel.getArgs(PanelId.FHCooperationMain)
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

    _createEndTime() {
        this._updateEndTime()
        this._clearEndTime()
        this.schedule(this._updateEndTime, 1)
    }

    _updateEndTime() {
        let cooperation_time = ConfigManager.getItemById(Foothold_globalCfg, "cooperation_time").value[0]
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        if (this.footHoldModel.coopStartTime == 0) {
            this._clearEndTime()
            this.timeLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP147")//"未开始"
            return
        }
        let leftTime = this.footHoldModel.coopStartTime + cooperation_time - curTime
        if (leftTime > 0) {
            this.timeLab.string = TimerUtils.format7(leftTime)
        } else {
            this._clearEndTime()
            this.timeLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP148")//"已结束"
        }
    }

    _clearEndTime() {
        this.unschedule(this._updateEndTime)
    }


}