export function mutable(target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
    let mutables = target["__mutables__"];
    if (!mutables) {
        mutables = {};
        Object.defineProperty(target, "__mutables__", {
            writable: false,
            value: mutables,
        });
    }
    mutables[propertyKey] = true;
    let internalKey = "__" + propertyKey + "__";
    if (!descriptor) {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return this[internalKey];
            },
            set: function (newVal) {
                let observers, oldVal;
                if (this.__observers__) {
                    observers = this.__observers__[propertyKey];
                    if (observers) {
                        oldVal = this[internalKey];
                    }
                }
                if (newVal != oldVal) {
                    this[internalKey] = newVal;
                    handleObservers(oldVal, newVal, observers);
                    // changeArrayProp(this, propertyKey, oldVal, newVal);
                }
            }
        });
    } else {
        let noGet = !descriptor.get;
        if (noGet) {
            descriptor.get = function () {
                return this[internalKey];
            }
        }
        let set = descriptor.set;
        if (set) {
            descriptor.set = function (newVal) {
                let observers, oldVal;
                if (this.__observers__) {
                    observers = this.__observers__[propertyKey];
                    if (!noGet && observers) {
                        oldVal = descriptor.get.call(this);
                    }
                }
                if (newVal != oldVal) {
                    if (noGet) {
                        this[internalKey] = newVal;
                    }
                    set.call(this, newVal);
                    handleObservers(oldVal, newVal, observers);
                    if (noGet) {
                        delete this[internalKey];
                    } else {
                        // changeArrayProp(this, propertyKey, oldVal, newVal);
                    }
                }
            }
        }
    }
}

export function list(compType: any, attr: string | string[], options?: Function | object) {
    let prefabName: string;
    if (compType.constructor == Array) {
        prefabName = compType[1];
        compType = compType[0];
    }
    options = initOptions(options, attr);
    let attrs = options["attrs"];
    let filter = options["filter"];
    let getter = options["getter"];
    let setter = options["setter"];
    let sorter = options["sorter"];
    return function (target: any, propertyKey: string) {
        if (options["ccdp"] !== 0) {
            cc._decorator.property(compType)(target, propertyKey);
        }
        let refresh: Function;
        if (setter) {
            refresh = function () {
                if (this.model == undefined) {
                    return;
                }
                let values = getter ? getter(this.model) : getValue(this.model, attrs[0]);
                if (values != null) {
                    let array = [];
                    if (filter) {
                        for (let item of values) {
                            if (filter(item, this.model)) {
                                array.push(item);
                            }
                        }
                    } else {
                        array = values;
                    }
                    if (sorter) {
                        array.sort(sorter);
                    }
                    let parent = this[propertyKey];
                    if (prefabName) {
                        setter([parent, this[prefabName]], array, this.model);
                    } else {
                        setter(parent, array, this.model);
                    }
                }
            };
        } else if (sorter) {
            refresh = function () {
                if (this.model == undefined) {
                    return;
                }
                let values = getter ? getter(this.model) : getValue(this.model, attrs[0]);
                if (values != null) {
                    let array = [];
                    if (filter) {
                        for (let item of values) {
                            if (filter(item, this.model)) {
                                array.push(item);
                            }
                        }
                    } else {
                        array = values;
                    }
                    array.sort(sorter);
                    let parent = this[propertyKey];
                    let prefab = prefabName ? this[prefabName] : undefined;
                    if (prefab && parent["__prefab__"] != prefab) {
                        parent.destroyAllChildren();
                        parent["__prefab__"] = prefab;
                    }
                    let length = array.length;
                    for (let i = 0; i < length; i++) {
                        setChild(compType, parent, prefab, i, array[i]);
                    }
                    removeChildren(compType, parent, length);
                }
            };
        } else {
            refresh = function () {
                if (this.model == undefined) {
                    return;
                }
                let values = getter ? getter(this.model) : getValue(this.model, attrs[0]);
                if (values != null) {
                    let parent = this[propertyKey];
                    let prefab = prefabName ? this[prefabName] : undefined;
                    if (prefab && parent["__prefab__"] != prefab) {
                        parent.destroyAllChildren();
                        parent["__prefab__"] = prefab;
                    }
                    let index: number = 0;
                    for (let item of values) {
                        if (!filter || filter(item, this.model)) {
                            setChild(compType, parent, prefab, index, item);
                            index++;
                        }
                    }
                    removeChildren(compType, parent, index);
                }
            };
        }
        let vmEnable = function () {
            refresh.call(this);
            registerObservers(this, attrs, refresh);
        };
        let vmDisable = function () {
            unregisterObservers(this, attrs);
        };
        changeTarget2(target, vmEnable, vmDisable);
    }
}

export function each(compType: any, attr: string | string[], options?: Function | object) {
    if (typeof options == "function") {
        options = {getter: options};
    }
    options["foreach"] = true;
    return bind(compType, attr, options);
}

export function bind(compType: any, attr: string | string[], options?: Function | object) {
    options = initOptions(options, attr);
    let attrs = options["attrs"];
    let getter = options["getter"];
    let setter = options["setter"] ? options["setter"] : getSetter(compType);
    let foreach = options["foreach"];
    return function (target: any, propertyKey: string) {
        if (options["ccdp"] !== 0) {
            cc._decorator.property(compType)(target, propertyKey);
        }
        let refresh: Function;
        if (foreach) {
            if (getter) {
                refresh = function () {
                    if (this.model != undefined) {
                        let len = this[propertyKey].length;
                        for (let i = 0; i < len; i++) {
                            setter(this[propertyKey][i], i, getter(i, this.model));
                        }
                    }
                }
            } else {
                refresh = function () {
                    if (this.model != undefined) {
                        let len = this[propertyKey].length;
                        for (let i = 0; i < len; i++) {
                            if (attrs.length == 1 && !options["setter"]) {
                                setter(this[propertyKey][i], i, getValue(this.model, attrs[0]));
                            } else {
                                setter(this[propertyKey][i], i, this.model);
                            }
                        }
                    }
                }
            }
        } else if (getter) {
            refresh = function () {
                if (this.model != undefined) {
                    setter(this[propertyKey], getter(this.model));
                }
            };
        } else {
            refresh = function () {
                if (this.model != undefined) {
                    if (attrs.length == 1 && !options["setter"]) {
                        setter(this[propertyKey], getValue(this.model, attrs[0]));
                    } else {
                        setter(this[propertyKey], this.model);
                    }
                }
            }
        }
        changeTarget(target, attrs, refresh);
    }
}

export function observe(attr: string | string[], callOnEnable: boolean = true) {
    let attrs = [];
    if (typeof attr == "string") {
        if (attr != "") {
            attrs = [getObserveAttr(attr)];
        }
    } else {
        for (let str of attr) {
            attrs.push(getObserveAttr(str));
        }
    }
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let observer = function () {
            if (this.model != undefined) {
                descriptor.value.call(this);
            }
        };
        if (callOnEnable) {
            changeTarget(target, attrs, observer);
        } else {
            let vmEnable = function () {
                registerObservers(this, attrs, observer)
            };
            let vmDisable = function () {
                unregisterObservers(this, attrs)
            };
            changeTarget2(target, vmEnable, vmDisable);
        }
    }
}

function initOptions(options: object, attr: string | string[]): object {
    let getter = typeof options == "function" ? options : (options ? options["getter"] : undefined);
    if (!options) {
        options = {};
    }
    let attrs = [];
    if (typeof attr == "string") {
        if (attr != "") {
            attrs = [getObserveAttr(attr)];
        }
    } else {
        for (let str of attr) {
            attrs.push(getObserveAttr(str));
        }
    }
    options["attrs"] = attrs;
    options["getter"] = getter;
    return options;
}

function changeTarget(target: any, attrs: string[][], refresh: Function) {
    let vmEnable = function () {
        refresh.call(this);
        registerObservers(this, attrs, refresh);
    };
    let vmDisable = function () {
        unregisterObservers(this, attrs);
    };
    changeTarget2(target, vmEnable, vmDisable);
}

function changeTarget2(target: any, vmEnable: Function, vmDisable: Function) {
    if (!target.__vm_enable__) {
        target.__vm_enable__ = [vmEnable];
        let onEnable = target.onEnable;
        target.onEnable = function () {
            if (onEnable) {
                onEnable.call(this);
            }
            if (this.model != undefined) {
                for (let enable of target.__vm_enable__) {
                    enable.call(this);
                }
            }
        };
    } else {
        target.__vm_enable__.push(vmEnable);
    }
    if (!target.__vm_disable__) {
        target.__vm_disable__ = [vmDisable];
        let onDisable = target.onDisable;
        target.onDisable = function () {
            if (onDisable) {
                onDisable.call(this);
            }
            for (let disable of target.__vm_disable__) {
                disable.call(this);
            }
        };
    } else {
        target.__vm_disable__.push(vmDisable);
    }
}

function changeArrayProp(object, propertyKey, oldVal, newVal) {
    if (oldVal && oldVal.constructor == Array) {
        if (oldVal && oldVal.hasOwnProperty("push")) {
            delete oldVal.push;
        }
        if (oldVal && oldVal.hasOwnProperty("splice")) {
            delete oldVal.splice;
        }
    }
    if (newVal && newVal.constructor == Array) {
        Object.defineProperty(newVal, "push", {
            configurable: true,
            value: function (...items: any[]) {
                Array.prototype.push.call(newVal, ...items);
                for (let observer of object.__observers__[propertyKey]) {
                    observer.func.call(observer.caller);
                }
            }
        });
        Object.defineProperty(newVal, "splice", {
            configurable: true,
            value: function (start, deleteCount, ...newItems: any[]) {
                if (newItems) {
                    Array.prototype.splice.call(newVal, start, deleteCount, ...newItems);
                } else {
                    Array.prototype.splice.call(newVal, start, deleteCount);
                }
                for (let observer of object.__observers__[propertyKey]) {
                    observer.func.call(observer.caller);
                }
            }
        });
    }
}

function setChild(compType: any, parent: any, prefab: cc.Prefab, index: number, model: any) {
    if (compType == cc.Node) {
        let child = parent.children[index];
        if (child) {
            setModel(child.getComponent(cc.Component), model);
        } else {
            let child = cc.instantiate(prefab);
            child.getComponent(cc.Component)["model"] = model;
            parent.addChild(child);
        }
    } else {
        parent.setChild(index, model, prefab);
    }
}

function removeChildren(compType: any, parent: any, from: number) {
    if (compType == cc.Node) {
        if (from == 0) {
            parent.destroyAllChildren();
        } else {
            for (let i = parent.children.length - 1; i >= from; i--) {
                parent.children[i].destroy();
            }
        }
    } else {
        parent.removeChildren(from);
    }
}

function getObserveModel(model: any, attr: string[], index: number) {
    for (let i = 0; i < index; i++) {
        if (model == undefined) {
            return undefined;
        }
        model = model[attr[i]];
    }
    return model;
}

const observeAttrMap = {};

function getObserveAttr(attr: string): string[] {
    let arr = observeAttrMap[attr];
    if (!arr) {
        arr = attr.split(".");
        observeAttrMap[attr] = arr;
    }
    return arr;
}

function getValue(model: any, attr: string[]) {
    let len = attr.length;
    for (let i = 0; i < len; i++) {
        if (model == undefined) {
            return undefined;
        }
        model = model[attr[i]];
    }
    return model;
}

function registerObservers(obj: object, attrs: string[][], cb: Function) {
    for (let attr of attrs) {
        for (let index = 0; index < attr.length; index++) {
            let obModel = getObserveModel(obj["model"], attr, index);
            if (typeof obModel == "object" && obModel.constructor != Array) {
                let prop = attr[index];
                let muts = obModel.__proto__.__mutables__;
                if (muts && prop in muts) {
                    if (!obModel.__observers__) {
                        obModel.__observers__ = {};
                    }
                    let observers = obModel.__observers__[prop];
                    if (!observers) {
                        observers = [];
                        obModel.__observers__[prop] = observers;
                    }
                    observers.push({func: cb, caller: obj, attr: attr, index: index});
                }
            }
        }
    }
}

function unregisterObservers(obj: object, attrs: string[][]) {
    for (let attr of attrs) {
        for (let index = 0; index < attr.length; index++) {
            let obModel = getObserveModel(obj["model"], attr, index);
            if (typeof obModel == "object" && obModel.__observers__) {
                let prop = attr[index];
                let observers = obModel.__observers__[prop];
                if (observers) {
                    for (let j = observers.length - 1; j >= 0; j--) {
                        if (observers[j].caller == obj) {
                            observers.splice(j, 1);
                        }
                    }
                }
            }
        }
    }
}

function handleObservers(oldVal, newVal, observers) {
    if (observers) {
        if (typeof oldVal == "object" && oldVal.constructor != Array) {
            for (let observer of observers) {
                moveObserver(oldVal, newVal, observer, observer.index + 1);
            }
        }
        for (let observer of observers) {
            observer.func.call(observer.caller, newVal);
        }
    }
}

function moveObserver(oldVal, newVal, observer, index) {
    if (index >= observer.attr.length) {
        return;
    }
    let caller = observer.caller;
    let attr = observer.attr;
    let prop = attr[index];
    if (oldVal.__observers__) {
        let oldObservers = oldVal.__observers__[prop];
        if (oldObservers && oldObservers.length > 0) {
            let newObservers;
            if (newVal) {
                if (!newVal.__observers__) {
                    newVal.__observers__ = {};
                }
                newObservers = newVal.__observers__[prop];
                if (!newObservers) {
                    newObservers = [];
                    newVal.__observers__[prop] = newObservers;
                }
            }
            for (let i = oldObservers.length - 1; i >= 0; i--) {
                let oldObserver = oldObservers[i];
                if (oldObserver.caller == caller && oldObserver.attr == attr) {
                    oldObservers.splice(i, 1);
                    if (newObservers) {
                        newObservers.push(oldObserver);
                    }
                }
            }
        }
    }
    oldVal = oldVal[prop];
    if (newVal) {
        newVal = newVal[prop];
    }
    moveObserver(oldVal, newVal, observer, index + 1);
}

function getSetter(compType: any) {
    switch (compType) {
        case cc.Node:
            return function (node: cc.Node, value: number) {
                if (value != undefined) {
                    let count = node.childrenCount;
                    for (let i = 0; i < count; i++) {
                        node.children[i].active = i < value;
                    }
                }
            };
        case cc.Label:
            return function (label: cc.Label, value: string) {
                if (value != undefined) {
                    label.string = value;
                }
            };
        case cc.RichText:
            return function (richText: cc.RichText, value: string) {
                if (value != undefined) {
                    richText.string = value;
                }
            };
        case cc.Toggle:
            return function (toggle: cc.Toggle, value: boolean) {
                if (value != undefined) {
                    toggle.isChecked = value;
                }
            };
        case cc.Slider:
            return function (slider: cc.Slider, value: number) {
                if (value != undefined) {
                    slider.progress = value;
                }
            };
        case cc.ProgressBar:
            return function (pb: cc.ProgressBar, value: number) {
                if (value != undefined) {
                    pb.progress = value;
                }
            };
        case cc.Sprite:
            return function (sprite: cc.Sprite, value: string) {
                if (value == "" || value == undefined) {
                    sprite.node.active = false;
                    return;
                }
                sprite.node.active = true;
                sprite.spriteFrame = null;
                let resId = gdk.Tool.getResIdByNode(sprite.node);
                gdk.rm.loadRes(resId, value, cc.SpriteFrame, (frame: cc.SpriteFrame) => {
                    if (cc.isValid(sprite.node)) {
                        sprite.spriteFrame = frame;
                    }
                });
            };
        default:
            return setModel;
    }
}

export function setModel(comp: cc.Component, model: any) {
    if (!comp.node.active) {
        comp["model"] = model;
        return;
    }
    let changed = comp["model"] != model;
    if (changed && comp["model"] && comp["__vm_disable__"]) {
        for (let disable of comp["__vm_disable__"]) {
            disable.call(comp);
        }
    }
    comp["model"] = model;
    if (changed && model && comp["__vm_enable__"]) {
        for (let enable of comp["__vm_enable__"]) {
            enable.call(comp);
        }
    }
}
