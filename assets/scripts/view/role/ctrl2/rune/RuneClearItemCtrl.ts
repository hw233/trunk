import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-03 17:10:33 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneClearItemCtrl")
export default class RuneClearItemCtrl extends UiListItem {
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

    _item: BagItem;
    blessId: number;
    updateView() {
        [this._item, this.blessId] = [this.data.item, this.data.blessId];
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this._item.itemId.toString().slice(0, 6)));
        let info = <icmsg.RuneInfo>this._item.extInfo;
        this.slotItem.updateItemInfo(cfg.rune_id, this._item.itemNum);
        this.lvLabel.string = '.' + cfg.level + '';
        if (info.heroId) {
            this.heroNode.active = true;
            let heroInfo = HeroUtils.getHeroInfoByHeroId(info.heroId);
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
        this.redPoint.active = RedPointUtils.single_rune_clear(this._item);
    }
}
