import PveFightLoadResAction from '../base/PveFightLoadResAction';

/**
 * Pve传送门资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-04-12 10:44:23
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-17 11:05:35
 */

@gdk.fsm.action("PveGatelLoadResAction", "Pve/Gate")
export default class PveGatelLoadResAction extends PveFightLoadResAction {

    loadRes() {
        if (this.model.skin) {
            super.loadRes();
        } else {
            this.onFinish();
        }
    }
}