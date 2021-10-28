import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipUtils from '../../../../../common/utils/EquipUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { UniqueCfg } from '../../../../../a/config';
import { UniqueEquipInfo } from './UniqueEquipListCtrl';

/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-07 18:14:51
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/uniqueEquip/UniqueEquipListItemCtrl")
export default class UniqueEquipListItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Node)
    heroNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Node)
    recommendIcon: cc.Node = null

    _itemInfo: UniqueEquipInfo

    updateView() {
        this._itemInfo = this.data
        let extInfo = this._itemInfo.bagItem.extInfo as icmsg.UniqueEquip
        //this.lvLab.string = '.' + extInfo.level
        this.slotItem.updateItemInfo(this._itemInfo.bagItem.itemId)
        this.slotItem.updateStar(extInfo.star)

        this.selectNode.active = this._itemInfo.selected

        this.heroNode.active = false
        this.recommendIcon.active = false
        let heroInfo = EquipUtils.getUniqueEquipInHeroInfo(this._itemInfo.bagItem.series)
        if (heroInfo && heroInfo.heroId > 0) {
            this.heroNode.active = true;
            GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), GlobalUtil.getIconById(heroInfo.typeId));
        }

        if (!this.heroNode.active) {
            let heroModel = ModelManager.get(HeroModel)
            if (heroModel.curHeroInfo) {
                let cfg = ConfigManager.getItemById(UniqueCfg, this._itemInfo.bagItem.itemId)
                if (cfg && cfg.hero_id == heroModel.curHeroInfo.typeId) {
                    this.recommendIcon.active = true
                }
            }
        }
    }

}