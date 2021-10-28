import { Guardiantower_towerCfg } from '../../../a/config';

/** 
 * @Description: 护使秘境model
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-15 22:03:05
 */
export default class GuardianTowerModel {

    stateInfo: icmsg.GuardianTowerStateRsp;
    curCfg: Guardiantower_towerCfg;
    nextState: number = 0; //0没有下一关 1有下一关（时间已解锁）2有下一关（时间未解锁）
    enterGuardianTower: boolean = false;

    curDay: number;
}
