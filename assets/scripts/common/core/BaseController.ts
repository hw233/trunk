import NetManager from '../managers/NetManager';

/**
 * 控制类基类
 * 事件监听需在子类中实现：
 *      1.get gdkEvents(): any[]
 *      2.get netEvents(): any[]
 * 开始和结束需在子类中实现
 *      1.onStart()
 *      2.onEnd()
 * @Author: sthoo.huang
 * @Date: 2019-03-26 14:05:39
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-04-16 11:51:14
 */

const { ccclass, property, menu } = cc._decorator;

/**
 * 不能被继承的方法修饰器
 */
export function final(target: any, name: string): void {
    let clz: any = target.constructor;
    let proto: any = clz.prototype;
    clz.__final__ = clz.__final__ || {};
    clz.__final__[name] = true;
    if (!target.__preload) {
        target.__preload = function () {
            for (let key in clz.__final__) {
                if (this[key] !== proto[key]) {
                    cc.error('Cannot inherit from final method: ' + this.constructor.name + '.' + key);
                }
            }
        };
    }
};

export interface GdkEventArray {
    0: string;
    1: Function;
    2?: any,
    3?: number,
};

export interface NetEventArray {
    0: number;
    1: Function;
    2?: any,
    3?: number,
}

@ccclass
export default abstract class BaseController extends cc.Component {

    /**
     * 全局事件监听列表，需子类继承override此接口
     * 用法：
     *      return [
     *          [XXXEvent.XXX, this.XXXHandle],             // thisArg 参数默认为 this
     *          [XXXEvent.XXX, this.XXXHandle, this],       // 手动指定thisArg参数
     *          [XXXEvent.XXX, this.XXXHandle, this, 1],    // 指定优先级
     *      ];
     */
    abstract get gdkEvents(): GdkEventArray[];

    /**
     * 网络事件监听列表，需子类继承override此接口
     * 用法：
     *      return [
     *          [XXXMessage.MsgType, this.XXXHandler],          // thisArg 参数默认为 this
     *          [XXXMessage.MsgType, this.XXXHandler, this],    // 手动指定thisArg参数
     *          [XXXMessage.MsgType, this.XXXHandler, this, 1], // 指定优先级
     *      ]
     */
    abstract get netEvents(): NetEventArray[];

    /**
     * 在子类中实现，启用时
     */
    abstract onStart(): void;

    /**
     * 在子类中实现，结束时
     */
    abstract onEnd(): void;

    @final
    onLoad() {
        let a: GdkEventArray[] = this.gdkEvents;
        a && a.forEach(args => {
            gdk.e.on(args[0], args[1], args[2] || this, args[3]);
        });
        let b: NetEventArray[] = this.netEvents;
        b && b.forEach(args => {
            NetManager.on(args[0], args[1], args[2] || this, args[3]);
        });
        this.onStart && this.onStart();
    }

    @final
    onDestroy() {
        // let events = this.gdkEvents;
        // if (events) {
        //     events.forEach(args => {
        //         gdk.e.off(args[0], args[1], args[2] || this);
        //     });
        // }
        // events = this.netEvents;
        // if (events) {
        //     events.forEach(args => {
        //         NetManager.off(args[0], args[1], args[2] || this);
        //     });
        // }
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        this.onEnd && this.onEnd();
    }
}