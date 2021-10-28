import PveSkillBaseAction from '../base/PveSkillBaseAction';
import PveTool from '../../utils/PveTool';

/**
 * PVE技能销毁动作
 * @Author: sthoo.huang
 * @Date: 2019-06-06 14:00:28
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-11 12:14:43
 */

@gdk.fsm.action("PveSkillDestroyAction", "Pve/Skill")
export default class PveSkillDestroyAction extends PveSkillBaseAction {

    onEnter() {
        super.onEnter();
        this.spines.forEach(s => {
            s && PveTool.clearSpine(s);
        });
        PveTool.callLater(this, this.onEnterLater);
    }

    onEnterLater() {

        // 添加判空
        if (!this.active || !this.ctrl) {
            this.finish();
            return;
        }

        // 隐藏节点
        this.ctrl.hide();
        this.finish();
    }
}