import ConfigManager from '../../../../common/managers/ConfigManager';
import MathUtil from '../../../../common/utils/MathUtil';
import PveFightSearchAction from '../base/PveFightSearchAction';
import PveFsmEventId from '../../enum/PveFsmEventId';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveCampType, PveMoveableFightModel } from '../../core/PveFightModel';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveSoldierDir } from '../../const/PveDir';
import { Skill_target_typeCfg } from '../../../../a/config';

/**
 * Pve守卫寻找目标动作
 * @Author: sthoo.huang
 * @Date: 2019-05-16 16:29:06
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-24 15:26:13
 */
const abs = Math.abs;
const ceil = Math.ceil;

@gdk.fsm.action("PveGuardSearchAction", "Pve/Guard")
export class PveGuardSearchAction extends PveFightSearchAction {

    standTime: number;  // 站立冷却，如果不能攻击超过此时间才会返回起点
    animation: string;
    roadPos: cc.Vec2;
    first: boolean = false; // 守卫首次不需要刷新待机时间

    onEnter() {
        super.onEnter();
        this.roadPos = null;
        if (this.model) {
            this.standTime = 2;
            this.first = true;
            this.setAnimation(PveFightAnmNames.IDLE);
            this.searchRoldPos();
        }
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let sceneModel = this.sceneModel;
        if (sceneModel.time < sceneModel.config.waitTime) return;
        // 延迟帧数
        if (this.delay > 0) {
            this.delay -= dt;
            return;
        }
        // 攻速为0则不攻击
        let model: PveMoveableFightModel = this.model as any;
        let scale: number = model.speedScale;
        if (scale <= 0) {
            return;
        }
        // 查找合适的技能及对应的目标
        if (sceneModel.isLogicalFrame) {
            this.searchSkill();
            if (model.currSkill) {
                this.attack(false);
                if (!this.active) return;
            }
        }
        // 站立计算
        let target = sceneModel.getFightBy(model.targetId);
        let from: cc.Vec2 = this.node.getPos();
        let to: cc.Vec2 = target ? target.getPos() : this.searchRoldPos();
        // 计算动作
        if (!target) {
            // 没有目标，则站立
            this.standTime -= dt * scale;
            if (this.standTime > 0) {
                // 站立没有超时, 则原地待命
                this.setAnimation(PveFightAnmNames.IDLE);
                if (this.first) {
                    this.resetDelay();
                }
                return;
            }
        } else {
            // 还原冷却
            this.standTime = 2;
            this.first = true;
        }
        // 计算方向
        this.ctrl.setDir(to);
        // 计算速度
        let dis: number = MathUtil.distance(from, to);
        if (!model.currSkill || !target || dis > model.atkDis) {
            // 不能攻击或者在攻击距离之外
            if (dis > 0 && (!target || dis > model.atkDis)) {
                let tm: number = dt * model.speed * scale;
                let dx: number = (to.x - from.x) / dis * tm;
                let dy: number = (to.y - from.y) / dis * tm;
                if (abs(to.x - this.node.x) > ceil(abs(dx)) ||
                    abs(to.y - this.node.y) > ceil(abs(dy))) {
                    // 前进一步
                    this.ctrl.setPos(
                        this.node.x + dx,
                        this.node.y + dy,
                    );
                    this.setAnimation(PveFightAnmNames.WALK);
                } else {
                    // 到达目标
                    this.ctrl.setPos(to.x, to.y);
                    this.resetDelay();
                    this.first = true;
                    this.setAnimation(PveFightAnmNames.IDLE);
                }
            }
        } else {
            // 在攻击距离之内，则开始攻击
            this.setAnimation(PveFightAnmNames.IDLE);
            this.sendEvent(PveFsmEventId.PVE_FIGHT_ATTACK);
        }
    }

    searchRoldPos(): cc.Vec2 {
        if (this.roadPos) {
            return this.roadPos;
        }
        let model: PveMoveableFightModel = this.model as any
        let pos: cc.Vec2 = model.orignalPos;
        this.roadPos = pos;
        return pos;
    }

    // 寻找目标
    searchTarget(): boolean {
        let model: PveMoveableFightModel = this.model as any;
        let pos: cc.Vec2 = model.ownerPos;
        // if (model.type == PveFightType.Call) {
        //     let temMoodel = model as PveCalledModel;
        //     if (temMoodel.owner.model.type == PveFightType.Soldier) {
        //         pos = (temMoodel.owner.model as PveSoldierModel).hero.getPos();
        //     }
        // }
        let range = model.ownerRange;
        let disTarget = 0; //记录超出距离的敌人
        // 当前目标是否已失效
        let sceneModel = this.sceneModel;
        let target = sceneModel.getFightBy(model.targetId);
        if (target) {
            if (!target.isAlive) {
                // 目标已死
                model.targetId = -1;
                target = null;
            } else if (MathUtil.distance(target.getPos(), pos) > range + model.currSkill.range) {
                // 目标已经离开可攻击区域
                disTarget = model.targetId;
                model.targetId = -1;
                target = null;
            } else if (target.model.getProp('invisible')) {
                // 目标不可被锁定了
                disTarget = model.targetId;
                model.targetId = -1;
                target = null;
            } else if (target.model.getProp('invisible_enemy') && this.model.camp != target.model.camp) {
                // 敌对目标不可被锁定了
                disTarget = model.targetId;
                model.targetId = -1;
                target = null;
            }
        }
        // 排除其他可攻击小兵（守卫）的目标, [fightId] = true;
        let excludeIdx: any = {};
        if (model.camp == PveCampType.Friend) {
            for (let i = 0, n = sceneModel.soldiers.length; i < n; i++) {
                let s = sceneModel.soldiers[i];
                if (s === this.ctrl || !s.isAlive) continue;
                let m = s.model;
                if (m.targetId < 0 || !m.attackable) continue;
                let t = sceneModel.getFightBy(m.targetId);
                if (t && t.isAlive && t.model.targetId != model.fightId) {
                    // 此对象的目标不为我, 添加到排除列表
                    excludeIdx[m.targetId] = true;
                }
            }
        }
        // 寻找新的目标，无目标或目标为其他小兵（守卫）的目标
        if (!target || excludeIdx[target.model.fightId]) {
            let cfg = ConfigManager.getItemById(Skill_target_typeCfg, model.currSkill.targetType);
            let all = sceneModel.fightSelector.getAllFights(this.ctrl, cfg, sceneModel, null, pos, range);
            if (all && all.length > 0) {
                // 查找跟自己坐标相关的目标
                all = sceneModel.fightSelector.circleSelect(all, this.ctrl.getPos(), cfg.priority_type, 999, 999, true);
                if (all && all.length > 0) {
                    // 如果当前有目标，则添加到最高优化位置
                    if (target) {
                        let index: number = all.indexOf(target);
                        if (index >= 0) {
                            all.splice(index, 1);
                        }
                        all.unshift(target);
                    } else {
                        // 如果当前没有目标，则把目标的目标为我的提到最高优先级
                        for (let i = 0, n = all.length; i < n; i++) {
                            let t = all[i];
                            if (t.model.targetId == model.fightId) {
                                all.splice(i, 1);
                                all.unshift(t);
                                break;
                            }
                        }
                    }
                    // 排除其他同阵营可攻击召唤物的目标
                    for (let i = 0, n = sceneModel.calleds.length; i < n; i++) {
                        let c = sceneModel.calleds[i];
                        if (!c.isAlive || c === this.ctrl) continue;
                        let m = c.model;
                        if (m.camp != model.camp) continue;
                        if (m.targetId < 0 || !m.attackable) continue;
                        let t = sceneModel.getFightBy(m.targetId);
                        if (t && t.isAlive && t.model.targetId != model.fightId) {
                            // 此对象的目标不为我, 添加到排除列表
                            excludeIdx[m.targetId] = true;
                        }
                    }
                    // 选择排除后最高优先级的目标
                    for (let i = 0, n = all.length; i < n; i++) {
                        let t = all[i];
                        if (!excludeIdx[t.model.fightId]) {
                            target = t;
                            break;
                        }
                    }
                    // 排除其他小兵的目标后，无合适的目标，则直接选中第一个
                    if (!target) {
                        target = all[0];
                    }
                }
            }
        }
        this.isTargetChanged = false;
        if (target) {
            let targetId = target.model.fightId;
            if (targetId != model.targetId) {
                model.targetId = targetId;
                this.isTargetChanged = true;
            } else if (target.model.targetId == -1) {
                let hate_num = model.getProp('hate_num');
                if (hate_num > 0) {
                    this.isTargetChanged = true;
                }
            }
            return true;
        }
        // 清除当前目标
        model.targetId = -1;
        this.isTargetChanged = true;
        return false;
    }

    setAnimation(v: PveFightAnmNames) {
        if (this.model.dir == PveSoldierDir.None) this.model.dir = PveSoldierDir.DOWN_LEFT
        let anm: string = StringUtils.format("{0}_{1}", v, this.model.dir);
        if (anm == this.animation) return;
        this.animation = anm;
        this.ctrl.setAnimation(v, { mode: 'set' });
    }

    setAnimatimeName(name: string, jump: boolean = false) {
        if (name == this.animation) return;
        this.animation = name;
        if (jump) {
            this.ctrl.setAnimation(name, {
                mode: 'set',
                onComplete: () => {
                    this.setAnimation(PveFightAnmNames.IDLE)
                }
            })
        } else {
            this.ctrl.setAnimation(name, { mode: 'set' });
        }

    }

    onExit() {
        this.ctrl.removePrePos();
        this.animation = null;
        super.onExit();
    }
}