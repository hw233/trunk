import PanelId from '../../../../configs/ids/PanelId';
import PveEnemyCtrl from '../../ctrl/fight/PveEnemyCtrl';
import PveEnemyModel from '../../model/PveEnemyModel';
import PveFightLoadResAction from '../base/PveFightLoadResAction';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';

/**
 * Pve怪物资源加载动作
 * @Author: sthoo.huang
 * @Date: 2020-07-18 14:52:52
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-31 09:53:17
 */

@gdk.fsm.action("PveEnemyLoadResAction", "Pve/Enemy")
export default class PveEnemyLoadResAction extends PveFightLoadResAction {

    model: PveEnemyModel;
    ctrl: PveEnemyCtrl;

    loadRes() {
        // 显示出现特效
        let args = this.model.born_animation ? this.model.born_animation.split('#') : null;
        if (args && args.length > 1) {
            let ctrl = this.sceneModel.ctrl;
            PveTool.createSpine(
                ctrl.spineNodePrefab,
                ctrl.effect,
                `spine/common/${args[0]}/${args[0]}`,
                args[1] || 'hit',
                false,
                Math.max(1, this.sceneModel.timeScale),
                (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => {
                    if (!cc.isValid(spine.node)) return;
                    // 清理并回收spine节点
                    PveTool.clearSpine(spine);
                    PvePool.put(spine.node);
                    // // 回收资源
                    // gdk.rm.releaseRes(resId, res);
                    // 完成动作
                    if (this.active) {
                        gdk.Timer.clear(this, this.preloadRes);
                        super.preloadRes();
                    }
                },
                () => {
                    if (!cc.isValid(this.node) || !this.model) return false;
                    return true;
                },
                PveTool.getCenterPos(this.ctrl.getPos(), this.ctrl.getRect()),
                false,
                false,
            );
            gdk.Timer.once(400, this, this.superLoadRes);
        } else {
            // 不显示出现特效，则直接加载
            this.superLoadRes();
        }
    }

    superLoadRes() {
        if (!cc.isValid(this.node)) return;
        if (!this.model) return;
        super.loadRes();
    }

    // 预加载技能资源
    preloadRes() {
        if (!cc.isValid(this.node)) return;
        if (!this.sceneModel.isDemo) {
            // 有怪物说明，则预加载怪物或BOSS来袭界面
            if (this.model.config.present) {
                gdk.panel.preload(this.model.isBoss ? PanelId.PveBossComming : PanelId.PveMonsterComming);
            }
            super.preloadRes();
        }
    }

    onExit() {
        super.onExit();
        gdk.Timer.clear(this, this.superLoadRes);
    }
}