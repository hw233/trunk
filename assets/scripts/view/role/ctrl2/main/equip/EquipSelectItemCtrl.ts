import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipUtils, { AttrType, EquipAttrTYPE } from '../../../../../common/utils/EquipUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../../common/utils/GuideUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../../common/models/BagModel';
import { Item_equipCfg } from '../../../../../a/config';
/** 
 * @Description: 装备选择面板子项
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 10:41:59
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/equip/EquipSelectItemCtrl")
export default class EquipSelectItemCtrl extends UiListItem {


    @property(UiSlotItem)
    equipItem: UiSlotItem = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    powerLab: cc.Label = null

    @property(cc.Node)
    attPanel: cc.Node = null

    @property(cc.Node)
    attNode: cc.Node = null

    @property(cc.Node)
    btnOn: cc.Node = null

    @property(cc.Node)
    btnOff: cc.Node = null

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel);
    }

    _bagItem: BagItem
    _equipCfg: Item_equipCfg

    onEnable() {

    }

    updateView() {
        this._bagItem = this.data
        this._equipCfg = ConfigManager.getItemById(Item_equipCfg, this._bagItem.itemId)
        this.equipItem.updateItemInfo(this._bagItem.itemId, this._bagItem.itemNum)
        this.equipItem.updateStar(this._equipCfg.star)
        this.equipItem.starNum = this._equipCfg.star
        let attrArr = EquipUtils.getEquipAttrNum(this._bagItem.itemId)

        this.powerLab.string = `${gdk.i18n.t("i18n:HERO_TIP31")}${GlobalUtil.getEquipPower(this._bagItem)}`
        this.nameLab.string = this._equipCfg.name
        this.nameLab.node.color = BagUtils.getColor(this._equipCfg.color)
        let outline = this.nameLab.node.getComponent(cc.LabelOutline)
        outline.color = BagUtils.getOutlineColor(this._equipCfg.color)

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

        if (this.heroModel.curEquip && this.heroModel.curEquip.itemId == this._bagItem.itemId) {
            this.btnOff.active = true
            this.btnOn.active = false
        } else {
            this.btnOff.active = false
            this.btnOn.active = true
        }

        if (this.curIndex == 0) {
            GuideUtil.bindGuideNode(809, this.btnOn)
        }
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        attNode.active = true
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = info.name
        let value = `${info.value}`
        if (info.type == EquipAttrTYPE.R) {
            value = `${Number(info.value / 100).toFixed(1)}%`
        }
        numLab.string = `+${value}`
    }

    equipOnFunc() {
        let ids = []
        for (let i = 0; i < 4; i++) {
            if (this._equipCfg.part - 1 == i) {
                ids.push(this._bagItem.itemId)
            } else {
                ids.push(0)
            }
        }
        let msg = new icmsg.HeroEquipOnReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId
        msg.equipIds = ids
        NetManager.send(msg)
        gdk.Timer.callLater(this, this._hidePanel)
    }

    equipOffFucn() {
        let msg = new icmsg.HeroEquipOffReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId
        msg.equipParts = [this._equipCfg.part - 1]
        NetManager.send(msg)
        gdk.Timer.callLater(this, this._hidePanel)
    }

    _hidePanel() {
        gdk.panel.hide(PanelId.EquipSelect2)
    }
}