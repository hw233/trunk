import FriendModel, { FriendType } from '../model/FriendModel';
import FriendUtil from '../utils/FriendUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RedPointCtrl from '../../../common/widgets/RedPointCtrl';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { FriendEventId } from '../enum/FriendEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
 * @Description: 好友界面控制器
 * @Author: weiliang.huang  
 * @Date: 2019-03-26 18:29:59 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-30 11:28:57
 */

const { ccclass, property, menu } = cc._decorator;

let TitleTexts = []
@ccclass
@menu("qszc/view/friend/FriendViewCtrl")
export default class FriendViewCtrl extends gdk.BasePanel {

    @property(cc.RichText)
    numLab: cc.RichText = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    friendItem: cc.Prefab = null

    @property(cc.Prefab)
    chatPanelPre: cc.Prefab = null

    @property(cc.Node)
    tabBtns: Array<cc.Node> = []

    @property(cc.Node)
    friendList: cc.Node = null

    @property(cc.Node)
    panels: cc.Node[] = []

    @property(cc.EditBox)
    searchBox: cc.EditBox = null

    @property(cc.Button)
    oneKeyGet: cc.Button = null

    @property(cc.Button)
    oneKeySend: cc.Button = null

    @property(cc.Node)
    chatNode: cc.Node = null

    @property(cc.Node)
    tabMenu: cc.Node = null

    @property(cc.Node)
    tips1: cc.Node = null;
    @property(cc.Node)
    tips2: cc.Node = null;

    @property(cc.Node)
    check: cc.Node = null;

    @property(cc.Node)
    checkPanel: cc.Node = null;

    chatPanel: cc.Node = null
    gmChatPanel: cc.Node = null
    curList: Array<FriendType> = []
    list: ListView = null;  // 好友列表scroll
    resetPos: boolean = true    // 是否需要重置scroll位置,一般在切换选项卡时才需要

    get model(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }



    start() {
        // gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._att_Update, this, 0, false);
        this.title = 'i18n:FRIEND_TITLE'
        this.selectPanel(null, this.model.panelIndex)

        TitleTexts = [gdk.i18n.t("i18n:FRIEND_TIP11"), gdk.i18n.t("i18n:FRIEND_TIP12"), gdk.i18n.t("i18n:FRIEND_TIP13"), gdk.i18n.t("i18n:FRIEND_TIP14")]
    }

    onEnable() {
        gdk.e.on(FriendEventId.DELETE_FRIEND, this._deleteFreind, this)
        gdk.e.on(FriendEventId.UPDATE_ONE_FRIEND, this._updateOneFriend, this)
        gdk.e.on(FriendEventId.UPDATE_RECOMMEND_STATE, this._updateRecommendState, this)
        NetManager.on(icmsg.FriendTakeRsp.MsgType, this._onFriendTakeRsp, this)
    }

    onDisable() {
        this.model.panelIndex = 0
        gdk.e.targetOff(this)
        NetManager.targetOff(this);
        this.model.selectIds = []
        this.model.checkSelect = false
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.friendItem,
            cb_host: this,
            async: true,
            column: 1,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    //展示获得的友谊币
    _onFriendTakeRsp(data: icmsg.FriendTakeRsp) {
        let item = new icmsg.GoodsInfo;
        item.typeId = 7;
        item.num = data.addPoints;
        GlobalUtil.openRewadrView([item]);
    }

    _updateScroll() {
        this._initListView()
        let idx = this.model.panelIndex
        let list = []
        if (idx <= 1) {
            let len = this.curList.length
            let onlineTab = []
            let offlineTab = []
            for (let index = 0; index < len; index++) {
                const element = this.curList[index];
                if (element.roleInfo.logoutTime == 0) {
                    onlineTab.push(element)
                } else {
                    offlineTab.push(element)
                }
            }
            GlobalUtil.sortArray(onlineTab, this._sortFunc)
            GlobalUtil.sortArray(offlineTab, this._sortFunc)
            list = [...onlineTab, ...offlineTab]
        } else {
            list = this.curList
        }
        this.curList = list
        this.list.set_data(list, this.resetPos)
        if (this.model.panelIndex == 0) {
            this.tips1.active = list.length == 0;
        } else {
            this.tips1.active = false;
        }
        if (this.model.panelIndex == 1) {
            this.tips2.active = list.length == 0;
        } else {
            this.tips2.active = false;
        }
    }

    @gdk.binding("model.friendInfos")
    _updateFriendScroll() {
        let model = this.model
        if (model.panelIndex != 0) {
            return
        }
        this.curList = model.friendInfos

        //好友数量暂时写死 20
        this.numLab.string = `${TitleTexts[0]}:<color=#488b00>${this.curList.length}</c>/${model.maxFriend}`//${model.maxNum}
        this._updateScroll()

        let redCtrl = this.tabBtns[0].getComponent(RedPointCtrl);
        if (this._checkBtnGet() || this._checkBtnSend()) {
            redCtrl.isShow = true;
        } else {
            redCtrl.isShow = false;
        }
    }

    //好友面板 一键接受是否可以点击
    _checkBtnGet() {
        let list = this.model.friendInfos;
        let state = false;
        for (let i = 0; i < list.length; i++) {
            if (((list[i].friendship & 4) > 0) && !((list[i].friendship & 2) > 0)) {
                state = true;
                break;
            }
        }
        if (this.model.friendShipGetList.length >= this.model.maxFriend) state = false;
        return state;
    }

    //好友面板 一键赠送是否可点击
    _checkBtnSend() {
        let list = this.model.friendInfos;
        let state = false;
        for (let i = 0; i < list.length; i++) {
            if (!((list[i].friendship & 1) > 0)) {
                state = true;
                break;
            }
        }
        if (this.model.friendShipSendList.length >= this.model.maxFriend) state = false;
        return state;
    }

    @gdk.binding("model.applyList")
    _updateApplyList() {
        let model = this.model
        if (model.panelIndex != 1) {
            return
        }
        let list = model.applyList.concat();
        GlobalUtil.sortArray(list, this._sortFunc)
        this.curList = list
        this.numLab.string = `${TitleTexts[1]}:<color=#488b00>${this.curList.length}</c>/${this.model.maxApply}` //${model.maxNum}
        this._updateScroll()

        let redCtrl = this.tabBtns[1].getComponent(RedPointCtrl);
        if (list.length > 0) {
            redCtrl.isShow = true;
        } else {
            redCtrl.isShow = false;
        }
    }

    @gdk.binding("model.recommendList")
    _updateRecommendList() {
        let model = this.model
        if (model.panelIndex != 2) {
            return
        }
        let list = model.recommendList
        GlobalUtil.sortArray(list, this._sortFunc)
        this.curList = []
        for (let i = 0; i < list.length; i++) {
            // let id = list[i].roleInfo.id.toLocaleString();
            // if (!this.model.addList[id] && !this.model.backIdList[id]) {
            // }
            this.curList.push(list[i])
        }
        if (this.curList.length == 0) gdk.gui.showMessage(gdk.i18n.t("i18n:FRIEND_TIP15"));
        this._updateScroll()
    }

    @gdk.binding("model.searchInfos")
    _updateSearchList() {
        let model = this.model
        if (model.panelIndex != 2) {
            return
        }
        let list = model.searchInfos
        GlobalUtil.sortArray(list, this._sortFunc)
        this.curList = list
        this._updateScroll()
    }

    // 好友排序函数
    _sortFunc(a: FriendType, b: FriendType) {
        let cb = (offTime) => {
            let serverTime = ModelManager.get(ServerModel).serverTime
            offTime = offTime == 0 ? serverTime : offTime;
            // console.log(serverTime, offTime)
            let pasTime = Math.floor((serverTime - offTime * 1000) / 1000)
            let day = Math.floor(pasTime / 3600 / 24)
            let hour = Math.floor(pasTime / 3600)
            let min = Math.floor(pasTime / 60)
            return [day, hour, min];
        }

        let aT = cb(a.roleInfo.logoutTime);
        let bT = cb(b.roleInfo.logoutTime);
        if (aT[0] == bT[0]) {
            if (aT[1] == bT[1]) {
                if (aT[2] == bT[2]) {
                    if (a.roleInfo.level == b.roleInfo.level) {
                        return b.roleInfo.power - a.roleInfo.power
                    } else {
                        return b.roleInfo.level - a.roleInfo.level
                    }
                }
                else {
                    return aT[2] - bT[1];
                }
            }
            else {
                return aT[1] - bT[1];
            }
        }
        else {
            return aT[0] - bT[0];
        }
    }

    //删除好友
    _deleteFreind(e: gdk.Event) {
        let model = this.model
        let utype = e.data.utype
        if (utype != model.panelIndex) {
            return
        }
        let info: FriendType = e.data.info
        for (let index = 0; index < this.curList.length; index++) {
            const element = this.curList[index];
            if (info.roleInfo.id.toLocaleString() == element.roleInfo.id.toLocaleString()) {
                this.list.remove_data(index)
                break
            }
        }
        this.numLab.string = `${TitleTexts[0]}:<color=#488b00>${this.curList.length}</c>/${model.maxFriend}`
    }

    _createChatPanel() {
        if (!this.chatPanel) {
            // let resId = gdk.Tool.getResIdByNode(this.node)
            // gdk.rm.loadRes(resId, "view/friend/prefab/ChatPanel", cc.Prefab, (panelItem: cc.Prefab) => {
            //     let node = cc.instantiate(panelItem)
            //     node.active = this.model.panelIndex == 3
            //     node.parent = this.chatNode
            //     node.zIndex = 10
            //     node.y = 0
            //     this.chatPanel = node
            // })
            let node = cc.instantiate(this.chatPanelPre);
            node.active = this.model.panelIndex == 3;
            this.chatNode.addChild(node);
            node.height = this.chatNode.height;
            this.chatPanel = node;
        }
    }

    _createGMChatPanel() {
        if (!this.gmChatPanel) {
            let resId = gdk.Tool.getResIdByNode(this.node)
            gdk.rm.loadRes(resId, "view/friend/prefab/GMChatPanel", cc.Prefab, (panelItem: cc.Prefab) => {
                let node = cc.instantiate(panelItem)
                node.active = this.model.panelIndex == 4
                node.parent = this.node
                node.y = 0
                this.gmChatPanel = node
            })
        }
    }

    selectPanel(e, utype) {
        this.resetPos = true
        utype = parseInt(utype)
        if (utype != 0) this.tips1.active = false;
        if (utype != 1) this.tips2.active = false;
        this.tabMenu.getComponent(UiTabMenuCtrl).showSelect(utype);
        this.model.panelIndex = utype
        // for (let idx = 0; idx < this.selectBtns.length; idx++) {
        //     const element = this.selectBtns[idx];
        //     const panel = this.panels[idx];
        //     if (panel) {
        //         panel.active = idx == utype
        //     }
        //     element.interactable = idx != utype
        //     let lab = element.node.getChildByName("Background").getChildByName("Label");
        //     let color = "#aca294"
        //     if (idx == utype) {
        //         color = "#ffeb91"
        //     }
        //     lab.color = cc.color(color)
        // }
        for (let idx = 0; idx < this.panels.length; idx++) {
            const panel = this.panels[idx];
            if (panel) {
                panel.active = idx == utype
            }
        }

        this.check.active = utype == 0
        if (utype != 0) {
            this.model.checkSelect = false
            this._updateCheckState()
        }
        this.numLab.node.active = utype <= 1
        // this.myPanel.active = utype == 0
        if (this.chatPanel) {
            this.chatPanel.active = utype == 3
        }

        if (this.gmChatPanel) {
            this.gmChatPanel.active = utype == 4;
        }

        this.friendList.active = utype < 3

        // this.title = TitleTexts[utype]
        if (utype == 3) {
            // this._updateFriendScroll()
            this._createChatPanel()
        } else if (utype == 4) {
            this._createGMChatPanel()
        } else {
            // this._updateSearchPanel()
            switch (utype) {
                case 0:
                case 1:
                    NetManager.send(new icmsg.FriendListReq())
                    break;
                case 2:
                    NetManager.send(new icmsg.FriendRecommendReq())
                default:
                    break;
            }
        }
    }

    _updateOneFriend(e: gdk.Event) {
        let friend: FriendType = e.data
        if (!friend) {
            return
        }
        let id = friend.roleInfo.id.toLocaleString()
        let pId = id.toLocaleString()
        for (let index = 0; index < this.curList.length; index++) {
            const element = this.curList[index];
            let eId = element.roleInfo.id.toLocaleString()
            if (eId == pId) {
                this.curList[index] = friend
                this.list.refresh_item(index, friend)
                break
            }
        }
    }

    /**更新推荐列表状态 */
    _updateRecommendState(e: gdk.Event) {
        let id: number = e.data
        //策划需求，已申请的，移除推荐列表
        let pId = id.toLocaleString();
        let recommendList = this.model.recommendList;
        for (let index = 0; index < recommendList.length; index++) {
            const element = recommendList[index];
            let eId = element.roleInfo.id.toLocaleString()
            if (eId == pId) {
                recommendList.splice(index, 1);
                break;
            }
        }
        if (this.model.panelIndex != 2) {
            return
        }
        this.model.recommendList = recommendList
        // this._updateScroll();
        // for (let index = 0; index < this.list.datas.length; index++) {
        //     const element = this.list.datas[index];
        //     let eId = element.roleInfo.id.toLocaleString()
        //     if (eId == pId) {
        //         break;
        //     }
        // }

        // let pId = id.toLocaleString()
        // for (let index = 0; index < this.curList.length; index++) {
        //     const element = this.curList[index];
        //     let eId = element.roleInfo.id.toLocaleString()
        //     if (eId == pId) {
        //         this.list.refresh_item(index, element)
        //         break
        //     }
        // }
    }

    /**一键赠送函数 传0全部 */
    sendAllFunc() {
        if (!this._checkBtnSend()) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FRIEND_TIP16"))
            return
        }
        let msg = new icmsg.FriendGiveReq()
        msg.playerId = 0;
        NetManager.send(msg)
    }

    /**一键接受函数 传0全部*/
    getAllFunc() {
        if (!this._checkBtnGet()) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FRIEND_TIP17"))
            return
        }
        let msg = new icmsg.FriendTakeReq()
        msg.playerId = 0;
        NetManager.send(msg)
    }

    /**黑名单按钮 */
    blackBtnFunc() {
        gdk.panel.open("BlackView")
    }

    /**一键同意按钮 传0全部*/
    agreeAllFunc() {
        if (FriendUtil.getFriendDailyLimits()[1] > this.model.maxPost) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FRIEND_TIP7"))
            return;
        }
        if (this.model.applyList.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FRIEND_TIP18"))
            return
        }
        let msg = new icmsg.FriendBecomeReq()
        msg.playerId = 0;
        NetManager.send(msg)
    }

    /**一键拒绝按钮 传0全部*/
    refuseAllFunc() {
        if (this.model.applyList.length == 0) {
            return
        }
        let msg = new icmsg.FriendRefuseReq()
        msg.playerId = 0;
        NetManager.send(msg)
    }

    /**换一批按钮 */
    refreshFunc() {
        this.resetPos = true
        NetManager.send(new icmsg.FriendRecommendReq())
    }

    /**查找按钮 */
    searchFunc() {
        let str = this.searchBox.string
        if (!str) {
            return
        }
        let msg = new icmsg.FriendSearchReq()
        msg.name = str
        NetManager.send(msg)
    }

    /**清空搜索框内容 */
    cleanSearchBosStr() {
        this.searchBox.string = ''
    }

    onCheckFunc() {
        this.model.checkSelect = !this.model.checkSelect
        this._updateCheckState()
        this._updateFriendScroll()
    }

    _updateCheckState() {
        this.panels[0].active = !this.model.checkSelect && this.model.panelIndex == 0
        let on = this.check.getChildByName("on")
        let off = this.check.getChildByName("off")
        on.active = this.model.checkSelect
        off.active = !this.model.checkSelect
        this.checkPanel.active = this.model.checkSelect
        let infos = this.model.friendInfos
        this.model.selectIds = []
        infos.forEach(element => {
            element.isCheckSelect = false
        });
        this.model.friendInfos = infos
    }

    onSelectAllFunc() {
        let infos = this.model.friendInfos
        this.model.selectIds = []
        infos.forEach(element => {
            element.isCheckSelect = true
            this.model.selectIds.push(element.roleInfo.id)
        });
        this.model.friendInfos = infos
    }


    onDeleteFunc() {
        if (this.model.selectIds.length == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FRIEND_TIP22"))
            return
        }
        let info: AskInfoType = {
            sureCb: () => {
                let msg = new icmsg.FriendDeleteReq()
                msg.playerIds = this.model.selectIds
                NetManager.send(msg)
            },
            descText: StringUtils.format(gdk.i18n.t("i18n:FRIEND_TIP21"), this.model.selectIds.length),
            thisArg: this,
        }
        GlobalUtil.openAskPanel(info)
    }
}

