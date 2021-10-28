import ConfigManager from '../../../../../common/managers/ConfigManager';
import ExpeditionModel from '../ExpeditionModel';
import ExpeditionUtils from '../ExpeditionUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import { Expedition_forcesCfg, Expedition_missionCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-15 10:38:19 
  */

/**
 * 0 据点上限
 * 1 攻击
 * 2 防御
 * 3 生命
 * 4 待定
 * 5 待定
 * 6 待定
 * 7 待定
 */
export enum EXArmyPrivilegeType {
  p0 = 0,
  p1 = 1,
  p2 = 2,
  p3 = 3,
  p4 = 4,
  p5 = 5,
  p6 = 6,
  p7 = 7,
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExprditionArmyViewCtrl")
export default class ExpeditionArmyViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  showArmyNode: cc.Node = null;

  @property(cc.Node)
  descContent: cc.Node = null

  @property(cc.Node)
  descItem: cc.Node = null

  @property(cc.Node)
  curArmy: cc.Node = null;

  @property(cc.Node)
  nextArmy: cc.Node = null;

  @property(cc.Node)
  progressNode: cc.Node = null;

  @property(cc.Node)
  maxTips: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get eModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

  list: ListView;
  curLvCfg: Expedition_forcesCfg;
  onEnable() {
    this._updateView();
    NetManager.on(icmsg.ExpeditionMissionRewardRsp.MsgType, (resp: icmsg.ExpeditionMissionRewardRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      if (this.eModel.armyLv !== this.curLvCfg.id) {
        gdk.panel.open(PanelId.ExpeditionLvUpView);
        this._updateView();
      }
      else {
        this._updateProgressNode();
        this._updateTask();
      }
    }, this);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    NetManager.targetOff(this);
  }

  onPreviewBtnClick() {
    gdk.panel.setArgs(PanelId.ExpeditionArmyRewardView, 1);
    gdk.panel.open(PanelId.ExpeditionArmyRewardView);
  }

  _updateView() {
    this.curLvCfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', this.eModel.armyLv, { type: this.eModel.activityType });
    GlobalUtil.setSpriteIcon(this.node, cc.find('icon', this.showArmyNode), `view/guild/texture/expedition/army/${this.curLvCfg.skin}`);
    cc.find('name', this.showArmyNode).getComponent(cc.Label).string = this.curLvCfg.name;

    this._updateProgressNode();
    this._updateDescContent();
    this._updateTask();
  }

  _updateDescContent() {
    this.descContent.removeAllChildren()
    let cfg_desc = this.curLvCfg.desc
    let datas = cfg_desc.split("<br>")
    for (let i = 0; i < datas.length; i++) {
      let item = cc.instantiate(this.descItem)
      item.active = true
      let richLab = cc.find("label", item).getComponent(cc.RichText)
      richLab.string = `${datas[i]}`
      this.descContent.addChild(item)
    }
  }

  _updateProgressNode() {
    let nextLvCfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', this.curLvCfg.id + 1, { type: this.eModel.activityType });
    this.curArmy.active = !!nextLvCfg;
    this.progressNode.active = !!nextLvCfg;
    this.nextArmy.active = !!nextLvCfg;
    this.maxTips.active = !nextLvCfg;
    if (nextLvCfg) {
      GlobalUtil.setSpriteIcon(this.node, cc.find('icon', this.curArmy), `view/guild/texture/expedition/army/${this.curLvCfg.skin}`);
      cc.find('name', this.curArmy).getComponent(cc.Label).string = this.curLvCfg.name;
      GlobalUtil.setSpriteIcon(this.node, cc.find('icon', this.nextArmy), `view/guild/texture/expedition/army/${nextLvCfg.skin}`);
      cc.find('name', this.nextArmy).getComponent(cc.Label).string = nextLvCfg.name
      //progress
      cc.find('num', this.progressNode).getComponent(cc.Label).string = `${this.eModel.armyExp}/${nextLvCfg.exp}`;
      cc.find('bar', this.progressNode).width = Math.max(0, this.eModel.armyExp / nextLvCfg.exp * 248);
    }
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        cb_host: this,
        gap_y: 5,
        async: true,
        direction: ListViewDir.Vertical,
      })
    }
  }

  _updateTask() {
    gdk.Timer.callLater(this, this._updateList);
  }

  _updateList() {
    this._initList();
    let datas = [];
    let finished = [];
    let doing = [];
    let rewarded = [];
    let temps: Expedition_missionCfg[] = ExpeditionUtils.getCurArmyTaskList();
    for (let i = 0; i < temps.length; i++) {
      if (ExpeditionUtils.getTaskAwardState(temps[i].id)) {
        rewarded.push(temps[i]);
      }
      else if (ExpeditionUtils.getTaskState(temps[i].id)) {
        finished.push(temps[i]);
      }
      else {
        doing.push(temps[i]);
      }
    }
    datas = [...finished, ...doing, ...rewarded];
    this.list.clear_items();
    this.list.set_data(datas);
  }
}
