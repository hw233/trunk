'use strcit';

const Fs = require('fs');
const Path = require('path');
const Utils = Editor.require("packages://inspector/utils/utils");

/////////  操作事件  ///////////

var FsmEvent = {

    getAllFsmEvents () {
        // Editor.log("refresh fsm-EventIds.");
        Editor.Scene.callSceneScript('gdk-fsm', 'get-all-fsm-events', function (event, json) {
            gdk_fsm.vue.fsmEventList = json;
        });
    },

    addEvent (eventName) {
        var vue = gdk_fsm.vue;
        var indexAt = vue.menuSelectEventIndex;
        if (eventName == null || eventName == "") {
            return alert("请选择输入事件名");
        }
        var self = this;
        var panel = gdk_fsm.panel;
        var stateName = vue.currentStateName;
        var isGlobal = vue.isInputEventGlobal;
        var menuIsRenameEvent = vue.menuIsRenameEvent;
        Editor.Scene.callSceneScript('gdk-fsm', 'a-event', vue.fsmCom.value.uuid.value, stateName, eventName, isGlobal, indexAt, menuIsRenameEvent, (error, index) => {
            if (error) {
                return Editor.error(error);
            }
            if (menuIsRenameEvent) {
                gdk_fsm.FsmScene.syncScene();
                self.hideEventInputPanel();
                return;
            }
            if (vue.fsmCom) {
                var diagram = gdk_fsm.diagram;
                if (isGlobal) {
                    gdk_fsm.FsmScene.syncScene();
                    var fsm = vue.fsmCom.value.fsm.value;
                    fsm.globalTransitions.value.push({
                        value: {
                            eventName: {
                                value: eventName,
                                type: "String"
                            },
                            toState: {
                                value: stateName,
                                type: "String"
                            }
                        },
                        type: "FsmTransition"
                    });
                    var stateData = diagram.model.findNodeDataForKey(stateName);
                    var eventData = {
                        eventName: eventName,
                        isGlobal: true,
                    };
                    diagram.model.addArrayItem(stateData.globalEvents, eventData);
                    diagram.model.setDataProperty(stateData, "hasGlobalEvents", true);
                } else {
                    var states = vue.fsmCom.value.fsm.value.states.value;
                    var state = states[index];
                    var eventData = {
                        value: {
                            eventName: {
                                value: eventName,
                                type: "String"
                            },
                            toState: {
                                value: null,
                                type: "String"
                            }
                        },
                        type: "FsmTransition"
                    };
                    if (indexAt == -1) {
                        state.value.transitions.value.push(eventData);
                    } else {
                        state.value.transitions.value.splice(indexAt, 0, eventData);
                    }
                    eventData = {
                        eventName: eventName,
                        isGlobal: false,
                    };
                    if (indexAt == -1) {
                        diagram.model.addArrayItem(diagram.model.nodeDataArray[index].events, eventData);
                    } else {
                        diagram.model.insertArrayItem(diagram.model.nodeDataArray[index].events, indexAt, eventData);
                    }
                }
                self.hideEventInputPanel();
            }
        });
    },

    deleteEvent (stateName, eventName) {
        var vue = gdk_fsm.vue;
        Editor.Scene.callSceneScript('gdk-fsm', 'd-event', vue.fsmCom.value.uuid.value, stateName, eventName, (error, index, eventIndex) => {
            if (error) {
                return Editor.error(error);
            }
            if (vue.fsmCom) {
                var states = vue.fsmCom.value.fsm.value.states.value;
                var state = states[index];
                var diagram = gdk_fsm.diagram;
                state.value.transitions.value.splice(eventIndex, 1);
                diagram.model.removeArrayItem(diagram.model.nodeDataArray[index].events, eventIndex);
            }
        });
    },

    upEvent (stateName, eventName) {
        var vue = gdk_fsm.vue;
        Editor.Scene.callSceneScript('gdk-fsm', 'up-event', vue.fsmCom.value.uuid.value, stateName, eventName, (error, index, eventIndex) => {
            if (error) {
                return Editor.error(error);
            }
            // if (vue.fsmCom && eventIndex > 0) {
            //   var states = vue.fsmCom.value.fsm.value.states.value;
            //   var state = states[index];
            //   var eventObject = state.value.transitions.value[eventIndex];
            //   state.value.transitions.value.splice(eventIndex, 1);
            //   state.value.transitions.value.splice(eventIndex - 1, 0, eventObject);
            // }
            gdk_fsm.FsmScene.syncScene();
        });
    },

    downEvent (stateName, eventName) {
        var vue = gdk_fsm.vue;
        Editor.Scene.callSceneScript('gdk-fsm', 'down-event', vue.fsmCom.value.uuid.value, stateName, eventName, (error, index, eventIndex) => {
            if (error) {
                return Editor.error(error);
            }
            // if (vue.fsmCom) {
            //   var states = vue.fsmCom.value.fsm.value.states.value;
            //   var state = states[index];
            //   if (eventIndex < state.value.transitions.value.length - 1) {
            //     var eventObject = state.value.transitions.value[eventIndex];
            //     state.value.transitions.value.splice(eventIndex, 1);
            //     state.value.transitions.value.splice(eventIndex + 1, 0, eventObject);

            //     _updateModelData();
            //   }
            // }
            gdk_fsm.FsmScene.syncScene();
        });
    },

    deleteGlobalEvent (stateName, eventName) {
        var vue = gdk_fsm.vue;
        Editor.Scene.callSceneScript('gdk-fsm', 'd-global-event', vue.fsmCom.value.uuid.value, eventName, (error, eventIndex) => {
            if (error) {
                return Editor.error(error);
            }
            if (vue.fsmCom) {
                var fsm = vue.fsmCom.value.fsm.value;
                var diagram = gdk_fsm.diagram;
                fsm.globalTransitions.value.splice(eventIndex, 1);
                var stateData = diagram.model.findNodeDataForKey(stateName);
                var eventIndex = -1;
                for (var i = 0; i < stateData.globalEvents.length; i++) {
                    if (stateData.globalEvents[i].eventName == eventName) {
                        eventIndex = i;
                        break;
                    }
                }
                diagram.model.removeArrayItem(stateData.globalEvents, eventIndex);
                if (stateData.globalEvents.length == 0)
                    diagram.model.setDataProperty(stateData, "hasGlobalEvents", false);
            }
        });
    },

    modifyEvent (stateName, eventName, newEventName) {

    },

    linkTo (stateName, eventName, toState) {
        var vue = gdk_fsm.vue;
        Editor.Scene.callSceneScript('gdk-fsm', 'a-link', vue.fsmCom.value.uuid.value, stateName, eventName, toState);
    },

    showEventInputPanel () {
        var panel = gdk_fsm.panel;
        var self = this;
        var diagram = gdk_fsm.diagram;
        var p = panel.$customEventPanel;
        p.style.display = "block";
        var mousePt = diagram.lastInput.viewPoint;
        p.style.left = mousePt.x + "px";
        p.style.top = mousePt.y + "px";
        panel.$customEventMask.style.display = "block";
        panel.$customEventMask.onmousedown = function (e) {
            self.hideEventInputPanel();
        }
        Editor.UI.focus(panel.$customEventPanelInput);
        panel.$customEventPanelInput.$input.focus();
    },
    hideEventInputPanel () {
        var panel = gdk_fsm.panel;
        panel.$customEventPanel.style.display = "none";
        panel.$customEventPanelSelect.style.display = "none";
        panel.$customEventMask.style.display = "none";
    },
};

module.exports = FsmEvent;