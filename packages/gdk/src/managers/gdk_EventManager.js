var Event = require("../core/gdk_Event");
var EventTrigger = require("../core/gdk_EventTrigger");
var _eventTriggerDic = {}; // 所有的事件

/**
 * 事件管理器, 像一个事件中心。
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-04-09 15:33:22
 */
var EventManager = {
    /**
     * 注册一个事件回调，回调参数为Event
     * @method on
     * @param {string} eventType  事件类型
     * @param {callback} callback 回调
     * @param {any} thisArg  回调的this
     * @param {number} priority 优先级
     * @param {boolean} hasEventArg 回调是否带Event实例
     */
    on (eventType, callback, thisArg = null, priority = 0, hasEventArg = true) {
        var trigger = EventManager._getEventTrigger(eventType, true);
        trigger && trigger.on(callback, thisArg, priority, hasEventArg);
    },

    once (eventType, callback, thisArg = null, priority = 0, hasEventArg = true) {
        var trigger = EventManager._getEventTrigger(eventType, true);
        trigger && trigger.once(callback, thisArg, priority, hasEventArg);
    },

    /**
     * 取消一个事件监听
     * @method off
     * @param {string} eventType  事件类型
     * @param {call} callback  回调
     */
    off (eventType, callback, thisArg = null) {
        var trigger = EventManager._getEventTrigger(eventType, false);
        if (trigger) {
            trigger.off(callback, thisArg);
            if (trigger.count < 1) {
                EventManager._putEventTrigger(eventType);
            }
        }
    },

    /**
     * 取消所有eventType类型的事件监听
     * @param {string} eventType 
     */
    offAll (eventType) {
        var trigger = EventManager._getEventTrigger(eventType, false);
        if (trigger) {
            trigger.offAll();
            EventManager._putEventTrigger(eventType);
        }
    },

    /**
     * 取消这个对象注册的所有监听
     * @method targetOff
     * @param {any} thisArg 
     */
    targetOff (thisArg) {
        var trigger;
        for (var eventType in _eventTriggerDic) {
            trigger = _eventTriggerDic[eventType];
            trigger.targetOff(thisArg);
            if (trigger.count < 1) {
                EventManager._putEventTrigger(eventType);
            }
        }
    },

    /**
     * 指定事件回调是否已经注册
     * @method  has
     * @param {string} eventType 
     * @param {callback} callback 
     */
    has (eventType, callback, thisArg = null) {
        var trigger = EventManager._getEventTrigger(eventType, false);
        if (trigger) {
            if (callback) {
                return trigger.has(callback, thisArg);
            }
            return trigger.count > 0
        }
        return false;
    },

    /**
     * 获取指定事件类型的触发器，
     * @method _getEventTrigger
     * @param {string} eventType 事件类型
     * @param {boolen} autoCreate 不存在时，是否创建 ，默认false
     */
    _getEventTrigger (eventType, autoCreate = false) {
        if (eventType == null || eventType == "") {
            return null;
        }
        var trigger = _eventTriggerDic[eventType];
        if (trigger == null && autoCreate) {
            trigger = _eventTriggerDic[eventType] = EventTrigger.get();
        }
        return trigger;
    },

    /**
     * 回收指定类型的触发器
     * @param {string} eventType 
     */
    _putEventTrigger (eventType) {
        var trigger = _eventTriggerDic[eventType];
        if (trigger) {
            delete _eventTriggerDic[eventType];
            EventTrigger.put(trigger);
        }
    },

    /**
     * 派发事件
     * @method emit
     * @param {string} eventType  事件类型
     * @param {any} data 事件数据 默为null
     * @param {number} code 事件状态码或错误码，默认0
     * @returns {any} 事件回调函数里的return返回值
     */
    emit (eventType, data = null, code = 0) {
        var trigger = EventManager._getEventTrigger(eventType, false);
        if (trigger) {
            var event = Event.get(eventType, data);
            event.code = code;
            var returnData = trigger.emit(event);
            event.release(false);
            return returnData;
        }
    },

    getEventCount (eventType) {
        if (eventType) {
            let trigger = EventManager._getEventTrigger(eventType, false);
            if (trigger) {
                return trigger.count;
            }
            return 0;
        } else {
            let count = 0;
            for (let eventType in _eventTriggerDic) {
                let trigger = _eventTriggerDic[eventType];
                count += trigger.count;
            }
            return count;
        }
    },
};

// 添加一个隐藏的属性
cc.js.get(EventManager, "__all__", function () {
    return _eventTriggerDic;
});

module.exports = EventManager;