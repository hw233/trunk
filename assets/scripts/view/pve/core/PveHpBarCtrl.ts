
/** 
 * Pve血条组件
 * @Author: sthoo.huang  
 * @Date: 2019-05-24 09:18:34 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-20 16:49:44
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/core/PveHpBarCtrl")
export default class PveHpBarCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property({ type: cc.Node, tooltip: "背景血条" })
    barBg: cc.Node = null;

    @property({ type: cc.Node, tooltip: "前景血条" })
    barVal: cc.Node = null;

    @property({ type: cc.Node, tooltip: "前景血条，不同颜色" })
    barVal2: cc.Node = null;

    @property({ type: cc.Node, tooltip: "护盾条" })
    shiedVal: cc.Node = null;

    @property(cc.Integer)
    totalLength: number = 100;

    tween: cc.Tween;
    timeScale: number;

    //shiedValue: number;

    onEnable() {
        if (this.bg) {
            this.bg.width = this.totalLength + 2;
            this.bg.x = -this.totalLength / 2 - 1;
        }
        this.barBg.x = -this.totalLength / 2;
        this.barBg.width = this.totalLength;
        this.barBg.scaleX = 1.0;
        this.barBg.active = false;

        this.barVal.x = -this.totalLength / 2;
        this.barVal.width = this.totalLength;
        this.barVal.scaleX = 1.0;
        this.barBg.active = true;

        if (this.barVal2) {
            this.barVal2.x = -this.totalLength / 2;
            this.barVal2.width = this.totalLength;
            this.barVal2.scaleX = 1.0;
            this.barVal2.active = false;
        }
        this.shiedVal.active = false;
        this.shiedVal.x = -this.totalLength / 2;
        this.shiedVal.width = this.totalLength;
        this.shiedVal.scaleX = 1.0;
    }

    onDisable() {
        this.barVal.scaleX = 1.0;
        if (this.barVal2) {
            this.barVal2.scaleX = 1.0;
        }
        this.barBg.active = false;
        this.barBg.opacity = 0;
        this.barBg.scaleX = 1.0;
        this.tween && this.tween.stop();
        this.tween = null;
    }

    set progress(v: number) {
        v = parseFloat(v.toFixed(2));
        if (v == this.progress) {
            // 不需要任何变化
            return;
        }
        let ow = this.barVal.width;
        let nw = this.totalLength * v;
        if (ow > nw) {
            if (!this.barBg.active) {
                this.barBg.active = true;
                this.barBg.width = ow;
            }
            this.barBg.opacity = 255;
        } else if (this.barBg.active) {
            this.barBg.active = false;
            this.barBg.opacity = 255;
        }
        this.barVal.width = nw;
        if (this.barVal2) {
            this.barVal2.width = nw;
        }
        this.tween && this.tween.stop();
        this.tween = null;
        if (this.node.opacity == 0) {
            // 首次显示，不显示动画
            this.barBg.width = nw;
            this.barBg.active = false;
            this.barBg.opacity = 255;
        } else if (ow > nw) {
            // 添加渐变动化
            this.tween = cc.tween(this.barBg)
                .delay(0.05)
                .to(0.25, { width: nw, opacity: 0 })
                .call(() => {
                    this.barBg.active = false;
                    this.barBg.opacity = 255;
                    this.tween = null;
                })
                .start();
        }
    }

    get progress(): number {
        let v = this.barVal.width / this.totalLength;
        return parseFloat(v.toFixed(2));
    }

    set shiedValue(v: number) {
        v = parseFloat(v.toFixed(2));
        this.shiedVal.active = v > 0;
        if (v == this.shiedValue) {
            // 不需要任何变化
            return;
        }
        let width = this.totalLength * v
        this.shiedVal.width = width;

    }

    get shiedValue(): number {
        let v = this.shiedVal.width / this.totalLength;
        return parseFloat(v.toFixed(2));
    }

}