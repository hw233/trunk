import NetManager from '../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-07 16:41:34 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenahonor/ArenaHonorGuessReportViewCtrl")
export default class ArenaHonorGuessReportViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  list: ListView;
  onEnable() {
    let req = new icmsg.ArenaHonorGuessHistoryReq();
    req.world = false;
    NetManager.send(req, (resp: icmsg.ArenaHonorGuessHistoryRsp) => {
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

  _updateList(datas: icmsg.ArenaHonorMatch[]) {
    this._initList();
    datas.sort((a, b) => { return b.guessTime - a.guessTime; })
    this.list.clear_items();
    this.list.set_data(datas);
  }
}
