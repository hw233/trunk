var Timer = require('../core/gdk_Timer');
var BatchChildrenRender = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/BatchChildrenRender',
        disallowMultiple: true,
        executeInEditMode: false,
    },

    properties: {

    },

    onEnable () {
        this.node.___batch_children_render___ = true;
        this.node.on('child-added', this._updateRenderFlag, this);
        this.node.on('child-removed', this._updateRenderFlag, this);
    },
    onDisable () {
        delete this.node.___batch_children_render___;
        this.node.targetOff(this);
        Timer.clearAll(this);
    },

    _updateRenderFlag () {
        Timer.once(100, this, this._updateRenderFlagLater);
    },
    _updateRenderFlagLater () {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.node['setLocalDirty'](cc.Node._LocalDirtyFlag.ALL_POSITION);
    },
});

module.exports = BatchChildrenRender;