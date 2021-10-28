/**
 * 模块基类,给cc.Compoent混合用。 不一般不要接使用它，而是使用View和Module
 * 
 * 可以使用on/once来监听，也可以使用listener函数来监听
 * function listener()
 * {
 *      return {
 *          "moduleName:EventName":function(){}
 *      }
 * }
 * 
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 19:01:56
 */
var ModuleManager = require("../managers/gdk_ModuleManager");

var BaseModuld = cc.Class({
    ctor () {
        this._events = {};
        this._onceEvents = {};
        this._active = false;
        var listener = this.constructor.__listener__;
        if (listener == null && this.listener) {
            listener = this.constructor.__listener__ = [];
            var obj = this.listener();
            for (var i in obj) {
                var arr = i.split(":");
                var moduleName = arr[0];
                var eventName = arr[1];
                listener.push([moduleName, eventName, obj[i]]);
            }
        }
        if (listener) {
            for (var i = 0; i < listener.length; i++) {
                var item = listener[i];
                this.on(item[0], item[1], item[2]);
            }
        }

    },

    properties: {
        moduleName: {
            get() {
                return this.constructor.moduleName || this.constructor.name;
            },
            visible: false,
        }
    },

    _setActive (value) {
        if (this._active == value) return;
        this._active = value;
        for (const key in this._events) {
            var dic = this._events[key];
            for (const k in dic) {
                if (value) {
                    ModuleManager.on(key, k, dic[k], this);
                } else {
                    ModuleManager.off(key, k, dic[k], this);
                }
            }
        }
        for (const key in this._onceEvents) {
            var dic = this._onceEvents[key];
            for (const k in dic) {
                if (dic[k]) {
                    if (value)
                        ModuleManager.once(key, k, dic[k], this);
                    else {
                        if (ModuleManager.hasEvent(key, k, dic[k], this) == false) {
                            this._onceEvents[k] = null;
                        } else {
                            ModuleManager.off(key, k, dic[k], this);
                        }
                    }
                }
            }
        }
    },

    /**
     * 监听一个本模块或其它模块事件, 
     * 这里不会立即监听，而是此模块被激活时才会监听
     * 如果多次同一模块事件，但callback不一样，则不会重复添加回调，事件触发事只会回调最初加入的callback
     * @method on
     * @param {String} moduleName 模块名，如果这里直接写事名，则就是监听本模块事件
     * @param {String} eventType 
     * @param {Function} callback 
     */
    on (moduleName, eventType, callback, thisArg = null) {
        if (eventType instanceof Function) {
            callback = eventType;
            eventType = moduleName;
            moduleName = this.moduleName;
        } else {
            moduleName = this._getModuleName(moduleName);
        }
        var dic = this._events[moduleName];
        if (dic == null) {
            dic = this._events[moduleName] = {};
        }
        if (dic[eventType] == null) {
            dic[eventType] = callback;
            if (this._active) {
                ModuleManager.on(moduleName, eventType, callback, thisArg || this);
            }
        }
    },

    /**
     * 同on， 但只一次
     * @param {*} moduleName 
     * @param {*} eventType 
     * @param {*} callback 
     */
    once (moduleName, eventType, callback, thisArg = null) {
        if (eventType instanceof Function) {
            callback = eventType;
            eventType = moduleName;
            moduleName = this.moduleName;
        } else {
            moduleName = this._getModuleName(moduleName);
        }
        var dic = this._onceEvents[moduleName];
        if (dic == null) {
            dic = this._onceEvents[moduleName] = {};
        }
        if (dic[eventType] == null) {
            dic[eventType] = callback;
            if (this._active) {
                ModuleManager.once(moduleName, eventType, callback, thisArg || this);
            }
        }
    },

    /**
     * 移除事件
     * @param {*} moduleName 
     * @param {*} eventType 
     */
    off (moduleName, eventType, thisArg = null) {
        if (eventType == null) {
            eventType = moduleName;
            moduleName = this.moduleName;
        } else {
            moduleName = this._getModuleName(moduleName);
        }
        var callback;
        var dic = this._events[moduleName];
        if (dic) {
            callback = dic[eventType];
            if (callback) {
                delete dic[eventType];
                if (this._active) {
                    ModuleManager.off(moduleName, eventType, callback, this);
                }
            }
        }
        dic = this._onceEvents[moduleName];
        if (dic) {
            callback = dic[eventType];
            if (callback) {
                delete dic[eventType];
                if (this._active) {
                    ModuleManager.off(moduleName, eventType, callback, thisArg || this);
                }
            }
        }
    },

    /**
     * 派发本模块事件
     */
    emit (eventType, p1, p2, p3, p4, p5) {
        if (this._active) {
            ModuleManager.emit(this.moduleName, eventType, p1, p2, p3, p4, p5);
        }
    },

    /**
     * 给别的模块派发事件
     */
    sendEvent (moduleName, eventType, p1, p2, p3, p4, p5) {
        if (this._active) {
            ModuleManager.emit(moduleName, eventType, p1, p2, p3, p4, p5);
        }
    },

    reset () {
        if (this.onReset) {
            this.onReset();
        }
    },

    _getModuleName (moduleName) {
        if (moduleName instanceof Function) {
            moduleName = moduleName.moduleName || moduleName.name;
        }
        return moduleName;
    },
});

module.exports = BaseModuld;