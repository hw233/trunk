import {
    Costume_compositeCfg, GuardianCfg, Guardian_starCfg, RuneCfg,
    SkillCfg,
    Soldier_army_skinCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeUtils from '../../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
/**
 * @Description: Pve技能tips
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-27 15:51:42
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveHeroEquitSkillInfoTipCtrl")
export default class PveHeroEquitSkillInfoTipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleNode1: cc.Node = null;
    @property(cc.Node)
    skillNode1: cc.Node = null;
    @property(cc.Node)
    titleNode2: cc.Node = null;
    @property(cc.Node)
    skillNode2: cc.Node = null;
    @property(cc.Node)
    titleNode3: cc.Node = null;
    @property(cc.Node)
    skillNode3: cc.Node = null;
    @property(cc.Node)
    titleNode4: cc.Node = null;
    @property(cc.Node)
    skillNode4: cc.Node = null;
    @property(cc.Prefab)
    skillPre: cc.Prefab = null;

    heroInfo: icmsg.HeroInfo;
    onEnable() {

    }

    onDisable() {
        gdk.Timer.clearAll(this);
    }

    setHeroData(hero: icmsg.HeroInfo) {
        this.heroInfo = hero;
        this.skillNode1.removeAllChildren();
        this.skillNode2.removeAllChildren();
        this.skillNode3.removeAllChildren();
        this.skillNode4.removeAllChildren();
        if (hero) {
            //符文技能
            let runeSkills: number[] = [];
            let runeSkillData: { skillId: number, level: number }[] = []
            hero.runes.forEach(runId => {
                if (runId > 0) {
                    let temId = parseInt(runId.toString().slice(0, 6))
                    let cfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', temId)
                    if (runeSkills.indexOf(cfg.skill) <= 0) {
                        runeSkills.push(cfg.skill)
                        runeSkillData.push({ skillId: cfg.skill, level: cfg.skill_level })
                    }
                    if (cc.js.isNumber(cfg.mix_skill) && runeSkills.indexOf(cfg.mix_skill) <= 0) {
                        runeSkills.push(cfg.mix_skill)
                        runeSkillData.push({ skillId: cfg.mix_skill, level: cfg.mix_skill_level })
                    }
                }
            })
            this.addSkillNode(1, this.skillNode1, runeSkillData);
            this.titleNode1.active = this.skillNode1.childrenCount > 0;

            //神装技能
            let suitNum = 0//是否有多套装
            let suitMap = CostumeUtils.getCostumeSuitInfo(hero.costumeIds)
            let suitActiveType = []
            for (let key in suitMap) {
                if (suitMap[key].length >= 2) {
                    suitNum++
                    suitActiveType.push(parseInt(key))
                }
            }
            for (let key in suitMap) {
                let colors = suitMap[key]
                //颜色从小到大
                GlobalUtil.sortArray(colors, (a: number, b: number) => {
                    return a - b
                })
                let suitCfgs: Costume_compositeCfg[] = []
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
                            suitCfgs.push(suitCfgMin)
                        } else {
                            if (colorMin > colorMax) {
                                suitCfgMax = suitCfgMin
                            }
                        }
                    }
                    suitCfgs.push(suitCfgMax)

                    if (suitNum == 1 && suitCfgs.length == 1 && suitCfgs[0].num > 2) {
                        let suitCfg2 = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: 2 })
                        let suitCfg4 = ConfigManager.getItem(Costume_compositeCfg, { type: type, color: colorMax, num: 4 })

                        if (suitCfg2.num != suitCfgs[0].num) {
                            suitCfgs.push(suitCfg2)
                        }

                        if (suitCfg4.num != suitCfgs[0].num) {
                            suitCfgs.push(suitCfg4)
                        }
                    }

                    GlobalUtil.sortArray(suitCfgs, (a, b) => {
                        return a.num - b.num
                    })

                    let runeSkillData: { skillId: number, level: number }[] = []
                    for (let index = 0; index < suitCfgs.length; index++) {
                        runeSkillData.push({ skillId: suitCfgs[index].id, level: 1 })
                    }
                    this.addSkillNode(2, this.skillNode2, runeSkillData);
                }

            }

            this.titleNode2.active = this.skillNode2.childrenCount > 0;

            //精甲技能
            if (hero.soldierSkin > 0) {
                let skinCfg = ConfigManager.getItemByField(Soldier_army_skinCfg, 'skin_id', hero.soldierSkin)
                if (skinCfg) {
                    this.addSkillNode(3, this.skillNode3, [{ skillId: skinCfg.skills, level: 1 }]);
                }
            }

            this.titleNode3.active = this.skillNode3.childrenCount > 0;

            //守护者技能
            if (hero.guardian && hero.guardian.id > 0) {
                let gCfg = ConfigManager.getItemById(GuardianCfg, hero.guardian.type)
                if (gCfg) {
                    let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", gCfg.id, { star: hero.guardian.star })
                    this.addSkillNode(4, this.skillNode4, [{ skillId: gCfg.skill_show, level: starCfg.skill_lv }]);
                }
            }

            this.titleNode4.active = this.skillNode4.childrenCount > 0;
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


    addSkillNode(index: number, skillNode: cc.Node, skillIds: { skillId: number, level: number }[]) {
        skillIds.forEach(data => {
            let node = cc.instantiate(this.skillPre);
            let icon = node.getChildByName('skillIcon').getComponent(cc.Sprite);
            let nameLb = cc.find('skillName', node).getComponent(cc.Label);
            //let lv = node.getChildByName('skillLv').getComponent(cc.Label);
            let des = cc.find('des', node).getComponent(cc.RichText);
            //let layout = cc.find('layout', node);
            if (index == 2) {
                let tem = ConfigManager.getItemByField(Costume_compositeCfg, 'id', data.skillId)
                let temStr = `${tem.name}${tem.num}${gdk.i18n.t("i18n:ROLE_TIP23")}`
                nameLb.string = temStr.split(':')[0]
                des.string = tem.des;
                //let path = GlobalUtil.getSkillIcon(data.skillId)
                let path = `icon/skill/${tem.icon}`
                GlobalUtil.setSpriteIcon(this.node, icon, path)
            } else {
                let cfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', data.skillId, { 'level': data.level })
                let path = GlobalUtil.getSkillIcon(data.skillId)
                GlobalUtil.setSpriteIcon(this.node, icon, path)
                nameLb.string = cfg.name;
                des.string = cfg.des;
            }

            // gdk.Timer.once(200, this, () => {
            //     if (des.node.height > 50) {
            //         node.height = des.node.height + 60;
            //     } else {
            //         node.height = 100
            //     }
            // })
            des.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
                if (des.node.height > 50) {
                    node.height = des.node.height + 60;
                } else {
                    node.height = 100
                }
                des.node.targetOff(this)
            }, this)
            node.setParent(skillNode);
        })
    }

}
