import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyUtil from '../../../../common/utils/CopyUtil';
import PveFightInitAction from '../base/PveFightInitAction';
import PveGeneralModel from '../../model/PveGeneralModel';
import PveSceneState from '../../enum/PveSceneState';
import { Copysurvival_equipCfg } from '../../../../a/config';
import { CopyType } from '../../../../common/models/CopyModel';

/**
 * Pve指挥官初始化动作
 * @Author: sthoo.huang
 * @Date: 2020-09-01 11:59:52
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-05-27 12:00:38
 */
@gdk.fsm.action("PveGeneralInitAction", "Pve/General")
export class PveGeneralInitAction extends PveFightInitAction {

    model: PveGeneralModel;

    updateScript(dt: number) {
        let sm = this.sceneModel;
        if ([PveSceneState.Fight, PveSceneState.WaveOver].indexOf(sm.state) == -1) return;
        if (sm.stageConfig.copy_id == CopyType.Survival && !sm.isDemo && this.model.ctrl.node.name != 'general_1') {
            // 生存副本处理购买的装备技能列表
            let equips = CopyUtil.getSurvivalHeroEquipsBy();
            for (let i = 0, n = equips.length; i < n; i++) {
                let e = equips[i];
                let c = ConfigManager.getItemById(Copysurvival_equipCfg, e.equipId);
                this.model.addSkill(c.skill, e.equipLv, true);
            }
        }
        super.updateScript(dt);
    }
}