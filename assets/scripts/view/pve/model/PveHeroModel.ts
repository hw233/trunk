import ConfigManager from '../../../common/managers/ConfigManager';
import HeroUtils from '../../../common/utils/HeroUtils';
import PveHeroCtrl from '../ctrl/fight/PveHeroCtrl';
import PveSoldierCtrl from '../ctrl/fight/PveSoldierCtrl';
import PveTool from '../utils/PveTool';
import { BagItem } from '../../../common/models/BagModel';
import { Hero_careerCfg, Hero_undersand_levelCfg } from './../../../a/config';
import { HeroCfg, SoldierCfg } from '../../../a/config';
import { PveBaseFightModel } from './PveBaseFightModel';
import { PveCampType, PveFightType } from '../core/PveFightModel';
import { PveHeroDir } from '../const/PveDir';

/**
 * PVE-Hero数据模型类
 * @Author: sthoo.huang
 * @Date: 2019-03-18 16:33:32
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-24 20:03:13
 */
export default class PveHeroModel extends PveBaseFightModel {

    ctrl: PveHeroCtrl;
    heroId: number;
    config: HeroCfg;    // 静态配置
    soldiers: PveSoldierCtrl[] = [];  // 小兵实例列表
    dir: PveHeroDir = PveHeroDir.None;    // 方向
    mSoliderId: number = 0;     // 怪物小兵id
    item: BagItem;   // 英雄卡背包数据
    orignalPos: cc.Vec2;    // 起始坐标
    reliveNum: number = 0;
    demoRoadIndex: number = 0;

    init() {
        super.init();
        this.camp = PveCampType.Friend;
        this.type = PveFightType.Hero;
        this.reliveNum = 0;
    }

    unuse() {
        super.unuse();
        this.mSoliderId = 0;
        this.reliveNum = 0;
        this.item = null;
    }

    /** Hero ID */
    _id: number;
    get id() {
        return this._id;
    }

    set id(v: number) {
        this._id = v;
        this._baseProp = null;
        this.config = ConfigManager.getItemById(HeroCfg, this._id);
        this.init();
    }

    /** 英雄详细属性 */
    _info: icmsg.FightHero;
    get info() {
        return this._info;
    }

    set info(v: icmsg.FightHero) {
        if (!v) return;
        this._info = v;
        this.ready = true;
        this.hp = this.hpMax;
        this.attackable = this.soldierType == 4;    // 只有守卫英雄能被主动反击
    }

    /** 基础属性 */
    get baseProp() {
        if (!this._baseProp) {
            if (this.ready) {
                // 所有数据是否准备就绪
                let assign = Object['assign'];
                let career = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._info.careerId, { career_lv: this._info.careerLv });
                this._basePropTarget = assign(new icmsg.FightAttr(), this.config, career);
                this._basePropTarget.level = this._info.heroLv;
                this._basePropTarget.id = this._id;
                // 增加小兵的攻防血等属性
                let o = {};
                [
                    'hp',
                    'atk',
                    'def',
                    'hit',
                    'dodge',
                ].forEach(p => {
                    o[p] = this._info.attr[p] + this._info.soldier[p];
                });
                this._basePropTarget = assign(this._basePropTarget, this._info.attr, o);
                this._baseProp = PveTool.getProxyObj(this._basePropTarget);
            } else {
                // 没准备就绪时使用配置做为基础属性
                return this.config;
            }
        }
        return this._baseProp;
    }

    /**
     * 技能id、lv列表
     */
    get skillIds(): any[] {
        return this._info && this._info.skills;
    }

    /** 战力 */
    get power(): number {
        return this.item ? (this.item.extInfo as icmsg.HeroInfo).power : 0;
    }

    /** 秒伤 */
    get hurt(): number {
        return 0;
    }

    /** 显示的攻击范围（画圈） */
    get range(): number {
        // if (this.soldiers.length > 0) {
        //     // 小兵的原始攻击范围
        //     return this.soldiers[0].model.getProp('range');
        // }
        // if (this._info.soldier) {
        //     let cfg = ConfigManager.getItemById(SoldierCfg, this._info.soldier.soldierId);
        //     if (cfg) {
        //         return cfg.range;
        //     }
        // }
        return this.getProp('range');
    }

    /** 攻击范围（当前技能） */
    get atkDis(): number {
        let skill = this.currSkill;
        if (skill) {
            let range = skill.range;
            if (range > 0) {
                // 技能有配置范围则使用技能的范围
                return range;
            }
            // else if (this.soldiers.length > 0) {
            //     // 小兵的攻击范围
            //     return this.soldiers[0].model.getProp('range');
            // }
        }
        return this.getProp('range');
    }

    /** 获得对应的小兵列表 */
    get soldierId(): number {
        if (this._info.soldier) {
            return this._info.soldier.soldierId;
        }
        return -1;
    }

    /** 获得小兵的类型 */
    get soldierType() {
        if (this._info && this._info.soldier.soldierId > 0) {
            return ConfigManager.getItemById(SoldierCfg, this._info.soldier.soldierId).type;
        }
        return -1;
    }

    // 复活时间（秒)
    get revive(): number {
        let t: number = this.getProp('revive');
        let tm = Math.max(0, t);
        return tm;
    }

    //英雄模型
    get skin() {
        let mysticSkillLv: number = 0;
        if (this.config.group[0] == 6 && this._info) {
            let totalLv = HeroUtils.getMysticSkillTotalLvByFightHero(this._info);
            let cfg = ConfigManager.getItemByField(Hero_undersand_levelCfg, 'mystery_skill', totalLv);
            if (cfg) {
                mysticSkillLv = cfg.undersand_level;
            }
        }
        return HeroUtils.getHeroSkin(this.config.id, this._info ? this._info.heroStar : 0, mysticSkillLv);
    }
}