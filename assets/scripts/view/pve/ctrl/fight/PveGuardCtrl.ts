import PveEnemyCtrl from './PveEnemyCtrl';
import PveGuardModel from '../../model/PveGuardModel';
import PveSoldierCtrl from './PveSoldierCtrl';
/**
 * Pve守卫控制类（会走的小兵）
 * @Author: sthoo.huang
 * @Date: 2019-05-16 15:17:10
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-28 15:01:17
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/fight/PveGuardCtrl")
export default class PveGuardCtrl extends PveSoldierCtrl {

    model: PveGuardModel;
    ctrl: PveGuardCtrl;
    spine: sp.Skeleton;

    onEnable() {
        this.spine = this.spines[0];
        this.spine.paused = false;
        super.onEnable();
    }

    // 方向计算
    setDir(to: cc.Vec2) {
        PveEnemyCtrl.prototype.setDir.call(this, to);
    }

    getScale(animation: string): number {
        return PveEnemyCtrl.prototype.getScale.call(this, animation);
    }

    getAnimation(animation: string): string {
        return PveEnemyCtrl.prototype.getAnimation.call(this, animation, true);
    }

    reset() {
        this.hpBar && this.hideHpBar(false);
        this.ctrl.setPosBy(this.model.index, this.model.total);
        // 战斗时长
        this.checkTime = 1;
        this.isfight = false;
        this.fightTime = 0;
        super.reset();
    }
}