var BaseTween = require("./gdk_BaseTween");
var EaseType = require("../../const/gdk_EaseType");

/**
 * 缩放动画
 * @Author: sthoo.huang 
 * @Date: 2020-04-29 19:52:03
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-04-29 20:18:56
 */
var ScaleTween = cc.Class({
    extends: BaseTween,
    editor: {
        menu: 'gdk(Component)/ScaleTween',
        disallowMultiple: false
    },
    properties: {
        _to: {
            default: 2,
            visible: true,
            serializable: true,
            override: true,
        },
        _loop: {
            default: -1,
            visible: true,
            serializable: true,
            override: true,
        },
        _action: null,
    },

    updateTween () {
        if (this._action) {
            this.node.stopAction(this._action);
        }
        // 调用super的方法
        let _super = cc.js.getSuper(this.__proto__.constructor);
        if (_super && _super.prototype && _super.prototype.updateTween) {
            _super.prototype.updateTween.call(this);
        }
        // this._super();
        if (this._fromIsCurrent == false) {
            this.node.scale = this._from;
        }
        var a1 = cc.scaleTo(this._time, this._to);
        var a2 = cc.scaleTo(this._time, this._from);
        var ease = EaseType[this._ease];
        var fun = cc[ease];
        if (fun) {
            a1.easing(fun(3.0));
            a2.easing(fun(3.0));
        }
        var action = cc.sequence(a1, a2);
        if (this._loop == -1) {
            action = cc.repeatForever(action);
        } else if (this._loop > 0) {
            action = cc.repeat(action);
        }
        this._action = action;
        this.node.runAction(action);
    },
});


module.exports = ScaleTween;