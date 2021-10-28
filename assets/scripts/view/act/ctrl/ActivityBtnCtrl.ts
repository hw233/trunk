import GlobalUtil from '../../../common/utils/GlobalUtil';
import { ActivityEventId } from '../enum/ActivityEventId';
import { ActType } from '../config/ActivityConfig';

/** 
 * @Description: 活动按钮控制器
 * @Author: weiliang.huang  
 * @Date: 2019-03-27 16:35:20 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-06 10:29:30
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/ActivityBtnCtrl")
export default class ActivityBtnCtrl extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Label)
    timeLab: cc.Label = null;

    info: ActType = null

    start() {

    }

    onDestroy() {
        this.unscheduleAllCallbacks()
    }

    stopTimer() {
        this.unscheduleAllCallbacks()
    }

    updateActivityInfo(info) {
        this.info = info

        this._updateIcon()

        this._updateTime()
    }

    _updateIcon() {
        GlobalUtil.setSpriteIcon(this.node, this.icon, "icon/activity/" + this.info.icon)
    }

    _updateTime() {
        if (this.info.endTime != "") {
            this.timeLab.node.active = true
            this.unscheduleAllCallbacks()
            this.schedule(this._updateTimeText, 1)
            this._updateTimeText()
        } else {
            this.timeLab.node.active = false
        }
    }

    _updateTimeText() {
        let endTime = new Date(this.info.endTime).valueOf()
        let nowTime = Date.now()
        let remainTime = Math.floor((endTime - nowTime) / 1000)
        if (remainTime <= 0) {
            this.stopTimer()
            gdk.e.emit(ActivityEventId.ACTIVITY_REMOVE, this.info.id)
            return
        }
        remainTime = Math.max(remainTime, 0)
        let day = Math.floor(remainTime / 3600 / 24)
        if (day > 0) {
            this.timeLab.string = `${day}${gdk.i18n.t("i18n:EXC_ACT_TIP6")}`;
        } else {
            let hour = Math.floor(remainTime / 3600)
            let min = Math.floor(remainTime % 3600 / 60)
            let sec = Math.floor(remainTime % 60)
            let text = `${GlobalUtil.padLeft(hour, 2)}:${GlobalUtil.padLeft(min, 2)}:${GlobalUtil.padLeft(sec, 2)}`
            this.timeLab.string = text
        }
    }

    /**活动按钮点击函数 */
    clickFunc() {
        switch (this.info.id) {

        }
    }
}
