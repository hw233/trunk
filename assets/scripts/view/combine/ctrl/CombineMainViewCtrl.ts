import CombinePageItemCtrl from './CombinePageItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import JumpUtils from '../../../common/utils/JumpUtils';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import UIScrollSelect from '../../lottery/ctrl/UIScrollSelect';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { MainInterface_sort_2Cfg } from '../../../a/config';


const { ccclass, property, menu } = cc._decorator;

/**sysId-panelId */
const activityPanelInfo: any = {
    2906: { panelId: PanelId.CombineCarnivalView, closeBtn: true, redPointCb: RedPointUtils.is_combine_carnival_reward, args: null },  //合服狂欢
    2905: { panelId: PanelId.CombineServerRankView, closeBtn: true, redPointCb: null, args: null },  //合服狂欢 服务器排名
}

@ccclass
@menu("qszc/view/combine/CombineMainViewCtrl")
export default class CombineMainViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    panelParent: cc.Node = null;

    @property(cc.Node)
    pageContent: cc.Node = null;

    @property(cc.Prefab)
    pagePrefab: cc.Prefab = null;

    actCfgs: MainInterface_sort_2Cfg[] = [];
    curCfg: MainInterface_sort_2Cfg;
    curIdx: number;
    pageIndex: number[] = [];
    onEnable() {
        this._initCfgs();
        this._preloadPanel();
        this._initPageItem();
        let arg = this.args;
        let idx;
        if (arg) {
            let id;
            if (arg instanceof Array) id = arg[0];
            else id = arg;
            if (id) {
                let toggleItems = this.pageContent.getComponent(cc.ToggleContainer).toggleItems;
                for (let i = 0; i < toggleItems.length; i++) {
                    if (toggleItems[i].node['cfg'].id == id) {
                        idx = parseInt(toggleItems[i].node.name.charAt(toggleItems[i].node.name.length - 1));
                        break;
                    }
                }
            }
        }
        if (!idx) idx = 0;
        let toggle = this.pageContent.getChildByName(`toggle${idx}`).getComponent(cc.Toggle);
        toggle && toggle.check();
        if (this.pageContent.children.length >= 3) {
            let ctrl = this.pageContent.getComponent(UIScrollSelect);
            ctrl.scrollTo(idx, false);
        }

        gdk.e.on(ActivityEventId.ACTIVITY_TIME_IS_OVER, this._onActivityTimeIsOver, this);
    }

    onDisable() {
        // 关闭打开或打开中的子界面
        for (let key in activityPanelInfo) {
            if (activityPanelInfo[key]) {
                gdk.panel.hide(activityPanelInfo[key].panelId);
            }
        }
        this.curCfg = null;
        this.curIdx = null;
        this.pageIndex = [];
        gdk.e.targetOff(this);
    }

    selectPageById(id: number) {
        let idx;
        let toggleItems = this.pageContent.getComponent(cc.ToggleContainer).toggleItems;
        for (let i = 0; i < toggleItems.length; i++) {
            if (toggleItems[i].node['cfg'].id == id) {
                idx = parseInt(toggleItems[i].node.name.charAt(toggleItems[i].node.name.length - 1));
                break;
            }
        }
        if (!idx) idx = 0;
        let toggle = this.pageContent.getChildByName(`toggle${idx}`).getComponent(cc.Toggle);
        toggle && toggle.check();
        if (this.pageContent.children.length >= 3) {
            let ctrl = this.pageContent.getComponent(UIScrollSelect);
            ctrl.scrollTo(idx, false);
        }
    }

    onArrowClcik(e, data) {
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        if (ctrl.isTestX) return;
        if (this.pageContent.children.length <= 1) return;
        if (this.pageContent.children.length >= 5) {
            data == 'left' ? ctrl.scrollToLeft() : ctrl.scrollToRight();
        }
        let nextIdx;
        let len = this.pageContent.children.length;
        if (data == 'left') {
            nextIdx = this.curIdx - 1 < 0 ? len - 1 : this.curIdx - 1;
        }
        else {
            nextIdx = this.curIdx + 1 > len - 1 ? 0 : this.curIdx + 1;
        }
        let toggle = this.pageContent.getChildByName(`toggle${nextIdx}`)
        toggle && toggle.active && toggle.getComponent(cc.Toggle).check();
    }

    /**页签点击 活动数量<5时 有效 */
    onToggleClick(toggle: cc.Toggle) {
        let containerName = toggle['_toggleContainer'].node.name;
        if (!containerName) return;
        let toggleName = toggle.node.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        this.curIdx = parseInt(idx);
        let cfg = toggle.node['cfg'];
        if (this.curCfg && this.curCfg.id == cfg.id) return;
        this._updatePanel(cfg);
    }

    /**页签滚动 活动数量>=5时 有效*/
    onUIScrollSelect(event: any) {
        let toggle = event.target;
        let index = event.index;
        if (!toggle.parent) return;
        let containerName = toggle.parent.name;
        if (containerName != 'pageContent') return;
        let toggleName = toggle.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        if (parseInt(idx) != index) {
            if (event.direction < 0) ctrl._toMoveX = -1;
            else ctrl._toMoveX = 1;
            ctrl.scrollTo(idx, true);
            toggle.getComponent(cc.Toggle).check();
        }
    }

    /**
     * 左右箭头红点
     */
    updateArrowRedPoint() {
        if (this.pageIndex.length < 5) return false;
        let idxs = [];
        let curIdx = this.curIdx;
        let nextIdx = this.curIdx + 1 > this.pageIndex.length - 1 ? 0 : this.curIdx + 1;
        let preIdx = this.curIdx - 1 < 0 ? this.pageIndex.length - 1 : this.curIdx - 1;
        idxs = [preIdx, curIdx, nextIdx];
        for (let i = 0; i < this.pageIndex.length; i++) {
            if (idxs.indexOf(this.pageIndex[i]) == -1) {
                let toggle = this.pageContent.getChildByName(`toggle${this.pageIndex[i]}`);
                if (toggle) {
                    let cfg: MainInterface_sort_2Cfg = toggle['cfg'];
                    if (!cfg) continue;
                    let redPointCb = activityPanelInfo[cfg.systemid]['redPointCb'];
                    let args = activityPanelInfo[cfg.systemid]['args'];
                    if (redPointCb && redPointCb instanceof Function) {
                        let b = args ? redPointCb(args) : redPointCb();
                        if (b) return true;
                    }
                }
            }
        }
        return false;
    }

    _initCfgs() {
        this.actCfgs = ConfigManager.getItems(MainInterface_sort_2Cfg, (cfg: MainInterface_sort_2Cfg) => {
            if (JumpUtils.ifSysOpen(cfg.systemid) && activityPanelInfo[cfg.systemid]) return true;
        });
        this.actCfgs.sort((a, b) => { return a.sorting - b.sorting; });
    }

    _preloadPanel() {
        this.actCfgs.forEach(cfg => {
            if (JumpUtils.ifSysOpen(cfg.systemid)) {
                let panelId: gdk.PanelValue = activityPanelInfo[cfg.systemid]['panelId'];
                panelId && gdk.panel.preload(panelId);
            }
        });
    }

    /**更新活动页签类型 */
    _initPageItem() {
        this.pageIndex = [];
        this.actCfgs.forEach((cfg, idx) => {
            let toggle = cc.instantiate(this.pagePrefab);
            toggle.parent = this.pageContent;
            let ctrl = toggle.getComponent(CombinePageItemCtrl);
            ctrl.updateView(cfg, activityPanelInfo[cfg.systemid]['redPointCb'], activityPanelInfo[cfg.systemid]['args']);
            toggle.name = `toggle${idx}`;
            toggle['cfg'] = cfg;
            this.pageIndex.push(idx);
        });
        let ctrl = this.pageContent.getComponent(UIScrollSelect);
        let layout = this.pageContent.getComponent(cc.Layout);
        ctrl.enabled = true;
        layout.enabled = false;
        this.pageContent.width = 599;
        if (this.pageContent.children.length < 5) {
            ctrl.enabled = false;
            layout.enabled = true;
            return;
        }
        ctrl.updateChilds();
    }

    /**更新活动界面 */
    _updatePanel(cfg: MainInterface_sort_2Cfg) {
        if (this.curCfg) {
            let info = activityPanelInfo[this.curCfg.systemid];
            let panelId = info ? info.panelId : null;
            panelId && gdk.panel.hide(panelId);
        }
        gdk.Timer.callLater(this, () => {
            this.curCfg = cfg;
            if (!JumpUtils.ifSysOpen(this.curCfg.systemid)) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1"));
                this.close();
                return;
            }
            let info = activityPanelInfo[this.curCfg.systemid];
            this.node.getChildByName('sub_guanbi').active = info.closeBtn;
            let panelId: gdk.PanelValue = info ? info.panelId : null;
            if (panelId) {
                panelId.isMask = false;
                panelId.isTouchMaskClose = false;
                gdk.panel.open(panelId, null, null, {
                    parent: this.panelParent
                });
            }
        });
    }

    /**活动过期 */
    _onActivityTimeIsOver() {
        gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1"));
        this.close();
    }
}
