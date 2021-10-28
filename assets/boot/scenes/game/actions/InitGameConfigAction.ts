import BErrorManager from '../../../common/managers/BErrorManager';
import BGameUtils from '../../../common/utils/BGameUtils';
import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BLoginUtils from '../../../common/utils/BLoginUtils';
import BMathUtil from '../../../common/utils/BMathUtil';
import BModelManager from '../../../common/managers/BModelManager';
import BNetManager from '../../../common/managers/BNetManager';
import BootFsmEventId from '../../boot/enum/BootFsmEventId';
import BSdkTool from '../../../sdk/BSdkTool';
import BServerModel from '../../../common/models/BServerModel';
import HotUpdateUtil from '../../boot/ctrl/hotupdate/utils/HotUpdateUtil';

/**
 * 初始化策划配置
 * @Author: sthoo.huang
 * @Date: 2019-03-28 19:48:28
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-05 17:00:25
 */
@gdk.fsm.action("InitGameConfigAction", "Game")
export default class InitGameConfigAction extends gdk.fsm.FsmStateAction {

    progress: number;
    step: number;
    time: number;
    max: number;

    onEnter() {
        this.progress = 0;
        this.step = 0.015;
        this.time = 0;
        this.max = 99;
        this.setProgress(this.progress);
        gdk.Timer.callLater(this, this.loadBundle);
    }

    onExit() {
        BErrorManager.targetOff(this);
        BNetManager.offcb(this.onResultHandle, this);
        BLoginUtils.reqLoginRoleOnExit(this);
    }

    update(dt: number) {
        if (this.progress >= this.max) {
            return;
        }
        this.progress += this.step;
        this.progress = Math.min(this.max, this.progress);
        this.time += dt;
        if (this.time > 10) {
            this.time = 0;
            this.step *= 0.9;
        }
        this.setProgress(this.progress);
    }

    /**
     * 设置进度
     * @param v 
     * @returns 
     */
    setProgress(v: number) {
        if (!this.active) return;
        if (!gdk.gui.getCurrentLoading()) return;
        // 只有存在加载界面时，才更新进度
        gdk.gui.showLoading(gdk.i18n.t('i18n:LOADING_TIP'), v, 100);
    }

    // 加载脚本模块
    loadBundle() {
        if (!this.active) return;
        if (!CC_BUILD) {
            this.initGameConfig();
            return;
        }
        cc.assetManager.loadBundle('scripts', (err: any) => {
            if (err) {
                cc.error('加载脚本异常', err.message, err.stack);
                this.sendEvent(BootFsmEventId.CONN_BREAK);
                return;
            }
            gdk.Timer.callLater(this, this.initGameConfig);
        });
    }

    // 预初始化
    initGameConfig() {
        if (!this.active) return;
        // 初始化游戏配置和数据处理控制器
        BGameUtils.initGameConfig(this, () => {
            if (!this.active) return;
            try {
                BGameUtils.initGameController(this, true);
                BGameUtils.initGameModel(this);
            } catch (err) {
                cc.log("初始化异常: ", err);
                // 原生模式版本异常，清除本地缓存，重新启动游戏
                if (cc.sys.isNative && CC_BUILD && !CC_DEBUG) {
                    cc.log("清除缓存: ", HotUpdateUtil.storagePath);
                    jsb.fileUtils.removeDirectory(HotUpdateUtil.storagePath);
                    // 重启游戏
                    BSdkTool.loaded && BSdkTool.tool.logout();
                    gdk.DelayCall.addCall(() => {
                        gdk.pool.clearAll();
                        gdk.rm.releaseAll();
                        cc.game.restart();
                    }, null, 0.2);
                }
                return;
            }
            // 检查版本，然后连接服务器
            BGlobalUtil.checkClientVer(() => {
                if (!this.active) return;
                gdk.Timer.callLater(this, this.connectServer);
            });
        });
    }

    // 连接服务器
    connectServer() {
        if (!this.active) return;
        let model = BModelManager.get(BServerModel);
        model.gateway.sort((a, b) => a.val - b.val);
        model.current.addr = model.gateway[0].addr + '/serve';
        BSdkTool.tool.connectServerBefore();
        BErrorManager.on([101, 102, 103, 104, 106], this.onRejectHandle, this);
        BNetManager.connect(model.current.addr, this.onResultHandle, this, 10);
    }

    // 连接错误处理
    onRejectHandle() {
        CC_DEBUG && cc.log('不允许登录此服务器，连接失败');
        this.sendEvent(BootFsmEventId.CONN_BREAK);
    }

    // 连接结果处理
    onResultHandle(err: any) {
        if (!this.active) return;
        if (err) {
            let model = BModelManager.get(BServerModel);
            model.gateway[0].val = 99999;
            if (model.gateway.some(g => g.val < 99999)) {
                // 存在没有重试的网关，则重试连接
                gdk.Timer.callLater(this, this.connectServer);
                return;
            }
            model.gateway.some(g => g.val = BMathUtil.rnd(1, 999));
            gdk.gui.showMessage(gdk.i18n.t("i18n:CONNECT_SERVER_FAIL"));
            this.sendEvent(BootFsmEventId.CONN_BREAK);
            return;
        }
        BSdkTool.tool.connectServer();
        // 发送角色登录请求
        BLoginUtils.reqLoginRole(this);
    }
}