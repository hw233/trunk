import {
    Copycup_rookieCfg, Copy_towerlistCfg, General_weaponCfg,
    Peak_globalCfg,
    Pieces_globalCfg,
    Royal_globalCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import ArenaHonorModel from '../../../../common/models/ArenaHonorModel';
import CopyModel from '../../../../common/models/CopyModel';
import GeneralModel from '../../../../common/models/GeneralModel';
import PiecesModel from '../../../../common/models/PiecesModel';
import RoleModel from '../../../../common/models/RoleModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import WorldHonorModel from '../../../../common/models/WorldHonorModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import MathUtil from '../../../../common/utils/MathUtil';
import GuardianTowerModel from '../../../act/model/GuardianTowerModel';
import PeakModel from '../../../act/model/PeakModel';
import AdventureModel from '../../../adventure/model/AdventureModel';
import NewAdventureModel from '../../../adventure2/model/NewAdventureModel';
import ArenaTeamViewModel from '../../../arenaTeam/model/ArenaTeamViewModel';
import ChampionModel from '../../../champion/model/ChampionModel';
import FootHoldModel from '../../../guild/ctrl/footHold/FootHoldModel';
import FootHoldUtils from '../../../guild/ctrl/footHold/FootHoldUtils';
import MilitaryRankUtils from '../../../guild/ctrl/militaryRank/MilitaryRankUtils';
import { MRPrivilegeType } from '../../../guild/ctrl/militaryRank/MilitaryRankViewCtrl';
import RelicModel from '../../../relic/model/RelicModel';
import VaultModel from '../../../vault/model/VaultModel';
import PveBuildTowerCtrl from '../../ctrl/fight/PveBuildTowerCtrl';
import PveGeneralCtrl from '../../ctrl/fight/PveGeneralCtrl';
import PveProtegeCtrl from '../../ctrl/fight/PveProtegeCtrl';
import PveSpawnCtrl from '../../ctrl/fight/PveSpawnCtrl';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveGeneralModel from '../../model/PveGeneralModel';
import PveProtegeModel from '../../model/PveProtegeModel';
import PveSpawnModel from '../../model/PveSpawnModel';
import PvePool from '../../utils/PvePool';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import { CopyType } from './../../../../common/models/CopyModel';

/**
 * PVE场景初始化
 * @Author: sthoo.huang
 * @Date: 2019-03-18 18:37:54
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-25 15:27:41
 */

@gdk.fsm.action("PveSceneInitAction", "Pve/Scene")
export default class PveSceneInitAction extends PveSceneBaseAction {

    waitTab = '__PveSceneInitAction__';
    tasks: Function[] = [];

    onEnter() {
        super.onEnter();

        // 初始化数据
        this.tasks.length = 0;
        this.model.timeScale = 1.0;
        this.model.tiled.reset();

        // 创建任务
        this.tasks.push(this.parseMap);
        this.tasks.push(this.createGeneral);
        this.tasks.push(this.createSpawns);
        this.tasks.push(this.createProteges);
        this.tasks.push(this.createTowers);
        this.tasks.push(this.scrollRight);
        this.tasks.push(this.finish);

        // 执行任务队列
        this.next();
    }

    onExit() {
        this.tasks.length = 0;
        // this.ctrl.root.y = -gdk.gui.guiLayer.y;
        this.ctrl.originalPos = this.ctrl.root.getPosition();
        if (this.ctrl.dropIconNode) {
            this.ctrl.dropIconNode.y = this.ctrl.thing.y + this.ctrl.root.y;
        }
        NetManager.targetOff(this)
        gdk.gui.hideWaiting(this.waitTab);
        gdk.Timer.clearAll(this);
        super.onExit();
    }

    next() {
        if (!cc.isValid(this.node)) return;
        if (!this.model) return;
        if (!this.ctrl) return;
        if (!this.tasks.length) return;
        let task = this.tasks.shift();
        let ret = task.call(this);
        if (ret instanceof Promise) {
            // 异步函数
            ret.then(
                () => {
                    // 成功
                    gdk.Timer.callLater(this, this.next);
                },
                () => {
                    // 出现异常
                    this.tryAgain();
                },
            );
        } else {
            // 同步函数
            gdk.Timer.callLater(this, this.next);
        }
    }

    // 初始化失败重试
    tryAgain() {
        CC_DEBUG && cc.error("场景初始化失败");
        this.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
    }

    /** 转换坐标点 */
    _getPoint(size: cc.Size, pt: any, offsetY: number = 0): cc.Vec2 {
        return cc.v2(
            Math.round(pt.x + pt.width / 2),
            Math.round(size.height - pt.y + pt.height / 2) + offsetY,
        );
    }

    // 解析tiledMap数据
    parseMap() {

        // 解析地图文件
        let file = this.model.tmxAsset;
        let texValues = file.textures;
        let texKeys = file.textureNames;
        let textures = {};
        for (let i = 0; i < texValues.length; ++i) {
            textures[texKeys[i]] = true; // texValues[i];
        }

        // let imageLayerTextures = {};
        // texValues = file.imageLayerTextures;
        // texKeys = file.imageLayerTextureNames;
        // for (let i = 0; i < texValues.length; ++i) {
        //     imageLayerTextures[texKeys[i]] = texValues[i];
        // }

        let tsxFileNames = file['tsxFileNames'];
        let tsxFiles = file['tsxFiles'];
        let tsxMap = {};
        for (let i = 0; i < tsxFileNames.length; ++i) {
            if (tsxFileNames[i].length > 0) {
                tsxMap[tsxFileNames[i]] = tsxFiles[i].text;
            }
        }

        let TMXMapInfo: any = cc['TMXMapInfo'];
        let tmxXmlStr = file['tmxXmlStr'].replace(/<imagelayer(([\s\S])*?)<\/imagelayer>/g, '');
        let mapInfo = new TMXMapInfo(tmxXmlStr, tsxMap, textures, {});
        let getObjectGroup = function (name: string) {
            for (let i = 0; i < mapInfo._objectGroups.length; i++) {
                let item = mapInfo._objectGroups[i];
                if (item.name == name) {
                    return item;
                }
            }
            return {};
        }

        // 设计坐标
        let offsetY: number = 0;
        let ms: cc.Size = mapInfo._mapSize;
        let ts: cc.Size = mapInfo._tileSize;
        let size: cc.Size = cc.size(ms.width * ts.width, ms.height * ts.height);

        // 初始化对象对择器
        this.model.fightSelector.initlize(size.width, size.height);

        // 解析路线
        let roads = this.model.tiled.roads = {};
        let lines = getObjectGroup("roads")._objects;
        for (let i = 0; i < lines.length; i++) {
            let mline: cc.Vec2[] = [];
            let line = lines[i];
            let name: string = line.name;
            let polylinePoints: any[] = line.polylinePoints;
            for (let j = 0, n = polylinePoints.length; j < n; j++) {
                let pt = polylinePoints[j];
                mline[j] = cc.v2(
                    Math.round(pt.x + line.x),
                    Math.round(size.height - (pt.y + line.y)),
                );
            }
            // 生成紧密的路径点
            let step = 10;
            let from = mline.shift();
            let road = [from.clone()];
            while (mline.length) {
                let to = mline.shift();
                while (true) {
                    let dis = MathUtil.distance(from, to);
                    let dx = (to.x - from.x) / dis * step;
                    let dy = (to.y - from.y) / dis * step;
                    if (Math.abs(to.x - from.x) > Math.ceil(Math.abs(dx)) ||
                        Math.abs(to.y - from.y) > Math.ceil(Math.abs(dy))) {
                        // 增加
                        from.x += dx;
                        from.y += dy;
                        road.push(from.clone());
                    } else {
                        // 到达
                        from = to;
                        road.push(from.clone());
                        break;
                    }
                }
            }
            // // 画路径点
            // let g = this.ctrl.floor.getComponent(cc.Graphics);
            // if (!g) {
            //     g = this.ctrl.floor.addComponent(cc.Graphics);
            //     g.fillColor = cc.color(0xff0000);
            //     road.forEach(p => {
            //         g.circle(p.x, p.y, 2);
            //         g.fill();
            //     });
            // }
            roads[name] = road;
        }

        // 怪物出生点坐标
        let spawns = this.model.tiled.spawns = {};
        let spawnPoints = getObjectGroup("spawns")._objects;
        for (let i = 0; i < spawnPoints.length; i++) {
            let pt = spawnPoints[i];
            let name = pt.name;
            let pos = this._getPoint(size, pt, offsetY);
            spawns[name] = pos;
            // 处理road，根据路径设置起点坐标
            let id = name.split('_').shift();
            let road = roads[id];
            if (!road) {
                cc.error('缺少路径：', id);
                roads[id] = [];
            } else {
                if (MathUtil.distance(road[0], pos) > MathUtil.distance(road[road.length - 1], pos)) {
                    // 离最后一点的距离更近，则反转数组
                    roads[id] = road.reverse();
                }
            }
        }

        // 传送门坐标
        let gates = this.model.tiled.gates = {};
        let gateGroup = getObjectGroup("gates");
        if (gateGroup) {
            let arr = gateGroup._objects;
            if (arr) {
                for (let i = 0; i < arr.length; i++) {
                    let pt = arr[i];
                    let name = pt.name;
                    gates[name] = this._getPoint(size, pt, offsetY);
                }
            }
        }

        // 防御塔位坐标点
        let towers = this.model.tiled.towers = {};
        let towerPoints = getObjectGroup("towers")._objects;
        for (let i = 0; i < towerPoints.length; i++) {
            let pt = towerPoints[i];
            let name = pt.name;
            towers[name] = this._getPoint(size, pt, offsetY);
        }

        // 被保护对象的坐标
        let proteges = this.model.tiled.proteges = [];
        let protegePoints = getObjectGroup("protege")._objects;
        for (let i = 0; i < protegePoints.length; i++) {
            let pt = protegePoints[i];
            proteges[i] = this._getPoint(size, pt, offsetY);
        }

        // 指挥官坐标
        let generalPoints = getObjectGroup("general")._objects;
        for (let i = 0; i < generalPoints.length; i++) {
            let pt = generalPoints[i];
            this.model.tiled.general = {
                name: pt.name,
                pos: this._getPoint(size, pt, offsetY),
            }
            break;
        }

        // // 挂机宝箱坐标
        // let hang = tmx.getObjectGroup("hang");
        // this.model.tiled.hang = null;
        // if (hang) {
        //     let hangPoints = hang.getObjects();
        //     for (let i = 0; i < hangPoints.length; i++) {
        //         let pt = hangPoints[i];
        //         this.model.tiled.hang = this._getPoint(size, pt, offsetY);
        //         break;
        //     }
        // }
    }

    // 创建怪物出生点
    createSpawns() {
        if (!cc.isValid(this.node)) return;
        let spawns = this.model.tiled.spawns;
        for (let key in spawns) {
            let pt: cc.Vec2 = spawns[key];
            let node: cc.Node = PvePool.get(this.ctrl.spawnPrefab);
            let ctrl: PveSpawnCtrl = node.getComponent(PveSpawnCtrl);
            ctrl.model = new PveSpawnModel();
            ctrl.model.id = key;
            ctrl.model.pos = pt;
            ctrl.model.road = this.model.tiled.roads[ctrl.model.index];
            ctrl.sceneModel = this.model;
            node.name = 'spawn_' + key;
            node.setPosition(pt);
            //出生点层级处理
            if (ctrl.model.config && cc.js.isNumber(ctrl.model.config.floor) && ctrl.model.config.floor == 1) {
                this.ctrl.floor.addChild(node, -1280);
            } else {
                this.ctrl.thing.addChild(node);
            }
            this.model.spawns.push(ctrl);
        }
    }

    // 创建被保护对象
    createProteges() {
        if (!cc.isValid(this.node)) return;
        let proteges = this.model.tiled.proteges;
        for (let i = 0; i < proteges.length; i++) {
            let pt: cc.Vec2 = proteges[i];
            let node: cc.Node = PvePool.get(this.ctrl.protegePrefab);
            let ctrl: PveProtegeCtrl = node.getComponent(PveProtegeCtrl);
            ctrl.model = new PveProtegeModel();
            ctrl.model.id = cc.js.isNumber(this.model.stageConfig.protegeId) ? this.model.stageConfig.protegeId : 1;//1;
            ctrl.sceneModel = this.model;
            //探险副本设置血量
            if (this.model.stageConfig.copy_id == CopyType.Adventure) {
                let advModel = ModelManager.get(AdventureModel)
                ctrl.model.hp = advModel.blood
            }

            // 据点战pvp----------------
            if (!this.model.isDemo && !this.model.isDefender && this.model.stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData && this.model.arenaSyncData.fightType == 'FOOTHOLD') {
                let fhModel = ModelManager.get(FootHoldModel)
                if (this.model.isMirror) {
                    let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(fhModel.pointDetailInfo.titleExp)
                    let cfgNum = MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p6, targetLv)
                    //基地等级
                    let pos = fhModel.pointDetailInfo.pos;
                    let guild = FootHoldUtils.findGuildByPos(pos.x, pos.y);
                    if (guild) {
                        cfgNum += FootHoldUtils.getPrivilegeCommon(MRPrivilegeType.p6, guild.level);
                    }
                    ctrl.model.hpMax += cfgNum
                    ctrl.model.hp = ctrl.model.hpMax
                } else {
                    let cfgNum = MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p6, fhModel.militaryRankLv) + FootHoldUtils.getPrivilegeCommon(MRPrivilegeType.p6, fhModel.baseLevel)
                    ctrl.model.hpMax += cfgNum
                    ctrl.model.hp = ctrl.model.hpMax
                }
            }

            //自走棋
            if (!this.model.isDemo && this.model.stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData && this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
                if (this.model.isMirror) {
                    let cfg = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'general_hp4');
                    ctrl.model.hpMax = cfg.value[0];
                    ctrl.model.hp = ctrl.model.hpMax;
                }
                else {
                    let cfg = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'general_hp2');
                    ctrl.model.hpMax = cfg.value[0];
                    ctrl.model.hp = ctrl.model.hpMax;
                }
            }
            //自走棋 无尽模式
            if (!this.model.isDemo && this.model.stageConfig.copy_id == CopyType.NONE && this.model.arenaSyncData && this.model.arenaSyncData.fightType == 'PIECES_ENDLESS') {
                if (this.model.isMirror) {
                    let cfg = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'general_hp3');
                    ctrl.model.hpMax = cfg.value[0];
                    ctrl.model.hp = ctrl.model.hpMax;
                }
                else {
                    let cfg = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'general_hp1');
                    ctrl.model.hpMax = cfg.value[0];
                    ctrl.model.hp = ModelManager.get(PiecesModel).startHp || ctrl.model.hpMax;
                }
            }

            node.name = "protege_" + i;
            node.setPosition(pt);
            this.ctrl.thing.addChild(node);
            this.model.proteges.push(ctrl);
        }
    }

    // 创建英雄塔基座
    createTowers() {
        if (!cc.isValid(this.node)) return;
        let max: number;
        if (this.model.isBounty) {
            // 赏金副本匹配求助方的上阵英雄数量
            max = this.model.bountyMission.heroList.length;
        } else {
            let copyId = this.model.stageConfig.copy_id;
            if (this.model.isDemo || copyId == CopyType.MAIN || copyId == CopyType.RookieCup || copyId == CopyType.Ultimate || (copyId == CopyType.Survival && this.model.stageConfig.subtype == 1)) {
                // 奖杯新手模式，不限制数量
                max = 100;
            } else {
                // 获取最大开启塔位数量
                let copyModel = ModelManager.get(CopyModel);
                let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
                    if (item.general_lv <= copyModel.lastCompleteStageId) {
                        return true;
                    }
                    return false;
                });
                let copyCfg = tems[tems.length - 1];
                max = copyCfg.num;
            }
        }
        let towers = this.model.tiled.towers;
        for (let key in towers) {
            let id = parseInt(key.substr(5));
            if (id > max) {
                // 不创建超出数量限制的塔位
                continue;
            }
            let pt = towers[key];
            let node: cc.Node = PvePool.get(this.ctrl.towerPrefab);
            let ctrl = node.getComponent(PveBuildTowerCtrl);
            ctrl.id = id;
            ctrl.sceneCtrl = this.ctrl;
            node.zIndex = Math.floor(-pt.y);
            node.name = key + '_build_tower';
            node.setPosition(pt);
            node.parent = this.ctrl.floor;
            this.model.towers.push(ctrl);
        }

        // // 生存训练特殊处理
        // let stage = this.model.stageConfig
        // if (stage && stage.copy_id == CopyType.Survival && copyCfg.num < 6) {
        //     for (let i = this.model.towers.length - 1; i >= 0; i--) {
        //         let ctrl = this.model.towers[i];
        //         if (ctrl.id == 5) {
        //             this.model.towers.splice(i, 1);
        //             PvePool.put(ctrl.node);
        //         }
        //     }
        // }

        // 对塔座进行排序
        GlobalUtil.sortArray(this.model.towers, (a, b) => {
            return a.id - b.id;
        });
    }

    // 创建指挥官
    createGeneral() {
        if (!cc.isValid(this.node)) return;
        if (this.model.stageConfig.copy_id == CopyType.RookieCup) {
            let temCfg = ConfigManager.getItemByField(Copycup_rookieCfg, 'stage_id', this.model.stageConfig.id);
            if (temCfg && temCfg.commander == 0) {

                return;
            }
        }
        let m: GeneralModel = ModelManager.get(GeneralModel);
        if (m.generalInfo &&
            this.model.tiled.general &&
            this.model.generals.length < 1) {
            // 有指挥官成长数据，地图中有出生点坐标，并且当前场景没有创建指挥官
            return new Promise((resolve, reject) => {
                gdk.gui.showWaiting(gdk.i18n.t("i18n:LOADING_STRING"), this.waitTab, null, null, null, 2);
                // 查询指挥官数据返回回调
                let cb = (info: icmsg.FightGeneral) => {
                    if (!info) {
                        // 没有指挥官属性
                        resolve('OK');
                        return;
                    }
                    let node: cc.Node = PvePool.get(this.ctrl.generalPrefab);
                    let general: PveGeneralCtrl = node.getComponent(PveGeneralCtrl);
                    general.model = new PveGeneralModel();
                    general.model.id = info.level;
                    general.model.ctrl = general;
                    general.model.info = info;
                    general.model.orignalPos = this.model.tiled.general.pos;
                    general.sceneModel = this.model;
                    general.node.name = 'general_0';
                    general.node.setPosition(general.model.orignalPos);
                    this.model.addFight(general);
                    this.createWeapon(info);    // 创建神器指挥官
                    this.model.generals = this.model.generals;  // 触发绑定更新事件
                    resolve('OK');
                };
                if (this.model.isBounty) {
                    // 赏金
                    let smsg = new icmsg.BountyFightQueryReq();
                    smsg.missionId = this.model.bountyMission.missionId;
                    smsg.general = true;
                    NetManager.send(smsg, (rmsg: icmsg.BountyFightQueryRsp) => {
                        if (!cc.isValid(this.node)) {
                            reject('ERROR');
                            return;
                        }
                        cb(rmsg.general);
                    }, this);
                    return;
                }
                if (this.model.stageConfig.copy_id == CopyType.NewAdventure) {
                    // 赏金
                    let advModel = ModelManager.get(NewAdventureModel)
                    if (advModel.copyType == 0) {
                        let smsg = new icmsg.Adventure2EnterReq();
                        let selectIndex = advModel.normal_selectIndex;
                        let difficulty = advModel.difficulty;
                        smsg.plateIndex = selectIndex
                        smsg.difficulty = difficulty
                        NetManager.send(smsg, (rmsg: icmsg.Adventure2EnterRsp) => {
                            if (!cc.isValid(this.node)) {
                                reject('ERROR');
                                return;
                            }
                            advModel.normalFightHeroList = rmsg.heroes.heroList;
                            cb(rmsg.heroes.general);
                        }, this);
                        return;
                    }
                }
                if (this.model.stageConfig.copy_id == CopyType.NONE && this.model.isMirror) {
                    // 竞技场镜像战斗

                    if (this.model.arenaSyncData.fightType == 'CHAMPION_GUESS' &&
                        this.model.championGuessFightInfos &&
                        this.model.championGuessFightInfos.length == 2
                    ) {
                        cb(this.model.championGuessFightInfos[1].general);
                        return;
                    }

                    if (this.model.arenaSyncData.fightType == 'CHAMPION_MATCH') {
                        let cM = ModelManager.get(ChampionModel);
                        if (cM.championFightData && cM.championFightData.general) {
                            cb(cM.championFightData.general);
                            return;
                        }
                    }
                    if (this.model.arenaSyncData.fightType == 'ROYAL') {
                        let rM = ModelManager.get(RoyalModel);
                        if (rM.defendPlayerFightData && rM.defendPlayerFightData.general) {
                            cb(rM.defendPlayerFightData.general);
                            return;
                        }
                    }
                    if (this.model.arenaDefenderHeroList &&
                        this.model.arenaDefenderHeroList.length > 0 &&
                        this.model.arenaDefenderGeneral &&
                        this.model.arenaSyncData.fightType != 'ARENATEAM'
                    ) {
                        cb(this.model.arenaDefenderGeneral);
                        return;
                    }

                    // 没有现成的数据，则向服务端发送请求
                    switch (this.model.arenaSyncData.fightType) {
                        case 'ARENA': {
                            // 竞技场
                            let smsg = new icmsg.ArenaPrepareReq();
                            smsg.playerId = this.model.arenaSyncData.args[0];
                            NetManager.send(smsg, (rmsg: icmsg.ArenaPrepareRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                this.model.arenaDefenderHeroList = rmsg.defender.heroList;
                                this.model.arenaDefenderGeneral = rmsg.defender.general;
                                cb(this.model.arenaDefenderGeneral);
                            }, this);
                            break;
                        }
                        case 'FOOTHOLD': {
                            // 公会争夺已被占领位置
                            let smsg = new icmsg.FootholdFightStartReq();
                            smsg.warId = this.model.arenaSyncData.args[0];
                            smsg.pos = this.model.arenaSyncData.args[1];
                            smsg.pveId = 0;
                            NetManager.send(smsg, (rmsg: icmsg.FootholdFightStartRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                this.model.arenaDefenderHeroList = rmsg.heroList;
                                this.model.arenaDefenderGeneral = rmsg.general;
                                cb(this.model.arenaDefenderGeneral);
                            });
                            break;
                        }
                        case 'CHAMPION_GUESS': {
                            //锦标赛-竞猜
                            let cM = ModelManager.get(ChampionModel);
                            let req = new icmsg.ChampionGuessFightReq();
                            req.index = cM.guessIndex;
                            NetManager.send(req, (rmsg: icmsg.ChampionGuessFightRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                let arr = [rmsg.p1, rmsg.p2];
                                if (arr[0].playerId != cM.guessList[cM.guessIndex].playerId) arr = arr.reverse();
                                this.model.championGuessFightInfos = arr;
                                cb(rmsg.p2.general);
                            });
                            break;
                        }
                        case 'CHAMPION_MATCH': {
                            //锦标赛
                            let cM = ModelManager.get(ChampionModel);
                            let req = new icmsg.ChampionFightStartReq();
                            NetManager.send(req, (rmsg: icmsg.ChampionFightStartRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                cM.championFightData = rmsg
                                this.model.arenaDefenderHeroList = rmsg.heroList;
                                this.model.arenaDefenderGeneral = rmsg.general;
                                cb(rmsg.general);
                            });
                            break;
                        }
                        case 'RELIC': {
                            // 战争遗迹据点抢夺
                            let smsg = new icmsg.RelicFightStartReq();
                            smsg.mapType = parseInt(ModelManager.get(RelicModel).curAtkCity.split('-')[0]);
                            smsg.pointId = parseInt(ModelManager.get(RelicModel).curAtkCity.split('-')[1]);
                            NetManager.send(smsg, (rmsg: icmsg.RelicFightStartRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                this.model.arenaDefenderHeroList = rmsg.heroList;
                                this.model.arenaDefenderGeneral = rmsg.general;
                                cb(this.model.arenaDefenderGeneral);
                            });
                            break;
                        }
                        case 'VAULT': {
                            // 殿堂指挥官
                            let vaultModel = ModelManager.get(VaultModel)
                            this.model.arenaDefenderHeroList = vaultModel.heroList;
                            this.model.arenaDefenderGeneral = vaultModel.general;
                            cb(this.model.arenaDefenderGeneral);
                            break;
                        }
                        case 'ENDRUIN': {
                            //末日废墟
                            let copyModel = ModelManager.get(CopyModel);
                            let req = new icmsg.FightQueryReq();
                            req.playerId = copyModel.endRuinPvpChapterInfo.player.id;
                            //req.isTower = false;
                            NetManager.send(req, (rmsg: icmsg.FightQueryRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                this.model.arenaDefenderHeroList = rmsg.heroList;
                                this.model.arenaDefenderGeneral = rmsg.general;
                                cb(rmsg.general);
                            });
                            break;
                        }
                        case 'ARENATEAM': {
                            //组队竞技场
                            let atM = ModelManager.get(ArenaTeamViewModel);
                            let req = new icmsg.ArenaTeamFightStartReq();
                            req.index = atM.fightNum;
                            //this.model.state = PveSceneState.Ready;
                            //req.isTower = false;
                            NetManager.send(req, (rmsg: icmsg.ArenaTeamFightStartRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                this.model.arenaDefenderHeroList = rmsg.opponent.heroList;
                                this.model.arenaDefenderGeneral = rmsg.opponent.general;
                                cb(rmsg.opponent.general);
                            });
                            break;
                        }
                        case 'PEAK': {
                            //巅峰之战
                            let peakModel = ModelManager.get(PeakModel);
                            let req = new icmsg.PeakFightReq();
                            NetManager.send(req, (rmsg: icmsg.PeakFightRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                //peakModel.peakFightData = rmsg;
                                this.model.arenaDefenderHeroList = rmsg.enemy.heroList;
                                let level = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'commander_level').value[0]
                                this.model.arenaDefenderGeneral = HeroUtils.createFightGeneralData(level);//rmsg.enemy.general;
                                cb(this.model.arenaDefenderGeneral);
                            });
                            break;
                        }
                        case 'FOOTHOLD_GATHER': {
                            //据点集结战斗
                            let fhModel = ModelManager.get(FootHoldModel)
                            let index = fhModel.gatherFightOpponetnsIndex
                            this.model.arenaDefenderHeroList = fhModel.gatherOpponents[index].heroList
                            this.model.arenaDefenderGeneral = fhModel.gatherOpponents[index].general
                            cb(this.model.arenaDefenderGeneral);
                            break
                        }
                        case 'GUARDIANTOWER': {
                            let gtModel = ModelManager.get(GuardianTowerModel);
                            let req = new icmsg.GuardianTowerEnterReq();
                            req.stageId = gtModel.curCfg.id
                            NetManager.send(req, (rmsg: icmsg.GuardianTowerEnterRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                //peakModel.peakFightData = rmsg;
                                this.model.arenaDefenderHeroList = rmsg.enemy.heroList;
                                //let level = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'commander_level').value[0]
                                this.model.arenaDefenderGeneral = rmsg.enemy.general;//HeroUtils.createFightGeneralData(level);//rmsg.enemy.general;
                                cb(this.model.arenaDefenderGeneral);
                            });
                            break
                        }
                        case 'PIECES_CHESS': {
                            let pModel = ModelManager.get(PiecesModel);
                            let req = new icmsg.PiecesBattleArrayReq();
                            req.type = pModel.curModel;
                            NetManager.send(req, (rmsg: icmsg.PiecesBattleArrayRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                this.model.piecesFightInfos = [rmsg.p1, rmsg.p2];
                                cb(HeroUtils.creatdGodGeneralData());
                            });
                            break;
                        }
                        case 'PIECES_ENDLESS': {
                            let pModel = ModelManager.get(PiecesModel);
                            let req = new icmsg.PiecesBattleArrayReq();
                            req.type = pModel.curModel;
                            NetManager.send(req, (rmsg: icmsg.PiecesBattleArrayRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                this.model.piecesFightInfos = [rmsg.p1];
                                cb(HeroUtils.creatdGodGeneralData());
                            });
                            break;
                        }
                        case 'ARENAHONOR_GUESS': {
                            //锦标赛-竞猜
                            let cM = ModelManager.get(ArenaHonorModel);
                            let rM = ModelManager.get(RoleModel);
                            let playerId1 = rM.id == cM.guessInfo.players[1].id ? cM.guessInfo.players[1].id : cM.guessInfo.players[0].id;
                            let playerId2 = rM.id == cM.guessInfo.players[1].id ? cM.guessInfo.players[0].id : cM.guessInfo.players[1].id;
                            let req = new icmsg.FightDefendReq();
                            req.playerIds = [playerId1, playerId2];
                            req.arrayType = 7;
                            NetManager.send(req, (rmsg: icmsg.FightDefendRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                if (rmsg.player[0].playerId == playerId1) {
                                    cM.player1Fight = rmsg.player[0];
                                }
                                if (rmsg.player[1].playerId == playerId2) {
                                    cM.player2Fight = rmsg.player[1];
                                    cb(rmsg.player[1].general);
                                }
                            });
                            break;
                        }
                        case 'WORLDHONOR_GUESS': {
                            //锦标赛-竞猜
                            let cM = ModelManager.get(WorldHonorModel);
                            let rM = ModelManager.get(RoleModel);
                            let playerId1 = rM.id == cM.guessInfo.players[1].id ? cM.guessInfo.players[1].id : cM.guessInfo.players[0].id;
                            let playerId2 = rM.id == cM.guessInfo.players[1].id ? cM.guessInfo.players[0].id : cM.guessInfo.players[1].id;
                            let req = new icmsg.FightDefendReq();
                            req.playerIds = [playerId1, playerId2];
                            req.arrayType = 7;
                            NetManager.send(req, (rmsg: icmsg.FightDefendRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                if (rmsg.player[0].playerId == playerId1) {
                                    cM.player1Fight = rmsg.player[0];
                                }
                                if (rmsg.player[1].playerId == playerId2) {
                                    cM.player2Fight = rmsg.player[1];
                                    cb(rmsg.player[1].general);
                                }
                            });
                            break;
                        }
                        case 'ROYAL': {
                            //皇家竞技场

                            let rM = ModelManager.get(RoyalModel);
                            let req = new icmsg.RoyalFightStartReq();

                            NetManager.send(req, (rmsg: icmsg.RoyalFightStartRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject();
                                    return;
                                }
                                rM.enterNum = rmsg.enterNum;
                                rM.defendPlayerFightData = rmsg;
                                if (!rmsg.general) {
                                    let level = ConfigManager.getItemByField(Royal_globalCfg, 'key', 'commander').value[0]
                                    rmsg.general = HeroUtils.createFightGeneralData(level)
                                }

                                cb(rmsg.general);
                            });
                            break;
                        }
                        case 'ROYAL_TEST': {
                            let rM = ModelManager.get(RoyalModel);
                            if (!rM.testGeneral) {
                                let level = ConfigManager.getItemByField(Royal_globalCfg, 'key', 'commander').value[0]
                                rM.testGeneral = HeroUtils.createFightGeneralData(level)
                            }
                            cb(rM.testGeneral);
                            break;
                        }
                    }
                    return;
                }
                if (this.model.arenaSyncData &&
                    !this.model.isMirror && !this.model.isDefender) {
                    if (this.model.arenaSyncData.fightType == 'CHAMPION_GUESS') {
                        if (this.model.championGuessFightInfos &&
                            this.model.championGuessFightInfos.length == 2) {
                            cb(this.model.championGuessFightInfos[0].general);
                        }
                        else {
                            let cM = ModelManager.get(ChampionModel);
                            let req = new icmsg.ChampionGuessFightReq();
                            req.index = cM.guessIndex;
                            NetManager.send(req, (rmsg: icmsg.ChampionGuessFightRsp) => {
                                if (!cc.isValid(this.node)) {
                                    reject('ERROR');
                                    return;
                                }
                                let arr = [rmsg.p1, rmsg.p2];
                                if (arr[0].playerId != cM.guessList[cM.guessIndex].playerId) arr = arr.reverse();
                                this.model.championGuessFightInfos = arr;
                                cb(rmsg.p1.general);
                            });
                        }
                        return
                    } else if (this.model.arenaSyncData.fightType == 'ARENATEAM') {
                        //组队竞技场
                        let atM = ModelManager.get(ArenaTeamViewModel);
                        let req = new icmsg.ArenaTeamFightStartReq();
                        req.index = atM.fightNum;
                        //req.isTower = false;
                        NetManager.send(req, (rmsg: icmsg.ArenaTeamFightStartRsp) => {
                            if (!cc.isValid(this.node)) {
                                reject();
                                return;
                            }
                            atM.arenaHeroList = rmsg.teammate.heroList;
                            atM.arenaGeneral = rmsg.teammate.general;
                            cb(rmsg.teammate.general);
                        });
                        return
                    } else if (this.model.arenaSyncData.fightType == 'PEAK') {
                        //巅峰之战
                        let peakModel = ModelManager.get(PeakModel);
                        let req = new icmsg.PeakFightReq();
                        NetManager.send(req, (rmsg: icmsg.PeakFightRsp) => {
                            if (!cc.isValid(this.node)) {
                                reject();
                                return;
                            }
                            peakModel.arenaHeroList = rmsg.mine.heroList;
                            let level = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'commander_level').value[0]
                            peakModel.arenaGeneral = HeroUtils.createFightGeneralData(level);//rmsg.mine.general;
                            cb(peakModel.arenaGeneral);
                        });
                        return
                    } else if (this.model.arenaSyncData.fightType == 'FOOTHOLD_GATHER') {
                        //据点集结战斗
                        let fhModel = ModelManager.get(FootHoldModel)
                        let index = fhModel.gatherFightTeamMatesIndex
                        cb(fhModel.gatherTeamMates[index].general);
                        return
                    } else if (this.model.arenaSyncData.fightType == 'PIECES_CHESS') {
                        //末日自走棋
                        let pModel = ModelManager.get(PiecesModel);
                        let req = new icmsg.PiecesBattleArrayReq();
                        req.type = pModel.curModel;
                        NetManager.send(req, (rmsg: icmsg.PiecesBattleArrayRsp) => {
                            if (!cc.isValid(this.node)) {
                                reject();
                                return;
                            }
                            this.model.piecesFightInfos = [rmsg.p1, rmsg.p2];
                            cb(HeroUtils.createFightGeneralData(160));
                        });
                        return
                    } else if (this.model.arenaSyncData.fightType == 'ARENAHONOR_GUESS') {
                        let cM = ModelManager.get(ArenaHonorModel);
                        let rM = ModelManager.get(RoleModel);
                        let playerId1 = rM.id == cM.guessInfo.players[1].id ? cM.guessInfo.players[1].id : cM.guessInfo.players[0].id;
                        let playerId2 = rM.id == cM.guessInfo.players[1].id ? cM.guessInfo.players[0].id : cM.guessInfo.players[1].id;
                        let req = new icmsg.FightDefendReq();
                        req.playerIds = [playerId1, playerId2];
                        req.arrayType = 7;
                        NetManager.send(req, (rmsg: icmsg.FightDefendRsp) => {
                            if (!cc.isValid(this.node)) {
                                reject();
                                return;
                            }
                            if (rmsg.player[1].playerId == playerId2) {
                                cM.player2Fight = rmsg.player[1];
                            }
                            if (rmsg.player[0].playerId == playerId1) {
                                cM.player1Fight = rmsg.player[0];
                                cb(rmsg.player[0].general);
                            }
                        });
                        return
                    } else if (this.model.arenaSyncData.fightType == 'WORLDHONOR_GUESS') {
                        let cM = ModelManager.get(WorldHonorModel);
                        let rM = ModelManager.get(RoleModel);
                        let playerId1 = rM.id == cM.guessInfo.players[1].id ? cM.guessInfo.players[1].id : cM.guessInfo.players[0].id;
                        let playerId2 = rM.id == cM.guessInfo.players[1].id ? cM.guessInfo.players[0].id : cM.guessInfo.players[1].id;
                        let req = new icmsg.FightDefendReq();
                        req.playerIds = [playerId1, playerId2];
                        req.arrayType = 7;
                        NetManager.send(req, (rmsg: icmsg.FightDefendRsp) => {
                            if (!cc.isValid(this.node)) {
                                reject();
                                return;
                            }
                            if (rmsg.player[1].playerId == playerId2) {
                                cM.player2Fight = rmsg.player[1];
                            }
                            if (rmsg.player[0].playerId == playerId1) {
                                cM.player1Fight = rmsg.player[0];
                                cb(rmsg.player[0].general);
                            }
                        });
                        return
                    }
                }
                HeroUtils.getFightHeroInfo(null, true, (arr) => {
                    if (!cc.isValid(this.node)) {
                        reject('ERROR');
                        return;
                    }
                    cb(arr[0] as icmsg.FightGeneral);
                });
            });
        } else if (m.generalInfo && !this.model.tiled.general) {
            return new Promise((resolve, reject) => {
                gdk.gui.showWaiting(gdk.i18n.t("i18n:LOADING_STRING"), this.waitTab, null, null, null, 2);
                // 查询指挥官数据返回回调
                let cb = (info: icmsg.FightGeneral) => {
                    this.createWeapon(info);    // 创建神器指挥官
                    this.model.generals = this.model.generals;  // 触发绑定更新事件
                    resolve('OK');
                };
                HeroUtils.getFightHeroInfo(null, true, (arr) => {
                    if (!cc.isValid(this.node)) {
                        reject('ERROR');
                        return;
                    }
                    cb(arr[0] as icmsg.FightGeneral);
                });
            });
        }
    }

    createWeapon(info: icmsg.FightGeneral) {
        // 竞技和奖杯副本不创建神器
        let copy_id = this.model.stageConfig.copy_id;
        if (copy_id == CopyType.NONE ||
            copy_id == CopyType.ChallengeCup ||
            copy_id == CopyType.RookieCup
        ) {
            return;
        }
        // 创建神器指挥官
        let temInfo = new icmsg.FightGeneral();
        temInfo.weaponId = info.weaponId;
        temInfo.atk = info.atk;
        temInfo.energyCharge = info.energyCharge;
        let temSkill = [];
        let skill = new icmsg.FightSkill();
        let cfg = ConfigManager.getItemByField(General_weaponCfg, 'artifactid', info.weaponId);
        skill.skillId = cfg.skill == '' || cfg.skill == 0 ? 311 : cfg.skill;
        skill.skillLv = 1;
        temSkill.push(skill);
        temInfo.skills = temSkill;
        let node1: cc.Node = PvePool.get(this.ctrl.generalPrefab);
        let general1: PveGeneralCtrl = node1.getComponent(PveGeneralCtrl);
        general1.model = new PveGeneralModel();
        general1.model.id = info.level;
        general1.model.ctrl = general1;
        general1.model.info = temInfo;
        general1.model.orignalPos = cc.v2(90, 810);//this.model.tiled.general.pos;
        general1.sceneModel = this.model;
        general1.node.name = 'general_1';
        //general1.spine.node.active = false;
        general1.node.setPosition(general1.model.orignalPos);
        this.model.addFight(general1);
    }

    // 需要滚动时，则自动滚动到最右边
    scrollRight() {
        if (!cc.isValid(this.node)) return;
        if (!this.model || this.model.isDemo) return;
        if (!this.ctrl) return;
        if (!this.ctrl.scrollView) return;
        if (!this.ctrl.scrollView.enabled) return;
        return new Promise((resolve, reject) => {
            let scrollView = this.ctrl.scrollView;
            scrollView.stopAutoScroll();
            scrollView.scrollToLeft(0.5, true);
            gdk.Timer.once(550, this, () => {
                scrollView.stopAutoScroll();
                scrollView.scrollToRight(1.0, true);
                gdk.Timer.once(1050, this, () => {
                    scrollView.stopAutoScroll();
                    resolve('OK');
                });
            });
        });
    }
}