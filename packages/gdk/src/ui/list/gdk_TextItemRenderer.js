var ItemRenderer = require("./gdk_ItemRenderer");
var i18n = require("../../Tools/gdk_i18n");
/**
 * 列表项
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 13:33:13
 */
var TextItemRenderer = cc.Class({
    extends: ItemRenderer,

    editor: {
        menu: 'gdk(UI)/TextItemRenderer',
        disallowMultiple: false,
    },
    properties: {
        _label: {
            default: null,
            type: cc.Label,
            serializable: true,
            visible: true,
        }

    },

    updateView() {
        this._label.string = i18n.t(this.data);
    },
});

module.exports = TextItemRenderer;