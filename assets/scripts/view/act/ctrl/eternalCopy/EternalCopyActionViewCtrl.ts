import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import { CopyCfg, MainInterface_timeplayCfg } from '../../../../a/config';

/** 
 * @Description: 武魂试炼入口
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-29 09:50:02
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/eternalCopy/EternalCopyActionViewCtrl")
export default class EternalCopyActionViewCtrl extends cc.Component {


    @property(cc.Label)
    resetTimeLabel: cc.Label = null;


    _leftTime: number;
    dtime: number = 0;
    endTime: number = 0;
    activeId: number = 0;
    copyCfg: CopyCfg;
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }
    // get leftTime(): number { return this._leftTime; }
    // set leftTime(v: number) {
    //     if (!v && v != 0) return;
    //     v = Math.max(0, v);
    //     this._leftTime = v;
    //     this.resetTimeLabel.string = '' + TimerUtils.format2(v);
    //     if (v == 0) {
    //         //TODO
    //         //gdk.gui.showMessage('武魂试炼已结束');
    //         this.refreshActivityData()
    //         //this.node.active = false;
    //     }
    // }

    onEnable() {
        this.refreshActivityData()
    }

    refreshActivityData() {
        // let cfgs = ConfigManager.getItems(CopyCfg, (item: CopyCfg) => {
        //     if (item.copy_id == 15) {
        //         return true;
        //     }
        //     return false;
        // })

        // if (cfgs.length > 0) {
        //     cfgs.forEach(cfg => {
        //         if (ActUtil.ifActOpen(cfg.activityid)) {
        //             this.activeId = cfg.activityid
        //             this.copyCfg = cfg;
        //         }
        //     });
        // }
        // if (this.copyCfg == null) {
        //     //gdk.gui.showMessage('武魂试炼已结束');
        //     this.node.active = false;
        //     return;
        // }
        let temCfgs = ConfigManager.getItems(MainInterface_timeplayCfg);
        let listData = []
        let nowTime = GlobalUtil.getServerTime();
        temCfgs.forEach(cfg => {
            //type 0多久后开启 1多久后结束
            if (!ActUtil.ifActOpen(cfg.activity_id)) {
                if (!cc.js.isString(cfg.before_open)) {
                    let before = cfg.before_open as any;
                    let startTime = ActUtil.getActStartTime(cfg.activity_id) || 0;
                    let beforTime = startTime - (before[2] * 24 * 60 * 60 + before[3] * 60 * 60 + before[4] * 60) * 1000;
                    if (nowTime < startTime && nowTime > beforTime && (cfg.show != '' || JumpUtils.ifSysOpen(cfg.system))) {
                        listData.push({ cfg: cfg, type: 0, time: startTime - nowTime })
                    }
                }
            } else if (cfg.show != '' || JumpUtils.ifSysOpen(cfg.system)) {
                let endTime = ActUtil.getActEndTime(cfg.activity_id)
                listData.push({ cfg: cfg, type: 1, time: endTime - nowTime })
            }
        })
        if (listData.length == 0) {
            this.node.active = false;
            return
        }
        this.resetTimeLabel.string = ''
        // this.node.active = this.copyCfg != null;
        // let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        // this.endTime = ActUtil.getActEndTime(this.activeId) / 1000;
        // this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
    }

    onDisable() {

    }
    update(dt: number) {
        // if (!this.leftTime || this.leftTime <= 0) return;
        // if (this.dtime >= 1) {
        //     let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        //     this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
        //     this.dtime = 0;
        // }
        // else {
        //     this.dtime += dt;
        // }
    }

    //前往挑战按钮点击事件
    goActiveBtnClick() {

        //gdk.panel.open(PanelId.EternalCopyView);
        let pos: cc.Vec2 = this.node.convertToWorldSpaceAR(cc.v2(0, -60));
        gdk.panel.setArgs(PanelId.LimitTimeActivity, pos)
        gdk.panel.open(PanelId.LimitTimeActivity);

    }
}
