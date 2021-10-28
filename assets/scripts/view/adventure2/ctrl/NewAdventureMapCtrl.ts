import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureMainViewCtrl from './NewAdventureMainViewCtrl';
import NewAdventureModel, { NewAdvPointInfo } from '../model/NewAdventureModel';
import NewAdventurePointCtrl from './NewAdventurePointCtrl';



const { ccclass, property, menu } = cc._decorator;
/**
 * @Description: 探险主界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-04 10:09:27
 */
@ccclass
@menu("qszc/view/adventure2/NewAdventureMapCtrl")
export default class NewAdventureMapCtrl extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;   //map图片

    @property(cc.Prefab)
    pointItem: cc.Prefab = null; //据点

    viewCtrl: NewAdventureMainViewCtrl;
    mapLayer: cc.TiledLayer;

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    onEnable() {

    }

    onDisable() {
        if (this.viewCtrl && this.viewCtrl.advCfg) {
            GlobalUtil.setLocal(
                'adventure_fight_pos#4' + "#" + this.viewCtrl.advCfg.layer_id, {
                x: this.node.x,
                y: this.node.y,
            });
        }
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
        let point0Layer = this.tiledMap.getObjectGroup("points");
        let point1Layer = this.tiledMap.getObjectGroup("point1");
        let point2Layer = this.tiledMap.getObjectGroup("point2");
        let point3Layer = this.tiledMap.getObjectGroup("point3");

        //

        let obj: { [key: string]: boolean } = {};

        let points0 = point0Layer.getObjects()
        this.adventureModel.plate0Points = {};
        this.adventureModel.plate0PointsCtrl = {};
        let advPoints0 = this.adventureModel.plate0Points;
        for (let i = 0, n = points0.length; i < n; i++) {
            let p = points0[i];
            let index = parseInt(p.name);
            let pos = this._getTilePos(p.offset);
            let tilePos = this._getRealTilePos(0, index);
            let key = `${pos.x}-${pos.y}`;
            // if (obj[key]) {
            //     CC_DEBUG && cc.error('据点重复', p);
            //     continue;
            // }
            obj[key] = true;
            let info: NewAdvPointInfo = {
                index: index,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
                tilePos: tilePos,
                line: 0
            };
            advPoints0[index] = info;
            if (index == 0) {
                this.adventureModel.endlessStartPoint = info;
            }
            if (index == 10) {
                this.adventureModel.endlessEndPoint = info;
            }
        }
        let points1 = point1Layer.getObjects()
        this.adventureModel.plate1Points = {};
        this.adventureModel.plate1PointsCtrl = {};
        let advPoints1 = this.adventureModel.plate1Points;
        for (let i = 0, n = points1.length; i < n; i++) {
            let p = points1[i];
            let index = parseInt(p.name);
            let pos = this._getTilePos(p.offset);
            let tilePos = this._getRealTilePos(1, index);
            let key = `${pos.x}-${pos.y}`;
            if (obj[key]) {
                CC_DEBUG && cc.error('据点重复', p);
                continue;
            }
            obj[key] = true;
            let info: NewAdvPointInfo = {
                index: index,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
                tilePos: tilePos,
                line: 1
            };
            advPoints1[index] = info;

        }
        advPoints1[0] = this.adventureModel.endlessStartPoint
        advPoints1[10] = this.adventureModel.endlessEndPoint


        let points2 = point2Layer.getObjects()
        this.adventureModel.plate2Points = {};
        this.adventureModel.plate2PointsCtrl = {};
        let advPoints2 = this.adventureModel.plate2Points;
        for (let i = 0, n = points2.length; i < n; i++) {
            let p = points2[i];
            let index = parseInt(p.name);
            let pos = this._getTilePos(p.offset);
            let tilePos = this._getRealTilePos(2, index);
            let key = `${pos.x}-${pos.y}`;
            if (obj[key]) {
                CC_DEBUG && cc.error('据点重复', p);
                continue;
            }
            obj[key] = true;
            let info: NewAdvPointInfo = {
                index: index,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
                tilePos: tilePos,
                line: 2
            };
            advPoints2[index] = info
        }
        advPoints2[0] = this.adventureModel.endlessStartPoint
        advPoints2[10] = this.adventureModel.endlessEndPoint

        let points3 = point3Layer.getObjects()
        this.adventureModel.plate3Points = {};
        this.adventureModel.plate3PointsCtrl = {};
        let advPoints3 = this.adventureModel.plate3Points;
        for (let i = 0, n = points3.length; i < n; i++) {
            let p = points3[i];
            let index = parseInt(p.name);
            let pos = this._getTilePos(p.offset);
            let tilePos = this._getRealTilePos(3, index);
            let key = `${pos.x}-${pos.y}`;
            if (obj[key]) {
                CC_DEBUG && cc.error('据点重复', p);
                continue;
            }
            obj[key] = true;
            let info: NewAdvPointInfo = {
                index: index,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
                tilePos: tilePos,
                line: 3
            };
            advPoints3[index] = info
        }
        advPoints3[0] = this.adventureModel.endlessStartPoint
        advPoints3[10] = this.adventureModel.endlessEndPoint

        if (this.adventureModel.endless_line > 0) {
            this.adventureModel.endlesslastLine = this.adventureModel.endless_line;
        }
        let p = GlobalUtil.getLocal('adventure_fight_pos#4' + "#" + this.viewCtrl.advCfg.layer_id);
        if (!p || this.adventureModel.endless_plateIndex == 0) {
            p = { x: -this.adventureModel.endlessStartPoint.mapPoint.x, y: -this.adventureModel.endlessStartPoint.mapPoint.y - 100 };
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

        let advPoints0 = model.plate0Points;
        //let tileSize = this.tiledMap.getTileSize();
        for (let key in advPoints0) {

            let info: NewAdvPointInfo = advPoints0[key];
            if (info.index != 0 && info.index != 10) {
                let node: cc.Node = cc.instantiate(this.pointItem);
                let ctrl = node.getComponent(NewAdventurePointCtrl);
                ctrl.updatePointInfo(info);
                node.setPosition(info.mapPoint.x, info.mapPoint.y + 35);//
                model.plate0PointsCtrl[key] = ctrl;
                this.mapLayer.addUserNode(node)
            }
        }

        let advPoints1 = model.plate1Points;
        //let tileSize = this.tiledMap.getTileSize();
        for (let key in advPoints1) {
            let info: NewAdvPointInfo = advPoints1[key];
            if (info && info.line != 0) {
                let node: cc.Node = cc.instantiate(this.pointItem);
                let ctrl = node.getComponent(NewAdventurePointCtrl);
                ctrl.updatePointInfo(info);
                node.setPosition(info.mapPoint.x, info.mapPoint.y + 35);//
                model.plate1PointsCtrl[key] = ctrl;
                this.mapLayer.addUserNode(node)
            }

        }
        let advPoints2 = model.plate2Points;
        //let tileSize = this.tiledMap.getTileSize();
        for (let key in advPoints2) {
            let info: NewAdvPointInfo = advPoints2[key];
            if (info && info.line != 0) {
                let node: cc.Node = cc.instantiate(this.pointItem);
                let ctrl = node.getComponent(NewAdventurePointCtrl);
                ctrl.updatePointInfo(info);
                node.setPosition(info.mapPoint.x, info.mapPoint.y + 35);//
                model.plate2PointsCtrl[key] = ctrl;
                this.mapLayer.addUserNode(node)
            }

        }
        let advPoints3 = model.plate3Points;
        //let tileSize = this.tiledMap.getTileSize();
        for (let key in advPoints3) {
            let info: NewAdvPointInfo = advPoints3[key];
            if (info && info.line != 0) {
                let node: cc.Node = cc.instantiate(this.pointItem);
                let ctrl = node.getComponent(NewAdventurePointCtrl);
                ctrl.updatePointInfo(info);
                node.setPosition(info.mapPoint.x, info.mapPoint.y + 35);//
                model.plate3PointsCtrl[key] = ctrl;
                this.mapLayer.addUserNode(node)
            }
        }

        this.viewCtrl.refreshPoints();

    }


    clearLineEffect() {


        //清除指挥官
        let generalNode = this.mapLayer.node.getChildByName("adv_general");
        if (generalNode) {
            this.mapLayer.node.removeChild(generalNode);
        }

        let start = this.adventureModel.plate1Points[0]
        let startPos = cc.v2(-start.mapPoint.x, -start.mapPoint.y - 100)

        let action: cc.Action = cc.speed(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(0.3, cc.v2(-520, -540)),
                    cc.scaleTo(0.3, 0.6),
                ),
                cc.callFunc(() => {
                    let curLine = this.adventureModel.endless_line
                    let layer: cc.TiledLayer = this.tiledMap.getLayer("地表")
                    let gid = layer.getTileGIDAt(0, 0)
                    let whiteGid = layer.getTileGIDAt(4, 3)
                    let line1Gid = layer.getTileGIDAt(3, 2)
                    let line2Gid = layer.getTileGIDAt(4, 1)
                    let line3Gid = layer.getTileGIDAt(6, 2)
                    let temGids = [line1Gid, line2Gid, line3Gid]
                    let temPoint = [this.adventureModel.plate1Points, this.adventureModel.plate2Points, this.adventureModel.plate3Points];
                    let temCtrls = [this.adventureModel.plate1PointsCtrl, this.adventureModel.plate2PointsCtrl, this.adventureModel.plate3PointsCtrl];

                    //设置传送门
                    let plate0Points = this.adventureModel.plate0Points;
                    let indexs = [91, 92, 93]
                    for (let i = 0; i < 3; i++) {
                        let tilePos = plate0Points[indexs[i]].tilePos;
                        layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
                    }

                    //设置终点
                    let endIndexs = [11, 12, 13]
                    for (let i = 0; i < 3; i++) {
                        let ctrl: NewAdventurePointCtrl = this.adventureModel.plate0PointsCtrl[endIndexs[i]]
                        if (ctrl) {
                            ctrl.typeIcon.active = false
                        }
                        let tilePos = plate0Points[endIndexs[i]].tilePos;
                        layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
                    }
                    //开始点
                    let startIndexs = [1, 2, 3]
                    for (let i = 0; i < 3; i++) {
                        let ctrl: NewAdventurePointCtrl = this.adventureModel.plate0PointsCtrl[startIndexs[i]]
                        if (ctrl) {
                            ctrl.typeIcon.active = false
                        }
                        let tilePos = plate0Points[startIndexs[i]].tilePos;
                        layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
                    }

                    //设置线路
                    for (let i = 0; i <= 2; i++) {
                        let points = temPoint[i]
                        let temGid = temGids[i]
                        let temCtrl: NewAdventurePointCtrl = temCtrls[i]
                        //let curPoint = this.adventureModel.platePoints[this.adventureModel.endless_plateIndex]
                        for (let key in points) {
                            //let index = parseInt(key)
                            let info: NewAdvPointInfo = points[key]
                            let tilePos = points[key].tilePos;
                            if (info.line != curLine || info.line == 0) {
                                //layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
                                //let ctrl: NewAdventurePointCtrl = this.adventureModel.platePointsCtrl[key]
                                let ctrl = temCtrl[key]
                                if (ctrl) {
                                    ctrl.typeIcon.active = false
                                    let timeNum = 200 * Math.abs(tilePos.y - 13) + 10
                                    gdk.Timer.once(timeNum, this, () => {
                                        ctrl.playerMissEffect(() => {
                                            layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
                                        })
                                    })
                                    layer.setTileGIDAt(temGid, tilePos.x, tilePos.y)
                                }

                            } else {
                                layer.setTileGIDAt(temGid, tilePos.x, tilePos.y)
                            }
                        }
                    }

                }),
                cc.delayTime(3),
                cc.spawn(
                    cc.moveTo(0.3, startPos),
                    cc.scaleTo(0.3, 1),
                ),
                cc.delayTime(1),
                cc.callFunc(() => {
                    this.viewCtrl._loadMap(this.viewCtrl.advCfg.map_id);
                })
            ),
            1,
        )
        this.node.runAction(action)

    }

    /*清除没有走过的台子*/
    clearHistoryPlate() {
        let layer: cc.TiledLayer = this.tiledMap.getLayer("地表")
        let layer2: cc.TiledLayer = this.tiledMap.getLayer("地表2")
        //空白地块
        let gid = layer.getTileGIDAt(0, 0)
        let whiteGid = layer.getTileGIDAt(4, 3)
        let line1Gid = layer.getTileGIDAt(3, 2)
        let line2Gid = layer.getTileGIDAt(4, 1)
        let line3Gid = layer.getTileGIDAt(6, 2)

        //let points = this.adventureModel.platePoints

        //设置传送门
        let plate0Points = this.adventureModel.plate0Points;
        let indexs = [91, 92, 93]
        for (let i = 0; i < 3; i++) {
            let tilePos = plate0Points[indexs[i]].tilePos;
            if (this.adventureModel.endless_line != 0) {
                layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
            } else {
                switch (indexs[i]) {
                    case 91:
                        layer.setTileGIDAt(line1Gid, tilePos.x, tilePos.y)
                        break;
                    case 92:
                        layer.setTileGIDAt(line2Gid, tilePos.x, tilePos.y)
                        break;
                    case 93:
                        layer.setTileGIDAt(line3Gid, tilePos.x, tilePos.y)
                        break;
                }
            }
        }

        //设置线路
        let temPoint = [this.adventureModel.plate1Points, this.adventureModel.plate2Points, this.adventureModel.plate3Points]
        let temGids = [line1Gid, line2Gid, line3Gid]
        let curPoint
        let curLine = this.adventureModel.endless_line
        if (curLine > 0) {
            curPoint = temPoint[curLine - 1][this.adventureModel.endless_plateIndex]
        }
        for (let i = 0; i <= 2; i++) {
            let points = temPoint[i]
            let temGid = temGids[i]
            //let curPoint = this.adventureModel.platePoints[this.adventureModel.endless_plateIndex]
            for (let key in points) {
                let index = parseInt(key)
                let info: NewAdvPointInfo = points[key]
                let tilePos = points[key].tilePos;
                if (info.line != curLine || info.line == 0) {
                    layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
                } else {
                    if (index < this.adventureModel.endless_plateIndex && curPoint.tilePos.y != tilePos.y) {
                        if (index == this.adventureModel.endless_lastPlate && !this.adventureModel.endless_plateFinish) {
                            layer.setTileGIDAt(temGid, tilePos.x, tilePos.y)
                        } else {
                            layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
                        }
                    }
                    else {
                        layer.setTileGIDAt(temGid, tilePos.x, tilePos.y)
                    }
                }
            }
        }

        //设置开始结束点
        //结束点(一直显示)
        let endIndexs = [11, 12, 13]
        for (let i = 0; i < 3; i++) {
            let tilePos = plate0Points[endIndexs[i]].tilePos;
            layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
        }
        //开始点
        let startIndexs = [1, 2, 3]
        if (this.adventureModel.endless_line == 0) {
            for (let i = 0; i < 3; i++) {
                let tilePos = plate0Points[startIndexs[i]].tilePos;
                layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
            }
        } else {
            if ((this.adventureModel.endless_plateIndex > 0 && this.adventureModel.endless_plateFinish) || this.adventureModel.endless_lastPlate > 0) {
                for (let i = 0; i < 3; i++) {
                    let tilePos = plate0Points[startIndexs[i]].tilePos;
                    layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
                }
            } else {
                for (let i = 0; i < 3; i++) {
                    let tilePos = plate0Points[startIndexs[i]].tilePos;
                    layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
                }
            }

        }


        //let historyPlate = this.adventureModel.historyPlate
        // let curPoint = this.adventureModel.platePoints[this.adventureModel.endless_plateIndex]
        // for (let key in points) {
        //     let index = parseInt(key)
        //     let tilePos = points[key].tilePos

        //     // if (historyPlate.indexOf(index) != -1 || index == 99) {
        //     //     layer.setTileGIDAt(whiteGid, tilePos.x, tilePos.y)
        //     // } else {
        //     //     layer.setTileGIDAt(blackGid, tilePos.x, tilePos.y)
        //     // }

        //     // if (historyPlate.indexOf(index) == -1 && (index < this.adventureModel.endless_plateIndex && curPoint.tilePos.y != tilePos.y) && index != this.adventureModel.lastPlate) {
        //     //     layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
        //     // }


        // }

        //清除同层的台子
        // for (let key in points) {
        //     let index = parseInt(key)
        //     let tilePos = points[key].tilePos
        //     if (curPoint.tilePos.y == tilePos.y) {
        //         if (index != this.adventureModel.endless_plateIndex) {
        //             let ctrl: NewAdventurePointCtrl = this.adventureModel.platePointsCtrl[key]
        //             if (this.adventureModel.isFirstEnter) {
        //                 layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
        //             } else {
        //                 ctrl.playerMissEffect(() => {
        //                     layer.setTileGIDAt(gid, tilePos.x, tilePos.y)
        //                 })
        //             }
        //         }
        //     }
        // }
        this.adventureModel.isFirstEnter = false
    }

    //将像素坐标转化为瓦片坐标
    _getTilePos(offset: cc.Vec2) {
        let x = Math.round(offset.x / 88);
        let y = Math.round(offset.y / 117);
        return cc.v2(x, y);
    }

    /**计算坐标点的方式不对，暂时以这种方法实现 */
    _getRealTilePos(line: number, index: number) {
        let point1 = [[4, 14], [3, 13], [3, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7], [3, 6], [3, 5]]
        let point2 = [[5, 14], [4, 13], [4, 12], [4, 11], [5, 10], [4, 9], [4, 8], [4, 7], [5, 6], [4, 5]]
        let point3 = [[5, 14], [5, 13], [6, 12], [6, 11], [7, 10], [6, 9], [7, 8], [6, 7], [6, 6], [5, 5]]
        switch (line) {
            case 0:
                switch (index) {
                    case 0:
                        return cc.v2(4, 14)
                    case 1:
                        return cc.v2(4, 14)
                    case 2:
                        return cc.v2(5, 14)
                    case 3:
                        return cc.v2(4, 15)
                    case 10:
                        return cc.v2(4, 3)
                    case 11:
                        return cc.v2(4, 4)
                    case 12:
                        return cc.v2(5, 4)
                    case 13:
                        return cc.v2(4, 3)
                    case 91:
                        return cc.v2(3, 2)
                    case 92:
                        return cc.v2(4, 1)
                    case 93:
                        return cc.v2(6, 2)
                }
            case 1:
                return cc.v2(point1[index][0], point1[index][1])
            case 2:
                return cc.v2(point2[index][0], point2[index][1])
            case 3:
                return cc.v2(point3[index][0], point3[index][1])
        }
        //return cc.v2(points[index][0], points[index][1])
    }
}