import BLoginUtils from '../../../common/utils/BLoginUtils';

/**
 * 请求登录角色
 * @Author: sthoo.huang
 * @Date: 2019-03-28 19:46:19
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-20 03:23:32
 */
const { property } = cc._decorator;

@gdk.fsm.action("ReqLoginRoleAction", "Game")
export default class ReqLoginRoleAction extends gdk.fsm.FsmStateAction {

    onEnter() {
        BLoginUtils.reqLoginRole(this);
    }

    onExit() {
        BLoginUtils.reqLoginRoleOnExit(this);
    }
}