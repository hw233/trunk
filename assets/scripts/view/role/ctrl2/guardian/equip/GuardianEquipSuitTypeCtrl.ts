import ConfigManager from '../../../../../common/managers/ConfigManager';

/** 
 * @Description:
 * @Author: luoyong
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-17 21:25:25
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipSuitTypeCtrl")
export default class GuardianEquipSuitTypeCtrl extends cc.Component {

    @property(cc.Label)
    nameLab: cc.Label = null

    _suitNames = ["", "焰红", "岚黄", "湛蓝", "苍绿", "恶魔"]

    onEnable() {

    }

    updateViewInfo(suitType) {
        if (this.nameLab) {
            this.nameLab.string = `${this._suitNames[suitType]}`
        }
    }
}