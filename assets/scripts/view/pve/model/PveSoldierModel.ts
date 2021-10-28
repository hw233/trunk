import ConfigManager from '../../../common/managers/ConfigManager';
import PveHeroCtrl from '../ctrl/fight/PveHeroCtrl';
import PveSoldierCtrl from '../ctrl/fight/PveSoldierCtrl';
import PveTool from '../utils/PveTool';
import { Monster2Cfg, Soldier_army_skinCfg, SoldierCfg } from '../../../a/config';
import { PveBaseFightModel } from './PveBaseFightModel';
import { PveCampType, PveFightType } from '../core/PveFightModel';
import { PveSoldierDir } from '../const/PveDir';

/** 
 * PVE小兵数据模型
 * @Author: sthoo.huang  
 * @Date: 2019-04-12 10:21:31 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-02 20:02:22
 */
export default class PveSoldierModel extends PveBaseFightModel {

    ctrl: PveSoldierCtrl;
    config: SoldierCfg | Monster2Cfg;   // 静态配置
    hero: PveHeroCtrl;   // 所属的英雄
    orignalPos: cc.Vec2;    // 起始坐标
    dir: PveSoldierDir = PveSoldierDir.None;    // 方向
    isMonster: boolean = false;//是否是怪物
    index: number;      // 索引
    total: number;      // 当前英雄的总小兵数量

    init() {
        super.init();
        this.camp = PveCampType.Friend;
        this.type = PveFightType.Soldier;
    }

    _id: number;
    get id(): number {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this._baseProp = null;
        if (this.isMonster) {
            this.config = ConfigManager.getItemById(Monster2Cfg, this._id)
        }
        this.init();
    }

    // 所有者fightId
    get owner_id(): number {
        return this.hero.model.fightId;
    }

    //  所有者属性
    get owner_prop(): any {
        return this.hero.model.prop;
    }

    get skin() {
        if (this.hero.model.item.extInfo) {
            let heroInfo = <icmsg.HeroInfo>this.hero.model.item.extInfo
            if (heroInfo.soldierSkin > 0) {
                let cfg = ConfigManager.getItemByField(Soldier_army_skinCfg, 'skin_id', heroInfo.soldierSkin)
                if (cfg) {
                    return cfg.skin;
                }
            }
        }
        return this.getProp('skin') as string;
    }

    unuse() {
        super.unuse();
        this.isMonster = false;
    }

    /** 小兵详细属性 */
    _info: icmsg.FightSoldier;
    get info() {
        return this._info;
    }

    set info(v: icmsg.FightSoldier) {
        if (!v) return;
        this._info = v;
        this.config = ConfigManager.getItemById(SoldierCfg, this._id)
        this.ready = true;
        this.hp = this.hpMax;
    }

    /**
     * 技能id、lv列表
     */
    get skillIds(): any[] {
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
                this._basePropTarget = assign(new icmsg.FightSoldier(), this.config);
                if (!this.isMonster) {
                    this._basePropTarget = assign(this._basePropTarget, this.info);
                }
                this._baseProp = PveTool.getProxyObj(this._basePropTarget);
            } else {
                // 没准备就绪时使用配置做为基础属性
                return this.config;
            }
        }
        // 小兵的属性中保存一份所属英雄的属性表
        if (!('h' in this._baseProp)) {
            cc.js.get(this._baseProp, 'h', () => this.hero.model.prop, true);
        }
        return this._baseProp;
    }

    //是否克隆了自己的召唤物
    _cloneCaller: boolean = false;
    get cloneCaller() {
        return this._cloneCaller;
    }
    set cloneCaller(v: boolean) {
        this._cloneCaller = v;
    }
}