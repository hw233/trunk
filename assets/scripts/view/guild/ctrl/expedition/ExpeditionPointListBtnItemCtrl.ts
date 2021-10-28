import UiListItem from '../../../../common/widgets/UiListItem';
import { Expedition_mapCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-21 14:11:32
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/expedition/ExpeditionPointListBtnItemCtrl")
export default class ExpeditionPointListBtnItemCtrl extends UiListItem {

    @property(cc.Node)
    normal: cc.Node = null

    @property(cc.Node)
    select: cc.Node = null


    _info: Expedition_mapCfg

    updateView() {
        this._info = this.data
        let n_lab = this.normal.getChildByName("label").getComponent(cc.Label)
        let s_lab = this.select.getChildByName("label").getComponent(cc.Label)

        n_lab.string = `${this._info.name}`
        s_lab.string = `${this._info.name}`
    }

    _itemSelect() {
        this.select.active = this.ifSelect
        this.normal.active = !this.ifSelect
    }
}