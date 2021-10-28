/**
 * 面板管理器
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-01 15:14:32
 */
const GUIManager = require("./gdk_GUIManager");
const Log = require("../Tools/gdk_Log");
const BasePanel = require("../ui/gdk_BasePanel");
const NodeTool = require("../Tools/gdk_NodeTool");
const PanelId = require("../enums/gdk_PanelId");
const ResourceManager = require("./gdk_ResourceManager");
const DelayCall = require("../core/gdk_DelayCall");
const Tool = require("../core/gdk_Tool");
const HideMode = require("../const/gdk_HideMode");

const PanelManager = {
    isShowWaiting: true,
    // onShow: EventTrigger.get(),
    // onHide: EventTrigger.get(),
    loadingString: "正在加载..",
    loadErrorMessage: "您的网络不稳定,请稍后再试.",
    loadWaitingDelay: 0.5,
    loadTimeout: 10,
    _openingDic: {},
    _panelArgsDic: {},
    _openOneByOnes: [],

    preload (panelId, autoRelease) {
        (autoRelease === void 0) && (autoRelease = true);
        let config = this.getConfig(panelId);
        if (config) {
            panelId = config.__id__ || panelId;
            ResourceManager.addPanelInBackground(panelId, autoRelease);
        } else {
            return Log.error(`PanelManager.preLoad Error:panelId= ${panelId} is not config`);
        }
    },
    openOneByOne (panelId, callback, thisArg, opt) {
        this._openOneByOnes.push({
            panelId,
            callback,
            thisArg,
            opt,
        });
        if (this._openOneByOnes.length == 1) {
            this._checkNextOpen();
        }
    },
    _checkNextOpen () {
        if (this._openOneByOnes.length > 0) {
            var obj = this._openOneByOnes[0];
            this.open(obj.panelId, (p) => {
                var node = p;
                if (p instanceof cc.Component) {
                    node = p.node;
                }
                NodeTool.onHide(node).once(() => {
                    this._openOneByOnes.shift();
                    this._checkNextOpen();
                }, this);
                if (obj.callBack) {
                    obj.callBack.call(obj.thisArg, p);
                }
            }, this, obj.opt);
        }
    },
    // 创建界面前置回调
    _prefabPrecallback (node, config) {
        let panelId = config.__id__;
        if (!cc.isValid(node)) {
            // 清除创建中标志
            delete this._openingDic[panelId];
            this._closeWaiting(config);
            return;
        }
        if (!this._openingDic[panelId]) {
            node.destroy();
            return;
        }
        node.config = config;
        node.__gdk_panelId__ = panelId;
        if (panelId) {
            let panel = node.getComponent(BasePanel);
            if (!panel) {
                panel = node.addComponent(BasePanel);
            }
            panel.resId = panelId;
        }
        return true;
    },
    // 创建界面后回调
    _prefabCallback (node, config, created) {
        let panelId = config.__id__;
        if (!cc.isValid(node)) {
            // 清除创建中标志
            delete this._openingDic[panelId];
            this._closeWaiting(config);
            return;
        }
        let callbacks = this._openingDic[panelId];
        if (!callbacks) {
            node.destroy();
            return;
        }
        // 执行创建完成回调
        created && created();
        // 清除创建中标志
        delete this._openingDic[panelId];
        this._closeWaiting(config);
        // 执行回调队列
        for (let i = 0, n = callbacks.length; i < n; i++) {
            let arr = callbacks[i];
            let panel = node;
            if (arr[2]) {
                panel = node.getComponent(arr[2]);
            }
            arr[0].call(arr[1], panel);
        }
        return true;
    },
    /**
     * 显示面板
     * @param {string|number|{}} id 
     * @param {Function} callback 
     * @param {any} thisArg 
     * @param {any?} opt
     */
    open (panelId, callback, thisArg, opt) {
        let config = this.getConfig(panelId);
        if (config) {
            panelId = config.__id__ || panelId;
            // 关闭其它正在打开的界面
            if (!config.isNoExclusive) {
                let arr = Object.keys(this._openingDic);
                for (let i = 0, n = arr.length; i < n; i++) {
                    const id = arr[i];
                    if (id == panelId) continue;
                    if (this.get(id)) continue;
                    let cfg = this.getConfig(id);
                    if (cfg && !cfg.isKeep && cfg.isPopup == config.isPopup) {
                        this._closeOpening(cfg.__id__);
                    }
                }
            }
            let path = config.prefab;
            let classType = opt && opt.classType ? opt.classType : null;
            // 不再重复打开
            if (this.isOpenOrOpening(panelId)) {
                if (this._openingDic[panelId]) {
                    // 当前正在打开中的面板
                    callback && this._openingDic[panelId].push([callback, thisArg, classType]);
                } else {
                    let panel = this.get(panelId);
                    if (classType) {
                        panel = panel.getComponent(panel);
                    }
                    callback && callback.call(thisArg, panel);
                }
                return;
            }
            this._openingDic[panelId] = callback ? [
                [callback, thisArg, classType]
            ] : [];
            // 额外设置参数
            let onTimeoutCallback = opt && opt.onTimeoutCallback ? opt.onTimeoutCallback : null;
            // 设置外部参数
            if (opt && opt.args) this.setArgs(panelId, opt.args);
            if (this.isShowWaiting && config.isShowWaiting !== false) {
                const tag = '__gdk_PanelManager__';
                GUIManager.hideWaiting(tag);
                GUIManager.showWaiting(
                    this.loadingString, tag,
                    config.isKeep ? 0 : this.loadTimeout,
                    () => {
                        this.hide(panelId);
                        GUIManager.showMessage(this.loadErrorMessage);
                        onTimeoutCallback && onTimeoutCallback.call(thisArg);
                    }, this,
                    this.loadWaitingDelay,
                );
            }
            // 加载界面资源
            ResourceManager.loadResByPanel(panelId, null, null, (err) => {
                if (!this._openingDic[panelId]) {
                    ResourceManager.releaseResByPanel(panelId);
                    return;
                }
                // open panel
                let prefab = ResourceManager.getResByUrl(path, cc.Prefab);
                if (prefab) {
                    // let node;
                    if (config.isPopup === true) {
                        if (opt && opt.parent) {
                            if (!cc.isValid(opt.parent) || !opt.parent.activeInHierarchy) {
                                // 指定了父节点，但父节点已经被销毁或者不在显示列表中
                                if (config.parent) {
                                    // 如果有残留的节点，则清除
                                    config.parent = null;
                                    delete config.parent;
                                }
                                // 清除创建中标志
                                delete this._openingDic[panelId];
                                this._closeWaiting(config);
                                return;
                            }
                            config.parent = opt.parent;
                        } else if (config.parent) {
                            // 如果有残留的节点，则清除
                            config.parent = null;
                            delete config.parent;
                        }
                        GUIManager.addPopup(
                            prefab,
                            config.isMask === true,
                            pop => {
                                // 创建弹窗完成前执行
                                if (!pop || !cc.isValid(pop.node)) {
                                    // 清除创建中标志
                                    delete this._openingDic[panelId];
                                    this._closeWaiting(config);
                                    return;
                                }
                                (config.isTouchMaskClose != null) && (pop.isTouchMaskClose = config.isTouchMaskClose);
                                (config.maskAlpha != null) && (pop.maskAlpha = config.maskAlpha);
                                (config.maskAlpha == null) && (pop.maskAlpha = 180);
                                (config.maskColor != null) && (pop.maskColor = config.maskColor);
                                (config.zIndex != null) && (pop.node.zIndex = config.zIndex);
                                (opt && opt.pos) && pop.node.setPosition(opt.pos);
                                this._prefabPrecallback(pop.node, config);
                            },
                            pop => this._prefabCallback(pop ? pop.node : null, config, () => {
                                // 创建完成弹窗后执行
                                if (!pop || !cc.isValid(pop.node)) {
                                    // 清除创建中标志
                                    delete this._openingDic[panelId];
                                    this._closeWaiting(config);
                                    return;
                                }
                                (config.isTouchMaskClose != null) && (pop.isTouchMaskClose = config.isTouchMaskClose);
                                (config.maskAlpha != null) && (pop.maskAlpha = config.maskAlpha);
                                (config.maskAlpha == null) && (pop.maskAlpha = 180);
                                (config.maskColor != null) && (pop.maskColor = config.maskColor);
                                (config.zIndex != null) && (pop.node.zIndex = config.zIndex);
                                (opt && opt.pos) && pop.node.setPosition(opt.pos);
                                // 隐藏view
                                if (config.isDisableView) {
                                    let view = GUIManager.getCurrentView();
                                    if (cc.isValid(view)) {
                                        view.active = false;
                                        NodeTool.onHide(pop.node).once(() => {
                                            DelayCall.addCall(this._onHidePopup, this, 0);
                                        });
                                    }
                                }
                            }),
                            config.parent,
                        );
                    } else {
                        GUIManager.showView(
                            prefab,
                            node => {
                                (config.zIndex != null) && (node.zIndex = config.zIndex);
                                (opt && opt.pos) && node.setPosition(opt.pos);
                                this._prefabPrecallback(node, config);
                            },
                            node => this._prefabCallback(node, config, () => {
                                // 创建完成视图后执行
                                if (!cc.isValid(node)) return;
                                (config.zIndex != null) && (node.zIndex = config.zIndex);
                                (opt && opt.pos) && node.setPosition(opt.pos);
                            }),
                        );
                    }
                } else {
                    GUIManager.showMessage(this.loadErrorMessage);
                    Log.errorEnable && Log.error(err);
                    // 清除创建中标志
                    delete this._openingDic[panelId];
                    this._closeWaiting(config);
                }
            });
        } else {
            return Log.error(`PanelManager.open Error:panelId= ${panelId} is not config`);
        }
    },
    get hasDisableView() {
        // 检查正在打开的窗口
        for (let key in this._openingDic) {
            let cfg = this.getConfig(key);
            if (cfg && cfg.isDisableView) {
                return true;
            }
        }
        // 检查已经打开的窗口
        let popups = GUIManager.getPopups();
        for (let i = 0, n = popups.length; i < n; i++) {
            let node = popups[i].node;
            if (cc.isValid(node) &&
                node.active &&
                node.config &&
                node.config.isDisableView
            ) {
                return true;
            }
        }
        return false;
    },
    _onHidePopup () {
        if (this.hasDisableView) return;
        let current = GUIManager.getCurrentView();
        if (current) {
            NodeTool.show(current, true, () => {
                GUIManager._onViewChanged(current, null);
            });
            NodeTool.onHide(current).once(GUIManager._onHideView, GUIManager);
        }
    },
    /**
     * 关闭正在显示的面板
     * @param {*} panelId 
     */
    _closeOpening (panelId) {
        let config = this.getConfig(panelId);
        if (config) {
            panelId = config.__id__ || panelId;
            if (this._openingDic[panelId]) {
                ResourceManager.releaseResByPanel(panelId);
                delete this._openingDic[panelId];
                this._closeWaiting(config, panelId);
            }
        }
    },
    /**
     * 如果没有其他正在等待加载的界面则关闭加载等待菊花
     * @param {*} config 
     * @param {*} panelId 忽略的项
     */
    _closeWaiting (config, panelId) {
        let isShowWaiting = this.isShowWaiting && config.isShowWaiting !== false;
        if (isShowWaiting) {
            let has = true;
            for (let key in this._openingDic) {
                if (key == panelId) continue;
                let cfg = this.getConfig(key);
                if (cfg && cfg.isShowWaiting !== false) {
                    has = false;
                    break;
                }
            }
            has && GUIManager.hideWaiting("__gdk_PanelManager__");
        }
    },
    getConfig (panelId) {
        let config = null;
        if (typeof panelId == "object" && panelId.prefab) {
            config = panelId;
        } else {
            config = PanelId.getValue(panelId);
        }
        return config;
    },
    get hasOpening() {
        for (let _ in this._openingDic) {
            return true;
        }
        return false;
    },
    isOpening (panelId) {
        let node = this.get(panelId);
        if (node && NodeTool.isShow(node)) {
            // 已经打开
            return false;
        } else {
            // 是否正在打开
            let config = this.getConfig(panelId);
            if (config) {
                panelId = config.__id__ || panelId;
                return !!this._openingDic[panelId];
            }
        }
        return false;
    },
    isOpenOrOpening (panelId) {
        let node = this.get(panelId);
        if (node && NodeTool.isShow(node)) {
            // 已经打开
            return true;
        } else {
            // 是否正在打开
            let config = this.getConfig(panelId);
            if (config) {
                panelId = config.__id__ || panelId;
                return !!this._openingDic[panelId];
            }
        }
        return false;
    },
    get(panelId) {
        let config = this.getConfig(panelId);
        if (config) {
            panelId = config.__id__ || panelId;
            if (config.isPopup == null || config.isPopup) {
                let parent = cc.isValid(config.parent) ? config.parent : GUIManager.layers.popupLayer;
                return parent && this._get(panelId, parent);
            } else if (GUIManager.layers.viewLayer) {
                return this._get(panelId, GUIManager.layers.viewLayer);
            }
        }
        return null;
    },
    _get (panelId, layer) {
        let children = layer.children;
        let panel;
        let n = children.length;
        if (n > 0) {
            for (let i = 0; i < n; ++i) {
                let node = children[i];
                if (node.__gdk_panelId__ == panelId) {
                    panel = node;
                    break;
                }
            }
        }
        return panel;
    },
    hide (id) {
        var panel = this.get(id);
        if (panel) {
            // 隐藏模式
            let hideMode = HideMode.DESTROY;
            let config = panel.config;
            if (config) {
                hideMode = Tool.validate(config.tempHidemode, config.hideMode, hideMode);
            }
            NodeTool.hide(panel, true, hideMode);
            // 如果有打开回调队列，则清除
            let panelId = config.__id__;
            if (this._openingDic[panelId]) {
                delete this._openingDic[panelId];
                this._closeWaiting(config);
            }
        } else if (this.isOpening(id)) {
            this._closeOpening(id);
        }
    },
    /**
     * 设置界面ID对应的参数，如果没有参数则清除旧的参数
     * @param {*} panelId 
     * @param  {...any} args
     */
    setArgs (panelId, ...args) {
        let config = this.getConfig(panelId);
        if (config) {
            panelId = config.__id__ || panelId;
            if (!args || args.length == 0) {
                delete this._panelArgsDic[panelId];
                return;
            }
            this._panelArgsDic[panelId] = args;
        }
    },
    /**
     * 获得setPanelArgs保存的参数
     * @param {*} panelId 
     * @param {*} remove 
     */
    getArgs (panelId, remove = true) {
        let config = this.getConfig(panelId);
        if (config) {
            panelId = config.__id__ || panelId;
            let args = this._panelArgsDic[panelId];
            if (remove) {
                delete this._panelArgsDic[panelId];
            }
            return args;
        }
    },
};

module.exports = PanelManager;