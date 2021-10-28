import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneCheckAction from '../scene/PveSceneCheckAction';
import PveSceneState from '../../enum/PveSceneState';
import PveTool from '../../utils/PveTool';
import { PveCampType } from '../../core/PveFightModel';

/**
 * PVE场景状态检查动作
 * @Author: sthoo.huang
 * @Date: 2020-04-16 22:00:57
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-17 16:46:44
 */
@gdk.fsm.action("PveReplayCheckAction", "Pve/Replay")
export default class PveReplayCheckAction extends PveSceneCheckAction {

    update(dt: number) {
        let model = this.model;
        if (model.state !== PveSceneState.Fight) return;
        if (model.loading) return;
        let timeScale = model.timeScale;
        if (timeScale <= 0) return;
        if (timeScale !== 1) {
            dt *= model.timeScale;
        }
        model.realTime += dt;
        // 帧循环
        this.updateScript(dt);
        this.isOver && this.gameOver();
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let model = this.model;
        // 更新游戏时间
        model.frameId++;
        model.time += dt;
        model.waveTime += dt;
        // 初始化选择器数据
        let all = model.getAllFightArr();
        model.fightSelector.clear();
        for (let i = 0, n = all.length; i < n; i++) {
            let t = all[i];
            if (t.isAlive && t.model.camp != PveCampType.Neutral) {
                // 只插入存活的非中立单位
                model.fightSelector.insertFight(t);
            }
        }
        // 使用指挥官手动技能
        if (model.manualSkill) {
            let skill = model.manualSkill;
            let general = model.generals[0];
            model.manualSkill = null;
            general.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_MANUAL_ATTACK);
            general.setDir(skill.targetPos);
            skill.option.onComplete = () => {
                // 施法完成
                if (!general) return;
                if (!general.model) return;
                general.model.isInManual = false;
            };
            skill.option.thisArg = this;
            general.showSkillName(skill.config.skill_id);
            PveTool.useSkill(skill, model);
        }
        // 刷新所有技能的updateScript循环
        for (let i = 0, n = model.skills.length; i < n; i++) {
            let comp = model.skills[i];
            if (comp && comp.enabledInHierarchy) {
                comp.updateScript(dt);
            }
        }
        // 刷新所有战斗对象的updateScript循环
        for (let i = 0, n = all.length; i < n; i++) {
            let comp = all[i];
            if (comp && comp.enabledInHierarchy) {
                comp.updateScript(dt);
            }
        }
    }

    // 游戏是否结束
    get isOver(): boolean {
        let model = this.model;
        if (model.enemyBorns.length > 0) return false;
        if (model.enemies.length > 0) return false;
        // 游戏结束
        return true;
    }
}