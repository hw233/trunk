import AdventureMainViewCtrl from './AdventureMainViewCtrl';
import AdventureModel, { AdvPointInfo } from '../model/AdventureModel';
import AdventurePointCtrl from './AdventurePointCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';


const { ccclass, property, menu } = cc._decorator;
/**
 * @Description: 探险主界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-21 14:37:59
 */
@ccclass
@menu("qszc/view/adventure/AdventureMapCtrl")
export default class AdventureMapCtrl extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;   //map图片

    @property(cc.Prefab)
    pointItem: cc.Prefab = null; //据点

    viewCtrl: AdventureMainViewCtrl;
    mapLayer: cc.TiledLayer;

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {

    }

    onDisable() {
        GlobalUtil.setLocal(
            'adventure_fight_pos#' + this.viewCtrl.advCfg.difficulty + "#" + this.viewCtrl.advCfg.layer_id, {
            x: this.node.x,
            y: this.node.y,
        });

    }

    initMap(ctrl: any, tmx: cc.TiledMapAsset) {
        this.tiledMap.tmxAsset = null
        this.viewCtrl = ctrl;
        this.tiledMap.tmxAsset = tmx;
        this.mapLayer = this.tiledMap.getLayer("地表")
        gdk.Timer.callLater(this, this._initPoints);
    }


    _initPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let pointLayer = this.tiledMap.getObjectGroup("points");
        let obj: { [key: string]: boolean } = {};
        let points = pointLayer.getObjects()
        this.adventureModel.platePoints = {}
        this.adventureModel.platePointsCtrl = {}
        let advPoints = this.adventureModel.platePoints
        for (let i = 0, n = points.length; i < n; i++) {
            let p = points[i];
            let index = parseInt(p.name);
            let pos = this._getTilePos(p.offset);
            let tilePos = this._getRealTilePos(index);
            let key = `${pos.x}-${pos.y}`;
            if (obj[key]) {
                CC_DEBUG && cc.error('据点重复', p);
                continue;
            }
            obj[key] = true;
            let info: AdvPointInfo = {
                index: index,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
                tilePos: tilePos
            };
            advPoints[index] = info
        }

        let p = GlobalUtil.getLocal('adventure_fight_pos#' + this.viewCtrl.advCfg.difficulty + "#" + this.viewCtrl.advCfg.layer_id);
        if (!p || this.adventureModel.plateIndex == 0) {
            p = { x: -450, y: -640 };
        }
        this.node.setPosition(p.x, p.y);
        // 创建战斗节点
        gdk.Timer.callLater(this, this.createPoint);
    }

    createPoint() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.mapLayer.node.removeAllChildren()
        let model = this.adventureModel;
        let advPoints = model.platePoints;
        let tileSize = this.tiledMap.getTileSize();
        for (let key in advPoints) {
            let info: AdvPointInfo = advPoints[key];
            let node: cc.Node = cc.instantiate(this.pointItem);
            let ctrl = node.getComponent(AdventurePointCtrl);
            ctrl.updatePointInfo(info);
            node.setPosition(info.mapPoint.x, info.mapPoint.y + 35);//
            model.platePointsCtrl[key] = ctrl;
            this.mapLayer.addUserNode(node)
        }
        this.viewCtrl.refreshPoints();

    }

    /*清除没有走过的台子*/
    clearHistoryPlate() {
        let layer: cc.TiledLayer = this.tiledMap.getLayer("地表")
        let layer2: cc.TiledLayer = this.tiledMap.getLayer("地表2")
        //空白地块
        let gid = layer.getTileGIDAt(0, 0)
        let whiteGid = layer.getTileGIDAt(2, 14)
        let blackGid = layer2.getTileGIDAt(2, 14)
        let points = this.adventureModel.platePoints
        let historyPlate = this.adventureModel.historyPlate
        let curPoint = this.adventureModel.platePoints[this.adventureModel.plateIndex]
        for (let key in points) {
            let index = parseInt(key)
            let tilePos = points[key].tilePos

            if (historyPlate.indexOf(index) != -1 || index == 99) {
                layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
            } else {
                layer.setTileGIDAt(blackGid, tilePos.x, tilePos.y)
            }

            if (historyPlate.indexOf(index) == -1 && (index < this.adventureModel.plateIndex && curPoint.tilePos.y != tilePos.y) && index != this.adventureModel.lastPlate) {
                layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
            }


        }

        //清除同层的台子
        for (let key in points) {
            let index = parseInt(key)
            let tilePos = points[key].tilePos
            if (curPoint.tilePos.y == tilePos.y) {
                if (index != this.adventureModel.plateIndex) {
                    let ctrl: AdventurePointCtrl = this.adventureModel.platePointsCtrl[key]
                    if (this.adventureModel.isFirstEnter) {
                        layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
                    } else {
                        ctrl.playerMissEffect(() => {
                            layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
                        })
                    }
                }
            }
        }
        this.adventureModel.isFirstEnter = false
    }

    //将像素坐标转化为瓦片坐标
    _getTilePos(offset: cc.Vec2) {
        let x = Math.round(offset.x / 88);
        let y = Math.round(offset.y / 117);
        return cc.v2(x, y);
    }

    /**计算坐标点的方式不对，暂时以这种方法实现 */
    _getRealTilePos(index) {
        let points = [
            [2, 14],
            [1, 13], [2, 13],
            [1, 12], [2, 12], [3, 12],
            [1, 11], [2, 11],
            [1, 10], [2, 10], [3, 10],
            [1, 9], [2, 9],
            [1, 8], [2, 8], [3, 8],
            [1, 7], [2, 7],
            [1, 6], [2, 6], [3, 6],
            [1, 5], [2, 5],
            [2, 4]
        ]
        if (index == 99) {
            return cc.v2(2, 2)
        }
        return cc.v2(points[index][0], points[index][1])
    }
}