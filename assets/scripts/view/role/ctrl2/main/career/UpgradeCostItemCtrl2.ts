import BagUtils from '../../../../../common/utils/BagUtils';
import GlobalUtil, { CommonNumColor } from '../../../../../common/utils/GlobalUtil';
import { MoneyType } from '../../../../store/ctrl/StoreViewCtrl';

/*
   //英雄升阶  等级达到即可升阶
 * @Author: luoyong 
 * @Date: 2020-02-27 10:33:07 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-01 19:43:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/UpgradeCostItemCtrl2")
export default class UpgradeCostItemCtrl2 extends cc.Component {

    @property(cc.Node)
    costIcon: cc.Node = null

    @property(cc.Node)
    ExpIcon: cc.Node = null

    @property(cc.Label)
    costLab: cc.Label = null

    updateItemInfo(id, num) {
        this.ExpIcon.active = false
        this.costIcon.active = true
        if (id < 10000) {
            GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getSmallMoneyIcon(id))
        } else {
            GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getIconById(id))
        }
        this.costLab.string = `x${GlobalUtil.numberToStr(num, true)}`
        this.costLab.node.color = cc.color("#E7D8AC")
        if (BagUtils.getItemNumById(id) < num) {
            this.costLab.node.color = CommonNumColor.red
        }
    }
}