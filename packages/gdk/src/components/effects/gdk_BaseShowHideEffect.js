var HideMode = require("../../const/gdk_HideMode");
var ShowHideComponent = require("../gdk_ShowHideComponent");
var EaseType = require("../../const/gdk_EaseType");

/**
 * 显示隐藏效果基类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 13:23:38
 */

var BaseShowHideEffect = cc.Class({
    extends: ShowHideComponent,
    editor: {
        //   menu: 'gdk(Effect)/BaseShowHideEffect',
        disallowMultiple: false
    },
    properties: {
        startValue: 0,
        normalValue: 1,
        endValue: 0,
        showTime: 0.5,
        hideTime: 0.5,
        showDelay: 0,
        hideDelay: 0,
        ease: {
            default: EaseType.easeQuarticActionOut,
            type: EaseType
        },
        hideEase: {
            default: EaseType.easeQuarticActionIn,
            type: EaseType
        },
    },

    doShow() {
        this.node.active = true;
        this.showComplete();
    },
    doHide() {
        this.hideComplete();
    },

    isShowEffect() {
        return this.showTime > 0 || this.showDelay;
    },
    isHideEffect() {
        return this.hideTime > 0 || this.hideDelay > 0;
    },

    easeShowFun(p = 3) {
        let ease = EaseType[this.ease];
        let fun = cc[ease];
        if (fun == null) {
            fun = cc[EaseType[EaseType.easeLinear]];
        }
        return fun.call(this, p);
    },
    easeHideFun(p = 3) {
        let ease = EaseType[this.hideEase];
        let fun = cc[ease];
        if (fun == null) {
            fun = cc[EaseType[EaseType.easeLinear]];
        }
        return fun.call(this, p);
    },
});

module.exports = BaseShowHideEffect;