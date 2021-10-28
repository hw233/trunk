'use strcit';

const Fs = require('fs');
const Path = require('path');
const Utils = Editor.require("packages://inspector/utils/utils");

/////////  操作动作  ///////////

var FsmAction = {
    getAllActions (cb) {
        // Editor.log("refresh fsm-Actions.");
        var vue = gdk_fsm.vue;
        vue.actionInfoDic = {};
        Editor.Scene.callSceneScript('gdk-fsm', 'get-all-actions', function (event, json) {
            vue.actionList = json;
            if (json) {
                for (var type in json) {
                    for (var name in json[type]) {
                        var item = json[type][name];
                        vue.actionInfoDic[item.action] = item.info;
                    }
                }
            }
            cb && cb();
        });
    },

    addStateAction (index) {
        var vue = gdk_fsm.vue;
        Editor.Scene.callSceneScript('gdk-fsm', 'a-action', vue.fsmCom.value.uuid.value,
            vue.currentStateName, vue.selectActionName, index, (error) => {
                if (error) {
                    return Editor.error(error);
                }
                gdk_fsm.FsmScene.syncScene();
            }
        );
    },

    showAddActionPanel () {
        var vue = gdk_fsm.vue;
        var panel = gdk_fsm.panel;
        var self = this;
        panel.$addActionPanel.style.display = "block";
        panel.$addActionPanelMask.style.display = "block";
        panel.$addActionPanelMask.onmousedown = function (e) {
            self.hideAddActionPanel();
        };
        Editor.UI.focus(vue.$("#addActionPanel_name"));
        vue.$("#addActionPanel_name").$input.focus();
    },
    hideAddActionPanel () {
        var panel = gdk_fsm.panel;
        panel.$addActionPanel.style.display = "none";
        panel.$addActionPanelMask.style.display = "none";
    },

    popupActionMenu (target) {
        var e = target.getBoundingClientRect();
        var menu = [];
        var vue = gdk_fsm.vue;
        var actionList = vue.actionList;
        for (let type in actionList) {
            let item;
            let path = type.split('/');
            menu.some(m => {
                if (m.label === path[0]) {
                    item = m;
                    return true;
                }
                return false;
            });
            if (!item) {
                item = {
                    label: path[0],
                    submenu: [],
                };
                menu.push(item);
            }
            for (let i = 1; i < path.length; i++) {
                let subitem;
                item.submenu.some(m => {
                    if (m.label === path[i]) {
                        subitem = m;
                        return true;
                    }
                    return false;
                });
                if (!subitem) {
                    subitem = {
                        label: path[i],
                        submenu: [],
                    };
                    item.submenu.push(subitem);
                }
                item = subitem;
            }
            for (let name in actionList[type]) {
                let action = actionList[type][name];
                item.submenu.push({
                    label: action.info.actionName,
                    command: "Editor.Scene.callSceneScript",
                    params: ['gdk-fsm', 'a-action',
                        vue.fsmCom.value.uuid.value,
                        vue.currentStateName,
                        action
                    ],
                });
            }
        }
        Editor.Menu.popup(menu, e.left + 5, e.bottom + 5);
    },

    openSource (name) {
        var jsEditor = Editor.remote.App._profile.data['script-editor'];
        if (jsEditor == 'default') {
            return;
        }
        var ns = [name + ".js", name + ".ts"];
        Editor.assetdb.queryAssets('db://assets/**\/*', ['typescript', 'javascript'], function (err, results) {
            for (var i = 0, l = results.length; i < l; i++) {
                var result = results[i];
                var fname = Path.basename(result.path);
                if (ns.indexOf(fname) != -1) {
                    Editor.Ipc.sendToMain("gdk-fsm:open-source", jsEditor, result.path);
                    return;
                }
            }
            // 如果找不到代码文件，则显示提示
            Editor.Dialog.messageBox({
                type: "info",
                title: "消息",
                message: "GDK提供的动作不能通过此方式编辑源码",
            });
        });
    },
};

module.exports = FsmAction;