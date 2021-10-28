import BaseSdk from './BaseSdk';
import BGlobalUtil from '../common/utils/BGlobalUtil';
import BLoginUtils from '../common/utils/BLoginUtils';
import BMaskWordUtils from '../common/utils/BMaskWordUtils';
import mlh5 from './libs/mlh5';

/** 
 * 漫灵平台SDK
 * @Author: sthoo.huang
 * @Date: 2020-01-11 18:51:12
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-10-15 17:52:46
 */

/**
 * 漫灵大陆安卓买量SDK
 */
export class ManLingAndroid extends BaseSdk {

    get account(): string {
        if (this.userData) {
            return this.userData.game_uin;
        }
        return null;
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
        this.isNeedUpdateBadWords = true;
        this.showKfIcon = true;
        this.showChangeAccountIcon = true;
        this.showBbsIcon = false;
        this.agreementUrl = 'https://sdk.mushi020.com/v3/UC/Agreement';
        this.privacyUrl = 'https://sdk.mushi020.com/v3/UC/Privacy';
    }

    // 获得环境参数配置
    getEnv(def: number = 109) {
        return super.getEnv(def);
    }

    init(): void {
        this.userData = {};
        this.callToSystem("loaded");
    }

    loginSDK(game_uin: string, token: string): void {
        CC_DEBUG && cc.log(`登录客户端id:${game_uin},,token:${token}`);
        let a = game_uin.split('#');
        this.userData['game_uin'] = a[0];
        this.userData['channelId'] = parseInt(a[1] || '0');
        this.userData['userToken'] = token;
        this.URL = document.URL;
        this.loaded = true;
        this.callToSystem("logined");
    }

    logoutSDK(): void {
        this.callToSystem("logouted");
        super.logout();
    }

    changeAccount(): void {
        // gdk.gui.showMessage("切换账号中，请稍等");
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_EXIT_GAME);
        this.callToSystem("changeAccount");
        super.logout();
    }

    createRole(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_CREATE_ROLE);
    }

    enterGame(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_ENTER_GAME);
    }

    levelUp(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_UP_GRADE);
    }

    /**
     * 重要道具变更(钻石、金币)
     */
    itemChanged(data: any) {
        let info: { index: number, value: number, oldV: number } = data;
        if ([2, 3].indexOf(info.index) == -1) return;

        let params: MLSDKPlayerInfoParams = new MLSDKPlayerInfoParams();
        params.typeOfProp = {
            itemName: info.index == 2 ? '钻石' : '金币',
            count: BGlobalUtil.numberToStr(info.value - info.oldV),
            reason: '',
            balance: BGlobalUtil.numberToStr(info.value),
        }
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_ITEM_CHANGE, params);
    }

    async chatWatch(data: icmsg.ChatSendRsp) {
        if (data.playerId.toLocaleString() != this.roleModel.id.toLocaleString()) return;
        let params: MLSDKPlayerInfoParams = new MLSDKPlayerInfoParams();
        let chatTo: string = data.channel + '';
        // switch (data.channel) {
        //     case ChatChannel.WORLD:
        //         chatTo = '世界';
        //         break;
        //     case ChatChannel.GUILD:
        //         let guildInfo = await GuildUtils.getGuildInfo().catch((e) => { guildInfo = null });
        //         if (guildInfo) {
        //             chatTo = `公会_${guildInfo.id}_${guildInfo.name}`;
        //         }
        //         break;
        //     default:
        //         break;
        // }
        params.typeOfChat = {
            chatTo: chatTo,
            content: data.content,
        }
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_CHAT, params);
    }

    /**
     * 上报事件
     * @param type  
     * @param args  
     */
    uploadPlayerInfo(type: MLSDKPlayerInfoType, args?: MLSDKPlayerInfoParams) {
        let server = this.serverModel.current;
        let roleModel = this.roleModel;
        let info = {
            type: type,
            playerLv: roleModel ? roleModel.level : '0',
            playerId: roleModel ? roleModel.id : this.account,
            playerName: roleModel ? roleModel.name : '无',
            playerVipLv: roleModel ? roleModel.vipLv : '0',
            playerCTime: roleModel ? roleModel.createTime : '0',
            serverId: server ? server.serverId : '0',
            serverName: server ? server.name : '无',
            itemName: '',
            count: '',
            reason: '',
            balance: '',
            chatTo: '',
            content: '',
            recharge: '',
        };
        switch (type) {
            case MLSDKPlayerInfoType.TYPE_ITEM_CHANGE:
                // 物品变更
                if (args && args.typeOfProp) {
                    let propInfo = args.typeOfProp;
                    info.itemName = propInfo.itemName;
                    info.count = propInfo.count;
                    info.reason = propInfo.reason;
                    info.balance = propInfo.balance;
                }
                break;

            case MLSDKPlayerInfoType.TYPE_CHAT:
                // 聊天上报
                if (args && args.typeOfChat) {
                    let chatInfo = args.typeOfChat;
                    info.chatTo = chatInfo.chatTo;
                    info.content = chatInfo.content;
                }
                break;
        }
        this.callToSystem('uploadPlayerInfo', info);
    }

    logout(): void {
        // CC_DEBUG && cc.log('在别处登录，重启客户端');
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_EXIT_GAME);
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
            itemPrice: data.money,
            itemOrigPrice: data.money,
            currency: 'CNY',
            origCurrency: 'USD',
            itemCount: '1',
            playerRestOfCoin: roleModel.gems,
            serverId: server.serverId,
            serverName: server.name,
            playerId: roleModel.id,
            playerName: roleModel.name,
            playerLv: roleModel.level,
            playerVipLv: roleModel.vipLv,
            noticeUrl: data.reserved,
            extension: data.orderId,
        };
        this.callToSystem('pay', payInfo);
    }

    kf(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_KF);
    }

    bbs(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_FORUM);
    }

    updateVer(): void {
        // CC_DEBUG && cc.log('检测到新的客户端版本，重启客户端');
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_EXIT_GAME);
        this.callToSystem("updateVer");
        this.callToSystem("logout");
        super.updateVer();
    }

    // 用户协议
    userService(): void {
        if (BGlobalUtil.getUrlValue('app') == 'true') {
            this.callToSystem('openlink', { url: this.agreementUrl });
            return;
        }
        super.userService();
    }

    // 隐私协议
    privateService(): void {
        if (BGlobalUtil.getUrlValue('app') == 'true') {
            this.callToSystem('openlink', { url: this.privacyUrl });
            return;
        }
        super.privateService();
    }
}

/**
 * 漫灵大陆安卓买量SDK---2
 */
export class ManLingAndroid2 extends ManLingAndroid {

    preinit() {
        super.preinit();
        this.agreementUrl = 'https://sdk.youmeng020.com/v3/UC/Agreement?bar=0';
        this.privacyUrl = 'https://sdk.youmeng020.com/v3/UC/Privacy?bar=0';
    }
}

/**
 * 漫灵大陆安卓渠道SDK
 */
export class ManLingDistAndroid extends ManLingAndroid {

    preinit() {
        super.preinit();
        this.showStartBtn = true;
        this.agreementUrl = 'https://sdk.manlinggame.com/v3/UC/Agreement?bar=0';
        this.privacyUrl = 'https://sdk.manlinggame.com/v3/UC/Privacy?bar=0';
    }

    // 获得环境参数配置
    getEnv(def: number = 117) {
        return super.getEnv(def);
    }

    login(): void {
        // gdk.gui.showMessage("加载登录窗口，请稍等");
        this.callToSystem("loaded");
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        CC_DEBUG && cc.log('支付');
        // gdk.gui.showMessage("加载支付窗口，请稍等");
        let roleModel = this.roleModel;
        let serverModel = this.serverModel;
        let server = serverModel.current;
        let realMoney = data.money;
        let productId = `gt.ftmc.${Math.floor((realMoney + 1) / 100)}cny` + (data.paymentId < 100 ? '' : '.pack');
        let payInfo = {
            itemId: productId,
            itemName: itemName,
            paymentDes: paymentDes,
            itemPrice: data.money,
            itemOrigPrice: data.money,
            currency: 'CNY',
            origCurrency: 'USD',
            itemCount: '1',
            playerRestOfCoin: roleModel.gems,
            serverId: server.serverId,
            serverName: server.name,
            playerId: roleModel.id,
            playerName: roleModel.name,
            playerLv: roleModel.level,
            playerVipLv: roleModel.vipLv,
            noticeUrl: data.reserved,
            extension: data.orderId,
        };
        this.callToSystem('pay', payInfo);
    }
}

/**
 * 漫灵IOS
 */
export class ManLingIOS extends ManLingAndroid {

    callBySystem(type: any, params: any) {
        switch (type) {
            //sdk登录成功调用
            case "login":
                let userid = BGlobalUtil.getUrlValue('game_uin', params);
                let token = BGlobalUtil.getUrlValue('token', params);
                // 附加参数，由于早期版本没有传入此参数，所以使用默认值
                let ios_source = BGlobalUtil.getUrlValue('ios_source', params);
                let ios_ver = BGlobalUtil.getUrlValue('ios_ver', params);
                this.ios_source = ios_source || 'syzn';
                this.ios_ver = parseInt(ios_ver || '4');
                this.loginSDK(userid, token);
                return;
        }
        super.callBySystem(type, params);
    }

    preinit() {
        super.preinit();
        this.showKfIcon = true;
        this.showBbsIcon = false;
        this.agreementUrl = '/uc/iosagreement.txt';
        this.privacyUrl = '/uc/iosprivacy.txt';
    }

    // 获得环境参数配置
    getEnv(def: number = 116) {
        return super.getEnv(def);
    }

    init(): void {
        this.userData = {};
        // this.callToSystem("loaded");
    }

    loginSDK(game_uin: string, token: string): void {
        super.loginSDK(game_uin, token);
        if (this.userData['channelId'] == 0) {
            this.userData['channelId'] = 200360061;
        }
        BLoginUtils.setLogoActive(true);
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        CC_DEBUG && cc.log('支付');
        // gdk.gui.showMessage("加载支付窗口，请稍等");
        let roleModel = this.roleModel;
        let serverModel = this.serverModel;
        let server = serverModel.current;

        let realMoney = data.money;
        let productId = `gt.ftmc.${Math.floor((realMoney + 1) / 100)}cny` + (data.paymentId < 100 ? '' : '.pack');
        let payInfo = {
            "amount": realMoney,
            "productId": productId,
            "productName": itemName,
            "productDesc": paymentDes,
            "roleId": roleModel.id,
            "roleName": roleModel.name,
            "serverId": server.serverId,
            "serverName": server.name,
            "orderExt": data.orderId,
            "noticeUrl": data.reserved,
            "currency": 'CNY',
        };
        this.callToSystem('pay', payInfo);
    }

    kf(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_KF);
    }

    /**
     * 上报事件
     * @param type  
     * @param args  
     */
    uploadPlayerInfo(type: MLSDKPlayerInfoType, args?: MLSDKPlayerInfoParams) {
        let roleModel = this.roleModel;
        let server = this.serverModel.current;
        let info = {
            "eventName": type,
            "serverId": server ? server.serverId : '0',
            "serverName": server ? server.name : '无',
            "roleId": roleModel ? roleModel.id : this.account,
            "roleName": roleModel ? roleModel.name : '无',
            "roleLevel": roleModel ? roleModel.level : '0',
            "vipLevel": roleModel ? roleModel.vipLv : '0',
            "itemName": '',
            "count": '',
            "balance": '',
            "reason": '',
            "chatTo": '',
            "content": '',
            "recharge": -1,
        };
        switch (type) {
            case MLSDKPlayerInfoType.TYPE_ITEM_CHANGE:
                // 物品变更
                if (args && args.typeOfProp) {
                    let propInfo = args.typeOfProp;
                    info.itemName = propInfo.itemName;
                    info.count = propInfo.count;
                    info.reason = propInfo.reason;
                    info.balance = propInfo.balance;
                }
                break;

            case MLSDKPlayerInfoType.TYPE_CHAT:
                // 聊天上报
                if (args && args.typeOfChat) {
                    let chatInfo = args.typeOfChat;
                    info.chatTo = chatInfo.chatTo;
                    info.content = chatInfo.content;
                }
                break;
        }
        this.callToSystem('uploadPlayerInfo', info);
    }
}

/**
 * 漫灵海外安卓SDK
 */
export class ManLingHwAndroid extends ManLingAndroid {

    preinit() {
        super.preinit();
        this.isNeedUpdateBadWords = false;
        this.showKfIcon = false;
        this.showServiceCheckBox = false;
    }

    // 获得环境参数配置
    getEnv(def: number = 201) {
        return super.getEnv(def);
    }

    getRealRMBCost(v: number): number {
        return v / 100;
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        CC_DEBUG && cc.log('支付');
        // gdk.gui.showMessage("加载支付窗口，请稍等");
        let roleModel = this.roleModel;
        let serverModel = this.serverModel;
        let server = serverModel.current;

        let realMoney = data.money;
        let productId = `gt.ftmc.${Math.floor((realMoney + 1) / 100)}usd` + (data.paymentId < 100 ? '' : '.pack');
        let payInfo = {
            itemId: productId,
            itemName: itemName,
            paymentDes: paymentDes,
            itemPrice: realMoney,
            itemOrigPrice: realMoney,
            currency: 'USD',
            origCurrency: 'USD',
            itemCount: '1',
            playerRestOfCoin: roleModel.gems,
            serverId: server.serverId,
            serverName: server.name,
            playerId: roleModel.id,
            playerName: roleModel.name,
            playerLv: roleModel.level,
            playerVipLv: roleModel.vipLv,
            noticeUrl: data.reserved,
            extension: data.orderId,
        };
        this.callToSystem('pay', payInfo);
    }
}

/**
 * 漫灵微信H5互通安卓SDK
 */
export class ManLingH5Android extends ManLingAndroid {

    // 获得环境参数配置
    getEnv(def: number = 110) {
        // 根据不同的运行环境使用不同的服务器列表
        if (BGlobalUtil.getUrlValue('trial') == '1') {
            // 体验版本
            this.server_list = 'shenhe_list';
            def = 114;
        }
        return super.getEnv(def);
    }
}

/**
 * 漫灵大陆H5
 */
export class ManLingH5 extends BaseSdk {

    _initCalled = false;

    get account(): string {
        if (this.userData) {
            return this.userData.userId;
        }
        return null;
    }

    preinit() {
        super.preinit();
        this.showChangeAccountIcon = true;
        this.showKfIcon = true;
    }

    // 获得环境参数配置
    getEnv(def: number = 110) {
        // 根据不同的运行环境使用不同的服务器列表
        if (BGlobalUtil.getUrlValue('trial') == '1') {
            // 体验版本
            this.server_list = 'shenhe_list';
            def = 114;
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
        s.src = 'https://h5.manlinggame.com/Scripts/h5/v2/mlh5.wap.js?v=201910301600';
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
        const mlh5 = window['mlh5'];
        mlh5.setInitCallback(data => {
            CC_DEBUG && cc.log("收到初始化成功通知:%o", data);
            mlh5.login();
        });

        mlh5.setLoginCallback(data => {
            CC_DEBUG && cc.log("收到登录成功通知:%o", data);
            this.userData = {
                channelId: 670050302,
                ...data,
            };
            this.loginSDK();
        });

        mlh5.setLogoutCallback(data => {
            CC_DEBUG && cc.log("收到退出成功通知:%o", data);
            this.logout();
        });
        mlh5.setPayCallback(data => {
            CC_DEBUG && cc.log("收到支付成功通知:%o", data);
        });
        mlh5.init(67005, "53E2BCA360961E7D5034A57755196C36");
    }

    loginSDK() {
        CC_DEBUG && cc.log('登录');
        this.URL = document.URL;
        this.loaded = true;
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        // gdk.gui.showMessage("加载支付窗口，请稍等");
        let roleModel = this.roleModel;
        let serverModel = this.serverModel;
        let server = serverModel.current;
        let payInfo = {
            amount: data.money, // 支付金额,单位：分
            currency: 'CNY',
            productId: data.paymentId + '',
            productName: itemName,
            productDesc: paymentDes,
            roleId: roleModel.id + '',
            roleName: roleModel.name,
            roleLevel: roleModel.level,
            serverId: server.serverId + '',
            serverName: server.name,
            orderExt: data.orderId, // 自定义参数，支付通知原样返回
        };
        window['mlh5'].pay(payInfo);
    }

    logout(): void {
        // CC_DEBUG && cc.log('在别处登录，重启客户端');
        if (!this.loaded) {
            return;
        }
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_EXIT_GAME);
        super.logout();
        window['mlh5'].login();
    }

    kf(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_KF);
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
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_EXIT_GAME);
        super.logout();
        window['mlh5'].logout();
    }

    createRole(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_CREATE_ROLE);
    }

    enterGame(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_ENTER_GAME);
    }

    levelUp(): void {
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_UP_GRADE);
    }

    /**
     * 重要道具变更(钻石、金币)
     */
    itemChanged(data: any) {
        let info: { index: number, value: number, oldV: number } = data;
        if ([2, 3].indexOf(info.index) == -1) return;

        let params: MLSDKPlayerInfoParams = new MLSDKPlayerInfoParams();
        params.typeOfProp = {
            itemName: info.index == 2 ? '钻石' : '金币',
            count: BGlobalUtil.numberToStr(info.value - info.oldV),
            reason: '',
            balance: BGlobalUtil.numberToStr(info.value),
        }
        this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_ITEM_CHANGE, params);
    }

    // async chatWatch(data: icmsg.ChatSendRsp) {
    //     if (data.playerId.toLocaleString() != this.roleModel.id.toLocaleString()) return;
    //     let params: MLSDKPlayerInfoParams = new MLSDKPlayerInfoParams();
    //     let chatTo: string = '';
    //     switch (data.channel) {
    //         case ChatChannel.WORLD:
    //             chatTo = '世界';
    //             break;
    //         case ChatChannel.GUILD:
    //             let guildInfo = await GuildUtils.getGuildInfo().catch((e) => { guildInfo = null });
    //             if (guildInfo) {
    //                 chatTo = `公会_${guildInfo.id}_${guildInfo.name}`;
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    //     params.typeOfChat = {
    //         chatTo: chatTo,
    //         content: data.content,
    //     }
    //     this.uploadPlayerInfo(MLSDKPlayerInfoType.TYPE_CHAT, params);
    // }

    /**
     * 上报事件
     * @param type  
     * @param args  
     */
    uploadPlayerInfo(type: MLSDKPlayerInfoType, args?: MLSDKPlayerInfoParams) {
        let roleModel = this.roleModel;
        let server = this.serverModel.current;
        let info: any = {
            eventName: type,
            roleId: roleModel ? roleModel.id : this.account,
            roleName: roleModel ? roleModel.name : '无',
            roleLevel: roleModel ? roleModel.level : '0',
            vipLevel: roleModel ? roleModel.vipLv : '0',
            serverId: server ? server.serverId : '0',
            serverName: server ? server.name : '无',
        };
        switch (type) {
            case MLSDKPlayerInfoType.TYPE_ITEM_CHANGE:
                // 物品变更
                if (args && args.typeOfProp) {
                    let propInfo = args.typeOfProp;
                    info.itemName = propInfo.itemName;
                    info.count = propInfo.count;
                    info.reason = propInfo.reason;
                    info.balance = propInfo.balance;
                }
                break;
            // case MLSDKPlayerInfoType.TYPE_CHAT:
            //     // 聊天上报
            //     if (args && args.typeOfChat) {
            //         let chatInfo = args.typeOfChat;
            //         info.chatTo = chatInfo.chatTo;
            //         info.content = chatInfo.content;
            //     }
            //     break;
        }
        window['mlh5'].cusEvent(info);
    }
}

/**
 * 微信小游戏SDK（坦克战地）
 */
export class ManLingWechatGame extends BaseSdk {

    _initCalled = false;

    get account(): string {
        if (this.userData) {
            return this.userData.userId;
        }
        return null;
    }

    preinit() {
        super.preinit();
        this.showKfIcon = false;
        this.showH5Icon = false;
    }

    // 获得环境参数配置
    getEnv(def: number = 110) {
        // 根据不同的运行环境使用不同的服务器列表
        let wxcfg = window['__wxConfig'];
        switch (wxcfg.envVersion) {
            case "trial": // 测试环境，体验版，开发版
            case "develop":
                this.server_list = 'shenhe_list';
                this.can_charge = false;
                def = 114;
                break;

            case "release": // 正式环境
            default:
                def = 110;
                this.can_charge = true;
                this.showH5Icon = true;
                this.showKfIcon = true;
                break;
        }
        return super.getEnv(def);
    }

    init(): void {
        let callback = () => {
            this._initCalled = true;
            mlh5.login({
                callback: (res: any) => {
                    this.userData = {
                        channelId: 670050202,
                        ...res,
                    };
                    this.loginSDK();
                },
            });
        };
        if (this._initCalled) {
            callback();
            return;
        }
        let setting = window['_TDSettings'];
        mlh5.init({
            appId: 67005,
            channelId: 670050202,
            appKey: '53E2BCA360961E7D5034A57755196C36',
            version: setting ? setting.version : '1.0.1',
            callback: callback,
        });
    }

    loginSDK() {
        CC_DEBUG && cc.log('登录');
        this.loaded = true;
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        CC_DEBUG && cc.log('支付');
        // gdk.gui.showMessage("加载支付窗口，请稍等");
        let roleModel = this.roleModel;
        let serverModel = this.serverModel;
        let server = serverModel.current;
        let payInfo = {
            amount: data.money, // 支付金额,单位：分
            currency: 'CNY',
            productId: data.paymentId,
            productName: itemName,
            productDesc: paymentDes,
            roleId: roleModel.id,
            roleName: roleModel.name,
            roleLevel: roleModel.level,
            serverId: server.serverId,
            serverName: server.name,
            orderExt: data.orderId, // 自定义参数，支付通知原样返回
        };
        mlh5.pay(payInfo);
    }

    hasMaskWord(txt: string, callback: (succ: boolean) => void): void {
        let r = false;
        if (txt) {
            r = !!BMaskWordUtils.check(txt);
            if (!r) {
                // 调用微信接口验证内容
                mlh5.msgSecCheck({
                    content: txt,
                    callback: (data: { result: number, msg: string }) => callback(data.result != 200 || data.msg != 'ok'),
                });
                return;
            }
        }
        callback(r);
    }

    kf(): void {
        mlh5.kefu();
    }

    h5(): void {
        mlh5.gotoH5();
    }
}

/**
 * 微信小游戏SDK（废土迷城）
 */
export class ManLingWechatGame2 extends ManLingWechatGame {

    preinit() {
        super.preinit();
        this.agreementUrl = '/uc/wx3agreement.txt';
        this.privacyUrl = '/uc/wx3privacy.txt';
    }

    // 获得环境参数配置
    getEnv(def: number = 301) {
        // 根据不同的运行环境使用不同的服务器列表
        let wxcfg = window['__wxConfig'];
        switch (wxcfg.envVersion) {
            case "trial": // 测试环境，体验版，开发版
            case "develop":
                def = 302;
                this.can_charge = false;
                break;

            case "release": // 正式环境
            default:
                def = 301;
                this.can_charge = true;
                break;
        }
        return super.getEnv(def);
    }

    init(): void {
        let callback = () => {
            this._initCalled = true;
            mlh5.login({
                callback: (res: any) => {
                    this.userData = {
                        channelId: 200360035,
                        ...res,
                    };
                    this.loginSDK();
                },
            });
        };
        if (this._initCalled) {
            callback();
            return;
        }
        let setting = window['_TDSettings'];
        mlh5.getCore().systemArgs.sdkHost = 'https://sdk.manlinggame.com';
        mlh5.init({
            appId: 20036,
            channelId: 200360035,
            appKey: 'AA48318019CF7E5B297D6B73CE524D02',
            version: setting ? setting.version : '1.0.1',
            callback: callback,
        });
    }
}

class MLSDKPlayerInfoType {
    static TYPE_CREATE_ROLE: string = "createRole"; // 创建角色
    static TYPE_UP_GRADE: string = "upgrade"; // 等级变动
    static TYPE_ENTER_GAME: string = "enterGame"; // 进入游戏
    static TYPE_EXIT_GAME: string = "exitGame"; // 退出游戏
    static TYPE_KF: string = "kf";  // 联系客服
    static TYPE_FORUM: string = "forum";  // 社区
    static TYPE_ITEM_CHANGE: string = "itemChange"; // 重要道具变动（金币、钻石）
    static TYPE_CHAT: string = "chat"; // 聊天监控
}

class MLSDKPlayerInfoParams {
    /**重要道具变动（如金币，钻石变动）事件参数 */
    typeOfProp: {
        itemName: string, //道具名称，如：钻石，金币
        count: string, //道具名称，如：钻石，金币
        reason: string, //变动原因，不能为nil，可以为空字符串
        balance: string, //对应道具当前余额
    };

    /**聊天监控 事件参数 */
    typeOfChat: {
        /**
         * 1.世界聊天时：世界
           2.公会聊天时：公会_{公会Id}_{公会名称}
           3.私聊时：私聊_{私聊角色Id}_{私聊角色名称}
           4:其它, {自定义场景}_{自定义参数}
           5.投诉聊天：投诉@{被投诉对象角色Id}  
         */
        chatTo: string,
        content: string, //聊天内容（当chatTo为投诉时,传投诉相关内容）
    }
}