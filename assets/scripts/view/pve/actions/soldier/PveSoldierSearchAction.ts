import PveFightSearchAction from '../base/PveFightSearchAction';
import PveSoldierModel from '../../model/PveSoldierModel';
import PveTool from '../../utils/PveTool';
import { PveFightCtrl } from '../../core/PveFightCtrl';

/**
 * Pve小兵搜索目标动作
 * @Author: sthoo.huang
 * @Date: 2019-04-12 10:50:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-04-18 11:54:50
 */

@gdk.fsm.action("PveSoldierSearchAction", "Pve/Soldier")
export default class PveSoldierSearchAction extends PveFightSearchAction {

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let sceneModel = this.sceneModel;
        if (sceneModel.time < sceneModel.config.waitTime) return;
        super.updateScript(dt);
    }
    // 寻找目标
    searchTarget(): boolean {
        let model: PveSoldierModel = this.model as PveSoldierModel;
        let target: PveFightCtrl = PveTool.searchTarget({
            fight: this.ctrl,
            targetType: model.currSkill.targetType,
            pos: model.hero.getPos(),
            range: model.atkDis,
        });
        this.isTargetChanged = false;
        if (target) {
            if (target.model.fightId != model.targetId) {
                model.targetId = target.model.fightId;
                this.isTargetChanged = true;
            }
            this.ctrl.setDir(target.getPos());
            return true;
        }
        // 清除当前目标
        model.targetId = -1;
        this.isTargetChanged = true;
        return false;
    }
}