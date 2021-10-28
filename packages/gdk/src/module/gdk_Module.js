/**
 * 数据逻辑模块基类
 * 项目可以根据情况,
 * 模块内如果有update(dt)函数，则每帧调度
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 19:02:13
 */
var ModuleManager = require("../managers/gdk_ModuleManager");

var Module = cc.Class({
    extends: require("./gdk_BaseModule"),

    properties: {
        /**
         * 激活模块
         */
        active: {
            get() {
                return this._active;
            },
            set(value) {
                this._setActive(value)
                if (this.update) {

                    if (value) {
                        cc.director.getScheduler().enableForTarget(this);
                        cc.director.getScheduler().scheduleUpdate(this, cc.Scheduler.PRIORITY_SYSTEM, false);
                    } else if (!value) {
                        cc.director.getScheduler().unscheduleUpdate(this);
                    }
                }
                if (value && this.onEnable) {
                    this.onEnable();
                } else if (!value && this.onDisable) {
                    this.onDisable();
                }
            },
        }
    },

    ctor() {
        ModuleManager._register(this);
    },

    destroy() {
        this.active = false;
        ModuleManager._unregister(this);
        if (this.onDestroy) {
            this.onDestroy();
        }
    }
});

module.exports = Module;