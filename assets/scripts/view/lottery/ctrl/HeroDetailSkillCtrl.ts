import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import { HBItemType } from './HBViewCtrl';
import {
    Hero_awakeCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    SkillCfg
    } from '../../../a/config';
/**
 * @Description: 查看英雄卡牌信息
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-15 14:15:42
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroDetailSkillCtrl")
export default class HeroDetailSkillCtrl extends gdk.BasePanel {

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
    careerNode: cc.Node = null;

    @property(cc.Node)
    careerNodeBg: cc.Node = null;

    @property(cc.Node)
    careerItems: cc.Node[] = [];

    @property(cc.Label)
    skillTypeLab: cc.Label = null;

    @property(cc.Node)
    awakeSkill: cc.Node = null

    _awakeSkill: number = 0
    _awakePreview: boolean = false;

    _curType: number = 0 //0 塔防 1 卡牌
    _heroCfg: HeroCfg
    _skillIds = []
    _careerLines = []
    _lineIndex: number = 0
    mysticState: number = 0; //0-normal 1-满领悟状态
    mysticLinkId: number = 0; //神秘者 链接英雄id

    get model() { return ModelManager.get(HeroModel); }

    onEnable() {

    }

    updateView(cfg: HeroCfg, hbInfo?: HBItemType) {
        this._heroCfg = cfg
        if (hbInfo) {
            this._lineIndex = hbInfo.careerLineIdx;
        }
        this._updateGiftInfo()
        this._updateSkillInfo()
        this._updateAwakeSkill()
    }

    _updateAwakeSkill() {
        //let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        this.awakeSkill.active = false
        this._awakeSkill = 0
        if (this._heroCfg.awake && this._awakePreview) {
            let awakeCfgs = ConfigManager.getItems(Hero_awakeCfg, { "hero_id": this._heroCfg.id })
            let maxAwakeCfg = awakeCfgs[awakeCfgs.length - 1]
            this.awakeSkill.active = true
            GlobalUtil.setSpriteIcon(this.node, cc.find("skillIcon", this.awakeSkill), GlobalUtil.getSkillIcon(maxAwakeCfg.ul_awake_skill[0]))
            this._awakeSkill = maxAwakeCfg.ul_awake_skill[0]
        }
    }

    openAwakeSkillTip() {
        if (this._awakeSkill > 0 && this._awakePreview) {
            gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
                let comp = node.getComponent(SkillInfoPanelCtrl);
                comp.showSkillInfo(this._awakeSkill);
            });
        }
    }

    _updateSkillInfo() {
        this._careerLines = [...ModelManager.get(HeroModel).careerInfos[this._heroCfg.id]];
        GlobalUtil.sortArray(this._careerLines, (a, b) => {
            return a - b
        })
        this.careerNode.active = this._careerLines.length > 1
        this._skillIds = this._getShowSkills(this._careerLines[this._lineIndex], this._curType == 1)
        for (let i = 0; i < this.skillNodes.length; i++) {
            let item = this.skillNodes[i]
            item.active = false
            if (this._skillIds[i]) {
                item.active = true
                let icon = item.getChildByName("icon")
                let lvNode = item.getChildByName('lvNode');
                let mysticFrame = item.getChildByName('mysticBg');
                let mysticSpine = item.getChildByName('spine');
                GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getSkillIcon(this._skillIds[i]))
                lvNode.active = this._heroCfg.group[0] == 6;
                mysticSpine.active = false;
                if (lvNode.active) {
                    let lv = this.mysticState == 1 ? 5 : 1;
                    lvNode.getChildByName('lv').getComponent(cc.Label).string = lv + '';
                    if (lv == 5) {
                        mysticSpine.active = true;
                    }
                }
                if (mysticFrame) {
                    mysticFrame.active = this._heroCfg.group[0] == 6;
                }
            }

            //技能确认
            if (i == this.skillNodes.length - 1 && this._careerLines.length == 1) {
                let skillCfg = GlobalUtil.getSkillCfg(this._skillIds[i])
                if (item.active && skillCfg.type != 501) {
                    item.active = false
                }
            }
        }

        if (this._careerLines.length > 1) {
            let leftCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._careerLines[0])
            let rightCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._careerLines[1])
            if (this._lineIndex == 0) {
                this._updateCareerNode(this.careerItems[0], leftCfg.career_type)
                this._updateCareerNode(this.careerItems[1], rightCfg.career_type, true)
                this.careerNodeBg.scaleX = 1
            } else {
                this._updateCareerNode(this.careerItems[0], leftCfg.career_type, true)
                this._updateCareerNode(this.careerItems[1], rightCfg.career_type)
                this.careerNodeBg.scaleX = -1
            }
        }

        this.model.bookSelectCareerId = this._careerLines[this._lineIndex]
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
        let superIds = []
        for (let i = 0; i < lineIds.length; i++) {
            let skillCfg = GlobalUtil.getSkillCfg(lineIds[i])
            if (skillCfg.show != 1 && skillCfg.show != 2 && ids.indexOf(lineIds[i]) == -1) {
                if (isCardSkill) {
                    if (HeroUtils.isCardSkill(lineIds[i])) {
                        if (skillCfg.type == 501) {
                            superIds.push(lineIds[i])
                        } else {
                            ids.push(lineIds[i])
                        }
                    }
                } else {
                    if (!HeroUtils.isCardSkill(lineIds[i])) {
                        if (skillCfg.type == 501) {
                            superIds.push(lineIds[i])
                        } else {
                            ids.push(lineIds[i])
                        }
                    }
                }
            }
        }
        ids.sort((a, b) => {
            return a - b
        })
        return ids.concat(superIds)
    }

    _getCareerLineSkills(careerId: number) {
        let type = Math.floor(careerId / 100);
        let cfgs: Hero_careerCfg[] = [];
        ConfigManager.getItems(Hero_careerCfg, function (cfg: Hero_careerCfg) {
            if (Math.floor(cfg.career_id / 100) == type) {
                if (cfg.ul_skill.length > 0) {
                    cfgs.push(cfg);
                }
            }
            return false;
        })
        return cfgs;
    }

    _updateGiftInfo() {
        this.tabBtns[0].active = this._curType == 0
        this.tabBtns[1].active = this._curType == 1

        let starcfg = ConfigManager.getItemByField(Hero_starCfg, "star", this._heroCfg.star_max);
        let skillCfg;
        let skillName;
        if (this._curType == 0) {
            let giftLv = this._heroCfg.group[0] == 6 || !this._awakePreview ? 1 : starcfg.gift_lv;
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
        this._updateGiftInfo()
        this._updateSkillInfo()
        this.showBtnAction()
    }

    showBtnAction() {
        this.tabBtns[1].stopAllActions()
        this.skillTypeLab.node.stopAllActions()
        if (this._curType == 0) {
            this.tabBtns[0].active = true
            this.tabBtns[0].x = -55
            this.tabBtns[0].scale = 0.1
            this.tabBtns[0].runAction(cc.spawn(cc.moveTo(0.2, 0, 0), cc.scaleTo(0.2, 1, 1)))

            this.tabBtns[1].active = true
            this.tabBtns[1].runAction(cc.spawn(cc.moveTo(0.2, 55, 0), cc.scaleTo(0.2, 0.1, 0.1)))
        } else {
            this.tabBtns[1].active = true
            this.tabBtns[1].x = -55
            this.tabBtns[1].runAction(cc.spawn(cc.moveTo(0.2, 0, 0), cc.scaleTo(0.2, 1, 1)))

            this.tabBtns[0].active = true
            this.tabBtns[0].runAction(cc.spawn(cc.moveTo(0.2, 55, 0), cc.scaleTo(0.2, 0.1, 0.1)))
        }
        this.skillTypeLab.node.opacity = 255
        this.skillTypeLab.string = this._curType == 0 ? gdk.i18n.t("i18n:LOTTERY_TIP29") : gdk.i18n.t("i18n:LOTTERY_TIP30")
        this.skillTypeLab.node.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(1)))
    }

    onShowSkillTip(e, index) {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            let comp = node.getComponent(SkillInfoPanelCtrl);
            if (this._heroCfg.group[0] == 6) {
                let lv = this.mysticState == 1 ? 5 : 1;
                comp.showSkillInfo(this._skillIds[index], lv);
            }
            else {
                comp.showSkillInfo(this._skillIds[index]);
            }
        });
    }

    onSwitchCareer() {
        if (this._careerLines.length > 1) {
            if (this._lineIndex == 0) {
                this._lineIndex = 1
            } else {
                this._lineIndex = 0
            }
            this.model.bookSelectCareerId = this._careerLines[this._lineIndex]
            this._updateGiftInfo()
            this._updateSkillInfo()
        }
    }

    _updateCareerNode(node: cc.Node, careerType: number, isGray: boolean = false) {
        let icon = node.getChildByName("icon");
        icon.scale = 0.9;
        let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
        let path = `common/texture/soldier/${nameArr[careerType - 1]}`;
        GlobalUtil.setSpriteIcon(this.node, icon, path);
        GlobalUtil.setGrayState(icon, isGray ? 1 : 0)
    }

    onSwitchAwakeState(v: boolean) {
        this._awakePreview = v;
        this._updateGiftInfo();
        this._updateAwakeSkill();
    }
}