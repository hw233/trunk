import BSdkTool from '../../sdk/BSdkTool';
/**
 * 静态表配置管理器
 * 通过此类接口获取的数据为静态数据，请不要修改，否则会影响到原始的配置数据
 * @Author: sthoo.huang
 * @Date: 2019-03-26 14:40:48
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-05 14:07:23
 */

class ConfigManagerClass {

    _config: any = null;
    _json: any = null;

    // 取得配置数组对象
    private _getArray<T>(clz: { new(): T }): { [id: number]: string | any[] } {
        let array = clz['array'];
        if (array instanceof gdk.Buffer) {
            array = gdk.pako.inflate(array);
            array = gdk.Buffer.from(array);
            array = gdk.amf.decodeObject(array);
            clz['array'] = array;
        }
        return array;
    }

    // 创建一项配置实例
    private _createItem<T>(clz: { new(): T }, data: Uint8Array | string | any[], id: number | string) {
        let keys = clz["keys"];
        let item = new clz();
        let arr: any[];
        if (cc.js.isString(id) && parseInt(id as string) == id) {
            id = parseInt(id as string);
        }
        if (data instanceof Uint8Array) {
            arr = gdk.amf.decodeObject(data);
            arr.unshift(id);
        }
        else if (data instanceof Array) {
            arr = data;
        }
        else {
            arr = JSON.parse(data);
            arr.unshift(id);
        }
        for (let i = 0, n = keys.length; i < n; i++) {
            item[keys[i]] = arr[i];
        }
        // 礼包金额根据平台换算
        if (this._initStep && !this._json) {
            const config = this._config;
            if (item instanceof config.Operation_storeCfg) {
                item['RMB_cost'] = BSdkTool.tool.getRealRMBCost(item['RMB_cost']);
            } else if (item instanceof config.Store_miscCfg) {
                item['RMB_cost'] = BSdkTool.tool.getRealRMBCost(item['RMB_cost']);
            } else if (item instanceof config.Store_pushCfg) {
                item['rmb'] = BSdkTool.tool.getRealRMBCost(item['rmb']);
            } else if (item instanceof config.Store_monthcardCfg) {
                item['RMB_cost'] = BSdkTool.tool.getRealRMBCost(item['RMB_cost']);
                item['top_up'] = BSdkTool.tool.getRealRMBCost(item['top_up']);
            } else if (item instanceof config.Store_onepriceCfg) {
                item['price'] = BSdkTool.tool.getRealRMBCost(item['price']);
            } else if (item instanceof config.Store_giftCfg) {
                item['RMB_cost'] = BSdkTool.tool.getRealRMBCost(item['RMB_cost']);
            } else if (item instanceof config.Store_chargeCfg) {
                item['RMB_cost'] = BSdkTool.tool.getRealRMBCost(item['RMB_cost']);
            }
        }
        // 缓存至list中
        clz['array'][id] = item;
        return item;
    }

    private _initStep: number = 0;
    get initlized() {
        return this._initStep;
    }

    private _datetime: string = '';
    get datetime() {
        return this._datetime;
    }

    // 初始化配置
    init(config: any, json?: any) {
        if (json && json.vercode === undefined) {
            // 本地配置兼容
            let skip = new Set(['Mask_wordCfg']);
            for (let name in json) {
                let obj = json[name];
                if (obj && typeof obj === 'object' && obj.a) {
                    let o = {};
                    let a = obj.a as any[];
                    for (let i = 0, n = a.length; i < n; i++) {
                        let k = a[i][0];
                        if (!skip.has(name)) {
                            // 不在忽略的配置表中
                            if (o[k] !== undefined) {
                                cc.error(`配置表: ${name} 第一字段不唯一，冲突: ${k}`);
                            }
                            if (!(cc.js.isString(k) || cc.js.isNumber(k))) {
                                cc.error(`配置表: ${name} 第一字段只允许字符或数字类型`);
                            }
                        }
                        o[k] = a[i];
                    }
                    obj.a = o;
                }
            }
        }
        if (this._initStep > 0) {
            CC_DEBUG && json && cc.log("游戏配置生成时间：", json.datetime);
            json = { ...(json || {}), ...(this._json || {}) };
            if (this._config !== config) {
                for (let e in this._config) {
                    let o = this._config[e];
                    if (json[e] !== void 0) {
                        config[e] = o;
                        json[e] = o['array'];
                    }
                }
                this._config = config;
            }
            this._json = null;
            this._initStep = 2;
        } else if (json) {
            CC_DEBUG && cc.log("启动配置生成时间：", json.datetime);
            this._datetime = json.datetime;
            this._initStep = 1;
            this._config = config;
            this._json = json;
        }
        if (json) {
            // 解压配置数据
            for (let e in config) {
                const a = json[e];
                if (a && typeof (a) === 'object' && cc.js.isString(a.a)) {
                    a.a = gdk.Buffer.from(a.a, 'base64');
                }
            }
            config.init(json);
        }
    }

    /**
     * 以ID键值为条件，获取一项配置数据
     * 用法：
     *      var item:Bag = ConfigManager.getItemById(Bag, 1034);
     * @param clz 配置结构类
     * @param id 
     */
    getItemById<T>(clz: { new(): T }, id: string | number): T {
        let data = this._getArray(clz)[id];
        if (data && (data instanceof Uint8Array || cc.js.isString(data) || data instanceof Array)) {
            return this._createItem(clz, data, id);
        }
        return data;
    }

    /**
     * 获取以指定字段的值为索引的配置列表
     * 用法：
     *      var items:Bag[] = ConfigManager.getItemsByField(Bag, 'type', 5);
     * @param clz 配置结构类
     * @param name 要查找的字段名
     * @param value 字段对应的值
     */
    getItemsByField<T>(clz: { new(): T }, name: string, value: string | number): T[] {
        var key: string = '__index__' + name + value;
        if (!clz[key]) {
            let c: any = {};
            c[name] = value;
            clz[key] = this.getItems(clz, c);
        }
        return clz[key];
    }

    /**
     * 获取以指定字段的值为索引的配置列表中符合条件的项
     * 用法：
     *      var item:Bag = ConfigManager.getItemByField(Bag, 'typeId', 5, {value:100}); 
     * @param clz 
     * @param name 
     * @param value 
     * @param condition 
     */
    getItemByField<T>(clz: { new(): T }, name: string, value: string | number, condition?: Function | any): T {
        var a: T[] = this.getItemsByField(clz, name, value);
        if (a && a.length > 0) {
            for (let i = 0, n = a.length; i < n; i++) {
                let item: T = a[i];
                if (item && this.isEquivalent(item, condition)) {
                    // 返回符合条件的数据
                    return item;
                }
            }
        }
        return null;
    }

    /**
     * 获取一项与condition条件相符的数据
     * 用法：
     *      var item:Bag = ConfigManager.getItem(Bag, {id:1034});
     * @param clz 
     * @param condition 
     */
    getItem<T>(clz: { new(): T }, condition: Function | any): T {
        if (typeof condition === 'object' && 'id' in condition) {
            return this.getItemById(clz, condition.id);
        }
        let array = this._getArray(clz);
        for (let id in array) {
            let data = array[id];
            let item: any;
            if (data instanceof Uint8Array || cc.js.isString(data) || data instanceof Array) {
                item = this._createItem(clz, data, id);
            } else {
                item = data;
            }
            if (this.isEquivalent(item, condition)) {
                return item;
            }
        }
        return null;
    }

    /**
     * 获取所有与condition条件相符的数据，如果没找到则返回空数组
     * 如果condition为null则返回所有配置
     * 用法：
     *      var items:Bag[] = ConfigManager.getItems(Bag, {type:1, sex: 2});
     *      var items:Bag[] = ConfigManager.getItems(Bag);
     * @param clz 
     * @param condition
     */
    getItems<T>(clz: { new(): T }, condition?: Function | any): T[] {
        var ret: any[] = [];
        let array = this._getArray(clz);
        for (let id in array) {
            let data = array[id];
            let item: any;
            if (data instanceof Uint8Array || cc.js.isString(data) || data instanceof Array) {
                item = this._createItem(clz, data, id);
            } else {
                item = data;
            }
            if (this.isEquivalent(item, condition)) {
                // 符合条件的数据放入结果数组中
                ret.push(item);
            }
        }
        return ret;
    }

    /**
     * 判断item的数据是否符合condition的条件值
     * @param item 
     * @param condition 
     */
    isEquivalent(item: any, condition: Function | any): boolean {
        if (!item) return false;
        if (!condition) return true;
        if (typeof condition === 'function') {
            return condition(item);
        } else {
            // var props = condition.___props___;
            // if (!props) {
            //     props = Object.getOwnPropertyNames(condition);
            //     condition.___props___ = props;
            // }
            // for (let i = 0, n = props.length; i < n; i++) {
            //     let name = props[i];
            //     if (item[name] !== condition[name]) {
            //         return false;
            //     }
            // }
            let keys = Object.keys(condition)
            for (let i = 0, n = keys.length; i < n; i++) {
                let name = keys[i];
                if (item[name] != condition[name]) {
                    return false;
                }
            }
            return true;
        }
    }
}

const BConfigManager = gdk.Tool.getSingleton(ConfigManagerClass);
iclib.addProp('ConfigManager', BConfigManager);
window['ConfigManager'] = BConfigManager;
export default BConfigManager;