/** 
 * 修复cc.Material类中的一些错误，或优化性能
 * @Author: sthoo.huang  
 * @Date: 2020-06-12 14:19:01 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-04 14:12:41
 */

if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {

    var Material = cc.Material;
    var proto = Material.prototype;

    /**
     * !#en Sets the Material property
     * !#zh 是指材质的属性
     * @method setProperty
     * @param {string} name
     * @param {Object} val
     * @param {number} [passIdx]
     * @param {boolean} [directly]
     */
    proto.setProperty = function (name, val, passIdx, directly) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) return;

        if (typeof passIdx === 'string') {
            passIdx = parseInt(passIdx);
        }

        if (val instanceof cc.Texture2D) {
            let isAlphaAtlas = val.isAlphaAtlas();
            let key = 'CC_USE_ALPHA_ATLAS_' + name;
            let def = this.getDefine(key, passIdx);
            if (isAlphaAtlas || def) {
                this.define(key, isAlphaAtlas);
            }
            // 存在旧的则清除监听
            let oldval = this._$N_val;
            if (oldval) {
                if (oldval.texture === val) {
                    return;
                }
                if (cc.isValid(oldval.texture)) {
                    oldval.texture.off('load', oldval.loaded, this);
                }
                delete this._$N_val;
            }
            // 纹理没有加载完成
            if (!val.loaded) {
                this._$N_val = {
                    texture: val,
                    loaded: () => {
                        delete this._$N_val;
                        if (this._effect) {
                            this._effect.setProperty(name, val, passIdx, directly);
                        }
                    },
                };
                val.once('load', this._$N_val.loaded, this);
                cc.assetManager.postLoadNative(val);
                return;
            }
        }

        this._effect.setProperty(name, val, passIdx, directly);
    };
}