import GlobalUtil from '../../../../common/utils/GlobalUtil';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-10 15:55:27
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/expedition/ExpeditionProduceItemCtrl")
export default class ExpeditionProduceItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Label)
    numLab: cc.Label = null

    updateViewInfo(id, numStr) {
        let path = GlobalUtil.getIconById(id)
        GlobalUtil.setSpriteIcon(this.node, this.icon, path)
        this.numLab.string = `${numStr}`
    }
}