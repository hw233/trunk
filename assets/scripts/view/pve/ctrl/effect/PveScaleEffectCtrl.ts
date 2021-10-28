/** 
 * 缩放效果组件
 * @Author: sthoo.huang  
 * @Date: 2019-05-13 14:32:50 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-07-22 20:16:25
 */

function getSymbol(n: number): 1 | -1 {
    return n > 0 ? 1 : -1;
}

export default class PveScaleEffectCtrl extends cc.Component {

    private scaleX: number;
    private scaleY: number;
    private duration: number;
    private currValue: number;

    private _value: number = 0;
    set value(v: number) {
        if (this._value == v) return;
        this._value = v;
        this.duration = v - this.currValue;
    }

    private _timeScale: number = 1.0;
    set timeScale(v: number) {
        this._timeScale = v;
    }

    onEnable() {
        this.scaleX = Math.abs(this.node.scaleX);
        this.scaleY = Math.abs(this.node.scaleY);
        this.currValue = 0;
    }

    onDisable() {
        this.currValue = 0;
        this._value = 0;
        this.updateScale();
    }

    update(dt: number) {
        let v = this.currValue;
        if (v != this._value) {
            v += this.duration * this._timeScale * dt;
            if (this.duration > 0) {
                // 变大
                if (v > this._value) {
                    v = this._value;
                }
            } else if (this.duration < 0) {
                // 变小
                if (v < this._value) {
                    v = this._value;
                }
            } else {
                // 不变
                v = this._value;
            }
            this.currValue = v;
        }
        this.updateScale(true);
    }

    updateScale(b?: boolean) {
        this.node.setScale(
            getSymbol(this.node.scaleX) * (this.scaleX * (1 + this.currValue)),
            getSymbol(this.node.scaleY) * (this.scaleY * (1 + this.currValue)),
        );
        if (b && this._value == 0 && this.currValue == 0) {
            this.destroy();
        }
    }

}