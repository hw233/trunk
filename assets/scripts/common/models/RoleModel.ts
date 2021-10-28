import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from '../utils/GlobalUtil';
import { VipCfg } from '../../a/config';
/**
 * @Description: 角色英雄,装备数据类
 * @Author: weiliang.huang
 * @Date: 2019-03-28 16:53:10
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-28 12:00:17
 */



/**该类型表对应money属性顺序 */
export const AttTypeName = {
    [1]: "exp",
    [2]: "gems",
    [3]: "gold",
    [4]: "gms",
    [5]: "sms",
    [6]: "arp",
    [7]: "frp",
    [8]: "skv",
    [9]: "gup",
    [10]: "heroExp",
    [12]: "pass",
    [13]: "flip",
    [14]: "acpe",
    [15]: "career",//进阶粉尘
    [16]: "tavern",
    [17]: "survival",//生存积分
    [18]: "vipExp",
    [19]: "turntable",
    [20]: "agate",
    [21]: "heroScore",
    [22]: "badgeExp",
    [23]: "adventureExp",
    [24]: "champion",
    [25]: "costume",
    [26]: "teamArena",
    [27]: "siege",
    [28]: "relic",
    [29]: "guardian",
    [30]: "adventureEntry",
    [31]: "arenaHonor",
    [35]: "goldEquipPoint",
    [36]: "purpleEquipPoint",
    [32]: "arenaHonorWorld",
    [33]: "expeditionPoint",
    [34]: "ultimatePoint",
    [101]: "level",
    [102]: "power",
}

export enum RoleSettingValue {
    Music = 0,
    Effect = 1,
    SavePower = 2,
    Gender = 3
}

export default class RoleModel {

    /**前端初始化完成标志，完全进入游戏 */
    initlized: boolean = false;

    /**账号 */
    account: string;
    /**玩家id */
    id: number;
    /**玩家名字 */
    name: string;
    /**角色创建时间 */
    createTime: string;

    /**玩家金币 */
    gold: number = 0;

    /**玩家钻石 */
    gems: number = 0;

    /**通行证经验 */
    pass: number = 0;

    /**金瓜子*/
    gms: number = 0;

    /**银瓜子*/
    sms: number = 0;

    /**荣誉点*/
    arp: number = 0;

    /**友谊点*/
    frp: number = 0;

    /**皮肤卷*/
    skv: number = 0;

    /**公会积分*/
    gup: number = 0;

    /**进阶粉尘 */
    career: number = 0

    /**vip经验 */
    vipExp: number = 0

    /**玛瑙,秘境兑换 */
    agate: number = 0

    /**头像 */
    head: number = 0;

    /**头像框 */
    frame: number = 0;

    /**称号 */
    title: number = 0;

    /**幸运翻牌-翻牌次数 */
    flip: number = 0;
    /**矿洞经验 */
    acpe: number = 0;

    /**悬赏情报 */
    tavern: number = 0;

    /**探险证经验 */
    adventureExp: number = 0;

    /**锦标赛积分 */
    champion: number = 0;

    /**丧尸攻城积分 */
    siege: number = 0

    /**遗迹探险积分 */
    relic: number = 0
    /**守护者积分 */
    guardian: number = 0;
    /**历史最高英雄星级 */
    maxHeroStar: number = 0;

    /**设置 */
    setting: number = 0;
    /**奇境探险遗物积分 */
    adventureEntry: number = 0
    /**荣耀巅峰积分 */
    arenaHonor: number = 0;
    /**荣耀巅峰世界赛积分 */
    arenaHonorWorld: number = 0;
    /**团队远征积分 */
    expeditionPoint: number = 0;
    /**终极积分 */
    ultimatePoint: number = 0

    /** 缓存,目前记录  
     *  1.胜利结算界面,任务进度显示的阅读状态   
     *  2.好友, 每日最大请求数量/每日最大添加数
        json格式  {
                "taskProgressReadStatus": {
                    "sheetType": {    // 1-日常 2-成就 3-通关奖励 4-7日活动 5-7日活动目标奖励 6-生存秘籍
                        taskType: taskId  // 任务类型id - 最新已读任务的id
                    }
                },
                "friendLimits": {
                    "daily":{ //服务器时间转当日零点的时间戳
                        "requestFriendNum": num,
                        "addFriendNum": num
                    }
                }
            }
     */
    cookie: string;

    /**人物等级 */
    level: number = 20;

    // /**Vip等级 */
    // vipLv: number = 0;

    /**当前经验 */
    exp: number = 1100;

    /**职业等级 */
    jobLv: number = 1;

    /**战力 */
    power: number = 0;
    /**历史最高战力 */
    MaxPower: number = 0;

    /**查看玩家id */
    lookPlayerId: number = 0;
    /**玩家是否是首充状态 false:是首充状态 true:已经充值过了*/
    payed: boolean = false;
    /**擁有的头像列表 */
    frameList: any = {} //id-headFrame

    //拥有的称号列表
    titleList: { [id: number]: icmsg.Title } = {}


    /**公会id */
    guildId: number = 0;

    guildTitle: number = 0
    guildName: string = ''

    /**英雄经验 */
    heroExp: number = 0;

    /**徽章积分*/
    badgeExp: number = 0;

    /**世界等级 */
    worldLevel: number = 0

    roleImage: icmsg.RoleImageRsp = null

    /**改名次数 */
    renameNum: number;

    activeSkill = null //指挥官激活的技能 {skillId:xxx,skillLv:xxxx}

    selectHeadId: number = 0

    selectFrameId: number = 0

    selectTitleId: number = 0

    vipGiftBoughtFlag: number = 0;//vip礼包购买记录 按位记录 从0开始
    mcRewardTime: number = 0//上次领取月卡（vip加成的）每日奖励

    gradingWarFail: boolean = false;//评分系统记录战斗是否失败
    gradingGuideIndex: number = -1//引导的序号，-1 不需要

    /**累计登陆天数 */
    loginDays: number = 1;

    crossId: string = '';
    CrossOpenTime: number;

    serverMegTime: number; //合服时间
    serverMegCount: number; //合服次数

    /**性别 0或缺省是男，1是女 */
    get gender(): number {
        if (this.setting & (1 << RoleSettingValue.Gender)) {
            return 1;
        }
        return 0
    }

    /**vip等级 */
    get vipLv(): number {
        let vigCfgs = ConfigManager.getItems(VipCfg)
        for (let i = vigCfgs.length - 2; i >= 0; i--) {
            if (this.vipExp >= vigCfgs[i].exp) {
                return vigCfgs[i].level + 1
            }
        }
        return 0
    }

    /**合服第几天 */
    get serverMegDay() {
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        if (curTime >= this.serverMegTime) {
            return Math.floor((curTime - this.serverMegTime) / 86400)
        }
        return 0
    }
}

