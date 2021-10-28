import { EnergyStoneInfo } from '../../view/bingying/model/BYModel';
/**
 * 背包数据模型类
 * @Author: weiliang.huang
 * @Description:
 * @Date: 2019-03-19 16:46:18
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-06 10:30:42
 */


export enum BagType {
    MONEY = 0, // 金钱
    ITEM = 1,  // 道具
    EQUIP = 2, // 装备
    HERO = 3,  // 英雄
    JEWEL = 4, //宝石
    MONSTER = 5, // 怪物
    RUNE = 6, //符文
    COSTUME = 7, //神装
    GUARDIAN = 8,//守护者
    GUARDIANEQUIP = 9,//守护者装备
    ENERGSTONE = 10, //能量石
    UNIQUEEQUIP = 13, //专属装备
}

/**背包物品数据模型 */
export interface BagItem {
    series: number,
    itemId: number,
    itemNum: number,
    type: BagType,
    extInfo: icmsg.ItemInfo | icmsg.EquipInfo | icmsg.HeroInfo | icmsg.RuneInfo | icmsg.CostumeInfo | icmsg.Guardian | icmsg.GuardianEquip | EnergyStoneInfo | icmsg.UniqueEquip,
}

export default class BagModel {
    /**背包服务器数据 */
    bagItems: BagItem[] = [];

    /**宝石数据 */
    jewelItems: BagItem[] = [];

    /**背包ID对应道具的物品表 */
    idItems: { [id: number]: BagItem } = {};

    /**已解锁格子数 */
    unlockNum: number = 120;

    /**最大格子数 */
    maxGridNum: number = 1200

    /** 是否打开分解界面*/
    openDecompose: boolean = false

    /**记录物品tip的临时变量 */
    tipsRecordItem: BagItem = null

    /**记录当次获得的英雄碎片 */
    heroChips: BagItem[] = []

    /**物品今日使用次数记录 */
    itemUsedMap: { [id: number]: number } = {};
}