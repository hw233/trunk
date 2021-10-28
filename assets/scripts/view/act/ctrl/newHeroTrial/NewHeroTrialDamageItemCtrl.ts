import UiListItem from '../../../../common/widgets/UiListItem';

/** 
 * @Description: 英雄试炼排行榜Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-26 14:18:39
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/newHeroTrial/NewHeroTrialDamageItemCtrl")
export default class NewHeroTrialDamageItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    dmgLabel: cc.Label = null;

    nameStrs: string[] = [gdk.i18n.t("i18n:NEWHEROTRIAL_DAMAGE_TIP1"),
    gdk.i18n.t("i18n:NEWHEROTRIAL_DAMAGE_TIP2"),
    gdk.i18n.t("i18n:NEWHEROTRIAL_DAMAGE_TIP3"),
    gdk.i18n.t("i18n:NEWHEROTRIAL_DAMAGE_TIP4"),
    gdk.i18n.t("i18n:NEWHEROTRIAL_DAMAGE_TIP5")]
    damage: number = 0;
    index: number = 0;
    updateView() {
        this.index = this.data.index;
        this.damage = this.data.damage;
        this.nameLabel.string = this.nameStrs[this.index];
        this.dmgLabel.string = this.damage + '';

    }



}
