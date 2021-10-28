
/**
 * Pve技能相关常量定义
 * @Author: sthoo.huang
 * @Date: 2019-05-08 19:13:41
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-21 15:00:19
 */

export enum PveTargetType {
    TargetCenter = 0,   // 目标中心
    AttackerCenter = 1, // 施法者中心
    Current = 2,    // 当前坐标
    TargetStand = 3,    // 目标站立位
    AttackerStand = 4,  // 施法者站立位
    FixedPos = 5,       //固定位置
    TargetFirstPos = 6,       //发现目标时，目标的位置
    AttackerStartPos = 7,         //施法者初始位置  
    TargetStartPos = 8,         //目标初始位置
    sceneCenterPos = 9,         //屏幕中心点
    weaponLeftPos = 10,          //神器技能从左到右技能左边点坐标
    weaponRightPos = 11,         //神器技能从左到右技能右边点坐标
    TargetNearstRoadPos = 15,   //目标最近路线的坐标

    PvpFixedPos = 12,   // 竞技模式固定位置
    PvpOpponentBorn = 13, // 竞技模式对手出生点坐标
    PvpSelfBorn = 14, // 竞技模式己方出生点坐标
};

export enum PveIgnoreType {
    None = 0,
    LastDamaged = 1,
    AllDamaged = 2,
};

export enum PveTrackType {
    None = 0,
    Linear = 1,
    Bezier = 2,
    LinearTrap = 3,
    LinearDrag = 4,
    LinkDrag = 5,
    LinDanBezier = 6,
};

export class PveSkillType {

    // 是否为普攻
    static isNormal(type: number): boolean {
        return type > 400 && type < 500;
    }

    // 是否非普攻TD释放型技能
    static isAutoTDSkill(type: number): boolean {
        return type > 0 && type < 100;
    }

    // 是否为TD释放型技能
    static isAutoTD(type: number): boolean {
        return (type > 0 && type < 100) || (type > 400 && type < 500) || (type > 700 && type < 800);
    }

    // 是否为TD指挥技能
    static isManualTD(type: number): boolean {
        return type > 100 && type < 200;
    }

    // 是否为光环技能
    static isHalo(type: number): boolean {
        return type > 200 && type < 300;
    }

    // 是否为强化技能
    static isExt(type: number): boolean {
        return type > 300 && type < 400;
    }

    // 是否为超绝技能
    static isSuper(type: number): boolean {
        return type > 500 && type < 600;
    }

    // 是否为点击触发
    static isClick(type: number): boolean {
        return type > 600 && type < 700;
    }

    // 是否竞技塔防技能
    static isPvP(type: number): boolean {
        return type > 700 && type < 800;
    }
}