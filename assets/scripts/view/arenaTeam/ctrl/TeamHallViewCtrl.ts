import ArenaTeamViewModel from '../model/ArenaTeamViewModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { ArenaTeamEvent } from '../enum/ArenaTeamEvent';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';




/** 
 * @Description: 组队竞技场 组队大厅
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-06 14:34:34
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
//@menu("qszc/scene/pve/PveSceneCtrl")
export default class TeamHallViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    teamNode: cc.Node = null;
    @property(cc.Node)
    inviteNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView1: cc.ScrollView = null;

    @property(cc.Node)
    content1: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab1: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView2: cc.ScrollView = null;

    @property(cc.Node)
    content2: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab2: cc.Prefab = null;

    @property(cc.EditBox)
    searchBox: cc.EditBox = null

    @property(cc.Label)
    inviterLb: cc.Label = null;
    @property(UiTabMenuCtrl)
    menuCtrl: UiTabMenuCtrl = null;
    @property(cc.Node)
    redNode: cc.Node = null;
    @property(cc.Node)
    inviterTipNode: cc.Node = null;

    list1: ListView;

    list2: ListView;

    teamData: icmsg.ArenaTeamPlayer[] = [];
    inviterData: icmsg.ArenaTeamPlayer[] = [];
    teamPlayerIds: number[] = [];

    isTeamers: boolean = false;
    get model(): ArenaTeamViewModel { return ModelManager.get(ArenaTeamViewModel); }
    onEnable() {

        let arg = gdk.panel.getArgs(PanelId.ArenaTeamTeamHallView)
        if (arg) {
            this.isTeamers = arg[0];
        }

        NetManager.send(new icmsg.ArenaTeamPlayersReq(), (rsp: icmsg.ArenaTeamPlayersRsp) => {
            this.teamData = rsp.players;
            this.teamPlayerIds = rsp.playerIds;
            //刷新排名信息
            this._updateView1()
        }, this);

        this.sendInvitersReq();
        this.menuCtrl.selectIdx = 0;

        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_INVITER, this.refreshTeamDataRsp, this)
        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_INVITER_AGREE, this.close, this)
        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_INVITER_REJECT, this.refreshInviterDataRsp, this);
        gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_REDPOINT, this.teamChangeRedPoint, this)

        this.redNode.active = this.model.inviterRed;

    }

    sendInvitersReq() {
        NetManager.send(new icmsg.ArenaTeamInvitersReq(), (rsp: icmsg.ArenaTeamInvitersRsp) => {
            this.inviterData = rsp.inviters;
            //刷新排名信息
            this._updateView2()
        }, this);
    }

    onDisable() {
        if (this.list1) {
            this.list1.destroy();
            this.list1 = null;
        }
        if (this.list2) {
            this.list2.destroy();
            this.list2 = null;
        }
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    _updateView1(resetPos: boolean = true) {
        this._initListView1();
        this.list1.clear_items();
        let temData = [];
        this.teamData.forEach(data => {
            let tem = { data: data, isTeamers: this.isTeamers }
            temData.push(tem);
        })
        this.list1.set_data(temData, resetPos);
    }

    _updateView2(resetPos: boolean = true) {
        this._initListView2();
        this.list2.clear_items();
        this.inviterLb.string = this.inviterData.length + '/20';
        this.inviterTipNode.active = this.inviterData.length == 0;
        this.list2.set_data(this.inviterData, resetPos);
    }


    _initListView1() {
        if (!this.list1) {
            this.list1 = new ListView({
                scrollview: this.scrollView1,
                mask: this.scrollView1.node,
                content: this.content1,
                item_tpl: this.itemPrefab1,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _initListView2() {
        if (!this.list2) {
            this.list2 = new ListView({
                scrollview: this.scrollView2,
                mask: this.scrollView2.node,
                content: this.content2,
                item_tpl: this.itemPrefab2,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    infoPageSelect(event, index, refresh: boolean = false) {
        if (index == 0) {
            this.teamNode.active = true;
            this.inviteNode.active = false;
        } else {
            if (this.model.inviterRed) {
                this.model.inviterRed = false;
                this.redNode.active = false;
                this.refreshInvitersData();
            }

            this.teamNode.active = false;
            this.inviteNode.active = true;
        }
    }


    //邀请玩家后刷新列表
    refreshTeamDataRsp(e: gdk.Event) {
        //
        let index = this.teamData.indexOf(e.data);
        if (index >= 0) {
            this.teamData.splice(index, 1);
            //刷新排名信息
            this._updateView1()
        }
    }

    //拒绝玩家邀请后刷新列表
    refreshInviterDataRsp(e: gdk.Event) {
        //
        let index = this.inviterData.indexOf(e.data);
        if (index >= 0) {
            this.inviterData.splice(index, 1);
            //刷新排名信息
            this._updateView2()
        }
    }
    //接收到被邀请消息
    teamChangeRedPoint(e: gdk.Event) {
        if (e.data.type == 1) {
            if (this.menuCtrl.selectIdx == 0) {
                this.redNode.active = true;
            } else {
                this.model.inviterRed = false;
                this.redNode.active = false;
                this.refreshInvitersData();
            }
        }
    }

    //刷新组队大厅列表
    refreshTeamData() {
        let playerIds = []
        if (this.teamPlayerIds.length > 10) {
            playerIds = this.teamPlayerIds.splice(0, 10);
        } else {
            playerIds = this.teamPlayerIds;
        }
        let resetData = false;
        if (playerIds.length == 0) {
            resetData = true;
        }
        let msg = new icmsg.ArenaTeamPlayersReq()
        msg.playerIds = playerIds
        NetManager.send(msg, (rsp: icmsg.ArenaTeamPlayersRsp) => {
            this.teamData = rsp.players;
            if (resetData) {
                this.teamPlayerIds = rsp.playerIds;
            }
            //刷新排名信息
            this._updateView1()
        }, this);

    }

    //刷新组队邀请列表
    refreshInvitersData() {
        this.sendInvitersReq();
        this.searchBox.string = ''
    }

    //拒绝全部邀请
    rejectAllInviter() {
        let msg = new icmsg.ArenaTeamRejectReq()
        msg.inviterId = 0;
        NetManager.send(msg, (rsp: icmsg.ArenaTeamRejectRsp) => {
            this.inviterData = [];
            //刷新排名信息
            this._updateView2()
        }, this);
    }

    /**查找按钮 */
    searchFunc() {
        let str = this.searchBox.string
        if (!str) {
            return
        }

        // let msg = new icmsg.FriendSearchReq()
        // msg.name = str
        // NetManager.send(msg)
        let msg = new icmsg.ArenaTeamPlayersReq()
        msg.playerName = str
        NetManager.send(msg, (rsp: icmsg.ArenaTeamPlayersRsp) => {
            this.searchBox.string = ''
            this.teamData = rsp.players;
            this.teamPlayerIds = rsp.playerIds;
            //刷新排名信息
            this._updateView1()
        }, this);
    }

    /**清空搜索框内容 */
    cleanSearchBosStr() {
        this.searchBox.string = ''
    }

}
