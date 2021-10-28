import ConfigManager from '../../../../common/managers/ConfigManager';
import GeneConHeroNodeCtrl from './GeneConHeroNodeCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Hero_careerCfg, Hero_globalCfg } from '../../../../a/config';
import { HeroCfg } from '../../../../../boot/configs/bconfig';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-16 13:36:45 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-20 17:38:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/GeneConnectViewCtrl")
export default class GeneConnectViewCtrl extends gdk.BasePanel {
  @property(GeneConHeroNodeCtrl)
  mysticHero: GeneConHeroNodeCtrl = null;

  @property(GeneConHeroNodeCtrl)
  connectHero: GeneConHeroNodeCtrl = null;

  @property(cc.Node)
  geneConnectNode: cc.Node = null;

  @property(cc.Node)
  confirmBtn: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

  curMysticHeroId: number = 0;
  curConnectHeroId: number = 0;
  list: ListView;
  onEnable() {
    gdk.e.on(RoleEventId.GENE_CONNECT_HERO_SELECT, this._onConnectHeroSelect, this);
    gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._onUpdateOneHero, this);
    NetManager.on(icmsg.BattleArrayQueryRsp.MsgType, () => {
      gdk.gui.showMessage('您的部分预设阵容不可用,已自动下阵涉及的英雄');
    }, this);
    this._updateListLater();
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  onConnectHeroAddBtnClick() {
    let mysticHeroInfo = HeroUtils.getHeroInfoByHeroId(this.curMysticHeroId);
    if (!mysticHeroInfo.mysticLink) {
      gdk.panel.setArgs(PanelId.GeneConHeroSelectView, this.curConnectHeroId || 0);
      gdk.panel.open(PanelId.GeneConHeroSelectView);
    }
  }

  onConfirmBtnClick() {
    let mysticHeroInfo = HeroUtils.getHeroInfoByHeroId(this.curMysticHeroId);
    if (!mysticHeroInfo.mysticLink && !this.curConnectHeroId) {
      //
      GlobalUtil.showMessageAndSound('请先选择链接英雄');
      return;
    }

    if (!mysticHeroInfo.mysticLink && this.curConnectHeroId > 0) {
      //链接
      gdk.panel.setArgs(PanelId.GeneConConfirmView, [this.curMysticHeroId, this.curConnectHeroId]);
      gdk.panel.open(PanelId.GeneConConfirmView);
      return;
    }

    if (mysticHeroInfo.mysticLink > 0) {
      //解除
      gdk.panel.setArgs(PanelId.GeneConConfirmView, [this.curMysticHeroId]);
      gdk.panel.open(PanelId.GeneConConfirmView);
      return;
    }
  }

  _updateTopView() {
    this._updateHeroNode();
    this._updateConnectNode();
    this._updateConfirmBtn();
  }

  _updateHeroNode() {
    this.mysticHero.updateView(this.curMysticHeroId);
    this.connectHero.updateView(this.curConnectHeroId);
  }

  _updateConnectNode() {
    let mysticHeroInfo = HeroUtils.getHeroInfoByHeroId(this.curMysticHeroId);
    let isConnect = mysticHeroInfo.mysticLink > 0;
    GlobalUtil.setSpriteIcon(this.node, cc.find('linkLine', this.geneConnectNode), `view/role/texture/geneConnect/smz_lianjie${isConnect ? 2 : 5}`);
    cc.find('curHero/linkBg', this.geneConnectNode).active = isConnect;
    cc.find('connectHero/linkBg', this.geneConnectNode).active = isConnect;
    let mysticSlot = cc.find('curHero/UiSlotItem', this.geneConnectNode).getComponent(UiSlotItem);
    let connectSlot = cc.find('connectHero/UiSlotItem', this.geneConnectNode).getComponent(UiSlotItem);
    mysticSlot.updateItemInfo(mysticHeroInfo.typeId);
    mysticSlot.updateStar(mysticHeroInfo.star);
    mysticSlot.updateCareer(ConfigManager.getItemByField(Hero_careerCfg, 'career_id', mysticHeroInfo.careerId).career_type);
    mysticSlot.lvLab.active = true;
    mysticSlot.lvLab.getComponent(cc.Label).string = `.${mysticHeroInfo.level}`;
    connectSlot.node.active = this.curConnectHeroId > 0;
    if (this.curConnectHeroId > 0) {
      let connectHeroInfo = HeroUtils.getHeroInfoByHeroId(this.curConnectHeroId);
      connectSlot.updateItemInfo(connectHeroInfo.typeId);
      connectSlot.updateStar(connectHeroInfo.star);
      connectSlot.updateCareer(ConfigManager.getItemByField(Hero_careerCfg, 'career_id', connectHeroInfo.careerId).career_type);
      connectSlot.lvLab.active = true;
      connectSlot.lvLab.getComponent(cc.Label).string = `.${connectHeroInfo.level}`;
    }
  }

  _updateConfirmBtn() {
    let mysticHeroInfo = HeroUtils.getHeroInfoByHeroId(this.curMysticHeroId);
    let isConnect = mysticHeroInfo.mysticLink > 0;
    cc.find('layout/lab', this.confirmBtn).getComponent(cc.Label).string = isConnect ? '解除链接' : '基因链接';
    cc.find('layout/icon', this.confirmBtn).active = isConnect;
    if (isConnect) {
      cc.find('layout/icon/num', this.confirmBtn).getComponent(cc.Label).string = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'mystery_unlink_cost').value[1] + '';
    }
  }

  _onConnectHeroSelect(e: gdk.Event) {
    let id = e.data;
    if (id && id !== this.curConnectHeroId) {
      this.curConnectHeroId = id;
      this.connectHero.updateView(this.curConnectHeroId);
      this._updateConnectNode();
    }
  }

  _onUpdateOneHero(e: gdk.Event) {
    let item: BagItem = e.data;
    let info: icmsg.HeroInfo = item ? <icmsg.HeroInfo>item.extInfo : null;
    if (info && info.heroId == this.curMysticHeroId) {
      if (!info.mysticLink) {
        this.curConnectHeroId = 0;
        this.connectHero.updateView(this.curConnectHeroId);
      }
      this._updateTopView();
      for (let i = 0; i < this.list.datas.length; i++) {
        if (this.list.datas[i].heroId == info.heroId) {
          this.list.datas[i] = info;
          this.list.refresh_item(i);
          return;
        }
      }
    }
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        column: 5,
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
    let heros = this.heroModel.heroInfos;
    heros.forEach(h => {
      let cfg = ConfigManager.getItemById(HeroCfg, h.itemId);
      if (cfg.group[0] == 6) {
        data.push(<icmsg.HeroInfo>h.extInfo);
      }
    });
    data.sort((a, b) => { return a.power - b.power; });
    this.list.clear_items();
    this.list.set_data(data);
    gdk.Timer.callLater(this, () => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      let idx = 0;
      let args = this.args[0];
      if (args) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].heroId == args) {
            idx = i;
            break;
          }
        }
      }
      this.list.scroll_to(idx);
      this.list.select_item(idx);
    });
  }

  _selectItem(data: icmsg.HeroInfo, idx: number) {
    if (this.curMysticHeroId && data.heroId == this.curMysticHeroId) return;
    this.list['select'] = data.heroId;
    this.curMysticHeroId = data.heroId;
    this.curConnectHeroId = data.mysticLink || 0;
    this._updateTopView();
    this.list.refresh_items();
  }
}
