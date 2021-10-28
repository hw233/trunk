import GlobalUtil from '../../../../common/utils/GlobalUtil';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-08-20 20:55:34
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FHProduceItem2Ctrl")
export default class FHProduceItem2Ctrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Label)
    numLab: cc.Label = null

    updateViewInfo(id, num, isAdd: boolean = true) {
        let path = GlobalUtil.getSmallMoneyIcon(id)
        GlobalUtil.setSpriteIcon(this.node, this.icon, path)
        if (isAdd) {
            this.numLab.string = `+${num}`
        } else {
            this.numLab.string = `${num}`
        }
    }
}