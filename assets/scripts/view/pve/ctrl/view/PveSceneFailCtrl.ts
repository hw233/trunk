import {
    Common_strongerCfg,
    Copy_stageCfg,
    Eternal_stageCfg,
    Foothold_bonusCfg,
    Foothold_globalCfg,
    Foothold_pointCfg,
    Hero_careerCfg,
    Peak_divisionCfg,
    Relic_mapCfg,
    Royal_divisionCfg,
    Royal_sceneCfg,
    Store_first_payCfg,
    Teamarena_divisionCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import CopyModel from '../../../../common/models/CopyModel';
import RoleModel from '../../../../common/models/RoleModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import ButtonSoundId from '../../../../configs/ids/ButtonSoundId';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../../act/model/PeakModel';
import { getArenaInfoByiD } from '../../../arena/utils/ArenaUtil';
import BYModel from '../../../bingying/model/BYModel';
import ChampionModel from '../../../champion/model/ChampionModel';
import FootHoldModel, { FhPointInfo } from '../../../guild/ctrl/footHold/FootHoldModel';
import FootHoldUtils from '../../../guild/ctrl/footHold/FootHoldUtils';
import MilitaryRankUtils from '../../../guild/ctrl/militaryRank/MilitaryRankUtils';
import { MRPrivilegeType } from '../../../guild/ctrl/militaryRank/MilitaryRankViewCtrl';
import GuildModel from '../../../guild/model/GuildModel';
import RelicModel from '../../../relic/model/RelicModel';
import RoleHeroItemCtrl2 from '../../../role/ctrl2/selector/RoleHeroItemCtrl2';
import StoreModel from '../../../store/model/StoreModel';
import ScoreSysUtils from '../../../task/ctrl/scoreSystem/ScoreSysUtils';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneCtrl from '../PveSceneCtrl';
import UpgradeHeroItem2Ctrl from '../upgrade/UpgradeHeroItem2Ctrl';
import { CopyType } from './../../../../common/models/CopyModel';
import DamageStatisticeCtrl from './DamageStatisticeCtrl';
import PveSceneFailArenaNodeCtrl from './PveSceneFailArenaNodeCtrl';


/**
 * Pve失败界面控制类
 * @Author: sthoo.huang
 * @Date: 2019-08-01 14:12:48
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-26 11:33:01
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveSceneFailCtrl")
export default class PveSceneFailCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    returnBtn: cc.Node = null;
    @property(cc.Node)
    returnBtnCopy: cc.Node = null;

    @property(cc.Node)
    nextBtn: cc.Node = null;

    @property(cc.Node)
    replayBtn: cc.Node = null;

    // @property(cc.Node)
    // royalRestartBtn: cc.Node = null;

    @property([cc.Node])
    hideNode: cc.Node[] = [];

    @property(cc.Node)
    damageBtnNode: cc.Node = null;

    @property(cc.Node)
    scoreSysBtn: cc.Node = null;

    @property(cc.Node)
    tongjiBtn: cc.Node = null;

    @property(cc.Node)
    tipNode: cc.Node = null;

    @property(cc.Node)
    heroLayout: cc.Node = null;

    @property(cc.Prefab)
    heroShowItem: cc.Prefab = null;

    @property(cc.Node)
    btnStronger: cc.Node = null;

    @property(cc.Sprite)
    tuichu: cc.Sprite = null;

    @property(cc.Node)
    BountyPublishBtn: cc.Node = null;

    @property(cc.Node)
    arenaNode: cc.Node = null;

    @property(cc.Label)
    titleLabe: cc.Label = null;

    @property(cc.Node)
    relicNode: cc.Node = null;

    @property(cc.Node)
    relicRetryNode: cc.Node = null;

    //组队竞技场
    @property(cc.Node)
    arenaTeamNode: cc.Node = null
    @property(cc.Sprite)
    atDuanweiSp: cc.Sprite = null
    @property(cc.Sprite)
    atDuanweiName: cc.Sprite = null
    @property(cc.Node)
    atMaskNode: cc.Node = null
    @property(cc.Label)
    atCurScoreLb: cc.Label = null
    @property(cc.Label)
    atRankLb: cc.Label = null
    @property(cc.Label)
    atRankAdd: cc.Label = null
    @property(cc.Sprite)
    atRankSp: cc.Sprite = null
    @property(cc.Label)
    atScoreLb: cc.Label = null
    @property(cc.Label)
    atScoreAdd: cc.Label = null
    @property(cc.Sprite)
    atScoreSp: cc.Sprite = null

    //巅峰之战
    @property(cc.Node)
    peakNode: cc.Node = null;
    @property(cc.Sprite)
    peakDivisionIcon: cc.Sprite = null;
    @property(cc.Label)
    peakDivisionName: cc.Label = null;
    // @property(cc.Label)
    // peakScoreLb: cc.Label = null;
    // @property(cc.Label)
    // peakScoreAddLb: cc.Label = null;
    @property(cc.Node)
    peakMaskNode: cc.Node = null
    @property(cc.Label)
    peakCurScoreLb: cc.Label = null
    @property(cc.Label)
    peakRankLb: cc.Label = null
    @property(cc.Label)
    peakRankAdd: cc.Label = null
    @property(cc.Sprite)
    peakRankSp: cc.Sprite = null
    @property(cc.Label)
    peakScoreLb: cc.Label = null
    @property(cc.Label)
    peakScoreAdd: cc.Label = null
    @property(cc.Sprite)
    peakScoreSp: cc.Sprite = null


    @property(cc.Node)
    gatherNode: cc.Node = null
    @property(cc.ScrollView)
    gatherScrollView: cc.ScrollView = null;
    @property(cc.Node)
    gatherContent: cc.Node = null
    @property(cc.Prefab)
    gatherDetailItem: cc.Prefab = null;

    //英雄觉醒副本
    @property(cc.Node)
    heroAwakeNode: cc.Node = null;
    @property(cc.Label)
    heroAwakeName: cc.Label = null;
    @property([cc.Node])
    heroAwakeLimitNodes: cc.Node[] = []

    //终极副本再来一次按钮
    @property(cc.Node)
    ultimateRetryBtn: cc.Node = null;

    //皇家竞技场
    @property(cc.Node)
    royalNode: cc.Node = null;
    @property(cc.Sprite)
    royalDivisionIcon: cc.Sprite = null;
    @property(cc.Label)
    royalDivisionName: cc.Label = null;
    @property(cc.Node)
    royalMaskNode: cc.Node = null
    @property(cc.Label)
    royalCurScoreLb: cc.Label = null
    @property(cc.Label)
    royalRankLb: cc.Label = null
    @property(cc.Label)
    royalRankAdd: cc.Label = null
    @property(cc.Sprite)
    royalRankSp: cc.Sprite = null
    @property(cc.Label)
    royalScoreLb: cc.Label = null
    @property(cc.Label)
    royalScoreAdd: cc.Label = null
    @property(cc.Sprite)
    royalScoreSp: cc.Sprite = null
    @property(cc.Sprite)
    royalSelfHeadIcon: cc.Sprite = null;
    @property(cc.Sprite)
    royalSelfHeadFream: cc.Sprite = null;
    @property(cc.Label)
    royalSelfLv: cc.Label = null;
    @property(cc.Label)
    royalSelfName: cc.Label = null;
    @property(cc.Label)
    royalSelfPowerLb: cc.Label = null;
    @property(cc.Sprite)
    royalSelfdivisionIcon: cc.Sprite = null;
    @property(cc.Label)
    royalSelfdivisionName: cc.Label = null;
    @property([cc.Node])
    royalSelfHeros: cc.Node[] = [];
    @property(cc.Sprite)
    royalDefenderHeadIcon: cc.Sprite = null;
    @property(cc.Sprite)
    royalDefenderHeadFream: cc.Sprite = null;
    @property(cc.Label)
    royalDefenderLv: cc.Label = null;
    @property(cc.Label)
    royalDefenderName: cc.Label = null;
    @property(cc.Label)
    royalDefenderPowerLb: cc.Label = null;
    @property(cc.Sprite)
    royalDefenderdivisionIcon: cc.Sprite = null;
    @property(cc.Label)
    royalDefenderdivisionName: cc.Label = null;
    @property([cc.Node])
    royalDefenderHeros: cc.Node[] = [];
    @property([cc.Node])
    royalItemNodes: cc.Node[] = [];
    @property([cc.Node])
    royalStageState: cc.Node[] = []
    @property(cc.Node)
    royalReturnBtn: cc.Node = null
    @property(cc.Node)
    royalNextBtn: cc.Node = null
    @property(cc.Button)
    royalRestartBtn: cc.Button = null;
    @property(cc.Node)
    royalPlayerInfo: cc.Node = null;
    @property(cc.Node)
    royalRankInfo: cc.Node = null;



    time: number = 0;

    gatherList: ListView = null;

    btn1Num: number = 0;
    btn2Num: number = 0;
    rmsg: icmsg.DungeonExitRsp |
        icmsg.ArenaFightResultRsp |
        icmsg.SurvivalExitRsp |
        icmsg.FootholdFightOverRsp |
        icmsg.ActivityCaveExitRsp |
        icmsg.BountyFightOverRsp |
        icmsg.DoomsDayExitRsp |
        icmsg.MartialSoulExitRsp |
        icmsg.DungeonHeroExitRsp |
        icmsg.ChampionFightOverRsp |
        icmsg.RelicFightOverRsp |
        icmsg.VaultFightOverRsp |
        icmsg.RuinExitRsp |
        icmsg.RuinChallengeExitRsp |
        icmsg.ArenaTeamFightOverRsp |
        icmsg.PeakExitRsp |
        icmsg.FootholdGatherFightOverRsp |
        icmsg.GuardianTowerExitRsp |
        icmsg.HeroAwakeExitRsp |
        icmsg.RoyalFightOverRsp

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get guildModel(): GuildModel { return ModelManager.get(GuildModel); }
    get model(): PveSceneModel {
        let view = gdk.gui.getCurrentView();
        if (view === gdk.panel.get(PanelId.PveScene)) {
            // 塔防
            return view.getComponent(PveSceneCtrl).model;
        }
        return null;
    }

    onLoad() {
        this.rmsg = this.args[0];
    }

    onEnable() {
        this.relicNode.active = false;
        this.relicRetryNode.active = false;
        this.damageBtnNode.active = false;
        this.BountyPublishBtn.active = false;
        this.roleModel.gradingWarFail = true;
        this.royalRestartBtn.node.active = false;
        this.royalNode.active = false;
        // 设置按钮显示
        // 回放按钮
        this.replayBtn.active = false;
        this.arenaTeamNode.active = false;
        this.peakNode.active = false;
        this.scoreSysBtn.active = true;
        this.heroAwakeNode.active = false;

        let copyId: CopyType = CopyType.NONE;
        let view = gdk.gui.getCurrentView();
        this.returnBtn.parent.active = true;
        this.titleLabe.node.parent.active = true;
        if (view === gdk.panel.get(PanelId.PveScene)) {
            // 塔防战斗
            let model = this.model as PveSceneModel;
            copyId = model.stageConfig.copy_id;
            if (model.isBounty) {
                // 赏金模式
                this._hideBtns(true);
                this.returnBtnCopy.active = false;
                this.nextBtn.active = true;
                this.returnBtn.active = true;
            } else if (copyId == CopyType.MAIN || copyId == CopyType.Elite) {
                // 主线或精英副本
                this.nextBtn.active = true;
                this.returnBtn.active = true;
                this.returnBtnCopy.active = false;
                this.hideNode[3].active = true;
            } else if (copyId == CopyType.Trial) {
                this._hideBtns();
                this.BountyPublishBtn.active = true;
                //this.replayBtn.active = true;
            }
            else if (this.rmsg instanceof icmsg.ArenaTeamFightOverRsp) {
                this.returnBtn.parent.active = false;
                let roleModel = ModelManager.get(RoleModel)
                let curData: icmsg.ArenaTeamFightResult = null;
                this.rmsg.results.forEach(data => {
                    if (data.playerId == roleModel.id) {
                        curData = data;
                    }
                })
                if (curData) {
                    let cfgs = ConfigManager.getItems(Teamarena_divisionCfg, (cfg: Teamarena_divisionCfg) => {
                        if (cfg.point <= curData.newScore) {
                            return true;
                        }
                        return false;
                    })
                    let curCfg = cfgs[cfgs.length - 1];
                    let nextCfg = ConfigManager.getItemByField(Teamarena_divisionCfg, 'lv', curCfg.lv + 1);
                    let nextScore = curCfg.point;
                    if (nextCfg) {
                        nextScore = nextCfg.point;
                    }
                    let path1 = 'view/champion/texture/champion/jbs_duanwei0' + curCfg.division;
                    GlobalUtil.setSpriteIcon(this.node, this.atDuanweiSp, path1);
                    let path2 = 'view/champion/texture/champion/jbs_duanweimingcheng0' + curCfg.division;
                    GlobalUtil.setSpriteIcon(this.node, this.atDuanweiName, path2);

                    this.atCurScoreLb.string = curData.newScore + '/' + nextScore;
                    this.atMaskNode.width = 450 * (Math.min(1, curData.newScore / nextScore))
                    this.atRankLb.string = curData.newRank + ''
                    this.atScoreLb.string = curData.newScore + ''
                    this.atRankAdd.string = Math.abs(curData.newRank - curData.oldRank) + ''
                    this.atScoreAdd.string = Math.abs(curData.newScore - curData.oldScore) + ''
                    let path3 = curData.newRank < curData.oldRank ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
                    this.atRankSp.node.active = curData.newRank != curData.oldRank;
                    this.atRankAdd.node.active = curData.newRank != curData.oldRank;
                    GlobalUtil.setSpriteIcon(this.node, this.atRankSp, path3);
                    let path4 = curData.newScore > curData.oldScore ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
                    GlobalUtil.setSpriteIcon(this.node, this.atScoreSp, path4);
                }

            } else if (this.rmsg instanceof icmsg.PeakExitRsp) {

                this.nextBtn.active = false;
                this.returnBtn.active = true;
                this.returnBtnCopy.active = false;
                this.peakNode.active = true;
                this.scoreSysBtn.active = false;


                let divisionCfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', this.rmsg.rank)
                if (divisionCfg) {
                    GlobalUtil.setSpriteIcon(this.node, this.peakDivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
                    this.peakDivisionName.string = divisionCfg.name;
                }
                let nextCfg = ConfigManager.getItemByField(Peak_divisionCfg, 'lv', divisionCfg.division + 1);
                let nextScore = divisionCfg.point;
                if (nextCfg) {
                    nextScore = nextCfg.point;
                }
                this.peakScoreLb.string = this.rmsg.points + '';
                let peakModel = ModelManager.get(PeakModel);
                peakModel.peakStateInfo.enterTimes = this.rmsg.enterTimes;

                let rmsg = this.rmsg;
                this.peakCurScoreLb.string = rmsg.points + '/' + nextScore;
                this.peakMaskNode.width = 450 * (Math.min(1, rmsg.points / nextScore))
                this.peakRankLb.string = rmsg.ranking + ''
                this.peakScoreLb.string = rmsg.points + ''
                this.peakRankAdd.string = Math.abs(rmsg.ranking - rmsg.rankingBf) + ''
                this.peakScoreAdd.string = Math.abs(rmsg.addPoints) + ''
                let path3 = rmsg.ranking < rmsg.rankingBf ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
                this.peakRankSp.node.active = rmsg.ranking != rmsg.rankingBf;
                this.peakRankAdd.node.active = rmsg.ranking != rmsg.rankingBf;
                this.peakScoreSp.node.active = rmsg.addPoints != 0;
                this.peakScoreAdd.node.active = rmsg.addPoints != 0;
                GlobalUtil.setSpriteIcon(this.node, this.peakRankSp, path3);
                let path4 = rmsg.addPoints > 0 ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
                GlobalUtil.setSpriteIcon(this.node, this.peakScoreSp, path4);
                // this.peakScoreAddLb.node.active = peakModel.peakStateInfo.points != this.rmsg.points
                // let tem = Math.abs(this.rmsg.points - peakModel.peakStateInfo.points)
                // this.peakScoreAddLb.string = '(-' + tem + ')'

                peakModel.peakStateInfo.points = this.rmsg.points;
                peakModel.peakStateInfo.rank = this.rmsg.rank;
                if (this.rmsg.rank > peakModel.peakStateInfo.maxRank) {
                    peakModel.peakStateInfo.maxRank = this.rmsg.rank;
                }
            } else if (this.rmsg instanceof icmsg.RoyalFightOverRsp) {

                this.nextBtn.active = false;
                this.returnBtn.active = false;
                this.returnBtnCopy.active = false;
                this.royalNode.active = true;
                this.scoreSysBtn.active = false;
                let rModel = ModelManager.get(RoyalModel);
                let rmsg = this.rmsg
                let divisionCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', rmsg.newDiv)
                if (divisionCfg) {
                    GlobalUtil.setSpriteIcon(this.node, this.royalDivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
                    this.royalDivisionName.string = divisionCfg.name;
                } else {
                    divisionCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', rModel.division)
                    GlobalUtil.setSpriteIcon(this.node, this.royalDivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
                    this.royalDivisionName.string = divisionCfg.name;
                }
                let nextCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', divisionCfg.division + 1);
                let nextScore = divisionCfg.point;
                if (nextCfg) {
                    nextScore = nextCfg.point;
                }

                this.royalCurScoreLb.string = rmsg.newScore + '/' + nextScore;
                this.royalMaskNode.width = 450 * (Math.min(1, rmsg.newScore / nextScore))
                this.royalRankLb.string = rmsg.newRank + ''
                this.royalScoreLb.string = rmsg.newScore + ''
                this.royalRankAdd.string = Math.abs(rmsg.newRank - rModel.rank) + ''
                let addPoints = rmsg.newScore - rModel.score;
                this.royalScoreAdd.string = Math.abs(addPoints) + ''
                let path3 = (rmsg.newRank < rModel.rank || rModel.rank == 0) ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
                let rankState = rmsg.newRank != rModel.rank;
                this.royalRankSp.node.active = rankState
                this.royalRankAdd.node.active = rankState
                this.royalScoreSp.node.active = addPoints != 0;
                this.royalScoreAdd.node.active = addPoints != 0;
                GlobalUtil.setSpriteIcon(this.node, this.royalRankSp, path3);
                let path4 = addPoints > 0 ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
                GlobalUtil.setSpriteIcon(this.node, this.royalScoreSp, path4);
                let rM = ModelManager.get(RoyalModel);
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
                if (lossNum >= 2) {
                    this.royalReturnBtn.active = true;
                    this.royalNextBtn.active = false;

                } else {
                    this.royalReturnBtn.active = false;
                    this.royalNextBtn.active = true;
                    if (rModel.testSceneId <= 0) {
                        this.time = Date.now() + 5000;
                        this._updateRoyalNextLeveTime();
                        gdk.Timer.loop(500, this, this._updateRoyalNextLeveTime);
                    }
                }

                rModel.showDivUpView = rmsg.newDiv > rModel.division;
                if (rmsg.newDiv > rModel.division) {
                    let cfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', rmsg.newDiv)
                    if (!cc.js.isString(cfg.stage_id)) {
                        GlobalUtil.setLocal('Royal_showDivUpView', true);
                    }
                }

                if (lossNum >= 2) {
                    rModel.division = rmsg.newDiv;
                    rModel.rank = rmsg.newRank
                    rModel.score = rmsg.newScore;
                }


                if (rModel.testSceneId > 0) {
                    this.royalReturnBtn.active = true;
                    this.royalNextBtn.active = false
                    this.royalRestartBtn.node.active = true;
                    this.royalPlayerInfo.active = false;
                } else {
                    this.royalPlayerInfo.active = true;
                    //设置玩家信息
                    this.royalItemNodes.forEach((node, i) => {
                        node.active = rModel.curFightNum >= i
                    })
                    this.royalStageState.forEach((node, i) => {
                        let temWin = false
                        if (rM.attackWinList[i] == 2) {
                            temWin = true;
                        }
                        GlobalUtil.setSpriteIcon(this.node, node, 'view/royalArena/texture/view/' + (temWin ? 'sjtj_sheng' : 'sjtj_bai'))
                    })
                    this.royalRankInfo.active = lossNum >= 2;
                    // 设置自己的信息
                    GlobalUtil.setSpriteIcon(this.node, this.royalSelfHeadFream, GlobalUtil.getHeadFrameById(this.roleModel.frame));
                    GlobalUtil.setSpriteIcon(this.node, this.royalSelfHeadIcon, GlobalUtil.getHeadIconById(this.roleModel.head));
                    this.royalSelfName.string = this.roleModel.name;
                    this.royalSelfLv.string = '.' + this.roleModel.level;
                    //计算当前上阵英雄战力和
                    let powerNum = 0;
                    let temHeroList: number[] = GlobalUtil.getLocal('Royal_setUpHero_atk')
                    if (!temHeroList) {
                        temHeroList = [0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                    let heroIds = temHeroList.concat()
                    let selfheroDatas = []
                    heroIds.forEach((heroId, i) => {
                        if (heroId) {
                            let tem = HeroUtils.getHeroInfoBySeries(heroId)
                            if (tem) {
                                selfheroDatas[i] = tem;
                                powerNum += (tem.extInfo as icmsg.HeroInfo).power;
                            } else {
                                selfheroDatas[i] = null;
                            }
                        } else {
                            selfheroDatas[i] = null;
                        }
                    })

                    this.royalSelfPowerLb.string = powerNum + '';
                    if (divisionCfg) {
                        GlobalUtil.setSpriteIcon(this.node, this.royalSelfdivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
                        this.royalSelfdivisionName.string = divisionCfg.name;
                    }
                    this.royalSelfHeros.forEach((item, i) => {
                        if (selfheroDatas[i]) {
                            item.active = true;
                            let ctrl = item.getComponent(RoleHeroItemCtrl2)
                            ctrl.data = { data: selfheroDatas[i], heros: [], isSelect: false };
                            ctrl.updateView();
                        } else {
                            item.active = false;
                        }
                    })

                    // 设置敌人的信息
                    let defenderData = rM.playerData
                    GlobalUtil.setSpriteIcon(this.node, this.royalDefenderHeadFream, GlobalUtil.getHeadFrameById(defenderData.brief.headFrame));
                    GlobalUtil.setSpriteIcon(this.node, this.royalDefenderHeadIcon, GlobalUtil.getHeadIconById(defenderData.brief.head));
                    this.royalDefenderName.string = defenderData.brief.name;
                    this.royalDefenderLv.string = '.' + defenderData.brief.level;
                    //计算当前上阵英雄战力和
                    let powerNum1 = 0;
                    let upHeros1 = defenderData.heroes
                    let defenderheroDatas = []
                    upHeros1.forEach((data, i) => {
                        if (data) {
                            if (data.soldierId == 0) {
                                let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', data.careerId);
                                data.soldierId = careerCfg.career_type * 100 + 1
                            }
                            let tem = HeroUtils.createHeroBagItemBy(data)
                            if (tem) {
                                defenderheroDatas[i] = tem;
                            } else {
                                defenderheroDatas[i] = null;
                            }
                            powerNum1 += data.power;
                        } else {
                            defenderheroDatas[i] = null;
                        }
                    })

                    this.royalDefenderPowerLb.string = powerNum1 + '';
                    let divisionCfg1 = ConfigManager.getItemByField(Royal_divisionCfg, 'division', defenderData.div)
                    if (divisionCfg1) {
                        GlobalUtil.setSpriteIcon(this.node, this.royalDefenderdivisionIcon, 'view/act/texture/peak/' + divisionCfg1.icon)
                        this.royalDefenderdivisionName.string = divisionCfg1.name;
                    }
                    this.royalDefenderHeros.forEach((item, i) => {
                        if (defenderheroDatas[i]) {
                            item.active = true;
                            let ctrl = item.getComponent(RoleHeroItemCtrl2)
                            ctrl.data = { data: defenderheroDatas[i], heros: [], isSelect: false };
                            ctrl.updateView();
                        } else {
                            item.active = false;
                        }
                    })
                }

            } else if (this.rmsg instanceof icmsg.HeroAwakeExitRsp) {
                this.nextBtn.active = false;
                this.returnBtn.active = true;
                this.returnBtnCopy.active = false;
                this.heroAwakeNode.active = true;
                this.scoreSysBtn.active = false;
                this.titleLabe.node.parent.active = false;

                let view = gdk.gui.getCurrentView();
                let sceneModel = view.getComponent(PveSceneCtrl).model;
                let dataList = sceneModel.gateconditionUtil.DataList;
                this.heroAwakeName.string = sceneModel.stageConfig.name
                let starSpStrs: string[] = ['view/instance/texture/endRuins/xsl_xingxing', 'view/instance/texture/endRuins/fb_xingxing01'];
                let colorList: cc.Color[] = [cc.color('#b6b6b6'), cc.color('#cf483a')]

                this.heroAwakeLimitNodes.forEach((node, index) => {
                    let star = node.getChildByName('star')
                    let lb1 = node.getChildByName('lab1').getComponent(cc.Label)
                    let lb2 = node.getChildByName('lab2').getComponent(cc.Label)
                    let temData = dataList[index]
                    lb1.string = temData.cfg.des;
                    if (temData.cfg.type != 4 && temData.cfg.type != 7) {
                        temData.curData = 1;
                        temData.limitData = 1
                    }
                    if (temData.cfg.type == 7 && (temData.cfg.subType == 1 || temData.cfg.subType == 7)) {
                        lb2.string = `(${Math.floor(temData.curData / 10000)}w/${Math.floor(temData.limitData / 10000)}w)`;
                    } else {
                        lb2.string = `(${temData.curData}/${temData.limitData})`;
                    }
                    //lb2.string = `(${temData.curData}/${temData.limitData})`;
                    let temIdx = (temData.state && temData.start) ? 0 : 1;
                    lb1.node.color = colorList[temIdx]
                    lb2.node.color = colorList[temIdx]
                    GlobalUtil.setSpriteIcon(this.node, star, starSpStrs[temIdx]);
                })
            }
            else {
                // 退出到准备场景
                this._hideBtns();
            }
        }

        //展示英雄 是否需要提升信息
        this.heroLayout.active = true;
        this.heroLayout.removeAllChildren()
        if (!(this.rmsg instanceof icmsg.ArenaFightResultRsp) &&
            !(this.rmsg instanceof icmsg.ChampionFightOverRsp) &&
            !(this.rmsg instanceof icmsg.ArenaTeamFightOverRsp) &&
            !(this.rmsg instanceof icmsg.PeakExitRsp) &&
            !(this.rmsg instanceof icmsg.FootholdGatherFightOverRsp) &&
            !(this.rmsg instanceof icmsg.HeroAwakeExitRsp) &&
            !(this.rmsg instanceof icmsg.RoyalFightOverRsp)) {
            this.updateShowHero()
        }

        //竞技场
        this._showArenInfo();

        // 停止播放战斗音乐
        GlobalUtil.isMusicOn && gdk.music.stop()
        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.fightFail);

        // 动画效果
        let t = this.spine.setAnimation(0, "stand", false)
        if (t) {
            this.spine.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === "stand") {
                    this.spine.timeScale = 1;
                    this.spine.setAnimation(0, "stand2", true)
                }
            });
        }


        if (copyId == CopyType.Trial) {
            // 生存副本不显示回放按钮
            let qmsg = new icmsg.FightLookupReq();
            qmsg.stageId = this.model.id;
            NetManager.send(qmsg, (rmsg: icmsg.FightLookupRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.replayBtn.active = rmsg.list.length > 0;
                this.replayBtn.getChildByName('RedNum').getComponent(cc.Label).string = rmsg.list.length + '';
            }, this);
        }

        //终极副本
        if (copyId == CopyType.Ultimate) {
            ModelManager.get(CopyModel).ultimatIsClear = false
            let leftTime = ModelManager.get(CopyModel).ultimateLeftNum
            if (leftTime > 0) {
                this.ultimateRetryBtn.active = true
                cc.find(`layout/num`, this.ultimateRetryBtn).getComponent(cc.Label).string = `${leftTime}`
            }
        }

        // 我要变强
        let upTip = this.scoreSysBtn.getChildByName("upTip")
        upTip.active = ScoreSysUtils.is_can_upgrade(true)

        // 退出按钮标签文本
        let path1 = copyId != CopyType.RookieCup ? 'view/pve/texture/ui/zd_qutishengshili' : 'view/pve/texture/ui/zd_tuichu';
        GlobalUtil.setSpriteIcon(this.node, this.tuichu, path1);

        if (this.rmsg instanceof icmsg.ArenaTeamFightOverRsp) {
            this.arenaTeamNode.active = true;
            this.scoreSysBtn.active = false;
        }
    }

    onDisable() {
        NetManager.targetOff(this);
        if (this.rmsg instanceof icmsg.RelicFightOverRsp) {
            let m = ModelManager.get(RelicModel);
            let mapType = ConfigManager.getItemById(Relic_mapCfg, m.mapId).mapType;
            m.jumpArgs = `${mapType}-${(<icmsg.RelicFightOverRsp>this.rmsg).pointId}`;
        }
        let sM = ModelManager.get(StoreModel);
        if (!sM.fbFaildTrigger && sM.firstPaySum < ConfigManager.getItemById(Store_first_payCfg, 4).RMB_cost) {
            if (this.rmsg instanceof icmsg.DungeonExitRsp
                || this.rmsg instanceof icmsg.ArenaFightResultRsp
                || this.rmsg instanceof icmsg.FootholdFightOverRsp
                || this.rmsg instanceof icmsg.MartialSoulExitRsp) {
                if (this.rmsg instanceof icmsg.DungeonExitRsp) {
                    let cfg = ConfigManager.getItemById(Copy_stageCfg, this.rmsg.stageId) || ConfigManager.getItemById(Eternal_stageCfg, this.rmsg.stageId);
                    if (cfg && [5, 10, 15].indexOf(cfg.copy_id) !== -1) {
                        sM.fbFaildTrigger = true;
                        JumpUtils.openFirstPayGift();
                    }
                }
                else {
                    sM.fbFaildTrigger = true;
                    JumpUtils.openFirstPayGift();
                }
            }
        }
    }

    // 退出按钮
    returnHandle() {
        // 针对当前不同的战斗场景，不同的操作
        let view = gdk.gui.getCurrentView();
        let fsmc = view.getComponent(gdk.fsm.FsmComponent);
        if (view === gdk.panel.get(PanelId.PveScene)) {
            // 当前战斗场景为塔防场景, 退出到准备场景
            if (this.model.stageConfig.copy_id != CopyType.MAIN) {
                // 其他副本(专精副本)这关闭副本和结算界面
                let panel = view.getComponent(gdk.BasePanel);
                if (panel) {
                    panel.close();
                }
                if (this.model.stageConfig.copy_id == CopyType.Mystery) {
                    // 关闭当前界面
                    gdk.panel.open(PanelId.MysteryVisitorActivityMainView);
                }
                return;
            }
            // 退出到主线准备场景
            gdk.panel.open(PanelId.PveReady);
        }
    }

    // 再试一次按钮
    tryHandle() {
        // 针对当前不同的战斗场景，不同的操作
        let view = gdk.gui.getCurrentView();
        let fsmc = view.getComponent(gdk.fsm.FsmComponent);
        if (view === gdk.panel.get(PanelId.PveScene)) {
            // 当前战斗场景为塔防场景
            fsmc.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
        }
    }

    _hideBtns(all: boolean = false) {
        this.nextBtn.active = false;
        this.returnBtn.active = false;
        this.returnBtnCopy.active = true;
        if (all) {
            //隐藏提升途径
            for (let i = 0; i < this.hideNode.length; i++) {
                this.hideNode[i].active = false;
            }
        }
    }

    openUpgradeHero() {
        gdk.panel.open(PanelId.UpgradeHero)
    }

    openUpgradeBarrack() {
        gdk.panel.open(PanelId.UpgradeBarrack)
    }

    openUpgradeEquip() {
        gdk.panel.open(PanelId.UpgradeEquip)
    }

    isHeroNeedUgrade() {
        let model = this.model;
        let heroInfos: icmsg.HeroInfo[] = [];
        if (model instanceof PveSceneModel) {
            // 塔防
            for (let i = 0, n = model.heros.length; i < n; i++) {
                let heroInfo = HeroUtils.getHeroInfoById(model.heros[i].model.id)
                if (heroInfo) {
                    heroInfos.push(heroInfo)
                }
            }
        }

        let copyModel = ModelManager.get(CopyModel)
        let stageId = copyModel.latelyStageId
        let strongerCfg = ConfigManager.getItemByField(Common_strongerCfg, "index", stageId)
        if (!strongerCfg) {
            return false
        }
        for (let i = 0; i < heroInfos.length; i++) {
            if (heroInfos[i].level < strongerCfg.level) {
                return true
            }
            // let heroCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroInfos[i].careerId)
            // if (strongerCfg["class_" + heroCareerCfg.career_type] && strongerCfg["class_" + heroCareerCfg.career_type].length > 0) {
            //     if (heroCareerCfg.rank < strongerCfg["class_" + heroCareerCfg.career_type][0] ||
            //         (heroCareerCfg.rank == strongerCfg["class_" + heroCareerCfg.career_type][0] && GlobalUtil.getHeroCareerLv(heroInfos[i]) < strongerCfg["class_" + heroCareerCfg.career_type][1])) {
            //         return true
            //     }
            // }
        }
        return false
    }


    isByNeedUpgrade() {
        let byModel = ModelManager.get(BYModel)
        let byTechInfos = byModel.byTechInfos
        let keys = ["hp_g", "atk_g", "def_g", "hp_r", "atk_r", "def_r"]
        let attInfos = {
            "hp_g": 0,
            "atk_g": 0,
            "def_g": 0,
            "hp_r": 0,
            "atk_r": 0,
            "def_r": 0,
        }

        let copyModel = ModelManager.get(CopyModel)
        let stageId = copyModel.latelyStageId
        let strongerCfg = ConfigManager.getItemByField(Common_strongerCfg, "index", stageId)

        let ids = [1, 3, 4]
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i]
            // 遍历当前已开启的科技
            // for (const key in byTechInfos) {
            //     let info: BarrackTech = byTechInfos[key]    // 科技等级信息
            //     let id = parseInt(key)  // 科技id
            //     let techCfg = ConfigManager.getItemById(Barracks_scienceCfg, id)    // 科技描述信息

            //     let byCfg = ConfigManager.getItemById(Barracks_practiceCfg, techCfg.practice_lv)// 所属兵营信息
            //     if ((100 + id) == byCfg.barracks_id) {
            //         let attCfg = ConfigManager.getItemByField(Barracks_science_lvCfg, "science_id", id, { science_lv: info.level }) // 属性信息
            //         if (attCfg && attCfg.soldier_id == 0) {
            //             for (let index = 0; index < keys.length; index++) {
            //                 const _key = keys[index];
            //                 attInfos[_key] += attCfg[_key]
            //             }
            //         }
            //     }
            // }
            for (let index = 0; index < keys.length; index++) {
                let _key = keys[index]
                let value = attInfos[_key]
                if (strongerCfg && value < strongerCfg[_key]) {
                    return true
                }
            }
        }
        return false
    }


    isEquipNeedUpgrade() {
        let heroInfos: icmsg.HeroInfo[] = []
        let model = this.model;
        if (model instanceof PveSceneModel) {
            // 塔防
            for (let i = 0, n = model.heros.length; i < n; i++) {
                let heroInfo = HeroUtils.getHeroInfoById(model.heros[i].model.id)
                if (heroInfo) {
                    heroInfos.push(heroInfo)
                }
            }
        }

        let copyModel = ModelManager.get(CopyModel)
        let stageId = copyModel.latelyStageId
        let strongerCfg = ConfigManager.getItemByField(Common_strongerCfg, "index", stageId)
        if (!strongerCfg) {
            return false
        }
        // for (let i = 0; i < heroInfos.length; i++) {
        //     let equips = heroInfos[i].equips
        //     let totalLv = 0
        //     for (let j = 0; j < equips.length; j++) {
        //         const id = equips[j] || 0;
        //         let equipData: BagItem = EquipUtils.getEquipData(id)
        //         if (equipData) {
        //             totalLv += (<EquipInfo>equipData.extInfo).level
        //         }
        //     }
        //     if (totalLv < strongerCfg.strengthening) {
        //         return true
        //     }
        // }
        return false
    }

    btn1Click() {
        this.btn1Num++;
    }

    btn2Click() {
        if (this.btn1Num == 3) {
            this.damageBtnNode.active = true;
        } else {
            this.btn1Num = 0;
        }
    }

    /**提战嘉年华 */
    openScoreSysView() {
        // this.returnHandle();
        // this.close();
        // if (JumpUtils.ifSysOpen(1301)) {
        //     gdk.panel.open(PanelId.MainPanel);
        // }
        // else {
        //     gdk.panel.open(PanelId.PveReady);
        // }

        // gdk.panel.open(PanelId.SevenDays, () => {
        //     gdk.panel.setArgs(PanelId.SevenDaysStore, 1)
        //     gdk.panel.open(PanelId.SevenDaysStore)
        // });
        gdk.panel.open(PanelId.ScoreSytemView)
    }

    // 打开回放列表界面
    openReplayList() {
        this.returnHandle();
        JumpUtils.openReplayListView(this.model.id);
    }

    //打开统计UI
    openDamgeStatistice() {
        gdk.panel.open(PanelId.DamageStatisticeView, (node: cc.Node) => {
            let ctrl = node.getComponent(DamageStatisticeCtrl);
            let type = "PVE";
            let view = gdk.gui.getCurrentView();
            if (view === gdk.panel.get(PanelId.PvpScene)) {
                type = "PVP"
            }
            ctrl.initDamageStatisticeData(type, [false]);
        })
    }

    showTipNode() {
        this.tipNode.active = !this.tipNode.active
        // // 英雄
        // this.hideNode[0].active = true;
        // 装备
        this.hideNode[2].active = true;
        // 兵营是否开放
        this.hideNode[1].active = JumpUtils.ifSysOpen(1100, false)
        // let tip0 = this.hideNode[0].getChildByName("tip")
        // tip0.active = this.isHeroNeedUgrade()
        let tip2 = this.hideNode[2].getChildByName("tip")
        tip2.active = this.isEquipNeedUpgrade()
        if (this.hideNode[1].active) {
            let tip1 = this.hideNode[1].getChildByName("tip")
            tip1.active = this.isByNeedUpgrade()
        }
    }

    hideTipNode() {
        this.tipNode.active = false
    }

    _showArenInfo() {

        if (this.rmsg instanceof icmsg.ArenaFightResultRsp) {
            //this.titleLabe.string = gdk.i18n.t("i18n:PVE_FAIL_VIEW_TIP1")//'玩家信息';
            this.titleLabe.node.parent.active = false;
            this.arenaNode.active = true;
            this.scoreSysBtn.active = false;
            let log = this.rmsg.log;

            // let infos = [
            //     {
            //         player: log.opponentId,
            //         frame: log.opponentFrame,
            //         head: log.opponentHead,
            //         name: log.opponentName,
            //         power: log.opponentPower,
            //         score: getArenaInfoByiD(log.opponentId) ? getArenaInfoByiD(log.opponentId).score : 0 + Math.abs(this.rmsg.addScore),
            //         change: Math.abs(this.rmsg.addScore),
            //     },
            //     {
            //         player: this.roleModel.id,
            //         frame: this.roleModel.frame,
            //         head: this.roleModel.head,
            //         name: this.roleModel.name,
            //         power: this.roleModel.power,
            //         score: this.rmsg.score,
            //         change: log.addScore,
            //     }
            // ];
            let score1 = getArenaInfoByiD(log.opponentId) ? getArenaInfoByiD(log.opponentId).score : 0 + Math.abs(this.rmsg.addScore)
            let infos = [this.model.pvpRivalPlayerId, this.roleModel.id]
            let change = [[score1, Math.abs(this.rmsg.addScore)], [this.rmsg.score, log.addScore]]
            let ctrl = this.arenaNode.getComponent(PveSceneFailArenaNodeCtrl)
            ctrl.setPlayerData(infos, change, 1)

            this._hideBtns(true);
            this.hideTipNode();
            this.returnBtnCopy.active = false;
            this.tongjiBtn.active = false;
            this.heroLayout.active = false;
            // [this.arenaNode.getChildByName('winner'), this.arenaNode.getChildByName('loser')].forEach((node, idx) => {
            //     let info = infos[idx];
            //     GlobalUtil.setSpriteIcon(this.node, node.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(info.frame));
            //     GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', node), GlobalUtil.getHeadIconById(info.head));
            //     cc.find('layout/name', node).getComponent(cc.Label).string = info.name;
            //     node.getChildByName('power').getComponent(cc.Label).string = info.power + '';
            //     node.getChildByName('score').getComponent(cc.Label).string = info.score + '';
            //     node.getChildByName('rank').getComponent(cc.Label).string = info.change + '';
            //     let jifenIcon = node.getChildByName('icon_jifen');
            //     jifenIcon.width = 28
            //     jifenIcon.height = 32
            //     let path = 'common/texture/arena/icon_jifen'
            //     GlobalUtil.setSpriteIcon(this.node, jifenIcon, path)
            // });
        } else if (this.rmsg instanceof icmsg.ChampionFightOverRsp) {
            //this.titleLabe.string = gdk.i18n.t("i18n:PVE_FAIL_VIEW_TIP1")//'玩家信息';
            this.titleLabe.node.parent.active = false;
            this.arenaNode.active = true;
            this.scoreSysBtn.active = false;
            let championModel = ModelManager.get(ChampionModel)
            championModel.infoData.points = this.rmsg.newPoints1
            championModel.infoData.level = this.rmsg.newRankLv1
            championModel.infoData.freeFightNum = Math.max(0, championModel.infoData.freeFightNum - 1)
            if (championModel.addBuyNum) {
                championModel.addBuyNum = false;
                championModel.infoData.boughtFightNum += 1;
            }
            NetManager.send(new icmsg.ChampionInfoReq())
            let myScore = this.rmsg.newPoints1
            let myAdd = this.rmsg.addPoints1
            let playerScore = championModel.championMatchData.opponent.points
            let palyerBrief: icmsg.RoleBrief = championModel.championMatchData.opponent.brief
            let playerPower = palyerBrief.power;
            let playerAdd = this.rmsg.addPoints2;
            // let infos = [
            //     {
            //         player: palyerBrief.id,
            //         frame: palyerBrief.headFrame,
            //         head: palyerBrief.head,
            //         name: palyerBrief.name,
            //         power: playerPower,
            //         score: playerScore,
            //         change: playerAdd,
            //     },
            //     {
            //         player: this.roleModel.id,
            //         frame: this.roleModel.frame,
            //         head: this.roleModel.head,
            //         name: this.roleModel.name,
            //         power: this.roleModel.power,
            //         score: myScore,
            //         change: myAdd,
            //     }

            // ];
            let change = [[playerScore, playerAdd], [myScore, myAdd]]
            let infos = [palyerBrief.id, this.roleModel.id]
            let ctrl = this.arenaNode.getComponent(PveSceneFailArenaNodeCtrl)
            ctrl.setPlayerData(infos, change, 2)

            this._hideBtns(true);
            this.hideTipNode();
            this.returnBtnCopy.active = false;
            this.tongjiBtn.active = false;
            this.heroLayout.active = false;
            // [this.arenaNode.getChildByName('winner'), this.arenaNode.getChildByName('loser')].forEach((node, idx) => {
            //     let info = infos[idx];
            //     GlobalUtil.setSpriteIcon(this.node, node.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(info.frame));
            //     GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', node), GlobalUtil.getHeadIconById(info.head));
            //     cc.find('layout/name', node).getComponent(cc.Label).string = info.name;
            //     node.getChildByName('power').getComponent(cc.Label).string = info.power + '';
            //     node.getChildByName('score').getComponent(cc.Label).string = info.score + '';
            //     node.getChildByName('rank').getComponent(cc.Label).string = info.change + '';
            //     let jifenIcon = node.getChildByName('icon_jifen');
            //     jifenIcon.width = 32
            //     jifenIcon.height = 29
            //     let path = 'common/texture/pve/fb_bei'
            //     GlobalUtil.setSpriteIcon(this.node, jifenIcon, path)
            // });
        } else if (this.rmsg instanceof icmsg.RelicFightOverRsp) {
            this.arenaNode.active = true;
            this.titleLabe.node.parent.active = false;
            this.relicNode.active = false;
            this.scoreSysBtn.active = false;
            //this._updateRelicNode();
            let m = ModelManager.get(RelicModel);
            let info = m.cityMap[this.rmsg.pointId];
            let hP = Math.max(0, this.rmsg.remainHP);
            let totalHp = m.curAtkPlayerType === 0 ? info.cfg.owner_hp : info.cfg.helper_hp;
            // cc.find('pveNode/percentLab', this.relicNode).getComponent(cc.Label).string = `${hP}/${totalHp}`
            // cc.find('pveNode/proMask', this.relicNode).width = Math.min(235, hP / totalHp * 235);

            // let infos = [
            //     {
            //         player: palyerBrief.id,
            //         frame: palyerBrief.headFrame,
            //         head: palyerBrief.head,
            //         name: palyerBrief.name,
            //         power: playerPower,
            //         score: 0,
            //         change: 0,
            //     },
            //     {
            //         player: this.roleModel.id,
            //         frame: this.roleModel.frame,
            //         head: this.roleModel.head,
            //         name: this.roleModel.name,
            //         power: this.roleModel.power,
            //         score: 0,
            //         change: 0,
            //     }

            // ];
            let change = [[0, 0], [0, 0]]
            let infos = [this.model.pvpRivalPlayerId, this.roleModel.id]
            let ctrl = this.arenaNode.getComponent(PveSceneFailArenaNodeCtrl)
            ctrl.setPlayerData(infos, change, 3, `${hP}/${totalHp}`, Math.min(235, hP / totalHp * 235))

            this._hideBtns(true);
            this.hideTipNode();
            this.returnBtnCopy.active = false;
            this.tongjiBtn.active = false;
            this.heroLayout.active = false;
            // this.returnBtn.active = true;
            // this.relicRetryNode.active = true;
        } else if (this.rmsg instanceof icmsg.ArenaTeamFightOverRsp) {
            this.arenaNode.active = false;
            this.titleLabe.node.active = false;
            this.relicNode.active = false;
            this.hideTipNode();
        } else if (this.rmsg instanceof icmsg.PeakExitRsp) {
            this.arenaNode.active = false;
            this.titleLabe.node.active = false;
            this.titleLabe.node.parent.active = false;
            this.relicNode.active = false;
            this.hideTipNode();
        } else if (this.rmsg instanceof icmsg.FootholdGatherFightOverRsp) {
            this.arenaNode.active = false;
            this.titleLabe.node.parent.active = false
            this.scoreSysBtn.active = false
            this.gatherNode.active = true
            this.tongjiBtn.active = false
            this._updateGatherNode()

            this.hideTipNode();
        } else if (this.rmsg instanceof icmsg.RoyalFightOverRsp) {
            this.arenaNode.active = false;
            this.titleLabe.node.parent.active = false
            this.scoreSysBtn.active = false
            this.tongjiBtn.active = false
            this.hideTipNode();
        }
        else {
            this.arenaNode.active = false;
            this.titleLabe.string = gdk.i18n.t("i18n:PVE_FAIL_VIEW_TIP2")//'提升途径';
        }
    }

    updateShowHero() {
        let model = this.model;
        let heroInfos: icmsg.HeroInfo[] = [];
        if (model instanceof PveSceneModel) {
            // 塔防
            for (let i = 0, n = model.heros.length; i < n; i++) {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(model.heros[i].model.heroId)
                if (heroInfo) {
                    heroInfos.push(heroInfo)
                }
            }
        }

        GlobalUtil.sortArray(heroInfos, (a: icmsg.HeroInfo, b: icmsg.HeroInfo) => {
            return b.color - a.color
        })

        this.heroLayout.removeAllChildren()
        let heroGuided = GuideUtil.isGuiding
        for (let i = 0; i < heroInfos.length; i++) {
            let heroInfo = heroInfos[i];
            let item = cc.instantiate(this.heroShowItem)
            let ctrl = item.getComponent(UpgradeHeroItem2Ctrl)
            item.parent = this.heroLayout
            ctrl.updateViewInfo(heroInfo)
            // 当前没有引导或没有激活英雄引导，并且英雄有可操作项，则引导点击此英雄
            if (!heroGuided && RedPointUtils.is_can_hero_opration(heroInfo)) {
                heroGuided = true;
                GuideUtil.activeGuide('pvescenefail#hero');
                GuideUtil.bindGuideNode(302, item);
            }
        }
        this.heroLayout.scale = 0.9
        if (heroInfos.length > 6) {
            this.heroLayout.y = -95
        }

        // let bg = this.btnStronger.getChildByName("RedBg")
        // let numLab = this.btnStronger.getChildByName("RedNum").getComponent(cc.Label)
        // let num = 0
        // if (this.isEquipNeedUpgrade()) {
        //     num++
        // }
        // if (this.isByNeedUpgrade()) {
        //     num++
        // }
        // if (num > 0) {
        //     bg.active = true
        //     numLab.node.active = true
        //     numLab.string = `${num}`
        // } else {
        //     bg.active = false
        //     numLab.node.active = false
        // }
    }

    _updateRelicNode() {
        if (this.rmsg instanceof icmsg.RelicFightOverRsp) {
            let m = ModelManager.get(RelicModel);
            let info = m.cityMap[this.rmsg.pointId];
            let hP = Math.max(0, this.rmsg.remainHP);
            let totalHp = m.curAtkPlayerType === 0 ? info.cfg.owner_hp : info.cfg.helper_hp;
            cc.find('pveNode/percentLab', this.relicNode).getComponent(cc.Label).string = `${hP}/${totalHp}`
            cc.find('pveNode/proMask', this.relicNode).width = Math.min(235, hP / totalHp * 235);
            //btn
            // let num = this.relicRetryNode.getChildByName('layout').getChildByName('num').getComponent(cc.Label);
            // num.string = `${m.totalExploreTime - m.exploreTimes}/${m.totalExploreTime}`;
        }
    }

    onRelicRetryBtnClick() {
        //do check
        // let m = ModelManager.get(RelicModel);
        // if (m.totalExploreTime - m.exploreTimes <= 0) {
        //     gdk.gui.showMessage('探索点不足');
        //     this.returnHandle();
        //     return;
        // }

        // if (m.curExploreCity && m.curExploreCity.length > 0) {
        //     gdk.gui.showMessage('同时只能探索一个据点');
        //     this.returnHandle();
        //     return;
        // }

        // if (RedPointUtils.has_relic_reward()) {
        //     gdk.gui.showMessage('请先领取探索奖励再进行新的探索');
        //     this.returnHandle();
        //     return
        // }

        // let cityCfg = ConfigManager.getItemById(Relic_pointCfg, (<icmsg.RelicFightOverRsp>this.rmsg).pointId);
        // if (this.roleModel.power < cityCfg.fight_limit) {
        //     gdk.gui.showMessage('你的战力低于要求50%,无法探索此据点');
        //     this.returnHandle();
        //     return;
        // }

        // let cb = () => {
        //     let mapType = [RelicMapType.PkArea, RelicMapType.SafeArea][ConfigManager.getItemById(Relic_mapCfg, m.mapId).pk];
        //     m.curAtkCity = `${mapType}-${(<icmsg.RelicFightOverRsp>this.rmsg).pointId}`;
        //     this.tryHandle();
        // };

        // let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
        // let atkCd = Math.max(0, cfg.atk_cd * 1000 - (GlobalUtil.getServerTime() - m.lastFightTime * 1000));
        // if (atkCd > 0) {
        //     let isClearCD = GlobalUtil.getLocal('relic_clear_atk_cd', true) || false;
        //     if (!isClearCD) {
        //         gdk.gui.showMessage('进攻CD中,稍后再来');
        //         this.returnHandle();
        //     }
        //     else {
        //         let money = BagUtils.getItemNumById(cfg.atk_cost[0]);
        //         if (money < cfg.atk_cost[1]) {
        //             gdk.gui.showMessage(`${BagUtils.getConfigById(cfg.atk_cost[0]).name}不足`);
        //         }
        //         else {
        //             let req = new icmsg.RelicFightClearCDReq();
        //             NetManager.send(req, () => {
        //                 if (!cc.isValid(this.node)) return;
        //                 if (!this.node.activeInHierarchy) return;
        //                 cb();
        //             }, this);
        //         }
        //     }
        // }
        // else {
        //     cb();
        // }
    }

    _initListView() {
        if (this.gatherList) {
            return
        }
        this.gatherList = new ListView({
            scrollview: this.gatherScrollView,
            mask: this.gatherScrollView.node,
            content: this.gatherContent,
            item_tpl: this.gatherDetailItem,
            cb_host: this,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    /**据点集结 */
    _updateGatherNode() {
        this._initListView()
        let fhModel = ModelManager.get(FootHoldModel)
        let datas = fhModel.gatherOpponents
        let newHps = (this.rmsg as icmsg.FootholdGatherFightOverRsp).newHPs
        let newDatas = []
        for (let i = 0; i < datas.length; i++) {
            for (let j = 0; j < newHps.length; j++) {
                if (datas[i].id == newHps[j].playerId) {
                    datas[i].hp = newHps[j].value
                    newDatas.push(datas[i])
                    break
                }
            }
        }
        this.gatherList.set_data(newDatas)

        let pointIcon = cc.find("proBg/pointIcon", this.gatherNode)
        let proBar = cc.find("proBg/proBar", this.gatherNode).getComponent(cc.ProgressBar)
        let hpLab = cc.find("proBg/hpLab", this.gatherNode).getComponent(cc.Label)
        let teamLab = cc.find("titleBg/layout/teamLab", this.gatherNode).getComponent(cc.RichText)

        let pos = fhModel.pointDetailInfo.pos
        let pointInfo: FhPointInfo = fhModel.warPoints[`${pos.x}-${pos.y}`]
        if (pointInfo.fhPoint.gather) {
            pointInfo = fhModel.warPoints[`${pointInfo.fhPoint.gather.targetPos.x}-${pointInfo.fhPoint.gather.targetPos.y}`]
        }
        let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", fhModel.curMapData.mapId, { world_level: fhModel.worldLevelIndex, point_type: pointInfo.type, map_type: fhModel.curMapData.mapType })
        if (pointInfo.bonusType == 0) {
            let path = ""
            let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", fhModel.curMapData.mapType, { world_level: fhModel.worldLevelIndex })
            if (FootHoldUtils.getBuffTowerType(pos.x, pos.y) == 1) {
                path = `view/guild/texture/icon/${bonusCfg.resources_skin}`
            } else if (FootHoldUtils.getBuffTowerType(pos.x, pos.y) == 2) {
                path = `view/guild/texture/icon/${bonusCfg.attribute_skin}`
            } else if (FootHoldUtils.getBuffTowerType(pos.x, pos.y) == 3) {
                path = `view/guild/texture/icon/${bonusCfg.attenuation_skin}`
            }
            GlobalUtil.setSpriteIcon(this.node, pointIcon, path)
        } else {
            let path = `view/guild/texture/icon/${pointCfg.resources}`
            GlobalUtil.setSpriteIcon(this.node, pointIcon, path)
        }
        let leftHp = 0
        let totalHp = pointCfg.HP
        for (let i = 0; i < newDatas.length; i++) {
            let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(fhModel.pointDetailInfo.titleExp)
            let isSelf = pointInfo.fhPoint.playerId == newDatas[i].id ? true : false
            let maxHp = 0
            if (isSelf) {
                maxHp += MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p4, targetLv)
            } else {
                maxHp = pointCfg.guard_HP
            }
            leftHp += newDatas[i].hp
            totalHp += maxHp
        }
        proBar.progress = leftHp / totalHp
        hpLab.string = `${(leftHp / totalHp * 100).toFixed(1)}%`
        let guard_forces = ConfigManager.getItemById(Foothold_globalCfg, "guard_forces").value[0]
        let str = `驻守部队(<color=#00ff00>${newDatas.length}/${guard_forces}</color>)`
        teamLab.string = str

        let root = this.gatherNode.parent
        if (root.height < this.gatherNode.height + 100) {
            root.height = this.gatherNode.height + 100
            root.getChildByName("bg").height = root.height
        }
    }

    //皇家竞技场再练习一次
    restartBtnClick() {
        let view = gdk.gui.getCurrentView();
        let model = view.getComponent(PveSceneCtrl).model;
        let rM = ModelManager.get(RoyalModel);
        rM.curFightNum = 0;
        rM.addSkillId = 0;
        let m2 = model.arenaSyncData.mirrorModel;
        //m2.state = PveSceneState.Ready
        model.arenaSyncData.waveTimeOut = 1;
        model.arenaSyncData.bossId = 1;
        model.arenaSyncData.bossTimeOut = -1//ConfigManager.getItemById(Pve_bossbornCfg, 1).interval;
        m2.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
        model.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
    }

    _updateRoyalNextLeveTime() {
        let n = cc.find('Background/label/timeLab', this.royalNextBtn);
        if (n) {
            let lb = n.getComponent(cc.Label);
            let tm = this.time - Date.now();
            if (tm > 0) {
                n.active = true;
                lb.string = `(${Math.ceil(tm / 1000)}s)`;
            } else {
                n.active = false;
                gdk.Timer.clear(this, this._updateRoyalNextLeveTime);
                this.royalNextHandle();
                this.close();
            }
        }
    }
    // 皇家竞技场下一关按钮
    royalNextHandle() {
        let rM = ModelManager.get(RoyalModel);
        rM.curFightNum += 1;
        rM.addSkillId = 0;
        let view = gdk.gui.getCurrentView();
        let model = view.getComponent(PveSceneCtrl).model;
        let m2 = model.arenaSyncData.mirrorModel;
        //m2.state = PveSceneState.Ready
        let sceneId = rM.playerData.maps[rM.curFightNum];
        let cfg = ConfigManager.getItemByField(Royal_sceneCfg, 'id', sceneId);
        rM.winElite = {};
        cfg.victory.forEach(data => {
            switch (data[0]) {
                case 1:
                case 2:
                case 3:
                    rM.winElite[data[0]] = data[1];
                    break
                case 4:
                case 5:
                    rM.winElite[data[0]] = true;
                    break;
                case 6:
                    rM.winElite[data[0]] = [data[1], data[2]];
            }
        })
        let nextStageId = cfg.stage_id
        let id = nextStageId;
        model.id = id;
        model.arenaSyncData.waveTimeOut = 1;
        model.arenaSyncData.bossId = 1;
        model.arenaSyncData.bossTimeOut = -1//ConfigManager.getItemById(Pve_bossbornCfg, 1).interval;
        m2.id = id + 1;
        m2.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
        model.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
    }
    // 皇家竞技场退出按钮
    royalReturnHandle() {
        this.returnHandle();
        let rM = ModelManager.get(RoyalModel);
        rM.clearFightData();
    }
}