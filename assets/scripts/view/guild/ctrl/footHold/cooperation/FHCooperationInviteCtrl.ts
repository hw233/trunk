import FootHoldModel from '../FootHoldModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Description: 协战 玩家收到的邀请信息
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-07 17:37:21
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationInviteCtrl")
export default class FHCooperationInviteCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    inviteItem: cc.Prefab = null

    list: ListView = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        NetManager.on(icmsg.FootholdCoopInviteGuildsRsp.MsgType, this._onFootholdCoopInviteGuildsRsp, this)
        let msg = new icmsg.FootholdCoopInviteGuildsReq()
        NetManager.send(msg)
    }

    onDisable() {
        this.footHoldModel.cooperationInviteNum = 0
        NetManager.targetOff(this)
    }

    _onFootholdCoopInviteGuildsRsp(data: icmsg.FootholdCoopInviteGuildsRsp) {
        this._updateViewInfo(data.guilds)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.inviteItem,
            cb_host: this,
            async: true,
            gap_y: 4,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewInfo(list: icmsg.FootholdCoopGuild[]) {
        this._initListView()
        this.list.set_data(list, false)
    }

    oneKeyRefuseFunc() {
        let msg = new icmsg.FootholdCoopInviteAnswerReq()
        msg.guildId = 0
        msg.agree = false
        NetManager.send(msg, () => {
            gdk.panel.hide(PanelId.FHCooperationInvite)
        }, this)
    }
}