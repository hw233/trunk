import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import RelicHoldCityPointCtrl from './RelicHoldCityPointCtrl';
import RelicHoldPointCtrl from './RelicHoldPointCtrl';
import RelicModel, { RelicCityInfo } from '../model/RelicModel';
import RelicUtils from '../utils/RelicUtils';
import { Map_relicCfg, Relic_pointCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-25 17:26:44 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicTiledMapCtrl")
export default class RelicTiledMapCtrl extends cc.Component {
    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;   //map图片

    @property(cc.Prefab)
    pointItem: cc.Prefab = null; //据点

    @property(cc.Prefab)
    cityPointItem: cc.Prefab = null; //城池据点

    viewCtrl: any;
    mapCfg: Map_relicCfg;
    mapLayer: cc.TiledLayer;
    cityLayer: cc.Node;
    cb: Function;

    get RelicModel(): RelicModel { return ModelManager.get(RelicModel); }

    onDisable() {
        this.mapLayer.node.removeChild(this.cityLayer);
        this.mapLayer = null;
        this.viewCtrl = null;
        this.cityLayer = null
        this.cb = null;
    }

    initMap(ctrl: any, tmx: cc.TiledMapAsset, cb?: Function) {
        this.viewCtrl = ctrl;
        this.tiledMap.tmxAsset = tmx;
        cb && (this.cb = cb);
        this.mapCfg = ConfigManager.getItemById(Map_relicCfg, this.RelicModel.mapId);
        this.mapLayer = this.tiledMap.getLayers()[0];
        this.cityLayer = cc.instantiate(new cc.Node);
        this.cityLayer.setAnchorPoint(0);
        this.mapLayer.node.addChild(this.cityLayer);
        this.node.scale = 0.8;
        this.RelicModel.cityMap = {};
        this.RelicModel.pointMap = {};
        gdk.Timer.callLater(this, this._initPoints);
    }

    resetSize() {
        this.tiledMap.node.scale = 0.8
        this.tiledMap.node.width = this.mapLayer.node.width * 0.8
        this.tiledMap.node.height = this.mapLayer.node.height * 0.8
    }

    //cities为具体每个操作块
    _initPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let m = this.RelicModel;
        m.pointMap = {};
        let pointLayer = this.tiledMap.getObjectGroup("cities");
        let points = pointLayer.getObjects();
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let pos = this._getTilePos(p.offset);
            let key = `${pos.x}-${pos.y}`;
            let id = parseInt(p.name);
            if (!m.cityMap[id]) {
                //城池信息
                let info: RelicCityInfo = {
                    cityId: id,
                    pointType: null,
                    cfg: null,
                    points: [cc.v2(p.x, p.y)],
                    cityPos: null,
                    numType: null,
                }
                m.cityMap[id] = info;
            }
            else {
                m.cityMap[id].points.push(cc.v2(p.x, p.y));
            }
            //点信息
            let numType = RelicUtils.getNumTypeByPos(this.RelicModel.mapId, pos);
            m.pointMap[key] = {
                ownerCity: id,
                numType: numType,
                point: pos,
                mapPoint: cc.v2(p.x, p.y)
            };
            m.cityMap[id].numType = numType;
        }
        this._initCities();
    }

    //points仅为据点样式展示
    _initCities() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let m = this.RelicModel;
        let cityLayer = this.tiledMap.getObjectGroup("points");
        let city = cityLayer.getObjects();
        for (let i = 0; i < city.length; i++) {
            let p = city[i];
            let pos = this._getTilePos(p.offset);
            let key = `${pos.x}-${pos.y}`;
            let type = parseInt(p.name);
            m.cityMap[m.pointMap[key].ownerCity].pointType = type;
            m.cityMap[m.pointMap[key].ownerCity].cfg = ConfigManager.getItemById(Relic_pointCfg, type);
        }
        // 创建战斗节点
        gdk.Timer.callLater(this, this.createPoint);
    }

    createPoint() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let m = this.RelicModel;
        let tileSize = this.tiledMap.getTileSize();
        //point
        for (let key in m.pointMap) {
            let info = m.pointMap[key];
            let item = cc.instantiate(this.pointItem);
            this.mapLayer.addUserNode(item);
            item.setScale(1);
            item.setPosition(info.mapPoint.x, info.mapPoint.y + tileSize.height / 2);
            let ctrl = item.getComponent(RelicHoldPointCtrl);
            ctrl.initInfo(info);
        }

        //city
        for (let key in m.cityMap) {
            let info = m.cityMap[key];
            let item = cc.instantiate(this.cityPointItem);
            item.parent = this.cityLayer;
            let points = info.points
            let x = 0
            let y = 0
            for (let i = 0; i < points.length; i++) {
                x += points[i].x
                y += points[i].y
            }
            item.setScale(1);
            item.setPosition(x / points.length, y / points.length + this.tiledMap.getTileSize().height / 2);
            info.cityPos = item.position;
            let ctrl = item.getComponent(RelicHoldCityPointCtrl);
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
