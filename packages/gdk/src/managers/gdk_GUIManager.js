var Tool = require("../core/gdk_Tool");
var NodeTool = require("../Tools/gdk_NodeTool");
var PoolManager = require("./gdk_PoolManager");
var PopupManager = require("./gdk_PopupManager");
var LoadingUI = require("../ui/gdk_LoadingUI");
var Alert = require("../ui/gdk_Alert");
var MessaageUI = require("../ui/gdk_MessageUI");
var WaitingUI = require("../ui/gdk_WaitingUI");
var PopupComponent = require("../components/gdk_PopupComponent");
var EventTrigger = require("../core/gdk_EventTrigger");
var DelayCall = require("../core/gdk_DelayCall");
var HideMode = require("../const/gdk_HideMode");
var MessageMode = require("../const/gdk_MessageMode");
var ToolTip = require("../ui/gdk_ToolTip");
var EventManager = require("./gdk_EventManager");

/**
 * UI管理工具
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-26 09:26:32
 */

var GUIManager = function () {
    /**
     * 通过这样 GUIManager.layers.popUpLayer可以访问到不同的层,一般不要修改它
     * @property layers
     */
    this.layers = [
        "floorLayer", //底图层
        "viewLayer", //游戏层
        "menuLayer", //菜单层
        "popupLayer", //弹出面板层
        "popMenuLayer", //弹出菜单
        "messageLayer", //轻度信息提示层
        "guideLayer", //新手引导层
        "toolTipLayer", //ToolTip层
        "waitingLayer", //等待画面层
        "loadingLayer", //加载画面层
        "systemPopLayer", //系统提示信息层
        "debugLayer" //调试层
    ];
    /**
     * 提示背景prefab
     * @property {cc.Prefab} messageBgPrefab
     */
    this.messageBgPrefab = null;
    /**
     * 提示prefab
     * @property {cc.Prefab} messagePrefab
     */
    this.messagePrefab = null;
    /**
     * 提示信息多少秒后自己消失
     * @property {number} messageAutoCloseTime
     */
    this.messageAutoCloseTime = 2;
    /**
     * 多条提示信息时的显示模式
     * @property {MessageMode} messageMode (Float|Replace) 对应的是(新向把旧的顶上浮可以显示多条|冲掉旧的信息在旧的信息上显示新信息)
     */
    this.messageMode = MessageMode.FLOAT;
    /**
     * 多条信息显示的最大数量
     */
    this.messageMax = Number.MAX_VALUE;

    /**
     * 等待显示
     * @property {cc.Prefab} waitingPrefab
     */
    this.waitingPrefab = null;
    /**
     * 等待显示模态遮罩颜色
     * @property {cc.color|string} waitingMaskColor 默认透明
     */
    this.waitingMaskColor = new cc.color(0, 0, 0, 0);

    /**
     * 警告面板prefab
     * @property {cc.Prefab} alertPrefab 
     */
    this.alertPrefab = null;
    /**
     * 警告面板模态遮罩颜色
     * @property {cc.color|string} alertMaskColor 默认黑色半透
     */
    this.alertMaskColor = new cc.color(0, 0, 0, 255 * 0.5);

    /**
     * 警告面板默认标题
     * @property {string} alertTitle 默认""
     */
    this.alertTitle = "";
    /**
     * 警告面板默认确定文字
     * @property {string} alertOk 默认"OK"
     */
    this.alertOk = "OK";
    /**
     * 警告面板默认取消文字
     * @property {string} alertCancel 默认"Cancel"
     */
    this.alertCancel = "Cancel";
    /**
     * 弹出面板模态遮罩颜色
     * @property {cc.color|string} popupMaskColor 默认黑色半透
     */
    this.popupMaskColor = new cc.color(0, 0, 0, 255 * 0.5);

    /**
     * 弹出菜单prefab
     * @property {cc.Prefab} popupMenuPrefab 
     */
    this.popupMenuPrefab = null;
    /**
     * 工具提示prefab
     * @property {cc.Prefab} toolTipPrefab 
     */
    this.toolTipPrefab = null;
    /**
     * 弹窗遮照prefab
     * @property {cc.Prefab} maskPrefab 
     */
    this.maskPrefab = null;
    /**
     * 加载界面显示事件
     * @property {EventTrigger} onLoadingShow 
     * @event
     */
    this.onLoadingShow = new EventTrigger();
    /**
     * 加载界面隐藏事件
     * @property {EventTrigger} onLoadingHide 
     * @event
     */
    this.onLoadingHide = new EventTrigger();
    /**
     * view面板改变时事件
     * @property {EventTrigger} onViewChanged 
     * @event
     */
    this.onViewChanged = new EventTrigger();
    /**
     * 打开弹窗事件
     * @property {EventTrigger} onPopupChanged 
     * @event
     */
    this.onPopupChanged = new EventTrigger();

    /**
     * 锁屏被点击事件
     * @property {EventTrigger} onLockScreenClick 
     * @event
     */
    this.onLockScreenClick = new EventTrigger();

    /**
     * ui层顶节点
     */
    this.guiLayer;
    this.guiWidgetSize = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    // 私有变量
    this._loadingUI = null;
    this._waitingUI = null;

    this._waitingTagMap = new Map();
    this._waitingTimeoutMap = new Map();
    this._waitingDelayMap = new Map();
    this._popUpMenu = null;
    this._toolTipUI = null;
    this._navViews = [];
    this._lockScreen = null;
    this._isInit = false;
    this._popupOneByOnes = [];
}


GUIManager.prototype = {

    /**
     * 使用前必需要先初始化。
     * @param {Node} guiLayer 
     */
    init (guiLayer) {
        if (this._isInit)
            return;

        this.guiLayer = guiLayer;
        if (this.guiLayer == null) {
            this.guiLayer = new cc.Node("guiLayer");
            var curScene = cc.director.getScene();
            this.guiLayer.parent = curScene;
            this.guiLayer.zIndex = 1000;
        }

        var layersTemp = {};
        for (var i = 0; i < this.layers.length; i++) {
            var layer = new cc.Node(this.layers[i]);
            layer.parent = this.guiLayer;
            layersTemp[this.layers[i]] = layer;

        }
        this.layers = layersTemp;
        this._isInit = true;
    },
    updateSize () {
        let instance = cc.Canvas.instance;
        if (instance && cc.isValid(instance.node)) {
            // 计算调整
            this.guiWidgetSize = {
                top: 45,
                bottom: 38,
                left: 0,
                right: 0
            };
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                // 微信小游戏适配
                const wx = window['wx'];
                const info = wx ? wx.getSystemInfoSync() : null;
                const widget = this.guiWidgetSize;
                if (info && (info.system.startsWith("Windows") || info.system.startsWith("macOS"))) {
                    // windows 或 mac 电脑系统
                    widget.top = 0;
                    widget.bottom = 0;
                } else if (info && info.safeArea) {
                    // 手机系统
                    let windowHeight = info.windowHeight;
                    let gameSize = cc.view.getVisibleSize();
                    let gameHeight = gameSize.height;
                    let ratio = gameHeight / windowHeight;
                    let rect = wx.getMenuButtonBoundingClientRect();
                    //rect.width *= ratio;
                    rect.height *= ratio;
                    //rect.left *= ratio;
                    rect.top *= ratio;
                    //rect.bottom = gameSize.height - rect.bottom * ratio;
                    //rect.right = gameSize.width - rect.right * ratio;
                    widget.top = Math.max(80, rect.top + rect.height) >> 0;
                    widget.bottom = Math.max(0, info.screenHeight - info.safeArea.bottom) >> 0;
                } else {
                    // 其他未知情况
                    widget.top = 128;
                    widget.bottom = 38;
                }
            } else if (cc.sys.isBrowser && !cc.sys.isNative) {
                const gdk = require('../gdk');
                const widget = this.guiWidgetSize;
                // 浏览器非原生模式
                if (gdk.mdd.isIOS) {
                    // IOS系统
                    widget.top = 0;
                } else if (gdk.mdd.isAndroid) {
                    // 安卓系统
                    widget.top = 45;
                    widget.bottom = 0;
                } else {
                    // 非手机系统
                    const view = cc.view;
                    const scale = view.getScaleX();
                    widget.top = 0;
                    widget.bottom = 0;
                    widget.left = widget.right = Math.max(0, (view.getCanvasSize().width - view.getDesignResolutionSize().width * scale) / 2 / scale) >> 0;
                }
            }
            // 应用调整
            var ws = cc.view.getCanvasSize();
            var n = instance.node;
            var w = n.width;
            var h = n.height;
            var gws = this.guiWidgetSize;
            if (gws && (!cc.sys.isMobile || cc.sys.platform === cc.sys.WECHAT_GAME || ws.height / ws.width > 2)) {
                // 高于设计分辨率时
                var comp = this.guiLayer.getComponent(cc.Widget);
                if (!comp) {
                    comp = this.guiLayer.addComponent(cc.Widget);
                    comp.isAlignTop = true;
                    comp.isAlignBottom = true;
                    comp.isAlignLeft = true;
                    comp.isAlignRight = true;
                    comp.alignMode = 2;
                }
                // 边界值
                comp.top = gws.top;
                comp.bottom = gws.bottom;
                comp.left = gws.left;
                comp.right = gws.right;
                // 高宽
                h -= gws.top + gws.bottom;
                w -= gws.left + gws.right;
                // 子节点
                this.guiLayer.children.forEach(n => {
                    var c = n.getComponent(cc.Widget);
                    if (c) {
                        c.verticalCenter = (gws.top - gws.bottom) / 2;
                    }
                });
            }
            var layerSize = cc.size(w, h);
            for (var i in this.layers) {
                var layer = this.layers[i];
                layer.setContentSize(layerSize);
            }
        }
    },

    ///////  加载面板   ////////
    /**
     * 获取当前加载面板，没有则返回空
     * @method getCurrentLoading
     */
    getCurrentLoading (prefab) {
        if (prefab && this._loadingUI == null) {
            if (prefab instanceof cc.Node) {
                this._loadingUI = prefab;
            } else {
                let key = prefab.name + "#" + prefab.data._prefab.fileId;
                this._loadingUI = PoolManager.getCacheOrPool(key)
                if (this._loadingUI == null) {
                    this._loadingUI = cc.instantiate(prefab);
                }
            }
        }
        return this._loadingUI;
    },
    /**
     * 显示加载面板。
     * @param {String|number} info|loaded 显示加载信息(%0 ：已加载数,%1 : 总量, %2 : 百分比,%% : %)
     * @param {number} loaded 已加载
     * @param {number} total 总量
     * @method showLoading
     */
    showLoading (info, loaded, total) {
        if (typeof info == "number") {
            total = loaded;
            loaded = info;
            info = null;
        }
        return this._showLoading(info, loaded, total);
    },

    _showLoading (info, loaded, total) {
        if (this._loadingUI) {
            var isShow = this._loadingUI.active;
            if (this._loadingUI.parent == null) {
                this._loadingUI.parent = this.layers.loadingLayer;
                this._loadingUI.setPosition(0, 0);
            }
            if (isShow == false) {
                NodeTool.show(this._loadingUI);
                this.onLoadingShow.emit();
            }
            var ui = this._loadingUI.getComponent(LoadingUI);
            if (ui) {
                if (info != null) ui.info = info;
                if (loaded != null) ui.loaded = loaded;
                if (total != null) ui.total = total;
            }
        }
        return this._loadingUI;
    },
    /**
     * 不再显示加载面板。
     * @method hideLoading 
     */
    hideLoading () {
        if (this._loadingUI && cc.isValid(this._loadingUI) && this._loadingUI.parent) {
            var isShow = NodeTool.isShow(this._loadingUI);
            if (isShow) {
                this._loadingUI = NodeTool.hide(this._loadingUI);
                this.onLoadingHide.emit();
            }
        }
        this._loadingUI = null;
    },

    ///////  显示提示警告框   ////////
    /**
     * 显示警告，如果tag相同的alert已存在，返回原来的Alert并修改为最新的显示属性
     * showAlert(text,title,tag,callback,thisArg,buttons);
     * showAlert(text,title,callback,thisArg,buttons);
     * showAlert(text,callback,thisArg,buttons);
     * @method showAlert 
     */
    showAlert (text, title = null, tag = null, callback = null, thisArg = null, buttons = null) {
        var args = this._getAlertArgs(title, tag, callback, thisArg, buttons)
        return this._showAlert(text, args.title, args.tag, args.callback, args.thisArg, args.buttons);
    },
    _showAlert (text, title, tag, callback, thisArg, buttons) {
        var alert = null;

        if (tag != null && tag != "")
            alert = Alert.getByTag(tag);

        if (alert == null) {
            if (this.alertPrefab) {
                var node = this._createPrefabOrNode(this.alertPrefab);
                var popup = PopupManager.addPopup(node, this.layers.systemPopLayer, true);
                NodeTool.center(popup.node);
                popup.maskColor = this.alertMaskColor.clone();
                NodeTool.show(popup.node);
                alert = popup.node.getComponent(Alert);
            }
        }
        if (alert) {
            if (buttons == null) {
                var ok = this.alertOk;
                buttons = [ok];
            }

            alert.buttons = buttons;
            if (text)
                alert.text = text;
            if (title == null) {
                title = this.alertTitle
            }

            alert.title = title;
            alert.onClose.offAll();
            if (callback)
                alert.onClose.once(callback, thisArg);
            if (tag)
                alert.tag = tag;
            alert.defaultButtonIndex = 0;
        }
        return alert;
    },
    /**
     * 弹出一个确认和取消的警告框。
     * @method showAskAlert
     * @param {string} text 
     * @param {string} title  
     * @param {string} tag 
     * @param {function} callback 
     * @param {any} thisArg 
     * @param {any} opt
     */
    showAskAlert (text, title = null, tag = null, callback = null, thisArg = null, opt = null) {
        var args = this._getAlertArgs(title, tag, callback, thisArg);
        var ok = this.alertOk;
        var cancel = this.alertCancel;
        if (opt) {
            ok = opt.ok || ok;
            cancel = opt.cancel || cancel;
        }
        return this._showAlert(text, args.title || this.alertTitle, args.tag, args.callback, args.thisArg, [ok, cancel])
    },
    _getAlertArgs (title, tag, callback, thisArg, buttons) {
        if (typeof title == "function") {
            buttons = callback;
            thisArg = tag;
            callback = title;
            title = null;
            tag = null;
        } else
        if (typeof tag == "function") {
            buttons = thisArg;
            thisArg = callback;
            callback = tag;
            tag = null;
        }
        return {
            title: title,
            tag: tag,
            callback: callback,
            thisArg: thisArg,
            buttons: buttons
        }
    },
    /**
     * 
     * @method hideAlert
     * @param {Node|Alert|string} alertOrTag 
     */
    hideAlert (alertOrTag) {
        var node;
        if (alertOrTag instanceof cc.Node)
            node = alertOrTag;
        else if (alertOrTag instanceof Alert)
            node = alertOrTag.node;
        else if (typeof alertOrTag == "string") {
            var alert = Alert.getByTag(alertOrTag);
            if (alert)
                node = alert.node;
        }
        if (node)
            NodeTool.hide(node);

    },
    getAlert (alertOrTag) {
        var alert;
        if (alertOrTag instanceof cc.Node)
            alert = alertOrTag.getComponent(Alert);
        else if (alertOrTag instanceof Alert)
            alert = alertOrTag;
        else if (typeof alertOrTag == "string") {
            alert = Alert.getByTag(alertOrTag);
        }
        return alert
    },
    hideAllAlert () {
        if (this.layers.systemPopLayer.childrenCount > 0) {
            var arr = this.layers.systemPopLayer.getComponentsInChildren(Alert);
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    NodeTool.hide(arr[i].node);
                }
            }
        }
    },


    /////显示系统轻度提示,   ///
    /**
     * 
     * @method showMessage
     * @param {string} text 
     * @param {*} type 
     * @param {'add'|'update'} mode
     * @param offsetY
     */
    showMessage (text, type = null, mode = 'add', offsetY = 0) {
        if (this.messagePrefab) {
            let messageUI;
            if (this.messageMode == MessageMode.FLOAT) {

                let childrens = this.layers.messageLayer.getComponentsInChildren(MessaageUI);
                if (mode === 'update') {
                    if (childrens.length > 0) {
                        let children = childrens[childrens.length - 1];
                        if (children.text == text &&
                            text.type == type &&
                            children.node.isShow &&
                            DelayCall.has(this._hideMessage, children)
                        ) {
                            //最后一个与当前的相同，则不再弹，而是刷新关闭时间
                            DelayCall.addCall(this._hideMessage, children, this.messageAutoCloseTime);
                            return;
                        }
                    }
                }

                // 移除多余数量的message实例
                let len = childrens.length;
                if (len >= this.messageMax) {
                    let num = len - this.messageMax + 1;
                    let removes = childrens.slice(0, num);
                    for (let i = 0; i < num; i++) {
                        DelayCall.cancel(this._hideMessage, removes[i]);
                        NodeTool.hide(removes[i].node, false);
                    }
                    childrens = this.layers.messageLayer.getComponentsInChildren(MessaageUI);
                }
                len = childrens.length;
                for (let i = 0; i < len; i++) {
                    let children = childrens[i];
                    children.node.runAction(cc.moveBy(0.3, 0, children.node.height));
                }

                let node = this._createPrefabOrNode(this.messagePrefab);
                node.parent = this.layers.messageLayer;
                NodeTool.center(node);
                messageUI = node.getComponent(MessaageUI);

                node.y = node.y - node.height;
                node.runAction(cc.moveBy(0.3, 0, node.height + offsetY));

            } else {

                messageUI = this.layers.messageLayer.getComponentInChildren(MessaageUI);
                if (messageUI == null) {
                    let node = this._createPrefabOrNode(this.messagePrefab);
                    node.parent = this.layers.messageLayer;
                    NodeTool.center(node);
                    messageUI = node.getComponent(MessaageUI);
                }
            }

            // 消息背景层
            if (this.messageBgPrefab) {
                let name = "___gdk__message_bg___";
                let messageBg = this.layers.messageLayer.getChildByName(name);
                if (!messageBg) {
                    messageBg = this._createPrefabOrNode(this.messageBgPrefab);
                    messageBg.name = name;
                    messageBg.zIndex = -999;
                    messageBg.parent = this.layers.messageLayer;
                }
                NodeTool.show(messageBg);
            }

            messageUI.type = type;
            messageUI.text = text;
            NodeTool.show(messageUI.node);
            DelayCall.addCall(this._hideMessage, messageUI, this.messageAutoCloseTime);
        }
    },

    hideAllMessage () {
        let childrens = this.layers.messageLayer.getComponentsInChildren(MessaageUI);
        for (let i = 0; i < childrens.length; i++) {
            DelayCall.cancel(this._hideMessage, childrens[i]);
            NodeTool.hide(childrens[i].node);
        }
        // 消息背景层
        var name = "___gdk__message_bg___";
        var messageBg = this.layers.messageLayer.getChildByName(name);
        if (cc.isValid(messageBg)) {
            NodeTool.hide(messageBg);
        }
    },

    _hideMessage () {
        this.node && NodeTool.hide(this.node, true, () => {
            // message背景节点
            let gui = Tool.getSingleton(GUIManager);
            let childrens = gui.layers.messageLayer.getComponentsInChildren(MessaageUI);
            if (childrens.length == 1) {
                // 全部message节点已经清除
                let name = "___gdk__message_bg___";
                let messageBg = gui.layers.messageLayer.getChildByName(name);
                if (messageBg) {
                    NodeTool.hide(messageBg);
                }
            }
        });
    },
    /////显示系统轻度提示,   ///
    /**
     * 当前wating
     * @method getCurrentWaiting
     */
    getCurrentWaiting () {
        return this._waitingUI;
    },
    /**
     * 同一时间只会显示一个waiting， 可以为waiting指定一个tag，hide掉一个tag后，
     * 会显示前一个tag的wait，直接所有tag都hide完才不显示waiting
     * @method showWaiting
     * @param {String} text 
     * @param {String} tag 
     * @param {Number} timeout 多少秒后自动消失，默认为0,不消失
     * @param {Number} delay 延时多少秒后才显示
     */
    showWaiting (text = null, tag = null, timeout = 0, timeoutFun = null, thisArg = null, delay = 0) {
        if (typeof arguments[1] == "number") {
            timeout = arguments[1];
            timeoutFun = arguments[2];
            thisArg = arguments[3];
            delay = 0;
            tag = null;
        } else if (typeof arguments[0] == "number") {
            timeout = arguments[0];
            timeoutFun = arguments[1];
            thisArg = arguments[2];
            delay = 0;
            tag = null;
            text = null;
        }
        this.hideWaiting(tag);
        if (delay > 0) {
            let timeId = setTimeout(() => {
                this._showWaitingLater(text, tag, timeout, timeoutFun, thisArg);
            }, delay * 1000);
            this._waitingDelayMap.set(tag, timeId);
        } else {
            this._showWaitingLater(text, tag, timeout, timeoutFun, thisArg);
        }
    },
    _showWaitingLater (text = null, tag = null, timeout = 0, timeoutFun = null, thisArg = null) {
        if (!cc.isValid(this._waitingUI)) {
            let prefab = this.waitingPrefab;
            if (prefab) {
                let key = prefab.name + "#" + prefab.data._prefab.fileId;
                this._waitingUI = PoolManager.getCacheOrPool(key);
                if (!this._waitingUI) {
                    let pop = PopupManager.addPopupOne(prefab, this.layers.waitingLayer, true);
                    NodeTool.center(pop.node);
                    pop.maskColor = this.waitingMaskColor.clone();
                    this._waitingUI = pop.node;
                } else if (!this._waitingUI.parent) {
                    PopupManager.addPopup(this._waitingUI, this.layers.waitingLayer, true);
                }
            }
        }
        if (cc.isValid(this._waitingUI)) {
            this._waitingTagMap.set(tag, text);
            NodeTool.show(this._waitingUI);
            let ui = this._waitingUI.getComponent(WaitingUI);
            if (ui) {
                ui.text = text;
            }
            if (timeout > 0) {
                if (this._waitingTimeoutMap.has(tag)) {
                    let callBack = this._waitingTimeoutMap.get(tag);
                    DelayCall.cancel(callBack, this);
                    this._waitingTimeoutMap.delete(tag);
                }
                let callBack = function () {
                    this.hideWaiting(tag);
                    if (timeoutFun) {
                        timeoutFun.call(thisArg);
                    }
                };
                DelayCall.addCall(callBack, this, timeout);
                this._waitingTimeoutMap.set(tag, callBack);
            }

            if (this._waitingDelayMap.has(tag)) {
                let timeId = this._waitingDelayMap.get(tag);
                clearTimeout(timeId);
                this._waitingDelayMap.delete(tag);
            }
        }
        return this._waitingUI;
    },
    /**
     * @method hideWaiting
     * @param {string} tag 
     */
    hideWaiting (tag = null) {
        if (this._waitingTagMap.has(tag)) {
            let callBack = this._waitingTimeoutMap.get(tag);
            if (callBack) {
                this._waitingTimeoutMap.delete(tag);
                DelayCall.cancel(callBack, this);
            }
            this._waitingTagMap.delete(tag);
            if (this._waitingTagMap.size == 0) {
                if (this._waitingUI) {
                    this._waitingUI = NodeTool.hide(this._waitingUI);
                }
            } else if (this._waitingUI) {
                let ui = this._waitingUI.getComponent(WaitingUI);
                if (ui) {
                    let values = this._waitingTagMap.values();
                    for (let value of values) {
                        ui.text = value;
                        break;
                    }
                }
            }
        }
        if (this._waitingDelayMap.has(tag)) {
            let timeId = this._waitingDelayMap.get(tag);
            clearTimeout(timeId);
            this._waitingDelayMap.delete(tag);
        }
    },
    /**
     * 不管有多少tag的waiting，都不再显示
     * @method hideAllWaiting
     */
    hideAllWaiting () {
        this._waitingTagMap.clear();
        this._waitingTimeoutMap.clear();
        this._waitingDelayMap.forEach(clearTimeout);
        this._waitingDelayMap.clear();
        if (this._waitingUI) {
            this._waitingUI = NodeTool.hide(this._waitingUI);
        }
    },

    ///// 弹出菜单 //////

    showPopupMenu (items, isMask = false, onClose = null, thisArg = null) {

    },
    hidePopupMenu () {

    },


    ///// 弹出面板 //////

    addPopupOneByOne (prefabOrNode, isMask = true, callBack = null, thisArg = null) {
        this._popupOneByOnes.push({
            prefabOrNode,
            isMask,
            callBack,
            thisArg
        });
        if (this._popupOneByOnes.length == 1)
            this._checkNextPopup();
    },
    _checkNextPopup () {
        if (this._popupOneByOnes.length > 0) {
            var obj = this._popupOneByOnes[0];
            let popup = this.addPopup(obj.prefabOrNode, obj.isMask);
            NodeTool.onHide(popup.node).once(() => {
                this._popupOneByOnes.shift();
                this._checkNextPopup();
            }, this);
            if (obj.callBack) {
                obj.callBack.call(obj.thisArg, popup);
            }
        }
    },

    /**
     * 弹出一个面板
     * @method addPopup
     * @param {Node|Prefab} prefabOrNode 
     * @param {Boolean} isMask 
     * @param {Function} precb
     * @param {Function} cb
     * @param {Node} parentNode
     */
    addPopup (prefabOrNode, isMask = true, precb, cb, parentNode) {
        if (prefabOrNode == null) {
            return;
        }
        let pop = null;
        let node = null;
        Tool.execSync(() => {
            pop = PopupManager.get(prefabOrNode);
            if (pop) {
                node = pop.node;
            } else {
                node = this._createPrefabOrNode(prefabOrNode);
                node.active = false;
            }
        }).then(() => {
            if (!cc.isValid(node)) return;
            let parent = parentNode || this.layers.popupLayer;
            if (pop && node) {
                if (node.parent !== parent) {
                    pop = PopupManager.addPopupOne(node, parent, isMask);
                }
            } else {
                pop = PopupManager.addPopupOne(node, parent, isMask);
                if (pop && isMask) {
                    pop.maskColor = this.popupMaskColor.clone();
                    pop.maskAlpha = 0;
                }
            }
            precb && pop && precb(pop);
        }).then(() => {
            if (!pop) return;
            if (!cc.isValid(pop.node)) return;
            NodeTool.show(pop.node, true, (e) => {
                if (cc.js.isString(e) &&
                    e.indexOf('error:') == 0) {
                    // 设置节点active为true时异常
                    CC_DEBUG && cc.error(e);
                    try {
                        pop.node.destroy();
                    } catch (e) {}
                    pop.node = null;
                    return;
                }
                cb && Tool.callInNextTick(cb, pop);
                cb = null;
            });
            if (pop && cc.isValid(pop.node)) {
                // 关闭事件
                let resId = Tool.getResIdByNode(pop.node);
                let onHide = NodeTool.onHide(pop.node);
                let thisArg = {};
                onHide.on(() => {
                    onHide.targetOff(thisArg);
                    EventManager.emit('popup#' + resId + '#close');
                    EventManager.emit('popupclose', resId);
                    cb && cb(null);
                }, thisArg);
                EventManager.emit('popup#' + resId + '#open');
                EventManager.emit('popupopen', resId);
                this.onPopupChanged.emit(pop.node);
            }
        });
    },

    /**
     * 置顶一popup
     * @method 
     * @param {cc.Node|PopupComponent|string} nodeOrPopup 节点，Component,或节点的名字
     */
    pinTop (nodeOrPopup) {
        var node = nodeOrPopup;
        if (typeof node == "string")
            node = this.layers.popupLayer.getChildByName(node);
        else if (nodeOrPopup instanceof cc.Component)
            node = nodeOrPopup.node;
        if (node) {
            node.zIndex = cc.macro.MAX_ZINDEX;
        }
    },
    /**
     * 取消置顶一popup
     * @method 
     * @param {cc.Node|PopupComponent|string} nodeOrPopup 节点，Component,或节点的名字
     */
    unPinTop (nodeOrPopup) {
        var node = nodeOrPopup;
        if (typeof node == "string")
            node = this.layers.popupLayer.getChildByName(node);
        else if (nodeOrPopup instanceof cc.Component)
            node = nodeOrPopup.node;
        if (node) {
            node.zIndex = 0;
        }

    },
    /**
     * 移除一popup
     * @param {cc.Node|PopupComponent|string} nodeOrPopup 节点，Component,或节点的名字
     */
    removePopup (nodeOrPopup) {
        if (typeof nodeOrPopup == "string")
            nodeOrPopup = this.getPopupByName(nodeOrPopup);
        if (nodeOrPopup)
            PopupManager.removePopup(nodeOrPopup);
    },
    /**
     * 通过名字获取一个popup
     * @param {string} name 
     */
    getPopupByName (name) {
        var node = this.layers.popupLayer.getChildByName(name);
        if (node)
            node = node.getComponent(PopupComponent);
        return node;
    },
    /**
     * 获取所有popup，包括pin popup
     * @method getPopups
     */
    getPopups () {
        let popups = this.layers.popupLayer.getComponentsInChildren(PopupComponent);
        return popups;
    },
    hasPopup () {
        return !!this.layers.popupLayer.getComponentInChildren(PopupComponent);
    },
    getPopup (nodeOrPrefab) {
        return PopupManager.get(nodeOrPrefab);
    },
    /**
     * 移除所有popup
     */
    removeAllPopup () {
        if (this.layers.popupLayer.childrenCount > 0) {
            let arr = this.layers.popupLayer.getComponentsInChildren(PopupComponent);
            for (let i = 0; i < arr.length; i++) {
                PopupManager.removePopup(arr[i]);
            }
        }
    },

    ///// 菜单  //////

    addMenu (prefabOrNode) {
        if (prefabOrNode == null)
            return;

        var node = this._createPrefabOrNode(prefabOrNode);
        if (node) {
            node.parent = this.layers.menuLayer;
        }
    },
    removeMenu (node) {
        if (node == null)
            return;
        NodeTool.hide(node);
    },
    removeAllMenu () {
        var menus = this.layers.popupLayer.children;
        for (let i = 0; i < menus.length; i++) {
            NodeTool.hide(menus[i]);
        }
    },

    ///// 视图显示层      ///// 

    getCurrentView () {
        while (this._navViews.length > 0) {
            var node = this._navViews[this._navViews.length - 1];
            if (node && !node.__gdk_inPool__ && cc.isValid(node)) {
                return node;
            } else {
                this._navViews.length--;
            }
        }
        return null;
    },
    /**
     * 显示一个视图层
     * @param {*} prefabOrNode 
     * @param {Function} precb
     * @param {Function} cb
     */
    showView (prefabOrNode, precb, cb) {
        if (prefabOrNode == null) {
            return;
        }
        let node = null;
        let current = null;
        Tool.execSync(() => {
            node = this.getView(prefabOrNode.name);
            if (node == null) {
                node = this._createPrefabOrNode(prefabOrNode);
                node.active = false;
            }
        }).then(() => {
            current = this.getCurrentView();
            if (node && (current !== node || !node.active)) {
                precb && precb(node);
            } else {
                node = null;
                current = null;
            }
        }).then(() => {
            if (!cc.isValid(node)) return;
            // 隐藏当前的界面
            if (current) {
                let hideMode = HideMode.DESTROY;
                let config = current.config;
                if (config) {
                    hideMode = Tool.validate(config.tempHidemode, config.hideMode, hideMode);
                }
                NodeTool.onHide(current).off(this._onHideView, this);
                NodeTool.hide(current, false, hideMode);
            }
        }).then(() => {
            if (!cc.isValid(node)) return;
            // 显示下一个界面
            let i = this._navViews.indexOf(node);
            if (i != -1) {
                this._navViews.splice(i, 1);
            }
            this._navViews.push(node);
            if (node.parent !== this.layers.viewLayer) {
                node.parent = this.layers.viewLayer;
            }
        }).then(() => {
            if (!cc.isValid(node)) return;
            NodeTool.show(node, true, (e) => {
                if (cc.js.isString(e) &&
                    e.indexOf('error:') == 0) {
                    // 设置节点active为true时异常
                    CC_DEBUG && cc.error(e);
                    let i = this._navViews.indexOf(node);
                    if (i != -1) {
                        this._navViews.splice(i, 1);
                    }
                    node.destroy();
                    node = null;
                    return;
                }
                cb && Tool.callInNextTick(cb, node);
            });
        }).then(() => {
            if (!cc.isValid(node)) return;
            NodeTool.onHide(node).once(this._onHideView, this);
            this._onViewChanged(node, current);
        });
    },
    // 界面相关的全局事件
    _onViewChanged (node, old) {
        // 关闭事件
        if (old) {
            let resId = Tool.getResIdByNode(old);
            EventManager.emit('view#' + resId + "#close");
            EventManager.emit('viewclose', resId);
        }
        // 打开事件
        if (node) {
            let resId = Tool.getResIdByNode(node);
            EventManager.emit('view#' + resId + "#open");
            EventManager.emit('viewopen', resId);
        }
        this.onViewChanged.emit(node, old);
    },
    hideView (prefabOrNode = null) {
        if (this._navViews.length == 0) return;
        if (prefabOrNode == null) prefabOrNode = this.getCurrentView();
        if (prefabOrNode == null) return;
        var node = this.getView(prefabOrNode.name);
        if (node == null) return;
        NodeTool.hide(node);
        this._onHideView(node);
    },
    _onHideView (node) {
        (node instanceof cc.Component) && (node = node.node);
        if (this._navViews.length == 0) return;
        if (node == null) return;
        let index = this._navViews.indexOf(node);
        if (index == -1) return;
        let current = this.getCurrentView();
        if (index < this._navViews.length - 1) {
            this._navViews.splice(index, 1);
        } else {
            this._navViews.length--;
            current = this.getCurrentView();
            if (current) {
                const PanelManager = require('./gdk_PanelManager');
                if (!PanelManager.hasDisableView) {
                    NodeTool.show(current);
                    NodeTool.onHide(current).once(this._onHideView, this);
                }
            }
        }
        this._onViewChanged(current, node);
    },
    backView () {
        this.hideView();
    },
    hideAllView (...exclude) {
        if (this._navViews.length > 0) {
            var arr = [...this._navViews];
            this._navViews.length = 0;
            // 删除无效的node（不包含在当前打开的列表中）
            if (exclude && exclude.length > 0) {
                for (let i = exclude.length - 1; i >= 0; i--) {
                    let node = exclude[i];
                    if (arr.indexOf(node) < 0) {
                        exclude.splice(i, 1);
                    }
                }
            }
            // 销毁非排除的所有View
            for (let i = arr.length - 1; i >= 0; i--) {
                let node = arr[i];
                let bool = !exclude || exclude.length < 1 || exclude.indexOf(node) < 0;
                if (bool) {
                    if (node.active) {
                        NodeTool.hide(node, false, HideMode.DESTROY);
                    } else {
                        node.destroy();
                    }
                }
            }
            // 如果有排除的View实例存在，则显示
            if (exclude && exclude.length > 0) {
                this._navViews.push(...exclude);
                this.showView(this._navViews[this._navViews.length - 1]);
            } else {
                this._onViewChanged();
            }
        }
    },
    getView (name) {
        for (var i = this._navViews.length - 1; i >= 0; i--) {
            var node = this._navViews[i];
            if (node == null || cc.isValid(node) == false || node.__gdk_inPool__) {
                this._navViews.splice(i, 1);
                continue;
            }
            if (node.name == name) {
                return node;
            }
        }
        return null;
    },


    ///////  工具提示   //////
    showNodeToolTip (text, node, gap = 20, isUpFrist = true) {
        var pos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        pos = this.layers.toolTipLayer.convertToNodeSpaceAR(pos);
        return this.showToolTip(text, pos.x, pos.y, gap, isUpFrist);
    },
    showToolTip (text, x, y, gap = 20, isUpFrist = true) {
        if (this.hasToolTip() == false) {
            var node = this._createPrefabOrNode(this.toolTipPrefab);
            if (node)
                this._toolTipUI = node.getComponent(ToolTip);
        }
        if (this._toolTipUI) {
            if (this._toolTipUI.node.parent != this.layers.toolTipLayer) {
                this._toolTipUI.node.parent = this.layers.toolTipLayer;
                NodeTool.show(this._toolTipUI.node);
                this.layers.toolTipLayer.on("touchstart", this._toolTipLayerTouch, this);
            }
            this._toolTipUI.text = text;

            this._toolTipUI.node.setPosition(NodeTool.getPosInBox(this._toolTipUI.node, x, y, gap, isUpFrist));
        }
        return this._toolTipUI;

    },
    hideToolTip () {
        if (this.hasToolTip()) {
            if (NodeTool.hide(this._toolTipUI.node) == null)
                this._toolTipUI = null;
            this.layers.toolTipLayer.off("touchstart", this._toolTipLayerTouch, this);
        }
    },
    hasToolTip () {
        if (this._toolTipUI == null || cc.isValid(this._toolTipUI.node) == false || this._toolTipUI.__gdk_inPool__)
            return false;
        return true;
    },
    _toolTipLayerTouch (e) {
        if (this.hasToolTip()) {
            if (e.target != this._toolTipUI.node && e.target.isChildOf(this._toolTipUI.node) == false)
                this.hideToolTip();
        } else
            this.layers.toolTipLayer.off("touchstart", this._toolTipLayerTouch, this);
    },

    ///////  引导   //////
    addGuide (prefabOrNode) {
        var node = this._createPrefabOrNode(prefabOrNode);
        if (node) {
            node.parent = this.layers.guideLayer;
        }
    },
    ///////  调试层   //////
    addDebug (prefabOrNode) {
        var node = this._createPrefabOrNode(prefabOrNode);
        if (node) {
            node.parent = this.layers.debugLayer;
        }
    },

    /////   锁屏    ///////

    lockScreen (timeout = 0) {
        if (this._lockScreen == null) {
            this._lockScreen = new cc.Node();
            this._lockScreen.addComponent(cc.BlockInputEvents);
            var size = cc.director.getWinSize()
            this._lockScreen.width = size.width * 2;
            this._lockScreen.height = size.height * 2;
            this._lockScreen.on("click", function () {
                this.onLockScreenClick.emit();
            }, this);
        }
        if (this._lockScreen.parent != this.layers.systemPopLayer)
            this._lockScreen.parent = this.layers.systemPopLayer;
        NodeTool.bringTop(this._lockScreen);
        if (timeout > 0) {
            DelayCall.addCall(this.unLockScreen, this, timeout);
        }
    },
    unLockScreen () {
        if (this._lockScreen && this._lockScreen.parent) {
            this._lockScreen.removeFromParent(false);
        }
    },
    isScreenLock () {
        return this._lockScreen && this._lockScreen.active;
    },
    _createPrefabOrNode (prefabOrNode) {
        if (prefabOrNode == null) {
            return null;
        }
        var node;
        if (prefabOrNode instanceof cc.Node) {
            if (cc.isValid(prefabOrNode)) {
                node = prefabOrNode;
            }
        } else {
            let key = prefabOrNode.name + "#" + prefabOrNode.data._prefab.fileId;
            node = PoolManager.getCacheOrPool(key);
            if (node == null) {
                node = cc.instantiate(prefabOrNode);
                node.name = prefabOrNode.name;
            }
        }
        return node;
    },
};

module.exports = Tool.getSingleton(GUIManager);