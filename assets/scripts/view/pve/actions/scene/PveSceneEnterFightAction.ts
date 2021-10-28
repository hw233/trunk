import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../../../guild/ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveSceneCheckAction from './PveSceneCheckAction';
import PveSceneState from '../../enum/PveSceneState';
import { Copy_attrAdditionCfg, Copy_pvpAdditionCfg } from './../../../../a/config';

/**
 * PVE场景进入战斗
 * @Author: onlyWey 
 * @Date: 2019-09-02 14:31:01 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-05-26 17:01:38
 */

@gdk.fsm.action("PveSceneEnterFightAction", "Pve/Scene")
export default class PveSceneEnterFightAction extends PveSceneBaseAction {

    //showGeneralSKillAnim: boolean = false;
    onEnter() {
        super.onEnter();
        gdk.gui.showWaiting('i18n:LOADING_STRING', 'PveSceneEnterFightAction', null, null, null, 2);
        // //判断是否需要播放指挥官技能
        // if (!this.model.isDemo && !this.model.isReplay) {
        //     let tem = ConfigManager.getItemByField(GlobalCfg, 'key', 'general_skills_unlock').value;
        //     if (tem && (tem[3] == this.model.stageConfig.id || tem[5] == this.model.stageConfig.id)) {
        //         this.showGeneralSKillAnim = false;
        //         let index = tem.indexOf(this.model.stageConfig.id);
        //         let skillId = tem[index - 1];
        //         gdk.panel.setArgs(PanelId.PveGeneralComming, skillId, this.model.timeScale)
        //         gdk.panel.open(PanelId.PveGeneralComming, (node) => {
        //             let ctrl = node.getComponent(PveGeneralCommingCtrl);
        //             ctrl.node.onHide.on(() => {
        //                 this.showGeneralSKillAnim = true;
        //             }, this);
        //         });
        //     } else {
        //         this.showGeneralSKillAnim = true;
        //     }
        // } else {
        //     this.showGeneralSKillAnim = true;
        // }

        this.checkReady();
    }

    onExit() {
        super.onExit();
        gdk.gui.hideWaiting('PveSceneEnterFightAction');
    }

    checkReady() {
        let m = this.model;
        if (!m) return;
        let b = !m.loading;
        // 镜像战斗是否已经准备好
        if (b && m.arenaSyncData) {
            let m2 = m.arenaSyncData.mirrorModel;
            if (m.arenaSyncData.fightType == 'ARENATEAM') {
                m2.state = PveSceneState.Ready
            }
            b = m2.state == PveSceneState.Ready && !m2.loading;
            if (b) {
                // 镜像战斗开始战斗，计算战力等级
                let mpower = m.totalPower / m.heros.length;
                let m2power = m2.totalPower / m2.heros.length;
                if (m2.arenaSyncData.fightType !== 'PIECES_CHESS' && m2.arenaSyncData.fightType !== 'PIECES_ENDLESS') {
                    m2.arenaSyncData.pwoer = Math.max(mpower, m2power);
                }
                if (m2.arenaSyncData.fightType === 'FOOTHOLD') {
                    // 据点战并且守方战力更高
                    let footHoldModel = ModelManager.get(FootHoldModel);
                    let pointInfo = footHoldModel.warPoints[`${footHoldModel.pointDetailInfo.pos.x}-${footHoldModel.pointDetailInfo.pos.y}`];
                    let pvpCfg = ConfigManager.getItem(Copy_pvpAdditionCfg, {
                        world_level: footHoldModel.worldLevelIndex,
                        point_type: pointInfo.type,
                    });
                    if (pvpCfg && mpower < m2power + pvpCfg.power) {
                        m2.arenaSyncData.pwoer += pvpCfg.power;
                        // 为守方英雄调整属性
                        m2.heros.forEach(h => {
                            let hm = h.model;
                            let cfg = ConfigManager.getItem(Copy_attrAdditionCfg, { career_type: hm.soldierType });
                            if (cfg) {
                                hm._basePropTarget.atk += pvpCfg.power * cfg.atk;
                                hm._basePropTarget.def += pvpCfg.power * cfg.def;
                                hm._basePropTarget.hit += pvpCfg.power * cfg.hit;
                                hm._basePropTarget.dodge += pvpCfg.power * cfg.dodge;
                                hm._basePropTarget.hp += pvpCfg.power * cfg.hp;
                                hm.hpMax = hm.getProp('hp');
                                hm.hp = hm.hpMax;
                            }
                        });
                    }
                } else if (m2.arenaSyncData.fightType === 'VAULT') {
                    m2.arenaSyncData.pwoer = m2power;
                    m.arenaSyncData.pwoer = m2power;
                } else if (m2.arenaSyncData.fightType === 'GUARDIANTOWER') {
                    m2.arenaSyncData.pwoer = m2power;
                    m.arenaSyncData.pwoer = m2power;
                }
                m2.battleInfoUtil.clearAll();
                m2.battleInfoUtil.sceneModel = m2;
                m2.showAtkDis = false;
                m2.showHeroEffect = false;
                // 创建传送门
                this.createGates(m2.ctrl, m2.tiled.gates);
                m2.ctrl.fsm.sendEvent(PveFsmEventId.PVE_MIRROR_SCENE_FIGHT);
            }
        }
        // 数据还没准备好，则延迟重试
        if (!b) {
            gdk.Timer.callLater(this, this.checkReady);
            return;
        }
        // 默认速度
        if (!m.isDemo && !m.isReplay && m.config.can_speedup == 2) {
            // 可加速场景
            let v = GlobalUtil.getLocal('pve_time_scale');
            if (cc.js.isNumber(v) && m.timeScaleArray.indexOf(v) >= 0) {
                m.timeScale = v;
            } else {
                if (cc.game.getFrameRate() > 30 || cc.sys.platform === cc.sys.WECHAT_GAME) {
                    // 没有保存的速度，则使用最大速度值
                    let arr = m.timeScaleArray;
                    v = arr[arr.length - 1];
                    // // 显示加速提示
                    // let tips = cc.js.isNumber(v) ? cc.find('UI/PveSkillDock/layout/TimeScaleBtn/tips', m.ctrl.node) : null;
                    // if (tips) {
                    //     gdk.NodeTool.show(tips);
                    //     gdk.Timer.clearAll(this);
                    //     gdk.Timer.once(3000, this, () => gdk.NodeTool.hide(tips));
                    // }
                } else {
                    // 省电或低性能模式不自动开启加速功能
                    v = m.defaultTimeScale;
                }
                // 保存速度值
                m.timeScale = v
                GlobalUtil.setLocal('pve_time_scale', v);
            }
        } else if (m.isDemo) {
            // 战斗演示
            m.timeScale = 1.0;
        } else {
            // 默认
            m.timeScale = m.defaultTimeScale;
        }
        // 清除战斗信息
        if (m.battleInfoUtil) {
            m.battleInfoUtil.clearAll();
            m.battleInfoUtil.sceneModel = m;
        }
        m.showHeroEffect = false;
        // 创建传送门
        this.createGates(this, m.tiled.gates);
        // 完成当前动作
        this.finish();
    }

    // 创建传送门
    createGates(thiz: any, gates: any) {
        for (let key in gates) {
            let pt: cc.Vec2 = gates[key];
            let args: any[] = key.split('_');
            let flag: string = args.shift();
            let id: number = parseInt(args.shift());
            // 传送范围
            args[1] = args[1].split('#');
            for (let i = 0; i < args[1].length; i++) {
                args[1][i] = parseInt(args[1][i]) / 100;
            }
            // 目标出生点
            if (args[2]) {
                args[2] = parseInt(args[2]);
            }
            PveSceneCheckAction.prototype.createGate.call(
                thiz,
                [flag, id, Number.MAX_VALUE, pt, null, args]
            );
        }
    }
}