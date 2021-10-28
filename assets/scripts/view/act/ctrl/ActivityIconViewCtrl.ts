import ActivityIconItemCtrl from './ActivityIconItemCtrl';
import ActivityModel from '../model/ActivityModel';
import ActivityUtils from '../../../common/utils/ActivityUtils';
import ActUtil from '../util/ActUtil';
import ChampionModel from '../../champion/model/ChampionModel';
import ChatUtils from '../../chat/utils/ChatUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import FootHoldModel from '../../guild/ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuardianModel from '../../role/model/GuardianModel';
import GuideUtil from '../../../common/utils/GuideUtil';
import InstanceNetModel from '../../../common/models/InstanceNetModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import LimitGiftBtnCtrl from '../../store/ctrl/LimitGiftBtnCtrl';
import MainTaskProgressCtrl from '../../task/ctrl/MainTaskProgressCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../../adventure2/model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import RedPointCtrl from '../../../common/widgets/RedPointCtrl';
import ResonatingModel from '../../resonating/model/ResonatingModel';
import ResonatingUtils from '../../resonating/utils/ResonatingUtils';
import RoleModel from '../../../common/models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import ServerModel from '../../../common/models/ServerModel';
import SiegeModel from '../../guild/ctrl/siege/SiegeModel';
import SignModel from '../../sign/model/SignModel';
import StoreModel from '../../store/model/StoreModel';
import TaskModel from '../../task/model/TaskModel';
import TaskUtil from '../../task/util/TaskUtil';
import TimerUtils from '../../../common/utils/TimerUtils';
import WorldHonorModel from '../../../common/models/WorldHonorModel';
import {
    ActivityCfg,
    GlobalCfg,
    MainInterface_mainCfg,
    MainInterface_sort_1Cfg,
    MainInterface_sort_2Cfg,
    MainInterface_sortCfg,
    Mission_main_lineCfg,
    Platform_globalCfg,
    Siege_globalCfg,
    Store_pushCfg,
    Store_time_giftCfg
    } from '../../../a/config';
import { ActivityEventId } from '../enum/ActivityEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-10 14:39:24 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/ActivityIconViewCtrl")
export default class ActivityIconViewCtrl extends cc.Component {

    @property(cc.Node)
    iconContent: cc.Node = null;

    @property([cc.Node])
    storageActBtns: cc.Node[] = [];

    @property(cc.Node)
    monthCardBtn: cc.Node = null;

    @property(cc.Node)
    pushGiftBtn: cc.Node = null;

    @property(cc.Node)
    growTaskBtn: cc.Node = null;

    @property(cc.Node)
    weaponBtn: cc.Node = null;

    @property(cc.Node)
    limitGiftBtn: cc.Node = null;

    @property(cc.Node)
    siegeBtn: cc.Node = null;

    @property(cc.Node)
    crossRechargeBtn: cc.Node = null;

    @property(cc.Node)
    myGuardInviteIcon: cc.Node = null;

    @property(cc.Node)
    myGatherInviteIcon: cc.Node = null;

    @property(cc.Node)
    myCooperInviteIcon: cc.Node = null;// 协战邀请提示按钮

    @property(cc.Node)
    treasureBtn: cc.Node = null;

    @property(cc.Node)
    luckTwistBtn: cc.Node = null;

    @property(cc.Node)
    guardianCallRewardBtn: cc.Node = null;

    @property(cc.Node)
    combineBtn: cc.Node = null;

    @property(MainTaskProgressCtrl)
    mainTaskProgressBtn: MainTaskProgressCtrl = null;

    @property(cc.Node)
    sailingBtn: cc.Node = null;

    @property(cc.Node)
    hotelBtn: cc.Node = null;

    @property(cc.Node)
    CostumeCustomBtn: cc.Node = null;

    @property(cc.Node)
    limitActGiftBtn: cc.Node = null;

    @property(cc.Node)
    mysteryBtn: cc.Node = null;

    @property(cc.Node)
    shrinkBtn: cc.Node = null;

    @property(cc.Node)
    midAutumnBtn: cc.Node = null;

    @property(cc.Node)
    loginRewardBtn: cc.Node = null;

    @property(cc.Node)
    sevenDayWarBtn: cc.Node = null;

    @property(cc.Node)
    restrictionBtn: cc.Node = null;

    info: { node: cc.Node, cfg: MainInterface_mainCfg }[] = []; //所有图标
    _showStateDef: (gdk.PanelValue | Function)[] = []; // 需处理的窗口定义
    isShrink: boolean = false; //收缩状态
    unResidentIcon: cc.Node[] = [];  //非常驻图标
    unResidentIconId: number[] = [];  //非常驻图标Id
    showIconId: number[] = []; //显示的图标Id

    get roleModel() { return ModelManager.get(RoleModel); }
    get taskModel() { return ModelManager.get(TaskModel); }
    get instanceNetModel() { return ModelManager.get(InstanceNetModel); }
    get storeModel() { return ModelManager.get(StoreModel); }
    get signModel() { return ModelManager.get(SignModel); }
    get copyModel() { return ModelManager.get(CopyModel); }
    get activityModel() { return ModelManager.get(ActivityModel); }
    get championModel() { return ModelManager.get(ChampionModel); }
    get siegeModel() { return ModelManager.get(SiegeModel); }
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get resonatingModel(): ResonatingModel { return ModelManager.get(ResonatingModel); }
    get guardianModel(): GuardianModel { return ModelManager.get(GuardianModel); }

    onLoad() {
        this.info = [];
        let shrinkBtnRedPointCtrl = this.shrinkBtn.getComponent(RedPointCtrl);
        shrinkBtnRedPointCtrl.orIds = [];
        this.node.getChildByName('content').children.forEach(icon => {
            let ctrl = icon.getComponent(ActivityIconItemCtrl);
            if (ctrl) {
                let cfg = ConfigManager.getItemById(MainInterface_mainCfg, ctrl.id);
                if (cfg) {
                    this.info.push({ node: icon, cfg: cfg });
                    if ((!cfg.entrance || cfg.entrance.indexOf(0) !== -1) && parseInt(cfg.resident) !== 1) {
                        this.unResidentIcon.push(icon);
                        this.unResidentIconId.push(cfg.id);
                    }
                }
            }
        });
        this.node.getChildByName('content').getComponent(cc.Layout).updateLayout();
        this._showStateDef = [
            PanelId.MonthCard,
            PanelId.FirstPayGift,
            PanelId.SevenDays,
            PanelId.KfcbActNotice,
            PanelId.KfcbActView,
            PanelId.KfflActView,
            PanelId.LimitGiftView,
            PanelId.OneDollarGift,
            PanelId.GrowMenuView,
            PanelId.KfflAct2View
        ];
    }

    onEnable() {
        this._sortIcon();
        gdk.gui.onViewChanged.on(this._onViewChanged, this);
        gdk.gui.onPopupChanged.on(this._onPopupChanged, this);
        // this._shrinkIcon();
        this._extendIcon();
        this._updateLimitGiftBtn()
        this._guardianCallRewardBtnShowOrHide();
        this._addEventListener();
        // let flag = GlobalUtil.getLocal('generalWeaponIconAni', true);
        // if (!flag) {
        //     gdk.Timer.loop(1000, this, this.checkWeaponGuide);
        // }
        this.shrinkBtn.on(cc.Node.EventType.SIBLING_ORDER_CHANGED, this._fixSiblingOrder, this);
        cc.find('content', this.node).on(cc.Node.EventType.CHILD_ADDED, this._fixSiblingOrder, this);
        cc.find('content', this.node).on(cc.Node.EventType.CHILD_REMOVED, this._fixSiblingOrder, this);
    }

    onDisable() {
        gdk.gui.onViewChanged.off(this._onViewChanged, this);
        gdk.gui.onPopupChanged.off(this._onPopupChanged, this);
        this.mainTaskProgressBtn.stopAction()
        this._clearSiegeTime()
        gdk.e.targetOff(this);
        // gdk.Timer.clear(this, this.checkWeaponGuide);
        this.shrinkBtn.off(cc.Node.EventType.SIBLING_ORDER_CHANGED, this._fixSiblingOrder, this);
        cc.find('content', this.node).off(cc.Node.EventType.CHILD_ADDED, this._fixSiblingOrder, this);
        cc.find('content', this.node).off(cc.Node.EventType.CHILD_REMOVED, this._fixSiblingOrder, this);
        // cc.find('content', this.node).on(cc.Node.EventType.CHILD_ADDED, this._fixSiblingOrder, this);
    }

    onShrinkBtnClick() {
        if (this.isShrink) this._extendIcon();
        else this._shrinkIcon();
    }

    _addEventListener() {
        gdk.e.on(ActivityEventId.ACTIVITY_ICON_SHOW, this._activityIconShow, this);
        gdk.e.on(ActivityEventId.ACTIVITY_ICON_HIDE, this._activityIconHide, this);
    }

    _removeEventListener() {
        gdk.e.targetOff(this);
    }

    _activityIconShow(e: gdk.Event) {
        let cfg = ConfigManager.getItemById(MainInterface_mainCfg, e.data);
        if (cfg && cfg.entrance && cfg.entrance.indexOf(0) == -1) return;
        this.showIconId.push(e.data);
        this.showIconId = Array.from(new Set(this.showIconId));
        let idx = this.unResidentIconId.indexOf(e.data)
        if (idx != -1) {
            this.shrinkBtn.active = true;
            this.isShrink && this._shrinkIcon();
            let icon = this.unResidentIcon[idx];
            let ctrl = icon.getComponent(RedPointCtrl);
            if (ctrl) {
                this.shrinkBtn.getComponent(RedPointCtrl).orIds.push(...ctrl.orIds);
            }
        }
    }

    _activityIconHide(e: gdk.Event) {
        let cfg = ConfigManager.getItemById(MainInterface_mainCfg, e.data);
        if (cfg && cfg.entrance && cfg.entrance.indexOf(0) == -1) return;

        for (let i = 0; i < this.showIconId.length; i++) {
            if (this.showIconId[i] == e.data) {
                this.showIconId.splice(i, 1);
                break;
            }
        }

        let idx = this.unResidentIconId.indexOf(e.data);
        if (idx != -1) {
            let icon = this.unResidentIcon[idx];
            let ctrl = icon.getComponent(RedPointCtrl);
            if (ctrl) {
                let shrinkBtnCtrl = this.shrinkBtn.getComponent(RedPointCtrl);
                let orIds = [...ctrl.orIds];
                orIds.forEach(id => {
                    let idx = shrinkBtnCtrl.orIds.indexOf(id);
                    if (id != -1) shrinkBtnCtrl.orIds.splice(idx, 1);
                });
            }
            let b = false;
            for (let i = 0; i < this.showIconId.length; i++) {
                if (this.unResidentIconId.indexOf(this.showIconId[i]) != -1) {
                    b = true;
                    break;
                }
            }
            this.shrinkBtn.active = b;
        }
    }

    _fixSiblingOrder() {
        this.shrinkBtn.setSiblingIndex(cc.find('content', this.node).children.length + 1);
    }

    /**
     * 图标排序
     */
    _sortIcon() {
        this.info.sort((a, b) => {
            return a.cfg.sorting - b.cfg.sorting;
        });
        this.info.forEach((element, idx) => {
            let node: cc.Node = element.node;
            node.setSiblingIndex(idx + 1);
        });
        this.shrinkBtn.setSiblingIndex(cc.find('content', this.node).children.length + 1);
    }

    /**
     * 收缩icon
     * @param withAni 
     */
    _shrinkIcon(withAni: boolean = false) {
        let layout = this.node.getChildByName('content').getComponent(cc.Layout);
        layout.enabled = !withAni;
        if (!withAni) {
            this.unResidentIcon.forEach(icon => {
                if (icon.active && icon.width > 0 && icon.height > 0) {
                    let node: cc.Node = icon;
                    node.opacity = 0;
                    node.setScale(0);
                }
            });
            this.shrinkBtn.getChildByName('Background').angle = -90;
            layout.enabled = true;
            layout.updateLayout();
        }
        else {
            //TODO
        }
        this.shrinkBtn.getComponent(RedPointCtrl).enabled = true;
        this.isShrink = true;
    }

    /**
     * 展开icon
     * @param withAni 
     */
    _extendIcon(withAni: boolean = false) {
        let layout = this.node.getChildByName('content').getComponent(cc.Layout);
        layout.enabled = !withAni;
        if (!withAni) {
            this.unResidentIcon.forEach(icon => {
                if (icon.active && icon.width > 0 && icon.height > 0) {
                    let node: cc.Node = icon;
                    node.opacity = 255;
                    node.setScale(.8);
                }
            });
            this.shrinkBtn.getChildByName('Background').angle = 90;
            layout.enabled = true;
            layout.updateLayout();
        }
        else {
            //TODO
        }
        this.shrinkBtn.getComponent(RedPointCtrl).enabled = false;
        this.isShrink = false;
    }

    //------------------窗口变化--------------------//

    _onViewChanged(node: cc.Node) {
        if (!node) return;
        // 更新显示隐藏状态
        this._updatePanelShowHide(node);
    }

    _onPopupChanged(node: cc.Node) {
        if (!node) return;
        this._updatePanelShowHide(node);
        this.mainTaskProgressBtn.stopAction()
        this.updateProgress()
    }

    // 更新显示或隐藏状态
    _updatePanelShowHide(node: cc.Node) {
        let show = this._showStateDef.some((v) => {
            if (typeof v === 'function') {
                return v();
            } else {
                return gdk.panel.isOpenOrOpening(v as any);
            }
        });

        let contentNode = this.node;
        if (show) {
            contentNode && (contentNode.opacity = 0);
            ChatUtils.updateMiniChatPanel(false);
        }
        let onHide = gdk.NodeTool.onHide(node);
        onHide.on(() => {
            onHide.targetOff(this);
            show = this._showStateDef.some((v) => {
                if (typeof v === 'function') {
                    return v();
                } else {
                    return gdk.panel.isOpenOrOpening(v as any);
                }
            });
            if (!show) {
                contentNode && (contentNode.opacity = 255);
                ChatUtils.updateMiniChatPanel(true);
            }
        }, this);
    }

    //-----------------图标显示隐藏逻辑----------------//
    @gdk.binding('storeModel.limitGiftDatas')
    _updateLimitGiftBtn() {
        let ids = this.storeModel.limitGiftShowIds
        for (let i = 0; i < ids.length; i++) {
            let icon = this.iconContent.getChildByName(`limitGiftIcon${ids[i]}`)
            if (icon) {
                this.iconContent.removeChild(icon)
            }
        }
        this.storeModel.limitGiftShowIds = []
        let datas = this.storeModel.limitGiftDatas
        for (let i = 0; i < datas.length; i++) {
            if (this.storeModel.limitGiftShowIds.indexOf(datas[i].id) == -1) {
                let icon = cc.instantiate(this.limitGiftBtn)
                icon.active = true
                icon.name = `limitGiftIcon${datas[i].id}`
                let iconCtrl = icon.getComponent(LimitGiftBtnCtrl)
                iconCtrl.updateState(datas[i])
                // this.iconContent.addChild(icon)
                icon.parent = this.iconContent;
                this.storeModel.limitGiftShowIds.push(datas[i].id)
            }
        }
    }

    /** 显示或隐藏7天活动的图标*/
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _sevenDaysActivityIconShowOrHide() {
        if (JumpUtils.ifSysOpen(1800)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 3);
        }
    }

    /**贸易港按钮显示/隐藏 */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _tradingPortIconShowOrHide() {
        let cfgs = ConfigManager.getItems(MainInterface_sort_1Cfg);
        for (let i = 0; i < cfgs.length; i++) {
            if (!cfgs[i].hidden && (!cfgs[i].systemid || JumpUtils.ifSysOpen(cfgs[i].systemid))) {
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 7);
                return
            }
        }
    }

    onTradingPortBtnClick() {
        gdk.panel.open(PanelId.TradingPort);
    }

    private count: number = 0;
    /**特权卡界面 */
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateMonthCardPanel() {
        if (this.count == 0) {
            this.count += 1;
            return
        }
        if (gdk.panel.isOpenOrOpening(PanelId.MonthCard) || GuideUtil.getCurGuide()) return;
        if (!GlobalUtil.getLocal('isShowDiamondCard')) {
            let diamondCardCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'diamond_card');
            if (this.copyModel.lastCompleteStageId >= diamondCardCfg.value[1]) {
                gdk.panel.setArgs(PanelId.MonthCard, 0);
                gdk.panel.open(PanelId.MonthCard);
                GlobalUtil.setLocal('isShowDiamondCard', true);
                return;
            }
        }
        if (!GlobalUtil.getLocal('isShowSweepCard')) {
            let sweepCardCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'scouring_coupon_card');
            if (this.copyModel.lastCompleteStageId >= sweepCardCfg.value[1]) {
                gdk.panel.setArgs(PanelId.MonthCard, 1);
                gdk.panel.open(PanelId.MonthCard);
                GlobalUtil.setLocal('isShowSweepCard', true);
                return;
            }
        }
    }

    //--------精彩活动入口---------//
    onStorageActBtnClick(e, id) {
        let btn = this.storageActBtns[parseInt(id) - 1];
        let worldPos = btn.parent.convertToWorldSpaceAR(btn.getPosition());
        gdk.panel.setArgs(PanelId.StorageActView, [parseInt(id), worldPos])
        gdk.panel.open(PanelId.StorageActView);
    }

    //-----活动集合入口-----//
    @gdk.binding('roleModel.loginDays')
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _activityBtnShowOrHide() {

        let cfgs = ConfigManager.getItems(MainInterface_sortCfg);
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i]
            if (cfg.systemid == 2941) {
                //砍价大礼包
                let model = ModelManager.get(ActivityModel)
                if (JumpUtils.ifSysOpen(cfg.systemid) && model.discountData.length > 0 && !model.discountData[0].bought) {
                    // this.activityBtn.active = true;
                    gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 12);
                    return;
                }
            } else if (cfg.id == 22) {
                if (JumpUtils.ifSysOpen(2915)) {
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
                            // this.activityBtn.active = true;
                            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 12);
                            return;
                        }
                    }
                }
            }
            else if (cfg.whether == 1 && JumpUtils.ifSysOpen(cfg.systemid)) {
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 12);
                return;
            }
        }
        // this.activityBtn.active = false;
    }

    //-----合服活动集合入口-----//
    @gdk.binding('roleModel.loginDays')
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _combineBtnShowOrHide() {
        let cfgs = ConfigManager.getItems(MainInterface_sort_2Cfg);
        for (let i = 0; i < cfgs.length; i++) {
            if (JumpUtils.ifSysOpen(cfgs[i].systemid)) {
                this.combineBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 35);
                return;
            }
        }
        this.combineBtn.active = false;
    }

    onCombineBtnClick() {
        let isShow: boolean = false;
        let cfgs = ConfigManager.getItems(MainInterface_sort_2Cfg);
        for (let i = 0; i < cfgs.length; i++) {
            if (JumpUtils.ifSysOpen(cfgs[i].systemid)) {
                isShow = true;
                break;
            }
        }

        if (!isShow) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1"));
            this.combineBtn.active = false;
            return;
        }

        cfgs.sort((a, b) => { return a.sorting - b.sorting; });
        for (let i = 0; i < cfgs.length; i++) {
            if (JumpUtils.ifSysOpen(cfgs[i].systemid)) {
                JumpUtils.openCombineMain([cfgs[i].id]);
                return;
            }
        }
    }

    /**生存秘籍按钮显示/隐藏 */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _GrowTaskBtnIconShowOrHide() {
        if (JumpUtils.ifSysOpen(2818)) {
            this.growTaskBtn.active = true;
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 10);
        }
        else {
            this.growTaskBtn.active = false;
        }
    }

    /**福利界面 */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateMonthCardBtn() {
        this.monthCardBtn.active = false;
    }

    //-------------魔幻秘境-----------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateMagicBtnIconShowOrHide() {
        let sysIds = [2827];
        for (let i = 0; i < sysIds.length; i++) {
            if (JumpUtils.ifSysOpen(sysIds[i])) {
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 20);
                return;
            }
        }
    }

    //-------------登录有利-----------//
    onLoginRewardBtnClick() {
        JumpUtils.openLoginReward();
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateLoginRewardBtnIconShowOrHide() {
        let sysIds = [2810];
        for (let i = 0; i < sysIds.length; i++) {
            if (JumpUtils.ifSysOpen(sysIds[i])) {
                this.loginRewardBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 23);
                return;
            }
        }
        this.loginRewardBtn.active = false;
    }

    /*---------------神器图标 -----------------------*/
    onWeaponBtnClick() {
        JumpUtils.openGeneralWeaponView();
    }

    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('taskModel.weaponChapter')
    _updateWeaponBtnIconShowOrHide() {
        if (JumpUtils.ifSysOpen(2814)) {
            this.weaponBtn.active = true;
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 17);
            return;
        }
        this.weaponBtn.active = false;
    }

    // checkWeaponGuide() {
    //     let flag = GlobalUtil.getLocal('generalWeaponIconAni', true);
    //     if (flag) return;
    //     let cfg = GuideUtil.getCurGuide();
    //     if (cfg && cfg.id == 210025) {
    //         GlobalUtil.setLocal('generalWeaponIconAni', true, true);
    //         gdk.Timer.clear(this, this.checkWeaponGuide);
    //         this._onWeaponIconHide();
    //     }
    // }

    /**隐藏神器图标 打开主城神器升级精炼界面 */
    // _onWeaponIconHide() {
    //     let cb = () => {
    //         let panel = gdk.panel.get(PanelId.MainPanel);
    //         let endNode = cc.find('bg/btn15', panel);
    //         if (!endNode) return;//新主城暂不处理
    //         gdk.gui.lockScreen();
    //         let icon = cc.instantiate(this.weaponBtn);
    //         this.weaponBtn.active = false;
    //         let layer = gdk.gui.layers.popupLayer;
    //         let startP = layer.convertToNodeSpaceAR(this.weaponBtn.parent.convertToWorldSpaceAR(this.weaponBtn.getPosition()));
    //         icon.parent = layer;
    //         icon.active = true;
    //         icon.setPosition(startP);
    //         //end
    //         let endP = layer.convertToNodeSpaceAR(endNode.parent.convertToWorldSpaceAR(endNode.getPosition()));
    //         //move
    //         icon.runAction(cc.sequence(
    //             cc.moveTo(1, endP),
    //             cc.callFunc(() => {
    //                 icon.removeFromParent();
    //                 gdk.Timer.once(300, this, () => {
    //                     gdk.gui.unLockScreen();
    //                     GuideUtil.activeGuide('icon#generalWeapon#hide');
    //                     // JumpUtils.openSupportView([2]);
    //                 })
    //             })
    //         ));
    //     }
    //     if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel)) {
    //         gdk.panel.open(PanelId.MainPanel, cb);
    //     } else {
    //         cb();
    //     }
    // }

    /*---------------锦标赛图标 -----------------------*/
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('championModel.infoData')
    @gdk.binding('championModel.infoData.seasonId')
    _updateChampionBtnIconShowOrHide() {
        if (JumpUtils.ifSysOpen(2856)) {
            let model = this.championModel;
            if (model.infoData && model.infoData.seasonId) {
                // let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, model.infoData.seasonId);
                // if (cfg) {
                //     let o = cfg.open_time.split('/');
                //     let c = cfg.close_time.split('/');
                //     let ot = new Date(o[0] + '/' + o[1] + '/' + o[2] + ' ' + o[3] + ':' + o[4] + ':' + o[5]).getTime();
                //     let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
                //     let curTime = GlobalUtil.getServerTime();
                //     if (curTime >= ot && curTime <= ct + 24 * 60 * 60 * 1000 * 2) {
                //         this.championBtn.active = true;
                //         return;
                //     }
                // }
                if (ActUtil.ifActOpen(122)) {
                    // this.championBtn.active = true;
                    gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 21);
                    return;
                } else {
                    let curTime = GlobalUtil.getServerTime();
                    let roleModel = ModelManager.get(RoleModel);
                    let cfgs = ConfigManager.getItems(ActivityCfg, (cfg: ActivityCfg) => {
                        if (cfg.id == 122 && cfg.reward_type == model.infoData.seasonId && cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) >= 0) {
                            return true
                        } else if (cfg.id == 122 && cfg.reward_type == model.infoData.seasonId && cfg.type == 4) {
                            return true;
                        }
                    })
                    //加入平台判断
                    let tempCfgs = [];
                    cfgs.forEach(c => {
                        if (Array.isArray(c.platform_id) && c.platform_id.indexOf(iclib.SdkTool.tool.config.platform_id) !== -1) {
                            tempCfgs.push(c);
                        }
                    })
                    if (tempCfgs.length <= 0) {
                        cfgs.forEach(c => {
                            if (!c.platform_id) {
                                tempCfgs.push(c);
                            }
                        })
                    }
                    cfgs = tempCfgs;
                    if (cfgs.length > 0) {
                        for (let i = 0, n = cfgs.length; i < n; i++) {
                            let cfg = cfgs[i];
                            let endTime;
                            let openTime;
                            if (cfg.type == 3) {
                                // openTime = new Date(`${cfg.open_time[0]}/${cfg.open_time[1]}/${cfg.open_time[2]} ${cfg.open_time[3]}:${cfg.open_time[4]}`).getTime();
                                // endTime = new Date(`${cfg.close_time[0]}/${cfg.close_time[1]}/${cfg.close_time[2]} ${cfg.close_time[3]}:${cfg.close_time[4]}`).getTime();
                                openTime = TimerUtils.transformDate(cfg.open_time);
                                endTime = TimerUtils.transformDate(cfg.close_time);
                            } else if (cfg.type == 4) {
                                let time = roleModel.CrossOpenTime * 1000;
                                openTime = time + (cfg.open_time[2] * 24 * 60 * 60 + cfg.open_time[3] * 60 * 60 + cfg.open_time[4] * 60) * 1000;
                                endTime = time + (cfg.close_time[2] * 24 * 60 * 60 + cfg.close_time[3] * 60 * 60 + cfg.close_time[4] * 60) * 1000;
                            }
                            if (curTime >= openTime && curTime <= endTime + 24 * 60 * 60 * 1000 * 2) {
                                // this.championBtn.active = true;
                                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 21);
                                return;
                            }
                        }

                    }
                }
            }
        }
        // this.championBtn.active = false;
    }

    /*---------------冒险日记图标 -----------------------*/
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateDiaryBtnIconShowOrHide() {
        if (JumpUtils.ifSysOpen(2858)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 22);
        }
    }

    /*---------------跨服充值图标 -----------------------*/
    onCrossRechargeBtnClick() {
        if (!JumpUtils.ifSysOpen(2867)) {
            this.crossRechargeBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.CrossRechargeView);
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateCrossRechargeBtnIconShowOrHide(e) {
        this.crossRechargeBtn.active = JumpUtils.ifSysOpen(2867);
        if (this.crossRechargeBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 25);
        }
    }

    @gdk.binding('siegeModel.isActivityOpen')
    _updateSiegeBtn() {
        if (this.siegeModel.isActivityOpen && this.roleModel.guildId > 0) {
            this._createSiegeTime()
        } else {
            this.siegeBtn.active = false
        }
    }

    _createSiegeTime() {
        this._updateSiegeTime()
        this._clearSiegeTime()
        this.schedule(this._updateSiegeTime, 1)
    }

    _updateSiegeTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let curZero = TimerUtils.getZerohour(curTime)//当天0点
        let activity_time = ConfigManager.getItemById(Siege_globalCfg, "activity_time").value
        let siegeStartTime = activity_time[0] * 3600 //怪物开始出现
        let siegeEndTime = activity_time[1] * 3600  // 怪物到达门口(结算时间)
        if (curTime > curZero + siegeEndTime || curTime < curZero + siegeStartTime) {
            this.siegeBtn.active = false
        } else {
            this.siegeBtn.active = this.siegeModel.isActivityOpen && this.roleModel.guildId > 0
            if (this.siegeBtn.active) {
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 27);
            }
        }
    }

    _clearSiegeTime() {
        this.unschedule(this._updateSiegeTime)
    }

    //驻守邀请图标
    @gdk.binding("footHoldModel.myGuardInviteNum")
    updateMyGuardInviteIcon(num) {
        if (num > 0) {
            this.myGuardInviteIcon.active = true
            let numLab = cc.find("bg/msgNum", this.myGuardInviteIcon).getComponent(cc.Label)
            numLab.string = `${num}`
        } else {
            this.myGuardInviteIcon.active = false
        }
    }

    onOpenMyGuardListView() {
        gdk.panel.open(PanelId.FHMyGuardInviteList)
    }

    //集结邀请图标
    @gdk.binding("footHoldModel.myGatherInviteNum")
    updateMyGatherInviteIcon(num) {
        if (num > 0) {
            this.myGatherInviteIcon.active = true
            let numLab = cc.find("bg/msgNum", this.myGatherInviteIcon).getComponent(cc.Label)
            numLab.string = `${num}`
        } else {
            this.myGatherInviteIcon.active = false
        }
    }

    onOpenMyGatherListView() {
        gdk.panel.open(PanelId.FHMyGatherInviteList)
    }

    // 协战邀请按钮
    @gdk.binding("footHoldModel.cooperationInviteNum")
    updateMyCooperInviteIcon(num) {
        if (num > 0) {
            this.myCooperInviteIcon.active = true
            let numLab = cc.find("bg/msgNum", this.myCooperInviteIcon).getComponent(cc.Label)
            numLab.string = `${num}`
        } else {
            this.myCooperInviteIcon.active = false
        }
    }

    onOpenMyCooperInviteView() {
        gdk.panel.open(PanelId.FHCooperationInvite)
    }

    /*---------------跨服狂欢<跨服寻宝>图标 -----------------------*/
    onTreasureBtnClick() {
        if (!JumpUtils.ifSysOpen(2886)) {
            this.treasureBtn.active = false;
            return;
        }
        gdk.panel.setArgs(PanelId.CServerActivityMainView, 16);
        gdk.panel.open(PanelId.CServerActivityMainView);
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateTreasureBtnIconShowOrHide() {
        this.treasureBtn.active = JumpUtils.ifSysOpen(2886);
        if (this.treasureBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 31);
        }
    }


    /**------------------------------幸运扭蛋------------------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding("storeModel.starGiftDatas")
    _updateLuckTwistBtnShowOrHide() {
        this.luckTwistBtn.active = JumpUtils.ifSysOpen(2902);
        if (this.luckTwistBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 32);
        }
        // let actCfg = ActUtil.getCfgByActId(89);
        // if (!actCfg) {
        //     this.luckTwistBtn.active = false
        //     return
        // }
        // let rewardCfgs = ConfigManager.getItemsByField(Twist_eggCfg, "type", actCfg.reward_type)
        // if (ActivityUtils.getUseTwistEggTime() < rewardCfgs.length || ActivityUtils.getTwistEggPushGiftNum() > 0) {
        //     this.luckTwistBtn.active = true
        //     return
        // }

    }

    onLuckTwistBtnClick() {
        if (!JumpUtils.ifSysOpen(2902)) {
            this.luckTwistBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.LuckyTwistMain);
    }

    /*---------------星耀专属 -----------------------*/
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('resonatingModel.allianceMaxStar')
    _updateAssistGiftBtnIconShowOrHide() {
        if (JumpUtils.ifSysOpen(2903) && ResonatingUtils.isShowAssistGift()) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 33);
        }
    }

    /** 显示或隐藏守护者召唤有礼图标*/
    @gdk.binding('roleModel.level')
    @gdk.binding('guardianMdoel.callRewardInfo')
    _guardianCallRewardBtnShowOrHide() {
        this.guardianCallRewardBtn.active = JumpUtils.ifSysOpen(2908)
        if (this.guardianCallRewardBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 34);
        }
    }
    //打开守护者召唤有礼
    onOpenGuardianCallRewardView() {
        gdk.panel.open(PanelId.GuardianActivityMainView)
    }

    /**------------------------------幸运连连看------------------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding("storeModel.starGiftDatas")
    _updateLinkGameBtnShowOrHide() {
        if (JumpUtils.ifSysOpen(2910)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 36);
        }
    }

    /**------------------------------矿洞大冒险------------------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding("storeModel.starGiftDatas")
    _updateCaveBtnShowOrHide() {
        if (JumpUtils.ifSysOpen(2911)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 37);
        }
    }

    /**------------------自走棋----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updatePiecesBtnShowOrHide() {
        if (JumpUtils.ifSysOpen(2914)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 39);
        }
    }

    /**------------------英雄回退----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateHeroGoBackBtnShowOrHide() {
        if (JumpUtils.ifSysOpen(2918)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 40);
        }
    }

    /**------------------英雄重生----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateHeroRebirthBtnShowOrHide() {
        if (JumpUtils.ifSysOpen(2943)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 46);
        }
    }

    /**------------------远航寻宝----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateSailingBtnShowOrHide() {
        this.sailingBtn.active = JumpUtils.ifSysOpen(2944);
        if (this.sailingBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 47);
        }
    }

    onSailingBtnClick() {
        if (!JumpUtils.ifSysOpen(2944)) {
            this.sailingBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.SailingActivityMainView);
    }

    /**-----------------宝藏旅馆----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateHotelBtnShowOrHide() {
        this.hotelBtn.active = JumpUtils.ifSysOpen(2947);
        if (this.hotelBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 49);
        }
    }

    onHotelBtnClick() {
        if (!JumpUtils.ifSysOpen(2947)) {
            this.hotelBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.HotelTreasureView);
    }

    /**------------------专属英雄升星----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('activityModel.awakeStarUpGiftMap')
    _updateAwakeStarUpBtnShowOrHide() {
        let b = JumpUtils.ifSysOpen(2920) && !ActivityUtils.getAwakeStarUpFinish();
        if (b) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 41);
        }
    }

    /**------------------荣耀巅峰赛----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateArenaHonorBtnShowOrHide() {
        let time = this.roleModel.CrossOpenTime * 1000;
        //let nowTime = GlobalUtil.getServerTime();
        if (JumpUtils.ifSysOpen(2919)) {
            let temTime = ActUtil.getActStartTime(110);
            if (temTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                // this.arenaHonorBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 43);
            }
        }
    }


    /**------------------世界巅峰赛----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateWorldHonorBtnShowOrHide() {
        let time = this.roleModel.CrossOpenTime * 1000;
        //let nowTime = GlobalUtil.getServerTime();
        if (JumpUtils.ifSysOpen(2921)) {
            let temTime = ActUtil.getActStartTime(112);
            if (temTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                // this.worldHonorBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 43);
                let wModel = ModelManager.get(WorldHonorModel);
                if (wModel.list.length <= 0) {
                    let msg = new icmsg.ArenaHonorGroupReq()
                    msg.world = true;
                    NetManager.send(msg, (resp: icmsg.ArenaHonorGroupRsp) => {
                        if (!cc.isValid(this.node)) return;
                        if (!this.node.activeInHierarchy) return;
                        wModel.list = resp.list;
                        wModel.draw = resp.draw;
                    }, this);
                }
            }
        }
    }

    /**------------------灵力者集结----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateAssembleBtnShowOrHide() {
        if (JumpUtils.ifSysOpen(2937)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 45);
        }
    }

    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('taskModel.rewardIds')
    updateProgress() {
        let stageId = ConfigManager.getItemById(GlobalCfg, "main_reward_preview").value[0]
        if (stageId != 0 && this.copyModel.latelyStageId < stageId) {
            this.mainTaskProgressBtn.node.active = false;
            return
        }
        let cfgs = ConfigManager.getItems(Mission_main_lineCfg)
        for (let i = 0; i < cfgs.length; i++) {
            if (((cfgs[i].show && cfgs[i].show > 0) || (cfgs[i].show_hero && cfgs[i].show_hero > 0) || (cfgs[i].show_reward && cfgs[i].show_reward > 0))
                && !TaskUtil.getTaskAwardState(cfgs[i].id)) {
                this.mainTaskProgressBtn.node.active = true;
                this.mainTaskProgressBtn.updateProgress(cfgs[i]);
                return;
            }
        }
        this.mainTaskProgressBtn.node.active = false;
    }

    /**------------------武魂定制----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateWuhunBtnShowOrHide() {
        if (JumpUtils.ifSysOpen(2833)) {
            let temCfgs = ConfigManager.getItems(ActivityCfg, (item: ActivityCfg) => {
                if (item.id >= 24 && item.id <= 30) {
                    return true;
                }
            });
            //加入平台判断
            let tCfgs = [];
            temCfgs.forEach(c => {
                if (Array.isArray(c.platform_id) && c.platform_id.indexOf(iclib.SdkTool.tool.config.platform_id) !== -1) {
                    tCfgs.push(c);
                }
            })
            if (tCfgs.length <= 0) {
                temCfgs.forEach(c => {
                    if (!c.platform_id) {
                        tCfgs.push(c);
                    }
                })
            }
            temCfgs = tCfgs;
            for (let i = 0; i < temCfgs.length; i++) {
                if (ActUtil.ifActOpen(temCfgs[i].id)) {
                    gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 18);
                    return;
                }
            }
        }
    }

    /**------------------神装定制----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateCostumeCustomBtnShowOrHide() {
        this.CostumeCustomBtn.active = JumpUtils.ifSysOpen(2938);
        if (this.CostumeCustomBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 44);
        }
    }

    onCostumeCustomBtnClick() {
        if (!JumpUtils.ifSysOpen(2938)) {
            this.CostumeCustomBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.CostumeCustomMain);
    }

    /**限时礼包图标(战斗失败) */
    @gdk.binding('activityModel.LimitGiftDatas')
    _LimitActGiftBtnIconShowOrHide() {
        let datas = this.activityModel.LimitGiftDatas
        let newDatas: icmsg.ActivityTimeGift[] = [];
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        datas.forEach(element => {
            let cfg = ConfigManager.getItemByField(Store_time_giftCfg, "id", element.giftId)
            if (cfg && (element.state == 1 || (element.state == 0 && curTime < element.endTime))) {
                newDatas.push(element)
            }
        });
        this.limitActGiftBtn.active = newDatas.length > 0;
    }

    /**-----------------神秘者活动----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateMysteryBtnShowOrHide() {
        this.mysteryBtn.active = JumpUtils.ifSysOpen(2952);
        if (this.hotelBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 52);
        }
    }

    onMysteryBtnClick() {
        if (!JumpUtils.ifSysOpen(2952)) {
            this.hotelBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.MysteryVisitorActivityMainView);
    }


    /**------------------皇家竞技场----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateRoyalArenaBtnShowOrHide() {
        //let time = this.roleModel.CrossOpenTime * 1000;
        //let nowTime = GlobalUtil.getServerTime();
        if (JumpUtils.ifSysOpen(2954)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 53);
        }
    }


    /**限时升星礼包 */
    @gdk.binding("storeModel.starGiftDatas")
    updateStarGiftBtn() {
        let datas = this.storeModel.starGiftDatas
        let newDatas: icmsg.StorePushGift[] = []
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        datas.forEach(element => {
            let cfg = ConfigManager.getItemByField(Store_pushCfg, "gift_id", element.giftId)
            if (cfg && cfg.event_type == 1 && element.startTime + cfg.duration >= curTime) {
                newDatas.push(element)
            }
        });
        this.pushGiftBtn.active = newDatas.length > 0
    }

    /** 首充按钮显示或隐藏*/
    @gdk.binding("storeModel.firstPayTime")
    _firstPayGiftIconShowOrHide() {
        if (!SdkTool.tool.can_charge || this.storeModel._hasGetFirstPayReward()) {
            // 充值过而且已经领取了奖励，隐藏首充按钮
            // this.rechargeBtn.active = false;
        } else {
            // 显示首充按钮
            if (JumpUtils.ifSysOpen(1801, false)) {
                // this.rechargeBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 2);
            }
            else {
                // this.rechargeBtn.active = false;
            }
        }
    }

    //------每日充值------//
    onDailyRechargeBtnClick() {
        gdk.panel.open(PanelId.DailyFirstRecharge);
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('activityModel.dailyRechargeRewarded')
    @gdk.binding('storeModel.firstPayTime')
    _updateDailyRechargeBtnIconShowOrHide() {
        if (SdkTool.tool.can_charge) {
            if (!this.activityModel.dailyRechargeRewarded && this.activityModel.dailyRechargeProto) {
                if (this.storeModel.firstPayTime) {
                    let time = TimerUtils.getTomZerohour(this.storeModel.firstPayTime / 1000);
                    if (GlobalUtil.getServerTime() >= time * 1000) {
                        gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 16);
                        return
                    }
                }
                if (JumpUtils.ifSysOpen(2834)) {
                    gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 16);
                }
            }
        }
    }

    //-------------------八天登录------------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('actModel.kfLoginDaysReward')
    _updateKfLoginBtn() {
        if (JumpUtils.ifSysOpen(2878) && !ActivityUtils.getKfLoginRewardsFinish()) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 28);
        }
    }

    //--------------关注有礼--------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('activityModel.platformIconUpdateWatch')
    _updateWechatBtn1() {
        let typeId = 1;
        let sysId = 2934
        let cfgs = ActivityUtils.getPlatformConfigs(typeId);
        let ret = false;
        if (cfgs && cfgs.length) {
            cfgs.sort((a, b) => { return b.type - a.type; });
            cfgs.some(c => {
                if (JumpUtils.ifSysOpen(sysId)) {
                    if (typeId == 2 || ActivityUtils.getPlatformTaskStatue(c) != 1) {
                        // 邀请好友图标一直显示
                        ret = true;
                        return true;
                    }
                }
                return false;
            });
        }
        // this.node.active = ret;
        if (ret) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 69);
        }
    }

    //--------------添加小程序--------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('activityModel.platformIconUpdateWatch')
    _updateWechatBtn2() {
        let typeId = 3;
        let sysId = 2933
        let cfgs = ActivityUtils.getPlatformConfigs(typeId);
        let ret = false;
        if (cfgs && cfgs.length) {
            cfgs.sort((a, b) => { return b.type - a.type; });
            cfgs.some(c => {
                if (JumpUtils.ifSysOpen(sysId)) {
                    if (typeId == 2 || ActivityUtils.getPlatformTaskStatue(c) != 1) {
                        // 邀请好友图标一直显示
                        ret = true;
                        return true;
                    }
                }
                return false;
            });
        }
        // this.node.active = ret;
        if (ret) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 70);
        }
    }

    //--------------邀请有礼--------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('activityModel.platformIconUpdateWatch')
    _updateWechatBtn3() {
        let typeId = 2;
        let sysId = 2935
        let cfgs = ActivityUtils.getPlatformConfigs(typeId);
        let ret = false;
        if (cfgs && cfgs.length) {
            cfgs.sort((a, b) => { return b.type - a.type; });
            cfgs.some(c => {
                if (JumpUtils.ifSysOpen(sysId)) {
                    if (typeId == 2 || ActivityUtils.getPlatformTaskStatue(c) != 1) {
                        // 邀请好友图标一直显示
                        ret = true;
                        return true;
                    }
                }
                return false;
            });
        }
        // this.node.active = ret;
        if (ret) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 55);
        }
    }

    //--------------邀请有利--------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('activityModel.platformIconUpdateWatch')
    _updateWxExclusiveGiftBtn() {
        //cfgs
        let a = ActivityUtils.getPlatformConfigs(4);
        a = a.concat(ActivityUtils.getPlatformConfigs(5));

        let ret = JumpUtils.ifSysOpen(2936);
        if (ret) {
            let cfg = ConfigManager.getItemById(Platform_globalCfg, 'binghu_dbcz_time');
            let days = GlobalUtil.getCurDays() + 1;
            ret = days >= cfg.value[0] && days <= cfg.value[1];
            if (ret) {
                let cfgs = a;
                if (!cfgs || !cfgs.length) {
                    ret = false;
                } else {
                    ret = cfgs.some(c => {
                        if (ActivityUtils.getPlatformTaskStatue(c) != 1) {
                            return true;
                        }
                        return false;
                    });
                }
            }
        }
        if (ret) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 71);
        }
    }

    //-----------------------签到-------------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateSignBtnShowOrHide() {
        let b = JumpUtils.ifSysOpen(1200);
        if (b) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 54);
        }
    }

    //-----------------------中秋秘镜------------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateMidAutumnBtnShowOrHide() {
        this.midAutumnBtn.active = JumpUtils.ifSysOpen(2957);
        if (this.midAutumnBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 68);
        }
    }

    onMidAutumnBtnClick() {
        if (!JumpUtils.ifSysOpen(2957)) {
            this.midAutumnBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.MidAutumnActView);
    }

    //-----------------------七日之战------------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateSevenDayWarBtnShowOrHide() {
        this.sevenDayWarBtn.active = JumpUtils.ifSysOpen(2959);
        if (this.sevenDayWarBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 72);
        }
    }

    onSevenDayWarBtnClick() {
        if (!JumpUtils.ifSysOpen(2959)) {
            this.sevenDayWarBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.SevenDayWarActView);
    }

    //-----------------------限购商城------------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateRestrictionBtnShowOrHide() {
        this.restrictionBtn.active = JumpUtils.ifSysOpen(2907);
        if (this.restrictionBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 73);
        }
    }

    onRestrictionBtnClick() {
        if (!JumpUtils.ifSysOpen(2907)) {
            this.restrictionBtn.active = false;
            return;
        }
        JumpUtils.openCServerActivityMain([20]);
    }

    //-----------------------超值购------------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('activityModel.superValueInfo')
    _updateSuperValueBtnShowOrHide() {
        if (JumpUtils.ifSysOpen(2961) && !ActivityUtils.checkSuperValueVaild()) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 74);
        }
    }
}
