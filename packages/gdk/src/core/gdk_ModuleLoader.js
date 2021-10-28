/**
 * 模块加载器
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-08 10:25:01
 */
var Timer = require("../core/gdk_Timer");
var DelayCall = require("../core/gdk_DelayCall");
var Loader = require("../core/gdk_Loader");
var ResourceId = require("../enums/gdk_ResourceId");

// 资源数组
function getModuleRes (res) {
    var arr = [];
    for (var k in res) {
        var item = res[k];
        if (item && item.resArray && item.resArray.length > 0) {
            arr.push(item);
        }
    }
    return arr;
};

// 依赖分析
function parseDepends (uuid, parsed) {
    var arr = cc.assetManager.dependUtil.getDepsRecursively(uuid);
    for (var i = 0, n = arr.length; i < n; i++) {
        var uuid = arr[i];
        if (!parsed[uuid]) {
            parsed[uuid] = true;
            parseDepends(uuid, parsed);
        }
    }
};

// 获得资源的依赖列表
function getDependsRecursively (res, parsed) {
    (parsed === void 0) && (parsed = {});
    parsed[res._uuid] = true;
    parseDepends(res._uuid, parsed);
    return parsed;
};

// 获取资源及依赖于此资源的所有资源列表
function getReleaseMapByList (releaseRes, releaseMap) {
    (releaseMap === void 0) && (releaseMap = Object.create(null));
    if (releaseRes) {
        for (var i = 0, len = releaseRes.length; i < len; i++) {
            getDependsRecursively(releaseRes[i], releaseMap);
        }
    }
    return releaseMap;
};

// gdk组件依赖的资源列表
var _gdkReleaseMap = null;

// 忽略的加载错误状态
var _ignoreErrorStatus = {
    403: true, // 拒绝访问
    404: true, // 找不到指定的资源
    undefined: true,
};

// 模块加载器
var ModuleLoader = {
    _resLoader: Loader,

    _loading: 0, // 正在加载的队列数
    _loadMap: {},
    _loadingCallbacksMap: {}, // 单文件加载加高索引

    _preloading: false, // 是否正在预加载
    _preloadList: [], // 预加载列表（等待）
    _preloadedMap: {}, // 已经预加载的模块标识字典

    /**
     * 加载模块
     * @param {String|Number|any} panelId 
     * @param {Array|String} modules 模块名或模块资源提供者
     * @param {Function} pcb 百分比进度回调函数
     * @param {Function} cb 下载完成回调函数
     */
    loadModules (panelId, modules, pcb, cb) {
        if (!(modules instanceof Array)) {
            modules = [modules];
        }
        this.removeLowPriorityModules(modules, true);
        // 加载处理
        if (modules && modules.length > 0) {
            var toLoad = this._getResources(modules);
            if (toLoad && toLoad.length > 0) {
                this._load(panelId, toLoad, pcb, cb);
                return;
            }
        }
        // 不需要加载资源
        pcb && pcb(100);
        cb && cb();
    },

    /**
     * 加载多个资源
     * @param {String|Number|any} panelId 
     * @param {Array<string>} urls 
     * @param {Function} pcb 
     * @param {Function} cb 
     */
    loadResArray (panelId, urls, pcb, cb) {
        if (!(urls instanceof Array)) {
            urls = [urls];
        }
        // 加载处理
        if (urls && urls.length > 0) {
            this._load(panelId, urls, pcb, cb);
            return;
        }
        // 不需要加载资源
        pcb && pcb(100);
        cb && cb();
    },

    /**
     * 加载资源列表
     * @param {*} panelId 
     * @param {*} toLoad 
     * @param {*} pcb 
     * @param {*} cb 
     * @param {*} delay 不允许外部传递此参数，只在重试时使用
     */
    _load (panelId, toLoad, pcb, cb, delay = 0) {
        if (delay > 3) {
            delay = 3;
        }
        if (!this._loadMap[panelId]) {
            this._loadMap[panelId] = [];
        }
        this._loading++;
        this._resLoader.load(toLoad, pcb, (err, loadedRes) => {
            if (err && !_ignoreErrorStatus[err.status] && !!this._loadMap[panelId]) {
                // 加载错误，并且当前有界面依赖此资源，则输出错误信息并重试
                CC_DEBUG && console.error(err);
                // 重试加载
                DelayCall.addCall(() => {
                    this._loading--;
                    this._load(panelId, toLoad, pcb, cb, delay + 0.05);
                }, null, delay);
                return;
            }
            this._loadResArrayComplete(err, loadedRes, panelId, cb);
        }, false);
    },

    // 资源组加载完成回调
    _loadResArrayComplete (err, loadedRes, panelId, cb) {
        // 非当前界面所依赖资源，则添加至预加载资源列表中等待被回收
        if (loadedRes && loadedRes.length > 0) {
            if (this._loadMap[panelId]) {
                // 添加至panelId资源列表
                for (let i = 0, n = loadedRes.length; i < n; i++) {
                    this.addResTo(panelId, loadedRes[i]);
                }
            } else {
                // 预加载资源则直接添加至回收
                for (let i = 0, n = loadedRes.length; i < n; i++) {
                    this.removeResFrom(loadedRes[i]);
                }
            }
        }
        // 加上try catch 防止在执行回调时遇上异常，而阻断后续的资源回收
        try {
            cb && cb(err, loadedRes);
        } catch (error) {
            CC_DEBUG && console.error(error);
            CC_DEBUG && console.trace();
        }
        // 已经加载完成，继续后台加载
        this._loading--;
        this._loading == 0 && Timer.callLater(this, this._loadNextLowerModule);
    },

    /**
     * 加载单个资源
     * @param {*} panelId 
     * @param {*} url 
     * @param {*} type 
     * @param {*} cb 
     * @param {*} isuuid 以UUID形式加载单个资源
     * @param {*} delay 不允许外部传递此参数，只在重试时使用
     */
    loadRes (panelId, url, type, cb, isuuid, delay = 0) {
        if (delay > 3) {
            delay = 3;
        }
        if (!this._loadMap[panelId]) {
            this._loadMap[panelId] = [];
        }
        // 初始化加载状态
        var map = this._loadingCallbacksMap[panelId];
        if (!map) {
            map = this._loadingCallbacksMap[panelId] = {};
        }
        var queue = map[url]; // 回调队列
        var loading = !!queue;
        if (!loading) {
            queue = map[url] = [];
        }
        // 有回调则压入队列中
        if (cb) {
            queue.push(cb);
        }
        // 开启没有开始的加载
        if (!loading || delay > 0) {
            this._loading++;
            let callback = (err, res) => {
                if (err && !_ignoreErrorStatus[err.status] && type !== cc.AudioClip) {
                    // 加载错误，输出错误信息并重试
                    CC_DEBUG && console.error(err);
                    let map = this._loadingCallbacksMap[panelId];
                    if (map && map[url]) {
                        // 当前有界面依赖此资源，重试加载
                        DelayCall.addCall(() => {
                            this._loading--;
                            let map = this._loadingCallbacksMap[panelId];
                            if (map && map[url]) {
                                this.loadRes(panelId, url, type, null, isuuid, delay + 0.25);
                            }
                        }, null, delay);
                        return;
                    }
                }
                this._loadResComplete(err, res, panelId, url, type);
            };
            // 不同的加载方式
            if (isuuid) {
                this._resLoader.loadResBy(url, callback);
            } else {
                this._resLoader.loadRes(url, type, callback);
            }
        }
    },

    // 单个资源加载完成回调
    _loadResComplete (err, res, panelId, url, type) {
        let map = this._loadingCallbacksMap[panelId];
        let queue = map ? map[url] : null;
        // 非当前界面所依赖资源，则添加至预加载资源列表中等待被回收
        if (!err && res) {
            if (queue) {
                // 添加至panelId的资源列表中
                this.addResTo(panelId, res);
            } else {
                // 预加载资源，添加至回收
                this.removeResFrom(res);
            }
        }
        // 如果已经没有界面依赖此资源，则不执行回调队列
        if (queue) {
            delete map[url];
            for (let i = 0, n = queue.length; i < n; i++) {
                let cb = queue[i];
                // 加上try catch 防止在执行回调时遇上异常，而阻断后续的资源回收
                try {
                    cb && cb(err, res);
                } catch (error) {
                    CC_DEBUG && console.error(error);
                    CC_DEBUG && console.trace();
                }
            }
            if (Object.keys(map).length == 0) {
                delete this._loadingCallbacksMap[panelId];
            }
        }
        // 已经加载完成，继续后台加载
        this._loading--;
        this._loading == 0 && Timer.callLater(this, this._loadNextLowerModule);
    },

    // 把资源添加至panelId资源列表中
    addResTo (panelId, res) {
        if (res instanceof cc.SceneAsset) {
            this.removeResFrom(res, panelId);
            return;
        }
        let arr = this._loadMap[panelId];
        if (!arr) {
            res.addRef();
            this._loadMap[panelId] = [res];
        } else {
            let index = arr.indexOf(res);
            if (index === -1) {
                res.addRef();
                arr.push(res);
            }
        }
        cc.assetManager.removeFromRelease(res);
    },

    // 把资源从panelId资源列表中移除
    removeResFrom (res, panelId) {
        let arr = this._loadMap[panelId];
        if (arr) {
            let index = arr.indexOf(res);
            if (index !== -1) {
                res.decRef();
                arr.splice(index, 1);
            }
        }
        let ids = getDependsRecursively(res, {});
        for (let uuid in ids) {
            cc.assetManager.releaseUuid(uuid);
        }
    },

    // 添加模块资源至后台加载
    addLowPriorityModules (modules) {
        if (!modules || modules.length < 1) return;
        for (var i = 0, len = modules.length; i < len; i++) {
            var m = modules[i];
            if (this._preloadedMap[m]) continue; // 已经预加载过的模块，不再处理预加载操作
            if (m && this._preloadList.indexOf(m) == -1) {
                this._preloadList.push(m);
            }
        }
        this._loading == 0 && Timer.callLater(this, this._loadNextLowerModule);
    },

    // 从后台加载中移除模块资源
    removeLowPriorityModules (modules, flag) {
        if (!modules || modules.length < 1) return;
        (flag === void 0) && (flag = false);
        for (var i = 0, len = modules.length; i < len; i++) {
            var m = modules[i];
            var idx = this._preloadList.indexOf(m);
            if (idx != -1) {
                this._preloadList.splice(idx, 1);
                flag && (this._preloadedMap[m] = true);
            }
        }
    },

    // 添加模块资源至后台加载
    addLowPriorityResources (urls, type, panelId) {
        if (!urls || urls.length < 1) return;
        let module = {
            panelId: panelId,
        };
        module[panelId || 'anymouse'] = {
            resArray: urls,
            type: type,
        };
        this._preloadList.push(module);
        this._loading == 0 && Timer.callLater(this, this._loadNextLowerModule);
    },

    // 回收资源
    releaseRes (panelId) {
        var releaseRes = this._loadMap[panelId];
        if (releaseRes) {
            for (let i = releaseRes.length - 1; i >= 0; i--) {
                this.removeResFrom(releaseRes[i], panelId);
            }
            delete this._loadMap[panelId];
            delete this._loadingCallbacksMap[panelId];
        }
        // 移除预加载列表中相关的项
        for (let i = this._preloadList.length - 1; i >= 0; i--) {
            let item = this._preloadList[i];
            if (!cc.js.isString(item) && item.panelId == panelId) {
                this._preloadList.splice(i, 1);
            }
        }
    },

    // 回收单个资源
    releaseOneRes (panelId, res, type) {
        if (typeof res === 'string') {
            let map = this._loadingCallbacksMap[panelId];
            if (map && map[res]) {
                // 删除正在下载的项
                delete map[res];
                if (Object.keys(map).length == 0) {
                    delete this._loadingCallbacksMap[panelId];
                }
            }
            res = this.getRes(res, type);
        }
        res && this.removeResFrom(res, panelId);
    },

    // 全部回收
    releaseAll () {
        for (let panelId in this._loadMap) {
            this.releaseRes(panelId);
        }
        this._loadMap = {};
        this._loadingCallbacksMap = {};
        this._preloadList.length = 0;
    },

    // 获取资源
    getRes (url, type, isuuid) {
        if (isuuid) {
            return this._resLoader.getResBy(url);
        }
        return this._resLoader.getRes(url, type);
    },

    // 获得模块的url列表
    _getResources (modules) {
        var toLoad = [];
        for (var i = 0, len = modules.length; i < len; i++) {
            var m = modules[i];
            if (!m) continue;
            if (cc.js.isString(m)) {
                m = ResourceId.getValue(m);
            }
            toLoad.push(...getModuleRes(m));
        }
        return toLoad;
    },

    // 执行下一个预加载
    _loadNextLowerModule () {
        if (this._loading > 0) return;
        if (this._preloading) return;
        if (this._preloadList.length < 1) return;
        if (require('../managers/gdk_PanelManager').hasOpening) return;
        var modu = this._preloadList.shift();
        var urls = this._getResources([modu]);
        if (cc.js.isString(modu)) {
            this._preloadedMap[modu] = true; // 记录模块预加载状态
        }
        this._preloading = true;
        this._resLoader.load(urls, null, (err, loadedRes) => {
            // 预加载一个模块完成
            if (loadedRes && loadedRes.length > 0) {
                // 不回收的资源，放至对应的模块
                let isDepend = false;
                if (!cc.js.isString(modu) && modu.panelId) {
                    isDepend = !!this._loadMap[modu.panelId];
                    if (isDepend) {
                        for (let i = 0, n = loadedRes.length; i < n; i++) {
                            this.addResTo(modu.panelId, loadedRes[i]);
                        }
                    }
                }
                if (!isDepend) {
                    // 预加载资源，直接添加至回收
                    for (let i = loadedRes.length - 1; i >= 0; i--) {
                        this.removeResFrom(loadedRes[i]);
                    }
                }
            }
            this._preloading = false;
            this._loading == 0 && Timer.callLater(this, this._loadNextLowerModule);
        }, true);
    },

    /**
     * gdk依赖资源
     */
    getGdkReleaseMap () {
        if (_gdkReleaseMap == null) {
            let GUIManager = require("../managers/gdk_GUIManager");
            let arr = [];
            GUIManager.waitingPrefab && arr.push(GUIManager.waitingPrefab);
            GUIManager.alertPrefab && arr.push(GUIManager.alertPrefab);
            GUIManager.toolTipPrefab && arr.push(GUIManager.toolTipPrefab);
            GUIManager.messageBgPrefab && arr.push(GUIManager.messageBgPrefab);
            GUIManager.messagePrefab && arr.push(GUIManager.messagePrefab);
            GUIManager.maskPrefab && arr.push(GUIManager.maskPrefab);
            _gdkReleaseMap = getReleaseMapByList(arr);
        }
        return _gdkReleaseMap;
    },

    /**
     * 获取所有已加载列表 {[uuid] : true} 映射表
     */
    getAllExcludeMap () {
        let excludes = Object.create(null);
        for (let panelId in this._loadMap) {
            let arr = this._loadMap[panelId];
            if (arr) {
                for (let i = 0, n = arr.length; i < n; i++) {
                    excludes[arr[i]._uuid] = true;
                }
            }
        }
        return excludes;
    },
};

// 是否正在加载必要的资源（非预加载）
Object.defineProperty(ModuleLoader, "isLoading", {
    get() {
        return this._preloading || this._loading > 0;
    },
    enumerable: true,
    configurable: true,
});

module.exports = ModuleLoader;