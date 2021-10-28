/**
 * gdk 配置入口，挂载到一个prefab配置一下，再运行时加载进来，GDK就可以用了。
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-19 16:42:05
 */
const GUIManager = require("./managers/gdk_GUIManager");
const Pool = require("./core/gdk_Pool");
const MessageMode = require("./const/gdk_MessageMode");
const Timer = require("./core/gdk_Timer");
let gdk_Engine = cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'gdk(Core)/gdk_Engine',
        disallowMultiple: true
    },

    properties: {

        waitingPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: CC_DEV && "信息提示",
        },

        alertPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: CC_DEV && "信息提示",
        },

        messageBgPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: CC_DEV && "信息提示背景",
        },

        messagePrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: CC_DEV && "信息提示",
        },

        toolTipPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: CC_DEV && "信息提示",
        },

        maskPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: CC_DEV && "窗口遮照",
        },

        popupMaskColor: {
            default: new cc.Color(0, 0, 0, 255 * 0.3),
            tooltip: CC_DEV && "弹出窗模态时的遮罩颜色",
        },

        waitingMaskColor: {
            default: new cc.Color(0, 0, 0, 0),
            tooltip: CC_DEV && "等待组件模态遮罩颜色",
        },

        alertMaskColor: {
            default: new cc.Color(0, 0, 0, 255 * 0.3),
            tooltip: CC_DEV && "警告面板模态遮罩颜色",
        },

        alertTitle: {
            default: "",
            tooltip: CC_DEV && "警告面板默认标题",
        },

        alertOk: {
            default: "OK",
            tooltip: CC_DEV && "警告面板默认确定文字",
        },

        alertCancel: {
            default: "Cancel",
            tooltip: CC_DEV && "警告面板默认取消文字",
        },

        messageAutoCloseTime: {
            default: 2,
            type: cc.Float,
            tooltip: CC_DEV && "提示信息多少秒后自己消失.\n单位:秒",
        },

        messageMode: {
            default: 0,
            type: MessageMode,
            tooltip: CC_DEV && "多条提示信息时的显示模式",
        },

        poolClearTime: {
            default: 5 * 60,
            tooltip: CC_DEV && "对象池回收时间间隔.\n单位:秒",
        },

        debugLayer: true,
        systemPopLayer: true,
        loadingLayer: true,
        waitingLayer: true,
        toolTipLayer: true,
        guideLayer: true,
        messageLayer: true,
        popMenuLayer: true,
        popupLayer: true,
        menuLayer: true,
        viewLayer: true,
        floorLayer: true,

        showFsmLog: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var gdk = require('./gdk');
        var layers = GUIManager.layers;
        layers.length = 0;
        this.floorLayer && layers.push("floorLayer");
        this.viewLayer && layers.push("viewLayer");
        this.menuLayer && layers.push("menuLayer");
        this.popupLayer && layers.push("popupLayer");
        this.popMenuLayer && layers.push("popMenuLayer");
        this.messageLayer && layers.push("messageLayer");
        this.guideLayer && layers.push("guideLayer");
        this.toolTipLayer && layers.push("toolTipLayer");
        this.waitingLayer && layers.push("waitingLayer");
        this.loadingLayer && layers.push("loadingLayer");
        this.systemPopLayer && layers.push("systemPopLayer");
        this.debugLayer && layers.push("debugLayer");

        GUIManager.init(this.node);
        GUIManager.waitingPrefab = this.waitingPrefab;
        GUIManager.alertPrefab = this.alertPrefab;
        GUIManager.toolTipPrefab = this.toolTipPrefab;
        GUIManager.messageBgPrefab = this.messageBgPrefab;
        GUIManager.messagePrefab = this.messagePrefab;
        GUIManager.maskPrefab = this.maskPrefab;
        GUIManager.popupMaskColor = this.popupMaskColor;
        GUIManager.waitingMaskColor = this.waitingMaskColor;
        GUIManager.alertMaskColor = this.alertMaskColor;
        GUIManager.alertTitle = this.alertTitle;
        GUIManager.alertOk = this.alertOk;
        GUIManager.alertCancel = this.alertCancel;
        GUIManager.messageAutoCloseTime = this.messageAutoCloseTime;
        GUIManager.messageMode = this.messageMode;
        Pool.clearTime = this.poolClearTime;

        if (gdk.fsm) {
            gdk.fsm.Fsm.isShowLog = CC_DEBUG && this.showFsmLog;
        }
        cc.game.addPersistRootNode(this.node);
        if (gdk.engine) {
            cc.error("gdk_Engine组件只能有一个实例");
        }
        gdk.engine = this;
    },

    onEnable () {
        var canvas = cc.Canvas.instance;
        if (canvas && canvas.node) {
            canvas.node.on("size-changed", this.updateSize, this);
        }
        this.updateSize();
    },

    onDisable () {
        var canvas = cc.Canvas.instance;
        if (canvas && canvas.node) {
            canvas.node.off("size-changed", this.updateSize, this);
        }
    },

    updateSize () {
        Timer.callLater(GUIManager, GUIManager.updateSize);
    },
});

module.exports = gdk_Engine;