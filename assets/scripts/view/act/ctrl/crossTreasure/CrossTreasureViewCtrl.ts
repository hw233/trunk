import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CrossTreasurePrizeItemCtrl from './CrossTreasurePrizeItemCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import {
    ActivityCfg,
    GlobalCfg,
    Operation_treasure_discountCfg,
    Operation_treasure_poolCfg,
    Operation_treasureCfg
    } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-24 11:44:48 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/crossTreasure/CrossTreasureViewCtrl")
export default class CrossTreasureViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    actTimeLab: cc.Label = null;

    @property(cc.Label)
    downTimeLab: cc.Label = null;

    @property(cc.Node)
    leftTurnTips: cc.Node = null;

    @property(cc.Node)
    moneyNode: cc.Node = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    skipAniBtn: cc.Node = null;

    @property(cc.Node)
    treasureBtn1: cc.Node = null;

    @property(cc.Node)
    treasureBtn2: cc.Node = null;

    @property(cc.Node)
    prizeContent: cc.Node = null;

    @property(cc.Prefab)
    prizeItemPrefab: cc.Prefab = null;

    @property(cc.ScrollView)
    recordScrollView: cc.ScrollView = null;

    @property(cc.Node)
    recordContent: cc.Node = null;

    @property(cc.Node)
    recordItem: cc.Node = null;

    @property(cc.Node)
    spRewardSpine: cc.Node = null;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    actId: number = 86;
    actCfg: ActivityCfg;
    isSkipAni: boolean;
    totalPrizeNum: number; //总奖品数量
    preSelect: number; // 上次抽奖停留的id
    clickTime: number = 0;
    inAni: boolean = false; //是否抽奖动画中
    resetLimit: number = 0; //轮次上限
    onEnable() {
        let startTime = new Date(ActUtil.getActStartTime(this.actId));
        let endTime = new Date(ActUtil.getActEndTime(this.actId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.actTimeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            this.close();
            return;
        }
        else {
            if (!this.actModel.cTreasureCurTurn) {
                NetManager.send(new icmsg.CrossTreasureStateReq());
                gdk.gui.showMessage('活动数据正在初始化，请稍作等待');
                this.close();
                return;
            }
            this.actTimeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            this.actCfg = ActUtil.getCfgByActId(this.actId);
            this.resetLimit = ConfigManager.getItemByField(Operation_treasureCfg, 'reward_type', this.actCfg.reward_type, { round: this.actModel.cTreasureCurTurn }).reset_limit;
            this.isSkipAni = GlobalUtil.getLocal('cTreasureSkipAni', true) || false;
            this.skipAniBtn.getChildByName('sub_gou').active = this.isSkipAni;
        }
        NetManager.on(icmsg.CrossTreasureStateRsp.MsgType, (resp: icmsg.CrossTreasureStateRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            if (resp.round <= 0) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:GUILDBOSS_TIP8'));
                gdk.panel.hide(PanelId.CServerActivityMainView);
                return;
            }
            this._updateView();
            //resetTime
            this.unscheduleAllCallbacks();
            this._updateDownTime();
            this.schedule(this._updateDownTime, 1);
        }, this);
        //info
        NetManager.send(new icmsg.CrossTreasureStateReq());
        //日志
        NetManager.send(new icmsg.CrossTreasureRecordListReq(), () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateRecord();
        }, this);
        //订阅
        let req = new icmsg.SystemSubscribeReq();
        req.topicId = 5;
        req.cancel = false;
        NetManager.send(req);
        //数量信息广播
        gdk.e.on(ActivityEventId.ACTIVITY_CROSS_TREASURE_INFO_UPDATE, this._updateView, this);
        //money
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateMoney, this);
    }

    onDisable() {
        let req = new icmsg.SystemSubscribeReq();
        req.topicId = 5;
        req.cancel = true;
        NetManager.send(req);
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
    }

    onSkipAniBtnClick() {
        if (this.inAni) return;
        this.isSkipAni = GlobalUtil.getLocal('cTreasureSkipAni', true) || false;
        this.isSkipAni = !this.isSkipAni;
        GlobalUtil.setLocal('cTreasureSkipAni', this.isSkipAni, true);
        this.skipAniBtn.getChildByName('sub_gou').active = this.isSkipAni;
    }

    onTreasureBtnClick(e, data) {
        let dt = this.isSkipAni ? 800 : 2000;
        if (GlobalUtil.getServerTime() - this.clickTime < dt) return;
        let n = parseInt(data);
        let infos = this.actModel.cTreasureItemNum || [];
        let leftPrize = this.totalPrizeNum;
        infos.forEach(info => {
            leftPrize -= info;
        });
        n = Math.min(n, leftPrize);
        let discount = this._getDiscount();
        let c = ConfigManager.getItemByField(GlobalCfg, 'key', 'treasure_cost');
        let [itemId, singleCost] = [c.value[0], c.value[1]];
        if (n !== 1 || this.actModel.cTreasureHasFreeTime <= 0) {
            if (BagUtils.getItemNumById(itemId) < this._getNTimesDrawCost(n)) {
                gdk.gui.showMessage(`${BagUtils.getConfigById(itemId).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`);
                return;
            }
        }
        if (this.actModel.cTreasureDayTurn == this.resetLimit && leftPrize == 0) {
            gdk.gui.showMessage('今日奖池已被全部抽取');
            return;
        }
        let cb = () => {
            this.clickTime = GlobalUtil.getServerTime();
            this.inAni = !this.isSkipAni;
            let req = new icmsg.CrossTreasureReq();
            req.num = n;
            NetManager.send(req, async (resp: icmsg.CrossTreasureRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                if (this.isSkipAni) {
                    let goods = [];
                    resp.rewards.forEach(r => { goods = goods.concat(r.rewards); });
                    GlobalUtil.openRewadrView(goods);
                    if (this.preSelect) {
                        let n = this.prizeContent.children[this.preSelect - 1];
                        if (n) {
                            let ctrl = n.getComponent(CrossTreasurePrizeItemCtrl);
                            ctrl.updateSelect(false);
                        }
                    }
                    this.preSelect = resp.rewards[0].order;
                    let n = this.prizeContent.children[this.preSelect - 1];
                    if (n) {
                        let ctrl = n.getComponent(CrossTreasurePrizeItemCtrl);
                        ctrl.updateSelect(true);
                    }
                    NetManager.send(new icmsg.CrossTreasureStateReq);
                }
                else {
                    let poolCfg = ConfigManager.getItemByField(Operation_treasureCfg, 'reward_type', this.actCfg.reward_type, { round: this.actModel.cTreasureCurTurn });
                    let poolId = poolCfg.pool;
                    let prizeCfgs = ConfigManager.getItemsByField(Operation_treasure_poolCfg, 'pool', poolId);
                    let list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    prizeCfgs.forEach((c, idx) => {
                        if (this.actModel.cTreasureItemNum[idx] && c.amount <= this.actModel.cTreasureItemNum[idx]) {
                            let idx = list.indexOf(c.order);
                            if (idx !== -1) {
                                list.splice(idx, 1);
                            }
                        }
                    });
                    await this.realPlayAni(list, resp.rewards[0].order);
                    this.inAni = false;
                    NetManager.send(new icmsg.CrossTreasureStateReq);
                    let goods = [];
                    resp.rewards.forEach(r => { goods = goods.concat(r.rewards); });
                    GlobalUtil.openRewadrView(goods);
                }
            }, this);
        }

        if (n > 1 && n < 10) {
            GlobalUtil.openAskPanel({
                descText: StringUtils.format(gdk.i18n.t('i18n:CROSS_TREASURE_TIP1'), leftPrize, n * discount[1], BagUtils.getConfigById(itemId).name, leftPrize),
                sureCb: cb
            });
        }
        else {
            cb();
        }
    }

    onRecordBtnClick() {
        gdk.panel.open(PanelId.CrossTreasureRecordView);
    }

    async realPlayAni(list: number[], target: number) {
        return new Promise(async (resolve, reject) => {
            await this._playAni(list, 400, 20);
            await this._playAni(list, 300, 100);
            await this._playAni(list, 800, 200);
            list = [target];
            await this._playAni(list, 1, 1, target);
            this.inAni = false;
            resolve(true);
        })
    }

    /**
     * 
     * @param list 
     * @param duration 持续时间
     * @param speed 速度
     */
    async _playAni(list: number[], duration: number, speed: number, target?: number) {
        return new Promise(async (resolve, reject) => {
            let t = 0;
            let tempList = [...list];
            while (t < duration) {
                if (this.preSelect) {
                    let idx = tempList.indexOf(this.preSelect);
                    tempList.splice(idx, 1);
                    if (tempList.length <= 0) tempList = [...list];
                }
                this.preSelect = this.randomAni(tempList);
                await this.waitFor(speed);
                t += speed;
                if (target) {
                    if (this.preSelect && this.preSelect == target) {
                        resolve(true);
                        break;
                    }
                }
            }
            resolve(true);
        });
    }

    async waitFor(t: number) {
        return new Promise((resolve, reject) => {
            gdk.Timer.once(t, this, () => { resolve(true); })
        });
    }

    /**
     * 随机动画
     * @param randomList   idx[1-9]
     */
    randomAni(randomList: number[]): number {
        if (this.preSelect) {
            let n = this.prizeContent.children[this.preSelect - 1];
            if (n) {
                let ctrl = n.getComponent(CrossTreasurePrizeItemCtrl);
                ctrl.updateSelect(false);
            }
        }
        let newId = randomList[Math.floor(Math.random() * randomList.length)];
        // let idx = this.preSelect ? randomList.indexOf(this.preSelect) : -1;
        // let newId = idx + 1 < randomList.length ? randomList[idx + 1] : randomList[0];
        let n = this.prizeContent.children[newId - 1];
        if (n) {
            let ctrl = n.getComponent(CrossTreasurePrizeItemCtrl);
            ctrl.updateSelect(true);
        }
        return newId;
    }

    _updateView() {
        this._updatePrize();
        this._updateMoney();
        this._updateCost();
        this._updateProgress();
        this._updateRecord();
        this._updateLeftTurn();
    }

    _updatePrize() {
        if (this.inAni) return;
        let poolCfg = ConfigManager.getItemByField(Operation_treasureCfg, 'reward_type', this.actCfg.reward_type, { round: this.actModel.cTreasureCurTurn });
        let poolId = poolCfg.pool;
        this.totalPrizeNum = 0;
        let prizeCfgs = ConfigManager.getItemsByField(Operation_treasure_poolCfg, 'pool', poolId);
        prizeCfgs.forEach((cfg, idx) => {
            this.totalPrizeNum += cfg.amount;
            let n = this.prizeContent.children[idx];
            if (!n) {
                n = cc.instantiate(this.prizeItemPrefab);
                n.parent = this.prizeContent;
            }
            let ctrl = n.getComponent(CrossTreasurePrizeItemCtrl);
            ctrl.updateView(cfg, this.actModel.cTreasureItemNum[idx] || 0);
        });
        this.spRewardSpine.active = this.actModel.cTreasureRefreshTime <= 0;
    }

    //leftMoney
    _updateMoney() {
        let itemId = ConfigManager.getItemByField(GlobalCfg, 'key', 'treasure_cost').value[0];
        GlobalUtil.setSpriteIcon(this.node, cc.find('icon', this.moneyNode), GlobalUtil.getIconById(itemId) + '_s');
        cc.find('num', this.moneyNode).getComponent(cc.Label).string = BagUtils.getItemNumById(itemId) + '';
    }

    //costBtn
    _updateCost() {
        if (this.inAni) return;
        let c = ConfigManager.getItemByField(GlobalCfg, 'key', 'treasure_cost');
        let [itemId, singleCost] = [c.value[0], c.value[1]];
        [this.treasureBtn1, this.treasureBtn2].forEach((n, idx) => {
            let icon = cc.find('cost/layout/icon', n);
            let num = cc.find('num', icon).getComponent(cc.Label);
            GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(itemId));
            let discount = this._getDiscount();
            let discountLab = cc.find('layout/discount', n).getComponent(cc.Label);
            discountLab.node.parent.active = discount[0] !== 1;
            if (discount[0] < 1) {
                discountLab.string = `${discount[0] * 10}`
            }
            if (idx == 0) {
                num.string = discount[1] + '';
                let freeTip = cc.find('freeTip', n);
                freeTip.active = this.actModel.cTreasureHasFreeTime > 0;
            }
            else {
                let n = 10
                let infos = this.actModel.cTreasureItemNum || [];
                let leftPrize = this.totalPrizeNum;
                infos.forEach(info => {
                    leftPrize -= info;
                });
                n = Math.min(n, leftPrize);
                num.string = this._getNTimesDrawCost(n) + '';
            }
        });
    }

    //probar
    _updateProgress() {
        if (this.inAni) return;
        this.progressNode.active = this.actModel.cTreasureRefreshTime <= 0;
        if (this.progressNode.active) {
            let num = cc.find('num', this.progressNode).getComponent(cc.Label);
            let infos = this.actModel.cTreasureItemNum || [];
            let n = 0;
            infos.forEach(info => {
                n += info;
            });
            num.string = `${this.totalPrizeNum - n}`;
        }
    }

    //record
    _updateRecord() {
        if (this.inAni) return;
        this.recordContent.removeAllChildren();
        let record = this.actModel.cTreasureRecord;
        for (let i = 0; i < record.length; i++) {
            let r = record[i];
            if (r && r.type == 1) {
                let item = cc.instantiate(this.recordItem);
                item.parent = this.recordContent;
                item.active = true;
                item.getComponent(cc.RichText).string = `<outline color=#5F361E width=2><color=#A3B929>${r.playerName}</c><color=#94674c>${gdk.i18n.t('i18n:CROSS_TREASURE_TIP6')}</c><color=#d9ac1e>${BagUtils.getConfigById(r.itemId).name}</c></outline>`;
            }
            if (this.recordContent.children.length >= 3) {
                return;
            }
        }
    }

    _updateLeftTurn() {
        let tips = this.leftTurnTips.getChildByName('tips');
        let num = this.leftTurnTips.getChildByName('num');
        let url = ['view/act/texture/crossTreasure/kfxb_shengyu', 'view/act/texture/crossTreasure/kfxb_zuihou'];
        let left = this.resetLimit - this.actModel.cTreasureDayTurn;
        GlobalUtil.setSpriteIcon(this.node, num, `view/act/texture/crossTreasure/kfxb_${left + 1}`);
        GlobalUtil.setSpriteIcon(this.node, tips, url[left == 0 ? 1 : 0]);
    }

    //resetTime
    _updateDownTime() {
        this.downTimeLab.node.active = this.actModel.cTreasureRefreshTime > 0;
        if (this.downTimeLab.node.active) {
            let leftTime;
            let now = GlobalUtil.getServerTime();
            if (this.actModel.cTreasureDayTurn < this.resetLimit) {
                leftTime = Math.max(0, this.actModel.cTreasureRefreshTime * 1000 - now);
                if (leftTime <= 0) {
                    this.actModel.cTreasureRefreshTime = 0;
                    this.actModel.cTreasureItemNum = [];
                    this.actModel.cTreasureOrderName = {};
                    this._updatePrize();
                    this._updateProgress();
                    this._updateCost();
                }
            }
            else {
                let zeroTime = TimerUtils.getTomZerohour(now / 1000);
                leftTime = Math.max(0, zeroTime * 1000 - now);
            }
            this.downTimeLab.string = TimerUtils.format6(leftTime / 1000) + gdk.i18n.t('i18n:CROSS_TREASURE_TIP3');
        }
        // else {
        //     // this.unscheduleAllCallbacks();
        // }
    }

    /**根据全服抽奖数 返回折扣 */
    _getDiscount() {
        let infos = this.actModel.cTreasureItemNum || [];
        let drawNum = 0;
        infos.forEach(info => {
            drawNum += info;
        });
        let nextDraw = drawNum + 1;
        let cfgs = ConfigManager.getItemsByField(Operation_treasure_discountCfg, 'reward_type', this.actCfg.reward_type);
        for (let i = 0; i < cfgs.length; i++) {
            let nums = cfgs[i].num;
            if (nums[0] <= nextDraw && nextDraw <= nums[1]) {
                return [cfgs[i].discount / 100, cfgs[i].cost[1]];
            }
            if (i == cfgs.length - 1) {
                return [cfgs[i].discount / 100, cfgs[i].cost[1]];
            }
        }
    }

    /**获取n连抽的真实消耗 */
    _getNTimesDrawCost(n: number) {
        let d = this._getDiscount();
        if (d[0] >= 1) return d[1] * n;
        let infos = this.actModel.cTreasureItemNum || [];
        let drawNum = 0;
        infos.forEach(info => {
            drawNum += info;
        });
        let nextOneDraw = drawNum + 1;
        let nextTenDraw = drawNum + n;
        let cfgs = ConfigManager.getItemsByField(Operation_treasure_discountCfg, 'reward_type', this.actCfg.reward_type);
        let oneCfg: Operation_treasure_discountCfg;
        let tenCfg: Operation_treasure_discountCfg;
        for (let i = 0; i < cfgs.length; i++) {
            if (nextOneDraw >= cfgs[i].num[0] && nextOneDraw <= cfgs[i].num[1]) {
                oneCfg = cfgs[i];
            }
            if (nextTenDraw >= cfgs[i].num[0] && nextTenDraw <= cfgs[i].num[1]) {
                tenCfg = cfgs[i];
            }
            if (!!oneCfg && !!tenCfg) break;
        }
        if (oneCfg.discount == tenCfg.discount) {
            return oneCfg.cost[1] * n;
        }
        else {
            return oneCfg.cost[1] * (tenCfg.num[0] - nextOneDraw) + tenCfg.cost[1] * (nextTenDraw + 1 - tenCfg.num[0]);
        }
    }
}
