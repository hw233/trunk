import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { Activitycave_mainCfg } from '../../../../a/config';


/** 
 * @Description: 矿洞大作战入口
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-15 10:03:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineCopyActionViewCtrl")
export default class MineCopyActionViewCtrl extends gdk.BasePanel {

    @property(gdk.List)
    rewardList: gdk.List = null;

    @property(cc.Label)
    resetTimeLabel: cc.Label = null;

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        v = Math.max(0, v);
        this._leftTime = v;
        this.resetTimeLabel.string = gdk.i18n.t("i18n:MINECOPY_TIME_TIP1") + TimerUtils.format4(v);
        if (v == 0) {
            //TODO
            gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_TIME_TIP2"));
            this.close();
        }
    }
    onEnable() {

        let cfg = ConfigManager.getItemById(Activitycave_mainCfg, 1);
        if (cfg) {
            this.rewardList.datas = cfg.show
        }
        let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        this.endTime = ActUtil.getActEndTime(14) / 1000;
        this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
        //this.rewardList.datas = rewards
    }

    onDisable() {

    }

    dtime: number = 0;
    endTime: number = 0;
    update(dt: number) {
        if (!this.leftTime || this.leftTime <= 0) return;
        if (this.dtime >= 1) {
            let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
            this.dtime = 0;
        }
        else {
            this.dtime += dt;
        }
    }
    //前往挑战按钮点击事件
    goActiveBtnClick() {
        gdk.panel.hide(PanelId.ActivityMainView);
        gdk.panel.open(PanelId.MineCopyView);
    }

}
