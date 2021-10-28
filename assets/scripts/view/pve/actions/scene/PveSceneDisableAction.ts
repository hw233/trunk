import InstanceModel from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveSceneState from '../../enum/PveSceneState';
import PveTool from '../../utils/PveTool';

/**
 * PVE场景移除所有单位动作
 * @Author: sthoo.huang
 * @Date: 2019-06-10 11:05:07
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2019-12-31 15:43:16
 */

@gdk.fsm.action("PveSceneDisableAction", "Pve/Scene")
export default class PveSceneDisableAction extends PveSceneBaseAction {

    onEnter() {
        super.onEnter();
        PveTool.removeSceneNodes(this.ctrl);
        if (this.model.state == PveSceneState.Pause) {
            // 记录玩家进入副本退出的记录
            let cfg = this.model.stageConfig;
            if (cfg) {
                switch (cfg.copy_id) {
                    case 2:
                    case 3:
                        let type = cfg.copy_id + '';
                        let instanceM = ModelManager.get(InstanceModel);
                        if (instanceM) {
                            instanceM.instanceFailStage[type] = cfg.id
                        }
                        break;

                    case 5:
                    // // 添加失败记录
                    // let masteryModel = ModelManager.get(MasteryInstanceModel)
                    // masteryModel.heroMasteryFailData[cfg.hero + ''] = cfg.id;
                    // break;

                    case 8:
                        break;
                }
            }
        }
        this.finish();
    }
}