import { CopyCfg } from './../../../a/config';
import { InstanceType } from '../enum/InstanceEnumDef';

/** 
 * @Description: 副本数据模型类
 * @Author: jijing.liu  
 * @Date: 2019-04-18 11:13:54
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-26 11:14:20
 */

export class InstanceData {
    data: CopyCfg;
    //副本类型
    type: InstanceType;
    index: number;
    //副本网络数据参数，服务器同步。serverData为空代表服务器数据未返回或玩家还没通过第一个关卡
    serverData: icmsg.DungeonInfo = null;
}

//点杀副本雇佣兵数据
export class InstanceMercenaryData {
    //副本类型
    type: number;

    level: number;
    //是否解锁
    isOpen: boolean;
    scroll: cc.ScrollView;
}

export default class InstanceModel {

    //挂机奖励列表
    rewardList: Array<icmsg.GoodsInfo> = [];

    //是否已获取到服务器副本数据
    isInstDataCplt: boolean;

    //是否已读取配置
    configLoaded: boolean = false;

    //副本定义数据 {copyid:number，data:[InstanceData]}
    instanceInfos: any = {};
    //关卡数据{copyid:number，data:[CopyStageCfg]}
    stageDatas: any = {};
    //UI副本列表数据, InstanceData.serverData 保存了服务器同步的数据
    instanceListItemData: Array<InstanceData> = [];

    //服务器的副本数据
    instanceNetData: Array<icmsg.DungeonInfo> = [];

    //服务器的英雄副本数据(旧)
    dungeonBoss: icmsg.DungeonBoss = null;

    //服务器的英雄副本数据(新)
    dunGeonBossJusticeState: icmsg.JusticeStateRsp = null;

    //英雄副本的攻击频率，单位秒
    attSpeed: number = 5;
    //记录英雄副本最后退出时打的英雄
    instanceBossLastStage: number = 0;
    //副本挂机奖励信息
    instanceHangReward = [];

    //副本失败的记录
    instanceFailStage: any = {};

    //副本进入记录
    instanceEnterState: any = {};

    instanceId: number = 0;

    //生存训练副本进入记录
    survivalEnterCopy: boolean = false;

    //副本点中的item项，用于跳转窗口返回
    selectInstanceData: InstanceData = null;
    //英雄副本关卡进度
    heroCopyPassStageIDs: number[] = [];
    //英雄副本关卡扫荡次数
    heroCopySweepTimes: number[] = [];
    //记录英雄副本的页签
    heroCopyCurIndex: number = -1;
    heroEnterCopy: number[] = [];

    //符文副本信息
    runeInfo: icmsg.DungeonRuneInfoRsp = null;
    //符文副本本次挑战增加的击杀怪物数量
    runeMonsterAdd: number = 0;
    //符文副本进入下一关卡
    runeMonsterNext: boolean = false;
    //符文副本进入下一关卡
    runeEnterCopy: boolean = false;


    //英雄试炼信息
    heroTrialInfo: icmsg.DungeonOrdealInfoRsp = null;
    ClickHeroTrialEndless: boolean = false;

    newHeroTrialInfo: icmsg.NewOrdealInfoRsp = null;
    ClickNewHeroTrialEndless: boolean = false;

}