import BaseSdk from './BaseSdk';
import BGlobalUtil from '../common/utils/BGlobalUtil';
import BMaskWordUtils from '../common/utils/BMaskWordUtils';
import MiniSdk from './libs/bhSdk';

class IcefoxPlayerInfoType {
    static TYPE_CREATE_ROLE: string = "createRole";     // 创建角色
    static TYPE_UP_GRADE: string = "upgrade";           // 等级变动
    static TYPE_ENTER_GAME: string = "enterGame";       // 进入游戏
    static TYPE_EXIT_GAME: string = "exitGame";         // 退出游戏
}

class BHPlayerInfoType {
    static CREATE_ROLE = "roleCreate";                  // 创建角色
    static UP_GRADE = "roleUplevel";                    // 等级变动
    static ENTER_GAME = "enterGame";                    // 进入游戏
}

// 冰狐安卓
export class IcefoxAndroid extends BaseSdk {

    get account(): string {
        return BGlobalUtil.getLocal('login_userid', false, '0');
    }

    callBySystem(type: any, params: any) {
        switch (type) {
            //sdk登录成功调用
            case "login":
                let userid = BGlobalUtil.getUrlValue('game_uin', params);
                let token = BGlobalUtil.getUrlValue('token', params);
                this.loginSDK(userid, token);
                return;

            case "logout":
                this.logoutSDK();
                return;
        }
        super.callBySystem(type, params);
    }

    preinit() {
        super.preinit();
        this.isAutoLogin = true;
        this.showChangeAccountIcon = true;
        this.showServiceCheckBox = false;
        this.showServerGroup = true;
    }

    // 获得环境参数配置
    getEnv(def: number = 115) {
        return super.getEnv(def);
    }

    init(): void {
        this.userData = {};
        this.callToSystem("loaded");
    }

    heartbeatSDK() {
        this.callToSystem("heartbeat");
    }

    loginSDK(game_uin: string, token: string): void {
        CC_DEBUG && cc.log(`登录客户端id:${game_uin},,token:${token}`);
        this.userData['access_token'] = token;
        this.URL = document.URL;
        this.loaded = true;
        this.callToSystem("logined");
    }

    logoutSDK(): void {
        this.callToSystem("logouted");
        super.logout();
    }

    changeAccount(): void {
        this.uploadPlayerInfo(IcefoxPlayerInfoType.TYPE_EXIT_GAME);
        this.callToSystem("changeAccount");
        super.logout();
    }

    createRole(): void {
        this.uploadPlayerInfo(IcefoxPlayerInfoType.TYPE_CREATE_ROLE);
    }

    enterGame(): void {
        this.uploadPlayerInfo(IcefoxPlayerInfoType.TYPE_ENTER_GAME);
    }

    levelUp(): void {
        this.uploadPlayerInfo(IcefoxPlayerInfoType.TYPE_UP_GRADE);
    }

    /**
     * 上报事件
     * @param type  
     * @param args  
     */
    uploadPlayerInfo(type: IcefoxPlayerInfoType) {
        let server = this.serverModel.current;
        if (!server) {
            return;
        }
        let roleModel = this.roleModel;
        if (!roleModel || !roleModel.id) {
            return;
        }
        let info = {
            type: type,
            playerLv: roleModel.level,
            playerId: roleModel.id,
            playerName: roleModel.name,
            playerOldName: '',
            playerSex: roleModel.gender == 1 ? '女' : '男',
            playerVipLv: roleModel.vipLv,
            playerCTime: roleModel.createTime,
            playerPower: roleModel.power,
            serverId: server ? server.serverId : '',
            serverName: server ? server.name : '',
            balance: '',
        };
        this.callToSystem('uploadPlayerInfo', info);
    }

    logout(): void {
        // CC_DEBUG && cc.log('在别处登录，重启客户端');
        this.uploadPlayerInfo(IcefoxPlayerInfoType.TYPE_EXIT_GAME);
        this.callToSystem("logout");
        super.logout();
    }

    logerr(): void {
        // CC_DEBUG && cc.log('登录验证失败，重启客户端');
        this.callToSystem("logerr");
        super.logout();
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        CC_DEBUG && cc.log('支付');
        // gdk.gui.showMessage("加载支付窗口，请稍等");
        let roleModel = this.roleModel;
        let serverModel = this.serverModel;
        let server = serverModel.current;
        let payInfo = {
            itemId: data.paymentId,
            itemName: itemName,
            paymentDes: paymentDes,
            itemPrice: data.money * 0.01,
            itemOrigPrice: data.money * 0.01,
            serverId: server.serverId,
            serverName: server.name,
            playerId: roleModel.id,
            playerName: roleModel.name,
            playerLv: roleModel.level,
            extension: data.orderId,
        };
        this.callToSystem('pay', payInfo);
    }

    updateVer(): void {
        // CC_DEBUG && cc.log('检测到新的客户端版本，重启客户端');
        this.uploadPlayerInfo(IcefoxPlayerInfoType.TYPE_EXIT_GAME);
        this.callToSystem("updateVer");
        this.callToSystem("logout");
        super.updateVer();
    }
}

// 冰狐微信H5互通安卓SDK
export class IcefoxH5Android extends IcefoxAndroid {

    preinit() {
        super.preinit();
        this.isAutoLogin = false;
    }

    // 获得环境参数配置
    getEnv(def: number = 118) {
        // 根据不同的运行环境使用不同的服务器列表
        if (BGlobalUtil.getUrlValue('trial') == '1') {
            // 体验版本
            def = 119;
        }
        return super.getEnv(def);
    }

    loginSDK(game_uin: string, token: string): void {
        this.userData['pid'] = 100;
        this.userData['gid'] = 101106;
        this.userData['h5'] = 1;
        super.loginSDK(game_uin, token);
    }
}

// 冰狐H5
export class IcefoxH5 extends BaseSdk {

    private _initCalled = false;
    private _bhSdk: any;

    get account(): string {
        return BGlobalUtil.getLocal('login_userid', false, '0');
    }

    preinit() {
        super.preinit();
        this.showChangeAccountIcon = true;
        this.showServerGroup = true;
        this.agreementUrl = '/uc/bhagreement.txt';
        this.privacyUrl = '/uc/bhprivacy.txt';
    }

    // 获得环境参数配置
    getEnv(def: number = 118) {
        // 根据不同的运行环境使用不同的服务器列表
        if (BGlobalUtil.getUrlValue('trial') == '1') {
            // 体验版本
            def = 119;
        }
        return super.getEnv(def);
    }

    init(): void {
        if (this._initCalled) {
            return;
        }
        this._initCalled = true;
        this._loadLib();
    }

    // 加载H5脚本
    private _loadLib() {
        let self = this;
        let d = document, s = document.createElement('script');
        s.async = true;
        s.src = 'https://h5.icefoxgame.com/bhSdk/static/js/bhSdk.js?v=20210628';
        function loadHandler() {
            s.parentNode.removeChild(s);
            s.removeEventListener('load', loadHandler, false);
            s.removeEventListener('error', errorHandler, false);
            // 加载完成，初始化SDK接口
            gdk.Timer.callLater(self, self._initLib);
        };
        function errorHandler() {
            s.parentNode.removeChild(s);
            s.removeEventListener('load', loadHandler, false);
            s.removeEventListener('error', errorHandler, false);
            // 失败重试
            gdk.Timer.callLater(self, self._loadLib);
        };
        s.addEventListener('load', loadHandler, false);
        s.addEventListener('error', errorHandler, false);
        d.body.appendChild(s);
    }

    // 初始化SDK接口
    private _initLib(): void {
        this._bhSdk = window['bhSdk'];
        this._bhSdk.getUserInfo(res => {
            CC_DEBUG && cc.log("收到登录成功通知:%o", res);
            this.userData = {
                // gid: 101106,
                h5: 1,
                access_token: res.accessToken,
                ...res,
            };
            this.loginSDK();
        });
    }

    loginSDK() {
        CC_DEBUG && cc.log('登录');
        this.URL = document.URL;
        this.loaded = true;
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        CC_DEBUG && cc.log('支付');
        // gdk.gui.showMessage("加载支付窗口，请稍等");
        let roleModel = this.roleModel;
        let serverModel = this.serverModel;
        let server = serverModel.current;
        const payData = {
            tm: (Date.now() / 1000) >> 0,
            access_token: this.userData.accessToken,
            role_id: roleModel.id,
            role_name: roleModel.name,
            role_level: roleModel.level,
            server_id: server.serverId,
            server_name: server.name,
            amt: data.money * 0.01,
            goods_name: itemName,
            game_order_no: data.orderId,
            game_ext: data.reserved,
        };
        this._bhSdk.pay(payData);
    }

    logout(): void {
        // CC_DEBUG && cc.log('在别处登录，重启客户端');
        if (!this.loaded) {
            return;
        }
        super.logout();
    }

    updateVer(): void {
        if (this.updating) return;
        this.updating = true;
        CC_DEBUG && cc.log('检测到新的客户端版本，重启客户端');
        window.location.href = BGlobalUtil.urlAppendTimestamp(this.URL);
    }

    changeAccount(): void {
        // gdk.gui.showMessage("切换账号中，请稍等");
        if (!this.loaded) {
            return;
        }
        super.logout();
        this._bhSdk.changeAccount();
    }

    createRole(): void {
        this.uploadPlayerInfo(BHPlayerInfoType.CREATE_ROLE);
    }

    enterGame(): void {
        this.uploadPlayerInfo(BHPlayerInfoType.ENTER_GAME);
    }

    levelUp(): void {
        this.uploadPlayerInfo(BHPlayerInfoType.UP_GRADE);
    }

    /**
     * 上报事件
     * @param type  
     * @param args  
     */
    uploadPlayerInfo(type: BHPlayerInfoType) {
        let roleModel = this.roleModel;
        let server = this.serverModel.current;
        const roleData = {
            info_type: type,
            server_id: server ? server.serverId : '',
            server_name: server ? server.name : '',
            role_id: roleModel.id,
            role_name: roleModel.name,
            role_level: roleModel.level,
            role_createtime: roleModel.createTime,
            access_token: this.userData.accessToken,
            role_leveltime: 0,
            role_gender: roleModel.gender == 1 ? '女' : '男',
            role_vip: roleModel.vipLv,
            role_balance: roleModel.guildName || '无',
            role_fightvalue: roleModel.power,
            role_profession: '无',
            role_partyname: roleModel.gems,
            role_oldname: ''
        };
        this._bhSdk.submitRoleInfo(roleData);
    }
}

// 冰狐微信小游戏
export class BHWechatGame extends BaseSdk {

    private _initCalled = false;
    private _bhSdk: MiniSdk;

    get account(): string {
        return BGlobalUtil.getLocal('login_userid', false, '0');
    }

    preinit() {
        super.preinit();
        this.showServerGroup = true;
        this.agreementUrl = '/uc/bhagreement.txt';
        this.privacyUrl = '/uc/bhprivacy.txt';
    }

    // 获得环境参数配置
    getEnv(def: number = 118) {
        // 根据不同的运行环境使用不同的服务器列表
        let wxcfg = window['__wxConfig'];
        switch (wxcfg.envVersion) {
            case "trial": // 测试环境，体验版，开发版
            case "develop":
                this.can_charge = false;
                this.isAutoLogin = false;
                def = 119;
                break;

            case "release": // 正式环境
            default:
                def = 118;
                this.can_charge = true;
                this.isAutoLogin = true;
                break;
        }
        return super.getEnv(def);
    }

    init(): void {
        // 授权查询并登录
        let pid = 112;
        let gid = (cc.sys.OS_IOS == cc.sys.os) ? 101102 : 101101;
        let callback = () => {
            this._initCalled = true;
            this._bhSdk.login(res => {
                // 我方返回的用户信息
                const userInfo = res.data;
                const wx = window['wx'];
                const query = wx.getLaunchOptionsSync().query;
                this.userData = {
                    pid: pid,
                    gid: gid,
                    access_token: userInfo.accessToken,
                    friend: query ? query.friend : undefined,
                    ...userInfo,
                };
                wx.getSetting({
                    success: res => {
                        wx.hideLoading();
                        if (!res.authSetting['scope.userInfo']) {
                            // 创建用户授权按钮
                            let systemInfo = wx.getSystemInfoSync();
                            let btn = wx.createUserInfoButton({
                                type: 'img',
                                image: 'images/hero.png',
                                text: '授权登录游戏',
                                style: {
                                    top: systemInfo.windowHeight * 3 / 4,
                                    left: systemInfo.windowWidth / 2 - 124.5 * 0.6,
                                    width: 249 * 0.6,
                                    height: 74 * 0.6,
                                    lineHeight: 40,
                                    // backgroundColor: '#07c160',
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontSize: 16,
                                    borderRadius: 4
                                }
                            });
                            btn.onTap(res => {
                                // 授权成功
                                btn.hide();
                                this._bhSdk.bindAccount({
                                    access_token: userInfo.access_token,
                                    encryptedData: res.encryptedData,
                                    iv: res.iv,
                                }, res => { });
                                // 登录成功回调
                                this.loginSDK();
                            });
                            return;
                        }
                        // 登录成功回调
                        this.loginSDK();
                    }
                });
            });
        };

        if (this._initCalled) {
            callback();
            return;
        }
        this._bhSdk = new MiniSdk();
        this._bhSdk.init(
            {
                pid: pid,
                gid: gid,
            },
            callback,
        );
    }

    loginSDK() {
        CC_DEBUG && cc.log('登录');
        // 设置分享参数
        this._bhSdk.setShare();
        this.loaded = true;
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        CC_DEBUG && cc.log('支付');
        // gdk.gui.showMessage("加载支付窗口，请稍等");
        let roleModel = this.roleModel;
        let serverModel = this.serverModel;
        let server = serverModel.current;
        const payData = {
            tm: (Date.now() / 1000) >> 0,
            access_token: this.userData.accessToken,
            role_id: roleModel.id,
            role_name: roleModel.name,
            role_level: roleModel.level,
            server_id: server.serverId,
            server_name: server.name,
            amt: data.money * 0.01,
            goods_name: itemName,
            game_order_no: data.orderId,
            game_ext: data.reserved,
        };
        this._bhSdk.pay(payData);
    }

    createRole(): void {
        this.uploadPlayerInfo(BHPlayerInfoType.CREATE_ROLE);
    }

    enterGame(): void {
        this.uploadPlayerInfo(BHPlayerInfoType.ENTER_GAME);
        // 设置分享参数，实现邀请有礼
        if (this.roleModel) {
            this._bhSdk.setShare({ query: 'friend=' + this.roleModel.id });
        }
    }

    levelUp(): void {
        this.uploadPlayerInfo(BHPlayerInfoType.UP_GRADE);
    }

    /**
     * 上报事件
     * @param type  
     * @param args  
     */
    uploadPlayerInfo(type: BHPlayerInfoType) {
        let roleModel = this.roleModel;
        let server = this.serverModel.current;
        const roleData = {
            info_type: type,
            server_id: server ? server.serverId : '',
            server_name: server ? server.name : '',
            role_id: roleModel.id,
            role_name: roleModel.name,
            role_level: roleModel.level,
            role_createtime: roleModel.createTime,
            access_token: this.userData.accessToken,
            role_leveltime: 0,
            role_gender: roleModel.gender == 1 ? '女' : '男',
            role_vip: roleModel.vipLv,
            role_balance: roleModel.guildName || '无',
            role_fightvalue: roleModel.power,
            role_profession: '无',
            role_partyname: roleModel.gems,
            role_oldname: ''
        };
        this._bhSdk.submitRoleInfo(roleData);
    }

    hasMaskWord(txt: string, callback: (succ: boolean) => void): void {
        let r = false;
        if (txt) {
            r = !!BMaskWordUtils.check(txt);
            if (!r) {
                // 调用微信接口验证内容
                this._bhSdk.checkContent(txt, (res: { code: number, data: boolean, msg: string }) => {
                    callback(res.code != 200 || res.msg != 'success' || res.data !== true);
                });
                return;
            }
        }
        callback(r);
    }
}