import GlobalUtil from '../../../../common/utils/GlobalUtil';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:19:27
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/expedition/ExpeditionRewardItemCtrl")
export default class ExpeditionRewardItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Label)
    getLab: cc.Label = null

    @property(cc.Label)
    addLab: cc.Label = null

    updateViewInfo(id, getNum, addNum) {
        let path = GlobalUtil.getIconById(id)
        GlobalUtil.setSpriteIcon(this.node, this.icon, path)
        this.getLab.string = `${GlobalUtil.numberToStr2(getNum)}`
        this.addLab.string = `(+${addNum}${gdk.i18n.t("i18n:EXPEDITION_TIP13")})`
    }
}