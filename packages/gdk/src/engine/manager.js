/** 
 * 自动合图管理器优化
 * @Author: sthoo.huang  
 * @Date: 2020-05-23 14:55:12 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-06 11:39:19
 */
const Atlas = cc.dynamicAtlasManager.Atlas;

let _atlases = [];
let _atlasIndex = -1;
let _debugNode = null;

function newAtlas () {
    let atlas = _atlases[++_atlasIndex]
    if (!atlas) {
        let size = cc.dynamicAtlasManager.textureSize;
        atlas = new Atlas(size, size);
        _atlases.push(atlas);
    }
    return atlas;
};

/**
 * !#en Manage Dynamic Atlas Manager. Dynamic Atlas Manager is used for merging textures at runtime, see [Dynamic Atlas](https://docs.cocos.com/creator/manual/en/advanced-topics/dynamic-atlas.html) for details.
 * !#zh 管理动态图集。动态图集用于在运行时对贴图进行合并，详见 [动态合图](https://docs.cocos.com/creator/manual/zh/advanced-topics/dynamic-atlas.html)。
 * @class DynamicAtlasManager
 */
let dynamicAtlasManager = {

    /**
     * url对应的纹理资源是否在动态图集中
     * @param {string} url 
     */
    hasInfo (url) {
        for (let i = _atlases.length - 1; i >= 0; i--) {
            let atlas = _atlases[i];
            if (atlas && atlas.hasInfo(url)) {
                return true;
            }
        }
        return false;
    },

    /**
     * 获得url驿应的纹理资源信息
     * @param {string} url 
     */
    getInfo (url) {
        for (let i = _atlases.length - 1; i >= 0; i--) {
            let atlas = _atlases[i];
            if (atlas) {
                let info = atlas.getInfo(url);
                if (info) {
                    return info;
                }
            }
        }
        return null;
    },

    /**
     * !#en Append a sprite frame into the dynamic atlas.
     * !#zh 添加碎图进入动态图集。
     * @method insertSpriteFrame
     * @param {SpriteFrame} spriteFrame 
     */
    insertSpriteFrame (spriteFrame) {
        if (CC_EDITOR) return null;

        if (!this.enabled) return null;
        if (!spriteFrame || !spriteFrame._texture || spriteFrame._original) return null;
        if (!spriteFrame._texture.packable) return null;
        // 已经包含在已有图集中
        for (let i = _atlases.length - 1; i >= 0; i--) {
            if (_atlases[i].hasInfo(spriteFrame)) {
                let atlas = _atlases[i];
                return atlas.insertSpriteFrame(spriteFrame);
            }
        }
        // 在已有图集中查找合适的位置插入纹理
        for (let i = _atlases.length - 1; i >= 0; i--) {
            let atlas = _atlases[i];
            let frame = atlas.insertSpriteFrame(spriteFrame);
            if (frame) {
                return frame;
            }
        }
        // 创建新的图集插入纹理
        if (_atlasIndex < this.maxAtlasCount) {
            let atlas = newAtlas();
            return atlas.insertSpriteFrame(spriteFrame);
        }
        // 动态插入纹理失败
        return null;
    },

    /** 
     * !#en Resets all dynamic atlas, and the existing ones will be destroyed.
     * !#zh 重置所有动态图集，已有的动态图集会被销毁。
     * @method reset
     */
    reset () {
        let arr = _atlases;
        _atlasIndex = -1;
        _atlases = [];
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i].destroy();
        }
    },

    deleteAtlasSpriteFrame (spriteFrame) {
        if (!spriteFrame._original) return;
        for (let i = _atlases.length - 1; i >= 0; i--) {
            _atlases[i].deleteInnerSpriteFrame(spriteFrame);
            if (_atlases[i].isEmpty()) {
                _atlases[i].destroy();
                _atlases.splice(i, 1);
                _atlasIndex--;
            }
        }
    },

    deleteAtlasTexture (texture) {
        if (!texture) return;
        for (let i = _atlases.length - 1; i >= 0; i--) {
            _atlases[i].deleteInnerTexture(texture);
            if (_atlases[i].isEmpty()) {
                _atlases[i].destroy();
                _atlases.splice(i, 1);
                _atlasIndex--;
            }
        }
    },

    /**
     * !#en Displays all the dynamic atlas in the current scene, which you can use to view the current atlas state.
     * !#zh 在当前场景中显示所有动态图集，可以用来查看当前的合图状态。
     * @method showDebug
     * @param {Boolean} show
     */
    showDebug: CC_DEBUG && function (show) {
        if (show) {
            if (!_debugNode || !_debugNode.isValid) {
                let width = cc.visibleRect.width;
                let height = cc.visibleRect.height;

                _debugNode = new cc.Node('DYNAMIC_ATLAS_DEBUG_NODE');
                _debugNode.zIndex = cc.macro.MAX_ZINDEX;
                _debugNode.setPosition(0, 0);
                _debugNode.setContentSize(width, height);

                let scrollNode = new cc.Node('SCROLLVIEW');
                scrollNode.anchorX = 0;
                scrollNode.anchorY = 1;
                scrollNode.setPosition(-width / 2, height / 2);
                scrollNode.setContentSize(width, height);
                scrollNode.parent = _debugNode;

                let content = new cc.Node('CONTENT');
                let layout = content.addComponent(cc.Layout);
                layout.type = cc.Layout.Type.VERTICAL;
                layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
                layout.spacingY = 5;

                content.anchorX = 0;
                content.anchorY = 1;
                content.setPosition(0, 0);
                content.setContentSize(this.textureSize, 100);
                content.parent = scrollNode;

                let scroll = scrollNode.addComponent(cc.ScrollView);
                scroll.content = content;

                for (let i = 0; i <= _atlasIndex; i++) {
                    let node = new cc.Node('ATLAS');
                    node.anchorX = 0;
                    node.anchorY = 1;
                    node.parent = content;

                    // let texture = _atlases[i]._texture;
                    let spriteFrame = new cc.SpriteFrame();
                    spriteFrame.setTexture(_atlases[i]._texture);

                    let sprite = node.addComponent(cc.Sprite);
                    sprite.spriteFrame = spriteFrame;
                }

                gdk.gui.addPopup(_debugNode, true, null, pop => {
                    pop.isTouchMaskClose = true;
                });
            }
        } else {
            if (_debugNode) {
                _debugNode.parent = null;
                _debugNode = null;
            }
        }
    },

    update () {
        if (!this.enabled) return;
        for (let i = 0; i <= _atlasIndex; i++) {
            _atlases[i].update();
        }
    },

    size: function () {
        return _atlases.length;
    },

    info: CC_DEBUG && function () {
        cc.log('atlas size:', _atlases.length);
        for (let i = _atlases.length - 1; i >= 0; i--) {
            _atlases[i].info();
        }
    },
};

// 替换原代码
for (let key in dynamicAtlasManager) {
    cc.dynamicAtlasManager[key] = dynamicAtlasManager[key];
}