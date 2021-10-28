"use strict";
const Fs = require('fs');
const Path = require('path');
Editor.require("packages://inspector/share/array-prop.js");
Editor.require("packages://inspector/share/prop.js");
Editor.require("packages://inspector/share/node-section.js");
Editor.require("packages://inspector/share/null-prop.js");
Editor.require("packages://inspector/share/object-prop.js");
Editor.require("packages://inspector/share/type-error-prop.js");
var Utils = Editor.require("packages://inspector/utils/utils")
var Data = Editor.require("packages://inspector/panel/data");
window.Vue.component("state-action", {
    template: "" + Fs.readFileSync(Editor.url('packages://gdk-fsm/panel/actionTemp.html')),
    props: {
        state: {
            type: Object,
        },
        fsmcom: {
            type: Object,
        },
        action: {
            type: Object
        },
        info: {
            type: Object,
        }
    },

    computed: {
        actionName () {
            return this.info && this.info.actionName;
        },
    },
    methods: {
        T: Editor.T,
        menuClick (e) {
            e.stopPropagation();
            let n = this.$els.dropdown;
            this.$emit('show-action-menu', e, n, this.action);
        },
        editClick (e) {
            e.stopPropagation();
            var name = this.action.attrs.typename;
            gdk_fsm.FsmAction.openSource(name);
        },
        clickEnable (e) {
            e.stopPropagation();
            var o = {};
            o["enabled"] = {
                type: this.action.value.enabled.type,
                value: this.action.value.enabled.value
            };
            this.mAction(o);
        },
        onPropChange (e) {
            var value = e.detail.value;
            var key = e.target.getAttribute("propname");
            var o = {};
            o[key] = {
                value: value,
                type: this.action.value[key].type
            };
            this.action.value[key].value = value;
            this.mAction(o);
        },
        arraySizeChange (e) {
            var value = e.detail.value;
            var key = e.target.getAttribute("propname");

            this.mActionArrayLength(key, value);
        },
        onArrayPropChange (e, index) {
            var value = e.detail.value;
            var key = e.target.getAttribute("propname");
            var index = e.target.getAttribute("index");
            var o = {};
            o[key] = {
                value: value,
                type: this.action.value[key].elementType
            };
            this.action.value[key].value[index].value = value;
            Editor.Scene.callSceneScript('gdk-fsm', 'm-action-array', this.action.value.uuid.value, o, index);
        },

        mAction (o) {
            Editor.Scene.callSceneScript('gdk-fsm', 'm-action', this.action.value.uuid.value, o);
        },
        mActionArrayLength (p, n) {
            var vm = this;
            var type = this.action.value[p].elementType;
            Editor.Scene.callSceneScript('gdk-fsm', 'm-action-array-length', this.action.value.uuid.value, p, n, type, function () {
                vm.$emit('refresh-scene');
            });
        },
        getActionFinishTypeIcon (type) {
            if (type == "wait") {
                return ["fa fa-hourglass-2", "fa-fw"];
            } else if (type == "op") {
                return ["fa fa-hand-pointer-o", "fa-fw"];
            } else if (type == "pause") {
                return ["fa fa-pause", "fa-fw"];
            } else if (type == "stop") {
                return ["fa fa-pause", "fa-fw"];
            }
            return "";
        },
        getActionFinishTypeColor (type) {
            if (type == "wait") {
                return "Bisque";
            } else if (type == "op") {
                return "Aquamarine";
            } else if (type == "pause") {
                return "HotPink";
            } else if (type == "stop") {
                return "IndianRed";
            }
            return "";
        },
        getActionFinishTypeTooltip (type) {
            if (type == "wait") {
                return "本动作处理需时";
            } else if (type == "op") {
                return "本动作需要用户操作才可继续";
            } else if (type == "pause") {
                return "暂停";
            } else if (type == "stop") {
                return "停止";
            }
            return "";
        }
    },
});