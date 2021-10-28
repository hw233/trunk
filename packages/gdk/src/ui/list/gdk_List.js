var NodeTool = require("../../Tools/gdk_NodeTool");
var BaseList = require("./gdk_BaseList");
/**
 * 列表项
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-03-21 14:33:20
 */
var List = cc.Class({
    extends: BaseList,

    editor: {
        menu: 'gdk(UI)/List',
        disallowMultiple: false,
    },

    removeRenererAfter (index) {
        var len = this._itemRenderers.length;
        if (index >= len) return;
        for (var i = index; i < len; i++) {
            var renderer = this._itemRenderers[i];
            NodeTool.hide(renderer.node, false);
        }
        this._itemRenderers.length = index;
    },
    updateRenderer (index) {
        var renderer = this._itemRenderers[index];
        if (renderer == null) {
            renderer = this.getRenderer();
            renderer.node.parent = this.node;
            this._itemRenderers[index] = renderer;
        }
        renderer._setData(this, index, this._datas[index], this._selectIndexs.indexOf(index) != -1);
        NodeTool.show(renderer.node);
    }
});

module.exports = List;