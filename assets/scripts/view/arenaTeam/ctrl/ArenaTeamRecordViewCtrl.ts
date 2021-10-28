import NetManager from '../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';


/** 
 * @Description: 组队竞技场对战记录View
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-03 11:25:25
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaTeam/ArenaTeamRecordViewCtrl")
export default class ArenaTeamRecordViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;
    list: ListView = null;

    infos: icmsg.ArenaTeamFightRecord[] = []
    onEnable() {
        let msg = new icmsg.ArenaTeamFightRecordsReq();
        NetManager.send(msg, (rsp: icmsg.ArenaTeamFightRecordsRsp) => {
            this.infos = rsp.records;
            this._updateScroll(true)
        }, this)
    }

    _updateScroll(resetPos: boolean = false) {

        this._initListView();
        this.list.set_data(this.infos, resetPos);
    }
    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPre,
            cb_host: this,
            gap_y: 10,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
        NetManager.targetOff(this);
    }

}
