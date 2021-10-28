/**
 * value为场景名
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 18:36:49
 */

const Enum = require("./gdk_Enum")
var SceneId = Enum({
    None: -1
});
SceneId.__value__ = {};

module.exports = SceneId;