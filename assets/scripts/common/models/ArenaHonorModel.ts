/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-07 20:00:16 
  */
export default class ArenaHonorModel {
  playersInfoMap: { [id: number]: icmsg.RoleBrief } = {};
  guildNameMap: { [id: number]: string } = {};
  list: icmsg.ArenaHonorMatch[] = []
  draw: number[] = [];

  //
  enterGuildView: boolean = false;
  openDefenferView: boolean = false;

  //竞猜
  guessIndex: number = 0;
  guessGroup: number = 0;
  guessMatch: number = 0;
  guessInfo: icmsg.ArenaHonorMatch;
  player1Fight: icmsg.DefendFight;
  player2Fight: icmsg.DefendFight;

}
