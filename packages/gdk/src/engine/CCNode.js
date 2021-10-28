/**
 * 注入cc.Node
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-26 12:09:29
 */

let NodeTool = require("../Tools/gdk_NodeTool");
let Node = cc.Node;
let proto = Node.prototype;

// // 修复CCNode中_globalOrderOfArrival溢出导致图层错位
// proto._updateOrderOfArrival = function () {};
// proto._onSetParent = function (value) {
//     if (value) {
//         (value._arrivalOrder === void 0) && (value._arrivalOrder = 1);
//         this._localZOrder = (this._localZOrder & 0xffff0000) | (value._arrivalOrder++);
//     }
// };

/**
 * 直接返回节点的_position属性，而不是新建一个cc.Vec2返回
 */
proto.getPos = proto.getPosition;

/**
 * 注入node
 * @param {*} isEffect 
 * @param {*} callback 
 * @param {*} thisArg 
 */
proto.show = function (isEffect = true, callback = null, thisArg = null) {
    NodeTool.show(this, isEffect, callback, thisArg)
};

proto.hide = function (isEffect = true, callback = null, thisArg = null) {
    NodeTool.hide(this, isEffect, callback, thisArg)
};

Object.defineProperty(proto, "isShow", {
    get: function () {
        return NodeTool.isShow(this);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(proto, "onStartShow", {
    get: function () {
        return NodeTool.onStartShow(this);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(proto, "onShow", {
    get: function () {
        return NodeTool.onShow(this);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(proto, "onStartHide", {
    get: function () {
        return NodeTool.onStartHide(this);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(proto, "onHide", {
    get: function () {
        return NodeTool.onHide(this);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(proto, "visible", {
    get: function () {
        return this._$N_visible !== false;
    },
    set: function (v) {
        if (v === false) {
            this._$N_visible = false;
        }
        delete this._$N_visible;
    },
    enumerable: true,
    configurable: true
});

// 禁用多点触控
var _currNode = null;
var _pausedNode = false;
var _touchEvents = ['touchstart', 'touchmove'];

function validTouchNode () {
    if (!_pausedNode && cc.isValid(_currNode) && _currNode.activeInHierarchy) {
        for (let i = 0, n = _touchEvents.length; i < n; i++) {
            if (_currNode.hasEventListener(_touchEvents[i])) {
                return true;
            }
        }
    }
    return false;
};

var _dispatchEvent = proto.dispatchEvent;
proto.dispatchEvent = function (event) {
    if (require('../gdk').macro.ENABLE_MULTI_TOUCH) {
        _dispatchEvent.call(this, event);
        return;
    }
    switch (event.type) {
        case 'touchstart':
        case 'touchmove':
            if (!validTouchNode()) {
                _currNode = this;
                _pausedNode = false;
            } else if (_currNode !== this) {
                return;
            }
            break;

        case 'touchend':
        case 'touchcancel':
            if (_currNode !== this) {
                // 清除当前点击节点，防止异常卡住点击的问题
                _currNode = null;
                _pausedNode = false;
                return;
            }
            _currNode = null;
            _pausedNode = false;
            break;
    }
    _dispatchEvent.call(this, event);
};

var _onPostActivated = proto._onPostActivated;
proto._onPostActivated = function (active) {
    if (_currNode === this) {
        _currNode = null;
        _pausedNode = false;
    }
    _onPostActivated.call(this, active);
};

var _onPreDestroy = proto._onPreDestroy;
proto._onPreDestroy = function () {
    if (_currNode === this) {
        _currNode = null;
        _pausedNode = false;
    }
    _onPreDestroy.call(this);
};

var _pauseSystemEvents = proto.pauseSystemEvents;
proto.pauseSystemEvents = function (recursive) {
    if (recursive && _currNode) {
        let temp = _currNode;
        while (temp) {
            if (temp === this) {
                _pausedNode = true;
                break;
            }
            temp = temp.parent;
        }
    } else if (_currNode === this) {
        _pausedNode = true;
    }
    _pauseSystemEvents.call(this, recursive);
};

var _resumeSystemEvents = proto.resumeSystemEvents;
proto.resumeSystemEvents = function (recursive) {
    if (recursive && _currNode) {
        let temp = _currNode;
        while (temp) {
            if (temp === this) {
                _pausedNode = false;
                break;
            }
            temp = temp.parent;
        }
    } else if (_currNode === this) {
        _pausedNode = false;
    }
    _resumeSystemEvents.call(this, recursive);
};

// 修复2.4.3事件泄漏问题
proto.once = function (type, callback, target, useCapture) {
    let forDispatch = this._checknSetupSysEvent(type);
    let listeners = null;
    if (forDispatch && useCapture) {
        listeners = this._capturingListeners = this._capturingListeners || new cc.EventTarget();
    } else {
        listeners = this._bubblingListeners = this._bubblingListeners || new cc.EventTarget();
    }
    listeners.once(type, callback, target);
};