/**
 * 资源管理器
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-02-04 16:54:52
 */

const PanelId = require("../enums/gdk_PanelId");
const ModuleLoader = require("../core/gdk_ModuleLoader");

// 资源管理器
const ResourceManager = {
    _loader: ModuleLoader,
    _lastLoadConfig: null,
    _loadingInBgEnabled: true, // 后台下载开关

    _excludeRelease: null, // 不回收的资源目录或文件（不需要带扩展名）

    /**
     * 加载模块对应的资源
     * @param {*} panelId 
     * @param {*} modules 
     * @param {*} param 
     * @param {*} pcb 
     * @param {*} cb 
     */
    loadResByModule (panelId, modules, param, pcb, cb) {
        (panelId === null) && (panelId = 0);
        if (cb === void 0) {
            cb = pcb;
            pcb = void 0;
        }
        this._loader.loadModules(panelId, modules, pcb, (err, modules) => {
            if (err) {
                CC_DEBUG && cc.error(err);
            } else {
                cb && cb(err, param);
            }
        });
    },

    /**
     * 加载界面对应的资源
     * @param {*} panelId 
     * @param {*} param 
     * @param {*} pcb 
     * @param {*} cb 
     */
    loadResByPanel (panelId, param, pcb, cb) {
        var modules = this.getModuleByPanelName(panelId);
        if (cb === void 0) {
            cb = pcb;
            pcb = void 0;
        }
        this.loadResByModule(panelId, modules, param, pcb, (err, param) => {
            if (err) {
                CC_DEBUG && cc.error(err);
            } else {
                param = param || {};
                param.panelName = panelId;
                cb && cb(err, param);
            }
        });
    },

    /**
     * 加载资源列表
     * @param {*} panelId 
     * @param {*} urls 
     * @param {*} pcb 
     * @param {*} cb 
     */
    loadResArray (panelId, urls, pcb, cb) {
        (panelId === null) && (panelId = 0);
        if (cb === void 0) {
            cb = pcb;
            pcb = void 0;
        }
        this._loader.loadResArray(panelId, urls, pcb, (err, loadedRes) => {
            if (err) {
                CC_DEBUG && cc.error(err);
            } else {
                cb && cb(err, loadedRes);
            }
        });
    },

    // 回收单个资源
    releaseRes (panelId, asset, type) {
        (panelId == null) && (panelId = 0);
        this._loader.releaseOneRes(panelId, asset, type);
    },

    // 回收界面所有依赖的资源
    releaseResByPanel (panelId) {
        (panelId === null) && (panelId = 0);
        this._loader.releaseRes(panelId);
    },

    // 回收所有资源
    releaseAll () {
        this._loader.releaseAll();
    },

    /**
     * 按模块添加至后台加载
     * @param {Array<string>} modules 
     * @param {any} panelId 如果指定了panel，则资源在加载完成后不会立即销毁，而是在panel销毁时才会被销毁
     */
    addModuleInBackground (modules, panelId) {
        if (!modules || modules.length < 1) return;
        if (!this._loadingInBgEnabled) return;
        if (panelId) {
            this.loadResByModule(panelId, modules);
        } else {
            this._loader.addLowPriorityModules(modules);
        }
    },

    /**
     * 按界面添加至后台加载
     * @param {number} panelId 
     * @param {boolean} autoRelease 
     */
    addPanelInBackground (panelId, autoRelease) {
        var modules = this.getModuleByPanelName(panelId);
        this.addModuleInBackground(modules, autoRelease ? null : panelId);
    },

    /**
     * 添加资源列表至后台加载
     * @param {Array<string>} resArray 
     * @param {any} type 
     * @param {number} panelId
     */
    addResInBackground (resArray, type, panelId) {
        if (!resArray || resArray.length < 1) return;
        this._loader.addLowPriorityResources(resArray, type, panelId);
    },

    /**
     * 获取模块名
     * @param {*} panelId 
     */
    getModuleByPanelName (panelId) {
        var modules;
        var info = PanelId.getValue(panelId);
        if (!info || !info.module) {
            modules = [];
        } else {
            modules = (info.module instanceof Array) ? info.module : [info.module];
        }
        // 添加预制体资源
        if (info && info.prefab) {
            let b = true;
            for (let i = modules.length - 1; i >= 0; i--) {
                let e = modules[i];
                if (e &&
                    e.prefabs &&
                    e.prefabs.resArray &&
                    e.prefabs.resArray.indexOf(info.prefab) >= 0) {
                    // 已经存在相同的资源
                    b = false;
                    break;
                }
            }
            if (b) {
                modules.push({
                    prefabs: {
                        type: cc.Prefab,
                        resArray: [info.prefab],
                    },
                });
            }
        }
        return modules;
    },

    // 获取资源
    getResByUrl (url, type, panelId) {
        if (panelId !== void 0) {
            // 获取并添加至panelId资源列表
            (panelId == null) && (panelId = 0);
            let res = this._loader.getRes(url, type);
            if (res) {
                this._loader.addResTo(panelId, res);
            }
            return res;
        }
        return this._loader.getRes(url, type);
    },

    // 资源加载
    loadRes (panelId, url, type, cb, ecb, isuuid) {
        (panelId == null) && (panelId = 0);
        // 没有回调，如果资源已经存在，则只是把资源注册至对应的panelId下
        if (cb === void 0 && ecb === void 0) {
            let res = this._loader.getRes(url, type, isuuid);
            if (res) {
                this._loader.addResTo(panelId, res);
                return;
            }
        }
        // 加载资源
        this._loader.loadRes(panelId, url, type, (err, prefab) => {
            if (err) {
                CC_DEBUG && cc.error(err);
                ecb && ecb(err);
            } else {
                cb && cb(prefab);
            }
        }, isuuid);
    },

    // 资源加载
    loadResBy (panelId, uuid, type, cb, ecb) {
        this.loadRes(panelId, uuid, type, cb, ecb, true);
    },

    // 获得资源Url对应的info，如果不存在此资源则返回null
    getInfoWithPath (url, type) {
        return cc.resources.getInfoWithPath(url, type);
    },

    // 添加非回收资源至排除列表中
    addUnreleaseRes (url) {
        if (!this._excludeRelease) {
            this._excludeRelease = [url];
            return;
        }
        this._excludeRelease.push(url);
    },
};

// 当前加载状态
Object.defineProperty(ResourceManager, "isLoading", {
    get() {
        return this._loader && this._loader.isLoading;
    },
    enumerable: true,
    configurable: true,
});

module.exports = ResourceManager;