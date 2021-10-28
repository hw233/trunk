import { BagItem } from './BagModel';

/**
 * @Description: 装备数据模型类
 * @Author: weiliang.huang
 * @Date: 2019-04-10 10:04:32
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-08 10:55:06
 */

export default class EquipModel {

    /**装备服务器数据 */
    equipItems: Array<BagItem> = null;

    /**ID对应道具的物品表 */
    idItems: any = {};


    equipMergeSkillLv = []//[oldSkillLv, newSkillLv]


    /**专属装备数据 */
    uniqueEquipItems: Array<BagItem> = []
    uniqueIdItems: { [id: number]: BagItem } = {}
    uniqueUpStarMaterialId = []
}
