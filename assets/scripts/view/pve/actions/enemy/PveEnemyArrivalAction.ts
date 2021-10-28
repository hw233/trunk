import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../../../guild/ctrl/footHold/FootHoldModel';
import GuildModel from '../../../guild/model/GuildModel';
import MathUtil from '../../../../common/utils/MathUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PveEnemyModel from '../../model/PveEnemyModel';
import PveFightBaseAction from '../base/PveFightBaseAction';
import PveProtegeCtrl from '../../ctrl/fight/PveProtegeCtrl';
import { CopyType } from '../../../../common/models/CopyModel';
import { MonsterCfg } from '../../../../a/config';
import { PveCampType, PveFightType } from '../../core/PveFightModel';

/**
 * Pve怪物到达被保护对象动作
 * @Author: sthoo.huang
 * @Date: 2019-03-21 14:41:44
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-06-10 10:28:54
 */

@gdk.fsm.action("PveEnemyArrivalAction", "Pve/Enemy")
export default class PveEnemyArrivalAction extends PveFightBaseAction {

    onEnter() {
        super.onEnter();
        let m = this.sceneModel;
        // 添加判空，非敌方怪物则不做任何其他操作
        if (!m || this.model.camp != PveCampType.Enemy) {
            this.finish();
            return;
        }
        // 演示场景和回放场景不需要计算伤害及能量
        if (!m.isDemo && !m.isReplay) {
            // 判断与哪个被保护对象碰撞
            let proteges: Array<PveProtegeCtrl> = m.proteges;
            let dis: number = 999;
            let target: PveProtegeCtrl = null;
            for (let i = 0, n = proteges.length; i < n; i++) {
                let protege: PveProtegeCtrl = proteges[i];
                let tmpDis: number = MathUtil.distance(this.ctrl.getPos(), protege.node.getPos());
                if (tmpDis < dis) {
                    target = protege;
                    dis = tmpDis;
                }
            }
            if (target) {
                let model = target.model;
                let hurt = this.ctrl.model.getProp('hurt');
                model.hp = Math.max(0, model.hp - hurt);
            }

            //据点战类型
            if (m.stageConfig.copy_id == CopyType.FootHold) {
                let fhModel = ModelManager.get(FootHoldModel)
                if (fhModel.pointDetailInfo) {
                    m.footholdBossHurt = fhModel.pointDetailInfo.bossHp - m.getFightBybaseId(fhModel.pointDetailInfo.bossId).model.hp
                }
            }

            //公会boss类型
            if (m.stageConfig.copy_id == CopyType.GuildBoss) {
                let gModel = ModelManager.get(GuildModel);
                if (gModel.gbBossId) {
                    let bossCfg = ConfigManager.getItemById(MonsterCfg, gModel.gbBossId);
                    m.guildBossHurt = bossCfg.hp - m.getFightBybaseId(gModel.gbBossId).model.hp
                }
            }
            // 英雄试炼副本
            let copy_id = this.sceneModel.stageConfig.copy_id
            if ((copy_id == CopyType.HeroTrial || copy_id == CopyType.NewHeroTrial) && this.model.type == PveFightType.Enemy) {
                let model = this.model as PveEnemyModel
                if ((!model.owner_id || model.owner_id <= 0) && this.model.config.type != 4) {
                    this.sceneModel.allEnemyHurtNum += Math.max(0, model.hpMax - model.hp);
                }
            }

        }

        m.arrivalEnemy++;
        this.finish();
    }
}