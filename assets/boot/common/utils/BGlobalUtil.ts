import BSdkTool from '../../sdk/BSdkTool';
import ButtonSoundId from '../../configs/ids/BButtonSoundId';
import HotUpdateUtil from '../../scenes/boot/ctrl/hotupdate/utils/HotUpdateUtil';

/**
 * @Author: weiliang.huang
 * @Description:
 * @Date: 2019-03-25 14:41:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-02 15:35:13
 */

class GlobalUtilClass {

    // /**更新主界面选项卡状态
    //  * @param 选择项
    //  * @param 状态
    //  */
    // updateMainSelect(select: MainSelectType, state: number = 0) {
    //     let model = ModelManager.get(MainSceneModel)
    //     if (state > 0) {
    //         model.mainSelectIdx = select
    //     } else {
    //         if (model.mainSelectIdx == select) {
    //             model.mainSelectIdx = -1
    //         }
    //     }
    // }

    /**把数字按一定格式转换为字符串 
     * number 数量
     * isChange 是否转换 大于万显示K，千万显示M，十亿显示B
     * useFont 使用艺术字，显示要转换( K = : ) (M = ;) (B = <)
    */
    numberToStr(number: number, isChange: boolean = false, useFont = false) {
        // let text = number + ""
        // if (number > 10 * 10000 * 10000) {
        //     text = `${Math.floor(number / (10000 * 10000))}亿`
        // } else if (number >= 100000) {
        //     text = `${Math.floor(number / 10000)}万`
        // }

        let text = number + ""
        if (isChange) {
            if (number > 10 * 10000 * 10000) {
                text = `${Math.floor(number / (10 * 10000 * 10000))}` + (useFont ? "<" : "B")
            } else if (number >= 10000000) {
                text = `${Math.floor(number / 1000000)}` + (useFont ? ";" : "M")
            } else if (number >= 10000) {
                text = `${Math.floor(number / 1000)}` + (useFont ? ":" : "K")
            }
        } else {
            text = `${number}`
        }

        return text
    }

    /**设置精灵icon */
    setSpriteIcon(
        resNode: cc.Node,
        node: cc.Node | cc.Sprite,
        icon: string,
        callback: () => void = null,
        thisArg: any = null,
    ) {
        // 获取sprite组件
        let sprite: cc.Sprite = null;
        if (node instanceof cc.Node) {
            sprite = node.getComponent(cc.Sprite);
        } else {
            sprite = node;
        }
        if (sprite) {
            let flag = '$curr_icon_path$';
            if (icon) {
                let resId = gdk.Tool.getResIdByNode(resNode);
                // 资源相同，则不重复加载
                let res = sprite.spriteFrame;
                if (res && res === gdk.rm.getResByUrl(icon, cc.SpriteFrame)) {
                    // 标记资源为resId所依赖的资源
                    gdk.rm.loadRes(resId, icon, cc.SpriteFrame);
                    callback && callback.call(thisArg);
                    return;
                }
                sprite.spriteFrame = null;
                sprite[flag] = icon;
                gdk.rm.loadRes(resId, icon, cc.SpriteFrame, (sp: cc.SpriteFrame) => {
                    if (sprite[flag] != icon) return;
                    delete sprite[flag];
                    if (!cc.isValid(resNode)) return;
                    if (!cc.isValid(sprite.node)) return;
                    sprite.spriteFrame = sp;
                    callback && callback.call(thisArg);
                });
            } else {
                if (!!sprite.spriteFrame) {
                    sprite.spriteFrame = null;
                }
                delete sprite[flag];
            }
        }
    }

    /**
     * 保存本地变量
     * @param name
     * @param val
     * @param isSelf 是否每个用户单独保存
     */
    setLocal(name: string, val: any, isSelf: boolean = true) {
        let l = cc.sys.localStorage;
        if (typeof val === 'object') {
            val = JSON.stringify(val);
        }
        l.setItem(name, val);
    }

    /**
     * 读取本地保存的变量
     * @param name
     * @param isSelf 是否每个用户独立
     * @param def 默认值
     */
    getLocal(name: string, isSelf: boolean = true, def?: any) {
        let l = cc.sys.localStorage;
        let r: any;
        let v = l.getItem(name);
        try {
            v = JSON.parse(v);
        } catch (err) { };
        r = v;
        return (r === void 0 || r === null) ? def : r;
    }

    // 在url后面添加参数
    urlAppendTimestamp(url: string, param?: string) {
        if (!param) {
            param = Date.now() + '';
        }
        if (/\?/.test(url)) {
            url += '&_t=' + param;
        } else {
            url += '?_t=' + param;
        }
        return url;
    }

    // 通过get方式获取文件内容
    httpGet(url: string, cb: Function, params?: any, timeStamp: 'none' | 'time' | 'ver' = 'time') {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let err: any, content: string;
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
                content = xhr.responseText;
            } else {
                err = xhr;
            }
            cb && cb(err, content);
        };
        if (typeof cb === 'function') {
            xhr.onerror = function () {
                cb(xhr);
            };
            xhr.ontimeout = function () {
                cb(xhr);
            };
        }
        if (!url.startsWith('http')) {
            let remote = cc.assetManager.downloader['remoteServerAddress'];
            if (cc.sys.isNative && !remote) {
                remote = window['_TDSettings']['remoteServerAddress'] || '';
            }
            url = this.getUrlRoot(remote) + (url.startsWith('/') ? url : '/' + url);
        }
        if (timeStamp != 'none') {
            let param = null;
            if (timeStamp == 'ver') {
                const s = window['_TDSettings'];
                param = s ? s.version : '';
            }
            url = this.urlAppendTimestamp(url, param);
        }
        xhr.open("GET", url, true);
        xhr.timeout = 5000;
        xhr.send(params);
    }

    // 获取绝对链接
    getUrlRoot(url?: string) {
        (url === void 0 || url == '') && (url = document.location.toString());
        return url.replace(/^(.*\/\/[^\/?#]*).*$/, "$1");
    }

    // 获得URL相对路径
    getUrlRelativePath(url?: string) {
        (url === void 0 || url == '') && (url = document.location.toString());
        let arrUrl = url.split("//");
        let start = arrUrl[1].indexOf("/");
        let relUrl = arrUrl[1].substring(start);
        if (relUrl.indexOf("?") != -1) {
            relUrl = relUrl.split("?")[0];
        }
        return relUrl;
    }

    /**
     * 检测客户端版本，当前为最新版本时则回调
     * @param cb 
     * @param thisArg 
     * @returns 
     */
    checkClientVer(cb?: Function, thisArg?: any) {
        cc.log('检测客户端版本');
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // 微信小游戏不检查版本
            cb && cb.call(thisArg);
            return;
        }
        else if (cc.sys.isNative && CC_BUILD && !CC_DEBUG) {
            // 原生模式版本检测
            if (iclib.hotupdateEnabled) {
                HotUpdateUtil.checkUpdate(cb, thisArg);
            }
            else {
                cb && cb.call(thisArg);
            }
            return;
        }
        else if (cc.sys.isBrowser && CC_BUILD && !CC_DEBUG) {
            // 构建发行版本才检查版本
            let setting = iclib.verjson || window['_TDSettings'];
            if (setting && BSdkTool.loaded && !BSdkTool.tool.updating && !this['_$N_checking_ver__']) {
                // 检查版本
                this['_$N_checking_ver__'] = true;
                this.httpGet(this.getUrlRelativePath() + 'version.json', (err: any, content: string) => {
                    delete this['_$N_checking_ver__'];
                    if (err) {
                        cc.error(err);
                        gdk.Timer.once(1000, this, this.checkClientVer, [cb, thisArg]);
                        return;
                    }
                    // 比对版本或编译时间是否一致
                    let opt = JSON.parse(content);
                    if (opt.version !== setting.version ||
                        opt.time !== setting.time) {
                        // 版本或编译时间对不上，则刷新当前游戏
                        BSdkTool.tool.updateVer();
                    }
                });
            }
        }
        // 回调
        cb && cb.call(thisArg);
    }

    // 获取指定名称的外部参数对应的值
    getUrlValue(prop: string, url?: string) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            return null;
        }
        let reg: RegExp = new RegExp("(^|&)" + prop + "=([^&]*)(&|$)", "i");
        let r = (url || window.location.search.substr(1)).match(reg);
        if (r != null) {
            return (decodeURIComponent(r[2]));
        }
        return null;
    }

    // 设置游戏帧频
    setFrameRate(v: number) {
        let frameRate = 0;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // 微信小游戏适配，保持当前帧频不变
            frameRate = cc.game.getFrameRate();
        } else {
            frameRate = parseInt(this.getUrlValue('frameRate'));
            if (isNaN(frameRate) || frameRate < 30 || frameRate > 60) {
                frameRate = v;
            }
        }
        cc.game.setFrameRate(frameRate);
        // 非省电模式，非低性能模式，并且为app模式时，则加载限制数增加
        if (frameRate > 30 && this.getUrlValue('app') == 'true') {
            const downloader = cc.assetManager.downloader;
            downloader.maxConcurrency = 10;
            downloader.maxRequestsPerFrame = 6;
        }
    }

    /**提示瓢字 并播放声音 */
    showMessageAndSound(tips: string, targetNode?: cc.Node, soundId: ButtonSoundId = ButtonSoundId.invalid) {
        gdk.gui.showMessage(tips);
        let currNode = targetNode ? targetNode : gdk.gui.getCurrentView();
        gdk.sound.play(gdk.Tool.getResIdByNode(currNode), soundId);
    }
}

// 导出默认类
const BGlobalUtil = gdk.Tool.getSingleton(GlobalUtilClass);
iclib.addProp('GlobalUtilClass', GlobalUtilClass);
iclib.addProp('GlobalUtil', BGlobalUtil);
export default BGlobalUtil;
