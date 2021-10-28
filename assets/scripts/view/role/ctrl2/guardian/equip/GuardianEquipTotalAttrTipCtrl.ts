import GuardianUtils from '../GuardianUtils';
import { AttrType } from '../../../../../common/utils/EquipUtils';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-19 16:34:44
 */

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipTotalAttrTipCtrl")
export default class GuardianEquipTotalAttrTipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    attrNodes: cc.Node[] = [];

    onEnable() {
        let guardian: icmsg.Guardian = this.args[0]
        let attrInfos = GuardianUtils.getGuardianEquipAttrs(guardian)
        for (let i = 0; i < this.attrNodes.length; i++) {
            this._updateOneAttr(this.attrNodes[i], attrInfos[i])
        }
    }

    //更新单条属性数据
    _updateOneAttr(attNode: cc.Node, attrInfo: AttrType) {
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        let addLab = attNode.getChildByName("addLab").getComponent(cc.Label)
        typeLab.string = attrInfo.name + ":"
        numLab.string = `${attrInfo.initValue}`
        addLab.string = ''
        if (attrInfo.value > 0) {
            addLab.string = `+${attrInfo.value}`
        }
    }

}