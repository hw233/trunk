/** 
 * @Description: 殿堂指挥官数据模型类
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-22 18:26:23
 */
export default class VaultModel {

    addNum: number[] = [1, 5, 10]
    curNum: number = 0;
    curPos: number = 0;
    curDifficulty: number = 0;
    infoData: icmsg.VaultPositionInfoRsp;
    heroList: icmsg.FightHero[] = [];
    general: icmsg.FightGeneral = null;

    enterView: boolean = false//是否进入界面
}
