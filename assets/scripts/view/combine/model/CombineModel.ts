/** 
 * @Description: 合服相关数据类
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 15:24:04 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-07 15:22:57
 */

export default class CombineModel {
    //限购商城活动期间充值金额
    restrictionRecharge: number = 0;
    //限购商城购买记录
    restrictionStoreInfo: { [type: number]: icmsg.MergeCarnivalStoreGoods } = {};
    //昨日登录人数
    ydLoginNum: number;


    cServerRankData: icmsg.MergeCarnivalServerRankRsp;
    playerScore: number = 0
    playerRank: number = 0
    exchangeRecord = []
    rankingList: icmsg.RankBrief[] = []

    serverScore: number = 0
    serverRank: number = 0
}