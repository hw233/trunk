import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil, { CommonNumColor } from '../../../common/utils/GlobalUtil';

/*
 * @Author: luoyong 
 * @Date: 2020-02-27 10:33:07 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-08-28 17:58:54
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYCostItemCtrl")
export default class BYCostItemCtrl extends cc.Component {

    @property(cc.Node)
    costIcon: cc.Node = null

    @property(cc.Label)
    costLab: cc.Label = null

    updateItemInfo(id, num) {
        GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getIconById(id))
        this.costLab.string = `${GlobalUtil.numberToStr(BagUtils.getItemNumById(id), true)}/${GlobalUtil.numberToStr(num, true)}`
        this.costLab.node.color = cc.color("#E7D8AC")
        if (BagUtils.getItemNumById(id) < num) {
            this.costLab.node.color = CommonNumColor.red
        }
    }
}