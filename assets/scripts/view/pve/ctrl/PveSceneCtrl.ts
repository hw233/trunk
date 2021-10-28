import AdventureModel from '../../adventure/model/AdventureModel';
import ArenaHonorModel from '../../../common/models/ArenaHonorModel';
import ArenaTeamViewModel from '../../arenaTeam/model/ArenaTeamViewModel';
import ChampionModel from '../../champion/model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import ErrorManager from '../../../common/managers/ErrorManager';
import ExpeditionUtils from '../../guild/ctrl/expedition/ExpeditionUtils';
import FightingMath from '../../../common/utils/FightingMath';
import FootHoldModel, { FhPointInfo } from '../../guild/ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuardianTowerModel from '../../act/model/GuardianTowerModel';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import MathUtil from '../../../common/utils/MathUtil';
import MercenaryModel from '../../mercenary/model/MercenaryModel';
import MilitaryRankUtils from '../../guild/ctrl/militaryRank/MilitaryRankUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../../adventure2/model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import PiecesModel from '../../../common/models/PiecesModel';
import PveEventId from '../enum/PveEventId';
import PveFsmEventId from '../enum/PveFsmEventId';
import PvePiecesBotCtrl from './view/pieces/PvePiecesBotCtrl';
import PvePiecesFetterCtrl from './view/pieces/PvePiecesFetterCtrl';
import PvePool from '../utils/PvePool';
import PveSceneModel, { WaveEnemyInfo } from '../model/PveSceneModel';
import PveSceneState from '../enum/PveSceneState';
import PveTool from '../utils/PveTool';
import RelicModel from '../../relic/model/RelicModel';
import RoleModel from '../../../common/models/RoleModel';
import RoyalModel from '../../../common/models/RoyalModel';
import ScrollNumberCtrl from '../../../common/widgets/ScrollNumberCtrl';
import StringUtils from '../../../common/utils/StringUtils';
import WorldHonorModel from '../../../common/models/WorldHonorModel';
import {
    Copy_stageCfg,
    Copy_towerhaloCfg,
    Foothold_pointCfg,
    GlobalCfg,
    HeroCfg,
    MonsterCfg,
    Pieces_divisionCfg,
    SystemCfg
    } from '../../../a/config';
import { CopyType } from './../../../common/models/CopyModel';
import { MRPrivilegeType } from '../../guild/ctrl/militaryRank/MilitaryRankViewCtrl';
import { ParseMainLineId } from '../../instance/utils/InstanceUtil';
import { RoleEventId } from '../../role/enum/RoleEventId';

/**
 * Pve场景控制类
 * @Author: sthoo.huang
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-24 15:41:10
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveSceneCtrl")
export default class PveSceneCtrl extends gdk.BasePanel {

    @property(cc.Node)
    root: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Sprite)
    timeScale: cc.Sprite = null;
    @property(cc.Node)
    map: cc.Node = null;
    @property(cc.Node)
    floor: cc.Node = null;
    @property(cc.Node)
    thing: cc.Node = null;
    @property(cc.Node)
    effect: cc.Node = null;
    @property(cc.Node)
    hurt: cc.Node = null;
    @property(cc.Node)
    buffTip: cc.Node = null;

    @property(cc.Prefab)
    towerPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    protegePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    heroPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    soldierPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    guardPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    generalPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    spawnPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    enemyPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    calledPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    trapPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    gatePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    hurtEffectPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    buffEffectPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    buffStackPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    specialStackPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    bubblePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    hpBarPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    bossHpBarPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    spineNodePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    skillPrefabs: cc.Prefab[] = [];

    @property(cc.Prefab)
    roadMovePrefab: cc.Prefab = null;

    @property(ScrollNumberCtrl)
    num: ScrollNumberCtrl = null;
    @property(cc.Node)
    upNode: cc.Node = null;

    @property(cc.Prefab)
    energyItem: cc.Prefab = null;
    @property(cc.Animation)
    energyAnim: cc.Animation = null;

    // 怪物掉落奖励预设
    @property(cc.Prefab)
    enemyDropReward: cc.Prefab = null;

    @property(cc.Prefab)
    skillNameEffect: cc.Prefab = null;
    @property(cc.Prefab)
    manualSkillNamePrefabs: cc.Prefab = null;
    @property(cc.Prefab)
    continueSkillTips: cc.Prefab = null;
    @property(cc.Label)
    gameTime: cc.Label = null;

    @property(cc.Node)
    dropReward: cc.Node = null;
    @property(cc.Label)
    dropGold: cc.Label = null;
    @property(cc.Label)
    dropYing: cc.Label = null;
    @property(cc.Label)
    dropJin: cc.Label = null;

    // 分数
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Node)
    cupsShowNode: cc.Node = null;
    @property(cc.Label)
    protegeHp: cc.Label = null;
    @property(cc.Label)
    wave: cc.Label = null;

    //掉落挂点
    @property(cc.Node)
    dropIconNode: cc.Node = null;
    @property(cc.Node)
    enemyIndicatro: cc.Node = null;

    //暂停时关卡名称
    @property(cc.Label)
    pauseTitle: cc.Label = null;

    //阵营加成
    // @property([cc.Node])
    // groupBg: cc.Node[] = []
    // @property(cc.Prefab)
    // groupNumPre: cc.Prefab = null;
    // @property(cc.Node)
    // groupNumNode: cc.Node = null;
    @property(cc.Node)
    stopSkillNode: cc.Node = null;

    @property(cc.Sprite)
    groupSp1: cc.Sprite = null;
    @property(cc.Sprite)
    groupSp2: cc.Sprite = null;

    //符文副本怪物进度
    @property(cc.Node)
    RuneMonsterMask: cc.Node = null;
    @property(cc.Label)
    RuneMaxNum: cc.Label = null;
    @property(cc.Label)
    RuneCurNum: cc.Label = null;

    @property(cc.Node)
    heroListRed: cc.Node = null;

    @property(cc.Label)
    royalGameTime: cc.Label = null;

    addCfgs: Copy_towerhaloCfg[] = [];
    lastAlive: boolean = false;
    groupBgData: number[][] = [];
    groupBgNames: string[] = [
        'yx_zhengyingsekuai', 'yx_zhengyingsekuai2', 'yx_zhengyingsekuai3',
        'yx_zhengyingsekuai4', 'yx_zhengyingsekuai5', 'yx_zhengyingsekuai6',
    ];

    /** 场景数据 */
    model: PveSceneModel;
    copyModel: CopyModel;
    fsm: gdk.fsm.Fsm;
    quakeAction: cc.Action;
    originalPos: cc.Vec2;
    showTime: number = 0; //刷新战斗进行的时间

    onLoad() {
        let arr = [
            'Pvp', 'PvpGame', 'UI', 'Pvp/ui/fightInfo/txt', 'Pvp/ui/arenaInfo',
            'UI/EnemyIndicatro', 'UI/Weapon', 'UI/cupMonsterList',
            'Pvp/ui/arenaInfo/wave', 'Pvp/ui/arenaInfo/royalGameTime'
        ];
        arr.forEach(n => {
            let node = cc.find(n, this.node);
            if (node) {
                node.active = false;
            }
        });
    }

    onEnable() {
        let model: PveSceneModel = this.model;
        let args = this.args;
        if (args && args.length > 0) {
            if (args[0] instanceof PveSceneModel) {
                model = args[0];
            } else {
                model = this.model;
                if (!model) {
                    model = new PveSceneModel();
                    model.ctrl = this;
                }
                model.id = args[0];
            }
        } else if (!model) {
            model = new PveSceneModel();
            model.ctrl = this;
            // model.id = CopyUtil.getLatelyEnterableStage();
        }
        this.model = model;
        this.onEnableAfter();
        gdk.e.on(PveEventId.PVE_SURVIVAL_EQUIOBUR, this.refreshSurvivalEquitBtn, this);
        gdk.e.on(RoleEventId.SHOW_UPHERO_INFO, this.refreshSurvivalHeroListRed, this);
        // 微信小游戏主动触发回收
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            const wx = window['wx'];
            wx.triggerGC();
        }
        // 结算错误处理
        ErrorManager.on(5505, () => {
            // 殿堂指挥官当前位置正在被挑战中，直接退出战斗界面
            gdk.gui.showMessage(gdk.i18n.t("i18n:VAULT_TIP1"))
            if (!model.isDemo && !model.isMirror) {
                this.close(-1);
            }
        }, this);
    }

    onEnableAfter() {
        let model = this.model;
        // 震动节点原始坐标
        // let comp = this.root.getComponent(cc.Widget);
        // if (comp) {
        //     comp.top = gdk.gui.guiLayer.y;
        //     comp.bottom = -gdk.gui.guiLayer.y;
        // }
        // this.root.y = -gdk.gui.guiLayer.y;
        this.originalPos = this.root.getPosition();
        // 数据实例
        this.copyModel = ModelManager.get(CopyModel);
        this.fsm = this.node.getComponent(gdk.fsm.FsmComponent).fsm;
        model.ctrl = this;
        model.node = this.node;
        this.schedule(this._updateObjectZOrder, 1 / 12);
        // 非演示非镜像战斗
        if (!model.isDemo && !model.isMirror) {
            // 隐藏所有UI
            let ui = this.node.getChildByName('UI');
            ui.active = true;
            ui.children.forEach(n => {
                if (n.name == 'bg_mask') return;
                gdk.NodeTool.hide(n, false, gdk.HideMode.DISABLE);
            });
            // 阵营变更事件
            gdk.e.on('popup#RoleSetUpHeroSelector#close', () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                if (!this.fsm) return;
                if (!this.model) return;
                if (this.model.state == PveSceneState.Ready) {
                    this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_ONE_KEY_NOTIP);
                    // this.refreshGroupBuffInfo();
                }
            }, this);
            //巅峰之战
            gdk.e.on('popup#PeakSetUpHeroSelector#close', () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                if (!this.fsm) return;
                if (!this.model) return;
                if (this.model.state == PveSceneState.Ready) {
                    this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_ONE_KEY_NOTIP);
                    // this.refreshGroupBuffInfo();
                }
            }, this);
            //英雄觉醒副本
            gdk.e.on('popup#PveHeroAwakeningSetUpHeroSelector#close', () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                if (!this.fsm) return;
                if (!this.model) return;
                if (this.model.state == PveSceneState.Ready) {
                    this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_ONE_KEY_NOTIP);
                    // this.refreshGroupBuffInfo();
                }
            }, this);

            //公会团队远征
            gdk.e.on('popup#ExpeditionFight#close', () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                if (!this.fsm) return;
                if (!this.model) return;
                if (this.model.state == PveSceneState.Ready) {
                    this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_ONE_KEY_NOTIP);
                    // this.refreshGroupBuffInfo();
                }
            }, this);

            // 战力提升箭头
            this.upNode && (this.upNode.active = false);
            // this.refreshGroupBuffInfo();
        }
        // 重新开始fsm
        if (!this.fsm.active) {
            this.fsm.setActive(true);
            this.fsm.start();
        }
    }

    //刷新阵营信息
    refreshGroupBuffInfo() {
        let model = this.model;
        if (model.isDemo || model.isMirror) {
            return
        }

        if (!JumpUtils.ifSysOpen(2853)) {
            let path1 = 'common/texture/role/select/yx_zhenying_1';
            GlobalUtil.setSpriteIcon(this.node, this.groupSp1, path1);
            this.groupSp2.node.active = false;
            return;
        }


        if (model.isDemo || !model.stageConfig) {
            // 演示模式时，无需刷新阵营
            return;
        }
        let a = {};
        this.addCfgs = [];
        this.lastAlive = false;
        this.groupBgData = [];
        // let heroModel = ModelManager.get(HeroModel);
        // let selectHeros = heroModel.PveUpHeroList;
        let selectHeroItemIds = [];
        let stageCfg = model.stageConfig;
        if (stageCfg.copy_id == CopyType.Survival && stageCfg.subtype == 1) {
            let copyModel = ModelManager.get(CopyModel);
            let mercenaryModel = ModelManager.get(MercenaryModel);
            let List1 = mercenaryModel.borrowedListHero;
            copyModel.survivalStateMsg.heroes.forEach(data => {
                if (data.typeId == 0) {
                    let heroInfo = HeroUtils.getHeroInfoByHeroId(data.heroId);
                    if (heroInfo) {
                        selectHeroItemIds.push(heroInfo.typeId);
                    }
                } else {
                    let temData = List1[data.heroId - 1];
                    if (temData) {
                        selectHeroItemIds.push(temData.brief.typeId);
                    }
                }
            })
        } else {
            model.towers.forEach(t => {
                selectHeroItemIds[t.id - 1] = t.hero ? t.hero.model.item.itemId : -1;
            });
            // heroModel.heroInfos.forEach(info => {
            //     let index = selectHeros.indexOf(info.series)
            //     if (index >= 0) {
            //         selectHeroItemIds[index] = info.itemId;
            //     }
            // })
        }

        selectHeroItemIds.forEach(id => {
            if (id > 0) {
                let cfg = ConfigManager.getItemById(HeroCfg, id);
                if (cfg) {
                    if (!a[cfg.group[0]]) {
                        a[cfg.group[0]] = 1;
                    } else {
                        a[cfg.group[0]] += 1;
                    }
                }
            }
        })
        let addNum = 0;
        let maxType = 0;
        let maxNum = 0;
        let big4Type: number[] = [];
        let addCfgs: Copy_towerhaloCfg[] = [];
        for (let i = 1; i <= 6; i++) {
            if (a[i] == null && i < 6) continue;
            if (i == 1 || i == 2) {
                addNum += a[i];
            } else {
                if (a[i] > maxNum) {
                    maxNum = a[i];
                    maxType = i;
                }
            }
            if (a[i] >= 4) {
                big4Type.push(i);
            }
            if (i == 6 && (maxNum + addNum > 2)) {
                let temNum = Math.min(6, maxNum + addNum);
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.only == 1 && cfg.num == temNum) {
                        return true;
                    }
                    return false;
                })
                if (cfg) {
                    addCfgs.push(cfg);
                }
            }
        }
        if (big4Type.length > 0) {
            big4Type.forEach(type => {
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.group.indexOf(type) >= 0 && a[type] == cfg.num) {
                        return true
                    }
                    return false;
                })
                if (cfg) {
                    addCfgs.push(cfg);
                }
            })
        }

        this.addCfgs = addCfgs;

        //设置图片
        let tem1 = 1;
        if (addNum + maxNum >= 2) {
            tem1 = Math.min(6, addNum + maxNum)
        }

        let path1 = 'common/texture/role/select/yx_zhenying_' + tem1;
        GlobalUtil.setSpriteIcon(this.node, this.groupSp1, path1);

        let temMax = 0;
        if (big4Type.length > 0) {
            big4Type.forEach(type => {
                if (a[type] > temMax) {
                    temMax = a[type]
                }
            })
            this.groupSp2.node.active = true;
            let tem2 = Math.min(3, temMax - 3);
            let path2 = 'common/texture/role/select/yx_zhenyingji_' + tem2;
            GlobalUtil.setSpriteIcon(this.node, this.groupSp2, path2);
        } else {
            this.groupSp2.node.active = false;
        }
    }

    onDisable() {
        // 清除动作 
        if (this.quakeAction) {
            let node = this.root || this.thing.parent;
            node.stopAllActions();
            node.setPosition(this.originalPos);
            this.quakeAction = null;
        }
        // 清除事件监听
        ErrorManager.targetOff(this)
        cc.game.targetOff(this);
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
        // 塔防竞技战斗，非镜像实例
        let model = this.model;
        if (!!model && !!model.arenaSyncData && !model.isMirror) {
            let view = cc.find('PvpGame', this.node);
            let node = view.children[0];
            if (!node && !model.isDefender) {
                node.active = false;
            }
            view.active = false;
            cc.find(`Pvp/ui/fightInfo/up/list`, this.node).getComponent(gdk.List).datas = [];
            cc.find(`Pvp/ui/fightInfo/down/list`, this.node).getComponent(gdk.List).datas = [];
            cc.find(`Pvp/ui/fightInfo/up/hp`, this.node).getComponent(cc.Label).string = '';
            cc.find(`Pvp/ui/fightInfo/down/layout/hp`, this.node).getComponent(cc.Label).string = '';
            cc.find(`Pvp/ui/fightInfo/up/name`, this.node).getComponent(cc.Label).string = '';
            cc.find("Pvp/ui/arenaInfo", this.node).active = false;
            cc.find('Pvp', this.node).active = false;
            let pb = cc.find('Pvp/ui/pieces/bot', this.node);
            let pf = cc.find('Pvp/ui/pieces/fetter', this.node);
            pb && pb.getComponent(PvePiecesBotCtrl).clear();
            pf && pf.getComponent(PvePiecesFetterCtrl).clear();
        }
        // 清除地图
        let sprite = this.map.getComponent(cc.Sprite);
        if (sprite) {
            sprite.spriteFrame = null;
        }
        FightingMath.restore();
        PveTool.removeSceneNodes(this, !model.isMirror);
        this.unschedule(this._updateObjectZOrder);

        // 清除数据
        this.model = null;
        this.copyModel = null;
        this.fsm && this.fsm.setActive(false);
        this.fsm = null;
        this.num && this.num.clear();
        // 碰撞管理器
        cc.director.getCollisionManager().enabled = true;

        // 微信小游戏主动触发回收
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            const wx = window['wx'];
            wx.triggerGC();
        }
    }

    onDestroy() {
        // 销毁对象池中的数据
        PvePool.clearAll();
    }

    // 关闭处理
    close(buttonIndex: number = -1) {
        let model = this.model;
        let stageConfig = model.stageConfig;
        if (!model.isDemo &&
            !model.isReplay &&
            !model.isBounty && stageConfig &&
            !model.isMirror &&
            !model.isDefender
        ) {
            // 非演示，非回放，非赏金，且为据点战副本
            switch (model.state) {
                case PveSceneState.Ready:
                case PveSceneState.Pause:
                    if ((stageConfig.copy_id == CopyType.FootHold) ||
                        (stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'FOOTHOLD')
                    ) {
                        // 重置据点状态
                        let msg = new icmsg.FootholdFightOverReq();
                        if (stageConfig.copy_id == CopyType.FootHold) {
                            // 普通据点
                            let fhModle = ModelManager.get(FootHoldModel);
                            msg.warId = fhModle.curMapData.warId;
                            msg.pos = fhModle.pointDetailInfo.pos;
                        } else {
                            // 已被占领的据点
                            msg.warId = model.arenaSyncData.args[0];
                            msg.pos = model.arenaSyncData.args[1];
                        }
                        msg.playerDmg = -1;
                        msg.bossDmg = 0;
                        NetManager.send(msg);
                    }
                    else if ((stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'RELIC')) {
                        let qmsg = new icmsg.RelicFightOverReq();
                        let relicM = ModelManager.get(RelicModel);
                        qmsg.mapType = parseInt(relicM.curAtkCity.split('-')[0]);
                        qmsg.pointId = parseInt(relicM.curAtkCity.split('-')[1]);
                        qmsg.damage = -1;
                        NetManager.send(qmsg, (rmsg: icmsg.RelicFightOverRsp) => {
                            // 结算返回
                        }, this);
                    } else if ((stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'PEAK')) {
                        // let qmsg = new icmsg.PeakExitReq();
                        // let peakModel = ModelManager.get(PeakModel);
                        // qmsg.clear = false
                        // NetManager.send(qmsg, (rmsg: icmsg.PeakExitRsp) => {
                        //     // 结算返回
                        //     peakModel.peakStateInfo.points = rmsg.points;
                        //     peakModel.peakStateInfo.rank = rmsg.rank
                        //     peakModel.peakStateInfo.enterTimes = rmsg.enterTimes;
                        // }, this);
                    } else if (stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
                        let fhModle = ModelManager.get(FootHoldModel);
                        let fightValue: icmsg.FootholdGatherFightValue = new icmsg.FootholdGatherFightValue()
                        let msg = new icmsg.FootholdGatherFightOverReq()
                        msg.index = -1
                        msg.pos = fhModle.pointDetailInfo.pos
                        msg.typ = fhModle.gatherFightType
                        msg.damage = fightValue
                        NetManager.send(msg, () => {
                            fhModle.fightPoint = null
                        }, this)
                    } else if (stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'PIECES_ENDLESS') {
                        let req = new icmsg.PiecesExitReq();
                        req.type = 1;
                        req.fightState = '';
                        NetManager.send(req, null, this);
                        gdk.panel.open(PanelId.PiecesMain);
                    } else if (stageConfig.copy_id == CopyType.Expedition) {
                        let msg = new icmsg.ExpeditionFightExitReq()
                        NetManager.send(msg, (data: icmsg.ExpeditionFightExitRsp) => {
                            ExpeditionUtils.updatePointInfo(data.point)
                        })
                    } else if (stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'ROYAL') {
                        // 重置据点状态
                        GlobalUtil.openAskPanel({
                            descText: gdk.i18n.t('i18n:ROYAL_TIP1'),//
                            sureCb: () => {
                                let rModel = ModelManager.get(RoyalModel);
                                let qmsg = new icmsg.RoyalFightOverReq();
                                qmsg.round = 3;
                                qmsg.isWin = false;
                                rModel.clearFightData();
                                NetManager.send(qmsg, (data: icmsg.RoyalFightOverRsp) => {
                                    rModel.score = data.newScore;
                                    rModel.division = data.newDiv
                                    rModel.rank = data.newRank;
                                    super.close(buttonIndex);
                                }, this);
                            }
                        });
                        return;
                    } else if (stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'ROYAL_TEST') {
                        let rModel = ModelManager.get(RoyalModel);
                        rModel.clearTestFightData();
                    }
                    break;

                default:
                    // 忽略其它状态
                    break;
            }
        }
        if (this.model.isDefender && !(model.arenaSyncData.fightType == 'ARENAHONOR_GUESS' || model.arenaSyncData.fightType == 'WORLDHONOR_GUESS')) {
            let heroModel = ModelManager.get(HeroModel)
            gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 1, heroModel.curDefendType)
            gdk.panel.open(PanelId.RoleSetUpHeroSelector);
        }

        if (stageConfig.copy_id == CopyType.SevenDayWar) {
            gdk.panel.open(PanelId.SevenDayWarActView)
        }

        super.close(buttonIndex);
    }

    //配置scene的config后，需要初始化暂停时关卡标题
    @gdk.binding('model.stageConfig')
    _setStageConfig(stageConfig: Copy_stageCfg) {
        //设置暂停时的关卡名称
        if (this.pauseTitle && stageConfig) {
            this.pauseTitle.string = stageConfig.name;
        }
    }

    /**
     * 改变时间速度
     */
    changeTimeScale() {
        let model = this.model;
        let array: number[] = model.timeScaleArray;
        let idx = array.indexOf(model.timeScale) + 1;
        if (idx >= array.length) {
            idx = 0;
        }
        model.timeScale = array[idx];
    }

    /**
     * 震屏
     * @param range 震幅
     * @param num 震动次数
     */
    quake(range: number, num: number) {
        let node = this.root || this.thing.parent;
        if (this.quakeAction) {
            node.stopAction(this.quakeAction);
            node.setPosition(this.originalPos);
        }
        let step = range / num;
        let pos = this.originalPos;
        let cb = function () {
            range -= step;
            let min = -1 * range;
            let max = range;
            node.x = pos.x + MathUtil.rnd(min, max);
            node.y = pos.y + MathUtil.rnd(min, max);
        }
        this.quakeAction = cc.speed(cc.sequence(
            cc.repeat(
                cc.sequence(cc.delayTime(1 / cc.game.getFrameRate()), cc.callFunc(cb)), num
            ),
            cc.moveTo(0.05, pos),
            cc.callFunc(() => {
                this.quakeAction = null;
            }),
        ), this.model.timeScale);
        node.runAction(this.quakeAction);
    }

    @gdk.binding('model.wave')
    @gdk.binding('model.arrivalEnemy')
    _refreshCupShow() {
        if (!this.protegeHp) return;
        if (!this.wave) return;
        if (!this.cupsShowNode.active) return;

        let model = this.model;
        if (!model || !model.enemyCfg) return;
        let hp = 0;
        model.proteges.forEach(protege => {
            hp += protege.model.hp;
        })
        this.protegeHp.string = '' + hp;
        this.wave.string = model.wave + '/' + model.enemyCfg[model.enemyCfg.length - 1].wave;
    }

    @gdk.binding('model.realWave')
    _refreshAdventureWave() {

        // 竞技模式波次
        let model = this.model;
        let v = model.realWave;
        let waveNd = cc.find(`Pvp/ui/arenaInfo/wave`, this.node);
        if (v > 0 &&
            waveNd &&
            model.stageConfig.copy_id == CopyType.NONE &&
            model.arenaSyncData.fightType != 'FOOTHOLD' &&
            model.arenaSyncData.fightType != 'ROYAL' &&
            model.arenaSyncData.fightType != 'ROYAL_TEST'
        ) {
            let label = waveNd.getComponent(cc.Label);
            waveNd.active = true;
            label.string = StringUtils.format(gdk.i18n.t("i18n:PVE_SCENE_TIP7"), v);
        } else if (waveNd) {
            waveNd.active = false;
        }

        // 探险副本波次
        let advModel = ModelManager.get(AdventureModel)
        if (advModel.difficulty != 4) {
            return
        }
        let waveNode = cc.find('UI/ScorePanel/adventureWaveLab', this.node)
        if (!waveNode) return
        waveNode.active = false
        if (model.stageConfig && model.stageConfig.copy_id == CopyType.Adventure) {
            waveNode.active = true
            let waveLab = waveNode.getComponent(cc.RichText)
            waveLab.string = StringUtils.format(gdk.i18n.t("i18n:PVE_SCENE_TIP1"), v)
        }
    }

    @gdk.binding('model.wave')
    _refreshSiegeWave() {
        let waveNode = cc.find('UI/ScorePanel/adventureWaveLab', this.node)
        if (!waveNode) return
        waveNode.active = false
        if (this.model.stageConfig && this.model.stageConfig.copy_id == CopyType.Siege) {
            waveNode.active = true
            let waveLab = waveNode.getComponent(cc.RichText)
            waveLab.string = ''
            waveLab.string = StringUtils.format(gdk.i18n.t("i18n:PVE_SCENE_TIP1"), this.model.wave)//`第<color=#00ff00>${this.model.realWave}</color>波`
        }
    }

    @gdk.binding('model.killedEnemy')
    @gdk.binding('model.createdEnemy')
    @gdk.binding('model.arrivalEnemy')
    _score() {
        let model = this.model;
        if (!model) return;
        if (!model.config) return;
        if (model.isDefender) return;
        if (!this.scoreLabel) return;
        let killNum: number;
        if (!model.config.endless) {
            // 正常关卡，显示剩余敌军
            killNum = model.maxEnemy - model.killedEnemy + model.createdEnemy - model.arrivalEnemy;
            // this.score.string = StringUtils.format(
            //     gdk.i18n.t("i18n:PVE_INFO_NORMAL_HTML"),
            //     model.maxEnemy - model.killedEnemy + model.createdEnemy - model.arrivalEnemy,
            // );
        } else {
            // 无限关卡，显示杀敌数
            killNum = model.killedEnemy;
            // this.score.string = StringUtils.format(
            //     gdk.i18n.t("i18n:PVE_INFO_ENDLESS_HTML"),
            //     model.killedEnemy,
            // );   
            if (model.stageConfig.copy_id == CopyType.Adventure) {
                let lab = this.scoreLabel.node.parent.getChildByName("scoreSLabel").getComponent(cc.Label)
                lab.string = gdk.i18n.t("i18n:PVE_SCENE_TIP2")//`累计击杀`
            }
        }
        this.scoreLabel.string = killNum + '';
        if (model.stageConfig.copy_id == CopyType.Rune) {
            //符文副本处理
            this.RuneCurNum.string = model.killedEnemy + '';
            let temNum = Math.floor(500 * (model.killedEnemy / model.stageConfig.monsters))
            this.RuneMonsterMask.width = temNum;
            this.RuneCurNum.node.parent.x = temNum
            this.RuneMaxNum.string = model.stageConfig.monsters + ''
        }
    }

    @gdk.binding('model.timeScale')
    _timeScale(v: number) {
        let model = this.model;
        let array: number[] = model.timeScaleArray;
        let idx = array.indexOf(v);
        if (idx >= 0) {
            //this.timeScale.string = "/" + (idx + 1);
            let icon: string[] = ['zd_caozuo02', 'zd_caozuo03', 'zd_caozuo04']
            let path = 'view/pve/texture/ui/' + icon[idx];
            GlobalUtil.setSpriteIcon(this.node, this.timeScale, path);
            GlobalUtil.setSpriteIcon(this.node, cc.find('Pvp/ui/pieces/bot/TimeScaleBtn/timeScale', this.node), path);
            // 保存战斗状态时的速度设置
            if (model.state == PveSceneState.Fight &&
                model.config.can_speedup == 2 &&
                model.isReplay !== true &&
                model.isMirror !== true
            ) {
                GlobalUtil.setLocal('pve_time_scale', v);
            }
        }
        if (this.quakeAction) {
            this.quakeAction['setSpeed'](v);
        }
        // 同步速度至镜像战斗
        if (!model.isMirror && model.arenaSyncData && model.arenaSyncData.mirrorModel) {
            model.arenaSyncData.mirrorModel.timeScale = v;
        }
    }

    @gdk.binding('model.state')
    _state(v: PveSceneState) {
        !this.model.isMirror && gdk.Timer.once(100, this, this._updateStateLater);
        // 广播事件至战斗对象FSM
        switch (v) {
            case PveSceneState.Pause:
            case PveSceneState.Entering:
            case PveSceneState.Exiting:
            case PveSceneState.NextLevel:
            case PveSceneState.Fight:
            case PveSceneState.WaveOver:
                break;
            case PveSceneState.Ready:
                if (this.model.stageConfig && this.model.stageConfig.guide == 1 && !this.model.isMirror) {
                    let state = GlobalUtil.getLocal('GuideMoveHero_' + this.model.stageConfig.id)
                    if (!state) {
                        gdk.panel.open(PanelId.GuideMoveHero);
                        GlobalUtil.setLocal('GuideMoveHero_' + this.model.stageConfig.id, true)
                    }
                }
                break;
            case PveSceneState.Reset:
            default:
                gdk.fsm.Fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_IDLE);
                break;
        }
    }

    @gdk.binding('model.killEnemyDrop')
    _updateEnemyDropInfo(v: any) {
        let stageConfig = this.model.stageConfig;
        if (!stageConfig || (stageConfig.copy_id != CopyType.MAIN && stageConfig.subtype != 46)) return;
        if (!this.dropReward) return;
        if (!this.dropReward.active) return;
        if (!CopyUtil.isStagePassed(stageConfig.id)) {
            this.dropGold.string = v[1] || '0';
            this.dropYing.string = v[2] || '0';
            this.dropJin.string = v[3] || '0';
        }
    }

    _updateStateLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabledInHierarchy) return;
        if (!this.model) return;
        let model = this.model;
        let stageConfig = this.model.stageConfig;
        let hideArr: string[];  // 隐藏的节点
        let showArr: string[];  // 显示的节点
        let hbtns: string[];    // 隐藏的按钮
        let sbtns: string[];    // 显示的按钮
        if (stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
            let pb = cc.find('Pvp/ui/pieces/bot', this.node);
            let pf = cc.find('Pvp/ui/pieces/fetter', this.node);
            pb && pb.getComponent(PvePiecesBotCtrl).updateState(model);
            pf && pf.getComponent(PvePiecesFetterCtrl).updateState(model);
        }
        switch (model.state) {
            case PveSceneState.Loading:
                hideArr = [
                    'UI/ScorePanel', 'UI/PveSkillDock', 'UI/gameTime',
                    'UI/DropPanel', 'UI/ReadyBottom', 'UI/Group', 'UI/Weapon',
                    'Pvp/ui/fightInfo', 'Pvp/ui/arenaInfo', 'UI/HeroTrailHeroList',
                    'UI/EquipSelectBtn', 'UI/cupMonsterList', 'UI/cupMonsterList',
                ];
                showArr = [];
                if (stageConfig.copy_id == CopyType.NONE) {
                    hideArr.push('UI/TitlePanel');
                    if (this.model.arenaSyncData.fightType == 'FOOTHOLD') {
                        hideArr.push('Pvp/ui/arenaTitle');
                    } else {
                        showArr.push('Pvp/ui/arenaTitle');
                        let url = 'view/arena/texture/arena/yx_jjc';
                        let titleNameNode = cc.find('Pvp/ui/arenaTitle/titleName', this.node)
                        titleNameNode ? titleNameNode.active = false : 0;
                        if (this.model.arenaSyncData.fightType == 'CHAMPION_GUESS') {
                            url = 'view/arena/texture/arena/jbs_youjiangjincai'
                        } else if (this.model.arenaSyncData.fightType == 'GUARDIANTOWER') {
                            url = 'view/arena/texture/arena/hsmj_hushibiaoti2';
                            if (titleNameNode) {
                                titleNameNode.active = true;
                                let titleName = titleNameNode.getComponent(cc.Label)
                                titleName.string = ModelManager.get(GuardianTowerModel).curCfg.copy_name;
                            }
                        }
                        if (this.model.arenaSyncData.fightType == 'ROYAL' || this.model.arenaSyncData.fightType == 'ROYAL_TEST') {
                            url = 'view/royalArena/texture/view/hjjjc_huangjiajingjichang';
                        }
                        GlobalUtil.setSpriteIcon(this.node, cc.find('Pvp/ui/arenaTitle/yx_jjc', this.node), url);
                        if (this.model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
                            hideArr.push('UI/ReadyBottom/btns/SetupHeroBtn');
                        }
                        if (this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
                            showArr.push('Pvp/ui/pieces');
                        }
                        if (this.model.arenaSyncData.fightType == 'ROYAL' || this.model.arenaSyncData.fightType == 'ROYAL_TEST') {
                            showArr.push('UI/ReadyBottom/btns/SetupHeroBtn');
                        }
                        else {
                            hideArr.push('Pvp/ui/pieces');
                        }
                    }
                }
                else {
                    hideArr.push('Pvp/ui/arenaTitle');
                    showArr.push('UI/TitlePanel');
                }
                // 不同的副本类型显示隐藏的功能按钮
                switch (stageConfig.copy_id) {
                    case CopyType.Survival:
                        // 生存副本
                        hbtns = [
                            'UI/ReadyBottom/btns/SetupHeroBtn',
                            'UI/ReadyBottom/btns/EquipListBtn',
                            'UI/ReadyBottom/btns/HeroUpgradeBtn',
                        ];
                        sbtns = [
                            'UI/TitlePanel/survivalProgress',
                        ];
                        break;
                    default:
                        hbtns = [
                            'UI/ReadyBottom/btns/SetupHeroBtn',
                            'UI/ReadyBottom/btns/EquipListBtn',
                            'UI/ReadyBottom/btns/HeroUpgradeBtn',
                        ];
                        sbtns = [];
                        break;
                }
                break;

            case PveSceneState.Ready:
                hideArr = [
                    'UI/ScorePanel',
                    'UI/PveSkillDock',
                    'UI/gameTime',
                    'UI/DropPanel',
                    'UI/Weapon',
                    'Pvp/ui/fightInfo',
                    'UI/HeroTrailHeroList',
                    'UI/EquipSelectBtn',
                    'UI/cupMonsterList',
                    'UI/GateCondition',
                    'UI/EndRuinsChapterCondition',
                    'UI/HeroAwakeningChapterCondition',
                    'UI/RoyalWinTips',
                    'UI/RoyalWinTips2'
                ];
                showArr = ['UI/ReadyBottom'];
                if (stageConfig.copy_id == CopyType.NONE) {
                    hideArr.push('UI/gameTime', 'UI/TitlePanel', 'UI/Group');
                    if (this.model.arenaSyncData.fightType == 'FOOTHOLD') {
                        hideArr.push('Pvp/ui/arenaTitle');
                    } else {
                        showArr.push('Pvp/ui/arenaTitle');
                    }
                    if (this.model.arenaSyncData.fightType == 'ARENATEAM') {
                        let temModel = ModelManager.get(ArenaTeamViewModel)
                        if (!this.model.isMirror && !this.model.isDefender) {
                            let p = temModel.opponents[temModel.fightNum].brief
                            let player = new icmsg.ArenaPlayer();
                            player.id = p.id;
                            player.robotId = null;
                            player.name = p.name;
                            player.head = p.head;
                            player.frame = p.headFrame;
                            player.level = p.level;
                            player.power = p.power;
                            [player.id, 0, player]
                            this.model.arenaSyncData.args = [player.id, 0, player];
                        }
                    } else if (this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
                        let idx = showArr.indexOf('UI/ReadyBottom');
                        if (idx !== -1) showArr.splice(idx, 1);
                        hideArr.push('UI/ReadyBottom');
                    } else if (this.model.arenaSyncData.fightType == 'ROYAL' || this.model.arenaSyncData.fightType == 'ROYAL_TEST') {
                        showArr.push('UI/RoyalWinTips');
                        showArr.push('UI/RoyalWinTips2');
                        let index5 = hideArr.indexOf('UI/RoyalWinTips');
                        if (index5 >= 0) hideArr.splice(index5, 1);
                        let index6 = hideArr.indexOf('UI/RoyalWinTips2');
                        if (index6 >= 0) hideArr.splice(index6, 1);
                        let rgameTime = cc.find('Pvp/ui/arenaInfo/royalGameTime', this.node)
                        if (rgameTime) {
                            rgameTime.active = false;
                        }

                        // let node = cc.find('Pvp/ui/arenaInfo', this.node)
                        // if (node) {
                        //     let vsNode = node.getChildByName('vs');
                        //     let tem = ['hjjjc_diyiju', 'hjjjc_dierju', 'hjjjc_disanju'];
                        //     let temModel = ModelManager.get(RoyalModel)
                        //     let path = 'view/pve/texture/ui/royalArena/' + tem[temModel.curFightNum];
                        //     if (!this.model.isMirror) {
                        //         GlobalUtil.setSpriteIcon(this.node, vsNode, path);
                        //     }
                        // }
                    }
                }
                else {
                    hideArr.push('Pvp/ui/arenaTitle');
                    showArr.push('UI/TitlePanel', 'UI/Group');
                }
                // 不同的副本类型显示隐藏的功能按钮
                switch (stageConfig.copy_id) {
                    case CopyType.ChallengeCup:
                    case CopyType.RookieCup:
                        // 挑战副本
                        hbtns = [
                            'UI/ReadyBottom/btns/SetupHeroBtn',
                            'UI/ReadyBottom/btns/EquipListBtn',
                            'UI/ReadyBottom/btns/HeroUpgradeBtn',
                            'UI/ReadyBottom/EquipSelectBtn',
                        ];
                        sbtns = [];
                        hideArr.push('Group');
                        let index = showArr.indexOf('UI/Group');
                        if (index >= 0) showArr.splice(index, 1);

                        showArr.push('UI/cupMonsterList');
                        let index2 = hideArr.indexOf('UI/cupMonsterList');
                        if (index2 >= 0) hideArr.splice(index2, 1);

                        showArr.push('UI/GateCondition');
                        let index3 = hideArr.indexOf('UI/GateCondition');
                        if (index3 >= 0) hideArr.splice(index3, 1);
                        break;

                    case CopyType.Survival:
                        // 生存副本
                        hbtns = [];
                        sbtns = [
                            'UI/ReadyBottom/btns/SetupHeroBtn',
                            'UI/ReadyBottom/btns/EquipListBtn',
                            'UI/ReadyBottom/btns/HeroUpgradeBtn',
                        ];
                        //判断是否需要显示装备选择按钮
                        //'UI/ReadyBottom/EquipSelectBtn',
                        if (CopyUtil.isCanUpgradeSurvivalEquip()) {
                            //sbtns.push('UI/ReadyBottom/EquipSelectBtn')
                            let index1 = hideArr.indexOf('UI/EquipSelectBtn');
                            if (index1 >= 0) hideArr.splice(index1, 1);
                            showArr.push('UI/EquipSelectBtn');
                        }
                        break;
                    case CopyType.HeroTrial:
                    case CopyType.NewHeroTrial:
                        let index1 = hideArr.indexOf('UI/HeroTrailHeroList');
                        if (index1 >= 0) hideArr.splice(index1, 1);
                        showArr.push('UI/HeroTrailHeroList');
                        break;

                    case CopyType.EndRuin:
                        showArr.push('UI/EndRuinsChapterCondition', 'UI/ReadyBottom/btns/SetupHeroBtn');
                        let index4 = hideArr.indexOf('UI/EndRuinsChapterCondition');
                        if (index4 >= 0) hideArr.splice(index4, 1);
                        break;
                    case CopyType.HeroAwakening:
                        showArr.push('UI/HeroAwakeningChapterCondition', 'UI/ReadyBottom/btns/SetupHeroBtn');
                        let index5 = hideArr.indexOf('UI/HeroAwakeningChapterCondition');
                        if (index5 >= 0) hideArr.splice(index5, 1);
                        break;
                    case CopyType.Mystery:
                        hbtns = [
                            'UI/ReadyBottom/btns/SetupHeroBtn',
                            'UI/ReadyBottom/btns/EquipListBtn',
                            'UI/ReadyBottom/btns/HeroUpgradeBtn',
                            'UI/ReadyBottom/EquipSelectBtn',
                        ];
                        sbtns = [];
                        break;
                    default:
                        // 默认状态
                        hbtns = [
                            'UI/ReadyBottom/btns/EquipListBtn',
                            'UI/ReadyBottom/btns/HeroUpgradeBtn',
                            'UI/TitlePanel/survivalProgress',
                            'UI/ReadyBottom/EquipSelectBtn',
                        ];
                        if (!this.model.isBounty) {
                            sbtns = ['UI/ReadyBottom/btns/SetupHeroBtn'];
                        }
                        if (this.model.isDefender) {
                            if (this.model.arenaSyncData.fightType == 'ROYAL' || this.model.arenaSyncData.fightType == 'ROYAL_TEST') {
                                sbtns = ['UI/ReadyBottom/btns/SetupHeroBtn'];
                            } else {
                                sbtns = ['UI/ReadyBottom/btns/SetupHeroBtn', 'UI/ReadyBottom/btns/HeroUpgradeBtn'];
                            }

                            if ((this.model.arenaSyncData.fightType == 'ARENAHONOR_GUESS' || this.model.arenaSyncData.fightType == 'WORLDHONOR_GUESS')) {
                                sbtns = []
                            }
                        }
                        break;
                }
                cc.director.getCollisionManager().enabled = true;
                this._updateArenaFightInfo();
                this._updateArenaPos();
                break;

            case PveSceneState.Entering:
            case PveSceneState.NextLevel:
            case PveSceneState.Fight:
                hideArr = [
                    'UI/ReadyBottom',
                    'UI/MainLineBtn',
                    'UI/TitlePanel',
                    'Pvp/ui/fightInfo/down/layout/name',
                    'UI/HeroTrailHeroList',
                    'UI/EquipSelectBtn',
                    'UI/cupMonsterList',
                    'UI/GateCondition'
                ];
                showArr = ['UI/PveSkillDock'];
                // 新手引导时,隐藏暂停和加速按钮
                let root = cc.find('UI/PveSkillDock/layout', this.node);
                let pauseBtn = root.getChildByName("PauseBtn")
                let pauseBan = pauseBtn.getChildByName("ban")
                if (pauseBan) {
                    let suspended = ConfigManager.getItem(GlobalCfg, { key: 'suspended' }).value;
                    let b = !model.isReplay && stageConfig.copy_id != CopyType.NONE;
                    b = b && (stageConfig.id < suspended[0] || suspended.indexOf(stageConfig.id) > 0);
                    pauseBan.active = b;
                }

                let timeScaleBtn = root.getChildByName("TimeScaleBtn")
                let timeScaleBan = timeScaleBtn.getChildByName("ban")
                if (timeScaleBan) {
                    let speed_up = ConfigManager.getItem(GlobalCfg, { key: 'speed_up' }).value;
                    let b = !model.isReplay && stageConfig.copy_id != CopyType.NONE;
                    b = b && (stageConfig.id < speed_up[0] || speed_up.indexOf(stageConfig.id) > 0);
                    timeScaleBan.active = b;
                }

                // 竞技模式
                if (stageConfig.copy_id == CopyType.NONE) {
                    showArr.push('Pvp/ui/fightInfo', 'Pvp/ui/arenaInfo');
                    // if (this.model.arenaSyncData.fightType == 'FOOTHOLD') {
                    //     showArr.push('UI/FhPanel');
                    // }
                    let titleNameNode = cc.find('Pvp/ui/arenaTitle/titleName', this.node)
                    titleNameNode ? titleNameNode.active = false : 0;
                    let node = cc.find('Pvp/ui/arenaInfo', this.node)
                    if (node) {
                        let vsNode = node.getChildByName('vs');
                        let path = ''
                        //let temModel = ModelManager.get(ArenaTeamViewModel)
                        if (this.model.arenaSyncData.fightType == 'ARENATEAM') {
                            let temModel = ModelManager.get(ArenaTeamViewModel)
                            path = 'view/pve/texture/ui/arena/zdjjc_fightNum' + (temModel.fightNum + 1);
                            if (!this.model.isMirror) {
                                GlobalUtil.setSpriteIcon(this.node, vsNode, path);
                                let p = temModel.opponents[temModel.fightNum].brief
                                let player = new icmsg.ArenaPlayer();
                                player.id = p.id;
                                player.robotId = null;
                                player.name = p.name;
                                player.head = p.head;
                                player.frame = p.headFrame;
                                player.level = p.level;
                                player.power = p.power;
                                [player.id, 0, player]
                                this.model.arenaSyncData.args = [player.id, 0, player];
                            }
                        } else if (this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
                            let idx = showArr.indexOf('UI/PveSkillDock');
                            if (idx >= 0) showArr.splice(idx, 1);
                            hideArr.push('UI/PveSkillDock');
                        } else if (this.model.arenaSyncData.fightType == 'ROYAL') {
                            let rgameTime = cc.find('Pvp/ui/arenaInfo/royalGameTime', this.node)
                            if (rgameTime) {
                                rgameTime.active = true;
                            }

                            // let tem = ['hjjjc_diyiju', 'hjjjc_dierju', 'hjjjc_disanju'];
                            // let temModel = ModelManager.get(RoyalModel)
                            // path = 'view/pve/texture/ui/royalArena/' + tem[temModel.curFightNum];
                            // if (!this.model.isMirror) {
                            //     GlobalUtil.setSpriteIcon(this.node, vsNode, path);
                            // }
                        } else if (this.model.arenaSyncData.fightType == 'ROYAL_TEST') {
                            let rgameTime = cc.find('Pvp/ui/arenaInfo/royalGameTime', this.node)
                            if (rgameTime) {
                                rgameTime.active = true;
                            }
                            // let tem = ['hjjjc_diyiju', 'hjjjc_dierju', 'hjjjc_disanju'];
                            // let temModel = ModelManager.get(RoyalModel)
                            // path = 'view/pve/texture/ui/royalArena/' + tem[temModel.curFightNum];
                            // if (!this.model.isMirror) {
                            //     GlobalUtil.setSpriteIcon(this.node, vsNode, path);
                            // }

                        } else {
                            path = 'view/pve/texture/ui/arena/jjc_vs'
                        }

                    }
                    hideArr.push('UI/gameTime', 'UI/Group',);
                    this.updatePlayerName();
                    this._updateArenaPos();
                    //this._updateRoyalWinTip()
                } else {
                    showArr.push('UI/ScorePanel', 'UI/gameTime', 'UI/Group');
                    hideArr.push('Pvp/ui/fightInfo', 'Pvp/ui/arenaInfo');

                }

                // 是否创建神器UI
                if (model.generals.length > 1) {
                    showArr.push('UI/Weapon');
                } else if (model.generals.length == 1 && model.generals[0].node.name == 'general_1') {
                    showArr.push('UI/Weapon');
                } else {
                    hideArr.push('UI/Weapon');
                }

                // 掉落物品显示判断
                hbtns = ['UI/PveSkillDock/layout/EquipListBtn', 'UI/ScorePanel/RuneMonsterPro'];
                sbtns = [];
                switch (stageConfig.copy_id) {
                    case CopyType.MAIN:
                        // 主线副本
                        if (!CopyUtil.isStagePassed(stageConfig.id)) {
                            showArr.push('UI/DropPanel');
                        } else {
                            hideArr.push('UI/DropPanel');
                        }
                        this.cupsShowNode ? this.cupsShowNode.active = false : 0;
                        break;

                    case CopyType.DoomsDay:
                        if (stageConfig.subtype == 46) {
                            showArr.push('UI/DropPanel');
                        } else {
                            hideArr.push('UI/DropPanel');
                        }
                        this.cupsShowNode ? this.cupsShowNode.active = false : 0;
                        break;
                    case CopyType.RookieCup:
                    case CopyType.ChallengeCup:
                        // 刷新生存副本积分节点激活状态
                        hideArr.push('UI/Group');
                        let index = showArr.indexOf('UI/Group');
                        if (index >= 0) showArr.splice(index, 1);
                        this.cupsShowNode ? this.cupsShowNode.active = true : 0;
                        showArr.push('UI/GateCondition');
                        let index3 = hideArr.indexOf('UI/GateCondition');
                        if (index3 >= 0) hideArr.splice(index3, 1);
                        this._refreshCupShow();
                        break;

                    case CopyType.Survival:
                        // 生存副本
                        hbtns = ['UI/ScorePanel/RuneMonsterPro'];
                        sbtns = ['UI/PveSkillDock/layout/EquipListBtn'];
                        break;
                    case CopyType.Rune:
                        hbtns = ['UI/PveSkillDock/layout/EquipListBtn'];
                        sbtns = ['UI/ScorePanel/RuneMonsterPro'];
                        break;
                    case CopyType.HeroTrial:
                    case CopyType.NewHeroTrial:
                        let index1 = hideArr.indexOf('UI/HeroTrailHeroList');
                        if (index >= 0) hideArr.splice(index, 1);
                        showArr.push('UI/HeroTrailHeroList');
                        break;
                    case CopyType.Adventure:
                        this._refreshAdventureWave();
                        break
                    case CopyType.Siege:
                        this._refreshSiegeWave()
                        break
                    default:
                        this.cupsShowNode ? this.cupsShowNode.active = false : 0;
                }
                // 指挥官技能列表
                if (model.eliteStageUtil.general && stageConfig.copy_id != CopyType.RookieCup) {
                    sbtns.push('UI/PveSkillDock/layout/list');
                    hbtns.push('UI/PveSkillDock/bg1');
                    sbtns.push('UI/PveSkillDock/bg');
                } else {
                    sbtns.push('UI/PveSkillDock/bg1');
                    hbtns.push('UI/PveSkillDock/layout/list');
                    hbtns.push('UI/PveSkillDock/bg');
                }
                break;

            case PveSceneState.Win:
            case PveSceneState.Over:
            case PveSceneState.Pause:
                hideArr = [
                    'UI/ReadyBottom', 'UI/ScorePanel', 'UI/ReadyBottom',
                    'UI/PveSkillDock', 'UI/gameTime', 'UI/DropPanel', 'UI/Group', 'UI/Weapon',
                    'Pvp/ui/fightInfo', 'UI/FhPanel', 'Pvp/ui/arenaInfo', 'Pvp/ui/arenaTitle', 'UI/HeroTrailHeroList', 'UI/EquipSelectBtn',
                    'UI/cupMonsterList', 'UI/GateCondition'
                ];
                showArr = [];
                break;
        }
        // 显示与隐藏的按钮
        hbtns && hbtns.forEach(n => {
            let tem = cc.find(n, this.node)
            if (tem) {
                tem.active = false
            }
        });
        sbtns && sbtns.forEach(n => {
            let tem = cc.find(n, this.node)
            if (tem) {
                tem.active = true
            }
        });
        // 隐藏的节点
        hideArr && hideArr.forEach(name => {
            gdk.NodeTool.hide(cc.find(name, this.node));
        });
        // 显示的节点
        showArr && showArr.forEach(name => {
            gdk.NodeTool.show(cc.find(name, this.node));
        });

        this.refreshSurvivalHeroListRed()
        this._updateFhPanel();
    }

    // 设置滚动条状态
    setScrollViewEnabled(v: boolean) {
        if (!this.scrollView) return;
        v = v && this.content.width > this.root.width;
        if (v) {
            cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        } else {
            cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        }
        this.scrollView.enabled = v;
        // 更新遮罩状态
        let node = this.scrollView.node;
        let mask = node.getComponent(cc.Mask);
        if (!mask && v) {
            mask = node.addComponent(cc.Mask);
        }
        mask && (mask.enabled = v);
    }

    // 渲染前回调
    _beforeDraw() {
        let s = this.scrollView.node;
        let v = cc.rect(0, 0, s.width, s.height);   // this.node.getChildByName('UI').getBoundingBoxToWorld();
        let c = this.content.children;
        for (let i = c.length - 1; i >= 0; i--) {
            let a = c[i].children;
            for (let j = a.length - 1; j >= 0; j--) {
                let n = a[j];
                if (v.intersects(n.getBoundingBoxToWorld())) {
                    n.visible = true;
                } else {
                    // 滚动区域外的对象不渲染
                    n.visible = false;
                }
            }
        }
    }

    // 对象排序
    _updateObjectZOrder() {
        let m = this.model;
        this._zIndexSetFunc(m.spawns);
        this._zIndexSetFunc(m.proteges);
        this._zIndexSetFunc(m.generals);
        this._zIndexSetFunc(m.heros);
        this._zIndexSetFunc(m.soldiers);
        this._zIndexSetFunc(m.enemies);
        this._zIndexSetFunc(m.skills);
        this._zIndexSetFunc(m.calleds);
        this._zIndexSetFunc(m.traps);
        this._zIndexSetFunc(m.gates);
        this._zIndexSetFunc(m.specialEnemies);
    }

    _zIndexSetFunc(a: cc.Component[]) {
        if (!a || !a.length) return;
        for (let i = 0, n = a.length; i < n; i++) {
            let comp = a[i];
            if (comp && comp.node && comp.node.parent == this.thing) {
                comp.node.zIndex = cc.macro.MAX_ZINDEX - Math.max(0, comp.node.y >> 0);
            }
        }
    }

    //上阵英雄战斗力显示
    @gdk.binding('model.totalPower')
    _updateTotalPower(nv: number, ov: number) {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this.num) return;
        let stageConfig = this.model.stageConfig;
        if (!stageConfig || stageConfig.copy_id == CopyType.RookieCup) {
            this.num.node.parent.active = false;
            return;
        }
        if (stageConfig.copy_id == CopyType.NONE) {
            if (this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
                return;
            }
            if (this.model.arenaSyncData.fightType == 'PEAK') {
                this.num.node.parent.active = false;
                return;
            }
            let arenaNode = cc.find("Pvp/ui/arenaInfo", this.node);
            if (arenaNode) {
                arenaNode.getChildByName('self').getChildByName('power').getComponent(cc.Label).string = nv + '';
            }
            if (this.model.isDefender) {
                return;
            }
        }
        this.num.node.parent.active = true;
        if (nv == ov) return;
        if (ov == null || ov === void 0) {
            this.num.value = 0;
            this.num.clear();
        } else {
            this.num.value = ov;
        }
        this.num.scrollTo(Math.abs(nv));
        if (nv > ov) {
            this.upNode.active = true;
            gdk.Timer.once(1000, this, () => {
                if (!cc.isValid(this.upNode)) return;
                this.upNode.active = false;
            });
        }
    }

    @gdk.binding('model.showMiniChat')
    _updateMiniChat(isShow: boolean) {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let panel = gdk.panel.get(PanelId.MiniChat)
        if (panel) {
            panel.stopAllActions()
            if (isShow) {
                panel.runAction(cc.fadeIn(0.3))
            } else {
                panel.runAction(cc.fadeOut(0.3))
            }
        }
    }

    clickPauseBanTip() {
        if (this.model.stageConfig.copy_id == CopyType.MAIN) {
            let stageId = ConfigManager.getItem(GlobalCfg, { key: 'suspended' }).value[0]
            let aid = ParseMainLineId(stageId, 1)//地图id编号
            let sid = ParseMainLineId(stageId, 2);//关卡编号
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:PVE_SCENE_TIP3"), aid, sid))//(`通关${aid}-${sid}后解锁暂停功能`)
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:PVE_SCENE_TIP5"))
        }
    }

    clickTimeScaleTip() {
        if (this.model.stageConfig.copy_id == CopyType.MAIN) {
            let stageId = ConfigManager.getItem(GlobalCfg, { key: 'speed_up' }).value[0]
            let aid = ParseMainLineId(stageId, 1)//地图id编号
            let sid = ParseMainLineId(stageId, 2);//关卡编号
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:PVE_SCENE_TIP4"), aid, sid))
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:PVE_SCENE_TIP6"))
        }
    }

    openHaloView() {
        if (!JumpUtils.ifSysOpen(2853)) {
            let systemCfg = ConfigManager.getItemById(SystemCfg, 2853);
            if (systemCfg) {
                let stageCfg = ConfigManager.getItemById(Copy_stageCfg, systemCfg.fbId)
                let str = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP1"), stageCfg.name.split(' ')[0])//'通关主线' + stageCfg.name.split(' ')[0] + '解锁';
                gdk.gui.showMessage(str)
            }
            return;
        }
        //gdk.panel.setArgs(PanelId.RoleUpHeroHaloView, this.addCfgs, this.lastAlive)
        if (this.model.stageConfig.copy_id == CopyType.Eternal) {
            gdk.panel.open(PanelId.EternalHeroHaloView);
        } else {
            gdk.panel.open(PanelId.RoleUpHeroHaloView);
        }

    }

    updatePlayerName() {
        let fInfoNode = cc.find('Pvp/ui/fightInfo', this.node)
        if (!fInfoNode.active) {
            return
        }
        let mainPlayer: any = ModelManager.get(RoleModel);
        if (this.model.arenaSyncData.fightType == 'CHAMPION_GUESS') {
            let cM = ModelManager.get(ChampionModel);
            let infos = cM.guessList[cM.guessIndex];
            mainPlayer = infos.playerId == infos.player1.playerId ? infos.player1 : infos.player2;
        }
        if (this.model.arenaSyncData.fightType == 'ARENATEAM') {
            let atM = ModelManager.get(ArenaTeamViewModel);
            let index = atM.fightNum;
            mainPlayer = atM.teamMates[index].brief;
        }

        if (this.model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
            let fhModel = ModelManager.get(FootHoldModel);
            let index = fhModel.gatherFightTeamMatesIndex
            mainPlayer = fhModel.gatherTeamMates[index]
        }

        let arenaPlayer = <icmsg.ArenaPlayer>this.model.arenaSyncData.args[2];
        let infos = [arenaPlayer.name, mainPlayer.name];
        let names = [cc.find('up/name', fInfoNode), cc.find('down/layout/name', fInfoNode)];
        names.forEach((name, idx) => {
            if (name) {
                name.getComponent(cc.Label).string = infos[idx];
            }
        })
    }

    // 更新追加怪物列表，只更新主界面的列表内容
    updateEnemiesList(v: WaveEnemyInfo[]) {
        let m = this.model.arenaSyncData.mainModel;
        let n = cc.find(`Pvp/ui/fightInfo/${this.model.isMirror ? 'up' : 'down'}/list`, m.ctrl.node);
        let c = n.getComponent(gdk.List);
        c.datas = v;
    }

    // 更新追加怪物列表的动画表现
    updateEnemiesSpine(cb: Function) {
        let m = this.model.arenaSyncData.mainModel;
        let s = cc.find(`Pvp/ui/fightInfo/${this.model.isMirror ? 'up/arrow' : 'down/arrow'}/mSpine`, m.ctrl.node);
        let sc = s.getComponent(sp.Skeleton);
        gdk.Timer.once(300, this, () => { cb && cb() });
        sc.setCompleteListener(null);
        sc.setCompleteListener(() => {
            sc.setCompleteListener(null);
            sc.node.active = false;
        });
        sc.node.active = true;
        sc.setAnimation(0, 'stand3', true);
    }

    // 更新竞技模式UI的红心
    updateHeart(v: number, max: number) {
        let m = this.model.arenaSyncData.mainModel;
        let n = cc.find(`Pvp/ui/fightInfo/${this.model.isMirror ? 'up' : 'down/layout'}/hp`, m.ctrl.node);
        let c = n.getComponent(cc.Label);
        let numLab = n.getChildByName('numLab').getComponent(cc.Label);
        if (max > 5) {
            c.string = '0';
            numLab.node.active = true;
            numLab.string = `x${v}`;
        }
        else {
            c.string = (v > 0 ? '0'.repeat(v) : '') + ((v < max) ? '1'.repeat(max - v) : '');
            if (numLab.node.active) {
                numLab.node.active = false;
                numLab.string = '';
            }
        }
        c.node.scale = this.model.scale;
        let hpSpine = cc.find(`Pvp/ui/fightInfo/${this.model.isMirror ? 'up' : 'down/layout'}/hp/spine`, m.ctrl.node);
        let gSpine = cc.find(`Pvp/ui/fightInfo/${this.model.isMirror ? 'up' : 'down'}/gSpine`, m.ctrl.node);
        gSpine.active = hpSpine.active = v == 1 && max <= 5;
        if (v == 1 && max <= 5) {
            gSpine.getComponent(sp.Skeleton).setAnimation(0, `stand${max - 1}`, true)
            hpSpine.getComponent(sp.Skeleton).setAnimation(0, `stand${max - 1}`, true)
        }
    }

    // 更新BOSS来袭倒计时
    updateBossTime(v: number) {
        let m = this.model.arenaSyncData.mainModel;
        let r = cc.find(`Pvp/ui/fightInfo/txt`, m.ctrl.node);
        if (cc.js.isNumber(v) && v > 0) {
            r.active = true;
            let n = cc.find(`Pvp/ui/fightInfo/txt/time`, m.ctrl.node);
            let c = n.getComponent(cc.Label);
            let time = Math.floor(v);
            let sec = time % 60;
            let min = Math.floor((time - sec) / 60);
            let str = (min < 10 ? `0${min}` : `${min}`) + ':' + (sec < 10 ? `0${sec}` : `${sec}`);
            c.string = str;
        } else {
            r.active = false;
        }
        this._updateFhPointHp();
    }


    // _updateRoyalWinTip() {
    //     let model = this.model;
    //     let m = model.arenaSyncData.mainModel;
    //     let r = cc.find(`Pvp/ui/fightInfo/winTip`, m.ctrl.node);
    //     let temCfg = ConfigManager.getItemByField(Royal_sceneCfg, 'stage_id', model.stageConfig.id)

    //     if (model.stageConfig.copy_id == CopyType.NONE && (model.arenaSyncData.fightType == 'ROYAL' || model.arenaSyncData.fightType == 'ROYAL_TEST')) {
    //         // r.active = false;
    //         // let r = cc.find(`bg/winTipLb`, r);
    //         r.active = true
    //         let winlb = cc.find(`bg/winTipLb`, r).getComponent(cc.Label)
    //         let test = cc.find(`bg/test`, r)
    //         winlb.string = temCfg.victory_des
    //         if (model.arenaSyncData.fightType == 'ROYAL') {
    //             test.active = false
    //         } else {
    //             test.active = true
    //         }
    //     } else {
    //         r.active = false;
    //     }
    // }

    /**更新据点战信息 */
    _updateFhPanel() {
        this._updateFhPointHp()
        // let fhPanel = cc.find("UI/FhPanel", this.node)
        // if (!fhPanel.active) {
        //     return
        // }
        // let footHoldModel = ModelManager.get(FootHoldModel)
        // let pointInfo: FhPointInfo = footHoldModel.warPoints[`${footHoldModel.pointDetailInfo.pos.x}-${footHoldModel.pointDetailInfo.pos.y}`]
        // let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", footHoldModel.curMapData.mapId, { world_level: footHoldModel.worldLevelIndex, point_type: pointInfo.type, map_type: footHoldModel.curMapData.mapType })
        // let pointIcon = fhPanel.getChildByName("pointIcon")
        // let leftLab = fhPanel.getChildByName("leftLab").getComponent(cc.Label)
        // let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(footHoldModel.pointDetailInfo.titleExp)
        // let maxHp = pointCfg.HP + MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p4, targetLv)
        // leftLab.string = `${footHoldModel.pointDetailInfo.bossHp}/${maxHp}`
        // if (pointInfo.bonusType == 0) {
        //     let path = ""
        //     let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", footHoldModel.curMapData.mapType, { world_level: footHoldModel.worldLevelIndex })
        //     if (FootHoldUtils.getBuffTowerType(pointInfo.pos.x, pointInfo.pos.y) == 1) {
        //         path = `view/guild/texture/icon/${bonusCfg.resources_skin}`
        //     } else if (FootHoldUtils.getBuffTowerType(pointInfo.pos.x, pointInfo.pos.y) == 2) {
        //         path = `view/guild/texture/icon/${bonusCfg.attribute_skin}`
        //     } else if (FootHoldUtils.getBuffTowerType(pointInfo.pos.x, pointInfo.pos.y) == 3) {
        //         path = `view/guild/texture/icon/${bonusCfg.attenuation_skin}`
        //     }
        //     GlobalUtil.setSpriteIcon(this.node, pointIcon, path)
        // } else {
        //     let path = `view/guild/texture/icon/${pointCfg.resources}`
        //     GlobalUtil.setSpriteIcon(this.node, pointIcon, path)
        // }
    }

    _updateFhPointHp() {
        let fhHp = cc.find(`Pvp/ui/fightInfo/hp`, this.node);
        fhHp.active = false;
        if (this.model.isDefender) {
            return;
        }
        let model = this.model;
        if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'FOOTHOLD') {
            let footHoldModel = ModelManager.get(FootHoldModel)
            let pointInfo: FhPointInfo = footHoldModel.warPoints[`${footHoldModel.pointDetailInfo.pos.x}-${footHoldModel.pointDetailInfo.pos.y}`]
            if (pointInfo) {
                fhHp.active = true
                let m = model.arenaSyncData.mainModel;
                let leftLab = cc.find("hpNode/leftLab", fhHp).getComponent(cc.Label)
                let proBar = cc.find("progress", fhHp).getComponent(cc.ProgressBar)
                let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", footHoldModel.curMapData.mapId, { world_level: footHoldModel.worldLevelIndex, point_type: pointInfo.type, map_type: footHoldModel.curMapData.mapType })
                let damageHp = m.wave - 1 > 0 ? m.wave - 1 : 0
                if (damageHp > 0 && damageHp > footHoldModel.pvpFhLastWave) {
                    let hpAni = cc.find("hpAni", fhHp).getComponent(cc.Animation)
                    hpAni.play("pveFhHpEffect")
                }
                footHoldModel.pvpFhLastWave = damageHp
                let leftHP = footHoldModel.pointDetailInfo.bossHp - damageHp > 0 ? footHoldModel.pointDetailInfo.bossHp - damageHp : 0
                let hp = pointCfg.HP - damageHp > 0 ? leftHP : 0
                let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(footHoldModel.pointDetailInfo.titleExp)
                let maxHp = pointCfg.HP + MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p4, targetLv)
                leftLab.string = `${hp}/${maxHp}`
                proBar.progress = hp / maxHp
                if (hp <= 0) {
                    PveTool.gameOver(model, true)
                }

                let waveLab = cc.find("waveLab", fhHp).getComponent(cc.Label)
                waveLab.string = StringUtils.format(gdk.i18n.t("i18n:PVE_SCENE_TIP7"), m.wave)
            }
        }

        if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'RELIC') {
            let relicModel = ModelManager.get(RelicModel)
            fhHp.active = true
            let m = model.arenaSyncData.mainModel;
            let leftLab = cc.find("hpNode/leftLab", fhHp).getComponent(cc.Label)
            let proBar = cc.find("progress", fhHp).getComponent(cc.ProgressBar)
            let damageHp = m.wave - 1 > 0 ? m.wave - 1 : 0
            let leftHP = relicModel.pointHpData[0] - damageHp > 0 ? relicModel.pointHpData[0] - damageHp : 0
            let totalHp = relicModel.pointHpData[1]
            let hp = totalHp - damageHp > 0 ? leftHP : 0
            leftLab.string = `${hp}/${totalHp}`
            proBar.progress = hp / totalHp
            if (hp <= 0) {
                PveTool.gameOver(model, true)
            }

            let waveLab = cc.find("waveLab", fhHp).getComponent(cc.Label)
            waveLab.string = StringUtils.format(gdk.i18n.t("i18n:PVE_SCENE_TIP7"), m.wave)
        }

        if (model.stageConfig.copy_id == CopyType.NONE && model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
            fhHp.active = true
            let m = model.arenaSyncData.mainModel
            let leftLab = cc.find("hpNode/leftLab", fhHp).getComponent(cc.Label)
            let proBar = cc.find("progress", fhHp).getComponent(cc.ProgressBar)

            let footHoldModel = ModelManager.get(FootHoldModel)
            let pos = footHoldModel.pointDetailInfo.pos
            let pointInfo: FhPointInfo = footHoldModel.warPoints[`${pos.x}-${pos.y}`]
            let targetPos = pointInfo.fhPoint.pos
            if (pointInfo.fhPoint.gather) {
                targetPos = pointInfo.fhPoint.gather.targetPos
            }
            let tagetPointInfo: FhPointInfo = footHoldModel.warPoints[`${targetPos.x}-${targetPos.y}`]
            let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", footHoldModel.curMapData.mapId, { world_level: footHoldModel.worldLevelIndex, point_type: tagetPointInfo.type, map_type: footHoldModel.curMapData.mapType })

            let damageHp = m.wave - 1 > 0 ? m.wave - 1 : 0
            let index = footHoldModel.gatherFightOpponetnsIndex
            let opponent = footHoldModel.gatherOpponents[index]
            if (opponent) {
                let leftHP = opponent.hp - damageHp > 0 ? opponent.hp - damageHp : 0

                let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(footHoldModel.pointDetailInfo.titleExp)
                let isSelf = tagetPointInfo.fhPoint.playerId == opponent.id ? true : false
                let maxHp = pointCfg.HP
                if (isSelf) {
                    maxHp += MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p4, targetLv)
                } else {
                    maxHp = pointCfg.guard_HP
                }
                let hp = maxHp - damageHp > 0 ? leftHP : 0
                leftLab.string = `${hp}/${maxHp}`
                proBar.progress = hp / maxHp
                if (hp <= 0) {
                    PveTool.gameOver(model, true)
                }
                let waveLab = cc.find("waveLab", fhHp).getComponent(cc.Label)
                waveLab.string = StringUtils.format(gdk.i18n.t("i18n:PVE_SCENE_TIP7"), m.wave)
            }
        }
    }

    @gdk.binding('model.refreshArenaInfo')
    _bindArenaFightInfo(v) {
        if (!v) return
        this._updateArenaFightInfo()
    }

    _updateArenaFightInfo() {
        let model = this.model;
        let stageConfig = model.stageConfig;
        let arenaNode = cc.find("Pvp/ui/arenaInfo", this.node)
        gdk.NodeTool.hide(arenaNode);
        if (stageConfig.copy_id !== CopyType.NONE) {
            return
        }
        if (model.isDefender) {
            return;
        }
        let arenateamNode = arenaNode.getChildByName('arenaTeamInfo');
        arenateamNode ? arenateamNode.active = false : 0;
        let mainPlayer: any = ModelManager.get(RoleModel)
        if (model.arenaSyncData.fightType !== 'PIECES_CHESS') {
            let n = cc.find('Pvp/ui/arenaInfo/piecesInfo', this.node);
            n && (n.active = false);
        }
        if (model.arenaSyncData.fightType == 'CHAMPION_GUESS') {
            let cM = ModelManager.get(ChampionModel);
            let infos = cM.guessList[cM.guessIndex];
            mainPlayer = infos.playerId == infos.player1.playerId ? infos.player1 : infos.player2;
        }

        if (model.arenaSyncData.fightType == 'ARENAHONOR_GUESS') {
            let aM = ModelManager.get(ArenaHonorModel);
            let rM = ModelManager.get(RoleModel);
            let infos = aM.guessInfo.players;
            mainPlayer = infos[1].id == rM.id ? aM.playersInfoMap[infos[1].id] : aM.playersInfoMap[infos[0].id];
        }
        if (model.arenaSyncData.fightType == 'WORLDHONOR_GUESS') {
            let aM = ModelManager.get(WorldHonorModel);
            let rM = ModelManager.get(RoleModel);
            let infos = aM.guessInfo.players;
            mainPlayer = infos[1].id == rM.id ? aM.playersInfoMap[infos[1].id] : aM.playersInfoMap[infos[0].id];
        }

        if (model.arenaSyncData.fightType == 'ARENATEAM' && !model.isDefender) {
            let atM = ModelManager.get(ArenaTeamViewModel);
            let index = atM.fightNum;
            mainPlayer = atM.teamMates[index].brief;
            //设置战斗记录
            arenateamNode.active = true;
            arenateamNode.children.forEach((node, index) => {
                let temidx = atM.attackWinList[index];
                let path = 'view/pve/texture/ui/' + atM.attackWinSpStr[temidx];
                GlobalUtil.setSpriteIcon(this.node, node, path);
            })

        }

        if ((model.arenaSyncData.fightType == 'ROYAL' || model.arenaSyncData.fightType == 'ROYAL_TEST') && !model.isDefender) {
            let atM = ModelManager.get(RoyalModel);
            //设置战斗记录
            arenateamNode.active = true;
            arenateamNode.children.forEach((node, index) => {
                let temidx = atM.attackWinList[index];
                let path = 'view/pve/texture/ui/' + atM.attackWinSpStr[temidx];
                GlobalUtil.setSpriteIcon(this.node, node, path);
            })

            //战力计算
            let shared = model.arenaSyncData;
            if (shared.mainModel) {
                let player = new icmsg.ArenaPlayer()
                player.name = mainPlayer.name
                player.head = mainPlayer.head;
                player.frame = mainPlayer.frame;
                player.power = 0;
                shared.mainModel.towers.forEach(tower => {
                    if (tower.hero) {
                        player.power += tower.hero.model.info.heroPower;
                    }
                })
                mainPlayer = player
            }
            if (shared.mirrorModel) {
                let power = 0;
                shared.mirrorModel.towers.forEach(tower => {
                    if (tower.hero) {
                        power += tower.hero.model.info.heroPower;
                    }
                })
                let arenaPlayer = <icmsg.ArenaPlayer>shared.args[2];
                arenaPlayer.power = power
            }

        }

        if (model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
            let fhModel = ModelManager.get(FootHoldModel);
            let index = fhModel.gatherFightTeamMatesIndex
            let info = fhModel.gatherTeamMates[index]
            let player = new icmsg.ArenaPlayer()
            player.name = info.name
            player.head = info.head
            player.frame = info.frame
            let power = 0
            info.heroList.forEach(element => {
                power += element.heroPower
            })
            player.power = power
            mainPlayer = player
        }

        // let rModel = ModelManager.get(RoleModel);
        let shared = model.arenaSyncData;
        if (!shared.mainModel.proteges[0] || (!model.isDefender && !shared.mirrorModel.proteges[0])) {
            gdk.Timer.once(100, this, this._updateArenaFightInfo);
            return;
        }
        let arenaPlayer = <icmsg.ArenaPlayer>shared.args[2];
        let hpMax = shared.mainModel.proteges[0].model.hpMax;
        let mirrorHpMax = !model.isDefender ? shared.mirrorModel.proteges[0].model.hpMax : hpMax;
        let infos = [
            {
                name: mainPlayer.name,
                power: mainPlayer.power,
                frame: mainPlayer.frame || mainPlayer.headFrame,
                head: mainPlayer.head,
                hp: hpMax,
            },
            {
                name: arenaPlayer.name,
                power: arenaPlayer.power,
                frame: arenaPlayer.frame,
                head: arenaPlayer.head,
                hp: mirrorHpMax,
            }
        ];

        let players = [arenaNode.getChildByName('self'), arenaNode.getChildByName('other')];
        players.forEach((player, idx) => {
            let info = infos[idx];
            //巅峰之战不显示战力
            if (model.arenaSyncData.fightType == 'PEAK') {
                info.power = 0
            }
            if (model.arenaSyncData.fightType == 'PIECES_CHESS') {
                info.power = '???';
            }
            player.getChildByName('name').getComponent(cc.Label).string = !model.isDefender ? info.name : '????';
            player.getChildByName('power').getComponent(cc.Label).string = (info.power > 0 && !model.isDefender) ? info.power + '' : '???';
            let hp = info.hp;
            if (hp >= 6) {
                player.getChildByName('hp').getComponent(cc.Label).string = '0';
                player.getChildByName('hp').getChildByName('numLab').active = true;
                player.getChildByName('hp').getChildByName('numLab').getComponent(cc.Label).string = `x${hp}`;
            }
            else {
                player.getChildByName('hp').getChildByName('numLab').active = false;
                player.getChildByName('hp').getComponent(cc.Label).string = hp > 0 ? '0'.repeat(hp) : '';
            }
            GlobalUtil.setSpriteIcon(this.node, player.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(info.frame));

            if (model.arenaSyncData.fightType == 'VAULT' && idx == 1) {
                let monsterCfg = ConfigManager.getItemByField(MonsterCfg, 'id', info.head);
                let path = `icon/monster/${monsterCfg.icon}_s`
                GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', player), path);
            } else {
                let headPath = GlobalUtil.getHeadIconById(info.head);
                //护使秘境胜利结算点击下一关敌方头像不显示问题修改(延迟设置)
                gdk.Timer.once(30, this, () => {
                    GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', player), headPath);
                })

            }
        });

        if (!this.model.isMirror) {
            let vsNode = arenaNode.getChildByName('vs');
            if (model.arenaSyncData.fightType == 'ROYAL') {
                let vsNode = arenaNode.getChildByName('vs');
                let tem = ['hjjjc_diyiju', 'hjjjc_dierju', 'hjjjc_disanju'];
                let temModel = ModelManager.get(RoyalModel)
                let path = 'view/pve/texture/ui/royalArena/' + tem[temModel.curFightNum];
                if (!this.model.isMirror) {
                    GlobalUtil.setSpriteIcon(this.node, vsNode, path);
                }
            } else {
                let path = 'view/pve/texture/ui/arena/jjc_vs'
                GlobalUtil.setSpriteIcon(this.node, vsNode, path);
            }
        }
        gdk.NodeTool.show(arenaNode);
    }

    _updateArenaPos() {
        let fightNode = cc.find("Pvp/ui/fightInfo", this.node);
        if (fightNode.active) {
            fightNode.y = this.root.y * 2;

            let up = fightNode.getChildByName('up');
            let down = fightNode.getChildByName('down');
            if (this.model.arenaSyncData.fightType == 'ROYAL' || this.model.arenaSyncData.fightType == 'ROYAL_TEST') {
                up.active = false
                down.active = false;
            } else {
                up.active = true
                down.active = true;
            }

        }
        let arenaNode = cc.find("Pvp/ui/arenaInfo", this.node);
        if (!arenaNode.active) {
            return;
        }
        let playersHp = [
            arenaNode.getChildByName('self').getChildByName('hp'),
            arenaNode.getChildByName('other').getChildByName('hp'),
        ];
        switch (this.model.state) {
            case PveSceneState.Ready:
                if (this.model.arenaSyncData && this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
                    arenaNode.runAction(cc.moveTo(.3, -2, this.node.height / 2 - 18));
                    playersHp.forEach(node => { node.active = false; });
                }
                else {
                    arenaNode.setPosition(-2, this.root.y * 2);
                    playersHp.forEach(node => { node.active = true; });
                }
                break;

            case PveSceneState.Entering:
            case PveSceneState.NextLevel:
            case PveSceneState.Fight:
                if (!this.model.arenaSyncData || this.model.arenaSyncData.fightType !== 'PIECES_CHESS') {
                    arenaNode.runAction(cc.moveTo(.3, -2, this.node.height / 2 - 18));
                    playersHp.forEach(node => { node.active = false; });
                }
                break;
        }
    }

    //英雄列表按钮点击事件
    setUpHeroBtnClick() {
        let stageConfig = this.model.stageConfig;
        if (stageConfig.copy_id == CopyType.Survival && stageConfig.subtype == 1) {
            gdk.panel.open(PanelId.SurvivalSetUpHeroSelector);
        } else if (stageConfig.copy_id == CopyType.Adventure) {
            gdk.panel.open(PanelId.AdventureSetUpHeroSelector);
        } else if (stageConfig.copy_id == CopyType.NewAdventure) {
            let adModel = ModelManager.get(NewAdventureModel)
            if (adModel.copyType == 0) {
                gdk.panel.open(PanelId.AdventureSetUpHeroSelector2);
            } else {
                gdk.panel.open(PanelId.NewAdventureSetUpHeroSelector);
            }
        } else if (stageConfig.copy_id == CopyType.HeroAwakening) {
            gdk.panel.setArgs(PanelId.PveHeroAwakeningSetUpHeroSelector, this.model.stageConfig);
            gdk.panel.open(PanelId.PveHeroAwakeningSetUpHeroSelector);
        } else if (stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData.fightType == 'PEAK') {
            gdk.panel.setArgs(PanelId.PeakSetUpHeroSelector, -1);
            gdk.panel.open(PanelId.PeakSetUpHeroSelector);
        } else if (stageConfig.copy_id == CopyType.Expedition) {
            gdk.panel.open(PanelId.ExpeditionFight);
        } else if (stageConfig.copy_id == CopyType.Ultimate) {
            gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 0, 7);
            gdk.panel.open(PanelId.RoleSetUpHeroSelector);
        } else if (stageConfig.copy_id == CopyType.NONE && (this.model.arenaSyncData.fightType == 'ROYAL' || this.model.arenaSyncData.fightType == 'ROYAL_TEST')) {
            gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 0, 8);
            gdk.panel.open(PanelId.RoleSetUpHeroSelector);
        }
        else {
            gdk.panel.open(PanelId.RoleSetUpHeroSelector);
        }
    }
    //英雄列表防守按钮点击事件
    setUpHeroDefenderBtnClick() {
        //let stageConfig = this.model.stageConfig;
        let heroModel = ModelManager.get(HeroModel)
        gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 1, heroModel.curDefendType);
        gdk.panel.open(PanelId.RoleSetUpHeroSelector,);
    }

    StartBtnClick() {
        let stageConfig = this.model.stageConfig;
        if (stageConfig.copy_id == CopyType.Survival && CopyUtil.isCanUpgradeSurvivalEquip()) {
            gdk.panel.open(PanelId.PveSceneEquipBuyPanel);
        } else {
            if (stageConfig.copy_id == CopyType.Adventure) {
                let advModel = ModelManager.get(AdventureModel)
                if (advModel.selectIndex == advModel.plateIndex) {
                    this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_FIGHT);
                } else {
                    let msg = new icmsg.AdventurePlateEnterReq()
                    msg.plateIndex = advModel.selectIndex
                    NetManager.send(msg, (data: icmsg.AdventurePlateEnterRsp) => {
                        advModel.plateIndex = data.plateIndex
                        this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_FIGHT);
                    })
                }
            } else if (stageConfig.copy_id == CopyType.NewAdventure) {
                this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_FIGHT);
            } else if (stageConfig.copy_id == CopyType.HeroAwakening) {
                //英雄崛起副本检测上阵列表是否有觉醒英雄
                // let heroInfo = HeroUtils.getHeroInfoById(111);
                // let heroModel = ModelManager.get(this.copyModel)
                // let have = false;
                // heroModel.PveUpHeroList.forEach(id => {
                //     if (id == heroInfo.heroId) {
                //         have = true;
                //     }
                // })
                if (this.copyModel.haveAwakeHero) {
                    this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_FIGHT);
                } else {
                    gdk.gui.showMessage(gdk.i18n.t("i18n:HEROAWAKE_TIP1"))
                }
            }
            else {
                this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_FIGHT);
            }
        }
    }

    //隐藏生存训练选择装备按钮
    refreshSurvivalEquitBtn() {
        let tem = cc.find('UI/EquipSelectBtn', this.node)
        if (tem) {
            //tem.active = false
            gdk.NodeTool.hide(tem);
        }
    }

    //刷新生存训练副本英雄列表红点
    refreshSurvivalHeroListRed() {
        if (this.heroListRed) {
            let stageCfg = this.model.stageConfig
            if (stageCfg.copy_id == CopyType.Survival && stageCfg.subtype == 1) {
                let copyModel = ModelManager.get(CopyModel)
                let datas: icmsg.SurvivalHeroesInfo[] = copyModel.survivalStateMsg.heroes
                this.heroListRed.active = datas.length < 9
            } else {
                this.heroListRed.active = false;
            }

        }
    }

    /**更新自走棋模式银币 段位 */
    updatePiecesChessScore() {
        let m = ModelManager.get(PiecesModel);
        let n = cc.find('Pvp/ui/arenaInfo/piecesInfo', this.node);
        n.active = true;
        cc.find('coinLab', n).getComponent(cc.Label).string = m.silver + '';
        let curC = m.divisionCfg;
        let nextC = ConfigManager.getItemByField(Pieces_divisionCfg, 'division', curC.division + 1, { type: curC.type });
        GlobalUtil.setSpriteIcon(this.node, cc.find('divisionIcon', n), `common/texture/pieces/${curC.icon}`);
        cc.find('divisionTitle', n).getComponent(cc.Label).string = curC.name;
        cc.find('progress/num', n).getComponent(cc.Label).string = `${m.score}/${nextC ? nextC.point : 99999}`;
        cc.find('progress/bar', n).width = nextC ? 113 * (m.score / nextC.point) : 113;
    }
}