import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StoreModel from '../../model/StoreModel';
import { VipCfg } from '../../../../a/config';

/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-11-26 16:00:35
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/VipEffectViewCtrl")
export default class VipEffectViewCtrl extends cc.Component {

    @property(cc.Label)
    curVipNum: cc.Label = null;

    @property(cc.Label)
    proBarLab: cc.Label = null;

    @property(cc.Node)
    proBarBg: cc.Node = null;

    @property(cc.Node)
    proBarMask: cc.Node = null;

    get roleModel() { return ModelManager.get(RoleModel); }
    get storeModel() { return ModelManager.get(StoreModel); }

    _curVipCfg: VipCfg
    _totalNum: number = 10

    onEnable() {
        this.curVipNum.string = `${this.storeModel.vipPreLv}`
        this._curVipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv)
        if (!this._curVipCfg.exp || this._curVipCfg.exp < 0) {
            this._curVipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv - 1)
        }
        this.proBarLab.string = `${this.storeModel.vipPreExp}/${this._curVipCfg.exp}`
        this.proBarMask.width = this.proBarBg.width * (this.storeModel.vipPreExp / this._curVipCfg.exp)
    }


    playEffect(callFunc?: Function) {
        let count = 0
        this.schedule(() => {
            if (count > this._totalNum) {
                this.curVipNum.string = `${this.roleModel.vipLv}`
                this.proBarLab.string = `${this.roleModel.vipExp}/${this._curVipCfg.exp}`
                this.unscheduleAllCallbacks()
                gdk.Timer.once(1500, this, () => {
                    if (callFunc) {
                        callFunc.call(this)
                    }
                    if (this.roleModel.vipLv > this.storeModel.vipPreLv) {
                        gdk.panel.open(PanelId.VipUpTipPanel)
                    }
                })
                return
            }
            count++
            this.proBarMask.width = this.proBarBg.width * (this.storeModel.vipPreExp / this._curVipCfg.exp) + this.proBarBg.width * (((this.roleModel.vipExp - this.storeModel.vipPreExp) / this._totalNum * count) / this._curVipCfg.exp)
        }, 0.1)
    }
}