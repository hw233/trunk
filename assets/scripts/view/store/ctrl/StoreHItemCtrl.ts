import StoreNItemCtrl from './StoreNItemCtrl';
import UiListItem from '../../../common/widgets/UiListItem';
/** 
  * @Description: 商店普通物品子项
  * @Author: weiliang.huang  
  * @Date: 2019-05-22 15:39:36 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 12:47:55
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/StoreHItemCtrl")
export default class StoreHItemCtrl extends UiListItem {

    @property(StoreNItemCtrl)
    items: Array<StoreNItemCtrl> = []



    onLoad() {

    }

    updateView() {
        let list = this.data
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].node.active = false
            if (list[i]) {
                this.items[i].node.active = true
                this.items[i].updateView(list[i])
            }
        }
    }
}
