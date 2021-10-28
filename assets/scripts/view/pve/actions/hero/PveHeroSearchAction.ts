import { Skill_target_typeCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import MathUtil from '../../../../common/utils/MathUtil';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import PveHeroCtrl from '../../ctrl/fight/PveHeroCtrl';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveHeroModel from '../../model/PveHeroModel';
import PveTool from '../../utils/PveTool';
import PveFightSearchAction from '../base/PveFightSearchAction';

/**
 * Pve英雄寻怪动作
 * @Author: sthoo.huang
 * @Date: 2019-03-29 17:07:47
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-07 17:41:48
 */
const abs = Math.abs;
const ceil = Math.ceil;

@gdk.fsm.action("PveHeroSearchAction", "Pve/Hero")
export default class PveHeroSearchAction extends PveFightSearchAction {

    model: PveHeroModel;
    ctrl: PveHeroCtrl;
    animation: string;
    standTime: number;  // 站立冷却，如果不能攻击超过此时间才会返回起点
    first: boolean = false; // 守卫首次不需要刷新待机时间
    isGuard: boolean = false;    // 是否为守卫英雄

    inMove: boolean = false;
    onEnter() {
        super.onEnter();
        this.isGuard = this.model.soldierType == 4 && !this.sceneModel.isDemo;
        if (this.isGuard) {
            this.model.orignalPos = null;
            this.standTime = 2;
            this.first = false;
            this.searchRoldPos();
        }
        this.setAnimation(PveFightAnmNames.IDLE, 'add');
        this.inMove = false;
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
        if (this.model.speedScale <= 0) {
            return;
        }
        // 守卫英雄每帧调用
        if (this.isGuard) {
            this.guardUpdateScript(dt);
            return;
        }
        // 查找技能和目标
        if (this.sceneModel.isLogicalFrame) {
            this.searchSkill();
            if (this.model.currSkill) {
                // 技能和目标有效，则开始攻击
                this.ctrl.switchRecoverHp(false);
                this.setAnimation(PveFightAnmNames.IDLE);
                this.attack();
                if (!this.active) return;
            }
            // 没有合适的技能和目标，则开启恢复
            this.resetDelay();
            this.ctrl.switchRecoverHp(true);
            //检测英雄是否在原位置
            let model = this.model
            if (model.speed <= 0) {
                let node = this.node;
                if (!node.getPos().equals(model.orignalPos)) {
                    node.setPosition(model.orignalPos);
                }
            }
        }
    }

    // 守卫英雄每帧调用，替换update方法，为了保持调用顺序
    guardUpdateScript(dt: number) {
        let model = this.model;
        // 查找合适的技能及对应的目标
        if (this.sceneModel.isLogicalFrame) {
            this.searchSkill();
            if (model.currSkill && !this.inMove) {
                this.attack(false);
                if (!this.active) return;
            }
        }
        // 计算动作
        let target = model.targetId > 0 ? this.sceneModel.getFightBy(model.targetId) : null;
        if (!target) {
            // 没有目标，则站立
            this.standTime -= dt * model.speedScale;
            if (this.standTime > 0) {
                // 站立没有超时, 则原地待命
                this.setAnimation(PveFightAnmNames.IDLE);
                if (this.first) {
                    this.resetDelay();
                }
                return;
            }
            this.ctrl.switchRecoverHp(true);
        } else {
            // 还原冷却
            this.standTime = 2;
            this.first = true;
        }
        // 计算方向
        let to: cc.Vec2 = target ? target.getPos() : this.searchRoldPos();
        this.ctrl.setDir(to);
        // 计算速度
        let from: cc.Vec2 = this.node.getPos();
        let dis: number = MathUtil.distance(from, to);
        if (!model.currSkill || !target || dis > model.atkDis) {
            // 不能攻击或者在攻击距离之外
            if (dis > 0 && (!target || dis > model.atkDis)) {
                this.inMove = true;
                let tm: number = dt * model.speed * model.speedScale;
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
                    this.inMove = false;
                    this.ctrl.setPos(to.x, to.y);
                    this.resetDelay();
                    this.first = true;
                    this.setAnimation(PveFightAnmNames.IDLE);
                }
            }
        } else {
            // 在攻击距离之内，则开始攻击
            this.inMove = false;
            this.ctrl.switchRecoverHp(false);
            this.setAnimation(PveFightAnmNames.IDLE);
            this.sendEvent(PveFsmEventId.PVE_FIGHT_ATTACK);
        }
    }

    // 走到刷怪路径上
    searchRoldPos(): cc.Vec2 {
        let model = this.model;
        if (model.orignalPos) {
            return model.orignalPos;
        }
        let pos = model.ctrl.getTowerPos();
        if (this.isGuard) {
            let minPos = pos;
            let dis = Number.MAX_VALUE;
            let roads = this.sceneModel.tiled.roads;
            for (let key in roads) {
                let r = roads[key];
                for (let i = 0, n = r.length; i < n; i++) {
                    let t = MathUtil.distance(pos, r[i])
                    if (dis > t) {
                        dis = t;
                        minPos = r[i];
                    }
                }
            }
            pos = cc.v2(minPos.x, minPos.y);
        }
        model.orignalPos = pos;
        return pos;
    }

    // 寻找目标
    searchTarget(): boolean {
        if (this.isGuard) {
            // 守卫英雄寻找目标
            return this.guardSearchTarget();
        }
        let model: PveHeroModel = this.model;
        let target: PveFightCtrl = PveTool.searchTarget({
            fight: this.ctrl,
            targetType: model.currSkill.targetType,
            pos: this.ctrl.getPos(),
            range: this.sceneModel.isDemo ? model.atkDis * 2 : model.atkDis,
        });
        this.isTargetChanged = false;
        if (target) {
            if (target.model.fightId != model.targetId) {
                model.targetId = target.model.fightId;
                this.isTargetChanged = true;
            }
            this.ctrl.setDir(target.getPos());
            return true;
        }
        // 清除当前目标
        model.targetId = -1;
        this.isTargetChanged = true;
        //不是脱战状态时，进入脱战状态
        if (!model.ctrl.offBattleState) {
            model.ctrl.offBattleState = true;
            model.ctrl.OffBattleTime = 0;
        }
        return false;
    }

    // 寻找目标
    guardSearchTarget(): boolean {
        let model = this.model;
        let sceneModel = this.sceneModel;
        let target = model.targetId > 0 ? sceneModel.getFightBy(model.targetId) : null;
        let range = Math.max(model.range, model.currSkill.range) * (sceneModel.isDemo ? 2 : 1);
        let pos = this.ctrl.getTowerPos();
        // 当前目标是否已失效
        if (target) {
            if (!target.isAlive) {
                // 目标已死
                model.targetId = -1;
                target = null;
                this.inMove = false;
            } else if (MathUtil.distance(target.getPos(), pos) > range + model.currSkill.range) {
                // 目标已经离开可攻击区域
                model.targetId = -1;
                target = null;
                this.inMove = false;
            } else {
                let tm = target.model;
                if (tm.getProp('invisible')) {
                    // 目标不可被锁定了
                    model.targetId = -1;
                    target = null;
                    this.inMove = false;
                } else if (tm.getProp('invisible_enemy') && model.camp != tm.camp) {
                    // 敌对目标不可被锁定了
                    model.targetId = -1;
                    target = null;
                    this.inMove = false;
                } else {
                    // 目标不适合当前技能
                    let cfg = ConfigManager.getItemById(Skill_target_typeCfg, model.currSkill.targetType);
                    if (!sceneModel.fightSelector.validateFight(this.ctrl, target, cfg)) {
                        model.targetId = -1;
                        target = null;
                        this.inMove = false;
                    }
                }
            }
        }
        // 排除其他可攻击守卫英雄的目标, [fightId] = true;
        let excludeIdx: any = {};
        for (let i = 0, n = sceneModel.heros.length; i < n; i++) {
            let s = sceneModel.heros[i];
            if (s === this.ctrl || !s.isAlive) continue;
            let m = s.model;
            if (m.targetId < 0 || !m.attackable) continue;
            let t = sceneModel.getFightBy(m.targetId);
            if (t && t.isAlive && t.model.targetId != model.fightId) {
                // 此对象的目标不为我, 添加到排除列表
                excludeIdx[m.targetId] = true;
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
                        if (!c.isAlive) continue;
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
                    // 排除后，无合适的目标，则直接选中第一个
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
                if (target.model.camp != model.camp) {
                    model.soldiers.forEach(s => {
                        if (s.isAlive) {
                            s.model.targetId = targetId;
                        }
                    });
                }
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
        model.soldiers.forEach(s => {
            if (s.isAlive) {
                s.model.targetId = -1;
            }
        });
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