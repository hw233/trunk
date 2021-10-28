/**
 * 优化引擎的CCRichText组件
 * @Author: sthoo.huang 
 * @Date: 2021-01-16 10:05:24
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-18 19:57:18
 */

if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {
    const RichText = cc.RichText;
    const proto = RichText.prototype;

    proto._$RichText0_onEnable = proto.onEnable;
    proto.onEnable = function () {
        // 自动替换多语言字符串
        let str = this._string;
        if (str && str.startsWith('i18n:')) {
            const i18n = require('../Tools/gdk_i18n');
            let v = i18n.t(str);
            if (v) {
                this._string = v;
            }
        }
        this._$RichText0_onEnable();
    };
}