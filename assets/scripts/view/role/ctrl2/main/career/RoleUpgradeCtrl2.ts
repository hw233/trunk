import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../skill/SkillInfoPanelCtrl';
import UpgradeCostItemCtrl2 from './UpgradeCostItemCtrl2';
import { Hero_careerCfg, Hero_lvCfg } from '../../../../../a/config';


const typeKeys = ["atk_w", "def_w", "hp_w", "hit_w", "dodge_w"]

/*
   //英雄升阶  等级达到即可升阶
 * @Author: luoyong 
 * @Date: 2020-02-27 10:33:07 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-02-04 20:24:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/RoleUpgradeCtrl2")
export default class RoleUpgradeCtrl2 extends gdk.BasePanel {

    @property(cc.Label)
    curLabs: cc.Label[] = []

    @property(cc.Label)
    nextLabs: cc.Label[] = []

    @property(cc.Node)
    skillLayer: cc.Node = null

    @property(cc.Node)
    costLayer: cc.Node = null

    @property(cc.Prefab)
    skillItem: cc.Prefab = null; //技能图标

    @property(cc.Prefab)
    upgradeCostItem: cc.Prefab = null; //消耗物品

    get heroModel() { return ModelManager.get(HeroModel); }

    _curCfg: Hero_careerCfg
    _nextCfg: Hero_careerCfg

    onEnable() {
        this._updateViewInfo()
    }

    _updateViewInfo() {
        let curHeroInfo = this.heroModel.curHeroInfo
        this._curCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", curHeroInfo.careerId, { career_lv: curHeroInfo.careerLv })
        this._nextCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", curHeroInfo.careerId, { career_lv: curHeroInfo.careerLv + 1 })
        if (!this._nextCfg) {
            this._nextCfg = this._curCfg
        }

        for (let index = 0; index < this.curLabs.length; index++) {
            let curLab = this.curLabs[index]
            let nextLab = this.nextLabs[index]
            let tkey = typeKeys[index]
            curLab.string = this._curCfg[tkey] ? this._curCfg[tkey] : 0
            nextLab.string = this._nextCfg[tkey] ? this._nextCfg[tkey] : 0
        }


        this.skillLayer.removeAllChildren()
        let skills = this._nextCfg.ul_skill
        for (let i = 0; i < skills.length; i++) {
            let skillId = skills[i]
            let skillcfg = GlobalUtil.getSkillCfg(skillId)
            if (skillcfg && skillcfg.show == 1) {
                continue;
            }
            let node = cc.instantiate(this.skillItem)
            this.skillLayer.addChild(node)
            let bg = node.getChildByName('bg');
            let icon = bg.getChildByName("icon");

            let layout = node.getChildByName('layout');
            let typeIcon = layout.getChildByName("typeIcon")
            let nameLab = layout.getChildByName("nameLab").getComponent(cc.Label)

            let taPath = "view/role/texture/career2/juese_ta"
            let kaPath = "view/role/texture/career2/juese_ka"
            if (HeroUtils.isCardSkill(skillId)) {
                GlobalUtil.setSpriteIcon(this.node, bg, "common/texture/career/sub_skillbg2")
                GlobalUtil.setSpriteIcon(this.node, typeIcon, kaPath)
            } else {
                GlobalUtil.setSpriteIcon(this.node, bg, "common/texture/career/sub_skillbg")
                GlobalUtil.setSpriteIcon(this.node, typeIcon, taPath)
            }
            nameLab.string = skillcfg.name;
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this._skillIconClick(skillId)
            }, this)
            GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getSkillIcon(skillId))
        }

        if (skills.length == 0) {
            this.skillLayer.parent.active = false
        }

        let costItems = this._curCfg.career_item1
        this.costLayer.removeAllChildren()
        for (let i = 0; i < costItems.length; i++) {
            let item = cc.instantiate(this.upgradeCostItem)
            this.costLayer.addChild(item)
            let ctrl = item.getComponent(UpgradeCostItemCtrl2)
            ctrl.updateItemInfo(costItems[i][0], costItems[i][1])
        }
    }

    _skillIconClick(id) {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            node.y = -200
            let comp = node.getComponent(SkillInfoPanelCtrl)
            comp.showSkillInfo(id)
        })
    }

    upgradeFunc() {
        let lvCfg = ConfigManager.getItemById(Hero_lvCfg, this.heroModel.curHeroInfo.level);
        let costItems = lvCfg.cost
        if (this._curCfg && this.heroModel.curHeroInfo.level >= this._curCfg.hero_lv) {
            costItems = this._curCfg.career_item1
        }
        for (let i = 0; i < costItems.length; i++) {
            let num = BagUtils.getItemNumById(costItems[i][0])
            if (num < costItems[i][1]) {
                GlobalUtil.openGainWayTips(costItems[i][0])
                return
                //let itemCfg = BagUtils.getConfigById(costItems[i][0])
                //return gdk.gui.showMessage(itemCfg.name + "不足")
            }
        }
        let msg = new icmsg.HeroCareerUpReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId
        NetManager.send(msg, (data: icmsg.HeroCareerUpRsp) => {
            this.heroModel.curHeroInfo.careerLv = data.careerLv
            this.heroModel.curHeroInfo.level = data.heroLv
            this.heroModel.heroDeatils[data.heroId] = data.detail
            this.heroModel.curHeroInfo = this.heroModel.curHeroInfo
            gdk.panel.hide(PanelId.RoleUpgradePanel2)

            if (this._getShowSkillIds(data).length > 0) {
                gdk.panel.open(PanelId.RoleUpgradeSkillEffect)
            }

            let msg2 = new icmsg.HeroSoldierInfoReq()
            msg2.heroId = this.heroModel.curHeroInfo.heroId
            msg2.soldierId = this.heroModel.curHeroInfo.soldierId
            NetManager.send(msg2)
        })
    }

    _getShowSkillIds(data: icmsg.HeroCareerUpRsp) {
        let ids = []
        let curCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", data.careerId, { career_lv: data.careerLv })
        if (curCfg.ul_skill && curCfg.ul_skill.length > 0) {
            for (let i = 0; i < curCfg.ul_skill.length; i++) {
                let skillCfg = GlobalUtil.getSkillCfg(curCfg.ul_skill[i])
                if (skillCfg && skillCfg && skillCfg.show && skillCfg.show == 1) {
                    continue
                }
                ids.push(curCfg.ul_skill[i])
            }
        }
        return ids
    }

}