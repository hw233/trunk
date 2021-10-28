import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { MainHangPreRewardInfo } from './MainHangPreRewardCtrl';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/MainHangPreRewardItemCtrl")
export default class MainHangPreRewardItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    up: cc.Node = null

    _info: MainHangPreRewardInfo

    updateView() {
        this._info = this.data
        this.slot.starNum = 0
        this.slot.updateItemInfo(this._info.goodInfo.typeId, this._info.goodInfo.num)
        this.slot.itemInfo = {
            series: this._info.goodInfo.typeId,
            itemId: this._info.goodInfo.typeId,
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._info.goodInfo.typeId),
            extInfo: null
        }

        this.up.active = this._info.up
        if (this._info.state) {
            GlobalUtil.setGrayState(this.slot.UiQualityIcon, 0)
            GlobalUtil.setGrayState(this.slot.UiItemIcon, 0)
        } else {
            GlobalUtil.setGrayState(this.slot.UiQualityIcon, 1)
            GlobalUtil.setGrayState(this.slot.UiItemIcon, 1)
        }
    }
}

