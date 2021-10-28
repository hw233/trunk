import FootHoldModel from '../FootHoldModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../../../common/utils/RedPointUtils';
/*
 * @Description:  协战 申请审批列表
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-13 17:45:53
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationApplyCtrl")
export default class FHCooperationApplyCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    applyItem: cc.Prefab = null

    @property(cc.Node)
    noTip: cc.Node = null

    list: ListView = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        NetManager.on(icmsg.FootholdCoopApplyPlayersRsp.MsgType, this._onFootholdCoopApplyPlayersRsp, this)
        let msg = new icmsg.FootholdCoopApplyPlayersReq()
        NetManager.send(msg)
    }

    onDisable() {

    }

    _onFootholdCoopApplyPlayersRsp(data: icmsg.FootholdCoopApplyPlayersRsp) {
        this._updateViewInfo(data.players)

        if (data.players.length == 0) {
            this.footHoldModel.coopApplyNum = 0
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
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
            item_tpl: this.applyItem,
            cb_host: this,
            async: true,
            gap_y: 4,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewInfo(list: icmsg.FootholdCoopPlayer[]) {
        this._initListView()
        this.list.set_data(list, false)

        if (list.length == 0) {
            this.noTip.active = true
        }
    }

    oneKeyRefuseFunc() {
        let msg = new icmsg.FootholdCoopApplyAnswerReq()
        msg.playerId = 0
        msg.agree = false
        NetManager.send(msg, () => {
            this.footHoldModel.coopApplyNum = 0
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
            gdk.panel.hide(PanelId.FHCooperationApply)
        }, this)
    }
}