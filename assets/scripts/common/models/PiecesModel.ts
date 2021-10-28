import ConfigManager from '../managers/ConfigManager';
import { Pieces_divisionCfg } from '../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-17 17:34:29 
  */
export default class PiecesModel {

  //basic info
  curModel: number; // 1-无尽模式 2-自走棋模式
  curRewardType: number; //奖励类型
  restChallengeTimes: number //剩余挑战次数
  restBuyTimes: number //剩余购买次数
  score: number = 0; //积分
  divisionRewardMap: { [division: number]: number } = {}; //段位奖励领取
  addScore: number = 0; //结算界面 本轮增加总值
  talentPoint: number //天赋点
  talentMap: { [id: number]: number } = {} //天赋表 id-lv
  croServerNum: number; //跨服组服务器数量
  firstInChessView: boolean = true;
  //获取段位
  get divisionCfg(): Pieces_divisionCfg {
    let c = ConfigManager.getItems(Pieces_divisionCfg);
    let type = Math.min(this.curRewardType, c[c.length - 1].type);
    let cfgs = ConfigManager.getItems(Pieces_divisionCfg, (cfg: Pieces_divisionCfg) => {
      if (cfg.type == type) return true;
    });
    cfgs = cfgs.reverse();
    for (let i = 0; i < cfgs.length; i++) {
      if (this.score >= cfgs[i].point) {
        return cfgs[i];
      }
    }
  }

  //=============战斗============//
  heroMap: { [heroId: number]: icmsg.PiecesHero } = {}; //玩家英雄列表
  computerTeamId: number; //电脑阵容id
  passWave: number = 0; //当前通过波次
  startRound: number; //初始波次
  startHp: number;  //初始血量
  lastWaveArrivalEnemy: number = 0; //上一波次漏掉的怪物数量

  //=========英雄购买界面===========//
  refreshHeroList: number[] = []; //刷新出来的英雄列表
  silver: number; //银币
  refreshIsLock: boolean; //英雄列表是否被锁定
  roundRefreshTimes: { [round: number]: number } = {}; //每回合刷新次数

  //=============棋盘等级==============//
  chessExp: number = 0;
  chessLv: number = 1;
}

export enum PiecesPvPCardArea {
  fight = 0, //上阵区
  prepare, //备战区
}

/**天赋类型 */
export enum PiecesTalentType {
  type1 = 1,  //每回合的第X次刷新免费
  type2,      //每刷新X次必出1个光暗英雄
  type3,      //系统自动刷新时必出1个光暗英雄
  type4,      //每刷新X次必出1个已拥有的英雄
  type5,      //每回合银币掉落+X%
  type6,      //三系英雄的刷新概率+X%
  type7,      //利息+X%
  type8,      //光暗英雄的刷新概率+X%
  type9,      //怪物全部击杀时额外奖励X%的银币
  type10,     //刷新消耗-X%
  type11,     //购买消耗-X%
  type12,     //刷新英雄数量上限+X
  type13,     //系统刷新时必出X个已拥有的英雄
}
