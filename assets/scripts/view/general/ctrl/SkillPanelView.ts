import * as vm from '../../../a/vm';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils, { UnlockSkillType } from '../../../common/utils/HeroUtils';
import SkillItem from '../../../common/widgets/SkillItem';
import { Hero_careerCfg, HeroCfg, SkillCfg } from '../../../a/config';
import { RoleEventId } from '../../role/enum/RoleEventId';

/**
 * @Description: 属性界面技能面板项
 * @Author: rongfeng.xie
 * @Date: 2019-09-20 11:42:26
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-05 14:23:01
 */

const { ccclass, property, menu } = cc._decorator;

export class SkillPanelModel {

    @vm.mutable
    skillType: number = 0;

    @vm.mutable
    heroInfo: icmsg.HeroInfo = null;

    @vm.mutable
    heroDetail: icmsg.HeroDetail = null;

    _heroCfg: HeroCfg;
    get heroCfg(): HeroCfg {
        if (this.heroInfo && (!this._heroCfg || this._heroCfg.id != this.heroInfo.typeId)) {
            this._heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        }
        return this._heroCfg;
    }
}

@ccclass
@menu("qszc/view/role/SkillPanelView")
export default class SkillPanelView extends cc.Component {

    model: SkillPanelModel = new SkillPanelModel();

    @vm.each(cc.Button, "skillType", {
        setter: (btn: cc.Button, index: number, m: SkillPanelModel) => {
            let active = index == m.skillType
            btn.node.children[1].active = active;
            let labelNode = btn.node.children[2];
            labelNode.color = active ? cc.color("#F9E9A2") : cc.color("#C8B18A");
            labelNode.getComponent(cc.LabelOutline).color = active ? cc.color("#715223") : cc.color("#563F1D");
        }
    })
    buttons: cc.Button[] = [];

    @property(cc.Label)
    giftName: cc.Label = null;

    @property(cc.RichText)
    giftDesc: cc.RichText = null;

    @property(cc.Sprite)
    giftIcon: cc.Sprite = null;

    @property(cc.Sprite)
    giftBg: cc.Sprite = null;

    @vm.bind(cc.Label, "heroInfo", function (m: SkillPanelModel) {
        return (m.heroInfo && m.heroCfg.career_id == m.heroInfo.careerId) ? "职业路线" : "技能";
    })
    careerTitle: cc.Label = null;
    @vm.list([cc.Node, "skillItem"], ["heroInfo", "skillType", "heroDetail"], {
        getter: function (m: SkillPanelModel) {
            let heroCfg = m.heroCfg;
            if (m.heroInfo && heroCfg.career_id == m.heroInfo.careerId) {
                // let list: CareerItemModel[] = [];
                // let line1 = ConfigManager.getItemByField(Hero_careerCfg, "career_pre", heroCfg.career_id, { line: 1 });
                // let line2 = ConfigManager.getItemByField(Hero_careerCfg, "career_pre", heroCfg.career_id, { line: 2 });
                // if (line1) list.push(new CareerItemModel(m, line1, true));
                // if (line2) list.push(new CareerItemModel(m, line2, true));
                // return list;
                let list: UnlockSkillType[] = []
                let line1 = ConfigManager.getItemByField(Hero_careerCfg, "career_pre", heroCfg.career_id, { line: 1 });
                if (line1) {
                    return HeroUtils.getCareerLineSkills(line1.career_id, m.skillType)
                }
            }
            return null;
        },
        setter: function ([node, prefab]: [cc.Node, cc.Prefab], array: UnlockSkillType[]) {
            let length = array.length;
            let layout = node.getComponent(cc.Layout);
            if (length <= 4) {
                layout.spacingX = 70;
            } else {
                layout.spacingX = 30;
            }
            node.destroyAllChildren();
            for (let i = 0; i < length; i++) {
                let item = cc.instantiate(prefab);
                let cfg = GlobalUtil.getSkillCfg(array[i].skillId)
                if (cfg && cfg.show != 1) {
                    item.getComponent(SkillItem).model = array[i];
                    item.children[item.children.length - 1].active = false;
                    item.parent = node;
                }
            }
        }
    })
    careerList: cc.Node = null;

    @property(cc.Prefab)
    skillItem: cc.Prefab = null;//SkillItem

    @vm.list([cc.Node, "skillItem"], ["heroDetail", "skillType"], {
        getter: function (m: SkillPanelModel) {
            let heroInfo = m.heroInfo;
            let heroCfg = m.heroCfg;
            if (heroInfo && heroCfg.career_id != heroInfo.careerId) {
                if (!m.heroDetail) {
                    return [];
                }
                let line = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroInfo.careerId).line;
                let careerId = ConfigManager.getItemByField(Hero_careerCfg, "career_pre", heroCfg.career_id, { line: line }).career_id;
                return HeroUtils.getCareerLineSkills(careerId, m.skillType);
            }
            return null;
        },
        setter: function ([node, prefab]: [cc.Node, cc.Prefab], array: UnlockSkillType[]) {
            let length = array.length;
            let layout = node.getComponent(cc.Layout);
            if (length <= 4) {
                layout.spacingX = 70;
            } else {
                layout.spacingX = 30;
            }
            node.destroyAllChildren();
            // node.removeAllChildren()
            for (let i = 0; i < length; i++) {
                let item = cc.instantiate(prefab);
                let cfg = GlobalUtil.getSkillCfg(array[i].skillId)
                if (cfg && cfg.show != 1) {
                    if (item) {
                        item.getComponent(SkillItem).model = array[i];
                        item.children[item.children.length - 1].active = false;
                        item.parent = node;
                    } else {
                        cc.debug && cc.log("技能面板技能初始化失败")
                    }
                }
            }
        }
    })
    skillList: cc.Node = null;

    onEnable() {
        gdk.e.on(RoleEventId.UPDATE_HERO_ATTR, function (event) {
            if (this.model) {
                let heroId = event.data;
                if (heroId == this.model.heroInfo.heroId && !this.model.heroDetail) {
                    this.model.heroDetail = HeroUtils.getHeroDetailById(heroId);
                }
            }
        }, this);

    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    onBtnClick(e, skillType: number) {
        this.model.skillType = skillType;
    }

    @vm.observe(["skillType", "heroInfo"])
    showHeroGift() {
        let skillType = this.model.skillType;
        let heroCfg = this.model.heroCfg;
        if (!heroCfg) return
        let gift1 = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id, { level: this.model.heroInfo.star });
        if (!gift1) {
            gift1 = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id)
        }
        this.giftName.string = gift1.name;
        this.giftDesc.string = gift1.des;
        GlobalUtil.setSpriteIcon(this.node, this.giftIcon, 'icon/skill/' + gift1.icon);
        //设置天赋背景框图片
        let bgPath = skillType == 0 ? "common/texture/sub_tianfubg" : "common/texture/sub_tianfubg2";
        GlobalUtil.setSpriteIcon(this.node, this.giftBg, bgPath);
    }

}
