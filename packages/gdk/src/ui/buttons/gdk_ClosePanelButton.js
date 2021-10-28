var PanelId = require("../../enums/gdk_PanelId");
var PanelManager = require("../../managers/gdk_PanelManager");
/**
 * 关闭面板按钮
 * @Author: sthoo.huang 
 * @Date: 2019-09-05 13:36:31
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-30 19:48:12
 */
var ClosePanelButton = cc.Class({
    extends: require("./gdk_SoundButton"),
    editor: {
        menu: 'gdk(Button)/ClosePanelButton',
        disallowMultiple: false,
    },

    properties: {
        _panelName: "",
        _panel: {
            get() {
                return PanelId[this._panelName] || 0;
            },
            set(value) {
                this._panelName = PanelId[value];
            },
            type: PanelId,
            visible: true,
            tooltip: CC_DEV && "如果没可选值，请先配置PanelId"
        },
    },

    onClick () {
        // 调用super的方法
        let _super = cc.js.getSuper(this.__proto__.constructor);
        if (_super && _super.prototype && _super.prototype.onClick) {
            _super.prototype.onClick.call(this);
        }
        // this._super();
        PanelManager.hide(this._panelName);
    }
});

module.exports = ClosePanelButton;