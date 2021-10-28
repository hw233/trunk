import ActUtil from '../../util/ActUtil';
import TotalLoginItemCtrl from './TotalLoginItemCtrl';
import { ActivityCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-06 09:51:16 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/totalLogin/TotalLoginViewCtrl")
export default class TotalLoginViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    daysNode: cc.Node = null;

    activityId: number = 10;
    cfg: ActivityCfg;
    onEnable() {
        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            this.cfg = ActUtil.getCfgByActId(this.activityId);
        }
        this._initDays();
    }

    onDisable() {
    }

    _initDays() {
        if (!this.cfg) return;
        let rewardType = this.cfg.reward_type;
        let childs = this.daysNode.children;
        childs.forEach((child, idx) => {
            let ctrl = child.getComponent(TotalLoginItemCtrl);
            ctrl.updateView(idx + 1, rewardType);
        });
    }
}
