import Reader from './reader';
import Writer from './writer';

/**
 * 网络套节字连接
 * @Author: sthoo.huang
 * @Date: 2019-03-05 13:49:12
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-31 10:45:11
 */

interface SendItem {
    target: any,
    callback: (msg: icmsg.Message, r: boolean) => void,
    msg: icmsg.Message,
}

// 心跳包间隔时间（秒）
const HEART_INTERVAL: number = 10;
// 连接超时时间
const TIME_OUT: number = 1 * 60 * 1000;
const TIME_OUT_ARGS: any[] = [new Error('connection timeout')];
// 心跳包数据实例
const HEART_MSG = new icmsg.SystemHeartbeatReq();

export default class Connection extends cc.Component {

    url: string;
    binaryType: BinaryType = 'arraybuffer';

    _socket: WebSocket = null;
    _writer: Writer = null;
    _reader: Reader = null;
    _isclosded: boolean = false;

    _current: SendItem = null;      // 当前正在发送的项
    _sendQueue: SendItem[] = [];    // 发送缓冲队列
    _heartTime: number = HEART_INTERVAL;    // 心跳倒计时（秒)

    onOpen: gdk.EventTrigger = null;
    onClose: gdk.EventTrigger = null;
    onMessage: gdk.EventTrigger = null;

    onLoad() {
        this._writer = new Writer();
        this._reader = new Reader();
        this.onOpen = gdk.EventTrigger.get();
        this.onClose = gdk.EventTrigger.get();
        this.onMessage = gdk.EventTrigger.get();
        // 为事件绑定thisArg
        this._onopen = this._onopen.bind(this);
        this._onclose = this._onclose.bind(this);
        this._onmessage = this._onmessage.bind(this);
    }

    onDestroy() {
        gdk.EventTrigger.put(this.onOpen);
        gdk.EventTrigger.put(this.onClose);
        gdk.EventTrigger.put(this.onMessage);
        if (this._socket) {
            this._socket.onopen = null;
            this._socket.onerror = null;
            this._socket.onclose = null;
            this._socket.onmessage = null;
            this.close();
        }
        this.onOpen = null;
        this.onClose = null;
        this.onMessage = null;
        this._writer = null;
    }

    /** 获得当前连接状态 */
    get isConnected(): boolean {
        return this._socket && this._socket.readyState === WebSocket.OPEN;
    }

    /**
     * 建立连接
     * @param addr 
     * @param binaryType 
     */
    connect(addr: string, binaryType: BinaryType = 'arraybuffer', timeout: number = 30): void {
        if (this._socket &&
            this._socket.url === addr &&
            (this._socket.readyState === WebSocket.OPEN ||
                this._socket.readyState === WebSocket.CONNECTING)) {
            // 相同的连接地址，并且状态为已连接或正在连接时，忽略连接请求
            return;
        }
        if (this._socket) {
            // 已经存在连接，则强制关闭旧的连接
            this._onclose();
        }
        try {
            // 添加连接超时计时器
            gdk.Timer.once(timeout * 1000, this, this._onclose, TIME_OUT_ARGS);
            this.binaryType = binaryType;
            this.url = addr;
            this._writer.index = 0;
            this._socket = new WebSocket(this.url);
            this._socket.binaryType = this.binaryType;
            this._socket.onopen = this._onopen;
            this._socket.onerror = this._onclose;
            this._socket.onclose = this._onclose;
            this._socket.onmessage = this._onmessage;
            this._isclosded = false;
        } catch (err) {
            this._onclose();
            CC_DEBUG && cc.warn('连接失败：', addr, err);
        }
    }

    _onopen(event: any) {
        gdk.Timer.once(TIME_OUT, this, this._onclose, TIME_OUT_ARGS);   // 更新连接超时计时器
        this._heartTime = HEART_INTERVAL;
        this._reader.Clear();
        this.onOpen.emit();
    }

    _onclose(event?: any) {
        CC_DEBUG && cc.warn("Websocket关闭或连接超时", event);
        if (this._socket) {
            this._socket.onopen = null;
            this._socket.onerror = null;
            this._socket.onclose = null;
            this._socket.onmessage = null;
            switch (this._socket.readyState) {
                case WebSocket.CONNECTING:
                case WebSocket.OPEN:
                    try {
                        CC_DEBUG && cc.warn(`强制关闭连接：${this._socket.url}`);
                        this._socket.close();
                    } catch (err) {
                    }
                    break;
            }
            this._socket = null;
            this.onClose.emit(event);
        }
        // 处理发送结果回调队列
        if (this._current) {
            let cb = this._current.callback;
            if (cb) {
                cb.call(this._current.target, this._current.msg, false);
            }
            this._current = null;
        }
        for (let i = 0, n = this._sendQueue.length; i < n; i++) {
            let item = this._sendQueue[i];
            let cb = item.callback;
            if (cb) {
                cb.call(item.target, item.msg, false);
            }
        }
        this._sendQueue.length = 0;
        // 清除超时检测
        gdk.Timer.clear(this, this._onclose);
    }

    _onmessage(event: any) {
        let reader: Reader = this._reader;
        let msgType: number;
        let msg: icmsg.Message;
        // 网络数据
        reader.WriteBuff(event.data);
        while (reader.HasMessage) {
            msgType = reader.BeginMessage();
            let clazz = icmsg.MessageClass[msgType];
            if (clazz) {
                try {
                    msg = new clazz();
                    msg.decode(reader);
                } catch (err) {
                    cc.error("网络错误：", err);
                }
            } else {
                cc.error(`找不到${msgType}对应的Message类定义，请检查协议代码，或重新生成协议代码`);
            }
            reader.FinishMessage();
            try {
                if (msgType == icmsg.MessageType.MsgTypeSystemClose) {
                    // 服务器关闭消息包
                    this.send(new icmsg.SystemCloseReq());
                    this._isclosded = true;
                }
                this.onMessage.emit(msgType, msg);
            } catch (err) {
                cc.error(err);
            }
        }
        // 更新连接超时计时器
        gdk.Timer.once(TIME_OUT, this, this._onclose, TIME_OUT_ARGS);
        this._heartTime = HEART_INTERVAL;
    }

    /** 关闭连接 */
    close() {
        this._onclose();
    }

    /**
     * 发送网络消息，如果网络当前可用则把此消息放入发送缓冲队列中
     * @param m 
     * @param cb 
     * @param thisArg 
     */
    send(m: icmsg.Message, cb?: (msg: icmsg.Message, r: boolean) => void, thisArg?: any): boolean {
        if (this._socket == null) {
            CC_DEBUG && cc.warn("没有创建WebSocket");
        } else if (this._isclosded) {
            CC_DEBUG && cc.warn("服务器已关闭");
        } else {
            switch (this._socket.readyState) {
                case WebSocket.OPEN:
                    // 发送成功
                    let item: SendItem = {
                        target: thisArg,
                        callback: cb,
                        msg: m,
                    };
                    if (this._current) {
                        // 当前项还没有发送完成，则放入到发送缓冲队列中
                        this._sendQueue.push(item);
                    } else {
                        // 当前没有正在发送的项，则立即发送
                        this._current = item;
                        this._current.msg.encode(this._writer);
                        this._socket.send(this._writer.Buffer());
                        this._heartTime = HEART_INTERVAL;
                    }
                    return true;

                case WebSocket.CONNECTING:
                    CC_DEBUG && cc.warn("WebSocket连接还没成功");
                    break;

                default:
                    CC_DEBUG && cc.warn("WebSocket状态为不对");
                    break;
            }
        }
        cb && cb.call(thisArg, m, false);
        return false;
    }

    update(dt: number) {
        if (this._isclosded) return;
        if (this._socket == null) return;
        if (this._socket.bufferedAmount > 0) return;
        if (this._current) {
            let cb = this._current.callback;
            if (cb) {
                cb.call(this._current.target, this._current.msg, true);
            }
            this._current = null;
        }
        // 连接没有关闭，并且缓冲区数据已经全部发送完成
        if (this._sendQueue.length > 0) {
            this._current = this._sendQueue.shift();
            this._current.msg.encode(this._writer);
            this._socket.send(this._writer.Buffer());
            this._heartTime = HEART_INTERVAL;
        }
        // 心跳包处理
        this._heartTime -= dt;
        if (this._heartTime <= 0) {
            this._heartTime = HEART_INTERVAL;
            this.send(HEART_MSG);
        }
    }
}