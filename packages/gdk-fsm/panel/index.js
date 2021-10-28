'use strcit';

const Fs = require('fs');
const Path = require('path');
const Utils = Editor.require("packages://inspector/utils/utils");

// 扩展Date格式化方法
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份  
        "d+": this.getDate(), //日  
        "h+": this.getHours(), //小时  
        "m+": this.getMinutes(), //分  
        "s+": this.getSeconds(), //秒  
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度  
        "S": this.getMilliseconds() //毫秒  
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

// NameSpace 定义，初始化为全局变量
window.gdk_fsm = {
    // 显示实现类
    FsmVue: Editor.require("packages://gdk-fsm/panel/core/FsmVue.js"),
    FsmGo: Editor.require("packages://gdk-fsm/panel/core/FsmGo.js"),

    // 操作工具类
    FsmAction: Editor.require("packages://gdk-fsm/panel/utils/FsmAction.js"),
    FsmState: Editor.require("packages://gdk-fsm/panel/utils/FsmState.js"),
    FsmEvent: Editor.require("packages://gdk-fsm/panel/utils/FsmEvent.js"),
    FsmScene: Editor.require("packages://gdk-fsm/panel/utils/FsmScene.js"),
    FsmClick: Editor.require("packages://gdk-fsm/panel/utils/FsmClick.js"),

    // 全局实例
    vue: null,
    panel: null,
    diagram: null,
};

// 同步场景
let syncSceneTimeoutId = -1;
let syncSceneLate = function (t = 1000) {
    if (syncSceneTimeoutId != -1) return;
    syncSceneTimeoutId = setTimeout(() => {
        syncSceneTimeoutId = -1;
        gdk_fsm.FsmScene.syncScene();
    }, t);
};

// 同步动作与事件列表
let syncActionsTimeoutId = -1;
let syncActionsLate = function (t = 1000) {
    if (syncActionsTimeoutId != -1) return;
    syncActionsTimeoutId = setTimeout(() => {
        syncActionsTimeoutId = -1;
        gdk_fsm.FsmAction.getAllActions();
        gdk_fsm.FsmEvent.getAllFsmEvents();
        gdk_fsm.FsmScene.getAllScenes();
    }, t);
};

// 界面定义
Editor.Panel.extend({
    style: Fs.readFileSync(Editor.url('packages://gdk-fsm/panel/style.css')),
    template: Fs.readFileSync(Editor.url('packages://gdk-fsm/panel/template.html')),
    $: {
        drawView: "#drawView",
        menu: "#menu",
        customEventPanel: "#customEventPanel",
        customEventPanelInput: "#customEventPanelInput",
        customEventPanelSelect: "#customEventPanelSelect",
        customEventMask: "#customEventMask",
        actionBrowser: "#actionBrowser",
        actionMenu: "#actionMenu",
        actionMenuMask: "#actionMenuMask",
        drawOverView: "#drawOverView",
        addActionPanel: "#addActionPanel",
        addActionPanelMask: "#addActionPanelMask",
    },

    ready () {
        gdk_fsm.panel = this;
        gdk_fsm.FsmVue.initVue(this.shadowRoot);
        gdk_fsm.FsmGo.initGojs();
    },
    run (uuid) {
        var vue = gdk_fsm.vue;
        if (vue.fsmNodes == null) {
            vue.currenFsmuuid = uuid;
        } else {
            gdk_fsm.FsmScene.setCurrentFsmCom(uuid);
        }
    },
    startup () {
        syncSceneLate();
        syncActionsLate();
    },

    messages: {
        "selection:selected": function (event, type, uuids) {
            // Editor.log("selection:selected", type, uuids);
            var vue = gdk_fsm.vue;
            if (type == "node") {
                if (uuids.length == 1) {
                    if (vue.locked == false) {
                        if (vue.fsmCom && vue.fsmCom.value.node.value.uuid == uuids[0]) {
                            return;
                        }
                        gdk_fsm.FsmScene.setCurrentFsmCom();
                    }
                }
            }
        },
        "scene:ready": function (event) {
            // Editor.log("scene:ready");
            gdk_fsm.vue.fsmCom = null;
            syncSceneLate();
            syncActionsLate();
        },
        // "scene:reloading": function (event) {
        //     // Editor.log("scene:reloading");
        //     syncSceneLate();
        // },
        "sync-scene": function (event) {
            // Editor.log("sync-scene");
            syncSceneLate(10);
        },
        "fsm-create-or-delete": function (event) {
            // Editor.log("panel:fsm-create-or-delete");
            syncSceneLate();
        },
        "fsm-add-action": function (event) {
            // Editor.log("fsm-add-action");
            syncActionsLate();
        },
        "fsm-name-changed": function (event, uuid, str) {
            // Editor.log("panel:fsm-name-changed");
            var vue = gdk_fsm.vue;
            for (var i = 0; i < vue.allfsmComs.length; i++) {
                var com = vue.allfsmComs[i];
                if (com.value.uuid.value == uuid) {
                    com.value.fsm.value.fsmName.value = str;
                    break;
                }
            }
        },
        "fsm-des-changed": function (event, uuid, str) {
            // Editor.log("panel:fsm-des-changed");
            var vue = gdk_fsm.vue;
            for (var i = 0; i < vue.allfsmComs.length; i++) {
                var com = vue.allfsmComs[i];
                if (com.value.uuid.value == uuid) {
                    com.value.fsm.value.fsmDescription.value = str;
                    break;
                }
            }
        },
    }
});