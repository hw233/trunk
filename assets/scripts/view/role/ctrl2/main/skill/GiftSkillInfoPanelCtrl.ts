import ConfigManager from '../../../../../common/managers/ConfigManager';
import StringUtils from '../../../../../common/utils/StringUtils';
import { Hero_starCfg, SkillCfg } from '../../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role/GiftSkillInfoPanelCtrl")
export default class GiftSkillInfoPanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Label)
    skillName: cc.Label = null;
    @property(cc.RichText)
    descLabel: cc.RichText = null;

    @property(cc.Node)
    layoutNode: cc.Node = null;
    @property([cc.RichText])
    giftLvs: cc.RichText[] = []

    showSkillInfo(skillId: number, lv: number) {

        let curCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, { level: lv });
        let firstCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, { level: 1 });
        this.skillName.string = curCfg.name + 'Lv.' + lv
        this.descLabel.string = firstCfg.des;

        let cfgs = ConfigManager.getItems(SkillCfg, (item: SkillCfg) => {
            if (item.skill_id == skillId && item.level > 1) {
                return true
            }
            return false;
        })
        this.giftLvs.forEach((lvText, index) => {
            if (cfgs.length > index) {
                lvText.node.active = true;
                let skillCfg = cfgs[index];
                let temCfg = ConfigManager.getItemByField(Hero_starCfg, 'gift_lv', skillCfg.level);
                let temStr = StringUtils.format(gdk.i18n.t("i18n:ROLE_GIFT_SKILLINFO_TIP1"), temCfg.star) + skillCfg.des;//'英雄' + temCfg.star + '星激活:' + skillCfg.des;
                let re = /[a-zA-Z0-9#]{7}/g
                if (skillCfg.level < lv) {
                    temStr = temStr.replace(re, '#F1EAEA')
                    lvText.node.color = cc.color('#F1EAEA')
                } else if (skillCfg.level == lv) {
                    temStr = temStr.replace(re, '#2DAEF1')
                    lvText.node.color = cc.color('#2DAEF1')
                } else {
                    temStr = temStr.replace(re, '#9D9898')
                    lvText.node.color = cc.color('#9D9898')
                }
                lvText.string = temStr//'英雄' + temCfg.star + '星激活:' + skillCfg.des;

            } else {
                lvText.node.active = false;
            }
        })
        // gdk.Timer.once(15, this, () => {
        //     this.bg.height = this.layoutNode.height + 120
        // })

    }


    onDisable() {
        gdk.Timer.clearAll(this)
    }

}
