import AdventureModel from '../../../adventure/model/AdventureModel';
import ArenaHonorModel from '../../../../common/models/ArenaHonorModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyType } from './../../../../common/models/CopyModel';
import ErrorManager from '../../../../common/managers/ErrorManager';
import GuideUtil from '../../../../common/utils/GuideUtil';
import GuildModel from '../../../guild/model/GuildModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import NewAdventureModel from '../../../adventure2/model/NewAdventureModel';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../../act/model/PeakModel';
import PiecesModel from '../../../../common/models/PiecesModel';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveSceneState from '../../enum/PveSceneState';
import WorldHonorModel from '../../../../common/models/WorldHonorModel';
import { Copycup_heroCfg, Copycup_rookieCfg } from '../../../../a/config';
/** 
 * Pve进入战斗过渡动作
 * @Author: sthoo.huang  
 * @Date: 2019-03-22 16:02:35
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-24 15:47:29
 */

@gdk.fsm.action("PveSceneEnteringAction", "Pve/Scene")
export default class PveSceneEnteringAction extends PveSceneBaseAction {

    onEnter() {
        super.onEnter();

        // 重置场景数据
        this.model.id = this.model.id;

        // 回收英雄出现特效
        let resId = gdk.Tool.getResIdByNode(this.node);
        [
            'E_com_assist_chusheng',
            'E_com_chusheng',
        ].forEach(e => {
            gdk.rm.releaseRes(resId, `spine/common/${e}/${e}`);
        });

        // 销毁英雄选择界面
        let prefab: cc.Prefab = gdk.rm.getResByUrl(PanelId.PveSceneHeroSelectPanel.prefab, cc.Prefab);
        if (prefab) {
            gdk.pool.clear(prefab.name);
        }
        gdk.gui.showWaiting(gdk.i18n.t("i18n:LOADING_STRING"), 'ShowWaitingAction', null, null, null, 2);

        // 错误码处理
        ErrorManager.once([2100, 2101, 2102, 2103, 2104, 2105, 2125, 2126, 123, 1903, 3310], () => {
            if (!cc.isValid(this.node)) return;
            if (!this.active) return;
            this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
        }, this);

        // 请求进入
        this.reqEnter();
    }

    // 请求进入副本
    reqEnter() {
        let smsg: any;
        if (this.model.isBounty) {
            // 赏金副本
            let d = smsg = new icmsg.BountyFightStartReq();
            d.missionId = this.model.bountyMission.missionId;
        } else {
            // 针对不同的副本使用不同的进入协议
            let copy_id = this.model.stageConfig.copy_id;
            if (copy_id == CopyType.Survival) {
                // 生存副本
                smsg = new icmsg.SurvivalEnterReq();
            } else if (copy_id == CopyType.Eternal) {
                // 武魂试炼
                smsg = new icmsg.MartialSoulEnterReq();
            } else if (copy_id == CopyType.Mine) {
                // 矿洞副本
                smsg = new icmsg.ActivityCaveEnterReq();
            } else if (copy_id == CopyType.DoomsDay) {
                // 末日考验
                smsg = new icmsg.DoomsDayEnterReq();
            } else if (copy_id == CopyType.GuildBoss) {
                // 公会boss
                smsg = new icmsg.GuildBossEnterReq();
            } else if (copy_id == CopyType.GOD) {
                // 英雄副本
                smsg = new icmsg.DungeonHeroEnterReq();
            } else if (copy_id == CopyType.Rune) {
                // 符文副本
                smsg = new icmsg.DungeonRuneEnterReq();
            } else if (copy_id == CopyType.HeroTrial) {
                // 英雄试炼
                let d = smsg = new icmsg.DungeonOrdealEnterReq()
                d.stageId = this.model.stageConfig.id
            } else if (copy_id == CopyType.NewHeroTrial) {
                // 英雄试炼
                let d = smsg = new icmsg.NewOrdealEnterReq()
                d.stageId = this.model.stageConfig.id
            } else if (copy_id == CopyType.HeroAwakening) {
                // 英雄试炼
                let copyModel = ModelManager.get(CopyModel)
                let d = smsg = new icmsg.HeroAwakeEnterReq()
                d.stageId = this.model.stageConfig.id
                d.heroId = copyModel.heroAwakeHeroId;
            } else if (copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'ARENA') {
                // 竞技场
                let d = smsg = new icmsg.ArenaFightReq();
                d.opponentId = this.model.arenaSyncData.args[0];

            } else if (copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'ENDRUIN') {
                // 竞技场
                let copyModel = ModelManager.get(CopyModel)
                let d = smsg = new icmsg.RuinChallengeEnterReq();
                d.chapter = copyModel.endRuinPvpChapterInfo.chapter
            } else if (copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'PEAK' && !this.model.isMirror) {
                // 竞技场
                smsg = new icmsg.PeakEnterReq();
            } else if (copy_id == CopyType.NONE && ['FOOTHOLD', 'CHAMPION_GUESS', 'CHAMPION_MATCH', 'RELIC', 'VAULT', 'ARENATEAM', 'FOOTHOLD_GATHER', 'PIECES_CHESS', 'PIECES_ENDLESS'].indexOf(this.model.arenaSyncData.fightType) !== -1) {
                // 公会争夺已被占领位置 or  锦标赛竞猜
                if (this.model.arenaSyncData.fightType == 'PIECES_ENDLESS') {
                    let r = ModelManager.get(PiecesModel).startRound;
                    this.model.arenaSyncData.mainModel.setWaveBy(r, {}, 'set');
                    this.model.arenaSyncData.mirrorModel.setWaveBy(r, {}, 'set');
                    this.model.arenaSyncData.mainModel.realWave = r;
                    this.model.arenaSyncData.mirrorModel.realWave = r;
                }
                this.model.minPower = 1;
                this.model.state = PveSceneState.Entering;
                this.finish();
                return;
            } else if (copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'GUARDIANTOWER') {
                // 护使秘境
                this.model.state = PveSceneState.Entering;
                this.finish();
                return;
            } else if (copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'ARENAHONOR_GUESS') {
                // 护使秘境
                let aModel = ModelManager.get(ArenaHonorModel)
                let d = smsg = new icmsg.ArenaHonorEnterReq();
                d.world = false;
                d.group = aModel.guessInfo.group;
                d.match = aModel.guessInfo.match;
            } else if (copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'WORLDHONOR_GUESS') {
                // 护使秘境
                let aModel = ModelManager.get(WorldHonorModel)
                let d = smsg = new icmsg.ArenaHonorEnterReq();
                d.world = true;
                d.group = aModel.guessInfo.group;
                d.match = aModel.guessInfo.match;
            } else if (copy_id == CopyType.NONE && (this.model.arenaSyncData.fightType == 'ROYAL' || this.model.arenaSyncData.fightType == 'ROYAL_TEST')) {
                // 护使秘境
                this.model.state = PveSceneState.Entering;
                this.finish();
                return;
            }
            else if (copy_id == CopyType.Adventure) {
                //探险开始战斗
                let advModel = ModelManager.get(AdventureModel)
                smsg = new icmsg.AdventureEnterReq();
                smsg.plateIndex = advModel.selectIndex
                smsg.giveHeros = advModel.pveHireHeroIds
            } else if (copy_id == CopyType.NewAdventure) {
                //探险开始战斗
                let advModel = ModelManager.get(NewAdventureModel)
                smsg = new icmsg.Adventure2EnterReq();
                let selectIndex = advModel.copyType == 0 ? advModel.normal_selectIndex : advModel.endless_selectIndex;
                let difficulty = advModel.copyType == 0 ? advModel.difficulty : 4;
                smsg.plateIndex = selectIndex
                smsg.difficulty = difficulty
                //smsg.giveHeros = advModel.pveHireHeroIds
            } else if (copy_id == CopyType.EndRuin) {
                //探险开始战斗
                //let advModel = ModelManager.get(AdventureModel)
                smsg = new icmsg.RuinEnterReq();
                smsg.stageId = this.model.stageConfig.id
                // smsg.plateIndex = advModel.selectIndex
                // smsg.giveHeros = advModel.pveHireHeroIds
            } else if (copy_id == CopyType.Siege) {
                smsg = new icmsg.SiegeEnterReq()
            }
            else if (copy_id == CopyType.Guardian) {
                smsg = new icmsg.GuardianCopyEnterReq();
            } else if (copy_id == CopyType.Ultimate) {
                smsg = new icmsg.DungeonUltimateEnterReq()
                smsg.stageId = this.model.stageConfig.id
            } else if (copy_id == CopyType.SevenDayWar) {
                smsg = new icmsg.DungeonSevenDayEnterReq()
                smsg.stageId = this.model.stageConfig.id
            }
            else {
                // 普通副本
                smsg = new icmsg.DungeonEnterReq();
            }
            if (!(smsg instanceof icmsg.GuildBossEnterReq) && !(smsg instanceof icmsg.ArenaFightReq) && !(smsg instanceof icmsg.PeakEnterReq) && !(smsg instanceof icmsg.ArenaHonorEnterReq)) {
                smsg.stageId = this.model.id;
            }
        }
        NetManager.send(
            smsg,
            (rmsg: icmsg.DungeonEnterRsp |
                icmsg.SurvivalEnterRsp |
                icmsg.ActivityCaveEnterRsp |
                icmsg.BountyFightStartRsp |
                icmsg.DoomsDayEnterRsp |
                icmsg.MartialSoulEnterRsp |
                icmsg.GuildBossEnterRsp |
                icmsg.DungeonHeroEnterRsp |
                icmsg.DungeonRuneEnterRsp |
                icmsg.ArenaFightRsp |
                icmsg.DungeonOrdealEnterRsp |
                icmsg.AdventureEnterRsp |
                icmsg.RuinEnterRsp |
                icmsg.RuinChallengeEnterRsp |
                icmsg.SiegeEnterRsp |
                icmsg.PeakEnterRsp |
                icmsg.GuardianCopyEnterRsp |
                icmsg.HeroAwakeEnterRsp |
                icmsg.Adventure2EnterRsp |
                icmsg.ArenaHonorEnterRsp |
                icmsg.DungeonUltimateEnterRsp |
                icmsg.DungeonSevenDayEnterRsp
            ) => {
                if (!cc.isValid(this.node)) return;
                if (!this.active) return;
                if (!this.model) return;
                if (rmsg instanceof icmsg.BountyFightStartRsp) {
                    // 赏金副本
                    if (rmsg.missionId != this.model.bountyMission.missionId) return;
                } else if (rmsg instanceof icmsg.GuildBossEnterRsp) {
                    // 公会BOSS
                    ModelManager.get(GuildModel).gbEnterTime = rmsg.enter;
                } else if (rmsg instanceof icmsg.ArenaFightRsp) {
                    // 竞技场
                } else if (rmsg instanceof icmsg.AdventureEnterRsp) {
                    // 探险
                    if (rmsg.fightState != '') {
                        let data: any = gdk.Buffer.from(rmsg.fightState, 'binary');
                        data = gdk.pako.ungzip(data);
                        data = gdk.Buffer.from(data);
                        data = gdk.amf.decodeObject(data);
                        // this.model.killedEnemy = data.a;
                        // this.model.createdEnemy = data.b;
                        this.model.setWaveBy(data.a ? data.a : 0, data.m ? data.m : {}, 'set');
                        let advModel = ModelManager.get(AdventureModel)
                        if (advModel.difficulty == 4) {
                            this.model.realWave = rmsg.group
                            this.model.killedEnemy = data.b ? data.b : 0
                        }
                    }
                } else if (rmsg instanceof icmsg.Adventure2EnterRsp) {
                    // 探险
                    if (rmsg.fightState != '') {
                        let data: any = gdk.Buffer.from(rmsg.fightState, 'binary');
                        data = gdk.pako.ungzip(data);
                        data = gdk.Buffer.from(data);
                        data = gdk.amf.decodeObject(data);
                        // this.model.killedEnemy = data.a;
                        // this.model.createdEnemy = data.b;
                        this.model.setWaveBy(data.a ? data.a : 0, data.m ? data.m : {}, 'set');
                        let advModel = ModelManager.get(NewAdventureModel)
                        if (advModel.copyType == 1) {
                            this.model.realWave = rmsg.group
                            this.model.killedEnemy = data.b ? data.b : 0
                        }
                    }
                } else if (rmsg instanceof icmsg.SiegeEnterRsp) {
                    // let siegeModel = ModelManager.get(SiegeModel)
                    // siegeModel.enterTimes = rmsg.enterTimes
                } else if (rmsg instanceof icmsg.PeakEnterRsp) {
                    let peakModel = ModelManager.get(PeakModel)
                    peakModel.peakStateInfo.enterTimes = rmsg.enterTimes;
                } else if (rmsg instanceof icmsg.ArenaHonorEnterRsp) {
                    if (rmsg.world) {
                        let aModel = ModelManager.get(WorldHonorModel)
                        aModel.guessGroup = rmsg.group;
                    } else {
                        let aModel = ModelManager.get(ArenaHonorModel)
                        aModel.guessGroup = rmsg.group;
                    }
                } else if (rmsg instanceof icmsg.DungeonUltimateEnterRsp) {
                    let copyModel = ModelManager.get(CopyModel)
                    copyModel.ultimateLeftNum = rmsg.leftNum
                }
                else {
                    // 其他副本
                    if (rmsg.stageId != this.model.id) return;
                    GuideUtil.activeGuide('start#' + rmsg.stageId);
                }
                this.model.minPower = (rmsg instanceof icmsg.DungeonEnterRsp || rmsg instanceof icmsg.MartialSoulEnterRsp) ? rmsg.minPower : 1;
                this.model.state = PveSceneState.Entering;
                this.finish();
            },
            this,
        );

        //判断通关条件 各个阵营英雄数量和各个职业英雄数量
        this.model.gateconditionUtil && this.model.gateconditionUtil.updateGateConditions();

        // 保存奖杯模式的上阵记录
        if (this.model.stageConfig.copy_id == CopyType.RookieCup) {
            let copyModel = ModelManager.get(CopyModel)
            let a: number[] = new Array(this.model.towers.length);
            for (let i = 0, n = a.length; i < n; i++) {
                a[i] = -1;
            }
            let temCfg = ConfigManager.getItem(Copycup_rookieCfg, { 'stage_id': this.model.stageConfig.id });
            this.model.towers.forEach(tower => {
                if (tower.hero != null) {

                    let heroIds = temCfg['tower_' + tower.id];

                    heroIds.forEach(id => {
                        let cfg = ConfigManager.getItemById(Copycup_heroCfg, id)
                        if (cfg.hero_id == tower.hero.model.config.id) {
                            a[tower.id - 1] = id;
                        }
                    })
                }
            })

            copyModel.cupCopyUpHeroList['' + this.model.stageConfig.id] = a;
        }

        // 保存奖杯模式的上阵记录
        if (this.model.stageConfig.copy_id == CopyType.Survival && this.model.stageConfig.subtype == 1) {
            let copyModel = ModelManager.get(CopyModel)
            let a: number[] = new Array(this.model.towers.length);
            for (let i = 0, n = a.length; i < n; i++) {
                a[i] = -1;
            }
            //let temCfg = ConfigManager.getItem(Copycup_rookieCfg, { 'stage_id': this.model.stageConfig.id });
            this.model.towers.forEach(tower => {
                if (tower.hero != null) {
                    a[tower.id - 1] = tower.hero.model.item.series;
                }
            })
            copyModel.SurvivalCopyUpHeroList['' + this.model.stageConfig.subtype] = a;
        }
        // 保存巅峰之战的上阵记录
        // if (this.model.stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'PEAK' && !this.model.isMirror) {
        //     let peakModel = ModelManager.get(PeakModel)
        //     let a: number[] = new Array(this.model.towers.length);
        //     for (let i = 0, n = a.length; i < n; i++) {
        //         a[i] = -1;
        //     }
        //     //let temCfg = ConfigManager.getItem(Copycup_rookieCfg, { 'stage_id': this.model.stageConfig.id });
        //     this.model.towers.forEach(tower => {
        //         if (tower.hero != null) {
        //             a[tower.id - 1] = tower.hero.model.item.itemId;
        //         }
        //     })
        //     peakModel.peakCopyUpHeroList['1'] = a;
        // }


    }

    onExit() {
        super.onExit();
        gdk.gui.hideWaiting('ShowWaitingAction');
        ErrorManager.targetOff(this);
        NetManager.targetOff(this);
    }
}