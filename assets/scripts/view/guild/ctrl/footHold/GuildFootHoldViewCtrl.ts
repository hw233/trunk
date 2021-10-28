import ConfigManager from '../../../../common/managers/ConfigManager';
import ErrorManager from '../../../../common/managers/ErrorManager';
import FHGroupItemCtrl from './FHGroupItemCtrl';
import FootHoldModel, { FhGuildRankInfo, FhMapType, FhPointInfo } from './FootHoldModel';
import FootHoldPointCtrl from './FootHoldPointCtrl';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import GuildFhMapCtrl from './GuildFhMapCtrl';
import GuildFhTaskCtrl from './GuildFhTaskCtrl';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StoreViewCtrl, { StoreBaseScoreTabType } from '../../../store/ctrl/StoreViewCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import TaskModel from '../../../task/model/TaskModel';
import TaskUtil from '../../../task/util/TaskUtil';
import TimerUtils from '../../../../common/utils/TimerUtils';
import {
    Foothold_bgCfg,
    Foothold_globalCfg,
    Foothold_rankingCfg,
    GlobalCfg
    } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-14 17:58:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/GuildFootHoldViewCtrl")
export default class GuildFootHoldViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    rankNode: cc.Node = null

    @property(cc.Node)
    groupItems: cc.Node[] = []

    @property(GuildFhMapCtrl)
    tiledMap: GuildFhMapCtrl = null
    @property(cc.ScrollView)
    tiledMapScrollView: cc.ScrollView = null

    @property(cc.Label)
    energyLab: cc.Label = null

    @property(cc.Label)
    precentLab: cc.Label = null

    @property(cc.Node)
    proBarMask: cc.Node = null

    @property(cc.Node)
    guildPointNodes: cc.Node[] = []

    @property(cc.Node)
    proBar: cc.Node = null

    @property(cc.Label)
    tipLab: cc.Label = null

    @property(cc.Node)
    timeNode: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rankItem: cc.Prefab = null

    @property(cc.Node)
    upBg: cc.Node = null

    @property(cc.Node)
    downBg: cc.Node = null

    @property(cc.Node)
    box: cc.Node = null

    @property(cc.Node)
    btnAdd: cc.Node = null

    @property(cc.Node)
    taskNode: cc.Node = null

    @property(cc.Label)
    enterWarLab: cc.Label = null

    @property(cc.Label)
    rewardLab: cc.Label = null

    @property(cc.Node)
    crossTip: cc.Node = null

    @property(cc.Node)
    worldTipNode: cc.Node = null;

    @property(cc.Node)
    btnCooper: cc.Node = null

    @property(cc.Node)
    btnOneKeyPointScore: cc.Node = null

    @property(cc.Node)
    myCheck: cc.Node = null

    list: ListView = null;

    _tipShow = false

    isShowRank = false
    isShowTime = false
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onLoad() {
        //top公会信息
        let msg2 = new icmsg.FootholdTop6GuildReq()
        NetManager.send(msg2)
    }

    onEnable() {

        if (!this.footHoldModel.guildMapData) {
            return
        }
        ErrorManager.on(3317, this._returnMainPanel1, this);
        ErrorManager.on(3318, this._returnMainPanel2, this);

        let g_open = ConfigManager.getItemByField(Foothold_globalCfg, "key", "open").value[5]
        if (this.footHoldModel.activityIndex >= g_open) {
            this.btnCooper.active = true
        }

        // 请求地图信息
        let msg = new icmsg.FootholdMapEnterReq()
        msg.warId = this.footHoldModel.guildMapData.warId
        NetManager.send(msg, (data: icmsg.FootholdMapEnterRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.footHoldModel.fhGuilds = data.guilds;
            this.footHoldModel.fhPlayers = data.players;
            this.footHoldModel.fhPoints = data.points;
            this.footHoldModel.fightPoint = data.fightingPos;
            this.footHoldModel.worldLevelIndex = data.worldLevelIdx
            this.footHoldModel.curMapData = {
                warId: this.footHoldModel.guildMapData.warId,
                mapId: data.mapId,
                mapType: data.mapType,
                redPoint: this.footHoldModel.guildMapData.redPoint,
                rndSeed: data.rndSeed,
            };

            let bgPath = 'view/guild/texture/bg/gh_changjingbg'
            let bgCfg = ConfigManager.getItemByField(Foothold_bgCfg, "map_id", data.mapId)
            if (bgCfg) {
                bgPath = `view/guild/texture/bg/${bgCfg.background}`
            }
            GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath)

            // 加载并初始化地图
            gdk.rm.loadRes(this.resId, `tileMap/foothold/${data.mapId}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.tiledMap.initMap(this, tmx);
                this.tiledMap.resetSize()
                gdk.e.on(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST, this.refreshPoints, this);
            });
        }, this);
        this._updateRecommendGroup()
        this._updateEnergy()

        let cfgs = ConfigManager.getItems(Foothold_rankingCfg, { map_type: FhMapType.Elite, index: this.footHoldModel.worldLevelIndex })
        this.tipLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP45"), cfgs.length)//`占领据点前${cfgs.length}名公会`

        let g_msg = new icmsg.FootholdGuideQueryReq()
        NetManager.send(g_msg)

        if (FootHoldUtils.isCrossWar) {
            this.enterWarLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP48")
            this.rewardLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP48") + gdk.i18n.t("i18n:FOOTHOLD_TIP49") + ":"
            this.crossTip.active = false
        } else {
            this.enterWarLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP47")
            this.rewardLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP47") + gdk.i18n.t("i18n:FOOTHOLD_TIP49") + ":"
            this.crossTip.active = true
        }

        this._updateCheckState()
    }

    onDisable() {
        gdk.e.targetOff(this)
        this.unscheduleAllCallbacks()
        ErrorManager.targetOff(this);
    }

    _returnMainPanel1() {
        FootHoldUtils.clearData()
        gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP37"))
        gdk.panel.open(PanelId.MainPanel)
    }

    _returnMainPanel2() {
        FootHoldUtils.clearData()
        gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP38"))
        gdk.panel.open(PanelId.MainPanel)
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

    // /**最早通关公会信息 */
    @gdk.binding("footHoldModel.topGuildList")
    _updateTopGuild() {
        let cfgs = ConfigManager.getItems(Foothold_rankingCfg, { map_type: FhMapType.Elite, index: this.footHoldModel.worldLevelIndex })
        this.guildPointNodes.forEach((element, index) => {
            if (index >= cfgs.length) {
                element.parent.active = false
            }
            if (this.footHoldModel.topGuildList[index]) {
                element.active = true
            }
        })
    }

    @gdk.binding("footHoldModel.energy")
    _updateEnergy() {
        this.energyLab.string = `${this.footHoldModel.energy}/${FootHoldUtils.getInitEnergyValue()}`
        this.btnAdd.active = this.footHoldModel.engergyBought < FootHoldUtils.getEnergyMaxBuyTime()
    }


    /**刷新据点信息 */
    refreshPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        if (!this.footHoldModel.guildMapData) return;
        let warPoints = this.footHoldModel.warPoints;
        //刷新据点信息
        for (let key in warPoints) {
            let info: FhPointInfo = warPoints[key];
            let sPointInfo = FootHoldUtils.findFootHold(info.pos.x, info.pos.y)
            if (sPointInfo) {
                info.fhPoint = sPointInfo
                this.footHoldModel.warPoints[key] = info
            }
        }

        //更新据点状态
        for (let key in warPoints) {
            let info: FhPointInfo = warPoints[key];
            let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
            if (ctrl) {
                ctrl.setOccupyName()
                GlobalUtil.setGrayState(ctrl.pointIcon, 0)

                if (this.footHoldModel.localShowMyPoint) {
                    if (info && (info.fhPoint && info.fhPoint.playerId != ModelManager.get(RoleModel).id)) {
                        ctrl.occupyNode.active = false
                        ctrl.occupyName.active = false
                        ctrl.pointIcon.active = true
                    }
                }
            }
            //点已被占据，刷新2格之内的点的信息
            if (info && ((info.fhPoint && info.fhPoint.playerId > 0) || info.type == 0)) {
                //第一圈
                let firstPoints = this._checkRoundPoints(info.pos.x, info.pos.y)
                //第二圈
                for (let i = 0; i < firstPoints.length; i++) {
                    this._checkRoundPoints(firstPoints[i].x, firstPoints[i].y)
                }
            }
        }

        let ownNum = FootHoldUtils.getOccupiedPointsCount()
        let totalNum = FootHoldUtils.getTotalPointsCount()
        this.precentLab.string = `${(ownNum / totalNum * 100).toFixed(1)}%`
        this.proBarMask.width = ownNum / totalNum * this.proBar.width

        if (TaskUtil.getGuildTaskState(1)) {
            let state = this.taskModel.guildRewardIds[1] || 0
            if (state == 0) {
                let ani = this.box.getComponent(cc.Animation)
                ani.play("reward_shake")
            } else {
                let on = this.box.getChildByName("on")
                let off = this.box.getChildByName("off")
                on.active = false
                off.active = true
            }
        }

        let taskCtrl = this.taskNode.getComponent(GuildFhTaskCtrl)
        taskCtrl.updateBoxState()

        //触发引导
        let isGuide = GlobalUtil.getLocal("guildFh_guide") || false
        if (!isGuide) {
            for (let key in warPoints) {
                let info: FhPointInfo = warPoints[key];
                if (info && ((info.fhPoint && info.fhPoint.playerId > 0) || info.type == 0)) {
                    let points = this._checkRoundPoints(info.pos.x, info.pos.y)
                    for (let i = 0; i < points.length; i++) {
                        let info: FhPointInfo = warPoints[`${points[i].x}-${points[i].y}`];
                        if (!info.fhPoint && info.type != 10) {
                            let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
                            this.guideMovePos(info)
                            GlobalUtil.setLocal("guildFh_guide", true)
                            ctrl && ctrl.setGuideActive()
                            GuideUtil.setGuideId(210018)
                            break
                        }
                    }
                }
            }
        }

        this.btnOneKeyPointScore.active = this.footHoldModel.curMapData.redPoint.points.length > 0
    }

    _checkRoundPoints(x, y) {
        let round1 = [cc.v2(x - 1, y - 1),
        cc.v2(x - 2, y),
        cc.v2(x - 1, y + 1),
        cc.v2(x + 1, y + 1),
        cc.v2(x + 2, y),
        cc.v2(x + 1, y - 1)]
        let points = round1
        let warPoints = this.footHoldModel.warPoints
        let tempPoints = []
        for (let i = 0; i < points.length; i++) {
            let info: FhPointInfo = warPoints[`${points[i].x}-${points[i].y}`];
            if (info) {
                let ctrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${info.pos.x}-${info.pos.y}`]
                if (ctrl) {
                    if (info.fhPoint && info.fhPoint.playerId > 0) {
                        ctrl.setPointOccupy()

                        if (this.footHoldModel.localShowMyPoint) {
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
                        }
                    }
                }
                if (info.type != 9) {
                    tempPoints.push(info.pos)
                }
            }
        }
        return tempPoints
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

    showRankNode() {
        if (!this.isShowRank) {
            this.rankNode.active = true
            this.downBg.active = true
            this.upBg.active = false
            this.isShowRank = true

            this._updateRankView()
        } else {
            this.isShowRank = false
            this.downBg.active = false
            this.upBg.active = true
            this.rankNode.active = false

        }
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

    openRankFunc() {
        // gdk.panel.setArgs(PanelId.FHRankView, 1)
        // gdk.panel.open(PanelId.FHRankView)
        gdk.panel.open(PanelId.FHResultView)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rankItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _updateRankView() {
        this._initListView()
        let datas = []
        let nullDatas = []
        let msg = new icmsg.FootholdRankingReq()
        NetManager.send(msg, (data: icmsg.FootholdRankingRsp) => {
            let maxNum = data.list.length > 10 ? data.list.length : 10
            for (let i = 0; i < maxNum; i++) {
                if (data.list[i]) {
                    let info: FhGuildRankInfo = {
                        index: i + 1,
                        data: data.list[i]
                    }
                    datas.push(info)
                } else {
                    nullDatas.push(null)
                }
            }
            GlobalUtil.sortArray(datas, (a: FhGuildRankInfo, b: FhGuildRankInfo) => {
                return b.data.clearNum - a.data.clearNum
            })
            this.list.set_data(datas.concat(nullDatas))
        }, this)
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


    guideMovePos(point: FhPointInfo) {
        let n = this.node as cc.Node;
        let s = this.tiledMap.tiledMap.getTileSize();
        let h = n.height * n.anchorY;
        let w = n.width * n.anchorX;
        let y = Math.min(0, -point.mapPoint.y + h);
        this.tiledMap.node.setPosition((-point.mapPoint.x - w + s.width * 3) * 0.8, (y - h - s.height) * 0.8);
    }


    onOpenTeachView() {
        gdk.panel.setArgs(PanelId.FootHoldTeaching, 1)
        gdk.panel.open(PanelId.FootHoldTeaching)
    }


    openCrossTip() {
        gdk.panel.open(PanelId.FHCrossTip)
    }

    /**公会协战 */
    openCooperFunc() {
        gdk.panel.open(PanelId.FHCooperationMain)
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
        this.footHoldModel.localShowMyPoint = !this.footHoldModel.localShowMyPoint
        this._updateCheckState()
        this.refreshPoints()
    }

    _updateCheckState() {
        let on = this.myCheck.getChildByName("on")
        let off = this.myCheck.getChildByName("off")
        on.active = this.footHoldModel.localShowMyPoint
        off.active = !this.footHoldModel.localShowMyPoint
    }

}