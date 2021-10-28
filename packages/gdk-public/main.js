'use strict';

let _callback;
let _name = 'gdk-public';

module.exports = {
    load () {

    },

    unload () {

    },

    messages: {
        "open"() {
            Editor.Panel.open(_name);
        },
        "finished"(e, info) {
            _callback && _callback();
        }
    },
};