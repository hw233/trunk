import ConfigManager from '../../../common/managers/ConfigManager';
import { GlobalCfg } from '../../../a/config';

/** 
 * @Description: 好友数据模型类
 * @Author: weiliang.huang  
 * @Date: 2019-03-26 18:35:18 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-30 09:59:43
 */

export interface FriendType {
    roleInfo: icmsg.RoleBrief,
    friendship?: number;
    elite?: number,
    mainLine?: number,
    /**好友类型 0:我的好友 1:申请列表好友 2:推荐列表好友 3:黑名单 4:搜索列表*/
    utype?: number,
    name?: string,
    lv?: number,
    vipLv?: number,
    fightNum?: number,
    isCheckSelect?: boolean,//是否勾选
}
export default class FriendModel {

    friendInfos: Array<FriendType> = []  // 好友列表

    friendIdList: any = {}   // 好友{id-data}

    friendNameList: any = {}   // 好友{name-data}

    applyList: Array<FriendType> = []  // 申请列表

    backList: Array<FriendType> = []  // 黑名单

    backIdList: any = {}     /// 黑名单{id-data}

    recommendList: Array<FriendType> = []  // 推荐列表

    searchInfos: Array<FriendType> = []  // 搜素结果

    // addList: any = {}    // 保存申请添加过的玩家id

    panelIndex: number = 0  // 好友界面选项卡, 0:好友 1:申请列表 2:添加 3:私聊

    feedBackList: icmsg.FeedbackReply[] = [];//反馈的内容

    friendChangeName = {}

    friendShipGetList: number[] = []; //当日友谊点领取列表
    friendShipSendList: number[] = []; //当日友谊点赠送列表
    addFrienList: number[] = []; //当日好友添加数
    requestFriendList: number[] = []; //当日好友请求数

    maxFriend: number; // 最大好友数/每日最多领取友谊点次数
    maxPost: number; //每日最大请求数
    maxAdd: number; //每日最大添加数
    maxApply: number; //申请列表最大数
    maxBlackList: number; //黑名单最大数
    maxSendFriendShip: number; //一天赠送/添加友谊点数

    checkSelect: boolean = false //批量删除是否选择
    selectIds: number[] = []

    initCfg() {
        let value = ConfigManager.getItemByField(GlobalCfg, 'key', 'friend_limits').value;
        [this.maxFriend, this.maxPost, this.maxAdd, this.maxApply, this.maxBlackList, this.maxSendFriendShip] = [value[0], value[1], value[2], value[3], value[4], value[5]];
    }
}