'use strcit';

const Utils = Editor.require("packages://inspector/utils/utils");
const Fs = require('fire-fs');
const Path = require('path');

/////////  场景操作  ///////////

var FsmScene = {
    syncScene () {
        // Editor.log("sync fsm-Scene.");
        Editor.Scene.callSceneScript('gdk-fsm', 'get-scene-uuid', (error, uuid) => {
            if (error) {
                return Editor.error(error);
            }
            var vue = gdk_fsm.vue;
            vue.currentSceneUuid = uuid;

            vue.fsmNodes = [];
            vue.allfsmComs.length = 0;
            // 查询FSM组件节点
            Editor.Ipc.sendToPanel('scene', 'scene:query-nodes-by-comp-name', 'FsmComponent', (error, nodes) => {
                if (error) {
                    return Editor.error(error);
                }
                var len = nodes.length;
                if (len == 0) {
                    // 不存在FSM节点
                    vue.fsmCom = null;
                    vue.currenFsmuuid = null;
                } else {
                    for (let i = 0; i < len; i++) {
                        Editor.Scene.callSceneScript('gdk-fsm', 'get-node-dump', nodes[i], (error, dump) => {
                            if (error) {
                                return Editor.error(error);
                            }
                            // let node = JSON.parse(dump);
                            let node = dump;
                            Utils.buildNode("target", node.value, node.types);
                            vue.fsmNodes.push(node);
                            for (let j = 0; j < node.value.__comps__.length; j++) {
                                let com = node.value.__comps__[j];
                                if (node.types[com.type].name == "FsmComponent") {
                                    vue.allfsmComs.push(com);
                                }
                            }
                            // 最后一个节点，设置当前节点值
                            if (i == len - 1) {
                                if (vue.currenFsmuuid == null && vue.fsmCom) {
                                    vue.currenFsmuuid = vue.fsmCom.value.uuid.value;
                                }
                                this.setCurrentFsmCom(vue.currenFsmuuid);
                                vue.currenFsmuuid = null;
                            }
                        });
                    }
                }
            });
        });
    },

    getAllScenes () {
        var vue = gdk_fsm.vue;
        Editor.Scene.callSceneScript('gdk-fsm', 'get-all-scene', (error, json) => {
            if (error) {
                return Editor.error(error);
            }
            vue.allScenes = json;
            Editor.Scene.callSceneScript('gdk-fsm', 'get-scene-uuid', (error, uuid) => {
                if (error) {
                    return Editor.error(error);
                }
                vue.currentSceneUuid = uuid;
            });
        });
    },

    setCurrentFsmCom (uuid) {
        var vue = gdk_fsm.vue;
        if (uuid) {
            for (var i = 0; i < vue.allfsmComs.length; i++) {
                var com = vue.allfsmComs[i];
                if (com.value.uuid.value == uuid) {
                    vue.fsmCom = com;
                    return;
                }
            }
        }
        var selectNode = Editor.Selection.curSelection('node');
        if (selectNode) {
            for (var i = 0; i < vue.allfsmComs.length; i++) {
                var com = vue.allfsmComs[i];
                if (com.value.node.value.uuid == selectNode) {
                    vue.fsmCom = com;
                    return;
                }
            }
        }
        vue.fsmCom = vue.allfsmComs[0];
    },
};

module.exports = FsmScene;