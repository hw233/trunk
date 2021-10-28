import PveFightIdleAction from '../base/PveFightIdleAction';
import PveGeneralModel from '../../model/PveGeneralModel';

/**
 * Pve指挥官待机动作
 * @Author: sthoo.huang
 * @Date: 2019-05-16 16:29:06
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-02-04 00:40:28
 */

const abs = Math.abs;
const ceil = Math.ceil;

@gdk.fsm.action("PveGeneralIdleAction", "Pve/General")
export class PveGeneralIdleAction extends PveFightIdleAction {

    model: PveGeneralModel;

    onEnter() {
        super.onEnter();
        // 判断是否需要返回原位
        let model = this.model;
        if (model.speed <= 0) {
            let node = this.node;
            if (!node.getPos().equals(model.orignalPos)) {
                node.setPosition(model.orignalPos);
            }
        }
    }

}