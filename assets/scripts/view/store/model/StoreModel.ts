import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Store_first_payCfg, Store_pushCfg } from '../../../a/config';

/** 
 * @Description: 商店数据类
 * @Author: weiliang.huang  
 * @Date: 2019-05-22 15:13:00 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-28 09:58:21
 */

// 商店资源目录
export const STORE_TEXTURE_PATH: string = 'view/store/textrue/store';
export const STORE_ICON_PATH: string = 'view/store/textrue/icon';

export default class StoreModel {
	blackInfo: icmsg.StoreBlackMarket = null;
	siegeItems: { [id: number]: icmsg.StoreBlackItem } = null
	uniqueItems: { [id: number]: icmsg.StoreBlackItem } = null //专属装备商店
	runeInfo: any = {}; // 符文商店信息, id-storeRuneItem 
	runeRefreshNum: number; //符文商店已刷新次数

	storeInfo: any = {};    // -- 商店信息, id-StoreBuyInfo 表

	giftBuyList: icmsg.StoreBuyInfo[] = [];

	rechargeList: number[] = [];  //充值过的ID列表
	monthCardListInfo: icmsg.MonthCardInfo[] = []; //月卡剩余时间信息

	firstPaySum: number = 0;//累充金额
	firstPayList: icmsg.PayFirstList[] = [];
	// firstPayRewarded: number = 0;   //首充奖励  byte, 按位表示3天的各奖励是否已领
	firstPayTime: number; //首充时间
	fbFaildTrigger: boolean = false; //试练塔、竞技场、公会据点战和武魂试炼中失败触发首充 每次登陆仅一次

	//特权卡 双子战利 信息
	monthCardDungeon: icmsg.MonthCardDungeon;

	//定向推送礼包列表 已购买
	pushGiftList: icmsg.StorePushGift[] = [];

	//当前推送礼包cfg
	curPushGift: Store_pushCfg = null;

	//推送--事件列表
	storePushEvents: icmsg.StorePushEvent[] = [];

	//特权卡双倍战利显示
	isDoubleShow = true

	//是否购买了通行证
	isBuyPassPort: boolean = false;
	//通行证免费奖励领取位图
	passPortFreeReward: number[] = []
	//通行证购买 奖励领取位图
	passPortChargeReward: number[] = []
	//通行证  兼容外网已有通行证的玩家，保留他们更新活动类型前的通行证有些时间
	passPortsETime: icmsg.PassSETime;
	//最近一次计算的周期
	lastPeriod: number;

	//是否购买一元战力礼包
	isBuyOneDollarGift: boolean = false;
	//一元战力礼包奖励领取位图
	oneDollarGiftReward: number = 0;

	//七日狂欢商店购买记录 id-buyTimes
	sevenStoreInfo: any = {};
	//每次登陆是否第一次进入七日狂欢商店
	isFirstInSevenStore: boolean = true;
	//每次登陆首次点击七日狂欢商店的每天按钮
	firstInSevenStoreDays: any = {};//day-boolean

	//成长基金奖励领取位图
	growthFundsReward: number[] = [];
	//是否购买了成长基金
	isBuyGrowFunds: boolean = false;

	//试练塔基金奖励领取位图
	towerFundsReward: number[] = [];
	//是否购买了试练塔基金
	isBuyTowerFunds: boolean = false;

	//限制等级以下 每次登陆提示红点
	isShowGrowFundsTips: boolean = true;

	//限制等级以下 每次登陆提示红点
	isShowTowerFundsTips: boolean = true;

	//是否购买了福利活动二期
	isBuyWelfare2: boolean = false;

	//超值基金状态
	goodFundsInfo: icmsg.PassFund = null
	//豪华基金状态
	betterFundsInfo: icmsg.PassFund = null

	starGiftDatas: icmsg.StorePushGift[] = []

	limitGiftDatas: icmsg.TimeLimitGift[] = []
	limitGiftShowIds: number[] = []
	limitGiftFirstPush: boolean = true
	limitGiftPushInfo: icmsg.TimeLimitGift = null

	vipPreLv: number = 0
	vipPreExp: number = 0

	//特惠周卡
	isBuyWeeklyPassPort: boolean = false;	//是否购买周卡
	weeklyPassPortReward1: number;	//周卡免费奖励领取位图
	weeklyPassPortReward2: number;	//周卡付费奖励领取位图
	weeklyPassPortsETime: icmsg.PassSETime; //周卡 兼容外网已有通行证的玩家，保留他们更新活动类型前的通行证有些时间
	lastWeeklyCycle: number;	//最近一次计算的周卡周期
	weeklyCurSignDay: number;	//当前签到天数

	//英雄觉醒礼包
	heroAwakeGiftMap: { [heroTypeId: number]: { [giftId: number]: icmsg.HeroAwakeGift } } = {};

	//黑市商店
	showBuyPop: boolean = true; //是否显示购买确认窗口

	//每周礼包 指定跳转礼包Id
	giftJumpId: number;

	//有充值，当时没有领取过奖励，可以领取奖励
	_canGetFirstPayReward(): boolean {
		let ret = false;
		let lst = this.firstPayList;
		if (lst && lst.length > 0) {
			let curTime = GlobalUtil.getServerTime();
			ret = lst.some(item => {
				for (let i = 0; i < 3; i++) {
					let byte = item.rewarded;
					if ((byte &= 1 << i) <= 0) {
						let startZeroTime = TimerUtils.getZerohour(item.firstPayTime) * 1000;
						let day = Math.floor((curTime - startZeroTime) / (24 * 60 * 60 * 1000)) + 1;
						if (day >= i + 1) {
							return true;
						}
					}
				}
				return false;
			});
		}
		return ret;
	}

	//有充值，当时没有领取过奖励，已经领取奖励
	_hasGetFirstPayReward(): boolean {
		let lst = this.firstPayList;
		let cfgs = ConfigManager.getItems(Store_first_payCfg);
		if (lst && lst.length >= cfgs.length) {
			let ret = lst.some(item => {
				let num = 0;
				for (let i = 0; i < 3; i++) {
					let byte = item.rewarded;
					if ((byte &= 1 << i) > 0) {
						// 已经领取过奖励
						num += 1;
					}
				}
				return num != 3;
			});
			return !ret;
		}
		return false
	}

	//更新特权卡信息
	updateMonthCardInfo(info: icmsg.MonthCardInfo) {
		for (let i = 0; i < this.monthCardListInfo.length; i++) {
			const element = this.monthCardListInfo[i];
			if (element && element.id == info.id) {
				this.monthCardListInfo.splice(i, 1);
				break;
			}
		}
		this.monthCardListInfo.push(info);
		this.monthCardListInfo = this.monthCardListInfo
	}

	//获取单张特权卡信息
	getMonthCardInfo(id: number): icmsg.MonthCardInfo {
		// let item = new MonthCardInfo()
		// item.id = 500001
		// item.isRewarded = false
		// item.paySum = 20
		// return item

		for (let i = 0; i < this.monthCardListInfo.length; i++) {
			const element = this.monthCardListInfo[i];
			if (element && element.id == id) {
				return element;
			}
		}
	}

	/**指定的特权是否已激活 */
	isMonthCardActive(id: number) {
		let isActive = false
		for (let i = 0; i < this.monthCardListInfo.length; i++) {
			const element = this.monthCardListInfo[i];
			if (element && element.id == id) {
				if (element.time > 0 && element.time >= Math.floor(GlobalUtil.getServerTime() / 1000)) {
					isActive = true
				}
			}
		}
		return isActive
	}

	/**
	 * 更新事件列表
	 * @param e 
	 */
	updateStorePushEvent(e: icmsg.StorePushEvent) {
		for (let i = 0; i < this.storePushEvents.length; i++) {
			if (this.storePushEvents[i].event == e.event) {
				this.storePushEvents[i] = e;
				return;
			}
		}
		this.storePushEvents.push(e);
	}

	/**
	 * 更新礼包购买记录列表
	 * @param id 
	 * @param boughtNum 
	 */
	updateStorePushGiftList(id: number, boughtNum: number) {
		// let obj = new StorePushGift();
		// obj.id = id;
		// obj.boughtNum = boughtNum;
		// if (!this.pushGiftList) {
		// 	this.pushGiftList = [];
		// }
		// else {
		// 	for (let i = 0; i < this.pushGiftList.length; i++) {
		// 		if (this.pushGiftList[i].id == id) {
		// 			this.pushGiftList[i] = obj;
		// 			return;
		// 		}
		// 	}
		// 	this.pushGiftList.push(obj);
		// }
	}


	getMyMonthCardFlag() {
		let flag = 0
		for (let i = 0; i < this.monthCardListInfo.length; i++) {
			const info = this.monthCardListInfo[i];
			let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
			if (info.time > nowTime) {
				flag += Math.pow(2, Math.floor(info.id % 50000) - 1)
			}
		}
		return flag
	}

}