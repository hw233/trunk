import BaseSdk from './BaseSdk';
import BGlobalUtil from '../common/utils/BGlobalUtil';

class GameInfomayi {
    static SCENE_LOGIN_SERVER = "loginServer";
    static SCENE_CREATE_ROLEINFO = "createRoleInfo";
    static SCENE_POST_ROLELEVEL = "postRoleLevel";
    static SCENE_LOGIN_SERVER_BERFORE = "loginServerBefore";
    static SCENE_ENTER_GAMEVIEW = "enterGameView";
}

// 荣耀Android
export class RongyaoAndroid extends BaseSdk {

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
        this.showServiceCheckBox = false;
        this.showServerGroup = true;
    }

    // 获得环境参数配置
    getEnv(def: number = 202) {
        return super.getEnv(def);
    }

    init(): void {
        this.userData = {};
        this.callToSystem("loaded");
    }

    loginSDK(game_uin: string, token: string): void {
        CC_DEBUG && cc.log('登录客户端');
        this.userData['game_uin'] = game_uin;
        this.userData['token'] = token;
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
        this.callToSystem("changeAccount");
        super.logout();
    }

    connectServerBefore(): void {
        this.uploadPlayerInfo(GameInfomayi.SCENE_LOGIN_SERVER_BERFORE);
    }

    connectServer(): void {
        this.uploadPlayerInfo(GameInfomayi.SCENE_LOGIN_SERVER);
    }

    createRole(): void {
        this.uploadPlayerInfo(GameInfomayi.SCENE_CREATE_ROLEINFO);
    }

    enterGame(): void {
        this.uploadPlayerInfo(GameInfomayi.SCENE_ENTER_GAMEVIEW);
    }

    levelUp(): void {
        this.uploadPlayerInfo(GameInfomayi.SCENE_POST_ROLELEVEL);
    }

    //向sdk上报玩家信息
    uploadPlayerInfo(type: GameInfomayi) {
        let server = this.serverModel.current;
        if (!server) {
            return;
        }
        let roleModel = this.roleModel;
        let info: any;
        if (roleModel) {
            info = {
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
                tm: (Date.now() / 1000) >> 0,
            };
        } else {
            info = {
                type: type,
                serverId: server.serverId,
                serverName: server.name,
            };
        }

        this.callToSystem("uploadPlayerInfo", info);
    }

    logout(): void {
        CC_DEBUG && cc.log('在别处登录，重启客户端');
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
            gameVipLevel: roleModel.vipLv,
        };
        this.callToSystem("pay", payInfo);
    }

    updateVer(): void {
        // CC_DEBUG && cc.log('检测到新的客户端版本，重启客户端');
        this.callToSystem("updateVer");
        this.callToSystem("logout");
        super.updateVer();
    }
}