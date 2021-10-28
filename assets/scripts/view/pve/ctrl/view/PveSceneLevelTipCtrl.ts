import PveSceneCtrl from '../PveSceneCtrl';
import { Copysurvival_stageCfg } from '../../../../a/config';
import { CopyType } from './../../../../common/models/CopyModel';

/** 
 * PVE生存副本波次提醒
 * @Author: sthoo.huang
 * @Date: 2020-07-15 17:07:48
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-07-15 18:08:09
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveSceneLevelTipCtrl")
export default class PveSceneLevelTipCtrl extends gdk.BasePanel {

    @property(cc.Label)
    levelLb: cc.Label = null;

    onEnable() {

        let cfg: Copysurvival_stageCfg;
        let panel = gdk.gui.getCurrentView();
        if (panel) {
            let ctrl = panel.getComponent(PveSceneCtrl);
            if (ctrl) {
                cfg = ctrl.model.stageConfig as any;
                if (cfg.copy_id != CopyType.Survival) {
                    cfg = null;
                }
            }
        }

        if (!cfg) {
            this.close(-1);
            return;
        }

        this.levelLb.string = cfg.sort + '';
    }

    onDisable() {
        this.levelLb.string = '';
    }
}
