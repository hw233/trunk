import FightingMath from '../../../../common/utils/FightingMath';
import MathUtil from '../../../../common/utils/MathUtil';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveSkillType } from '../../const/PveSkill';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveEnemyModel from '../../model/PveEnemyModel';
import PveTool from '../../utils/PveTool';
import PveFightBaseAction from '../base/PveFightBaseAction';
/**
 * PVE怪物行走动作
 * @Author: sthoo.huang
 * @Date: 2019-03-19 11:46:19
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-18 17:40:55
 */
const abs = Math.abs;
const ceil = Math.ceil;

@gdk.fsm.action("PveEnemyWalkAction", "Pve/Enemy")
export default class PveEnemyWalkAction extends PveFightBaseAction {

    delay: number;
    model: PveEnemyModel;
    status: number;

    onEnter() {
        super.onEnter();
        this.delay = 0;
        this.status = 0;
        // 更新方向和动作
        if (this.model.targetPos) {
            this.ctrl.setDir(this.model.targetPos);
            let animStr = PveFightAnmNames.WALK;
            if (this.model.getProp("walk_anim")) {
                animStr = this.model.getProp("walk_anim")
            }
            this.ctrl.setAnimation(animStr, { mode: 'set' });
        }
    }

    onExit() {
        this.ctrl.removePrePos();
        this.status = 0;
        super.onExit();
    }

    // 改变状态
    changeStatus(v: number) {
        this.status = v;
        gdk.Timer.callLater(this, this.changeStatusLater);
    }

    // 改变状态延时回调
    changeStatusLater() {
        if (!this.active) return;
        if (!this.model) return;
        switch (this.status) {
            case 1:
                // 等待状态
                this.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_MONSTER_WAIT);
                break;

            case 2:
                // 反击
                this.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_REATTACK);
                break;

            case 3:
                // 使用技能
                this.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_ACTIVE_SKILL);
                break;
        }
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (this.status > 0) {
            // 已经改变状态
            return;
        }
        let model = this.model;
        if (model.wait_delayTime > 0) {
            model.wait_delayTime -= dt;
            return;
        }
        if (model.needWait) {
            this.changeStatus(1);
            return;
        }

        if (model.targetPos == null && model.road.length == 0 && !this.sceneModel.isDemo) {
            // 到达被保护对象
            this.finish();
            return;
        }
        if (model.targetId >= 0) {
            // 反击
            let b = model.skills.some(s => {
                if (PveSkillType.isAutoTD(s.type) &&
                    !PveSkillType.isAutoTDSkill(s.type)) {
                    return true;
                }
                return false;
            });
            if (b) {
                let target = this.sceneModel.getFightBy(model.targetId);
                if (target && target.isAlive) {
                    // 反击
                    this.changeStatus(2);
                    return;
                }
            }
            model.targetId = -1;
        }
        let speed = model.speed * model.speedScale;
        if (!this.active) {
            // 当前动作已经无效
            return;
        }
        let node = this.node;
        let ctrl = this.ctrl;
        if (speed > 0 && node) {
            // 更新目标坐标并设置方向
            let to: cc.Vec2 = model.targetPos;
            if (to == null) {
                if (model.road.length == 1 && this.sceneModel.isDemo) {
                    to = model.targetPos = model.road[0]; //删除并返回第一项
                } else {
                    to = model.targetPos = model.road.shift(); //删除并返回第一项
                }

                ctrl.setDir(model.targetPos);
            }
            // 设置动作为行走
            let animStr = PveFightAnmNames.WALK;
            if (this.model.getProp("walk_anim")) {
                animStr = this.model.getProp("walk_anim")
            }
            ctrl.setAnimation(animStr, { mode: 'set' });
            // 移动位置
            let len: number = dt * speed;
            let from: cc.Vec2 = node.getPos();
            let dis: number = MathUtil.distance(from, to);
            let dx: number = (to.x - from.x) / dis * len;
            let dy: number = (to.y - from.y) / dis * len;
            if (abs(to.x - from.x) > ceil(abs(dx)) ||
                abs(to.y - from.y) > ceil(abs(dy))) {
                // 设置单步坐标
                ctrl.setPos(
                    node.x + dx,
                    node.y + dy,
                );
            } else {
                // 到达目标
                ctrl.setPos(to.x, to.y);
                model.targetPos = null;
            }
            model._roadLength = -1;
        } else if (model.speed == 0 && model.animation != PveFightAnmNames.IDLE) {
            // 移速为0的时候播放待机动作
            ctrl.setAnimation(PveFightAnmNames.IDLE, { mode: 'set' });
        }

        // 延迟帧数
        if (this.delay > 0) {
            this.delay -= dt;
            return;
        }

        // 沉默不能使用主动技能
        if (model.getProp('silence')) {
            return;
        }

        // 挑选技能
        let skills = model.skills;
        for (let i = 0, n = skills.length; i < n; i++) {
            let s = skills[i];
            if (PveSkillType.isAutoTDSkill(s.type) && model.canUse(s)) {
                // 技能已冷却，并且为TD类型技能则可以使用
                model.currSkill = s;
                model.targetId = -1;
                if (s.config.type == 2) {
                    let target = PveTool.searchTarget({
                        fight: ctrl,
                        targetType: model.currSkill.targetType,
                        pos: node.getPos(),
                        range: s.config.range,
                    });
                    if (target) {
                        model.oldTargetId = model.targetId;
                        model.targetId = target.model.fightId;
                        // 设置方向和状态
                        ctrl.setDir(target.getPos());
                    }
                } else {
                    model.oldTargetId = model.targetId;
                    model.targetId = model.fightId;
                }
                if (model.targetId != -1) {
                    // 使用技能
                    this.changeStatus(3);
                    return;
                }
            }
        }

        // 重置等待时间
        this.delay = 1 / FightingMath.rnd(2, 5);
    }
}