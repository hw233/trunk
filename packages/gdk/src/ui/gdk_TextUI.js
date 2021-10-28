/**
 * 就只是个带底图文本组件
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-08-06 15:40:56
 */
var i18n = require("../Tools/gdk_i18n");

var TextUI = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(UI)/TextUI',
        disallowMultiple: false
    },
    properties: {
        _label: {
            default: null,
            type: cc.Label,
            serializable: true,
            visible: true,
        },
        _richText: {
            default: null,
            type: cc.RichText,
            serializable: true,
            visible: true,
        },
        _text: "",
        text: {
            visible: false,
            get: function () {
                return this._text;
            },
            set: function (value) {
                if (this._text == value)
                    return;
                this._text = value || "";
                let label = this._label || this._richText;
                if (label) {
                    if (this._text) {
                        label.string = i18n.t(this._text);
                        label.node.active = true;
                    } else {
                        label.node.active = false;
                    }
                }
            }
        }
    },
    onLoad () {
        let label = this._label || this._richText;
        if (label) {
            this._text = label.string;
        }
    },
});

module.exports = TextUI;