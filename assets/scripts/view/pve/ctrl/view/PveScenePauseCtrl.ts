import { MonsterCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PiecesModel from '../../../../common/models/PiecesModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import GuardianTowerModel from '../../../act/model/GuardianTowerModel';
import ArenaTeamViewModel from '../../../arenaTeam/model/ArenaTeamViewModel';
import ChampionModel from '../../../champion/model/ChampionModel';
import FootHoldModel from '../../../guild/ctrl/footHold/FootHoldModel';
import GuildModel from '../../../guild/model/GuildModel';
import RelicModel from '../../../relic/model/RelicModel';
import VaultModel from '../../../vault/model/VaultModel';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneState from '../../enum/PveSceneState';
import PveSceneCtrl from '../PveSceneCtrl';
import { CopyType } from './../../../../common/models/CopyModel';


/** 
 * Pve场景暂停页面控制器
 * @Author: yaozu.hu
 * @Date: 2019-09-26 17:21:51
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-24 17:04:28
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveScenePauseCtrl")
export default class PveScenePauseCtrl extends gdk.BasePanel {

    @property(cc.Button)
    restartBtn: cc.Button = null;
    @property(cc.Node)
    bgNode: cc.Node = null;
    @property(cc.Label)
    stageName: cc.Label = null;

    @property(cc.Node)
    dropNode: cc.Node = null;
    @property(cc.Label)
    dropNum1: cc.Label = null;
    @property(cc.Label)
    dropNum2: cc.Label = null;
    @property(cc.Label)
    dropNum3: cc.Label = null;

    onEnable() {
        let p = gdk.gui.getCurrentView();
        let c = p.getComponent(PveSceneCtrl);
        let m = c.model;
        let stageCfg = m.stageConfig;
        if (m.isReplay) {
            // 回放模式时，在战斗结束后隐藏继续按钮
            this._closeBtn.interactable = m.state == PveSceneState.Fight || m.state == PveSceneState.Pause;
        } else if (stageCfg.copy_id == CopyType.MAIN || stageCfg.copy_id == CopyType.Elite) {
            // 主线副本显示成就和奖杯信息
            this.dropNode.active = true;
            this.dropNum1.string = m.killEnemyDrop[1] ? m.killEnemyDrop[1] + '' : '0';
            this.dropNum2.string = m.killEnemyDrop[2] ? m.killEnemyDrop[2] + '' : '0';
            this.dropNum3.string = m.killEnemyDrop[3] ? m.killEnemyDrop[3] + '' : '0';
        } else {
            // 其他类型的副本
            this.dropNode.active = false;
        }
        this.stageName.string = c.title;

        // 重开按钮
        let b = stageCfg.copy_id != CopyType.FootHold;
        b = b && stageCfg.copy_id != CopyType.Mine;
        b = b && stageCfg.copy_id != CopyType.RookieCup;
        b = b && stageCfg.copy_id != CopyType.ChallengeCup;
        b = b && stageCfg.copy_id != CopyType.GuildBoss;
        b = b && stageCfg.copy_id != CopyType.Rune;
        b = b && stageCfg.copy_id != CopyType.NONE;
        // b = b && !m.isBounty;
        this.restartBtn.interactable = b;
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    /**
     * 请求退出战斗
     * @param qmsg 
     * @param ctrl 
     */
    reqExit(qmsg: icmsg.Message, ctrl: PveSceneCtrl) {
        JumpUtils.showGuideMask();
        NetManager.send(qmsg, (rsp: any) => {
            JumpUtils.hideGuideMask();
            ctrl.model.state = PveSceneState.Exiting;
            ctrl.close(-1);
            cc.isValid(this.node) && this.close(-1);
            if (rsp instanceof icmsg.ChampionFightOverRsp) {
                let cM = ModelManager.get(ChampionModel)
                cM.infoData.points = rsp.newPoints1;
                cM.infoData.level = rsp.newRankLv1;
                cM.infoData.freeFightNum = Math.max(0, cM.infoData.freeFightNum - 1)
                if (cM.addBuyNum) {
                    cM.addBuyNum = false;
                    cM.infoData.boughtFightNum += 1;
                }
                NetManager.send(new icmsg.ChampionInfoReq())
            }
        }, this);
    }

    // 退出按钮
    exitHandle() {
        let p = gdk.gui.getCurrentView();
        let c = p.getComponent(PveSceneCtrl);
        let m = c.model;
        if (m.isReplay || m.isBounty) {
            // 回放和赏金模式，直接关闭战斗场景
            this.close(-1);
            c.close(-1);
            return;
        }
        switch (m.stageConfig.copy_id) {
            case CopyType.GuildBoss:
                // 公会BOSS
                GlobalUtil.openAskPanel({
                    descText: gdk.i18n.t('i18n:PVE_PAUSEE_TIP1'),//'退出副本不返还进入次数,是否退出',
                    sureCb: () => {
                        let gModel = ModelManager.get(GuildModel);
                        if (gModel.gbBossId) {
                            let bossCfg = ConfigManager.getItemById(MonsterCfg, gModel.gbBossId);
                            let obj = m.getFightBybaseId(gModel.gbBossId);
                            let leftHp = obj ? obj.model.hp : 0;
                            m.guildBossHurt = bossCfg.hp - leftHp
                        }
                        if (!gModel.gbMaxHurt || m.guildBossHurt > gModel.gbMaxHurt) {
                            gModel.gbMaxHurt = m.guildBossHurt;
                        }
                        let qmsg = new icmsg.GuildBossExitReq();
                        qmsg.blood = m.guildBossHurt;
                        this.reqExit(qmsg, c);
                    }
                });
                break;

            case CopyType.NONE:
                // 竞技模式
                if (m.arenaSyncData.fightType == 'ARENA') {
                    // 技能场
                    gdk.gui.showAskAlert(
                        gdk.i18n.t('i18n:ANENA_RETURN_TIPS'),
                        gdk.i18n.t("i18n:TIP_TITLE"), "TIP_TITLE",
                        (index: number) => {
                            if (index === 1) {
                                // 取消
                            } else if (index === 0) {
                                // 确定
                                let qmsg = new icmsg.ArenaFightResultReq();
                                qmsg.heroIds = [];
                                m.towers.forEach(t => {
                                    let idx = t.id - 1;
                                    qmsg.heroIds[idx] = t.hero ? t.hero.model.heroId : -1;
                                });
                                qmsg.opponentId = m.arenaSyncData.args[0];
                                qmsg.success = false;
                                this.reqExit(qmsg, c);
                            }
                        }, this, {
                        cancel: gdk.i18n.t("i18n:CANCEL"),
                        ok: gdk.i18n.t("i18n:OK")
                    });

                } else if (m.arenaSyncData.fightType == 'FOOTHOLD') {
                    // 重置据点状态
                    let qmsg = new icmsg.FootholdFightOverReq();
                    qmsg.warId = m.arenaSyncData.args[0];
                    qmsg.pos = m.arenaSyncData.args[1];
                    qmsg.bossDmg = 0;
                    qmsg.playerDmg = -1;
                    this.reqExit(qmsg, c);
                } else if (m.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
                    let fhModel = ModelManager.get(FootHoldModel)
                    let fightValue: icmsg.FootholdGatherFightValue = new icmsg.FootholdGatherFightValue()
                    let qmsg = new icmsg.FootholdGatherFightOverReq()
                    qmsg.index = -1
                    qmsg.pos = fhModel.pointDetailInfo.pos
                    qmsg.typ = fhModel.gatherFightType
                    qmsg.damage = fightValue
                    fhModel.fightPoint = null
                    this.reqExit(qmsg, c);
                }
                else if (m.arenaSyncData.fightType == 'CHAMPION_GUESS') {
                    //锦标赛竞技场主动退出
                    GlobalUtil.openAskPanel({
                        descText: gdk.i18n.t('i18n:PVE_PAUSEE_TIP2'),
                        sureCb: () => {
                            this.close(-1);
                            c.close(-1);
                        }
                    });
                } else if (m.arenaSyncData.fightType == 'CHAMPION_MATCH') {
                    //锦标赛
                    gdk.gui.showAskAlert(
                        gdk.i18n.t('i18n:CHAMPIOB_MATCH_RETURN_TIPS'),
                        gdk.i18n.t("i18n:TIP_TITLE"), "TIP_TITLE",
                        (index: number) => {
                            if (index === 1) {
                                // 取消
                            } else if (index === 0) {
                                // 确定
                                let qmsg = new icmsg.ChampionFightOverReq();
                                qmsg.isWin = false;
                                this.reqExit(qmsg, c);
                            }
                        }, this, {
                        cancel: gdk.i18n.t("i18n:CANCEL"),
                        ok: gdk.i18n.t("i18n:OK")
                    });
                } else if (m.arenaSyncData.fightType == 'RELIC') {
                    GlobalUtil.openAskPanel({
                        descText: '是否退出该据点的抢夺?',
                        sureCb: () => {
                            let req = new icmsg.RelicFightOverReq();
                            req.mapType = parseInt(ModelManager.get(RelicModel).curAtkCity.split('-')[0]);
                            req.pointId = parseInt(ModelManager.get(RelicModel).curAtkCity.split('-')[1]);
                            req.damage = 0;
                            NetManager.send(req, null, this);
                            this.close(-1);
                            c.close(-1);
                        }
                    });
                }
                else if (m.arenaSyncData.fightType == 'VAULT') {
                    GlobalUtil.openAskPanel({
                        descText: '是否退出该位置的抢夺?',
                        sureCb: () => {
                            let req = new icmsg.VaultFightOverReq();
                            req.positionId = ModelManager.get(VaultModel).curPos + 1
                            req.isSuccess = false;
                            NetManager.send(req, null, this);
                            this.close(-1);
                            c.close(-1);
                        }
                    });
                }
                else if (m.arenaSyncData.fightType == 'ARENATEAM') {
                    //组队竞技场退出判断为挑战失败
                    GlobalUtil.openAskPanel({
                        descText: '中途退出会直接判负，确认退出吗?',
                        sureCb: () => {
                            let req = new icmsg.ArenaTeamFightOverReq();
                            req.index = 2//req.positionId = ModelManager.get(VaultModel).curPos + 1
                            req.isWin = false;
                            let atM = ModelManager.get(ArenaTeamViewModel)
                            atM.AttackEnterView = 0;
                            NetManager.send(req, null, this);
                            this.close(-1);
                            c.close(-1);
                        }
                    });
                } else if (m.arenaSyncData.fightType == 'PEAK') {

                    GlobalUtil.openAskPanel({
                        descText: '中途退出会直接判负，确认退出吗?',
                        sureCb: () => {
                            // let req = new icmsg.PeakExitReq();
                            // req.clear = false
                            // NetManager.send(req, null, this);
                            // this.close(-1);
                            // c.close(-1);
                            c.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_OVER);
                        }
                    });

                } else if (m.arenaSyncData.fightType == 'GUARDIANTOWER') {
                    // 重置据点状态
                    let gtModel = ModelManager.get(GuardianTowerModel);
                    // 巅峰之战
                    let qmsg = new icmsg.GuardianTowerExitReq();
                    qmsg.stageId = gtModel.curCfg.id
                    qmsg.clear = false;
                    NetManager.send(qmsg, null, this);
                    this.close(-1);
                    c.close(-1);
                } else if (m.arenaSyncData.fightType == 'PIECES_CHESS') {
                    GlobalUtil.openAskPanel({
                        descText: `中途退出将不计算进度和挑战次数,是否确认操作?`,
                        sureCb: () => {
                            ModelManager.get(PiecesModel).addScore = 0;
                            m.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_WIN)
                        }
                    })
                } else if (m.arenaSyncData.fightType == 'PIECES_ENDLESS') {
                    GlobalUtil.openAskPanel({
                        descText: `中途退出立即进行结算,是否继续操作?`,
                        sureCb: () => {
                            m.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_WIN)
                        }
                    })
                } else if (m.arenaSyncData.fightType == 'ARENAHONOR_GUESS') {
                    //锦标赛竞技场主动退出
                    GlobalUtil.openAskPanel({
                        descText: gdk.i18n.t('i18n:PVE_PAUSEE_TIP2'),
                        sureCb: () => {
                            this.close(-1);
                            c.close(-1);
                        }
                    });
                } else if (m.arenaSyncData.fightType == 'WORLDHONOR_GUESS') {
                    //锦标赛竞技场主动退出
                    GlobalUtil.openAskPanel({
                        descText: gdk.i18n.t('i18n:PVE_PAUSEE_TIP2'),
                        sureCb: () => {
                            this.close(-1);
                            c.close(-1);
                        }
                    });
                } else if (m.arenaSyncData.fightType == 'ROYAL') {
                    // 重置据点状态
                    GlobalUtil.openAskPanel({
                        descText: gdk.i18n.t('i18n:ROYAL_TIP1'),//'退出副本不返还进入次数,是否退出',
                        sureCb: () => {
                            let rModel = ModelManager.get(RoyalModel);
                            let qmsg = new icmsg.RoyalFightOverReq();
                            qmsg.round = 3;
                            qmsg.isWin = false;
                            rModel.clearFightData();
                            this.reqExit(qmsg, c);
                        }
                    });
                } else if (m.arenaSyncData.fightType == 'ROYAL_TEST') {
                    let rModel = ModelManager.get(RoyalModel);
                    rModel.clearTestFightData();
                    this.close(-1);
                    c.close(-1);
                }
                break;

            default:
                // 正常模式，返回至准备状态
                c.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_RETURN);
                break;
        }
    }

    // 重开按钮
    restartHandle() {
        let p = gdk.gui.getCurrentView();
        let c = p.getComponent(PveSceneCtrl);
        c.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_RESTART);
    }
}
