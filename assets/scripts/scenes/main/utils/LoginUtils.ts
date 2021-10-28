import ErrorManager from '../../../common/managers/ErrorManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import LoginFsmEventId from '../enum/LoginFsmEventId';
import LoginModel from '../../../common/models/LoginModel';
import NetManager from '../../../common/managers/NetManager';
import SdkTool from '../../../sdk/SdkTool';

/** 
 * @Description: 登录工具类
 * @Author: weiliang.huang  
 * @Date: 2019-04-08 16:37:02 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-25 16:41:25
 */
const LoginUtils = iclib.LoginUtils;
cc.js.mixin(LoginUtils, {

    /** 请求角色登录 */
    reqLoginRole(thiz: gdk.fsm.FsmStateAction): boolean {
        var model: LoginModel = this.loginModel;
        var msg: icmsg.RoleLoginReq = new icmsg.RoleLoginReq();
        msg.account = model.account;
        // 如果外部参数有serverId，则优先使用
        let sid = GlobalUtil.getUrlValue('sid');
        if (sid && sid != '') {
            msg.serverId = parseInt(sid);
        } else {
            msg.serverId = this.serverModel.current.serverId;
        }
        msg.channelId = model.channelId;
        msg.channelCode = model.channelCode;
        if (model.token) {
            msg.token = model.token;
            msg.sessionId = model.sessionId;
        }
        msg.brand = model.brand;   // 手机品牌;
        msg.model = model.model;   // 手机机型;
        // 监听登录失败错误代码
        ErrorManager.once([101, 102, 103, 104, 106], () => {
            CC_DEBUG && cc.log('不允许登录此服务器，连接失败');
            ErrorManager.targetOff(thiz);
            thiz.sendEvent(LoginFsmEventId.CONN_BREAK);
        }, thiz);
        ErrorManager.once([141, 142, 143, 144, 145, 146, 199], () => {
            CC_DEBUG && cc.log('登录出现错误');
            ErrorManager.targetOff(thiz);
            SdkTool.tool.logerr();
        }, thiz);
        let ret = NetManager.send(msg, (data: icmsg.RoleLoginRsp) => {
            ErrorManager.targetOff(thiz);
            if (data.role.level <= 1 &&
                data.role.score.exp == 0 &&
                data.role.score.heroExp == 0) {
                // 等级小于等级1级，经验为0，则为新号
                SdkTool.tool.createRole();
            }
            SdkTool.tool.enterGame();
        });
        if (!ret) {
            CC_DEBUG && cc.log('登录服务器失败');
            ErrorManager.targetOff(thiz);
            thiz.sendEvent(LoginFsmEventId.CONN_BREAK);
            return false;
        }
        return true;
    },
    reqLoginRoleOnExit(thiz: gdk.fsm.FsmStateAction) {
        ErrorManager.targetOff(thiz);
    },

    /**
     * 发送请求队列，所有请求得到回应后回调cb函数
     * @param arr 
     * @param cb 
     * @param thisArg 
     * @param setSingle 
     */
    sendReqList(arr: { new() }[], cb?: Function, thisArg?: any, setSingle?: boolean) {
        let count = arr.length;
        arr.forEach(clz => {
            if (clz) {
                // 消息类有效的情况
                if (setSingle) {
                    NetManager.addSingleQueuMsg(clz['MsgType']);
                }
                NetManager.send(new clz(), cb ? () => {
                    (--count == 0) && cb.call(thisArg);
                } : null, thisArg);
            } else if (cb) {
                // 可能消息已经被废弃
                (--count == 0) && cb.call(thisArg);
            }
        });
    },
});

export default LoginUtils;