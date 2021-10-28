'use strcit';

///////////////// 优化 /////////////////

const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const crypto = require('crypto');
const through = require('through2');
const gulp = require('gulp');
const tinify = require('tinify');
const javascriptObfuscator = require('gulp-javascript-obfuscator');
const htmlmin = require('gulp-htmlmin');
const fileInline = require('gulp-file-inline');
const pako = require('pako');
const amf = require('ham-amf');
const JSZip = require('jszip');
const xxtea = require('xxtea-node');

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

/**
 * 因构建时不能使用Editor.assetdb.remote
 * @param {*} url 
 */
function urlToFspath (url) {
    return path.join(Editor.Project.path, url.replace('db://', '/'));
};

const _uuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/;
/**
 * 转换URL为uuid
 * @param {*} url 
 */
function getUuidFromURL (url) {
    let matches = url.match(_uuidRegex);
    if (matches) {
        return matches[1];
    }
    return '';
};

// 判断是否为amf格式
function isAmf (content) {
    return utf8ArrayToStr(content, 0, JSON_PREFIX_LEN) === JSON_PREFIX;
};

// 读取amf文件
function parseAmf (content, encryptKey) {
    let compress = content[JSON_PREFIX_LEN] != 0;
    content = content.slice(JSON_PREFIX_LEN + 1);
    // 解密
    if (encryptKey) {
        content = xxtea.decrypt(content, encryptKey);
    }
    content = compress ? pako.inflate(content) : content;
    return amf.decodeObject(Buffer.from(content));
};

// 随机排序
function shuffle (arr, index = 0) {
    let i = arr.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr[index];
};

// 获取md5
function hash (data, algorithm = 'md5') {
    let hash = crypto.createHash(algorithm);
    hash.update(data);
    return hash.digest('hex');
};

// 获取缓存文件
function getCache (cacheDir, buffer) {
    let file = path.join(cacheDir, hash(buffer));
    if (fs.existsSync(file)) {
        try {
            let stat = fs.lstatSync(file);
            if (stat.isSymbolicLink()) {
                file = fs.readlinkSync(file);
            }
            return fs.readFileSync(file);
        } catch (err) {}
    }
    return null;
};

// 设置缓存文件
function setCache (cacheDir, srcBuffer, destBuffer, single = false) {
    let srcFile = path.join(cacheDir, hash(srcBuffer));
    fs.writeFileSync(srcFile, destBuffer);
    if (!single) {
        // 以目标内容hash为文件名写文件
        let destFile = path.join(cacheDir, hash(destBuffer));
        if (srcFile !== destFile) {
            // 使用拷贝的方式生成目标文件
            fs.copySync(srcFile, destFile);
        }
    }
};

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份  
        "d+": this.getDate(), //日  
        "h+": this.getHours(), //小时  
        "m+": this.getMinutes(), //分  
        "s+": this.getSeconds(), //秒  
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度  
        "S": this.getMilliseconds() //毫秒  
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

// 环境变量定义
const log = Editor.log;
const error = Editor.error;
const base_path = Editor.Project.path;
const temp_path = path.join(base_path, 'temp/builder');
const json_path = path.join(base_path, "packages/gdk-builder/static/gdk-builder-info.json");
const json_value_path = path.join(base_path, "settings/gdk-builder-value.json");

// 常量
const JSON_PREFIX = 'AMF3#';
const JSON_PREFIX_LEN = JSON_PREFIX.length;

// 打包器
let builder = {

    // 取得打包配置
    getInfo () {
        // 模板文件
        let template = JSON.parse(fs.readFileSync(json_path, 'utf8'));
        let jsonValue = null;
        if (fs.existsSync(json_value_path)) {
            // 读取保存的配置
            jsonValue = JSON.parse(fs.readFileSync(json_value_path, 'utf8'));
        }
        // 配置属性
        let value = {};
        for (let key in template) {
            value[key] = {};
            for (let prop in template[key]) {
                if (!jsonValue || !jsonValue[key] || jsonValue[key][prop] === void 0) {
                    // 默认值
                    value[key][prop] = template[key][prop].value;
                } else {
                    // 保存值
                    value[key][prop] = jsonValue[key][prop];
                }
            }
        }
        return [template, value];
    },

    // 写入外部配置
    saveInfo (v) {
        mkdirp(path.dirname(json_value_path), (err) => {
            err && error(err);
        });
        let json = JSON.stringify(v, null, 4);
        fs.writeFileSync(json_value_path, json);
    },

    /**
     * 读取构造选项
     */
    readOption (platform) {
        // 生成参数
        const setting = this.getInfo()[1];
        const opt = Object.assign({}, setting['general']);
        // 针对指定平台的参数
        switch (platform) {
            case 'ios':
            case 'android':
                // 原生平台
                opt.JSB = setting['jsb-link'];
                for (let p in opt.JSB) {
                    opt[p] = opt.JSB[p];
                }
                opt.JSB = true;
                break;

            case 'mini-game':
            case 'wechatgame':
                // 小游戏
                opt.WECHAT = setting['web-mobile'];
                for (let p in opt.WECHAT) {
                    opt[p] = opt.WECHAT[p];
                }
                opt.WECHAT = true;
                break;

            case 'web-mobile':
            default:
                // 默认H5平台
                opt.H5 = setting['web-mobile'];
                for (let p in opt.H5) {
                    opt[p] = opt.H5[p];
                }
                opt.H5 = true;
                break;
        }
        return opt;
    },

    /**
     * 更新目标平台版本号和编译时间文件
     * @param {*} opt 
     * @param {*} platform 
     */
    updatePlatforVer (build_path, opt, platform, readonly) {
        const ver_path = path.join(build_path, `../version.${platform}.json`);
        if (fs.existsSync(ver_path)) {
            // 读取保存的version.platform.json
            let data = JSON.parse(fs.readFileSync(ver_path, 'utf8'));
            for (let k in data) {
                opt[k] = data[k];
            }
        }
        if (!readonly) {
            // 保存version.platform.json
            opt.time = new Date().format("yyyy-MM-dd hh:mm:ss.S");
            log(`Save build options to ${ver_path}`);
            let verobj = {
                "version": opt.version,
                "time": opt.time,
            };
            fs.writeFileSync(ver_path, JSON.stringify(verobj, null, 4));
        }
        return opt;
    },

    /**
     * 开始优化操作接口
     * @param options
     * @param callback
     */
    before (options, callback) {
        log('Start before-change-files plugin', options);

        // 构建选项
        const build_platform = options.actualPlatform;
        const build_path = options.dest;
        const release = !options.debug;
        log('platform:', build_platform);
        log('dest:', build_path);
        if (!build_path) {
            error('no build resource.');
            return;
        }
        const opt = this.readOption(build_platform);
        // 更新目标平台版本文件
        this.updatePlatforVer(build_path, opt, build_platform);
        // 输出参数日志
        log("config:", JSON.stringify(opt, null, 4));

        // 创建临时文件夹
        mkdirp(temp_path, function (err) {
            if (err) error(err);
        });

        // 压缩json
        const all_json_size = opt.mergeJson * 1024;
        const all_json_obj = {};

        // 修改boot.js 或 main.js
        gulp.task('savesettings', function (cb) {
            log('Save build settings');
            // TDSetting
            let settings = {
                "version": opt.version,
                "time": opt.time,
                "env": release ? opt.env : 1,
                "logLevel": opt.logLevel,
                "debugPanel": opt.debugPanel,
            };
            // SDK-KEY
            if (opt['sdk-key']) {
                settings["sdk-key"] = crypto.createHash("md5").update(opt['sdk-key']).digest("hex");
            }
            // json加密密钥
            if (opt.encryptJson) {
                settings["json-key"] = opt.encryptJsonKey;
            }
            // HOST
            if (opt.serverRootDir) {
                settings["remoteServerAddress"] = opt.serverRootDir;
            }
            // 修改boot.js 或 main.js 文件
            let jspath = build_path + "/boot*.js";
            if (opt.JSB || opt.WECHAT) {
                jspath = build_path + "/main*.js";
            }
            gulp.src(jspath)
                .pipe(through.obj(function (file, enc, cb2) {
                    let code = utf8ArrayToStr(file.contents);
                    code = `window._TDSettings=${JSON.stringify(settings)};\n${code}`;
                    file.contents = Buffer.from(code);
                    log('version:', opt.version);
                    log('time:', opt.time);
                    cb2(null, file);
                }))
                .pipe(gulp.dest(build_path))
                .on("end", cb);
        });

        // 压缩json
        gulp.task('jsonmin', function (cb) {
            log('Start minifying json');
            // 创建缓存目录
            let json_cache_dir = path.join(build_path, '../tinypng/jsoncache');
            opt.cacheJson && fs.ensureDirSync(json_cache_dir);
            // 加密密钥
            let encryptKey = null;
            if (opt.encryptJson) {
                encryptKey = xxtea.toBytes(opt.encryptJsonKey);
            }
            // 处理JSON文件
            let jsonpaths = [
                build_path + '/assets/resources/import' + '/**/*.json',
                build_path + '/assets/internal/import' + '/**/*.json',
                build_path + '/assets/main/import' + '/**/*.json',
            ];
            if (opt.WECHAT) {
                jsonpaths = [
                    build_path + '/remote/resources/import' + '/**/*.json',
                ];
            }
            // 获取资源类型
            const getAssetType = function (uuid) {
                let type = null;
                options.bundles.some(bundle => {
                    const br = bundle.buildResults;
                    if (br && br.containsAsset(uuid)) {
                        type = br.getAssetType(uuid);
                        return true;
                    }
                    return false;
                });
                return type;
            };
            gulp.src(jsonpaths, {
                    base: "./"
                })
                .pipe(through.obj(function (file, enc, cb2) {
                    let contents = file.contents;
                    let size = -1;
                    let url = file.path.split('\\').join('/');
                    let uuid = getUuidFromURL(url);
                    let type = getAssetType(uuid);

                    // 合并零碎的json文件
                    if (!(type == 'cc.TiledMapAsset' || type == 'cc.TextAsset') &&
                        contents.length <= all_json_size
                    ) {
                        // 忽略tmx和txt文件, 压缩后尺寸小于指定大小的文件
                        if (isAmf(contents)) {
                            let obj = parseAmf(contents, encryptKey);
                            if (obj) {
                                all_json_obj[file.path] = JSON.stringify(obj);
                            }
                        } else {
                            all_json_obj[file.path] = contents.toString('utf8');
                        }
                    }

                    // 原生模式
                    if (opt.JSB) {
                        size = contents.length;
                    }

                    // 检查是否是已经优化过的文件
                    if (size < 0 && isAmf(contents)) {
                        size = contents.length;
                    }

                    // 检查缓存 
                    if (size < 0 && opt.cacheJson) {
                        let buf = getCache(json_cache_dir, contents);
                        if (buf && isAmf(buf)) {
                            // 有缓存，不需要重新压缩
                            file.contents = buf;
                            size = buf.length;
                        }
                    }

                    // 处理原始文件
                    if (size < 0) {
                        // 解析并压缩
                        let obj = JSON.parse(contents);
                        if (type == 'cc.TiledMapAsset' && opt.tmxReplaces) {
                            // 地图文件
                            let url = Editor.assetdb.uuidToUrl(uuid);
                            if (opt.tmxReplaces.some(u => url.indexOf(u) !== -1)) {
                                // 移除依赖资源
                                obj[1] = [];
                                obj[8] = [];
                                obj[9] = [];
                                obj[10] = [];
                            }
                        }
                        // 转换为二进制AMF格式
                        let ba = amf.encodeObject(obj);
                        let compress = opt.compressJson && ba.length > 4096;
                        ba = compress ? pako.deflate(ba) : ba;
                        // 加密二进制数据
                        if (encryptKey != null) {
                            ba = xxtea.encrypt(ba, encryptKey);
                        }
                        // 写入BUFF
                        let len = ba.length;
                        let buf = Buffer.alloc(len + 1);
                        buf[0] = compress ? 1 : 0;
                        for (let i = 0; i < len; ++i) {
                            buf[i + 1] = ba[i];
                        }
                        buf = Buffer.concat([Buffer.from(JSON_PREFIX), buf]);
                        // 更新文件
                        size = buf.length;
                        file.contents = buf;
                        // 设置缓存，只缓存小于1M并且大于10K的文件
                        if (opt.cacheJson && size > 10 * 1024 && size < 1024 * 1024) {
                            setCache(json_cache_dir, contents, buf, true);
                        }
                    }

                    // 完成
                    cb2(null, file);
                }))
                .pipe(gulp.dest("./"))
                .on("end", cb);
        });

        // 保存JSON
        gulp.task('savajson', function (cb) {
            log('Saving merged json');

            // 处理合并json数据
            let keys = Object.keys(all_json_obj);
            keys.forEach(key => {
                let url = key.split('\\').join('/');
                let uuid = getUuidFromURL(url);
                all_json_obj[uuid] = all_json_obj[key];
                delete all_json_obj[key];
                if (opt.delMergedJson) {
                    // 删除合并的json源文件
                    fs.unlinkSync(key);
                }
            });

            // 保存合并的JSON数据
            let ba = amf.encodeObject(all_json_obj);
            let buf = Buffer.from(pako.deflate(ba)).toString('base64');
            let ver = crypto.createHash("md5").update(buf).digest("hex").substr(0, 5);
            let json_path = '';
            if (opt.WECHAT) {
                json_path = `${build_path}/remote/all_json.${ver}.txt`;
            } else if (opt.JSB) {
                json_path = `${build_path}/assets/all_json.txt`;
            } else {
                json_path = `${build_path}/all_json.txt`;
            }
            fs.writeFileSync(json_path, buf);
            log('merged json files:', Object.keys(all_json_obj).length);

            // 添加合并的json文件数据至main.js
            gulp.src(build_path + "/main*.js")
                .pipe(through.obj(function (file, enc, cb2) {
                    let code = utf8ArrayToStr(file.contents);
                    code = `window._TDJsons='${ver}';\n${code}`;
                    file.contents = Buffer.from(code);
                    cb2(null, file);
                }))
                .pipe(gulp.dest(build_path))
                .on("end", cb);
        });

        // 压缩图片
        gulp.task('tinypng', function (cb) {
            log('Start compress images');
            let option = {
                // 存储处理后的文件，避免对一个文件重复处理，浪费 token 使用次数，同时也节省时间
                cacheDir: path.join(build_path, '../tinypng/cache'),
                // 存储 tokens 使用信息的文件
                recordFile: path.join(build_path, '../tinypng/record.json'),
                // tokens列表
                tokens: opt.tinyPngTokens,
                // 文件计数
                count: 0,
            };
            // 创建缓存目录
            fs.ensureDirSync(option.cacheDir);
            // 保存记录文件
            let record;
            if (!fs.existsSync(option.recordFile)) {
                record = {};
                fs.writeFileSync(option.recordFile, '{}');
            } else {
                record = JSON.parse(fs.readFileSync(option.recordFile));
            }

            // 压缩图片
            function tinypngProc (source, cb) {
                let token = shuffle(option.tokens, 0);
                log(`[${option.count}] use token: ${token} compress, original size: ${(source.length / 1024).toFixed(1)}K`);
                tinify.key = token;
                tinify.fromBuffer(source).toBuffer((err, buffer) => {
                    if (err) {
                        error(token, err);
                        setTimeout(tinypngProc, 10, source, cb);
                    } else {
                        log(`[${option.count}] use token: ${token} compress complete, size: ${(buffer.length / 1024).toFixed(1)}K, rate: ${((source.length-buffer.length)*100/source.length).toFixed(1)}%`);
                        // 记录token使用情况
                        if (record[token] != null) {
                            record[token]++;
                        } else {
                            record[token] = 1;
                        }
                        fs.writeFileSync(option.recordFile, JSON.stringify(record));
                        cb(buffer);
                    }
                });
            }

            // 文件处理
            let imgpaths = [
                build_path + "/assets/internal/native" + "/**/*.{png,jpg,jpeg}",
                build_path + "/assets/main/native" + "/**/*.{png,jpg,jpeg}",
                build_path + "/assets/resources/native" + "/**/*.{png,jpg,jpeg}",
            ];
            if (opt.WECHAT) {
                imgpaths = [
                    build_path + "/assets/internal/native" + "/**/*.{png,jpg,jpeg}",
                    build_path + "/assets/start-scene/native" + "/**/*.{png,jpg,jpeg}",
                    build_path + "/remote/resources/native" + "/**/*.{png,jpg,jpeg}",
                ];
            }
            const assetsPath = path.join((Editor.Project.path || Editor.projectPath), 'assets');
            gulp.src(imgpaths, {
                    base: "./"
                })
                .pipe(through.obj(function (file, enc, cb2) {
                    const url = file.path.split('\\').join('/');
                    const uuid = getUuidFromURL(url);
                    const resPath = Editor.assetdb.uuidToFspath(uuid);
                    if (resPath) {
                        let u = path.relative(assetsPath, resPath);
                        u = u.split('\\').join('/');
                        if (opt.ignoreImages && opt.ignoreImages.some(e => u.startsWith(e))) {
                            // 忽略的文件，路径
                        } else {
                            let buffer = fs.readFileSync(resPath);
                            if (buffer.length <= opt.ignoreImageSize * 1024) {
                                // 小图不提交压缩
                            } else {
                                let cached = getCache(option.cacheDir, buffer);
                                if (cached) {
                                    // 直接使用缓存过的压缩图片
                                    file.contents = cached;
                                } else if (release) {
                                    // 只有正式版本才执行
                                    option.count++;
                                    tinypngProc(file.contents, (data) => {
                                        setCache(option.cacheDir, buffer, data);
                                        file.contents = data;
                                        cb2(null, file);
                                    });
                                    return;
                                }
                            }
                        }
                    }
                    cb2(null, file);
                }))
                .pipe(gulp.dest("./"))
                .on('end', cb);
        });

        // 压缩纹理
        gulp.task('tinypkm', function (cb) {
            log('Start minifying pkm');
            // 处理PKM文件
            let pkmpaths = [
                build_path + '/assets/resources/native' + '/**/*.pkm',
                build_path + '/assets/internal/native' + '/**/*.pkm',
                build_path + '/assets/main/native' + '/**/*.pkm',
            ];
            gulp.src(pkmpaths, {
                    base: "./"
                })
                .pipe(through.obj(function (file, enc, cb2) {
                    // 压缩
                    file.contents = Buffer.from(pako.gzip(file.contents, {
                        gzip: true
                    }));
                    // 完成
                    cb2(null, file);
                }))
                .pipe(gulp.dest("./"))
                .on("end", cb);
        });

        // 清理临时文件
        gulp.task("clean", function (cb) {
            log('Start clean');
            // removeDir(temp_path);
            cb && cb();
        });

        // 根据不同的发布平台执行不同的优化任务
        let build_tasks = [];
        build_tasks.push('savesettings');

        opt.H5 && build_tasks.push('jsonmin');
        opt.H5 && all_json_size > 0 && build_tasks.push('savajson');

        opt.WECHAT && build_tasks.push('jsonmin');
        opt.WECHAT && all_json_size > 0 && build_tasks.push('savajson');

        opt.JSB && build_tasks.push('jsonmin');
        opt.JSB && all_json_size > 0 && build_tasks.push('savajson');
        opt.JSB && !options.buildScriptsOnly && build_tasks.push('tinypkm');

        opt.compressImage && build_tasks.push('tinypng');
        build_tasks.push('clean');
        gulp.series(build_tasks)(function (err) {
            if (err) {
                // an error occured
                error('Error:', err);
            } else {
                // success
                log('Finish before-change-files plugin');
            }
            callback && callback(err);
        });
    },

    /**
     * 完成打包操作接口
     * @param options
     * @param callback
     */
    finished (options, callback) {
        log('Start build-finished plugin');

        // 构建选项
        const build_platform = options.actualPlatform;
        const build_path = options.dest;
        const release = !options.debug;
        log('platform:', build_platform);
        log('dest:', build_path);
        if (!build_path) {
            error('no build resource.');
            return;
        }
        const opt = this.readOption(build_platform);
        // 更新目标平台版本文件
        this.updatePlatforVer(build_path, opt, build_platform, true);
        // 输出参数日志
        log("config:", JSON.stringify(opt, null, 4));

        // 代码混淆，project
        gulp.task("obfuscator_project", function (cb) {
            log('Start obfuscator project');
            let jsfiles = [];
            opt.obfuscatorfiles.forEach(e => jsfiles.push(build_path + '/' + e));
            if (jsfiles.length == 0) {
                cb && cb();
                return;
            }
            gulp.src(jsfiles, {
                    base: "./"
                })
                .pipe(through.obj(function (file, enc, cb2) {
                    log("obfuscator file:", path.parse(file.path).base);
                    cb2(null, file);
                }))
                .pipe(javascriptObfuscator({
                    compact: true,
                    // domainLock: [],
                    rotateStringArray: true,
                    selfDefending: false,
                    stringArray: true,
                    // debugProtection: true,
                    // disableConsoleOutput: true,
                    target: "browser",
                }))
                .pipe(gulp.dest("./"))
                .on("end", cb);
        });

        // 压缩jszip包
        gulp.task("jszip", function (cb) {
            log('Start zip js');
            let jsfiles = [];
            opt.jszipfiles.forEach(e => jsfiles.push(build_path + '/' + e));
            if (jsfiles.length == 0) {
                cb && cb();
                return;
            }
            let arr = [];
            gulp.src(jsfiles, {
                    base: "./"
                })
                .pipe(through.obj(function (file, enc, cb2) {
                    log("compress file:", path.parse(file.path).base);
                    let zip = new JSZip();
                    let folder = file.path.substr(build_path.length + 1);
                    zip.file(folder, file.contents);
                    zip.generateAsync({
                        type: "nodebuffer",
                        compression: "DEFLATE",
                        compressionOptions: {
                            level: 9
                        }
                    }).then(function (content) {
                        // let p = file.path.substr(0, file.path.lastIndexOf('.js'));
                        fs.writeFileSync(file.path + '.jsz', content);
                        cb2(null, file);
                    });
                    arr.push(file.path);
                }))
                .pipe(gulp.dest("."))
                .on("end", () => {
                    arr.forEach(x => {
                        log("remove source file:", x);
                        fs.unlinkSync(x);
                    });
                    cb && cb();
                });
        });

        // 减少loading页面出现之前的白屏时间
        gulp.task("htmlmin", function (cb) {
            log('Start minifying html');
            gulp.src(build_path + "/index.html")
                .pipe(fileInline())
                .pipe(htmlmin({
                    removeComments: true, // 清除 HTML 注释
                    collapseWhitespace: true, // 省略空白
                    collapseBooleanAttributes: true, // 省略所有标签内的布尔属性
                    removeEmptyAttributes: true, // 清除所有标签内值为空的属性
                    removeScriptTypeAttributes: true, // 清除 <script> 标签内的 type 属性
                    removeStyleLinkTypeAttributes: true, // 清除 <style> 和 <link> 标签内的 type 属性
                    minifyJS: true, // 压缩 html 页面内的 js 代码
                    minifyCSS: true // 压缩 html 页面内的 css 代码
                }))
                .on('error', function (err) {
                    error(err.message);
                })
                .pipe(gulp.dest(build_path))
                .on("end", cb);
        });

        // 构建策划配置文件
        gulp.task('build_config', function (cb) {
            log('Start build config');
            // 环境状态
            let tempPath = path.join(base_path, 'temp');
            let md5Cache = true;
            let distPath = '';
            if (opt.WECHAT) {
                md5Cache = true;
                distPath = `${build_path}/remote/`;
            } else if (opt.JSB) {
                md5Cache = false;
                distPath = `${build_path}/assets/`;
            } else {
                md5Cache = true;
                distPath = `${build_path}/`;
            }

            // 压缩配置文件
            function compressJson (jsonpath, obj, tarpath) {
                log('source:', jsonpath);
                let vercode = 4;
                let ver = '1.0.' + vercode;
                let buf = fs.readFileSync(jsonpath, 'utf-8');
                let md5 = crypto.createHash("md5").update(buf + ver).digest("hex").substr(0, 5);
                let ret = null;
                try {
                    ret = JSON.parse(buf);
                } catch (err) {
                    error('error:', err);
                    ret = {};
                }
                if (obj && typeof obj === 'object') {
                    for (let key in obj) {
                        if (key == 'datetime') {
                            continue;
                        }
                        delete ret[key];
                    }
                }
                try {
                    let out = {
                        ver: ver,
                        vercode: vercode,
                        datetime: new Date().format("yyyy-MM-dd hh:mm:ss")
                    };
                    for (let key in ret) {
                        let e = ret[key];
                        if (typeof e !== 'object') {
                            out[key] = e;
                            continue;
                        }
                        let k = e.k;
                        let a = e.a;
                        let md5 = crypto.createHash('md5').update(JSON.stringify(a) + ver).digest('hex');
                        let ff = path.join(tempPath, md5);
                        if (fs.existsSync(ff)) {
                            // 存在缓存文件
                            a = fs.readFileSync(ff, 'utf-8');
                        } else {
                            // 解析并保存至缓存文件
                            let t = {};
                            a.forEach(i => {
                                t[i[0]] = amf.encodeObject(i.slice(1));
                            });
                            let b = amf.encodeObject(t);
                            b = pako.deflate(b);
                            a = Buffer.from(b).toString('base64');
                            fs.writeFileSync(ff, a, 'utf-8');
                        }
                        out[key] = {
                            k: k,
                            a: a,
                        };
                    }
                    tarpath = md5Cache ? `${tarpath}.${md5}.txt` : `${tarpath}.txt`;
                    log('target:', tarpath);
                    fs.writeFileSync(tarpath, JSON.stringify(out), 'utf-8');
                } catch (err) {
                    log(err);
                };
                return {
                    d: ret,
                    v: md5
                };
            };

            // 保存配置
            let br = compressJson(path.join(tempPath, 'bdata.json'), null, path.join(distPath, 'bdata'));
            let dr = compressJson(path.join(tempPath, 'data.json'), br.d, path.join(distPath, 'data'));
            // 保存version.json
            if (!opt.JSB) {
                let verpath = '';
                if (opt.WECHAT) {
                    verpath = path.join(build_path, 'remote', 'version.json');
                } else {
                    verpath = path.join(build_path, 'version.json');
                }
                let verobj = {
                    "version": opt.version,
                    "time": opt.time,
                    'vers': {
                        'bdata': br.v,
                        'data': dr.v,
                    },
                };
                fs.writeFileSync(verpath, JSON.stringify(verobj, null, 4), 'utf-8');
            }

            // 完成回调
            cb && cb();
        });

        // 生成热更包
        gulp.task('hot_update_pack', function (cb) {
            log("[Build] starting generate manifest files ....");
            const resources = ["src", "assets"];
            let t = opt.serverRootDir;
            let n = build_path;
            let r = {
                version: opt.version,
                // packageUrl: t,
                // remoteManifestUrl: "",
                // remoteVersionUrl: "",
                pku: "",
                rmu: "",
                rvu: "",
                assets: {},
                searchPaths: [],
            };
            let packageName = `v${opt.version}`;
            let projectManifestName = `project.manifest`;
            let versionManifestName = `version.manifest`;
            if (t.endsWith("/")) {
                // r.remoteManifestUrl = t + projectManifestName;
                // r.remoteVersionUrl = t + versionManifestName;
                r.pku = t.substr(0, t.length - 1) + '/' + packageName + '/';
                r.rmu = t + projectManifestName;
                r.rvu = t + versionManifestName;
            } else {
                // r.remoteManifestUrl = t + '/' + projectManifestName;
                // r.remoteVersionUrl = t + '/' + versionManifestName;
                r.pku = t + '/' + packageName + '/';
                r.rmu = t + '/' + projectManifestName;
                r.rvu = t + '/' + versionManifestName;
            };
            let a = function (e, t) {
                let i = fs.statSync(e);
                if (!i.isDirectory()) return;
                let s, r, o, h, d = fs.readdirSync(e);
                for (let c = 0; c < d.length; ++c) {
                    if ("." !== d[c][0]) {
                        s = path.join(e, d[c]);
                        i = fs.statSync(s);
                        if (i.isDirectory()) {
                            a(s, t);
                        } else if (i.isFile()) {
                            r = i.size;
                            o = crypto.createHash("md5").update(fs.readFileSync(s, "binary")).digest("hex");
                            h = (h = path.relative(n, s)).replace(/\\/g, "/");
                            h = (h.startsWith('/')) ? h : ('/' + h);
                            t[h = encodeURI(h)] = {
                                size: r,
                                md5: o
                            };
                            if (".zip" === path.extname(s).toLowerCase()) {
                                t[h].compressed = true;
                            }
                        }
                    }
                }
            };
            resources.forEach(e => a(path.join(n, e), r.assets));
            // a(path.join(n, "src"), r.assets);
            // a(path.join(n, "assets"), r.assets);
            // 更新本地project.manifest，version.manifest
            let lp = urlToFspath(opt.localProjectManifestUrl);
            let lv = urlToFspath(opt.localVersionManifestUrl);
            if (lp && lv) {
                let uuid, url, temp, rr, rjson, md5;
                let base = 'assets/resources/import/';
                let ext = '.json';
                // 更新version
                uuid = JSON.parse(fs.readFileSync(lv + '.meta', 'utf-8')).uuid;
                url = base + uuid.substr(0, 2) + '/' + uuid + ext;
                temp = path.join(n, url);
                rr = Object.assign({}, r), delete rr.assets, delete rr.searchPaths;
                // [1,0,0,[["cc.TextAsset",["_name","text"],1]],[[0,0,1,3]],[[0,"project","H4sIAAAAAAAAA6uuBQBDv6ajAgAAAA=="]],0,0,[],[],[]]
                rjson = JSON.parse(fs.readFileSync(temp, 'utf-8'));
                rjson[5][0][2] = Buffer.from(pako.gzip(JSON.stringify(rr))).toString('base64');
                rjson = JSON.stringify(rjson);
                md5 = crypto.createHash("md5").update(rjson).digest("hex");
                if (!r.assets[url]) {
                    url = "/" + url;
                }
                r.assets[url].md5 = md5;
                // 写入build目录
                // fs.writeFileSync(lv, rjson);
                fs.writeFileSync(temp, rjson);
                log(`[Build] update local manifest files: ${temp}`);
                // 更新project
                uuid = JSON.parse(fs.readFileSync(lp + '.meta', 'utf-8')).uuid;
                url = base + uuid.substr(0, 2) + '/' + uuid + ext;
                temp = path.join(n, url);
                // [1,0,0,[["cc.TextAsset",["_name","text"],1]],[[0,0,1,3]],[[0,"version","H4sIAAAAAAAAA6uuBQBDv6ajAgAAAA=="]],0,0,[],[],[]]
                rjson = JSON.parse(fs.readFileSync(temp, 'utf-8'));
                rjson[5][0][2] = Buffer.from(pako.gzip(JSON.stringify(r))).toString('base64');
                md5 = crypto.createHash("md5").update(JSON.stringify(rjson)).digest("hex");
                if (!r.assets[url]) {
                    url = "/" + url;
                }
                r.assets[url].md5 = md5;
                rjson[5][0][2] = Buffer.from(pako.gzip(JSON.stringify(r))).toString('base64');
                // 写入build目录
                // fs.writeFileSync(lp, rjson);
                fs.writeFileSync(temp, JSON.stringify(rjson));
                log(`[Build] update local manifest files: ${temp}`);
            }
            // 写入热更目录project.manifest、version.manifest、config.txt
            try {
                let dist = path.join(build_path, "..", "apk/hot-update");
                fs.ensureDirSync(dist);
                fs.writeFileSync(path.join(dist, projectManifestName), JSON.stringify(r));
                log("[Build] generate project.manifest successfully");
                delete r.assets;
                delete r.searchPaths;
                fs.writeFileSync(path.join(dist, versionManifestName), JSON.stringify(r));
                log("[Build] generate version.manifest successfully");
                // 写入设置svn外部引用的配置文件
                let template = fs.readFileSync(path.join(dist, 'config.tpl'), 'utf-8');
                let content = template.split('{{packageName}}').join(packageName);
                fs.writeFileSync(path.join(dist, 'config.txt'), content);
                log("[Build] generate config.txt successfully");
            } catch (err) {
                // 错误
                error("[Build] copy hot-update files failure", err);
            }
            // // 打包热更版本zip文件
            // log("[Pack] 开始打包版本 ...");
            // let packageDir = (dir, obj) => {
            //     let i = fs.readdirSync(dir);
            //     for (let s = 0; s < i.length; s++) {
            //         let r = i[s];
            //         let o = path.join(dir, r);
            //         let n = fs.statSync(o);
            //         if (n.isFile()) {
            //             obj.file(r, fs.readFileSync(o));
            //         } else if (n.isDirectory()) {
            //             packageDir(o, obj.folder(r));
            //         }
            //     }
            // };
            // // 创建压缩文件
            // let zip = new JSZip();
            // zip.file("version.manifest", fs.readFileSync(l));
            // zip.file("project.manifest", fs.readFileSync(h));
            // packageDir(path.join(n, "src"), zip.folder("src"));
            // packageDir(path.join(n, "res"), zip.folder("res"));
            // // 保存至zip文件
            // let fn = "ver_" + (opt.version.replace(".", "_")) + ".zip";
            // let dn = path.join(temp_path, fn);
            // if (fs.existsSync(dn)) {
            //     fs.unlinkSync(dn);
            //     log("[Pack] 发现该版本的zip, 已经删除!");
            // }
            // zip.generateNodeStream({
            //         type: "nodebuffer",
            //         streamFiles: true,
            //     })
            //     .pipe(fs.createWriteStream(dn))
            //     .on("finish", () => {
            //         log("[Pack] 打包成功: " + dn);
            //         cb && cb();
            //     })
            //     .on("error", (err) => {
            //         log("[Pack] 打包失败:" + err.message);
            //         callback && callback(err);
            //     });
            // // 拷贝到热更目录
            // let dist = path.join(build_path, "..", "apk/hot-update");
            // log("[Build] starting copy hot-update files to:" + dist);
            // try {
            //     fs.ensureDirSync(dist);
            //     // fs.emptyDirSync(dist);
            //     fs.copyFileSync(l, path.join(dist, projectManifestName));
            //     fs.copyFileSync(h, path.join(dist, versionManifestName));
            //     // resources.forEach(e => fs.copySync(path.join(n, e), path.join(dist, e)));
            //     // fs.copySync(path.join(n, "src"), path.join(dist, "src"));
            //     // fs.copySync(path.join(n, "res"), path.join(dist, "res"));
            //     log("[Build] copy hot-update files complete");
            // } catch (err) {
            //     // 错误
            //     error("[Build] copy hot-update files failure", err);
            // }
            // 完成
            cb && cb();
        });

        // 清理临时文件
        gulp.task("clean", function (cb) {
            log('Start clean');
            // removeDir(temp_path);
            cb && cb();
        });

        // 根据不同的发布平台执行不同的优化任务
        let build_tasks = [];
        opt.H5 && release && build_tasks.push('obfuscator_project');
        opt.H5 && build_tasks.push('jszip');
        opt.H5 && release && build_tasks.push('htmlmin');
        build_tasks.push('build_config');
        opt.JSB && opt.localProjectManifestUrl && build_tasks.push('hot_update_pack');
        build_tasks.push('clean');
        gulp.series(build_tasks)(function (err) {
            if (err) {
                // an error occured
                error('Error:', err);
            } else {
                // success
                log('Finish build-finished plugin');
            }
            callback && callback(err);
        });
    },
}

module.exports = builder;