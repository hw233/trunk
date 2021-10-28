import BGameUtils from '../../../common/utils/BGameUtils';

/**
 * 断线重连服务器的动作
 * @Author: sthoo.huang
 * @Date: 2019-04-08 20:54:53
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-05-31 17:11:15
 */

@gdk.fsm.action("ReConnectServerAction", "Game")
export default class ReConnectServerAction extends gdk.fsm.FsmStateAction {

    onEnter() {
        gdk.gui.showWaiting('断线重连中', 'ConnBreak', null, null, this);
        BGameUtils.reconnectServer(this);
    }

    onExit() {
        gdk.gui.hideWaiting('ConnBreak');
        BGameUtils.reconnectServerOnExit(this);
    }
}