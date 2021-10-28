import BStringUtils from '../utils/BStringUtils';
import Connection from '../core/connection';

/** 
 * 网络及控制器管理类
 * @Author: sthoo.huang  
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-03-26 14:06:09
 * @Last Modified time: 2021-08-30 14:12:14
 */

// 生成消息映射表
let generalMsgMap = function (a: number[]) {
    let r: { [id: number]: boolean } = {};
    a.forEach(i => r[i] = true);
    return r;
};
// 网络消息事件前缀
const MSG_EVENT_PREFIX: string = "msg_event_";
// 排除打印的消息
const EXCLUDE_LOG_MSG: { [id: number]: boolean } = generalMsgMap([
    icmsg.SystemHeartbeatRsp.MsgType,
]);
// 发送失败后自动重试的消息（最后一个）
const AUTO_RETRY_MSG_SINGLE: { [id: number]: boolean } = generalMsgMap([
    icmsg.DungeonHangPreviewReq.MsgType,

    // 副本开启和结算
    icmsg.DungeonEnterReq.MsgType, icmsg.DungeonExitReq.MsgType,
    icmsg.SurvivalEnterReq.MsgType, icmsg.SurvivalExitReq.MsgType,
    icmsg.FootholdFightStartReq.MsgType, icmsg.FootholdFightOverReq.MsgType,
    icmsg.ArenaFightReq.MsgType, icmsg.ArenaFightResultReq.MsgType,
    icmsg.BountyFightStartReq.MsgType, icmsg.BountyFightOverReq.MsgType,

    // 生存副本装备
    icmsg.SurvivalRefreshEquipPocketReq.MsgType,
    icmsg.SurvivalEquipBuyReq.MsgType,
]);
// 发送失败后自动重试的消息（多个）
const AUTO_RETRY_MSG: { [id: number]: boolean } = generalMsgMap([
    icmsg.FightQueryReq.MsgType,
    icmsg.MercenaryFightReq.MsgType,
    icmsg.BountyFightQueryReq.MsgType,
]);
// 发送失败不提示的消息
const EXCLUDE_FAIL_MSG: { [id: number]: boolean } = generalMsgMap([
    icmsg.SystemHeartbeatRsp.MsgType,
    icmsg.DungeonHangStatusReq.MsgType,
]);

class NetManagerClass {

    node: cc.Node;
    conn: Connection;
    queue: icmsg.Message[];  // 发送失败的包数组
    sendCallbackQueue: { [id: number]: { callback: Function, thisArg: any }[] };    // 发送回调监听队列

    /**
     * 初始化网络管理器
     */
    init() {
        this.node = gdk.engine.node;
        this.conn = this.node.getComponent(Connection);
        if (this.conn) {
            this.node.removeComponent(this.conn);
        }
        this.conn = this.node.addComponent(Connection);
        this.queue = [];
        this.sendCallbackQueue = {};
    }

    /**
     * 销毁网络管理器
     */
    destroy() {
        this.node.removeComponent(Connection);
        this.conn.close();
        this.conn = null;
        this.node = null;
        this.queue = null;
        this.sendCallbackQueue = null;
    }

    /**
     * 追加只记录最后一次发送失败的消息
     * @param msgType 
     */
    addSingleQueuMsg(msgType: number | number[]) {
        let arr: number[] = msgType instanceof Array ? msgType : [msgType];
        arr.forEach(t => AUTO_RETRY_MSG_SINGLE[t] = true);
    }

    /**
     * 添加控制器组件
     * @param clz 控制器组件类
     */
    addController(clz: new () => cc.Component): cc.Component {
        var ctrl = this.node.getComponent(clz);
        if (ctrl) {
            this.node.removeComponent(ctrl);
        }
        return this.node.addComponent(clz);
    }

    /**
     * 移除控制器组件
     * @param clz 控制器组件类
     */
    removeController(clz: new () => cc.Component) {
        this.node.removeComponent(clz);
    }

    /**
     * 连接服务器
     * @param addr 
     * @param cb 
     * @param thisArg 
     */
    connect(addr: string, cb?: Function, thisArg?: any, timeout: number = 30) {
        cc.log('连接服务器：', addr);
        this._cb = null;
        this._thisArg = null;
        if (cb) {
            this._cb = cb;
            this._thisArg = thisArg;
        }
        if (addr) {
            this.conn.onOpen.once(this._connectCallback, this);
            this.conn.onClose.once(this._connectCallback, this);
            this.conn.connect(addr, 'arraybuffer', timeout);
        }
    }

    /**
     * 清除回调
     * @param cb 
     * @param thisArg 
     */
    offcb(cb: Function, thisArg?: any) {
        if (this._cb && cb !== this._cb) return;
        if (this._thisArg && thisArg !== this._thisArg) return;
        this._cb = null;
        this._thisArg = null;
    }

    // 连接服务器回调
    private _cb: Function;
    private _thisArg: any;
    private _connectCallback(err?: any) {
        if (this._cb) {
            this._cb.call(this._thisArg, err);
            this._cb = null;
            this._thisArg = null;
        }
        this.conn.onOpen.off(this._connectCallback, this);
        this.conn.onClose.off(this._connectCallback, this);
        if (!err) {
            this.conn.onMessage.on(this._onMessageHandler, this);
        }
    }

    // 发送断线后发送失败的包
    sendQueue() {
        let q = this.queue.splice(0);
        for (let i = 0; i < q.length; i++) {
            this.send(q[i]);
        }
    }

    /**
     * 发送网络数据
     * @param data 
     * @param cb 
     * @param thisArg 
     */
    send(msg: icmsg.Message, cb?: Function, thisArg?: any): boolean {
        let clz: any = <any>msg.constructor;
        let id: number = clz.MsgType;
        CC_DEBUG && cc.log(`net message <<<< id: ${id},time:${Date.parse(new Date().toString())}, data: `, msg);
        if (cb) {
            // 发送回调处理
            if (AUTO_RETRY_MSG[id] === true) {
                let queue = this.sendCallbackQueue[id];
                if (!queue) {
                    queue = this.sendCallbackQueue[id] = [];
                }
                queue.push({ callback: cb, thisArg: thisArg });
            } else {
                // 单一回调处理
                this.once(id, cb, thisArg);
            }
        }
        return this.conn.send(msg, this._sendResult, this);
    }

    // 网络数据发送结果处理回调函数
    _sendResult(msg: icmsg.Message, isSucc: boolean) {
        if (isSucc) {
            // 发送成功，则无需任何后续处理
            if (msg instanceof icmsg.ChatSendReq) {
                // 聊天消息，直接模拟服务器返回
                let rm = iclib.SdkTool.tool['roleModel'];
                let sm = iclib.SdkTool.tool['serverModel'];
                if (rm && sm) {
                    let rsp = new icmsg.ChatSendRsp();
                    rsp.channel = msg.channel;
                    rsp.content = msg.content;
                    rsp.playerId = rm.id;
                    rsp.playerName = rm.name;
                    rsp.playerLv = rm.level;
                    rsp.playerHead = rm.head;
                    rsp.playerFrame = rm.frame;
                    rsp.playerTitle = rm.title;
                    rsp.playerVipExp = rm.vipExp;
                    rsp.guildName = rm.guildName;
                    rsp.chatTime = Math.floor(sm.serverTime / 1000);
                    gdk.e.emit(MSG_EVENT_PREFIX + icmsg.ChatSendRsp.MsgType, rsp);
                }
            }
            return;
        }
        // 消息构造函数和msgType
        let clz: any = <any>msg.constructor;
        let id: number = clz.MsgType;
        if (AUTO_RETRY_MSG_SINGLE[id] !== true && AUTO_RETRY_MSG[id] !== true) {
            // 无需记录的消息，则提示网络异常
            if (EXCLUDE_FAIL_MSG[id] !== true) {
                gdk.gui.showMessage('网络异常，请稍后重试', null, "update");
            }
            return;
        }
        if (AUTO_RETRY_MSG_SINGLE[id] === true) {
            // 相同msgType的包只计录一个
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let m = this.queue[i];
                let c = <any>m.constructor;
                if (c.MsgType == id) {
                    this.queue.splice(i, 1);
                    break;
                }
            }
        }
        // 添加至失败重试队列
        this.queue.push(msg);
    }

    _onMessageHandler(id: number, msg: icmsg.Message) {
        if (CC_DEBUG && EXCLUDE_LOG_MSG[id] !== true) {
            cc.log(`net message >>>> id: ${id},time:${Date.parse(new Date().toString())}, data: `, msg);
        }
        // 处理发送回调队列
        let queue = this.sendCallbackQueue[id];
        if (queue) {
            let item = queue.shift();
            if (queue.length == 0) {
                delete this.sendCallbackQueue[id];
            }
            item && item.callback.call(item.thisArg, msg);
        }
        if (msg instanceof icmsg.ChatSendRsp) {
            // 聊天消息，如果发送者为自己则忽略
            let rm = iclib.SdkTool.tool['roleModel'];
            let sm = iclib.SdkTool.tool['serverModel'];
            if (msg.playerId == rm.id && Math.floor(sm.serverTime / 1000) - msg.chatTime < 10) {
                return;
            }
        }
        // 广播全局事件
        gdk.e.emit(MSG_EVENT_PREFIX + id, msg);
    }

    /**
     * 监听网络消息
     * @param id 协议号
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     * @param priority 优先级
     */
    on(id: number, callback: Function, thisArg?: any, priority?: number) {
        gdk.e.on(MSG_EVENT_PREFIX + id, callback, thisArg, priority, false);
    }

    /**
     * 监听网络消息一次后自动移除
     * @param id 协议号
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     * @param priority 优先级
     */
    once(id: number, callback: Function, thisArg?: any, priority?: number) {
        gdk.e.once(MSG_EVENT_PREFIX + id, callback, thisArg, priority, false);
    }

    /**
     * 移除网络监听
     * @param id 协议号
     * @param callback 监听函数
     * @param thisArg 回调函数的this参数
     */
    off(id: number, callback: Function, thisArg?: any) {
        let queue = this.sendCallbackQueue[id];
        if (queue) {
            for (let i = 0, n = queue.length; i < n; i++) {
                let e = queue[i];
                if (e && e.callback === callback && e.thisArg === thisArg) {
                    queue[i] = null;
                }
            }
        }
        gdk.e.off(MSG_EVENT_PREFIX + id, callback, thisArg);
    }

    /**
     * 取消指定协议号的所有监听
     * @param id 
     */
    offAll(id: number) {
        let queue = this.sendCallbackQueue[id];
        if (queue) {
            for (let i = 0, n = queue.length; i < n; i++) {
                queue[i] = null;
            }
        }
        gdk.e.offAll(MSG_EVENT_PREFIX + id);
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
                if (BStringUtils.startsWith(eventType, MSG_EVENT_PREFIX)) {
                    let trigger: gdk.EventTrigger = all[eventType];
                    trigger.targetOff(thisArg);
                    if (trigger.count < 1) {
                        gdk.e.offAll(eventType);
                    }
                }
            }
        }
        // 移除发送回调
        for (let id in this.sendCallbackQueue) {
            let queue = this.sendCallbackQueue[id];
            for (let i = 0, n = queue.length; i < n; i++) {
                let e = queue[i];
                if (e && e.thisArg === thisArg) {
                    queue[i] = null;
                }
            }
        }
    }
}

const BNetManager = gdk.Tool.getSingleton(NetManagerClass);
iclib.addProp('NetManager', BNetManager);
export default BNetManager;