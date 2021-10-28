import BagUtils from '../../../common/utils/BagUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';

/** 
  * @Description: 分解道具子项
  * @Author: luoyong  
  * @Date: 2019-09-03 11:59:46
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:02:51
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/decompose/DecomposeResultItem")
export default class DecomposeResultItem extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Label)
    totalNumLab: cc.Label = null

    @property(cc.Node)
    txtBg: cc.Node = null;

    info: icmsg.GoodsInfo = null

    start() {

    }

    updateView() {
        this.info = this.data
        if (this.info && this.info.typeId > 0) {
            this.slot.updateItemInfo(this.info.typeId, 0);
            this.slot.itemInfo = {
                itemId: this.info.typeId,
                series: 0,
                type: BagUtils.getItemTypeById(this.info.typeId),
                itemNum: 1,
                extInfo: null,
            }
            this.totalNumLab.node.active = true;
            this.txtBg.active = true;
            this.totalNumLab.string = this.info.num.toString();
            this.txtBg.width = this.totalNumLab.node.width + 10;
            this.totalNumLab.node.once(cc.Node.EventType.SIZE_CHANGED, () => {
                this.txtBg.width = this.totalNumLab.node.width + 10;
            });
        } else {
            this.slot.updateItemInfo(0)
            this.totalNumLab.node.active = false;
            this.txtBg.active = false;
        }
    }
}
