import FightingMath from '../../../../common/utils/FightingMath';
import PveBaseSkillCtrl from '../../ctrl/skill/PveBaseSkillCtrl';
import PveSkillLinearMotionAction from './PveSkillLinearMotionAction';
import PveSkillModel from '../../model/PveSkillModel';
import { getPveSkillAnmNameValue, PveSkillAnmNameEnum } from '../../const/PveAnimationNames';
import { PveSkillType, PveTrackType } from '../../const/PveSkill';
/**
 * Pve技能正常特效动作
 * @Author: sthoo.huang
 * @Date: 2019-04-30 13:49:22
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-21 16:56:54
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSkillAnimationAction", "Pve/Skill")
export default class PveSkillAnimationAction extends PveSkillLinearMotionAction {

    // 在面板中隐藏不需要的参数
    @property({ override: true, visible: false, serializable: false })
    moveAnimation: any = null;
    @property({ override: true, visible: false, serializable: false })
    bombAnimation: any = null;
    @property({ override: true, visible: false, serializable: false })
    ease: any = null;
    @property({ override: true, visible: false, serializable: false })
    easeParam: any = null;

    @property({ type: cc.Enum(PveSkillAnmNameEnum), tooltip: "动画名称" })
    animation: PveSkillAnmNameEnum = PveSkillAnmNameEnum.DEFAULT;

    onEnter() {
        let ctrl = this.node.getComponent(PveBaseSkillCtrl);
        let config = ctrl.model.config;
        // if (config.hit_animation == '') {
        //     // 优先使用配置文件中配置的动作名
        //     config.hit_animation = getPveSkillAnmNameValue(this.animation);
        // }
        // // 舜发技能move动作与hit动作相同
        // let animation = config.hit_animation;

        let animation: any = ctrl.model.config.hit_animation;
        if (typeof animation === 'object') {
            // 配置中动作为数组，则随机挑一个动作
            animation = animation[FightingMath.rnd(0, animation.length - 1)];
        }

        if (!animation || animation == '') {
            animation = getPveSkillAnmNameValue(this.animation);
        }

        if (config.move_animation == '') {
            config.move_animation = animation;
        }
        this.bombAnimation = animation;
        this.moveAnimation = animation;
        // 坐标跟随
        if (ctrl.model.effectType.to_follow_pos) {
            this.update = this._updatePos;
        }
        super.onEnter();
    }


    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let a = this.updateDatas;
        let n = a.length;
        if (n > 0) {
            for (let i = 0; i < n; i++) {
                // 单个spine的位置更新update方法
                let data = a[i];
                let spine = data.spine;
                let node = spine.node;
                // 延时处理
                if (data.delay > 0) {
                    data.delay -= dt;
                    if (data.delay > 0) {
                        continue;
                    }
                    node.opacity = 255;
                }
                // 检查目标是否死亡
                this.checkTargetDie(node, data);
                // 当前动作无效，则直接退出
                if (!this.active) return;
                // 更新目标坐标
                data.to = this.getToPos(data.index);
                if (this.syncRotation) {
                    this.setRotation(node, data);
                }
                // 到达目标
                a[i] = null;
                node.setPosition(data.to);
                this.onArrivalHandle(node, data);
                // 当前动作无效，则直接退出
                if (!this.active) return;
            }
            // 从列表中移除null项
            for (let i = n - 1; i >= 0; i--) {
                if (!a[i]) a.splice(i, 1);
            }
            return;
        }
        let et = this.model ? this.model.effectType : null;
        if (et && et.track_type == PveTrackType.None && et.hit_rotation && et.sync_rotation) {
            // 跟随目标旋转角度（跟随激光）
            for (let i = 0, n = this.spines.length; i < n; i++) {
                let spine = this.spines[i];
                let data = this.getData(i, spine);
                this.setRotation(spine.node, data, true);
            }
        }
    }

    getToPos(index?: number, dt: number = 0) {
        let b: boolean = PveSkillType.isManualTD(this.model.config.type) && this.model.config.skill_id > 1000;
        if (b) {
            // 手动技能
            return this.model.targetPos;
        }
        return super.getToPos(index, dt);
    }

    getAction(index: number, spine: sp.Skeleton): cc.Action {
        spine.node.setPosition(this.getFromPos(index));
        let data = this.getData(index, spine);
        let config = this.model.config;
        let move_delay: number = 0;
        if (config.move_delay instanceof Array) {
            // 配置不同的值
            move_delay = config.move_delay[index] || 0;
        } else if (cc.js.isNumber(config.move_delay)) {
            // 配置值为数字
            move_delay = config.move_delay;
        } else {
            return null;
        }
        // 动作
        data.action = cc.callFunc(this._spineActionFunc, this, data);
        data.delay = move_delay;
        spine.node.opacity = move_delay > 0 ? 0 : 255;
        //spine.node.setPosition(data.from);
        return data.action;

    }

    // 动画完成回调
    onComplete(model: PveSkillModel, spine: sp.Skeleton) {
        if (model.effectType == null) return;
        if (model.effectType.search_after_dmg) {
            spine.setStartListener(null);
            spine.setEventListener(null);
            spine.setCompleteListener(null);
        }

        super.onComplete(model, spine);
    }

    _updatePos() {
        let model = this.model;
        let sceneModel = this.ctrl.sceneModel;
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            if (spine) {
                let target = sceneModel.getFightBy(model.selectedTargets[i]);
                if (target && target.isAlive) {
                    spine.node.setPosition(this.getToPos(i));
                }
            }
        }
    }

    onExit() {
        super.onExit();
        this.update = null;
    }
}