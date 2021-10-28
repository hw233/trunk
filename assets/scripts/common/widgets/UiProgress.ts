/** 
  * @Description: 进度条,该进度条用mark截取,用于边界不规则的进度条
  * @Author: weiliang.huang  
  * @Date: 2019-04-30 10:02:25 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-11-07 09:40:19
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/UiProgress")
export default class UiProgress extends cc.Component {

    @property(cc.Node)
    img1: cc.Node = null

    @property(cc.Node)
    img2: cc.Node = null

    @property(cc.Node)
    img3: cc.Node = null

    @property(cc.Node)
    mask: cc.Node = null

    @property(cc.Node)
    bar: cc.Node = null

    @property(cc.Integer)
    maxLength: number = 0

    _progress: number = 0

    onLoad() {
        if (this.maxLength == 0) {
            this.maxLength = this.node.width - 8
        }
        this.mask.x = -this.maxLength / 2
        this.bar.width = this.maxLength
        this.progress = 0

        // this.img1.x = -this.maxLength / 4
        // this.img2.x = 0
    }

    /**
     * 设置主进度
     */
    set progress(v: number) {
        this._progress = v
        this._updateProgress()
    }

    /**
     * 获得主度条
     */
    get progress(): number {
        return this._progress
    }

    _updateProgress() {
        this.mask.width = this.maxLength * this._progress
    }
}
