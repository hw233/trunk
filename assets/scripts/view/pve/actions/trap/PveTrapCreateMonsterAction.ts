import ConfigManager from '../../../../common/managers/ConfigManager';
import PveFightBaseAction from '../base/PveFightBaseAction';
import PveFightUtil from '../../utils/PveFightUtil';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveRoadUtil from '../../utils/PveRoadUtil';
import PveTrapModel from '../../model/PveTrapModel';
import { MonsterCfg } from '../../../../a/config';


@gdk.fsm.action("PveTrapCreateMonsterAction", "Pve/Trap")
export default class PveTrapCreateMonsterAction extends PveFightBaseAction {
    onEnter() {
        super.onEnter();

        let m: PveTrapModel = this.model as any;

        // 只对怪物有效
        //let monsterModel = m.owner.model as PveEnemyModel;
        let id = m.config.enemy_id;

        // let temData = enemy.setMonsterPosRoad(pos, roadIndex, i, road[0], temRadius);
        // pos = temData.pos;
        // enemy.model.road = temData.road
        let sceneModel = m.ctrl.sceneModel
        let roads: cc.Vec2[] = sceneModel.tiled.roads[m.monsterRoadIndex];
        let pos = m.ctrl.getPos()
        let r = PveRoadUtil.getShortestRoadBy(pos, roads);
        r.unshift(pos);

        //let roadList = m.monsterRoad.concat();
        let time = 0;
        if (cc.js.isNumber(m.config.buff_time)) {
            time = m.config.buff_time
        }
        PveFightUtil.createEnemy(
            this.sceneModel,
            id,
            m.ctrl.getPos(),
            r,
            m.monsterRoadIndex,
            null, null, null, null, time, null, null, m.ctrl
        );

        //排除不可计数的怪物
        let enemyCfg: MonsterCfg = ConfigManager.getItemById(MonsterCfg, id);
        if (enemyCfg && enemyCfg.type != 4) {
            m.ctrl.sceneModel.createdEnemy += 1;
        }
        if (cc.js.isNumber(m.times)) {
            m.times--;
            if (m.times <= 0) {
                // 次数用完了，消失
                this.sendEvent(PveFsmEventId.PVE_FIGHT_DIE);
                return;
            }
        }
        // 完成动作
        this.finish();
    }

}
