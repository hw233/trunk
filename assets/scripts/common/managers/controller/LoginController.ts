import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ErrorManager from '../ErrorManager';
import LoginFsmEventId from '../../../scenes/main/enum/LoginFsmEventId';
import LoginModel from '../../models/LoginModel';
import ModelManager from '../ModelManager';
import SdkTool from '../../../sdk/SdkTool';
import ServerModel from '../../models/ServerModel';

/**
 * 登录信息控制器
 * @Author: sthoo.huang
 * @Date: 2019-04-08 10:19:06
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-24 11:47:28
 */

export default class LoginController extends BaseController {

    serverModel: ServerModel;
    model: LoginModel;
    fsm: gdk.fsm.Fsm;

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.RoleLoginRsp.MsgType, this.onLoginRspHandle],
        ];
    }

    onStart() {
        this.serverModel = ModelManager.get(ServerModel);
        this.model = ModelManager.get(LoginModel);
        this.fsm = gdk.fsm.Fsm.main;
    }

    onEnd() {
        this.serverModel = null;
        this.model = null;
        this.fsm = null;
    }

    onLoginRspHandle(msg: icmsg.RoleLoginRsp) {
        if (msg.errCode) {
            CC_DEBUG && cc.warn(`system error >>>> code: ${msg.errCode}, desc: `, ErrorManager.get(msg.errCode));
            SdkTool.tool.logerr();
            return;
        }
        this.serverModel.saveCurrent();
        this.model.token = msg.token;
        this.model.sessionId = msg.sessionId;
        this.model.serverOpenTime = msg.serverOpenTime;
        this.fsm.sendEvent(LoginFsmEventId.ENTER_GAME);
        if (CC_DEBUG) {
            let l = cc.sys.localStorage;
            l.setItem("name", msg.role.name);
        }
    }
}