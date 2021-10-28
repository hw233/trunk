import ConfigManager from '../../../../common/managers/ConfigManager';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { VipCfg } from '../../../../a/config';

/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-11-25 15:01:43
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeTabItemCtrl")
export default class RechargeTabItemCtrl extends UiListItem {

    @property(cc.Label)
    vipLab0: cc.Label = null;

    @property(cc.Label)
    vipLab1: cc.Label = null;

    @property(cc.Label)
    des0: cc.Label = null;

    @property(cc.Label)
    des1: cc.Label = null;

    @property(cc.Node)
    normal: cc.Node = null;

    @property(cc.Node)
    select: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    _info: VipCfg
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    updateView() {
        this._info = this.data
        this.vipLab0.string = `${this._info.level}`
        this.vipLab1.string = `${this._info.level}`

        this.des0.string = `${this._info.theme}`
        this.des1.string = `${this._info.theme}`

        let state = !!(this.roleModel.vipGiftBoughtFlag & Math.pow(2, this._info.level))
        let preCfg = ConfigManager.getItemByField(VipCfg, "level", this._info.level - 1)
        let needExp = 0
        if (preCfg) {
            needExp = preCfg.exp
        }
        this.redPoint.active = !state && this.roleModel.vipExp >= needExp && JumpUtils.ifSysOpen(2851)
    }

    _itemSelect() {
        this.select.active = this.ifSelect
        this.normal.active = !this.ifSelect
    }
}