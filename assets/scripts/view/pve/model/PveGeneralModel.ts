import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import PveGeneralCtrl from '../ctrl/fight/PveGeneralCtrl';
import PveTool from '../utils/PveTool';
import RoleModel from '../../../common/models/RoleModel';
import { CopyType } from '../../../common/models/CopyModel';
import { General_skinCfg, GeneralCfg } from '../../../a/config';
import { PveBaseFightModel } from './PveBaseFightModel';
import { PveCampType, PveFightType, PveMoveableFightModel } from '../core/PveFightModel';
import { PveEnemyDir } from '../const/PveDir';

/**
 * Pve指挥官数据模型类
 * @Author: sthoo.huang
 * @Date: 2019-05-20 21:26:56
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:32:41
 */

export default class PveGeneralModel extends PveBaseFightModel implements PveMoveableFightModel {

    ctrl: PveGeneralCtrl;
    config: GeneralCfg;   // 静态配置
    orignalPos: cc.Vec2;    // 起始坐标
    dir: PveEnemyDir = PveEnemyDir.None;    // 方向
    energyTime: number = 0; // 能量自动回复时间
    isInManual: boolean = false; // 是否正在手动施法

    init() {
        super.init();
        this.camp = PveCampType.Friend;
        this.type = PveFightType.Genral;
        this.isInManual = false;
    }

    _id: number;
    get id(): number {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this._baseProp = null;
        this.config = ConfigManager.getItemById(GeneralCfg, this._id);
        this.init();
    }

    /** 指挥官详细属性 */
    _info: icmsg.FightGeneral;
    get info() {
        return this._info;
    }

    set info(v: icmsg.FightGeneral) {
        if (!v) return;
        this._info = v;
        this.ready = true;
        this.hp = this.hpMax;
    }

    /**
     * 技能id、lv列表
     */
    get skillIds(): any[] {
        if (this.ctrl.sceneModel.stageConfig.copy_id == CopyType.RookieCup && this.ctrl.node.name == 'general_0') {
            return []
        };
        return this.info && this.info.skills;
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
        return this.getProp('range');
    }

    /** 基础属性 */
    get baseProp() {
        if (!this._baseProp) {
            if (this.ready) {
                // 所有数据是否准备就绪
                let assign = Object['assign'];
                this._basePropTarget = assign({}, this.config);
                this._basePropTarget = assign(this._basePropTarget, this.info);
                this._baseProp = PveTool.getProxyObj(this._basePropTarget);
            } else {
                // 没准备就绪时使用配置做为基础属性
                return this.config;
            }
        }
        return this._baseProp;
    }

    get skin() {
        // let i = this.getProp('skin') || 1;
        //let i = ConfigManager.getItemById(General_weaponCfg, ModelManager.get(GeneralModel).curUseWeapon).resources;
        //let r = ConfigManager.getItemById(General_skinCfg, i).road;
        //指挥官模型固定
        let r = this.config ? this.config.artifact : 'H_zhihuiguan';
        if (ModelManager.get(RoleModel).gender == 1) {
            // 性别为女
            r += 'nv';
        }
        return r;
    }

    get size() {
        let scale: number = 1;
        let config = ConfigManager.getItemById(General_skinCfg, this.getProp('skin') || 1);
        if (cc.js.isNumber(config.size)) {
            scale = config.size;
            scale = Math.max(0.1, scale);
        }
        return scale;
    }

    get ownerPos(): cc.Vec2 {
        return this.ctrl.getPos();
    }

    get ownerRange(): number {
        return this.range;
    }
}