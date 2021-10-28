'use strcit';

const Fs = require('fs');
const Path = require('path');
const Utils = Editor.require("packages://inspector/utils/utils");

/////////  鼠标动作  ///////////

var FsmClick = {
    eventDoubleClicked(event, obj) {

    },

    nodeDoubleClicked(event, obj) {

    },

    menuClick(event, cmd, data) {
        var vue = gdk_fsm.vue;
        var diagram = gdk_fsm.diagram;
        if (cmd == "addState") {
            var lastInput = diagram.lastInput;
            gdk_fsm.FsmState.addState(lastInput.documentPoint.x, lastInput.documentPoint.y);
        } else if (cmd == "deleteState") {
            gdk_fsm.FsmState.deleteState(diagram.currentTool.currentObject.part.data.stateName);
        } else if (cmd == "addEvent") {
            vue.isInputEventGlobal = false;
            vue.menuIsRenameEvent = false;
            vue.inputEventString = "";
            if (data) {
                gdk_fsm.FsmEvent.addEvent(data);
            } else {
                gdk_fsm.FsmEvent.showEventInputPanel();
            }
        } else if (cmd == "addGlobalEvent") {
            vue.inputEventString = "";
            vue.isInputEventGlobal = true;
            vue.menuIsRenameEvent = false;
            gdk_fsm.FsmEvent.showEventInputPanel();
        } else if (cmd == "deleteEvent") {
            gdk_fsm.FsmEvent.deleteEvent(
                diagram.currentTool.currentObject.part.data.stateName,
                diagram.currentTool.currentObject.data.eventName
            );
        } else if (cmd == "deleteGlobalEvent") {
            gdk_fsm.FsmEvent.deleteGlobalEvent(
                diagram.currentTool.currentObject.part.data.stateName,
                diagram.currentTool.currentObject.data.eventName
            );
        } else if (cmd == "deleteTransition") {
            var stateName = diagram.currentTool.currentObject.part.data.stateName;
            var eventName = diagram.currentTool.currentObject.data.eventName;
            gdk_fsm.FsmEvent.linkTo(stateName, eventName, null);
            var linkDataArray = diagram.model.linkDataArray;
            for (var i = 0; i < linkDataArray.length; i++) {
                var link = linkDataArray[i];
                if (link.from == stateName && link.fromEvent == eventName) {
                    diagram.model.removeLinkData(link);
                    break;
                }
            }
        } else if (cmd == "setStart") {
            gdk_fsm.FsmState.setStart(diagram.currentTool.currentObject.part.data.stateName);

        } else if (cmd == "upEvent") {
            gdk_fsm.FsmEvent.upEvent(
                diagram.currentTool.currentObject.part.data.stateName,
                diagram.currentTool.currentObject.data.eventName
            );
        } else if (cmd == "downEvent") {
            gdk_fsm.FsmEvent.downEvent(
                diagram.currentTool.currentObject.part.data.stateName,
                diagram.currentTool.currentObject.data.eventName
            );
        } else if (cmd == "renameEvent") {
            vue.isInputEventGlobal = false;
            vue.menuIsRenameEvent = true;
            gdk_fsm.FsmEvent.showEventInputPanel();
        } else if (cmd == "renameGlobalEvent") {
            vue.isInputEventGlobal = true;
            vue.menuIsRenameEvent = true;
            gdk_fsm.FsmEvent.showEventInputPanel();
        }
        diagram.currentTool.stopTool();
    },
};

module.exports = FsmClick;