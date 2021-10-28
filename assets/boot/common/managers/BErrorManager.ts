import BConfigManager from './BConfigManager';
import BGlobalUtil from '../utils/BGlobalUtil';
import BNetManager from './BNetManager';
import BPanelId from '../../configs/ids/BPanelId';
import BSdkTool from '../../sdk/BSdkTool';
import BStringUtils from '../utils/BStringUtils';
import ForceTipsPanel from '../../scenes/boot/ctrl/ForceTipsPanel';
import { ErrorCfg, ForbidtipsCfg } from '../../configs/bconfig';

/** 
 * 错误码管理
 * @Author: sthoo.huang  
 * @Date: 2019-04-09 14:17:25 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-07 16:26:47
 */

// 生成错误码映射表
let generalErrorMap = function (a: number[]) {
    let r: { [error: number]: boolean } = {};
    a.forEach(i => r[i] = true);
    return r;
};

// 错误码消息事件前缀
const ERROR_EVENT_PREFIX: string = "error_event_";

// 忽略打印日志的错误码
const EXCLUDE_LOG_CODE: { [error: number]: boolean } = generalErrorMap([

]);

// 忽略显示错误提示的错误码
const EXCLUDE_SHOW_MSG_CODE: { [error: number]: boolean } = generalErrorMap([
    105, 201, 800, 843, 3317, 3318, 3327
]);

class ErrorManagerClass {

    /**
     * 初始化错误管理器，需在网络管理器之后初始化
     */
    init() {
        BNetManager.on(icmsg.SystemErrorRsp.MsgType, this._onSystemErrorRspHandle, this);
    }

    /**
     * 销毁错误管理器
     */
    destroy() {
        BNetManager.targetOff(this);
    }

    /**
     * 系统错误消息处理
     * @param msg SystemErrorRsp
     */
    private _onSystemErrorRspHandle(msg: icmsg.SystemErrorRsp) {
        let err = this.get(msg.code, msg.args);
        if (CC_DEBUG && EXCLUDE_LOG_CODE[msg.code] === true) {
            cc.warn(`system error >>>> code: ${msg.code}, desc: `, err);
        }
        let forbidCfg = BConfigManager.getItemByField(ForbidtipsCfg, "code", msg.code);
        if (forbidCfg) {
            this.showForbidInfo(msg, forbidCfg);
            return;
        }
        gdk.e.emit(ERROR_EVENT_PREFIX + msg.code, msg);
        if (err && err != '' && EXCLUDE_SHOW_MSG_CODE[msg.code] !== true) {
            //gdk.gui.showMessage(err);
            BGlobalUtil.showMessageAndSound(err)
        }
    }

    /**
     * 显示防沉迷信息
     * @param msg
     * @param cfg
     */
    showForbidInfo(msg: icmsg.SystemErrorRsp, cfg: ForbidtipsCfg) {
        //需要等进入游戏，才弹窗提示
        if (cfg.opt == "login") {
            //未进入到游戏，继续等待
            if (gdk.panel.isOpenOrOpening(BPanelId.LoginView)) {
                //超过20次，就不进行操作
                if (!msg['__count']) {
                    msg['__count'] = 0;
                } else {
                    msg['__count']++;
                }
                if (msg['__count'] < 20) {
                    gdk.Timer.once(500, this, this.showForbidInfo, [msg, cfg]);
                    return;
                }
            }
        }
        let txt = cfg.desc;
        let params = msg.args;
        if (params && params.length > 0) {
            params = params.concat();
            while (params.length > 0) {
                txt = txt.replace("%s", params.shift());
            }
        }
        if (!cfg.style) {
            gdk.gui.showMessage(txt);
        } else if (cfg.style == 1) {
            gdk.panel.open(BPanelId.ForceTipsPanel, (node: cc.Node) => {
                let comp = node.getComponent(ForceTipsPanel)
                comp.updatePanelInfo({
                    title: "温馨提示",
                    descText: txt,
                    sureCb: () => {
                        if (cfg.opt == "logout") {
                            BSdkTool.tool.logout();
                        }
                    },
                });
            })
        } else {
            cc.error("showForbidInfo:无知错误提示");
        }
    }

    /**
     * 通过错误码获得对应的文本信息
     * @param code  错误id / 错误code
     * @param args  可变参数
     */
    get(code: number | string, args?: any[]) {
        let cfg: ErrorCfg = null
        if (typeof (code) == "number") {
            cfg = BConfigManager.getItemById(ErrorCfg, code);
        } else {
            cfg = BConfigManager.getItemByField(ErrorCfg, "code", code, null);
        }
        if (cfg) {
            let str: string = cfg.desc;
            let n: number = args ? args.length : 0;
            if (n > 0) {
                for (let i = 0; i < n; i++) {
                    str = BStringUtils.replace(str, "%s", args[i]);
                }
            }
            return str;
        } else if (args && args.length > 0) {
            return args.join('');
        }
        return null;
    }

    /**
     * 监听错误号消息
     * @param id 错误号或错误号数组
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     * @param priority 优先级
     */
    on(id: number | number[], callback: Function, thisArg?: any, priority?: number) {
        if (cc.js.isNumber(id)) {
            // 添加一条
            gdk.e.on(ERROR_EVENT_PREFIX + id, callback, thisArg, priority, false);
        } else if (typeof id === 'object') {
            // 同时添加多条错误处理
            id.forEach(code => {
                gdk.e.on(ERROR_EVENT_PREFIX + code, callback, thisArg, priority, false);
            });
        }
    }

    /**
     * 监听错误号消息一次后自动移除
     * @param id 错误号或错误号数组
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     * @param priority 优先级
     */
    once(id: number | number[], callback: Function, thisArg?: any, priority?: number) {
        if (cc.js.isNumber(id)) {
            // 添加一条
            gdk.e.once(ERROR_EVENT_PREFIX + id, callback, thisArg, priority, false);
        } else if (typeof id === 'object') {
            // 同时添加多条错误处理
            id.forEach(code => {
                gdk.e.once(ERROR_EVENT_PREFIX + code, callback, thisArg, priority, false);
            });
        }
    }

    /**
     * 移除错误号监听
     * @param id 错误号
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     */
    off(id: number, callback: Function, thisArg?: any) {
        gdk.e.off(ERROR_EVENT_PREFIX + id, callback, thisArg);
    }

    /**
     * 取消指定错误号的所有监听
     * @param id 
     */
    offAll(id: number) {
        gdk.e.offAll(ERROR_EVENT_PREFIX + id);
    }

    /**
     * 取消thisArg对象注册的所有监听
     * @param {any} thisArg 
     */
    targetOff(thisArg: any) {
        var all: object = gdk.e['__all__'];
        if (all) {
            var keys: string[] = Object.keys(all);
            for (let i = 0, n = keys.length; i < n; i++) {
                let eventType: string = keys[i];
                if (BStringUtils.startsWith(eventType, ERROR_EVENT_PREFIX)) {
                    let trigger: gdk.EventTrigger = all[eventType];
                    trigger.targetOff(thisArg);
                    if (trigger.count < 1) {
                        gdk.e.offAll(eventType);
                    }
                }
            }
        }
    }
}

const BErrorManager = gdk.Tool.getSingleton(ErrorManagerClass);
iclib.addProp('ErrorManager', BErrorManager);
export default BErrorManager;