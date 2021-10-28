import ConfigManager from '../../../../common/managers/ConfigManager';
import GuardianUtils from './GuardianUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Guardian_starCfg, GuardianCfg } from '../../../../a/config';

/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-01 18:37:51
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianBookItemCtrl")
export default class GuardianBookItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Node)
    mask: cc.Node = null

    _cfg: GuardianCfg

    updateView() {
        this._cfg = this.data
        let maxStar = this._cfg.star_max
        let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", this._cfg.id, { star: maxStar })

        this.nameLab.string = `${this._cfg.name}`
        this.slotItem.updateItemInfo(this._cfg.id)
        this.slotItem.updateStar(maxStar)
        this.lvLab.string = `${starCfg.guardian_lv}`

        this.mask.active = !GuardianUtils.getOwnGuardianByTypeId(this._cfg.id)
    }
}