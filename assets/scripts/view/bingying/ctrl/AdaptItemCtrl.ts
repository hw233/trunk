import HeroUtils from '../../../common/utils/HeroUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
/** 
  * @Description: 
  * @Author: weiliang.huang  
  * @Date: 2019-05-08 14:31:02 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2019-12-23 21:00:14
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/AdaptItemCtrl")
export default class AdaptItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    heroId: number = null
    start() {

    }

    updateView() {
        this.heroId = this.data
        this.slot.itemId = null;
        this.slot.updateItemInfo(this.heroId)
        //判断是否拥有该英雄，未拥有时置灰
        let heroInfo = HeroUtils.getHeroInfoById(this.heroId)
        if (heroInfo) {
            this.slot.setGray(0)
        } else {
            this.slot.setGray(1)
        }
    }
}
