
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/CareerTipCtrl")
export default class CareerTipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.RichText)
    tips: cc.RichText = null

    target: cc.Node = null

    _desArr = []

    showTip(target: cc.Node = null, type) {
        this.target = target
        switch (type) {
            case 1:
                this.tips.string = "机枪职业擅长单体输出"
                break
            case 3:
                this.tips.string = "炮兵职业擅长群体输出"
                break
            case 4:
                this.tips.string = "守卫职业擅长拦截怪物"
                break
        }
        this._updatePos()
    }
    _updatePos() {
        if (!this.target) {
            this.bg.setPosition(cc.v2(0, 0))
            return
        }

        // 算出target在node节点下的坐标
        let wPos = this.target.parent.convertToWorldSpaceAR(this.target.position)
        let inPos = this.node.convertToNodeSpaceAR(wPos)

        let ry = this.bg.height / 2
        this.bg.setPosition(cc.v2(inPos.x, inPos.y + ry))

    }
}