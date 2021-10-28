import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import GuardianUtils from './GuardianUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { AttrType } from '../../../../common/utils/EquipUtils';
import {
    Global_powerCfg,
    Guardian_equip_skillCfg,
    Guardian_starCfg,
    GuardianCfg
    } from '../../../../a/config';
import { SelectGiftInfo } from '../../../bag/ctrl/SelectGiftViewCtrl';
/** 
 * @Description:守护者信息
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-06 18:02:14
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianInfoTipCtrl")
export default class GuardianInfoTipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    qualityBg: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    typeLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    skillNode: cc.Node = null;

    @property(cc.Node)
    attrNode: cc.Node = null;

    @property(cc.Node)
    btnNode: cc.Node = null;
    @property(cc.Node)
    useNode: cc.Node = null;

    @property(cc.Node)
    lvRedPoint: cc.Node = null;

    @property(cc.Node)
    equipNodes: cc.Node = null;

    @property(cc.Label)
    suitStarNum: cc.Label = null;

    @property(cc.Node)
    equipSuitContent: cc.Node = null;

    @property(cc.Node)
    suitNode: cc.Node = null

    _gInfo: icmsg.Guardian
    _gCfg: GuardianCfg

    _isBookShow: boolean = false //是否图鉴显示

    _getData: SelectGiftInfo = null

    get guardianModel(): GuardianModel {
        return ModelManager.get(GuardianModel)
    }

    onEnable() {
        let arg = this.args
        this._gInfo = arg[0]
        this._isBookShow = arg[1] ? arg[1] : false;
        this._getData = arg[2] ? arg[2] : null;
        this._gCfg = ConfigManager.getItemById(GuardianCfg, this._gInfo.type)
        this.useNode.active = this._getData != null;
        this._updateViewInfo()
    }
    onDisable() {
        NetManager.targetOff(this)
    }

    _updateViewInfo() {
        let str = ['baise', 'lvse', 'lanse', 'zise', 'huangse', 'hongse'];
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `view/role/texture/bg/zb_${str[this._gCfg.color]}`);

        this.slot.updateItemInfo(this._gCfg.id);
        this.slot.itemId = 0
        this.slot.updateStar(this._gInfo.star)

        this.lv.string = '.' + this._gInfo.level + '';
        this.typeLab.string = `${this._gCfg.tag}`
        let colorInfo = BagUtils.getColorInfo(this._gCfg.color);
        this.nameLab.string = `${this._gCfg.name}`
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline)

        let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", this._gCfg.id, { star: this._gInfo.star })
        let skillBg = cc.find('skill/skillBg', this.skillNode);
        let skillIcon = cc.find('icon', skillBg);
        let skillName = cc.find('skillDesc/name', this.skillNode).getComponent(cc.Label);
        let skillDesc = cc.find('skillDesc/desc', this.skillNode).getComponent(cc.RichText);
        GlobalUtil.setSpriteIcon(this.node, skillBg, `common/texture/role/rune/zd_jinengkuang${this._gCfg.color}`);
        GlobalUtil.setSpriteIcon(this.node, skillIcon, GlobalUtil.getSkillIcon(this._gCfg.skill_show));
        let skillCfg = GlobalUtil.getSkillLvCfg(this._gCfg.skill_show, starCfg.skill_lv);
        skillName.string = skillCfg.name
        skillName.node.color = new cc.Color().fromHEX(BagUtils.getColorInfo(this._gCfg.color).color)
        skillDesc.string = skillCfg.des

        let attrInfos = []
        if (this._isBookShow) {
            this.btnNode.active = false
            attrInfos = GuardianUtils.getGuardianConfigAttrs(this._gInfo.type, this._gInfo.level, this._gInfo.star)
        } else {
            this.guardianModel.curGuardianId = this._gInfo.id
            attrInfos = GuardianUtils.getGuardianAttrs(this._gInfo.id)
        }

        let power = 0;
        this.attrNode.children.forEach((node, idx) => {
            if (node.active) {
                let attrInfo = attrInfos[idx] as AttrType
                let ratio = ConfigManager.getItemByField(Global_powerCfg, 'key', attrInfo.keyName.replace("_w", "")).value;
                power += Math.floor(ratio * (attrInfo.value + attrInfo.initValue));

                let curLab = node.getChildByName('old').getComponent(cc.Label);
                let addLab = node.getChildByName('add').getComponent(cc.Label);
                curLab.string = `${attrInfo.initValue}`
                if (attrInfo.value > 0) {
                    addLab.string = `+${attrInfo.value}`
                } else {
                    addLab.string = ''
                }

            }
        });
        this.powerLab.string = `${power + GuardianUtils.getTargetEquipTotalPower(this._gInfo)}`

        this.lvRedPoint.active = false
        let heroInfo = GuardianUtils.getGuardianHeroInfo(this._gInfo.id)
        if (heroInfo) {
            this.lvRedPoint.active = RedPointUtils.is_hero_guardian_can_operate(heroInfo)
        }

        if (this._gInfo.id == 0) {
            this.equipNodes.parent.active = false
        } else {
            this._updateEquipInfo()
            this._updateEquipSuitInfo()
        }
    }

    onUpgradeFunc() {
        gdk.panel.hide(PanelId.GuardianInfoTip)
        JumpUtils.openPanel({
            panelId: PanelId.GuardianView,
            panelArgs: {
                args: 3,
            },
            currId: PanelId.RoleView2,
        });
    }

    onReplaceFunc() {
        gdk.panel.hide(PanelId.GuardianInfoTip)
        gdk.panel.setArgs(PanelId.GuardianList, this._gInfo.id)
        gdk.panel.open(PanelId.GuardianList)
    }

    onFightFunc() {
        gdk.panel.hide(PanelId.GuardianInfoTip)
        gdk.panel.open(PanelId.GuardianFightSetView)
    }

    getFunc() {
        //礼包
        if (this._getData.giftType == -1) {
            let goodInfo: icmsg.GoodsInfo = new icmsg.GoodsInfo()
            goodInfo.num = 1
            goodInfo.typeId = this._getData.mainId
            let msg = new icmsg.ItemDisintReq()
            msg.items = [goodInfo];
            NetManager.send(msg, () => {
                this.close()
            }, this)
            return;
        }

        let good: icmsg.GoodsInfo = new icmsg.GoodsInfo()
        good.typeId = this._getData.mainId
        good.num = 1
        let msg = new icmsg.ItemDisintReq()
        msg.items = [good]
        msg.index = this._getData.index
        NetManager.send(msg, () => {
            this.close()
            gdk.panel.hide(PanelId.SelectGift)
        }, this)
    }

    _updateEquipInfo() {
        for (let i = 0; i < this.equipNodes.childrenCount; i++) {
            let ctrl = this.equipNodes.children[i].getComponent(UiSlotItem)
            let lvLab = this.equipNodes.children[i].getChildByName("lv").getComponent(cc.Label)
            let add = ctrl.node.getChildByName("add")
            let partIcon = cc.find("partIcon", add)
            let equip = this._gInfo.equips[i]
            if (equip && equip.id > 0) {
                add.active = false
                ctrl.updateItemInfo(equip.type)
                lvLab.string = `${equip.level}`
                ctrl.starNum = equip.star
                ctrl.updateStar(equip.star)
            } else {
                add.active = true
                GlobalUtil.setSpriteIcon(add, partIcon, `view/role/texture/guardian/part_${i + 1}`)
                ctrl.updateItemInfo(0)
                lvLab.string = ``
            }
        }
    }

    _updateEquipSuitInfo() {
        for (let index = 0; index < this.equipSuitContent.childrenCount; index++) {
            const suitNode = this.equipSuitContent.children[index];
            suitNode.active = false
        }

        let suitInfo = GuardianUtils.getGuardianEquipSuitInfo(this._gInfo)
        let suitMap = suitInfo[0]
        let starMap = suitInfo[1]
        let totalStar = 0
        for (let type in starMap) {
            totalStar += starMap[type]
        }
        this.suitStarNum.string = `${totalStar}`
        let suitCfgs = []
        for (let key in suitMap) {
            let type = parseInt(key)
            let cfgs = ConfigManager.getItems(Guardian_equip_skillCfg, { type: type })
            cfgs = cfgs.reverse()
            let equipNum = suitMap[type]
            for (let i = 0; i < cfgs.length; i++) {
                if (totalStar >= cfgs[i].star && equipNum >= cfgs[i].number) {
                    suitCfgs.push(cfgs[i])
                    break
                }
            }
        }

        for (let index = 0; index < suitCfgs.length; index++) {
            let s_node: cc.Node = this.equipSuitContent[index]
            if (!s_node) {
                s_node = cc.instantiate(this.suitNode)
                s_node.parent = this.equipSuitContent
            }
            this._updateSuitNode(s_node, suitCfgs[index])
        }
    }

    _updateSuitNode(sNode: cc.Node, cfg: Guardian_equip_skillCfg) {
        sNode.active = true
        let suitDes = sNode.getChildByName("suitDes").getComponent(cc.RichText)
        suitDes.string = `${cfg.des}`
        sNode.height = suitDes.node.height
    }


    onEquipAttrTipFunc() {
        gdk.panel.setArgs(PanelId.GuardianEquipTotalAttrTip, this._gInfo)
        gdk.panel.open(PanelId.GuardianEquipTotalAttrTip)
    }
}