/**
 * 资源回收优化
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-17 11:14:23
 */
if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {

    const gdk = require('../gdk');
    const ResourceManager = require("../managers/gdk_ResourceManager");
    const PanelManager = require("../managers/gdk_PanelManager");
    const releaseFunc = cc.assetManager._releaseManager._free.bind(cc.assetManager._releaseManager);
    const dependMap = cc.assetManager.dependUtil._depends._map;

    // 依赖分析
    function parseDepends (deps, len, depends, gdkdeps) {
        for (let i = 0; i < len; i++) {
            const e = deps[i];

            if (gdkdeps[e]) continue;
            if (depends[e]) continue;
            depends[e] = true;

            let r = dependMap[e];
            if (r) {
                let a = r.deps;
                let n = a.length;
                if (n > 0) {
                    parseDepends(a, n, depends, gdkdeps);
                }
            }
        }
    };

    // 获得资源信息
    function getAssetPath (uuid) {
        let bundles = cc.assetManager.bundles;
        for (let e in bundles._map) {
            let config = bundles._map[e]._config;
            let info = config.assetInfos._map[uuid];
            if (info) {
                return config.base + info.path;
            }
        }
        return null;
    };

    // 回收管理器
    var ReleaseManager = function () {
        this._excludeKeys = Object.create(null);
        this._releasedKeys = Object.create(null);
        this._intervalID = -1;
        // 微信小游戏监听内存警告
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            const wx = window['wx'];
            wx.onMemoryWarning(() => {
                cc.warn('onMemoryWarningReceive');
                // 设置所有资源超时
                for (var e in this._releasedKeys) {
                    this._releasedKeys[e] = 1;
                }
                this.stop();
                this.start(1000 / 30);
            });
        }
    };
    var __proto = ReleaseManager.prototype;

    __proto.add = function (uuid) {
        var exsit = !!this._releasedKeys[uuid];
        this._releasedKeys[uuid] = (cc.sys.platform === cc.sys.WECHAT_GAME) ? Date.now() : 1;
        // 回收处理
        if (!exsit) {
            let size = 0;
            for (let _ in this._releasedKeys) {
                size++;
                if (size > 1) {
                    break;
                }
            }
            if (size == 1) {
                // 默认处理
                this.start();
            }
        }
    };

    __proto.remove = function (uuid) {
        if (this._releasedKeys[uuid]) {
            delete this._releasedKeys[uuid];
            // 移除回收计时器
            let size = 0;
            for (let _ in this._releasedKeys) {
                size++;
                break;
            }
            if (size == 0) {
                this.stop();
            }
        }
    };

    // 开启回收
    __proto.start = function (t) {
        if (this._intervalID !== -1) {
            return;
        }
        this._intervalID = setInterval(
            this.release_timer.bind(this),
            (t === void 0) ? gdk.macro.RESOURCE_RELEASE_INTERVAL : t,
        );
    };
    // 停止回收
    __proto.stop = function () {
        if (this._intervalID === -1) {
            return;
        }
        clearInterval(this._intervalID);
        this._intervalID = -1;
    };

    // 资源回收定时器处理函数
    __proto.release_timer = function () {
        let size = 0;
        for (let _ in this._releasedKeys) {
            size++;
            break;
        }
        // no resources need to release
        if (size == 0) {
            this.stop();
            return;
        }
        // 有必要的资源正在加载时，延迟回收处理操作
        if (ResourceManager.isLoading) return;
        if (PanelManager.hasOpening) return;

        const startTime = (CC_DEBUG && CC_TEST) ? Date.now() : 0;
        CC_DEBUG && CC_TEST && cc.log(`开始回收资源, ${this.info}`);

        const assets = cc.assetManager.assets;
        const gdkdeps = ResourceManager._loader.getGdkReleaseMap();
        const excludes = this._excludeKeys;
        const releasedKeys = this._releasedKeys;
        const released = Object.create(null);
        const now = Date.now();
        const timeout = gdk.macro.RESOURCE_RELEASE_TIMEOUT;

        // check released assets
        let array = Object.keys(releasedKeys);
        let norelease = true;
        for (let i = 0, n = array.length; i < n; i++) {
            const e = array[i];
            if (gdkdeps[e] || excludes[e]) { //depends[e] ||
                delete released[e];
                delete releasedKeys[e];
                continue;
            }
            if (now - releasedKeys[e] < timeout) {
                // 没有达到回收时间限制
                continue;
            }
            norelease = false;
            released[e] = true;
            let r = dependMap[e];
            if (r) {
                let a = r.deps;
                let n = a.length;
                if (n > 0) {
                    parseDepends(a, n, released, gdkdeps);
                }
            }
        }

        // no resources need to release
        if (norelease) {
            return;
        }

        // define consts
        const excludeSets = ResourceManager._excludeRelease;
        const depends = Object.create(null);

        // check loaded cache
        array = Object.keys(assets._map);
        for (let i = 0, n = array.length; i < n; i++) {
            const e = array[i];
            if (gdkdeps[e] || depends[e] || excludes[e]) {
                delete released[e];
                delete releasedKeys[e];
                continue;
            }
            if (released[e]) {
                let skip = true;
                if (excludeSets) {
                    const d = getAssetPath(e);
                    if (d && excludeSets.some(p => d.startsWith(p))) {
                        skip = false;
                        excludes[e] = true;
                        delete released[e];
                        delete releasedKeys[e];
                    }
                }
                if (skip) continue;
            }
            depends[e] = true;
            // 依赖资源
            let r = dependMap[e];
            if (r && r.deps) {
                for (let j = r.deps.length - 1; j >= 0; j--) {
                    const e2 = r.deps[j];
                    depends[e2] = true;
                }
            }
        }

        // execute realse method
        let count = assets.count;
        let max = gdk.macro.RESOURCE_RELEASE_MAX;
        array = Object.keys(released);
        for (let i = 0, n = array.length; i < n; i++) {
            const e = array[i];
            delete released[e];
            delete releasedKeys[e];
            if (gdkdeps[e] || depends[e] || excludes[e]) {
                continue;
            }
            const asset = assets._map[e];
            if (asset) {
                releaseFunc(asset);
                // 限制每次回收的最大数量
                if (count - assets.count > max) {
                    break;
                }
            }
        }

        CC_DEBUG && CC_TEST && cc.log(`结束回收资源, 耗时: ${Date.now() - startTime}(ms), 本次回收资源数：${count - assets.count}, ${this.info}`);
    };

    // 调试信息打印
    CC_DEBUG && Object.defineProperty(__proto, "info", {
        get() {
            let c = cc.assetManager.assets.count;
            let s = Object.keys(this._releasedKeys).length;
            return `缓存的资源总数: ${c}, 待回收资源数: ${s}`;
        }
    });

    // 针对assetManager的优化
    var proto = cc.assetManager._releaseManager;
    var manager = new ReleaseManager(proto);

    // hook资源回收接口
    proto.$ReleaseManager0_tryRelease = proto.tryRelease;
    proto.tryRelease = function (asset, force) {
        if (!(asset instanceof cc.Asset)) return;
        manager.add(asset._uuid);
    };

    // hook资源加载接口
    proto = cc.assetManager;
    proto.$AssetManager0_removeFromRelease = function (requests, options) {
        let output = this._transform(requests, options);
        if (output instanceof Array) {
            for (let i = 0, n = output.length; i < n; i++) {
                manager.remove(this.utils.getUuidFromURL(output[i]));
            }
        } else if (output) {
            manager.remove(this.utils.getUuidFromURL(output));
        }
    };

    // loadAny接口中使用到的一些函数和类
    const Task = cc.AssetManager.Task;
    const parseParameters = function (options, onProgress, onComplete) {
        if (onComplete === undefined) {
            var isCallback = typeof options === 'function';
            if (onProgress) {
                onComplete = onProgress;
                if (!isCallback) {
                    onProgress = null;
                }
            } else if (onProgress === undefined && isCallback) {
                onComplete = options;
                options = null;
                onProgress = null;
            }
            if (onProgress !== undefined && isCallback) {
                onProgress = options;
                options = null;
            }
        }
        options = options || Object.create(null);
        return {
            options,
            onProgress,
            onComplete
        };
    };

    proto.$AssetManager0_loadAny = proto.loadAny;
    proto.loadAny = function (requests, options, onProgress, onComplete) {
        this.$AssetManager0_removeFromRelease(requests, options);
        // 以下代码为原始loadAny函数移除onComplete的asyncify，修复同一文件被重复加载多次的问题
        var {
            options,
            onProgress,
            onComplete,
        } = parseParameters(options, onProgress, onComplete);

        options.preset = options.preset || 'default';
        let task = new Task({
            input: requests,
            onProgress,
            onComplete: onComplete,
            options,
        });
        this.pipeline.async(task);
    };

    proto.$AssetManager0_preloadAny = proto.preloadAny;
    proto.preloadAny = function (requests, options, onProgress, onComplete) {
        this.$AssetManager0_removeFromRelease(requests, options);
        this.$AssetManager0_preloadAny(requests, options, onProgress, onComplete);
    };

    // 添加UUID至回收管理器
    proto.releaseUuid = function (uuid) {
        manager.add(uuid);
    };

    // 从回收管理器中移除
    proto.removeFromRelease = function (assets) {
        // 资源数组
        if (assets instanceof Array) {
            for (let i = 0, n = assets.length; i < n; i++) {
                manager.remove(assets[i]._uuid);
            }
            return;
        }
        // 单个资源
        if (assets instanceof cc.Asset) {
            manager.remove(assets._uuid);
            return;
        }
    };
}