

/**
 * @Description: Pve技能tips
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-27 15:51:42
 */

import { Costume_compositeCfg, GuardianCfg, Guardian_starCfg, Hero_careerCfg, RuneCfg, SkillCfg, Soldier_army_skinCfg, Tech_stoneCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import ModelManager from "../../../../common/managers/ModelManager";
import CostumeUtils from "../../../../common/utils/CostumeUtils";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import PanelId from "../../../../configs/ids/PanelId";
import BYModel from "../../../bingying/model/BYModel";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveHeroEquitSkillInfoTip2Ctrl")
export default class PveHeroEquitSkillInfoTip2Ctrl extends gdk.BasePanel {

    //技能名称
    @property(cc.Label)
    titleLb: cc.Label = null;
    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Prefab)
    skillPre: cc.Prefab = null;
    @property(cc.Node)
    lockNode: cc.Node = null;

    type: number = 0;
    heroInfo: icmsg.HeroInfo;
    titleStrs: string[] = ["符文技能", "神装技能", "守护者技能", "能源石技能", "兵甲技能"]
    lock: boolean = false;
    onEnable() {
        let args = gdk.panel.getArgs(PanelId.PveHeroEquitSkillInfoTip2)
        if (args) {
            this.type = args[0];
            this.heroInfo = args[1];
            this.lock = args[2];
        }
        this.titleLb.string = this.titleStrs[this.type];
        this.lockNode.active = this.lock
        if (!this.lock) {
            this.setHeroData(this.heroInfo);
        }
    }

    setHeroData(hero: icmsg.HeroInfo) {
        let skills: number[] = [];
        let skillData: { skillId: number, level: number }[] = []
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', hero.careerId)
        switch (this.type) {
            case 0:
                //符文
                hero.runes.forEach(runId => {
                    if (runId > 0) {
                        let temId = parseInt(runId.toString().slice(0, 6))
                        let cfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', temId)
                        if (skills.indexOf(cfg.skill) <= 0) {
                            skills.push(cfg.skill)
                            skillData.push({ skillId: cfg.skill, level: cfg.skill_level })
                        }
                        if (cc.js.isNumber(cfg.mix_skill) && skills.indexOf(cfg.mix_skill) <= 0) {
                            skills.push(cfg.mix_skill)
                            skillData.push({ skillId: cfg.mix_skill, level: cfg.mix_skill_level })
                        }
                    }
                })
                break;
            case 1:
                //神装
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
                        for (let index = 0; index < suitCfgs.length; index++) {
                            skillData.push({ skillId: suitCfgs[index].id, level: 1 })
                        }
                    }

                }
                break;
            case 2:
                //守护者
                if (hero.guardian && hero.guardian.id > 0) {
                    let gCfg = ConfigManager.getItemById(GuardianCfg, hero.guardian.type)
                    if (gCfg) {
                        let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", gCfg.id, { star: hero.guardian.star })
                        skillData.push({ skillId: gCfg.skill_show, level: starCfg.skill_lv })
                    }
                }
                break;
            case 3:
                //能源石
                let stoneInSlot = ModelManager.get(BYModel).energStoneInSlot
                stoneInSlot.forEach(s => {
                    let cfg = ConfigManager.getItemById(Tech_stoneCfg, s.itemId);
                    if (cfg.career_type == careerCfg.career_type) {
                        skillData.push({ skillId: cfg.unique[0], level: 1 })
                    }
                });
                break;
            case 4:
                //兵甲
                if (hero.soldierSkin > 0) {
                    let skinCfg = ConfigManager.getItemByField(Soldier_army_skinCfg, 'skin_id', hero.soldierSkin)
                    if (skinCfg) {
                        skillData.push({ skillId: skinCfg.skills, level: 1 })
                    }
                }
                break;
        }
        this.addSkillNode(skillData);
    }


    addSkillNode(skillIds: { skillId: number, level: number }[]) {
        skillIds.forEach(data => {
            let node = cc.instantiate(this.skillPre);
            let icon = node.getChildByName('skillIcon').getComponent(cc.Sprite);
            let nameLb = cc.find('skillName', node).getComponent(cc.Label);
            //let lv = node.getChildByName('skillLv').getComponent(cc.Label);
            let des = cc.find('des', node).getComponent(cc.RichText);
            //let layout = cc.find('layout', node);
            if (this.type == 1) {
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
            des.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
                if (des.node.height > 50) {
                    node.height = des.node.height + 60;
                } else {
                    node.height = 100
                }
                des.node.targetOff(this)
            }, this)
            node.setParent(this.skillNode);
        })
    }

    _getColorMax(colorNums, num) {
        for (let i = 0; i < colorNums.length; i++) {
            if (colorNums[i].num >= num) {
                return colorNums[i].color
            }
        }
        return 1
    }
}
