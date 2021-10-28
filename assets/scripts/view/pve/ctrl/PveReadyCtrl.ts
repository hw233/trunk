import ActivityModel from '../../act/model/ActivityModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { HangItemInfo } from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import MainLineBuildUpgradeEffectCtrl from '../../map/ctrl/MainLineBuildUpgradeEffectCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import PveHeroChatItemCtrl from './view/PveHeroChatItemCtrl';
import PveSceneCtrl from './PveSceneCtrl';
import RaidsRewardViewCtrl from '../../instance/ctrl/mainLine/RaidsRewardViewCtrl';
import RewardItem from '../../../common/widgets/RewardItem';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Common_bubblingCfg, Copy_stageCfg } from '../../../a/config';
import { GuideCfg } from './../../../a/config';
import { GuideType } from './../../../guide/ctrl/GuideViewCtrl';
import { InstanceEventId } from '../../instance/enum/InstanceEnumDef';
import { ParseMainLineId } from '../../instance/utils/InstanceUtil';

/**
 * 主线通用准备界面
 * @Author: sthoo.huang
 * @Date: 2019-10-14 16:06:04
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-07 14:27:16
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveReadyCtrl")
export default class PveReadyCtrl extends PveSceneCtrl {

    @property(cc.Label)
    rewardTitle: cc.Label = null;
    @property(cc.Label)
    rewardGoldLb: cc.Label = null;
    @property(cc.Label)
    rewardExpLb: cc.Label = null;
    @property(cc.Label)
    rewardExp2Lb: cc.Label = null;
    @property(cc.Label)
    rewardTavernLb: cc.Label = null;
    @property(cc.Node)
    rewardTavernBg: cc.Node = null;
    @property(cc.Prefab)
    rewardItemPreb: cc.Prefab = null;
    @property(cc.Node)
    rewardContent: cc.Node = null;
    @property(cc.ScrollView)
    rewardScrollView: cc.ScrollView = null;

    @property(cc.Animation)
    animations: cc.Animation[] = [];

    @property(cc.Node)
    areanIcon: cc.Node = null;//章节地图
    @property(cc.Label)
    stageLab: cc.Label = null;//关卡
    @property(cc.Node)
    eliteStageNode: cc.Node = null;//精英关卡node
    @property(cc.Label)
    eliteStageLab: cc.Label = null;//精英关卡

    @property(cc.Node)
    rewardsNode: cc.Node = null;

    @property(cc.Node)
    HangItemNode: cc.Node = null;

    //特权卡双倍标记
    @property(cc.Node)
    doubleNode: cc.Node = null;

    @property(cc.Prefab)
    heroChatPrefab: cc.Prefab = null;

    @property(cc.Button)
    startBtn: cc.Button = null;

    @property(cc.Node)
    btnScore: cc.Node = null;
    @property(cc.Node)
    mustDobtn: cc.Node = null;

    get storeModel() { return ModelManager.get(StoreModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    get actModel() { return ModelManager.get(ActivityModel); }

    heroChatNode: cc.Node;
    heroChatTime: number;
    guideFightingTime: number;

    onLoad() {
        // UI效果
        let ui = this.node.getChildByName('UI');
        ui.children.forEach(n => gdk.NodeTool.hide(n, false, gdk.HideMode.DISABLE));
        gdk.Timer.once(100, this, () => {
            ui.children.forEach(node => {
                gdk.NodeTool.show(node);
            });
        });
    }

    onEnableAfter() {
        this.model.isDemo = true;
        super.onEnableAfter();

        // 所有动画
        this.animations.forEach(a => {
            if (a) {
                let clip = a.defaultClip || a.getClips()[0];
                clip && a.play(clip.name);
            }
        });
        this.heroChatTime = 5;
        this.guideFightingTime = 3;

        // 设置当前关卡为最新关卡
        let stageId = this.copyModel.latelyStageId;
        let aid = ParseMainLineId(stageId, 1)//地图id编号
        let sid = ParseMainLineId(stageId, 2);//关卡编号

        let stageCfg = ConfigManager.getItemById(Copy_stageCfg, stageId)
        let path = `icon/map/${stageCfg.city_map}`
        GlobalUtil.setSpriteIcon(this.node, this.areanIcon, path)
        if (stageCfg.player_lv >= 999) {
            this.stageLab.string = gdk.i18n.t("i18n:PVE_READY_TIP1")//`未完待续...`
        } else {
            let ids = this.copyModel.getMainLineIdsByChapter(aid);
            this.stageLab.string = StringUtils.format(gdk.i18n.t("i18n:PVE_READY_TIP2"), ids.indexOf(stageId) + 1, ids.length)//`章节进度:${ids.indexOf(stageId) + 1}/${ids.length}`
            // let data = CopyUtil.getEliteStageCurChaterData(aid)
            this.eliteStageNode.active = false//data[1] > 0;
            //this.eliteStageLab.string = data[0] + '/' + data[1]
        }

        // 事件
        gdk.e.on(InstanceEventId.RSP_HANG_REWARD, this.onHangRewardRsp, this, 0, false);
        gdk.gui.guiLayer.on(cc.Node.EventType.TOUCH_START, this.endFightingGuide, this, true);

        // 触发引导
        GuideUtil.activeGuide('main#' + stageId);

        // 更新信息
        this._updateHangItemInfo()
        // this._monthCardDouble();
        this._startBtnSprite();
        // this._triggerEliteTipsView();
        this.copyModel.needItem = null;
        this.btnScore.active = true;
        this.mustDobtn.active = JumpUtils.ifSysOpen(2873)

        //判断是否打开限时礼包界面
        if (this.actModel.mainShowView) {
            this.actModel.mainShowView = false;
            gdk.panel.setArgs(PanelId.LimitActGiftView, 1)
            gdk.panel.open(PanelId.LimitActGiftView)
        }
    }

    @gdk.binding('copyModel.hangStageId')
    updateHangInfo() {
        this.rewardContent.destroyAllChildren();
        // 挂机奖励列表
        let cfg = ConfigManager.getItemById(Copy_stageCfg, this.copyModel.hangStageId);
        if (cfg) {
            let rewards: any[], length: number;
            rewards = cfg.drop_show;
            rewards.sort((a, b) => { return a - b; })
            length = rewards.length;
            for (let i = 0; i < length; i++) {
                let n: cc.Node = cc.instantiate(this.rewardItemPreb);
                n.scaleX = n.scaleY = 1;
                n.parent = this.rewardContent;
                // 更新图标
                let c = n.getComponent(RewardItem);
                c.data = {
                    typeId: rewards[i],
                    num: 1,
                    dropAddNum: GlobalUtil.getDropAddNum(cfg, rewards[i])
                };
                c.updateView();
            }
            this.rewardTitle.string = StringUtils.format(
                gdk.i18n.t("i18n:HANG_DROP_REWARDS"),
                ParseMainLineId(cfg.id, 1),
                ParseMainLineId(cfg.id, 2),
            );

            GlobalUtil.setSpriteIcon(this.node, this.rewardTavernBg, GlobalUtil.getIconById(16));

            let newStageCfg = ConfigManager.getItemById(Copy_stageCfg, this.copyModel.latelyStageId)
            let stageCfg = ConfigManager.getItemById(Copy_stageCfg, newStageCfg.pre_condition)
            if (stageCfg) {
                this.rewardGoldLb.string = stageCfg.drop_show2[0] + '/m';
                this.rewardExpLb.string = stageCfg.drop_show2[1] + '/m';
                this.rewardExp2Lb.string = stageCfg.drop_show2[2] + '/m';
                this.rewardTavernLb.string = stageCfg.drop_show2[3] + '/m';
            }
        }
    }

    @gdk.binding('copyModel.lastCompleteStageId')
    _triggerEliteTipsView() {
        let triggerChapters = CopyUtil.getEliteStagePreChapters();
        let index = triggerChapters.indexOf(this.copyModel.lastCompleteStageId)
        if (index != -1 && index > 0) {
            let cfg = ConfigManager.getItemByField(Copy_stageCfg, 'pre_condition', this.copyModel.lastCompleteStageId);
            let eliteChapter = cfg.id;
            if (GlobalUtil.getLocal('trigger_elite_tips') != eliteChapter) {
                GlobalUtil.setLocal('trigger_elite_tips', eliteChapter);
                gdk.panel.open(PanelId.TriggerEliterTipsView);
            }
        }
        // this._showMainIncomePanel()
    }

    onDisable() {
        this.endFightingGuide();
        gdk.gui.guiLayer.targetOff(this);
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
        cc.isValid(this.heroChatNode) && this.heroChatNode.removeFromParent();
        cc.isValid(this.areanIcon) && GlobalUtil.setSpriteIcon(this.node, this.areanIcon, null);
        this.btnScore.active = false
        super.onDisable();
    }

    update(dt: number) {

        // 英雄聊天气泡
        this.heroChatTime -= dt;
        if (this.heroChatTime <= 0) {
            this.heroChatTime = 5;
            this._updateHeroChat();
        }

        // 开始战斗引导
        this.guideFightingTime -= dt;
        if (this.guideFightingTime <= 0) {
            this.guideFightingTime = 3;
            // 当前没有引导时，没有弹窗，最新关卡是可进入的关卡
            if (GuideUtil.getCurGuide() == null &&
                !gdk.panel.isOpenOrOpening(PanelId.PveScene) &&
                !gdk.gui.hasPopup() &&
                CopyUtil.isStageEnterable(this.copyModel.latelyStageId)
            ) {
                let cfg = ConfigManager.getItem(GuideCfg, { force: 0, nextTask: 0, bindBtnId: 1303 });
                if (!cfg) {
                    cfg = ConfigManager.getItem(GuideCfg, { force: 0, nextTask: -1, bindBtnId: 1303, type: GuideType.FREE_SHOW });
                }
                if (cfg) {
                    cfg.type = GuideType.FREE_SHOW;
                    cfg.nextTask = -1;
                    GuideUtil.setGuideId(cfg.id);
                }
            }
        }
    }

    // 结束本次战斗引导提示
    endFightingGuide() {
        let cfg = GuideUtil.getCurGuide();
        if (cfg && cfg.bindBtnId == 1303 && cfg.type == GuideType.FREE_SHOW) {
            GuideUtil.endGuide();
            GuideUtil.clearGuide();
        }
        this.guideFightingTime = 3;
    }

    // 领取奖励返回
    onHangRewardRsp(data: icmsg.DungeonHangRewardRsp) {
        let goodsList = data.goodsList;
        if (data.monthCardGoodsList && data.monthCardGoodsList.length > 0) {
            data.monthCardGoodsList.forEach((goods) => { goods['up'] = true });
            goodsList = data.monthCardGoodsList.concat(goodsList)
        }
        GlobalUtil.openRewadrView(goodsList);
        GuideUtil.activeGuide('reward#DungeonHang#rsp');
    }

    // 扫荡
    quickFight() {
        gdk.panel.open(PanelId.RaidReward, (node: cc.Node) => {
            let ctrl = node.getComponent(RaidsRewardViewCtrl);
            ctrl.initPanelData([], ModelManager.get(CopyModel).hangStageId);
        });
        // gdk.e.once(
        //     CopyEventId.RSP_COPY_MAIN_RAIDS,
        //     (data: { id: number, rewards: GoodsInfo[] }) => {
        //         // 扫荡返回
        //         if (!cc.isValid(this.node)) return;
        //         gdk.panel.open(PanelId.RaidReward, (node: cc.Node) => {
        //             let ctrl = node.getComponent(RaidsRewardViewCtrl);
        //             ctrl.initPanelData(data.rewards, data.id);
        //         });
        //     },
        //     this, 0, false,
        // );
    }

    // 禁用功能
    _state() { }
    _timeScale() { }
    _score() { }
    _updateTotalPower() { }
    _updateOneKeyRedPoint() { }
    _initsuperSkillData() { }
    _updateEnemyDropInfo() { }


    _updateHangItemInfo() {
        let info: HangItemInfo = GlobalUtil.getCookie("hangItem_Flag")
        if (info && info.itemId > 0) {
            this.rewardsNode.active = false
            this.HangItemNode.active = true
        } else {
            this.rewardsNode.active = true
            this.HangItemNode.active = false
        }
    }

    _updateHeroChat() {
        let heros = this.model.heros;
        if (!heros || heros.length <= 0) return;
        let hero = heros[Math.floor(Math.random() * heros.length)];
        let cfg = ConfigManager.getItemByField(Common_bubblingCfg, 'level', ModelManager.get(RoleModel).level);
        if (!cfg) {
            let cfgs = ConfigManager.getItems(Common_bubblingCfg);
            cfg = cfgs[cfgs.length - 1];
        }
        let texts = cfg.bubbling.split(',');
        let text = texts[Math.floor(Math.random() * texts.length)];
        if (!this.heroChatNode) this.heroChatNode = cc.instantiate(this.heroChatPrefab);
        let ctrl = this.heroChatNode.getComponent(PveHeroChatItemCtrl);
        ctrl.hide();
        this.heroChatNode.parent = hero.node;
        this.heroChatNode.setPosition(30, 95);
        ctrl.updateText(text);
    }

    /*特权卡双子战利*/
    @gdk.binding("storeModel.monthCardDungeon")
    _monthCardDouble() {
        let monthCardDungeon = this.storeModel.monthCardDungeon;
        if (!monthCardDungeon) {
            this.doubleNode.active = false;
            return;
        }
        //主线
        this.doubleNode.active = monthCardDungeon.dungeonType == 1;

        //月卡到期
        for (let i = 0; i < this.storeModel.monthCardListInfo.length; i++) {
            const info = this.storeModel.monthCardListInfo[i];
            if (info.id == 500003) {
                let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
                if (info.time <= nowTime) {
                    this.doubleNode.active = false
                    return
                }
            }
        }
    }

    @gdk.binding("roleModel.level")
    _startBtnSprite() {
        let id = this.copyModel.latelyStageId;
        let path = 'view/pve/texture/ready/';
        let cfg = ConfigManager.getItemById(Copy_stageCfg, id);
        this.startBtn.node.getChildByName('layout').active = false;
        if (CopyUtil.isNewChapter(id)) {
            GlobalUtil.setSpriteIcon(this.node, this.startBtn.node.getChildByName('icon'), `${path}gj_button02`);
        } else if (cfg.player_lv > this.roleModel.level) {
            this.startBtn.node.getChildByName('layout').active = true;
            GlobalUtil.setSpriteIcon(this.node, this.startBtn.node.getChildByName('icon'), `${path}gj_lvsebutton`);
            cc.find('layout/lv', this.startBtn.node).getComponent(cc.Label).string = `${cfg.player_lv}`;
        } else {
            if (cfg.type_stage == 3) {
                GlobalUtil.setSpriteIcon(this.node, this.startBtn.node.getChildByName('icon'), `${path}gj_button03xin`);
            }
            else {
                GlobalUtil.setSpriteIcon(this.node, this.startBtn.node.getChildByName('icon'), `${path}gj_button`);
            }
        }
    }

    mapBtnClickFunc() {
        gdk.panel.open(PanelId.WorldMapView);
    }

    startFightFunc() {
        let stageId = this.copyModel.latelyStageId;
        let stageCfg = ConfigManager.getItemById(Copy_stageCfg, stageId);
        if (!stageCfg || stageCfg.player_lv >= 999) {
            // 还没有开放
            gdk.gui.showMessage(gdk.i18n.t("i18n:PVE_READY_TIP3"));
        } else {
            if (CopyUtil.isNewChapter(stageId)) {
                // 新章节,打开大地图
                // gdk.panel.open(PanelId.WorldMapView);
                gdk.panel.open(PanelId.MainLineBuildUpgradeEffect, (node: cc.Node) => {
                    let chapter = CopyUtil.getChapterId(stageId);
                    let comp = node.getComponent(MainLineBuildUpgradeEffectCtrl)
                    comp.initEffect(chapter, () => {
                        GlobalUtil.setCookie('openNewChapter', chapter);
                        this._startBtnSprite();
                    }, this)
                })
            }
            else {
                if (stageCfg.player_lv > ModelManager.get(RoleModel).level) {
                    GlobalUtil.showMessageAndSound(StringUtils.format(gdk.i18n.t("i18n:PVE_READY_TIP4"), stageCfg.player_lv))//(`指挥官等级达到${stageCfg.player_lv}级可进行挑战`)
                    // 当前没有引导时，强制设置一个提示的引导
                    if (!GuideUtil.getCurGuide() && (
                        this.copyModel.quickFightFreeTimes > 0 ||
                        this.copyModel.quickFightPayTimes > 0
                    )) {
                        let cfg = ConfigManager.getItem(GuideCfg, { force: 0, nextTask: 0, bindBtnId: 1311 });
                        if (cfg) {
                            GuideUtil.setGuideId(cfg.id);
                        }
                    }
                    return;
                }
                // 打开塔防战斗场景
                gdk.panel.open(PanelId.PveScene);
            }
        }
    }

    // 打开回放列表界面
    openReplayList() {
        JumpUtils.openReplayListView(this.copyModel.latelyStageId);
    }

    /**赏金求助界面 */
    openBountyPublishView() {
        gdk.panel.open(PanelId.BountyPublishView)
    }

    /**快速作战 */
    onQuickFightView() {
        gdk.panel.open(PanelId.RaidReward2)
    }

    /**切换展示收益展示 */
    @gdk.binding('copyModel.lastCompleteStageId')
    _showMainIncomePanel() {
        let preStageId = GlobalUtil.getLocal("income_show_stageId", true, 110106);
        let curStageId = this.copyModel.lastCompleteStageId;
        let preChapter = ParseMainLineId(preStageId, 1);
        let curChapter = ParseMainLineId(curStageId, 1);
        if (preChapter != curChapter && curChapter > 2) {
            // 如果升级弹窗显示，则等其关闭后再打开
            JumpUtils.openPanelAfter(
                PanelId.MainIncome,
                [
                    PanelId.MainLevelUpTip,
                    PanelId.FunctionOpen,
                    PanelId.PveBossCommingEffect,
                ]
            );
        }
    }

    // 预加载界面列表
    get preloads() {
        let a = [
            PanelId.PveScene,
            PanelId.Role2,
            PanelId.Lottery,
            PanelId.Task,
            PanelId.MainHangPreReward,
            PanelId.TavernPanel,
            PanelId.WorldMapView,
            PanelId.RaidReward2,
            PanelId.GrowTaskView,
        ];
        return a;
    }
}