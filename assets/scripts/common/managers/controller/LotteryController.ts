import BagUtils from '../../utils/BagUtils';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import GlobalUtil from '../../utils/GlobalUtil';
import GuideUtil from '../../utils/GuideUtil';
import JumpUtils from '../../utils/JumpUtils';
import LotteryEffectCtrl from '../../../view/lottery/ctrl/LotteryEffectCtrl';
import LotteryModel, { LotteryType } from '../../../view/lottery/model/LotteryModel';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import { BagEvent } from '../../../view/bag/enum/BagEvent';
import { LotteryCostId } from '../../../view/lottery/enum/LotteryCostId';
import { LotteryEventId } from '../../../view/lottery/enum/LotteryEventId';
import { LuckydrawCfg } from '../../../a/config';
import { RoleEventId } from '../../../view/role/enum/RoleEventId';

/**
 * @Description: 抽卡通信器
 * @Author: weiliang.huang
 * @Date: 2019-05-27 17:35:46
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-12 19:49:47
 */

export default class LotteryController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return [
            [LotteryEventId.REQ_LUCKY_DRAW, this.reqLuckyDraw],
            [BagEvent.UPDATE_ONE_ITEM, this._updateItemNums],
            [BagEvent.UPDATE_BAG_ITEM, this._updateItemNums],
            [BagEvent.REMOVE_ITEM, this._updateItemNums],
            [RoleEventId.ROLE_ATT_UPDATE, this._updateItemNums],
        ]
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.LuckyDrawRsp.MsgType, this._onLuckyDrawRsp],
            [icmsg.LuckyComposeRsp.MsgType, this._onLuckyComposeRsp],
            [icmsg.LuckyNumberRsp.MsgType, this._onLuckyNumberRsp],
            [icmsg.GeneDrawRsp.MsgType, this._onGeneDrawRsp],
            [icmsg.GeneDrawHistoryRsp.MsgType, this._onGeneDrawHistoryRsp],
        ];
    }

    model: LotteryModel = null

    onStart() {
        this.model = ModelManager.get(LotteryModel)
    }

    onEnd() {

    }

    reqLuckyDraw(e: gdk.Event) {
        let type = e.data
        let cfg = ConfigManager.getItemById(LuckydrawCfg, type);
        if (cfg.system) {
            if (!JumpUtils.ifSysOpen(cfg.system, true)) {
                if (gdk.panel.isOpenOrOpening(PanelId.LotteryEffect)) {
                    gdk.panel.hide(PanelId.LotteryEffect);
                    gdk.panel.open(PanelId.PveReady)
                }
                if (gdk.panel.isOpenOrOpening(PanelId.Lottery)) {
                    gdk.panel.hide(PanelId.Lottery);
                }
                return;
            }
        }
        let msg = new icmsg.LuckyDrawReq()
        this.model.lastLuckydrawCfgId = e.data
        msg.type = e.data
        NetManager.send(msg, () => {
            GuideUtil.activeGuide("lottery#" + type)
        })
    }

    _onLuckyDrawRsp(data: icmsg.LuckyDrawRsp) {
        let list = data.list
        let hasExtraItem: boolean = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].typeId == 140012) {
                //时空精粹放到列表末尾
                [list[i], list[list.length - 1]] = [list[list.length - 1], list[i]];
                hasExtraItem = true;
                break;
            }
            if (list[i].typeId == 10) {
                //钻石抽奖兑换的英雄经验 无需展示
                list.splice(i, 1);
                i--;
            }
        }
        //LotteryUtil.lotteryRewardView(list)

        // if (GuideUtil.getCurGuideId() > 0) {
        //     LotteryUtil.lotteryRewardView(list)
        //     return
        // }
        this.model.resultGoods = list
        this.model.lotteryType = LotteryType.normal;
        let cfg = ConfigManager.getItemById(LuckydrawCfg, this.model.lastLuckydrawCfgId)
        !this.model.drawNums[Math.floor(cfg.id / 100) - 1] && (this.model.drawNums[Math.floor(cfg.id / 100) - 1] = 0)
        this.model.drawNums[Math.floor(cfg.id / 100) - 1] += (hasExtraItem ? list.length - 1 : list.length);
        this.model.credit += cfg.credit;
        gdk.e.emit(LotteryEventId.UPDATE_LOTTERY_CREDIT_CHANGE);
        let panel = gdk.panel.get(PanelId.LotteryEffect)
        if (panel) {
            let ctrl = panel.getComponent(LotteryEffectCtrl)
            ctrl.reSetEffect()
            if (this.model.isSkipAni) {
                ctrl.skipAni();
                return
            }
            let ani = panel.getComponent(cc.Animation)
            ctrl.spineAni.setCompleteListener(() => {
                ani.stop("zh_sys");
                ctrl.spineAni.setCompleteListener(null);
                ctrl.spineAni.setAnimation(0, 'stand2', true);
                ctrl.showReward(list)
                gdk.e.emit(LotteryEventId.RSP_LUCKY_DRAW);
            });
            ctrl.spineAni.setAnimation(0, 'stand', true);
            ani.play("zh_sys");
            return
        }
        this._showLotteryEffect(list)
    }

    _showLotteryEffect(list) {
        gdk.panel.open(PanelId.LotteryEffect, (node: cc.Node) => {
            let ctrl = node.getComponent(LotteryEffectCtrl);
            if (this.model.isSkipAni) {
                ctrl.skipAni();
                return
            }
            let ani = node.getComponent(cc.Animation)
            ctrl.spineAni.setCompleteListener(() => {
                ani.stop("zh_sys");
                ctrl.spineAni.setCompleteListener(null);
                ctrl.spineAni.setAnimation(0, 'stand2', true);
                ctrl.showReward(list)
                gdk.e.emit(LotteryEventId.RSP_LUCKY_DRAW);
            });
            ctrl.spineAni.setAnimation(0, 'stand', true);
            ani.play("zh_sys");
        })
    }

    _onLuckyComposeRsp(data: icmsg.LuckyComposeRsp) {
        let list = data.hero
        GlobalUtil.openHeroRewardView(list);
        // this.model.bagItems = []
        gdk.e.emit(LotteryEventId.RSP_LUCKY_COMPOSE)
    }

    _onLuckyNumberRsp(data: icmsg.LuckyNumberRsp) {
        this.model.drawNums = data.numbers;
        this.model.credit = data.credit;
        gdk.e.emit(LotteryEventId.UPDATE_LOTTERY_CREDIT_CHANGE);
    }

    _onGeneDrawRsp(resp: icmsg.GeneDrawRsp) {
        // this.model.geneResultGoods = resp.list;
        // this.model.lotteryType = LotteryType.gene;
        // // let panel = gdk.panel.get(PanelId.LotteryEffect)
        // let panel = gdk.panel.get(PanelId.GeneLotteryEffect);
        // let cfg = ConfigManager.getItemById(GeneCfg, this.model.curGenePoolId);
        // if (panel) {
        //     let ctrl = panel.getComponent(GeneLotteryEffectViewCtrl)
        //     ctrl.reSetEffect()
        //     ctrl.showReward(resp.list, false, cfg);
        // }
        // else {
        //     gdk.panel.open(PanelId.GeneLotteryEffect, (node: cc.Node) => {
        //         let ctrl = node.getComponent(GeneLotteryEffectViewCtrl);
        //         ctrl.showReward(resp.list, false, cfg);
        //     })
        // }
    }

    /**
     * 更新抽卡道具红点提示状态
     */
    _updateItemNums() {
        let obj = GlobalUtil.getLocal('lotteryRedpoint', true) || {};
        let ids = [LotteryCostId.costId2, LotteryCostId.costId3, LotteryCostId.costId4];
        ids.forEach(id => {
            let itemNum = BagUtils.getItemNumById(id) || 0;
            let oldValue = obj[id];
            if (oldValue) {
                if (oldValue.num !== itemNum) {
                    if (oldValue.num < itemNum) {
                        obj[id].isCheck = false;
                    }
                    obj[id].num = itemNum;
                }
            }
            else {
                obj[id] = { num: itemNum, isCheck: false };
            }
        });
        GlobalUtil.setLocal('lotteryRedpoint', obj, true);
    }

    _onGeneDrawHistoryRsp(resp: icmsg.GeneDrawHistoryRsp) {
        this.model.geneDrawRecord = resp.drawHistory.reverse();
    }
}


