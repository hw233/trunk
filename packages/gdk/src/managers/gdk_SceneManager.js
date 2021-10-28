/**
 * 场景管理器
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-07 20:46:19
 */
const GUIManager = require("./gdk_GUIManager");
const PanelManager = require("./gdk_PanelManager");
const ResouceManager = require("./gdk_ResourceManager");
const PoolManager = require("./gdk_PoolManager");
const Log = require("../Tools/gdk_Log");

var SceneManager = {
    loadingText: "正在加载场景...{2}%",
    loadingErrorText: "加载场景失败",
    destroyPopup: true,
    destroyView: true,

    load (scene, callback, thisArg = null) {
        if (scene) {
            if (this.getScene().name != scene.name) {
                // 清面板
                for (let name in GUIManager.layers) {
                    let layer = GUIManager.layers[name];
                    let arr = layer.children;
                    for (let i = arr.length - 1; i >= 0; i--) {
                        let node = arr[i];
                        if (!node.__gdk__persistNode__) {
                            node.destroy();
                        }
                    }
                }
                // 关闭正在打开的界面
                for (let key in PanelManager._openingDic) {
                    PanelManager.hide(key);
                }
                GUIManager._navViews.length = 0;
                PoolManager.clearAll();
                ResouceManager.releaseAll();
                // 只有存在加载界面时，才更新进度
                if (GUIManager.getCurrentLoading()) {
                    GUIManager.showLoading(this.loadingText, 0, 100);
                }
                let cacheLoaded = 0;
                ResouceManager.loadResByModule('Scene#' + scene.name, this._getSceneModules(scene), null,
                    (loaded, total) => {
                        // 资源加载进度更新
                        if (!GUIManager.getCurrentLoading()) return;
                        if ((loaded / total) < cacheLoaded) return;
                        cacheLoaded = loaded / total;
                        GUIManager.showLoading(this.loadingText, loaded, total);
                    },
                    (err) => {
                        if (err) {
                            GUIManager.showLoading(this.loadingErrorText);
                            Log.error("SceneManager.preload Error! ", err);
                        } else {
                            cc.director.loadScene(scene.name, (err, res) => {
                                if (err) {
                                    GUIManager.showLoading(this.loadingErrorText);
                                    Log.error("SceneManager.load Error! ", err);
                                }
                                // else {
                                //     GUIManager.hideLoading();
                                // }
                                if (callback) {
                                    callback.call(thisArg, err, res);
                                }
                            });
                        }
                    });
            } else {
                if (callback) {
                    callback.call(thisArg, null, this.getScene());
                }
            }
        } else {
            Log.error("SceneManager load Error,scene is null");
        }
    },

    preload (scene, autoRelease) {
        if (scene) {
            ResouceManager.addModuleInBackground(this._getSceneModules(scene), autoRelease ? null : 'Scene#' + scene.name);
        }
    },

    getScene () {
        return cc.director.getScene();
    },

    getSceneName () {
        var scene = this.getScene();
        return !!scene ? scene.name : null;
    },

    getCanvasNode: function () {
        var scene = this.getScene();
        var canvas = !!scene ? scene.getChildByName("Canvas") : null;
        return !!canvas ? canvas : null;
    },

    _getSceneModules (scene) {
        var modules = (scene.resArr instanceof Array) ? scene.resArr : [scene.resArr];
        modules.push({
            scenes: {
                type: 'scene',
                resArray: [scene.name],
            },
        });
        return modules;
    }
};

module.exports = SceneManager;