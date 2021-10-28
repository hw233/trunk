import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import { Hero_careerCfg, HeroCfg, SoldierCfg } from '../../../../../a/config';

/*
   //职业通用icon 
 * @Author: luoyong 
 * @Date: 2020-02-27 10:33:07 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-09-09 10:44:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/CareerIconItemCtrl")
export default class CareerIconItemCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    updateView(careerId: number, careerLv: number, soldierId: number) {
        let lv = careerLv ? careerLv : 1;
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: lv });
        if (careerCfg) {
            let heroCfg = ConfigManager.getItemById(HeroCfg, careerCfg.hero_id);
            GlobalUtil.setSpriteIcon(this.node, this.bg, `common/texture/role/select/group_${heroCfg.group[0]}`);
        }

        let cfg = ConfigManager.getItemById(SoldierCfg, soldierId);
        let iconPath = `view/role/texture/careerIcon/c_type_${cfg ? cfg.type : soldierId}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, iconPath);
    }

    hideIcon() {
        this.icon.active = false;
    }
}