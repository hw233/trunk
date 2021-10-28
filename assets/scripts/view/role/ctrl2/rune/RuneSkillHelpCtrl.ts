import ConfigManager from '../../../../common/managers/ConfigManager';
import { TipsCfg } from '../../../../a/config';
/**
  * @Author: jiangping
  * @Description:
  * @Date: 2020-10-10 10:39:10
  */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneSkillHelpCtrl")
export default class RuneSkillHelpCtrl extends gdk.BasePanel {
    @property(cc.RichText)
    tips: cc.RichText = null;

    onEnable() {
        this.tips.string = ConfigManager.getItemById(TipsCfg, 47).desc21;
    }

    onDisable() {
    }
}
