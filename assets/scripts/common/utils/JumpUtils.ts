import ActivityMainViewCtrl from '../../view/act/ctrl/ActivityMainViewCtrl';
import ActUtil from '../../view/act/util/ActUtil';
import ArenaHonorUtils from '../../view/arenahonor/utils/ArenaHonorUtils';
import ChampionModel from '../../view/champion/model/ChampionModel';
import CombineMainViewCtrl from '../../view/combine/ctrl/CombineMainViewCtrl';
import ConfigManager from '../managers/ConfigManager';
import CopyModel from '../models/CopyModel';
import CopyUtil from './CopyUtil';
import DoomsDayModel from '../../view/instance/model/DoomsDayModel';
import EnterStageViewCtrl from '../../view/map/ctrl/EnterStageViewCtrl';
import ExpeditionHeroDetailViewCtrl from '../../view/guild/ctrl/expedition/army/ExpeditionHeroDetailViewCtrl';
import FootHoldModel from '../../view/guild/ctrl/footHold/FootHoldModel';
import FootHoldUtils from '../../view/guild/ctrl/footHold/FootHoldUtils';
import FriendViewCtrl from '../../view/friend/ctrl/FriendViewCtrl';
import GeneView from '../../view/lottery/ctrl/gene/GeneViewCtrl';
import GlobalUtil from './GlobalUtil';
import GuardianTowerModel from '../../view/act/model/GuardianTowerModel';
import GuideUtil from './GuideUtil';
import GuildMainCtrl from '../../view/guild/ctrl/GuildMainCtrl';
import GuildUtils from '../../view/guild/utils/GuildUtils';
import HeroModel from '../models/HeroModel';
import InstanceModel, { InstanceData } from '../../view/instance/model/InstanceModel';
import LotteryViewCtrl from '../../view/lottery/ctrl/LotteryViewCtrl';
import MathUtil from './MathUtil';
import ModelManager from '../managers/ModelManager';
import NetManager from '../managers/NetManager';
import PanelId from '../../configs/ids/PanelId';
import PiecesModel from '../models/PiecesModel';
import PveFsmEventId from '../../view/pve/enum/PveFsmEventId';
import PveLittleGameModel from '../../view/pve/model/PveLittleGameModel';
import PveReplayCtrl from '../../view/pve/ctrl/PveReplayCtrl';
import PveSceneCtrl from '../../view/pve/ctrl/PveSceneCtrl';
import PveSceneModel from '../../view/pve/model/PveSceneModel';
import RechargeLBCtrl from '../../view/store/ctrl/recharge/RechargeLBCtrl';
import RedPointUtils from './RedPointUtils';
import RelicModel from '../../view/relic/model/RelicModel';
import RelicUtils from '../../view/relic/utils/RelicUtils';
import RoleModel from '../models/RoleModel';
import RoleViewCtrl2 from '../../view/role/ctrl2/main/RoleViewCtrl2';
import RoyalModel from '../models/RoyalModel';
import SdkTool from '../../sdk/SdkTool';
import StoreModel from '../../view/store/model/StoreModel';
import StoreViewCtrl from '../../view/store/ctrl/StoreViewCtrl';
import SupportMainViewCtrl from '../../view/resonating/ctrl/SupportMainViewCtrl';
import TaskModel from '../../view/task/model/TaskModel';
import TimerUtils from './TimerUtils';
import WorldHonorUtils from '../../view/worldhonor/utils/WorldHonorUtils';
import WorldMapViewCtrl from '../../view/map/ctrl/WorldMapViewCtrl';
import {
    Arenahonor_progressCfg,
    Arenahonor_worldwideCfg,
    Champion_mainCfg,
    Copy_stageCfg,
    General_weaponCfg,
    Hero_careerCfg,
    Little_game_globalCfg,
    LuckydrawCfg,
    MainInterface_sort_1Cfg,
    MainInterface_sort_2Cfg,
    MainInterface_sortCfg,
    Pieces_initialCfg,
    Pieces_power1Cfg,
    Pieces_power2Cfg,
    Pve_bossbornCfg,
    Royal_sceneCfg,
    Store_first_payCfg,
    SystemCfg
    } from '../../a/config';
import { CopyType } from './../models/CopyModel';
import { GlobalCfg } from './../../a/config';
import { StageState } from '../../view/map/ctrl/CityStageItemCtrl';
import CityMapViewCtrl from '../../view/map/ctrl/CityMapViewCtrl ';

/**
 * @Description: 引导操作函数接口
 * @Author: weiliang.huang
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-10-12 20:58:51
 * @Last Modified time: 2021-10-15 13:32:24
 */

class JumpUtilsClass {

    /**
     * 用于判断系统是否开启
     * @param sysId 系统id
     * @param showTips 未开启时,是否显示提示
     * @param isByAct  是否包含活动判断
     */
    ifSysOpen(sysId: number, showTips: boolean = false, isByAct: boolean = true) {
        let cfg = ConfigManager.getItemById(SystemCfg, sysId);
        if (!cfg) {
            return true;
        }
        // 平台限制
        if (cfg.platform && cfg.platform != '') {
            let ret = cfg.platform.split(',').some(p => {
                switch (p) {
                    case 'wx':
                        return cc.sys.platform === cc.sys.WECHAT_GAME;

                    case 'h5':
                        return cc.sys.isBrowser;

                    case 'ios':
                        return cc.sys.isNative;
                }
                return false;
            });
            if (!ret) {
                return false;
            }
        }
        // 等级达不到要求
        let model = ModelManager.get(RoleModel);
        if (model.level < cfg.openLv) {
            // 显示提示信息
            if (showTips) {
                let text = "指挥官达到" + "@level级开启";
                text = text.replace("@level", `${cfg.openLv}`);
                GlobalUtil.showMessageAndSound(text);
            }
            return false;
        }
        // 已通过指定副本
        if (cc.js.isNumber(cfg.fbId) && cfg.fbId > 0 && !CopyUtil.isFbPassedById(cfg.fbId)) {
            // 显示提示信息
            if (showTips) {
                let text = GlobalUtil.getSysFbLimitStr(cfg.fbId);
                GlobalUtil.showMessageAndSound(text);
            }
            return false;
        }
        // 英雄星级
        if (cfg.heroStar instanceof Array) {
            let num = Math.max(cfg.heroStar[1], 1);
            let list = ModelManager.get(HeroModel).heroInfos;
            for (let i = 0, n = list.length; i < n; i++) {
                let info = list[i].extInfo as icmsg.HeroInfo;
                if (info.star >= cfg.heroStar[0]) {
                    // if (--num <= 0) {
                    //     return true;
                    // }
                    num--;
                }
            }
            if (num > 0) {
                if (showTips) {
                    let text = `获得${cfg.heroStar[0]}星英雄时开启`;
                    GlobalUtil.showMessageAndSound(text);
                }
                return false;
            }
        }
        // VIP等级限制
        if (cc.js.isNumber(cfg.vip) && cfg.vip > 0 && ModelManager.get(RoleModel).vipLv < cfg.vip) {
            if (showTips) {
                let text = `vip等级达到${cfg.vip}级开启`;
                GlobalUtil.showMessageAndSound(text);
            }
            return false;
        }
        // 限时开启的功能 已过活动日期
        if (isByAct && cc.js.isNumber(cfg.activity) && cfg.activity > 0 && !ActUtil.ifActOpen(cfg.activity)) {
            if (showTips) {
                let text = '活动未开启';
                let nextStartTime = ActUtil.getNextActStartTime(cfg.activity);
                if (nextStartTime) {
                    let nowTime = GlobalUtil.getServerTime();
                    let time1 = TimerUtils.format6((nextStartTime - nowTime) / 1000)
                    text = `剩余${time1}后开放`;
                }
                GlobalUtil.showMessageAndSound(text);
            }
            return false;
        }

        return true;
    }

    /**
     * 根据功能id打开相应窗口
     * @param sysId
     */
    openView(sysId: number, showTips: boolean = true) {
        let cfg = ConfigManager.getItemById(SystemCfg, sysId)
        if (!cfg) {
            return false
        }
        if (!this.ifSysOpen(sysId, showTips)) {
            return false
        }
        let handle = cfg.handle
        if (this[handle]) {
            this[handle].call(this, cfg.params)
        }
        return true
    }

    /**引导层不让点击 */
    showGuideMask() {
        let ctrl = GuideUtil.guideCtrl
        if (ctrl) {
            let comp = ctrl.getComponent(cc.BlockInputEvents)
            if (comp) {
                comp.enabled = true
            } else {
                ctrl.addComponent(cc.BlockInputEvents)
            }
        }
    }

    /**引导层可以点击 */
    hideGuideMask() {
        let ctrl = GuideUtil.guideCtrl
        if (ctrl) {
            let comp = ctrl.getComponent(cc.BlockInputEvents)
            if (comp && comp.enabled) {
                comp.enabled = false;
            }
        }
    }

    /**
     * 打开兵营界面
     */
    openBingYing(params: any[] = []) {
        // gdk.panel.open(PanelId.BYView)
        gdk.panel.open(PanelId.BYMainView);
    }

    /**
     * 打开副本
     */
    openInstance(params: number[] | number) {
        let statgeId = params instanceof Array ? params[0] : params;
        let stageCfg = CopyUtil.getStageConfig(statgeId);
        if (!stageCfg) {
            cc.error(`找不到 id: ${statgeId} 的副本配置`);
            return;
        }
        switch (stageCfg.copy_id) {
            case 1:
            case 7:
                // 主线或精英副本
                this.openInstancePvePanel(params);
                break;

            default:
                switch (stageCfg.type_pk) {
                    case 'pve':
                    case 'pve_fun':
                        // 塔防类战斗
                        this.openInstancePvePanel(params);
                        break;

                    case 'pvp':
                        // this.openPanel({
                        //     panelId: PanelId.InstancePVPReadyView,
                        //     panelArgs: { args: stageCfg },
                        // });
                        gdk.panel.open(PanelId.RoleSetUpHeroSelector, null, null, { args: 1 });
                        break;
                }
                break;
        }
    }

    /**打开战斗准备界面,并跳转到指定关卡 */
    openMainPvePanel(params: number[] | number, callback?: () => void, thisArg?: any) {
        let statgeId = params instanceof Array ? params[0] : params;
        if (!CopyUtil.isStageEnterable(statgeId)) {
            return this.openPvePanelLastStage();
        }
        this.openInstancePvePanel(statgeId, callback, thisArg);
    }

    /**打开副本PVE战斗准备界面,并跳转到指定关卡 */
    openInstancePvePanel(params: number[] | number, callback?: () => void, thisArg?: any) {
        let statgeId = params instanceof Array ? params[0] : params;
        let panel = gdk.panel.get(PanelId.PveScene);
        if (panel && panel.activeInHierarchy) {
            let model = panel.getComponent(PveSceneCtrl).model;
            if (model.id != statgeId) {
                let fsmc = panel.getComponent(gdk.fsm.FsmComponent);
                if (fsmc) {
                    model.id = statgeId;
                    fsmc.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
                }
            }
            callback && callback.call(thisArg);
        } else {
            this.openPanel({
                panelId: PanelId.PveScene,
                callback: callback ? () => {
                    callback.call(thisArg);
                } : null,
                currId: gdk.gui.getCurrentView(),
                blockInput: true,
                panelArgs: { args: statgeId },
            });
        }
    }

    /**打开战斗准备界面,并调到最新可挑战关卡 */
    openPvePanelLastStage() {
        let lastStageId = ModelManager.get(CopyModel).latelyStageId;
        let cfg = ConfigManager.getItemById(Copy_stageCfg, lastStageId);
        let roleLv = ModelManager.get(RoleModel).level;
        if (roleLv < cfg.player_lv) {
            gdk.gui.showMessage(`指挥官等级达到${cfg.player_lv}级可进行挑战`);
            return;
        }
        this.openMainPvePanel(lastStageId);
    }

    /**打开赏金副本 */
    openBountyInstance(mission: icmsg.BountyMission, callback?: () => void, thisArg?: any) {
        let model = new PveSceneModel();
        model.isBounty = true;
        model.bountyMission = mission;
        this.openPanel({
            panelId: PanelId.PveScene,
            callback: callback ? () => {
                callback.call(thisArg);
            } : null,
            currId: gdk.gui.getCurrentView(),
            blockInput: true,
            panelArgs: {
                args: model,
            },
        });
    }

    /**
     * 打开指定的副本界面
     * @param params 为空时只打开副本界面
     */
    openInstancePanel(params: number[] = []) {
        // let panel = gdk.panel.get(PanelId.Instance)
        // if (panel) {
        //     if (params && params.length > 0) {
        //         let comp = panel.getComponent(InstanceViewCtrl);
        //         comp.autoStageid = params[0];
        //     }
        //     return
        // }
        // gdk.panel.open(PanelId.Instance, (node: cc.Node) => {
        //     if (params && params.length > 0) {
        //         let comp = node.getComponent(InstanceViewCtrl);
        //         comp.autoStageid = params[0];
        //     }
        // })

        if (params && params.length > 0) {
            let model: InstanceModel = ModelManager.get(InstanceModel);
            let temp: InstanceData = model.instanceInfos[params[0]][0];
            gdk.panel.setArgs(PanelId.Instance, temp);
        }
        gdk.panel.open(PanelId.Instance);
    }

    openEnergyStation() {
        // gdk.panel.open(PanelId.EnergyStationView);
        this.openSupportView([3]);
    }

    /**
     * 打开生存训练
     * @param params
     */
    openSCXLInstancePanel(params: number[] = []) {
        this.openInstancePanel([CopyType.Survival]);
    }

    /**
     * 打开末日副本
     * @param params 
     */
    openDoomsdayInstancecPanel(params: number[] = []) {
        let doomsDayModel = ModelManager.get(DoomsDayModel)
        if (params && params.length > 0) {
            doomsDayModel.curIndex = params[0]
        }
        let model: InstanceModel = ModelManager.get(InstanceModel);
        let temp: InstanceData = model.instanceInfos[CopyType.DoomsDay][0];
        gdk.panel.setArgs(PanelId.Instance, temp);
        gdk.panel.open(PanelId.Instance);
    }

    /**
     * 殿堂指挥官
     */
    openVaultEnterView() {
        gdk.panel.open(PanelId.VaultEnterView);
    }

    /**
     * 打开试炼 塔
     * @param params 
     */
    openTowerCopyPanel(params: number[] = []) {
        gdk.panel.open(PanelId.TowerPanel);
    }
    /**
     * 打开武魂试炼
     * @param params 
     */
    openEternalCopyPanel(params: number[] = []) {
        gdk.panel.open(PanelId.EternalCopyView);
    }

    /**
     * 打开英雄详情界面 
     * @param params 0:[exp 升级   job 职业  equip 装备], ...openRolePanel参数
     */
    openRolePanel(params: any[]) {
        // 默认开启卡片选择界面
        if (!params || params.length == 0) {
            gdk.panel.open(PanelId.Role2);
            return;
        }
        let model = ModelManager.get(HeroModel);
        let heroInfos = model.heroInfos;
        GlobalUtil.sortArray(heroInfos, (a, b) => {
            return (<icmsg.HeroInfo>b.extInfo).power - (<icmsg.HeroInfo>a.extInfo).power
        })
        let n = heroInfos.length;
        if (n > 0) {
            params = params.concat();
            let type: string = params.shift();
            let info = heroInfos[0].extInfo as icmsg.HeroInfo;
            let heroId: number = params[1];
            let i = heroId > 0 ? 0 : 1;
            for (; i < n; i++) {
                let item = heroInfos[i].extInfo as icmsg.HeroInfo;
                // 参数指定了英雄id
                if (heroId > 0 && heroId != item.typeId) {
                    continue;
                }
                let found = false;
                switch (type) {
                    case 'exp':
                        // 可升级英雄
                        found = RedPointUtils.is_can_hero_upgrade(item);
                        break;

                    case 'job':
                        // 职业可进阶的英雄
                        found = RedPointUtils.is_can_job_up(item);
                        //found = true//都让跳转
                        break;
                    case 'equip':
                        // 可装备英雄（只判断第一个装备是否有装备）
                        // found = item.equips[0] === void 0 || item.equips[0] <= 0;
                        break;

                    case 'star':
                        // 可升星英雄
                        found = RedPointUtils.is_can_star_up(item);
                        break;

                    case 'soldier':
                        // 士兵
                        found = RedPointUtils.is_can_soldier_change(item);
                        break;

                    default:
                        found = true;
                        break;
                }
                if (found) {
                    info = item;
                    break;
                }
            }
            // 更新当前选中英雄
            if (model.curHeroInfo !== info) {
                model.curHeroInfo = info;
            }
            // 打开英雄详情界面
            let node = gdk.panel.get(PanelId.RoleView2);
            gdk.panel.setArgs(PanelId.RoleView2, ...params);
            if (node) {
                // 界面为打开状态，则重新检查参数
                let role = node.getComponent(RoleViewCtrl2);
                if (role) {
                    role.scheduleOnce(role.checkArgs, 0);
                }
            } else {
                gdk.panel.open(PanelId.RoleView2);
            }
        }
    }

    openEquipMerge(params: number[]) {
        if (params && params.length > 0) {
            gdk.panel.setArgs(PanelId.EquipView2, params)
            gdk.panel.open(PanelId.EquipView2)
            return
        }
        gdk.panel.open(PanelId.EquipView2)
    }


    /**已经打开英雄界面 切换标签 
     * 0:英雄界面 
     * 1.装备界面 
     * 2.神装界面 
     * 3.士兵界面 
     * 4 升星界面 
     * 5 觉醒界面
     * 
    */
    openSubRoleView(params: any[]) {
        let index = 0
        if (params && params.length > 0) {
            index = params[0]
        }
        let node = gdk.panel.get(PanelId.RoleView2)
        if (node) {
            let ctrl = node.getComponent(RoleViewCtrl2)
            ctrl.selectFunc(null, index)
        }
    }

    /**任意英雄进阶 根据类型跳转
     * 转至玩家当前英雄列表中特定职业的英雄
     * 
    */
    openRoleCareerUp(params: any[]) {
        let type = params[0]
        let model = ModelManager.get(HeroModel);
        let heroInfos = model.heroInfos;
        GlobalUtil.sortArray(heroInfos, (a, b) => {
            return (<icmsg.HeroInfo>b.extInfo).power - (<icmsg.HeroInfo>a.extInfo).power
        })
        let heroInfo = null
        for (let i = 0; i < heroInfos.length; i++) {
            let info = <icmsg.HeroInfo>heroInfos[i].extInfo
            let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", info.careerId)
            if (cfg.career_type == type) {
                heroInfo = info
                break
            }
        }
        if (heroInfo) {
            model.curHeroInfo = heroInfo
            // 打开英雄详情界面
            let node = gdk.panel.get(PanelId.RoleView2);
            gdk.panel.setArgs(PanelId.RoleView2, [2]);
            if (node) {
                // 界面为打开状态，则重新检查参数
                let role = node.getComponent(RoleViewCtrl2);
                if (role) {
                    role.scheduleOnce(role.checkArgs, 0);
                }
            } else {
                gdk.panel.open(PanelId.RoleView2);
            }
        } else {
            gdk.panel.open(PanelId.Role2);
        }

    }

    /**打开装备界面 */
    openEquipPanel(params: any[] = []) {
        // params.unshift(2);
        // this.openRolePanel(params);
        let model = ModelManager.get(HeroModel);
        let heroInfos = model.heroInfos;
        let hasEquip = false
        for (let i = 0; i < heroInfos.length; i++) {
            let info = <icmsg.HeroInfo>heroInfos[i].extInfo
            let equipItem = null
            // if (info.equips.length > 0) {
            //     for (let j = 0; j < info.equips.length; j++) {
            //         equipItem = EquipUtils.getEquipData(info.equips[j])
            //         if (equipItem) {
            //             model.curEquip = equipItem
            //             model.curHeroInfo = info
            //             hasEquip = true
            //             break
            //         }
            //     }
            // }
        }
        if (hasEquip) {
            let self = this
            gdk.panel.open(PanelId.RoleView2, () => {
                gdk.panel.setArgs(PanelId.EquipView2, params)
                self.openPanel({
                    panelId: PanelId.EquipView2,
                    currId: PanelId.RoleView2,
                });
            });
        } else {
            gdk.panel.open(PanelId.Role2)
        }
    }

    /**
     * 根据英雄id打开装备界面
     * @param id 
     * @param params 
     */
    openEquipPanelById(id: number, params?: any[]) {
        // 默认开启卡片选择界面
        let model = ModelManager.get(HeroModel);
        let heroBagItems = model.heroInfos;
        let info;
        heroBagItems.forEach((heroInfo, idx) => {
            let h_info = heroInfo.extInfo as icmsg.HeroInfo;
            if (id == heroInfo.series) {
                info = h_info;
            }
        });
        if (!info) return;
        model.curHeroInfo = info;
        // 打开英雄详情界面
        let node = gdk.panel.get(PanelId.RoleView2);
        params && gdk.panel.setArgs(PanelId.RoleView2, ...params);
        if (node) {
            // 界面为打开状态，则重新检查参数
            let role = node.getComponent(RoleViewCtrl2);
            if (role) {
                role.scheduleOnce(role.checkArgs, 0);
            }
        } else {
            // 界面没有打开，则设置参数并打开
            gdk.panel.open(PanelId.RoleView2);
        }
    }

    //打开英雄试炼界面
    openHeroTrialView(params: any[] = []) {
        //gdk.panel.open(PanelId.HeroTrialActionView);
        this.openActivityMain(8);
    }

    /**一键上阵函数 */
    oneKeyFunc() {
        let fsm = gdk.fsm.Fsm.getByName("FSM-PVE-SCENE")
        if (fsm) {
            // let model = PveSceneModel.get()
            // let cur: number = model.heros.length;
            // let max: number = model.towers.length - cur;
            // if (max < 1) {
            //     // 没有空位或英雄可布阵了
            //     return
            // }
            fsm.sendEvent(PveFsmEventId.PVE_SCENE_ONE_KEY_NOTIP);
        }
    }

    /**一键上阵并开始战斗 */
    pveSceneOneKeyStart(params: any[]) {
        let fsm = gdk.fsm.Fsm.getByName("FSM-PVE-SCENE");
        if (fsm) {
            fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_ONE_KEY_FIGHT);
        }
    }

    /**立刻开始战斗（不需要初始化） */
    pveSceneQuickStart(params: any[]) {
        let fsm = gdk.fsm.Fsm.getByName("FSM-PVE-SCENE")
        if (fsm) {
            fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_QUICK_FIGHT);
        }
    }

    /** 开始战斗 */
    pveSceneStart(params: any[]) {
        let fsm = gdk.fsm.Fsm.getByName("FSM-PVE-SCENE")
        if (fsm) {
            fsm.sendEvent(PveFsmEventId.PVE_SCENE_FIGHT);
        }
    }

    /**暂停战斗 */
    pauseFight() {
        let node = gdk.panel.get(PanelId.PveScene);
        if (node) {
            let panel = node.getComponent(PveSceneCtrl);
            if (panel) {
                let model = panel.model;
                if (model.timeScale > 0) {
                    model['__pve_fight_time_scale__'] = model.timeScale;
                    model.timeScale = 0.0;
                }
            }
        }
    }

    /**继续战斗 */
    resumeFight() {
        let node = gdk.panel.get(PanelId.PveScene);
        if (node) {
            let panel = node.getComponent(PveSceneCtrl);
            if (panel) {
                let model = panel.model;
                let timeScale = model['__pve_fight_time_scale__'];
                if (cc.js.isNumber(timeScale) && timeScale > 0) {
                    model.timeScale = timeScale;
                    delete model['__pve_fight_time_scale__'];
                }
            }
        }
    }


    //打开神秘者活动界面
    openMysteryView(param: any) {
        if (!this.ifSysOpen(2951, true)) {
            return;
        }
        let index = 0;
        if (param) {
            if (param instanceof Array) index = param[0];
            else index = param;
        }
        gdk.panel.setArgs(PanelId.MysteryVisitorActivityMainView, index);
        gdk.panel.open(PanelId.MysteryVisitorActivityMainView);
    }

    openRelicMapView() {
        gdk.panel.open(PanelId.RelicMapView);
    }

    openRelicMainView() {
        gdk.panel.open(PanelId.RelicMainView);
    }

    /**打开酒馆 */
    openTavern() {
        gdk.panel.open(PanelId.TavernPanel);
    }

    /**
     * 打开精彩活动界面
     * @param param systemId
     */
    openWonderfulActivityView(param: any) {
        let sysId;
        if (param) {
            if (param instanceof Array) sysId = param[0];
            else sysId = param;
        }
        if (!sysId) {
            let cfgs = ConfigManager.getItems(MainInterface_sort_1Cfg);
            cfgs.sort((a, b) => {
                return a.sorting - b.sorting;
            });
            for (let i = 0; i < cfgs.length; i++) {
                if (!cfgs[i].hidden && this.ifSysOpen(cfgs[i].systemid)) {
                    sysId = cfgs[i].systemid;
                    break;
                }
            }
        }
        gdk.panel.setArgs(PanelId.WonderfulActivityView, sysId);
        gdk.panel.open(PanelId.WonderfulActivityView);
    }

    openLoginReward() {
        // let sysIds = [2810];
        // let panelIds = [PanelId.TotalLoginView]
        // for (let i = 0; i < sysIds.length; i++) {
        //     if (this.ifSysOpen(sysIds[i])) {
        //         gdk.panel.open(panelIds[i]);
        //         return;
        //     }
        // }
        gdk.panel.open(PanelId.TotalLoginView);
    }

    openMagicView() {
        let sysIds = [2827];
        let panelIds = [PanelId.SubMagicExchange]
        for (let i = 0; i < sysIds.length; i++) {
            if (this.ifSysOpen(sysIds[i])) {
                gdk.panel.open(panelIds[i]);
                return;
            }
        }
    }

    /**
     * 打开活动界面
     * @param param MainInterface_sort表  id字段
     */
    openActivityMain(param: any) {
        let idx;
        if (param) {
            if (param instanceof Array) idx = param[0];
            else idx = param;
        }
        if (!idx) {
            let cfgs = ConfigManager.getItems(MainInterface_sortCfg);
            cfgs.sort((a, b) => { return a.sorting - b.sorting; });
            for (let i = 0; i < cfgs.length; i++) {
                if (this.ifSysOpen(cfgs[i].systemid)) {
                    idx = cfgs[i].id;
                    break;
                }
            }
        }
        if (gdk.panel.isOpenOrOpening(PanelId.ActivityMainView)) {
            let panel = gdk.panel.get(PanelId.ActivityMainView);
            if (panel) {
                let ctrl = panel.getComponent(ActivityMainViewCtrl);
                ctrl.selectPageById(idx);
            }
            else {
                gdk.panel.setArgs(PanelId.ActivityMainView, idx);
            }
        }
        else {
            gdk.panel.setArgs(PanelId.ActivityMainView, idx);
            gdk.panel.open(PanelId.ActivityMainView);
        }
    }


    /**
    * 打开合服活动界面
    * @param param MainInterface_sort_2表  id字段
    */
    openCombineMain(param: any) {
        let idx;
        if (param) {
            if (param instanceof Array) idx = param[0];
            else idx = param;
        }
        if (!idx) {
            let cfgs = ConfigManager.getItems(MainInterface_sort_2Cfg);
            cfgs.sort((a, b) => { return a.sorting - b.sorting; });
            for (let i = 0; i < cfgs.length; i++) {
                if (this.ifSysOpen(cfgs[i].systemid)) {
                    idx = cfgs[i].id;
                    break;
                }
            }
        }
        if (gdk.panel.isOpenOrOpening(PanelId.CombineMainView)) {
            let panel = gdk.panel.get(PanelId.CombineMainView);
            if (panel) {
                let ctrl = panel.getComponent(CombineMainViewCtrl);
                ctrl.selectPageById(idx);
            }
            else {
                gdk.panel.setArgs(PanelId.CombineMainView, idx);
            }
        }
        else {
            gdk.panel.setArgs(PanelId.CombineMainView, idx);
            gdk.panel.open(PanelId.CombineMainView);
        }
    }

    openAdventureMainView() {
        gdk.panel.open(PanelId.AdventureMainView)
    }

    openAdventureStore() {
        gdk.panel.open(PanelId.AdventureStoreView);
    }

    openAdventureRank() {
        gdk.panel.open(PanelId.AdventureRankView);
    }

    openAdventurePassPort() {
        gdk.panel.open(PanelId.AdventurePassPortView);
    }

    /**打开探宝界面 */
    openTurnDrawView() {
        gdk.panel.open(PanelId.TurntableDrawView);
    }

    /**打开开服福利120抽界面 */
    openKffl() {
        gdk.panel.open(PanelId.KfflActView);
    }

    /**打开通行证界面 */
    openPassPort() {
        // gdk.panel.open(PanelId.PassPort);
        gdk.panel.setArgs(PanelId.TradingPort, 9);
        gdk.panel.open(PanelId.TradingPort);
    }

    /**打开成长基金界面 */
    openGrowthFunds(param?: number) {
        gdk.panel.setArgs(PanelId.FundsView, [param ? param : 1])
        gdk.panel.setArgs(PanelId.TradingPort, 10);
        gdk.panel.open(PanelId.TradingPort);
    }

    /**打开试练塔基金界面 */
    openTowerTunds() {
        gdk.panel.setArgs(PanelId.FundsView, [0])
        gdk.panel.setArgs(PanelId.TradingPort, 10);
        gdk.panel.open(PanelId.TradingPort);
    }

    /**打开一元礼包界面 */
    openOneDollarGift() {
        // gdk.panel.open(PanelId.OneDollarGift);
        gdk.panel.setArgs(PanelId.TradingPort, 13);
        gdk.panel.open(PanelId.TradingPort);
    }

    /**打开特惠周卡 */
    openWeeklyPassPort() {
        gdk.panel.setArgs(PanelId.TradingPort, 11);
        gdk.panel.open(PanelId.TradingPort);
    }

    /**分解界面 */
    openDecomposeView() {
        gdk.panel.open(PanelId.Decompose)
    }

    /**
     * 英雄合成
     */
    openHeroComposeView() {
        // gdk.panel.open(PanelId.HeroComposeView);
        this.openEquipMerge([4]);
    }

    /**
     * 打开抽卡界面 
     * @param params 卡池id
     */
    openLottery(params: any[]) {
        if (!params || params.length == 0) {
            params = null;
        }
        let cfg: LuckydrawCfg = null;
        if (params) {
            cfg = ConfigManager.getItemById(LuckydrawCfg, params[0]);
            if (!this.ifSysOpen(cfg.system) && cfg.act_type !== 0) {
                params[0] = 102;
                cfg = ConfigManager.getItemById(LuckydrawCfg, params[0]);
            }
        }

        let panel = gdk.panel.get(PanelId.Lottery);
        let param = cfg ? cfg.id : null;
        if (gdk.panel.isOpenOrOpening(PanelId.Lottery)) {
            if (panel) {
                let ctrl = panel.getComponent(LotteryViewCtrl);
                param && ctrl.selectPage(param);
            }
            else {
                gdk.panel.setArgs(PanelId.Lottery, param);
            }
        }
        else {
            gdk.panel.open(PanelId.Lottery, null, null, { args: param });
        }
    }

    openGeneLotteryView() {
        gdk.panel.setArgs(PanelId.GeneView, 1);
        gdk.panel.open(PanelId.GeneView);
    }

    openGeneEquipView() {
        gdk.panel.setArgs(PanelId.GeneView, 0);
        gdk.panel.open(PanelId.GeneView);
    }

    openGeneStore() {
        gdk.panel.setArgs(PanelId.GeneView, 1);
        gdk.panel.open(PanelId.GeneView, (node: cc.Node) => {
            let ctrl = node.getComponent(GeneView);
            ctrl.onStoreClick();
        });
    }

    // /**打开合卡界面 */
    // openCompose() {
    //     gdk.panel.open(PanelId.SynthesisPanel)
    // }

    /**英雄重置界面 */
    openHeroReset() {
        gdk.panel.open(PanelId.HeroResetView)
    }

    /**拆解屋 */
    openDisassemble(params: number[] = [0]) {
        gdk.panel.setArgs(PanelId.HeroResetView, params[0]);
        gdk.panel.open(PanelId.HeroResetView);
    }

    /**关闭奖励界面 */
    closeRewardPanel() {
        gdk.panel.hide(PanelId.Reward)
    }

    /**打开签到界面 */
    openSignView(params: any[]) {
        gdk.panel.open(PanelId.Sign)
    }

    /**播放视频 */
    playVideo(params: any[]) {
        if (!params || !params[0]) return;
        let node = new cc.Node();
        let spine = node.addComponent(sp.Skeleton);
        let resId = 'GuideView';
        spine.node.opacity = 0;
        spine.node.active = true;
        spine.skeletonData = null;
        spine.premultipliedAlpha = false;
        gdk.gui.layers.guideLayer.addChild(node, 999);
        gdk.rm.loadRes(resId, params[0], sp.SkeletonData, (res: sp.SkeletonData) => {
            if (!cc.isValid(node)) return;
            // 延时一段时间后消失
            gdk.DelayCall.addCall(() => {
                node.runAction(cc.sequence(
                    cc.fadeOut(0.25),
                    cc.callFunc(() => {
                        // 销毁并回收资源
                        node.destroy();
                        gdk.rm.releaseRes(resId, res);
                    }),
                ));
                GuideUtil.activeGuide('video#complete');
            }, this, params[2] || 1.0);
            // 设置资源及动作
            spine.skeletonData = res;
            spine.loop = true;
            spine.animation = params[1];
            spine.node.runAction(cc.fadeIn(0.25));
        });
    }

    /**关闭所有窗口 */
    backScene() {
        // console.log("hideAllView")
        // gdk.gui.hideAllView(gdk.panel.get(PanelId.MainPanel), gdk.panel.get(PanelId.PveScene))
        let pveScene = gdk.panel.get(PanelId.PveScene)
        if (pveScene) {
            gdk.panel.open(PanelId.PveScene)
            // 销毁MainPanel
            let node: cc.Node = gdk.panel.get(PanelId.MainPanel);
            if (node) {
                node.destroy();
                // 清理node在gui中的引用
                gdk.Timer.frameOnce(3, gdk.gui, gdk.gui.getView);
            }
            return
        }
        let mainPanel = gdk.panel.get(PanelId.MainPanel)
        if (mainPanel) {
            gdk.panel.open(PanelId.MainPanel)
        }
    }

    /**回到基地 */
    openMainPanel(params: any[]) {
        gdk.gui.removeAllPopup()
        gdk.panel.open(PanelId.MainPanel)
    }

    /**打开主线战斗演示 */
    openHangPanel(params: any[]) {
        gdk.panel.open(PanelId.PveReady)
    }

    /**打开竞技场 */
    openArena() {
        gdk.panel.open(PanelId.Arena)
    }

    /**专精 秘境 */
    openMastery(params: any[]) {
        gdk.panel.hide(PanelId.MasteryUp)
        let select = 0
        if (params && params.length > 0) {
            select = params[0]
        }
        // gdk.panel.open(PanelId.Mastery, (node: cc.Node) => {
        //     let comp = node.getComponent(MasteryViewCtrl)
        //     comp.scheduleOnce(() => {
        //         comp.selectType(null, select)
        //     }, 0.1)
        // })
    }


    /**
     * 打開主线页面 选择指定的关卡
     */
    openMainlineSelectStage(sid: number) {
        let cfg = ConfigManager.getItemById(Copy_stageCfg, sid);
        if (!cfg) return;
        let lv = ModelManager.get(RoleModel).level;
        if (cfg.player_lv > lv) {
            gdk.gui.showMessage(`指挥官等级达到${cfg.player_lv}级可进行挑战`);
            return;
        }
        let model = ModelManager.get(CopyModel);
        let cityData = model.getCityData(CopyUtil.getChapterId(sid), cfg.copy_id == 7 ? 1 : 0);
        if (!cityData || !cityData.stageDatas) {
            CC_DEBUG && cc.error(`找不到 ${sid} 的章节配置`);
            return;
        }
        cityData.stageDatas.some(data => {
            if (data.stageCfg.id != sid) return false;
            if (data.state == StageState.Lock) {
                gdk.gui.showMessage(`${data.cityId}-${data.sid}未解锁`);
                return true;
            }
            if (data.stageCfg.copy_id == 7 && data.state == StageState.Pass) {
                gdk.gui.showMessage(`${data.cityId}-${data.sid}已通关`);
                return true;
            }
            gdk.panel.open(PanelId.EnterStageView, (node: cc.Node) => {
                let ctrl = node.getComponent(EnterStageViewCtrl);
                ctrl.updateData(data);
            });
            return true;
        });
    }

    openChampionView(params: number) {
        gdk.panel.open(
            [PanelId.ChampionRankView,
            PanelId.ChampionReportView,
            PanelId.ChampionExchangeView,
            PanelId.ChampionGradeView,
            PanelId.ChampionGuessView
            ][params]
        );
    }

    /**
     * 锦标赛
     */
    openChampion() {
        gdk.panel.open(PanelId.ChampionshipEnterView);
    }

    /**
     * 打开支援中心
     * @param params 1-永恒水晶 2-神器强化 3-能量站 4-协战联盟 5-军团 
     */
    openSupportView(params?: number[]) {
        if (params && params.length == 1) {
            let node = gdk.panel.get(PanelId.SupportMainView);
            if (node) {
                let ctrl = node.getComponent(SupportMainViewCtrl);
                ctrl.selectPanel(params[0]);
                return;
            }
            gdk.panel.setArgs(PanelId.SupportMainView, params[0]);
        }
        gdk.panel.open(PanelId.SupportMainView);
    }

    openKfLoginView() {
        gdk.panel.open(PanelId.KfLoginView);
    }

    openCrossActListView() {
        gdk.panel.open(PanelId.CrossActListView);
    }

    openExpeditionMainView() {
        if (!this.ifSysOpen(2922, true) || ModelManager.get(RoleModel).guildId <= 0) {
            return;
        }
        gdk.panel.open(PanelId.GuildMain, (node: cc.Node) => {
            JumpUtils.openPanel({
                panelId: PanelId.ExpeditionMainView,
                currId: PanelId.GuildMain
            })
        })
    }

    openExpeditionHeroDetailView(id: number) {
        gdk.panel.open(PanelId.ExpeditionHeroDetailView, (node: cc.Node) => {
            let ctrl = node.getComponent(ExpeditionHeroDetailViewCtrl);
            ctrl.initHeroInfo(id);
        })
    }

    /**
     * 打开商店
     * 无参数 商店界面
     * Secret = 0,//神秘商店
     * Gold = 1,//金币
     * Diamond = 2,//钻石
     * Gift = 3,//礼包
     */
    openStore(params: any[], callback?: Function) {
        // let n = gdk.gui.getCurrentView().getComponent(gdk.BasePanel)
        // if (n && n.config) {
        //     n.config.tempHidemode = gdk.HideMode.DISABLE
        // }
        let panel = gdk.panel.get(PanelId.Store)
        let select = 0
        if (params && params.length > 0) {
            select = params[0]
        }
        if (panel) {
            let comp = panel.getComponent(StoreViewCtrl)
            comp.menuBtnSelect(null, select)
            callback && callback()
        } else {
            gdk.panel.open(PanelId.Store, (node: cc.Node) => {
                let comp = node.getComponent(StoreViewCtrl)
                comp.menuBtnSelect(null, select)
                callback && callback()
            })
        }
    }

    /*金币购买道具商店  0奸商 1荣誉 2 友谊 3装备 4公会商店*/
    openItemStore(params: any[]) {
        let select = 0
        if (params && params.length > 0) {
            select = params[0]
        }
        gdk.panel.open(PanelId.Store, (node: cc.Node) => {
            let comp = node.getComponent(StoreViewCtrl)
            comp.menuBtnSelect(null, 0)
            comp.typeBtnSelect(null, select)
        })
    }

    /*
    参数格式 [商店大类,标签类型]
    0 为 神秘商店 1 为 积分商店
     -------------------------
    0类型
    BlackStore = 0,//黑市
    Hero = 1,//英雄积分
    Arena = 2,//竞技（竞技场）
    Turntable = 3,//探宝积分
    Guild = 4,//公会积分
    Survival = 5,//生存积分
    Rune = 6,//符文积分
    Costume = 7,// 神装
    --------------------------
    1类型
    Team = 0, //组队赛
    Siege = 1,//丧尸攻城
    Guardian = 2,//护使秘境
    ArenaHonor = 3,//荣耀赛积分
    Expedition = 4,//团队远征
    Ultimate = 5,//终极试炼
    */
    openScoreStore(params: any[]) {
        let select = 0
        let type = 0
        if (params && params.length > 1) {
            select = params[0]
            type = params[1]
        } else {
            return
        }
        gdk.panel.open(PanelId.Store, (node: cc.Node) => {
            let comp = node.getComponent(StoreViewCtrl)
            comp.menuBtnSelect(null, select)
            comp.typeBtnSelect(null, type)
        })
    }

    /*特权卡商店*/
    openCardStore(params: any[]) {
        let select = 0
        if (params && params.length > 0) {
            select = params[0]
        }
        gdk.panel.open(PanelId.Store, (node: cc.Node) => {
            let comp = node.getComponent(StoreViewCtrl)
            comp.menuBtnSelect(null, 3)
            comp.typeBtnSelect(null, select)
        })
    }

    /**充值界面 */
    openRechargeView(params: any[]) {
        let select = 0
        if (params && params.length > 0) {
            select = params[0]
        }
        gdk.panel.setArgs(PanelId.Recharge, select);
        gdk.panel.open(PanelId.Recharge);
    }

    /**充值界面礼包--对应标签 参数[type,giftId?] */
    openRechargetLBPanel(params: any[]) {
        let tabIndex = 0
        if (params && params.length > 0) {
            tabIndex = params[0]
        }
        let storeModel = ModelManager.get(StoreModel)
        if (params[1] && params[1] == -1 && storeModel.giftJumpId) {
            params[1] = storeModel.giftJumpId;
            storeModel.giftJumpId = null;
        }
        gdk.panel.setArgs(PanelId.Recharge, 1);
        gdk.panel.open(PanelId.Recharge, () => {
            let panel = gdk.panel.get(PanelId.RechargeLB);
            if (panel) {
                let ctrl = panel.getComponent(RechargeLBCtrl)
                ctrl.typeBtnSelect(null, tabIndex)
                params[1] && ctrl.scrollToGift(params[1]);
            }
            else {
                gdk.panel.open(PanelId.RechargeLB, (node) => {
                    let ctrl = node.getComponent(RechargeLBCtrl)
                    ctrl.typeBtnSelect(null, tabIndex)
                    params[1] && ctrl.scrollToGift(params[1]);
                })
            }
        });
    }

    /**魔方商店--对应标签 参数 */
    openRechargetMFPanel(params: any[]) {
        // let tabIndex = 0
        // if (params && params.length > 0) {
        //     tabIndex = params[0]
        // }
        // gdk.panel.setArgs(PanelId.TradingPort, 7);
        // gdk.panel.open(PanelId.TradingPort, () => {
        //     let panel = gdk.panel.get(PanelId.RechargeMF);
        //     if (panel) {
        //         let c = panel.getComponent(RechargeMFCtrl);
        //         c.onBtnSelect(null, tabIndex);
        //     }
        //     else {
        //         if (gdk.panel.isOpenOrOpening(PanelId.RechargeMF)) {
        //             gdk.panel.setArgs(PanelId.RechargeMF, tabIndex);
        //         }
        //         else {
        //             gdk.panel.setArgs(PanelId.RechargeMF, tabIndex);
        //             gdk.panel.open(PanelId.RechargeMF);
        //         }
        //     }
        // });
        this.openStore([3]);
    }

    /**点金界面 */
    openAlchemyView(params: any[]) {
        gdk.panel.open(PanelId.Alchemy);
    }

    /**评分系统 */
    openScoreSysView() {
        gdk.panel.open(PanelId.ScoreSytemView)
    }

    /**超值月卡 */
    openMonthCardView() {
        gdk.panel.setArgs(PanelId.TradingPort, 12);
        gdk.panel.open(PanelId.TradingPort);
    }

    openGrowTaskView() {
        gdk.panel.setArgs(PanelId.GrowMenuView, 0);
        gdk.panel.open(PanelId.GrowMenuView);
    }

    openGeneralWeaponView() {
        if (this.ifSysOpen(2814, true)) {
            // gdk.panel.setArgs(PanelId.GrowMenuView, 1);
            // gdk.panel.open(PanelId.GrowMenuView);
            let cfg = ConfigManager.getItemByField(General_weaponCfg, 'chapter', ModelManager.get(TaskModel).weaponChapter);
            if (cfg) {
                gdk.panel.open(PanelId.GeneralWeaponTask);
            }
            else {
                gdk.panel.open(PanelId.GeneralWeaponUpgradePanel);
                // this.openSupportView([2]);
            }
        }
    }

    /**
     * 打开末日自走棋
     */
    openPiecesMain(params: any[]) {
        if (!JumpUtils.ifSysOpen(2914)) {
            return;
        }
        gdk.panel.open(PanelId.PiecesMain);
    }

    /**
    * 打开跨服活动界面
    */
    openCServerActivityMain(params: any[]) {

        let id = 0;
        if (params && params.length > 0) {
            id = params[0]
        }
        if (id > 0) {
            let cfg = ConfigManager.getItemById(MainInterface_sortCfg, id);
            if (!JumpUtils.ifSysOpen(cfg.systemid)) {
                return;
            }
            gdk.panel.setArgs(PanelId.CServerActivityMainView, id);
        }
        gdk.panel.open(PanelId.CServerActivityMainView);
    }

    /**
    * 打开新幸运扭蛋界面
    */
    openLuckTwistBtnClick() {
        if (!JumpUtils.ifSysOpen(2902)) {
            return;
        }
        gdk.panel.open(PanelId.LuckyTwistMain);
    }

    /**
     * 打开7天活动
     */
    open7dActivity(params: any[]) {
        gdk.panel.open(PanelId.SevenDays);
    }

    /**
     * 打开每日充值
     */
    openDailyRecharge() {
        gdk.panel.open(PanelId.DailyFirstRecharge);
    }

    /**
     * 打开日常任务
     * @param params 
     */
    openDailyMission(params: any[]) {
        gdk.panel.open(PanelId.Task);
    }

    /**
     * 打开首充
     * @param params 
     */
    openFirstPayGift(params?: number[]) {
        let storeModel = ModelManager.get(StoreModel);
        if (!SdkTool.tool.can_charge || storeModel._hasGetFirstPayReward() || !JumpUtils.ifSysOpen(1801, false)) {
            // 充值过而且已经领取了奖励，隐藏首充按钮
            return
        }
        let index = (params instanceof Array) ? params[0] : void 0;
        if (!cc.js.isNumber(index)) {
            let cfgs = ConfigManager.getItems(Store_first_payCfg);
            index = storeModel.firstPayList.length + 1;
            if (index > cfgs.length) {
                // 如果已经达成所有首充条件，则忽略
                let cfg = GuideUtil.getCurGuide();
                if (cfg) {
                    // 判断是否有关于首充界面的引导
                    let cond = `popup#${PanelId.FirstPayGift.__id__}#close#bymyself`;
                    if (cfg.finishCondition == cond) {
                        GuideUtil.activeGuide(cond);
                    }
                }
                return;
            }
        }
        this.openPanelAfter(
            PanelId.FirstPayGift,
            [
                PanelId.MainLevelUpTip,
                PanelId.FunctionOpen,
                PanelId.Sign,
                PanelId.AskPanel,
            ],
            {
                args: index,
            },
        );
    }

    /**打开 开服冲榜奖励界面 */
    openKfcbView(params: any[]) {
        let roleModel = ModelManager.get(RoleModel)
        let kfcb_cfg = ConfigManager.getItemById(GlobalCfg, "kfcb_lv_time").value
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()
        let endTime = serverOpenTime + 3600 * 24 * kfcb_cfg[1] - serverTime
        if (roleModel.level >= kfcb_cfg[0] && endTime > 0) {
            gdk.panel.open(PanelId.KfcbActView)
        }
    }

    /**
     * 打开好友
     * 无参数 好友界面
     * [0] 好友
     * [1] 申请
     * [2] 添加
     * [3] 添加
     */
    openFriend(params: any[]) {
        // let n = gdk.gui.getCurrentView().getComponent(gdk.BasePanel)
        // if (n && n.config) {
        //     n.config.tempHidemode = gdk.HideMode.DISABLE
        // }
        let panel = gdk.panel.get(PanelId.Friend)
        let select = 0
        if (params && params.length > 0) {
            select = params[0]
        }
        if (panel) {
            let comp = panel.getComponent(FriendViewCtrl)
            comp.selectPanel(null, select)
        } else {
            gdk.panel.open(PanelId.Friend, (node: cc.Node) => {
                let comp = node.getComponent(FriendViewCtrl)
                comp.selectPanel(null, select)
            })
        }
    }

    /**排行 */
    openRank(params: any[]) {
        gdk.panel.open(PanelId.Rank)
    }

    /**邮件 */
    openMail(params: any[]) {
        gdk.panel.open(PanelId.Mail)
    }

    /**公会 */
    openGuild(params: any[]) {
        let model = ModelManager.get(RoleModel)
        if (model.guildId > 0) {
            gdk.panel.open(PanelId.GuildMain)
        } else {
            gdk.panel.setArgs(PanelId.GuildList, true)
            gdk.panel.open(PanelId.GuildList)
        }
    }

    /* 公会据点战*/
    openGuildFootHold() {
        NetManager.on(icmsg.GuildDetailRsp.MsgType, this._openGuildFh, this)
        let model = ModelManager.get(RoleModel)
        if (model.guildId > 0) {
            gdk.panel.open(PanelId.GuildMain)
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP52"))
        }
    }

    _openGuildFh() {
        NetManager.off(icmsg.GuildDetailRsp.MsgType, this._openGuildFh, this)
        let panel = gdk.panel.get(PanelId.GuildMain);
        if (panel) {
            let ctrl = panel.getComponent(GuildMainCtrl);
            ctrl.openFootHoldView()
        }
    }

    openGuildRank() {
        gdk.panel.open(PanelId.GuildListRankView);
    }

    openGuildMail() {
        gdk.panel.open(PanelId.GuildMailSendView);
    }

    openGuildBoss() {
        if (!this.ifSysOpen(2835) || ModelManager.get(RoleModel).guildId <= 0) {
            return;
        }
        let panel = gdk.panel.get(PanelId.GuildMain);
        if (panel) {
            let ctrl = panel.getComponent(GuildMainCtrl);
            ctrl.openGuildBossFight();
        }
        else {
            if (gdk.panel.isOpenOrOpening(PanelId.GuildMain)) {
                if (!GuildUtils.isHoldCamp()) {
                    gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP53"))
                    return
                }
                gdk.panel.open(PanelId.GuildBossView);
            }
            else {
                gdk.panel.open(PanelId.GuildMain, (node: cc.Node) => {
                    let ctrl = node.getComponent(GuildMainCtrl);
                    ctrl.openGuildBossFight();
                })
            }
        }
    }

    openGuildPowerView() {
        if (!this.ifSysOpen(2835, true) || ModelManager.get(RoleModel).guildId <= 0) {
            return;
        }
        gdk.panel.open(PanelId.GuildPowerView)
    }

    /**遗迹之证界面 */
    openRelicTradingPort() {
        if (!JumpUtils.ifSysOpen(2894, true)) {
            return
        }
        gdk.panel.open(PanelId.RelicTradingPortView)
    }

    /**丧尸攻城排名界面 */
    openSiegeMainView() {
        if (ModelManager.get(RoleModel).guildId > 0) {
            gdk.panel.open(PanelId.SiegeMainView)
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP52"))
        }
    }

    /**丧尸挑战界面 */
    openSiegeFightView() {
        if (ModelManager.get(RoleModel).guildId > 0) {
            gdk.panel.open(PanelId.SiegeFightView)
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP52"))
        }
    }

    /**公会据点战排名界面 */
    openFootholdRankView() {
        if (ModelManager.get(RoleModel).guildId > 0) {
            gdk.panel.open(PanelId.GuildMain, () => {
                let mainView = gdk.panel.get(PanelId.GuildMain)
                if (mainView) {
                    let ctrl = mainView.getComponent(GuildMainCtrl)
                    ctrl.openGlobalFootHold(() => {
                        gdk.panel.open(PanelId.FHResultView)
                    })
                }
            })
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP52"))
        }
    }

    /**公会据点战 打开竞猜界面 */
    openFootholdGuess() {
        if (ModelManager.get(RoleModel).guildId > 0) {
            gdk.panel.open(PanelId.GuildMain, () => {
                let mainView = gdk.panel.get(PanelId.GuildMain)
                if (mainView) {
                    let ctrl = mainView.getComponent(GuildMainCtrl)
                    ctrl.openGlobalFootHold(() => {
                        gdk.panel.open(PanelId.FHCrossGuessView)
                    })
                }
            })
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP52"))
        }
    }

    /**公会据点战 */
    openFootholdMainView() {
        if (ModelManager.get(RoleModel).guildId > 0) {
            gdk.panel.open(PanelId.GuildMain, () => {
                let mainView = gdk.panel.get(PanelId.GuildMain)
                if (mainView) {
                    let ctrl = mainView.getComponent(GuildMainCtrl)
                    ctrl.openGlobalFootHold()
                }
            })
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP52"))
        }
    }


    openCaveMainView() {
        gdk.panel.open(PanelId.CaveMain);
    }

    /**大地图 */
    openWorldMap(params: any[]) {
        gdk.panel.open(PanelId.WorldMapView);
    }

    openSubInstanceEliteView() {
        gdk.panel.open(PanelId.SubInstanceEliteView);
    }


    /**打开在线奖励 */
    openOnlineReward() {
        gdk.panel.open(PanelId.OnlineRewardPanel);
    }

    /**
     * 城市地图
     * @param params  0-故事模式 1-精英关卡 
     */
    openCityMap(params: any[]) {
        switch (params[0]) {
            case 0:
                gdk.panel.open(PanelId.CityMapView);
                break;
            case 1:
                let model = ModelManager.get(CopyModel);
                let lastEliteStageId = model.eliteStageCfgs[0].id; //初始精英关卡
                if (model.eliteStageData) {
                    let data = model.eliteStageData[model.eliteStageData.length - 1];
                    if (data && data != 0) lastEliteStageId = data;
                }
                gdk.panel.open(PanelId.CityMapView, (node) => {
                    let ctrl = node.getComponent(CityMapViewCtrl);
                    ctrl.curCityId = CopyUtil.getChapterId(lastEliteStageId);
                    ctrl.initData(1);
                });
                break;
            default:
                break;
        }
    }

    /**镜头位移跟踪 指定主线关卡 */
    trackCity(params: any[]) {
        let guideCfg = GuideUtil.getCurGuide();
        if (!guideCfg) return;
        let targetSid = parseInt(guideCfg.bindBtnId) || null;
        if (!targetSid) return;
        let panel = gdk.panel.get(PanelId.CityMapView);
        if (!panel) {
            gdk.panel.open(PanelId.CityMapView, (node) => {
                let ctrl: CityMapViewCtrl;
                ctrl = node.getComponent(CityMapViewCtrl);
                ctrl.moveToCenter(targetSid);
            })
        }
        else {
            let ctrl: CityMapViewCtrl;
            ctrl = panel.getComponent(CityMapViewCtrl);
            ctrl.moveToCenter(targetSid);
        }
    }

    /**指定大地图某个章节入口平移到屏幕中心 */
    trackChapter(params: any[]) {
        let guideCfg = GuideUtil.getCurGuide();
        if (!guideCfg) return;
        let targetChapterId = parseInt(guideCfg.bindBtnId) || null;
        if (!targetChapterId) return;
        let panel = gdk.panel.get(PanelId.WorldMapView);
        if (!panel) {
            gdk.panel.open(PanelId.CityMapView, (node) => {
                let ctrl: WorldMapViewCtrl;
                ctrl = node.getComponent(WorldMapViewCtrl);
                let cityData = ctrl.getCityDataById(targetChapterId);
                if (cityData) {
                    cityData.isTrack = true;
                    ctrl.moveToCenter(cityData);
                }
            })
        }
        else {
            let ctrl: WorldMapViewCtrl;
            ctrl = panel.getComponent(WorldMapViewCtrl);
            let cityData = ctrl.getCityDataById(targetChapterId);
            if (cityData) {
                cityData.isTrack = true;
                ctrl.moveToCenter(cityData);
            }
        }
    }

    /**解锁最新章节 */
    unLockNewChapter(params: any[]) {
        let guideCfg = GuideUtil.getCurGuide();
        if (!guideCfg) return;
        let targetChapterId = parseInt(guideCfg.bindBtnId) || null;
        if (!targetChapterId) return;
        let panel = gdk.panel.get(PanelId.WorldMapView);
        if (!panel) {
            gdk.panel.open(PanelId.WorldMapView, (node) => {
                let ctrl: WorldMapViewCtrl;
                ctrl = node.getComponent(WorldMapViewCtrl);
                ctrl.unLockNewChapter(targetChapterId);
            })
        }
        else {
            let ctrl: WorldMapViewCtrl;
            ctrl = panel.getComponent(WorldMapViewCtrl);
            ctrl.unLockNewChapter(targetChapterId);
        }
    }

    /**
     * 关闭窗口
     * @param args 
     */
    closePanel(params?: any[]) {
        if (!params || !params.length) {
            // 关闭所有弹窗
            let excludes = [
                PanelId.MainDock,
                PanelId.MainTopInfoView,
                PanelId.MiniChat,
                PanelId.GrowTaskBtnView,
            ];
            Object.values(PanelId).forEach((i: gdk.PanelValue) => {
                if (excludes.indexOf(i) !== -1) return;
                if (i.isPopup && gdk.panel.isOpenOrOpening(i)) {
                    gdk.panel.hide(i);
                }
            });
            return;
        }
        // 关闭指定的界面
        params.forEach(i => gdk.panel.hide(i));
    }

    /**
     * 打开指定界面，并可指定关闭参数和是否预加载等
     */
    openPanel(args: {
        panelId: number | string | gdk.PanelValue,
        panelArgs?: gdk.PanelOption,
        callback?: (node?: cc.Node) => void,
        currId?: number | string | gdk.PanelValue | cc.Node,
        hideArgs?: gdk.PanelHideArg,
        preload?: boolean | number | string | gdk.PanelValue,
        tempHideMode?: gdk.HideMode,
        blockInput?: boolean,
    }) {
        // 支持配置文件中的数组形式参数
        if (args instanceof Array) {
            args = {
                panelId: args[0],
                panelArgs: args[1],
                callback: args[2],
                currId: args[3],
                hideArgs: args[4],
                preload: args[5],
                tempHideMode: args[6],
                blockInput: args[7],
            };
        }
        // 读取参数
        let {
            panelId, panelArgs, callback, currId, hideArgs, preload, tempHideMode, blockInput,
        } = args;
        (preload === void 0) && (preload = true);
        // 要打开的界面
        let config: gdk.PanelValue;
        if (cc.js.isNumber(panelId) || cc.js.isString(panelId)) {
            config = gdk.PanelId.getValue(panelId);
        } else {
            config = panelId as any;
        }
        if (config) {
            // 当前打开的界面
            let currCfg: gdk.PanelValue;
            if (currId !== void 0) {
                if (cc.js.isNumber(currId) || cc.js.isString(currId)) {
                    currCfg = gdk.PanelId.getValue(currId);
                } else if (currId instanceof cc.Node) {
                    currId = gdk.Tool.getResIdByNode(currId);
                    currCfg = gdk.PanelId.getValue(currId);
                } else {
                    currCfg = currId as any;
                }
                if (currCfg && tempHideMode !== void 0) {
                    currCfg.tempHidemode = tempHideMode;
                }
            }
            // 将要打开的界面的onHide参数
            if (hideArgs === void 0) {
                // 默认的返回参数
                if (currCfg) {
                    let currNode = gdk.panel.get(currCfg);
                    if (currNode) {
                        let currPanel = currNode.getComponent(gdk.BasePanel);
                        if (currPanel && currPanel.hideArgs) {
                            hideArgs = currPanel.hideArgs;
                        }
                    }
                    config.onHide = hideArgs || { id: currCfg.__id__ };
                }
            } else {
                // 保存自定义的返回参数
                config.onHide = hideArgs;
            }
            // 阻止输入显示遮罩
            if (blockInput) {
                this.showGuideMask();
            }
            // 打开需要打开的界面
            gdk.panel.open(
                panelId,
                (node: cc.Node) => {
                    // 隐藏遮罩
                    if (blockInput) {
                        this.hideGuideMask();
                    }
                    // 回调
                    callback && callback(node);
                    // 关闭当前正打开的界面
                    if (currCfg && currCfg !== config) {
                        gdk.panel.hide(currCfg);
                        // 添加预加载
                        if (tempHideMode === void 0 && preload) {
                            gdk.DelayCall.addCall(() => {
                                if (preload === true) {
                                    // 保留预制体资源，使返回时更快打开
                                    gdk.panel.preload(currCfg);
                                } else if (preload !== false) {
                                    // 加载指定的资源
                                    gdk.panel.preload(preload);
                                }
                            }, this, 0.8);
                        }
                    }
                },
                null,
                panelArgs,
            );
        }
    }

    /**
     * 打开panelId界面，如果preId当前为正打开或打开状态，则待preId关闭后再打开
     * @param panelId 
     * @param preId 
     * @param panelOpt
     */
    openPanelAfter(
        panelId: gdk.PanelValue,
        preIds: gdk.PanelValue[],
        panelOpt?: gdk.PanelOption,
        callback?: (node?: cc.Node) => void,
        thisArg?: any,
    ) {
        // 设置参数
        if (panelOpt && panelOpt.args && panelOpt.args instanceof Array) {
            gdk.panel.setArgs(panelId, ...panelOpt.args);
            delete panelOpt.args;
        }
        if (gdk.panel.isOpenOrOpening(panelId)) {
            // 界面已经打开状态，则不做任何操作
            return;
        }
        // 创建索引对象
        let aid = '__open_panel_after__';
        let after = this[aid];
        if (!after) {
            after = this[aid] = {};
        }
        let pid = panelId.__id__;
        let funcs: { [id: string]: Function } = after[pid];
        if (!funcs) {
            funcs = after[pid] = {};
        }
        // 正在打开的界面
        let nopre = true;
        let ids = {};
        preIds.forEach(val => {
            if (!gdk.panel.isOpenOrOpening(val)) return;
            let vid = val.__id__;
            ids[vid] = true;
            nopre = false;
            // preId如果是否打开中或已打开
            let key = `${val.isPopup ? 'popup' : 'view'}#${vid}#close`;
            // 移除旧监听
            let func = funcs[key];
            if (func) {
                gdk.e.off(key, func, this);
            }
            // 添加界面关闭监听
            func = funcs[key] = () => {
                delete funcs[key];
                delete ids[vid];
                if (Object.keys(ids).length == 0) {
                    delete after[pid];
                    if (Object.keys(after).length == 0) {
                        delete this[aid];
                    }
                    gdk.panel.open(panelId, callback, thisArg, panelOpt);
                }
            };
            gdk.e.once(key, func, this);
        });
        if (nopre) {
            // 直接打开
            gdk.panel.open(panelId, callback, thisArg, panelOpt);
        }
    }

    /**
     * 显示战力提示
     * @param oldp 
     * @param newp 
     */
    updatePowerTip(oldp: number, newp: number) {
        if (newp <= oldp) {
            // 战力下降不显示
            return;
        }
        if (gdk.panel.isOpenOrOpening(PanelId.MainPowerTip)) {
            gdk.panel.hide(PanelId.MainPowerTip);
        }
        gdk.DelayCall.addCall(this._updatePowerTipLater, this, 0.5, [oldp, newp]);
    }

    /**
     * 延时显示战力提示
     * @param oldp 
     * @param newp 
     */
    private _updatePowerTipLater(oldp: number, newp: number) {
        this.openPanelAfter(
            PanelId.MainPowerTip,
            [
                PanelId.Achieve,
                PanelId.StarUpdateSuccess2,
                PanelId.CareerAdvanceTipCtrl2,
                PanelId.ChangeJobResult,
                PanelId.RoleUpgradeSkillEffect,
                PanelId.GWeaponUpgradeSucView,
                PanelId.UniqueEquipStarUpdateEffect,
            ],
            {
                args: [oldp, newp],
                parent: gdk.gui.layers.messageLayer,
            },
        );
    }

    /**
     * 显示成就提示
     */
    updateAchieveTip() {
        let model = ModelManager.get(TaskModel);
        if (model.newAchieves.length < 0) {
            return;
        }
        gdk.DelayCall.addCall(this._updateAchieveTipLater, this, 0.5);
    }

    /**
     * 延迟显示成就提示
     */
    private _updateAchieveTipLater() {
        this.openPanelAfter(PanelId.Achieve, [PanelId.MainPowerTip]);
    }

    /**
     * 打开回放列表界面
     * @param stageId
     */
    openReplayListView(stageId: number) {
        this.openPanel({ panelId: PanelId.ReplayView, panelArgs: { args: [stageId] } });
    }

    /**
     * 战斗回放
     * @param fight_id 
     * @param fromId
     */
    replayFight(fight_id: number, fromId?: string | number | gdk.PanelValue | cc.Node, info?: icmsg.FightBrief) {
        let key = 'fight_replay_msg_' + fight_id;
        let rmsg = gdk.Cache.get(key);
        if (rmsg) {
            this._onReplayFightRsp(rmsg, fromId);
        } else {
            gdk.gui.showWaiting('', "pvp_replay_request");
            // 查询战斗回放信息
            let qmsg = new icmsg.FightReplayReq();
            qmsg.fightId = fight_id;
            NetManager.send(qmsg, (rmsg: icmsg.FightReplayRsp) => {
                // 查询战斗回放信息返回
                this._onReplayFightRsp(rmsg, fromId, info);
                // 缓存网络包10分钟后清除
                gdk.Cache.put(key, rmsg, 10 * 60);
                gdk.gui.hideWaiting("pvp_replay_request");
            });
        }
    }

    /**赏金回放 */
    bountyReplay(rmsg: icmsg.FightReplayRsp) {
        this._onReplayFightRsp(rmsg)
    }

    /**
     * 打开PVP副本
     */
    openPvpCopyScene(stage: Copy_stageCfg) {

    }


    /**打开组队竞技场 */
    openArenaTeamView() {
        if (!JumpUtils.ifSysOpen(2877)) {
            return;
        }
        gdk.panel.open(PanelId.ArenaTeamView)
    }

    /**
     * 打开冒险日记
     */
    openDiaryView() {
        if (!JumpUtils.ifSysOpen(2858)) {
            return;
        }
        gdk.panel.open(PanelId.DiaryView);
    }

    // 获得回放数据返回处理
    private _onReplayFightRsp(rmsg: icmsg.FightReplayRsp, fromId?: string | number | gdk.PanelValue | cc.Node, info?: icmsg.FightBrief) {
        let stageConfig = CopyUtil.getStageConfig(rmsg.stageId);
        if (!stageConfig) {
            cc.error(`找不到 id: ${rmsg.stageId} 的副本配置`);
            return;
        }
        // 塔防战斗回放界面正在打开中
        if (gdk.panel.isOpenOrOpening(PanelId.PveReplay)) {
            let node = gdk.panel.get(PanelId.PveReplay);
            if (node) {
                // 回放界面已经打开的情况下
                let ctrl = node.getComponent(PveReplayCtrl);
                ctrl.rmsg = rmsg;
                ctrl.updateTitle(info);
                ctrl.heroes = null;
                ctrl.general = null;
                ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_RESTART);
            } else {
                // 正在打开，设置打开参数
                gdk.panel.setArgs(PanelId.PveReplay, [rmsg, info]);
            }
        } else {
            // 打开回放界面
            this.openPanel({
                panelId: PanelId.PveReplay,
                panelArgs: { args: [rmsg, info] },
                currId: fromId || gdk.gui.getCurrentView(),
            });
        }
    }

    /**
     * 打开塔防竞技战斗
     * @param args 
     * @param name 
     * @param type 
     */
    openPveArenaScene(args: any[], name: string, type: 'FOOTHOLD' | 'ARENA' | 'CHAMPION_GUESS' | 'CHAMPION_MATCH' | 'RELIC' | "VAULT" | "ENDRUIN" | 'ARENATEAM' | 'PEAK' | 'FOOTHOLD_GATHER' | 'GUARDIANTOWER' | 'PIECES_CHESS' | 'PIECES_ENDLESS' | 'ARENAHONOR_GUESS' | 'WORLDHONOR_GUESS' | 'ROYAL' | 'ROYAL_TEST') {
        let bossId = 1;
        let power = 0;
        let arr: Copy_stageCfg[];
        let interval: number;
        let pvpRivalPlayerId: number;
        switch (type) {
            case 'CHAMPION_MATCH':
                let championModel = ModelManager.get(ChampionModel);
                let mainCfg = ConfigManager.getItemByField(Champion_mainCfg, 'season', championModel.infoData.seasonId);
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == mainCfg.stage_id[0];
                });
                bossId = mainCfg.bossborn[0];
                break;

            case 'FOOTHOLD':
            case "FOOTHOLD_GATHER":
                let index = ModelManager.get(FootHoldModel).activityIndex
                let mapType = ModelManager.get(FootHoldModel).curMapData.mapType
                let saveStr = "foothold_local_map"
                if (mapType == 4) {
                    saveStr = 'foothold_corss_map'
                }
                let mapData = GlobalUtil.getLocal(`${saveStr}#${mapType}#${index}`);
                if (!mapData) {
                    mapData = FootHoldUtils.getFootHoldMapData(mapType, index)
                    GlobalUtil.setLocal(`${saveStr}#${mapType}#${index}`, mapData)
                }
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == mapData[0]
                });
                bossId = mapData[2];
                pvpRivalPlayerId = args[3];
                break;

            case 'RELIC':
                let relicModel = ModelManager.get(RelicModel);
                let t = parseInt(relicModel.curAtkCity.split('-')[0]);
                let cityId = parseInt(relicModel.curAtkCity.split('-')[1]);
                let d = RelicUtils.getPointMapData(t, cityId);
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == d[0];
                });
                bossId = d[2];
                pvpRivalPlayerId = args[0];
                break;

            case 'ARENATEAM':
                // 组队竞技场
                let atcfg = ConfigManager.getItemById(GlobalCfg, 'teamarena_invoke').value;
                let atval = MathUtil.shuffle(atcfg)[0] as string;
                let atarr = atval.split(',');
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == parseInt(atarr[0]);
                });
                bossId = parseInt(atarr[1]);
                break;

            case 'PEAK':
                // 巅峰之战
                let pkcfg = ConfigManager.getItemById(GlobalCfg, 'peak_invoke').value;
                let pkval = MathUtil.shuffle(pkcfg)[0] as string;
                let pkarr = pkval.split(',');
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == parseInt(pkarr[0]);
                });
                bossId = parseInt(pkarr[1]);
                break;
            case 'GUARDIANTOWER':
                //护使秘境
                let temModel = ModelManager.get(GuardianTowerModel)
                let guardianVal = MathUtil.shuffle(temModel.curCfg.copy_id)[0] as string;
                let guardianArr = guardianVal.split(',');
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == parseInt(guardianArr[0]);
                });
                bossId = parseInt(guardianArr[1]);
                break
            case 'PIECES_CHESS':
                //自走棋
                let m = ModelManager.get(PiecesModel);
                let id = ConfigManager.getItemByField(Pieces_initialCfg, 'team', m.computerTeamId, { power_type: 2 }).stage_id;
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == id;
                });
                let c = ConfigManager.getItems(Pieces_power1Cfg);
                let rewardType = Math.min(c[c.length - 1].type, m.curRewardType);
                power = ConfigManager.getItemByField(Pieces_power1Cfg, 'round', 1, { type: rewardType }).general;
                bossId = 1;
                interval = -1;
                break;
            case 'PIECES_ENDLESS':
                //自走棋 无尽模式
                let m1 = ModelManager.get(PiecesModel);
                let id1 = ConfigManager.getItemByField(Pieces_initialCfg, 'team', m1.computerTeamId, { power_type: 1 }).stage_id;
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == id1;
                });
                let c2 = ConfigManager.getItems(Pieces_power2Cfg);
                let type = Math.min(c2[c2.length - 1].type, m1.curRewardType);
                let pCfg = ConfigManager.getItemByField(Pieces_power2Cfg, 'round', m1.startRound + 1, { type: type });
                power = pCfg.endless * pCfg.monster_power / 100;
                bossId = 1;
                interval = -1;
                break;
            case 'ARENAHONOR_GUESS':
                let curPro = ArenaHonorUtils.getCurProgressId();
                let cfg = ConfigManager.getItemById(Arenahonor_progressCfg, curPro);
                if (cfg) {
                    arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                        return item.copy_id == CopyType.NONE && item.id == cfg.pvp[0];
                    });
                    bossId = cfg.pvp[1]
                } else {
                    arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                        return item.copy_id == CopyType.NONE && item.id < 100 && item.id % 10 == 0;
                    });
                    bossId = 1;
                }
                break;
            case 'WORLDHONOR_GUESS':
                let curProId = WorldHonorUtils.getCurProgressId();
                let cfg1 = ConfigManager.getItemById(Arenahonor_worldwideCfg, curProId);
                if (cfg1) {
                    arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                        return item.copy_id == CopyType.NONE && item.id == cfg1.pvp[0];
                    });
                    bossId = cfg1.pvp[1]
                } else {
                    arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                        return item.copy_id == CopyType.NONE && item.id < 100 && item.id % 10 == 0;
                    });
                    bossId = 1;
                }
                break;
            case 'ROYAL':
                let rM = ModelManager.get(RoyalModel);
                let sceneId = rM.playerData.maps[rM.curFightNum];
                let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, sceneId)
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == sceneCfg.stage_id;
                });
                bossId = 1;
                interval = -1;
                break;
            case 'ROYAL_TEST':
                let rM1 = ModelManager.get(RoyalModel);
                let sceneCfg1 = ConfigManager.getItemById(Royal_sceneCfg, rM1.testSceneId)
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id == sceneCfg1.stage_id;
                });
                bossId = 1;
                interval = -1;
                break;
            default:
                // 普通竞技模式
                arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                    return item.copy_id == CopyType.NONE && item.id < 100 && item.id % 10 == 0;
                });
                bossId = 1;
                pvpRivalPlayerId = args[0];
                break;
        }
        let stageCfg: Copy_stageCfg = MathUtil.shuffle(arr)[0];
        let model = new PveSceneModel();
        //model.id = stageCfg.id;
        model.pvpRivalPlayerId = pvpRivalPlayerId;
        model.arenaSyncData = {
            args: args,
            defenderName: name,
            fightType: type,
            pwoer: power,
            waveTimeOut: 1,
            bossId: bossId,
            bossTimeOut: interval ? interval : ConfigManager.getItemById(Pve_bossbornCfg, 1).interval,
            mainModel: model,
            mirrorModel: null,
        };
        model.id = stageCfg.id;
        this.openPanel({
            panelId: PanelId.PveScene,
            currId: gdk.gui.getCurrentView(),
            blockInput: true,
            panelArgs: { args: model },
        });
    }

    openPvpDefenderScene(args: any[], name: string, type: 'FOOTHOLD' | 'ARENA' | 'CHAMPION_GUESS' | 'CHAMPION_MATCH' | 'RELIC' | "VAULT" | "ENDRUIN" | 'ARENATEAM' | 'PEAK' | 'FOOTHOLD_GATHER' | 'GUARDIANTOWER' | 'ARENAHONOR_GUESS' | 'WORLDHONOR_GUESS' | 'ROYAL' | 'ROYAL_TEST') {
        let bossId = 1;
        //let arr: Copy_stageCfg[];
        let stageId: number;
        let heroModel = ModelManager.get(HeroModel)
        switch (type) {
            case 'CHAMPION_MATCH':
                stageId = heroModel.getDefenderStageId(4)
                break;
            case 'FOOTHOLD':
                stageId = heroModel.getDefenderStageId(2)
                break;

            case 'RELIC':
                stageId = heroModel.getDefenderStageId(3)
                break;

            case 'ARENATEAM':
                // 组队竞技场
                stageId = heroModel.getDefenderStageId(5)
                break;
            case 'ARENAHONOR_GUESS':
                // 组队竞技场
                stageId = heroModel.getDefenderStageId(6)
                break;
            case 'WORLDHONOR_GUESS':
                // 组队竞技场
                stageId = heroModel.getDefenderStageId(6)
                break;
            case 'ROYAL':
                let rM = ModelManager.get(RoyalModel);
                let sceneId = rM.defenderSceneId;
                let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, sceneId)
                stageId = sceneCfg.stage_id + 1;
                break;
            default:
                // 普通竞技模式
                stageId = heroModel.getDefenderStageId(1)
                bossId = 1;
                break;
        }
        let model = new PveSceneModel();
        model.isDefender = true;
        model.id = stageId;
        model.arenaSyncData = {
            args: args,
            defenderName: name,
            fightType: type,
            pwoer: 0,
            waveTimeOut: 1,
            bossId: bossId,
            bossTimeOut: ConfigManager.getItemById(Pve_bossbornCfg, 1).interval,
            mainModel: model,
            mirrorModel: null,
        };
        this.openPanel({
            panelId: PanelId.PvpDefender,
            currId: gdk.gui.getCurrentView(),
            blockInput: true,
            panelArgs: { args: model },
        });
    }


    //打开小游戏场景
    openLittleGameScene() {
        let stageId: number = 1;
        let model = new PveLittleGameModel();
        model.id = stageId;
        let hpNum = ConfigManager.getItemByField(Little_game_globalCfg, 'key', 'general_blood').value[0];
        model.generalHp = hpNum
        model.enterGeneralHp = hpNum
        gdk.panel.setArgs(PanelId.PveLittleGameView, model)
        this.openPanel({
            panelId: PanelId.PveLittleGameView,
            currId: gdk.gui.getCurrentView(),
            blockInput: true,
            panelArgs: { args: model },
        });
    }

}

const JumpUtils = gdk.Tool.getSingleton(JumpUtilsClass);
export default JumpUtils;

// 调试用代码，方便调试
CC_DEBUG && (window['JumpUtils'] = JumpUtils);