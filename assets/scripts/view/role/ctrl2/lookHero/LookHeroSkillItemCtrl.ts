import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../main/skill/SkillInfoPanelCtrl';
import { Hero_careerCfg, HeroCfg } from '../../../../a/config';

/**
 * @Description: 角色界面上方面板控制
 * @Author: luoyong
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 10:23:15
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/lookHero/LookHeroSkillItemCtrl")
export default class LookHeroSkillItemCtrl extends cc.Component {

    @property(cc.Node)
    lockBg: cc.Node = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Label)
    limitLab: cc.Label = null;

    get model() { return ModelManager.get(HeroModel); }
    _skillId: number = 0

    updateView(skillId) {
        this._skillId = skillId
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getSkillIcon(skillId))

        let unLock = false
        let skills = this.model.heroImage.skills
        if (skills.indexOf(skillId) != -1) {
            unLock = true
        }
        this.lockBg.active = !unLock;
        this.lockNode.active = !unLock
        if (!unLock) {
            let findCareerId = this.model.heroImage.careerId
            let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", findCareerId);
            let cfgs = this._getCareerLineSkills(findCareerId)
            for (let i = 0; i < cfgs.length; i++) {
                if (cfgs[i].ul_skill.indexOf(skillId) != -1) {
                    careerCfg = cfgs[i]
                    break
                }
            }
            let preCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerCfg.career_id, { career_lv: careerCfg.career_lv - 1 })
            if (preCfg) {
                this.limitLab.string = `${preCfg.hero_lv + 1}${gdk.i18n.t("i18n:HERO_TIP8")}`;
            } else {
                this.limitLab.string = `${careerCfg.hero_lv + 1}${gdk.i18n.t("i18n:HERO_TIP8")}`;
            }
        }
    }

    _getCareerLineSkills(careerId: number) {
        let cfgs: Hero_careerCfg[] = [];
        ConfigManager.getItems(Hero_careerCfg, function (cfg: Hero_careerCfg) {
            if (cfg.career_id == careerId) {
                if (cfg.ul_skill.length > 0) {
                    cfgs.push(cfg);
                }
            }
            return false;
        })
        return cfgs;
    }

    onButtonEvent() {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            let comp = node.getComponent(SkillInfoPanelCtrl);
            comp.showSkillInfo(this._skillId);
        });
    }

}
