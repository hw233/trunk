import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-02 18:07:49 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/kfLogin/KfLoginBtnInfoCtrl")
export default class KfLoginBtnInfoCtrl extends cc.Component {
    // @property(cc.Label)
    // tipsLab: cc.Label = null;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    sysId: number = 2878;
    onEnable() {
        gdk.gui.onViewChanged.on(this._update, this);
    }

    onDisable() {
        gdk.gui.onViewChanged.off(this._update, this);
    }

    onClick() {
        if (!JumpUtils.ifSysOpen(this.sysId)) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ACTIVITY_TIME_TIP3'));
            this.node.active = false;
            return;
        }
        else {
            gdk.panel.open(PanelId.KfLoginView);
        }
    }

    @gdk.binding('roleModel.level')
    @gdk.binding('copyModel.lastCompleteStageId')
    @gdk.binding('actModel.kfLoginDaysReward')
    _update() {
        if (!cc.isValid(this.node)) return;
        this.node.active = JumpUtils.ifSysOpen(this.sysId) && !ActivityUtils.getKfLoginRewardsFinish();
    }
}
