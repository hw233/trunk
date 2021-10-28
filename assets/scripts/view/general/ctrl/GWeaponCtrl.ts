/** 
 * @Description: 总览-神器界面
 * @Author: weiliang.huang  
 * @Date: 2019-05-14 11:29:43 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-07-02 19:43:48
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/general/GWeaponCtrl")
export default class GWeaponCtrl extends cc.Component {

    @property(cc.Button)
    selectBtns: Array<cc.Button> = [];

    @property(cc.Node)
    downPanels: Array<cc.Node> = [];

    panelIndex: number = 0;

    // onLoad () {}

    onEnable() {
        this.selectFunc(null, 0)
    }

    // update (dt) {}

    /**面板选择显示 */
    selectFunc(e, utype) {
        utype = parseInt(utype)
        // if (this.downPanels[this.panelIndex]) {
        //     this.downPanels[this.panelIndex].active = false
        // }
        this.panelIndex = utype
        // this.downPanels[utype].active = true

        for (let idx = 0; idx < this.selectBtns.length; idx++) {
            const element = this.selectBtns[idx];
            element.interactable = idx != this.panelIndex
            this.downPanels[idx].active = idx == utype
            let select = element.node.getChildByName("select")
            select.active = idx == utype
            let lab = element.node.getChildByName("Label")
            let color = "#aca294"
            if (idx == utype) {
                color = "#ffeb91"
            }
            lab.color = cc.color(color)
        }
    }
}
