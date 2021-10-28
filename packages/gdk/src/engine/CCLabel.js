/**
 * 优化引擎的Label组件
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-18 19:48:20
 */

const Label = cc.Label;
const proto = Label.prototype;

// 支持多语言显示正常字符串
Object.defineProperty(proto, 'string', {
    get() {
        let str = this._string;
        if (str && str.startsWith('i18n:')) {
            const i18n = require('../Tools/gdk_i18n');
            let v = i18n.t(str);
            if (v) {
                str = v;
            }
        }
        return str;
    }
});

if (CC_EDITOR) {
    // 编辑器状态不优化以下方法
} else {
    proto._$Label0_onLoad = proto.onLoad;
    proto.onLoad = function () {
        this._$Label0_onLoad();
        // 自动替换多语言字符串
        let str = this._string;
        if (str && str.startsWith('i18n:')) {
            const i18n = require('../Tools/gdk_i18n');
            let v = i18n.t(str);
            if (v) {
                this._string = v;
            }
        }
    }

    proto._$Label0_onEnable = proto.onEnable;
    proto.onEnable = function () {
        // TODO: Hack for barbarians
        if (!this.font && !this._isSystemFontUsed) {
            this.useSystemFont = true;
        }
        // Reapply default font family if necessary
        if (this.useSystemFont) {
            if (!this.fontFamily || this.fontFamily === 'Arial') {
                this.fontFamily = require('../gdk').fontFamily;
            }
        }
        this._$Label0_onEnable();
    };

    proto._$Label0_onBMFontTextureLoaded = proto._onBMFontTextureLoaded;
    proto._onBMFontTextureLoaded = function () {
        let font = this.font;
        if (font instanceof cc.BitmapFont && font.spriteFrame.textureLoaded()) {
            this._$Label0_onBMFontTextureLoaded();
        }
    };

    proto._$Label0_updateMaterialWebgl = proto._updateMaterialWebgl;
    proto._updateMaterialWebgl = function () {
        let material = this.getMaterial(0);
        if (this._nativeTTF()) {
            if (material) this._assembler._updateTTFMaterial(this)
            return;
        }

        if (!this._frame) return;
        material && material.setProperty(
            'texture',
            this._frame.getTexture ? this._frame.getTexture() : this._frame._texture,
        );

        cc.BlendFunc.prototype._updateMaterial.call(this);
    };
}