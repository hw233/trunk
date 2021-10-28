/**
 * 国际化类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-18 19:06:53
 */

const i18n = {
    t (str, opt) {
        if (str && typeof str === "string" && str.startsWith("i18n:")) {
            const i = require('../i18/LanguageData');
            str = str.substring(5);
            return i.t(str, opt);
        }
        return str;
    },

    init (language) {
        const i = require('../i18/LanguageData');
        i.init(language);
    },
}

module.exports = i18n;