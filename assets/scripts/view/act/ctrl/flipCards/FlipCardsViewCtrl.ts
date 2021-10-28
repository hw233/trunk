import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
    ActivityCfg,
    GlobalCfg,
    Operation_best_showCfg,
    Operation_bestCfg,
    Operation_globalCfg
    } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-05 15:06:24 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/flipCards/FlipCardsViewCtrl")
export default class FlipCardsViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    spRewardNode: cc.Node = null;

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Node)
    nextTurnNode: cc.Node = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    cardsNode: cc.Node = null;

    @property(cc.Node)
    slotsNode: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    @property(cc.Node)
    turnPreviewNode: cc.Node = null;

    @property(cc.Node)
    guideSpine: cc.Node = null;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    activityId: number = 46;
    tween: cc.Tween[] = [];
    acttivityCfg: ActivityCfg;
    flipTimeStamp: number;
    curRewardType: number;
    maxTurn: number;
    respGoodsInfo: icmsg.GoodsInfo[] = [];
    onEnable() {
        this.guideSpine.active = false;
        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            this.acttivityCfg = ActUtil.getCfgByActId(this.activityId);
            this.curRewardType = this.acttivityCfg.reward_type;
            let allCfgs = ConfigManager.getItemsByField(Operation_bestCfg, 'reward_type', this.curRewardType);
            this.maxTurn = 0;
            allCfgs.forEach(c => {
                this.maxTurn += c.limit;
            });
            this._initStyle();
            this._initTurnPreviewNode();
            this._updateCostNode();
            NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCostNode, this);
            NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateCostNode, this);
        }
    }

    onDisable() {
        for (let i = 0; i < this.tween.length; i++) {
            this.tween[i].stop();
        }
        this.turnPreviewNode.children.forEach(n => { n.stopAllActions(); });
        this.tween = [];
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    checkRewardType() {
        let cfg = ActUtil.getCfgByActId(this.activityId);
        if (!cfg || cfg.reward_type != this.curRewardType) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_TIME_UPDATE"));
            gdk.panel.hide(PanelId.ActivityMainView);
            return false;
        }
        return true;
    }

    onRewardPreviewBtnClick() {
        gdk.panel.open(PanelId.FlipCardsPreview);
    }

    openSlectSpRewardView() {
        if (!this.checkRewardType()) {
            return;
        }
        if (this.actModel.flipCardRecived) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_FLIPCARD_TIP8"));
        }
        else {
            gdk.panel.open(PanelId.FlipCardsSelectView);
        }
    }

    onCostAddBtnClick() {
        JumpUtils.openActivityMain(6);
    }

    onNextTurnBtnClick() {
        if (!ActUtil.ifActOpen(46)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        if (!this.checkRewardType()) {
            return;
        }
        let req = new icmsg.FlipCardNextTurnReq();
        NetManager.send(req, (resp: icmsg.FlipCardNextTurnRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._playPreviewRewardAni();
        }, this);
    }

    onHelpBtnClick() {
        gdk.panel.open(PanelId.FlipCardsHelpView);
    }

    /**翻牌 */
    onCardClick(e: cc.Event.EventTouch) {
        if (!ActUtil.ifActOpen(46)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        let now = Date.now();
        if (now - this.flipTimeStamp < 0) {
            // 限制抽卡按钮点击频率
            return;
        }
        this.flipTimeStamp = now + 500;

        if (!this.checkRewardType()) {
            return;
        }
        if (!this.actModel.filpCardSpReward[this.actModel.flipCardTurnNum - 1]) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_FLIPCARD_TIP9"));
            this.guideSpine.active = true;
            gdk.Timer.clearAll(this);
            gdk.Timer.once(2000, this, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.guideSpine.active = false;
            })
            return;
        }
        let cfg = ConfigManager.getItemByField(Operation_globalCfg, 'index', 1);
        let item = cfg.item[this.curRewardType - 1];
        let leftTime = BagUtils.getItemNumById(item[0]);
        if (leftTime && leftTime >= item[1]) {
            let name: string = e.target.name;
            let req = new icmsg.FlipCardRewardReq();
            req.index = parseInt(name.slice(4)) - 1;
            NetManager.send(req, (resp: icmsg.FlipCardRewardRsp) => {
                this.respGoodsInfo = resp.reward;
                this._flipAni(e.target, resp.reward[0].typeId, resp.reward[0].num);
            });
        }
        else {
            // let costCfg1 = ConfigManager.getItemByField(GlobalCfg, 'key', 'flip_card_cost2');
            // let costCfg2 = ConfigManager.getItemByField(GlobalCfg, 'key', 'flip_card_cost3');
            // let costMaxCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'flip_card_cost_max');
            let cfg = ConfigManager.getItemById(Operation_globalCfg, 1);
            let times = cfg.cost_times - cfg.discount_times;
            let cost = 0;
            let str = '';

            if (this.actModel.flipCardLeftDiamondTimes > times) {
                let s = gdk.i18n.t("i18n:ACT_FLIPCARD_TIP10");
                cost = cfg.discount[1];
                str = StringUtils.format(s, this.actModel.flipCardLeftDiamondTimes - times);
            }
            else if (this.actModel.flipCardLeftDiamondTimes > 0) {
                let s = gdk.i18n.t("i18n:ACT_FLIPCARD_TIP11");
                cost = cfg.cost[1];
                str = StringUtils.format(s, this.actModel.flipCardLeftDiamondTimes);
            }
            else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_FLIPCARD_TIP12"));
                return;
            }
            // GlobalUtil.openAskPanel({
            //     descText: `${str}`,
            //     sureCb: () => {
            //         let name: string = e.target.name;
            //         let req = new icmsg.FlipCardRewardReq();
            //         req.index = parseInt(name.slice(4)) - 1;
            //         NetManager.send(req, (resp: icmsg.FlipCardRewardRsp) => {
            //             this.actModel.flipCardLeftDiamondTimes -= 1;
            //             this._flipAni(e.target, resp.reward[0].typeId, resp.reward[0].num);
            //         });
            //     }
            // })
            let transV = ConfigManager.getItemByField(GlobalCfg, 'key', 'proportion').value;
            GlobalUtil.openAskPanel({
                descText: `是否使用<color=#00ff00>${cost}</c>钻石(拥有:<color=#00ff00>${ModelManager.get(RoleModel).gems}</c>)<br/>购买<color=#00ff00>${cost / transV[0] * transV[1]}英雄经验</c>(同时附赠<color=#00ff00>${1}</c>次翻牌机会)<br/>${str}`,
                sureCb: () => {
                    let name: string = e.target.name;
                    let req = new icmsg.FlipCardRewardReq();
                    req.index = parseInt(name.slice(4)) - 1;
                    NetManager.send(req, (resp: icmsg.FlipCardRewardRsp) => {
                        this.respGoodsInfo = resp.reward;
                        this.actModel.flipCardLeftDiamondTimes -= 1;
                        this._flipAni(e.target, resp.reward[0].typeId, resp.reward[0].num);
                    });
                },
            })
        }
    }

    _initStyle() {
        let type = ActUtil.getCfgByActId(46).reward_type;
        type = type % 3 == 0 ? 3 : type % 3;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/act/texture/bg/flipCards/bg${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.spRewardNode.getChildByName('addBtn'), `view/act/texture/flipCards/spReward${type}`);
        this.bgSpine.setAnimation(0, `${['stand3', 'stand', 'stand2'][type - 1]}`, true);
        // GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), `view/act/texture/flipCards/cost${this.actModel.flipCardTurnNum}`);
        let colorInfo = LabelColorInfo[type - 1];
        let labs = [
            this.timeLabel,
            this.spRewardNode.getChildByName('turnLab').getComponent(cc.Label),
            this.nextTurnNode.getChildByName('lab').getComponent(cc.Label),
            this.tipsLab,
            this.costNode.getChildByName('num').getComponent(cc.Label)
        ];
        this.turnPreviewNode.children.forEach(n => {
            let lab = n.getChildByName('turnLab').getComponent(cc.Label);
            labs.push(lab);
        })
        labs.forEach((lab, idx) => {
            lab.node.color = cc.color().fromHEX(colorInfo[idx].color);
            if (colorInfo[idx].outline) {
                lab.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(colorInfo[idx].outline);
            }
        });
        let url = `view/act/texture/flipCards/card${type}`
        this.cardsNode.children.forEach(node => {
            GlobalUtil.setSpriteIcon(this.node, node, url);
        });
    }

    _initTurnPreviewNode() {
        let cfgs: Operation_best_showCfg[] = [];
        for (let i = 1; i < 5; i++) {
            let cfg = ConfigManager.getItemByField(Operation_best_showCfg, 'reward_type', this.curRewardType, { turn: this.actModel.flipCardTurnNum + i });
            if (!cfg) {
                let cs = ConfigManager.getItemsByField(Operation_best_showCfg, 'reward_type', this.curRewardType);
                cfg = cs[cs.length - 1];
            }
            cfgs.push(cfg);
        }
        this.turnPreviewNode.children.forEach((n, idx) => {
            let cfg = cfgs[idx];
            let ctrl = n.getComponent(UiSlotItem);
            ctrl.updateItemInfo(cfg.award[0], cfg.award[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: cfg.award[0],
                itemNum: cfg.award[1],
                type: BagUtils.getItemTypeById(cfg.award[0]),
                extInfo: null
            }
            let giftNameLab = n.getChildByName('giftName').getComponent(cc.Label);
            giftNameLab.string = cfg.name;
            let lab = n.getChildByName('turnLab').getComponent(cc.Label);
            let s = [
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM1"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM2"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM3"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM4"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM5"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM6"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM7"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM8"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM9"),
            ]
            let num = this.actModel.flipCardTurnNum + idx + 1;
            lab.string = `${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP13")}${num >= 20 ? `${s[Math.floor(num / 10) - 1]}` : ''}${num >= 10 ? `${gdk.i18n.t("i18n:ACT_FLIPCARD_NUM10")}` : ''}${num % 10 == 0 ? '' : `${s[num % 10 - 1]}`}${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP14")}`;
        });
    }

    _playPreviewRewardAni() {
        // 108
        let firstIdx = 0;
        let minX = 0;
        this.turnPreviewNode.children.forEach((n, idx) => {
            n.stopAllActions();
            let targetPos = cc.v2(n.x - 108, n.y);
            if (targetPos.x <= minX) {
                minX = targetPos.x;
                firstIdx = idx;
            }
            n.runAction(cc.sequence(
                cc.moveTo(.3, targetPos),
                cc.callFunc(() => {
                    if (idx == firstIdx) {
                        n.setPosition(368, 9);
                        let cfg = ConfigManager.getItemByField(Operation_best_showCfg, 'reward_type', this.curRewardType, { turn: this.actModel.flipCardTurnNum + 4 });
                        if (!cfg) {
                            let cs = ConfigManager.getItemsByField(Operation_best_showCfg, 'reward_type', this.curRewardType);
                            cfg = cs[cs.length - 1];
                        }
                        let ctrl = n.getComponent(UiSlotItem);
                        ctrl.updateItemInfo(cfg.award[0], cfg.award[1]);
                        ctrl.itemInfo = {
                            series: null,
                            itemId: cfg.award[0],
                            itemNum: cfg.award[1],
                            type: BagUtils.getItemTypeById(cfg.award[0]),
                            extInfo: null
                        };
                        let lab = n.getChildByName('turnLab').getComponent(cc.Label);
                        let s = [
                            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM1"),
                            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM2"),
                            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM3"),
                            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM4"),
                            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM5"),
                            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM6"),
                            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM7"),
                            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM8"),
                            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM9"),
                        ]
                        let num = this.actModel.flipCardTurnNum + 4;
                        lab.string = `${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP13")}${num >= 20 ? `${s[Math.floor(num / 10) - 1]}` : ''}${num >= 10 ? `${gdk.i18n.t("i18n:ACT_FLIPCARD_NUM10")}` : ''}${num % 10 == 0 ? '' : `${s[num % 10 - 1]}`}${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP14")}`;
                    }
                })
            ))
        });
    }

    /**初始化卡牌 */
    @gdk.binding('actModel.flipCardTurnNum')
    _initCards() {
        this.cardsNode.children.forEach(node => {
            node.getComponent(cc.Button).interactable = true;
            node.setScale(1, 1);
        });
        this.slotsNode.removeAllChildren();
        let flipInfo = ModelManager.get(ActivityModel).flipCardFlipInfo;
        let localFlippedInfo = GlobalUtil.getLocal('flippedInfo', true) || {};
        for (let key in flipInfo) {
            let id = parseInt(key) + 1;
            let goodsInfo: icmsg.GoodsInfo = localFlippedInfo[key] || flipInfo[key];
            let card = this.cardsNode.getChildByName(`card${id}`);
            if (card) {
                let slot = cc.instantiate(this.slotPrefab);
                // slot.setScale(0.8 / 0.9, 0.8 / 0.9);
                let ctrl = slot.getComponent(UiSlotItem);
                ctrl.updateItemInfo(goodsInfo.typeId, goodsInfo.num);
                ctrl.itemInfo = {
                    series: null,
                    itemId: goodsInfo.typeId,
                    itemNum: goodsInfo.num,
                    type: BagUtils.getItemTypeById(goodsInfo.typeId),
                    extInfo: null,
                }
                slot.scaleX = 1;
                slot.parent = this.slotsNode;
                slot.setPosition(card.x, card.y);
                card.scaleX = 0;
            }
        }
    }

    /**翻牌动画 */
    _flipAni(card: cc.Node, itemId: number, itemNum: number = 1) {
        card.getComponent(cc.Button).interactable = false;
        let slot = cc.instantiate(this.slotPrefab);
        // slot.setScale(0.8 / 0.9, 0.8 / 0.9);
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(itemId, itemNum);
        ctrl.itemInfo = {
            series: null,
            itemId: itemId,
            itemNum: itemNum,
            type: BagUtils.getItemTypeById(itemId),
            extInfo: null,
        }
        slot.scaleX = 0;
        slot.parent = this.slotsNode;
        slot.setPosition(card.x, card.y);

        let tween = new cc.Tween();
        this.tween.push(tween);
        tween.target(card)
            .to(.2, { scaleX: 0 })
            .call(() => {
                let tween = new cc.Tween();
                this.tween.push(tween);
                tween.target(slot)
                    .to(.2, { scaleX: 1 })
                    .call(() => {
                        let cb = () => {
                            // let goodsInfo = new icmsg.GoodsInfo();
                            // goodsInfo.typeId = itemId;
                            // goodsInfo.num = itemNum;
                            // GlobalUtil.openRewadrView([goodsInfo]);
                            GlobalUtil.openRewadrView(this.respGoodsInfo);
                            gdk.Timer.once(200, this, () => {
                                if (cc.isValid(this.node)) {
                                    this.flipTimeStamp = 0;
                                }
                            })
                        }
                        let spRewardId = this.actModel.filpCardSpReward[this.actModel.flipCardTurnNum - 1];
                        let spRewardItem = ConfigManager.getItemById(Operation_bestCfg, spRewardId).award;
                        if (spRewardItem && spRewardItem[0] == itemId && spRewardItem[1] == itemNum) {
                            let node = new cc.Node();
                            let spine = node.addComponent(sp.Skeleton);
                            node.parent = slot;
                            node.setPosition(0, 0);
                            node.setScale(1.1, 1.1);
                            spine.setCompleteListener(() => {
                                spine.setCompleteListener(null);
                                spine.node.destroy();
                                cb();
                            });
                            GlobalUtil.setSpineData(this.node, spine, `spine/ui/UI_xingyunfanpai/UI_xingyunfanpai`, true, 'stand');
                        }
                        else {
                            cb();
                        }

                    })
                    .start();
            })
            .start();
    }

    _updateCostNode() {
        // let cfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'flip_card_cost1');
        let type = ActUtil.getCfgByActId(46).reward_type;
        let cfg = ConfigManager.getItemById(Operation_globalCfg, 1);
        let item = cfg.item[type - 1];
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(item[0]));
        this.costNode.getChildByName('num').getComponent(cc.Label).string = BagUtils.getItemNumById(item[0]) + '';
    }

    @gdk.binding('actModel.filpCardSpReward')
    @gdk.binding('actModel.flipCardTurnNum')
    _updateSpReward() {
        let slot = this.spRewardNode.getChildByName('UiSlotItem').getComponent(UiSlotItem);
        let turnLab = this.spRewardNode.getChildByName('turnLab').getComponent(cc.Label);
        let add = this.spRewardNode.getChildByName('addBtn');
        let s = [
            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM1"),
            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM2"),
            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM3"),
            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM4"),
            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM5"),
            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM6"),
            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM7"),
            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM8"),
            gdk.i18n.t("i18n:ACT_FLIPCARD_NUM9"),
        ]
        let n = this.actModel.flipCardTurnNum;
        // turnLab.string = `${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP13")}${n >= 20 ? `${s[Math.floor(n / 10) - 1]}` : ''}${n >= 10 ? `${gdk.i18n.t("i18n:ACT_FLIPCARD_NUM10")}` : ''}${n % 10 == 0 ? '' : `${s[n % 10 - 1]}`}${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP14")}`;
        slot.node.active = false;
        add.active = true;
        let itemId = 0;
        if (this.actModel.filpCardSpReward.length >= this.actModel.flipCardTurnNum) {
            itemId = this.actModel.filpCardSpReward[this.actModel.flipCardTurnNum - 1];
            let cfg = ConfigManager.getItemByField(Operation_bestCfg, 'id', itemId);
            if (cfg) {
                slot.node.active = true;
                add.active = false;
                slot.updateItemInfo(cfg.award[0], cfg.award[1]);
                slot.itemInfo = {
                    series: null,
                    itemId: cfg.award[0],
                    itemNum: cfg.award[1],
                    type: BagUtils.getItemTypeById(cfg.award[0]),
                    extInfo: null
                }
            }
        }
    }

    @gdk.binding('actModel.flipCardRecived')
    _updateNextTurn() {
        this.tips.active = this.actModel.flipCardRecived;
        this.nextTurnNode.active = this.actModel.flipCardRecived && (this.actModel.flipCardTurnNum != this.maxTurn);
    }
}

const LabelColorInfo = [
    [
        { color: "#e1ffff", outline: "#0e1020" },
        { color: "#57c0d7", outline: "#171d33" },
        { color: "#8e80b9", outline: "#120E21" },
        { color: "#7c6dac", outline: "#120e21" },
        { color: "#f9e3ff" },
        { color: "#57c0d7", outline: "#171d33" },
        { color: "#57c0d7", outline: "#171d33" },
        { color: "#57c0d7", outline: "#171d33" },
        { color: "#57c0d7", outline: "#171d33" },
    ],
    [
        { color: "#df942a", outline: "#35180d" },
        { color: "#d7c357", outline: "#4b241b" },
        { color: "#89433b", outline: "#1f0e11" },
        { color: "#924e45", outline: "#1f0e11" },
        { color: "#ffd5b7" },
        { color: "#df942a", outline: "#35180d" },
        { color: "#df942a", outline: "#35180d" },
        { color: "#df942a", outline: "#35180d" },
        { color: "#df942a", outline: "#35180d" },
    ],
    [
        { color: "#e1ffff", outline: "#0e1020" },
        { color: "#57c0d7", outline: "#171d33" },
        { color: "#6179ab", outline: "#101425" },
        { color: "#5a709e", outline: "#120e21" },
        { color: "#bbe4ff" },
        { color: "#e1ffff", outline: "#0e1020" },
        { color: "#e1ffff", outline: "#0e1020" },
        { color: "#e1ffff", outline: "#0e1020" },
        { color: "#e1ffff", outline: "#0e1020" },
    ]
]
