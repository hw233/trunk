import AdventureModel from '../model/AdventureModel';
import AdventureUtils from '../utils/AdventureUtils';
import AdvHireHeroSkillCtrl from './AdvHireHeroSkillCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GroupItemCtrl from '../../role/ctrl2/main/camp/GroupItemCtrl';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils, { StageKeys } from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../../adventure2/model/NewAdventureModel';
import NewAdventureUtils from '../../adventure2/utils/NewAdventureUtils';
import PanelId from '../../../configs/ids/PanelId';
import {
    Adventure_globalCfg,
    Adventure_hireCfg,
    Adventure2_globalCfg,
    Adventure2_hireCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg
    } from '../../../a/config';

/**
 * @Description: 英雄信息
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-22 17:07:17
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvHireHeroDetailCtrl")
export default class AdvHireHeroDetailCtrl extends gdk.BasePanel {

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
    lvLab: cc.Label = null;

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

    @property({ type: gdk.PanelId, tooltip: "子界面，如果没可选值，请先配置gdk.PanelId" })
    get panels() {
        let ret = [];
        for (let i = 0; i < this._panelNames.length; i++) {
            ret[i] = gdk.PanelId[this._panelNames[i]] || 0;
        }
        return ret;
    }
    set panels(value) {
        this._panelNames = [];
        for (let i = 0; i < value.length; i++) {
            this._panelNames[i] = gdk.PanelId[value[i]];
        }
    }

    panelIndex: number = -1;    // 当前打开的界面索引
    get model() { return ModelManager.get(HeroModel); }
    bgPath = ["yx_bg04", "yx_bg04", "yx_bg05", "yx_bg"]
    _heroCfg: HeroCfg
    _hireCfg: Adventure_hireCfg | Adventure2_hireCfg
    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    //extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }
    get newAdventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }
    copytype: number = 0; //0 就奇境探险 1新奇境探险
    onEnable() {
        // 属性文本
        let labsNode = this.labsNode;
        for (let index = 0; index < 6; index++) {
            let stageLab = labsNode.getChildByName(`stageLab${index + 1}`);
            let attLab = labsNode.getChildByName(`attLab${index + 1}`);
            this.stageLabs[index] = stageLab.getComponent(cc.Sprite);
            this.attLabs[index] = attLab.getComponent(cc.Label);
        }
    }

    onDestroy() {
        gdk.e.targetOff(this)
    }

    checkArgs() {
        // 打开新的子界面
        let panelId = gdk.PanelId.getValue(this._panelNames[0]);
        if (panelId) {
            gdk.panel.open(
                panelId,
                (node: cc.Node) => {
                    if (panelId.__id__ == PanelId.AdvHireHeroSkill.__id__) {
                        let ctrl = node.getComponent(AdvHireHeroSkillCtrl)
                        ctrl.updateView(this._hireCfg)
                    }
                },
                this,
                {
                    parent: this.panelParent
                },
            );
        }
    }

    initHeroInfo(hireCfg: Adventure_hireCfg | Adventure2_hireCfg) {
        if (hireCfg instanceof Adventure_hireCfg) {
            this.copytype = 0
        } else {
            this.copytype = 1;
        }
        this._hireCfg = hireCfg
        this._heroCfg = ConfigManager.getItemById(HeroCfg, hireCfg.hero)
        this.checkArgs()
        this._updateUpInfo()
        this._updateAttr(hireCfg.career_id)
        this._updateGroupInfo()
    }

    _updateUpInfo() {
        this.heroNameLab.string = this._heroCfg.name;
        let color = ConfigManager.getItemById(Hero_starCfg, this._heroCfg.star_max);
        this.heroNameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(color))
        let laboutline = this.heroNameLab.getComponent(cc.LabelOutline)
        laboutline.color = cc.color(GlobalUtil.getHeroNameColor(color, true))
        HeroUtils.setSpineData(this.node, this.spine, this._heroCfg.skin, true, false);

        let bgPath = ["yx_bg04", "yx_bg05", "yx_bg"]
        let idx = 0;
        if (this._heroCfg.star_max >= 5) idx = 2;
        else if (this._heroCfg.star_max > 3) idx = 1;
        else idx = 0;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/bg/${bgPath[idx]}`)
        this._updateStar();
    }

    /**更新星星 */
    _updateStar() {
        let starTxt = "";
        let starNum = this.copytype == 0 ? AdventureUtils.getHeroStar(this.adventureModel.avgLevel) : NewAdventureUtils.getHeroStar(this.newAdventureModel.avgLevel)
        starTxt = starNum > 5 ? '2'.repeat(starNum - 5) : '1'.repeat(starNum);
        this.starLabel.string = starTxt;
    }

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
        let cfgs = ConfigManager.getItemsByField(Hero_careerCfg, 'career_id', careerId);
        cfgs.sort((a, b) => { return b.career_lv - a.career_lv; });
        let careerCfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: cfgs[0].career_lv })
        let num = ConfigManager.getItemById(Adventure_globalCfg, "average_coefficient").value[0]
        if (this.copytype == 1) {
            num = ConfigManager.getItemById(Adventure2_globalCfg, "average_coefficient").value[0]
        }
        let avgPower = this.adventureModel.avgPower
        let avgLevel = this.adventureModel.avgLevel
        if (this.copytype == 1) {
            avgPower = this.newAdventureModel.avgPower / 1000000
            avgLevel = this.newAdventureModel.avgLevel
        }
        let heroObj = {
            "atk": Math.floor(this._hireCfg.hero_atk * avgPower * num),
            "hp": Math.floor(this._hireCfg.hero_hp * avgPower * num),
            "def": Math.floor(this._hireCfg.hero_def * avgPower * num),
            "hit": Math.floor(this._hireCfg.hero_hit * avgPower * num),
            "dodge": Math.floor(this._hireCfg.hero_dodge * avgPower * num),
        }
        // 0 生命 1 攻速 2 攻击 3防御
        this.attLabs[0].string = `${Math.floor(heroObj.hp)}`
        this.attLabs[1].string = `${Math.floor(careerCfg.atk_order)}`
        this.attLabs[2].string = `${Math.floor(heroObj.atk)}`
        this.attLabs[3].string = `${Math.floor(heroObj.def)}`
        this.lvLab.string = `${avgLevel}`
        let power = AdventureUtils.getHeroPower(this._hireCfg)
        if (this.copytype == 1) {
            power = NewAdventureUtils.getHeroPower(this._hireCfg)
        }
        this.fightLab.string = `${power}`
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
}

