import ConfigManager from '../../../common/managers/ConfigManager';
import { PveBaseFightModel } from './PveBaseFightModel';
import { PveCampType, PveFightType } from '../core/PveFightModel';
import { PveFightCtrl } from '../core/PveFightCtrl';
import { Skill_gateCfg } from '../../../a/config';

/**
 * Pve传送阵数据模型
 * @Author: sthoo.huang
 * @Date: 2019-06-19 17:22:50
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-12 20:58:54
 */

export default class PveGateModel extends PveBaseFightModel {

    flag: string;   // 标识
    config: Skill_gateCfg = null;  // 静态配置表
    owner_id: number;   // 所有者fightId
    owner_prop: any;    //  所有者属性
    time: number;   // 持续时间
    times: number;   // 效果次数
    road: number = -1;   // 目标线路，-1为当前线路
    mode: string = 'to';   // 绝对或相对值
    percent: number[];    // 进度值, [min:number, max?:number]
    targetsTime: { [fight_id: number]: number };  // 目标最后被选中的时间 ｛｝

    init() {
        super.init();
        // 没有所有者时，则为中立单位
        this.camp = PveCampType.Neutral;
        this.type = PveFightType.Gate;
        this.targetsTime = {};
    }

    /** Gate ID */
    _id: number = 0;
    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this.init();
        this.config = ConfigManager.getItemById(Skill_gateCfg, v);
        this.hp = 1;
        this.ready = true;
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
        if (this.flag.indexOf('#') >= 0) {
            // 标志中包含#号的项不显示外观
            return null;
        }
        return this.prop.skin;
    }

    unuse() {
        this._id = 0;
        this.config = null;
        this.owner = null;
        this.time = 0;
        this.road = -1;
        this.mode = 'to';
        this.percent = null;
        this.targetsTime = null;
        super.unuse();
    }
}