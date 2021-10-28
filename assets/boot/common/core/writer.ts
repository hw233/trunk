import BConfigManager from '../managers/BConfigManager';
import { Md5_msgCfg } from '../../configs/bconfig';
import Long = require("long");

// 如果存在TextEncoder内使用内存的编码器
let encode: (input: string) => Uint8Array;
if (window.TextEncoder && typeof window.TextDecoder === 'function') {
    let encoder = new window.TextEncoder();
    encode = encoder.encode.bind(encoder);
}
if (!encode) {
    // 字符串编码（支持中文）
    encode = function (s: string): Uint8Array {
        const utf8: number[] = [];
        let i: number = 0;
        let codePoint: number;
        while (i < s.length) {
            // Decode UTF-16
            const a = s.charCodeAt(i);
            i += 1;
            if (a < 0xD800 || a >= 0xDC00) {
                codePoint = a;
            } else {
                const b = s.charCodeAt(i);
                i += 1;
                codePoint = (a << 10) + b + (0x10000 - (0xD800 << 10) - 0xDC00);
            }

            // Encode UTF-8
            if (codePoint < 0x80) {
                utf8.push(codePoint);
            } else {
                if (codePoint < 0x800) {
                    utf8.push(((codePoint >> 6) & 0x1F) | 0xC0);
                } else {
                    if (codePoint < 0x10000) {
                        utf8.push(((codePoint >> 12) & 0x0F) | 0xE0);
                    } else {
                        utf8.push(
                            ((codePoint >> 18) & 0x07) | 0xF0,
                            ((codePoint >> 12) & 0x3F) | 0x80);
                    }
                    utf8.push(((codePoint >> 6) & 0x3F) | 0x80);
                }
                utf8.push((codePoint & 0x3F) | 0x80);
            }
        }
        let len = utf8.length;
        let ret = new Uint8Array(len);
        for (let i = 0; i < len; i += 1) {
            ret[i] = utf8[i];
        }
        return ret;
    };
}

// 获取md5
const key = encode('wuH3ySbvyX%rwIfexJOj$nOJ$P$@QiNH');
const fromHexString = (hexString: string) => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
function hash(data: Uint8Array) {
    let tmp = new Uint8Array(data.byteLength + key.byteLength);
    tmp.set(new Uint8Array(data), 0);
    tmp.set(new Uint8Array(key), data.byteLength);
    let str = gdk.md5(tmp);
    return fromHexString(str);
};

const L1 = Long.fromNumber(~0x7F);
const L2 = Long.fromNumber(0xFF);
const L3 = Long.fromNumber(0x80);

export default class Writer implements icmsg.IWriter {

    // 自增ID
    index: number;

    private buffer: gdk.SmartBuffer = gdk.SmartBuffer.fromSize(64);
    private msgType: number;

    StartMessage(msgType: number) {
        this.buffer.clear();
        this.msgType = msgType;
        this.WriteInt16(msgType);
    }

    FinishMessage() {
        // 是否需要添加签名
        if (!!BConfigManager.getItemById(Md5_msgCfg, this.msgType)) {
            // 自增ID
            this.buffer.insertInt16BE(++this.index, 0);
            let md5 = hash(this.buffer.toBuffer());
            // 签名串
            for (let i = 0, n = md5.length; i < n; i++) {
                this.buffer.writeUInt8(md5[i]);
            }
            // 压缩和签名标志，0不压缩不签名，1压缩不签名，2不压缩签名，3压缩并签名
            this.buffer.insertUInt8(0x02, 2);
            // 自动ID重置
            if (this.index >= 65535) {
                this.index = 0;
            }
            this.buffer.writeOffset = 0;
            this.buffer.writeInt16BE(this.buffer.length - 2);
        } else {
            // 无需签名的协议包
            this.buffer.insertUInt8(0, 0);
            this.buffer.insertInt16BE(this.buffer.length, 0);
        }
    }

    WriteString(value: string) {
        if (typeof value !== 'string') {
            value = '';
        }
        const utf8Arr = encode(value);
        const len = utf8Arr.length;
        this.buffer.writeUInt16BE(len);
        for (let i = 0; i < len; i++) {
            this.buffer.writeUInt8(utf8Arr[i]);
        }
    }

    WriteByte(n: number) {
        this.buffer.writeUInt8(n);
    }

    WriteInt16(n: number) {
        this.buffer.writeInt16BE(n);
    }

    WriteInt32(n: number) {
        this.buffer.writeInt32BE(n);
    }

    WriteUInt32(n: number) {
        this.buffer.writeUInt32BE(n);
    }

    WriteInt64(n: number) {
        // for (var i = 0; i < 8; i++) {
        //     this.buffer.writeUInt8(n[i]);
        // }
        var h = (n / 4294967296) >> 0;
        var l = n - h * 4294967296;
        this.buffer.writeUInt32BE(h);
        this.buffer.writeUInt32BE(l);
    }

    _WriteInt(x: Long) {
        while (x.and(L1).greaterThan(Long.ZERO)) {
            this.buffer.writeUInt8(x.and(L2).or(L3).toNumber());
            x = x.shiftRightUnsigned(7);
        }
        this.buffer.writeUInt8(x.toNumber());
    }

    WriteInt(n: number) {
        let x = Long.fromNumber(n).shiftLeft(1);
        if (x.lessThan(Long.ZERO)) {
            x = x.not();
        }
        return this._WriteInt(x);
    }

    WriteUInt(n: number) {
        let x = Long.fromNumber(n);
        this._WriteInt(x);
    }

    WriteBool(b: boolean) {
        this.buffer.writeUInt8(b ? 1 : 0);
    }

    Buffer(): ArrayBuffer {
        let buf = this.buffer.toBuffer();
        return buf.buffer;
    }
}
