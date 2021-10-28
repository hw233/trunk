import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianUtils from './GuardianUtils';
import HeroUtils from '../../../../common/utils/HeroUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { GuardianItemInfo } from './GuardianListCtrl';

/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:11:26
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianFightSetItemCtrl")
export default class GuardianFightSetItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Node)
    heroNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    _itemInfo: GuardianItemInfo

    updateView() {
        this._itemInfo = this.data
        let extInfo = this._itemInfo.bagItem.extInfo as icmsg.Guardian
        this.lvLab.string = '.' + extInfo.level
        this.slotItem.updateItemInfo(this._itemInfo.bagItem.itemId)
        this.slotItem.updateStar(extInfo.star)

        GlobalUtil.setAllNodeGray(this.node, 0)
        this.heroNode.active = false
        this.selectNode.active = false
        let heroInfo = GuardianUtils.getGuardianHeroInfo(this._itemInfo.bagItem.series)
        if (heroInfo && heroInfo.heroId > 0) {
            GlobalUtil.setAllNodeGray(this.node, 1)
            this.heroNode.active = true;
            this.selectNode.active = true
            GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), HeroUtils.getHeroHeadIcon(heroInfo.typeId, heroInfo.star));
        }
    }

}