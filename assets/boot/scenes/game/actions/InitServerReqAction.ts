import BGameUtils from '../../../common/utils/BGameUtils';

/**
 * 执行需要上线请求
 * @Author: weiliang
 * @Date: 2019-04-09 18:08:59
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-05 17:01:06
 */
@gdk.fsm.action("InitServerReqAction", "Game")
export default class InitServerReqAction extends gdk.fsm.FsmStateAction {

    progress: number = 0;
    step: number;
    time: number;
    max: number;

    onEnter() {
        let node = gdk.gui.getCurrentLoading();
        if (node) {
            let ctrl = node.getComponent(gdk.LoadingUI);
            this.progress = ctrl.loaded;
        }
        this.step = 0.015;
        this.time = 0;
        this.max = 99;
        BGameUtils.initServerRequest(this);
    }

    onExit() {
        BGameUtils.initServerRequestOnExit(this);
    }

    update(dt: number) {
        if (this.progress >= this.max) {
            return;
        }
        this.progress += this.step;
        this.progress = Math.min(this.max, this.progress);
        this.time += dt;
        if (this.time > 10) {
            this.time = 0;
            this.step *= 0.9;
        }
        this.setProgress(this.progress);
    }

    /**
     * 设置进度
     * @param v 
     * @returns 
     */
    setProgress(v: number) {
        if (!this.active) return;
        if (!gdk.gui.getCurrentLoading()) return;
        // 只有存在加载界面时，才更新进度
        gdk.gui.showLoading(gdk.i18n.t('i18n:LOADING_TIP'), v, 100);
    }
}