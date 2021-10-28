import ConfigManager from '../../../common/managers/ConfigManager';
import PveEnemyModel from './PveEnemyModel';
import { MonsterCfg } from '../../../a/config';
import { PveBaseFightModel, SkillIdLv } from './PveBaseFightModel';
import { PveEnemyDir } from '../const/PveDir';
import { PveFightCtrl } from '../core/PveFightCtrl';
import { PveFightType, PveMoveableFightModel } from '../core/PveFightModel';

/**
 * Pve被召唤者数据模型
 * @Author: sthoo.huang
 * @Date: 2019-05-28 13:55:41
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-25 11:51:26
 */

export default class PveCalledModel extends PveBaseFightModel implements PveMoveableFightModel {

    config: MonsterCfg = null;  // 静态配置表
    dir: PveEnemyDir = PveEnemyDir.None;    // 方向
    call_id: number;    // 召唤ID
    owner_id: number;   // 所有者fightId
    owner_prop: any;    //  所有者属性
    orignalPos: cc.Vec2;    // 起始坐标
    time: number;   // 持续时间

    init() {
        super.init();
        this.dir = PveEnemyDir.DOWN;
        this.type = PveFightType.Call;
        this.attackable = true;
    }

    setConfig(o: any) {
        this.config = cc.js.mixin({}, this.config, o);
        this._baseProp = null;
        this._tempProp = null;
    }

    /** Call id */
    _id: number = 0;
    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this.init();
        this.config = ConfigManager.getItemById(MonsterCfg, v);
        this.ready = true;
        this.hp = this.hpMax;
    }

    // 召唤者
    get owner() {
        return this.ctrl.sceneModel.getFightBy(this.owner_id);
    }

    set owner(v: PveFightCtrl) {
        if (v && v.isAlive) {
            let model = v.model;
            this.owner_id = model.fightId;
            this.owner_prop = model.prop;
            this.camp = model.camp;
        } else {
            this.owner_id = -1;
            this.owner_prop = null;
        }
    }

    /**
     * 技能id、lv列表
     */
    _skillIds: SkillIdLv[];
    get skillIds() {
        if (!this._skillIds) {
            this._skillIds = PveEnemyModel.prototype._getSkillIds.call(this);
        }
        return this._skillIds;
    }

    get range(): number {
        return this.ownerRange;
    }

    get ownerPos(): cc.Vec2 {
        let r = this.getProp('range');
        if (r <= 0) {
            let owner = this.owner;
            if (owner && owner.isAlive) {
                return owner.getPos();
            }
        }
        return this.ctrl.getPos();
    }

    get ownerRange(): number {
        let r = this.getProp('range');
        if (r <= 0) {
            let owner = this.owner;
            if (owner && owner.isAlive) {
                return owner.model.range;
            }
            if (this.owner_prop.range > 0) {
                return this.owner_prop.range;
            }
        }
        return r;
    }

    /** 
     * 攻击距离，如果技能有攻击距离则使用，如果没有则使用小兵的攻击距离
     */
    get atkDis(): number {
        let skill = this.currSkill;
        if (skill) {
            let range = skill.range;
            if (range > 0) {
                return range;
            }
        }
        return this.range;//this.getProp('range');
    }

    unuse() {
        this._id = 0;
        this._skillIds = null;
        this.config = null;
        this.dir = PveEnemyDir.None;
        this.hp = 0;
        this.owner = null;
        this.orignalPos = null;
        this.time = 0;
        super.unuse();
    }
}