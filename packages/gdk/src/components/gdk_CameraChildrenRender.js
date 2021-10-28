/**
 * 使用摄像头渲染到图片，以减少静态时drawcall数量
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-13 17:37:46
 */
let CameraChildrenRender = null;
if (CC_JSB) {
    // 针对原生不优化
    CameraChildrenRender = cc.Class({
        extends: cc.Component,
        editor: {
            menu: 'gdk(Component)/CameraChildrenRender',
            disallowMultiple: true,
            executeInEditMode: false,
        },

        properties: {
            _target: {
                default: null,
                type: cc.Node
            },
            target: {
                get() {
                    return this._target;
                },
                set(value) {
                    this._target = value;
                },
                animatable: false,
                type: cc.Node,
                tooltip: CC_DEV && '优化目标节点'
            },
            content: cc.Node,
            sprite: cc.Sprite,
            camera: cc.Camera,
        },
    });
} else {

    function isDirty (node) {
        // if (node._worldMatDirty || node._reorderChildDirty) return true;
        let comp = node.getComponent(cc.RenderComponent);
        if (comp && comp.isValid && comp.enabledInHierarchy && comp._inValidateList) {
            return true;
        }
        // 子对象
        let a = node._children;
        let n = a.length;
        for (let i = 0; i < n; i++) {
            let c = a[i];
            if (!c._activeInHierarchy || c._opacity === 0 || c._$N_visible === false) continue;
            if (!isDirty(c)) continue;
            return true;
        }
        return false;
    }

    CameraChildrenRender = cc.Class({
        extends: cc.Component,
        editor: {
            menu: 'gdk(Component)/CameraChildrenRender',
            disallowMultiple: true,
            executeInEditMode: false,
        },

        properties: {
            _target: {
                default: null,
                type: cc.Node
            },
            target: {
                get() {
                    return this._target;
                },
                set(value) {
                    if (value === this._target) return;
                    if (this.enabledInHierarchy) {
                        this._updateTarget(value);
                        this._target = value;
                    } else {
                        this._target = value;
                    }
                },
                animatable: false,
                type: cc.Node,
                tooltip: CC_DEV && '优化目标节点'
            },
            content: cc.Node,
            sprite: cc.Sprite,
            camera: cc.Camera,
        },

        onEnable () {
            this.renderTexture = new cc.RenderTexture();
            this.renderTexture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.game._renderContext.STENCIL_INDEX8);
            if (!this.content) {
                this.content = new cc.Node("___CameraChildrenRender___");
                this.content.scaleY = -1;
                this.content.parent = this.node;
            }
            this.content.active = false;
            if (!this.sprite) {
                this.sprite = this.content.getComponent(cc.Sprite);
                if (!this.sprite) {
                    this.sprite = this.content.addComponent(cc.Sprite);
                }
            }
            this.sprite.spriteFrame = new cc.SpriteFrame(this.renderTexture);
            if (!this.camera) {
                let camera = this.node.addComponent(cc.Camera);
                camera.backgroundColor = cc.color(0, 0, 0, 0);
                camera.clearFlags = 7;
                camera.depth = -1;
                this.camera = camera;
            }
            this.camera.enabled = false;
            this._updateTarget(this._target);
        },
        onDisable () {
            if (this.sprite) {
                this.sprite.spriteFrame && this.sprite.spriteFrame.destroy();
                this.sprite.destroy();
            }
            this.renderTexture && this.renderTexture.destroy();
            this.content && this.content.destroy();
            this.camera && this.camera.destroy();
            this.sprite = null;
            this.renderTexture = null;
            this.content = null;
            this.camera = null;
            this._isNodeDirty = false;
            this._updateTarget(null);
        },

        _updateTarget (node) {
            let lastNode = this._target;
            if (lastNode && lastNode !== node) {
                delete lastNode._$N_visible;
                lastNode.targetOff(this);
                cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
            }
            if (node) {
                // evnets
                [
                    cc.Node.EventType.CHILD_ADDED,
                    cc.Node.EventType.CHILD_REMOVED,
                    cc.Node.EventType.POSITION_CHANGED,
                    cc.Node.EventType.SIZE_CHANGED,
                    cc.Node.EventType.SCALE_CHANGED,
                ].forEach(type => {
                    node.on(type, () => this._isNodeDirty = true, this, true);
                });
                node._$N_visible = false;
                cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
            }
        },

        _beforeDraw () {
            if (!cc.isValid(this.node)) return;
            if (!this.enabledInHierarchy) return;
            if (this._isNodeDirty || isDirty(this._target)) {
                this._isNodeDirty = false;
                this.content.active = false;
                this._target._$N_visible = true;
                this.renderTexture.updateSize(cc.visibleRect.width, cc.visibleRect.height);
                this.camera.targetTexture = this.renderTexture;
                this.camera.enabled = true;
                this.camera.render(this._target);
                this.camera.renderTexture = null;
                this.camera.enabled = false;
                this._target._$N_visible = false;
                this.content.active = true;
            }
        },
    });
}

module.exports = CameraChildrenRender;