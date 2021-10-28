'use strict';
const {
    BrowserWindow
} = require('electron');
const {
    execFile
} = require('child_process');

module.exports = {
    load () {
        // Editor.log("load");
        this.syncActionsLate();
    },

    unload () {

    },

    syncActionsLate () {
        if (this.syncSceneTimeoutId) return;
        this.syncSceneTimeoutId = setTimeout(() => {
            delete this.syncSceneTimeoutId;
            // Editor.log("main:gdk-fsm:get-all-scene");
            Editor.Scene.callSceneScript('gdk-fsm', 'get-all-scene');
        }, 1000);
    },

    // register your ipc messages here
    messages: {
        open () {
            // Editor.log("open");
            Editor.Panel.open('gdk-fsm');
        },
        "scene:ready": function (event) {
            // Editor.log("scene:ready");
            this.syncActionsLate();
        },
        "fsm-create-or-delete": function (event) {
            // Editor.log("main:fsm-create-or-delete");
            this.syncActionsLate();
        },
        "fsm-name-changed": function (event, uuid, str) {
            // Editor.log("main:fsm-name-changed");
            this.syncActionsLate();
        },
        "fsm-des-changed": function (event, uuid, str) {
            // Editor.log("main:fsm-des-changed");
            this.syncActionsLate();
        },
        "show-menu": function (event, option) {
            // Editor.log("show-menu");
            let template;
            if (option.target == "state") {

            } else if (option.target == "event") {

            } else if (option.target == "fsm") {
                template = [{
                    label: "添加状态",
                    click () {
                        _menuClick("addState");
                    }
                }];
            }
            if (template == null) {
                return;
            }

            function _menuClick (cmd) {
                option.cmd = cmd;
                Editor.Ipc.sendToPanel("gdk-fsm:menuClick", option);
            };
            let editorMenu = new Editor.Menu(template, event.sender);
            option.x = Math.round(option.x);
            option.y = Math.round(option.y);
            editorMenu.nativeMenu.popup(BrowserWindow.fromWebContents(event.sender), option.x, option.y);
            editorMenu.dispose();
        },
        'open-source': function (e, jsEditor, file) {
            execFile(jsEditor, [file], {
                    maxBuffer: 2000 * 1204
                },
                (error, stdout, stderr) => {
                    Editor.log(stdout);
                    if (error != null) {
                        Editor.error(error);
                    }
                }
            );
        },
    },
};