/** 
 * @Description: 星星
 * @Author: weiliang.huang  
 * @Date: 2019-03-28 17:26:34 
 * @Last Modified by: chengyou.lin
 * @Last Modified time: 2019-12-04 16:19:07
 */

const starColor = [
    "#FFFFFF",
    "#D6FF29",
    "#54FF00",
    "#FF6390",
    "#FF8529",
]
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role/StarItemCtrl")
export default class StarItemCtrl extends cc.Component {

    @property(cc.Node)
    starBg: cc.Node = null

    @property(cc.Node)
    star: cc.Node = null
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    updateSize(w, h) {
        let size = cc.size(w, h)
        this.node.setContentSize(size)
        this.starBg.setContentSize(size)
        this.star.setContentSize(size)
    }

    /**更新星星状态
     * @param state 0:显示背景 大于0:显示不同阶段的星星
     */
    updateState(state) {
        this.starBg.active = state == 0
        this.star.active = state > 0
        // if (state > 0) {
        //     let color = starColor[state] || starColor[4]
        //     this.star.color = cc.color(color)
        // }
    }
}
