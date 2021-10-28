import ConfigManager from '../../../../common/managers/ConfigManager';
import MathUtil from '../../../../common/utils/MathUtil';
import PveFightSearchAction from '../base/PveFightSearchAction';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveGeneralModel from '../../model/PveGeneralModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { Skill_target_typeCfg } from '../../../../a/config';

/**
 * Pve指挥官寻找目标动作
 * @Author: sthoo.huang
 * @Date: 2019-05-16 16:29:06
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-30 18:43:33
 */
const abs = Math.abs;
const ceil = Math.ceil;

@gdk.fsm.action("PveGeneralSearchAction", "Pve/General")
export class PveGeneralSearchAction extends PveFightSearchAction {

    model: PveGeneralModel;
    animation: string;

    onEnter() {
        super.onEnter();
        this.setAnimation(PveFightAnmNames.IDLE, 'add');
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        // 速度为0，并且不在原位，则返回待机状态
        let model = this.model;
        let speed = model.speed;
        if (speed <= 0) {
            if (!this.node.getPos().equals(model.orignalPos)) {
                this.finish();
                return;
            }
        }
        // 延迟帧数
        if (this.delay > 0) {
            this.delay -= dt;
            return;
        }
        // 攻速为0则不攻击
        let scale: number = this.model.speedScale;
        if (scale <= 0) {
            return;
        }
        // 查找合适的技能及对应的目标
        if (this.sceneModel.isLogicalFrame) {
            this.searchSkill();
            if (model.currSkill) {
                this.attack(false);
                if (!this.active) return;
            }
        }
        // 站立计算
        let target = this.sceneModel.getFightBy(model.targetId);
        if (!target) {
            // 没有目标，则站立原地待命
            this.setAnimation(PveFightAnmNames.IDLE);
            this.resetDelay();
            return;
        }
        // 计算方向
        let from: cc.Vec2 = this.node.getPos();
        let to: cc.Vec2 = target.getPos();
        this.ctrl.setDir(to);
        // 计算速度
        let dis: number = MathUtil.distance(from, to);
        if (!model.currSkill || !target || dis > model.atkDis) {
            // 不能攻击或者在攻击距离之外
            if (dis > 0 && speed > 0 && (!target || dis > model.atkDis)) {
                let tm: number = dt * speed * scale;
                let dx: number = (to.x - from.x) / dis * tm;
                let dy: number = (to.y - from.y) / dis * tm;
                if (abs(to.x - from.x) > ceil(abs(dx)) ||
                    abs(to.y - from.y) > ceil(abs(dy))) {
                    // this.node.setPosition(
                    //     this.node.x + dx,
                    //     this.node.y + dy,
                    // );
                    this.ctrl.setPos(
                        this.node.x + dx,
                        this.node.y + dy,
                    );
                    this.setAnimation(PveFightAnmNames.WALK);
                } else {
                    // this.node.setPosition(to);
                    this.ctrl.setPos(to.x, to.y);
                    this.setAnimation(PveFightAnmNames.IDLE);
                    this.resetDelay();
                }
            } else {
                this.setAnimation(PveFightAnmNames.IDLE);
                this.resetDelay();
            }
        } else {
            // 在攻击距离之内，则开始攻击
            this.sendEvent(PveFsmEventId.PVE_FIGHT_ATTACK);
        }
    }

    // 寻找目标
    searchTarget(): boolean {
        let model: PveGeneralModel = this.model as PveGeneralModel;
        let target: PveFightCtrl = this.sceneModel.getFightBy(model.targetId);
        let range: number = model.getProp('range');
        let pos: cc.Vec2 = this.ctrl.getPos();
        // 当前目标是否已失效
        if (target) {
            if (!target.isAlive) {
                // 目标已死
                model.targetId = -1;
                target = null;
            } else if (MathUtil.distance(target.getPos(), pos) > range) {
                // 目标已经离开可攻击区域
                model.targetId = -1;
                target = null;
            } else if (target.model.getProp('invisible')) {
                // 目标不可被锁定了
                model.targetId = -1;
                target = null;
            } else if (target.model.getProp('invisible_enemy') && this.model.camp != target.model.camp) {
                // 敌对目标不可被锁定了
                model.targetId = -1;
                target = null;
            }
        }
        // 寻找新的目标
        if (!target && model.currSkill) {
            let c: Skill_target_typeCfg = ConfigManager.getItemById(Skill_target_typeCfg, model.currSkill.targetType);
            let all: PveFightCtrl[] = this.sceneModel.fightSelector.getAllFights(this.ctrl, c, this.sceneModel, null, pos, range);
            if (all && all.length > 0) {
                // 查找跟自己坐标相关的目标
                all = this.sceneModel.fightSelector.circleSelect(all, pos, c.priority_type, 999, 1);
                if (all && all.length > 0) {
                    target = all[0];
                }
            }
        }
        this.isTargetChanged = false;
        if (target) {
            if (target.model.fightId != model.targetId) {
                model.targetId = target.model.fightId;
                this.isTargetChanged = true;
            }
            return true;
        }
        // 清除当前目标
        model.targetId = -1;
        this.isTargetChanged = true;
        return false;
    }

    setAnimation(v: PveFightAnmNames, mode: 'set' | 'add' = 'set') {
        let anm: string = StringUtils.format("{0}_{1}", v, this.model.dir);
        if (anm == this.animation) return;
        this.animation = anm;
        this.ctrl.setAnimation(v, { mode: mode });
    }

    onExit() {
        this.ctrl.removePrePos();
        this.animation = null;
        super.onExit();
    }
}