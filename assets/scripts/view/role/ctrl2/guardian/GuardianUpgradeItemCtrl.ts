import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianUtils from './GuardianUtils';
import HeroUtils from '../../../../common/utils/HeroUtils';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { GuardianItemInfo } from './GuardianListCtrl';
/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:12:03
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianUpgradeItemCtrl")
export default class GuardianUpgradeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Node)
    heroNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Node)
    redPoint: cc.Node = null

    _itemInfo: GuardianItemInfo

    updateView() {
        this._itemInfo = this.data
        let extInfo = this._itemInfo.bagItem.extInfo as icmsg.Guardian
        this.lvLab.string = '.' + extInfo.level
        this.slotItem.updateItemInfo(this._itemInfo.bagItem.itemId)
        this.slotItem.updateStar(extInfo.star)

        this.selectNode.active = this._itemInfo.selected

        this.heroNode.active = false
        this.redPoint.active = false
        let heroInfo = GuardianUtils.getGuardianHeroInfo(this._itemInfo.bagItem.series)
        if (heroInfo && heroInfo.heroId > 0) {
            this.heroNode.active = true;
            GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), HeroUtils.getHeroHeadIcon(heroInfo.typeId, heroInfo.star));

            this.redPoint.active = RedPointUtils.is_hero_guardian_can_upgrade(heroInfo) || RedPointUtils.is_hero_guardian_can_starup(heroInfo)
        }
    }

}