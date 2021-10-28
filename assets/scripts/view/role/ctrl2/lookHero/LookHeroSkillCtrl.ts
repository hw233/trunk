import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import LookHeroSkillItemCtrl from './LookHeroSkillItemCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../main/skill/SkillInfoPanelCtrl';
import {
    Hero_awakeCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    SkillCfg
    } from '../../../../a/config';
/**
 * 查看英雄技能界面
 * @Author: luoyong
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 10:48:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/lookHero/LookHeroSkillCtrl")
export default class LookHeroSkillCtrl extends gdk.BasePanel {

    @property(cc.Node)
    skillNodes: cc.Node[] = [];

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Sprite)
    skillIcon: cc.Sprite = null;

    @property(cc.RichText)
    descText: cc.RichText = null;

    @property(cc.Node)
    tabBtns: cc.Node[] = [];
    @property(cc.Node)
    awakeSkill: cc.Node = null

    _awakeSkill: number = 0

    get model() { return ModelManager.get(HeroModel); }
    _heroImage: icmsg.HeroImage
    _heroCfg: HeroCfg
    _curType: number = 0 //0 塔防 1 卡牌

    onEnable() {
        this._heroImage = this.model.heroImage
        this._heroCfg = ConfigManager.getItemById(HeroCfg, this._heroImage.typeId);
        this._updateSkillInfo()
        this._updateAwakeSkill()
    }

    _updateAwakeSkill() {
        let heroCfg = ConfigManager.getItemById(HeroCfg, this._heroImage.typeId);
        this.awakeSkill.active = false
        this._awakeSkill = 0
        if (this._heroImage.star >= heroCfg.star_max && heroCfg.awake) {
            let awakeCfgs = ConfigManager.getItems(Hero_awakeCfg, { "hero_id": heroCfg.id })
            let maxAwakeCfg = awakeCfgs[awakeCfgs.length - 1]
            this.awakeSkill.active = true
            GlobalUtil.setSpriteIcon(this.node, cc.find("skillIcon", this.awakeSkill), GlobalUtil.getSkillIcon(maxAwakeCfg.ul_awake_skill[0]))
            this._awakeSkill = maxAwakeCfg.ul_awake_skill[0]
        }
    }

    openAwakeSkillTip() {
        if (this._awakeSkill > 0) {
            gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
                let comp = node.getComponent(SkillInfoPanelCtrl);
                comp.showSkillInfo(this._awakeSkill);
            });
        }
    }


    _updateSkillInfo() {
        this.tabBtns[0].active = this._curType == 0
        this.tabBtns[1].active = this._curType == 1
        this._updateGiftInfo()
        let findCareerId = this._heroImage.careerId
        // if (findCareerId == this._heroCfg.career_id) {
        //     let tempCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', findCareerId);
        //     findCareerId = tempCfg.career_id
        // }
        let ids = this._getShowSkills(findCareerId, this._curType == 1)
        for (let i = 0; i < this.skillNodes.length; i++) {
            let item = this.skillNodes[i]
            item.active = false
            if (ids[i]) {
                item.active = true
                let ctrl = item.getComponent(LookHeroSkillItemCtrl)
                ctrl.updateView(ids[i])
            }
        }
    }

    _getShowSkills(careerId, isCardSkill = false) {
        let lineIds = []
        let cfgs = this._getCareerLineSkills(careerId)
        for (let index = 0; index < cfgs.length; index++) {
            const cfg = cfgs[index]
            let ul_skill = cfg.ul_skill
            if (ul_skill && ul_skill.length > 0) {
                lineIds = [...lineIds, ...ul_skill]
            }
        }
        //要显示的技能
        let ids = []
        for (let i = 0; i < lineIds.length; i++) {
            let skillCfg = GlobalUtil.getSkillCfg(lineIds[i])
            if (skillCfg.show != 1 && skillCfg.show != 2 && skillCfg.show != 501 && ids.indexOf(lineIds[i]) == -1) {
                if (isCardSkill) {
                    if (HeroUtils.isCardSkill(lineIds[i])) {
                        ids.push(lineIds[i])
                    }
                } else {
                    if (!HeroUtils.isCardSkill(lineIds[i])) {
                        ids.push(lineIds[i])
                    }
                }
            }
        }
        ids.sort((a, b) => {
            return a - b
        })
        return ids
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

    _updateGiftInfo() {
        let starcfg = ConfigManager.getItemByField(Hero_starCfg, "star", this._heroImage.star);
        let skillCfg;
        let skillName;
        if (this._curType == 0) {
            let giftLv = this._heroCfg.group[0] == 6 ? 1 : starcfg.gift_lv;
            skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", this._heroCfg.gift_tower_id, { level: giftLv }) as SkillCfg;
            if (!skillCfg) {
                skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", this._heroCfg.gift_tower_id);
            }
            skillName = `${skillCfg.name}`;
        }
        this.nameLabel.string = skillName;
        this.descText.string = "";
        this.descText.string = `${skillCfg.des}`;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillCfg.skill_id))
    }

    onSkillTypeClick(e, index) {
        this._curType = parseInt(index)
        this._updateSkillInfo()
    }

}
