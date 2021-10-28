import { Skill_trapCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import { CopyType } from '../../../common/models/CopyModel';
import FightingMath from '../../../common/utils/FightingMath';
import { PveFightCtrl } from '../core/PveFightCtrl';
import { PveFightType } from '../core/PveFightModel';
import { PveBaseFightModel } from './PveBaseFightModel';

/**
 * Pve陷阱数据模型
 * @Author: sthoo.huang
 * @Date: 2019-06-17 10:28:30
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-17 11:07:50
 */

export default class PveTrapModel extends PveBaseFightModel {

    config: Skill_trapCfg = null;  // 静态配置表
    owner_id: number;   // 所有者fightId
    owner_prop: any;    //  所有者属性
    time: number;   // 持续时间
    times: number;   // 效果次数
    stand_animation: string; // 循环动画
    trapType: number = 0;

    monsterRoad: cc.Vec2[]; //怪物的路径点列表
    monsterRoadIndex = 0;   //怪物路径Index

    temRange: number = 0; //临时设置的陷阱范围

    init() {
        super.init();
        this.type = PveFightType.Trap;
    }

    /** Trap id */
    _id: number = 0;
    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this.init();
        this.config = ConfigManager.getItemById(Skill_trapCfg, v);
        this.hp = 1;
        this.times = this.config.times;
        this.ready = true;
        if (cc.js.isNumber(this.config.type)) {
            this.trapType = this.config.type;
        }

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

    get skin() {
        let s = this.getProp('skin');
        if (typeof s === 'object') {
            // 数组随机
            return s[FightingMath.rnd(0, s.length - 1)] as string;
        }
        return s as string;
    }

    get size() {
        let scale: number = 1;
        let copyType = this.ctrl.sceneModel.stageConfig.copy_id
        if (copyType == CopyType.NONE || copyType == CopyType.Survival || copyType == CopyType.Ultimate) {
            if (cc.js.isNumber(this.config.size2)) {
                scale = this.config.size2;
                scale = Math.max(0.1, scale);
            }
        } else {
            if (cc.js.isNumber(this.config.size)) {
                scale = this.config.size;
                scale = Math.max(0.1, scale);
            }
        }
        return scale;
    }

    unuse() {
        this._id = 0;
        this.config = null;
        this.owner = null;
        this.time = 0;
        this.stand_animation = null;
        this.monsterRoad = [];
        this.monsterRoadIndex = 0;
        this.temRange = 0;
        super.unuse();
    }
}