import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RelicDropRecordItemCtrl from './RelicDropRecordItemCtrl';
import RelicModel from '../model/RelicModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { Relic_mapCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-04 17:25:01 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicDropRecordViewCtrl")
export default class RelicDropRecordViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(UiTabMenuCtrl)
  tabMenu: UiTabMenuCtrl = null;

  @property(cc.Label)
  pageNumLab: cc.Label = null;

  @property(cc.Node)
  leftArrow: cc.Node = null;

  @property(cc.Node)
  rightArrow: cc.Node = null;

  get RelicModel(): RelicModel { return ModelManager.get(RelicModel); }

  mapType: number;
  curSelect: number;
  cityId: number;
  totalNum: number;
  curIdx: number = 0;
  pageNum: number = 1;
  eachPageLen: number = 9;
  isLock: boolean = false;
  onEnable() {
    this.mapType = ConfigManager.getItemById(Relic_mapCfg, this.RelicModel.mapId).mapType;
    this.cityId = this.args[0] || 0;
    if (this.cityId == 0) {
      this.tabMenu.node.children[0].active = false;
      this.tabMenu.setSelectIdx(1, true);
    }
    else {
      this.tabMenu.node.children[0].active = true;
      this.tabMenu.setSelectIdx(0, true);
    }
  }

  onDisable() {
    NetManager.targetOff(this);
  }

  onTabMenuSelect(e, type) {
    if (!e) return;
    if (this.isLock) return;
    this.curSelect = parseInt(type);
    this.totalNum = 0;
    this.pageNum = 1;
    this._req();
  }

  onLeftBtnClick() {
    if (this.isLock) return;
    this.pageNum -= 1;
    this._req();
  }

  onRightBtnClick() {
    if (this.isLock) return;
    this.pageNum += 1;
    this._req();
  }

  _req() {
    this.isLock = true;
    let req = new icmsg.RelicMapDropsReq();
    req.mapType = this.mapType;
    req.pointId = this.curSelect == 1 ? 0 : this.cityId;
    req.index = (this.pageNum - 1) * this.eachPageLen;
    req.size = this.eachPageLen;
    NetManager.send(req, (resp: icmsg.RelicMapDropsRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this.isLock = false;
      this._updateView(resp);
    }, this);
  }

  _updateView(resp: icmsg.RelicMapDropsRsp) {
    this.totalNum = resp.total;
    this.content.removeAllChildren();
    resp.list.forEach(l => {
      let item = cc.instantiate(this.itemPrefab);
      let ctrl = item.getComponent(RelicDropRecordItemCtrl);
      item.parent = this.content;
      ctrl.init(l);
    });
    this.pageNumLab.string = StringUtils.format(gdk.i18n.t('i18n:RELIC_TIP28'), this.pageNum);
    this.leftArrow.getComponent(cc.Button).interactable = this.pageNum !== 1;
    this.rightArrow.getComponent(cc.Button).interactable = this.pageNum !== Math.max(1, Math.ceil(this.totalNum / this.eachPageLen));
  }
}
