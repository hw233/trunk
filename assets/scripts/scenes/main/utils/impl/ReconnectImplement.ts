import ErrorManager from '../../../../common/managers/ErrorManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import LoginUtils from '../LoginUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import SdkTool from '../../../../sdk/SdkTool';
import ServerModel from '../../../../common/models/ServerModel';

/**
 * 断线重连动作实现类
 * @Author: sthoo.huang
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-20 01:58:06
 * @Last Modified time: 2021-03-24 16:32:08
 */
export default class ReconnectImplement {

    retry = 0;
    fsm: gdk.fsm.FsmStateAction;

    connect() {
        if (!this.fsm) return;
        if (!this.fsm.active) return;
        // 检查前端版本
        let skipCheck = [
            PanelId.PveScene,
            PanelId.Store,
            PanelId.GiftBuy,
            PanelId.FirstPayGift,
            PanelId.LimitGiftView,
            PanelId.MonthCard,
        ].some(i => gdk.panel.isOpenOrOpening(i));
        if (!skipCheck) {
            GlobalUtil.checkClientVer();
        }
        // 网络连接事件
        let conn = NetManager.conn;
        conn.onClose.on(this.onReconnectErrorHandle, this);
        conn.onOpen.on(this.onConnectSuccHandle, this);
        // 错误处理
        ErrorManager.on(105, this.onReconnectErrorHandle, this);
        ErrorManager.on([101, 102, 103, 104, 107], this.onReconnectRejectHadle, this);
        NetManager.on(icmsg.RoleReconnectRsp.MsgType, this.onReconnectRspHandle, this);
        NetManager.connect(ModelManager.get(ServerModel).current.addr, this.result, this);
    }

    result(err: any) {
        if (!this.fsm) return;
        if (!this.fsm.active) return;
        if (err) {
            return;
        }
        // 查询角色信息
        LoginUtils.reqLoginRole(this.fsm);
    };

    onConnectSuccHandle() {
        // CC_DEBUG && cc.log("连接服务器成功！");
    };

    onReconnectErrorHandle() {
        // 最大重试次数限制
        if (++this.retry > 60) {
            CC_DEBUG && cc.log('达到最大重试次数，退出到登录界面');
            SdkTool.tool.logout();
            return;
        }
        NetManager.conn.close();
        gdk.Timer.once(3000, this, this.connect);
    };

    onReconnectRejectHadle() {
        CC_DEBUG && cc.log('不允许登录此服务器，退出到登录界面');
        SdkTool.tool.logout();
    };

    onReconnectRspHandle(msg: icmsg.RoleReconnectRsp) {
        if (msg.succ) {
            // 重连成功，则完成当前动作
            CC_DEBUG && cc.log('重连成功');
            // 发送断线后发送失败的包
            NetManager.sendQueue();
            // 重连后请求更新的数据
            LoginUtils.sendReqList([
                icmsg.SystemHeartbeatReq,
                icmsg.MissionOnlineInfoReq,
            ], this.fsm.finish, this.fsm);
        } else {
            // 不允许直接重连，则退出到登录界面
            CC_DEBUG && cc.log('重连失败，退出到登录界面');
            SdkTool.tool.logout();
        }
    }

    onExit() {
        let conn = NetManager.conn;
        if (conn) {
            conn.onClose.targetOff(this);
            conn.onOpen.targetOff(this);
        }
        gdk.Timer.clearAll(this);
        ErrorManager.targetOff(this);
        NetManager.targetOff(this);
        NetManager.offcb(this.result, this);
        LoginUtils.reqLoginRoleOnExit(this.fsm);
        this.fsm = null;
        this.retry = 0;
    }
}