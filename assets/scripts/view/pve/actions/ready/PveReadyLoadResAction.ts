import CopyUtil from '../../../../common/utils/CopyUtil';
import PveSceneLoadResAction from '../scene/PveSceneLoadResAction';

/**
 * PVE场景资源加载动作
 * @Author: sthoo.huang
 * @Date: 2019-03-18 18:29:01
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-08 11:00:52
 */

@gdk.fsm.action("PveReadyLoadResAction", "Pve/Ready")
export default class PveReadyLoadResAction extends PveSceneLoadResAction {

    // 初始化关卡信息
    initStage(): boolean {
        this.model.id = CopyUtil.getLatelyEnterableStage();
        this.model.showAtkDis = false;
        this.model.showHeroEffect = false;
        return true;
    }
}