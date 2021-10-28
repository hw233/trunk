/**
 * 给组件选择用,
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 22:04:14
 */

let mixins = function (obj) {
    var lastIndex = 0;
    var keys = Object.keys(this);
    lastIndex = keys.length;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (Number.isInteger(parseFloat(key))) {
            // 数字键值不可选
            continue;
        }
        var index = this[key] = lastIndex++;
        var reverseKey = '' + index;
        if (key !== reverseKey) {
            cc.js.value(this, reverseKey, key);
        }
    }
    if (CC_EDITOR && this.__enums__) {
        var enums = this.__enums__;
        for (var name in this) {
            var value = this[name];
            if (Number.isInteger(value)) {
                enums[value] = {
                    name,
                    value
                };
            }
        }
        enums.sort(function (a, b) {
            return a.value - b.value;
        });
    }
    this.__value__ = this.__value__ || {};
    this.__value__ = Object.assign(this.__value__, obj);
};

let getValue = function (v) {
    if (this.__value__) {
        if (v == "") {
            return this.__value__[this[0]];
        }
        let o = this.__value__[v];
        if (o == null) {
            v = this[v];
            if (v) {
                o = this.__value__[v];
            }
        }
        return o;
    }
    return null;
};

let Enum = function (obj) {
    let en = cc.Enum(obj);
    cc.js.value(en, "mixins", mixins, true);
    cc.js.value(en, "getValue", getValue, true);
    cc.js.value(en, "__value__", null, true);
    return en;
};

module.exports = Enum;