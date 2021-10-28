import GeneralModel from '../../../../common/models/GeneralModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PveGeneralCtrl from '../../ctrl/fight/PveGeneralCtrl';
import PveGeneralModel from '../../model/PveGeneralModel';
import PvePool from '../../utils/PvePool';
import PveReplayCtrl from '../../ctrl/PveReplayCtrl';
import PveSceneInitAction from '../scene/PveSceneInitAction';
import RoleModel from '../../../../common/models/RoleModel';

/**
 * PVE场景初始化
 * @Author: sthoo.huang
 * @Date: 2019-03-18 18:37:54
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-24 09:57:15
 */

@gdk.fsm.action("PveReplayInitAction", "Pve/Replay")
export default class PveReplayInitAction extends PveSceneInitAction {

    ctrl: PveReplayCtrl;

    // 创建指挥官
    createGeneral() {
        if (!cc.isValid(this.node)) return;
        let m: GeneralModel = ModelManager.get(GeneralModel);
        if (m.generalInfo &&
            this.model.tiled.general &&
            this.model.generals.length < 1) {
            // 有指挥官成长数据，地图中有出生点坐标，并且当前场景没有创建指挥官
            return new Promise((resolve, reject) => {
                if (!this.ctrl.general) {
                    reject('ERROR');
                    return;
                }
                let node: cc.Node = PvePool.get(this.ctrl.generalPrefab);
                let general: PveGeneralCtrl = node.getComponent(PveGeneralCtrl);
                general.model = new PveGeneralModel();
                general.model.id = ModelManager.get(RoleModel).level;
                general.model.ctrl = general;
                general.model.info = this.ctrl.general;
                general.model.orignalPos = this.model.tiled.general.pos;
                general.sceneModel = this.model;
                general.node.name = 'general_0';
                general.node.setPosition(general.model.orignalPos);
                this.model.addFight(general);
                this.model.generals = this.model.generals;  // 触发绑定更新事件
                this.ctrl.generalSkillList.datas = this.model.actions;
                resolve('OK');
            });
        }
    }
}