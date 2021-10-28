/**
 * 
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 14:27:36
 */
var TextSizeLayout = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/TextSizeLayout',
        disallowMultiple: false,
        requireComponent: cc.Label
    },
    properties: {

        _sizeParent: {
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
        _offsetW: 0,
        _offsetH: 0,
        _isChanging: false,
        _isLoaded: false,
    },
    onLoad() {
        if (this._sizeParent == null)
            this._sizeParent = this.node.parent;
        this._offsetW = this._sizeParent.width - this.node.width;
        this._offsetH = this._sizeParent.height - this.node.height;

        this._label = this.node.getComponent(cc.Label);
        this._isLoaded = true;
        this.updateSize();
        this.node.on('size-changed', this.updateSize, this);
    },

    updateSize() {
        if (this._isChanging || this._isLoaded == false)
            return;
        this._isChanging = true;
        this._label.overflow = cc.Label.Overflow.NONE;

        if (this.node.width > this._maxWidth) {
            this._label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.node.width = this._maxWidth;

        } else if (this.node.width < this._minWidth) {
            this._label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.node.width = this._minWidth;
        }

        this._sizeParent.width = this.node.width + this._offsetW;
        this._sizeParent.height = this.node.height + this._offsetH;
        this._isChanging = false;
    },


});

module.exports = TextSizeLayout;