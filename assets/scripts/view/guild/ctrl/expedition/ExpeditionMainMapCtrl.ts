import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionCityCtrl from './ExpeditionCityCtrl';
import ExpeditionMainViewCtrl from './ExpeditionMainViewCtrl';
import ExpeditionModel, { ExpeditionCityInfo } from './ExpeditionModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import { Expedition_mapCfg, Map_expeditionCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionMainMapCtrl")
export default class ExpeditionMainMapCtrl extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;   //map图片

    @property(cc.Prefab)
    cityItem: cc.Prefab = null; //据点

    viewCtrl: ExpeditionMainViewCtrl;
    mapLayer: cc.TiledLayer;
    mapCfg: Map_expeditionCfg;
    cityLayer: cc.Node;

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    onDisable() {
        if (this.mapCfg) {
            GlobalUtil.setLocal(
                '_expedition_main_pos#' + this.mapCfg.id, {
                x: this.node.x,
                y: this.node.y,
            });
        }
        this.mapLayer = null;
        this.mapCfg = null;
        this.viewCtrl = null;
        this.cityLayer = null
    }

    initMap(ctrl: ExpeditionMainViewCtrl, tmx: cc.TiledMapAsset) {
        this.mapCfg = ConfigManager.getItemById(Map_expeditionCfg, ctrl.mainMapId);
        this.viewCtrl = ctrl;
        this.tiledMap.tmxAsset = tmx;
        this.mapLayer = this.tiledMap.getLayers()[0];
        this.cityLayer = cc.instantiate(new cc.Node);
        this.cityLayer.setAnchorPoint(0);
        this.mapLayer.node.addChild(this.cityLayer);
        this.node.scale = 0.8;
        gdk.Timer.callLater(this, this._initPoints);
    }

    resetSize() {
        this.tiledMap.node.scale = 0.8
        this.tiledMap.node.width = this.mapLayer.node.width * 0.8
        this.tiledMap.node.height = this.mapLayer.node.height * 0.8
    }

    _initPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let pointLayer = this.tiledMap.getObjectGroup("points");
        let cityMap = this.expeditionModel.cityMap = {}
        let points = pointLayer.getObjects();
        let obj: { [key: string]: boolean } = {};
        for (let i = 0, n = points.length; i < n; i++) {
            let p = points[i];
            let pos = this._getTilePos(p.offset);
            let key = `${pos.x}-${pos.y}`;
            if (obj[key]) {
                CC_DEBUG && cc.error('据点重复', p);
                continue;
            }
            obj[key] = true;
            let type = parseInt(p.name);
            let mapCfg = ConfigManager.getItemByField(Expedition_mapCfg, "map_id", type, { type: this.expeditionModel.activityType })
            let info: ExpeditionCityInfo = {
                id: p.id,
                type: type,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
                cfg: mapCfg
            };
            cityMap[key] = info;
        }

        if (this.expeditionModel.isEnterCity) {
            let p = GlobalUtil.getLocal('_expedition_main_pos#' + this.mapCfg.id);
            if (p) {
                this.node.setPosition(p.x, p.y);
            }
        } else {
            let datas = this.expeditionModel.expeditionMaps
            let mapId = datas[datas.length - 1].mapId
            for (let i = 0; i < datas.length; i++) {
                if (!datas[i].isClear) {
                    mapId = datas[i].mapId
                    break
                }
            }
            for (let key in this.expeditionModel.cityMap) {
                let info = this.expeditionModel.cityMap[key]
                if (info.cfg.map_id == mapId) {
                    let n = this.viewCtrl.node as cc.Node;
                    let s = this.tiledMap.getTileSize();
                    let h = n.height * n.anchorY;
                    let w = n.width * n.anchorX;
                    let y = Math.min(0, -info.mapPoint.y + h)
                    this.node.setPosition((-info.mapPoint.x - w + s.width * 3) * 0.8, (y - h - s.height) * 0.8)
                    break
                }
            }
        }
        // 创建战斗节点
        gdk.Timer.callLater(this, this.createPoint);
    }

    createPoint() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let cityMap = this.expeditionModel.cityMap;
        let tileSize = this.tiledMap.getTileSize();
        for (let key in cityMap) {
            let info: ExpeditionCityInfo = cityMap[key];
            let node: cc.Node = cc.instantiate(this.cityItem);
            let ctrl = node.getComponent(ExpeditionCityCtrl);
            ctrl.initInfo(info);
            node.setPosition(info.mapPoint.x, info.mapPoint.y + tileSize.height / 2);
            this.expeditionModel.cityCtrlMap[key] = ctrl;
            this.cityLayer.addChild(node)
        }
        this.viewCtrl.refreshPoints();
    }

    //将像素坐标转化为瓦片坐标
    _getTilePos(offset: cc.Vec2) {
        let x = Math.round(offset.x / this.mapCfg.tw);
        let y = Math.round(offset.y / this.mapCfg.th);
        let pos = new icmsg.ExpeditionPos()
        pos.x = x
        pos.y = y
        return pos
    }
}