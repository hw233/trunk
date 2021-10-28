/**
 * 场景脚本
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-04-19 10:22:19
 */

// var gdk = cc.require("gdk.dist");
if (!gdk) {
    Editor.console.error("请先执行 require('gdk.dist'); 导入gdk组件。");
    return;
}

const Fs = cc.require('fire-fs');
const Path = cc.require('path');
let search = function (scene, uuid) {
    var result = false;
    var path = scene.path;
    try {
        var json = Fs.readJsonSync(path);
    } catch (error) {
        return false;
    }

    function some (item) {
        if (item.__type__ === uuid) {
            result = item;
            return true;
        }
        for (var name in item) {
            var prop = item[name];
            if (prop &&
                typeof prop === 'object' &&
                prop.__type__) {
                return some(prop);
            }
        }
        return false;
    };
    json.some(some);
    return result;
};

module.exports = {
    'get-scene-uuid': function (e) {
        let url = _Scene.title();
        if (url && url != '') {
            Editor.assetdb.queryUuidByUrl(url, (err, uuid) => {
                e.reply && e.reply(err, uuid);
            });
        } else {
            let s = cc.director.getScene();
            let uuid = Editor.Utils.UuidUtils.decompressUuid(s.uuid);
            e.reply && e.reply(null, uuid);
        }
    },
    'get-all-scene': function (e) {
        // var uuid = 'Fsm'; //82c30TfLL5H/bhHcqHqJiuy //Editor.Utils.UuidUtils.decompressUuid()
        Editor.assetdb.queryAssets('db://assets/**\/*', ['scene', 'prefab'], function (err, assets) {
            var obj = {};
            if (!err) {
                var FsmNamesId = gdk.fsm.FsmNamesId;
                var fsmNames = {
                    None: -1
                };
                assets.forEach(function (asset) {
                    if (obj[asset.path]) return;
                    let item = search(asset, "Fsm");
                    if (item) {
                        obj[asset.path] = {
                            name: Path.basename(asset.path),
                            type: asset.type,
                            path: asset.path,
                            uuid: asset.uuid,
                        };
                        // 创建一个枚举类型数据
                        fsmNames[item.fsmName] = item.fsmName;
                    }
                });
                // 清除旧的数据并设置新数据
                for (var prop in FsmNamesId) {
                    if (typeof FsmNamesId[prop] != 'function') {
                        delete FsmNamesId[prop];
                    }
                }
                FsmNamesId.__value__ = {};
                FsmNamesId.mixins(fsmNames);
            }
            e.reply && e.reply(err, Object.values(obj));
        });
    },
    // 'load-scene-by-uuid': function (e, uuid) {
    //     let err = null;
    //     try {
    //         _Scene.loadSceneByUuid(uuid);
    //     } catch (error) {
    //         err = error;
    //     }
    //     e.reply && e.reply(err);
    // },

    "get-node-dump": function (e, nodeId) {
        if (e.reply) {
            let node = cc.engine.getInstanceById(nodeId);
            var json = Editor.getNodeDump(node);
            // var t = JSON.stringify(json);
            e.reply(null, json);
        }
    },

    "m-fsm": function (e, id, p) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            for (var i in p) {
                if (i in p && i in fsm)
                    fsm[i] = p[i];
            }
        }
    },

    "a-state": function (e, id, x, y) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            var state = new gdk.fsm.FsmState();
            state.stateName = _getStateName(fsm.states);
            state.x = x;
            state.y = y;
            var n = fsm.states.length;
            fsm.states.push(state);
            if (fsm.startState == null || fsm.startState == "") {
                fsm.startState = state.stateName;
            }
            e.reply && e.reply(null)
            // Editor.Ipc.sendToPanel('scene', 'scene:query-node', t.node.uuid, (error, dump) => {
            //     if (error) {
            //         Editor.error(error);
            //         if (e.reply)
            //             e.reply(error, null)
            //         return;
            //     }
            //     let node = JSON.parse(dump);
            //     for (let j = 0; j < node.value.__comps__.length; j++) {
            //         let com = node.value.__comps__[j];
            //         if (com.value.uuid.value == id) {
            //             state = com.value.fsm.value.states.value[n];
            //             if (e.reply)
            //                 e.reply(null, JSON.stringify(state))
            //             break;
            //         }
            //     }
            // });
        }
    },
    "d-state": function (e, id, stateName) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            var index = -1;
            var err = null;
            for (var i = 0; i < fsm.states.length; i++) {
                var state = fsm.states[i];
                if (state.stateName == stateName) {
                    index = i;
                    fsm.states.splice(i, 1);
                    break;
                }
            }
            if (fsm.startState == stateName) {
                if (fsm.states.length > 0)
                    fsm.startState = fsm.states[0].stateName;
                else
                    fsm.startState = null;
            }
            for (var i = 0; i < fsm.states.length; i++) {
                var state = fsm.states[i];
                for (var j = state.transitions.length - 1; j >= 0; j--) {
                    var transition = state.transitions[j];
                    if (transition.toState == stateName) {
                        transition.toState = null;
                    }
                }
            }
            for (var j = fsm.globalTransitions.length - 1; j >= 0; j--) {
                var transition = fsm.globalTransitions[j];
                if (transition.toState == stateName) {
                    fsm.globalTransitions.splice(j, 1);
                }
            }
            if (e.reply) {
                e.reply(index == -1 ? `找不到状态${stateName}` : null, index);
            }
        }
    },
    "m-state": function (e, id, stateName, p) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            var isReplaceName = false;
            var newStateName = stateName;
            var err = null;
            for (var i = 0; i < fsm.states.length; i++) {
                var state = fsm.states[i];
                if (state.stateName == stateName) {
                    for (var k in p) {
                        if (k in p && (k in state)) {
                            if (k == "stateName") {
                                newStateName = p[k];
                                if (_hasStateName(fsm.states, newStateName) == false) {
                                    state[k] = p[k];
                                } else {
                                    newStateName = stateName;
                                    err = "已存在同名状态";
                                    break;
                                }
                            } else {
                                state[k] = p[k];
                            }
                        }
                    }
                    break;
                }
            }
            if (newStateName != stateName) {
                for (var i = 0; i < fsm.states.length; i++) {
                    var state = fsm.states[i];
                    for (var k = 0; k < state.transitions.length; k++) {
                        var transition = state.transitions[k];
                        if (transition.toState == stateName) {
                            transition.toState = newStateName;
                        }
                    }
                }
                for (var i = 0; i < fsm.globalTransitions.length; i++) {
                    var transition = fsm.globalTransitions[i];
                    if (transition.toState == stateName) {
                        transition.toState = newStateName;
                    }
                }
                if (fsm.startState == stateName) {
                    fsm.startState = newStateName;
                }
            }
        }
        e.reply && e.reply(err);
    },
    "m-start": function (e, id, stateName) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            fsm.startState = stateName;
        }
    },
    "get-all-fsm-events": function (e) {
        var obj = {};
        for (var key in gdk.fsm.FsmEventId) {
            obj[key] = gdk.fsm.FsmEventId.getValue(key);
        }
        if (e.reply) {
            e.reply(null, obj);
        }
    },
    "a-event": function (e, id, stateName, eventName, isGlobal, indexAt, isRename) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            var index = -1;
            var err = null;
            if (isGlobal) {
                if (isRename) {
                    fsm.globalTransitions[indexAt].eventName = eventName
                } else {
                    var hasEvent = false;
                    for (var i = 0; i < fsm.globalTransitions.length; i++) {
                        if (fsm.globalTransitions[i].eventName == eventName) {
                            hasEvent = true;
                            if (fsm.globalTransitions[i].toState == stateName) {
                                err = "已存在相同的事件";
                            } else {
                                fsm.globalTransitions[i].toState = stateName;
                            }
                            break;
                        }
                    }
                    if (hasEvent == false) {
                        var tan = new gdk.fsm.FsmTransition();
                        tan.eventName = eventName;
                        tan.toState = stateName;
                        fsm.globalTransitions.push(tan);
                    }
                }
            } else {
                if (isRename) {
                    var state = _getStateByName(id, stateName);
                    var tan = state.transitions[indexAt];
                    if (tan.eventName == eventName) {
                        return;
                    } else {
                        if (_hasEvent(state, eventName)) {
                            err = "已存在相同的事件";
                        } else {
                            tan.eventName = eventName;
                        }
                    }
                } else {
                    for (var i = 0; i < fsm.states.length; i++) {
                        var state = fsm.states[i];
                        if (state.stateName == stateName) {
                            index = i;
                            if (_hasEvent(state, eventName)) {
                                err = "已存在相同的事件";
                            } else {
                                var tan = new gdk.fsm.FsmTransition();
                                tan.eventName = eventName;
                                if (indexAt == -1) {
                                    state.transitions.push(tan);
                                } else {
                                    state.transitions.splice(indexAt, 0, tan);
                                }
                            }
                            break;
                        }
                    }
                }
            }
            e.reply && e.reply(err, index);
        }
    },
    "d-event": function (e, id, stateName, eventName) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            var index = -1;
            var eventIndex = -1;
            for (var i = 0; i < fsm.states.length; i++) {
                var state = fsm.states[i];
                if (state.stateName == stateName) {
                    index = i;

                    for (var k = 0; k < state.transitions.length; k++) {
                        var transition = state.transitions[k];
                        if (transition.eventName == eventName) {
                            eventIndex = k;
                            state.transitions.splice(k, 1);
                            break;
                        }
                    }
                    break;
                }
            }
            if (e.reply) {
                var err = null;
                if (index == -1) {
                    err = `找不到状态${stateName}`;
                } else if (eventIndex == -1) {
                    err = `找不到事件${eventName}`;
                }
                e.reply(err, index, eventIndex)
            }
        }
    },
    "up-event": function (e, id, stateName, eventName) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            var index = -1;
            var eventIndex = -1;
            for (var i = 0; i < fsm.states.length; i++) {
                var state = fsm.states[i];
                if (state.stateName == stateName) {
                    index = i;
                    for (var k = 0; k < state.transitions.length; k++) {
                        var transition = state.transitions[k];
                        if (transition.eventName == eventName) {
                            eventIndex = k;
                            if (eventIndex > 0) {
                                var eventData = state.transitions[k];
                                state.transitions.splice(k, 1);
                                state.transitions.splice(k - 1, 0, eventData);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            if (e.reply) {
                var err = null;
                if (index == -1) {
                    err = `找不到状态${stateName}`;
                } else if (eventIndex == -1) {
                    err = `找不到事件${eventName}`;
                }
                e.reply(err, index, eventIndex)
            }
        }
    },
    "down-event": function (e, id, stateName, eventName) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            var index = -1;
            var eventIndex = -1;
            for (var i = 0; i < fsm.states.length; i++) {
                var state = fsm.states[i];
                if (state.stateName == stateName) {
                    index = i;
                    for (var k = 0; k < state.transitions.length; k++) {
                        var transition = state.transitions[k];
                        if (transition.eventName == eventName) {
                            eventIndex = k;
                            if (eventIndex < state.transitions.length - 1) {
                                var eventData = state.transitions[k];
                                state.transitions.splice(k, 1);
                                state.transitions.splice(k + 1, 0, eventData);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            if (e.reply) {
                var err = null;
                if (index == -1) {
                    err = `找不到状态${stateName}`;
                } else if (eventIndex == -1) {
                    err = `找不到事件${eventName}`;
                }
                e.reply(err, index, eventIndex)
            }
        }
    },
    "d-global-event": function (e, id, eventName) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            var eventIndex = -1;
            for (var k = 0; k < fsm.globalTransitions.length; k++) {
                var transition = fsm.globalTransitions[k];
                if (transition.eventName == eventName) {
                    eventIndex = k;
                    fsm.globalTransitions.splice(k, 1);
                    break;
                }
            }
            if (e.reply) {
                var err = null;
                if (eventIndex == -1) {
                    err = `找不到事件${eventName}`;
                }
                e.reply(err, eventIndex)
            }
        }
    },
    "a-link": function (e, id, stateName, eventName, toState) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            let fsm = t.fsm;
            for (var i = 0; i < fsm.states.length; i++) {
                var state = fsm.states[i];
                if (state.stateName == stateName) {
                    for (var k = 0; k < state.transitions.length; k++) {
                        var transition = state.transitions[k];
                        if (transition.eventName == eventName) {
                            transition.toState = toState;
                            break;
                        }
                    }
                    break;
                }
            }
        }
    },
    "get-all-actions": function (e) {
        var obj = {};
        var types = gdk.fsm.Fsm.actionList;
        for (var type in types) {
            var actions = types[type];
            obj[type] = [];
            for (var name in actions) {
                var info = actions[name];
                obj[type].push({
                    action: info.action.name,
                    type: info.type,
                    info: info.info
                });
            }
        }
        e.reply && e.reply(null, obj);
    },
    "a-action": function (e, id, stateName, actionName, atIndex) {
        var t = cc.engine.getInstanceById(id);
        if (t) {
            var fsm = t.fsm;
            var obj = {};
            var types = gdk.fsm.Fsm.actionList;
            for (var type in types) {
                var actions = types[type];
                obj[type] = [];
                for (var name in actions) {
                    var info = actions[name];
                    obj[info.action.name] = info.action;
                }
            }
            // var t = cc.engine.getInstanceById(id);
            var index = -1;
            var err = null;
            var state = null;
            var n = -1;
            for (var i = 0; i < fsm.states.length; i++) {
                let stateTemp = fsm.states[i];
                if (stateTemp.stateName == stateName) {
                    index = i;
                    state = stateTemp;
                    break;
                }
            }
            if (state) {
                var A = obj[actionName.action];
                if (A) {
                    var action = new A();
                    // action.actionName=actionName.info.actionName
                    n = state.actions.length;
                    if (atIndex == null || atIndex < 0 || atIndex >= n)
                        state.actions.push(action);
                    else
                        state.actions.splice(atIndex, 0, action);
                } else {
                    err = "动作不存在";
                }
            } else {
                err = "状态不存在";
            }
            e.reply && e.reply(err);
            !e.reply && Editor.Ipc.sendToPanel("gdk-fsm", "sync-scene");
        }
    },
    "m-action": function (e, id, p) {
        let action = cc.engine.getInstanceById(id);
        if (action) {
            for (var i in p) {
                if (i in p && i in action) {
                    var s = p[i];
                    if (s.type == "cc.Node") {
                        action[i] = cc.engine.getInstanceById(s.value.uuid);
                    } else if (s.type == "cc.Asset") {
                        cc.AssetLibrary.loadAsset(s.value.uuid, function (s, o) {
                            if (o instanceof cc.Prefab) {
                                action[i] = o;
                            } else if (o instanceof cc.RawAsset) {
                                action[i] = o.url
                            } else {
                                action[i] = o;
                            }
                        });
                    } else if (s.type == "cc.Color") {
                        action[i] = new cc.Color(s.value);
                    } else if (s.type == "cc.Vec2") {
                        action[i] = new cc.Vec2(s.value.x, s.value.y);
                    } else {
                        action[i] = s.value;
                    }
                }
            }
        }
    },
    "m-action-array": function (e, id, p, index) {
        let action = cc.engine.getInstanceById(id);
        if (action) {
            for (var i in p) {
                if (i in p && i in action) {
                    var s = p[i];
                    if (s.type == "cc.Node") {
                        action[i][index] = cc.engine.getInstanceById(s.value.uuid);
                    } else if (s.type == "cc.Asset") {
                        cc.AssetLibrary.loadAsset(s.value.uuid, function (s, o) {
                            if (o instanceof cc.Prefab) {
                                action[i] = o;
                            } else if (o instanceof cc.RawAsset) {
                                action[i] = o.url
                            } else {
                                action[i] = o;
                            }
                        });
                    } else if (s.type == "cc.Color") {
                        action[i][index] = new cc.Color(s.value);
                    } else if (s.type == "cc.Vec2") {
                        action[i][index] = new cc.Vec2(s.value.x, s.value.y);
                    } else {
                        action[i][index] = s.value;
                    }
                }
            }
        }
    },
    "m-action-array-length": function (e, id, p, n, type) {
        let action = cc.engine.getInstanceById(id);
        if (action) {
            if (p in action) {
                var arr = action[p];
                if (arr.length < n) {
                    for (var i = arr.length; i < n; i++) {
                        var o;
                        if (type == "String") {
                            o = "";
                        } else if (type == "Float" || type == "Integer" || type == "Enum") {
                            o = 0;
                        } else if (type == "Boolean") {
                            o = true;
                        } else if (type == "cc.Color") {
                            o = new cc.Color();
                        } else if (type == "cc.Vec2") {
                            o = new cc.Vec2();
                        }
                        arr.push(o);
                    }
                } else
                    action[p].length = n;
            }
            if (e.reply) {
                e.reply(null);
            }
        }
    },
    "action-at"(e, id, stateName, index, toIndex) {
        let state = _getStateByName(id, stateName);
        var action = state.actions[index];
        state.actions.splice(index, 1);
        state.actions.splice(toIndex, 0, action);
    },
    "action-up"(e, id, stateName, index) {
        if (index > 0) {
            let state = _getStateByName(id, stateName);
            var action = state.actions[index];
            state.actions.splice(index, 1);
            state.actions.splice(index - 1, 0, action);
        }
    },
    "action-down"(e, id, stateName, index) {
        let state = _getStateByName(id, stateName);
        if (index < state.actions.length - 1) {
            var action = state.actions[index];
            state.actions.splice(index, 1);
            state.actions.splice(index + 1, 0, action);
        }
    },
    "action-delete"(e, id, stateName, index) {
        let state = _getStateByName(id, stateName);
        state.actions.splice(index, 1);
    }
};

function _getStateByName (fsmUuid, stateName) {
    var t = cc.engine.getInstanceById(fsmUuid);
    if (t) {
        let fsm = t.fsm;
        for (var i = 0; i < fsm.states.length; i++) {
            var state = fsm.states[i];
            if (state.stateName == stateName) {
                return state;
            }
        }
    }
    return null;
}

function _hasGlobalEvent (fsm, eventName) {
    for (var i = 0; i < fsm.globalTransitions.length; i++) {
        if (fsm.globalTransitions[i].eventName == eventName)
            return true;
    }
    return false;
}

function _hasEvent (state, eventName) {
    for (var i = 0; i < state.transitions.length; i++) {
        if (state.transitions[i].eventName == eventName)
            return true;
    }
    return false;
}

function _getStateDump (node, fsmComId, stateName) {
    for (let j = 0; j < node.value.__comps__.length; j++) {
        let com = node.value.__comps__[j];
        if (com.value.uuid.value == fsmComId) {
            var states = com.value.fsm.value.states.value;
            for (var k = 0; k < states.length; k++) {
                var state = states[k];
                if (state.value.stateName.value == stateName)
                    return state;
            }
            break;
        }
    }
}

function _getStateName (states) {
    var name;
    var i = 1;
    while (true) {
        name = "State" + i;
        if (_hasStateName(states, name) == false)
            break;
        i++;
    }
    return name;
}

function _hasStateName (states, name) {
    for (var i = 0; i < states.length; i++) {
        if (states[i].stateName == name)
            return true;
    }
    return false;
}