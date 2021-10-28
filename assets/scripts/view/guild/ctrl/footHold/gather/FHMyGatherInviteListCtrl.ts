import FootHoldModel from '../FootHoldModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-17 17:42:00
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/gather/FHMyGatherInviteListCtrl")
export default class FHMyGatherInviteListCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    inviteItem: cc.Prefab = null

    list: ListView = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        NetManager.on(icmsg.FootholdGatherInvitersRsp.MsgType, this._onFootholdGatherInvitersRsp, this)

        let msg = new icmsg.FootholdGatherInvitersReq()
        msg.type = 2
        NetManager.send(msg)
    }

    onDisable() {
        this.footHoldModel.myGatherInviteNum = 0
        this.footHoldModel.myGatherPlayerIds = []
        NetManager.targetOff(this)
    }

    _onFootholdGatherInvitersRsp(data: icmsg.FootholdGatherInvitersRsp) {
        this._initListView()
        if (data.num >= 0) {
            this.list.set_data(data.list, false)
        } else {
            let infos: icmsg.FootholdGatherInviter[] = this.list.datas
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
        let msg = new icmsg.FootholdGatherRefuseReq()
        msg.pos = new icmsg.FootholdPos()
        msg.all = true
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP99"))
            gdk.panel.hide(PanelId.FHMyGatherInviteList)
        })
    }

}