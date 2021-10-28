import BGameUtils from '../../../common/utils/BGameUtils';
/**
 * 加载进入游戏的资源
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-22 20:17:20
 */

@gdk.fsm.action("LoadResoucesAction", "Boot")
export default class LoadResoucesAction extends gdk.fsm.FsmStateAction {

    startProgress: number;
    endProgress: number;
    progress: number;
    loaded: number;
    step: number;
    rate: number;

    onEnter() {
        let node = gdk.gui.getCurrentLoading();
        if (node) {
            let ctrl = node.getComponent(gdk.LoadingUI);
            this.startProgress = ctrl.loaded;
        }
        this.endProgress = 5;
        this.loaded = this.progress = this.startProgress;
        this.step = 0.1;
        this.rate = (100 - this.startProgress - this.endProgress) / 100;
        gdk.Timer.callLater(this, this.loadRes);
    }

    update() {
        if (this.loaded >= this.progress) {
            return;
        }
        this.loaded += this.step;
        this.loaded = Math.min(this.progress, this.loaded);
        if (gdk.gui.getCurrentLoading()) {
            // 只有存在加载界面时，才更新进度
            gdk.gui.showLoading(gdk.i18n.t('i18n:LOADING_TIP'), this.loaded, 100);
        }
    }

    /**
     * 设置进度
     * @param v 
     * @returns 
     */
    setProgress(v: number) {
        if (!this.active) return;
        if (!gdk.gui.getCurrentLoading()) return;
        this.progress = this.startProgress + v * this.rate;
        this.step = (this.progress - this.loaded) / 10;
    }

    loadRes() {
        if (!this.active) return;
        BGameUtils.loadGameResource(this, gdk.i18n.t('i18n:LOAD_ERROR_MESSAGE'), this.setProgress);
    }
}