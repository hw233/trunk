

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:04:01 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-07-03 09:36:51
 */

export type GuildDetail = {
    info: icmsg.GuildInfo,
    exp: number,
    autoJoin: boolean,
    minLevel: number,
    notice: string,
    presidents: Array<number>,
    members: Array<GuildMemberLocal>,
    recruitNum: number,//招募次数
}

/**有职位的成员信息 本地使用 */
export type GuildMemberLocal = {
    id: number,
    name: string,
    head: number,
    frame: number,
    level: number,
    position: number,//职位
    fightNum: number,
    signFlag: boolean,
    bossNum: number,
    logoutTime: number,
    vipLv: number,
    power: number,
    title: number,//称号
}

export enum GuildTitle {
    Normal = 0,//普通成员
    /**中间预留 */
    TeamLeader = 4, //战斗队长
    VicePresident = 7,//副会长
    President = 8,//会长
}


export enum GuildAccess {
    /**开启公会boss*/
    OpenBoss = 1,
    /**发布招募 */
    Recruit = 2,
    /**群邮件 */
    SendMail = 3,
    /**加入审批 */
    Approve = 4,
    /**逐出公会 */
    KickoutMember = 5,
    /**据点战奖励发放 */
    SendFhReward = 6,
    /**据点战标记 */
    FhMark = 7,
    /**集结或驻守 */
    GatherOrGuard = 8,
    /**协战相关权限 */
    Cooperation = 9,
    /**任命战斗队长 */
    SetTeamLeader = 10,
}


export default class GuildModel {

    guildList: icmsg.GuildInfo[] = []

    guildDetail: GuildDetail = null

    guildCamp: icmsg.GuildCamp = null

    applyList: icmsg.GuildMember[] = []

    signNum: number = 0 // 当日签到人数
    signFlag: number = 0//二进制，倒数第一位表示是否已签到，倒数第二、三位表示宝箱是否已打开
    sthWarOpen: boolean //公会战是否开启
    sthWarTime: number = 0 //公会战打的次数 

    selectIcon: number = 1
    selectFrame: number = 2
    selectBottom: number = 3


    warPoints = {} //据点完全信息
    warPointsCtrl = {}//据点控制器
    warPointNum = {} //类型-数量

    chance: number = 0//可挑战次数
    mapId: number = 100101
    points: icmsg.GuildSthPoint[] = [] //服务端据点信息

    recruitTime: number = 0// 发布招募时间
    remindTime = {}//  还有多少秒可继续提醒   类型--时间

    //-----公会Boss------//
    gbOpenTime: number = 0;    // 开启时间
    gbBossId: number;   // bossId
    gbBossType: number;   // bossType
    gbBossLv: number;   // bossLv
    gbDamage: number = 0;   // 公会挑战boss的总伤害
    gbRewardFlag: number[] = [];    // 奖励领取记录,下标按顺序对应0-30，1-60，2-100
    gbRankTop3: icmsg.GuildBossRank[] = [];   // 伤害rank榜前三名
    gbEnterTime: number = 0;    // 已挑战次数
    gbBossHp: number;   //公会boss副本 boss总血量
    gbRankInfo: icmsg.GuildBossRank[] = [] //伤害rank列表数据
    gbPoint: number = 0; //公会积分
    gbMaxHurt: number; // 最高伤害

    //------mail invite---//
    guildMailTimes: number; //公会邮件已发送次数
    guildInvitationList: icmsg.GuildInvitation[] = []; //公会邀请列表

    //-----------envelope------------//
    myEnvelopeList: icmsg.GuildEnvelope[] = []; //拥有的红包
    grabEnvelopeList: icmsg.GuildEnvelope[] = []; //可抢的红包
    envelopeRankList: icmsg.WorldEnvelopeRank[] = []; //个人红包榜
    myEnvelopeRankInfo: { idx: number, info: icmsg.WorldEnvelopeRank }; //个人红包榜数据
    envGuildRankList: icmsg.WorldEnvelopeRank[] = []; //公会红包榜
    myEnvGuildRankInfo: { idx: number, info: icmsg.WorldEnvelopeRank }; //个人公会排行榜数据
    firstInEnvelope: boolean = true;
    worldEnvMaxGotId: number; //世界红包领取最大id
    worldEnvMaxId: number;  //世界红包中最大id


    /**末日集结  guildPower */
    playerPower: number = 0 //个人战力
    numberCount: number = 0 //集结人数
    totalPower: number = 0 //合计战力
    heroOn: number[] = []//上阵了列表
    hasReward: boolean = false//今日是否有奖励
    getRewarded: boolean = false//奖励是否已领取
    powerWorldLv: number = 1 // 世界等级 对应获得目标战力
    powerStar: number = 0   //集合优势 位的和
    gatherRankInfo: icmsg.GuildGatherRankRsp
    confirm: boolean = false// 是否已经集结


    /**主城建造 公会协助 */
    //accelerateList: icmsg.GuildAccelerateState[] = [] //公会需要协助的列表
}