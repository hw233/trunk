const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroGetCommentItemCtrl")
export default class HeroGetCommentItemCtrl extends cc.Component {

    @property(cc.Label)
    lab: cc.Label = null

    onEnable() {

    }

    updateDes(str: string) {
        this.lab.string = str
        this.node.width = str.length * this.lab.fontSize + 20
    }

} 