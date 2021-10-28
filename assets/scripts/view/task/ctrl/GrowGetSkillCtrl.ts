import { General_commanderCfg, ItemCfg, Mission_grow_chapterCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import GeneralModel from '../../../common/models/GeneralModel';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import StringUtils from '../../../common/utils/StringUtils';
import PanelId from '../../../configs/ids/PanelId';

/**
 * @Description: 成长任务界面控制器
 * @Author: yaozu.hu
 * @Date: 2019-03-25 15:22:12
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-13 20:34:48
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/GrowGetSkillCtrl")
export default class GrowGetSkillCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null

    @property(cc.Node)
    skillNode: cc.Node = null

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Node)
    type: cc.Node = null

    @property(cc.RichText)
    desc: cc.RichText = null

    chapterId: number = 0
    _skillId = 0
    _skillLv = 0
    _skills = [99030, 99050, 99060]

    get model(): RoleModel {
        return ModelManager.get(RoleModel);
    }

    onEnable() {
        let args = this.args
        this.chapterId = args[0]
        this.updateInfo()
    }

    onDisable() {
        if (this._skills.indexOf(this._skillId) != -1) {
            this.model.activeSkill = { skillId: this._skillId, skillLv: this._skillLv }
            gdk.panel.hide(PanelId.GrowMenuView)

            let content = gdk.gui.layers.guideLayer
            let icon = cc.instantiate(this.icon.parent)
            icon.parent = content
            let tempPos = content.convertToNodeSpaceAR(this.icon.parent.convertToWorldSpaceAR(cc.v2(this.icon.x, this.icon.y)))
            icon.setPosition(tempPos)

            let dsz = cc.view.getVisibleSize();
            let endPos = cc.v2(-dsz.width / 2 + icon.width / 2, dsz.height / 2 - icon.height / 2)
            icon.runAction(cc.sequence(
                cc.spawn(cc.moveTo(0.5, endPos), cc.scaleTo(0.5, 0.5, 0.5)),
                cc.callFunc(() => {
                    icon.destroy()
                    if (this._skillId == 99030 && this._skillLv == 2) {
                        GuideUtil.activeGuide(`commandGetSkill#${this._skillId}#${this._skillLv}`)
                        return
                    }
                    gdk.panel.open(PanelId.MainSet)
                }, this),
            ));
        }
    }

    updateInfo() {
        JumpUtils.showGuideMask()
        this.spine.setAnimation(0, "stand2", false)
        this.spine.setAnimation(1, "stand", false)
        this.spine.setAnimation(2, "stand3", false)
        this.spine.setCompleteListener(() => {
            this.spine.addAnimation(2, "stand4", true)
            JumpUtils.hideGuideMask()
        })
        let cfg = ConfigManager.getItemById(Mission_grow_chapterCfg, this.chapterId)
        let itemCfg = ConfigManager.getItemById(ItemCfg, cfg.reward[0])
        this._skillId = itemCfg.func_args[0]
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getSkillIcon(this._skillId))

        let path = this._skills.indexOf(this._skillId) >= 0 ? "text_jinengqianghua" : "text_beidongjineng"
        GlobalUtil.setSpriteIcon(this.node, this.type, `common/texture/task/${path}`)

        let generalModel = ModelManager.get(GeneralModel)
        let skills = generalModel.generalInfo.skills
        this._skillLv = 2
        for (let i = 0; i < skills.length; i++) {
            if (skills[i].skillId == this._skillId) {
                this._skillLv = skills[i].skillLv
                break
            }
        }
        let skillCfg = ConfigManager.getItemByField(General_commanderCfg, "skill_id", this._skillId, { skill_level: this._skillLv })
        this.desc.string = StringUtils.setRichtOutLine(skillCfg.describe, "#000000", 2)
    }
}