import ActivityModel, { CavePointInfo } from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import CavePointCtrl from './CavePointCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { Cave_adventureCfg, Map_caveCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-07 10:57:31 
  */
const { ccclass, property } = cc._decorator;

@ccclass
export default class CaveTiledMapCtrl extends cc.Component {
  @property(cc.TiledMap)
  tiledMap: cc.TiledMap = null;   //map图片

  @property(cc.Prefab)
  pointItem: cc.Prefab = null; //据点

  viewCtrl: any;
  mapCfg: Map_caveCfg;
  mapLayer: cc.TiledLayer;
  // cityLayer: cc.Node;
  cb: Function;
  rewardType: number;
  actId: number = 104;

  get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

  onEnable() {
    let t = ConfigManager.getItems(Cave_adventureCfg);
    this.rewardType = Math.min(t[t.length - 1].type, ActUtil.getActRewardType(this.actId));
  }

  onDisable() {
    // this.mapLayer.node.removeChild(this.cityLayer);
    this.mapLayer = null;
    this.viewCtrl = null;
    // this.cityLayer = null
    this.cb = null;
  }

  initMap(ctrl: any, tmx: cc.TiledMapAsset, cb?: Function) {
    this.viewCtrl = ctrl;
    this.tiledMap.tmxAsset = tmx;
    cb && (this.cb = cb);
    this.mapCfg = ConfigManager.getItemById(Map_caveCfg, this.actModel.caveCurMapId);
    this.mapLayer = this.tiledMap.getLayers()[0];
    // this.cityLayer = cc.instantiate(new cc.Node);
    // this.cityLayer.setAnchorPoint(0);
    // this.mapLayer.node.addChild(this.cityLayer);
    this.node.scale = 0.6;
    this.actModel.cavePointMapByPlate = {};
    this.actModel.cavePointMapByPos = {};
    gdk.Timer.callLater(this, this._initPoints);
  }

  resetSize() {
    this.tiledMap.node.scale = 0.6
    this.tiledMap.node.width = this.mapLayer.node.width * 0.6
    this.tiledMap.node.height = this.mapLayer.node.height * 0.6
  }

  _initPoints() {
    if (!cc.isValid(this.node)) return;
    if (!this.node.activeInHierarchy) return;
    let m = this.actModel;
    let pointLayer = this.tiledMap.getObjectGroup("points");
    let points = pointLayer.getObjects();
    for (let i = 0; i < points.length; i++) {
      let p = points[i];
      let pos = this._getTilePos(p.offset);
      let key = `${pos.x}-${pos.y}`;
      let plate = parseInt(p.name);
      let cfg = ConfigManager.getItem(Cave_adventureCfg, (cfg: Cave_adventureCfg) => {
        if (cfg.type == this.rewardType
          && cfg.layer == this.actModel.caveCurLayer
          && cfg.plate == plate) {
          return true;
        }
      });
      let obj: CavePointInfo = {
        position: pos,
        mapPos: cc.v2(p.x, p.y),
        cfg: cfg
      };
      m.cavePointMapByPlate[plate] = obj;
      m.cavePointMapByPos[key] = obj;
    }

    // 创建战斗节点
    gdk.Timer.callLater(this, this.createPoint);
  }

  createPoint() {
    if (!cc.isValid(this.node)) return;
    if (!this.node.activeInHierarchy) return;
    let m = this.actModel;
    let tileSize = this.tiledMap.getTileSize();
    for (let key in m.cavePointMapByPlate) {
      let info: CavePointInfo = m.cavePointMapByPlate[key];
      let item = cc.instantiate(this.pointItem);
      // item.parent = this.cityLayer;
      this.mapLayer.addUserNode(item);
      item.setScale(1);
      item.setPosition(info.mapPos.x, info.mapPos.y + tileSize.height / 2);
      let ctrl = item.getComponent(CavePointCtrl);
      //todo
      ctrl.initInfo(info);
    }
    this.cb && this.cb();
  }

  //将像素坐标转化为瓦片坐标
  _getTilePos(offset: cc.Vec2) {
    let x = Math.round(offset.x / this.mapCfg.tw);
    let y = Math.round(offset.y / this.mapCfg.th);
    return cc.v2(x, y);
  }
}
