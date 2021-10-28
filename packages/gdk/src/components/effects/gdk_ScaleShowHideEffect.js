/**
 * 缩放效果
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 13:24:46
 */
var ScaleShowHideEffect = cc.Class({
    extends: require("./gdk_BaseShowHideEffect"),
    editor: {
        menu: 'gdk(Effect)/ScaleShowHideEffect',
        disallowMultiple: false
    },
    properties: {

    },
    ctor() {
        this.showAction = null;
        this.hideAction = null;
    },
    doShow(isActioning) {
        if (isActioning == false) {
            this.node.scaleX = this.node.scaleY = this.startValue;
        }
        var action = cc.sequence(
            cc.delayTime(this.showDelay),
            cc.scaleTo(this.showTime, this.normalValue, this.normalValue).easing(this.easeShowFun()),
            cc.callFunc(() => {
                this.showComplete();
            })
        );
        return action;
    },
    doHide(isActioning) {
        var action = cc.sequence(
            cc.delayTime(this.hideDelay),
            cc.scaleTo(this.hideTime, this.endValue, this.endValue).easing(this.easeHideFun()),
            cc.callFunc(() => {
                this.hideComplete();
            })
        );
        return action;
    },
});

module.exports = ScaleShowHideEffect;