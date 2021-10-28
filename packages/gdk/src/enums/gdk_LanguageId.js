/**
 * LanguageId.mixins({
 *      lang: 'lang'
 * });
 * @Author: sthoo.huang 
 * @Date: 2019-02-21 13:27:50
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-03-04 16:08:15
 */

const Enum = require("./gdk_Enum");
let LanguageId = Enum({
    None: -1,
});

module.exports = LanguageId;