import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import { Relic_pointCfg, VipCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-28 09:57:45 
  */
export default class RelicModel {
  mapId: number; //当前地图id
  curExploreCity: string; //当前探索城池  maptType-id
  // curAssistCity: string; //当前协助城池
  curAtkCity: string; //当前进攻城池
  curAtkPlayerType: number;// 0-owner 1-helper
  curExploreReward: icmsg.RelicQueryRewardsRsp; //探索奖励
  exploreTimes: number = 0;//已经使用的探索次数
  extraExploreTimes: number = 0;//额外探索次数
  cityDataMap: { [mapType: number]: { [cityId: number]: icmsg.RelicPoint } } = {}; //城池数据 maptype - { cityId: info}
  cityMap: { [cityId: number]: RelicCityInfo } = {};
  pointMap: { [pos: string]: RelicPointInfo } = {}; // key:"x-y" value:RelicPointInfo
  RedPointEventIdMap: { [eventId: number]: boolean } = {};// 红点事件 id-boolean
  isFirstInView: boolean = true;
  jumpArgs: string = ''; // 结算界面退出, 参数用于打开原挑战据点 格式 'maptype-id';
  mapNumId: number; //根据昨日跨服登录人数决定的地图据点数区间id
  pointTransNoticeList: { [key: string]: icmsg.RelicTransferNoticeRsp } = {}; //收到的据点转让列表
  miniChatatkNoticeVisible: boolean = false; //聊天界面被抢提示
  atkNoticeList: icmsg.RelicUnderAttackNoticeRsp[] = []; //据点被攻击通知列表
  pointHpData = [0, 0]//当前抢夺点的 当前耐久度/总耐久度

  rankInfo: icmsg.RelicRankGuild[] = [];
  crossServerNum: number;
  myRankInfo: icmsg.RelicRankGuild;
  myRankNum: number;

  //是否购买了通行证
  isBuyPassPort: boolean = false;
  //通行证免费奖励领取位图
  passPortFreeReward: number[] = []
  //通行证购买 奖励领取位图
  passPortChargeReward: number[] = []
  //通行证 兼容外网已有通行证的玩家，保留他们更新活动类型前的通行证有些时间
  passPortsETime: icmsg.PassSETime;
  //最近一次计算的周期
  lastPeriod: number;

  //清除协防数/抢夺次数排行榜
  relicAtkRankList: icmsg.RelicRankPlayer[] = [];
  relicAtkMyRank: icmsg.RelicRankPlayer;
  relicAtkMyRankOrder: number;

  /**探索总次数 */
  get totalExploreTime() {
    let vipLv = ModelManager.get(RoleModel).vipLv;
    let cfg = ConfigManager.getItemByField(VipCfg, 'level', vipLv);
    return cfg.vip11;
  }
}

/**地图类型 */
export enum RelicMapType {
  SafeArea = 1, //安全区
  PkArea, //pk区
}

/**城池信息 */
export type RelicCityInfo = {
  cityId: number,
  pointType: number,
  cfg: Relic_pointCfg,
  points: cc.Vec2[],
  cityPos: cc.Vec2,
  numType: number,
}

/**每个点的信息 */
export type RelicPointInfo = {
  ownerCity: number,
  numType: number,
  point: cc.Vec2, //瓦片坐标
  mapPoint: cc.Vec2,//像素坐标
}

/**城池状态 */
export enum RelicCityState {
  idle = 0, //空闲
  explore, //探索中
  scramble, //争夺状态 (不一定处于战斗中)
  atking,  //战斗中 (一定也处于争夺状态)
}

/**玩家身份 */
export enum RelicRoleType {
  Owner = 0, //归属者
  Atk, //攻击者
  Assist, //协防者
  None, //据点空闲 
  SameGuild,//同公会
  Others,//其他待定
}