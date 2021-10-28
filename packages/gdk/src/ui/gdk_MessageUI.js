var TextUI = require("./gdk_TextUI");

/**
 * 信息
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-08-05 11:55:38
 */

var MessageUI = cc.Class({
    extends: TextUI,
    editor: {
        menu: 'gdk(UI)/MessageUI',
        disallowMultiple: false
    },
    properties: {
        _type: "",
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                if (this._type == value)
                    return;
                this._type = value;
                this._updateType();

            },
            visible: false,
        },
    },

    // onLoad () {},

    _updateType () {

    },

    reuse () {
        this.node.stopAllActions();
        this.node.setPosition(0, 0);
    },

    // update (dt) {},
});

module.exports = MessageUI;