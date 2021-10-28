import ActivityModel, { CaveLayerInfo } from '../../../view/act/model/ActivityModel';
import ActivityUtils from '../../utils/ActivityUtils';
import ActUtil from '../../../view/act/util/ActUtil';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import GlobalUtil from '../../utils/GlobalUtil';
import GuardianModel from '../../../view/role/model/GuardianModel';
import GuardianTowerModel from '../../../view/act/model/GuardianTowerModel';
import MineModel from '../../../view/act/model/MineModel';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import PveSceneCtrl from '../../../view/pve/ctrl/PveSceneCtrl';
import RoyalModel from '../../models/RoyalModel';
import SailingModel from '../../../view/act/model/SailingModel';
import {
    Activity_star_giftsCfg,
    GlobalCfg,
    Operation_bestCfg,
    Operation_wishCfg,
    Store_awake_giftCfg,
    Store_time_giftCfg,
    Twist_eggCfg
    } from '../../../a/config';
import { ActivityEventId } from '../../../view/act/enum/ActivityEventId';
import { RedPointEvent } from '../../utils/RedPointUtils';
import { StoreEventId } from '../../../view/store/enum/StoreEventId';
import { subActType } from '../../../view/act/ctrl/wonderfulActivity/SubActivityViewCtrl';

/**
 * 活动信息控制器
 * @Author: luoyong
 * @Date: 2019-12-19 10:19:06
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-14 19:04:21
 */

export default class ActivityController extends BaseController {

    get gdkEvents(): GdkEventArray[] {
        return [
            [StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc]
        ];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.ActivityRankingInfoRsp.MsgType, this._onActivityRankingInfoRsp],
            [icmsg.ActivityTopUpListRsp.MsgType, this._onActivityTopUpListRsp],
            [icmsg.ActivityTopUpAwardRsp.MsgType, this._onActivityTopUpAwardRsp],
            [icmsg.ActivityCumloginListRsp.MsgType, this._onActivityCumloginListRsp],
            [icmsg.ActivityCumloginAwardRsp.MsgType, this._onActivityCumLoginAwardRsp],
            // [icmsg.ActivityFlipCardsListRsp.MsgType, this._onActivityFlipCardsListRsp],
            // [icmsg.ActivityFlipCardsAwardRsp.MsgType, this._onActivityFlipCardsAwardRsp],
            // [icmsg.ActivityLuckyFlipCardsAwardRsp.MsgType, this._onActivityLuckyFlipCardsAwardRsp],
            // [icmsg.ActivityFlipCardsInfoRsp.MsgType, this._onActivityFlipCardsInfoResp],
            // [icmsg.ActivityTwistEggInfoRsp.MsgType, this._onActivityTwistEggInfoRsp],
            [icmsg.ActivityCaveStateRsp.MsgType, this._onActivityCaveStateRsp],
            [icmsg.ActivityCavePassListRsp.MsgType, this._onActivityCavePassListRsp],
            [icmsg.ActivityAlchemyTimesRsp.MsgType, this._onActivityAlchemyTimesRsp],
            [icmsg.ExcitingActivityStateRsp.MsgType, this._onExcitingActivityStateRsp],
            [icmsg.ExcitingActivityProgressRsp.MsgType, this._onExcitingActivityProgressRsp],
            [icmsg.ExcitingActivityRewardsRsp.MsgType, this._onExcitingActivityRewardsRsp],
            [icmsg.ExcitingActivityUpgradeLimitRsp.MsgType, this._onExcitingActivityUpgradeLimitRsp],
            [icmsg.PayDailyFirstInfoRsp.MsgType, this._onPayDailyFirstInfoRsp],
            [icmsg.FlipCardInfoRsp.MsgType, this._onFlipCardInfoRsp],
            [icmsg.FlipCardSPRewardRsp.MsgType, this._onFlipCardSpRrewardRsp],
            [icmsg.FlipCardRewardRsp.MsgType, this._onFlipCardRewardRsp],
            [icmsg.FlipCardNextTurnRsp.MsgType, this._onFlipCardNextTurnRsp],
            [icmsg.DrawEggInfoRsp.MsgType, this._onDrawEggInfoRsp],
            [icmsg.DrawEggSPRewardRsp.MsgType, this._onDrawEggSpRewardRsp],
            [icmsg.DrawEggAwardRsp.MsgType, this._onDrawEggAwardRsp],
            [icmsg.LuckyDrawSummonStateRsp.MsgType, this._onLuckDrawSummonStateRsp],
            [icmsg.CarnivalPlayerServerRankRsp.MsgType, this._onCarnivalPlayerServerRankRsp],
            [icmsg.CarnivalInfoRsp.MsgType, this._onCarnivalInfoRsp],
            [icmsg.ActivityNewTopUpListRsp.MsgType, this._onActivityNewTopUpListRsp],
            [icmsg.ActivityNewTopUpAwardRsp.MsgType, this._onActivityNewTopUpAwardRsp],
            [icmsg.ActivityWeekendGiftInfoRsp.MsgType, this._onActivityWeekendGiftInfoRsp],
            [icmsg.ActivityWeekendGiftRsp.MsgType, this._onActivityWeekendGiftRsp],
            [icmsg.ActivityLandGiftInfoRsp.MsgType, this._onActivityLandGiftInfoRsp],
            [icmsg.ActivityLandGiftAwardRsp.MsgType, this._onActivityLandGiftAwardRsp],
            [icmsg.CrossTreasureStateRsp.MsgType, this._onCrossTreasureStateRsp],
            [icmsg.CrossTreasureNumRsp.MsgType, this._onCrossTreasureNumRsp],
            [icmsg.CrossTreasureRecordListRsp.MsgType, this._onCrossTreasureRecordListRsp],
            [icmsg.CrossTreasureRsp.MsgType, this._onCrossTreasureRsp],
            [icmsg.TwistEggStateRsp.MsgType, this._onTwistEggStateRsp],
            [icmsg.GuardianTowerStateRsp.MsgType, this._onGuardianTowerStateRsp],
            [icmsg.ActivityGuardianDrawInfoRsp.MsgType, this._onActivityGuardianDrawInfoRsp],
            [icmsg.ActivityCaveAdventureInfoRsp.MsgType, this._onActCaveInfoRsp],
            [icmsg.ActivityCaveAdventureMoveRsp.MsgType, this._onActCaveMoveRsp],
            [icmsg.ActivityCaveAdventureGainBoxRsp.MsgType, this._onActCaveGainBoxRsp],
            [icmsg.ActivityAwakeGiftInfoRsp.MsgType, this._onActivityAwakeGiftInfoRsp],
            [icmsg.ActivityAwakeGiftSetRsp.MsgType, this._onActivityAwakeGiftSetRsp],
            [icmsg.ActivityAwakeGiftGainRsp.MsgType, this._onActivityAwakeGiftGainRsp],
            [icmsg.LuckyDrawOptionalRsp.MsgType, this._onLuckyDrawOptionalRsp],
            [icmsg.CostumeCustomStateRsp.MsgType, this._onCostumeCustomStateRsp],
            [icmsg.CostumeCustomScoreUpdateRsp.MsgType, this._onCostumeCustomScoreUpdateRsp],
            [icmsg.CostumeCustomScoreRsp.MsgType, this._onCostumeCustomScoreRsp],
            [icmsg.ActivityAssembledInfoRsp.MsgType, this._onActivityAssembledInfoRsp],
            [icmsg.ActivityDiscountStateRsp.MsgType, this._onActivityDiscountStateRsp],
            [icmsg.ActivitySailingInfoRsp.MsgType, this._onActivitySailingInfoRsp],
            [icmsg.ActivityHotelStateRsp.MsgType, this._onActivityHotelStateRsp],
            [icmsg.ActivityTimeGiftInfoRsp.MsgType, this._onActivityTimeGiftInfoRsp],
            [icmsg.ActivityMysteriousInfoRsp.MsgType, this._onActivityMysteriousInfoRsp],
            [icmsg.RoyalInfoRsp.MsgType, this._onRoyalInfoRsp],
            [icmsg.DungeonSevenDayStateRsp.MsgType, this._onDungeonSevenDayStateRsp],
            [icmsg.ActivitySuperValueInfoRsp.MsgType, this._onActivitySuperValueInfoRsp],
            [icmsg.ActivitySuperValueGainRsp.MsgType, this._onActivitySuperValueGainRsp],
            [icmsg.ActivitySuperValueNoticeRsp.MsgType, this._onActivitySuperValueNoticeRsp],
        ];
    }

    model: ActivityModel = null

    onStart() {
        this.model = ModelManager.get(ActivityModel)
        this.model.kfcb_ranksInfo = []

        this._updateTime()
        gdk.Timer.loop(1000, this, this._updateTime)
    }

    onEnd() {
        gdk.Timer.clear(this, this._updateTime)
    }

    _updateTime() {
        //逢 配置的整点 请求点金数据
        if (GlobalUtil.getServerTime() > 0) {
            let date = new Date(GlobalUtil.getServerTime())
            let values = ConfigManager.getItemById(GlobalCfg, "alchemy_refresh_time").value
            for (let i = 0; i < values.length; i++) {
                if ((date.getHours() == Math.floor(values[i] / 3600)) && (date.getMinutes() == 0 && date.getSeconds() == 0)) {
                    CC_DEBUG && cc.log("点金数据请求-----------------" + date.getHours() + "点")
                    let msg = new icmsg.ActivityAlchemyTimesReq()
                    NetManager.send(msg)
                }
            }
        }
    }

    _onActivityRankingInfoRsp(data: icmsg.ActivityRankingInfoRsp) {
        this.model.kfcb_history1 = data.history1
        this.model.kfcb_history2 = data.history2
        this.model.kfcb_percent3 = data.percent3
        this.model.kfcb_percent7 = data.percent7 > 0 ? data.percent7 : this.model.kfcb_percent7
        this.model.kfcb_rewarded3 = data.rewarded3
        this.model.kfcb_rewarded7 = data.rewarded7
        this.model.kfcb_ranksInfo = data.top3
        gdk.e.emit(ActivityEventId.UPDATE_KFCB_ACT_REWARD)
    }

    /**
     * 每月累充列表返回
     * @param resp 
     */
    _onActivityTopUpListRsp(resp: icmsg.ActivityTopUpListRsp) {
        this.model.monthlyRecharge = resp.paySum;
        this.model.lcdlRewards = resp.rewards;
    }

    /**
     * 每月累充奖励领取
     * @param resp 
     */
    _onActivityTopUpAwardRsp(resp: icmsg.ActivityTopUpAwardRsp) {
        ActivityUtils.updateLcdlReward(resp.index);
    }

    /**
     * 每月累充列表返回
     * @param resp 
     */
    _onActivityNewTopUpListRsp(resp: icmsg.ActivityNewTopUpListRsp) {
        this.model.newTopUpRecharge = resp.paySum;
        this.model.newLcdlRewards = resp.rewards;
    }

    /**
     * 每月累充奖励领取
     * @param resp 
     */
    _onActivityNewTopUpAwardRsp(resp: icmsg.ActivityNewTopUpAwardRsp) {
        ActivityUtils.updateNewLcdlReward(resp.index);
    }

    /**
     * 充值成功返回
     * @param data 
     */
    _onPaySucc(data: gdk.Event) {
        let model = ModelManager.get(ActivityModel);
        let d = <icmsg.PaySuccRsp>data.data;
        model.monthlyRecharge += d.money;
        model.dayRecharge += d.money;
        model.newTopUpRecharge += d.money;
        model.historyPaySum += d.money;
        model.mysteryVisitorTotal += d.money;
        //远航寻宝充值累计
        let smodel = ModelManager.get(SailingModel);
        if (smodel.sailingInfo) {
            smodel.sailingInfo.money += d.money;
        }
        if (d.paymentId > 1600000 && d.paymentId < 1700000) {
            let cfg = ConfigManager.getItemById(Store_awake_giftCfg, d.paymentId);
            this.model.awakeStarUpGiftMap[cfg.star_total].isCharge = true;
            this.model.awakeStarUpGiftMap[cfg.star_total].awardList[1] = d.paymentId;
            this.model.awakeStarUpGiftMap[cfg.star_total].nowDay = 1;
            this.model.awakeStarUpGiftMap = this.model.awakeStarUpGiftMap;
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        }
    }

    /**活动-累计登陆列表 */
    _onActivityCumloginListRsp(resp: icmsg.ActivityCumloginListRsp) {
        this.model.totalLoginDays = resp.loginDays;
        this.model.totalLoginRewards = resp.rewards;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**活动-累计登陆奖励领取 */
    _onActivityCumLoginAwardRsp(resp: icmsg.ActivityCumloginAwardRsp) {
        ActivityUtils.updateTotalLoginReward(resp.index);
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    // /**活动-幸运翻牌累计翻牌次数 */
    // _onActivityFlipCardsListRsp(resp: ActivityFlipCardsListRsp) {
    //     this.model.flipCardTotalNum = resp.flippedNum;
    //     this.model.flipCardTotalReward = resp.rewards;
    // }

    // /**活动-幸运翻牌累计翻牌次数奖励领取返回 */
    // _onActivityFlipCardsAwardRsp(resp: ActivityFlipCardsAwardRsp) {
    //     ActivityUtils.updateFlipCardTotalFlipReward(resp.index);
    // }

    // /**幸运翻牌-单次翻牌奖励 */
    // _onActivityLuckyFlipCardsAwardRsp(resp: ActivityLuckyFlipCardsAwardRsp) {
    //     ModelManager.get(ActivityModel).flipCardFlipInfo[resp.flippedReward.index] = resp.flippedReward.goods;
    //     let localFlippedInfo = GlobalUtil.getLocal('flippedInfo', true);
    //     if (!localFlippedInfo) localFlippedInfo = {};
    //     localFlippedInfo[resp.flippedReward.index] = resp.flippedReward.goods;
    //     GlobalUtil.setLocal('flippedInfo', localFlippedInfo, true);
    // }

    // /**幸运翻牌-翻牌信息 */
    // _onActivityFlipCardsInfoResp(resp: ActivityFlipCardsInfoRsp) {
    //     let activityModel = ModelManager.get(ActivityModel);
    //     activityModel.flipCardFlipInfo = {};
    //     resp.flippedRewards.forEach(info => {
    //         activityModel.flipCardFlipInfo[info.index] = info.goods;
    //     });
    //     if (resp.flippedRewards.length == 0) GlobalUtil.setLocal('flippedInfo', {}, true);
    // }

    // /**幸运扭蛋 信息 */
    // _onActivityTwistEggInfoRsp(resp: ActivityTwistEggInfoRsp) {
    //     let activityModel = ModelManager.get(ActivityModel);
    //     activityModel.twistedEggTime = resp.number;
    //     resp.rewards.forEach(reward => {
    //         activityModel.twistedEggInfos.push({
    //             rewardType: reward.rewardType,
    //             goodsInfo: reward.drop
    //         })
    //     });
    // }

    /**矿洞大作战 信息 */
    _onActivityCaveStateRsp(rsp: icmsg.ActivityCaveStateRsp) {
        ModelManager.get(MineModel).curCaveSstate = rsp;
    }
    /**矿洞大作战通行证 信息 */
    _onActivityCavePassListRsp(rsp: icmsg.ActivityCavePassListRsp) {
        let mineModel = ModelManager.get(MineModel);
        mineModel.passBoight = rsp.bought;
        mineModel.passReward1 = rsp.rewarded1;
        mineModel.passReward2 = rsp.rewarded2;
    }

    /**点金领取次数 */
    _onActivityAlchemyTimesRsp(data: icmsg.ActivityAlchemyTimesRsp) {
        this.model.alchemyTimes = data.times
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    /**精彩活动状态 */
    _onExcitingActivityStateRsp(resp: icmsg.ExcitingActivityStateRsp) {
        /**升星好礼当前周期 */
        this.model.excitingAcrOfStarGiftRewardType = resp.starGiftRewardType || 1;
        this.model.excitingAcrOfStarGiftRounds = resp.starGiftRound || 1;
        this.model.excitingActOfContinuousCycle = resp.cycle || 1;
        let actIds = [37, 38, 39, 40, 32, 33, 41, 50];
        this.model.excitingActInfo = {};
        this.model.excitingRewards = {};
        let info = this.model.excitingActInfo;

        resp.state.forEach(state => {
            if (!ActUtil.ifActOpen(actIds[state.type - 1])) {
                //活动未开启 不处理
                return;
            }
            if (!info[state.type]) {
                info[state.type] = {};
            }
            state.progress.forEach(progress => {
                if (!info[state.type][progress.round]) {
                    info[state.type][progress.round] = {};
                }
                if (!info[state.type][progress.round][progress.type]) {
                    info[state.type][progress.round][progress.type] = {};
                }
                info[state.type][progress.round][progress.type][progress.arg] = progress.num;
            })
            this._updateRewars(state.type, state.rewards);
        });
        this.model.excitingActInfo = info;

        /**升级有礼全服剩余奖励数量 */
        resp.limit.forEach(limit => {
            this.model.excitingActOfUpgradeLimitInfo[limit.taskId] = limit.limit;
        });

        /**累充当前周期 */
        gdk.e.emit(ActivityEventId.ACTIVITY_STAR_GIFTS_REWARD_TYPE_UPDATE);
        gdk.e.emit(ActivityEventId.ACTIVITY_EXCITING_ACT_INFO_UPDATE);
    }

    /**精彩活动 进度信息更新 */
    _onExcitingActivityProgressRsp(resp: icmsg.ExcitingActivityProgressRsp) {
        let actIds = [37, 38, 39, 40, 32, 33, 41, 50];
        if (!ActUtil.ifActOpen(actIds[resp.type - 1])) {
            //活动未开启 不处理
            return;
        }
        let info = this.model.excitingActInfo || {};
        if (!info[resp.type]) {
            info[resp.type] = {};
        }

        if (!info[resp.type][resp.progress.round]) {
            info[resp.type][resp.progress.round] = {};
        }

        if (!info[resp.type][resp.progress.round][resp.progress.type]) {
            info[resp.type][resp.progress.round][resp.progress.type] = {};
        }
        info[resp.type][resp.progress.round][resp.progress.type][resp.progress.arg] = resp.progress.num;
        this.model.excitingActInfo = info;
        if (resp.type == subActType.starGift) {
            let cfgs = ConfigManager.getItems(Activity_star_giftsCfg, (cfg: Activity_star_giftsCfg) => {
                if (cfg.reward_type == this.model.excitingAcrOfStarGiftRewardType
                    && cfg.rounds == this.model.excitingAcrOfStarGiftRounds) {
                    return true;
                }
            });
            cfgs.sort((a, b) => { return a.taskid - b.taskid; });
            if (ActivityUtils.getExcitingActTaskState(cfgs[cfgs.length - 1].taskid) >= 1) {
                this.model.excitingAcrOfStarGiftRounds = Math.min(3, this.model.excitingAcrOfStarGiftRounds + 1);
            }
        }
        gdk.e.emit(ActivityEventId.ACTIVITY_EXCITING_ACT_INFO_UPDATE);
    }

    /**精彩活动领取奖励 */
    _onExcitingActivityRewardsRsp(resp: icmsg.ExcitingActivityRewardsRsp) {
        this.model.excitingRewards[resp.taskId] = 1;
        gdk.e.emit(ActivityEventId.ACTIVITY_EXCITING_ACT_INFO_UPDATE);
    }

    /**升级有礼全服剩余奖励数量 */
    _onExcitingActivityUpgradeLimitRsp(resp: icmsg.ExcitingActivityUpgradeLimitRsp) {
        resp.limit.forEach(limit => {
            this.model.excitingActOfUpgradeLimitInfo[limit.taskId] = limit.limit;
        });
        gdk.e.emit(ActivityEventId.ACTIVITY_EXCITING_ACT_INFO_UPDATE);
    }

    /**更新奖励位图 */
    _updateRewars(type: number, rewards: number[]) {
        let actId = [37, 38, 39, 40, 32, 33, 41][type - 1];
        let cfg = ActUtil.getCfgByActId(actId);
        let rewardType = type == subActType.starGift ? this.model.excitingAcrOfStarGiftRewardType : cfg.reward_type;
        rewardType = type == subActType.continuous ? this.model.excitingActOfContinuousCycle : rewardType;
        let excitingActRewards = this.model.excitingRewards;
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    let id = type * 10000 + (j + 1) + i * 8 + (type != subActType.upgrade ? rewardType * 100 : 100);
                    excitingActRewards[id] = 1;
                }
            }
        }
        this.model.excitingRewards = excitingActRewards;
    }

    /**每日首充--充值信息 */
    _onPayDailyFirstInfoRsp(resp: icmsg.PayDailyFirstInfoRsp) {
        this.model.dailyRechargeProto = true;
        this.model.dailyRechargeRewarded = resp.isRewarded;
        this.model.dailyPayMoney = resp.payedMoney;
        this.model.worldAvgLv = resp.worldLevel;
    }

    /**幸运翻牌信息 */
    _onFlipCardInfoRsp(resp: icmsg.FlipCardInfoRsp) {
        this.model.flipCardRecived = false;
        this.model.flipCardLeftDiamondTimes = resp.diamondTimes;
        this.model.filpCardSpReward = resp.sPRewardId;
        this.model.flipCardFlipInfo = {};
        resp.flippedRewards.forEach(info => {
            this.model.flipCardFlipInfo[info.index] = info.goods;
            let spRewardItem = ConfigManager.getItemById(Operation_bestCfg, resp.sPRewardId[resp.turnId - 1]).award;
            if (resp.sPRewardId[resp.turnId - 1] && spRewardItem[0] == info.goods.typeId && spRewardItem[1] == info.goods.num) {
                this.model.flipCardRecived = true;
            }
        });
        if (resp.flippedRewards.length == 0) GlobalUtil.setLocal('flippedInfo', {}, true);
        this.model.flipCardTurnNum = resp.turnId;
    }

    /**幸运翻牌特殊奖励选择 */
    _onFlipCardSpRrewardRsp(resp: icmsg.FlipCardSPRewardRsp) {
        this.model.flipCardRecived = false;
        if (this.model.filpCardSpReward.length < this.model.flipCardTurnNum) {
            this.model.filpCardSpReward.push(resp.spRewardId);
        }
        else {
            this.model.filpCardSpReward[this.model.flipCardTurnNum - 1] = resp.spRewardId;
        }
        this.model.filpCardSpReward = this.model.filpCardSpReward;
    }

    /**幸运翻牌抽奖结果 */
    _onFlipCardRewardRsp(resp: icmsg.FlipCardRewardRsp) {
        let spRewardId = this.model.filpCardSpReward[this.model.flipCardTurnNum - 1];
        let spRewardItem = ConfigManager.getItemById(Operation_bestCfg, spRewardId).award;
        let goodsInfo = new icmsg.GoodsInfo();
        goodsInfo.typeId = resp.itemId;
        goodsInfo.num = resp.reward[0].num;
        if (spRewardId && spRewardItem[0] == resp.itemId && spRewardItem[1] == resp.reward[0].num) {
            this.model.flipCardRecived = true;
        }
        this.model.flipCardFlipInfo[resp.index] = goodsInfo;
        let localFlippedInfo = GlobalUtil.getLocal('flippedInfo', true);
        if (!localFlippedInfo) localFlippedInfo = {};
        localFlippedInfo[resp.index] = goodsInfo;
        GlobalUtil.setLocal('flippedInfo', localFlippedInfo, true);
    }

    /**幸运翻牌选择下一轮 */
    _onFlipCardNextTurnRsp(resp: icmsg.FlipCardNextTurnRsp) {
        GlobalUtil.setLocal('flippedInfo', {}, true);
        this.model.flipCardFlipInfo = {};
        // this.model.filpCardSpReward = [];
        this.model.flipCardRecived = false;
        this.model.flipCardTurnNum = resp.nextTurnId;
    }

    /**扭蛋信息 */
    _onDrawEggInfoRsp(resp: icmsg.DrawEggInfoRsp) {
        this.model.isFirstDraw = resp.isFirstDraw;
        this.model.twistedLeftDiamondTimes = resp.diamondRemain;
        this.model.twistedSpReward = resp.sPWishId;
        this.model.twistedGuaranteeNum = resp.guaranteeRemain;
    }

    //**扭蛋设置特殊奖励 */
    _onDrawEggSpRewardRsp(resp: icmsg.DrawEggSPRewardRsp) {
        this.model.twistedGuaranteeNum = resp.sPRewardGuarantee;
        this.model.twistedSpReward = resp.sPRewardId;
    }

    /**扭蛋抽奖 */
    _onDrawEggAwardRsp(resp: icmsg.DrawEggAwardRsp) {
        let sp = this.model.twistedSpReward;
        let curWishHero;
        if (sp) {
            curWishHero = ConfigManager.getItemById(Operation_wishCfg, sp).hero;
        }
        if (curWishHero) {
            for (let i = 0; i < resp.reward.length; i++) {
                if (resp.reward[i].typeId == curWishHero) {
                    this.model.twistedGuaranteeNum = null;
                    this.model.twistedSpReward = null;
                    return;
                }
            }
        }
    }

    /**奇趣娃娃机次数 */
    _onLuckDrawSummonStateRsp(resp: icmsg.LuckyDrawSummonStateRsp) {
        this.model.advLuckyDrawDiamondTimes = resp.gems;
        this.model.advLuckyDrawFreeTimes = resp.free;
        this.model.advLuckyOptionalId = resp.optional;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**奇趣娃娃机自选池子 */
    _onLuckyDrawOptionalRsp(resp: icmsg.LuckyDrawOptionalRsp) {
        this.model.advLuckyOptionalId = resp.optional;
    }

    _onCarnivalPlayerServerRankRsp(resp: icmsg.CarnivalPlayerServerRankRsp) {
        this.model.roleServerRank = resp;
    }
    //跨服任务数据
    _onCarnivalInfoRsp(resp: icmsg.CarnivalInfoRsp) {
        this.model.cServerPersonData = resp;
    }

    /**周末福利信息 */
    _onActivityWeekendGiftInfoRsp(resp: icmsg.ActivityWeekendGiftInfoRsp) {
        this.model.weekEndRecord = resp.record;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**周末福利领奖 */
    _onActivityWeekendGiftRsp(resp: icmsg.ActivityWeekendGiftRsp) {
        this.model.weekEndRecord = resp.record;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**开服 8天登陆 */
    _onActivityLandGiftInfoRsp(resp: icmsg.ActivityLandGiftInfoRsp) {
        this.model.kfLoginDays = resp.day;
        this.model.kfLoginDaysReward = resp.record;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**开服 8天登陆领奖 */
    _onActivityLandGiftAwardRsp(resp: icmsg.ActivityLandGiftAwardRsp) {
        this.model.kfLoginDaysReward = resp.record;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**跨服寻宝 */
    _onCrossTreasureStateRsp(resp: icmsg.CrossTreasureStateRsp) {
        this.model.cTreasureCurTurn = resp.round;
        this.model.cTreasureHasFreeTime = resp.freeNum;
        this.model.cTreasureRefreshTime = resp.refreshTime;
        this.model.cTreasureItemNum = resp.itemNum;
        this.model.cTreasureDayTurn = resp.dayRound;
        this.model.cTreasureOrderName = {};
        resp.orderName.forEach(l => {
            this.model.cTreasureOrderName[l.order] = l.names;
        })
    }

    /**跨服寻宝 主动推送 */
    _onCrossTreasureNumRsp(resp: icmsg.CrossTreasureNumRsp) {
        this.model.cTreasureRefreshTime = resp.refreshTime;
        this.model.cTreasureItemNum = resp.itemNum;
        let temp = [...this.model.cTreasureRecord, ...resp.record];
        temp.sort((a, b) => { return b.time - a.time; });
        this.model.cTreasureRecord = temp;
        this.model.cTreasureDayTurn = resp.dayRound;
        resp.orderName.forEach(l => {
            if (!this.model.cTreasureOrderName[l.order]) this.model.cTreasureOrderName[l.order] = [];
            this.model.cTreasureOrderName[l.order] = this.model.cTreasureOrderName[l.order].concat(l.names);
        })
        gdk.e.emit(ActivityEventId.ACTIVITY_CROSS_TREASURE_INFO_UPDATE);
    }

    /**跨服寻宝 日志 */
    _onCrossTreasureRecordListRsp(resp: icmsg.CrossTreasureRecordListRsp) {
        resp.record.sort((a, b) => { return b.time - a.time; });
        this.model.cTreasureRecord = resp.record;
    }

    /**跨服寻宝 抽奖返回 */
    _onCrossTreasureRsp(resp: icmsg.CrossTreasureRsp) {
        this.model.cTreasureHasFreeTime = resp.freeNum;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    //幸运扭蛋领取状态
    _onTwistEggStateRsp(data: icmsg.TwistEggStateRsp) {
        this.model.luckyTwistEggRewarded = data.rewarded
        this.model.luckyTwistEggWished = data.wishIdxs
        let cfgs = ConfigManager.getItems(Twist_eggCfg)
        let types = []
        cfgs.forEach(element => {
            if (types.indexOf(element.type) == -1) {
                types.push(element.type)
            }
        });
        this.model.luckyTwistEggSubType = data.subType > types.length ? types.length : data.subType
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    //护使秘境
    _onGuardianTowerStateRsp(data: icmsg.GuardianTowerStateRsp) {
        let model = ModelManager.get(GuardianTowerModel)
        model.stateInfo = data;
    }

    //守护者召唤有礼
    _onActivityGuardianDrawInfoRsp(data: icmsg.ActivityGuardianDrawInfoRsp) {
        let model = ModelManager.get(GuardianModel)
        model.callRewardInfo = data;
    }

    //矿洞大冒险活动信息
    _onActCaveInfoRsp(resp: icmsg.ActivityCaveAdventureInfoRsp) {
        this.model.caveCurLayer = resp.nowLayer;
        this.model.caveExplore = resp.explore;
        this.model.caveKeys = resp.key;
        this.model.caveLayerInfos = [];
        resp.layerList.forEach(l => {
            let obj: CaveLayerInfo = {
                layer: l.layer,
                plate: l.plate,
                passMap: this._finalCheckRewards(l.passedPlate, {}),
                boxState: l.rewardedBox
            };
            this.model.caveLayerInfos.push(obj);
        });
        gdk.e.emit(ActivityEventId.ACTIVITY_CAVE_INFO_UPDATE);
    }

    //矿洞大冒险走格子
    _onActCaveMoveRsp(resp: icmsg.ActivityCaveAdventureMoveRsp) {
        this.model.caveExplore = resp.explore;
        this.model.caveKeys = resp.key;
        this.model.caveLayerInfos[this.model.caveCurLayer - 1].plate = resp.newPlate;
        //todo
        let map = this.model.caveLayerInfos[this.model.caveCurLayer - 1].passMap
        this.model.caveLayerInfos[this.model.caveCurLayer - 1].passMap = this._finalCheckRewards(resp.passedPlate, map);
        gdk.e.emit(ActivityEventId.ACTIVITY_CAVE_INFO_UPDATE);
    }

    //矿洞大冒险领取宝箱
    _onActCaveGainBoxRsp(resp: icmsg.ActivityCaveAdventureGainBoxRsp) {
        this.model.caveLayerInfos[this.model.caveCurLayer - 1].boxState = true;
        gdk.e.emit(ActivityEventId.ACTIVITY_CAVE_INFO_UPDATE);
    }

    _finalCheckRewards(intReward: number[], rewardIds) {
        let idsArray = [];
        for (let i = 0; i < intReward.length; i += 2) {
            idsArray.push([intReward[i], intReward[i + 1]]);
        }
        idsArray.forEach(ids => {
            let minId = ids[0];
            let maxId = ids[1];
            while (minId <= maxId) {
                rewardIds[minId] = 1;
                minId += 1;
            }
        });
        return rewardIds;
    }

    /**专属英雄升星活动 信息 */
    _onActivityAwakeGiftInfoRsp(resp: icmsg.ActivityAwakeGiftInfoRsp) {
        this.model.awakeHeroId = resp.heroId;
        this.model.awakeStarUpGiftMap = {};
        resp.list.forEach(l => {
            this.model.awakeStarUpGiftMap[l.totalStar] = l;
        });
        this.model.awakeStarUpGiftMap = this.model.awakeStarUpGiftMap;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**专属英雄升星活动 设置英雄 */
    _onActivityAwakeGiftSetRsp(resp: icmsg.ActivityAwakeGiftSetRsp) {
        this.model.awakeHeroId = resp.heroId;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**专属英雄升星活动 领取奖励 */
    _onActivityAwakeGiftGainRsp(resp: icmsg.ActivityAwakeGiftGainRsp) {
        this.model.awakeStarUpGiftMap[resp.info.totalStar] = resp.info;
        this.model.awakeStarUpGiftMap = this.model.awakeStarUpGiftMap;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**神装定制 状态 */
    _onCostumeCustomStateRsp(resp: icmsg.CostumeCustomStateRsp) {
        this.model.costumeCustomScore = resp.score;
        this.model.costumeCustomRewards = {};
        resp.scoreRecord.forEach(s => {
            if (s > 0) {
                this.model.costumeCustomRewards[s] = 1;
            }
        })
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**神装定制 积分变更 */
    _onCostumeCustomScoreUpdateRsp(resp: icmsg.CostumeCustomScoreUpdateRsp) {
        this.model.costumeCustomScore = resp.score;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**神装定制 领取积分奖励 */
    _onCostumeCustomScoreRsp(resp: icmsg.CostumeCustomScoreRsp) {
        this.model.costumeCustomRewards[resp.score] = 1;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**灵力者集结 状态 */
    _onActivityAssembledInfoRsp(resp: icmsg.ActivityAssembledInfoRsp) {
        this.model.assembledState = resp.state;
    }


    /**砍价大礼包 */
    _onActivityDiscountStateRsp(resp: icmsg.ActivityDiscountStateRsp) {
        this.model.discountData = resp.gifts;
    }

    /**远航寻宝状态 */
    _onActivitySailingInfoRsp(resp: icmsg.ActivitySailingInfoRsp) {
        let model = ModelManager.get(SailingModel)
        model.sailingInfo = resp;
    }

    /**宝藏旅馆 状态 */
    _onActivityHotelStateRsp(data: icmsg.ActivityHotelStateRsp) {
        this.model.hotelDailyReward = data.freeFlag
        this.model.hotelCleanNum = data.cleanNum
        data.layers.forEach(layer => {
            this.model.hotelLayers[layer.layer] = layer
        });
    }

    /**限时礼包 */
    _onActivityTimeGiftInfoRsp(data: icmsg.ActivityTimeGiftInfoRsp) {

        let oldGiftIds = []
        this.model.LimitGiftDatas.forEach(data => {
            oldGiftIds.push(data.giftId);
        })
        let have = false;
        this.model.LimitGiftDatas = data.info;
        let view = gdk.gui.getCurrentView();
        if (view === gdk.panel.get(PanelId.PveScene)) {
            let model = view.getComponent(PveSceneCtrl).model;
            let temType = 0;
            if (model.stageConfig) {
                data.info.forEach(d => {
                    let cfg = ConfigManager.getItemById(Store_time_giftCfg, d.giftId)
                    if (cfg.copy_id == model.stageConfig.copy_id) {
                        have = oldGiftIds.indexOf(d.giftId) >= 0;
                        temType = cfg.copy_id
                    }
                })
            }
            switch (temType) {
                case 1:
                    this.model.mainShowView = !have;
                    break;
                case 5:
                    this.model.towerShowView = !have;
                    break;
                case 15:
                    this.model.wuhunShowView = !have;
                    break
            }
        }
        // this.model.hotelDailyReward = data.freeFlag
        // this.model.hotelCleanNum = data.cleanNum
        // data.layers.forEach(layer => {
        //     this.model.hotelLayers[layer.layer] = layer
        // });
    }

    //神秘来客
    _onActivityMysteriousInfoRsp(data: icmsg.ActivityMysteriousInfoRsp) {
        this.model.mysteryVisitorTotal = data.total;
        this.model.mysteryVisitorState = data.state;
    }

    //皇家竞技场
    _onRoyalInfoRsp(data: icmsg.RoyalInfoRsp) {
        let model = ModelManager.get(RoyalModel)
        model.mapIds = data.mapIds;
        model.rank = data.rank;
        model.score = data.score;
        model.matchNum = data.matchNum;
        model.division = data.div ? data.div : 1;
        model.serverNum = data.serverNum;
        model.divFlag = data.divFlag;
        model.enterNum = data.enterNum;
        model.buyNum = data.buyNum;
    }


    //七日之战
    _onDungeonSevenDayStateRsp(data: icmsg.DungeonSevenDayStateRsp) {
        this.model.sevenDayWarInfo = data
    }

    //超值购 信息
    _onActivitySuperValueInfoRsp(resp: icmsg.ActivitySuperValueInfoRsp) {
        this.model.superValueInfo = {};
        resp.infos.forEach(l => {
            this.model.superValueInfo[l.day] = l;
        });
        this.model.superValueInfo = this.model.superValueInfo;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    //超值购 领取奖励
    _onActivitySuperValueGainRsp(resp: icmsg.ActivitySuperValueGainRsp) {
        this.model.superValueInfo[resp.info.day] = resp.info;
        this.model.superValueInfo = this.model.superValueInfo;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    //超值购 活动激活提示
    _onActivitySuperValueNoticeRsp(resp: icmsg.ActivitySuperValueNoticeRsp) {
        this.model.superValueInfo[resp.info.day] = resp.info;
        this.model.superValueInfo = this.model.superValueInfo;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }
}