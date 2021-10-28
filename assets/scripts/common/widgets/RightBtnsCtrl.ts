import PanelId from '../../configs/ids/PanelId';
import SdkTool from '../../sdk/SdkTool';
import ActivityModel from '../../view/act/model/ActivityModel';
import ActUtil from '../../view/act/util/ActUtil';
import ChatModel from '../../view/chat/model/ChatModel';
import StoreModel from '../../view/store/model/StoreModel';
import ModelManager from '../managers/ModelManager';
import ActivityUtils from '../utils/ActivityUtils';
import GlobalUtil from '../utils/GlobalUtil';
import JumpUtils from '../utils/JumpUtils';
import RedPointCtrl from './RedPointCtrl';

/**
 * 主界面右侧图标按钮列表
 * @Author: sthoo.huang
 * @Date: 2020-12-15 20:01:59
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 11:38:43
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/RightBtnsCtrl")
export default class RightBtnsCtrl extends cc.Component {

    @property(cc.Node)
    kfBtn: cc.Node = null

    @property(cc.Node)
    gotoH5Btn: cc.Node = null

    @property(cc.Node)
    bbsBtn: cc.Node = null

    @property(cc.Node)
    superVipBtn: cc.Node = null;

    @property(cc.Node)
    mlSuperVipBtn: cc.Node = null;

    @property(cc.Node)
    mlSuperVipBtn2: cc.Node = null;
    @property(cc.Node)
    mlSuperVipBtn3: cc.Node = null;
    @property(cc.Node)
    mlSuperVipBtn4: cc.Node = null;
    @property(cc.Node)
    mlSuperVipBtn5: cc.Node = null;

    @property(cc.Node)
    btnGroup: cc.Node = null

    @property(cc.Node)
    showBtn: cc.Node = null

    @property(cc.Node)
    hideBtn: cc.Node = null

    // @property(cc.Node)
    // rechargeBtn: cc.Node = null;

    // @property(cc.Node)
    // dailyRechargeBtn: cc.Node = null;

    @property(cc.Node)
    rechargeStoreBtn: cc.Node = null;


    get storeModel() { return ModelManager.get(StoreModel); }
    get activityModel() { return ModelManager.get(ActivityModel); }

    onEnable() {
        let b = JumpUtils.ifSysOpen(2200);
        let h = this.btnGroup.height;
        if (gdk.panel.isOpenOrOpening(PanelId.MainPanel)) {
            this.hideBtn.active = b;
            this.showBtn.active = !b;
            this.btnGroup.parent.active = b;
            this.btnGroup.y = 0;
        } else {
            this.showBtn.active = b;
            this.hideBtn.active = !b;
            this.btnGroup.parent.active = !b;
            this.btnGroup.y = h;
        }
        this.btnGroup.parent.height = h;
        this.kfBtn.active = SdkTool.tool.showKfIcon;
        this.gotoH5Btn.active = SdkTool.tool.showH5Icon;
        this.bbsBtn.active = SdkTool.tool.showBbsIcon;
        gdk.gui.onViewChanged.on(() => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            let panelId = gdk.Tool.getResIdByNode(gdk.gui.getCurrentView());
            if (panelId == PanelId.PveReady.__id__) {
                this.hideFunc();
            }
        }, this);
    }

    onDisable() {
        gdk.gui.onViewChanged.targetOff(this);
    }

    showFunc() {
        this.showBtn.active = false
        this.btnGroup.parent.active = true
        this.btnGroup.runAction(cc.sequence(
            cc.moveTo(0.2, cc.v2(0, 0)),
            cc.callFunc(() => {
                this.hideBtn.active = true
            }, this)
        ))
    }


    hideFunc() {
        this.btnGroup.runAction(cc.sequence(
            cc.moveTo(0.2, cc.v2(0, this.btnGroup.height)),
            cc.callFunc(() => {
                this.showBtn.active = true
                this.btnGroup.parent.active = false
            }, this)
        ))
    }

    kfFunc() {
        if (!SdkTool.loaded) return;
        SdkTool.tool.kf();
        // 打开客服界面后，清除消息数量
        let m = ModelManager.get(ChatModel);
        m.kfMsgCount = 0;
    }

    h5Func() {
        if (!SdkTool.loaded) return;
        SdkTool.tool.h5();
    }

    bbsFunc() {
        if (!SdkTool.loaded) return;
        SdkTool.tool.bbs();
    }

    sVipFunc() {
        if (!SdkTool.loaded) return;
        // 刷新红点
        GlobalUtil.setLocal('superVipRed', true, true);
        this.superVipBtn.getComponent(RedPointCtrl)._updateView();
        // 打开超级VIP界面
        gdk.panel.open(PanelId.SuperVipView);
    }

    @gdk.binding("activityModel.historyPaySum")
    _updateSuperVipBtn() {
        let cfg = ActivityUtils.getPlatformConfig(6);
        this.superVipBtn.active = cfg && this.activityModel.historyPaySum >= cfg.args;
    }
    superVipBtnRedPointHandle() {
        let record = GlobalUtil.getLocal('superVipRed', true);
        if (record) {
            return false;
        }
        let cfg = ActivityUtils.getPlatformConfig(6);
        GlobalUtil.setLocal('superVipRed', true, true);
        return cfg && this.activityModel.historyPaySum >= cfg.args;
    }

    mlSVipFunc() {
        if (!SdkTool.loaded) return;
        // 刷新红点
        GlobalUtil.setLocal('mlSuperVipRed', true, true);
        // let actType = ActUtil.getActRewardType(126);
        // GlobalUtil.setLocal('mlSuperVipActType', actType, true);
        this.mlSuperVipBtn.getComponent(RedPointCtrl)._updateView();
        // 打开超级VIP界面
        gdk.panel.open(PanelId.MLSuperVipView);
    }

    @gdk.binding("activityModel.historyPaySum")
    _updateMlSuperVipBtn() {
        let cfg = ActivityUtils.getPlatformConfig(11);
        this.mlSuperVipBtn.active = cfg && this.activityModel.historyPaySum >= cfg.args;
    }

    mlSuperVipBtnRedPointHandle() {
        let actType = ActUtil.getActRewardType(126);
        let record = GlobalUtil.getLocal('mlSuperVipRed', true);
        let type = GlobalUtil.getLocal('mlSuperVipActType', true);
        if (record && type && type == actType) {
            return false;
        }
        let cfg = ActivityUtils.getPlatformConfig(11);
        //GlobalUtil.setLocal('mlSuperVipRed', true, true);
        //GlobalUtil.setLocal('mlSuperVipActType', actType, true);
        if (!record) {
            return cfg && this.activityModel.historyPaySum >= cfg.args
        }
        return cfg && this.activityModel.historyPaySum >= cfg.args && ActUtil.ifActOpen(126);
    }

    ml2SVipFunc() {
        if (!SdkTool.loaded) return;
        // 刷新红点
        GlobalUtil.setLocal('mlSuperVipRed2', true, true);
        // let actType = ActUtil.getActRewardType(126);
        // GlobalUtil.setLocal('mlSuperVipActType', actType, true);
        this.mlSuperVipBtn2.getComponent(RedPointCtrl)._updateView();
        // 打开超级VIP界面
        gdk.panel.open(PanelId.MLSuperVipView2);
    }

    @gdk.binding("activityModel.historyPaySum")
    _updateMlSuperVipBtn2() {
        let cfg = ActivityUtils.getPlatformConfig(12);
        this.mlSuperVipBtn2.active = cfg && this.activityModel.historyPaySum >= cfg.args;
    }

    mlSuperVipBtn2RedPointHandle() {
        let actType = ActUtil.getActRewardType(127);
        let record = GlobalUtil.getLocal('mlSuperVipRed2', true);
        let type = GlobalUtil.getLocal('mlSuperVipActType2', true);
        if (record && type && type == actType) {
            return false;
        }
        let cfg = ActivityUtils.getPlatformConfig(12);
        //GlobalUtil.setLocal('mlSuperVipRed2', true, true);
        //GlobalUtil.setLocal('mlSuperVipActType', actType, true);
        if (!record) {
            return cfg && this.activityModel.historyPaySum >= cfg.args
        }
        return cfg && this.activityModel.historyPaySum >= cfg.args && ActUtil.ifActOpen(127);
    }

    ml3SVipFunc() {
        if (!SdkTool.loaded) return;
        // 刷新红点
        GlobalUtil.setLocal('mlSuperVipRed3', true, true);
        // let actType = ActUtil.getActRewardType(126);
        // GlobalUtil.setLocal('mlSuperVipActType', actType, true);
        this.mlSuperVipBtn3.getComponent(RedPointCtrl)._updateView();
        // 打开超级VIP界面
        gdk.panel.open(PanelId.MLSuperVipView3);
    }

    @gdk.binding("activityModel.historyPaySum")
    _updateMlSuperVipBtn3() {
        let cfg = ActivityUtils.getPlatformConfig(13);
        this.mlSuperVipBtn3.active = cfg && this.activityModel.historyPaySum >= cfg.args;
    }

    mlSuperVipBtn3RedPointHandle() {
        let actType = ActUtil.getActRewardType(128);
        let record = GlobalUtil.getLocal('mlSuperVipRed3', true);
        let type = GlobalUtil.getLocal('mlSuperVipActType3', true);
        if (record && type && type == actType) {
            return false;
        }
        let cfg = ActivityUtils.getPlatformConfig(13);
        //GlobalUtil.setLocal('mlSuperVipRed2', true, true);
        //GlobalUtil.setLocal('mlSuperVipActType', actType, true);
        if (!record) {
            return cfg && this.activityModel.historyPaySum >= cfg.args
        }
        return cfg && this.activityModel.historyPaySum >= cfg.args && ActUtil.ifActOpen(128);
    }

    ml4SVipFunc() {
        if (!SdkTool.loaded) return;
        // 刷新红点
        GlobalUtil.setLocal('mlSuperVipRed4', true, true);
        this.mlSuperVipBtn4.getComponent(RedPointCtrl)._updateView();
        // 打开超级VIP界面
        gdk.panel.open(PanelId.MLSuperVipView4);
    }

    @gdk.binding("activityModel.historyPaySum")
    _updateMlSuperVipBtn4() {
        let cfg = ActivityUtils.getPlatformConfig(14);
        this.mlSuperVipBtn4.active = cfg && this.activityModel.historyPaySum >= cfg.args;
    }

    mlSuperVipBtn4RedPointHandle() {
        let actType = ActUtil.getActRewardType(141);
        let record = GlobalUtil.getLocal('mlSuperVipRed4', true);
        let type = GlobalUtil.getLocal('mlSuperVipActType4', true);
        if (record && type && type == actType) {
            return false;
        }
        let cfg = ActivityUtils.getPlatformConfig(14);
        if (!record) {
            return cfg && this.activityModel.historyPaySum >= cfg.args
        }
        return cfg && this.activityModel.historyPaySum >= cfg.args && ActUtil.ifActOpen(141);
    }

    ml5SVipFunc() {
        if (!SdkTool.loaded) return;
        // 刷新红点
        GlobalUtil.setLocal('mlSuperVipRed5', true, true);
        this.mlSuperVipBtn5.getComponent(RedPointCtrl)._updateView();
        // 打开超级VIP界面
        gdk.panel.open(PanelId.MLSuperVipView5);
    }

    @gdk.binding("activityModel.historyPaySum")
    _updateMlSuperVipBtn5() {
        let cfg = ActivityUtils.getPlatformConfig(15);
        this.mlSuperVipBtn5.active = cfg && this.activityModel.historyPaySum >= cfg.args;
    }

    mlSuperVipBtn5RedPointHandle() {
        let actType = ActUtil.getActRewardType(142);
        let record = GlobalUtil.getLocal('mlSuperVipRed4', true);
        let type = GlobalUtil.getLocal('mlSuperVipActType4', true);
        if (record && type && type == actType) {
            return false;
        }
        let cfg = ActivityUtils.getPlatformConfig(15);
        if (!record) {
            return cfg && this.activityModel.historyPaySum >= cfg.args
        }
        return cfg && this.activityModel.historyPaySum >= cfg.args && ActUtil.ifActOpen(142);
    }

    // /** 首充按钮显示或隐藏*/
    // @gdk.binding("storeModel.firstPayTime")
    // _firstPayGiftIconShowOrHide() {
    //     if (!SdkTool.tool.can_charge || this.storeModel._hasGetFirstPayReward()) {
    //         // 充值过而且已经领取了奖励，隐藏首充按钮
    //         this.rechargeBtn.active = false;
    //     } else {
    //         // 显示首充按钮
    //         if (JumpUtils.ifSysOpen(1801, false)) {
    //             this.rechargeBtn.active = true;
    //         }
    //         else {
    //             this.rechargeBtn.active = false;
    //         }
    //     }
    // }

    /**充值界面 */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateRechargeStoreBtn() {
        if (!SdkTool.tool.can_charge || !JumpUtils.ifSysOpen(2829)) {
            this.rechargeStoreBtn.active = false;
        }
        else {
            this.rechargeStoreBtn.active = true;
        }
    }

    onRechargeBtnClick() {
        JumpUtils.openRechargetLBPanel([1])
    }

    // //------每日充值------//
    // onDailyRechargeBtnClick() {
    //     gdk.panel.open(PanelId.DailyFirstRecharge);
    // }

    // @gdk.binding('roleModel.level')
    // @gdk.binding('copyModel.lastCompleteStageId')
    // @gdk.binding('activityModel.dailyRechargeRewarded')
    // @gdk.binding('storeModel.firstPayTime')
    // _updateDailyRechargeBtnIconShowOrHide() {
    //     if (!SdkTool.tool.can_charge || !JumpUtils.ifSysOpen(2834)) {
    //         this.dailyRechargeBtn.active = false;
    //     }
    //     else if (!this.storeModel.firstPayTime) {
    //         this.dailyRechargeBtn.active = false;
    //     }
    //     else {
    //         let time = TimerUtils.getTomZerohour(this.storeModel.firstPayTime / 1000);
    //         if (GlobalUtil.getServerTime() >= time * 1000 && !this.activityModel.dailyRechargeRewarded) {
    //             this.dailyRechargeBtn.active = true;
    //         }
    //         else {
    //             this.dailyRechargeBtn.active = false;
    //         }
    //     }
    // }

    hasKfMsg(): boolean {
        let m = ModelManager.get(ChatModel);
        return m.kfMsgCount > 0;
    }
}
