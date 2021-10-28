import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import RuneModel from '../../../../common/models/RuneModel';
import RuneUtils from '../../../../common/utils/RuneUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { BagItem } from '../../../../common/models/BagModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';
import { Rune_blessCfg, Rune_clearCfg, RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-01 17:34:24 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneClearViewCtrl")
export default class RuneClearViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  bg1: cc.Node = null;

  @property(cc.Node)
  bg2: cc.Node = null;

  @property(cc.Node)
  targetRuneNode: cc.Node = null;

  @property(cc.Node)
  blessProNode: cc.Node = null;

  @property(UiTabMenuCtrl)
  uiTabMenu: UiTabMenuCtrl = null;

  @property(cc.Label)
  nextLvLab: cc.Label = null;

  @property(cc.Node)
  costNode: cc.Node = null;

  @property(cc.Node)
  clearBtn: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property([cc.Node])
  lvNodes: cc.Node[] = [];

  @property(cc.Node)
  preItem: cc.Node = null;

  @property(sp.Skeleton)
  clearSpine: sp.Skeleton = null;

  @property(sp.Skeleton)
  clearSpine2: sp.Skeleton = null;

  @property(cc.Node)
  clickBlock: cc.Node = null;

  get RuneModel(): RuneModel { return ModelManager.get(RuneModel); }

  bg1Url = ["view/role/texture/bg/fwdz_putongditu", "view/role/texture/bg/fwdz_gaojiditu"];
  bg2Url = ["view/role/texture/bg/fwdz_putongxilian", "view/role/texture/bg/fwdz_gaojixilian"];

  curSelectItem: RuneClearItem;
  curSelectMode: RuneClearMode;
  selectArg: { heroId: number, runeId: number, bless: number };
  list: ListView;
  isClick: boolean = true;
  RelicTimeStamp: number;
  lvTween: cc.Tween;
  aniMap: { type: number, old: number, new: number, duration: number }[] = [];
  inAni: boolean = false;
  waitForUpdate: boolean = false;
  upPowerInfo: { old: number, new: number };
  onEnable() {
    this.clickBlock.active = false;
    let req = new icmsg.RuneBlessInfoReq();
    NetManager.send(req, (resp: icmsg.RuneBlessInfoRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.active) return;
      this._updateList();
      this.uiTabMenu.setSelectIdx(0, true);
    }, this);

    NetManager.on(icmsg.RuneUpdateRsp.MsgType, this._onReciveRuneProto, this);
    NetManager.on(icmsg.RuneOnRsp.MsgType, this._onReciveRuneProto, this);

    gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._onRoleAttrUpdate, this);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    if (this.lvTween) {
      this.lvTween.stop();
      this.lvTween = null;
    }
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  onClearBtnClick() {
    let now = Date.now();
    if (now - this.RelicTimeStamp < 0) {
      // 限制按钮点击频率
      return;
    }
    this.RelicTimeStamp = now + 1300;
    if (!this.isClick) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP19'));
      return;
    }
    if (!this.curSelectItem) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP20'));
      return;
    }

    let curLv = parseInt(this.curSelectItem.item.itemId.toString().slice(6));
    let cfg = ConfigManager.getItemByField(Rune_clearCfg, 'clear_lv', curLv, { type: this.curSelectMode });
    if (!cfg.item_cost) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP21'));
      return;
    }

    for (let i = 0; i < cfg.item_cost.length; i++) {
      if (BagUtils.getItemNumById(cfg.item_cost[i][0]) < cfg.item_cost[i][1]) {
        gdk.gui.showMessage(`${BagUtils.getConfigById(cfg.item_cost[i][0]).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`);
        return;
      }
    }

    this.isClick = false;
    this.inAni = true;
    this.clickBlock.active = true;
    let req = new icmsg.RuneWashReq();
    req.heroId = (<icmsg.RuneInfo>this.curSelectItem.item.extInfo).heroId;
    req.runeId = this.curSelectItem.item.itemId;
    req.index = req.heroId > 0 ? 1 : parseInt(this.curSelectItem.blessId.toString().slice(8));
    req.tp = this.curSelectMode;
    NetManager.send(req, (resp: icmsg.RuneWashRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.active) return;
      let cb = () => {
        this.inAni = false;
        if (this.waitForUpdate) {
          this.waitForUpdate = false;
          this._onRuneChange();
        }
        if (this.upPowerInfo) {
          JumpUtils.updatePowerTip(this.upPowerInfo.old, this.upPowerInfo.new);
          this.upPowerInfo = null;
        }
        gdk.panel.setArgs(PanelId.RuneClearResultPanel, resp);
        gdk.panel.open(PanelId.RuneClearResultPanel);
        PanelId.RuneClearResultPanel.onHide = {
          func: () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.active) return;
            this.isClick = true;
            this.clickBlock.active = false;
          }
        }
      }

      this.clearSpine.setCompleteListener(() => {
        this.clearSpine.setCompleteListener(null);
        this.clearSpine.setAnimation(0, 'stand2', true);
        let oldLv = parseInt(resp.oldRuneId.toString().slice(6));
        let newLv = parseInt(resp.newRuneId.toString().slice(6));
        this.playLvAni(oldLv, newLv, 1, cb);
      });
      this.clearSpine2.setCompleteListener(() => {
        this.clearSpine2.setCompleteListener(null);
        this.clearSpine2.enabled = false;
      });
      this.clearSpine2.enabled = true;
      this.clearSpine2.setAnimation(0, 'stand', true);
      this.clearSpine.setAnimation(0, 'stand', true);

      let blessCfg = ConfigManager.getItemByField(Rune_clearCfg, 'clear_lv', parseInt(resp.newRuneId.toString().slice(6)), { type: 1 });
      let bless = this.RuneModel.blessMap[this.curSelectItem.blessId] ? this.RuneModel.blessMap[this.curSelectItem.blessId].bless : 0;
      if (resp.tp == 1) {
        bless += blessCfg.bless;
      }
      else if (resp.tp == 3) {
        bless = 0;
      }
      this.selectArg = {
        heroId: resp.heroId,
        runeId: resp.newRuneId,
        bless: bless
      }

      if (resp.newRuneId == resp.oldRuneId) {
        //   this._onRuneChange();
        NetManager.send(new icmsg.RuneBlessInfoReq());
      }
    }, this);
  }

  onTabMenuSelect(e, type) {
    if (!e) return;
    let now = Date.now();
    if (now - this.RelicTimeStamp < 0) {
      // 限制按钮点击频率
      return;
    }
    if (!this.isClick) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP19'));
      return;
    }
    this.curSelectMode = parseInt(type) + 1;
    this._updateTopView();
  }

  _onRoleAttrUpdate(e: gdk.Event) {
    if (e.data.index == 102) {
      if (e.data.value > e.data.oldv) {
        if (this.inAni || this.waitForUpdate) {
          this.upPowerInfo = {
            old: e.data.oldv,
            new: e.data.value
          }
        }
        else {
          this.upPowerInfo = null;
          JumpUtils.updatePowerTip(e.data.oldv, e.data.value);
        }
      }
    }
  }

  _onReciveRuneProto() {
    if (this.inAni) this.waitForUpdate = true;
    else {
      this.waitForUpdate = false;
      this._onRuneChange();
    }
  }

  _onRuneChange() {
    if (this.inAni || this.waitForUpdate) return;
    NetManager.send(new icmsg.RuneBlessInfoReq(), this._updateList, this);
  }

  _clickItem(item: RuneClearItem) {
    if (!item) return
    this.curSelectItem = item;
    this._updateTopView();
    this._updateRedpoint();
  }

  _updateTopView() {
    GlobalUtil.setSpriteIcon(this.node, this.bg1, this.bg1Url[this.curSelectMode - 1]);
    GlobalUtil.setSpriteIcon(this.node, this.bg2, this.bg2Url[this.curSelectMode - 1]);
    this.targetRuneNode.active = !!this.curSelectItem;
    if (this.targetRuneNode.active) {
      this.clearSpine.setCompleteListener(null);
      this.clearSpine2.setCompleteListener(null);
      this.clearSpine2.enabled = false;
      this.clearSpine.setAnimation(0, 'stand2', true);
      let runeId = parseInt(this.curSelectItem.item.itemId.toString().slice(0, 6));
      let clearLv = parseInt(this.curSelectItem.item.itemId.toString().slice(6));
      // let slot = cc.find('preItem', this.targetRuneNode).getComponent(UiSlotItem);
      let slot = this.preItem.getComponent(UiSlotItem);
      let lvLab = cc.find('lv', slot.node).getComponent(cc.Label);
      let nameLab = cc.find('name', this.targetRuneNode).getComponent(cc.Label);
      let cfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', runeId);
      lvLab.string = `.${cfg.level}`;
      nameLab.string = `${cfg.name}+${clearLv}`;
      slot.updateItemInfo(runeId);
      slot.onClick.on(() => {
        gdk.panel.setArgs(PanelId.RuneInfo, [this.curSelectItem.item.itemId, null, null]);
        gdk.panel.open(PanelId.RuneInfo);
      });
      //下一级强化提示
      if (clearLv < 20) {
        if (this.curSelectMode == 2) {
          this.nextLvLab.node.active = true;
          this.nextLvLab.string = StringUtils.format(gdk.i18n.t('i18n:RUNE_TIP22'), ConfigManager.getItemByField(Rune_clearCfg, 'clear_lv', clearLv, { type: 2 }).result_lv1)
        }
        else {
          let bless = this.RuneModel.blessMap[this.curSelectItem.blessId] ? this.RuneModel.blessMap[this.curSelectItem.blessId].bless : 0;
          let blessCfg = ConfigManager.getItem(Rune_blessCfg, (cfg: Rune_blessCfg) => {
            if (cfg.clear_lv[0] <= clearLv && clearLv <= cfg.clear_lv[1]) {
              return true;
            }
          });
          if (bless >= blessCfg.bless_total) {
            this.nextLvLab.node.active = true;
            this.nextLvLab.string = StringUtils.format(gdk.i18n.t('i18n:RUNE_TIP23'), blessCfg.bless_result);
          }
          else {
            this.nextLvLab.node.active = false;
          }
        }
      }
      else {
        this.nextLvLab.node.active = false;
      }
    }
    this._updateBlessPro();
    this._updateClearLv();
    this._updateCost();
    this._updateRedpoint();
  }

  _updateCost() {
    this.costNode.active = !!this.curSelectItem;
    if (this.costNode.active) {
      let clearLv = parseInt(this.curSelectItem.item.itemId.toString().slice(6));
      let cfg = ConfigManager.getItemByField(Rune_clearCfg, 'clear_lv', clearLv, { type: this.curSelectMode });
      if (cfg.item_cost) {
        this.costNode.children.forEach((n, idx) => {
          let info = cfg.item_cost[idx];
          n.active = !!info;
          if (n.active) {
            let icon = cc.find('layout/icon', n);
            let num = cc.find('layout/num', n).getComponent(cc.Label);
            GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(info[0]));
            let hasNum = BagUtils.getItemNumById(info[0]);
            num.string = `${GlobalUtil.numberToStr(hasNum, true)}/${GlobalUtil.numberToStr(info[1], true)}`;
            num.node.color = cc.color().fromHEX(hasNum >= info[1] ? '#FFCE4B' : '#FF0000');
          }
        });
      }
      else {
        this.costNode.active = false;
      }
    }
  }

  /**符文祝福值 */
  _updateBlessPro() {
    this.blessProNode.active = !!this.curSelectItem && this.curSelectMode == 1;
    if (this.blessProNode.active) {
      let bar = cc.find('bar', this.blessProNode);
      let info = this.RuneModel.blessMap[this.curSelectItem.blessId];
      let curBless = info ? info.bless : 0;
      let lv = parseInt(this.curSelectItem.item.itemId.toString().slice(6));
      let cfg = ConfigManager.getItem(Rune_blessCfg, (cfg: Rune_blessCfg) => {
        if (cfg.clear_lv[0] <= lv && lv <= cfg.clear_lv[1]) {
          return true;
        }
      });
      if (!cfg) {
        this.blessProNode.active = false;
      }
      else {
        cc.find('bar', this.blessProNode).width = Math.min(294, 294 * (curBless / cfg.bless_total));
      }
    }
  }

  /**
   * 洗练等级表现
   */
  _updateClearLv() {
    let lv = this.curSelectItem ? parseInt(this.curSelectItem.item.itemId.toString().slice(6)) : 0;
    if (lv == 0) {
      this.lvNodes.forEach((n, idx) => {
        let sprite = n.getComponent(cc.Sprite);
        sprite.fillRange = idx == 0 ? -1 : 0;
      });
    }
    else {
      this.initLvAni(lv);
    }
  }

  initLvAni(lv: number) {
    lv -= 1;
    let type = Math.floor(lv / 4) + 2;  //2-6
    let idx = lv % 4 + 1; //1-4
    this.lvNodes.forEach((n, i) => {
      let sprite = n.getComponent(cc.Sprite);
      if (i + 1 < type) {
        sprite.fillRange = -1;
      }
      else if (i + 1 == type) {
        sprite.fillRange = [-.25, -.5, -.75, -1][idx - 1];
      }
      else {
        sprite.fillRange = 0;
      }
    })
  }

  playLvAni(oldLv: number, newLv: number, totalTime: number, cb?: Function) {
    //0, -.25, -.5, -.75, -1
    oldLv -= 1;
    newLv -= 1;
    let [oldType, newType] = [Math.floor(oldLv / 4) + 2, Math.floor(newLv / 4) + 2];  //2-6
    let [odlIdx, newIdx] = [oldLv % 4 + 1, newLv % 4 + 1]; //1-4
    let d = newType > oldType || (newType == oldType && newIdx >= odlIdx) ? 1 : -1;
    this.aniMap = [];
    let dt = newLv == oldLv ? 0 : totalTime / (Math.abs(newLv - oldLv));
    this.aniMap.push({
      type: oldType,
      old: oldType == 1 ? 4 : odlIdx,
      new: newType == oldType ? newIdx : d >= 1 ? 4 : 5,
      duration: 0
    });
    let n = this.aniMap[0].new == 5 ? 0 : this.aniMap[0].new;
    this.aniMap[0].duration = Math.abs(n - this.aniMap[0].old) * dt;
    if (newType !== oldType) {
      this.aniMap.push({
        type: newType,
        old: d >= 1 ? 5 : 4,
        new: newType == 1 ? 4 : newIdx,
        duration: 0
      })
      this.aniMap[1].duration = dt == 0 ? 0 : totalTime - this.aniMap[0].duration;
    }

    this.lvTween = new cc.Tween(this);
    this.lvTween.to(this.aniMap[0].duration, { ratio: 1 })
      .call(() => {
        this.aniMap.shift();
        this.ratio = 0;
        if (!this.aniMap || this.aniMap.length <= 0) {
          this.lvTween.stop();
          cb && cb();
        }
      });
    this.lvTween.repeatForever(this.lvTween).start();
  }

  private _ratio: number = 0;
  get ratio(): number { return this._ratio; }
  set ratio(v: number) {
    if (!this.aniMap || this.aniMap.length <= 0) {
      return;
    }
    let p = [-.25, -.5, -.75, -1, 0];
    let info = this.aniMap[0];
    let n = this.lvNodes[info.type - 1].getComponent(cc.Sprite);
    let d = p[info.new - 1] >= p[info.old - 1] ? 1 : -1;
    n.fillRange = p[info.old - 1] + d * Math.abs(p[info.new - 1] - p[info.old - 1]) * v;
  }

  _initListView() {
    if (this.list) {
      return
    }
    this.list = new ListView({
      scrollview: this.scrollView,
      mask: this.scrollView.node,
      content: this.content,
      item_tpl: this.itemPrefab,
      cb_host: this,
      async: true,
      column: 5,
      direction: ListViewDir.Vertical,
    })
    this.list.onClick.on(this._clickItem, this)
  }

  _updateList() {
    this._initListView();
    //背包符文
    let bagItems = RuneUtils.getMixRunes();
    //上阵英雄身上的融合符文
    let heroRunes = [];
    this.RuneModel.runeInHeros.forEach(item => {
      if (item.itemId.toString().length == 8) {
        heroRunes.push(item);
      }
    });
    //排序
    let sortFun = (a, b) => {
      let lvA = parseInt(a.itemId.toString().slice(6));
      let lvB = parseInt(b.itemId.toString().slice(6));
      if (lvA == lvB) {
        let cfgA = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(a.itemId.toString().slice(0, 6)))
        let cfgB = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(b.itemId.toString().slice(0, 6)))
        if (cfgA.level == cfgB.level) {
          return cfgB.level - cfgA.level;

        }
        else {
          return cfgA.id - cfgB.id;
        }
      }
      else {
        return lvB - lvA;
      }
    };
    bagItems.sort(sortFun);
    heroRunes.sort(sortFun);
    let datas = [];
    let temp: BagItem[] = [...heroRunes, ...bagItems];
    temp.forEach(item => {
      for (let i = 0; i < item.itemNum; i++) {
        let runeInfo = <icmsg.RuneInfo>item.extInfo;
        let blessId = `${item.itemId}${runeInfo.heroId ? `${HeroUtils.getHeroInfoByHeroId(runeInfo.heroId).typeId}${runeInfo.heroId}` : i + 1}`;
        let obj: RuneClearItem = {
          item: item,
          blessId: parseInt(blessId)
        }
        datas.push(obj)
      }
    });
    this.list.clear_items();
    this.list.set_data(datas);
    gdk.Timer.callLater(this, () => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.active) return;
      let idx = 0;
      if (this.selectArg) {
        for (let i = 0; i < datas.length; i++) {
          let d = <RuneClearItem>datas[i];
          let bless = this.RuneModel.blessMap[d.blessId] ? this.RuneModel.blessMap[d.blessId].bless : 0;
          if (d.item.itemId == this.selectArg.runeId
            && bless == this.selectArg.bless
            && (<icmsg.RuneInfo>d.item.extInfo).heroId == this.selectArg.heroId) {
            idx = i;
            this.selectArg = null;
            break;
          }
        }
      }
      if (datas.length > 0) {
        this.list.select_item(idx);
        this.list.scroll_to(idx);
      }
    })
  }

  _updateRedpoint() {
    this.uiTabMenu.node.children.forEach((n, idx) => {
      let redPoint = n.getChildByName('RedPoint');
      redPoint.active = this.curSelectItem && this.curSelectMode !== idx + 1 && RedPointUtils.single_rune_clear(this.curSelectItem.item, [idx + 1])
    });
  }
}

export type RuneClearItem = {
  item: BagItem,
  blessId: number,
}

export enum RuneClearMode {
  normal = 1,
  super
}
