import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Guardian_drawCfg } from '../../../../a/config';

/** 
 * @Description:
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-07 16:02:10
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/luckyTwist/LuckyTwistEggSelectItemCtrl")
export default class LuckyTwistEggSelectItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    selectNode: cc.Node = null

    cfg: icmsg.GoodsInfo;

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    onDisable() {
        this.node.targetOff(this);
        gdk.Timer.clearAll(this);
        this.cfg = null;
    }

    //触摸开始 
    touchStart() {
        gdk.Timer.once(800, this, this.showTip);

    }
    //触摸结束
    touchEnd() {
        gdk.Timer.clearAll(this);
    }

    showTip() {
        if (!this.cfg) return;
        if (!cc.isValid(this.node)) return;
        let itemInfo: BagItem = {
            series: 0,
            itemId: this.cfg.typeId,
            itemNum: this.cfg.num,
            type: BagUtils.getItemTypeById(this.cfg.typeId),
            extInfo: null,
        }
        GlobalUtil.openItemTips(itemInfo);
    }

    updateView() {
        this.cfg = this.data;
        this.slotItem.isEffect = false;
        this.slotItem.updateItemInfo(this.cfg.typeId, this.cfg.num);
    }

    _itemSelect() {
        this.selectNode.active = this.ifSelect;
    }
}
