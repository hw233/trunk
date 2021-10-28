import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import HeroModel from '../../../common/models/HeroModel';
import PiecesModel from '../../../common/models/PiecesModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import FightingMath from '../../../common/utils/FightingMath';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import MathUtil from '../../../common/utils/MathUtil';
import StringUtils from '../../../common/utils/StringUtils';
import GuardianTowerModel from '../../act/model/GuardianTowerModel';
import PeakModel from '../../act/model/PeakModel';
import NewAdventureModel from '../../adventure2/model/NewAdventureModel';
import ExpeditionUtils from '../../guild/ctrl/expedition/ExpeditionUtils';
import { ParseMainLineId } from '../../instance/utils/InstanceUtil';
import { PveFightCtrl } from '../core/PveFightCtrl';
import PveBaseFightCtrl from '../ctrl/fight/PveBaseFightCtrl';
import PveBuildTowerCtrl from '../ctrl/fight/PveBuildTowerCtrl';
import PveCalledCtrl from '../ctrl/fight/PveCalledCtrl';
import PveEnemyCtrl from '../ctrl/fight/PveEnemyCtrl';
import PveGateCtrl from '../ctrl/fight/PveGateCtrl';
import PveGeneralCtrl from '../ctrl/fight/PveGeneralCtrl';
import PveGuardCtrl from '../ctrl/fight/PveGuardCtrl';
import PveHeroCtrl from '../ctrl/fight/PveHeroCtrl';
import PveProtegeCtrl from '../ctrl/fight/PveProtegeCtrl';
import PveSoldierCtrl from '../ctrl/fight/PveSoldierCtrl';
import PveSpawnCtrl from '../ctrl/fight/PveSpawnCtrl';
import PveTrapCtrl from '../ctrl/fight/PveTrapCtrl';
import PveSceneCtrl from '../ctrl/PveSceneCtrl';
import PveBaseSkillCtrl from '../ctrl/skill/PveBaseSkillCtrl';
import PveFsmEventId from '../enum/PveFsmEventId';
import PveSceneState from '../enum/PveSceneState';
import PveBattleInfoUtil from '../utils/PveBattleInfoUtil';
import PveEliteStageUtil from '../utils/PveEliteStageUtil';
import PveFightSelector from '../utils/PveFightSelector';
import { PveGateConditionUtil } from '../utils/PveGateConditionUtil';
import PveRoadUtil from '../utils/PveRoadUtil';
import {
    CommonCfg,
    Copy_stageCfg,
    MonsterCfg,
    Pve_bornCfg,
    Pve_demoCfg,
    Pve_mainCfg
} from './../../../a/config';
import { CopyType } from './../../../common/models/CopyModel';
import { PveFightType } from './../core/PveFightModel';
import PveSkillModel from './PveSkillModel';


/**
 * PVE场景数据模型类
 * @Author: sthoo.huang
 * @Date: 2019-03-18 13:51:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-26 21:33:28
 */

export class PveRoadInfo {
    proteges: cc.Vec2[] = null;   // 被保护对象的坐标
    spawns: { [name: string]: cc.Vec2 } = null;   // 怪物出生点坐标
    gates: { [name: string]: cc.Vec2 } = null;  // 传送门对象的坐标
    towers: { [name: string]: cc.Vec2 } = null;   // 防御塔位坐标点
    roads: { [name: string]: cc.Vec2[] } = null;    // 怪物行走路线
    general: { name: string, pos: cc.Vec2 } = null;    // 指挥官坐标
    // hang: cc.Vec2 = null;   // 挂机宝箱坐标

    reset() {
        cc.js.clear(this.roadsLenTemp);
        this.proteges = null;
        this.spawns = null;
        this.towers = null;
        this.roads = null;
        this.general = null;
    }

    /** 获取路径长度 */
    private roadsLenTemp: any = {};
    getRoadLen(index: number): number {
        let r = this.roadsLenTemp[index];
        if (!r) {
            let a = this.roads[index];
            if (a) {
                r = this.roadsLenTemp[index] = PveRoadUtil.getDistance(a);
            } else {
                r = 0;
            }
        }
        return r;
    }
}

export class WaveEnemyInfo {
    time: number = 0;
    enemyId: number = 0;
    spawn: number = 0;
    num: number = 0;
    wait: number = 0;
    wait_delay: number = 0;
    born_animation: string = null;
}

export interface HeroMap {
    [id: number]: icmsg.FightHero
}

export interface SoldierMap {
    [id: number]: icmsg.FightSoldier;
}

export interface ArenaSyncData {
    args: any[];                        // 外部参数
    defenderName: string;               // 竞技场对手名字
    fightType: 'FOOTHOLD' | 'ARENA' | 'CHAMPION_GUESS' | 'CHAMPION_MATCH' | 'RELIC' | 'VAULT' | 'ENDRUIN' | 'ARENATEAM' | 'PEAK' | 'FOOTHOLD_GATHER' | 'GUARDIANTOWER' | 'PIECES_CHESS' | 'PIECES_ENDLESS' | 'ARENAHONOR_GUESS' | 'WORLDHONOR_GUESS' | 'ROYAL' | 'ROYAL_TEST';    // 竞技战斗类型

    pwoer?: number,                      // 竞技场上阵英雄平均战力
    waveTimeOut?: number,                // 竞技场下一波超时时间

    bossId?: number,                     // 竞技场将要刷新的BOSS配置ID
    bossEnemyId?: number,                // 最后刷出的BOSS怪物ID
    bossTimeOut?: number,                // 竞技场BOSS倒计时

    mainModel?: PveSceneModel,           // 主战斗数据
    mirrorModel?: PveSceneModel,         // 镜像战斗数据
}

export default class PveSceneModel {

    ctrl: PveSceneCtrl;
    node: cc.Node;
    stageConfig: Copy_stageCfg; // 关卡静态配置
    config: Pve_mainCfg;    //静态配置 
    enemyCfg: Pve_bornCfg[];    // 刷怪波次配置 
    tmxAsset: cc.TiledMapAsset;
    tiled: PveRoadInfo = new PveRoadInfo(); // 场景配置数据
    curEnemies: WaveEnemyInfo[] = [];   // 当前波次刷怪列表
    state: PveSceneState = PveSceneState.Loading;
    energy: number = 0;  // 能量值，指挥官技能使用
    killedEnemy: number = 0;    // 杀敌数
    createdEnemy: number = 0;    // 召唤的怪物数量（怪物死亡或技能召唤新的怪物）
    arrivalEnemy: number = 0;    // 跑掉的敌人
    maxEnemy: number = 0;   // 最大敌人数量
    proteges: PveProtegeCtrl[] = [];   // 被保护对象
    towers: PveBuildTowerCtrl[] = [];  // 英雄塔座列表
    heros: PveHeroCtrl[] = []; // 英雄列表
    generals: PveGeneralCtrl[] = [];    // 指挥官列表
    soldiers: PveSoldierCtrl[] = [];    // 小兵和守卫列表
    spawns: PveSpawnCtrl[] = [];   // 出生点列表
    enemies: PveEnemyCtrl[] = [];  // 怪物列表
    calleds: PveCalledCtrl[] = [];   // 召唤物列表
    traps: PveTrapCtrl[] = [];   // 陷阱列表
    gates: PveGateCtrl[] = [];  // 传送阵列表
    skills: PveBaseSkillCtrl[] = [];   // 技能列表
    manualSkill: PveSkillModel;  // 当前的手动技能
    specialEnemies: PveEnemyCtrl[] = [];  // 不计数怪物列表
    heroMap: HeroMap = {};  // 上阵英雄属性
    totalPower: number = 0; // 上阵英雄总战力
    moneyNum: number = 0;   // 击杀怪物获得的金币
    enemyRewardData: { [enemy_id: number]: { [type: number]: number }[] } = {}   // 首通随机怪物掉落物品数据
    killEnemyDrop: { [type: number]: number } = {};    // 击杀怪物掉落表

    frameId: number = 0; // 游戏帧，每调用一次updateScript加1
    time: number = 0;   // 游戏时间，每次调用updateScript时增加固定长度
    realTime: number = 0;   // 真实时间，游戏开始为0
    waveTime: number = 0;    // 刷怪时间，开始一个波次时为0
    timeScale: number = 1.0;
    wave: number = 0;      // 当前波次
    realWave: number = 0;    // 真实波次

    showAtkDis: boolean = false;    //是否显示英雄的攻击范围
    showHeroEffect: boolean = true; // 显示英雄出现特效

    isDemo: boolean = false;    // 是否为演示
    isReplay: boolean = false;   // 是否为回放
    isDefender: boolean = false;   // 是否为防御界面
    seed: number;    // 随机种子
    actions: any[];  // 记录，指挥官技能，[[frameId, skill_id, pos_x, pos_y, energy]]
    enemyBorns: any[];  // 记录，怪物出生 [[frameId, enemyId, spawn, num, wait, wait_delay, born_animation]]
    minPower: number = 1;    // 最低通关战力

    isBounty: boolean = false;  // 是否为赏金任务
    bountyMission: icmsg.BountyMission;// 赏金任务数据

    bossCommingIdx: { [monster_id: number]: boolean } = {}; // 记录monster是否已经弹出过来袭警告
    showMiniChat: boolean = true //是否显示mini聊天
    footholdBossHurt: number = 0
    guildBossHurt: number = 0; //挑战公会boss的单次伤害

    RuneMonsters: icmsg.Monster[] = [];

    isMirror: boolean = false;                  // 是否为镜像战斗
    arenaDefenderHeroList: icmsg.FightHero[] = null;  // 竞技场对手英雄属性列表
    arenaDefenderGeneral: icmsg.FightGeneral = null;  // 竞技场对手指挥官属性
    arenaEnemies: WaveEnemyInfo[] = null;       // 竞技场刷怪列表
    arenaSyncData: ArenaSyncData = null;        // 竞技场同步共享的数据（共享)
    championGuessFightInfos: icmsg.FightQueryRsp[] = null; // 锦标赛竞猜-双方玩家的英雄/指挥官数据
    //arenaHonorGuessFightInfos: icmsg.FightQueryRsp[] = null; // 荣耀巅峰赛竞猜-双方玩家的英雄/指挥官数据
    piecesFightInfos: icmsg.FightQueryRsp[] = null; // 末日自走棋-双方玩家的英雄/指挥官数据 [电脑,我方]
    waveBeginning: boolean;                         // 竞技场刷怪中

    eliteStageUtil: PveEliteStageUtil;      // 词条实例
    fightSelector: PveFightSelector;        // 选择器实例
    battleInfoUtil: PveBattleInfoUtil;      // 战斗伤害等信息实例
    gateconditionUtil: PveGateConditionUtil;    //实战演练通关词条演练

    // 英雄试炼造成的怪物伤害记录
    allEnemyHurtNum: number = 0;
    stageAllEnemyHpNum: number = 0;

    // 当前波种种怪物被击杀数量
    killedEnemyDic: { [enemy_id: number]: number } = null;

    //刷新当前pvp头像信息
    refreshArenaInfo: boolean = false

    //防御类型
    defendType: number = 0;

    pvpRivalPlayerId: number = 0// pvp战斗对方玩家id

    /** 关卡序列号 */
    _id: number;
    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this.stageConfig = CopyUtil.getStageConfig(v);
        if (this.isDemo) {
            // 演示模式
            this.config = ConfigManager.getItemById(Pve_demoCfg, ParseMainLineId(v, CopyType.MAIN)) as Pve_mainCfg;
            if (!this.config) {
                // 找不到对应的配置，则直接使用挂机关卡对应的配置
                this.config = ConfigManager.getItemById(Pve_mainCfg, this.stageConfig.born);
            }
        } else {
            // 正式或回放战斗
            this.config = ConfigManager.getItemById(Pve_mainCfg, this.stageConfig.born);
        }

        // 更新标题栏
        if (!this.isReplay && this.ctrl && !this.isMirror) {
            if (this.stageConfig.copy_id == CopyType.NONE && this.arenaSyncData) {
                // 竞技场
                this.ctrl.title = StringUtils.format(gdk.i18n.t('i18n:ARENA_TITLE'), this.arenaSyncData.defenderName);
            } else {
                // 普通
                this.ctrl.title = this.stageConfig.name;
            }
        }

        // 重置数值
        this.initEnemies();
        this.killedEnemy = 0;
        this.createdEnemy = 0;
        this.arrivalEnemy = 0;
        this.moneyNum = 0;
        this.realTime = 0;
        this.frameId = 0;
        this.time = 0;
        this.waveTime = 0;
        this.setWaveBy(0, {}, 'set');
        this.seed = FightingMath.init(this.seed);
        this.actions = [];
        this.enemyBorns = [];
        this.manualSkill = null;
        this.bossCommingIdx = {};
        this.RuneMonsters = []
        this.energy = cc.js.isNumber(this.config.energy_start) ? this.config.energy_start : 0;
        this.allEnemyHurtNum = 0;

        // 词条工具实例
        if (!this.eliteStageUtil) {
            this.eliteStageUtil = new PveEliteStageUtil();
        }

        // 选择器实例
        if (!this.fightSelector) {
            this.fightSelector = new PveFightSelector();
        }

        // 战斗信息实例
        if (!this.isDemo && !this.isReplay && !this.battleInfoUtil && !this.isDefender) {
            this.battleInfoUtil = new PveBattleInfoUtil();
            this.battleInfoUtil.sceneModel = this;
        }
        //实战演练通关条件实例
        if (!this.gateconditionUtil) {
            this.gateconditionUtil = new PveGateConditionUtil();
        }

        // 精英副本条件处理-------------elite-----------------
        if (!this.isDemo && !this.isDefender) {
            this.eliteStageUtil.setCurStageData(this);
        }

        // 实战演练副本通关条件处理-------------gatecondition-----------------
        if (!this.isDemo && !this.isDefender && (this.stageConfig.copy_id == CopyType.RookieCup || this.stageConfig.copy_id == CopyType.EndRuin || this.stageConfig.copy_id == CopyType.HeroAwakening)) {
            this.gateconditionUtil.setCurStageData(this.stageConfig);
        }


        // 矿洞大作战天赋技能处理----------------
        if (!this.isDemo && this.stageConfig.copy_id == CopyType.Mine) {
            this.eliteStageUtil.setMineGiftSkill();
        }

        // // // 据点战pvp----------------
        // if (!this.isDemo && this.stageConfig.copy_id == CopyType.NONE && this.arenaSyncData && this.arenaSyncData.fightType == 'FOOTHOLD') {
        //     this.eliteStageUtil.setFhPvpSkill(this.isMirror)
        // }

        //奇遇探险
        if (!this.isDemo && this.stageConfig.copy_id == CopyType.Adventure) {
            this.eliteStageUtil.setAdventureAddSkill()
        }
        //奇遇探险
        if (!this.isDemo && this.stageConfig.copy_id == CopyType.NewAdventure) {
            this.eliteStageUtil.setAdventure2AddSkill()
        }

        //丧尸攻城
        if (!this.isDemo && this.stageConfig.copy_id == CopyType.Siege) {
            this.eliteStageUtil.setSiegeSkill()
        }

        if (!this.isDemo && this.stageConfig.copy_id == CopyType.NONE && this.arenaSyncData && this.arenaSyncData.fightType == 'GUARDIANTOWER') {
            let guardianTowerModel = ModelManager.get(GuardianTowerModel)
            if (guardianTowerModel.curCfg) {
                this.eliteStageUtil.setGuardianTowerSkill(this.isMirror, guardianTowerModel.curCfg.hardcore)
            }
        }
    }

    // 初始化刷怪列表
    private initEnemies() {
        this.enemyCfg = [];
        // 回放模式
        if (this.isReplay) {
            return;
        }
        // 取出配置
        for (let i = 0, n = this.config.monster_born_cfg.length; i < n; i++) {
            let item: any = this.config.monster_born_cfg[i];
            if (cc.js.isString(item)) {
                // 字符串格式，范围配置模式
                let a = item.split('-');
                let b = parseInt(a[0]);
                let e = a[1] ? parseInt(a[1]) : b;
                for (let id = b; id <= e; id++) {
                    let cfg = ConfigManager.getItemById(Pve_bornCfg, id);
                    if (cfg && cfg.num > 0) {
                        this.enemyCfg.push(cfg);
                    }
                }
            } else {
                let cfg = ConfigManager.getItemById(Pve_bornCfg, item);
                if (cfg && cfg.num > 0) {
                    this.enemyCfg.push(cfg);
                }
            }
        }
        this.arenaEnemies = [];
        // 计算所有怪物的血量
        this.stageAllEnemyHpNum = Number.MAX_VALUE;
        if ((this.stageConfig.copy_id == CopyType.HeroTrial || this.stageConfig.copy_id == CopyType.NewHeroTrial) && !this.config.endless) {
            this.stageAllEnemyHpNum = 0;
            for (let i = this.enemyCfg.length - 1; i >= 0; i--) {
                let o = this.enemyCfg[i];
                let cfg = ConfigManager.getItemById(MonsterCfg, o.enemy_id);
                // 排除不可计数的怪物
                if (cfg && cfg.type != 4) {
                    let tem = cc.js.isNumber(this.stageConfig.hp_correct) ? this.stageConfig.hp_correct : 0;
                    this.stageAllEnemyHpNum += o.num * (cfg.hp * (1 + tem));
                }
            }
        }
    }

    // 初始化首次通关掉落奖励数据
    private initDropRewards() {
        this.enemyRewardData = {};
        this.killEnemyDrop = {};
        if (this.isReplay) return;
        if (this.isBounty) return;
        if (this.isMirror) return;
        if (this.isDemo) return;
        if (CopyUtil.isStagePassed(this._id)) return;
        // 初始化掉落奖励数据
        let monster_drop: number[][] = this.stageConfig.monster_drop;
        if (monster_drop instanceof Array && monster_drop.length > 0) {
            // 有掉落的怪物列表
            let enemyCfg: {
                cfg: MonsterCfg,
                drop: { [type: number]: number },
                num: number,
            }[] = [];
            let data: { [type: number]: number } = {};
            this.enemyCfg.forEach(e => {
                let id = e.enemy_id;
                let cfg = ConfigManager.getItemById(MonsterCfg, id);
                if (cfg.drop instanceof Array && cfg.drop.length > 0) {
                    let drop: number[][] = cfg.drop;
                    let item = {
                        cfg: cfg,
                        drop: {},
                        num: 0,
                    };
                    drop.forEach(d => {
                        item.drop[d[0]] = d[1];
                        item.num += d[1];
                        data[d[0]] = 0;
                    });
                    enemyCfg.push(item);
                }
            });
            // 分配掉落
            let remain: number = 0;
            monster_drop.forEach(e => {
                if (data[e[0]] === void 0) {
                    // 配置的怪物没有掉落此类物品
                    return;
                }
                data[e[0]] = e[1];
                remain += e[1];
            });
            let enemyReward = this.enemyRewardData;
            while (true) {
                // 没有剩余则退出循环
                if (remain <= 0 || enemyCfg.length <= 0) {
                    break;
                }
                // 随机分配掉落的奖励
                let index = MathUtil.rnd(0, enemyCfg.length - 1);
                let item = enemyCfg[index];
                let rewards: { [type: number]: number } = {};
                for (let e in data) {
                    let type = parseInt(e);
                    if (item.drop[type] > 0) {
                        let num = MathUtil.rnd(0, Math.min(remain, item.drop[type]));
                        if (num > 0) {
                            remain -= num;
                            item.drop[type] -= num;
                            item.num -= num;
                            rewards[type] = num;
                            if (item.num <= 0) {
                                enemyCfg.splice(index, 1);
                            }
                        }
                    }
                }
                let id = item.cfg.id;
                if (enemyReward[id]) {
                    enemyReward[id].push(rewards);
                } else {
                    enemyReward[id] = [rewards];
                }
            }
        }
    }

    // 是否还有怪物波次没有出现
    get hasWave() {
        let v = this.wave + 1;
        for (let i = 0, n = this.enemyCfg.length; i < n; i++) {
            let cfg = this.enemyCfg[i];
            if (cfg.wave == v) {
                return true;
            }
        }
        return false;
    }

    /**
     * 设置刷怪波次
     * @param v 
     * @param killedDic 已经杀死的怪物数量
     * @param mode
     */
    setWaveBy(v: number, killedDic: { [enemy_id: number]: number } = {}, mode: 'set' | 'add' = 'add') {
        this.wave = Math.max(0, v);
        this.killedEnemyDic = killedDic || {};
        if (mode === 'set') {
            // 初始设置
            this.maxEnemy = 0;
            this.realWave = 0;
            this.waveTime = 0;
            this.curEnemies.length = 0;
        } else {
            // 真实波次增加
            this.realWave += 1;
            // 竞技模式时追加至旧的怪物列表中，不需要清除旧数据
            if (this.stageConfig.copy_id != CopyType.NONE) {
                this.waveTime = 0;
                this.curEnemies.length = 0;
            }
        }
        let nums: { [enemy_id: number]: number } = {};
        for (let i = 0, n = this.enemyCfg.length; i < n; i++) {
            let cfg = this.enemyCfg[i];
            if (cfg.wave == this.wave) {
                if (cc.js.isNumber(this.killedEnemyDic[cfg.enemy_id])) {
                    // 存在保存的进度，并且当前还没有计算进度数值
                    if (nums[cfg.enemy_id] === void 0) {
                        nums[cfg.enemy_id] = this.killedEnemyDic[cfg.enemy_id];
                    }
                } else {
                    // 数据异常
                    delete this.killedEnemyDic[cfg.enemy_id];
                }
                let time = cfg.time;
                for (let k = 0; k < cfg.num; k++) {
                    // 每个怪对应指定的出生点
                    for (let j = 0, m = cfg.spawn.length; j < m; j++) {
                        // 忽略已经被击杀的怪物数量
                        if (cc.js.isNumber(nums[cfg.enemy_id]) && nums[cfg.enemy_id] > 0) {
                            nums[cfg.enemy_id] -= 1;
                            continue;
                        }
                        // 创建刷怪数据
                        let info = new WaveEnemyInfo();
                        info.enemyId = cfg.enemy_id;
                        info.spawn = cfg.spawn[j];
                        info.time = time + this.waveTime;
                        info.num = 1;
                        if (cc.js.isNumber(cfg.wait)) {
                            info.wait = Number(cfg.wait);
                        }
                        if (cc.js.isNumber(cfg.wait_delay)) {
                            info.wait_delay = Number(cfg.wait_delay);
                        }
                        if (cc.js.isString(cfg.born_animation) &&
                            cfg.born_animation != ''
                        ) {
                            info.born_animation = cfg.born_animation;
                        }
                        this.curEnemies.push(info);
                        // 初始设置，计算剩余怪物数量
                        if (mode == 'set') {
                            let mcfg = ConfigManager.getItemById(MonsterCfg, cfg.enemy_id);
                            if (mcfg && mcfg.type != 4) {
                                this.maxEnemy += 1;
                            }
                        }
                    }
                    time += cfg.interval;
                }
            } else if (mode === 'set' && cfg.wave > this.wave) {
                // 初始设置，并且波次大于当前波
                let mcfg = ConfigManager.getItemById(MonsterCfg, cfg.enemy_id);
                if (mcfg && mcfg.type != 4) {
                    this.maxEnemy += cfg.num * cfg.spawn.length;
                }
            }
        }
        // 按刷怪时间先后排序
        this.curEnemies.length && this.curEnemies.sort((a, b) => {
            return a.time - b.time;
        });
        // 触发界面更新剩余怪物数量
        if (mode === 'set') {
            this.killedEnemy = this.killedEnemy;
        }
        // 初始化掉落表
        if (mode === 'set' || (this.wave == 1 && this.config.endless)) {
            this.initDropRewards();
        }
    }

    /**
     * 得到ctrl类型对应的数组
     * @param ctrl 
     */
    private _getFightArrayBy(ctrl: PveBaseFightCtrl): PveBaseFightCtrl[] {
        let arr: PveBaseFightCtrl[];
        if (ctrl instanceof PveHeroCtrl) arr = this.heros;
        else if (ctrl instanceof PveGuardCtrl) arr = this.soldiers;
        else if (ctrl instanceof PveSoldierCtrl) arr = this.soldiers;
        else if (ctrl instanceof PveGeneralCtrl) arr = this.generals;
        else if (ctrl instanceof PveCalledCtrl) arr = this.calleds;
        else if (ctrl instanceof PveTrapCtrl) arr = this.traps;
        else if (ctrl instanceof PveGateCtrl) arr = this.gates;
        else if (ctrl instanceof PveEnemyCtrl && ctrl.model.config.type != 4) arr = this.enemies;
        else if (ctrl instanceof PveEnemyCtrl && ctrl.model.config.type == 4) arr = this.specialEnemies;
        return arr;
    }

    /**
     * 添加战斗单元
     * @param ctrl 
     */
    addFight(ctrl: PveBaseFightCtrl) {
        let arr = this._getFightArrayBy(ctrl);
        if (arr.indexOf(ctrl) == -1) {
            arr.push(ctrl);
            if (arr === this.heros) {
                this.heros = arr as PveHeroCtrl[];
            }
        }
        if (this._fightsArr.indexOf(ctrl) == -1) {
            this._fightsArr.push(ctrl);
        }
        this._fightsDic[ctrl.model.fightId] = ctrl;
        // 陷阱层级特殊处理
        let parent = this.ctrl.thing;
        if (arr === this.traps) {
            parent = this.ctrl.effect;
            let cfg = (ctrl as PveTrapCtrl).model.config;
            if (cc.js.isNumber(cfg.trap_floor) && Number(cfg.trap_floor) == 1) {
                parent = this.ctrl.floor;
            }
        }
        ctrl.node.parent = parent;
    }

    /**
     * 移除战斗单元
     * @param fightId 
     */
    removeFight(ctrl: PveBaseFightCtrl) {
        let arr = this._getFightArrayBy(ctrl);
        let index = arr.indexOf(ctrl);
        if (index >= 0) {
            arr.splice(index, 1);
            if (arr === this.heros) {
                this.heros = arr as PveHeroCtrl[];
            }
        }
        index = this._fightsArr.indexOf(ctrl);
        if (index >= 0) {
            this._fightsArr.splice(index, 1);
        }
        delete this._fightsDic[ctrl.model.fightId];
    }

    /**
     * 删除召唤物
     * @param ctrl 
     * @param baseId 
     */
    removeCall(ctrl: PveFightCtrl, baseId: number) {
        let n: number = this.calleds.length;
        let o: number = ctrl.model.fightId;
        for (let i = n - 1; i >= 0; i--) {
            // 查询场景中召唤物的owner是否为model.ctrl
            let m = this.calleds[i].model;
            if (m.call_id == baseId) {
                if (m.owner_id === o) {
                    this.calleds[i].fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_IDLE)
                    //this.removeFight(this.calleds[i]);
                    this.calleds.splice(i, 1);
                }
            }
        }
    }

    /**
     * 获取场景中的所有战斗单位
     */
    getAllFight() {
        return this._fightsDic;
    }
    getAllFightArr() {
        return this._fightsArr;
    }
    /**
     * 得到指定fightId的对象实例
     * @param fightId 
     */
    private _fightsArr: PveFightCtrl[] = [];
    private _fightsDic: { [id: number]: PveFightCtrl } = {};
    getFightBy(fightId: number) {
        return this._fightsDic[fightId];
    }

    /**
     * 得到指定baseId的对象实例
     * @param baseId 
     */
    getFightBybaseId(baseId: number): PveFightCtrl {
        for (const key in this._fightsDic) {
            let t = this._fightsDic[key];
            if (t instanceof PveTrapCtrl) {
                continue;
            }
            if (t && t.isAlive) {
                let tm = t.model;
                if (tm && tm.config && tm.config.id == baseId) {
                    return t;
                }
            }
        }
        return null;
    }
    /**
     * 得到指定baseId的陷阱对象实例
     * @param baseId 
     */
    getTrapBybaseId(baseId: number): PveFightCtrl {
        for (const key in this._fightsDic) {
            let t = this._fightsDic[key];
            if (t instanceof PveTrapCtrl) {
                if (t && t.isAlive) {
                    let tm = t.model;
                    if (tm && tm.config && tm.config.id == baseId) {
                        return t;
                    }
                }
            }
        }
        return null;
    }
    /**
     * 得到指定baseId的所有对象实例
     * @param baseId 
     */
    getAllFightBybaseId(baseId: number): PveFightCtrl[] {
        let tem: PveFightCtrl[] = [];
        for (const key in this._fightsDic) {
            let t = this._fightsDic[key];
            if (t instanceof PveTrapCtrl) {
                continue;
            }
            if (t && t.isAlive) {
                let tm = t.model;
                if (tm && tm.config && tm.config.id == baseId) {
                    tem.push(t);
                }
            }
        }
        return tem;
    }

    //得到指定baseId的对象的数量
    getFightNumByBaseId(baseId: number): number {
        let num = 0;
        for (const key in this._fightsDic) {
            let t = this._fightsDic[key];
            if (t instanceof PveTrapCtrl) {
                continue;
            }
            if (t && t.isAlive) {
                let tm = t.model;
                if (tm && tm.config && tm.config.id == baseId) {
                    num++;
                }
            }
        }
        return num;
    }

    /**
     * 增加能量
     * @param v 
     */
    addEnergy(v: number) {
        if (this.isDemo || this.isReplay || !this.eliteStageUtil.general) {
            // 禁用了指挥官技能的副本不修改能量值
            return;
        }
        v = this.energy + v;
        v = Math.min(this.config.energy_limit, v);
        if (this.energy != v) {
            this.energy = v;
        }
    }

    /**
     * 保存上阵数据，[heroId, ... ]
     * @param a 
     */
    saveBuildTower(a?: number[]) {
        if (this.isDemo) return;
        if (this.isReplay) return;
        if (this.isMirror) return;
        if (a === void 0) {
            let n = this.towers.length;
            // 初始数据
            a = [];
            for (let i = 0; i < n; i++) {
                a[i] = -1;
            }
            // 上阵数据
            for (let i = 0; i < n; i++) {
                let t = this.towers[i];
                if (t.hero) {
                    let e = t.hero.model.item;
                    if (e && e.series > 0) {
                        a[t.id - 1] = e.series;
                    }
                }
            }
        }
        if (this.isBounty) {
            // 赏金副本无需保存上阵数据至本地
            this['_savedBuildTower'] = a;
            return;
        }
        for (let i = 0, n = a.length; i < n; i++) {
            if (a[i] > 600000) {
                // 临时卡牌，不保存至上阵数据中
                a[i] = -1;
            }
        }
        let n: string = 'pve_build_tower_';
        GlobalUtil.setLocal(n + this.stageConfig.subtype, a);
    }

    /**
     * 读取上阵数据，[heroId, ... ]
     */
    readBuildTower(): number[] {
        if (this.isBounty || this.isReplay || this.isMirror) {
            // 此类副本无需从本地数据中读取
            return this['_savedBuildTower'] || [];
        }

        if (this.isDefender) {
            let heroModel = ModelManager.get(HeroModel)
            return [];//heroModel.CurTypePvpdefenderSetUpHero();
        }

        let n: string = 'pve_build_tower_';
        let a: number[] = GlobalUtil.getLocal(n + this.stageConfig.subtype);
        if (!a) {
            a = new Array(this.towers.length);
            for (let i = 0, n = a.length; i < n; i++) {
                a[i] = -1;
            }
        }
        //巅峰之战处理
        if (this.stageConfig.copy_id == CopyType.NONE && this.arenaSyncData.fightType == 'PEAK' && !this.isMirror) {
            let tem = ModelManager.get(PeakModel).arenaHeroList;
            let u = []
            tem.forEach(data => {
                let id = data.heroType % 300000
                u.push(id)
            })
            if (a && a.length > 0) {
                for (let i = 0; i < a.length; i++) {
                    let v = a[i];
                    if (u.indexOf(v) == -1) {
                        a[i] = -1;
                    }
                }
            }
            return a;
        }

        // 去除不在上阵列表中的项
        let u = ModelManager.get(HeroModel).PveUpHeroList;
        //团队远征
        if (this.stageConfig.copy_id == CopyType.Expedition) {
            u = GlobalUtil.getLocal("Expedition_heroIds") || []
        } if (this.stageConfig.copy_id == CopyType.Ultimate) {
            u = ModelManager.get(HeroModel).Pve_9_HeroList
        }
        if (a && a.length > 0) {
            for (let i = 0; i < a.length; i++) {
                let v = a[i];
                if (u.indexOf(v) == -1) {
                    a[i] = -1;
                }
            }
        }
        // 去除重复项
        let r: number[] = [];
        if (a && a.length > 0) {
            for (let i = 0; i < a.length; i++) {
                let v = a[i];
                if (r.indexOf(v) == -1) {
                    r[i] = v;
                } else {
                    r[i] = -1;
                }
            }
        }
        return r;
    }

    // 更新上阵英雄总战力
    updatePower() {
        gdk.Timer.callLater(this, this._updatePowerLater);
    }

    _updatePowerLater() {
        if (this.stageConfig.copy_id == CopyType.Expedition) {
            //箭头函数解决async传染
            let cb = async () => {
                let power = 0;
                for (let i = 0, n = this.towers.length; i < n; i++) {
                    let t = this.towers[i];
                    if (t.hero) {
                        let p = await ExpeditionUtils.getPowerByHeorId(t.hero.model.heroId);
                        power += p;
                    }
                }
                this.totalPower = power;
            }
            cb();
            return;
        }

        let power = 0;
        for (let i = 0, n = this.towers.length; i < n; i++) {
            let t = this.towers[i];
            if (t.hero) {
                power += t.hero.model.power;
            }
        }
        this.totalPower = power;
    }

    /** 加速倍速列表 */
    get timeScaleArray(): number[] {
        let name = 'PVE_TIME_SCALE_ARRAY';
        if (this.stageConfig) {
            let copyId = this.stageConfig.copy_id;
            if (copyId == CopyType.Ultimate) {
                //终极试炼
                name = 'PVE_ULTIMATE_SCALE_ARRAY';
            } else if (copyId == CopyType.Guardian) {
                //守护者副本
                name = 'PVE_GUARDIANTOWER_SCALE_ARRAY';
            } else if (copyId == CopyType.NewAdventure) {
                //奇境探险(无尽模式)
                let adModel = ModelManager.get(NewAdventureModel)
                if (adModel.copyType == 1) {
                    name = 'PVE_ADVENTURE_SCALE_ARRAY';
                }

            } else if (copyId == CopyType.NONE || copyId == CopyType.Survival) {
                // 竞技模式使用不同的加速值，微信小游戏
                if (copyId == CopyType.NONE && cc.sys.platform === cc.sys.WECHAT_GAME) {
                    let info = window['wx'].getSystemInfoSync();
                    if (info && info.model && info.model.startsWith('iPhone')) {
                        let num = parseInt(info.model.substr(6));
                        if (!isNaN(num) && num <= 8) {
                            return [1.0];
                        }
                    }
                    return [1.0, 2.0];
                }
                name = 'PVP_TIME_SCALE_ARRAY';
                if (copyId == CopyType.NONE && this.arenaSyncData && this.arenaSyncData.fightType == 'PIECES_CHESS') {
                    //末日自走棋(无尽模式)
                    let pModel = ModelManager.get(PiecesModel);
                    if (pModel.curModel == 1) {
                        name = 'PVE_CHESS_SCALE_ARRAY';
                    }
                }
            }
        }
        return ConfigManager.getItemById(CommonCfg, name).value || [1.0];
    }

    /** 默认倍速 */
    get defaultTimeScale(): number {
        return this.timeScaleArray[0];
    }

    /** 推荐等级 */
    get adviceLv(): number {
        return this.stageConfig['advice_lv'] || 1;
    }

    /** 指挥官等级 */
    get generalLv(): number {
        if (this.generals.length > 0) {
            return this.generals[0].model.prop.lv;
        }
        return 1;
    }

    /** 场景缩放值 */
    get scale(): number {
        let v = this.stageConfig.scale;
        if (!cc.js.isNumber(v)) {
            v = 1;
        } else {
            v = Math.max(0.1, v);
        }
        return v;
    }

    /** 检查指定的数据实例是否准备完成 */
    private checkModel(model: PveSceneModel) {
        let a = model.getAllFightArr();
        let b = a.some(f => {
            let m = f.model;
            if (m.type == PveFightType.Gate) return false;
            if (m.type == PveFightType.Trap) return false;
            if (m.type == PveFightType.Unknow) return false;
            return !m.ready || !m.loaded;
        });
        return b;
    }

    /** 是否有战斗对象资源正在加载 */
    get loading() {
        let r = false;
        let s = this.arenaSyncData;
        if (!!s) {
            r = this.checkModel(s.mainModel);
            r = r || this.checkModel(s.mirrorModel);
        } else {
            r = this.checkModel(this);
        }
        return r;
    }

    /** 当前帧是否为逻辑执行帧 */
    isLogicalFrame: boolean;
    // get isLogicalFrame(): boolean {
    //     if (cc.game.getFrameRate() <= 30) {
    //         return true;
    //     }
    //     return this.frameId % 2 === 0;
    // }
}