import Long = require("long");

export default class Reader implements icmsg.IReader {

    private buffer: gdk.SmartBuffer = gdk.SmartBuffer.fromSize(64);
    private bufferOne: gdk.SmartBuffer = gdk.SmartBuffer.fromSize(64);
    private msgLen: number = 0;

    // 追加数据到消息缓冲区
    WriteBuff(buf: ArrayBuffer) {
        this.buffer.writeBuffer(gdk.Buffer.from(buf));
    }

    // 开始读取一条消息准备处理
    BeginMessage() {
        let compress = this.buffer.readUInt8() > 0;
        let msgbuf: Uint8Array = this.buffer.readBuffer(this.msgLen - 1);
        if (compress) {
            // 解压
            msgbuf = gdk.pako.inflate(msgbuf);
        }
        this.bufferOne.clear();
        this.bufferOne.writeBuffer(gdk.Buffer.from(msgbuf));
        // 返回消息类型
        return this.ReadInt16();
    }

    // 完成一条消息处理后调用
    FinishMessage() {
        this.msgLen = 0;
        this.bufferOne.clear();
        // 清理缓冲区已读数据的内存占用
        let buf: Uint8Array;
        if (this.buffer.remaining()) {
            buf = this.buffer.readBuffer();
        }
        this.buffer.clear();
        buf && this.WriteBuff(buf);
    }

    get HasMessage(): boolean {
        if (this.buffer.remaining() < 2) return false;
        if (this.msgLen === 0) {
            // 读取消息长度
            this.msgLen = this.buffer.readUInt16BE();
            if (this.msgLen === 0) {
                cc.error('异常：消息长度为0');
                return false;
            }
            if (CC_DEBUG && this.msgLen > 1024) {
                cc.warn(`警告：收的的消息长度大于1K`);
            }
        }
        // 是否存在可读消息标志
        return this.buffer.remaining() >= this.msgLen;
    }

    Clear() {
        this.buffer.clear();
        this.bufferOne.clear();
        this.msgLen = 0;
    }

    ReadString(): string {
        let len: number = this.bufferOne.readUInt16BE();
        return this.bufferOne.readString(len);
    }

    ReadBytes(): Uint8Array {
        let len: number = this.bufferOne.readUInt16BE();
        return this.bufferOne.readBuffer(len);
    }

    ReadByte(): number {
        return this.bufferOne.readUInt8();
    }

    ReadInt16(): number {
        return this.bufferOne.readInt16BE();
    }

    ReadInt32(): number {
        return this.bufferOne.readInt32BE();
    }

    ReadUInt32(): number {
        return this.bufferOne.readUInt32BE();
    }

    ReadInt64(): number {
        let h = this.bufferOne.readUInt32BE();
        let l = this.bufferOne.readUInt32BE();
        let i = h * 4294967296 + l;
        return i;
    }

    _ReadInt() {
        let x = Long.ZERO;
        let s = 0;
        while (this.bufferOne.remaining()) {
            let b = this.bufferOne.readUInt8();
            if (b < 0x80) {
                x = x.add(Long.fromNumber(b).shiftLeft(s));
                break;
            }
            x = x.add(Long.fromNumber(b & 0x7f).shiftLeft(s));
            s += 7;
        }
        return x;
    }

    ReadInt(): number {
        let ux = this._ReadInt();
        let x = ux.shiftRight(1);
        if (!ux.and(1).isZero()) {
            x = x.not();
        }
        return x.toNumber();
    }

    ReadUInt(): number {
        return this._ReadInt().toNumber();
    }

    ReadBool(): boolean {
        return this.bufferOne.readUInt8() > 0;
    }
}
