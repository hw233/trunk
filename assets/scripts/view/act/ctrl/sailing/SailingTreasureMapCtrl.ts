import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import SailingBoxCtrl from './SailingBoxCtrl';
import SailingModel, { SailingPointInfo } from '../../model/SailingModel';
import SailingPointCtrl from './SailingPointCtrl';
import SailingTreasurePanelCtrl from './SailingTreasurePanelCtrl';
import { Sailing_mapCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/sailing/SailingTreasureMapCtrl")
export default class SailingTreasureMapCtrl extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;   //map图片

    @property(cc.Prefab)
    boxItem: cc.Prefab = null; //据点

    @property(cc.Prefab)
    pointItem: cc.Prefab = null; //据点

    viewCtrl: SailingTreasurePanelCtrl;
    mapLayer: cc.TiledLayer;
    boxLayer: cc.Node;
    pathLayer: cc.Node

    _scaleNum = 0.5

    get sailingModel(): SailingModel { return ModelManager.get(SailingModel); }

    onDisable() {
        this.mapLayer = null;
        this.viewCtrl = null;
        this.boxLayer = null
        this.pathLayer = null
    }

    initMap(ctrl: SailingTreasurePanelCtrl, tmx: cc.TiledMapAsset) {
        this.viewCtrl = ctrl;
        this.tiledMap.tmxAsset = tmx;
        this.mapLayer = this.tiledMap.getLayers()[0];
        this.boxLayer = cc.instantiate(new cc.Node);
        this.boxLayer.setAnchorPoint(0);
        this.mapLayer.node.addChild(this.boxLayer);

        this.pathLayer = cc.instantiate(new cc.Node);
        this.pathLayer.setAnchorPoint(0);
        this.mapLayer.node.addChild(this.pathLayer);

        this.node.scale = this._scaleNum;
        gdk.Timer.callLater(this, this._initPoints);
    }

    resetSize() {
        this.tiledMap.node.scale = this._scaleNum
        this.tiledMap.node.width = this.mapLayer.node.width * this._scaleNum
        this.tiledMap.node.height = this.mapLayer.node.height * this._scaleNum
    }

    _initPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let pointLayer = this.tiledMap.getObjectGroup("points");
        let pointDatas = this.sailingModel.pointDatas = {}
        let points = pointLayer.getObjects();
        let obj: { [key: string]: boolean } = {};
        for (let i = 0, n = points.length; i < n; i++) {
            let p = points[i];
            let pos = this._getTilePosByMapPos(cc.v2(p.x, p.y));
            let key = `${pos.x}-${pos.y}`;
            if (obj[key]) {
                CC_DEBUG && cc.error('据点重复', p);
                continue;
            }
            obj[key] = true;
            let type = parseInt(p.name);
            let plateCfg = ConfigManager.getItemByField(Sailing_mapCfg, "map_id", 1001, { type: this.sailingModel.activityType, plate: type })
            let info: SailingPointInfo = {
                id: p.id,
                type: type,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
                cfg: plateCfg
            };
            if (pointDatas[type]) {
                pointDatas[type].push(info)
            } else {
                pointDatas[type] = []
                pointDatas[type].push(info)
            }
        }
        // 创建战斗节点
        gdk.Timer.callLater(this, this.createPoint);
    }

    createPoint() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let pointDatas = this.sailingModel.pointDatas;
        let tileSize = this.tiledMap.getTileSize();
        for (let key in pointDatas) {
            let infos: SailingPointInfo[] = pointDatas[key];
            let x = 0
            let y = 0
            for (let i = 0; i < infos.length; i++) {
                let info = infos[i]
                let node: cc.Node = cc.instantiate(this.pointItem);
                let ctrl = node.getComponent(SailingPointCtrl);
                ctrl.initInfo(info);
                node.setPosition(info.mapPoint.x, info.mapPoint.y + tileSize.height / 2);
                this.sailingModel.pointCtrlMap[key] = ctrl;
                this.mapLayer.addUserNode(node)

                x += info.mapPoint.x
                y += info.mapPoint.y
            }

            if (infos[0].type > 0) {
                let node: cc.Node = cc.instantiate(this.boxItem);
                let boxCtrl = node.getComponent(SailingBoxCtrl)
                this.sailingModel.boxCtrlMap[key] = boxCtrl
                boxCtrl.updateInfo(infos[0])
                node.setPosition(x / infos.length, y / infos.length + this.tiledMap.getTileSize().height / 2);
                this.boxLayer.addChild(node)
            }
        }
        this.viewCtrl.refreshPoints();
    }

    /**地图坐标转换 瓦片坐标 */
    _getTilePosByMapPos(pos) {
        let width = this.tiledMap.getTileSize().width
        let heigth = this.tiledMap.getTileSize().height

        var a = width / Math.sqrt(3);
        var x = pos.x, y = (this.tiledMap.node.height - pos.y) / heigth * a * 2 + a / 2;    // 加 a / 2 是因为矩形网格计算时会在底部增加 a / 2

        //位于矩形网格边线上的三个CELL中心点
        var points = new Array(cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0));
        //当前距离的平方
        var dist;
        //      index:被捕获的索引
        var i, index;
        //二分之根号3 边长的平方，如果距离比它还小，就必然捕获
        var g_MinDistance2 = Math.pow(a * Math.sqrt(3) / 2, 2);
        // 网格宽、高
        var g_unitx = a * Math.sqrt(3);     //sqrt(3) * a
        var g_unity = a * 1.5;              //a * 3 / 2
        // 网格对角线平方向上取整
        var mindist = Math.ceil(Math.pow(g_unitx, 2) + Math.pow(g_unity, 2));
        //计算出鼠标点位于哪一个矩形网格中
        var cx = Math.floor(x / g_unitx);
        var cy = Math.floor(y / g_unity);

        points[0].x = Math.floor(g_unitx * cx);
        points[1].x = Math.floor(g_unitx * (cx + 0.5));
        points[2].x = Math.floor(g_unitx * (cx + 1));
        //根据cy是否是偶数，决定三个点的纵坐标
        if (cy % 2 == 0) {
            //偶数时，三个点组成倒立三角
            points[0].y = points[2].y = Math.floor(g_unity * cy);
            points[1].y = Math.floor(g_unity * (cy + 1));
        }
        else {
            //奇数时，三个点组成正立三角
            points[0].y = points[2].y = Math.floor(g_unity * (cy + 1));
            points[1].y = Math.floor(g_unity * cy);
        }

        // 计算两点间距离的平方
        function distance2(x1, y1, x2, y2) {
            return ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        }

        //现在找出鼠标距离哪一个点最近
        for (i = 0; i < 3; ++i) {
            //求出距离的平方
            dist = distance2(x, y, points[i].x, points[i].y);

            //如果已经肯定被捕获
            if (dist < g_MinDistance2) {
                index = i;
                break;
            }

            //更新最小距离值和索引
            if (dist < mindist) {
                mindist = dist;
                index = i;
            }
        }

        // x 第 0 个点的列值减 1 等于cell.x ( x 最左半格有 -1 值 )
        // cy 偶数时中间点 + 1，奇数时两边点 + 1，减 1 是因为初始为了计算方便 y 补了 a / 2 ( y 最上半格 也会存在 -1 )
        return cc.v2(cx - (index > 0 ? 0 : 1), cy + (cy % 2 + index % 2) % 2 - 1)
    }

}