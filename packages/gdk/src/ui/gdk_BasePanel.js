var EventTrigger = require("../core/gdk_EventTrigger");
var Tool = require("../core/gdk_Tool");
var NodeTool = require("../Tools/gdk_NodeTool");
var i18n = require("../Tools/gdk_i18n");
var PanelId = require("../enums/gdk_PanelId");
var HideMode = require("../const/gdk_HideMode");
var ResourceManager = require("../managers/gdk_ResourceManager");
var PoolManager = require("../managers/gdk_PoolManager");
var Timer = require("../core/gdk_Timer");
var EventManager = require("../managers/gdk_EventManager");
/**
 * 面板基类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-15 11:43:55
 */
var BasePanel = cc.Class({
    extends: cc.Component,
    editor: {
        // menu: 'gdk_ui/BasePanel',
        disallowMultiple: false
    },

    properties: {
        _resId: 0, //资源ID
        resId: {
            get() {
                return this._resId;
            },
            set(value) {
                this._resId = value;
            },
            visible: false,
        },
        config: {
            get() {
                if (CC_EDITOR) return;
                return PanelId.getValue(this._resId);
            },
            visible: false,
        },
        args: {
            get() {
                if (CC_EDITOR) return;
                var PanelManager = require("../managers/gdk_PanelManager");
                return PanelManager.getArgs(this._resId) || [];
            },
            visible: false,
        },
        preloads: {
            get() {
                let config = this.config;
                return config ? config.preloads : null;
            },
            visible: false,
        },
        _preloadNames: [],
        _preloads: {
            get() {
                let ret = [];
                for (let i = 0; i < this._preloadNames.length; i++) {
                    ret[i] = PanelId[this._preloadNames[i]] || 0;
                }
                return ret;
            },
            set(value) {
                this._preloadNames = [];
                for (let i = 0; i < value.length; i++) {
                    this._preloadNames[i] = PanelId[value[i]];
                }
            },
            type: [PanelId],
            visible: true,
            tooltip: CC_DEV && "预加载列表，如果没可选值，请先配置PanelId"
        },
        ///////    需要在属性面板上绑定的UI属性   //////
        /**
         * 面板的关闭按钮，需要在组件上配置
         * @property {cc.Button} _closeBtn
         */
        _closeBtn: {
            default: null,
            type: cc.Button,
            serializable: true,
            visible: true,
        },
        /**
         * 面板的标题
         * @property {cc.Label} _titleLabel
         */
        _titleLabel: {
            default: null,
            type: cc.Label,
            serializable: true,
            visible: true,
        },
        ////////////  
        _isShowCloseBtn: {
            default: false,
            serializable: true,
        },
        /**
         * 是否显示关闭按钮
         * @property {Boolean} isShowCloseBtn
         */
        isShowCloseBtn: {
            type: cc.Boolean,
            set(value) {
                this._isShowCloseBtn = value;
                if (this._closeBtn) {
                    this._closeBtn.node.active = value;
                }
            },
            get() {
                return this._isShowCloseBtn;
            }
        },
        _title: "",
        /**
         * 标题
         * @property {String} title
         */
        title: {
            type: cc.String,
            visible: false,
            set(value) {
                this._title = value;
                if (this._titleLabel) {
                    this._titleLabel.string = i18n.t(value);
                }
            },
            get() {
                return this._title;
            }
        },
        /**
         * 关闭事件
         * @property {EventTrigger} onClose
         */
        onClose: {
            default: null,
            serializable: false,
            visible: false,
        },
    },

    ctor () {
        this.onClose = EventTrigger.get();
        // hook onLoad & onEnable & onDisable & onDestroy
        ['onLoad', 'onEnable', 'onDisable', 'onDestroy'].forEach(name => {
            if (this[name]) {
                let func = this[name];
                this[name] = function () {
                    func.call(this);
                    this["_" + name].call(this);
                };
            } else {
                this[name] = this["_" + name];
                delete this["_" + name];
            }
        });
    },
    _onLoad () {
        if (this._closeBtn) {
            this._closeBtn.node.on("click", () => {
                this.close(-1);
            }, this);
            this._closeBtn.node.active = this._isShowCloseBtn;
        }
    },
    _onEnable () {
        this._$N_preloads = [];

        // 配置或类定义的预加载列表
        let preloads = this.preloads;
        if (preloads instanceof Array) {
            let a0 = preloads;
            let n0 = a0 ? a0.length : 0;
            if (n0 > 0) {
                for (let i = 0; i < n0; i++) {
                    let val = cc.js.isString(a0[i]) ? PanelId.getValue(a0[i]) : a0[i];
                    if (val && this._$N_preloads.indexOf(val) === -1) {
                        this._$N_preloads.push(val);
                    }
                }
            }
        }

        // 预制体中定义的预加载列表
        preloads = this._preloadNames;
        if (preloads instanceof Array) {
            let a0 = preloads;
            let n0 = a0 ? a0.length : 0;
            if (n0 > 0) {
                for (let i = 0; i < n0; i++) {
                    let val = PanelId.getValue(a0[i]);
                    if (val && this._$N_preloads.indexOf(val) === -1) {
                        this._$N_preloads.push(val);
                    }
                }
            }
        }

        // 预加载界面资源
        let a = this._$N_preloads;
        let n = a ? a.length : 0;
        if (n > 0) {
            const PanelManager = require("../managers/gdk_PanelManager");
            for (let i = 0; i < n; i++) {
                PanelManager.preload(a[i]);
            }
        }
    },
    _onDisable () {
        // 移除预加载的项
        let a = this._$N_preloads;
        let n = a ? a.length : 0;
        if (n > 0) {
            const PanelManager = require("../managers/gdk_PanelManager");
            for (let i = 0; i < n; i++) {
                let val = a[i];
                let resId = val.__id__;
                if (!PanelManager.isOpenOrOpening(resId)) {
                    let key = null;
                    let prefab = ResourceManager.getResByUrl(val.prefab, cc.Prefab);
                    if (prefab) {
                        key = prefab.name + "#" + prefab.data._prefab.fileId;
                    }
                    if (key == null || PoolManager.getCount(key) <= 0) {
                        ResourceManager.releaseResByPanel(resId);
                    }
                }
            }
        }
        // 清除对config一次有效数据
        let config = this.config;
        if (config) {
            config.parent = null;
            config.tempHidemode = null;
            delete config.parent;
            delete config.tempHidemode;
        }
    },
    _onDestroy () {
        this.onClose.release();
        this.onClose = null;
        Timer.clearAll(this);
        EventManager.targetOff(this);
        ResourceManager.releaseResByPanel(this._resId);
    },
    close (buttonIndex) {
        (buttonIndex === void 0) && (buttonIndex = -1);
        if (this.onClose.emit(buttonIndex) == false) {
            return;
        }
        // 执行隐藏后动作
        let config = this.config;
        let hideVal = null;
        if (config) {
            hideVal = config.onHide;
            delete config.onHide;
        }
        if (buttonIndex == -1 && hideVal) {
            if (hideVal.id) {
                // 设置参数并打开
                const PanelManager = require("../managers/gdk_PanelManager");
                if (hideVal.args !== void 0) {
                    PanelManager.setArgs(hideVal.id, hideVal.args);
                }
                PanelManager.open(hideVal.id, this._closeAfter, this);
            } else {
                // 回调函数
                if (typeof hideVal.func === 'function') {
                    hideVal.func();
                }
                // 关闭
                this._closeAfter();
            }
        } else {
            // 关闭
            this._closeAfter();
        }
    },
    _closeAfter () {
        if (!cc.isValid(this)) return;
        if (!cc.isValid(this.node)) return;
        this.onClose.offAll();
        // 隐藏模式
        let hideMode = HideMode.DESTROY;
        let config = this.config;
        if (config) {
            hideMode = Tool.validate(config.tempHidemode, config.hideMode, hideMode);
        }
        NodeTool.hide(this.node, true, hideMode);
    },
    unuse () {
        this.onClose.offAll();
        this._isShowCloseBtn = false;
        this._title = "";
    },

    loadRes (url, type, cb) {
        ResourceManager.loadRes(this._resId, url, type, cb);
    },
    loadResByModule (modules, param, pcb, cb) {
        ResourceManager.loadResByModule(this._resId, modules, param, pcb, cb);
    },
    releaseRes (asset, type) {
        ResourceManager.releaseRes(this._resId, asset, type);
    }
});

module.exports = BasePanel;