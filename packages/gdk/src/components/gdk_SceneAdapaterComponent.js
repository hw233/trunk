/**
 * 长屏幕适配
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-10 02:56:36
 */

var SceneAdapaterComponent = cc.Class({
    extends: cc.Component,
    editor: {
        inspector: 'packages://gdk/scripts/SceneAdapaterComponentInspector.js',
        menu: 'gdk(Component)/SceneAdapaterComponent',
        disallowMultiple: false,
        requireComponent: cc.Canvas
    },

    __preload () {
        let canvas = this.getComponent(cc.Canvas);
        let ds = canvas.designResolution;
        let dr = ds.height / ds.width;
        let fs = cc.view.getFrameSize();
        let fr = fs.height / fs.width;
        if (cc.sys.isBrowser && cc.sys.isMobile && fr > 1.3) {
            // 手机浏览器，且手机屏幕高宽正常
            if (dr > 1) {
                // 竖屏，优先适配宽度
                canvas.fitHeight = false;
                canvas.fitWidth = true;
            } else {
                // 横屏，优先适配高度
                canvas.fitHeight = true;
                canvas.fitWidth = false;
            }
        } else {
            // 非手机浏览器
            if (fr >= dr) {
                canvas.fitHeight = false;
                canvas.fitWidth = true;
            } else if (fr < dr) {
                canvas.fitHeight = true;
                canvas.fitWidth = false;
            }
        }
        this.canvas = canvas;
    }
});

module.exports = SceneAdapaterComponent;