import PveBuffModel from '../../model/PveBuffModel';
import PveCalledModel from '../../model/PveCalledModel';
import PveEnemyCtrl from './PveEnemyCtrl';
import PveHeroCtrl from './PveHeroCtrl';
import PveHurtableFightCtrl from './PveHurtableFightCtrl';
import PvePool from '../../utils/PvePool';
import PveSkillModel from '../../model/PveSkillModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveFightCtrl } from '../../core/PveFightCtrl';
/** 
 * Pve召唤物控制类
 * @Author: sthoo.huang   
 * @Date: 2019-05-28 14:35:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-29 20:54:21
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/fight/PveCalledCtrl")
export default class PveCalledCtrl extends PveHurtableFightCtrl {

    /** 数据 */
    model: PveCalledModel;
    spine: sp.Skeleton;

    checkTime: number = 1;
    isfight: boolean = false;
    fightTime: number = 0;

    onEnable() {
        this.spine = this.spines[0];
        this.spine.paused = false;
        super.onEnable();
    }

    onDisable() {
        let model = this.model;
        super.onDisable();
        model && PvePool.put(model);
    }

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number) {
        let model = this.model;
        if (!model) return;
        if (!model.ready) return;
        // 持续时间
        if (model.time > 0) {
            model.time -= dt;
            if (model.time <= 0) {
                // 持续时间已到，直接消失
                this.hide();
                return;
            }
        }
        // 检测召唤物的战斗时长
        if (this.isfight && this.checkTime > 0 && this.isAlive) {
            this.fightTime += dt;
            this.checkTime -= dt;
            if (this.checkTime <= 0) {
                this.checkTime = 1;
                this.isfight = false;
            }
        }
        super.updateScript(dt);
    }

    @gdk.binding("model.hp")
    _setHp(v: number, ov: number, nv: number) {
        if (nv < ov && !this.isfight) this.isfight = true;
        super._setHp(v, ov, nv);
    }

    setPosBy(pos: cc.Vec2, i?: number, n?: number) {
        if (cc.js.isNumber(i) && cc.js.isNumber(n)) {
            pos = cc.v2(pos.x + (i - (n + 1) / 2 + 1) * 60, pos.y - 60);
        }
        this.model.orignalPos = pos;
        this.node.setPosition(this.model.orignalPos);
    }

    // 方向计算
    setDir(to: cc.Vec2) {
        //PveEnemyCtrl.prototype.setDir.call(this, to);
        if (StringUtils.startsWith(this.model.skin, 'H_')) {
            return PveHeroCtrl.prototype.setDir.call(this, to);
        } else {
            return PveEnemyCtrl.prototype.setDir.call(this, to);
        }
    }

    getScale(animation: string): number {
        if (StringUtils.startsWith(this.model.skin, 'H_')) {
            return PveHeroCtrl.prototype.getScale.call(this, animation);
        } else {
            return PveEnemyCtrl.prototype.getScale.call(this, animation);
        }
        //return PveEnemyCtrl.prototype.getScale.call(this, animation);
    }

    /**
    * 被攻击时事件接口
    */
    onAttacked(attacker: PveFightCtrl, skill: PveSkillModel | PveBuffModel): void {
        super.onAttacked(attacker, skill);
        //召唤物没有目标的情况下受到怪物攻击时判断是否在可攻击范围内，在的话就可以攻击
        let sm = this.model;
        if (sm.targetId == -1) {
            if (!attacker || !attacker.isAlive) return;
            let am = attacker.model;
            if (am.camp == sm.camp) return;
            sm.targetId = attacker.model.fightId;
        }
    }

    getAnimation(animation: string): string {
        if (StringUtils.startsWith(this.model.skin, 'H_')) {
            return PveHeroCtrl.prototype.getAnimation.call(this, animation, true);
        } else {
            return PveEnemyCtrl.prototype.getAnimation.call(this, animation, true);
        }

    }
    hide(effect: boolean = true) {
        this.checkTime = 1;
        this.isfight = false;
        this.fightTime = 0;
        super.hide(effect);
    }
}