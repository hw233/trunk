var NodeTool = require("../../Tools/gdk_NodeTool");

/**
 * 关闭按钮
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-30 19:48:07
 */
var CloseButton = cc.Class({
    extends: require("./gdk_SoundButton"),
    editor: {
        menu: 'gdk(Button)/CloseButton',
        disallowMultiple: false,
    },

    properties: {
        target: {
            default: null,
            type: cc.Node,
            tooltip: CC_DEV && "可以为空，如果没配置则默认关闭父级。"
        }
    },

    onClick () {
        // 调用super的方法
        let _super = cc.js.getSuper(this.__proto__.constructor);
        if (_super && _super.prototype && _super.prototype.onClick) {
            _super.prototype.onClick.call(this);
        }
        // this._super();
        NodeTool.hide(this.target || this.node.parent);
    },
});

module.exports = CloseButton;