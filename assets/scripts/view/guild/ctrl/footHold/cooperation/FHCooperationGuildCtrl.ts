import FootHoldModel from '../FootHoldModel';
import FootHoldUtils from '../FootHoldUtils';
import GuildUtils from '../../../utils/GuildUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import { GuildAccess } from '../../../model/GuildModel';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Description:  协战公会信息
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-18 16:40:49
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationGuildCtrl")
export default class FHCooperationGuildCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    guildItem: cc.Prefab = null

    @property(cc.Node)
    operateNode: cc.Node = null

    list: ListView = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        let msg = new icmsg.FootholdCoopGuildListReq()
        NetManager.send(msg, (data: icmsg.FootholdCoopGuildListRsp) => {
            this.updatViewInfo(data.guildList)
        })

        this.operateNode.active = false
        //查看当前设置的权限
        let msg2 = new icmsg.FootholdCoopApplySettingReq()
        msg2.title = -1
        NetManager.send(msg2, (data: icmsg.FootholdCoopApplySettingRsp) => {
            if (GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.Cooperation) && this.roleModel.guildTitle >= data.title) {
                this.operateNode.active = true
            }
        }, this)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.guildItem,
            cb_host: this,
            async: true,
            gap_y: 4,
            direction: ListViewDir.Vertical,
        })
    }

    updatViewInfo(list: icmsg.FootholdCoopGuild[]) {
        this._initListView()
        this.list.set_data(list)
    }


    onHireFunc() {
        if (!FootHoldUtils.isInCoopertionInviteTime()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP131"))
            return
        }
        gdk.panel.open(PanelId.FHCooperationHire)
    }


    onApplyCheckFunc() {
        if (this.footHoldModel.cooperGuildList.length < 4) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP132"))
            return
        }
        gdk.panel.open(PanelId.FHCooperationApply)
    }


    onSetFunc() {
        gdk.panel.open(PanelId.FHCooperationCheck)
    }
}