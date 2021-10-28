

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role/RoleEliteAttTipsCtrl")
export default class RoleEliteAttTipsCtrl extends gdk.BasePanel {

    @property(cc.Label)
    nameLabs: Array<cc.Label> = []

    start() {

    }

    /**显示 精英属性  */
    showEliteAttr(heroAtt: icmsg.HeroAttr) {
        let names = [
            gdk.i18n.t("i18n:ROLE_TIP40"), gdk.i18n.t("i18n:ROLE_TIP41"),
            gdk.i18n.t("i18n:ROLE_TIP38"), gdk.i18n.t("i18n:ROLE_TIP39"),
            gdk.i18n.t("i18n:ROLE_TIP48"), gdk.i18n.t("i18n:ROLE_TIP42"),
            gdk.i18n.t("i18n:ROLE_TIP6"), gdk.i18n.t("i18n:ROLE_TIP43"),
            gdk.i18n.t("i18n:ROLE_TIP3"), gdk.i18n.t("i18n:ROLE_TIP44"),
            gdk.i18n.t("i18n:ROLE_TIP2"), gdk.i18n.t("i18n:ROLE_TIP45"),
            gdk.i18n.t("i18n:ROLE_TIP4"), gdk.i18n.t("i18n:ROLE_TIP46"),
            gdk.i18n.t("i18n:ROLE_TIP5"), gdk.i18n.t("i18n:ROLE_TIP47"),
        ]

        let keys = ["critV", "critVRes",
            "hitW", "dodgeW",
            "atkDmg", "atkRes",
            "dmgPunc", "puncRes",
            "dmgRadi", "radiRes",
            "dmgFire", "fireRes",
            "dmgCold", "coldRes",
            "dmgElec", "elecRes"]

        for (let index = 0; index < keys.length; index++) {
            let key = keys[index]
            let name = this.nameLabs[index]
            let addValue = name.node.getChildByName("attLab").getComponent(cc.Label);

            name.string = names[index]
            if (index != 2 && index != 3) {
                if (heroAtt[key] && heroAtt[key] > 0) {
                    addValue.string = `${(heroAtt[key] * 100 / 10000).toFixed(1)}%`
                } else {
                    addValue.string = "0.0%"
                }
            } else {
                let value = heroAtt[key];
                if (key == "hitW") {
                    value = heroAtt[key] + heroAtt["hitG"]
                } else if (key == "dodgeW") {
                    value = heroAtt[key] + heroAtt["dodgeG"]
                }
                addValue.string = `${value || 0}`
            }

        }
    }
}
