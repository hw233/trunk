import {
    Adventure2_adventureCfg,
    AdventureCfg,
    Copy_stageCfg,
    MonsterCfg,
    Pieces_globalCfg,
    Pve_bornCfg,
    Pve_bossbornCfg,
    Pve_mainCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ErrorManager from '../../../../common/managers/ErrorManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import ArenaHonorModel from '../../../../common/models/ArenaHonorModel';
import PiecesModel from '../../../../common/models/PiecesModel';
import RoleModel from '../../../../common/models/RoleModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import WorldHonorModel from '../../../../common/models/WorldHonorModel';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import PanelId from '../../../../configs/ids/PanelId';
import GuideModel from '../../../../guide/model/GuideModel';
import GuardianTowerModel from '../../../act/model/GuardianTowerModel';
import PeakModel from '../../../act/model/PeakModel';
import AdventureModel from '../../../adventure/model/AdventureModel';
import NewAdventureModel from '../../../adventure2/model/NewAdventureModel';
import ArenaTeamViewModel from '../../../arenaTeam/model/ArenaTeamViewModel';
import ChampionModel from '../../../champion/model/ChampionModel';
import ExpeditionModel from '../../../guild/ctrl/expedition/ExpeditionModel';
import FootHoldModel from '../../../guild/ctrl/footHold/FootHoldModel';
import SiegeModel from '../../../guild/ctrl/siege/SiegeModel';
import GuildModel from '../../../guild/model/GuildModel';
import { InstanceEventId, InstanceID } from '../../../instance/enum/InstanceEnumDef';
import InstanceModel from '../../../instance/model/InstanceModel';
import RelicModel from '../../../relic/model/RelicModel';
import VaultModel from '../../../vault/model/VaultModel';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneState from '../../enum/PveSceneState';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import { CheckCfg } from './../../../../a/config';
import CopyModel, { CopyType } from './../../../../common/models/CopyModel';


/**
 * Pve战斗结束动作
 * @Author: sthoo.huang
 * @Date: 2019-03-22 15:42:31
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-24 10:00:49
 */
const { property } = cc._decorator;

@gdk.fsm.action("PveSceneOverAction", "Pve/Scene")
export default class PveSceneOverAction extends PveSceneBaseAction {

    get guideModel(): GuideModel { return ModelManager.get(GuideModel); }

    @property({ tooltip: "是否过关" })
    isWin: boolean = true;

    temIsWin: boolean = false;
    onEnter() {
        super.onEnter();
        let stageConfig = this.model.stageConfig;

        // 预加载界面资源
        this.temIsWin = this.isWin;
        //结算界面弹出的判断
        let win = this.isWin;
        if (this.isWin || stageConfig.copy_id == CopyType.FootHold || stageConfig.copy_id == CopyType.GuildBoss || stageConfig.copy_id == CopyType.HeroTrial || stageConfig.copy_id == CopyType.NewHeroTrial
            || (stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'PIECES_CHESS')
            || (stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'PIECES_ENDLESS')) {
            // 据点战or公会boss都算胜利
            win = true;
        }

        if (stageConfig.copy_id == CopyType.Adventure) {
            let advModel = ModelManager.get(AdventureModel)
            if (advModel.difficulty == 4) {
                win = true;
            }
        }
        if (stageConfig.copy_id == CopyType.NewAdventure) {
            let advModel = ModelManager.get(NewAdventureModel)
            if (advModel.copyType == 1) {
                win = true;
            }
        }

        gdk.panel.preload(win ? PanelId.PveSceneWinPanel : PanelId.PveSceneFailPanel);

        // 清空掉落物品
        this.model.killEnemyDrop = {};

        // 金币副本
        let goldWin = true;
        if (stageConfig.copy_id == InstanceID.GOLD_INST) {
            if (this.model.maxEnemy != this.model.killedEnemy) {
                goldWin = false;
            }
        }

        // 精英副本结算，清除英雄技能
        if (stageConfig.copy_id == CopyType.Elite) {
            this.model.heros.forEach(hero => {
                hero.model._skills = null;
            });
        }
        //实战演练副本、末日废墟副本通关结算  
        if (stageConfig.copy_id == CopyType.RookieCup || stageConfig.copy_id == CopyType.EndRuin || stageConfig.copy_id == CopyType.HeroAwakening) {
            //战斗时长限制
            if (this.model.gateconditionUtil.fightTimeLimmit.length > 0) {
                this.model.gateconditionUtil.fightTimeLimmit.forEach(index => {
                    let data = this.model.gateconditionUtil.DataList[index]
                    data.curData = this.model.realTime;
                    data.state = this.temIsWin ? data.curData <= data.cfg.data1 : false;
                })
            }
            //指挥官血量限制
            if (this.model.gateconditionUtil.GeneralHpLimit.length > 0) {
                this.model.gateconditionUtil.GeneralHpLimit.forEach(index => {
                    let data = this.model.gateconditionUtil.DataList[index]
                    data.curData = this.temIsWin ? this.model.proteges[0].model.hp : 0;
                    data.state = data.curData >= data.cfg.data1;
                    data.start = true;
                })
            }

            //指定英雄特定伤害限制
            if (this.model.gateconditionUtil.heroTypeDamageLimit.length > 0) {
                this.model.gateconditionUtil.heroTypeDamageLimit.forEach(index => {
                    let data = this.model.gateconditionUtil.DataList[index];
                    let heroInfo = this.model.getFightBybaseId(data.cfg.data1)
                    let tem = this.model.battleInfoUtil.getHeroDamage(heroInfo.model.fightId);
                    data.curData = data.cfg.data3 == 0 ? tem.OutputAllDamage : tem.TypeDamageList[data.cfg.data3];
                    data.state = data.curData >= data.cfg.data2;
                    data.start = true;
                })
            }

            if (this.temIsWin) {
                //检测怪物条件是否达成
                let cupNum = this.model.gateconditionUtil.getGateConditionCupNum();
                this.temIsWin = cupNum > 0;
                if (stageConfig.copy_id == CopyType.HeroAwakening) {
                    this.temIsWin = cupNum == 3;
                }
            }

        }

        // 添加失败记录
        if (!this.temIsWin && !this.model.isBounty) {
            // 末日考验副本失败记录
            if (stageConfig.copy_id == CopyType.GOD) {
                let type = stageConfig.copy_id + '';
                let instanceM = ModelManager.get(InstanceModel);
                if (instanceM) {
                    instanceM.instanceFailStage[type] = stageConfig.id;
                }
            }
        }

        // if (this.model.stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
        //     let fhModel = ModelManager.get(FootHoldModel)
        //     if (fhModel.gatherOpponents[fhModel.gatherFightOpponetnsIndex].hp > 0) {
        //         this.isWin = false
        //     } else {
        //         this.isWin = true
        //     }
        // }

        // 记录英雄伤害数据
        if (win) {
            this.reqDamageStatic();
        }

        // 直接结算
        let isCopy = !(stageConfig.copy_id == CopyType.MAIN || stageConfig.copy_id == CopyType.Elite);
        this.reqExit(isCopy, goldWin);
    }

    // 记录英雄伤害
    reqDamageStatic() {
        let stageConfig = this.model.stageConfig;
        let cfg = ConfigManager.getItem(CheckCfg, c => {
            // 竞技战斗类型
            // 'FOOTHOLD' | 'ARENA' | 'CHAMPION_GUESS' | 'CHAMPION_MATCH' | 'RELIC' | 'VAULT' | 
            // 'ENDRUIN' | 'ARENATEAM' | 'PEAK' | 'FOOTHOLD_GATHER' | 'GUARDIANTOWER' | 'PIECES_CHESS' | 
            // 'PIECES_ENDLESS' | 'ARENAHONOR_GUESS' | 'WORLDHONOR_GUESS';
            if (c.copy_id == stageConfig.copy_id && c.subtype == stageConfig.subtype) {
                if (c.copy_id == CopyType.NONE) {
                    // 竞技模式
                    if (c.pvp_type == this.model.arenaSyncData.fightType) {
                        return true;
                    }
                } else {
                    // 普通模式
                    return true;
                }
            }
            return false;
        });
        if (!cfg) {
            // 找不到配置，则不需要提交战斗伤害记录
            return;
        }
        let req = new icmsg.FightDamageStaticReq();
        req.stageId = stageConfig.id;
        req.opPower = 0;
        if (this.model.arenaSyncData) {
            req.opPower = this.model.arenaSyncData.mirrorModel.totalPower;
        }
        req.fightType = cfg.id;
        // 伤害统计
        let info = this.model.battleInfoUtil;
        req.damage = [];
        for (let i = 0; i < info.HeroList.length; i++) {
            let hurt = info.BattleInfo[info.HeroList[i]];
            if (hurt) {
                let e = new icmsg.FightHeroDamage();
                this.model.heros.some(h => {
                    if (h.model.id == hurt.baseId) {
                        e.heroId = h.model.heroId;
                        return true;
                    }
                    return false;
                });
                e.atkDmg = hurt.OutputAllDamage;
                e.atkTimes = hurt.OutputSkillDamageNum + hurt.OutputNormalDamageNum;
                e.stkDmg = hurt.SufferAllDamage;
                e.stkTimes = hurt.SufferSkillDamageNum + hurt.SufferNormalDamageNum;
                req.damage.push(e);
            }
        }
        req.bossNum = info.BossNum;
        NetManager.send(req);
    }

    // 请求结算关卡
    reqExit(isCopy: boolean, goldWin: boolean) {
        gdk.gui.showWaiting('', "PveSceneOver", 0, null, null, 2);

        // 结算错误处理
        ErrorManager.on([3312, 3608, 3704, 1907, 5104, 5115, 5106, 5105, 5117, 6915], () => {
            if (!this.active) return;
            if (!this.ctrl) return;
            // 结算失败，直接退出战斗界面
            this.ctrl.close(-1);
        }, this);

        let model = this.model;
        if (model.stageConfig.copy_id == CopyType.GuildBoss) {
            //公会boss处理
            let gModel = ModelManager.get(GuildModel);
            if (!gModel.gbMaxHurt || model.guildBossHurt > gModel.gbMaxHurt) {
                gModel.gbMaxHurt = model.guildBossHurt;
            }
            let req = new icmsg.GuildBossExitReq();
            req.blood = model.guildBossHurt;
            NetManager.send(req, (resp: icmsg.GuildBossExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(resp);
            });
        } else if (model.stageConfig.copy_id == CopyType.FootHold) {
            // 副本据点战处理
            let fhModle = ModelManager.get(FootHoldModel);
            let msg = new icmsg.FootholdFightOverReq();
            msg.warId = fhModle.curMapData.warId;
            msg.pos = fhModle.pointDetailInfo.pos;
            // 对boss伤害数值
            if (this.temIsWin) {
                msg.bossDmg = fhModle.pointDetailInfo.bossHp;
            } else {
                msg.bossDmg = model.footholdBossHurt;
            }
            fhModle.curBossHurt = msg.bossDmg;
            NetManager.send(msg, (data: icmsg.FootholdFightOverRsp) => {
                fhModle.energy = data.energy;
                fhModle.isPvp = false;
                fhModle.fightPoint = null;
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.Expedition) {
            //团队远征处理
            let eModel = ModelManager.get(ExpeditionModel)
            let msg = new icmsg.ExpeditionFightOverReq()
            msg.isClear = this.temIsWin
            msg.grids = eModel.curHeroGirds
            NetManager.send(msg, (data: icmsg.ExpeditionFightOverRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            });
        } else if (model.stageConfig.copy_id == CopyType.Eternal) {
            // 末日考验副本
            let msg = new icmsg.MartialSoulExitReq();
            msg.stageId = model.id;
            msg.clear = this.temIsWin;
            //武魂试炼添加回放记录
            if (this.temIsWin) {
                if (model.minPower <= 0 || model.totalPower < model.minPower) {
                    // 当前上阵英雄战力小于最小战力时才记录
                    try {
                        // 处理回放动作数据
                        let heroes = [];
                        let data = {
                            h: [-1, -1, -1, -1, -1, -1],   // 上阵数据，[heroId, ... ]
                            a: model.actions,    // 指挥官技能，[[time, skill_id, pos_x, pos_y]]    
                            e: model.enemyBorns,   // 刷怪记录
                        };
                        for (let i = 0, n = model.towers.length; i < n; i++) {
                            let t = model.towers[i];
                            if (t.hero) {
                                let m = t.hero.model;
                                if (m.item && m.item.series > 0) {
                                    // 临时卡牌，不保存至上阵数据中
                                    heroes.push(m.heroId);
                                    data.h[t.id - 1] = m.heroId;
                                }
                            }
                        }
                        msg.heroes = heroes;   // 本次战斗上战英雄
                        msg.rndseed = model.seed; // 本次战斗随机种子
                        let str: any = gdk.amf.encodeObject(data);
                        str = gdk.pako.gzip(str);
                        str = gdk.Buffer.from(str).toString('binary');
                        msg.actions = str;  // 本次战斗其他数据
                    } catch (e) { }
                }
            } else {
                msg.heroes = [];   // 本次战斗上战英雄
                msg.rndseed = 0;   // 本次战斗随机种子
                msg.actions = '';  // 本次战斗指挥官释放技能
            }
            NetManager.send(msg, (data: icmsg.MartialSoulExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.DoomsDay) {
            // 末日考验副本
            let msg = new icmsg.DoomsDayExitReq();
            msg.stageId = model.id;
            msg.clear = this.temIsWin;
            NetManager.send(msg, (data: icmsg.DoomsDayExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.Guardian) {
            let msg = new icmsg.GuardianCopyExitReq();
            msg.stageId = model.id;
            msg.clear = this.temIsWin;
            NetManager.send(msg, (data: icmsg.DungeonHeroExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        }
        else if (model.stageConfig.copy_id == CopyType.SevenDayWar) {
            let msg = new icmsg.DungeonSevenDayExitReq()
            msg.stageId = model.id;
            msg.clear = this.temIsWin;
            NetManager.send(msg, (data: icmsg.DungeonSevenDayExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        }
        else if (model.stageConfig.copy_id == CopyType.Mine) {
            // 矿洞副本
            let msg = new icmsg.ActivityCaveExitReq();
            msg.stageId = model.id;
            msg.clear = this.temIsWin;
            NetManager.send(msg, (data: icmsg.ActivityCaveExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.HeroAwakening) {
            // 英雄觉醒副本
            let copyModel = ModelManager.get(CopyModel);
            let msg = new icmsg.HeroAwakeExitReq();
            msg.stageId = model.id;
            msg.heroId = copyModel.heroAwakeHeroId;
            msg.clear = this.temIsWin;
            NetManager.send(msg, (data: icmsg.HeroAwakeExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.GOD) {
            // 英雄副本
            let msg = new icmsg.DungeonHeroExitReq();
            msg.stageId = model.id;
            msg.clear = this.temIsWin;
            NetManager.send(msg, (data: icmsg.DungeonHeroExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                if (this.temIsWin) {
                    let model = ModelManager.get(InstanceModel);
                    let index = model.heroCopyCurIndex >= 0 ? model.heroCopyCurIndex : -1;
                    if (index < 0) {
                        let tem = { '9': 0, '10': 1, '11': 2 }
                        let cfg = ConfigManager.getItemById(Copy_stageCfg, data.stageId);
                        index = tem['' + cfg.subtype]
                    }
                    model.heroCopyPassStageIDs[index] = data.stageId;
                }

                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.Rune) {
            // 英雄副本
            let msg = new icmsg.DungeonRuneExitReq();
            msg.stageId = model.id;
            msg.monsters = this.model.RuneMonsters;
            msg.clear = this.model.killedEnemy >= this.model.stageConfig.monsters;//this.isWin;
            NetManager.send(msg, (data: icmsg.DungeonRuneExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                let model = ModelManager.get(InstanceModel);
                if (data.monsterNum > model.runeInfo.maxMonsterNum && model.runeInfo.maxMonsterNum > 0) {
                    model.runeMonsterAdd = data.monsterNum - model.runeInfo.maxMonsterNum;
                    model.runeInfo.maxMonsterNum = data.monsterNum
                } else {
                    model.runeMonsterAdd = 0;
                }
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.HeroTrial) {
            // 英雄副本
            let msg = new icmsg.DungeonOrdealExitReq();
            msg.stageId = model.id;
            //计算当前场上剩余怪物的伤害量
            model.enemies.forEach(enemy => {
                let enemyModel = enemy.model
                if ((!enemyModel.owner_id || enemyModel.owner_id <= 0) && enemyModel.config.type != 4) {
                    model.allEnemyHurtNum += Math.max(0, enemyModel.hpMax - enemyModel.hp);
                }
            })
            msg.stageDamage = Math.min(model.stageAllEnemyHpNum, model.allEnemyHurtNum);//this.model.RuneMonsters;
            let state = model.config.endless ? false : model.stageAllEnemyHpNum <= model.allEnemyHurtNum;
            msg.clear = state//this.isWin;
            NetManager.send(msg, (data: icmsg.DungeonOrdealExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                // let model = ModelManager.get(InstanceModel);
                // if (data.monsterNum > model.runeInfo.maxMonsterNum && model.runeInfo.maxMonsterNum > 0) {
                //     model.runeMonsterAdd = data.monsterNum - model.runeInfo.maxMonsterNum;
                //     model.runeInfo.maxMonsterNum = data.monsterNum
                // } else {
                //     model.runeMonsterAdd = 0;
                // }
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NewHeroTrial) {
            // 英雄副本
            let msg = new icmsg.NewOrdealExitReq();
            msg.stageId = model.id;
            //计算当前场上剩余怪物的伤害量
            model.enemies.forEach(enemy => {
                let enemyModel = enemy.model
                if ((!enemyModel.owner_id || enemyModel.owner_id <= 0) && enemyModel.config.type != 4) {
                    model.allEnemyHurtNum += Math.max(0, enemyModel.hpMax - enemyModel.hp);
                }
            })
            msg.stageDamage = Math.min(model.stageAllEnemyHpNum, model.allEnemyHurtNum);//this.model.RuneMonsters;
            let state = model.config.endless ? false : model.stageAllEnemyHpNum <= model.allEnemyHurtNum;
            msg.clear = state//this.isWin;
            NetManager.send(msg, (data: icmsg.NewOrdealExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                // let model = ModelManager.get(InstanceModel);
                // if (data.monsterNum > model.runeInfo.maxMonsterNum && model.runeInfo.maxMonsterNum > 0) {
                //     model.runeMonsterAdd = data.monsterNum - model.runeInfo.maxMonsterNum;
                //     model.runeInfo.maxMonsterNum = data.monsterNum
                // } else {
                //     model.runeMonsterAdd = 0;
                // }
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.EndRuin) {
            // 末日废墟副本
            let msg = new icmsg.RuinExitReq();
            msg.stageId = model.id;
            let starNum = 0;
            //let tem = model.gateconditionUtil.getGateConditionCupNum()
            // for (let i = 0; i < tem; i++) {
            //     starNum |= 1 << i;
            // }
            if (!this.temIsWin) {
                starNum = 0;
            } else {
                model.gateconditionUtil.DataList.forEach((data, i) => {
                    if (data.start && data.state) {
                        starNum |= 1 << i;
                    }
                })
            }
            msg.star = starNum;

            NetManager.send(msg, (data: icmsg.RuinExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'ARENA') {
            // 竞技场
            let qmsg = new icmsg.ArenaFightResultReq();
            qmsg.heroIds = [];
            model.towers.forEach(t => {
                let idx = t.id - 1;
                qmsg.heroIds[idx] = t.hero ? t.hero.model.heroId : -1;
            });
            qmsg.opponentId = model.arenaSyncData.args[0];
            qmsg.success = this.temIsWin;
            NetManager.send(qmsg, (rmsg: icmsg.ArenaFightResultRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                this.reqExitRsp(rmsg);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'FOOTHOLD') {
            let fhModle = ModelManager.get(FootHoldModel);
            // 公会争夺已被占领位置
            let qmsg = new icmsg.FootholdFightOverReq();
            qmsg.warId = model.arenaSyncData.args[0];
            qmsg.pos = model.arenaSyncData.args[1];
            qmsg.bossDmg = 0;
            qmsg.playerDmg = this.temIsWin ? fhModle.pointDetailInfo.bossHp : model.wave - 1;
            NetManager.send(qmsg, (rmsg: icmsg.FootholdFightOverRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                fhModle.energy = rmsg.energy;
                fhModle.isPvp = true;
                fhModle.fightPoint = null;
                fhModle.isPvpWin = this.temIsWin
                fhModle.pvpPlayerDmg = qmsg.playerDmg
                this.reqExitRsp(rmsg);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'RELIC') {
            let relicM = ModelManager.get(RelicModel);
            // 战争遗迹据点抢夺
            let qmsg = new icmsg.RelicFightOverReq();
            qmsg.mapType = parseInt(relicM.curAtkCity.split('-')[0]);
            qmsg.pointId = parseInt(relicM.curAtkCity.split('-')[1]);
            qmsg.damage = this.temIsWin ? 999 : model.wave - 1;
            NetManager.send(qmsg, (rmsg: icmsg.RelicFightOverRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                this.reqExitRsp(rmsg);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'VAULT') {
            let vaultModel = ModelManager.get(VaultModel);
            // 战争遗迹据点抢夺
            let qmsg = new icmsg.VaultFightOverReq();
            qmsg.isSuccess = this.temIsWin;
            qmsg.positionId = vaultModel.curPos + 1;
            // qmsg.pointId = parseInt(relicM.curAtkCity.split('-')[1]);
            // qmsg.damage = this.isWin ? 999 : model.wave - 1;
            NetManager.send(qmsg, (rmsg: icmsg.VaultFightOverRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                this.reqExitRsp(rmsg);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'CHAMPION_GUESS') {
            let cM = ModelManager.get(ChampionModel);
            // 锦标赛竞猜战斗结果
            let qmsg = new icmsg.ChampionGuessFightResultReq();
            qmsg.index = cM.guessIndex;
            qmsg.playerId = this.temIsWin ? this.model.championGuessFightInfos[0].playerId : this.model.championGuessFightInfos[1].playerId;
            NetManager.send(qmsg, (rmsg: icmsg.ChampionGuessFightResultRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                cM.guessList[cM.guessIndex].rewardScore = rmsg.score;
                this.reqExitRsp(rmsg);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'CHAMPION_MATCH') {
            let cM = ModelManager.get(ChampionModel);
            // 锦标赛竞猜战斗结果
            let qmsg = new icmsg.ChampionFightOverReq();
            qmsg.isWin = this.temIsWin;
            NetManager.send(qmsg, (rmsg: icmsg.ChampionFightOverRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                this.reqExitRsp(rmsg);
            }, this);
            //this.reqExitRsp(new ChampionFightOverRsp({ score: 100 }));
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'ENDRUIN') {
            let copyModel = ModelManager.get(CopyModel);
            // 末日废墟PVP战斗结果
            let qmsg = new icmsg.RuinChallengeExitReq();
            qmsg.chapter = copyModel.endRuinPvpChapterInfo.chapter
            qmsg.clear = this.temIsWin;
            NetManager.send(qmsg, (rmsg: icmsg.RuinChallengeExitRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                this.reqExitRsp(rmsg);
            }, this);
            //this.reqExitRsp(new ChampionFightOverRsp({ score: 100 }));
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'ARENATEAM') {
            let atM = ModelManager.get(ArenaTeamViewModel);
            // 组队竞技场
            let qmsg = new icmsg.ArenaTeamFightOverReq();
            qmsg.index = atM.fightNum//matchInfo.fightedNum;
            qmsg.isWin = this.temIsWin;
            NetManager.send(qmsg, (rmsg: icmsg.ArenaTeamFightOverRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                //
                if (rmsg.results.length == 0) {
                    atM.attackWinList[atM.fightNum] = this.temIsWin ? 2 : 1;
                    atM.fightNum += 1;
                    let m2 = this.model.arenaSyncData.mirrorModel;
                    //m2.state = PveSceneState.Ready
                    let id = this.model.id
                    this.model.id = id;
                    this.model.arenaSyncData.waveTimeOut = 1;
                    this.model.arenaSyncData.bossId = 1;
                    this.model.arenaSyncData.bossTimeOut = ConfigManager.getItemById(Pve_bossbornCfg, 1).interval;

                    m2.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
                    this.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
                    return;
                } else {
                    atM.AttackEnterView = 0;
                    this.reqExitRsp(rmsg);
                }

            }, this);
            //this.reqExitRsp(new ChampionFightOverRsp({ score: 100 }));
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'ROYAL') {
            let rM = ModelManager.get(RoyalModel);
            // 皇家竞技场
            let qmsg = new icmsg.RoyalFightOverReq();
            qmsg.round = rM.curFightNum + 1//matchInfo.fightedNum;
            qmsg.isWin = this.temIsWin;
            NetManager.send(qmsg, (rmsg: icmsg.RoyalFightOverRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                //
                rM.attackWinList[rM.curFightNum] = this.temIsWin ? 2 : 1;
                //判断整场战斗是否胜利
                let winNum: number = 0;
                let lossNum: number = 0;
                rM.attackWinList.forEach(data => {
                    if (data == 1) {
                        lossNum++;
                    } else if (data == 2) {
                        winNum++;
                    }
                })
                this.reqExitRsp(rmsg);
                // if (lossNum >= 2 || winNum >= 2) {
                //     this.reqExitRsp(rmsg);
                //     rM.clearFightData();
                // }else {
                //     rM.curFightNum += 1;
                //     rM.addSkillId = 0;
                //     let m2 = this.model.arenaSyncData.mirrorModel;
                //     //m2.state = PveSceneState.Ready
                //     let sceneId = rM.playerData.maps[rM.curFightNum];
                //     let cfg = ConfigManager.getItemByField(Royal_sceneCfg, 'id', sceneId);
                //     rM.winElite = {};
                //     cfg.victory.forEach(data => {
                //         switch (data[0]) {
                //             case 1:
                //             case 2:
                //             case 3:
                //                 rM.winElite[data[0]] = data[1];
                //                 break
                //             case 4:
                //             case 5:
                //                 rM.winElite[data[0]] = true;
                //                 break;
                //             case 6:
                //                 rM.winElite[data[0]] = [data[1], data[2]];
                //         }
                //     })
                //     let nextStageId = cfg.stage_id
                //     let id = nextStageId;
                //     this.model.id = id;
                //     this.model.arenaSyncData.waveTimeOut = 1;
                //     this.model.arenaSyncData.bossId = 1;
                //     this.model.arenaSyncData.bossTimeOut = -1//ConfigManager.getItemById(Pve_bossbornCfg, 1).interval;
                //     m2.id = id + 1;
                //     m2.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
                //     this.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
                //     return;
                // }

            }, this);
            //this.reqExitRsp(new ChampionFightOverRsp({ score: 100 }));
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'ROYAL_TEST') {
            let rM = ModelManager.get(RoyalModel);
            let rmsg = new icmsg.RoyalFightOverRsp()
            rmsg.isWin = this.temIsWin;
            rmsg.newDiv = rM.division
            rmsg.newRank = rM.rank;
            rmsg.newScore = rM.score;
            this.reqExitRsp(rmsg);

        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
            //据点集结战斗
            let fhModel = ModelManager.get(FootHoldModel);
            let opponentsIndex = fhModel.gatherFightOpponetnsIndex
            let fightValue: icmsg.FootholdGatherFightValue = new icmsg.FootholdGatherFightValue()

            if (this.temIsWin) {
                fightValue.playerId = fhModel.gatherOpponents[opponentsIndex].id
                fightValue.value = fhModel.gatherOpponents[opponentsIndex].hp
                fhModel.gatherFightTeamMatesIndex++
                fhModel.gatherFightOpponetnsIndex++
            } else {
                let remainHp = fhModel.gatherOpponents[opponentsIndex].hp
                fhModel.gatherOpponents[opponentsIndex].hp = (remainHp - (model.wave - 1)) > 0 ? (remainHp - (model.wave - 1)) : 0
                fightValue.playerId = fhModel.gatherOpponents[opponentsIndex].id
                fightValue.value = model.wave - 1
                fhModel.gatherFightTeamMatesIndex++
            }

            let qmsg = new icmsg.FootholdGatherFightOverReq();
            qmsg.index = fhModel.gatherFightTeamMatesIndex - 1
            qmsg.pos = fhModel.pointDetailInfo.pos
            qmsg.typ = fhModel.gatherFightType
            qmsg.damage = fightValue
            NetManager.send(qmsg, (rmsg: icmsg.FootholdGatherFightOverRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                fhModel.energy = rmsg.energy;
                fhModel.fightPoint = null;
                if (rmsg.newHPs.length == 0) {
                    let m2 = this.model.arenaSyncData.mirrorModel;
                    let id = this.model.id
                    this.model.id = id;
                    this.model.arenaSyncData.waveTimeOut = 1;
                    this.model.arenaSyncData.bossId = 1;
                    this.model.arenaSyncData.bossTimeOut = ConfigManager.getItemById(Pve_bossbornCfg, 1).interval;

                    let opponentInfo = fhModel.gatherOpponents[fhModel.gatherFightOpponetnsIndex]
                    let o_player = new icmsg.ArenaPlayer()
                    o_player.name = opponentInfo.name
                    o_player.head = opponentInfo.head
                    o_player.frame = opponentInfo.frame
                    let power = 0
                    opponentInfo.heroList.forEach(element => {
                        power += element.heroPower
                    })
                    o_player.power = power
                    m2.arenaSyncData.args = [0, 0, o_player]
                    this.model.refreshArenaInfo = true
                    this.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_NEXT)
                    return
                } else {
                    this.reqExitRsp(rmsg);
                }
            }, this)
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'PEAK') {
            let peakModel = ModelManager.get(PeakModel);
            // 巅峰之战
            let qmsg = new icmsg.PeakExitReq();
            qmsg.clear = this.temIsWin;
            NetManager.send(qmsg, (rmsg: icmsg.PeakExitRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                this.reqExitRsp(rmsg);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'GUARDIANTOWER') {
            let gtModel = ModelManager.get(GuardianTowerModel);
            // 巅峰之战
            let qmsg = new icmsg.GuardianTowerExitReq();
            qmsg.stageId = gtModel.curCfg.id
            qmsg.clear = this.temIsWin;
            NetManager.send(qmsg, (rmsg: icmsg.GuardianTowerExitRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                this.reqExitRsp(rmsg);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'ARENAHONOR_GUESS') {
            let aM = ModelManager.get(ArenaHonorModel);
            let rM = ModelManager.get(RoleModel);
            // 锦标赛竞猜战斗结果
            let qmsg = new icmsg.ArenaHonorExitReq();
            qmsg.world = false;
            qmsg.group = aM.guessInfo.group;
            qmsg.match = aM.guessInfo.match;
            let winNum = this.temIsWin ? 1 : 2;
            if (rM.id == aM.guessInfo.players[1].id) {
                winNum = this.temIsWin ? 2 : 1;
            }
            qmsg.winner = winNum
            NetManager.send(qmsg, (rmsg: icmsg.ArenaHonorExitRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                //cM.guessList[cM.guessIndex].rewardScore = rmsg.score;
                aM.guessInfo.guess = rmsg.guess;
                aM.guessInfo.guessWinner = rmsg.winner;
                let tem = aM.guessInfo.players[rmsg.winner - 1].win + 1
                aM.guessInfo.players[rmsg.winner - 1].win = tem;
                aM.list.forEach(data => {
                    if (data.group == rmsg.group && data.match == rmsg.match) {
                        data.guess = rmsg.guess;
                        data.guessWinner = rmsg.winner;
                        data.players[rmsg.winner - 1].win = tem;
                    }
                })
                this.reqExitRsp(rmsg);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'WORLDHONOR_GUESS') {
            let aM = ModelManager.get(WorldHonorModel);
            let rM = ModelManager.get(RoleModel);
            // 锦标赛竞猜战斗结果
            let qmsg = new icmsg.ArenaHonorExitReq();
            qmsg.world = true;
            qmsg.group = aM.guessInfo.group;
            qmsg.match = aM.guessInfo.match;
            let winNum = this.temIsWin ? 1 : 2;
            if (rM.id == aM.guessInfo.players[1].id) {
                winNum = this.temIsWin ? 2 : 1;
            }
            qmsg.winner = winNum
            NetManager.send(qmsg, (rmsg: icmsg.ArenaHonorExitRsp) => {
                // 结算返回
                if (!cc.isValid(this.node)) return;
                //cM.guessList[cM.guessIndex].rewardScore = rmsg.score;
                aM.guessInfo.guess = rmsg.guess;
                aM.guessInfo.guessWinner = rmsg.winner;
                let tem = aM.guessInfo.players[rmsg.winner - 1].win + 1
                aM.guessInfo.players[rmsg.winner - 1].win = tem;
                aM.list.forEach(data => {
                    if (data.group == rmsg.group && data.match == rmsg.match) {
                        data.guess = rmsg.guess;
                        data.guessWinner = rmsg.winner;
                        data.players[rmsg.winner - 1].win = tem;
                    }
                })
                this.reqExitRsp(rmsg);
            }, this);
        } else if (model.isBounty) {
            // 赏金副本
            let qmsg = new icmsg.BountyFightOverReq();
            qmsg.missionId = model.bountyMission.missionId;
            qmsg.clear = this.temIsWin;
            //赏金添加回放记录
            if (this.temIsWin) {
                try {
                    // 处理回放动作数据
                    let heroes = [];
                    let data = {
                        h: [-1, -1, -1, -1, -1, -1],   // 上阵数据，[heroId, ... ]
                        a: model.actions,    // 指挥官技能，[[time, skill_id, pos_x, pos_y]]    
                        e: model.enemyBorns,   // 刷怪记录
                    };
                    for (let i = 0, n = model.towers.length; i < n; i++) {
                        let t = model.towers[i];
                        if (t.hero) {
                            let m = t.hero.model;
                            if (m.item && m.item.series > 0) {
                                // 临时卡牌，不保存至上阵数据中
                                heroes.push(m.item.itemId);
                                data.h[t.id - 1] = m.item.itemId;
                            }
                        }
                    }
                    qmsg.heroIds = heroes;   // 本次战斗上战英雄
                    qmsg.rndSeed = model.seed; // 本次战斗随机种子
                    let str: any = gdk.amf.encodeObject(data);
                    str = gdk.pako.gzip(str);
                    str = gdk.Buffer.from(str).toString('binary');
                    qmsg.actions = str;  // 本次战斗其他数据
                } catch (e) { }

            } else {
                qmsg.heroIds = [];   // 本次战斗上战英雄
                qmsg.rndSeed = 0;   // 本次战斗随机种子
                qmsg.actions = '';  // 本次战斗指挥官释放技能
            }

            NetManager.send(qmsg, (data: icmsg.BountyFightOverRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.Adventure) {
            //探险  //保存进度
            let str = ''
            if (!this.temIsWin) {
                let dic: any = gdk.amf.encodeObject({
                    m: this.model.killedEnemyDic,
                    a: this.model.wave,//刷怪波次
                    b: this.model.killedEnemy,
                });
                dic = gdk.pako.gzip(dic);
                str = gdk.Buffer.from(dic).toString('binary');
            }
            let advModel = ModelManager.get(AdventureModel)

            if (this.temIsWin && advModel.layerId == 3) {
                let len = ConfigManager.getItems(AdventureCfg, { difficulty: advModel.difficulty, layer_id: advModel.layerId }).length
                if (advModel.selectIndex == len - 1) {
                    advModel.isShowFinishTip = true
                }
            }

            let qmsg = new icmsg.AdventureExitReq()
            qmsg.plateIndex = advModel.selectIndex
            qmsg.blood = this.model.proteges[0].model.hp
            qmsg.group = this.model.realWave//真实波次
            qmsg.fightState = str
            NetManager.send(qmsg, (data: icmsg.AdventureExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.NewAdventure) {
            //探险  //保存进度
            let str = ''
            if (!this.temIsWin) {
                let dic: any = gdk.amf.encodeObject({
                    m: this.model.killedEnemyDic,
                    a: this.model.wave,//刷怪波次
                    b: this.model.killedEnemy,
                });
                dic = gdk.pako.gzip(dic);
                str = gdk.Buffer.from(dic).toString('binary');
            }
            let advModel = ModelManager.get(NewAdventureModel)

            let selectIndex = advModel.copyType == 0 ? advModel.normal_selectIndex : advModel.endless_selectIndex;
            let difficulty = advModel.copyType == 0 ? advModel.difficulty : 4;
            let qmsg = new icmsg.Adventure2ExitReq()
            qmsg.difficulty = difficulty
            qmsg.plateIndex = selectIndex
            qmsg.blood = this.model.proteges[0].model.hp
            qmsg.group = this.model.realWave//真实波次
            qmsg.fightState = str
            NetManager.send(qmsg, (data: icmsg.Adventure2ExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
                if (this.temIsWin && advModel.copyType == 0) {
                    let len = ConfigManager.getItems(Adventure2_adventureCfg, { difficulty: advModel.difficulty, layer_id: advModel.normal_layerId }).length
                    if (advModel.normal_selectIndex == len - 1) {
                        advModel.isShowFinishTip = true;
                        advModel.firstShowPushView = true;
                        NetManager.send(new icmsg.StorePushListReq());
                    }
                }
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.Siege) {
            //丧尸攻城
            let siegeModel = ModelManager.get(SiegeModel)
            let roundMap = siegeModel.roundMap
            let monsters: icmsg.Monster[] = []
            let realDmg = 0//对怪物造成的伤害 (就是城门城门受到的伤害)
            let allKillMap = {}
            let killNum = 0
            for (let key in roundMap) {
                let wave = parseInt(key)//波次
                let m_bornCfg = ConfigManager.getItemById(Pve_mainCfg, model.stageConfig.born)
                if (wave == this.model.wave) {
                    let totalHp = 0
                    // 取出配置
                    for (let i = 0, n = m_bornCfg.monster_born_cfg.length; i < n; i++) {
                        let item: any = m_bornCfg.monster_born_cfg[i];
                        if (cc.js.isString(item)) {
                            // 字符串格式，范围配置模式
                            let a = item.split('-');
                            let b = parseInt(a[0]);
                            let e = a[1] ? parseInt(a[1]) : b;
                            for (let id = b; id <= e; id++) {
                                let cfg = ConfigManager.getItemById(Pve_bornCfg, id);
                                if (cfg.wave == this.model.wave && cfg && cfg.num > 0) {
                                    let m_cfg = ConfigManager.getItemById(MonsterCfg, cfg.enemy_id)
                                    if (m_cfg) {
                                        totalHp += m_cfg.hp * cfg.num
                                    }
                                }
                            }
                        } else {
                            let cfg = ConfigManager.getItemById(Pve_bornCfg, item);
                            if (cfg.wave == this.model.wave && cfg && cfg.num > 0) {
                                let m_cfg = ConfigManager.getItemById(MonsterCfg, cfg.enemy_id)
                                if (m_cfg) {
                                    totalHp += m_cfg.hp * cfg.num
                                }
                            }
                        }
                    }
                    let killHp = 0
                    let killDic = this.model.killedEnemyDic
                    for (let key in killDic) {
                        let id = parseInt(key)
                        let m_cfg = ConfigManager.getItemById(MonsterCfg, id)
                        if (m_cfg) {
                            killHp += m_cfg.hp * killDic[key]
                            if (!allKillMap[id]) {
                                allKillMap[id] = killDic[key]
                            } else {
                                allKillMap[id] += killDic[key]
                            }
                            killNum += killDic[key]
                        }
                    }
                    let percent = killHp / totalHp
                    realDmg += Math.floor(roundMap[wave] * percent)
                } else if (wave < this.model.wave) {
                    realDmg += roundMap[wave]
                    //已通关击杀的怪物列表
                    for (let i = 0, n = m_bornCfg.monster_born_cfg.length; i < n; i++) {
                        let item: any = m_bornCfg.monster_born_cfg[i];
                        if (cc.js.isString(item)) {
                            // 字符串格式，范围配置模式
                            let a = item.split('-');
                            let b = parseInt(a[0]);
                            let e = a[1] ? parseInt(a[1]) : b;
                            for (let id = b; id <= e; id++) {
                                let cfg = ConfigManager.getItemById(Pve_bornCfg, id);
                                if (cfg.wave == wave && cfg && cfg.num > 0) {
                                    let m_cfg = ConfigManager.getItemById(MonsterCfg, cfg.enemy_id)
                                    if (m_cfg) {
                                        if (!allKillMap[cfg.enemy_id]) {
                                            allKillMap[cfg.enemy_id] = cfg.num
                                        } else {
                                            allKillMap[cfg.enemy_id] += cfg.num
                                        }
                                        killNum += cfg.num
                                    }
                                }
                            }
                        } else {
                            let cfg = ConfigManager.getItemById(Pve_bornCfg, item);
                            if (cfg.wave == wave && cfg && cfg.num > 0) {
                                let m_cfg = ConfigManager.getItemById(MonsterCfg, cfg.enemy_id)
                                if (m_cfg) {
                                    if (!allKillMap[cfg.enemy_id]) {
                                        allKillMap[cfg.enemy_id] = cfg.num
                                    } else {
                                        allKillMap[cfg.enemy_id] += cfg.num
                                    }
                                    killNum += cfg.num
                                }
                            }
                        }
                    }
                }
            }
            for (let key in allKillMap) {
                let m = new icmsg.Monster()
                m.monsterId = parseInt(key)
                m.monsterNum = allKillMap[key]
                monsters.push(m)
            }
            let qmsg = new icmsg.SiegeExitReq()
            qmsg.group = this.model.wave
            qmsg.blood = realDmg
            qmsg.monsters = monsters
            NetManager.send(qmsg, (data: icmsg.SiegeExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                siegeModel.curWave = this.model.wave
                siegeModel.curDmg = realDmg
                siegeModel.curKillNum = killNum
                this.reqExitRsp(data);
            }, this);
        } else if (model.stageConfig.copy_id == CopyType.Ultimate) {
            //终极试炼副本
            let qmsg = new icmsg.DungeonUltimateExitReq()
            qmsg.stageId = model.id;
            qmsg.clear = this.temIsWin
            NetManager.send(qmsg, (data: icmsg.DungeonUltimateExitRsp) => {
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(data);
            })
        } else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'PIECES_CHESS') {
            let cb = () => {
                let qmsg = new icmsg.PiecesExitReq();
                qmsg.type = 2;
                qmsg.fightState = '';
                qmsg.nowRound = model.arenaSyncData.mainModel.enemies.length == 0 && model.arenaSyncData.mainModel.curEnemies.length == 0 ? model.wave : model.wave - 1;
                qmsg.playerHP = model.arenaSyncData.mainModel.proteges[0].model.hp;
                NetManager.send(qmsg, (data: icmsg.PiecesExitRsp) => {
                    if (!this.model) return;
                    if (!this.active) return;
                    this.reqExitRsp(data);
                }, this);
            }
            let pM = ModelManager.get(PiecesModel);
            let mainModel = this.model.arenaSyncData.mainModel;
            if (this.model.wave > 0 && this.model.wave > pM.passWave
                && this.model.wave == ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'round1').value[0]
                && mainModel.enemies.length == 0 && mainModel.curEnemies.length == 0 && mainModel.proteges[0].model.hp > 0) {
                let req = new icmsg.PiecesRoundEndReq();
                req.type = pM.curModel;
                req.isKillAll = true;
                NetManager.send(req, (resp: icmsg.PiecesRoundEndRsp) => {
                    if (!this.model) return;
                    if (!this.active) return;
                    cb();
                }, this);
            }
            else {
                cb();
            }
        }
        else if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'PIECES_ENDLESS') {
            let cb = () => {
                let qmsg = new icmsg.PiecesExitReq();
                qmsg.type = 1;
                qmsg.fightState = '';
                qmsg.nowRound = model.arenaSyncData.mainModel.enemies.length == 0 && model.arenaSyncData.mainModel.curEnemies.length == 0 ? model.wave : model.wave - 1;
                qmsg.playerHP = model.arenaSyncData.mainModel.proteges[0].model.hp;
                NetManager.send(qmsg, (data: icmsg.PiecesExitRsp) => {
                    if (!this.model) return;
                    if (!this.active) return;
                    this.reqExitRsp(data);
                }, this);
            }
            let pM = ModelManager.get(PiecesModel);
            let mainModel = this.model.arenaSyncData.mainModel;
            if (this.model.wave > 0 && this.model.wave > pM.passWave
                && this.model.wave == ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'round2').value[0]
                && mainModel.enemies.length == 0 && mainModel.curEnemies.length == 0 && mainModel.proteges[0].model.hp > 0) {
                let req = new icmsg.PiecesRoundEndReq();
                req.type = pM.curModel;
                req.isKillAll = true;
                req.nowRound = this.model.wave;
                req.playerHP = mainModel.proteges[0].model.hp;
                NetManager.send(req, (resp: icmsg.PiecesRoundEndRsp) => {
                    if (!this.model) return;
                    if (!this.active) return;
                    cb();
                }, this);
            }
            else {
                cb();
            }
        } else {
            let qmsg = model.stageConfig.copy_id == CopyType.Survival ? new icmsg.SurvivalExitReq() : new icmsg.DungeonExitReq();
            qmsg.stageId = model.id;
            qmsg.clear = this.temIsWin && goldWin;
            // 新奖杯模式
            if (this.temIsWin && (model.stageConfig.copy_id == CopyType.RookieCup || model.stageConfig.copy_id == CopyType.ChallengeCup)) {
                if (qmsg instanceof icmsg.DungeonExitReq) {
                    // let max = 0;
                    // let cur = 0;
                    // model.proteges.forEach(protege => {
                    //     max += protege.model.config.hp;
                    //     cur += protege.model.hp;
                    // })
                    // let cups = 1;
                    // if (cur == max) {
                    //     cups = 3;
                    // } else if (cur / max >= 0.6) {
                    //     cups = 2;
                    // }
                    qmsg.cups = model.gateconditionUtil.getGateConditionCupNum();
                }
            }
            if (this.temIsWin) {
                // 战斗回放记录
                if (qmsg instanceof icmsg.DungeonExitReq &&
                    (model.minPower <= 0 || model.totalPower < model.minPower)) {
                    // 当前上阵英雄战力小于最小战力时才记录
                    try {
                        // 处理回放动作数据
                        let heroes = [];
                        let data = {
                            h: [-1, -1, -1, -1, -1, -1],   // 上阵数据，[heroId, ... ]
                            a: model.actions,    // 指挥官技能，[[time, skill_id, pos_x, pos_y]]    
                            e: model.enemyBorns,   // 刷怪记录
                        };
                        for (let i = 0, n = model.towers.length; i < n; i++) {
                            let t = model.towers[i];
                            if (t.hero) {
                                let m = t.hero.model;
                                if (m.item && m.item.series > 0) {
                                    // 临时卡牌，不保存至上阵数据中
                                    heroes.push(m.heroId);
                                    data.h[t.id - 1] = m.heroId;
                                }
                            }
                        }
                        qmsg.heroes = heroes;   // 本次战斗上战英雄
                        qmsg.rndseed = model.seed; // 本次战斗随机种子
                        let str: any = gdk.amf.encodeObject(data);
                        str = gdk.pako.gzip(str);
                        str = gdk.Buffer.from(str).toString('binary');
                        qmsg.actions = str;  // 本次战斗其他数据
                    } catch (e) { }
                }
            } else if (qmsg instanceof icmsg.DungeonExitReq) {
                // 失败参数
                qmsg.heroes = [];   // 本次战斗上战英雄
                qmsg.rndseed = 0;   // 本次战斗随机种子
                qmsg.actions = '';  // 本次战斗指挥官释放技能
            }
            NetManager.send(qmsg, (rmsg: icmsg.DungeonExitRsp | icmsg.SurvivalExitRsp) => {
                // 结算返回 ，更新关卡数据
                try {
                    qmsg.clear && CopyUtil.stageComplete(rmsg.stageId);
                    isCopy && gdk.e.emit(InstanceEventId.REQ_INST_LIST);
                } catch (e) { }
                if (!this.model) return;
                if (!this.active) return;
                this.reqExitRsp(rmsg);
            }, this);
        }
    }

    // 结算返回
    reqExitRsp(rmsg: icmsg.DungeonExitRsp |
        icmsg.SurvivalExitRsp |
        icmsg.FootholdFightOverRsp |
        icmsg.ActivityCaveExitRsp |
        icmsg.BountyFightOverRsp |
        icmsg.DoomsDayExitRsp |
        icmsg.MartialSoulExitRsp |
        icmsg.GuildBossExitRsp |
        icmsg.DungeonHeroExitRsp |
        icmsg.DungeonRuneExitRsp |
        icmsg.ArenaFightResultRsp |
        icmsg.DungeonOrdealExitRsp |
        icmsg.AdventureExitRsp |
        icmsg.ChampionGuessFightResultRsp |
        icmsg.ChampionFightOverRsp |
        icmsg.RelicFightOverRsp |
        icmsg.VaultFightOverRsp |
        icmsg.RuinChallengeExitRsp |
        icmsg.NewOrdealExitRsp |
        icmsg.SiegeExitRsp |
        icmsg.ArenaTeamFightOverRsp |
        icmsg.RuinExitRsp |
        icmsg.PeakExitRsp |
        icmsg.FootholdGatherFightOverRsp |
        icmsg.GuardianCopyExitRsp |
        icmsg.GuardianTowerExitRsp |
        icmsg.HeroAwakeExitRsp |
        icmsg.Adventure2ExitRsp |
        icmsg.PiecesExitRsp |
        icmsg.ArenaHonorExitRsp |
        icmsg.ExpeditionFightOverRsp |
        icmsg.DungeonUltimateExitRsp |
        icmsg.RoyalFightOverRsp |
        icmsg.DungeonSevenDayExitRsp
    ) {
        gdk.gui.hideWaiting("PveSceneOver");
        gdk.gui.removeAllPopup();
        // 失败或胜利结算界面
        let stageCfg = this.model.stageConfig;
        let isWin = this.temIsWin;
        if (this.temIsWin || stageCfg.copy_id == CopyType.FootHold || stageCfg.copy_id == CopyType.GuildBoss || stageCfg.copy_id == CopyType.HeroTrial || stageCfg.copy_id == CopyType.NewHeroTrial || stageCfg.copy_id == CopyType.Siege
            || (stageCfg.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'PIECES_CHESS')
            || (stageCfg.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'PIECES_ENDLESS')) {
            // 据点战or公会boss都算胜利
            isWin = true;
        }
        //据点战pvp 有伤害显示胜利
        if (this.model.stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'FOOTHOLD') {
            let fhModle = ModelManager.get(FootHoldModel);
            if (fhModle.pvpPlayerDmg > 0) {
                isWin = true;
            }
        }

        if (this.model.stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
            let fhModle = ModelManager.get(FootHoldModel);
            let newHps = (rmsg as icmsg.FootholdGatherFightOverRsp).newHPs
            let winCount = 0
            newHps.forEach(element => {
                if (element.value == 0) {
                    winCount++
                }
            });
            if (newHps.length != 0 && winCount == newHps.length) {
                isWin = true
                fhModle.isPvp = true
                fhModle.isPvpWin = true
            } else {
                isWin = false
            }
        }

        if (this.model.stageConfig.copy_id == CopyType.Adventure) {
            let advModel = ModelManager.get(AdventureModel)
            if (advModel.difficulty == 4) {
                isWin = true;
                advModel.rankAfter = (rmsg as icmsg.AdventureExitRsp).rankAf
                advModel.rankBefore = (rmsg as icmsg.AdventureExitRsp).rankBf
            }
        }
        if (this.model.stageConfig.copy_id == CopyType.NewAdventure) {
            let advModel = ModelManager.get(NewAdventureModel)
            if (advModel.copyType == 1) {
                //isWin = true;
                advModel.rankAfter = (rmsg as icmsg.Adventure2ExitRsp).rankAf
                advModel.rankBefore = (rmsg as icmsg.Adventure2ExitRsp).rankBf
            }
        }

        if (this.model.stageConfig.copy_id == CopyType.NONE &&
            this.model.arenaSyncData.fightType == 'RELIC' &&
            rmsg instanceof icmsg.RelicFightOverRsp) {
            if (rmsg.remainHP <= 0) {
                isWin = true;
            }
        }

        if (this.model.stageConfig.copy_id == CopyType.NONE &&
            this.model.arenaSyncData.fightType == 'CHAMPION_GUESS') {
            // 退出PVE场景
            let view = gdk.gui.getCurrentView();
            let panel = view.getComponent(gdk.BasePanel);
            if (panel) {
                panel.close();
            }
            gdk.panel.setArgs(PanelId.ChampionGuessView, ModelManager.get(ChampionModel).guessIndex);
            gdk.panel.open(PanelId.ChampionGuessView);
            gdk.panel.setArgs(PanelId.ChampionGuessResultView, rmsg);
            gdk.panel.open(PanelId.ChampionGuessResultView);
        } else if (this.model.stageConfig.copy_id == CopyType.NONE &&
            this.model.arenaSyncData.fightType == 'ARENAHONOR_GUESS') {
            // 退出PVE场景
            let view = gdk.gui.getCurrentView();
            let panel = view.getComponent(gdk.BasePanel);
            if (panel) {
                panel.close();
            }
            gdk.panel.setArgs(PanelId.ArenaHonorGuessView, ModelManager.get(ArenaHonorModel).guessIndex);
            gdk.panel.open(PanelId.ArenaHonorGuessView);
            gdk.panel.setArgs(PanelId.ArenaHonorGuessResultView, rmsg);
            gdk.panel.open(PanelId.ArenaHonorGuessResultView);
        } else if (this.model.stageConfig.copy_id == CopyType.NONE &&
            this.model.arenaSyncData.fightType == 'WORLDHONOR_GUESS') {
            // 退出PVE场景
            let view = gdk.gui.getCurrentView();
            let panel = view.getComponent(gdk.BasePanel);
            if (panel) {
                panel.close();
            }
            gdk.panel.setArgs(PanelId.WorldHonorGuessView, ModelManager.get(WorldHonorModel).guessIndex);
            gdk.panel.open(PanelId.WorldHonorGuessView);
            gdk.panel.setArgs(PanelId.WorldHonorGuessResultView, rmsg);
            gdk.panel.open(PanelId.WorldHonorGuessResultView);
        } else {
            if (isWin) {
                // 打开胜利界面this.isWin || stageCfg.copy_id == CopyType.FootHold
                gdk.panel.setArgs(PanelId.PveSceneWinPanel, rmsg);
                gdk.panel.open(PanelId.PveSceneWinPanel);
            } else {
                // 打开失败界面
                gdk.panel.setArgs(PanelId.PveSceneFailPanel, rmsg);
                gdk.panel.open(PanelId.PveSceneFailPanel);
            }
        }

        // 设置状态
        this.model.state = isWin ? PveSceneState.Win : PveSceneState.Over;
        this.model.timeScale = 1.0;
        // 激活引导
        if ([CopyType.FootHold, CopyType.GuildBoss].indexOf(stageCfg.copy_id) == -1 && !this.model.isBounty && !this.model.isMirror) {
            GuideUtil.activeGuide('end#' + rmsg["stageId"] + (isWin ? '#win' : '#fail'));
        }
    }

    onExit() {
        gdk.gui.hideWaiting("PveSceneOver");
        NetManager.targetOff(this);
        ErrorManager.targetOff(this);
        super.onExit();
    }
}