import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeUtils from '../../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { AttrType, EquipAttrTYPE } from '../../../../common/utils/EquipUtils';
import { BagItem } from '../../../../common/models/BagModel';
import { CostumeCfg } from '../../../../a/config';

/** 
 * @Description: 装备选择面板子项
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-07 14:40:24
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeSelectItem")
export default class CostumeSelectItem extends UiListItem {

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

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel);
    }

    _bagItem: BagItem
    _costumeCfg: CostumeCfg

    onEnable() {

    }

    updateView() {
        this._bagItem = this.data
        this._costumeCfg = ConfigManager.getItemById(CostumeCfg, this._bagItem.itemId)
        this.equipItem.updateItemInfo(this._bagItem.itemId, this._bagItem.itemNum)
        this.equipItem.updateStar(this._costumeCfg.star)
        this.equipItem.starNum = this._costumeCfg.star
        let attrArr = CostumeUtils.getCostumeAttrNum(this._bagItem)
        let info: icmsg.CostumeInfo = this._bagItem.extInfo as icmsg.CostumeInfo
        this.powerLab.string = `${gdk.i18n.t("i18n:HERO_TIP31")}${this.powerLab.string = `${CostumeUtils.getEquipPower(info)}`}`
        this.lvLabel.string = '.' + info.level + '';
        this.nameLab.string = this._costumeCfg.name
        this.nameLab.node.color = BagUtils.getColor(this._costumeCfg.color)
        let outline = this.nameLab.node.getComponent(cc.LabelOutline)
        outline.color = BagUtils.getOutlineColor(this._costumeCfg.color)

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

        if (this.heroModel.curCostume && this.heroModel.curCostume.series == this._bagItem.series) {
            this.btnOff.active = true
            this.btnOn.active = false
        } else {
            this.btnOff.active = false
            this.btnOn.active = true
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
        let msg = new icmsg.CostumeOnReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId
        msg.index = this._costumeCfg.part
        msg.costumeId = this._bagItem.series
        NetManager.send(msg)
        gdk.Timer.callLater(this, this._hidePanel)
    }

    equipOffFucn() {
        let msg = new icmsg.CostumeOnReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId
        msg.index = this._costumeCfg.part
        msg.costumeId = 0
        NetManager.send(msg)
        gdk.Timer.callLater(this, this._hidePanel)
    }

    _hidePanel() {
        gdk.panel.hide(PanelId.CostumeSelect)
    }
}