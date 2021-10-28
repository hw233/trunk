import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';




/**
 * @Description: 个人名片-守护者子项
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-10 15:31:48
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainSetGuardianItemCtrl")
export default class MainSetGuardianItemCtrl extends cc.Component {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    _index: number = 0
    _guardianInfo: icmsg.Guardian
    _type: number = 0; // 0-查询当前信息，1-查询锦标赛信息
    _playerId: number = 0

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._clickGuardian, this)
    }

    onDestroy() {
        gdk.e.targetOff(this)
    }
    updateView(guardian: icmsg.Guardian, index: number, playerId: number, type: number) {
        this._type = type;
        this._guardianInfo = guardian
        this._playerId = playerId
        let sCtrl = this.slot.getComponent(UiSlotItem)
        sCtrl.updateItemInfo(guardian.type)
        sCtrl.updateStar(guardian.star)
        this.lvLabel.node.active = true
        this.lvLabel.string = `${guardian.level}`

    }

    updateNullHero() {
        let sCtrl = this.slot.getComponent(UiSlotItem)
        sCtrl.updateItemInfo(0)
        this.lvLabel.node.active = false
    }

    _clickGuardian() {
        if (!this._guardianInfo) return;

        gdk.panel.setArgs(PanelId.MainSetGuardianInfoTip, this._guardianInfo)
        gdk.panel.open(PanelId.MainSetGuardianInfoTip);
    }
}
