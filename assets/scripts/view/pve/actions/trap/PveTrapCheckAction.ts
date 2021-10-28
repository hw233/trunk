import { Skill_target_typeCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import ThingColliderCtrl from '../../core/ThingColliderCtrl';
import PveBaseFightCtrl from '../../ctrl/fight/PveBaseFightCtrl';
import PveTrapCtrl from '../../ctrl/fight/PveTrapCtrl';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveTrapModel from '../../model/PveTrapModel';
import PveTool from '../../utils/PveTool';
import PveFightBaseAction from '../base/PveFightBaseAction';

/**
 * Pve陷阱状态检查动作
 * @Author: sthoo.huang
 * @Date: 2019-05-16 16:29:06
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-09 19:26:09
 */

@gdk.fsm.action("PveTrapCheckAction", "Pve/Trap")
export class PveTrapCheckAction extends PveFightBaseAction {

    onEnter() {
        super.onEnter();
        let m: PveTrapModel = this.model as any;
        // 不指定target_type或无buff_id，什么也不做
        if (!m.config.target_type || !m.config.buff_id) {
            this.finish();
            return;
        }
        if (m.config.buff_id instanceof Array && m.config.buff_id.length == 0) {
            this.finish();
            return;
        }
        // 增加Buff效果
        let arr = this.searchObject();
        if (arr && arr.length > 0) {
            // 播放音效
            m.config.dmg_sound &&
                GlobalUtil.isSoundOn &&
                gdk.sound.play(
                    gdk.Tool.getResIdByNode(this.sceneModel.ctrl.node),
                    m.config.dmg_sound,
                );
            // 增加BUFF
            for (let j = arr.length - 1; j >= 0; j--) {
                let target: PveFightCtrl = arr[j];
                if (target && target.isAlive) {
                    PveTool.addBuffsTo(m.owner_id, m.owner_prop, target, m.config.buff_id, m.config.buff_time);
                }
            }
            // 持续时间判断
            if (cc.js.isNumber(m.times)) {
                m.times--;
                if (m.times <= 0) {
                    // 次数用完了，消失
                    this.sendEvent(PveFsmEventId.PVE_FIGHT_DIE);
                    return;
                }
            }
        }

        // 完成动作
        this.finish();
    }

    // 查找目标
    searchObject(): PveFightCtrl[] {
        let m: PveTrapModel = this.model as any;
        let c: Skill_target_typeCfg = ConfigManager.getItemById(Skill_target_typeCfg, m.config.target_type);
        let p: cc.Vec2 = this.ctrl.getPos();
        let ret: PveFightCtrl[] = null;
        switch (m.config.range_type) {
            case 1:
                // 圆形范围内的目标
                let r: number = m.temRange > 0 ? m.temRange : m.range;
                let all: PveFightCtrl[] = this.sceneModel.fightSelector.getAllFights(m.owner || this.ctrl, c, this.sceneModel, null, p, r);
                if (all && all.length) {
                    ret = this.sceneModel.fightSelector.circleSelect(
                        all,
                        p,
                        PveTool.getPriorityType(c, false),
                        r,
                        999,
                    );
                }
                break;

            case 2:
                // 矩形范围内的目标
                let ctrl: PveTrapCtrl = this.ctrl as PveTrapCtrl;
                let t: ThingColliderCtrl = ctrl.boxCollider.node.getComponent(ThingColliderCtrl);
                let a: PveFightCtrl[] = t.getClolliderComponents(PveBaseFightCtrl, t => t.sceneModel === this.sceneModel);
                if (a && a.length) {
                    ret = this.sceneModel.fightSelector.boxSelect(
                        a,
                        m.owner || this.ctrl,
                        c,
                        p,
                        PveTool.getPriorityType(c, false),
                        999,
                    );
                }
                break;
        }
        // 移除已经存在buff_id的目标
        if (ret && ret.length > m.config.target_num) {
            let t: PveFightCtrl;
            let c: { [buff_id: number]: boolean } = {};
            if (m.config.buff_id instanceof Array) {
                m.config.buff_id.forEach(i => c[i] = true);
            } else if (cc.js.isNumber(m.config.buff_id)) {
                c[m.config.buff_id] = true;
            }
            for (let i = ret.length - 1; i >= 0; i--) {
                t = ret[i];
                t.model.buffs.some(b => {
                    if (c[b.id] === true) {
                        ret.splice(i, 1);
                        return true;
                    }
                    return false;
                });
            }
        }
        return ret;
    }
}