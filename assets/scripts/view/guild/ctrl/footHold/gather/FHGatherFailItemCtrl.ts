import ConfigManager from '../../../../../common/managers/ConfigManager';
import FHGatherReadyFightHeroItemCtrl from './FHGatherReadyFightHeroItemCtrl';
import FootHoldModel, { FhPointInfo } from '../FootHoldModel';
import FootHoldUtils from '../FootHoldUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import MilitaryRankUtils from '../../militaryRank/MilitaryRankUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
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
 * @Last Modified time: 2021-03-23 18:12:36
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/gather/FHGatherFailItemCtrl")
export default class FHGatherFailItemCtrl extends UiListItem {

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

    _guardMember: icmsg.FootholdTeamFighter

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    updateView() {
        this._guardMember = this.data
        this.vipFlag.parent.active = true
        this.pointIcon.parent.active = true
        this.nameLab.string = `${this._guardMember.name}`
        this.nameLab.node.color = cc.color("#E5B88C")
        if (this._guardMember.id == ModelManager.get(RoleModel).id) {
            this.nameLab.node.color = cc.color("#00ff00")
        }
        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._guardMember.vipExp))

        let pos = this.footHoldModel.pointDetailInfo.pos
        let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]
        let targetPos = pointInfo.fhPoint.pos
        if (pointInfo.fhPoint.gather) {
            targetPos = pointInfo.fhPoint.gather.targetPos
        }
        let tagetPointInfo: FhPointInfo = this.footHoldModel.warPoints[`${targetPos.x}-${targetPos.y}`]
        let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", this.footHoldModel.curMapData.mapId, { world_level: this.footHoldModel.worldLevelIndex, point_type: tagetPointInfo.type, map_type: this.footHoldModel.curMapData.mapType })
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
        let isSelf = tagetPointInfo.fhPoint.playerId == this._guardMember.id ? true : false
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
        for (let i = 0; i < this._guardMember.heroList.length; i++) {
            let item = cc.instantiate(this.heroItem)
            this.content.addChild(item)
            let ctrl = item.getComponent(FHGatherReadyFightHeroItemCtrl)
            ctrl.data = { hero: this._guardMember.heroList[i] }
            ctrl.updateView()
            power += this._guardMember.heroList[i].heroPower
        }
        this.powerLab.string = `${power}`

    }
}