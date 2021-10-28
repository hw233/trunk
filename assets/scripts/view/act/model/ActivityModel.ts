import ConfigManager from '../../../common/managers/ConfigManager';
import { Cave_adventureCfg, MainInterface_mainCfg, MainInterface_sortCfg } from '../../../a/config';

export default class ActivityModel {

    showKfcbIcon: boolean = false
    kfcb_selectIndex: number = 0
    kfcb_ranksInfo: icmsg.ActivityRankingRole[] = []
    kfcb_history1: number = 0//昨日冲榜排名
    kfcb_history2: number = 0//前日冲榜排名
    kfcb_percent3: number = 0//3天冲榜排名
    kfcb_percent7: number = 0//7天冲榜排名
    kfcb_rewarded3: boolean = false//3天奖励是否已领取
    kfcb_rewarded7: boolean = false//7天奖励是否已领取


    /**新每月累计充值 */
    newTopUpRecharge: number = 0;
    /**新累充大礼奖励领取位图 */
    newLcdlRewards: number[] = [];

    //历史累计充值
    historyPaySum: number = 0;

    /**每月累计充值 */
    monthlyRecharge: number = 0;
    /**每日累计充值 */
    dayRecharge: number = 0;
    /**累充大礼奖励领取位图 */
    lcdlRewards: number[] = [];

    /**活动-累计登陆天数 */
    totalLoginDays: number = 1;
    /**累计登陆奖励领取位图 */
    totalLoginRewards: number[] = [];

    //幸运翻牌 翻牌记录  index-goodsInfo
    flipCardFlipInfo: any = {};
    //幸运翻牌 轮次
    flipCardTurnNum: number;
    //幸运翻牌 特殊奖励
    filpCardSpReward: number[] = [];
    //幸运翻牌 钻石剩余翻牌次数
    flipCardLeftDiamondTimes: number;
    //幸运翻牌 当前轮次特殊奖励已领取
    flipCardRecived: boolean;


    // //扭蛋次数
    // twistedEggTime: number = 0;
    // //扭蛋奖励信息
    // twistedEggInfos: { rewardType: number, goodsInfo: GoodsInfo }[] = []; //9-特等奖 1-一等奖 2-二等奖 3-三等奖
    //每次登陆首次点开扭蛋界面
    firstInTwistView: boolean = true;
    //扭蛋剩余钻石次数
    twistedLeftDiamondTimes: number;
    //扭蛋保底次数
    twistedGuaranteeNum: number;
    //扭蛋特殊奖励
    twistedSpReward: number;
    //扭蛋是否有免费次数
    isFirstDraw: boolean;

    alchemyTimes: number[] = []//点金次数

    /**精彩活动信息 */
    excitingActInfo: any = {};
    /**活动任务已领取奖励的Id */
    excitingRewards: any = {};
    /**精彩活动-升级有礼 全服奖励领取数量信息  taskid-leftNum*/
    excitingActOfUpgradeLimitInfo: any = {};

    /**精彩活动-累计充值当前周期 */
    excitingActOfContinuousCycle: number = 1;
    //秘境商店物品购买情况 
    magicStoreBuyInfo: any = {} //id:storeInfo
    /**精彩活动-升星有礼当前周期 */
    excitingAcrOfStarGiftRewardType: number = 1;
    /**精彩活动-升星有礼当前轮数 */
    excitingAcrOfStarGiftRounds: number = 1;
    //中秋迷镜商店购买情况
    midAutumnStoreBuyInfo: any = {}

    //世界平均等级
    worldAvgLv: number = 1;
    //今日已充额度
    dailyPayMoney: number = 0;
    //每日首充 协议更新
    dailyRechargeProto: boolean = false;
    //每日首充 奖励是否领取
    dailyRechargeRewarded: boolean = false;
    //限时活动商店购买记录
    subStoreBuyInfos: any = {}//id:storeBuyInfo

    //娃娃机已使用免费次数
    advLuckyDrawFreeTimes: number = 0;
    //娃娃机已使用钻石次数
    advLuckyDrawDiamondTimes: number = 0;
    //娃娃机池子id
    advLuckyOptionalId: number;

    //每日登陆 跨服重置
    firstInCrossRecharge: boolean = true;

    cServerRankData: icmsg.CarnivalServerScoreRankRsp;
    cServerPersonData: icmsg.CarnivalInfoRsp;
    roleServerRank: icmsg.CarnivalPlayerServerRankRsp;

    enterCServerRank: boolean = false;
    enterCServerTask: boolean = false;

    //周末福利领奖记录
    weekEndRecord: number;

    //开服8天登陆
    kfLoginDays: number;
    kfLoginDaysReward: number;

    //跨服寻宝
    cTreasureDayTurn: number; //当日刷新轮次
    cTreasureCurTurn: number; //当前轮次
    cTreasureRefreshTime: number; //大于0表示终极大奖被抽取的时间
    cTreasureItemNum: number[]; //物品被抽到次数，数组长度9，下标0对应1号格子
    cTreasureHasFreeTime: number;//每日免费次数
    cTreasureRecord: icmsg.CrossTreasureRecord[] = []; // 跨服寻宝抽奖记录
    cTreasureOrderName: { [order: number]: string[] } = {}; //抽取对应奖品的玩家列表

    luckyTwistEggRewarded: number = 0//幸运扭蛋  已经扭了几次 转为2进制 为1的表示已抽中的
    luckyTwistEggWished: number[] = [] //幸运扭蛋 数组下标对应许愿的物品id
    luckyTwistEggSubType: number = 0;//幸运扭蛋 轮次

    firstInluckyTwistEgg: boolean = true
    firstInluckyTwistGift: boolean = true

    //幸运连连看
    linkGameRound: number = 0; //当前轮次
    linkRewardMap: { [id: number]: number } = {}; //已领取的连线奖励
    firstInLinkGiftView: boolean = true;

    //矿洞大冒险
    caveFirstInGiftView: boolean = true;
    caveCurMapId: number; //当前层数地图id
    caveCurLayer: number; //当前层数
    caveExplore: number; //探索点
    caveKeys: number; //钥匙数量
    caveLayerInfos: CaveLayerInfo[] = [];
    cavePointMapByPlate: { [plate: number]: CavePointInfo } = {};
    cavePointMapByPos: { [pos: string]: CavePointInfo } = {};

    //专属英雄升星活动
    awakeStarUpGiftMap: { [star: number]: icmsg.ActivityAwakeGift } = {};
    awakeHeroId: number; //当前设置的英雄Id

    //平台奖励任务活动
    platformTask: icmsg.PlatformMission[] = [];
    platformIconUpdateWatch: boolean = false; //图标界面触发显示隐藏逻辑

    //神装定制活动
    costumeCustomScore: number = 0;
    costumeCustomRewards: { [score: number]: number } = {}; //积分奖励领取记录 

    //灵力者集结信息
    assembledState: number = 0;//当前状态 位图
    assembledOpen: string = '' //灵力者集结界面打开的记录
    assembledOpenState: boolean = false;

    //砍价大礼包
    discountData: icmsg.ActivityDiscount[] = [];

    //宝藏旅馆
    hotelDailyReward: boolean = false
    hotelLayers: { [layerId: number]: icmsg.ActivityHotelLayer } = {}
    hotelCleanNum: number = 0
    hotelReward = []
    hotelCleaning = false


    //限时礼包
    LimitGiftDatas: icmsg.ActivityTimeGift[] = [];
    mainShowView: boolean = false;
    wuhunShowView: boolean = false;
    towerShowView: boolean = false;


    //神秘者活动
    mysterypassStageId: number = 0; //神秘者活动通关的活动id

    //神秘来客数据
    mysteryVisitorTotal: number = 0; //累充金额
    mysteryVisitorState: number = 0; //奖励领取位图

    //活动海报
    openActPosterState: boolean = false;


    //七日之战
    sevenDayWarInfo: icmsg.DungeonSevenDayStateRsp = null

    /**收纳的活动图标Id */
    private _storageActIds: number[] = [];
    get storageActIds(): number[] {
        if (!this._storageActIds || this._storageActIds.length <= 0) {
            ConfigManager.getItems(MainInterface_mainCfg, (cfg: MainInterface_mainCfg) => {
                if (cfg.integration == 1) {
                    this._storageActIds.push(cfg.id);
                }
            });
        }
        return this._storageActIds;
    }

    /**限时活动图标cfg */
    private _limitActCfgs: any[] = [];
    get limitActCfgs(): any[] {
        if (!this._limitActCfgs || this._limitActCfgs.length <= 0) {
            ConfigManager.getItems(MainInterface_sortCfg, (cfg: MainInterface_sortCfg) => {
                if (cfg.whether == 1) {
                    this._limitActCfgs.push(cfg);
                }
            });
        }
        return this._limitActCfgs;
    }

    //超值购
    superValueInfo: { [day: number]: icmsg.ActivitySuperValueDayInfo } = {};
}

/** 矿洞冒险每层数据 */
export type CaveLayerInfo = {
    layer: number,
    plate: number,
    passMap: {},
    boxState: boolean,
}

/** 矿洞冒险点信息 */
export type CavePointInfo = {
    position: cc.Vec2 | cc.Vec3, //瓦片坐标
    mapPos: cc.Vec2 | cc.Vec3, //像素坐标
    cfg: Cave_adventureCfg,
}
