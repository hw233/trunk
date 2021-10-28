import ConfigManager from '../../../../../common/managers/ConfigManager';
import { General_commanderCfg, SkillCfg } from '../../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/skill/CommanderSkillTipCtrl")
export default class CommanderSkillTipCtrl extends gdk.BasePanel {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.RichText)
    descLab: cc.RichText = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Label)
    lockDesc: cc.Label = null;

    /**显示技能信息 */
    showSkillInfo(skillId: number, lv: number, isLock: boolean = false) {
        let cfg = ConfigManager.getItemByField(General_commanderCfg, "skill_id", skillId, { skill_level: lv })
        let skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, { level: lv })
        this.nameLab.string = `${skillCfg.name}`
        this.descLab.string = `${cfg.describe}`
        this.lockDesc.string = `${cfg.unlock}`
        this.lockNode.active = isLock
    }
}
