import ActUtil from '../../act/util/ActUtil';
import CombineModel from '../model/CombineModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import { Combine_cross_rankCfg } from '../../../a/config';


/**
 * @Description: 工具
 * @Author: weiliang.huang
 * @Date: 2019-03-25 20:41:11
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-18 10:48:54
 */


export default class CombineUtils {

    static get combineModel() { return ModelManager.get(CombineModel); }

    static checkScoreRewards(rewards: number[]) {
        let rewardIds = []
        for (let i = 0; i < rewards.length; i++) {
            let idStr = rewards[i].toString(2)
            let ids = idStr.split("")
            ids = ids.reverse()
            for (let j = 0; j < ids.length; j++) {
                if (ids[j] == "1") {
                    rewardIds[(j + 1) + i * 8] = 1
                }
            }
        }
        return rewardIds
    }


    static getCombineCarnivalDay() {
        let roleModel = ModelManager.get(RoleModel)
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let day = 1
        let act = ActUtil.getCfgByActId(93)
        if (act) {
            let times = ActUtil.getActivityCfgTime(act)
            if (curTime >= times[0] / 1000) {
                day = Math.ceil((curTime - Math.floor(times[0] / 1000)) / 86400)
            }
        }
        return day
    }

    /**
    * 获得排名奖励配置
    * @param rank 
    */
    static getCrossRankConfig(rank?: number) {
        let type = ModelManager.get(RoleModel).serverMegCount
        if (rank === void 0) {
            rank = this.combineModel.serverRank
        }
        let cfg = ConfigManager.getItem(
            Combine_cross_rankCfg,
            (c: Combine_cross_rankCfg) => {
                if (c.type == type) {
                    return rank >= c.interval[0] && rank <= c.interval[1];
                }
                return false;
            }
        )
        return cfg;
    }

    /**
    * 获得当前类型的所有跨服排名配置
    */
    static getCrossRankConfigs(b?: boolean) {
        let type = ModelManager.get(RoleModel).serverMegCount
        let cfgs = ConfigManager.getItems(
            Combine_cross_rankCfg,
            (cfg: Combine_cross_rankCfg) => {
                if (cfg.type == type) {
                    return b || cfg.desc != "";
                }
                return false;
            }
        );
        return cfgs;
    }
}


