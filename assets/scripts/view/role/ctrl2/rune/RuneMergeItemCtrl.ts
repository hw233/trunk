import CopyUtil from '../../../../common/utils/CopyUtil';
import NetManager from '../../../../common/managers/NetManager';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { RoleEventId } from '../../enum/RoleEventId';
import { RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-10 16:27:59 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneMergeItemCtrl")
export default class RuneMergeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null

    @property(cc.Node)
    select: cc.Node = null;

    @property(cc.Node)
    lock: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Label)
    lv: cc.Label = null;

    _item: RuneCfg
    onEnable() {
        gdk.e.on(RoleEventId.RUNE_ADD, this._updateRedpoint, this);
        gdk.e.on(RoleEventId.RUNE_REMOVE, this._updateRedpoint, this);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateRedpoint, this);
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
    }

    updateView() {
        this._item = this.data
        this.slotItem.updateItemInfo(this._item.rune_id);
        this.lv.string = '.' + this._item.level;
        this.lock.active = !CopyUtil.isFbPassedById(this._item.unlock);
        if (this.lock.active) {
            this.lock.getChildByName('label').getComponent(cc.Label).string = this._item.unlock_name;
        }
        this._updateRedpoint();
    }

    _itemSelect() {
        if (this._item) {
            this.select.active = this.ifSelect
        }
    }

    _updateRedpoint() {
        if (cc.isValid(this.node) && this._item) {
            this.redPoint.active = RedPointUtils.is_single_rune_can_merage(this._item);
        }
    }
}
