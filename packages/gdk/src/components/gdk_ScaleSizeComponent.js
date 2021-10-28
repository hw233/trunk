const SizeType = require("../const/gdk_SizeType");
const SizeTool = require("../Tools/gdk_SizeTool");
const NodeTool = require("../Tools/gdk_NodeTool");
/**
 * 比例缩放组件
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 13:27:18
 */
var ScaleSizeComponent = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/ScaleSizeComponent',
        disallowMultiple: false
    },
    properties: {

        _sizeOnce: {
            default: true,
            tootTip: CC_EDITOR && "只在onEnable时触发一次，后面父级大小改变时不再响应",
            visible: true
        },
        sizeOnce: {
            get() {
                return this._sizeOnce;
            },
            set(value) {
                if (value == this._sizeOnce)
                    return;
                this._sizeOnce = value;
                this._updateListener();
            },
            visible: false
        },
        isScale: {
            default: false,
            tootTip: CC_EDITOR && "通过scaleX，scaleY来缩放，还是width,height来缩放",
            visible: true
        },
        type: {
            default: SizeType.NONE,
            type: SizeType,
        }

    },
    ctor() {
        this._once = false;
        this._enable = false;
    },

    onEnable() {
        this._enable = true;
        this._updateListener();
        if (!this._once) {
            NodeTool.callBeforeDraw(this.updateSize, this);
        }
    },
    onDisable() {
        this._listenerOff();
    },
    updateSize() {
        if (!this._enable)
            return;
        this._once = true;
        let parent = this.node.parent;
        let node = this.node;
        if (parent) {
            var parentSize = parent.getContentSize();
            var mySize = node.getContentSize();
            var newSzie = cc.size(mySize.width, mySize.height);
            mySize.width = node.scaleX * mySize.width;
            mySize.height = node.scaleY * mySize.height;
            SizeTool.size(newSzie, parentSize, this.type);

            if (this.isScale) {
                node.scaleX = newSzie.width / mySize.width;
                node.scaleY = newSzie.height / mySize.height;
            } else {
                newSzie.width = newSzie.width / node.scaleX;
                newSzie.height = newSzie.height / node.scaleY;
                node.setContentSize(newSzie);
            }
        }
    },
    _updateListener() {
        if (this._sizeOnce || this._enable == false)
            this._listenerOff();
        else
            this._listenerOn();
    },
    //监听节点顺序变化
    _listenerOn() {
        if (this._parent != this.node.parent) {
            if (this._parent) {
                this._listenerOff();
            }
            if (this.node.parent) {
                this._parent = this.node.parent;
                this._parent.on("size-changed", this._updateSize, this);
                this._parent.on("child-removed", this._onParentChildRemoved, this);
            }
        }
    },
    //不监听节点顺序变化
    _listenerOff() {
        if (this._parent) {
            this._parent.off("size-changed", this._updateSize, this);
            this._parent.off("child-removed", this._onParentChildRemoved, this);
        }
        this._parent = null;
    },
    _onParentChildRemoved() {
        if (this._parent != this.node.parent) {
            this._listenerOff();
            this._updateMask();
            this._listenerOn();
        }
    },
    _updateSize() {
        NodeTool.callAfterUpdate(this.updateSize, this);
    }
});

module.exports = ScaleSizeComponent;