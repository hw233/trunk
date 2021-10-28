import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RuneMixMaterialsItemCtrl from './RuneMixMaterialsItemCtrl';
import RuneModel from '../../../../common/models/RuneModel';
import RuneUtils from '../../../../common/utils/RuneUtils';
import { BagItem } from '../../../../common/models/BagModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RuneCfg } from '../../../../a/config';
import { RuneEventId } from '../../enum/RuneEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-02 10:32:26 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneMixMaterialsSelectViewCtrl")
export default class RuneMixMaterialsSelectViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  num: cc.Label = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.Node)
  tips: cc.Node = null;

  @property(cc.Node)
  titleNode: cc.Node = null;

  info: RuneMixMaterialType;
  selectMap: { [costType: number]: string } = {};
  list: ListView;
  needNum: number = 1;
  onEnable() {
    let args = this.args[0];
    [this.info, this.selectMap] = [args[0], args[1]];
    GlobalUtil.setSpriteIcon(this.node, this.titleNode, this.info.costTpye == 0 ? 'view/role/texture/rune/gh_xuanzhezhufuwen' : 'view/role/texture/rune/yx_xuanzhecailiaofuwen');
    GlobalUtil.setSpriteIcon(this.node, this.tips, this.info.costTpye == 0 ? 'view/role/texture/rune/yx_fuwentxt03' : 'view/role/texture/rune/yx_fuwentxt02');
    this.node.getChildByName('botTips').getComponent(cc.Label).string = this.info.costTpye == 0 ? gdk.i18n.t('i18n:RUNE_TIP30') : gdk.i18n.t('i18n:RUNE_TIP31');
    this._updateList();
    this._updateNum();
  }

  onDisable() {
    this.info = null;
    this.selectMap = {};
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  onSelectAllBtnClick() {
    let curId: string = this.selectMap[this.info.costTpye] || '';
    if (curId && curId.length > 0) {
      return;
    }
    if (this.list.datas.length - 1 < this.needNum) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:RUNE_TIP7"));
      return;
    }
    let autoList: {
      data: any,
      idx: number
    }[] = [];
    let isFull: boolean = false;
    for (let i = 0; i < this.list.datas.length; i++) {
      let data = this.list.datas[i];
      // && data.runeId.toString().length < 12
      if (data.runeId) {
        if (curId !== data.runeId) {
          autoList.push({
            data: data,
            idx: i
          });
          if (autoList.length == this.needNum) {
            isFull = true;
            break;
          }
        }
      }
    }
    if (!isFull) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:RUNE_TIP7"));
    }
    else {
      autoList.forEach(d => {
        this._selectItem(d.data, d.idx);
      });
    }
  }

  onConfirmBtnClick() {
    gdk.e.emit(RuneEventId.RUNE_MIX_MATERIALS_SELECT, [JSON.parse(JSON.stringify(this.selectMap))]);
    this.close();
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        cb_host: this,
        column: 4,
        gap_x: 8,
        gap_y: 10,
        async: true,
        direction: ListViewDir.Vertical,
      })
      this.list.onClick.on(this._selectItem, this);
    }
  }

  _updateList() {
    this._initList();
    let curId = this.selectMap[this.info.costTpye] || null;
    let otherId = this.selectMap[1 - this.info.costTpye] || null;
    let otherType = null;
    if (otherId) {
      let cfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(otherId.split('_')[0].slice(0, 6)));
      otherType = cfg.type;
    }
    let items: BagItem[] = RuneUtils.getRuneByColorAndLv(4, this.info.costTpye == 0 ? 140 : 0);
    items.sort((a, b) => {
      let cfgA = ConfigManager.getItemById(RuneCfg, parseInt(a.itemId.toString().slice(0, 6)));
      let cfgB = ConfigManager.getItemById(RuneCfg, parseInt(b.itemId.toString().slice(0, 6)));
      if (cfgA.level == cfgB.level) {
        return cfgA.rune_id - cfgB.rune_id;
      }
      else {
        return cfgA.level - cfgB.level;
      }
    });
    let itemIds: string[] = [];
    items.forEach(item => {
      if (item) {
        let cfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(item.itemId.toString().slice(0, 6)));
        if (!otherType || otherType !== cfg.type) {
          let num = item.itemNum;
          let id = item.itemId;
          for (let i = 0; i < num; i++) {
            let customId = `${id}_${i}`; // id+idx 同一道具保证id的唯一性 '_'分割 固定前6位为id
            if (itemIds.indexOf(customId) == -1) {
              itemIds.push(customId);
            }
          }
        }
      }
    });

    let list = [];
    itemIds.forEach(id => {
      if (otherId !== id) {
        let d = {
          runeId: id,
          selected: curId === id,
          materialType: this.info
        };
        list.push(d);
      }
    });

    //英雄身上的符文(只考虑主符文的选择)
    let itemInHeros: string[] = [];
    if (this.info.costTpye == 0) {
      ModelManager.get(RuneModel).runeInHeros.forEach(item => {
        // if (this.info.costTpye == 0) {
        let cfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(item.itemId.toString().slice(0, 6)));
        if (cfg.color == 4 && cfg.level == 140) {
          if (!otherType || otherType !== cfg.type) {
            //唯一id id+heroTypeId+heroId  6+6+n
            let heroId = (<icmsg.RuneInfo>item.extInfo).heroId;
            let customId = `${item.itemId}_${HeroUtils.getHeroInfoByHeroId(heroId).typeId}${heroId}`;
            itemInHeros.push(customId);
          }
        }
      });
    }

    let list2 = [];
    itemInHeros.forEach(id => {
      if (otherId !== id) {
        let d = {
          runeId: id,
          selected: curId == id,
          materialType: this.info
        };
        list2.push(d);
      }
    });
    //获取更多英雄按钮  占格子
    let first = {
      runeId: null,
      selected: false,
      materialType: this.info,
    }
    let data = [first, ...list, ...list2];
    this.list.clear_items();
    this.list.set_data(data);
    this.tips.active = data.length == 1;
  }

  _selectItem(data, i) {
    if (data.runeId && data.runeId.length > 0) {
      let curId = this.selectMap[this.info.costTpye] || [];
      let item = this.list.items[i].node;
      let id = data.runeId;
      if (curId !== id && curId.length > 0) {
        gdk.gui.showMessage(gdk.i18n.t("i18n:RUNE_TIP8"));
        return;
      }
      if (item) {
        let ctrl = item.getComponent(RuneMixMaterialsItemCtrl);
        ctrl.check();
      }
      else {
        data.selected = !data.selected;
      }
      if (curId == id) {
        this.selectMap[this.info.costTpye] = null;
      }
      else {
        this.selectMap[this.info.costTpye] = id;
      }
      this._updateNum();
    }
  }

  _updateNum() {
    let s = this.selectMap[this.info.costTpye];
    this.num.string = `${s && s.length > 0 ? '1' : '0'}/${this.needNum}`;
  }
}

export type RuneMixMaterialType = {
  mixRuneId: number,
  costTpye: number // 0-main 1-material
}