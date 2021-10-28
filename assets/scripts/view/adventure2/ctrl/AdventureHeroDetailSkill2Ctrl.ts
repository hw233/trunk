import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { HBItemType } from '../../lottery/ctrl/HBViewCtrl';
import {
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    SkillCfg
    } from '../../../a/config';


/**
 * @Description: 查看巅峰之战英雄技能信息
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 10:47:48
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureHeroDetailSkill2Ctrl")
export default class AdventureHeroDetailSkill2Ctrl extends gdk.BasePanel {

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

    _curType: number = 0 //0 塔防 1 卡牌
    _heroCfg: HeroCfg
    _skillIds = []
    _careerLines = []
    _lineIndex: number = 0

    curType: number = 1;//1自己英雄详情 2其他人英雄详情 3转换池英雄详情
    get model() { return ModelManager.get(HeroModel); }
    get adModel() { return ModelManager.get(NewAdventureModel); }
    series: number;
    onEnable() {

    }

    updateView(series: number, cfg: HeroCfg, curType: number, hbInfo?: HBItemType) {
        this.curType = curType;
        this._heroCfg = cfg;
        this.series = series
        if (hbInfo) {
            this._lineIndex = hbInfo.careerLineIdx;
        }
        this._updateGiftInfo()
        this._updateSkillInfo()
    }


    _updateSkillInfo() {
        this._careerLines = [...ModelManager.get(HeroModel).careerInfos[this._heroCfg.id]];
        GlobalUtil.sortArray(this._careerLines, (a, b) => {
            return a - b
        })
        this.careerNode.active = this._careerLines.length > 1 && this.curType == 1;
        this._skillIds = this._getShowSkills(this._careerLines[this._lineIndex], this._curType == 1)
        for (let i = 0; i < this.skillNodes.length; i++) {
            let item = this.skillNodes[i]
            item.active = false
            if (this._skillIds[i]) {
                item.active = true
                let icon = item.getChildByName("icon")
                GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getSkillIcon(this._skillIds[i]))
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

        let starcfg = ConfigManager.getItemByField(Hero_starCfg, "star", this._heroCfg.star_min);
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
            comp.showSkillInfo(this._skillIds[index]);
        });
    }

    onSwitchCareer() {

        if (this._careerLines.length > 1) {

            if (this._lineIndex == 0) {
                this._lineIndex = 1
            } else {
                this._lineIndex = 0
            }
            let temCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._careerLines[this._lineIndex])
            //this.peakModel.bookSelectCareerId = this._careerLines[this._lineIndex]
            //发送切换职业消息

            let msg = new icmsg.Adventure2HeroCareerReq()
            msg.careerId = temCfg.career_id;
            msg.heroId = this.series//this._heroCfg.id;
            NetManager.send(msg, (rsp: icmsg.Adventure2HeroCareerRsp) => {
                //刷新数据;
                this.adModel.normal_giveHeros.forEach(data => {
                    if (data.heroId == rsp.heroId) {
                        data.careerId = rsp.careerId;
                        let temCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', rsp.careerId)
                        data.soldierId = temCfg.career_type * 100 + 1
                    }
                })
                gdk.e.emit(ActivityEventId.ACTIVITY_PEAK_CHANGE_CAREER_UPDATE)
                //this.peakModel.bookSelectCareerId = this._careerLines[this._lineIndex]
                this._updateGiftInfo()
                this._updateSkillInfo()
            }, this)
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
}