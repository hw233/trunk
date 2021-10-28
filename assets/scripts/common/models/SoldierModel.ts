/** 
  * @Description: 英雄士兵数据模型
  * @Author: weiliang.huang  
  * @Date: 2019-05-05 14:18:49 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 10:55:39
*/

export type SoldierType = {
    curId: number,       // 当前士兵id
    //list: HeroSoldier[], // 士兵列表
    items: { [soldierId: number]: icmsg.HeroSoldier },          // 士兵key-may表
    selectId?: number,
}
export default class SoldierModel {
    heroSoldiers: { [heroId: number]: SoldierType } = {}  // 英雄id--士兵列表
}
