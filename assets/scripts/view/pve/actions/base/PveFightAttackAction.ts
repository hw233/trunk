import PveFightBaseAction from './PveFightBaseAction';
import PvePool from '../../utils/PvePool';
import PveSkillModel from '../../model/PveSkillModel';
import PveTool from '../../utils/PveTool';

/**
 * PVE战斗对象攻击动作基类
 * @Author: sthoo.huang
 * @Date: 2019-03-18 12:28:30
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-03-04 10:40:07
 */

@gdk.fsm.action("PveFightAttackAction", "Pve/Base")
export default class PveFightAttackAction extends PveFightBaseAction {

    onEnter() {
        super.onEnter();
        // 自己已经挂逼了
        if (!this.ctrl.isAlive) {
            this.finish();
            return;
        }
        // 目标已经挂逼了
        let target = this.sceneModel.getFightBy(this.model.targetId);
        if (!target || !target.isAlive) {
            this.model.targetId = -1;
            this.finish();
            return;
        }
        // 创建技能攻击
        let model: PveSkillModel = PvePool.get(PveSkillModel);
        let skill = this.model.useSkill();
        model.option.onComplete = this.finish;
        model.option.thisArg = this;
        model.config = skill.prop;
        model.attacker = this.ctrl;
        model.addTarget(target);
        PveTool.useSkill(model, this.sceneModel);
        //显示主动技能的名称
        // if (PveSkillType.isAutoTDSkill(model.config.type)) {
        //     let node: cc.Node = PvePool.get(this.sceneModel.ctrl.skillNameEffect);
        //     let ctrl = node.getComponent(PveSkillNameEffect);
        //     let hero = this.model.ctrl as PveBaseFightCtrl;
        //     ctrl.sceneModel = this.sceneModel;
        //     ctrl.target = hero;
        //     ctrl.value = model.config.name;
        //     this.sceneModel.ctrl.hurt.addChild(node);
        // }
    }
}