import ChampionModel from '../model/ChampionModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-23 11:59:14 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionReportViewCtrl")
export default class ChampionReportViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        ModelManager.get(ChampionModel).isDefLose = false;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        let req = new icmsg.ChampionRecordsReq();
        NetManager.send(req, (resp: icmsg.ChampionRecordsRsp) => {
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

    _updateList(datas: icmsg.ChampionRecord[]) {
        this._initList();
        datas.sort((a, b) => { return b.time - a.time; })
        this.list.clear_items();
        this.list.set_data(datas);
    }
}
