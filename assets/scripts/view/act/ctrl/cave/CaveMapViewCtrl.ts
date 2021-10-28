import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import CavePathUtils from './CavePathUtils';
import CaveTiledMapCtrl from './CaveTiledMapCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import { ActivityEventId } from '../../enum/ActivityEventId';
import {
  Cave_adventureCfg,
  Cave_globalCfg,
  Map_caveCfg,
  Store_pushCfg
  } from '../../../../a/config';
import { StoreEventId } from '../../../store/enum/StoreEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-07 10:45:56 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/cave/CaveMapViewCtrl")
export default class CaveMapViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  titleNode: cc.Node = null;

  @property(cc.Node)
  keysNode: cc.Node = null;

  @property(cc.Node)
  exploreNode: cc.Node = null;

  @property(CaveTiledMapCtrl)
  tiledMap: CaveTiledMapCtrl = null;

  @property(cc.Node)
  hero: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

  isInit: boolean = false;
  actId: number = 104;
  rewardType: number;
  pointIds: number[] = [];
  tileSize: cc.Size;
  curPlate: number;
  goodsInfo: icmsg.GoodsInfo[] = [];
  curLayer: number;
  onEnable() {
    this.curLayer = this.actModel.caveCurLayer;
    this.mask.active = false;
    this._initMap();
    let mapCfg = ConfigManager.getItemById(Map_caveCfg, this.actModel.caveCurMapId);
    for (let i = 0; i < mapCfg.points.length; i++) {
      this.pointIds.push(i + 1);
    }
    GlobalUtil.setSpriteIcon(this.node, this.titleNode, `view/act/texture/cave/kddzz_kuangdongdamaoxian0${this.curLayer}`);
    gdk.e.on(ActivityEventId.ACTIVITY_CAVE_EMIT_CLICK_PLATE, this._onPlateClick, this);
    gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
  }

  onDisable() {
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  _onPaySucc(e: gdk.Event) {
    let data = <icmsg.PaySuccRsp>e.data;
    let cfg = ConfigManager.getItemById(Store_pushCfg, data.paymentId);
    if (cfg && cfg.event_type == 4) {
      GlobalUtil.openRewadrView(data.list);
    }
  }

  @gdk.binding("actModel.caveCurLayer")
  _updateLayer() {
    if (this.curLayer !== this.actModel.caveCurLayer) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:CAVE_TIPS1'));
      this.close();
    }
  }

  _initMap() {
    // 加载并初始化地图
    let t = ConfigManager.getItems(Cave_adventureCfg);
    this.rewardType = Math.min(t[t.length - 1].type, ActUtil.getActRewardType(this.actId));
    let cfg = ConfigManager.getItem(Cave_adventureCfg, (cfg: Cave_adventureCfg) => {
      if (cfg.type == this.rewardType && cfg.layer == this.actModel.caveCurLayer) {
        return true;
      }
    });
    this.actModel.caveCurMapId = cfg.map_id;
    gdk.rm.loadRes(this.resId, `tileMap/cave/${this.actModel.caveCurMapId}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this.isInit = true;
      this.tiledMap.initMap(this, tmx, () => {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let info = this.actModel.caveLayerInfos[this.actModel.caveCurLayer - 1];
        let pointInfo = this.actModel.cavePointMapByPlate[info.plate];
        this.curPlate = info.plate;
        this.tileSize = this.tiledMap.getComponent(CaveTiledMapCtrl).tiledMap.getTileSize();
        this.hero.setPosition(pointInfo.mapPos.x, pointInfo.mapPos.y + this.tileSize.height / 2);
        this.tiledMap.node.setPosition(-this.tiledMap.node.width / 2, -this.tiledMap.node.height / 2);
      });
      this.tiledMap.resetSize()
    });
  }

  @gdk.binding("actModel.caveKeys")
  _updateKeys() {
    GlobalUtil.setSpriteIcon(this.node, cc.find('icon', this.keysNode), GlobalUtil.getIconById(ConfigManager.getItemByField(Cave_globalCfg, 'key', 'key_item_id').value[0]));
    cc.find('num', this.keysNode).getComponent(cc.Label).string = `x${this.actModel.caveKeys}`;
  }

  @gdk.binding("actModel.caveExplore")
  _updateExplore() {
    GlobalUtil.setSpriteIcon(this.node, cc.find('icon', this.exploreNode), GlobalUtil.getIconById(ConfigManager.getItemByField(Cave_globalCfg, 'key', 'explore_item_id').value[0]));
    cc.find('leftLab', this.exploreNode).getComponent(cc.Label).string = `${this.actModel.caveExplore}`;
  }

  _onPlateClick(e: gdk.Event) {
    if (!this.isInit || !this.curPlate) return;
    let plate = parseInt(e.data);
    if (plate == this.curPlate) return;
    let targetPointInfo = this.actModel.cavePointMapByPlate[plate];
    let pathUtils = new CavePathUtils();
    pathUtils.init(this.curPlate, this.pointIds, targetPointInfo.cfg.plate);
    let pathIds = pathUtils.serachPath();
    let includeDoor: boolean = false;
    let explore = this.actModel.caveExplore;
    let layerInfo = this.actModel.caveLayerInfos[this.actModel.caveCurLayer - 1];
    for (let i = 0; i < pathIds.length; i++) {
      //截取 1.剩余探索点满足的路径 2.触发礼包处 3.传送门
      let cfg = ConfigManager.getItem(Cave_adventureCfg, (cfg: Cave_adventureCfg) => {
        if (cfg.type == this.rewardType && cfg.layer == this.actModel.caveCurLayer && cfg.plate == pathIds[i]) {
          return true;
        }
      });
      if (i !== 0 && !!cfg.gift_id && [1, 3].indexOf(ActivityUtils.getCaveGiftStateById(cfg.gift_id)) == -1 && (layerInfo.passMap[pathIds[i]] || explore > 0)) {
        //礼包 (已解锁或探索点足够且未购买)
        pathIds = pathIds.slice(0, i + 1);
        break;
      } else if (i !== 0 && cfg.door == 1 && !layerInfo.passMap[pathIds[i]] && explore > 0) {
        //传送门 (未解锁且探索点足够)
        pathIds = pathIds.slice(0, i + 1);
        includeDoor = true;
        break;
      }
      else {
        if (!layerInfo.passMap[pathIds[i]]) {
          if (explore <= 0) {
            //未解锁格子 且探索点不足
            pathIds = pathIds.slice(0, i);
            break;
          }
          else {
            explore -= 1;
          }
        }
      }
    }
    if (pathIds.length < 2 || pathIds[0] == pathIds[1]) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:CAVE_TIPS2'));
      return;
    }
    //传送门处理方式
    let doorHandle = (path) => {
      if (this.actModel.caveKeys >= 1) {
        GlobalUtil.openAskPanel({
          descText: gdk.i18n.t('i18n:CAVE_TIPS3'),
          sureCb: () => {
            this._reqMove(path);
          },
          closeCb: () => {
            this.mask.active = false;
          }
        })
      }
      else {
        GlobalUtil.openAskPanel({
          descText: gdk.i18n.t('i18n:CAVE_TIPS4'),
          sureText: gdk.i18n.t('i18n:CAVE_TIPS5'),
          sureCb: () => {
            this.mask.active = false;
            gdk.panel.open(PanelId.CaveTaskView);
          },
          closeCb: () => {
            this.mask.active = false;
          }
        })
      }
    }

    if (includeDoor && pathIds.length == 2) {
      doorHandle(pathIds);
    }
    else {
      if (includeDoor) {
        //包含传送门,分两步移动
        this.mask.active = true;
        let firstPath = pathIds.slice(0, pathIds.length - 1);
        let doorPath = pathIds.slice(pathIds.length - 2);
        let req = new icmsg.ActivityCaveAdventureMoveReq();
        req.plateList = firstPath;
        NetManager.send(req, async (resp: icmsg.ActivityCaveAdventureMoveRsp) => {
          if (!cc.isValid(this.node)) return;
          if (!this.node.activeInHierarchy) return;
          this.goodsInfo.concat(resp.awardList);
          let p = new CavePathUtils()
          p.init(this.curPlate, this.pointIds, resp.newPlate);
          let pathIds = p.serachPath();
          await this.moveHero(pathIds, .5);
          this.curPlate = resp.newPlate;
          doorHandle(doorPath);
        }, this);
      }
      else {
        this._reqMove(pathIds);
      }
    }
  }

  _reqMove(path: number[]) {
    this.mask.active = true;
    let req = new icmsg.ActivityCaveAdventureMoveReq();
    req.plateList = path;
    NetManager.send(req, async (resp: icmsg.ActivityCaveAdventureMoveRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this.goodsInfo = resp.awardList;
      let pathUtils = new CavePathUtils();
      pathUtils.init(this.curPlate, this.pointIds, resp.newPlate);
      let pathIds = pathUtils.serachPath();
      await this.moveHero(pathIds, .5);
      if (this.goodsInfo && this.goodsInfo.length > 0) {
        GlobalUtil.openRewadrView(this.goodsInfo);
        this.goodsInfo = [];
      }
      this.mask.active = false;
      this.curPlate = resp.newPlate;
    }, this);
  }

  async moveHero(path: number[], dt: number) {
    return new Promise(async (resolve, reject) => {
      console.log(path);
      let plate = path.shift();
      let pointInfo = this.actModel.cavePointMapByPlate[plate];
      this.hero.setPosition(pointInfo.mapPos.x, pointInfo.mapPos.y + this.tileSize.height / 2);
      while (path.length > 0) {
        await this.singleMoveAni(path.shift(), dt);
      }
      resolve(true);
    });
  }

  async singleMoveAni(targetId: number, dt: number) {
    return new Promise((resolve, reject) => {
      let pointInfo = this.actModel.cavePointMapByPlate[targetId];
      this.hero.scaleX = pointInfo.mapPos.x > this.hero.x ? 1 : -1;
      this.hero.runAction(cc.sequence(
        cc.moveTo(dt, pointInfo.mapPos.x, pointInfo.mapPos.y + this.tileSize.height / 2),
        cc.callFunc(() => {
          gdk.e.emit(ActivityEventId.ACTIVITY_CAVE_TRIGGER_PASS_EVENT, targetId);
          resolve(true);
        })
      ))
    });
  }
}
