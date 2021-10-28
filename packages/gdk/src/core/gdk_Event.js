const PoolManager = require("../managers/gdk_PoolManager");
const POOL_MAX = 999;
const POOL_CLEAR_TIME = 30;
const POOL_NAME = '__gdk_event__Event';
var pool = {

    initlized: false,
    get(c) {
        let v = PoolManager.get(POOL_NAME);
        if (!v) {
            v = new c();
        }
        return v;
    },

    put (v) {
        let k = POOL_NAME;
        if (!this.initlized) {
            PoolManager.setSize(k, POOL_MAX);
            PoolManager.setClearTime(k, POOL_CLEAR_TIME);
        }
        PoolManager.put(k, v);
    },

};

/**
 * @Description: 事件对象, 尽表Event.get()方法获得Event对象，而不应该使用new。
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-09-26 11:26:03
 */
function Event () {
    this.unuse();
};
var proto = Event.prototype;

/**
 * 丢进对像池时，自动调用释放资源。
 * @method unuse
 */
proto.unuse = function () {
    /**
     * 事件类型
     * @prop {string} type
     */
    this.type = null;
    /**
     * 事件数据
     * @prop {any} data
     */
    this.data = null;
    /**
     * 错误码或状态码
     * @prop {number} code
     */
    this.code = 0;
    this._canRelease = true;
};

/**
 * 释放事件对象回对象池
 * @method release
 * @param {booble} alwayRelease 如果为true，立即释放，如果为false且调用过event.canRelease(false)则不被释放， 默认值为true
 */
proto.release = function (alwayRelease = true) {
    if (alwayRelease || this._canRelease) {
        pool.put(this);
    }
};

/**
 * 事件是否可被对象池回收
 * @method canRelease
 */
proto.canRelease = function (value) {
    this._canRelease = value;
};

/**
 * 从对象池里获取一个Eevent
 * @method get 
 * @param {any} data 事件的数据event.data
 */
Event.get = function (type, data) {
    var event = pool.get(Event);
    event.type = type;
    event.data = data;
    return event;
};

module.exports = Event;