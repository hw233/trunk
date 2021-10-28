import MathUtil from '../../../../common/utils/MathUtil';
import PanelId from '../../../../configs/ids/PanelId';
import PveBuffModel from '../../model/PveBuffModel';
import PveCalledModel from '../../model/PveCalledModel';
import PveEnemyModel from '../../model/PveEnemyModel';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveHurtableFightCtrl from './PveHurtableFightCtrl';
import PvePool from '../../utils/PvePool';
import PveSkillModel from '../../model/PveSkillModel';
import PveTool from '../../utils/PveTool';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveActionTag } from '../../const/PveActionTag';
import { PveCampType, PveFightType } from '../../core/PveFightModel';
import { PveEnemyDir, PveFightDirName } from '../../const/PveDir';
import { PveFightAnimationOption, PveFightCtrl } from '../../core/PveFightCtrl';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveSkillType } from '../../const/PveSkill';

/**
 * Enemy控制类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-06-10 11:02:48
 */
const { ccclass, property, menu } = cc._decorator;
const abs: Function = Math.abs;
const ceil: Function = Math.ceil;

@ccclass
@menu("qszc/scene/pve/fight/PveEnemyCtrl")
export default class PveEnemyCtrl extends PveHurtableFightCtrl {

    /** 数据 */
    model: PveEnemyModel;
    spine: sp.Skeleton;
    slotDic: { [name: string]: string[] };

    onEnable() {
        this.spine = this.spines[0];
        this.spine.paused = false;
        super.onEnable();
    }

    onDisable() {
        let model = this.model;
        super.onDisable();
        model && PvePool.put(model);
        this.node.stopAllActions();
        this.node.angle = 0;
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        if (!this.isAlive) return;
        // 计算怪物的出身无敌时间
        let model = this.model;
        if (model) {
            if (model.brithTime >= 0) {
                model.brithTime -= dt;
            }
            if (!model.needWait) {
                model.aliveTime += dt;
            }
            if (model.isCallMonster) {
                if (model.callMonsterTime <= 0) {
                    if (model.camp == PveCampType.Enemy) {
                        this.sceneModel.arrivalEnemy++;
                    }
                    model.isCallMonster = false;
                    this.hide()
                } else {
                    model.callMonsterTime -= dt;
                }
            }
            // 传送特定点时间倒计时
            if (model.transTime > 0) {
                model.transTime -= dt;
                if (model.transTime <= 0) {
                    if (model.trans_BeforePos) {
                        this.node.setPosition(model.trans_BeforePos);
                        this.fsm.sendEvent(PveFsmEventId.PVE_FIGHT_END_CUSTOM);
                    }
                }
            }
        }
        super.updateScript(dt);
    }
    // 方向计算
    setDir(to: cc.Vec2) {
        let from: cc.Vec2 = this.getPos();
        if (to.x == from.x && to.y == from.y) {
            // 如果当前坐标与目标坐标相同，则方向不变
            return;
        }
        let dir: number = this.model.dir;
        if (to.x > from.x) {
            dir = to.y > from.y ? PveEnemyDir.UP_RIGHT : PveEnemyDir.DOWN_RIGHT;
        } else {
            dir = to.y > from.y ? PveEnemyDir.UP_LEFT : PveEnemyDir.DOWN_LEFT;
        }
        this.model.dir = dir;
    }

    // 设置动作
    setAnimation(name: string, opt?: PveFightAnimationOption): boolean {
        let ret = super.setAnimation(name, opt);
        if (ret) {
            // 改变动作后，更新隐藏的插槽
            this.updateSlot();
        }
        return ret;
    }

    getAnimation(animation: string, skip: boolean = true): string {
        let model = this.model;
        if (!skip && StringUtils.startsWith(model.skin, 'H_')) {
            // 英雄模型使用默认的动作
            return super.getAnimation(animation);
        }
        // 怪物模型外观设置镜像效果
        let side: string;
        switch (model.dir) {
            case PveEnemyDir.DOWN_LEFT:
                side = PveFightDirName.SIDE;
                break;

            case PveEnemyDir.DOWN_RIGHT:
                side = PveFightDirName.SIDE;
                break;

            case PveEnemyDir.UP_LEFT:
                side = PveFightDirName.SIDE;
                break;

            case PveEnemyDir.UP_RIGHT:
                side = PveFightDirName.SIDE;
                break;

            case PveEnemyDir.UP:
                side = PveFightDirName.SIDE;
                break;

            default:
                if (PveTool.hasSpineAnimation(
                    this.spines[0],
                    animation + '_' + PveFightDirName.DOWN,
                )) {
                    // 如果模型中有向下的动作，则使用向下动作
                    side = PveFightDirName.DOWN;
                } else {
                    // 如果没有向下的面向，则使用侧面代替
                    side = PveFightDirName.SIDE;
                }
                break;
        }
        animation = animation + '_' + side;
        return animation;
    }

    getScale(animation: string): number {
        let scaleX: number = this.spine.node.scaleX > 0 ? 1 : -1;
        switch (this.model.dir) {
            case PveEnemyDir.DOWN_LEFT:
            case PveEnemyDir.UP_LEFT:
                scaleX = -1;
                break;

            case PveEnemyDir.DOWN_RIGHT:
            case PveEnemyDir.UP_RIGHT:
                scaleX = 1;
                break;

            case PveEnemyDir.UP:
                break;

            default:
                if (this.spine &&
                    this.spine.skeletonData &&
                    this.spine.skeletonData.skeletonJson) {
                    // 模型资源已加载
                    let tanm: any = this.spine.skeletonData.skeletonJson.animations;
                    let temp: string = animation + '_' + PveFightDirName.DOWN;
                    if (tanm[temp]) {
                        // 如果模型中有向下的动作，则使用向下动作
                        scaleX = 1;
                    }
                }
                break;
        }
        return scaleX;
    }

    //设置召唤怪物的初始坐标和路径
    setMonsterPosRoad(pos: cc.Vec2, roadIndex: number, i: number, targetPos: cc.Vec2, radius: number): { pos: cc.Vec2, road: cc.Vec2[] } {
        let temPos: cc.Vec2 = null;
        let temRoad: cc.Vec2[] = [];
        let r = this.model.ctrl.sceneModel.tiled.roads[roadIndex];
        //获取目标的在路径的下标
        let c = Number.MAX_VALUE;
        let b = 0;
        for (let i = 0, n = r.length; i < n; i++) {
            let d = MathUtil.distance(targetPos, r[i]);
            if (d < c) {
                c = d;
                b = i;
            }
        }

        let dis = (Math.floor(i / 2) + 1) * radius;
        let lastRoadIndex = 0;
        let lasePos: cc.Vec2 = pos;
        if (i % 2 == 0) {
            let temDis = dis;
            let tPos = pos
            for (let j = b; j < r.length; j++) {
                let temD = MathUtil.distance(tPos, r[j]);
                if (temD >= temDis) {
                    lasePos = tPos.add(r[j].sub(tPos).normalize().mul(temDis));
                    lastRoadIndex = j;
                    break;
                } else {
                    temDis = temDis - temD;
                    tPos = r[j];
                    if (j == r.length - 1) {
                        lasePos = r[r.length - 1].add(r[r.length - 1].sub(r[r.length - 2]).normalize().mul(temDis));
                        lastRoadIndex = r.length - 1;
                        break;
                    }
                }
            }
        } else {
            let temDis = dis;
            let tPos = pos
            for (let j = b - 1; j >= 0; j--) {
                let temD = MathUtil.distance(tPos, r[j]);
                if (temD >= temDis) {
                    let tem = r[j].sub(tPos).normalize().mul(temDis)
                    lasePos = tPos.add(tem);
                    lastRoadIndex = Math.min(j + 1, r.length - 1)
                    break;
                } else {
                    temDis = temDis - temD;
                    tPos = r[j];
                    if (j == 0) {
                        lasePos = r[0].add(r[1].sub(r[0]).normalize().mul(temDis));
                        lastRoadIndex = 1;
                        break;
                    }
                }
            }
        }
        temPos = lasePos;
        // 更新目标路径
        temRoad = r.slice(lastRoadIndex);
        return { pos: temPos, road: temRoad }
    }

    // 一段时间后的坐标
    getPos(dt: number = 0): cc.Vec2 {
        if (dt > 0) {
            let model = this.model;
            let speed: number = model.speed * model.speedScale * this.sceneModel.timeScale;
            if (speed > 0) {
                let to: cc.Vec2 = model.targetPos;
                if (!to) {
                    if (model.road && model.road.length > 0) {
                        to = model.road[0];
                    } else {
                        // 找不到合适的坐标，则用当前坐标
                        return super.getPos(dt);
                    }
                }
                let node: cc.Node = this.node;
                let len: number = dt * speed;
                let from: cc.Vec2 = node.getPos();
                let dis: number = MathUtil.distance(from, to);
                if (dis >= len) {
                    let dx: number = (to.x - from.x) / dis * len;
                    let dy: number = (to.y - from.y) / dis * len;
                    return cc.v2(node.x + dx, node.y + dy);
                } else {
                    let temPos = to;
                    let temDis = len - dis;
                    for (let i = 0; i < model.road.length; i++) {
                        let temd = MathUtil.distance(model.road[i], temPos);
                        if (temd < temDis) {
                            temDis = temDis - temd;
                            temPos = model.road[i];
                            if (i == model.road.length - 1) {
                                return cc.v2(temPos.x, temPos.y)
                            }
                        } else {
                            let dx: number = (model.road[i].x - temPos.x) / temd * temDis;
                            let dy: number = (model.road[i].y - temPos.y) / temd * temDis;
                            return cc.v2(temPos.x + dx, temPos.y + dy);
                        }

                    }
                }
            }
        }
        return super.getPos(dt);
    }

    repel(attacker: PveFightCtrl): void {
        let from: cc.Vec2 = attacker.getPos();
        let to: cc.Vec2 = this.getPos();
        // 计算角度
        let angle: number = Math.atan2(to.y - from.y, to.x - from.x);
        //计算新坐标 r 就是两者的距离
        let pos: cc.Vec2 = cc.v2(
            to.x + 20 * Math.cos(angle),
            to.y + 20 * Math.sin(angle)
        );
        let act: cc.Action = cc.moveTo(0.06, pos).easing(cc.easeOut(3.0));
        act.setTag(PveActionTag.REPEL);
        this.node.stopActionByTag(PveActionTag.REPEL);
        this.node.runAction(act);
        if (this.fsm) {
            this.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_REPEL);
        }
    }

    /**
     * 被攻击时事件接口
     * @param attacker 
     */
    onAttacked(attacker: PveFightCtrl, model: PveSkillModel | PveBuffModel): void {
        super.onAttacked(attacker, model);
        // 忽略BUFF产生的伤害
        if (model instanceof PveBuffModel) return;
        // 非普攻，显示受击动画
        if (!PveSkillType.isNormal(model.config.type) &&
            this.model.animation == PveFightAnmNames.WALK) {
            this.setAnimation(PveFightAnmNames.HIT, {
                loop: false,
                mode: 'set',
                thisArg: this,
                onComplete: () => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.model) return;
                    if (!this.isAlive) return;
                    if (this.model.animation == PveFightAnmNames.HIT) {
                        this.setAnimation(PveFightAnmNames.WALK);
                    }
                },
                after: {
                    name: PveFightAnmNames.WALK,
                    loop: true,
                    mode: "set"
                },
            });
        }
        // 如果当前怪物没有技能，则不会攻击
        let s = this.sceneModel;
        let sm = this.model;
        if (!sm.skillIds || sm.skillIds.length < 1) return;
        // 如果当前有目标，则保持攻击
        let target = s.getFightBy(sm.targetId);
        if (target && target.isAlive) return;
        // 攻击者死亡，则不会攻击
        if (!attacker || !attacker.isAlive) return;
        // 攻击者非守卫、召唤物，则不会攻击
        if (!attacker.model.attackable) return;
        let am = attacker.model;
        // 为当前目标，则直接忽略
        //if (am.fightId == sm.fightId) return;
        //友方的伤害不反击
        if (am.camp == sm.camp) return;
        //怪物免疫拦截
        let immunity_hate = sm.getProp('immunity_hate');
        if (immunity_hate) return;
        // 攻击者仇恨数小于1，或当前仇恨值小于最大仇恨值
        let hate_num = am.getProp('hate_num');
        if (hate_num > 0) {
            let arr = [s.enemies, s.specialEnemies, s.calleds];
            // 查询列表中满足要求的数量
            let c = 0;
            for (let j = 0; j < arr.length; j++) {
                let a: PveFightCtrl[] = arr[j];
                for (let i = 0, n = a.length; i < n; i++) {
                    let t = a[i];
                    if (t && t.isAlive) {
                        if (t.model.camp != am.camp &&
                            t.model.targetId == am.fightId) {
                            // 不同阵营的对象的目标为attacker时，则仇恨值加一
                            c++;
                            if (c >= hate_num) return;
                        }
                    }
                }
            }
        } else {
            return;
        }
        sm.targetId = am.fightId;
        sm.double_hit = 0;

        //特定英雄拦截怪物数量检测
        if (this.sceneModel.gateconditionUtil && this.sceneModel.gateconditionUtil.heroHateMonsterNumLimit.length > 0) {
            this.sceneModel.gateconditionUtil.heroHateMonsterNumLimit.forEach(index => {
                let data = this.sceneModel.gateconditionUtil.DataList[index];
                if (am.type == PveFightType.Hero) {
                    if (am.config.id == data.cfg.data1) {
                        data.curData += 1;
                        data.state = data.curData >= data.cfg.data2;
                    }
                } else if (am.type == PveFightType.Call) {
                    //统计英雄的召唤物拦截的单位
                    let tem = am as PveCalledModel;
                    if (tem.owner &&
                        tem.owner.model.type == PveFightType.Hero &&
                        tem.owner.model.config.id == data.cfg.data1) {
                        data.curData += 1;
                        data.state = data.curData >= data.cfg.data2;
                    }
                }


            })
        }

    }

    // @gdk.binding("model.hp")
    // _setHp(v: number, ov: number, nv: number) {
    //     let np: number = v / this.model.hpMax;
    //     // 丢盔弃甲, 70%
    //     if (np <= 0.7) {
    //         this.hideSlot('hp1');
    //         // 35%
    //         if (np <= 0.35) {
    //             this.hideSlot('hp2');
    //         }
    //     }
    //     // 死亡判定
    //     super._setHp(v, ov, nv);
    // }

    // // 隐藏插槽
    // hideSlot(name: string) {
    //     let d = this.slotDic = this.slotDic || {};
    //     if (d[name]) return;
    //     // 实时模式才支持设置单个骨骼状态
    //     let b = this.spine.isAnimationCached();
    //     let a = d[name] = [];
    //     for (let i = 1; ; i++) {
    //         let n = name + '_' + i;
    //         let s = this.spine.findSlot(n);
    //         if (!s) break;
    //         b && this.spine.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
    //         s.attachment = null;
    //         s.color.a = 0;
    //         a.push(n);
    //     }
    // }

    // 更新插槽
    updateSlot() {
        let d = this.slotDic;
        if (!d) return;
        let ns = Object.keys(d);
        ns.forEach(name => {
            let a = d[name];
            a && a.forEach(n => {
                let s = this.spine.findSlot(n);
                if (s) {
                    s.attachment = null;
                    s.color.a = 0;
                }
            });
        });
    }

    showEnemyInfo() {
        //cc.log('显示怪物的信息----------------->' + this.model.config.name + '-----hp:' + this.model.hp + '/' + this.model.hpMax)
        if (!this.isAlive) return;
        if (!this.sceneModel.isDemo) {
            let model = this.model;
            // 如果存在点击触发技能，则检查是否可以触发
            let skills = model.skills;
            for (let i = 0, n = skills.length; i < n; i++) {
                let s = skills[i];
                if (PveSkillType.isClick(s.type)) {
                    if (model.canUse(s)) {
                        // 创建并使用技能攻击
                        let sm = this.sceneModel;
                        let m = PvePool.get(PveSkillModel);
                        m.option.onComplete = null;
                        m.option.thisArg = null;
                        m.config = s.prop;
                        m.attacker = this;
                        m.addTarget(this);
                        PveTool.useSkill(m, sm);
                        model.useSkill(s);
                    }
                    return;
                }
            }
            gdk.panel.setArgs(PanelId.PveEnemyFightInfo, model);
            gdk.panel.open(PanelId.PveEnemyFightInfo);
        }

    }
}