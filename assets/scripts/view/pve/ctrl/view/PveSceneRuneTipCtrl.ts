import PveSceneCtrl from '../PveSceneCtrl';
import { Copy_stageCfg } from '../../../../a/config';
import { CopyType } from '../../../../common/models/CopyModel';

/** 
 * 符文副本副本时间限制提醒
 * @Author: yaozu.hu
 * @Date: 2020-10-10 11:16:18
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-10 11:44:35
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveSceneRuneTipCtrl")
export default class PveSceneRuneTipCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLb: cc.Label = null;

    onEnable() {

        let cfg: Copy_stageCfg;
        let panel = gdk.gui.getCurrentView();
        if (panel) {
            let ctrl = panel.getComponent(PveSceneCtrl);
            if (ctrl) {
                cfg = ctrl.model.stageConfig;
                if (cfg.copy_id != CopyType.Rune) {
                    cfg = null;
                }
            }
        }

        if (!cfg) {
            this.close();
            return;
        }

        this.timeLb.string = Math.floor(cfg.time / 60) + '';
        gdk.Timer.once(1500, this, () => {
            this.close();
        })
    }

    onDisable() {
        gdk.Timer.clearAll(this);
        this.timeLb.string = '';
    }

}
