import ConfigManager from '../../../common/managers/ConfigManager';
import HeroDetailViewCtrl from './HeroDetailViewCtrl';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { HBItemType } from './HBViewCtrl';
import { Hero_careerCfg, Hero_starCfg } from '../../../a/config';

/** 
 * @Description: 英雄图鉴子项
 * @Author: weiliang.huang  
 * @Date: 2019-05-28 11:32:24 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-02 15:55:15
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HBItemCtrl")
export default class HBItemCtrl extends cc.Component {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    mask: cc.Node = null

    info: HBItemType = null

    updateView(data) {
        this.info = data
        let cfg = this.info.cfg
        // GlobalUtil.setSpriteIcon(this.node, this.iconBg, `common/texture/sub_itembg0${cfg.color}`)
        // this.nameLab.string = cfg.name
        // let icon = GlobalUtil.getIconById(cfg.id, BagType.HERO)
        // GlobalUtil.setSpriteIcon(this.node, this.icon, icon)
        let ctrl = this.slot.getComponent(UiSlotItem)
        ctrl.group = this.info.cfg.group[0];
        ctrl.starNum = this.info.cfg.star_min;
        ctrl.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', cfg.career_id).career_type;
        ctrl.career = 0;
        ctrl.updateItemInfo(this.info.cfg.id)
        this.mask.active = !this.info.geted
        let maxCareerLv = ConfigManager.getItemById(Hero_starCfg, cfg.star_max).career_lv;
        let maxLv = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', cfg.career_id, { career_lv: maxCareerLv }).hero_lv;
        this.lvLab.string = maxLv + '';
    }

    /** 子项点击 */
    itemClick() {
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(this.info.cfg, this.info)
        })
    }
}
