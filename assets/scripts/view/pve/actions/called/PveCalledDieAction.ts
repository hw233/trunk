import PveFightBaseAction from '../base/PveFightBaseAction';

/**
 * PVE召唤物死亡动作
 * @Author: sthoo.huang
 * @Date: 2019-03-20 18:14:25
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-06-06 11:57:08
 */

@gdk.fsm.action("PveCalledDieAction", "Pve/Called")
export default class PveCalledDieAction extends PveFightBaseAction {

    onEnter() {
        super.onEnter();
        this.finish();
    }

}