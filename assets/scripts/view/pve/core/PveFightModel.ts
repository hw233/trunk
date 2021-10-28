import PveBuffModel from '../model/PveBuffModel';
import PveHaloModel from '../model/PveHaloModel';
import { PveFightCtrl } from './PveFightCtrl';
import { PveFightSkill, ShiedBuffData } from '../model/PveBaseFightModel';

/**
 * Pve战斗单位数据模型接口
 * @Author: sthoo.huang
 * @Date: 2019-04-22 14:57:37
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-17 10:47:04
 */

export enum PveCampType {
    Enemy,      // 敌方
    Friend,     // 友方
    Neutral,    // 中立
};

export enum PveFightType {
    Enemy,      // 怪物
    Soldier,    // 小兵
    Hero,       // 英雄
    Call,       // 召唤物
    Genral,     // 指挥官
    Trap,       // 陷阱
    Gate,       // 传送阵
    Unknow,     // 未知
};

export default interface PveFightModel {

    id: number;
    ctrl: PveFightCtrl;
    ready: boolean; // 配置是否加载完成
    loaded: boolean;
    config: any;    // 配置
    baseProp: any;  // 基础属性（不带BUFF加成）
    prop: any;      // 属性（带BUFF加成）
    hp: number;
    hpMax: number;
    shield: number;  // 永久护盾
    buffShield: ShiedBuffData[];  // buff护盾
    speedScale: number;
    speedScaleDirty: boolean;
    nodeScale: number;
    currSkill: PveFightSkill;    // 当前使用的技能
    targetId: number;
    camp: PveCampType;
    type: PveFightType;

    readonly skills: PveFightSkill[];
    readonly buffs: PveBuffModel[];
    readonly halos: PveHaloModel[];

    readonly fightId: number;  // 战斗对象唯一ID
    readonly range: number;
    readonly atkSpeed: number;
    readonly walkSpeed: number;
    readonly walkSpeedR: number;
    readonly attackable: boolean;    // 对象是否能被攻击
    readonly listeners: number[];
    readonly customState: boolean;

    updateCD(dt: number): void; // 更新CD
    resetCD(skill_id?: number): void;    // 重置CD
    reduceCd(cd?: number, skill_id?: number): void;  //减少技能的cd
    resetSkillCd(skill: number, cd: number, size?: number): void;//设置特定技能的cd为特定值 size:0 小于等于 1 大于等于
    resetSkillIndeCd(skill: number, cd: number, size?: number): void;//设置特定技能的inde_cd为特定值 
    canUse(s: PveFightSkill): boolean;   // 技能是否可用
    useSkill(s?: PveFightSkill): PveFightSkill; // 使用指定技能或当前技能
    getSkill(skill_id: number): PveFightSkill;  // 从当前技能列表中获得skillId技能实例
    addSkill(skillId: number, skillLv: number, resort?: boolean): PveFightSkill;    // 添加技能
    getProp(name: string): any; // 快速获得对象指定属性值
    removeTempProp(): void; // 移除临时属性
    getBuffShiedValue(): number; //获取buff护盾
    refreshShied(value: number): void;//刷新护盾值
}

export interface PveMoveableFightModel extends PveFightModel {

    readonly speed: number;
    readonly atkDis: number;
    orignalPos: cc.Vec2;
    ownerPos: cc.Vec2;
    ownerRange: number;
}