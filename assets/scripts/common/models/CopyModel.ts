import { Copy_stageCfg } from '../../a/config';
import { StageData } from '../../view/map/ctrl/CityStageItemCtrl';
import ConfigManager from '../managers/ConfigManager';
import CopyUtil from '../utils/CopyUtil';
import { BagItem } from './BagModel';



/**
 * 副本相关的数据模型
 * @Author: sthoo.huang
 * @Date: 2019-04-24 20:57:19
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-24 17:53:53
 */

export enum CopyType {
    NONE,  // 非副本，目前只有竞技场
    MAIN = 1, // 主线
    Survival = 2, // 生存训练
    GOD = 3, // 英雄副本
    Boss = 4,   // 正义的反击
    Trial = 5, // 无尽的黑暗
    Elite = 7,  // 精英副本，奖杯模式
    Mastery = 8, // 专精副本
    Sthwar = 9,  // 公会据点战
    FootHold = 10,//公会据点战（新）
    Mine = 11,      //矿洞大作战
    RookieCup = 12,   //奖杯新手模式
    ChallengeCup = 13,   //奖杯挑战模式
    DoomsDay = 14, // 末日考验
    Eternal = 15, //  武魂试炼
    GuildBoss = 16, // 公会Boss
    Rune = 17,      //符文副本
    HeroTrial = 18,   //英雄试炼
    Adventure = 19,//探险
    EndRuin = 20,//末日废墟
    NewHeroTrial = 21,   //新英雄试炼
    Siege = 22,//丧尸攻城
    Guardian = 23, //守护者副本
    HeroAwakening = 24,//英雄觉醒
    NewAdventure = 25,//英雄觉醒
    Expedition = 26,//团队远征
    Ultimate = 27,//终极试炼
    Mystery = 28,//神秘者活动
    SevenDayWar = 29,//七日之战 
}

export enum CityState {
    Pass,
    Open,
    Lock,
}

export class CityData {
    cityId: number;
    cityName: string;
    state: CityState;
    stageDatas: StageData[];
    cityType: number;
    isTrack: boolean;

    index: number;
    pos: cc.Vec2;

    cityNode: cc.Node;
    iconSprite: cc.Sprite;
    nameLab: cc.Node;
    lockNode: cc.Node;
    trackNode: cc.Node;
    fightAni: cc.Animation;
    friendNode: cc.Node;
    unLockSpine: sp.Skeleton;
}

export enum CopyEventId {
    RSP_COPY_LIST = "RSP_COPY_LIST",
    RSP_COPY_MAIN_CHAPTER_LIST = "RSP_COPY_MAIN_CHAPTER_LIST",
    RSP_COPY_MAIN_RAIDS = "RSP_COPY_MAIN_RAIDS",
    RSP_COPY_MAIN_HANG = "RSP_COPY_MAIN_HANG",
    RSP_COPY_MAIN_HANG_REWARD = "RSP_COPY_MAIN_HANG_REWARD",

    UPDATE_COPY_MAIN_REWARD = "UPDATE_COPY_MAIN_REWARD",//主线挂机奖励更新
    UPDATE_COPY_MAIN_LINE_CUP_REWARD = "UPDATE_COPY_MAIN_LINE_CUP_REWARD",//主线关卡奖励更新

    UPDATE_COPY_ENDRUIN_PLAYER = "UPDATE_COPY_ENDRUIN_PLAYER",//末日废墟占领玩家更新
    CHANGE_COPY_ENDRUIN_CHAPTER = "CHANGE_COPY_ENDRUIN_CHAPTER",//末日废墟章节切换
    UPDATE_COPY_ENDRUIN_STAR_REWARD = "UPDATE_COPY_ENDRUIN_STAR_REWARD", //末日废墟章节星星奖励领取
    UPDATE_COPY_ENDRUIN_EVERYDAY_REWARD = "UPDATE_COPY_ENDRUIN_EVERYDAY_REWARD", //末日废墟每日奖励领取
}

export class HangItemInfo {
    heroId: number = 0
    careerId: number = 0
    itemId: number = 0
    equipSeries: number = 0
    stageId: number = 0
}

export default class CopyModel {
    /** 主线当前挂机关卡 */
    hangStageId: number = 0;
    hangStateMsg: icmsg.DungeonHangStatusRsp;
    hangRewardMsg: icmsg.DungeonHangRewardRsp;

    /** 主线最新解锁关卡 */
    latelyStageId: number = 0;
    /** 主线最新通过关卡 */
    lastCompleteStageId: number = 0;

    /**已过关的关卡 */
    passStages: { [stageId: number]: boolean } = {};

    copyList: Array<icmsg.DungeonInfo> = [];

    chapterList: icmsg.DungeonChapter[] = [];

    hangItemInfo: HangItemInfo


    /**奖杯挑战的关卡的id */
    cupFightStageId: number = 0

    /**公会据点战当次参战的英雄id */
    sthwarHeroIds = []

    //武魂试炼通过的关卡id列表
    eternalCopyStageIds: number[] = [];
    enterEternalCopy: boolean = false;

    //频繁使用，故缓存主线关卡的配置数据
    private _mainStageCfgs: Copy_stageCfg[];
    get mainStageCfgs() {
        if (!this._mainStageCfgs) {
            this._mainStageCfgs = ConfigManager.getItems(Copy_stageCfg, { copy_id: 1 });
        }
        return this._mainStageCfgs;
    }

    //频繁使用，故缓存主线精英关卡的配置数据
    private _eliteStageCfgs: Copy_stageCfg[];
    get eliteStageCfgs() {
        if (!this._eliteStageCfgs) {
            this._eliteStageCfgs = ConfigManager.getItems(Copy_stageCfg, { copy_id: 7 });
        }
        return this._eliteStageCfgs;
    }

    //eliteStageData
    eliteStageData = [];
    eliteRewardState: number = 0
    isEliteOpenFirst = true

    // 职业进阶扫荡物品
    needItem: BagItem = null;

    // 生存副本状态
    survivalStateMsg: icmsg.SurvivalStateRsp = null;
    survivalNeedSend: boolean = false;
    survivalIsOver: boolean = false;

    //快速作战-免费次数
    quickFightFreeTimes: number = 0;
    //快速作战-付费挑战次数
    quickFightPayTimes: number = 0;
    //快速作战-已用的付费挑战次数
    quickFightPayedTime: number = 0;
    //本次登陆是否打开过快速作战界面
    isOpenedQuickFightView: boolean = false;

    //新奖杯模式
    eliteNovice: icmsg.DungeonElitesStage[] = []
    eliteNoviceBits: number[] = [];
    eliteChallenge: icmsg.DungeonElitesStage[] = []
    eliteChallengeBits: number[] = [];

    eliteChallengeSelectHero: any = {}
    //新奖杯模式上阵记录
    cupCopyUpHeroList: any = {}

    //生存训练困难模式上阵记录
    SurvivalCopyUpHeroList: any = {}

    //末日废墟副本数据
    endRuinStateData: icmsg.RuinStateRsp = null;
    endRuinStageData: any = {}
    endRuinPlayAnim: boolean = false; //是否播放动画
    endRuinPvpChapterInfo: icmsg.RuinChapter = null; //pvp挑战的玩家数据

    //守护者副本
    guardianOpen: boolean = false; //副本是否开启
    guardianMaxStageId: number; //通过的最大关卡
    guardianRaidNum: number; //今日已扫荡次数

    //英雄觉醒副本的英雄ID
    heroAwakeHeroId: number = 0;
    heroAwakeHeroBaseId: number = 0;
    haveAwakeHero: boolean = false;
    openHeroAwake: boolean = false;


    enterDefenderStageId: number = 0;

    //终极试炼
    ultimateCurStageId = 0 //上一关卡
    ultimatIsClear: boolean = false //上一关卡是否通关
    ultimateMaxStageId = 0//已通关最高关卡
    ultimateEnterNum = 0 //挑战次数
    ultimateLeftNum = 0 //剩余挑战次数

    private _eliteNoviceCfgs: Copy_stageCfg[];
    get eliteNoviceCfgs() {
        if (!this._eliteNoviceCfgs) {
            this._eliteNoviceCfgs = ConfigManager.getItems(Copy_stageCfg, { copy_id: 12 });
        }
        return this._eliteNoviceCfgs;
    }
    private _eliteChallengeCfgs: Copy_stageCfg[];
    get eliteChallengeCfgs() {
        if (!this._eliteChallengeCfgs) {
            this._eliteChallengeCfgs = ConfigManager.getItems(Copy_stageCfg, { copy_id: 13 });
        }
        return this._eliteChallengeCfgs;
    }

    //末日废墟副本关卡数据
    private _endRuinCfgs: Copy_stageCfg[];
    get endRuinCfgs() {
        if (!this._endRuinCfgs) {
            this._endRuinCfgs = ConfigManager.getItems(Copy_stageCfg, { copy_id: 20 })
        }
        return this._endRuinCfgs;
    }

    // 生存副本上阵英雄数据
    get survivalHeroes() {
        if (this.survivalStateMsg) {
            return this.survivalStateMsg.heroes;
        }
        return null;
    }

    // 城市地图配置数据
    getCityData(curCityId: number, stageType: number) {
        let cfgs: Copy_stageCfg[];
        if (stageType == 0) {
            cfgs = this.mainStageCfgs;
        } else if (stageType == 1) {
            cfgs = this.eliteNoviceCfgs;
        } else if (stageType == 2) {
            cfgs = this.eliteChallengeCfgs;
        } else {
            cfgs = this.eliteStageCfgs;
        }
        //获取章节数据
        let cityData = new CityData();
        for (let i = 0, n = cfgs.length; i < n; i++) {
            let cfg = cfgs[i];
            let stageId = cfg.id;
            let cityId = CopyUtil.getChapterId(stageId);
            if (cityId != curCityId) {
                continue;
            }
            if (!cityData.cityId) {
                cityData.cityId = cityId;
                cityData.stageDatas = [];
                let names: string[] = cfg.des.split('-');
                cityData.cityName = names[names.length - 2];
                if (cityId == curCityId) {
                    cityData.state = CityState.Open;
                } else if (cityId < curCityId) {
                    cityData.state = CityState.Pass;
                } else {
                    cityData.state = CityState.Lock;
                }
                cityData.cityType = stageType == 0 ? 1 : 7;
            }
            let sid = CopyUtil.getSectionId(stageId);
            let stageData = new StageData();
            stageData.stageCfg = cfg;
            stageData.cityId = cityId;
            stageData.sid = sid;
            cityData.stageDatas[sid - 1] = stageData;
        }

        return cityData;
    }

    _mainLineChapterMap: {} = {};
    getMainLineIdsByChapter(chapter: number) {
        if (!this._mainLineChapterMap[chapter]) {
            this._mainLineChapterMap[chapter] = [];
            let cfgs = ConfigManager.getItems(Copy_stageCfg, (cfg: Copy_stageCfg) => {
                if (cfg.copy_id == 1) return true;
            });
            cfgs.sort((a, b) => { return a.id - b.id; });
            for (let i = 0; i < cfgs.length; i++) {
                let cfgChapter = CopyUtil.getChapterId(cfgs[i].id);
                if (this._mainLineChapterMap[chapter].length > 0 && cfgChapter !== chapter) {
                    break;
                }
                if (cfgChapter == chapter) {
                    this._mainLineChapterMap[chapter].push(cfgs[i].id);
                }
            }
        }
        return this._mainLineChapterMap[chapter];
    }
}