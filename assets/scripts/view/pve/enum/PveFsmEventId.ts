/**
 * PVE英雄相关的FSM事件定义
 * @Author: sthoo.huang
 * @Date: 2019-03-18 11:03:14
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-05-22 10:32:52
 */

export default class PveFsmEventId {
    // 场景相关
    static PVE_SCENE_ONE_KEY: string = "PVE_SCENE_ONE_KEY";
    static PVE_SCENE_ONE_KEY_NOTIP: string = "PVE_SCENE_ONE_KEY_NOTIP";
    static PVE_SCENE_ONE_KEY_FIGHT: string = "PVE_SCENE_ONE_KEY_FIGHT";
    static PVE_SCENE_QUICK_FIGHT: string = "PVE_SCENE_QUICK_FIGHT";
    static PVE_SCENE_START: string = "PVE_SCENE_START";
    static PVE_SCENE_FIGHT: string = "PVE_SCENE_FIGHT";
    static PVE_MIRROR_SCENE_FIGHT: string = "PVE_MIRROR_SCENE_FIGHT";
    static PVE_SCENE_PAUSE: string = "PVE_SCENE_PAUSE";
    static PVE_SCENE_WIN: string = "PVE_SCENE_WIN";
    static PVE_SCENE_OVER: string = "PVE_SCENE_OVER";
    static PVE_SCENE_TRY: string = "PVE_SCENE_TRY";
    static PVE_SCENE_RESTART: string = "PVE_SCENE_RESTART";
    static PVE_SCENE_RETURN: string = "PVE_SCENE_RETURN";
    static PVE_SCENE_ERROR: string = "PVE_SCENE_ERROR";
    static PVE_SCENE_DISABLE: string = "PVE_SCENE_DISABLE";
    static PVE_SCENE_REINIT: string = "PVE_SCENE_REINIT";
    static PVE_SCENE_NEXT: string = "PVE_SCENE_NEXT";
    // static PVE_SCENE_NEXT_LEVEL: string = "PVE_SCENE_NEXT_LEVEL";
    static PVE_SCENE_SURVIVAL_QUICK_FIGHT: string = "PVE_SCENE_SURVIVAL_QUICK_FIGHT";
    static PVE_PIECES_WAVE_OVER: string = "PVE_PIECES_WAVE_OVER";
    static PVE_PIECES_WAVE_START: string = "PVE_PIECES_WAVE_START";

    // 战斗对象相关
    static PVE_FIGHT_IDLE: string = "PVE_FIGHT_IDLE";
    static PVE_FIGHT_DIE: string = "PVE_FIGHT_DIE";
    static PVE_FIGHT_ATTACK: string = "PVE_FIGHT_ATTACK";
    static PVE_FIGHT_REATTACK: string = "PVE_FIGHT_REATTACK";
    static PVE_FIGHT_ACTIVE_SKILL: string = "PVE_FIGHT_ACTIVE_SKILL";
    static PVE_FIGHT_REPEL: string = "PVE_FIGHT_REPEL";
    static PVE_FIGHT_GATE: string = "PVE_FIGHT_GATE";
    static PVE_FIGHT_MANUAL_ATTACK: string = "PVE_FIGHT_MANUAL_ATTACK";
    static PVE_FIGHT_BEGIN_CUSTOM: string = "PVE_FIGHT_BEGIN_CUSTOM";
    static PVE_FIGHT_END_CUSTOM: string = "PVE_FIGHT_END_CUSTOM";
    static PVE_FIGHT_CALLTYPE_SOLDIER: string = "PVE_FIGHT_CALLTYPE_SOLDIER"
    static PVE_FIGHT_CREATEMONSTER: string = "PVE_FIGHT_CREATEMONSTER";
    static PVE_FIGHT_MONSTER_WAIT: string = "PVE_FIGHT_MONSTER_WAIT";
    static PVE_FIGHT_CREATECALL: string = "PVE_FIGHT_CREATECALL";

    // 技能相关
    static PVE_SKILL_ANIM_COMPLETE: string = "PVE_SKILL_ANIM_COMPLETE";
    static PVE_SKILL_DAMAGED: string = "PVE_SKILL_DAMAGED";
    static PVE_SKILL_ATK_ANIM: string = "PVE_SKILL_ATK_ANIM";
    static PVE_SKILL_LINEAR: string = "PVE_SKILL_LINEAR";
    static PVE_SKILL_BEZIER: string = "PVE_SKILL_BEZIER";
    static PVE_SKILL_INSTANT: string = "PVE_SKILL_INSTANT";
    static PVE_SKILL_LINEAR_TRAP: string = "PVE_SKILL_LINEAR_TRAP";
    static PVE_SKILL_LINEAR_DRAG: string = "PVE_SKILL_LINEAR_DRAG";
    static PVE_SKILL_RESEARCH: string = "PVE_SKILL_RESEARCH";
    static PVE_SKILL_SEARCH: string = "PVE_SKILL_SEARCH";
    static PVE_SKILL_LINKDRAG: string = "PVE_SKILL_LINKDRAG";
    static PVE_SKILL_LINDANBEZIER: string = "PVE_SKILL_LINDANBEZIER";

    //小游戏场景
    static PVE_LITTLEGAME_SCENE_RESTART: string = "PVE_LITTLEGAME_SCENE_RESTART";
    static PVE_LITTLEGAME_GENERAL_WALK: string = "PVE_LITTLEGAME_GENERAL_WALK";
    static PVE_LITTLEGAME_GENERAL_ATK: string = "PVE_LITTLEGAME_GENERAL_ATK";
    static PVE_LITTLEGAME_GENERAL_DIE: string = "PVE_LITTLEGAME_GENERAL_DIE";
    static PVE_LITTLEGAME_ENEMY_CHECK: string = "PVE_LITTLEGAME_ENEMY_CHECK";
    static PVE_LITTLEGAME_ENEMY_DIE: string = "PVE_LITTLEGAME_ENEMY_DIE";
    static PVE_LITTLEGAME_ENEMY_ATK: string = "PVE_LITTLEGAME_ENEMY_ATK";
    static PVE_LITTLEGAME_ENEMY_MOVE: string = "PVE_LITTLEGAME_ENEMY_MOVE";


}

// 混合进FsmEventId类中
gdk.fsm.FsmEventId.mixins(PveFsmEventId);
