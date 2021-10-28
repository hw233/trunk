import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { MoneyType } from '../../../store/ctrl/StoreViewCtrl';

/** 
 * @Description: 新 生存训练 物品展示 
 * @Author: luoyong
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-09-18 17:07:07
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/survival/InstanceSurvivalRewardItemCtrl2")
export default class InstanceSurvivalRewardItemCtrl2 extends gdk.ItemRenderer {

    @property(cc.Sprite)
    UiItemIcon: cc.Sprite = null;

    @property(cc.Label)
    UiNumLab: cc.Label = null;

    /**第一位 物品id 第二位 状态（0 正常显示，1显示波次，2显示锁定波次） 第三位 波次*/

    updateView() {
        if (!this.data) return;
        let id = this.data[0]
        let numStr = this.data[1]
        let type = BagUtils.getItemTypeById(id);

        // 图标
        let path = GlobalUtil.getIconById(id, type);
        this.UiItemIcon.node.active = !!path
        GlobalUtil.setSpriteIcon(this.node, this.UiItemIcon, path);

        // 数量
        if (id == MoneyType.Gold || id == MoneyType.Exp || id == MoneyType.HeroExp) {
            // 金币显示
            let numInt = parseInt(numStr)
            if (this.UiNumLab.font && (this.UiNumLab.font.name == "bagNumFont" || this.UiNumLab.font.name == "DengjiFont")) {
                numStr = GlobalUtil.numberToStr(numInt, true, true)
            } else {
                numStr = GlobalUtil.numberToStr(numInt, true, false)
            }
        }
        this.UiNumLab.node.active = true;
        this.UiNumLab.string = numStr;
    }
}