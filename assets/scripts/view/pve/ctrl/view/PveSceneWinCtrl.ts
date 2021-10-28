import {
    Copyultimate_stageCfg, Copy_stageCfg, Foothold_bonusCfg,
    Foothold_pointCfg,
    GeneralCfg,
    Guardiantower_towerCfg,
    Guardiantower_unlockCfg,
    Headframe_titleCfg,
    Hero_careerCfg,
    Newordeal_ordealCfg,
    OrdealCfg,
    Peak_divisionCfg,
    Pieces_divisionCfg,
    Pve_bossbornCfg,
    Relic_mapCfg,
    Royal_divisionCfg,
    Royal_sceneCfg,
    Teamarena_divisionCfg,
    VaultCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import BagModel, { BagType } from '../../../../common/models/BagModel';
import CopyModel from '../../../../common/models/CopyModel';
import PiecesModel from '../../../../common/models/PiecesModel';
import RoleModel from '../../../../common/models/RoleModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import BagUtils from '../../../../common/utils/BagUtils';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import ScrollNumberCtrl from '../../../../common/widgets/ScrollNumberCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import ButtonSoundId from '../../../../configs/ids/ButtonSoundId';
import PanelId from '../../../../configs/ids/PanelId';
import GuideModel from '../../../../guide/model/GuideModel';
import ActivityModel from '../../../act/model/ActivityModel';
import GuardianTowerModel from '../../../act/model/GuardianTowerModel';
import PeakModel from '../../../act/model/PeakModel';
import ActUtil from '../../../act/util/ActUtil';
import AdventureModel from '../../../adventure/model/AdventureModel';
import NewAdventureModel from '../../../adventure2/model/NewAdventureModel';
import { getArenaInfoByiD } from '../../../arena/utils/ArenaUtil';
import ChampionModel from '../../../champion/model/ChampionModel';
import ExpeditionModel from '../../../guild/ctrl/expedition/ExpeditionModel';
import ExpeditionUtils from '../../../guild/ctrl/expedition/ExpeditionUtils';
import FootHoldModel, { FhPointInfo } from '../../../guild/ctrl/footHold/FootHoldModel';
import FootHoldUtils from '../../../guild/ctrl/footHold/FootHoldUtils';
import { FhTeacheGuideType } from '../../../guild/ctrl/footHold/teaching/FootHoldTeachingCtrl';
import MilitaryRankUtils from '../../../guild/ctrl/militaryRank/MilitaryRankUtils';
import { MRPrivilegeType } from '../../../guild/ctrl/militaryRank/MilitaryRankViewCtrl';
import SiegeModel from '../../../guild/ctrl/siege/SiegeModel';
import GuildModel from '../../../guild/model/GuildModel';
import DoomsDayModel from '../../../instance/model/DoomsDayModel';
import InstanceModel from '../../../instance/model/InstanceModel';
import TrialInfo from '../../../instance/trial/model/TrialInfo';
import HeroGetCtrl from '../../../lottery/ctrl/HeroGetCtrl';
import LotteryModel from '../../../lottery/model/LotteryModel';
import RelicModel from '../../../relic/model/RelicModel';
import RoleHeroItemCtrl2 from '../../../role/ctrl2/selector/RoleHeroItemCtrl2';
import VaultModel from '../../../vault/model/VaultModel';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveGeneralModel from '../../model/PveGeneralModel';
import PveSceneCtrl from '../PveSceneCtrl';
import { Copysurvival_stageCfg } from './../../../../a/config';
import { CopyType } from './../../../../common/models/CopyModel';
import DamageStatisticeCtrl from './DamageStatisticeCtrl';
import PveChapterProgressCtrl from './PveChapterProgressCtrl';

/**
 * Pve胜利界面控制类
 * @Author: sthoo.huang
 * @Date: 2019-06-14 17:38:03
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-22 15:36:08
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveSceneWinCtrl")
export default class PveSceneWinCtrl extends gdk.BasePanel {

    @property(cc.Button)
    returnBtn: cc.Button = null;

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Button)
    nextBtn: cc.Button = null;

    @property(cc.Button)
    statisticeBtn: cc.Button = null;

    // @property(cc.Animation)
    // shengliAnim: cc.Animation = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    LvLabel: cc.Label = null;
    @property(cc.Label)
    moneyLabel: cc.Label = null;
    @property(cc.Label)
    expNumLabel: cc.Label = null;
    @property(cc.Label)
    heroExpLabel: cc.Label = null;

    // @property(cc.Sprite)
    // headSprite: cc.Sprite = null;
    @property(cc.Node)
    lvSprite: cc.Node = null;

    @property(cc.Sprite)
    moneyIcon: cc.Sprite = null;
    @property(cc.Sprite)
    expIcon: cc.Sprite = null;
    @property(cc.Sprite)
    heroExpIcon: cc.Sprite = null;
    @property(cc.Label)
    stagePercentLab: cc.Label = null;
    @property(cc.Node)
    stagePercentNode: cc.Node = null;

    @property(cc.Node)
    damageBtnNode: cc.Node = null;

    @property(cc.Node)
    taskProgressNode: cc.Node = null;
    @property(cc.Prefab)
    taskItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    chapterProgressNode: cc.Node = null;

    @property(cc.Node)
    survivalNode: cc.Node = null;

    @property(cc.Node)
    adventureNode: cc.Node = null;

    @property(cc.Node)
    siegeNode: cc.Node = null;

    @property(cc.Node)
    footHoldNode: cc.Node = null;
    @property(cc.Node)
    cupsNode: cc.Node = null;
    @property([cc.Node])
    cups: cc.Node[] = [];
    @property([cc.Node])
    stars: cc.Node[] = [];
    @property(cc.Node)
    starNode: cc.Node = null;
    @property(cc.Node)
    cupsNode1: cc.Node = null;
    @property(cc.Node)
    runeMonsterNode: cc.Node = null;
    @property(cc.Node)
    runeMonsterBg: cc.Node = null;
    @property(cc.Node)
    runeMonsterExp1: cc.Node = null;
    @property(cc.Node)
    runeMonsterExp2: cc.Node = null;
    @property(cc.RichText)
    runeMonsterNum: cc.RichText = null;
    @property(cc.Label)
    runeMonsterJindu: cc.Label = null;

    @property(cc.Node)
    arenaNode: cc.Node = null;


    @property(cc.Node)
    heroTrialHurtNode: cc.Node = null;
    @property(cc.Node)
    heroTrialHurtBg: cc.Node = null;
    @property(cc.Node)
    heroTrialHurtExp1: cc.Node = null;
    @property(cc.Node)
    heroTrialHurtExp2: cc.Node = null;
    @property(cc.Node)
    heroTrialHurtSignet: cc.Node = null;
    @property(cc.Label)
    heroTrialHurtJindu: cc.Label = null;

    @property(ScrollNumberCtrl)
    heroTrialHurtNumLb: ScrollNumberCtrl = null;

    @property(cc.Node)
    heroTrialReStartBtn: cc.Node = null;
    @property(cc.Node)
    heroTrialNextBtn: cc.Node = null;
    @property(cc.Node)
    overTips: cc.Node = null;

    @property(cc.Node)
    heroTriallastMax: cc.Node = null;
    @property(cc.Label)
    heroTriallastMaxLb: cc.Label = null;

    @property(cc.Node)
    layoutBtnNode: cc.Node = null;

    @property(cc.Node)
    relicNode: cc.Node = null;


    //殿堂指挥官
    @property(cc.Node)
    vaultNode: cc.Node = null
    @property(cc.Node)
    hpNode: cc.Node = null
    @property(cc.Node)
    atkNode: cc.Node = null
    @property(cc.Label)
    hpadd: cc.Label = null
    @property(cc.Label)
    atkadd: cc.Label = null
    @property(cc.Sprite)
    vaultHeadFrame: cc.Sprite = null;
    // @property(cc.Node)
    // relicRetryBtn: cc.Node = null;
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


    //护使秘境
    @property(cc.Node)
    guardianTowerNode: cc.Node = null;
    @property(cc.Label)
    guardianTowerRankLb: cc.Label = null;
    @property(cc.Node)
    guardianTowerNextBtn: cc.Node = null;


    //英雄觉醒副本
    @property(cc.Node)
    heroAwakeNode: cc.Node = null;
    @property(cc.Label)
    heroAwakeName: cc.Label = null;
    @property([cc.Node])
    heroAwakeLimitNodes: cc.Node[] = []

    //自走棋
    @property(cc.Node)
    piecesChessNode: cc.Node = null;
    //自走棋无尽模式
    @property(cc.Node)
    piecesEndLessNode: cc.Node = null;
    //团队远征
    @property(cc.Node)
    expeditionNode: cc.Node = null;

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

    btn1Num: number = 0;
    btn2Num: number = 0;

    list: ListView;
    taskList: ListView;
    rewards: icmsg.GoodsInfo[];
    stageId: number;
    copyId: CopyType;
    lvWidth: number;
    isFirst: boolean = false;
    isDungeon: boolean = true;
    isLevelUp: boolean = false;
    starNum: number = 0;
    score: number = 0;
    time: number = 0;
    rmsg: icmsg.DungeonExitRsp |
        icmsg.ArenaFightResultRsp |
        icmsg.SurvivalExitRsp |
        icmsg.FootholdFightOverRsp |
        icmsg.ActivityCaveExitRsp |
        icmsg.BountyFightOverRsp |
        icmsg.DoomsDayExitRsp |
        icmsg.MartialSoulExitRsp |
        icmsg.GuildBossExitRsp |
        icmsg.DungeonHeroExitReq |
        icmsg.DungeonRuneExitRsp |
        icmsg.DungeonOrdealExitRsp |
        icmsg.ChampionFightOverRsp |
        icmsg.RelicFightOverRsp |
        icmsg.VaultFightOverRsp |
        icmsg.RuinExitRsp |
        icmsg.RuinChallengeExitRsp |
        icmsg.NewOrdealExitRsp |
        icmsg.ArenaTeamFightOverRsp |
        icmsg.PeakExitRsp |
        icmsg.ArenaRaidRsp |
        icmsg.FootholdGatherFightOverRsp |
        icmsg.GuardianCopyExitRsp |
        icmsg.GuardianTowerExitRsp |
        icmsg.HeroAwakeExitRsp |
        icmsg.Adventure2ExitRsp |
        icmsg.PiecesExitRsp |
        icmsg.DungeonUltimateExitRsp |
        icmsg.RoyalFightOverRsp
    heroTrialDamage: number = 0;

    get guideModel() { return ModelManager.get(GuideModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    get activityModel() { return ModelManager.get(ActivityModel); }
    get copyModel() { return ModelManager.get(CopyModel); }
    get guildModel() { return ModelManager.get(GuildModel); }
    get doomsDayModel() { return ModelManager.get(DoomsDayModel); }
    onLoad() {
        this.rmsg = this.args[0];
        let rmsg = this.rmsg;
        if (!rmsg) {
            this.returnHandle();
            return;
        }
        this.relicNode.active = false;
        // this.relicRetryBtn.active = false;
        this.runeMonsterNode.active = false;
        this.arenaNode.active = false;
        this.royalNode.active = false;
        this.layoutBtnNode.active = true;
        this.heroTrialHurtNode.active = false;
        this.vaultNode.active = false;
        this.peakNode.active = false;
        this.guardianTowerNode.active = false;
        this.heroAwakeNode.active = false;
        this.statisticeBtn.node.active = true;
        if (rmsg instanceof icmsg.DungeonExitRsp) {
            // 副本结算
            let stageCfg = CopyUtil.getStageConfig(rmsg.stageId);
            this.isDungeon = true;
            this.copyId = stageCfg.copy_id;
            this.rewards = rmsg.rewards;
            this.stageId = rmsg.stageId;
            this.isFirst = rmsg.isFirst;
            this.isLevelUp = rmsg.levelUp;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = true;
            this.cupsNode.active = false;
            if (stageCfg.copy_id == CopyType.RookieCup || stageCfg.copy_id == CopyType.ChallengeCup) {
                this.showCupOrStar(rmsg.cups);
            }
            if (stageCfg.copy_id == CopyType.Trial) {
                //let kfcb_cfg = ConfigManager.getItemById(GlobalCfg, "kfcb_lv_time").value
                let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
                let serverOpenTime = GlobalUtil.getServerOpenTime()
                let endTime = serverOpenTime + 3600 * 24 * 7 - serverTime
                if (endTime > 0) {
                    this.stagePercentNode.active = true
                    this.activityModel.showKfcbIcon = true
                    this.stagePercentLab.string = `${rmsg.percent}`
                    this.activityModel.kfcb_percent7 = rmsg.percent
                }
            }

            //记录神秘者活动关卡的通关id
            if (stageCfg.copy_id == CopyType.Mystery) {
                this.activityModel.mysterypassStageId = stageCfg.id;
            }
            if (stageCfg.copy_id == CopyType.MAIN) {
                this.chapterProgressNode.active = true;
                this.chapterProgressNode.getComponent(PveChapterProgressCtrl).updateView(stageCfg);
            }
            else {
                this.chapterProgressNode.active = false;
            }

        } else if (rmsg instanceof icmsg.ArenaFightResultRsp || rmsg instanceof icmsg.ArenaRaidRsp) {
            // 竞技场
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.rewards = rmsg.awards;
            this.stageId = 0;
            // this.starNum = rmsg.points;
            // this.score = rmsg.score;
            this.isDungeon = true;
            this.copyId = CopyType.NONE;
            this._showArenInfo();
            if (rmsg instanceof icmsg.ArenaRaidRsp) {
                cc.find('root/layout/btnNode/statisticeBtn', this.node).active = false;
            }
            //显示的是当场战斗获得的分数
            // this.score = rmsg.log.addScore
            // let scoreList = ConfigManager.getItemById(GlobalCfg, "arena_win_score").value
            // let pointList = ConfigManager.getItemById(GlobalCfg, "arena_win_points").value
            // this.starNum = pointList[scoreList.indexOf(rmsg.log.addScore)];

        } else if (rmsg instanceof icmsg.ChampionFightOverRsp) {
            // 锦标赛
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.rewards = rmsg.goodsList;
            this.stageId = 0;
            // this.starNum = rmsg.points;
            // this.score = rmsg.score;
            this.isDungeon = true;
            this.copyId = CopyType.NONE;
            this._showArenInfo();

        } else if (rmsg instanceof icmsg.RuinChallengeExitRsp) {
            // 末日废墟PVP
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.rewards = [];
            this.stageId = 0;
            this.isDungeon = true;
            this.copyId = CopyType.NONE;
            this._showArenInfo();
        } else if (rmsg instanceof icmsg.SurvivalExitRsp) {
            // 生存副本
            let copyModel = ModelManager.get(CopyModel);
            let stageCfg: Copysurvival_stageCfg = CopyUtil.getStageConfig(rmsg.stageId) as any;
            this.isDungeon = true;
            this.copyId = stageCfg.copy_id;
            this.rewards = rmsg.rewards;
            this.stageId = rmsg.stageId;
            copyModel.survivalStateMsg.totalRewards = rmsg.totalRewards;
            // this.score = rmsg.score;
            this.chapterProgressNode.active = false;
            this.survivalNode.active = true;

            // 当前通过波次
            let lvlLb = cc.find('level/num', this.survivalNode).getComponent(cc.Label);
            let sort = stageCfg.sort - (rmsg.clear ? 0 : 1);
            lvlLb.string = sort + '';

            // 是否打破记录
            // let cfg = ConfigManager.getItem(Copysurvival_stageCfg, { sort: sort });
            // cc.find('signet', this.survivalNode).active = cfg.id > this.copyModel.survivalStateMsg.maxStageId;
            let signet = cc.find('signet', this.survivalNode);
            signet && (signet.active = false);
        } else if (rmsg instanceof icmsg.FootholdFightOverRsp) {
            // 新据点战
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this._updateFootHoldNode();
            this.copyId = CopyType.FootHold;
            this.rewards = rmsg.list;
            this.stageId = 0;

            FootHoldUtils.commitFhGuide(FhTeacheGuideType.event_1)
        } else if (rmsg instanceof icmsg.ActivityCaveExitRsp) {
            // 矿洞
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.Mine;
            this.rewards = rmsg.rewards;
            this.stageId = 0;
        } else if (rmsg instanceof icmsg.BountyFightOverRsp) {
            // 赏金
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.copyId = CopyType.NONE;
            this.stageId = 0;
            this.rewards = [];
            this.isDungeon = true;
        } else if (rmsg instanceof icmsg.DoomsDayExitRsp) {
            // 末日考验
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            let info: icmsg.DoomsDayInfo = null;
            let cfg = ConfigManager.getItemById(Copy_stageCfg, rmsg.stageId);
            this.doomsDayModel.doomsDayInfos.forEach(data => {
                if (data.subType == cfg.subtype) {
                    info = data;
                }
            })
            if (!info) {
                info = new icmsg.DoomsDayInfo()
                info.num = 0;
                info.stageId = rmsg.stageId;
                info.subType = cfg.subtype;
                this.doomsDayModel.doomsDayInfos.push(info);
            } else {

                info.stageId = rmsg.stageId;
            }
            this.copyId = CopyType.NONE;
            this.isFirst = true;
            this.rewards = rmsg.rewards;
            this.stageId = 0;
        } else if (rmsg instanceof icmsg.HeroAwakeExitRsp) {
            this.heroAwakeNode.active = true;
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.layoutBtnNode.active = false;
            this.copyId = CopyType.HeroAwakening;
            this.rewards = [];
            this.stageId = 0;
            let view = gdk.gui.getCurrentView();
            let sceneModel = view.getComponent(PveSceneCtrl).model;
            let dataList = sceneModel.gateconditionUtil.DataList;
            this.heroAwakeName.string = sceneModel.stageConfig.name
            this.heroAwakeLimitNodes.forEach((node, index) => {
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

            })

        }
        else if (rmsg instanceof icmsg.MartialSoulExitRsp) {
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.copyModel.eternalCopyStageIds = rmsg.stageIds;
            this.copyId = CopyType.NONE;
            this.rewards = rmsg.rewards;
            this.stageId = 0;
        } else if (rmsg instanceof icmsg.GuildBossExitRsp) {
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.GuildBoss;
            this.rewards = rmsg.rewards;
            this.stageId = 0;
        }
        else if (rmsg instanceof icmsg.DungeonHeroExitRsp) {
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            //this.copyModel.eternalCopyStageIds = rmsg.stageIds;
            this.copyId = CopyType.NONE;
            this.rewards = rmsg.rewards;
            this.stageId = 0;
            this.isFirst = true;
        }
        else if (rmsg instanceof icmsg.DungeonOrdealExitRsp || rmsg instanceof icmsg.NewOrdealExitRsp) {
            this.heroTrialHurtNode.active = true;
            this.chapterProgressNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.survivalNode.active = false;
            this.layoutBtnNode.active = false;
            //this.copyModel.eternalCopyStageIds = rmsg.stageIds;
            this.copyId = rmsg instanceof icmsg.DungeonOrdealExitRsp ? CopyType.HeroTrial : CopyType.NewHeroTrial;
            this.rewards = rmsg.clearRewards;
            this.stageId = 0;
            this.isFirst = true;
            this.heroTrialDamage = rmsg.stageDamage;

            let model = ModelManager.get(InstanceModel);
            let temW = this.heroTrialHurtBg.width - 4;
            //显示进度条
            this.heroTrialHurtSignet.active = false;
            let ordealCfg = ConfigManager.getItemByField(OrdealCfg, 'round', rmsg.stageId);
            if (rmsg instanceof icmsg.NewOrdealExitRsp) {
                ordealCfg = ConfigManager.getItemByField(Newordeal_ordealCfg, 'round', rmsg.stageId);
            }
            let oldStageDamage = rmsg instanceof icmsg.DungeonOrdealExitRsp ? model.heroTrialInfo.stageDamages[ordealCfg.quality - 1] : model.newHeroTrialInfo.stageDamages[ordealCfg.quality - 1];

            let view = gdk.gui.getCurrentView();
            //if (view === gdk.panel.get(PanelId.PveScene)) 
            let sceneModel = view.getComponent(PveSceneCtrl).model;
            if (ordealCfg.quality == 5) {
                this.heroTrialHurtJindu.node.parent.active = false
                this.heroTrialHurtBg.active = false;
                this.heroTriallastMax.active = true;
                this.heroTrialHurtSignet.active = oldStageDamage < rmsg.stageDamage
                this.heroTriallastMaxLb.string = Math.max(oldStageDamage, rmsg.stageDamage) + '';

            } else {
                this.heroTrialHurtBg.active = true;
                this.heroTriallastMax.active = false;
                this.heroTrialHurtJindu.node.parent.active = true
                if (oldStageDamage >= rmsg.stageDamage || oldStageDamage == 0) {
                    this.heroTrialHurtExp1.width = 0;
                    this.heroTrialHurtExp2.width = 0;
                    //this.runeMonsterExp2.width = Math.floor(temW * (rmsg.maxMonsterNum / cfg.monsters))
                    let temW2 = Math.floor(temW * (rmsg.stageDamage / sceneModel.stageAllEnemyHpNum))
                    let tween = new cc.Tween();
                    tween.target(this.heroTrialHurtExp2)
                        .to(1, { width: temW2 })
                        .start()
                } else {
                    this.heroTrialHurtExp1.width = 0;
                    this.heroTrialHurtExp2.width = 0;
                    //this.runeMonsterExp1.width = Math.floor(temW * (rmsg.maxMonsterNum / cfg.monsters));
                    //this.runeMonsterExp2.width = Math.floor(temW * ((rmsg.maxMonsterNum - model.runeMonsterAdd) / cfg.monsters))
                    let temW1 = Math.floor(temW * (rmsg.stageDamage / sceneModel.stageAllEnemyHpNum));
                    let temW2 = Math.floor(temW * (oldStageDamage / sceneModel.stageAllEnemyHpNum))
                    let tween1 = new cc.Tween();
                    tween1.target(this.heroTrialHurtExp1)
                        .to(1, { width: temW2 })
                        .to(0.5, { width: temW1 })
                        .call(
                            () => {
                                this.heroTrialHurtSignet.active = true;
                            }
                        )
                        .start()
                    let tween2 = new cc.Tween();
                    tween2.target(this.heroTrialHurtExp2)
                        .to(1, { width: temW2 })
                        .start()
                    //显示提示语
                    // this.runeMonsterNum.string = `<color=#DDBC65>比历史最高多击杀<color=#1cf5a7>${model.runeMonsterAdd}</color>只</color>`;
                    // this.runeMonsterNum.node.parent.x = temW1;//this.runeMonsterExp1.width;

                }
                this.heroTrialHurtJindu.string = Math.min(100, Math.floor((rmsg.stageDamage / sceneModel.stageAllEnemyHpNum) * 100)) + '/'
            }

            this.heroTrialNextBtn.active = true//oldStageDamage <= rmsg.stageDamage
            this.heroTrialReStartBtn.active = oldStageDamage > rmsg.stageDamage
            this.overTips.active = rmsg.stageDamage >= sceneModel.stageAllEnemyHpNum
            this.heroTrialHurtNumLb.scrollTo(rmsg.stageDamage)//GlobalUtil.numberToStr(rmsg.stageDamage, true);
        }
        else if (rmsg instanceof icmsg.DungeonRuneExitRsp) {
            this.runeMonsterNode.active = true;
            this.LvLabel.node.parent.active = false;
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            //this.copyModel.eternalCopyStageIds = rmsg.stageIds;
            this.copyId = CopyType.NONE;
            this.rewards = rmsg.rewards;
            this.stageId = 0;
            let model = ModelManager.get(InstanceModel);
            let temW = this.runeMonsterBg.width - 4;
            let cfg = ConfigManager.getItemById(Copy_stageCfg, rmsg.stageId);
            //显示进度条
            this.runeMonsterNum.node.parent.active = false;
            if (model.runeMonsterAdd == 0) {
                this.runeMonsterExp1.width = 0;
                this.runeMonsterExp2.width = 0;
                //this.runeMonsterExp2.width = Math.floor(temW * (rmsg.maxMonsterNum / cfg.monsters))
                let temW2 = Math.floor(temW * (rmsg.monsterNum / cfg.monsters))
                let tween = new cc.Tween();
                tween.target(this.runeMonsterExp2)
                    .to(1, { width: temW2 })
                    .start()
            } else {
                this.runeMonsterExp1.width = 0;
                this.runeMonsterExp2.width = 0;
                //this.runeMonsterExp1.width = Math.floor(temW * (rmsg.maxMonsterNum / cfg.monsters));
                //this.runeMonsterExp2.width = Math.floor(temW * ((rmsg.maxMonsterNum - model.runeMonsterAdd) / cfg.monsters))
                let temW1 = Math.floor(temW * (rmsg.monsterNum / cfg.monsters));
                let temW2 = Math.floor(temW * ((rmsg.monsterNum - model.runeMonsterAdd) / cfg.monsters))
                let tween1 = new cc.Tween();
                tween1.target(this.runeMonsterExp1)
                    .to(1, { width: temW2 })
                    .to(0.5, { width: temW1 })
                    .call(
                        () => {
                            this.runeMonsterNum.node.parent.active = true;
                        }
                    )
                    .start()
                let tween2 = new cc.Tween();
                tween2.target(this.runeMonsterExp2)
                    .to(1, { width: temW2 })
                    .start()
                //显示提示语
                this.runeMonsterNum.string = StringUtils.format(gdk.i18n.t("i18n:PVE_WIN_VIEW_TIP1"), model.runeMonsterAdd)//`<color=#DDBC65>比历史最高多击杀<color=#1cf5a7>${model.runeMonsterAdd}</color>只</color>`;
                this.runeMonsterNum.node.parent.x = temW1;//this.runeMonsterExp1.width;
            }
            this.runeMonsterJindu.string = Math.min(100, Math.floor((rmsg.monsterNum / cfg.monsters) * 100)) + '/'
            if (model.runeInfo) {
                if (cfg.monsters <= rmsg.monsterNum) {
                    model.runeInfo.maxStageId = rmsg.stageId;
                    model.runeInfo.maxMonsterNum = 0;
                    model.runeMonsterNext = true;
                }
                let num = model.runeInfo.availableTimes - 1;
                model.runeInfo.availableTimes = Math.max(0, num);
            }
            //this.isFirst = true;
        } else if (rmsg instanceof icmsg.AdventureExitRsp) {
            //探险
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.Adventure;
            this.rewards = rmsg.list;
            this.stageId = 0;
            this._updateAdventureNode()

            let advModel = ModelManager.get(AdventureModel)
            if (rmsg.list && rmsg.list.length > 0) {
                advModel.isFlyScore = true
                rmsg.list.forEach(element => {
                    if (element.typeId == 23) {
                        advModel.isFlyPassScore = true
                    }
                });
            }
            advModel.isMove = true
        } else if (rmsg instanceof icmsg.Adventure2ExitRsp) {
            //探险
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.NewAdventure;
            this.rewards = rmsg.list;
            this.stageId = 0;
            this._updateAdventureNode2()

            let advModel = ModelManager.get(NewAdventureModel)
            if (rmsg.list && rmsg.list.length > 0) {
                advModel.isFlyScore = true
                rmsg.list.forEach(element => {
                    if (element.typeId == 23) {
                        advModel.isFlyPassScore = true
                    }
                });
            }
            advModel.isMove = true
        } else if (rmsg instanceof icmsg.SiegeExitRsp) {
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            //丧尸攻城
            this.copyId = CopyType.Siege;
            this.rewards = rmsg.rewards;
            this.stageId = 0;

            let siegeModel = ModelManager.get(SiegeModel)
            siegeModel.weekGroup = rmsg.weekGroup
            siegeModel.todayMaxGroup = rmsg.todayMaxGroup
            siegeModel.weekBlood = rmsg.weekBlood
            siegeModel.todayBlood = rmsg.todayBlood
            siegeModel.enterTimes = rmsg.enterTimes

            this._updateSiegeNode()

        } else if (rmsg instanceof icmsg.RelicFightOverRsp) {
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.GuildBoss;
            this.rewards = [];
            this.stageId = 0;
            this._updateRelicNode();
        } else if (rmsg instanceof icmsg.VaultFightOverRsp) {
            let model = ModelManager.get(VaultModel)
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.NONE;
            this.rewards = []//rmsg.rewards;
            this.stageId = 0;
            this.vaultNode.active = true;
            let cfg = ConfigManager.getItemById(VaultCfg, model.curPos + 1)
            GlobalUtil.setSpriteIcon(this.node, this.vaultHeadFrame, "icon/headframe/" + cfg.title[0])
            let frameCfg = ConfigManager.getItemByField(Headframe_titleCfg, 'icon', cfg.title[0])
            let atkState = cc.js.isNumber(frameCfg.atk_p) && frameCfg.atk_p > 0
            let hpState = cc.js.isNumber(frameCfg.hp_p) && frameCfg.hp_p > 0
            this.atkNode.active = atkState
            this.hpNode.active = hpState
            this.atkadd.string = atkState ? '+' + (frameCfg.atk_p / 100).toFixed(1) + '%' : '';
            this.hpadd.string = hpState ? '+' + (frameCfg.hp_p / 100).toFixed(1) + '%' : '';

        } else if (rmsg instanceof icmsg.RuinExitRsp) {
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.EndRuin;
            this.rewards = rmsg.rewards;
            this.stageId = 0;
            //let starNum = rmsg.star //== 1 ? 1 : (rmsg.star == 3 ? 2 : 3)

            let copyModel = ModelManager.get(CopyModel)
            let data = new icmsg.RuinStage();
            data.stageId = rmsg.stageId;
            data.star = rmsg.star
            if (copyModel.endRuinStateData.maxStageId < rmsg.stageId) {
                copyModel.endRuinStateData.maxStageId = rmsg.stageId;
                copyModel.endRuinPlayAnim = true;
            }
            let have = false;
            copyModel.endRuinStateData.stages.forEach(stageData => {
                if (stageData.stageId == data.stageId) {
                    have = true;
                    stageData.star = data.star;
                    copyModel.endRuinStageData['' + data.stageId] = data.star;
                }
            })
            if (!have) {
                copyModel.endRuinStateData.stages.push(data);
                copyModel.endRuinStageData['' + data.stageId] = data.star;
            }
            let num = copyModel.endRuinStateData.times - 1;
            copyModel.endRuinStateData.times = Math.max(0, num);
            if (rmsg.chapter > 0) {
                // let roleData = new icmsg.RoleBrief();
                // let roleModel = ModelManager.get(RoleModel)
                // let tem = new icmsg.RuinChapter()
                // tem.chapter = 
                // copyModel.endRuinStateData.chapters.push(roleData);
            }
            let view = gdk.gui.getCurrentView();
            let sceneModel = view.getComponent(PveSceneCtrl).model;
            let starNum = sceneModel.gateconditionUtil.getGateConditionCupNum()
            this.showCupOrStar(starNum);
            //this._updateRelicNode();
        } else if (rmsg instanceof icmsg.ArenaTeamFightOverRsp) {
            //组队竞技场
            this.arenaTeamNode.active = true
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.layoutBtnNode.active = false;
            this.copyId = CopyType.NONE;
            this.rewards = [];
            this.stageId = 0;
            let roleModel = ModelManager.get(RoleModel)
            let curData: icmsg.ArenaTeamFightResult = null;
            rmsg.results.forEach(data => {
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

        } else if (rmsg instanceof icmsg.RoyalFightOverRsp) {
            this.royalNode.active = true;
            this.layoutBtnNode.active = false;
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.NONE;
            this.rewards = [];
            this.stageId = 0;
            let rModel = ModelManager.get(RoyalModel);
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
            //this.royalScoreLb.string = rmsg.newScore + '';
            // let peakModel = ModelManager.get(PeakModel);
            // peakModel.peakStateInfo.enterTimes = rmsg.enterTimes;


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
            if (winNum >= 2) {
                this.royalReturnBtn.active = true;
                this.royalNextBtn.active = false
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

            if (winNum >= 2) {
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
                this.royalRankInfo.active = winNum >= 2;
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
                //let upHeros = selfData.heroes
                let selfheroDatas = []
                heroIds.forEach((heroId, i) => {
                    if (heroId) {
                        // if (data.soldierId == 0) {
                        //     let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', data.careerId);
                        //     data.soldierId = careerCfg.career_type * 100 + 1
                        // }
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
                //let divisionCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', selfData.div)
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

        } else if (rmsg instanceof icmsg.PeakExitRsp) {
            this.peakNode.active = true;
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.NONE;
            this.rewards = [];
            this.stageId = 0;

            let divisionCfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', rmsg.rank)
            if (divisionCfg) {
                GlobalUtil.setSpriteIcon(this.node, this.peakDivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
                this.peakDivisionName.string = divisionCfg.name;
            }
            let nextCfg = ConfigManager.getItemByField(Peak_divisionCfg, 'lv', divisionCfg.division + 1);
            let nextScore = divisionCfg.point;
            if (nextCfg) {
                nextScore = nextCfg.point;
            }
            this.peakScoreLb.string = rmsg.points + '';
            let peakModel = ModelManager.get(PeakModel);
            peakModel.peakStateInfo.enterTimes = rmsg.enterTimes;

            this.peakCurScoreLb.string = rmsg.points + '/' + nextScore;
            this.peakMaskNode.width = 450 * (Math.min(1, rmsg.points / nextScore))
            this.peakRankLb.string = rmsg.ranking + ''
            this.peakScoreLb.string = rmsg.points + ''
            this.peakRankAdd.string = Math.abs(rmsg.ranking - rmsg.rankingBf) + ''
            this.peakScoreAdd.string = Math.abs(rmsg.addPoints) + ''
            let path3 = (rmsg.ranking < rmsg.rankingBf || rmsg.rankingBf == 0) ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
            this.peakRankSp.node.active = rmsg.ranking != rmsg.rankingBf;
            this.peakRankAdd.node.active = rmsg.ranking != rmsg.rankingBf;
            this.peakScoreSp.node.active = rmsg.addPoints != 0;
            this.peakScoreAdd.node.active = rmsg.addPoints != 0;
            GlobalUtil.setSpriteIcon(this.node, this.peakRankSp, path3);
            let path4 = rmsg.addPoints > 0 ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
            GlobalUtil.setSpriteIcon(this.node, this.peakScoreSp, path4);

            // this.peakScoreAddLb.node.active = peakModel.peakStateInfo.points != rmsg.points
            // let tem = Math.abs(rmsg.points - peakModel.peakStateInfo.points)
            // this.peakScoreAddLb.string = '(+' + tem + ')'

            peakModel.peakStateInfo.points = rmsg.points;
            peakModel.peakStateInfo.rank = rmsg.rank;
            if (rmsg.rank > peakModel.peakStateInfo.maxRank) {
                peakModel.peakStateInfo.maxRank = rmsg.rank;
            }
        } else if (rmsg instanceof icmsg.FootholdGatherFightOverRsp) {
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this._updateFootHoldNode();
            this.copyId = CopyType.NONE;
            this.rewards = rmsg.list;
            this.stageId = 0;
        } else if (rmsg instanceof icmsg.GuardianCopyExitRsp) {
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            //this.copyModel.eternalCopyStageIds = rmsg.stageIds;
            this.copyId = CopyType.Guardian;
            this.rewards = rmsg.rewards;
            this.stageId = rmsg.stageId;
            this.isFirst = true;
        } else if (rmsg instanceof icmsg.GuardianTowerExitRsp) {

            this.guardianTowerNode.active = true;
            this.chapterProgressNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.survivalNode.active = false;
            this.layoutBtnNode.active = false;
            //this.copyModel.eternalCopyStageIds = rmsg.stageIds;
            this.copyId = CopyType.NONE;
            this.rewards = rmsg.rewards;
            this.stageId = 0;
            this.isFirst = true;

            let gtModel = ModelManager.get(GuardianTowerModel);
            gtModel.stateInfo.mineRank = rmsg.rankMine
            this.guardianTowerRankLb.string = gtModel.stateInfo.mineRank + '';
            gtModel.stateInfo.maxStageId = rmsg.stageId;
            this.guardianTowerNextBtn.active = gtModel.nextState == 1;

            //下一关倒计时
            if (gtModel.nextState == 1) {
                let icon = cc.find('Background/label/icon', this.guardianTowerNextBtn);
                this.time = Date.now() + 5000;
                this._updateGuardianTowerNextLeveTime();
                gdk.Timer.loop(500, this, this._updateGuardianTowerNextLeveTime);
                GlobalUtil.setSpriteIcon(this.node, icon, 'view/pve/texture/ui/zb_xiayiguan');
            }
        } else if (this.rmsg instanceof icmsg.PiecesExitRsp) {
            //自走棋
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.rewards = [];
            this.stageId = 0;
            this.isDungeon = true;
            this.copyId = CopyType.NONE;
            this.statisticeBtn.node.active = false;
            this._updatePiecesNode();
        } else if (this.rmsg instanceof icmsg.ExpeditionFightOverRsp) {
            this.chapterProgressNode.active = false;
            this.survivalNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.rewards = this.rmsg.rewards
            this.stageId = 0;
            this.copyId = CopyType.NONE;
            ExpeditionUtils.updatePointInfo(this.rmsg.point)
            this.expeditionNode.active = true
            let epModel = ModelManager.get(ExpeditionModel)
            cc.find("lab", this.expeditionNode).getComponent(cc.Label).string = `远征值+${epModel.curStage.value}`
        } else if (this.rmsg instanceof icmsg.DungeonUltimateExitRsp) {
            this.chapterProgressNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.rewards = this.rmsg.rewards
            this.copyId = CopyType.Ultimate
            this.stageId = 0;
            this.copyModel.ultimateCurStageId = this.rmsg.stageId
            this.copyModel.ultimateMaxStageId = this.rmsg.maxStageId
            this.copyModel.ultimatIsClear = this.rmsg.clear

            this.survivalNode.active = true;
            let stageCfg: Copysurvival_stageCfg = CopyUtil.getStageConfig(this.rmsg.stageId) as any;
            // 当前通过波次
            let lvlLb = cc.find('level/num', this.survivalNode).getComponent(cc.Label);
            let sort = stageCfg.sort
            lvlLb.string = sort + '';
            let signet = cc.find('signet', this.survivalNode);
            signet && (signet.active = false);
        } else if (this.rmsg instanceof icmsg.DungeonSevenDayExitRsp) {
            this.chapterProgressNode.active = false;
            this.LvLabel.node.parent.active = false;
            this.copyId = CopyType.NONE
            this.stageId = 0;
            this.rewards = [];
            this.activityModel.sevenDayWarInfo.stage = this.rmsg.stage
        }

        // 更新奖励
        this.lvWidth = this.lvSprite.width;
        this._updateLevel();
        this._updateGold();
        this._updateTaskProgress();

        // 结算奖励存在英雄，展示获得英雄的效果
        let lotteryModel = ModelManager.get(LotteryModel);
        let list = this.rewards;
        let showGoodsInfo = lotteryModel.showGoodsInfo = {};
        // 转换为id--num格式
        for (let i = 0, n = list.length; i < n; i++) {
            let cfg = BagUtils.getConfigById(list[i].typeId, BagType.HERO);
            if (cfg) {
                if (!showGoodsInfo[list[i].typeId]) {
                    showGoodsInfo[list[i].typeId] = list[i].num;
                } else {
                    showGoodsInfo[list[i].typeId] += list[i].num;
                }
            }
        }
        // 特殊的展示效果
        if (Object.keys(showGoodsInfo).length > 0) {
            this.returnBtn.node.active = false;
            this.nextBtn.node.active = false;
            gdk.panel.open(PanelId.HeroReward, (node: cc.Node) => {
                let comp = node.getComponent(HeroGetCtrl);
                if (comp) {
                    comp.showLotteryResult(false);
                }
                // 更新按钮状态
                this._updateBtns();
            }, this);
        } else {
            // 更新按钮状态
            this._updateBtns();
        }
    }

    onEnable() {

        this.damageBtnNode.active = false;
        this.btn1Num = 0
        this.btn2Num = 0

        let t = this.spine.setAnimation(0, "stand", false)
        if (t) {
            this.spine.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === "stand") {
                    this.spine.timeScale = 1;
                    this.spine.setAnimation(0, "stand2", true)
                }
            })
        }

        // 停止播放战斗音乐
        GlobalUtil.isMusicOn && gdk.music.stop()
        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.fightWin);

        this.content.active = true;
        this.onAnimationComplete();

        // 设置竞技场的icon
        if (!this.isDungeon) {
            let path1 = 'common/texture/js_tubiao04'
            let path2 = 'common/texture/js_tubiao01'
            GlobalUtil.setSpriteIcon(this.node, this.moneyIcon, path1);
            GlobalUtil.setSpriteIcon(this.node, this.expIcon, path2);
        }


    }

    onDisable() {
        this.returnBtn.node.active = false;
        this.nextBtn.node.active = false;
        this.content.active = false;
        this.stagePercentNode.active = false;
        this.runeMonsterNode.active = false;
        gdk.Timer.clearAll(this);

        //碎片合成提示窗口
        if (ModelManager.get(BagModel).heroChips.length > 0) {
            gdk.panel.open(PanelId.MainComposeTip)
        }

        if (this.rmsg instanceof icmsg.RelicFightOverRsp) {
            let m = ModelManager.get(RelicModel);
            let mapType = ConfigManager.getItemById(Relic_mapCfg, m.mapId).mapType;
            m.jumpArgs = `${mapType}-${(<icmsg.RelicFightOverRsp>this.rmsg).pointId}`;
        }
    }

    onDestroy() {
        this.list && this.list.destroy();
        this.list = null;
        this.taskList && this.taskList.destroy();
        this.taskList = null;
        // 结束战斗请求章节的信息 红点提示
        let msg = new icmsg.DungeonChapterListReq();
        NetManager.send(msg);
    }


    showCupOrStar(num: number) {
        this.cupsNode.active = true;
        this.LvLabel.node.parent.active = false;
        if (this.copyId == CopyType.EndRuin) {
            this.starNode.active = true;
            this.cupsNode1.active = false;
            for (let i = 0; i < this.stars.length; i++) {
                this.stars[i].active = i < num//rmsg.cups;
            }
        } else {
            this.starNode.active = false;
            this.cupsNode1.active = true;
            for (let i = 0; i < this.cups.length; i++) {
                this.cups[i].active = i < num//rmsg.cups;
            }
        }

        let max = 0;
        let cur = 0;
        let view = gdk.gui.getCurrentView();
        //if (view === gdk.panel.get(PanelId.PveScene)) 
        let sceneModel = view.getComponent(PveSceneCtrl).model;
        sceneModel.proteges.forEach(protege => {
            max += protege.model.config.hp;
            cur += protege.model.hp;
        })
        let hp1 = this.cupsNode.getChildByName('hp1').getComponent(cc.Label);
        let hp2 = this.cupsNode.getChildByName('hp2').getComponent(cc.Label);
        let spine = this.cupsNode.getChildByName('spine').getComponent(sp.Skeleton);
        let layout = this.cupsNode.getChildByName('layout')
        if (this.copyId == CopyType.EndRuin) {
            hp1.node.active = false;
            //hp2.node.active = false;
            spine.node.active = false;
        } else {
            hp1.node.active = true;
            //hp2.node.active = true;
            spine.node.active = true;
            hp2.string = cur + '/' + max;
            hp1.string = (cur > 0 ? '0'.repeat(cur) : '') + ((cur < max) ? '1'.repeat(max - cur) : '');
            let model = ModelManager.get(PveGeneralModel);
            let skin = model.skin;
            let url: string = StringUtils.format("spine/hero/{0}/0.5/{0}", skin);
            GlobalUtil.setSpineData(this.node, spine, url, true, 'stand_s', true);
        }


        let dataList = sceneModel.gateconditionUtil.DataList;
        let lengthNum = layout.childrenCount
        let lbColorList: cc.Color[] = [cc.color('#37ff28'), cc.color('#ff492b')]
        for (let i = 0; i < lengthNum; i++) {
            let node = layout.getChildByName('lb' + (i + 1))
            if (i < dataList.length) {
                let label = node.getComponent(cc.Label);
                let overNode = node.getChildByName('over');
                let overNode1 = node.getChildByName('over1');
                node.active = true;
                label.string = dataList[i].cfg.des;
                let state = dataList[i].start && dataList[i].state
                overNode.active = state
                overNode1.active = !state
                let temColor: cc.Color = state ? lbColorList[0] : lbColorList[1]
                node.color = temColor;
            } else {
                node.active = false;
            }
        }
    }


    // 更新按钮显示状态
    _updateBtns() {
        if (this.copyId == CopyType.NONE ||
            this.copyId == CopyType.Mastery ||
            this.copyId == CopyType.GOD ||
            this.copyId == CopyType.Sthwar ||
            this.copyId == CopyType.FootHold ||
            this.copyId == CopyType.Mine ||
            this.copyId == CopyType.DoomsDay ||
            this.copyId == CopyType.Eternal ||
            this.copyId == CopyType.GuildBoss ||
            this.copyId == CopyType.Adventure ||
            this.copyId == CopyType.NewAdventure ||
            this.copyId == CopyType.Siege) {
            // 竞技场、专精副本、末日考验、公会据点战
            this.nextBtn.node.active = false;
            this.returnBtn.node.active = true;
        } else {
            // 显示下一关按钮，并倒计时自动点击
            if (this.copyId == CopyType.Trial) {
                // 爬塔副本
                let trial = ModelManager.get(TrialInfo);
                if (!trial || !trial.nextStage ||
                    Math.floor(trial.nextStage.id / 100) != Math.floor(this.stageId / 100)) {
                    // 没有下一关，或者下一关与当前关卡不是同一难度等级
                    this.nextBtn.node.active = false;
                    this.returnBtn.node.active = true;
                    return;
                }
            } else if (this.copyId == CopyType.Elite) {
                // 精英副本，奖杯副本
                let cfg = ConfigManager.getItem(Copy_stageCfg, { pre_condition: this.stageId, copy_id: this.copyId });
                if (!cfg) {
                    // 没有下一关，只显示退出按钮
                    this.nextBtn.node.active = false;
                    this.returnBtn.node.active = true;
                    return;
                }
            } else if (this.copyId == CopyType.Survival) {
                // 生存训练
                let hasNext = this.copyModel.survivalStateMsg.stageId > 0;
                this.nextBtn.node.active = hasNext;
                this.returnBtn.node.active = !hasNext;
                if (!hasNext) {
                    // 没有下一关，只显示退出按钮
                    return;
                }
            }
            let m = this.copyModel;
            let isMain = this.copyId == CopyType.MAIN;
            let icon = cc.find('Background/label/icon', this.nextBtn.node);
            this.nextBtn.node.active = true;

            if ((isMain && CopyUtil.isStageAutoEnterable(m.latelyStageId)) ||
                this.copyId == CopyType.Trial) {
                // 主线副本、无尽的黑暗有下一关时，自动开始下一关战斗
                this.time = Date.now() + 5000;
                this._updateNextLeveTime();
                this.returnBtn.node.active = true;
                gdk.Timer.loop(500, this, this._updateNextLeveTime);
                GlobalUtil.setSpriteIcon(this.node, icon, 'view/pve/texture/ui/zb_xiayiguan');
            } else if (this.copyId == CopyType.Ultimate) {
                this.returnBtn.node.active = true;
                let n = cc.find('Background/label/timeNode', this.nextBtn.node);
                n.active = false;
                let ultimateCfg = ConfigManager.getItemById(Copyultimate_stageCfg, this.copyModel.ultimateCurStageId)
                if (ultimateCfg && ultimateCfg.type_stage == 1) {
                    this.time = Date.now() + 5000;
                    this._updateNextLeveTime();
                    gdk.Timer.loop(500, this, this._updateNextLeveTime);
                    GlobalUtil.setSpriteIcon(this.node, icon, 'view/pve/texture/ui/zb_xiayiguan');
                }
                let type = ActUtil.getActRewardType(130)
                let cfgs = ConfigManager.getItems(Copyultimate_stageCfg)
                let maxType = cfgs[cfgs.length - 1].reward_id
                if (type > maxType) {
                    type = maxType
                }
                let typeCfgs = ConfigManager.getItemsByField(Copyultimate_stageCfg, "reward_id", type)
                let maxStageId = typeCfgs[typeCfgs.length - 1].id
                if (this.copyModel.ultimateCurStageId >= maxStageId) {
                    this.nextBtn.node.active = false
                }
            } else {
                // 强敌来袭或引导等其他关卡
                let n = cc.find('Background/label/timeNode', this.nextBtn.node);
                n.active = false;
                let cfg = ConfigManager.getItemById(Copy_stageCfg, m.latelyStageId);
                GlobalUtil.setSpriteIcon(this.node, icon, `view/pve/texture/ui/${(isMain && cfg.hangup_type == 2) ? 'zb_qiangdilaixi' : 'zb_xiayiguan'}`);
                this.returnBtn.node.active = false;
            }
        }
    }

    /**更新自动开始下一关，倒计时 */
    _updateNextLeveTime() {
        let n = cc.find('Background/label/timeNode', this.nextBtn.node);
        if (n) {
            let lb = n.getChildByName('timeLab').getComponent(cc.Label);
            let tm = this.time - Date.now();
            if (tm > 0) {
                n.active = true;
                lb.string = `(${Math.ceil(tm / 1000)}s)`;
            } else {
                n.active = false;
                gdk.Timer.clear(this, this._updateNextLeveTime);
                this.nextLevelHandle();
                this.close();
            }
        }
    }

    _updateGuardianTowerNextLeveTime() {
        let n = cc.find('Background/label/timeNode', this.guardianTowerNextBtn);
        if (n) {
            let lb = n.getChildByName('timeLab').getComponent(cc.Label);
            let tm = this.time - Date.now();
            if (tm > 0) {
                n.active = true;
                lb.string = `(${Math.ceil(tm / 1000)}s)`;
            } else {
                n.active = false;
                gdk.Timer.clear(this, this._updateGuardianTowerNextLeveTime);
                this.guardianTowerNextHandle();
                //this.close();
            }
        }
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

    /**更新等级,经验信息 */
    _updateLevel() {
        let maxLv = ConfigManager.getItems(GeneralCfg).length;
        this.LvLabel.string = `Lv${this.roleModel.level}`;
        let data = ConfigManager.getItemById(GeneralCfg, this.roleModel.level);
        let maxExp = data ? data.exp : 0
        if (this.roleModel.level >= maxLv) {
            this.lvSprite.width = 0;
        } else {
            let p = this.roleModel.exp / maxExp;
            p = Math.min(p, 1)
            this.lvSprite.width = this.lvWidth * p;
        }
    }

    //显示获得的金币和经验
    _updateGold() {
        this.moneyLabel.string = '0';
        this.expNumLabel.string = '0';
        this.heroExpLabel.string = '0';
        if (this.isDungeon) {
            // for (let i = 0, n = this.rewards.length; i < n; i++) {
            //     let e = this.rewards[i];
            //     if (e.typeId == 1) {
            //         this.expNumLabel.string = '+' + e.num
            //     } else if (e.typeId == 3) {
            //         this.moneyLabel.string = '+' + e.num
            //     } else if (e.typeId == 10) {
            //         this.heroExpLabel.string = '+' + e.num;
            //     }
            // }
        } else {
            this.expNumLabel.string = '+' + this.score;
            this.moneyLabel.string = '+' + this.starNum;

            this.moneyIcon.node.x += 30;
            this.moneyLabel.node.x += 30;
            this.expIcon.node.x += 100;
            this.expNumLabel.node.x += 100;

            this.heroExpIcon.node.active = false;
            this.heroExpLabel.node.active = false;
            //修改图标
        }

        this.moneyLabel.node.active = this.moneyLabel.string != '0';
        this.expNumLabel.node.active = this.expNumLabel.string != '0';
        this.heroExpLabel.node.active = this.heroExpLabel.string != '0';
        this.moneyIcon.node.active = this.moneyLabel.string != '0';
        this.expIcon.node.active = this.expNumLabel.string != '0';
        this.heroExpIcon.node.active = this.heroExpLabel.string != '0';

    }

    /**
     * 更新任务进度显示
     */
    _updateTaskProgress() {
        this.taskProgressNode.active = false;
        // let cfg: Common_tasklistCfg;
        // if (this.stageId != 0) {
        //     // 副本
        //     let stageCfg = CopyUtil.getStageConfig(this.stageId);
        //     let copyId = stageCfg.copy_id;
        //     cfg = ConfigManager.getItemByField(Common_tasklistCfg, 'system_id', copyId);
        // } else if (!this.isDungeon) {
        //     // 竞技场
        //     cfg = ConfigManager.getItemByField(Common_tasklistCfg, 'system_id', ConfigManager.getItemByField(GlobalCfg, 'key', 'arena_id').value[0]);
        // }
        // if (cfg) {
        //     let data = [];
        //     let hasWelfareType: boolean = false;
        //     for (let i = 0; i < cfg.task_id.length; i++) {
        //         if (cfg.task_id[i][0] == TaskSheetType.welfare && JumpUtils.ifSysOpen(2805)) {
        //             hasWelfareType = true;
        //             break;
        //         }
        //     }
        //     cfg.task_id.forEach(item => {  //每个类型任务筛选一条用于显示
        //         let sheetType = item[0];
        //         let taskType = item[1];
        //         //基地未开放 仅支持 1.通关奖励 2.生存秘籍 3.开服福利
        //         if ([TaskSheetType.main, TaskSheetType.grow, TaskSheetType.welfare].indexOf(sheetType) == -1 && !JumpUtils.ifSysOpen(2100)) return;
        //         //开服福利有时效性,需判断是否有效
        //         if (TaskSheetType.welfare == sheetType && !JumpUtils.ifSysOpen(2805)) return;
        //         let list = TaskUtil.getTaskProgressCfg(sheetType, taskType);
        //         for (let i = 0; i < list.length; i++) {
        //             let b = !TaskUtil.getPveTaskProgressIsReadById(sheetType, taskType, list[i].id) && !TaskUtil.getTaskAwardState(list[i].id);
        //             if (b) {
        //                 if (hasWelfareType && sheetType != TaskSheetType.welfare && taskType == 202) {
        //                     //主线结算界面有送88抽的任务类型,其他主线任务类型不显示,但需要记录已被阅读
        //                     let state = TaskUtil.getTaskState(list[i].id, sheetType);
        //                     if (state) {
        //                         TaskUtil.setPveTaskProgressReadStatus(sheetType, list[i].target, list[i].id);
        //                     }
        //                 }
        //                 else {
        //                     data.push({
        //                         sheetType: sheetType,
        //                         cfg: list[i]
        //                     });
        //                 }
        //                 break;
        //             }
        //         }
        //     });
        //     if (data.length == 0 || this.copyId == CopyType.FootHold) {
        //         this.taskProgressNode.active = false;
        //         return;
        //     }
        //     this.taskProgressNode.active = true;
        //     this._initTaskListView(data);
        // }
    }

    _initTaskListView(data: any[]) {
        let scrollView = this.taskProgressNode.getComponent(cc.ScrollView);
        let content = this.taskProgressNode.getChildByName('content');
        let height = 135;
        if (data.length < 2) {
            height = (60 + 5) * data.length - 5;
        }
        scrollView.node.height = height;
        let opt = {
            scrollview: scrollView,
            mask: this.taskProgressNode,
            content: content,
            item_tpl: this.taskItemPrefab,
            gap_y: 5,
            async: false,
            direction: ListViewDir.Vertical,
        };
        this.taskList = new ListView(opt);
        this.taskList.set_data(data);
        scrollView.vertical = data.length > 4;
    }

    onAnimationComplete() {

        if (this.rewards.length == 0) {
            return;
        }
        // 奖励列表
        let list: any[] = [];
        this.rewards = GlobalUtil.sortGoodsInfo(this.rewards);
        for (let i = 0, n = this.rewards.length; i < n; i++) {
            let e = this.rewards[i];
            // if (this.isDungeon) {
            //     // 竞技场类型战斗显示物品，非竞技场则过滤此类物品
            //     if (e.typeId == 1 || e.typeId == 3 || e.typeId == 10) {
            //         continue;
            //     }
            // }
            let extInfo = { itemId: e.typeId, itemNum: e.num };
            let itemId = e.typeId;
            let type = BagUtils.getItemTypeById(itemId);
            let item = {
                series: itemId,
                itemId: itemId,
                itemNum: extInfo.itemNum,
                type: type,
                extInfo: extInfo
            };
            list.push({ index: i, info: item, delayShow: true, effect: true, isFirst: this.isFirst });
        }

        // 奖励物品列表
        // let n = list.length;
        // let temNum: number = n < 5 ? n : (n % 2 == 0 ? n / 2 : (n + 1) / 2);
        // temNum = temNum > 5 ? 5 : temNum;

        let opt = {
            scrollview: this.scroll,
            mask: this.scroll.node,
            content: this.content,
            item_tpl: this.itemPrefab,
            column: 5,
            height: 240,
            gap_x: 15,
            gap_y: 5,
            async: false,
            direction: ListViewDir.Vertical,
        };
        this.list = new ListView(opt);

        if (list.length < 5) {
            //居中显示
            this.scroll.node.x = - (list.length / 2 * 120 + (list.length - 1) / 2 * opt.gap_x);
        }
        else {
            this.scroll.node.x = -332;
        }

        this.content.y = 0;
        if (this.rmsg instanceof icmsg.ArenaFightResultRsp || this.rmsg instanceof icmsg.ArenaRaidRsp) {
            this.scroll.node.y = -55;
        } else if (this.rmsg instanceof icmsg.ChampionFightOverRsp) {
            this.scroll.node.y = -85;
        } else if (this.rmsg instanceof icmsg.RuinExitRsp) {
            this.scroll.node.y = 10;
        }
        else {
            this.scroll.node.y = 66;
        }
        this.list.set_data(list, true);
    }

    // 退出按钮
    returnHandle() {
        if (this.copyModel.cupFightStageId > 0) {
            this._close(false);
            let view = gdk.gui.getCurrentView();
            if (view === gdk.panel.get(PanelId.PveScene)) {
                let panel = view.getComponent(gdk.BasePanel);
                if (panel) {
                    panel.close();
                }
            }
            return
        }
        this._close(false);
    }

    // 下一关按钮
    nextLevelHandle() {
        this._close(!this.isLevelUp || this.copyId != CopyType.MAIN);
    }


    /**
     * 关闭当前界面
     * @param next 是否进入下一关
     */
    _close(next: boolean) {
        let view = gdk.gui.getCurrentView();
        let fsmc = view.getComponent(gdk.fsm.FsmComponent);
        // 针对当前不同的战斗场景，不同的操作
        if (view === gdk.panel.get(PanelId.PveScene)) {
            // 生存副本，打开装备购买界面
            if (next && this.copyId == CopyType.Survival) {
                let msg = this.copyModel.survivalStateMsg;
                let model = view.getComponent(PveSceneCtrl).model;
                model.id = msg.stageId;
                msg.lastBuy = false;
                fsmc.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
                // gdk.panel.open(PanelId.PveSceneEquipBuyPanel,
                //     (node: cc.Node) => {
                //         let triger = gdk.NodeTool.onHide(node);
                //         triger.on(() => {
                //             triger.targetOff(this);
                //             fsmc.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
                //         }, this);
                //     },
                //     this,
                //     {
                //         args: model.generals[0].model,
                //     },
                // );
                return;
            }
            // 其他副本(专精副本)这关闭副本和结算界面
            if (next && this.copyId == CopyType.Elite) {
                // 精英副本
                let temp = CopyUtil.getChapterId(this.stageId);
                gdk.panel.setArgs(PanelId.SubEliteGroupView, temp);
            }
            if (next && this.copyId == CopyType.Trial) {
                let trial = ModelManager.get(TrialInfo);
                let stageId = trial.nextStage.id;
                if (CopyUtil.isStageAutoEnterable(stageId)) {
                    let model = view.getComponent(PveSceneCtrl).model;
                    model.id = stageId;
                    fsmc.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_NEXT);
                    return;
                }
                // 退出到主线准备场景
                gdk.panel.open(PanelId.TowerPanel);
                return;
            }

            if (next && this.copyId == CopyType.Ultimate) {
                let stageId = this.copyModel.ultimateCurStageId
                let curCfg = ConfigManager.getItemById(Copyultimate_stageCfg, stageId)
                let nextCfg = ConfigManager.getItemById(Copyultimate_stageCfg, stageId + 1)
                if (nextCfg && curCfg.reward_id == nextCfg.reward_id) {
                    let model = view.getComponent(PveSceneCtrl).model;
                    model.id = nextCfg.id;
                    if (nextCfg.type_stage == 1) {
                        fsmc.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_NEXT);
                        return;
                    } else if (nextCfg.type_stage == 2) {
                        fsmc.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
                        return;
                    }
                }

                let panel = view.getComponent(gdk.BasePanel);
                if (panel) {
                    panel.close();
                }
                return
            }

            if (this.copyId != CopyType.MAIN) {
                let panel = view.getComponent(gdk.BasePanel);
                if (panel) {
                    panel.close();
                }

                if (this.copyId == CopyType.HeroTrial) {
                    // 关闭当前界面
                    gdk.panel.hide(this.resId);
                    gdk.panel.open(PanelId.ActivityMainView);
                } else if (this.copyId == CopyType.NewHeroTrial) {
                    // 关闭当前界面
                    gdk.panel.hide(this.resId);
                    gdk.panel.open(PanelId.ActivityMainView);
                } else if (this.copyId == CopyType.Mystery) {
                    // 关闭当前界面
                    gdk.panel.hide(this.resId);
                    gdk.panel.open(PanelId.MysteryVisitorActivityMainView);
                } else if (this.rmsg instanceof icmsg.ArenaTeamFightOverRsp
                    || this.rmsg instanceof icmsg.GuardianTowerExitRsp
                    || this.rmsg instanceof icmsg.HeroAwakeExitRsp) {
                    gdk.panel.hide(this.resId);
                }

                //打开自走棋无尽模式
                if (this.rmsg instanceof icmsg.PiecesExitRsp) {
                    gdk.panel.setArgs(PanelId.PiecesMain, this.rmsg.type - 1);
                    gdk.panel.open(PanelId.PiecesMain);
                }
                return;
            }
            if (next) {
                // 根据配置判断是否为自动进入下一关
                let stageId = this.copyModel.latelyStageId;
                if (CopyUtil.isStageAutoEnterable(stageId)) {
                    let model = view.getComponent(PveSceneCtrl).model;
                    model.id = stageId;
                    fsmc.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_NEXT);
                    return;
                } else {
                    // 显示强敌来袭特效
                    let cfg = ConfigManager.getItemById(Copy_stageCfg, stageId);
                    if (cfg.hangup_type == 2) {
                        gdk.panel.open(PanelId.PveBossCommingEffect);
                        // 添加一条引导，阻止后续引导执行，直到特效界面显示完成
                        if (!GuideUtil.isGuiding) {
                            GuideUtil.clearGuide(true);
                        }
                    }
                }
            }
            // 退出到主线准备场景
            gdk.panel.open(PanelId.PveReady);

        }
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
    //打开统计UI
    openDamgeStatistice() {
        gdk.panel.open(PanelId.DamageStatisticeView, (node: cc.Node) => {
            let ctrl = node.getComponent(DamageStatisticeCtrl);
            let type = "PVE";
            let view = gdk.gui.getCurrentView();
            if (view === gdk.panel.get(PanelId.PvpScene)) {
                type = "PVP"
            }
            ctrl.initDamageStatisticeData(type, [true]);
        })
    }

    _updateFootHoldNode() {

        let footHoldModel = ModelManager.get(FootHoldModel)
        this.footHoldNode.active = true
        if (footHoldModel.isPvp == false) {
            let pveNode = this.footHoldNode.getChildByName("pveNode")
            pveNode.active = true
            let percentLab = pveNode.getChildByName("percentLab").getComponent(cc.Label)
            let mask = pveNode.getChildByName("proMask")
            let proBar = mask.getChildByName("proBar")

            let leftHp = footHoldModel.pointDetailInfo.bossHp - footHoldModel.curBossHurt
            let realHp = footHoldModel.curBossHp - leftHp < 0 ? footHoldModel.curBossHp : footHoldModel.curBossHp - leftHp
            percentLab.string = `${(realHp / footHoldModel.curBossHp * 100).toFixed(1)}%`
            mask.width = realHp / footHoldModel.curBossHp * proBar.width

            let pointInfo: FhPointInfo = footHoldModel.warPoints[`${footHoldModel.pointDetailInfo.pos.x}-${footHoldModel.pointDetailInfo.pos.y}`]
            if (pointInfo.bonusType == 0) {
                FootHoldUtils.commitFhGuide(FhTeacheGuideType.event_5)
            }

        } else {
            let pvpNode = this.footHoldNode.getChildByName("pvpNode")
            pvpNode.active = true
            let winState = pvpNode.getChildByName("winState")
            let failState = pvpNode.getChildByName("failState")
            let pointInfo: FhPointInfo = footHoldModel.warPoints[`${footHoldModel.pointDetailInfo.pos.x}-${footHoldModel.pointDetailInfo.pos.y}`]
            if (footHoldModel.isPvpWin) {
                winState.active = true
                if (pointInfo.bonusType == 0) {
                    FootHoldUtils.commitFhGuide(FhTeacheGuideType.event_5)
                }
            } else {
                let fhPoint = FootHoldUtils.findFootHold(footHoldModel.pointDetailInfo.pos.x, footHoldModel.pointDetailInfo.pos.y)
                let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", footHoldModel.curMapData.mapId, { world_level: footHoldModel.worldLevelIndex, point_type: pointInfo.type, map_type: footHoldModel.curMapData.mapType })
                let leftHP = footHoldModel.pointDetailInfo.bossHp - footHoldModel.pvpPlayerDmg > 0 ? footHoldModel.pointDetailInfo.bossHp - footHoldModel.pvpPlayerDmg : 0
                let hp = pointCfg.HP - footHoldModel.pvpPlayerDmg > 0 ? leftHP : 0
                if (hp == 0) {
                    winState.active = true
                    if (pointInfo.bonusType == 0) {
                        FootHoldUtils.commitFhGuide(FhTeacheGuideType.event_5)
                    }
                } else {
                    failState.active = true
                    let pointIcon = failState.getChildByName("pointIcon")
                    let leftLab = cc.find("hp/hpNode/leftLab", failState).getComponent(cc.Label)
                    let proBar = cc.find("hp/progress", failState).getComponent(cc.ProgressBar)
                    let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(footHoldModel.pointDetailInfo.titleExp)
                    let maxHp = pointCfg.HP + MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p4, targetLv)
                    leftLab.string = `${hp}/${maxHp}`
                    proBar.progress = hp / maxHp
                    if (pointInfo.bonusType == 0) {
                        let path = ""
                        let tipId = 44
                        let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", footHoldModel.curMapData.mapType, { world_level: footHoldModel.worldLevelIndex })
                        if (FootHoldUtils.getBuffTowerType(pointInfo.pos.x, pointInfo.pos.y) == 1) {
                            path = `view/guild/texture/icon/${bonusCfg.resources_skin}`
                            tipId = 44
                        } else if (FootHoldUtils.getBuffTowerType(pointInfo.pos.x, pointInfo.pos.y) == 2) {
                            path = `view/guild/texture/icon/${bonusCfg.attribute_skin}`
                            tipId = 40
                        } else if (FootHoldUtils.getBuffTowerType(pointInfo.pos.x, pointInfo.pos.y) == 3) {
                            path = `view/guild/texture/icon/${bonusCfg.attenuation_skin}`
                            tipId = 41
                        }
                        GlobalUtil.setSpriteIcon(this.node, pointIcon, path)
                    } else {
                        let path = `view/guild/texture/icon/${pointCfg.resources}`
                        GlobalUtil.setSpriteIcon(this.node, pointIcon, path)
                    }
                }
            }
        }
    }

    _updateAdventureNode() {
        this.adventureNode.active = true
        let view = gdk.gui.getCurrentView();
        let model = view.getComponent(PveSceneCtrl).model;
        let hpLab = cc.find('layout/hpLab', this.adventureNode).getComponent(cc.Label)
        hpLab.node.parent.active = true;
        hpLab.string = `${'0'.repeat(model.proteges[0].model.hp)}`

        let advModel = ModelManager.get(AdventureModel)
        if (advModel.difficulty == 4) {
            let difficultyNode = cc.find("difficultNode", this.adventureNode)
            difficultyNode.active = true
            let waveLab = cc.find('layout/waveLab', difficultyNode).getComponent(cc.Label)
            let rankLab = cc.find('rankLab', difficultyNode).getComponent(cc.Label)
            let arrow = cc.find('arrow', difficultyNode)
            waveLab.string = `${model.realWave}`
            rankLab.string = `${advModel.rankAfter}`
            if (advModel.rankAfter > advModel.rankBefore) {
                arrow.active = true
            }
        }
    }
    _updateAdventureNode2() {
        this.adventureNode.active = true
        let view = gdk.gui.getCurrentView();
        let model = view.getComponent(PveSceneCtrl).model;
        let hpLab = cc.find('layout/hpLab', this.adventureNode).getComponent(cc.Label)
        hpLab.node.parent.active = false;
        hpLab.string = `${'0'.repeat(model.proteges[0].model.hp)}`

        let advModel = ModelManager.get(NewAdventureModel)
        if (advModel.copyType == 1) {
            let difficultyNode = cc.find("difficultNode", this.adventureNode)
            difficultyNode.active = true
            let waveLab = cc.find('layout/waveLab', difficultyNode).getComponent(cc.Label)
            let rankLab = cc.find('rankLab', difficultyNode).getComponent(cc.Label)
            let arrow = cc.find('arrow', difficultyNode)
            waveLab.string = `${model.realWave}`
            rankLab.string = `${advModel.rankAfter}`
            if (advModel.rankAfter > advModel.rankBefore) {
                arrow.active = true
            }
        }
    }

    _updateSiegeNode() {
        this.siegeNode.active = true
        let value1 = cc.find('value1', this.siegeNode).getComponent(cc.Label)
        let value2 = cc.find('value2', this.siegeNode).getComponent(cc.Label)
        let value3 = cc.find('value3', this.siegeNode).getComponent(cc.Label)
        let siegeModel = ModelManager.get(SiegeModel)
        value1.string = `${siegeModel.curWave}`
        value2.string = `${siegeModel.curKillNum}`
        value3.string = `${siegeModel.curDmg}`
    }

    _showArenInfo() {
        if (this.rmsg instanceof icmsg.ArenaFightResultRsp || this.rmsg instanceof icmsg.ArenaRaidRsp) {
            this.arenaNode.active = true;
            let log = this.rmsg.log;
            let opponentScore = getArenaInfoByiD(log.opponentId) ? getArenaInfoByiD(log.opponentId).score : 0;

            let myScore = this.rmsg.score
            let myAdd = log.addScore
            let playerScore = opponentScore < 300 ? opponentScore : opponentScore - log.addScore
            let playerPower = log.opponentPower;
            let playerAdd = opponentScore < 300 ? 0 : -log.addScore;
            let infos = [
                {
                    frame: this.roleModel.frame,
                    head: this.roleModel.head,
                    name: this.roleModel.name,
                    power: this.roleModel.power,
                    score: myScore,
                    change: myAdd,
                },
                {
                    frame: log.opponentFrame,
                    head: log.opponentHead,
                    name: log.opponentName,
                    power: playerPower,
                    score: playerScore,
                    change: playerAdd,
                }
            ];
            [this.arenaNode.getChildByName('winner'), this.arenaNode.getChildByName('loser')].forEach((node, idx) => {
                let info = infos[idx];
                GlobalUtil.setSpriteIcon(this.node, node.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(info.frame));
                GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', node), GlobalUtil.getHeadIconById(info.head));
                cc.find('layout/name', node).getComponent(cc.Label).string = info.name;
                node.getChildByName('power').getComponent(cc.Label).string = info.power + '';
                node.getChildByName('score').getComponent(cc.Label).string = info.score + '';
                node.getChildByName('rank').getComponent(cc.Label).string = info.change + '';
                let jifenIcon = node.getChildByName('icon_jifen');
                jifenIcon.width = 28
                jifenIcon.height = 32
                let path = 'common/texture/arena/icon_jifen'
                GlobalUtil.setSpriteIcon(this.node, jifenIcon, path)
            });
        } else if (this.rmsg instanceof icmsg.ChampionFightOverRsp) {
            this.arenaNode.active = true;
            let championModel = ModelManager.get(ChampionModel)
            championModel.infoData.points = this.rmsg.newPoints1
            championModel.isUpDivision = this.rmsg.newRankLv1 > championModel.infoData.level
            championModel.infoData.level = this.rmsg.newRankLv1;
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
            let infos = [
                {
                    frame: this.roleModel.frame,
                    head: this.roleModel.head,
                    name: this.roleModel.name,
                    power: this.roleModel.power,
                    score: myScore,
                    change: myAdd,
                },
                {
                    frame: palyerBrief.headFrame,
                    head: palyerBrief.head,
                    name: palyerBrief.name,
                    power: playerPower,
                    score: playerScore,
                    change: playerAdd,
                }
            ];
            [this.arenaNode.getChildByName('winner'), this.arenaNode.getChildByName('loser')].forEach((node, idx) => {
                let info = infos[idx];
                GlobalUtil.setSpriteIcon(this.node, node.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(info.frame));
                GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', node), GlobalUtil.getHeadIconById(info.head));
                cc.find('layout/name', node).getComponent(cc.Label).string = info.name;
                node.getChildByName('power').getComponent(cc.Label).string = info.power + '';
                node.getChildByName('score').getComponent(cc.Label).string = info.score + '';
                node.getChildByName('rank').getComponent(cc.Label).string = info.change + '';

                let jifenIcon = node.getChildByName('icon_jifen');
                jifenIcon.width = 32
                jifenIcon.height = 29
                let path = 'common/texture/pve/fb_bei'
                GlobalUtil.setSpriteIcon(this.node, jifenIcon, path)
            });
        }
        else {
            this.arenaNode.active = false;
        }
    }

    // 英雄试炼重新挑战按钮
    heroTrialReturnHandle() {
        // if (this.copyModel.cupFightStageId > 0) {
        //     this._close(false);
        //     let view = gdk.gui.getCurrentView();
        //     if (view === gdk.panel.get(PanelId.PveScene)) {
        //         let panel = view.getComponent(gdk.BasePanel);
        //         if (panel) {
        //             panel.close();
        //         }
        //     }
        //     return
        // }
        // this._close(false);
        let view = gdk.gui.getCurrentView();
        let fsmc = view.getComponent(gdk.fsm.FsmComponent);
        let model = view.getComponent(PveSceneCtrl).model;
        model.id = model.stageConfig.id;
        fsmc.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_NEXT);
    }

    // 英雄试炼保存记录按钮
    heroTrialNextLevelHandle() {
        this.returnHandle();

    }


    // 护使秘境下一关按钮
    guardianTowerNextHandle() {

        let view = gdk.gui.getCurrentView();
        //let fsmc = view.getComponent(gdk.fsm.FsmComponent);
        let model = view.getComponent(PveSceneCtrl).model;
        let gtModel = ModelManager.get(GuardianTowerModel);
        if (gtModel.nextState == 1) {
            let cfg = ConfigManager.getItem(Guardiantower_towerCfg, (cfg: Guardiantower_towerCfg) => {
                if (cfg.id == gtModel.curCfg.id + 1) {
                    return true;
                }
            })

            let nextCfg = ConfigManager.getItem(Guardiantower_towerCfg, (cfg: Guardiantower_towerCfg) => {
                if (cfg.id == gtModel.curCfg.id + 2) {
                    return true;
                }
            })
            if (nextCfg) {
                let index = nextCfg.id % 100;

                let temNuLockCfg = ConfigManager.getItem(Guardiantower_unlockCfg, (cfg: Guardiantower_unlockCfg) => {
                    if (index >= cfg.copy_section[0] && index <= cfg.copy_section[1]) {
                        return true;
                    }
                })
                if (gtModel.curDay >= temNuLockCfg.unlocktime[2] + 1) {
                    gtModel.nextState = 1
                } else {
                    gtModel.nextState = 2
                }
            } else {
                gtModel.nextState = 0
            }

            let mainModel = model.arenaSyncData.mainModel

            let shared = mainModel.arenaSyncData;
            let arenaPlayer = <icmsg.ArenaPlayer>shared.args[2];
            arenaPlayer.name = cfg.enemy_name
            arenaPlayer.head = cfg.show[0]
            arenaPlayer.power = cfg.power;

            gtModel.curCfg = cfg
            model.id = model.stageConfig.id;
            model.arenaSyncData.waveTimeOut = 1;
            let tem = gtModel.curCfg.copy_id[0].split(',')
            model.arenaSyncData.bossId = parseInt(tem[1]);
            model.arenaSyncData.bossTimeOut = ConfigManager.getItemById(Pve_bossbornCfg, model.arenaSyncData.bossId).interval;
            model.arenaSyncData.mirrorModel.arenaDefenderHeroList = []
            model.arenaSyncData.mirrorModel.arenaDefenderGeneral = null;
            model.refreshArenaInfo = true;
            model.arenaSyncData.mirrorModel.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
            mainModel.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_NEXT);
            //this._close(false);
        }
    }
    // 护使秘境退出按钮
    guardianTowerReturnHandle() {
        this.returnHandle();
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

    _updateRelicNode() {
        if (this.rmsg instanceof icmsg.RelicFightOverRsp) {
            this.relicNode.active = true;
            let lab = this.relicNode.getChildByName('label').getComponent(cc.RichText);
            if (this.rmsg.canExplore) {
                lab.string = `<color=#FFFF95><outline color=#000000 width=2>恭喜你抢到</outline></c><color=#fff205><outline color=#0e0807 width=2>${ModelManager.get(RelicModel).cityMap[this.rmsg.pointId].cfg.des}</outline></c>`;
            }
            else {
                lab.string = '<color=#FFFF95><outline color=#000000 width=2>恭喜你破坏了协防,就差一步了!</outline></c>';
            }
        }
    }

    _updatePiecesNode() {
        if (this.rmsg instanceof icmsg.PiecesExitRsp) {
            let m = ModelManager.get(PiecesModel);
            if (this.rmsg.type == 1) {
                let n1 = this.piecesEndLessNode;
                n1.active = true;
                cc.find('wave/num', n1).getComponent(cc.Label).string = this.rmsg.totalRound + '波';
                cc.find('rank/num', n1).getComponent(cc.Label).string = this.rmsg.afterRank + '';
                if (this.rmsg.afterRank > this.rmsg.beforeRank) {
                    cc.find('rank/upNode', n1).active = true;
                    cc.find('rank/upNode/num', n1).getComponent(cc.Label).string = `${this.rmsg.afterRank - this.rmsg.beforeRank}`;
                }
                else {
                    cc.find('rank/upNode', n1).active = false;
                }
            }
            else {
                let n = this.piecesChessNode;
                n.active = true;
                let curC = m.divisionCfg;
                let nextC = ConfigManager.getItemByField(Pieces_divisionCfg, 'division', curC.division + 1, { type: curC.type });
                GlobalUtil.setSpriteIcon(this.node, cc.find('rankIcon', n), `common/texture/pieces/${curC.icon}`);
                cc.find('rankTitle', n).getComponent(cc.Label).string = curC.name;
                cc.find('progress/num', n).getComponent(cc.Label).string = `${m.score}/${nextC ? nextC.point : 99999}`;
                cc.find('progress/bar', n).width = nextC ? 506 * (m.score / nextC.point) : 506;
                cc.find('wave/num', n).getComponent(cc.Label).string = this.rmsg.totalRound + '波';
                cc.find('rank/num', n).getComponent(cc.Label).string = '+' + m.addScore;
                let addTalent = this.rmsg.talentPoint - m.talentPoint;
                if (addTalent > 0) {
                    cc.find('talent/num', n).active = true;
                    cc.find('talent/num', n).getComponent(cc.Label).string = '+' + addTalent;
                }
                else {
                    cc.find('talent/num', n).active = false;
                }
            }
        }
    }


    //
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

}