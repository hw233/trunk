import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { AwardInfo } from '../../task/model/TaskModel';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { HeroCfg, Item_equipCfg, Item_rubyCfg } from '../../../a/config';


/** 
 * @Description: 
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 17:29:13 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-14 20:52:23
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/FirstPayItemCtrl")
export default class FirstPayItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    numBg: cc.Node = null

    @property(cc.Node)
    mask: cc.Node = null;

    info: AwardInfo = null
    updateView() {
        this.info = this.data
        // this.slot.isEffect = true;
        if (BagUtils.getItemTypeById(this.info.itemId) == BagType.HERO) {
            let cfg = ConfigManager.getItemById(HeroCfg, this.info.itemId);
            this.slot.group = cfg.group[0];
            this.slot.starNum = cfg.star_min;
        }
        this.slot.updateItemInfo(this.info.itemId, this.info.num)
        if (this.numBg) {
            this.numBg.active = this.info.num <= 1 ? false : true;
        }
        let itemId = this.info.itemId
        let type = BagUtils.getItemTypeById(itemId)
        if (type == BagType.EQUIP) {
            let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
            this.slot.updateStar(cfg ? cfg.star : 0)
        } else if (type == BagType.JEWEL) {
            let cfg = ConfigManager.getItemById(Item_rubyCfg, itemId)
            this.slot.updateStar(cfg.level)
        } else if (type == BagType.HERO) {
            let cfg = ConfigManager.getItemById(HeroCfg, itemId)
            this.slot.updateStar(cfg ? cfg.star_min : 0);
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

    setMaskStatus(show: boolean) {
        this.mask.active = show;
        this.slot.isEffect = !show;
        this.updateView();
        if (show) this.slot.qualityEffect(null);
    }
}