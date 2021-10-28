import BagUtils from '../../../common/utils/BagUtils';
import CareerIconItemCtrl from '../../../view/role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import CostumeUtils from '../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import PanelId from '../../../configs/ids/PanelId';
import PveTool from '../../../view/pve/utils/PveTool';
import RoleEliteAttTipsCtrl from '../../../view/role/ctrl2/main/common/RoleEliteAttTipsCtrl';
import SkillInfoPanelCtrl from '../../../view/role/ctrl2/main/skill/SkillInfoPanelCtrl';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../common/models/BagModel';
import {
    Costume_compositeCfg,
    CostumeCfg,
    Hero_awakeCfg,
    Hero_starCfg,
    HeroCfg,
    Item_equipCfg,
    RuneCfg,
    SkillCfg
    } from '../../../a/config';
import { PveSkillType } from '../../../view/pve/const/PveSkill';

/**
 * @Description: 个人名片-荣耀展示tips
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-15 14:07:11
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainSetHeroInfoTipCtrl")
export default class MainSetHeroInfoTipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    qualityBg: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Node)
    careerIconItem: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    awakeingSkillNode: cc.Node = null;
    @property(cc.Sprite)
    awakeingSkillIcon: cc.Sprite = null;

    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Prefab)
    skillPre: cc.Prefab = null;

    @property(cc.Node)
    attrNode: cc.Node = null;

    @property([cc.Node])
    equipNodes: cc.Node[] = [];


    @property([cc.Node])
    runeNodes: cc.Node[] = [];

    @property([cc.Node])
    costumeNodes: cc.Node[] = [];

    @property(cc.Node)
    equipSuitContent: cc.Node = null;
    @property(cc.Node)
    equipSuitTitle: cc.Node = null;

    @property(cc.Node)
    suitNode: cc.Node = null

    @property(cc.Node)
    uniqueEquip: cc.Node = null

    //_gCfg: GuardianCfg
    heroData: icmsg.RoleHeroImageRsp
    heroCfg: HeroCfg;
    _awakeSkill: number = 0;
    equipCtrls: Array<UiSlotItem> = [];
    suitCfgs: Costume_compositeCfg[] = []
    skillcfgs: SkillCfg[] = []
    onEnable() {
        let arg = this.args
        this.heroData = arg[0]
        //this._gCfg = ConfigManager.getItemById(GuardianCfg, this._gInfo.type)
        this._updateViewInfo()
    }
    onDisable() {
        //NetManager.targetOff(this)
        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
            element.targetOff(this);
        }
        for (let index = 0; index < this.runeNodes.length; index++) {
            const element = this.runeNodes[index];
            element.targetOff(this);
        }
        gdk.Timer.clearAll(this)
    }

    _updateViewInfo() {
        let str = ['baise', 'lvse', 'lanse', 'zise', 'huangse', 'hongse'];
        let temHero = this.heroData.hero;
        this.heroCfg = ConfigManager.getItemById(HeroCfg, temHero.typeId)
        let color = ConfigManager.getItemById(Hero_starCfg, temHero.star).color
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `view/role/texture/bg/zb_${str[color]}`);
        this.slot.updateItemInfo(temHero.typeId);
        //this.slot.itemId = temHero.typeId
        gdk.Timer.once(30, this, () => {
            this.slot.updateStar(temHero.star)
        })
        //this.slot.updateStar(temHero.star)

        this.careerIconItem.active = true
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(temHero.careerId, temHero.careerLv, temHero.soldierId)

        this.lv.string = '.' + temHero.level + '';
        let colorInfo = BagUtils.getColorInfo(color);
        this.nameLab.string = `${this.heroCfg.name}`
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline)
        this.powerLab.string = temHero.power + '';

        //设置技能
        this.awakeingSkillNode.active = false
        this._awakeSkill = 0
        if (temHero.star >= this.heroCfg.star_max && this.heroCfg.awake) {
            let awakeCfgs = ConfigManager.getItems(Hero_awakeCfg, { "hero_id": this.heroCfg.id })
            let maxAwakeCfg = awakeCfgs[awakeCfgs.length - 1]
            this.awakeingSkillNode.active = true
            GlobalUtil.setSpriteIcon(this.node, this.awakeingSkillIcon, GlobalUtil.getSkillIcon(maxAwakeCfg.ul_awake_skill[0]))
            this._awakeSkill = maxAwakeCfg.ul_awake_skill[0]
        }
        let skills = [];
        this.skillcfgs = []
        let careerId = temHero.careerId;
        skills = HeroUtils.getCareerLineSkills(careerId, 0);
        let starcfg = ConfigManager.getItemByField(Hero_starCfg, "star", temHero.star);
        let giftLv = this.heroCfg.group[0] == 6 ? 1 : starcfg.gift_lv;
        let giftSkillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", this.heroCfg.gift_tower_id, { level: giftLv });
        //temHero.skills
        if (!giftSkillCfg) {
            giftSkillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", this.heroCfg.gift_tower_id, { level: 1 });
        }
        let skillList1 = [];
        let skillList2 = giftSkillCfg ? [giftSkillCfg] : [];
        skills.forEach(skill => {
            let skillLv = 1;
            let cfg = PveTool.getSkillCfg(skill.skillId, skillLv);
            if (cfg) {
                //dmg_type 11 超绝 9 天赋
                if (PveSkillType.isSuper(cfg.type) || cfg.dmg_type == 11 || cfg.dmg_type == 9) {

                } else if (cfg.icon && cfg.show < 1) {
                    if (skillList1.indexOf(cfg) < 0) {
                        skillList1.push(cfg);
                    }
                }
            }
        })
        skillList1.sort((s1, s2) => {
            return s1.skill_id - s2.skill_id
        })
        //去除重复技能
        let temSkill = skillList2.concat(skillList1);
        let temShowSkill: SkillCfg[] = [];
        let temShowSkillId = [];
        temSkill.forEach(cfg => {
            if (temShowSkillId.indexOf(cfg.skill_id) < 0) {
                temShowSkillId.push(cfg.skill_id)
                temShowSkill.push(cfg);
            }
        })

        if (this.heroCfg.group[0] == 6) {
            temShowSkill.forEach((c, idx) => {
                let lv = this.heroData.hero.mysticSkills[idx - 1];
                if (idx !== 0 && lv > 0) {
                    let cfg = GlobalUtil.getSkillLvCfg(c.skill_id, lv);
                    temShowSkill[idx] = cfg;
                }
            });
        }
        this.skillcfgs = temShowSkill;
        this.addSkillItem(this.skillNode, temShowSkill);

        //设置属性
        this._updateAttrInfo()
        //设置装备符文神装
        this._updateEquitAndRune()
        //神装套装
        this._updateEquipSuitInfo()
    }

    //设置属性
    _updateAttrInfo() {

        let temHero = this.heroData.hero;
        let valueKey = ['atkW', 'hpW', 'defW']
        let addKey = ['atkG', 'hpG', 'defG']
        this.attrNode.children.forEach((node, idx) => {
            if (node.active) {
                let curLab = node.getChildByName('old').getComponent(cc.Label);
                let addLab = node.getChildByName('add').getComponent(cc.Label);
                let initValue = 0
                let addValue = 0
                if (idx < 3) {
                    initValue = temHero[valueKey[idx]]
                    addValue = temHero[addKey[idx]]
                } else {
                    initValue = 100
                    addValue = 0
                }
                curLab.string = `${initValue}`
                if (addValue > 0) {
                    addLab.string = `+${addValue}`
                } else {
                    addLab.string = ''
                }

            }
        });
    }

    _updateEquitAndRune() {

        // 装备
        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
            let add = element.getChildByName('add');
            add.active = true;
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this._equipClick(index);
            }, this);
        }
        //符文
        for (let i = 0; i < this.runeNodes.length; i++) {
            const element = this.runeNodes[i];
            let add = element.getChildByName('add');
            add.active = true;
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this._runeClick(i);
            }, this)
        }
        //神装
        for (let index = 0; index < this.costumeNodes.length; index++) {
            const element = this.costumeNodes[index];
            let add = element.getChildByName('add');
            add.active = true;
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this._costumeClick(index);
            }, this);
        }

        this.heroData.hero.slots.forEach(data => {
            let cfg = ConfigManager.getItemByField(Item_equipCfg, 'id', data.equipId);
            if (cfg) {
                let node = this.equipNodes[cfg.part - 1]
                let ctrl = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
                let add = node.getChildByName('add')
                add.active = false;
                ctrl.itemId = data.equipId
                ctrl.updateItemInfo(data.equipId)
                ctrl.updateStar(0)
            }
        })
        this.heroData.hero.runes.forEach((runId, i) => {
            if (runId > 0) {
                let node = this.runeNodes[i]
                let ctrl = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
                let add = node.getChildByName('add')
                add.active = false;
                let temId = parseInt(runId.toString().slice(0, 6))
                ctrl.updateItemInfo(runId);
                // ctrl.itemId = temId
                let lv = node.getChildByName('lvLab').getComponent(cc.Label);
                lv.string = '.' + ConfigManager.getItemById(RuneCfg, temId).level;
            }
        })
        this.heroData.hero.costumes.forEach(data => {
            let cfg = ConfigManager.getItemById(CostumeCfg, data.typeId);
            if (cfg) {
                let node = this.costumeNodes[cfg.part]
                let ctrl = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
                let add = node.getChildByName('add')
                add.active = false;
                ctrl.updateItemInfo(data.typeId)
                ctrl.itemId = data.typeId
                ctrl.updateStar(cfg.star)
                ctrl.starNum = cfg.star
                let lv = node.getChildByName("lvLab").getComponent(cc.Label)
                lv.string = data.id > 0 ? `.${data.level}` : ""
            }
        })

        this.uniqueEquip.active = false
        if (this.heroData.hero.uniqueEquip && this.heroData.hero.uniqueEquip.id > 0) {
            this.uniqueEquip.active = true
            let ctrl = this.uniqueEquip.getChildByName('UiSlotItem').getComponent(UiSlotItem);
            ctrl.updateItemInfo(this.heroData.hero.uniqueEquip.itemId)
            ctrl.updateStar(this.heroData.hero.uniqueEquip.star)
            ctrl.starNum = this.heroData.hero.uniqueEquip.star
        }
    }

    onUniqueEquipClick() {
        if (this.heroData.hero.uniqueEquip) {
            let uniqueEquip = new icmsg.UniqueEquip()
            uniqueEquip.id = -1
            uniqueEquip.itemId = this.heroData.hero.uniqueEquip.itemId
            uniqueEquip.star = this.heroData.hero.uniqueEquip.star
            gdk.panel.setArgs(PanelId.UniqueEquipTip, uniqueEquip, this.heroData.hero.careerId)
            gdk.panel.open(PanelId.UniqueEquipTip)
        }
    }

    _equipClick(index: number) {
        let node = this.equipNodes[index]
        let ctrl = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
        if (ctrl.itemId > 0) {
            let bagItem: BagItem = {
                series: ctrl.itemId,
                itemId: ctrl.itemId,
                itemNum: 1,
                type: BagType.EQUIP,
                extInfo: null,
            }
            GlobalUtil.openItemTips(bagItem)
        }
    }

    //符文槽点击
    _runeClick(idx: number) {
        let node = this.runeNodes[idx]
        let ctrl = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
        if (ctrl.itemId > 0) {
            let bagItem: BagItem = {
                series: ctrl.itemId,
                itemId: ctrl.itemId,
                itemNum: 1,
                type: BagType.RUNE,
                extInfo: null,
            }
            GlobalUtil.openItemTips(bagItem)
        }
    }

    _costumeClick(idx: number) {
        let node = this.costumeNodes[idx]
        let ctrl = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
        if (ctrl.itemId > 0) {

            let info = null;
            this.heroData.hero.costumes.forEach(data => {
                if (data.typeId == ctrl.itemId) {
                    info = data;
                }
            })
            let bagItem: BagItem = {
                series: ctrl.itemId,
                itemId: ctrl.itemId,
                itemNum: 1,
                type: BagType.COSTUME,
                extInfo: info,
            }
            GlobalUtil.openItemTips(bagItem)
        }
    }

    addSkillItem(skillLayout: cc.Node, skills: SkillCfg[]) {
        skillLayout.destroyAllChildren();
        if (skills.length > 0) {
            //let starNum = (this.heroModel.item.extInfo as icmsg.HeroInfo).star;
            skills.forEach((skillCfg, idx) => {
                let node = cc.instantiate(this.skillPre);
                let icon = node.getChildByName('skillIcon').getComponent(cc.Sprite);
                let tianfu = node.getChildByName('tianfu');
                let lockNode = node.getChildByName('lockNode');
                let lvNode = node.getChildByName('lvNode');

                tianfu.active = skillCfg.dmg_type == 9
                let islock = true;
                let temHero = this.heroData.hero;
                if (temHero.star >= 12 || temHero.skills.indexOf(skillCfg.skill_id) >= 0) {
                    islock = false;
                }
                lockNode.active = islock
                lvNode.active = !islock && this.heroCfg.group[0] == 6 && this.heroData.hero.mysticSkills[idx - 1] > 0;
                if (lvNode.active) {
                    lvNode.getChildByName('lv').getComponent(cc.Label).string = this.heroData.hero.mysticSkills[idx - 1] + '';
                }
                // node.on(cc.Node.EventType.TOUCH_END, () => {
                //     this.showSkill(skillCfg.skill_id, skillCfg.level)
                // }, this)
                node.parent = skillLayout;
                let path = GlobalUtil.getSkillIcon(skillCfg.skill_id)
                GlobalUtil.setSpriteIcon(this.node, icon, path)
            })
        }
    }

    _updateEquipSuitInfo() {
        for (let index = 0; index < this.equipSuitContent.childrenCount; index++) {
            const suitNode = this.equipSuitContent.children[index];
            suitNode.active = false
        }

        let suitNum = 0//是否有多套装
        let suitMap = CostumeUtils.getCostumeSuitInfo(this.heroData.hero.costumes)
        let suitActiveType = []
        for (let key in suitMap) {
            if (suitMap[key].length >= 2) {
                suitNum++
                suitActiveType.push(parseInt(key))
            }
        }
        this.equipSuitTitle.active = false;
        for (let key in suitMap) {
            let colors = suitMap[key]
            //颜色从小到大
            GlobalUtil.sortArray(colors, (a: number, b: number) => {
                return a - b
            })
            this.suitCfgs = []
            if (colors.length >= 2) {
                let type = parseInt(key)
                let color1Num = CostumeUtils.getSuitColorNum(colors, 1, true)
                let color2Num = CostumeUtils.getSuitColorNum(colors, 2, true)
                let color3Num = CostumeUtils.getSuitColorNum(colors, 3, true)
                let color4Num = CostumeUtils.getSuitColorNum(colors, 4, true)
                let colorNums = [{ color: 1, num: color1Num }, { color: 2, num: color2Num }, { color: 3, num: color3Num }, { color: 4, num: color4Num }]
                GlobalUtil.sortArray(colorNums, (a: any, b: any) => {
                    if (a.num == b.num) {
                        return b.color - a.color
                    }
                    return a.num - b.num
                })

                let colorMax = this._getColorMax(colorNums, 4)
                let colorMin = this._getColorMax(colorNums, 2)
                let numMax = CostumeUtils.getSuitColorNum(colors, colorMax, true)
                let numMin = CostumeUtils.getSuitColorNum(colors, colorMin, true)

                let suitCfgMax = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: numMax })
                let suitCfgMin = null//
                if (colorMin != colorMax || suitNum > 1) {
                    suitCfgMin = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMin, num: numMin })
                }
                if (suitCfgMin && colorMin != colorMax) {
                    if (suitCfgMax.num != suitCfgMin.num) {
                        this.suitCfgs.push(suitCfgMin)
                    } else {
                        if (colorMin > colorMax) {
                            suitCfgMax = suitCfgMin
                        }
                    }
                }
                this.suitCfgs.push(suitCfgMax)

                if (suitNum == 1 && this.suitCfgs.length == 1) {
                    let suitCfg2 = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: 2 })
                    let suitCfg4 = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: 4 })

                    if (suitCfg2.num != this.suitCfgs[0].num) {
                        this.suitCfgs.push(suitCfg2)
                    }

                    if (suitCfg4.num != this.suitCfgs[0].num) {
                        this.suitCfgs.push(suitCfg4)
                    }
                }

                GlobalUtil.sortArray(this.suitCfgs, (a, b) => {
                    return a.num - b.num
                })
                this.equipSuitTitle.active = this.suitCfgs.length > 0;
                for (let index = 0; index < this.suitCfgs.length; index++) {
                    let s_node: cc.Node = this.equipSuitContent[index]
                    if (!s_node) {
                        s_node = cc.instantiate(this.suitNode)
                        s_node.parent = this.equipSuitContent
                    }
                    //let number = CostumeUtils.getSuitColorNum(colors, suitCfgs[index].color)
                    this._updateSuitNode(s_node, this.suitCfgs[index])

                }
            }

        }
    }
    _getColorMax(colorNums, num) {
        for (let i = 0; i < colorNums.length; i++) {
            if (colorNums[i].num >= num) {
                return colorNums[i].color
            }
        }
        return 1
    }
    _updateSuitNode(sNode: cc.Node, cfg: Costume_compositeCfg) {
        sNode.active = true
        let suitDes = sNode.getChildByName("suitDes").getComponent(cc.Label)
        let temStr = `${cfg.name}${cfg.num}${gdk.i18n.t("i18n:ROLE_TIP23")}`
        suitDes.string = temStr.split(':')[0]
        sNode.height = suitDes.node.height
    }

    //打开装备套装详情界面
    openSuitInfoView() {
        if (this.suitCfgs.length > 0) {
            gdk.panel.setArgs(PanelId.MainSetGuardianEquitSuitTips, this.suitCfgs)
            gdk.panel.open(PanelId.MainSetGuardianEquitSuitTips);
        }

    }

    //打开技能详情界面
    openAwakeSkillInfoView() {
        if (this._awakeSkill > 0) {
            gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
                let comp = node.getComponent(SkillInfoPanelCtrl);
                comp.showSkillInfo(this._awakeSkill);
            });
        }
    }

    //打开技能详情界面
    openSkillInfoView() {
        let temHero = this.heroData.hero
        gdk.panel.setArgs(PanelId.MainSetSkillsInfoTip, this._awakeSkill, this.skillcfgs, temHero.skills, temHero.star)
        gdk.panel.open(PanelId.MainSetSkillsInfoTip);
    }

    // let keys = ["critV", "critVRes",
    // "hitW", "dodgeW",
    // "atkDmg", "atkRes",
    // "dmgPunc", "puncRes",
    // "dmgRadi", "radiRes",
    // "dmgFire", "fireRes",
    // "dmgCold", "coldRes",
    // "dmgElec", "elecRes"]

    //打开属性详情界面
    _heroAttrInfo: icmsg.HeroAttr;
    openAttrInfoView() {
        if (!this._heroAttrInfo) {
            let temData = this.heroData.hero;
            this._heroAttrInfo = new icmsg.HeroAttr();
            this._heroAttrInfo.critV = temData.critV
            this._heroAttrInfo.critVRes = temData.critVRes
            this._heroAttrInfo.hitW = temData.hitW
            this._heroAttrInfo.dodgeW = temData.dodgeW
            this._heroAttrInfo.atkDmg = temData.atkDmg
            this._heroAttrInfo.atkRes = temData.atkRes
            this._heroAttrInfo.dmgPunc = temData.dmgPunc
            this._heroAttrInfo.puncRes = temData.puncRes
            this._heroAttrInfo.dmgRadi = temData.dmgRadi
            this._heroAttrInfo.radiRes = temData.radiRes
            this._heroAttrInfo.dmgFire = temData.dmgFire
            this._heroAttrInfo.fireRes = temData.fireRes
            this._heroAttrInfo.dmgCold = temData.dmgCold
            this._heroAttrInfo.coldRes = temData.coldRes
            this._heroAttrInfo.dmgElec = temData.dmgElec
            this._heroAttrInfo.elecRes = temData.elecRes
            this._heroAttrInfo.hitG = temData.hitG
            this._heroAttrInfo.dodgeG = temData.dodgeG
        }
        gdk.panel.open(PanelId.MainSetHeroAttrInfoTip, (node: cc.Node) => {
            let comp = node.getComponent(RoleEliteAttTipsCtrl);
            if (comp) {
                comp.showEliteAttr(this._heroAttrInfo);
            }
        });
    }
}
