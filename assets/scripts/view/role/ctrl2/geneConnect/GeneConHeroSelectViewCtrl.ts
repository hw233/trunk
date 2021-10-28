import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import ResonatingModel from '../../../resonating/model/ResonatingModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-16 13:39:25 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-20 17:15:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/GeneConHeroSelectViewCtrl")
export default class GeneConHeroSelectViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  list: ListView;
  curSelect: number;
  onEnable() {
    this.curSelect = this.args[0] || 0;
    this._updateListLater();
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  onConfirmBtnClick() {
    if (this.list['select'] && this.list['select'] !== this.curSelect) {
      gdk.e.emit(RoleEventId.GENE_CONNECT_HERO_SELECT, this.list['select']);
    }
    this.close();
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        column: 4,
        cb_host: this,
        async: true,
        gap_x: 30,
        gap_y: 30,
        direction: ListViewDir.Vertical,
      });
      this.list.onClick.on(this._selectItem, this);
    }
    this.list['select'] = 0;
  }

  _updateListLater() {
    gdk.Timer.callLater(this, this._updateList);
  }

  _updateList() {
    this._initList();
    let data: icmsg.HeroInfo[] = [];
    let heros = ModelManager.get(HeroModel).heroInfos;
    let resonatingModel = ModelManager.get(ResonatingModel);
    heros.forEach(h => {
      let info = <icmsg.HeroInfo>h.extInfo;
      if (info.level > 1 && info.star >= 4 && !info.mysticLink && !resonatingModel.getHeroInUpList(info.heroId)) {
        if (info.heroId == this.curSelect) this.list['select'] = info.heroId;
        data.push(info);
      }
    });
    data.sort((a, b) => { return b.power - a.power; });
    this.list.clear_items();
    this.list.set_data(data);
  }

  _selectItem(data: icmsg.HeroInfo, idx: number) {
    if (data.heroId == this.list['select']) {
      this.list['select'] = 0;
    } else {
      this.list['select'] = data.heroId;
    }
    this.list.refresh_items();
  }
}
