import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import MathUtil from '../../../common/utils/MathUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RelicModel from '../model/RelicModel';
import RoleModel from '../../../common/models/RoleModel';
import {
  Map_relicCfg,
  Relic_numberCfg,
  Relic_openCfg,
  Relic_pointCfg
  } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-28 09:58:27 
  */
export default class RelicUtils {
  static get RelicModel(): RelicModel { return ModelManager.get(RelicModel); }

  /**
   * 获取同类型据点数量
   * @param type 
   */
  static getCityNumByType(type: number, mapId: number): number {
    let cityIds = [];
    let cfg = ConfigManager.getItemById(Map_relicCfg, mapId);
    cfg.points.forEach((p, idx) => {
      if (p[2] == type) {
        // num += 1;
        let c;
        for (let i = 0; i < cfg.cities.length; i++) {
          if (cfg.cities[i][0] == p[0] && cfg.cities[i][1] == p[1]) {
            c = cfg.cities[i];
            break;
          }
        }
        if (c) {
          let numType = this.getNumTypeByPos(mapId, cc.v2(c[0], c[1]));
          if (cityIds.indexOf(c[2]) == -1 && numType <= this.RelicModel.mapNumId) {
            cityIds.push(c[2]);
          }
        }
      }
    });
    return cityIds.length;
  }

  /**
   * 返回当前地图的据点类型数组
   */
  static getCityTypesByMapId(mapId: number) {
    let types = [];
    let cfg = ConfigManager.getItemById(Map_relicCfg, mapId);
    cfg.points.forEach(p => {
      if (types.indexOf(p[2]) == -1) {
        types.push(p[2]);
      }
    });
    return types;
  }

  static getTypeByCityId(mapId: number, cityId: number) {
    let cfg = ConfigManager.getItemById(Map_relicCfg, mapId);
    let c;
    for (let i = 0; i < cfg.cities.length; i++) {
      if (cfg.cities[i][2] == cityId) {
        c = cfg.cities[i];
        break;
      }
    }

    for (let j = 0; j < cfg.points.length; j++) {
      if (c[0] == cfg.points[j][0] && c[1] == cfg.points[j][1]) {
        return cfg.points[j][2];
      }
    }
  }

  static getNumTypeByPos(mapId: number, p: cc.Vec2) {
    let cfg = ConfigManager.getItemById(Map_relicCfg, mapId);
    for (let i = 0; i < cfg.number.length; i++) {
      let num = cfg.number[i];
      if (num[0] == p.x && num[1] == p.y) {
        return num[2];
      }
    }
  }

  static getNumTypeByCityId(mapId: number, cityId: number) {
    let cfg = ConfigManager.getItemById(Map_relicCfg, mapId);
    let c;
    for (let i = 0; i < cfg.cities.length; i++) {
      if (cfg.cities[i][2] == cityId) {
        c = cfg.cities[i];
        break;
      }
    }
    return this.getNumTypeByPos(mapId, cc.v2(c[0], c[1]));
  }

  static getNumCfgIdByYdLoginNum(loginNum: number) {
    let cfgs = ConfigManager.getItems(Relic_numberCfg);
    let len = cfgs.length;
    for (let i = len - 1; i > 0; i--) {
      if (loginNum >= cfgs[i].num[0]) {
        return cfgs[i].id;
      }
    }
    return cfgs[0].id;
  }

  /**
 * 获取通行证奖励是否领取
 * @param id 
 * @param type 
 */
  static getPassPortRewardState(id: number, type: number) {
    let idx = id % 100;
    let reward = type == 1 ? this.RelicModel.passPortFreeReward : this.RelicModel.passPortChargeReward;
    let old = reward[Math.floor(idx / 8)];
    if ((old & 1 << idx % 8) >= 1) return true;
    else return false
  }

  /**
   * 根据跨服组ID获取开启的地图类型 [1,2,3] [安全区,pk1,pk2]
   * @param croServerId 
   */
  static getOpenMapTypeByCrossServerId(croServerId: string) {
    let cfgs = ConfigManager.getItems(Relic_openCfg, (cfg: Relic_openCfg) => {
      if (cfg.opengroups == croServerId) {
        return true;
      }
    });
    if (!cfgs || cfgs.length <= 0) {
      cfgs = ConfigManager.getItems(
        Relic_openCfg, (cfg: Relic_openCfg) => {
          if (!cfg.opengroups) {
            return true;
          }
        });
    }
    let openTypes = [];
    let openServerTime = ModelManager.get(RoleModel).CrossOpenTime * 1000;
    let now = GlobalUtil.getServerTime();
    for (let i = 0; i < cfgs.length; i++) {
      let cfg = cfgs[i];
      let sT = openServerTime + cfg.open_time[2] * 24 * 60 * 60 * 1000 + cfg.open_time[3] * 60 * 60 * 1000 + cfg.open_time[4] * 60 * 1000;
      let eT = openServerTime + cfg.close_time[2] * 24 * 60 * 60 * 1000 + cfg.close_time[3] * 60 * 60 * 1000 + cfg.close_time[4] * 60 * 1000;
      if (sT <= now && now <= eT) {
        openTypes.push(parseInt(cfg.map_id.toString().substr(cfg.map_id.toString().length - 1)));
      }
    }
    return openTypes;
  }

  /**获取每个据点对应的地图数据 */
  static getPointMapData(mapType: number, cityId: number): number[] {
    let mapData = GlobalUtil.getLocal(`${mapType}_${cityId}_mapData`, true) || [];
    if (mapData.length <= 0) {
      let cfg = ConfigManager.getItemById(Relic_pointCfg, this.RelicModel.cityMap[cityId].pointType);
      mapData = cfg.map_monster[MathUtil.rnd(0, cfg.map_monster.length - 1)];
      this.setPointMapData(mapType, cityId, mapData);
    }
    return mapData;
  }

  /**设置据点地图缓存 */
  static setPointMapData(mapType: number, cityId: number, v: string) {
    GlobalUtil.setLocal(`${mapType}_${cityId}_mapData`, v, true);
  }
}
