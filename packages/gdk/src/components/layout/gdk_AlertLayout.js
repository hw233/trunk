var NodeTool = require("../../Tools/gdk_NodeTool");

/**
 * 
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 13:25:28
 */
var AlertLayout = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/AlertLayout',
        disallowMultiple: false,
    },
    properties: {
        _textField: {
            default: null,
            type: cc.Label,
            serializable: true,
            visible: true,
        },
        _buttonParent: {
            default: null,
            type: cc.Node,
            serializable: true,
            visible: true,
        },

        _maxWidth: {
            default: 0,
            serializable: true,
            visible: true,
        },
        maxWidth: {
            visible: false,
            get: function () {
                return this._maxWidth;
            },
            set: function (value) {
                if (this._maxWidth == value)
                    return;
                this._maxWidth = value;
                this.updateSize();
            }
        },
        _minWidth: {
            default: 0,
            serializable: true,
            visible: true,
        },
        minWidth: {
            visible: false,
            get: function () {
                return this._minWidth;
            },
            set: function (value) {
                if (this._minWidth == value)
                    return;
                this._minWidth = value;
                this.updateSize();
            }
        },
        _maxHeight: {
            default: 0,
            serializable: true,
            visible: true,
        },
        maxHeight: {
            visible: false,
            get: function () {
                return this._maxHeight;
            },
            set: function (value) {
                if (this._maxHeight == value)
                    return;
                this._maxHeight = value;
                this.updateSize();
            }
        },
        _minHeight: {
            default: 0,
            serializable: true,
            visible: true,
        },
        minHeight: {
            visible: false,
            get: function () {
                return this._minHeight;
            },
            set: function (value) {
                if (this._minHeight == value)
                    return;
                this._minHeight = value;
                this.updateSize();
            }
        },
        _offsetW: 0,
        _offsetH: 0,
        _isChanging: false,
        _isLoaded: false,
    },
    onLoad() {

        this._offsetW = this.node.width - this._textField.node.width;
        this._offsetH = this.node.height - this._textField.node.height;
        this._isLoaded = true;
        // this.updateSize();

    },
    onEnable() {
        this._textField.node.on('size-changed', this.updateSize, this);
        this._buttonParent.on('size-changed', this.updateSize, this);
    },
    unuse() {
        this._textField.overflow = cc.Label.Overflow.NONE;
    },
    onDisable() {
        this._textField.node.off('size-changed', this.updateSize, this);
        this._buttonParent.off('size-changed', this.updateSize, this);
    },
    updateSize() {
        if (this._isChanging || this._isLoaded == false)
            return;
        // this.updateSizeLate();
        NodeTool.callBeforeDraw(this.updateSizeLate, this, 0);
    },
    updateSizeLate() {

        if (this._isChanging || this._isLoaded == false)
            return;
        this._isChanging = true;
        this._textField.overflow = cc.Label.Overflow.NONE;
        var h;
        var maxWidth = this._maxWidth - this._offsetW;
        var minWidth = this._minWidth - this._offsetW;

        if (this._textField.node.width > maxWidth && maxWidth > 0) {
            this._textField.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this._textField.node.width = maxWidth;


        } else if (this._textField.node.width < minWidth) {
            this._textField.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this._textField.node.width = minWidth;
        }

        if (this._textField.node.width < this._buttonParent.width)
            this._textField.node.width = this._buttonParent.width;

        var maxHeight = this._maxHeight - this._offsetH;
        var minHeight = this._minHeight - this._offsetH;

        h = this._textField.node.height;
        if (this._textField.node.height > maxHeight && maxHeight > 0) {
            this._textField.overflow = cc.Label.Overflow.SHRINK;
            this._textField.node.height = maxHeight;
            h = maxHeight;

        } else if (this._textField.node.height < minHeight) {
            this._textField.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this._textField.node.height = minHeight;
            h = minHeight;
        }


        //this.node.setContentSize( this._textField.node.width + this._offsetW,this._textField.node.height + this._offsetH);
        this.node.width = this._textField.node.width + this._offsetW;
        this.node.height = h + this._offsetH;
        this._isChanging = false;
    },


});

module.exports = AlertLayout;