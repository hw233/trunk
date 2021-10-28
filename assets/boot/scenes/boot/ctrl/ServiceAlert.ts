import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BPanelId from '../../../configs/ids/BPanelId';
import BSdkTool from '../../../sdk/BSdkTool';
import LoginSceneCtrl from './LoginSceneCtrl';

/** 
 * 游戏服务协议提示框
 * @Author: sthoo.huang  
 * @Date: 2021-03-05 17:17:38
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-05 18:22:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/login/ServiceAlert")
export default class ServiceAlert extends gdk.BasePanel {

    agreeFunc() {
        let panel = gdk.panel.get(BPanelId.LoginView);
        if (panel) {
            let ctrl = panel.getComponent(LoginSceneCtrl);
            if (ctrl) {
                ctrl.pkToggle.isChecked = true;
                ctrl.playerToggle.isChecked = true;
            }
        }
        BGlobalUtil.setLocal('login_pk_notice', true, false);
        BGlobalUtil.setLocal('login_player_notice', true, false);
        this.close();
    }

    userService() {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        BSdkTool.tool.userService();
    }

    privateService(): void {
        if (!BSdkTool.tool) return;
        if (!BSdkTool.tool.loaded) return;
        BSdkTool.tool.privateService();
    }
}
