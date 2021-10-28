import FootHoldModel from '../FootHoldModel';
import GuildModel from '../../../model/GuildModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import { info } from 'console';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-25 11:02:37
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/guard/FHMyGuardInviteListCtrl")
export default class FHMyGuardInviteListCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    inviteItem: cc.Prefab = null

    list: ListView = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        NetManager.on(icmsg.FootholdGuardInvitersRsp.MsgType, this._onFootholdGuardInvitersRsp, this)

        let msg = new icmsg.FootholdGuardInvitersReq()
        msg.type = 2
        NetManager.send(msg)
    }

    onDisable() {
        this.footHoldModel.myGuardInviteNum = 0
        this.footHoldModel.myGuardPlayerIds = []
        NetManager.targetOff(this)
    }

    _onFootholdGuardInvitersRsp(data: icmsg.FootholdGuardInvitersRsp) {
        this._initListView()
        if (data.num >= 0) {
            this.list.set_data(data.list, false)
        } else {
            let infos: icmsg.FootholdGuardInviter[] = this.list.datas
            let isNew = true
            for (let i = 0; i < infos.length; i++) {
                if (infos[i].brief.id == data.list[0].brief.id) {
                    isNew = false
                    break
                }
            }
            if (isNew) {
                infos.unshift(data.list[0])
                this.list.set_data(infos, false)
            }
        }
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


    onOneKeyRefuseFunc() {
        let msg = new icmsg.FootholdGuardRefuseReq()
        msg.pos = new icmsg.FootholdPos()
        msg.all = true
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP99"))
            gdk.panel.hide(PanelId.FHMyGuardInviteList)
        })
    }

}