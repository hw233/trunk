var BaseTween = require("./gdk_BaseTween");
var EaseType = require("../../const/gdk_EaseType");

/**
 * 旋转动画
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-04-29 20:18:58
 */
var RotateTween = cc.Class({
    extends: BaseTween,
    editor: {
        menu: 'gdk(Component)/RotateTween',
        disallowMultiple: false
    },
    properties: {

        _to: {
            default: 360,
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
            this.node.angle = -this._from;
        }
        var a1;
        if (this._isBy) {
            a1 = cc.rotateBy(this._time, this._to);
        } else {
            a1 = cc.rotateTo(this._time, this._to);
        }
        var ease = EaseType[this._ease];
        var fun = cc[ease];
        if (fun) {
            a1.easing(fun(3.0));
        }
        var action = cc.sequence(a1, cc.callFunc(
            function () {
                this.onComplete.emit();
            }, this
        ));
        if (this._loop == -1) {
            action = cc.repeatForever(action);
        } else if (this._loop > 0) {
            action = cc.repeat(action);
        }
        this._action = action;
        this.node.runAction(action);
    },
});


module.exports = RotateTween;