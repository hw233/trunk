import ChatModel from '../../../chat/model/ChatModel';
import ChatUtils from '../../../chat/utils/ChatUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ErrorManager from '../../../../common/managers/ErrorManager';
import FHGroupItemCtrl from './FHGroupItemCtrl';
import FHScoreRankItemCtrl from './FHScoreRankItemCtrl';
import FootHoldCityPointCtrl from './FootHoldCityPointCtrl';
import FootHoldModel, { FhMapType, FhPointInfo } from './FootHoldModel';
import FootHoldPointCtrl from './FootHoldPointCtrl';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import GuildFhMapCtrl from './GuildFhMapCtrl';
import JumpUtils from '../../../../common/utils/JumpUtils';
import MilitaryRankUtils from '../militaryRank/MilitaryRankUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import StoreViewCtrl, { StoreBaseScoreTabType } from '../../../store/ctrl/StoreViewCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import TaskModel from '../../../task/model/TaskModel';
import TaskUtil from '../../../task/util/TaskUtil';
import TimerUtils from '../../../../common/utils/TimerUtils';
import {
    ActivityCfg,
    Foothold_bgCfg,
    Foothold_cityCfg,
    Foothold_globalCfg,
    Foothold_towerCfg,
    GlobalCfg,
    Mission_guildCfg
    } from '../../../../a/config';
import { FhTeacheGuideType } from './teaching/FootHoldTeachingCtrl';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-14 18:33:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/GlobalFootHoldViewCtrl")
export default class GlobalFootHoldViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    groupItems: cc.Node[] = []

    @property(cc.Node)
    rankNode: cc.Node = null

    @property(cc.Node)
    arrow: cc.Node = null

    @property(GuildFhMapCtrl)
    tiledMap: GuildFhMapCtrl = null
    @property(cc.ScrollView)
    tiledMapScrollView: cc.ScrollView = null

    @property(cc.Label)
    energyLab: cc.Label = null

    @property(cc.Label)
    crossLab: cc.Label = null

    @property(cc.Label)
    titleLab: cc.Label = null

    @property(cc.Node)
    scoreRankItems: cc.Node[] = []

    @property(cc.Node)
    timeNode: cc.Node = null

    @property(cc.Node)
    box: cc.Node = null

    @property(cc.Node)
    btnAdd: cc.Node = null

    @property(cc.Node)
    tipLayer: cc.Node = null

    @property(cc.Node)
    btnOneKeyGet: cc.Node = null

    @property(cc.Node)
    btnOneKeyPointScore: cc.Node = null

    @property(cc.Node)
    pointsUpNode: cc.Node = null

    @property(cc.Node)
    pointsDownNode: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    pointListItem: cc.Prefab = null

    @property(cc.Node)
    teachNode: cc.Node = null

    @property(cc.Node)
    btnBase: cc.Node = null

    @property(cc.Node)
    btnCooper: cc.Node = null

    @property(cc.Node)
    btnMember: cc.Node = null

    @property(cc.Node)
    btnMap: cc.Node = null

    @property(cc.Node)
    btnMark: cc.Node = null

    @property(cc.Node)
    taskBox: cc.Node = null

    @property(cc.Node)
    btnDef: cc.Node = null

    @property(cc.Label)
    guessModeLab: cc.Label = null

    @property(cc.Node)
    worldTipNode: cc.Node = null;

    @property(cc.Node)
    militaryRankIcon: cc.Node = null;

    @property(cc.Label)
    militaryRankLab: cc.Label = null;

    @property(cc.Node)
    hideChooseNode: cc.Node = null;

    @property(cc.Node)
    showChooseNode: cc.Node = null;

    @property(cc.Node)
    checkBtns: cc.Node[] = []

    @property(cc.Node)
    allianceChatBtn: cc.Node = null

    @property(cc.Node)
    gatherMask: cc.Node = null

    @property(cc.Button)
    typeBtns: cc.Button[] = []

    @property(cc.RichText)
    markTipLab: cc.RichText = null

    @property(cc.Prefab)
    pointItem: cc.Prefab = null; //据点

    @property(cc.Node)
    myCheck: cc.Node = null

    _refreshTime = 60

    list: ListView = null;
    markList: ListView = null
    _tipShow = false

    isShowRank = false
    isShowTime = false
    //isShowPointList = false
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get chatModel(): ChatModel { return ModelManager.get(ChatModel) }

    onEnable() {

        if (!this.footHoldModel.globalMapData) {
            return
        }

        ErrorManager.on(3317, this._returnMainPanel1, this)
        ErrorManager.on(3318, this._returnMainPanel2, this)
        gdk.e.on(FootHoldEventId.REFRESH_FHPOINT_COLOR_STATE, this._initCheckBtns, this)

        let g_open = ConfigManager.getItemByField(Foothold_globalCfg, "key", "open").value[5]
        if (this.footHoldModel.activityIndex >= g_open) {
            this.btnCooper.active = true
            this.btnMember.active = true
        }

        this.btnMark.active = FootHoldUtils.isPlayerCanMark


        NetManager.on(icmsg.FootholdMapEnterRsp.MsgType, this._onFootholdMapEnterRsp, this)
        NetManager.on(icmsg.FootholdMapEnter2Rsp.MsgType, this._onFootholdMapEnter2Rsp, this)

        // 请求地图信息
        let msg = new icmsg.FootholdMapEnterReq()
        msg.warId = this.footHoldModel.globalMapData.warId
        NetManager.send(msg)

        this._updateRecommendGroup()
        this._updateEnergy()
        this._updateAllianceChatBtnState()

        if (!this.footHoldModel.isGuessMode) {
            let g_msg = new icmsg.FootholdGuideQueryReq()
            NetManager.send(g_msg)
            this._updateMilitaryInfo()
        }

        this._updateCheckState()
    }

    //原协议处理
    _onFootholdMapEnterRsp(data: icmsg.FootholdMapEnterRsp) {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        this.footHoldModel.fhGuilds = data.guilds
        this.footHoldModel.fhPlayers = data.players
        this.footHoldModel.fhPoints = data.points || []
        this.footHoldModel.fightPoint = data.fightingPos
        this.footHoldModel.radioTowerData = data.towers
        this.footHoldModel.worldLevelIndex = data.worldLevelIdx
        this.footHoldModel.curMapData = {
            warId: this.footHoldModel.globalMapData.warId,
            mapId: data.mapId,
            mapType: data.mapType,
            redPoint: this.footHoldModel.globalMapData.redPoint,
            rndSeed: data.rndSeed,
        }
        let bgPath = 'view/guild/texture/bg/gh_yjbeijinh'
        let bgCfg = ConfigManager.getItemByField(Foothold_bgCfg, "map_id", data.mapId)
        if (bgCfg) {
            bgPath = `view/guild/texture/bg/${bgCfg.background}`
        }
        GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath)

        this._initCroseServerName()

        //跨服需要发送额外的消息
        if (data.mapType == FhMapType.Cross || data.mapType == FhMapType.CrossExt) {
            let crossMsg = new icmsg.SystemSubscribeReq()
            crossMsg.cancel = false
            crossMsg.topicId = 3
            NetManager.send(crossMsg)
        }

        if (FootHoldUtils.isCrossWar) {
            this.crossLab.node.active = true
            this.crossLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP50")
        } else {
            this.crossLab.node.active = false
        }

        let isGuess = false
        let count = 0
        for (let i = 0; i < data.guilds.length; i++) {
            if (data.guilds[i].id != this.roleModel.guildId) {
                count++
            }
        }
        if (count != 0 && count == data.guilds.length) {
            isGuess = true
        }
        //参加协战，取消竞猜模式
        if (this.footHoldModel.coopGuildId > 0) {
            isGuess = false
        }

        FootHoldUtils.setGuessMode(isGuess)

        this.titleLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP47")
        // 加载并初始化地图
        gdk.rm.loadRes(this.resId, `tileMap/foothold/${data.mapId}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.tiledMap.initMap(this, tmx);
            this.tiledMap.resetSize()
            gdk.e.on(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST, this._initCheckBtns, this);
            NetManager.on(icmsg.FootholdBaseLevelRsp.MsgType, this._onFootholdBaseLvUpRsp, this)
            gdk.Timer.once(1000, this, () => {
                this.showRankNode()
            })
            gdk.Timer.loop(1000 * this._refreshTime, this, this._updateTime)
            gdk.Timer.once(1000, this, () => {
                this._updateTime()
            })

            this._updatePointListState()
            this.updateViewMode()
        });
    }

    //新处理 ，数据过多 ，玩家id， 公会id用索引方式处理
    _onFootholdMapEnter2Rsp(data: icmsg.FootholdMapEnter2Rsp) {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        this.footHoldModel.fhGuilds = data.guilds
        this.footHoldModel.fhPlayers = data.players
        let newPoints = []
        data.points && data.points.forEach(element => {
            let point = new icmsg.FootholdPoint()
            point.bossHp = element.bossHp
            point.gather = element.gather
            point.guildId = element.guildIdx > 0 ? data.guilds[element.guildIdx - 1].id : 0
            point.playerId = element.playerIdx > 0 ? data.players[element.playerIdx - 1].id : 0
            point.pos = element.pos
            point.status = element.status
            point.statusEndtime = element.statusEndtime
            newPoints.push(point)
        });
        this.footHoldModel.fhPoints = newPoints

        this.footHoldModel.fightPoint = data.fightingPos
        this.footHoldModel.radioTowerData = data.towers
        this.footHoldModel.worldLevelIndex = data.worldLevelIdx
        this.footHoldModel.curMapData = {
            warId: this.footHoldModel.globalMapData.warId,
            mapId: data.mapId,
            mapType: data.mapType,
            redPoint: this.footHoldModel.globalMapData.redPoint,
            rndSeed: data.rndSeed,
        }
        let bgPath = 'view/guild/texture/bg/gh_yjbeijinh'
        let bgCfg = ConfigManager.getItemByField(Foothold_bgCfg, "map_id", data.mapId)
        if (bgCfg) {
            bgPath = `view/guild/texture/bg/${bgCfg.background}`
        }
        GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath)

        this._initCroseServerName()

        //跨服需要发送额外的消息
        if (data.mapType == FhMapType.Cross || data.mapType == FhMapType.CrossExt) {
            let crossMsg = new icmsg.SystemSubscribeReq()
            crossMsg.cancel = false
            crossMsg.topicId = 3
            NetManager.send(crossMsg)
        }

        if (FootHoldUtils.isCrossWar) {
            this.crossLab.node.active = true
            this.crossLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP50")
        } else {
            this.crossLab.node.active = false
        }

        let isGuess = false
        let count = 0
        for (let i = 0; i < data.guilds.length; i++) {
            if (data.guilds[i].id != this.roleModel.guildId) {
                count++
            }
        }
        if (count != 0 && count == data.guilds.length) {
            isGuess = true
        }
        //参加协战，取消竞猜模式
        if (this.footHoldModel.coopGuildId > 0) {
            isGuess = false
        }

        FootHoldUtils.setGuessMode(isGuess)

        this.titleLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP47")
        // 加载并初始化地图
        gdk.rm.loadRes(this.resId, `tileMap/foothold/${data.mapId}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.tiledMap.initMap(this, tmx);
            this.tiledMap.resetSize()
            gdk.e.on(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST, this._initCheckBtns, this);
            NetManager.on(icmsg.FootholdBaseLevelRsp.MsgType, this._onFootholdBaseLvUpRsp, this)
            gdk.Timer.once(1000, this, () => {
                this.showRankNode()
            })
            gdk.Timer.loop(1000 * this._refreshTime, this, this._updateTime)
            gdk.Timer.once(1000, this, () => {
                this._updateTime()
            })

            this._updatePointListState()
            this.updateViewMode()
        });
    }



    onDisable() {
        gdk.e.targetOff(this)
        this.unscheduleAllCallbacks()
        ErrorManager.targetOff(this);
        NetManager.targetOff(this)
        gdk.Timer.clearAll(this)
        this.footHoldModel.gatherMode = false
        this.footHoldModel.markMode = false
        //跨服需要发送额外的消息
        if (FootHoldUtils.isCrossWar) {
            let crossMsg = new icmsg.SystemSubscribeReq()
            crossMsg.cancel = true
            crossMsg.topicId = 3
            NetManager.send(crossMsg)
        }

        if (this.footHoldModel.isGuessMode) {
            this.footHoldModel.isGuessMode = false
            this.footHoldModel.globalMapData = null
        }
    }

    //每分钟请求一次，自己据点的收益情况
    _updateTime() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        if (this.footHoldModel.isGuessMode) {
            return
        }
        let msg = new icmsg.FootholdListOutputReq()
        msg.warId = this.footHoldModel.curMapData.warId
        NetManager.send(msg, (data: icmsg.FootholdListOutputRsp) => {
            if (data.list && data.list.length > 0) {
                if (this.footHoldModel) {
                    this.footHoldModel.pointsOutputList = data.list
                    this._refreshOutput()
                    if (data.list.length > 0) {
                        if (!this.footHoldModel.markMode) this.btnOneKeyGet.active = true
                    } else {
                        this.btnOneKeyGet.active = false
                    }
                }
            }
        }, this)
    }

    _refreshOutput() {
        let warPoints = this.footHoldModel.warPoints;
        for (let key in warPoints) {
            let info: FhPointInfo = warPoints[key];
            let sPointInfo = FootHoldUtils.findFootHold(info.pos.x, info.pos.y)
            if (sPointInfo) {
                info.fhPoint = sPointInfo
                let output = FootHoldUtils.getPointOutput(info.pos.x, info.pos.y)
                if (output) {
                    info.output = output
                }
                this.footHoldModel.warPoints[key] = info
                let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
                if (info && ctrl && info.fhPoint && info.fhPoint.playerId > 0 && info.fhPoint.playerId == this.roleModel.id) {
                    ctrl.setOutput(true)
                }
            }
        }
    }

    _returnMainPanel1() {
        FootHoldUtils.clearData()
        gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP37"))
        gdk.panel.open(PanelId.MainPanel)
    }


    _returnMainPanel2() {
        FootHoldUtils.clearData()
        let openTime = this.roleModel.CrossOpenTime * 1000;
        // let cfg = ConfigManager.getItemById(Cross_etcdCfg, this.roleModel.crossId)
        if (openTime) {
            // let openTime = new Date(`${cfg.cross_open[0]}/${cfg.cross_open[1]}/${cfg.cross_open[2]} ${cfg.cross_open[3]}:${cfg.cross_open[4]}`).getTime();
            openTime = Math.floor(openTime / 1000)
            let localActCfg = ConfigManager.getItemByField(ActivityCfg, "id", 62)
            let crossActCfg = ConfigManager.getItemByField(ActivityCfg, "id", 63)
            let openDay = crossActCfg.open_time[2]
            let closeDay = localActCfg.close_time[2]
            let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
            if (curTime >= openTime + closeDay * 86400 && curTime <= openTime + openDay * 86400) {
                let leftTime = openTime + openDay * 86400 - Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
                if (leftTime > 0) {
                    gdk.gui.showMessage(TimerUtils.format1(leftTime) + gdk.i18n.t("i18n:FOOTHOLD_TIP52"))
                    return
                }
            }
        }
        gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP38"))
        gdk.panel.open(PanelId.MainPanel)
    }

    _onFootholdBaseLvUpRsp(data: icmsg.FootholdBaseLevelRsp) {
        FootHoldUtils.updateGuildInfo(data)
        this.refreshPoints()
    }

    /**推荐阵营信息 */
    _updateRecommendGroup() {
        let cfg = FootHoldUtils.getRecommendCfg()
        if (cfg) {
            let groups = cfg.group
            for (let i = 0; i < this.groupItems.length; i++) {
                this.groupItems[i].active = false
            }
            for (let i = 0; i < groups.length; i++) {
                let item = this.groupItems[i]
                item.active = true
                let ctrl = item.getComponent(FHGroupItemCtrl)
                ctrl.setGruopDate(groups[i])
            }
        }
    }

    /**刷新据点信息 */
    refreshPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        if (!this.footHoldModel.globalMapData) return
        if (!this.footHoldModel.curMapData) return
        let warPoints = this.footHoldModel.warPoints;
        //刷新据点信息
        for (let key in warPoints) {
            let info: FhPointInfo = warPoints[key];
            let sPointInfo = FootHoldUtils.findFootHold(info.pos.x, info.pos.y)
            if (sPointInfo) {
                info.fhPoint = sPointInfo
                let output = FootHoldUtils.getPointOutput(info.pos.x, info.pos.y)
                if (output) {
                    info.output = output
                }
                this.footHoldModel.warPoints[key] = info
            }
            info.addState = []
            info.effectTowers = []
        }
        if (this.footHoldModel.curMapData.mapType != FhMapType.Base) {
            //统计城池信息
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
                    }
                    //占领城池 ，更新状态
                    cityCtrl.updateCity(parseInt(key), FootHoldUtils.findGuild(guildId))
                    if (this.footHoldModel.roleTempGuildId == guildId) {
                        FootHoldUtils.commitFhGuide(FhTeacheGuideType.event_4)
                    }
                } else {
                    if (cityCtrl.node) {
                        cityCtrl.updateCity(0, null)
                    }
                }
            }

            //统计buff塔信息
            let radioTypePoints = this.footHoldModel.radioTypePoints
            for (let key in radioTypePoints) {
                let points = radioTypePoints[key]
                let baseCount = 0
                let getCount = 0
                let tower_cfg = ConfigManager.getItemByField(Foothold_towerCfg, "tower_id", parseInt(key))
                //let guildId = this._getPointGuildId(points)
                for (let i = 0; i < points.length; i++) {
                    let info: FhPointInfo = points[i]
                    if (info.fhPoint && info.bonusType == 0 && info.bonusId == parseInt(key)) {
                        baseCount++
                    }
                }
                for (let i = 0; i < points.length; i++) {
                    let info: FhPointInfo = points[i]//
                    if (info.fhPoint && info.bonusType == 0 && info.bonusId == parseInt(key)) {
                        if (tower_cfg.buff && tower_cfg.buff > 0) {
                            getCount++
                        } else {
                            if (info.fhPoint.guildId > 0 && info.fhPoint.guildId == this.footHoldModel.roleTempGuildId) {
                                getCount++
                            }
                        }
                    }
                }
                //buff塔激活 塔的类型赋值
                let radioType = this.footHoldModel.radioTowerData[parseInt(key) - 1]
                for (let i = 0; i < points.length; i++) {
                    let info: FhPointInfo = this.footHoldModel.warPoints[`${points[i].pos.x}-${points[i].pos.y}`]
                    if (radioType != 0) {
                        if (baseCount > 0 && getCount > 0 && getCount >= baseCount) {
                            info.addState.push(radioType)
                        }
                        info.effectTowers.push(parseInt(key))
                    }
                    this.footHoldModel.warPoints[`${points[i].pos.x}-${points[i].pos.y}`] = info
                }
            }
        }

        //更新据点状态
        for (let key in warPoints) {
            let info: FhPointInfo = warPoints[key];
            let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
            if (ctrl) {
                ctrl.setOccupyName()
            }
            if (info) {
                let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
                if (ctrl) {
                    if (info.fhPoint && info.fhPoint.playerId > 0) {
                        ctrl.setPointOccupy()
                        if (info.fhPoint.status & 1) {
                            ctrl.fight.active = true
                        }
                        //据点产出（自己的）
                        if (info.fhPoint.playerId == this.roleModel.id) {
                            ctrl.setOutput()
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
                            ctrl.setPointFigth()
                        } else {
                            ctrl.setPointInit()
                            if (info.fhPoint && info.fhPoint.playerId == 0 && info.fhPoint.guildId > 0) {
                                ctrl.setGiveupState()
                            }
                        }
                    }
                }
            }
        }

        if (this.footHoldModel.gatherMode) {
            this._updateGatherModeState()
        }

        let cfgs = ConfigManager.getItems(Mission_guildCfg)
        let finishCount = 0
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].id != 1) {
                if (TaskUtil.getGuildTaskState(cfgs[i].id)) {
                    let state = this.taskModel.guildRewardIds[cfgs[i].id] || 0
                    if (state == 0) {
                        let ani = this.box.getComponent(cc.Animation)
                        ani.play("reward_shake")
                    } else {
                        finishCount++
                    }
                }
            }
        }

        if (finishCount == cfgs.length - 1) {
            let on = this.box.getChildByName("on")
            let off = this.box.getChildByName("off")
            on.active = false
            off.active = true
        }

        this.refreshMyPointsList()

        //触发引导
        let isGuide = GlobalUtil.getLocal("globalFh_guide") || false
        if (!isGuide) {
            let guild = FootHoldUtils.findGuild(this.roleModel.guildId)
            if (guild) {
                let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${guild.origin.x}-${guild.origin.y}`]
                if (ctrl) {
                    GlobalUtil.setLocal("globalFh_guide", true)
                    ctrl.setGuideActive()
                    GuideUtil.setGuideId(212000)
                }
            }
        }

        this.btnOneKeyPointScore.active = this.footHoldModel.curMapData.redPoint.points.length > 0

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


    /**展示辐射塔的效果范围 */
    showBuffEffect() {
        let warPointsCtrl = this.footHoldModel.warPointsCtrl
        let radioTypePoints = this.footHoldModel.radioTypePoints
        let pointsRecord = {}
        for (let key in radioTypePoints) {
            let points = radioTypePoints[key]
            let color = this.footHoldModel.radioTowerData[parseInt(key) - 1]
            for (let i = 0; i < points.length; i++) {
                let info: FhPointInfo = points[i]
                let ctrl: FootHoldPointCtrl = warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
                if (ctrl) {
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
    }

    @gdk.binding("footHoldModel.energy")
    _updateEnergy() {
        this.energyLab.string = `${this.footHoldModel.energy}/${FootHoldUtils.getInitEnergyValue()}`
        this.btnAdd.active = this.footHoldModel.engergyBought < FootHoldUtils.getEnergyMaxBuyTime()
    }

    _updateScoreRank() {
        let msg = new icmsg.FootholdCoopGuildListReq()
        NetManager.send(msg, (data: icmsg.FootholdCoopGuildListRsp) => {
            this.footHoldModel.cooperGuildList = data.guildList
            let list = data.guildList
            GlobalUtil.sortArray(list, (a, b) => {
                return b.guildInfo.score - a.guildInfo.score
            })

            for (let i = 0; i < list.length; i++) {
                if (list[i]) {
                    this.scoreRankItems[i].active = true
                    let ctrl = this.scoreRankItems[i].getComponent(FHScoreRankItemCtrl)
                    ctrl.updateViewInfo(list[i])
                }
            }

        })

    }

    //初始化跨服服务器名字
    async _initCroseServerName() {
        let guilds = this.footHoldModel.fhGuilds
        let ids = []
        for (let i = 0; i < guilds.length; i++) {
            if (guilds[i].id > 0) {
                ids.push(guilds[i].id);
            }
        }
        await ModelManager.get(ServerModel).reqServerNameByIds(ids, 2);
    }

    _getCityScore(guildId) {
        let datas = this.footHoldModel.cityScores
        return datas[guildId] ? datas[guildId] : 0
    }

    showRankNode() {
        if (!this.isShowRank) {
            this.rankNode.active = true
            this.arrow.scaleY = 1
            this.isShowRank = true
            this._updateScoreRank()
        } else {
            for (let i = 0; i < this.scoreRankItems.length; i++) {
                this.scoreRankItems[i].active = false
            }
            this.isShowRank = false
            this.rankNode.active = false
            this.arrow.scaleY = -1
        }
    }

    /**设置防守阵容 */
    setDefFunc() {
        gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 1, 2)
        gdk.panel.open(PanelId.RoleSetUpHeroSelector);
    }

    openRankFunc() {
        gdk.panel.open(PanelId.FHResultView)
    }

    openSmallMap() {
        gdk.panel.open(PanelId.FHSmallMap)
    }

    openProduceView() {
        gdk.panel.open(PanelId.FHProduceView)
    }

    /**公会协战 */
    openCooperFunc() {
        gdk.panel.open(PanelId.FHCooperationMain)
    }

    /**基地 */
    openBaseFunc() {
        let cfg = ConfigManager.getItemByField(Foothold_globalCfg, 'key', 'open');
        if (this.footHoldModel.activityIndex >= cfg.value[3]) {
            gdk.panel.open(PanelId.FHBaseRewardNew);
        }
        else {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:FOOTHOLD_TIP129'), cfg.value[3], this.footHoldModel.activityIndex, cfg.value[3]));
        }
    }

    /**
     * 参战人员列表
     */
    openCooperPlayerList() {
        gdk.panel.setArgs(PanelId.FHCooperationPlayerList, this.footHoldModel.roleTempGuildId)
        gdk.panel.open(PanelId.FHCooperationPlayerList)
    }


    openGuildShop() {
        if (JumpUtils.ifSysOpen(1708, true)) {
            JumpUtils.openPanel({
                panelId: PanelId.Store,
                panelArgs: { args: [0] },
                currId: this.node,
                callback: (panel) => {
                    let comp = panel.getComponent(StoreViewCtrl)
                    comp.typeBtnSelect(null, StoreBaseScoreTabType.Guild)
                    gdk.Timer.once(10, this, () => {
                        comp.typeBtnSelect(null, StoreBaseScoreTabType.Guild)
                    })
                }
            });
            return
        }
    }

    openGuess() {
        if (!this.footHoldModel.guessOpened) {
            if (this.footHoldModel.fhGuilds.length >= 2) {
                let leftTime = TimerUtils.getZerohour(GlobalUtil.getServerTime() / 1000) + 86400 - GlobalUtil.getServerTime() / 1000
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP149"), TimerUtils.format4(leftTime)))

            } else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP57"))
            }
            return
        }

        if (FootHoldUtils.getCurGuessRound() <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP92"))
            return
        }

        gdk.panel.open(PanelId.FHCrossGuessView)
    }

    openTaskView() {
        let roleModel = ModelManager.get(RoleModel)
        if (roleModel.guildId == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP41"))
            gdk.panel.open(PanelId.MainPanel)
            return
        }
        let ani = this.box.getComponent(cc.Animation)
        ani.stop("reward_shake")
        JumpUtils.openPanel({
            panelId: PanelId.Task,
            panelArgs: { args: [4] },
            currId: this.node
        });
    }

    oneKeyGetFunc() {
        if (this.footHoldModel.pointsOutputList.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FOOTHOLD_TIP6"))
            return
        }
        let msg = new icmsg.FootholdTakeOutputReq()
        msg.warId = this.footHoldModel.curMapData.warId
        msg.pos = new icmsg.FootholdPos()
        msg.all = true
        NetManager.send(msg, (data: icmsg.FootholdTakeOutputRsp) => {
            let goods = []
            if (data.exp > 0) {
                let good = new icmsg.GoodsInfo()
                good.typeId = FootHoldUtils.BaseExpId
                good.num = data.exp
                goods.push(good)
            }
            GlobalUtil.openRewadrView(goods.concat(data.list))

            let warPoints = this.footHoldModel.warPoints
            for (let key in warPoints) {
                let info: FhPointInfo = warPoints[key]
                info.output = []
            }
            this.footHoldModel.pointsOutputList = []
            this.btnOneKeyGet.active = false
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
        }, this)
    }

    showTimeNode() {
        if (!this.isShowTime) {
            this.timeNode.active = true
            this.isShowTime = true
            this._updateResetTime()
            this._updateTimeNode()
        } else {
            this.timeNode.active = false
            this.isShowTime = false
            this.unschedule(this._updateResetTime)
        }
    }

    _updateTimeNode() {
        this.schedule(this._updateResetTime, 1)
    }

    _updateResetTime() {
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let endTime = this.footHoldModel.recoverTime || 0
        let leftTime = endTime - curTime
        if (leftTime < 0 || FootHoldUtils.getInitEnergyValue() == this.footHoldModel.energy) {
            leftTime = 0
        }
        let timeLab1 = this.timeNode.getChildByName("timeLab1").getComponent(cc.Label)
        let timeLab2 = this.timeNode.getChildByName("timeLab2").getComponent(cc.Label)
        timeLab1.string = `${TimerUtils.format2(leftTime)}`
        let leftTime2 = 0
        if (FootHoldUtils.getInitEnergyValue() - this.footHoldModel.energy > 0) {
            let rTime = FootHoldUtils.getEnergyRecoverTime() * 60
            leftTime2 = (FootHoldUtils.getInitEnergyValue() - this.footHoldModel.energy - 1) * rTime
        }
        timeLab2.string = `${TimerUtils.format2(leftTime + leftTime2)}`
    }


    onScrolling() {
        if (this.tiledMapScrollView.isScrolling()) {
            //滚动清除所有效果
            this.tipLayer.removeAllChildren()
        } else {
            if (!this.tiledMapScrollView.isAutoScrolling()) {
                //界面不动触发飘动效果
            }
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.pointListItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _updatePointListState() {
        if (this.footHoldModel.isShowPointList) {
            this.pointsDownNode.active = true
            this.pointsUpNode.active = false
            this.footHoldModel.isShowPointList = true
            this.refreshMyPointsList()
        } else {
            this.pointsDownNode.active = false
            this.pointsUpNode.active = true
        }
    }


    showPointList() {
        if (!this.footHoldModel.isShowPointList) {
            this.pointsDownNode.active = true
            this.pointsUpNode.active = false
            this.footHoldModel.isShowPointList = true
            this.refreshMyPointsList()

        } else {
            this.footHoldModel.isShowPointList = false
            this.pointsDownNode.active = false
            this.pointsUpNode.active = true
        }
    }

    refreshMyPointsList() {
        if (!this.footHoldModel.isShowPointList) {
            return
        }
        // this.refreshMarkPointList()
        this.selectPointType(null, this._selectPointType)
    }

    _selectPointType = 0
    /**选择页签, 据点类型*/
    selectPointType(e, utype) {
        this._selectPointType = parseInt(utype)
        for (let idx = 0; idx < this.typeBtns.length; idx++) {
            const element = this.typeBtns[idx];
            element.interactable = idx != this._selectPointType
            let select = element.node.getChildByName("select")
            select.active = idx == this._selectPointType
        }

        this._initListView()
        let myPoints = []//据点
        let towerPoints = []//辐射塔
        let warPoints = this.footHoldModel.warPoints;
        //刷新据点信息
        if (this._selectPointType == 1) {
            for (let key in this.footHoldModel.markFlagPoints) {
                myPoints.push(warPoints[key])
            }
        } else {
            for (let key in warPoints) {
                let info: FhPointInfo = warPoints[key];
                if (this._selectPointType == 0) {
                    if (info.fhPoint && info.fhPoint.playerId == this.roleModel.id) {
                        if (info.bonusType == 0) {
                            towerPoints.push(info)
                        } else {
                            myPoints.push(info)
                        }
                    }
                } else if (this._selectPointType == 2) {
                    if (info.fhPoint && info.fhPoint.guildId == this.footHoldModel.roleTempGuildId && (info.fhPoint.status & 8)) {
                        myPoints.push(info)
                    }
                } else if (this._selectPointType == 3) {
                    if (info.fhPoint && info.fhPoint.guildId == this.footHoldModel.roleTempGuildId && (info.fhPoint.status & 4)) {
                        myPoints.push(info)
                    }
                }
            }
        }

        GlobalUtil.sortArray(myPoints, (a: FhPointInfo, b: FhPointInfo) => {
            if (a.type == b.type) {
                if (!b.fhPoint || !a.fhPoint) {
                    return b.type - a.type
                }
                return b.fhPoint.statusEndtime - a.fhPoint.statusEndtime
            }
            return b.type - a.type
        })

        GlobalUtil.sortArray(towerPoints, (a: FhPointInfo, b: FhPointInfo) => {
            if (a.bonusId == b.bonusId) {
                if (!b.fhPoint || !a.fhPoint) {
                    return a.bonusId - b.bonusId
                }
                return b.fhPoint.statusEndtime - a.fhPoint.statusEndtime
            }
            return a.bonusId - b.bonusId
        })
        let desStr = ["i18n:FOOTHOLD_TIP42", "i18n:FOOTHOLD_TIP85", "i18n:FOOTHOLD_TIP150", "i18n:FOOTHOLD_TIP151"]
        this.list.set_data(myPoints.concat(towerPoints), false)
        let myLab = this.pointsDownNode.getChildByName("myLab").getComponent(cc.Label)
        myLab.string = StringUtils.format(gdk.i18n.t(desStr[this._selectPointType]), myPoints.length) //`我的据点(${myPoints.length}个)`
    }


    onOpenTeachView() {
        gdk.panel.setArgs(PanelId.FootHoldTeaching, 2)
        gdk.panel.open(PanelId.FootHoldTeaching)
    }


    updateViewMode() {
        if (this.footHoldModel.isGuessMode) {
            this.energyLab.node.parent.active = false
            this.teachNode.active = false
            this.pointsDownNode.active = false
            this.pointsUpNode.active = false
            this.btnDef.active = false
            this.btnBase.active = false
            this.btnMember.active = false
            this.taskBox.active = false
            this.btnOneKeyGet.active = false
            this.btnOneKeyPointScore.active = false
            this.titleLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP53")
            this.guessModeLab.node.active = true
            this.guessModeLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP54")
            this.militaryRankIcon.active = false
            this.hideChooseNode.active = false
            this.showChooseNode.active = false
        }
    }

    showWorldTipNode() {
        if (!this._tipShow) {
            this._tipShow = true
            this.worldTipNode.active = true
            let bgNode = this.worldTipNode.getChildByName("bg")
            let tip1 = bgNode.getChildByName("tip1").getComponent(cc.RichText)
            let tip2 = bgNode.getChildByName("tip2").getComponent(cc.RichText)
            let g_cfg = ConfigManager.getItemById(GlobalCfg, "world_level_num")
            tip1.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP55"), g_cfg.value[0])//`世界等级由本服等级<color=#92ff55>前${g_cfg.value[0]}名</c>玩家\n的等级决定`
            tip2.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP56"), this.footHoldModel.worldLevel)//`当前世界等级：<color=#92ff55>${this.footHoldModel.worldLevel}级</c>`
        } else {
            this.hideWorldTipNode()
        }
    }

    hideWorldTipNode() {
        this._tipShow = false
        this.worldTipNode.active = false
    }

    @gdk.binding("footHoldModel.militaryExp")
    _updateMilitaryInfo() {
        let lv = this.footHoldModel.militaryRankLv
        this.militaryRankLab.string = `${MilitaryRankUtils.getName(lv)}`
        GlobalUtil.setSpriteIcon(this.node, this.militaryRankIcon, MilitaryRankUtils.getIcon(lv))
    }

    openMilitaryRankView() {
        gdk.panel.open(PanelId.MilitaryRankView)
    }

    /**展示选择窗口 */
    showChoosePanel() {
        this.hideChooseNode.active = false
        this.showChooseNode.active = true
        this.showChooseNode.x = this.showChooseNode.x + this.showChooseNode.width
        this._initCheckBtns()
        this.showChooseNode.runAction(cc.moveTo(0.3, cc.v2(360, this.showChooseNode.y)))
    }

    /**隐藏选择窗口 */
    hideChoosePanel() {
        let action = cc.sequence(cc.moveTo(0.3, cc.v2(this.showChooseNode.x + this.showChooseNode.width, this.showChooseNode.y)), cc.callFunc(() => {
            this.showChooseNode.active = false
            this.hideChooseNode.active = true
        }))
        this.showChooseNode.runAction(action)
    }

    _initCheckBtns() {
        for (let i = 0; i < this.checkBtns.length; i++) {
            let on = this.checkBtns[i].getChildByName("on")
            let off = this.checkBtns[i].getChildByName("off")
            on.active = this.footHoldModel.chooseState[i]
            off.active = !this.footHoldModel.chooseState[i]
        }

        if (this.footHoldModel.chooseState[0]) {
            this._updateCheck0State()
        } else if (this.footHoldModel.chooseState[1]) {
            this._updateCheck1State()
        } else if (this.footHoldModel.chooseState[2]) {
            this._updateCheck2State()
        } else {
            this._updateBaseState()
        }

        if (this.footHoldModel.markMode) {
            let tag = ConfigManager.getItemById(Foothold_globalCfg, "tag").value[0]
            this.markTipLab.string = ''
            this.markTipLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP152"), FootHoldUtils.getMarkPointsNum(), tag)
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
    }

    /**原本显示状态 */
    _updateBaseState() {
        this.refreshPoints()
    }

    /**联盟显示状态 */
    _updateCheck0State() {
        let warPoints = this.footHoldModel.warPoints;
        for (let key in warPoints) {
            let info: FhPointInfo = warPoints[key];
            let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
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
        }
    }

    /**辐射塔显示状态 */
    _updateCheck1State() {
        this.showBuffEffect()
    }

    /** 进攻标记状态*/
    _updateCheck2State() {
        let warPoints = this.footHoldModel.warPoints;
        for (let key in warPoints) {
            let info: FhPointInfo = warPoints[key];
            let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
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
                    ctrl.markFlagTip.parent = this.tiledMap.cityLayer
                    ctrl.markFlagTip.position = cc.v2(info.mapPoint.x, info.mapPoint.y + ctrl.occupyNode.height)
                    let lab = ctrl.markFlagTip.getChildByName("label").getComponent(cc.RichText)
                    lab.string = StringUtils.setRichtOutLine(this.footHoldModel.markFlagPoints[`${info.pos.x}-${info.pos.y}`].msg, "#0f0603", 2)
                }
            }
        }
    }

    @gdk.binding("footHoldModel.myAlliance")
    _updateAllianceChatBtnState() {
        if (this.footHoldModel.myAlliance.length > 1) {
            this.allianceChatBtn.active = true
        } else {
            this.allianceChatBtn.active = false
        }
    }

    onOpenAllianceChat() {
        gdk.panel.open(PanelId.FHChatView)
    }

    @gdk.binding("chatModel.allianceMsgCount")
    _updateAllianceMsgNum() {
        let bg = this.allianceChatBtn.getChildByName("bg")
        bg.active = false
        let msgNum = this.allianceChatBtn.getChildByName("msgNum").getComponent(cc.Label)
        msgNum.string = ''
        if (this.chatModel.allianceMsgCount > 0) {
            bg.active = true
            msgNum.string = `${this.chatModel.allianceMsgCount}`
        }
    }


    @gdk.binding("footHoldModel.gatherMode")
    _updateGatherModeState() {
        //据点战 组队集结状态更新
        if (!this.footHoldModel.pointDetailInfo) {
            return
        }
        let detailInfo = this.footHoldModel.pointDetailInfo
        this.gatherMask.active = this.footHoldModel.gatherMode
        let warPoints = this.footHoldModel.warPoints
        let pointsMap = FootHoldUtils.getGatherAroundPoints(detailInfo.pos.x, detailInfo.pos.y)
        if (this.footHoldModel.gatherMode) {
            for (let key in warPoints) {
                let info: FhPointInfo = warPoints[key];
                let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
                if (ctrl) {
                    if (pointsMap[`${info.pos.x}-${info.pos.y}`]) {
                        ctrl.setOperateGatherAtkState(true)
                    } else {
                        ctrl.setOperateGatherAtkState(false)
                    }
                }
            }
            let fhPointInfo: FhPointInfo = warPoints[`${detailInfo.pos.x}-${detailInfo.pos.y}`]
            this.tiledMapScrollView.stopAutoScroll()
            this.tiledMap.node.setPosition((-fhPointInfo.mapPoint.x) * 0.8, (-fhPointInfo.mapPoint.y - this.tiledMap.tiledMap.getTileSize().height / 2) * 0.8);
            this.tiledMapScrollView.enabled = false
            ChatUtils.updateMiniChatPanel(false)
        } else {
            this.tiledMapScrollView.enabled = true
            ChatUtils.updateMiniChatPanel(true)
        }
    }

    onQuitGather() {
        this.footHoldModel.gatherMode = false
        this.refreshPoints()
        gdk.panel.open(PanelId.FHBattleArrayView)
    }

    //全图标记
    _updateMarkModeState() {
        let isShow = !this.footHoldModel.markMode
        this.btnBase.parent.active = isShow
        this.teachNode.active = isShow
        this.btnMap.active = isShow
        this.btnCooper.active = isShow
        this.btnMember.active = isShow
        this.btnOneKeyGet.active = isShow
        this.btnOneKeyPointScore.active = isShow
        this.militaryRankIcon.active = isShow
        this.hideChooseNode.active = isShow
        if (this.showChooseNode.active) this.showChooseNode.active = isShow
        this.energyLab.node.parent.active = isShow
        this.crossLab.node.parent.active = isShow
        this.arrow.parent.active = isShow
        this.rankNode.active = isShow
        this.pointsUpNode.active = isShow
        if (this.pointsDownNode.active) this.pointsDownNode.active = isShow
        this.allianceChatBtn.active = isShow
        this._closeBtn.node.active = isShow
        this.markTipLab.node.active = !isShow

        if (isShow) {
            this.footHoldModel.chooseState[2] = false
        } else {
            this.footHoldModel.chooseState[2] = true
        }
        this._initCheckBtns()
    }

    onSetMarkMode() {
        if (!FootHoldUtils.isPlayerCanMark) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP153"))
            return
        }
        this.footHoldModel.markMode = true
        let mark = this.btnMark.getChildByName("mark")
        let quitMark = this.btnMark.getChildByName("quitMark")
        GlobalUtil.setSpriteIcon(this.btnMark, mark, "view/guild/texture/footHold/gh_biaojizhong")
        quitMark.active = true
        this._updateMarkModeState()
    }

    onQuitMarkMode() {
        this.footHoldModel.markMode = false
        let mark = this.btnMark.getChildByName("mark")
        let quitMark = this.btnMark.getChildByName("quitMark")
        GlobalUtil.setSpriteIcon(this.btnMark, mark, "view/guild/texture/footHold/gh_jinggongbiaoji")
        quitMark.active = false
        this._updateMarkModeState()
    }


    onOneKeyPointScoreFunc() {
        let posList = this.footHoldModel.curMapData.redPoint.points
        let msg = new icmsg.FootholdPointScoreReq()
        msg.warId = this.footHoldModel.curMapData.warId
        msg.posList = posList
        NetManager.send(msg, (data: icmsg.FootholdPointScoreRsp) => {
            this.btnOneKeyPointScore.active = false
            GlobalUtil.openRewadrView(data.list)
            this.footHoldModel.curMapData.redPoint.points = []
            //更新红点状态
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
        })
    }

    onCheckFunc() {
        this.footHoldModel.globalShowMyPoint = !this.footHoldModel.globalShowMyPoint
        this._updateCheckState()
        this.refreshPoints()
    }

    _updateCheckState() {
        let on = this.myCheck.getChildByName("on")
        let off = this.myCheck.getChildByName("off")
        on.active = this.footHoldModel.globalShowMyPoint
        off.active = !this.footHoldModel.globalShowMyPoint
    }

}

export type FhScoreRankInfo = {
    id: number,
    name: string,
    bottom: number,
    frame: number,
    icon: number,
    score: number
}


export type FhRankInfo = {
    index: number,
    type: number,
    id: number,
    name: string,
    bottom: number,
    frame: number,
    icon: number,
    score: number,
    reward: any,
}