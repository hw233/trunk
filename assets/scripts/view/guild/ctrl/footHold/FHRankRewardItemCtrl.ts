import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel, { FhRankItemInfo } from './FootHoldModel';
import ModelManager from '../../../../common/managers/ModelManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Foothold_rankingCfg, TipsCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHRankRewardItemCtrl")
export default class FHRankRewardItemCtrl extends UiListItem {

    @property(UiSlotItem)
    uiSlot: UiSlotItem = null;

    @property(cc.Node)
    flag: cc.Node = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    _info: FhRankItemInfo

    updateView() {
        this._info = this.data
        this.flag.active = this._info.isLimit

        this.uiSlot.updateItemInfo(this.data.id, this.data.num)

        this.uiSlot.itemInfo = {
            series: this.data.id,
            itemId: this.data.id,
            itemNum: 1,
            type: BagUtils.getItemTypeById(this.data.id,),
            extInfo: null,
        }

    }

}