/**
 * @Description: 延时执行，统一管理setTimeout，比大量使用settimeou节约性能。
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-05-20 13:49:05
 */

var _callbacks = []; //回调对象列表
var _isOrderChanged = false; //时序是否已改变
var _time = 0;

// 获取列表中的回调对象
function _getCallBack (callback, thisArg) {
    for (var i = 0, n = _callbacks.length; i < n; i++) {
        var obj = _callbacks[i];
        if (obj.callback == callback && obj.thisArg == thisArg) {
            return obj;
        }
    }
    return null;
};

//按时间排序
function _sortCallBack (o1, o2) {
    if (o1.time < o2.time) return -1;
    return 1;
};

//缓存回调对象
var _callbackCaches = [];

function CallbackObj () {
    this.callback;
    this.time;
    this.thisArg;
    this.args;
};

//从缓存里获取回调对象,不想每次都创建
function _getCallbackCache (callback, thisArg, time, args) {
    var obj;
    var n = _callbackCaches.length;
    if (n == 0) {
        obj = new CallbackObj();
    } else {
        obj = _callbackCaches[n - 1];
        --_callbackCaches.length;
    }
    obj.callback = callback;
    obj.time = time;
    obj.thisArg = thisArg;
    obj.args = args;
    return obj;
};

//把执行完或取消了的回调对象放回缓存中
function _putCallbackCache (obj) {
    obj.callback = null;
    obj.time = null;
    obj.thisArg = null;
    obj.args = null;
    _callbackCaches.push(obj);
};

var DelayCall = {
    /**
     * 添加一个延时回调, 重复添加只会修改原来回调的时间和thisArg，不会再次添加
     * @method addCall
     * @param {function} callback 
     * @param {Object} thisArg 
     * @param {number} delay 单位： 秒， 若时间为0，下帧执行
     */
    addCall (callback, thisArg = null, delay = 0, args = null) {
        if (callback == null) return;
        var obj = _getCallBack(callback, thisArg);
        if (delay < 0) delay = 0;
        var t = _time + delay;
        if (obj == null) {
            obj = _getCallbackCache(callback, thisArg, t, args);
            if (_callbacks.length > 0) {
                var lastObj = _callbacks[_callbacks.length - 1];
                if (t < lastObj.time) {
                    _isOrderChanged = true;
                }
            }
            _callbacks.push(obj);
        } else {
            obj.thisArg = thisArg;
            obj.time = t;
            obj.args = args;
            _isOrderChanged = true;
        }
    },

    /**
     * 取消一个延时回调
     * @method cancel
     * @param {function} callback 
     */
    cancel (callback, thisArg) {
        if (callback == null) return;
        for (var i = 0, n = _callbacks.length; i < n; i++) {
            var obj = _callbacks[i];
            if (obj.callback == callback && obj.thisArg == thisArg) {
                _putCallbackCache(obj);
                _callbacks.splice(i, 1);
                break;
            }
        }
    },

    /**
     * 是否已加入延时调用
     * @method has
     * @param {function} callback 
     */
    has (callback, thisArg) {
        if (callback == null) return false;
        return _getCallBack(callback, thisArg) != null;
    },

    /**
     * 离下次执行，还剩多少时间， 单位：秒
     * @method getDelayTime
     * @param {function} callback 
     */
    getDelayTime (callback, thisArg) {
        if (callback == null) return 0;
        var obj = _getCallBack(callback, thisArg);
        if (obj != null) {
            return (new Date().getTime() - obj.time) / 1000;
        }
        return 0
    },

    update (dt) {
        _time = _time + dt;
        var n = _callbacks.length;
        if (n == 0) return;
        if (_isOrderChanged && n > 1) {
            _callbacks.sort(_sortCallBack);
        }
        let currentTime = 0;
        while (true) {
            var obj = _callbacks[0];
            if (obj && obj.time <= _time && (currentTime == 0 || obj.time <= currentTime)) {
                currentTime = obj.time; //一帧内只处理同一时间超时，回调，挫开并发
                _callbacks.shift();
                var callback = obj.callback;
                var thisArg = obj.thisArg;
                var args = obj.args;
                _putCallbackCache(obj);
                callback.apply(thisArg, args);
                // if (thisArs) {
                //     callback.call(thisArs, );
                // } else {
                //     callback();
                // }
            } else {
                break;
            }
        }
    },
};

if (!CC_EDITOR) {
    cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {
        cc.director.getScheduler().enableForTarget(DelayCall);
        cc.director.getScheduler().scheduleUpdate(DelayCall, cc.Scheduler.PRIORITY_SYSTEM, false);
    });
}

module.exports = DelayCall;