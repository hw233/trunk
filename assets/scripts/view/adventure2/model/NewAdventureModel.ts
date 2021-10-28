import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import NewAdventureUtils from '../utils/NewAdventureUtils';
import { Adventure2_adventureCfg, Adventure2_hireCfg } from '../../../a/config';


/**
 * @Description: 新奇境探险Model
 * @Author: yaozu.hu
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-01 10:42:26
 */
export type NewAdvPointInfo = {
    index: number,
    mapPoint: cc.Vec2,
    pos: cc.Vec2,
    tilePos: cc.Vec2
    line: number
}

export default class NewAdventureModel {

    copyType: number = 0; //0 普通模式 1 无尽模式
    actId = 107
    difficulty = 1;
    isFirstEnter = false;
    difficultyRewarded: number = 0;

    //获得礼包时间
    GiftTime: icmsg.StorePushGift[] = []

    avgPower: number = 0 // 平均战力
    avgLevel: number = 0  // 平均等级
    fightTimes: number = 0;// 战斗胜利次数
    giveHeros: icmsg.Adventure2Hero[] = [] // 援助英雄

    normalState: icmsg.Adventure2Difficulty;
    endLessState: icmsg.Adventure2Difficulty;

    platePoints: any = {}  //id--pointInfo
    platePointsCtrl: any = {}  //id--ctrl


    isMove: boolean = false //指挥官移动
    isDie: boolean = false //是否死亡

    isShowFinishTip: boolean = false //是否打开通关界面

    firstEnterGame: boolean = true;
    firstShowPushView: boolean = false;
    needShowPushView: boolean = false;

    isFlyScore: boolean = false
    isFlyPassScore: boolean = false
    travelList: icmsg.AdventureTrave[] = []//旅人商店物品购买状态
    entrySelectIndex: number = -1

    rankBefore: number = 0//战斗前排名
    rankAfter: number = 0;//战斗后排名

    plateEntryList: icmsg.AdventureEntry[] = []//据点随机生成的词条
    pveHireHeros: any = {}  //series--AdventureHero 战斗上阵的雇佣英雄
    pveOwnHeroIds: number[] = []

    //普通关卡上阵列表
    upHerosId: number[] = []


    //普通关卡战斗数据
    normalFightHeroList: icmsg.FightHero[] = []

    //是否购买了通行证
    isBuyPassPort: boolean = false;
    //通行证免费奖励领取位图
    passPortFreeReward: number[] = []
    //通行证购买 奖励领取位图
    passPortChargeReward: number[] = []

    adventureStoreBuyInfo: any = {} //id-remain
    adventRankInfo: icmsg.Adventure2RankBrief[] = [];
    adventServerNum: number = 0
    adventMyRankInfo: icmsg.Adventure2RankBrief;
    adventMyRankNum: number;


    stageAdvCfg: Adventure2_adventureCfg;

    //---------------------无尽模式地图数据

    plate0Points: any = {}  //id--pointInfo
    plate0PointsCtrl: any = {}  //id--ctrl

    plate1Points: any = {}  //id--pointInfo
    plate1PointsCtrl: any = {}  //id--ctrl

    plate2Points: any = {}  //id--pointInfo
    plate2PointsCtrl: any = {}  //id--ctrl

    plate3Points: any = {}  //id--pointInfo
    plate3PointsCtrl: any = {}  //id--ctrl

    endlessStartPoint: NewAdvPointInfo;
    endlessEndPoint: NewAdvPointInfo;
    endlesslastLine: number = 0;

    //---------------------普通关卡数据-----------------------
    normal_blood: number = 0 //指挥官生命值
    normal_layerId = 1
    normal_plateIndex: number = 0//当前板块序号
    normal_plateFinish: boolean = false// 板块事件是否完成
    normal_consumption: number = 0//回复泉水每日使用次数
    normal_giveHeros: icmsg.Adventure2Hero[] = [] // 援助英雄
    normal_entryList: number[] = []  // 拥有的词条序号
    normal_fightTimes: number = 0 // 战斗胜利次数
    normal_lastPlate: number = 0 //上一个点，显示指挥官位置
    normal_historyPlate: number[] = [];
    normal_stageId: number = 0
    normal_selectIndex: number = 0
    normal_randomIds: number[] = [];// 拥有的随机事件id
    normal_allPlates: number[] = [];//当前层走过的板块
    normal_lastEntryList: number[] = [];//上一次死亡拥有的增益遗物
    normal_lastPlates: number[] = [];//上一次死亡走过的板块


    showLastLine: boolean = false;
    showEffect: boolean = false;
    showLastPlateIndex: number = 0;//显示特效最后的板块序号

    //---------------------无尽关卡数据-----------------------
    endless_blood: number = 0 //指挥官生命值
    endless_layerId = 1
    endless_plateIndex: number = 0//当前板块序号
    endless_plateFinish: boolean = false// 板块事件是否完成
    endless_consumption: number = 0//回复泉水每日使用次数
    endless_giveHeros: icmsg.Adventure2Hero[] = [] // 援助英雄
    endless_entryList: number[] = []  // 拥有的词条序号
    endless_fightTimes: number = 0 // 战斗胜利次数
    endless_lastPlate: number = 0 //上一个点，显示指挥官位置
    endless_historyPlate: number[] = []
    endless_selectIndex: number = 0
    endless_stageId: number = 0
    endless_line: number = 0
    endless_randomIds: number[] = [];// 拥有的随机事件id


    selectEntyrCostNum: number = 0;//选择兑换的遗物所需的花费
    selectEntyrIds: number[] = [];//选择兑换的遗物hardcore_id
    //服务端生成的英雄唯一id
    get pveHireHeroIds() {
        let ids = []
        for (let key in this.pveHireHeros) {
            let info: icmsg.Adventure2Hero = this.pveHireHeros[key]
            let readInfo: icmsg.Adventure2Hero = NewAdventureUtils.getHireHero(parseInt(key))
            let hireCfg = ConfigManager.getItemByField(Adventure2_hireCfg, "group", info.group, { hero: info.typeId })
            let hireTime = hireCfg.hire_times
            if (readInfo.useTimes < hireTime) {
                ids.push(info.heroId)
            }
        }
        return ids
    }

    get localStr() {
        let startTime = ActUtil.getActStartTime(this.actId);
        return "newAdvGuide#" + startTime
    }
}
