import { Copycup_heroCfg, Copycup_rookieCfg, Copy_assistCfg, Pve_demo2Cfg, Royal_sceneCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { BagItem } from '../../../../common/models/BagModel';
import CopyModel, { CopyType } from '../../../../common/models/CopyModel';
import HeroModel from '../../../../common/models/HeroModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import { AskInfoCacheType, AskInfoType } from '../../../../common/widgets/AskPanel';
import PanelId from '../../../../configs/ids/PanelId';
import GuideBind from '../../../../guide/ctrl/GuideBind';
import PeakModel from '../../../act/model/PeakModel';
import NewAdventureModel from '../../../adventure2/model/NewAdventureModel';
import NewAdventureUtils from '../../../adventure2/utils/NewAdventureUtils';
import MercenaryModel from '../../../mercenary/model/MercenaryModel';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveTool from '../../utils/PveTool';
import PveSceneBaseAction from '../base/PveSceneBaseAction';

/**
 * PVE英雄塔布署动作
 * @Author: sthoo.huang
 * @Date: 2019-04-11 13:59:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-22 10:39:48
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSceneDeploymentAction", "Pve/Scene")
export default class PveSceneDeploymentAction extends PveSceneBaseAction {

    @property({ tooltip: "是否塔位推荐显示提示" })
    showTowerTip: boolean = false;

    onEnter() {
        super.onEnter();
        let model = this.model;

        if (this.model.isMirror) {
            let list = []
            let type = this.model.arenaSyncData.fightType
            if (type == 'ARENA' || type == 'FOOTHOLD' || type == 'RELIC' || type == 'CHAMPION_MATCH' || type == 'ARENATEAM' || type == 'GUARDIANTOWER') {
                list = this.model.arenaDefenderHeroList;
                let infos: BagItem[] = [];
                for (let i = 0; i < list.length; i++) {
                    let h = list[i]
                    if (h == null) {
                        infos.push(null);
                    } else {
                        let item = HeroUtils.createHeroBagItemBy(h);
                        let info = item.extInfo as icmsg.HeroInfo;
                        item.series = 900000 + info.heroId;
                        infos.push(item);
                        this.model.heroMap[item.series] = h;
                    }
                }
                this.deployOne(infos, 0);

                return;
            }
            if (type == 'ROYAL') {
                let rModel = ModelManager.get(RoyalModel)
                let infos: BagItem[] = [];
                let data = rModel.defendPlayerFightData.heroList.concat()
                let tem = rModel.curFightNum * 3
                for (let i = tem; i < tem + 3; i++) {
                    let h = data[i]
                    if (h == null) {
                        infos.push(null);
                    } else {
                        let item = HeroUtils.createHeroBagItemBy(h);
                        let info = item.extInfo as icmsg.HeroInfo;
                        item.series = 900000 + info.heroId;
                        infos.push(item);
                        this.model.heroMap[item.series] = h;
                    }
                }
                this.deployOne(infos, 0);
                return;
            } else if (type == 'ROYAL_TEST') {
                let rModel = ModelManager.get(RoyalModel)
                let temHeroList: number[] = GlobalUtil.getLocal('Royal_setUpHero_atk');
                if (!temHeroList) {
                    temHeroList = [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
                let data = temHeroList.concat()
                let a = data.splice(rModel.curFightNum * 3, 3)
                let maxPower = 0;
                let maxStar = 3;
                let maxLv = 1;
                a.forEach(id => {
                    if (id > 0) {
                        let d = HeroUtils.getHeroItemByHeroId(id);
                        if (d) {
                            let tem = d.extInfo as icmsg.HeroInfo
                            if (tem.power > maxPower) {
                                maxPower = tem.power;
                                maxLv = tem.level;
                                maxStar = tem.star;
                            }
                        }
                    }
                })
                let infos: BagItem[] = [];
                let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, rModel.testSceneId)
                for (let i = 0, n = sceneCfg.robot.length; i < n; i++) {
                    let data1 = sceneCfg.robot[i];
                    let heroId = data1[0];
                    let carrId = data1[2];
                    let temFight = HeroUtils.createTestHeroFightHero(heroId, carrId, maxStar, maxLv);
                    let item = HeroUtils.createHeroBagItemBy(temFight);
                    let info = item.extInfo as icmsg.HeroInfo;
                    item.series = 900000 + info.heroId;
                    infos.push(item);
                    this.model.heroMap[item.series] = temFight;
                }
                this.deployOne(infos, 0);
                // sceneCfg.robot.forEach(data1 => {
                //     let heroId = data1[0];
                //     let carrId = data1[2];
                //     let temFight = HeroUtils.createTestHeroFightHero(heroId, carrId, maxStar, maxLv);
                //     let item = HeroUtils.createHeroBagItemBy(temFight);
                //     let info = item.extInfo as icmsg.HeroInfo;
                //     item.series = 900000 + info.heroId;
                //     infos.push(item);
                //     this.model.heroMap[item.series] = temFight;
                // })
                // this.deployOne(infos, 0);
                return;
            }

        }

        if (this.model.isDemo) {
            let cfgs = ConfigManager.getItems(Pve_demo2Cfg);
            let infos: BagItem[] = []
            cfgs.forEach(cfg => {
                let tem = HeroUtils.createDemoHeroBagItemBy(cfg.hero_id);
                let data = HeroUtils.createDemoHeroFightHero(cfg.hero_id);
                let series = cfg.hero_id % 300000 + 800000;
                this.model.heroMap[series] = data;
                infos.push(tem);
            })
            this.deployOne(infos, 0);
            return;
        }

        if (this.model.isDefender) {
            let rModel = ModelManager.get(RoyalModel)
            let heroModel = ModelManager.get(HeroModel)
            let type = heroModel.curDefendType;
            let infos: BagItem[] = []
            if (this.model.arenaSyncData.fightType == 'ROYAL') {
                let data: BagItem[] = heroModel.CurTypePvpdefenderSetUpHero(type);
                let tem = rModel.scenneIndex * 3
                for (let i = tem; i < tem + 3; i++) {
                    let h = data[i]
                    if (h == null) {
                        infos.push(null);
                    } else {
                        infos.push(h);
                    }
                }
            } else {
                infos = heroModel.CurTypePvpdefenderSetUpHero(type);
            }
            this.deployOne(infos, 0);
            return;
        }


        if (this.model.stageConfig.copy_id == CopyType.NewAdventure) {
            // 赏金
            let advModel = ModelManager.get(NewAdventureModel)
            if (advModel.copyType == 0) {
                advModel.normalFightHeroList.forEach(h => {
                    if (h && h.heroId > 0) {
                        //let item = NewAdventureUtils.createHeroBagItemBy(h);
                        //let info = item.extInfo as icmsg.HeroInfo;
                        //item.series = info.heroId;
                        this.model.heroMap[h.heroId] = h;
                    }
                });
            }
        }

        // 奖杯新手模式
        if (model.stageConfig.copy_id == CopyType.RookieCup) {
            let a: number[] = new Array(model.towers.length);
            for (let i = 0, n = a.length; i < n; i++) {
                a[i] = -1;
            }

            let temCfg = ConfigManager.getItem(Copycup_rookieCfg, { 'stage_id': model.stageConfig.id });

            for (let i = 1; i <= 6; i++) {
                let towerStr = 'tower_' + i;
                let heroIds = temCfg[towerStr];
                if (heroIds.length == 1) {
                    let heroCfg = ConfigManager.getItemById(Copycup_heroCfg, heroIds[0]);
                    a[i - 1] = heroCfg.id;
                    let info = HeroUtils.createCopyCupHeroFightHero(heroIds[0]);
                    let series = heroCfg.hero_id % 300000 + 800000;
                    this.model.heroMap[series] = info;
                } else if (heroIds.length > 0) {
                    heroIds.forEach(id => {
                        let cfg = ConfigManager.getItemById(Copycup_heroCfg, id)
                        let data = HeroUtils.createCopyCupHeroFightHero(id);
                        let series = cfg.hero_id % 300000 + 800000;
                        this.model.heroMap[series] = data;
                    })
                }
            }
            let copyModel = ModelManager.get(CopyModel);
            if (copyModel.cupCopyUpHeroList['' + this.model.stageConfig.id]) {
                a = copyModel.cupCopyUpHeroList['' + this.model.stageConfig.id];
            }

            this.startDeploy(a);
            return;
        }

        // 生存训练
        if (model.stageConfig.copy_id == CopyType.Survival && model.stageConfig.subtype == 1) {
            let copyModel = ModelManager.get(CopyModel)
            let a: number[] = new Array(model.towers.length);
            for (let i = 0, n = a.length; i < n; i++) {
                a[i] = -1;
            }
            let haveSave = false;
            if (copyModel.SurvivalCopyUpHeroList['' + model.stageConfig.subtype]) {
                haveSave = true;
                a = copyModel.SurvivalCopyUpHeroList['' + model.stageConfig.subtype];
            }
            if (haveSave) {
                this.startDeploy(a);
                return;
            }
        }


        if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'PEAK' && !model.isMirror) {
            let peakModel = ModelManager.get(PeakModel)
            // let a: number[] = new Array(model.towers.length);
            // let haveSave = false;
            // if (peakModel.peakCopyUpHeroList['1']) {
            //     haveSave = true;
            //     a = peakModel.peakCopyUpHeroList['1']
            // }
            // if (haveSave) {
            //     this.startDeploy(a);
            //     return;
            // }

            peakModel.arenaHeroList.forEach(h => {
                if (h.heroId > 0) {
                    let item = HeroUtils.createHeroBagItemBy(h);
                    let info = item.extInfo as icmsg.HeroInfo;
                    item.series = info.heroId;
                    this.model.heroMap[item.series] = h;
                }
            });
        }

        //皇家竞技场进攻阵容
        if (model.stageConfig.copy_id == CopyType.NONE && (model.arenaSyncData.fightType == 'ROYAL' || model.arenaSyncData.fightType == 'ROYAL_TEST') && !model.isMirror) {
            let rModel = ModelManager.get(RoyalModel)
            let temHeroList: number[] = GlobalUtil.getLocal('Royal_setUpHero_atk')
            if (!temHeroList) {
                temHeroList = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
            let data = temHeroList.concat()
            let a = data.splice(rModel.curFightNum * 3, 3)
            this.startDeploy(a);
            this.deployOne([], 0);
            return;
        }
        // 竞技场镜像战斗
        if (model.stageConfig.copy_id == CopyType.NONE && model.isMirror) {
            this.startDeploy();
            return;
        }

        // 赏金副本
        if (model.isBounty) {
            this.startDeploy();
            return;
        }

        if (this.model.stageConfig.copy_id == CopyType.Mystery) {
            // 神秘者活动
            let infos: BagItem[] = [];
            for (let i = 0, n = model.towers.length; i < n; i++) {
                infos.push(null)
            }
            this.deployOne(infos, 0);
            return;
        }
        // 其他副本
        this.startDeploy();
    }

    onExit() {
        super.onExit();
        gdk.DelayCall.cancel(this.deployOne, this);
        gdk.DelayCall.cancel(this.finish, this);
    }

    // 请求上阵英雄的属性数据
    startDeploy(a?: number[]) {
        (a === void 0) && (a = this.model.readBuildTower());
        let model = this.model;
        let heroMap = model.heroMap;
        let arr: BagItem[] = [];
        let heroIds: number[] = [];
        let max = PveTool.getMaxHeroNum(model);
        // 上阵英雄
        let count = 0;
        for (let i = 0, n = model.towers.length; i < n; i++) {
            let t = model.towers[i];
            let d: BagItem;
            let id = a[t.id - 1];
            if (id > 600000 && id < 700000) {
                // 雇佣的英雄，雇佣英雄序号
                ModelManager.get(MercenaryModel).borrowedListHero.some(hero => {
                    if (id != hero.index + 600000) {
                        return false;
                    }
                    // 创建BagItem数据
                    d = HeroUtils.createMercenaryHeroBagItem(hero);
                    return true;
                });
                // 找不到对应的雇佣兵，此处应该有异常
                if (!d) {
                    CC_DEBUG && cc.error(`找不到上阵列表中的雇佣兵 index: ${id}`);
                }
            } else if (id > 0) {
                if (model.stageConfig.copy_id == CopyType.RookieCup ||
                    model.stageConfig.copy_id == CopyType.ChallengeCup) {
                    // 奖杯模式
                    d = HeroUtils.createCopyCupHeroBagItem(id);

                } else if (model.stageConfig.copy_id == CopyType.NONE &&
                    model.arenaSyncData.fightType == 'PEAK' && !model.isMirror) {
                    // 奖杯模式
                    let peakModel = ModelManager.get(PeakModel);
                    peakModel.arenaHeroList.forEach(h => {
                        if ((id + 300000) == h.heroId) {
                            d = HeroUtils.createHeroBagItemBy(h);
                            let info = d.extInfo as icmsg.HeroInfo;
                            d.series = info.heroId;
                        }
                    })

                } else if (model.stageConfig.copy_id == CopyType.NewAdventure) {

                    let adModel = ModelManager.get(NewAdventureModel);
                    if (adModel.copyType == 0) {
                        adModel.normalFightHeroList.forEach(h => {
                            if (h && id == h.heroId) {
                                let tem = NewAdventureUtils.getHireHero(h.heroId)
                                d = NewAdventureUtils.createHeroBagItem(tem);
                                let info = d.extInfo as icmsg.HeroInfo;
                                d.series = info.heroId;
                            }
                        })
                    } else {
                        if (!t.hero) {
                            d = HeroUtils.getHeroItemByHeroId(id);
                        } else {
                            d = t.hero.model.item;
                        }
                        if (d) {
                            let info = d.extInfo as icmsg.HeroInfo;
                            if (!heroMap[info.heroId]) {
                                heroIds.push(info.heroId);
                            }
                        }
                    }
                } else if (model.isBounty) {
                    // 赏金副本
                    model.bountyMission.heroList.some(h => {
                        if (id != h.typeId % 300000 + 700000) {
                            return false;
                        }
                        d = HeroUtils.createHeroBagItemBy(h);
                        d.series = id;
                        return true;
                    });

                } else if (id < 600000) {
                    // 自己的英雄，英雄的typeId
                    if (!t.hero) {
                        d = HeroUtils.getHeroItemByHeroId(id);
                    } else {
                        d = t.hero.model.item;
                    }
                    if (d) {
                        let info = d.extInfo as icmsg.HeroInfo;
                        if (!heroMap[info.heroId]) {
                            heroIds.push(info.heroId);
                        }
                    }
                }
            }
            arr[i] = d;
            // 判断是否还有剩余的位置
            if (d) {
                count++;
                if (count >= max && model.stageConfig.copy_id != CopyType.RookieCup) {
                    break;
                }
            }
        }
        // 判断是否显示英雄的攻击范围
        if (heroIds.length > 0) {
            model.showAtkDis = heroIds.length <= 2;
            HeroUtils.getFightHeroInfo(heroIds, true, (heroList) => {
                if (!cc.isValid(this.node)) return;
                heroList.forEach(r => {
                    let h = r as icmsg.FightHero;
                    heroMap[h.heroId] = h;
                });
                this.deployOne(arr, 0);
            });
        } else {
            this.deployOne(arr, 0);
        }
    }

    // 部署一个英雄
    deployOne(arr: BagItem[], i: number) {
        if (!this.model) return;
        if (!cc.isValid(this.node)) return;
        let stageId = this.model.id;
        let cfgs = ConfigManager.getItems(Copy_assistCfg, { 'stage_id': stageId });
        let tower = this.model.towers[i];
        let assist = cfgs && cfgs.some(cfg => cfg.pos - 1 == i) && !this.model.isDemo;
        if (tower) {
            if (assist) {
                // 此位置是否需要预留给助阵英雄
                if (tower.hero &&
                    tower.hero.model.item.series >= 0
                ) {
                    tower.hero = null;
                }
            } else {
                let data: BagItem = arr[i];
                if (data) {
                    tower.setHeroByItem(data);
                } else {
                    let model = this.model;
                    if (model.stageConfig.copy_id == CopyType.RookieCup ||
                        model.stageConfig.copy_id == CopyType.ChallengeCup ||
                        model.stageConfig.copy_id == CopyType.Mystery) {
                        tower.setHeroByItem(null)
                    }
                }
            }
        }
        if (i < arr.length) {
            // 下一个
            gdk.DelayCall.addCall(this.deployOne, this, 0, [arr, i + 1]);
        } else {
            // 所有已完成，保存上阵数据
            this.model.saveBuildTower();
            // 查找heroMap中是否有可上阵的临时助阵英雄
            cfgs && cfgs.forEach(cfg => {
                let series = 1000000 + cfg.hero_id % 300000;
                let info = this.model.heroMap[series];
                if (info) {
                    let tower = this.model.towers[cfg.pos - 1];
                    if (tower && (
                        !tower.hero ||
                        tower.hero.model.heroId != info.heroId
                    )) {
                        tower.setHeroByItem(HeroUtils.createAssistHeroBagItem(info, cfg));
                        tower.hero.isAssist = true;
                        JumpUtils.pauseFight();
                        // 打开助战上阵界面
                        gdk.panel.open(
                            PanelId.PveAssistComming,
                            null, null,
                            {
                                args: [cfg]
                            }
                        );

                    }
                }
            });
            if (this.showTowerTip && !this.model.isBounty) {
                // 检测塔座上的英雄和推荐是否匹配
                let check = false;
                let activeCondition = ""
                this.model.towers.forEach(buildTower => {
                    if (buildTower.isSoldierType) {
                        if (!buildTower.hero || buildTower.hero.model.soldierType != buildTower.soldierTypeNum) {
                            //cc.log('塔座(' + buildTower.id + ')-----没有反正推荐的类型：' + buildTower.soldierTypename[buildTower.soldierTypeNum + ''])
                            //给不符合推荐职业的塔位添加引导脚本
                            let guide = buildTower.node.getComponent(GuideBind);
                            if (!guide) {
                                guide = buildTower.node.addComponent(GuideBind)
                            }
                            let number = 1400 + buildTower.id;
                            guide.guideIds = [number]
                            check = true;
                            guide.bindBtn()
                            if (activeCondition == "") {
                                activeCondition = "buildTower#" + buildTower.id;
                            }
                        }
                    }
                });
                if (this.model.stageConfig.copy_id == CopyType.NONE && (this.model.arenaSyncData.fightType == 'ARENATEAM' ||
                    this.model.arenaSyncData.fightType == 'ARENAHONOR_GUESS' ||
                    this.model.arenaSyncData.fightType == 'WORLDHONOR_GUESS')) {
                    check = false;
                }
                if (check) {
                    let info: AskInfoType = {
                        title: gdk.i18n.t("i18n:TIP_TITLE"),
                        sureText: gdk.i18n.t("i18n:PVE_TOWER_CHECK_CANCEL"),
                        sureCb: () => {
                            this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
                            GuideUtil.activeGuide(activeCondition);
                        },
                        closeText: gdk.i18n.t("i18n:PVE_TOWER_CHECK_OK"),
                        closeCb: () => {
                            this.finish();
                        },
                        closeBtnCb: () => {
                            this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
                        },
                        descText: gdk.i18n.t("i18n:PVE_TOWER_CHECK_TITLE"),
                        thisArg: this,
                        isShowTip: true,
                        tipSaveCache: AskInfoCacheType.tower_check_tip,
                    }
                    GlobalUtil.openAskPanel(info);
                } else {
                    // 完成当前动作
                    gdk.DelayCall.addCall(this.finish, this, 0.25);
                }
            } else {
                // 完成当前动作
                gdk.DelayCall.addCall(this.finish, this, 0.25);
            }
        }
    }
}