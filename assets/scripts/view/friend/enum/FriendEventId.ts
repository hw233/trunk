/** 
 * @Description: 好友时间
 * @Author: weiliang.huang  
 * @Date: 2019-03-27 10:30:17 
 * @Last Modified by: chengyou.lin
 * @Last Modified time: 2020-03-19 15:20:55
 */
export enum FriendEventId {
    DELETE_FRIEND = "DELETE_FRIEND", // 通知删除好友

    DELETE_BACKLIST = "DELETE_BACKLIST", // 通知删除好友

    UPDATE_ONE_FRIEND = "UPDATE_ONE_FRIEND", // 更新单个好友

    UPDATE_BACK_LIST = "UPDATE_BACK_LIST", // 更新黑名单

    UPDATE_FRIEND_LIST = "UPDATE_FRIEND_LIST", // 更新好友列表

    UPDATE_FRIEND_APPLY_LIST = "UPDATE_FRIEND_APPLY_LIST",  // 更新申请列表

    UPDATE_RECOMMEND_STATE = "UPDATE_RECOMMEND_STATE", //更新单个推荐好友状态

    UPDATE_FEEDBACK_LIST = "UPDATE_FEEDBACK_LIST",//更新GM反馈的消息



}