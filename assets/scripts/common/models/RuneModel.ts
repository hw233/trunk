import HeroModel from './HeroModel';
import HeroUtils from '../utils/HeroUtils';
import ModelManager from '../managers/ModelManager';
import { BagItem, BagType } from './BagModel';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-09 11:25:14 
  */
export default class RuneModel {

  /**符文服务器数据 */
  runeItems: Array<BagItem> = null;

  // runeInHeros: Array<BagItem> = [];   //

  /**ID对应道具的物品表 */
  idItems: any = {};

  //祝福值map   blessId: runeId+idx runeId+heroId
  blessMap: { [blessId: number]: icmsg.RuneBless } = {};

  /**上阵英雄身上的符文数据 series: heroId+runeId*/
  get runeInHeros(): Array<BagItem> {
    let upList = ModelManager.get(HeroModel).curUpHeroList(0);
    let items = [];
    upList.forEach(heroId => {
      let info = HeroUtils.getHeroInfoByHeroId(heroId);
      if (info) {
        info.runes.forEach(runeId => {
          if (runeId) {
            let info = new icmsg.RuneInfo();
            info.id = runeId;
            info.num = 1;
            info.heroId = heroId;
            let i: BagItem = {
              series: parseInt(`${runeId}${heroId}`),
              itemId: runeId,
              itemNum: 1,
              type: BagType.RUNE,
              extInfo: info,
            };
            items.push(i);
          }
        });
      }
    });
    return items;
  }
}
