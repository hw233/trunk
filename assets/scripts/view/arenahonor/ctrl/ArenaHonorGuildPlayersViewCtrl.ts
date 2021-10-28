import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-07 16:42:37 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenahonor/ArenaHonorGuildPlayersViewCtrl")
export default class ArenaHonorGuildPlayersViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  info: icmsg.ArenaHonorGuild;
  list: ListView;
  onEnable() {
    this.info = this.args[0];
    this._updateList();
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  _initListView() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        cb_host: this,
        column: 2,
        gap_x: 15,
        gap_y: 10,
        async: true,
        direction: ListViewDir.Vertical,
      })
    }
  }

  _updateList() {
    this._initListView();
    this.list.clear_items();
    this.list.set_data([...this.info.players]);
  }
}
