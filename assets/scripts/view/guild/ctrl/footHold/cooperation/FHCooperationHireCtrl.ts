import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldUtils from '../FootHoldUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import RoleModel from '../../../../../common/models/RoleModel';
import ServerModel from '../../../../../common/models/ServerModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import { Foothold_globalCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Description: 协战 招募
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-17 16:23:40
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationHireCtrl")
export default class FHCooperationHireCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    hireItem: cc.Prefab = null

    @property(cc.RichText)
    tipLab: cc.RichText = null

    @property(cc.Label)
    btnLab: cc.Label = null

    @property(cc.Node)
    noTip: cc.Node = null

    list: ListView = null

    _curIndex = 0
    pageCount = 20
    _totalNum = 0
    _datas: icmsg.FootholdCoopPlayer[] = []
    _lastPubTime = 0

    onEnable() {
        NetManager.on(icmsg.FootholdCoopPlayerListRsp.MsgType, this._onFootholdCoopPlayerListRsp, this)

        let msg = new icmsg.FootholdCoopPlayerListReq()
        msg.index = this._curIndex
        msg.count = this.pageCount
        NetManager.send(msg)

        let guildInfo = FootHoldUtils.findCooperGuildInfo(ModelManager.get(RoleModel).guildId)
        if (guildInfo) {
            this.tipLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP143"), `${guildInfo.coopNum}/${guildInfo.coopMax}`)//`本公会协战人员上限<color=#F6E707>(${guildInfo.coopNum}/${guildInfo.coopMax})</c>`
        } else {
            this.tipLab.string = ``
        }
    }

    onDisable() {

    }

    _onFootholdCoopPlayerListRsp(data: icmsg.FootholdCoopPlayerListRsp) {
        this._totalNum = data.total
        this._lastPubTime = data.pubTime
        this._initListView()
        this._datas = this._datas.concat(data.list)
        this.list.set_data(this._datas, false)

        if (this._datas.length == 0) {
            this.noTip.active = true
        }

        this._createEndTime()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.hireItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
            scroll_to_end_cb: this._endCallFunc,
        })
    }

    /**列表拖到最底分页 */
    _endCallFunc() {
        let needReq = false
        if (this._totalNum > (this._curIndex + 1) * this.pageCount) {
            needReq = true
        }
        if (needReq) {
            let msg = new icmsg.FootholdCoopPlayerListReq()
            msg.index = this._curIndex + 1
            msg.count = this.pageCount
            NetManager.send(msg)
        }
    }

    /**发布招募 */
    onHireFunc() {
        let msg = new icmsg.FootholdCoopGuildPublishReq()
        NetManager.send(msg)
        gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP142"))
        this._lastPubTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        this._createEndTime()
    }

    _createEndTime() {
        this._updateEndTime()
        this._clearEndTime()
        this.schedule(this._updateEndTime, 1)
    }

    _updateEndTime() {
        this.btnLab.node.parent.getComponent(cc.Button).enabled = true
        GlobalUtil.setGrayState(this.btnLab.node.parent, 0)
        let cooperation_limit_time = ConfigManager.getItemById(Foothold_globalCfg, "cooperation_limit_time").value[0]
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        if (this._lastPubTime == 0) {
            this._clearEndTime()
            this.btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP144")//`发布招募`
            return
        }
        let leftTime = this._lastPubTime + cooperation_limit_time - curTime
        if (leftTime > 0) {
            this.btnLab.node.parent.getComponent(cc.Button).enabled = false
            GlobalUtil.setGrayState(this.btnLab.node.parent, 1)
            this.btnLab.string = `${gdk.i18n.t("i18n:FOOTHOLD_TIP144")}(${leftTime}s)`
        } else {
            this._clearEndTime()
            this.btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP144")
        }
    }

    _clearEndTime() {
        this.unschedule(this._updateEndTime)
    }
}