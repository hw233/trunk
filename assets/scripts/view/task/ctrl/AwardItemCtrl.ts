import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { AwardInfo } from '../model/TaskModel';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { Item_equipCfg, Item_rubyCfg } from '../../../a/config';
/*
 * @Author: your name
 * @Date: 2020-04-27 19:02:39
 * @LastEditTime: 2020-04-29 19:22:18
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\scripts\view\task\ctrl\AwardItemCtrl.ts
 */

/** 
 * @Description: 
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 17:29:13 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-01-08 14:01:26
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/AwardItemCtrl")
export default class AwardItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    numBg: cc.Node = null

    info: AwardInfo = null
    updateView() {
        this.info = this.data
        this.slot.starNum = 0;
        this.slot.updateItemInfo(this.info.itemId, this.info.num)
        if (this.numBg) {
            this.numBg.active = this.info.num <= 1 ? false : true;
        }
        let itemId = this.info.itemId
        let type = BagUtils.getItemTypeById(itemId)
        if (type == BagType.EQUIP) {
            let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
            this.slot.updateStar(cfg.star)
        } else if (type == BagType.JEWEL) {
            let cfg = ConfigManager.getItemById(Item_rubyCfg, itemId)
            //宝石不显示星级
            //this.slot.updateStar(cfg.level)
        }
    }

    _itemClick() {
        let type = BagUtils.getItemTypeById(this.info.itemId)
        // 这里不传extInfo,是为了控制弹出的提示不会显示额外的信息
        let item: BagItem = {
            series: this.info.itemId,
            itemId: this.info.itemId,
            itemNum: this.info.num,
            type: type,
            extInfo: null,
        }
        GlobalUtil.openItemTips(item, true)
    }
}