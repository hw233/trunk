import * as config from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';

/**
 * 预加载进入游戏主场景资源动作实现
 * @Author: sthoo.huang
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-08 11:18:58
 * @Last Modified time: 2021-07-23 18:40:48
 */
export default class PreloadGameResourceImplement {

    fsm: gdk.fsm.FsmStateAction;

    // 预加载游戏资源
    preload() {

        // 界面资源
        gdk.panel.preload(PanelId.MiniChat);
        gdk.panel.preload(PanelId.GuideView);
        if (!GlobalUtil.getLocal('login_last_time', false)) {
            // 首次打开游戏，新玩家
            gdk.panel.preload(PanelId.PveScene);
            gdk.panel.preload(PanelId.PveSceneFightingPanel);
        } else {
            // 非首次打开游戏，老玩家
            gdk.panel.preload(PanelId.PveReady);
            gdk.panel.preload(PanelId.MainPanel);
            gdk.panel.preload(PanelId.MainDock);
            gdk.panel.preload(PanelId.MainTopInfoView);
            gdk.panel.preload(PanelId.GrowTaskBtnView);
        }

        // 游戏配置
        if (ConfigManager.initlized > 1) {
            // 已经初始化完成
            return;
        }
        if (cc.sys.isNative) {
            // 原生模式
            return;
        }
        if (CC_DEBUG && GlobalUtil.getUrlValue('config')) {
            // 使用外部配置
            return;
        }
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
            remote = GlobalUtil.getUrlRelativePath();
        }
        let url = remote + `data.${iclib.verjson.vers.data}.txt`;
        GlobalUtil.httpGet(url, (err: any, content: string) => {
            if (!err && content && ConfigManager.initlized == 1) {
                ConfigManager.init(config, JSON.parse(content));
            }
        }, null, 'none');
    }
}