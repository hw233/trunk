import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipModel from '../../../../../common/models/EquipModel';
import HeroModel from '../../../../../common/models/HeroModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { Global_powerCfg, Unique_starCfg, UniqueCfg } from '../../../../../a/config';
/** 
 * @Description:装备列表
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-12 10:15:46
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/uniqueEquip/UniqueEquipStarUpdateEffectCtrl")
export default class UniqueEquipStarUpdateEffectCtrl extends gdk.BasePanel {

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


    _heroInfo: icmsg.HeroInfo;
    _uniqueEquip: icmsg.UniqueEquip
    _careerIndex = 0

    onEnable() {
        let args = this.args
        this._heroInfo = args[0]
        this._uniqueEquip = args[1]
        this._updateViewInfo()
    }

    _updateViewInfo() {
        let starCfg = ConfigManager.getItemByField(Unique_starCfg, "unique_id", this._uniqueEquip.itemId, { star: this._uniqueEquip.star });
        if (!starCfg) {
            this.close(-1)
            cc.log("缺少对应配置")
            return
        }
        let uniqueEquipCfg = ConfigManager.getItemById(UniqueCfg, this._uniqueEquip.itemId)

        let nextStarCfg = ConfigManager.getItemByField(Unique_starCfg, "unique_id", this._uniqueEquip.itemId, { star: this._uniqueEquip.star + 1 });
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
        this.curEquip.updateItemInfo(this._uniqueEquip.itemId)
        this.curEquip.updateStar(this._uniqueEquip.star + 1)
        this.curEquip.starNum = this._uniqueEquip.star + 1


        this._careerIndex = uniqueEquipCfg.career_id.indexOf(this._heroInfo.careerId)
        if (this._careerIndex == -1) {
            this._careerIndex = 0
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
        let star = this._uniqueEquip.star
        let oldStar = '0'.repeat(star);
        let newStar = '0'.repeat(star + 1);
        let oldStarLb = this.oldAttrs.getChildByName('star').getComponent(cc.Label)
        let newStarLb = this.newAttrs.getChildByName('star').getComponent(cc.Label)
        oldStarLb.string = oldStar;
        newStarLb.string = newStar;
    }


}