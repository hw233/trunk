
/** 
 * @Description: 世界巅峰赛数据
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-21 17:25:16
 */
export default class WorldHonorModel {

    playersInfoMap: { [id: number]: icmsg.RoleBrief } = {};
    playersFlowerMap: { [id: number]: number } = {};
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

    //点赞数
    giveFlower: number = 0;

}
