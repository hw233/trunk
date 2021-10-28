/**
 * 模块管理器
 * 模块间的通讯能力并非使用EventManager，它只存在于模块间与view之间。
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-06 14:47:32
 */
var Log = require("../Tools/gdk_Log");

function ModuleManager (m) {
    return ModuleManager.get(m);
};

ModuleManager._moduleMap = new Map();
ModuleManager._moduleDic = {};

/**
 * 模块数量
 * @property {number} count
 */
Object.defineProperty(ModuleManager, "count", {
    get: function () {
        return this._moduleMap.size;
    },
    enumerable: true,
    configurable: true
});


/**
 * 添加模块
 * @method add
 * @param {Function|[Function]} modules  模块类
 * @param {Boolean} active 是否激活，默认true
 */
ModuleManager.add = function (modules, active = true) {
    if (modules instanceof Array) {
        var arr = [];
        for (let i = 0; i < modules.length; i++) {
            arr.push(this._add(modules[i], active));
        }
        return arr;
    } else
        return this._add(modules, active);
};
/**
 * 移除模块
 * @method remove
 * @param {Function|[Function]|string|[string]} modules 模块类， 或模块名
 */
ModuleManager.remove = function (modules) {
    if (modules instanceof Array) {
        for (let i = 0; i < modules.length; i++) {
            this._remove(modules[i]);
        }
    } else
        this._remove(modules);
};

/**
 * 激活或不激活模块
 * @method setActive
 * @param {Function|string} m 模块类， 或模块名
 * @param {Boolean} active
 */
ModuleManager.setActive = function (m, active) {
    var o = this.get(m);
    if (o) {
        o.active = active;
    }

};

/**
 * 模块是否激活？
 * @param {Function|String} m 模块类， 或模块名
 * @returns {boolean}
 */
ModuleManager.isActive = function (m) {
    var o = this.get(m);
    return o && o.active;
};

/**
 * 模块是否存在
 * @param {Function|String} m 模块类， 或模块名
 * @returns {boolean}
 */
ModuleManager.has = function (m) {
    if (m instanceof Function)
        return this._moduleMap.has(m)
    return this._moduleDic[m] != null;
};

/**
 * 获取模块
 * 如果参数传入的模块类，如果该模块不存在，则自动创建
 * @method get
 * @param {Function|String} m 模块类， 或模块名
 * @returns {Module}
 */
ModuleManager.get = function (m) {
    let o;
    if (m instanceof Function) {
        o = this._moduleMap.get(m);
        if (o == null) {
            o = this._add(m, true);
        }
    } else
        o = this._moduleDic[m];
    return o;
};

/**
 * 重置模块, 通常用于退出登录，重置模块内的数据
 * @method reset
 * @param {Function|String} m 模块类， 或模块名
 */
ModuleManager.reset = function (m) {
    var o = this.get(m);
    if (o) o.reset();
};

/**
 * 重置模块, 通常用于退出登录，重置模块内的数据
 * @method resetAll
 */
ModuleManager.resetAll = function () {
    for (const iterator of this._moduleMap.values) {
        iterator.reset();
    }
};

ModuleManager._add = function (mo, active = true) {
    if (this._moduleMap.has(mo) == false) {
        var m = new mo();
        // this._register(m); 模块内自动调用注册
        if (active)
            m.active = active;
        return m;
    } else {
        Log.errorEnable && Log.error(`ModuleManager: ${mo.name} is exist`);
    }
    return this._moduleMap.get(mo);
};

ModuleManager._register = function (m) {
    var mo = m.constructor;
    var moduleName = m.moduleName;
    if (!moduleName) {
        Log.errorEnable && Log.error(`ModuleManager.register: moduleName is null`);
        return;
    }
    Log.logEnable && Log.log("ModuleManager._register moudle:" + moduleName);
    if (this._moduleMap.has(mo) == false && !this._moduleDic[moduleName]) {
        if (!m.moduleName)
            m.moduleName = moduleName;
        this._moduleMap.set(mo, m);
        this._moduleDic[moduleName] = m;
    } else {
        Log.errorEnable && Log.error(`ModuleManager: ${moduleName} is exist`);
    }

};

ModuleManager._remove = function (m) {
    var o = this.get(m);
    if (o) {
        o.destroy();
    }
};

ModuleManager._unregister = function (m) {
    var mo = m.constructor;
    if (this._moduleMap.has(mo)) {
        this._moduleMap.delete(mo);
        var moduleName = m.moduleName || m.name;
        delete this._moduleDic[moduleName];
        Log.logEnable && Log.log("ModuleManager._unregister moudle:" + moduleName);
    }
};

//  通讯功能    //


var EventTrigger = require("../core/gdk_EventTrigger");
ModuleManager._eventTriggerDic = {}; // 所有的事件
ModuleManager._eventTrggerCount = 0;

/**
 * 监听一个模块事件回调，回调参数为具体看该事件派发的参数
 * 回调函可以通过返回一个对象给模块事件派发者，
 * 如果返回对象格式为{isStoped:boolean,value:any},则isStoped会控制是否停止事件继续传递，value为返回给派发者的数据,如果不是这种格式，则整个对象返回给模块派发者
 * @method on
 * @param {String|Function} moduleName  模块名
 * @param {string} eventType  事件类型
 * @param {callback} callback 回调
 * @param {any} thisArg  回调的this
 * @param {number} priority 优先级
 */
ModuleManager.on = function (moduleName, eventType, callback, thisArg = null, priority = 0) {
    var trigger = this._getEventTrigger(moduleName, eventType, true);
    if (trigger)
        trigger.on(callback, thisArg, priority);
};

/**
 * 与on一致，但只监听一次。
 * @method once
 * @param {String|Function} moduleName  模块名
 * @param {string} eventType  事件类型
 * @param {callback} callback 回调
 * @param {any} thisArg  回调的this
 * @param {number} priority 优先级
 */
ModuleManager.once = function (moduleName, eventType, callback, thisArg = null, priority = 0) {
    var trigger = this._getEventTrigger(moduleName, eventType, true);
    if (trigger)
        trigger.once(callback, thisArg, priority);
};

/**
 * 取消一个事件监听
 * @method off
 * @param {String|Function} moduleName  模块名
 * @param {string} eventType  事件类型
 * @param {call} callback  回调
 */
ModuleManager.off = function (moduleName, eventType, callback, thisArg = null) {
    var trigger = this._getEventTrigger(moduleName, eventType, false);
    if (trigger) {
        trigger.off(callback, thisArg);
        if (trigger.count == 0)
            this._removeEventTrigger(moduleName, eventType);
    }
};

/**
 * 取消这个对象注册的所有监听
 * @method targetOff
 * @param {any} thisArg 
 */
ModuleManager.targetOff = function (thisArg) {
    for (var key in this._eventTriggerDic) {
        var triggerDic = this._eventTriggerDic[key];
        if (triggerDic) {
            for (var k in triggerDic) {
                var trigger = triggerDic[k];
                trigger.targetOff(thisArg);
            }
        }
    }
};

/**
 * 获取指定事件类型的触发器，
 * @method _getEventTrigger
 * @param {string|Function} moduleName 模块名
 * @param {string} eventType 事件类型
 * @param {boolen} autoCreate 不存在时，是否创建 ，默认false
 */
ModuleManager._getEventTrigger = function (moduleName, eventType, autoCreate = false) {
    if (!moduleName || !eventType)
        return null;
    var trigger = null;
    if (moduleName instanceof Function)
        moduleName = moduleName.moduleName || moduleName.name;
    var triggerDic = this._eventTriggerDic[moduleName];
    if (triggerDic == null) {
        if (autoCreate)
            triggerDic = this._eventTriggerDic[moduleName] = {};
    } else
        trigger = triggerDic[eventType];

    if (trigger == null && autoCreate) {
        this._eventTrggerCount++;
        trigger = triggerDic[eventType] = EventTrigger.get();
    }
    return trigger;
};

ModuleManager._removeEventTrigger = function (moduleName, eventType) {
    if (!moduleName || !eventType)
        return null;
    var trigger = null;
    if (moduleName instanceof Function)
        moduleName = moduleName.moduleName || moduleName.name;
    var triggerDic = this._eventTriggerDic[moduleName];
    if (triggerDic) {
        trigger = triggerDic[eventType];
        if (trigger) {
            delete triggerDic[eventType]
            this._eventTrggerCount--;
            trigger.release();
        }
    }
};

/**
 * 派发事件
 * @method emit
 * @param {String|Function} moduleName  模块名
 * @param {String} eventType 事件名
 * @returns {any} 事件回调函数里的return返回值
 */
ModuleManager.emit = function (moduleName, eventType, p1 = null, p2 = null, p3 = null, p4 = null, p5 = null) {
    var trigger = this._getEventTrigger(moduleName, eventType, false);
    if (trigger) {
        var returnData = trigger.emit(p1, p2, p3, p4, p5);
        return returnData;
    }
};

/**
 * 是否有监听
 * @param {String|Function} moduleName 
 * @param {*} eventType 
 * @param {*} callBack 
 * @param {*} thisArgs 
 */
ModuleManager.hasEvent = function (moduleName, eventType, callBack, thisArgs) {
    var trigger = this._getEventTrigger(eventType, false);
    if (trigger) {
        return trigger.has(callBack, thisArgs)
    }
    return false;
};


module.exports = ModuleManager;