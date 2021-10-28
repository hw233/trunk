import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BMobPushUtil from '../../../common/utils/BMobPushUtil';
/**
 * 游戏杂项初始化放在这里
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-09 10:45:17
 */

@gdk.fsm.action("InitGameAction", "Boot")
export default class InitGameAction extends gdk.fsm.FsmStateAction {
    onEnter() {
        // 日志打印
        if (gdk.buildInfo.logLevel == gdk.LogLevel.LOG) {
            gdk.Log.logLevel = gdk.LogLevel.LOG | gdk.LogLevel.WARN | gdk.LogLevel.ERROR;
        } else {
            gdk.Log.logLevel = gdk.LogLevel.ERROR;
        }

        // 微信小游戏适配
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            const wx = window['wx'];
            cc.sys.localStorage = {
                getItem: (key: string) => {
                    try {
                        let val = wx.getStorageSync(key);
                        if (val) {
                            return val;
                        }
                    } catch (e) { }
                },
                setItem: (key: string, val: string) => {
                    try {
                        wx.setStorageSync(key, val);
                    } catch (e) { }
                },
                removeItem: () => {
                    try {
                        wx.removeStorageSync();
                    } catch (e) { }
                },
                clear: () => {
                    try {
                        wx.clearStorageSync();
                    } catch (e) { }
                },
            };
            // 设置屏幕常亮
            let opt = { keepScreenOn: true };
            cc.game.on(cc.game.EVENT_SHOW, () => wx.setKeepScreenOn(opt));
            wx.setKeepScreenOn(opt);
            // // 预加载资源
            // gdk.rm.loadRes(gdk.Tool.getResIdByNode(this.node), "common/data/data", cc.JsonAsset);
            // gdk.panel.preload(PanelId.LoginView);
            cc.assetManager.cacheManager.autoClear = true;
            gdk.macro.RESOURCE_RELEASE_TIMEOUT = 3 * 60 * 1000;
            gdk.macro.RESOURCE_RELEASE_INTERVAL = 10000;
        } else {
            // 开启多线程加载
            gdk.macro.ENABLE_ARRAYBUFFER_WORKER = true;
            gdk.macro.ENABLE_PNG_WORKER = true;
            gdk.macro.RESOURCE_RELEASE_TIMEOUT = 3 * 60 * 1000;
            gdk.macro.RESOURCE_RELEASE_INTERVAL = 1000 / 30;
        }
        gdk.macro.RESOURCE_RELEASE_MAX = 30;
        gdk.macro.ENABLE_MULTI_TOUCH = false;
        gdk.fontFamily = "SimHei";
        gdk.sound.prefix = "sound/";
        gdk.music.prefix = "music/";
        gdk.rm.addUnreleaseRes('assets/resources/common/texture');
        gdk.rm.addUnreleaseRes('assets/resources/gdk');
        gdk.i18n.init("zh_CN");
        gdk.gui.messageMax = 3;
        gdk.panel.loadTimeout = 120;
        gdk.panel.loadWaitingDelay = 2;
        gdk.panel.isShowWaiting = true;
        gdk.panel.loadErrorMessage = gdk.i18n.t('i18n:LOAD_ERROR_MESSAGE');
        gdk.panel.loadingString = gdk.i18n.t('i18n:LOADING_STRING');

        BGlobalUtil.setFrameRate(60);
        // cc.view.enableRetina(true);
        // cc.view.adjustViewportMeta(true);
        // cc.view.enableAutoFullScreen(true);
        // cc.view.resizeWithBrowserSize(true);
        // cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        // cc.Camera.cameras.forEach(c => c.clearFlags = 7);
        // cc.macro.CLEANUP_IMAGE_CACHE = false;
        // cc.dynamicAtlasManager.enabled = true;
        cc.macro.ENABLE_MULTI_TOUCH = false;
        CC_DEBUG && cc.debug.setDisplayStats(false);

        // 碰撞参数
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        if (BGlobalUtil.getUrlValue('debugDraw') == 'true') {
            manager.enabledDebugDraw = true;
            manager.enabledDrawBoundingBox = true;
        }
        if (BGlobalUtil.getUrlValue('app') == 'true') {
            cc.view.resizeWithBrowserSize(false);
        }

        // 初始化推送通知
        BMobPushUtil.initMobPushJS();

        // 检查客户端版本
        if (cc.sys.isNative && CC_BUILD && !CC_DEBUG) {
            cc.log = function () {
                if (!iclib) return;
                if (!iclib.SdkTool) return;
                if (!iclib.SdkTool.tool) return;
                if (!iclib.SdkTool.tool['callToSystem']) return;
                try {
                    iclib.SdkTool.tool['callToSystem']('log', [].join.call(arguments, ','));
                } catch (err) { };
            };
            BGlobalUtil.checkClientVer(this.finish, this);
            return;
        }

        // 完成动作
        this.finish();
    }
}