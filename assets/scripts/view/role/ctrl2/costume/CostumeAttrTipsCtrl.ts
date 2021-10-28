import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeAttrItemCtrl from './CostumeAttrItemCtrl';
import CostumeUtils from '../../../../common/utils/CostumeUtils';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import { AttrType } from '../../../../common/utils/EquipUtils';
import { Costume_attrCfg } from '../../../../a/config';

/**
 * 神装
 * @Author: weiliang.huang
 * @Description:
 * @Date: 2019-03-21 09:57:55
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-07 17:39:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeAttrTipsCtrl")
export default class CostumeAttrTipsCtrl extends gdk.BasePanel {

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    attrItem: cc.Prefab = null

    get heroModel() {
        return ModelManager.get(HeroModel);
    }

    onEnable() {
        //let heroInfo = this.heroModel.curHeroInfo
        let costumeIds = this.args[0] //神装信息
        let keyMap = CostumeUtils.getAllCostumeAttr(costumeIds)
        //基础属性
        let keys = ["atk_g", "def_g", "hp_g", "atk_dmg"]
        let a_count = 0
        let a_page = 1
        for (let i = 0; i < keys.length; i++) {
            let info: AttrType = keyMap[keys[i]] ? keyMap[keys[i]] : null
            if (!info) {
                let cfg = CostumeUtils.getAttrCfg(keys[i])
                if (cfg) {
                    info = {
                        id: 0,
                        name: cfg.attr_show,
                        value: 0,
                        type: cfg.attr_type,
                        keyName: keys[i],
                    }
                }
            }
            if (info) {
                if (a_count >= 2) {
                    a_count = 0
                    a_page += 1
                }
                a_count += 1
                let showBg = a_page % 2 == 1 ? true : false
                let a_item = cc.instantiate(this.attrItem)
                let ctrl = a_item.getComponent(CostumeAttrItemCtrl)
                ctrl.updateViewInfo(info, showBg)
                this.content.addChild(a_item)
            }
        }

        let attrs: icmsg.CostumeAttr[] = CostumeUtils.getAllCostumeAttrs(costumeIds)
        let b_count = 0
        let b_page = 1
        for (let i = 0; i < attrs.length; i++) {
            let cfg = ConfigManager.getItemById(Costume_attrCfg, attrs[i].id)
            if (keys.indexOf(cfg.attr[0]) == -1) {
                let info: AttrType = {
                    id: attrs[i].id,
                    name: cfg.attr_show,
                    value: attrs[i].value,
                    type: cfg.attr_type,
                }
                if (b_count >= 2) {
                    b_count = 0
                    b_page += 1
                }
                b_count += 1
                let showBg = b_page % 2 == 1 ? true : false
                let a_item = cc.instantiate(this.attrItem)
                let ctrl = a_item.getComponent(CostumeAttrItemCtrl)
                ctrl.updateViewInfo(info, showBg)
                this.content.addChild(a_item)
            }
        }
    }
}