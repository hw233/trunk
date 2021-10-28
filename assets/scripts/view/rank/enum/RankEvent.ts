/** 
 * @Description: 
 * @Author: luoyong 
 * @Date: 2019-07-17 15:12:30 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-07-06 20:30:31
 */

// export enum RankEvent {
//     REQ_RANK_POWER = "REQ_RANK_POWER",  // 向服务器请求战力排行榜信息
//     REQ_RANK_POWER_VALUES = "REQ_RANK_POWER_VALUES",//请求战力榜自己的排名信息

//     REQ_RANK_REFINE = "REQ_RANK_REFINE",// 向服务器请求试炼排行榜信息
//     REQ_RANK_REFINE_VALUES = "REQ_RANK_REFINE_VALUES",//请求试炼榜自己的排名信息

//     REQ_RANK = "REQ_RANK",// 向服务器请求排行榜信息
//     REQ_RANK_VALUES = "REQ_RANK_VALUES",// 向服务器请求排行榜信息

//     REQ_RANK_YESTERDAY = "REQ_RANK_YESTERDAY",//请求昨日排名
// }


export enum RankTypes {
    //1: 战力榜 2: 主线榜 3: 试炼榜 4: 精英榜 5: 竞技榜
    Power = 1,  //战斗力
    Stage = 2,  //主线挑战
    Refine = 3, //无尽的黑暗
    Cup = 4,    //主线奖杯
    Arena = 5,   //竞技场
    DianSha = 6,   //点杀副本排行榜
    Cross = 7,//跨服
    Combine = 8,//合服
}
