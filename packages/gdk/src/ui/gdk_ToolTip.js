var TextUI = require("./gdk_TextUI");
/**
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 13:35:23
 */

var ToolTip = cc.Class({
    extends: TextUI,
    editor: {
        menu: 'gdk(UI)/ToolTip',
        disallowMultiple: false
    },
    properties: {},
});

module.exports = ToolTip;