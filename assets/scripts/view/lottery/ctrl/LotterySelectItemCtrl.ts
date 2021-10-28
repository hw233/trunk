import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { LuckydrawCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/LotterySelectItemCtrl")
export default class LotterySelectItemCtrl extends UiListItem {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Node)
    select: cc.Node = null

    @property(cc.Label)
    time: cc.Label = null

    @property(cc.Node)
    redPoint: cc.Node = null

    cfg: LuckydrawCfg = null

    onEnable() {
        // this.onItemUpdate()
        // gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this.onItemUpdate, this)
        // gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this.onItemUpdate, this)
        // gdk.e.on(BagEvent.REMOVE_ITEM, this.onItemUpdate, this)
    }

    //物品更新
    onItemUpdate() {
        gdk.Timer.callLater(this, () => {
            if (this.cfg) {
                let num = BagUtils.getItemNumById(this.cfg.item_id)
                // this.redPoint.active = num >= this.cfg.item_num
            }
        })
    }

    updateView() {
        this.select.active = this.data.isSelect
        this.cfg = this.data.cfg
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/lottery/texture/common/zh_selectItem${this.cfg.order}`)
    }
}