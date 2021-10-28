import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Guardian_tipsCfg } from '../../../../a/config';

/** 
 * @Description: 英雄守护者召唤物概率Item
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-29 12:05:48
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianCallProbabilityItemCtrl")
export default class GuardianCallProbabilityItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;
    @property(cc.Label)
    des: cc.Label = null;
    @property(cc.Label)
    probability: cc.Label = null;

    cfg: Guardian_tipsCfg;
    updateView() {
        this.cfg = this.data;
        this.slotItem.updateItemInfo(this.cfg.item_icon);
        this.des.string = this.cfg.item;
        this.probability.string = this.cfg.weight;
    }
}
