import BagModel, { BagItem, BagType } from '../models/BagModel';
import ConfigManager from '../managers/ConfigManager';
import CostumeUtils from './CostumeUtils';
import EquipModel from '../models/EquipModel';
import EquipUtils, { AttrType } from './EquipUtils';
import GlobalUtil from './GlobalUtil';
import GuardianUtils from '../../view/role/ctrl2/guardian/GuardianUtils';
import GuideUtil from './GuideUtil';
import HeroUtils from './HeroUtils';
import ModelManager from '../managers/ModelManager';
import RoleModel, { AttTypeName } from '../models/RoleModel';
import RuneUtils from './RuneUtils';
import {
    AttrCfg,
    CostumeCfg,
    Guardian_equipCfg,
    GuardianCfg,
    HeroCfg,
    Item_equipCfg,
    Item_rubyCfg,
    ItemCfg,
    Monster2Cfg,
    MonsterCfg,
    RuneCfg,
    Tech_stoneCfg,
    UniqueCfg
    } from '../../a/config';
import { BagEvent } from '../../view/bag/enum/BagEvent';
import { EnergyStoneInfo } from '../../view/bingying/model/BYModel';

export const JewelAttName = ["atk_g", "def_g", "hp_g", "hit_g", "crit_g",
    "punc_res_fix", "fire_res_fix", "cold_res_fix", "elec_res_fix", "radi_res_fix", "atk_res_fix",
    "dmg_punc_fix", "dmg_fire_fix", "dmg_cold_fix", "dmg_elec_fix", "dmg_radi_fix", "atk_dmg_fix", "dmg_add", "dmg_res"]

export const ColorString = ["#34c61c", "#549afa", "#d856fd", "#cc7a17", "#cc7a17", "#f15050"]
export const ColorInfo = [
    { title: "白色", color: "#e2e2e2", outline: "#4d4d4d" },
    { title: "绿色", color: "#a0edcc", outline: "#066d41" },
    { title: "蓝色", color: "#b7e6ff", outline: "#2d58c1" },
    { title: "紫色", color: "#fdb8ff", outline: "#a502af" },
    { title: "金色", color: "#fffd61", outline: "#af3702" },
    { title: "红色", color: "#ffa78f", outline: "#b91314" },
]

export const GemTypeText = ["辐射", "火焰", "冰冻", "电能", "穿刺"]

/** 
 * @Description: 背包数据管理
 * @Author: weiliang.huang  
 * @Date: 2019-03-29 17:19:20 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-07 15:49:43
 */

export default class BagUtils {

    static get model(): BagModel {
        return ModelManager.get(BagModel)
    }

    static get roleModel(): RoleModel { return ModelManager.get(RoleModel) }

    static get equipModel(): EquipModel { return ModelManager.get(EquipModel) }

    /**获取背包数据 */
    static getBagItems(): Array<BagItem> {
        return this.model.bagItems
    }

    /**根据类型和条件筛选玩家数据
     * @param type 获取类型
     * @param condition 筛选条件,如 {type:1}
     * @param selectFunc 筛选函数,传入bagitem和config数据进行判断
    */
    static getItemsByType(type: BagType, condition: any = null, selectFunc: Function = null, thisArg: any = null): BagItem[] {
        let list: BagItem[] = []
        switch (type) {
            case BagType.JEWEL:
            case BagType.ITEM:
                let bagItems = this.model.bagItems
                for (let index = 0; index < bagItems.length; index++) {
                    const element = bagItems[index];
                    if (element.type == type) {
                        list.push(element)
                    }
                }
                break;
            case BagType.EQUIP:
                list = EquipUtils.getEquipItems();
                break;
            case BagType.HERO:
                list = HeroUtils.getHeroItems();
                break;
            case BagType.RUNE:
                list = RuneUtils.getRuneItems();
                break;
            case BagType.COSTUME:
                list = CostumeUtils.getCostumeItems()
                break
            case BagType.GUARDIANEQUIP:
                list = GuardianUtils.getGuardianEquipItems()
                break
        }
        let resList = []
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            let cfg = this.getConfigById(item.itemId)
            if (condition) {
                if (!ConfigManager.isEquivalent(cfg, condition)) {
                    continue
                }
            }
            if (selectFunc) {
                if (thisArg) {
                    if (!selectFunc.call(thisArg, item, cfg)) {
                        continue
                    }
                } else if (!selectFunc(item, cfg)) {
                    continue
                }
            }
            resList.push(item)
        }
        return resList;
    }
    /**根据id获取背包物品
     * @param id 道具id
    */
    static getItemById(id: number) {
        return this.model.idItems[id]
    }

    /**获取背包物品数量  加入货币判断
     * @param id 道具id,普通物品传道具id即可,特殊物品需要传series
    */
    static getItemNumById(id: number) {
        let item: BagItem = this.getItemById(id)
        if (!item) {
            let type = BagUtils.getItemTypeById(id)
            let hasNum = 0
            if (type == BagType.MONEY) {
                hasNum = this.roleModel[AttTypeName[id]]
            } else if (type == BagType.EQUIP) {
                //加入装备数量获取
                hasNum = EquipUtils.getEquipItemNum(id)
            } else if (type == BagType.RUNE) {
                hasNum = RuneUtils.getRuneItemNum(id);
            } else if (type == BagType.GUARDIANEQUIP) {
                hasNum = GuardianUtils.getGuardianEquipNumByItemId(id)
            }
            return hasNum
        }
        return item.itemNum
    }

    /**背包物品排序方法 */
    static sortFunc(a: BagItem, b: BagItem) {
        return a.itemId - b.itemId
    }

    /**
     * 更新某个道具
     * @param id 道具序列id
     * @param extInfo 额外信息
     * @param type 道具类型,可为空
     * @param refresh 是否刷新排序并派发事件
     */
    static updateItemInfo(id: number, extInfo: icmsg.ItemInfo, refresh: boolean = true) {

        let idItems = this.model.idItems
        let bagItems = this.model.bagItems
        if (!idItems[id]) {
            let itemId = id
            let type = this.getItemTypeById(id)
            let item: BagItem = {
                series: id,
                itemId: itemId,
                itemNum: extInfo.itemNum,
                type: type,
                extInfo: extInfo
            }
            bagItems.push(item)
            idItems[id] = item
            if (refresh) {
                GlobalUtil.sortArray(bagItems, this.sortFunc)
                gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, type)
            }
        } else {
            idItems[id].itemNum = extInfo.itemNum
            idItems[id].extInfo = extInfo
            if (refresh) {
                gdk.e.emit(BagEvent.UPDATE_ONE_ITEM, idItems[id])
            }
        }

        //物品数量激活引导
        GuideUtil.activeGuide('item#' + id + '#' + extInfo.itemNum);
    }

    /**
     * 删除某个道具 
     * @param id 道具id
     * @param refresh 是否派发事件
     */
    static removeItemById(id: number, refresh: boolean = true) {
        let idItems = this.model.idItems
        let bagItems = this.model.bagItems

        if (!idItems || !idItems[id]) {
            return
        }
        let item = idItems[id]
        item.itemNum = 0
        delete idItems[id]
        for (let index = 0; index < bagItems.length; index++) {
            const element = bagItems[index];
            if (element.series == id) {
                bagItems.splice(index, 1)
                break
            }
        }
        if (refresh) {
            gdk.e.emit(BagEvent.REMOVE_ITEM, id)
            gdk.e.emit(BagEvent.UPDATE_ONE_ITEM, item)
        }
    }

    /**
     * 根据道具id获取基础配置
     * @param itemId 道具配表id
     * @param type 物品类型
     */
    static getConfigById(itemId: number, type?: BagType) {
        if (!type) {
            type = this.getItemTypeById(itemId)
        }
        switch (type) {
            case BagType.MONEY:
            case BagType.ITEM:
                return ConfigManager.getItemById(ItemCfg, itemId)

            case BagType.EQUIP:
                return ConfigManager.getItemById(Item_equipCfg, itemId)

            case BagType.HERO:
                return ConfigManager.getItemById(HeroCfg, itemId)

            case BagType.JEWEL:
                return ConfigManager.getItemById(Item_rubyCfg, itemId)

            case BagType.MONSTER:
                return (itemId >= 100000) ? ConfigManager.getItemById(Monster2Cfg, itemId) : ConfigManager.getItemById(MonsterCfg, itemId);

            case BagType.RUNE:
                return ConfigManager.getItemById(RuneCfg, parseInt(itemId.toString().slice(0, 6)))

            case BagType.COSTUME:
                return ConfigManager.getItemById(CostumeCfg, itemId)

            case BagType.GUARDIAN:
                return ConfigManager.getItemById(GuardianCfg, itemId)

            case BagType.GUARDIANEQUIP:
                return ConfigManager.getItemById(Guardian_equipCfg, itemId)

            case BagType.ENERGSTONE:
                return ConfigManager.getItemById(Tech_stoneCfg, itemId);
            case BagType.UNIQUEEQUIP:
                return ConfigManager.getItemById(UniqueCfg, itemId);
            default:
                return null
        }
    }

    /**
     * 根据道具id获取道具类型
     * @param id 物品id
     */
    static getItemTypeById(id: number): BagType {
        if (!id) return 0;
        if (id.toString().length > 7) {
            id = parseInt(id.toString().slice(0, 6))
        }
        let type = Math.floor(id / 100000)
        return type
    }

    /**获得物品 */
    static getItem(item: BagItem, remain: number = 1): BagItem {
        let idItems = this.model.idItems
        let bagItem = idItems[item.series]
        if (bagItem) {
            bagItem.itemNum = remain
            if (bagItem.extInfo instanceof icmsg.ItemInfo) {
                bagItem.extInfo.itemNum = remain
            }
            item.extInfo = bagItem.extInfo
            gdk.e.emit(BagEvent.UPDATE_ONE_ITEM, bagItem)
        }
        else if (!item.extInfo) {
            let extInfo = new icmsg.ItemInfo
            extInfo.itemId = item.itemId
            extInfo.itemNum = remain
            this.updateItemInfo(item.series, <icmsg.ItemInfo>item.extInfo)
        }
        return item
    }

    /**根据宝石id获取宝石的属性信息 
     * 目前宝石属性只会有一条
    */
    static getJewelAttrById(id: number): AttrType[] {
        let cfg = this.getConfigById(id, BagType.JEWEL)
        let arr = []
        for (let index = 0; index < JewelAttName.length; index++) {
            const _key = JewelAttName[index];
            if (cfg[_key]) {
                let typeCfg = ConfigManager.getItemById(AttrCfg, _key)
                let info: AttrType = {
                    name: typeCfg.name,
                    value: cfg[_key],
                    type: typeCfg.type
                }
                arr.push(info)
            }
        }

        return arr
    }

    /**获取能量石 */
    static getEnergyStoneItems(): BagItem[] {
        let items = [];
        this.model.bagItems.forEach(i => {
            if (BagUtils.getItemTypeById(i.itemId) == BagType.ENERGSTONE) {
                i.extInfo = <EnergyStoneInfo>{
                    slot: -1,
                    itemId: i.itemId,
                    itemNum: i.itemNum,
                }
                items.push(i);
            }
        });
        return items;
    }

    /**
     * 根据宝石属性类型and宝石颜色类型and宝石等级获取该类宝石总的经验值
     * @param subType 
     * @param type 
     * @param lv 
     */
    static getJewelExpByType(subType: jewelSubType, type: jewelType, lv: number): number {
        let cfgs = ConfigManager.getItems(Item_rubyCfg, { 'type': type, 'sub_type': subType });
        let exps = 0;
        cfgs.forEach(cfg => {
            let item = BagUtils.getItemById(cfg.id);
            if (cfg.level == lv && item && item.itemNum > 0) exps += item.itemNum * cfg.exp;
        })
        return exps;
    }

    /**获取颜色cc.color */
    static getColor(color: number = 1): cc.Color {
        let str = this.getColorInfo(color).color
        return cc.color(str)
    }

    /**获取颜色描边cc.color */
    static getOutlineColor(color: number = 1): cc.Color {
        let str = this.getColorInfo(color).outline
        return cc.color(str)
    }

    /**获取颜色信息 */
    static getColorInfo(color: number = 1) {
        return ColorInfo[color] || ColorInfo[0]
    }
}

export enum jewelSubType {
    hurt = 1,   //伤害
    resistance   //抗性
}

export enum jewelType {
    radiate = 1, //辐射
    fire, //火焰
    ice,  //冰冻
    electric,  //电力
    puncture,  //穿刺
    generalAttack //普攻
}