import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianUtils from './GuardianUtils';
import HeroUtils from '../../../../common/utils/HeroUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { GuardianItemInfo } from './GuardianListCtrl';

/**
 * @Description: 神装
 * @Author: luoyong
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:10:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianDecomposeItemCtrl")
export default class GuardianDecomposeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    mask: cc.Node = null

    @property(cc.Node)
    heroNode: cc.Node = null

    info: GuardianItemInfo
    /* 更新格子数据*/
    updateView() {
        this.info = this.data
        this.slot.updateItemInfo(this.info.bagItem.itemId)
        let extInfo = this.info.bagItem.extInfo as icmsg.Guardian
        this.slot.updateStar(extInfo.star)
        this.node.getChildByName('lvLab').getComponent(cc.Label).string = '.' + extInfo.level
        this.mask.active = this.info.selected

        GlobalUtil.setAllNodeGray(this.node, 0)
        this.heroNode.active = false
        let heroInfo = GuardianUtils.getGuardianHeroInfo(this.info.bagItem.series)
        if (heroInfo && heroInfo.heroId > 0) {
            this.heroNode.active = true;
            GlobalUtil.setAllNodeGray(this.node, 1)
            GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), HeroUtils.getHeroHeadIcon(heroInfo.typeId, heroInfo.star));
        }
    }
}