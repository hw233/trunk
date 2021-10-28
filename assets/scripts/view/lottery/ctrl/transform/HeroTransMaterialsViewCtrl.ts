import { HeroCfg, Hero_displaceCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import HeroModel from '../../../../common/models/HeroModel';
import BagUtils from '../../../../common/utils/BagUtils';
import HeroUtils from '../../../../common/utils/HeroUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import PanelId from '../../../../configs/ids/PanelId';
import HeroLockTipsCtrl from '../../../role/ctrl2/main/common/HeroLockTipsCtrl';
import { LotteryEventId } from '../../enum/LotteryEventId';
import HeroTransMaterialsItemCtrl from './HeroTransMaterialsItemCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-22 11:16:28 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/transform/HeroTransMaterialsViewCtrl')
export default class HeroTransMaterialsViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  selectNum: cc.Label = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  list: ListView = null
  curHeroInfo: icmsg.HeroInfo;
  materialIds: number[] = [];
  onEnable() {
    [this.curHeroInfo, this.materialIds] = this.args[0];
    this._updateScroll();
    this._updateNum();
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  onSelectBtnClick() {
    gdk.e.emit(LotteryEventId.HERO_TRANS_MATERIAL_SELECT, [...this.materialIds]);
    this.close();
  }

  _initListView() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        cb_host: this,
        column: 4,
        gap_x: 40,
        gap_y: 25,
        async: true,
        direction: ListViewDir.Vertical,
      })
      this.list.onClick.on(this._selectItem, this);
    }
  }

  _updateScroll() {
    this._initListView();
    let datas = [];
    let g = (<HeroCfg>BagUtils.getConfigById(this.curHeroInfo.typeId)).group[0];
    let limitCfg = ConfigManager.getItem(Hero_displaceCfg, (cfg: Hero_displaceCfg) => {
      if (cfg.star == this.curHeroInfo.star && cfg.group.indexOf(g) !== -1) return true;
    });
    let heros = ModelManager.get(HeroModel).heroInfos;
    heros.forEach(h => {
      let info = <icmsg.HeroInfo>h.extInfo;
      if (info.star == 4 && info.typeId !== this.curHeroInfo.typeId) {
        let cfg = <HeroCfg>BagUtils.getConfigById(info.typeId);
        if (this.curHeroInfo.star <= cfg.star_max
          && limitCfg.group.indexOf(cfg.group[0]) !== -1 && cfg.group[0] != 6) {
          datas.push({
            info: info,
            select: this.materialIds.indexOf(info.heroId) !== -1
          })
        }
      }
    });

    datas.sort((a, b) => { return a.info.typeId - b.info.typeId; })
    this.list['selectIds'] = [...this.materialIds];
    this.list.clear_items();
    this.list.set_data(datas);
  }

  _selectItem(data: { info: icmsg.HeroInfo, select: boolean }, idx: number) {
    let i = this.materialIds.indexOf(data.info.heroId);
    if (i !== -1) {
      this.materialIds.splice(i, 1);
      let item = this.list.items[idx].node;
      let ctrl = item.getComponent(HeroTransMaterialsItemCtrl);
      ctrl.check();
      this.list['selectIds'] = [...this.materialIds];
      gdk.e.emit(LotteryEventId.HERO_TRANS_MATERIAL_PRE_SELECT);
    }
    else {
      let g = (<HeroCfg>BagUtils.getConfigById(this.curHeroInfo.typeId)).group[0];
      let cfg = ConfigManager.getItem(Hero_displaceCfg, (cfg: Hero_displaceCfg) => {
        if (cfg.star == this.curHeroInfo.star && cfg.group.indexOf(g) !== -1) return true;
      });
      if (this.materialIds.length >= cfg.num) {
        gdk.gui.showMessage('材料选择上限');
        return;
      }
      if (this.materialIds.length > 0) {
        let typeId = HeroUtils.getHeroInfoByHeroId(this.materialIds[0]).typeId;
        if (data.info.typeId !== typeId) {
          gdk.gui.showMessage('无法选择不一样的材料英雄');
          return;
        }
      }
      let b = HeroUtils.heroLockCheck(data.info, false);
      if (!b) {
        let item = this.list.items[idx].node;
        let ctrl = item.getComponent(HeroTransMaterialsItemCtrl);
        ctrl.check();
        this.materialIds.push(data.info.heroId);
        this.list['selectIds'] = [...this.materialIds];
        gdk.e.emit(LotteryEventId.HERO_TRANS_MATERIAL_PRE_SELECT);
      } else {
        gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
          let ctrl = node.getComponent(HeroLockTipsCtrl);
          ctrl.initArgs(data.info.heroId, [], () => { this.list.select_item(idx) });
        });
        return
      }
    }
    this.list.refresh_items();
    this._updateNum();
  }

  _updateNum() {
    let g = (<HeroCfg>BagUtils.getConfigById(this.curHeroInfo.typeId)).group[0];
    let cfg = ConfigManager.getItem(Hero_displaceCfg, (cfg: Hero_displaceCfg) => {
      if (cfg.star == this.curHeroInfo.star && cfg.group.indexOf(g) !== -1) return true;
    });
    this.selectNum.string = `${this.materialIds.length}/${cfg.num}`;
  }
}
