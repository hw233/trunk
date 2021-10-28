import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import TaskUtil from '../../../view/task/util/TaskUtil';
import { TaskEventId } from '../../../view/task/enum/TaskEventId';

/**
 * @Description: 在线奖励、成长任务、通关奖励任务刷新红点通信器
 * @Author: yaozu.hu
 * @Date: 2019-10-15 15:17:35
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2019-10-15 15:17:35
 */

export default class OnlineGrowController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return [
            [TaskEventId.UPDATE_TASK_GROW_INFO, this.updataGrow],
            [TaskEventId.UPDATE_ONLINE_INFO, this.updataOnline],
            [TaskEventId.UPDATE_TASK_AWARD_STATE, this.updataClearance]
        ]
    }

    get netEvents(): NetEventArray[] {
        return [

        ];
    }
    //在线领取奖励的状态
    state: number = 2;
    //在线奖励的剩余时间
    time: number = 0;
    //计算时间
    temDt: number = 0;

    onStart() {

    }

    onEnd() {

    }

    update(dt: number) {
        if (this.state == 0) {
            if (this.time > 0) {
                this.time -= dt;
            } else {
                this.updataOnline();
                gdk.e.emit(TaskEventId.UPDATE_CLEARANCE_GROW_ONLINE_RED)
            }
        }
    }

    updataGrow() {
        gdk.e.emit(TaskEventId.UPDATE_CLEARANCE_GROW_ONLINE_RED)
    }

    updataOnline() {
        this.state = TaskUtil.getOnlineReward()
        if (this.state == 0) {
            this.time = TaskUtil.getOnlineRewardTime();
        }
        gdk.e.emit(TaskEventId.UPDATE_CLEARANCE_GROW_ONLINE_RED)
    }

    updataClearance() {
        gdk.e.emit(TaskEventId.UPDATE_CLEARANCE_GROW_ONLINE_RED)
    }


}
