import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import { Foothold_titleCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:04:01 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-07-29 16:37:45
 */


//据点信息
export type FhPointInfo = {
    id: number,
    type: number,
    mapPoint: cc.Vec2,
    pos: cc.Vec2,
    fhPoint: icmsg.FootholdPoint,
    output: icmsg.GoodsInfo[],
    bonusType: number,//buff塔的配置类型
    bonusId: number,
    addState: number[],//加成状态 1资源 2加成 3衰减
    effectTowers: number[],//辐射塔的id
}

export enum FhMapType {
    Base = 1, //基础公会战
    Elite = 2,//精英公会团战
    Normal = 3,//普通公会团战
    Cross = 4,//跨服据点战
    CrossExt = 5,// 跨服新
}

/**据点状态 枚举 */
export enum FhPointState {
    Fight = 1, //战斗
    Protect = 2,//受保护
    Defend = 3,//驻守中
    Gather = 4,//集结中
}

export type FhMapData = {
    warId: number,
    mapId: number,
    mapType: number,
    redPoint: icmsg.FootholdRedPoints,
    rndSeed: number,
}

export type FhGuildRankInfo = {
    index: number,
    data: icmsg.FootholdRankingGuild
}

export type FhCityInfo = {
    type: number,
    pointInfo: FhPointInfo,
}

export type FhRankItemInfo = {
    id: number,
    num: number,
    isLimit: boolean,
    openType: number
}


/**发奖信息 发送奖励的物品状态 会长操作*/
export type FhSendRewardInfo = {
    id: number,
    num: number,
    count: number
}

/**发奖信息 接受奖励的物品状态 */
export type FhSendRewardInfo2 = {
    id: number,
    num: number,
    type: number,
    isSend: boolean,//是否已发送的
}

export default class FootHoldModel {

    isTest = false

    //世界等级
    worldLevel: number = 0
    //现有体力
    energy: number = 0
    //请求刷新信息的时间
    recoverTime: number = 0
    //世界等级序列
    worldLevelIndex: number = 0
    //已购买体力次数
    engergyBought: number = 0
    //已领奖基地等级奖励
    rewardedBaseLevel: number = 0
    //据点战活动类型  62本服  63跨服
    activityType: number = 0
    //据点战开启了第几次
    activityIndex: number = 0
    //据点战开始时间
    warStartTime: number = 0
    //据点战结束时间
    warEndTime: number = 0

    //据点战地图信息（公会内）
    guildMapData: FhMapData = null

    //据点战地图信息（全区）
    globalMapData: FhMapData = null

    //据点战地图信息（当前）
    curMapData: FhMapData = null

    fhGuilds: icmsg.FootholdGuild[] = []

    fhPlayers: icmsg.FootholdPlayer[] = []

    fhPoints: icmsg.FootholdPoint[] = []

    //正在挑战的点
    fightPoint: icmsg.FootholdPos = null

    //最前通关的公会
    topGuildList: icmsg.FootholdGuild[] = []

    warPoints = {} //据点完全信息
    warPointsCtrl = {}//据点控制器

    //当前选中查看的 据点详细信息
    pointDetailInfo: icmsg.FootholdPointDetailRsp
    curBossHp: number
    curBossHurt: number


    localShowMyPoint = false //本公会据点战展示点
    globalShowMyPoint = false //跨服据点战展示点

    //上次选中的点
    lastSelectPoint: FhPointInfo
    //是否pvp战斗
    isPvp: boolean = false
    //pvp战斗是否胜利
    isPvpWin: boolean = false
    //玩家造成的伤害点数
    pvpPlayerDmg: number = 0

    cityDatas = {}//格式 类型-[点信息，点信息，...]
    cityScores = {} //格式 公会id-分数
    cityGetPoints = {}//格式 x-y:点信息  记录已被完全占领的据点
    cityAllPoints = {}//格式 x-y:点信息 所有城池据点信息
    cityPointCtrl = {} //格式 类型-ctrl   城池信息 


    fhDropGoods: icmsg.GuildDropGoods[] = []//据点战奖励展示
    fhDropRecord: icmsg.GuildDropRecord[] = []//据点战分配详情
    //fhSendSelectItem: any = null//当前选择分配的道具

    fhDropReward: icmsg.GoodsInfo[] = []//可以领取的奖励
    fhLongTouch = false// 是否长按

    radioTowerData = []//buff塔对应的类型 下标从0开始
    pointsOutputList: icmsg.FootholdPointOutput[] = [] //占有点的资源收益
    // radio1Points = {} //格式 x-y:点信息  资源加成 
    // radio2Points = {}//格式 x-y:点信息   属性加成
    // radio3Points = {}//格式 x-y:点信息   属性削弱
    radioAllPoints = {}//格式 x-y:点信息   所有的有buff加成的 据点信息
    radioTypePoints = {}//格式 序号:[点信息,点信息...]   某一类型 所有的buff塔信息

    fhTotalScore: number = 0//据点总积分
    isShowPointList: boolean = false

    techingSrollIndex: number = 0 //教学任务滚动位置
    teachTaskEventDatas: any = {}  //eventId--完成数量

    fhSendSelectPlayer: any = null//当前选择分配的会员
    sendPlayerRecord = {}//会长发奖记录  playerId---[物品id,物品id...]
    sendPlayerRecordCtrl = {}//会长发奖记录  playerId---[itemCtrl,itemCtrl...]
    sendPlayerUpdate = false

    fhLastRankGuilds: icmsg.LastRankGuild[] = []

    isGuessMode: boolean = false

    guessGuilds: icmsg.FootholdGuessGuild[] = []
    guessType: number = 0
    guessVotedId: number = 0 //投注的公会id
    guessWinnerId: number = 0//当前内容胜出的公会id
    guessVotedPoints: number = 0
    guessRewarded: number = 0  //1到15位表示 轮次奖励   16位起 表示每日竞猜礼包
    guessOpened: boolean = false //竞猜是否开启（用于没有参与跨服公会战的玩家判断 进入竞猜模式）
    guessRedPoints: number = 0 // 竞猜红点 是否有奖励可领取 （1到16位表示 轮次奖励   17位起 表示每日竞猜礼包）
    militaryExp: number = 0 //军衔任务经验
    freeEnergy: number = 0 //已领取的免费体力

    pvpFhLastWave = 0 //记录上一次的刷怪波次

    allianceNum = 0 //联盟的数量
    myAlliance = [] //与自己 联盟的公会id组
    maxAlliance = [] //联盟多公会组
    chooseState = [false, false, false] // 联盟势力 辐射塔范围 进攻标记
    markFlagPoints = {} //格式：x-y:点信息 


    gatherMode: boolean = false //集结状态
    markMode: boolean = false //标记状态

    guardInviteInfos: { [playerId: number]: icmsg.FootholdTeamBrief } = {}//驻守可邀请公会成员信息
    myGuardInviteInfos: icmsg.FootholdGuardInviter[] = []//玩家收到的驻守邀请
    myGuardInviteNum: number = 0//玩家驻守邀请数量
    myGuardPlayerIds: number[] = []

    gatherInviteInfos: { [playerId: number]: icmsg.FootholdTeamBrief } = {}//集结可邀请公会成员信息
    myGatherInviteInfos: icmsg.FootholdGuardInviter[] = []//玩家收到的集结邀请
    myGatherInviteNum: number = 0//玩家集结邀请数量
    myGatherPlayerIds: number[] = []

    gatherTeamMates: icmsg.FootholdTeamFighter[] = []
    gatherOpponents: icmsg.FootholdTeamFighter[] = []
    gatherFightTeamMatesIndex: number = 0     //己方的出战队伍序号
    gatherFightOpponetnsIndex: number = 0    //对方的出战队伍序号

    gatherFightType: number = 1 // 1：Pos为集结点 2：Pos为目标点
    pointGuardPlayerIds = []//据点中已驻守的玩家id
    pointGatherPlayerIds = [] //据点中已集结的玩家id

    baseLevel: number; //基地等级
    baseLvExp: number;  //基地等级经验

    cooperationInviteNum: number = 0 //收到的协战邀请数量
    cooperGuildList: icmsg.FootholdCoopGuild[] = []//参与据点战的公会信息
    coopGuildId: number = 0 //已协战的公会id
    coopInviteNum: number = 0 //协战受邀次数
    coopApplyNum: number = 0  //协战审批次数
    coopStartTime: number = 0 //协战开始时间
    coopTempViewGuildId: number = 0; //查看参战人员临时公会Id


    /**军衔等级 */
    get militaryRankLv() {
        let cfgs = ConfigManager.getItems(Foothold_titleCfg)
        for (let i = cfgs.length - 1; i >= 0; i--) {
            if (cfgs[i].exp && this.militaryExp >= cfgs[i].exp) {
                return cfgs[i].level
            }
        }
        return 0
    }

    //临时公会Id, 处理协战相关的逻辑
    get roleTempGuildId() {
        if (this.coopGuildId > 0) {
            return this.coopGuildId
        }
        return ModelManager.get(RoleModel).guildId
    }

    private _pointPool: cc.NodePool
    get pointPool() {
        if (!this._pointPool) {
            this._pointPool = new cc.NodePool()
        }
        return this._pointPool
    }
}
