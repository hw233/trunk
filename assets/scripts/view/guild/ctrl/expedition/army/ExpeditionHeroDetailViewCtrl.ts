import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import ExpeditionHeroDetailSkillCtrl from './ExpeditionHeroDetailSkillCtrl';
import ExpeditionModel from '../ExpeditionModel';
import ExpeditionUtils from '../ExpeditionUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GroupItemCtrl from '../../../../role/ctrl2/main/camp/GroupItemCtrl';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils, { StageKeys } from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import {
    Expedition_strengthenCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg
    } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-21 11:44:50 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExpeditionHeroDetailViewCtrl")
export default class ExpeditionHeroDetailViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    heroNameLab: cc.Label = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Label)
    starLabel: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

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
    get eModel() { return ModelManager.get(ExpeditionModel); }
    bgPath = ["yx_bg04", "yx_bg04", "yx_bg05", "yx_bg"]
    _heroCfg: HeroCfg
    _heroInfo: icmsg.HeroInfo
    _heroDeatil: icmsg.HeroDetail
    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    //extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组

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
                    if (panelId.__id__ == PanelId.ExpeditionHeroDetailSkill.__id__) {
                        let ctrl = node.getComponent(ExpeditionHeroDetailSkillCtrl)
                        ctrl.updateView(this._heroInfo)
                    }
                },
                this,
                {
                    parent: this.panelParent
                },
            );
        }
    }

    initHeroInfo(heroId: number) {
        this._heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
        this._heroCfg = <HeroCfg>BagUtils.getConfigById(this._heroInfo.typeId);
        this.checkArgs()
        this._updateUpInfo()
        // let realCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_pre", cfg.career_id)
        this._updateAttr()
        this._updateGroupInfo()
    }

    _updateUpInfo() {
        this.heroNameLab.string = this._heroCfg.name;
        let color = ConfigManager.getItemById(Hero_starCfg, this._heroCfg.star_min).color;
        this.heroNameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(color))
        let laboutline = this.heroNameLab.getComponent(cc.LabelOutline)
        laboutline.color = cc.color(GlobalUtil.getHeroNameColor(color, true))
        HeroUtils.setSpineData(this.node, this.spine, this._heroCfg.skin, true, false);
        this.lvLab.string = this._heroInfo.level + '';

        let bgPath = ["yx_bg04", "yx_bg05", "yx_bg"]
        let idx = 0;
        if (this._heroCfg.star_min >= 5) idx = 2;
        else if (this._heroCfg.star_min > 3) idx = 1;
        else idx = 0;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/bg/${bgPath[idx]}`)
        this._updateStar();
    }

    /**更新星星 */
    _updateStar() {
        if (this._heroInfo.star >= 12 && this.maxStarNode) {
            this.starLabel.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (this._heroInfo.star - 11) + ''
        } else {
            this.starLabel.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            this.starLabel.string = this._heroInfo.star > 5 ? '2'.repeat(this._heroInfo.star - 5) : '1'.repeat(this._heroInfo.star);
        }
    }

    _updateAttr() {
        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._heroInfo.careerId, { career_lv: this._heroInfo.careerLv })
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
        this._getHeroAttr()
    }

    async _getHeroAttr() {
        this._heroDeatil = HeroUtils.getHeroDetailById(this._heroInfo.heroId);
        if (!this._heroDeatil) {
            let req = new icmsg.HeroDetailReq();
            req.heroId = this._heroInfo.heroId;
            NetManager.send(req, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this._getHeroAttr();
            }, this);
        }
        else {
            let careerCfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._heroInfo.careerId, { career_lv: this._heroInfo.careerLv })
            let t = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this._heroInfo.careerId).career_type;
            let exCareerType = [1, 1, 2, 3][t - 1]; //职业转换
            let lvs = this.eModel.armyStrengthenStateMap[exCareerType];
            let strengthRatios = [];
            let attrKeys = ['atk', 'def', 'hp'];
            for (let i = 0; i < 3; i++) {
                let lv = lvs[i];
                let c = ConfigManager.getItem(Expedition_strengthenCfg, (cfg: Expedition_strengthenCfg) => {
                    if (cfg.professional_type == exCareerType && cfg.type == i + 1 && cfg.level == lv) {
                        return true;
                    }
                });
                strengthRatios.push(c[attrKeys[i]] / 10000);
            }
            let armyLv = this.eModel.armyLv;
            let attr = this._heroDeatil.attr;

            // 0 生命 1 攻速 2 攻击 3防御
            this.attLabs[0].string = `${attr.hpW + attr.hpG + Math.ceil(attr.hpW * strengthRatios[2]) + ExpeditionUtils.getPrivilegeNum(armyLv, 3)}`
            this.attLabs[1].string = `${careerCfg.atk_order}`
            this.attLabs[2].string = `${attr.atkW + attr.atkG + Math.ceil(attr.atkW * strengthRatios[0]) + ExpeditionUtils.getPrivilegeNum(armyLv, 1)} `
            this.attLabs[3].string = `${attr.defW + attr.defG + Math.ceil(attr.defW * strengthRatios[1]) + ExpeditionUtils.getPrivilegeNum(armyLv, 2)} `
        }

        this.fightLab.string = await ExpeditionUtils.getPowerByHeorId(this._heroInfo.heroId) + '';
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

    openCommentFunc() {
        let cfg = ConfigManager.getItemById(HeroCfg, this._heroCfg.id)
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, "color", cfg.defaultColor)
        gdk.panel.setArgs(PanelId.SubHeroCommentPanel, this._heroCfg.id, starCfg.star)
        gdk.panel.open(PanelId.SubHeroCommentPanel)
    }

    getWayFunc() {
        let cfg = ConfigManager.getItemById(HeroCfg, this._heroCfg.id);
        if (!cfg.new_get || cfg.new_get.length <= 0) {
            gdk.gui.showMessage('暂无获取途径');
        }
        else {
            GlobalUtil.openGainWayTips(this._heroCfg.id);
        }
    }
}
