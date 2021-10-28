import ConfigManager from '../managers/ConfigManager';
import EquipUtils from './EquipUtils';
import { BagItem } from '../models/BagModel';
import { Item_equipCfg } from '../../a/config';

/**
 * @Description:  宝石工具类
 * @Author: luoyong
 * @Date: 2019-09-30 11:27:32
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 10:57:17
 */

export default class JewelUtils {

    /**获得宝石最高等级 */
    static getJewelMaxLv(equipId) {
        let maxLv = 0
        let equip = EquipUtils.getEquipData(equipId)
        let extInfo = <icmsg.EquipInfo>equip.extInfo
        let cfg: Item_equipCfg = ConfigManager.getItemById(Item_equipCfg, equip.itemId)
        return cfg.diamond_lv
    }


    static hasRuby(item: BagItem) {
        // let extInfo = item.extInfo as EquipInfo
        // let rubys = extInfo.rubies
        // for (let i = 0; i < rubys.length; i++) {
        //     if (rubys[i] > 0) {
        //         return true
        //     }
        // }
        return false
    }
}