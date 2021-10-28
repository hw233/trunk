import PveFightBaseAction from '../base/PveFightBaseAction';
import PveHeroCtrl from '../../ctrl/fight/PveHeroCtrl';
import PveHeroModel from '../../model/PveHeroModel';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
/**
 * Pve英雄重生动作
 * @Author: sthoo.huang
 * @Date: 2020-10-27 11:06:08
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-21 21:17:54
 */

@gdk.fsm.action("PveHeroReliveAction", "Pve/Hero")
export default class PveHeroReliveAction extends PveFightBaseAction {

    model: PveHeroModel;
    ctrl: PveHeroCtrl;
    time: number;

    onEnter() {
        super.onEnter();
        // 播放复活特效
        let ctrl = this.sceneModel.ctrl;
        let skin = 'E_yingxiongfuhuo';
        PveTool.createSpine(
            ctrl.spineNodePrefab,
            ctrl.effect,
            `spine/skill/${skin}/${skin}`,
            `hit`,
            false,
            Math.max(1, this.sceneModel.timeScale),
            (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => {
                if (!cc.isValid(spine.node)) return;
                // 清理并回收spine节点
                PveTool.clearSpine(spine);
                PvePool.put(spine.node);
                // // 回收资源
                // gdk.rm.releaseRes(resId, res);
            },
            null,
            PveTool.getCenterPos(this.ctrl.getPos(), this.ctrl.getRect()),
            false,
            false,
        );
        // 复活英雄
        this.model.ready = true;
        this.model.reliveNum += 1;
        this.model.hp = this.model.hpMax;
        this.ctrl.showAtkDis = false;
        this.ctrl.setAnimation(PveFightAnmNames.IDLE);
        this.ctrl.relive = true;
        // 英雄复活时小怪同时复活
        this.model.soldiers.forEach(s => {
            if (!cc.isValid(s)) return;
            s.model.hp = s.model.hpMax;
        });
        // BUFF表达式事件，死亡复活事件
        let prop = this.model.prop;
        let onrelive = prop.onrelive;
        if (onrelive != null && typeof onrelive === 'object') {
            // 验证onrelive事件对象有效
            PveTool.evalBuffEvent(
                onrelive,
                this.model.fightId,
                prop,
                this.ctrl,
                this.ctrl,
                {
                    a: prop,
                    t: prop,
                    am: this.model,
                    tm: this.model,
                },
            );
        }
        // 延迟0.2秒，等待光环效果
        this.time = 0.2;
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        this.time -= dt;
        if (this.time <= 0) {
            this.finish();
        }
    }
}