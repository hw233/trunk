import ActUtil from '../../act/util/ActUtil';
import ArenaHonorUtils from '../../arenahonor/utils/ArenaHonorUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Arenahonor_progressCfg, System_crosslistCfg, SystemCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';




/**
 * @Description: 跨服活动列表Item
 * @Author: yaozu.hu
 * @Date: 2021-01-22 17:19:33
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-29 14:56:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/crossActList/CrossActListItemCtrl")
export default class CrossActListItemCtrl extends UiListItem {

    @property(cc.Node)
    bgButton: cc.Node = null;

    @property(cc.Label)
    statuLab: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Node)
    lockIcon: cc.Node = null;

    @property(cc.Label)
    lockText: cc.Label = null;

    @property(cc.Node)
    tiemNode: cc.Node = null;

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;

    temList: ListView;
    info: System_crosslistCfg;
    lock: boolean = false;
    starTime: number = 0;
    refTime: number = 0;
    updateView() {
        this.info = this.data.cfg;
        this.lock = this.data.lock;
        let reward: number[] = []
        switch (this.info.system) {
            case 2861: {
                //GuideUtil.bindGuideNode(1102, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/crossactlist/texture/view/kfhd_zhanzhengyiji");
                NetManager.send(new icmsg.RelicQueryRewardsReq(), () => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    this.updateRedPointState();
                }, this);
                break;
            }
            case 2863: {
                //GuideUtil.bindGuideNode(1102, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/crossactlist/texture/view/kfhd_diantangzhihuiguan");
                break;
            }
            case 2868: {
                //GuideUtil.bindGuideNode(1102, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/crossactlist/texture/view/kfhd_kuafukuanghuan");
                break;
            }
            case 2877: {
                //GuideUtil.bindGuideNode(1102, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/crossactlist/texture/view/kfhd_zuduijingjichang");
                break;
            }
            case 2884: {
                //GuideUtil.bindGuideNode(1102, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/crossactlist/texture/view/kfhd_dianfengzhizhan");
                break;
            }
            case 2898: {
                //GuideUtil.bindGuideNode(1102, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/crossactlist/texture/view/kfhd_hushimijing");
                break;
            }
            case 2924: {
                //GuideUtil.bindGuideNode(1102, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/crossactlist/texture/view/kfhd_rongyaodianfengsai");
                break;
            }
        }
        reward = this.info.rewards_show;
        this.statuLab.string = this.info.time_show
        this.initRewardItem(reward);
        this.updateRedPointState();
        this._updateLockState(this.lock)
        this._updatTimeLab();
    }
    onDestroy() {
        if (this.temList) {
            this.temList.destroy()
            this.temList = null;
        }
        this.unscheduleAllCallbacks();
        NetManager.targetOff(this);
    }
    update(dt: number) {
        if (this.lock && this.starTime > 0) {
            this.refTime -= dt;
            if (this.refTime <= 0) {
                let nowTime = GlobalUtil.getServerTime();
                if (nowTime < this.starTime) {
                    let time1 = TimerUtils.format5((this.starTime - nowTime) / 1000)
                    this.lockText.string = gdk.i18n.t("i18n:CROSSACTLIST_TIP1") + time1
                    this.refTime = 1;
                } else {
                    this.data.lock = false;
                    this.updateView()
                }
            }
        }
    }

    initRewardItem(reward: number[]) {
        if (!this.temList) {
            this.temList = new ListView({
                scrollview: this.scroll,
                mask: this.scroll.node,
                content: this.content,
                item_tpl: this.rewardItem,
                async: true,
                row: 1,
                gap_x: 5,
                gap_y: 0,
                direction: ListViewDir.Horizontal,
            });
        }
        let temData = []
        for (let i = 0; i < reward.length; i++) {
            // typeId: xxx, num: xxx, delayShow: xxx, effect: xxx
            let item = reward[i];
            let tem = { index: i, typeId: item, num: 1, delayShow: false, effect: false };
            temData.push(tem);
        }
        this.temList.set_data(temData);

    }

    enterInstance() {
        if (this.lock) return;
        switch (this.info.system) {
            case 2861: {
                JumpUtils.openPanel({
                    panelId: PanelId.RelicMainView,
                    currId: gdk.gui.getCurrentView()
                })
                break;
            }
            case 2863: {
                JumpUtils.openPanel({
                    panelId: PanelId.VaultEnterView,
                    currId: gdk.gui.getCurrentView()
                })
                break;
            }
            case 2868: {
                JumpUtils.openPanel({
                    panelId: PanelId.CServerActivityMainView,
                    currId: gdk.gui.getCurrentView()
                })
                break;
            }
            case 2877: {
                JumpUtils.openPanel({
                    panelId: PanelId.ArenaTeamView,
                    currId: gdk.gui.getCurrentView()
                })
                break;
            }
            case 2884: {
                JumpUtils.openPanel({
                    panelId: PanelId.PeakView,
                    currId: gdk.gui.getCurrentView()
                })
                break;
            }
            case 2898: {
                JumpUtils.openPanel({
                    panelId: PanelId.GuardianTower,
                    currId: gdk.gui.getCurrentView()
                })
                break;
            }
            case 2924: {

                JumpUtils.openPanel({
                    panelId: PanelId.HonorListView,
                    currId: gdk.gui.getCurrentView()
                })
                break;
                // let proId = ArenaHonorUtils.getCurProgressId()
                // if (proId == 1) {
                //     JumpUtils.openPanel({
                //         panelId: PanelId.ArenahonorPosterView,
                //         currId: gdk.gui.getCurrentView()
                //     })
                // } else {
                //     JumpUtils.openPanel({
                //         panelId: PanelId.ArenaHonorView,
                //         currId: gdk.gui.getCurrentView()
                //     })
                // }

                break;
            }
        }
    }

    updateRedPointState() {
        let result = false;
        switch (this.info.system) {
            case 2861:
                result = RedPointUtils.is_relic_point_update() || RedPointUtils.has_relic_energy_point() || RedPointUtils.has_relic_reward()
                    || RedPointUtils.has_relic_pass_port_reward() || RedPointUtils.has_relic_task_reward(1) || RedPointUtils.has_relic_task_reward(2)
                break;
            case 2863:
                result = RedPointUtils.is_vault_show_redPoint()
                break;
            case 2868:
                result = RedPointUtils.has_cServer_rank_reward() || RedPointUtils.has_cServer_task_reward() || RedPointUtils.has_cross_treasure_free_times();
                break;
            case 2877:
                result = RedPointUtils.is_ArenaTeam_show_redpoint(true)
                break;
            case 2884:
                result = RedPointUtils.is_peak_show_redPoint()
                break;
            case 2898:
                result = RedPointUtils.is_guardianTower_rain_redpoint()
            case 2919:
                result = RedPointUtils.is_ArenaHonor_show_redPoint()
                break;
            case 2924:
                result = RedPointUtils.is_WorldHonor_show_redPoint()
                break;
        }
        this.redPoint.active = result
    }

    _updateLockState(isLock: boolean) {
        if (isLock) {
            GlobalUtil.setGrayState(this.icon, 1)
            this.lockIcon.active = true
            let cfg = ConfigManager.getItemById(SystemCfg, this.info.system)
            let model = ModelManager.get(RoleModel);
            // 等级达不到要求
            if (model.level < cfg.openLv) {
                this.lockText.string = StringUtils.format(gdk.i18n.t("i18n:INS_LIST_TIP1"), cfg.openLv)//`${cfg.openLv}级开放`
            } else if (cc.js.isNumber(cfg.fbId) && cfg.fbId > 0 && !CopyUtil.isStagePassed(cfg.fbId)) {
                this.lockText.string = StringUtils.format(gdk.i18n.t("i18n:INS_LIST_TIP2"), CopyUtil.getChapterId(cfg.fbId), CopyUtil.getSectionId(cfg.fbId))
            }
            else {
                if (this.info.system == 2877) {
                    let startTime = ActUtil.getNextActStartTime(76);
                    let nowTime = GlobalUtil.getServerTime();
                    if (startTime && nowTime < startTime) {
                        this.starTime = startTime;
                        let time1 = TimerUtils.format5((startTime - nowTime) / 1000)
                        this.lockText.string = gdk.i18n.t("i18n:CROSSACTLIST_TIP1") + time1
                        this.refTime = 1;
                    }
                } else if (this.info.system == 2898) {
                    let num = HeroUtils.getHerosByStar(cfg.heroStar[0]);
                    if (num.length >= cfg.heroStar[1]) {
                        let startTime = ActUtil.getNextActStartTime(cfg.activity);
                        let nowTime = GlobalUtil.getServerTime();
                        if (startTime && nowTime < startTime) {
                            this.starTime = startTime;
                            let time1 = TimerUtils.format5((startTime - nowTime) / 1000)
                            this.lockText.string = gdk.i18n.t("i18n:CROSSACTLIST_TIP1") + time1
                            this.refTime = 1;
                        }
                    } else {
                        this.lockText.string = StringUtils.format(gdk.i18n.t("i18n:CROSSACTLIST_TIP2"), cfg.heroStar[0])
                    }

                } else if (this.info.system == 2919) {
                    let roleModel = ModelManager.get(RoleModel);
                    let time = roleModel.CrossOpenTime * 1000;
                    let nowTime = GlobalUtil.getServerTime();
                    let temTime = ActUtil.getActStartTime(110);
                    if (temTime) {
                        this.lockText.string = gdk.i18n.t("i18n:CROSSACTLIST_TIP3")
                    } else {
                        if (nowTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                            if (cc.js.isNumber(cfg.activity) && cfg.activity > 0 && !ActUtil.ifActOpen(cfg.activity)) {
                                //this.lockText.string = "活动2天后开启";
                                let startTime = ActUtil.getNextActStartTime(cfg.activity);
                                let nowTime = GlobalUtil.getServerTime();
                                if (startTime && nowTime < startTime) {
                                    this.starTime = startTime;
                                    let time1 = TimerUtils.format5((startTime - nowTime) / 1000)
                                    this.lockText.string = gdk.i18n.t("i18n:CROSSACTLIST_TIP1") + time1
                                    this.refTime = 1;
                                }
                            }
                        } else {
                            this.lockText.string = gdk.i18n.t("i18n:CROSSACTLIST_TIP3")
                        }
                    }


                }
                else {
                    if (cc.js.isNumber(cfg.activity) && cfg.activity > 0 && !ActUtil.ifActOpen(cfg.activity)) {
                        //this.lockText.string = "活动2天后开启";
                        let startTime = ActUtil.getNextActStartTime(cfg.activity);
                        let nowTime = GlobalUtil.getServerTime();
                        if (startTime && nowTime < startTime) {
                            this.starTime = startTime;
                            let time1 = TimerUtils.format5((startTime - nowTime) / 1000)
                            this.lockText.string = gdk.i18n.t("i18n:CROSSACTLIST_TIP1") + time1
                            this.refTime = 1;
                        }
                    }
                }
            }
        } else {
            GlobalUtil.setGrayState(this.icon, 0)
            this.lockIcon.active = false
            this.lockText.string = ''
        }
    }

    _updatTimeLab() {
        this.tiemNode.active = !this.lock && [2877, 2884, 2919].indexOf(this.info.system) !== -1;
        if (this.tiemNode.active) {
            switch (this.info.system) {
                case 2877:
                    this._updateArenaTeamTime();
                    this.schedule(this._updateArenaTeamTime, 1);
                    break;
                case 2884:
                    this.tiemNode.getChildByName('timeLab').color = cc.color().fromHEX('#00FF12');
                    this._updatePeakViewTime();
                    this.schedule(this._updatePeakViewTime, 1);
                    break;
                case 2919:
                    this.tiemNode.getChildByName('timeLab').color = cc.color().fromHEX('#00FF12');
                    this._updateArenaHonorTime();
                    this.schedule(this._updateArenaHonorTime, 1);
                    break;
                default:
                    break;
            }
        }
    }

    _updateArenaTeamTime() {
        if (!this.tiemNode.active) return;
        let actId = [76, 77, 78];
        let strs = ['组队期', '对战期', '休战期'];
        let colors = ['#00FF12', '#00FF12', '#31DBFF']
        let lab = this.tiemNode.getChildByName('timeLab').getComponent(cc.Label);
        for (let i = 0; i < actId.length; i++) {
            let endTime = ActUtil.getActEndTime(actId[i]);
            if (endTime) {
                let leftTime = endTime - GlobalUtil.getServerTime();
                if (leftTime >= 0) {
                    lab.string = `${strs[i]}:${TimerUtils.format9(leftTime / 1000)}`;
                    lab.node.color = cc.color().fromHEX(colors[i]);
                    return;
                }
            }
        }
        lab.string = `已结束`;
        this.unscheduleAllCallbacks();
    }

    _updatePeakViewTime() {
        if (!this.tiemNode.active) return;
        let endTime = ActUtil.getActEndTime(84);
        let leftTime = endTime - GlobalUtil.getServerTime();
        let lab = this.tiemNode.getChildByName('timeLab').getComponent(cc.Label);
        if (leftTime <= 0) {
            lab.string = `已结束`;
            this.unscheduleAllCallbacks();
        }
        else {
            lab.string = `对战期:${TimerUtils.format9(leftTime / 1000)}`;
        }
    }
    _updateArenaHonorTime() {
        if (!this.tiemNode.active) return;
        let proId = ArenaHonorUtils.getCurProgressId()
        let lab = this.tiemNode.getChildByName('timeLab').getComponent(cc.Label);
        if (!proId) {
            lab.string = `已结束`;
            this.unscheduleAllCallbacks();
        }
        else {
            let cfg = ConfigManager.getItemById(Arenahonor_progressCfg, proId)
            lab.string = '进行中:' + cfg.subject_name
        }
    }
}
