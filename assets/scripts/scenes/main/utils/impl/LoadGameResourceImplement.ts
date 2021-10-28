import * as iccfg from './../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import LoginFsmEventId from '../../enum/LoginFsmEventId';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';

/**
 * 加载进入游戏主场景资源动作实现
 * @Author: sthoo.huang
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-20 01:58:06
 * @Last Modified time: 2021-08-25 14:27:29
 */
export default class LoadGameResourceImplement {

    fsm: gdk.fsm.FsmStateAction;
    loadingErrorText: string;
    setProgress: (v: number) => void;

    private resIdx: number;
    private resDef: any;

    // 添加一组资源定义
    private addRes(type: any, resArr: string | string[]) {
        if (cc.js.isString(resArr)) {
            resArr = [resArr as string];
        }
        this.resDef[`res${this.resIdx++}`] = {
            type: type,
            resArray: resArr,
        };
    }

    // 加载游戏资源
    load() {

        // 初始化资源索引
        this.resIdx = 1;
        this.resDef = {};

        // 资源列表定义
        this.addRes(cc.Prefab, PanelId.MiniChat.prefab);
        this.addRes(cc.Prefab, PanelId.GuideView.prefab);
        if (JumpUtils.ifSysOpen(1301)) {
            // 基地功能开启
            this.addRes(cc.Prefab, PanelId.MainPanel.prefab);
            this.addRes(cc.Prefab, PanelId.PveReady.prefab);
            this.addRes(cc.Prefab, PanelId.MainDock.prefab);
            this.addRes(cc.Prefab, PanelId.MainTopInfoView.prefab);
            this.addRes(cc.Prefab, PanelId.GrowTaskBtnView.prefab);
        } else {
            // 基地还没有开启时
            let copyModel = ModelManager.get(CopyModel);
            let isFisrt = copyModel.lastCompleteStageId == 0;
            if (isFisrt) {
                // 首场战斗
                // let stageId = CopyUtil.getLatelyEnterableStage();
                // let stageConfig = CopyUtil.getStageConfig(stageId);
                // let config = ConfigManager.getItemById(iccfg.Pve_mainCfg, stageConfig.born);
                this.addRes(cc.Prefab, PanelId.PveScene.prefab);
                this.addRes(cc.Prefab, PanelId.PveSceneFightingPanel.prefab);
                // this.addRes(cc.AnimationClip, 'view/pve/ani/towerFlag');
                // this.addRes(cc.SpriteFrame, PveRes.PVE_MAP_RES + config.bg);
                // this.addRes(cc.TiledMapAsset, PveRes.PVE_ROAD_RES + config.road);
                // this.addRes(sp.SkeletonData, 'spine/common/E_com_xuli/E_com_xuli');
                // // 指挥官
                // let gconfig = ConfigManager.getItemById(iccfg.GeneralCfg, 1);
                // let gskin = gconfig ? gconfig.artifact : 'H_zhihuiguan';
                // if (ModelManager.get(RoleModel).gender == 1) {
                //     // 性别为女
                //     gskin += 'nv';
                // }
                // this.addRes(sp.SkeletonData, PveTool.getSkinUrl(gskin));
                // // UI资源
                // this.addRes(cc.SpriteFrame, 'view/pve/texture/ui/common/PVE_taizi_0');
                // this.addRes(cc.SpriteFrame, 'view/pve/texture/ui/common/skill_range');
                // this.addRes(cc.SpriteFrame, 'view/pve/texture/ui/common/skill_range1');
            } else {
                // 非首场战斗，停留在演示战斗界面
                this.addRes(cc.Prefab, PanelId.PveReady.prefab);
                this.addRes(cc.Prefab, PanelId.MainDock.prefab);
                this.addRes(cc.Prefab, PanelId.MainTopInfoView.prefab);
                this.addRes(cc.SpriteFrame, 'map/guaji_2');
            }
            // // 英雄资源
            // let heroModel = ModelManager.get(HeroModel);
            // heroModel.curUpHeroList(0).forEach(heroId => {
            //     if (heroId > 0) {
            //         let data = HeroUtils.getHeroItemByHeroId(heroId);
            //         let heroCfg = ConfigManager.getItemById(iccfg.HeroCfg, data.itemId);
            //         this.addRes(sp.SkeletonData, PveTool.getSkinUrl(heroCfg.skin));
            //     }
            // });
        }

        // 混合进GDK
        gdk.ResourceId.mixins({
            Game: this.resDef
        });

        // 加载资源
        let cacheLoaded = 0;
        gdk.rm.loadResByModule('Scene#' + gdk.scene.getSceneName(), ["Game"], null,
            (loaded: number, total: number) => {
                // 资源加载进度更新
                if (!this.fsm.active) return;
                if ((loaded / total) >= cacheLoaded) {
                    // 防止进度条倒退
                    cacheLoaded = loaded / total;
                    this.setProgress(loaded);
                }
            },
            (err: any) => {
                if (!this.fsm.active) return;
                if (!err) {
                    // 预解析配置
                    let cfgs: { new() }[] = [
                        iccfg.GlobalCfg,
                        iccfg.CommonCfg,
                        iccfg.SystemCfg,
                        iccfg.ItemCfg,
                        iccfg.MonsterCfg,
                        iccfg.HeroCfg,
                        iccfg.Hero_careerCfg,
                        iccfg.SoldierCfg,
                        iccfg.SkillCfg,
                        iccfg.Skill_effect_typeCfg,
                        iccfg.Skill_buffCfg,
                        iccfg.Skill_target_typeCfg,
                    ];
                    if (JumpUtils.ifSysOpen(1301)) {
                        // 基地功能开启
                        cfgs.push(
                            iccfg.Pve_demoCfg,
                            iccfg.Pve_bornCfg,
                            iccfg.Secretarea_globalCfg,
                            iccfg.Siege_globalCfg,
                            iccfg.Store_chargeCfg,
                            iccfg.Store_giftCfg,
                            iccfg.Store_monthcardCfg,
                            iccfg.Store_runeCfg,
                            iccfg.StoreCfg,
                            iccfg.Item_equipCfg,
                        );
                    } else {
                        let copyModel = ModelManager.get(CopyModel);
                        let isFisrt = copyModel.lastCompleteStageId == 0;
                        if (isFisrt) {
                            // 首场战斗
                            cfgs.push(
                                iccfg.Pve_mainCfg,
                                iccfg.Pve_bornCfg,
                                iccfg.Pve_spawnCfg,
                                iccfg.Pve_protegeCfg,
                                iccfg.General_weaponCfg,
                            );
                        }
                    }
                    gdk.Timer.frameLoop(1, this, () => {
                        if (cfgs.length == 0) {
                            // 完成动作
                            this.fsm.finish();
                            return;
                        }
                        let time = Date.now();
                        for (let i = 0, n = Math.min(3, cfgs.length); i < n; i++) {
                            ConfigManager.getItemById(cfgs.pop(), 1);
                            if (Date.now() - time > 10) {
                                break;
                            }
                        }
                    });
                    return;
                }
                cc.error("加载资源异常", err);
                gdk.gui.showMessage(this.loadingErrorText);
                this.fsm.sendEvent(LoginFsmEventId.CONN_BREAK);
            }
        );
    }
}