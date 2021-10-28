import ActivityModel from '../model/ActivityModel';
import ActivityPageItemCtrl from './ActivityPageItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../../adventure2/model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import UIScrollSelect from '../../lottery/ctrl/UIScrollSelect';
import { ActivityEventId } from '../enum/ActivityEventId';
import { MainInterface_sortCfg, Store_pushCfg } from '../../../a/config';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

/**sysId-panelId */
const activityPanelInfo: {
    [id: number]: {
        panelId: gdk.PanelValue,
        closeBtn: boolean,
        redPointCb: Function,
        args: any,
    }
} = {
    2809: { panelId: PanelId.LcdlView, closeBtn: true, redPointCb: RedPointUtils.has_lcdl_reward, args: null },    //累计充值
    2812: { panelId: PanelId.TwistedEggView, closeBtn: false, redPointCb: RedPointUtils.has_twist_egg_free_time, args: null }, //幸运扭蛋
    2811: { panelId: PanelId.FlipCardsView, closeBtn: true, redPointCb: RedPointUtils.has_flip_card_reward, args: null },  //累计幸运翻牌
    2840: { panelId: PanelId.SubEggStoreView, closeBtn: true, redPointCb: null, args: null },  //扭蛋商店
    2841: { panelId: PanelId.SubGiftStoreView, closeBtn: true, redPointCb: null, args: null },  //礼券商店
    2839: { panelId: PanelId.HeroTrialActionView, closeBtn: true, redPointCb: RedPointUtils.is_HeroTrialCopy_show_redPoint, args: null },  //英雄试炼
    2842: { panelId: PanelId.StarGiftsView, closeBtn: false, redPointCb: RedPointUtils.has_reward_exciting_act, args: 2842 },  //升星有礼
    2847: { panelId: PanelId.AdventureAccessView, closeBtn: true, redPointCb: null, args: null },  //奇境探险入口
    2848: { panelId: PanelId.SubAdvStoreView, closeBtn: true, redPointCb: RedPointUtils.has_advStore_free_items, args: null },  //奇境探险商店
    2850: { panelId: PanelId.AdvCatcherView, closeBtn: true, redPointCb: RedPointUtils.has_catcher_draw_times, args: null },  //娃娃机
    2874: { panelId: PanelId.NewLcdlView, closeBtn: true, redPointCb: RedPointUtils.has_new_lcdl_reward, args: null },    //新累计充值
    2876: { panelId: PanelId.NewHeroTrialActionView, closeBtn: true, redPointCb: RedPointUtils.is_NewHeroTrialCopy_show_redPoint, args: null },  //新英雄试炼
    2915: { panelId: PanelId.NewAdventureAccessView, closeBtn: true, redPointCb: null, args: null },  //新奇境探险入口
    2917: { panelId: PanelId.AdventureGiftView2, closeBtn: true, redPointCb: null, args: null },  //新奇境探险礼包入口
    2941: { panelId: PanelId.DiscountView, closeBtn: true, redPointCb: RedPointUtils.has_Discount_reward, args: null }, //砍价大礼包
};

@ccclass
@menu("qszc/view/act/ActivityMainViewCtrl")
export default class ActivityMainViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    panelParent: cc.Node = null;

    @property(cc.Node)
    pageContent: cc.Node = null;

    @property(cc.Prefab)
    pagePrefab: cc.Prefab = null;

    _actCfgs: MainInterface_sortCfg[] = [];
    curCfg: MainInterface_sortCfg;
    curIdx: number;
    pageIndex: number[] = [];

    onEnable() {
        let arg = this.args;
        let id = 0;
        let idx = 0;
        if (arg) {
            if (arg instanceof Array) {
                id = arg[0];
            } else {
                id = arg;
            }
        }
        this._initPageItem();
        if (id) {
            let toggleItems = this.pageContent.getComponent(cc.ToggleContainer).toggleItems;
            for (let i = 0; i < toggleItems.length; i++) {
                if (toggleItems[i].node['cfg'].id == id) {
                    idx = parseInt(toggleItems[i].node.name.charAt(toggleItems[i].node.name.length - 1));
                    break;
                }
            }
        }
        if (!idx) {
            idx = 0;
        }
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
        this._actCfgs = [];
        this.curCfg = null;
        this.curIdx = null;
        this.pageIndex = [];
        gdk.e.targetOff(this);
    }

    selectPageById(id: number) {
        let idx = 0;
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

    get actCfgs() {
        if (CC_EDITOR) return this._actCfgs;
        if (!this._actCfgs || !this._actCfgs.length) {
            this._actCfgs = ConfigManager.getItems(MainInterface_sortCfg, (cfg: MainInterface_sortCfg) => {
                if (cfg.systemid == 2941) {
                    //砍价大礼包
                    let model = ModelManager.get(ActivityModel)
                    if (JumpUtils.ifSysOpen(cfg.systemid) && model.discountData.length > 0 && !model.discountData[0].bought) {
                        return true
                    }
                } else if (cfg.id == 22) {
                    if (JumpUtils.ifSysOpen(2915)) {
                        // let type = NewAdventureUtils.actRewardType
                        let curTime = GlobalUtil.getServerTime() / 1000
                        let adModel = ModelManager.get(NewAdventureModel)
                        if (adModel.GiftTime.length > 0) {
                            let have = false;
                            for (let i = 0, n = adModel.GiftTime.length; i < n; i++) {
                                let startTime = adModel.GiftTime[i].startTime
                                if (startTime > 0) {
                                    let temCfg2 = ConfigManager.getItemByField(Store_pushCfg, "gift_id", adModel.GiftTime[i].giftId);
                                    if (startTime + temCfg2.duration > curTime) {
                                        have = true;
                                        break
                                    }
                                }
                            }
                            if (have) {
                                return true
                            }
                        }
                    }
                }
                else if (JumpUtils.ifSysOpen(cfg.systemid)) {
                    return activityPanelInfo[cfg.systemid] && JumpUtils.ifSysOpen(cfg.systemid);
                }
            });
            this._actCfgs.sort((a, b) => { return a.sorting - b.sorting; });
        }
        return this._actCfgs;
    }

    // 预加载界面列表
    get preloads() {
        let a: gdk.PanelValue[] = [];
        this.actCfgs.forEach(cfg => {
            if (JumpUtils.ifSysOpen(cfg.systemid)) {
                let panelId = activityPanelInfo[cfg.systemid]['panelId'];
                if (panelId) {
                    a.push(panelId);
                }
            }
        });
        if (a.length > 0) {
            gdk.panel.preload(a[0]);
            a.splice(0, 1);
        }
        return a;
    }

    /**更新活动页签类型 */
    _initPageItem() {
        this.pageIndex = [];
        this.actCfgs.forEach((cfg, idx) => {
            let toggle = cc.instantiate(this.pagePrefab);
            toggle.parent = this.pageContent;
            let ctrl = toggle.getComponent(ActivityPageItemCtrl);
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
    _updatePanel(cfg: MainInterface_sortCfg) {
        // 关闭当前活动界面
        if (this.curCfg) {
            let info = activityPanelInfo[this.curCfg.systemid];
            if (info && info.panelId) {
                gdk.panel.hide(info.panelId);
            }
            this.curCfg = null;
        }
        // 打开新的活动界面
        if (!JumpUtils.ifSysOpen(cfg.systemid)) {
            this._onActivityTimeIsOver();
            return;
        }
        let info = activityPanelInfo[cfg.systemid];
        let panelId = info ? info.panelId : null;
        if (panelId) {
            panelId.isMask = false;
            panelId.isTouchMaskClose = false;
            gdk.panel.open(panelId, null, null, {
                parent: this.panelParent
            });
        }
        this.curCfg = cfg;
        this.node.getChildByName('sub_guanbi').active = info.closeBtn;
    }

    /**活动过期 */
    _onActivityTimeIsOver() {
        gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1"));
        this.close();
    }
}
