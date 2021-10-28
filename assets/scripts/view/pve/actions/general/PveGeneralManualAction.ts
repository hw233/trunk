import PveFightSearchAction from '../base/PveFightSearchAction';
import PveGeneralModel from '../../model/PveGeneralModel';

/**
 * Pve指挥官手动技能动作
 * @Author: sthoo.huang
 * @Date: 2019-07-17 10:04:34
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-07-17 10:33:17
 */

@gdk.fsm.action("PveGeneralManualAction", "Pve/General")
export class PveGeneralManualAction extends PveFightSearchAction {

    model: PveGeneralModel;

    onEnter() {
        super.onEnter();
        this.model.isInManual = true;
    }

    @gdk.binding('model.isInManual')
    _setState(v: boolean) {
        if (!v) {
            // 完成当前动作
            this.finish();
        }
    }
}