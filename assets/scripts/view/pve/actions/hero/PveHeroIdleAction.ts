import PveFightIdleAction from '../base/PveFightIdleAction';
import PveHeroCtrl from '../../ctrl/fight/PveHeroCtrl';
import PveHeroModel from '../../model/PveHeroModel';

/**
 * Pve英雄待机动作
 * @Author: sthoo.huang
 * @Date: 2019-08-19 10:20:04
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-25 09:58:03
 */

@gdk.fsm.action("PveHeroIdleAction", "Pve/Hero")
export default class PveHeroIdleAction extends PveFightIdleAction {

    ctrl: PveHeroCtrl;

    onEnter() {
        super.onEnter();
        this.ctrl.spine.node.setPosition(0, 0);
        this.ctrl.bgSpine.setPosition(0, 0);
        let model = this.model as PveHeroModel;
        if (model.speed <= 0) {
            let node = this.node;
            if (!node.getPos().equals(model.orignalPos)) {
                node.setPosition(model.orignalPos);
            }
        }
    }
}