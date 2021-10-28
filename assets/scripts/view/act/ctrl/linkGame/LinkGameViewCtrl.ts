import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../../store/model/StoreModel';
import TaskUtil from '../../../task/util/TaskUtil';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { Combo_lineCfg, ComboCfg, Store_pushCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-25 11:39:24 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/linkGame/LinkGameViewCtrl")
export default class LinkGameViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(UiTabMenuCtrl)
    uitabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    cardNodes: cc.Node = null;

    @property(cc.Node)
    linkRewards: cc.Node = null;

    @property(cc.Node)
    cardSlotContent: cc.Node = null;

    @property(cc.Node)
    slotRewardPrefab: cc.Node = null;

    get model(): ActivityModel { return ModelManager.get(ActivityModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    actId: number = 102;
    rewardType: number;
    curSlectRound: number;
    tween: cc.Tween[] = [];
    clickTimeStamp: number;
    lineCfgs: Combo_lineCfg[] = [];
    curGiftIds: number[] = [];
    first: boolean = true;
    onEnable() {
        let startTime = new Date(ActUtil.getActStartTime(this.actId));
        let endTime = new Date(ActUtil.getActEndTime(this.actId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            gdk.panel.hide(PanelId.LinkGameMain);
            return;
        }
        else {
            this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            let t = ConfigManager.getItems(ComboCfg);
            this.rewardType = Math.min(t[t.length - 1].reward_type, ActUtil.getActRewardType(this.actId));
            // this.uitabMenu.setSelectIdx(this.model.linkGameRound - 1, true);
        }
    }

    onDisable() {
        for (let i = 0; i < this.tween.length; i++) {
            this.tween[i].stop();
        }
        this.tween = [];
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    @gdk.binding("model.linkGameRound")
    _updateRound() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.uitabMenu.setSelectIdx(this.model.linkGameRound - 1, true);
    }

    onTabMenuSelect(e, data) {
        if (!e) return;
        let round = parseInt(data) + 1;
        if (this.curSlectRound && round == this.curSlectRound) return;
        if (round < this.model.linkGameRound) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:LINK_GAME_TIPS2'));
            this.uitabMenu.showSelect(this.curSlectRound - 1);
        }
        else if (round == this.model.linkGameRound) {
            this.curSlectRound = round;
            this._updateView();
        } else {
            this.uitabMenu.showSelect(this.curSlectRound - 1);
            let d = round - this.model.linkGameRound;
            let nextZeroTime = TimerUtils.getTomZerohour(GlobalUtil.getServerTime() / 1000);
            if (d > 1) nextZeroTime += 24 * 60 * 60;
            let leftTime = nextZeroTime * 1000 - GlobalUtil.getServerTime();
            gdk.gui.showMessage(`${TimerUtils.format1(leftTime / 1000)}${gdk.i18n.t('i18n:LINK_GAME_TIPS3')}`);
        }
    }

    @gdk.binding('storeModel.starGiftDatas')
    _initNewGift() {
        let temGifts: number[] = [];
        let datas = ActivityUtils.getLinkGameGiftDatas();
        datas.forEach(d => {
            if (this.curGiftIds.indexOf(d.giftId) == -1) {
                if (!this.first) {
                    let cb = () => {
                        let cfg = ConfigManager.getItemById(Store_pushCfg, d.giftId);
                        PanelId.LinkGameGiftView.isMask = true;
                        PanelId.LinkGameGiftView.onHide = {
                            func: () => {
                                PanelId.LinkGameGiftView.isMask = false;
                            }
                        }
                        gdk.panel.setArgs(PanelId.LinkGameGiftView, [cfg, d]);
                        gdk.panel.open(PanelId.LinkGameGiftView);
                    }
                    gdk.Timer.once(300, this, () => {
                        if (gdk.panel.isOpenOrOpening(PanelId.Reward)) {
                            PanelId.Reward.onHide = {
                                func: () => {
                                    cb();
                                }
                            }
                        }
                        else {
                            cb();
                        }
                    })
                }
            }
            temGifts.push(d.giftId);
        });
        this.curGiftIds = temGifts;
        if (this.first) this.first = false;
    }

    _updateView() {
        this._updateCardNodes();
        this._updataLinkRewards();
    }

    _updateCardNodes() {
        let cfgs = ConfigManager.getItems(ComboCfg, (cfg: ComboCfg) => {
            if (cfg.rounds == this.model.linkGameRound && cfg.reward_type == this.rewardType) {
                return true;
            }
        });
        this.cardSlotContent.removeAllChildren();
        cfgs.forEach((c, idx) => {
            let n = this.cardNodes.children[idx];
            let rewardState = TaskUtil.getTaskAwardState(c.task_id);
            n.active = !rewardState;
            if (n.active) {
                let state = TaskUtil.getTaskState(c.task_id);
                let f = TaskUtil.getTaskFinishNum(c.task_id);
                n.getChildByName('taskDesc').getComponent(cc.RichText).string = `<outline color=#142B7F width=2>${c.desc}<color=#00FF00>(${f[0]}/${f[1]})</c></outline>`;
                n.getChildByName('RedPoint').active = state;
                n.targetOff(this);
                n.on(cc.Node.EventType.TOUCH_END, () => {
                    if (state) {
                        let now = GlobalUtil.getServerTime();
                        if (now - this.clickTimeStamp < 600) return;
                        this.clickTimeStamp = now;
                        let req = new icmsg.MissionRewardReq();
                        req.kind = 1;
                        req.type = 19;
                        req.id = c.task_id;
                        NetManager.send(req, (resp: icmsg.MissionRewardRsp) => {
                            gdk.e.emit(ActivityEventId.ACTIVITY_LINK_GAME_INFO_UPDATE);
                            if (!cc.isValid(this.node)) return;
                            if (!this.node.activeInHierarchy) return;
                            this._flipAni(n, resp.list[0].typeId, resp.list[0].num);
                            this._updateLinkRewardRedpoint(resp.id);
                            NetManager.send(new icmsg.StorePushListReq());
                        }, this);
                    }
                    else {
                        // gdk.gui.showMessage(gdk.i18n.t('i18n:LINK_GAME_TIPS4'));
                        GlobalUtil.openAskPanel({
                            descText: c.describe,
                            sureCb: () => {
                                if (c.system > 0 && JumpUtils.ifSysOpen(c.system, true)) {
                                    gdk.panel.hide(PanelId.LinkGameMain);
                                    JumpUtils.openView(c.system);
                                }
                            }
                        })
                    }
                }, this);
            }
            else {
                n.targetOff(this);
                let slot = cc.instantiate(this.slotRewardPrefab);
                slot.parent = this.cardSlotContent;
                slot.setPosition(n.x, n.y);
                slot.active = true;
                let ctrl = slot.getChildByName('UiSlotItem').getComponent(UiSlotItem);
                ctrl.updateItemInfo(c.rewards[0][0], c.rewards[0][1]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: c.rewards[0][0],
                    itemNum: c.rewards[0][1],
                    type: BagUtils.getItemTypeById(c.rewards[0][0]),
                    extInfo: null
                };
                slot.getChildByName('nameLab').getComponent(cc.Label).string = BagUtils.getConfigById(c.rewards[0][0]).name;
            }
        });
    }

    _updataLinkRewards() {
        this.lineCfgs = ConfigManager.getItems(Combo_lineCfg, (cfg: Combo_lineCfg) => {
            if (cfg.reward_type == this.rewardType && cfg.rounds == this.model.linkGameRound) {
                return true;
            }
        });
        this.lineCfgs.forEach((c, idx) => {
            let slot = this.linkRewards.children[idx];
            let redPoint = slot.getChildByName('RedPoint');
            let getFlag = slot.getChildByName('getFlag');
            let line1 = slot.getChildByName('llk_xian1');
            let line2 = slot.getChildByName('llk_xian2');
            let state = ActivityUtils.getLinkGameLineRewardState(c.id);
            let ctrl = slot.getComponent(UiSlotItem);
            redPoint.active = state == 1;
            getFlag.active = state == 2;
            line2.width = state == 1 ? line1.width : 0;
            if (state !== 0) {
                line2.runAction(cc.repeatForever(
                    cc.sequence(
                        cc.fadeTo(.8, 180),
                        cc.fadeTo(.8, 255)
                    )
                ))
            }
            else {
                line2.stopAllActions();
            }
            ctrl.updateItemInfo(c.line_rewards[0], c.line_rewards[1]);
            let itemInfo = {
                series: null,
                itemId: c.line_rewards[0],
                itemNum: c.line_rewards[1],
                type: BagUtils.getItemTypeById(c.line_rewards[0]),
                extInfo: null
            };
            // GlobalUtil.setSpriteIcon(this.node, lines, `view/act/texture/linkGame/llk_xian${state == 0 ? 1 : 2}`);
            ctrl.onClick.on(() => {
                let s = ActivityUtils.getLinkGameLineRewardState(c.id);
                if (s == 1) {
                    let now = GlobalUtil.getServerTime();
                    if (now - this.clickTimeStamp < 600) return;
                    this.clickTimeStamp = now;
                    let req = new icmsg.MissionRewardReq();
                    req.kind = 2;
                    req.type = 19;
                    req.id = c.id;
                    NetManager.send(req, (resp: icmsg.MissionRewardRsp) => {
                        gdk.e.emit(ActivityEventId.ACTIVITY_LINK_GAME_INFO_UPDATE);
                        if (!cc.isValid(this.node)) return;
                        if (!this.node.activeInHierarchy) return;
                        //update
                        getFlag.active = true;
                        redPoint.active = false;
                        line2.width = 0;
                    }, this);
                }
                else {
                    GlobalUtil.openItemTips(itemInfo, false, false);
                }
            }, this);

        });
    }

    _updateLinkRewardRedpoint(taskId: number) {
        let taskCfg = ConfigManager.getItemById(ComboCfg, taskId);
        this.lineCfgs.forEach((c, idx) => {
            if (c.card_id.indexOf(taskCfg.card_id) !== -1) {
                let slot = this.linkRewards.children[idx];
                let line1 = slot.getChildByName('llk_xian1');
                let line2 = slot.getChildByName('llk_xian2');
                let redPoint = slot.getChildByName('RedPoint');
                let state = ActivityUtils.getLinkGameLineRewardState(c.id);
                redPoint.active = false;
                if (state == 1) {
                    line2.width = 1;
                    cc.tween(line2)
                        .to(1, { width: line1.width })
                        .call(() => {
                            redPoint.active = true;
                        })
                        .start();
                }
                else {
                    cc.Tween.stopAllByTarget(line2);
                }
            }
        });
    }

    /**翻牌动画 */
    _flipAni(card: cc.Node, itemId: number, itemNum: number = 1) {
        // card.getComponent(cc.Button).interactable = false;
        card.targetOff(this);
        let slot = cc.instantiate(this.slotRewardPrefab);
        // slot.setScale(0.8 / 0.9, 0.8 / 0.9);
        let ctrl = slot.getChildByName('UiSlotItem').getComponent(UiSlotItem);
        ctrl.updateItemInfo(itemId, itemNum);
        ctrl.itemInfo = {
            series: null,
            itemId: itemId,
            itemNum: itemNum,
            type: BagUtils.getItemTypeById(itemId),
            extInfo: null,
        }
        slot.getChildByName('nameLab').getComponent(cc.Label).string = BagUtils.getConfigById(itemId).name;
        slot.scaleX = 0;
        slot.parent = this.cardSlotContent;
        slot.active = true;
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
                        let goodsInfo = new icmsg.GoodsInfo();
                        goodsInfo.typeId = itemId;
                        goodsInfo.num = itemNum;
                        GlobalUtil.openRewadrView([goodsInfo]);
                    })
                    .start();
            })
            .start();
    }
}
