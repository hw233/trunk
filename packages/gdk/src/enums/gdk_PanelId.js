/**
 * PanelId.mixins({
 *      1:{prefab:null, modules:[], isPopup:true, isMask:true, isTouchMaskClose:true}
 * });
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-04-08 20:22:14
 */

const Enum = require("./gdk_Enum");
let PanelId = Enum({
    None: -1
});
PanelId.__value__ = {};
PanelId.__enums__ = [];
let $mixins = PanelId.mixins;
let mixins = function (obj) {
    for (let key in obj) {
        let o = obj[key];
        if (typeof o === 'object' && !o.__id__) {
            o.__id__ = key;
        }
    }
    $mixins.call(this, obj);
};
cc.js.value(PanelId, "mixins", mixins, true);
module.exports = PanelId;