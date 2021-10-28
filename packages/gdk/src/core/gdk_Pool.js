/**
 * @Description: 带自己动清理功能的对象池, 会定期清理不活动的对象
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-01-03 16:45:17
 */

//清理对象
function _destroyObj (pool, obj) {
    pool.onClear && pool.onClear(obj);
    obj.destroy && obj.destroy.call(obj);
};

// gdk_Pool
function Pool () {
    /**
     * 对象池满了，或对象不活跃了被清除时回调 function(obj){}
     * @function onClear
     */
    this.onClear;
    /**
     * 对象被放入池子时回调 function(obj){}
     * @function onPut
     */
    this.onPut;
    /**
     * 对象被重新使用时回调,如果池中没对象，参数为空 function(obj){}
     * @function onGet
     */
    this.onGet;
    /**
     * 对象不存在时，创建对象的方法 
     * return object
     * @function createFun
     */
    this.createFun;
    this._size = 10;
    this._pool = [];
    this._clearTime = null;
};
var proto = Pool.prototype;

/**
 * 获取对象池中的对象，如果对象池没有可用对象，则返回空。
 * 并触发Pool.onGet=function(obj)回调，如果池中没对象了，参数obj可能为空，
 * 同时onGet回调也可以判断对象是否还可用，如果不可用了返回false
 * 如果对象不为空，且对象里有方法reuse，则回调对象的reuse方法
 * @method get
 */
proto.get = function () {
    var pool = this._pool;
    var cache = null;
    while (pool.length > 0) {
        var obj = pool.pop();
        if (cc.isValid(obj, true)) {
            cache = obj;
            break;
        }
    }
    if (this.onGet) {
        var result = this.onGet(cache);
        if (result != null && result == false) {
            cache = null;
        }
    }
    if (cache) {
        if (cache.reuse) cache.reuse.call(cache);
        if (cache.__gdk_inPool__) delete cache.__gdk_inPool__;
        if (cache.__gdk_inPoolTime__) delete cache.__gdk_inPoolTime__;
        if (pool.length == 0) {
            const Timer = require("./gdk_Timer");
            Timer.clear(this, this.clearInactivity);
        }
    } else {
        if (this.createFun) cache = this.createFun();
    }

    return cache;
};

proto.isInPool = function (obj) {
    return obj.__gdk_inPool__ == true;
};

/**
 * 向对象池返还一个不再需要的对象。
 * 并触发Pool.onPut=function(obj)回调,
 * 如果象里有方法unuse，则回调对象的unuse方法,
 * 如果对象池已满，则回调Pool.onClear(obj)和对象的destroy方法
 * @method put
 */
proto.put = function (obj) {
    if (!obj || obj.__gdk_inPool__) return;
    if (!cc.isValid(obj, true)) return;
    var pool = this._pool;
    if (this.onPut) this.onPut(obj);
    if (obj.unuse) obj.unuse.call(obj);
    if (pool.length < this._size) {
        obj.__gdk_inPool__ = true;
        obj.__gdk_inPoolTime__ = Date.now();
        pool.push(obj);
        if (pool.length === 1) {
            let clearTime = this.clearTime;
            if (clearTime > 0) {
                const Timer = require("./gdk_Timer");
                Timer.loop(clearTime / 2 * 1000, this, this.clearInactivity);
            }
        }
    } else {
        _destroyObj(this, obj);
    }
};

/**
 * 不定期清除
 */
proto.unClear = function () {
    this.clearTime = -1;
};

/**
 * 立即清理所有对象
 * @method Clear 
 */
proto.clearAll = function () {
    const Timer = require("./gdk_Timer");
    Timer.clear(this, this.clearInactivity);
    var pool = this._pool;
    var n = pool.length;
    if (n == 0) return;
    var arr = pool.splice(0, n);
    for (var i = 0; i < n; i++) {
        _destroyObj(this, arr[i]);
    }
};

/**
 * 立即清理不活跃的对象
 * @method Clear 
 */
proto.clearInactivity = function () {
    var pool = this._pool;
    var now = Date.now();
    var expire = this.clearTime * 1000;
    for (var i = 0, n = pool.length; i < n; i++) {
        var obj = pool[i];
        if (now - obj.__gdk_inPoolTime__ < expire) {
            break;
        }
    }
    if (i == 0) return;
    var arr = pool.splice(0, i);
    for (var i = 0, n = arr.length; i < n; i++) {
        _destroyObj(this, arr[i]);
    }
    if (pool.length == 0) {
        const Timer = require("./gdk_Timer");
        Timer.clear(this, this.clearInactivity);
    }
};

/**
 * 对象池容量。 
 * @prop {number} size
 */
Object.defineProperty(proto, "size", {
    set(value) {
        if (value < 0) value = 0;
        this._size = value;
        if (this._pool.length > value) {
            var arr = this._pool.splice(value);
            for (var i = 0, n = arr.length; i < n; i++) {
                _destroyObj(this, arr[i])
            }
        }
    },
    get() {
        return this._size;
    },
    enumerable: true,
    configurable: true
});

/**
 * 对象池当前数量
 * @prop {number} count
 */
Object.defineProperty(proto, "count", {
    get: function () {
        return this._pool.length;
    },
    enumerable: true,
    configurable: true
});

/**
 * 对象多长时间后会被清理，默认为2分钟， 单位：秒
 * @prop {number} clearTime
 */
Object.defineProperty(proto, "clearTime", {
    get() {
        if (this._clearTime === null) {
            return Pool.clearTime;
        }
        return this._clearTime;
    },
    set(value) {
        value = value < 0 ? 0 : value;
        if (this._clearTime == value) return;
        this._clearTime = value;
        if (this._pool.length > 0) {
            const Timer = require("./gdk_Timer");
            if (value < 1) {
                // 不回收，清除定时回调
                Timer.clear(this, this.clearInactivity);
            } else {
                Timer.loop(value / 2 * 1000, this, this.clearInactivity);
            }
        }
    },
    enumerable: true,
    configurable: true
});

// 默认清除间隔
Pool.clearTime = 60 * 2;

module.exports = Pool;