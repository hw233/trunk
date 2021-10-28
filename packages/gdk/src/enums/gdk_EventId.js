/**
 * EventId.mixins({
 *      eventName: any
 * });
 * @Author: sthoo.huang 
 * @Date: 2019-02-21 13:27:50
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-06-06 16:15:43
 */

const Enum = require("./gdk_Enum");
let EventId = Enum({
    None: -1,
});

module.exports = EventId;