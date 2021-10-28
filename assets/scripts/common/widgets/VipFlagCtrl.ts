const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/VipFlagCtrl")
export default class VipFlagCtrl extends cc.Component {

    @property(cc.Label)
    vipLv: cc.Label = null;

    onEnable() {

    }

    /**用作vip等级显示 */
    updateVipLv(lv) {
        if (lv == 0) {
            this.node.active = false
        } else {
            this.node.active = true
            this.vipLv.string = `${lv}`
        }
    }
}