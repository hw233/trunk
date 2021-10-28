import NetManager from "../../../common/managers/NetManager";
import { ListView, ListViewDir } from "../../../common/widgets/UiListview";

/** 
 * @Description: 皇家竞技场挑战记录View
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 17:36:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaReportViewCtrl")
export default class RoyalArenaReportViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        // ModelManager.get(ChampionModel).isDefLose = false;
        // gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        let req = new icmsg.RoyalFightRecordReq();
        NetManager.send(req, (resp: icmsg.RoyalFightRecordRsp) => {
            this._updateList(resp.list);
        }, this);
    }
    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        NetManager.targetOff(this);
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList(datas: icmsg.RoyalFightRecord[]) {
        this._initList();
        datas.sort((a, b) => { return b.time - a.time; })
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
