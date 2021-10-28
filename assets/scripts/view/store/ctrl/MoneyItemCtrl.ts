import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel, { AttTypeName } from '../../../common/models/RoleModel';
import { RoleEventId } from '../../role/enum/RoleEventId';

const { ccclass, property, menu } = cc._decorator;

// export enum MoneyType {
//     Dimond = 2,
//     Gold = 3,
// }

@ccclass
@menu("qszc/view/store/MoneyItemCtrl")
export default class MoneyItemCtrl extends gdk.ItemRenderer {

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Label)
    numLab: cc.Label = null

    moneyType: number = 0

    onEnable() {
        gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateMoneyNum, this)
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    updateView() {
        if (this.data <= 0) {
            return
        }
        this.moneyType = this.data
        this._updateMoneyNum()

        let icon = GlobalUtil.getIconById(this.moneyType)
        if (icon) {
            GlobalUtil.setSpriteIcon(this.node, this.icon, icon)
        }
    }

    /**更新数量 */
    _updateMoneyNum(e: gdk.Event = null) {
        if (this.data <= 0) {
            return
        }
        if (e) {
            if (e.data.index != this.moneyType) {
                return
            }
        }
        let model = ModelManager.get(RoleModel)
        let moneyType = this.data
        let AttName = AttTypeName[moneyType]
        if (AttName) {
            this.numLab.string = `${model[AttName]}`
        }
    }

    btnFunc() {
        // if (this.moneyType == MoneyType.Dimond) {
        //     JumpUtils.openStore([3])
        // } else if (this.moneyType == MoneyType.Gold) {
        //     JumpUtils.openStore([1])
        // }
    }
}
