var NodeTool = require("../../Tools/gdk_NodeTool");
var PanelId = require("../../enums/gdk_PanelId");
var PanelManager = require("../../managers/gdk_PanelManager");
/**
 * 打开面板按钮
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-30 19:48:18
 */
var OpenPanelButton = cc.Class({
    extends: require("./gdk_SoundButton"),
    editor: {
        menu: 'gdk(Button)/OpenPanelButton',
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
        _onLoad: {
            default: "",
            visible: true,
            tooltip: CC_DEV && "onLoad后触发，格式为:组件名:方法或属性名:参数,如:MyComponent:setTabIndex:1"
        },
    },

    onClick () {
        // 调用super的方法
        let _super = cc.js.getSuper(this.__proto__.constructor);
        if (_super && _super.prototype && _super.prototype.onClick) {
            _super.prototype.onClick.call(this);
        }
        // this._super();
        if (this._onLoad) {
            PanelManager.open(this._panelName, (panel) => {
                if (panel) {
                    let arr = this._onLoad.split(":");
                    let comName = arr[0];
                    let fun = arr[1];
                    let param = arr[2];
                    let params = param.split(",");
                    var coms = panel.getComponents(comName);
                    for (let i = 0; i < coms.length; i++) {
                        let com = coms[i];
                        if (fun in com) {
                            if (com[fun] instanceof Function) {
                                com[fun].apply(com, params);
                            } else {
                                com[fun] = param;
                            }
                        }
                    }
                }
            }, this);
        } else {
            PanelManager.open(this._panelName);
        }
    }
});

module.exports = OpenPanelButton;