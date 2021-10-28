import BConfigManager from '../common/managers/BConfigManager';
import BGlobalUtil from '../common/utils/BGlobalUtil';
import BLoginUtils from '../common/utils/BLoginUtils';
import BMaskWordUtils from '../common/utils/BMaskWordUtils';
import BMathUtil from '../common/utils/BMathUtil';
import BModelManager from '../common/managers/BModelManager';
import BootFsmEventId from '../scenes/boot/enum/BootFsmEventId';
import BPanelId from '../configs/ids/BPanelId';
import BServerModel from '../common/models/BServerModel';
import { ChannelCfg } from '../configs/bconfig';

/** 
 * 本地测试无SDK
 * @Author: sthoo.huang  
 * @Date: 2020-01-11 18:46:57 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-14 10:20:55
 */

export default class BaseSdk implements iclib.ISdkTool {

    updating: boolean = false;
    loaded: boolean = false;
    userData: any = null;
    config: ChannelCfg;
    channelId: number;
    player_list: string = 'player_list';
    server_list: string = 'server_list';
    can_charge: boolean = true;
    URL: string;
    ios_source: string = 'syzn';
    ios_ver: number = 4;

    private _roleModel: any;
    get roleModel() { return this._roleModel };
    get serverModel() { return BModelManager.get(BServerModel) };

    showAccountInput = false;                   // 帐号框
    isAutoLogin = false;                        // 自动进入游戏
    isNeedUpdateBadWords = false;               // 更新过滤词
    showKfIcon = false;                         // 客服图标
    showH5Icon = false;                         // 卡顿点我图标
    showChangeAccountIcon = false;              // 切换帐号图标
    showStartBtn = false;                       // 开始游戏按钮
    showBbsIcon = false;                        // 论坛图标
    showServiceCheckBox = true;                 // 用户和隐私协议
    isServiceChecked = false;                   // 用户和隐私协议默认勾选状态
    showServerGroup = false;                    // 服务器分组
    agreementUrl = '/uc/agreement.txt';         // 用户协议
    privacyUrl = '/uc/privacy.txt';             // 隐私协议

    get account(): string {
        let l = cc.sys.localStorage;
        let a = BGlobalUtil.getUrlValue('userid');
        if (!a) {
            // 没指定userId时，则使用保存的userId，
            a = l.getItem("login_userid");
            if (!a) {
                // 如果还没有则生成新的帐号名
                let n = BMathUtil.rnd(3, 12);
                a = 'test';
                for (let i = 0; i < n; i++) {
                    a += BMathUtil.rnd(0, 9);
                }
                a += '_' + Date.now();
            }
        }
        l.setItem("login_userid", a);
        return a;
    }

    get channelCode(): string {
        let code = '';
        if (this.config &&
            this.config.channel_code instanceof Array &&
            this.config.channel_code.length > 0) {
            // 根据配置拼接请求参数
            for (let i = 0; i < this.config.channel_code.length; i++) {
                let n = this.config.channel_code[i];
                let v = this.userData[n];
                if (v) {
                    code += `${code.length > 0 ? '&' : ''}${n}=${v}`;
                }
            }
        } else {
            return BGlobalUtil.getUrlValue('token') || '';
        }
        return code;
    }

    // 调用原生包方法
    callToSystem(type: any, args: any = null) {
        try {
            if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
                // 原生，只对IOS有效
                jsb.reflection.callStaticMethod(
                    'RootViewController',
                    'receiveFromClient:',
                    JSON.stringify({ 'cmd': type, 'args': args || '' }),
                );
            } else if (cc.sys.isBrowser && cc.sys.OS_ANDROID === cc.sys.os && BGlobalUtil.getUrlValue('app') == 'true') {
                // 微端，只对安卓有效
                let params: any = "";
                if (args) {
                    params = [];
                    for (const key in args) {
                        if (args.hasOwnProperty(key)) {
                            let value = args[key];
                            value = encodeURIComponent(value);
                            params.push(`${key}=${value}`);
                        }
                    }
                    params = params.join("&");
                }
                let url = `http://qszc/${type}?${params}`;
                let androidFunc = window['AndroidFunction'];
                if (androidFunc && androidFunc.receiveFromWebView) {
                    androidFunc.receiveFromWebView(url);
                    return;
                }
                let xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", url, true);
                xmlhttp.send(null);
            }
        } catch (error) {
            cc.log("js:callToSystem error:", error);
        }
    }

    // 被原生包调用的方法
    callBySystem(type: any, params: any) {
        if (type == 'heartbeat') {
            this.heartbeatSDK();
            // 如果游戏被暂停则广播恢复事件
            if (document && cc.game.isPaused()) {
                document.dispatchEvent(new Event('pageshow'));
            }
            return;
        }
        // 未知调用
        gdk.gui.showMessage("callBySystem 未知参数：" + type);
    }

    // 获得环境参数配置
    getEnv(def: number = 1): ChannelCfg {
        let e = BGlobalUtil.getUrlValue('env');
        let c = def;
        if (e != null) {
            c = parseInt(e);
        }
        // 获取配置文件
        let d = BConfigManager.getItemById(ChannelCfg, def);
        if (c != def) {
            let n = BConfigManager.getItemById(ChannelCfg, c);
            d = {
                ...n,
                ...{
                    channel_code: d.channel_code,
                },
            };
        }
        // 如果外部参数有channel_id，则优先使用
        let cid = BGlobalUtil.getUrlValue('cid');
        if (cid && cid != '') {
            this.channelId = d.channel_id = parseInt(cid);
        } else {
            // 使用配置文件中的channel_id
            this.channelId = d.channel_id;
        }
        // 如果外部参数有platform_id，则优先使用
        let pid = BGlobalUtil.getUrlValue('ic_pid');
        if (pid && pid != '') {
            d.platform_id = parseInt(pid);
        }
        this.config = d;
        // 返回结果
        return d;
    }

    preinit() {
        window['callBySystem'] = this.callBySystem.bind(this);
        this.getEnv();
    }

    init(): void {
        this.userData = {};
        this.showAccountInput = true;
        this.URL = document.URL;
        this.loaded = true;
        this.callToSystem("loaded");
        this.callToSystem("logined");
    }

    heartbeatSDK() {
        this.callToSystem("heartbeat");
    }

    login(): void {

    }

    logout(): void {
        this.loaded = false;
        this.userData = {};
        gdk.gui.hideAllAlert();
        gdk.gui.hideAllMessage();
        gdk.gui.hideAllWaiting();
        gdk.gui.removeAllMenu();
        gdk.gui.removeAllPopup();
        gdk.gui.hideAllView();
        iclib.GuideUtil && iclib.GuideUtil.destroy();
        // 显示启动背景
        BLoginUtils.setLogoActive(true);
        // 清空服务器列表数据
        let m = this.serverModel;
        m.groups.length = 0;
        m.list.length = 0;
        m.timeStamp = -1;
        m.serverTime = 0;
        // 重置FSM状态
        gdk.fsm.Fsm.main.broadcastEvent(BootFsmEventId.RETURN_LOGIN);
    }

    logerr(): void {
        this.logout();
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {

    }

    kf(): void {

    }

    h5(): void {

    }

    bbs(): void {

    }

    updateVer(): void {
        if (this.updating) return;
        this.updating = true;
        CC_DEBUG && cc.log('检测到新的客户端版本，重启客户端');
        if (window.top) {
            window.top.location.href = this.URL;
            return;
        }
        window.location.href = BGlobalUtil.urlAppendTimestamp(this.URL);
    }

    changeAccount(): void {
        CC_DEBUG && cc.log('更换帐号，重启客户端');
        this.logout();
    }

    connectServerBefore(): void {

    }

    connectServer(): void {

    }

    createRole(): void {

    }

    enterGame(): void {

    }

    levelUp(): void {

    }

    getRealRMBCost(v: number): number {
        return v;
    }

    /**
     * 检查文本中是否带有敏感字
     * @param txt 
     * @param callback 
     */
    hasMaskWord(txt: string, callback: (succ: boolean) => void): void {
        let r = false;
        if (txt) {
            r = !!BMaskWordUtils.check(txt);
        }
        callback(r);
    }

    userService(): void {
        gdk.panel.open(BPanelId.ServiceView, null, this, {
            args: {
                title: '用户协议',
                url: this.agreementUrl,
            }
        });
    }
    privateService(): void {
        gdk.panel.open(BPanelId.ServiceView, null, this, {
            args: {
                title: '隐私政策',
                url: this.privacyUrl,
            }
        });
    }
}