


/**
 * 末日副本信息
 * @Author: yaozu.hu
 * @Date: 2020-08-26 13:46:41
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:39:36
 */
export default class DoomsDayModel {

    doomsDayInfos: icmsg.DoomsDayInfo[] = [];

    curIndex: number = 0;

    //进入的关卡副本
    enterStageIDs: number[] = [];

    //为解锁关卡
    unLockStageId: number[] = [];

}
