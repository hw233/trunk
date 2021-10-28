import BGameUtils from '../../../common/utils/BGameUtils';
import BSdkTool from '../../../sdk/BSdkTool';

/**
 * 预加载进入游戏的资源
 * @Author: sthoo.huang
 * @Date: 2021-07-08 11:07:26
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-28 13:45:11
 */
@gdk.fsm.action("PreloadGameAction", "Boot")
export default class PreloadGameAction extends gdk.fsm.FsmStateAction {

    onEnter() {
        if (!CC_BUILD) {
            this.finish();
            return;
        }
        this.loadBundle();
    }

    onExit() {
        gdk.Timer.clearAll(this);
    }

    loadBundle() {
        if (!this.active) return;
        if (!BSdkTool.loaded) {
            gdk.Timer.once(200, this, this.loadBundle);
            return;
        }
        cc.assetManager.loadBundle('scripts', (err: any) => {
            if (!this.active) return;
            if (!err) {
                // 预加载其他资源
                BGameUtils.preloadGameResource(this);
            }
            gdk.Timer.callLater(this, this.finish);
        });
    }
}