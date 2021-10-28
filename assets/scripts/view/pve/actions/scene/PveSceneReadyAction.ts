import { MonsterCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import PanelId from '../../../../configs/ids/PanelId';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneState from '../../enum/PveSceneState';
import { SkillIdLv } from '../../model/PveBaseFightModel';
import PveTool from '../../utils/PveTool';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import { Copy_assistCfg } from './../../../../a/config';
import { CopyType } from './../../../../common/models/CopyModel';

/**
 * PVE场景准备场景动作动作
 * @Author: sthoo.huang
 * @Date: 2019-03-19 10:11:56
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-22 10:42:34
 */
@gdk.fsm.action("PveSceneReadyAction", "Pve/Scene")
export default class PveSceneReadyAction extends PveSceneBaseAction {

    queue: any[][];

    onEnter() {
        super.onEnter();
        this.model.showAtkDis = true;
        this.model.showHeroEffect = true;
        if (!this.model.isDemo) {
            // 演示战斗
            this._finish();
        } else {
            // 预加载技能相关的资源
            let queue = this.queue = [];
            let resId = gdk.Tool.getResIdByNode(this.ctrl.node);
            let resDic = {};
            // 预加载指挥官技能
            this.model.generals.forEach(g => {
                queue.push([resId, null, g.model.skillIds, resDic]);
                // PveTool.preloadFightRes(resId, null, g.model.skillIds, resDic);
            });
            // 预加载英雄资源
            this.model.heros.forEach(h => {
                queue.push([resId, null, h.model.skillIds, resDic]);
                // PveTool.preloadFightRes(resId, null, h.model.skillIds, resDic);
            });
            // 预加载怪物资源
            let enemyDic = {};  // 以怪物ID做为索引
            this.model.enemyCfg.forEach(bcfg => {
                if (!bcfg || enemyDic[bcfg.enemy_id]) return;
                enemyDic[bcfg.enemy_id] = true;
                // 技能列表
                let config = ConfigManager.getItemById(MonsterCfg, bcfg.enemy_id);
                let skills: SkillIdLv[] = [];
                for (let i = 0, n = config.skills.length; i < n; i++) {
                    if (cc.js.isNumber(config.skills[i])) {
                        skills.push({
                            skillId: config.skills[i],
                            skillLv: 1,
                        });
                    } else if (cc.js.isString(config.skills[i])) {
                        let str: string = config.skills[i] as any;
                        let args: string[] = str.split('#');
                        if (args.length == 2) {
                            skills.push({
                                skillId: parseInt(args[0]),
                                skillLv: parseInt(args[1]),
                            });
                        }
                    }
                }
                queue.push([
                    resId,
                    PveTool.getSkinUrl(config.skin),
                    skills,
                    resDic
                ]);
            });
            // 开始预加载
            gdk.Timer.frameLoop(1, this, this.preloadProc);
        }
    }

    onExit() {
        super.onExit();
        this.queue = null;
        gdk.Timer.clearAll(this);
    }

    preloadProc() {
        if (!cc.isValid(this.node)) return;
        if (!this.active) return;
        if (!this.ctrl || !this.model || this.model.heros.some(h => !h.model.loaded)) {
            // 有英雄模型没有加载完成，则推迟此类资源预加载处理
            return;
        }
        if (this.queue && this.queue.length > 0) {
            PveTool.preloadFightRes.call(PveTool, ...this.queue.shift());
            return;
        }
        // 技能闪光特效
        let resId = gdk.Tool.getResIdByNode(this.ctrl.node);
        gdk.rm.loadRes(resId, 'spine/common/E_com_xuli/E_com_xuli', sp.SkeletonData);
        this._finish();
    }

    _finish() {
        // 激活引导
        if (!this.model.isBounty && !this.model.isMirror) GuideUtil.activeGuide('ready#' + this.model.id);
        if (!cc.isValid(this.node)) return;
        if (!this.model) return;
        if (!GuideUtil.isGuiding) {
            // 没有引导，有助阵英雄时
            let cfgs = ConfigManager.getItems(Copy_assistCfg, { 'stage_id': this.model.id });
            if (cfgs && cfgs.length > 0) {
                if (GuideUtil.isHideGuide || (this.model.stageConfig.copy_id == CopyType.HeroTrial ||
                    this.model.stageConfig.copy_id == CopyType.NewHeroTrial ||
                    this.model.stageConfig.copy_id == CopyType.Mystery)) {
                    // 禁用引导或英雄试练副本，则直接执行一键上阵
                    this.model.state = PveSceneState.Ready;
                    this.broadcastEvent(PveFsmEventId.PVE_SCENE_ONE_KEY);
                } else {
                    this.model.state = PveSceneState.Ready;
                }
                return;
            }
        }

        // 生存副本
        if (this.model.stageConfig.copy_id == CopyType.Survival &&
            CopyUtil.isCanUpgradeSurvivalEquip()) {
            // 生成副本，最后购买状态为真是自动打开购买状态界面
            gdk.panel.open(PanelId.PveSceneEquipBuyPanel);
        }

        //末日 判断通关条件 各个阵营英雄数量和各个职业英雄数量
        if (this.model.stageConfig.copy_id == CopyType.EndRuin || this.model.stageConfig.copy_id == CopyType.HeroAwakening) {
            this.model.gateconditionUtil && this.model.gateconditionUtil.updateGateConditions();
        }

        // 新奖杯模式
        if (this.model.stageConfig.copy_id == CopyType.RookieCup ||
            this.model.stageConfig.copy_id == CopyType.ChallengeCup) {
            // 生成副本，并且已经有英雄阵型数据，则直接开始战斗
            //this.sendEvent(PveFsmEventId.PVE_SCENE_SURVIVAL_QUICK_FIGHT);
            this.model.state = PveSceneState.Ready;
            this.finish();
            // this.broadcastEvent(PveFsmEventId.PVE_SCENE_ONE_KEY);
            return;
        }


        if (this.model.stageConfig.copy_id == CopyType.NONE &&
            this.model.arenaSyncData.fightType == 'CHAMPION_GUESS') {
            this.model.state = PveSceneState.Ready;
            if (!this.model.isMirror) {
                gdk.Timer.once(110, this, () => {
                    this.sendEvent(PveFsmEventId.PVE_SCENE_SURVIVAL_QUICK_FIGHT);
                })
            }
            else {
                this.finish();
            }
            return;
        }
        if (this.model.stageConfig.copy_id == CopyType.NONE &&
            this.model.arenaSyncData.fightType == 'ARENATEAM') {
            this.model.state = PveSceneState.Ready;
            if (!this.model.isMirror) {
                gdk.Timer.once(110, this, () => {
                    this.sendEvent(PveFsmEventId.PVE_SCENE_SURVIVAL_QUICK_FIGHT);
                })
            }
            else {
                this.finish();
            }
            return;
        }
        if (this.model.stageConfig.copy_id == CopyType.NONE &&
            this.model.arenaSyncData.fightType == 'ARENAHONOR_GUESS') {
            this.model.state = PveSceneState.Ready;
            if (!this.model.isMirror) {
                gdk.Timer.once(110, this, () => {
                    this.sendEvent(PveFsmEventId.PVE_SCENE_SURVIVAL_QUICK_FIGHT);
                })
            }
            else {
                this.finish();
            }
            return;
        }
        if (this.model.stageConfig.copy_id == CopyType.NONE &&
            this.model.arenaSyncData.fightType == 'WORLDHONOR_GUESS') {
            this.model.state = PveSceneState.Ready;
            if (!this.model.isMirror) {
                gdk.Timer.once(110, this, () => {
                    this.sendEvent(PveFsmEventId.PVE_SCENE_SURVIVAL_QUICK_FIGHT);
                })
            }
            else {
                this.finish();
            }
            return;
        }

        // 碰撞管理器和战斗状态
        cc.director.getCollisionManager().enabled = true;
        this.model.state = PveSceneState.Ready;
        this.finish();
    }
}