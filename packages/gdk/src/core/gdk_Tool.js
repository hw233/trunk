/**
 * 有用的工具方法
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-14 11:30:35
 */

let Tool = {
    /**
     * 获取单例
     * @param {Class} clazz 
     */
    getSingleton (clazz) {
        if (clazz.__gdk_instance == null) {
            clazz.__gdk_instance = new clazz();
        }
        return clazz.__gdk_instance;
    },

    /**
     * 销毁getSingleton获取的单例
     * @param {Class} clazz 
     */
    destroySingleton (clazz) {
        delete clazz.__gdk_instance;
    },

    /**
     * 获取node所在界面的资源ID
     * @param {cc.Node} node 
     */
    getResIdByNode (node) {
        if (!node || node instanceof cc.Scene) {
            return node ? 'Scene#' + cc.director.getScene().name : "Common";
        }
        var panel = node.getComponent(require("../ui/gdk_BasePanel"));
        if (panel && panel.resId) {
            return panel.resId;
        }
        return this.getResIdByNode(node.parent);
    },

    /**
     * 从给定的参数列表中返回第一个非null的值，如果没有任何值满足要求则返回最后一个参数的值
     * @param  {...any} args 
     */
    validate (...args) {
        let n = args.length - 1;
        for (let i = 0; i < n; i++) {
            if (args[i] != null) {
                return args[i];
            }
        }
        return args[n];
    },

    /**
     * 分帧延迟调用
     * @param {*} callback 
     * @param {*} p1 
     * @param {*} p2 
     */
    callInNextTick (callback, p1, p2) {
        if (!callback) return;
        setTimeout(function () {
            callback(p1, p2);
        }, 0);
    },

    /**
     * 异步执行返回Promise支持链式异步
     * @param {*} fn 
     */
    execSync (fn) {
        return new Promise((resolve, reject) => {
            if (!fn) {
                reject('ERROR');
                return;
            }
            setTimeout(function () {
                fn();
                resolve('OK');
            }, 0);
        });
    }
}

module.exports = Tool;