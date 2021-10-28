var TextUI = require("./gdk_TextUI");

/**
 * 
 * 等待
 * @author
 */

var WaitingUI = cc.Class({
    extends: TextUI,
    editor: {
        menu: 'gdk(UI)/WaitingUI',
        disallowMultiple: false
    },
    properties: {

        _icon: {
            default: null,
            type: cc.Node,
            serializable: true,
            visible: true,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});

module.exports = WaitingUI;