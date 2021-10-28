import TavernDetailItemCtrl from './TavernDetailItemCtrl';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TavernDetailPanelCtrl")
export default class TavernDetailPanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    detailNode: cc.Node = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    detailItemPre: cc.Prefab = null;

    onEnable() {

    }

    updateViewInfo(posY, title, goods: icmsg.GoodsInfo[]) {
        this.detailNode.y = posY
        this.content.removeAllChildren()
        for (let i = 0; i < goods.length; i++) {
            let item = cc.instantiate(this.detailItemPre)
            let ctrl = item.getComponent(TavernDetailItemCtrl)
            ctrl.updateItemInfo(goods[i])
            this.content.addChild(item)
        }
        this.titleLab.string = `${title}`
        if (goods.length == 1) {
            this.bg.width = 180
            this.content.width = 120
        } else if (goods.length == 2) {
            this.bg.width = 300
            this.content.width = 240
        } else {
            this.bg.width = 420
            this.content.width = 360
        }
        this.content.height = 60 * Math.ceil(goods.length / 3)
    }

}