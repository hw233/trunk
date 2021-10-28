import { Adventure_hireCfg, Copy_assistCfg, SoldierCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import ArenaHonorModel from '../../../../common/models/ArenaHonorModel';
import { BagItem } from '../../../../common/models/BagModel';
import HeroModel from '../../../../common/models/HeroModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import WorldHonorModel from '../../../../common/models/WorldHonorModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../../act/model/PeakModel';
import AdventureModel from '../../../adventure/model/AdventureModel';
import AdventureUtils from '../../../adventure/utils/AdventureUtils';
import NewAdventureModel from '../../../adventure2/model/NewAdventureModel';
import NewAdventureUtils from '../../../adventure2/utils/NewAdventureUtils';
import ArenaTeamViewModel from '../../../arenaTeam/model/ArenaTeamViewModel';
import ExpeditionModel from '../../../guild/ctrl/expedition/ExpeditionModel';
import FootHoldModel from '../../../guild/ctrl/footHold/FootHoldModel';
import MercenaryModel from '../../../mercenary/model/MercenaryModel';
import PveBuildTowerCtrl from '../../ctrl/fight/PveBuildTowerCtrl';
import PveTool from '../../utils/PveTool';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import CopyModel, { CopyType } from './../../../../common/models/CopyModel';

/**
 * PVE一键布阵动作
 * @Author: sthoo.huang
 * @Date: 2019-04-11 13:59:32
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-25 16:07:24
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSceneOneKeyAction", "Pve/Scene")
export default class PveSceneOneKeyAction extends PveSceneBaseAction {

    @property({ tooltip: "是否显示提示" })
    showTip: boolean = true;

    onEnter() {
        super.onEnter();

        // 赏金副本
        if (this.model.isBounty) {
            let infos: BagItem[] = [];
            this.model.bountyMission.heroList.forEach(h => {
                let item = HeroUtils.createHeroBagItemBy(h);
                let info = item.extInfo as icmsg.HeroInfo;
                item.series = 700000 + info.heroId;
                infos.push(item);
            });
            this.predeploy(infos);
            return;
        }

        // 奖杯新手模式
        let copy_id = this.model.stageConfig.copy_id;
        if (copy_id == CopyType.RookieCup) {
            this.finish();
            return;
        }

        // 奖杯挑战模式
        if (copy_id == CopyType.ChallengeCup) {
            this.finish();
            return;
        }
        // 神秘者活动
        if (copy_id == CopyType.Mystery) {
            this.finish();
            return;
        }

        if (this.model.isDemo) {
            this.finish();
            return;
        }
        //防御阵营设置界面
        if (this.model.isDefender) {
            this.finish()
            return;
        }

        // 竞技场镜像战斗
        if (copy_id == CopyType.NONE) {
            if (this.model.isMirror) {
                let type = this.model.arenaSyncData.fightType;

                if (type == 'ARENA' ||
                    type == 'FOOTHOLD' ||
                    type == 'RELIC' ||
                    type == 'CHAMPION_MATCH' ||
                    type == 'ARENATEAM' ||
                    type == 'GUARDIANTOWER' ||
                    type == 'ROYAL' ||
                    type == 'ROYAL_TEST') {
                    this.finish()
                    return;
                }

                let list = []
                switch (this.model.arenaSyncData.fightType) {
                    case 'CHAMPION_GUESS':
                        list = this.model.championGuessFightInfos[1].heroList
                        break;
                    case 'ARENAHONOR_GUESS':
                        let cM = ModelManager.get(ArenaHonorModel);
                        list = cM.player2Fight.heroList
                        break;
                    case 'WORLDHONOR_GUESS':
                        let wM = ModelManager.get(WorldHonorModel);
                        list = wM.player2Fight.heroList
                        break;
                    case 'CHAMPION_MATCH':
                    case 'ARENA':
                    case 'FOOTHOLD':
                    case 'VAULT':
                    case 'RELIC':
                    case 'ARENATEAM':
                    case 'PEAK':
                    case 'FOOTHOLD_GATHER':
                    case 'GUARDIANTOWER':
                        list = this.model.arenaDefenderHeroList;
                        break
                    case 'PIECES_CHESS':
                    case 'PIECES_ENDLESS':
                        list = this.model.piecesFightInfos[0].heroList;
                        break;
                }
                //let list = this.model.arenaSyncData.fightType == 'CHAMPION_GUESS' ? this.model.championGuessFightInfos[1].heroList : this.model.arenaDefenderHeroList;
                let infos: BagItem[] = [];
                list.forEach(h => {
                    let item = HeroUtils.createHeroBagItemBy(h);
                    let info = item.extInfo as icmsg.HeroInfo;
                    item.series = 900000 + info.heroId;
                    if (info.heroId > 0 && info.typeId > 0) {
                        infos.push(item);
                        this.model.heroMap[item.series] = h;
                    }
                });
                this.predeploy(infos);

                return;
            }
            else {
                if (this.model.arenaSyncData.fightType == 'CHAMPION_GUESS') {
                    let infos: BagItem[] = [];
                    this.model.championGuessFightInfos[0].heroList.forEach(h => {
                        let item = HeroUtils.createHeroBagItemBy(h);
                        let info = item.extInfo as icmsg.HeroInfo;
                        item.series = 800000 + info.heroId;
                        infos.push(item);
                        this.model.heroMap[item.series] = h;
                    });
                    this.predeploy(infos);
                    return;
                } else if (this.model.arenaSyncData.fightType == 'ARENAHONOR_GUESS') {
                    let cM = ModelManager.get(ArenaHonorModel);
                    let infos: BagItem[] = [];
                    cM.player1Fight.heroList.forEach(h => {
                        let item = HeroUtils.createHeroBagItemBy(h);
                        let info = item.extInfo as icmsg.HeroInfo;
                        item.series = 800000 + info.heroId;
                        infos.push(item);
                        this.model.heroMap[item.series] = h;
                    });
                    this.predeploy(infos);
                    return;
                } else if (this.model.arenaSyncData.fightType == 'WORLDHONOR_GUESS') {
                    let cM = ModelManager.get(WorldHonorModel);
                    let infos: BagItem[] = [];
                    cM.player1Fight.heroList.forEach(h => {
                        let item = HeroUtils.createHeroBagItemBy(h);
                        let info = item.extInfo as icmsg.HeroInfo;
                        item.series = 800000 + info.heroId;
                        infos.push(item);
                        this.model.heroMap[item.series] = h;
                    });
                    this.predeploy(infos);
                    return;
                } else if (this.model.arenaSyncData.fightType == 'ARENATEAM') {
                    let infos: BagItem[] = [];
                    let atM = ModelManager.get(ArenaTeamViewModel);
                    atM.arenaHeroList.forEach(h => {
                        let item = HeroUtils.createHeroBagItemBy(h);
                        let info = item.extInfo as icmsg.HeroInfo;
                        item.series = 800000 + info.heroId;
                        infos.push(item);
                        this.model.heroMap[item.series] = h;
                    });
                    this.predeploy(infos);
                    return;
                }
                else if (this.model.arenaSyncData.fightType == 'PEAK') {
                    let infos: BagItem[] = [];
                    let peakModel = ModelManager.get(PeakModel);
                    let a = this.model.readBuildTower();


                    peakModel.arenaHeroList.forEach(h => {
                        if (h.heroId > 0) {
                            let item = HeroUtils.createHeroBagItemBy(h);
                            let info = item.extInfo as icmsg.HeroInfo;
                            item.series = info.heroId;
                            infos.push(item);
                            this.model.heroMap[item.series] = h;
                        }
                    });
                    if (infos.length > 0) {
                        this.predeploy(infos);
                    } else {
                        this.finish();
                    }
                    return;
                } else if (this.model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
                    let fhModel = ModelManager.get(FootHoldModel)
                    let index = fhModel.gatherFightTeamMatesIndex
                    let infos: BagItem[] = [];
                    fhModel.gatherTeamMates[index].heroList.forEach(h => {
                        let item = HeroUtils.createHeroBagItemBy(h);
                        let info = item.extInfo as icmsg.HeroInfo;
                        item.series = 800000 + info.heroId;
                        infos.push(item);
                        this.model.heroMap[item.series] = h;
                    });
                    this.predeploy(infos);
                    return
                } else if (this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
                    let infos: BagItem[] = [];
                    this.model.piecesFightInfos[1].heroList.forEach(h => {
                        let item = HeroUtils.createHeroBagItemBy(h);
                        let info = item.extInfo as icmsg.HeroInfo;
                        item.series = 800000 + info.heroId;
                        infos.push(item);
                        this.model.heroMap[item.series] = h;
                    });
                    this.predeploy(infos);
                    return
                } else if (this.model.arenaSyncData.fightType == 'ROYAL' || this.model.arenaSyncData.fightType == 'ROYAL_TEST') {
                    let rModel = ModelManager.get(RoyalModel)
                    let temHeroList: number[] = GlobalUtil.getLocal('Royal_setUpHero_atk')
                    let data = temHeroList.concat()
                    let a = data.splice(rModel.curFightNum * 3, 3);

                    let infos: BagItem[] = [];
                    let reqIds = []
                    for (let i = 0; i < a.length; i++) {

                        if (a[i] > 0) {
                            let bagItem = HeroUtils.getHeroInfoBySeries(a[i]);
                            if (bagItem) {
                                infos.push(bagItem);
                            }
                            if (!this.model.heroMap[a[i]]) {
                                reqIds.push(a[i])
                            }
                        }
                    }
                    if (reqIds.length == 0) {
                        this.predeploy(infos);
                        return;
                    }

                    HeroUtils.getFightHeroInfo(reqIds, true, (heroList: icmsg.FightHero[]) => {
                        if (!this.active) return;
                        heroList.forEach(h => this.model.heroMap[h.heroId] = h);
                        this.predeploy(infos);
                    });
                    return
                }
            }
        }

        if (copy_id == CopyType.Survival && this.model.stageConfig.subtype == 1) {

            let copyModel = ModelManager.get(CopyModel)
            if (copyModel.SurvivalCopyUpHeroList['' + this.model.stageConfig.subtype]) {
                this.finish();
                return;
            }

            let infos: BagItem[] = [];
            let heroData: icmsg.SurvivalHeroesInfo[] = ModelManager.get(CopyModel).survivalStateMsg.heroes;
            heroData.forEach(data => {
                if (data.typeId == 0) {
                    let item = HeroUtils.getHeroInfoBySeries(data.heroId);
                    if (item) {
                        infos.push(item);
                    }
                } else {
                    //添加雇佣兵数据
                    ModelManager.get(MercenaryModel).borrowedListHero.forEach(hero => {
                        // 创建BagItem数据
                        if (hero.index == data.heroId) {
                            let item = HeroUtils.createMercenaryHeroBagItem(hero)
                            infos.push(item);
                        }
                    });
                }
            });
            this.predeploy(infos);
            return;
        }

        //探险副本 
        if (copy_id == CopyType.Adventure) {
            let advModel = ModelManager.get(AdventureModel)
            let infos: BagItem[] = [];
            let heroIds = GlobalUtil.getLocal("Adventure_setUpHero_pve") || []
            if (heroIds.length == 0) {
                heroIds = ModelManager.get(HeroModel).PveUpHeroList
            }
            let reqIds = []
            advModel.pveHireHeros = {}
            for (let i = 0; i < heroIds.length; i++) {
                if (heroIds[i] > 900000) {
                    let hero = AdventureUtils.getHireHero(heroIds[i])
                    if (hero) {
                        let hireCfg = ConfigManager.getItemByField(Adventure_hireCfg, "group", hero.group, { hero: hero.typeId })
                        //还有剩余次数可用
                        if (hero.useTimes < hireCfg.hire_times) {
                            let bagItem = AdventureUtils.createHeroBagItemBy(hero)
                            advModel.pveHireHeros[heroIds[i]] = AdventureUtils.getHireHero(heroIds[i])
                            if (bagItem) {
                                infos.push(bagItem);
                            }
                            let info = AdventureUtils.createHeroFightHero(hero);
                            this.model.heroMap[heroIds[i]] = info;
                        }
                    }
                } else {
                    if (heroIds[i] > 0) {
                        let bagItem = HeroUtils.getHeroInfoBySeries(heroIds[i]);
                        if (bagItem) {
                            infos.push(bagItem);
                        }
                        if (!this.model.heroMap[heroIds[i]]) {
                            reqIds.push(heroIds[i])
                        }
                    }
                }
            }

            if (reqIds.length == 0) {
                this.predeploy(infos);
                return;
            }

            HeroUtils.getFightHeroInfo(reqIds, true, (heroList: icmsg.FightHero[]) => {
                if (!this.active) return;
                heroList.forEach(h => this.model.heroMap[h.heroId] = h);
                this.predeploy(infos);
            });
            return;
        }
        //新奇境探险副本 
        if (copy_id == CopyType.NewAdventure) {
            // 
            let adModel = ModelManager.get(NewAdventureModel)
            if (adModel.copyType == 0) {
                adModel.normalFightHeroList.forEach(h => {
                    if (h && h.heroId > 0) {
                        this.model.heroMap[h.heroId] = h;
                    }
                });
                let heroIds = GlobalUtil.getLocal("Adventure2_setUpHero_pve") || []
                if (heroIds.length == 0) {
                    heroIds = adModel.upHerosId//ModelManager.get(HeroModel).PveUpHeroList
                }
                let infos: BagItem[] = [];
                for (let i = 0; i < heroIds.length; i++) {
                    let hero = NewAdventureUtils.getHireHero(heroIds[i])
                    if (hero) {
                        if (hero.type == 0) {
                            let bagItem = NewAdventureUtils.createHeroBagItemBy(hero)
                            if (bagItem) {
                                infos.push(bagItem);
                            }
                        } else {
                            let bagItem = NewAdventureUtils.createHeroBagItemBy(hero)
                            if (bagItem) {
                                infos.push(bagItem);
                            }
                        }
                    }
                }
                this.predeploy(infos);
                return;
            } else {
                let heroIds = GlobalUtil.getLocal("Adventure_endless_setUpHero_pve") || []
                if (heroIds.length == 0) {
                    heroIds = ModelManager.get(HeroModel).PveUpHeroList
                }
                let infos: BagItem[] = [];
                let reqIds = []
                for (let i = 0; i < heroIds.length; i++) {

                    if (heroIds[i] > 0) {
                        let bagItem = HeroUtils.getHeroInfoBySeries(heroIds[i]);
                        if (bagItem) {
                            infos.push(bagItem);
                        }
                        if (!this.model.heroMap[heroIds[i]]) {
                            reqIds.push(heroIds[i])
                        }
                    }
                }
                if (reqIds.length == 0) {
                    this.predeploy(infos);
                    return;
                }

                HeroUtils.getFightHeroInfo(reqIds, true, (heroList: icmsg.FightHero[]) => {
                    if (!this.active) return;
                    heroList.forEach(h => this.model.heroMap[h.heroId] = h);
                    this.predeploy(infos);
                });
                return
            }
        }

        if (copy_id == CopyType.Expedition) {
            let epModel = ModelManager.get(ExpeditionModel)
            let heroIds = epModel.curHeroIds

            let infos: BagItem[] = []
            for (let i = 0; i < heroIds.length; i++) {
                let item = HeroUtils.getHeroInfoBySeries(heroIds[i]);
                if (item) {
                    infos.push(item);
                }
            }
            HeroUtils.getFightHeroInfo(heroIds, true, (heroList: icmsg.FightHero[]) => {
                if (!this.active) return;
                heroList.forEach(h => this.model.heroMap[h.heroId] = h);
                this.predeploy(infos);
            });
            return
        }

        //9人终极副本
        if (copy_id == CopyType.Ultimate) {
            let heroIds = ModelManager.get(HeroModel).curUpHeroList(7)
            let infos: BagItem[] = []
            for (let i = 0; i < heroIds.length; i++) {
                let item = HeroUtils.getHeroInfoBySeries(heroIds[i]);
                if (item) {
                    infos.push(item);
                }
            }
            HeroUtils.getFightHeroInfo(heroIds, true, (heroList: icmsg.FightHero[]) => {
                if (!this.active) return;
                heroList.forEach(h => this.model.heroMap[h.heroId] = h);
                this.predeploy(infos);
            });
            return
        }

        // 普通副本
        let heroModel = ModelManager.get(HeroModel)
        let type = heroModel.curDefendType;
        let infos: BagItem[] = this.model.isDefender ? heroModel.CurTypePvpdefenderSetUpHero(type) : heroModel.pveSetupHero;
        let heroIds = [];
        infos.forEach(h => {
            // 检查英雄战斗数据是否已经准备好
            if (h) {
                let info = h.extInfo as icmsg.HeroInfo;
                if (!this.model.heroMap[info.heroId]) {
                    // 正常的英雄
                    heroIds.push(info.heroId);
                }
            }
        });
        if (heroIds.length == 0) {
            this.predeploy(infos);
            return;
        }
        // 向服务器请求英雄详细数据
        HeroUtils.getFightHeroInfo(heroIds, true, (heroList: icmsg.FightHero[]) => {
            if (!this.active) return;
            heroList.forEach(h => this.model.heroMap[h.heroId] = h);
            this.predeploy(infos);
        });
    }

    predeploy(infos: BagItem[]) {
        // 非自走棋模式 按战力排序(防御阵型不需要按战力排序)
        if (!this.model.arenaSyncData || ['PIECES_CHESS', 'PIECES_ENDLESS', 'ARENAHONOR_GUESS', 'WORLDHONOR_GUESS', 'ARENATEAM'].indexOf(this.model.arenaSyncData.fightType) == -1) {
            if (!this.model.isDefender) {
                GlobalUtil.sortArray(infos, (a: BagItem, b: BagItem) => {
                    let infoA = a.extInfo as icmsg.HeroInfo;
                    let infoB = b.extInfo as icmsg.HeroInfo;
                    return infoB.power - infoA.power;
                });
            } else {
                this.finish();
            }
        }


        // 下阵所有不在允许上阵英雄列表中的英雄
        this.model.towers.forEach(t => {
            let h = t.hero;
            if (h) {
                if (!h.isAssist) {
                    let copy_id = this.model.stageConfig.copy_id;
                    if (copy_id == CopyType.Survival && this.model.stageConfig.subtype == 1) {
                        //生存训练困难模式下阵塔位英雄
                        t.setHeroByItem(null);
                    } else {
                        let series = h.model.item.series;
                        if (!infos.some(i => i.series == series)) {
                            // 不在上阵列表中，则下阵
                            t.setHeroByItem(null);
                        }
                    }

                }

            }
        });
        let copy_id = this.model.stageConfig.copy_id;
        let check = true;
        if (copy_id == CopyType.NONE && (this.model.arenaSyncData.fightType == 'ARENATEAM' ||
            this.model.arenaSyncData.fightType == 'ARENAHONOR_GUESS' ||
            this.model.arenaSyncData.fightType == 'WORLDHONOR_GUESS')) {
            check = false;
        }
        if (this.showTip && check && infos.length < this.model.towers.length) {
            // 没有可上阵的英雄了
            gdk.gui.showAskAlert(
                gdk.i18n.t('i18n:PVE_GET_MORE_HERO_TIP'),
                gdk.i18n.t("i18n:TIP_TITLE"), "PVE_ONE_KEY_TIP",
                (index: number) => {
                    if (index === 1) {
                        // 不需要
                        this.deploy(infos);
                    } else if (index === 0) {
                        // 前往抽卡界面
                        gdk.panel.setArgs(PanelId.Lottery, 0)
                        gdk.panel.open(PanelId.Lottery);
                    }
                    // 返回准备界面
                    this.finish();
                },
                this,
                {
                    cancel: gdk.i18n.t("i18n:PVE_DONT_NEED_LABEL"),
                    ok: gdk.i18n.t("i18n:PVE_GET_MORE_HERO_LABEL"),
                }
            );
        } else {
            // 直接上阵
            this.deploy(infos);
            this.finish();
        }
    }

    // 填充合适的上阵英雄数据
    deploy(infos: BagItem[]) {
        // if (this.model.heros.length >= infos.length) {
        //     return;
        // }
        let e: { [id: number]: boolean } = {};
        // let a: number[] = this.model.readBuildTower();
        let max = PveTool.getMaxHeroNum(this.model);
        let cfgs = ConfigManager.getItems(Copy_assistCfg, { 'stage_id': this.model.id });
        // // 减去助阵英雄数量
        // if (cfgs && cfgs.length > 0) {
        //     max -= cfgs.length;
        // }
        // 已经上阵的英雄
        this.model.heros.forEach(h => {
            let m = h.model;
            e[m.item.itemId] = true;
        });
        // 上阵剩余的英雄
        let remain = max - this.model.heros.length;
        for (let index = 0; index < 2; index++) {
            // index表示不同的模式，index==0处理优先推荐英雄，index==1按战力顺序上阵
            this.model.towers.forEach(t => {
                let pos = t.id - 1;
                let assist = cfgs && cfgs.some(cfg => cfg.pos - 1 == pos);
                if (this.model.arenaSyncData && ['PIECES_CHESS', 'PIECES_ENDLESS', 'ARENAHONOR_GUESS', 'WORLDHONOR_GUESS', 'ARENATEAM'].indexOf(this.model.arenaSyncData.fightType) !== -1) {
                    t.setHeroByItem(infos[pos]);
                }
                else {
                    if (assist) {
                        // 助阵英雄预留位置
                        // a[pos] = -1;
                        // if (!t.hero || !t.hero.isAssist) {
                        //     t.setHeroByItem(null);
                        // }
                    } else if (t.hero) {
                        // 此塔已经有英雄了
                        // a[pos] = t.hero.model.item.series;
                    } else if (remain > 0) {
                        // 此位置有设置过英雄
                        let found: BagItem = null;
                        // if (a[pos] > 0) {
                        //     infos.some(d => {
                        //         if (d.series != a[pos]) return false;
                        //         if (this.testItem(t, d, e)) {
                        //             // 可以上阵
                        //             found = d;
                        //         }
                        //         return true;
                        //     });
                        // }
                        // 塔位英雄小兵优先职业类型
                        if (!found && index == 0) {
                            let soldierType = this.model.eliteStageUtil.getTowerSoldierType(t.id);
                            if (soldierType != 0) {
                                infos.some(d => {
                                    let cfg = ConfigManager.getItemById(SoldierCfg, (d.extInfo as icmsg.HeroInfo).soldierId);
                                    if (!cfg || soldierType != cfg.type) return false;
                                    if (!this.testItem(t, d, e)) return false;
                                    // 可以上阵
                                    found = d;
                                    return true;
                                });
                            }
                        }
                        // 寻找一个合适的英雄上阵
                        !found && index == 1 && infos.some(d => {
                            if (!this.testItem(t, d, e)) return false;
                            // 可以上阵
                            found = d;
                            return true;
                        });
                        // 找到则设置上阵英雄
                        if (found) {
                            e[found.itemId] = true;
                            // if (found.series > 0 && found.series < 600000) {
                            //     // 保存至上阵列表
                            //     a[pos] = found.series;
                            // }
                            t.setHeroByItem(found);
                            // 剩余位置减1
                            remain--;
                        } else {
                            // 没有合适的英雄
                            // a[pos] = -1;
                            t.setHeroByItem(null);
                        }
                    } else {
                        // 不允许上更多的英雄
                        // a[pos] = -1;
                        t.setHeroByItem(null);
                    }
                }
            });
        }
        // 保存上阵阵型
        this.model.saveBuildTower();
    }

    // 测试英雄是否可以使用
    testItem(t: PveBuildTowerCtrl, d: BagItem, e?: { [itemId: number]: boolean }) {

        // 英雄在排除列表中
        if (e && e[d.itemId] === true) {
            return false;
        }

        // 此英雄英雄已经上阵
        if (this.model.towers.some(t => t.hero && t.hero.model.item.series == d.series)) {
            return false;
        }

        // 不适合指定的塔位
        if (!t.validItem(d, false)) {
            return false;
        }

        // 测试通过
        return true;
    }
}