import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import JumpUtils from '../../../common/utils/JumpUtils';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { General_weaponCfg, ItemCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-20 16:49:49 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/general/GeneralWeaponTipsViewCtrl')
export default class GeneralWeaponTipsViewCtrl extends gdk.BasePanel {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    @property(cc.Label)
    botDesc: cc.Label = null;

    @property(cc.Node)
    atrValues: cc.Node = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    onEnable() {
        let weaponId = this.args[0];
        let weaponCfg = ConfigManager.getItemById(General_weaponCfg, weaponId);
        let itemCfg = ConfigManager.getItemById(ItemCfg, weaponCfg.item);
        this.slot.updateItemInfo(itemCfg.id, 1);
        this.desc.string = itemCfg.des;
        this.botDesc.string = weaponCfg.des;
        this.nameLabel.string = weaponCfg.name;
        let color = weaponCfg.quality;
        this.nameLabel.node.color = BagUtils.getColor(color);
        this.nameLabel.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(color);
        //attr
        let attr = ['atk_h', 'hp_h', 'def_h', 'atk_s', 'hp_s', 'def_s'];
        attr.forEach(att => {
            this.atrValues.getChildByName(att).getComponent(cc.Label).string = '+' + weaponCfg[att];
        });
    }

    onGoBtnClick() {
        if (JumpUtils.openView(2814, true)) {
            this.close();
            gdk.panel.hide(PanelId.ActivityMainView);
        }

    }
}
