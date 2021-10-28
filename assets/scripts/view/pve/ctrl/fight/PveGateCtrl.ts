import PveGateModel from '../../model/PveGateModel';
import PveHurtableFightCtrl from './PveHurtableFightCtrl';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';

/** 
 * Pve传送门控制类
 * @Author: sthoo.huang  
 * @Date: 2019-06-19 17:18:41 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-20 10:55:21
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/fight/PveGateCtrl")
export default class PveGateCtrl extends PveHurtableFightCtrl {

    /** 数据 */
    model: PveGateModel;
    spine: sp.Skeleton;

    @property(cc.BoxCollider)
    boxCollider: cc.BoxCollider = null;

    onEnable() {
        this.spine = this.spines[0];
        this.spine.paused = false;
        super.onEnable();
        switch (this.model.config.range_type) {
            case 2:
                // 矩形
                this.boxCollider.node.active = true;
                this.boxCollider.size.width = this.model.config.range;
                // 同步角度
                if (this.model.owner) {
                    let from: cc.Vec2 = this.model.owner.getPos();
                    let to: cc.Vec2 = this.getPos();
                    let angle: number = Math.atan2(from.y - to.y, from.x - to.x);
                    let degree: number = angle * 180 / Math.PI;
                    this.boxCollider.node.angle = -(degree <= 0 ? -degree : 360 - degree);
                } else {
                    // 没有所有者时，无需更新角度
                    this.boxCollider.node.angle = 0;
                }
                break;

            case 1:
            default:
                // 圆形
                this.boxCollider.node.active = false;
                break;
        }
    }

    onDisable() {
        let model = this.model;
        super.onDisable();
        model && PvePool.put(model);
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let model = this.model;
        if (!model) return;
        if (!model.ready) return;
        // 持续时间
        if (model.time > 0) {
            model.time -= dt;
            if (model.time <= 0) {
                // 持续时间已到，直接消失
                this.hide();
                return;
            }
        }
        // super.updateScript(dt);
        this.fsm && PveTool.execFsmUpdateScript(this.fsm, dt);
    }

    @gdk.binding('sceneModel.state')
    _setState() { /* 屏蔽重置处理 */ }
    _createHpBar() { /* 不创建血条 */ }
    refreshShiedShow() { /* 不刷新护盾 */ }
}