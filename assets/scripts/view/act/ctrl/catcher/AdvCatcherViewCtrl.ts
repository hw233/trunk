import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import AdventureUtils from '../../../adventure/utils/AdventureUtils';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { GlobalCfg, Luckydraw_optionalCfg, Luckydraw_summonCfg } from '../../../../a/config';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
import { RewardType } from '../../../../common/widgets/TaskRewardCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-19 10:59:59 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/catcher/AdvCatcherViewCtrl")
export default class AdvCatcherViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    btn1: cc.Node = null;

    @property(cc.Node)
    btn2: cc.Node = null;

    @property(cc.Node)
    moneyNode: cc.Node = null;

    @property(cc.Label)
    leftDiamondTime: cc.Label = null;

    @property(cc.Node)
    storeNode: cc.Node = null;

    @property(cc.Node)
    optionalNode: cc.Node = null;

    @property(cc.Node)
    guideSpine: cc.Node = null;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }
    activityId: number = 56;
    specialFlyInfo: any = {};
    onEnable() {
        this.guideSpine.active = false;
        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            this.close();
            return;
        }
        else {
            this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }

        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateView, this);
        NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateView, this);
        gdk.Timer.callLater(this, () => {
            if (cc.isValid(this.node)) {
                let node = this.node.getChildByName('content').getChildByName('storeBtn');
                let pos = node.parent.convertToWorldSpaceAR(node.getPosition());
                this.specialFlyInfo = {
                    100084: pos
                };
            }
        })
        this.storeNode.active = ActUtil.ifActOpen(56)
        AdventureUtils.setGuideStep(210017)
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    onOptionalBtnClick() {
        gdk.panel.open(PanelId.AdvCatcherSelectView);
    }

    onStoreBtnClick() {
        gdk.panel.open(PanelId.AdventureStoreView);
    }

    onWeightBtnClick() {
        gdk.panel.open(PanelId.AdvCatcherWeightView);
    }

    onBtn1Click() {
        if (!ActUtil.getCfgByActId(this.activityId)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        let cfg = ConfigManager.getItemByField(Luckydraw_optionalCfg, 'optional', this.actModel.advLuckyOptionalId);
        if (!cfg) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_EGG_TIP13"));
            this.guideSpine.active = true;
            gdk.Timer.clearAll(this);
            gdk.Timer.once(2000, this, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.guideSpine.active = false;
            })
            return;
        }
        let stCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'summon_times').value;
        let drawCostCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'summon_consumption').value;
        let freeTCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'summon_free').value;
        let drawItemNum = BagUtils.getItemNumById(drawCostCfg[0]);
        let diamond = BagUtils.getItemNumById(stCfg[1]);
        if (this.actModel.advLuckyDrawFreeTimes < freeTCfg[0]) {
            let req = new icmsg.LuckyDrawSummonReq();
            req.times = 1;
            NetManager.send(req, (resp: icmsg.LuckyDrawSummonRsp) => {
                GlobalUtil.openRewadrView(resp.list, RewardType.NORMAL, this.specialFlyInfo);
                ModelManager.get(ActivityModel).advLuckyDrawFreeTimes += 1;
            }, this);
        }
        else if (drawItemNum >= drawCostCfg[1] || this.actModel.advLuckyDrawDiamondTimes >= stCfg[0]) {
            if (drawItemNum >= drawCostCfg[1]) {
                let req = new icmsg.LuckyDrawSummonReq();
                req.times = 1;
                NetManager.send(req, (resp: icmsg.LuckyDrawSummonRsp) => {
                    GlobalUtil.openRewadrView(resp.list, RewardType.NORMAL, this.specialFlyInfo);
                }, this);
            }
            else {
                GlobalUtil.openAskPanel({
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    descText: `${BagUtils.getConfigById(drawCostCfg[0]).name}` + gdk.i18n.t("i18n:ACT_CATCHER_TIP1"),
                    sureText: gdk.i18n.t("i18n:ACT_CATCHER_TIP2"),
                    sureCb: () => {
                        JumpUtils.openActivityMain(10);
                    }
                });
            }
        }
        else {
            if (diamond >= stCfg[2]) {
                let cb = () => {
                    let req = new icmsg.LuckyDrawSummonReq();
                    req.times = 1;
                    NetManager.send(req, (resp: icmsg.LuckyDrawSummonRsp) => {
                        GlobalUtil.openRewadrView(resp.list, RewardType.NORMAL, this.specialFlyInfo);
                        ModelManager.get(ActivityModel).advLuckyDrawDiamondTimes += 1;
                    }, this);
                }
                let transV = ConfigManager.getItemByField(GlobalCfg, 'key', 'proportion').value;
                GlobalUtil.openAskPanel({
                    descText: `是否使用<color=#00ff00>${stCfg[2]}</c>钻石(拥有:<color=#00ff00>${diamond}</c>)<br/>购买<color=#00ff00>${stCfg[2] / transV[0] * transV[1]}英雄经验(</c>同时附赠<color=#00ff00>${1}</c>次抓取)`,
                    sureCb: cb
                })
            }
            else {
                GlobalUtil.openAskPanel({
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    descText: gdk.i18n.t("i18n:ACT_CATCHER_TIP3"),
                    sureText: gdk.i18n.t("i18n:OK"),
                    sureCb: () => {
                        gdk.panel.hide(PanelId.ActivityMainView);
                        JumpUtils.openRechargeView([3])
                    }
                });
            }
        }
    }

    onBtn2Click() {
        if (!ActUtil.getCfgByActId(this.activityId)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        let cfg = ConfigManager.getItemByField(Luckydraw_optionalCfg, 'optional', this.actModel.advLuckyOptionalId);
        if (!cfg) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_EGG_TIP13"));
            this.guideSpine.active = true;
            gdk.Timer.clearAll(this);
            gdk.Timer.once(2000, this, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.guideSpine.active = false;
            })
            return;
        }
        let stCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'summon_times').value;
        let drawCostCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'summon_consumption').value;
        let drawItemNum = BagUtils.getItemNumById(drawCostCfg[0]);
        let diamond = BagUtils.getItemNumById(stCfg[1]);
        if (drawItemNum >= drawCostCfg[1] * 10 || (stCfg[0] - this.actModel.advLuckyDrawDiamondTimes < 10)) {
            if (drawItemNum >= drawCostCfg[1] * 10) {
                let req = new icmsg.LuckyDrawSummonReq();
                req.times = 10;
                NetManager.send(req, (resp: icmsg.LuckyDrawSummonRsp) => {
                    GlobalUtil.openRewadrView(resp.list, RewardType.NORMAL, this.specialFlyInfo);
                }, this);
            }
            else {
                GlobalUtil.openAskPanel({
                    title: "提示",
                    descText: `${BagUtils.getConfigById(drawCostCfg[0]).name}不足,可从奇趣商城购买获得,是否前往购买?`,
                    sureText: "前往商城",
                    sureCb: () => {
                        JumpUtils.openActivityMain(10);
                    }
                });
            }
        }
        else {
            if (diamond >= stCfg[2] * 10) {
                let cb = () => {
                    let req = new icmsg.LuckyDrawSummonReq();
                    req.times = 10;
                    NetManager.send(req, (resp: icmsg.LuckyDrawSummonRsp) => {
                        GlobalUtil.openRewadrView(resp.list, RewardType.NORMAL, this.specialFlyInfo);
                        ModelManager.get(ActivityModel).advLuckyDrawDiamondTimes += 10;
                    }, this);
                }
                let transV = ConfigManager.getItemByField(GlobalCfg, 'key', 'proportion').value;
                GlobalUtil.openAskPanel({
                    descText: `是否使用<color=#00ff00>${stCfg[2] * 10}</c>钻石(拥有:<color=#00ff00>${diamond}</c>)<br/>购买<color=#00ff00>${stCfg[2] / transV[0] * transV[1] * 10}英雄经验</c>(同时附赠<color=#00ff00>${10}</c>次抓取)`,
                    sureCb: cb
                })
            }
            else {
                GlobalUtil.openAskPanel({
                    title: "提示",
                    descText: `您的钻石不足,是否前往购买?`,
                    sureText: "确定",
                    sureCb: () => {
                        gdk.panel.hide(PanelId.ActivityMainView);
                        JumpUtils.openRechargeView([3])
                    }
                });
            }
        }
    }

    @gdk.binding('actModel.advLuckyDrawDiamondTimes')
    @gdk.binding('actModel.advLuckyDrawFreeTimes')
    _updateView() {
        if (!ActUtil.getCfgByActId(this.activityId)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        this._updateBtnState();
        this._updateMoney();
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    @gdk.binding('actModel.advLuckyOptionalId')
    _updateOptional() {
        let id = this.actModel.advLuckyOptionalId;
        let cfg = ConfigManager.getItemByField(Luckydraw_optionalCfg, 'optional', id);
        let slot = this.optionalNode.getChildByName('UiSlotItem');
        slot.active = !!cfg;
        if (slot.active) {
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(cfg.reward[0], 1);
        }
        this._updateReward();
    }

    _updateReward() {
        let actCfg = ActUtil.getCfgByActId(this.activityId);
        let summonCfgs = ConfigManager.getItemsByField(Luckydraw_summonCfg, 'reward_type', actCfg.reward_type);
        this.content.removeAllChildren();
        summonCfgs.forEach(cfg => {
            if (cfg.reward_show && cfg.reward_show.length > 0) {
                let rewards = [];
                let c = ConfigManager.getItemByField(Luckydraw_optionalCfg, 'optional', this.actModel.advLuckyOptionalId);
                if (c) { rewards.push([c.reward[0], 1]); };
                rewards = rewards.concat(cfg.reward_show);
                rewards.forEach(reward => {
                    let slot = cc.instantiate(this.itemPrefab);
                    slot.parent = this.content;
                    slot.setScale(.8);
                    let ctrl = slot.getComponent(UiSlotItem);
                    ctrl.updateItemInfo(reward[0], reward[1]);
                    ctrl.itemInfo = {
                        series: null,
                        itemId: reward[0],
                        itemNum: reward[1],
                        type: BagUtils.getItemTypeById(reward[0]),
                        extInfo: null
                    }
                })
            }
        });
        if (summonCfgs.length > 5) {
            this.scrollView.enabled = true;
            this.scrollView.node.width = 522;
            this.scrollView.scrollToTopLeft();
        }
        else {
            this.scrollView.enabled = false;
            this.scrollView.node.width = this.content.width;
        }
    }

    _updateBtnState() {
        let stCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'summon_times').value;
        let drawCostCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'summon_consumption').value;
        let freeTCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'summon_free').value;
        let c = { 1: { color: '#ffffff', outline: '#1C0000' }, 2: { color: "#ffa78f", outline: "#b91314" } };
        let drawItemNum = BagUtils.getItemNumById(drawCostCfg[0]);
        let diamond = BagUtils.getItemNumById(stCfg[1]);
        let nodes = [this.btn1, this.btn2];
        nodes.forEach((node, idx) => {
            let redPoint = node.getChildByName('RedPoint');
            let costIcon = node.getChildByName('cost').getChildByName('icon');
            let costLab = node.getChildByName('cost').getChildByName('lab').getComponent(cc.Label);
            let timeTips = node.getChildByName('timeTip');
            if (idx == 0) {
                //单抽
                if (this.actModel.advLuckyDrawFreeTimes < freeTCfg[0]) {
                    //免费
                    costIcon.active = false;
                    costLab.string = '免费';
                    costLab.node.color = cc.color().fromHEX(c[1].color);
                    costLab.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(c[1].outline);
                    redPoint.active = true;
                    GlobalUtil.setSpriteIcon(this.node, timeTips, `view/adventure/texture/others/xyfp_anniutxt01`);
                }
                else if (drawItemNum >= drawCostCfg[1] || this.actModel.advLuckyDrawDiamondTimes >= stCfg[0]) {
                    //抽奖券数量满足 or 当日钻石抽奖次数已达上限
                    costIcon.active = true;
                    GlobalUtil.setSpriteIcon(this.node, costIcon, GlobalUtil.getIconById(drawCostCfg[0]));
                    redPoint.active = false;
                    costLab.string = drawCostCfg[1] + '';
                    let colorInfo = drawItemNum >= drawCostCfg[1] ? c[1] : c[2];
                    costLab.node.color = cc.color().fromHEX(colorInfo.color);
                    costLab.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(colorInfo.outline);
                    GlobalUtil.setSpriteIcon(this.node, timeTips, `view/adventure/texture/others/xyfp_anniutxt02`);
                }
                else {
                    //钻石抽奖
                    costIcon.active = true;
                    GlobalUtil.setSpriteIcon(this.node, costIcon, GlobalUtil.getIconById(stCfg[1]));
                    redPoint.active = false;
                    costLab.string = stCfg[2] + '';
                    let colorInfo = diamond >= stCfg[2] ? c[1] : c[2];
                    costLab.node.color = cc.color().fromHEX(colorInfo.color);
                    costLab.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(colorInfo.outline);
                    GlobalUtil.setSpriteIcon(this.node, timeTips, `view/adventure/texture/others/xyfp_anniutxt02`);
                }
            }
            else {
                //十连
                if (drawItemNum >= drawCostCfg[1] * 10 || (stCfg[0] - this.actModel.advLuckyDrawDiamondTimes < 10)) {
                    //抽奖券数量满足 or 当日钻石剩余抽奖次数不足十连
                    costIcon.active = true;
                    GlobalUtil.setSpriteIcon(this.node, costIcon, GlobalUtil.getIconById(drawCostCfg[0]));
                    redPoint.active = drawItemNum >= drawCostCfg[1] * 10;
                    costLab.string = drawCostCfg[1] * 10 + '';
                    let colorInfo = drawItemNum >= drawCostCfg[1] * 10 ? c[1] : c[2];
                    costLab.node.color = cc.color().fromHEX(colorInfo.color);
                    costLab.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(colorInfo.outline);
                    GlobalUtil.setSpriteIcon(this.node, timeTips, `view/adventure/texture/others/xyfp_anniutxt02`);
                }
                else {
                    //钻石抽奖
                    costIcon.active = true;
                    GlobalUtil.setSpriteIcon(this.node, costIcon, GlobalUtil.getIconById(stCfg[1]));
                    // redPoint.active = diamond >= stCfg[2] * 10;
                    redPoint.active = false;
                    costLab.string = stCfg[2] * 10 + '';
                    let colorInfo = diamond >= stCfg[2] * 10 ? c[1] : c[2];
                    costLab.node.color = cc.color().fromHEX(colorInfo.color);
                    costLab.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(colorInfo.outline);
                    GlobalUtil.setSpriteIcon(this.node, timeTips, `view/adventure/texture/others/xyfp_anniutxt02`);
                }
            }
        });
        this.leftDiamondTime.string = `钻石抓取剩余次数:${stCfg[0] - this.actModel.advLuckyDrawDiamondTimes}/${stCfg[0]}`;
    }

    _updateMoney() {
        let ids = [2, 100083];
        let nodes = [this.moneyNode.getChildByName('money1'), this.moneyNode.getChildByName('money2')];
        nodes.forEach((node, idx) => {
            let icon = node.getChildByName('icon');
            let lab = node.getChildByName('lab').getComponent(cc.Label);
            let id = ids[idx];
            GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(id));
            lab.string = BagUtils.getItemNumById(id) + '';
        });
    }
}
