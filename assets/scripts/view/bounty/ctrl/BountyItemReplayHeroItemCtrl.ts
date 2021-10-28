import ConfigManager from '../../../common/managers/ConfigManager';
import HeroUtils from '../../../common/utils/HeroUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Hero_starCfg, HeroCfg } from '../../../a/config';

/** 
 * 战斗回放界面英雄头像
 * @Author: sthoo.huang
 * @Date: 2020-05-14 10:22:38
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-19 14:11:30
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bounty/BountyItemReplayHeroItemCtrl")
export default class BountyItemReplayHeroItemCtrl extends gdk.ItemRenderer {

    @property(cc.Prefab)
    iconPrefab: cc.Prefab = null;

    @property(cc.Label)
    levelLb: cc.Label = null;

    icon: UiSlotItem;
    data: icmsg.FightHero;

    updateView() {
        if (!this.data) return;
        if (!this.icon) {
            let node = cc.instantiate(this.iconPrefab);
            node.scaleX = node.scaleY = 0.9
            this.node.addChild(node, -1);
            this.icon = node.getComponent(UiSlotItem);
        }

        // 英雄头像
        let cfg = ConfigManager.getItemById(HeroCfg, this.data.heroType);
        let icon: string = HeroUtils.getHeroHeadIcon(this.data.heroType, this.data.heroStar, false)
        this.icon.updateItemIcon(icon);
        this.icon.updateQuality(ConfigManager.getItemByField(Hero_starCfg, 'star', this.data.heroStar).color);
        this.levelLb.string = this.data.heroLv.toString();
        this.icon.lvLab.getComponent(cc.Label).string = ``

        // 更新星星
        if (cfg) {
            this.icon.updateStar(
                this.data.heroStar,
                cfg.star_max,
                false,
            );
        } else {
            this.icon.updateStar(0);
        }
    }
}