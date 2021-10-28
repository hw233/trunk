import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../skill/SkillInfoPanelCtrl';
import StringUtils from '../../../../../common/utils/StringUtils';
import {
    Global_powerCfg,
    Hero_awakeCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg
    } from '../../../../../a/config';

/**
 * 英雄觉醒 预览
 * @Author: luoyong
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-25 17:36:25
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/awake/HeroAwakePreView")
export default class HeroAwakePreView extends gdk.BasePanel {

    @property(cc.Label)
    targetHeroName: cc.Label = null;

    @property(cc.Label)
    targetHeroStar: cc.Label = null;

    @property(cc.Label)
    targetMaxHeroStar: cc.Label = null;

    @property(cc.Node)
    targetMaxHeroStarNode: cc.Node = null;

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.Node)
    oldAttrs: cc.Node = null;

    @property(cc.Node)
    newAttrs: cc.Node = null;

    @property(cc.Node)
    headIcon: cc.Node = null;

    @property(cc.Node)
    skillIcon: cc.Node = null;

    heroInfo: icmsg.HeroInfo;
    heroCfg: HeroCfg;
    _awakeSkill: number = 0

    onEnable() {

        this.heroInfo = ModelManager.get(HeroModel).curHeroInfo;
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        this.targetHeroName.string = this.heroCfg.name;
        this.targetHeroName.node.color = BagUtils.getColor(this.heroInfo.color);
        this.targetHeroName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(this.heroInfo.color);

        let awakeCfgs = ConfigManager.getItems(Hero_awakeCfg, { "hero_id": this.heroCfg.id })
        let maxAwakeCfg = awakeCfgs[awakeCfgs.length - 1]

        this.targetHeroStar.node.active = false;
        this.targetMaxHeroStarNode.active = true;
        this.targetMaxHeroStar.string = (maxAwakeCfg.star - 11) + ''

        let url = StringUtils.format("spine/hero/{0}/0.5/{0}", maxAwakeCfg.ul_skin);
        GlobalUtil.setSpineData(this.node, this.heroSpine, url, true, "stand", true, false); //spine

        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(maxAwakeCfg.ul_awake_skill[0]))
        this._awakeSkill = maxAwakeCfg.ul_awake_skill[0]

        if (maxAwakeCfg.icon) {
            GlobalUtil.setSpriteIcon(this.node, this.headIcon, GlobalUtil.getHeadIconById(maxAwakeCfg.icon))
        } else {
            this.headIcon.parent.parent.active = false
        }

        let heroAtt = HeroUtils.getHeroAttrById(this.heroInfo.heroId);
        let cfgAttrNames = ['atk_w', 'hp_w', 'def_w']
        let attrNames = ["atkW", "hpW", "defW"];
        //let extNames = ["atkG", "defG", "hpG"];
        //let changes = []
        let attrNames1 = ['atk_w', 'hp_w', 'def_w'];
        let growStrs = ['grow_atk', 'grow_hp', 'grow_def'];
        let nextStarCfg = ConfigManager.getItemById(Hero_starCfg, maxAwakeCfg.star);
        let grow = this.heroCfg.group[0] == 6 ? nextStarCfg.add_grow_mystery : nextStarCfg.add_grow;
        let careerCfg = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == this.heroInfo.careerLv) return true;
        });
        let oldAttr = []
        let newAttr = []
        for (let i = 0; i < attrNames.length; i++) {
            this.oldAttrs.getChildByName(cfgAttrNames[i]).getComponent(cc.Label).string = `${heroAtt[attrNames[i]]}`//`${heroAtt[attrNames[i]] + heroAtt[extNames[i]]}`
            //this.newAttrs.getChildByName(cfgAttrNames[i]).getComponent(cc.Label).string = `${heroAtt[attrNames[i]]}`//`${heroAtt[attrNames[i]] + heroAtt[extNames[i]] + maxAwakeCfg[cfgAttrNames[i]]}`
            let nextValue = this.heroCfg[attrNames1[i]] * nextStarCfg.add + careerCfg[growStrs[i]] * grow * (this.heroInfo.level - 1) + (careerCfg[attrNames1[i]] + maxAwakeCfg[cfgAttrNames[i]]) * grow;
            this.newAttrs.getChildByName(cfgAttrNames[i]).getComponent(cc.Label).string = `${Math.floor(nextValue)}`
            //changes.push(maxAwakeCfg[cfgAttrNames[i]])
            oldAttr.push(Math.floor(heroAtt[attrNames[i]]))
            newAttr.push(Math.floor(nextValue))
        }
        let temAttrs = ['hit_w', 'dodge_w']
        let temAttrs1 = ['hitW', 'dodgeW']
        let temGrows = ['grow_hit', 'grow_dodge']
        for (let i = 0; i < 2; i++) {
            //let oldValue = this.heroCfg[temAttrs[i]] * starCfg.add + careerCfg[temGrows[i]] * starCfg.add_grow * (this.heroInfo.level - 1) + careerCfg[temAttrs[i]] * starCfg.add_grow;
            let nextValue = this.heroCfg[temAttrs[i]] * nextStarCfg.add + careerCfg[temGrows[i]] * grow * (this.heroInfo.level - 1) + (careerCfg[temAttrs[i]] + maxAwakeCfg[temAttrs[i]]) * grow;
            oldAttr.push(Math.floor(heroAtt[temAttrs1[i]]))
            newAttr.push(Math.floor(nextValue))
        }
        //power
        let atkRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'atk').value;
        let defRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'def').value;
        let hpRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'hp').value;
        let hitRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'hit').value;
        let dodgeRatio = ConfigManager.getItemByField(Global_powerCfg, 'key', 'dodge').value;
        //let changePower = changes[0] * atkRatio + changes[1] * hpRatio + changes[2] * defRatio;
        let oldPower = oldAttr[0] * atkRatio + oldAttr[1] * hpRatio + oldAttr[2] * defRatio + oldAttr[3] * hitRatio + oldAttr[4] * dodgeRatio;
        let newPower = newAttr[0] * atkRatio + newAttr[1] * hpRatio + newAttr[2] * defRatio + newAttr[3] * hitRatio + newAttr[4] * dodgeRatio;
        this.oldAttrs.getChildByName('power').getComponent(cc.Label).string = Math.floor(oldPower) + ''//this.heroInfo.power + '';
        this.newAttrs.getChildByName('power').getComponent(cc.Label).string = Math.floor(newPower) + ''//this.heroInfo.power + Math.floor(changePower) + '';

        let oldStar = this.heroInfo.star > 5 ? '1'.repeat(this.heroInfo.star - 5) : '0'.repeat(this.heroInfo.star);
        let newStar = this.heroInfo.star + 1 > 5 ? '1'.repeat(this.heroInfo.star + 1 - 5) : '0'.repeat(this.heroInfo.star + 1);
        let oldStarLb = this.oldAttrs.getChildByName('star').getComponent(cc.Label)
        let newStarLb = this.newAttrs.getChildByName('star').getComponent(cc.Label)
        let oldMaxStarNode = this.oldAttrs.getChildByName('maxstar')
        let oldMaxStarLb = cc.find('maxstar/maxStarLb', this.oldAttrs).getComponent(cc.Label);
        let newMaxStarNode = this.newAttrs.getChildByName('maxstar')
        let newMaxStarLb = cc.find('maxstar/maxStarLb', this.newAttrs).getComponent(cc.Label);
        if (this.heroInfo.star >= 12) {
            oldMaxStarNode.active = true;
            oldStarLb.node.active = false;
            oldMaxStarLb.string = this.heroInfo.star - 11 + ''
        } else {
            oldMaxStarNode.active = false;
            oldStarLb.node.active = true;
            oldStarLb.string = oldStar;
        }
        if (this.heroInfo.star + 1 >= 12) {
            newMaxStarNode.active = true;
            newStarLb.node.active = false;
            newMaxStarLb.string = (this.heroInfo.star + 1) - 11 + ''
        } else {
            newMaxStarNode.active = false;
            newStarLb.node.active = true;
            newStarLb.string = newStar;
        }

        let starCfg = ConfigManager.getItemById(Hero_starCfg, maxAwakeCfg.star - 1);

        //lv
        this.oldAttrs.getChildByName('lv').getComponent(cc.Label).string = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == starCfg.career_lv) return true;
        }).hero_lv + '';
        this.newAttrs.getChildByName('lv').getComponent(cc.Label).string = ConfigManager.getItem(Hero_careerCfg, (cfg: Hero_careerCfg) => {
            if (cfg.career_id == this.heroInfo.careerId && cfg.career_lv == nextStarCfg.career_lv) return true;
        }).hero_lv + '';
    }


    openAwakeSkillTip() {
        if (this._awakeSkill > 0) {
            gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
                let comp = node.getComponent(SkillInfoPanelCtrl);
                comp.showSkillInfo(this._awakeSkill);
            });
        }
    }
}