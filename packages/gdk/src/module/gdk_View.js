/**
 * 显示模块基类, 这里不会把自身注册进ModuleManager，但事件通讯是使用ModuleManager，
 * 与UI结合在一起，可以让UI直接与模块对接
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 19:02:31
 */

var View = cc.Class({
    extends: cc.Component,
    mixins: [require("./gdk_BaseModule")],

    ctor() {
        this.__onEnable = this.onEnable;
        this.onEnable = this._onEnable;
        this.__onDisable = this.onDisable;
        this.onDisable = this._onDisable;
    },

    _onEnable() {
        this._setActive(true);
        if (this.__onEnable) {
            this.__onEnable();
        }
    },

    _onDisable() {
        this._setActive(false);
        if (this.__onDisable) {
            this.__onDisable();
        }
    },

    onEnable() {},
    onDisable() {},
});

module.exports = View;