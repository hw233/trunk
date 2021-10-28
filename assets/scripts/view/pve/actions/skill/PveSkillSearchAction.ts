import PveFsmEventId from '../../enum/PveFsmEventId';
import PvePool from '../../utils/PvePool';
import PveRes from '../../const/PveRes';
import PveSceneModel from '../../model/PveSceneModel';
import PveSkillBaseAction from '../base/PveSkillBaseAction';
import PveTool from '../../utils/PveTool';
import StringUtils from '../../../../common/utils/StringUtils';
import { CopyType } from '../../../../common/models/CopyModel';
import { PveCampType } from '../../core/PveFightModel';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import {
    PveIgnoreType,
    PveSkillType,
    PveTargetType,
    PveTrackType
    } from '../../const/PveSkill';

/**
 * Pve技能寻找目标动作
 * @Author: sthoo.huang
 * @Date: 2019-04-30 11:35:35
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-17 11:10:29
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSkillSearchAction", "Pve/Skill")
export default class PveSkillSearchAction extends PveSkillBaseAction {

    @property({ displayName: "Update Position", tooltip: "是否更新目标坐标" })
    updateTargetPos: boolean = true;

    clearTarget: boolean;   // 是否清除原有目标
    multiple: boolean;   // 是否每个目标创建一个动画效果
    targetType: PveTargetType;   // 技能特效播放位置目标类型
    ignoreType: PveIgnoreType;    // 忽略哪些已伤害过的目标对象

    onEnter() {
        super.onEnter();

        // 从外部配置计算属性
        let model = this.model;
        let et = model.effectType;
        this.multiple = et.multiple_effect;
        this.ignoreType = et.ignore_type;
        this.targetType = et.from_pos_type;
        this.clearTarget = et.search_after_dmg;
        this.updateTargetPos = true;
        // 施法者已死，则直接销毁技能
        if (!model.attacker || !model.attacker.isAlive) {
            this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
            return;
        }



        if (et.to_pos_type == PveTargetType.TargetFirstPos) {
            model.targetFirstPos = model.targetPos
        }
        // 是否以施法者坐标播放特效，只针对无弹道类型技能
        if (et.track_type == PveTrackType.None) {
            let b: boolean = false;
            switch (this.targetType) {
                case PveTargetType.AttackerCenter:
                    // 施法者中心坐标
                    model.targetPos = model.attacker.getPos().clone();
                    model.targetRect = model.attacker.getRect();
                    b = true;
                    break;

                case PveTargetType.AttackerStand:
                    // 施法者中心坐标
                    model.targetPos = model.attacker.getPos().clone();
                    model.targetRect = null;
                    b = true;
                    break;

                case PveTargetType.TargetFirstPos:
                    this.updateTargetPos = false;
                    //技能在发现位置释放时，应该清除目标，重新选择目标
                    model.selectedTargets.length = 0;
                    break;
            }
            if (b) {
                this.multiple = false; // 互斥
                this.updateTargetPos = false; // 互斥
            }
        }

        // 清理原有目标
        let s: PveSceneModel = this.ctrl.sceneModel;
        let arr: number[] = model.selectedTargets;
        let targets: PveFightCtrl[] = [];
        if (this.clearTarget) {
            // 移除所有目标，并清理技能特效事件
            if (model.damageCount != 0) {
                arr.length = 0;
                this.spines.length = 0;
            }
            // 清理目标时不需要更新当前位置
            this.updateTargetPos = false;
        }

        //实战演练怪物技能次数监听
        if ((s.stageConfig.copy_id == CopyType.RookieCup || s.stageConfig.copy_id == CopyType.EndRuin) && model.damageCount == 0) {
            if (s.gateconditionUtil && s.gateconditionUtil.monsterUseSkillLimit.length > 0) {
                s.gateconditionUtil.monsterUseSkillLimit.forEach(index => {
                    let data = s.gateconditionUtil.DataList[index];
                    if (data.cfg.data1 == model.attacker.model.config.id && data.cfg.data2 == model.config.skill_id) {
                        data.curData += 1;
                        data.state = data.curData <= data.cfg.data3;
                    }
                })
            }
        }

        // 移除空值或死亡对象
        for (let i = arr.length - 1; i >= 0; i--) {
            let t = s.getFightBy(arr[i]);
            if (!t || !t.isAlive) {
                arr.splice(i, 1);
            } else {
                targets.push(t);
            }
        }

        // 目标全部死亡，则不更新坐标
        if (arr.length == 0) {
            this.updateTargetPos = false;
        }

        // 选择更多的目标
        let num: number = model.targetNum;
        let addtarget = false;
        if (this.multiple && model.effectType.search_after_dmg && model.config.dmg_mul > 1 && num == 1) {
            // 多特效，单个目标时
            num = model.config.dmg_mul;
            addtarget = true;
        }
        if (num > arr.length) {
            if (arr.length > 0 && this.updateTargetPos) {
                let t = s.getFightBy(arr[0]);
                model.targetPos = t.getPos().clone();
            }
            let pos: cc.Vec2 = model.attacker.model.getProp('attackPos') == true ? model.attacker.getPos() : model.targetPos;
            // 目标排除
            let ex: PveFightCtrl[];
            let en = model.damagedList.length;
            switch (this.ignoreType) {
                case PveIgnoreType.AllDamaged:
                    // 排除所有已受到过此技能攻击的目标
                    if (en > 0) {
                        ex = [];
                        for (let i = 0; i < en; i++) {
                            let c = s.getFightBy(model.damagedList[i]);
                            if (c) {
                                ex.push(c);
                            }
                        }
                    }
                    break;

                case PveIgnoreType.LastDamaged:
                    // 排除最后一个受到攻击的目标
                    if (en > 0) {
                        let c = s.getFightBy(model.damagedList[en - 1]);
                        if (c) {
                            ex = [c];
                        }
                    }
                    break;

                case PveIgnoreType.None:
                default:
                    break;
            }
            targets = PveTool.searchMoreTarget({
                fight: model.attacker,
                targetType: model.config.target_type,
                pos: pos,
                range: model.dmgRange,
                num: num,
                targets: targets,
                excludes: ex,
                priority: en > 0,
            });
            model.selectedTargets.length = 0;
            if (targets && targets.length) {
                targets.forEach(t => arr.push(t.model.fightId));
            }
        }

        // 多特效，单个目标,目标数量不够时填充第一个目标
        if (addtarget && arr.length < num) {
            let tem = num - arr.length;
            for (let i = 0; i < tem; i++) {
                arr.push(arr[0])
            }
        }
        // 跳过第一次寻敌
        if (model.dmgMul > 0
            && model.damageCount == 0
            && this.targetType == PveTargetType.Current
            && et.search_after_dmg
            && et.store_pos) {
            model.targetPos = model.attacker.getPos().clone();
            model.targetRect = model.attacker.getRect();
        }

        // 有目标或多目标伤害技能或召唤技能（对坐标有效）为手动施放技能，则创建效果spine
        let b: boolean = PveSkillType.isManualTD(model.config.type);
        let l: number = arr.length;
        if (b || model.config.target_num > 1 || model.config.call_id > 0 || l > 0) {
            // 更新坐标
            if (!b && l > 0 && this.updateTargetPos && model.targetPos && model.targetRect) {
                let t = s.getFightBy(arr[0]);
                model.targetPos = t.getPos().clone();
                model.targetRect = t.getRect();
            }
            // 创建特效spine
            let url: string = StringUtils.format(PveRes.PVE_SKILL_RES, model.config.effect_res);
            let res: sp.SkeletonData = gdk.rm.getResByUrl(url, sp.SkeletonData);
            let n: number = 1;
            if (this.multiple) {
                // 同时多个特效
                if (model.dmgMul > 1) {
                    // 多段伤害
                    n = model.dmgMul;
                } else {
                    // 对多个目标产生效果，并且每个对象都需要生成单独的特效
                    n = l;
                }
            }
            let p: cc.Vec2 = PveTool.getCenterPos(model.targetPos, model.targetRect);
            for (let i = 0; i < n; i++) {
                let node: cc.Node = PvePool.get(s.ctrl.spineNodePrefab);
                let spine: sp.Skeleton = node.getComponent(sp.Skeleton);
                spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
                spine.enableBatch = false;
                spine.skeletonData = res;
                spine.paused = true;
                spine.node.active = false;
                spine.node.setPosition(p);
                this.ctrl.addSpine(spine);
            }
            // 画范围圈
            if (CC_TEST) {
                if (!this.clearTarget &&
                    model.attacker.model.camp == PveCampType.Friend &&
                    model.targetNum > 1 &&
                    model.dmgRange > 0) {
                    // 非弹射，施法者为友军，多目标，有范围
                    let n: cc.Node = model.graphicNode;
                    if (!n) {
                        n = model.graphicNode = PvePool.get(cc.Node);
                    }
                    let g: cc.Graphics = n.getComponent(cc.Graphics);
                    if (!g) {
                        g = n.addComponent(cc.Graphics);
                    }
                    g.clear();
                    g.lineWidth = 2;
                    g.strokeColor = cc.color(20, 200, 200, 190);
                    g.circle(0, 0, this.model.dmgRange);
                    g.stroke();
                    n.setPosition(model.targetPos);
                    s.ctrl.floor.addChild(n);
                }
            }
            // 完成动作
            model.multiple = this.multiple;
            this.finish();
        } else {
            // 目标已全部无效，则直接销毁
            this.broadcastEvent(PveFsmEventId.PVE_SKILL_ANIM_COMPLETE);
        }
    }

    finish() {
        switch (this.model.effectType.track_type) {
            case PveTrackType.None:
                // 无弹道
                this.fsm.sendEvent(PveFsmEventId.PVE_SKILL_INSTANT);
                break;

            case PveTrackType.Linear:
                // 直线弹道
                this.fsm.sendEvent(PveFsmEventId.PVE_SKILL_LINEAR);
                break;

            case PveTrackType.Bezier:
                // 抛物线弹道
                this.fsm.sendEvent(PveFsmEventId.PVE_SKILL_BEZIER);
                break;

            case PveTrackType.LinearTrap:
                // 直线陷阱
                this.fsm.sendEvent(PveFsmEventId.PVE_SKILL_LINEAR_TRAP);
                break;

            case PveTrackType.LinearDrag:
                // 直线拖拽
                this.fsm.sendEvent(PveFsmEventId.PVE_SKILL_LINEAR_DRAG);
                break;

            case PveTrackType.LinkDrag:
                // 直线拖拽
                this.fsm.sendEvent(PveFsmEventId.PVE_SKILL_LINKDRAG);
                break;

            case PveTrackType.LinDanBezier:
                // 林丹抛物线弹道
                this.fsm.sendEvent(PveFsmEventId.PVE_SKILL_LINDANBEZIER);
                break;

            default:
                super.finish();
        }
    }
}