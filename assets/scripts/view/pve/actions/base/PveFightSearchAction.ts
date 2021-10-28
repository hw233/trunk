import FightingMath from '../../../../common/utils/FightingMath';
import PveFightBaseAction from './PveFightBaseAction';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveHeroModel from '../../model/PveHeroModel';
import PveTool from '../../utils/PveTool';
import { PveBSScopeType } from '../../utils/PveBSExprUtils';
import { PveFightType } from '../../core/PveFightModel';
import { PveSkillType } from '../../const/PveSkill';

/**
 * Pve战斗对象搜索目标动作基类
 * @Author: sthoo.huang
 * @Date: 2019-04-12 10:50:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-15 15:19:52
 */

@gdk.fsm.action("PveFightSearchAction", "Pve/Base")
export default class PveFightSearchAction extends PveFightBaseAction {

    delay: number;
    isTargetChanged: boolean;

    onEnter() {
        super.onEnter();
        this.delay = 0;
        this.isTargetChanged = true;
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        // 延迟帧数
        if (this.delay > 0) {
            this.delay -= dt;
            return;
        }
        // 攻速为0则不攻击
        if (this.model.speedScale <= 0) {
            return;
        }
        // 跳帧
        if (this.sceneModel.isLogicalFrame) {
            this.searchSkill();
            if (this.model.currSkill) {
                this.attack();
            } else {
                this.resetDelay();
            }
        }
    }

    // 挑选技能
    searchSkill() {
        let model = this.model;
        let skills = model.skills;
        model.currSkill = null;
        for (let i = 0, n = skills.length; i < n; i++) {
            let s = skills[i];
            if (s.config.relatedSkill != -1 && PveSkillType.isAutoTD(s.type) && model.canUse(s)) {
                // 技能已冷却，并且为TD类型技能则可以使用
                model.currSkill = s;
                // 判断是够关联特定技能
                if (cc.js.isNumber(s.config.relatedSkill) && s.config.relatedSkill > 0) {
                    skills.some(skill => {
                        if (skill.id == s.config.relatedSkill && model.canUse(skill)) {
                            model.currSkill = skill;
                            return true;
                        }
                        return false;
                    });
                }

                // 普攻技能
                if (PveSkillType.isNormal(s.type)) {
                    // 攻速为0时，不能使用普攻(403普攻不受攻速影响)
                    if (s.type != 403 && model.atkSpeed == 0) {
                        model.currSkill = null;
                        continue;
                    }
                    // 缴械时不能使用普攻技能
                    if (model.getProp('disarm')) {
                        model.currSkill = null;
                        continue;
                    }
                }

                // 主动技能
                else if (PveSkillType.isAutoTDSkill(s.type)) {
                    // 沉默不能使用主动技能
                    if (model.getProp('silence')) {
                        model.currSkill = null;
                        continue;
                    }
                }

                if (this.searchTarget()) {
                    break;
                }
                model.currSkill = null;
            }
        }
    }

    /**
     * 需在子类中覆写此方法实现目标查找功能
     */
    searchTarget(): boolean {
        return false;
    }

    /**
     * 重置等待时间
     */
    resetDelay() {
        this.delay = 1 / FightingMath.rnd(2, 5);
    }

    /**
     * 开始攻击
     * @param hasEvent 是否发送FSM事件
     */
    attack(hasEvent: boolean = true) {
        let model = this.model;
        let attacker_prop = model.prop;
        if (!this.active) return;
        // 更换目标，连击次数重置
        if (this.isTargetChanged) {
            model.double_hit = 0;
            // 机枪、炮兵连击清零
            if (model.type == PveFightType.Hero) {
                (model as PveHeroModel).soldiers.forEach(soldier => {
                    soldier.model.double_hit = 0;
                });
            }
            // 切换目标时触发
            let onchange = model.prop.onchange;
            if (onchange != null && typeof onchange === 'object') {
                let target = this.sceneModel.getFightBy(model.targetId);
                let scope: PveBSScopeType = {
                    t: target.model.prop,
                    a: attacker_prop,
                    am: model,
                    tm: target.model,
                    m: target.model,   // 兼容旧的配置
                    s: model.currSkill.config,
                };
                PveTool.evalBuffEvent(
                    onchange,
                    model.fightId,
                    attacker_prop,
                    model.ctrl,
                    target,
                    scope,
                );
                if (!this.active) return;
            }
        }
        // 攻击前事件检测
        let onselect = model.prop.onselect;
        if (onselect != null && typeof onselect === 'object') {
            let target = this.sceneModel.getFightBy(model.targetId);
            let scope: PveBSScopeType = {
                t: target.model.prop,
                a: attacker_prop,
                am: model,
                tm: target.model,
                m: target.model,   // 兼容旧的配置
                s: model.currSkill.config,
            };
            PveTool.evalBuffEvent(
                onselect,
                model.fightId,
                attacker_prop,
                model.ctrl,
                target,
                scope,
            );
            if (!this.active) return;
        }
        if (hasEvent) {
            this.sendEvent(PveFsmEventId.PVE_FIGHT_ATTACK);
        }
    }
}