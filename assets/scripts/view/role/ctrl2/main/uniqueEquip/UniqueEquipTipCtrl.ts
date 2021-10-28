import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import {
    Global_powerCfg,
    Unique_globalCfg,
    Unique_starCfg,
    UniqueCfg
    } from '../../../../../a/config';
import { HeroCfg } from '../../../../../../boot/configs/bconfig';
import { RoleEventId } from '../../../enum/RoleEventId';
/** 
 * @Description:专属装备tip
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-13 14:19:43
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/uniqueEquip/UniqueEquipTipCtrl")
export default class UniqueEquipTipCtrl extends gdk.BasePanel {
    @property(cc.Node)
    qualityBg: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    typeLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    skillNode: cc.Node = null;

    @property(cc.Label)
    addLab: cc.Label = null;

    @property(cc.Node)
    attrNode: cc.Node = null;

    @property(cc.Node)
    starNode: cc.Node = null;

    @property(cc.Node)
    starInfo: cc.Node = null;

    @property(cc.RichText)
    equipDes: cc.RichText = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Label)
    limitLab: cc.Label = null;

    @property(cc.Node)
    heroIcon: cc.Node = null;

    @property(cc.Node)
    careerNode: cc.Node = null;

    @property(cc.Node)
    careerItems: cc.Node[] = [];

    @property(cc.Node)
    upStarRedPoint: cc.Node = null;

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    _equipInfo: icmsg.UniqueEquip  //id==-1 为图鉴展示
    _uniqueEquipCfg: UniqueCfg
    _careerIndex = 0
    _showCareerId = 0

    onEnable() {
        let args = this.args
        this._equipInfo = args[0]
        this._uniqueEquipCfg = ConfigManager.getItemById(UniqueCfg, this._equipInfo.itemId)
        this._showCareerId = args[1] || this._uniqueEquipCfg.career_id[0]

        if (this.heroModel.curHeroInfo && !gdk.panel.isOpenOrOpening(PanelId.HeroBook)) {
            this._showCareerId = this.heroModel.curHeroInfo.careerId
        }

        this._careerIndex = this._uniqueEquipCfg.career_id.indexOf(this._showCareerId)
        if (this._careerIndex == -1) {
            this._careerIndex = 0
        }

        this._updateViewInfo()
    }

    onDisable() {

    }

    _updateViewInfo() {
        if (this._equipInfo.id == -1) {
            this.btnNode.active = false
        }
        let str = ['baise', 'lvse', 'lanse', 'zise', 'huangse', 'hongse'];
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `view/role/texture/bg/zb_${str[this._uniqueEquipCfg.color]}`);

        this.slot.updateItemInfo(this._uniqueEquipCfg.id);
        this.slot.updateStar(this._equipInfo.star)
        this.slot.starNum = this._equipInfo.star

        this.typeLab.string = `专属装备`
        let colorInfo = BagUtils.getColorInfo(this._uniqueEquipCfg.color);
        this.nameLab.string = `${this._uniqueEquipCfg.name}`
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline)


        let skillBg = cc.find('skill/skillBg', this.skillNode);
        let skillIcon = cc.find('icon', skillBg);
        let skillName = cc.find('skillDesc/name', this.skillNode).getComponent(cc.Label);
        let skillDesc = cc.find('skillDesc/desc', this.skillNode).getComponent(cc.RichText);
        GlobalUtil.setSpriteIcon(this.node, skillBg, `common/texture/role/rune/zd_jinengkuang${this._uniqueEquipCfg.color}`);
        GlobalUtil.setSpriteIcon(this.node, skillIcon, `icon/skill/${this._uniqueEquipCfg.skill_icon[this._careerIndex]}`);
        skillName.string = this._uniqueEquipCfg.skill_name[this._careerIndex]
        // skillName.node.color = new cc.Color().fromHEX(colorInfo.color);

        let starCfgs = ConfigManager.getItemsByField(Unique_starCfg, "unique_id", this._uniqueEquipCfg.id)
        skillDesc.string = this._careerIndex == 0 ? starCfgs[0].des1 : starCfgs[0].des2
        this.equipDes.string = `${this._uniqueEquipCfg.des}`

        for (let index = 0; index < this.starNode.childrenCount; index++) {
            const info = this.starNode.children[index];
            info.active = false
        }
        for (let index = 1; index < starCfgs.length; index++) {
            let starInfo: cc.Node = this.starNode[index]
            if (!starInfo) {
                starInfo = cc.instantiate(this.starInfo)
                starInfo.parent = this.starNode
            }
            starInfo.active = true
            this._updateStarInfo(starInfo, starCfgs[index])
        }

        let uniquehero_add = ConfigManager.getItemById(Unique_globalCfg, "uniquehero_add").value[0]
        GlobalUtil.setSpriteIcon(this.node, this.heroIcon, null)
        if (this._uniqueEquipCfg.unique && this._uniqueEquipCfg.unique.length > 0) {
            let heroCfg = ConfigManager.getItemById(HeroCfg, this._uniqueEquipCfg.unique[0])
            this.limitLab.string = `(${heroCfg.name}穿戴后激活)`
            this.addLab.string = `(${heroCfg.name}穿戴后装备属性+${uniquehero_add}%)`
            if (heroCfg.color == 4) {
                GlobalUtil.setSpriteIcon(this.node, this.heroIcon, `icon/hero/${this._uniqueEquipCfg.unique[0]}_z`)
            }

            if ((this.heroModel.curHeroInfo && this.heroModel.curHeroInfo.typeId == heroCfg.id)) {
                this.limitLab.node.color = cc.color("#8DCB2B")
                this.addLab.node.color = cc.color("#8DCB2B")
                this._updateAttrNode(true)
            } else {
                this.limitLab.node.color = cc.color("#7D736C")
                this.addLab.node.color = cc.color("#7D736C")
                this._updateAttrNode(false)
            }
        } else {
            this.limitLab.string = `(任意英雄穿戴后激活)`
            this.limitLab.node.color = cc.color("#8DCB2B")
            this.addLab.string = ''
            this._updateAttrNode(false)
        }

        if (this._uniqueEquipCfg.career_type.length > 1) {
            this.careerNode.active = true
            this._updateCareerNode(this.careerItems[0], this._uniqueEquipCfg.career_type[this._careerIndex])
            let tempIndex = this._careerIndex == 0 ? 1 : 0
            this._updateCareerNode(this.careerItems[1], this._uniqueEquipCfg.career_type[tempIndex], true)
        } else {
            this.careerNode.active = false
        }

        if (this.heroModel.curHeroInfo && this._equipInfo.id > 0) {
            this.upStarRedPoint.active = RedPointUtils.is_unique_equip_can_star_up(this.heroModel.curHeroInfo)
        }
    }

    _updateAttrNode(showAdd: boolean = false) {
        let starCfg = ConfigManager.getItemByField(Unique_starCfg, "unique_id", this._uniqueEquipCfg.id, { star: this._equipInfo.star });
        let attrNames = ['atk_g', 'hp_g', 'def_g'];
        let uniquehero_add = ConfigManager.getItemById(Unique_globalCfg, "uniquehero_add").value[0]
        let power = 0
        this.attrNode.children.forEach((node, idx) => {
            if (node.active) {
                let value = starCfg[attrNames[idx]]
                let addValue = showAdd ? (value * uniquehero_add / 100) : 0
                let ratio = ConfigManager.getItemByField(Global_powerCfg, 'key', attrNames[idx].replace("_g", "")).value;
                power += Math.floor(ratio * (value + addValue));

                let curLab = node.getChildByName('old').getComponent(cc.Label);
                curLab.string = `${value}`

                let addLab = node.getChildByName('add').getComponent(cc.Label);
                if (showAdd) {
                    addLab.node.active = true
                    addLab.string = `+${Math.floor(addValue)}`
                }
            }
        });
        this.powerLab.string = `${power}`
    }

    _updateStarInfo(node, starCfg: Unique_starCfg) {
        let onDes = cc.find("on/des", node).getComponent(cc.RichText)
        let offDes = cc.find("off/des", node).getComponent(cc.RichText)
        onDes.node.parent.active = false
        offDes.node.parent.active = false

        if (this._uniqueEquipCfg.unique && this._uniqueEquipCfg.unique.length > 0) {
            let isActive = this.heroModel.curHeroInfo ? this.heroModel.curHeroInfo.typeId == this._uniqueEquipCfg.unique[0] : false
            if (this._equipInfo.id == -1) {
                isActive = true
            }
            if (this._equipInfo.star >= starCfg.star && isActive) {
                onDes.node.parent.active = true
                onDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            } else {
                offDes.node.parent.active = true
                offDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            }
        } else {
            if (this._equipInfo.star >= starCfg.star) {
                onDes.node.parent.active = true
                onDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            } else {
                offDes.node.parent.active = true
                offDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            }
        }
    }

    onStarUpFunc() {
        let starCfgs = ConfigManager.getItemsByField(Unique_starCfg, "unique_id", this.heroModel.curHeroInfo.uniqueEquip.itemId)
        let maxStar = starCfgs[starCfgs.length - 1].star
        if (this.heroModel.curHeroInfo.uniqueEquip.star >= maxStar) {
            gdk.gui.showMessage("专属武器已满星")
            return
        } else {
            gdk.panel.open(PanelId.UniqueEquipStarUpdate)
            gdk.panel.hide(PanelId.UniqueEquipTip)
        }
    }

    onTakeOffFunc() {
        let msg = new icmsg.UniqueEquipOffReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId
        msg.id = this._equipInfo.id
        NetManager.send(msg, () => {
            this.heroModel.curHeroInfo.uniqueEquip = null
            HeroUtils.updateHeroInfo(this.heroModel.curHeroInfo.heroId, this.heroModel.curHeroInfo)
            gdk.e.emit(RoleEventId.UPDATE_HERO_UNIQUE_EQUIP)
            gdk.panel.hide(PanelId.UniqueEquipTip)
        })
    }

    onChangeFunc() {
        gdk.panel.setArgs(PanelId.UniqueEquipList, this._equipInfo)
        gdk.panel.open(PanelId.UniqueEquipList)
        gdk.panel.hide(PanelId.UniqueEquipTip)
    }

    onCareerBtnClick() {
        this._careerIndex = this._careerIndex == 0 ? 1 : 0
        this._updateViewInfo()
    }

    _updateCareerNode(node: cc.Node, careerType: number, isGray: boolean = false) {
        let icon = node.getChildByName("icon");
        icon.scale = 0.9;
        let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
        let path = `common/texture/soldier/${nameArr[careerType - 1]}`;
        GlobalUtil.setSpriteIcon(this.node, icon, path);
        GlobalUtil.setGrayState(icon, isGray ? 1 : 0)
    }

}