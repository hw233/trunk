const Tool = require("./gdk_Tool");
const PoolManager = require("../managers/gdk_PoolManager");
const POOL_NAME = '__gdk_timer__';

/**
 * @Description: 定时器管理类, 静态类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-14 10:15:22
 */

/**@private */
//class TimerHandler
var TimerHandler = cc.Class({

    name: 'TimerHandler',
    extends: null,

    properties: {
        key: 0,
        repeat: false,
        delay: 0,
        userFrame: false,
        exeTime: 0,
        caller: null,
        method: null,
        args: null,
        jumpFrame: false,
    },

    clear () {
        this.key = 0;
        this.caller = null;
        this.method = null;
        this.args = null;
    },

    run (withClear) {
        var caller = this.caller;
        if (caller && caller.destroyed) return this.clear();
        var method = this.method;
        var args = this.args;
        if (withClear) this.clear();
        if (method) {
            try {
                args ? method.apply(caller, args) : method.call(caller);
            } catch (e) {
                cc.error(e);
            }
        }
    },

    recover () {
        this.clear();
        PoolManager.put(POOL_NAME + "_TimerHandler", this);
    },

    statics: {
        _id: 1,
        get() {
            var t = PoolManager.get(POOL_NAME + "_TimerHandler");
            if (!t) {
                t = new TimerHandler();
            }
            t.key = TimerHandler._id++;
            return t;
        }
    }
});

/**@private */
//class LaterHandler
var LaterHandler = cc.Class({

    name: 'LaterHandler',
    extends: null,

    properties: {
        key: 0,
        caller: null,
        method: null,
        args: null,
    },

    clear () {
        this.key = 0;
        this.caller = null;
        this.method = null;
        this.args = null;
    },

    run (withClear) {
        var caller = this.caller;
        if (caller && caller.destroyed) return this.clear();
        var method = this.method;
        var args = this.args;
        if (withClear) this.clear();
        if (method) {
            try {
                args ? method.apply(caller, args) : method.call(caller);
            } catch (e) {
                cc.error(e);
            }
        }
    },

    recover () {
        this.clear();
        PoolManager.put(POOL_NAME + "_LaterHandler", this);
    },

    statics: {
        _id: 1,
        get() {
            var t = PoolManager.get(POOL_NAME + "_LaterHandler");
            if (!t) {
                t = new LaterHandler();
            }
            t.key = LaterHandler._id++;
            return t;
        }
    }
});

/**
 *@private
 */
var CallLater = cc.Class({

    name: 'CallLater',
    extends: null,

    properties: {
        _laters: [],
        _temp: [],
    },

    /**
     *@private
     *帧循环处理函数。
     */
    _update () {
        var laters = this._laters;
        var len = laters.length;
        if (len > 0) {
            this._laters = this._temp;
            this._temp = laters;
            for (var i = 0, n = len - 1; i <= n; i++) {
                var handler = laters[i];
                if (handler.method !== null) {
                    handler.run();
                }
                handler.recover();
                i === n && (n = laters.length - 1);
            }
            laters.length = 0;
        }
    },

    /**@private */
    _getHandler (caller, method) {
        var laters = this._laters;
        for (var i = 0, n = laters.length; i < n; i++) {
            var handler = laters[i];
            if (handler.caller == caller && handler.method == method) {
                return handler;
            }
        }
        return null;
    },

    /**
     *延迟执行。
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     *@param args 回调参数。
     */
    callLater (caller, method, args) {
        var handler = this._getHandler(caller, method);
        if (handler) {
            handler.args = args;
            return;
        }
        handler = LaterHandler.get();
        handler.caller = caller;
        handler.method = method;
        handler.args = args;
        this._laters.push(handler);
    },

    /**
     *立即执行 callLater 。
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     */
    runCallLater (caller, method) {
        var handler = this._getHandler(caller, method);
        if (handler && handler.method !== null) {
            handler.run(true);
        }
    },
});

CallLater.I = new CallLater();

/**
 *<code>Timer</code> 是时钟管理类。它是一个单例，不要手动实例化此类，应该通过 Laya.timer 访问。
 */
var Timer = cc.Class({

    name: 'Timer',
    extends: null,

    properties: {
        scale: 1.0,
        currFrame: null,
        _delta: null,
        _handlers: null,
        _temp: null,
        _count: 0,
        currTimer: 0,
        _lastTimer: 0
    },

    ctor () {
        /**时针缩放。*/
        this.scale = 1;
        /**当前的帧数。*/
        this.currFrame = 0;
        /**@private 两帧之间的时间间隔,单位毫秒。*/
        this._delta = 0;
        /**@private */
        this._handlers = [];
        /**@private */
        this._temp = [];
        /**@private */
        this._count = 0;
        this.currTimer = Date.now();
        this._lastTimer = Date.now();
    },

    /**
     *@private
     *帧循环处理函数。
     */
    update (dt) {
        if (this.scale <= 0) {
            this._lastTimer = Date.now();
            return;
        };

        var frame = this.currFrame = this.currFrame + this.scale;
        var now = Date.now();
        var delta = (now - this._lastTimer) * this.scale;
        var timer = this.currTimer = this.currTimer + delta;

        this._lastTimer = now;
        this._delta = delta;
        this._count = 0;

        var handlers = this._handlers;
        for (var i = 0, n = handlers.length; i < n; i++) {
            var handler = handlers[i];
            if (handler.method !== null) {
                var t = handler.userFrame ? frame : timer;
                if (t >= handler.exeTime) {
                    if (handler.repeat) {
                        if (!handler.jumpFrame) {
                            handler.exeTime += handler.delay;
                            handler.run(false);
                            if (t > handler.exeTime) {
                                handler.exeTime += Math.ceil((t - handler.exeTime) / handler.delay) * handler.delay;
                            }
                        } else {
                            while (t >= handler.exeTime) {
                                handler.exeTime += handler.delay;
                                handler.run(false);
                            }
                        }
                    } else {
                        handler.run(true);
                    }
                }
            } else {
                this._count++;
            }
        }

        CallLater.I._update();

        if (this._count > 30 || frame % 200 === 0) this._clearHandlers();
    },

    /**@private */
    _clearHandlers () {
        var handlers = this._handlers;
        for (var i = 0, n = handlers.length; i < n; i++) {
            var handler = handlers[i];
            if (handler.method !== null) {
                this._temp.push(handler);
            } else {
                handler.recover();
            }
        }
        handlers.length = 0;
        this._handlers = this._temp;
        this._temp = handlers;
    },

    /**@private */
    _create (useFrame, repeat, delay, caller, method, args, coverBefore) {
        // if (!delay) {
        //     method.apply(caller, args);
        //     return null;
        // }
        var handler;
        if (coverBefore) {
            handler = this._getHandler(caller, method);
            if (handler) {
                handler.repeat = repeat;
                handler.userFrame = useFrame;
                handler.delay = delay;
                handler.caller = caller;
                handler.method = method;
                handler.args = args;
                handler.exeTime = delay + (useFrame ? this.currFrame : this.currTimer + Date.now() - this._lastTimer);
                return handler;
            }
        }
        handler = TimerHandler.get();
        handler.repeat = repeat;
        handler.userFrame = useFrame;
        handler.delay = delay;
        handler.caller = caller;
        handler.method = method;
        handler.args = args;
        handler.exeTime = delay + (useFrame ? this.currFrame : this.currTimer + Date.now() - this._lastTimer);
        this._handlers.push(handler);
        return handler;
    },

    /**
     *定时执行一次。
     *@param delay 延迟时间(单位为毫秒)。
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     *@param args 回调参数。
     *@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
     */
    once (delay, caller, method, args, coverBefore) {
        (coverBefore === void 0) && (coverBefore = true);
        this._create(false, false, delay, caller, method, args, coverBefore);
    },

    /**
     *定时重复执行。
     *@param delay 间隔时间(单位毫秒)。
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     *@param args 回调参数。
     *@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
     *@param jumpFrame 时钟是否跳帧。基于时间的循环回调，单位时间间隔内，如能执行多次回调，出于性能考虑，引擎默认只执行一次，设置jumpFrame=true后，则回调会连续执行多次
     */
    loop (delay, caller, method, args, coverBefore, jumpFrame) {
        (coverBefore === void 0) && (coverBefore = true);
        (jumpFrame === void 0) && (jumpFrame = false);
        var handler = this._create(false, true, delay, caller, method, args, coverBefore);
        if (handler) handler.jumpFrame = jumpFrame;
    },

    /**
     *定时执行一次(基于帧率)。
     *@param delay 延迟几帧(单位为帧)。
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     *@param args 回调参数。
     *@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
     */
    frameOnce (delay, caller, method, args, coverBefore) {
        (coverBefore === void 0) && (coverBefore = true);
        this._create(true, false, delay, caller, method, args, coverBefore);
    },

    /**
     *定时重复执行(基于帧率)。
     *@param delay 间隔几帧(单位为帧)。
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     *@param args 回调参数。
     *@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
     */
    frameLoop (delay, caller, method, args, coverBefore) {
        (coverBefore === void 0) && (coverBefore = true);
        this._create(true, true, delay, caller, method, args, coverBefore);
    },

    /**返回统计信息。*/
    toString () {
        return " handlers:" + this._handlers.length;
    },

    /**
     *清理定时器。
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     */
    clear (caller, method) {
        var handlers = this._handlers;
        for (var i = 0, n = handlers.length; i < n; i++) {
            var handler = handlers[i];
            if (handler.caller == caller && handler.method == method) {
                handler.clear();
            }
        }
    },

    /**
     *清理对象身上的所有定时器。
     *@param caller 执行域(this)。
     */
    clearAll (caller) {
        if (!caller) return;
        var handlers = this._handlers;
        for (var i = 0, n = handlers.length; i < n; i++) {
            var handler = handlers[i];
            if (handler.caller === caller) {
                handler.clear();
            }
        }
    },

    /**@private */
    _getHandler (caller, method) {
        var handlers = this._handlers;
        for (var i = 0, n = handlers.length; i < n; i++) {
            var handler = handlers[i];
            if (handler.caller == caller && handler.method == method) {
                return handler;
            }
        }
        return null;
    },

    /**
     *延迟执行。
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     *@param args 回调参数。
     */
    callLater (caller, method, args) {
        CallLater.I.callLater(caller, method, args);
    },

    /**
     *立即执行 callLater 。
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     */
    runCallLater (caller, method) {
        CallLater.I.runCallLater(caller, method);
    },

    /**
     *立即提前执行定时器，执行之后从队列中删除
     *@param caller 执行域(this)。
     *@param method 定时器回调函数。
     */
    runTimer (caller, method) {
        var handler = this._getHandler(caller, method);
        if (handler) {
            handler.run(true);
        }
    },

    /**
     *暂停时钟
     */
    pause () {
        this.scale = 0;
    },

    /**
     *恢复时钟
     */
    resume () {
        this.scale = 1;
    },
});

// 单例
const systemTimer = Tool.getSingleton(Timer);
if (!CC_EDITOR) {
    cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {
        cc.director.getScheduler().enableForTarget(systemTimer);
        cc.director.getScheduler().scheduleUpdate(systemTimer, cc.Scheduler.PRIORITY_SYSTEM, false);
    });
}

module.exports = systemTimer;