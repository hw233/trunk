import PveBaseSkillCtrl from '../../ctrl/skill/PveBaseSkillCtrl';
import PveSkillModel from '../../model/PveSkillModel';

/**
 * Pve技能类动作基类
 * @Author: sthoo.huang
 * @Date: 2019-05-21 20:18:54
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-05-21 20:21:01
 */
@gdk.fsm.action("PveSkillBaseAction", "Pve/Base")
export default class PveSkillBaseAction extends gdk.fsm.FsmStateAction {

    ctrl: PveBaseSkillCtrl;
    spines: sp.Skeleton[];
    model: PveSkillModel;

    onEnter() {
        this.ctrl = this.node.getComponent(PveBaseSkillCtrl);
        this.spines = this.ctrl.spines;
        this.model = this.ctrl.model;
    }

    onExit() {
        this.ctrl = null;
        this.spines = null;
        this.model = null;
    }
}