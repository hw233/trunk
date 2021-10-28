import ConfigManager from '../../../../common/managers/ConfigManager';
import FightingMath from '../../../../common/utils/FightingMath';
import FootHoldCityPointCtrl from './FootHoldCityPointCtrl';
import FootHoldModel, { FhMapType, FhPointInfo } from './FootHoldModel';
import FootHoldPointCtrl from './FootHoldPointCtrl';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { Foothold_cityCfg, Foothold_pointCfg, Map_footHoldCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

interface PointItem {
    key: any,
    x: number,
    y: number,
    cfg: Foothold_pointCfg,
    id: number,
    node: cc.Node,
};
const POOL_NAME = 'GuildFhMapCtrl_PointItem';

@ccclass
@menu("qszc/view/guild/footHold/GuildFhMapCtrl")
export default class GuildFhMapCtrl extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;   //map图片

    @property(cc.Prefab)
    pointItem: cc.Prefab = null; //据点

    @property(cc.Prefab)
    cityPointItem: cc.Prefab = null; //城池据点

    viewCtrl: any;
    mapLayer: cc.TiledLayer;
    mapCfg: Map_footHoldCfg;
    cityLayer: cc.Node;
    points: PointItem[];
    queue: { a: boolean, e: PointItem }[] = []; //据点处理队列，添加或移除

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    /**获取在世界坐标系下的节点包围盒(不包含自身激活的子节点范围) */
    private _get_bounding_box_to_world(node_o_: any): cc.Rect {
        let w_n: number = node_o_._contentSize.width;
        let h_n: number = node_o_._contentSize.height;
        let rect_o = cc.rect(
            -node_o_._anchorPoint.x * w_n,
            -node_o_._anchorPoint.y * h_n,
            w_n,
            h_n
        );
        node_o_._calculWorldMatrix();
        rect_o.transformMat4(rect_o, node_o_._worldMatrix);
        return rect_o;
    }
    /**自定义事件 */
    private _event_update_active(): void {
        gdk.Timer.callLater(this, this._event_update_active_later);
    }
    private _event_update_active_later() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this.points || !this.points.length) return;

        let n: cc.Node = this.viewCtrl.tiledMapScrollView.node;
        let rect1_o = this._get_bounding_box_to_world(n);
        rect1_o.width += 144;   // 多增加一个节点宽度
        // rect1_o.width += rect1_o.width * 0.5
        // rect1_o.height += rect1_o.height * 0.5
        // rect1_o.x -= rect1_o.width * 0.25;
        // rect1_o.y -= rect1_o.height * 0.25;

        this.queue.length = 0;
        this.points.forEach(e => {
            let pt = this.mapLayer.node.convertToWorldSpaceAR(cc.v2(e.x, e.y));
            let rect2_o = cc.rect(pt.x, pt.y, 144, 80);
            if (rect1_o.intersects(rect2_o)) {
                // 在显示范围内，且节点还没创建，则创建并初始化
                if (!e.node) {
                    this.queue.push({ a: true, e: e });
                }
            } else if (e.node) {
                // 不在显示范围内，则清除节点
                this.queue.push({ a: false, e: e });
            }
        });
        this.queue = FightingMath.shuffle(this.queue);
        gdk.Timer.frameLoop(1, this, this.updateScript);
    }

    updateScript() {
        if (this.queue.length == 0) {
            this.updateCityState();
            gdk.Timer.clear(this, this.updateScript);
            return;
        }
        let model = this.footHoldModel;
        let warPoints = model.warPoints;
        let warPointsCtrl = model.warPointsCtrl;
        let myid = this.roleModel.id;
        let n = Math.min(6, this.queue.length);
        for (let i = 0; i < n; i++) {
            let item = this.queue[i];
            let e = item.e;
            if (item.a && !e.node) {
                // 在显示范围内，且节点还没创建，则创建并初始化
                let info = warPoints[e.key];
                e.node = gdk.pool.get(POOL_NAME);
                if (!e.node) {
                    e.node = cc.instantiate(this.pointItem);
                }
                let ctrl = e.node.getComponent(FootHoldPointCtrl);
                GlobalUtil.setGrayState(ctrl.pointIcon, 0)
                ctrl.updatePointInfo(info);
                ctrl.setPointTypeNew(e.cfg, e.id);
                // 更新据点状态
                ctrl.setOccupyName();
                if (info.fhPoint && info.fhPoint.playerId > 0) {
                    ctrl.setPointOccupy()
                    if (info.fhPoint.status & 1) {
                        ctrl.fight.active = true;
                    }
                    // 据点产出（自己的）
                    if (info.fhPoint.playerId == myid) {
                        ctrl.setOutput();
                    }

                    if (this.footHoldModel.globalShowMyPoint) {
                        if (info && (info.fhPoint && info.fhPoint.playerId != ModelManager.get(RoleModel).id)) {
                            ctrl.occupyNode.active = false
                            ctrl.occupyName.active = false
                            ctrl.pointIcon.active = true
                        }
                    }

                } else {
                    if (info.fhPoint && (info.fhPoint.status & 1)) {
                        ctrl.setPointFigth();
                    } else {
                        ctrl.setPointInit();
                        if (info.fhPoint && info.fhPoint.playerId == 0 && info.fhPoint.guildId > 0) {
                            ctrl.setGiveupState();
                        }
                    }
                }
                e.node.setPosition(e.x, e.y);
                // 保存到model中
                warPointsCtrl[e.key] = ctrl;
                ctrl.pointIcon.scale = 1;
                this.mapLayer.addUserNode(e.node);
                this.updatePointState(info);
            } else if (!item.a && e.node) {
                // 不在显示范围内，则清除节点
                this.mapLayer.removeUserNode(e.node);
                gdk.pool.put(POOL_NAME, e.node);
                e.node = null;
                delete warPointsCtrl[e.key];
            }
        }
        this.queue.splice(0, n);
    }

    updatePointState(info) {
        let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
        if (this.footHoldModel.chooseState[0]) {
            if (ctrl) {
                ctrl.occupyNode.active = false
                ctrl.colorNode.active = false
                ctrl.markFlagTip.active = false
                if (info.fhPoint && this.footHoldModel.myAlliance.indexOf(info.fhPoint.guildId) != -1) {
                    ctrl.colorNode.active = true
                    let color1 = ctrl.colorNode.getChildByName("1")
                    let color2 = ctrl.colorNode.getChildByName("2")
                    let color3 = ctrl.colorNode.getChildByName("3")
                    let color4 = ctrl.colorNode.getChildByName("4")
                    color4.active = true
                    color3.active = false
                    color2.active = false
                    color1.active = false
                }
            }
        } else if (this.footHoldModel.chooseState[1]) {
            let radioTypePoints = this.footHoldModel.radioTypePoints
            let pointsRecord = {}
            for (let key in radioTypePoints) {

                let points = radioTypePoints[key]
                let color = this.footHoldModel.radioTowerData[parseInt(key) - 1]
                for (let i = 0; i < points.length; i++) {
                    if (ctrl && info.pos.x == points[i].pos.x && info.pos.y == points[i].pos.y) {
                        let colorArr: number[] = pointsRecord[`${info.pos.x}-${info.pos.y}`]
                        if (colorArr && colorArr.length > 0) {
                            colorArr.push(color)
                        } else {
                            colorArr = [color]
                        }
                        pointsRecord[`${info.pos.x}-${info.pos.y}`] = colorArr
                        ctrl.setPointInit()
                        if (info.bonusType != 0) {
                            ctrl.colorNode.active = true
                            let color1 = ctrl.colorNode.getChildByName("1")
                            let color2 = ctrl.colorNode.getChildByName("2")
                            let color3 = ctrl.colorNode.getChildByName("3")
                            let color4 = ctrl.colorNode.getChildByName("4")
                            color1.active = colorArr.indexOf(1) != -1
                            color2.active = colorArr.indexOf(2) != -1
                            color3.active = colorArr.indexOf(3) != -1
                            color4.active = false
                        }
                    }
                }
            }
        } else if (this.footHoldModel.chooseState[2]) {
            if (ctrl) {
                ctrl.occupyNode.active = false
                ctrl.colorNode.active = false
                ctrl.markFlagTip.active = false
                ctrl.markFlag.active = false
                if (this.footHoldModel.markFlagPoints[`${info.pos.x}-${info.pos.y}`]) {
                    ctrl.colorNode.active = true
                    let color1 = ctrl.colorNode.getChildByName("1")
                    let color2 = ctrl.colorNode.getChildByName("2")
                    let color3 = ctrl.colorNode.getChildByName("3")
                    let color4 = ctrl.colorNode.getChildByName("4")
                    color4.active = false
                    color3.active = true
                    color2.active = false
                    color1.active = false
                    ctrl.markFlag.active = true
                    ctrl.markFlagTip.active = true
                    ctrl.markFlagTip.parent = this.cityLayer
                    ctrl.markFlagTip.position = cc.v2(info.mapPoint.x, info.mapPoint.y + ctrl.occupyNode.height)
                    let lab = ctrl.markFlagTip.getChildByName("label").getComponent(cc.RichText)
                    lab.string = StringUtils.setRichtOutLine(this.footHoldModel.markFlagPoints[`${info.pos.x}-${info.pos.y}`].msg, "#0f0603", 2)
                }
            }
        }
    }

    updateCityState() {
        let cityDatas = this.footHoldModel.cityDatas
        let guildCityScores = this.footHoldModel.cityScores = {}
        let cityGetPoints = this.footHoldModel.cityGetPoints = {}
        for (let key in cityDatas) {
            //该城池的所有点
            let points = cityDatas[key]
            let count = 0
            let guildId = this._getPointGuildId(points)
            for (let i = 0; i < points.length; i++) {
                let info: FhPointInfo = this.footHoldModel.warPoints[`${points[i].pos.x}-${points[i].pos.y}`]
                let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${points[i].pos.x}-${points[i].pos.y}`]
                if (ctrl) {
                    GlobalUtil.setGrayState(ctrl.pointIcon, 1)
                    if (info.fhPoint && info.fhPoint.guildId > 0 && info.fhPoint.guildId == guildId) {
                        count++
                    }
                }
            }
            let cityCtrl = this.footHoldModel.cityPointCtrl[key] as FootHoldCityPointCtrl
            if (count == points.length) {
                let cityCfg = ConfigManager.getItemByField(Foothold_cityCfg, "index", parseInt(key))
                if (guildCityScores[guildId]) {
                    guildCityScores[guildId] += cityCfg.score
                } else {
                    guildCityScores[guildId] = cityCfg.score
                }
                for (let j = 0; j < points.length; j++) {
                    cityGetPoints[`${points[j].pos.x}-${points[j].pos.y}`] = points[j]
                    let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${points[j].pos.x}-${points[j].pos.y}`]
                    if (ctrl) {
                        GlobalUtil.setGrayState(ctrl.pointIcon, 0)
                    }
                }
                //占领城池 ，更新状态
                cityCtrl.updateCity(parseInt(key), FootHoldUtils.findGuild(guildId))
            } else {
                if (cityCtrl.node) {
                    cityCtrl.updateCity(0, null)
                }
            }
        }
    }

    _getPointGuildId(points) {
        let guildId = 0
        for (let i = 0; i < points.length; i++) {
            let info: FhPointInfo = points[i]
            if (info.fhPoint && info.fhPoint.guildId > 0) {
                guildId = info.fhPoint.guildId
                return guildId
            }
        }
        return guildId
    }

    updateView() {
        this._event_update_active()
    }

    onDisable() {
        if (this.mapCfg) {
            GlobalUtil.setLocal(
                'foot_hold_pos#' + this.mapCfg.id, {
                x: this.node.x,
                y: this.node.y,
            });
        }
        this.mapLayer = null;
        this.mapCfg = null;
        this.viewCtrl = null;
        this.cityLayer = null;
        this.points = null;
        this.queue.length = 0;
        gdk.pool.clear(POOL_NAME);
        gdk.Timer.clearAll(this);
        cc.js.clear(this.footHoldModel.warPointsCtrl);
    }

    initMap(ctrl: any, tmx: cc.TiledMapAsset) {
        let mapId = this.footHoldModel.curMapData.mapId;
        this.mapCfg = ConfigManager.getItemById(Map_footHoldCfg, mapId);
        this.viewCtrl = ctrl;
        this.tiledMap.tmxAsset = tmx;
        this.mapLayer = this.tiledMap.getLayers()[0];
        this.cityLayer = cc.instantiate(new cc.Node);
        this.mapLayer.node.addChild(this.cityLayer);
        this.node.scale = 0.8;
        gdk.Timer.callLater(this, this._initPoints);
    }

    resetSize() {
        this.tiledMap.node.scale = 0.8
        this.tiledMap.node.width = this.mapLayer.node.width * 0.8
        let mapType = this.footHoldModel.curMapData.mapType
        if (mapType != FhMapType.Base) {
            this.tiledMap.node.width = this.mapLayer.node.width * 0.8 - (mapType == 5 ? 0 : 500)
        }
        this.tiledMap.node.height = this.mapLayer.node.height * 0.8
    }

    _initPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let footHoldModel = this.footHoldModel;
        let pointLayer = this.tiledMap.getObjectGroup("points");
        let warPoints = footHoldModel.warPoints = {};
        let points = pointLayer.getObjects();
        let obj: { [key: string]: boolean } = {};
        let nextInfo: FhPointInfo = null;
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
            if (type == 9) {
                // 障碍点不创建可点击节点
                continue;
            }
            let info: FhPointInfo = {
                id: p.id,
                type: type,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
                fhPoint: null,
                output: [],
                bonusType: -1,
                bonusId: 0,
                addState: [],
                effectTowers: []
            };
            warPoints[key] = info;
            if (info.type == 10) {
                nextInfo = info;
            }
        }

        this.node.on(cc.Node.EventType.POSITION_CHANGED, this._event_update_active, this);
        this.mapLayer.node.on(cc.Node.EventType.SIZE_CHANGED, this._event_update_active, this);

        // 移动到上次选中点的位置 进去要定位到公会的起始位置
        let guild = FootHoldUtils.findGuild(this.footHoldModel.roleTempGuildId);
        if (guild) {
            let info: FhPointInfo = footHoldModel.warPoints[`${guild.origin.x}-${guild.origin.y}`];
            let point = footHoldModel.lastSelectPoint;
            if (point) {
                footHoldModel.lastSelectPoint = null;
                let p = GlobalUtil.getLocal('foot_hold_pos#' + this.mapCfg.id);
                if (!p) {
                    p = { x: -point.mapPoint.x, y: -point.mapPoint.y };
                }
                this.node.setPosition(p.x, p.y);
            } else if (footHoldModel.globalMapData && nextInfo) {
                point = nextInfo;
                this.node.setPosition(-point.mapPoint.x + this.tiledMap.getTileSize().width * 3, -point.mapPoint.y);
            } else {
                point = info;
                let n = this.viewCtrl.node as cc.Node;
                let s = this.tiledMap.getTileSize();
                let h = n.height * n.anchorY;
                let w = n.width * n.anchorX;
                let y = Math.min(0, -point.mapPoint.y + h);
                this.node.setPosition((-point.mapPoint.x - w + s.width * 3) * 0.8, (y - h - s.height) * 0.8);
            }
        } else {
            CC_DEBUG && cc.error("没有工会信息");
        }
        // 创建战斗节点
        gdk.Timer.callLater(this, this.createPoint);
    }

    createPoint() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let model = this.footHoldModel;
        let warPoints = model.warPoints;
        let tileSize = this.tiledMap.getTileSize();
        // var time = new Date().getTime()
        FightingMath.init(model.curMapData.rndSeed);

        if (this.footHoldModel.curMapData.mapType != FhMapType.Base) {
            //跨服数据
            this.points = [];
            for (let key in warPoints) {
                let info: FhPointInfo = warPoints[key];
                let item: PointItem = {
                    key: key,
                    x: info.mapPoint.x,
                    y: info.mapPoint.y + tileSize.height / 2,
                    id: undefined,
                    cfg: undefined,
                    node: undefined,
                };
                if (info.type > 0 && info.type < 9) {
                    item.cfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", model.curMapData.mapId, {
                        world_level: model.worldLevelIndex,
                        point_type: info.type,
                        map_type: model.curMapData.mapType
                    });
                    item.id = item.cfg.round[FightingMath.rnd(0, item.cfg.round.length - 1)];
                }
                this.points.push(item);
            }
            this._initCityData();
            this._initBonusData()
            this._event_update_active()
            gdk.Timer.callLater(this, () => {
                this.viewCtrl.refreshPoints()
            })
        } else {
            //本服数据
            for (let key in warPoints) {
                let info: FhPointInfo = warPoints[key];
                let node: cc.Node = cc.instantiate(this.pointItem);
                let ctrl = node.getComponent(FootHoldPointCtrl);
                ctrl.updatePointInfo(info);
                ctrl.setPointType();
                node.setPosition(info.mapPoint.x, info.mapPoint.y + tileSize.height / 2);
                model.warPointsCtrl[key] = ctrl;
                ctrl.pointIcon.scale = 1
                this.mapLayer.addUserNode(node);
            }
            this.viewCtrl.refreshPoints()
        }
    }

    /**初始化城池数据 */
    _initCityData() {
        let cityDatas = this.footHoldModel.cityDatas = {}
        let cityAllPoints = this.footHoldModel.cityAllPoints = {}
        let cityGroup = this.tiledMap.getObjectGroup("cities");
        let points = cityGroup.getObjects();
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let type = parseInt(p.name);
            let pos = this._getTilePos(p.offset);
            if (cityDatas[type]) {
                cityDatas[type].push(this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]);
            } else {
                cityDatas[type] = [];
                cityDatas[type].push(this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]);
            }
            cityAllPoints[`${pos.x}-${pos.y}`] = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]

            let cityCfg = ConfigManager.getItemByField(Foothold_cityCfg, "index", type)
            let ctrl = this.footHoldModel.warPointsCtrl[`${pos.x}-${pos.y}`] as FootHoldPointCtrl
            if (ctrl && ctrl.pointIcon) {
                ctrl.pointIcon.scale = cityCfg ? cityCfg.scale : 1
            }
        }

        let cityCtrl = this.footHoldModel.cityPointCtrl = {}
        for (let key in cityDatas) {
            let points = cityDatas[key]
            let x = 0
            let y = 0
            for (let i = 0; i < points.length; i++) {
                x += (points[i] as FhPointInfo).mapPoint.x
                y += (points[i] as FhPointInfo).mapPoint.y
            }
            let node: cc.Node = cc.instantiate(this.cityPointItem);
            let ctrl = node.getComponent(FootHoldCityPointCtrl)
            cityCtrl[key] = ctrl
            ctrl.updateCity(0, null)
            node.setPosition(x / points.length, y / points.length + this.tiledMap.getTileSize().height / 2);
            this.cityLayer.addChild(node)
        }
    }

    /**初始化buff塔 数据 */
    _initBonusData() {
        let radioTypePoints = this.footHoldModel.radioTypePoints = {}
        let radioAllPoints = this.footHoldModel.radioAllPoints = {}

        let groups = ["bonus1", "bonus2", "bonus3", "bonus4", "bonus5", "bonus6", "bonus7", "bonus8", "bonus9", "bonus10", "bonus11", "bonus12", "bonus13", "bonus14", "bonus15", "bonus16"]
        for (let i = 0; i < groups.length; i++) {
            let group = this.tiledMap.getObjectGroup(groups[i]);
            if (!group) {
                continue
            }
            let points = group.getObjects();
            for (let j = 0; j < points.length; j++) {
                let p = points[j];
                let type = parseInt(p.name);
                let pos = this._getTilePos(p.offset);
                let info: FhPointInfo = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]
                if (info) {
                    if (info.bonusType != 0) {
                        info.bonusType = type
                    }
                    if (radioTypePoints[i + 1]) {
                        radioTypePoints[i + 1].push(this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]);
                    } else {
                        radioTypePoints[i + 1] = [];
                        radioTypePoints[i + 1].push(this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]);
                    }
                    radioAllPoints[`${pos.x}-${pos.y}`] = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]

                    if (type == 0) {
                        info.bonusId = i + 1
                    }
                }
            }
        }
    }

    //将像素坐标转化为瓦片坐标
    _getTilePos(offset: cc.Vec2) {
        let x = Math.round(offset.x / this.mapCfg.tw);
        let y = Math.round(offset.y / this.mapCfg.th);
        return cc.v2(x, y);
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
        return { x: cx - (index > 0 ? 0 : 1), y: cy + (cy % 2 + index % 2) % 2 - 1 };
    }
}
