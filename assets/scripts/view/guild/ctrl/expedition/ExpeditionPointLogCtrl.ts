import NetManager from '../../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-18 17:49:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionPointLogCtrl")
export default class ExpeditionPointLogCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    logItem: cc.Prefab = null

    list: ListView = null;

    _curIndex = 0
    _pageCount = 20
    _maxPage = 0

    _showLogs = []

    onEnable() {
        NetManager.on(icmsg.ExpeditionLogListRsp.MsgType, this._onExpeditionLogListRsp, this)
        this._initListView()
        this._reqLog()
    }

    _reqLog() {
        let msg = new icmsg.ExpeditionLogListReq()
        msg.index = this._curIndex
        msg.count = this._pageCount
        NetManager.send(msg)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.logItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
            scroll_to_end_cb: this._endCallFunc,
        })
    }

    _onExpeditionLogListRsp(data: icmsg.ExpeditionLogListRsp) {
        this._maxPage = Math.ceil(data.total / this._pageCount)
        this._curIndex = data.index
        this._showLogs = this._showLogs.concat(data.list)
        this.list.set_data(this._showLogs, false)
    }

    _endCallFunc() {
        if (this._curIndex + 1 < this._maxPage) {
            this._curIndex++
            this._reqLog()
        }
    }

}