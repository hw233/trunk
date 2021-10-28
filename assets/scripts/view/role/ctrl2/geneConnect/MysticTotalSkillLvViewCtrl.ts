import ConfigManager from '../../../../common/managers/ConfigManager';
import { Hero_undersand_levelCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-18 10:14:55 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-18 10:24:19
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/MysticTotalSkillLvViewCtrl")
export default class MysticTotalSkillLvViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.RichText)
    attrLab: cc.RichText = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    onEnable() {
        let totalLv = this.args[0];
        let cfg = ConfigManager.getItemByField(Hero_undersand_levelCfg, 'mystery_skill', totalLv);
        this.nameLab.string = `技能领悟Lv.${cfg.undersand_level}`;
        this.attrLab.string = `神秘者英雄全属性+<color=#00ff00>${Math.floor(cfg.desc / 100)}%</c>`;
    }
}
