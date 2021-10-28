/**
 * 物件碰撞控制组件脚本
 * @Author: sthoo.huang
 * @Date: 2019-04-23 10:04:19
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-27 20:45:37
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/base/ThingColliderCtrl")
export default class ThingColliderCtrl extends cc.Component {

    nodes: cc.Node[] = [];

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    private onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        this.addNode(other.node);
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    private onCollisionStay(other: cc.Collider, self: cc.Collider) {
        this.addNode(other.node);
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    private onCollisionExit(other: cc.Collider, self: cc.Collider) {
        this.nodes.some((node, index, arr) => {
            if (node === other.node) {
                arr.splice(index, 1);
                return true;
            }
            return false;
        });
    }

    /**
     * 添加碰撞节点至碰撞列表
     * @param node 
     */
    private addNode(node: cc.Node) {
        let index: number = this.nodes.indexOf(node);
        if (index >= 0) {
            this.nodes.splice(index, 1);
        }
        this.nodes.push(node);
    }

    /**
     * 返回与当前对象发生碰撞的一个指定的组件实例
     * @param <T> clz 组件类
     * @param func 条件判断函数
     */
    getClolliderComponent<T>(clz: { new(): T }, func?: (ctrl: T) => boolean): T {
        let node: cc.Node;
        let ctrl: T;
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            node = this.nodes[i];
            ctrl = node.getComponent(clz);
            if (ctrl && (!func || func(ctrl))) {
                break;
            }
            ctrl = null;
        }
        return ctrl;
    }

    /**
     * 返回与当前对象发生碰撞的指定类的组件的所有实例
     * @param <T> clz 
     * @param func 条件判断函数
     */
    getClolliderComponents<T>(clz: { new(): T }, func?: (ctrl: T) => boolean): T[] {
        let a: T[] = [];
        for (let i = 0, n = this.nodes.length; i < n; i++) {
            let node = this.nodes[i];
            let ctrl: T = node.getComponent(clz);
            if (ctrl && (!func || func(ctrl))) {
                a.push(ctrl);
            }
        }
        return a;
    }
}