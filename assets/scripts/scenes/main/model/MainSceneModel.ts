export enum MainSelectType {
    BY = 1,
    LOTTERY = 2,
    BAG = 3,
    ROLE = 4,
    BASE = 5,
    PVE = 6,
}
/** 
 * 文件
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-25 11:52:36 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:00:32
 */

export default class MainSceneModel {

    /**聊天信息待显示栏 */
    waitInfos: Array<icmsg.ChatSendRsp> = [];

    /**最大缓存数量 */
    maxChatNum: 20;

    /**主界面选择项 */
    mainSelectIdx: MainSelectType = -1;

    /**主界面Dock显隐状态，0:显示 1:隐藏 */
    btnState: 0 | 1 = 0;
}