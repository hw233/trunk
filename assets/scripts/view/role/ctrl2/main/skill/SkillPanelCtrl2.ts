import BagUtils from '../../../../../common/utils/BagUtils';
import ButtonSoundId from '../../../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import ErrorManager from '../../../../../common/managers/ErrorManager';
import GiftSkillInfoPanelCtrl from './GiftSkillInfoPanelCtrl';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import ResonatingModel from '../../../../resonating/model/ResonatingModel';
import RoleModel from '../../../../../common/models/RoleModel';
import SkillInfoPanelCtrl from './SkillInfoPanelCtrl';
import SkillItemCtrl2, { SkillData } from './SkillItemCtrl2';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import UpgradeCostItemCtrl2 from '../career/UpgradeCostItemCtrl2';
import {
    Hero_awakeCfg,
    Hero_careerCfg,
    Hero_lvCfg,
    Hero_starCfg,
    HeroCfg,
    SkillCfg
    } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';


/**
 * @Description: 角色界面上方面板控制
 * @Author: chengyou.lin
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 11:01:19
 */

enum MainType {
    PVE = 0,
    PVP = 1
}

enum CareerResType {
    PIKEMAN = 1,
    UNKOWN = 2,
    ARTILLERY = 3,
    GUARD = 4,
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/skill/SkillPanelCtrl2")
export default class SkillPanelCtrl2 extends gdk.BasePanel {

    @property(cc.Node)
    skillNodes: cc.Node[] = [];

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Node)
    typeIcon: cc.Node = null;

    @property(cc.Label)
    typeLab: cc.Label = null;

    @property(cc.Sprite)
    skillIcon: cc.Sprite = null;
    @property(cc.RichText)
    descText: cc.RichText = null;
    @property(cc.Node)
    tabBtns: cc.Node[] = [];

    @property(cc.Node)
    careerNode: cc.Node = null;
    @property(cc.Sprite)
    careerBg: cc.Sprite = null;
    @property(cc.Node)
    careerItems: cc.Node[] = [];

    @property(cc.Node)
    typeRedPoint: cc.Node = null;

    @property(cc.Node)
    expBtn: cc.Node = null

    @property(cc.Node)
    expLayout: cc.Node = null

    @property(cc.Node)
    upgradeCostItems: cc.Node[] = []

    @property(cc.Node)
    upgradeTip: cc.Node = null

    @property(cc.Label)
    skillTypeLab: cc.Label = null;

    @property(cc.Label)
    btnLab: cc.Label = null;

    @property(cc.Node)
    awakeSkill: cc.Node = null

    @property(cc.Node)
    expNode: cc.Node = null;

    @property(cc.Node)
    geneConnectNode: cc.Node = null;

    _awakeSkill: number = 0
    //是pve还是pvp
    _mainType: MainType = MainType.PVE;
    _lineType: number = 0;
    cfgs: Hero_careerCfg[];
    _upgradeLv = 1
    typeLineDatas: SkillData[][][];
    typeLineSkillId: number[][][];

    get model() { return ModelManager.get(HeroModel); }
    get heroInfo() { return this.model.curHeroInfo; }
    get roleModel() { return ModelManager.get(RoleModel); }
    get resonatingModel() { return ModelManager.get(ResonatingModel); }
    onEnable() {
        this.setMainType(this._mainType);
        // NetManager.on(ItemUpdateRsp.MsgType, this._updateChipItems, this);
        NetManager.on(icmsg.HeroDetailRsp.MsgType, this.onHeroDetailRsp, this)
        NetManager.on(icmsg.HeroMysticSkillUpRsp.MsgType, this._onMysticSkillUpRsp, this)
        this.expBtn.on(cc.Node.EventType.TOUCH_START, this._expBtnTouchStart, this);
        // this.expBtn.on(cc.Node.EventType.TOUCH_END, this._expBtnTouchEnd, this);
        // this.expBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._expBtnTouchEnd, this);
        // ErrorManager.on(125, this._expBtnTouchEnd, this);

        if (this.resonatingModel.getHeroInUpList(this.heroInfo.heroId)) {
            GlobalUtil.setAllNodeGray(this.expBtn, 1)
        } else {
            GlobalUtil.setAllNodeGray(this.expBtn, 0)
        }

        this._updateGeneConnect();
        gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateExpr, this);
    }

    onHeroDetailRsp() {
        if (!this.model) return;
        if (!this.model.curHeroInfo) return;
        this._updateHero(this.model.curHeroInfo);
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        ErrorManager.targetOff(this);
        gdk.Timer.clearAll(this)
    }

    setMainType(type: MainType, showEffect: boolean = false) {
        this._mainType = type;
        if (showEffect) {
            this.tabBtns[0].stopAllActions()
            this.tabBtns[1].stopAllActions()
            this.skillTypeLab.node.stopAllActions()
            if (type == MainType.PVE) {
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
            this.skillTypeLab.string = type == MainType.PVE ? gdk.i18n.t("i18n:LOTTERY_TIP29") : gdk.i18n.t("i18n:LOTTERY_TIP30")
            this.skillTypeLab.node.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(1)))
        } else {
            this.tabBtns[0].active = type == MainType.PVE
            this.tabBtns[1].active = type == MainType.PVP
            this.skillTypeLab.node.opacity = 0
        }


        this._updateMainType();
        this._updateLineType();
    }

    onPveBtnClick() {
        this.setMainType(MainType.PVE, true);
    }

    onPvpBtnClick() {
        this.setMainType(MainType.PVP, true);
    }

    onCareerBtnClick() {
        gdk.panel.open(PanelId.RoleChangeCareer2);
    }

    getCareerLineSkills(careerId: number) {
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

    _onMysticSkillUpRsp() {
        if (!cc.isValid(this.node) || !this.node.active) {
            return;
        }
        if (!this.model.curHeroInfo) {
            return;
        }
        this._updateLineType();
    }

    /**更新英雄信息 */
    @gdk.binding("model.curHeroInfo")
    _updateHero(curHero: icmsg.HeroInfo) {
        if (!cc.isValid(this.node) || !this.node.active) {
            return;
        }
        if (!curHero) {
            return;
        }
        let heroId = curHero.heroId;
        let detail = HeroUtils.getHeroDetailById(heroId);
        if (!detail) {
            let msg = new icmsg.HeroDetailReq()
            msg.heroId = curHero.heroId
            NetManager.send(msg)
            return;
        }
        this._updateConfigs(curHero);
        this._updateMainType();
        this.findFirstShowLine();
        this._updateLineType();
        this._updateExpr()
        this._updateUpgradeTip()
        this._updateAwakeSkill()
        this._updateGeneConnect();
    }

    _updateAwakeSkill() {
        let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        this.awakeSkill.active = false
        this._awakeSkill = 0
        if (this.heroInfo.star >= heroCfg.star_max && heroCfg.awake) {
            let awakeCfgs = ConfigManager.getItems(Hero_awakeCfg, { "hero_id": heroCfg.id })
            let maxAwakeCfg = awakeCfgs[awakeCfgs.length - 1]
            this.awakeSkill.active = true
            GlobalUtil.setSpriteIcon(this.node, cc.find("skillIcon", this.awakeSkill), GlobalUtil.getSkillIcon(maxAwakeCfg.ul_awake_skill[0]))
            this._awakeSkill = maxAwakeCfg.ul_awake_skill[0]
        }
    }

    /**更新经验信息 */
    _updateExpr() {
        let list = ConfigManager.getItems(Hero_lvCfg);
        let costItems = []
        let curLv: number = this.heroInfo.level;
        if (list[curLv - 1]) {
            costItems = list[curLv - 1].cost
        } else {
            CC_DEBUG && cc.error("等级" + curLv + "缺乏配置")
            return
        }

        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId, { career_lv: this.heroInfo.careerLv })
        let heroLvCfg = ConfigManager.getItemById(Hero_lvCfg, this.heroInfo.level)
        if (heroLvCfg && heroLvCfg.clv <= this.heroInfo.careerLv) {
            if (careerCfg && this.heroInfo.level >= careerCfg.hero_lv) {
                costItems = careerCfg.career_item1
            }
        }
        for (let i = 0; i < this.upgradeCostItems.length; i++) {
            if (costItems[i]) {
                this.upgradeCostItems[i].active = true
                let ctrl = this.upgradeCostItems[i].getComponent(UpgradeCostItemCtrl2)
                ctrl.updateItemInfo(costItems[i][0], costItems[i][1])
            } else {
                this.upgradeCostItems[i].active = false
            }
        }
        this._updateBtnState()
    }

    _updateUpgradeTip() {
        this.expLayout.active = true
        this.upgradeTip.active = false

        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId, { career_lv: this.heroInfo.careerLv })
        let heroLvCfg = ConfigManager.getItemById(Hero_lvCfg, this.heroInfo.level)
        if (heroLvCfg && heroLvCfg.clv <= this.heroInfo.careerLv) {
            if (careerCfg && this.heroInfo.level >= careerCfg.hero_lv) {
                let starCfg = ConfigManager.getItemById(Hero_starCfg, this.heroInfo.star)
                if (this.heroInfo.careerLv >= starCfg.career_lv) {
                    this.expLayout.active = false
                    this.upgradeTip.active = true
                }
            }
        } else {
            this.expLayout.active = false
            this.upgradeTip.active = true
        }
        let temLabel = this.upgradeTip.getComponent(cc.Label);
        if (this.resonatingModel.getHeroInUpList(this.heroInfo.heroId)) {
            temLabel.string = gdk.i18n.t("i18n:HERO_TIP53")
            this.expLayout.active = false
            this.upgradeTip.active = true
        } else if (this.upgradeTip.active) {
            temLabel.string = gdk.i18n.t("i18n:HERO_TIP54")//"英雄等级已达上限"
        }
    }

    _updateConfigs(curHero: icmsg.HeroInfo) {
        let heroId = curHero.heroId;
        let detail = HeroUtils.getHeroDetailById(heroId);
        let cfgs = this.getCareerLineSkills(curHero.careerId);
        let typeLineDatas: SkillData[][][] = [[], []];
        for (let i = 0; i < cfgs.length; i++) {
            const cfg = cfgs[i];
            let isOpen = false;
            if (curHero.careerLv >= cfg.career_lv) {
                isOpen = true;
            }
            let line = cfg.line
            for (let skillId of cfg.ul_skill) {
                let type = HeroUtils.isCardSkill(skillId) ? 1 : 0;
                let lineDatas = typeLineDatas[type];
                let lineData = lineDatas[line];
                if (!lineData) {
                    lineData = [];
                    lineDatas[line] = lineData;
                }
                if (lineData.indexOf(skillId) >= 0) {
                    cc.log("_updateConfigs发现重复的skillId =", skillId);
                    continue;
                }
                let career_type = lineData['career_type'];
                if (career_type != cfg.career_type) {
                    if (career_type) {
                        cc.log("_updateConfigs发现职业类型冲突");
                    }
                    lineData['career_type'] = cfg.career_type;
                }

                let skillCfg;
                if (type == 0) {
                    skillCfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', skillId);
                }
                if (!skillCfg) {
                    cc.error(`技能-${skillId}未找到配置数据`);
                    continue;
                }

                let data = new SkillData;
                data.line = line;
                data.type = type;
                data.skillId = skillId;
                data.careerCfg = cfg;
                data.unLock = isOpen;
                data.skillCfg = skillCfg;
                if (skillCfg.show != 1 && skillCfg.type != 501 && skillCfg.show != 2) {
                    lineData.push(data);
                }
            }
        }
        this.typeLineDatas = typeLineDatas;
    }

    findFirstShowLine() {
        let careers = this.model.careerInfos[this.heroInfo.typeId]
        let isSingleLine = careers.length == 1
        if (isSingleLine) {
            return;
        }
        //选择选中的职业线
        this._lineType = 0;
        let careerId = this.heroInfo.careerId;
        for (let i = 0; i < careers.length; i++) {
            if (careerId == careers[i]) {
                this._lineType = i;
                break;
            }
        }
    }


    _updateMainType() {
        if (!this.typeLineDatas) {
            return;
        }
        let heroInfo = this.heroInfo;
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
        let starcfg = ConfigManager.getItemByField(Hero_starCfg, "star", heroInfo.star);

        let skillCfg;
        let skillName;
        let typePath = ""
        let typeStr = ""
        if (this._mainType == MainType.PVE) {
            let giftLv = heroCfg.group[0] == 6 ? 1 : starcfg.gift_lv;
            skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id, { level: giftLv }) as SkillCfg;
            if (!skillCfg) {
                let cfgs = ConfigManager.getItemsByField(SkillCfg, "skill_id", heroCfg.gift_tower_id);
                skillCfg = cfgs[cfgs.length - 1];
            }
            skillName = `${skillCfg.name}`;
            // typePath = "view/role/texture/career2/juese_ta"
            // typeStr = `塔防)`
        }
        this.nameLabel.string = skillName;
        GlobalUtil.setSpriteIcon(this.node, this.typeIcon, typePath)
        this.typeLab.string = typeStr

        this.descText.string = "";
        this.descText.string = `${skillCfg.des}`;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillCfg.skill_id))

        let isSingleLine = this.model.careerInfos[heroInfo.typeId].length == 1
        this.careerNode.active = !isSingleLine;
        if (isSingleLine) {
            return;
        }
        let isSame = true
        let careers = this.model.careerInfos[heroInfo.typeId]
        let career_type = 0
        for (let i = 0; i < careers.length; i++) {
            let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careers[i])
            career_type = careerCfg.career_type
            if (careers[i] == this.model.curHeroInfo.careerId) {
                this._updateCareerNode(this.careerItems[0], career_type)
            } else {
                isSame = false
                this._updateCareerNode(this.careerItems[1], career_type, true)
            }
        }
        if (isSame) {
            this._updateCareerNode(this.careerItems[1], career_type, true)
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

    openGiftSkillTips() {
        let heroInfo = this.heroInfo;
        let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
        let starcfg = ConfigManager.getItemByField(Hero_starCfg, "star", heroInfo.star);
        let giftLv = heroCfg.group[0] == 6 ? 1 : starcfg.gift_lv;
        let skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id, { level: giftLv }) as SkillCfg;
        if (skillCfg) {
            gdk.panel.open(PanelId.GiftSkillInfoPanel, (node: cc.Node) => {
                let comp = node.getComponent(GiftSkillInfoPanelCtrl)
                comp.showSkillInfo(skillCfg.skill_id, skillCfg.level)
            })
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

    _updateLineType() {
        if (!this.typeLineDatas) {
            return;
        }
        let lineDatas = this.typeLineDatas[this._mainType];
        let isSingleLine = !lineDatas[1];
        if (isSingleLine) {
            this._updateSkillList(lineDatas[0]);
            this.updateRedPoints();
            return;
        }

        let lineType = this._lineType;
        this._updateSkillList(lineDatas[lineType]);
        this.updateRedPoints();
    }

    _updateSkillList(skillDatas: SkillData[]) {
        let isMysticHero = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId).group[0] == 6;
        for (let i = 0; i < this.skillNodes.length; i++) {
            let skillNode = this.skillNodes[i];
            let skillData = skillDatas[i];
            if (skillData) {
                if (isMysticHero) {
                    skillData.skillLv = this.heroInfo.mysticSkills[i] || 1;
                }
                skillNode.active = true;
                let ctrl = skillNode.getComponent(SkillItemCtrl2);
                ctrl.updateView(skillData);
            } else {
                skillNode.active = false;
            }
        }
    }

    updateRedPoints() {
        let activeSkillIds = this.model.activeHeroSkillIds[this.heroInfo.heroId] as number[];
        this.typeRedPoint.active = false;
        if (!activeSkillIds || activeSkillIds.length == 0) {
            return;
        }
        for (let i = 0; i < activeSkillIds.length; i++) {
            const skillId = activeSkillIds[i];
            if (HeroUtils.isCardSkill(skillId)) {
                this.typeRedPoint.active = true;
            }
        }

        if (this._mainType == MainType.PVP) {
            gdk.Timer.once(2000, this, () => {
                this.model.activeHeroSkillIds = {}
            })
        }
    }

    _expBtnTouchStart() {
        // this.schedule(this.onAddExpClick, 0.1, cc.macro.REPEAT_FOREVER, 1)
        this.onAddExpClick()
    }

    // _expBtnTouchEnd() {
    //     this.unschedule(this.onAddExpClick)
    // }

    onAddExpClick() {

        //英雄在共鸣水晶槽位上无法升级
        if (this.resonatingModel.getHeroInUpList(this.heroInfo.heroId)) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP53"))
            return;
        }

        if (this.heroInfo.level >= ConfigManager.getItems(Hero_lvCfg).length) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP36"))
            // this._expBtnTouchEnd()
            return
        }
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId, { career_lv: this.heroInfo.careerLv })
        let heroLvCfg = ConfigManager.getItemById(Hero_lvCfg, this.heroInfo.level)
        if (heroLvCfg && heroLvCfg.clv <= this.heroInfo.careerLv) {
            if (careerCfg && this.heroInfo.level >= careerCfg.hero_lv) {
                let starCfg = ConfigManager.getItemById(Hero_starCfg, this.heroInfo.star)
                if (this.heroInfo.careerLv >= starCfg.career_lv) {
                    GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP37"))
                    return
                }
                //满足条件升阶
                gdk.panel.open(PanelId.RoleUpgradePanel2)
            } else {
                let costs = heroLvCfg.cost
                for (let i = 0; i < costs.length; i++) {
                    let ownNum = BagUtils.getItemNumById(costs[i][0])
                    if (ownNum < costs[i][1]) {
                        GlobalUtil.openGainWayTips(costs[i][0])
                        return
                    }
                }
                let msg = new icmsg.HeroLevelupReq()
                msg.heroId = this.heroInfo.heroId
                msg.addLv = this._upgradeLv
                NetManager.send(msg, () => {
                    gdk.sound.isOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.levelupHero)
                    let msg2 = new icmsg.HeroSoldierInfoReq()
                    msg2.heroId = this.heroInfo.heroId
                    msg2.soldierId = this.heroInfo.soldierId
                    NetManager.send(msg2)
                })
            }
        } else {
            // this._expBtnTouchEnd()
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP38"))
            return
        }
    }

    _updateBtnState() {
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId, { hero_lv: this.heroInfo.level })
        let heroLvCfg = ConfigManager.getItemById(Hero_lvCfg, this.heroInfo.level)
        let lvCost = heroLvCfg.cost
        if (careerCfg) {
            lvCost = careerCfg.career_item1
            this.btnLab.string = gdk.i18n.t("i18n:HERO_TIP39")
            return
        }
        let minLv = this._getUpgradeLv()
        this._upgradeLv = 10
        if (minLv >= 10) {
            this._upgradeLv = 10
        } else if (minLv >= 5 && minLv < 10) {
            this._upgradeLv = 5
        } else if (minLv >= 3 && minLv < 5) {
            this._upgradeLv = 3
        } else {
            this._upgradeLv = 1
        }
        let upCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId, { career_lv: this.heroInfo.careerLv })
        if (this._upgradeLv + this.heroInfo.level > upCfg.hero_lv) {
            this._upgradeLv = upCfg.hero_lv - this.heroInfo.level
        }
        if (this._upgradeLv > 1) {
            this.btnLab.string = StringUtils.format(gdk.i18n.t("i18n:HERO_TIP40"), this._upgradeLv)//`升${this._upgradeLv}级`
        } else {
            this.btnLab.string = gdk.i18n.t("i18n:HERO_TIP39")
        }
    }

    _getUpgradeLv() {
        let costArr = []
        let totalLv = ConfigManager.getItems(Hero_lvCfg).length
        let minLv = 10
        for (let lv = this.heroInfo.level; lv < totalLv; lv++) {
            let cfg = ConfigManager.getItemById(Hero_lvCfg, lv)
            let cfgCost = cfg.cost
            for (let i = 0; i < cfgCost.length; i++) {
                let num = BagUtils.getItemNumById(cfgCost[i][0])
                if (costArr[cfgCost[i][0]]) {
                    costArr[cfgCost[i][0]] += cfgCost[i][1]
                } else {
                    costArr[cfgCost[i][0]] = cfgCost[i][1]
                }
                if (costArr[cfgCost[i][0]] > num) {
                    minLv = lv - this.heroInfo.level
                    return minLv
                }
            }
        }
        return minLv
    }

    /**英雄重置 */
    openResetFunc() {
        if (!JumpUtils.ifSysOpen(2804, true)) {
            return
        }
        //符合条件的进入
        if (this.heroInfo.level >= 2) {
            this.model.resetHeroId = this.heroInfo.heroId
            JumpUtils.openPanel({
                panelId: PanelId.HeroResetView,
                currId: PanelId.RoleView2
            });
        } else {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP30"))
        }
    }

    /**神秘者英雄 基因连接 */
    _updateGeneConnect() {
        let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        this.expNode.active = true;
        if (heroCfg.group[0] == 6) {
            this.careerNode.active = this.expNode.active = false;
        }
        this.geneConnectNode.active = heroCfg.group[0] == 6;
        if (this.geneConnectNode.active) {
            let connectHeroInfo = HeroUtils.getHeroInfoByHeroId(this.heroInfo.mysticLink);
            cc.find('lab', this.geneConnectNode).active = !connectHeroInfo;
            cc.find('tipsBtn', this.geneConnectNode).active = !connectHeroInfo;
            GlobalUtil.setSpriteIcon(this.node, cc.find('linkLine', this.geneConnectNode), `view/role/texture/geneConnect/smz_lianjie${!connectHeroInfo ? 1 : 2}`);
            cc.find('curHero/linkBg', this.geneConnectNode).active = !!connectHeroInfo;
            cc.find('connectHero/linkBg', this.geneConnectNode).active = !!connectHeroInfo;
            //mystic slot
            let mysticSlot = cc.find('curHero/UiSlotItem', this.geneConnectNode);
            let mysticSlotCtrl = mysticSlot.getComponent(UiSlotItem);
            mysticSlotCtrl.updateItemInfo(this.heroInfo.typeId);
            mysticSlotCtrl.updateStar(this.heroInfo.star);
            mysticSlotCtrl.updateCareer(ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type);
            mysticSlotCtrl.lvLab.active = true;
            mysticSlotCtrl.lvLab.getComponent(cc.Label).string = `.${this.heroInfo.level}`;
            mysticSlotCtrl.lvLab.color = cc.color().fromHEX(!!connectHeroInfo ? '#43FDFF' : '#FFFFFF');
            //connect slot
            let connectHeroSlot = cc.find('connectHero/UiSlotItem', this.geneConnectNode);
            connectHeroSlot.active = !!connectHeroInfo;
            if (connectHeroSlot.active) {
                let slotCtrl = connectHeroSlot.getComponent(UiSlotItem);
                slotCtrl.updateItemInfo(connectHeroInfo.typeId);
                slotCtrl.updateStar(connectHeroInfo.star);
                slotCtrl.updateCareer(ConfigManager.getItemByField(Hero_careerCfg, 'career_id', connectHeroInfo.careerId).career_type);
                slotCtrl.lvLab.active = true;
                slotCtrl.lvLab.getComponent(cc.Label).string = `.${connectHeroInfo.level}`;
            }
        }
    }

    onGeneHeroAddBtnClick() {
        let info = this.heroInfo;
        gdk.panel.setArgs(PanelId.GeneConnectView, this.heroInfo.heroId);
        PanelId.SupportMainView.onHide = {
            func: () => {
                ModelManager.get(HeroModel).curHeroInfo = info;
                JumpUtils.openPanel({
                    panelId: PanelId.RoleView2,
                })
            }
        }
        JumpUtils.openSupportView([6]);
    }
}

