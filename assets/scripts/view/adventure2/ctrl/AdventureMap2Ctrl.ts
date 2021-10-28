import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../model/NewAdventureModel';
import NewAdventurePointCtrl from './NewAdventurePointCtrl';
import { Adventure2_adventureCfg, Map_adventureCfg } from '../../../a/config';
import { AdvPointInfo } from '../../adventure/model/AdventureModel';



const { ccclass, property, menu } = cc._decorator;
/**
 * @Description: 探险主界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-02 15:06:57
 */
@ccclass
@menu("qszc/view/adventure2/AdventureMap2Ctrl")
export default class AdventureMap2Ctrl extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;   //map图片

    @property(cc.Prefab)
    pointItem: cc.Prefab = null; //据点

    viewCtrl: AdventureMainView2Ctrl;
    mapLayer: cc.TiledLayer;
    mapCfg: Map_adventureCfg;

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    onEnable() {
        this.adventureModel.copyType = 0;
    }

    onDisable() {
        GlobalUtil.setLocal(
            'adventure_fight_pos#' + this.viewCtrl.advCfg.difficulty + "#" + this.viewCtrl.advCfg.layer_id, {
            x: this.node.x,
            y: this.node.y,
        });

        gdk.Timer.clearAll(this)

    }

    initMap(ctrl: any, tmx: cc.TiledMapAsset) {
        this.tiledMap.tmxAsset = null
        this.viewCtrl = ctrl;
        this.tiledMap.tmxAsset = tmx;
        this.mapLayer = this.tiledMap.getLayer("地表")
        let advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", this.adventureModel.difficulty, { layer_id: this.adventureModel.normal_layerId })
        this.mapCfg = ConfigManager.getItemById(Map_adventureCfg, advCfg.map_id);
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
        if (!p || this.adventureModel.normal_plateIndex == 0) {
            p = { x: -600, y: -640 };
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
            let ctrl = node.getComponent(NewAdventurePointCtrl);
            ctrl.updatePointInfo(info);
            node.setPosition(info.mapPoint.x, info.mapPoint.y + 35);//
            model.platePointsCtrl[key] = ctrl;
            this.mapLayer.addUserNode(node)
        }
        let len = ConfigManager.getItems(Adventure2_adventureCfg, { difficulty: this.adventureModel.difficulty, layer_id: this.adventureModel.normal_layerId }).length
        if (this.adventureModel.normal_plateIndex == len - 1 && this.adventureModel.normal_plateFinish) {
            let temCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, 'difficulty', this.adventureModel.difficulty + 1)
            if (temCfg) {
                this.adventureModel.isShowFinishTip = true
            }
        }
        this.viewCtrl.refreshPoints();

    }

    /*清除没有走过的台子*/
    clearHistoryPlate() {
        let layer: cc.TiledLayer = this.tiledMap.getLayer("地表")
        let layer2: cc.TiledLayer = this.tiledMap.getLayer("地表2")
        //空白地块
        let gid = layer.getTileGIDAt(0, 0)
        let whiteGid = layer.getTileGIDAt(3, 2)
        let blackGid = layer2.getTileGIDAt(3, 2)
        let points = this.adventureModel.platePoints
        let historyPlate = this.adventureModel.normal_historyPlate
        let curPoint = this.adventureModel.platePoints[this.adventureModel.normal_plateIndex]
        for (let key in points) {
            let index = parseInt(key)
            let tilePos = points[key].tilePos

            // if (historyPlate.indexOf(index) != -1 || index == 99) {
            //     layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
            // } else {
            //     layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
            // }
            //historyPlate.indexOf(index) == -1 &&
            if (index < this.adventureModel.normal_plateIndex && curPoint.tilePos.y != tilePos.y) {
                if (index == this.adventureModel.normal_lastPlate && !this.adventureModel.normal_plateFinish) {
                    layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
                } else {
                    if (this.adventureModel.showLastLine && this.adventureModel.normal_lastPlates.indexOf(index) >= 0) {
                        layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
                    } else {
                        layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
                    }
                }
            }
            else {
                //判断是否需要显示出现特效
                if (this.adventureModel.showEffect && curPoint.tilePos.y != tilePos.y) {
                    let lastPos = points[this.adventureModel.showLastPlateIndex].tilePos
                    if (tilePos.y < curPoint.tilePos.y && tilePos.y >= lastPos.y) {
                        let ctrl: NewAdventurePointCtrl = this.adventureModel.platePointsCtrl[key]
                        let timeNum = 300 * Math.abs(lastPos.y - tilePos.y) + 5 * tilePos.x
                        gdk.Timer.once(timeNum, this, () => {
                            ctrl.playerShowEffect(() => {
                                layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
                            })
                        })
                        cc.log(timeNum + '--------------------------------->' + tilePos.x + '--------' + tilePos.y)
                    } else {
                        layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
                    }
                } else {
                    layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
                }
            }


        }

        //清除同层的台子
        for (let key in points) {
            let index = parseInt(key)
            let tilePos = points[key].tilePos
            if (curPoint.tilePos.y == tilePos.y) {
                if (index != this.adventureModel.normal_plateIndex) {
                    if (this.adventureModel.showLastLine && this.adventureModel.normal_lastPlates.indexOf(index) >= 0) {
                        layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
                    } else {
                        let ctrl: NewAdventurePointCtrl = this.adventureModel.platePointsCtrl[key]
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
        }
        this.adventureModel.isFirstEnter = false;
        this.adventureModel.showEffect = false;
    }

    //将像素坐标转化为瓦片坐标
    _getTilePos(offset: cc.Vec2) {
        let x = Math.round(offset.x / 88);
        let y = Math.round(offset.y / 117);
        // let x = Math.round(offset.x / this.mapCfg.tw);
        // let y = Math.round(offset.y / this.mapCfg.th);
        return cc.v2(x, y);
    }

    /**计算坐标点的方式不对，暂时以这种方法实现 */
    _getRealTilePos(index) {
        let points = [
            [3, 20],
            [2, 19], [3, 19],
            [2, 18], [3, 18], [4, 18],
            [2, 17], [3, 17],
            [2, 16], [3, 16], [4, 16],
            [1, 15], [2, 15], [3, 15], [4, 15],
            [2, 14], [3, 14], [4, 14],
            [2, 13], [3, 13],
            [2, 12], [3, 12], [4, 12],
            [1, 11], [2, 11], [3, 11], [4, 11],
            [2, 10], [3, 10], [4, 10],
            [2, 9], [3, 9],
            [2, 8], [3, 8], [4, 8],
            [1, 7], [2, 7], [3, 7], [4, 7],
            [2, 6], [3, 6], [4, 6],
            [2, 5], [3, 5],
            [2, 4], [3, 4], [4, 4],
            [2, 3], [3, 3],
            [3, 2]
        ]
        if (index == 99) {
            return cc.v2(2, 2)
        }
        return cc.v2(points[index][0], points[index][1])
    }
}