import BagUtils from '../../../common/utils/BagUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../common/models/BagModel';
import { DecomposeEvent } from '../enum/DecomposeEvent';

/** 
  * @Description: 分解数量选择面板
  * @Author: luoyong  
  * @Date: 2019-09-02 11:17:05
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-04-28 11:04:21
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/decompose/DecomposeNumPanelCtrl")
export default class DecomposeNumPanelCtrl extends gdk.BasePanel {

    @property(cc.EditBox)
    inputBox: cc.EditBox = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    itemName: cc.Label = null;

    maxNum: number = 0
    minNum: number = 1

    itemData: BagItem = null

    cb: Function = null
    // onLoad () {}

    start() {

    }

    /**
     * 需要批量使用的道具
     * @param item 道具信息
     * @param cb 使用回调,该回调返回批量使用的数字
     * @param maxNum 最大数量限制
     */
    updatePanelShow(item: BagItem, cb: Function = null, maxNum: number = 0, decomposeNum: number) {
        this.itemData = item
        this.cb = cb
        let baseConfig = BagUtils.getConfigById(item.itemId)
        let maxLimit = item.itemNum

        if (!baseConfig) {
            return
        }
        this.maxNum = maxLimit
        if (maxNum > 0) {
            this.maxNum = Math.min(maxLimit, maxNum)
        }
        this.maxNum = Math.min(this.maxNum, 99999)

        this.slot.updateItemInfo(item.itemId, item.itemNum)
        this.itemName.string = baseConfig.name
        this.itemName.node.color = BagUtils.getColor(baseConfig.defaultColor - 1)
        this.inputBox.string = `${decomposeNum}`

    }

    /**输入框数字改变时,改变滑动条的位置 */
    textChanged() {
        let num = parseInt(this.inputBox.string)
        if (!this.inputBox.string) {
            num = 0
        }
        num = Math.floor(num)
        if (num <= 1) {
            this.inputBox.string = "1"
        } else if (num > this.maxNum) {
            num = this.maxNum
            this.inputBox.string = `${this.maxNum}`
        } else {
            this.inputBox.string = `${num}`
        }
    }

    /**确定按钮 */
    okFunc() {
        let num = parseInt(this.inputBox.string)
        gdk.e.emit(DecomposeEvent.UPDATE_DECOMPOSE_NUM, { id: this.itemData.itemId, num: parseInt(this.inputBox.string) })
        this.close()
    }

    maxFunc() {
        this.inputBox.string = `${this.maxNum}`
    }

    minFunc() {
        this.inputBox.string = `${this.minNum}`
    }

    reduceFunc() {
        let num = parseInt(this.inputBox.string)
        num = Math.max(num - 1, 1)
        this.inputBox.string = `${num}`
    }

    addFunc() {
        let num = parseInt(this.inputBox.string)
        num = Math.min(num + 1, this.maxNum)
        this.inputBox.string = `${num}`
    }
}
