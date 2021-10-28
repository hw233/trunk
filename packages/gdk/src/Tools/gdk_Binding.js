/**
 * 数据绑定
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-09-26 11:25:37
 */
const EventTrigger = require("../core/gdk_EventTrigger");
const PoolManager = require("../managers/gdk_PoolManager");

const __bindSourceObj__ = "__gdk_bindSourceObj__";
const __bindTargetObj__ = "__gdk_bindTargetObj__";

const USE_POOL = true;
const POOL_MAX = 999;
const POOL_CLEAR_TIME = 30;
var pool = {

    index: Object.create(null),
    get(c) {
        let k = '__gdk_bind__' + c.name;
        let v = PoolManager.get(k);
        if (!v) {
            v = new c();
        }
        return v;
    },

    put (v) {
        let k = '__gdk_bind__' + v.constructor.name;
        if (!this.index[k]) {
            this.index[k] = true;
            PoolManager.setSize(k, POOL_MAX);
            PoolManager.setClearTime(k, POOL_CLEAR_TIME);
        }
        PoolManager.put(k, v);
    },

};

/** @class */
function BindLinkObj () {

};
Object.defineProperty(BindLinkObj.prototype, "lastChild", {
    get: function () {
        if (this.children) {
            for (var p in this.children) {
                return this.children[p].lastChild;
            }
        } else {
            return this;
        }
    },
    enumerable: true,
    configurable: true
});
BindLinkObj.prototype.getLastChildren = function (arr) {
    arr = arr || [];
    if (this.children) {
        for (var p in this.children) {
            this.children[p].getLastChildren(arr);
        }
    } else {
        arr.push(this);
    }
    return arr;
};
BindLinkObj.prototype.findChild = function (source, prop) {
    if (this.source === source) {
        return this.children[prop];
    }
    if (this.children) {
        var l = void 0;
        for (var p in this.children) {
            l = this.children[p].findChild(source, prop);
            if (l) {
                return l;
            }
        }
    }
};
BindLinkObj.prototype.bind = function (source, bindTargetObj, targetProp) {
    if (this.source !== source) {
        if (this.handler) {
            this.handler.release();
            this.handler = null;
        }
        if (this.children &&
            source &&
            typeof (source) === 'object') {
            // 无子节点的连接无需绑定源
            this.source = source;
            this.handler = pool.get(PropChangedHandler);
            this.handler.bindTargetObj = bindTargetObj;
            this.handler.targetProp = targetProp;
            this.handler.on(source[__bindSourceObj__].onPropChanged);
        } else {
            this.source = null;
        }
    }
};
BindLinkObj.prototype.release = function () {
    this.handler && this.handler.release();
    if (this.children) {
        for (var p in this.children) {
            this.children[p].release();
        }
        this.children = null;
    }
    this.handler = null;
    this.source = null;
    this.parent = null;
    this.sourceProp = null;
    USE_POOL && pool.put(this);
};

/** @class */
function BindSourceObj () {
    this.onPropChanged = EventTrigger.get();
    this.sourcePropDic = {};
};
BindSourceObj.prototype.release = function () {
    this.onPropChanged.release();
    this.source = null;
    this.sourcePropDic = null;
    this.onPropChanged = null;
};

/** @class */
function PropChangedHandler () {

};
PropChangedHandler.prototype.on = function (v) {
    if (this.trigger) {
        this.trigger.off(this.onPropChanged, this);
    }
    this.trigger = v;
    if (v) {
        v.on(this.onPropChanged, this);
    }
};
PropChangedHandler.prototype.onPropChanged = function (source1, prop1, oldValue, newValue) {
    // 当前对象已经被销毁（预防同一事件链中的依赖冲突）
    if (!this.bindTargetObj) return;
    // 绑定目标对象属性链中是否包含更新的源对象和属性
    var bindTargetObj = this.bindTargetObj;
    var targetProp = this.targetProp;
    var link = bindTargetObj.getLink(targetProp, source1, prop1);
    if (!link)
        return;
    // link = link.children[prop1];
    // 绑定属性链的父属性改变，需要重新绑定父属性链
    if (link.children != null) {
        var links = link.getLastChildren();
        var n = links.length;
        if (n > 0) {
            var a = [];
            var l = null;
            for (var i = 0; i < n; i++) {
                l = links[i];
                // 为新值生成bindSource
                if (newValue != null) {
                    for (;;) {
                        a.unshift(l.sourceProp);
                        l = l.parent;
                        if (l === link) {
                            a.unshift(l.sourceProp);
                            break;
                        }
                    }
                    Utils.createBindSourceObj(source1, a, 0);
                }
                // 重新生成绑定目标
                l = a.length > 0 ? l.parent : l;
                while (l.parent) {
                    a.unshift(l.sourceProp);
                    l = l.parent;
                }
                l = bindTargetObj.bindLink(targetProp, l.source, a);
                a.length = 0;
            }
            l && bindTargetObj.updateBindValue(targetProp, l);
        }
    } else {
        // 更新的源目标是否为绑定目标对象所绑定的最终值
        bindTargetObj.updateBindValue(targetProp, link, oldValue, newValue);
    }
};
PropChangedHandler.prototype.release = function () {
    this.trigger && this.on();
    this.bindTargetObj = null;
    this.targetProp = null;
    USE_POOL && pool.put(this);
};

/** @class */
function BindTargetObj () {
    this.targetPropDic = {};
};
Object.defineProperty(BindTargetObj.prototype, "count", {
    get: function () {
        return Object.keys(this.targetPropDic).length;
    },
    enumerable: true,
    configurable: true
});
BindTargetObj.prototype.creatLink = function (targetProp, source, sourceProps) {
    var n = sourceProps.length;
    if (n < 1)
        return;
    var parent = this.targetPropDic[targetProp];
    if (!parent) {
        parent = this.targetPropDic[targetProp] = pool.get(BindLinkObj);
        parent.children = {};
    }
    // 创建树形结构
    var link = parent.children;
    for (var i = 0; i < n; i++) {
        var prop = sourceProps[i];
        if (!link[prop]) {
            link[prop] = pool.get(BindLinkObj);
            link[prop].parent = parent;
            link[prop].sourceProp = prop;
        }
        parent = link[prop];
        if (i < n - 1) {
            if (!link[prop].children) {
                link[prop].children = {};
            }
            link = link[prop].children;
        }
    }
    this.bindLink(targetProp, source, sourceProps);
};
BindTargetObj.prototype.bindLink = function (targetProp, source, sourceProps) {
    var parent = this.targetPropDic[targetProp];
    if (!parent)
        return;
    // 绑定根结点数据源
    parent.bind(source, this, targetProp);
    // 绑定子节点数据源
    var n = sourceProps.length;
    if (n > 0) {
        var s = source;
        var o = parent.children;
        var l = null;
        for (var i = 0; i < n; i++) {
            var p = sourceProps[i];
            l = o[p];
            s = s && s[p];
            l.bind(s, this, targetProp);
            o = l.children;
        }
        return l;
    }
};
BindTargetObj.prototype.unbindLink = function (targetProp) {
    var parent = this.targetPropDic[targetProp];
    if (parent) {
        parent.release();
        delete this.targetPropDic[targetProp];
    }
};;
BindTargetObj.prototype.unbindLinks = function () {
    for (var propName in this.targetPropDic) {
        this.unbindLink(propName);
    }
};
BindTargetObj.prototype.getLink = function (targetProp, source, prop) {
    var parent = this.targetPropDic[targetProp];
    if (!parent) {
        return null;
    }
    return parent.findChild(source, prop);
};
BindTargetObj.prototype.getSourceValue = function (link) {
    var source = link && link.parent && link.parent.source;
    if (source) {
        return source[link.sourceProp];
    }
    return null;
};
BindTargetObj.prototype.updateBindValue = function (targetProp, link, oldValue, newValue) {
    if (!link) {
        var parent = this.targetPropDic[targetProp];
        if (!parent)
            return;
        link = parent.lastChild;
    }
    var value = this.getSourceValue(link);
    var fun = this.target[targetProp];
    if (fun instanceof Function) {
        fun.call(this.target, value, oldValue, newValue);
    } else {
        if (value == null &&
            this.target instanceof cc.Label &&
            targetProp == "string") {
            this.target[targetProp] = "";
        } else {
            this.target[targetProp] = value;
        }
    }
};
BindTargetObj.prototype.release = function () {
    this.unbindLinks();
    this.target = null;
    USE_POOL && pool.put(this);
};

/** @tools */
var Utils = {
    bindCache: new window['Map'](),
    bindFun: function (target, key, args) {
        var source = target;
        var targetValue = target[key];
        var targetProp, sourceProps;
        if (args.length == 1) {
            sourceProps = args[0];
            targetProp = null;
        } else if (args.length == 2) {
            if (typeof args[0] != "string") {
                source = args[0];
                targetProp = null;
            }
            sourceProps = args[1];
        } else {
            source = args[1];
            sourceProps = args[2];
        }
        if (targetProp == null) {
            targetProp = Utils._getBindTargetProp(targetValue);
            if (targetProp == null) {
                targetProp = key;
            } else {
                target = targetValue;
            }
        } else {
            target = targetValue;
        }
        Binding.bind(target, targetProp, source, sourceProps, false);
    },
    canOverride: function (target) {
        if (target instanceof cc.Component) {
            return true;
        }
        if (target.constructor && target.constructor.__gdk_bindable__) {
            return true;
        }
        if (target.__gdk_bindable__) {
            return true;
        }
        return false;
    },
    createBindSourceObj: function (source, sourceProps, propIndex) {
        var bindSourceObj = source[__bindSourceObj__];
        if (!bindSourceObj) {
            bindSourceObj = new BindSourceObj();
            bindSourceObj.source = source;
            source[__bindSourceObj__] = bindSourceObj;
        }
        var sourceProp = sourceProps[propIndex];
        var propValue = source[sourceProp];
        if (!bindSourceObj.sourcePropDic[sourceProp]) {
            let dr = Utils._getDescriptor(source, sourceProp);
            bindSourceObj.sourcePropDic[sourceProp] = dr;
            Object.defineProperty(source, sourceProp, {
                get: function () {
                    let bindSourceObj = this[__bindSourceObj__];
                    if (!bindSourceObj) {
                        return;
                    }
                    let dr = bindSourceObj.sourcePropDic[sourceProp];
                    if (dr.get != null) {
                        return dr.get.call(this);
                    } else {
                        return dr.value;
                    }
                },
                set: function (value) {
                    let bindSourceObj = this[__bindSourceObj__];
                    if (!bindSourceObj) {
                        return;
                    }
                    let dr = bindSourceObj.sourcePropDic[sourceProp];
                    let oldValue = this[sourceProp];
                    if (dr.set != null) {
                        dr.set.call(this, value);
                    } else {
                        dr.value = value;
                    }
                    bindSourceObj.onPropChanged.emit(source, sourceProp, oldValue, value);
                },
                enumerable: dr.enumerable,
                configurable: false
            });
            if (Utils.canOverride(source)) {
                if (!source.__bindOnDestroy__) {
                    source.onDestroy && (source.__onDestroy__ = source.onDestroy);
                    source.__bindOnDestroy__ = true;
                    source.onDestroy = Utils.bindOnDestroy;
                }
            }
        }
        propIndex++;
        if (propValue != null &&
            propIndex < sourceProps.length &&
            typeof propValue == "object") {
            Utils.createBindSourceObj(propValue, sourceProps, propIndex);
        }
    },
    _getBindTargetProp: function (value) {
        if (value instanceof cc.Label) return "string";
        if (value instanceof cc.Toggle) return "isChecked";
        if (value instanceof cc.Slider) return "progress";
        if (value instanceof cc.EditBox) return "string";
    },
    _getDescriptor: function (source, sourceProp) {
        var descriptor;
        while (source) {
            descriptor = Object.getOwnPropertyDescriptor(source, sourceProp);
            if (descriptor) {
                break;
            } else {
                source = source.__proto__;
            }
        }
        if (descriptor == null) {
            descriptor = {
                enumerable: true,
                value: null,
                configurable: true
            };
        }
        return descriptor;
    },
    bindOnEnable: function () {
        this.__onEnable__ && this.__onEnable__.call(this);
        // 从当前类一直往上查找父类，把所有的修饰器绑定属性查找出来
        let ctor = this.constructor;
        let arr = [];
        for (;;) {
            let a = Utils.bindCache.get(ctor);
            if (a && a.length > 0) {
                // 如果子类中有覆写此方法的binding，则忽略父类的绑定
                let temp = [];
                let loop = function (i) {
                    let s = a[i];
                    let b = arr.some(function (l) {
                        return l.key == s.key;
                    });
                    !b && temp.push(s);
                };
                for (let i = 0; i < a.length; i++) {
                    loop(i);
                }
                temp.length && arr.push(...temp);
            }
            ctor = cc.js.getSuper(ctor);
            if (!ctor || ctor === Object) {
                break;
            }
        }
        // 添加修饰器添加的绑定属性
        if (arr && arr.length > 0) {
            for (let i = 0, n = arr.length; i < n; i++) {
                Utils.bindFun(this, arr[i].key, arr[i].args);
            }
            let bindTargetObj = this[__bindTargetObj__];
            for (let propName in bindTargetObj.targetPropDic) {
                bindTargetObj.updateBindValue(propName);
            }
        }
    },
    bindOnDisable: function () {
        Binding.unbind(this);
        this.__onDisable__ && this.__onDisable__.call(this);
    },
    bindOnDestroy: function () {
        this.__onDestroy__ && this.__onDestroy__.call(this);
        let bindSourceObj = this[__bindSourceObj__];
        if (bindSourceObj) {
            bindSourceObj.release();
            delete this[__bindSourceObj__];
        }
    },
};

/** @tools */
var Binding = {
    /**
     * 绑定,
     * 当对象不再需要时，务必要调用unBind解除绑定，不然对象不能被垃圾回收，数据事件还一直在监听
     * @param {any} target
     * @param {string} targetProp
     * @param {any} source
     * @param {string|[string]} sourceProps
     */
    bind: function (target, targetProp, source, sourceProps, update) {
        if (update === void 0) {
            update = true;
        }
        if (target == null) {
            console.error("Binding target can not null!!");
            return;
        }
        if (source == null) {
            console.error("Binding source can not null!!");
            return;
        }
        if (typeof sourceProps === "string") {
            sourceProps = sourceProps.split(".");
        }
        Utils.createBindSourceObj(source, sourceProps, 0);
        var bindTargetObj = target[__bindTargetObj__];
        if (!bindTargetObj) {
            bindTargetObj = pool.get(BindTargetObj);
            bindTargetObj.target = target;
            target[__bindTargetObj__] = bindTargetObj;
        }
        bindTargetObj.creatLink(targetProp, source, sourceProps);
        update && bindTargetObj.updateBindValue(targetProp);
        if (Utils.canOverride(target)) {
            if (!target.__bindOnDisable__) {
                target.onDisable && (target.__onDisable__ = target.onDisable);
                target.__bindOnDisable__ = true;
                target.onDisable = Utils.bindOnDisable;
            }
        }
    },
    /**
     * 解除绑定
     * @param {*} target
     * @param {string|null} targetProp  null时，解决对象上的所有绑定
     */
    unbind: function (target, targetProp) {
        var bindTarget = target[__bindTargetObj__];
        if (bindTarget) {
            if (targetProp) {
                bindTarget.unbindLink(targetProp);
                if (bindTarget.count == 0) {
                    bindTarget.release();
                    delete target[__bindTargetObj__];
                }
            } else {
                bindTarget.release();
                delete target[__bindTargetObj__];
            }
        }
    },
    /**
     * 给ES7或typesctip修饰器用
     */
    bindDescriptor: function (targetProp, sourceProps) {
        var args = arguments;
        return function (target, key, descriptor) {
            if (args.length == 0)
                return;
            if (Utils.canOverride(target)) {
                let ctor = target.constructor;
                let targetProps = Utils.bindCache.get(ctor);
                if (!targetProps) {
                    targetProps = [];
                    Utils.bindCache.set(ctor, targetProps);
                }
                targetProps.push({
                    'key': key,
                    'args': args
                });
                if (!target.__bindOnEnable__) {
                    target.onEnable && (target.__onEnable__ = target.onEnable);
                    target.__bindOnEnable__ = true;
                    target.onEnable = Utils.bindOnEnable;
                }
            } else {
                Utils.bindFun(target, key, args);
            }
            return descriptor;
        };
    }
};

module.exports = Binding;