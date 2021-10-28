import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ScoreSysHeroItemCtrl from './ScoreSysHeroItemCtrl';
import TaskModel from '../../model/TaskModel';
import { Score_recommendedCfg, SystemCfg } from '../../../../a/config';


/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-09 16:44:03
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysHeroZrItem3Ctrl")
export default class ScoreSysHeroZrItem3Ctrl extends cc.Component {

    @property(cc.Label)
    gainLab: cc.Label = null

    @property(cc.Label)
    lockLab: cc.Label = null

    @property(cc.Node)
    heroItem: cc.Node = null

    @property(cc.Node)
    btnGo: cc.Node = null

    _cfg: Score_recommendedCfg = null

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {

    }

    updateViewInfo(cfg: Score_recommendedCfg) {
        this._cfg = cfg
        this.gainLab.string = cfg.gain
        let ctrl = this.heroItem.getComponent(ScoreSysHeroItemCtrl)
        ctrl.updateViewInfo(cfg)

        let sysCfg = ConfigManager.getItemById(SystemCfg, cfg.forward)
        if (!sysCfg) {
            this.lockLab.node.active = false
            this.btnGo.active = false
        } else {
            let roleMode = ModelManager.get(RoleModel);
            let copyMode = ModelManager.get(CopyModel);
            let lvOpen = true;
            let fbOpen = true
            if (sysCfg.openLv) {
                lvOpen = roleMode.level >= sysCfg.openLv;
            }
            if (sysCfg.fbId) {
                fbOpen = copyMode.lastCompleteStageId >= sysCfg.fbId;
            }

            if (lvOpen && fbOpen) {
                this.lockLab.node.active = false
                this.btnGo.active = true
            } else {
                this.lockLab.node.active = true
                this.btnGo.active = false
                let openStr = ""
                let model = ModelManager.get(RoleModel);
                // 等级达不到要求
                if (model.level < sysCfg.openLv) {
                    let text = "指挥官" + "@level级解锁";
                    openStr += text.replace("@level", `${sysCfg.openLv}`);
                }

                // 已通过指定副本
                if (cc.js.isNumber(sysCfg.fbId) && sysCfg.fbId > 0 && !CopyUtil.isFbPassedById(sysCfg.fbId)) {
                    let text = GlobalUtil.getSysFbLimitStr(sysCfg.fbId);
                    openStr += `${openStr.length >= 1 ? '\n' : ''}` + text
                }
                this.lockLab.string = openStr
            }
        }
    }

    goFunc() {
        if (gdk.panel.isOpenOrOpening(PanelId.RoleSetUpHeroSelector)) {
            gdk.panel.hide(PanelId.RoleSetUpHeroSelector)
        }
        gdk.panel.hide(PanelId.ScoreSytemView)
        JumpUtils.openView(this._cfg.forward)
    }
}