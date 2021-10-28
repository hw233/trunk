/**
 * 登录界面相关的FSM事件定义
 * @Author: sthoo.huang
 * @Date: 2019-03-15 15:23:28
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-17 18:12:39
 */

export default class BootFsmEventId {
    static REQ_ENTER_GAME: string = "REQ_ENTER_GAME";
    static RSP_ENTER_FAIL: string = "RSP_ENTER_FAIL";
    static ENTER_GAME: string = "ENTER_GAME";
    static CONN_BREAK: string = "CONN_BREAK";
    static RETURN_LOGIN: string = "RETURN_LOGIN";
}

// 混合进FsmEventId类中
gdk.fsm.FsmEventId.mixins(BootFsmEventId);
