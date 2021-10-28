import PveFightIdleAction from '../base/PveFightIdleAction';
import PveFsmEventId from '../../enum/PveFsmEventId';

/** 
 * Pve召唤物待机动作
 * @Author: yaozu.hu
 * @Date: 2019-09-20 16:08:45 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-11-02 17:10:45
 */
@gdk.fsm.action("PveCalledIdleAction", "Pve/Called")
export default class PveCalledIdleAction extends PveFightIdleAction {

    finish() {
        if (this.model.getProp('feature1') != 1) {
            this.sendEvent(PveFsmEventId.PVE_FIGHT_CALLTYPE_SOLDIER);
        }
        super.finish();
    }
}
