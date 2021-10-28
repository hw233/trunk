import ConfigManager from '../../../../common/managers/ConfigManager';
import FHSMapCityCtrl from './FHSMapCityCtrl';
import FHSMapPointCtrl from './FHSMapPointCtrl';
import FHSMapRankItemCtrl from './FHSMapRankItemCtrl';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import StringUtils from '../../../../common/utils/StringUtils';
import { FhScoreRankInfo } from './GlobalFootHoldViewCtrl';
import { Foothold_pointCfg, Map_footHoldCfg } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSmallMapCtrl")
export default class FHSmallMapCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;   //map图片

    @property(cc.Prefab)
    pointItem: cc.Prefab = null; //据点

    @property(cc.Prefab)
    cityPointItem: cc.Prefab = null; //城池据点

    @property(cc.Node)
    scoreRankItems: cc.Node[] = []

    @property(cc.Node)
    checkBtns: cc.Node[] = []

    mapLayer: cc.TiledLayer
    mapCfg: Map_footHoldCfg
    cityLayer: cc.Node
    _sPointCtrls: { [key: string]: FHSMapPointCtrl } = {}

    _scale = 0.16
    _offX = -410
    _offY = -370
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        this._initMapData()
    }

    _initMapData() {

        if (this.footHoldModel.curMapData.mapType == 5) {
            this._scale = 0.085
            this._offX = -370
            this._offY = -275
        }
        this.scrollView.enabled = false
        this.tiledMap.node.scale = this._scale
        this.tiledMap.node.x = this._offX
        this.tiledMap.node.y = this._offY

        this.mapCfg = ConfigManager.getItemById(Map_footHoldCfg, this.footHoldModel.curMapData.mapId);
        gdk.rm.loadRes(this.resId, `tileMap/foothold/${this.footHoldModel.curMapData.mapId}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.tiledMap.tmxAsset = tmx;
            this.mapLayer = this.tiledMap.getLayers()[0];
            this.cityLayer = cc.instantiate(new cc.Node);
            this.mapLayer.node.addChild(this.cityLayer);

            gdk.Timer.callLater(this, this._initPoints);
        });
    }

    _initPoints() {
        if (!cc.isValid(this.node)) return
        if (!this.node.activeInHierarchy) return
        this._initCityData();
        this._updateScoreRank();
        gdk.Timer.callLater(this, this._createPoint);
    }

    _createPoint() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this._initCheckBtns();
    }

    _getPointCtrl(info: FhPointInfo, create: boolean) {
        let key = `${info.pos.x}-${info.pos.y}`;
        let ctrl = this._sPointCtrls[key];
        if (!ctrl && create) {
            let tileSize = this.tiledMap.getTileSize();
            let node = cc.instantiate(this.pointItem);
            ctrl = this._sPointCtrls[key] = node.getComponent(FHSMapPointCtrl);
            ctrl.updatePointInfo(info);
            node.setPosition(info.mapPoint.x, info.mapPoint.y + tileSize.height / 2);
            this.mapLayer.addUserNode(node);
        }
        return ctrl;
    }

    /**城池数据 */
    _initCityData() {
        let model = this.footHoldModel
        let cityDatas = model.cityDatas
        for (let key in cityDatas) {
            let points = cityDatas[key]
            let x = 0
            let y = 0
            for (let i = 0; i < points.length; i++) {
                x += (points[i] as FhPointInfo).mapPoint.x
                y += (points[i] as FhPointInfo).mapPoint.y
            }
            let node: cc.Node = cc.instantiate(this.cityPointItem);
            let ctrl = node.getComponent(FHSMapCityCtrl)
            ctrl.updateCityInfo(parseInt(key), 0)
            node.setPosition(x / points.length, y / points.length + this.tiledMap.getTileSize().height / 2);
            this.cityLayer.addChild(node)

            let count = 0
            let guildId = this._getPointGuildId(points)
            for (let i = 0; i < points.length; i++) {
                let info: FhPointInfo = model.warPoints[`${points[i].pos.x}-${points[i].pos.y}`]
                if (info.fhPoint && info.fhPoint.guildId > 0 && info.fhPoint.guildId == guildId) {
                    count++
                }
            }
            if (count == points.length) {
                //占领城池 ，更新状态
                let colorId = FootHoldUtils.getFHGuildColor(guildId)
                ctrl.updateCityInfo(parseInt(key), colorId)
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


    _updateScoreRank() {
        let model = this.footHoldModel
        let guilds = model.fhGuilds
        let points = model.fhPoints
        let list = []
        for (let i = 0; i < guilds.length; i++) {
            // let count = 0
            // for (let j = 0; j < points.length; j++) {
            //     if (points[j].guildId == guilds[i].id) {
            //         let p: FhPointInfo = model.warPoints[`${points[j].pos.x}-${points[j].pos.y}`]
            //         if (p && p.bonusType != 0) {
            //             let cfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", model.curMapData.mapId, { world_level: model.worldLevelIndex, point_type: p.type })
            //             if (cfg) {
            //                 count += cfg.score
            //             }
            //         }
            //     }
            // }
            let guildInfo = FootHoldUtils.findCooperGuildInfo(guilds[i].id)

            let info: FhScoreRankInfo = {
                id: guilds[i].id,
                name: guilds[i].name,
                bottom: guilds[i].bottom,
                frame: guilds[i].frame,
                icon: guilds[i].icon,
                score: guildInfo ? guildInfo.guildInfo.score : 0
            }
            list.push(info)
        }
        GlobalUtil.sortArray(list, (a, b) => {
            return b.score - a.score
        })

        for (let i = 0; i < list.length; i++) {
            if (list[i]) {
                this.scoreRankItems[i].active = true
                let ctrl = this.scoreRankItems[i].getComponent(FHSMapRankItemCtrl)
                ctrl.updateViewInfo(list[i], i + 1)
            }
        }
    }

    _getCityScore(guildId) {
        let datas = this.footHoldModel.cityScores
        return datas[guildId] ? datas[guildId] : 0
    }

    _initCheckBtns() {
        let model = this.footHoldModel
        for (let i = 0, n = this.checkBtns.length; i < n; i++) {
            let on = this.checkBtns[i].getChildByName("on")
            let off = this.checkBtns[i].getChildByName("off")
            on.active = model.chooseState[i]
            off.active = !model.chooseState[i]
        }
        if (model.chooseState[0]) {
            this._updateCheck0State()
        } else if (model.chooseState[1]) {
            this._updateCheck1State()
        } else if (model.chooseState[2]) {
            this._updateCheck2State()
        } else {
            this._updateBaseState()
        }
    }

    onChooseFunc(e, utype) {
        utype = parseInt(utype)
        if (utype == 0 && this.footHoldModel.myAlliance.indexOf(this.footHoldModel.roleTempGuildId) == -1) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP84"))
            return
        }
        for (let index = 0; index < this.footHoldModel.chooseState.length; index++) {
            if (index == utype) {
                this.footHoldModel.chooseState[index] = !this.footHoldModel.chooseState[index]
            } else {
                this.footHoldModel.chooseState[index] = false
            }
        }
        this._initCheckBtns()
        gdk.e.emit(FootHoldEventId.REFRESH_FHPOINT_COLOR_STATE)
    }

    /**原本显示状态 */
    _updateBaseState() {
        let ctrl: FHSMapPointCtrl;
        let info: FhPointInfo;
        let warPoints = this.footHoldModel.warPoints;
        for (let key in warPoints) {
            info = warPoints[key] as FhPointInfo;
            if (info.fhPoint && info.fhPoint.playerId > 0) {
                ctrl = this._getPointCtrl(info, false);
                if (ctrl) {
                    // 已经存在，则更新
                    ctrl.updatePointInfo(info);
                } else {
                    // 节点还没创建，则创建
                    this._getPointCtrl(info, true);
                }
            }
        }
    }

    /**联盟显示状态 */
    _updateCheck0State() {
        let ctrl: FHSMapPointCtrl;
        let info: FhPointInfo;
        let model = this.footHoldModel;
        let warPoints = model.warPoints;
        for (let key in warPoints) {
            info = warPoints[key];
            ctrl = this._getPointCtrl(info, false);
            if (ctrl) {
                ctrl.occupyNode.active = false
                ctrl.colorNode.active = false
                ctrl.markFlagTip.active = false
                ctrl.markFlag.active = false
            }
            if (info.fhPoint && model.myAlliance.indexOf(info.fhPoint.guildId) != -1) {
                ctrl = ctrl || this._getPointCtrl(info, true)
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
    }

    /**辐射塔显示状态 */
    _updateCheck1State() {
        let model = this.footHoldModel;
        let radioTypePoints = model.radioTypePoints
        let pointsRecord = {}
        for (let key in radioTypePoints) {
            let points = radioTypePoints[key]
            let color = model.radioTowerData[parseInt(key) - 1]
            for (let i = 0; i < points.length; i++) {
                let info: FhPointInfo = points[i]
                let name = `${info.pos.x}-${info.pos.y}`
                let colorArr = pointsRecord[name]
                let ctrl = this._getPointCtrl(info, false)
                if (colorArr) {
                    colorArr[color] = true
                } else {
                    pointsRecord[name] = colorArr = {}
                    colorArr[color] = true
                    if (ctrl) {
                        ctrl.occupyNode.active = false
                        ctrl.colorNode.active = false
                        ctrl.markFlagTip.active = false
                        ctrl.markFlag.active = false
                    }
                }
                if (info.bonusType != 0) {
                    ctrl = ctrl || this._getPointCtrl(info, true)
                    ctrl.colorNode.active = true
                    let color1 = ctrl.colorNode.getChildByName("1")
                    let color2 = ctrl.colorNode.getChildByName("2")
                    let color3 = ctrl.colorNode.getChildByName("3")
                    let color4 = ctrl.colorNode.getChildByName("4")
                    color1.active = !!colorArr[1]
                    color2.active = !!colorArr[2]
                    color3.active = !!colorArr[3]
                    color4.active = false
                }
            }
        }
    }

    /** 进攻标记状态*/
    _updateCheck2State() {
        let ctrl: FHSMapPointCtrl;
        let info: FhPointInfo;
        let model = this.footHoldModel;
        let warPoints = model.warPoints;
        for (let key in warPoints) {
            info = warPoints[key];
            ctrl = this._getPointCtrl(info, false)
            if (ctrl) {
                ctrl.occupyNode.active = false
                ctrl.colorNode.active = false
                ctrl.markFlagTip.active = false
                ctrl.markFlag.active = false
            }
            if (model.markFlagPoints[`${info.pos.x}-${info.pos.y}`]) {
                ctrl = ctrl || this._getPointCtrl(info, true)
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

                ctrl.markFlagTip.parent = this.tiledMap.node
                ctrl.markFlagTip.zIndex = 999
                ctrl.markFlagTip.position = cc.v2(info.mapPoint.x, info.mapPoint.y + ctrl.occupyNode.height)
                let lab = ctrl.markFlagTip.getChildByName("label").getComponent(cc.RichText)
                lab.string = StringUtils.setRichtOutLine(model.markFlagPoints[`${info.pos.x}-${info.pos.y}`].msg, "#0f0603", 2)

                let colorId = FootHoldUtils.getFHGuildColor(model.roleTempGuildId)
                GlobalUtil.setSpriteIcon(ctrl.node, ctrl.markFlag, `view/guild/texture/icon/gh_qizhi${colorId}`)
            }
        }
    }

    onAddFunc() {
        this.scrollView.enabled = true
        let newScale = this.tiledMap.node.scale + 0.05
        if (newScale >= 1) {
            newScale = 1
        }
        this.tiledMap.node.scale = newScale
    }

    onReduceFunc() {
        let newScale = this.tiledMap.node.scale - 0.05
        if (this.footHoldModel.curMapData.mapType == 5) {
            if (newScale <= 0.085) {
                newScale = 0.085
                this.scrollView.enabled = false
                this.tiledMap.node.x = -370
                this.tiledMap.node.y = -275
            }
        } else {
            if (newScale <= 0.16) {
                newScale = 0.16
                this.scrollView.enabled = false
                this.tiledMap.node.x = -410
                this.tiledMap.node.y = -370
            }
        }
        this.tiledMap.node.scale = newScale
    }

    onScrolling() {
        let maxWidth = this.tiledMap.node.width * this.tiledMap.node.scale
        let maxHeight = this.tiledMap.node.height * this.tiledMap.node.scale
        if (this.tiledMap.node.x < -maxWidth) {
            this.tiledMap.node.x = -maxWidth
        }

        if (this.tiledMap.node.y < -maxHeight) {
            this.tiledMap.node.y = -maxHeight
        }
    }

    _updateMapState() {

    }
}