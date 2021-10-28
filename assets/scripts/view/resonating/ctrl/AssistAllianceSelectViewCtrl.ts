import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import HeroLockTipsCtrl from '../../role/ctrl2/main/common/HeroLockTipsCtrl';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import ResonatingModel from '../model/ResonatingModel';
import { BagType } from '../../../common/models/BagModel';
import { Hero_trammelCfg } from '../../../a/config';
import { HeroCfg } from '../../../../boot/configs/bconfig';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-06 13:43:08 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/resonating/AssistAllianceSelectViewCtrl")
export default class AssistAllianceSelectViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get resonatingModel(): ResonatingModel { return ModelManager.get(ResonatingModel); }
  get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

  allianceId: number;
  idx: number;
  list: ListView;
  cfg: Hero_trammelCfg;
  curSelect: number = 0;
  onEnable() {
    [this.allianceId, this.idx] = this.args[0];
    this.cfg = ConfigManager.getItemByField(Hero_trammelCfg, 'trammel_id', this.allianceId);
    this._updateList();
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
  }

  onConfirmBtnClick() {
    let curAllianceInfo = this.resonatingModel.assistAllianceInfos[this.allianceId];
    if ((!curAllianceInfo && !this.curSelect) ||
      (curAllianceInfo && curAllianceInfo.heroIds[this.idx] == this.curSelect)) {
      this.close();
    }
    else {
      let req = new icmsg.AssistAllianceOnReq();
      req.allianceId = this.allianceId;
      req.heroId = this.curSelect;
      req.index = this.idx;
      NetManager.send(req, () => { this.close(); }, this);
    }
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
    let curAllianceInfo = this.resonatingModel.assistAllianceInfos[this.allianceId];
    let heroType = this.cfg.trammel_hero[this.idx];
    let heros = this.heroModel.heroInfos;
    let temp: icmsg.HeroInfo[] = [];
    let groupMap = {
      0: [1, 2, 3, 4, 5, 6],
      1: [1],
      2: [2],
      3: [3],
      4: [4],
      5: [5],
      6: [6],
      11: [1, 2],
      12: [3, 4, 5]
    }
    heros.forEach(h => {
      let info = <icmsg.HeroInfo>h.extInfo;
      let b = false;
      if (BagUtils.getItemTypeById(heroType) == BagType.HERO) {
        b = info.typeId == heroType;
      } else {
        b = groupMap[heroType].indexOf(ConfigManager.getItemById(HeroCfg, info.typeId).group[0]) !== -1;
      }
      if (b) {
        if (info.star >= 4 && (!HeroUtils.heroLockCheck(info, false, [0, 7]) || (curAllianceInfo && curAllianceInfo.heroIds[this.idx] == info.heroId))) {
          temp.push(info);
        }
      }
    });
    let data = [];
    let others = [];
    let b = false;
    temp.forEach(t => {
      let obj = {
        heroInfo: t,
        select: false,
        curSelectId: curAllianceInfo ? curAllianceInfo.heroIds[this.idx] : 0
      };
      if (curAllianceInfo && curAllianceInfo.heroIds[this.idx] == t.heroId) {
        data.push(obj);
        b = true;
      }
      else {
        others.push(obj);
      }
    });
    others.sort((a, b) => { return b.heroInfo.star - a.heroInfo.star; })
    data = data.concat(others);

    this.list.clear_items();
    this.list.set_data(data);
    gdk.Timer.callLater(this, () => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this.scrollView.node.height = Math.max(240, Math.min(419, Math.floor(data.length / 4) * 130 + 10));
      if (b) {
        this.list.select_item(0);
      }
    })
  }

  _selectItem(data, idx, preData, preIdx) {
    let curAllianceInfo = this.resonatingModel.assistAllianceInfos[this.allianceId];
    if (data) {
      let b = HeroUtils.heroLockCheck(data.heroInfo, false, [1, 2, 3, 4, 5, 6, 7, 8]);
      if ((curAllianceInfo && curAllianceInfo.heroIds[this.idx] == data.heroInfo.heroId) || !b) {
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
      } else if (b) {
        if (b) {
          gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
            let ctrl = node.getComponent(HeroLockTipsCtrl);
            ctrl.initArgs(data.heroInfo.heroId, [0, 9, 10, 11, 12], () => { this.list.select_item(idx) });
          });
          return
        }
      }
    }
  }
}
