import { AttrType, EquipAttrTYPE } from '../../../../common/utils/EquipUtils';
/** 
 * @Description: 装备选择面板子项
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-31 16:25:10
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeAttrItemCtrl")
export default class CostumeAttrItemCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Label)
    attrName: cc.Label = null

    @property(cc.Label)
    attrValue: cc.Label = null

    onEnable() {

    }

    updateViewInfo(info: AttrType, showBg: boolean = false) {
        this.bg.active = showBg
        this.attrName.string = `${info.name}`
        let value = `${info.value}`
        if (info.type == EquipAttrTYPE.R) {
            value = `${Number(info.value / 100).toFixed(1)}%`
        }
        this.attrValue.string = `${value}`
    }
}