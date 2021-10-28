/**
 * @Description: 兵营事件id
 * @Author: weiliang.huang
 * @Date: 2019-05-06 11:53:28
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-15 16:55:34
 */


export enum BYEventId {
    BY_LIST_RSP = "BY_LIST_RSP", // 请求兵营信息
    BY_TECH_UP_RSP = "BY_TECH_UP_RSP", // 科技升级

    UPDATE_BY_INFO = "UPDATE_BY_INFO", // 更新兵营信息
    UPDATE_BY_UNLOCK = "UPDATE_BY_UNLOCK", // 兵营解锁

    UPDATE_BY_SOLDIERS = "UPDATE_BY_SOLDIERS", // 更新已有的兵种信息
    BYARMY_SKIN_SETON = "BYARMY_SKIN_SETON",    //兵团 精甲穿戴消息
    BYARMY_RESOLVE_SELECTSKIN = "BYARMY_RESOLVE_SELECTSKIN",  //兵团 选择融甲材料消息

    //**********士兵科技NEW*********** */
    BY_TECH_LV_UP = "BY_TECH_LV_UP", //兵营科技升级
}