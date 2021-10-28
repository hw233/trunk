import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from './GlobalUtil';
import ModelManager from '../managers/ModelManager';
import RuneModel from '../models/RuneModel';
import { BagEvent } from '../../view/bag/enum/BagEvent';
import { BagItem, BagType } from '../models/BagModel';
import { RoleEventId } from '../../view/role/enum/RoleEventId';
import { RuneCfg } from '../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-09 11:36:33 
  */
export default class RuneUtils {

    static get model(): RuneModel {
        return ModelManager.get(RuneModel)
    }


    /**获取符文数据 */
    static getRuneItems(): Array<BagItem> {
        return this.model.runeItems
    }

    /**
     * 获取符文数据
     * @param id
     */
    static getRuneData(id: number): BagItem {
        if (this.model.idItems[id]) {
            return this.model.idItems[id]
        }
    }


    static getRuneItemNum(id: number): number {
        let item: BagItem = this.getRuneData(id)
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
    static updateRuneInfo(id: number, extInfo: icmsg.RuneInfo, refresh: boolean = true) {
        let idItems = this.model.idItems
        let runeItems = this.model.runeItems
        if (!idItems[id]) {
            let item: BagItem = {
                series: id,
                itemId: extInfo.id,
                itemNum: extInfo.num,
                type: BagType.RUNE,
                extInfo: extInfo
            }
            runeItems.push(item)
            idItems[extInfo.id] = item
            if (refresh) {
                GlobalUtil.sortArray(runeItems, this.sortFunc)
                // gdk.e.emit(RoleEventId.UPDATE_EQUIP_LIST, BagType.EQUIP)
                gdk.e.emit(RoleEventId.RUNE_ADD);
            }
        } else {
            idItems[extInfo.id].itemNum = extInfo.num
            idItems[extInfo.id].extInfo = extInfo
            if (refresh) {
                gdk.e.emit(RoleEventId.RUNE_ADD);
                // gdk.e.emit(RoleEventId.UPDATE_ONE_EQUIP, idItems[id])
            }
        }
        gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.RUNE)
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
    static removeRuneById(id: number, refresh: boolean = true) {
        let idItems = this.model.idItems
        let runeItems = this.model.runeItems
        if (!idItems || !idItems[id]) {
            return
        }
        delete idItems[id]
        for (let index = 0; index < runeItems.length; index++) {
            const element = runeItems[index];
            if (element.series == id) {
                runeItems.splice(index, 1)
                break
            }
        }
        if (refresh) {
            // gdk.e.emit(BagEvent.REMOVE_ITEM, id)
            gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.RUNE)
            // gdk.e.emit(RoleEventId.REMOVE_ONE_EQUIP, id)
            gdk.e.emit(RoleEventId.RUNE_REMOVE);
        }
    }

    /**
     * 更新符文穿戴状态
     * @param equipId 装备ID
     * @param heroId 穿戴英雄id 0为无穿戴
     */
    // static updateRuneState(runeId, heroId) {
    //     if (runeId == 0) {
    //         return
    //     }
    //     if (heroId) {
    //         let idItems = this.model.idItems
    //         let runeItems = this.model.runeItems
    //         if (!idItems || !idItems[runeId]) {
    //             return
    //         }
    //         delete idItems[runeId]
    //         for (let index = 0; index < runeItems.length; index++) {
    //             const element = runeItems[index];
    //             if (element.series == runeId) {
    //                 runeItems.splice(index, 1)
    //                 break
    //             }
    //         }
    //         gdk.e.emit(RoleEventId.RUNE_ON);
    //     }
    //     else {
    //         let runeInfo = new RuneInfo();
    //         runeInfo.id = runeId;
    //         runeInfo.num = this.getRuneItemNum(runeId) + 1;
    //         this.updateRuneInfo(runeId, runeInfo, true);
    //         gdk.e.emit(RoleEventId.RUNE_OFF);
    //     }
    // }

    /**
     * 
     */
    static getMaterialsRune([type, color, num]: [number, number, number]) {
        let items = [];
        this.model.runeItems.forEach(item => {
            if (item.itemId.toString().length == 6) {
                let cfg = ConfigManager.getItemById(RuneCfg, parseInt(item.itemId.toString().slice(0, 6)));
                if (cfg.rune_id.toString().length == 6) {
                    if (type == 0 || cfg.type == type) {
                        if (color == 0) {
                            items.push(item);
                        }
                        else {
                            if (cfg.color == color) {
                                items.push(item);
                            }
                        }
                    }
                }
            }
        });
        return items;
    }

    /**
     * 根据品质&强化等级 获取符文
     * @param color 
     * @param lv 
     * @param includeMix 是否包含融合符文
     */
    static getRuneByColorAndLv(color?: number, lv?: number, includeMix: boolean = false) {
        let items = [];
        let temp = [];
        this.model.runeItems.forEach(item => {
            let cfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(item.itemId.toString().slice(0, 6)));
            if (includeMix || !cfg.mix_type) {
                if (!color || color == cfg.color) {
                    temp.push(item);
                }
            }
        });
        temp.forEach(item => {
            let cfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(item.itemId.toString().slice(0, 6)));
            if (!lv || lv == cfg.level) {
                items.push(item);
            }
        });
        return items;
    }

    /**
     * 返回背包融合类符文
     */
    static getMixRunes(): BagItem[] {
        let items = [];
        this.model.runeItems.forEach(item => {
            if (item.itemId.toString().length == 8) {
                items.push(item);
            }
        });

        return items;
    }
}