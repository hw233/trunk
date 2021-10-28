import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from '../utils/GlobalUtil';
import HeroModel from '../models/HeroModel';
import HeroUtils, { UnlockSkillType } from '../utils/HeroUtils';
import ModelManager from '../managers/ModelManager';
import PanelId from '../../configs/ids/PanelId';
import RoleSkillTipsCtrl from '../../view/role/ctrl2/common/RoleSkillTipsCtrl';
import { Hero_careerCfg, SkillCfg } from '../../a/config';

/** 
 * 技能图标项
 * @Author: sthoo.huang  
 * @Date: 2019-11-14 10:28:04 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-05 14:18:38
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/SkillItem")
export default class SkillItem extends cc.Component {

    @property(cc.Label)
    unlockTips: cc.Label = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    unclockImg: cc.Node = null

    @property(cc.Label)
    skillName: cc.Label = null;

    @property(cc.Node)
    super: cc.Node = null;

    @property(cc.Sprite)
    skillBg: cc.Sprite = null;

    skillInfo: UnlockSkillType;
    skillCfg: SkillCfg;

    get heroModel() { return ModelManager.get(HeroModel); }
    set model(skillInfo: UnlockSkillType) { this.updateSkillInfo(skillInfo); }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._itemClick, this);
        this.updateSkillInfo(this.skillInfo);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._itemClick, this);
        GlobalUtil.setSpriteIcon(this.node, this.icon, null);
    }

    updateSkillInfo(info: UnlockSkillType) {
        this.skillInfo = info;
        if (!info) return;
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        //设置技能背景框图片
        let bgPath = HeroUtils.isCardSkill(info.skillId) ? "common/texture/career/sub_skillbg2" : "common/texture/career/sub_skillbg";
        GlobalUtil.setSpriteIcon(this.node, this.skillBg, bgPath);
        // 读取配置
        this.skillCfg = ConfigManager.getItemByField(
            SkillCfg,
            "skill_id",
            info.skillId,
            { level: info.skillLv || 1 },
        );
        this.super.active = this.skillCfg.type == 501;
        // 更新锁状态
        let careerId = info.careerId;
        let text = ""
        if (careerId != void 0) {
            let unlockLv = info.unlockLv;
            if (unlockLv == undefined) {
                unlockLv = 1;
            }
            let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", info.careerId, null);
            let heroModel = this.heroModel;
            let curHero = heroModel.curHeroInfo;
            // 是否已解锁
            let unLock = false;
            if (unlockLv === -1) {
                unLock = true;
            } else if (heroModel.heroImage) {
                unLock = heroModel.heroImage.skills.indexOf(info.skillId) != -1;
            } else {
                let panel = gdk.panel.get(PanelId.HeroDetail)
                if (panel) {
                    unLock = true
                } else {
                    if (curHero) {
                        unLock = HeroUtils.heroHasSkill(curHero.heroId, info.skillId);
                    }
                }
            }
            if (!unLock) {
                // if (unlockLv > 0) {
                //     let desc = gdk.i18n.t("i18n:ROLE_SKILL_UNLOCK2")
                //     text = StringUtils.replace(desc, "@name", cfg.name)
                //     text = StringUtils.replace(text, "@level", `${unlockLv}`)
                // } else {
                //     let desc = gdk.i18n.t("i18n:ROLE_SKILL_UNLOCK1")
                //     text = StringUtils.replace(desc, "@name", cfg.name)
                // }
                // if (cfg.rank == 1) {
                //     text = `职业中级开启`;
                // } else {
                //     text = `职业高级开启`;
                // }
                GlobalUtil.setGrayState(this.icon, 1);
            } else {
                GlobalUtil.setGrayState(this.icon, 0);
            }
            this.unclockImg.active = !unLock;
        } else {
            this.unclockImg.active = false;
        }
        this.unlockTips.string = text;
        if (this.unclockImg.active) {
            this.skillName.string = "";
        } else {
            this.skillName.string = this.skillCfg.name;
        }
        // 更新技能图标
        GlobalUtil.setSpriteIcon(this.node, this.icon, 'icon/skill/' + this.skillCfg.icon);
    }

    updateSize(w: number = 0, h: number = 0) {
        if (w > 0) {
            this.node.width = w;
            this.icon.width = w - 2;
        }
        if (h > 0) {
            this.node.height = h;
            this.icon.height = h - 2;
        }
    }

    _itemClick() {
        gdk.panel.open(PanelId.RoleSkillTips, (node: cc.Node) => {
            let comp = node.getComponent(RoleSkillTipsCtrl);
            if (this.skillCfg) {
                comp.showSkillInfo(this.skillCfg.skill_id);
            }
        });
    }
}
