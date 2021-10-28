import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import InstanceModel, { InstanceData } from '../model/InstanceModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import StoreViewCtrl, { StoreBaseScoreTabType } from '../../store/ctrl/StoreViewCtrl';
import StringUtils from '../../../common/utils/StringUtils';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { Copysurvival_drop_showCfg, Copysurvival_stageCfg } from '../../../a/config';
import { InstanceEventId, InstanceID } from '../enum/InstanceEnumDef';
import { timeFormat } from '../utils/InstanceUtil';

/** 
 * @Description: 新生存训练 
 * @Author: luoyong
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-30 16:10:30
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/InstanceSurvivalViewCtrl")
export default class InstanceSurvivalViewCtrl extends gdk.BasePanel {

    // @property(cc.Label)
    // hangLab: cc.Label = null;
    @property(gdk.List)
    rewardList: gdk.List = null;
    @property(gdk.List)
    rewardList2: gdk.List = null;

    @property(cc.Node)
    redNode: cc.Node = null;
    @property(cc.Sprite)
    bgSp: cc.Sprite = null;
    @property(cc.Label)
    subTypeLb: cc.Label = null;
    @property(cc.Node)
    overSp: cc.Node = null;
    @property(sp.Skeleton)
    overSpine: sp.Skeleton = null;

    @property(cc.Node)
    saodangBtn: cc.Node = null;
    @property(cc.Label)
    saodangLb: cc.Label = null;

    @property(cc.Node)
    rewardRedNode: cc.Node = null;

    instanceId: number = -1;    // 副本id

    get model(): InstanceModel { return ModelManager.get(InstanceModel); }
    get storeModel() { return ModelManager.get(StoreModel); }
    get copyModel() { return ModelManager.get(CopyModel); }
    get roleModel() { return ModelManager.get(RoleModel); }


    allSort: number = 0;

    onEnable() {
        // 外部参数初始化
        let info: InstanceData = this.args[0];
        this.instanceId = info.data.copy_id;
        this.redNode.active = false;
        let stateMsg = this.copyModel.survivalStateMsg;
        if (!stateMsg || stateMsg.endTime == 0) {
            NetManager.send(new icmsg.SurvivalStateReq());
        }
        gdk.e.on(InstanceEventId.SURVIVAL_SUBTYPE_REFRESH, this.updateCurStageInfo, this);
        this.overSpine.node.active = this.copyModel.survivalIsOver;
        if (this.copyModel.survivalIsOver) {
            //播放动画
            this.copyModel.survivalIsOver = false;
            this.overSp.active = false;
            let t = this.overSpine.setAnimation(0, 'stand', false);
            if (t) {
                this.overSpine.setCompleteListener((trackEntry, loopCount) => {
                    let name = trackEntry.animation ? trackEntry.animation.name : '';
                    if (name === "stand") {
                        this.overSp.active = true;
                    }
                })
            }
        } else if (stateMsg) {
            this.overSp.active = stateMsg.stageId == 0;
        }
    }

    onDisable() {
        gdk.e.targetOff(this)
    }
    // 打开副本规则介绍界面
    openStageDesTip() {
        if (this.instanceId == InstanceID.BRO_INST) {
            gdk.panel.setArgs(PanelId.HelpTipsPanel, 4);
            gdk.panel.open(PanelId.HelpTipsPanel);
        } else if (this.instanceId == InstanceID.GOD_INST) {
            gdk.panel.setArgs(PanelId.HelpTipsPanel, 3);
            gdk.panel.open(PanelId.HelpTipsPanel);
        }
    }

    onFightFunc() {
        let stagetId = this.copyModel.survivalStateMsg.stageId;
        if (stagetId == 0) {
            // 已经通过，不能再继续
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_SURVIVAL_TIP2"));
            return;
        }
        let state = false;//!this.copyModel.survivalStateMsg.select;
        if (!this.copyModel.survivalStateMsg.select && this.copyModel.survivalStateMsg.passTimes > 0) {
            if (JumpUtils.ifSysOpen(717, false)) {
                state = true;
            }
        }
        if (state) {
            gdk.panel.open(PanelId.SurvivalSubTypeSetView);
        } else {
            this.model.survivalEnterCopy = true;
            JumpUtils.openInstance(stagetId);
        }

    }

    @gdk.binding("copyModel.survivalStateMsg")
    updateCurStageInfo() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this.copyModel.survivalStateMsg) return;
        let stateMsg = this.copyModel.survivalStateMsg;
        let stageId = stateMsg.stageId;
        //设置背景图

        let path = 'view/instance/texture/bg/fb_survival'
        if (stateMsg.subType == 1) {
            path = 'view/instance/texture/bg/fb_survival1'
        }
        GlobalUtil.setSpriteIcon(this.node, this.bgSp, path);

        //扫荡按钮
        this.saodangBtn.active = false;
        this.saodangLb.node.active = false;

        // let state = false;//!this.copyModel.survivalStateMsg.select;
        // if (!this.copyModel.survivalStateMsg.select && this.copyModel.survivalStateMsg.passTimes > 0) {
        //     if (JumpUtils.ifSysOpen(717, false)) {
        //         state = true;
        //     }
        // }

        let temNum = this.copyModel.survivalStateMsg.diffTimes
        if (stateMsg.subType == 1 && temNum > 0) {
            this.saodangBtn.active = true;
            this.saodangLb.string = StringUtils.format(gdk.i18n.t("i18n:INS_SURVIVAL_TIP5"), temNum)
            if (stageId == 0) {
                GlobalUtil.setGrayState(this.saodangBtn, 1);
                if (temNum < 6) {
                    this.saodangLb.node.active = true;
                }
            } else {
                //let cfg = ConfigManager.getItemById(Copysurvival_stageCfg, stageId);
                if (temNum >= 6) {
                    GlobalUtil.setGrayState(this.saodangBtn, 0);
                } else {
                    GlobalUtil.setGrayState(this.saodangBtn, 1);
                    this.saodangLb.node.active = true;
                    //this.saodangLb.string = StringUtils.format(gdk.i18n.t("i18n:INS_SURVIVAL_TIP5"), temNum)//`通关6次困难解锁(${temNum}/6)`
                }
            }
        }

        // 掉落预览奖励
        let type = 100 + stateMsg.subType
        let items = ConfigManager.getItems(Copysurvival_drop_showCfg, (item: Copysurvival_drop_showCfg) => {
            let tem = Math.floor(item.stage_id / 10000);
            if (tem == type) {
                return true;
            }
            return false;
        });
        // 挂机最高通关关卡
        let index = 0;
        this.allSort = items.length;
        if (stageId <= 0) {
            // 已经通关了，奖励预览列表显示第一关的奖励
            this.rewardList.datas = items[0].drop_show;
            index = items.length
        }
        let arr: number[][] = [];
        //let drops = ConfigManager.getItems(Copysurvival_dropCfg);
        //let dropsAdd = ConfigManager.getItemByField(Copysurvival_drop_addCfg, 'lv', stateMsg.avgHeroLv);
        items.some((cfg, i) => {
            if (cfg.stage_id == stageId) {
                this.rewardList.datas = cfg.drop_show;
                return true;
            }
            let tem1 = Math.floor(cfg.stage_id / 10000);
            let tem2 = Math.floor(stageId / 10000);
            if (tem1 == tem2) {
                index++;
            }
            return false;
        });
        let temData = [];
        stateMsg.totalRewards.forEach(data => {
            temData.push([data.typeId, data.num])
        })
        temData.forEach(d => {
            let exist = arr.some(a => {
                if (a[0] == d[0]) {
                    a[1] += d[1];
                    return true;
                }
                return false;
            });
            if (!exist) {
                arr.push([d[0], d[1]]);
            }
        });

        this.subTypeLb.string = stateMsg.subType == 0 ? gdk.i18n.t("i18n:INS_SURVIVAL_TIP3") : gdk.i18n.t("i18n:INS_SURVIVAL_TIP4")
        this.rewardList2.datas = arr;
        this.title = `(${index}/${items.length})`;

        this.redNode.active = stageId > 0 && !this.model.survivalEnterCopy
        this.rewardRedNode.parent.active = JumpUtils.ifSysOpen(2960)
        this.rewardRedNode.active = this.copyModel.survivalStateMsg.merRewards.length > 0
    }

    openJifenStore() {
        //JumpUtils.openScoreStore([2])
        JumpUtils.openPanel({
            panelId: PanelId.Store,
            currId: gdk.gui.getCurrentView(),
            callback: (node: cc.Node) => {
                let comp = node.getComponent(StoreViewCtrl)
                comp.menuBtnSelect(null, 0)
                comp.typeBtnSelect(null, StoreBaseScoreTabType.Survival)
            }
        })
    }

    openHireReward() {
        gdk.panel.open(PanelId.InstanceSurvivalHireReward)
    }

    saodangBtnClick() {
        let stateMsg = this.copyModel.survivalStateMsg;
        let stageId = stateMsg.stageId;
        if (stateMsg.subType == 1) {
            this.saodangBtn.active = true;
            if (stageId == 0 && stateMsg.diffTimes >= 6) {
                let model = ModelManager.get(CopyModel);
                let stateMsg = model.survivalStateMsg;
                let time = Math.floor(stateMsg.endTime - GlobalUtil.getServerTime() / 1000);
                //this.resetTime.string = `${timeFormat(Math.max(0, time))}`;
                let str = StringUtils.format(gdk.i18n.t("i18n:INS_SURVIVAL_TIP6"), timeFormat(Math.max(0, time)))
                gdk.gui.showMessage(str)
            } else if (stateMsg.diffTimes >= 6) {
                let cfg = ConfigManager.getItemById(Copysurvival_stageCfg, stageId);
                let info: AskInfoType = {
                    title: ``,
                    sureCb: () => {
                        let msg = new icmsg.SurvivalRaidReq()
                        NetManager.send(msg, (rsp: icmsg.SurvivalRaidRsp) => {
                            this.copyModel.survivalStateMsg.stageId = 0;
                            this.copyModel.survivalIsOver = true;
                            stateMsg.totalRewards = stateMsg.totalRewards.concat(rsp.rewards)
                            GlobalUtil.openRewadrView(rsp.rewards);
                            gdk.e.emit(InstanceEventId.SURVIVAL_SUBTYPE_REFRESH)
                        })
                    },
                    descText: StringUtils.format(gdk.i18n.t("i18n:INS_SURVIVAL_TIP7"), cfg.sort, this.allSort),//`扫荡将获得生存训练困难难度下第${cfg.sort}波-第${this.allSort}波的全部奖励`,
                    thisArg: this,
                }
                GlobalUtil.openAskPanel(info)

            }
        }
    }

}

