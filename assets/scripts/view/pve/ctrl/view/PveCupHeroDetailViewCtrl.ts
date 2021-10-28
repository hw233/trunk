import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GroupItemCtrl from '../../../role/ctrl2/main/camp/GroupItemCtrl';
import HeroDetailSkillCtrl from '../../../lottery/ctrl/HeroDetailSkillCtrl';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils, { StageKeys } from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import {
    Copycup_heroCfg,
    Hero_careerCfg,
    Hero_lvCfg,
    Hero_starCfg,
    HeroCfg,
    SkillCfg
    } from '../../../../a/config';

/**
 * @Description: 奖杯模式查看图鉴英雄信息
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 10:48:20
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveCupHeroDetailViewCtrl")
export default class PveCupHeroDetailViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    heroNameLab: cc.Label = null;

    @property(cc.Label)
    starLabel: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    labsNode: cc.Node = null;

    @property(cc.Sprite)
    solIcon: cc.Sprite = null;

    @property(cc.Label)
    fightLab: cc.Label = null;

    @property(cc.Node)
    groupLayout: cc.Node = null // 存放阵营图标的

    @property(cc.Prefab)
    groupItem: cc.Prefab = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property({ type: cc.String })
    _panelNames: string[] = [];

    @property(cc.Node)
    skillNodes: cc.Node[] = [];

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Sprite)
    skillIcon: cc.Sprite = null;

    @property(cc.RichText)
    descText: cc.RichText = null;

    // @property({ type: gdk.PanelId, tooltip: "子界面，如果没可选值，请先配置gdk.PanelId" })
    // get panels() {
    //     let ret = [];
    //     for (let i = 0; i < this._panelNames.length; i++) {
    //         ret[i] = gdk.PanelId[this._panelNames[i]] || 0;
    //     }
    //     return ret;
    // }
    // set panels(value) {
    //     this._panelNames = [];
    //     for (let i = 0; i < value.length; i++) {
    //         this._panelNames[i] = gdk.PanelId[value[i]];
    //     }
    // }

    panelIndex: number = -1;    // 当前打开的界面索引
    get model() { return ModelManager.get(HeroModel); }
    bgPath = ["yx_bg04", "yx_bg04", "yx_bg05", "yx_bg"]
    _heroCfg: HeroCfg
    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    //extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组

    _skillIds = []
    _careerLines = []
    _lineIndex: number = 0

    heroInfo: Copycup_heroCfg;
    onEnable() {
        this.checkArgs()

        // 属性文本
        let labsNode = this.labsNode;
        for (let index = 0; index < 6; index++) {
            let stageLab = labsNode.getChildByName(`stageLab${index + 1}`);
            let attLab = labsNode.getChildByName(`attLab${index + 1}`);
            this.stageLabs[index] = stageLab.getComponent(cc.Sprite);
            this.attLabs[index] = attLab.getComponent(cc.Label);
        }
        let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.hero_id)
        this.initHeroInfo(heroCfg)
    }

    onDestroy() {
        gdk.e.targetOff(this)
    }

    checkArgs() {
        this.heroInfo = gdk.panel.getArgs(PanelId.PveCupHeroDetail)[0];
        if (!this.heroInfo) {
            this.close()
        }
        // 打开新的子界面
        // let panelId = gdk.PanelId.getValue(this._panelNames[0]);
        // if (panelId) {
        //     gdk.panel.open(
        //         panelId,
        //         (node: cc.Node) => {
        //             if (panelId.__id__ == PanelId.HeroDetailSkill.__id__) {
        //                 let ctrl = node.getComponent(HeroDetailSkillCtrl)
        //                 ctrl.updateView(this._heroCfg)
        //             }
        //         },
        //         this,
        //         {
        //             parent: this.panelParent
        //         },
        //     );
        // }
    }

    _updateSkillInfo() {

        this._skillIds = this._getShowSkills(this.heroInfo.career_id)
        for (let i = 0; i < this.skillNodes.length; i++) {
            let item = this.skillNodes[i]
            item.active = false
            if (this._skillIds[i]) {
                let skillId = this._skillIds[i]
                item.active = true
                let icon = item.getChildByName("icon")
                GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getSkillIcon(skillId))
                if (this.heroInfo.hero_skills.indexOf(skillId) < 0) {
                    GlobalUtil.setAllNodeGray(item, 1);
                } else {
                    GlobalUtil.setAllNodeGray(item, 0);
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


    }

    _getShowSkills(careerId) {
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

                if (!HeroUtils.isCardSkill(lineIds[i])) {
                    if (skillCfg.type == 501) {
                        superIds.push(lineIds[i])
                    } else {
                        ids.push(lineIds[i])
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

    onShowSkillTip(e, index) {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            let comp = node.getComponent(SkillInfoPanelCtrl);
            comp.showSkillInfo(this._skillIds[index]);
        });
    }

    _updateGiftInfo() {
        let starcfg = ConfigManager.getItemByField(Hero_starCfg, "star", this.heroInfo.hero_star);
        let skillCfg;
        let skillName;
        let giftLv = this._heroCfg.group[0] == 6 ? 1 : starcfg.gift_lv;
        skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", this.heroInfo.hero_skills[0], { level: giftLv }) as SkillCfg;
        if (!skillCfg) {
            skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", this.heroInfo.hero_skills[0]);
        }
        skillName = StringUtils.format(gdk.i18n.t("i18n:PVE_CUPHERO_DETAIL_TIP"), skillCfg.name)//`${skillCfg.name}（塔防）`;
        this.nameLabel.string = skillName;
        this.descText.string = "";
        this.descText.string = `${skillCfg.des}`;
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillCfg.skill_id))
    }

    initHeroInfo(cfg: HeroCfg) {
        this._heroCfg = cfg
        this._updateUpInfo()

        // let realCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_pre", cfg.career_id)
        //let careerIds = ModelManager.get(HeroModel).careerInfos[this._heroCfg.id];
        this._updateAttr(this.heroInfo.career_id)
        this._updateGroupInfo()
        this._updateAttr(this.heroInfo.career_id)
        this._updateSkillInfo();
        this._updateGiftInfo();
    }

    _updateUpInfo() {
        this.heroNameLab.string = this._heroCfg.name;
        let color = ConfigManager.getItemById(Hero_starCfg, this.heroInfo.hero_star);
        this.heroNameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(color))
        let laboutline = this.heroNameLab.getComponent(cc.LabelOutline)
        laboutline.color = cc.color(GlobalUtil.getHeroNameColor(color, true))
        HeroUtils.setSpineData(this.node, this.spine, this._heroCfg.skin, true, false);

        let bgPath = ["yx_bg04", "yx_bg05", "yx_bg"]
        let idx = 0;
        if (this.heroInfo.hero_star >= 5) idx = 2;
        else if (this.heroInfo.hero_star > 3) idx = 1;
        else idx = 0;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/bg/${bgPath[idx]}`)
        this._updateStar(this.heroInfo.hero_star);
    }

    /**更新星星 */
    _updateStar(starNum: number) {
        let starTxt = "";
        starTxt = starNum > 5 ? '2'.repeat(starNum - 5) : '1'.repeat(starNum);
        this.starLabel.string = starTxt;
    }

    //@gdk.binding("model.bookSelectCareerId")
    _updateAttr(careerId) {
        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, null)
        if (!cfg || !this._heroCfg) {
            return
        }
        // 更新英雄属性等级
        let attIconName = ["hp", "speed", "atk", "def", "hit", "dodge"];
        for (let index = 0; index < this.stageLabs.length; index++) {
            const lab = this.stageLabs[index];
            let key = StageKeys[index];
            let val = cfg[key];
            let tInfo = HeroUtils.getGrowInfoById(key, val);
            let show = tInfo ? tInfo.show : "A";
            let name = attIconName[index];
            if (index <= 3) {
                GlobalUtil.setSpriteIcon(this.node, lab, `view/role/texture/common2/yx_${name}_${show}`);
            }
        }

        let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
        GlobalUtil.setSpriteIcon(this.node, this.solIcon, `common/texture/soldier/${nameArr[cfg.career_type - 1]}`);
        this._getHeroAttr(careerId)
    }

    _getHeroAttr(careerId) {
        // let nextIds = HeroUtils.getJobBackId(careerId)
        // if (nextIds && nextIds.length > 0) {
        //     careerId = nextIds[0]
        // }
        let cfgs = ConfigManager.getItemsByField(Hero_careerCfg, 'career_id', careerId);
        cfgs.sort((a, b) => { return b.career_lv - a.career_lv; });
        let careerCfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: cfgs[0].career_lv })
        let maxLv = ConfigManager.getItems(Hero_lvCfg).length
        let attName = ["hp_w", "atk_w", "def_w", "hit_w", "dodge_w"]
        let growName = ["grow_hp", "grow_atk", "grow_def", "grow_hit", "grow_dodge"]
        let hbAttrBase: HBAttrBase = {
            hp_w: 0,
            atk_w: 0,
            def_w: 0,
            hit_w: 0,
            dodge_w: 0
        }
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, "star", this._heroCfg.star_max)
        let data = [this.heroInfo.hero_hp, this.heroInfo.hero_atk, this.heroInfo.hero_def, this.heroInfo.hero_hit, this.heroInfo.hero_dodge]
        for (let index = 0; index < attName.length; index++) {
            let baseV = data[index]
            hbAttrBase[attName[index]] = baseV
        }
        // for (let index = 0; index < attName.length; index++) {
        //     hbAttrBase[attName[index]] = Math.floor(hbAttrBase[attName[index]] * (10000 + hbAttrR[ulAttR[index]]) / 10000)
        // }

        // 0 生命 1 攻速 2 攻击 3防御
        this.attLabs[0].string = `${Math.floor(hbAttrBase.hp_w)}`
        this.attLabs[1].string = `${Math.floor(careerCfg.atk_order)}`
        this.attLabs[2].string = `${Math.floor(hbAttrBase.atk_w)}`
        this.attLabs[3].string = `${Math.floor(hbAttrBase.def_w)}`

        this.fightLab.string = `${GlobalUtil.getPowerValue(hbAttrBase)}`
    }

    /**更新阵营图标 */
    _updateGroupInfo() {
        if (this._heroCfg) {
            let hero = this._heroCfg
            if (hero.group && hero.group.length > 0) {
                this.groupLayout.removeAllChildren()
                for (let index = 0; index < hero.group.length; index++) {
                    let item = cc.instantiate(this.groupItem)
                    item.active = false
                    this.groupLayout.addChild(item)
                }
                for (let i = 0; i < hero.group.length; i++) {
                    let item = this.groupLayout.children[i]
                    item.active = true;
                    let ctrl = item.getComponent(GroupItemCtrl)
                    ctrl.setGruopDate(hero.group[i], hero.id)
                }
            }
        }
    }

    /**上一个英雄 */
    leftFunc() {
        this._changHero(-1);
    }

    /**下一个英雄 */
    rightFunc() {
        this._changHero(1);
    }


    /**左右切换当前选择英雄 */
    _changHero(dir: number) {
        let items = this.model.bookHeroList;
        let len = items.length;
        if (len == 0) {
            return;
        }
        let heroIdx = -1;
        let curr = this._heroCfg
        curr && items.some((item, i) => {
            let cfg = item.cfg
            if (cfg && cfg.id == curr.id) {
                heroIdx = i;
                return true;
            }
            return false;
        });
        let nextIdx = heroIdx + dir;
        if (nextIdx < 0) {
            nextIdx = len - 1;
        } else if (nextIdx >= len) {
            nextIdx = 0;
        }
        if (heroIdx == nextIdx) {
            return;
        }
        this.initHeroInfo(items[nextIdx].cfg)

        let panel = gdk.panel.get(PanelId.HeroDetailSkill)
        if (panel) {
            let ctrl = panel.getComponent(HeroDetailSkillCtrl)
            ctrl.updateView(items[nextIdx].cfg)
        }
    }
}

export type HBAttrBase = {
    hp_w: number,
    atk_w: number,
    def_w: number,
    hit_w: number,
    dodge_w: number
}

export type HBAttrR = {
    ul_hp_r: number,
    ul_atk_r: number,
    ul_def_r: number,
    ul_hit_r: number,
    ul_dodge_r: number
}
