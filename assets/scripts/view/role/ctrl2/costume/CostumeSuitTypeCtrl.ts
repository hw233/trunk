import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeModel from '../../../../common/models/CostumeModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import { Costume_compositeCfg, CostumeCfg } from '../../../../a/config';
/** 
 * @Description: 装备选择面板子项
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-21 17:11:50
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeSuitTypeCtrl")
export default class CostumeSuitTypeCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    numLab: cc.Label = null

    onEnable() {

    }

    updateViewInfo(suitType, part) {
        let cfg = ConfigManager.getItemByField(Costume_compositeCfg, "type", suitType)
        if (cfg) {
            GlobalUtil.setSpriteIcon(this.node, this.icon, `view/role/texture/costume/suit/sz_icon_${suitType}`)
            this.nameLab.string = `${cfg.name}`
            let count = 0
            let model = ModelManager.get(CostumeModel)
            let items = model.costumeItems
            for (let i = 0; i < items.length; i++) {
                let c_cfg = ConfigManager.getItemById(CostumeCfg, items[i].itemId)
                if (c_cfg && c_cfg.type == suitType && c_cfg.part == part) {
                    count++
                }
            }
            this.numLab.string = `${count}`
        }
    }


    updateTotalViewInfo(suitType) {
        let cfg = ConfigManager.getItemByField(Costume_compositeCfg, "type", suitType)
        if (cfg) {
            GlobalUtil.setSpriteIcon(this.node, this.icon, `view/role/texture/costume/suit/sz_icon_${suitType}`)
            this.nameLab.string = `${cfg.name}`
            let count = 0
            let model = ModelManager.get(CostumeModel)
            let items = model.costumeItems
            for (let i = 0; i < items.length; i++) {
                let c_cfg = ConfigManager.getItemById(CostumeCfg, items[i].itemId)
                if (c_cfg && c_cfg.type == suitType) {
                    count++
                }
            }
            this.numLab.string = `${count}`
        }
    }


    updateSuitSelectInfo(suitType, part, careerType) {
        let cfg = ConfigManager.getItemByField(Costume_compositeCfg, "type", suitType)
        if (cfg) {
            GlobalUtil.setSpriteIcon(this.node, this.icon, `view/role/texture/costume/suit/sz_icon_${suitType}`)
            this.nameLab.string = `${cfg.name}`
            let count = 0
            let model = ModelManager.get(CostumeModel)
            let items = model.costumeItems
            for (let i = 0; i < items.length; i++) {
                let c_cfg = ConfigManager.getItemById(CostumeCfg, items[i].itemId)
                if (c_cfg && c_cfg.type == suitType && c_cfg.part == part && c_cfg.career_type == careerType) {
                    count++
                }
            }
            this.numLab.string = `${count}`
        }
    }
}