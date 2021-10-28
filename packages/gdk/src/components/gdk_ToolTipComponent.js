var GUIManager = require("../managers/gdk_GUIManager");

var ShowMode = cc.Enum({
    Holp: 0,
    Click: 1,
});

/**
 * 工具提示组件
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 13:28:21
 */
var ToolTipComponent = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/ToolTipComponent',
        disallowMultiple: false
    },
    properties: {
        isUpFrist: {
            default: true,
            tootTip: "优先向上",
        },
        gapIsSelfBox: {
            default: true,
            tootTip: "",
        },
        gap: {
            default: 0,
            tootTip: "间隔",
        },
        showMode: {
            default: ShowMode.Holp,
            type: ShowMode,
            tootTip: "手指离开消失",
        },
        isTouchEndHide: {
            default: true,
            tootTip: "手指离开消失",
        },
        text: {
            default: "",
            multiline: true,
            tootTip: "提示内容",
        },
        _pressed: false,
        _isShow: false,
    },
    statics: {
        longPressTime: 0.5,
        ShowMode: ShowMode,
    },
    onEnable() {
        if (this.showMode == ShowMode.Holp) {
            this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
            this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onTouchBegan, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnded, this);
            this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onTouchEnded, this);
        } else {
            this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchClick, this);
        }
    },
    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchClick, this);
    },
    _onTouchClick(event) {
        var gap = this.gap;
        if (this.gapIsSelfBox)
            gap = this.node.height / 2;
        GUIManager.showNodeToolTip(this.text, this.node, gap, this.isUpFrist);
    },
    _onTouchBegan(event) {
        this._pressed = true;
        if (this._isShow == false)
            this.scheduleOnce(this._showTip, ToolTipComponent.longPressTime);
    },
    _onTouchEnded(event) {
        if (this._pressed) {
            if (this._isShow) {
                if (this.isTouchEndHide)
                    GUIManager.hideToolTip();
            } else
                this.unschedule(this._showTip);
        }
        this._isShow = false;
        this._pressed = false;
    },
    _showTip() {
        if (this._pressed) {
            this._isShow = true;
            var gap = this.gap;
            if (this.gapIsSelfBox) {
                gap = this.node.height / 2;
            }
            GUIManager.showNodeToolTip(this.text, this.node, gap, this.isUpFrist);
        }
    }
});

module.exports = ToolTipComponent;