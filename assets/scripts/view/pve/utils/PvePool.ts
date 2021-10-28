import { IPool } from '../../../common/core/BaseInterface';

/**
 * Pve对象池
 * @Author: sthoo.huang
 * @Date: 2019-05-20 09:49:05
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-18 15:50:48
 */
let POOL_NAME = '__pve_pool_name__';
let PID: number = 1;

class PvePool implements IPool {

    private keyDic: any = {};

    getPID(c: any) {
        let k: string;
        if (c instanceof cc.Prefab) {
            // Prefab
            k = c.name + "#" + c.data['_prefab'].fileId;
        } else if (c.__classname__) {
            // CCClass
            k = c.__classname__;
        } else {
            // class
            if (!c.$PID) {
                c.$PID = PID++;
            }
            k = "#class_" + c.$PID;
        }
        return k;
    }

    get(c: any) {
        let k: string = '__pve__' + this.getPID(c);
        let v: any = k ? gdk.pool.get(k) : null;
        if (!cc.isValid(v)) {
            if (c instanceof cc.Prefab) {
                v = cc.instantiate(c);
            } else {
                v = new c();
            }
            v[POOL_NAME] = k;
        }
        return v;
    }

    put(...args: any) {
        if (args.length < 1) return;
        for (let i = 0, n = args.length; i < n; i++) {
            let v: any = args[i];
            if (!cc.isValid(v)) continue;
            let key: string = v[POOL_NAME];
            if (key) {
                if (!this.keyDic[key]) {
                    this.keyDic[key] = true;
                    gdk.pool.setSize(key, 100);
                    gdk.pool.setClearTime(key, 0);
                }
                if (v instanceof cc.Node) {
                    v.visible = true;
                }
                gdk.pool.put(key, v);
            } else {
                v.unuse && v.unuse.call(v);
                v.destroy && v.destroy.call(v);
            }
        }
    }

    clearAll() {
        for (let key in this.keyDic) {
            gdk.pool.clear(key);
            delete this.keyDic[key];
        }
    }
}

export default gdk.Tool.getSingleton(PvePool);