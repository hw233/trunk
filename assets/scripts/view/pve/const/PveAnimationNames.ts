/**
 * Pve动作名称定义
 * @Author: sthoo.huang
 * @Date: 2019-03-19 11:46:19
 * @Last Modified by: chengyou.lin
 * @Last Modified time: 2019-12-10 21:00:49
 */

/**
 * 生成枚举对象值索引
 * @param en 
 * @param v 
 */
function genEnumValue(en: any, v: any) {
    let o: any = {};
    for (let k in en) {
        o[en[k]] = v[k];
    }
    return o;
};

export enum PveFightAnmNames {
    IDLE = 'stand',
    WALK = 'walk',
    ATTACK = 'atk',
    CASTING1 = 'casting1',
    CASTING2 = 'casting2',
    SKILL = 'skill1',
    SKILL21 = 'skill2_1',
    SKILL22 = 'skill2_2',
    SKILL23 = 'skill2_3',
    HIT = 'hit',
    DIE = 'die',
    DEFAULT = 'default',
};

export enum PveFightAnmNameEnum {
    IDLE,
    WALK,
    ATTACK,
    CASTING1,
    CASTING2,
    SKILL,
    SKILL21,
    SKILL22,
    SKILL23,
    HIT,
    DIE,
    DEFAULT,
};

// 转化为值
let __fightAnmValue: any = genEnumValue(PveFightAnmNameEnum, PveFightAnmNames);
export function getPveFightAnmNameValue(v: PveFightAnmNameEnum) {
    if (cc.js.isString(v)) {
        return v;
    }
    return __fightAnmValue[v];
};

export enum PveSkillAnmNames {
    DEFAULT = 'animation',
    SKILL = 'skill1',
    SKILL21 = 'skill2_01',
    SKILL22 = 'skill2_02',
    SKILL23 = 'skill2_03',
    MOVE = "move",
    HIT = "hit",
};

export enum PveSkillAnmNameEnum {
    DEFAULT,
    SKILL,
    SKILL21,
    SKILL22,
    SKILL23,
    MOVE,
    HIT,
};

// 转化为值
let __skillAnmValue: any = genEnumValue(PveSkillAnmNameEnum, PveSkillAnmNames);
export function getPveSkillAnmNameValue(v: PveSkillAnmNameEnum) {
    if (cc.js.isString(v)) {
        return v;
    }
    return __skillAnmValue[v];
};

export enum PveSkillEvents {
    TargetComplete, // 目标动画播放完成
    Start, // 技能效果动画开始
    Hit, // 技能效果击中目标
    Bomb, // 技能效果变为爆炸效果
    Hurt, // 技能效果产生伤害
    Complete, // 所有技能效果播放完成后
    Immediate, // 立即结束
};

export enum PveFightAnmEvents {
    NONE = 'none',
    ATTACK = 'atk',
    QUAKE = 'quake',
    QUAKE_STRONG = 'quake_strong',
    REPEL = 'repel',
    JUMP = 'jump',
    RANGE_BEGIN = 'range_begin',
    SOUND = 'sound',
    CALLER = 'caller',
};

export enum PveFightAnmEventEnum {
    NONE,
    ATTACK,
    QUAKE,
    QUAKE_STRONG,
    REPEL,
    JUMP,
};

// 转化为值
let __fightAnmEventalue: any = genEnumValue(PveFightAnmEventEnum, PveFightAnmEvents);
export function getPveFightAnmEventValue(v: PveFightAnmEventEnum) {
    if (cc.js.isString(v)) {
        return v;
    }
    return __fightAnmEventalue[v];
};