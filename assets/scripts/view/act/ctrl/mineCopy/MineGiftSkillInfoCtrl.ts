import ConfigManager from '../../../../common/managers/ConfigManager';
import StringUtils from '../../../../common/utils/StringUtils';
import { Activitycave_giftCfg, Copy_hardcoreCfg, SkillCfg } from '../../../../a/config';

/** 
 * @Description: 矿洞大作战天赋Item
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-15 10:23:47
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineGiftSkillInfoCtrl")
export default class MineGiftSkillInfoCtrl extends gdk.BasePanel {


    @property(cc.RichText)
    descLabel: cc.RichText = null;

    @property(cc.Node)
    nextNode: cc.Node = null;
    @property(cc.Label)
    nextTitle: cc.Label = null;
    @property(cc.RichText)
    nextDescLabel: cc.RichText = null;

    @property(cc.Node)
    upBtn: cc.Node = null;
    @property(cc.Node)
    resetBtn: cc.Node = null;

    upCall: Function;
    arg: any;
    cfg: Activitycave_giftCfg;
    /**显示技能信息 */
    showSkillInfo(cfg: Activitycave_giftCfg, lv: number, upCall?: Function, arg?: any) {

        this.upCall = upCall
        this.arg = arg
        this.cfg = cfg;
        let info: any;
        let hardCfg = ConfigManager.getItemById(Copy_hardcoreCfg, cfg.skill[0])
        let skillId = hardCfg.data[1];
        this.nextNode.active = true;
        this.nextDescLabel.node.active = true;
        this.upBtn.active = false;
        if (lv < 0) {
            this.nextTitle.string = gdk.i18n.t("i18n:MINECOPY_GIFTSKILL_TIP1")
            let str = ''
            if (cfg.total_gift > 0) {
                str = str + StringUtils.format(gdk.i18n.t("i18n:MINECOPY_GIFTSKILL_TIP2"), cfg.total_gift)//`累计消耗${cfg.total_gift}天赋点\n`
            }
            let i = 0;
            if (cfg.pre_gift.length > 0) {
                cfg.pre_gift.forEach(data => {
                    let temCfg = ConfigManager.getItemByField(Activitycave_giftCfg, 'gift', data[0]);
                    str = str + StringUtils.format(gdk.i18n.t("i18n:MINECOPY_GIFTSKILL_TIP3"), temCfg.name, data[1]) + (i > 0 ? '\n' : '')//`${temCfg.name}需要升级到${data[1]}级` + (i > 0 ? '\n' : '')
                });
            }
            this.nextDescLabel.string = '<outline color=#3e1b16 width=2>' + str + '</outline>';

        } else if (lv >= cfg.limit) {
            //this.nextNode.active = false;
            //this.nextDescLabel.node.active = false;
            this.nextTitle.string = ''
            this.nextDescLabel.string = ''
        } else {
            this.nextTitle.string = gdk.i18n.t("i18n:MINECOPY_GIFTSKILL_TIP4")//'下级效果：';
            let nextInfo = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, { level: lv + 1 });
            this.nextDescLabel.string = nextInfo ? '<outline color=#3e1b16 width=2>' + nextInfo.des + '</outline>' : "";
            this.upBtn.active = true;
        }

        let temLv = lv > 0 ? lv : 1;
        info = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, { level: temLv });

        if (!info) return

        this.title = cfg.name//info.name;
        this.descLabel.string = "";
        this.descLabel.string = '<outline color=#3e1b16 width=2>' + info.des + '</outline>' || ""

        // if (this.descLabel.node.height > 102) {
        //     this.bg.height += this.descLabel.node.height - 102
        // }
    }

    //重置按钮点击事件
    resetBtnClick() {

    }

    //升级按钮点击事件
    upSkillBtnClick() {
        if (this.upCall && this.arg) {
            this.upCall.call(this.arg);
        }
    }

    onDisable() {
        this.arg = null;
        this.upCall = null;
    }
}
