import PveFightBaseAction from '../base/PveFightBaseAction';
import PveHeroCtrl from '../../ctrl/fight/PveHeroCtrl';
import PveHeroModel from '../../model/PveHeroModel';
import { CopyType } from '../../../../common/models/CopyModel';
/**
 * Pve英雄死亡动作
 * @Author: sthoo.huang
 * @Date: 2020-10-27 10:57:40
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-25 09:52:55
 */

@gdk.fsm.action("PveHeroDieAction", "Pve/Hero")
export default class PveHeroDieAction extends PveFightBaseAction {

    model: PveHeroModel;
    ctrl: PveHeroCtrl;
    time: number; // 复活时间

    onEnter() {
        super.onEnter();
        // 隐藏 spine
        let model = this.model;
        let ctrl = this.ctrl;
        // ctrl.setAnimation(PveFightAnmNames.DIE, { mode: 'set', loop: false });
        ctrl.spine.node.active = false;
        ctrl.bgSpine.active = false;
        ctrl.mubeiNode.active = true;
        ctrl.timeLb.node.active = true;
        this.time = model.revive;
        model.removeTempProp();
        model.targetId = -1;
        model.double_hit = 0;
        ctrl.relive = false;
        // 执行BUFF死亡动作
        if (ctrl.buff) {
            ctrl.buff.onDead();
        }
        // 清除所有光环
        if (ctrl.halo) {
            ctrl.halo.clearAll();
        }

        //实战演练通关条件判断
        let sceneModel = ctrl.sceneModel
        if (sceneModel.stageConfig.copy_id == CopyType.RookieCup || sceneModel.stageConfig.copy_id == CopyType.EndRuin) {
            if (sceneModel.gateconditionUtil.oneHeroDieNumLimit.length > 0) {
                sceneModel.gateconditionUtil.oneHeroDieNumLimit.forEach(index => {
                    let data = sceneModel.gateconditionUtil.DataList[index]
                    if (ctrl.model.config.id == data.cfg.data1) {
                        data.curData += 1;
                        data.state = data.curData <= data.cfg.data2
                    }
                })
            }
            if (sceneModel.gateconditionUtil.typeHeroDieNumLimit.length > 0) {
                sceneModel.gateconditionUtil.typeHeroDieNumLimit.forEach(index => {
                    let data = sceneModel.gateconditionUtil.DataList[index]
                    if (ctrl.model.soldierType == data.cfg.data1) {
                        data.curData += 1;
                        data.state = data.curData <= data.cfg.data2
                    }
                })
            }
            if (sceneModel.gateconditionUtil.allHeroDieNumLimit.length > 0) {
                sceneModel.gateconditionUtil.allHeroDieNumLimit.forEach(index => {
                    let data = sceneModel.gateconditionUtil.DataList[index]
                    data.curData += 1;
                    data.state = data.curData <= data.cfg.data2
                })

            }
        }

    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        this.time -= dt * this.model.speedScale;
        this.ctrl.timeLb.string = this.time.toFixed(1);
        if (this.time <= 0) {
            this.finish();
        }
    }

    onExit() {
        let ctrl = this.ctrl;
        ctrl.timeLb.node.active = false;
        ctrl.mubeiNode.active = false;
        ctrl.spine.node.active = true;
        ctrl.mysticBgSpine();
        super.onExit();
    }
}