import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionLayerViewCtrl from './ExpeditionLayerViewCtrl';
import ExpeditionModel, { ExpeditionPointInfo } from './ExpeditionModel';
import ExpeditionPointCtrl from './ExpeditionPointCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import { Expedition_pointCfg, Map_expeditionCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionLayerMapCtrl")
export default class ExpeditionLayerMapCtrl extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;   //map图片

    @property(cc.Prefab)
    pointItem: cc.Prefab = null; //据点


    viewCtrl: ExpeditionLayerViewCtrl;
    mapLayer: cc.TiledLayer;
    mapCfg: Map_expeditionCfg;
    pointLayer: cc.Node;

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    onDisable() {
        if (this.mapCfg) {
            GlobalUtil.setLocal(
                '_expedition_layer_pos#' + this.mapCfg.id, {
                x: this.node.x,
                y: this.node.y,
            });
        }
        this.mapLayer = null;
        this.mapCfg = null;
        this.viewCtrl = null;
        this.pointLayer = null
    }

    initMap(ctrl: ExpeditionLayerViewCtrl, tmx: cc.TiledMapAsset) {
        this.mapCfg = ConfigManager.getItemById(Map_expeditionCfg, ctrl.mapCfg.map_id);
        this.viewCtrl = ctrl;
        this.tiledMap.tmxAsset = tmx;
        this.mapLayer = this.tiledMap.getLayers()[0];
        this.mapLayer.node.removeAllChildren()
        this.pointLayer = cc.instantiate(new cc.Node);
        this.pointLayer.setAnchorPoint(0);
        this.mapLayer.node.addChild(this.pointLayer);
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
        let pointMap = this.expeditionModel.pointMap = {}
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
            let tilePos = p.tilePos ? JSON.parse(p.tilePos) : []
            let show = p.show ? JSON.parse(p.show) : []
            let cfg = ConfigManager.getItemByField(Expedition_pointCfg, "map_id", this.viewCtrl.mapCfg.map_id, { point_type: type, type: this.expeditionModel.activityType })
            let info: ExpeditionPointInfo = {
                id: p.id,
                type: type,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
                cfg: cfg,
                info: null,
                tilePos: tilePos,
                extInfo: { show: show },
            };
            pointMap[key] = info;
        }

        let p = GlobalUtil.getLocal('_expedition_layer_pos#' + this.mapCfg.id);
        if (p) {
            this.node.setPosition(p.x, p.y);
        }

        // 创建战斗节点
        gdk.Timer.callLater(this, this.createPoint);
    }

    createPoint() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let pointMap = this.expeditionModel.pointMap;
        let tileSize = this.tiledMap.getTileSize();
        for (let key in pointMap) {
            let info: ExpeditionPointInfo = pointMap[key];
            let node: cc.Node = cc.instantiate(this.pointItem);
            let ctrl = node.getComponent(ExpeditionPointCtrl);
            ctrl.initInfo(info);
            node.setPosition(info.mapPoint.x, info.mapPoint.y + tileSize.height / 2);
            this.expeditionModel.pointCtrlMap[key] = ctrl;
            this.pointLayer.addChild(node);
        }


        this.hideTargetBlock()

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



    /**隐藏 传送门连接的地块 */
    hideTargetBlock() {
        if (this.mapCfg.id == 10015) {
            let layer: cc.TiledLayer = this.tiledMap.getLayer("地表")
            let hideGid = layer.getTileGIDAt(0, 0)//空白地块
            let pointMap = this.expeditionModel.pointMap
            let tilePointMap = this.expeditionModel.tilePointMap
            //隐藏所有
            for (let key in pointMap) {
                let point = pointMap[key]
                if (point.tilePos.length > 0) {
                    let x = point.tilePos[0]
                    let y = point.tilePos[1]
                    layer.setTileGIDAt(hideGid, x, y)
                    tilePointMap[`${x}-${y}`] = point
                    let ctrl = this.expeditionModel.pointCtrlMap[key];
                    ctrl.node.active = false
                }
            }
        }
    }


    /**展示地块 */
    showTargetBlock() {
        if (this.mapCfg.id == 10015) {
            let layer: cc.TiledLayer = this.tiledMap.getLayer("地表")
            let showGid = layer.getTileGIDAt(2, 22)//白色地块
            let pointMap = this.expeditionModel.pointMap
            let tilePointMap = this.expeditionModel.tilePointMap
            let pointCtrlMap = this.expeditionModel.pointCtrlMap
            let events = this.expeditionModel.expeditionEvents
            for (let i = 0; i < events.length; i++) {
                let pos = events[i].pos
                let point = pointMap[`${pos.x}-${pos.y}`]
                if (point && point.info && (point.info.progress == point.cfg.stage_id2.length + 1)) {
                    let posList = point.extInfo.show
                    for (let j = 0; j < posList.length; j++) {
                        let x = posList[j][0]
                        let y = posList[j][1]
                        let blockPoint = tilePointMap[`${x}-${y}`]
                        let ctrl = pointCtrlMap[`${blockPoint.pos.x}-${blockPoint.pos.y}`]
                        layer.setTileGIDAt(showGid, x, y)
                        ctrl.node.active = true

                    }
                }
            }

            for (let key in pointMap) {
                let point = pointMap[key]
                if (point && point.info && point.type < 10 && (point.info.progress == point.cfg.stage_id2.length + 1)) {
                    let posList = point.extInfo.show
                    for (let j = 0; j < posList.length; j++) {
                        let x = posList[j][0]
                        let y = posList[j][1]
                        let blockPoint = tilePointMap[`${x}-${y}`]
                        let ctrl = pointCtrlMap[`${blockPoint.pos.x}-${blockPoint.pos.y}`]
                        layer.setTileGIDAt(showGid, x, y)
                        ctrl.node.active = true
                    }
                }
            }
        }
    }

}