import BYModel, { EnergyStoneInfo } from '../../model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Tech_stoneCfg, TechCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-15 16:25:00 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/tech/BYTechStoneSelectViewCtrl")
export default class BYTechStoneSelectViewCtrl extends gdk.BasePanel {
  @property([cc.Node])
  slots: cc.Node[] = [];

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property([cc.Button])
  runeTypeBtns: cc.Button[] = [];

  get byModel(): BYModel { return ModelManager.get(BYModel); }

  careerType: number;
  curSlotIdx: number;
  curQuality: number;
  list: ListView;
  onEnable() {
    let arg = this.args[0];
    this.careerType = arg instanceof Array ? arg[0] : arg;
    this.curSlotIdx = arg instanceof Array && arg.length >= 2 ? arg[1] : 1;
    this.selectRuneFunc(true, 0);
    this._updateSlots();
    NetManager.on(icmsg.SoldierTechEquipStoneRsp.MsgType, this._updateSlots, this);
    NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateListLater, this);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    NetManager.targetOff(this);
  }

  /**选择页签,*/
  selectRuneFunc(e, utype) {
    if (!e) return;
    if (parseInt(utype) == this.curQuality) return;
    this.curQuality = parseInt(utype);
    for (let idx = 0; idx < this.runeTypeBtns.length; idx++) {
      const element = this.runeTypeBtns[idx];
      let nodeName = element.name
      let group = parseInt(nodeName.substring('group'.length));
      element.interactable = group != this.curQuality
      let select = element.node.getChildByName("select")
      select.active = group == this.curQuality
    }
    this._updateListLater();
  }

  onSlotClick(e, utype) {
    let idx = parseInt(utype);
    if (this.curSlotIdx == idx) return;
    let cfg = ConfigManager.getItemByField(TechCfg, 'type', this.careerType, { unlock: idx });
    let info = this.byModel.techMap[this.careerType];
    if (!info || info.lv < cfg.lv) return;
    this.curSlotIdx = idx;
    this.slots.forEach((s, idx) => {
      let selectFrame = s.getChildByName('selectFrame');
      selectFrame.active = idx + 1 == this.curSlotIdx;
    });
  }

  _updateSlots() {
    let str = [gdk.i18n.t('i18n:BINGYING_TIP17'), '', gdk.i18n.t('i18n:BINGYING_TIP18'), gdk.i18n.t('i18n:BINGYING_TIP19')][this.careerType - 1];
    let info = this.byModel.techMap[this.careerType];
    let itemIds = info ? info.slots : [];
    this.slots.forEach((s, idx) => {
      let lock = s.getChildByName('lock');
      let add = s.getChildByName('add');
      let slot = s.getChildByName('UiSlotItem');
      let selectFrame = s.getChildByName('selectFrame');
      let cfg = ConfigManager.getItemByField(TechCfg, 'type', this.careerType, { unlock: idx + 1 });
      let itemId = itemIds[idx];
      lock.active = !info || info.lv < cfg.lv;
      slot.active = itemId > 0;
      add.active = !lock.active && !slot.active;
      selectFrame.active = idx + 1 == this.curSlotIdx;
      if (lock.active) {
        lock.getChildByName('lab').getComponent(cc.Label).string = StringUtils.format(gdk.i18n.t('i18n:BINGYING_TIP20'), str, cfg.lv);
      }
      if (slot.active) {
        slot.getComponent(UiSlotItem).updateItemInfo(itemId);
      }
    });
  }

  _updateListLater() {
    gdk.Timer.callLater(this, this._updateList);
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
        gap_x: 13,
        gap_y: 10,
        direction: ListViewDir.Vertical,
      });
      this.list.onClick.on(this._selectItem, this);
    }
  }

  _updateList() {
    this._initList();
    let stoneInSlot = this.byModel.energStoneInSlot;
    let stoneInBag = this.byModel.energStoneInBag;
    let list1: EnergyStoneInfo[] = [];
    let list2: EnergyStoneInfo[] = [];
    stoneInSlot.forEach(s => {
      let cfg = ConfigManager.getItemById(Tech_stoneCfg, s.itemId);
      if (cfg.career_type == this.careerType && (!this.curQuality || cfg.color == this.curQuality)) {
        list1.push(<EnergyStoneInfo>s.extInfo);
      }
    });
    stoneInBag.forEach((s, idx) => {
      let cfg = ConfigManager.getItemById(Tech_stoneCfg, s.itemId);
      if (cfg.career_type == this.careerType && (!this.curQuality || cfg.color == this.curQuality)) {
        for (let i = 0; i < s.itemNum; i++) {
          let obj: EnergyStoneInfo = {
            slot: -1,
            itemId: parseInt(s.itemId.toString() + idx),  //id+idx 7位+n
            itemNum: 1,
          };
          list2.push(obj);
        }
      }
    });
    list1.sort((a, b) => {
      let cA = ConfigManager.getItemById(Tech_stoneCfg, a.itemId);
      let cB = ConfigManager.getItemById(Tech_stoneCfg, b.itemId);
      if (cA.color == cB.color) { return cB.id - cA.id; }
      else return cB.color - cA.color;
    });

    list2.sort((a, b) => {
      let cA = ConfigManager.getItemById(Tech_stoneCfg, parseInt(a.itemId.toString().slice(0, 7)));
      let cB = ConfigManager.getItemById(Tech_stoneCfg, parseInt(b.itemId.toString().slice(0, 7)));
      if (cA.color == cB.color) { return cB.id - cA.id; }
      else return cB.color - cA.color;
    });

    this.list.clear_items();
    this.list.set_data([...list1, ...list2]);
  }

  _selectItem(data) {
    let info: EnergyStoneInfo = data;
    gdk.panel.setArgs(PanelId.BYTechStoneInfoView, [info, this.curSlotIdx]);
    gdk.panel.open(PanelId.BYTechStoneInfoView);
  }
}
