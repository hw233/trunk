import BagUtils from '../../../../common/utils/BagUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';

/** 
 * @Description: 新 生存训练 物品展示 
 * @Author: luoyong
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-15 14:16:05
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/survival/InstanceSurvivalRewardItemCtrl")
export default class InstanceSurvivalRewardItemCtrl extends gdk.ItemRenderer {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Label)
    lab1: cc.Label = null;

    @property(cc.Node)
    state2: cc.Node = null;

    @property(cc.Label)
    lab2: cc.Label = null;

    /**第一位 物品id 第二位 状态（0 正常显示，1显示波次，2显示锁定波次） 第三位 波次*/

    updateView() {
        if (!this.data) return;
        let id = this.data[0]
        let state = this.data[1]
        let sort = this.data[2]

        this.slot.updateItemInfo(id)
        let item: BagItem = {
            series: id,
            itemId: id,
            itemNum: 1,
            type: BagUtils.getItemTypeById(id),
            extInfo: null
        }
        this.slot.itemInfo = item
        if (state == 1) {
            this.state1.active = true
            this.state2.active = false
            this.lab1.string = StringUtils.format(gdk.i18n.t("i18n:INS_SURVIVAL_TIP1"), sort)//`${sort}波掉落`
        } else if (state == 2) {
            this.state1.active = false
            this.state2.active = true
            this.lab2.string = StringUtils.format(gdk.i18n.t("i18n:INS_SURVIVAL_TIP1"), sort)//`${sort}波掉落`
        } else {
            this.state1.active = false
            this.state2.active = false
        }

    }

}