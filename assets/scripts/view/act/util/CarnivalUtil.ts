import ActivityModel from '../model/ActivityModel';
import ActUtil from './ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import {
    Carnival_cross_rankCfg,
    Carnival_dailyCfg,
    Carnival_personal_rankCfg,
    Carnival_rewardsCfg,
    Carnival_ultimateCfg
    } from '../../../a/config';

/** 
 * 跨服狂欢相关工具方法
 * @Author: sthoo.huang  
 * @Date: 2021-04-01 11:03:58 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-07 15:30:46
 */
class CarnivalUtilClass {

    get activityModel() { return ModelManager.get(ActivityModel); }
    get crossType() {
        let type = 1;
        [64, 65, 66, 67, 68].some(id => {
            let cfg = ActUtil.getCfgByActId(id);
            if (cfg) {
                type = cfg.reward_type;
                return true;
            }
            return false;
        });
        return type;
    }

    getDailyConfigs() {
        let type = this.crossType;
        let cfgs = ConfigManager.getItems(
            Carnival_dailyCfg,
            (cfg: Carnival_dailyCfg) => {
                if (cfg.type == type) {
                    return true;
                }
                return false;
            }
        );
        return cfgs;
    }

    getUltimateConfigsByTheme(theme: number) {
        let type = this.crossType;
        let cfgs = ConfigManager.getItems(
            Carnival_ultimateCfg,
            (c: Carnival_ultimateCfg) => {
                if (c.type == type) {
                    return c.theme == theme;
                }
                return false;
            }
        );
        return cfgs;
    }

    getUltimateConfigByIndex(index: number) {
        let type = this.crossType;
        let cfg = ConfigManager.getItem(
            Carnival_ultimateCfg,
            (c: Carnival_ultimateCfg) => {
                if (c.type == type) {
                    return c.index == index;
                }
                return false;
            }
        );
        return cfg;
    }

    getUltimateConfigs() {
        let type = this.crossType;
        let cfgs = ConfigManager.getItems(
            Carnival_ultimateCfg,
            (cfg: Carnival_ultimateCfg) => {
                if (cfg.type == type) {
                    return true;
                }
                return false;
            }
        );
        cfgs.sort((a, b) => {
            return a.sorting - b.sorting
        })
        return cfgs;
    }

    getDailyConfigsByDay(day: number) {
        let type = this.crossType;
        let cfgs = ConfigManager.getItems(
            Carnival_dailyCfg,
            (c: Carnival_dailyCfg) => {
                if (c.type == type) {
                    return c.day == day;
                }
                return false;
            }
        );
        cfgs.sort((a, b) => {
            return a.sorting - b.sorting
        })
        return cfgs;
    }

    getDailyConfigByIndex(index: number) {
        let type = this.crossType;
        let cfg = ConfigManager.getItem(
            Carnival_dailyCfg,
            (c: Carnival_dailyCfg) => {
                if (c.type == type) {
                    return c.index == index;
                }
                return false;
            }
        );
        return cfg;
    }

    /**
     * 获取当前活动所有奖励配置
     */
    getRewardsConfigs() {
        let type = this.crossType;
        let cfgs = ConfigManager.getItems(
            Carnival_rewardsCfg,
            (cfg: Carnival_rewardsCfg) => cfg.type == type
        );
        return cfgs;
    }

    /**
     * 获得当前类型的所有跨服排名配置
     */
    getCrossRankConfigs(b?: boolean) {
        let type = this.crossType;
        let cfgs = ConfigManager.getItems(
            Carnival_cross_rankCfg,
            (cfg: Carnival_cross_rankCfg) => {
                if (cfg.type == type) {
                    return b || cfg.desc != "";
                }
                return false;
            }
        );
        return cfgs;
    }

    /**
     * 获得跨服排名奖励配置
     * @param rank 
     */
    getCrossRankConfig(rank?: number) {
        let type = this.crossType;
        if (rank === void 0) {
            rank = this.activityModel.roleServerRank.rank;
        }
        let cfg = ConfigManager.getItem(
            Carnival_cross_rankCfg,
            (c: Carnival_cross_rankCfg) => {
                if (c.type == type) {
                    return rank >= c.interval[0] && rank <= c.interval[1];
                }
                return false;
            }
        );
        return cfg;
    }

    /**
     * 获得当前类型的个人排名配置
     */
    getPersonalRankConfigs() {
        let type = this.crossType;
        let cfgs = ConfigManager.getItems(
            Carnival_personal_rankCfg,
            (cfg: Carnival_personal_rankCfg) => {
                if (cfg.type == type) {
                    return true;
                }
                return false;
            }
        );
        return cfgs;
    }
}

const CarnivalUtil = gdk.Tool.getSingleton(CarnivalUtilClass);
export default CarnivalUtil;