import PveCalledModel from '../../model/PveCalledModel';
import PveFightSearchAction from '../base/PveFightSearchAction';
import PveTool from '../../utils/PveTool';
import { PveFightCtrl } from '../../core/PveFightCtrl';

/**
 * 召唤物(非守卫类)搜索目标动作
 * @Author: yaozu.hu
 * @Date: 2019-09-20 16:20:47
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-31 18:36:42
 */
@gdk.fsm.action("PveCalledSearchAction", "Pve/Called")
export default class PveCalledSearchAction extends PveFightSearchAction {

    // 寻找目标
    searchTarget(): boolean {
        let model: PveCalledModel = this.model as PveCalledModel;
        let pos = this.ctrl.getPos();
        if (model.getProp('feature1') == 2) {
            pos = model.ownerPos;
        }
        let target: PveFightCtrl = PveTool.searchTarget({
            fight: this.ctrl,
            targetType: model.currSkill.targetType,
            pos: pos,
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
