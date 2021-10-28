import ButtonSoundId from '../../../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StarItemCtrl from '../../../../../common/widgets/StarItemCtrl';
import {
    AttrCfg,
    Hero_careerCfg,
    Hero_lvCfg,
    HeroCfg,
    SoldierCfg
    } from '../../../../../a/config';
import { BagItem } from '../../../../../common/models/BagModel';
import { RoleEventId } from '../../../enum/RoleEventId';


/*
//升阶技能展示
 * @Author: luoyong 
 * @Date: 2020-02-27 10:32:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-04 01:24:55
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/RoleUpgradeSkillEffectCtrl")
export default class RoleUpgradeSkillEffectCtrl extends cc.Component {


    @property(cc.Node)
    skillNode: cc.Node = null

    @property(cc.Node)
    skillTitle: cc.Node = null

    @property(cc.RichText)
    skillDesc: cc.RichText = null

    @property(cc.Node)
    skillNameLayout: cc.Node = null

    @property(cc.Node)
    skillType: cc.Node = null

    @property(cc.Label)
    skillName: cc.Label = null

    @property(cc.Node)
    skillIconBg: cc.Node = null

    @property(sp.Skeleton)
    skillEffect: sp.Skeleton = null

    @property(cc.Node)
    skillIcon: cc.Node = null

    @property(cc.Node)
    maskNode: cc.Node = null

    heroData: BagItem = null
    careerId: number = 0
    level: number = 0
    upCfg: Hero_careerCfg = null
    curCfg: Hero_careerCfg = null
    heroCfg: HeroCfg = null

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    onLoad() {

    }

    onEnable() {
        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.advance);
        // JumpUtils.showGuideMask()
        this.maskNode.active = true

        this.heroData = HeroUtils.getHeroInfoBySeries(this.heroModel.heroCareerUpData.heroId)
        this.careerId = this.heroModel.heroCareerUpData.careerId
        this.level = this.heroModel.heroCareerUpData.careerLv

        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroData.itemId)

        this.upCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.careerId, { career_lv: this.level - 1 })
        let preCareerId = HeroUtils.getJobPreId(this.careerId)
        if (preCareerId != 0 && this.level == 0) {
            let maxLv = HeroUtils.getJobMaxLv(this.careerId)
            this.upCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", preCareerId, { career_lv: maxLv })
        }
        // if (this.heroModel.heroCareerBeforeTranData) {
        //     let lastCareerId = this.heroModel.heroCareerBeforeTranData.careerId
        //     let lastCareerLv = this.heroModel.heroCareerBeforeTranData.careerLv
        //     this.upCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", lastCareerId, { career_lv: lastCareerLv })
        // }
        this.curCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.careerId, { career_lv: this.level })

        this.skillNode.active = false
        let record = this.heroModel.heroCareerUpRecord
        let skillIndex = record["skill"] ? record["skill"] : 0;
        let ids = this._getShowSkillIds()
        if (skillIndex < ids.length) {
            this._updateSkillNode(skillIndex);
            record["skill"] = ++skillIndex;
            return
        }
    }

    //技能相关信息
    _updateSkillNode(skillIndex: number) {
        this.maskNode.active = true

        this.skillNode.active = true

        this.skillEffect.setAnimation(0, "stand", true)
        let ids = this._getShowSkillIds()
        let skillId = ids[skillIndex];
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillId))
        let skillCfg = GlobalUtil.getSkillCfg(skillId)
        this.skillName.string = skillCfg ? skillCfg.name : ""
        this.skillDesc.string = skillCfg ? skillCfg.des : "";

        let taPath = "view/role/texture/career2/juese_ta"
        let kaPath = "view/role/texture/career2/juese_ka"
        GlobalUtil.setSpriteIcon(this.node, this.skillType, HeroUtils.isCardSkill(skillId) ? kaPath : taPath)

        let ani = this.skillNode.getComponent(cc.Animation)
        ani.play()
        ani.on("finished", () => {
            this.maskNode.active = false
        }, this)

        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.popup);
    }

    //点击关闭 技能，有多的技能继续显示
    closeSkillNode() {
        this.skillNode.active = false
        let record = this.heroModel.heroCareerUpRecord
        let skillIndex = record["skill"] ? record["skill"] : 0;
        let ids = this._getShowSkillIds()
        if (skillIndex < ids.length) {
            this._updateSkillNode(skillIndex);
            record["skill"] = ++skillIndex;
        } else {
            gdk.panel.hide(PanelId.RoleUpgradeSkillEffect)
        }
    }

    _getShowSkillIds() {
        let ids = []
        if (this.curCfg.ul_skill && this.curCfg.ul_skill.length > 0) {
            for (let i = 0; i < this.curCfg.ul_skill.length; i++) {
                let skillCfg = GlobalUtil.getSkillCfg(this.curCfg.ul_skill[i])
                if (skillCfg && skillCfg && skillCfg.show && skillCfg.show == 1) {
                    continue
                }
                ids.push(this.curCfg.ul_skill[i])
            }
        }
        return ids
    }

    onDisable() {
        gdk.e.emit(RoleEventId.UPDATE_HERO_POWER)
        gdk.e.targetOff(this);
        this.unscheduleAllCallbacks()
        this.heroModel.heroCareerUpRecord = {};//最后一个清空记录
        this.heroModel.heroCareerBeforeTranData = null//清掉记录
    }
}