import ConfigManager from '../../../../common/managers/ConfigManager';
import FightingMath from '../../../../common/utils/FightingMath';
import PveBaseFightCtrl from '../../ctrl/fight/PveBaseFightCtrl';
import PveEnemyCtrl from '../../ctrl/fight/PveEnemyCtrl';
import PveFightBaseAction from '../base/PveFightBaseAction';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveGateCtrl from '../../ctrl/fight/PveGateCtrl';
import PveGateModel from '../../model/PveGateModel';
import PveRoadUtil from '../../utils/PveRoadUtil';
import PveTool from '../../utils/PveTool';
import ThingColliderCtrl from '../../core/ThingColliderCtrl';
import { PveFightAnmNames } from '../../const/PveAnimationNames';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { Skill_target_typeCfg } from '../../../../a/config';

/**
 * Pve传送阵状态检查动作
 * @Author: sthoo.huang
 * @Date: 2019-05-16 16:29:06
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-27 20:17:49
 */

@gdk.fsm.action("PveGateCheckAction", "Pve/Gate")
export class PveGateCheckAction extends PveFightBaseAction {

    onEnter() {
        super.onEnter();

        // 传送目标至新坐标
        let arr = this.searchObject();
        if (arr && arr.length > 0) {
            let sm = this.sceneModel;
            let m = this.model as PveGateModel;
            let t = m.config.range_type;
            let now = sm.time;
            for (let j = arr.length - 1; j >= 0; j--) {
                let target = arr[j] as PveEnemyCtrl;
                if (target && target.isAlive) {
                    let tm = target.model;
                    let id = tm.fightId;
                    if (m.targetsTime[id] !== void 0 && now - m.targetsTime[id] < 5) {
                        // 此目标距离上次被选中不超过5秒，则不重复选中
                        continue;
                    }
                    m.targetsTime[id] = now;
                    // 所使用的路线点
                    let roadIndex = tm.roadIndex;
                    if (m.road != -1 && m.mode == 'to') {
                        // 指定路线
                        roadIndex = m.road;
                    }
                    let road = sm.tiled.roads[roadIndex];
                    if (road && road.length) {
                        let ret: cc.Vec2[];
                        let per: number = m.percent[0];
                        if (m.percent.length == 2) {
                            // 随机范围
                            per = FightingMath.rnd(m.percent[0] * 100, m.percent[1] * 100) / 100;
                        }
                        let len = sm.tiled.getRoadLen(roadIndex);
                        if (m.mode == 'to') {
                            // 绝对移动
                            ret = PveRoadUtil.getRoadBy(road, per, len);

                        } else {
                            // 相对移动，只针对当前路线
                            let d = tm.roadLength;
                            ret = PveRoadUtil.getRoadBy(
                                road,
                                (len - d + d * per) / len,
                                len
                            );
                        }
                        if (ret) {
                            // 更新怪物的当前坐标，剩余路线，及出生点
                            tm.road = ret;
                            tm.roadIndex = roadIndex;
                            // 大于10的范围类型则不用渐显渐隐效果
                            if (t < 10) {
                                tm.targetPos = null;
                                target.node.opacity = 0;
                                target.node.setPosition(ret[0]);
                                // 更新方向
                                if (ret.length > 1) {
                                    target.setDir(ret[1]);
                                    target.setAnimation(PveFightAnmNames.WALK);
                                }
                                target.node.runAction(cc.fadeIn(0.25));
                                target.fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_GATE);
                            }
                        }
                    }
                }
            }
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
        let m: PveGateModel = this.model as any;
        let c: Skill_target_typeCfg = ConfigManager.getItemById(Skill_target_typeCfg, m.config.target_type);
        let p: cc.Vec2 = this.ctrl.getPos();
        switch (m.config.range_type) {
            case 1:
            case 10:
                // 圆形范围内的目标
                let r: number = m.range;
                let all: PveFightCtrl[] = this.sceneModel.fightSelector.getAllFights(this.ctrl, c, this.sceneModel, null, p, r);
                if (all && all.length) {
                    return this.sceneModel.fightSelector.circleSelect(
                        all,
                        p,
                        PveTool.getPriorityType(c, false),
                        r,
                        m.config.target_num
                    );
                }
                break;

            case 2:
            case 20:
                // 矩形范围内的目标
                let ctrl: PveGateCtrl = this.ctrl as PveGateCtrl;
                let t: ThingColliderCtrl = ctrl.boxCollider.node.getComponent(ThingColliderCtrl);
                let a: PveFightCtrl[] = t.getClolliderComponents(PveBaseFightCtrl, t => t.sceneModel === this.sceneModel);
                if (a && a.length) {
                    return this.sceneModel.fightSelector.boxSelect(
                        a,
                        this.ctrl,
                        c,
                        p,
                        PveTool.getPriorityType(c, false),
                        m.config.target_num
                    );
                }
                break;
        }
        return null;
    }
}