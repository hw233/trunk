import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import { Arenahonor_worldwideCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-07 20:06:13 
  */
export default class WorldHonorUtils {
    private static progressTimeMap: { [id: number]: { startTime: number, endTime: number } } = {}; //毫秒
    private static actId = 112;

    /**
     * 获取指定赛程id的时间区间
     * @param id 
     * @returns 
     */
    static getTimesById(id: number) {
        let sT = ActUtil.getActStartTime(this.actId);
        if (!sT) return [null, null];
        if (this.progressTimeMap[id]) {
            return [this.progressTimeMap[id].startTime, this.progressTimeMap[id].endTime];
        }
        let cfg = ConfigManager.getItemById(Arenahonor_worldwideCfg, id);
        let start = sT + cfg.time_begin[2] * 24 * 60 * 60 * 1000 + cfg.time_begin[3] * 60 * 60 * 1000 + cfg.time_begin[4] * 60 * 1000;
        let end = sT + cfg.time_end[2] * 24 * 60 * 60 * 1000 + cfg.time_end[3] * 60 * 60 * 1000 + cfg.time_end[4] * 60 * 1000;
        this.progressTimeMap[id] = {
            startTime: start,
            endTime: end
        };
        return [start, end];
    }

    /**
     * 获取当前比赛进程id
     * @returns 
     */
    static getCurProgressId() {
        let sT = ActUtil.getActStartTime(this.actId);
        if (!sT) return null;
        let now = GlobalUtil.getServerTime();
        let cfgs = ConfigManager.getItems(Arenahonor_worldwideCfg);
        for (let i = 0; i < cfgs.length; i++) {
            let [start, end] = this.getTimesById(cfgs[i].id);
            if (!start || !end) return null;
            if (start <= now && now <= end) {
                return cfgs[i].id;
            }
        }
    }
}
