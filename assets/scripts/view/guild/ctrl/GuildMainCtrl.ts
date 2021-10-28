import ActUtil from '../../act/util/ActUtil';
import ChatModel from '../../chat/model/ChatModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import FootHoldModel, { FhMapType } from './footHold/FootHoldModel';
import FootHoldUtils from './footHold/FootHoldUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import GuildCampItem from './GuildCampItem';
import GuildModel from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import LoginModel from '../../../common/models/LoginModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import PveRes from '../../pve/const/PveRes';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import SiegeModel from './siege/SiegeModel';
import StoreViewCtrl, { StoreBaseScoreTabType } from '../../store/ctrl/StoreViewCtrl';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ActivityCfg, Siege_appearanceCfg, Siege_globalCfg } from '../../../a/config';
import { GuildEventId } from '../enum/GuildEventId';
import { MercenaryEventId } from '../../mercenary/enum/MercenaryEventId';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-13 15:16:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildMainCtrl")
export default class GuildMainCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Label)
    guildName: cc.Label = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    camps: Array<GuildCampItem> = [];

    @property(cc.Node)
    enterNode: cc.Node = null;

    @property(cc.Node)
    crossEnterNode: cc.Node = null;

    @property(cc.Label)
    endTimeLab: cc.Label = null;

    @property(cc.Label)
    crossOpenTimeLab: cc.Label = null;

    @property(sp.Skeleton)
    guideSpine: sp.Skeleton = null;

    @property(cc.Node)
    pointsNode: cc.Node = null;

    @property(cc.Node)
    siegeTitle: cc.Node = null;

    @property(cc.Label)
    siegeTimeLab: cc.Label = null;

    @property(cc.Label)
    siegeTimeLab2: cc.Label = null;

    @property(cc.Node)
    siegeNode: cc.Node = null;

    @property(cc.Node)
    siegeGate: cc.Node = null;

    @property(cc.Node)
    spineNode: cc.Node = null;

    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;

    @property(cc.Label)
    hpLab: cc.Label = null;

    @property(cc.Node)
    btnSiegeMain: cc.Node = null;

    @property(sp.Skeleton)
    bSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    sSpine: sp.Skeleton[] = [];

    @property(cc.Node)
    expeditionTip: cc.Node = null;

    campsList: GuildCampItem[] = []

    _siegeStartTime: number = 0
    _siegeEndTime: number = 0
    _siegeOverTime: number = 0
    _siegeRoadPoints: cc.Vec2[] = []


    get model() { return ModelManager.get(GuildModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get siegeModel() { return ModelManager.get(SiegeModel); }

    _leftTime = 0

    onEnable() {

        let msg = new icmsg.GuildCampReq()
        NetManager.send(msg, (data: icmsg.GuildCampRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.enabled) return;
            this.model.guildCamp = data.camp
            gdk.e.emit(GuildEventId.REQ_GUILD_DETAIL, this.model.guildCamp.guild.id)
        })
        this.initCamps()
        gdk.e.emit(GuildEventId.REQ_GUILD_SIGN_INFO)
        gdk.e.on(MercenaryEventId.MERCENARY_SET_REFRESH_HERO, this.updateGuildCamps, this)//刷新状态

        if (!this.footHoldModel.guildMapData || !this.footHoldModel.globalMapData) {
            let msg2 = new icmsg.FootholdRedPointsReq()
            NetManager.send(msg2, () => {
                this._updateFootholdRedPointsRsp()
            })
        } else {
            this._updateFootholdRedPointsRsp()
        }

        this._createCrossOpenTime()

        this.footHoldModel.isShowPointList = false
        // this.node.getChildByName('bg').y = -gdk.gui.guiLayer.y;
        if (gdk.gui.layers.viewLayer.height > 1300) {
            this.scrollview.enabled = false
        }

        //丧尸攻城活动是否开启
        if (this.siegeModel.isActivityOpen) {
            this._initSiege()
            this._updateHp()
            this.spineNode.parent.zIndex = 99
        } else {
            this.hpBar.node.parent.active = false
            this.btnSiegeMain.active = false
            this.spineNode.parent.active = false
            this._createSiegeStartTime()
        }
        //据点标记信息
        let markMsg = new icmsg.FootholdAtkFlagGetReq()
        NetManager.send(markMsg)

        if (this.footHoldModel.myAlliance.length == 0) {
            //联盟信息请求
            let a_msg = new icmsg.FootholdAllianceReq()
            NetManager.send(a_msg)
        }

        let chatModel = ModelManager.get(ChatModel)
        if (chatModel.AllianceMessages.length == 0) {
            //联盟聊天历史信息
            let aChatmsg = new icmsg.FootholdAChatHisReq()
            NetManager.send(aChatmsg)
        }

        this.expeditionTip.active = ActUtil.ifActOpen(114)
    }

    @gdk.binding("siegeModel.weekBlood")
    _updateHp() {
        let hp = this.siegeModel.gateTotalHP - (this.siegeModel.curBossTotalHP * this.siegeModel.bossHpCheckDay - this.siegeModel.weekBlood)
        hp = hp >= 0 ? hp : 0
        this.hpBar.progress = hp / this.siegeModel.gateTotalHP
        this.hpLab.string = `${hp}`
    }

    _updateFootholdRedPointsRsp() {
        //请求据点战相关信息
        let infoMsg = new icmsg.FootholdRoleInfoReq()
        NetManager.send(infoMsg, (data: icmsg.FootholdRoleInfoRsp) => {
            if (this.footHoldModel.globalMapData) {
                if (FootHoldUtils.isCrossWar) {
                    this.enterNode.active = false
                    this.crossEnterNode.active = true
                } else {
                    this.enterNode.active = true
                    this.crossEnterNode.active = false
                }
                this._createEndTime()
            } else {
                let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
                if (curTime > data.startTime && curTime < data.endTime && data.guessOpened) {
                    if (FootHoldUtils.isCrossWar) {
                        this.enterNode.active = false
                        this.crossEnterNode.active = true
                    } else {
                        this.enterNode.active = true
                        this.crossEnterNode.active = false
                    }
                    this._createEndTime()
                }
            }
        }, this)
    }

    onDisable() {
        gdk.e.targetOff(this)
        NetManager.targetOff(this)
        this.campsList = []
        GuideUtil.bindGuideNode(614)
        this.footHoldModel.chooseState = [false, false, false]
        this.footHoldModel.localShowMyPoint = false
        this.footHoldModel.globalShowMyPoint = false

        this._clearEndTimer()
        this._clearOpenTimer()
        this._clearSiegeTime()
        this._clearSiegeStartTime()
    }

    initCamps() {
        for (let i = 0; i < this.camps.length; i++) {
            let ctrl = this.camps[i].getComponent(GuildCampItem)
            ctrl.updateData(i + 1, "", this)
            this.campsList.push(ctrl)
        }
    }

    refreshCamps() {
        for (let i = 0; i < this.camps.length; i++) {
            let ctrl = this.camps[i].getComponent(GuildCampItem)
            ctrl.hideOperateNode()
        }
    }

    showMask() {
        this.guideSpine.node.active = false
        this.maskNode.active = true
    }

    hideMask() {
        this.maskNode.active = false
        this.refreshCamps()
    }

    @gdk.binding("model.guildCamp")
    updateGuildMain() {
        if (!this.model.guildCamp) {
            return
        }
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this.model.guildCamp.guild.icon))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this.model.guildCamp.guild.frame))
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this.model.guildCamp.guild.bottom))
        this.guildName.string = this.model.guildCamp.guild.name
        this.updateGuildCamps()
    }

    @gdk.binding("model.guildCamp.campers")
    updateGuildCamps() {
        if (!this.model.guildCamp) {
            return
        }
        let campers = this.model.guildCamp.campers
        for (let j = 0; j < this.campsList.length; j++) {
            this.campsList[j].updateData(j + 1, "", this)
            for (let i = 0; i < campers.length; i++) {
                this.campsList[j].node.zIndex = campers[i].pos
                if (campers[i].pos == this.campsList[j].pos) {
                    this.campsList[j].updateData(campers[i].pos, campers[i].name, this)
                }
            }
        }
    }

    @gdk.binding("model.guildDetail")
    refreshGuildCamps() {
        if (!this.model.guildDetail) {
            return
        }
        for (let j = 0; j < this.campsList.length; j++) {
            this.campsList[j].updateIcon()
        }
    }

    /**公会详情 */
    openDetailFunc() {
        if (!GuildUtils.isHoldCamp()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP41"))
            this._guideSetCamp()
            return
        }

        JumpUtils.openPanel({
            panelId: PanelId.GuildDetail,
            currId: this.node,
        })
    }

    /**据点战 */
    openFootHoldView() {
        if (!GuildUtils.isHoldCamp()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP41"))
            this._guideSetCamp()
            return
        }
        if (this._leftTime > 0) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP72"), TimerUtils.format1(this._leftTime)))//`${TimerUtils.format1(this._leftTime)}后可进入`
            return
        }
        if (this.footHoldModel.guildMapData) {
            JumpUtils.openPanel({
                panelId: PanelId.GuildFootHoldView,
                currId: this.node,
            })
        }
    }

    /**公会商店 */
    openGuildShopFunc() {
        if (!GuildUtils.isHoldCamp()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP41"))
            this._guideSetCamp()
            return
        }

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

    /**
     * 打开公会Boss界面
     */
    openGuildBossFight() {
        if (!JumpUtils.ifSysOpen(2835)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP42"));
            return;
        }
        if (!GuildUtils.isHoldCamp()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP41"))
            this._guideSetCamp()
            return
        }
        JumpUtils.openPanel({
            panelId: PanelId.GuildBossView,
            currId: this.node
        })
    }

    /**
    * 打开公会副本
    */
    openGuildCopyView() {
        if (!GuildUtils.isHoldCamp()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP41"))
            this._guideSetCamp()
            return
        }

        JumpUtils.openPanel({
            panelId: PanelId.GuildCopyView,
            currId: this.node
        })
    }

    /**据点争夺战 */
    openGlobalFootHold(callFunc: Function = null) {
        if (!GuildUtils.isHoldCamp()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP41"))
            this._guideSetCamp()
            return
        }
        if (!this.footHoldModel.globalMapData) {
            let warId = 2
            let mapId = 400101
            let mapType = FhMapType.Elite
            if (FootHoldUtils.isCrossWar) {
                warId = 4
                mapId = 500101
                mapType = FhMapType.Cross
            }

            let points = new icmsg.FootholdRedPoints()
            points.mapId = mapId
            points.mapType = mapType
            points.warId = warId
            points.points = []
            this.footHoldModel.globalMapData = {
                warId: warId,
                mapId: mapId,
                mapType: mapType,
                redPoint: points,
                rndSeed: 0,
            }
        }
        if (this.footHoldModel.globalMapData) {
            JumpUtils.openPanel({
                panelId: PanelId.GlobalFootHoldView,
                currId: this.node,
                callback: callFunc ? () => {
                    if (callFunc instanceof Function) {
                        callFunc.call(this)
                    }
                } : null
            }
            )
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP126"))
        }
    }

    _guideSetCamp() {
        //指引扎营
        for (let m = 0; m < this.campsList.length; m++) {
            if (this.campsList[m].curName == "") {
                this.guideSpine.node.active = true
                this.guideSpine.setAnimation(0, "stand", true)
                this.guideSpine.node.x = this.campsList[m].node.x
                this.guideSpine.node.y = this.campsList[m].node.y

                if (this.scrollview.enabled) {
                    this.scrollview.scrollToBottom()
                }
            }
        }
    }

    _createEndTime() {
        this._updateEndTime()
        this._clearEndTimer()
        this.schedule(this._updateEndTime, 1)
    }

    _updateEndTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        if (this.footHoldModel.warEndTime - curTime <= 0) {
            this._clearEndTimer()
            this.endTimeLab.node.active = false
            this.enterNode.active = false
            this.crossEnterNode.active = false
        } else {
            this.endTimeLab.node.active = true
            this.endTimeLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP71"), TimerUtils.format1(Math.floor(this.footHoldModel.warEndTime - curTime)))//`${TimerUtils.format1(Math.floor(this.footHoldModel.warEndTime - curTime))}后结束`
        }
    }

    _clearEndTimer() {
        this.unschedule(this._updateEndTime)
    }

    _createCrossOpenTime() {
        this._updateOpenTime()
        this._clearOpenTimer()
        this.schedule(this._updateOpenTime, 1)
    }

    _updateOpenTime() {

        // let cfg = ConfigManager.getItemById(Cross_etcdCfg, this.roleModel.crossId)
        // if (cfg) {
        // let openTime = new Date(`${cfg.cross_open[0]}/${cfg.cross_open[1]}/${cfg.cross_open[2]} ${cfg.cross_open[3]}:${cfg.cross_open[4]}`).getTime();
        let localOpenTime = GlobalUtil.getServerOpenTime()
        let crossOpenTime = this.roleModel.CrossOpenTime * 1000;
        if (crossOpenTime) {
            crossOpenTime = Math.floor(crossOpenTime / 1000)
            let localActCfg = ConfigManager.getItemByField(ActivityCfg, "id", 62)
            let crossActCfg = ConfigManager.getItemByField(ActivityCfg, "id", 63)
            let openDay = crossActCfg.open_time[2]
            let closeDay = localActCfg.close_time[2]
            let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
            if (curTime >= localOpenTime + closeDay * 86400 && curTime <= crossOpenTime + openDay * 86400) {
                let leftTime = crossOpenTime + openDay * 86400 - Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
                if (leftTime > 0) {
                    this._leftTime = leftTime
                    this.crossOpenTimeLab.node.active = true
                    this.crossOpenTimeLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP70"), TimerUtils.format1(leftTime))//`${TimerUtils.format1(leftTime)}后开启\n跨服据点战`
                    return
                }
            }
        }
        // }
        this._leftTime = 0
        this._clearOpenTimer()
        this.crossOpenTimeLab.node.active = false
    }

    _clearOpenTimer() {
        this.unschedule(this._updateOpenTime)
    }

    //怪物攻城

    _initSiege() {
        let activity_time = ConfigManager.getItemById(Siege_globalCfg, "activity_time").value
        this._siegeStartTime = activity_time[0] * 3600 //怪物开始出现
        this._siegeEndTime = activity_time[1] * 3600  // 怪物到达门口(结算时间)
        this._siegeOverTime = activity_time[2] * 3600 //怪物消失(发奖时间)
        this._initMonsterType()
        this._createSiegeTime()
    }

    _createSiegeTime() {
        this._siegeRoadPoints = this._creatRoadPoints()
        this._updateSiegeTime()
        this._clearSiegeTime()
        this.schedule(this._updateSiegeTime, 1)
    }

    _updateSiegeTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let curZero = TimerUtils.getZerohour(curTime)//当天0点

        if (curTime > curZero + this._siegeOverTime || curTime < curZero + this._siegeStartTime) {
            this.spineNode.parent.active = false
            this.siegeTimeLab.node.parent.parent.active = false
            this.siegeTitle.active = false
            this.siegeGate.active = false
        } else {
            this.spineNode.parent.active = true
            let leftTime = curZero + this._siegeEndTime - curTime
            if (leftTime > 0) {
                this.siegeTimeLab.node.parent.parent.active = true
                this.siegeTitle.active = true
                this.siegeGate.active = true
                this.siegeTimeLab.string = TimerUtils.format4(curZero + this._siegeEndTime - curTime)
                this.siegeTimeLab2.string = gdk.i18n.t("i18n:SIEGE_TIP9")
            } else {
                this.siegeTimeLab.node.parent.parent.active = false
                this.siegeTitle.active = false
                this.siegeGate.active = false
            }
            let totalTime = this._siegeEndTime - this._siegeStartTime
            let perPointTime = totalTime / this._siegeRoadPoints.length
            let curIndex = Math.floor((curTime - curZero - this._siegeStartTime) / perPointTime)
            if (this._siegeRoadPoints[curIndex]) {
                this.spineNode.parent.x = this._siegeRoadPoints[curIndex][0].x
                this.spineNode.parent.y = this._siegeRoadPoints[curIndex][0].y
                this.spineNode.scaleX = this._siegeRoadPoints[curIndex][1] == "l" ? -1 : 1
            } else {
                this.spineNode.parent.x = this._siegeRoadPoints[this._siegeRoadPoints.length - 1][0].x
                this.spineNode.parent.y = this._siegeRoadPoints[this._siegeRoadPoints.length - 1][0].y
                this.spineNode.scaleX = this._siegeRoadPoints[this._siegeRoadPoints.length - 1][1] == "l" ? -1 : 1
            }
        }
    }

    _clearSiegeTime() {
        this.unschedule(this._updateSiegeTime)
    }


    _creatRoadPoints() {
        let dirL = [1, 2, 5, 6, 9, 10]
        let items = this.pointsNode.children
        let roadPoints = []
        for (let i = 0; i < items.length; i++) {
            let dir = dirL.indexOf(i) == -1 ? "r" : "l"
            if (i < items.length - 1) {
                let dis = 0
                if ((i + 1) % 2 == 0) {
                    dis = Math.abs(items[i + 1].y - items[i].y)
                } else {
                    dis = Math.abs(items[i + 1].x - items[i].x)
                }
                for (let j = 0; j < dis; j++) {
                    if ((i + 1) % 2 == 0) {
                        roadPoints.push([cc.v2(items[i].x, items[i].y + j), dir])
                        //cc.log("poinst=" + `${items[i].x}`, `${items[i].y + j}`)
                    } else {
                        if (i == 0 || i == 4 || i == 8 || i == 10) {
                            roadPoints.push([cc.v2(items[i].x + j, items[i].y), dir])
                            //cc.log("poinst=" + `${items[i].x + j}`, `${items[i].y}`)
                        } else {
                            roadPoints.push([cc.v2(items[i].x - j, items[i].y), dir])
                            //cc.log("poinst=" + `${items[i].x - j}`, `${items[i].y}`)
                        }
                    }
                }
            }
        }
        return roadPoints
    }

    _initMonsterType() {
        let weekDay = this.siegeModel.weekDay
        let cfgId = 1
        let hpPercent = this.siegeModel.curBossHpPercent
        let cfgs = ConfigManager.getItems(Siege_appearanceCfg)
        for (let i = 0; i < cfgs.length; i++) {
            let interval = cfgs[i].interval
            if (hpPercent >= interval[0] && hpPercent <= interval[1]) {
                cfgId = cfgs[i].id
                break
            }
        }
        let cfg = ConfigManager.getItemById(Siege_appearanceCfg, cfgId)
        let resData = cfg[`days${weekDay}`]
        let bSpinePath = StringUtils.format(PveRes.PVE_MONSTER_RES, resData[0][0])
        GlobalUtil.setSpineData(this.spineNode, this.bSpine, bSpinePath, true, "walk_s", true, false)
        this.bSpine.node.scale = resData[0][2] / 100

        let sSpinePaht = StringUtils.format(PveRes.PVE_MONSTER_RES, resData[1][0])
        let showNum = resData[1][1]
        for (let i = 0; i < this.sSpine.length; i++) {
            GlobalUtil.setSpineData(this.spineNode, this.sSpine[i], sSpinePaht, true, "walk_s", true, false)
            this.sSpine[i].node.scale = resData[1][2] / 100
            if (i < showNum) {
                this.sSpine[i].node.active = true
            } else {
                this.sSpine[i].node.active = false
            }
        }
    }

    openSiegeFightView() {
        GuideUtil.clearGuide()
        JumpUtils.openPanel({
            panelId: PanelId.SiegeFightView,
            currId: this.node
        })
    }

    openSiegeMainView() {
        JumpUtils.openPanel({
            panelId: PanelId.SiegeMainView,
            currId: this.node
        })
    }


    _createSiegeStartTime() {
        this._updateSiegeStartTime()
        this._clearSiegeStartTime()
        this.schedule(this._updateSiegeStartTime, 1)
    }

    _updateSiegeStartTime() {
        // let cfg = ConfigManager.getItemById(Cross_etcdCfg, this.roleModel.crossId)
        // if (cfg) {
        //     let openTime = new Date(`${cfg.cross_open[0]}/${cfg.cross_open[1]}/${cfg.cross_open[2]} ${cfg.cross_open[3]}:${cfg.cross_open[4]}`).getTime();
        let openTime = this.roleModel.CrossOpenTime * 1000;
        if (openTime) {
            openTime = Math.floor(openTime / 1000)
            let startTime = openTime + 16 * 86400 + 5
            let tempDate = new Date(startTime * 1000)
            let tempDay = tempDate.getDay() || 7
            let disTime = 0
            if (tempDay != 1) {
                disTime = (7 - tempDay) * 86400
            }
            let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)//当前时间
            let leftTime = startTime + disTime - curTime
            if (leftTime > 0) {
                this.siegeTimeLab.string = TimerUtils.format7(leftTime)
                this.siegeTimeLab2.string = gdk.i18n.t("i18n:SIEGE_TIP10")
                return
            }
            this.siegeTimeLab.string = ''
            this.siegeTimeLab2.string = ''
            this.btnSiegeMain.active = true
        }
        // }
    }

    _clearSiegeStartTime() {
        this.unschedule(this._updateSiegeStartTime)
    }
}