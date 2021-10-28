import ConfigManager from '../../../../common/managers/ConfigManager';
import PveFightInitAction from '../base/PveFightInitAction';
import PveGuardModel from '../../model/PveGuardModel';
import PveHeroCtrl from '../../ctrl/fight/PveHeroCtrl';
import PveHeroModel from '../../model/PveHeroModel';
import PvePool from '../../utils/PvePool';
import PveSoldierCtrl from '../../ctrl/fight/PveSoldierCtrl';
import PveSoldierModel from '../../model/PveSoldierModel';
import { CopyType } from './../../../../common/models/CopyModel';
import { Pve_demo2Cfg } from '../../../../a/config';

/**
 * Pve英雄初始化动作
 * @Author: sthoo.huang
 * @Date: 2019-04-12 11:54:11
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-25 09:53:01
 */

@gdk.fsm.action("PveHeroInitAction", "Pve/Hero")
export default class PveHeroInitAction extends PveFightInitAction {

    ctrl: PveHeroCtrl;
    model: PveHeroModel;

    onEnterEx() {
        this.ctrl.spine.node.setPosition(0, 0);
        this.ctrl.bgSpine.setPosition(0, 0);
        // 处理特殊的副本类型
        let copyId = this.sceneModel.stageConfig.copy_id;
        if (this.sceneModel.isDemo) {
            let temCfg = ConfigManager.getItemByField(Pve_demo2Cfg, 'hero_id', this.model.config.id);

            this.model.demoRoadIndex = temCfg.towers_group.length == 6 ? temCfg.towers_initial + 1 : 0;
            return
        }
        if (copyId == CopyType.NONE || copyId == CopyType.Survival) {
            // 竞技模式不创建小兵
            return;
        }
        if (this.model.soldiers.length > 0) {
            // 已经存创建了小兵，不重复创建
            return;
        }
        let ctrl = this.sceneModel.ctrl;
        switch (this.model.soldierType) {
            case 1:
            case 2:
            case 3:
                // 创建机枪、狙击、炮兵
                for (let i = 0; i < 2; i++) {
                    this.createOneSoldier(ctrl.soldierPrefab, PveSoldierModel, i, 2);
                }
                break;

            case 4:
                // 创建守卫
                for (let i = 0; i < 2; i++) {
                    this.createOneSoldier(ctrl.guardPrefab, PveGuardModel, i, 2);
                }
                break;
        }
    }

    // 创建一个小兵（守卫是小兵的子类）
    createOneSoldier(prefab: cc.Prefab, modelClz: any, i: number, n: number) {
        let ctrl = this.ctrl;
        let model = this.model;
        let node: cc.Node = PvePool.get(prefab);
        let soldier: PveSoldierCtrl = node.getComponent(PveSoldierCtrl);
        soldier.model = new modelClz();
        soldier.model.id = model.soldierId;
        soldier.model.hero = ctrl;
        model.info && (soldier.model.info = model.info.soldier);
        soldier.model.ctrl = soldier;
        soldier.sceneModel = ctrl.sceneModel;
        node.name = this.node.name.split('_').shift() + '_soldier_' + i;
        model.soldiers.push(soldier);
        soldier.setPosBy(i, n);
        this.sceneModel.addFight(soldier);
    }
}