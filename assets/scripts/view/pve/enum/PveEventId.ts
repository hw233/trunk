/**
 * Pve全局事件ID定义
 * @Author: sthoo.huang 
 * @Date: 2019-02-21 13:53:14
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-03-11 17:18:33
 */

export default class PveEventId {

    static PVE_CREATE_ENEMY: string = "PVE_CREATE_ENEMY";    // 创建怪物
    static PVE_CREATE_CALLER: string = "PVE_CREATE_CALLER";    // 创建召唤物
    static PVE_CREATE_TRAP: string = "PVE_CREATE_TRAP";    // 创建陷阱
    static PVE_CREATE_GATE: string = "PVE_CREATE_GATE";    // 创建传送门
    static PVE_STOP_GENERAL_SKILL: string = "PVE_STOP_GENERAL_SKILL"; //禁止指挥官技能
    static PVE_REDUCE_GENERALWEAPON_SKILLCD: string = "PVE_REDUCE_GENERALWEAPON_SKILLCD"; //禁止指挥官技能
    static PVE_APPEND_OPPSITE_ENEMIES: string = "PVE_APPEND_OPPSITE_ENEMIES"; // 添加至对手怪物列表队列
    static PVE_GENERAL_UNLOCK_SKILL: string = "PVE_GENERAL_UNLOCK_SKILL";
    static PVE_SURVIVAL_EQUIOBUR: string = "PVE_SURVIVAL_EQUIOBUR";  //生存训练装备购买成功消息
    static PVE_GATE_CONDITION_UPDATE: string = "PVE_GATE_CONDITION_UPDATE"; //战斗通关条件状态更新
};

//混合进GDK中的全局事件定义
gdk.EventId.mixins(PveEventId);