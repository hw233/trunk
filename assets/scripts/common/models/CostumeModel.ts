import HeroModel from './HeroModel';
import HeroUtils from '../utils/HeroUtils';
import ModelManager from '../managers/ModelManager';
import { BagItem, BagType } from './BagModel';


/**
 * @Description: 角色英雄,装备数据类
 * @Author:luoyong
 * @Date: 2020-12-27 16:53:10
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-30 16:52:52
 */

export default class CostumeModel {

    /**神装服务器数据 */
    costumeItems: Array<BagItem> = null;

    // runeInHeros: Array<BagItem> = [];   //

    /**ID对应道具的物品表 */
    idItems: any = {};

    /**上阵英雄身上的神装数据 */
    get costumeInHeros(): Array<BagItem> {
        let upList = ModelManager.get(HeroModel).curUpHeroList(0);
        let items = [];
        upList.forEach(heroId => {
            let info = HeroUtils.getHeroInfoByHeroId(heroId);
            if (info) {
                info.costumeIds.forEach(element => {
                    if (element) {
                        if (element.id > 0) {
                            let i: BagItem = {
                                series: element.id,
                                itemId: element.typeId,
                                itemNum: 1,
                                type: BagType.COSTUME,
                                extInfo: element
                            };
                            items.push(i);
                        }
                    }
                });
            }
        });
        return items;
    }
}