import * as config from '../../../../a/config';
import ActivityModel from '../../../../view/act/model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../../../view/act/util/ActUtil';
import ArenaHonorUtils from '../../../../view/arenahonor/utils/ArenaHonorUtils';
import AskPanel, { AskInfoType } from '../../../../common/widgets/AskPanel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId } from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import GuideViewCtrl from '../../../../guide/ctrl/GuideViewCtrl';
import JumpUtils from '../../../../common/utils/JumpUtils';
import LoginModel from '../../../../common/models/LoginModel';
import LoginUtils from '../LoginUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveLittleGameModel from '../../../../view/pve/model/PveLittleGameModel';
import RoleModel from '../../../../common/models/RoleModel';
import SdkTool from '../../../../sdk/SdkTool';
import SignUtil from '../../../../view/sign/util/SignUtil';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { Little_game_channelCfg, Little_game_globalCfg } from '../../../../a/config';
/**
 * 进入游戏主场景动作实现
 * @Author: sthoo.huang
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-20 01:58:06
 * @Last Modified time: 2021-09-29 14:50:36
 */
export default class EnterMainImplement {

    fsm: gdk.fsm.FsmStateAction;
    nodes: cc.Node[];

    onEnter() {
        gdk.e.on(CopyEventId.RSP_COPY_MAIN_HANG, this.checkGetHangupReward, this);
        // 当前已经在主场景
        if (gdk.panel.isOpenOrOpening(PanelId.MainDock)) {
            return;
        }
        // 暂时不显示界面
        this.nodes = [
            gdk.gui.layers.popupLayer,
            gdk.gui.layers.viewLayer,
            gdk.gui.layers.guideLayer,
        ];
        this.nodes.forEach(n => n.opacity = 1);
        // 更新最后登录时间
        let m = ModelManager.get(LoginModel);
        if (m.isFirstLogin === void 0) {
            let tn = 'login_last_time';
            let tm = GlobalUtil.getLocal(tn);
            let sm = GlobalUtil.getServerTime();
            if (tm) {
                let dateA = new Date(tm);
                let dateB = new Date(sm);
                // 不是同一天，则为首次登录
                m.isFirstLogin = dateA.toDateString() !== dateB.toDateString();
            } else {
                m.isFirstLogin = true;
            }
            GlobalUtil.setLocal(tn, sm);
        }
        // 创建引导
        if (!SdkTool.tool.can_charge) {
            // 屏蔽充值界面，转向至任务界面
            [
                PanelId.Store,
                PanelId.Recharge,
                PanelId.TradingPort,
                PanelId.FirstPayGift,
                PanelId.DailyFirstRecharge,
                PanelId.ActivityMainView,
                PanelId.WonderfulActivityView,
            ].forEach(e => e.prefab = PanelId.Task.prefab);
            // 屏蔽引导
            if (ModelManager.get(RoleModel).level >= 5) {
                GuideUtil.isHideGuide = true;
            }
        }
        if (!GuideUtil.isHideGuide) {
            let name = PanelId.GuideView.__id__;
            let node = gdk.gui.layers.guideLayer.getChildByName(name);
            if (!node) {
                // 加载标记资源之后再创建节点
                gdk.rm.loadResByPanel(name, null, null, () => {
                    if (!this.fsm) return;
                    if (!this.fsm.active) return;
                    let prefab = gdk.rm.getResByUrl(PanelId.GuideView.prefab, cc.Prefab);
                    let node = cc.instantiate(prefab);
                    let panel = node.getComponent(GuideViewCtrl) as any;
                    node.name = name;
                    panel.resId = name;
                    gdk.gui.addGuide(node);
                    this.onEnterNext();
                });
                return;
            }
        }

        // 下一步
        this.onEnterNext();
    }

    // 下一步
    onEnterNext() {
        // 根据等级不同默认打开不同的界面
        if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel) &&
            !gdk.panel.isOpenOrOpening(PanelId.PveReady)
        ) {
            let panelId: gdk.PanelValue;
            if (JumpUtils.ifSysOpen(1301)) {
                // 基地功能开启
                panelId = PanelId.MainPanel;
            } else {
                // 基地还没有开启时
                let cfg = ConfigManager.getItemById(Little_game_channelCfg, iclib.SdkTool.tool.config.id);
                if (cfg && cfg.value && !GlobalUtil.getCookie('enter_littleGame')) {
                    // 先进入小游戏
                    GlobalUtil.setCookie('enter_littleGame', true);
                    let stageId: number = 1;
                    let model = new PveLittleGameModel();
                    model.id = stageId;
                    let hpNum = ConfigManager.getItemByField(Little_game_globalCfg, 'key', 'general_blood').value[0];
                    model.generalHp = hpNum;
                    model.enterGeneralHp = hpNum;
                    gdk.panel.setArgs(PanelId.PveLittleGameView, model);
                    gdk.panel.open(PanelId.PveLittleGameView, this.onEnterNext2, this);
                    return;
                } else {
                    let copyModel = ModelManager.get(CopyModel);
                    let isFisrt = copyModel.lastCompleteStageId == 0;
                    panelId = isFisrt ? PanelId.PveScene : PanelId.PveReady;
                }
            }
            gdk.panel.open(panelId, this.onEnterNext2, this);
        } else {
            // 直接下一步
            this.onEnterNext2();
        }
    }

    // 再下一步
    onEnterNext2() {
        // 打开预设界面
        let list = [
            PanelId.MainDock,
            PanelId.MainTopInfoView,
            PanelId.MiniChat,
            PanelId.GrowTaskBtnView,
            //PanelId.MainBaseRight,
        ];
        let count = list.length;
        let callback = (node: cc.Node) => {
            if (!cc.isValid(node)) return;
            node.removeComponent(gdk.PopupComponent);
            // 所有界面打开是否完成
            count -= 1;
            if (count > 0) {
                return;
            }
            // 前端初始化完成标志
            let roleModel = ModelManager.get(RoleModel);
            roleModel.initlized = true;
            // 延时签到检查
            gdk.Timer.once(800, this, () => {
                // 不在主城或者引导真在打开状态
                if (gdk.panel.isOpenOrOpening(PanelId.MainPanel) && !GuideUtil.isGuiding) {
                    // 检查签到状态
                    SignUtil.CheckOpenSign();
                    // 检查是否需要打开首充界面
                    if (SdkTool.tool.can_charge) {
                        let curTime = GlobalUtil.getServerTime();
                        let createTime = TimerUtils.getZerohour(parseInt(roleModel.createTime)) * 1000;
                        let days = Math.floor((curTime - createTime) / (24 * 60 * 60 * 1000)) + 1;
                        if (days <= 2 && GlobalUtil.getLocal('auto_open_first_pay') != days) {
                            GlobalUtil.setLocal('auto_open_first_pay', days);
                            JumpUtils.openFirstPayGift();
                        }
                    }
                    // 挂机奖励
                    this.checkGetHangupReward();
                    this.checkCombineTip();
                    this.checkArenahonorPoster();
                    this.checkExpeditionRankShow()
                    this.checkAssembledShow();
                    this.checkActivityPoster()
                }
                // 隐藏启动背景
                LoginUtils.setLogoActive(false);
                // 显示界面
                this.nodes && this.nodes.forEach(n => n.opacity = 255);
                gdk.gui.hideLoading();
            });
        };
        for (let i = 0; i < count; i++) {
            gdk.panel.open(list[i], callback, this);
        }
    }

    // 退出
    onExit() {
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this);
        this.nodes && this.nodes.forEach(n => n.opacity = 255);
        this.fsm = null;
        this.nodes = null;
    }

    /**挂机奖励领取提示 */
    checkGetHangupReward() {
        if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel) || GuideUtil.isGuiding) {
            // 不在主城或者引导真在打开状态
            return;
        }
        let copyModel = ModelManager.get(CopyModel);
        let hangTime = ConfigManager.getItemById(config.GlobalCfg, "hang_up_reward").value[0];
        let now = Math.floor(GlobalUtil.getServerTime() / 1000);
        let hmsg = copyModel.hangStateMsg;
        if (hmsg && now - hmsg.startTime >= hangTime) {
            gdk.e.off(CopyEventId.RSP_COPY_MAIN_HANG, this.checkGetHangupReward, this);
            let panelId = PanelId.AskPanel;
            let askInfo: AskInfoType = {
                title: gdk.i18n.t('i18n:TIP_TITLE'),
                descText: gdk.i18n.t('i18n:HANG_LIMITS'),
                sureText: gdk.i18n.t('i18n:GO'),
                closeText: gdk.i18n.t('i18n:CANCEL'),
                sureCb: () => {
                    panelId.isTouchMaskClose = true;
                    gdk.panel.open(PanelId.PveReady);
                    gdk.Timer.callLater(this, () => {
                        GuideUtil.setGuideId(210011);
                    });
                },
                closeCb: () => {
                    panelId.isTouchMaskClose = true;
                },
                closeBtnCb: () => {
                    panelId.isTouchMaskClose = true;
                },
            };
            panelId.isTouchMaskClose = false;
            JumpUtils.openPanelAfter(
                panelId,
                [
                    PanelId.Sign,
                ],
                null,
                (node: cc.Node) => {
                    let comp = node.getComponent(AskPanel);
                    comp.updatePanelInfo(askInfo);
                },
            );
        }
    }

    /**合服活动 弹窗  */
    checkCombineTip() {
        if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel) || GuideUtil.isGuiding) {
            // 不在主城或者引导真在打开状态
            return;
        }
        if (ActUtil.ifActOpen(93)) {
            gdk.panel.open(PanelId.CombineCarnivalTip)
        }
    }

    /**荣耀巅峰赛 弹窗 */
    checkArenahonorPoster() {
        if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel) || GuideUtil.isGuiding) {
            // 不在主城或者引导真在打开状态
            return;
        }
        if (!JumpUtils.ifSysOpen(2919)) {
            //活动未开启
            return;
        }
        let roleModel = ModelManager.get(RoleModel);
        let time = roleModel.CrossOpenTime * 1000;
        let actId = 110;
        let cfg = ActUtil.getCfgByActId(actId);
        if (cfg) {
            let temTime = ActUtil.getActStartTime(110);
            if (temTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                let progressId = ArenaHonorUtils.getCurProgressId();
                let b = GlobalUtil.getLocal(`ahPoster${cfg.index}-${progressId}`, true);
                if (!b) {
                    if (!gdk.panel.isOpenOrOpening(PanelId.ArenahonorPosterView)) {
                        JumpUtils.openPanelAfter(PanelId.ArenahonorPosterView, [
                            PanelId.Sign,
                            PanelId.AskPanel,
                        ], null, () => {
                            GlobalUtil.setLocal(`ahPoster${cfg.index}-${progressId}`, true, true);
                        });
                    }
                }
            }

        }

    }

    //活动海报是否打开
    checkActivityPoster() {
        if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel) || GuideUtil.isGuiding) {
            // 不在主城或者引导真在打开状态
            return;
        }
        if (!ActivityUtils.checkOpenPosterView()) {
            return;
        }

        let aModel = ModelManager.get(ActivityModel);
        let openActData = GlobalUtil.getLocal(`activityPoster_openActData`);
        let skip = GlobalUtil.getLocal(`activityPoster_skip`);
        let cfgs = ConfigManager.getItems(config.Common_carouselCfg);
        if (!openActData) {
            let temData = []
            for (let i = 0, n = cfgs.length; i < n; i++) {
                let cfg = cfgs[i]
                if (JumpUtils.ifSysOpen(cfg.system) && cfg.show) {
                    let data = [];
                    let rewardType = ActUtil.getActRewardType(cfg.activity_id);
                    data[0] = cfg.activity_id;
                    data[1] = rewardType;
                    temData.push(data);
                }
            }
            skip = false;
            GlobalUtil.setLocal(`activityPoster_openActData`, temData);
        } else {
            let haveNewAct = false;
            for (let i = 0, n = cfgs.length; i < n; i++) {
                let cfg = cfgs[i]
                if (JumpUtils.ifSysOpen(cfg.system) && cfg.show) {
                    //let data = [];
                    let rewardType = ActUtil.getActRewardType(cfg.activity_id);
                    // data[0] = cfg.activity_id;
                    // data[1] = rewardType;
                    let have = false;
                    for (let j = 0, m = openActData.length; j < m; j++) {
                        let data = openActData[j];
                        if (data[0] == cfg.activity_id) {
                            have = true;
                            if (data[1] != rewardType) {
                                data[1] = rewardType;
                                haveNewAct = true;
                            }
                        }
                    }
                    if (!have) {
                        let tem = [cfg.activity_id, rewardType];
                        openActData.push(tem);
                        haveNewAct = true;
                    }
                }
            }
            GlobalUtil.setLocal(`activityPoster_openActData`, openActData);
            if (haveNewAct) {
                skip = false;
            }
        }

        if (skip == null || (!skip && !aModel.openActPosterState)) {
            gdk.panel.open(PanelId.PosterView);
        }

    }

    checkExpeditionRankShow() {
        if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel) || GuideUtil.isGuiding) {
            // 不在主城或者引导真在打开状态
            return;
        }
        let actId = 114
        if (ActUtil.ifActOpen(actId) && ModelManager.get(RoleModel).guildId > 0) {
            TimerUtils.isCurDay
            let time = GlobalUtil.getLocal(`_expedition_rank_show_time_`);
            if (!time || (time && !TimerUtils.isCurDay(time))) {
                if (!gdk.panel.isOpenOrOpening(PanelId.ExpeditionRankView)) {
                    JumpUtils.openPanelAfter(PanelId.ExpeditionRankView, [
                        PanelId.Sign,
                        PanelId.AskPanel,
                    ], null, () => {
                        GlobalUtil.setLocal(`_expedition_rank_show_time_`, Math.floor(GlobalUtil.getServerTime() / 1000));
                    });
                }
            }
        }
    }

    checkAssembledShow() {
        if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel) || GuideUtil.isGuiding) {
            // 不在主城或者引导真在打开状态
            return;
        }
        let actId = 118
        if (ActUtil.ifActOpen(actId)) {
            let tipState = GlobalUtil.getLocal('assembledIsSkipTip', true)
            let stateStr = GlobalUtil.getLocal('assembledOpenState');
            let temStartTime = ActUtil.getActStartTime(actId)
            let curTime = GlobalUtil.getServerTime();
            let actType = ActUtil.getActRewardType(actId);
            let curDayNum = Math.floor(((curTime - temStartTime) / 1000) / 86400) + 1
            let assembledOpen = 'assembled_' + actType + '_' + curDayNum;
            let model = ModelManager.get(ActivityModel)
            if (!stateStr || stateStr != assembledOpen) {
                if (((model.assembledState & 1 << curDayNum - 1) == 0) && !model.assembledOpenState && model.dayRecharge > 0) {
                    //gdk.panel.open(PanelId.AssembledActivityMainView);
                    if (!gdk.panel.isOpenOrOpening(PanelId.AssembledActivityMainView)) {
                        JumpUtils.openPanelAfter(PanelId.AssembledActivityMainView, [
                            PanelId.Sign,
                            PanelId.AskPanel,
                        ], null);
                    }
                }
            } else if (stateStr == assembledOpen) {
                if (((model.assembledState & 1 << curDayNum - 1) == 0) && !model.assembledOpenState && model.dayRecharge > 0 && !tipState) {
                    //gdk.panel.open(PanelId.AssembledActivityMainView);
                    if (!gdk.panel.isOpenOrOpening(PanelId.AssembledActivityMainView)) {
                        JumpUtils.openPanelAfter(PanelId.AssembledActivityMainView, [
                            PanelId.Sign,
                            PanelId.AskPanel,
                        ], null);
                    }
                }
            }
            // let time = GlobalUtil.getLocal(`_expedition_rank_show_time_`);
            // if (!time || (time && !TimerUtils.isCurDay(time))) {
            //     if (!gdk.panel.isOpenOrOpening(PanelId.ExpeditionRankView)) {
            //         JumpUtils.openPanelAfter(PanelId.ExpeditionRankView, [
            //             PanelId.Sign,
            //             PanelId.AskPanel,
            //         ], null, () => {
            //             GlobalUtil.setLocal(`_expedition_rank_show_time_`, Math.floor(GlobalUtil.getServerTime() / 1000));
            //         });
            //     }
            // }
        }
    }
}