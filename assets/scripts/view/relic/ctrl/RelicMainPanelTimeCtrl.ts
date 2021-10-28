import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ActivityCfg, SystemCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-05 14:56:49 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicMainPanelTimeCtrl")
export default class RelicMainPanelTimeCtrl extends cc.Component {
    @property(cc.Label)
    timeLab: cc.Label = null;

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    sysId: number = 2861;
    onEnable() {
        if (JumpUtils.ifSysOpen(this.sysId)) {
            this.node.active = false;
        }
        else {
            this._updateTime();
            this.schedule(this._updateTime, 1);
        }
    }

    onDisable() {
        this.unscheduleAllCallbacks();
    }

    _updateTime() {
        let cfg = ConfigManager.getItemById(SystemCfg, this.sysId);
        let actCfg = ConfigManager.getItem(ActivityCfg, (c: ActivityCfg) => {
            if (c.id == cfg.activity && Array.isArray(c.platform_id) && c.platform_id.indexOf(iclib.SdkTool.tool.config.platform_id) !== -1) return true;
        });
        if (!actCfg) {
            actCfg = ConfigManager.getItem(ActivityCfg, (c: ActivityCfg) => {
                if (c.id == cfg.activity && !c.platform_id) return true;
            });
        }
        let time = this.roleModel.CrossOpenTime * 1000;   //开服时间
        let startTime = time + (actCfg.open_time[2] * 24 * 60 * 60 + actCfg.open_time[3] * 60 * 60 + actCfg.open_time[4] * 60) * 1000;
        let d = startTime - GlobalUtil.getServerTime();
        if (d > 3 * 24 * 60 * 60 * 1000 || d <= 0) {
            this.node.active = false;
            this.unscheduleAllCallbacks();
        }
        else {
            this.timeLab.string = TimerUtils.format8(d / 1000) + gdk.i18n.t("i18n:RELIC_TIP5");
        }
    }
}
