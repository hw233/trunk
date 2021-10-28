import ActivityModel from '../../act/model/ActivityModel';
import ActUtil from '../../act/util/ActUtil';
import CarnivalUtil from '../../act/util/CarnivalUtil';
import CombineModel from '../../combine/model/CombineModel';
import CombineUtils from '../../combine/util/CombineUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import DoomsDayModel from '../model/DoomsDayModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import InstanceModel, { InstanceData } from '../model/InstanceModel';
import InstanceViewCtrl from './InstanceViewCtrl';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import TrialInfo from '../trial/model/TrialInfo';
import UiListItem from '../../../common/widgets/UiListItem';
import {
    ActivityCfg,
    CopyCfg,
    GlobalCfg,
    SystemCfg,
    VipCfg
    } from '../../../a/config';
import { CopyType } from './../../../common/models/CopyModel';
import { IsLastBossDead } from '../utils/InstanceUtil';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * @Description: 副本子项
 * @Author: jijing.liu
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-26 11:47:03
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/InstanceItemCtrl")
export default class InstanceItemCtrl extends UiListItem {

    @property(cc.Node)
    bg1: cc.Node = null;

    @property(cc.Node)
    bgButton: cc.Node = null;

    // @property(cc.RichText)
    // descLab: cc.RichText = null;

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
    type: cc.Node = null;

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;


    // @property(cc.Sprite)
    // iconDes: cc.Sprite = null;
    // @property(cc.Sprite)
    // iconEnemy: cc.Sprite = null;
    // @property(cc.Node)
    // statuBg: cc.Node = null;

    get model() { return ModelManager.get(InstanceModel) }
    get roleModel() { return ModelManager.get(RoleModel); }
    info: InstanceData = null;
    rewardRed: boolean = false;
    temList: ListView;

    onDisable() {
        GuideUtil.bindGuideNode(1100)
        GuideUtil.bindGuideNode(1101)
        GuideUtil.bindGuideNode(1102)
        GuideUtil.bindGuideNode(1103)
        GuideUtil.bindGuideNode(1106)
        GuideUtil.bindGuideNode(1104)
        GuideUtil.bindGuideNode(1107)
    }

    onDestroy() {
        if (this.temList) {
            this.temList.destroy()
            this.temList = null;
        }
    }

    updateView() {
        this.info = this.data;
        //this.descLab.string = this.info.data.des;

        let isLock = !JumpUtils.ifSysOpen(RedPointUtils.get_copy_open_lv(this.info.data.copy_id), false)
        if (this.info.data.copy_id == CopyType.Guardian && !isLock) {
            isLock = !ModelManager.get(CopyModel).guardianOpen;
        }
        //this.type.active = true
        this.statuLab.node.active = true
        this._updateLockState(isLock)
        let reward: number[][] = []
        switch (this.info.data.copy_id) {
            case CopyType.DoomsDay: {
                // 末日考验
                GuideUtil.bindGuideNode(1102, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou04");
                //GlobalUtil.setSpriteIcon(this.node, this.type, "view/instance/texture/view/qrhd_shizhong");
                let vipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv)
                let vipNum = (vipCfg && cc.js.isNumber(vipCfg.vip7)) ? vipCfg.vip7 : 0
                let freeNum = ConfigManager.getItemByField(GlobalCfg, 'key', 'doomsday_free_sweep').value[0];
                let activityModel = ModelManager.get(ActivityModel);
                let rank = activityModel.roleServerRank ? activityModel.roleServerRank.rank : -1;
                if (rank >= 1 && rank <= 3) {
                    let cServerRankTCfg = CarnivalUtil.getCrossRankConfig(rank);
                    if (cc.js.isNumber(cServerRankTCfg.privilege1)) {
                        freeNum += cServerRankTCfg.privilege1
                    }
                }

                //合服特权
                let combineModel = ModelManager.get(CombineModel)
                let combineRank = combineModel.serverRank ? combineModel.serverRank : -1
                if (ActUtil.ifActOpen(95) && combineRank >= 1 && combineRank <= 3) {
                    let combineRankTCfg = CombineUtils.getCrossRankConfig(combineRank);
                    if (cc.js.isNumber(combineRankTCfg.privilege1)) {
                        freeNum += combineRankTCfg.privilege1
                    }
                }

                let all = 0;
                let cfgs = ConfigManager.getItems(CopyCfg, { 'copy_id': 14 });
                cfgs.forEach(cfg => {
                    let tem = vipNum;
                    if (cfg.subtype >= 46) {
                        tem = 0;
                    }
                    all += cfg.participate + tem + freeNum;
                })
                let useNum = 0;
                let datas = ModelManager.get(DoomsDayModel).doomsDayInfos;
                datas.forEach(data => {
                    useNum += data.num;
                })
                this.statuLab.string = cfgs[0].drop_description//'剩余次数：' + Math.max(0, all - useNum);
                reward = cfgs[0].drop_item;
                break;
            }

            case CopyType.Survival: {
                // 生存副本
                let copyCfg = ConfigManager.getItemByField(CopyCfg, 'copy_id', 2);
                let stateMsg = ModelManager.get(CopyModel).survivalStateMsg;
                let time = Math.floor(stateMsg.endTime - GlobalUtil.getServerTime() / 1000);
                this.statuLab.string = copyCfg.drop_description//`${timeFormat(Math.max(0, time))}后重置`;
                reward = copyCfg.drop_item;
                this.rewardRed = stateMsg.stageId > 0;
                GuideUtil.bindGuideNode(1103, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou02");
                //GlobalUtil.setSpriteIcon(this.node, this.type, "view/instance/texture/view/qrhd_shizhong");
                break;
            }

            case CopyType.Trial: {
                // 无尽的黑暗
                let cfg = ConfigManager.getItemById(GlobalCfg, "tower_sweep_consumption").value
                let model = ModelManager.get(TrialInfo)
                let allNum = cfg[0] + model.buyNum;
                this.statuLab.string = `剩余扫荡次数<color=#00ff00>${allNum - model.raidsNum}</color>`;
                //GuideUtil.bindGuideNode(1104, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou03");
                //GlobalUtil.setSpriteIcon(this.node, this.type, "view/instance/texture/view/fb_ta");
                break;
            }
            case CopyType.Rune: {
                // 符文副本
                let copyCfg = ConfigManager.getItemByField(CopyCfg, 'copy_id', 17);
                this.statuLab.string = copyCfg.drop_description//`剩余扫荡次数<color=#00ff00>${this.model.runeInfo.availableTimes}</color>`;
                GuideUtil.bindGuideNode(1106, this.bgButton);
                reward = copyCfg.drop_item;
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou07");
                //GlobalUtil.setSpriteIcon(this.node, this.type, "view/instance/texture/view/fb_ta");
                break;
            }

            case CopyType.GOD: {
                // 英雄副本
                //let cfg = ConfigManager.getItemById(GlobalCfg, "tower_sweep_consumption").value
                //let model = ModelManager.get(TrialInfo)
                let nums = this.model.heroCopySweepTimes;
                let allNum = 0;
                // nums.forEach(num => {
                //     allNum += Math.max(0, num)
                // })
                // let curW = (new Date(GlobalUtil.getServerTime())).getDay();// 0-6对应为星期日到星期六 
                // let openW = (new Date(GlobalUtil.getServerOpenTime())).getDay();
                var myday = GlobalUtil.getCurWeek();
                let copyCfgs = ConfigManager.getItemsByField(CopyCfg, 'copy_id', 3);
                copyCfgs.forEach((cfg, i) => {
                    let date: Array<number> = cfg.subtype_date[1];
                    if (date.indexOf(myday) != -1 || myday == 0) {
                        allNum += nums[i];
                    }
                })
                reward = copyCfgs[0].drop_item;
                this.statuLab.string = copyCfgs[0].drop_description//`剩余扫荡次数<color=#00ff00>${allNum}</color>`;
                GuideUtil.bindGuideNode(1105, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou06");
                //GlobalUtil.setSpriteIcon(this.node, this.type, "view/instance/texture/view/qrhd_shizhong");
                break;
            }

            case CopyType.Boss: {
                // 正义的反击
                let copyCfg = ConfigManager.getItemByField(CopyCfg, 'copy_id', 4);
                reward = copyCfg.drop_item;
                let bossData = this.model.dunGeonBossJusticeState;
                if (bossData != null) {
                    if (bossData.boss.id == 0) {
                        // 当日的boss未召唤
                        this.statuLab.string = `召唤BOSS`;
                    } else {
                        if (IsLastBossDead(bossData.boss.id, bossData.boss.hp)) {
                            // 当日的boss已经全部击杀
                            this.statuLab.string = `BOSS已全部击杀`;
                        } else {
                            // 获取最新的击杀boss序号
                            let curKillBossId = bossData.boss.id - 1;
                            this.statuLab.string = `已击杀${curKillBossId}个怪物`;
                        }
                    }
                } else {
                    // 没有数据
                    this.statuLab.string = '';
                }
                GuideUtil.bindGuideNode(1100, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou01");
                //GlobalUtil.setSpriteIcon(this.node, this.type, "view/instance/texture/view/zd_xingxitubiao00");
                break;
            }

            case CopyType.RookieCup: {
                // 精英副本
                let prizeList = [];
                let copyModel = ModelManager.get(CopyModel);
                let cfgs = copyModel.eliteNoviceCfgs;
                for (let i = 0; i < cfgs.length; i++) {
                    if (prizeList.indexOf(cfgs[i].prize) == -1) {
                        prizeList.push(cfgs[i].prize);
                    }
                }
                let getNum = 0;
                let totalNum = 0;
                for (let i = 0; i < prizeList.length; i++) {
                    let nums = CopyUtil.getEliteStageCurChaterData(prizeList[i]);
                    if (CopyUtil.isOpenEliteStageChapter(prizeList[i])) {
                        getNum += nums[0];
                        totalNum += nums[1];
                    }
                }
                let copyCfg = ConfigManager.getItemByField(CopyCfg, 'copy_id', 12);
                reward = copyCfg.drop_item;
                this.statuLab.string = copyCfg.drop_description//`已获奖杯<color=#F6FF00>${getNum}/${totalNum}</color>`;
                GuideUtil.bindGuideNode(1101, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou08");
                //GlobalUtil.setSpriteIcon(this.node, this.type, "view/instance/texture/view/fb_bei");
                break;
            }
            case CopyType.EndRuin: {
                // 末日废墟副本
                let copyCfg = ConfigManager.getItemByField(CopyCfg, 'copy_id', 20);
                this.statuLab.string = copyCfg.drop_description//`剩余扫荡次数<color=#00ff00>${this.model.runeInfo.availableTimes}</color>`;
                GuideUtil.bindGuideNode(1104, this.bgButton);
                reward = copyCfg.drop_item;
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou09");
                //GlobalUtil.setSpriteIcon(this.node, this.type, "view/instance/texture/view/fb_ta");
                break;
            }
            case CopyType.Guardian: {
                GuideUtil.bindGuideNode(1107, this.bgButton);
                let copyCfg = ConfigManager.getItemByField(CopyCfg, 'copy_id', 23);
                this.statuLab.string = copyCfg.drop_description
                reward = copyCfg.drop_item;
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou10");
                break;
            }
            case CopyType.Ultimate: {
                let copyCfg = ConfigManager.getItemByField(CopyCfg, 'copy_id', 27);
                this.statuLab.string = copyCfg.drop_description
                reward = copyCfg.drop_item;
                GlobalUtil.setSpriteIcon(this.node, this.icon, "view/instance/texture/icon/fb_rukou12");
                break;
            }
        }
        this.initRewardItem(reward);
        this.updateRedPointState();
    }

    initRewardItem(reward: number[][]) {
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
            let tem = { index: i, typeId: item[0], num: item[1], delayShow: false, effect: false };
            temData.push(tem);
        }
        this.temList.set_data(temData);

    }

    enterInstance() {
        // if (ModelManager.get(InstanceModel).isInstDataCplt) {
        //     if (!JumpUtils.ifSysOpen(RedPointUtils.get_copy_open_lv(this.info.data.copy_id), true)) {
        //         return;
        //     }
        //     this.model.selectInstanceData = this.info;
        //     JumpUtils.openPanel({
        //         panelId: PanelId.InstanceDetail,
        //         panelArgs: { args: this.info },
        //         currId: this.node,
        //     });
        // } else {
        //     gdk.gui.showMessage("正在获取副本数据");
        // }

        if (this.info.data.copy_id == CopyType.Elite) {
            RedPointUtils.save_state("elite_inst_red_point", false)
            this.updateRedPointState()
        }

        let node = gdk.panel.get(PanelId.Instance);
        if (node) {
            let ctrl = node.getComponent(InstanceViewCtrl);
            if (ctrl) {
                ctrl.selectItem(this.info, this.curIndex);
            }
        }
    }

    updateRedPointState() {
        let result = false;
        switch (this.info.data.copy_id) {
            case CopyType.DoomsDay://女神试炼
                result = RedPointUtils.is_doomsDay_show_redPoint(this.info.data.copy_id)
                break;
            case CopyType.Survival://兄贵
                result = RedPointUtils.is_survival_show_redPoint(this.info.data.copy_id)
                break;
            // case CopyType.GOLD_INST://金币
            //     result = RedPointUtils.is_inst_6_can_fight(this.info.data.copy_id);
            //     break;
            case CopyType.GOD://英雄副本
                result = RedPointUtils.is_heroCopyInst_show_redpoint(this.info.data.copy_id)
                break;
            case CopyType.Boss://英雄
                result = RedPointUtils.is_heroInst_show_redpoint(this.info.data.copy_id)
                break;
            case CopyType.Trial://超时空试炼
                result = RedPointUtils.is_spaceInst_show_redpoint(this.info.data.copy_id)
                break;
            case CopyType.Rune://超时空试炼
                result = RedPointUtils.is_runeCopyInst_show_redpoint(this.info.data.copy_id)
                break;
            case CopyType.EndRuin://末日废墟
                result = RedPointUtils.is_EndRuinCopyInst_show_redpoint(this.info.data.copy_id)
                break;
            case CopyType.ChallengeCup:
            case CopyType.RookieCup:
            case CopyType.Elite://精英副本
                result = RedPointUtils.is_eliteInst_show_redpoint(this.info.data.copy_id) || RedPointUtils.is_in_state("elite_inst_red_point")
                break;
            case CopyType.Guardian: //守护者副本
                result = RedPointUtils.has_guardian_copy_raid_times();
                break;
            case CopyType.Ultimate://终极副本
                result = RedPointUtils.has_ultimate_copy_fight();
                break
            default:
                break;
        }
        //return result;
        this.redPoint.active = result
    }

    _checkHangUpRedPoint(copy_id) {
        if (copy_id == CopyType.Survival || copy_id == CopyType.GOD) {
            return this.rewardRed;
        }
        return this.model.instanceHangReward[copy_id];
    }

    // /**精英副本登录红点提示 */
    // _checkEliteInstRedPointTip() {
    //     let prizeList = []
    //     let copyModel = ModelManager.get(CopyModel)
    //     let cfgs = copyModel.eliteStageCfgs
    //     for (let i = 0; i < cfgs.length; i++) {
    //         if (prizeList.indexOf(cfgs[i].prize) == -1) {
    //             prizeList.push(cfgs[i].prize)
    //         }
    //     }
    //     for (let i = 0; i < prizeList.length; i++) {
    //         if (CopyUtil.isOpenEliteStageChapter(prizeList[i]) && CopyUtil.isGetElitePassReward(prizeList[i])) {
    //             if (copyModel.isEliteOpenFirst) {
    //                 RedPointUtils.save_state("elite_inst_red_point", true)
    //                 copyModel.isEliteOpenFirst = false
    //             }
    //             break
    //         }
    //     }
    // }

    timerSetUp: boolean = false;

    _setUpHangTimer() {
        if (this.timerSetUp) {
            return;
        }
        this.timerSetUp = true;
        gdk.Timer.loop(1 * 1000, this, this.hangTimeUpdate);
    }

    _cancelHangTimer() {
        if (!this.timerSetUp) {
            return;
        }
        this.timerSetUp = false;
        gdk.Timer.clear(this, this.hangTimeUpdate);
    }

    hangTimeUpdate() {

    }

    _updateLockState(isLock: boolean) {
        if (isLock) {
            this.type.active = false
            //this.statuLab.node.active = false
            GlobalUtil.setGrayState(this.icon, 1)
            //GlobalUtil.setGrayState(this.iconDes, 1)
            //GlobalUtil.setGrayState(this.iconEnemy, 1)
            //this.statuLab.node.color = cc.color("#ffffff")
            this.lockIcon.active = true
            let id = RedPointUtils.get_copy_open_lv(this.info.data.copy_id)
            let cfg = ConfigManager.getItemById(SystemCfg, id)

            let model = ModelManager.get(RoleModel);
            // 等级达不到要求
            if (model.level < cfg.openLv) {
                this.lockText.string = StringUtils.format(gdk.i18n.t("i18n:INS_LIST_TIP1"), cfg.openLv)//`${cfg.openLv}级开放`
            } else if (cc.js.isNumber(cfg.fbId) && cfg.fbId > 0 && !CopyUtil.isStagePassed(cfg.fbId)) {
                this.lockText.string = StringUtils.format(gdk.i18n.t("i18n:INS_LIST_TIP2"), CopyUtil.getChapterId(cfg.fbId), CopyUtil.getSectionId(cfg.fbId))
                //`通关主线${CopyUtil.getChapterId(cfg.fbId)}-${CopyUtil.getSectionId(cfg.fbId)}开放`;
            } else if (cc.js.isNumber(cfg.activity) && cfg.activity > 0 && !ActUtil.ifActOpen(cfg.activity)) {
                if (this.info.data.copy_id == CopyType.EndRuin) {
                    let actCfg = ConfigManager.getItemByField(ActivityCfg, 'id', cfg.activity);
                    this.lockText.string = StringUtils.format(gdk.i18n.t('i18n:INS_LIST_TIP4'), actCfg.open_time[2] + 1);
                }
                //this.lockText.string = gdk.i18n.t("i18n:INS_LIST_TIP4")
            } else if (this.info.data.copy_id == CopyType.Guardian && !ModelManager.get(CopyModel).guardianOpen) {
                let cfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'guardian_open');
                this.lockText.string = `获得${cfg.value[0]}星英雄时开启`;
            }

        } else {
            GlobalUtil.setGrayState(this.icon, 0)
            //GlobalUtil.setGrayState(this.iconDes, 0)
            //GlobalUtil.setGrayState(this.iconEnemy, 0)
            //this.statuLab.node.color = cc.color("#FFD793")
            this.lockIcon.active = false
            this.lockText.string = ''
        }
    }

}
