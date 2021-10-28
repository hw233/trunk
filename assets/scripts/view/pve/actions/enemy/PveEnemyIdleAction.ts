import PveEnemyModel from '../../model/PveEnemyModel';
import PveFightBaseAction from '../base/PveFightBaseAction';
import { PveFightAnmNames } from '../../const/PveAnimationNames';

/**
 * PVE-ENEMY待机动作
 * @Author: sthoo.huang
 * @Date: 2019-03-18 21:17:38
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-26 18:36:15
 */

@gdk.fsm.action("PveEnemyIdleAction", "Pve/Enemy")
export default class PveEnemyIdleAction extends PveFightBaseAction {

    model: PveEnemyModel;

    onEnter() {
        super.onEnter();
        this.model.currSkill = null;
        this.model.targetId = -1;
        // 设置出生默认朝向
        if (this.model.road && this.model.road.length > 0) {
            this.ctrl.setDir(this.model.road[0]);
        }
        // 普通待机动作
        this.ctrl.setAnimation(PveFightAnmNames.IDLE, { mode: 'set' });
        this.ctrl.updateRect();
        // 指定了出生动作
        if (this.model.born_animation && this.model.born_animation.split('#').length == 1) {
            this.model.needWait = true;
            this.model.watiTime = Number.MAX_VALUE;
            this.model.brithTime = Number.MAX_VALUE;
            this.ctrl.setAnimation(
                this.model.born_animation,
                {
                    mode: 'set',
                    loop: false,
                    onComplete: () => {
                        // 等待时间结束，无敌时间结束
                        this.model.needWait = false;
                        this.model.watiTime = 0;
                        this.model.brithTime = 0;
                    },
                },
            );
        }
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (this.model.needWait && this.model.wait_delayTime <= 0) {
            if (this.model.watiTime <= 0) {
                this.model.needWait = false;
                this.finish();
            } else {
                this.model.watiTime -= dt;
            }
        } else {
            this.finish();
        }
    }
}