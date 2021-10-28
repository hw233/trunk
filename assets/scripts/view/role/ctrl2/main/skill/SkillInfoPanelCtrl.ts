import { SkillCfg } from '../../../../../a/config';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import PanelId from '../../../../../configs/ids/PanelId';

const { ccclass, property, menu } = cc._decorator;


const typeColor = [null, cc.color("#FF7E30"), cc.color("#C7E364"), cc.color("#4FBECE"), cc.color("#D5CF69"), cc.color("#D856AF")];
@ccclass
@menu("qszc/view/role/SkillInfoPanelCtrl")
export default class SkillInfoPanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.RichText)
    descLabel: cc.RichText = null;

    @property(cc.Label)
    dmgLabel: cc.Label = null;

    @property(cc.Sprite)
    dmgIcon: cc.Sprite = null;

    @property(cc.Label)
    cdLabel: cc.Label = null;

    @property(cc.Node)
    mysticNode: cc.Node = null;

    @property(cc.Node)
    mysticSkillLab: cc.Node = null;

    //-1普攻伤害 0普通伤害 1火焰伤害 2辐射伤害 3冷冻伤害 4电力伤害 5穿刺伤害6治疗技能 7技能强化 8辅助技能 9天赋技能 10召唤技能 11 超绝技能 12神圣伤害
    typeText = [
        gdk.i18n.t("i18n:ROLE_TIP1"),
        gdk.i18n.t("i18n:ROLE_TIP2"),
        gdk.i18n.t("i18n:ROLE_TIP3"),
        gdk.i18n.t("i18n:ROLE_TIP4"),
        gdk.i18n.t("i18n:ROLE_TIP5"),
        gdk.i18n.t("i18n:ROLE_TIP6"),
        gdk.i18n.t("i18n:ROLE_TIP7"),
        gdk.i18n.t("i18n:ROLE_TIP8"),
        gdk.i18n.t("i18n:ROLE_TIP9"),
        gdk.i18n.t("i18n:ROLE_TIP10"),
        gdk.i18n.t("i18n:ROLE_TIP11"),
        gdk.i18n.t("i18n:ROLE_TIP12"),
        gdk.i18n.t("i18n:ROLE_TIP60"),
    ]


    onEnable() {

        let args = gdk.panel.getArgs(PanelId.SkillInfoPanel);
        if (args) {
            this.node.setPosition(args[0])
        }
    }

    /**显示技能信息 */
    showSkillInfo(skillId: number, lv?: number) {
        let info: any;
        let timeText = ''
        if (lv) {
            info = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, { level: lv });
        } else {
            info = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, null);
        }

        if (!info) return
        if (info.cd && info.cd > 0) {
            timeText = info.cd >= 999 ? '-' : `${info.cd}${gdk.i18n.t("i18n:HERO_TIP3")}`
        } else {
            timeText = "-"
        }
        this.cdLabel.string = timeText
        this.title = info.name;
        this.descLabel.string = "";
        this.descLabel.string = info.des || ""

        // if (this.descLabel.node.height > 102) {
        //     this.bg.height += this.descLabel.node.height - 102
        // }

        let type = info.dmg_type || 0;
        let typeName = gdk.i18n.t("i18n:HERO_TIP4");
        if (type >= 0) {
            typeName = this.typeText[type];
        }
        this.dmgLabel.string = typeName;
        if (type >= 1 && type <= 5) {
            let path = `icon/damage/${type}_n`;
            GlobalUtil.setSpriteIcon(this.node, this.dmgIcon, path);
            this.dmgLabel.node.color = typeColor[type];
        } else {
            this.dmgIcon.node.active = false;
        }

        //mystic
        this._updateMysticNode(skillId, lv);
    }

    _updateMysticNode(skillId: number, lv: number) {
        let cfgs = ConfigManager.getItemsByField(SkillCfg, 'skill_id', skillId);
        this.mysticNode.active = cfgs.length == 5;
        if (this.mysticNode.active) {
            let content = cc.find('content', this.mysticNode);
            content.removeAllChildren();
            let curLv = lv ? lv : 1;
            cfgs.forEach(c => {
                if (c.level !== 1) {
                    let item = cc.instantiate(this.mysticSkillLab);
                    item.parent = content;
                    item.active = true;
                    let lab = item.getComponent(cc.RichText);
                    let des2 = curLv < c.level ? c.des2.replace(/<.+?\/?/g, '') : c.des2;
                    let color = curLv < c.level ? '#66635A' : '#E3B677';
                    if (curLv == c.level) { color = '#7598e8'; }
                    lab.string = `<color=${color}>Lv.${c.level}:${des2}</c>`;
                }
            });
        }
    }
}
