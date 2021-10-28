/** 
  * @Description: 进度条控件拓展,支持额外进度显示
  * @Author: weiliang.huang  
  * @Date: 2019-04-20 13:31:41 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-11-07 10:22:56
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/UiBarCtrl")
export default class UiBarCtrl extends cc.Component {

    @property(cc.Node)
    img1: cc.Node = null

    @property(cc.Node)
    img2: cc.Node = null

    @property(cc.Node)
    img3: cc.Node = null

    @property(cc.Node)
    mainImg: cc.Node = null

    @property(cc.Node)
    extImg: cc.Node = null

    @property(cc.Integer)
    maxLength: number = 0

    _mainPro: number = 0   // 主进度
    _extPro: number = 0  // 额外进度

    onLoad() {
        if (this.maxLength == 0) {
            this.maxLength = this.node.width - 8
        }
        this.extImg.x = -this.maxLength / 2
        this.mainImg.x = -this.maxLength / 2
        this.extImg.width = this.maxLength
        this.extImg.active = false
        this.progress = 0

        this.img1.x = -this.maxLength / 4
        this.img2.x = 0
    }

    /**
     * 设置主进度
     */
    set progress(v: number) {
        this._mainPro = v
        this._updateProgress()
    }

    /**
     * 获得主度条
     */
    get progress(): number {
        return this._mainPro
    }

    /**
     * 设置额外进度,大于1时,会隐藏主进度条,取小数显示
     */
    set extProgress(v: number) {
        this._extPro = v
        this._updateExtPro()
    }

    /**
     * 获得额外度条
     */
    get extProgress(): number {
        return this._extPro
    }

    _updateProgress() {
        this.mainImg.width = this.maxLength * this._mainPro
    }

    _updateExtPro() {
        if (this._extPro > 0) {
            this.showExtPro(true)
            let pro = this._extPro
            if (pro > 1) {
                pro = pro % 1
                this.mainImg.active = false
            } else {
                this.mainImg.active = true
            }
            this.extImg.width = this.maxLength * pro
        } else {
            this.mainImg.active = true
            this.showExtPro(false)
        }
    }

    showExtPro(flag) {
        if (flag && this.extImg.active != flag) {
            let act = cc.sequence(
                cc.fadeTo(1, 5),
                cc.fadeTo(1, 255)
            )
            this.extImg.runAction(cc.repeatForever(act))
        } else {
            this.extImg.stopAllActions()
        }
        this.extImg.active = flag
    }
}
