import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ChatUtils from '../../../view/chat/utils/ChatUtils';
import FriendModel, { FriendType } from '../../../view/friend/model/FriendModel';
import FriendUtil from '../../../view/friend/utils/FriendUtil';
import GlobalUtil from '../../utils/GlobalUtil';
import ModelManager from '../ModelManager';
import RedPointUtils from '../../utils/RedPointUtils';
import { ChatChannel } from '../../../view/chat/enum/ChatChannel';
import { ChatEvent } from '../../../view/chat/enum/ChatEvent';
import { FriendEventId } from '../../../view/friend/enum/FriendEventId';


export default class FriendController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }
    get netEvents(): NetEventArray[] {
        return [
            [icmsg.FriendBecomeRsp.MsgType, this._onFriendBecomeRsp],
            [icmsg.FriendBlacklistInRsp.MsgType, this._onFriendBlacklistInRsp],
            [icmsg.FriendBlacklistOutRsp.MsgType, this._onFriendBlacklistOutRsp],
            [icmsg.FriendBlacklistRsp.MsgType, this._onFriendBlacklistRsp],
            [icmsg.FriendDeleteRsp.MsgType, this._onFriendDeleteRsp],
            [icmsg.FriendGiveRsp.MsgType, this._onFriendGiveRsp],
            [icmsg.FriendInviteRsp.MsgType, this._onFriendInviteRsp],
            [icmsg.FriendListRsp.MsgType, this._onFriendListRsp],
            [icmsg.FriendReceiveRsp.MsgType, this._onFriendReceiveRsp],
            [icmsg.FriendRecommendRsp.MsgType, this._onFriendRecommendRsp],
            [icmsg.FriendRefuseRsp.MsgType, this._onFriendRefuseRsp],
            [icmsg.FriendRequestRsp.MsgType, this._onFriendRequestRsp],
            [icmsg.FriendSearchRsp.MsgType, this._onFriendSearchRsp],
            [icmsg.FriendTakeRsp.MsgType, this._onFriendTakeRsp],

            [icmsg.FeedbackInfoRsp.MsgType, this._onFeedbackInfoRsp],
            [icmsg.FeedbackByRoleRsp.MsgType, this._onFeedbackByRoleRsp],
            [icmsg.FeedbackGmReplyRsp.MsgType, this._onFeedbackGmReplyRsp],
            [icmsg.FriendRenameNoticeRsp.MsgType, this._onFriendRenameNoticeRsp],
        ];
    }
    model: FriendModel = null

    onStart() {
        this.model = ModelManager.get(FriendModel)
        this.model.friendInfos = []
        this.model.friendIdList = {}
        // this.model.addList = {}
        this.model.initCfg();
    }

    onEnd() {
        this.model = null
    }

    _onFriendListRsp(data: icmsg.FriendListRsp) {
        let model = this.model;
        model.friendInfos = []
        model.applyList = []
        model.friendIdList = {}
        model.friendNameList = {}
        for (let index = 0; index < data.friends.length; index++) {
            const element = data.friends[index];
            let info: FriendType = {
                roleInfo: element.brief,
                friendship: element.friendship,
                utype: 0,
                elite: element.elite,
                mainLine: element.mainline,
            }
            //友谊点领取列表
            if ((info.friendship & 2) > 0 && model.friendShipGetList.indexOf(info.roleInfo.id) == -1) {
                model.friendShipGetList.push(info.roleInfo.id);
            }
            //友谊点赠送列表
            if ((info.friendship & 1) > 0 && model.friendShipSendList.indexOf(info.roleInfo.id) == -1) {
                model.friendShipSendList.push(info.roleInfo.id);
            }
            model.friendIdList[element.brief.id.toLocaleString()] = info
            model.friendNameList[element.brief.name] = info
            model.friendInfos.push(info)
        }
        model.friendInfos = model.friendInfos
        gdk.e.emit(FriendEventId.UPDATE_FRIEND_LIST)
        // 更新申请列表
        let len = data.invites.length
        if (len > 0) {
            for (let index = 0; index < len; index++) {
                const element = data.invites[index];
                let info: FriendType = {
                    roleInfo: element,
                    utype: 1,
                }
                model.applyList.push(info)
            }
            model.applyList = model.applyList
            gdk.e.emit(FriendEventId.UPDATE_FRIEND_APPLY_LIST)
        }

        //有好友改名发消息
        let friendChangeName = this.model.friendChangeName
        if (Object.keys(friendChangeName).length > 0) {
            //模拟收到改名玩家发送的私聊信息
            this.changNameSendMsg()
        }
    }

    _onFriendBlacklistRsp(data: icmsg.FriendBlacklistRsp) {
        this.model.backList = []
        this.model.backIdList = {}
        for (let index = 0; index < data.list.length; index++) {
            const element = data.list[index];
            let info: FriendType = {
                roleInfo: element,
                utype: 3,
            }
            this.model.backList.push(info)
            this.model.backIdList[element.id.toLocaleString()] = info
        }
        // gdk.e.emit(FriendEventId.UPDATE_BACK_LIST)
    }

    _onFriendBlacklistInRsp(data: icmsg.FriendBlacklistInRsp) {
        let brief = data.brief
        let backList = this.model.backList
        let backIdList = this.model.backIdList
        let info: FriendType = {
            roleInfo: brief,
            utype: 3,
        }
        backList.push(info)
        backIdList[brief.id.toLocaleString()] = info
        // gdk.e.emit(FriendEventId.UPDATE_BACK_LIST)
        ChatUtils.removeChatInfo()
    }

    _onFriendBlacklistOutRsp(data: icmsg.FriendBlacklistOutRsp) {
        let backList = this.model.backList
        let backIdList = this.model.backIdList
        for (let index = 0; index < backList.length; index++) {
            const info = backList[index];
            let roleInfo = info.roleInfo
            if (roleInfo.id.toLocaleString() == data.playerId.toLocaleString()) {
                backList.splice(index, 1)
                break
            }
        }
        delete backIdList[data.playerId.toLocaleString()]
        gdk.e.emit(FriendEventId.DELETE_BACKLIST, data.playerId)
    }

    /**申请加好友返回 */
    _onFriendRequestRsp(data: icmsg.FriendRequestRsp) {
        gdk.gui.showMessage("申请成功")
        // this.model.addList[data.playerId.toLocaleString()] = 1
        if (this.model.requestFriendList.indexOf(data.playerId) == -1) {
            this.model.requestFriendList.push(data.playerId);
            FriendUtil.setFriendDailyLimits(1);
        }
        gdk.e.emit(FriendEventId.UPDATE_RECOMMEND_STATE, data.playerId)
    }

    /**删除单个好友 */
    _removeFriendInfo(id: number) {
        let pId = id.toLocaleString();
        let friendIdList = this.model.friendIdList;
        if (friendIdList[pId]) {
            delete friendIdList[pId];
        }
        let friendInfos = this.model.friendInfos;
        for (let index = 0; index < friendInfos.length; index++) {
            const element = friendInfos[index];
            if (pId == element.roleInfo.id.toLocaleString()) {
                friendInfos.splice(index, 1);
                this.model.friendInfos = friendInfos;
                // gdk.e.emit(FriendEventId.DELETE_FRIEND, { utype: 0, info: element });
                break;
            }
        }
    }

    /**删除单个申请列表 */
    _removeApplyInfo(id: number) {
        let pId = id.toLocaleString()
        let applyList = this.model.applyList
        for (let index = 0; index < applyList.length; index++) {
            const element = applyList[index];
            if (pId == element.roleInfo.id.toLocaleString()) {
                applyList.splice(index, 1);
                this.model.applyList = applyList;
                // gdk.e.emit(FriendEventId.DELETE_FRIEND, { utype: 1, info: element });
                break
            }
        }
    }

    /**拒绝好友回调 */
    _onFriendRefuseRsp(data: icmsg.FriendRefuseRsp) {
        let allId = 0;
        // 回调0删除全部
        if (allId.toLocaleString() == data.playerId.toLocaleString()) {
            this.model.applyList = []
            gdk.e.emit(FriendEventId.UPDATE_FRIEND_APPLY_LIST)
        } else {
            this._removeApplyInfo(data.playerId)
        }
    }

    /**收到加好友申请 */
    _onFriendInviteRsp(data: icmsg.FriendInviteRsp) {
        let pId = data.brief.id.toLocaleString()
        for (let index = 0; index < this.model.applyList.length; index++) {
            const info = this.model.applyList[index];
            let id = info.roleInfo.id.toLocaleString();
            if (pId == id) {
                this.model.applyList = this.model.applyList;
                return;
            }
        }
        let info: FriendType = {
            roleInfo: data.brief,
            utype: 1,
        };
        this.model.applyList.push(info);
        this.model.applyList = this.model.applyList;
        gdk.e.emit(FriendEventId.UPDATE_FRIEND_APPLY_LIST)
    }

    isFriendExist(id: string) {
        let friendInfos = this.model.friendInfos;
        for (let k = 0; k < friendInfos.length; k++) {
            const friendInfo = friendInfos[k];
            if (friendInfo.roleInfo.id.toLocaleString() == id) {
                return friendInfo;
            }
        }
    }

    /**加好友成功回调 */
    _onFriendBecomeRsp(data: icmsg.FriendBecomeRsp) {
        let friendIdList = this.model.friendIdList;
        let friendInfos = this.model.friendInfos;
        let friendNameList = this.model.friendNameList
        let isApply: boolean = false;
        for (let i = 0; i < data.friend.length; i++) {
            const brief = data.friend[i];
            if (this.model.requestFriendList.indexOf(brief.id) != -1) isApply = true;
            let idStr = brief.id.toLocaleString();
            let info: FriendType = this.isFriendExist(idStr);
            if (info) {
                info.roleInfo = brief;
                info.utype = 0;
            } else {
                info = {
                    roleInfo: brief,
                    utype: 0,
                }
                friendInfos.push(info);
            }
            friendIdList[idStr] = info;
            friendNameList[brief.name] = info
            this._removeApplyInfo(brief.id);
            if (this.model.addFrienList.indexOf(brief.id) == -1) {
                this.model.addFrienList.push(brief.id);
                FriendUtil.setFriendDailyLimits(2);
            }
        }
        this.model.friendInfos = friendInfos;
        if (data.friend.length > 0) {
            gdk.gui.showMessage(`${isApply ? '好友申请通过' : '添加成功'}`);
        }
    }

    /**删除好友回调 */
    _onFriendDeleteRsp(data: icmsg.FriendDeleteRsp) {
        data.playerIds.forEach(id => {
            this._removeFriendInfo(id)
        });
    }

    /**推荐列表返回 */
    _onFriendRecommendRsp(data: icmsg.FriendRecommendRsp) {
        let recommendList = []
        for (let index = 0; index < data.list.length; index++) {
            const brief = data.list[index];
            let info: FriendType = {
                roleInfo: brief,
                utype: 2,
            }
            recommendList.push(info)
        }
        // this.model.addList = {}
        this.model.recommendList = recommendList
    }

    /**搜索列表返回 */
    _onFriendSearchRsp(data: icmsg.FriendSearchRsp) {
        let searchInfos = []
        for (let index = 0; index < data.list.length; index++) {
            const brief = data.list[index];
            let info: FriendType = {
                roleInfo: brief,
                utype: 4,
            }
            searchInfos.push(info)
        }
        this.model.searchInfos = searchInfos
    }

    /**赠送礼物返回 */
    _onFriendGiveRsp(data: icmsg.FriendGiveRsp) {
        let zero = 0
        let zId = zero.toLocaleString()
        let pId = data.playerId.toLocaleString()
        let friendInfos = this.model.friendInfos
        let friend: FriendType = null
        for (let index = 0; index < friendInfos.length; index++) {
            const info = friendInfos[index];
            let roleInfo = info.roleInfo
            let rId = roleInfo.id.toLocaleString()
            if (pId == zId || pId == rId) {
                info.friendship = info.friendship | 1
                friend = info
            }
        }
        if (pId == zId) {
            this.model.friendInfos = this.model.friendInfos
        } else {
            this.model.friendInfos = this.model.friendInfos
            gdk.e.emit(FriendEventId.UPDATE_ONE_FRIEND, friend)
        }
        if (this.model.friendShipSendList.indexOf(data.playerId) == -1) {
            this.model.friendShipSendList.push(data.playerId);
        }
    }

    _onFriendTakeRsp(data: icmsg.FriendTakeRsp) {
        let zero = 0
        let zId = zero.toLocaleString()
        let pId = data.playerId.toLocaleString()
        let friendInfos = this.model.friendInfos
        let friend: FriendType = null
        for (let index = 0; index < friendInfos.length; index++) {
            const info = friendInfos[index];
            let roleInfo = info.roleInfo
            let rId = roleInfo.id.toLocaleString()
            if (pId == zId || pId == rId) {
                info.friendship = info.friendship | 2
                friend = info
            }
        }
        if (pId == zId) {
            this.model.friendInfos = this.model.friendInfos
        } else {
            this.model.friendInfos = this.model.friendInfos
            gdk.e.emit(FriendEventId.UPDATE_ONE_FRIEND, friend)
        }

        if (this.model.friendShipGetList.indexOf(data.playerId) == -1) {
            this.model.friendShipGetList.push(data.playerId);
        }
    }

    /** */
    _onFriendReceiveRsp(data: icmsg.FriendReceiveRsp) {
        let friendInfos = this.model.friendInfos
        let friend: FriendType = null
        for (let index = 0; index < friendInfos.length; index++) {
            const info = friendInfos[index];
            let roleInfo = info.roleInfo
            if (roleInfo.id.toLocaleString() == data.playerId.toLocaleString()) {
                info.friendship = info.friendship | 4
                friend = info
            }
        }
        this.model.friendInfos = this.model.friendInfos
        gdk.e.emit(FriendEventId.UPDATE_ONE_FRIEND, friend)
    }

    _onFeedbackInfoRsp(data: icmsg.FeedbackInfoRsp) {
        this.model.feedBackList = data.reply;
        gdk.e.emit(FriendEventId.UPDATE_FEEDBACK_LIST);
    }

    _onFeedbackByRoleRsp(data: icmsg.FeedbackByRoleRsp) {

    }

    _onFeedbackGmReplyRsp(data: icmsg.FeedbackGmReplyRsp) {

        // 标记红点
        RedPointUtils.save_state('gm_feedback', true)

        let list = this.model.feedBackList;
        list.push(data.reply);
        gdk.e.emit(FriendEventId.UPDATE_FEEDBACK_LIST);
    }

    _onFriendRenameNoticeRsp(data: icmsg.FriendRenameNoticeRsp) {
        //1是自己，2是好友
        if (data.noticeType == 2) {
            this.model.friendChangeName = { oldName: data.oldName, newName: data.newName }
            this.changNameSendMsg()
        }
    }

    changNameSendMsg() {
        if (this.model.friendInfos.length > 0) {
            let oldName = this.model.friendChangeName["oldName"]
            let newName = this.model.friendChangeName["newName"]
            let friendInfo: FriendType = this.model.friendNameList[oldName]
            if (!friendInfo) {
                friendInfo = this.model.friendNameList[newName]
            }
            if (friendInfo) {
                let info = new icmsg.ChatSendRsp()
                info.playerId = friendInfo.roleInfo.id
                info.playerName = newName
                info.playerHead = friendInfo.roleInfo.head
                info.playerFrame = friendInfo.roleInfo.headFrame
                info.playerLv = friendInfo.roleInfo.level
                info.channel = ChatChannel.PRIVATE
                info.chatTime = GlobalUtil.getServerTime()
                info.content = `我是${oldName}，现改名为${newName}，常来找我玩哦~`
                gdk.e.emit(ChatEvent.ADD_FRIEND_CHANGE_NAME_MSG, info)
            }
            this.model.friendChangeName = {}
        }
    }
}