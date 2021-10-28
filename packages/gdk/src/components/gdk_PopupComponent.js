const EventTrigger = require("../core/gdk_EventTrigger");
const PoolManager = require("../managers/gdk_PoolManager");
const NodeTool = require("../Tools/gdk_NodeTool");

const _defaultMaskColor = cc.color(0, 0, 0, 255 * 0.5);
const _popupDic = cc.js.createMap(true);
const POOL_NAME = '__gdk_popup__Mask';

/**
 * 弹出窗组件
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-07-16 16:52:06
 */

var PopupComponent = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/PopupComponent',
        disallowMultiple: false
    },
    properties: {
        /**
         * 是否模态
         * @property {booble} isMask
         */
        _isMask: {
            default: false,
            visible: true,
            serializable: true,
        },
        isMask: {
            visible: false,
            get() {
                return this._isMask;
            },
            set(value) {
                if (this._isMask == value) {
                    return;
                }
                this._isMask = value;
                this._updateMask();
            }
        },
        /**
         * 模态遮罩颜色
         * @property {cc.color} maskColor
         */
        _maskColor: {
            default: _defaultMaskColor,
            visible: true,
            serializable: true,
        },
        maskColor: {
            visible: false,
            get() {
                return this._maskColor;
            },
            set(value) {
                if (this._maskColor == value) {
                    return;
                }
                this._maskColor = value;
                this._setMaskColor(this._maskColor);
            }
        },
        maskAlpha: {
            get() {
                return this._maskColor.a;
            },
            set(value) {
                if (this._maskColor.a == value)
                    return;
                this._maskColor.a = value;
                this._setMaskColor(this._maskColor);
            }
        },
        /**
         * 是否点击遮罩关闭
         * @property {booble} isTouchMaskClose
         */
        isTouchMaskClose: {
            visible: true,
            default: false,
        },
        /**
         * 是否点击面板提前
         * @property {booble} isTouchBringTop
         */
        _isTouchBringTop: {
            default: false,
            visible: true,
            serializable: true,
        },
        isTouchBringTop: {
            visible: false,
            get() {
                return this._isTouchBringTop;
            },
            set(value) {
                if (this._isTouchBringTop == value) {
                    return;
                }
                this._isTouchBringTop = value;
                this._updateTouchBringTop()
            }
        },
        /**
         * 点遮罩事件
         * @property {EventTrigger} onMaskClick
         * @event
         */
        onMaskClick: {
            default: null,
            serializable: false,
            visible: false,
        },

        //私有
        _mask: null,
        _isOrderMasking: false,
        _parent: null,
    },
    statics: {
        _popupDic: _popupDic,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor () {
        this.onMaskClick = EventTrigger.get();
        this._isEnable = true;
    },
    onLoad () {
        this._nodeName = this.node.name;
        _popupDic[this._nodeName] = this;
    },

    onEnable () {
        this._isEnable = true;
        if (this._isMask) {
            this._updateMask();
        }
    },
    onDisable () {
        this._isEnable = false;
        if (this._isMask) {
            this._updateMask();
        }
    },
    onDestroy () {
        delete _popupDic[this._nodeName];
        this.onMaskClick.release();
        this.onMaskClick = null;
    },
    reuse () {
        _popupDic[this._nodeName] = this;
    },
    unuse () {
        delete _popupDic[this._nodeName];
        this.isTouchMaskClose = false;
        this._maskColor = _defaultMaskColor;
        this._isTouchBringTop = false;
        this.onMaskClick.offAll();
    },
    /**
     * 设置遮颜色
     * @method setMaskColor
     * @param {cc.cololr} color 
     */
    _setMaskColor (color) {
        if (this._mask) {
            if (this.fillColor == null || this._mask.fillColor.a != color.a ||
                this._mask.fillColor.b != color.b || this._mask.fillColor.g != color.g || this._mask.fillColor.r != color.r) {
                this._mask.clear();
                if (color.a != 0) {
                    var size = cc.winSize;
                    this._mask.rect(-size.width, -size.height, 2 * size.width, 2 * size.height);
                    this._mask.fillColor = color.clone();;
                    this._mask.fill();
                }
            }
        }
    },
    // 更新mask
    _updateMask () {
        NodeTool.callAfterUpdate(this._updateMaskLate, this);
    },
    _updateMaskLate () {
        if (this._isEnable && this._isMask && this.enabled && cc.isValid(this.node)) {
            if (this._mask == null) {
                var node = PoolManager.get(POOL_NAME);
                if (!node) {
                    var size = cc.winSize;
                    node = cc.instantiate(require('../gdk').engine.maskPrefab);
                    node.width = size.width;
                    node.height = size.height;
                    node.setScale(5);
                    node.zIndex = cc.macro.MIN_ZINDEX;
                }
                node.parent = this.node;
                this._mask = node.getComponent(cc.Graphics);
                if (this.maskColor != this._mask.fillColor) {
                    this._setMaskColor(this.maskColor);
                }
                this._mask.node.on("touchend", this._maskOnClick, this);
            }
        } else {
            let mask = this._mask;
            if (mask && cc.isValid(mask.node)) {
                mask.node.off("touchend", this._maskOnClick, this);
                mask.node.parent = null;
                PoolManager.put(POOL_NAME, mask.node);
            }
            this._mask = null;
        }
    },
    _updateTouchBringTop () {
        if (this.isTouchBringTop) {
            this.node.on("touchstart", this._bringTop, this);
        } else {
            this.node.off("touchstart", this._bringTop, this);
        }
    },
    _bringTop () {
        NodeTool.bringTop(this.node);
    },
    _maskOnClick () {
        this.onMaskClick.emit();
        if (this.isTouchMaskClose) {
            var panel = this.node.getComponent(require("../ui/gdk_BasePanel"));
            if (panel) {
                panel.close(-1);
            } else {
                NodeTool.hide(this.node);
            }
        }
    },
});

module.exports = PopupComponent;