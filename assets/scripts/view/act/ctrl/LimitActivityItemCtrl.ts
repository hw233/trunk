import ActUtil from '../util/ActUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import TimerUtils from '../../../common/utils/TimerUtils';
import { MainInterface_timeplayCfg } from '../../../a/config';


/** 
 * @Description: 限时活动Item
 * @Author: yaozu.hu  
 * @Date: 2019-03-27 16:57:13 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-29 09:49:37
 */
const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("qszc/view/act/LimitActivityItemCtrl")
export default class LimitActivityItemCtrl extends cc.Component {

    @property(cc.Label)
    nameLb: cc.Label = null;
    @property(cc.Label)
    timeLb: cc.Label = null;
    @property(cc.Label)
    tips: cc.Label = null

    cfg: MainInterface_timeplayCfg;
    endTime: number;
    curType: number;
    callFun: Function;
    arg: any;
    dtime: number = 0;
    clear: boolean = false;
    initData(cfg: MainInterface_timeplayCfg, type: number, time: number, call: Function, arg: any) {
        this.cfg = cfg;
        this.curType = type;
        this.endTime = time;
        this.callFun = call;
        this.arg = arg;
        this.nameLb.string = cfg.name.split('-')[0];
        this.timeLb.string = TimerUtils.diffTimeFormat('hh:mm', time / 1000);//TimerUtils.format2(time / 1000);
        this.tips.string = type == 0 ? gdk.i18n.t("i18n:ACT_LIMIT_TIP1") : gdk.i18n.t("i18n:ACT_LIMIT_TIP2");
        this.clear = false;
    }

    update(dt: number) {
        this.endTime -= dt * 1000;
        this.dtime += dt * 1000;
        if (this.dtime >= 1000) {
            this.dtime -= 1000
            if (this.endTime < 0 && !this.clear) {
                if (this.curType == 0) {
                    this.curType = 1;
                    let nowTime = GlobalUtil.getServerTime();
                    let endTime = ActUtil.getActEndTime(this.cfg.activity_id) || 0;
                    this.endTime = endTime - nowTime;
                    this.tips.string = gdk.i18n.t("i18n:ACT_LIMIT_TIP2")
                } else {
                    if (this.callFun && this.arg) {
                        this.callFun.call(this.arg, this.cfg, this.node, 2)
                    }
                    this.clear = true;
                }
            } else {
                this.timeLb.string = TimerUtils.diffTimeFormat('hh:mm', this.endTime / 1000);//TimerUtils.format2(this.endTime / 1000)
            }
        }
    }

    itemClick() {
        if (this.curType == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_LIMIT_TIP3"))
            return;
        }
        if (this.callFun && this.arg) {
            this.callFun.call(this.arg, this.cfg, this.node, 1)
        }
    }

    onDestroy() {
        this.callFun = null;
        this.arg = null;
        this.cfg = null;
        this.curType = null;
    }
}
