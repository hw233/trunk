import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-07 16:41:07 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenahonor/ArenaHonorAllParticipantItemCtrl")
export default class ArenaHonorAllParticipantItemCtrl extends UiListItem {
  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  info: icmsg.ArenaHonorGuild;
  childList: ListView;
  onDisable() {
    if (this.childList) {
      this.childList.destroy();
      this.childList = null;
    }
  }

  updateView() {
    this.info = this.data;
    this.nameLab.string = `【s${GlobalUtil.getSeverIdByGuildId(this.info.id)} ${this.info.name}】`;
    this._updateList();
  }

  _initListView() {
    if (!this.childList) {
      this.childList = new ListView({
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
    this.childList.clear_items();
    this.childList.set_data([...this.info.players]);
  }
}
