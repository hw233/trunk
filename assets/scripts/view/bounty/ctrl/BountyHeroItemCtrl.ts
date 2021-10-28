import CareerIconItemCtrl from '../../role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Hero_starCfg } from '../../../a/config';
/** 
 * @Description: 赏金求助
 * @Author: weiliang.huang  
 * @Date: 2019-05-07 09:34:24 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:55:17
*/


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bounty/BountyHeroItemCtrl")
export default class BountyHeroItemCtrl extends UiListItem {

    @property(UiSlotItem)
    uiSlot: UiSlotItem = null;

    @property(cc.Node)
    careerIconItem: cc.Node = null

    _info: icmsg.HeroBrief

    updateView() {
        this._info = this.data
        this.uiSlot.updateItemInfo(this._info.typeId)
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, "star", this._info.star)
        if (starCfg) {
            this.uiSlot.updateQuality(starCfg.color);
        }
        this.uiSlot.updateStar(this._info.star)

        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(this._info.careerId, this._info.careerLv, this._info.soldierId)
    }
}