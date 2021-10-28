import PveBaseBuffCtrl from '../ctrl/buff/PveBaseBuffCtrl';
import PveBaseHaloCtrl from '../ctrl/halo/PveBaseHaloCtrl';
import PveBuffModel from '../model/PveBuffModel';
import PveFightModel from './PveFightModel';
import PveHaloModel from '../model/PveHaloModel';
import PveSceneModel from '../model/PveSceneModel';
import PveSkillModel from '../model/PveSkillModel';
import { PveBuffTipType } from '../ctrl/base/PveBuffTipEffect';
import { PveFightAnmNames } from '../const/PveAnimationNames';
import { PveHurtType } from '../ctrl/base/PveHurtEffect';
import { Skill_buffCfg } from '../../../a/config';

/**
 * Pve战斗单位接口
 * @Author: sthoo.huang
 * @Date: 2019-04-22 14:52:02
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-08-31 12:02:03
 */

export interface PveFightAnimationOption {
    onComplete?: Function,
    onEvent?: Function,
    thisArg?: any,
    eventName?: string,
    mode?: 'add' | 'set',
    loop?: boolean,
    timeOut?: number,
    after?: {
        name: PveFightAnmNames,
        mode?: 'add' | 'set',
        loop?: boolean,
    }
}

export interface PveFightCtrl extends cc.Component {

    model: PveFightModel;
    sceneModel: PveSceneModel;
    readonly spines: sp.Skeleton[];
    readonly isAlive: boolean;
    readonly invisible: boolean;
    readonly fsm: gdk.fsm.Fsm;
    readonly buff: PveBaseBuffCtrl;
    readonly halo: PveBaseHaloCtrl;
    getAnimation(animation: string): string;
    setAnimation(animation: string, opt?: PveFightAnimationOption): boolean;
    getPrePos(): cc.Vec2;
    getPos(dt?: number): cc.Vec2;
    getRect(): cc.Rect;
    showHurt(hurt: number, type?: PveHurtType, dir?: number, dmg_type?: number): void;
    showBuffTip(tipStr: string, type?: PveBuffTipType, isEnemy?: boolean, bufCfg?: Skill_buffCfg): void;
    updateBuff(): void;
    addBuff(m: PveBuffModel): void;
    addHalo(m: PveHaloModel): void;
    removeBuff(id: number): void;
    removeHalo(id: number): void;

    // 每帧调用，替换update方法，为了保持调用顺序
    updateScript(dt: number): void;

    // effect
    repel(attacker: PveFightCtrl): void;

    // event triggers
    onDie: gdk.EventTrigger;

    // events
    onAttacked(attacker: PveFightCtrl, model: PveSkillModel | PveBuffModel): void;

    /**
     * 刷新护盾展示
     */
    refreshShiedShow(): void;
}