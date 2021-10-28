import ArenaModel from '../../../../common/models/ArenaModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FHGatherPlayerItemCtrl from './gather/FHGatherPlayerItemCtrl';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import MilitaryRankUtils from '../militaryRank/MilitaryRankUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { AskInfoType } from '../../../../common/widgets/AskPanel';
import {
    Copy_hardcoreCfg,
    Foothold_bonusCfg,
    Foothold_globalCfg,
    Foothold_pointCfg,
    TipsCfg
    } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { MRPrivilegeType } from '../militaryRank/MilitaryRankViewCtrl';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBattleArrayCtrl")
export default class FHBattleArrayCtrl extends gdk.BasePanel {

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Label)
    desLab: cc.Label = null

    @property(cc.Node)
    ownerNode: cc.Node = null

    @property(cc.Node)
    pointIcon: cc.Node = null

    @property(cc.ProgressBar)
    hpProBar: cc.ProgressBar = null

    @property(cc.Label)
    hpProLab: cc.Label = null

    @property(cc.Node)
    outputNode: cc.Node = null

    @property(cc.RichText)
    teamLab: cc.RichText = null

    @property(cc.ProgressBar)
    timeProBar: cc.ProgressBar = null

    @property(cc.Label)
    timeProLab: cc.Label = null

    @property(cc.Node)
    btnGiveup: cc.Node = null

    @property(cc.Node)
    btnGet: cc.Node = null

    @property(cc.Node)
    btnMark: cc.Node = null

    @property(cc.Prefab)
    produceItem: cc.Prefab = null

    @property(cc.Node)
    btnGuard: cc.Node = null

    @property(cc.Node)
    btnGather: cc.Node = null

    @property(cc.Node)
    btnCancelGather: cc.Node = null

    @property(cc.RichText)
    tipLab: cc.RichText = null

    @property(FHGatherPlayerItemCtrl)
    gatherPlayerItems: FHGatherPlayerItemCtrl[] = []

    get arenaModel(): ArenaModel { return ModelManager.get(ArenaModel); }
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    _gatherInitTime = 0
    _gatherTeamDatas = []
    _guardPointNum = 0

    onEnable() {
        this._updateOutput()

        gdk.e.on(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST, this._updateMarkBtn, this);
        NetManager.on(icmsg.FootholdGatherTeamRsp.MsgType, this._onFootholdGatherTeamRsp, this)
        // NetManager.on(icmsg.FootholdGuardBriefRsp.MsgType, this._onFootholdGuardBriefRsp, this)
        if (this.footHoldModel.isGuessMode) {
            this.btnGet.active = false
            this.btnGiveup.active = false
            this.btnMark.active = false
        }
        if (!this._checkPointIsSelf(false)) {
            this.btnGiveup.active = false
            this.btnGet.active = false
        }
        this._initViewInfo()
        this._updateMarkBtn()
        this._updateBtnGuard()
        this._updateBtnGather()
        //集结成员信息
        let msg = new icmsg.FootholdGatherTeamReq()
        msg.pos = this.footHoldModel.pointDetailInfo.pos
        NetManager.send(msg)

        this.tipLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP104")
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this)
    }

    /**点的状态信息 */
    get curFhPointInfo() {
        let info = this.footHoldModel.pointDetailInfo
        let fhPointInfo: FhPointInfo = this.footHoldModel.warPoints[`${info.pos.x}-${info.pos.y}`]
        return fhPointInfo
    }

    _initViewInfo() {
        let fhPointInfo: FhPointInfo = this.curFhPointInfo
        let ownerNameLab = cc.find("ownNameLab", this.ownerNode).getComponent(cc.Label)
        ownerNameLab.string = FootHoldUtils.findPlayer(fhPointInfo.fhPoint.playerId).name
        let guildInfo = FootHoldUtils.findGuild(fhPointInfo.fhPoint.guildId)
        GlobalUtil.setSpriteIcon(this.node, cc.find("bottom", this.ownerNode), GuildUtils.getIcon(guildInfo.bottom))
        GlobalUtil.setSpriteIcon(this.node, cc.find("frame", this.ownerNode), GuildUtils.getIcon(guildInfo.frame))
        GlobalUtil.setSpriteIcon(this.node, cc.find("icon", this.ownerNode), GuildUtils.getIcon(guildInfo.icon))
    }

    giveupFunc() {
        if (!this._checkPointIsSelf()) {
            return
        }
        let fhPointInfo: FhPointInfo = this.curFhPointInfo
        if (fhPointInfo.bonusType == 0) {
            let info: AskInfoType = {
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                sureCb: () => {
                    let msg = new icmsg.FootholdGiveUpReq()
                    msg.warId = this.footHoldModel.curMapData.warId
                    msg.pos = this.footHoldModel.pointDetailInfo.pos
                    NetManager.send(msg, () => {
                        FootHoldUtils.clearPointOutput(msg.pos.x, msg.pos.y)
                        gdk.panel.hide(PanelId.FHBattleArrayView)
                        gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP4"))
                    })
                },
                descText: gdk.i18n.t("i18n:FOOTHOLD_TIP5"),
                thisArg: this,
            }
            GlobalUtil.openAskPanel(info)
        } else {
            gdk.panel.open(PanelId.FHGiveupView)
        }
    }

    getOutputFunc() {
        if (!this._checkPointIsSelf()) {
            return
        }
        let fhPointInfo: FhPointInfo = this.curFhPointInfo
        if (fhPointInfo.output.length == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP6"))
            return
        }
        let msg = new icmsg.FootholdTakeOutputReq()
        msg.warId = this.footHoldModel.curMapData.warId
        msg.pos = this.footHoldModel.pointDetailInfo.pos
        msg.all = false
        NetManager.send(msg, (data: icmsg.FootholdTakeOutputRsp) => {
            let goods = []
            if (data.exp > 0) {
                let good = new icmsg.GoodsInfo()
                good.typeId = FootHoldUtils.BaseExpId
                good.num = data.exp
                goods.push(good)
            }
            GlobalUtil.openRewadrView(goods.concat(data.list))

            let outputLab = cc.find("outputLab", this.outputNode).getComponent(cc.Label)
            outputLab.string = `X0`
            FootHoldUtils.clearPointOutput(msg.pos.x, msg.pos.y)
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)

        }, this)
    }

    _updateBtnGuard() {
        let btnLab = this.btnGuard.getChildByName("txt").getComponent(cc.Label)
        if (FootHoldUtils.isPlayerCanSetGuard) {
            btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP97")
        } else {
            btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP98")
        }

        this._guardPointNum = 0
        for (let key in this.footHoldModel.warPoints) {
            let info: FhPointInfo = this.footHoldModel.warPoints[key];
            if (info.fhPoint && info.fhPoint.guildId == this.footHoldModel.roleTempGuildId && (info.fhPoint.status & 4)) {
                this._guardPointNum++
            }
        }
        let guard = ConfigManager.getItemById(Foothold_globalCfg, "guard").value[0]

        let guardOpen = ConfigManager.getItemById(Foothold_globalCfg, "open").value[2]
        if (this.footHoldModel.activityIndex < guardOpen || this._guardPointNum >= guard) {
            GlobalUtil.setAllNodeGray(this.btnGuard, 1)
        }
    }

    _updateBtnGather() {
        let fhPointInfo: FhPointInfo = this.curFhPointInfo
        let btnLab = this.btnGather.getChildByName("txt").getComponent(cc.Label)
        if (FootHoldUtils.isPlayerCanSetGather) {
            if (fhPointInfo.fhPoint) {
                if (fhPointInfo.fhPoint.status & 8) {
                    this._gatherInitTime = fhPointInfo.fhPoint.gather ? fhPointInfo.fhPoint.gather.startTime : 0
                    this.btnCancelGather.active = true
                    btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP102")
                    this._createTime()
                } else {
                    this.btnCancelGather.active = false
                    this.timeProBar.node.parent.active = false
                }
            }
        } else {
            this.btnCancelGather.active = false
            this.timeProBar.node.parent.active = false
            GlobalUtil.setAllNodeGray(this.btnGather, 1)
        }

        let gatherOpen = ConfigManager.getItemById(Foothold_globalCfg, "open").value[1]
        if (this.footHoldModel.activityIndex < gatherOpen) {
            GlobalUtil.setAllNodeGray(this.btnGather, 1)
        }
    }

    _updateMarkBtn() {
        let pos = this.footHoldModel.pointDetailInfo.pos
        let markLab = this.btnMark.getChildByName("txt").getComponent(cc.Label)
        if (FootHoldUtils.isPlayerCanMark) {
            let tag = ConfigManager.getItemById(Foothold_globalCfg, "tag").value[0]
            markLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP79") + `(${FootHoldUtils.getMarkPointsNum()}/${tag})`//`标记设置`
        } else {
            markLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP80")//`标记查看`
            if (!this.footHoldModel.markFlagPoints[`${pos.x}-${pos.y}`]) {
                GlobalUtil.setAllNodeGray(this.btnMark, 1)
            }
        }
    }

    openMarkFunc() {
        let pos = this.footHoldModel.pointDetailInfo.pos
        if (!this.footHoldModel.markFlagPoints[`${pos.x}-${pos.y}`] && !FootHoldUtils.isPlayerCanMark) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP87"))
            return
        }

        let tag = ConfigManager.getItemById(Foothold_globalCfg, "tag").value[0]
        if (FootHoldUtils.getMarkPointsNum() >= tag && !this.footHoldModel.markFlagPoints[`${pos.x}-${pos.y}`]) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP86"), tag))
            return
        }
        gdk.panel.open(PanelId.FHPointMarkPanel)
    }

    /**判断据点是否还是自己的 */
    _checkPointIsSelf(isTip: boolean = true) {
        let info = this.footHoldModel.pointDetailInfo
        if (!info || !this.btnGiveup.active) {
            return true
        }
        let fhPointInfo: FhPointInfo = this.curFhPointInfo
        if (fhPointInfo.fhPoint.playerId != this.roleModel.id) {
            if (isTip) GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FOOTHOLD_TIP7"))
            return false
        }
        return true
    }

    /**更新产出 */
    _updateOutput() {
        let info = this.footHoldModel.pointDetailInfo
        if (!info) {
            return
        }
        let fhPointInfo: FhPointInfo = this.curFhPointInfo
        let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_type", this.footHoldModel.curMapData.mapType, { point_type: fhPointInfo.type, world_level: this.footHoldModel.worldLevelIndex })
        if (fhPointInfo.bonusType == 0) {
            this.btnGet.active = false
            this.lvLab.string = ""
            let tipCfg = ConfigManager.getItemById(TipsCfg, this._getTipId())
            this.desLab.string = tipCfg.title1
            let str2 = ''
            let path = ""
            let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", this.footHoldModel.curMapData.mapType, { world_level: this.footHoldModel.worldLevelIndex })
            if (FootHoldUtils.getBuffTowerType(fhPointInfo.pos.x, fhPointInfo.pos.y) == 1) {
                path = `view/guild/texture/icon/${bonusCfg.resources_skin}`
                let hardcoreCfg1 = ConfigManager.getItemById(Copy_hardcoreCfg, bonusCfg.bonus_attribute1[0])
                str2 = hardcoreCfg1.dec
            } else if (FootHoldUtils.getBuffTowerType(fhPointInfo.pos.x, fhPointInfo.pos.y) == 2) {
                path = `view/guild/texture/icon/${bonusCfg.attribute_skin}`
                let hardcoreCfg2 = ConfigManager.getItemById(Copy_hardcoreCfg, bonusCfg.bonus_attribute[0])
                str2 = hardcoreCfg2.dec
            } else if (FootHoldUtils.getBuffTowerType(fhPointInfo.pos.x, fhPointInfo.pos.y) == 3) {
                path = `view/guild/texture/icon/${bonusCfg.attenuation_skin}`
                let hardcoreCfg3 = ConfigManager.getItemById(Copy_hardcoreCfg, bonusCfg.bonus_attenuation[0])
                str2 = hardcoreCfg3.dec
            }
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
            this.outputNode.active = false
        } else {

            let path = `view/guild/texture/icon/${pointCfg.resources}`
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
            this.lvLab.string = `${fhPointInfo.type} ${gdk.i18n.t("i18n:FOOTHOLD_TIP3")}`
            let gets: icmsg.GoodsInfo[] = []
            fhPointInfo.output.forEach(element => {
                if (element.num > 0) {
                    gets.push(element)
                }
            });
            let outputLab = cc.find("outputLab", this.outputNode).getComponent(cc.Label)
            if (gets.length > 0) {
                let iconPath = GlobalUtil.getSmallMoneyIcon(gets[0].typeId)
                GlobalUtil.setSpriteIcon(this.node, cc.find("itemIcon", this.outputNode), iconPath)
                outputLab.string = `X${gets[0].num}`
            }
        }

        let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(this.footHoldModel.pointDetailInfo.titleExp)
        let maxHp = pointCfg.HP + MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p4, targetLv)
        this.hpProLab.string = `耐久度:${this.footHoldModel.pointDetailInfo.bossHp}/${maxHp}`
        this.hpProBar.progress = this.footHoldModel.pointDetailInfo.bossHp / maxHp
    }

    _getTipId() {
        let info = this.footHoldModel.pointDetailInfo
        let type = FootHoldUtils.getBuffTowerType(info.pos.x, info.pos.y)
        let tipId = 39
        switch (type) {
            case 1:
                tipId = 44
                break
            case 2:
                tipId = 40
                break
            case 3:
                tipId = 41
                break
        }
        return tipId
    }


    /**组队挑战 集结 */
    onGatherFunc() {
        if (FootHoldUtils.isCanCooperation(this.roleModel.guildId)) {
            gdk.gui.showMessage("协战状态下不能发起集结操作")
            return
        }

        let gatherOpen = ConfigManager.getItemById(Foothold_globalCfg, "open").value[1]
        if (this.footHoldModel.activityIndex < gatherOpen) {
            gdk.gui.showMessage(`第${gatherOpen}次据点争夺战开启(当前${this.footHoldModel.activityIndex}/${gatherOpen})`)
            return
        }


        if (!FootHoldUtils.isPlayerCanSetGather) {
            gdk.gui.showMessage("会长,副会长,战斗队长才可进行操作")
            return
        }

        if (this.footHoldModel.fightPoint != null) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP25"))
            return
        }

        let fhPointInfo: FhPointInfo = this.curFhPointInfo
        if (fhPointInfo.fhPoint && (fhPointInfo.fhPoint.status & 8)) {
            this._fightReq()
        } else {
            //进入选择集结点模式
            this.footHoldModel.gatherMode = true
            gdk.panel.hide(PanelId.FHBattleArrayView)
        }
    }

    _fightReq() {
        if (this.curFhPointInfo.fhPoint && this.curFhPointInfo.fhPoint.gather) {
            let tagetPos = this.curFhPointInfo.fhPoint.gather.targetPos
            let targetInfo: FhPointInfo = this.footHoldModel.warPoints[`${tagetPos.x}-${tagetPos.y}`]
            if (targetInfo.fhPoint) {
                let time = targetInfo.fhPoint.statusEndtime - Math.floor(GlobalUtil.getServerTime() / 1000)
                if (time > 0) {
                    gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP23"), time))//`该据点处于保护期,${time}秒后才可进行抢夺`
                    return
                }
                if (targetInfo.fhPoint.status & 1) {
                    gdk.gui.showMessage("集火点正在战斗中,请稍后再试")
                    return
                }
            }
        }
        gdk.panel.open(PanelId.FHGatherReadyFight)
    }

    /**取消集结 */
    onCancelGatherFunc() {
        let askInfo: AskInfoType = {
            sureCb: () => {
                let msg = new icmsg.FootholdGatherCancelReq()
                msg.pos = this.footHoldModel.pointDetailInfo.pos
                NetManager.send(msg, () => {
                    gdk.panel.hide(PanelId.FHBattleArrayView)
                }, this)
            },
            descText: `确定后不可撤销，是否继续操作？`,
            thisArg: this,
        }
        GlobalUtil.openAskPanel(askInfo)
    }

    /**部队驻守 */
    onGuardFunc() {
        // if (FootHoldUtils.isCanCooperation(this.roleModel.guildId)) {
        //     gdk.gui.showMessage("协战状态下不能进行驻守操作")
        //     return
        // }

        let guardOpen = ConfigManager.getItemById(Foothold_globalCfg, "open").value[2]
        if (this.footHoldModel.activityIndex < guardOpen) {
            gdk.gui.showMessage(`第${guardOpen}次据点争夺战开启(当前${this.footHoldModel.activityIndex}/${guardOpen})`)
            return
        }

        let guard = ConfigManager.getItemById(Foothold_globalCfg, "guard").value[0]
        if (this._guardPointNum >= guard) {
            gdk.gui.showMessage(`每个公会最多可对${guard}个据点进行驻守`)
            return
        }
        // if (FootHoldUtils.isPlayerCanSetGuard) {
        //     let msg = new icmsg.FootholdGuardInitReq()
        //     msg.pos = this.footHoldModel.pointDetailInfo.pos
        //     NetManager.send(msg)
        // } else {
        //     gdk.panel.open(PanelId.FHGuardDetailView)
        // }
        gdk.panel.open(PanelId.FHGuardDetailView)
    }

    _onFootholdGatherTeamRsp(data: icmsg.FootholdGatherTeamRsp) {
        this._gatherTeamDatas = data.list
        this.footHoldModel.pointGatherPlayerIds = []
        for (let i = 0; i < this.gatherPlayerItems.length; i++) {
            if (data.list[i]) {
                this.gatherPlayerItems[i].updateViewInfo(data.list[i])
                this.footHoldModel.pointGatherPlayerIds.push(data.list[i].brief.id)
            } else {
                let info = new icmsg.FootholdGatherTeammate()
                info.index = i
                info.brief = null
                this.gatherPlayerItems[i].updateViewInfo(info)
            }
        }
        let gather_forces = ConfigManager.getItemById(Foothold_globalCfg, "gather_forces").value[0]
        let str = `集结部队(<color=#00ff00>${data.list.length}/${gather_forces}</color>)`
        this.teamLab.string = StringUtils.setRichtOutLine(str, "#7B3918", 2)


        let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${this.footHoldModel.pointDetailInfo.pos.x}-${this.footHoldModel.pointDetailInfo.pos.y}`]
        if (pointInfo && pointInfo.fhPoint && (pointInfo.fhPoint.status & 8) && pointInfo.fhPoint.gather) {
            pointInfo.fhPoint.gather.teamNum = data.list.length
        }
        gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
    }

    _createTime() {
        this._updateTime()
        this._clearTime()
        this.schedule(this._updateTime, 1)
    }

    _updateTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let gather_time = ConfigManager.getItemById(Foothold_globalCfg, "gather_time").value[0]
        if (curTime > this._gatherInitTime + gather_time) {
            this._clearTime()
            this.timeProBar.node.parent.active = false
        } else {
            this.timeProLab.string = TimerUtils.format2(this._gatherInitTime + gather_time - curTime)
            this.timeProBar.progress = (this._gatherInitTime + gather_time - curTime) / gather_time
        }
    }

    _clearTime() {
        this.unschedule(this._updateTime)
    }


    // _onFootholdGuardBriefRsp(data: icmsg.FootholdGuardBriefRsp) {
    //     gdk.panel.open(PanelId.FHGuardInviteView)
    //     gdk.panel.hide(PanelId.FHBattleArrayView)
    // }

}
