import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GuardianModel from '../../../model/GuardianModel';
import GuardianUtils from '../GuardianUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { AttrType } from '../../../../../common/utils/EquipUtils';
import { BagItem } from '../../../../../common/models/BagModel';
import { Guardian_equip_starCfg, Guardian_equipCfg, Guardian_starCfg } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-28 15:01:35
 */

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipSelectItemCtrl")
export default class GuardianEquipSelectItemCtrl extends UiListItem {

    @property(UiSlotItem)
    equipItem: UiSlotItem = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    powerLab: cc.Label = null

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    attPanel: cc.Node = null

    @property(cc.Node)
    attNode: cc.Node = null

    @property(cc.Node)
    btnOn: cc.Node = null

    @property(cc.Node)
    btnOff: cc.Node = null

    get guardianModel(): GuardianModel {
        return ModelManager.get(GuardianModel);
    }

    _bagItem: BagItem
    _extInfo: icmsg.GuardianEquip
    _equipCfg: Guardian_equipCfg
    _starCfg: Guardian_equip_starCfg

    onEnable() {

    }

    updateView() {
        this._bagItem = this.data
        this._extInfo = this._bagItem.extInfo as icmsg.GuardianEquip
        this._equipCfg = ConfigManager.getItemById(Guardian_equipCfg, this._bagItem.itemId)
        this._starCfg = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", this._extInfo.star, { type: this._equipCfg.type, part: this._equipCfg.part })
        this.equipItem.updateItemInfo(this._bagItem.itemId)
        this.equipItem.updateStar(this._extInfo.star)
        this.equipItem.starNum = this._extInfo.star
        let attrArr = GuardianUtils.getTargetEquipAttr(this._extInfo)
        this.powerLab.string = `${gdk.i18n.t("i18n:HERO_TIP31")}${this.powerLab.string = `${GuardianUtils.getTargetEquipPower(this._extInfo)}`}`
        this.lvLabel.string = '.' + this._extInfo.level + '';
        this.nameLab.string = this._equipCfg.name
        this.nameLab.node.color = BagUtils.getColor(this._starCfg.color)
        let outline = this.nameLab.node.getComponent(cc.LabelOutline)
        outline.color = BagUtils.getOutlineColor(this._starCfg.color)

        for (let index = 0; index < this.attPanel.childrenCount; index++) {
            const attNode = this.attPanel.children[index];
            attNode.active = false
        }
        for (let index = 0; index < attrArr.length; index++) {
            const info: AttrType = attrArr[index];
            let attNode: cc.Node = this.attPanel[index]
            if (!attNode) {
                attNode = cc.instantiate(this.attNode)
                attNode.parent = this.attPanel
            }
            this._updateOneAtt(attNode, info)
        }

        let heroInfo = GuardianUtils.getGuardianHeroInfo(this.guardianModel.curGuardianId)
        if (heroInfo) {
            let equip = heroInfo.guardian.equips[this._equipCfg.part - 1]
            if (equip && equip.id == this._bagItem.series) {
                this.btnOff.active = true
                this.btnOn.active = false
                return
            }
        }
        this.btnOff.active = false
        this.btnOn.active = true
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        let value = info.value + info.initValue
        if (value == 0) {
            attNode.active = false
            return
        }
        attNode.active = true
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = info.name
        numLab.string = `+${value}`
    }

    equipOnFunc() {
        let guardianId = this.guardianModel.curGuardianId
        let heroInfo = GuardianUtils.getGuardianHeroInfo(guardianId)
        let target = new icmsg.GuardianInHero()
        target.heroId = heroInfo.heroId
        target.guardianId = this.guardianModel.curGuardianId

        if (heroInfo) {
            let equip = heroInfo.guardian.equips[this._equipCfg.part - 1]

            let equipInfo = new icmsg.GuardianEquipWithPart()
            equipInfo.equipId = this._extInfo.id
            equipInfo.part = this._equipCfg.part

            if (equip && equip.id > 0) {
                //先脱下来，再穿
                let msgOff = new icmsg.GuardianEquipOffReq()
                msgOff.target = target
                msgOff.part = [this._equipCfg.part]
                NetManager.send(msgOff, (offData: icmsg.GuardianEquipOffRsp) => {
                    GuardianUtils.updateGuardian(offData.guardian.id, offData.guardian)

                    let msgOn = new icmsg.GuardianEquipOnReq()
                    msgOn.target = target
                    msgOn.equipList = [equipInfo]

                    NetManager.send(msgOn, (onData: icmsg.GuardianEquipOnRsp) => {
                        GuardianUtils.updateGuardian(onData.guardian.id, onData.guardian)
                        gdk.e.emit(RoleEventId.GUARDIAN_INHERO_EQUIP_UPDATE)
                        gdk.Timer.callLater(this, this._hidePanel)
                    })
                })
            } else {
                let msg = new icmsg.GuardianEquipOnReq()
                msg.target = target
                msg.equipList = [equipInfo]

                NetManager.send(msg, (data: icmsg.GuardianEquipOnRsp) => {
                    GuardianUtils.updateGuardian(data.guardian.id, data.guardian)
                    gdk.e.emit(RoleEventId.GUARDIAN_INHERO_EQUIP_UPDATE)
                    gdk.Timer.callLater(this, this._hidePanel)
                })
            }
        }

    }

    equipOffFucn() {
        let guardianId = this.guardianModel.curGuardianId
        let heroInfo = GuardianUtils.getGuardianHeroInfo(guardianId)
        let target = new icmsg.GuardianInHero()
        target.heroId = heroInfo.heroId
        target.guardianId = this.guardianModel.curGuardianId

        let msg = new icmsg.GuardianEquipOffReq()
        msg.target = target
        msg.part = [this._equipCfg.part]
        NetManager.send(msg, (data: icmsg.GuardianEquipOffRsp) => {
            GuardianUtils.updateGuardian(data.guardian.id, data.guardian)
            gdk.e.emit(RoleEventId.GUARDIAN_INHERO_EQUIP_UPDATE)
            gdk.Timer.callLater(this, this._hidePanel)
        })
    }

    _hidePanel() {
        gdk.panel.hide(PanelId.GuardianEquipSelect)
    }

}