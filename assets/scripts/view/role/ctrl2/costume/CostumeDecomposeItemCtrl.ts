import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagType } from '../../../../common/models/BagModel';
import { CostumeCfg } from '../../../../a/config';
import { ResetCostumeInfo } from './CostumeDecomposePanelCtrl';

/**
 * @Description: 神装
 * @Author: luoyong
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-08 18:14:46
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeDecomposeItemCtrl")
export default class CostumeDecomposeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    mask: cc.Node = null

    info: ResetCostumeInfo
    /* 更新格子数据*/
    updateView() {
        this.info = this.data
        let ctrl = this.slot.getComponent(UiSlotItem)
        ctrl.updateItemInfo(this.info.costumeInfo.typeId)
        let cfg = ConfigManager.getItemById(CostumeCfg, this.info.costumeInfo.typeId)
        ctrl.updateStar(cfg.star)
        ctrl.starNum = cfg.star
        this.node.getChildByName('lvLab').getComponent(cc.Label).string = '.' + this.info.costumeInfo.level
        this.mask.active = this.info.selected
    }

    _itemLongPress() {
        GlobalUtil.openItemTips({
            series: null,
            itemId: this.info.costumeInfo.typeId,
            itemNum: 1,
            type: BagType.COSTUME,
            extInfo: this.info.costumeInfo
        })
    }
}