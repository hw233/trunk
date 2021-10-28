import PveHurtableFightCtrl from './PveHurtableFightCtrl';
import PvePool from '../../utils/PvePool';
import PveTrapModel from '../../model/PveTrapModel';

/**
 * Pve普通陷阱控制类
 * @Author: sthoo.huang
 * @Date: 2019-06-17 10:26:48
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-17 11:07:56
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/fight/PveTrapCtrl")
export default class PveTrapCtrl extends PveHurtableFightCtrl {

    /** 数据 */
    model: PveTrapModel;
    spine: sp.Skeleton;

    @property(cc.BoxCollider)
    boxCollider: cc.BoxCollider = null;

    onEnable() {
        this.spine = this.spines[0];
        this.spine.paused = false;
        super.onEnable();
    }

    //设置包围盒大小
    initBoxSize() {
        let model = this.model;
        switch (model.config.range_type) {
            case 2:
                // 矩形
                this.boxCollider.node.active = true;
                if (cc.js.isNumber(model.config.range)) {
                    this.boxCollider.size.width = model.config.range;
                } else {
                    this.boxCollider.size.width = model.config.range[0];
                    this.boxCollider.size.height = model.config.range[1];
                }
                // 同步角度
                if (model.owner) {
                    let from: cc.Vec2 = model.owner.getPos();
                    let to: cc.Vec2 = this.getPos();
                    let angle: number = Math.atan2(from.y - to.y, from.x - to.x);
                    let degree: number = angle * 180 / Math.PI;
                    this.boxCollider.node.angle = -(degree <= 0 ? -degree : 360 - degree);
                } else {
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
        if (!model.loaded) return;
        if (model.time <= 0) {
            // 持续时间已到
            if (model.config.complete_animation) {
                // 有消失动作
                this.setAnimation(
                    model.config.complete_animation,
                    {
                        loop: false,
                        onComplete: this.hide,
                        thisArg: this,
                    }
                );
            } else {
                // 直接消失
                this.hide();
            }
        } else {
            model.time -= dt;
            super.updateScript(dt);
        }
    }

    @gdk.binding('sceneModel.state')
    _setState() { /* 屏蔽重置处理 */ }
    _createHpBar() { /* 不创建血条 */ }
    refreshShiedShow() { /* 不刷新护盾 */ }
}