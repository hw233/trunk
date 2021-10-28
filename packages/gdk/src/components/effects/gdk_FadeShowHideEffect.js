/**
 * 渐现效果
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 13:24:39
 */
var FadeShowHideEffect = cc.Class({
    extends: require("./gdk_BaseShowHideEffect"),
    editor: {
        menu: 'gdk(Effect)/FadeShowHideEffect',
        disallowMultiple: false
    },
    properties: {
        normalValue: {
            default: 255,
            override: true
        },
    },

    doShow(isActioning) {
        if (isActioning == false) {
            this.node.opacity = this.startValue;
        }
        var actionn = cc.sequence(
            cc.delayTime(this.showDelay),
            cc.fadeTo(this.showTime, this.normalValue).easing(this.easeShowFun()),
            cc.callFunc(() => {
                this.showComplete();
            })
        );
        return actionn;
    },
    doHide(isActioning) {
        var actionn = cc.sequence(
            cc.delayTime(this.hideDelay),
            cc.fadeTo(this.hideTime, this.endValue).easing(this.easeHideFun()),
            cc.callFunc(() => {
                this.hideComplete();
            })
        );
        return actionn
    },
});

module.exports = FadeShowHideEffect;