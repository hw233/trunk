import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { Item_equipCfg, Item_rubyCfg } from '../../../a/config';

/**
 * @Description: 通关奖励任务奖励物品
 * @Author: yaozu.hu
 * @Date: 2019-10-09 17:39:12
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 12:58:58
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TaskRewardItemCtrl")
export default class TaskRewardItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    updateView() {
        this.slot.updateItemInfo(this.data.id, this.data.num)
        let itemType = BagUtils.getItemTypeById(this.data.id)
        if (itemType == BagType.EQUIP) {
            let cfg = ConfigManager.getItemById(Item_equipCfg, this.data.id)
            this.slot.updateStar(cfg.star)
        } else if (itemType == BagType.JEWEL) {
            let cfg = ConfigManager.getItemById(Item_rubyCfg, this.data.id)
            this.slot.updateStar(cfg.level)
            let quality = Math.min(cfg.level, 6)
            this.slot.updateQuality(quality)
        }

        let info = null;
        //装备详情显示
        if (itemType == BagType.EQUIP) {
            info = new icmsg.EquipInfo()
            info.typeId = this.data.id
            info.heroId = 0
            info.equipId = 1
            info.level = 1
            this.slot.noBtn = true;
        }

        let item: BagItem = {
            series: this.data.id,
            itemId: this.data.id,
            itemNum: this.data.num,
            type: itemType,
            extInfo: info
        }
        this.slot.itemInfo = item
        this.slot.noBtn = true
        this.slot.isOther = true;
    }
}
