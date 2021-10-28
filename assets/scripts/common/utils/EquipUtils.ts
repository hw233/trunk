import BagUtils from './BagUtils';
import ConfigManager from '../managers/ConfigManager';
import EquipModel from '../models/EquipModel';
import GlobalUtil from './GlobalUtil';
import GuideUtil from './GuideUtil';
import HeroModel from '../models/HeroModel';
import ModelManager from '../managers/ModelManager';
import { AttrCfg, Item_equipCfg } from '../../a/config';
import { BagEvent } from '../../view/bag/enum/BagEvent';
import { BagItem, BagType } from '../models/BagModel';
import { mergeResultItem } from '../../view/role/ctrl2/equip/merge/EquipMergeCheckPanelCtrl';
import { MoneyType } from '../../view/store/ctrl/StoreViewCtrl';
import { RoleEventId } from '../../view/role/enum/RoleEventId';

// 装备属性字段
export const EquipAttr = ["atk_g", "def_g", "hp_g", "hit_g", "dodge_g", "crit_g"]

// 装备属性类型
export enum EquipAttrTYPE {
    "W" = "w",   // 白字属性
    "G" = "g",   // 绿字属性
    "R" = "r",   // 百分比属性
}

export interface AttrType {
    name: string,
    value: number,
    type: string,
    id?: number,
    keyName?: string,
    initValue?: number,
}

/**
 * @Description: 装备工具类
 * @Author: weiliang.huang
 * @Date: 2019-04-10 10:17:20
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-13 20:43:12
 */
export default class EquipUtils {

    static get model(): EquipModel {
        return ModelManager.get(EquipModel)
    }


    /**获取装备数据 */
    static getEquipItems(): Array<BagItem> {
        return this.model.equipItems
    }

    /**
     * 获取装备数据
     * @param id
     */
    static getEquipData(id: number): BagItem {
        if (this.model.idItems[id]) {
            return this.model.idItems[id]
        }
    }


    static getEquipItemNum(id: number): number {
        let item: BagItem = this.getEquipData(id)
        if (item) {
            return item.itemNum
        }
        return 0
    }

    /**
     * 更新某个道具
     * @param id 道具序列id
     * @param extInfo 额外信息
     * @param refresh 是否刷新排序并派发事件
     */
    static updateEquipInfo(id: number, extInfo: icmsg.EquipInfo, refresh: boolean = true) {
        let idItems = this.model.idItems
        let equipItems = this.model.equipItems
        if (!idItems[id]) {
            let item: BagItem = {
                series: id,
                itemId: extInfo.equipId,
                itemNum: extInfo.equipNum,
                type: BagType.EQUIP,
                extInfo: extInfo
            }
            equipItems.push(item)
            idItems[id] = item
            if (refresh) {
                GlobalUtil.sortArray(equipItems, this.sortFunc)
                gdk.e.emit(RoleEventId.UPDATE_EQUIP_LIST, BagType.EQUIP)
            }
        } else {
            // if (extInfo.heroId > 0) {
            //     GuideUtil.activeGuide('equip#wear')
            // }
            idItems[id].itemNum = extInfo.equipNum
            idItems[id].extInfo = extInfo
            if (refresh) {
                gdk.e.emit(RoleEventId.UPDATE_ONE_EQUIP, idItems[id])
            }
        }
        gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.EQUIP)
    }

    /**物品排序方法 */
    static sortFunc(a: BagItem, b: BagItem) {
        return a.itemId - b.itemId
    }

    /**
     * 删除某个道具
     * @param id 道具id
     * @param refresh 是否派发事件
     */
    static removeEquipById(id: number, refresh: boolean = true) {
        let idItems = this.model.idItems
        let equipItems = this.model.equipItems
        if (!idItems || !idItems[id]) {
            return
        }
        delete idItems[id]
        for (let index = 0; index < equipItems.length; index++) {
            const element = equipItems[index];
            if (element.series == id) {
                equipItems.splice(index, 1)
                break
            }
        }
        if (refresh) {
            // gdk.e.emit(BagEvent.REMOVE_ITEM, id)
            // gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.EQUIP)
            gdk.e.emit(RoleEventId.REMOVE_ONE_EQUIP, id)
        }
    }

    /**
     * 更新装备穿戴状态
     * @param equipId 装备ID
     * @param heroId 穿戴英雄id 0为无穿戴
     */
    static updateEquipState(equipId, heroId) {
        if (equipId == 0) {
            return
        }
        let equip: BagItem = this.model.idItems[equipId]
        let cfg: Item_equipCfg = <Item_equipCfg>BagUtils.getConfigById(equipId)
        let data = { heroId: heroId, part: cfg.part, equipId: equipId }
        if (!equip) {
            gdk.e.emit(RoleEventId.RSP_EQUIP_OFF, data)
            return
        }
        if (heroId == 0) {
            gdk.e.emit(RoleEventId.RSP_EQUIP_OFF, data)
        } else {
            GuideUtil.activeGuide('equip#wear')
            gdk.e.emit(RoleEventId.UPDATE_ONE_EQUIP, equip)
        }

    }

    static getEquipAttrNum(id) {
        let equipCfg = ConfigManager.getItemById(Item_equipCfg, id)
        let infoArr = []
        for (let index = 0; index < EquipAttr.length; index++) {
            const _key = EquipAttr[index];
            if (equipCfg[_key]) {
                let attrCfg = ConfigManager.getItemById(AttrCfg, _key)
                let info: AttrType = {
                    name: attrCfg.name,
                    value: equipCfg[_key],
                    type: attrCfg.type
                }
                infoArr.push(info)
            }
        }
        return infoArr
    }


    /**一键合成 需要消耗多少金币 */
    static getOneKeyEquipMergeCost(partType) {
        let cost = 0
        let tempCost = 0
        let cfgs = ConfigManager.getItemsByField(Item_equipCfg, "part", partType)
        let result: mergeResultItem[] = []
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].target_equip && cfgs[i].target_equip > 0) {
                let equipCfg = ConfigManager.getItemById(Item_equipCfg, cfgs[i].id)
                let targetEquip = ConfigManager.getItemById(Item_equipCfg, equipCfg.target_equip)
                let num = BagUtils.getItemNumById(equipCfg.id)
                let item: mergeResultItem = {
                    needCfg: equipCfg,
                    cfg: targetEquip,
                    num: num,
                }
                result.push(item)
            }
        }
        let showItems = []
        for (let i = 0; i < result.length; i++) {
            let mergeNum = Math.floor(result[i].num / result[i].needCfg.material_number)
            if (mergeNum == 0) {
                result[i].num = 0
                continue
            }
            result[i].num = mergeNum
            if (result[i + 1]) {
                let num = Math.floor((mergeNum + result[i + 1].num) / result[i].cfg.material_number)
                if (num > 0) {
                    result[i].num = (mergeNum + result[i + 1].num) % result[i].cfg.material_number
                }
            }
            if (result[i + 1]) {
                result[i + 1].num += mergeNum
            }
            tempCost += result[i].needCfg.consumption[1] * mergeNum
            if (GlobalUtil.getMoneyNum(MoneyType.Gold) < tempCost) {
                return cost > 0 ? cost : tempCost
            }
            cost += result[i].needCfg.consumption[1] * mergeNum

            if (result[i].num > 0) {
                showItems.push(result[i])
            }
        }
        return cost
    }



    /**获取专属装备数据 */
    static getUniqueEquipItems(): Array<BagItem> {
        return this.model.uniqueEquipItems
    }

    /**
     * 获取专属装备数据
     * @param id
     */
    static getUniqueEquipData(id: number): BagItem {
        if (this.model.uniqueIdItems[id]) {
            return this.model.uniqueIdItems[id]
        }
    }

    /**
     * 更新专属装备
     * @param id 道具序列id
     * @param extInfo 额外信息
     * @param refresh 是否刷新排序并派发事件
     */
    static updateUniqueEquipInfo(id: number, extInfo: icmsg.UniqueEquip, refresh: boolean = true) {
        let idItems = this.model.uniqueIdItems
        let equipItems = this.model.uniqueEquipItems
        if (!idItems[id]) {
            let item: BagItem = {
                series: extInfo.id,
                itemId: extInfo.itemId,
                itemNum: 1,
                type: BagType.UNIQUEEQUIP,
                extInfo: extInfo
            }
            equipItems.push(item)
            idItems[id] = item
            if (refresh) {
                GlobalUtil.sortArray(equipItems, this.sortFunc)
                gdk.e.emit(RoleEventId.UPDATE_UNIQUEEQUIP_LIST)
            }
        } else {
            idItems[id].extInfo = extInfo
            if (refresh) {
                gdk.e.emit(RoleEventId.UPDATE_ONE_UNIQUEEQUIP, idItems[id])
            }
        }
    }

    /**
     * 删除某个道具
     * @param id 道具id
     * @param refresh 是否派发事件
     */
    static removeUniqueEquipById(id: number, refresh: boolean = true) {
        let idItems = this.model.uniqueIdItems
        let equipItems = this.model.uniqueEquipItems
        if (!idItems || !idItems[id]) {
            return
        }
        delete idItems[id]
        for (let index = 0; index < equipItems.length; index++) {
            const element = equipItems[index];
            if (element.series == id) {
                equipItems.splice(index, 1)
                break
            }
        }
        if (refresh) {
            gdk.e.emit(RoleEventId.REMOVE_ONE_UNIQUEEQUIP, id)
        }
    }

    /**专属装备所属英雄 
     * 
     * 参数：装备唯一id*/
    static getUniqueEquipInHeroInfo(id: number) {
        let heroInfos = ModelManager.get(HeroModel).heroInfos
        for (let i = 0; i < heroInfos.length; i++) {
            let heroInfo = heroInfos[i].extInfo as icmsg.HeroInfo
            if (heroInfo.uniqueEquip && heroInfo.uniqueEquip.id == id) {
                return heroInfo
            }
        }
        return null
    }


    /**是否拥有该专属装备 */
    static hasUniqueEquipByItemId(itemId: number) {
        //背包里的
        let items = this.model.uniqueEquipItems
        for (let i = 0; i < items.length; i++) {
            if (items[i].itemId == itemId) {
                return true
            }
        }
        //穿在身上的
        let heroInfos = ModelManager.get(HeroModel).heroInfos
        for (let i = 0; i < heroInfos.length; i++) {
            let heroInfo = heroInfos[i].extInfo as icmsg.HeroInfo
            if (heroInfo.uniqueEquip && heroInfo.uniqueEquip.itemId == itemId) {
                return true
            }
        }
        return false
    }
}