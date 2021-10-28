/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-23 13:42:27 
  */


export default class ChampionModel {
  rankList: icmsg.ChampionPlayer[] = []; //排行榜
  myRank: number; //排名
  myPoints: number; //段位分
  exchangedInfo: any = {}; //积分兑换记录 id-ChampionExchange
  guessList: icmsg.ChampionGuess[] = [];//竞猜 匹配的玩家信息列表
  guessIndex: number; //当前选择的竞猜组

  redInfoData: icmsg.ChampionRedPointsRsp;
  infoData: icmsg.ChampionInfoRsp;
  championMatchData: icmsg.ChampionMatchRsp;
  championFightData: icmsg.ChampionFightStartRsp;
  addBuyNum: boolean = false//是否更新购买数
  isUpDivision: boolean = false//是否段位晋升
  isDefLose: boolean = false;
  reMatchTimes: number = 0; //重新匹配次数
}
