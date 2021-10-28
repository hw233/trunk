import ConfigManager from '../../../../common/managers/ConfigManager';
import MathUtil from '../../../../common/utils/MathUtil';
import PveEnemyModel from '../../model/PveEnemyModel';
import PveFightSearchAction from '../base/PveFightSearchAction';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveTool from '../../utils/PveTool';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { PveSkillType } from '../../const/PveSkill';
import { Skill_target_typeCfg } from './../../../../a/config';

/**
 * Pve怪物攻击动作
 * @Author: sthoo.huang
 * @Date: 2019-05-17 11:06:27
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-30 18:43:28
 */

@gdk.fsm.action("PveEnemySearchAction", "Pve/Enemy")
export default class PveEnemySearchAction extends PveFightSearchAction {

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let model: PveEnemyModel = this.model as PveEnemyModel;
        let target = this.sceneModel.getFightBy(model.targetId);
        if (!target || !target.isAlive || target.invisible) {
            // 没有目标，或目标已经挂逼，或者目标无敌
            model.targetId = -1;
            model.double_hit = 0;
            this.isTargetChanged = true;
            this.finish();
            return;
        }
        if (model.double_hit > 0) {
            this.isTargetChanged = false;
        }
        // 攻速为0则不攻击
        if (this.model.speedScale <= 0) {
            return;
        }
        // 查询技能
        if (this.sceneModel.isLogicalFrame) {
            this.searchSkill();
            if (model.currSkill) {
                this.attack(false);
                if (!this.active) return;
                // 怪物的主动技能
                if (PveSkillType.isAutoTDSkill(model.currSkill.type)) {
                    let temTarget: PveFightCtrl = PveTool.searchTarget({
                        fight: this.ctrl,
                        targetType: model.currSkill.targetType,
                        pos: model.ctrl.getPos(),
                        range: model.currSkill.config.range,
                    });
                    if (temTarget) {
                        //target = temTarget;
                        model.oldTargetId = model.targetId;
                        model.targetId = temTarget.model.fightId;
                        // 设置方向和状态
                        let to: cc.Vec2 = temTarget.getPos();
                        this.ctrl.setDir(to);
                        this.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_ACTIVE_SKILL);
                        return;
                    } else {
                        // 找不到目标，重置技能cd，防止死循环
                        model.skillCds[model.currSkill.cd_type].reset();
                        return;
                    }
                }
                // 目标离开攻击距离
                let from: cc.Vec2 = this.ctrl.getPos();
                let to: cc.Vec2 = target.getPos();
                if (MathUtil.distance(from, to) > model.currSkill.range) {
                    model.targetId = -1;
                    this.finish();
                    return;
                }
                // 设置方向和状态
                this.ctrl.setDir(to);
                this.sendEvent(PveFsmEventId.PVE_FIGHT_ATTACK);
            }
        }
    }

    // 目标已经设定好
    searchTarget(): boolean {
        let skill = this.model.currSkill;
        let targetType = skill.targetType;
        let targetCfg = ConfigManager.getItemById(Skill_target_typeCfg, targetType);
        if (CC_DEBUG && !targetCfg) {
            cc.error(`技能 id: ${skill.id} 找不到 target_type: ${targetType} 配置`);
            return false;
        }
        if (targetCfg.target != 2) {
            // 非反击技能，存在有效目标时才能施放
            let target = PveTool.searchTarget({
                fight: this.ctrl,
                targetType: targetType,
                pos: this.ctrl.getPos(),
                range: skill.range,
            });
            return !!target;
        }
        return true;
    }
}