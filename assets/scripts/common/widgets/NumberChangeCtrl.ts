import GlobalUtil from '../utils/GlobalUtil';
import MathUtil from '../utils/MathUtil';

/** 
 * 数字变化组件 从左至右 渐现
 * @Author: sthoo.huang  
 * @Date: 2019-06-26 14:41:49 
 * @Last Modified by: luoyong
 * @Last Modified time: 2019-12-03 10:41:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/NumberChangeCtrl")
export default class NumberChangeCtrl extends cc.Component {

    @property(cc.LabelAtlas)
    font: cc.LabelAtlas = null;

    @property()
    itemWidth: number = 32;

    @property()
    fontSize: number = 28;

    @property()
    speed: number = 500;

    labels: cc.Label[] = [];
    _value: number = 0; // 当前值

    onDisable() {
        this.clear();
    }

    createOne() {
        let node: cc.Node = new cc.Node();
        let label: cc.Label = node.addComponent(cc.Label);
        if (this.font) {
            label.font = this.font;
        }
        node.name = this.labels.length.toString();
        node.anchorX = 0;
        node.anchorY = 1;
        label.fontSize = this.fontSize;
        label.string = '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n0\n1\n2\n3\n4\n5\n6\n7\n8\n9';
        return label;
    }

    scrollOneTo(label: cc.Label, value: number, index: number, len: number) {
        if (value < 0 || value > 9) {
            return;
        }
        label.node.opacity = 0
        let action = cc.sequence(
            cc.delayTime(0.1 * (index + 2)),
            cc.spawn(cc.fadeIn(0.1 * (index + 1)), cc.callFunc(() => {
                for (let i = 0; i <= 9; i++) {
                    let action2 = cc.sequence(cc.delayTime(0.015 * i), cc.callFunc(() => {
                        label.string = `${9 - MathUtil.rnd(0, 9)}`
                    }, this))
                    label.node.runAction(action2)
                }
            }, this)),
            cc.callFunc(this._changeEnd, this, [label, value]),
        );
        label.node.runAction(action);
    }

    _changeEnd(node: cc.Node, args: any[]) {
        let label: cc.Label = args[0];
        let value: number = args[1];
        label.string = `${value}`
        label.node.stopAllActions();
    }

    clear() {
        this.labels.forEach(l => {
            l.node.active = false;
            l.node.stopAllActions();
        });
    }

    set value(v: number) {
        let a: string = v.toString();
        let l: number = a.length;
        // if (l == 0) {
        //     a = '0';
        // }
        this._value = v;
        // // 左边补0
        // let len = this.len;
        // for (let i = l; i < len; i++) {
        //     a = '0' + a;
        // }
        // 当前值
        for (let i = 0, n = a.length; i < n; i++) {
            let label: cc.Label = this.labels[i];
            if (!label) {
                label = this.labels[i] = this.createOne();
                this.node.addChild(label.node);
            }
            label.node.active = true;
            label.node.stopAllActions();
        }
    }

    get value() {
        return this._value;
    }

    get len() {
        let c = 0;
        for (let i = 0, n = this.labels.length; i < n; i++) {
            if (!this.labels[i].node.active) break;
            c++;
        }
        return c;
    }

    get width() {
        return this.len * this.itemWidth;
    }

    scrollTo(v: number) {
        let a: string = v.toString();
        let l: number = a.length;
        if (l == 0) {
            a = '0';
        }
        // 更新数字为set value设置的值
        let ov = this._value;
        if (v - ov > 9) {
            this.value = v;
        }
        this.value = ov;
        // 左边补0
        let len = this.len;
        // 滚动每一个数字
        for (let i = 0; i < len; i++) {
            this.scrollOneTo(this.labels[i], parseInt(a.charAt(i)), i, len);
        }
    }
}