import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { HeroCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-03 11:25:48 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/awakeStarUp/AwakeStarUpSelectViewCtrl")
export default class AwakeStarUpSelectViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
  get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

  list: ListView;
  curSelect: number;
  onEnable() {
    // this.curSelect = ModelManager.get(ActivityModel).awakeHeroId;
    this._updateList();
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    NetManager.targetOff(this);
  }

  onConfirmBtnClick() {
    if (this.curSelect > 0 && (this.actModel.awakeHeroId !== this.curSelect)) {
      let req = new icmsg.ActivityAwakeGiftSetReq();
      req.heroId = this.curSelect;
      // req.totalStar = this.star;
      NetManager.send(req, null, this);
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
  }

  _updateList() {
    this._initList();
    let heros = this.heroModel.heroInfos;
    let temp: icmsg.HeroInfo[] = [];
    heros.forEach(h => {
      let info = <icmsg.HeroInfo>h.extInfo;
      let cfg = <HeroCfg>BagUtils.getConfigById(info.typeId);
      if (cfg.star_max >= 10 && cfg.group[0] !== 6) {
        temp.push(info);
      }
    });
    temp.sort((a, b) => { return b.power - a.power; });
    let first;
    let others = [];
    let data = [];
    temp.forEach(t => {
      let obj = {
        heroInfo: t,
        select: false,
      }
      if (this.actModel.awakeHeroId == t.heroId) first = obj;
      else {
        others.push(obj);
      }
    })
    if (first) {
      data.push(first);
    }
    data = data.concat(others);
    this.list.clear_items();
    this.list.set_data(data);
    gdk.Timer.callLater(this, () => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this.scrollView.node.height = Math.max(240, Math.min(419, Math.floor(data.length / 4) * 130 + 10));
      if (first) {
        this.list.select_item(0);
      }
    })
  }

  _selectItem(data, idx, preData, preIdx) {
    if (data) {
      if (this.curSelect) {
        if (this.curSelect == data.heroInfo.heroId) {
          data.select = false;
          this.curSelect = 0;
          this.list.refresh_item(idx, data);
          return
        }
        else {
          if (preData) {
            preData.select = false;
            this.list.refresh_item(preIdx, preData);
          }
        }
      }
      data.select = true;
      this.curSelect = data.heroInfo.heroId;
      this.list.refresh_item(idx, data);
    }
  }
}
