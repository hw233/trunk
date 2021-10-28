/** 
 * Pve召唤物相关常量的定义
 * @Author: sthoo.huang  
 * @Date: 2019-05-28 17:35:50 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-26 18:34:45
 */

export enum PveCalledAIType {

    MONSTER = 1,
    CALLED = 2,
    TRAP = 3,
    GATE = 4,

    OPPONENT_CALLED = 12,   // 竞技模式在对手场景召唤宠物
    OPPONENT_CALLED_NOEFFECT = 13,  // 竞技模式在对手场景召唤宠物，不显示出现特效
}