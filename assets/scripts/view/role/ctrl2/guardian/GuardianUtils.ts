import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import {
    AttrCfg,
    Global_powerCfg,
    Guardian_equip_lvCfg,
    Guardian_equip_skillCfg,
    Guardian_equip_starCfg,
    Guardian_equipCfg,
    Guardian_starCfg,
    GuardianCfg
    } from '../../../../a/config';
import { AttrType } from '../../../../common/utils/EquipUtils';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { BagItem, BagType } from '../../../../common/models/BagModel';
import { GuardianEquipAttr } from './equip/GuardianEquipPanelCtrl';
import { RoleEventId } from '../../enum/RoleEventId';

/** 
 * @Description: 守护者数据管理
 * @Author: weiliang.huang  
 * @Date: 2019-03-29 17:19:20 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 17:06:14
 */


export default class GuardianUtils {

    static get model(): GuardianModel {
        return ModelManager.get(GuardianModel)
    }

    /**获取守护者数据 */
    static getGuardianItems(): Array<BagItem> {
        return this.model.guardianItems
    }

    /**
     * 获取守护者数据
     * @param id
     */
    static getGuardianData(id: number): BagItem {
        if (this.model.idItems[id]) {
            return this.model.idItems[id]
        }
    }


    /**守护者所属英雄 唯一id*/
    static getGuardianHeroInfo(id: number) {
        let heroInfos = ModelManager.get(HeroModel).heroInfos
        for (let i = 0; i < heroInfos.length; i++) {
            let heroInfo = heroInfos[i].extInfo as icmsg.HeroInfo
            if (heroInfo.guardian && heroInfo.guardian.id == id) {
                return heroInfo
            }
        }
        return null
    }

    /**是否拥有该守护者  物品id */
    static getOwnGuardianByTypeId(id) {
        let items = this.model.guardianItems
        for (let i = 0; i < items.length; i++) {
            if (items[i].itemId == id) {
                return true
            }
        }
        return false
    }


    /**指定类型的 可使用的守护者 数量 
     * 参数为0 取所有
    */
    static getFreeGuardianNum(typeId) {
        let num = 0
        let items = this.model.guardianItems
        for (let i = 0; i < items.length; i++) {
            if (items[i].itemId == typeId || typeId == 0) {
                let heroInfo = this.getGuardianHeroInfo(items[i].series)
                if (!heroInfo) {
                    num++
                }
            }
        }
        return num
    }

    /**
     * 更新某个道具
     * @param id 道具序列id
     * @param extInfo 额外信息
     * @param refresh 是否刷新排序并派发事件
     */
    static updateGuardian(id: number, extInfo: icmsg.Guardian, refresh: boolean = true) {
        let idItems = this.model.idItems
        let guardianItems = this.model.guardianItems
        if (!idItems[id]) {
            let item: BagItem = {
                series: id,
                itemId: extInfo.type,//配置里的序号id 
                itemNum: 1,
                type: BagType.GUARDIAN,
                extInfo: extInfo
            }
            guardianItems.push(item)
            idItems[id] = item
            if (refresh) {
                GlobalUtil.sortArray(guardianItems, this.sortFunc)
            }
        } else {
            idItems[id].extInfo = extInfo
        }
        let heroInfo = this.getGuardianHeroInfo(id)
        if (heroInfo) {
            HeroUtils.updateHeroGuardian(heroInfo.heroId, extInfo)
        }
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
    static removeGuardianById(id: number, refresh: boolean = true) {
        let idItems = this.model.idItems
        let guardianItems = this.model.guardianItems
        if (!idItems || !idItems[id]) {
            return
        }
        delete idItems[id]
        for (let index = 0; index < guardianItems.length; index++) {
            const element = guardianItems[index];
            if (element.series == id) {
                guardianItems.splice(index, 1)
                break
            }
        }
        if (refresh) {
            // gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.COSTUME)
            // gdk.e.emit(RoleEventId.COSTUME_REMOVE);
        }
    }


    /**计算守护者的属相值显示 
     * series 唯一Id
    */
    static getGuardianAttrs(series, isStarUp: boolean = false) {
        let bagItem: BagItem = this.getGuardianData(series)
        let extInfo = bagItem.extInfo as icmsg.Guardian
        let guardianCfg = ConfigManager.getItemById(GuardianCfg, bagItem.itemId)
        let star = isStarUp ? extInfo.star + 1 : extInfo.star
        if (star > guardianCfg.star_max) {
            star = guardianCfg.star_max
        }
        return this.getGuardianConfigAttrs(bagItem.itemId, extInfo.level, star)
    }

    /**计算守护者的属相值显示 
    * itemId 以最高等级 星级计算
    */
    static getGuardianConfigAttrs(itemId: number, level: number, star: number) {
        let guardianCfg = ConfigManager.getItemById(GuardianCfg, itemId)
        let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", itemId, { star: star })

        let atk_w = Math.floor(starCfg.atk_g + (level - 1) * starCfg.grow_atk / 100)
        let hp_w = Math.floor(starCfg.hp_g + (level - 1) * starCfg.grow_hp / 100)
        let def_w = Math.floor(starCfg.def_g + (level - 1) * starCfg.grow_def / 100)
        let keys = ["atk_w", "hp_w", "def_w"]
        let initValues = [guardianCfg.atk_w, guardianCfg.hp_w, guardianCfg.def_w]
        let values = [atk_w, hp_w, def_w]
        let attrs = []
        for (let i = 0; i < keys.length; i++) {
            let attrCfg = ConfigManager.getItemById(AttrCfg, keys[i])
            if (attrCfg) {
                let info: AttrType = {
                    keyName: keys[i],
                    name: attrCfg.name,
                    value: values[i],
                    initValue: initValues[i],
                    type: attrCfg.type,
                }
                attrs.push(info)
            }
        }
        return attrs
    }

    /**守护者战力 */
    static getGuardianPower(itemId: number, level: number, star: number) {
        //  属性战力等级技能
        let attrInfos = GuardianUtils.getGuardianConfigAttrs(itemId, level, star)
        let power = 0;
        for (let i = 0; i < attrInfos.length; i++) {
            let attrInfo = attrInfos[i] as AttrType
            let ratio = ConfigManager.getItemByField(Global_powerCfg, 'key', attrInfo.keyName.replace("_w", "")).value;
            power += Math.floor(ratio * (attrInfo.value + attrInfo.initValue));
        }
        return power
    }



    /**获取守护者 装备数据 */
    static getGuardianEquipItems(): Array<BagItem> {
        return this.model.equipItems
    }

    /**
     * 获取守护者数据
     * @param id
     */
    static getGuardianEquipData(id: number): BagItem {
        if (this.model.equipIdItems[id]) {
            return this.model.equipIdItems[id]
        }
    }


    /** 同类型的守护者装备数量*/
    static getGuardianEquipNumByItemId(itemId) {
        let items = this.getGuardianEquipItems()
        let count = 0
        for (let i = 0; i < items.length; i++) {
            if (items[i].itemId == itemId) {
                count++
            }
        }
        return count
    }

    /**
    * 更新守护者装备数据
    * @param id 道具序列id
    * @param extInfo 额外信息
    * @param refresh 是否刷新排序并派发事件
    */
    static updateEquip(id: number, extInfo: icmsg.GuardianEquip, refresh: boolean = true) {
        let idItems = this.model.equipIdItems
        let equipItems = this.model.equipItems
        if (!idItems[id]) {
            let item: BagItem = {
                series: id,
                itemId: extInfo.type,//配置里的序号id 
                itemNum: 1,
                type: BagType.GUARDIANEQUIP,
                extInfo: extInfo
            }
            equipItems.push(item)
            idItems[id] = item
            if (refresh) {
                GlobalUtil.sortArray(equipItems, this.sortFunc)
            }
        } else {
            idItems[id].extInfo = extInfo
            if (refresh) {
                gdk.e.emit(RoleEventId.GUARDIANEQUIP_UPDATE);
            }
        }
        gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.GUARDIANEQUIP)
    }

    /**
    * 删除守护者装备数据
    * @param id 道具id
    * @param refresh 是否派发事件
    */
    static removeEquipById(id: number, refresh: boolean = true) {
        let idItems = this.model.equipIdItems
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
            gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.GUARDIANEQUIP)
            gdk.e.emit(RoleEventId.GUARDIANEQUIP_UPDATE);
        }
    }

    /**守护者 装备套装属性信息
     *[0] 套装数量
      [1] 套装星数
     */
    static getGuardianEquipSuitInfo(info: icmsg.Guardian) {
        let equips = info.equips
        let suitMap = {} //类型 -- 数量
        let starMap = {} //类型 ---总星数 
        for (let i = 0; i < equips.length; i++) {
            let g_equip = equips[i]
            if (!g_equip || (g_equip && g_equip.id == 0)) {
                continue
            }
            let cfg = ConfigManager.getItemById(Guardian_equipCfg, g_equip.type)
            if (!suitMap[cfg.type]) {
                suitMap[cfg.type] = 0
            }

            if (!starMap[cfg.type]) {
                starMap[cfg.type] = 0
            }
            suitMap[cfg.type] += 1
            starMap[cfg.type] += g_equip.star
        }
        return [suitMap, starMap]
    }

    /**守护者 装备的属性 统计 */
    static getGuardianEquipAttrs(info: icmsg.Guardian) {
        let equips = info.equips

        let initAttr: GuardianEquipAttr = {
            atk: 0,
            hp: 0,
            def: 0,
            hit: 0,
            dodge: 0
        }

        let addAttr: GuardianEquipAttr = {
            atk: 0,
            hp: 0,
            def: 0,
            hit: 0,
            dodge: 0
        }

        for (let i = 0; i < equips.length; i++) {
            let equip = equips[i]
            if (!equip || (equip && equip.id == 0)) {
                continue
            }
            let equipCfg = ConfigManager.getItemById(Guardian_equipCfg, equip.type)
            let starCfg = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", equip.star, { type: equipCfg.type, part: equipCfg.part })
            let lvCfg = ConfigManager.getItemByField(Guardian_equip_lvCfg, "type", equipCfg.type, { part: equipCfg.part, lv: equip.level })
            if (!lvCfg) {
                continue
            }
            //基础属性
            initAttr.atk += starCfg.atk_g
            initAttr.hp += starCfg.hp_g
            initAttr.def += starCfg.def_g
            initAttr.hit += starCfg.hit_g
            initAttr.dodge += starCfg.dodge_g

            //强化升星增加的
            addAttr.atk += lvCfg.atk_growth
            addAttr.hp += lvCfg.hp_growth
            addAttr.def += lvCfg.def_growth
            addAttr.hit += lvCfg.hit_growth
            addAttr.dodge += lvCfg.dodge_growth
        }


        //总星数加成 待算
        let suitInfo = this.getGuardianEquipSuitInfo(info)
        let suitMap = suitInfo[0]
        let starMap = suitInfo[1]
        let totalStar = 0
        for (let type in starMap) {
            totalStar += starMap[type]
        }
        let suitCfgs: Guardian_equip_skillCfg[] = []
        for (let key in suitMap) {
            let type = parseInt(key)
            let cfgs = ConfigManager.getItems(Guardian_equip_skillCfg, { type: type })
            cfgs = cfgs.reverse()
            let equipNum = suitMap[type]
            for (let i = 0; i < cfgs.length; i++) {
                if (totalStar >= cfgs[i].star && equipNum >= cfgs[i].number) {
                    suitCfgs.push(cfgs[i])
                    break
                }
            }
        }

        let addObj = {
            atk_g: 0,
            hp_g: 0,
            def_g: 0,
            hit_g: 0,
            dodge_g: 0,
        }
        for (let i = 0; i < suitCfgs.length; i++) {
            addObj.atk_g += suitCfgs[i].equip_atk
            addObj.hp_g += suitCfgs[i].equip_hp
            addObj.def_g += suitCfgs[i].equip_def
            addObj.hit_g += suitCfgs[i].equip_hit
            addObj.dodge_g += suitCfgs[i].equip_dodge
        }

        let keys = ["atk_g", "hp_g", "def_g", "hit_g", "dodge_g"]
        let attrs = []
        for (let i = 0; i < keys.length; i++) {
            let attrCfg = ConfigManager.getItemById(AttrCfg, keys[i])
            if (attrCfg) {
                let info: AttrType = {
                    keyName: keys[i],
                    name: attrCfg.name,
                    value: Math.floor(addAttr[keys[i].replace("_g", "")] * (1 + addObj[keys[i]] / 10000)),
                    initValue: Math.floor(initAttr[keys[i].replace("_g", "")] * (1 + addObj[keys[i]] / 10000)),
                    type: attrCfg.type,
                }
                attrs.push(info)
            }
        }
        return attrs
    }


    /**守护者 某一件装备的属性 */
    static getTargetEquipAttr(equip: icmsg.GuardianEquip) {
        let equipCfg = ConfigManager.getItemById(Guardian_equipCfg, equip.type)
        let starCfg = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", equip.star, { type: equipCfg.type, part: equipCfg.part })
        let lvCfg = ConfigManager.getItemByField(Guardian_equip_lvCfg, "type", equipCfg.type, { part: equipCfg.part, lv: equip.level })
        if (!lvCfg) {
            return []
        }
        let initAttr: GuardianEquipAttr = {
            atk: 0,
            hp: 0,
            def: 0,
            hit: 0,
            dodge: 0
        }

        let addAttr: GuardianEquipAttr = {
            atk: 0,
            hp: 0,
            def: 0,
            hit: 0,
            dodge: 0
        }

        //基础属性
        initAttr.atk = starCfg.atk_g
        initAttr.hp = starCfg.hp_g
        initAttr.def = starCfg.def_g
        initAttr.hit = starCfg.hit_g
        initAttr.dodge = starCfg.dodge_g

        //强化升星增加的
        addAttr.atk = lvCfg.atk_growth
        addAttr.hp = lvCfg.hp_growth
        addAttr.def = lvCfg.def_growth
        addAttr.hit = lvCfg.hit_growth
        addAttr.dodge = lvCfg.dodge_growth

        let keys = ["atk_g", "hp_g", "def_g", "hit_g", "dodge_g"]
        let attrs = []
        for (let i = 0; i < keys.length; i++) {
            let attrCfg = ConfigManager.getItemById(AttrCfg, keys[i])
            if (attrCfg) {
                let info: AttrType = {
                    keyName: keys[i],
                    name: attrCfg.name,
                    value: addAttr[keys[i].replace("_g", "")],
                    initValue: initAttr[keys[i].replace("_g", "")],
                    type: attrCfg.type,
                }
                attrs.push(info)
            }
        }
        return attrs
    }


    /**指定装备突破后增加的属性 */
    static getTargetEquipBreakAddAttr(equip: icmsg.GuardianEquip) {
        let equipCfg = ConfigManager.getItemById(Guardian_equipCfg, equip.type)
        let starCfg = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", equip.star, { type: equipCfg.type, part: equipCfg.part })
        let initAttr: GuardianEquipAttr = {
            atk: 0,
            hp: 0,
            def: 0,
            hit: 0,
            dodge: 0
        }
        //基础属性
        initAttr.atk = starCfg.atk_g
        initAttr.hp = starCfg.hp_g
        initAttr.def = starCfg.def_g
        initAttr.hit = starCfg.hit_g
        initAttr.dodge = starCfg.dodge_g

        let keys = ["atk_g", "hp_g", "def_g", "hit_g", "dodge_g"]
        let attrs = []
        for (let i = 0; i < keys.length; i++) {
            let attrCfg = ConfigManager.getItemById(AttrCfg, keys[i])
            if (attrCfg) {
                let info: AttrType = {
                    keyName: keys[i],
                    name: attrCfg.name,
                    value: 0,
                    initValue: initAttr[keys[i].replace("_g", "")],
                    type: attrCfg.type,
                }
                attrs.push(info)
            }
        }
        return attrs
    }


    /**守护者 装备 战力 */
    static getTargetEquipPower(equip: icmsg.GuardianEquip) {
        let attrInfos = this.getTargetEquipAttr(equip)
        let power = 0;
        for (let i = 0; i < attrInfos.length; i++) {
            let attrInfo = attrInfos[i] as AttrType
            let ratio = ConfigManager.getItemByField(Global_powerCfg, 'key', attrInfo.keyName.replace("_g", "")).value;
            power += Math.floor(ratio * (attrInfo.value + attrInfo.initValue));
        }
        return power
    }

    /**守护者所有装备累计 战力 */
    static getTargetEquipTotalPower(guardian: icmsg.Guardian) {
        let power = 0
        let equips = guardian.equips
        for (let i = 0; i < equips.length; i++) {
            if (equips[i] && equips[i].id > 0) {
                power += this.getTargetEquipPower(equips[i])
            }
        }
        return power
    }

    /**获取指定套装 [数量,总星级]*/
    static getEquipSuitNum(type, info: icmsg.Guardian) {
        if (!info) {
            return [0, 0]
        }
        let equips = info.equips
        let star = 0
        let sutiNum = 0
        for (let i = 0; i < equips.length; i++) {
            if (type == equips[i].type) {
                sutiNum++
                star += equips[i].star
            }
        }
        return [sutiNum, star]
    }
}