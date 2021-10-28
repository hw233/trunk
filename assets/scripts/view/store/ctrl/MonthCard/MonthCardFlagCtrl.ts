const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/MonthCard/MonthCardFlagCtrl")
export default class MonthCardFlagCtrl extends cc.Component {

    @property(cc.Node)
    flag1: cc.Node = null;

    @property(cc.Node)
    flag2: cc.Node = null;

    @property(cc.Node)
    flag3: cc.Node = null;

    onEnable() {

    }

    updateState(flag) {
        this.node.active = false
        // if (flag == 0) {
        //     this.node.active = false
        //     return
        // }
        // this.node.active = true
        // this.flag1.active = Boolean(1 & flag)
        // this.flag2.active = Boolean(2 & flag)
        // this.flag3.active = Boolean(4 & flag)
    }
}