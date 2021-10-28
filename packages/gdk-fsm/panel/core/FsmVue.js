'use strcit';

const Fs = require('fs');
const Path = require('path');
const Utils = Editor.require("packages://inspector/utils/utils");

//////////////////  VUE  ////////////////////////

let FsmVue = {

    initVue (shadowRoot) {
        Editor.require("packages://gdk-fsm/panel/state-action.js");
        var vue = gdk_fsm.vue = new window.Vue({
            el: shadowRoot,
            data: {
                version: Editor.require("packages://gdk/src/gdk_Version.js"),

                propTabIndex: 1,
                allScenes: null,
                fsmNodes: null,
                allfsmComs: [],
                fsmCom: null,
                locked: false,
                isShowOverView: true,

                menuSelection: 0,
                menuSelectionItem: {
                    showStart: true,
                    showFinish: true,
                },
                inputEventString: "",
                isInputEventGlobal: false,

                currentSceneUuid: null,
                currentStateName: null,

                _currentState: null,
                actionList: {},
                actionSearchStr: "",
                selectActionName: null,
                currentActionIndex: -1,
                menuSelectEventIndex: -1,
                menuIsRenameEvent: false,
                actionBrowserIsShow: false,

                fsmEventList: {},
                actionInfoDic: {},

                addActionInfo: {
                    "name": {
                        "name": "名称",
                        "value": "",
                        "type": "string",
                        "placeholder": "动作的名称",
                    },
                    "type": {
                        "name": "分类",
                        "value": localStorage.getItem("action-type") || "",
                        "type": "string",
                        "placeholder": "动作的分类",
                    },
                    "author": {
                        "name": "作者",
                        "value": localStorage.getItem("action-author") || "",
                        "type": "string",
                        "placeholder": "作者的名字",
                    },
                    "desc": {
                        "name": "注释",
                        "value": "",
                        "type": "text",
                        "placeholder": "动作类注释",
                    }
                },
            },
            created () {
                var isShowOverView = localStorage.getItem("isShowOverView");
                this.isShowOverView = !isShowOverView ? true : (isShowOverView == "true" ? true : false);

                Editor.Ipc.sendToPanel("scene", "scene:is-ready", (e, t) => {
                    t && gdk_fsm.panel.startup();
                });
            },
            computed: {
                currentFsmComUuid () {
                    if (this.fsmCom) {
                        return this.fsmCom.value.uuid.value;
                    }
                    return 0;
                },
                currentNodeUuid () {
                    for (var i = 0; i < this.allfsmComs.length; i++) {
                        var com = this.allfsmComs[i];
                        if (com == this.fsmCom) {
                            return com.value.node.value.uuid;
                        }
                    }
                },
                currentNode () {
                    for (var i = 0; i < this.allfsmComs.length; i++) {
                        var com = this.allfsmComs[i];
                        if (com == this.fsmCom) {
                            return com.value.node.value;
                        }
                    }
                },
                currentState () {
                    this._currentState = null;
                    if (this.currentStateName && this.fsmCom) {
                        var states = this.fsmCom.value.fsm.value.states.value;
                        for (var i = 0; i < states.length; i++) {
                            var state = states[i].value;
                            if (state.stateName.value == this.currentStateName) {
                                this._currentState = state;
                                break;
                            }
                        }
                    }
                    return this._currentState;
                },
                fsmComps () {
                    if (this.fsmCom == null) {
                        return null;
                    }
                    var nodeId = this.fsmCom.value.node.value.uuid;
                    var arr = [];
                    for (var i = 0; i < this.allfsmComs.length; i++) {
                        var com = this.allfsmComs[i];
                        if (com.value.node.value.uuid == nodeId) {
                            arr.push(com);
                        }
                    }
                    return arr;
                },
                eventAutoCompleteMatchs () {
                    var m = [];
                    var t = this.inputEventString.toLowerCase();
                    var b = t == '';
                    for (var k in this.fsmEventList) {
                        var v = this.fsmEventList[k];
                        if (b || v.toLowerCase().indexOf(t) >= 0) {
                            m.push(v);
                            if (m.length > 10) break;
                        }
                    }
                    return m;
                },
            },
            methods: {
                $ (e) {
                    // 简单的选择器
                    let eType = 'queryeAll';
                    if (e.indexOf('#') === 0) {
                        eType = 'getElementById';
                        e = e.substr(1, e.length);
                    }
                    if (e.indexOf('.') === 0) {
                        eType = 'getElementsByClassName';
                        e = e.substr(1, e.length);
                    }
                    return shadowRoot[eType](e);
                },

                refreshScene () {
                    // 查询的资源类型
                    var types = ['javascript', 'typescript'];
                    // 查询回调函数
                    function qcb (err, results) {
                        if (err || !results || results.length == 0) {
                            if (types.length > 0) {
                                // 获次下一个类型的资源
                                Editor.assetdb.queryAssets('db://assets/**\/*', types.shift(), qcb);
                            }
                            return;
                        }
                        // 刷新回调函数
                        function rcb (err) {
                            if (err) {
                                Editor.log('error: ', err);
                                if (results.length > 0) {
                                    // 刷新下一个资源
                                    Editor.assetdb.refresh(results.shift().url, rcb);
                                }
                            } else {
                                // 刷新资源之后会自动调用更新方法，此处不需要主动调用
                                // gdk_fsm.FsmAction.getAllActions();
                                // gdk_fsm.FsmEvent.getAllFsmEvents();
                                // gdk_fsm.FsmScene.getAllScenes();
                                // gdk_fsm.FsmScene.syncScene();
                            }
                        };
                        Editor.assetdb.refresh(results.shift().url, rcb);
                    };
                    Editor.assetdb.queryAssets('db://assets/**\/*', types.shift(), qcb);
                },
                onActionItemDragStart (e, action) {
                    e.stopPropagation();
                    this.selectActionName = action;
                    e.dataTransfer.setData("actionIndex", -1);
                    // console.log(e);
                },
                onActionDragStart (e) {
                    e.stopPropagation();
                    var target = e.currentTarget;
                    var actionId = target.getAttribute("actionId");
                    var actions = this._currentState.actions.value;
                    var actionIndex = -1;
                    for (var i = 0; i < actions.length; i++) {
                        var action = actions[i].value;
                        if (action.uuid.value == actionId) {
                            actionIndex = i;
                            break;
                        }
                    }
                    e.dataTransfer.setData("actionIndex", actionIndex);
                    // e.dataTransfer.setData("action", e.target.actionName);
                    // console.log(e);
                },
                onActionItemDropEnd (e) {
                    e.dataTransfer.setData("actionIndex", -1);
                },
                onActionItemDragOver (e) {
                    e.stopPropagation();
                    //e.dataTransfer.setData("action", e.target.actionName);
                    // console.log(e);
                },
                onAllowDrop (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    //  e.dataTransfer.setData("Text",e.target.actionName);
                    // console.log(e);
                },
                onActionItemDrop (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var target = e.currentTarget;
                    var actionIndex = e.dataTransfer.getData("actionIndex");
                    actionIndex = parseInt(actionIndex);
                    var toIndex = -1;
                    var actions = this._currentState.actions.value;
                    if (target.tagName.toLowerCase() == "ui-section") {
                        var actionId = target.getAttribute("actionId");
                        toIndex = actions.length;
                        for (var i = 0; i < actions.length; i++) {
                            var action = actions[i].value;
                            if (action.uuid.value == actionId) {
                                toIndex = i;
                                break;
                            }
                        }
                    }
                    if (actionIndex == -1) {
                        if (toIndex == -1) {
                            gdk_fsm.FsmAction.addStateAction();
                        } else {
                            gdk_fsm.FsmAction.addStateAction(toIndex);
                        }
                    } else {
                        if (actionIndex != toIndex) {
                            if (toIndex == -1) {
                                toIndex = actions.length;
                            }
                        }
                        this.actionAt(actionIndex, toIndex);
                    }
                    //  e.dataTransfer.setData("Text",e.target.actionName);
                    // console.log(e);
                },

                selectScene (event) {
                    var uuid = event.target.value;
                    if (uuid != this.currentSceneUuid) {
                        for (var i = 0; i < this.allScenes.length; i++) {
                            var scene = this.allScenes[i];
                            if (scene.uuid === uuid) {
                                if (scene.type === 'scene') {
                                    // Editor.Scene.callSceneScript('gdk-fsm', 'load-scene-by-uuid', uuid);
                                    Editor.Ipc.sendToMain("scene:open-by-uuid", uuid);
                                } else {
                                    Editor.Ipc.sendToAll('scene:enter-prefab-edit-mode', uuid);
                                }
                                break;
                            }
                        }
                    }
                    // 强制把FSM窗口设置为活动窗口
                    Editor.Panel.open('gdk-fsm');
                },
                selectedNode (event) {
                    var nodeId = event.target.value;
                    if (this.fsmCom) {
                        if (this.fsmCom.value.node.uuid != nodeId) {
                            for (var i = 0; i < this.allfsmComs.length; i++) {
                                var com = this.allfsmComs[i];
                                if (com.value.node.value.uuid == nodeId) {
                                    this.fsmCom = com;
                                    break;
                                }
                            }
                        }
                    }
                },
                selectedFsm (event) {
                    gdk_fsm.FsmScene.setCurrentFsmCom(event.target.value);
                },
                selectSceneNode () {
                    if (this.fsmCom) {
                        Editor.Selection.select("node", this.fsmCom.value.node.value.uuid, true, false);
                    }
                },

                "m_fsm": function (p) {
                    var o = {};
                    o[p] = this.fsmCom.value.fsm.value[p].value;
                    Editor.Scene.callSceneScript('gdk-fsm', 'm-fsm', this.fsmCom.value.uuid.value, o);
                },

                "a_state": function (event) {
                    gdk_fsm.FsmState.addState();
                },
                "m_state": function (event, p) {
                    var diagram = gdk_fsm.diagram;
                    var stateName = this.currentStateName;
                    var stateData = diagram.model.findNodeDataForKey(stateName);
                    var o = {};
                    if (p == "sequence") {
                        o[p] = event.target.value == '1';
                    } else {
                        o[p] = event.target.value;
                    }
                    this._currentState[p].value = o[p];
                    if (p == "stateName" || p == "stateDescription") {
                        diagram.model.setDataProperty(stateData, p, o[p]);
                    }
                    if (p == "stateName") {
                        this.currentStateName = o[p];
                    }
                    gdk_fsm.FsmState.modifyState(stateName, o, function (e) {
                        if (e) alert(e);
                        if (p == "stateName") {
                            gdk_fsm.FsmScene.syncScene();
                        }
                    });
                },

                "a_event": function (event) {
                    gdk_fsm.FsmEvent.addEvent(this.inputEventString);
                },
                "showActionBrowser": function (show) {
                    this.actionBrowserIsShow = show;
                },

                "onCustomEventChange": function () {
                    var panel = gdk_fsm.panel;
                    var p = panel.$customEventPanelSelect;
                    var cps = panel.$customEventPanel.style;
                    p.style.display = "block";
                    p.style.left = (parseInt(cps.left) + 68) + "px";
                    p.style.top = (parseInt(cps.top) + 72) + "px";
                },
                "clickEventListItem": function (val) {
                    var panel = gdk_fsm.panel;
                    var p = panel.$customEventPanelSelect;
                    p.style.display = "none";
                    this.inputEventString = val;
                    panel.$customEventPanelInput.$input.focus();
                },

                addStateAction (event) {
                    gdk_fsm.FsmAction.addStateAction();
                },
                showActionMenu (e, div, action) {
                    var panel = gdk_fsm.panel;
                    var state = this._currentState;
                    var index = -1;
                    for (var i = 0; i < state.actions.value.length; i++) {
                        if (state.actions.value[i] == action) {
                            index = i;
                            break;
                        }
                    }
                    this.currentActionIndex = index;
                    if (index != -1) {
                        let p = panel.$actionMenu;
                        p.style.display = "block";
                        panel.$actionMenuMask.style.display = "block";
                        p.style.left = div.getBoundingClientRect().left - 50;
                        p.style.top = div.getBoundingClientRect().top
                    }
                },
                hideActionMenu () {
                    var panel = gdk_fsm.panel;
                    panel.$actionMenu.style.display = "none";
                    panel.$actionMenuMask.style.display = "none";
                },
                actionAt (index, toIndex) {
                    var state = this._currentState;
                    var action = state.actions.value[index];
                    state.actions.value.splice(index, 1);
                    state.actions.value.splice(toIndex, 0, action);
                    Editor.Scene.callSceneScript('gdk-fsm', 'action-at', this.fsmCom.value.uuid.value, this.currentStateName, index, toIndex);
                },
                actionUp () {
                    if (this.currentActionIndex > 0) {
                        var state = this._currentState;
                        var action = state.actions.value[this.currentActionIndex];
                        state.actions.value.splice(this.currentActionIndex, 1);
                        state.actions.value.splice(this.currentActionIndex - 1, 0, action);
                        Editor.Scene.callSceneScript('gdk-fsm', 'action-up', this.fsmCom.value.uuid.value, this.currentStateName, this.currentActionIndex);
                        this.hideActionMenu();
                    }
                },
                actionDown () {
                    var state = this._currentState;
                    if (this.currentActionIndex < state.actions.value.length - 1) {
                        var action = state.actions.value[this.currentActionIndex];
                        state.actions.value.splice(this.currentActionIndex, 1);
                        state.actions.value.splice(this.currentActionIndex + 1, 0, action);
                        Editor.Scene.callSceneScript('gdk-fsm', 'action-down', this.fsmCom.value.uuid.value, this.currentStateName, this.currentActionIndex);
                        this.hideActionMenu();
                    }
                },
                actionDelete () {
                    var state = this._currentState;
                    state.actions.value.splice(this.currentActionIndex, 1);
                    Editor.Scene.callSceneScript('gdk-fsm', 'action-delete', this.fsmCom.value.uuid.value, this.currentStateName, this.currentActionIndex);
                    this.hideActionMenu();
                },
                getActionInfo (action) {
                    var classname = action.value._classname.value;
                    return this.actionInfoDic[classname];
                },

                // 创建Action脚本
                createActionSource () {
                    var vue = gdk_fsm.vue;
                    var code = Fs.readFileSync(Editor.url('packages://gdk-fsm/panel/actionTemple.txt'), "utf-8");
                    var info = vue.addActionInfo;
                    for (var key in info) {
                        code = code.split('{{' + key + '}}').join(info[key].value);
                    }
                    var timestamp = Date.now();
                    var date = new Date(timestamp);
                    code = code.split("{{time_stamp}}").join(date.format("yyyy-MM-dd hh:mm:ss"));
                    // 保存至本地存储中
                    localStorage.setItem("action-author", info.author.value);
                    localStorage.setItem("action-type", info.type.value);
                    // 保存文件
                    var assetsPath = Editor.url("db://assets");
                    var basePath = localStorage.getItem('action-path') || assetsPath;
                    var codePath = Editor.Dialog.saveFile({
                        title: "保存动作脚本",
                        defaultPath: Path.join(basePath, info.name.value + "Action"),
                        filters: [{
                            name: "TypeScript",
                            extensions: ['ts']
                        }]
                    });
                    if (typeof (codePath) === 'string') {
                        // 点击了保存按钮
                        var codeUrl = codePath.substr(assetsPath.length);
                        codeUrl = "db://assets" + codeUrl.split("\\").join("/");
                        Editor.assetdb.create(codeUrl, code, function (err) {
                            if (err) {
                                Editor.log(err);
                                return;
                            }
                            localStorage.setItem("action-path", Path.dirname(codePath));
                            Editor.Ipc.sendToMain("gdk-fsm:open-source", codePath);
                            gdk_fsm.FsmAction.hideAddActionPanel();
                            // 添加至动作列表
                            var actionName = info.name.value;
                            var actionType = info.type.value;
                            var tryCount = 0;
                            var timeId = setInterval(() => {
                                vue.selectActionName = null;
                                for (var key in vue.actionList) {
                                    if (key != actionType) continue;
                                    var list = vue.actionList[key];
                                    for (var e in list) {
                                        var action = list[e];
                                        if (action.info.actionName == actionName) {
                                            vue.selectActionName = action;
                                            break;
                                        }
                                    }
                                    if (vue.selectActionName) break;
                                }
                                if (vue.selectActionName) {
                                    gdk_fsm.FsmAction.addStateAction();
                                    vue.selectActionName = null;
                                    clearInterval(timeId);
                                } else {
                                    // 偿试10次后放弃
                                    if (++tryCount > 10) clearInterval(timeId);
                                }
                            }, 500);
                            // 重置变量值
                            info.name.value = '';
                            info.desc.value = '';
                        });
                    }
                },
                // 打开动作脚本源码编辑
                openActionSource (action) {
                    gdk_fsm.FsmAction.openSource(action.action);
                },
            },
            watch: {
                fsmCom (val, oldVal) {
                    gdk_fsm.FsmGo.updateModelData();
                },
                isShowOverView (val, oldVal) {
                    localStorage.setItem("isShowOverView", val ? "true" : "false");
                }
            }
        });
        return vue;
    }
};

module.exports = FsmVue;