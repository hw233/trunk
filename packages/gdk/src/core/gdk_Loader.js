/**
 * 资源加载器，不直接实例化此类，请使用静态函数
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-22 10:36:32
 */
const Timer = require("./gdk_Timer");
const PoolManager = require("../managers/gdk_PoolManager");
const POOL_NAME = '__gdk_loader__Loader';

function Loader () {
    this.unuse();
    this._onProgress = this._onProgress.bind(this);
    this._onLoadFinished = this._onLoadFinished.bind(this);
};
var proto = Loader.prototype;

Object.defineProperty(proto, "loadedRes", {
    get() {
        return this._loadedRes;
    },
    enumerable: true,
    configurable: true
});

/**
 * Progress from a percent to another percent
 * @class
 * @extends cc.Class
 * @param {Array|String} resources
 * @param {function} [option] callback or trigger
 * @param {function|Object} [loadCallback]
 */
proto.load = function (resources, trigger, loadCallback, isPreload) {
    this._trigger = trigger;
    this._loadCallback = loadCallback;
    this._isPreload = !!isPreload;
    if (!(resources instanceof Array)) {
        resources = [resources];
    }
    var toLoadRes = [];
    var toLoadCount = 0;
    for (var i = 0; i < resources.length; i++) {
        var item = resources[i];
        if (item && item.resArray && item.resArray.length > 0) {
            toLoadRes.push(item);
            toLoadCount += 1;
        }
    }
    this._toLoadRes = toLoadRes;
    this._needloadCount = toLoadCount;
    this._loadedRes = [];
    this._loadRes();
    return this;
};

proto._loadRes = function () {
    while (this._toLoadRes.length > 0) {
        var item = this._toLoadRes.shift();
        if (item.resArray && item.resArray.length > 0) {
            var resArray = [];
            for (var i = item.resArray.length - 1; i >= 0; i--) {
                var m = item.resArray[i];
                if (m && m != '') {
                    if (item.type == 'uuid') {
                        resArray.push({
                            'uuid': m
                        });
                    } else if (item.type == 'scene') {
                        resArray.push({
                            'scene': m
                        });
                    } else {
                        resArray.push(m);
                    }
                }
            }
            if (resArray.length > 0) {
                cc.resources.load(resArray, item.type, this._onProgress, this._onLoadFinished);
                return;
            }
        }
    }
    // 下载队列为空，则直接回调完成函数
    this._onLoadFinished();
};

//过程
proto._onProgress = function (completedCount, totalCount, item) {
    if (!item) return;
    if (!this._trigger) return;
    // 以百分比形式更新进度
    var a = 100 / this._needloadCount;
    var p = a * this._loadedCount;
    if (totalCount > 0) {
        p += a * completedCount / totalCount;
    } else {
        p += a;
    }
    this._trigger(p, 100);
};

//下载完成
proto._onLoadFinished = function (err, loadedRes) {
    if (err) {
        cc.error("download file error: ", err);
    }
    if (loadedRes) {
        if (loadedRes instanceof cc.Asset) {
            this._loadedRes.push(loadedRes);
        } else if (loadedRes.length > 0) {
            this._loadedRes.push(...loadedRes);
        }
    }
    this._loadedCount++;
    if (this._toLoadRes.length == 0) {
        this._trigger && this._trigger(100, 100);
        this._loadCallback && Timer.callLater(this, this._loadCallback, [err, this._loadedRes]);
        this._recover();
        return;
    }
    this._loadRes();
};

//清理并放入对象池
proto.unuse = function () {
    this._trigger = null;
    this._loadCallback = null;
    this._isPreload = false;
    this._toLoadRes = null;
    this._loadedRes = null;
    this._loadedCount = 0;
    this._needLoadCount = 0;
};

proto._recover = function () {
    PoolManager.put(POOL_NAME, this);
};

// 加载资源
Loader.load = function (resources, trigger, loadCallback, isPreload) {
    var t = PoolManager.get(POOL_NAME);
    if (!t) {
        t = new Loader();
    }
    return t.load(resources, trigger, loadCallback, isPreload);
};
// 获取资源
Loader.getRes = function (url, type) {
    return cc.resources.get(url, type);
};
// 以uuid形式获取资源
Loader.getResBy = function (uuid) {
    let info = cc.resources.getAssetInfo(uuid);
    if (!info) return;
    return cc.resources.get(info.path, info.ctor);
};
// 加载单个资源
Loader.loadRes = function (url, type, cb) {
    let asset = cc.resources.get(url, type);
    if (asset) {
        cb && Timer.callLater(null, cb, [null, asset]);
        return;
    }
    cc.resources.load(url, type, null, cb);
};
// 加载单个uuid资源
Loader.loadResBy = function (uuid, cb) {
    let info = cc.resources.getAssetInfo(uuid);
    if (!info) return;
    this.loadRes(info.path, info.ctor, cb);
};

module.exports = Loader;