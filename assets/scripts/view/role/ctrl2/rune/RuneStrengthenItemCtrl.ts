import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import NetManager from '../../../../common/managers/NetManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { RuneCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-04 16:29:07 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneMergeItemCtrl")
export default class RuneStrengthenItemCtrl extends UiListItem {
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
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this._item.itemId.toString().slice(0, 6)));
        let info = <icmsg.RuneInfo>this._item.extInfo;
        this.slotItem.updateItemInfo(cfg.rune_id, this._item.itemNum);
        this.lvLabel.string = '.' + cfg.level + '';
        if (info.heroId) {
            this.heroNode.active = true;
            let heroTypeId = HeroUtils.getHeroInfoByHeroId(info.heroId).typeId;
            GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), GlobalUtil.getIconById(heroTypeId));
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
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this._item.itemId.toString().slice(0, 6)));
        let nextCfg = ConfigManager.getItemByField(RuneCfg, 'color', cfg.color, { level: cfg.level + 1 });
        if (nextCfg && cfg.strengthening && cfg.strengthening[0]) {
            let cost = cfg.strengthening[0];
            if (BagUtils.getItemNumById(cost[0]) >= cost[1]) {
                this.redPoint.active = true;
                return;
            }
        }
        this.redPoint.active = false;
    }
}
