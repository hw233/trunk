'use strcit';

const Fs = require('fs');
const Path = require('path');
const Utils = Editor.require("packages://inspector/utils/utils");

/////////  操作状态  ///////////

var FsmState = {
  addState(x = 0, y = 0) {
    var vue = gdk_fsm.vue;
    Editor.Scene.callSceneScript('gdk-fsm', 'a-state', vue.fsmCom.value.uuid.value, x, y, (error) => {
      if (error) {
        return Editor.error(error);
      }
      gdk_fsm.FsmScene.syncScene();
      // let state = JSON.parse(dump);
      // if (vue.fsmCom) {
      //   vue.fsmCom.value.fsm.value.states.value.push(state);
      //   diagram.model.addNodeData({
      //     isStart: false,
      //     stateName: state.value.stateName.value,
      //     stateDescription: "",
      //     loc: `${x} ${y}`,
      //     events: []
      //   });
      // }
    });
  },

  deleteState(stateName, hasDelete) {
    var vue = gdk_fsm.vue;
    Editor.Scene.callSceneScript('gdk-fsm', 'd-state', vue.fsmCom.value.uuid.value, stateName, (error, index) => {
      if (error) {
        return Editor.error(error);
      }
      gdk_fsm.FsmScene.syncScene();
      // if (vue.fsmCom) {
      //   var states = vue.fsmCom.value.fsm.value.states.value;
      //   states.splice(index, 1);
      //   if (hasDelete == false)
      //     diagram.model.removeNodeData(diagram.model.nodeDataArray[index]);
      // }
    });
  },

  modifyState(stateName, o, callback) {
    var vue = gdk_fsm.vue;
    Editor.Scene.callSceneScript('gdk-fsm', 'm-state', vue.fsmCom.value.uuid.value, stateName, o, callback);
  },

  setStart(stateName) {
    var vue = gdk_fsm.vue;
    Editor.Scene.callSceneScript('gdk-fsm', 'm-start', vue.fsmCom.value.uuid.value, stateName);
    if (vue.fsmCom) {
      vue.fsmCom.value.fsm.value.startState.value = stateName;
    }
    var diagram = gdk_fsm.diagram;
    for (var i = 0; i < diagram.model.nodeDataArray.length; i++) {
      var node = diagram.model.nodeDataArray[i];
      if (node.isStart && node.stateName != stateName) {
        diagram.model.setDataProperty(node, "isStart", false);
      } else if (node.stateName == stateName && node.isStart == false) {
        diagram.model.setDataProperty(node, "isStart", true);
      }
    }
  },
}

module.exports = FsmState;