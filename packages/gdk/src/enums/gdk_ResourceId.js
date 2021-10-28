/**
 * ResourceId.mixins({
 *      Boot:{
 *          GB_window: {
 *               type: cc.SpriteFrame,
 *               resArray: ["UI/GY_Button/GY_anniuhuang"],
 *           },
 *           Font: {
 *               type: cc.LabelAtlas,
 *               resArray: ["UI/fonts/fonts_dengli_lv_2",],
 *           },
 *           prefabs: {
 *               type: cc.Prefab,
 *               resArray: ["prefab/CommonView/CommonIconWidget",],
 *           },
 *           spriteAltas: {
 *               type: cc.SpriteAtlas,
 *               resArray: ["UI/heroIcon",],
 *           },
 *      }
 * });
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 16:04:54
 */

const Enum = require("./gdk_Enum");
let ResourceId = Enum({
    None: -1
});
ResourceId.__value__ = {};

module.exports = ResourceId;