/**
 * 修复Sprite组件报错的问题
 * @Author: sthoo.huang 
 * @Date: 2020-01-02 17:20:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-07 14:08:16
 */

if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {
    var Sprite = cc.Sprite;
    var proto = Sprite.prototype;

    proto.$Sprite0_onEnable = proto.onEnable;
    proto.onEnable = function () {
        if (this._spriteFrame && !cc.isValid(this._spriteFrame)) {
            this._spriteFrame = null;
        }
        this.$Sprite0_onEnable();
    };

    proto.$Sprite0_updateMaterial = proto._updateMaterial;
    proto._updateMaterial = function () {
        let spriteFrame = this._spriteFrame;
        if (spriteFrame && cc.isValid(spriteFrame) && !spriteFrame.textureLoaded()) {
            spriteFrame.onTextureLoaded(this._textureLoadedCallback, this);
            return;
        }
        this.$Sprite0_updateMaterial();
    };

    proto._textureLoadedCallback = function () {
        let spriteFrame = this._spriteFrame;
        if (!this.isValid || !spriteFrame) return;
        if (!cc.isValid(spriteFrame) && !spriteFrame.textureLoaded()) return;
        this.$Sprite0_updateMaterial();
        this._applySpriteSize();
    };

    proto._applySpriteFrame = function (oldFrame) {
        if (oldFrame && cc.isValid(oldFrame)) {
            oldFrame.off('load', this._textureLoadedCallback, this);
        }
        let spriteFrame = this._spriteFrame;
        if (spriteFrame && cc.isValid(spriteFrame)) {
            if (spriteFrame.textureLoaded()) {
                this._textureLoadedCallback();
            } else {
                this.disableRender();
                spriteFrame.onTextureLoaded(this._textureLoadedCallback, this);
            }
        } else {
            this._spriteFrame = null;
            this.disableRender();
        }
    };
}