import GuildModel from '../model/GuildModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { GuildEventId } from '../enum/GuildEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:07:01
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildApplyList")
export default class GuildApplyList extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    guildApplyListItem: cc.Prefab = null

    list: ListView = null;

    get model() { return ModelManager.get(GuildModel); }

    onLoad() {

    }

    start() {

    }

    onEnable() {
        let msg = new icmsg.GuildRequestsReq()
        NetManager.send(msg)
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    onDestroy() {

    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.guildApplyListItem,
            cb_host: this,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    @gdk.binding("model.applyList")
    updateApplyList() {
        this._initListView()
        this.list.set_data(this.model.applyList)
    }

    agreeAllFunc() {
        if (this.model.applyList.length > 0) {
            gdk.e.emit(GuildEventId.REQ_GUILD_CHECK, { playerId: 0, ok: true })
        }
    }

    refuseAllFunc() {
        if (this.model.applyList.length > 0) {
            gdk.e.emit(GuildEventId.REQ_GUILD_CHECK, { playerId: 0, ok: false })
        }
    }
}