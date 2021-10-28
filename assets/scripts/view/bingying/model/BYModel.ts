import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { Soldier_army_skinCfg } from '../../../a/config';
/** 
  * @Description: 兵营数据管理器
  * @Author: weiliang.huang  
  * @Date: 2019-05-06 13:46:20 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-20 15:29:34
*/


export default class BYModel {

  byInfos = {}   // 兵营等级信息

  byTechInfos = {}    // 兵营科技等级信息

  soldiers: any = {}      // 士兵id表,仅保存拥有的士兵id

  byTechRecord: any = null //兵营训练界面记录标识 {sid: this.techId = id, level: this.techLv}

  bySelectType: number = 0

  byTabBtnSelectIndex: number = 0


  byLevelsData = [] //类型对应等级

  byarmyState: icmsg.SoldierSkinStateRsp = null;


  _skinCfgs: Soldier_army_skinCfg[] = []

  get skinCfgs(): Soldier_army_skinCfg[] {
    if (this._skinCfgs.length == 0) {
      this._skinCfgs = ConfigManager.getItems(Soldier_army_skinCfg);
    }
    return this._skinCfgs;
  }

  //==========聚能魔方==========//
  energizeRound: number;
  energizeTodayNum: number = 0;
  energizeDrawProgress: number;
  energizeDrawMap: { [place: number]: icmsg.EnergizePlace } = {};

  //=========科技============//
  firstInTechView: boolean = true;
  techResearchMap: { [type: number]: icmsg.SoldierTechResearch } = {}; //研发任务
  techMap: { [type: number]: icmsg.SoldierTech } = {};  //科技详情

  /**正参与科技研发的英雄 */
  get techResearchHeroList(): number[] {
    let ids = [];
    for (let key in this.techResearchMap) {
      let info = this.techResearchMap[key];
      if (info.heroId > 0) {
        ids.push(info.heroId);
      }
    }
    return ids;
  }

  /**获取科技槽上的能源石 */
  get energStoneInSlot(): Array<BagItem> {
    let items: Array<BagItem> = [];
    for (let key in this.techMap) {
      this.techMap[key].slots.forEach((s, idx) => {
        if (s > 0) {
          let obj: BagItem = {
            series: null,
            itemId: s,
            itemNum: 1,
            type: BagType.ENERGSTONE,
            extInfo: {
              slot: idx,
              itemId: s,
              itemNum: 1,
            }
          }
          items.push(obj);
        }
      });
    }
    return items;
  }

  /**获取背包里面的能源石 */
  get energStoneInBag(): Array<BagItem> {
    let items = [];
    let temp = BagUtils.getEnergyStoneItems();
    temp.forEach(t => {
      let obj: BagItem = {
        series: null,
        itemId: t.itemId,
        itemNum: t.itemNum,
        type: BagType.ENERGSTONE,
        extInfo: {
          slot: -1,
          itemId: t.itemId,
          itemNum: t.itemNum,
        }
      }
      items.push(obj);
    });
    return items;
  }
}


export type EnergyStoneInfo = {
  slot: number; // -1背包 0-3科技槽位上
  itemId: number;
  itemNum: number;
}