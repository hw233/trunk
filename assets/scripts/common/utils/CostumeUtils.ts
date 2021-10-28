import BagUtils from './BagUtils';
import ConfigManager from '../managers/ConfigManager';
import CostumeModel from '../models/CostumeModel';
import GlobalUtil from './GlobalUtil';
import HeroModel from '../models/HeroModel';
import HeroUtils from './HeroUtils';
import ModelManager from '../managers/ModelManager';
import { AttrType } from './EquipUtils';
import { BagEvent } from '../../view/bag/enum/BagEvent';
import { BagItem, BagType } from '../models/BagModel';
import {
    Costume_attrCfg,
    CostumeCfg,
    Global_powerCfg,
    Hero_careerCfg
    } from '../../a/config';
import { RoleEventId } from '../../view/role/enum/RoleEventId';
/**
 * @Description: 神装相关数据
 * @Author:luoyong
 * @Date: 2020-12-28 10:54:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-05 16:05:35
 */

export default class CostumeUtils {

    static get model(): CostumeModel {
        return ModelManager.get(CostumeModel)
    }

    static get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }


    /**获取神装数据 */
    static getCostumeItems(): Array<BagItem> {
        return this.model.costumeItems
    }

    /**
     * 获取神装数据
     * @param id
     */
    static getCostumeData(id: number): BagItem {
        if (this.model.idItems[id]) {
            return this.model.idItems[id]
        }
    }

    /**
     * 更新某个道具
     * @param id 道具序列id
     * @param extInfo 额外信息
     * @param refresh 是否刷新排序并派发事件
     */
    static updateCostumeInfo(id: number, extInfo: icmsg.CostumeInfo, refresh: boolean = true) {
        let idItems = this.model.idItems
        let costumeItems = this.model.costumeItems
        if (!idItems[id]) {
            let item: BagItem = {
                series: id,
                itemId: extInfo.typeId,
                itemNum: 1,
                type: BagType.COSTUME,
                extInfo: extInfo
            }
            costumeItems.push(item)
            idItems[id] = item
            if (refresh) {
                GlobalUtil.sortArray(costumeItems, this.sortFunc)
                gdk.e.emit(RoleEventId.COSTUME_ADD);
            }
        } else {
            idItems[id].extInfo = extInfo
            if (refresh) {
                gdk.e.emit(RoleEventId.COSTUME_ADD);
                // gdk.e.emit(RoleEventId.UPDATE_ONE_EQUIP, idItems[id])
            }
        }
        gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.COSTUME)
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
    static removeCostumeById(id: number, refresh: boolean = true) {
        let idItems = this.model.idItems
        let costumeItems = this.model.costumeItems
        if (!idItems || !idItems[id]) {
            return
        }
        delete idItems[id]
        for (let index = 0; index < costumeItems.length; index++) {
            const element = costumeItems[index];
            if (element.series == id) {
                costumeItems.splice(index, 1)
                break
            }
        }
        if (refresh) {
            gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.COSTUME)
            gdk.e.emit(RoleEventId.COSTUME_REMOVE);
        }
    }

    static getCostumeAttrNum(itemInfo: BagItem) {
        let attrArr: icmsg.CostumeAttr[] = (itemInfo.extInfo as icmsg.CostumeInfo).attrs
        GlobalUtil.sortArray(attrArr, (a, b) => {
            return a.id - b.id
        })
        let infoArr = []
        for (let index = 0; index < attrArr.length; index++) {
            const _key = attrArr[index].id;
            let attrCfg = ConfigManager.getItemById(Costume_attrCfg, _key)
            if (attrCfg) {
                let info: AttrType = {
                    id: attrCfg.id,
                    name: attrCfg.attr_show,
                    value: attrArr[index].value,
                    initValue: attrArr[index].initValue,
                    type: attrCfg.attr_type,
                    keyName: attrCfg.attr[0],
                }
                infoArr.push(info)
            }
        }
        return infoArr
    }


    static getAllCostumeAttr(infos: icmsg.CostumeInfo[]) {
        let keyMap = {}
        for (let i = 0; i < infos.length; i++) {
            let attrInfos = infos[i].attrs
            GlobalUtil.sortArray(attrInfos, (a, b) => {
                return a.id - b.id
            })
            for (let j = 0; j < attrInfos.length; j++) {
                let attrCfg = ConfigManager.getItemById(Costume_attrCfg, attrInfos[j].id)
                let keys = attrCfg.attr;
                keys.forEach(key => {
                    if (!keyMap[key]) {
                        let info: AttrType = {
                            id: attrCfg.id,
                            name: attrCfg.attr_show,
                            value: attrInfos[j].value,
                            type: attrCfg.attr_type,
                            keyName: key,
                        }
                        keyMap[key] = info
                    } else {
                        keyMap[key].value += attrInfos[j].value
                    }
                });
            }
        }
        return keyMap
    }


    static getAllCostumeAttrs(infos: icmsg.CostumeInfo[]) {
        let cfgs: icmsg.CostumeAttr[] = []
        let map = {}
        for (let i = 0; i < infos.length; i++) {
            let attrInfos = infos[i].attrs
            for (let j = 0; j < attrInfos.length; j++) {
                if (!map[attrInfos[j].id]) {
                    map[attrInfos[j].id] = attrInfos[j]
                } else {
                    map[attrInfos[j].id].value = map[attrInfos[j].id].value + attrInfos[j].value
                }
            }
        }
        for (let key in map) {
            cfgs.push(map[key])
        }
        GlobalUtil.sortArray(cfgs, (a, b) => {
            return a.id - b.id
        })
        return cfgs
    }


    //套装信息
    static getCostumeSuitInfo(infos: icmsg.CostumeInfo[]) {
        let suitMap = []
        for (let i = 0; i < infos.length; i++) {
            if (infos[i].typeId > 0) {
                let c_cfg = ConfigManager.getItemById(CostumeCfg, infos[i].typeId)
                if (!suitMap[c_cfg.type]) {
                    suitMap[c_cfg.type] = [c_cfg.color]
                } else {
                    suitMap[c_cfg.type].push(c_cfg.color)
                }
            }
        }
        return suitMap
    }


    static getSuitColorNum(colors, color, isCfgNum: boolean = false) {
        let count = 0
        for (let i = 0; i < colors.length; i++) {
            if (colors[i] >= color) {
                count++
            }
        }
        if (isCfgNum && count == 3) {
            count = 2
        }
        return count
    }


    static getHeroInfoBySeriesId(id) {
        let heroInfos = this.heroModel.heroInfos
        for (let i = 0; i < heroInfos.length; i++) {
            let heroInfo = heroInfos[i].extInfo as icmsg.HeroInfo
            let costumeIds = heroInfo.costumeIds
            for (let j = 0; j < costumeIds.length; j++) {
                if (costumeIds[j].id == id) {
                    return heroInfo
                }
            }
        }
        return null
    }


    static getEquipPower(info: icmsg.CostumeInfo) {
        let attrs = info.attrs
        let power = 0
        for (let i = 0; i < attrs.length; i++) {
            let targetAttr = ConfigManager.getItemById(Costume_attrCfg, attrs[i].id)
            if (targetAttr) {
                let keys = targetAttr.attr
                keys.forEach(key => {
                    let r_key = key.replace("_g", "").replace("_r", "").replace("_w", "")
                    let powerCfg = ConfigManager.getItemById(Global_powerCfg, r_key)
                    if (powerCfg) {
                        power += attrs[i].value * powerCfg.value
                    }
                });
            }
        }
        return Math.floor(power)
    }


    static getAttrCfg(attrName) {
        let cfgs = ConfigManager.getItems(Costume_attrCfg)
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].attr.indexOf(attrName) != -1) {
                return cfgs[i]
            }
        }
        return null
    }


    static get_free_costumesByCareerAndPart(heroInfo: icmsg.HeroInfo, part) {
        let items = BagUtils.getItemsByType(BagType.COSTUME, { part: part });
        let freeItems = []
        for (let i = 0; i < items.length; i++) {
            let c_cfg = ConfigManager.getItemById(CostumeCfg, items[i].itemId)
            let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroInfo.careerId)
            if (c_cfg.career_type == careerCfg.career_type) {
                freeItems.push(items[i])
            }
        }
        return freeItems
    }
}