import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { Hero_careerCfg, HeroCfg, RuneCfg } from '../../../a/config';
import { SelectGiftInfo } from './SelectGiftViewCtrl';

/** 
  * @Description: 恭喜获得道具子项
  * @Author: luoyong 
  * @Date: 2019-09-12 14:24:36
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-23 16:15:38
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/SelectGiftGetListItemCtrl")
export default class SelectGiftGetListItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    _itemData: SelectGiftInfo
    _star: number

    start() {


    }
    onEnable() {

    }

    onDisable() {

    }
    /**
     *index: 
     typeId: 
     num:  
     mainId: 
     giftType: 
     */
    updateView() {
        this._itemData = this.data
        let type = BagUtils.getItemTypeById(this._itemData.itemId);
        this.lvLab.node.active = false;
        if (type == BagType.HERO) {
            let cfg = <HeroCfg>BagUtils.getConfigById(this._itemData.itemId);
            this.slot.group = cfg.group[0];
            this.slot.starNum = cfg.star_min;
            this.careerIcon.active = true;
            let type = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', cfg.career_id).career_type;
            GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        }
        else {
            this.slot.group = 0;
            this.slot.starNum = 0;
            this.careerIcon.active = false;
            if (type == BagType.RUNE) {
                this.lvLab.node.active = true;
                this.lvLab.string = '.' + ConfigManager.getItemById(RuneCfg, parseInt(this._itemData.itemId.toString().slice(0, 6))).level;
            } else if (type == BagType.GUARDIANEQUIP) {
                let itemId = parseInt(this._itemData.itemId.toString().slice(0, 6))
                this._star = parseInt(this._itemData.itemId.toString().slice(7))
                this._itemData.itemId = itemId
                this._itemData.star = this._star

            }
        }
        this.slot.updateItemInfo(this._itemData.itemId, this._itemData.num)

        if (type == BagType.GUARDIANEQUIP) {
            this.slot.updateStar(this._star)
            this.slot.starNum = this._star
        }
    }

    /**物品点击 */
    _itemClick() {
        let type = BagUtils.getItemTypeById(this._itemData.itemId)
        let extInfo = null;
        if (type == BagType.GUARDIANEQUIP) {
            let gEquipInfo = new icmsg.GuardianEquip
            gEquipInfo.id = this._itemData.itemId
            gEquipInfo.type = this._itemData.itemId
            gEquipInfo.star = this._itemData.star
            gEquipInfo.level = 1
            extInfo = gEquipInfo;
        }
        let bagItem: BagItem = {
            series: 0,
            itemId: this._itemData.itemId,
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._itemData.itemId),
            extInfo: extInfo,
        }
        GlobalUtil.openItemTips(bagItem)
    }

}
