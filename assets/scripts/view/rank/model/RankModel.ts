
/** 
 * @Description: 排行榜模型类
 * @Author: luoyong  
 * @Date: 2019-07-17 15:08:06
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 11:57:58
 */

export default class RankModel {

    rankPowerList: icmsg.RankBrief[] = [];

    rankRefineList: icmsg.RankBrief[] = [];

    powerValues: number[] = [];

    refineValues: number[] = [];

    yesterdayPowerRank: number = 0;

    yesterdayRefineRank: number = 0;

    rankListsMap = {};
    rankValuesMap = {};

    rankSelfMap = {}
}