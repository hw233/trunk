import ConfigManager from '../../../../../common/managers/ConfigManager';
import FHGuardHeroItemCtrl from './FHGuardHeroItemCtrl';
import FootHoldModel, { FhPointInfo } from '../FootHoldModel';
import FootHoldUtils from '../FootHoldUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import MilitaryRankUtils from '../../militaryRank/MilitaryRankUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import UiListItem from '../../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';
import { AskInfoType } from '../../../../../common/widgets/AskPanel';
import { Foothold_bonusCfg, Foothold_pointCfg } from '../../../../../a/config';
import { MRPrivilegeType } from '../../militaryRank/MilitaryRankViewCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-25 14:19:31
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/guard/FHGuardDetailItemCtrl")
export default class FHGuardDetailItemCtrl extends UiListItem {

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    pointIcon: cc.Node = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    leftLab: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.Node)
    btnGuard: cc.Node = null;

    _guardMember: icmsg.FootholdGuardTeammate

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    updateView() {
        this._guardMember = this.data
        if (this._guardMember.id == 0) {
            this.vipFlag.parent.active = false
            this.pointIcon.parent.active = false
            // this.content.active = false
            this.btnGuard.active = true
            this.content.removeAllChildren()
            for (let i = 0; i < 6; i++) {
                let item = cc.instantiate(this.heroItem)
                item.scale = 0.8
                this.content.addChild(item)
                let ctrl = item.getComponent(FHGuardHeroItemCtrl)
                ctrl.updateNullHero()
            }
        } else {
            this.vipFlag.parent.active = true
            this.pointIcon.parent.active = true
            // this.content.active = true
            this.btnGuard.active = false
            this.nameLab.string = `${this._guardMember.name}`
            this.nameLab.node.color = cc.color("#E5B88C")
            if (this._guardMember.id == ModelManager.get(RoleModel).id) {
                this.nameLab.node.color = cc.color("#00ff00")
            }
            let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
            vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._guardMember.vipExp))
            let pos = this.footHoldModel.pointDetailInfo.pos
            let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]
            let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", this.footHoldModel.curMapData.mapId, { world_level: this.footHoldModel.worldLevelIndex, point_type: pointInfo.type, map_type: this.footHoldModel.curMapData.mapType })
            if (pointInfo.bonusType == 0) {
                let path = ""
                let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", this.footHoldModel.curMapData.mapType, { world_level: this.footHoldModel.worldLevelIndex })
                if (FootHoldUtils.getBuffTowerType(pos.x, pos.y) == 1) {
                    path = `view/guild/texture/icon/${bonusCfg.resources_skin}`
                } else if (FootHoldUtils.getBuffTowerType(pos.x, pos.y) == 2) {
                    path = `view/guild/texture/icon/${bonusCfg.attribute_skin}`
                } else if (FootHoldUtils.getBuffTowerType(pos.x, pos.y) == 3) {
                    path = `view/guild/texture/icon/${bonusCfg.attenuation_skin}`
                }
                GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
            } else {
                let path = `view/guild/texture/icon/${pointCfg.resources}`
                GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
            }
            let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(this.footHoldModel.pointDetailInfo.titleExp)
            let isSelf = pointInfo.fhPoint.playerId == this._guardMember.id ? true : false
            let maxHp = pointCfg.HP
            if (isSelf) {
                maxHp += MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p4, targetLv)
            } else {
                maxHp = pointCfg.guard_HP
            }
            this.leftLab.string = `${this._guardMember.hp}/${maxHp}`
            this.proBar.progress = this._guardMember.hp / maxHp

            this.content.removeAllChildren()
            let power = 0
            // for (let i = 0; i < 6; i++) {
            //     let item = cc.instantiate(this.heroItem)
            //     item.scale = 0.8
            //     this.content.addChild(item)
            //     let ctrl = item.getComponent(FHGuardHeroItemCtrl)
            //     if (this._guardMember.heroes[i]) {
            //         ctrl.updateView(this._guardMember.heroes[i])
            //         power += this._guardMember.heroes[i].power
            //     } else {
            //         ctrl.updateNullHero()
            //     }
            // }
            for (let i = 0; i < this._guardMember.heroes.length; i++) {
                let item = cc.instantiate(this.heroItem)
                item.scale = 0.8
                this.content.addChild(item)
                let ctrl = item.getComponent(FHGuardHeroItemCtrl)
                ctrl.updateView(this._guardMember.heroes[i])
                power += this._guardMember.heroes[i].power
            }
            this.powerLab.string = `${power}`
        }
    }

    onGuardFunc() {
        if (FootHoldUtils.isPlayerCanSetGuard) {
            gdk.panel.open(PanelId.FHGuardInviteView)
        } else {
            let pos = this.footHoldModel.pointDetailInfo.pos
            let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]
            if (pointInfo.fhPoint.guildId != this.footHoldModel.roleTempGuildId) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP119"))
                return
            }

            if (pointInfo.fhPoint.status & 1) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP120"))
                return
            }

            if (this.footHoldModel.pointGuardPlayerIds.indexOf(ModelManager.get(RoleModel).id) != -1) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP107"))
                return
            }

            let askInfo: AskInfoType = {
                sureCb: () => {
                    let msg = new icmsg.FootholdGuardJoinReq()
                    msg.pos = this.footHoldModel.pointDetailInfo.pos
                    msg.index = this._guardMember.index
                    NetManager.send(msg, () => {
                        let gTeamReq = new icmsg.FootholdGuardTeamReq()
                        gTeamReq.includeOwner = true
                        gTeamReq.pos = this.footHoldModel.pointDetailInfo.pos
                        NetManager.send(gTeamReq)
                    }, this)
                },
                descText: gdk.i18n.t("i18n:FOOTHOLD_TIP121"),
                thisArg: this,
            }
            GlobalUtil.openAskPanel(askInfo)
        }
    }
}