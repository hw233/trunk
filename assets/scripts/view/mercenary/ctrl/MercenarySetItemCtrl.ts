import CareerIconItemCtrl from '../../role/ctrl2/main/career/CareerIconItemCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { MercenarySetItemInfo } from './MercenarySetViewCtrl';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2020-07-10 11:42:28
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 11:42:29
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/mercenary/MercenarySetItemCtrl")
export default class MercenarySetItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    careerIconItem: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null;

    info: MercenarySetItemInfo

    /* 更新格子数据*/
    updateView() {
        this.info = this.data
        let ctrl = this.slot.getComponent(UiSlotItem)
        ctrl.updateItemInfo(this.info.cfg.id)
        ctrl.updateStar(this.info.extInfo.star)
        this._updateCareerInfo()
        this.lvLab.string = `.${this.info.extInfo.level}`
    }

    _updateCareerInfo() {
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(this.info.extInfo.careerId, GlobalUtil.getHeroCareerLv(this.info.extInfo), this.info.extInfo.soldierId)
    }

}