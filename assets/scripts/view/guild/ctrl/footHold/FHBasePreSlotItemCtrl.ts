import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';


/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-27 10:12:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBasePreSlotItemCtrl")
export default class FHBasePreSlotItemCtrl extends cc.Component {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    getFlag: cc.Node = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    updateSoltItem(cfgLv, itemId, num) {
        this.slotItem.updateItemInfo(itemId, num)
        this.getFlag.active = false
        if (this.footHoldModel.rewardedBaseLevel >= cfgLv) {
            this.getFlag.active = true
        }
    }
}