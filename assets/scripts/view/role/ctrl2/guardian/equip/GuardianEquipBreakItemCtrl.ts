import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuardianUtils from '../GuardianUtils';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import NetManager from '../../../../../common/managers/NetManager';
import RedPointUtils from '../../../../../common/utils/RedPointUtils';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../../common/models/BagModel';
import { Guardian_equipCfg } from '../../../../../a/config';
import { GuardianEquipItemInfo } from './GuardianEquipStrengthenPanelCtrl';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:13:48
 */

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipBreakItemCtrl")
export default class GuardianEquipBreakItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null

    @property(cc.Node)
    select: cc.Node = null;

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(cc.Node)
    guardianHead: cc.Node = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    _itemInfo: GuardianEquipItemInfo
    _item: BagItem
    onEnable() {
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateRedpoint, this);
    }

    onDisable() {
        // gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    updateView() {
        this._itemInfo = this.data
        this._item = this._itemInfo.bagItem
        let info = <icmsg.GuardianEquip>this._item.extInfo;
        this.slotItem.updateItemInfo(this._item.itemId);
        this.slotItem.updateStar(info.star)
        this.slotItem.starNum = info.star
        this.lvLabel.string = '.' + info.level + '';
        if (this._itemInfo.heroTypeId > 0) {
            this.heroNode.active = true;
            let heroInfo = GuardianUtils.getGuardianHeroInfo(this._itemInfo.guardianId)
            GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), HeroUtils.getHeroHeadIcon(heroInfo.typeId, heroInfo.star));
        }
        else {
            this.heroNode.active = false;
        }

        if (this._itemInfo.guardianTypeId > 0) {
            GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/head', this.guardianHead), GlobalUtil.getIconById(this._itemInfo.guardianTypeId));
        } else {
            this.guardianHead.active = false;
        }

        this._updateRedpoint();
    }

    _itemSelect() {
        if (this._item) {
            this.select.active = this.ifSelect
        }
    }

    _updateRedpoint() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this._item) return;

        let heroInfo = GuardianUtils.getGuardianHeroInfo(this._itemInfo.guardianId)
        if (heroInfo && heroInfo.heroId > 0) {
            let equipCfg = ConfigManager.getItemById(Guardian_equipCfg, this._item.itemId)
            this.redPoint.active = RedPointUtils.is_can_guardian_equip_break_by_part(heroInfo, equipCfg.part)
        }
    }

}