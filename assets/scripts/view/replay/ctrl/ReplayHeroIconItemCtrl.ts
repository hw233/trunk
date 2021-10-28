import ConfigManager from '../../../common/managers/ConfigManager';
import HeroUtils from '../../../common/utils/HeroUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Hero_starCfg, HeroCfg } from '../../../a/config';

/** 
 * 战斗回放界面英雄头像
 * @Author: sthoo.huang
 * @Date: 2020-05-14 10:22:38
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 19:50:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/replay/ReplayHeroIconItemCtrl")
export default class ReplayHeroIconItemCtrl extends gdk.ItemRenderer {

    @property(cc.Prefab)
    iconPrefab: cc.Prefab = null;

    @property(cc.Label)
    levelLb: cc.Label = null;

    @property(cc.Node)
    flag: cc.Node = null;

    icon: UiSlotItem;
    data: icmsg.FightBriefHero;

    updateView() {
        if (!this.data) return;
        if (!this.icon) {
            let node = cc.instantiate(this.iconPrefab);
            node.scaleX = node.scaleY = 0.9
            this.node.addChild(node, -1);
            this.icon = node.getComponent(UiSlotItem);
        }

        // 英雄头像
        let cfg = ConfigManager.getItemById(HeroCfg, this.data.typeId);
        let icon: string = HeroUtils.getHeroHeadIcon(this.data.typeId, this.data.star, false)//`icon/hero/${cfg.icon}_s`;
        this.icon.updateItemIcon(icon);
        this.icon.updateQuality(ConfigManager.getItemByField(Hero_starCfg, 'star', this.data.star).color);
        this.levelLb.string = this.data.level.toString();

        // 更新星星
        if (cfg) {
            this.icon.updateStar(
                this.data.star,
                cfg.star_max,
                false,
            );
        } else {
            this.icon.updateStar(0);
        }

        // 标记自己是否有此英雄
        this.flag.active = !!HeroUtils.getHeroItemById(this.data.typeId);
    }
}