import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { GuardianEquipItemInfo } from '../ctrl2/guardian/equip/GuardianEquipStrengthenPanelCtrl';

/**
 * @Description: 角色英雄,装备数据类
 * @Author: yaozu.hu
 * @Date: 2019-03-28 16:53:10
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-29 10:59:53
 */
export default class GuardianModel {

    //守护者召唤状态
    guardianDrawState: icmsg.GuardianDrawStateRsp;
    wishItemId: number;
    enterCallView: boolean = false;

    /**守护者服务器数据 */
    guardianItems: Array<BagItem> = [];

    /**ID对应道具的物品表 */
    idItems: any = {};

    /**当前选中的英雄唯一id */
    curHeroId: number = 0
    //当前选中的守护者id 唯一id
    curGuardianId: number = 0
    //记录选择材料的唯一id
    selectIds = []

    //装备
    equipItems: Array<BagItem> = []
    /**ID对应道具的物品表 */
    equipIdItems: any = {};

    /**突破选择的材料  本体 唯一id*/
    breakSelectIds = []

    curSelectGuardianEquip: icmsg.GuardianEquip = null

    /**守护者召唤有礼*/
    callRewardInfo: icmsg.ActivityGuardianDrawInfoRsp


    /**上阵英雄身上的守护者 装备数据 */
    get guardianEquipInHeros(): Array<GuardianEquipItemInfo> {
        let upList = ModelManager.get(HeroModel).curUpHeroList(0);
        let items = [];
        upList.forEach(heroId => {
            let info = HeroUtils.getHeroInfoByHeroId(heroId);
            if (info && info.guardian) {
                info.guardian.equips.forEach(element => {
                    if (element) {
                        if (element.id > 0) {
                            let bagItem: BagItem = {
                                series: element.id,
                                itemId: element.type,
                                itemNum: 1,
                                type: BagType.GUARDIANEQUIP,
                                extInfo: element
                            };

                            let gEquipInfo: GuardianEquipItemInfo = {
                                heroId: heroId,
                                heroTypeId: info.typeId,
                                guardianId: info.guardian.id,
                                guardianTypeId: info.guardian.type,
                                bagItem: bagItem,
                                selected: false,
                            }
                            items.push(gEquipInfo);
                        }
                    }
                });
            }
        });
        return items;
    }
}
