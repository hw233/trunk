import BaseSdk from './BaseSdk';
import BGlobalUtil from '../common/utils/BGlobalUtil';

/** 
 * 果盘平台SDK
 * @Author: sthoo.huang
 * @Date: 2020-01-11 18:51:12
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-10-15 17:52:24
 */

// 果盘H5
export class GuopanH5 extends BaseSdk {

    get account(): string {
        return this.userData.game_uin;
    }

    preinit() {
        super.preinit();
        this.showServiceCheckBox = false;
    }

    // 获得环境参数配置
    getEnv(def: number = 100) {
        return super.getEnv(def);
    }

    init(): void {
        let props = ['source', 'guopanAppId', 'game_uin', 'time', 'gid', 'sign'];
        this.userData = {};
        props.forEach(p => {
            this.userData[p] = BGlobalUtil.getUrlValue(p);
        });
        this.URL = "http://h5.guopan.cn/web/game.php?appid=" + this.userData['guopanAppId'];
        this.loaded = true;
    }

    logout(): void {
        CC_DEBUG && cc.log('在别处登录，重启客户端');
        window.top.location.href = this.URL;
    }

    logerr(): void {
        CC_DEBUG && cc.log('登录验证失败，重启客户端');
        window.top.location.href = this.URL;
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        if (!this.loaded) return;
        if (!this.userData) return;
        let d = this.userData;
        let o = "http://h5.guopan.cn/api/sdk_pay.php?guopanAppId=" + d.guopanAppId;
        o += "&serialNumber=" + data.orderId;
        o += "&goodsName=";
        o += "&game_uin=" + d.game_uin;
        o += "&ext=" + data.reserved;
        o += "&gameUrl=" + encodeURIComponent(this.URL);
        o += "&time=" + data.time;
        o += "&money=" + data.money * 0.01;
        o += "&sign=" + data.sign;
        window.top.location.href = o;
    }
}

// 果盘Android
export class GuopanAndroid extends BaseSdk {

    get account(): string {
        return this.userData.game_uin;
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
        this.agreementUrl = '/uc/ffagreement.txt';
        this.privacyUrl = '/uc/ffprivacy.txt';
        // 明日守望者使用不同的隐私协议
        if (this.config.id == 104) {
            this.privacyUrl = 'uc/mrswzprivacy.txt';
        }
    }

    // 获得环境参数配置
    getEnv(def: number = 101) {
        return super.getEnv(def);
    }

    init(): void {
        this.userData = {};
        this.callToSystem("loaded");
    }

    loginSDK(game_uin: string, token: string): void {
        CC_DEBUG && cc.log('登录客户端');
        this.userData['game_uin'] = game_uin;
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
        // gdk.gui.showMessage("切换账号中，请稍等");
        this.uploadPlayerInfo(GPSDKPlayerInfoType.TYPE_EXIT_GAME);
        this.callToSystem("changeAccount");
        super.logout();
    }

    createRole(): void {
        this.uploadPlayerInfo(GPSDKPlayerInfoType.TYPE_CREATE_ROLE);
    }

    enterGame(): void {
        this.uploadPlayerInfo(GPSDKPlayerInfoType.TYPE_ENTER_GAME);
    }

    levelUp(): void {
        this.uploadPlayerInfo(GPSDKPlayerInfoType.TYPE_LEVEL_UP);
    }

    //向sdk上报玩家信息
    uploadPlayerInfo(type: GPSDKPlayerInfoType) {
        let server = this.serverModel.current;
        if (!server) {
            return;
        }
        let roleModel = this.roleModel;
        if (!roleModel || !roleModel.id) {
            return;
        }

        let playerInfo = {
            type: type,
            gameLevel: roleModel.level,
            playerId: roleModel.id,
            playerNickName: roleModel.name,
            playerGender: roleModel.gender,
            playerExp: roleModel.exp,
            playerCreateTime: roleModel.createTime,
            serverId: server.serverId,
            serverName: server.name,
            partyName: roleModel.guildName,
            gameVipLevel: roleModel.vipLv,
            balance: roleModel.gems,
        };

        this.callToSystem("uploadPlayerInfo", playerInfo);
    }

    logout(): void {
        CC_DEBUG && cc.log('在别处登录，重启客户端');
        this.uploadPlayerInfo(GPSDKPlayerInfoType.TYPE_EXIT_GAME);
        this.callToSystem("logout");
        super.logout();
    }

    logerr(): void {
        CC_DEBUG && cc.log('登录验证失败，重启客户端');
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
            itemPrice: data.money * 0.01,
            itemOrigPrice: data.money * 0.01,
            itemCount: "1",
            paymentDes: paymentDes,
            serialNumber: data.orderId,
            gameLevel: roleModel.level,
            playerId: roleModel.id,
            playerNickName: roleModel.name,
            serverId: server.serverId,
            serverName: server.name,
            rate: "5.0",
            reserved: data.reserved,
        };
        this.callToSystem("pay", payInfo);
    }

    updateVer(): void {
        // CC_DEBUG && cc.log('检测到新的客户端版本，重启客户端');
        this.uploadPlayerInfo(GPSDKPlayerInfoType.TYPE_EXIT_GAME);
        this.callToSystem("updateVer");
        this.callToSystem("logout");
        super.updateVer();
    }
}

/**
 * 果盘IOS
 */
export class GuopanIOS extends GuopanAndroid {

    callBySystem(type: any, params: any) {
        switch (type) {
            //sdk登录成功调用
            case "login":
                let userid = BGlobalUtil.getUrlValue('game_uin', params);
                let token = BGlobalUtil.getUrlValue('token', params);
                // 附加参数，由于早期版本没有传入此参数，所以使用默认值
                let ios_source = BGlobalUtil.getUrlValue('ios_source', params);
                let ios_ver = BGlobalUtil.getUrlValue('ios_ver', params);
                this.ios_source = ios_source || 'mrswz';
                this.ios_ver = parseInt(ios_ver || '4');
                this.loginSDK(userid, token);
                return;
        }
        super.callBySystem(type, params);
    }

    preinit() {
        super.preinit();
        this.agreementUrl = '/uc/iosagreement_mrswz.txt';
        this.privacyUrl = '/uc/iosprivacy_mrswz.txt';
    }

    // 获得环境参数配置
    getEnv(def: number = 106) {
        return super.getEnv(def);
    }

    init(): void {
        this.userData = {};
        // this.callToSystem("loaded");
    }

    pay(data: icmsg.PayOrderRsp, itemName: string, paymentDes: string): void {
        CC_DEBUG && cc.log('支付');
        // gdk.gui.showMessage("加载支付窗口，请稍等");
        let realMoney = data.money;
        let appleGoodsID = `gt.mrswz.${Math.floor((realMoney + 1) / 100)}cny` + (data.paymentId < 100 ? '' : '.pack');
        let payInfo = {
            serialNumber: data.orderId,
            itemID: data.paymentId,
            itemName: itemName,
            itemPrice: data.money * 0.01,
            itemCount: '1',
            reserved: data.reserved,
            paymentDes: paymentDes,
            appleGoodsID: appleGoodsID,
        };
        this.callToSystem('pay', payInfo);
    }

    //向sdk上报玩家信息
    uploadPlayerInfo(type: GPSDKPlayerInfoType) {
        let server = this.serverModel.current;
        if (!server) {
            return;
        }
        let roleModel = this.roleModel;
        if (!roleModel || !roleModel.id) {
            return;
        }
        let playerInfo = {
            type: type,
            playerID: roleModel.id,
            playerNickName: roleModel.name,
            severName: server.name,
            severID: server.serverId,
            gameLevel: roleModel.level,
            gender: roleModel.gender == 1 ? "女" : "男",
            vipLevel: roleModel.vipLv,
            balance: roleModel.gems,
            fightvalue: roleModel.power,
            profession: "指挥官",
        };
        this.callToSystem("uploadPlayerInfo", playerInfo);
    }
}

enum GPSDKPlayerInfoType {
    TYPE_ENTER_GAME = 100,
    TYPE_LEVEL_UP = 101,
    TYPE_CREATE_ROLE = 102,
    TYPE_EXIT_GAME = 103,
}