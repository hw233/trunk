/**
 * @Description: 副本相关枚举定义
 * @Author: jijing.liu
 * @Date: 2019-04-18 11:13:54
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-03-29 13:41:55
 */

/**
 副本类型定义
 主线    1
 兄贵    2
 女神的试炼    3
 英雄副本    4
 超时空试炼    5
 金币副本    6
 精英副本    7
 专精副本    8
 公会据点战  9
 公会据点战(新)  10
 */
export enum InstanceID {
    MAIN_INST = 1,
    BRO_INST,
    GOD_INST,
    HERO_INST,
    SPACE_INST,
    GOLD_INST,
    ELITE_INST,//精英副本
    CONET_INST,
    STHWAR_INST,
    FOOTHOLD_INST,
    MINE_INST, //矿洞大作战
    CUP_ROOKIE_INST, //新奖杯新手模式
    CUP_CHALLENGE_INST, //新奖杯新手模式
    DOOMSDAY_INST, //末日考验
    ETERNQL_INST,   //武魂试炼
    GUILDBOSS_INST, //公会BOSS
    RUNE_INST,      //符文副本
    HEROTRIAL_INST, //英雄试炼
    ADVENTURE_INST, //奇境探险
    ENDRUIN_INST, //末日废墟
    NEWHEROTRIAL_INST, //新英雄试炼
    SIEGE_INST, //丧失攻城
    GUARDIAN_INST, //守护者副本
};

//副本类型：挂机 0 通关副本 1 次数副本 2
export enum InstanceType {
    AUTO_INST = 0,
    CHALENGE_INST = 1,
    TIMES_INST = 2
}

export enum InstanceEventId {
    REQ_INST_LIST = "REQ_INST_LIST",   // 请求副本数据
    RSP_INST_LIST = "RSP_INST_LIST",   // 服务器返回副本数据
    RSP_INST_ENTER = "RSP_INST_ENTER",    // 服務器返回进入副本结果
    RSP_INST_EXIT = "RSP_INST_EXIT",   // 返回退出副本请求
    RSP_INST_RAIDS = "RSP_INST_RAIDS",   // 返回扫荡副本

    RSP_HANG_INFO = "RSP_HANG_INFO",   // 返回挂机信息   

    RSP_HANG_REWARD = "RSP_HANG_REWARD",   // 返回挂机奖励

    // 英雄副本
    RSP_BOSS_SUMMON = "RSP_BOSS_SUMMON",
    RSP_BOSS_HERO = "RSP_BOSS_HERO",
    RSP_BOSS_FIGHT = "RSP_BOSS_FIGHT",   // 返回点杀
    RSP_BOSS_HERO_FIGHT = "RSP_BOSS_HERO_FIGHT",   // 返回上阵英雄攻击

    RSP_BOSS_JUSTICE_STATE = "RSP_BOSS_JUSTICE_STATE",  //英雄副本同步状态
    RSP_BOSS_PLAYER_CLICK = "RSP_BOSS_PLAYER_CLICK",    //英雄副本指挥官手动点击boss
    RSP_BOSS_JUSTICE_SUMMON = "RSP_BOSS_JUSTICE_SUMMON",  //召唤boss
    RSP_BOSS_JUSTICE_RESETBOSS = "RSP_BOSS_JUSTICE_RESETBOSS", //升级佣兵

    //兄贵、女神副本
    HANGREWARD_OPEN_BOX = "HANGREWARD_OPEN_BOX",    //挂机奖励界面宝箱打开消息

    RSP_TOWER_SAO_REFRESH = "RSP_TOWER_SAO_REFRESH",//无尽的黑暗扫荡刷新消息
    RSP_TOWER_BUYNUM_REFRESH = "RSP_TOWER_BUYNUM_REFRESH",//无尽的黑暗购买扫荡次数消息
    RSP_TOWER_REWARD_REFRESH = "RSP_TOWER_REWARD_REFRESH",//无尽的黑暗领取奖励刷新消息

    RSP_DOOMSDAY_INFO_REFRESH = "RSP_DOOMSDAY_INFO_REFRESH", //末日考验副本数据刷新
    RSP_HEROCOPY_SWEEP_REFRESH = "RSP_HEROCOPY_SWEEP_REFRESH", //英雄副本扫荡刷新
    RSP_RUNECOPY_SWEEP_REFRESH = "RSP_RUNECOPY_SWEEP_REFRESH", //符文副本扫荡刷新

    SURVIVAL_SUBTYPE_REFRESH = "SURVIVAL_SUBTYPE_REFRESH",      //生存训练难度设置
}


