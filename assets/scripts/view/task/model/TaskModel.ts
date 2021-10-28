import ModelManager from '../../../common/managers/ModelManager';

/** 
 * @Description: 任务数据类
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 15:24:04 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-21 16:10:46
 */

export interface TaskInfo {
    any?: icmsg.MissionProgress

}

export interface AwardInfo {
    itemId: number
    num: number
}

export default class TaskModel {
    static get() {
        return ModelManager.get(TaskModel)
    }

    taskInfos: Array<TaskInfo> = []

    dailyDatas: any = {} // 日常任务完成数据

    achieveDatas: any = {} // 成就完成数据

    weeklyDatas: any = {}//周常任务

    mainLineDatas: any = {}//主线任务

    sevenDaysDatas: any = {}//七日狂欢

    gradingDatas: any = {}//评分系统任务

    flipCardsTaskDatas: any = {}//幸运翻牌

    diaryDatas: any = {} //冒险日记

    costumeCustomDatas: any = {} //定制神装

    carnivalDailyData: any = {}//跨服任务(每日任务)
    carnivalDailyRewardIds = []
    carnivalUltimateData: any = {}//跨服任务(终极任务)
    carnivalUltimateRewardIds = []

    footholdDailyDatas: any = {}
    footholdRankDatas: any = {}
    relicDailyDatas: any = {}
    relicWeeklyDatas: any = {}
    combineDailyDatas: any = {}
    combineUltimateDatas: any = {}

    linkGameDatas: any = {}

    caveDatas: any = {}

    isGuide: boolean = true

    guildDatas: any = {}//公会任务
    guildRewardIds = []

    daily: icmsg.MissionCategory//日常所有数据
    weekly: icmsg.MissionCategory//周常所有数据
    achievement: icmsg.MissionCategory//成就
    mainLine: icmsg.MissionCategory//主线
    sevenDays: icmsg.MissionCategory//七日狂欢
    flipCardsTask: icmsg.MissionCategory//幸运翻牌
    grading: icmsg.MissionCategory//评分系统
    diary: icmsg.MissionCategory//冒险日记
    carnivalDaily: icmsg.MissionCategory//跨服任务(每日任务)
    carnivalUltimate: icmsg.MissionCategory//跨服任务(终极任务)
    footholdDaily: icmsg.MissionCategory //据点争夺 军衔日常任务
    footholdRank: icmsg.MissionCategory //据点争夺 军衔常规任务
    relicDaily: icmsg.MissionCategory //遗迹任务(日常)
    relicWeekly: icmsg.MissionCategory //遗迹任务(周常)
    combineDaily: icmsg.MissionCategory //合服狂欢 日常
    combineUltimate: icmsg.MissionCategory //合服狂欢 常规
    linkGame: icmsg.MissionCategory //幸运连连看
    cave: icmsg.MissionCategory //矿洞大冒险
    costumeCustom: icmsg.MissionCategory//神装定制

    diaryLvRewards: number;//冒险日记等级奖励领取记录
    diaryExtraRewards: number; //冒险日记额外奖励领取记录
    firstInDiary: boolean = true; //每日登陆 进入冒险日记
    carnivalScoreRewards: number; //跨服任务积分奖励记录

    scoreSysListScrolling: boolean = false
    scoreSysListScrollIndex: number = 0
    dailyRoundId: number = 0

    rewardIds: any = {} // 记录已领取奖励的任务ID

    newAchieves: number[] = []   // 记录新获得的成就id组

    onlineInfo: icmsg.MissionOnlineInfoRsp = null;    //在线奖励信息

    GrowDatas: any = {};    //成长任务进度列表

    GrowChapter: number = 0;    //成长任务当前章节

    GrowBits: number = 0;   //成长任务已领取奖励位图

    sevenDayRewardIndex: number = -1//七天奖励累计奖励领取的index

    growPreSkillMap: any = {}//奖励预览技能递增记录

    tavernDoingTaskList: icmsg.TavernTask[] = []; //酒馆已接受的任务列表  
    tavernTodoTaskList: icmsg.TavernTask[] = []; //酒馆未接受的任务列表  
    tavernRefreshTimes: number = 0; //酒馆已刷新次数
    tavernIsOpened: boolean = false; //本次登陆，酒馆界面是否打开过
    tavernGuideId: number; //悬赏界面引导激活的特权id
    tavernExtraFlag: number; //最低两位表示是否已领取额外紫色、橙色任务
    tavernExtraTask1: icmsg.TavernTask;
    tavernExtraTask2: icmsg.TavernTask;

    welfareReward: number[] = []; //开服福利120抽 任务奖励领取位图数组
    isFirstOpenKfflView: boolean = true; //每天首次打开福利界面之前 显示红点

    welfareReward2: number[] = []; //开服福利二期 任务奖励领取位图数组

    weaponChapter: number;//神器任务当前章节
    weaponDatas: any = {};//神器任务进度列表
    weaponBits: number = 0;//神器任务已领取奖励位图

    mustDoData: icmsg.RitualListRsp;//每日必做任务数据
}