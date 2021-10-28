/**
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 14:21:49
 */

var ChangeSceneUnDestroyComponent = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(Component)/ChangeSceneUnDestroyComponent',
        disallowMultiple: false
    },
    properties: {
        _isDestroy: {
            default: false,
            visible: true,
        },
        isDestroy: {
            get() {
                return this._isDestroy;
            },
            set(value) {
                if (value == this._isDestroy) {
                    return;
                }
                this._isDestroy = value;
                this.uddateView();
            },
            visible: false
        }
    },
    onLoad() {
        this.uddateView();
    },
    onDestroy() {
        this._isDestroy = false;
        this.uddateView();
    },
    uddateView() {
        this.node.__gdk__persistNode__ = !this.isDestroy;
        if (this.isDestroy) {
            if (this.node._persistNode) {
                cc.game.removePersistRootNode(this.node);
            }
        } else {
            if (!this.node._persistNode) {
                var scene = cc.director._scene;
                if (this.node.parent == scene) {
                    cc.game.addPersistRootNode(this.node);
                    if (this.node.__gdk___onHierarchyChanged == null) {
                        this.node.__gdk___onHierarchyChanged = this.node._onHierarchyChanged;
                    }
                    this.node._onHierarchyChanged = this._onHierarchyChanged;
                }
            }
        }
    },

    _onHierarchyChanged(oldParent) {
        if (!this._persistNode) {
            this.__gdk___onHierarchyChanged(oldParent);
        }
    },
});

module.exports = ChangeSceneUnDestroyComponent;