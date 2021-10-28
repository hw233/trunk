import PveFightBaseAction from '../base/PveFightBaseAction';
import PveFightUtil from '../../utils/PveFightUtil';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveTrapModel from '../../model/PveTrapModel';


@gdk.fsm.action("PveTrapCreateCallAction", "Pve/Trap")
export default class PveTrapCreateCallAction extends PveFightBaseAction {
    onEnter() {
        super.onEnter();

        let m: PveTrapModel = this.model as any;

        // 召唤物id
        let id = m.config.enemy_id;

        //召唤物时间
        let time = 9999;
        if (cc.js.isNumber(m.config.buff_time)) {
            time = m.config.buff_time
        }

        if (!m.owner || !m.owner.isAlive) {
            // 主人死亡了就停止召唤
            this.sendEvent(PveFsmEventId.PVE_FIGHT_DIE);
            return;
        }
        //创建召唤物
        PveFightUtil.createCaller(
            this.sceneModel,
            id,
            time,
            {
                call_id: -1,
                owner: m.owner,
                pos: m.ctrl.getPos(),
            },
        );

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
