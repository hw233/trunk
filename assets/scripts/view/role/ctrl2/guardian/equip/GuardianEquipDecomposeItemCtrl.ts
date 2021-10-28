import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { ResetGuardianEqInfo } from './GuardianEquipDecomposePanelCtrl';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-15 15:49:58
 */

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipDecomposeItemCtrl")
export default class GuardianEquipDecomposeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    mask: cc.Node = null

    @property(cc.Node)
    heroNode: cc.Node = null

    info: ResetGuardianEqInfo
    // info: GuardianItemInfo
    /* 更新格子数据*/
    updateView() {
        this.info = this.data
        let ctrl = this.slot.getComponent(UiSlotItem)
        ctrl.updateItemInfo(this.info.guardianEqInfo.type)
        //let cfg = ConfigManager.getItemById(CostumeCfg, this.info.costumeInfo.typeId)
        ctrl.updateStar(this.info.guardianEqInfo.star)
        ctrl.starNum = this.info.guardianEqInfo.star
        this.node.getChildByName('lvLab').getComponent(cc.Label).string = '.' + this.info.guardianEqInfo.level
        this.mask.active = this.info.selected

        // GlobalUtil.setAllNodeGray(this.node, 0)
        // this.heroNode.active = false
        // let heroInfo = GuardianUtils.getGuardianHeroInfo(this.info.bagItem.series)
        // if (heroInfo && heroInfo.heroId > 0) {
        //     this.heroNode.active = true;
        //     GlobalUtil.setAllNodeGray(this.node, 1)
        //     GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), GlobalUtil.getIconById(heroInfo.typeId));
        // }
    }

}