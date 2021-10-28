import PveBaseFightCtrl from './PveBaseFightCtrl';
import PveEnemyModel from '../../model/PveEnemyModel';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveHpBarCtrl from '../../core/PveHpBarCtrl';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';
import { CopyType } from './../../../../common/models/CopyModel';
import { PveCampType, PveFightType } from '../../core/PveFightModel';

/**
 * Pve能受到伤害的战斗对象基类
 * @Author: sthoo.huang
 * @Date: 2019-07-09 11:31:13
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-29 10:24:23
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/fight/PveHurtableFightCtrl")
export default class PveHurtableFightCtrl extends PveBaseFightCtrl {

    hpBar: PveHpBarCtrl;

    onDisable() {
        this.hpBar && this.hideHpBar(false);
        super.onDisable();
    }

    hide(effect: boolean = true) {
        this.hpBar && this.hideHpBar(effect);
        super.hide(effect);
    }

    get isAlive() {
        let n = this.node;
        if (cc.isValid(n) && n.activeInHierarchy) {
            let m = this.model;
            if (m && m.hp > 0) {
                return true;
            }
        }
        return false;
    }

    @gdk.binding("model.hp")
    _setHp(v: number, ov: number, nv: number) {
        if (!this.sceneModel.isDemo) {
            PveTool.callLater(this, this._createHpBar);
        }
        // 死亡判定
        if (ov != nv && v <= 0) {
            this.onDie.emit(this);
            this.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_DIE);
        }
    }

    // 创建血条进度
    _createHpBar() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let sm = this.sceneModel;
        if (!sm) return;
        let model = this.model;
        if (!model) return;
        if (model.type == PveFightType.Enemy && sm.stageConfig.copy_id == CopyType.DoomsDay) {
            // 末日副本特殊处理
            if ((model as PveEnemyModel).isBoss) {
                return;
            }
        }
        let np: number = model.hp / model.hpMax;
        if (np > 0 && np < 1) {
            let ctrl = sm.arenaSyncData ? sm.arenaSyncData.mainModel.ctrl : sm.ctrl;
            let hpPre = ctrl.hpBarPrefab;
            if (model.type == PveFightType.Enemy) {
                if ((model as PveEnemyModel).isBoss) {
                    hpPre = ctrl.bossHpBarPrefab;
                }
            }
            if (hpPre) {
                if (!this.hpBar) {
                    let node: cc.Node = PvePool.get(hpPre);
                    this.hpBar = node.getComponent(PveHpBarCtrl);
                    this.hpBar.timeScale = sm.timeScale;
                    node.opacity = 0;
                    node.zIndex = 100;
                    node.parent = ctrl.hurt;
                    gdk.NodeTool.show(node);
                    this.updateHpBarPos();
                    this.node.on(
                        cc.Node.EventType.POSITION_CHANGED,
                        this.updateHpBarPos,
                        this,
                    );
                }
                gdk.Timer.once(3000, this, this.hideHpBar);
            }
        }
        // 更新血量
        if (this.hpBar) {
            if (model.camp == PveCampType.Enemy) {
                // 敌方
                this.hpBar.barVal.active = true;
                this.hpBar.barVal2.active = false;
            } else {
                // 友方
                this.hpBar.barVal.active = false;
                this.hpBar.barVal2.active = true;
            }
            this.hpBar.progress = np;
            // 更新护盾
            let value = (model.shield + model.getBuffShiedValue()) / model.hpMax;
            value = Math.min(1, value);
            this.hpBar.shiedValue = Math.min(1, value);

            this.hpBar.node.opacity = this.node.opacity;
        }
    }

    // 隐藏血条
    hideHpBar(effect: boolean = true) {
        if (!this.hpBar) return;
        let node = this.hpBar.node;
        gdk.NodeTool.hide(node, effect, () => {
            PvePool.put(node);
        });
        gdk.Timer.clear(this, this.hideHpBar);
        this.hpBar = null;
        this.node.off(
            cc.Node.EventType.POSITION_CHANGED,
            this.updateHpBarPos,
            this,
        );
    }

    /**
     * 刷新护盾展示
     */
    refreshShiedShow() {
        if (!this.sceneModel.isDemo) {
            PveTool.callLater(this, this._createHpBar);
        }
    }

    setPos(x: number, y: number) {
        let ret = super.setPos(x, y);
        if (ret && this.hpBar) {
            this.updateHpBarPos();
        }
        return ret;
    }

    // 更新血条位置
    updateHpBarPos() {
        if (!this.hpBar) return;
        let r = this.getRect();
        if (r) {
            let add = 20;
            let model = this.model;
            if (model.type == PveFightType.Enemy) {
                if ((model as PveEnemyModel).isBoss) {
                    add = 50;
                }
            }
            this.hpBar.node.setPosition(
                this.node.x,
                this.node.y + Math.ceil(r.y + r.height + add),
            );
        }
    }

    @gdk.binding('sceneModel.state')
    _setState() { /* 屏蔽重置处理 */ }
}