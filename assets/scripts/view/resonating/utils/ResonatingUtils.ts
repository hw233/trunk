import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import ResonatingModel from '../model/ResonatingModel';
import RoleModel from '../../../common/models/RoleModel';
import { BagType } from '../../../common/models/BagModel';
import { Hero_trammelCfg, Store_star_giftCfg } from '../../../a/config';
import { HeroCfg } from '../../../../boot/configs/bconfig';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-07 10:07:26 
  */
export default class ResonatingUtils {
    static get model(): ResonatingModel { return ModelManager.get(ResonatingModel); }

    /**判断协战联盟是否满足生效条件 */
    static getAllianceValid(allianceId: number): boolean {
        let cfg = ConfigManager.getItemByField(Hero_trammelCfg, 'trammel_id', allianceId);
        let heroTypes = cfg.trammel_hero;
        let allianceInfo = this.model.assistAllianceInfos[allianceId];
        let heroInfos = ModelManager.get(HeroModel).heroInfos;
        let map: number[] = []; //最高星级统计
        let selectHeroId: number[] = []; //临时 已选择英雄id
        let fixIdx: number[] = []; //已经固定的英雄位
        heroTypes.forEach(l => {
            map.push(0);
            selectHeroId.push(0);
        });

        if (allianceInfo) {
            allianceInfo.heroIds.forEach((l, idx) => {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(l);
                if (heroInfo) {
                    map[idx] = heroInfo.star;
                    fixIdx.push(idx);
                }
            });
        }
        //遍历对应位置上 背包中英雄最大星级
        heroInfos.forEach(l => {
            let info = <icmsg.HeroInfo>l.extInfo;
            if ((!allianceInfo || allianceInfo.heroIds.indexOf(info.heroId) == -1) && selectHeroId.indexOf(info.heroId) == -1 && !HeroUtils.heroLockCheck(info, false, [0, 1, 2, 3, 4, 5, 6, 7, 8])) {
                for (let i = 0; i < heroTypes.length; i++) {
                    if (fixIdx.indexOf(i) !== -1) continue; //忽略已经固定的英雄位
                    let isHero = BagUtils.getItemTypeById(heroTypes[i]) == BagType.HERO;
                    //hero typeId指定英雄类型
                    if (isHero && heroTypes[i] == info.typeId) {
                        if (info.star > map[i]) {
                            map[i] = info.star;
                            selectHeroId[i] = info.heroId;
                        }
                        break;
                    }
                    //hero group指定英雄阵营
                    if (!isHero) {
                        let g = ConfigManager.getItemById(HeroCfg, info.typeId).group[0];
                        if (heroTypes[i] == 11) {
                            if ([1, 2].indexOf(g) !== -1) {
                                if (info.star > map[i]) {
                                    map[i] = info.star;
                                    selectHeroId[i] = info.heroId;
                                }
                            }
                        } else if (heroTypes[i] == 12) {
                            if ([3, 4, 5].indexOf(g) !== -1) {
                                if (info.star > map[i]) {
                                    map[i] = info.star;
                                    selectHeroId[i] = info.heroId;
                                }
                            }
                        } else {
                            if (g == heroTypes[i]) {
                                if (info.star > map[i]) {
                                    map[i] = info.star;
                                    selectHeroId[i] = info.heroId;
                                }
                            }
                        }
                    }
                }
            }
        });

        let maxStar = 0;
        for (let i = 0; i < map.length; i++) {
            if (map[i] == 0) return false;
            else {
                maxStar += map[i];
            }
        }
        return maxStar >= cfg.star_lv;
    }

    /**英雄是否参与协战联盟 */
    static isHeroInAssistAllianceList(id: number): boolean {
        let keys = Object.keys(this.model.assistAllianceInfos);
        for (let i = 0; i < keys.length; i++) {
            let info = this.model.assistAllianceInfos[keys[i]];
            if (info && info.heroIds.indexOf(id) !== -1) {
                return true;
            }
        }
        return false;
    }

    /**协战联盟星级专属礼包是否显示 */
    static isShowAssistGift(): boolean {
        let cfgs = ConfigManager.getItems(Store_star_giftCfg);
        if (ModelManager.get(RoleModel).maxHeroStar < 11) {
            return false;
        }
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            let info = this.model.giftRecords[cfg.id] || null;
            if (!info || info.record < 2) {
                return true;
            }
        }
        return false;
    }
}
