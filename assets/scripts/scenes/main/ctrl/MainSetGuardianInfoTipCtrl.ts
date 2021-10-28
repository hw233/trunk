import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuardianUtils from '../../../view/role/ctrl2/guardian/GuardianUtils';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { AttrType } from '../../../common/utils/EquipUtils';
import { BagItem, BagType } from '../../../common/models/BagModel';
import {
    Global_powerCfg,
    Guardian_equip_skillCfg,
    Guardian_starCfg,
    GuardianCfg
    } from '../../../a/config';


/**
 * @Description: 个人名片-荣耀展示tips
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-25 11:14:45
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainSetGuardianInfoTipCtrl")
export default class MainSetGuardianInfoTipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    qualityBg: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    skillNode: cc.Node = null;

    @property(cc.Node)
    attrNode: cc.Node = null;

    @property(cc.Node)
    equipNodes: cc.Node = null;

    @property(cc.Node)
    equipSuitContent: cc.Node = null;

    @property(cc.Node)
    suitNode: cc.Node = null
    @property(cc.Node)
    equipSuitTitle: cc.Node = null;


    _gInfo: icmsg.Guardian
    _gCfg: GuardianCfg
    suitCfgs: Guardian_equip_skillCfg[] = []

    onEnable() {
        let arg = this.args
        this._gInfo = arg[0]
        this._gCfg = ConfigManager.getItemById(GuardianCfg, this._gInfo.type)
        this._updateViewInfo()
    }
    onDisable() {
        //NetManager.targetOff(this)
    }

    _updateViewInfo() {
        let str = ['baise', 'lvse', 'lanse', 'zise', 'huangse', 'hongse'];
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `view/role/texture/bg/zb_${str[this._gCfg.color]}`);
        this.slot.updateItemInfo(this._gCfg.id);
        this.slot.itemId = 0
        this.slot.updateStar(this._gInfo.star)
        this.lv.string = '.' + this._gInfo.level + '';
        let colorInfo = BagUtils.getColorInfo(this._gCfg.color);
        this.nameLab.string = `${this._gCfg.name}`
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline)

        //技能图标
        let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", this._gCfg.id, { star: this._gInfo.star })
        let skillBg = cc.find('skill/skillBg', this.skillNode);
        let skillIcon = cc.find('icon', skillBg);
        GlobalUtil.setSpriteIcon(this.node, skillBg, `common/texture/role/rune/zd_jinengkuang${this._gCfg.color}`);
        GlobalUtil.setSpriteIcon(this.node, skillIcon, GlobalUtil.getSkillIcon(this._gCfg.skill_show));

        //属性设置
        let attrInfos = []
        attrInfos = GuardianUtils.getGuardianConfigAttrs(this._gInfo.type, this._gInfo.level, this._gInfo.star)
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

        //设置装备信息
        this._updateEquipInfo()
        this._updateEquipSuitInfo()
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
                ctrl.starNum = equip.star;
                let bagItem: BagItem = {
                    series: equip.id,
                    itemId: equip.type,
                    itemNum: 1,
                    type: BagType.GUARDIANEQUIP,
                    extInfo: equip,
                }
                ctrl.itemInfo = bagItem
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

        this.suitCfgs = []
        for (let key in suitMap) {
            let type = parseInt(key)
            let cfgs = ConfigManager.getItems(Guardian_equip_skillCfg, { type: type })
            cfgs = cfgs.reverse()
            let equipNum = suitMap[type]
            for (let i = 0; i < cfgs.length; i++) {
                if (totalStar >= cfgs[i].star && equipNum >= cfgs[i].number) {
                    this.suitCfgs.push(cfgs[i])
                    break
                }
            }
        }
        this.equipSuitTitle.active = this.suitCfgs.length > 0;
        for (let index = 0; index < this.suitCfgs.length; index++) {
            let s_node: cc.Node = this.equipSuitContent[index]
            if (!s_node) {
                s_node = cc.instantiate(this.suitNode)
                s_node.parent = this.equipSuitContent
            }
            this._updateSuitNode(s_node, this.suitCfgs[index])
        }
    }

    _updateSuitNode(sNode: cc.Node, cfg: Guardian_equip_skillCfg) {
        sNode.active = true
        let suitDes = sNode.getChildByName("suitDes").getComponent(cc.Label)
        suitDes.string = `${cfg.des_title.split(':')[0]}`
        sNode.height = suitDes.node.height
    }

    //打开装备套装详情界面
    openSuitInfoView() {
        if (this.suitCfgs.length > 0) {
            gdk.panel.setArgs(PanelId.MainSetGuardianEquitSuitTips, this.suitCfgs)
            gdk.panel.open(PanelId.MainSetGuardianEquitSuitTips);
        }
    }

    //打开技能详情界面
    openSkillInfoView() {
        let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", this._gCfg.id, { star: this._gInfo.star })
        let skillCfg = GlobalUtil.getSkillLvCfg(this._gCfg.skill_show, starCfg.skill_lv);
        gdk.panel.setArgs(PanelId.MainSetSkillsInfoTip, 0, [skillCfg], [skillCfg.skill_id], 0)
        gdk.panel.open(PanelId.MainSetSkillsInfoTip);
    }
}
