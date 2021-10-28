import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import { SkillCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

//-1普攻伤害 0普通伤害 1火焰伤害 2辐射伤害 3冷冻伤害 4电力伤害 5穿刺伤害6治疗技能 7技能强化 8辅助技能 9天赋技能 10召唤技能 11 超绝技能
const typeText = [
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
]
@ccclass
@menu("qszc/view/role/RoleSkillTipsCtrl")
export default class RoleSkillTipsCtrl extends gdk.BasePanel {

    @property(cc.Node)
    skillIcon: cc.Node = null;

    @property(cc.RichText)
    descLab1: cc.RichText = null;

    @property(cc.RichText)
    descLab2: cc.RichText = null;

    @property(cc.Label)
    typeLab: cc.Label = null;

    @property(cc.Label)
    cdLab: cc.Label = null;

    @property(cc.Sprite)
    skillBg: cc.Sprite = null;
    // onLoad () {}

    start() {

    }

    /**显示技能信息 */
    showSkillInfo(skillId: number) {
        let info: any;
        let timeText = ''
        info = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, null);
        if (!info) return
        if (info.cd && info.cd > 0) {
            timeText = `${info.cd}${gdk.i18n.t("i18n:HERO_TIP3")}`
        } else {
            timeText = "-"
        }
        this.cdLab.string = timeText
        //设置技能背景框图片
        let bgPath = HeroUtils.isCardSkill(skillId) ? "common/texture/career/sub_skillbg2" : "common/texture/career/sub_skillbg";
        GlobalUtil.setSpriteIcon(this.node, this.skillBg, bgPath);
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillId))
        this.title = info.name
        let type = info.dmg_type || 0
        let typeName = gdk.i18n.t("i18n:HERO_TIP4")
        if (type >= 0) {
            typeName = typeText[type]
        }
        this.typeLab.string = typeName
        //this.descLab1.string = info.des1 || ""
        this.descLab2.string = info.des || ""
    }
}
