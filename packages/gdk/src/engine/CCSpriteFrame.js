/** 
 * 针对纹理帧资源的优化
 * @Author: sthoo.huang  
 * @Date: 2020-05-23 11:25:47 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-30 17:48:21
 */

if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {

    var dynamicAtlasManager = cc.dynamicAtlasManager;
    // 对纹理帧资源的内存占用优化
    var SpriteFrame = cc.SpriteFrame;
    var __proto = SpriteFrame.prototype;

    /**
     * !#en Returns the texture of the frame.
     * !#zh 获取使用的纹理实例
     * @method getTexture
     * @return {Texture2D}
     */
    __proto.getTexture = function () {
        if (!this._original && this._texture && this._texture.loaded) {
            if (this._texture.isInAtals) {
                // 已经在动态图集中，但是没有处理完成
                let frame = dynamicAtlasManager.insertSpriteFrame(this);
                let w = frame.width,
                    h = frame.height;
                if (!this._rect) {
                    this._rect = cc.rect(0, 0, w, h);
                }
                if (!this._originalSize) {
                    this.setOriginalSize(cc.size(w, h));
                }
                if (!this._offset) {
                    this.setOffset(cc.v2(0, 0));
                }
                this._setDynamicAtlasFrame(frame);
            } else if (this._texture.packable) {
                // 不在动态图集中，加载完成，允许合图
                let frame = dynamicAtlasManager.insertSpriteFrame(this);
                if (frame) {
                    this._setDynamicAtlasFrame(frame);
                }
            }
        }
        return this._texture;
    };

    __proto.textureLoaded = function () {
        if (!this._texture || !this._texture.loaded) {
            return false;
        }
        if (!this._original && this._texture.isInAtals) {
            return !!this.getTexture();
        }
        return true;
    };

    __proto.$SpriteFrame0_textureLoadedCallback = __proto._textureLoadedCallback;
    __proto._textureLoadedCallback = function () {
        let texture = this._texture;
        if (!texture) {
            // clearTexture called while loading texture...
            return;
        }
        // 已经在动态图集中的处理
        if (texture.isInAtals) {
            this.getTexture();
            this.emit("load");
            return;
        }
        // 不在动态图集中并允许合图
        if (!this._original && texture.packable) {
            let w = texture.width,
                h = texture.height;
            if (this._rect) {
                this._checkRect(texture);
            } else {
                this._rect = cc.rect(0, 0, w, h);
            }
            if (!this._originalSize) {
                this.setOriginalSize(cc.size(w, h));
            }
            if (!this._offset) {
                this.setOffset(cc.v2(0, 0));
            }
            this._calculateUV();
            // 插入至动态图集
            let frame = dynamicAtlasManager.insertSpriteFrame(this);
            if (frame) {
                this._setDynamicAtlasFrame(frame);
            }
            this.emit("load");
            return;
        }
        // 原加载完成回调处理函数
        this.$SpriteFrame0_textureLoadedCallback();
    };

    __proto.$SpriteFrame0_setDynamicAtlasFrame = __proto._setDynamicAtlasFrame;
    __proto._setDynamicAtlasFrame = function (frame) {
        if (!frame) return;
        this.$SpriteFrame0_setDynamicAtlasFrame(frame);
        // 销毁源图的gpu纹理资源
        let texture2d = this._original._texture;
        if (texture2d) {
            texture2d.isInAtals = true;
            // 有纹理资源路径
            if (texture2d.nativeUrl) {
                texture2d._texture && texture2d._texture.destroy();
                texture2d._image && texture2d._clearImage(false);
                texture2d._texture = null;
                texture2d._image = null;
            } else if (texture2d._image) {
                // 有纹理图片时
                texture2d._texture && texture2d._texture.destroy();
                texture2d._texture = null;
            }
        }
    };

    // __proto.$SpriteFrame0_resetDynamicAtlasFrame = __proto._resetDynamicAtlasFrame;
    __proto._resetDynamicAtlasFrame = function (fromAtlas = false) {
        if (!this._original) return;
        if (!fromAtlas) {
            // 从动态图集中删除
            dynamicAtlasManager.deleteAtlasSpriteFrame(this);
        } else {
            // 重置原始纹理
            this._rect.x = this._original._x;
            this._rect.y = this._original._y;
            this._texture = this._original._texture;
            this._original = null;
            if (this._texture.nativeUrl && !this._texture._texture && !this._texture._image) {
                // 重新加载纹理
                this._texture.loaded = false;
                this._texture.isInAtals = null;
                this._textureFilename = this._texture.nativeUrl;
            } else if (this._texture._image) {
                // 重新上传纹理图片
                this._texture.loaded = true;
                this._texture.isInAtals = null;
                this._texture.initWithElement(this._texture._image);
                this._calculateUV();
            }
        }
    };

    /**
     * 销毁CCSpriteFrame资源时，如果此资源已经插入到动态图集，则从动态图集中移除
     */
    __proto.$SpriteFrame0_destroy = __proto.destroy;
    __proto.destroy = function () {
        this._original && dynamicAtlasManager.deleteAtlasSpriteFrame(this);
        this.$SpriteFrame0_destroy && this.$SpriteFrame0_destroy();
    };
}