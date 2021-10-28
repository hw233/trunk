import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipModel from '../../../../../common/models/EquipModel';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagType } from '../../../../../common/models/BagModel';
import {
    Global_powerCfg,
    Hero_careerCfg,
    HeroCfg,
    Unique_globalCfg,
    Unique_starCfg,
    UniqueCfg
    } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';
/** 
 * @Description:装备列表
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-13 14:19:26
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/uniqueEquip/UniqueEquipStarUpdateCtrl")
export default class UniqueEquipStarUpdateCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    curEquip: UiSlotItem = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    oldAttrs: cc.Node = null;

    @property(cc.Node)
    newAttrs: cc.Node = null;

    @property(cc.RichText)
    skillDesc: cc.RichText = null;

    @property(cc.Button)
    starUpBtn: cc.Button = null;

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    heroInfo: icmsg.HeroInfo;
    uniqueEquip: icmsg.UniqueEquip

    _careerIndex = 0

    get equipModel(): EquipModel {
        return ModelManager.get(EquipModel)
    }

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    onEnable() {
        this.heroInfo = ModelManager.get(HeroModel).curHeroInfo;
        //attr
        this.uniqueEquip = this.heroInfo.uniqueEquip
        let starCfg = ConfigManager.getItemByField(Unique_starCfg, "unique_id", this.uniqueEquip.itemId, { star: this.uniqueEquip.star });
        if (!starCfg) {
            this.close(-1)
            cc.log("缺少对应配置")
            return
        }
        let uniqueEquipCfg = ConfigManager.getItemById(UniqueCfg, this.uniqueEquip.itemId)

        let nextStarCfg = ConfigManager.getItemByField(Unique_starCfg, "unique_id", this.uniqueEquip.itemId, { star: this.uniqueEquip.star + 1 });
        let attrNames = ['atk_g', 'hp_g', 'def_g'];
        let oldAttr = []
        let newAttr = []
        for (let i = 0; i < 3; i++) {
            let oldValue = starCfg[attrNames[i]]
            let nextValue = nextStarCfg[attrNames[i]]
            this.oldAttrs.getChildByName(attrNames[i]).getComponent(cc.Label).string = oldValue + '';
            this.newAttrs.getChildByName(attrNames[i]).getComponent(cc.Label).string = nextValue + '';
            oldAttr.push(Math.floor(oldValue))
            newAttr.push(Math.floor(nextValue))
        }

        let colorInfo = BagUtils.getColorInfo(uniqueEquipCfg.color);
        this.nameLab.string = `${uniqueEquipCfg.name}`
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline)

        this.nameLab.string = `${starCfg.unique_name}`

        this.curEquip.updateItemInfo(this.uniqueEquip.itemId)
        this.curEquip.updateStar(this.uniqueEquip.star)
        this.curEquip.starNum = this.uniqueEquip.star

        this.slotItem.updateItemInfo(this.uniqueEquip.itemId)

        if (this.heroModel.curHeroInfo) {
            this._careerIndex = uniqueEquipCfg.career_id.indexOf(this.heroModel.curHeroInfo.careerId)
            if (this._careerIndex == -1) {
                this._careerIndex = 0
            }
        }
        this.skillDesc.string = (this._careerIndex == 0 ? `${nextStarCfg.des1}` : `${nextStarCfg.des2}`)

        //power
        let atkRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'atk').value;
        let hpRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'hp').value;
        let defRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'def').value;
        let oldPower = oldAttr[0] * atkRatio + oldAttr[1] * hpRatio + oldAttr[2] * defRatio
        let newPower = newAttr[0] * atkRatio + newAttr[1] * hpRatio + newAttr[2] * defRatio
        this.oldAttrs.getChildByName('power').getComponent(cc.Label).string = Math.floor(oldPower) + ''
        this.newAttrs.getChildByName('power').getComponent(cc.Label).string = Math.floor(newPower) + ''

        //star
        let star = this.heroInfo.uniqueEquip.star
        let oldStar = '0'.repeat(star);
        let newStar = '0'.repeat(star + 1);
        let oldStarLb = this.oldAttrs.getChildByName('star').getComponent(cc.Label)
        let newStarLb = this.newAttrs.getChildByName('star').getComponent(cc.Label)
        oldStarLb.string = oldStar;
        newStarLb.string = newStar;

        this.updateMaterials()
    }

    onDisable() {
        this.equipModel.uniqueUpStarMaterialId = []
    }

    @gdk.binding("equipModel.uniqueUpStarMaterialId")
    updateMaterials() {
        let ctrl = this.slotItem.node.getComponent(UiSlotItem)
        let itemName = this.slotItem.node.getChildByName("itemName").getComponent(cc.Label)
        let add = this.slotItem.node.getChildByName("add")
        let num = this.slotItem.node.getChildByName("num").getComponent(cc.Label)
        let redpoint = this.slotItem.node.getChildByName("RedPoint")
        redpoint.active = RedPointUtils.is_unique_equip_can_star_up(this.heroInfo)
        if (this.equipModel.uniqueUpStarMaterialId.length == 0) {
            ctrl.updateItemInfo(this.uniqueEquip.itemId)
            add.active = true
            let cfg = BagUtils.getConfigById(this.uniqueEquip.itemId)
            itemName.string = `${cfg.name}`
            num.string = `${0}/${1}`
            return
        }
        let id = this.equipModel.uniqueUpStarMaterialId[0]
        if (this.equipModel.uniqueIdItems[id]) {
            id = this.equipModel.uniqueIdItems[id].itemId
        } else {
            let uniqueCfg = ConfigManager.getItemById(UniqueCfg, this.uniqueEquip.itemId)
            let color4_item = ConfigManager.getItemById(Unique_globalCfg, "color4_item").value[0]
            id = color4_item
            if (uniqueCfg.color == 5) {
                let color5_item = ConfigManager.getItemById(Unique_globalCfg, "color5_item").value[0]
                id = color5_item
            }
        }
        ctrl.updateItemInfo(id)
        let cfg = BagUtils.getConfigById(id)
        itemName.string = `${cfg.name}`
        add.active = false
        redpoint.active = false
        num.string = `${1}/${1}`
    }

    onStarUpBtnClick() {
        if (this.equipModel.uniqueUpStarMaterialId.length == 0) {
            gdk.gui.showMessage("请先选择升星材料")
            return
        }
        let msg = new icmsg.UniqueEquipStarUpReq()
        msg.id = this.uniqueEquip.id
        msg.heroId = this.heroInfo.heroId
        let id = this.equipModel.uniqueUpStarMaterialId[0]
        let goodInfo = new icmsg.GoodsInfo()
        if (this.equipModel.uniqueIdItems[id]) {
            msg.cost = goodInfo
            msg.costUniqueId = id
        } else {
            let uniqueCfg = ConfigManager.getItemById(UniqueCfg, this.uniqueEquip.itemId)
            let color4_item = ConfigManager.getItemById(Unique_globalCfg, "color4_item").value[0]
            id = color4_item
            if (uniqueCfg.color == 5) {
                let color5_item = ConfigManager.getItemById(Unique_globalCfg, "color5_item").value[0]
                id = color5_item
            }
            goodInfo.typeId = id
            goodInfo.num = 1
            msg.cost = goodInfo
        }
        NetManager.send(msg, (data: icmsg.UniqueEquipStarUpRsp) => {
            this.heroModel.curHeroInfo.uniqueEquip = data.equip
            HeroUtils.updateHeroInfo(this.heroModel.curHeroInfo.heroId, this.heroModel.curHeroInfo)
            gdk.e.emit(RoleEventId.UPDATE_HERO_UNIQUE_EQUIP)

            gdk.panel.setArgs(PanelId.UniqueEquipStarUpdateEffect, this.heroInfo, this.uniqueEquip)
            gdk.panel.open(PanelId.UniqueEquipStarUpdateEffect, () => {
                gdk.panel.hide(PanelId.UniqueEquipStarUpdate)
            })
        })
    }

    onMaterialSelect() {
        gdk.panel.setArgs(PanelId.UniqueEquipMaterialsSelectView, this.uniqueEquip)
        gdk.panel.open(PanelId.UniqueEquipMaterialsSelectView)
    }
}