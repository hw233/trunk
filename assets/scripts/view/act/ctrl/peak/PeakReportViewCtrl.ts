import NetManager from '../../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
 * @Description: 巅峰之战挑战记录View
 * @Author: yaozu.hu
 * @Date: 2021-02-22 11:30:49
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-05 16:47:16
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakReortViewCtrl")
export default class PeakReortViewCtrl extends gdk.BasePanel {

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
        let req = new icmsg.PeakRecordReq();
        NetManager.send(req, (resp: icmsg.PeakRecordRsp) => {
            this._updateList(resp.records);
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

    _updateList(datas: icmsg.PeakRecord[]) {
        this._initList();
        datas.sort((a, b) => { return b.time - a.time; })
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
