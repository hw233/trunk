import PvePool from '../../../utils/PvePool';
import PveSceneCtrl from '../../PveSceneCtrl';
import PveSceneModel from '../../../model/PveSceneModel';
import PveSkillModel from '../../../model/PveSkillModel';
import StringUtils from '../../../../../common/utils/StringUtils';
import { PveFightSkill } from '../../../model/PveBaseFightModel';

/** 
 * PVE回放指挥官技能列表项
 * @Author: sthoo.huang  
 * @Date: 2020-07-23 15:12:53
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-15 17:09:10
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/replay/GeneralSkillItemCtrl")
export default class GeneralSkillItemCtrl extends gdk.ItemRenderer {

    @property(cc.Label)
    text: cc.Label = null;
    @property(cc.Label)
    skillName: cc.Label = null;
    @property(cc.Label)
    remainEnergy: cc.Label = null;

    data: any[];  // [frameId, skill_id, pos_x, pos_y]

    get sceneModel(): PveSceneModel {
        let node = gdk.gui.getCurrentView();
        let ctrl = node.getComponent(PveSceneCtrl);
        if (ctrl) {
            return ctrl.model;
        }
    }

    updateView() {
        let skill: PveFightSkill;
        this.sceneModel.generals[0].model.skills.some(s => {
            if (s.id == this.data[1]) {
                skill = s;
                return true;
            }
            return false;
        });
        let time = this.data[5] || 0;
        this.text.string = StringUtils.format(gdk.i18n.t("i18n:PVE_GENERAL_SKILL_TIP1"), Math.floor(time / 60), Math.floor(time % 60))//`${Math.floor(time / 60)}分${Math.floor(time % 60)}秒释放`;
        this.skillName.string = `${skill.config.name}`;
        this.remainEnergy.string = StringUtils.format(gdk.i18n.t("i18n:PVE_GENERAL_SKILL_TIP2"), Math.floor(this.data[4] || 0))//`剩余能量 ${Math.floor(this.data[4] || 0)}`;
        this.node.targetOff(this);
    }

    // 播放指挥官技能
    playSkill() {
        let m = this.sceneModel;
        let action = this.data;
        let model: PveSkillModel = PvePool.get(PveSkillModel);
        let skill: PveFightSkill;
        let general = m.generals[0];
        general.model.skills.some(s => {
            if (s.id == action[1]) {
                skill = s;
                return true;
            }
            return false;
        });
        model.attacker = general;
        model.config = skill.prop;
        model.selectedTargets.length = 0;
        model.targetPos = cc.v2(action[2], action[3]);
        m.manualSkill = model;
    }
}