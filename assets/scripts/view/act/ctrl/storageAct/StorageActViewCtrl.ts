import ActivityIconItemCtrl from '../ActivityIconItemCtrl';
import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import ArenaHonorUtils from '../../../arenahonor/utils/ArenaHonorUtils';
import ChampionModel from '../../../champion/model/ChampionModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import NewAdventureModel from '../../../adventure2/model/NewAdventureModel';
import NewAdventureUtils from '../../../adventure2/utils/NewAdventureUtils';
import PanelId from '../../../../configs/ids/PanelId';
import ResonatingUtils from '../../../resonating/utils/ResonatingUtils';
import RoleModel from '../../../../common/models/RoleModel';
import SdkTool from '../../../../sdk/SdkTool';
import StoreModel from '../../../store/model/StoreModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import WorldHonorModel from '../../../../common/models/WorldHonorModel';
import WuhunTrialIconCtrl from '../eternalCopy/WuhunTrialIconCtrl';
import {
    ActivityCfg,
    Champion_mainCfg,
    MainInterface_mainCfg,
    MainInterface_sort_1Cfg,
    MainInterface_sort_2Cfg,
    MainInterface_sortCfg,
    Store_pushCfg
    } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-03 20:58:51 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/storageAct/StorageActViewCtrl")
export default class StorageActViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    championBtn: cc.Node = null;

    @property(cc.Node)
    diaryBtn: cc.Node = null;

    @property(cc.Node)
    magicBtn: cc.Node = null;

    @property(cc.Node)
    activityBtn: cc.Node = null;

    // @property(cc.Node)
    // luckTwistBtn: cc.Node = null;

    @property(cc.Node)
    assistGiftStarBtn: cc.Node = null;

    // @property(cc.Node)
    // guardianCallRewardBtn: cc.Node = null;

    @property(cc.Node)
    linkGameBtn: cc.Node = null;

    @property(cc.Node)
    caveBtn: cc.Node = null;

    @property(cc.Node)
    piecesBtn: cc.Node = null;

    @property(cc.Node)
    arenaHonorBtn: cc.Node = null;

    @property(cc.Node)
    worldHonorBtn: cc.Node = null;

    @property(cc.Node)
    heroGoBackBtn: cc.Node = null;

    @property(cc.Node)
    heroRebirthBtn: cc.Node = null;

    // @property(cc.Node)
    // loginRewardBtn: cc.Node = null;

    @property(cc.Node)
    royalArenaBtn: cc.Node = null;

    @property(cc.Node)
    qiDaysBtn: cc.Node = null;

    @property(cc.Node)
    tradingPortBtn: cc.Node = null;

    @property(cc.Node)
    awakeStarUpBtn: cc.Node = null;

    @property(cc.Node)
    assembleBtn: cc.Node = null;

    @property(WuhunTrialIconCtrl)
    wuhunBtn: WuhunTrialIconCtrl = null;

    @property(cc.Node)
    crossRechargeBtn: cc.Node = null;

    @property(cc.Node)
    treasureBtn: cc.Node = null;

    @property(cc.Node)
    guardianCallRewardBtn: cc.Node = null;

    @property(cc.Node)
    combineBtn: cc.Node = null;

    @property(cc.Node)
    CostumeCustomBtn: cc.Node = null;

    @property(cc.Node)
    sailingBtn: cc.Node = null;

    @property(cc.Node)
    hotelBtn: cc.Node = null;

    @property(cc.Node)
    mysteryBtn: cc.Node = null;

    @property(cc.Node)
    rechargeBtn: cc.Node = null;

    @property(cc.Node)
    dailyRechargeBtn: cc.Node = null;

    @property(cc.Node)
    luckTwistBtn: cc.Node = null;

    @property(cc.Node)
    signBtn: cc.Node = null;

    @property(cc.Node)
    midAutumnBtn: cc.Node = null;

    @property(cc.Node)
    sevenDayWarBtn: cc.Node = null;

    @property(cc.Node)
    loginRewardBtn: cc.Node = null;

    @property(cc.Node)
    restrictionBtn: cc.Node = null;

    @property(cc.Node)
    superValueBtn: cc.Node = null;

    get roleModel() { return ModelManager.get(RoleModel); }
    get championModel() { return ModelManager.get(ChampionModel); }
    get storeModel() { return ModelManager.get(StoreModel); }
    get activityModel() { return ModelManager.get(ActivityModel); }

    info: { node: cc.Node, cfg: MainInterface_mainCfg }[] = []; //所有图标
    iconWorldPos: cc.Vec2;
    curEntranceType: number;
    onLoad() {
        this.info = [];
        this.node.getChildByName('content').children.forEach(icon => {
            let ctrl = icon.getComponent(ActivityIconItemCtrl);
            if (ctrl) {
                let cfg = ConfigManager.getItemById(MainInterface_mainCfg, ctrl.id);
                if (cfg) {
                    this.info.push({ node: icon, cfg: cfg });
                }
            }
        });
    }

    onEnable() {
        let arg = this.args[0];
        this.curEntranceType = arg[0];
        this.iconWorldPos = arg[1];
        this._sortIcon();
        gdk.gui.onViewChanged.on(this._onViewChanged, this);
        gdk.gui.onPopupChanged.on(this._onPopupChanged, this);
        this.node.opacity = 0;
        // gdk.Timer.callLater(this, this.setContetnWidth);
    }

    start() {
        this.setContetnWidth();
    }

    onDisable() {
        gdk.gui.onViewChanged.off(this._onViewChanged, this);
        gdk.gui.onPopupChanged.off(this._onPopupChanged, this);
        let content = cc.find('content', this.node);
        for (let i = 0; i < content.children.length; i++) {
            let n = content.children[i];
            //width height 兼容巅峰之战peakIconCtrl
            if (n.active && n.width !== 0 && n.height !== 0) {
                let newFlag = n.getChildByName('newFlag');
                if (newFlag && newFlag.active) {
                    return;
                }
            }
        }
        gdk.e.emit(ActivityEventId.ACTIVITY_STORAGE_NEW_FALG_HIDE, this.curEntranceType);
    }

    private dtime: number = 0;
    update(dt: number) {
        if (this.dtime >= 1) {
            this.dtime = 0;
            this.setContetnWidth();
        }
        this.dtime += dt;
    }

    setContetnWidth(): number {
        this.node.opacity = 255;
        let num = 0;
        let content = cc.find('content', this.node);
        content.children.forEach(n => {
            //width height 兼容巅峰之战peakIconCtrl
            if (n.active && n.width !== 0 && n.height !== 0) {
                num += 1;
            }
        });
        if (num == 0) {
            this.close();
            gdk.e.emit(ActivityEventId.ACTIVITY_STORAGE_MAIN_ICON_HIDE, this.curEntranceType);
            gdk.gui.showMessage('活动尚未开启');
            return
        }
        content.width = num >= 6 ? 674 : num * 110 + 14;
        //pos
        if (!this.iconWorldPos) return;
        let worldPos = this.iconWorldPos;
        let localPos = gdk.gui.layers.popupLayer.convertToNodeSpaceAR(worldPos);
        let dx = (cc.view.getVisibleSize().width - this.node.getChildByName('content').width) / 2;
        this.node.setPosition(Math.max(-dx, Math.min(localPos.x, dx)), localPos.y - 55);
        //arrow
        let arrowLocalPos = this.node.convertToNodeSpaceAR(worldPos);
        this.node.getChildByName('arrow').x = arrowLocalPos.x;
    }

    _onViewChanged() {
        this.close();
    }

    _onPopupChanged(node: cc.Node) {
        let ctrl = node.getComponent(StorageActViewCtrl);
        if (!ctrl) {
            this.close();
        }
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
    }

    //-------------登录有利-----------//
    onMagicBtnClick() {
        JumpUtils.openMagicView();
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateMagicBtnIconShowOrHide() {
        let sysIds = [2827];
        for (let i = 0; i < sysIds.length; i++) {
            if (JumpUtils.ifSysOpen(sysIds[i])) {
                this.magicBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 20);
                return;
            }
        }
        this.magicBtn.active = false;
    }

    /*---------------锦标赛图标 -----------------------*/
    onChampionBtnClick() {
        let model = ModelManager.get(ChampionModel);
        if (JumpUtils.ifSysOpen(2856)) {
            if (model.infoData) {
                let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, model.infoData.seasonId);
                if (cfg) {
                    JumpUtils.openChampion();
                    return;
                }
            }
        }
        this.championBtn.active = false;
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('championModel.infoData')
    @gdk.binding('championModel.infoData.seasonId')
    _updateChampionBtnIconShowOrHide() {
        if (JumpUtils.ifSysOpen(2856)) {
            let model = this.championModel;
            if (model.infoData && model.infoData.seasonId) {
                if (ActUtil.ifActOpen(122)) {
                    this.championBtn.active = true;
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
                                openTime = TimerUtils.transformDate(cfg.open_time);
                                endTime = TimerUtils.transformDate(cfg.close_time);
                            } else if (cfg.type == 4) {
                                let time = roleModel.CrossOpenTime * 1000;
                                openTime = time + (cfg.open_time[2] * 24 * 60 * 60 + cfg.open_time[3] * 60 * 60 + cfg.open_time[4] * 60) * 1000;
                                endTime = time + (cfg.close_time[2] * 24 * 60 * 60 + cfg.close_time[3] * 60 * 60 + cfg.close_time[4] * 60) * 1000;
                            }
                            if (curTime >= openTime && curTime <= endTime + 24 * 60 * 60 * 1000 * 2) {
                                this.championBtn.active = true;
                                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 21);
                                return;
                            }
                        }

                    }
                }
            }
        }
        this.championBtn.active = false;
    }

    /*---------------冒险日记图标 -----------------------*/
    onDiaryBtnClick() {
        if (!JumpUtils.ifSysOpen(2858)) {
            this.diaryBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.DiaryView);
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateDiaryBtnIconShowOrHide() {
        this.diaryBtn.active = JumpUtils.ifSysOpen(2858);
        if (this.diaryBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 22);
        }
    }

    /*---------------跨服狂欢<跨服寻宝>图标 -----------------------*/
    onAssistGiftBtnClick() {
        if (!JumpUtils.ifSysOpen(2903) || !ResonatingUtils.isShowAssistGift()) {
            this.assistGiftStarBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.AssistStarGiftView);
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('resonatingModel.allianceMaxStar')
    _updateAssistGiftBtnIconShowOrHide() {
        this.assistGiftStarBtn.active = JumpUtils.ifSysOpen(2903) && ResonatingUtils.isShowAssistGift();
        if (this.assistGiftStarBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 33);
        }
    }

    /**------------------------------幸运连连看------------------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding("storeModel.starGiftDatas")
    _updateLinkGameBtnShowOrHide() {
        this.linkGameBtn.active = JumpUtils.ifSysOpen(2910);
        if (this.linkGameBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 36);
        }
    }

    onLinkGameBtnClick() {
        if (!JumpUtils.ifSysOpen(2910)) {
            this.linkGameBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.LinkGameMain);
    }

    /**------------------------------矿洞大冒险------------------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding("storeModel.starGiftDatas")
    _updateCaveBtnShowOrHide() {
        this.caveBtn.active = JumpUtils.ifSysOpen(2911);
        if (this.caveBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 37);
        }
    }

    onCaveBtnClick() {
        if (!JumpUtils.ifSysOpen(2911)) {
            this.caveBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.CaveMain);
    }

    /**------------------自走棋----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updatePiecesBtnShowOrHide() {
        this.piecesBtn.active = JumpUtils.ifSysOpen(2914);
        if (this.piecesBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 39);
        }
    }

    onPiecesBtnClick() {
        if (!JumpUtils.ifSysOpen(2914)) {
            this.piecesBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.PiecesMain);
    }

    /**------------------荣耀巅峰赛----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateArenaHonorBtnShowOrHide() {
        let time = this.roleModel.CrossOpenTime * 1000;

        if (JumpUtils.ifSysOpen(2919)) {
            let temTime = ActUtil.getActStartTime(110);
            if (temTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                this.arenaHonorBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 43);
            } else {
                this.arenaHonorBtn.active = false;
            }
        }
        else {
            this.arenaHonorBtn.active = false;
        }

    }

    onArenaHonorBtnClick() {
        if (!JumpUtils.ifSysOpen(2919)) {
            this.arenaHonorBtn.active = false;
            return;
        }
        let proId = ArenaHonorUtils.getCurProgressId()
        if (proId == 1) {
            gdk.panel.open(PanelId.ArenahonorPosterView);
        } else {
            gdk.panel.open(PanelId.ArenaHonorView);
        }
    }

    /**------------------世界巅峰赛----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateWorldHonorBtnShowOrHide() {
        let time = this.roleModel.CrossOpenTime * 1000;

        if (JumpUtils.ifSysOpen(2921)) {
            let temTime = ActUtil.getActStartTime(112);
            if (temTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                this.worldHonorBtn.active = true;
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
            } else {
                this.worldHonorBtn.active = false;
            }
        }
        else {
            this.worldHonorBtn.active = false;
        }

    }
    onWorldHonorBtnClick() {
        if (!JumpUtils.ifSysOpen(2921)) {
            this.worldHonorBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.WorldHonorView);
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
                    this.activityBtn.active = true;
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
                            this.activityBtn.active = true;
                            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 12);
                            return;
                        }
                    }
                }
            }
            else if (cfg.whether == 1 && JumpUtils.ifSysOpen(cfg.systemid)) {
                this.activityBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 12);
                return;
            }


        }
        this.activityBtn.active = false;
    }

    onActivityBtnClick() {
        let isShow: boolean = false;
        let cfgs = ConfigManager.getItems(MainInterface_sortCfg);
        let openCfg: MainInterface_sortCfg;
        cfgs.sort((a, b) => { return a.sorting - b.sorting; });
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i]
            if (cfg.systemid == 2941) {
                //砍价大礼包
                let model = ModelManager.get(ActivityModel)
                if (JumpUtils.ifSysOpen(cfg.systemid) && model.discountData.length > 0 && !model.discountData[0].bought) {
                    isShow = true;
                    openCfg = cfg;
                    break;
                }
            } else if (cfg.id == 22) {
                if (JumpUtils.ifSysOpen(2915)) {
                    let type = NewAdventureUtils.actRewardType
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
                            isShow = true;
                            openCfg = cfg;
                            break
                        }
                    }
                }
            }
            else if (cfg.whether == 1 && JumpUtils.ifSysOpen(cfg.systemid)) {
                isShow = true;
                openCfg = cfg;
                break;
            }
        }

        if (!isShow) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1"));
            this.activityBtn.active = false;
            return;
        }

        if (JumpUtils.ifSysOpen(openCfg.systemid)) {
            JumpUtils.openActivityMain([openCfg.id]);
            return;
        }
    }

    /**------------------英雄回退----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateHeroGoBackBtnShowOrHide() {
        this.heroGoBackBtn.active = JumpUtils.ifSysOpen(2918);
        if (this.heroGoBackBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 40);
        }
    }

    onHeroGoBackBtnClick() {
        if (!JumpUtils.ifSysOpen(2918)) {
            this.heroGoBackBtn.active = false;
            return;
        }
        gdk.panel.setArgs(PanelId.HeroResetView, 7);
        gdk.panel.open(PanelId.HeroResetView);
    }

    /**------------------英雄重生----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateHeroRebirthBtnShowOrHide() {
        this.heroRebirthBtn.active = JumpUtils.ifSysOpen(2943);
        if (this.heroRebirthBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 46);
        }
    }

    onHeroRebirthBtnClick() {
        if (!JumpUtils.ifSysOpen(2943)) {
            this.heroRebirthBtn.active = false;
            return;
        }
        gdk.panel.setArgs(PanelId.HeroResetView, 9);
        gdk.panel.open(PanelId.HeroResetView);
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

    //-------------皇家竞技场-----------//
    onRoyalArenaBtnClick() {
        gdk.panel.open(PanelId.RoyalArenaView);
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateRoyalArenaBtnIconShowOrHide() {
        if (JumpUtils.ifSysOpen(2954)) {
            this.royalArenaBtn.active = true;
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 53);
            return;
        }
        this.royalArenaBtn.active = false;
    }

    /** 显示或隐藏7天活动的图标*/
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _sevenDaysActivityIconShowOrHide() {
        if (!JumpUtils.ifSysOpen(1800)) {
            //活动过期，隐藏按钮
            this.qiDaysBtn.active = false;
        } else {
            this.qiDaysBtn.active = true;
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 3);
        }
    }

    onSevenDaysBtnClick() {
        if (!JumpUtils.ifSysOpen(1800)) {
            this.qiDaysBtn.active = false;
            gdk.gui.showMessage(gdk.i18n.t("i18n:ADVENTURE_TIP2"));
        }
        else {
            this.qiDaysBtn.active = true;
            gdk.panel.open(PanelId.SevenDays);
        }
    }

    /**贸易港按钮显示/隐藏 */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _tradingPortIconShowOrHide() {
        let cfgs = ConfigManager.getItems(MainInterface_sort_1Cfg);
        for (let i = 0; i < cfgs.length; i++) {
            if (!cfgs[i].hidden && (!cfgs[i].systemid || JumpUtils.ifSysOpen(cfgs[i].systemid))) {
                this.tradingPortBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 7);
                return
            }
        }
        this.tradingPortBtn.active = false;
    }

    onTradingPortBtnClick() {
        gdk.panel.open(PanelId.TradingPort);
    }

    /**------------------专属英雄升星----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('activityModel.awakeStarUpGiftMap')
    _updateAwakeStarUpBtnShowOrHide() {
        this.awakeStarUpBtn.active = JumpUtils.ifSysOpen(2920) && !ActivityUtils.getAwakeStarUpFinish();
        if (this.awakeStarUpBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 41);
        }
    }

    onAwakeStarUpBtnClick() {
        if (!JumpUtils.ifSysOpen(2920) && ActivityUtils.getAwakeStarUpFinish()) {
            this.awakeStarUpBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.AwakeStarUpView);
    }

    /**------------------灵力者集结----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateAssembleBtnShowOrHide() {
        if (JumpUtils.ifSysOpen(2937)) {
            this.assembleBtn.active = true;
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 45);
        } else {
            this.assembleBtn.active = false;
        }
    }
    onAssembleBtnClick() {
        if (!JumpUtils.ifSysOpen(2937)) {
            this.assembleBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.AssembledActivityMainView);
    }

    /**------------------武魂定制----------------------- */
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateWuhunBtnShowOrHide() {
        //this.wuhunBtn.node.active = true;
        this.wuhunBtn._updateNode()
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

    /** 首充按钮显示或隐藏*/
    @gdk.binding("storeModel.firstPayTime")
    _firstPayGiftIconShowOrHide() {
        if (!SdkTool.tool.can_charge || this.storeModel._hasGetFirstPayReward()) {
            // 充值过而且已经领取了奖励，隐藏首充按钮
            this.rechargeBtn.active = false;
        } else {
            // 显示首充按钮
            if (JumpUtils.ifSysOpen(1801, false)) {
                this.rechargeBtn.active = true;
                gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 2);
            }
            else {
                this.rechargeBtn.active = false;
            }
        }
    }

    onFirstPayGiftIconClick() {
        if (!SdkTool.tool.can_charge || !JumpUtils.ifSysOpen(1801)) {
            this.rechargeBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.FirstPayGift);
    }

    //------每日充值------//
    onDailyRechargeBtnClick() {
        if (!SdkTool.tool.can_charge || (!JumpUtils.ifSysOpen(2834) && !this.storeModel.firstPayTime)) {
            this.dailyRechargeBtn.active = false;
            return;
        }
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
                        this.dailyRechargeBtn.active = true;
                        gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 16);
                        return
                    }
                }
                if (JumpUtils.ifSysOpen(2834)) {
                    this.dailyRechargeBtn.active = true;
                    gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 16);
                    return;
                }
            }
        }
        this.dailyRechargeBtn.active = false;
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

    //-----------------------签到-------------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    _updateSignBtnShowOrHide() {
        this.signBtn.active = JumpUtils.ifSysOpen(1200);
        if (this.signBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 54);
            return;
        }
    }

    onSignBtnClick() {
        gdk.panel.open(PanelId.Sign)
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
        // JumpUtils.openActivityMain(1);
        JumpUtils.openCServerActivityMain([20]);
    }

    //-----------------------超值购------------------//
    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('activityModel.superValueInfo')
    _updateSuperValueBtnShowOrHide() {
        this.superValueBtn.active = JumpUtils.ifSysOpen(2961) && !ActivityUtils.checkSuperValueVaild();
        if (this.superValueBtn.active) {
            gdk.e.emit(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, 74);
        }
    }

    onSuperValueBtnClick() {
        if (!JumpUtils.ifSysOpen(2961) || ActivityUtils.checkSuperValueVaild()) {
            this.superValueBtn.active = false;
            return;
        }
        gdk.panel.open(PanelId.SuperValueView);
    }
}
