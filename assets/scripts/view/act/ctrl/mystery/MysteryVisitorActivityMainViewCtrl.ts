import { MainInterface_sortCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import ModelManager from "../../../../common/managers/ModelManager";
import JumpUtils from "../../../../common/utils/JumpUtils";
import RedPointUtils from "../../../../common/utils/RedPointUtils";
import PanelId from "../../../../configs/ids/PanelId";
import UIScrollSelect from "../../../lottery/ctrl/UIScrollSelect";
import StoreModel from "../../../store/model/StoreModel";
import { ActivityEventId } from "../../enum/ActivityEventId";
import ActivityPageItemCtrl from "../ActivityPageItemCtrl";


/**
 * 神秘来客
 * @Author: yaozu.hu
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-29 10:30:22
 */
const { ccclass, property, menu } = cc._decorator;

/**sysId-panelId */
const MysteryVisitorActivityPanelInfo: any = {
    2951: { panelId: PanelId.MysteryVisitorView1, closeBtn: true, redPointCb: RedPointUtils.is_mysteryVisitor_view1_reward, args: null },  //神秘来客
    2953: { panelId: PanelId.MysteryVisitorView2, closeBtn: true, redPointCb: RedPointUtils.is_mysteryVisitor_view2_reward, args: null },  //修炼之路
    2952: { panelId: PanelId.MysteryView, closeBtn: true, redPointCb: RedPointUtils.is_mystery_view_reward, args: null },  //修炼之路
}


@ccclass
@menu("qszc/view/act/mysteryVisitor/MysteryVisitorActivityMainViewCtrl")
export default class MysteryVisitorActivityMainViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property(cc.Node)
    pageContent: cc.Node = null;

    @property(cc.Prefab)
    pagePrefab: cc.Prefab = null;

    actCfgs: MainInterface_sortCfg[] = [];
    curCfg: MainInterface_sortCfg;
    curIdx: number;
    pageIndex: number[] = [];

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

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

        gdk.e.on(ActivityEventId.ACTIVITY_MYSTERY_HERO, this._onShowMysterVisitorView1, this);
        // gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
    }

    onDisable() {
        // 关闭打开或打开中的子界面
        for (let key in MysteryVisitorActivityPanelInfo) {
            if (MysteryVisitorActivityPanelInfo[key]) {
                gdk.panel.hide(MysteryVisitorActivityPanelInfo[key].panelId);
            }
        }
        this.curCfg = null;
        this.curIdx = null;
        this.pageIndex = [];
        gdk.e.targetOff(this);
    }

    _onShowMysterVisitorView1() {
        let idx = 1;
        let toggle = this.pageContent.getChildByName(`toggle${idx}`).getComponent(cc.Toggle);
        toggle && toggle.check();
        if (this.pageContent.children.length >= 3) {
            let ctrl = this.pageContent.getComponent(UIScrollSelect);
            ctrl.scrollTo(idx, false);
        }
    }
    // _onPaySucc(e: gdk.Event) {
    //     let data = <icmsg.PaySuccRsp>e.data;
    //     let cfg = ConfigManager.getItemByField(Store_pushCfg, 'gift_id', data.paymentId);
    //     if (cfg && cfg.event_type == 7) {
    //         GlobalUtil.openRewadrView(data.list);
    //     }
    // }

    // @gdk.binding('storeModel.starGiftDatas')
    // _updateBtns() {
    //     this._initCfgs();
    //     this._preloadPanel();
    //     this._initPageItem();
    //     let idx = 0;
    //     let toggle = this.pageContent.getChildByName(`toggle${idx}`).getComponent(cc.Toggle);
    //     toggle && toggle.check();
    //     if (this.pageContent.children.length >= 3) {
    //         let ctrl = this.pageContent.getComponent(UIScrollSelect);
    //         ctrl.scrollTo(idx, false);
    //     }
    // }

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
                    let cfg: MainInterface_sortCfg = toggle['cfg'];
                    if (!cfg) continue;
                    let redPointCb = MysteryVisitorActivityPanelInfo[cfg.systemid]['redPointCb'];
                    let args = MysteryVisitorActivityPanelInfo[cfg.systemid]['args'];
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
        this.actCfgs = ConfigManager.getItems(MainInterface_sortCfg, (cfg: MainInterface_sortCfg) => {
            if (MysteryVisitorActivityPanelInfo[cfg.systemid] && JumpUtils.ifSysOpen(cfg.systemid)) {
                return true;
            }
        });
        this.actCfgs.sort((a, b) => { return a.sorting - b.sorting; });
    }

    _preloadPanel() {
        this.actCfgs.forEach(cfg => {
            if (JumpUtils.ifSysOpen(cfg.systemid)) {
                let panelId: gdk.PanelValue = MysteryVisitorActivityPanelInfo[cfg.systemid]['panelId'];
                panelId && gdk.panel.preload(panelId);
            }
        });
    }

    /**更新活动页签类型 */
    _initPageItem() {
        this.pageContent.removeAllChildren()
        this.pageIndex = [];
        this.actCfgs.forEach((cfg, idx) => {
            let toggle = cc.instantiate(this.pagePrefab);
            toggle.parent = this.pageContent;
            let ctrl = toggle.getComponent(ActivityPageItemCtrl);
            ctrl.updateView(cfg, MysteryVisitorActivityPanelInfo[cfg.systemid]['redPointCb'], MysteryVisitorActivityPanelInfo[cfg.systemid]['args']);
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
    _updatePanel(cfg: MainInterface_sortCfg) {
        if (this.curCfg) {
            let info = MysteryVisitorActivityPanelInfo[this.curCfg.systemid];
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
            let info = MysteryVisitorActivityPanelInfo[this.curCfg.systemid];
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
