const POOL_MAX = 999;
const POOL_CLEAR_TIME = 30;
var pool = {

    index: Object.create(null),
    get(c) {
        const PoolManager = require("../managers/gdk_PoolManager");
        let k = '__gdk_event_trigger_' + c.name;
        let v = PoolManager.get(k);
        if (!v) {
            v = new c();
        }
        return v;
    },

    put (v) {
        const PoolManager = require("../managers/gdk_PoolManager");
        let k = '__gdk_event_trigger_' + v.constructor.name;
        if (!this.index[k]) {
            this.index[k] = true;
            PoolManager.setSize(k, POOL_MAX);
            PoolManager.setClearTime(k, POOL_CLEAR_TIME);
        }
        PoolManager.put(k, v);
    },

};

/**
 * 事件派发器, 类似于EventTarget
 * 为什么要重写一个？
 * 1. 因为EventTarget带节点事件冒泡，对于非节点组件事件来说根本没这个必要，所EventTrigger不会冒泡
 * 2. EventTarget 即使外面无监听，eimt时一样会轮询派发。EventTrigger会判断一下监听列表为空时直接返回
 * 3. EventTarget派发时包装一个Event对象，且使用对象池，Event派发完没清理就丢进池中,内存泄漏
 * 4. EventTarget无事件优先级功能，EventTrigger有
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-09-26 11:25:05
 */
function EventTrigger () {
    this._callbacks = null;
    this._isSortCallback = false;
};
var proto = EventTrigger.prototype;

/**
 * 注册的事件数量
 * @prop {number} count
 */
Object.defineProperty(proto, "count", {
    get: function () {
        return this._callbacks.length;
    },
    enumerable: true,
    configurable: true
});

/**
 * 注册监听事件
 * 回调函可以通过返回一个对象给派发者，
 * 如果返回对象格式为{isStoped:boolean,value:any},则isStoped会控制是否停止事件继续传递，value为返回给派发者的数据,如果不是这种格式，则整个对象返回给派发者
 * @method on
 * @param {Function} callback 事件触发时的回调，函数内可以return返回数据给emit派发者
 * @param {number} priority 优先级
 * @returns {any} 返回给派发者的对象
 */
proto.on = function (callback, thisArg = null, priority = 0, hasEventArg = true) {
    this._on(callback, false, thisArg, priority, hasEventArg);
};

/**
 * 同on,但
 * 只监听一次,
 * @method once
 * @param {Function} callback 事件触发时的回调，函数内可以return返回数据给emit派发者
 * @param {number} priority 优先级
 * @returns {any} 返回给派发者的对象
 */
proto.once = function (callback, thisArg = null, priority = 0, hasEventArg = true) {
    this._on(callback, true, thisArg, priority, hasEventArg);
};

/**
 * 取消监听
 */
proto.off = function (callback, thisArg) {
    var arr = this._callbacks;
    if (arr && arr.length > 0) {
        for (var i = 0, n = arr.length; i < n; i++) {
            if (arr[i].callback == callback && arr[i].thisArg == thisArg) {
                _remove(arr, i);
                break;
            }
        }
        if (arr.length == 0) {
            this._isSortCallback = false;
        }
    }
};

/**
 * 取消所有监听
 */
proto.offAll = function () {
    this._isSortCallback = false;
    if (this._callbacks) {
        this._callbacks.length = 0;
    }
};

/**
 * 取消所有一次性监听
 */
proto.offOnce = function () {
    var arr = this._callbacks;
    if (arr && arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].isOnce) {
                _remove(arr, i);
                --i;
            }
        }
        if (arr.length == 0) {
            this._isSortCallback = false;
        }
    }
};

/**
 * 取消目标身上的所有监听
 */
proto.targetOff = function (thisArg) {
    var arr = this._callbacks;
    if (arr && arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].thisArg == thisArg) {
                _remove(arr, i);
                --i;
            }
        }
        if (arr.length == 0) {
            this._isSortCallback = false;
        }
    }
};

/**
 * 触发事件,
 * 最多支持5个参数，不使用...rest可变参的原因是，事件可能频繁调用，可变参数会组装成数组，有gc产生 
 * 回调函可以直接返回一个对象给eimit调用者，或者通过返回一个特定结构对象{isStoped:boolean,value:any}来停止事件传递或返回值给派发者
 * @returns 返回回调的返回值，如果有多个回调，则返回不为null的那个，多个不为空返回时，前面的可以被后面冲掉，小心
 */
proto.emit = function (p1 = null, p2 = null, p3 = null, p4 = null, p5 = null) {
    if (this.__gdk_inPool__) return;
    var result = null;
    if (this._callbacks && this._callbacks.length > 0) {
        if (this._callbacks.length == 1) { //如果列表只有一个回调，快速实现，不用拷则对象
            var listener = this._callbacks[0];
            var arg0 = listener.hasEventArg ? p1 : p1.data;
            if (listener.isOnce) this._callbacks.length = 0;
            if (listener.thisArg) {
                result = listener.callback.call(listener.thisArg, arg0, p2, p3, p4, p5);
            } else {
                result = listener.callback(arg0, p2, p3, p4, p5);
            }
        } else {
            // 在调回的过程中，可能会有注册监听和取消监听的操作，所以要先拷贝再遍历回调。
            var doCallbacks = this._callbacks.concat();
            if (this._isSortCallback) {
                this._callbacks.sort(_sortCallBack);
            }
            for (var i = 0; i < this._callbacks.length; i++) {
                var listener = this._callbacks[i];
                if (listener.isOnce) {
                    _remove(this._callbacks, i);
                    --i;
                }
            }
            if (this._callbacks.length == 0) {
                this._isSortCallback = false;
            }
            for (var i = 0, n = doCallbacks.length; i < n; i++) {
                var listener = doCallbacks[i];
                if (result && result.isStopped) break;
                var arg0 = listener.hasEventArg ? p1 : p1.data;
                var resultTemp = null;
                if (listener.thisArg) {
                    resultTemp = listener.callback.call(listener.thisArg, arg0, p2, p3, p4, p5);
                } else {
                    resultTemp = listener.callback(arg0, p2, p3, p4, p5);
                }
                if (resultTemp != null) {
                    result = resultTemp;
                }
            }
        }
    }
    if (result && (result.hasOwnProperty("isStopped") || result.hasOwnProperty("value"))) {
        return result.value;
    }
    return result;
};

/**
 * @method has 
 * @param {function} callback 
 * @param {any} thisArg 
 */
proto.has = function (callback, thisArg = null) {
    if (callback == null)
        return false;
    return this._get(callback, thisArg) != null;
};

/**
 * 使用完毕放回对象池
 * @method release
 */
proto.release = function () {
    EventTrigger.put(this);
};

//// 私有 ///
proto._on = function (callback, isOnce, thisArg, priority, hasEventArg = true) {
    if (callback == null || this.__gdk_inPool__) {
        return;
    }
    if (!this._callbacks) {
        this._callbacks = [];
    }
    var listener = this._get(callback, thisArg);
    if (listener == null) {
        listener = Listener.get();
        this._callbacks.push(listener);
        listener.callback = callback;
        listener.thisArg = thisArg;
    }
    listener.priority = priority;
    this._isSortCallback = (priority != 0) || this._isSortCallback
    listener.isOnce = isOnce;
    listener.hasEventArg = hasEventArg;
};

// 监听列表中获取回调对象
proto._get = function (callback, thisArg = null) {
    let callbacks = this._callbacks;
    if (callbacks && callbacks.length > 0) {
        for (var i = 0, n = callbacks.length; i < n; i++) {
            let lis = callbacks[i];
            if (lis.callback === callback && lis.thisArg === thisArg) {
                return lis;
            }
        }
    }
    return null;
};

function _remove (arr, i) {
    arr[i] = arr[arr.length - 1];
    --arr.length;
};

function _sortCallBack (o1, o2) {
    return o1.priority > o2.priority ? -1 : 1;
};

/**
 * 从对象池中获取一个事件派发器
 * @method get
 */
EventTrigger.get = function () {
    return pool.get(EventTrigger);
};

/**
 * 放回池子
 */
EventTrigger.put = function (e) {
    e.offAll();
    pool.put(e);
};

///  回调对象 ////
function Listener () {
    this.unuse();
};

Listener.prototype.unuse = function () {
    this.callback = null;
    this.isOnce = false;
    this.thisArg = null;
    this.priority = 0;
    this.hasEventArg = true;
};

Listener.get = function () {
    return pool.get(Listener);
};

Listener.put = function (listener) {
    pool.put(listener);
};

module.exports = EventTrigger;