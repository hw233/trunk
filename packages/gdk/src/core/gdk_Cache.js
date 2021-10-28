var DelayCall = require("./gdk_DelayCall");
var Pool = require("./gdk_Pool");
var _cache = {};
var _cacheClearFun = {};
var _count = 0;

/**
 * @Description: 根据key来缓存单个对象，并在不活跃时自动清理.
 * 如果要缓存很多相同的对象，可以使用gdk_Pool
 * 静态类，不能实列化
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-04-19 21:14:37
 */
var Cache = {
    /**
     * 获取一个缓存对象，如果不存在返回空,
     * 如果对象有定义reuse方法，则调用
     * @method get
     * @param {string} key 
     * @returns {object}
     */
    get(key) {
        if (key == null || key == "") return null;
        var obj = _cache[key];
        if (obj) {
            DelayCall.cancel(_cacheClearFun[key], this);
            delete _cache[key];
            delete _cacheClearFun[key];
            _count--;
            if (obj.reuse) obj.reuse.call(obj);
            if (obj && obj.__gdk_inPool__) {
                obj.__gdk_inPool__ = false;
            }
        }
        return obj;
    },

    has (key) {
        if (key == null || key == "") return false;
        return _cache[key] != null;
    },

    /**
     * 缓存一个对象， 如果对象定义有unuse方法，则调用。
     * 不活跃时间到后自动清理，如果对象定义有destroy方法，则调用， 如果参数clearFun不为空，则调用.
     * 如果指定key的对象已缓被存， 则不会覆盖原有缓存，直接返回
     * @method put
     * @param {string} key 
     * @param {object} obj 
     * @param {*} clearTime 
     * @param {*} clearFun 
     */
    put (key, obj, clearTime = null, clearFun = null, thisArg = null) {
        if (key == null || key == "" || obj == null) return;
        if (clearTime instanceof Function) {
            clearTime = Pool.clearTime;
            clearFun = arguments[2];
            thisArg = arguments[3];
        }

        if (_cache[key] == null) {
            _cache[key] = obj;
            obj.__gdk_inPool__ = true;
            if (obj.unuse) obj.unuse.call(obj);
            _count++;
            if (isNaN(clearTime)) return;
            var clearCallBack = _cacheClearFun[key] = function () {
                _count--;
                delete _cache[key];
                delete _cacheClearFun[key];
                if (obj.destroy) obj.destroy.call(obj);
                if (clearFun) clearFun.call(thisArg, obj);
            };
            DelayCall.addCall(clearCallBack, this, clearTime);
        }
    },

    /**
     * 清理指定key的对象, 
     * 如果对象定义有destroy方法，则调用， 如果对象被缓存时， put参数clearFun不为空，则调用.
     * @method clear
     * @param {string} key 
     */
    clear (key) {
        if (key == null || key == "") return null;
        var obj = _cache[key];
        if (obj) {
            var clearCallBack = _cacheClearFun[key];
            DelayCall.cancel(clearCallBack, this);
            clearCallBack();
        }
    },

    /**
     * 清理所有缓存的对象,
     * 如果对象定义有destroy方法，则调用， 如果对象被缓存时， put参数clearFun不为空，则调用.
     * @method clearAll
     */
    clearAll () {
        var tempCache = _cache;
        var tempCacheClearFun = _cacheClearFun;
        _cache = {};
        _cacheClearFun = {};
        for (var key in tempCache) {
            var obj = tempCache[key];
            var clearCallBack = tempCacheClearFun[key];
            if (clearCallBack) {
                DelayCall.cancel(clearCallBack, this);
                clearCallBack();
            }
        }
    },

    get count() {
        return _count;
    },
}

module.exports = Cache;