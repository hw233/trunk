import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId } from '../../../../common/models/CopyModel';
import GlobalUtil, { CommonNumColor } from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardItem from '../../../../common/widgets/RewardItem';
import RoleModel from '../../../../common/models/RoleModel';
import SdkTool from '../../../../sdk/SdkTool';
import StoreModel from '../../../store/model/StoreModel';
import {
    Copy_stageCfg,
    QuickcombatCfg,
    TavernCfg,
    TipsCfg
    } from '../../../../a/config';
import { ListView } from '../../../../common/widgets/UiListview';
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/RaidsRewardViewCtrl2")

export default class RaidsRewardViewCtrl2 extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    rewardItemPreb: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    sweepBtn: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.RichText)
    tip1: cc.RichText = null;

    @property(cc.Label)
    tip2: cc.Label = null;

    @property(cc.Node)
    avtiveBtn: cc.Node = null;

    list: ListView;
    rewards: icmsg.GoodsInfo[];
    stageId: number;

    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onLoad() {
        gdk.e.on(CopyEventId.RSP_COPY_MAIN_RAIDS, this.reshData, this)
    }

    onEnable() {
        this.copyModel.isOpenedQuickFightView = true;
        this.initListView();
    }

    onDisable() {
        this.content.removeAllChildren();
    }

    onDestroy() {
        gdk.e.targetOff(this);
    }

    initListView() {
        this.content.removeAllChildren();
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
                n.parent = this.content;
                // 更新图标
                let c = n.getComponent(RewardItem);
                c.data = {
                    typeId: rewards[i],
                    num: 1,
                    dropAddNum: GlobalUtil.getDropAddNum(cfg, rewards[i])
                };
                c.updateView();
            }
        }
    }

    @gdk.binding("copyModel.quickFightFreeTimes")
    @gdk.binding("copyModel.quickFightPayTimes")
    @gdk.binding("copyModel.quickFightPayedTime")
    _updateTips() {
        let freeTimes = this.copyModel.quickFightFreeTimes;
        let payTimes = this.copyModel.quickFightPayTimes;
        let costNode = cc.find('layout/cost', this.sweepBtn);
        let costNum = cc.find('num', costNode).getComponent(cc.Label);
        let btnLabel = cc.find('layout/label', this.sweepBtn).getComponent(cc.Label);
        let leftTimeNode = cc.find('layout', this.tipsNode);
        let tips = cc.find('tips', this.tipsNode).getComponent(cc.Label);
        if (freeTimes > 0) {
            costNode.active = false;
            leftTimeNode.active = false;
            btnLabel.string = '快速作战';
            tips.string = '本次免费';
        }
        else {
            leftTimeNode.active = true
            tips.string = '今日剩余:';
            leftTimeNode.getChildByName('num').getComponent(cc.Label).string = Math.max(0, payTimes) + '';
            if (payTimes == 0) {
                costNode.active = false;
                btnLabel.string = '获取更多次数';
                // 不显示充值按钮
                if (!SdkTool.tool.can_charge) {
                    this.sweepBtn.active = false
                }
            }
            else {
                // let totalTimes = ConfigManager.getItemByField(Quickcombat_globalCfg, 'key', 'pay_sweep').value[0]
                // let data = this.storeModel.getMonthCardInfo(500003)
                // if (data && data.time > GlobalUtil.getServerTime() / 1000) {
                //     totalTimes += ConfigManager.getItemByField(Quickcombat_globalCfg, 'key', 'quick_combat_pay').value[0]
                // }
                // let buyTimes = totalTimes - payTimes + 1
                // if (buyTimes > ConfigManager.getItems(QuickcombatCfg).length - 1) {
                //     buyTimes = ConfigManager.getItems(QuickcombatCfg).length - 1
                // }
                // if (buyTimes <= 0) {
                //     buyTimes = 1
                // }
                let buyTimes = this.copyModel.quickFightPayedTime + 1;
                if (buyTimes > ConfigManager.getItems(QuickcombatCfg).length) {
                    buyTimes = ConfigManager.getItems(QuickcombatCfg).length
                }
                let cost = ConfigManager.getItemById(QuickcombatCfg, buyTimes).consumption[1]
                costNum.string = `${cost}`;
                costNode.active = true;
                btnLabel.string = '快速作战';
                costNum.node.color = cc.color("#FFE1B9")
                if (this.roleModel.gems < cost) {
                    costNum.node.color = CommonNumColor.red
                }
            }
        }
        this._updateMonthCardInfo()
    }


    _updateMonthCardInfo() {
        let tipCfg = ConfigManager.getItemById(TipsCfg, 20)
        this.tip1.string = tipCfg.desc21

        let data = this.storeModel.getMonthCardInfo(500003)
        let nowTime = GlobalUtil.getServerTime() / 1000;
        if (data && data.time - nowTime > 0) {
            this.tip2.string = `(特权已激活)`
            this.tip2.node.color = CommonNumColor.green
            this.avtiveBtn.active = false
        } else {
            this.tip2.string = `(特权未激活)`
            this.tip2.node.color = CommonNumColor.red
            this.avtiveBtn.active = true
        }

        // 不显示充值按钮
        if (!SdkTool.tool.can_charge) {
            this.avtiveBtn.active = false
        }
    }

    reshData(e: gdk.Event) {
        e.data.rewards.sort((a, b) => {
            return a.typeId - b.typeId;
        });
        GlobalUtil.openRewadrView(e.data.rewards);
    }

    /**
     * 再次扫荡
     */
    ReSetRaidClick() {
        if (this.copyModel.quickFightFreeTimes == 0 && this.copyModel.quickFightPayTimes == 0) {
            let data = this.storeModel.getMonthCardInfo(500003)
            let nowTime = GlobalUtil.getServerTime() / 1000;
            if (data && data.time > nowTime) {
                GlobalUtil.showMessageAndSound(`已达到购买次数上限`)
                return
            }
            this.close();
            JumpUtils.openRechargeView([0])
            // gdk.panel.setArgs(PanelId.MonthCard, 2)
            // gdk.panel.open(PanelId.MonthCard)
            return;
        }
        let cfg = ConfigManager.getItemById(Copy_stageCfg, this.copyModel.hangStageId);
        let getNum = cfg.wipe_drop[3];
        if (getNum) {
            let limit = ConfigManager.getItemById(TavernCfg, 1).max_task[1];
            let has = BagUtils.getItemNumById(16) || 0;
            if (getNum + has > limit) {
                GlobalUtil.openAskPanel({
                    descText: `当前已有<color=#5EE015>${has}/${limit}</c>悬赏情报,领取后超出上限部分将损失,是否确认领取?`,
                    sureCb: () => {
                        let msg = new icmsg.DungeonRaidsReq();
                        msg.stageId = this.copyModel.hangStageId;
                        NetManager.send(msg, () => {
                            let model = ModelManager.get(CopyModel);
                            if (model.quickFightFreeTimes > 0) {
                                model.quickFightFreeTimes -= 1;
                            }
                            else {
                                model.quickFightPayTimes -= 1;
                                model.quickFightPayedTime += 1;
                            }
                        });
                    },
                    closeText: '前往悬赏',
                    closeCb: () => {
                        JumpUtils.openTavern();
                        this.close();
                    }
                })
                return;
            }
        }

        let msg = new icmsg.DungeonRaidsReq();
        msg.stageId = this.copyModel.hangStageId;
        NetManager.send(msg, () => {
            let model = ModelManager.get(CopyModel);
            if (model.quickFightFreeTimes > 0) {
                model.quickFightFreeTimes -= 1;
            }
            else {
                model.quickFightPayTimes -= 1;
                model.quickFightPayedTime += 1;
            }
        });
    }

    onActivityBtnClick() {
        gdk.panel.hide(PanelId.RaidReward2)
        JumpUtils.openRechargeView([0])
    }
}

