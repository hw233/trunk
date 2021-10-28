/**
 * 资源加载器相关的优化
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-19 11:44:00
 */
if (CC_EDITOR) {
    // 针对编辑器、原生应用不做任何处理
} else {

    const Buffer = require('buffer').Buffer;
    const amf = require('ham-amf');
    const pako = require('pako');
    const xxtea = require('xxtea-node');

    const dynamicAtlasManager = cc.dynamicAtlasManager;
    const assetManager = cc.assetManager;
    const downloader = assetManager.downloader;
    const parser = assetManager.parser;
    const utils = assetManager.utils;

    // 常量
    const JSON_PREFIX = 'AMF3#';
    const JSON_PREFIX_LEN = JSON_PREFIX.length;
    const UTF8_DECODER = window.TextDecoder ? new TextDecoder("utf-8") : null;

    // JSON加密KEY
    let JSON_KEY = null;
    if (window._TDSettings && window._TDSettings['json-key']) {
        JSON_KEY = xxtea.toBytes(window._TDSettings['json-key']);
        delete window._TDSettings['json-key'];
    }

    // 合并json缓存，降低http请求
    let JsonCache = {};
    if (window._TDJsons) {
        let val = window._TDJsons;
        if (cc.js.isString(val)) {
            // 保存的是all_json文件的版本
            cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {
                if (cc.sys.isNative) {
                    // 原生模式
                    let temp = `assets/all_json.txt`;
                    let text = jsb.fileUtils.getStringFromFile(temp);
                    if (text) {
                        let buf = Buffer.from(text, 'base64');
                        buf = Buffer.from(pako.inflate(buf));
                        JsonCache = amf.decodeObject(buf);
                    }
                } else {
                    // H5模式
                    let url = `all_json.${val}.txt`;
                    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                        // 微信小游戏
                        let remote = `${assetManager.downloader._remoteServerAddress}`;
                        if (remote) {
                            url = `${remote}remote/${url}`;
                        }
                    }
                    assetManager.loadRemote(url, (err, asset) => {
                        if (err || !asset) return;
                        let buf = Buffer.from(asset.text, 'base64');
                        buf = Buffer.from(pako.inflate(buf));
                        JsonCache = amf.decodeObject(buf);
                        assetManager.releaseAsset(asset);
                    });
                }
            });
        } else if (val && val.v && val.t) {
            // {t: 类型, v: 值}
            let buf = Buffer.from(val.v, val.t);
            buf = Buffer.from(pako.inflate(buf));
            JsonCache = amf.decodeObject(buf);
        }
        window._TDJsons = null;
        delete window._TDJsons;
    }

    // uint8array 转 utf-8 string
    function utf8ArrayToStr (array, i, len) {
        (i === void 0) && (i = 0);
        (len === void 0) && (len = array.length);

        var c;
        var char2, char3;
        var out = "";
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }

        return out;
    };

    // 判断是否为amf格式
    function isAmf (content) {
        return utf8ArrayToStr(content, 0, JSON_PREFIX_LEN) === JSON_PREFIX;
    };

    // 解压解密
    function uncompress (content) {
        let compress = content[JSON_PREFIX_LEN] != 0;
        content = content.slice(JSON_PREFIX_LEN + 1);
        // 解密
        if (JSON_KEY != null) {
            content = xxtea.decrypt(content, JSON_KEY);
        }
        content = compress ? pako.inflate(content) : content;
        return Buffer.from(content);
    };

    // 读取amf内容
    function parseAmf (content) {
        return amf.decodeObject(content);
    };
    const decode = UTF8_DECODER ? UTF8_DECODER.decode.bind(UTF8_DECODER) : utf8ArrayToStr;

    // 图片加载
    const IMAG_TYPE = {
        '.png': true,
        '.jpg': true,
        '.png': true,
        '.jpeg': true,
        '.gif': true,
        '.ico': true,
        '.tiff': true,
        '.webp': true,
        '.image': true,
    };
    const TEXTURE_TYPE = {
        '.pkm': true,
        '.pvr': true,
    };
    const JSON_TYPE = {
        '.json': true,
        '.ExportJson': true,
    };
    downloader.$downloader0_download = downloader.download;
    downloader.download = function (id, url, type, options, onComplete) {
        // 加载图片
        if ((IMAG_TYPE[type] || TEXTURE_TYPE[type]) &&
            dynamicAtlasManager &&
            dynamicAtlasManager.enabled
        ) {
            let info = dynamicAtlasManager.getInfo(url);
            if (info) {
                // 如果已经在动态图集中，则不需要重复加载
                onComplete && onComplete(null, {
                    isInAtals: true,
                    width: info.width,
                    height: info.height,
                });
                return;
            }
        } else if (JSON_TYPE[type] === true) {
            // 使用json缓存
            let uuid = utils.getUuidFromURL(url);
            let data = JsonCache[uuid];
            if (data != null) {
                if (data instanceof Buffer) {
                    // 已经解压解密
                    data = parseAmf(data);
                } else if (isAmf(data)) {
                    // AMF格式（压缩或加密）
                    data = JsonCache[uuid] = uncompress(data);
                    data = parseAmf(data);
                } else {
                    // 非压缩格式
                    data = JSON.parse(data);
                    JsonCache[uuid] = amf.encodeObject(data);
                }
                if (data) {
                    onComplete && onComplete(null, data);
                    return;
                }
                // 解析数据异常，则清除缓存数据
                JsonCache[uuid] = null;
                delete JsonCache[uuid];
            }
        }
        // 默认的加载处理函数
        this.$downloader0_download(id, url, type, options, onComplete);
    };

    // 微信小游戏
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {

        // 针对engine的修改
        cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {

            var downloadDomImage = downloader.downloadDomImage;

            // JSON解析函数
            wx.__parse__json = function (content) {
                let data = null;
                let buff = new Uint8Array(content);
                if (isAmf(buff)) {
                    // AMF格式
                    data = parseAmf(uncompress(buff));
                } else {
                    // 非压缩格式
                    data = JSON.parse(decode(buff));
                }
                return data;
            };

            // 图片解析函数
            function parseImageNew (file, options, onComplete) {
                if (file && typeof file === 'object' && file.isInAtals === true) {
                    onComplete && onComplete(null, file);
                    return;
                }
                // use HTMLImageElement to load
                downloadDomImage(file, options, onComplete);
            };

            // 注册解析器
            for (let type in IMAG_TYPE) {
                parser.register(type, parseImageNew);
            }
        });
        return;
    }

    // 原生模式
    if (cc.sys.isNative) {
        return;
    }

    // 针对engine的修改
    cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {

        const gdk = require('../gdk');
        const WorkerLoader = require('../core/gdk_WorkerLoader');
        const capabilities = cc.sys.capabilities;

        var pngWorker = null;
        var arrayBufferWorker = null;
        var downloadDomImage = downloader.downloadDomImage;
        var downloadFile = downloader.downloadFile;
        var downloadBlob = function (url, options, onComplete) {
            options.responseType = "blob";
            downloadFile(url, options, options.onFileProgress, onComplete);
        };

        // 二进制文件加载函数
        function downloadArrayBufferNew (url, options, onComplete) {

            // 以多线程方式加载二进制数据
            if (arrayBufferWorker && !arrayBufferWorker.excludeFiles[url]) {
                options.responseType = "arraybuffer";
                arrayBufferWorker.send(url, options)
                    .then(data => {
                        onComplete && onComplete(data.error, data.data);
                    })
                    .catch(err => {
                        // 加载异常
                        arrayBufferWorker.excludeFiles[url] = true;
                        onComplete && onComplete(err, null);
                    });
                return;
            }

            // 使用旧的方法加载
            options.responseType = "arraybuffer";
            downloadFile(url, options, onComplete);
        };

        // Json加载函数
        function downloadJsonNew (url, options, onComplete) {

            // 以二进制形式加载，然后解析
            downloadArrayBufferNew(url, options, function (err, content) {
                let data = null;
                if (!err) {
                    if (content) {
                        content = new Uint8Array(content);
                        if (isAmf(content)) {
                            // AMF格式
                            content = uncompress(content);
                            data = parseAmf(content);
                        } else {
                            // 非压缩格式
                            content = decode(content);
                            data = JSON.parse(content);
                        }
                        // 缓存小于50K的数据
                        if (content.length < 50 * 1024) {
                            let uuid = utils.getUuidFromURL(url);
                            JsonCache[uuid] = content;
                            if (err && JsonCache[uuid]) {
                                // 解析数据出现异常，则清除缓存
                                JsonCache[uuid] = null;
                                delete JsonCache[uuid];
                            }
                        }
                    } else {
                        // 内容出现错误错误
                        err = new Error('download failed: ' + url + '(no response)');
                    }
                }
                onComplete && onComplete(err, data);
            });
        };

        // 图片加载函数
        function downloadImageNew (url, options, onComplete) {
            if (pngWorker && !pngWorker.excludeFiles[url]) {
                // 线程有效，前且当前图片不在排除列表中
                pngWorker.send(url, options)
                    .then(data => {
                        if (data.error) {
                            onComplete && onComplete(new Error('download failed: ' + url + ', status: ' + data.error), null);
                            return;
                        }
                        if (data.data) {
                            data.data.flipY = !!options.__flipY__;
                            data.data.premultiplyAlpha = !!options.__premultiplyAlpha__;
                        }
                        onComplete && onComplete(null, data.data);
                    })
                    .catch(err => {
                        // 加载异常
                        pngWorker.excludeFiles[url] = true;
                        onComplete && onComplete(err, null);
                    });
                return;
            }
            // if createImageBitmap is valid, we can transform blob to ImageBitmap. Otherwise, just use HTMLImageElement to load
            var b = capabilities.imageBitmap && cc.macro.ALLOW_IMAGE_BITMAP;
            b = b && (!parser.NoImageBitmapFiles || !parser.NoImageBitmapFiles[url]);
            let func = b ? downloadBlob : downloadDomImage;
            func.apply(this, arguments);
        };

        // 加载二进制数据工作线程
        Object.defineProperty(gdk.macro, "ENABLE_ARRAYBUFFER_WORKER", {
            get() {
                return gdk.macro._N$_ENABLE_ARRAYBUFFER_WORKER || false;
            },
            set(v) {
                if (v) {
                    // 初始化ArrayBuffer线程实例
                    if (arrayBufferWorker == null && typeof (Worker) !== "undefined") {
                        // 处理方法
                        const formatFn = `const formatFn = (url, options, onComplete) => {
                            let xhr = new XMLHttpRequest();
                            xhr.open("GET", url, true);
                            xhr.responseType = options.responseType;

                            if (options.withCredentials !== undefined) xhr.withCredentials = options.withCredentials;
                            if (options.mimeType !== undefined && xhr.overrideMimeType ) xhr.overrideMimeType(options.mimeType);
                            if (options.timeout !== undefined) xhr.timeout = options.timeout;
                            if (options.header) {
                                for (let header in options.header) {
                                    xhr.setRequestHeader(header, options.header[header]);
                                }
                            }
                            
                            xhr.onload = function () {
                                if ( xhr.status === 200 || xhr.status === 0 ) {
                                    // 转换为二进制数据
                                    onComplete(null, xhr.response);
                                } else {
                                    // 网络错误
                                    onComplete(xhr.status + '(no response)', null);
                                }
                            };
                            xhr.ontimeout = function () {
                                // 加载超时
                                onComplete(xhr.status + '(time out)', null);
                            };
                            xhr.onerror = function () {
                                // 加载失败
                                onComplete(xhr.status + '(error)', null);
                            };
                            xhr.send(null);
                            return xhr;
                        };`;
                        arrayBufferWorker = new WorkerLoader('', formatFn);
                    }
                } else if (arrayBufferWorker) {
                    // 关闭线程
                    arrayBufferWorker.close();
                    arrayBufferWorker = null;
                }
                gdk.macro._N$_ENABLE_ARRAYBUFFER_WORKER = v;
            },
            enumerable: true,
            configurable: false,
        });

        // 加载png工作线程, 支持createImageBitmap和Worker
        Object.defineProperty(gdk.macro, "ENABLE_PNG_WORKER", {
            get() {
                return gdk.macro._N$_ENABLE_PNG_WORKER || false;
            },
            set(v) {
                if (v) {
                    // 初始化png线程实例
                    if (pngWorker == null && capabilities.imageBitmap && cc.macro.ALLOW_IMAGE_BITMAP && typeof (Worker) !== "undefined") {
                        // 处理方法
                        const formatFn = `const formatFn = (url, options, onComplete) => {
                            let xhr = new XMLHttpRequest();
                            xhr.open("GET", url, true);
                            xhr.responseType = "blob";

                            if (options.withCredentials !== undefined) xhr.withCredentials = options.withCredentials;
                            if (options.mimeType !== undefined && xhr.overrideMimeType ) xhr.overrideMimeType(options.mimeType);
                            if (options.timeout !== undefined) xhr.timeout = options.timeout;
                            if (options.header) {
                                for (let header in options.header) {
                                    xhr.setRequestHeader(header, options.header[header]);
                                }
                            }
                            
                            xhr.onload = function () {
                                if ( xhr.status === 200 || xhr.status === 0 ) {
                                    // 转换图片
                                    try {
                                        let blob = xhr.response;
                                        let imageOptions = {};
                                        imageOptions.imageOrientation = options.__flipY__ ? 'flipY' : 'none';
                                        imageOptions.premultiplyAlpha = options.__premultiplyAlpha__ ? 'premultiply' : 'none';
                                        self.createImageBitmap(blob, imageOptions)
                                            .then(result => {
                                                // 解码成功
                                                onComplete(null, result);
                                                blob.close && blob.close();
                                            })
                                            .catch(err => {
                                                // 解码错误
                                                onComplete(xhr.status + '(' + err + ')', null);
                                            });
                                    } catch(e) {
                                        // 解码异常
                                        onComplete(xhr.status + '(' + e + ')', null);
                                    }
                                } else {
                                    // 网络错误
                                    onComplete(xhr.status + '(no response)', null);
                                }
                            };
                            xhr.ontimeout = function () {
                                // 加载超时
                                onComplete(xhr.status + '(time out)', null);
                            };
                            xhr.onerror = function () {
                                // 加载失败
                                onComplete(xhr.status + '(error)', null);
                            };
                            xhr.send(null);
                            return xhr;
                        };`;
                        pngWorker = new WorkerLoader('', formatFn);
                    }
                } else if (pngWorker) {
                    // 关闭线程
                    pngWorker.close();
                    pngWorker = null;
                }
                gdk.macro._N$_ENABLE_PNG_WORKER = v;
            },
            enumerable: true,
            configurable: false,
        });

        // 注册下载器
        for (let type in JSON_TYPE) {
            downloader.register(type, downloadJsonNew);
        }
        for (let type in IMAG_TYPE) {
            downloader.register(type, downloadImageNew);
        }
        downloader.register('.pkm', downloadArrayBufferNew);
        downloader.register('.pvr', downloadArrayBufferNew);

        // 音乐音效下载器
        let audioSupport = cc.sys.__audioSupport;
        if (audioSupport &&
            audioSupport.WEB_AUDIO &&
            audioSupport.format &&
            audioSupport.format.length > 0
        ) {
            let downloadDomAudio = downloader.downloadDomAudio;
            let downloadAudioNew = function (url, options, onComplete) {
                // web audio need to download file as arrayBuffer
                if (options.audioLoadMode !== cc.AudioClip.LoadMode.DOM_AUDIO) {
                    downloadArrayBufferNew(url, options, onComplete);
                } else {
                    downloadDomAudio(url, options, onComplete);
                }
            };
            downloader.register('.mp3', downloadAudioNew);
            downloader.register('.ogg', downloadAudioNew);
            downloader.register('.wav', downloadAudioNew);
            downloader.register('.m4a', downloadAudioNew);
        }
    });
}