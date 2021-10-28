import ConfigManager from '../../../common/managers/ConfigManager';
import PveRoadUtil from '../utils/PveRoadUtil';
import PveTrapCtrl from '../ctrl/fight/PveTrapCtrl';
import { MonsterCfg } from '../../../a/config';
import { PveBaseFightModel, SkillIdLv } from './PveBaseFightModel';
import { PveCampType, PveFightType } from '../core/PveFightModel';
import { PveEnemyDir } from '../const/PveDir';
import { PveFightCtrl } from '../core/PveFightCtrl';

/**
 * PVE-Enemy数据模型类
 * @Author: sthoo.huang
 * @Date: 2019-03-18 20:39:42
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-12 12:04:14
 */
export default class PveEnemyModel extends PveBaseFightModel {

    config: MonsterCfg = null;  // 静态配置表
    dir: PveEnemyDir = PveEnemyDir.DOWN;    // 方向
    owner_id: number;   // 召唤此怪物的对象fightId
    owner_prop: any;    // 召唤此怪物的对象属性
    targetPos: cc.Vec2; // 目标坐标
    road: cc.Vec2[]; // 路线
    roadIndex: number;  // 路线索引号

    //出生动作
    born_animation: string = null;
    //出生时待机时间
    watiTime: number = 0
    //延迟出生待机时间
    wait_delayTime: number = 0;
    //是否需要待机
    needWait: boolean = false;
    //怪物出生无敌时间
    brithTime: number = 0.5;

    //召唤怪物存在的时间
    callMonsterTime: number = 0;
    //是否是召唤怪物
    isCallMonster: boolean = false;

    //怪物存活时间
    aliveTime: number = 0;

    /**
     *  怪物传送特定位置一段时间
     */
    trans_BeforePos: cc.Vec2;
    trans_AfterPos: cc.Vec2;
    transTime: number = 0;

    /**
     * 是否已经换过皮肤标记
     */
    changeSkin: string = null;

    // 改变属性的外部参数值
    propParam: number = undefined;
    propExtra: {
        atk: number;
        hp: number;
        def: number;
        hit: number;
        dodge: number;
    } = undefined;
    atkCorrect: number = 1;
    hpCorrect: number = 1;

    setConfig(o: any) {
        this.config = cc.js.mixin({}, this.config, o);
        this._baseProp = null;
        this._tempProp = null;
    }

    /**
     * 怪物使用主动技能之前的目标id
     */
    oldTargetId: number = -1;

    init() {
        super.init();
        // this.camp = PveCampType.Enemy;
        this.type = PveFightType.Enemy;
        this.attackable = true;
    }

    /** Enemy ID */
    _id: number = 0;
    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this.init();
        let c = ConfigManager.getItemById(MonsterCfg, v);
        if (CC_DEBUG && !c) {
            cc.error(`找不到怪物ID为 ${v} 的配置，请检查 Monster 表`);
        }
        // 通过外部参数重新定义怪物属性
        if (this.propParam != undefined) {
            let p = this.propParam;
            c = Object['assign']({}, c, {
                __is_clone__: true,
                atk: Math.ceil(p * c.atk), // 攻
                hp: Math.ceil(p * c.hp),   // 血
                def: Math.ceil(p * c.def), // 防
                hit: Math.ceil(p * c.hit), // 命中
                dodge: Math.ceil(p * c.dodge), // 闪避
            });
        }
        // 通过外部参数重新定义具体怪物属性
        if (this.propExtra != undefined) {
            c = c['__is_clone__'] ? c : Object['assign']({}, c, {
                __is_clone__: true,
            });
            for (let e in this.propExtra) {
                c[e] = Math.ceil(c[e] * this.propExtra[e] / 100);
            }
        }
        // 场景难度参数
        if (this.atkCorrect != 1 || this.hpCorrect != 1) {
            c = c['__is_clone__'] ? c : Object['assign']({}, c, {
                __is_clone__: true,
            });
            c.atk = Math.ceil(c.atk * this.atkCorrect);
            c.hp = Math.ceil(c.hp * this.hpCorrect);
        }
        this.config = c;
        this.targetPos = null;
        this.road = null;
        this.ready = true;
        this.hp = this.hpMax;
        this.brithTime = 0.5;
        this.aliveTime = 0;
    }

    // 召唤者
    get owner() {
        return this.ctrl.sceneModel.getFightBy(this.owner_id);
    }

    set owner(v: PveFightCtrl) {
        this.owner_id = -1;
        this.owner_prop = null;
        this.camp = PveCampType.Enemy;
        if (v instanceof PveTrapCtrl) {
            let model = v.model;
            this.owner_id = model.owner_id;
            this.owner_prop = model.owner_prop;
            this.camp = model.camp;
        } else if (v && v.isAlive) {
            let model = v.model;
            this.owner_id = model.fightId;
            this.owner_prop = model.prop;
            this.camp = model.camp;
        }
    }

    // 技能列表
    _getSkillIds(): SkillIdLv[] {
        let prop: any = this.baseProp;
        let skills: any[] = prop ? prop.skills : null;
        if (skills instanceof Array) {
            let a: SkillIdLv[] = [];
            for (let i = 0; i < skills.length; i++) {
                let s = skills[i];
                if (cc.js.isNumber(s)) {
                    // 技能ID
                    a.push({
                        skillId: s,
                        skillLv: 1,
                    });
                } else if (cc.js.isString(s)) {
                    // 技能ID和等级
                    let list: string[] = s.split('#');
                    if (list.length == 2) {
                        a.push({
                            skillId: parseInt(list[0]),
                            skillLv: parseInt(list[1]),
                        });
                    } else {
                        CC_DEBUG && cc.error('----------------怪物技能配置有问题，请检查--怪物ID：' + this.id)
                        return null;
                    }
                } else if (s && typeof s === 'object' && cc.js.isNumber(s.skillId)) {
                    // 对象结构 {skillId, skillLv?}
                    a.push({
                        skillId: s.skillId,
                        skillLv: s.skillLv || 1,
                    });
                } else {
                    CC_DEBUG && cc.error('----------------怪物技能配置有问题，请检查--怪物ID：' + this.id)
                    return null;
                }
            }
            return a;
        }
        return null;
    }

    /** 技能id、lv列表 */
    _skillIds: SkillIdLv[];
    get skillIds() {
        if (!this._skillIds) {
            this._skillIds = this._getSkillIds();
        }
        return this._skillIds;
    }

    // 是否为Boss
    get isBoss(): boolean {
        return this.config.color == 12;  // 13:小怪，12:BOSS 11:精英怪
    }

    // 获得皮肤
    get skin() {
        if (this.changeSkin) {
            return this.changeSkin;
        }
        return this.getProp('skin') as string;
    }

    /** 到终点的距离 */
    _roadLength: number = -1;
    get roadLength() {
        if (this._roadLength < 0) {
            this._roadLength = PveRoadUtil.getDistance(this.road, this.ctrl.getPos());
        }
        return this._roadLength;
    }

    unuse() {
        this._id = 0;
        this._skillIds = null;
        this._roadLength = -1;
        this.config = null;
        this.dir = PveEnemyDir.DOWN;
        this.hp = 0;
        this.owner = null;
        this.targetPos = null;
        this.road = null;
        this.roadIndex = null;
        this.trans_AfterPos = null;
        this.trans_BeforePos = null;
        this.transTime = 0;
        this.changeSkin = null;
        this.oldTargetId = -1;
        this.propParam = undefined;
        this.propExtra = undefined;
        this.atkCorrect = 1;
        this.hpCorrect = 1;
        this.aliveTime = 0;
        super.unuse();
    }
}