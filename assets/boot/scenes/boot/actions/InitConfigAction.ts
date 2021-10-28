import * as config from '../../../configs/bconfig';
import BConfigManager from '../../../common/managers/BConfigManager';
import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BMaskWordUtils from '../../../common/utils/BMaskWordUtils';

/**
 * 初始化策划配置
 * @Author: sthoo.huang
 * @Date: 2019-03-28 19:48:28
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-03 14:00:24
 */

@gdk.fsm.action("InitConfigAction", "Boot")
export default class InitConfigAction extends gdk.fsm.FsmStateAction {

    onEnter() {
        this.load();
    }

    onExit() {
        gdk.Timer.clearAll(this);
    }

    load() {
        if (!this.active) return;
        if (BConfigManager.initlized > 0) {
            // 是否已经初始化完成
            CC_DEBUG && cc.log("配置已经初始化过，不需要重复初始化");
            this._finish();
        } else if (cc.sys.isNative) {
            // 原生模式
            let jurl = `assets/bdata.txt`;
            let text = jsb.fileUtils.getStringFromFile(jurl);
            if (text) {
                this._finish(JSON.parse(text));
            }
        } else if (CC_DEBUG && BGlobalUtil.getUrlValue('config')) {
            // 从本地服务器地址下载配置文件
            this.loadConfig('http://localhost:17001/data.json');
        } else {
            // 其它版本
            let remote = '';
            if (CC_DEV && !CC_BUILD) {
                // 本地开发版，使用8001上的配置
                remote = 'http://192.168.3.182:8001/web-mobile/';
            }
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                // 微信小游戏
                remote = `${cc.assetManager.downloader['_remoteServerAddress']}`;
                remote = `${remote}remote/`;
            }
            if (remote == '') {
                remote = BGlobalUtil.getUrlRelativePath();
            }
            let loadVersionImpl = () => {
                if (!this.active) return;
                BGlobalUtil.httpGet(remote + 'version.json', (err: any, content: string) => {
                    if (!this.active) return;
                    if (!err && content) {
                        // 加载成功，并且文件内容不为空
                        try {
                            iclib.addProp('verjson', JSON.parse(content));
                            this.loadConfig(remote + `bdata.${iclib.verjson.vers.bdata}.txt`);
                            return;
                        } catch (err1) {
                            cc.error("解析错误：", err1);
                        }
                    }
                    // 加载错误，1秒后重试
                    err && cc.error("加载错误：", err);
                    gdk.Timer.callLater(this, loadVersionImpl);
                });
            };
            loadVersionImpl();
        }
    }

    // 从指定的地址下载配置文件
    loadConfig(url: string) {
        if (!this.active) return;
        let timeStamp: 'none' | 'time' = 'none';
        let loadConfigImpl = () => {
            if (!this.active) return;
            BGlobalUtil.httpGet(url, (err: any, content: string) => {
                if (!this.active) return;
                if (!err && content) {
                    // 加载成功，并且文件内容不为空
                    try {
                        this._finish(JSON.parse(content));
                        return;
                    } catch (err1) {
                        cc.error("解析错误：", err1);
                    }
                }
                // 加载错误，1秒后重试
                err && cc.error("加载错误：", err);
                timeStamp = 'time';
                gdk.Timer.callLater(this, loadConfigImpl);
            }, null, timeStamp);
        };
        loadConfigImpl();
    }

    // 完成配置加载
    _finish(json?: any) {
        if (!this.active) return;
        if (json) {
            BConfigManager.init(config, json);
            let a = [];
            let k = BConfigManager['_getArray'](config.Mask_wordCfg);
            for (let id in k) {
                a.push(id);
            }
            cc.js.clear(k);
            BMaskWordUtils.append(a);
        }
        this.finish();
    }
}