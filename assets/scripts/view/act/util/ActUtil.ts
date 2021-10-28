import ActivityModel from '../model/ActivityModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import {
    Activity_ranking3Cfg,
    Activity_ranking7Cfg,
    ActivityCfg,
    Copy_stageCfg,
    GlobalCfg
    } from '../../../a/config';

/** 
 * @Description: 主界面活动数据处理工具
 * @Author: weiliang.huang  
 * @Date: 2019-03-27 16:57:13 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-24 14:11:19
 */

class ActUtilClass {

    /**判断一个活动是否在活动期间内 */
    ifActInTime(timeType, startTime, endTime, id, cfg) {
        // let [timeType, startTime, endTime] = [actCfg.type, actCfg.open_time, actCfg.close_time];
        if (!startTime && !endTime) {
            return true
        }
        let time;
        let sTime = 0
        let eTime = 0
        let nowTime = GlobalUtil.getServerTime();
        if (timeType == 1) {
            time = GlobalUtil.getServerOpenTime() * 1000;   //开服时间
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
        } else if (timeType == 2) {
            time = parseInt(ModelManager.get(RoleModel).createTime) * 1000;  //创角时间
            time = TimerUtils.getZerohour(time / 1000) * 1000;
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
        } else if (timeType == 3) {
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            //具体日期
            // sTime = new Date(`${startTime[0]}/${startTime[1]}/${startTime[2]} ${startTime[3]}:${startTime[4]}`).getTime();
            // eTime = new Date(`${endTime[0]}/${endTime[1]}/${endTime[2]} ${endTime[3]}:${endTime[4]}`).getTime();
            sTime = TimerUtils.transformDate(startTime);
            eTime = TimerUtils.transformDate(endTime);
        } else if (timeType == 4) {
            //获取跨服组的开服时间
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            let time = roleModel.CrossOpenTime * 1000;
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
        } else if (timeType == 5) {
            //固定星期X
            //副id
            let days = [1, 2, 3, 4, 5, 6, 0];
            let sideCfg = this.getCfgByActId(startTime[0]); // 禁止嵌套类型5
            if (!sideCfg) return false;
            let sideOpenTime = this.getActStartTime(startTime[0]);
            let sideDay = new Date(sideOpenTime).getDay();
            let sideZeroWeekTime = TimerUtils.getWeekFirstDayZeroTime(sideOpenTime / 1000) * 1000;
            //副id紧邻的id, 整个活动的真正开始时间
            let relevanceCfg = ConfigManager.getItemByField(ActivityCfg, 'id', sideCfg.id + 1);
            let relevanceOpenTime;
            let dIdx = days.indexOf(relevanceCfg.open_time[2]) - days.indexOf(sideDay)
            let d = days.indexOf(relevanceCfg.open_time[2]);
            d += dIdx >= 0 ? 0 : 7;
            relevanceOpenTime = sideZeroWeekTime + 86400 * d * 1000 + relevanceCfg.open_time[3] * 60 * 60 * 1000 + relevanceCfg.open_time[4] * 60 * 1000;
            let relevanceOpenTimeZeroWeek = TimerUtils.getWeekFirstDayZeroTime(relevanceOpenTime / 1000) * 1000;
            //当前查询的活动id的 开启关闭时间周期
            let realOpenTime, realCloseTime;
            if (relevanceCfg.id == id) {
                realOpenTime = relevanceOpenTime;
                let dIdx2 = days.indexOf(relevanceCfg.close_time[2]) - days.indexOf(relevanceCfg.open_time[2]);
                let d2 = days.indexOf(relevanceCfg.close_time[2]);
                d2 += dIdx2 >= 0 ? 0 : 7;
                realCloseTime = relevanceOpenTimeZeroWeek + 86400 * d2 * 1000 + relevanceCfg.close_time[3] * 60 * 60 * 1000 + relevanceCfg.close_time[4] * 60 * 1000;
            }
            else {
                let dIdx3 = days.indexOf(startTime[2]) - days.indexOf(relevanceCfg.open_time[2]);
                let d3 = days.indexOf(startTime[2]);
                d3 += dIdx3 >= 0 ? 0 : 7;
                realOpenTime = relevanceOpenTimeZeroWeek + 86400 * d3 * 1000 + startTime[3] * 60 * 60 * 1000 + startTime[4] * 60 * 1000;
                let realOpenTimeZeroWeek = TimerUtils.getWeekFirstDayZeroTime(realOpenTime / 1000) * 1000;
                let dIdx4 = days.indexOf(endTime[2]) - days.indexOf(startTime[2]);
                let d4 = days.indexOf(endTime[2]);
                d4 += dIdx4 >= 0 ? 0 : 7;
                realCloseTime = realOpenTimeZeroWeek + 86400 * d4 * 1000 + endTime[3] * 60 * 60 * 1000 + endTime[4] * 60 * 1000;
            }
            if (nowTime < realOpenTime) return false;
            let circle = 1;
            let circleTime = 86400 * 7 * 1000;
            for (let i = 0; ; i++) {
                let nextOpenTime = realOpenTime + circleTime * i;
                let nextCloseTime = realCloseTime + circleTime * i;
                if (nowTime < nextOpenTime) return false;
                if (nextOpenTime <= nowTime && nowTime <= nextCloseTime) {
                    circle = i;
                    break;
                }
            }
            let n = circle / startTime[1] + '';
            return startTime[1] == 0 || startTime[1] == 1 || parseInt(n) === parseFloat(n)
        }
        else if (timeType == 6) {
            //获取合服时间
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            let time = roleModel.serverMegTime * 1000;
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
        }
        else if (timeType == 8) {
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            // let c = ConfigManager.getItemById(Cross_etcdCfg, roleModel.crossId);
            // let time = new Date(`${c.meg_open[0]}/${c.meg_open[1]}/${c.meg_open[2]} ${c.meg_open[3]}:${c.meg_open[4]}`).getTime();
            // time = TimerUtils.transformDate(c.meg_open);
            let time = roleModel.serverMegTime * 1000;
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
        }

        if (nowTime >= sTime && nowTime <= eTime) {
            return true
        }
        return false
    }

    //获取活动的奖励ID
    getActRewardType(actId: number) {
        let rewardType = 0;
        let cfg = this.getCfgByActId(actId);
        if (!cfg) return rewardType;
        if (cfg.type == 5) {
            //let timeType = cfg.type;
            let startTime = cfg.open_time;
            let endTime = cfg.close_time
            // let time = 0
            // let sTime = 0
            // let eTime = 0
            let nowTime = GlobalUtil.getServerTime();
            let days = [1, 2, 3, 4, 5, 6, 0];
            let sideCfg = ConfigManager.getItemByField(ActivityCfg, 'id', startTime[0]);; // 禁止嵌套类型5
            if (!sideCfg) return rewardType;
            let sideOpenTime = this.getActivityCfgTime(sideCfg)[0];// 禁止嵌套类型5
            let sideDay = new Date(sideOpenTime).getDay();
            let sideZeroWeekTime = TimerUtils.getWeekFirstDayZeroTime(sideOpenTime / 1000) * 1000;
            //副id紧邻的id, 整个活动的真正开始时间
            let relevanceCfg = ConfigManager.getItemByField(ActivityCfg, 'id', startTime[0] + 1);
            let relevanceOpenTime;
            let dIdx = days.indexOf(relevanceCfg.open_time[2]) - days.indexOf(sideDay)
            let d = days.indexOf(relevanceCfg.open_time[2]);
            d += dIdx >= 0 ? 0 : 7;
            relevanceOpenTime = sideZeroWeekTime + 86400 * d * 1000 + relevanceCfg.open_time[3] * 60 * 60 * 1000 + relevanceCfg.open_time[4] * 60 * 1000;
            let relevanceOpenTimeZeroWeek = TimerUtils.getWeekFirstDayZeroTime(relevanceOpenTime / 1000) * 1000;
            //当前查询的活动id的 开启关闭时间周期
            let realOpenTime, realCloseTime;
            if (relevanceCfg.id == cfg.id) {
                realOpenTime = relevanceOpenTime;
                let dIdx2 = days.indexOf(relevanceCfg.close_time[2]) - days.indexOf(relevanceCfg.open_time[2]);
                let d2 = days.indexOf(relevanceCfg.close_time[2]);
                d2 += dIdx2 >= 0 ? 0 : 7;
                d2 += relevanceCfg.close_time[1] * 7
                realCloseTime = relevanceOpenTimeZeroWeek + 86400 * d2 * 1000 + relevanceCfg.close_time[3] * 60 * 60 * 1000 + relevanceCfg.close_time[4] * 60 * 1000;
            }
            else {
                let dIdx3 = days.indexOf(startTime[2]) - days.indexOf(relevanceCfg.open_time[2]);
                let d3 = days.indexOf(startTime[2]);
                d3 += dIdx3 >= 0 ? 0 : 7;
                realOpenTime = relevanceOpenTimeZeroWeek + 86400 * d3 * 1000 + startTime[3] * 60 * 60 * 1000 + startTime[4] * 60 * 1000;
                let realOpenTimeZeroWeek = TimerUtils.getWeekFirstDayZeroTime(realOpenTime / 1000) * 1000;
                let dIdx4 = days.indexOf(endTime[2]) - days.indexOf(startTime[2]);
                let d4 = days.indexOf(endTime[2]);
                d4 += dIdx4 >= 0 ? 0 : 7;
                d4 += relevanceCfg.close_time[1] * 7
                realCloseTime = realOpenTimeZeroWeek + 86400 * d4 * 1000 + endTime[3] * 60 * 60 * 1000 + endTime[4] * 60 * 1000;
            }
            let circleTime = 86400 * 7 * 1000;
            let dt = startTime[1] == 0 || startTime[1] == 1 ? 1 : startTime[1];
            for (let i = 0; ; i += dt) {
                let nextOpenTime = realOpenTime + circleTime * i;
                let nextCloseTime = realCloseTime + circleTime * i;
                if (nextOpenTime <= nowTime && nowTime <= nextCloseTime) {
                    rewardType = Math.floor(i / dt) + 1;
                    break;
                }
            }
        } else {
            rewardType = cfg.reward_type;
        }
        return rewardType;
    }

    /**活动开启时间 */
    getActStartTime(actId: number) {
        let cfg = this.getCfgByActId(actId);
        if (!cfg) return null;
        let time;
        let startTime;
        if (cfg.type == 1) {
            time = GlobalUtil.getServerOpenTime() * 1000;   //开服时间
            startTime = time + (cfg.open_time[2] * 24 * 60 * 60 + cfg.open_time[3] * 60 * 60 + cfg.open_time[4] * 60) * 1000;

        } else if (cfg.type == 2) {
            time = parseInt(ModelManager.get(RoleModel).createTime) * 1000;  //创角时间
            time = TimerUtils.getZerohour(time / 1000) * 1000;
            startTime = time + (cfg.open_time[2] * 24 * 60 * 60 + cfg.open_time[3] * 60 * 60 + cfg.open_time[4] * 60) * 1000;
        } else if (cfg.type == 3) {
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            //具体日期
            // startTime = new Date(`${cfg.open_time[0]}/${cfg.open_time[1]}/${cfg.open_time[2]} ${cfg.open_time[3]}:${cfg.open_time[4]}`).getTime();
            startTime = TimerUtils.transformDate(cfg.open_time);
        } else if (cfg.type == 4) {
            //获取跨服组的开服时间
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            // let temCfg = ConfigManager.getItemByField(Cross_etcdCfg, 'id', roleModel.crossId);
            // if (temCfg.cross_open instanceof Array) {
            // let time = new Date(`${temCfg.cross_open[0]}/${temCfg.cross_open[1]}/${temCfg.cross_open[2]} ${temCfg.cross_open[3]}:${temCfg.cross_open[4]}`).getTime();
            let time = roleModel.CrossOpenTime * 1000;
            startTime = time + (cfg.open_time[2] * 24 * 60 * 60 + cfg.open_time[3] * 60 * 60 + cfg.open_time[4] * 60) * 1000;
            // } else {
            //     return null
            // }
        } else if (cfg.type == 5) {
            //固定星期X
            //只考虑一个副ID, 不考虑多重嵌套 [副actId,null,weekend,h,min]
            let zeroTime = TimerUtils.getZerohour(GlobalUtil.getServerTime() / 1000) * 1000;
            let day = new Date(GlobalUtil.getServerTime()).getDay();
            if (cfg.open_time[0] !== 0) {
                let sideCfg = this.getCfgByActId(cfg.open_time[0]);
                if (!sideCfg) return null;
            }
            let d = 0;
            let flag = day == cfg.open_time[2];
            while (!flag) {
                d += 1;
                day -= 1;
                if (day < 0) day = 6;
                flag = day == cfg.open_time[2];
            }
            startTime = zeroTime - d * 24 * 60 * 60 * 1000 + cfg.open_time[3] * 60 * 60 * 1000 + cfg.open_time[4] * 60 * 1000;
        } else if (cfg.type == 6) {
            //获取合服时间
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            let time = roleModel.serverMegTime * 1000;
            startTime = time + (cfg.open_time[2] * 24 * 60 * 60 + cfg.open_time[3] * 60 * 60 + cfg.open_time[4] * 60) * 1000;
        }
        else if (cfg.type == 8) {
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            // let c = ConfigManager.getItemById(Cross_etcdCfg, roleModel.crossId);
            // let time = new Date(`${c.meg_open[0]}/${c.meg_open[1]}/${c.meg_open[2]} ${c.meg_open[3]}:${c.meg_open[4]}`).getTime();
            // let time = TimerUtils.transformDate(c.meg_open);
            let time = roleModel.serverMegTime * 1000;
            startTime = time + (cfg.open_time[2] * 24 * 60 * 60 + cfg.open_time[3] * 60 * 60 + cfg.open_time[4] * 60) * 1000;
        }
        return startTime;
    }

    /**活动剩余时间 */
    getActEndTime(actId: number) {
        let cfg = this.getCfgByActId(actId);
        if (!cfg) return null;
        let time;
        let endTime;
        if (cfg.type == 1) {
            time = GlobalUtil.getServerOpenTime() * 1000;   //开服时间
            endTime = time + (cfg.close_time[2] * 24 * 60 * 60 + cfg.close_time[3] * 60 * 60 + cfg.close_time[4] * 60) * 1000;

        } else if (cfg.type == 2) {
            time = parseInt(ModelManager.get(RoleModel).createTime) * 1000;  //创角时间
            time = TimerUtils.getZerohour(time / 1000) * 1000;
            endTime = time + (cfg.close_time[2] * 24 * 60 * 60 + cfg.close_time[3] * 60 * 60 + cfg.close_time[4] * 60) * 1000;
        } else if (cfg.type == 3) {
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            //具体日期
            // endTime = new Date(`${cfg.close_time[0]}/${cfg.close_time[1]}/${cfg.close_time[2]} ${cfg.close_time[3]}:${cfg.close_time[4]}`).getTime();
            endTime = TimerUtils.transformDate(cfg.close_time);
        } else if (cfg.type == 4) {
            //获取跨服组的开服时间
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            // let temCfg = ConfigManager.getItemByField(Cross_etcdCfg, 'id', roleModel.crossId);
            // if (temCfg.cross_open instanceof Array) {
            // let time = new Date(`${temCfg.cross_open[0]}/${temCfg.cross_open[1]}/${temCfg.cross_open[2]} ${temCfg.cross_open[3]}:${temCfg.cross_open[4]}`).getTime();
            let time = roleModel.CrossOpenTime * 1000;
            endTime = time + (cfg.close_time[2] * 24 * 60 * 60 + cfg.close_time[3] * 60 * 60 + cfg.close_time[4] * 60) * 1000;
            // } else {
            //     return null
            // }

        } else if (cfg.type == 5) {
            //固定星期X
            let startTime = this.getActStartTime(actId);
            let zeroTime = TimerUtils.getZerohour(startTime / 1000) * 1000;
            let d = 0;
            let day = new Date(startTime).getDay();
            let flag = day == cfg.close_time[2];
            while (!flag) {
                d += 1;
                day += 1;
                if (day > 6) day = 0;
                flag = day == cfg.close_time[2];
            }
            d += cfg.close_time[1] * 7
            endTime = zeroTime + d * 24 * 60 * 60 * 1000 + cfg.close_time[3] * 60 * 60 * 1000 + cfg.close_time[4] * 60 * 1000
        } else if (cfg.type == 6) {
            //获取合服时间
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            let time = roleModel.serverMegTime * 1000;
            endTime = time + (cfg.close_time[2] * 24 * 60 * 60 + cfg.close_time[3] * 60 * 60 + cfg.close_time[4] * 60) * 1000;
        }
        else if (cfg.type == 8) {
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            // let c = ConfigManager.getItemById(Cross_etcdCfg, roleModel.crossId);
            // let time = new Date(`${c.meg_open[0]}/${c.meg_open[1]}/${c.meg_open[2]} ${c.meg_open[3]}:${c.meg_open[4]}`).getTime();
            // let time = TimerUtils.transformDate(c.meg_open);
            let time = roleModel.serverMegTime * 1000;
            endTime = time + (cfg.close_time[2] * 24 * 60 * 60 + cfg.close_time[3] * 60 * 60 + cfg.close_time[4] * 60) * 1000;
        }
        return endTime;
    }

    /**判断一个活动id是否已开启 */
    ifActOpen(actId) {
        let config = this.getCfgByActId(actId);
        if (!config) {
            return false;
        }
        else {
            return true;
        }
    }

    getCfgByActId(id: number) {
        let cfgs = ConfigManager.getItems(ActivityCfg, (cfg: ActivityCfg) => {
            if (cfg.id == id) return true;
        });
        //加入平台判断
        let tempCfgs = [];
        cfgs.forEach(c => {
            if (Array.isArray(c.platform_id) && c.platform_id.indexOf(iclib.SdkTool.tool.config.platform_id) !== -1) {
                tempCfgs.push(c);
            }
        })
        if (tempCfgs.length <= 0) {
            cfgs.forEach(c => {
                if (!c.platform_id) {
                    tempCfgs.push(c);
                }
            })
        }
        cfgs = tempCfgs;
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].id == id) {
                let inTime = this.ifActInTime(cfgs[i].type, cfgs[i].open_time, cfgs[i].close_time, cfgs[i].id, cfgs[i])
                if (inTime) {
                    return cfgs[i];
                }
            }
        }
        return null;
    }

    /**判断活动是否开启过 */
    checkActOpen(id: number) {
        let cfgs = ConfigManager.getItems(ActivityCfg, (cfg: ActivityCfg) => {
            if (cfg.id == id) return true;
        });
        //加入平台判断
        let tempCfgs = [];
        cfgs.forEach(c => {
            if (Array.isArray(c.platform_id) && c.platform_id.indexOf(iclib.SdkTool.tool.config.platform_id) !== -1) {
                tempCfgs.push(c);
            }
        })
        if (tempCfgs.length <= 0) {
            cfgs.forEach(c => {
                if (!c.platform_id) {
                    tempCfgs.push(c);
                }
            })
        }
        cfgs = tempCfgs;
        let nowTime = GlobalUtil.getServerTime();
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].id == id) {
                let inTime = this.getActivityCfgTime(cfgs[i])
                if (nowTime > inTime[0]) {
                    return true;
                }
            }
        }
        return false
    }


    /**是否显示冲榜图标 */
    isShowKfcbNotice() {
        let activityModel = ModelManager.get(ActivityModel)
        let copyModel = ModelManager.get(CopyModel);
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()

        let newStageCfg = ConfigManager.getItemById(Copy_stageCfg, copyModel.latelyStageId);
        let targetStageId = ConfigManager.getItemById(GlobalCfg, "ranking_min_stage_id").value[0]

        if (!JumpUtils.ifSysOpen(1802)) {
            return false;
        }

        if (newStageCfg && newStageCfg.pre_condition >= targetStageId) {
            //超过活动时间 且进度都为0，没有进入过这个活动，或者两个档次都没达到领奖要求 图标不显示
            let endTime7 = serverOpenTime + 3600 * 24 * 7 - serverTime
            let list3 = ConfigManager.getItems(Activity_ranking3Cfg)
            let list7 = ConfigManager.getItems(Activity_ranking7Cfg)
            if (endTime7 < 0 && ((activityModel.kfcb_history1 == 0 && activityModel.kfcb_history2 == 0)
                || (activityModel.kfcb_percent3 > list3[list3.length - 1].rank && activityModel.kfcb_percent7 > list7[list7.length - 1].rank))
                || (activityModel.kfcb_rewarded3 && activityModel.kfcb_rewarded7)
            ) {
                return false
            }
            return true
        }
        return false
    }
    /**获取下个活动的开始时间 */
    getNextActStartTime(actId: number) {
        let cfgs = ConfigManager.getItems(ActivityCfg, (cfg: ActivityCfg) => {
            if (cfg.id == actId) return true;
        });
        //加入平台判断
        let tempCfgs = [];
        cfgs.forEach(c => {
            if (Array.isArray(c.platform_id) && c.platform_id.indexOf(iclib.SdkTool.tool.config.platform_id) !== -1) {
                tempCfgs.push(c);
            }
        })
        if (tempCfgs.length <= 0) {
            cfgs.forEach(c => {
                if (!c.platform_id) {
                    tempCfgs.push(c);
                }
            })
        }
        cfgs = tempCfgs;
        let nowTime = GlobalUtil.getServerTime();
        for (let i = 0; i < cfgs.length; i++) {
            let actTime = this.getActivityCfgTime(cfgs[i])
            let sTime = actTime[0];
            //let eTime = actTime[1];
            if (nowTime < sTime) {
                return sTime
            }
        }
        return null;
    }

    getActivityCfgTime(cfg: ActivityCfg) {
        let timeType = cfg.type;
        let startTime = cfg.open_time;
        let endTime = cfg.close_time
        let time = 0
        let sTime = 0
        let eTime = 0
        if (timeType == 1) {
            time = GlobalUtil.getServerOpenTime() * 1000;   //开服时间
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
        } else if (timeType == 2) {
            time = parseInt(ModelManager.get(RoleModel).createTime) * 1000;  //创角时间
            time = TimerUtils.getZerohour(time / 1000) * 1000;
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
        } else if (timeType == 3) {
            //具体日期
            let roleModel = ModelManager.get(RoleModel);
            // sTime = new Date(`${startTime[0]}/${startTime[1]}/${startTime[2]} ${startTime[3]}:${startTime[4]}`).getTime();
            // eTime = new Date(`${endTime[0]}/${endTime[1]}/${endTime[2]} ${endTime[3]}:${endTime[4]}`).getTime();
            sTime = TimerUtils.transformDate(startTime);
            eTime = TimerUtils.transformDate(endTime);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
        } else if (timeType == 4) {
            //获取跨服组的开服时间
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            let time = roleModel.CrossOpenTime * 1000;
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
            // }
        }
        else if (timeType == 5) {
            //固定星期X
            //副id
            let nowTime = GlobalUtil.getServerTime();
            let days = [1, 2, 3, 4, 5, 6, 0];
            let sideCfg = ConfigManager.getItemByField(ActivityCfg, 'id', startTime[0]);; // 禁止嵌套类型5
            if (!sideCfg) return false;
            let sideOpenTime = this.getActivityCfgTime(sideCfg)[0];// 禁止嵌套类型5
            let sideDay = new Date(sideOpenTime).getDay();
            let sideZeroWeekTime = TimerUtils.getWeekFirstDayZeroTime(sideOpenTime / 1000) * 1000;
            //副id紧邻的id, 整个活动的真正开始时间
            let relevanceCfg = ConfigManager.getItemByField(ActivityCfg, 'id', startTime[0] + 1);
            let relevanceOpenTime;
            let dIdx = days.indexOf(relevanceCfg.open_time[2]) - days.indexOf(sideDay)
            let d = days.indexOf(relevanceCfg.open_time[2]);
            d += dIdx >= 0 ? 0 : 7;
            relevanceOpenTime = sideZeroWeekTime + 86400 * d * 1000 + relevanceCfg.open_time[3] * 60 * 60 * 1000 + relevanceCfg.open_time[4] * 60 * 1000;
            let relevanceOpenTimeZeroWeek = TimerUtils.getWeekFirstDayZeroTime(relevanceOpenTime / 1000) * 1000;
            //当前查询的活动id的 开启关闭时间周期
            let realOpenTime, realCloseTime;
            if (relevanceCfg.id == cfg.id) {
                realOpenTime = relevanceOpenTime;
                let dIdx2 = days.indexOf(relevanceCfg.close_time[2]) - days.indexOf(relevanceCfg.open_time[2]);
                let d2 = days.indexOf(relevanceCfg.close_time[2]);
                d2 += dIdx2 >= 0 ? 0 : 7;
                d2 += relevanceCfg.close_time[1] * 7;
                realCloseTime = relevanceOpenTimeZeroWeek + 86400 * d2 * 1000 + relevanceCfg.close_time[3] * 60 * 60 * 1000 + relevanceCfg.close_time[4] * 60 * 1000;
            }
            else {
                let dIdx3 = days.indexOf(startTime[2]) - days.indexOf(relevanceCfg.open_time[2]);
                let d3 = days.indexOf(startTime[2]);
                d3 += dIdx3 >= 0 ? 0 : 7;
                realOpenTime = relevanceOpenTimeZeroWeek + 86400 * d3 * 1000 + startTime[3] * 60 * 60 * 1000 + startTime[4] * 60 * 1000;
                let realOpenTimeZeroWeek = TimerUtils.getWeekFirstDayZeroTime(realOpenTime / 1000) * 1000;
                let dIdx4 = days.indexOf(endTime[2]) - days.indexOf(startTime[2]);
                let d4 = days.indexOf(endTime[2]);
                d4 += dIdx4 >= 0 ? 0 : 7;
                d4 += endTime[1] * 7;
                realCloseTime = realOpenTimeZeroWeek + 86400 * d4 * 1000 + endTime[3] * 60 * 60 * 1000 + endTime[4] * 60 * 1000;
            }
            let circleTime = 86400 * 7 * 1000;
            let dt = startTime[1] == 0 || startTime[1] == 1 ? 1 : startTime[1];
            for (let i = 0; ; i += dt) {
                let nextOpenTime = realOpenTime + circleTime * i;
                let nextCloseTime = realCloseTime + circleTime * i;
                if (nowTime < nextOpenTime) {
                    sTime = nextOpenTime;
                    eTime = nextCloseTime;
                    break;
                }
            }
        } else if (timeType == 6) {
            //获取合服时间
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            let time = roleModel.serverMegTime * 1000;
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
        } else if (timeType == 8) {
            let roleModel = ModelManager.get(RoleModel);
            if (cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) < 0) {
                return false
            }
            // let c = ConfigManager.getItemById(Cross_etcdCfg, roleModel.crossId);
            // let time = new Date(`${c.meg_open[0]}/${c.meg_open[1]}/${c.meg_open[2]} ${c.meg_open[3]}:${c.meg_open[4]}`).getTime();
            // let time = TimerUtils.transformDate(c.meg_open);
            let time = roleModel.serverMegTime * 1000;
            sTime = time + (startTime[2] * 24 * 60 * 60 + startTime[3] * 60 * 60 + startTime[4] * 60) * 1000;
            eTime = time + (endTime[2] * 24 * 60 * 60 + endTime[3] * 60 * 60 + endTime[4] * 60) * 1000;
        }
        return [sTime, eTime];
    }

}

const ActUtil = gdk.Tool.getSingleton(ActUtilClass);
export default ActUtil