var GUIManager = require("../../managers/gdk_GUIManager");
/**
 * 打开面板按钮
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-30 19:48:00
 */
var AddPopupButton = cc.Class({
    extends: require("./gdk_SoundButton"),
    editor: {
        menu: 'gdk(Button)/AddPopupButton',
        disallowMultiple: false,
    },

    properties: {
        prefab: {
            default: null,
            type: cc.Prefab,
        },
        isMask: true
    },

    onClick () {
        // 调用super的方法
        let _super = cc.js.getSuper(this.__proto__.constructor);
        if (_super && _super.prototype && _super.prototype.onClick) {
            _super.prototype.onClick.call(this);
        }
        // this._super();
        GUIManager.addPopup(this.prefab, this.isMask);
    },
});

module.exports = AddPopupButton;