/**
 * 登录界面相关的FSM事件定义
 * 需要在BootFsmEventId类中定义，此处只是获取已经定义的值
 * @Author: sthoo.huang
 * @Date: 2019-03-15 15:23:28
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-23 11:58:50
 */

function getValue(p: string): string {
    let d = gdk.fsm.FsmEventId;
    return d.getValue(d[p]);
};

export default class LoginFsmEventId {
    static REQ_ENTER_GAME = getValue('REQ_ENTER_GAME');
    static RSP_ENTER_FAIL = getValue('RSP_ENTER_FAIL');
    static ENTER_GAME = getValue('ENTER_GAME');
    static CONN_BREAK = getValue('CONN_BREAK');
    static RETURN_LOGIN = getValue('RETURN_LOGIN');
}
