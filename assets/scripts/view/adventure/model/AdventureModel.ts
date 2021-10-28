import ActUtil from '../../act/util/ActUtil';
import AdventureUtils from '../utils/AdventureUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import { Adventure_hireCfg } from '../../../a/config';

export enum AdventurePointType {
    Start = 0,//起点
    Stage = 1,//关卡
    Travel = 2,//旅行商人
    Hire = 3,//雇佣 
    Entry = 4,// 增益遗物
    Resume = 5,//能量回复
    Treasure = 6,//宝藏事件
    Save = 7,  //保存进度

    Pass = 99,//奖励未领取显示宝箱，领取了显示传送门
}

export type AdvPointInfo = {
    index: number,
    mapPoint: cc.Vec2,
    pos: cc.Vec2,
    tilePos: cc.Vec2
}


export default class AdventureModel {

    actId = 53
    blood: number = 0 //指挥官生命值
    difficulty = 1
    layerId = 1
    plateIndex: number = 0//当前板块序号
    plateFinish: boolean = false// 板块事件是否完成
    consumption: number = 0//回复泉水每日使用次数
    giveHeros: icmsg.AdventureHero[] = [] // 援助英雄
    entryList: icmsg.AdventureEntry[] = []  // 拥有的词条序号
    avgPower: number = 0 // 平均战力
    avgLevel: number = 0  // 平均等级
    fightTimes: number = 0 // 战斗胜利次数
    lastPlate: number = 0 //上一个点，显示指挥官位置
    historyPlate: number[] = []
    selectIndex: number = 0
    isFirstEnter: boolean = true

    plateEntryList: icmsg.AdventureEntry[] = []//据点随机生成的词条
    platePoints: any = {}  //id--pointInfo
    platePointsCtrl: any = {}  //id--ctrl

    isShowFinishTip: boolean = false //是否打开通关界面
    isFlyScore: boolean = false
    isFlyPassScore: boolean = false
    isMove: boolean = false //指挥官移动
    isDie: boolean = false //是否死亡

    travelList: icmsg.AdventureTrave[] = []//旅人商店物品购买状态

    pveHireHeros: any = {}  //series--AdventureHero 战斗上阵的雇佣英雄
    pveOwnHeroIds: number[] = []

    rankBefore: number = 0//战斗前排名
    rankAfter: number = 0;//战斗后排名

    entrySelectIndex: number = -1

    guideIds = [210013, 210014, 210015, 210016, 210017]//引导的id

    adventureStoreBuyInfo: any = {} //id-remain
    adventRankInfo: icmsg.AdventureRankBrief[] = [];
    adventServerNum: number = 0
    adventMyRankInfo: icmsg.AdventureRankBrief;
    adventMyRankNum: number;

    //是否购买了通行证
    isBuyPassPort: boolean = false;
    //通行证免费奖励领取位图
    passPortFreeReward: number[] = []
    //通行证购买 奖励领取位图
    passPortChargeReward: number[] = []
    lastCycle: number;


    //服务端生成的英雄唯一id
    get pveHireHeroIds() {
        let ids = []
        for (let key in this.pveHireHeros) {
            let info: icmsg.AdventureHero = this.pveHireHeros[key]
            let readInfo: icmsg.AdventureHero = AdventureUtils.getHireHero(parseInt(key))
            let hireCfg = ConfigManager.getItemByField(Adventure_hireCfg, "group", info.group, { hero: info.typeId })
            let hireTime = hireCfg.hire_times
            if (readInfo.useTimes < hireTime) {
                ids.push(info.heroId)
            }
        }
        return ids
    }

    get localStr() {
        let startTime = ActUtil.getActStartTime(this.actId);
        return "advGuide#" + startTime
    }
}