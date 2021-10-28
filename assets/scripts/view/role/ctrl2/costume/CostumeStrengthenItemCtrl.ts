import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeUtils from '../../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import NetManager from '../../../../common/managers/NetManager';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { CostumeCfg } from '../../../../a/config';

/**
 * @Description: 神装
 * @Author: luoyong
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:09:50
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeStrengthenItemCtrl")
export default class CostumeStrengthenItemCtrl extends UiListItem {
    @property(UiSlotItem)
    slotItem: UiSlotItem = null

    @property(cc.Node)
    select: cc.Node = null;

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    _item: BagItem
    onEnable() {
        // gdk.e.on(RoleEventId.RUNE_ADD, this._updateRedpoint, this);
        // gdk.e.on(RoleEventId.RUNE_REMOVE, this._updateRedpoint, this);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateRedpoint, this);
    }

    onDisable() {
        // gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    updateView() {
        this._item = this.data
        let info = <icmsg.CostumeInfo>this._item.extInfo;
        this.slotItem.updateItemInfo(this._item.itemId);
        let cfg = ConfigManager.getItemById(CostumeCfg, this._item.itemId)
        this.slotItem.updateStar(cfg.star)
        this.slotItem.starNum = cfg.star
        this.lvLabel.string = '.' + info.level + '';
        let heroInfo = CostumeUtils.getHeroInfoBySeriesId(info.id)
        let typeId = heroInfo ? heroInfo.typeId : 0
        if (typeId > 0) {
            this.heroNode.active = true;
            GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), HeroUtils.getHeroHeadIcon(heroInfo.typeId, heroInfo.star));
        }
        else {
            this.heroNode.active = false;
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
        let info = <icmsg.CostumeInfo>this._item.extInfo;
        let heroInfo = CostumeUtils.getHeroInfoBySeriesId(info.id)
        let cfg = ConfigManager.getItemById(CostumeCfg, this._item.itemId)
        this.redPoint.active = RedPointUtils.is_can_costume_strength(heroInfo, cfg.part)
    }
}
