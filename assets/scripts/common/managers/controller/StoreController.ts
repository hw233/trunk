import ActivityModel from '../../../view/act/model/ActivityModel';
import ActUtil from '../../../view/act/util/ActUtil';
import AdventureModel from '../../../view/adventure/model/AdventureModel';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import CopyModel from '../../models/CopyModel';
import GlobalUtil from '../../utils/GlobalUtil';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import NewAdventureModel from '../../../view/adventure2/model/NewAdventureModel';
import RelicModel from '../../../view/relic/model/RelicModel';
import RoleModel from '../../models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import StoreModel from '../../../view/store/model/StoreModel';
import {
    Activity_assembledCfg,
    Operation_storeCfg,
    Store_awake_giftCfg,
    Store_awakeCfg,
    Store_chargeCfg,
    Store_giftCfg,
    Store_miscCfg,
    Store_monthcardCfg,
    Store_onepriceCfg,
    Store_pushCfg,
    Store_sevenday_war_giftCfg,
    Store_star_giftCfg,
    Store_time_giftCfg,
    StoreCfg
    } from '../../../a/config';
import { RedPointEvent } from '../../utils/RedPointUtils';
import { RelicEventId } from '../../../view/relic/enum/RelicEventId';
import { StoreEventId } from '../../../view/store/enum/StoreEventId';
import { StoreType } from '../../../view/store/enum/StoreType';

export default class StoreController extends BaseController {

    model: StoreModel = null;

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.StoreBlackMarketListRsp.MsgType, this._onBlackStoreList],
            [icmsg.StoreBlackMarketRefreshRsp.MsgType, this.onRefreshBlack],
            [icmsg.StoreBlackMarketBuyRsp.MsgType, this.onBuyBlackItem],
            [icmsg.StoreListRsp.MsgType, this.onStoreInfo],
            [icmsg.StoreBuyRsp.MsgType, this.onBuyStoreItem],
            [icmsg.PayOrderRsp.MsgType, this.onPayOrder],
            [icmsg.PaySuccRsp.MsgType, this.onPaySucc],
            [icmsg.StoreGiftListRsp.MsgType, this.onStoreGiftList],
            [icmsg.StoreGiftUpdateRsp.MsgType, this.onStoreGiftUpdate],
            [icmsg.MonthCardListRsp.MsgType, this.onMonthCardList],
            [icmsg.PayFirstListRsp.MsgType, this.onPayFirstList],
            [icmsg.PayFirstRewardRsp.MsgType, this.onPayFirstReward],
            [icmsg.PayFirstUpdateRsp.MsgType, this.onPayFirstUpdate],
            [icmsg.MonthCardUpdateRsp.MsgType, this.onMonthCardUpdate],
            [icmsg.MonthCardDungeonInfoRsp.MsgType, this.onMonthCardDungeonInfo],
            [icmsg.MonthCardDungeonChooseRsp.MsgType, this.onMonthCardDungeonChoose],
            [icmsg.MonthCardDayRewardRsp.MsgType, this.onMonthCardDayReward],
            [icmsg.StorePushListRsp.MsgType, this._onStorePushListRsp],
            [icmsg.StorePushEventsRsp.MsgType, this._onStorePushEventsRsp],
            [icmsg.StorePushNoticeRsp.MsgType, this._onStorePushNoticeRsp],
            [icmsg.StorePushBuyRsp.MsgType, this._onStorePushBuyRsp],
            [icmsg.PassListRsp.MsgType, this._onPassListRsp],
            [icmsg.PassAwardRsp.MsgType, this._onPassAwardRsp],
            [icmsg.StoreMiscGiftPowerAwardRsp.MsgType, this._onStoreMiscGiftPowerAwardRsp],
            [icmsg.Store7daysBoughtRsp.MsgType, this._onStore7daysBoughtRsp],
            [icmsg.GrowthfundListRsp.MsgType, this._onGrowthFundListRsp],
            [icmsg.GrowthfundAwardRsp.MsgType, this._onGrowthFundAwardRsp],
            [icmsg.TowerfundListRsp.MsgType, this._onTowerfundListRsp],
            [icmsg.TowerfundAwardRsp.MsgType, this._onTowerfundAwardRsp],
            [icmsg.MonthCardQuickCombatInfoRsp.MsgType, this._onMonthCardQuickCombatInfoRsp],
            [icmsg.PassFundListRsp.MsgType, this._onPassFundListRsp],
            [icmsg.StoreRuneListRsp.MsgType, this._onRuneStoreList],
            [icmsg.StoreRuneRefreshRsp.MsgType, this.onRefreshRune],
            [icmsg.StoreRuneBuyRsp.MsgType, this.onBuyRuneItem],
            [icmsg.ActivityStoreBuyRsp.MsgType, this.onBuyStoreItem],
            [icmsg.TimeLimitGiftRsp.MsgType, this.onTimeLimitGiftRsp],
            [icmsg.StoreSiegeListRsp.MsgType, this._onStoreSiegeListRsp],
            [icmsg.PassWeeklyListRsp.MsgType, this._onPassWeeklyListRsp],
            [icmsg.PassWeeklyAwardRsp.MsgType, this._onPassWeeklyAwardRsp],
            [icmsg.HeroAwakeGiftRsp.MsgType, this._onHeroAwakeGiftRsp],
            [icmsg.HeroAwakeGiftUpdateRsp.MsgType, this._onHeroAwakeGiftUpdateRsp],
            [icmsg.StoreUniqueEquipListRsp.MsgType, this._onStoreUniqueEquipListRsp],
            [icmsg.StoreUniqueEquipRefreshRsp.MsgType, this._onStoreUniqueEquipRefreshRsp],
        ];
    }

    onStart() {
        this.model = ModelManager.get(StoreModel);
    }

    onEnd() {
        this.model = null;
    }

    _onBlackStoreList(data: icmsg.StoreBlackMarketListRsp) {
        data.store.time *= 1000
        this.model.blackInfo = data.store
    }

    onRefreshBlack(data: icmsg.StoreBlackMarketRefreshRsp) {
        data.store.time *= 1000
        this.model.blackInfo = data.store
    }

    onBuyBlackItem(data: icmsg.StoreBlackMarketBuyRsp) {
        let items = this.model.blackInfo.item
        items[data.position].count = 1
        gdk.e.emit(StoreEventId.UPDATE_BLACK_ITEM, data.position)
        GlobalUtil.openRewadrView(data.list)
    }

    _onRuneStoreList(data: icmsg.StoreRuneListRsp) {
        this.model.runeInfo = {};
        data.list.forEach(item => {
            this.model.runeInfo[item.id] = item;
        });
        this.model.runeRefreshNum = data.refreshNum;
        gdk.e.emit(StoreEventId.UPDATE_RUNE_ITEM)
    }

    onRefreshRune(data: icmsg.StoreRuneRefreshRsp) {
        this.model.runeInfo = {};
        data.list.forEach(item => {
            this.model.runeInfo[item.id] = item;
        });
        this.model.runeRefreshNum = data.refreshNum;
        gdk.e.emit(StoreEventId.UPDATE_RUNE_ITEM)
    }

    onBuyRuneItem(data: icmsg.StoreRuneBuyRsp) {
        (<icmsg.StoreRuneItem>this.model.runeInfo[data.id]).count += 1;
        GlobalUtil.openRewadrView(data.list)
        gdk.e.emit(StoreEventId.UPDATE_RUNE_ITEM)
    }

    onStoreInfo(data: icmsg.StoreListRsp) {
        this.model.storeInfo = {}
        for (let index = 0; index < data.info.length; index++) {
            const element = data.info[index];
            this.model.storeInfo[element.id] = element
        }
        let msg = new icmsg.ActivityStoreBuyInfoReq()
        msg.activityId = 40
        NetManager.send(msg, (rsp: icmsg.ActivityStoreBuyInfoRsp) => {
            for (let i = 0; i < rsp.info.length; i++) {
                const element = rsp.info[i];
                this.model.storeInfo[element.id] = element
            }
            gdk.e.emit(StoreEventId.UPDATE_SHOP_INFO)
        })
        gdk.e.emit(StoreEventId.UPDATE_SHOP_INFO)
    }

    onBuyStoreItem(data: icmsg.StoreBuyRsp) {
        let storeInfo = this.model.storeInfo
        let cfg = ConfigManager.getItemById(StoreCfg, data.info.id)
        if (cfg && cfg.type == StoreType.SIEGE) {
            let info = this.model.siegeItems[data.info.id]
            info.count = data.info.count
            gdk.e.emit(StoreEventId.UPDATE_SIEGE_SHOP_ITEM, data.info.id)
        } else if (cfg && cfg.type == StoreType.UNIQUE) {
            let info = this.model.uniqueItems[data.info.id]
            info.count = data.info.count
            gdk.e.emit(StoreEventId.UPDATE_UNIQUE_SHOP_ITEM, data.info.id)
        }
        else {
            storeInfo[data.info.id] = data.info
            gdk.e.emit(StoreEventId.UPDATE_SHOP_ITEM, data.info.id)
        }
        GlobalUtil.openRewadrView(data.list)
    }

    onPayOrder(data: icmsg.PayOrderRsp) {
        let itemName = '';
        let paymentDes = '';
        let paymentId = data.paymentId;

        if (paymentId >= 1900000) {
            let cfg = ConfigManager.getItemById(Store_sevenday_war_giftCfg, paymentId);
            itemName = `${cfg.gift_name}`;
            paymentDes = "购买" + cfg.gift_name;
        } else if (paymentId >= 1800000) {
            let cfg = ConfigManager.getItemById(Store_time_giftCfg, paymentId);
            itemName = `${cfg.gift_name}`;
            paymentDes = "购买" + cfg.gift_name;
        } else if (paymentId >= 1700000) {
            let cfg = ConfigManager.getItemById(Activity_assembledCfg, paymentId);
            itemName = `${cfg.name}`;
            paymentDes = "购买" + cfg.name;
        } else if (paymentId > 1600000) {
            let cfg = ConfigManager.getItemById(Store_awake_giftCfg, paymentId);
            itemName = `${cfg.gift_name}`;
            paymentDes = "购买" + cfg.gift_name;
        }
        else if (paymentId > 1500000) {
            let cfg = ConfigManager.getItemById(Store_star_giftCfg, paymentId);
            itemName = `${cfg.gift_name}`;
            paymentDes = "购买" + cfg.gift_name;
        }
        else if (paymentId > 1300000 || paymentId > 1400000) {
            let cfg = ConfigManager.getItemById(Operation_storeCfg, paymentId);
            itemName = `${cfg.name}`;
            paymentDes = "购买" + cfg.name;
        }
        else if (paymentId > 1200000) {
            let cfg = ConfigManager.getItemById(Store_awakeCfg, paymentId);
            itemName = `${cfg.tag_name}`;
            paymentDes = "购买" + cfg.tag_name;
        }
        else if (paymentId > 800000 || paymentId > 900000) {
            let cfg = ConfigManager.getItemById(Operation_storeCfg, paymentId);
            itemName = `${cfg.name}`;
            paymentDes = "购买" + cfg.name;
        }
        else if (paymentId > 700000) {
            let cfg = ConfigManager.getItemById(Store_miscCfg, paymentId);
            itemName = cfg.name;
            paymentDes = "购买" + cfg.name;
        }
        else if (paymentId > 600000) {
            let cfg = ConfigManager.getItemById(Store_pushCfg, paymentId);
            itemName = cfg.name;
            paymentDes = "购买" + cfg.name;
        } else if (paymentId > 500000) {
            let cfg = ConfigManager.getItemById(Store_monthcardCfg, paymentId);
            itemName = cfg.name;
            paymentDes = "购买" + cfg.name;
        }
        else if (paymentId > 20000) {
            let cfg = ConfigManager.getItemByField(Store_onepriceCfg, 'id', paymentId);
            itemName = cfg.name;
            paymentDes = "购买" + cfg.name;
        } else if (paymentId > 10000 && paymentId < 100000) {
            let cfg = ConfigManager.getItemById(Store_giftCfg, paymentId);
            itemName = cfg.name;
            paymentDes = "购买特权卡-" + cfg.name;

        } else if (paymentId < 100) {
            let cfg = ConfigManager.getItemById(Store_chargeCfg, paymentId);
            itemName = cfg.name;
            paymentDes = "购买" + cfg.name;

        } else {
            cc.error("充值物品ID错误", paymentId);
            return;
        }
        SdkTool.tool.pay(data, itemName, paymentDes);
    }

    onPaySucc(data: icmsg.PaySuccRsp) {
        this.model.vipPreLv = ModelManager.get(RoleModel).vipLv
        this.model.vipPreExp = ModelManager.get(RoleModel).vipExp

        if (data.paymentId == 700001) {
            this.model.isBuyPassPort = true;
            gdk.e.emit(StoreEventId.UPDATE_PASS_PORT);
        }
        else if (data.paymentId == 700002) {
            this.model.isBuyOneDollarGift = true;
        }
        else if (data.paymentId == 700008) {
            ModelManager.get(AdventureModel).isBuyPassPort = true;
            ModelManager.get(NewAdventureModel).isBuyPassPort = true;
        } else if (data.paymentId == 700009) {
            ModelManager.get(RelicModel).isBuyPassPort = true;
            gdk.e.emit(RelicEventId.UPDATE_RELIC_PASS_PORT);
        } else if (data.paymentId == 700010) {
            this.model.isBuyWeeklyPassPort = true;
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        }
        if (this.model.rechargeList.indexOf(data.paymentId) == -1) {
            this.model.rechargeList.push(data.paymentId);
        }
        this.model.firstPaySum += SdkTool.tool.getRealRMBCost(data.money);
        gdk.e.emit(StoreEventId.UPDATE_PAY_SUCC, data)
        //充值成功请求签到信息
        let msg = new icmsg.SignInfoReq()
        NetManager.send(msg)

        //宝藏旅馆开启 请求消费信息，红点提示
        if (ActUtil.ifActOpen(125)) {
            let msgHotel = new icmsg.ActivityHotelStateReq()
            NetManager.send(msgHotel)
        }
    }

    onStoreGiftList(data: icmsg.StoreGiftListRsp) {
        this.model.giftBuyList = data.info;
        data.info.forEach(info => {
            this.model.storeInfo[info.id] = info;
        })
        gdk.e.emit(StoreEventId.UPDATE_STORE_GIFT_LIST)
    }

    onStoreGiftUpdate(data: icmsg.StoreGiftUpdateRsp) {
        let list = this.model.giftBuyList;
        let isNew = true;
        list.forEach(element => {
            if (element.id == data.info.id) {
                element.count = data.info.count
                isNew = false;
            }
        });
        if (isNew) {
            list.push(data.info);
        }
        this.model.giftBuyList = list;
        list.forEach(info => {
            this.model.storeInfo[info.id] = info;
        })
    }

    onPayFirstList(data: icmsg.PayFirstListRsp) {
        this.model.firstPaySum = SdkTool.tool.getRealRMBCost(data.firstPaySum);
        this.model.rechargeList = data.paymentIds
        this.model.firstPayList = data.list;
        ModelManager.get(ActivityModel).historyPaySum = data.paySum;
        ModelManager.get(ActivityModel).dayRecharge = data.paySumDay;
        if (data.list.length > 0) {
            this.model.firstPayTime = data.list[0].firstPayTime * 1000;
        } else {
            this.model.firstPayTime = 0;
        }
        this.model.firstPayList.sort((a, b) => a.grade - b.grade);
        gdk.e.emit(StoreEventId.UPDATE_SHOP_INFO)
    }

    onPayFirstUpdate(data: icmsg.PayFirstUpdateRsp) {
        if (this.model.rechargeList.indexOf(data.id) == -1) {
            this.model.rechargeList.push(data.id);
        }
        let list = this.model.firstPayList;
        data.grade.forEach(grade => {
            let exist = list.some(i => i.grade == grade);
            if (!exist) {
                // 在可领取奖励列表中不存在，则创建新项
                let item = new icmsg.PayFirstList();
                item.grade = grade;
                item.firstPayTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                item.rewarded = 0;
                list.push(item);
                list.sort((a, b) => a.grade - b.grade);
            }
        });
        if (list.length > 0) {
            this.model.firstPayTime = list[0].firstPayTime * 1000;
        } else {
            this.model.firstPayTime = 0;
        }
        gdk.e.emit(StoreEventId.UPDATE_PAY_FIRST, data.id)
    }

    /**
     处理首充奖励领取成功逻辑
     */
    onPayFirstReward(data: icmsg.PayFirstRewardRsp) {
        // this.model.firstPayRewarded = true;
        // this.model.firstPayRewarded |= 1 << 1;
        GlobalUtil.openRewadrView(data.list)
    }

    //特权卡列表，登录的时候请求返回
    onMonthCardList(data: icmsg.MonthCardListRsp) {
        this.model.monthCardListInfo = data.list;
    }

    //单张特权卡更新
    onMonthCardUpdate(data: icmsg.MonthCardUpdateRsp) {
        this.model.updateMonthCardInfo(data.info);
        gdk.e.emit(StoreEventId.UPDATE_MONTHCARD_RECEIVE);
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    //特权卡 双子战利 信息返回
    onMonthCardDungeonInfo(data: icmsg.MonthCardDungeonInfoRsp) {
        this.model.monthCardDungeon = data.info;
        gdk.e.emit(StoreEventId.UPDATE_MONTHCARD_RECEIVE);
    }

    //特权卡领取奖励返回
    onMonthCardDayReward(data: icmsg.MonthCardDayRewardRsp) {
        this.model.updateMonthCardInfo(data.info);
        GlobalUtil.openRewadrView(data.rewards);
        gdk.e.emit(StoreEventId.UPDATE_MONTHCARD_RECEIVE);
    }

    onMonthCardDungeonChoose(data: icmsg.MonthCardDungeonChooseRsp) {
        this.model.monthCardDungeon = data.info;
        gdk.e.emit(StoreEventId.UPDATE_MONTHCARD_RECEIVE);
    }

    //定向推送礼包列表
    _onStorePushListRsp(rsp: icmsg.StorePushListRsp) {
        this.model.starGiftDatas = rsp.list
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    //推送--事件列表
    _onStorePushEventsRsp(resp: icmsg.StorePushEventsRsp) {
        this.model.storePushEvents = resp.list;
    }

    //推送事件
    _onStorePushNoticeRsp(resp: icmsg.StorePushNoticeRsp) {
        // this.model.updateStorePushEvent(resp.event);
        // if (this.model.curPushGift) return;
        // let cfg = StoreUtils.getStorePushCfgTriggerByEvent(resp.event);
        // if (cfg) {
        //     GlobalUtil.setLocal(`gift_start_time`, { id: cfg.gift_id, startTime: ModelManager.get(ServerModel).serverTime })
        //     this.model.curPushGift = cfg;
        //     // GlobalUtil.openPushGiftPanel();
        //     let panel = gdk.panel.get(PanelId.LotteryEffect);
        //     if (!panel) {
        //         // console.log(`isOpenOrOpening: ${gdk.panel.isOpenOrOpening(PanelId.LotteryEffect)}`);
        //         // GlobalUtil.openPushGiftPanel();
        //         let lotteryView = gdk.panel.get(PanelId.Lottery);
        //         if (lotteryView) {
        //             let trigger = gdk.NodeTool.onStartShow(lotteryView);
        //             trigger.once(() => {
        //                 trigger.targetOff(this);
        //                 GlobalUtil.openPushGiftPanel();
        //             })
        //         }
        //     }
        //     else {
        //         let trigger = gdk.NodeTool.onStartHide(panel);
        //         trigger.once(() => {
        //             trigger.targetOff(this);
        //             GlobalUtil.openPushGiftPanel();
        //         })
        //     }
        // }
    }

    //购买礼包返回
    _onStorePushBuyRsp(rsp: icmsg.StorePushBuyRsp) {
        let data = []
        this.model.starGiftDatas.forEach(element => {
            if (element.giftId == rsp.gift.giftId) {
                element = rsp.gift
            }
            data.push(element)
        });
        this.model.starGiftDatas = data
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        GlobalUtil.openRewadrView(rsp.items);
    }

    /**通行证任务列表 */
    _onPassListRsp(resp: icmsg.PassListRsp) {
        this.model.isBuyPassPort = resp.bought;
        this.model.passPortFreeReward = resp.rewarded1;
        this.model.passPortChargeReward = resp.rewarded2;
        this.model.passPortsETime = resp.sETime;
    }

    /**通行任务领奖返回 */
    _onPassAwardRsp(resp: icmsg.PassAwardRsp) {
        this.model.passPortFreeReward = resp.rewarded1;
        this.model.passPortChargeReward = resp.rewarded2;
    }

    /**一元礼包奖励返回 */
    _onStoreMiscGiftPowerAwardRsp(resp: icmsg.StoreMiscGiftPowerAwardRsp) {
        this.model.isBuyOneDollarGift = resp.bought;
        this.model.oneDollarGiftReward = resp.flag;
    }

    /**七日狂欢商店购买历史 */
    _onStore7daysBoughtRsp(resp: icmsg.Store7daysBoughtRsp) {
        this.model.sevenStoreInfo = {};
        resp.list.forEach(info => {
            this.model.sevenStoreInfo[info.id] = info.count;
        })
    }

    // /**七日狂欢商店购买商品 */
    // _onStore7daysBuyRsp(resp: Store7daysBuyRsp) {
    //     if (!this.model.sevenStoreInfo) this.model.sevenStoreInfo = {};
    //     if (!this.model.sevenStoreInfo[resp.id]) this.model.sevenStoreInfo[resp.id] = 0;
    //     this.model.sevenStoreInfo[resp.id] += 1;
    // }

    /**成长基金列表 */
    _onGrowthFundListRsp(resp: icmsg.GrowthfundListRsp) {
        this.model.isBuyGrowFunds = resp.bought;
        this.model.growthFundsReward = resp.rewarded;
    }

    /**成长基金领奖 */
    _onGrowthFundAwardRsp(resp: icmsg.GrowthfundAwardRsp) {
        this.model.growthFundsReward = resp.rewarded;
    }

    /**试练塔基金列表 */
    _onTowerfundListRsp(resp: icmsg.GrowthfundListRsp) {
        this.model.isBuyTowerFunds = resp.bought;
        this.model.towerFundsReward = resp.rewarded;
    }

    /**试练塔基金领奖 */
    _onTowerfundAwardRsp(resp: icmsg.GrowthfundAwardRsp) {
        this.model.towerFundsReward = resp.rewarded;
    }

    /**快速作战剩余次数 */
    _onMonthCardQuickCombatInfoRsp(resp: icmsg.MonthCardQuickCombatInfoRsp) {
        let model = ModelManager.get(CopyModel);
        model.quickFightFreeTimes = resp.freeRemain;
        model.quickFightPayTimes = resp.payRemain;
        model.quickFightPayedTime = resp.payTimes;
    }

    /**超值基金，豪华基金信息返回 */
    _onPassFundListRsp(data: icmsg.PassFundListRsp) {
        this.model.goodFundsInfo = data.fund1
        this.model.betterFundsInfo = data.fund2
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    /**限时优惠礼包列表 */
    onTimeLimitGiftRsp(data: icmsg.TimeLimitGiftRsp) {
        if (this.model.limitGiftFirstPush) {
            this.model.limitGiftFirstPush = false
        } else {
            this.model.limitGiftPushInfo = data.gifts[0]
        }
        let allIds = this.model.limitGiftDatas.concat(data.gifts)
        GlobalUtil.sortArray(allIds, (a, b) => {
            return a.endTime - b.endTime
        })
        this.model.limitGiftDatas = allIds
    }

    _onStoreSiegeListRsp(data: icmsg.StoreSiegeListRsp) {
        let datas = {}
        for (let i = 0; i < data.list.length; i++) {
            datas[data.list[i].id] = data.list[i]
        }
        this.model.siegeItems = datas
    }

    _onStoreUniqueEquipListRsp(data: icmsg.StoreUniqueEquipListRsp) {
        let datas = {}
        for (let i = 0; i < data.list.length; i++) {
            datas[data.list[i].id] = data.list[i]
        }
        this.model.uniqueItems = datas
    }

    _onStoreUniqueEquipRefreshRsp(resp: icmsg.StoreUniqueEquipRefreshRsp) {
        let datas = {}
        for (let i = 0; i < resp.list.length; i++) {
            datas[resp.list[i].id] = resp.list[i]
        }
        this.model.uniqueItems = datas
    }

    /**周卡证任务列表 */
    _onPassWeeklyListRsp(resp: icmsg.PassWeeklyListRsp) {
        this.model.isBuyWeeklyPassPort = resp.bought;
        this.model.weeklyPassPortReward1 = resp.rewarded1;
        this.model.weeklyPassPortReward2 = resp.rewarded2;
        this.model.weeklyPassPortsETime = resp.sETime;
        gdk.e.emit(StoreEventId.UPDATE_WEEKLY_PASS_PORT);
    }

    /**周卡领奖 */
    _onPassWeeklyAwardRsp(resp: icmsg.PassWeeklyAwardRsp) {
        this.model.weeklyPassPortReward1 = resp.rewarded1;
        this.model.weeklyPassPortReward2 = resp.rewarded2;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    _onHeroAwakeGiftRsp(resp: icmsg.HeroAwakeGiftRsp) {
        this.model.heroAwakeGiftMap = {};
        resp.list.forEach(l => {
            let cfg = ConfigManager.getItemById(Store_awakeCfg, l.id);
            if (!this.model.heroAwakeGiftMap[cfg.hero]) this.model.heroAwakeGiftMap[cfg.hero] = {};
            this.model.heroAwakeGiftMap[cfg.hero][l.id] = l;
        })
    }

    _onHeroAwakeGiftUpdateRsp(resp: icmsg.HeroAwakeGiftUpdateRsp) {
        resp.list.forEach(l => {
            let cfg = ConfigManager.getItemById(Store_awakeCfg, l.id);
            if (!this.model.heroAwakeGiftMap[cfg.hero]) this.model.heroAwakeGiftMap[cfg.hero] = {};
            this.model.heroAwakeGiftMap[cfg.hero][l.id] = l;
        })
    }
}