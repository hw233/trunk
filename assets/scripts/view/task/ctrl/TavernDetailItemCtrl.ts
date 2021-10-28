import GlobalUtil from '../../../common/utils/GlobalUtil';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TavernDetailItemCtrl")
export default class TavernDetailItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    numLab: cc.Label = null;


    onEnable() {

    }

    updateItemInfo(good: icmsg.GoodsInfo) {
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getIconById(good.typeId))
        this.numLab.string = `${good.num}`
    }

}
