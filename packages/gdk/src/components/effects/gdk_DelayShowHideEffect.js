var HideMode = require("../../const/gdk_HideMode");
var ShowHideComponent = require("../gdk_ShowHideComponent");
var EaseType = require("../../const/gdk_EaseType");
var DelayCall = require("../../core/gdk_DelayCall");

/**
 * 延迟显示
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-30 19:47:35
 */

var DelayShowHideEffect = cc.Class({
    extends: ShowHideComponent,
    editor: {
        menu: 'gdk(Effect)/DelayShowHideEffect',
        disallowMultiple: false
    },
    properties: {
        showDelay: 1,
        hideDelay: 1,
    },

    //过场景时直接完成吧
    onDisable () {
        // 调用super的方法
        let _super = cc.js.getSuper(this.__proto__.constructor);
        if (_super && _super.prototype && _super.prototype.onDisable) {
            _super.prototype.onDisable.call(this);
        }
        // this._super();
        DelayCall.cancel(this._hideComplete, this);
        DelayCall.cancel(this._showComplete, this);
    },

    doShow () {
        DelayCall.cancel(this._hideComplete, this);
        DelayCall.addCall(this._showComplete, this, this.showDelay);
    },
    doHide () {
        DelayCall.cancel(this._showComplete, this);
        DelayCall.addCall(this._hideComplete, this, this.hideDelay);

    },
    _showComplete () {
        if (cc.isValid(this.node, true))
            this.showComplete();
    },
    _hideComplete () {
        if (cc.isValid(this.node, true))
            this.hideComplete();
    },
    isShowEffect () {
        return this.showDelay;
    },
    isHideEffect () {
        return this.hideDelay > 0;
    },
});

module.exports = DelayShowHideEffect;