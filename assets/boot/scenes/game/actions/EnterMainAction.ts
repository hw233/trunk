import BGameUtils from '../../../common/utils/BGameUtils';

/**
 * 进入主场景动作
 * @Author: sthoo.huang
 * @Date: 2020-12-22 15:57:19
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-05 17:03:13
 */
@gdk.fsm.action("EnterMainAction", "Game")
export default class EnterMainAction extends gdk.fsm.FsmStateAction {

    progress: number;
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
        this.max = 100;
        BGameUtils.enterMain(this);
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

    onExit() {
        this.setProgress(this.max);
        BGameUtils.enterMainOnExit(this);
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