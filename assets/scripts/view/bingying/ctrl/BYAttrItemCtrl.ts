import GlobalUtil from '../../../common/utils/GlobalUtil';
import { AttrType } from '../../../common/utils/EquipUtils';
/** 
  * @Description: 
  * @Author: weiliang.huang  
  * @Date: 2019-05-08 14:31:02 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-10-30 16:56:10
*/



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYAttrItemCtrl")
export default class BYAttrItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Label)
    attrName: cc.Label = null

    @property(cc.Label)
    attrValue: cc.Label = null

    onEnable() {

    }

    updateViewInfo(type, info: AttrType) {
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/bingying/texture/new/by_attr_${type}_${info.keyName}`)

        this.attrName.string = info.name
        let text = `+${info.value}`
        if (info.type == "r") {
            text = `+${info.value / 100}%`
        }
        this.attrValue.string = text
    }
}