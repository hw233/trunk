import PveEnemyModel from '../../model/PveEnemyModel';
import PveFightAttackAction from '../base/PveFightAttackAction';

/**
 * PVE-ENEMY攻击动作
 * @Author: sthoo.huang
 * @Date: 2019-03-18 21:17:38
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-03-18 16:44:11
 */

@gdk.fsm.action("PveEnemyAttackAction", "Pve/Enemy")
export default class PveEnemyAttackAction extends PveFightAttackAction {

    onExit() {
        let model: PveEnemyModel = this.model as PveEnemyModel;

        model.currSkill = null;
        model.targetId = model.oldTargetId;
        model.oldTargetId = -1;
        //model.targetId = -1;
        super.onExit();
    }
}